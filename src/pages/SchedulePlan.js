import styled from 'styled-components/macro';
import {
  GoogleMap, useLoadScript,
} from '@react-google-maps/api';
import React, {
  useEffect, useState, useContext, useRef, useCallback, Fragment,
} from 'react';
import {
  collection, doc, getDoc, getDocs, query, where, arrayUnion, updateDoc, onSnapshot,
} from 'firebase/firestore';
import { useImmer } from 'use-immer';
import { useLocation, Link } from 'react-router-dom';
import UserContext from '../components/UserContextComponent';
import db from '../utils/firebase-init';
import Map from './Map';
import GreyHeaderComponent from '../components/Headers/GreyHeader';
import ChatRoom, {
  ChatIcon, CloseIcon, ChatRoomTitle, MessagesDisplayArea, MessageBox, NameMessage,
  Name, Message, UserPhoto, EnterArea, MessageInput, EnterMessageButton, UnreadMessage,
} from '../components/ChatRoom/Chatroom';
import ResultsArea, {
  SearchedPlace, RecommendPlaces, RecommendPlace, RecommendPlaceLeftArea,
  RecommendPlaceTitle, SearchedPlaceTitle, RecommendPlcePhoto,
} from '../components/Schedule/SearchBox';
import PlaceContainer, {
  PlaceContainerInputArea, InputBox, DeleteIcon, StyledInput,
  AddNewScheduleButton, AddNewScheduleIcon,
} from '../components/Schedule/PlaceContainer';
import DayContainer, { DayContainerTitle, DayContainerBoxes, DragIcon } from '../components/Schedule/DayContainer';
import DurationDistanceArea, { CarClockIcon, CarClockIconArea } from '../components/Schedule/DurationDistance';
import PLACE_PHOTO from '../constants/place.photo';
import ICONS from '../constants/schedule.page.icon';

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
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: transparent;
    border-radius: 10px;
  }
  &::-webkit-scrollbar {
    width: 3px;
    display:none;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: transparent;
    display:none;
  }
  @media screen and (max-width:800px){
    width:100vw;
    display:${(props) => (props.show ? 'flex' : 'none')};
  }
`;

const RightContainer = styled.div`
  width:55vw;
  height:calc(100vh-60px);
  @media screen and (max-width:800px){
    display:block;
    width:0vw;
    height:0vh;
  }
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

const ScheduleTitleAndCompleteButtonArea = styled.div`
  width:40vw;
  justify-content:space-between;
  height:auto;
  display:flex;
  align-items:center;
  margin-top:20px;
  gap:20px;
  @media screen and (max-width:800px){
    width:100%;
    padding-right:20px;
    padding-left:20px;
  }
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
  @media screen and (max-width:800px){
    width:100%;
  }
`;

const CompleteButton = styled.button`
  width:50px;
  height:30px;
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

const AddAndSearchBox = styled.div`
  width:45vw;
  height:calc(100vh - 60px);
  position:relative;
  display:${(props) => (props.active ? 'block' : 'none')};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  z-index:10;
  @media screen and (max-width:800px){
    width:100vw;
  }
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

const GoBackIcon = styled.img`
  width:32px;
  height:32px;
`;

const ChooseShowMapOrSchedule = styled.div`
  display:none;
  @media screen and (max-width:800px){
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
    background-color: #226788;
    padding-bottom:10px;
    padding-top:10px;
    cursor:pointer;
    position:fixed;
    bottom:0;
    z-index:50;
  }
`;

const SeperateLine = styled.div`
  height:90%;
  width:1.2px;
  background-color:white;
`;

const SchdeuleMapButton = styled.button`
  background-color:transparent;
  font-weight:600;
  width:100%;
  color:white;
  border:none;
  cursor:pointer;
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
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ['places'],
  });
  const mapRef = useRef();

  const mapStyle = {
    height: '0vh',
    width: '0vw',
    position: 'absolute',
  };

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const [scheduleData, updateScheduleData] = useImmer();
  const [chatBox, updateChatBox] = useImmer({});
  const [recommendList, setRecommendList] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState({});
  const [clickedDayIndex, setClickedDayIndex] = useState('');
  const [openChat, setOpenChat] = useState(false);
  const [unreadMessage, setUnreadMessage] = useState(0);
  const [schdeuleDisplay, setScheduleDisplay] = useState(true);
  const [mapDisplay, setMapDisplay] = useState(false);
  const [distance, setDistance] = useImmer({});
  const [duration, setDuration] = useImmer({});
  const user = useContext(UserContext);
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);
  const [placeDragAndDrop, setPlaceDragAndDrop] = useState(placeInitialDnDState);
  const [choosedDayIndex, setChoosedDayIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const { search } = useLocation();
  const existScheduleId = new URLSearchParams(search).get('id');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!existScheduleId) return;
    async function getCertainSchedule() {
      const docRef = doc(db, 'schedules', existScheduleId);
      const docSnap = await getDoc(docRef);
      const data = {
        ...docSnap.data(),
        trip_days: docSnap.data().trip_days.map((day, index) => ({ ...day, key: index })),
      };
      console.log(data);
      if (docSnap.exists()) {
        updateScheduleData(data);
      } else {
        console.log('No such document!');
      }
    }
    async function getChatRoom() {
      const chatRoomMessageIdRef = query(collection(db, 'chat_rooms'), where('schedule_id', '==', existScheduleId));
      const chatroom = await getDocs(chatRoomMessageIdRef);
      chatroom.forEach((document) => {
        updateChatBox(document.data());
      });
    }
    getCertainSchedule();
    getChatRoom();
  }, [updateScheduleData, existScheduleId, updateChatBox]);

  const newDay = {
    places: [],
  };

  function addDayInSchedule() {
    updateScheduleData((draft) => {
      draft.trip_days.push(newDay);
      const originalEndDateToMilliSecond = Date.parse(draft.end_date);
      const MilliSecondsToDate = new Date(originalEndDateToMilliSecond + 86400000)
        .toISOString();
      const addedDateEndDate = MilliSecondsToDate.split('T')[0];
      draft.end_date = addedDateEndDate;
    });
    setIsEditing(true);
  }

  const newPlace = {
    place_title: '',
    place_address: '',
    stay_time: 60,
  };

  function addPlaceInDay(dayIndex) {
    updateScheduleData((draft) => {
      draft?.trip_days[dayIndex]?.places.push(newPlace);
    });
    setIsEditing(true);
  }

  function deleteCertainDay(targetDeleteDayIndex) {
    updateScheduleData((draft) => {
      draft.trip_days = draft.trip_days.filter(
        (item, index) => index !== targetDeleteDayIndex,
      );
    });
    setIsEditing(true);
  }

  function deleteCertainPlace(targetDeleteDayIndex, targetDeletePlaceIndex) {
    updateScheduleData(((draft) => {
      draft.trip_days[targetDeleteDayIndex]
        .places = draft.trip_days[targetDeleteDayIndex]?.places.filter(
          (item, index) => index !== targetDeletePlaceIndex,
        );
    }));
    setIsEditing(true);
  }

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
    if (stayTime > 1440) {
      updateScheduleData((draft) => {
        draft.trip_days[dayIndex].places[placeIndex].stay_time = 1440;
      });
    } else {
      updateScheduleData((draft) => {
        draft.trip_days[dayIndex].places[placeIndex].stay_time = stayTime;
      });
    }
    setIsEditing(true);
  }
  function updatePlaceTitleBySearch(placeTitle, selectedDayIndex) {
    updateScheduleData((draft) => {
      draft.trip_days[selectedDayIndex]
        .places[draft.trip_days[clickedDayIndex].places.length - 1].place_title = placeTitle;
    });
    setIsEditing(true);
  }

  function updatePlaceAddressBySearch(placeAddress, selectedDayIndex) {
    updateScheduleData((draft) => {
      draft.trip_days[selectedDayIndex]
        .places[draft.trip_days[choosedDayIndex].places.length - 1].place_address = placeAddress;
    });
    setIsEditing(true);
  }

  async function setCompletedScheduleToDb() {
    if (existScheduleId) {
      const scheduleRef = doc(db, 'schedules', existScheduleId);
      await updateDoc(scheduleRef, scheduleData);
      const chatRoomData = query(collection(db, 'chat_rooms'), where('schedule_id', '==', existScheduleId));
      await updateDoc(chatRoomData, chatBox);
    }
  }

  useEffect(() => {
    if (existScheduleId) {
      const theScheduleBeingEdited = doc(db, 'schedules', existScheduleId);
      onSnapshot(theScheduleBeingEdited, (querySnapshot) => {
        updateScheduleData(querySnapshot.data());
      });
    }
  }, [existScheduleId, updateScheduleData]);

  const newMessage = {
    user_id: user.uid,
    user_name: user.displayName,
    message: inputMessage,
    sent_time: new Date(),
    photo_url: user.photoURL,
    unread: false,
  };

  async function addNewMessageToFirestoreFirst() {
    const chatRoomMessageArray = doc(db, 'chat_rooms', chatBox.chat_room_id);
    await updateDoc(chatRoomMessageArray, {
      messages: arrayUnion(newMessage),
    });
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatBox]);

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setInputMessage(''); addNewMessageToFirestoreFirst();
    }
  };

  useEffect(() => {
    if (existScheduleId) {
      const chatRoomMessageArray = query(collection(db, 'chat_rooms'), where('schedule_id', '==', existScheduleId));
      return onSnapshot(chatRoomMessageArray, (querySnapshot) => {
        if (openChat === false) {
          querySnapshot.forEach((document) => {
            updateChatBox(document.data());
            setUnreadMessage((prev) => prev + 1);
          });
        } else if (openChat === true) {
          querySnapshot.forEach((document) => {
            updateChatBox(document.data());
            setUnreadMessage(0);
          });
        }
      });
    }
    return undefined;
  }, [existScheduleId, updateChatBox, openChat]);

  const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  if (!isLoaded) return <div>...</div>;

  const onDragStart = (event) => {
    const initialPosition = Number(event.currentTarget.dataset.position);
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: initialPosition,
      isDragging: true,
      originalOrder: scheduleData?.trip_days,
    });
  };

  const onDragOver = (event) => {
    event.preventDefault();
    let newList = dragAndDrop.originalOrder;
    const { draggedFrom } = dragAndDrop;
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

  const onPlaceDragStart = (event) => {
    const initialPosition = Number(event.currentTarget.dataset.position);
    setPlaceDragAndDrop({
      ...placeDragAndDrop,
      placeDraggedFrom: initialPosition,
      placeIsDragging: true,
      placeOriginalOrder: scheduleData?.trip_days[choosedDayIndex]?.places,
    });
  };
  const onPlaceDragOver = (event) => {
    event.preventDefault();
    let placeNewList = placeDragAndDrop.placeOriginalOrder;
    const { placeDraggedFrom } = placeDragAndDrop;
    const placeDraggedTo = Number(event.currentTarget.dataset.position);
    const placeItemDragged = placeNewList[placeDraggedFrom];
    const placeRemainingItems = placeNewList?.filter((item, index) => index !== placeDraggedFrom);
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

  const onPlaceDrop = () => {
    updateScheduleData((draft) => {
      draft.trip_days[choosedDayIndex].places = placeDragAndDrop?.placeUpdatedOrder;
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

  return (
    <>
      <GreyHeaderComponent />
      <ScheduleWrapper>
        <AddAndSearchBox active={active}>
          <ResultsArea>
            <SearchedPlace>
              <SearchedPlaceTitle>
                {selected.structured_formatting ? selected.structured_formatting.main_text : ''}
              </SearchedPlaceTitle>
              <AddToPlaceButton
                onClick={() => {
                  updatePlaceTitleBySearch(
                    selected.structured_formatting.main_text,
                    clickedDayIndex,
                  );
                  updatePlaceAddressBySearch(
                    selected.structured_formatting.secondary_text,
                    clickedDayIndex,
                  ); setActive(false); setScheduleDisplay(true);
                }}
              >
                加入行程
              </AddToPlaceButton>
            </SearchedPlace>
            <RecommendPlaces>
              周邊推薦景點：
              {recommendList?.map((place, index) => (
                <RecommendPlace
                  key={place?.name}
                >
                  <RecommendPlaceLeftArea>
                    <RecommendPlaceTitle>
                      {place?.name}
                    </RecommendPlaceTitle>
                    <AddToPlaceButton onClick={() => { updatePlaceTitleBySearch(place?.name, clickedDayIndex); updatePlaceAddressBySearch(place?.vicinity, clickedDayIndex); setActive(false); setScheduleDisplay(true); }} type="button">加入行程</AddToPlaceButton>
                  </RecommendPlaceLeftArea>
                  <RecommendPlcePhoto alt="place" src={place?.photos?.[0]?.getUrl?.() ?? PLACE_PHOTO[index % 5]} />
                </RecommendPlace>
              ))}
            </RecommendPlaces>
          </ResultsArea>
        </AddAndSearchBox>
        <LeftContainer active={active} show={schdeuleDisplay}>
          <ScheduleTitleAndCompleteButtonArea>
            <Link to="/my-schedules">
              <GoBackIcon src={ICONS?.GO_BACK_ICON} />
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
            { scheduleData?.trip_days
              ? (
                <p>
                  {new Date(Date.parse(scheduleData?.embark_date)
               + (0 * 86400000))?.toISOString()?.split('T')?.[0]}
                  { scheduleData?.trip_days.length > 1 ? `～${new Date(Date.parse(scheduleData?.embark_date)
               + ((scheduleData.trip_days.length - 1) * 86400000))?.toISOString()?.split('T')?.[0]}` : ''}
                </p>
              )
              : ''}
            <AddDayButton type="button" onClick={() => addDayInSchedule()}>＋</AddDayButton>
          </DateContainer>
          <DayContainer>
            {scheduleData ? scheduleData?.trip_days
              ?.map((dayItem, dayIndex) => (
                <DayContainerTitle
                  active={dayIndex === choosedDayIndex}
                  onClick={() => { setChoosedDayIndex(dayIndex); }}
                  key={dayItem.key}
                  data-position={dayIndex}
                  draggable
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragLeave={onDragLeave}
                  className={dragAndDrop && dragAndDrop.draggedTo === Number(dayIndex) ? 'dropArea' : ''}
                >
                  <DragIcon active={dayIndex === choosedDayIndex} src={dayIndex === choosedDayIndex ? ICONS?.WHITE_DRAG_ICON : ICONS?.DRAG_ICON} style={{ width: '15px', height: '15px', marginRight: '3px' }} />
                  {new Date(Date.parse(scheduleData?.embark_date) + (dayIndex * 86400000))?.toISOString()?.split('T')?.[0]?.split('-')?.[1]}
                  /
                  {new Date(Date.parse(scheduleData?.embark_date) + (dayIndex * 86400000))?.toISOString()?.split('T')?.[0]?.split('-')?.[2]}
                  <br />
                  {weekday[(new Date(scheduleData?.embark_date).getDay() + dayIndex) % 7]}
                  <DeleteIcon style={{ width: '18px', height: '18px', marginLeft: '5px' }} active={dayIndex === choosedDayIndex} src={dayIndex === choosedDayIndex ? ICONS?.WHITE_BIN_ICON : ICONS?.GREY_BIN_ICON} onClick={() => deleteCertainDay(dayIndex)} />
                </DayContainerTitle>
              ))
              : ''}
          </DayContainer>
          {scheduleData ? scheduleData?.trip_days[choosedDayIndex]?.places
            ?.map((placeItem, placeIndex) => (
              <Fragment key={`${placeItem?.place_address}`}>
                {(placeIndex !== 0
                  ? (
                    <DurationDistanceArea>
                      <CarClockIconArea>
                        <CarClockIcon src={ICONS?.CAR_ICON} />
                        {distance?.[choosedDayIndex]?.[placeIndex - 1] ?? ''}
                      </CarClockIconArea>
                      <CarClockIconArea>
                        <CarClockIcon src={ICONS?.CLOCK_ICON} />
                        {duration?.[choosedDayIndex]?.[placeIndex - 1] ?? ''}
                      </CarClockIconArea>
                    </DurationDistanceArea>
                  )
                  : '')}
                <PlaceContainer
                  data-position={placeIndex}
                  draggable
                  onDragStart={onPlaceDragStart}
                  onDragOver={onPlaceDragOver}
                  onDrop={onPlaceDrop}
                  onDragLeave={onPlaceDragLeave}
                >
                  <DragIcon src={ICONS?.DRAG_ICON} />
                  <PlaceContainerInputArea>
                    <InputBox style={{ width: '50px' }}>
                      <StyledInput
                        style={{ width: '40px' }}
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
                  <DeleteIcon
                    src={ICONS?.BLUE_BIN_ICON}
                    onClick={() => deleteCertainPlace(choosedDayIndex, placeIndex)}
                  />
                </PlaceContainer>
              </Fragment>
            ))
            : ''}
          <DayContainerBoxes />
          <AddNewScheduleButton type="button" onClick={() => { setActive(true); setScheduleDisplay(false); addPlaceInDay(choosedDayIndex); setClickedDayIndex(choosedDayIndex); }}>
            新增景點
            <AddNewScheduleIcon alt="add-new-schedule" src={ICONS?.PLUS_ICON} />
          </AddNewScheduleButton>
        </LeftContainer>
        <ChooseShowMapOrSchedule>
          <SchdeuleMapButton type="button" onClick={() => { setScheduleDisplay(true); setActive(false); setMapDisplay(false); }}>顯示行程</SchdeuleMapButton>
          <SeperateLine />
          <SchdeuleMapButton type="button" onClick={() => { setScheduleDisplay(false); setMapDisplay(true); }}>顯示地圖</SchdeuleMapButton>
        </ChooseShowMapOrSchedule>
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
            mapDisplay={mapDisplay}
            onClickClose={() => {
              setScheduleDisplay(true);
              setActive(false);
            }}
          />
        </RightContainer>
        <ChatRoom openChat={openChat}>
          <ChatRoomTitle>
            聊天室
            <CloseIcon src={ICONS?.CLOSE_CHAT_ICON} onClick={() => setOpenChat(false)} />
          </ChatRoomTitle>
          <MessagesDisplayArea>
            {chatBox ? chatBox?.messages?.map((item) => (
              <MessageBox key={item?.message} ref={messagesEndRef}>
                <UserPhoto src={item?.photo_url} />
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
            ? (
              <UnreadMessage
                active={unreadMessage > 1 && openChat === false}
              >
                {unreadMessage - 1 }
              </UnreadMessage>
            )
            : ''}
          <ChatIcon
            active={unreadMessage > 1 && openChat === false}
            src={ICONS?.SPEAK_ICON}
            openChat={openChat}
            onClick={() => setOpenChat(true)}
          />
        </div>
      </ScheduleWrapper>
      <GoogleMap
        id="map"
        zoom={10}
        onLoad={onMapLoad}
        mapContainerStyle={mapStyle}
      />
    </>
  );
}

export default Schedule;
