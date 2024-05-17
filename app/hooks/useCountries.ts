import countries from "world-countries";

const formattedCountries = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
    flag: country.flag,
    latlng: country.latlng,
    region: country.region
}));

const useCountries = () => { //The hook
    const getAll = () => formattedCountries;

    const getByValue = (value: string) => { // Search formatted Countries map and find the value which matches the input value
        return formattedCountries.find((item) => item.value === value);
    }

    return  {
        getAll,
        getByValue
    }
};

export default useCountries; // Export the hook