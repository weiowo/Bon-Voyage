import tw from '@/lib/tw';

const RestaurantBox = tw.div`
  flex items-center w-[350px] h-[160px] mt-[20px] cursor-pointer bg-[#FAFAFA] pl-[38px]
  rounded-[15px] [border:#3f3f3f_solid_1px]
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
  max-[778px]:mt-[15px] max-[778px]:w-[330px] max-[778px]:pl-[25px] max-[514px]:mt-[15px]
  max-[514px]:w-[330px] max-[514px]:pl-[25px]
`;

export const RestaurantPhoto = tw.img`
  rounded-[20px] w-[105px] h-[105px] mr-[20px] object-cover
`;

export const RestaurantBoxRightContent = tw.div`
  w-auto flex flex-col items-start
`;

export const RestaurantTitle = tw.div`
  text-[16px] mt-[10px] font-semibold [align-self:left] [justify-content:left] text-left
  w-[160px]
`;

export const RestaurantDescription = tw.div`
  text-[10px] mt-[5px] text-[#949494]
`;

export const RestaurantSeeMoreButton = tw.button`
  w-[80px] bg-[#63666A] text-white rounded-[3px] text-[10px] [border:none] [outline:none]
  mt-[10px] cursor-pointer
`;

export default RestaurantBox;
