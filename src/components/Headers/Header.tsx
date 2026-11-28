import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, Link, useLocation } from '@/lib/router';
import {
  signOut,
} from 'firebase/auth';
import tw from '@/lib/tw';
import UserContext from '../UserContextComponent';
import { auth } from '../../utils/firebase-init';
import RWD_ICON from './rwd.const';
import SmallScreenNavBar, {
  HamburgerMenuLink, CreateScheduleWrapper, SmallLogOutButton, HamburgerProfileLink,
  ProfileBackground, SmallProfilePhoto, SmallNavIcon, SmallProfileName,
  SmallNavText, Menu, CloseIcon, SmallHeader, Background,
} from './RwdMenu';

const Header = tw.header<{ active?: boolean }>`
  flex justify-between w-[100vw] fixed z-[2000] top-[0] max-tablet:hidden
  ${(p) => (p.active ? 'h-[60px]' : 'h-[65px]')}
  ${(p) => (p.active ? 'bg-[rgba(255,255,255,0.8)]' : 'bg-transparent')}
  ${(p) => (p.active ? '[box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]' : '[box-shadow:none]')}
`;

const Logo = tw.div<{ active?: boolean }>`
  w-[150px] h-[30px] font-bold text-[25px] ml-[20px] max-tablet:w-auto max-tablet:h-auto
  max-tablet:text-[20px] max-tablet:ml-[10px] max-tablet:mt-[10px] max-tablet:z-[10]
  max-tablet:absolute
  ${(p) => (p.active ? 'text-black' : 'text-white')}
  ${(p) => (p.active ? 'mt-[15px]' : 'mt-[20px]')}
`;

const NavBar = tw.div<{ active?: boolean }>`
  flex items-center gap-[15px] w-[500px] h-[30px] font-semibold max-tablet:hidden
  ${(p) => (p.active ? 'text-black' : 'text-white')}
  ${(p) => (p.active ? 'mt-[15px]' : 'mt-[25px]')}
`;

const ProfilePageNav = tw.div<{ active?: boolean }>`
  w-auto p-[8px_10px] rounded-[10px] cursor-pointer
  ${(p) => (p.active ? '[border:1px_solid_black]' : '[border:1px_solid_white]')}
`;

const StyleNavLink = tw(Link)<{ $active?: boolean }>`
  cursor-pointer [text-decoration:none] max-tablet:text-[20px] max-tablet:ml-[10px]
  max-tablet:w-[150px] max-tablet:absolute
  ${(p) => (p.$active ? 'text-black' : 'text-white')}
  ${(p) => (p.$active ? 'hover:[border-bottom:1.5px_solid_black]' : 'hover:[border-bottom:1.5px_solid_white]')}
  ${(p) => (p.$active ? 'max-tablet:mt-[8px]' : 'max-tablet:mt-[0px]')}
`;

const ProfileNavLink = tw(Link)<{ $active?: boolean }>`
  cursor-pointer [text-decoration:none] max-tablet:text-[20px] max-tablet:ml-[10px]
  max-tablet:w-[150px] max-tablet:absolute
  ${(p) => (p.$active ? 'text-black' : 'text-white')}
  ${(p) => (p.$active ? 'max-tablet:mt-[8px]' : 'max-tablet:mt-[0px]')}
`;

function getBorderBottomByPathname(pathname: string, headerBackground: boolean) {
  if (pathname === '/all-articles' && headerBackground) {
    return '1.5px solid black';
  } if (pathname === '/all-articles') {
    return '1.5px solid white';
  }
  return undefined;
}

function HeaderComponent() {
  const user = useContext(UserContext);
  const [clicked, setClicked] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false);
  const navigate = useNavigate();
  const currentUrl = useLocation();

  function signOutFunction() {
    signOut(auth).then(() => {
      navigate({ pathname: '/' });
    }).catch((error) => {
      Swal.fire({
        title: '發生了一點錯誤～',
        text: error,
        icon: 'warning',
      });
    });
  }

  function CheckLoginBeforeCreateSchedule() {
    if (!user.uid) {
      Swal.fire({
        title: '請先登入唷！',
        text: '您即將被導引至登入頁面~',
        icon: 'warning',
      });
      navigate({ pathname: '/profile' });
    } else if (user.uid) {
      navigate({ pathname: '/choose-date' });
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => { setHeaderBackground(document.body.scrollTop > 200 || document.documentElement.scrollTop > 200); });
    }
  }, []);

  return (
    <>
      <Header active={headerBackground}>
        <ProfileNavLink to="/">
          <Logo active={headerBackground}>Bon Voyage</Logo>
        </ProfileNavLink>
        <NavBar active={headerBackground}>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/vr-page' ? '1.5px solid white' : '' }}
            $active={headerBackground}
            to="/vr-page"
          >
            VR專區
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/city' ? '1.5px solid white' : '' }}
            $active={headerBackground}
            to="/city?lat=25.0329694&lng=121.5654177&city=台北&option=all"
          >
            熱門景點
          </StyleNavLink>
          <StyleNavLink
            style={{
              borderBottom: getBorderBottomByPathname(currentUrl.pathname, headerBackground),
            }}
            $active={headerBackground}
            to="/all-articles"
          >
            熱門遊記
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/category' ? '1.5px solid white' : '' }}
            $active={headerBackground}
            to="/category?lat=25.0498583&lng=121.5172606&category=food"
          >
            美食特搜
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/my-schedules' ? '1.5px solid white' : '' }}
            $active={headerBackground}
            to="/my-schedules"
          >
            行程規劃
          </StyleNavLink>
          <ProfileNavLink $active={headerBackground} to="/profile">
            <ProfilePageNav active={headerBackground}>個人頁面</ProfilePageNav>
          </ProfileNavLink>
        </NavBar>
      </Header>
      <SmallHeader active={headerBackground}>
        <Menu
          src={headerBackground ? RWD_ICON?.BLACK_MENU_ICON : RWD_ICON?.WHITE_MENU_ICON}
          active={clicked}
          onClick={() => setClicked(true)}
        />
        <StyleNavLink to="/">
          <Logo active={headerBackground}>Bon Voyage</Logo>
        </StyleNavLink>
        <Background active={clicked}>
          <SmallScreenNavBar active={clicked}>
            <ProfileBackground>
              <HamburgerProfileLink to="/profile">
                <SmallProfilePhoto src={user.photoURL || RWD_ICON?.USER_IMG} />
                <SmallProfileName>{user.displayName || '您尚未登入唷'}</SmallProfileName>
              </HamburgerProfileLink>
            </ProfileBackground>
            <CreateScheduleWrapper onClick={() => CheckLoginBeforeCreateSchedule()}>
              <SmallNavIcon src={RWD_ICON?.PLAN_ICON} />
              <SmallNavText>行程規劃</SmallNavText>
            </CreateScheduleWrapper>
            <HamburgerMenuLink to="/vr-page">
              <SmallNavIcon src={RWD_ICON?.VR_ICON} />
              <SmallNavText>VR 專區</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/city?lat=25.0329694&lng=121.5654177&city=台北&option=all">
              <SmallNavIcon src={RWD_ICON?.ATTRACTION_ICON} />
              <SmallNavText>熱門景點</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/all-articles">
              <SmallNavIcon src={RWD_ICON?.BLOG_ICON} />
              <SmallNavText>熱門遊記</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/category?lat=25.0498583&lng=121.5172606&category=food">
              <SmallNavIcon src={RWD_ICON?.DISH_ICON} />
              <SmallNavText>美食特搜</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/my-schedules">
              <SmallNavIcon src={RWD_ICON?.TRIP_ICON} />
              <SmallNavText>我的行程</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/my-articles">
              <SmallNavIcon src={RWD_ICON?.ARTICLE_ICON} />
              <SmallNavText>我的文章</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/my-favorites">
              <SmallNavIcon src={RWD_ICON?.FAVO_ICON} />
              <SmallNavText>我的收藏</SmallNavText>
            </HamburgerMenuLink>
            <SmallLogOutButton
              onClick={() => {
                signOutFunction();
              }}
            >
              登出
            </SmallLogOutButton>
            <CloseIcon
              src={RWD_ICON?.CLOSE_ICON}
              active={clicked}
              onClick={() => setClicked(false)}
            />
          </SmallScreenNavBar>
        </Background>
      </SmallHeader>
    </>
  );
}

export default HeaderComponent;

// HeaderComponent.propTypes = {
//   user: PropTypes.func.isRequired,
// };
