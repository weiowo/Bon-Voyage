import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  collection, doc,
  setDoc, arrayUnion, updateDoc,
} from 'firebase/firestore';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import styled from 'styled-components/macro';
import db from '../utils/firebase-init';
import UserContext from '../components/UserContextComponent';
import 'react-datepicker/dist/react-datepicker.css';
import TRAVEL_BG from './images/travel2.jpg';

const CloseModalButton = styled.button`
  display:flex;
  align-items:center;
  justify-content:center;
  height:25px;
  width:25px;
  position:absolute;
  right:20px;
  top:20px;
  text-align:center;
  border:none;
  border-radius:50%;
  background-color:black;
  color:white;
  cursor:pointer;
  @media screen and (max-width:400px){
    right:15px;
    top:15px;
  }
`;

const ModelBox = styled.div`
  width:700px;
  height:500px;
  background-color:white;
  position:relative;
  z-index:10;
  border-radius:20px;
  align-items:center;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:20px;
  @media screen and (max-width:800px){
    width:300px;
    height:350px;
  }
`;

const TripTitleAndInputArea = styled.div`
  width:80%;
  height:50px;
  display:flex;
  align-items:center;
  justify-content:center;
  @media screen and (max-width:800px){
  height:auto;
  }
`;

const DatePickerWrapper = styled.div`
  width:100%;
  height:auto;
  display:flex;
  gap:20px;
  justify-content:center;
  @media screen and (max-width:800px){
    display:none;
  }
`;

const TripTitleInput = styled.input`
  width: 70%;
  height:22px;
  font-weight:500;
  font-size:18px;
  border:none;
  background-color:transparent;
  border-bottom:1px solid black;
  outline:none;
  padding-left:10px;
  padding-left:5px;
  @media screen and (max-width:800px){
    font-size:16px;
  }
`;

const EmbarkDateWrpper = styled.div`
  display:flex;
  flex-direction:column;
  width:35%;
  height:auto;
  gap:10px;
`;

const EmbarkEndDateTitle = styled.div`
  width:100%;
  font-weight:550;
  font-size:16px;
  color:grey;
  @media screen and (max-width:800px){
    font-size:15px;
  }
`;

const ModalBackgroud = styled.div`
  width:100vw;
  height:100vh;
  position:fixed;
  display:flex;
  justify-content:center;
  align-items:center;
  background-image: url(${TRAVEL_BG});
  background-size:cover;
  background-repeat: no-repeat;
  background-color: rgb(0, 0, 0, 0.2);
  background-blend-mode: multiply;
  background-position:center;
`;

const ConfirmedButton = styled.button`
  width:80px;
  height:30px;
  background-color:#296D98;
  color:white;
  font-size:14px;
  font-weight:600;
  border:none;
  border-radius:5px;
  cursor:pointer;
`;

const SmallCalendarWrapper = styled.div`
  display:none;
  @media screen and (max-width:800px){
    display:flex;
    width:80%;
    height:50%;
    flex-direction:column;
    gap:10px;
    align-items:center;
    justify-content:center;
  }
`;

const SmallCalendarStyle = styled.div`
  border-radius:10px;
  height:50px;
  width:200px;
  background-color:red;
`;

function ChooseDate() {
  const [startDate, setStartDate] = useState(new Date());
  console.log('start', startDate);
  const [finishDate, setFinishDate] = useState(startDate);
  console.log('finish', finishDate);
  const user = useContext(UserContext);
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const navigate = useNavigate();

  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(Math.abs((startDate - finishDate) / oneDay));

  const newSchedule = {
    schedule_creator_user_id: user.uid,
    title: newScheduleTitle,
    schedule_id: 1,
    embark_date: startDate.toISOString().split('T')[0],
    end_date: finishDate.toISOString().split('T')[0],
    trip_days: [{ places: [] }],
    members: [
      user.uid,
    ],
    deleted: false,
  };

  useEffect(() => {
    if (!diffDays) { return; }
    const newDay = {
      places: [],
    };
    Array(diffDays)?.fill('').forEach(() => {
      newSchedule.trip_days.push(newDay);
    });
  }, [diffDays, newSchedule.trip_days]);

  const newChatRoom = {
    chat_room_id: '',
    schedule_id: '',
    messages: [],
    creator_user_id: user.uid,
  };

  async function setNewScheduleToDb() {
    if (newScheduleTitle === '') {
      Swal.fire({
        text: '請填寫旅程名稱！',
        icon: 'warning',
      });
    } else {
      const createNewScheduleData = doc(collection(db, 'schedules'));
      await setDoc(
        createNewScheduleData,
        ({ ...newSchedule, schedule_id: createNewScheduleData.id }),
      );
      navigate({ pathname: '/schedule', search: `?id=${createNewScheduleData.id}` });
      const createNewChatRoomData = doc(collection(db, 'chat_rooms'));
      await setDoc(
        createNewChatRoomData,
        ({
          ...newChatRoom,
          schedule_id: createNewScheduleData.id,
          chat_room_id: createNewChatRoomData.id,
        }),
      );
      const userOwnedScheduleArray = doc(db, 'users', user.uid);
      await updateDoc(userOwnedScheduleArray, {
        owned_schedule_ids: arrayUnion(createNewScheduleData.id),
      });
    }
  }

  return (
    <ModalBackgroud>
      <ModelBox>
        <Link to="/my-schedules">
          <CloseModalButton>X</CloseModalButton>
        </Link>
        <TripTitleAndInputArea>
          <TripTitleInput
            required
            type="text"
            placeholder="請填寫旅程名稱..."
            value={newScheduleTitle}
            onChange={(e) => {
              setNewScheduleTitle(e.target.value);
            }}
          />
        </TripTitleAndInputArea>
        <DatePickerWrapper>
          <EmbarkDateWrpper>
            <EmbarkEndDateTitle>請選擇出發日期</EmbarkEndDateTitle>
            <DatePicker
              dateFormat="yyyy/MM/dd"
              selected={startDate}
              onChange={(date) => { setStartDate(date); setFinishDate(date); }}
              selectsStart
              startDate={startDate}
              endDate={finishDate}
              inline
            />
          </EmbarkDateWrpper>
          <EmbarkDateWrpper>
            <EmbarkEndDateTitle>請選擇結束日期</EmbarkEndDateTitle>
            <DatePicker
              dateFormat="yyyy/MM/dd"
              selected={finishDate}
              onChange={(date) => setFinishDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={finishDate}
              minDate={startDate}
              inline
            />
          </EmbarkDateWrpper>
        </DatePickerWrapper>
        <SmallCalendarWrapper>
          <EmbarkEndDateTitle>請選擇出發日期</EmbarkEndDateTitle>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            selected={startDate}
            onChange={(date) => { setStartDate(date); setFinishDate(date); }}
            selectsStart
            startDate={startDate}
            endDate={finishDate}
            calendarContainer={SmallCalendarStyle}
          />
          <EmbarkEndDateTitle>請選擇結束日期</EmbarkEndDateTitle>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            selected={finishDate}
            onChange={(date) => setFinishDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={finishDate}
            minDate={startDate}
            calendarContainer={SmallCalendarStyle}
          />
        </SmallCalendarWrapper>
        <ConfirmedButton type="button" onClick={() => setNewScheduleToDb()}>
          OK
        </ConfirmedButton>
      </ModelBox>

    </ModalBackgroud>
  );
}

export default ChooseDate;
