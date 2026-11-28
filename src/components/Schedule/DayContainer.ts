import tw from '@/lib/tw';

const DayContainer = tw.div`
  h-[60px] flex w-full [justify-content:left] [box-shadow:3px_4px_8px_0px_rgba(0,0,0,0.2)]
  gap-[5px] z-[15] overflow-scroll shrink-0
  [&::-webkit-scrollbar-track]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:hidden
  [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar]:hidden
  [&::-webkit-scrollbar-thumb]:rounded-[10px]
  [&::-webkit-scrollbar-thumb]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-thumb]:hidden
`;

export const DayContainerTitle = tw.div<{ active?: boolean }>`
  flex items-center text-[12px] justify-center w-[100px] h-[60px] shrink-0 cursor-move
  [border:0.5px_solid_#616161] font-semibold tracking-[1.5px]
  ${(p) => (p.active ? 'bg-[#63B5DC]' : 'bg-white')}
  ${(p) => (p.active ? 'text-white' : 'text-[#616161]')}
`;

export const DayContainerBoxes = tw.div`
  flex flex-col gap-[20px] h-[75vh] overflow-auto
  [&::-webkit-scrollbar-track]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-[10px]
  [&::-webkit-scrollbar-thumb]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-thumb]:bg-[#D3D3D3]
`;

export const DragIcon = tw.img`
  w-[20px] h-[20px]
`;

export default DayContainer;
