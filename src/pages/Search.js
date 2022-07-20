/* eslint-disable max-len */
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
  display:${(props) => (props.clicked ? 'flex' : 'none')};
}`;

export default function Search({
  panTo, setSelected, active,
}) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    fields: ['geometry', 'formatted_address', 'address_components'],
    debounce: 300,
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = (selected_place) => () => {
    setValue('');
    setSelected(selected_place);
    clearSuggestions();
    getGeocode({ address: selected_place.description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        panTo({ lat, lng });
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  console.log(active);

  const renderSuggestions = () => data.map((suggestion) => {
    const {
      place_id,
      structured_formatting: { main_text },
    } = suggestion;

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <li
        style={{
          listStyleType: 'none',
          listStyle: 'none',
          textDecoration: 'none',
          backgroundColor: 'white',
          width: window.innerWidth > 800 ? 'calc( 45vw - 85px )' : 'calc( 100vw - 85px )',
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
      position: window.innerWidth > 800 ? 'absolute' : 'fixed',
      left: '20px',
      top: '80px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 35,
      zIndex: 30,
    }}
    >
      <SearchInput
        clicked={active}
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="想去哪兒呢？"
      />
      {status === 'OK' && active && <div style={{ paddingLeft: 'none', width: '100%', zIndex: '24' }}>{renderSuggestions()}</div>}
    </div>
  );
}
