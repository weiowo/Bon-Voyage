/* eslint-disable no-undef */
import styled from 'styled-components/macro';
import React, {
  useEffect, useContext, useState, useRef, useCallback,
} from 'react';
import {
  getDoc, doc, updateDoc, arrayRemove,
} from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { useImmer } from 'use-immer';
import produce from 'immer';
import GreyHeaderComponent from '../components/GreyHeader';
import ProfileSideBarElement from '../components/ProfileSideBar';
import { Line } from './MySchedules';
import db from '../utils/firebase-init';
import UserContext from '../components/UserContextComponent';
import Cover1 from './images/schedule_cover_rec1.jpg';
import Cover2 from './images/schedule_cover_rec5.jpg';
import Cover3 from './images/schedule_cover_rec3.jpg';
import Cover4 from './images/camping.jpg';
import Cover5 from './images/schedule_cover_rec2.jpg';
import Cover6 from './images/schedule_cover_rec4.jpg';
import unfilledStar from './images/unfilled_star.jpg';
import filledStar from './images/filled_star.jpg';
import Default1 from './images/default1.png';
import Default2 from './images/default2.png';
import Default3 from './images/default3.png';
import Default4 from './images/default4.png';
import Default5 from './images/default5.png';
import FavoriteIcon from './images/favorite.png';
import {
  ModalBackground, ModalBox, ModalImgArea, ModalImg,
  ModalLeftArea, ModalPlaceTitle, ModalPlaceAddress, AddToScheduleButton, CloseModalButton,
  LeftButton, CurrentSchedulesTitle, ScheduleChoicesBoxWrapper, ScheduleChoicesBox,
  ScheduleChoiceTitle, ModalContentWrapper, Loading, ConfirmChooseDayButton,
  ButtonStarArea, AddFavoriteIcon,
} from './City';
import {
  WriteArticleRemind, WriteArticleImg, WriteRightArea, WriteText,
  WriteButton,
} from './MyArticles';

export const defaultArticleCoverPhoto = [Cover1, Cover2, Cover3, Cover4, Cover5, Cover6];
const defaultArray = [Default1, Default2, Default3, Default4, Default5];

const PageWrapper = styled.div`
width:100vw;
height:calc(100vh-60px);
display:flex;
flex-direction:row;
padding-top:60px;
@media screen and (max-width:800px){
justify-content:center;
}
`;

const MyArticlesArea = styled.div`
width:80vw;
height:85vh;
display:flex;
flex-direction:column;
padding-left:50px;
margin-top:30px;
@media screen and (max-width:800px){
  padding-left:0px;
}
@media screen and (max-width:800px){
  width:93vw;
}
`;

export const MyPageTitle = styled.div`
width:90%;
height:auto;
font-size:28px;
font-weight:600;
text-align:left;
@media screen and (max-width:800px){
  text-align:center;
  font-size:25px;
  width:100%;
}`;

const Tabs = styled.div`
display:flex;
width:90%;
height:auto;
gap:20px;
margin-top:10px;
@media screen and (max-width:800px){
  width:100%;
}`;

const Tab = styled.div`
width:50px;
height:30px;
font-size:15px;
font-weight:500;
display:flex;
align-items:center;
justify-content:center;
background-color:${(props) => (props.isClicked ? '#E6D1F2' : '')};
color:${(props) => (props.isClicked ? 'black' : 'grey')};
cursor:pointer;
`;

const MyArticlesContainer = styled.div`
width:90%;
flex-wrap:wrap;
gap:15px;
margin-top:10px;
padding-bottom:10px;
padding-left:5px;
display:${(props) => (props.isClicked ? 'flex' : 'none')};
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
@media screen and (max-width:800px){
  width:100%;
  justify-content:center;
  padding-left:0px;
}
@media screen and (max-width:380px){
  gap:5px;
}`;

export const UpperLine = styled.div`
height:1px;
flex-shrink:0;
background-color:grey;
width:90%;
@media screen and (max-width:800px){
  width:100%;
}
`;

export const MyArticle = styled.div`
cursor:pointer;
width:190px;
height:250px;
flex-shrink:0;
border-radius:10px;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
@media screen and (max-width:1200px){
  width:160px;
  height:200px;
}
@media screen and (max-width:450px){
  width:160px;
  height:200px;
}
`;

export const CoverPhotoInMyArticle = styled.img`
width:100%;
height:50%;
border-top-right-radius:10px;
border-top-left-radius:10px;
object-fit: cover;
`;

export const MyArticleBelowArea = styled.div`
width:80%;
height:auto;
display:flex;
flex-direction:column;
align-items:center;
margin-left:15px;
margin-top:10px;
margin-right:15px;
`;

export const MyArticleTitle = styled.div`
width:100%;
height:30px;
font-weight:550;
font-size:16px;
text-align:left;
color:black;
`;

export const MyArticleSummary = styled.div`
width:100%;
height:30px;
font-size:13px;
text-align:left;
font-weight:500;
color:grey;
`;

export const StyledLink = styled(Link)`
cursor:pointer;
text-decoration:none;
color:white;
border:none;
`;

const libraries = ['places'];

const mapContainerStyle = {
  height: '0vh',
  width: '0vw',
};

function MyLovedArticles() {
  const user = useContext(UserContext);
  const [myLovedArticles, setMyLovedArticles] = useImmer([]);
  const [myLovedAttractions, setMyLovedAttractions] = useImmer([]);
  const [publishIsClicked, setPublishIsClciked] = useState(true);
  const [saveIsClicked, setSaveIsClciked] = useState(false);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [categoryPageScheduleData, setCategoryPageScheduleData] = useImmer([]); // 是這個人所有行程！不是單一!
  const [clickedScheduleIndex, setClickedScheduleIndex] = useState(); // 點到的那個行程的index!
  const [clickedScheduleId, setClickedScheduleId] = useState(); // 點到的那個行程的ID!
  const [dayIndex, setDayIndex] = useState();
  const [modalIsActive, setModalIsActive] = useState(false);
  const [chooseScheduleModalIsActive, setChooseScheduleModalIsActive] = useState(false);
  const [chooseDayModalIsActive, setChooseDayModalIsActive] = useState(false);
  const [modalDetail, setModalDetail] = useState({});

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // 先拿到某個使用者的資料，拿到收藏的article array跟attraction array後
  // 去articles跟places資料庫搜出來

  useEffect(() => {
    async function getUser() {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data().loved_article_ids);
      } else {
        console.log('No such document!');
      }
      function getLovedArticles() {
        docSnap.data().loved_article_ids.forEach(async (item) => {
          const docs = doc(db, 'articles', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            setMyLovedArticles((draft) => {
              draft.push(Snap.data());
            });
          }
        });
      }
      function getLovedAttractions() {
        docSnap.data().loved_attraction_ids.forEach(async (item) => {
          const docs = doc(db, 'attractions', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            setMyLovedAttractions((draft) => {
              draft.push(Snap.data());
            });
          }
        });
      }
      getLovedArticles();
      getLovedAttractions();
    }
    getUser();
  }, [setMyLovedArticles, setMyLovedAttractions, user.uid]);

  // 當使用者按下modal中的「加入行程」時，拿出此使用者的所有行程給他選
  // 先把行程拿回來存在immer裡面，等使用者按的時候再render modal
  // 按下哪一個行程後，用那個index去抓那天的細節

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
              setCategoryPageScheduleData((draft) => {
                draft.push(Snap.data());
              });
            }
          }
        });
      }
      getSchedulesFromList();
    }
    getUserArrayList();
  }, [setCategoryPageScheduleData, user.uid]);

  // 確認加入

  function ComfirmedAdded() {
    const newPlace = {
      place_title: modalDetail?.name,
      place_address: modalDetail?.formatted_address,
      stay_time: 60,
    };
    const newScheduleData = produce(categoryPageScheduleData, (draft) => {
      draft[clickedScheduleIndex]?.trip_days[dayIndex].places.push(newPlace);
    });
    setCategoryPageScheduleData(newScheduleData);
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
    const placeRequest = {
      placeId: clickedPlaceId,
    };
    const service = new google.maps.places.PlacesService(mapRef.current);
    service.getDetails(placeRequest, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setModalDetail(place);
      } else {
        console.log('error');
      }
    });
  }

  // 關掉modal

  function handleModalClose() {
    setModalIsActive(false);
  }

  // 按下星星後把此景點加入收藏清單，也會先確認是否有登入～

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
      }
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
      <GreyHeaderComponent />
      <PageWrapper>
        <ProfileSideBarElement />
        <Line />
        <MyArticlesArea>
          <MyPageTitle>我的收藏</MyPageTitle>
          <Tabs>
            <Tab
              isClicked={publishIsClicked}
              onClick={() => { setPublishIsClciked(true); setSaveIsClciked(false); }}
            >
              文章
            </Tab>
            <Tab
              isClicked={saveIsClicked}
              onClick={() => { setPublishIsClciked(false); setSaveIsClciked(true); }}
            >
              景點
            </Tab>
          </Tabs>
          <UpperLine />
          <MyArticlesContainer isClicked={publishIsClicked}>
            {myLovedArticles.length === 0 ? (
              <WriteArticleRemind>
                <WriteArticleImg src={FavoriteIcon} />
                <WriteRightArea>
                  <WriteText>
                    還沒有收藏唷～
                    <br />
                    收藏景點與文章
                    <br />
                    準備開啟旅行吧！
                  </WriteText>
                  <WriteButton>
                    <StyledLink to="/">
                      點我去收藏
                    </StyledLink>
                  </WriteButton>
                </WriteRightArea>
              </WriteArticleRemind>
            ) : myLovedArticles?.map((item) => (
              <StyledLink to={`/article?art_id=${item?.article_id}&sch_id=${item?.schedule_id}`}>
                <MyArticle>
                  <CoverPhotoInMyArticle
                    src={item?.cover_img ? item?.cover_img
                      : defaultArticleCoverPhoto[Math.floor(Math.random()
                        * defaultArticleCoverPhoto.length)]}
                  />
                  <MyArticleBelowArea>
                    <MyArticleTitle>{item?.article_title}</MyArticleTitle>
                    <MyArticleSummary>
                      {item?.summary?.slice(0, 16)}
                      ...
                    </MyArticleSummary>
                  </MyArticleBelowArea>
                </MyArticle>
              </StyledLink>
            ))}
          </MyArticlesContainer>
          <MyArticlesContainer isClicked={saveIsClicked}>
            {myLovedAttractions.length === 0 ? (
              <WriteArticleRemind>
                <WriteArticleImg src={FavoriteIcon} />
                <WriteRightArea>
                  <WriteText>
                    還沒有收藏唷～
                    <br />
                    收藏景點與文章
                    <br />
                    準備開啟旅行吧！
                  </WriteText>
                  <WriteButton>
                    <StyledLink to="/">
                      點我去收藏
                    </StyledLink>
                  </WriteButton>
                </WriteRightArea>
              </WriteArticleRemind>
            ) : myLovedAttractions?.map((item) => (
              <MyArticle
                onClick={() => {
                  ShowDetailNCheckLikedOrNot(item.place_id);
                }}
              >
                <CoverPhotoInMyArticle
                  src={item?.place_url ? item?.place_url
                    : defaultArticleCoverPhoto[Math.floor(Math.random()
                        * defaultArticleCoverPhoto.length)]}
                />
                <MyArticleBelowArea>
                  <MyArticleTitle>{item?.place_title?.slice(0, 10)}</MyArticleTitle>
                  <MyArticleSummary>
                    {item?.place_address?.slice(0, 16)}
                  </MyArticleSummary>
                </MyArticleBelowArea>
              </MyArticle>
            ))}
          </MyArticlesContainer>
        </MyArticlesArea>
      </PageWrapper>
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
              {categoryPageScheduleData ? categoryPageScheduleData.map((item, index) => (
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
              {categoryPageScheduleData
                ? categoryPageScheduleData[clickedScheduleIndex]?.trip_days.map((item, index) => (
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
    </>
  );
}

export default MyLovedArticles;
