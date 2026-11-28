import Swal from 'sweetalert2';
import React, {
  useEffect, useContext, useState, useRef, useCallback,
} from 'react';
import {
  getDoc, doc, updateDoc, arrayRemove,
} from 'firebase/firestore';
import { Link, useNavigate } from '@/lib/router';
import { GoogleMap, useLoadScript, type LoadScriptProps } from '@react-google-maps/api';
import { useImmer } from 'use-immer';
import produce from 'immer';
import tw from '@/lib/tw';
import GreyHeaderComponent from '../components/Headers/GreyHeader';
import ProfileSideBarElement from '../components/ProfileSideBar';
import db from '../utils/firebase-init';
import UserContext from '../components/UserContextComponent';
import REMINDER_ICONS from '../constants/reminder.icon';
import SchedulesWrapper, {
  ConfirmDayButton, CurrentSchedulesTitle, ScheduleBoxWrapper, ScheduleBox, ScheduleTitle,
} from '../components/Modal/ScheduleChoice';
import LeftButton from '../components/Modal/GoBackButton';
import WriteArticleRemind, {
  WriteArticleImg, WriteRightArea, WriteText, WriteButton,
} from '../components/Reminder/CreateArticle';
import Modal from '../components/Modal/Modal';
import CloseModalButton from '../components/Modal/CloseButton';
import ARTICLE_COVER from '../constants/article.cover';
import Line from '../components/Line';
import MyArticle, {
  CoverPhotoInMyArticle, MyArticleBelowArea, MyArticleTitle, MyArticleSummary,
} from '../components/Cards/Article';
import type {
  Article, Attraction, Schedule, SchedulePlace,
} from '../types';
import PlaceDetailModal from '../components/Modal/PlaceDetailModal';

const PageWrapper = tw.div`
  w-full h-[calc(100vh_-_60px)] flex flex-row pt-[60px] max-tablet:justify-center
`;

const MyArticlesArea = tw.div`
  w-[80vw] h-[85vh] flex flex-col pl-[50px] mt-[30px] max-tablet:pl-[0px]
  max-tablet:w-[93vw]
`;

const MyPageTitle = tw.div`
  w-[90%] h-auto text-[28px] font-semibold text-left max-tablet:text-center
  max-tablet:text-[25px] max-tablet:w-full
`;

const Tabs = tw.div`
  flex w-[90%] h-auto gap-[20px] mt-[10px] max-tablet:w-full
`;

const Tab = tw.div<{ isClicked?: boolean }>`
  w-[50px] h-[30px] text-[15px] font-medium flex items-center justify-center cursor-pointer
  ${(p) => (p.isClicked ? 'bg-[#E6D1F2]' : '')}
  ${(p) => (p.isClicked ? 'text-black' : '[color:grey]')}
`;

const MyArticlesContainer = tw.div<{ isClicked?: boolean }>`
  w-[90%] flex-wrap gap-[15px] mt-[10px] pb-[10px] pl-[5px] overflow-auto
  [&::-webkit-scrollbar-track]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-[10px]
  [&::-webkit-scrollbar-thumb]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-thumb]:bg-[#D3D3D3] max-tablet:w-full max-tablet:justify-center
  max-tablet:pl-[0px] max-mobile-xs:gap-[5px]
  ${(p) => (p.isClicked ? 'flex' : 'hidden')}
`;

const UpperLine = tw.div`
  h-[1px] shrink-0 [background-color:grey] w-[90%] max-tablet:w-full
`;

const StyledLink = tw(Link)`
  cursor-pointer [text-decoration:none] text-white [border:none]
`;

const libraries: LoadScriptProps['libraries'] = ['places'];

const mapContainerStyle = {
  height: '0vh',
  width: '0vw',
};

function MyLovedArticles() {
  const user = useContext(UserContext);
  const [myLovedArticles, setMyLovedArticles] = useImmer<Article[]>([]);
  const [myLovedAttractions, setMyLovedAttractions] = useImmer<Attraction[]>([]);
  const [publishIsClicked, setPublishIsClciked] = useState(true);
  const [saveIsClicked, setSaveIsClciked] = useState(false);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  // 是這個人所有行程！不是單一!
  const [categoryPageScheduleData, setCategoryPageScheduleData] = useImmer<Schedule[]>([]);
  const [clickedScheduleIndex, setClickedScheduleIndex] = useState<number>(); // 點到的那個行程的index!
  const [clickedScheduleId, setClickedScheduleId] = useState<string>(); // 點到的那個行程的ID!
  const [dayIndex, setDayIndex] = useState<number>();
  const [modalIsActive, setModalIsActive] = useState(false);
  const [chooseScheduleModalIsActive, setChooseScheduleModalIsActive] = useState(false);
  const [chooseDayModalIsActive, setChooseDayModalIsActive] = useState(false);
  const [modalDetail, setModalDetail] = useState<google.maps.places.PlaceResult>({});

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries,
  });

  const mapRef = useRef<google.maps.Map | undefined>(undefined);
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    async function getUser() {
      if (!user?.uid) { return; }
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      function getLovedArticles() {
        docSnap.data()?.loved_article_ids?.forEach(async (item: string) => {
          const docs = doc(db, 'articles', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            setMyLovedArticles((draft) => {
              draft.push(Snap.data() as Article);
            });
          }
        });
      }
      function getLovedAttractions() {
        docSnap.data()?.loved_attraction_ids?.forEach(async (item: string) => {
          const docs = doc(db, 'attractions', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            setMyLovedAttractions((draft) => {
              draft.push(Snap.data() as Attraction);
            });
          }
        });
      }
      getLovedArticles();
      getLovedAttractions();
    }
    getUser();
  }, [setMyLovedArticles, setMyLovedAttractions, user.uid]);

  useEffect(() => {
    async function getUserArrayList() {
      if (!user?.uid) { return; }
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      function getSchedulesFromList() {
        docSnap.data()?.owned_schedule_ids?.forEach(async (item: string) => {
          const docs = doc(db, 'schedules', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            if (Snap.data().deleted === false) {
              setCategoryPageScheduleData((draft) => {
                draft.push(Snap.data() as Schedule);
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
    if (clickedScheduleIndex === undefined || dayIndex === undefined || !clickedScheduleId) return;
    const scheduleId = clickedScheduleId;
    const scheduleIndex = clickedScheduleIndex;
    const newPlace: SchedulePlace = {
      place_title: modalDetail?.name ?? '',
      place_address: modalDetail?.formatted_address ?? '',
      stay_time: 60,
    };
    const newScheduleData = produce(categoryPageScheduleData, (draft) => {
      draft[clickedScheduleIndex]?.trip_days[dayIndex].places.push(newPlace);
    });
    setCategoryPageScheduleData(newScheduleData);
    async function passAddedDataToFirestore() {
      const scheduleRef = doc(db, 'schedules', scheduleId);
      await updateDoc(scheduleRef, { ...newScheduleData[scheduleIndex] });
    }
    passAddedDataToFirestore();
  }
  function handleUserOrNot() {
    if (!user.uid) {
      Swal.fire({
        title: '請先登入唷！',
        text: '您即將被導引至登入頁面~',
        icon: 'warning',
      });
      navigate({ pathname: '/profile' });
    } else {
      setModalIsActive(false); setChooseScheduleModalIsActive(true);
    }
  }

  async function checkLikeOrNot(placeId: string) {
    if (!user.uid) return;
    const userArticlesArray = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userArticlesArray);
    if (docSnap.data()?.loved_attraction_ids?.includes(placeId)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }

  function ShowDetailNCheckLikedOrNot(clickedPlaceId: string) {
    if (user.uid) {
      checkLikeOrNot(clickedPlaceId);
    } else {
      setLiked(false);
    }
    setModalIsActive(true);
    const placeRequest = {
      placeId: clickedPlaceId,
    };
    if (!mapRef.current) return;
    const service = new google.maps.places.PlacesService(mapRef.current);
    service.getDetails(placeRequest, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        setModalDetail(place);
      }
    });
  }

  function handleModalClose() {
    setModalIsActive(false);
  }

  async function handleFavorite(placeId?: string) {
    if (!placeId) return;
    if (!user.uid) {
      Swal.fire({
        title: '請先登入唷！',
        text: '您即將被導引至登入頁面~',
        icon: 'warning',
      });
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

  if (!isLoaded) return null;

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
                <WriteArticleImg src={REMINDER_ICONS?.ADD_FAVO_ICON} />
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
              <StyledLink key={item?.schedule_id} to={`/article?art_id=${item?.article_id}&sch_id=${item?.schedule_id}`}>
                <MyArticle>
                  <CoverPhotoInMyArticle
                    src={item?.cover_img ? item?.cover_img
                      : ARTICLE_COVER[Math.floor(Math.random()
                        * ARTICLE_COVER.length)]}
                  />
                  <MyArticleBelowArea>
                    <MyArticleTitle style={{ color: 'black' }}>{item?.article_title}</MyArticleTitle>
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
                <WriteArticleImg src={REMINDER_ICONS?.ADD_FAVO_ICON} />
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
                key={item?.place_id}
                onClick={() => {
                  ShowDetailNCheckLikedOrNot(item.place_id);
                }}
              >
                <CoverPhotoInMyArticle
                  src={item?.place_url ? item?.place_url
                    : ARTICLE_COVER[Math.floor(Math.random()
                        * ARTICLE_COVER.length)]}
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
      <PlaceDetailModal
        active={modalIsActive}
        place={modalDetail}
        liked={liked}
        onAddToSchedule={() => handleUserOrNot()}
        onToggleFavorite={(placeId) => handleFavorite(placeId)}
        onClose={() => handleModalClose()}
      />
      <Modal active={chooseScheduleModalIsActive} flexDirection="column">
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
            {categoryPageScheduleData ? categoryPageScheduleData.map((item, index) => (
              <ScheduleBox
                key={item?.schedule_id}
                onClick={() => {
                  setClickedScheduleId(item.schedule_id);
                  setClickedScheduleIndex(index);
                  setChooseDayModalIsActive(true); setChooseScheduleModalIsActive(false);
                }}
                id={item.schedule_id}
              >
                <ScheduleTitle>
                  {item.title}
                </ScheduleTitle>
              </ScheduleBox>
            )) : ''}
          </ScheduleBoxWrapper>
        </SchedulesWrapper>
        <CloseModalButton
          type="button"
          onClick={() => setChooseScheduleModalIsActive(false)}
        >
          X
        </CloseModalButton>
      </Modal>
      <Modal active={chooseDayModalIsActive} flexDirection="column">
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
            {categoryPageScheduleData
              ? categoryPageScheduleData[clickedScheduleIndex ?? -1]
                ?.trip_days.map((item, index) => (
                  <ScheduleBox
                    key={`${index + 1}day`}
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
    </>
  );
}

export default MyLovedArticles;
