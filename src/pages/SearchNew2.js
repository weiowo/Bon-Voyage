/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
}
  from 'react-places-autocomplete';

function AutoCompleteTest() {
  const [address, setAddress] = useState('');

  function handleChange(input) {
    setAddress(input);
  }

  function handleSelect() {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log('success', latLng))
      .catch((error) => console.error('error', error));
  }

  return (
    <PlacesAutocomplete
      value={address}
      onChange={() => handleChange()}
      onSelect={() => handleSelect()}
    >
      {({
        getInputProps, suggestions, getSuggestionItemProps, loading,
      }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: 'Search Places ...',
              className: 'location-search-input',
            })}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? 'suggestion-item--active'
                : 'suggestion-item';
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer' };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
}

export default AutoCompleteTest;
