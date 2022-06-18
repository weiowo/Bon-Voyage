/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import styled from 'styled-components/macro';
import React, { useEffect } from 'react';
import {
  getDocs, collection, doc, getDoc,
//   setDoc,
} from 'firebase/firestore';
import { useImmer } from 'use-immer';
import { useLocation } from 'react-router-dom';
import db from '../utils/firebase-init';
// import testScheduleData from './testSchedule';
// import Map from './Map';
import AddAndSearch
  from '../components/AddAndSearch';

const ScheduleWrapper = styled.div`
    display:flex;
    width:100%;
    height:100%;
    gap:30px;
    `;

const LeftContainer = styled.div`
display:flex;
flex-direction:column;
align-items:center;
width:50vw;
height:100vh;
`;

const RightContainer = styled.div`
width:50vw;
height:100vh;
`;

const DayContainer = styled.div`
width:50vw;
height:auto;
border: 1px solid black;
display:flex;
flex-direction:column;
align-items:center;
`;

const PlaceContainer = styled.div`
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
width:40vw;
height:auto;
border:red solid 1px;
`;

const InputBox = styled.div`
display:flex;
align-items:center;
justify-content:space-between;
width:28vw;
height:30px;
`;

const DateContainer = styled.div`
display:flex;
width:50vw;
gap:30px;
`;

// 拿user資料並放入list
// async function getUser() {
//   const querySnapshot = await getDocs(collection(db, 'users'));
//   const UserList = querySnapshot.docs.map((item) => item.data());
//   console.log(UserList);
//   return UserList;
// }

// 嘗試放schedule資料到firestore中
// 先創建資料再set上去，就可以拿到流水號
// 把流水號設定成這筆schedule的id

// async function setSchedule() {
//   const createData = doc(collection(db, 'schedules'));
//   await setDoc(createData, ({ ...testScheduleData, schedule_id: createData.id }));
// }
// setSchedule();

// 拿日期相減的天數

// const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
// const firstDate = new Date(startDate);
// const secondDate = new Date(finishDate);
// const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay)); // 加一天
// console.log(diffDays);

// eslint-disable-next-line no-unused-vars
function Schedule() {
  const [scheduleData, updateScheduleData] = useImmer();
  // 拿到所有的schedule資料並放入list
  async function getSchedule() {
    const querySnapshot = await getDocs(collection(db, 'schedules'));
    const ScheduleList = querySnapshot.docs.map((item) => item.data());
    console.log(ScheduleList);
  }

  // 如果是建立新行程，則從url拿出發日期與結束日期
  //   const search = useLocation().search; 為何這樣寫不行?
  const { search } = useLocation();
  const embarkDateFromUrl = new URLSearchParams(search).get('from');
  const endDateFromUrl = new URLSearchParams(search).get('to');
  const titleFromUrl = new URLSearchParams(search).get('title');
  console.log(embarkDateFromUrl);
  console.log(endDateFromUrl);

  // 拿日期相減的天數

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(embarkDateFromUrl);
  const secondDate = new Date(endDateFromUrl);
  const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay)); // 加一天
  console.log(diffDays);

  // 如果是選擇舊行程，則從資料庫拿出發與結束日期
  const existScheduleId = new URLSearchParams(search).get('id');
  console.log(existScheduleId);

  useEffect(() => {
    // 拿指定一個id的單一筆schedule資料
    async function getCertainSchedule() {
      const docRef = doc(db, 'schedules', existScheduleId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());

        updateScheduleData(docSnap.data());
        console.log(scheduleData);
      } else {
      // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    }
    getSchedule();
    getCertainSchedule();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateScheduleData]);

  const newPlace = {
    place_title: '',
    place_address: '',
    stay_time: '',
  };

  // 新增景點：按下去後要出現可以搜尋景點的框框
  // 出現景點框框的component

  // 出現景點框框的component

  //   function chooseSearch(){

  //   }

  // 新增景點在某一天

  function addPlaceInDay(dayIndex) {
    updateScheduleData((draft) => {
      draft.trip_days[dayIndex].places.push(newPlace);
    });
  }

  // 新增天數

  const newDay = {
    places: [],
  };
  function addDayInSchedule() {
    updateScheduleData((draft) => {
      draft.trip_days.push(newDay);
    });
  }

  // function addPlace(index) {
  //   console.log('哈哈');
  //   scheduleData.trip_days[index].places.push(newPlace);
  // }
  //   const newTripDetails = scheduleData.trip_days.map((detail, i) => {
  //     if (index === i) {
  //       const newDetail = { ...detail, places: [...detail.places, newPlace] };
  //       return newDetail;
  //     }
  //     return detail;
  //   });
  //   const newData = [{
  //     ...scheduleData,
  //     trip_days: newTripDetails,
  //   }];
  //   console.log(newData);
  //   setScheduleData(newData);
  // }

  // function updateTitle(title) {
  //   updateScheduleData((draft) => {
  //     draft.title = title;
  //   });
  // }

  scheduleData ? console.log('aaaaa', scheduleData.title) : console.log('還沒拿到行程');

  function updatePlaceTitle(placeTitle, dayIndex, placeIndex) {
    updateScheduleData((draft) => {
      draft.trip_days[dayIndex].places[placeIndex].place_title = placeTitle;
    });
  }

  function updatePlaceAddress(placeAddress, dayIndex, placeIndex) {
    updateScheduleData((draft) => {
      draft.trip_days[dayIndex].places[placeIndex].place_address = placeAddress;
    });
  }

  function updateStayTime(stayTime, dayIndex, placeIndex) {
    updateScheduleData((draft) => {
      draft.trip_days[dayIndex].places[placeIndex].stay_time = stayTime;
    });
  }

  // 拿一週的哪一天

  const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const dFromUrl = new Date(embarkDateFromUrl);

  // let fireStoreTimestamp;
  // let javascriptDate;
  // scheduleData ? fireStoreTimestamp = scheduleData.embark_date : '';
  // scheduleData ? javascriptDate = fireStoreTimestamp.toDate() : '';
  // console.log(javascriptDate);
  // scheduleData ? console.log('出發囉', scheduleData.embark_date) : console.log('還沒拿到行程');

  // 先把從database拿出來的millisecond轉為可看的日淇
  // let day = weekday[d.getDay()];
  const weekDayFromUrl = dFromUrl.getDay();
  // const weekDayFromDB = scheduleData ? dFromDb.getDay() : '';

  // 拿一週哪一天用這種方式：{weekday[(initIndex + index) % 7]}

  // eslint-disable-next-line no-unused-vars
  const newSchedule = {
    title: titleFromUrl,
    schedule_id: 1,
    embark_date:
    {
      seconds: embarkDateFromUrl,
    },
    end_date:
    {
      seconds: endDateFromUrl,
    },
    trip_days: [],
  };

  if (!scheduleData) {
    Array(diffDays).fill('').forEach(() => {
      newSchedule.trip_days.push(newDay);
    });

    updateScheduleData(newSchedule);
  }
  console.log(scheduleData);

  console.log(Array(diffDays));
  console.log(newSchedule);

  return (
    <ScheduleWrapper className="test">
      <AddAndSearch />
      <LeftContainer>
        <p>
          行程title：
          {scheduleData ? scheduleData.title : ''}
        </p>
        <DateContainer>
          <p>
            出發時間：
            {scheduleData ? scheduleData.embark_date.seconds : ''}
          </p>
          <p>
            結束時間：
            {scheduleData ? scheduleData.end_date.seconds : '' }
          </p>
        </DateContainer>
        {' '}
        <div className="schedule-boxes">
          <button type="button" onClick={() => addDayInSchedule()}>新增天數</button>
          {scheduleData ? scheduleData.trip_days.map((dayItem, dayIndex) => (
            <DayContainer>
              <p>
                第
                {dayIndex + 1}
                天/
                {weekday[(embarkDateFromUrl ? weekDayFromUrl + dayIndex
                  : dayIndex) % 7] }
              </p>
              {/* <input
              onChange={(e) => {
                updateTitle(e.target.value);
              }}
              value={dayItem.title}
            /> */}
              <div>
                {dayItem.places ? dayItem.places.map((placeItem, placeIndex) => (
                  <PlaceContainer>
                    <InputBox>
                      <p>
                        第
                        {placeIndex + 1}
                        個景點：
                      </p>
                      <input
                        value={placeItem.place_title}
                        onChange={(e) => {
                          updatePlaceTitle(e.target.value, dayIndex, placeIndex);
                        }}
                      />
                    </InputBox>
                    <InputBox>
                      <p>停留時間：</p>
                      <input
                        value={placeItem.stay_time}
                        onChange={(e) => {
                          updateStayTime(e.target.value, dayIndex, placeIndex);
                        }}
                      />
                    </InputBox>
                    <InputBox>
                      <p>地址：</p>
                      <input
                        value={placeItem.place_address}
                        onChange={(e) => {
                          updatePlaceAddress(e.target.value, dayIndex, placeIndex);
                        }}
                      />
                    </InputBox>
                  </PlaceContainer>
                ))
                  : (
                    <div>還沒有地點ㄛ，請新增景點</div>
                  )}
              </div>
              <button type="button" onClick={() => addPlaceInDay(dayIndex)}>新增行程</button>
            </DayContainer>
          ))
          // 這裡是新創建行程的地方
            : ''}
        </div>
      </LeftContainer>
      <RightContainer>
        {/* <Map /> */}
      </RightContainer>
    </ScheduleWrapper>
  );
}

export default Schedule;
