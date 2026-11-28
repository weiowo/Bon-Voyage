import React, { useRef, useCallback } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import {
  GoogleMap, useLoadScript,
} from '@react-google-maps/api';
import tw from '@/lib/tw';
import useMediaQuery from '@/lib/useMediaQuery';
import type { LatLng } from '../types';

const CloseIcon = '/images/close_style.webp';

const SearchInput = tw.input<{ clicked?: boolean }>`
  w-[calc(45vw_-_85px)] h-[35px] [border:1px_solid_grey] rounded-[5px] text-[15px] z-[20]
  pl-[10px] [outline:none] max-tablet:w-[calc(100vw_-_85px)]
  ${(p) => (p.clicked ? 'flex' : 'hidden')}
  ${(p) => (p.clicked ? 'max-tablet:flex' : 'max-tablet:hidden')}
`;

const CloseSearchIcon = tw.img<{ clicked?: boolean }>`
  w-[35px] h-[35px] absolute cursor-pointer top-[0px] left-[calc(45vw_-_70px)]
  ${(p) => (p.clicked ? 'block' : 'hidden')}
`;

interface SearchProps {
  panTo: (latLng: LatLng) => void;
  active: boolean;
  setSelected: (place: google.maps.places.AutocompletePrediction) => void;
  onClickClose: () => void;
}

export default function Search({
  panTo, active, setSelected, onClickClose,
}: SearchProps) {
  const isSmallScreen = useMediaQuery('(max-width: 800px)');
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries: ['places'],
  });
  const mapRef = useRef<google.maps.Map | undefined>(undefined);

  const mapStyle: React.CSSProperties = {
    height: '0vh',
    width: '0vw',
    position: 'absolute',
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleSelect = (selectedPlace: google.maps.places.AutocompletePrediction) => () => {
    setValue('');
    setSelected(selectedPlace);
    clearSuggestions();
    getGeocode({ address: selectedPlace.description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        panTo({ lat, lng });
      })
      .catch((error) => {
        console.error('Geocoding failed:', error);
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
          width: isSmallScreen ? 'calc( 100vw - 85px )' : 'calc( 45vw - 85px )',
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
        position: isSmallScreen ? 'fixed' : 'absolute',
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
