import React, { useState } from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import BckSrc from './images/paris.png';
import ArrowToRightSrc from './images/arrow-right.png';
import ArrowToLeftSrc from './images/arrow-left.png';

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
overflow:scroll;
z-index:1;
gap:20px;
@media screen and (max-width:800px){
display:none;
}`;

const SmallScreenCards = styled.div`
display:none;
@media screen and (max-width:800px){
  width:83vw;
  height:260px;
  display:flex; 
  flex-direction:column;
  align-items:center;
  justify-content:center;
  flex-wrap:wrap;
  position:relative;
  overflow:scroll;
  z-index:1;
  gap:17px;
}`;

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
overflow:scroll;
border-radius:10px;
background-image: url(${BckSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
// background: linear-gradient(#3204fdba, #9907facc), url(${BckSrc}) no-repeat cover;
@media screen and (max-width:800px){
  width:26vw;
  height:250px;
}`;

const SmallScreenCardsWrapper = styled.div`
display:none;
@media screen and (max-width:800px){
  display:flex;
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
  width:40px;
  height:40px;
  cursor:pointer;
}`;

function CardsCarousel({ currentNearbyAttraction }) {
  console.log('我在cardCarouselpage', currentNearbyAttraction);
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

  return (
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
            <Cards id={currentIndex} className={index} style={{ backgroundImage: `url(${item.photos?.[0]?.getUrl?.() ?? '哈哈'})` }}>
              <div>
                {item.name}
              </div>
            </Cards>
          )) : 'Loading中~請稍等~'}
        {/* 為何字沒有跑出？ */}
      </CardsWrapper>
      <SmallScreenCardsWrapper>
        <SmallScreenArrow onClick={() => prevPhotos()} src={ArrowToLeftSrc} />
        <SmallScreenCards>
          {currentNearbyAttraction
            ? currentNearbyAttraction.slice(currentIndex, currentIndex + 3).map((item, index) => (
              <Cards id={currentIndex} className={index} style={{ backgroundImage: `url(${item.photos?.[0]?.getUrl?.() ?? '哈哈'})` }}>
                <div>
                  {item.name}
                </div>
              </Cards>
            )) : 'Loading中~請稍等~'}
          {/* 為何字沒有跑出？ */}
        </SmallScreenCards>
        <SmallScreenArrow onClick={() => nextPhotos()} src={ArrowToRightSrc} />
      </SmallScreenCardsWrapper>
      <Arrow src={ArrowToRightSrc} onClick={() => nextPhotos()} />
    </NearByPlaceWrapper>
  );
}

CardsCarousel.propTypes = {
  currentNearbyAttraction: PropTypes.func.isRequired,
};

export default CardsCarousel;
