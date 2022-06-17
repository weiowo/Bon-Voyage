/* eslint-disable no-inner-declarations */
/* eslint-disable no-new */
/* global google */
import React, { useRef, useCallback } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import Search from './Search';

let service;
const libraries = ['places'];

const mapContainerStyle = {
  height: '50vh',
  width: '50vw',
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 43.6532,
  lng: -79.3832,
};

function Map() {
  // eslint-disable-next-line no-unused-vars
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDiMgaWqWF9EWPNOI0zVF1PTxnqjji1gy8',
    libraries,
  });
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(12);
    const map = mapRef.current;

    const request = {
      location: { lat, lng }, // autocomplete搜尋到的地點中心
      radius: '500',
      type: ['restaurant'], // 依據這個中心點往外擴張找餐廳
    };

    service = new google.maps.places.PlacesService(mapRef.current);
    // eslint-disable-next-line no-use-before-define
    service.nearbySearch(request, callback);

    function callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        for (let i = 0; i < results.length; i += 1) {
        //   function createMarker(position) {
        //     new google.maps.Marker({
        //       position,
        //       map,
        //     });
        //   }
        //   createMarker(results[i].geometry.location);
          const place = results[i];
          new google.maps.Marker({
            position: place.geometry.location,
            map,
          });
        }
      }
    }
  }, []);

  //   <script>
  //   var map;
  //   var service;
  //   var infowindow;

  //   function initMap() {
  //   var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

  //   map = new google.maps.Map(document.getElementById('map'), {
  //       center: pyrmont,
  //       zoom: 15
  //       });

  //   var request = {
  //       location: pyrmont,
  //       radius: '700',
  //       type: ['restaurant']
  //   };

  //   service = new google.maps.places.PlacesService(map);
  //   service.nearbySearch(request, callback);
  //   }

  //   function callback(results, status) {
  //   if (status == google.maps.places.PlacesServiceStatus.OK) {
  //       console.log(results);
  //       for (var i = 0; i < results.length; i++) {

  //       createMarker(results[i].geometry.location);
  //       }
  //     }
  //   }
  //   function createMarker(position) {

  //       new google.maps.Marker({
  //           position: position,
  //           map: map
  //       });
  //   }
  //   </script>

  return (
    <div>
      <Search panTo={panTo} />
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

export default Map;
