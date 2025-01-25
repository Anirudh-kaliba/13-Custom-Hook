import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
import useFetch from "../hooks/useFetch.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const {
    isFetching,
    error,
    fetchedData: availablePlaces,
    setFetchedData: setAvailablePlaces,
  } = useFetch(fetchAvailablePlaces, []);

  const [sortedPlaces, setSortedPlaces] = useState(null); // Local state for sorted places

  useEffect(() => {
    if (availablePlaces && availablePlaces.length > 0 && !sortedPlaces) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const sorted = sortPlacesByDistance(
            availablePlaces,
            position.coords.latitude,
            position.coords.longitude
          );
          setSortedPlaces(sorted); // Update sorted places only once
        },
        (geoError) => {
          console.error("Geolocation error:", geoError);
        }
      );
    }
  }, [availablePlaces, sortedPlaces]); // Now depends on sortedPlaces, not availablePlaces

  // If there's no sorted places yet, show loading
  if (isFetching) {
    return <div>Loading places...</div>;
  }

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={sortedPlaces || availablePlaces} // Show sorted places or fallback to availablePlaces
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
