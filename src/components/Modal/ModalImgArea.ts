import tw from '@/lib/tw';

const ModalImgArea = tw.div`
  w-[25vw] h-[22vw] flex flex-wrap items-center gap-[10px] max-[1201px]:w-[50%]
  max-[1201px]:h-[70%] max-[631px]:w-full max-[631px]:h-[60%] max-[631px]:flex-wrap
  max-[631px]:justify-center max-[631px]:gap-[20px] max-[631px]:pb-[40px]
  max-[576px]:w-[90%] max-[576px]:h-[60%] max-[576px]:pb-[30px] max-[431px]:h-[50%]
  max-[431px]:gap-[8px]
`;

export const ModalImg = tw.img`
  w-[10vw] h-[10vw] rounded-[10px] object-cover max-[1201px]:w-[120px]
  max-[1201px]:h-[120px] max-[631px]:w-[170px] max-[631px]:h-[130px] max-[631px]:shrink-0
  max-[576px]:w-[140px] max-[576px]:h-[115px] max-[481px]:w-[120px] max-[481px]:h-[100px]
  max-[431px]:w-[110px] max-[431px]:h-[100px] max-[391px]:w-[120px] max-[391px]:h-[100px]
`;

export default ModalImgArea;
