import tw from '@/lib/tw';

const SchedulesWrapper = tw.div`
  w-[95%] h-[95%] flex flex-col items-center overflow-auto
  [&::-webkit-scrollbar-track]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-[10px]
  [&::-webkit-scrollbar-thumb]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-thumb]:bg-[#D3D3D3]
`;

export const ConfirmDayButton = tw.button`
  w-[20%] h-[35px]
  [background:linear-gradient(312deg,rgb(178,228,238)_0%,rgb(161,176,246)_100%)]
  rounded-[25px] [border:none] text-black font-semibold text-[16px] cursor-pointer
`;

export const CurrentSchedulesTitle = tw.div`
  w-full h-[30px] text-[17px] font-semibold mt-[20px] mb-[10px]
`;

export const ScheduleBoxWrapper = tw.div`
  flex [flex-flow:wrap] h-auto w-auto items-center justify-center gap-[15px] pt-[10px]
  pb-[20px] pl-[2px] after:content-[""] after:w-[220px] overflow-auto
  [&::-webkit-scrollbar-track]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-[10px]
  [&::-webkit-scrollbar-thumb]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-thumb]:bg-[#D3D3D3]
`;

export const ScheduleBox = tw.div<{ clicked?: boolean }>`
  flex items-center w-[220px] h-[60px] rounded-[10px] cursor-pointer
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)] hover:bg-[#E6D1F2]
  ${(p) => (p.clicked ? 'bg-[#E6D1F2]' : 'bg-[#e7f5fe]')}
`;

export const ScheduleTitle = tw.div`
  w-[170px] text-left h-auto font-medium text-[15px] ml-[20px]
`;

export const ChooseButton = tw.button<{ clicked?: boolean }>`
  flex items-center justify-center w-[60px] h-[25px] rounded-[10px]
  [border:1px_solid_#296D98] text-[13px] [font-weight:550] mr-[10px] cursor-pointer
  ${(p) => (p.clicked ? '[background-color:grey]' : 'bg-white')}
  ${(p) => (p.clicked ? 'text-white' : 'text-black')}
`;

export default SchedulesWrapper;
