import tw from '@/lib/tw';

const WriteArticleRemind = tw.div`
  w-[50%] h-[150px] flex mt-[20px] gap-[15px] max-tablet:w-full max-tablet:justify-center
`;

export const WriteArticleImg = tw.img`
  w-[150px] h-[150px]
`;

export const WriteRightArea = tw.div`
  w-auto h-[150px] flex flex-col items-center justify-center gap-[20px] max-tablet:w-auto
`;

export const WriteText = tw.div`
  text-[15px] font-semibold text-left
`;

export const WriteButton = tw.button`
  w-[100px] h-[40px] rounded-[10px] bg-[#598BAF] text-white font-semibold [border:none]
  text-[15px] cursor-pointer
`;

export default WriteArticleRemind;
