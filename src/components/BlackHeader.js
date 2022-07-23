import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  signOut,
} from 'firebase/auth';
import UserContext from './UserContextComponent';
import BlackMenuIcon from '../pages/images/menu_black.png';
import CloseIcon from '../pages/images/close-1.png';
import UserPhotoSrc from '../pages/images/seal.png';
import Blog from '../pages/images/blog.png';
import Dish from '../pages/images/dish.png';
import Travel from '../pages/images/travel.png';
import VRsrc from '../pages/images/virtual-reality.png';
import Plan from '../pages/images/suitcase.png';
import {
  auth, Menu, SmallMenuCloseIcon, SmallHeader, SmallScreenBackground, SmallScreenNavBar,
  HamburgerMenuLink, SmallLogOutButton, HamburgerProfileLink, SmallBarProfileBackground,
  SmallProfilePhoto, SmallNavIcon, SmallProfileName, SmallNavText, CreateScheduleWrapper,
} from './Header';
import MyArticle from '../pages/images/article.png';
import Attraction from '../pages/images/vacations.png';
import Favorite from '../pages/images/favorite.png';

const Header = styled.header`
position:absolute;
display:flex;
justify-content:space-between;
width:100vw;
position:fixed;
z-index:500;
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
color:black;
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
border:1px solid black;
cursor:pointer;
`;

const StyleNavLink = styled(Link)`
cursor:pointer;
text-decoration:none;
color:black;
&:hover {
  border-bottom:1.5px solid black;
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
color:black;
@media screen and (max-width:800px){
  font-size:20px;
  margin-left:10px;
  width:150px;
  position:absolute;
  margin-top:${(props) => (props.$active ? '8px' : '0px')};
}`;

function BlackHeaderComponent() {
  const user = useContext(UserContext);
  const [clicked, setClicked] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false);
  const navigate = useNavigate();
  const currentUrl = useLocation();

  function signOutFunction() {
    signOut(auth).then(() => {
      alert('您已登出囉～');
      navigate({ pathname: '/' });
    }).catch((error) => {
      console.log(error);
    });
  }

  function CheckLoginBeforeCreateSchedule() {
    if (!user.uid) {
      alert('請先登入唷～');
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
            style={{ borderBottom: currentUrl.pathname === '/vr-page' ? '1.5px solid black' : '' }}
            $active={headerBackground}
            to="/vr-page"
          >
            VR專區
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/city' ? '1.5px solid black' : '' }}
            $active={headerBackground}
            to="/city?lat=25.0329694&lng=121.5654177&city=台北&option=all"
          >
            熱門景點
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/all-articles' ? '1.5px solid black' : '' }}
            $active={headerBackground}
            to="/all-articles"
          >
            熱門遊記
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/category' ? '1.5px solid black' : '' }}
            $active={headerBackground}
            to="/category?lat=25.0498583&lng=121.5172606&category=food"
          >
            美食特搜
          </StyleNavLink>
          <StyleNavLink
            style={{ borderBottom: currentUrl.pathname === '/my-schedules' ? '1.5px solid black' : '' }}
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
          src={BlackMenuIcon}
          active={clicked}
          onClick={() => setClicked(true)}
        />
        <StyleNavLink $active={headerBackground} to="/">
          <Logo active={headerBackground}>Bon Voyage</Logo>
        </StyleNavLink>
        <SmallScreenBackground active={clicked}>
          <SmallScreenNavBar active={clicked}>
            <SmallBarProfileBackground>
              <HamburgerProfileLink to="/profile">
                <SmallProfilePhoto src={user.photoURL || UserPhotoSrc} />
                <SmallProfileName>{user.displayName || '您尚未登入唷'}</SmallProfileName>
              </HamburgerProfileLink>
            </SmallBarProfileBackground>
            <CreateScheduleWrapper onClick={() => CheckLoginBeforeCreateSchedule()}>
              <SmallNavIcon src={Plan} />
              <SmallNavText>行程規劃</SmallNavText>
            </CreateScheduleWrapper>
            <HamburgerMenuLink to="/vr-page">
              <SmallNavIcon src={VRsrc} />
              <SmallNavText>VR 專區</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/city?lat=25.0329694&lng=121.5654177&city=台北&option=all">
              <SmallNavIcon src={Attraction} />
              <SmallNavText>熱門景點</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/all-articles">
              <SmallNavIcon src={Blog} />
              <SmallNavText>熱門遊記</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/category?lat=25.0498583&lng=121.5172606&category=food">
              <SmallNavIcon src={Dish} />
              <SmallNavText>美食特搜</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/my-schedules">
              <SmallNavIcon src={Travel} />
              <SmallNavText>我的行程</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/my-articles">
              <SmallNavIcon src={MyArticle} />
              <SmallNavText>我的文章</SmallNavText>
            </HamburgerMenuLink>
            <HamburgerMenuLink to="/my-favorites">
              <SmallNavIcon src={Favorite} />
              <SmallNavText>我的收藏</SmallNavText>
            </HamburgerMenuLink>
            <SmallLogOutButton
              onClick={() => {
                signOutFunction();
              }}
            >
              登出
            </SmallLogOutButton>
            <SmallMenuCloseIcon
              src={CloseIcon}
              active={clicked}
              onClick={() => setClicked(false)}
            />
          </SmallScreenNavBar>
        </SmallScreenBackground>
      </SmallHeader>
    </>
  );
}

export default BlackHeaderComponent;
