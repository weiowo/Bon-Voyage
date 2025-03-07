import React from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import CAMPING_ICON from './images/camp.png';
import ART_ICON from './images/art-museum.png';
import FAMILY_ICON from './images/family.png';
import COUPLE_ICON from './images/heart_pink.png';
import FOOD_ICON from './images/food.png';
import SHOPPING_ICON from './images/shopping.png';
import RELIGION_ICON from './images/religion.png';
import NIGHT_ICON from './images/nightlife.png';

const CategoryWrapper = styled.div`
  align-self:center;
  margin-top:50px;
  width:100vw;
  height:280px;
  display:flex;
  flex-direction:column;
  align-items:center;
  @media screen and (max-width:800px){
    width:100vw;
    margin-top:30px;
    height:300px;
  }
  @media screen and (max-width:750px){
    height:480px;
  }
  @media screen and (max-width:500px){
    width:100%;
    height:450px;
    margin-left:0px;
  }
`;

const CategoryWrapperTitle = styled.div`
  width:100vw;
  height:30px;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:24px;
  font-weight:600;
  color:#1F456E;
  margin-bottom:30px;
  @media screen and (max-width:800px){
    font-size:24px;
    margin-bottom:20px;
  }
`;

const CategoryBoxesContainer = styled.div`
  margin-left:80px;
  margin-top:10px;
  display:flex;
  justify-content:center;
  align-items:center;
  width:80vw;
  flex-wrap:wrap;
  height:auto;
  @media screen and (max-width:1249px){
    margin-left:30px;
    width:85vw;
    gap:15px;
  }
  @media screen and (max-width:800px){
    margin-left:30px;
    width:85vw;
    gap:10px;
  }
  @media screen and (max-width:750px){
    margin-left:0px;
    margin-top:0px;
  }
  @media screen and (max-width:630px){
    width:100%;
    margin-top:0px;
    margin-left:0px;
  }
  @media screen and (max-width:500px){
    width:100%;
    height:89s0px;
    margin-top:20px;
    margin-left:0px;
    gap:10px;
  }
`;

const CategoryBox = styled.div`
  width:250px;
  height:100px;
  display:flex;
  align-items:center;
  gap:20px;
  @media screen and (max-width:1249px){
    width:200px;
  }
  @media screen and (max-width:1000px){
    width:180px;
    gap:0px;
  }
  @media screen and (max-width:900px){
    width:170px;
    gap:0px;
  }
  @media screen and (max-width:850px){
    width:150px;
  }
  @media screen and (max-width:750px){
    width:230px;
    justify-content:center;
  }
  @media screen and (max-width:500px){
    width:40%;
    justify-content:center;
    gap:10px;
    height:80px;
  }
`;

const CategoryIcon = styled.img`
  width:70px;
  height:70px;
  cursor:pointer;
`;

const CategoryRightArea = styled.div`
  width:80px;
  height:80px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  cursor:pointer;
`;

const CategoryBoxTitle = styled.div`
  font-weight:600;
  font-size:15px;
  color:black;
`;

const CategoryBoxDescription = styled.div`
  font-weight:600;
  font-size:15px;
  color:grey;
`;

function CategoryAreaInHome({ currentLatLng }) {
  const navigate = useNavigate();

  function navigateToCategoryPage(id) {
    navigate({ pathname: '/category', search: `?lat=${currentLatLng.lat}&lng=${currentLatLng.lng}&category=${id}` });
  }

  return (
    <CategoryWrapper>
      <CategoryWrapperTitle>熱門分類</CategoryWrapperTitle>
      <CategoryBoxesContainer>
        <CategoryBox>
          <CategoryIcon id="camping" onClick={(e) => navigateToCategoryPage(e.target.id)} src={CAMPING_ICON} />
          <CategoryRightArea id="camping" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="camping">戶外露營</CategoryBoxTitle>
            <CategoryBoxDescription id="camping">體驗自然</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="arts" onClick={(e) => navigateToCategoryPage(e.target.id)} src={ART_ICON} />
          <CategoryRightArea id="arts" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="arts">藝文活動</CategoryBoxTitle>
            <CategoryBoxDescription id="arts">文青必備</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="family" onClick={(e) => navigateToCategoryPage(e.target.id)} src={FAMILY_ICON} />
          <CategoryRightArea id="family" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="family">親子之旅</CategoryBoxTitle>
            <CategoryBoxDescription id="family">家人時光</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="couple" onClick={(e) => navigateToCategoryPage(e.target.id)} src={COUPLE_ICON} />
          <CategoryRightArea id="couple" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="couple">情侶約會</CategoryBoxTitle>
            <CategoryBoxDescription id="couple">甜蜜景點</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="food" onClick={(e) => navigateToCategoryPage(e.target.id)} src={FOOD_ICON} />
          <CategoryRightArea id="food" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="food">吃爆美食</CategoryBoxTitle>
            <CategoryBoxDescription id="food">就是舒壓</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="shopping" onClick={(e) => navigateToCategoryPage(e.target.id)} src={SHOPPING_ICON} />
          <CategoryRightArea id="shopping" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="shopping">逛街爆買</CategoryBoxTitle>
            <CategoryBoxDescription id="shopping">快樂花錢</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="nightlife" onClick={(e) => navigateToCategoryPage(e.target.id)} src={NIGHT_ICON} />
          <CategoryRightArea id="nightlife" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="nightlife">夜店酒吧</CategoryBoxTitle>
            <CategoryBoxDescription id="nightlife">嗨翻夜晚</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="religion" onClick={(e) => navigateToCategoryPage(e.target.id)} src={RELIGION_ICON} />
          <CategoryRightArea id="religion" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="religion">宗教之旅</CategoryBoxTitle>
            <CategoryBoxDescription id="religion">文化體驗</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
      </CategoryBoxesContainer>
    </CategoryWrapper>
  );
}

CategoryAreaInHome.propTypes = {
  currentLatLng: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
};

CategoryAreaInHome.defaultProps = {
  currentLatLng: PropTypes.shape({ lat: 25.03746, lng: 121.564558 }),
};

export default CategoryAreaInHome;
