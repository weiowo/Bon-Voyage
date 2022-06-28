import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import Schedule from './pages/SchedulePlan';
import Home from './pages/Home';
import ChooseDate from './pages/ChooseDate';
import MySchedules from './pages/MySchedules';
import Map from './pages/Map';
import SearchHome from './pages/SearchHome';
import City from './pages/City';
import PlaceModal from './components/PlaceModal';
import CardsCarousel from './pages/CardCarousel';
import CityAreaInHomePage from './components/CityInHome';
import CategoryAreaInHome from './pages/CategoryInHome';
import Category from './pages/Category';

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    };
    body {
        margin: 0;
        font-family: NotoSansTC;
      }
    `;

function App() {
  // state  current location
  const [currentLatLng, setCurrentLatLng] = useState({});
  console.log(currentLatLng);
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

  return (
    <div className="App">
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home currentLatLng={currentLatLng} />} />
          <Route path="/choose-date" element={<ChooseDate />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/my-schedules" element={<MySchedules />} />
          <Route path="/map-new" element={<Map />} />
          <Route path="/home-search" element={<SearchHome />} />
          <Route path="/city" element={<City />} />
          <Route path="/place-modal" element={<PlaceModal />} />
          <Route path="/category-in-home" element={<CategoryAreaInHome currentLatLng={currentLatLng} />} />
          <Route path="/carousel" element={<CardsCarousel />} />
          <Route path="/city-home" element={<CityAreaInHomePage />} />
          <Route path="/category" element={<Category />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
