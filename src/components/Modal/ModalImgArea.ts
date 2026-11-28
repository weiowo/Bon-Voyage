import tw from '@/lib/tw';

const ModalImgArea = tw.div`
  w-[25vw] h-[22vw] flex flex-wrap items-center gap-[10px] max-desktop:w-[50%]
  max-desktop:h-[70%] max-mobile-lg:w-full max-mobile-lg:h-[60%] max-mobile-lg:flex-wrap
  max-mobile-lg:justify-center max-mobile-lg:gap-[20px] max-mobile-lg:pb-[40px]
  max-mobile-lg:w-[90%] max-mobile-lg:h-[60%] max-mobile-lg:pb-[30px] max-mobile-sm:h-[50%]
  max-mobile-sm:gap-[8px]
`;

export const ModalImg = tw.img`
  w-[10vw] h-[10vw] rounded-[10px] object-cover max-desktop:w-[120px]
  max-desktop:h-[120px] max-mobile-lg:w-[170px] max-mobile-lg:h-[130px] max-mobile-lg:shrink-0
  max-mobile-lg:w-[140px] max-mobile-lg:h-[115px] max-mobile-md:w-[120px] max-mobile-md:h-[100px]
  max-mobile-sm:w-[110px] max-mobile-sm:h-[100px] max-mobile-xs:w-[120px] max-mobile-xs:h-[100px]
`;

export default ModalImgArea;
