import axios from "axios";
import { CountryItem } from "./countryList.type";

const fetchCountry = async ():Promise<CountryItem[]> => {
    const response = await axios.get("https://restcountries.com/v3.1/all")


console.log(response.data);

return response.data;
}

export default fetchCountry;
