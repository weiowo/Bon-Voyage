import tw from '@/lib/tw';

const AttractionBox = tw.div`
  flex flex-col items-center w-[250px] h-auto mt-[30px] cursor-pointer
  max-[1001px]:w-[200px] max-[891px]:w-[180px] max-[778px]:w-[250px] max-[514px]:w-[170px]
`;

export const AttractionPhotoContainer = tw.div`
  rounded-[20px] inline-block w-[200px] h-[240px] overflow-hidden max-[1001px]:w-[200px]
  max-[891px]:w-[180px] max-[778px]:w-[200px] max-[778px]:h-[240px] max-[514px]:w-[170px]
`;

export const AttractionPhoto = tw.img`
  rounded-[20px] block w-[200px] h-[240px] object-cover [transition:0.5s_all_ease-in-out]
  hover:[transform:scale(1.2)] max-[1001px]:w-[200px] max-[891px]:w-[180px]
  max-[778px]:w-[200px] max-[778px]:h-[240px] max-[514px]:w-[170px]
`;

export const AttractionTitle = tw.div`
  text-[14px] mt-[10px] font-medium text-[#AAAAAA]
`;

export const AttractionDescription = tw.div`
  text-[10px] mt-[5px]
`;

export const AttractionSeeMoreButton = tw.button`
  bg-[#63666A] text-white rounded-[3px] text-[10px] [box-style:none] [border:none]
  [outline:none] mt-[10px] cursor-pointer
`;

export default AttractionBox;
