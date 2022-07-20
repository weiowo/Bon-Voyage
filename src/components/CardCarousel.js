/* eslint-disable no-undef */
import React, {
  useState, useContext, useEffect, useRef, useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import {
  doc, getDoc, updateDoc, arrayRemove, arrayUnion, setDoc,
} from 'firebase/firestore';
import { useImmer } from 'use-immer';
import produce from 'immer';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import db from '../utils/firebase-init';
import BckSrc from '../pages/images/paris.png';
import ArrowToRightSrc from '../pages/images/arrow-right.png';
import ArrowToLeftSrc from '../pages/images/arrow-left.png';
import Default1 from '../pages/images/default1.png';
import Default2 from '../pages/images/default2.png';
import Default3 from '../pages/images/default3.png';
import Default4 from '../pages/images/default4.png';
import Default5 from '../pages/images/default5.png';
import unfilledStar from '../pages/images/unfilled_star.jpg';
import Travel from '../pages/images/travel-2.png';
import Suitcase from '../pages/images/suitcase-2.png';
import filledStar from '../pages/images/filled_star.jpg';
import '../pages/animation.css';
import {
  ModalBackground, ModalBox, ModalImgArea, ModalImg, ModalLeftArea,
  AddToScheduleButton, CloseModalButton, LeftButton,
  ModalContentWrapper, CurrentSchedulesTitle, ScheduleChoicesBoxWrapper, ScheduleChoicesBox,
  ScheduleChoiceTitle, ModalPlaceTitle, ModalPlaceAddress, ConfirmChooseDayButton,
  ButtonStarArea, AddFavoriteIcon, Loading,
} from '../pages/City';
import {
  RemindWrapper, ClickAndAdd,
  RemindIcon, RemindText, SuitcaseIcon, RemindRightPart, StyledBlackLink,
} from '../pages/MySchedules';
import UserContext from './UserContextComponent';

const defaultArray = [Default1, Default2, Default3, Default4, Default5];

const NearByPlaceWrapper = styled.div`
width:100vw;
height:340px;
display:flex;
flex-direction:row;
align-items:center;
justify-content:center;
gap:10px;
@media screen and (max-width:1180px){
  height:280px;
  margin-top:20px;
}
@media screen and (max-width:900px){
  flex-direction:column;
  margin-top:30px;
  height:370px;
}`;

const NearByPlaceLeftArea = styled.div`
width:15vw;
height:350px;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
@media screen and (max-width:900px){
  width:80vw;
  height:100px;
  margin-right:0px;
}
`;

const NearbyPlaceTitle = styled.div`
font-size:25px;
color:#1F456E;
font-weight:600;
margin-bottom:15px;
@media screen and (max-width:900px){
  margin-bottom:5px;
  font-size:24px;
  margin-bottom:15px;
}`;

const NearByPlaceDescription = styled.div`
font-size:12px;
color:grey;
font-weight:600;
margin-bottom:15px;
@media screen and (max-width:900px){
  font-size:16px;
  margin-bottom:25px;
}`;

const NearByViewMoreButton = styled.button`
display:none;
width:130px;
height:40px;
color:white;
border:none;
background-color:#0492c2;
border-radius:5px;
color:white;
font-weight:600;
letter-spacing:3px;
@media screen and (max-width:900px){
  display:none;
}`;

const CardsWrapper = styled.div`
width:800px;
height:290px;
display:flex; 
flex-direction:column;
align-items:center;
justify-content:center;
flex-wrap:wrap;
position:relative;
overflow:hidden;
z-index:1;
gap:20px;
@media screen and (max-width:1180px){
  width:650px;
  margin-right:0px;
}
@media screen and (max-width:900px){
display:none;
}`;

const SmallScreenCards = styled.div`
display:none;
@media screen and (max-width:900px){
  width:95%;
  height:200px;
  display:flex; 
  flex-direction:column;
  align-items:center;
  justify-content:center;
  flex-wrap:wrap;
  position:relative;
  overflow:hidden;
  z-index:1;
}
@media screen and (max-width:900px){
  width:100%;
}
@media screen and (max-width:500px){
  height:160px;
  overflow:auto;
  width:100%;
}`;

const Cards = styled.div`
display:flex;
padding-left:15px;
padding-bottom:10px;
opacity:1;
flex-direction:column;
justify-content:flex-end;
width:180px;
height:240px;
color:white;
font-weight:600;
position:relative;
text-align:left;
overflow:hidden;
border-radius:10px;
background-image: url(${BckSrc});
cursor:pointer;
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
@media screen and (max-width:1180px){
  width:140px;
  height:180px;
}
@media screen and (max-width:900px){
  width:30%;
  height:280px;
  font-size:13px;
}
@media screen and (max-width:500px){
  width:30%;
  height:180px;
}
@media screen and (max-width:500px){
  height:150px;
}`;

const SmallScreenCardsWrapper = styled.div`
display:none;
@media screen and (max-width:900px){
  display:flex;
  width:90%;
  align-items:center;
  gap:10px;
}
@media screen and (max-width:500px){
  width:100%;
  gap:0px;
  padding-right:3px;
  padding-left:3px;
}`;

const Arrow = styled.img`
width:40px;
height:40px;
cursor:pointer;
@media screen and (max-width:900px){
display:none;
}`;

const SmallScreenArrow = styled.img`
display:none;
@media screen and (max-width:900px){
  display:block;
  width:25px;
  height:25px;
  cursor:pointer;
}`;

const libraries = ['places'];

const mapContainerStyle = {
  height: '0vh',
  width: '0vw',
};

function CardsCarousel({ currentNearbyAttraction }) {
  console.log(currentNearbyAttraction);
  const user = useContext(UserContext);
  const [cityPageScheduleData, setCityPageScheduleData] = useImmer([]);
  const [clickedScheduleIndex, setClickedScheduleIndex] = useState();
  const [clickedScheduleId, setClickedScheduleId] = useState();
  const [dayIndex, setDayIndex] = useState();
  const [modalIsActive, setModalIsActive] = useState(false);
  const [chooseScheduleModalIsActive, setChooseScheduleModalIsActive] = useState(false);
  const [chooseDayModalIsActive, setChooseDayModalIsActive] = useState(false);
  const [modalDetail, setModalDetail] = useState({});
  const [liked, setLiked] = useState(false);
  const [clickedPlaceUrl, setClickedPlaceUrl] = useState('');
  const [clickedPlaceName, setClickedPlaceName] = useState('');
  const [clickedPlaceAddress, setClickedPlaceAddress] = useState('');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const navigate = useNavigate();
  const [currentIndex, setCurrnetIndex] = useState(5);

  function nextPhotos() {
    if (currentIndex >= currentNearbyAttraction.length - 4) {
      setCurrnetIndex(0);
    } else { setCurrnetIndex((prevIndex) => prevIndex + 1); }
  }
  function prevPhotos() {
    if (currentIndex <= 0) {
      setCurrnetIndex(currentNearbyAttraction.length - 4);
    } else {
      setCurrnetIndex((prevIndex) => prevIndex - 1);
    }
  }

  async function checkLikeOrNot(placeId) {
    const userArticlesArray = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userArticlesArray);
    if (docSnap?.data()?.loved_attraction_ids?.indexOf(placeId) > -1) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }

  function ShowDetailNCheckLikedOrNot(clickedPlaceId) {
    if (user.uid) {
      checkLikeOrNot(clickedPlaceId);
    } else {
      setLiked(false);
    }
    setModalIsActive(true);
    const placeRequest = {
      placeId: clickedPlaceId,
    };
    const service = new google.maps.places.PlacesService(mapRef.current);
    service.getDetails(placeRequest, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setModalDetail(place);
      }
    });
  }

  async function handleFavorite(placeId) {
    if (!user.uid) {
      alert('請先登入唷～');
      navigate({ pathname: '/profile' });
    } else {
      const userArticlesArray = doc(db, 'users', user.uid);
      if (liked) {
        setLiked(false);
        await updateDoc(userArticlesArray, {
          loved_attraction_ids: arrayRemove(placeId),
        });
      } else if (!liked) {
        setLiked(true);
        await updateDoc(userArticlesArray, {
          loved_attraction_ids: arrayUnion(placeId),
        });
        const createAttraction = doc(db, 'attractions', placeId);
        await setDoc(createAttraction, ({
          place_id: placeId,
          place_title: clickedPlaceName,
          place_address: clickedPlaceAddress,
          place_url: clickedPlaceUrl,
        }));
      }
    }
  }

  // 當使用者按下modal中的「加入行程」時，拿出此使用者的所有行程給他選
  // 先把行程拿回來存在immer裡面，等使用者按的時候再render modal
  // 按下哪一個行程後，用那個index去抓那天的細節

  useEffect(() => {
    async function getUserArrayList() {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      function getSchedulesFromList() {
        docSnap.data()?.owned_schedule_ids?.forEach(async (item) => {
          const docs = doc(db, 'schedules', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            if (Snap.data().deleted === false) {
              setCityPageScheduleData((draft) => {
                draft.push(Snap.data());
              });
            }
          }
        });
      }
      getSchedulesFromList();
    }
    getUserArrayList();
  }, [setCityPageScheduleData, user.uid]);

  function ComfirmedAdded() {
    const newPlace = {
      place_title: modalDetail.name,
      place_address: modalDetail.formatted_address,
      stay_time: 60,
    };
    const newScheduleData = produce(cityPageScheduleData, (draft) => {
      draft[clickedScheduleIndex].trip_days[dayIndex].places.push(newPlace);
    });
    setCityPageScheduleData(newScheduleData);
    async function passAddedDataToFirestore() {
      const scheduleRef = doc(db, 'schedules', clickedScheduleId);
      await updateDoc(scheduleRef, { ...newScheduleData[clickedScheduleIndex] });
    }
    passAddedDataToFirestore();
  }

  function handleModalClose() {
    setModalIsActive(false);
  }

  function handleUserOrNot() {
    if (!user.uid) {
      alert('請先登入唷～');
      navigate({ pathname: '/profile' });
    } else {
      setModalIsActive(false); setChooseScheduleModalIsActive(true);
    }
  }

  if (!isLoaded) return '';

  return (
    <>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        onLoad={onMapLoad}
      />
      <ModalBackground active={modalIsActive}>
        <ModalBox>
          {modalDetail
            ? (
              <>
                <ModalLeftArea>
                  <ModalPlaceTitle>{modalDetail?.name}</ModalPlaceTitle>
                  <ModalPlaceAddress>{modalDetail?.formatted_address}</ModalPlaceAddress>
                  <ButtonStarArea>
                    <AddToScheduleButton
                      onClick={() => { handleUserOrNot(); }}
                    >
                      加入行程
                    </AddToScheduleButton>
                    <AddFavoriteIcon
                      onClick={() => { handleFavorite(modalDetail.place_id); }}
                      src={liked ? filledStar : unfilledStar}
                    />
                  </ButtonStarArea>
                </ModalLeftArea>
                <ModalImgArea>
                  <ModalImg alt="detail_photo" src={modalDetail?.photos?.[0]?.getUrl() ? modalDetail?.photos?.[0]?.getUrl() : defaultArray[0]} />
                  <ModalImg alt="detail_photo" src={modalDetail?.photos?.[1]?.getUrl() ? modalDetail?.photos?.[1]?.getUrl() : defaultArray[1]} />
                  <ModalImg alt="detail_photo" src={modalDetail?.photos?.[2]?.getUrl() ? modalDetail?.photos?.[2]?.getUrl() : defaultArray[2]} />
                  <ModalImg alt="detail_photo" src={modalDetail?.photos?.[3]?.getUrl() ? modalDetail?.photos?.[3]?.getUrl() : defaultArray[3]} />
                </ModalImgArea>
                <CloseModalButton
                  type="button"
                  onClick={() => { handleModalClose(); }}
                >
                  X
                </CloseModalButton>
              </>
            )
            : <Loading />}
        </ModalBox>
      </ModalBackground>
      <ModalBackground active={chooseScheduleModalIsActive}>
        <ModalBox style={{ display: 'flex', flexDirection: 'column' }}>
          <LeftButton
            type="button"
            onClick={() => {
              setModalIsActive(true);
              setChooseScheduleModalIsActive(false);
            }}
          />
          <ModalContentWrapper>
            <CurrentSchedulesTitle>您的現有行程</CurrentSchedulesTitle>
            <ScheduleChoicesBoxWrapper>
              {cityPageScheduleData.length === 0 ? (
                <RemindWrapper style={{ width: '100%', justifyContent: 'center' }}>
                  <RemindIcon src={Travel} />
                  <RemindRightPart style={{ width: 'auto' }}>
                    <RemindText>
                      還沒有行程捏～
                      <br />
                      是時候創建行程囉！
                    </RemindText>
                    <StyledBlackLink to="/choose-date">
                      <ClickAndAdd>點我創建</ClickAndAdd>
                    </StyledBlackLink>
                    <SuitcaseIcon src={Suitcase} />
                  </RemindRightPart>
                </RemindWrapper>
              ) : cityPageScheduleData.map((item, index) => (
                <ScheduleChoicesBox
                  key={item?.schedule_id}
                  onClick={() => {
                    setClickedScheduleId(item?.schedule_id);
                    setClickedScheduleIndex(index);
                    setChooseDayModalIsActive(true); setChooseScheduleModalIsActive(false);
                  }}
                  id={item.schedule_id}
                >
                  <ScheduleChoiceTitle key={item?.title}>
                    {item.title}
                  </ScheduleChoiceTitle>
                </ScheduleChoicesBox>
              ))}
            </ScheduleChoicesBoxWrapper>
          </ModalContentWrapper>
          <CloseModalButton
            type="button"
            onClick={() => setChooseScheduleModalIsActive(false)}
          >
            X
          </CloseModalButton>
        </ModalBox>
      </ModalBackground>
      <ModalBackground active={chooseDayModalIsActive}>
        <ModalBox style={{ display: 'flex', flexDirection: 'column' }}>
          <LeftButton
            type="button"
            onClick={() => {
              setChooseDayModalIsActive(false);
              setChooseScheduleModalIsActive(true);
            }}
          />
          <ModalContentWrapper>
            <CurrentSchedulesTitle>請選擇天數</CurrentSchedulesTitle>
            <ScheduleChoicesBoxWrapper>
              {cityPageScheduleData
                ? cityPageScheduleData[clickedScheduleIndex]?.trip_days.map((item, index) => (
                  <ScheduleChoicesBox
                    key={item?.schedule_id}
                    clicked={dayIndex === index}
                    onClick={() => {
                      setDayIndex(index);
                    }}
                    style={{ display: 'flex' }}
                  >
                    <ScheduleChoiceTitle key={`${item?.schedule_id}day${item?.title}`}>
                      第
                      {index + 1}
                      天
                    </ScheduleChoiceTitle>
                  </ScheduleChoicesBox>
                )) : ''}
            </ScheduleChoicesBoxWrapper>
            <ConfirmChooseDayButton type="button" onClick={() => { ComfirmedAdded(); setChooseDayModalIsActive(false); }}>完成選擇</ConfirmChooseDayButton>
          </ModalContentWrapper>
          <CloseModalButton
            type="button"
            onClick={() => setChooseDayModalIsActive(false)}
          >
            X
          </CloseModalButton>
        </ModalBox>
      </ModalBackground>
      <NearByPlaceWrapper>
        <NearByPlaceLeftArea>
          <NearbyPlaceTitle>周邊景點</NearbyPlaceTitle>
          <NearByPlaceDescription>
            該出門走走囉！
            <br />
            周邊有什麼景點呢？
          </NearByPlaceDescription>
          <NearByViewMoreButton>查看更多</NearByViewMoreButton>
        </NearByPlaceLeftArea>
        <Arrow src={ArrowToLeftSrc} onClick={() => prevPhotos()} />
        <CardsWrapper>
          {currentNearbyAttraction?.length === 0
            ? <Loading />
            : (currentNearbyAttraction.slice(currentIndex, currentIndex + 4).map((item, index) => (
              <Cards
                key={item.place_id}
                id={item.place_id}
                onClick={(e) => {
                  ShowDetailNCheckLikedOrNot(
                    e.target.id,
                  );
                  setClickedPlaceUrl(item?.photos?.[0]?.getUrl?.());
                  setClickedPlaceName(item?.name);
                  setClickedPlaceAddress(item?.vicinity);
                }}
                className={index}
                style={{ backgroundImage: `url(${item.photos?.[0]?.getUrl?.() ?? '哈哈'})` }}
              >
                <div
                  key={`${item?.name}+${item?.place_id}`}
                  id={item.place_id}
                >
                  {item.name}
                </div>
              </Cards>
            )))}
        </CardsWrapper>
        <SmallScreenCardsWrapper>
          <SmallScreenArrow onClick={() => prevPhotos()} src={ArrowToLeftSrc} />
          <SmallScreenCards>
            {currentNearbyAttraction?.length === 0
              ? <Loading />
              : (currentNearbyAttraction.slice(currentIndex, currentIndex + 3)
                .map((item, index) => (
                  <Cards
                    key={item.place_id}
                    onClick={(e) => {
                      ShowDetailNCheckLikedOrNot(
                        e.target.id,
                      );
                      setClickedPlaceUrl(item?.photos?.[0]?.getUrl?.());
                      setClickedPlaceName(item?.name);
                      setClickedPlaceAddress(item?.vicinity);
                    }}
                    id={item.place_id}
                    className={index}
                    style={{ backgroundImage: `url(${item.photos?.[0]?.getUrl?.() ?? defaultArray[index % 5]})` }}
                  >
                    <div
                      key={`${item?.name}+${item?.place_id}`}
                      id={item.place_id}
                    >
                      {item.name}
                    </div>
                  </Cards>
                )))}
          </SmallScreenCards>
          <SmallScreenArrow onClick={() => nextPhotos()} src={ArrowToRightSrc} />
        </SmallScreenCardsWrapper>
        <Arrow src={ArrowToRightSrc} onClick={() => nextPhotos()} />
      </NearByPlaceWrapper>
    </>
  );
}

CardsCarousel.propTypes = {
  // eslint-disable-next-line max-len
  currentNearbyAttraction: PropTypes.arrayOf(PropTypes.shape({ place_id: PropTypes.string }).isRequired),
};

CardsCarousel.defaultProps = {
  currentNearbyAttraction: [],
};

export default CardsCarousel;
