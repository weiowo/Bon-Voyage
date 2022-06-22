/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Link } from 'react-router-dom';
// import {
//   GoogleMap, useLoadScript,
// } from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import onClickOutside from 'react-onclickoutside';
// import { useEffect } from 'react';

function SearchAtHomePage() {
  const {
    ready, value, suggestions: { status, data }, setValue, clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });
  const ref = onClickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = ({ description }) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getGeocode({ address: description }).then((results) => {
      const { lat, lng } = getLatLng(results[0]);
      console.log('📍 Coordinates: ', { lat, lng });
    });
  };

  const renderSuggestions = () => data.map((suggestion) => {
    const { place_id, structured_formatting: { main_text, secondary_text } } = suggestion;

    return (
      <li key={place_id} onClick={handleSelect(suggestion)}>
        <strong>{main_text}</strong>
        {' '}
        <small>{secondary_text}</small>
      </li>
    );
  });

  return (
    <div ref={ref}>
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

function Home() {
  return (
    <button type="button">
      <Link to="/my-schedules">
        我的行程
      </Link>
    </button>
  );
}

export default Home;

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
