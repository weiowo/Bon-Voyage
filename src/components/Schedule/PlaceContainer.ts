import tw from '@/lib/tw';

const PlaceContainer = tw.div`
  cursor-move flex justify-around items-center w-full h-[260px] pr-[20px] pt-[10px]
  pb-[10px] bg-[#e7f5fe]
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
`;

export const AddNewScheduleButton = tw.button`
  flex items-center justify-center gap-[10px] text-[15px] font-semibold text-white w-full
  h-[50px] [border:none] bg-[#63B5DC] pb-[10px] pt-[10px]
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)] cursor-pointer
  max-[801px]:mb-[50px]
`;

export const PlaceContainerInputArea = tw.div`
  w-auto h-auto max-[801px]:w-[68%]
`;

export const InputBox = tw.div`
  flex items-center justify-between w-[28vw] h-[30px] max-[801px]:w-full
  max-[801px]:shrink-0
`;

export const DeleteIcon = tw.img`
  w-[24px] h-[24px] cursor-pointer
`;

export const StyledInput = tw.input`
  text-[15px] h-[20px] w-[350px] [border-top:none] [border-right:none] [border-left:none]
  [outline:none] bg-transparent text-left [border-bottom:1px_solid_grey] max-[801px]:w-full
  max-[801px]:shrink-0 max-[801px]:text-[14px]
`;

export const AddNewScheduleIcon = tw.img`
  w-[22px] h-[22px]
`;

export default PlaceContainer;
