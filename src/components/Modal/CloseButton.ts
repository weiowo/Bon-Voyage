import tw from '@/lib/tw';

const CloseModalButton = tw.button`
  flex items-center justify-center h-[25px] w-[25px] absolute right-[20px] top-[20px]
  text-center [border:none] rounded-[50%] bg-black text-white cursor-pointer
  max-[401px]:right-[15px] max-[401px]:top-[15px]
`;

export default CloseModalButton;
