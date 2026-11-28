import React, { useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { Link, useLocation } from '@/lib/router';
import tw from '@/lib/tw';
import UserContext from './UserContextComponent';
import db from '../utils/firebase-init';
import type { UserProfile } from '../types';

const ProfileSideBar = tw.div`
  w-[20vw] flex flex-col items-center mt-[60px] max-tablet:hidden
`;

const SideNavBar = tw.div`
  mt-[60px] h-auto w-auto flex flex-col gap-[30px] max-tablet:hidden
`;

const UserPhoto = tw.img`
  w-[30px] h-[30px] rounded-[50%] ml-[23px] object-cover max-tablet:hidden
`;

const UserName = tw.div`
  text-[15px] font-semibold ml-[15px] h-auto w-[75px] max-tablet-lg:ml-[10px]
  max-tablet:hidden
`;

const NavBarChoice = tw.div`
  font-semibold text-[15px] [color:grey] max-tablet:hidden
`;

const UserNameLogoBox = tw.div`
  w-[160px] rounded-[30px] [border:1px_solid_grey] flex items-center h-auto pt-[7px]
  pb-[7px] max-tablet-lg:w-[150px] max-tablet:hidden
`;

export const LinkWithoutDefaultStyle = tw(Link)`
  [text-decoration:none] hover:[border-bottom:1.5px_solid_grey]
`;

function ProfileSideBarElement() {
  const user = useContext(UserContext);
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const currentUrl = useLocation();

  useEffect(() => {
    if (user.uid) {
      const userInfo = doc(db, 'users', user.uid);
      return onSnapshot(userInfo, (querySnapshot) => {
        const profile = querySnapshot.data() as UserProfile | undefined;
        setPhotoUrl(profile?.photo_url);
        setUserName(profile?.name);
      });
    }
    return undefined;
  }, [user.uid]);

  return (
    <ProfileSideBar>
      <Link style={{ textDecoration: 'none', color: 'black' }} to="/profile">
        <UserNameLogoBox>
          <UserPhoto src={photoUrl || user.photoURL || undefined} />
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
