import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  // getDocs,
  collection, doc,
  setDoc, arrayUnion, updateDoc,
} from 'firebase/firestore';
import db from '../utils/firebase-init';

function ChooseDate() {
  const [embarkDate, setEmbarkDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // const [newScheduleId, setNewScheduleId] = useState('test');
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const navigate = useNavigate();

  // const [searchParams, setSearchParams] = useSearchParams();
  // console.log(searchParams);

  // useNavigate的function

  // function navigateToPlanningPage() {
  //   navigate({ pathname: '/schedule', search: `?id=${newScheduleId}` });
  // }

  // 拿日期相減的天數

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(embarkDate);
  const secondDate = new Date(endDate);
  const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay)); // 加一天
  console.log(diffDays);

  // 新增天數

  const newSchedule = {
    title: newScheduleTitle,
    schedule_id: 1,
    embark_date: embarkDate,
    end_date: endDate,
    trip_days: [],
  };

  useEffect(() => {
    const newDay = {
      places: [],
    };
    Array(3).fill('').forEach(() => {
      newSchedule.trip_days.push(newDay);
    });
  }, [diffDays, newSchedule.trip_days]);

  const newChatRoom = {
    chat_room_id: '',
    schedule_id: '',
    messages: [],
  };

  // user創建行程的時候就要把這個行程推進他的owned_schedules_list array中

  async function setNewScheduleToDb() {
    console.log('您創了一筆新行程唷！');
    const createNewScheduleData = doc(collection(db, 'schedules'));
    // setNewScheduleId(createNewScheduleData.id);
    await setDoc(
      createNewScheduleData,
      ({ ...newSchedule, schedule_id: createNewScheduleData.id }),
      // setNewScheduleId(createNewScheduleData.id),
    );
    // setNewScheduleId(createNewScheduleData.id);
    navigate({ pathname: '/schedule', search: `?id=${createNewScheduleData.id}` });
    // console.log(newScheduleId);
    const createNewChatRoomData = doc(collection(db, 'chat_rooms'));
    await setDoc(
      createNewChatRoomData,
      // eslint-disable-next-line max-len
      ({ ...newChatRoom, schedule_id: createNewScheduleData.id, chat_room_id: createNewChatRoomData.id }),
    );
    const userOwnedScheduleArray = doc(db, 'users', '4upu03jk1cAjA0ZbAAJH');
    // Atomically add a new region to the "regions" array field.
    await updateDoc(userOwnedScheduleArray, {
      owned_schedule_ids: arrayUnion(createNewScheduleData.id),
    });
  }
  // console.log(newScheduleId);

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
      <button type="button" onClick={() => setNewScheduleToDb()}>
        OK
        {/* <Link to={`/schedule?id=${newScheduleId}`}> OK!</Link> */}
      </button>
    </>
  );
}

export default ChooseDate;
