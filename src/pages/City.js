import React, {
  useCallback, useEffect, useRef, useState, useContext,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import styled from 'styled-components/macro';
import {
  doc, getDoc, updateDoc, arrayRemove, arrayUnion, setDoc,
} from 'firebase/firestore';
import { useImmer } from 'use-immer';
import produce from 'immer';
import db from '../utils/firebase-init';
import CITY_BG from './images/city.png';
import BlackHeaderComponent from '../components/Headers/BlackHeader';
import UserContext from '../components/UserContextComponent';
import Footer from '../components/Footer';
import RemindWrapper, {
  ClickAndAdd, RemindIcon, RemindText, SuitcaseIcon, RemindRightPart, StyledBlackLink,
} from '../components/Reminder/CreateTrip';
import Loading from '../components/Loading';
import ModalImgArea, { ModalImg } from '../components/Modal/ModalImgArea';
import Modal from '../components/Modal/Modal';
import ModalLeftArea from '../components/Modal/ModalLeftArea';
import CloseModalButton from '../components/Modal/CloseButton';
import ButtonStarArea, { AddToScheduleButton, AddFavoriteIcon } from '../components/Modal/ButtonStar';
import ModalPlaceTitle, { ModalPlaceAddress } from '../components/Modal/ModalText';
import RestaurantBox, {
  RestaurantPhoto, RestaurantBoxRightContent, RestaurantTitle,
  RestaurantDescription, RestaurantSeeMoreButton,
} from '../components/Cards/Restaurant';
import AttractionBox, {
  AttractionPhotoContainer, AttractionPhoto, AttractionTitle,
  AttractionDescription, AttractionSeeMoreButton,
} from '../components/Cards/Attraction';
import SchedulesWrapper, {
  ConfirmDayButton, CurrentSchedulesTitle, ScheduleBoxWrapper, ScheduleBox, ScheduleTitle,
} from '../components/Modal/ScheduleChoice';
import LeftButton from '../components/Modal/GoBackButton';
import STAR from '../constants/stars';
import PLACE_PHOTO from '../constants/place.photo';
import REMINDER_ICONS from '../constants/reminder.icon';

const Banner = styled.div`
width:100vw;
height:50vw;
background-image: url(${CITY_BG});
background-size:cover;
background-repeat: no-repeat;
background-blend-mode: multiply;
`;

const CityTitle = styled.div`
width:100vw;
height:auto;
z-index:10;
font-size:35px;
font-weight:600;
position:absolute;
top:130px;
@media screen and (max-width:1000px){
  top:100px;
  font-size:30px;
}
@media screen and (max-width:800px){
  top:70px;
  font-size:30px;
}
@media screen and (max-width:520px){
  top:60px;
  font-size:20px;
}
@media screen and (max-width:400px){
  top:50px;
  font-size:20px;
}
`;

// 景點區域

const ContentArea = styled.div`
width:100vw;
height:400px;
display:flex;
flex-direction:column;
`;

const AttractionAreaTitle = styled.div`
width:100vw;
height:auto;
font-size:26px;
display:flex;
justify-content:center;
margin-top:50px;
font-weight:600;
`;

const AttractionWrapper = styled.div`
display:flex;
width:100vw;
height:auto;
flex-wrap:wrap;
justify-content:center;
margin-top:0px;
@media screen and (max-width:1000px){
  gap:20px;
}
@media screen and (max-width:890px){
  gap:10px;
}
@media screen and (max-width:777px){
  gap:10px;
}
@media screen and (max-width:513px){
  gap:10px;
}
`;

const RestaurantAreaTitle = styled.div`
width:100vw;
height:auto;
font-size:26px;
display:flex;
justify-content:center;
margin-top:50px;
font-weight:600;
`;

const RestaurantWrapper = styled.div`
display:flex;
width:100vw;
height:auto;
flex-wrap:wrap;
justify-content:center;
margin-top:0px;
gap:30px;
@media screen and (max-width:777px){
  gap:10px;
}
@media screen and (max-width:513px){
  gap:10px;
}
`;

const libraries = ['places'];

const mapContainerStyle = {
  height: '0vh',
  width: '0vw',
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 43.6532,
  lng: -79.3832,
};

function City() {
  const { search } = useLocation();
  const user = useContext(UserContext);
  const [nearbyData, setNearbyData] = useState();
  const [cityPageScheduleData, setCityPageScheduleData] = useImmer([]);
  const [clickedScheduleIndex, setClickedScheduleIndex] = useState();
  const [clickedScheduleId, setClickedScheduleId] = useState();
  const [dayIndex, setDayIndex] = useState();
  const [modalIsActive, setModalIsActive] = useState(false);
  const [chooseScheduleModalIsActive, setChooseScheduleModalIsActive] = useState(false);
  const [chooseDayModalIsActive, setChooseDayModalIsActive] = useState(false);
  const [modalDetail, setModalDetail] = useState();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [clickedPlaceUrl, setClickedPlaceUrl] = useState('');
  const [clickedPlaceName, setClickedPlaceName] = useState('');
  const [clickedPlaceAddress, setClickedPlaceAddress] = useState('');
  const lat = Number(new URLSearchParams(search).get('lat'));
  const lng = Number(new URLSearchParams(search).get('lng'));
  const cityFromUrl = new URLSearchParams(search).get('city');
  const optionFromUrl = new URLSearchParams(search).get('option');

  function handleModalClose() {
    setModalIsActive(false);
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const searchNearby = useCallback(() => {
    if (!isLoaded) return;
    let requests = [];

    if (optionFromUrl === 'all') {
      requests = [{
        location: { lat, lng },
        radius: '2000',
        type: 'lodging',
      },
      {
        location: { lat, lng },
        radius: '2000',
        type: 'restaurant',
      },
      {
        location: { lat, lng },
        radius: '2000',
        type: 'tourist_attraction',
      }];
    } else {
      requests = [{
        location: { lat, lng },
        radius: '2000',
        type: optionFromUrl,
      }];
    }

    const service = new google.maps.places.PlacesService(mapRef.current);
    requests.forEach((request) => {
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setNearbyData((preData) => ({ ...preData, [request.type]: results }));
        }
      });
    });
  }, [lat, lng, optionFromUrl, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setTimeout(() => {
      searchNearby();
    }, 1000);
  }, [searchNearby, isLoaded]);

  useEffect(() => {
    async function getUserArrayList() {
      if (!user.uid) { return; }
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      function getSchedulesFromList() {
        docSnap?.data()?.owned_schedule_ids?.forEach(async (item) => {
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
      place_title: modalDetail?.name,
      place_address: modalDetail?.formatted_address,
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

  function handleUserOrNot() {
    if (!user.uid) {
      alert('請先登入唷～');
      navigate({ pathname: '/profile' });
    } else {
      setModalIsActive(false); setChooseScheduleModalIsActive(true);
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

  // 確認是否收藏過了 // 打api拿detail

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

  // 按下星星時更改狀態與user資料

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

  if (!isLoaded) return '';

  return (
    <>
      <BlackHeaderComponent />
      <Modal active={modalIsActive} flexDirection="row">
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
                    onClick={() => { handleFavorite(modalDetail?.place_id); }}
                    src={liked ? STAR?.FULL_STAR : STAR?.EMPTY_STAR}
                  />
                </ButtonStarArea>
              </ModalLeftArea>
              <ModalImgArea>
                <ModalImg alt="detail_photo" src={modalDetail?.photos?.[0]?.getUrl() || PLACE_PHOTO[0]} />
                <ModalImg alt="detail_photo" src={modalDetail?.photos?.[1]?.getUrl() || PLACE_PHOTO[1]} />
                <ModalImg alt="detail_photo" src={modalDetail?.photos?.[2]?.getUrl() || PLACE_PHOTO[2]} />
                <ModalImg alt="detail_photo" src={modalDetail?.photos?.[3]?.getUrl() || PLACE_PHOTO[3]} />
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
      </Modal>
      <Modal
        active={chooseScheduleModalIsActive}
        flexDirection="column"
      >
        <LeftButton
          type="button"
          onClick={() => {
            setModalIsActive(true);
            setChooseScheduleModalIsActive(false);
          }}
        />
        <SchedulesWrapper>
          <CurrentSchedulesTitle>您的現有行程</CurrentSchedulesTitle>
          <ScheduleBoxWrapper>
            {cityPageScheduleData.length === 0 ? (
              <RemindWrapper style={{ width: '100%', justifyContent: 'center' }}>
                <RemindIcon src={REMINDER_ICONS?.CAR_ICON} />
                <RemindRightPart style={{ width: 'auto' }}>
                  <RemindText>
                    還沒有行程捏～
                    <br />
                    是時候創建行程囉！
                  </RemindText>
                  <StyledBlackLink to="/choose-date">
                    <ClickAndAdd>點我創建</ClickAndAdd>
                  </StyledBlackLink>
                  <SuitcaseIcon src={REMINDER_ICONS?.SUITCASE_ICON} />
                </RemindRightPart>
              </RemindWrapper>
            ) : cityPageScheduleData.map((item, index) => (
              <ScheduleBox
                key={item?.schedule_id}
                onClick={() => {
                  setClickedScheduleId(item?.schedule_id);
                  setClickedScheduleIndex(index);
                  setChooseDayModalIsActive(true); setChooseScheduleModalIsActive(false);
                }}
                id={item?.schedule_id}
              >
                <ScheduleTitle
                  key={item?.title}
                >
                  {item?.title}
                </ScheduleTitle>
              </ScheduleBox>
            ))}
          </ScheduleBoxWrapper>
        </SchedulesWrapper>
        <CloseModalButton
          type="button"
          onClick={() => setChooseScheduleModalIsActive(false)}
        >
          X
        </CloseModalButton>
      </Modal>
      <Modal
        active={chooseDayModalIsActive}
        flexDirection="column"
      >
        <LeftButton
          type="button"
          onClick={() => {
            setChooseDayModalIsActive(false);
            setChooseScheduleModalIsActive(true);
          }}
        />
        <SchedulesWrapper>
          <CurrentSchedulesTitle>請選擇天數</CurrentSchedulesTitle>
          <ScheduleBoxWrapper>
            {cityPageScheduleData
              ? cityPageScheduleData[clickedScheduleIndex]?.trip_days.map((item, index) => (
                <ScheduleBox
                  key={item?.schedule_creator_user_id}
                  clicked={dayIndex === index}
                  onClick={() => {
                    setDayIndex(index);
                  }}
                  style={{ display: 'flex' }}
                >
                  <ScheduleTitle>
                    第
                    {index + 1}
                    天
                  </ScheduleTitle>
                </ScheduleBox>
              )) : ''}
          </ScheduleBoxWrapper>
          <ConfirmDayButton type="button" onClick={() => { ComfirmedAdded(); setChooseDayModalIsActive(false); }}>完成選擇</ConfirmDayButton>
        </SchedulesWrapper>
        <CloseModalButton
          type="button"
          onClick={() => setChooseDayModalIsActive(false)}
        >
          X
        </CloseModalButton>
      </Modal>
      <Banner />
      <CityTitle>
        哈囉，
        {cityFromUrl}
        !
      </CityTitle>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onLoad={onMapLoad}
      />
      {nearbyData
        ? (
          <ContentArea>
            <AttractionAreaTitle>
              {nearbyData.tourist_attraction ? `${cityFromUrl}必去景點推薦` : ''}
            </AttractionAreaTitle>
            <AttractionWrapper>
              {nearbyData.tourist_attraction
                ? nearbyData.tourist_attraction.map((item, index) => (
                  <AttractionBox
                    key={item?.place_id}
                    id={item?.place_id}
                    onClick={(e) => {
                      ShowDetailNCheckLikedOrNot(e.target.id);
                      setClickedPlaceUrl(item?.photos?.[0]?.getUrl?.());
                      setClickedPlaceName(item?.name);
                      setClickedPlaceAddress(item?.vicinity);
                    }}
                  >
                    <AttractionPhotoContainer
                      id={item.place_id}
                    >
                      <AttractionPhoto
                        id={item.place_id}
                        alt="attraction-photo"
                        src={item.photos?.[0]?.getUrl?.() ? item.photos?.[0]?.getUrl?.()
                          : PLACE_PHOTO[index % 5]}
                      />
                    </AttractionPhotoContainer>
                    <AttractionTitle
                      id={item.place_id}
                    >
                      {item.name}
                    </AttractionTitle>
                    <AttractionDescription
                      id={item.place_id}
                    />
                    <AttractionSeeMoreButton
                      id={item.place_id}
                    >
                      瞭解更多
                    </AttractionSeeMoreButton>
                  </AttractionBox>
                )) : ''}
            </AttractionWrapper>
            <RestaurantAreaTitle>
              {nearbyData.restaurant ? `${cityFromUrl}必吃餐廳推薦` : ''}
            </RestaurantAreaTitle>
            <RestaurantWrapper>
              {nearbyData.restaurant ? nearbyData.restaurant.map((item, index) => (
                <RestaurantBox
                  key={item?.place_id}
                  onClick={(e) => {
                    ShowDetailNCheckLikedOrNot(e.target.id);
                    setClickedPlaceUrl(item?.photos?.[0]?.getUrl?.());
                    setClickedPlaceName(item?.name);
                    setClickedPlaceAddress(item?.vicinity);
                  }}
                  id={item.place_id}
                >
                  <RestaurantPhoto
                    id={item.place_id}
                    alt="attraction-photo"
                    src={item.photos?.[0]?.getUrl?.() ? item.photos?.[0]?.getUrl?.()
                      : PLACE_PHOTO[index % 5]}
                  />
                  <RestaurantBoxRightContent>
                    <RestaurantTitle
                      id={item.place_id}
                    >
                      {item.name}
                    </RestaurantTitle>
                    <RestaurantDescription
                      id={item.place_id}
                    />
                    <RestaurantSeeMoreButton
                      id={item.place_id}
                    >
                      瞭解更多

                    </RestaurantSeeMoreButton>
                  </RestaurantBoxRightContent>
                </RestaurantBox>
              )) : ''}
            </RestaurantWrapper>
            <AttractionAreaTitle>
              {nearbyData.lodging ? `${cityFromUrl} 熱門飯店推薦` : ''}
            </AttractionAreaTitle>
            <AttractionWrapper>
              {nearbyData.lodging ? nearbyData?.lodging.map((item, index) => (
                <AttractionBox
                  key={item?.place_id}
                  onClick={(e) => {
                    ShowDetailNCheckLikedOrNot(e.target.id);
                    setClickedPlaceUrl(item?.photos?.[0]?.getUrl?.());
                    setClickedPlaceName(item?.name);
                    setClickedPlaceAddress(item?.vicinity);
                  }}
                  id={item.place_id}
                >
                  <AttractionPhotoContainer>
                    <AttractionPhoto
                      id={item.place_id}
                      alt="attraction-photo"
                      src={item.photos?.[0]?.getUrl?.() ? item.photos?.[0]?.getUrl?.()
                        : PLACE_PHOTO[index % 5]}
                    />
                  </AttractionPhotoContainer>
                  <AttractionTitle
                    id={item.place_id}
                  >
                    {item.name}
                  </AttractionTitle>
                  <AttractionDescription
                    id={item.place_id}
                  />
                  <AttractionSeeMoreButton
                    id={item.place_id}
                  >
                    瞭解更多
                  </AttractionSeeMoreButton>
                </AttractionBox>
              )) : ''}
            </AttractionWrapper>
            <Footer />
          </ContentArea>
        )
        : (
          <Loading />
        )}
    </>
  );
}

export default City;
