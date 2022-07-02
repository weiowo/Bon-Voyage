import React from 'react';
import styled from 'styled-components/macro';
import UserPhotoSrc from '../pages/images/seal.png';

const ProfileSideBar = styled.div`
width:20vw;
height:calc(100vh-40px);
display:flex;
flex-direction:column;
align-items:center;
margin-top:60px;
`;

const SideNavBar = styled.div`
margin-top:60px;
height:auto;
width:auto;
display:flex;
flex-direction:column;
gap:30px;
`;

const UserPhoto = styled.img`
width:30px;
height:30px;
border-radius:50%;
margin-left:23px;
`;

const UserName = styled.div`
font-size:15px;
font-weight:600;
margin-left:15px;
`;

const NavBarChoice = styled.div`
font-weight:600;
font-size:15px;
color:grey;
`;

const UserNameLogoBox = styled.div`
width:160px;
height:50px;
border-radius:30px;
border:1px solid grey;
display:flex;
align-items:center
`;

function ProfileSideBarElement() {
  return (
    <ProfileSideBar>
      <UserNameLogoBox>
        <UserPhoto src={UserPhotoSrc} />
        <UserName>Weiwei</UserName>
      </UserNameLogoBox>
      <SideNavBar>
        <NavBarChoice>我的行程</NavBarChoice>
        <NavBarChoice>我的文章</NavBarChoice>
        <NavBarChoice>我的收藏</NavBarChoice>
        <NavBarChoice>個人資料</NavBarChoice>
        <NavBarChoice>地圖成就</NavBarChoice>
      </SideNavBar>
    </ProfileSideBar>
  );
}

export default ProfileSideBarElement;
