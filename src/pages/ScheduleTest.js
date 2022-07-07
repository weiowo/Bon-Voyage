/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import styled from 'styled-components/macro';
import React, { useEffect, useState, useContext } from 'react';
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
import UserContext from '../components/UserContextComponent';
import SpeakIcon from './images/speak.png';
import CloseChatIcon from './images/close-1.png';
import PinkCloseIcon from './images/close-2.png';
import db from '../utils/firebase-init';
import Map from './Map';
import GreyHeaderComponent from '../components/GreyHeader';
import BlueTrashCanSrc from './images/trash_blue.png';
import GreyTrashCanSrc from './images/trash_grey.png';
import GoBackSrc from './images/arrow-left.png';

// 最新版！！（2022/06/20）
// chooseDate完成後就創立一個新的行程id，並放到url上面
// embark date and enddate都直接從db拿，用這個來產生空的天數
// 也同時先創聊天室id

const ScheduleWrapper = styled.div`
    display:flex;
    width:100%;
    height:100vh;
    gap:30px;
    padding-top:60px;
    overflow:scroll;
    `;

const LeftContainer = styled.div`
overflow:scroll;
display:flex;
flex-direction:column;
align-items:center;
width:45vw;
overflow:scroll;
height:calc(100vh-60px);
display:${(props) => (props.active ? 'none' : 'flex')};
// box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const RightContainer = styled.div`
width:55vw;
height:calc(100vh-60px);
`;

const DayContainerBoxes = styled.div`
display:flex;
flex-direction:column;
gap:20px;
height: 75vh;
overflow:scroll;
`;

const AddDayButton = styled.button`
width:26px;
height:26px;
background-color:#C1C1C1;
border-radius:50%;
margin-bottom:0px;
border:none;
color:white;
font-weight:800;
font-size:16px;
display:flex;
justify-content:center;
align-items:center;
cursor:pointer;
`;

const DayContainer = styled.div`
width:38vw;
height:auto;
border-radius:10px;
display:flex;
flex-direction:column;
align-items:center;
padding-bottom:15px;
background-color:white;
border:1px black solid;
`;

const DayContainerTitle = styled.div`
display:flex;
align-items:center;
font-size:15px;
justify-content:center;
border-radius:10px;
width:270px;
height:40px;
color:white;
font-weight:600;
background-color:#63B5DC;
margin-bottom:10px;
margin-top:10px;
letter-spacing:1.5px;
`;

const PlaceContainer = styled.div`
display:flex;
justify-content:space-around;
align-items:center;
width:37vw;
height:120px;
padding-left:20px;
padding-right:20px;
border-radius:20px;
background-color:#e7f5fe;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

`;

const PlaceContainerInputArea = styled.div`
width:auto;
height:auto;
`;

const InputBox = styled.div`
display:flex;
align-items:center;
justify-content:space-between;
width:28vw;
height:30px;
`;

const ScheduleTitleAndCompleteButtonArea = styled.div`
width:40vw;
justify-content:space-between;
height:auto;
display:flex;
align-items:center;
margin-top:20px;
gap:20px;
// justify-content:center;
`;

const ScheduleTitle = styled.div`
color:#226788;
font-weight:800;
font-size:17px;
`;

const DateContainer = styled.div`
display:flex;
justify-content:center;
align-items:center;
width:40vw;
gap:15px;
font-weight:600;
`;

const CompleteButton = styled.button`
width:50px;
height:30px;
background-color:white;
color:#226788;
border-radius:10px;
border: solid #226788 2px;
font-weight:600;
cursor:pointer;
justify-self:end;
justify-self:right;
`;

const ChatRoom = styled.div`
z-index:1;
display:flex;
flex-direction:column;
align-items:center;
width:22vw;
height:300px;
border-radius:5px;
border:black 1px solid;
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
height:50px;
border-radius:3px;
align-items:center;
align-self:flex-start;
`;

const Name = styled.div`
width:50px;
font-size:14px;
`;

const Message = styled.div`
padding-left:10px;
padding-right:10px;
border-radius:3px;
background-color:#D3D3D3;
font-size:14px;
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
border: black 1px solid;
`;

const EnterMessageButton = styled.button`
width:auto;
height:20px;
border: green 2px solid;
border-radius:2px;
cursor:pointer;
`;

const AddAndSearchBox = styled.div`
width:45vw;
height:75vh;
display:${(props) => (props.active ? 'block' : 'none')};
`;

const ResultsArea = styled.div`
display:flex;
flex-direction:column;
align-items:center;
margin-top:50px;
height:70vh;
width:43vw;
`;

const SearchedPlace = styled.div`
width:43vw;
height:80px;
display:flex;
align-items:center;
justify-content:center;
gap:30px;
margin-bottom:5px;
margin-top:20px;
`;

const RecommendPlaces = styled.div`
display:flex;
flex-direction:column;
align-items:center;
height:70vh;
width:45vw;
overflow:scroll;
background-color:#e7f5fe;
border:2px solid black;
border-radius:30px;
padding-top:20px;
margin-left:45px;
gap:10px;
`;

const RecommendPlace = styled.div`
gap:30px;
display:flex;
justify-content:space-between;
width:33vw;
height:300px;
border:1.5px #226788 solid;
border-radius:15px;
padding-top:20px;
padding-bottom:20px;
background-color:white;
`;

const RecommendPlaceLeftArea = styled.div`
display:flex;
flex-direction:column;
justify-content:center;
margin-left:30px;
gap:10px;
`;

const RecommendPlaceTitle = styled.div`
font-weight:600;
font-size:15px;
text-align:left;
width:270px;
color:#226788;
`;

const RecommendPlcePhoto = styled.img`
width:70px;
height:70px;
border-radius:15px;
margin-right:30px;
`;

const AddToPlaceButton = styled.button`
height:30px;
width:100px;
background-color:#63B5DC;
border-radius:8px;
border:none;
font-weight:600;
color:white;

`;

const DeleteIcon = styled.img`
width:24px;
height:24px;
cursor:pointer;
`;

const GoBackIcon = styled.img`
width:32px;
height:32px;
`;

// 拿user資料並放入list
// async function getUser() {
//   const querySnapshot = await getDocs(collection(db, 'users'));
//   const UserList = querySnapshot.docs.map((item) => item.data());
//   console.log(UserList);
//   return UserList;
// }

// eslint-disable-next-line no-unused-vars
const initialDnDState = {
  draggedFrom: null,
  draggedTo: null,
  isDragging: false,
  originalOrder: [],
  updatedOrder: [],
};

const placeInitialDnDState = {
  draggedFrom: null,
  draggedTo: null,
  isDragging: false,
  originalOrder: [],
  updatedOrder: [],
};

function ScheduleTest() {
  const newChatRoom = {
    chat_room_id: '',
    schedule_id: '',
    messages: [],
  };
  const [scheduleData, updateScheduleData] = useImmer();
  console.log('媽我在這', scheduleData);
  const [chatBox, updateChatBox] = useImmer(newChatRoom);
  const [recommendList, setRecommendList] = useState([]);
  const [inputMessage, setInputMessage] = useState(''); // 用state管理message的input
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState({}); // 搜尋後根據自動推薦選擇的地點
  const [clickedDayIndex, setClickedDayIndex] = useState('');
  const [openChat, setOpenChat] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [distance, setDistance] = useImmer({});
  const [duration, setDuration] = useImmer({});
  const user = useContext(UserContext);
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);
  const [placeDragAndDrop, setPlaceDragAndDrop] = useState(placeInitialDnDState);
  const { search } = useLocation();
  const existScheduleId = new URLSearchParams(search).get('id');

  // 天數的dragAndDrop

  const onDragStart = (event) => {
    const initialPosition = Number(event.currentTarget.dataset.position);
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: initialPosition,
      isDragging: true,
      originalOrder: scheduleData?.trip_days,
    });
    event.dataTransfer.setData('text/html', '');
  };
  const onDragOver = (event) => {
    // in order for the onDrop
    // event to fire, we have
    // to cancel out this one
    event.preventDefault();
    let newList = dragAndDrop.originalOrder;
    // index of the item being dragged
    const { draggedFrom } = dragAndDrop;
    // index of the droppable area being hovered
    const draggedTo = Number(event.currentTarget.dataset.position);
    const itemDragged = newList[draggedFrom];
    const remainingItems = newList.filter((item, index) => index !== draggedFrom);
    newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo),
    ];

    if (draggedTo !== dragAndDrop.draggedTo) {
      setDragAndDrop({
        ...dragAndDrop,
        updatedOrder: newList,
        draggedTo,
      });
    }
  };
  useEffect(() => {
    console.log('Dragged From: ', dragAndDrop && dragAndDrop.draggedFrom);
    console.log('Dropping Into: ', dragAndDrop && dragAndDrop.draggedTo);
  }, [dragAndDrop]);
  useEffect(() => {
    console.log('List updated!');
  }, [scheduleData?.trip_days]);

  const onDrop = () => {
    updateScheduleData((draft) => {
      draft.trip_days = dragAndDrop.updatedOrder;
    });
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false,
    });
  };
  const onDragLeave = () => {
    setDragAndDrop({
      ...dragAndDrop,
      draggedTo: null,
    });
  };
  // 景點的dragAndDrop

  // 拿指定一個id的單一筆schedule資料
  useEffect(() => {
    if (!existScheduleId) return;
    async function getCertainSchedule() {
      const docRef = doc(db, 'schedules', existScheduleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        updateScheduleData(docSnap.data());
        const dateTestFromDb = Date.parse(docSnap.data().embark_date);
        updateChatBox((draft) => {
          draft.chat_room_id = docSnap.data().chat_room_id;
        });
      } else {
        console.log('No such document!');
      }
    }
    async function getChatRoom() {
      const chatRoomMessageIdRef = query(collection(db, 'chat_rooms'), where('schedule_id', '==', existScheduleId));
      const test = await getDocs(chatRoomMessageIdRef);
      test.forEach((doc) => {
        updateChatBox((draft) => {
          draft.chat_room_id = doc.data().chat_room_id;
        });
      });
    }
    getCertainSchedule();
    getChatRoom();
  }, [updateScheduleData, existScheduleId, updateChatBox]);

  // 刪除某一天
  // 把不是按到那個index的留下來
  function deleteCertainDay(targetDeleteDayIndex) {
    console.log('刪除這一天囉！', targetDeleteDayIndex);
    updateScheduleData((draft) => {
      draft.trip_days = draft.trip_days.filter(
        (item, index) => index !== targetDeleteDayIndex,
      );
    });
  }

  // 刪除某一天
  function deleteCertainPlace(targetDeleteDayIndex, targetDeletePlaceIndex) {
    console.log('刪除這個景點囉！', targetDeleteDayIndex, targetDeletePlaceIndex);
    updateScheduleData(((draft) => {
      draft.trip_days[targetDeleteDayIndex].places = draft.trip_days[targetDeleteDayIndex].places.filter(
        (item, index) => index !== targetDeletePlaceIndex,
      );
    }));
  }

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
    user_id: user.uid, // 放user.id
    user_name: user.displayName,
    message: inputMessage,
    sent_time: new Date(),
  };

  async function addNewMessageToFirestoreFirst() {
    const chatRoomMessageArray = doc(db, 'chat_rooms', chatBox.chat_room_id);
    // Atomically add a new region to the "regions" array field.
    await updateDoc(chatRoomMessageArray, {
      messages: arrayUnion(newMessage),
    });
  }

  // 有訊息更新時就要及時拿出來！

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

  // 有人編輯時要及時呈現

  useEffect(() => {
    if (existScheduleId) {
      const theScheduleBeingEdited = doc(db, 'schedules', existScheduleId);
      onSnapshot(theScheduleBeingEdited, (querySnapshot) => {
        console.log(querySnapshot);
        updateScheduleData(querySnapshot.data());
      });
    }
  }, [existScheduleId, updateScheduleData]);

  const newPlace = {
    place_title: '',
    place_address: '',
    stay_time: 60,
  };

  // 新增景點在某一天

  function addPlaceInDay(dayIndex) {
    updateScheduleData((draft) => {
      draft?.trip_days[dayIndex]?.places.push(newPlace);
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

  console.log(chatBox);

  // 拿一週的哪一天

  const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

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
    <>
      <GreyHeaderComponent />
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
                  <RecommendPlaceLeftArea>
                    <RecommendPlaceTitle>
                      {place.name}
                    </RecommendPlaceTitle>
                    <AddToPlaceButton onClick={() => { updatePlaceTitleBySearch(place.name, clickedDayIndex); updatePlaceAddressBySearch(place.vicinity, clickedDayIndex); setActive(false); }} type="button">加入行程</AddToPlaceButton>
                  </RecommendPlaceLeftArea>
                  <RecommendPlcePhoto alt="place" src={place.photos?.[0]?.getUrl?.() ?? '哈哈'} />
                </RecommendPlace>
              ))}
            </RecommendPlaces>
          </ResultsArea>
        </AddAndSearchBox>
        <LeftContainer active={active}>
          {/* <button type="button">
            <Link to="/my-schedules">
              回到我的行程
            </Link>
          </button> */}
          <ScheduleTitleAndCompleteButtonArea>
            <Link to="/my-schedules">
              <GoBackIcon src={GoBackSrc} />
            </Link>
            <ScheduleTitle>
              行程title：
              {scheduleData ? scheduleData.title : ''}
            </ScheduleTitle>
            <Link to="/my-schedules">
              <CompleteButton onClick={() => setCompletedScheduleToDb()} type="button">完成</CompleteButton>
            </Link>
          </ScheduleTitleAndCompleteButtonArea>
          <DateContainer>
            <p>
              {scheduleData ? scheduleData.embark_date : '沒有data'}
              ～
              {scheduleData ? scheduleData.end_date : '沒有data' }
            </p>
            <AddDayButton type="button" onClick={() => addDayInSchedule()}>＋</AddDayButton>
          </DateContainer>
          <DayContainerBoxes>
            {scheduleData ? scheduleData.trip_days
              .map((dayItem, dayIndex) => (
                <DayContainer
                  key={dayIndex}
                  data-position={dayIndex}
                  draggable
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragLeave={onDragLeave}
                  className={dragAndDrop && dragAndDrop.draggedTo === Number(dayIndex) ? 'dropArea' : ''}
                >
                  <DayContainerTitle>
                    第
                    {dayIndex + 1}
                    天
                    /
                    {new Date(Date.parse(scheduleData.embark_date) + (dayIndex * 86400000)).toISOString().split('T')[0]}
                    /
                    {weekday[(new Date(scheduleData.embark_date).getDay() + dayIndex) % 7]}
                    <DeleteIcon style={{ width: '18px', height: '18px', marginLeft: '5px' }} src={GreyTrashCanSrc} onClick={() => deleteCertainDay(dayIndex)} />
                  </DayContainerTitle>
                  <div>
                    {dayItem.places ? dayItem.places.map((placeItem, placeIndex) => (
                      <>
                        <div style={{ marginTop: '5px', fontSize: '14px' }}>
                          {(placeIndex !== 0 ? `行車距離： ${distance?.[dayIndex]?.[placeIndex - 1] ?? ''}` : '')}
                        </div>
                        <div style={{ marginBottom: '5px', fontSize: '14px' }}>
                          {(placeIndex !== 0 ? `行車時間： ${duration?.[dayIndex]?.[placeIndex - 1] ?? ''}` : '')}
                        </div>
                        <PlaceContainer>
                          <PlaceContainerInputArea>
                            <InputBox>
                              <p style={{ fontSize: '14px' }}>
                                第
                                {placeIndex + 1}
                                個景點：
                              </p>
                              <input
                                style={{ width: '20vw', outline: 'none' }}
                                value={placeItem.place_title}
                                onChange={(e) => {
                                  updatePlaceTitle(e.target.value, dayIndex, placeIndex);
                                }}
                              />
                            </InputBox>
                            <InputBox>
                              <p style={{ fontSize: '14px' }}>停留時間：</p>
                              <input
                                style={{ width: '15vw', outline: 'none' }}
                                value={placeItem.stay_time}
                                onChange={(e) => {
                                  updateStayTime(e.target.value, dayIndex, placeIndex);
                                }}
                              />
                              <div style={{ fontSize: '12px' }}>分鐘</div>
                            </InputBox>
                            <InputBox>
                              <p style={{ fontSize: '14px' }}>地址：</p>
                              <input
                                style={{ width: '20vw', outline: 'none' }}
                                value={placeItem.place_address}
                                onChange={(e) => {
                                  updatePlaceAddress(e.target.value, dayIndex, placeIndex);
                                }}
                              />
                            </InputBox>
                          </PlaceContainerInputArea>
                          <DeleteIcon src={BlueTrashCanSrc} onClick={() => deleteCertainPlace(dayIndex, placeIndex)} />
                        </PlaceContainer>
                      </>
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
          </DayContainerBoxes>
        </LeftContainer>
        <RightContainer>
          {/* <Map
            recommendList={recommendList}
            setRecommendList={setRecommendList}
            selected={selected}
            setSelected={setSelected}
            active={active}
            scheduleData={scheduleData}
            updateScheduleData={updateScheduleData}
            distance={distance}
            setDistance={setDistance}
            duration={duration}
            setDuration={setDuration}
          /> */}
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
    </>
  );
}

export default ScheduleTest;
