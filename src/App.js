import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
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
  return (
    <div className="App">
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/choose-date" element={<ChooseDate />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/my-schedules" element={<MySchedules />} />
          <Route path="/map-new" element={<Map />} />
          <Route path="/home-search" element={<SearchHome />} />
          <Route path="/city" element={<City />} />
          <Route path="/place-modal" element={<PlaceModal />} />
          <Route path="/carousel" element={<CardsCarousel />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
