// 在首頁按下種類的時候，會把種類跟使用者所在位置的經緯度紀錄
// 接著到category頁面執行相關搜尋
// 不同的種類上面的banner可以不一樣
import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CampSrc from './images/camp.png';
import ArtSrc from './images/art-museum.png';
import FamilySrc from './images/family.png';
import CoupleSrc from './images/heart_pink.png';
import FoodSrc from './images/food.png';
import ShoppingSrc from './images/shopping.png';
import ReligionSrc from './images/religion.png';
import NightClubSrc from './images/nightlife.png';

const CategoryWrapper = styled.div`
align-self:center;
margin-top:20px;
width:100vw;
height:350px;
display:flex;
flex-direction:column;
align-items:center;
@media screen and (max-width:800px){
  width:100vw;
  margin-top:30px;
  height:auto;
}`;

const CategoryWrapperTitle = styled.div`
width:100vw;
height:30px;
display:flex;
justify-content:center;
align-items:center;
font-size:24px;
font-weight:600;
color:#1F456E;
@media screen and (max-width:800px){
  font-size:30px;
}`;

const CategoryBoxesContainer = styled.div`
margin-left:80px;
margin-top:10px;
display:flex;
justify-content:center;
align-items:center;
width:80vw;
height:300px;
display:flex;
flex-wrap:wrap;
@media screen and (max-width:800px){
  width:90vw;
  margin-top:30px;
  height:auto;
}`;

const CategoryBox = styled.div`
width:250px;
height:100px;
display:flex;
align-items:center;
gap:20px;
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
  // const [categoryOption, setCategoryOption] = useState('');
  useEffect(() => {
    console.log('我在CategoryPage');
    console.log({ currentLatLng });
    console.log(currentLatLng);
    console.log(currentLatLng.lat, currentLatLng.lng);
  }, [currentLatLng]);

  const navigate = useNavigate();

  function navigateToCategoryPage(id) {
    navigate({ pathname: '/category', search: `?lat=${currentLatLng.lat}&lng=${currentLatLng.lng}&category=${id}` });
  }

  return (
    <CategoryWrapper>
      <CategoryWrapperTitle>熱門分類</CategoryWrapperTitle>
      <CategoryBoxesContainer>
        <CategoryBox>
          <CategoryIcon id="camping" onClick={(e) => navigateToCategoryPage(e.target.id)} src={CampSrc} />
          <CategoryRightArea id="camping" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="camping">戶外露營</CategoryBoxTitle>
            <CategoryBoxDescription id="camping">體驗自然</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="arts" onClick={(e) => navigateToCategoryPage(e.target.id)} src={ArtSrc} />
          <CategoryRightArea id="arts" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="arts">藝文活動</CategoryBoxTitle>
            <CategoryBoxDescription id="arts">文青必備</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="family" onClick={(e) => navigateToCategoryPage(e.target.id)} src={FamilySrc} />
          <CategoryRightArea id="family" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="family">親子之旅</CategoryBoxTitle>
            <CategoryBoxDescription id="family">家人時光</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="couple" onClick={(e) => navigateToCategoryPage(e.target.id)} src={CoupleSrc} />
          <CategoryRightArea id="couple" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="couple">情侶約會</CategoryBoxTitle>
            <CategoryBoxDescription id="couple">甜蜜景點</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="food" onClick={(e) => navigateToCategoryPage(e.target.id)} src={FoodSrc} />
          <CategoryRightArea id="food" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="food">吃爆美食</CategoryBoxTitle>
            <CategoryBoxDescription id="food">就是舒壓</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="shopping" onClick={(e) => navigateToCategoryPage(e.target.id)} src={ShoppingSrc} />
          <CategoryRightArea id="shopping" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="shopping">逛街爆買</CategoryBoxTitle>
            <CategoryBoxDescription id="shopping">快樂花錢</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="nightlife" onClick={(e) => navigateToCategoryPage(e.target.id)} src={NightClubSrc} />
          <CategoryRightArea id="nightlife" onClick={(e) => navigateToCategoryPage(e.target.id)}>
            <CategoryBoxTitle id="nightlife">夜店酒吧</CategoryBoxTitle>
            <CategoryBoxDescription id="nightlife">嗨翻夜晚</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="religion" onClick={(e) => navigateToCategoryPage(e.target.id)} src={ReligionSrc} />
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
  currentLatLng: PropTypes.func.isRequired,
};

export default CategoryAreaInHome;
