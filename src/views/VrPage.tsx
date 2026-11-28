import React, { useState, useEffect, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useImmer } from 'use-immer';
import { useNavigate } from '@/lib/router';
import Swal from 'sweetalert2';
import {
  doc, getDoc, updateDoc, arrayRemove, arrayUnion, setDoc,
} from 'firebase/firestore';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import produce from 'immer';
import tw from '@/lib/tw';
import UserContext from '../components/UserContextComponent';
import db from '../utils/firebase-init';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './style.css';
import vrPlaces from './vr-place-data';
import BlackHeaderComponent from '../components/Headers/BlackHeader';
import STAR from '../constants/stars';
import type { Schedule, SchedulePlace } from '../types';

const rightArrow = '/images/up-arrow.webp';

const PageTitle = tw.div`
  w-full h-[30px] text-[30px] text-white [text-shadow:2px_2px_3px_black] font-semibold
  max-tablet-sm:w-[85%] max-tablet-sm:text-[23px]
`;

const TitleStarArea = tw.div`
  w-full h-auto flex items-center justify-center
`;

const ConfirmChooseDayButton = tw.button`
  w-[20%] h-[35px]
  [background:linear-gradient(312deg,rgb(178,228,238)_0%,rgb(161,176,246)_100%)]
  rounded-[25px] [border:none] text-black font-semibold text-[16px] cursor-pointer
`;

const PlaceBox = tw.div`
  w-full h-full rounded-[5px] cursor-pointer bg-cover bg-no-repeat bg-[rgb(0,0,0,0.15)]
  [background-blend-mode:multiply] bg-center
`;

const PlaceTitle = tw.div`
  absolute left-[15px] top-[12px] text-[20px] font-semibold text-white
  [text-shadow:1px_1px_2px_black]
`;

const AddFavoriteIcon = tw.img`
  w-[25px] h-[25px] cursor-pointer absolute right-[15%] [justify-self:right]
`;

const PlaceCountryTitle = tw.div`
  [font-family:"Pangolin",sans-serif] absolute right-[15px] bottom-[12px] text-[26px]
  font-semibold text-[#CEE8F0] [text-shadow:1px_1px_2px_black]
`;

const PlaceEngishTitle = tw.div`
  absolute left-[15px] top-[40px] text-[16px] font-semibold text-[#F4E6D3]
  [text-shadow:1px_1px_2px_black]
`;

const RemindArrow = tw.img`
  w-[50px] h-auto absolute bottom-[20px] right-[20px]
  [animation:bounce_1600ms_infinite_cubic-bezier(0.445,0.05,0.55,0.95)] max-tablet-lg:hidden
`;

const RemindText = tw.div`
  w-[60px] h-auto absolute bottom-[-10px] right-[20px] [font-weight:550] text-[12px]
  rounded-[3px] [border:1px_solid_black] max-tablet-lg:hidden
`;

const VRModalBackground = tw.div<{ active?: boolean }>`
  w-[100vw] h-[100vh] fixed top-[0] bottom-[0] left-[0] right-[0] bg-[rgba(0,0,0,0.7)]
  justify-center items-center z-[500]
  ${(p) => (p.active ? 'flex' : 'hidden')}
`;

const ModalBox = tw.div`
  flex w-[80vw] h-[40vw] bg-white rounded-[10px] relative items-center z-[1500] flex-row
  max-wide:h-[80vh] max-desktop:h-[85vh] max-desktop:w-[90vw] max-tablet-lg:h-[80vh]
  max-tablet-lg:w-[90vw] max-tablet-lg:flex-col
`;

const ModalImgArea = tw.div`
  w-[60%] h-full flex flex-wrap items-center gap-[10px] max-tablet-lg:w-full
  max-tablet-lg:justify-center
`;

const ModalLeftArea = tw.div`
  w-[40%] h-[85%] flex flex-col items-center [justify-content:left] gap-[15px] relative
  max-tablet-lg:h-[90%] max-tablet-lg:mt-[20px] max-tablet-lg:w-full max-tablet-lg:h-[50%]
  max-tablet-lg:gap-[5px]
`;

const IFrame = tw.iframe`
  w-[90%] h-[90%] [border:0] rounded-[13px] cursor-pointer
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)] max-tablet-lg:w-[90%]
  max-tablet-lg:h-[95%]
`;

const ModalPlaceTitle = tw.div`
  text-[30px] font-semibold w-[75%] max-tablet-lg:text-[25px]
`;

const ModalPlaceSubtitle = tw.div`
  text-[18px] [font-weight:550] w-[75%] [color:grey] max-wide:text-[16px]
  max-desktop:text-[15px] max-tablet-lg:text-[14px] max-tablet-lg:hidden
`;

const ModalPlaceDescription = tw.div`
  text-[15px] w-[75%] text-justify h-auto max-tablet-lg:w-[85%]
`;

const SeperateLine = tw.div`
  w-[75%] h-[1.5px] mt-[10px] mb-[10px] bg-black shrink-0 max-tablet-lg:w-[85%]
  max-tablet-lg:mt-[5px] max-tablet-lg:mb-[5px]
`;

const ModalPlaceAddress = tw.div`
  w-[75%] text-[#696969] text-[13px] flex flex-col items-start gap-[10px] text-justify
  max-tablet-lg:hidden
`;

const ModalPlaceCountry = tw.div`
  w-[20%] flex items-center justify-center h-[20px] bg-black p-[5px_5px_5px_5px]
  rounded-[3px] text-white font-medium
`;

const AddToScheduleButton = tw.button`
  w-[20%] h-[40px] rounded-[5px] [background-color:grey] font-medium [border:none]
  text-white cursor-pointer text-[15px] max-desktop:w-[35%] max-tablet-lg:hidden
`;

const SmallScreenAddButton = tw.button`
  hidden max-tablet-lg:block max-tablet-lg:w-[200px] max-tablet-lg:h-[40px] max-tablet-lg:shrink-0
  max-tablet-lg:rounded-[25px] max-tablet-lg:[background-color:grey] max-tablet-lg:font-medium
  max-tablet-lg:[border:none] max-tablet-lg:text-white max-tablet-lg:cursor-pointer
  max-tablet-lg:text-[17px] max-tablet-lg:mb-[30px] max-tablet-lg:mt-[10px]
`;

const CloseModalButton = tw.button`
  h-[25px] w-[25px] absolute flex items-center justify-center right-[20px] top-[20px]
  text-center [border:none] rounded-[50%] bg-black text-white cursor-pointer
`;

const LeftButton = tw.button`
  h-[25px] w-[25px] absolute bg-[url(/images/left-arrow.webp)] bg-cover bg-no-repeat
  bg-[rgb(0,0,0,0.2)] [background-blend-mode:multiply] left-[20px] top-[20px] text-center
  [border:none] rounded-[50%] text-white cursor-pointer
`;

const TransparentBackground = tw.div`
  w-[100vw] h-[450px] bg-white opacity-[0.4] z-[100] absolute top-[30%]
`;

const CurrentSchedulesTitle = tw.div`
  w-full h-[30px] text-[17px] font-semibold mt-[20px] mb-[10px]
`;

const ScheduleChoicesBoxWrapper = tw.div`
  flex [flex-flow:wrap] h-auto w-[80%] items-center justify-center gap-[15px] pt-[10px]
  pb-[20px] pl-[2px] after:content-[""] after:w-[455px] overflow-auto
  [&::-webkit-scrollbar-track]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-[10px]
  [&::-webkit-scrollbar-thumb]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-thumb]:bg-[#D3D3D3]
`;

const Loading = tw.div`
  m-auto [border-right:10px_solid_#EAF0F6] [border-bottom:10px_solid_#EAF0F6]
  [border-left:10px_solid_#EAF0F6] rounded-[50%] [border-top:10px_solid_#FF7A59] w-[70px]
  h-[70px] [animation:spinner_3s_linear_infinite]
`;

const ScheduleChoicesBox = tw.div<{ clicked?: boolean }>`
  flex items-center w-[220px] h-[60px] rounded-[10px] cursor-pointer
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)] hover:bg-[#E6D1F2]
  ${(p) => (p.clicked ? 'bg-[#E6D1F2]' : 'bg-[#e7f5fe]')}
`;

const ScheduleChoiceTitle = tw.div`
  w-[170px] text-left h-auto font-medium text-[15px] ml-[20px]
`;

const ModalContentWrapper = tw.div`
  w-[80%] h-[80%] flex flex-col items-center z-[500] overflow-auto
  [&::-webkit-scrollbar-track]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-[10px]
  [&::-webkit-scrollbar-thumb]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-thumb]:bg-[#D3D3D3]
`;

function VR() {
  const [dayIndex, setDayIndex] = useState<number>();
  const [modalIsActive, setModalIsActive] = useState(false);
  const [chooseScheduleModalIsActive, setChooseScheduleModalIsActive] = useState(false);
  const [chooseDayModalIsActive, setChooseDayModalIsActive] = useState(false);
  const [vrPageScheduleData, setVrPageScheduleData] = useImmer<Schedule[]>([]);
  const [clickedScheduleIndex, setClickedScheduleIndex] = useState<number>();
  const [clickedScheduleId, setClickedScheduleId] = useState<string>();
  const [modalIndex, setModalIndex] = useState(0);
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [clickedPlaceUrl, setClickedPlaceUrl] = useState('');
  const [clickedPlaceName, setClickedPlaceName] = useState('');
  const [clickedPlaceAddress, setClickedPlaceAddress] = useState('');

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

  function ShowDetailNCheckLikedOrNot(clickedPlaceId: string, clickedPlaceIndex: number) {
    if (user.uid) {
      checkLikeOrNot(clickedPlaceId);
    } else {
      setLiked(false);
    }
    setModalIsActive(true);
    setModalIndex(clickedPlaceIndex);
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
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data()?.owned_schedule_ids);
      } else {
        console.log('No such document!');
      }
      function getSchedulesFromList() {
        docSnap.data()?.owned_schedule_ids?.forEach(async (item: string) => {
          const docs = doc(db, 'schedules', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            if (Snap.data().deleted === false) {
              setVrPageScheduleData((draft) => {
                draft.push(Snap.data() as Schedule);
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
    if (clickedScheduleIndex === undefined || dayIndex === undefined || !clickedScheduleId) return;
    const scheduleId = clickedScheduleId;
    const scheduleIndex = clickedScheduleIndex;
    const newPlace: SchedulePlace = {
      place_title: vrPlaces[modalIndex].place_title,
      place_address: vrPlaces[modalIndex].place_address,
      stay_time: 60,
    };
    const newScheduleData = produce(vrPageScheduleData, (draft) => {
      draft[scheduleIndex]?.trip_days[dayIndex]?.places?.push(newPlace);
    });
    setVrPageScheduleData(newScheduleData);
    async function passAddedDataToFirestore() {
      const scheduleRef = doc(db, 'schedules', scheduleId);
      await updateDoc(scheduleRef, { ...newScheduleData[scheduleIndex] });
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
                  <IFrame title={vrPlaces?.[modalIndex]?.place_title} src={vrPlaces?.[modalIndex]?.vr_embed_link} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
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
                ? vrPageScheduleData[clickedScheduleIndex ?? -1]?.trip_days.map((item, index) => (
                  <ScheduleChoicesBox
                    // Trip days have no id; their position is their identity.
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
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
      </VRModalBackground>
      <div className="vr-container">
        <PageTitle>
          With VR, The world is just in front of you.
        </PageTitle>
        <TransparentBackground />
        <Swiper
          modules={[EffectCoverflow, Navigation]}
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
