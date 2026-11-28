import tw from '@/lib/tw';

const PlaceBoxWrapper = tw.div`
  relative w-[220px] h-[320px] cursor-pointer max-[971px]:w-[176px] max-[971px]:h-[256px]
  max-[746px]:w-[220px] max-[746px]:h-[320px] max-[576px]:w-[176px] max-[576px]:h-[256px]
  max-[466px]:w-[154px] max-[466px]:h-[224px]
`;

export const PlaceBox = tw.div`
  w-[200px] h-[290px] mt-[10px] bg-white
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
  max-[971px]:w-[160px] max-[971px]:h-[232px] max-[746px]:w-[200px] max-[746px]:h-[290px]
  max-[576px]:w-[160px] max-[576px]:h-[232px] max-[466px]:w-[140px] max-[466px]:h-[210px]
`;

export const PlacePhoto = tw.img`
  mt-[6px] w-[188px] h-[188px] object-cover max-[971px]:w-[150px] max-[971px]:h-[150px]
  max-[746px]:w-[188px] max-[746px]:h-[188px] max-[576px]:w-[150px] max-[576px]:h-[150px]
  max-[466px]:w-[132px] max-[466px]:h-[132px]
`;

export const PlaceBoxBelowPart = tw.div`
  w-[188px] pt-[3px] h-[80px] ml-[15px] flex flex-col items-start gap-[5px]
  max-[971px]:w-[90%] max-[971px]:ml-[10px] max-[971px]:h-[30%]
`;

export const PlaceTitle = tw.div`
  w-[175px] text-[14px] font-medium text-black text-left max-[971px]:w-[90%]
  max-[466px]:text-[12px]
`;

export const AddPlaceToScheduleButton = tw.div`
  w-[65px] text-[10px] h-[20px] [background-color:grey] text-white rounded-[3px] flex
  justify-center items-center
`;

export const Tap = tw.img`
  absolute w-[85px] h-[20px] z-[10] [transform:rotate(25deg)] right-[-2px] top-[8px]
  max-[466px]:w-[65px] max-[466px]:h-[17px]
`;

export default PlaceBoxWrapper;
