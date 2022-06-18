import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ChooseDate() {
  const [embarkDate, setEmbarkDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [newScheduleTitle, setNewScheduleTitle] = useState('');

  return (
    <>
      <div>
        旅程名稱：
        <input
          required
          type="text"
          value={newScheduleTitle}
          onChange={(e) => setNewScheduleTitle(e.target.value)}
        />
      </div>
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
        <Link to={`/schedule?title=${newScheduleTitle}&from=${embarkDate}&to=${endDate}`}>OK!</Link>
      </button>
    </>
  );
}

export default ChooseDate;
