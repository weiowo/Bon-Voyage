/* eslint-disable no-inner-declarations */
/* eslint-disable no-new */
/* global google */
import React, { useRef, useCallback } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
// import PropTypes from 'prop-types';
import Search from './Search';

let service;

// const libraries = ['places'];

const mapContainerStyle = {
  height: '100vh',
  width: '47vw',
  position: 'fixed',
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 25.105497,
  lng: 121.597366,
};

// eslint-disable-next-line react/prop-types
function Map({ recommendList, setRecommendList, setActive }) {
  // const [selected, setSelected] = useState('');
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ['places'],
  });
  // console.log(selected);
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  // console.log(loadError);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(12);
    const map = mapRef.current;
    new google.maps.Marker({
      position: { lat, lng },
      map,
    });

    const request = {
      location: { lat, lng }, // 根據autocomplete點按下去的地方的經緯度設定為地點中心
      radius: '500',
      type: ['restaurant'], // 依據這個中心點往外擴張找餐廳
    };

    service = new google.maps.places.PlacesService(mapRef.current);
    // eslint-disable-next-line no-use-before-define
    service.nearbySearch(request, callback);
    // 放markers到選好的地方
    function callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const data = JSON.stringify(results);
        window.localStorage.setItem('places', data);
        // console.log(data);
        setRecommendList(results);
        for (let i = 0; i < results.length; i += 1) {
          const place = results[i];
          console.log(place);
          // new google.maps.Marker({
          //   position: place.geometry.location,
          //   map,
          // });
        }
        // new google.maps.Marker({
        //   position: selected,
        //   map,
        // });
      } else {
        console.log('沒有成功');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRecommendList, recommendList]);
  // eslint-disable-next-line no-unused-expressions

  // if (recommendList) {
  //   console.log(recommendList);
  // }

  if (!isLoaded) return <div>test...</div>;

  return (
    <div>
      <Search panTo={panTo} setActive={setActive} />
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onLoad={onMapLoad}
      />
    </div>
  );
}

// Map.propTypes = {
//   recommendList: PropTypes.func.isRequired,
//   setRecommendList: PropTypes.func.isRequired,
// };

export default Map;
