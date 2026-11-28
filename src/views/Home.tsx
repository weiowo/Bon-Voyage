import { useNavigate } from '@/lib/router';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { GoogleMap, useLoadScript, type LoadScriptProps } from '@react-google-maps/api';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import styled from 'styled-components';
import HeaderComponent
  from '../components/Headers/Header';
// import Carousel from '../components/Carousel';
import CategoryAreaInHome from './CategoryInHome';
import CityAreaInHomePage from '../components/CityInHome';
import ArticlesInHome from '../components/ArticlesInHome';
import './animation.css';
import Footer from '../components/Footer';
import type { LatLng } from '../types';

const DEFAULT_LAT_LNG: LatLng = { lat: 25.03746, lng: 121.564558 };

const HomeTopAreaWrapper = styled.div`
  width:100vw;
  height:100vh;
  display:flex;
  flex-direction:column;
  background-image: url(https://firebasestorage.googleapis.com/v0/b/bonvoyage-f5e7d.appspot.com/o/images%2Findex_banner.png?alt=media&token=6f0ccfc9-9f09-42c5-8a08-7f23af64b4c9);
  align-items:center;
  position:relative;
  background-size:cover;
  background-repeat: no-repeat;
  background-blend-mode: multiply;
  @media screen and (max-width:800px){
    height:70vw;
  }
`;

const SearchBarBackground = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  width:73vw;
  height:90px;
  border-radius:15px;
  position:absolute;
  bottom:30px;
  background-color:rgba(255, 255, 255, 0.4);
  @media screen and (max-width:600px){
    width:86vw;
    height:73px;
  }
`;

const SearchBarLittleWrapper = styled.div`
  border-radius:10px;
  display:flex;
  align-items:center;
  width:70vw;
  justify-content:space-between;
  height:50px;
  background-color:white;
  padding-left:20px;
  padding-right:20px;
  position:absolute;
  @media screen and (max-width:600px){
    width:80vw;
  }
`;

const SearchInput = styled.input`
  display:flex;
  flex-direction:column;
  width:70vw;
  height:30px;
  border:none;
  height:50px;
  cursor:pointer;
  font-size:17px;
  box-sizing:border-box;
  padding-left:10px;
  outline: none;
  @media screen and (max-width:600px){
    width:80%;
  }
`;

const Ulist = styled.ul`
  display:flex;
  flex-direction:column;
  align-items:center;
  width:70vw;
  height:auto;
  z-index:10;
  position:absolute;
  top:60px;
  background-color:white;
  padding-left:0px;
  border:1px grey solid;
  margin-top:15px;
  margin-bottom:0px;
  border-radius:15px;
  @media screen and (max-width:600px){
    width:80vw;
  }
`;

const List = styled.li`
width:69vw;
font-weight:500;
margin-top:2px;
margin-bottom:2px;
height:30px;
border-radius:10px;
display:flex;
justify-content:center;
align-items:center;
cursor:pointer;
&:hover {
  color:white;
  background-color:#67B7D1;
}
@media screen and (max-width:600px){
  width:78vw;
}`;

const OptionForm = styled.form`
width:70px;
display:flex;
border:none;
`;

const OptionSelect = styled.select`
width:70px;
border:none;
font-weight:500;
font-size:17px;
margin-left:0px;
outline: none;
@media screen and (max-width:600px){
  width:60px;
}`;

const libraries: LoadScriptProps['libraries'] = ['places'];

const mapContainerStyle = {
  height: '0vh',
  width: '0vw',
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 43.6532,
  lng: -79.3832,
};

interface SearchAtHomePageProps {
  option: string;
  setOption: (option: string) => void;
}

function SearchAtHomePage({ option, setOption }: SearchAtHomePageProps) {
  const navigate = useNavigate();

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions:
    { types: ['(cities)'] },
    debounce: 300,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect = (
    selectedPlaceAtHomePage: google.maps.places.AutocompletePrediction,
  ) => () => {
    setValue(selectedPlaceAtHomePage.description, false);
    clearSuggestions();
    getGeocode({ address: selectedPlaceAtHomePage.description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        navigate({ pathname: '/city', search: `?lat=${lat}&lng=${lng}&city=${selectedPlaceAtHomePage?.structured_formatting.main_text}&option=${option}` });
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  const renderSuggestions = () => data.map((suggestion) => {
    console.log(suggestion);
    const {
      place_id,
      structured_formatting: { main_text, secondary_text },
    } = suggestion;

    return (
      <List style={{ listStyle: 'none' }} key={place_id} onClick={handleSelect(suggestion)}>
        <div>
          {main_text}
          {secondary_text}
        </div>
      </List>
    );
  });

  return (
    <SearchBarBackground>
      <SearchBarLittleWrapper>
        <OptionForm className="search-options-form">
          <label className="search-options-title" />
          <OptionSelect
            id="temp-id"
            className="search-options"
            value={option}
            onChange={(event) => {
              setOption(event.target.value);
            }}
          >
            <option id="all" className="search-option-all" value="all">
              全部
            </option>
            <option id="lodging" className="search-option-lodging" value="lodging">
              飯店
            </option>
            <option id="restaurant" className="search-option-restaurant" value="restaurant">
              餐廳
            </option>
            <option id="tourist_attraction" className="search-option-landmark" value="tourist_attraction">
              景點
            </option>
          </OptionSelect>
        </OptionForm>
        <div style={{
          marginLeft: '10px', height: '50px', width: '1px', backgroundColor: '#D3D3D3',
        }}
        />
        <SearchInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="請輸入城市名稱....."
        />
      </SearchBarLittleWrapper>
      {status === 'OK' && <Ulist>{renderSuggestions()}</Ulist>}
    </SearchBarBackground>
  );
}

interface HomeProps {
  currentLatLng?: LatLng;
}

function Home({ currentLatLng = DEFAULT_LAT_LNG }: HomeProps) {
  const [option, setOption] = useState('all');
  // const [currentNearbyAttraction, setCurrentNearbyAttraction] = useState([]);
  const [LatLng, setLatLng] = useState({ lat: 25.03746, lng: 121.564558 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries,
  });
  const mapRef = useRef<google.maps.Map | undefined>(undefined);
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setIsMapLoaded(true);
  }, []);

  function getCurrentLatLng() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatLng({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    } else {
      console.log('geolocation is not available');
    }
  }
  useEffect(() => {
    getCurrentLatLng();
  }, []);

  const searchNearby = useCallback(() => {
    const request = {
      location: LatLng,
      radius: 2000,
      type: 'tourist_attraction',
    };

    function callback(
      results: google.maps.places.PlaceResult[] | null,
      status: `${google.maps.places.PlacesServiceStatus}`,
    ) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // setCurrentNearbyAttraction(results);
      }
    }

    if (!mapRef.current) return;
    const service = new google.maps.places.PlacesService(mapRef.current);
    service.nearbySearch(request, callback);
  }, [LatLng]);

  useEffect(() => {
    if (!isLoaded || !isMapLoaded) return;
    // if (!nearbyData) return;
    searchNearby();
    // setTimeout(() => {
    //   searchNearby();
    // }, 1000);
  }, [searchNearby, isLoaded, isMapLoaded]);

  if (!isLoaded) {
    return (
      <div className="progress container">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    );
  }

  return (
    <>
      <HomeTopAreaWrapper>
        <HeaderComponent />
        <SearchAtHomePage option={option} setOption={setOption} />
      </HomeTopAreaWrapper>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onLoad={onMapLoad}
      />
      {/* <Carousel currentNearbyAttraction={currentNearbyAttraction} /> */}
      <CategoryAreaInHome currentLatLng={currentLatLng} />
      <CityAreaInHomePage />
      <ArticlesInHome />
      <Footer />
    </>
  );
}

export default Home;
