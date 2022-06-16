import styled from 'styled-components/macro';
import React, { useEffect } from 'react';
import {
  getDocs, collection, doc, getDoc, setDoc,
} from 'firebase/firestore';
// import produce from 'immer';
import { useImmer } from 'use-immer';
// import Data from './Data';
import db from '../utils/firebase-init';
// import testScheduleData from './testSchedule';
import testScheduleData from './testSchedule';

const ScheduleWrapper = styled.div`
    width:80vw;
    height:80vh;
    border:1px solid red;
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

async function setSchedule() {
  const createData = doc(collection(db, 'test'));
  await setDoc(createData, ({ ...testScheduleData, schedule_id: createData.id }));
}
setSchedule();

// 拿日期相減的天數

// const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
// const firstDate = new Date(startDate);
// const secondDate = new Date(finishDate);
// const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay)); // 加一天
// console.log(diffDays);

// 拿一週的哪一天

// const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
// const d = new Date(embarkDate);
// // let day = weekday[d.getDay()];
// const initIndex = d.getDay();
// 拿一週哪一天用這種方式：{weekday[(initIndex + index) % 7]}

function Schedule() {
  const [scheduleData, updateScheduleData] = useImmer();

  // 拿到所有的schedule資料並放入list
  async function getSchedule() {
    const querySnapshot = await getDocs(collection(db, 'schedules'));
    const ScheduleList = querySnapshot.docs.map((item) => item.data());
    console.log(ScheduleList);
  }

  useEffect(() => {
    // 拿指定一個id的單一筆schedule資料
    async function getCertainSchedule() {
      const docRef = doc(db, 'schedules', 'FjuVw0TTVDXcQgAa8QFt');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());

        updateScheduleData(docSnap.data());
      } else {
      // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    }
    getSchedule();
    getCertainSchedule();
  }, [updateScheduleData]);

  const newPlace = {
    place_title: '',
    place_address: '',
    stay_time: '',
  };

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

  console.log('aaaaa', scheduleData);

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

  return (
    <ScheduleWrapper className="test">
      <div className="date-area">
        <h2>
          出發時間：
        </h2>
        <h2>
          結束時間：
        </h2>
      </div>
      <div className="schedule-boxes">
        <button type="button" onClick={() => addDayInSchedule()}>新增天數</button>
        {scheduleData ? scheduleData.trip_days.map((dayItem, dayIndex) => (
          <div className="schedule-box" id={dayIndex + 1} style={{ width: '50vw', height: 'auto', border: '2px solid black' }}>
            <h2>
              第
              {dayIndex + 1}
              天/
            </h2>
            {/* <input
              onChange={(e) => {
                updateTitle(e.target.value);
              }}
              value={dayItem.title}
            /> */}
            <div>
              {dayItem.places ? dayItem.places.map((placeItem, placeIndex) => (
                <div className="place-box" style={{ border: 'red solid 2px' }}>
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
                  <p>停留時間：</p>
                  <input
                    value={placeItem.stay_time}
                    onChange={(e) => {
                      updateStayTime(e.target.value, dayIndex, placeIndex);
                    }}
                  />
                  <p>地址：</p>
                  <input
                    value={placeItem.place_address}
                    onChange={(e) => {
                      updatePlaceAddress(e.target.value, dayIndex, placeIndex);
                    }}
                  />
                </div>
              ))
                : (
                  <div>還沒有地點ㄛ，請新增景點</div>
                )}
            </div>
            <button type="button" onClick={() => addPlaceInDay(dayIndex)}>新增行程</button>
          </div>
        )) : <div>沒有資料</div>}
      </div>

    </ScheduleWrapper>
  );
}

export default Schedule;
