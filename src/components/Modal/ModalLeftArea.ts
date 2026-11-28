import tw from '@/lib/tw';

const ModalLeftArea = tw.div`
  w-[25vw] h-[28vw] flex flex-col items-center justify-center gap-[10px] relative
  max-desktop:w-[50%] max-desktop:h-[80%] max-mobile-lg:w-[90%] max-mobile-lg:h-[50%]
  max-mobile-lg:gap-[20px] max-mobile-lg:w-[90%] max-mobile-lg:h-[45%] max-mobile-lg:gap-[20px]
  max-mobile-sm:h-[50%]
`;

export default ModalLeftArea;
