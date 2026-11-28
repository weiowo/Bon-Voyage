import tw from '@/lib/tw';

const Loading = tw.div`
  m-auto mt-[50px] [border-right:10px_solid_#EAF0F6] [border-bottom:10px_solid_#EAF0F6]
  [border-left:10px_solid_#EAF0F6] rounded-[50%] [border-top:10px_solid_#E6D1F2] w-[70px]
  h-[70px] [animation:spinner_3s_linear_infinite]
`;
export default Loading;
