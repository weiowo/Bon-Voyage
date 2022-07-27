import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import {
  onAuthStateChanged, getAuth,
} from 'firebase/auth';
import Schedule from './pages/SchedulePlan';
import Home from './pages/Home';
import ChooseDate from './pages/ChooseDate';
import MySchedules from './pages/MySchedules';
import Map from './pages/Map';
// import SearchHome from './pages/SearchHome';
import City from './pages/City';
import Carousel from './components/Carousel';
import CityAreaInHomePage from './components/CityInHome';
import CategoryAreaInHome from './pages/CategoryInHome';
import Category from './pages/Category';
import SignIn from './components/SignIn';
import { app } from './utils/firebase-init';
import UserContext from './components/UserContextComponent';
import EditPage from './pages/Edit';
import ShowArticle from './pages/SingleArticle';
import MyArticles from './pages/MyArticles';
import AllArticlePage from './pages/AllArticles';
import Profile from './pages/Profile';
import VR from './pages/VrPage';
import MyLovedArticles from './pages/MyFavorites';
import PageNotFound from './pages/PageNotFound';

export const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }
`;

function App() {
  const [currentLatLng, setCurrentLatLng] = useState({});
  const [user, setUser] = useState('');
  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (userData) => {
      if (userData) {
        setUser(userData);
        console.log('使用者已登入');
      } else {
        console.log('使用者未登入');
      }
    });
  }, [auth, setUser]);

  // 拿使用者現有位置

  function getCurrentLatLng() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLatLng({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  }
  useEffect(() => {
    getCurrentLatLng();
  }, []);

  return (
    <div className="App">
      <GlobalStyle />
      <UserContext.Provider value={user}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home currentLatLng={currentLatLng} />} />
            <Route path="/choose-date" element={<ChooseDate />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/my-schedules" element={<MySchedules />} />
            <Route path="/map-new" element={<Map />} />
            {/* <Route path="/home-search" element={<SearchHome />} /> */}
            <Route path="/city" element={<City />} />
            <Route path="/category-in-home" element={<CategoryAreaInHome currentLatLng={currentLatLng} />} />
            <Route path="/carousel" element={<Carousel />} />
            <Route path="/city-home" element={<CityAreaInHomePage />} />
            <Route path="/category" element={<Category currentLatLng={currentLatLng} />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/edit" element={<EditPage />} />
            <Route path="/article" element={<ShowArticle />} />
            <Route path="/my-articles" element={<MyArticles />} />
            <Route path="/all-articles" element={<AllArticlePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/vr-page" element={<VR />} />
            <Route path="/my-favorites" element={<MyLovedArticles />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
