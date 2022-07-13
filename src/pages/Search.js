/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */

import React from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import styled from 'styled-components';

const SearchInput = styled.input`
display:${(props) => (props.clicked ? 'flex' : 'none')};
width: calc( 45vw - 85px );
height: 35px;
border:1px solid grey;
border-radius:5px;
font-size:15px;
z-index:20;
padding-left:10px;
outline:none;
@media screen and (max-width:800px){
  width:calc( 100vw - 85px );
}
`;

export default function Search({
  panTo, setSelected, selected, active,
}) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      // types: ['(cities)'],
      // componentRestrictions: { country: 'fr' }, // 限制國家
      // 感覺是搜尋過的會紀錄！清除快取與cookie！！
      // fields: ['formatted_address', 'geometry', 'name'], // 要放在哪？
      /* Define search scope here */
    },
    debounce: 300,
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  //   useEffect(() => {
  //     fetch('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJuaGhlow9aTQRfHNZ8O0BGxw&key=AIzaSyCcEAICVrVkj_NJ6NU-aYqVMxHFfjrOV6o')
  //       .then((response) => {
  //         console.log(response);
  //         return response.json();
  //       }).then((jsonData) => {
  //         console.log(jsonData);
  //         const jsonDataPhotoUrl = jsonData.result.photos[0];
  //         console.log(jsonDataPhotoUrl);
  //         window.localStorage.setItem('PlcesSearched', jsonData);
  //       }).catch((err) => {
  //         console.log('錯誤:', err);
  //       });
  //   }, []);

  const handleSelect = (selected_place) => () => {
    // selected_place是user選到的那個地方！選好後上面就會顯示那個字，不會再autocomplete一次
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    // setValue(selected_place.description, false);
    setValue('');
    // console.log(selected_place); // 選到的那個地方的地址
    const selected_place_data = JSON.stringify(selected_place);
    window.localStorage.setItem('selected_recommend_place', selected_place_data);
    // const placePhotoUrl = selected_place_data.place_id.getUrl({ maxWidth: 640 });
    // fetchPhotoUrl(selected_place_data.place_id);
    // console.log(placePhotoUrl);
    // const place = results[i];
    // console.log(place);
    setSelected(selected_place);
    // setValue('');
    console.log(selected);
    clearSuggestions();
    getGeocode({ address: selected_place.description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        panTo({ lat, lng });
        // setSelected({ lat, lng });
        console.log({ lat, lng });
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
    // 去拿那個地址的經緯度！
  };

  console.log(active);

  const renderSuggestions = () => data.map((suggestion) => {
    const {
      place_id,
      structured_formatting: { main_text },
    } = suggestion;

    // 試著console.log出用戶選的地點

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <li
        style={{
          listStyleType: 'none',
          listStyle: 'none',
          textDecoration: 'none',
          backgroundColor: 'white',
          width: 'calc( 45vw - 85px )',
          height: '30px',
          borderBottom:
          '1px black solid',
          cursor: 'pointer',
          borderRadius: '3px',
          zIndex: '24',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        key={place_id}
        onClick={handleSelect(suggestion)}
      >
        <strong>{main_text}</strong>
        {/* <br /> */}
        {/* <small>{secondary_text}</small> */}
      </li>
    );
  });

  return (
    <div style={{
      position: 'absolute',
      left: '20px',
      top: '80px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
    >
      <SearchInput
        clicked={active}
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="想去哪兒呢？"
      />
      {/* 要把serachInput的value傳到map那邊去計算route跟duration */}
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && <div style={{ paddingLeft: 'none', width: '100%', zIndex: '24' }}>{renderSuggestions()}</div>}
    </div>
  );
}
