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
// import { useNavigate } from 'react-router-dom';
import db, { app, storage } from '../utils/firebase-init';
import GreyHeaderComponent from '../components/GreyHeader';
import ProfileSideBarElement from '../components/ProfileSideBar';
import { PageWrapper, Line } from './MySchedules';
import UserContext from '../components/UserContextComponent';
import SignIn from '../components/SignIn';
import { UpperLine, MyPageTitle } from './MyArticles';
import UserPhotoSrc from './images/seal.png';
import CameraSrc from './images/camera_blue.png';

const MyInfoArea = styled.div`
margin-top:30px;
width:80vw;
height:85vh;
display:flex;
flex-direction:column;
margin-left:50px;
`;

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
`;

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

const ProfilePageBelowArea = styled.div`
width:78vw;
margin-top:50px;
height:40vh;
display:flex;
gap:20px;
font-size:18px;
font-weight:600;
`;

const ProfileInfoArea = styled.div`
display:flex;
flex-direction:column;
align-items:flex-start;
width:50%;
height:180px;
gap:20px;
`;

const LogOutButton = styled.button`
width:100%;
height:30px;
border:none;
border-radius:5px;
background-color:grey;
color:white;
font-weight:600;
font-size:15px;
cursor:pointer;
`;

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

function Profile() {
  const user = useContext(UserContext);
  const [photoUrl, setPhotoUrl] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userName, setUserName] = useState();
  // const navigate = useNavigate();

  console.log(photoUrl);
  console.log('profile page', user);
  const auth = getAuth(app);

  function signOutFunction() {
    signOut(auth).then(() => {
      console.log('successfully sign out!');
      // navigate({ pathname: '/' });

      // Sign-out successful.
    }).catch((error) => {
      console.log(error);
    });
  }

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
    const url = await getDownloadURL(ref(storage, `profileImages/${imageData.name}`));
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { photo_url: url });
    await updateProfile(auth.currentUser, {
      photoURL: url,
    });
    console.log(snap);
    console.log(user);
    console.log(url);
  }

  // 同時querysnapshot，拿schedule中members的id array去找人

  // useEffect(() => {
  //   if (selectedSchedule?.schedule_id) {
  //     const memberAdded = doc(db, 'schedules', selectedSchedule?.schedule_id);
  //     onSnapshot(memberAdded, (querySnapshot) => {
  //       console.log('我在拿更新的朋友名單', querySnapshot.data());
  //       console.log(querySnapshot.data().members);
  // querySnapshot.data().members.forEach(async (item, index) => {
  //   const docs = doc(db, 'users', item);
  //   const snap = await getDoc(docs);
  //   if (snap.exists()) {
  //     console.log('這些使用者的詳細資料', index, snap.data());
  //     setSelectedMembers((draft) => {
  //       draft.push(snap.data());
  //     });
  //   } else {
  //     console.log('找不到這個使用者');
  //   }
  // });
  //     });
  //   }
  // }, [selectedSchedule?.schedule_id, setSelectedMembers]);

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
                    <div>
                      暱稱:
                      {userName || '' }
                    </div>
                    <div>
                      Email:
                      {userEmail || '' }
                    </div>
                    {/* <ButtonLink to="/"> */}
                    <a href="/">
                      <LogOutButton
                        onClick={() => {
                          signOutFunction();
                        }}
                      >
                        {' '}
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
