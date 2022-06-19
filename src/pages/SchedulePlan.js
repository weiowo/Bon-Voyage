/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import styled from 'styled-components/macro';
import React, { useEffect, useState } from 'react';
import {
  getDocs, collection, doc, getDoc, query, where,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useImmer } from 'use-immer';
import { useLocation, useSearchParams } from 'react-router-dom';
import SpeakIcon from './images/speak.png';
import CloseChatIcon from './images/close-1.png';
import PinkCloseIcon from './images/close-2.png';
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
justify-content:space-between;
align-items:center;
width:50vw;
gap:30px;
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
border:2px solid red;
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
  const [selected, setSelected] = useState({}); // 搜尋後根據自動推薦選擇的地點
  const [clickedDayIndex, setClickedDayIndex] = useState('');
  const [openChat, setOpenChat] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);

  // 拿到所有的schedule資料並放入list
  // async function getSchedule() {
  //   const querySnapshot = await getDocs(collection(db, 'schedules'));
  //   const ScheduleList = querySnapshot.docs.map((item) => item.data());
  //   console.log(ScheduleList);
  // }

  useEffect(() => {
    console.log(selected);
  }, [selected]);

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
      const params = { id: createNewScheduleData.id };
      setSearchParams(params);
    }
  }

  // 聊天室：如果按下聊天室按鈕時，發現無法從url上拿到行程id
  // 就先創一個聊天室，推newChatRoom去chatBox這個immer，schedule_id先設立為123
  // 在按下完成行程的時候，建立這個行程(會獲得id)，並同時把chat-room中的行程id設定為這個id

  const newChatRoom = {
    chat_room_id: '',
    schedule_id: 'hfuerifhu',
    messages: [],
  };

  async function CreateNewChatRoom() {
    if (!existScheduleId) {
      console.log('沒有聊天室，創一個新的在瀏覽器！');
      updateChatBox(newChatRoom);
    }
  }

  // setSchedule();

  // 如果已經有聊天室，則拿指定一個schedule_id的聊天室資料，如果沒有，則創建一個！

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
    if (existScheduleId) {
      getChatRoom();
    } else {
      CreateNewChatRoom();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateChatBox]);

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
  // 如果已經有聊天室就拉下來
  // 有人輸入完一句話，送出時會推進chatRoom的messages array，造成chatBox改變，這時就要推上db

  useEffect(() => {
    async function setMessageIntoDb() {
      const messageRef = doc(db, 'chat_rooms', chatBox.chat_room_id);
      await updateDoc(messageRef, chatBox);
    }
    if (existScheduleId) {
      setMessageIntoDb();
    }
  }, [chatBox, existScheduleId]);

  console.log(chatBox);

  // 拿一週的哪一天

  const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const dFromUrl = new Date(embarkDateFromUrl);

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
              onClick={() => { updatePlaceTitleBySearch(selected.structured_formatting.main_text, clickedDayIndex); updatePlaceAddressBySearch(selected.structured_formatting.secondary_text, clickedDayIndex); }}
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
                <AddToPlaceButton onClick={() => { updatePlaceTitleBySearch(place.name, clickedDayIndex); updatePlaceAddressBySearch(place.vicinity, clickedDayIndex); }} type="button">加入行程</AddToPlaceButton>
              </RecommendPlace>
            ))}
          </RecommendPlaces>
        </ResultsArea>
      </AddAndSearchBox>
      <LeftContainer active={active}>
        <p>
          行程title：
          {scheduleData ? scheduleData.title : ''}
        </p>
        <DateContainer>
          <p>
            出發時間：
            {scheduleData && existScheduleId ? scheduleData.embark_date.seconds : embarkDateFromUrl}
          </p>
          <p>
            結束時間：
            {scheduleData && existScheduleId ? scheduleData.end_date.seconds : endDateFromUrl }
          </p>
          <CompleteButton onClick={() => setCompletedScheduleToDb()} type="button">完成行程</CompleteButton>
        </DateContainer>

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
              <button type="button" onClick={() => { setActive(true); addPlaceInDay(dayIndex); setClickedDayIndex(dayIndex); }}>新增行程</button>
            </DayContainer>
          ))
          // 這裡是新創建行程的地方
            : ''}
        </div>
      </LeftContainer>
      <RightContainer>
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
            <EnterMessageButton onClick={() => { updataMessage(); setInputMessage(''); }}>
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
