import React, {
  useRef, useCallback, useEffect,
} from 'react';
import {
  GoogleMap, useLoadScript,
} from '@react-google-maps/api';
import type { Updater } from 'use-immer';
import useMediaQuery from '@/lib/useMediaQuery';
import Search from './Search';
import type { LatLng, RouteInfo, Schedule } from '../types';

const PINK_STAR = '/images/smile_star_pink.webp';
const ORANGE_STAR = '/images/smile_star_orange.webp';
const YELLOW_STAR = '/images/smile_star_yellow.webp';
const GREEN_STAR = '/images/smile_star_green.webp';
const BLUE_STAR = '/images/smile_star_blue.webp';
const PURPLE_STAR = '/images/smile_star_purple.webp';

let service: google.maps.places.PlacesService;

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const center = {
  lat: 25.105497,
  lng: 121.597366,
};

interface MapProps {
  setRecommendList?: (places: google.maps.places.PlaceResult[]) => void;
  onClickClose?: () => void;
  active?: boolean;
  setSelected?: (place: google.maps.places.AutocompletePrediction) => void;
  scheduleData?: Schedule;
  setDuration?: Updater<RouteInfo>;
  setDistance?: Updater<RouteInfo>;
  mapDisplay?: boolean;
}

const noop = () => {};

function Map({
  setRecommendList = noop, onClickClose = noop,
  active = false, setSelected = noop, scheduleData, setDuration = noop, setDistance = noop,
  mapDisplay = false,
}: MapProps) {
  const isSmallScreen = useMediaQuery('(max-width: 800px)');
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries: ['places'],
  });
  const mapRef = useRef<google.maps.Map | undefined>(undefined);

  const mapContainerStyle: React.CSSProperties = {
    height: 'calc( 100vh - 60px)',
    width: '55vw',
    position: 'absolute',
  };

  const smallScreenMapContainerStyle: React.CSSProperties = {
    height: '100vh',
    position: 'fixed',
    top: 0,
    bottom: 0,
    width: '100vw',
    display: mapDisplay ? 'block' : 'none',
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }: LatLng) => {
    if (!mapRef.current) return;
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(12);

    const request = {
      location: { lat, lng },
      radius: 1500,
      type: 'tourist_attraction',
    };

    function callback(
      results: google.maps.places.PlaceResult[] | null,
      status: `${google.maps.places.PlacesServiceStatus}`,
    ) {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setRecommendList(results);
      }
    }

    service = new google.maps.places.PlacesService(mapRef.current);
    service.nearbySearch(request, callback);
  }, [setRecommendList]);

  useEffect(() => {
    if (!scheduleData) { return; }

    function getDistanceAndRoute(
      originPlace: string,
      destinationPlace: string,
      imageSetting: string,
      colorSetting: string,
      dayIndex: number,
      distanceIndex: number,
    ) {
      const request: google.maps.DirectionsRequest = {
        origin: originPlace,
        destination: destinationPlace,
        travelMode: google.maps.TravelMode.DRIVING,
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
      directionsDisplay.setMap(map ?? null);
      directionsService.route(request, (result, status) => {
        const leg = result?.routes[0]?.legs[0];
        if (status === 'OK' && result && leg) {
          setDistance((draft) => {
            if (Array.isArray(draft[dayIndex])) {
              draft[dayIndex][distanceIndex] = (leg.distance?.text ?? '');
            } else {
              draft[dayIndex] = [];
              draft[dayIndex][distanceIndex] = (leg.distance?.text ?? '');
            }
          });
          setDuration((draft) => {
            if (Array.isArray(draft[dayIndex])) {
              draft[dayIndex][distanceIndex] = (leg.duration?.text ?? '');
            } else {
              draft[dayIndex] = [];
              draft[dayIndex][distanceIndex] = (leg.duration?.text ?? '');
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

    const markerIcons = [PINK_STAR, ORANGE_STAR, YELLOW_STAR, GREEN_STAR, BLUE_STAR, PURPLE_STAR];
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
          onClickClose={onClickClose}
        />
      )}
      <div>
        <GoogleMap
          id="map"
          mapContainerStyle={isSmallScreen
            ? smallScreenMapContainerStyle : mapContainerStyle}
          zoom={10}
          center={center}
          options={options}
          onLoad={onMapLoad}
        />
      </div>
    </div>
  );
}

export default Map;
