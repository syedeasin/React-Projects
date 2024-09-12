import axios from "axios";
import _ from "lodash";
import { useCallback, useState } from "react";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce function to delay API calls
  const fetchResults = useCallback(
    _.debounce(async (query) => {
      setIsLoading(true);
      try {
        // You can call an API or search from a list here
        const response = await axios.get(
          `https://api.example.com/search?q=${query}`
        );
        setResults(response.data.results); // Adjust to your API's structure
      } catch (error) {
        console.error("Error fetching data", error);
      }
      setIsLoading(false);
    }, 500), // 500ms delay
    []
  );

  // Throttle function (optional): Limits the execution of the search function.
  const throttledSearch = useCallback(
    _.throttle(async (query) => {
      setIsLoading(true);
      // You can also handle local list searches here.
      const mockList = ["React", "JavaScript", "Debounce", "Throttle"];
      const filteredResults = mockList.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
      setIsLoading(false);
    }, 1000), // 1000ms throttle time
    []
  );

  // Update search term on input change
  const handleChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    // For external API search, call the debounce function
    if (query) {
      fetchResults(query);
    } else {
      setResults([]); // Clear results when search term is empty
    }

    // For local list search, call the throttled search (optional)
    throttledSearch(query);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      />
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <ul>
          {results.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchComponent;
