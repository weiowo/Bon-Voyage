import tw from '@/lib/tw';

const DeleteAsk = tw.div`
  w-full flex items-center justify-center font-semibold text-[20px] mt-[30px]
`;

export const DeleteButtonArea = tw.div`
  w-full flex justify-center items-center gap-[20px]
`;

export const ConfirmDeleteButton = tw.button`
  w-[30%] h-[30px] bg-[#e7f5fe] [font-weight:550] [border:none] rounded-[10px]
  cursor-pointer text-[16px]
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
`;

export const NoDeleteButton = tw.button`
  w-[30%] h-[30px] bg-[#E6D1F2] [font-weight:550] [border:none] rounded-[10px] text-[16px]
  cursor-pointer [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
`;

export const DeleteModalTitle = tw.div`
  flex items-center justify-center text-[20px] absolute text-white
  [text-shadow:1px_1px_2px_black] top-[0] font-medium w-full h-[40px]
  [border-top-right-radius:inherit] [border-top-left-radius:inherit]
  [background:linear-gradient(312deg,rgb(178,228,238)_0%,rgb(161,176,246)_100%)]
`;

export default DeleteAsk;
