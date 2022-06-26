import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Header = styled.header`
position:absolute;
display:flex;
justify-content:space-between;
align-items:center;
width:100vw;
height:70px;
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
  return (
    <Header>
      <Logo>Bon Voyage</Logo>
      <NavBar>
        <div style={{ cursor: 'pointer' }}>VR專區</div>
        <div style={{ cursor: 'pointer' }}>熱門景點</div>
        <div style={{ cursor: 'pointer' }}>國內旅遊</div>
        <div style={{ cursor: 'pointer' }}>國外旅遊</div>
        <div style={{ cursor: 'pointer' }}>
          <StyleNavLink to="/my-schedules">
            我的行程
          </StyleNavLink>
        </div>
        <ProfilePageNav>個人頁面</ProfilePageNav>
      </NavBar>
    </Header>
  );
}

export default GreyHeaderComponent;
