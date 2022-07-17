import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useNavigate, Link } from 'react-router-dom';
import {
  signOut, getAuth,
} from 'firebase/auth';
import { app } from '../utils/firebase-init';
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
import MyArticle from '../pages/images/article.png';
import Attraction from '../pages/images/vacations.png';
import Favorite from '../pages/images/favorite.png';

export const auth = getAuth(app);

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

export const Menu = styled.img`
display:none;
@media screen and (max-width:800px){
  display:block;
  width:23px;
  height:23px;
  position:fixed;
  top:15px;
  right:15px;
  cursor:pointer;
  display:${(props) => (props.active ? 'none' : 'block')};
}`;

export const SmallMenuCloseIcon = styled.img`
display:none;
@media screen and (max-width:800px){
  width:15px;
  height:15px;
  position:absolute;
  top:18px;
  right:18px;
  cursor:pointer;
  z-index:1000;
  display:${(props) => (props.active ? 'block' : 'none')};
}`;

export const SmallHeader = styled.div`
display:none;
@media screen and (max-width:800px){
  display:flex;
  justify-content:space-between;
  width:100vw;
  position:fixed;
  top:0;
  z-index:1000;
  height:${(props) => (props.active ? '60px' : '65px')};
  background-color:${(props) => (props.active ? 'rgba(255, 255, 255, 0.8)' : 'transparent')};
  box-shadow: ${(props) => (props.active ? '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);' : 'none')};
}`;

export const SmallScreenBackground = styled.div`
display:none;
@media screen and (max-width:800px){
  position:fixed;
  top:0px;
  display:flex;
  justify-content:right;
  width:100vw;
  height:100vh;
  background-color: rgb(0, 0, 0, 0.5);
  z-index:1000;
  display:${(props) => (props.active ? 'flex' : 'none')};
}`;

export const SmallScreenNavBar = styled.div`
display:none;
@media screen and (max-width:800px){
  position:fixed;
  top:0px;
  display:flex;
  flex-direction:column;
  align-items:center;
  width:45vw;
  height:100vh;
  gap:6px;
  right:0;
  z-index:500;
  background-color:white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  display:${(props) => (props.active ? 'flex' : 'none')};
}
@media screen and (max-width:500px){
  width:60vw;
}
`;

const StyleNavLink = styled(Link)`
cursor:pointer;
text-decoration:none;
color:${(props) => (props.active ? 'black' : 'white')};
&:hover {
  border-bottom:${(props) => (props.active ? '1.5px solid black' : '1.5px solid white')};
}
@media screen and (max-width:800px){
  font-size:20px;
  margin-left:10px;
  width:150px;
  position:absolute;
  margin-top:${(props) => (props.active ? '8px' : '0px')};
}`;

const ProfileNavLink = styled(Link)`
cursor:pointer;
text-decoration:none;
color:${(props) => (props.active ? 'black' : 'white')};
@media screen and (max-width:800px){
  font-size:20px;
  margin-left:10px;
  width:150px;
  position:absolute;
  margin-top:${(props) => (props.active ? '8px' : '0px')};
}`;

export const HamburgerMenuLink = styled(Link)`
text-decoration:none;
display:flex;
padding-left:30px;
padding-right:20px;
align-items:center;
justify-content:left;
width:100%;
height:60px;
gap:15px;
color:black;
&:hover {
  background-color:#EBECF0;
}`;

export const SmallLogOutButton = styled.div`
width:90%;
height:40px;
margin-bottom:10px;
border:1.5px solid grey;
color:black;
border-radius:10px;
font-weight:600;
display:flex;
font-size:14px;
justify-content:center;
align-items:center;
position:absolute;
cursor:pointer;
bottom:0;
&:hover {
  background-color:#EBECF0;
}`;

export const HamburgerProfileLink = styled(Link)`
text-decoration:none;
display:flex;
padding-left:30px;
padding-right:20px;
align-items:center;
justify-content:left;
width:100%;
height:60px;
gap:15px;
color:black;
`;

export const SmallBarProfileBackground = styled.div`
height:90px;
width:100%;
display:flex;
align-items:center;
justify-content:center;
gap:10px;
background: linear-gradient(
  312deg,
  rgb(178, 228, 238) 0%,
  rgb(161, 176, 246) 100%
);
`;

export const SmallProfilePhoto = styled.img`
width:42px;
height:42px;
border-radius:50%;
object-fit:cover;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

export const SmallNavIcon = styled.img`
width:30px;
height:30px;
object-fit:cover;
`;

export const SmallProfileName = styled.div`
width:100%;
height:30px;
display:flex;
font-weight:600;
justify-content:left;
align-items:center;
`;

export const SmallNavText = styled.div`
width:100%;
height:30px;
display:flex;
font-weight:500;
justify-content:left;
align-items:center;
font-size:14px;
`;

function HeaderComponent() {
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
      <SmallHeader active={headerBackground}>
        <Menu
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
      </SmallHeader>
    </>
  );
}

export default HeaderComponent;

// HeaderComponent.propTypes = {
//   user: PropTypes.func.isRequired,
// };
