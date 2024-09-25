import fetchCountry from "@/services/countryList";
import uuid from "react-uuid";
import { useState, useEffect } from "react";


const CountryCard = () => {
  const [data, setData] = useState([]);

  const CallData = async () => {
    const fetchedData = await fetchCountry();
    console.log("data", fetchedData);
    setData(fetchedData);
  };

  useEffect(() => {
    CallData();
  }, []);

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat().format(number);
  };

  return (
    <div className="p-0 grid grid-cols-4 gap-4 justify-center">
    {data.map((item: any) => (
      <div key={uuid()}>            
        <div className="h-[50vh] p-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        
          <a href="#">
            <img
              className="[border-image:linear-gradient(to_top_right,#000,#000)_30] border-2 border-solid border-transparent bg-white h-[144px] w-full"
              src={item.flags.png}
              alt="flag"
            />
          </a>  
              
          <div className="p-1">
            <a href="#">
              <h5 className="mb-0 text-xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                {item.name.common}
              </h5>
              <hr className="w-48 h-1 mx-auto my-4 bg-black border-0 rounded dark:bg-gray-700"></hr>
              <p className="mb-0 text-base font-bold tracking-tight text-gray-900 dark:text-white text-center">
                Capital City : {item.capital}
                <br></br>
                Region : {item.region}
                <br></br>
                Population : {formatNumber(item.population)}
              </p>
            </a>               
          </div>              
        </div>            
      </div>
    ))}
  </div>
);
};      
  


export default CountryCard
