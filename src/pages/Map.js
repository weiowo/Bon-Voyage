/* eslint-disable no-new */
/* global google */
import React, {
  useRef, useCallback, useEffect,
} from 'react';
import {
  GoogleMap, useLoadScript,
} from '@react-google-maps/api';
import PropTypes from 'prop-types';
import Search from './Search';
import PinkStar from './images/smile_star_pink.png';
import OrangeStar from './images/smile_star_orange.png';
import YellowStar from './images/smile_star_yellow.png';
import GreenStar from './images/smile_star_green.png';
import BlueStar from './images/smile_star_blue.png';
import PurpleStar from './images/smile_star_purple.png';

let service;

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const center = {
  lat: 25.105497,
  lng: 121.597366,
};

function Map({
  setRecommendList, onClickClose,
  active, setSelected, selected, scheduleData, setDuration, setDistance, mapDisplay,
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ['places'],
  });
  const mapRef = useRef();

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
    display: mapDisplay ? 'block' : 'none',
  };

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(12);

    const request = {
      location: { lat, lng },
      radius: '500',
      type: ['tourist_attraction'],
    };

    function callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setRecommendList(results);
      } else {
        console.log('沒有成功');
      }
    }

    service = new google.maps.places.PlacesService(mapRef.current);
    service.nearbySearch(request, callback);
  }, [setRecommendList]);

  useEffect(() => {
    if (!scheduleData) { return; }

    function getDistanceAndRoute(
      originPlace,
      destinationPlace,
      imageSetting,
      colorSetting,
      dayIndex,
      distanceIndex,
    ) {
      const request = {
        origin: originPlace,
        destination: destinationPlace,
        travelMode: 'DRIVING',
      };
      const image = imageSetting;
      const directionsService = new google.maps.DirectionsService();
      const directionsDisplay = new google.maps.DirectionsRenderer();

      const customizedMarker = {
        icon: image,
      };
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
          directionsDisplay.setDirections(result);
          directionsDisplay.setOptions({
            markerOptions: customizedMarker,
            polylineOptions: customizedRoute,
          });
        }
      });
    }

    const markerIcons = [PinkStar, OrangeStar, YellowStar, GreenStar, BlueStar, PurpleStar];
    const lineColors = ['#FF82B8', '#FFB750', '#F4E64C', '#76DC66', '#83D6FD', '#E483F3'];

    scheduleData?.trip_days?.forEach((dayItem, dayIndex) => {
      for (let i = 0; i < scheduleData.trip_days[dayIndex].places.length - 1; i += 1) {
        getDistanceAndRoute(
          dayItem?.places[i]?.place_address,
          dayItem?.places[i + 1]?.place_address,
          markerIcons[dayIndex % 7],
          lineColors[dayIndex % 7],
          dayIndex,
          i,
        );
      }
    });
  }, [scheduleData, setDistance, setDuration]);

  if (!isLoaded) return <div>test...</div>;

  return (
    <div>
      {isLoaded && (
        <Search
          panTo={panTo}
          active={active}
          setSelected={setSelected}
          selected={selected}
          onClickClose={onClickClose}
        />
      )}
      <div>
        <GoogleMap
          id="map"
          mapContainerStyle={window.innerWidth > 800
            ? mapContainerStyle : smallScreenMapContainerStyle}
          zoom={10}
          center={center}
          options={options}
          onLoad={onMapLoad}
        />
      </div>
    </div>
  );
}

Map.propTypes = {
  setRecommendList: PropTypes.func,
  onClickClose: PropTypes.func,
  active: PropTypes.bool,
  setSelected: PropTypes.func,
  selected: PropTypes.shape(
    {
      description: PropTypes.string,
      matched_substrings:
      PropTypes.arrayOf(PropTypes.shape({ length: PropTypes.number, offset: PropTypes.number })),
      place_id: PropTypes.string,
      reference: PropTypes.string,
      structured_formatting: PropTypes.shape({
        main_text: PropTypes.string,
        main_text_matched_substrings:
      PropTypes.arrayOf(PropTypes.shape({ length: PropTypes.number, offset: PropTypes.number })),
      }),
      terms: PropTypes.arrayOf(PropTypes.shape({
        offset: PropTypes.number,
        value: PropTypes.string,
      })),
      types: PropTypes.arrayOf(PropTypes.string),
    },
  ),
  scheduleData: PropTypes.shape(
    {
      deleted: PropTypes.bool,
      embark_date: PropTypes.string,
      end_date: PropTypes.string,
      members: PropTypes.arrayOf(PropTypes.string),
      schedule_creator_user_id: PropTypes.string,
      schedule_id: PropTypes.string,
      title: PropTypes.string,
      trip_days: PropTypes.arrayOf(PropTypes.shape({
        places:
        PropTypes.arrayOf(PropTypes.shape({
          place_title: PropTypes.string,
          place_address:
          PropTypes.string,
          stay_time: PropTypes.number,
        })),
      })),
    },
  ),
  setDuration: PropTypes.func,
  setDistance: PropTypes.func,
  mapDisplay: PropTypes.bool,
};

Map.defaultProps = {
  setRecommendList: () => {},
  onClickClose: () => {},
  active: false,
  setSelected: () => {},
  selected: {},
  scheduleData: {},
  setDuration: () => {},
  setDistance: () => {},
  mapDisplay: false,
};

export default Map;
