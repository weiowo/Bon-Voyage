import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import UserContext from './UserContextComponent';

const Header = styled.header`
position:absolute;
display:flex;
justify-content:space-between;
width:100vw;
height:65px;
z-index:3;
// background-color:rgba(0, 0, 0, 0.2);
// position:fixed;
// top:0;
`;

const Logo = styled.div`
width:150px;
height:30px;
color:white;
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
color:white;
font-weight:600;
margin-top:25px;
margin-right:20px;
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

function HeaderComponent() {
  const user = useContext(UserContext);
  console.log('我在headerComponents唷', user);
  return (
    <Header>
      <StyleNavLink to="/">
        <Logo>Bon Voyage</Logo>
      </StyleNavLink>
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
        <StyleNavLink to="/profile">
          <ProfilePageNav>個人頁面</ProfilePageNav>
        </StyleNavLink>
      </NavBar>
    </Header>
  );
}

export default HeaderComponent;

// HeaderComponent.propTypes = {
//   user: PropTypes.func.isRequired,
// };
