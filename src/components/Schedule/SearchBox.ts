import tw from '@/lib/tw';

const ResultsArea = tw.div`
  flex flex-col items-center h-[85%] fixed bottom-[0] max-[801px]:w-full
`;

export const SearchedPlace = tw.div`
  w-[45vw] h-[80px] flex items-center justify-center gap-[30px] mb-[5px] mt-[20px]
  max-[801px]:w-full
`;

export const RecommendPlaces = tw.div`
  flex flex-col items-center h-[90vh] w-[45vw] overflow-scroll bg-[#e7f5fe]
  [border-top:1px_solid_black] pt-[20px] gap-[10px] text-[16px] [font-weight:450]
  max-[801px]:w-full
`;

export const RecommendPlace = tw.div`
  gap-[30px] flex justify-between w-[90%] [border:1.5px_#226788_solid] rounded-[15px]
  pt-[20px] pb-[20px] bg-white max-[801px]:w-[90%]
`;

export const RecommendPlaceLeftArea = tw.div`
  flex w-[50%] flex-col justify-center ml-[30px] gap-[10px] max-[801px]:w-full
`;

export const RecommendPlaceTitle = tw.div`
  font-semibold text-[15px] text-left w-[270px] text-[#226788] max-[801px]:w-full
`;

export const SearchedPlaceTitle = tw.div`
  font-semibold text-[25px] text-left w-auto text-[#226788]
`;

export const RecommendPlcePhoto = tw.img`
  w-[90px] h-[90px] rounded-[15px] mr-[30px]
`;

export default ResultsArea;
