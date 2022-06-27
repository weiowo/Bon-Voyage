// 在首頁按下種類的時候，會把種類跟使用者所在位置的經緯度紀錄
// 接著到category頁面執行相關搜尋
// 不同的種類上面的banner可以不一樣
import React from 'react';
import styled from 'styled-components/macro';
import CampSrc from './images/camp.png';
import ArtSrc from './images/art-museum.png';
import FamilySrc from './images/family.png';
import CoupleSrc from './images/heart_pink.png';
import FoodSrc from './images/food.png';
import ShoppingSrc from './images/shopping.png';
import ReligionSrc from './images/religion.png';
import NightClubSrc from './images/nightlife.png';

const CategoryWrapper = styled.div`
margin-top:20px;
width:100vw;
height:350px;
display:flex;
flex-direction:column;
align-items:center;
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
`;

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
`;

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
`;

const CategoryRightArea = styled.div`
width:80px;
height:80px;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
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

function Category() {
  console.log('我在CategoryPage');
  return (
    <CategoryWrapper>
      <CategoryWrapperTitle>熱門分類</CategoryWrapperTitle>
      <CategoryBoxesContainer>
        <CategoryBox>
          <CategoryIcon src={CampSrc} />
          <CategoryRightArea>
            <CategoryBoxTitle>戶外露營</CategoryBoxTitle>
            <CategoryBoxDescription>體驗自然</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon src={ArtSrc} />
          <CategoryRightArea>
            <CategoryBoxTitle>藝文活動</CategoryBoxTitle>
            <CategoryBoxDescription>文青必備</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon src={FamilySrc} />
          <CategoryRightArea>
            <CategoryBoxTitle>親子之旅</CategoryBoxTitle>
            <CategoryBoxDescription>家人時光</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon src={CoupleSrc} />
          <CategoryRightArea>
            <CategoryBoxTitle>情侶約會</CategoryBoxTitle>
            <CategoryBoxDescription>甜蜜景點</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon src={FoodSrc} />
          <CategoryRightArea>
            <CategoryBoxTitle>吃爆美食</CategoryBoxTitle>
            <CategoryBoxDescription>就是舒壓</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon src={ShoppingSrc} />
          <CategoryRightArea>
            <CategoryBoxTitle>逛街爆買</CategoryBoxTitle>
            <CategoryBoxDescription>快樂花錢</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon src={NightClubSrc} />
          <CategoryRightArea>
            <CategoryBoxTitle>夜店酒吧</CategoryBoxTitle>
            <CategoryBoxDescription>嗨翻夜晚</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon src={ReligionSrc} />
          <CategoryRightArea>
            <CategoryBoxTitle>宗教之旅</CategoryBoxTitle>
            <CategoryBoxDescription>文化體驗</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
      </CategoryBoxesContainer>
    </CategoryWrapper>
  );
}

export default Category;
