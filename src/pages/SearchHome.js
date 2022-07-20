/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-new */
import React, {
  useRef, useCallback, useState,
} from 'react';
import {
  GoogleMap, useLoadScript,
} from '@react-google-maps/api';

let service;

const mapContainerStyle = {
  maringTop: '50px',
  height: '80vh',
  width: '100vw',
  position: 'absolute',
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 25.105497,
  lng: 121.597366,
};

function SearchHome() {
  const [theInput, setTheInput] = useState('');
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ['places'],
  });
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const request = {
    input: theInput,
  };

  service = new google.maps.places.Autocomplete();
  service.getPlace(request, callback);

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log('有成功');
    } else {
      console.log('沒成功');
    }
  }

  if (!isLoaded) return <div>test...</div>;

  return (
    <div>

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        <input style={{ zIndex: '2' }} value={theInput} onChange={(e) => setTheInput(e.target.value)} />
      </GoogleMap>
    </div>
  );
}

export default SearchHome;
