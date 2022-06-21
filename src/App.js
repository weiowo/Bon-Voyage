import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Schedule from './pages/SchedulePlan';
import CTA from './pages/Home';
import ChooseDate from './pages/ChooseDate';
import MySchedules from './pages/MySchedules';
import MapNewNew from './pages/MapNew2';

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
          <Route path="/" element={<CTA />} />
          <Route path="/choose-date" element={<ChooseDate />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/my-schedules" element={<MySchedules />} />
          <Route path="/map-new" element={<MapNewNew />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
