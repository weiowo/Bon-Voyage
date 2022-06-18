/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import styled from 'styled-components/macro';
import React, { useEffect, useState } from 'react';
import {
  getDocs, collection, doc, getDoc, query, where,
  // setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useImmer } from 'use-immer';
import { useLocation } from 'react-router-dom';
import db from '../utils/firebase-init';
// import testScheduleData from './testSchedule';
import Map from './Map';
// import AddAndSearch
//   from '../components/AddAndSearch';
// import Search from './Search';
// import chatRoomMessagesData from './chat-room-data';

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
display:${(props) => (props.active ? 'none' : 'flex')};
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

const ChatRoom = styled.div`
display:flex;
flex-direction:column;
align-items:center;
width:25vw;
height:200px;
border-radius:5px;
border:blue 2px solid;
`;

const MessagesDisplayArea = styled.div`
height:170px;
width:25vw;
`;

const MessageBox = styled.div`
display:flex;
width:20vw;
height:30px;
border-radius:3px;
border:purple 2px solid;
align-items:center;
align-self:flex-start;
`;

const Name = styled.div`
width:50px;
font-size:12px;
`;

const Message = styled.div`
font-size:12px;
`;

const UserPhoto = styled.div`
width:20px;
height:20px;
background-color:orange;
border-radius:50%;
`;

const EnterArea = styled.div`
width:25vw;
height:40px;
display:flex;
align-items:center;
gap:10px;
justify-content:space-between;
border-top:1px black solid;
padding-left:10px;
padding-right:10px;
`;

const MessageInput = styled.input`
width:20vw;
height:20px;
border-radius:2px;
border: green 1px solid;
`;

const EnterMessageButton = styled.button`
width:auto;
height:20px;
border: green 2px solid;
border-radius:1px;
`;

const AddAndSearchBox = styled.div`
width:70vw;
height:100vh;
background-color:transparent;
display:${(props) => (props.active ? 'block' : 'none')};
`;

// const ResultsArea = styled.div`
// background-color:transparent;
// height:auto;
// width:50vw;
// `;

// const SearchedPlace = styled.div`
// width:200px;
// height:30px;
// background-color:brown;
// color:white;
// border-radius:6px;
// `;

// const RecommendPlaces = styled.div`
// height:auto;
// width:50vw;
// baclground-color:yellow;
// border:2px solid red;
// `;

// const RecommendPlace = styled.div`
// height:auto;
// width:40vw;
// `;

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

// 放行程進去db
// async function setSchedule() {
//   const createData = doc(collection(db, 'chat_rooms'));
//   await setDoc(createData, ({ ...chatRoomMessagesData, chat_room_id: createData.id }));
// }
// setSchedule();

// 放messages進去db

// async function setMessages() {
//   const createData = doc(collection(db, 'chat_rooms'));
//   await setDoc(createData, ({
//     ...chatRoomMessagesData,
//     chat_room_id: createData.id,
//     schedule_id: 123,
//   }));
// }
// setMessages();

// 拿日期相減的天數

// const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
// const firstDate = new Date(startDate);
// const secondDate = new Date(finishDate);
// const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay)); // 加一天
// console.log(diffDays);

// eslint-disable-next-line no-unused-vars
function Schedule() {
  const [scheduleData, updateScheduleData] = useImmer();
  const [chatBox, updateChatBox] = useImmer();
  const [recommendList, setRecommendList] = useState([]);
  const [inputMessage, setInputMessage] = useState(''); // 用state管理message的input
  const [active, setActive] = useState(false);
  // 拿到所有的schedule資料並放入list
  // async function getSchedule() {
  //   const querySnapshot = await getDocs(collection(db, 'schedules'));
  //   const ScheduleList = querySnapshot.docs.map((item) => item.data());
  //   console.log(ScheduleList);
  // }

  // 如果是建立新行程，則從url拿出發日期與結束日期
  const { search } = useLocation();
  const embarkDateFromUrl = new URLSearchParams(search).get('from');
  const endDateFromUrl = new URLSearchParams(search).get('to');
  const titleFromUrl = new URLSearchParams(search).get('title');

  // 拿日期相減的天數

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(embarkDateFromUrl);
  const secondDate = new Date(endDateFromUrl);
  const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay)); // 加一天

  // 如果是選擇舊行程，則從資料庫拿出發與結束日期
  const existScheduleId = new URLSearchParams(search).get('id');
  // console.log(existScheduleId);

  // 拿指定一個id的單一筆schedule資料
  useEffect(() => {
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
    // getSchedule();
    getCertainSchedule();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateScheduleData]);

  // 拿指定一個schedule_id的聊天室資料

  useEffect(() => {
    async function getChatRoom() {
      const q = query(collection(db, 'chat_rooms'), where('schedule_id', '==', existScheduleId));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data());
        updateChatBox(doc.data());
        console.log(chatBox);
      });
    }
    getChatRoom();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateChatBox]);

  const newPlace = {
    place_title: '',
    place_address: '',
    stay_time: '',
  };

  // 新增景點：按下去後要出現可以搜尋景點的框框
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

  // 把state的訊息放進去object，然後推進整個messages array

  const newMessage = {
    user_id: 123,
    user_name: '葳葳',
    message: inputMessage,
    sent_time: new Date(),
  };

  function updataMessage() {
    updateChatBox((draft) => {
      draft.messages.push(newMessage);
    });
  }

  useEffect(() => {
    async function setMessageIntoDb() {
      const messageRef = doc(db, 'chat_rooms', chatBox.chat_room_id);
      // Set the "capital" field of the city 'DC'
      await updateDoc(messageRef, chatBox);
    }
    setMessageIntoDb();
  }, [chatBox]);

  console.log(chatBox);

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
    Array(diffDays + 1).fill('').forEach(() => {
      newSchedule.trip_days.push(newDay);
    });

    updateScheduleData(newSchedule);
  }
  // console.log(scheduleData);
  // console.log(Array(diffDays));
  // console.log(newSchedule);
  // console.log(recommendList);
  // let messageValue = '';

  return (
    <ScheduleWrapper className="test">
      {/* <AddAndSearch recommendList={recommendList} setRecommendList={setRecommendList} /> */}
      <AddAndSearchBox active={active}>
        <button type="button" onClick={() => setActive(false)}>X</button>
        <div>
          {recommendList.map((place, index) => {
            <>
              <div>哈哈</div>
              <div>{index + 1 }</div>
              <div>
                {place.name}
              </div>
            </>;
          })}
        </div>
      </AddAndSearchBox>
      <LeftContainer active={active}>
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
          {/* <Search /> 要怎麼讓search跑到這邊？function怎麼傳？ */}
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
              <button type="button" onClick={() => { setActive(true); addPlaceInDay(dayIndex); }}>新增行程</button>
            </DayContainer>
          ))
          // 這裡是新創建行程的地方
            : ''}
        </div>
      </LeftContainer>
      <RightContainer>
        <Map recommendList={recommendList} setRecommendList={setRecommendList} />
        <ChatRoom>
          <MessagesDisplayArea>
            {chatBox ? chatBox.messages.map((item, index) => (
              <MessageBox>
                <UserPhoto />
                <Name>
                  {index + 1}
                  {' '}
                  {item.user_name}
                  ：
                </Name>
                <Message>{item.message}</Message>
              </MessageBox>
            )) : ''}
          </MessagesDisplayArea>
          <EnterArea>
            <MessageInput
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
              }}
            />
            <EnterMessageButton onClick={() => { updataMessage(); setInputMessage(''); }}>
              send
            </EnterMessageButton>
          </EnterArea>
        </ChatRoom>
      </RightContainer>
    </ScheduleWrapper>
  );
}

export default Schedule;
