import tw from '@/lib/tw';

const ExistedSchedule = tw.div<{ isSelected?: boolean }>`
  flex items-center justify-between w-[26vw] h-[140px] gap-[20px] pl-[10px] pr-[10px]
  pt-[10px] pb-[10px] rounded-[16px] cursor-pointer shrink-0
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
  max-tablet:w-[29vw] max-tablet:gap-[10px] max-tablet:[justify-content:left]
  max-tablet:shrink-0 max-tablet-sm:w-[30vw] max-tablet-sm:gap-[8px]
  max-tablet-sm:[justify-content:left] max-tablet-sm:shrink-0 max-tablet-sm:[box-shadow:none]
  max-tablet-sm:pt-[0px] max-tablet-sm:pb-[0px] max-tablet-sm:h-[140px]
  ${(p) => (p.isSelected ? 'bg-[#E6D1F2]' : 'bg-[#e7f5fe]')}
`;

export const ExistedScheuleTitle = tw.div`
  w-[95%] h-[20%] text-left [font-weight:550] max-tablet-lg:w-full max-tablet-lg:mb-[10px]
  max-phablet:w-[90%] max-phablet:text-[13px] max-phablet:flex max-phablet:items-center
  max-phablet:justify-center
`;

export const PhotoArea = tw.img`
  w-[100px] h-[100px] rounded-[20px] max-tablet-lg:w-[80px] max-tablet-lg:h-[80px]
  max-phablet:hidden
`;

export const ScheduleRightPart = tw.div`
  flex flex-row w-[70%] max-tablet-lg:hidden
`;

export const SmallScheduleRightPart = tw.div`
  hidden max-tablet-lg:flex max-tablet-lg:flex-col max-tablet-lg:mr-[10px] max-phablet:w-full
  max-phablet:text-[12px] max-phablet:flex max-phablet:items-center
  max-phablet:justify-center max-phablet:mr-[0px] max-phablet:gap-[10px]
`;

export const ButtonArea = tw.div`
  flex flex-col items-center gap-[15px] max-tablet-lg:flex-row max-tablet-lg:w-[85%]
  max-tablet-lg:gap-[10px] max-phablet:flex-col max-phablet:items-center
`;

export const Button = tw.button`
  h-[25px] w-[50px] [border:1px_solid_#296D98] text-[#296D98] rounded-[15px] font-medium
  cursor-pointer
`;

export default ExistedSchedule;
