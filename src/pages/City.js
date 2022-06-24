import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import styled from 'styled-components/macro';
import CitySrc from './images/city.png';

// import { useNavigate } from 'react-router-dom';
// import {
//   // getDocs,
//   collection, doc,
//   setDoc,
// } from 'firebase/firestore';
// import db from '../utils/firebase-init';

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

  if (!isLoaded) return <div>沒有成功...(fromCity頁面)</div>;

  return (
    <>
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
          {nearbyData.tourist_attraction ? nearbyData.tourist_attraction.map((item, index) => (
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
              <AttractionDescription>
                哈哈這是第
                {index + 1}
                個景點唷
              </AttractionDescription>
              <AttractionSeeMoreButton>瞭解更多</AttractionSeeMoreButton>
            </AttractionBox>
          )) : ''}
        </AttractionWrapper>
        <RestaurantAreaTitle>
          {nearbyData.restaurant ? `${cityFromUrl}必吃餐廳推薦` : ''}
        </RestaurantAreaTitle>
        <RestaurantWrapper>
          {nearbyData.restaurant ? nearbyData.restaurant.map((item, index) => (
            <RestaurantBox id={item.place_id}>
              <RestaurantPhoto
                alt="att"
                src={item.photos?.[0]?.getUrl?.() ?? '哈哈'}
              />
              <RestaurantBoxRightContent>
                <RestaurantTitle>
                  {item.name}
                </RestaurantTitle>
                <RestaurantDescription>
                  哈哈這是第
                  {index + 1}
                  個景點唷
                </RestaurantDescription>
                <RestaurantSeeMoreButton>瞭解更多</RestaurantSeeMoreButton>
              </RestaurantBoxRightContent>
            </RestaurantBox>
          )) : ''}
        </RestaurantWrapper>
        <AttractionAreaTitle>
          {nearbyData.lodging ? `${cityFromUrl} 熱門飯店推薦` : ''}
        </AttractionAreaTitle>
        <AttractionWrapper>
          {nearbyData.lodging ? nearbyData.lodging.map((item, index) => (
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
              <AttractionDescription>
                哈哈這是第
                {index + 1}
                個景點唷
              </AttractionDescription>
              <AttractionSeeMoreButton>瞭解更多</AttractionSeeMoreButton>
            </AttractionBox>
          )) : ''}
        </AttractionWrapper>
      </ContentArea>
    </>
  );
}

export default City;
