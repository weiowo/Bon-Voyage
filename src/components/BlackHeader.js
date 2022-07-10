import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import UserContext from './UserContextComponent';

const Header = styled.header`
position:absolute;
display:flex;
justify-content:space-between;
width:100vw;
height:30px;
z-index:3;
`;

const Logo = styled.div`
width:150px;
height:30px;
color:black;
font-weight:700;
font-size:25px;
margin-left:20px;
margin-top:20px;
`;

const NavBar = styled.div`
display:flex;
align-items:center;
gap:15px;
width:500px;
height:30px;
color:black;
font-weight:600;
margin-top:25px;
margin-right:20px;
`;

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
`;

function BlackHeaderComponent() {
  const user = useContext(UserContext);
  console.log('我在blackheaderComponents唷', user);
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

export default BlackHeaderComponent;
