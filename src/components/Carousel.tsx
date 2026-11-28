import React, {
  useState, useContext, useEffect, useRef, useCallback,
} from 'react';
import { useNavigate } from '@/lib/router';
import { GoogleMap, useLoadScript, type LoadScriptProps } from '@react-google-maps/api';
import {
  doc, getDoc, updateDoc, arrayRemove, arrayUnion, setDoc,
} from 'firebase/firestore';
import { useImmer } from 'use-immer';
import produce from 'immer';
import Swal from 'sweetalert2';
import tw from '@/lib/tw';
import db from '../utils/firebase-init';
import '../views/animation.css';
import SchedulesWrapper, {
  ConfirmDayButton, CurrentSchedulesTitle, ScheduleBoxWrapper, ScheduleBox, ScheduleTitle,
} from './Modal/ScheduleChoice';
import LeftButton from './Modal/GoBackButton';
import UserContext from './UserContextComponent';
import Loading from './Loading';
import ModalImgArea, { ModalImg } from './Modal/ModalImgArea';
import Modal from './Modal/Modal';
import ModalLeftArea from './Modal/ModalLeftArea';
import CloseModalButton from './Modal/CloseButton';
import ButtonStarArea, { AddToScheduleButton, AddFavoriteIcon } from './Modal/ButtonStar';
import ModalPlaceTitle, { ModalPlaceAddress } from './Modal/ModalText';
import PLACE_PHOTO from '../constants/place.photo';
import RemindWrapper, {
  ClickAndAdd, RemindIcon, RemindText, SuitcaseIcon, RemindRightPart, StyledBlackLink,
} from './Reminder/CreateTrip';
import type { Schedule, SchedulePlace } from '../types';

const ArrowToRightSrc = '/images/arrow-right.webp';
const ArrowToLeftSrc = '/images/arrow-left.webp';
const unfilledStar = '/images/unfilled_star.webp';
const Travel = '/images/travel-2.webp';
const Suitcase = '/images/suitcase-2.webp';
const filledStar = '/images/filled_star.webp';

const NearByPlaceWrapper = tw.div`
  w-[100vw] h-[340px] flex flex-row items-center justify-center gap-[10px] mt-[20px]
  max-desktop:h-[280px] max-desktop:mt-[20px] max-tablet-lg:flex-col max-tablet-lg:mt-[30px]
  max-tablet-lg:h-[370px]
`;

const NearByPlaceLeftArea = tw.div`
  w-[15vw] h-[350px] flex flex-col items-center justify-center max-tablet-lg:w-[80vw]
  max-tablet-lg:h-[100px] max-tablet-lg:mr-[0px]
`;

const NearbyPlaceTitle = tw.div`
  text-[25px] text-[#1F456E] font-semibold mb-[15px] max-tablet-lg:text-[24px]
  max-tablet-lg:mb-[15px]
`;

const NearByPlaceDescription = tw.div`
  text-[12px] [color:grey] font-semibold mb-[15px] max-tablet-lg:text-[16px]
  max-tablet-lg:mb-[25px]
`;

const NearByViewMoreButton = tw.button`
  hidden w-[130px] h-[40px] [border:none] bg-[#0492c2] rounded-[5px] text-white
  font-semibold tracking-[3px] max-tablet-lg:hidden
`;

const CardsWrapper = tw.div`
  w-[800px] h-[290px] flex flex-col items-center justify-center flex-wrap relative
  overflow-hidden z-[1] gap-[20px] max-desktop:w-[650px] max-desktop:mr-[0px]
  max-tablet-lg:hidden
`;

const SmallScreenCards = tw.div`
  hidden max-tablet-lg:h-[200px] max-tablet-lg:flex max-tablet-lg:flex-col
  max-tablet-lg:items-center max-tablet-lg:justify-center max-tablet-lg:flex-wrap
  max-tablet-lg:relative max-tablet-lg:overflow-hidden max-tablet-lg:z-[1] max-tablet-lg:w-full
  max-mobile:h-[160px] max-mobile:overflow-auto max-mobile:w-full
`;

const Cards = tw.div`
  flex pl-[15px] pb-[10px] opacity-[1] flex-col justify-end w-[180px] h-[240px] text-white
  font-semibold relative text-left overflow-hidden rounded-[10px] cursor-pointer bg-cover
  bg-no-repeat bg-[rgb(0,0,0,0.2)] [background-blend-mode:multiply] max-desktop:w-[140px]
  max-desktop:h-[180px] max-tablet-lg:w-[30%] max-tablet-lg:h-[280px] max-tablet-lg:text-[13px]
  max-mobile:w-[30%] max-mobile:h-[150px]
`;

const SmallScreenCardsWrapper = tw.div`
  hidden max-tablet-lg:flex max-tablet-lg:w-[90%] max-tablet-lg:items-center
  max-tablet-lg:gap-[10px] max-mobile:w-full max-mobile:gap-[0px] max-mobile:pr-[3px]
  max-mobile:pl-[3px]
`;

const Arrow = tw.img`
  w-[40px] h-[40px] cursor-pointer max-tablet-lg:hidden
`;

const SmallScreenArrow = tw.img`
  hidden max-tablet-lg:block max-tablet-lg:w-[25px] max-tablet-lg:h-[25px]
  max-tablet-lg:cursor-pointer
`;

const libraries: LoadScriptProps['libraries'] = ['places'];

const mapContainerStyle = {
  height: '0vh',
  width: '0vw',
};

interface CarouselProps {
  currentNearbyAttraction?: google.maps.places.PlaceResult[];
}

function Carousel({ currentNearbyAttraction = [] }: CarouselProps) {
  const user = useContext(UserContext);
  const [cityPageScheduleData, setCityPageScheduleData] = useImmer<Schedule[]>([]);
  const [clickedScheduleIndex, setClickedScheduleIndex] = useState<number>();
  const [clickedScheduleId, setClickedScheduleId] = useState<string>();
  const [dayIndex, setDayIndex] = useState<number>();
  const [modalIsActive, setModalIsActive] = useState(false);
  const [chooseScheduleModalIsActive, setChooseScheduleModalIsActive] = useState(false);
  const [chooseDayModalIsActive, setChooseDayModalIsActive] = useState(false);
  const [modalDetail, setModalDetail] = useState<google.maps.places.PlaceResult>({});
  const [liked, setLiked] = useState(false);
  const [clickedPlaceUrl, setClickedPlaceUrl] = useState('');
  const [clickedPlaceName, setClickedPlaceName] = useState('');
  const [clickedPlaceAddress, setClickedPlaceAddress] = useState('');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries,
  });

  const mapRef = useRef<google.maps.Map | undefined>(undefined);
  const onMapLoad = useCallback((map: google.maps.Map) => {
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

  async function checkLikeOrNot(placeId: string) {
    if (!user.uid) return;
    const userArticlesArray = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userArticlesArray);
    if (docSnap?.data()?.loved_attraction_ids?.includes(placeId)) {
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
      if (!user.uid) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      function getSchedulesFromList() {
        docSnap.data()?.owned_schedule_ids?.forEach(async (item: string) => {
          const docs = doc(db, 'schedules', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            if (Snap.data().deleted === false) {
              setCityPageScheduleData((draft) => {
                draft.push(Snap.data() as Schedule);
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
    if (clickedScheduleIndex === undefined || dayIndex === undefined || !clickedScheduleId) return;
    const scheduleId = clickedScheduleId;
    const scheduleIndex = clickedScheduleIndex;
    const newPlace: SchedulePlace = {
      place_title: modalDetail.name ?? '',
      place_address: modalDetail.formatted_address ?? '',
      stay_time: 60,
    };
    const newScheduleData = produce(cityPageScheduleData, (draft) => {
      draft[scheduleIndex].trip_days[dayIndex].places.push(newPlace);
    });
    setCityPageScheduleData(newScheduleData);
    async function passAddedDataToFirestore() {
      const scheduleRef = doc(db, 'schedules', scheduleId);
      await updateDoc(scheduleRef, { ...newScheduleData[scheduleIndex] });
    }
    passAddedDataToFirestore();
  }

  function handleModalClose() {
    setModalIsActive(false);
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

  if (!isLoaded) return null;

  return (
    <>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        onLoad={onMapLoad}
      />
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
                    onClick={() => { handleFavorite(modalDetail.place_id); }}
                    src={liked ? filledStar : unfilledStar}
                  />
                </ButtonStarArea>
              </ModalLeftArea>
              <ModalImgArea>
                <ModalImg alt="detail_photo" src={modalDetail?.photos?.[0]?.getUrl() ? modalDetail?.photos?.[0]?.getUrl() : PLACE_PHOTO[0]} />
                <ModalImg alt="detail_photo" src={modalDetail?.photos?.[1]?.getUrl() ? modalDetail?.photos?.[1]?.getUrl() : PLACE_PHOTO[1]} />
                <ModalImg alt="detail_photo" src={modalDetail?.photos?.[2]?.getUrl() ? modalDetail?.photos?.[2]?.getUrl() : PLACE_PHOTO[2]} />
                <ModalImg alt="detail_photo" src={modalDetail?.photos?.[3]?.getUrl() ? modalDetail?.photos?.[3]?.getUrl() : PLACE_PHOTO[3]} />
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
              <ScheduleBox
                key={item?.schedule_id}
                onClick={() => {
                  setClickedScheduleId(item?.schedule_id);
                  setClickedScheduleIndex(index);
                  setChooseDayModalIsActive(true); setChooseScheduleModalIsActive(false);
                }}
                id={item.schedule_id}
              >
                <ScheduleTitle key={item?.title}>
                  {item.title}
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
        {' '}
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
              ? cityPageScheduleData[clickedScheduleIndex ?? -1]?.trip_days.map((item, index) => (
                <ScheduleBox
                  // Trip days have no id; their position is their identity.
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
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
                    (e.target as HTMLElement).id,
                  );
                  setClickedPlaceUrl(item?.photos?.[0]?.getUrl?.() ?? '');
                  setClickedPlaceName(item?.name ?? '');
                  setClickedPlaceAddress(item?.vicinity ?? '');
                }}
                className={String(index)}
                style={{ backgroundImage: `url(${item.photos?.[0]?.getUrl?.() ?? PLACE_PHOTO[index % 5]})` }}
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
                        (e.target as HTMLElement).id,
                      );
                      setClickedPlaceUrl(item?.photos?.[0]?.getUrl?.() ?? '');
                      setClickedPlaceName(item?.name ?? '');
                      setClickedPlaceAddress(item?.vicinity ?? '');
                    }}
                    id={item.place_id}
                    className={String(index)}
                    style={{ backgroundImage: `url(${item.photos?.[0]?.getUrl?.() ?? PLACE_PHOTO[index % 5]})` }}
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

export default Carousel;
