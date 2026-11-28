import React, { useContext, useEffect, useState } from 'react';
import {
  signOut, getAuth, updateProfile,
} from 'firebase/auth';
import {
  ref, uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { updateDoc, doc, onSnapshot } from 'firebase/firestore';
import Swal from 'sweetalert2';
import tw from '@/lib/tw';
import db, { app, storage } from '../utils/firebase-init';
import GreyHeaderComponent from '../components/Headers/GreyHeader';
import ProfileSideBarElement from '../components/ProfileSideBar';
import Line from '../components/Line';
import UserContext from '../components/UserContextComponent';
import SignIn from '../components/SignIn';
import { UpperLine, MyPageTitle } from './MyArticles';
import type { UserProfile } from '../types';

const UserPhotoSrc = '/images/seal.webp';

const PageWrapper = tw.div`
  w-full h-[100vh] flex pt-[60px] max-tablet:flex max-tablet:flex-col
  max-tablet:items-center max-tablet:pl-[0px]
`;

const MyInfoArea = tw.div`
  mt-[30px] flex h-[80%] w-[80vw] flex-col pl-[50px] max-tablet:flex
  max-tablet:items-center max-tablet:pl-[0px] max-tablet:h-full max-tablet:w-full
`;

const MyProfileWrapper = tw.div`
  w-[200px] h-[200px] rounded-[3px] relative
`;

const MyProfilePhoto = tw.img`
  w-[180px] h-[180px] rounded-[3px] object-cover [outline:none] [border:none] shrink-0
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2)] max-tablet:rounded-[20px]
`;

const CameraIcon = tw.label`
  bottom-[0px] right-[0px] w-[55px] h-[55px] absolute bg-[url(/images/camera_blue.webp)]
  bg-cover bg-no-repeat [background-blend-mode:multiply] bg-center cursor-pointer
`;

const ProfileNameEmailDisplay = tw.div`
  w-[250px] h-auto flex flex-row items-start gap-[10px] max-tablet:w-[250px]
  max-tablet:h-auto max-tablet:flex max-tablet:flex-col max-tablet:gap-[10px]
`;

const ProfileNameEmailTitle = tw.div`
  flex items-center [justify-content:left] w-[60px] h-[30px] font-semibold text-[15px]
  text-[#2E5984] max-tablet:flex max-tablet:items-center max-tablet:justify-center
  max-tablet:w-full max-tablet:h-[30px] max-tablet:font-semibold max-tablet:text-[15px]
  max-tablet:text-[#2E5984]
`;

const ProfileNamEmailContent = tw.div`
  w-[300px] h-[35px] text-[15px] bg-[#CDEEFD] [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2)] flex
  items-center justify-center rounded-[20px] max-tablet:w-[250px] max-tablet:h-[35px]
  max-tablet:text-[15px] max-tablet:bg-[#CDEEFD]
  max-tablet:[box-shadow:0_4px_8px_0_rgba(0,0,0,0.2)] max-tablet:flex
  max-tablet:items-center max-tablet:justify-center max-tablet:rounded-[20px]
`;

const ProfilePageBelowArea = tw.div`
  w-[80%] mt-[50px] h-[90%] flex gap-[20px] text-[18px] font-semibold max-tablet:flex-col
  max-tablet:items-center max-tablet:h-[90%] max-tablet:mt-[30px]
`;

const ProfileInfoArea = tw.div`
  flex flex-col items-start w-[50%] h-[280px] gap-[20px] max-tablet:items-center
  max-tablet:w-[50%] max-tablet:h-full
`;

const LogOutButton = tw.button`
  w-[100px] h-[35px] [border:none] mt-[10px] rounded-[5px] bg-[#2E5984] text-white
  font-semibold text-[15px] cursor-pointer max-tablet:w-[120px] max-tablet:bg-[#2E5984]
  max-tablet:mt-[5px]
`;

const auth = getAuth(app);

export function signOutFunction() {
  signOut(auth).catch((error) => {
    Swal.fire({
      title: '遇到了一些問題！',
      text: error,
      icon: 'warning',
    });
  });
}

function Profile() {
  const user = useContext(UserContext);
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [userEmail, setUserEmail] = useState<string>();
  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    if (user.uid) {
      const userInfo = doc(db, 'users', user.uid);
      return onSnapshot(userInfo, (querySnapshot) => {
        const profile = querySnapshot.data() as UserProfile | undefined;
        setPhotoUrl(profile?.photo_url);
        setUserEmail(profile?.email);
        setUserName(profile?.name);
      });
    }
    return undefined;
  }, [user.uid]);

  async function uploadProfileImg(imageData: File | null | undefined) {
    if (!imageData || !user.uid || !auth.currentUser) return;
    const imgRef = ref(storage, `profileImages/${imageData.name}`);
    await uploadBytes(imgRef, imageData);
    const url = await getDownloadURL(ref(storage, `profileImages/${imageData.name}`));
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { photo_url: url });
    await updateProfile(auth.currentUser, {
      photoURL: url,
    });
  }

  return (
    <>
      <GreyHeaderComponent />
      <PageWrapper>
        <ProfileSideBarElement />
        <Line />
        <MyInfoArea>
          {user.uid
            ? (
              <>
                <MyPageTitle>我的個人資料</MyPageTitle>
                <UpperLine style={{ marginTop: '30px' }} />
                <ProfilePageBelowArea>
                  <MyProfileWrapper>
                    <MyProfilePhoto src={photoUrl || UserPhotoSrc} />
                    <CameraIcon
                      htmlFor="profile-photo"
                    >
                      <input
                        style={{ display: 'none' }}
                        type="file"
                        id="profile-photo"
                        onChange={(e) => {
                          uploadProfileImg(e.target.files?.[0]);
                        }}
                      />
                    </CameraIcon>
                  </MyProfileWrapper>
                  <ProfileInfoArea>
                    <ProfileNameEmailDisplay>
                      <ProfileNameEmailTitle>
                        暱稱
                      </ProfileNameEmailTitle>
                      <ProfileNamEmailContent>
                        {userName || '' }
                      </ProfileNamEmailContent>
                    </ProfileNameEmailDisplay>
                    <ProfileNameEmailDisplay>
                      <ProfileNameEmailTitle>
                        Email
                      </ProfileNameEmailTitle>
                      <ProfileNamEmailContent>
                        {userEmail || '' }
                      </ProfileNamEmailContent>
                    </ProfileNameEmailDisplay>
                    <a href="/">
                      <LogOutButton
                        onClick={() => {
                          signOutFunction();
                        }}
                      >
                        登出
                      </LogOutButton>
                    </a>
                    {/* </ButtonLink> */}
                  </ProfileInfoArea>
                </ProfilePageBelowArea>
              </>
            )
            : <SignIn />}
        </MyInfoArea>
      </PageWrapper>
    </>

  );
}

export default Profile;
