import tw from '@/lib/tw';

const ChatRoom = tw.div<{ openChat?: boolean }>`
  z-[100] flex-col items-center w-[300px] h-[300px] [border-top-right-radius:10px]
  [border-top-left-radius:10px] [border-bottom:none] fixed bottom-[0px] right-[50px]
  bg-white [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
  max-tablet:right-[30px]
  ${(p) => (p.openChat ? 'flex' : 'hidden')}
`;

export const UnreadMessage = tw.div<{ active?: boolean }>`
  flex items-center justify-center w-[20px] h-[20px] rounded-[50%] [background-color:red]
  text-white text-[12px] font-medium fixed bottom-[85px] right-[120px] z-[300]
  max-tablet:bottom-[75px] max-tablet:right-[80px]
  ${(p) => (p.active ? '[animation:hithere_1.1s_ease_infinite]' : '[animation:none]')}
`;

export const ChatIcon = tw.img<{ openChat?: boolean; active?: boolean }>`
  fixed bottom-[50px] right-[80px] z-[100] w-[50px] h-[50px] cursor-pointer
  max-tablet:bottom-[40px] max-tablet:right-[40px]
  ${(p) => (p.openChat ? 'hidden' : 'block')}
  ${(p) => (p.active ? '[animation:hithere_1.1s_ease_infinite]' : '[animation:none]')}
`;

export const CloseIcon = tw.img`
  w-[15px] h-[15px] absolute right-[20px] cursor-pointer
`;

export const ChatRoomTitle = tw.div`
  flex items-center justify-center h-[40px]
  [background:linear-gradient(312deg,rgb(178,228,238)_0%,rgb(161,176,255)_100%)] text-black
  w-full text-[15px] relative [border-top-right-radius:10px] [border-top-left-radius:10px]
  font-medium tracking-[5px]
`;

export const MessagesDisplayArea = tw.div`
  flex flex-col overflow-y-scroll [overflow-wrap:break-word] h-[250px] w-full gap-[15px]
  pl-[1px] pr-[3px] pt-[10px] pb-[15px]
`;

export const MessageBox = tw.div`
  pl-[10px] flex w-auto h-[35px] rounded-[3px] items-center self-start shrink-0
`;

export const NameMessage = tw.div`
  w-full flex flex-col
`;

export const Name = tw.div`
  w-full text-[12px] font-medium text-[#616161] ml-[5px] text-left
`;

export const Message = tw.div`
  ml-[5px] pl-[10px] pr-[10px] rounded-[3px] h-[25px] flex items-center
  [overflow-wrap:break-word] [word-wrap:break-word] bg-[#D6ECF3] text-[14px]
`;

export const UserPhoto = tw.img`
  w-[30px] h-[30px] rounded-[50%] object-cover
`;

export const EnterArea = tw.div`
  w-full h-[50px] flex items-center gap-[10px] justify-between pl-[10px] pr-[10px]
  bg-[#D3D3D3] [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
`;

export const MessageInput = tw.input`
  w-[80%] h-[22px] rounded-[3px] [border:none] pl-[5px] text-[15px] [outline:none]
  [overflow-wrap:break-word]
`;

export const EnterMessageButton = tw.button`
  w-auto h-[20px] rounded-[2px] cursor-pointer [border:none]
`;

export default ChatRoom;
