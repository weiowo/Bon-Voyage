/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable no-new */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useNavigate } from 'react-router-dom';
// import {
//   GoogleMap, useLoadScript,
// } from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
// import onClickOutside from 'react-onclickoutside';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import HomeBanner from './images/index_banner.png';
import HeaderComponent
  from '../components/Header';
import CardsCarousel from './CardCarousel';

const HomeTopAreaWrapper = styled.div`
width:100vw;
height:auto;
display:flex;
flex-direction:column;
align-items:center;
`;

const HomeBannerPhoto = styled.img`
width:100vw;
height:auto;
position:relative;
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
top:530px;
background-color:rgba(255, 255, 255, 0.4);
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
box-shadow
// border-bottom-left-radius:20px;
// border-bottom-right-radius:20px;

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
postition:absolute;
cursor:pointer;
&:hover {
  color:white;
  background-color:#67B7D1;
}`;

// const SearchInputAndResults

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
`;

// google相關

const libraries = ['places'];

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

function SearchAtHomePage({ option, setOption }) {
  const navigate = useNavigate();

  // const [Latlng, setLatlng] = useState('');
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions:
    /* Define search scope here */
    { types: ['(cities)'] },
    debounce: 300,
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = (selected_place_at_homePage) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    // const selected_place_data_at_homePage = JSON.stringify(selected_place_at_homePage);
    setValue(selected_place_at_homePage.description, false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getGeocode({ address: selected_place_at_homePage.description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        console.log('拿到經緯度囉');
        console.log({ lat, lng });
        console.log(selected_place_at_homePage.structured_formatting.main_text);
        navigate({ pathname: '/city', search: `?lat=${lat}&lng=${lng}&city=${selected_place_at_homePage.structured_formatting.main_text}&option=${option}` });
        searchNearby({ lat, lng });
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
  };

  const renderSuggestions = () => data.map((suggestion) => {
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
        <OptionForm htmlFor="temp-id" className="search-options-form">
          <label htmlFor="temp-id" className="search-options-title" />
          <OptionSelect
            id="temp-id"
            className="search-options"
            value={option}
            onChange={(event) => {
              setOption(event.target.value);
            }}
          >
            <option id="temp-id" className="search-option-all" value="all">
              全部
            </option>
            <option id="temp-id" className="search-option-lodging" value="lodging">
              飯店
            </option>
            <option id="temp-id" className="search-option-restaurant" value="restaurant">
              餐廳
            </option>
            <option id="temp-id" className="search-option-landmark" value="tourist_attraction">
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
          placeholder="請輸入想查詢的城市名稱OWO....."
        />
      </SearchBarLittleWrapper>
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && <Ulist>{renderSuggestions()}</Ulist>}
    </SearchBarBackground>
  );
}

function HomePageWithGoogleMap() {
  // const [query, setQuery] = useState('');
  const [currentLatLng, setCurrentLatLng] = useState({});
  console.log(currentLatLng);
  const [option, setOption] = useState('all'); // 預設想放'全部'
  // const [nearbyData, setNearbyData] = useState({});
  // console.log(nearbyData);
  const [currentNearbyAttraction, setCurrentNearbyAttraction] = useState([]);
  console.log('我在cardCarouselpage', currentNearbyAttraction);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // 拿使用者現有位置

  function getCurrentLatLng() {
    if ('geolocation' in navigator) {
      console.log('geolocation is available');
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        setCurrentLatLng({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    } else {
      console.log('geolocation is not available');
    }
  }
  useEffect(() => {
    getCurrentLatLng();
  }, []);

  // 拿到使用者的經緯度後，從這邊去查周邊的tourist attraction

  const searchNearby = useCallback(() => {
    console.log('searchNearby');
    const a = new Date();
    // option all, landmark
    const request = {
      location: currentLatLng,
      radius: '2000',
      type: ['tourist_attraction', 'restaurant'],
    };

    // 如果只選到一種，type就會只放那種
    // 如果選「全部」，那就會query三次，獲取20*3筆結果！

    function callback(results, status) {
      console.log(request, 'home');
      console.log('callback', results, status, google.maps.places.PlacesServiceStatus.OK);
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log('okkkkkkkkk', results);
        setCurrentNearbyAttraction(results);
      }
      const b = new Date();
      console.log('searchNearby', b - a);
    }

    const service = new google.maps.places.PlacesService(mapRef.current);
    console.log(service);
    service.nearbySearch(request, callback);
  }, [currentLatLng]);

  useEffect(() => {
    if (!isLoaded) return;
    // if (!nearbyData) return;
    searchNearby();
    // setTimeout(() => {
    //   searchNearby();
    // }, 1000);
  }, [searchNearby, isLoaded]);

  if (!isLoaded) return <div>沒有成功...</div>;

  return (
    <>
      <HomeTopAreaWrapper>
        <HeaderComponent />
        <HomeBannerPhoto src={HomeBanner} />
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
      <CardsCarousel currentNearbyAttraction={currentNearbyAttraction} />
    </>
  );
}

function Home() {
  return (
    <HomePageWithGoogleMap />

  );
}

export default Home;

SearchAtHomePage.propTypes = {
  option: PropTypes.string.isRequired,
  setOption: PropTypes.func.isRequired,
};

// SearchAtHomePage.propTypes = {
//   panTo:PropTypes.func
// };

// 自己建立行程後，把資料送到schedules-members的db
// 還是直接放在scheduleData的immer裡面就好？？
// 同時把這個行程id，送到這個user的行程array

// 在別人按下確認邀請後，做一樣的事

// 日期：放進去是放string，拿出來也是string
// 拿出來後先把string轉成milliseconds，然後按下加一天的話就加上一天的milliseconds

// 資料：先搜尋資料後拿到place_id，再用這個place_id去拿它的detail，再用這個detail中的photo_reference去拿照片

// useEffect(() => {
//   fetch('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyCcEAICVrVkj_NJ6NU-aYqVMxHFfjrOV6o')
//     .then((response) => {
//       console.log(response);
//       return response.json();
//     }).then((jsonData) => {
//       console.log(jsonData);
//       window.localStorage.setItem('PlcesSearched', jsonData);
//     }).catch((err) => {
//       console.log('錯誤:', err);
//     });
// }, []);
