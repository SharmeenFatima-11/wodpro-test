import axios from "axios";
console.log("base url is", import.meta.env.VITE_API_URL)

const api = axios.create({
    // baseURL : import.meta.env.VITE_API_URL,
    baseURL:'https://backend.wodproleague.es'
  });
 export default api; 