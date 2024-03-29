import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { doc, onSnapshot } from 'firebase/firestore';
import { Link, useLocation } from 'react-router-dom';
import UserContext from './UserContextComponent';
import db from '../utils/firebase-init';

const ProfileSideBar = styled.div`
  width:20vw;
  height:calc(100vh-40px);
  display:flex;
  flex-direction:column;
  align-items:center;
  margin-top:60px;
  @media screen and (max-width:800px){
    display:none;
  }
`;

const SideNavBar = styled.div`
  margin-top:60px;
  height:auto;
  width:auto;
  display:flex;
  flex-direction:column;
  gap:30px;
  @media screen and (max-width:800px){
    display:none;
  }
`;

const UserPhoto = styled.img`
  width:30px;
  height:30px;
  border-radius:50%;
  margin-left:23px;
  object-fit:cover;
  @media screen and (max-width:800px){
    display:none;
  }
`;

const UserName = styled.div`
  font-size:15px;
  font-weight:600;
  margin-left:15px;
  height:auto;
  width:75px;
  @media screen and (max-width:880px){
    margin-left:10px;
  }
  @media screen and (max-width:800px){
    display:none;
  }
`;

const NavBarChoice = styled.div`
  font-weight:600;
  font-size:15px;
  color:grey;
  @media screen and (max-width:800px){
    display:none;
  }
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
  @media screen and (max-width:880px){
    width:150px;
  }
  @media screen and (max-width:800px){
    display:none;
  }
`;

export const LinkWithoutDefaultStyle = styled(Link)`
  text-decoration:none;
  &:hover {
    border-bottom:1.5px solid grey;
  }
`;

function ProfileSideBarElement() {
  const user = useContext(UserContext);
  const [photoUrl, setPhotoUrl] = useState();
  const [userName, setUserName] = useState();
  const currentUrl = useLocation();

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
          <UserPhoto src={photoUrl || user.photoURl} />
          <UserName>{userName || ''}</UserName>
        </UserNameLogoBox>
      </Link>
      <SideNavBar>
        <LinkWithoutDefaultStyle
          to="/my-schedules"
          style={{ borderBottom: currentUrl.pathname === '/my-schedules' ? '1.5px solid grey' : '' }}
        >
          <NavBarChoice>我的行程</NavBarChoice>
        </LinkWithoutDefaultStyle>
        <LinkWithoutDefaultStyle
          to="/my-articles"
          style={{ borderBottom: currentUrl.pathname === '/my-articles' ? '1.5px solid grey' : '' }}
        >
          <NavBarChoice>我的文章</NavBarChoice>
        </LinkWithoutDefaultStyle>
        <LinkWithoutDefaultStyle
          to="/my-favorites"
          style={{ borderBottom: currentUrl.pathname === '/my-favorites' ? '1.5px solid grey' : '' }}
        >
          <NavBarChoice>我的收藏</NavBarChoice>
        </LinkWithoutDefaultStyle>
        <LinkWithoutDefaultStyle
          to="/profile"
          style={{ borderBottom: currentUrl.pathname === '/profile' ? '1.5px solid grey' : '' }}
        >
          <NavBarChoice>個人資料</NavBarChoice>
        </LinkWithoutDefaultStyle>
        {/* <NavBarChoice>地圖成就</NavBarChoice> */}
      </SideNavBar>
    </ProfileSideBar>
  );
}

export default ProfileSideBarElement;
