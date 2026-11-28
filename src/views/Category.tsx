import React,
{
  useCallback, useRef, useEffect, useState, useContext,
} from 'react';
import {
  doc, updateDoc, getDoc, arrayRemove, arrayUnion, setDoc,
} from 'firebase/firestore';
import Swal from 'sweetalert2';
import { useImmer } from 'use-immer';
import produce from 'immer';
import { GoogleMap, useLoadScript, type LoadScriptProps } from '@react-google-maps/api';
import { useLocation, useNavigate } from '@/lib/router';
import tw from '@/lib/tw';
import db from '../utils/firebase-init';
import BlackHeaderComponent
  from '../components/Headers/BlackHeader';
import UserContext from '../components/UserContextComponent';
import Loading from '../components/Loading';
import SchedulesWrapper, {
  ConfirmDayButton, CurrentSchedulesTitle, ScheduleBoxWrapper, ScheduleBox, ScheduleTitle,
} from '../components/Modal/ScheduleChoice';
import LeftButton from '../components/Modal/GoBackButton';
import Footer from '../components/Footer';
import Modal from '../components/Modal/Modal';
import CloseModalButton from '../components/Modal/CloseButton';
import PLACE_PHOTO from '../constants/place.photo';
import RemindWrapper, {
  ClickAndAdd, RemindIcon, RemindText, SuitcaseIcon, RemindRightPart, StyledBlackLink,
} from '../components/Reminder/CreateTrip';
import BANNER from '../constants/category.banner';
import REMINDER_ICONS from '../constants/reminder.icon';
import PlaceBoxWrapper, {
  PlaceBox, PlacePhoto, PlaceBoxBelowPart, PlaceTitle, AddPlaceToScheduleButton, Tap,
} from '../components/Cards/PlaceBox';
import type { LatLng, Schedule, SchedulePlace } from '../types';
import PlaceDetailModal from '../components/Modal/PlaceDetailModal';

const TAP_IMG = '/images/tap.webp';

const DEFAULT_LAT_LNG: LatLng = { lat: 25.03746, lng: 121.564558 };

const PlaceBoxesWrapper = tw.div`
  w-[100vw] flex h-auto flex-wrap justify-center gap-[30px] mt-[90px] max-laptop:gap-[20px]
  max-laptop:w-[95vw] max-laptop:[justify-self:center] max-laptop:m-[0_auto]
  max-laptop:mt-[60px] max-tablet:gap-[5px] max-tablet:w-[95vw]
  max-tablet:[justify-self:center] max-tablet:m-[0_auto] max-tablet:mt-[60px]
  max-tablet-sm:gap-[0px] max-tablet-sm:w-[95vw] max-tablet-sm:[justify-self:center]
  max-tablet-sm:m-[0_auto] max-tablet-sm:mt-[60px] max-tablet-sm:gap-[20px] max-tablet-sm:w-[80vw]
  max-tablet-sm:[justify-self:center] max-tablet-sm:m-[0_auto] max-tablet-sm:mt-[60px]
  max-mobile-md:gap-[5px] max-mobile-md:w-[90vw] max-mobile-md:mt-[40px]
`;

const CategoryBanner = tw.img`
  w-[100vw] h-[100vh] max-tablet:h-auto
`;

const libraries: LoadScriptProps['libraries'] = ['places'];

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

interface CategoryProps {
  currentLatLng?: LatLng;
}

function Category({ currentLatLng = DEFAULT_LAT_LNG }: CategoryProps) {
  const { search } = useLocation();
  const user = useContext(UserContext);
  const categoryFromUrl = new URLSearchParams(search).get('category');
  const [categoryPageScheduleData, setCategoryPageScheduleData] = useImmer<Schedule[]>([]);
  const [clickedScheduleIndex, setClickedScheduleIndex] = useState<number>();
  const [clickedScheduleId, setClickedScheduleId] = useState<string>();
  const [dayIndex, setDayIndex] = useState<number>();
  const [modalIsActive, setModalIsActive] = useState(false);
  const [chooseScheduleModalIsActive, setChooseScheduleModalIsActive] = useState(false);
  const [chooseDayModalIsActive, setChooseDayModalIsActive] = useState(false);
  const [modalDetail, setModalDetail] = useState<google.maps.places.PlaceResult>({});
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [clickedPlaceUrl, setClickedPlaceUrl] = useState('');
  const [clickedPlaceName, setClickedPlaceName] = useState('');
  const [clickedPlaceAddress, setClickedPlaceAddress] = useState('');

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
      if (!user.uid) { return; }
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

  let BannerSrc;

  if (categoryFromUrl === 'camping') {
    BannerSrc = BANNER?.CAMPING_IMG;
  } else if (categoryFromUrl === 'arts') {
    BannerSrc = BANNER?.ARTS_IMG;
  } else if (categoryFromUrl === 'family') {
    BannerSrc = BANNER?.FAMILY_IMG;
  } else if (categoryFromUrl === 'couple') {
    BannerSrc = BANNER?.COUPLE_IMG;
  } else if (categoryFromUrl === 'food') {
    BannerSrc = BANNER?.FOOD_IMG;
  } else if (categoryFromUrl === 'shopping') {
    BannerSrc = BANNER?.SHOPPING_IMG;
  } else if (categoryFromUrl === 'nightlife') {
    BannerSrc = BANNER?.NIGHT_IMG;
  } else if (categoryFromUrl === 'religion') {
    BannerSrc = BANNER?.RELIGION_IMG;
  }

  const [categoryNearbyData, setCategoryNearbyData] = useState<
  google.maps.places.PlaceResult[]
  >([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries,
  });

  const mapRef = useRef<google.maps.Map | undefined>(undefined);
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const searchCategoryNearby = useCallback(() => {
    if (!isLoaded) return;
    let requests: google.maps.places.PlaceSearchRequest[] = [];

    if (categoryFromUrl === 'camping') {
      requests = [{
        location: { lat: 24.5711502, lng: 120.8154358 },
        radius: 50000,
        type: 'campground',
      }];
    } else if (categoryFromUrl === 'arts') {
      requests = [{
        location: currentLatLng,
        radius: 3000,
        type: 'book_store',
      },
      {
        location: currentLatLng,
        radius: 3000,
        type: 'museum',
      },
      ];
    } else if (categoryFromUrl === 'family') {
      requests = [{
        location: currentLatLng,
        radius: 10000,
        type: 'zoo',
      },
      {
        location: currentLatLng,
        radius: 10000,
        type: 'amusement_park',
      },
      {
        location: currentLatLng,
        radius: 10000,
        type: 'museum',
      },
      {
        location: currentLatLng,
        radius: 10000,
        type: 'restaurant',
      },
      ];
    } else if (categoryFromUrl === 'couple') {
      requests = [{
        location: currentLatLng,
        radius: 3000,
        type: 'cafe',
      },
      {
        location: currentLatLng,
        radius: 3000,
        type: 'movie_theater',
      },
      ];
    } else if (categoryFromUrl === 'food') {
      requests = [{
        location: currentLatLng,
        radius: 2000,
        type: 'restaurant',
      }];
    } else if (categoryFromUrl === 'shopping') {
      requests = [{
        location: currentLatLng,
        radius: 3000,
        type: 'department_store',
      },
      {
        location: currentLatLng,
        radius: 3000,
        type: 'clothing_store',
      }];
    } else if (categoryFromUrl === 'nightlife') {
      requests = [{
        location: currentLatLng,
        radius: 10000,
        type: 'bar',
      },
      {
        location: currentLatLng,
        radius: 10000,
        type: 'night_club',
      }];
    } else if (categoryFromUrl === 'religion') {
      requests = [{
        location: currentLatLng,
        radius: 2000,
        type: 'hindu_temple',
      },
      {
        location: currentLatLng,
        radius: 2000,
        type: 'church',
      }];
    }

    if (!mapRef.current) return;

    const service = new google.maps.places.PlacesService(mapRef.current);
    requests.forEach((request) => {
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setCategoryNearbyData((preData) => ([...preData, ...(results ?? [])]));
        }
      });
    });
  }, [categoryFromUrl, currentLatLng, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setTimeout(() => {
      searchCategoryNearby();
    }, 1000);
  }, [isLoaded, searchCategoryNearby]);

  async function checkLikeOrNot(placeId: string) {
    if (!user.uid) { return; }
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
    service.getDetails(
      placeRequest,
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          setModalDetail(place);
        }
      },
    );
  }

  if (!isLoaded) {
    return null;
  }

  return (
    <>
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
            {categoryPageScheduleData.length === 0 ? (
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
            ) : categoryPageScheduleData.map((item, index) => (
              <ScheduleBox
                key={`${item.schedule_id}+${index + 1}`}
                onClick={() => {
                  setClickedScheduleId(item?.schedule_id);
                  setClickedScheduleIndex(index);
                  setChooseDayModalIsActive(true); setChooseScheduleModalIsActive(false);
                }}
                id={item.schedule_id}
              >
                <ScheduleTitle>
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
      <BlackHeaderComponent />
      <CategoryBanner src={BannerSrc} />
      <PlaceBoxesWrapper>
        {categoryNearbyData.length === 0 ? <Loading /> : categoryNearbyData.map((item, index) => (
          <PlaceBoxWrapper
            id={item?.place_id}
            key={item?.place_id}
            onClick={(e) => {
              ShowDetailNCheckLikedOrNot((e.target as HTMLElement).id);
              setClickedPlaceUrl(item?.photos?.[0]?.getUrl?.() ?? '');
              setClickedPlaceName(item?.name ?? '');
              setClickedPlaceAddress(item?.vicinity ?? '');
            }}
          >
            <Tap id={item.place_id} src={TAP_IMG} />
            <PlaceBox id={item.place_id}>
              <PlacePhoto
                id={item.place_id}
                alt="place_photo"
                src={item.photos?.[0]?.getUrl?.() ?? PLACE_PHOTO[index % 5]}
              />
              <PlaceBoxBelowPart id={item?.place_id}>
                <PlaceTitle id={item?.place_id}>
                  {item?.name?.slice(0, 20)}
                </PlaceTitle>
                <AddPlaceToScheduleButton>查看更多</AddPlaceToScheduleButton>
              </PlaceBoxBelowPart>
            </PlaceBox>
          </PlaceBoxWrapper>
        ))}
      </PlaceBoxesWrapper>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onLoad={onMapLoad}
      />
      <Footer />
    </>
  );
}

export default Category;
