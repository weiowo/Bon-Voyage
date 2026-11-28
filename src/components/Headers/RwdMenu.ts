import { Link } from '@/lib/router';
import tw from '@/lib/tw';

const SmallScreenNavBar = tw.div<{ active?: boolean }>`
  hidden max-[801px]:fixed max-[801px]:top-[0px] max-[801px]:flex-col
  max-[801px]:items-center max-[801px]:w-[45vw] max-[801px]:h-[100vh] max-[801px]:gap-[6px]
  max-[801px]:right-[0] max-[801px]:z-[500] max-[801px]:bg-white
  max-[801px]:[box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
  max-[501px]:w-[60vw]
  ${(p) => (p.active ? 'max-[801px]:flex' : 'max-[801px]:hidden')}
`;

export const HamburgerMenuLink = tw(Link)`
  [text-decoration:none] flex pl-[30px] pr-[20px] items-center [justify-content:left] w-full
  h-[60px] gap-[15px] text-black hover:bg-[#EBECF0]
`;

export const CreateScheduleWrapper = tw.div`
  [text-decoration:none] cursor-pointer flex pl-[30px] pr-[20px] items-center
  [justify-content:left] w-full h-[60px] gap-[15px] text-black hover:bg-[#EBECF0]
`;

export const SmallLogOutButton = tw.div`
  w-[90%] h-[40px] mb-[10px] [border:1.5px_solid_grey] text-black rounded-[10px]
  font-semibold flex text-[14px] justify-center items-center absolute cursor-pointer
  bottom-[0] hover:bg-[#EBECF0]
`;

export const HamburgerProfileLink = tw(Link)`
  [text-decoration:none] flex pl-[30px] pr-[20px] items-center [justify-content:left] w-full
  h-[60px] gap-[15px] text-black
`;

export const ProfileBackground = tw.div`
  h-[90px] w-full flex items-center justify-center gap-[10px]
  [background:linear-gradient(312deg,rgb(178,228,238)_0%,rgb(161,176,246)_100%)]
`;

export const SmallProfilePhoto = tw.img`
  w-[42px] h-[42px] rounded-[50%] object-cover
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
`;

export const SmallNavIcon = tw.img`
  w-[30px] h-[30px] object-cover
`;

export const SmallProfileName = tw.div`
  w-full h-[30px] flex font-semibold [justify-content:left] items-center
`;

export const SmallNavText = tw.div`
  w-full h-[30px] flex font-medium [justify-content:left] items-center text-[14px]
`;

export const Menu = tw.img<{ active?: boolean }>`
  hidden max-[801px]:w-[23px] max-[801px]:h-[23px] max-[801px]:fixed max-[801px]:top-[15px]
  max-[801px]:right-[15px] max-[801px]:cursor-pointer
  ${(p) => (p.active ? 'max-[801px]:hidden' : 'max-[801px]:block')}
`;

export const CloseIcon = tw.img<{ active?: boolean }>`
  hidden max-[801px]:w-[15px] max-[801px]:h-[15px] max-[801px]:absolute
  max-[801px]:top-[18px] max-[801px]:right-[18px] max-[801px]:cursor-pointer
  max-[801px]:z-[1000]
  ${(p) => (p.active ? 'max-[801px]:block' : 'max-[801px]:hidden')}
`;

export const SmallHeader = tw.div<{ active?: boolean }>`
  hidden max-[801px]:flex max-[801px]:justify-between max-[801px]:w-[100vw]
  max-[801px]:fixed max-[801px]:top-[0] max-[801px]:z-[1000]
  ${(p) => (p.active ? 'max-[801px]:h-[60px]' : 'max-[801px]:h-[65px]')}
  ${(p) => (p.active ? 'max-[801px]:bg-[rgba(255,255,255,0.8)]' : 'max-[801px]:bg-transparent')}
  ${(p) => (p.active ? 'max-[801px]:[box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]' : 'max-[801px]:[box-shadow:none]')}
`;

export const Background = tw.div<{ active?: boolean }>`
  hidden max-[801px]:fixed max-[801px]:top-[0px] max-[801px]:[justify-content:right]
  max-[801px]:w-[100vw] max-[801px]:h-[100vh] max-[801px]:bg-[rgb(0,0,0,0.5)]
  max-[801px]:z-[1000]
  ${(p) => (p.active ? 'max-[801px]:flex' : 'max-[801px]:hidden')}
`;

export default SmallScreenNavBar;
