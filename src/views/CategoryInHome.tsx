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
  self-center mt-[50px] w-full h-[280px] flex flex-col items-center max-tablet:w-full
  max-tablet:mt-[30px] max-tablet:h-[300px] max-tablet-sm:h-[480px] max-mobile:w-full
  max-mobile:h-[450px] max-mobile:ml-[0px]
`;

const CategoryWrapperTitle = tw.div`
  w-full h-[30px] flex justify-center items-center text-[24px] font-semibold
  text-[#1F456E] mb-[30px] max-tablet:text-[24px] max-tablet:mb-[20px]
`;

const CategoryBoxesContainer = tw.div`
  ml-[80px] mt-[10px] flex justify-center items-center w-[80vw] flex-wrap h-auto
  max-wide:ml-[30px] max-wide:w-[85vw] max-wide:gap-[15px] max-tablet:ml-[30px]
  max-tablet:w-[85vw] max-tablet:gap-[10px] max-tablet-sm:ml-[0px] max-tablet-sm:mt-[0px]
  max-mobile-lg:w-full max-mobile-lg:mt-[0px] max-mobile-lg:ml-[0px] max-mobile:w-full
  max-mobile:h-[89s0px] max-mobile:mt-[20px] max-mobile:ml-[0px] max-mobile:gap-[10px]
`;

const CategoryBox = tw.div`
  w-[250px] h-[100px] flex items-center gap-[20px] max-wide:w-[200px]
  max-laptop:w-[180px] max-laptop:gap-[0px] max-tablet-lg:w-[170px] max-tablet-lg:gap-[0px]
  max-tablet-lg:w-[150px] max-tablet-sm:w-[230px] max-tablet-sm:justify-center max-mobile:w-[40%]
  max-mobile:justify-center max-mobile:gap-[10px] max-mobile:h-[80px]
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
