// useFetch.js
import { useState, useEffect } from "react";

function useFetch(fetchFunction, initialData) {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedData, setFetchedData] = useState(initialData);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFunction();
        setFetchedData(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, [fetchFunction]);

  return { isFetching, error, fetchedData, setFetchedData };
}

export default useFetch;
