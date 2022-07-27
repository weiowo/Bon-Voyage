import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components/macro';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useImmer } from 'use-immer';
import { useNavigate } from 'react-router-dom';
import {
  doc, getDoc, updateDoc, arrayRemove, arrayUnion, setDoc,
} from 'firebase/firestore';
import SwiperCore, { EffectCoverflow, Navigation } from 'swiper/core';
import produce from 'immer';
import UserContext from '../components/UserContextComponent';
import db from '../utils/firebase-init';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import 'swiper/components/effect-coverflow/effect-coverflow.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';
import './style.css';
import leftArrow from './images/left-arrow.jpg';
import vrPlaces from './vr-place-data';
import rightArrow from './images/up-arrow.png';
import BlackHeaderComponent from '../components/Headers/BlackHeader';
import STAR from '../constants/stars';

const PageTitle = styled.div`
width:100%;
height:30px;
font-size:30px;
color:white;
text-shadow:2px 2px 3px black;
font-weight:600;
@media screen and (max-width:768px){
  width:85%;
  font-size:23px;
}
`;

const TitleStarArea = styled.div`
width:100%;
height:auto;
display:flex;
align-items:center;
justify-content:center;
`;

const ConfirmChooseDayButton = styled.button`
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

const PlaceBox = styled.div`
width:100%;
height:100%;
border-radius:5px;
cursor:pointer;
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.15);
background-blend-mode: multiply;
background-position:center;
`;

const PlaceTitle = styled.div`
position:absolute;
left:15px;
top:12px;
font-size:20px;
font-weight:600;
color:white;
text-shadow:1px 1px 2px black;
`;

const AddFavoriteIcon = styled.img`
width:25px;
height:25px;
cursor:pointer;
position:absolute;
right:15%;
justify-self:right;
`;

const PlaceCountryTitle = styled.div`
@import url("https://fonts.googleapis.com/css2?family=Pangolin&display=swap");
font-family: "Pangolin", sans-serif;
position:absolute;
right:15px;
bottom:12px;
font-size:26px;
font-weight:600;
color:#CEE8F0;
text-shadow:1px 1px 2px black;
`;

const PlaceEngishTitle = styled.div`
position:absolute;
left:15px;
top:40px;
font-size:16px;
font-weight:600;
color:#F4E6D3;
text-shadow:1px 1px 2px black;
`;

const RemindArrow = styled.img`
width:50px;
height:auto;
position:absolute;
bottom:20px;
right:20px;
animation: bounce 1600ms infinite cubic-bezier(0.445, 0.05, 0.55, 0.95);
@media screen and (max-width:882px){
  display:none;
  }
`;

const RemindText = styled.div`
width:60px;
height:auto;
position:absolute;
bottom:-10px;
right:20px;
font-weight:550;
font-size:12px;
border-radius:3px;
border:1px solid black;
// animation: bounce 1600ms infinite cubic-bezier(0.445, 0.05, 0.55, 0.95);
@media screen and (max-width:882px){
  display:none;
  }
`;

const VRModalBackground = styled.div`
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
z-index:500;
`;

const ModalBox = styled.div`
display:flex;
width:80vw;
height:40vw;
background-color:white;
border-radius:10px;
position: relative;
align-items:center;
z-index:1500;
flex-direction:row;
@media screen and (max-width:1344px){
  height:80vh;
}
@media screen and (max-width:1133px){
  height:85vh;
  width:90vw;
}
@media screen and (max-width:882px){
  height:80vh;
  width:90vw;
  flex-direction:column;
}
`;

const ModalImgArea = styled.div`
width:60%;
height:100%;
display:flex;
flex-wrap:wrap;
align-items:center;
gap:10px;
@media screen and (max-width:882px){
  width:100%;
  justify-content:center;
}
`;

const ModalLeftArea = styled.div`
width:40%;
height:85%;
display:flex;
flex-direction:column;
align-items:center;
justify-content:left;
gap:15px;
position:relative;
@media screen and (max-width:945px){
  height:90%;
}
@media screen and (max-width:882px){
  margin-top:20px;
  width:100%;
  height:50%;
  gap:5px;
}
`;

const IFrame = styled.iframe`
width:90%;
height:90%;
border:0;
border-radius:13px;
cursor:pointer;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
@media screen and (max-width:882px){
  width:90%;
  height:95%;
}
`;

const ModalPlaceTitle = styled.div`
font-size:30px;
font-weight:600;
width:75%;
@media screen and (max-width:882px){
  font-size:25px;
}
`;

const ModalPlaceSubtitle = styled.div`
font-size:18px;
font-weight:550;
width:75%;
color:grey;
@media screen and (max-width:1344px){
  font-size:16px;
}
@media screen and (max-width:1133px){
  font-size:15px;
}
@media screen and (max-width:945px){
  font-size:14px;
}
@media screen and (max-width:882px){
display:none;
}
`;

const ModalPlaceDescription = styled.div`
font-size:15px;
width:75%;
text-align: justify;
height:auto;
@media screen and (max-width:882px){
  width:85%;
}
`;

const SeperateLine = styled.div`
width:75%;
height:1.5px;
margin-top:10px;
margin-bottom:10px;
background-color:black;
flex-shrink:0;
@media screen and (max-width:882px){
  width:85%;
  margin-top:5px;
  margin-bottom:5px;
}
`;

const ModalPlaceAddress = styled.div`
width:75%;
color:#696969;
font-size:13px;
display:flex;
flex-direction:column;
align-items:flex-start;
gap:10px;
text-align:justify;
@media screen and (max-width:882px){
  display:none;
  }
  `;

const ModalPlaceCountry = styled.div`
width:20%;
display:flex;
align-items:center;
justify-content:center;
height:20px;
background-color:black;
padding:5px 5px 5px 5px;
border-radius:3px;
color:white;
font-weight:500;
`;

const AddToScheduleButton = styled.button`
width:20%;
height:40px;
border-radius:5px;
background-color:grey;
font-weight:500;
border:none;
color:white;
cursor:pointer;
font-size:15px;
@media screen and (max-width:1133px){
  width:35%;
}
@media screen and (max-width:882px){
  display:none;
  }
`;

const SmallScreenAddButton = styled.button`
display:none;
@media screen and (max-width:882px){
  display:block;
  width:200px;
  height:40px;
  flex-shrink:0;
  border-radius:25px;
  background-color:grey;
  font-weight:500;
  border:none;
  color:white;
  cursor:pointer;
  font-size:17px;
  margin-bottom:30px;
  margin-top:10px;
  }
`;

const CloseModalButton = styled.button`
height:25px;
width:25px;
position:absolute;
display:flex;
align-items:center;
justify-content:center;
right:20px;
top:20px;
text-align:center;
border:none;
border-radius:50%;
background-color:black;
color:white;
cursor:pointer;
`;

const LeftButton = styled.button`
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
`;

const TransparentBackground = styled.div`
width:100vw;
height:450px;
background-color:white;
opacity:0.4;
z-index:100;
position:absolute;
top:30%
`;

const CurrentSchedulesTitle = styled.div`
width:100%;
height:30px;
font-size:17px;
font-weight:600;
margin-top:20px;
margin-bottom:10px;
`;

const ScheduleChoicesBoxWrapper = styled.div`
display:flex;
flex-flow:wrap;
height:auto;
width:80%;
align-items:center;
justify-content:center;
gap:15px;
padding-top:10px;
padding-bottom:20px;
padding-left:2px;
&:after {
  content: "";
  width:455px;
}
overflow:auto;
&::-webkit-scrollbar-track {
  -webkit-box-shadow: transparent;
  border-radius: 10px;
  background-color:transparent;
}
&::-webkit-scrollbar {
  width: 5px;
  background-color:transparent;
}
&::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: transparent;
  background-color:#D3D3D3;
}
`;

const Loading = styled.div`
  margin: auto;
  border: 10px solid #EAF0F6;
  border-radius: 50%;
  border-top: 10px solid #FF7A59;
  width: 70px;
  height: 70px;
  animation: spinner 3s linear infinite;
`;

const ScheduleChoicesBox = styled.div`
display:flex;
align-items:center;
width:220px;
height:60px;
border-radius:10px;
cursor:pointer;
background-color:${(props) => (props.clicked ? '#E6D1F2' : '#e7f5fe')};
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
&:hover {
  background-color:#E6D1F2;
}`;

const ScheduleChoiceTitle = styled.div`
width:170px;
text-align:left;
height:auto;
font-weight:500;
font-size:15px;
margin-left:20px;
`;

const ModalContentWrapper = styled.div`
width:80%;
height:80%;
display:flex;
flex-direction:column;
align-items:center;
z-index:500;
overflow:auto;
&::-webkit-scrollbar-track {
  -webkit-box-shadow: transparent;
  border-radius: 10px;
  background-color:transparent;
}
&::-webkit-scrollbar {
  width: 5px;
  background-color:transparent;
}
&::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: transparent;
  background-color:#D3D3D3;
}
`;

SwiperCore.use([EffectCoverflow, Navigation]);

function VR() {
  const [dayIndex, setDayIndex] = useState();
  const [modalIsActive, setModalIsActive] = useState(false);
  const [chooseScheduleModalIsActive, setChooseScheduleModalIsActive] = useState(false);
  const [chooseDayModalIsActive, setChooseDayModalIsActive] = useState(false);
  const [vrPageScheduleData, setVrPageScheduleData] = useImmer([]); // 是這個人所有的行程哦！不是單一筆行程!
  const [clickedScheduleIndex, setClickedScheduleIndex] = useState(); // 點到的那個行程的index!
  const [clickedScheduleId, setClickedScheduleId] = useState(); // 點到的那個行程的ID!
  const [modalIndex, setModalIndex] = useState(0);
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [clickedPlaceUrl, setClickedPlaceUrl] = useState('');
  const [clickedPlaceName, setClickedPlaceName] = useState('');
  const [clickedPlaceAddress, setClickedPlaceAddress] = useState('');

  // 按下加入行程時先判斷有否登入，有的話才能繼續

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
    if (docSnap.data().loved_attraction_ids.indexOf(placeId) > -1) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }

  function ShowDetailNCheckLikedOrNot(clickedPlaceId, clickedPlaceIndex) {
    if (user.uid) {
      checkLikeOrNot(clickedPlaceId);
    } else {
      setLiked(false);
    }
    setModalIsActive(true);
    setModalIndex(clickedPlaceIndex);
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

  useEffect(() => {
    async function getUserArrayList() {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data().owned_schedule_ids);
      } else {
        console.log('No such document!');
      }
      function getSchedulesFromList() {
        docSnap.data().owned_schedule_ids.forEach(async (item) => {
          const docs = doc(db, 'schedules', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            if (Snap.data().deleted === false) {
              setVrPageScheduleData((draft) => {
                draft.push(Snap.data());
              });
            }
          }
        });
      }
      getSchedulesFromList();
    }
    getUserArrayList();
  }, [setVrPageScheduleData, user.uid]);

  function ComfirmedAdded() {
    const newPlace = {
      place_title: vrPlaces[modalIndex].place_title,
      place_address: vrPlaces[modalIndex].place_address,
      stay_time: 60,
    };
    const newScheduleData = produce(vrPageScheduleData, (draft) => {
      draft[clickedScheduleIndex]?.trip_days[dayIndex]?.places?.push(newPlace);
    });
    setVrPageScheduleData(newScheduleData);
    async function passAddedDataToFirestore() {
      const scheduleRef = doc(db, 'schedules', clickedScheduleId);
      await updateDoc(scheduleRef, { ...newScheduleData[clickedScheduleIndex] });
    }
    passAddedDataToFirestore();
  }
  return (
    <>
      <BlackHeaderComponent />
      <VRModalBackground active={modalIsActive}>
        <ModalBox>
          {vrPlaces
            ? (
              <>
                <ModalLeftArea>
                  <TitleStarArea>
                    <ModalPlaceTitle>
                      {vrPlaces?.[modalIndex]?.place_title}
                    </ModalPlaceTitle>
                    <AddFavoriteIcon
                      onClick={() => { handleFavorite(vrPlaces?.[modalIndex]?.place_id); }}
                      src={liked ? STAR?.FULL_STAR : STAR?.EMPTY_STAR}
                    />
                  </TitleStarArea>
                  <ModalPlaceSubtitle>{vrPlaces?.[modalIndex]?.place_subtitle}</ModalPlaceSubtitle>
                  <SeperateLine />
                  <ModalPlaceDescription>
                    {vrPlaces?.[modalIndex]?.place_description}
                  </ModalPlaceDescription>
                  <SeperateLine />
                  <ModalPlaceAddress>
                    <ModalPlaceCountry>
                      {vrPlaces?.[modalIndex]
                        ?.place_country_title}
                    </ModalPlaceCountry>
                    地址：
                    {vrPlaces?.[modalIndex]
                      ?.place_address}
                  </ModalPlaceAddress>
                  <AddToScheduleButton
                    onClick={() => { handleUserOrNot(); }}
                  >
                    加入行程
                  </AddToScheduleButton>
                  <RemindArrow src={rightArrow} />
                  <RemindText>
                    360°滑動
                    <br />
                    探索當地
                  </RemindText>
                </ModalLeftArea>
                <ModalImgArea>
                  <IFrame title={vrPlaces?.[modalIndex]?.place_title} src={vrPlaces?.[modalIndex]?.vr_embed_link} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </ModalImgArea>
                <SmallScreenAddButton
                  onClick={() => { handleUserOrNot(); }}
                >
                  加入行程
                </SmallScreenAddButton>
                <CloseModalButton
                  type="button"
                  onClick={() => setModalIsActive(false)}
                >
                  X
                </CloseModalButton>

              </>
            )
            : <Loading />}
        </ModalBox>
      </VRModalBackground>
      <VRModalBackground active={chooseScheduleModalIsActive}>
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
              {vrPageScheduleData ? vrPageScheduleData.map((item, index) => (
                <ScheduleChoicesBox
                  key={item?.schedule_id}
                  onClick={() => {
                    setClickedScheduleId(item.schedule_id);
                    setClickedScheduleIndex(index);
                    setChooseDayModalIsActive(true); setChooseScheduleModalIsActive(false);
                  }}
                  id={item.schedule_id}
                >
                  <ScheduleChoiceTitle
                    key={`${item?.schedule_id}+${item?.title}`}
                  >
                    {item.title}
                  </ScheduleChoiceTitle>
                </ScheduleChoicesBox>
              )) : ''}
            </ScheduleChoicesBoxWrapper>
          </ModalContentWrapper>
          <CloseModalButton
            type="button"
            onClick={() => setChooseScheduleModalIsActive(false)}
          >
            X
          </CloseModalButton>
        </ModalBox>
      </VRModalBackground>
      <VRModalBackground active={chooseDayModalIsActive}>
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
              {vrPageScheduleData
                ? vrPageScheduleData[clickedScheduleIndex]?.trip_days.map((item, index) => (
                  <ScheduleChoicesBox
                    key={`${item?.schedule_id}+${item?.title}`}
                    clicked={dayIndex === index}
                    onClick={() => {
                      setDayIndex(index);
                    }}
                    style={{ display: 'flex' }}
                  >
                    <ScheduleChoiceTitle
                      key={`${item?.schedule_id}day${item?.title}`}
                    >
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
      </VRModalBackground>
      <div className="vr-container">
        {/* <div className="title_wrapper"> */}
        <PageTitle>
          With VR, The world is just in front of you.
        </PageTitle>
        {/* </div> */}
        <TransparentBackground />
        <Swiper
          navigation
          effect="coverflow"
          centeredSlides
          slidesPerView={window.innerWidth < 768 ? 1 : 'auto'}
          loop
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          // pagination={{
          //   clickable: true,
          // }}
          className="mySwiper"
        >
          {vrPlaces?.map((item, index) => (
            <SwiperSlide
              key={item?.place_id}
              onClick={() => {
                ShowDetailNCheckLikedOrNot(item.place_id, index);
                setClickedPlaceUrl(item?.cover_photo);
                setClickedPlaceName(item?.place_title);
                setClickedPlaceAddress(item?.place_address);
              }}
            >
              <PlaceBox
                key={item?.place_id}
                style={{ backgroundImage: `url(${item.cover_photo})` }}
              >
                <PlaceTitle>{item.place_title}</PlaceTitle>
                <PlaceEngishTitle>{item.place_english_title}</PlaceEngishTitle>
                <PlaceCountryTitle>{item.place_country_title}</PlaceCountryTitle>
              </PlaceBox>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </>
  );
}

export default VR;
