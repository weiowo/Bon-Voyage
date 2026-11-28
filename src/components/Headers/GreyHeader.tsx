import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from '@/lib/router';
import Swal from 'sweetalert2';
import {
  signOut,
} from 'firebase/auth';
import tw from '@/lib/tw';
import UserContext from '../UserContextComponent';
import RWD_ICON from './rwd.const';
import SmallScreenNavBar, {
  HamburgerMenuLink, CreateScheduleWrapper, SmallLogOutButton, HamburgerProfileLink,
  ProfileBackground, SmallProfilePhoto, SmallNavIcon, SmallProfileName,
  SmallNavText, Menu, CloseIcon, Background,
} from './RwdMenu';
import { auth } from '../../utils/firebase-init';

const Header = tw.header`
  absolute flex justify-between items-center w-[100vw] h-[60px] bg-[#a9a9a9]
  max-tablet:hidden
`;

const SmallGreyHeader = tw.div<{ active?: boolean }>`
  hidden max-tablet:flex max-tablet:justify-between max-tablet:items-center
  max-tablet:w-[100vw] max-tablet:fixed max-tablet:top-[0] max-tablet:z-[1000]
  max-tablet:bg-[#a9a9a9]
  ${(p) => (p.active ? 'max-tablet:h-[60px]' : 'max-tablet:h-[65px]')}
  ${(p) => (p.active ? 'max-tablet:[box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]' : 'max-tablet:[box-shadow:none]')}
`;

const Logo = tw.div`
  w-[150px] h-[30px] font-bold text-[25px] ml-[20px] text-white mt-[0px] max-tablet:w-auto
  max-tablet:h-full max-tablet:text-[20px] max-tablet:z-[10] max-tablet:absolute
  max-tablet:top-[20px]
`;

const NavBar = tw.div<{ active?: boolean }>`
  flex items-center gap-[15px] w-[500px] h-[30px] font-semibold mt-[0px] max-tablet:hidden
  ${(p) => (p.active ? 'text-black' : 'text-white')}
`;

const ProfilePageNav = tw.div`
  w-auto p-[8px_10px] rounded-[10px] [border:1px_solid_white] cursor-pointer
`;

const StyleNavLink = tw(Link)`
  cursor-pointer [text-decoration:none] text-white hover:[border-bottom:1.5px_solid_white]
`;

const ProfileNavLink = tw(Link)`
  cursor-pointer [text-decoration:none] text-white
`;

function GreyHeaderComponent() {
  const user = useContext(UserContext);
  const [clicked, setClicked] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false);
  const navigate = useNavigate();

  function signOutFunction() {
    signOut(auth).then(() => {
      navigate({ pathname: '/' });
    }).catch((error) => {
      Swal.fire({
        title: '發生了一些錯誤～',
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

  const currentUrl = useLocation();
  return (
    <>
      <Header>
        <ProfileNavLink to="/">
          <Logo>Bon Voyage</Logo>
        </ProfileNavLink>
        <NavBar active={headerBackground}>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/vr-page' ? '1.5px solid white' : '' }}
            to="/vr-page"
          >
            VR專區
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/city' ? '1.5px solid white' : '' }}
            to="/city?lat=25.0329694&lng=121.5654177&city=台北&option=all"
          >
            熱門景點
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/all-articles' ? '1.5px solid white' : '' }}
            to="/all-articles"
          >
            熱門遊記
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/category' ? '1.5px solid white' : '' }}
            to="/category?lat=25.0498583&lng=121.5172606&category=food"
          >
            美食特搜
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/my-schedules' ? '1.5px solid white' : '' }}
            to="/my-schedules"
          >
            行程規劃
          </StyleNavLink>
          <ProfileNavLink to="/profile">
            <ProfilePageNav>個人頁面</ProfilePageNav>
          </ProfileNavLink>
        </NavBar>
      </Header>
      <SmallGreyHeader active={headerBackground}>
        <Menu
          style={{ top: 20 }}
          src={headerBackground ? RWD_ICON?.BLACK_MENU_ICON : RWD_ICON?.WHITE_MENU_ICON}
          active={clicked}
          onClick={() => setClicked(true)}
        />
        <StyleNavLink to="/">
          <Logo>Bon Voyage</Logo>
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
      </SmallGreyHeader>
    </>
  );
}

export default GreyHeaderComponent;
