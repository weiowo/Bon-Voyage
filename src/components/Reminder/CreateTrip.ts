import { Link } from '@/lib/router';
import tw from '@/lib/tw';

const RemindWrapper = tw.div`
  w-[26vw] h-[180px] flex gap-[20px] max-[1181px]:w-full max-[1181px]:h-[150px]
  max-[1001px]:w-full max-[749px]:justify-center max-[749px]:w-full max-[481px]:h-[130px]
`;

export const StyledBlackLink = tw(Link)`
  cursor-pointer [text-decoration:none] text-black [border:none]
`;

export const ClickAndAdd = tw.div`
  w-[80px] h-auto text-[15px] bg-white absolute bottom-[35px] font-semibold left-[10px]
  [border:1.5px_solid_black] rounded-[5px] cursor-pointer max-[401px]:text-[13px]
  max-[401px]:left-[5px]
`;

export const RemindText = tw.div`
  w-full [font-weight:550] text-[15px] text-left max-[1181px]:text-[13px]
  max-[401px]:text-[13px]
`;

export const RemindIcon = tw.img`
  w-[180px] h-[180px] max-[1181px]:w-[150px] max-[1181px]:h-[150px] max-[1001px]:w-[140px]
  max-[1001px]:h-[140px] max-[481px]:w-[130px] max-[481px]:h-[130px]
`;

export const SuitcaseIcon = tw.img`
  w-[100px] h-[100px] max-[1001px]:w-[95px] max-[1001px]:h-[95px] max-[481px]:h-[90px]
  max-[481px]:w-[90px]
`;

export const RemindRightPart = tw.div`
  w-[70%] h-[180px] flex flex-col justify-between relative max-[1181px]:h-[150px]
  max-[1001px]:h-[140px] max-[1001px]:w-auto max-[481px]:h-[130px]
`;

export default RemindWrapper;
