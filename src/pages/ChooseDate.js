import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ChooseDate() {
  const [embarkDate, setEmbarkDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
      <button type="button">
        <Link to={`/schedule?from=${embarkDate}&to=${endDate}`}>OK!</Link>
      </button>
    </>
  );
}

export default ChooseDate;
