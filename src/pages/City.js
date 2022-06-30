import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import styled from 'styled-components/macro';
import {
  doc, getDoc, updateDoc,
} from 'firebase/firestore';
import { useImmer } from 'use-immer';
import produce from 'immer';
import db from '../utils/firebase-init';
import CitySrc from './images/city.png';
import BlackHeaderComponent from '../components/BlackHeader';
// import PlaceModal from '../components/PlaceModal';

// import { useNavigate } from 'react-router-dom';
// import {
//   // getDocs,
//   collection, doc,
//   setDoc,
// } from 'firebase/firestore';
// import db from '../utils/firebase-init';

const ModalBackground = styled.div`
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

const ModalBox = styled.div`
display:flex;
width:50vw;
height:30vw;
background-color:white;
z-index:10;
border-radius:20px;
z-index:200;
position: relative;
align-items:center;
`;

const ModalImgArea = styled.div`
width:25vw;
height:22vw;
display:flex;
flex-wrap:wrap;
align-items:center;
gap:10px;
`;

const ModalImg = styled.img`
width:10vw;
height:10vw;
border-radius:10px;
`;

const ModalLeftArea = styled.div`
width:25vw;
height:28vw;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:10px;
`;

const AddToScheduleButton = styled.button`
width:10vw;
height:30px;
border-radius:5px;
background-color:grey;
color:white;
cursor:pointer;
`;

const CloseModalButton = styled.button`
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
`;

const Banner = styled.img`
width:100vw;
height:auto;
`;

const CityTitle = styled.div`
width:100vw;
height:auto;
z-index:10;
font-size:35px;
font-weight:600;
position:absolute;
top:150px;
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
margin-top:20px;
font-weight:600;
`;

const AttractionWrapper = styled.div`
display:flex;
width:100vw;
height:auto;
flex-wrap:wrap;
justify-content:center;
margin-top:0px;
`;

const AttractionBox = styled.div`
display:flex;
flex-direction:column;
align-items:center;
width:250px;
height:auto;
margin-top:30px;
cursor:pointer;
`;

const AttractionPhotoContainer = styled.div`
border-radius:20px;
display: inline-block;
width:200px;
height:240px;
overflow: hidden;
`;

const AttractionPhoto = styled.img`
border-radius:20px;
display: block;
width:200px;
height:240px;
transition: 0.5s all ease-in-out;
&:hover {
    transform: scale(1.2);
}`;

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

// 餐廳區域

const RestaurantAreaTitle = styled.div`
width:100vw;
height:auto;
font-size:26px;
display:flex;
justify-content:center;
margin-top:20px;
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
`;

const RestaurantPhoto = styled.img`
border-radius:20px;
width:105px;
height:105px;
margin-right:20px;
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

function City() {
  const { search } = useLocation();
  const [nearbyData, setNearbyData] = useState({});
  const [cityPageScheduleData, setCityPageScheduleData] = useImmer([]); // 是這個人所有的行程哦！不是單一筆行程!
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
  console.log('我在useState中modalDetail', modalDetail);

  console.log('我在useState中cityPageScheduleData', cityPageScheduleData);
  //   const [attractionSliderIndex, setAttractionSliderIndex] = useState();
  //   const [ loading, setLoading] = useState(true);
  //   const [error, setError] = useState();

  console.log(nearbyData);
  const lat = Number(new URLSearchParams(search).get('lat'));
  const lng = Number(new URLSearchParams(search).get('lng'));
  const cityFromUrl = new URLSearchParams(search).get('city');
  const optionFromUrl = new URLSearchParams(search).get('option');
  console.log(lat);
  console.log(lng);
  console.log(cityFromUrl);

  // 關於modal部分

  function handleModalClose() {
    console.log('closed!');
    setModalIsActive(false);
  }
  // console.log(nearbyData.lodging[0].photos[0].getUrl());

  // 關於slick slider部分

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const searchNearby = useCallback(() => {
    console.log('searchNearby', isLoaded);
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

    // 如果只選到一種，type就會只放那種
    // 如果選「全部」，那就會query三次，獲取20*3筆結果！

    // function callback(results, status) {
    //   // eslint-disable-next-line no-undef
    //   console.log('callback', results, status, google.maps.places.PlacesServiceStatus.OK);
    //   // eslint-disable-next-line no-undef
    //   if (status === google.maps.places.PlacesServiceStatus.OK) {
    //     console.log('哇哈哈哈哈哈哈哈(fromCity頁面)');
    //     // { hotel: [], landmark: [] }
    //     const data = { [optionFromUrl]: results };
    //     setNearbyData(data);
    //   }
    // }
    // eslint-disable-next-line no-undef
    const service = new google.maps.places.PlacesService(mapRef.current);
    console.log(service);
    requests.forEach((request) => {
      service.nearbySearch(request, (results, status) => {
        // eslint-disable-next-line no-undef
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log('哇哈哈哈哈哈哈哈(fromCity頁面)');
          // { hotel: [], landmark: [] }
          setNearbyData((preData) => ({ ...preData, [request.type]: results }));
        }
      });
    });
  }, [lat, lng, optionFromUrl, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    // if (!nearbyData) return;
    setTimeout(() => {
      searchNearby();
    }, 1000);
  }, [searchNearby, isLoaded]);
  console.log({ lat, lng });

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
      const docRef = doc(db, 'users', '4upu03jk1cAjA0ZbAAJH');
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
            console.log('這位使用者的行程', index, Snap.data());
            setCityPageScheduleData((draft) => {
              draft.push(Snap.data());
            });
          } else {
            console.log('沒有這個行程！');
          }
        });
      }
      getSchedulesFromList();
    }
    getUserArrayList();
  }, [setCityPageScheduleData]);

  // 選好行程跟天數時，會把行程的名稱跟地址加到immer中，並送到database中

  //   function ComfirmedAdded() {
  //     console.log('已經加入囉！');
  //     const newPlace = {
  //       place_title: modalDetail.name,
  //       place_address: modalDetail.formatted_address,
  //       stay_time: '',
  //     };
  //     //   行程整理到immer中
  //     setCityPageScheduleData((draft) => {
  //       console.log('哈哈', cityPageScheduleData);
  //       draft[clickedScheduleIndex].trip_days[dayIndex].places.push(newPlace);
  //     });
  //     //   行程整理好後推上firestore
  //     async function passAddedDataToFirestore() {
  //       console.log('修改好行程囉！');
  //       const scheduleRef = doc(db, 'schedules', clickedScheduleId);
  //       console.log(cityPageScheduleData[clickedScheduleIndex]);
  //       await updateDoc(scheduleRef, cityPageScheduleData[clickedScheduleIndex]);
  //     }
  //     passAddedDataToFirestore();
  //   }
  function ComfirmedAdded() {
    console.log('已經加入囉！');
    const newPlace = {
      place_title: modalDetail.name,
      place_address: modalDetail.formatted_address,
      stay_time: '',
    };
    // 用 immer 產生出新的行程資料
    const newScheduleData = produce(cityPageScheduleData, (draft) => {
      console.log('哈哈', draft);
      draft[clickedScheduleIndex].trip_days[dayIndex].places.push(newPlace);
    });
    console.log('newScheduleData', newScheduleData);
    // 更新 state
    setCityPageScheduleData(newScheduleData);
    // 更新 firestore
    async function passAddedDataToFirestore() {
      console.log('修改好行程囉！');
      const scheduleRef = doc(db, 'schedules', clickedScheduleId);
      await updateDoc(scheduleRef, { ...newScheduleData[clickedScheduleIndex] });
    }
    passAddedDataToFirestore();
  }

  if (!isLoaded) return <div>City頁Loading出了點問題OWO!可以先到首頁看更多景點唷^__^!</div>;

  return (
    <>
      <BlackHeaderComponent />
      <ModalBackground active={modalIsActive}>
        <ModalBox>
          <ModalLeftArea>
            <div style={{ fontSize: '30px', fontWeight: '600' }}>{modalDetail.name}</div>
            <div>{modalDetail.formatted_address}</div>
            <AddToScheduleButton
              onClick={() => { setModalIsActive(false); setChooseScheduleModalIsActive(true); }}
            >
              加入行程
            </AddToScheduleButton>
          </ModalLeftArea>
          <ModalImgArea>
            <ModalImg alt="detail_photo" src={modalDetail.photos?.[0] ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=250&photoreference=${modalDetail.photos[1].photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}` : 'none'} />
            <ModalImg alt="detail_photo" src={modalDetail.photos?.[0] ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=250&photoreference=${modalDetail.photos[2].photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}` : 'none'} />
            <ModalImg alt="detail_photo" src={modalDetail.photos?.[0] ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=250&photoreference=${modalDetail.photos[3].photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}` : 'none'} />
            <ModalImg alt="detail_photo" src={modalDetail.photos?.[0] ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=250&photoreference=${modalDetail.photos[4].photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}` : 'none'} />
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
          <div>
            <div>您的現有行程</div>
            {cityPageScheduleData ? cityPageScheduleData.map((item, index) => (
              <div>
                <div style={{ display: 'flex' }} id={item.schedule_id}>
                  <div>
                    {index + 1}
                    :
                    {item.title}
                  </div>
                  <button onClick={() => { setClickedScheduleId(item.schedule_id); setClickedScheduleIndex(index); setChooseDayModalIsActive(true); setChooseScheduleModalIsActive(false); }} type="button">選擇</button>
                </div>
              </div>
            )) : ''}
          </div>
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
          <div>
            <div>請選擇天數</div>
            {cityPageScheduleData
              ? cityPageScheduleData[clickedScheduleIndex]?.trip_days.map((item, index) => (
                <div>
                  <div style={{ display: 'flex' }}>
                    <div>
                      第
                      {index + 1}
                      天
                    </div>
                    <button onClick={() => { setDayIndex(index); }} type="button">選擇</button>
                  </div>
                </div>
              )) : ''}
            <button type="button" onClick={() => { ComfirmedAdded(); setChooseDayModalIsActive(false); }}>完成選擇</button>
          </div>
          <CloseModalButton
            type="button"
            onClick={() => setChooseDayModalIsActive(false)}
          >
            X
          </CloseModalButton>
        </ModalBox>
      </ModalBackground>

      <Banner src={CitySrc} />
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
      <ContentArea>
        <AttractionAreaTitle>
          {nearbyData.tourist_attraction ? `${cityFromUrl}必去景點推薦` : ''}
        </AttractionAreaTitle>
        <AttractionWrapper>
          {nearbyData.tourist_attraction ? nearbyData.tourist_attraction.map((item) => (
            <AttractionBox
              id={item.place_id}
              onClick={(e) => { ClickAndShowPlaceDetail(e.target.id); }}
            >
              <AttractionPhotoContainer
                id={item.place_id}
              >
                <AttractionPhoto
                  id={item.place_id}
                  alt="att"
                  src={item.photos?.[0]?.getUrl?.() ?? '哈哈'}
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
          {nearbyData.restaurant ? nearbyData.restaurant.map((item) => (
            <RestaurantBox id={item.place_id}>
              <RestaurantPhoto
                alt="att"
                src={item.photos?.[0]?.getUrl?.() ?? '哈哈'}
              />
              <RestaurantBoxRightContent>
                <RestaurantTitle>
                  {item.name}
                </RestaurantTitle>
                <RestaurantDescription />
                <RestaurantSeeMoreButton
                  id={item.place_id}
                  onClick={(e) => { ClickAndShowPlaceDetail(e.target.id); }}
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
          {nearbyData.lodging ? nearbyData.lodging.map((item) => (
            <AttractionBox id={item.place_id}>
              <AttractionPhotoContainer>
                <AttractionPhoto
                  alt="att"
                  src={item.photos?.[0]?.getUrl?.() ?? '哈哈'}
                />
              </AttractionPhotoContainer>
              <AttractionTitle>
                {item.name}
              </AttractionTitle>
              <AttractionDescription />
              <AttractionSeeMoreButton
                id={item.place_id}
                onClick={(e) => { ClickAndShowPlaceDetail(e.target.id); }}
              >
                瞭解更多
              </AttractionSeeMoreButton>
            </AttractionBox>
          )) : ''}
        </AttractionWrapper>
      </ContentArea>
    </>
  );
}

export default City;
