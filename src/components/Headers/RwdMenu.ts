import { Link } from '@/lib/router';
import tw from '@/lib/tw';

const SmallScreenNavBar = tw.div<{ active?: boolean }>`
  hidden max-tablet:fixed max-tablet:top-[0px] max-tablet:flex-col
  max-tablet:items-center max-tablet:w-[45vw] max-tablet:h-[100vh] max-tablet:gap-[6px]
  max-tablet:right-[0] max-tablet:z-[500] max-tablet:bg-white
  max-tablet:[box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
  max-mobile:w-[60vw]
  ${(p) => (p.active ? 'max-tablet:flex' : 'max-tablet:hidden')}
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
  hidden max-tablet:w-[23px] max-tablet:h-[23px] max-tablet:fixed max-tablet:top-[15px]
  max-tablet:right-[15px] max-tablet:cursor-pointer
  ${(p) => (p.active ? 'max-tablet:hidden' : 'max-tablet:block')}
`;

export const CloseIcon = tw.img<{ active?: boolean }>`
  hidden max-tablet:w-[15px] max-tablet:h-[15px] max-tablet:absolute
  max-tablet:top-[18px] max-tablet:right-[18px] max-tablet:cursor-pointer
  max-tablet:z-[1000]
  ${(p) => (p.active ? 'max-tablet:block' : 'max-tablet:hidden')}
`;

export const SmallHeader = tw.div<{ active?: boolean }>`
  hidden max-tablet:flex max-tablet:justify-between max-tablet:w-full
  max-tablet:fixed max-tablet:top-[0] max-tablet:z-[1000]
  ${(p) => (p.active ? 'max-tablet:h-[60px]' : 'max-tablet:h-[65px]')}
  ${(p) => (p.active ? 'max-tablet:bg-[rgba(255,255,255,0.8)]' : 'max-tablet:bg-transparent')}
  ${(p) => (p.active ? 'max-tablet:[box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]' : 'max-tablet:[box-shadow:none]')}
`;

export const Background = tw.div<{ active?: boolean }>`
  hidden max-tablet:fixed max-tablet:top-[0px] max-tablet:[justify-content:right]
  max-tablet:w-full max-tablet:h-[100vh] max-tablet:bg-[rgb(0,0,0,0.5)]
  max-tablet:z-[1000]
  ${(p) => (p.active ? 'max-tablet:flex' : 'max-tablet:hidden')}
`;

export default SmallScreenNavBar;
