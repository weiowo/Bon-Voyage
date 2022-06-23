import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import styled from 'styled-components/macro';
import CitySrc from './images/city.png';

// import { useNavigate } from 'react-router-dom';
// import {
//   // getDocs,
//   collection, doc,
//   setDoc,
// } from 'firebase/firestore';
// import db from '../utils/firebase-init';

const Banner = styled.img`
width:100vw;
height:auto;
`;

const CityTitle = styled.div`
width:100vw;
height:auto;
z-index:10;
font-size:40px;
font-weight:600;
position:absolute;
top:170px;
`;

const libraries = ['places'];

const mapContainerStyle = {
  height: '0vh',
  width: '0vw',
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 43.6532,
  lng: -79.3832,
};

function City() {
  const { search } = useLocation();
  const [nearbyData, setNearbyData] = useState({});
  const lat = Number(new URLSearchParams(search).get('lat'));
  const lng = Number(new URLSearchParams(search).get('lng'));
  const cityFromUrl = new URLSearchParams(search).get('city');
  const optionFromUrl = new URLSearchParams(search).get('option');
  console.log(lat);
  console.log(lng);
  console.log(cityFromUrl);
  console.log(nearbyData);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const searchNearby = useCallback(() => {
    console.log('searchNearby', isLoaded);
    if (!isLoaded) return;

    const request = {
      location: { lat, lng },
      radius: '2000',
      type: [optionFromUrl],
    };

    console.log('request', request);

    // 如果只選到一種，type就會只放那種
    // 如果選「全部」，那就會query三次，獲取20*3筆結果！

    function callback(results, status) {
      // eslint-disable-next-line no-undef
      console.log('callback', results, status, google.maps.places.PlacesServiceStatus.OK);
      // eslint-disable-next-line no-undef
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log('哇哈哈哈哈哈哈哈(fromCity頁面)');
        // { hotel: [], landmark: [] }
        const data = { [optionFromUrl]: results };
        setNearbyData(data);
      }
    }
    // eslint-disable-next-line no-undef
    const service = new google.maps.places.PlacesService(mapRef.current);
    console.log(service);
    service.nearbySearch(request, callback);
  }, [lat, lng, optionFromUrl, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setTimeout(() => {
      searchNearby();
    }, 2000);
  }, [searchNearby, isLoaded]);
  console.log({ lat, lng });

  if (!isLoaded) return <div>沒有成功...(fromCity頁面)</div>;

  return (
    <>
      <Banner src={CitySrc} />
      <CityTitle>
        哈囉，
        {cityFromUrl}
        !
      </CityTitle>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onLoad={onMapLoad}
      />
    </>
  );
}

export default City;
