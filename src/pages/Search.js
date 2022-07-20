/* eslint-disable camelcase */
/* eslint-disable react/prop-types */

import React, { useRef, useCallback } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import styled from 'styled-components';
import {
  GoogleMap, useLoadScript,
} from '@react-google-maps/api';
import CloseIcon from './images/close_style.png';

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

const CloseSearchIcon = styled.img`
display:${(props) => (props.clicked ? 'block' : 'none')};
width:35px;
height:35px;
position:absolute;
cursor:pointer;
top:0px;
left:calc( 45vw - 70px );
// @media screen and (max-width:800px){
//   position:fixed;
//   top:20px;
//   left:20px;
}`;

export default function Search({
  panTo, active, setSelected, onClickClose,
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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ['places'],
  });
  const mapRef = useRef();

  const mapStyle = {
    height: '0vh',
    width: '0vw',
    position: 'absolute',
  };

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const handleSelect = (selectedPlace) => () => {
    setValue('');
    setSelected(selectedPlace);
    clearSuggestions();
    getGeocode({ address: selectedPlace.description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        panTo({ lat, lng });
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  const renderSuggestions = () => data.map((suggestion) => {
    const {
      place_id,
      structured_formatting: { main_text },
    } = suggestion;

    return (
      <li
        role="presentation"
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
      </li>
    );
  });

  if (!isLoaded) return <div>...</div>;

  return (
    <>
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
        <CloseSearchIcon
          clicked={active}
          onClick={() => { onClickClose(); clearSuggestions(); }}
          src={CloseIcon}
        />
        <SearchInput
          clicked={active}
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="想去哪兒呢？"
        />
        {status === 'OK' && active && <div style={{ paddingLeft: 'none', width: '100%', zIndex: '24' }}>{renderSuggestions()}</div>}
      </div>
      <GoogleMap
        id="map"
        zoom={10}
        onLoad={onMapLoad}
        mapContainerStyle={mapStyle}
      />

    </>
  );
}
