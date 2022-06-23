/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable no-new */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Link, useNavigate } from 'react-router-dom';
// import {
//   GoogleMap, useLoadScript,
// } from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
// import onClickOutside from 'react-onclickoutside';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';

// let service;
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

function SearchAtHomePage({ option, setOption }) {
  const navigate = useNavigate();

  // const [Latlng, setLatlng] = useState('');
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions:
    /* Define search scope here */
    { types: ['(cities)'] },
    debounce: 300,
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = (selected_place_at_homePage) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    // const selected_place_data_at_homePage = JSON.stringify(selected_place_at_homePage);
    setValue(selected_place_at_homePage.description, false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getGeocode({ address: selected_place_at_homePage.description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        console.log('拿到經緯度囉');
        console.log({ lat, lng });
        console.log(selected_place_at_homePage.structured_formatting.main_text);
        navigate({ pathname: '/city', search: `?lat=${lat}&lng=${lng}&city=${selected_place_at_homePage.structured_formatting.main_text}&option=${option}` });
        searchNearby({ lat, lng });
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
  };

  const renderSuggestions = () => data.map((suggestion) => {
    const {
      place_id,
      structured_formatting: { main_text, secondary_text },
    } = suggestion;

    return (
      <li key={place_id} onClick={handleSelect(suggestion)}>
        <strong>{main_text}</strong>
        {' '}
        <small>{secondary_text}</small>
      </li>
    );
  });

  return (
    <div>
      <form htmlFor="temp-id" className="search-options-form">
        <label className="search-options-title">搜尋種類</label>
        <select
          className="search-options"
          value={option}
          onChange={(event) => {
            setOption(event.target.value);
          }}
        >
          <option id="temp-id" className="search-option-all" value="all">
            全部
          </option>
          <option id="temp-id" className="search-option-lodging" value="lodging">
            飯店
          </option>
          <option id="temp-id" className="search-option-restaurant" value="restaurant">
            餐廳
          </option>
          <option id="temp-id" className="search-option-landmark" value="tourist_attraction">
            景點
          </option>
        </select>
      </form>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Where are you going?"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && <ul>{renderSuggestions()}</ul>}
    </div>
  );
}

function MapAtHomePage() {
  // const [query, setQuery] = useState('');
  const [option, setOption] = useState('all'); // 預設想放'全部'
  // const [nearbyData, setNearbyData] = useState({});
  // console.log(nearbyData);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // const searchNearby = useCallback(({ lat, lng }) => {
  //   console.log('searchNearby');
  //   // option all, landmark
  //   const request = {
  //     location: { lat, lng },
  //     radius: '2000',
  //     type: [option],
  //   };

  //   // 如果只選到一種，type就會只放那種
  //   // 如果選「全部」，那就會query三次，獲取20*3筆結果！

  //   function callback(results, status) {
  //     console.log(request, 'home');
  //     console.log('callback', results, status, google.maps.places.PlacesServiceStatus.OK);
  //     if (status === google.maps.places.PlacesServiceStatus.OK) {
  //       console.log('okkkkkkkkk');
  //       // { hotel: [], landmark: [] }
  //       const data = { [option]: results };
  //       setNearbyData(data);
  //     }
  //   }

  //   const service = new google.maps.places.PlacesService(mapRef.current);
  //   console.log(service);
  //   service.nearbySearch(request, callback);
  // }, [option]);

  if (!isLoaded) return <div>沒有成功...</div>;

  return (
    <div className="search-options-wrapper">
      {/* <form htmlFor="temp-id" className="search-options-form">
        <label className="search-options-title">搜尋種類</label>
        <select
          className="search-options"
          value={option}
          onChange={(event) => {
            setOption(event.target.value);
          }}
        >
          <option id="temp-id" className="search-option-all" value="all">
            全部
          </option>
          <option id="temp-id" className="search-option-lodging" value="lodging">
            飯店
          </option>
          <option id="temp-id" className="search-option-restaurant" value="restaurant">
            餐廳
          </option>
          <option id="temp-id" className="search-option-landmark" value="tourist_attraction">
            景點
          </option>
        </select>
      </form> */}
      <SearchAtHomePage option={option} setOption={setOption} />
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

function Home() {
  return (
    <>
      <MapAtHomePage />
      <button type="button">
        <Link to="/my-schedules">
          我的行程
        </Link>
      </button>

    </>
  );
}

export default Home;

SearchAtHomePage.propTypes = {
  option: PropTypes.string.isRequired,
  setOption: PropTypes.func.isRequired,
};

// SearchAtHomePage.propTypes = {
//   panTo:PropTypes.func
// };

// 自己建立行程後，把資料送到schedules-members的db
// 還是直接放在scheduleData的immer裡面就好？？
// 同時把這個行程id，送到這個user的行程array

// 在別人按下確認邀請後，做一樣的事

// 日期：放進去是放string，拿出來也是string
// 拿出來後先把string轉成milliseconds，然後按下加一天的話就加上一天的milliseconds

// 資料：先搜尋資料後拿到place_id，再用這個place_id去拿它的detail，再用這個detail中的photo_reference去拿照片

// useEffect(() => {
//   fetch('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyCcEAICVrVkj_NJ6NU-aYqVMxHFfjrOV6o')
//     .then((response) => {
//       console.log(response);
//       return response.json();
//     }).then((jsonData) => {
//       console.log(jsonData);
//       window.localStorage.setItem('PlcesSearched', jsonData);
//     }).catch((err) => {
//       console.log('錯誤:', err);
//     });
// }, []);

//   fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJPxnPnrCrQjQRmEwUNrIViu0&language=zh-TW&key=AIzaSyCcEAICVrVkj_NJ6NU-aYqVMxHFfjrOV6o', {
//     method: 'GET', // *GET, POST, PUT, DELETE, etc.
//     mode: 'no-cors', // no-cors, cors, *same-origin
//   })
//   .then(response => response.json()) // 輸出成 json
// }
// )
