import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useNavigate, Link } from 'react-router-dom';
import {
  signOut,
} from 'firebase/auth';
import UserContext from './UserContextComponent';
import WhiteMenuIcon from '../pages/images/menu_bar.jpg';
import BlackMenuIcon from '../pages/images/menu_black.png';
import CloseIcon from '../pages/images/close-1.png';
import UserPhotoSrc from '../pages/images/seal.png';
import Blog from '../pages/images/blog.png';
import Dish from '../pages/images/dish.png';
import Travel from '../pages/images/travel.png';
import VRsrc from '../pages/images/virtual-reality.png';
import Plan from '../pages/images/suitcase.png';
import {
  auth, Menu, SmallMenuCloseIcon, SmallScreenBackground, SmallScreenNavBar,
  HamburgerMenuLink, SmallLogOutButton, HamburgerProfileLink, SmallBarProfileBackground,
  SmallProfilePhoto, SmallNavIcon, SmallProfileName, SmallNavText,
} from './Header';
import MyArticle from '../pages/images/article.png';
import Attraction from '../pages/images/vacations.png';
import Favorite from '../pages/images/favorite.png';

const Header = styled.header`
position:absolute;
display:flex;
justify-content:space-between;
align-items:center;
width:100vw;
height:60px;
background-color:#a9a9a9;
@media screen and (max-width:800px){
  display:none;
}`;

const SmallGreyHeader = styled.div`
display:none;
@media screen and (max-width:800px){
  display:flex;
  justify-content:space-between;
  align-items:center;
  width:100vw;
  position:fixed;
  top:0;
  z-index:1000;
  height:${(props) => (props.active ? '60px' : '65px')};
  background-color:#a9a9a9;
  box-shadow: ${(props) => (props.active ? '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);' : 'none')};
}`;

const Logo = styled.div`
width:150px;
height:30px;
font-weight:700;
font-size:25px;
margin-left:20px;
color:white;
margin-top:0px;
@media screen and (max-width:800px){
  width:auto;
  height:100%;
  font-size:20px;
  z-index:10;
  position:absolute;
  top:20px;
}`;

const NavBar = styled.div`
display:flex;
align-items:center;
gap:15px;
width:500px;
height:30px;
color:${(props) => (props.active ? 'black' : 'white')};
font-weight:600;
margin-top:0px;
@media screen and (max-width:800px){
  display:none;
}`;

const ProfilePageNav = styled.div`
width:auto;
padding:8px 10px;
border-radius:10px;
border:1px solid white;
cursor:pointer;
`;

const StyleNavLink = styled(Link)`
cursor:pointer;
text-decoration:none;
color:white;
&:hover {
  border-bottom:1.5px solid white;
}
`;

const ProfileNavLink = styled(Link)`
cursor:pointer;
text-decoration:none;
color:white;
`;

function GreyHeaderComponent() {
  const user = useContext(UserContext);
  const [clicked, setClicked] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false);
  const navigate = useNavigate();

  function signOutFunction() {
    signOut(auth).then(() => {
      alert('您已登出囉～');
      navigate({ pathname: '/' });
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => { setHeaderBackground(document.body.scrollTop > 200 || document.documentElement.scrollTop > 200); });
    }
  }, []);
  // const user = useContext(UserContext);
  return (
    <>
      <Header active={headerBackground}>
        <ProfileNavLink to="/">
          <Logo active={headerBackground}>Bon Voyage</Logo>
        </ProfileNavLink>
        <NavBar active={headerBackground}>
          <StyleNavLink active={headerBackground} to="/vr-page">
            VR專區
          </StyleNavLink>
          <StyleNavLink active={headerBackground} to="/city?lat=25.0329694&lng=121.5654177&city=台北&option=all">
            熱門景點
          </StyleNavLink>
          <StyleNavLink active={headerBackground} to="/all-articles">
            熱門遊記
          </StyleNavLink>
          <StyleNavLink active={headerBackground} to="/category?lat=25.0498583&lng=121.5172606&category=food">
            美食特搜
          </StyleNavLink>
          <StyleNavLink active={headerBackground} to="/my-schedules">
            行程規劃
          </StyleNavLink>
          <ProfileNavLink active={headerBackground} to="/profile">
            <ProfilePageNav active={headerBackground}>個人頁面</ProfilePageNav>
          </ProfileNavLink>
        </NavBar>
      </Header>
      <SmallGreyHeader active={headerBackground}>
        <Menu
          style={{ top: 20 }}
          src={headerBackground ? BlackMenuIcon : WhiteMenuIcon}
          active={clicked}
          onClick={() => setClicked(true)}
        />
        <StyleNavLink active={headerBackground} to="/">
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
            <HamburgerMenuLink to="/choose-date">
              <SmallNavIcon src={Plan} />
              <SmallNavText>行程規劃</SmallNavText>
            </HamburgerMenuLink>
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
      </SmallGreyHeader>
    </>
  );
}

export default GreyHeaderComponent;
