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




// // Alternate Example

// // useCounter.js
// import { useState } from 'react';

// // Custom hook that manages counter state
// function useCounter(initialValue = 0) {
//   const [count, setCount] = useState(initialValue);

//   // Method to increment counter
//   const increment = () => setCount(count + 1);

//   // Method to decrement counter
//   const decrement = () => setCount(count - 1);

//   return { count, increment, decrement };
// }

// export default useCounter;





// // CounterComponent.js
// import React from 'react';
// import useCounter from './useCounter'; 

// function CounterComponent() {
//   // Custom hook का use
//   const { count, increment, decrement } = useCounter(0);

//   return (
//     <div>
//       <h1>Counter: {count}</h1>
//       <button onClick={increment}>Increase</button>
//       <button onClick={decrement}>Decrease</button>
//     </div>
//   );
// }

// export default CounterComponent;

