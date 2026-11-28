import tw from '@/lib/tw';

export const FoundAsk = tw.div`
  w-full font-semibold text-[18px]
`;

export const CloseSearch = tw.img`
  absolute right-[20px] w-[18px] h-[18px] cursor-pointer
`;

export const InviteFriendInput = tw.input`
  [border-top:none] [border-right:none] [border-left:none] text-[16px] pl-[3px] w-[80%]
  [border-bottom:1px_solid_black] [outline:none] mt-[20px]
`;

export const InviteFriendBelowArea = tw.div<{ active?: boolean }>`
  flex-col items-center gap-[30px] justify-center w-full mt-[20px]
  ${(p) => (p.active ? 'flex' : 'hidden')}
`;

export const ConfirmSearchButton = tw.button`
  w-[30%] h-[35px] rounded-[8px] text-white [font-weight:550] text-[16px] [border:none] flex
  items-center justify-center cursor-pointer [text-shadow:1px_1px_2px_black]
  [background:linear-gradient(312deg,rgb(178,228,238)_0%,rgb(161,176,246)_100%)]
  max-tablet:w-[50%]
`;

const AddFriendButton = tw.img`
  w-[55px] h-[55px] cursor-pointer max-tablet:w-[35px] max-tablet:h-[35px]
  max-tablet-sm:w-[55px] max-tablet-sm:h-[55px]
`;

export default AddFriendButton;
