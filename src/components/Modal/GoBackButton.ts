import tw from '@/lib/tw';

const LeftButton = tw.button`
  h-[25px] w-[25px] absolute bg-[url(/images/left-arrow.jpg)] bg-cover bg-no-repeat
  bg-[rgb(0,0,0,0.2)] [background-blend-mode:multiply] left-[20px] top-[20px] text-center
  [border:none] rounded-[50%] text-white cursor-pointer max-[401px]:left-[15px]
  max-[401px]:top-[15px]
`;

export default LeftButton;
