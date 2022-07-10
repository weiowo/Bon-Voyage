// import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// import UserContext from './UserContextComponent';

const Header = styled.header`
position:absolute;
display:flex;
justify-content:space-between;
align-items:center;
width:100vw;
height:60px;
background-color:#a9a9a9;
`;

const Logo = styled.div`
width:150px;
height:30px;
color:white;
font-weight:700;
font-size:25px;
margin-left:10px;
`;

const NavBar = styled.div`
display:flex;
align-items:center;
gap:15px;
width:500px;
height:30px;
color:white;
font-weight:600;
`;

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
`;

function GreyHeaderComponent() {
  // const user = useContext(UserContext);
  return (
    <Header>
      <StyleNavLink to="/">
        <Logo>Bon Voyage</Logo>
      </StyleNavLink>
      <NavBar>
        <StyleNavLink to="/vr-page">
          VR專區
        </StyleNavLink>
        <div style={{ cursor: 'pointer' }}>熱門景點</div>
        <div style={{ cursor: 'pointer' }}>國內旅遊</div>
        <StyleNavLink to="/all-articles">
          熱門遊記
        </StyleNavLink>
        <StyleNavLink to="/my-schedules">
          行程規劃
        </StyleNavLink>
        <StyleNavLink to="/profile">
          <ProfilePageNav>個人頁面</ProfilePageNav>
        </StyleNavLink>
      </NavBar>
    </Header>
  );
}

export default GreyHeaderComponent;
