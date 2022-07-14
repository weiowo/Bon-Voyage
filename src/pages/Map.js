/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-new */
/* global google */
import React, {
  useRef, useCallback, useEffect,
} from 'react';
import {
  GoogleMap, useLoadScript,
} from '@react-google-maps/api';
// import PropTypes from 'prop-types';
import Search from './Search';
import PinkStar from './images/smile_star_pink.png';
import OrangeStar from './images/smile_star_orange.png';
import YellowStar from './images/smile_star_yellow.png';
import GreenStar from './images/smile_star_green.png';
import BlueStar from './images/smile_star_blue.png';
import PurpleStar from './images/smile_star_purple.png';

let service;

const mapContainerStyle = {
  height: 'calc( 100vh - 60px)',
  width: '55vw',
  position: 'absolute',
};

const smallScreenMapContainerStyle = {
  height: '100vh',
  position: 'fixed',
  top: 0,
  bottom: 0,
  width: '100vw',
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 25.105497,
  lng: 121.597366,
};

function Map({
  recommendList, setRecommendList,
  active, setSelected, selected, scheduleData, setDuration, setDistance,
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ['places'],
  });
  const mapRef = useRef();
  // const originRef = useRef();
  // const destinationRef = useRef();
  // const [directionsResponse, setDirectionsResponse] = useState(null);
  // const [distance, setDistance] = useState('');
  // const [duration, setDuration] = useState('');
  console.log(scheduleData);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // 宣告panTo function並傳給search components

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(12);
    // const map = mapRef.current;
    // 放搜尋到的景點那個地標
    // const image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'; // 放上不一樣的地標
    // new google.maps.Marker({
    //   position: { lat, lng },
    //   map,
    //   icon: image,
    //   draggable: true,
    // });

    const request = {
      location: { lat, lng }, // 根據autocomplete點按下去的地方的經緯度設定為地點中心
      radius: '500',
      type: ['tourist_attraction'], // 依據這個中心點往外擴張找餐廳
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
          // const place = results[i];
          // console.log(place);
          // 把推薦景點給marker（預設樣式）
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

  // 同時拿distance跟route

  // 拿陣列最後一個東西跟前面

  // function getDistanceAndRoute(originTest, destinationTest, imageTest, colorTest) {
  //   const request = {
  //     origin: originTest,
  //     destination: destinationTest,
  //     travelMode: 'DRIVING',
  //   };
  //   const image = imageTest; // 放上不一樣的地標

  //   const directionsService = new google.maps.DirectionsService();
  //   const directionsDisplay = new google.maps.DirectionsRenderer();

  //   // 客製化marker的樣子
  //   const customizedMarker = {
  //     icon: image,
  //   };
  //   // 客製化line的顏色
  //   const customizedRoute = {
  //     strokeColor: colorTest,
  //   };

  //   const map = mapRef.current;
  //   directionsDisplay.setMap(map);
  //   directionsService.route(request, (result, status) => {
  //     if (status === 'OK') {
  //       console.log(result.routes[0].legs[0].distance.text);
  //       console.log(result.routes[0].legs[0].duration.text);
  //       setDistance(result.routes[0].legs[0].distance.text);
  //       setDuration(result.routes[0].legs[0].duration.text);
  //       directionsDisplay.setDirections(result);
  //       directionsDisplay.setOptions({ markerOptions: customizedMarker, polylineOptions: customizedRoute });
  //     }
  //   });
  // }

  useEffect(() => {
    if (!scheduleData) { return; }

    function getDistanceAndRoute(originPlace, destinationPlace, imageSetting, colorSetting, dayIndex, distanceIndex) {
      const request = {
        origin: originPlace,
        destination: destinationPlace,
        travelMode: 'DRIVING',
      };
      const image = imageSetting; // 放上不一樣的地標

      const directionsService = new google.maps.DirectionsService();
      const directionsDisplay = new google.maps.DirectionsRenderer();

      // 客製化marker的樣子
      const customizedMarker = {
        icon: image,
      };
      // 客製化line的顏色
      const customizedRoute = {
        strokeColor: colorSetting,
        strokeWeight: 8,
        strokeOpacity: 0.9,
      };

      const map = mapRef.current;
      directionsDisplay.setMap(map);
      directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          setDistance((draft) => {
            if (Array.isArray(draft[dayIndex])) {
              draft[dayIndex][distanceIndex] = result.routes[0].legs[0].distance.text;
            } else {
              draft[dayIndex] = [];
              draft[dayIndex][distanceIndex] = result.routes[0].legs[0].distance.text;
            }
          });
          setDuration((draft) => {
            if (Array.isArray(draft[dayIndex])) {
              draft[dayIndex][distanceIndex] = result.routes[0].legs[0].duration.text;
            } else {
              draft[dayIndex] = [];
              draft[dayIndex][distanceIndex] = result.routes[0].legs[0].duration.text;
            }
          });
          // setDistance(result.routes[0].legs[0].distance.text);
          // setDuration(result.routes[0].legs[0].duration.text);
          directionsDisplay.setDirections(result);
          directionsDisplay.setOptions({ markerOptions: customizedMarker, polylineOptions: customizedRoute });
        }
      });
    }

    const markerIcons = [PinkStar, OrangeStar, YellowStar, GreenStar, BlueStar, PurpleStar];
    const lineColors = ['#FF82B8', '#FFB750', '#F4E64C', '#76DC66', '#83D6FD', '#E483F3'];

    scheduleData?.trip_days?.forEach((dayItem, dayIndex) => {
      for (let i = 0; i < scheduleData.trip_days[dayIndex].places.length - 1; i += 1) {
        getDistanceAndRoute(
          dayItem?.places[i].place_address,
          dayItem?.places[i + 1].place_address,
          markerIcons[dayIndex % 7],
          lineColors[dayIndex % 7],
          dayIndex,
          i,
        );
      }
    });
  }, [scheduleData, setDistance, setDuration]);

  // getDistanceAndRoute();

  if (!isLoaded) return <div>test...</div>;

  console.log('選到的在這Map！', selected);

  // 一次拿兩組路線圖

  // const origin1 = new google.maps.LatLng(55.930385, -3.118425); // 可以是經緯度
  // const origin2 = '信義區松壽路11號5樓'; // 也可以是地點名稱
  // const destinationA = 'Stockholm, Sweden';
  // const destinationB = '台灣台北市萬華區長沙街二段';

  // service = new google.maps.DistanceMatrixService();
  // service.getDistanceMatrix({
  //   origins: [origin1, origin2],
  //   destinations: [destinationA, destinationB],
  //   travelMode: 'DRIVING',
  //   // transitOptions: TransitOptions,
  //   // drivingOptions: DrivingOptions,
  //   // unitSystem: UnitSystem,
  //   // avoidHighways: Boolean,
  //   // avoidTolls: Boolean,
  // }, callback2);

  // function callback2(response, status2) {
  //   if (status2 === 'OK') {
  //     const origins = response.originAddresses;
  //     const destinations = response.destinationAddresses;

  //     for (let i = 0; i < origins.length; i++) {
  //       const results = response.rows[i].elements;
  //       for (let j = 0; j < results.length; j++) {
  //         const element = results[j];
  //         const distance2 = element.distance.text;
  //         const duration2 = element.duration.text;
  //         const from = origins[i];
  //         const to = destinations[j];
  //         console.log(distance2, duration, from, to);
  //         console.log(results);
  //         console.log(response);
  //         console.log(duration2);
  //       }
  //     }
  //   }
  // }// callback

  // async function calculateRoute() {
  //   if (originRef.current.value === '' || destinationRef.current.value === '') {
  //     return;
  //   }
  //   // eslint-disable-next-line no-undef
  //   const directionsService = new google.maps.DirectionsService();
  //   const results = await directionsService.route({
  //     origin: originRef.current.value,
  //     destination: destinationRef.current.value,
  //     // eslint-disable-next-line no-undef
  //     travelMode: google.maps.TravelMode.DRIVING,
  //   });
  //   // console.log(originRef.current.value);
  //   // console.log(results);
  //   // console.log(results.routes[0].legs[0].end_location.lat());
  //   // console.log(results.routes[0].legs[0].end_location.lng());
  //   setDirectionsResponse(results);
  //   setDistance(results.routes[0].legs[0].distance.text);
  //   setDuration(results.routes[0].legs[0].duration.text);
  // }

  // function clearRoute() {
  //   setDirectionsResponse(null);
  //   setDistance('');
  //   setDuration('');
  //   originRef.current.value = '';
  //   destinationRef.current.value = '';
  // }

  return (
    <div>
      {/* <Autocomplete>
        <input type="text" placeholder="出發點" ref={originRef} />
      </Autocomplete>
      <Autocomplete>
        <input type="text" placeholder="第二個景點" ref={destinationRef} />
      </Autocomplete> */}
      {/* <Autocomplete>
        <input type="text" placeholder="第三個景點" ref={destinationRef} />
      </Autocomplete> */}
      {/* <button type="button" onClick={() => calculateRoute()}>計算路線1</button>
      <button type="button" onClick={() => clearRoute()}>清除路線</button> */}
      {/* <div>{distance}</div> */}
      {/* <div>{duration}</div> */}
      <Search panTo={panTo} active={active} setSelected={setSelected} selected={selected} />
      <GoogleMap
        id="map"
        mapContainerStyle={window.innerWidth > 800 ? mapContainerStyle : smallScreenMapContainerStyle}
        zoom={10}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {/* {directionsResponse && (
        <DirectionsRenderer directions={directionsResponse} />
        )}
        <Marker position={center} /> */}
      </GoogleMap>
    </div>
  );
}

// Map.propTypes = {
//   recommendList: PropTypes.func.isRequired,
//   setRecommendList: PropTypes.func.isRequired,
// };

export default Map;
