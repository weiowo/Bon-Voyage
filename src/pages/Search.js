/* eslint-disable no-new */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import styled from 'styled-components';
// 會自動建議你要搜尋什麼

const SearchInput = styled.input`
display:${(props) => (props.active ? 'none' : 'flex')};
width: 30vw;
height: 30px;
`;

export default function Search({ panTo, setSelected, active }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = (selected_place) => () => {
    // selected_place是user選到的那個地方！
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(selected_place.description, false);
    console.log(selected_place); // 選到的那個地方的地址
    const selected_place_data = JSON.stringify(selected_place);
    window.localStorage.setItem('selected_recommend_place', selected_place_data);
    // eslint-disable-next-line no-new
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getGeocode({ address: selected_place.description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        panTo({ lat, lng });
        setSelected({ lat, lng });
        console.log({ lat, lng });
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
    // 去拿那個地址的經緯度！
  };

  const renderSuggestions = () => data.map((suggestion) => {
    const {
      place_id,
      structured_formatting: { main_text, secondary_text },
    } = suggestion;

    // 試著console.log出用戶選的地點

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <li key={place_id} onClick={handleSelect(suggestion)}>
        <strong>{main_text}</strong>
        {' '}
        <small>{secondary_text}</small>
      </li>
    );
  });

  return (
    <div style={{
      position: 'fixed',
      left: '11vw',
      top: '40px',
    }}
    >
      <SearchInput
        active={active}
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Where are you going?"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && <ul>{renderSuggestions()}</ul>}
      {/* 如果狀態ok就把建議的地點寫出來 */}
    </div>
  );
}
