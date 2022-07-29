import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import Swal from 'sweetalert2';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  signOut,
} from 'firebase/auth';
import UserContext from '../UserContextComponent';
import { auth } from '../../utils/firebase-init';
import RWD_ICON from './rwd.const';
import SmallScreenNavBar, {
  HamburgerMenuLink, CreateScheduleWrapper, SmallLogOutButton, HamburgerProfileLink,
  ProfileBackground, SmallProfilePhoto, SmallNavIcon, SmallProfileName,
  SmallNavText, Menu, CloseIcon, SmallHeader, Background,
} from './RwdMenu';

const Header = styled.header`
  position:absolute;
  display:flex;
  justify-content:space-between;
  width:100vw;
  position:fixed;
  z-index:2000;
  top:0;
  height:${(props) => (props.active ? '60px' : '65px')};
  background-color:${(props) => (props.active ? 'rgba(255, 255, 255, 0.8)' : 'transparent')};
  box-shadow: ${(props) => (props.active ? '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);' : 'none')};
  @media screen and (max-width:800px){
  display:none;
}`;

const Logo = styled.div`
  width:150px;
  height:30px;
  font-weight:700;
  font-size:25px;
  margin-left:20px;
  color:${(props) => (props.active ? 'black' : 'white')};
  margin-top:${(props) => (props.active ? '15px' : '20px')};
  @media screen and (max-width:800px){
    width:auto;
    height:auto;
    font-size:20px;
    margin-left:10px;
    margin-top:10px;
    z-index:10;
    position:absolute;
}`;

const NavBar = styled.div`
  display:flex;
  align-items:center;
  gap:15px;
  width:500px;
  height:30px;
  color:${(props) => (props.active ? 'black' : 'white')};
  font-weight:600;
  margin-top:${(props) => (props.active ? '15px' : '25px')};
  @media screen and (max-width:800px){
    display:none;
}`;

const ProfilePageNav = styled.div`
  width:auto;
  padding:8px 10px;
  border-radius:10px;
  border:${(props) => (props.active ? '1px solid black' : '1px solid white;')};
  cursor:pointer;
`;

const StyleNavLink = styled(Link)`
  cursor:pointer;
  text-decoration:none;
  color:${(props) => (props.$active ? 'black' : 'white')};
  &:hover {
    border-bottom:${(props) => (props.$active ? '1.5px solid black' : '1.5px solid white')};
  }
  @media screen and (max-width:800px){
    font-size:20px;
    margin-left:10px;
    width:150px;
    position:absolute;
    margin-top:${(props) => (props.$active ? '8px' : '0px')};
}`;

const ProfileNavLink = styled(Link)`
  cursor:pointer;
  text-decoration:none;
  color:${(props) => (props.$active ? 'black' : 'white')};
  @media screen and (max-width:800px){
    font-size:20px;
    margin-left:10px;
    width:150px;
    position:absolute;
    margin-top:${(props) => (props.$active ? '8px' : '0px')};
}`;

function getBorderBottomByPathname(pathname, headerBackground) {
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
        <StyleNavLink $actived={headerBackground} to="/">
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
