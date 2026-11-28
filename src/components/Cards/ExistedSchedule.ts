import tw from '@/lib/tw';

const ExistedSchedule = tw.div<{ isSelected?: boolean }>`
  flex items-center justify-between w-[26vw] h-[140px] gap-[20px] pl-[10px] pr-[10px]
  pt-[10px] pb-[10px] rounded-[16px] cursor-pointer shrink-0
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
  max-[801px]:w-[29vw] max-[801px]:gap-[10px] max-[801px]:[justify-content:left]
  max-[801px]:shrink-0 max-[749px]:w-[30vw] max-[749px]:gap-[8px]
  max-[749px]:[justify-content:left] max-[749px]:shrink-0 max-[749px]:[box-shadow:none]
  max-[749px]:pt-[0px] max-[749px]:pb-[0px] max-[749px]:h-[140px]
  ${(p) => (p.isSelected ? 'bg-[#E6D1F2]' : 'bg-[#e7f5fe]')}
`;

export const ExistedScheuleTitle = tw.div`
  w-[95%] h-[20%] text-left [font-weight:550] max-[901px]:w-full max-[901px]:mb-[10px]
  max-[701px]:w-[90%] max-[701px]:text-[13px] max-[701px]:flex max-[701px]:items-center
  max-[701px]:justify-center
`;

export const PhotoArea = tw.img`
  w-[100px] h-[100px] rounded-[20px] max-[901px]:w-[80px] max-[901px]:h-[80px]
  max-[701px]:hidden
`;

export const ScheduleRightPart = tw.div`
  flex flex-row w-[70%] max-[901px]:hidden
`;

export const SmallScheduleRightPart = tw.div`
  hidden max-[901px]:flex max-[901px]:flex-col max-[901px]:mr-[10px] max-[701px]:w-full
  max-[701px]:text-[12px] max-[701px]:flex max-[701px]:items-center
  max-[701px]:justify-center max-[701px]:mr-[0px] max-[701px]:gap-[10px]
`;

export const ButtonArea = tw.div`
  flex flex-col items-center gap-[15px] max-[901px]:flex-row max-[901px]:w-[85%]
  max-[901px]:gap-[10px] max-[701px]:flex-col max-[701px]:items-center
`;

export const Button = tw.button`
  h-[25px] w-[50px] [border:1px_solid_#296D98] text-[#296D98] rounded-[15px] font-medium
  cursor-pointer
`;

export default ExistedSchedule;
