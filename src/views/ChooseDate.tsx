import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from '@/lib/router';
import {
  collection, doc,
  setDoc, arrayUnion, updateDoc,
} from 'firebase/firestore';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import tw from '@/lib/tw';
import db from '../utils/firebase-init';
import UserContext from '../components/UserContextComponent';
import 'react-datepicker/dist/react-datepicker.css';

const CloseModalButton = tw.button`
  flex items-center justify-center h-[25px] w-[25px] absolute right-[20px] top-[20px]
  text-center [border:none] rounded-[50%] bg-black text-white cursor-pointer
  max-mobile-xs:right-[15px] max-mobile-xs:top-[15px]
`;

const ModelBox = tw.div`
  w-[700px] h-[500px] bg-white relative z-[10] rounded-[20px] items-center flex flex-col
  justify-center gap-[20px] max-tablet:w-[300px] max-tablet:h-[350px]
`;

const TripTitleAndInputArea = tw.div`
  w-[80%] h-[50px] flex items-center justify-center max-tablet:h-auto
`;

const DatePickerWrapper = tw.div`
  w-full h-auto flex gap-[20px] justify-center max-tablet:hidden
`;

const TripTitleInput = tw.input`
  w-[70%] h-[22px] font-medium text-[18px] [border-top:none] [border-right:none]
  [border-left:none] bg-transparent [border-bottom:1px_solid_black] [outline:none] pl-[5px]
  max-tablet:text-[16px]
`;

const EmbarkDateWrpper = tw.div`
  flex flex-col w-[35%] h-auto gap-[10px]
`;

const EmbarkEndDateTitle = tw.div`
  w-full [font-weight:550] text-[16px] [color:grey] max-tablet:text-[15px]
`;

const ModalBackgroud = tw.div`
  w-[100vw] h-[100vh] fixed flex justify-center items-center bg-[url(/images/travel2.webp)]
  bg-cover bg-no-repeat bg-[rgb(0,0,0,0.2)] [background-blend-mode:multiply] bg-center
`;

const ConfirmedButton = tw.button`
  w-[80px] h-[30px] bg-[#296D98] text-white text-[14px] font-semibold [border:none]
  rounded-[5px] cursor-pointer
`;

const SmallCalendarWrapper = tw.div`
  hidden max-tablet:flex max-tablet:w-[80%] max-tablet:h-[50%] max-tablet:flex-col
  max-tablet:gap-[10px] max-tablet:items-center max-tablet:justify-center
`;

const SmallCalendarStyle = tw.div`
  rounded-[10px] h-[50px] w-[200px] [background-color:red]
`;

function ChooseDate() {
  const [startDate, setStartDate] = useState(new Date());
  const [finishDate, setFinishDate] = useState(startDate);
  const user = useContext(UserContext);
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const navigate = useNavigate();

  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(Math.abs((startDate.getTime() - finishDate.getTime()) / oneDay));

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
    if (!user.uid) return;
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
              onChange={(date: Date | null) => {
                if (date) { setStartDate(date); setFinishDate(date); }
              }}
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
              onChange={(date: Date | null) => { if (date) setFinishDate(date); }}
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
            onChange={(date: Date | null) => {
              if (date) { setStartDate(date); setFinishDate(date); }
            }}
            selectsStart
            startDate={startDate}
            endDate={finishDate}
            calendarContainer={SmallCalendarStyle}
          />
          <EmbarkEndDateTitle>請選擇結束日期</EmbarkEndDateTitle>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            selected={finishDate}
            onChange={(date: Date | null) => { if (date) setFinishDate(date); }}
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
