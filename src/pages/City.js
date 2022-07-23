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
import CitySrc from './images/city.png';
import BlackHeaderComponent from '../components/BlackHeader';
import UserContext from '../components/UserContextComponent';
import leftArrow from './images/left-arrow.jpg';
import Default1 from './images/default1.png';
import Default2 from './images/default2.png';
import Default3 from './images/default3.png';
import Default4 from './images/default4.png';
import Default5 from './images/default5.png';
import unfilledStar from './images/unfilled_star.jpg';
import filledStar from './images/filled_star.jpg';
import Footer from '../components/Footer';
import Travel from './images/travel-2.png';
import Suitcase from './images/suitcase-2.png';
import {
  RemindWrapper, ClickAndAdd,
  RemindIcon, RemindText, SuitcaseIcon, RemindRightPart, StyledBlackLink,
} from './MySchedules';

export const ButtonStarArea = styled.div`
width:100%;
height:auto;
display:flex;
align-items:center;
justify-content:center;
`;

export const AddFavoriteIcon = styled.img`
width:25px;
height:25px;
cursor:pointer;
position:absolute;
right:15%;
justify-self:right;
`;

export const ModalBackground = styled.div`
width:100vw;
height:100vh;
position:fixed;
top:0;
bottom:0;
left:0;
right:0;
background-color:rgba(0, 0, 0, 0.7);
display:flex;
justify-content:center;
align-items:center;
display:${(props) => (props.active ? 'flex' : 'none')};
z-index:100;
`;

export const ModalBox = styled.div`
display:flex;
width:50vw;
height:30vw;
flex-direction:row;
background-color:white;
z-index:10;
border-radius:20px;
z-index:200;
position: relative;
align-items:center;
@media screen and (max-width:1200px){
width:600px;
height:370px;
}
@media screen and (max-width:630px){
  width:80vw;
  height:90vw;
  flex-direction:column;
}
@media screen and (max-width:575px){
  width:80vw;
  height:110vw;
}
@media screen and (max-width:430px){
  height:120vw;
}`;

export const ModalImgArea = styled.div`
width:25vw;
height:22vw;
display:flex;
flex-wrap:wrap;
align-items:center;
gap:10px;
@media screen and (max-width:1200px){
  width:50%;
  height:70%;
}
@media screen and (max-width:630px){
  width:100%;
  height:60%;
  flex-wrap:wrap;
  justify-content:center;
  gap:20px;
  padding-bottom:40px;
}
@media screen and (max-width:575px){
  width:90%;
  height:60%;
  padding-bottom:30px;
}
@media screen and (max-width:430px){
  height:50%;
  gap:8px;
}
`;

export const ModalImg = styled.img`
width:10vw;
height:10vw;
border-radius:10px;
object-fit: cover;
@media screen and (max-width:1200px){
  width:120px;
  height:120px;
}
@media screen and (max-width:630px){
  width:170px;
  height:130px;
  flex-shrink:0;
}
@media screen and (max-width:575px){
  width:140px;
  height:115px;
}
@media screen and (max-width:480px){
  width:120px;
  height:100px;
}
@media screen and (max-width:430px){
  width:110px;
  height:100px;
}
@media screen and (max-width:390px){
  width:120px;
  height:100px;
}
`;

export const ModalLeftArea = styled.div`
width:25vw;
height:28vw;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:10px;
position:relative;
@media screen and (max-width:1200px){
  width:50%;
  height:80%;
}
@media screen and (max-width:630px){
  width:90%;
  height:50%;
  gap:20px;
}
@media screen and (max-width:570px){
  width:90%;
  height:45%;
  gap:20px;
}
@media screen and (max-width:430px){
  height:50%;
}

`;

export const ModalPlaceTitle = styled.div`
font-size:26px;
font-weight:600;
width:80%;
@media screen and (max-width:480px){
  font-size:20px;
  width:90%;
}`;

export const ModalPlaceAddress = styled.div`
width:80%;
color:#696969;
`;

export const AddToScheduleButton = styled.button`
width:10vw;
height:30px;
border-radius:5px;
background-color:grey;
font-weight:500;
border:none;
color:white;
cursor:pointer;
@media screen and (max-width:1200px){
  width:110px;
}`;

export const CloseModalButton = styled.button`
display:flex;
align-items:center;
justify-content:center;
height:25px;
width:25px;
position:absolute;
right:20px;
top:20px;
text-align:center;
border:none;
border-radius:50%;
background-color:black;
color:white;
cursor:pointer;
@media screen and (max-width:400px){
  right:15px;
  top:15px;
}`;

export const LeftButton = styled.button`
height:25px;
width:25px;
position:absolute;
background-image: url(${leftArrow});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
left:20px;
top:20px;
text-align:center;
border:none;
border-radius:50%;
color:white;
cursor:pointer;
@media screen and (max-width:400px){
  left:15px;
  top:15px;
}`;

const Banner = styled.div`
width:100vw;
height:50vw;
background-image: url(${CitySrc});
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

const AttractionBox = styled.div`
display:flex;
flex-direction:column;
align-items:center;
width:250px;
height:auto;
margin-top:30px;
cursor:pointer;
@media screen and (max-width:1000px){
  width:200px;
}
@media screen and (max-width:890px){
  width:180px;
}
@media screen and (max-width:777px){
  width:250px;
}
@media screen and (max-width:513px){
  width:170px;
}
`;

const AttractionPhotoContainer = styled.div`
border-radius:20px;
display: inline-block;
width:200px;
height:240px;
overflow: hidden;
@media screen and (max-width:1000px){
  width:200px;
}
@media screen and (max-width:890px){
  width:180px;
}
@media screen and (max-width:777px){
  width:200px;
  height:240px;
}
@media screen and (max-width:513px){
  width:170px;
}
`;

const AttractionPhoto = styled.img`
border-radius:20px;
display: block;
width:200px;
height:240px;
object-fit: cover;
transition: 0.5s all ease-in-out;
&:hover {
    transform: scale(1.2);
}
@media screen and (max-width:1000px){
  width:200px;
}
@media screen and (max-width:890px){
  width:180px;
}
@media screen and (max-width:777px){
  width:200px;
  height:240px;
}
@media screen and (max-width:513px){
  width:170px;
}
`;

const AttractionTitle = styled.div`
font-size:14px;
margin-top:10px;
font-weight:500;
font-color:#AAAAA;
`;

const AttractionDescription = styled.div`
font-size:10px;
margin-top:5px;
`;

const AttractionSeeMoreButton = styled.button`
font-size:14px;
background-color:#63666A;
color:white;
border-radius:3px;
font-size:10px;
box-style:none;
border:none;
outline:none;
margin-top:10px;
cursor:pointer;
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

const RestaurantBox = styled.div`
display:flex;
align-items:center;
width:350px;
height:160px;
margin-top:20px;
cursor:pointer;
background-color:#FAFAFA;
padding-left:38px;
border-radius:15px;
border: #3f3f3f solid 1px;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
@media screen and (max-width:777px){
  margin-top:15px;
  width:330px;
  padding-left:25px;
}
@media screen and (max-width:513px){
  margin-top:15px;
  width:330px;
  padding-left:25px;
}
`;

const RestaurantPhoto = styled.img`
border-radius:20px;
width:105px;
height:105px;
margin-right:20px;
object-fit: cover;
`;

const RestaurantBoxRightContent = styled.div`
width:auto;
display:flex;
flex-direction:column;
align-items:flex-start;
`;

const RestaurantTitle = styled.div`
font-size:16px;
margin-top:10px;
font-weight:600;
align-self:left;
justify-content:left;
text-align:left;
width:160px;
`;

export const ConfirmChooseDayButton = styled.button`
width:20%;
height:35px;
background: linear-gradient(
  312deg,
  rgb(178, 228, 238) 0%,
  rgb(161, 176, 246) 100%
);
border-radius:25px;
border:none;
color:black;
font-weight:600;
font-size:16px;
cursor:pointer;
`;

const RestaurantDescription = styled.div`
font-size:10px;
margin-top:5px;
color:#949494;
`;

const RestaurantSeeMoreButton = styled.button`
width:80px;
background-color:#63666A;
color:white;
border-radius:3px;
font-size:10px;
box-style:none;
border:none;
outline:none;
margin-top:10px;
cursor:pointer;
`;

export const CurrentSchedulesTitle = styled.div`
width:100%;
height:30px;
font-size:17px;
font-weight:600;
margin-top:20px;
margin-bottom:10px;
`;

export const ScheduleChoicesBoxWrapper = styled.div`
display:flex;
flex-flow:wrap;
height:auto;
width:auto;
align-items:center;
justify-content:center;
gap:15px;
padding-top:10px;
padding-bottom:20px;
padding-left:2px;
&:after {
  content: "";
  width:220px;
}
overflow:auto;
&::-webkit-scrollbar-track {
  -webkit-box-shadow: transparent;
  border-radius: 10px;
  background-color:transparent;
}
&::-webkit-scrollbar {
  width: 6px;
  background-color:transparent;
}
&::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: transparent;
  background-color:#D3D3D3;
}
`;

export const Loading = styled.div`
  margin: auto;
  margin-top:50px;
  border: 10px solid #EAF0F6;
  border-radius: 50%;
  border-top: 10px solid #E6D1F2;
  width: 70px;
  height: 70px;
  animation: spinner 3s linear infinite;
`;

export const ScheduleChoicesBox = styled.div`
display:flex;
align-items:center;
width:220px;
height:60px;
border-radius:10px;
background-color:#e7f5fe;
cursor:pointer;
background-color:${(props) => (props.clicked ? '#E6D1F2' : '#e7f5fe')};
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
&:hover {
  background-color:#E6D1F2;
}`;

export const ScheduleChoiceTitle = styled.div`
width:170px;
text-align:left;
height:auto;
font-weight:500;
font-size:15px;
margin-left:20px;
`;

export const ChooseButton = styled.button`
display:flex;
align-items:center;
justify-content:center;
width:60px;
height:25px;
border-radius:10px;
border:1px solid #296D98;
font-size:13px;
font-weight:550;
margin-right:10px;
cursor:pointer;
background-color:${(props) => (props.clicked ? 'grey' : 'white')};
color:${(props) => (props.clicked ? 'white' : 'black')};
// &:hover {
//   background-color:#296D98;
//   color:white;
// }
`;

export const ModalContentWrapper = styled.div`
width:95%;
height:95%;
display:flex;
flex-direction:column;
align-items:center;
overflow:auto;
&::-webkit-scrollbar-track {
  -webkit-box-shadow: transparent;
  border-radius: 10px;
  background-color:transparent;
}
&::-webkit-scrollbar {
  width: 6px;
  background-color:transparent;
}
&::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: transparent;
  background-color:#D3D3D3;
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

export const defaultArray = [Default1, Default2, Default3, Default4, Default5];

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
                      onClick={() => { handleFavorite(modalDetail?.place_id); }}
                      src={liked ? filledStar : unfilledStar}
                    />
                  </ButtonStarArea>
                </ModalLeftArea>
                <ModalImgArea>
                  <ModalImg alt="detail_photo" src={modalDetail?.photos?.[0]?.getUrl() || defaultArray[0]} />
                  <ModalImg alt="detail_photo" src={modalDetail?.photos?.[1]?.getUrl() || defaultArray[1]} />
                  <ModalImg alt="detail_photo" src={modalDetail?.photos?.[2]?.getUrl() || defaultArray[2]} />
                  <ModalImg alt="detail_photo" src={modalDetail?.photos?.[3]?.getUrl() || defaultArray[3]} />
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
                  id={item?.schedule_id}
                >
                  <ScheduleChoiceTitle
                    key={item?.title}
                  >
                    {item?.title}
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
                    key={item?.schedule_creator_user_id}
                    clicked={dayIndex === index}
                    onClick={() => {
                      setDayIndex(index);
                    }}
                    style={{ display: 'flex' }}
                  >
                    <ScheduleChoiceTitle>
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
                          : defaultArray[index % 5]}
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
                      : defaultArray[index % 5]}
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
                        : defaultArray[index % 5]}
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
