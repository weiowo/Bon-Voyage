import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { doc, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import UserPhotoSrc from '../pages/images/seal.png';
import UserContext from './UserContextComponent';
import db from '../utils/firebase-init';

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
height:auto;
width:75px;
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
align-items:center;
height:auto;
padding-top:7px;
padding-bottom:7px;
`;

export const LinkWithoutDefaultStyle = styled(Link)`
text-decoration:none;
`;

function ProfileSideBarElement() {
  const user = useContext(UserContext);
  const [photoUrl, setPhotoUrl] = useState();
  const [userName, setUserName] = useState();

  // 更改個人資料要即時更新

  useEffect(() => {
    if (user.uid) {
      const userInfo = doc(db, 'users', user.uid);
      onSnapshot(userInfo, (querySnapshot) => {
        setPhotoUrl(querySnapshot.data().photo_url);
        setUserName(querySnapshot.data().name);
      });
    }
  }, [user.uid]);

  return (
    <ProfileSideBar>
      <Link style={{ textDecoration: 'none', color: 'black' }} to="/profile">
        <UserNameLogoBox>
          <UserPhoto src={photoUrl || UserPhotoSrc} />
          <UserName>{userName || ''}</UserName>
        </UserNameLogoBox>
      </Link>
      <SideNavBar>
        <LinkWithoutDefaultStyle to="/my-schedules">
          <NavBarChoice>我的行程</NavBarChoice>
        </LinkWithoutDefaultStyle>
        <LinkWithoutDefaultStyle to="/my-articles">
          <NavBarChoice>我的文章</NavBarChoice>
        </LinkWithoutDefaultStyle>
        <NavBarChoice>我的收藏</NavBarChoice>
        <LinkWithoutDefaultStyle to="/profile">
          <NavBarChoice>個人資料</NavBarChoice>
        </LinkWithoutDefaultStyle>
        <NavBarChoice>地圖成就</NavBarChoice>
      </SideNavBar>
    </ProfileSideBar>
  );
}

export default ProfileSideBarElement;
