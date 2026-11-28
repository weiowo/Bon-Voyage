import tw from '@/lib/tw';

const ButtonStarArea = tw.div`
  w-full h-auto flex items-center justify-center
`;

export const AddFavoriteIcon = tw.img`
  w-[25px] h-[25px] cursor-pointer absolute right-[15%] [justify-self:right]
`;

export const AddToScheduleButton = tw.button`
  w-[10vw] h-[30px] rounded-[5px] [background-color:grey] font-medium [border:none]
  text-white cursor-pointer max-desktop:w-[110px]
`;

export default ButtonStarArea;
