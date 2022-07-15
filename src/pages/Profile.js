import styled from 'styled-components/macro';
import React, { useContext, useEffect, useState } from 'react';
import {
  signOut, getAuth, updateProfile,
} from 'firebase/auth';
import {
  ref, uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { updateDoc, doc, onSnapshot } from 'firebase/firestore';
import db, { app, storage } from '../utils/firebase-init';
import GreyHeaderComponent from '../components/GreyHeader';
import ProfileSideBarElement from '../components/ProfileSideBar';
import { Line } from './MySchedules';
import UserContext from '../components/UserContextComponent';
import SignIn from '../components/SignIn';
import { UpperLine, MyPageTitle } from './MyArticles';
import UserPhotoSrc from './images/seal.png';
import CameraSrc from './images/camera_blue.png';

const PageWrapper = styled.div`
width:100vw;
height:100vh;
display:flex;
padding-top:60px;
@media screen and (max-width:800px){
  display:flex;
  flex-direction:column;
  align-items:center;
  padding-left:0px;
}`;

const MyInfoArea = styled.div`
margin-top:30px;
display:flex;
height:80%;
width:80vw;
flex-direction:column;
padding-left:50px;
@media screen and (max-width:800px){
  display:flex;
  align-items:center;
  padding-left:0px;
  height:100%;
  width:100%;
}`;

const MyProfileWrapper = styled.div`
width:200px;
height:200px;
border-radius:3px;
position:relative;
position:relative;
`;

const MyProfilePhoto = styled.img`
width:180px;
height:180px;
border-radius:3px;
object-fit: cover;
outline:none;
border:1px solid black;
border:none;
flex-shrink: 0;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
@media screen and (max-width:800px){
border-radius:20px;
}`;

const CameraIcon = styled.label`
bottom:0px;
right:0px;
width:55px;
height:55px;
position:absolute;
background-image: url(${CameraSrc});
background-size:cover;
background-repeat: no-repeat;
background-blend-mode: multiply;
background-position:center;
cursor:pointer;
`;

const ProfileNameEmailDisplay = styled.div`
width:250px;
height:auto;
display:flex;
flex-direction:row;
align-items:flex-start;
gap:10px;
@media screen and (max-width:800px){
  width:250px;
  height:auto;
  display:flex;
  flex-direction:column;
  gap:10px;
}`;

const ProfileNameEmailTitle = styled.div`
display:flex;
align-items:center;
justify-content:left;
width:60px;
height:30px;
font-weight:600;
font-size:15px;
color:#2E5984;
@media screen and (max-width:800px){
  display:flex;
  align-items:center;
  justify-content:center;
  width:100%;
  height:30px;
  font-weight:600;
  font-size:15px;
  color:#2E5984;
}`;

const ProfileNamEmailContent = styled.div`
width:300px;
height:35px;
font-color:blue;
font-size:15px;
background-color: #CDEEFD;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
display:flex;
align-items:center;
justify-content:center;
border-radius:20px;
@media screen and (max-width:800px){
  width:250px;
  height:35px;
  font-color:blue;
  font-size:15px;
  background-color: #CDEEFD;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:20px;
}`;

const ProfilePageBelowArea = styled.div`
width:80%;
margin-top:50px;
height:90%;
display:flex;
gap:20px;
font-size:18px;
font-weight:600;
@media screen and (max-width:800px){
  flex-direction:column;
  align-items:center;
  height:90%;
  margin-top:30px;
}`;

const ProfileInfoArea = styled.div`
display:flex;
flex-direction:column;
align-items:flex-start;
width:50%;
height:280px;
gap:20px;
@media screen and (max-width:800px){
  align-items:center;
  width:50%;
  height:100%;
}`;

const LogOutButton = styled.button`
width:100px;
height:35px;
border:none;
margin-top:10px;
border-radius:5px;
background-color:#2E5984;
color:white;
font-weight:600;
font-size:15px;
cursor:pointer;
@media screen and (max-width:800px){
  width:120px;
  background-color:#2E5984;
  margin-top:5px;
}`;

// const ButtonLink = styled(Link)`
// width:30%;
// height:30px;
// border:none;
// border-radius:5px;
// background-color:grey;
// color:white;
// font-weight:600;
// font-size:15px;
// cursor:pointer;
// `;

// const MyProfilePhotoArea = styled.div`
// width:200px;
// height:400px;
// border:1px red solid;
// border-radius:10px;
// `;

const auth = getAuth(app);

export function signOutFunction() {
  signOut(auth).then(() => {
    console.log('successfully sign out!');
    alert('您已登出囉～');
  }).catch((error) => {
    console.log(error);
  });
}

function Profile() {
  const user = useContext(UserContext);
  const [photoUrl, setPhotoUrl] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userName, setUserName] = useState();
  // const navigate = useNavigate();

  // 更改個人資料要即時更新

  useEffect(() => {
    if (user.uid) {
      const userInfo = doc(db, 'users', user.uid);
      onSnapshot(userInfo, (querySnapshot) => {
        setPhotoUrl(querySnapshot.data().photo_url);
        setUserEmail(querySnapshot.data().email);
        setUserName(querySnapshot.data().name);
      });
    }
  }, [user.uid]);

  // 上傳Profile圖片！
  async function uploadProfileImg(imageData) {
    if (imageData === null) return;
    const imgRef = ref(storage, `profileImages/${imageData.name}`);
    const snap = await uploadBytes(imgRef, imageData);
    console.log(snap);
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
                          console.log('uploadProfileImg');
                          uploadProfileImg(e.target.files[0]);
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
