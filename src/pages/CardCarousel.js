import React from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import BckSrc from './images/paris.png';
import ArrowToRightSrc from './images/arrow-right.png';

const NearByPlaceWrapper = styled.div`
width:100vw;
height:430px;
display:flex;
align-items:center;
justify-content:center;
`;

const NearByPlaceLeftArea = styled.div`
width:15vw;
height:350px;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
margin-right:10px;
`;

const NearbyPlaceTitle = styled.div`
font-size:25px;
color:#1F456E;
font-weight:600;
margin-bottom:15px;
`;

const NearByPlaceDescription = styled.div`
font-size:12px;
color:grey;
font-weight:600;
margin-bottom:15px;
`;

const NearByViewMoreButton = styled.button`
width:130px;
height:40px;
color:white;
border:none;
background-color:#0492c2;
border-radius:5px;
color:white;
font-weight:600;
letter-spacing:3px;

`;

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
`;

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
`;

const ArrowToRight = styled.img`
width:40px;
height:40px;
margin-right:20px;
`;

function CardsCarousel({ currentNearbyAttraction }) {
  console.log('我在cardCarouselpage', currentNearbyAttraction);
  //   const attractions = JSON.parse(window.localStorage.getItem('周遭景點暫存區STRING'));
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
      <CardsWrapper>
        {currentNearbyAttraction ? currentNearbyAttraction.map((item) => (
          <Cards style={{ backgroundImage: `url(${item.photos?.[0]?.getUrl?.() ?? '哈哈'})` }}>
            <div>
              {item.name}
            </div>
          </Cards>
        )) : 'Loading中~請稍等~'}
        {/* 為何字沒有跑出？ */}
      </CardsWrapper>
      <ArrowToRight src={ArrowToRightSrc} />
    </NearByPlaceWrapper>
  );
}

CardsCarousel.propTypes = {
  currentNearbyAttraction: PropTypes.arrayOf.isRequired,
};

export default CardsCarousel;
