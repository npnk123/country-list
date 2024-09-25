import fetchCountry from "@/services/countryList";
import { useState, useEffect } from "react";
import uuid from "react-uuid";
import { Link } from "react-router-dom";
import { CountryItem } from "@/services/countryList.type";
import Footer from "@/component/Footer/Footer";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import "react-modern-drawer/dist/index.css";
import Swal from "sweetalert2";
import { FaHeart } from "react-icons/fa";

const Homepage = () => {
  const [data, setData] = useState<CountryItem[]>([]);
  const [word, setWord] = useState("");
  const [favorites, setFavorites] = useState<CountryItem[]>([]); // For holding the favorites list
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer state
  const [isHovering, setIsHovering] = useState(false); // Track if user is hovering over button or drawer

  const CallData = async () => {
    const fetchedData = await fetchCountry();
    setData(fetchedData);
  };

  // Load countries and fetch favorites from localStorage when component mounts
  useEffect(() => {
    CallData();
    loadFavorites(); // Load favorites from localStorage
  }, []);

  // Load favorites from localStorage
  const loadFavorites = () => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
  };

  const searchCountry = data.filter((item) => {
    const groupFilter = [
      ...(item.capital || []),
      item.name.common,
      item.region,
    ];
    return groupFilter.some((v) =>
      v.toLowerCase().includes(word.toLowerCase())
    );
  });

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat().format(number);
  };

  // Add country to favorites
  const addFav = (country: CountryItem) => {
    let currentFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    if (
      !currentFavorites.some(
        (fav: { ccn3: string }) => fav.ccn3 === country.ccn3
      )
    ) {
      currentFavorites.push(country);
      localStorage.setItem("favorites", JSON.stringify(currentFavorites));
      setFavorites(currentFavorites); // Update state to reflect new favorites list
      setIsDrawerOpen(true);
      Swal.fire({
        title: "Added to Favorites!",
        text: `${country.name.common} has been added to your favorites.`,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Already in Favorites!",
        text: `${country.name.common} is already in your favorites.`,
        icon: "info",
      });
    }
  };

  const removeFav = (ccn3: string) => {
    let currentFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    const countryToRemove = currentFavorites.find(
      (fav: CountryItem) => fav.ccn3 === ccn3
    );

    const updatedFavorites = currentFavorites.filter(
      (fav: CountryItem) => fav.ccn3 !== ccn3
    );
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites); // Update state after removal

    if (countryToRemove) {
      Swal.fire({
        title: "Removed from Favorites!",
        text: `${countryToRemove.name.common} has been removed from your favorites.`,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Country not found in favorites.",
        icon: "error",
      });
    }
  };

  // Function to toggle the drawer open/close
  const openDrawer = () => {
    setIsDrawerOpen(true);
    setIsHovering(true); // Track hover state to avoid flashing
  };
  const closeDrawerWithDelay = () => {
    setTimeout(() => {
      if (!isHovering) {
        setIsDrawerOpen(false);
      }
    }, 200); // Delay for smooth closing
  };

  return (
    <div className="w-[90%] m-[auto] max-w-[1100px]">
      <div className="flex justify-end mt-2">
        <button
          onMouseEnter={openDrawer} // Open drawer on hover
          onMouseLeave={() => setIsHovering(false)} // Close drawer when hover ends
          // onClick={toggleDrawer}
          className="text-white text-xl bg-red-500 px-4 py-2 rounded"
        >
          {/* {isDrawerOpen ? "Close Favorites" : "Show Favorites"} */}
          <FaHeart />
        </button>
      </div>
      <div className="flex justify-center">
      <img className="w-[175px] h-[150px] animate-bounce"
          src="./flag_ball.png"
          alt="flagball"
      />
      </div>
      <div className="flex justify-center p-5 text-4xl font-bold text-black dark:text-gray-400 text-left">
        
        <div>Country of the World</div>
      </div>

      {/* Search Input */}
      <div className="mb-3 bg-gray-400 capitalize border rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        <label htmlFor="search-form">
          <input
            type="text"            
            placeholder="Country Name or Capital City or Region Search"
            className="text-xl text-black block w-full p-2.5"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
        </label>
      </div>

      {/* Drawer to display the favorites */}
      <Drawer
        open={isDrawerOpen}
        onClose={closeDrawerWithDelay}
        // onClose={toggleDrawer}
        direction="right"
        size={350}
        style={{ padding: "20px" }}
      >
        <h3 className="text-2xl font-bold mb-4 text-green-500">
          Favorite Countries
        </h3>
        {favorites.length === 0 ? (
          <p className="text-xl">No favorites :(</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {favorites.map((fav: CountryItem) => (
              <div
                key={fav.ccn3}
                className="bg-white p-3 border border-gray-300 rounded-lg shadow"
              >
                <h5 className="text-xl font-bold text-blue-600">
                  {fav.name.common}
                </h5>
                <p>Capital: {fav.capital?.[0]}</p>
                <p>Region: {fav.region}</p>
                <p>Population: {formatNumber(fav.population)}</p>
                {/* Remove from favorites button */}
                <button
                  onClick={() => removeFav(fav.ccn3)}
                  className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mt-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </Drawer>

      {/* Country List */}
      <div className="p-0 grid grid-cols-4 gap-4 justify-center">
        {searchCountry.map((item) => (
          <div key={uuid()}>
            <div className="h-[50vh] p-3 bg-white border border-gray-200 rounded-lg shadow">
              <Link to={`/detail/${item.ccn3}`}>
                <img
                  className="[border-image:linear-gradient(to_top_right,#000,#000)_30] border-2 border-solid border-transparent bg-white h-[144px] w-full"
                  src={item.flags.png}
                  alt="flag"
                />
              </Link>
              <div className="p-1">
                <h5 className="mb-0 text-xl font-bold tracking-tight text-gray-900 text-center">
                  {item.name.common}
                </h5>
                <hr className="w-48 h-1 mx-auto my-4 bg-black border-0 rounded"></hr>
                <p className="mb-0 text-base font-bold tracking-tight text-gray-900 text-center">
                  Capital City: {item.capital?.[0]}
                  <br />
                  Region: {item.region}
                  <br />
                  Population: {formatNumber(item.population)}
                </p>
              </div>
              <div className="text-center">
                <button
                  onClick={() => addFav(item)}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Add to favorite
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Homepage;
