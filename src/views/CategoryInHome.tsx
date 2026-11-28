import React from 'react';
import { useNavigate } from '@/lib/router';
import tw from '@/lib/tw';
import type { LatLng } from '../types';

const CAMPING_ICON = '/images/camp.webp';
const ART_ICON = '/images/art-museum.webp';
const FAMILY_ICON = '/images/family.webp';
const COUPLE_ICON = '/images/heart_pink.webp';
const FOOD_ICON = '/images/food.webp';
const SHOPPING_ICON = '/images/shopping.webp';
const RELIGION_ICON = '/images/religion.webp';
const NIGHT_ICON = '/images/nightlife.webp';

const DEFAULT_LAT_LNG: LatLng = { lat: 25.03746, lng: 121.564558 };

const CategoryWrapper = tw.div`
  self-center mt-[50px] w-[100vw] h-[280px] flex flex-col items-center max-[801px]:w-[100vw]
  max-[801px]:mt-[30px] max-[801px]:h-[300px] max-[751px]:h-[480px] max-[501px]:w-full
  max-[501px]:h-[450px] max-[501px]:ml-[0px]
`;

const CategoryWrapperTitle = tw.div`
  w-[100vw] h-[30px] flex justify-center items-center text-[24px] font-semibold
  text-[#1F456E] mb-[30px] max-[801px]:text-[24px] max-[801px]:mb-[20px]
`;

const CategoryBoxesContainer = tw.div`
  ml-[80px] mt-[10px] flex justify-center items-center w-[80vw] flex-wrap h-auto
  max-[1250px]:ml-[30px] max-[1250px]:w-[85vw] max-[1250px]:gap-[15px] max-[801px]:ml-[30px]
  max-[801px]:w-[85vw] max-[801px]:gap-[10px] max-[751px]:ml-[0px] max-[751px]:mt-[0px]
  max-[631px]:w-full max-[631px]:mt-[0px] max-[631px]:ml-[0px] max-[501px]:w-full
  max-[501px]:h-[89s0px] max-[501px]:mt-[20px] max-[501px]:ml-[0px] max-[501px]:gap-[10px]
`;

const CategoryBox = tw.div`
  w-[250px] h-[100px] flex items-center gap-[20px] max-[1250px]:w-[200px]
  max-[1001px]:w-[180px] max-[1001px]:gap-[0px] max-[901px]:w-[170px] max-[901px]:gap-[0px]
  max-[851px]:w-[150px] max-[751px]:w-[230px] max-[751px]:justify-center max-[501px]:w-[40%]
  max-[501px]:justify-center max-[501px]:gap-[10px] max-[501px]:h-[80px]
`;

const CategoryIcon = tw.img`
  w-[70px] h-[70px] cursor-pointer
`;

const CategoryRightArea = tw.div`
  w-[80px] h-[80px] flex flex-col items-center justify-center cursor-pointer
`;

const CategoryBoxTitle = tw.div`
  font-semibold text-[15px] text-black
`;

const CategoryBoxDescription = tw.div`
  font-semibold text-[15px] [color:grey]
`;

interface CategoryAreaInHomeProps {
  currentLatLng?: LatLng;
}

function CategoryAreaInHome({ currentLatLng = DEFAULT_LAT_LNG }: CategoryAreaInHomeProps) {
  const navigate = useNavigate();

  function navigateToCategoryPage(id: string) {
    navigate({ pathname: '/category', search: `?lat=${currentLatLng.lat}&lng=${currentLatLng.lng}&category=${id}` });
  }

  return (
    <CategoryWrapper>
      <CategoryWrapperTitle>熱門分類</CategoryWrapperTitle>
      <CategoryBoxesContainer>
        <CategoryBox>
          <CategoryIcon id="camping" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)} src={CAMPING_ICON} />
          <CategoryRightArea id="camping" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)}>
            <CategoryBoxTitle id="camping">戶外露營</CategoryBoxTitle>
            <CategoryBoxDescription id="camping">體驗自然</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="arts" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)} src={ART_ICON} />
          <CategoryRightArea id="arts" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)}>
            <CategoryBoxTitle id="arts">藝文活動</CategoryBoxTitle>
            <CategoryBoxDescription id="arts">文青必備</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="family" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)} src={FAMILY_ICON} />
          <CategoryRightArea id="family" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)}>
            <CategoryBoxTitle id="family">親子之旅</CategoryBoxTitle>
            <CategoryBoxDescription id="family">家人時光</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="couple" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)} src={COUPLE_ICON} />
          <CategoryRightArea id="couple" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)}>
            <CategoryBoxTitle id="couple">情侶約會</CategoryBoxTitle>
            <CategoryBoxDescription id="couple">甜蜜景點</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="food" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)} src={FOOD_ICON} />
          <CategoryRightArea id="food" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)}>
            <CategoryBoxTitle id="food">吃爆美食</CategoryBoxTitle>
            <CategoryBoxDescription id="food">就是舒壓</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="shopping" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)} src={SHOPPING_ICON} />
          <CategoryRightArea id="shopping" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)}>
            <CategoryBoxTitle id="shopping">逛街爆買</CategoryBoxTitle>
            <CategoryBoxDescription id="shopping">快樂花錢</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="nightlife" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)} src={NIGHT_ICON} />
          <CategoryRightArea id="nightlife" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)}>
            <CategoryBoxTitle id="nightlife">夜店酒吧</CategoryBoxTitle>
            <CategoryBoxDescription id="nightlife">嗨翻夜晚</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
        <CategoryBox>
          <CategoryIcon id="religion" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)} src={RELIGION_ICON} />
          <CategoryRightArea id="religion" onClick={(e) => navigateToCategoryPage((e.target as HTMLElement).id)}>
            <CategoryBoxTitle id="religion">宗教之旅</CategoryBoxTitle>
            <CategoryBoxDescription id="religion">文化體驗</CategoryBoxDescription>
          </CategoryRightArea>
        </CategoryBox>
      </CategoryBoxesContainer>
    </CategoryWrapper>
  );
}

export default CategoryAreaInHome;
