import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { provinces } from "../../constants/provinces_cities";
import { cities } from "../../constants/cities";

const CountriesProvinceState = ({
  pais,
  setPais,
  provincia,
  setProvincia,
  ciudad,
  setCiudad,
}) => {
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [spanishCountries, setSpanishCountries] = useState([
    "Spain",
    // "Mexico",
    // "Costa Rica",
    // "El Salvador",
    // "Guatemala",
    // "Honduras",
    // "Nicaragua",
    // "Panama",
    // "Cuba",
    // "Dominican Republic",
    // "Puerto Rico",
    // "Argentina",
    // "Bolivia",
    // "Chile",
    // "Colombia",
    // "Ecuador",
    // "Paraguay",
    // "Peru",
    // "Uruguay",
    // "Venezuela",
    // "Equatorial Guinea",
  ]);

  // Fetch countries
  const fetchCountries = async () => {
    try {
      let allCountries = Country.getAllCountries();

      // Filter out Spanish-speaking countries by name
      const filteredCountries = allCountries.filter((country) =>
        spanishCountries.includes(country.name)
      );
      setSpanishCountries(filteredCountries);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    console.log("in fetch countries");
    fetchCountries();
  }, []);

  // fetch provinces
  const fetchProvinces = async () => {
    try {
      const pakistanStates = State.getStatesOfCountry(pais.id);
      setProvinceList(pakistanStates);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };
  // fetch cities
  const fetchCities = async () => {
    try {
        const States = City.getCitiesOfState(pais.id, provincia.id);
        setCityList(States);
     
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };
  useEffect(() => {
    console.log("in fetch cities");
    if (provincia && provincia.id) {
      console.log("in fetch citiesss");
    //   fetchCities();
    }
  }, [provincia]);

  useEffect(() => {
    console.log("in fetch provinces");
    if (pais && pais.id && pais.name !== "Spain") {
      fetchProvinces();
    }
  }, [pais]);

  const setValue = (e, setVal) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const dataInfo = selectedOption.getAttribute("data-info");
    const selectedObject = JSON.parse(dataInfo);

    console.log("Selected object is", selectedObject);

    // Check if the selected object has 'nm' or 'name' and set the value accordingly
    setVal({
      name: selectedObject.nm || selectedObject.name, // Fallback to 'name' if 'nm' is not present
      id: selectedObject.isoCode || selectedObject.id,
      isoCode: selectedObject.isoCode || null,
    });
  };

  return (
    <div className="flex flex-col gap-y-2 justify-center">
      {/* select country */}
      <select
        value={pais?.isoCode || ""} // Use isoCode for value comparison
        onChange={(e) => setValue(e, setPais)} // Handle change event
        className="px-4 py-2 rounded text-sm customdropdown border border-black outline-none"
      >
        <option value="">Pais</option>
        {spanishCountries.map((p, index) => (
          <option
            key={index}
            value={p.isoCode} // Use isoCode as the value
            data-info={JSON.stringify(p)} // Store the entire object as a JSON string
          >
            {p.name} {/* Display the country name */}
          </option>
        ))}
      </select>

      {/* select province */}

      <select
        value={provincia?.id || ""} // Use the province id for value comparison
        onChange={(e) => setValue(e, setProvincia)}
        className="px-4 py-2 rounded text-sm customdropdown border border-black outline-none"
      >
        <option value="">Provincia</option>
        {pais.name === "Spain"
          ? provinces.map((p, index) => (
              <option
                key={index}
                value={p.id} // Use the id of the province as the value
                data-info={JSON.stringify(p)} // Store the entire object as a JSON string
              >
                {p.nm} {/* Display the province name */}
              </option>
            ))
          : provinceList.map((p, index) => (
              <option
                key={index}
                value={p.isoCode} // Use the id of the province as the value
                data-info={JSON.stringify(p)} // Store the entire object as a JSON string
              >
                {p.name} {/* Display the province name */}
              </option>
            ))}
      </select>

      {/* select city */}

      <select
        value={pais.name === "Spain" ? ciudad.id : ciudad?.name} // Use the city id for value comparison
        onChange={(e) => setValue(e, setCiudad)}
        className="px-4 py-2 rounded text-sm customdropdown border border-black outline-none"
      >
        <option value="">Ciudad</option>
        {pais.name === "Spain"
          ? 
          cities.map((p, index) => {
                    {
                       }

                    if (
                      provincia && p.id.startsWith(provincia?.id)
                    ) {
                      return (
                        <option key={index}
                  value={p.id} // Use the id of the city as the value
                  data-info={JSON.stringify(p)} // Store the entire object as a JSON string>
                  >
                          {p.nm}
                        </option>
                      );
                    }
                  })
         
          : 
          
          cityList.map((p, index) => (
              <option
                key={index}
                value={p.name} // Use the id of the city as the value
                data-info={JSON.stringify(p)} // Store the entire object as a JSON string
              >
                {console.log("city is", p)}
                {p.name}
              </option>
            ))}
      </select>
    </div>
  );
};

export default CountriesProvinceState;
