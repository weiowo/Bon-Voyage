/* eslint-disable no-undef */
import React,
{
  useCallback, useRef, useEffect, useState, useContext,
} from 'react';
import styled from 'styled-components/macro';
import {
  doc, updateDoc, getDoc,
} from 'firebase/firestore';
import { useImmer } from 'use-immer';
import produce from 'immer';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import db from '../utils/firebase-init';
import CampingSrc from './images/camping_2.jpg';
import ArtsSrc from './images/art.jpg';
import FamilySrc from './images/family.jpg';
import CoupleSrc from './images/couple.jpg';
import FoodSrc from './images/food.jpg';
import ShoppingSrc from './images/shopping.jpg';
import NightLifeSrc from './images/bar.jpg';
import ReligionSrc from './images/religion.jpg';
// import PhotoSrc from './images/photo.jpg';
import TapSrc from './images/tap.png';
import BlackHeaderComponent
  from '../components/BlackHeader';
import UserContext from '../components/UserContextComponent';
import Default1 from './images/default1.png';
import Default2 from './images/default2.png';
import Default3 from './images/default3.png';
import Default4 from './images/default4.png';
import Default5 from './images/default5.png';
import {
  ModalBackground, ModalBox, ModalImgArea, ModalImg,
  ModalLeftArea, ModalPlaceTitle, ModalPlaceAddress, AddToScheduleButton, CloseModalButton,
  LeftButton, CurrentSchedulesTitle, ScheduleChoicesBoxWrapper, ScheduleChoicesBox,
  ScheduleChoiceTitle, ChooseButton, ModalContentWrapper, Loading,
} from './City';

const defaultArray = [Default1, Default2, Default3, Default4, Default5];

// modal

// const ModalBackground = styled.div`
// width:100vw;
// height:100vh;
// position:fixed;
// top:0;
// bottom:0;
// left:0;
// right:0;
// background-color:rgba(0, 0, 0, 0.7);
// display:flex;
// justify-content:center;
// align-items:center;
// display:${(props) => (props.active ? 'flex' : 'none')};
// z-index:100;
// `;

// const ModalBox = styled.div`
// display:flex;
// width:50vw;
// height:30vw;
// background-color:white;
// z-index:10;
// border-radius:20px;
// z-index:200;
// position: relative;
// align-items:center;
// `;

// const ModalImgArea = styled.div`
// width:25vw;
// height:22vw;
// display:flex;
// flex-wrap:wrap;
// align-items:center;
// gap:10px;
// `;

// const ModalImg = styled.img`
// width:10vw;
// height:10vw;
// border-radius:10px;
// `;

// const ModalLeftArea = styled.div`
// width:25vw;
// height:28vw;
// display:flex;
// flex-direction:column;
// align-items:center;
// justify-content:center;
// gap:10px;
// `;

// const ModalPlaceTitle = styled.div`
// font-size:26px;
// font-weight:600;
// width:80%;
// `;

// const ModalPlaceAddress = styled.div`
// width:80%;
// color:#696969;
// `;

// const AddToScheduleButton = styled.button`
// width:10vw;
// height:30px;
// border-radius:5px;
// background-color:grey;
// color:white;
// cursor:pointer;
// border:none;
// `;

// const CloseModalButton = styled.button`
// height:25px;
// width:25px;
// position:absolute;
// right:20px;
// top:20px;
// text-align:center;
// border:none;
// border-radius:50%;
// background-color:black;
// color:white;
// cursor:pointer;
// `;

const PlaceBoxesWrapper = styled.div`
width:100vw;
display:flex;
height:auto;
flex-wrap:wrap;
justify-content:center;
gap:30px;
margin-top:90px;
`;

const PlaceBoxWrapper = styled.div`
position:relative;
width:220px;
height:320px;
cursor:pointer;
`;

const PlaceBox = styled.div`
width: 200px;
height: 280px;
margin-top:10px;
background-color:white;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const PlacePhoto = styled.img`
margin-top:6px;
width:188px;
height:188px;
`;

const PlaceBoxBelowPart = styled.div`
width:188px;
padding-top:3px;
height:80px;
margin-left:15px;
display:flex;
flex-direction:column;
align-items:flex-start;
gap:5px;
`;

const PlaceTitle = styled.div`
width:175px;
font-size:14px;
font-weight:500;
color:black;
text-align:left;
`;

const AddPlaceToScheduleButton = styled.div`
width:65px;
font-size:10px;
height:20px;
background-color:grey;
color:white;
border-radius:3px;
display:flex;
justify-content:center;
align-items:center;
`;

const Tap = styled.img`
position:absolute;
width:85px;
height:20px;
z-index:10;
transform: rotate(25deg);
right: -2px;
top: 8px;
`;

const CategoryBanner = styled.img`
width:100vw;
height:auto;
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

function Category({ currentLatLng }) {
  const { search } = useLocation();
  const user = useContext(UserContext);
  //   const lat = Number(new URLSearchParams(search).get('lat'));
  //   const lng = Number(new URLSearchParams(search).get('lng'));
  const categoryFromUrl = new URLSearchParams(search).get('category');
  console.log(search);
  console.log({ search });
  console.log('從category頁面直接拿到經緯度囉！', currentLatLng);
  console.log(currentLatLng);
  const [categoryPageScheduleData, setCategoryPageScheduleData] = useImmer([]); // 是這個人所有行程！不是單一!
  const [clickedScheduleIndex, setClickedScheduleIndex] = useState(); // 點到的那個行程的index!
  console.log('行程Index喔', clickedScheduleIndex);
  const [clickedScheduleId, setClickedScheduleId] = useState(); // 點到的那個行程的ID!
  console.log('行程ID喔', clickedScheduleId);
  const [dayIndex, setDayIndex] = useState();
  console.log('我要加在這一天！', dayIndex);
  const [modalIsActive, setModalIsActive] = useState(false);
  const [chooseScheduleModalIsActive, setChooseScheduleModalIsActive] = useState(false);
  const [chooseDayModalIsActive, setChooseDayModalIsActive] = useState(false);
  const [modalDetail, setModalDetail] = useState({});
  console.log('我在category page useState中modalDetail', modalDetail);

  // 關於modal部分

  // 關掉modal

  function handleModalClose() {
    console.log('closed!');
    setModalIsActive(false);
  }

  // 打開modal

  function ClickAndShowPlaceDetail(clickedPlaceId) {
    console.log(clickedPlaceId);
    console.log('opened!');
    setModalIsActive(true);
    fetch(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${clickedPlaceId}&language=zh-TW&key=${process.env.REACT_APP_GOOGLE_API_KEY}`)
      .then((response) => {
        console.log(response);
        return response.json();
      }).then((jsonData) => {
        console.log('我在useEffect中', jsonData.result);
        setModalDetail(jsonData.result);
        // window.localStorage.setItem('PlcesSearched', jsonData);
      }).catch((err) => {
        console.log('錯誤:', err);
      });
  }

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
        docSnap.data().owned_schedule_ids.forEach(async (item, index) => {
          const docs = doc(db, 'schedules', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            if (Snap.data().deleted === false) {
              console.log('這位使用者的行程', index, Snap.data());
              setCategoryPageScheduleData((draft) => {
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
  }, [setCategoryPageScheduleData, user.uid]);

  // 確認加入

  function ComfirmedAdded() {
    console.log('已經加入囉！');
    const newPlace = {
      place_title: modalDetail?.name,
      place_address: modalDetail?.formatted_address,
      stay_time: 60,
    };
    // 用 immer 產生出新的行程資料
    const newScheduleData = produce(categoryPageScheduleData, (draft) => {
      console.log('哈哈', draft);
      draft[clickedScheduleIndex]?.trip_days[dayIndex].places.push(newPlace);
    });
    console.log('newScheduleData', newScheduleData);
    // 更新 state
    setCategoryPageScheduleData(newScheduleData);
    // 更新 firestore
    async function passAddedDataToFirestore() {
      console.log('修改好行程囉！');
      const scheduleRef = doc(db, 'schedules', clickedScheduleId);
      await updateDoc(scheduleRef, { ...newScheduleData[clickedScheduleIndex] });
    }
    passAddedDataToFirestore();
  }

  // 判斷現在是什麼種類的banner

  let BannerSrc;

  if (categoryFromUrl === 'camping') {
    BannerSrc = CampingSrc;
  } else if (categoryFromUrl === 'arts') {
    BannerSrc = ArtsSrc;
  } else if (categoryFromUrl === 'family') {
    BannerSrc = FamilySrc;
  } else if (categoryFromUrl === 'couple') {
    BannerSrc = CoupleSrc;
  } else if (categoryFromUrl === 'food') {
    BannerSrc = FoodSrc;
  } else if (categoryFromUrl === 'shopping') {
    BannerSrc = ShoppingSrc;
  } else if (categoryFromUrl === 'nightlife') {
    BannerSrc = NightLifeSrc;
  } else if (categoryFromUrl === 'religion') {
    BannerSrc = ReligionSrc;
  }

  const [categoryNearbyData, setCategoryNearbyData] = useState([]);
  console.log(categoryNearbyData);

  // 先loadmap

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // 拿到url上的種類、找附近此種類的景點

  const searchCategoryNearby = useCallback(() => {
    console.log('searchCategoryNearby', isLoaded);
    if (!isLoaded) return;
    let requests = [];

    if (categoryFromUrl === 'camping') {
      requests = [{
        location: { lat: 24.5711502, lng: 120.8154358 },
        radius: '50000',
        type: 'campground',
        // 很少，先放苗栗的
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
        // , 'zoo', 'park', 'aquarium'],
      },
      {
        location: currentLatLng,
        radius: '10000',
        type: 'amusement_park',
        // , 'zoo', 'park', 'aquarium'],
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
      // , 'home_goods_store', 'shopping_mall', 'department_store'],
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
        // ', 'bar', 'casino'],
      }];
    } else if (categoryFromUrl === 'religion') {
      requests = [{
        location: currentLatLng,
        radius: '2000',
        type: 'hindu_temple',
        // 'mosque',
      },
      {
        location: currentLatLng,
        radius: '2000',
        type: 'church',
      }];
    }

    const service = new google.maps.places.PlacesService(mapRef.current);
    // service.nearbySearch(requests, callback);
    console.log(service);
    requests.forEach((request) => {
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log('嘿嘿拿到種類資料惹呵呵(fromCategory頁面)');
          setCategoryNearbyData((preData) => ([...preData, ...results]));
          // 這樣會變兩個array在一個array、如果包{}則會變成分開兩次
        }
      });
    });
    console.log(requests);
  }, [categoryFromUrl, currentLatLng, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    // if (!nearbyData) return;
    // searchCategoryNearby();
    setTimeout(() => {
      searchCategoryNearby();
    }, 2000);
  }, [isLoaded, searchCategoryNearby]);
  //   console.log({ lat, lng });

  if (!isLoaded) {
    return (
      ''
    );
  }

  return (
    <>
      <ModalBackground active={modalIsActive}>
        <ModalBox>
          {modalDetail
            ? (
              <>
                <ModalLeftArea>
                  <ModalPlaceTitle>{modalDetail?.name}</ModalPlaceTitle>
                  <ModalPlaceAddress>{modalDetail?.formatted_address}</ModalPlaceAddress>
                  <AddToScheduleButton
                    onClick={() => {
                      setModalIsActive(false);
                      setChooseScheduleModalIsActive(true);
                    }}
                  >
                    加入行程
                  </AddToScheduleButton>
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
                <ScheduleChoicesBox id={item.schedule_id}>
                  <ScheduleChoiceTitle>
                    {item.title}
                  </ScheduleChoiceTitle>
                  <ChooseButton
                    onClick={() => {
                      setClickedScheduleId(item.schedule_id);
                      setClickedScheduleIndex(index);
                      setChooseDayModalIsActive(true); setChooseScheduleModalIsActive(false);
                    }}
                    type="button"
                  >
                    選擇
                  </ChooseButton>
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
                  <ScheduleChoicesBox style={{ display: 'flex' }}>
                    <ScheduleChoiceTitle>
                      第
                      {index + 1}
                      天
                    </ScheduleChoiceTitle>
                    <ChooseButton
                      clicked={dayIndex === index}
                      onClick={() => {
                        setDayIndex(index);
                      }}
                      type="button"
                    >
                      選擇
                    </ChooseButton>
                  </ScheduleChoicesBox>
                )) : ''}
            </ScheduleChoicesBoxWrapper>
            <button type="button" onClick={() => { ComfirmedAdded(); setChooseDayModalIsActive(false); }}>完成選擇</button>
          </ModalContentWrapper>
          <CloseModalButton
            type="button"
            onClick={() => setChooseDayModalIsActive(false)}
          >
            X
          </CloseModalButton>
        </ModalBox>
      </ModalBackground>
      <BlackHeaderComponent />
      <CategoryBanner src={BannerSrc} />
      <PlaceBoxesWrapper>
        {categoryNearbyData ? categoryNearbyData.map((item, index) => (
          <PlaceBoxWrapper
            id={item.place_id}
            onClick={(e) => { ClickAndShowPlaceDetail(e.target.id); }}
          >
            <Tap id={item.place_id} src={TapSrc} />
            <PlaceBox id={item.place_id}>
              <PlacePhoto
                id={item.place_id}
                alt="place_photo"
                src={item.photos?.[0]?.getUrl?.() ?? defaultArray[index % 5]}
              />
              <PlaceBoxBelowPart id={item?.place_id}>
                <PlaceTitle id={item?.place_id}>
                  {item?.name}
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
    </>
  );
}

export default Category;

Category.propTypes = {
  currentLatLng: PropTypes.func.isRequired,
};
