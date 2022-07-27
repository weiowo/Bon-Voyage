import React,
{
  useCallback, useRef, useEffect, useState, useContext,
} from 'react';
import styled from 'styled-components/macro';
import {
  doc, updateDoc, getDoc, arrayRemove, arrayUnion, setDoc,
} from 'firebase/firestore';
import { useImmer } from 'use-immer';
import produce from 'immer';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import db from '../utils/firebase-init';
import TAP_IMG from './images/tap.png';
import BlackHeaderComponent
  from '../components/Headers/BlackHeader';
import UserContext from '../components/UserContextComponent';
import Loading from '../components/Loading';
import SchedulesWrapper, {
  ConfirmDayButton, CurrentSchedulesTitle, ScheduleBoxWrapper, ScheduleBox, ScheduleTitle,
} from '../components/Modal/ScheduleChoice';
import LeftButton from '../components/Modal/GoBackButton';
import Footer from '../components/Footer';
import ButtonStarArea, { AddToScheduleButton, AddFavoriteIcon } from '../components/Modal/ButtonStar';
import ModalImgArea, { ModalImg } from '../components/Modal/ModalImgArea';
import Modal from '../components/Modal/Modal';
import ModalLeftArea from '../components/Modal/ModalLeftArea';
import CloseModalButton from '../components/Modal/CloseButton';
import ModalPlaceTitle, { ModalPlaceAddress } from '../components/Modal/ModalText';
import PLACE_PHOTO from '../constants/place.photo';
import RemindWrapper, {
  ClickAndAdd, RemindIcon, RemindText, SuitcaseIcon, RemindRightPart, StyledBlackLink,
} from '../components/Reminder/CreateTrip';
import BANNER from '../constants/category.banner';
import STAR from '../constants/stars';
import REMINDER_ICONS from '../constants/reminder.icon';
import PlaceBoxWrapper, {
  PlaceBox, PlacePhoto, PlaceBoxBelowPart, PlaceTitle, AddPlaceToScheduleButton, Tap,
} from '../components/Cards/PlaceBox';

const PlaceBoxesWrapper = styled.div`
width:100vw;
display:flex;
height:auto;
flex-wrap:wrap;
justify-content:center;
gap:30px;
margin-top:90px;
@media screen and (max-width:970px){
  gap:20px;
  width:95vw;
  justify-self:center;
  margin:0 auto;
  margin-top:60px;
}
@media screen and (max-width:805px){
  gap:5px;
  width:95vw;
  justify-self:center;
  margin:0 auto;
  margin-top:60px;
}
@media screen and (max-width:756px){
  gap:0px;
  width:95vw;
  justify-self:center;
  margin:0 auto;
  margin-top:60px;
}
@media screen and (max-width:745px){
  gap:20px;
  width:80vw;
  justify-self:center;
  margin:0 auto;
  margin-top:60px;
}
@media screen and (max-width:465px){
  gap:5px;
  width:90vw;
  margin-top:40px;
}
`;

// const PlaceBoxWrapper = styled.div`
// position:relative;
// width:220px;
// height:320px;
// cursor:pointer;
// @media screen and (max-width:970px){
//   width:176px;
//   height:256px;
// }
// @media screen and (max-width:745px){
//   width:220px;
//   height:320px;
// }
// @media screen and (max-width:575px){
//   width:176px;
//   height:256px;
// }
// @media screen and (max-width:465px){
//   width:154px;
//   height:224px;
// }
// `;

// export const PlaceBox = styled.div`
// width: 200px;
// height: 290px;
// margin-top:10px;
// background-color:white;
// box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
// @media screen and (max-width:970px){
//   width:160px;
//   height:232px;
// }
// @media screen and (max-width:745px){
//   width: 200px;
//   height: 290px;
// }
// @media screen and (max-width:575px){
//   width:160px;
//   height:232px;
// }
// @media screen and (max-width:465px){
//   width:140px;
//   height:210px;
// }
// `;

// export const PlacePhoto = styled.img`
// margin-top:6px;
// width:188px;
// height:188px;
// object-fit:cover;
// @media screen and (max-width:970px){
//   width:150px;
//   height:150px;
// }
// @media screen and (max-width:745px){
//   width:188px;
//   height:188px;
// }
// @media screen and (max-width:575px){
//   width:150px;
//   height:150px;
// }
// @media screen and (max-width:465px){
//   width:132px;
//   height:132px;
// }
// `;

// export const PlaceBoxBelowPart = styled.div`
// width:188px;
// padding-top:3px;
// height:80px;
// margin-left:15px;
// display:flex;
// flex-direction:column;
// align-items:flex-start;
// gap:5px;
// @media screen and (max-width:970px){
//   width:90%;
//   margin-left:10px;
//   height:30%
// }
// `;

// export const PlaceTitle = styled.div`
// width:175px;
// font-size:14px;
// font-weight:500;
// color:black;
// text-align:left;
// @media screen and (max-width:970px){
//   width:90%;
// }
// @media screen and (max-width:465px){
//   font-size:12px;
// }
// `;

// export const AddPlaceToScheduleButton = styled.div`
// width:65px;
// font-size:10px;
// height:20px;
// background-color:grey;
// color:white;
// border-radius:3px;
// display:flex;
// justify-content:center;
// align-items:center;
// `;

// const Tap = styled.img`
// position:absolute;
// width:85px;
// height:20px;
// z-index:10;
// transform: rotate(25deg);
// right: -2px;
// top: 8px;
// @media screen and (max-width:465px){
//   width:65px;
//   height:17px;
// }
// `;

const CategoryBanner = styled.img`
width:100vw;
height:100vh;
@media screen and (max-width:800px){
height:auto;
}`;

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

function Category({ currentLatLng }) {
  const { search } = useLocation();
  const user = useContext(UserContext);
  const categoryFromUrl = new URLSearchParams(search).get('category');
  const [categoryPageScheduleData, setCategoryPageScheduleData] = useImmer([]);
  const [clickedScheduleIndex, setClickedScheduleIndex] = useState();
  const [clickedScheduleId, setClickedScheduleId] = useState();
  const [dayIndex, setDayIndex] = useState();
  const [modalIsActive, setModalIsActive] = useState(false);
  const [chooseScheduleModalIsActive, setChooseScheduleModalIsActive] = useState(false);
  const [chooseDayModalIsActive, setChooseDayModalIsActive] = useState(false);
  const [modalDetail, setModalDetail] = useState({});
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
      alert('請先登入唷～');
      navigate({ pathname: '/profile' });
    } else {
      setModalIsActive(false); setChooseScheduleModalIsActive(true);
    }
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
      if (!user.uid) { return; }
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
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

  const [categoryNearbyData, setCategoryNearbyData] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const searchCategoryNearby = useCallback(() => {
    if (!isLoaded) return;
    let requests = [];

    if (categoryFromUrl === 'camping') {
      requests = [{
        location: { lat: 24.5711502, lng: 120.8154358 },
        radius: '50000',
        type: 'campground',
      }];
    } else if (categoryFromUrl === 'arts') {
      requests = [{
        location: currentLatLng,
        radius: '3000',
        type: 'book_store',
      },
      {
        location: currentLatLng,
        radius: '3000',
        type: 'museum',
      },
      ];
    } else if (categoryFromUrl === 'family') {
      requests = [{
        location: currentLatLng,
        radius: '10000',
        type: 'zoo',
      },
      {
        location: currentLatLng,
        radius: '10000',
        type: 'amusement_park',
      },
      ];
    } else if (categoryFromUrl === 'couple') {
      requests = [{
        location: currentLatLng,
        radius: '3000',
        type: 'cafe',
      },
      {
        location: currentLatLng,
        radius: '3000',
        type: 'movie_theater',
      },
      ];
    } else if (categoryFromUrl === 'food') {
      requests = [{
        location: currentLatLng,
        radius: '2000',
        type: 'restaurant',
      }];
    } else if (categoryFromUrl === 'shopping') {
      requests = [{
        location: currentLatLng,
        radius: '3000',
        type: 'department_store',
      },
      {
        location: currentLatLng,
        radius: '3000',
        type: 'clothing_store',
      }];
    } else if (categoryFromUrl === 'nightlife') {
      requests = [{
        location: currentLatLng,
        radius: '10000',
        type: 'bar',
      },
      {
        location: currentLatLng,
        radius: '10000',
        type: 'night_club',
      }];
    } else if (categoryFromUrl === 'religion') {
      requests = [{
        location: currentLatLng,
        radius: '2000',
        type: 'hindu_temple',
      },
      {
        location: currentLatLng,
        radius: '2000',
        type: 'church',
      }];
    }

    const service = new google.maps.places.PlacesService(mapRef.current);
    // service.nearbySearch(requests, callback);
    requests.forEach((request) => {
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setCategoryNearbyData((preData) => ([...preData, ...results]));
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

  async function checkLikeOrNot(placeId) {
    if (!user.uid) { return; }
    const userArticlesArray = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userArticlesArray);
    if (docSnap.data().loved_attraction_ids.indexOf(placeId) > -1) {
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
    service.getDetails(
      placeRequest,
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(place);
          setModalDetail(place);
        } else {
          console.log('error');
        }
      },
    );
  }

  if (!isLoaded) {
    return (
      ''
    );
  }

  return (
    <>
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
                    src={liked ? STAR?.FULL_STAR : STAR?.EMPTY_STAR}
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
              ? categoryPageScheduleData[clickedScheduleIndex]?.trip_days.map((item, index) => (
                <ScheduleBox
                  key={item?.schedule_id}
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
        {categoryNearbyData ? categoryNearbyData.map((item, index) => (
          <PlaceBoxWrapper
            id={item?.place_id}
            key={item?.place_id}
            onClick={(e) => {
              ShowDetailNCheckLikedOrNot(e.target.id);
              setClickedPlaceUrl(item?.photos?.[0]?.getUrl?.());
              setClickedPlaceName(item?.name);
              setClickedPlaceAddress(item?.vicinity);
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
        )) : ''}
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

Category.propTypes = {
  currentLatLng: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
};

Category.defaultProps = {
  currentLatLng: { lat: 25.03746, lng: 121.564558 },
};
