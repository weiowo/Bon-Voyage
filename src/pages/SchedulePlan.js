/* eslint-disable react-hooks/exhaustive-deps */
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
import PinkCloseIcon from './images/close_style.png';
import db from '../utils/firebase-init';
import Map from './Map';
import GreyHeaderComponent from '../components/GreyHeader';
import BlueTrashCanSrc from './images/trash_blue.png';
import greyTrashCanSrc from './images/bin.png';
import GoBackSrc from './images/arrow-left.png';
import ClockSrc from './images/clockBlue.png';
import CarSrc from './images/sports-car.png';
import dragSrc from './images/drag-and-drop.png';
import whiteTrashCan from './images/white-bin.png';
import whiteDragSrc from './images/drag.png';
import plusIcon from './images/plus.png';
import Default1 from './images/default1.png';
import Default2 from './images/default2.png';
import Default3 from './images/default3.png';
import Default4 from './images/default4.png';
import Default5 from './images/default5.png';

const defaultArray = [Default1, Default2, Default3, Default4, Default5];

// import DragndDrop from './images/arrow-left.png';

// 最新版！！（2022/06/20）
// chooseDate完成後就創立一個新的行程id，並放到url上面
// embark date and enddate都直接從db拿，用這個來產生空的天數
// 也同時先創聊天室id

const ScheduleWrapper = styled.div`
    display:flex;
    width:100vw;
    height:100vh;
    gap:0px;
    padding-top:60px;
    `;

const LeftContainer = styled.div`
overflow:scroll;
display:flex;
flex-direction:column;
align-items:center;
width:45vw;
overflow:scroll;
height:calc( 100vh - 60px );
display:${(props) => (props.active ? 'none' : 'flex')};
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
z-index:10;
`;

const RightContainer = styled.div`
width:55vw;
height:calc(100vh-60px);
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
height:60px;
display:flex;
width:100%;
justify-content:left;
box-shadow: 3px 4px 8px 0px rgba(0, 0, 0, 0.2);
gap:5px;
z-index:15;
overflow:scroll;
flex-shrink:0;
`;

const DayContainerTitle = styled.div`
display:flex;
align-items:center;
font-size:12px;
justify-content:center;
width:100px;
height:60px;
color:#616161;
flex-shrink:0;
// cursor:pointer;
cursor:move;
border: 0.5px solid #616161;
font-weight:600;
letter-spacing:1.5px;
background-color:${(props) => (props.active ? '#63B5DC' : 'white')};
color:${(props) => (props.active ? 'white' : '#616161')};
// border-bottom:${(props) => (props.active ? '5px solid #63B5DC' : 'none')};
`;

const DayContainerBoxes = styled.div`
display:flex;
flex-direction:column;
gap:20px;
height: 75vh;
overflow:scroll;
`;

const PlaceContainer = styled.div`
cursor:move;
display:flex;
justify-content:space-around;
align-items:center;
width:100%;
height:260px;
padding-right:20px;
padding-top:10px;
padding-bottom:10px;
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
// background-color:white;
// color:#226788;
border-radius:10px;
border: solid #226788 2px;
font-weight:600;
cursor:pointer;
justify-self:end;
justify-self:right;
background-color:${(props) => (props.isEditing ? '#226788' : 'white')};
color:${(props) => (props.isEditing ? 'white' : '#226788')};
animation:${(props) => (props.isEditing ? 'hithere 1.1s ease 3' : 'none')};
`;

const ChatRoom = styled.div`
z-index:1;
display:flex;
flex-direction:column;
align-items:center;
width:300px;
height:300px;
border-top-right-radius:10px;
border-top-left-radius:10px;
// border:black 1px solid;
border-bottom:none;
position: fixed;
bottom: 0px;
right:50px;
background-color:white;
display:${(props) => (props.openChat ? 'flex' : 'none')};
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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
animation:${(props) => (props.active ? 'hithere 1.1s ease infinite' : 'none')};
`;

const CloseIcon = styled.img`
width:15px;
height:15px;
position:absolute;
right:20px;
cursor:pointer;
`;

const CloseSearchIcon = styled.img`
width:35px;
height:35px;
position:absolute;
cursor:pointer;
top:20px;
right:20px;
`;

const ChatRoomTitle = styled.div`
display:flex;
align-items:center;
justify-content:center;
height:40px;
// background-color:#add8e6;
// background: rgb(167, 176, 265);
background: linear-gradient(
  312deg,
  rgb(178, 228, 238) 0%,
  rgb(161, 176, 255) 100%
);

// background: linear-gradient(-45deg, #fbebd0, #ffbdbd);
color:black;
width:100%;
font-size:15px;
position:relative;
border-top-right-radius:10px;
border-top-left-radius:10px;
font-weight:500;
letter-spacing:5px;
`;

const MessagesDisplayArea = styled.div`
display:flex;
flex-direction:column;
overflow-y:scroll;
overflow-wrap: break-word;
height:250px;
width:100%;
gap:15px;
padding-left:1px;
padding-right:3px;
padding-top:10px;
padding-bottom:15px;
`;

const MessageBox = styled.div`
padding-left:10px;
display:flex;
width:auto;
height:35px;
border-radius:3px;
align-items:center;
align-self:flex-start;
flex-shrink:0;
`;

const NameMessage = styled.div`
width:100%;
display:flex;
flex-direction:column;
`;

const Name = styled.div`
width:100%;
font-size:12px;
font-weight:500;
color:#616161;
margin-left:5px;
text-align:left;
`;

const Message = styled.div`
margin-left:5px;
padding-left:10px;
padding-right:10px;
border-radius:3px;
height:25px;
display:flex;
align-items:center;
overflow-wrap: break-word;
word-wrap: break-word;
background-color:#D6ECF3;
font-size:14px;
`;

const UserPhoto = styled.img`
width:30px;
height:30px;
// background-color:orange;
border-radius:50%;
object-fit: cover;
`;

const EnterArea = styled.div`
width:100%;
height:50px;
display:flex;
align-items:center;
gap:10px;
justify-content:space-between;
// border-top:1px black solid;
padding-left:10px;
padding-right:10px;
background-color:#D3D3D3;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const MessageInput = styled.input`
width:80%;
height:22px;
border-radius:3px;
border: black 1px solid;
border:none;
padding-left:5px;
font-size:15px;
outline:none;
overflow-wrap: break-word;
`;

const EnterMessageButton = styled.button`
width:auto;
height:20px;
// border: green 2px solid;
border-radius:2px;
cursor:pointer;
border:none;
`;

const AddAndSearchBox = styled.div`
width:45vw;
height:calc(100vh - 60px);
position:relative;
display:${(props) => (props.active ? 'block' : 'none')};
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
z-index:10;
`;

const ResultsArea = styled.div`
display:flex;
flex-direction:column;
align-items:center;
// margin-top:50px;
height:85%;
position:fixed;
bottom:0;
`;

const SearchedPlace = styled.div`
width:45vw;
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
height:90vh;
width:45vw;
overflow:scroll;
background-color:#e7f5fe;
border-top:1px solid black;
padding-top:20px;
gap:10px;
font-size:16px;
font-weight:450;
`;

const RecommendPlace = styled.div`
gap:30px;
display:flex;
justify-content:space-between;
// width:33vw;
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

const StyledInput = styled.input`
font-size:15px;
height:20px;
width:350px;
border:none;
outline:none;
background-color:transparent;
text-align:left;
border-bottom: 1px solid grey;
`;

const RecommendPlaceTitle = styled.div`
font-weight:600;
font-size:15px;
text-align:left;
width:270px;
color:#226788;
`;

const SearchedPlaceTitle = styled.div`
font-weight:600;
font-size:25px;
text-align:left;
width:auto;
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
cursor:pointer;
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

const CarClockIcon = styled.img`
width:25px;
height:25px;
`;

const DurationDistanceArea = styled.div`
display: flex;
margin-top: 15px;
margin-bottom: 15px;
height: 60px;
gap:10px;
`;

const UnreadMessage = styled.div`
display:flex;
align-items:center;
justify-content:center;
width:20px;
height:20px;
border-radius:50%;
background-color:red;
color:white;
font-size:12px;
font-weight:500;
position:fixed;
bottom:85px;
right:120px;
z-index:30;
animation:${(props) => (props.active ? 'hithere 1.1s ease infinite' : 'none')};
`;

const CarClockIconArea = styled.div`
display: flex;
align-items: center;
gap: 7px;
`;

const DragIcon = styled.img`
width:20px;
height:20px;
`;

const AddNewScheduleButton = styled.button`
display:flex;
align-items:center;
justify-content:center;
gap:10px;
font-size:15px;
font-weight:600;
color:white;
width:100%;
height:50px;
border:none;
background-color: #63B5DC;
padding-bottom:10px;
padding-top:10px;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
cursor:pointer;
`;

const AddNewScheduleIcon = styled.img`
width:22px;
height:22px;
`;

const initialDnDState = {
  draggedFrom: null,
  draggedTo: null,
  isDragging: false,
  originalOrder: [],
  updatedOrder: [],
};

const placeInitialDnDState = {
  placeDraggedFrom: null,
  placeDraggedTo: null,
  placeIsDragging: false,
  placeOriginalOrder: [],
  placeUpdatedOrder: [],
};

function Schedule() {
  const newChatRoom = {
    chat_room_id: '',
    schedule_id: '',
    messages: [],
  };
  const [scheduleData, updateScheduleData] = useImmer();
  const [chatBox, updateChatBox] = useImmer(newChatRoom);
  const [recommendList, setRecommendList] = useState([]);
  const [inputMessage, setInputMessage] = useState(''); // 用state管理message的input
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState({}); // 搜尋後根據自動推薦選擇的地點
  const [clickedDayIndex, setClickedDayIndex] = useState('');
  const [openChat, setOpenChat] = useState(false);
  console.log(openChat);
  const [unreadMessage, setUnreadMessage] = useState(0);
  console.log(unreadMessage);
  // const [searchParams, setSearchParams] = useSearchParams();
  const [distance, setDistance] = useImmer({});
  const [duration, setDuration] = useImmer({});
  const user = useContext(UserContext);
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);
  const [placeDragAndDrop, setPlaceDragAndDrop] = useState(placeInitialDnDState);
  const [choosedDayIndex, setChoosedDayIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
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
  // // PLACE的dragAndDrop

  const onPlaceDragStart = (event) => {
    const initialPosition = Number(event.currentTarget.dataset.position);
    setPlaceDragAndDrop({
      ...placeDragAndDrop,
      placeDraggedFrom: initialPosition,
      placeIsDragging: true,
      placeOriginalOrder: scheduleData?.trip_days[choosedDayIndex].places,
    });
    event.dataTransfer.setData('text/html', '');
  };
  const onPlaceDragOver = (event) => {
    event.preventDefault();
    let placeNewList = placeDragAndDrop.placeOriginalOrder;
    const { placeDraggedFrom } = placeDragAndDrop;
    const placeDraggedTo = Number(event.currentTarget.dataset.position);
    const placeItemDragged = placeNewList[placeDraggedFrom];
    const placeRemainingItems = placeNewList.filter((item, index) => index !== placeDraggedFrom);
    placeNewList = [
      ...placeRemainingItems.slice(0, placeDraggedTo),
      placeItemDragged,
      ...placeRemainingItems.slice(placeDraggedTo),
    ];

    if (placeDraggedTo !== placeDragAndDrop.placeDraggedTo) {
      setPlaceDragAndDrop({
        ...placeDragAndDrop,
        placeUpdatedOrder: placeNewList,
        placeDraggedTo,
      });
    }
  };
  useEffect(() => {
    console.log('place!Dragged From: ', placeDragAndDrop && placeDragAndDrop.placeDraggedFrom);
    console.log('place!Dropping Into: ', placeDragAndDrop && placeDragAndDrop.placeDraggedTo);
  }, [placeDragAndDrop]);
  useEffect(() => {
  }, [scheduleData?.trip_days?.[choosedDayIndex]?.places]);

  const onPlaceDrop = () => {
    updateScheduleData((draft) => {
      draft.trip_days[choosedDayIndex].places = placeDragAndDrop.placeUpdatedOrder;
    });
    setPlaceDragAndDrop({
      ...placeDragAndDrop,
      placeDraggedFrom: null,
      placeDraggedTo: null,
      placeIsDragging: false,
    });
  };

  const onPlaceDragLeave = () => {
    setPlaceDragAndDrop({
      ...placeDragAndDrop,
      placeDraggedTo: null,
    });
  };

  // 拿指定一個id的單一筆schedule資料
  useEffect(() => {
    if (!existScheduleId) return;
    async function getCertainSchedule() {
      const docRef = doc(db, 'schedules', existScheduleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        updateScheduleData(docSnap.data());
        // const dateTestFromDb = Date.parse(docSnap.data().embark_date);
        updateChatBox((draft) => {
          draft.chat_room_id = docSnap.data().chat_room_id;
        });
      } else {
        console.log('No such document!');
      }
    }
    async function getChatRoom() {
      const chatRoomMessageIdRef = query(collection(db, 'chat_rooms'), where('schedule_id', '==', existScheduleId));
      const chatroom = await getDocs(chatRoomMessageIdRef);
      chatroom.forEach((doc) => {
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
    setIsEditing(true);
  }

  // 刪除某一天
  function deleteCertainPlace(targetDeleteDayIndex, targetDeletePlaceIndex) {
    console.log('刪除這個景點囉！', targetDeleteDayIndex, targetDeletePlaceIndex);
    updateScheduleData(((draft) => {
      draft.trip_days[targetDeleteDayIndex].places = draft.trip_days[targetDeleteDayIndex].places.filter(
        (item, index) => index !== targetDeletePlaceIndex,
      );
    }));
    setIsEditing(true);
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
      // const params = { id: createNewScheduleData.id };
      // setSearchParams(params);
    }
  }

  // 把state的訊息放進去object，然後推進整個messages array
  const newMessage = {
    user_id: user.uid, // 放user.id
    user_name: user.displayName,
    message: inputMessage,
    sent_time: new Date(),
    photo_url: user.photoURL,
    unread: false,
  };

  async function addNewMessageToFirestoreFirst() {
    const chatRoomMessageArray = doc(db, 'chat_rooms', chatBox.chat_room_id);
    // Atomically add a new region to the "regions" array field.
    await updateDoc(chatRoomMessageArray, {
      messages: arrayUnion(newMessage),
    });
  }

  // 有訊息更新時就要及時拿出來！
  // 如果聊天室是關的，就要說有未讀訊息！
  // useEffect在render畫面時就會先跑一次加1，所以取用未讀訊息state時要減一

  useEffect(() => {
    if (existScheduleId) {
      const chatRoomMessageArray = query(collection(db, 'chat_rooms'), where('schedule_id', '==', existScheduleId));
      return onSnapshot(chatRoomMessageArray, (querySnapshot) => {
        if (openChat === false) {
          console.log(openChat, '有訊息沒讀唷～！');
          querySnapshot.forEach((doc) => {
            updateChatBox(doc.data());
            setUnreadMessage((prev) => prev + 1);
          });
        } else if (openChat === true) {
          console.log(openChat, '聊天室有開，直接顯示訊息！');
          querySnapshot.forEach((doc) => {
            updateChatBox(doc.data());
            setUnreadMessage(0);
          });
        }
      });
    }
    return undefined;
  }, [existScheduleId, updateChatBox, openChat]);

  // 有人編輯時要及時呈現

  useEffect(() => {
    if (existScheduleId) {
      const theScheduleBeingEdited = doc(db, 'schedules', existScheduleId);
      onSnapshot(theScheduleBeingEdited, (querySnapshot) => {
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
    setIsEditing(true);
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
    setIsEditing(true);
  }

  // 拿一週的哪一天

  const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  // 手動更改行程內容！
  function updatePlaceTitle(placeTitle, dayIndex, placeIndex) {
    updateScheduleData((draft) => {
      draft.trip_days[dayIndex].places[placeIndex].place_title = placeTitle;
    });
    setIsEditing(true);
  }
  function updatePlaceAddress(placeAddress, dayIndex, placeIndex) {
    updateScheduleData((draft) => {
      draft.trip_days[dayIndex].places[placeIndex].place_address = placeAddress;
    });
    setIsEditing(true);
  }
  function updateStayTime(stayTime, dayIndex, placeIndex) {
    updateScheduleData((draft) => {
      draft.trip_days[dayIndex].places[placeIndex].stay_time = stayTime;
    });
    setIsEditing(true);
  }
  // 按下新增行程後，會出現空白的input field，同時導向搜尋區域，搜尋後按下加入行程，把搜尋到的結果放到最新的那個行程
  function updatePlaceTitleBySearch(placeTitle, clickedDayIndex) {
    updateScheduleData((draft) => {
      draft.trip_days[clickedDayIndex].places[draft.trip_days[clickedDayIndex].places.length - 1].place_title = placeTitle;
    });
    setIsEditing(true);
  }

  function updatePlaceAddressBySearch(placeAddress, choosedDayIndex) {
    updateScheduleData((draft) => {
      draft.trip_days[choosedDayIndex].places[draft.trip_days[choosedDayIndex].places.length - 1].place_address = placeAddress;
    });
    setIsEditing(true);
  }

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setInputMessage(''); addNewMessageToFirestoreFirst();
    }
  };

  return (
    <>
      <GreyHeaderComponent />
      <ScheduleWrapper>
        {/* <AddAndSearch recommendList={recommendList} setRecommendList={setRecommendList} /> */}
        <AddAndSearchBox active={active}>
          <CloseSearchIcon
            src={PinkCloseIcon}
            onClick={() => setActive(false)}
          />
          <ResultsArea>
            <SearchedPlace>
              <SearchedPlaceTitle>
                {selected.structured_formatting ? selected.structured_formatting.main_text : ''}
              </SearchedPlaceTitle>
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
                  <RecommendPlcePhoto alt="place" src={place.photos?.[0]?.getUrl?.() ?? defaultArray[index % 5]} />
                </RecommendPlace>
              ))}
            </RecommendPlaces>
          </ResultsArea>
        </AddAndSearchBox>
        <LeftContainer active={active}>
          <ScheduleTitleAndCompleteButtonArea>
            <Link to="/my-schedules">
              <GoBackIcon src={GoBackSrc} />
            </Link>
            <ScheduleTitle>
              行程：
              {scheduleData ? scheduleData.title : ''}
            </ScheduleTitle>
            <Link to="/my-schedules">
              <CompleteButton isEditing={isEditing} onClick={() => setCompletedScheduleToDb()} type="button">儲存</CompleteButton>
            </Link>
          </ScheduleTitleAndCompleteButtonArea>
          <DateContainer>
            <p>
              {scheduleData ? scheduleData.embark_date : ''}
              ～
              {scheduleData ? scheduleData.end_date : '' }
            </p>
            <AddDayButton type="button" onClick={() => addDayInSchedule()}>＋</AddDayButton>
          </DateContainer>
          <DayContainer>
            {scheduleData ? scheduleData.trip_days
              .map((dayItem, dayIndex) => (
                <DayContainerTitle
                  active={dayIndex === choosedDayIndex}
                  onClick={() => { setChoosedDayIndex(dayIndex); }}
                  key={dayIndex}
                  data-position={dayIndex}
                  draggable
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragLeave={onDragLeave}
                  className={dragAndDrop && dragAndDrop.draggedTo === Number(dayIndex) ? 'dropArea' : ''}
                >
                  <DragIcon active={dayIndex === choosedDayIndex} src={dayIndex === choosedDayIndex ? whiteDragSrc : dragSrc} style={{ width: '15px', height: '15px', marginRight: '3px' }} />

                  {new Date(Date.parse(scheduleData.embark_date) + (dayIndex * 86400000)).toISOString().split('T')[0].split('-')[1]}
                  /
                  {new Date(Date.parse(scheduleData.embark_date) + (dayIndex * 86400000)).toISOString().split('T')[0].split('-')[2]}
                  <br />
                  {weekday[(new Date(scheduleData.embark_date).getDay() + dayIndex) % 7]}
                  <DeleteIcon style={{ width: '18px', height: '18px', marginLeft: '5px' }} active={dayIndex === choosedDayIndex} src={dayIndex === choosedDayIndex ? whiteTrashCan : greyTrashCanSrc} onClick={() => deleteCertainDay(dayIndex)} />
                </DayContainerTitle>
              ))
              : ''}
          </DayContainer>
          {scheduleData ? scheduleData?.trip_days[choosedDayIndex]?.places
            .map((placeItem, placeIndex) => (
              <>
                {(placeIndex !== 0
                  ? (
                    <DurationDistanceArea>

                      <>
                        <CarClockIconArea>
                          <CarClockIcon src={CarSrc} />
                          {distance?.[choosedDayIndex]?.[placeIndex - 1] ?? ''}
                        </CarClockIconArea>
                        <CarClockIconArea>
                          <CarClockIcon src={ClockSrc} />
                          {duration?.[choosedDayIndex]?.[placeIndex - 1] ?? ''}
                        </CarClockIconArea>
                      </>
                    </DurationDistanceArea>
                  )
                  : '')}
                <PlaceContainer
                  key={placeIndex}
                  data-position={placeIndex}
                  draggable
                  onDragStart={onPlaceDragStart}
                  onDragOver={onPlaceDragOver}
                  onDrop={onPlaceDrop}
                  onDragLeave={onPlaceDragLeave}
                >
                  <DragIcon src={dragSrc} />
                  <PlaceContainerInputArea>
                    <InputBox style={{ width: '50px' }}>
                      <StyledInput
                        style={{ width: '30px' }}
                        value={placeItem?.stay_time}
                        onChange={(e) => {
                          updateStayTime(e.target.value, choosedDayIndex, placeIndex);
                        }}
                      />
                      <div style={{ fontSize: '14px' }}>分</div>
                    </InputBox>
                    <InputBox>
                      <StyledInput
                        value={placeItem?.place_title}
                        onChange={(e) => {
                          updatePlaceTitle(e.target.value, choosedDayIndex, placeIndex);
                        }}
                      />
                    </InputBox>
                    <InputBox>
                      <StyledInput
                        value={placeItem?.place_address}
                        onChange={(e) => {
                          updatePlaceAddress(e.target.value, choosedDayIndex, placeIndex);
                        }}
                      />
                    </InputBox>
                  </PlaceContainerInputArea>
                  <DeleteIcon src={BlueTrashCanSrc} onClick={() => deleteCertainPlace(choosedDayIndex, placeIndex)} />
                </PlaceContainer>
              </>
            ))
            : ''}
          <DayContainerBoxes />
          <AddNewScheduleButton type="button" onClick={() => { setActive(true); addPlaceInDay(choosedDayIndex); setClickedDayIndex(choosedDayIndex); }}>
            新增行程
            <AddNewScheduleIcon alt="add-new-schedule" src={plusIcon} />
          </AddNewScheduleButton>
        </LeftContainer>
        <RightContainer>
          <Map
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
          />
          <ChatRoom openChat={openChat}>
            <ChatRoomTitle>
              聊天室
              <CloseIcon src={CloseChatIcon} onClick={() => setOpenChat(false)} />
            </ChatRoomTitle>
            <MessagesDisplayArea>
              {chatBox ? chatBox?.messages.map((item) => (
                <MessageBox>
                  <UserPhoto src={item.photo_url} />
                  <NameMessage>
                    <Name>
                      {item?.user_name}
                    </Name>
                    <Message>{item?.message}</Message>
                  </NameMessage>
                </MessageBox>
              )) : ''}
            </MessagesDisplayArea>
            <EnterArea>
              <MessageInput
                onKeyPress={handleEnter}
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
          <div>
            {unreadMessage > 1 && openChat === false
              ? <UnreadMessage active={unreadMessage > 1 && openChat === false}>{unreadMessage - 1 }</UnreadMessage>
              : ''}
            <ChatIcon active={unreadMessage > 1 && openChat === false} src={SpeakIcon} openChat={openChat} onClick={() => setOpenChat(true)} />
          </div>
        </RightContainer>
      </ScheduleWrapper>
    </>
  );
}

export default Schedule;
