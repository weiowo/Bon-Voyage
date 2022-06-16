import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ChooseDate() {
  const [embarkDate, setEmbarkDate] = useState('');
  const [endDate, setEndDate] = useState('');

  function choosed() {
    console.log(embarkDate);
    console.log(endDate);
    localStorage.setItem('embarkDate', embarkDate);
    localStorage.setItem('endDate', endDate);
  }

  return (
    <>
      <div>
        開始日期
        <input
          required
          type="date"
          value={embarkDate}
          onChange={(e) => setEmbarkDate(e.target.value)}
        />
      </div>
      <div>
        結束日期
        <input
          required
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button type="button" onClick={choosed}>
        <Link to="/schedule">OK!</Link>
      </button>
    </>
  );
}

export default ChooseDate;
