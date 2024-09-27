import axios from "axios";
import { CountryItem, Currency } from "@/services/countryList.type";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import uuid from "react-uuid";
import { Link } from "react-router-dom";

type CountryType = {
  data: CountryItem[] | undefined;
  loading: boolean;
  error: null | any;
};

const Detailpage = () => {
  const { code } = useParams<{ code: string }>();

  const [country, setCountry] = useState<CountryType>({
    data: undefined,
    loading: true,
    error: null,
  });

  const callData = async (code: string) => {
    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/alpha/${code}`
      );
      if (response.status === 200 && response.data) {
        setCountry({
          data: response.data, // response.data should be an array of countries
          loading: false,
          error: null,
        });
      }
    } catch (error: any) {
      setCountry({
        data: undefined,
        loading: false,
        error: error.message || "Something went wrong!",
      });
    }
  };

  useEffect(() => {
    if (code) {
      callData(code);
    }
  }, [code]);

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat().format(number);
  };

  const getCurrencies = (currencies: Currency): Currency[] => {
    return Object.values(currencies);
  };

  <div>Loading...</div>;
  if (country.loading)
    return (
      <div className="h-[600px] flex justify-center items-center">
        <ReactLoading type="spin" color="#fff" />
      </div>
    );
  if (country.error) return <div>Error: {country.error}</div>;

  return (
    <div className="w-[90%] m-[auto]">
      <Link to={`/`}>
      <div className="text-right p-4 mt-4 mr-10">
                <button
                  type="button"
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  Back to main page
                </button>
              </div>
      </Link>
      <div className="flex justify-center">
        {country.data &&
          country.data.map((item: CountryItem) => (
            <div key={uuid()}>
              <div className="flex justify-center">
                <h5 className="mb-4 p-2 text-5xl font-bold tracking-tight text-gray-900 text-center">
                  {item.name.common}
                </h5>
              </div>
              <div className="flex justify-center">
                <img
                  className="border-2 border-solid h-[150px] w-[300px]"
                  src={item.flags?.png}
                  alt={`${item.name.common} Flag`}
                />
              </div>
              {/* <div className="flex justify-center">
                  <img
                    className="border-2 border-solid h-[150px] w-[300px]"
                    src={item.coatOfArms?.png}
                    alt={`${item.name.common} Flag`}
                  />
                </div> */}
              <div className="flex flex-col p-4 w-[500px]">
                <p className="mb-3 text-2xl font-bold text-black dark:text-gray-400 text-left">
                  Capital: {item.capital?.[0] || "N/A"}
                </p>
                <p className="mb-3 text-2xl font-bold text-black dark:text-gray-400 text-left">
                  Region: {item.region}
                </p>
                <p className="mb-3 text-2xl font-bold text-black dark:text-gray-400 text-left">
                  Currencies:{" "}
                  {getCurrencies(item.currencies).map((currency) => (
                    <span key={currency.name}>
                      {currency.name} ({currency.symbol})
                    </span>
                  ))}
                </p>

                <p className="mb-3 text-2xl font-bold text-black dark:text-gray-400 text-left">
                  Area: {formatNumber(item.area)} SQ.M.
                </p>
                <p className="mb-3 text-2xl font-bold text-black dark:text-gray-400 text-left">
                  Timezone: {item.timezones.join(", ")}
                </p>
                <p className="mb-3 text-2xl font-bold text-black dark:text-gray-400 text-left">
                  Population: {formatNumber(item.population)}
                </p>
              </div>
              <div className="flex justify-center">
                <iframe
                  className="flex w-[500px] h-[400px]"
                  src={`https://maps.google.com/maps?q=${item.latlng[0]},${item.latlng[1]}&hl=en&z=4&output=embed`}
                  title={`${item.name.common} Map`}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default Detailpage;
