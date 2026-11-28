import tw from '@/lib/tw';

const PlaceBoxWrapper = tw.div`
  relative w-[220px] h-[320px] cursor-pointer max-laptop:w-[176px] max-laptop:h-[256px]
  max-tablet-sm:w-[220px] max-tablet-sm:h-[320px] max-mobile-lg:w-[176px] max-mobile-lg:h-[256px]
  max-mobile-md:w-[154px] max-mobile-md:h-[224px]
`;

export const PlaceBox = tw.div`
  w-[200px] h-[290px] mt-[10px] bg-white
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
  max-laptop:w-[160px] max-laptop:h-[232px] max-tablet-sm:w-[200px] max-tablet-sm:h-[290px]
  max-mobile-lg:w-[160px] max-mobile-lg:h-[232px] max-mobile-md:w-[140px] max-mobile-md:h-[210px]
`;

export const PlacePhoto = tw.img`
  mt-[6px] w-[188px] h-[188px] object-cover max-laptop:w-[150px] max-laptop:h-[150px]
  max-tablet-sm:w-[188px] max-tablet-sm:h-[188px] max-mobile-lg:w-[150px] max-mobile-lg:h-[150px]
  max-mobile-md:w-[132px] max-mobile-md:h-[132px]
`;

export const PlaceBoxBelowPart = tw.div`
  w-[188px] pt-[3px] h-[80px] ml-[15px] flex flex-col items-start gap-[5px]
  max-laptop:w-[90%] max-laptop:ml-[10px] max-laptop:h-[30%]
`;

export const PlaceTitle = tw.div`
  w-[175px] text-[14px] font-medium text-black text-left max-laptop:w-[90%]
  max-mobile-md:text-[12px]
`;

export const AddPlaceToScheduleButton = tw.div`
  w-[65px] text-[10px] h-[20px] [background-color:grey] text-white rounded-[3px] flex
  justify-center items-center
`;

export const Tap = tw.img`
  absolute w-[85px] h-[20px] z-[10] [transform:rotate(25deg)] right-[-2px] top-[8px]
  max-mobile-md:w-[65px] max-mobile-md:h-[17px]
`;

export default PlaceBoxWrapper;
