// App.jsx
import { useRef, useState, useCallback } from 'react';
import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { fetchUserPlaces } from './http.js';
import Error from './components/Error.jsx';
import useFetch from './hooks/useFetch.js'; 
import { updateUserPlaces } from './http.js';

function App() {
  const selectedPlace = useRef();
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { isFetching, error, fetchedData: userPlaces, setFetchedData: setUserPlaces } = useFetch(fetchUserPlaces, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    await updateUserPlaces([selectedPlace, ...userPlaces]);

    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
        message: error.message || 'Failed to update places.',
      });
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );

      try {
        await updateUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );
      } catch (error) {
        setUserPlaces(userPlaces);
        setErrorUpdatingPlaces({
          message: error.message || 'Failed to delete place.',
        });
      }

      setModalIsOpen(false);
    },
    [userPlaces, setUserPlaces]
  );

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <Error
            title="An error occurred!"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <Error title="An error occurred!" message={error.message} />}
        {!error && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            isLoading={isFetching}
            loadingText="Fetching your places..."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;





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
// import useCounter from './useCounter';  // Custom hook को import करना

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


