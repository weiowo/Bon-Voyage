import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  doc, getDoc, updateDoc, arrayRemove, arrayUnion, setDoc,
} from 'firebase/firestore';
import { useImmer } from 'use-immer';
import produce from 'immer';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import db from '../utils/firebase-init';
import BckSrc from './images/paris.png';
import ArrowToRightSrc from './images/arrow-right.png';
import ArrowToLeftSrc from './images/arrow-left.png';
import Default1 from './images/default1.png';
import Default2 from './images/default2.png';
import Default3 from './images/default3.png';
import Default4 from './images/default4.png';
import Default5 from './images/default5.png';
import unfilledStar from './images/unfilled_star.jpg';
import filledStar from './images/filled_star.jpg';
import './animation.css';
import {
  ModalBackground, ModalBox, ModalImgArea, ModalImg, ModalLeftArea,
  AddToScheduleButton, CloseModalButton, LeftButton,
  ModalContentWrapper, CurrentSchedulesTitle, ScheduleChoicesBoxWrapper, ScheduleChoicesBox,
  ScheduleChoiceTitle, ModalPlaceTitle, ModalPlaceAddress, ConfirmChooseDayButton,
  ButtonStarArea, AddFavoriteIcon,
} from './City';
import UserContext from '../components/UserContextComponent';

const defaultArray = [Default1, Default2, Default3, Default4, Default5];

// const AddFavoriteIcon = styled.img`
// width:25px;
// height:25px;
// cursor:pointer;
// position:absolute;
// right:15%;
// justify-self:right;
// `;

const NearByPlaceWrapper = styled.div`
width:100vw;
height:450px;
display:flex;
flex-direction:row;
align-items:center;
justify-content:center;
gap:10px;
@media screen and (max-width:800px){
  flex-direction:column;
  margin-top:30px;
  height:400px;
}`;

const NearByPlaceLeftArea = styled.div`
width:15vw;
height:350px;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
@media screen and (max-width:800px){
  width:80vw;
  height:100px;
  margin-right:0px;
}`;

const NearbyPlaceTitle = styled.div`
font-size:25px;
color:#1F456E;
font-weight:600;
margin-bottom:15px;
@media screen and (max-width:800px){
  margin-bottom:5px;
  font-size:30px;
  margin-bottom:15px;
}`;

const NearByPlaceDescription = styled.div`
font-size:12px;
color:grey;
font-weight:600;
margin-bottom:15px;
@media screen and (max-width:800px){
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
@media screen and (max-width:800px){
  display:none;
}`;

const CardsWrapper = styled.div`
width:800px;
height:280px;
display:flex; 
flex-direction:column;
align-items:center;
justify-content:center;
flex-wrap:wrap;
position:relative;
overflow:hidden;
z-index:1;
gap:20px;
@media screen and (max-width:800px){
display:none;
}`;

const SmallScreenCards = styled.div`
display:none;
@media screen and (max-width:800px){
  width:95%;
  height:150px;
  display:flex; 
  flex-direction:column;
  align-items:center;
  justify-content:center;
  flex-wrap:wrap;
  position:relative;
  overflow:hidden;
  z-index:1;
}`;

// const ButtonStarArea = styled.div`
// width:100%;
// height:auto;
// display:flex;
// align-items:center;
// justify-content:center;
// `;

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
// background: linear-gradient(#3204fdba, #9907facc), url(${BckSrc}) no-repeat cover;
@media screen and (max-width:800px){
  width:30%;
  height:250px;
  font-size:13px;
}`;

const SmallScreenCardsWrapper = styled.div`
display:none;
@media screen and (max-width:800px){
  display:flex;
  width:90%;
  align-items:center;
  gap:10px;
}`;

const Arrow = styled.img`
width:40px;
height:40px;
cursor:pointer;
@media screen and (max-width:800px){
display:none;
}`;

const SmallScreenArrow = styled.img`
display:none;
@media screen and (max-width:800px){
  display:block;
  width:25px;
  height:25px;
  cursor:pointer;
}`;

function CardsCarousel({ currentNearbyAttraction }) {
  const user = useContext(UserContext);
  console.log(user);
  const [cityPageScheduleData, setCityPageScheduleData] = useImmer([]); // 是這個人所有的行程哦！不是單一筆行程!
  const [clickedScheduleIndex, setClickedScheduleIndex] = useState(); // 點到的那個行程的index!
  const [clickedScheduleId, setClickedScheduleId] = useState(); // 點到的那個行程的ID!
  const [dayIndex, setDayIndex] = useState();
  const [modalIsActive, setModalIsActive] = useState(false);
  const [chooseScheduleModalIsActive, setChooseScheduleModalIsActive] = useState(false);
  const [chooseDayModalIsActive, setChooseDayModalIsActive] = useState(false);
  const [modalDetail, setModalDetail] = useState({});
  const [liked, setLiked] = useState(false);
  const [clickedPlaceUrl, setClickedPlaceUrl] = useState('');
  const [clickedPlaceName, setClickedPlaceName] = useState('');
  const [clickedPlaceAddress, setClickedPlaceAddress] = useState('');

  console.log(liked);
  console.log('我在cardCarouselpage', currentNearbyAttraction);
  const navigate = useNavigate();
  //   const attractions = JSON.parse(window.localStorage.getItem('周遭景點暫存區STRING'));
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

  // 打開modal時先確認有沒有追蹤過
  // 有的話就讓星星亮起，沒有的話就讓星星空的
  // 有登入的話才判斷，沒登入的話就不亮，按下去會執行另一個叫他登入的function

  async function checkLikeOrNot(placeId) {
    const userArticlesArray = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userArticlesArray);
    console.log(docSnap.data());
    if (docSnap.data().loved_attraction_ids.indexOf(placeId) > -1) {
      setLiked(true);
      console.log('已經追蹤過嚕!');
    } else {
      console.log('沒有哦');
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
    fetch(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${clickedPlaceId}&language=zh-TW&key=${process.env.REACT_APP_GOOGLE_API_KEY}`)
      .then((response) => response.json()).then((jsonData) => {
        console.log('我在useEffect中', jsonData.result);
        setModalDetail(jsonData.result);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
  }

  // 按下星星後把此景點加入收藏清單，也會先確認是否有登入～
  // 按下星星後就先把這個位置存到db的attractions資料庫中～

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
        console.log('已退追此景點!');
      } else if (!liked) {
        setLiked(true);
        await updateDoc(userArticlesArray, {
          loved_attraction_ids: arrayUnion(placeId),
        });
        console.log('已追蹤此景點!');
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
      if (docSnap.exists()) {
        console.log('Document data:', docSnap?.data()?.owned_schedule_ids);
      } else {
        console.log('No such document!');
      }
      function getSchedulesFromList() {
        docSnap.data()?.owned_schedule_ids?.forEach(async (item, index) => {
          const docs = doc(db, 'schedules', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            if (Snap.data().deleted === false) {
              console.log('這位使用者的行程', index, Snap.data());
              setCityPageScheduleData((draft) => {
                draft.push(Snap.data());
              });
            }
          } else {
            console.log('沒有這個行程！');
          }
        });
      }
      getSchedulesFromList();
    }
    getUserArrayList();
  }, [setCityPageScheduleData, user.uid]);

  // 選好行程跟天數時，會把行程的名稱跟地址加到immer中，並送到database中

  function ComfirmedAdded() {
    console.log('已經加入囉！');
    const newPlace = {
      place_title: modalDetail.name,
      place_address: modalDetail.formatted_address,
      stay_time: 60,
    };
    // 用 immer 產生出新的行程資料
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

  // 關於modal部分

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

  return (
    <>
      <ModalBackground active={modalIsActive}>
        <ModalBox>
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
            <ModalImg alt="detail_photo" src={modalDetail?.photos?.[0] ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=250&photoreference=${modalDetail?.photos[1]?.photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}` : defaultArray[1]} />
            <ModalImg alt="detail_photo" src={modalDetail?.photos?.[0] ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=250&photoreference=${modalDetail?.photos[2]?.photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}` : defaultArray[2]} />
            <ModalImg alt="detail_photo" src={modalDetail?.photos?.[0] ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=250&photoreference=${modalDetail?.photos[3]?.photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}` : defaultArray[3]} />
            <ModalImg alt="detail_photo" src={modalDetail?.photos?.[0] ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=250&photoreference=${modalDetail?.photos[4]?.photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}` : defaultArray[4]} />
          </ModalImgArea>
          <CloseModalButton
            type="button"
            onClick={() => { handleModalClose(); }}
          >
            X
          </CloseModalButton>
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
              {cityPageScheduleData ? cityPageScheduleData.map((item, index) => (
                <ScheduleChoicesBox
                  onClick={() => {
                    setClickedScheduleId(item.schedule_id);
                    setClickedScheduleIndex(index);
                    setChooseDayModalIsActive(true); setChooseScheduleModalIsActive(false);
                  }}
                  id={item.schedule_id}
                >
                  <ScheduleChoiceTitle>
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
      <NearByPlaceWrapper>
        <NearByPlaceLeftArea>
          <NearbyPlaceTitle>周邊景點</NearbyPlaceTitle>
          <NearByPlaceDescription>
            天氣真好，該出門走走囉！
            <br />
            看看周邊有什麼景點呢？
          </NearByPlaceDescription>
          <NearByViewMoreButton>查看更多</NearByViewMoreButton>
        </NearByPlaceLeftArea>
        <Arrow src={ArrowToLeftSrc} onClick={() => prevPhotos()} />
        <CardsWrapper>
          {currentNearbyAttraction
            ? currentNearbyAttraction.slice(currentIndex, currentIndex + 4).map((item, index) => (
              <Cards
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
                <div>
                  {item.name}
                </div>
              </Cards>
            )) : (
              <div className="progress container">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            )}
          {/* 為何字沒有跑出？ */}
        </CardsWrapper>
        <SmallScreenCardsWrapper>
          <SmallScreenArrow onClick={() => prevPhotos()} src={ArrowToLeftSrc} />
          <SmallScreenCards>
            {currentNearbyAttraction
              ? currentNearbyAttraction.slice(currentIndex, currentIndex + 3).map((item, index) => (
                <Cards
                  onClick={(e) => {
                    ShowDetailNCheckLikedOrNot(
                      e.target.id,
                    );
                    setClickedPlaceUrl(item?.photos?.[0]?.getUrl?.());
                    setClickedPlaceName(item?.name);
                    setClickedPlaceAddress(item?.vicinity);
                  }}
                  id={currentIndex}
                  className={index}
                  style={{ backgroundImage: `url(${item.photos?.[0]?.getUrl?.() ?? defaultArray[index % 5]})` }}
                >
                  <div>
                    {item.name}
                  </div>
                </Cards>
              )) : (
                <div className="progress container">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              )}
            {/* 為何字沒有跑出？ */}
          </SmallScreenCards>
          <SmallScreenArrow onClick={() => nextPhotos()} src={ArrowToRightSrc} />
        </SmallScreenCardsWrapper>
        <Arrow src={ArrowToRightSrc} onClick={() => nextPhotos()} />
      </NearByPlaceWrapper>
    </>
  );
}

CardsCarousel.propTypes = {
  currentNearbyAttraction: PropTypes.func.isRequired,
};

export default CardsCarousel;
