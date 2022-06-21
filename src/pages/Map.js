/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-new */
/* global google */
import React, {
  useRef, useCallback, useState,
} from 'react';
import {
  GoogleMap, useLoadScript, Autocomplete, DirectionsRenderer, Marker,
} from '@react-google-maps/api';
// import PropTypes from 'prop-types';
import Search from './Search';

let service;

// const libraries = ['places'];

const mapContainerStyle = {
  height: '100vh',
  width: '50vw',
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

// eslint-disable-next-line react/prop-types
function Map({
  recommendList, setRecommendList,
  active, setSelected, selected, scheduleData,
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ['places'],
  });
  const mapRef = useRef();
  const originRef = useRef();
  const destinationRef = useRef();
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  console.log(directionsResponse);
  console.log(scheduleData);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // 宣告panTo function並傳給search components

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(12);
    const map = mapRef.current;
    // 放搜尋到的景點那個地標
    const image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'; // 放上不一樣的地標
    new google.maps.Marker({
      position: { lat, lng },
      map,
      icon: image,
      draggable: true,
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
          // 這邊可以直接拿到url
          // const placePhotoUrl = results[i].photos[0].getUrl({ maxWidth: 640 });
          // console.log(placePhotoUrl);
          const place = results[i];
          // console.log(place);
          // 把推薦景點給marker（預設樣式）
          new google.maps.Marker({
            position: place.geometry.location,
            map,
          });
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

  // function getRoute(){}
  // const directionsService = new google.maps.DirectionsService();
  // const request = {
  //   origin: 'Greenwich, England',
  //   destination: 'Stockholm, Sweden',
  //   travelMode: 'WALKING',
  // };
  // directionsService.route(request, (response, status) => {
  //   if (status === google.maps.DirectionsService.OK) {
  //     const directionsDisplay = new google.maps.DirectionsRenderer({
  //       map,
  //       directions: response,
  //     });
  //     console.log('哈哈');
  //   }
  // });

  function getRoute() {
    const request = {
      origin: '信義區松壽路11號5樓',
      destination: '台灣台北市萬華區長沙街二段',
      travelMode: 'DRIVING',
    };
    const image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'; // 放上不一樣的地標

    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer();

    // 客製化marker的樣子
    const customizedMarker = {
      icon: image,
    };
    // 客製化line的顏色
    const customizedRoute = {
      strokeColor: 'red',
    };

    const map = mapRef.current;
    directionsDisplay.setMap(map);
    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(result);
        directionsDisplay.setOptions({ markerOptions: customizedMarker, polylineOptions: customizedRoute });
      }
    });
  }

  getRoute();

  if (!isLoaded) return <div>test...</div>;

  console.log('選到的在這Map！', selected);

  async function calculateRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    // console.log(originRef.current.value);
    // console.log(results);
    // console.log(results.routes[0].legs[0].end_location.lat());
    // console.log(results.routes[0].legs[0].end_location.lng());
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    originRef.current.value = '';
    destinationRef.current.value = '';
  }

  return (
    <div>
      <Autocomplete>
        <input type="text" placeholder="出發點" ref={originRef} />
      </Autocomplete>
      <Autocomplete>
        <input type="text" placeholder="第二個景點" ref={destinationRef} />
      </Autocomplete>
      {/* <Autocomplete>
        <input type="text" placeholder="第三個景點" ref={destinationRef} />
      </Autocomplete> */}
      <button type="button" onClick={() => calculateRoute()}>計算路線1</button>
      <button type="button" onClick={() => clearRoute()}>清除路線</button>
      <div>{distance}</div>
      <div>{duration}</div>
      <Search panTo={panTo} active={active} setSelected={setSelected} selected={selected} />
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {directionsResponse && (
        <DirectionsRenderer directions={directionsResponse} />
        )}
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
}

// Map.propTypes = {
//   recommendList: PropTypes.func.isRequired,
//   setRecommendList: PropTypes.func.isRequired,
// };

export default Map;
