/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import styled from 'styled-components/macro';
import React, { useEffect, useState } from 'react';
import {
  // getDocs,
  collection, doc, getDoc, getDocs,
  query, where,
  setDoc, arrayUnion,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { useImmer } from 'use-immer';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import SpeakIcon from './images/speak.png';
import CloseChatIcon from './images/close-1.png';
import PinkCloseIcon from './images/close-2.png';
import db from '../utils/firebase-init';
import Map from './Map';

// 最新版！！（2022/06/20）
// chooseDate完成後就創立一個新的行程id，並放到url上面
// embark date and enddate都直接從db拿，用這個來產生空的天數
// 也同時先創聊天室id

// schedule中不要有members這個array
// 創建行程時(按下ok時)，就把這個行程的id放到這個user的owned_schedules_id這個array中
// 然後之後要看某個schedul中有哪些members時，用array contains這個schedule_id來找尋！

const ScheduleWrapper = styled.div`
    display:flex;
    width:100%;
    height:100%;
    gap:30px;
    `;

const LeftContainer = styled.div`
overflow:scroll;
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
padding-bottom:15px;
`;

const PlaceContainer = styled.div`
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
width:40vw;
height:auto;
border: brown solid 1px;
border-radius:20px;
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
justify-content:space-between;
align-items:center;
width:50vw;
gap:15px;
padding-left:100px;
padding-right:100px;

`;

const CompleteButton = styled.button`
width:120px;
height:30px;
background-color:beige;
color:brown;
border-radius:3px;
border: solid brown 2px;
font-weight:600;
cursor:pointer;
`;

const ChatRoom = styled.div`
z-index:1;
display:flex;
flex-direction:column;
align-items:center;
width:22vw;
height:300px;
border-radius:5px;
border:blue 2px solid;
position: fixed;
bottom: 0px;
right:50px;
background-color:white;
display:${(props) => (props.openChat ? 'flex' : 'none')};

`;

const ChatIcon = styled.img`
position: fixed;
bottom: 50px;
right:80px;
z-index:1;
width:50px;
height:50px;
cursor:pointer;
display:${(props) => (props.openChat ? 'none' : 'block')};
`;

const CloseIcon = styled.img`
width:15px;
height:15px;
position:absolute;
right:20px;
cursor:pointer;
`;

const CloseSearchIcon = styled.img`
margin-top:20px;
width:20px;
height:20 px;
`;

const ChatRoomTitle = styled.div`
display:flex;
align-items:center;
justify-content:center;
height:30px;
background-color:#add8e6;
color:black;
width:21.7vw;
font-size:12px;
position:relative;
`;

const MessagesDisplayArea = styled.div`
display:flex;
flex-direction:column;
overflow:scroll;
height:250px;
width:22vw;
gap:5px;
`;

const MessageBox = styled.div`
padding-left:10px;
display:flex;
width:auto;
height:30px;
border-radius:3px;
align-items:center;
align-self:flex-start;
`;

const Name = styled.div`
width:50px;
font-size:12px;
`;

const Message = styled.div`
padding-left:10px;
padding-right:10px;
border-radius:3px;
background-color:#D3D3D3;
font-size:12px;
`;

const UserPhoto = styled.div`
width:20px;
height:20px;
background-color:orange;
border-radius:50%;
`;

const EnterArea = styled.div`
width:22vw;
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
border-radius:2px;
cursor:pointer;
`;

const AddAndSearchBox = styled.div`
width:50vw;
height:100vh;
display:${(props) => (props.active ? 'block' : 'none')};
`;

const ResultsArea = styled.div`
display:flex;
flex-direction:column;
align-items:center;
margin-top:50px;
height:90vh;
width:50vw;
`;

const SearchedPlace = styled.div`
width:50vw;
height:30px;
display:flex;
align-items:center;
justify-content:center;
gap:30px;
margin-bottom:20px;
margin-top:20px;
`;

const RecommendPlaces = styled.div`
overflow:scroll;
display:flex;
flex-direction:column;
align-items:center;
height:80vh;
width:50vw;
baclground-color:yellow;
border:2px solid black;
border-radius:30px;
padding-top:20px;
margin-left:30px;
gap:10px;
`;

const RecommendPlace = styled.div`
gap:30px;
display:flex;
justify-content:space-between;
height:auto;
width:40vw;
`;

const AddToPlaceButton = styled.button`
height:30px;
width:100px;
`;

// 拿user資料並放入list
// async function getUser() {
//   const querySnapshot = await getDocs(collection(db, 'users'));
//   const UserList = querySnapshot.docs.map((item) => item.data());
//   console.log(UserList);
//   return UserList;
// }

// 拿日期相減的天數

// const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
// const firstDate = new Date(startDate);
// const secondDate = new Date(finishDate);
// const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay)); // 加一天
// console.log(diffDays);

// eslint-disable-next-line no-unused-vars
function Schedule() {
  const newChatRoom = {
    chat_room_id: '',
    schedule_id: '',
    messages: [],
  };
  const [scheduleData, updateScheduleData] = useImmer();
  // eslint-disable-next-line no-use-before-define
  const [chatBox, updateChatBox] = useImmer(newChatRoom);
  const [recommendList, setRecommendList] = useState([]);
  const [inputMessage, setInputMessage] = useState(''); // 用state管理message的input
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState({}); // 搜尋後根據自動推薦選擇的地點
  const [clickedDayIndex, setClickedDayIndex] = useState('');
  const [openChat, setOpenChat] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);

  // async function CreateNewChatRoom() {
  //   if (!existScheduleId) {
  //     console.log('沒有聊天室，創一個新的在瀏覽器！');
  //     updateChatBox(newChatRoom);
  //   }
  // }

  // 拿到所有的schedule資料並放入list
  // async function getSchedule() {
  //   const querySnapshot = await getDocs(collection(db, 'schedules'));
  //   const ScheduleList = querySnapshot.docs.map((item) => item.data());
  //   console.log(ScheduleList);
  // }

  // 如果是建立新行程，則從url拿出發日期與結束日期
  const { search } = useLocation();
  // const embarkDateFromUrl = new URLSearchParams(search).get('from');
  // const endDateFromUrl = new URLSearchParams(search).get('to');
  // const titleFromUrl = new URLSearchParams(search).get('title');

  // 拿日期相減的天數

  // const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  // const firstDate = new Date(embarkDateFromUrl);
  // const secondDate = new Date(endDateFromUrl);
  // const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay)); // 加一天

  // 從database拿出來後就把string轉為milliseconds
  // 按下「新增天數」的時候要把endDate的日期往後加上一天的milliseconds
  // render時要去抓trip_days array的最後一個item的milliseconds，再轉為Datet做呈現

  // const dateTest = Date.parse(embarkDateFromUrl);
  // console.log(dateTest);
  // let dateTestFromDb;
  // scheduleData.embark_date ? dateTestFromDb = Date.parse(scheduleData.embark_date) : dateTestFromDb = '2';
  // console.log('我在這兒！', dateTestFromDb);

  // const dateTest1 = Date.parse('2019-01-01');
  // console.log(dateTest1);
  // console.log(dateTest + 86400000);
  // const fromTimeStamp3 = new Date(dateTest + 86400000).toISOString(); // 加上一天的方式
  // console.log(fromTimeStamp3);
  // const fromTimeStamp = new Date(dateTest).toISOString();
  // console.log(fromTimeStamp);
  // const test = fromTimeStamp.split('T')[0];
  // console.log(test);

  // 如果是選擇舊行程，則從資料庫拿出發與結束日期
  const existScheduleId = new URLSearchParams(search).get('id');
  // console.log(existScheduleId);

  // 拿指定一個id的單一筆schedule資料
  useEffect(() => {
    if (!existScheduleId) return;
    async function getCertainSchedule() {
      const docRef = doc(db, 'schedules', existScheduleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        updateScheduleData(docSnap.data());
        const dateTestFromDb = Date.parse(docSnap.data().embark_date);
        console.log('哇哈哈哈哈！', dateTestFromDb);
        updateChatBox((draft) => {
          draft.chat_room_id = docSnap.data().chat_room_id;
        });
      } else {
      // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    }
    async function getChatRoom() {
      console.log('getChatRoom, getChatRoom, getChatRoom');
      const chatRoomMessageIdRef = query(collection(db, 'chat_rooms'), where('schedule_id', '==', existScheduleId));
      const test = await getDocs(chatRoomMessageIdRef);
      test.forEach((doc) => {
        console.log('owowow', doc.data());
        updateChatBox((draft) => {
          draft.chat_room_id = doc.data().chat_room_id;
        });
      });
    }
    // getSchedule();
    getCertainSchedule();
    getChatRoom();
  }, [updateScheduleData, existScheduleId, updateChatBox]);

  // 如果沒有id，表示是新行程，創建資料後再次把行set進去
  // 如果有id，則是編輯既有的行程，編輯後update進去db，並創建一個新的聊天室

  async function setCompletedScheduleToDb() {
    if (existScheduleId) {
      console.log('修改好行程囉！');
      const scheduleRef = doc(db, 'schedules', existScheduleId);
      await updateDoc(scheduleRef, scheduleData);
    } else {
      const createNewScheduleData = doc(collection(db, 'schedules'));
      await setDoc(createNewScheduleData, ({ ...scheduleData, schedule_id: createNewScheduleData.id }));
      const createNewChatRoomData = doc(collection(db, 'chat_rooms'));
      await setDoc(createNewChatRoomData, ({ ...chatBox, schedule_id: createNewScheduleData.id, chat_room_id: createNewChatRoomData.id }));
      updateChatBox((draft) => {
        draft.chat_room_id = createNewChatRoomData.id;
        draft.schedule_id = createNewScheduleData.id;
      });
      const params = { id: createNewScheduleData.id };
      setSearchParams(params);
    }
  }

  // 把state的訊息放進去object，然後推進整個messages array
  const newMessage = {
    user_id: 123, // 放localstorage的東西
    user_name: '葳葳', // 放localstorage的東西
    message: inputMessage,
    sent_time: new Date(),
  };

  // function updataMessage() {
  //   updateChatBox((draft) => {
  //     draft.messages.push(newMessage);
  //   });
  // }

  // 如果已經有聊天室就拉下來
  // 有人輸入完一句話，送出時會推進chatRoom的messages array，造成chatBox改變，這時就要推上db-->改了！直接更新到db！再拉下來！
  // 送出訊息的時候直接更新到db，再用OnsnapShop，有更新的話就update進immer
  // 如果草創行程的時候就不能聊天，創好行程有id後才能有聊天室，然後導回我的行程頁面
  // onclick送上去

  // async function setMessageIntoDb() {
  //   const messageRef = doc(db, 'chat_rooms', chatBox.chat_room_id);
  //   await updateDoc(messageRef, chatBox);
  // }
  // if (existScheduleId) {
  //   setMessageIntoDb();
  // }

  // useEffect(() => {
  //   const ref = collection(db, 'chat_rooms');
  //   onSnapshot(ref, (querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       // console.log(doc.id, doc.data());
  //     });
  //   });
  // }, []);

  async function addNewMessageToFirestoreFirst() {
    const chatRoomMessageArray = doc(db, 'chat_rooms', chatBox.chat_room_id);
    // Atomically add a new region to the "regions" array field.
    await updateDoc(chatRoomMessageArray, {
      messages: arrayUnion(newMessage),
    });
  }

  useEffect(() => {
    if (existScheduleId) {
      const chatRoomMessageArray = query(collection(db, 'chat_rooms'), where('schedule_id', '==', existScheduleId));
      // const chatRoomMessageArray = doc((db, 'chat_rooms'), where('schedule_id', '==', existScheduleId)));
      onSnapshot(chatRoomMessageArray, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          updateChatBox(doc.data());
        });
      });
    }
  }, [existScheduleId, updateChatBox]);

  // Atomically remove a region from the "regions" array field.
  // await updateDoc(washingtonRef, {
  //     regions: arrayRemove("east_coast")
  // });

  // async function CreateNewChatRoom() {
  //   if (!existScheduleId) {
  //     console.log('沒有聊天室，創一個新的在瀏覽器！');
  //     updateChatBox(newChatRoom);
  //   }
  // }

  // setSchedule();

  // 如果已經有聊天室，則拿指定一個schedule_id的聊天室資料，如果沒有，則創建一個！

  // useEffect(() => {
  //   async function getChatRoom() {
  //     const q = query(collection(db, 'chat_rooms'), where('schedule_id', '==', existScheduleId));
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //       // doc.data() is never undefined for query doc snapshots
  //       console.log(doc.id, ' => ', doc.data());
  //       updateChatBox(doc.data());
  //       console.log(chatBox);
  //     });
  //   }
  //   if (existScheduleId) {
  //     getChatRoom();
  //   }
  //   // else {
  //   //   CreateNewChatRoom();
  //   // }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [updateChatBox]);

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
      const originalEndDateToMilliSecond = Date.parse(draft.end_date);
      const MilliSecondsToDate = new Date(originalEndDateToMilliSecond + 86400000).toISOString(); // 加上一天的方式
      const addedDateEndDate = MilliSecondsToDate.split('T')[0];
      draft.end_date = addedDateEndDate;
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

  // 如果有人更新訊息，要及時更新到畫面
  // useEffect(() => {
  //   const ref = collection(db, 'chat_rooms');
  //   onSnapshot(ref, (querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       // console.log(doc.id, doc.data());
  //     });
  //   });
  // }, []);

  console.log(chatBox);

  // 拿一週的哪一天

  const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  // let dFromDb= new Date(scheduleData.embark_date);
  // // const weekDayFromUrl = dFromDb.getDay();
  // const weekDayFromDB = dFromDb.getDay();
  // console.log(weekDayFromDB);

  // new Date(scheduleData.embark_date).getDay();

  // 拿一週哪一天用這種方式：{weekday[(initIndex + index) % 7]}

  // const date = scheduleData.embark_date.toDate();
  // console.log(date);

  // let fireStoreTimestamp;
  // let javascriptDate;
  // scheduleData && existScheduleId ? fireStoreTimestamp = scheduleData.embark_date : '';
  // scheduleData && existScheduleId ? javascriptDate = fireStoreTimestamp.toDate() : '';
  // console.log(javascriptDate);
  // scheduleData ? console.log('出發囉', scheduleData.embark_date) : console.log('還沒拿到行程');
  // 先把從database拿出來的millisecond轉為可看的日淇
  // let day = weekday[d.getDay()];

  // useEffect(() => {
  //   const fireBaseTime = new Date(
  //     scheduleData.embark_date.seconds * 1000 + scheduleData.embark_date.nanoseconds / 1000000,
  //   );
  //   const date = fireBaseTime.toDateString();
  //   const atTime = fireBaseTime.toLocaleTimeString();
  //   console.log(date, atTime);
  // }, [scheduleData.embark_date.seconds, scheduleData.embark_date.nanoseconds]);

  // eslint-disable-next-line no-unused-vars
  // const newSchedule = {
  //   title: titleFromUrl,
  //   schedule_id: 1,
  //   embark_date: embarkDateFromUrl,
  //   end_date: endDateFromUrl,
  //   trip_days: [],
  // };

  // 創建行程的時候：
  // 先從url上抓日期～並用它們的day差異去做foreach並推入trip_days的array中
  // push三個空的day進去trip_days
  // 改日期要改到url上面？

  // if (!scheduleData) {
  //   Array(diffDays + 1).fill('').forEach(() => {
  //     newSchedule.trip_days.push(newDay);
  //   });

  //   updateScheduleData(newSchedule);
  // }

  // 手動更改行程內容！
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
  // 按下新增行程後，會出現空白的input field，同時導向搜尋區域，搜尋後按下加入行程，把搜尋到的結果放到最新的那個行程
  function updatePlaceTitleBySearch(placeTitle, clickedDayIndex) {
    updateScheduleData((draft) => {
      draft.trip_days[clickedDayIndex].places[draft.trip_days[clickedDayIndex].places.length - 1].place_title = placeTitle;
    });
  }

  function updatePlaceAddressBySearch(placeAddress, clickedDayIndex) {
    updateScheduleData((draft) => {
      draft.trip_days[clickedDayIndex].places[draft.trip_days[clickedDayIndex].places.length - 1].place_address = placeAddress;
    });
  }

  return (
    <ScheduleWrapper className="test">
      {/* <AddAndSearch recommendList={recommendList} setRecommendList={setRecommendList} /> */}
      <AddAndSearchBox active={active}>
        <CloseSearchIcon
          src={PinkCloseIcon}
          onClick={() => setActive(false)}
        />
        <ResultsArea>
          <SearchedPlace>
            <div>
              您搜尋地點：
              {selected.structured_formatting ? selected.structured_formatting.main_text : ''}
            </div>
            <AddToPlaceButton
              onClick={() => { updatePlaceTitleBySearch(selected.structured_formatting.main_text, clickedDayIndex); updatePlaceAddressBySearch(selected.structured_formatting.secondary_text, clickedDayIndex); setActive(false); }}
            >
              加入行程
            </AddToPlaceButton>
          </SearchedPlace>
          <RecommendPlaces>
            周邊推薦景點：
            {recommendList.map((place, index) => (
              <RecommendPlace>
                <div>{index + 1 }</div>
                <div style={{ width: '35vw' }}>
                  {place.name}
                </div>
                <AddToPlaceButton onClick={() => { updatePlaceTitleBySearch(place.name, clickedDayIndex); updatePlaceAddressBySearch(place.vicinity, clickedDayIndex); setActive(false); }} type="button">加入行程</AddToPlaceButton>
              </RecommendPlace>
            ))}
          </RecommendPlaces>
        </ResultsArea>
      </AddAndSearchBox>
      <LeftContainer active={active}>
        <button type="button">
          <Link to="/my-schedules">
            回到我的行程
          </Link>
        </button>
        <p>
          行程title：
          {scheduleData ? scheduleData.title : ''}
        </p>
        <DateContainer>
          <p>
            出發時間：
            {scheduleData ? scheduleData.embark_date : '沒有data'}
          </p>
          <p>
            結束時間：
            {scheduleData ? scheduleData.end_date : '沒有data' }
          </p>
          <CompleteButton onClick={() => setCompletedScheduleToDb()} type="button">完成行程</CompleteButton>
        </DateContainer>

        <div className="schedule-boxes">
          {/* <Search /> 要怎麼讓search跑到這邊？function怎麼傳？ */}
          <button type="button" style={{ marginBottom: '20px' }} onClick={() => addDayInSchedule()}>新增天數</button>
          {scheduleData ? scheduleData.trip_days.map((dayItem, dayIndex) => (
            <DayContainer>
              <p>
                第
                {dayIndex + 1}
                天
                /
                日期
                {new Date(Date.parse(scheduleData.embark_date) + (dayIndex * 86400000)).toISOString().split('T')[0]}
                {/* 加幾天就加幾個「一天的millisecond」 */}
                /
                {weekday[(new Date(scheduleData.embark_date).getDay() + dayIndex) % 7]}
              </p>
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
                        style={{ width: '20vw' }}
                        value={placeItem.place_title}
                        onChange={(e) => {
                          updatePlaceTitle(e.target.value, dayIndex, placeIndex);
                        }}
                      />
                    </InputBox>
                    <InputBox>
                      <p>停留時間：</p>
                      <input
                        style={{ width: '20vw' }}
                        value={placeItem.stay_time}
                        onChange={(e) => {
                          updateStayTime(e.target.value, dayIndex, placeIndex);
                        }}
                      />
                    </InputBox>
                    <InputBox>
                      <p>地址：</p>
                      <input
                        style={{ width: '20vw' }}
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
              <button style={{ marginTop: '20px' }} type="button" onClick={() => { setActive(true); addPlaceInDay(dayIndex); setClickedDayIndex(dayIndex); }}>新增行程</button>
            </DayContainer>
          ))
          // 這裡是新創建行程的地方
            : ''}
        </div>
      </LeftContainer>
      <RightContainer>
        {/* <Map
          recommendList={recommendList}
          setRecommendList={setRecommendList}
          selected={selected}
          setSelected={setSelected}
          active={active}
        /> */}
        <Map
          recommendList={recommendList}
          setRecommendList={setRecommendList}
          selected={selected}
          setSelected={setSelected}
          active={active}
        />
        <ChatRoom openChat={openChat}>
          <ChatRoomTitle>
            聊天室
            <CloseIcon src={CloseChatIcon} onClick={() => setOpenChat(false)} />
          </ChatRoomTitle>
          <MessagesDisplayArea>
            {chatBox ? chatBox.messages.map((item) => (
              <MessageBox>
                <UserPhoto />
                <Name>
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
            <EnterMessageButton onClick={() => { setInputMessage(''); addNewMessageToFirestoreFirst(); }}>
              send
            </EnterMessageButton>
          </EnterArea>
        </ChatRoom>
        <ChatIcon src={SpeakIcon} openChat={openChat} onClick={() => setOpenChat(true)} />
      </RightContainer>
    </ScheduleWrapper>
  );
}

export default Schedule;
