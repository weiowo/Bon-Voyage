import React, { useState } from 'react';
import { Link } from '@/lib/router';
import Swal from 'sweetalert2';
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  setPersistence, browserSessionPersistence, updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
} from 'firebase/firestore';
import tw from '@/lib/tw';
import db, { app } from '../utils/firebase-init';

const CloseIcon = '/images/close_style.png';

const SignInModalBackground = tw.div`
  w-[100vw] h-[100vh] fixed top-[0] bottom-[0] left-[0] right-[0] bg-[rgba(0,0,0,0.7)]
  justify-center items-center flex z-[100]
`;

const ModalBox = tw.div`
  flex w-[30vw] h-[30vw] bg-white rounded-[10px] z-[200] relative items-center
  justify-center max-[1201px]:w-[350px] max-[1201px]:h-[350px] max-[451px]:w-[330px]
  max-[451px]:h-[330px]
`;

const SignUpArea = tw.div<{ active?: boolean }>`
  w-[80%] h-[80%] flex-col items-center justify-center gap-[10px] max-[1201px]:w-[90%]
  max-[1201px]:h-[90%]
  ${(p) => (p.active ? 'flex' : 'hidden')}
`;

const SignInSignUpTitle = tw.div`
  w-[80%] h-[30px] font-semibold text-[20px] text-[#296D98]
`;

const SignUpInOutButton = tw.button`
  w-[80%] h-[40px] bg-[#87CEE8] text-white [font-weight:550] text-[14px] [border:none]
  rounded-[5px] cursor-pointer
`;

const EmailPasswordInput = tw.input`
  w-[80%] h-[40px] text-[17px] [outline:none] pl-[15px] [border:1px_solid_grey]
  rounded-[3px]
`;

const GoToSignUpButton = tw.button`
  w-[30%] h-[35px] bg-[#296D98] text-white font-medium rounded-[5px] [border:none]
  cursor-pointer
`;

const StyledIcon = tw.img`
  w-[28px] h-[28px] absolute top-[20px] right-[20px]
`;

function SignIn() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInModal, setSignInModal] = useState(true);
  const [signUpModal, setSignUpModal] = useState(false);

  const auth = getAuth(app);

  const newUser = {
    user_id: '',
    email: '',
    name: '',
    owned_schedule_ids: [],
    owned_article_ids: [],
    loved_attraction_ids: [],
    loved_article_ids: [],
  };

  // sign up 之後就要create一個user到users collection
  // 預設圖片array，註冊後隨機給一張
  const defaultPhoto = [
    'https://firebasestorage.googleapis.com/v0/b/bonvoyage-f5e7d.appspot.com/o/profileImages%2Fmember2.png?alt=media&token=3f2c8df6-0218-4ef9-98ec-a78571c30454',
    'https://firebasestorage.googleapis.com/v0/b/bonvoyage-f5e7d.appspot.com/o/profileImages%2Fmember3.png?alt=media&token=4fe1a116-db4b-42d5-9d13-99e7ae0906c9',
    'https://firebasestorage.googleapis.com/v0/b/bonvoyage-f5e7d.appspot.com/o/profileImages%2Fmember4.png?alt=media&token=f27ddde3-30ef-4480-b89c-a1cca3679f88',
    'https://firebasestorage.googleapis.com/v0/b/bonvoyage-f5e7d.appspot.com/o/profileImages%2Fmember5.png?alt=media&token=1f30b87c-c96c-4b66-9ea2-6997ab6f6594',
    'https://firebasestorage.googleapis.com/v0/b/bonvoyage-f5e7d.appspot.com/o/profileImages%2Fmember6.png?alt=media&token=8addba16-c4a8-44c0-864a-1b8f59f2884e',
    'https://firebasestorage.googleapis.com/v0/b/bonvoyage-f5e7d.appspot.com/o/profileImages%2Fmember7.png?alt=media&token=94cba2ac-36f4-46c9-88d7-c66bf84fe64e',
  ];

  // 這裡存完後不用set到user的state，直接送到firestore、然後在app.js那邊會抓取是否有登入的狀況
  function signUp() {
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user: userData }) => {
        updateProfile(
          userData,
          {
            displayName: userName,
            photoURL: defaultPhoto[Math.floor(Math.random() * defaultPhoto.length)],
          },
        );
        // console.log('successful', userCredentialData);
        Swal.fire({
          title: '成功創立帳號～',
          text: '準備開啟令人期待的旅程囉！',
          icon: 'success',
        });
        const createNewUserData = doc(db, 'users', userData.uid);
        setDoc(createNewUserData, ({
          ...newUser,
          user_id: userData.uid,
          email: userData.email,
          name: userName,
          photo_url: defaultPhoto[Math.floor(Math.random() * defaultPhoto.length)],
        }));
      })
      .catch((error) => {
        const errorMessage = error.message;
        Swal.fire({
          title: '發生了一點錯誤～',
          text: errorMessage,
          icon: 'warning',
        });
      });
  }

  function signIn() {
    setPersistence(auth, browserSessionPersistence)
      .then(async () => {
        await signInWithEmailAndPassword(auth, email, password);
        // const userCredentialData = userCredential;
        // console.log('userCredentialData', userCredentialData);
        Swal.fire({
          title: '成功登入囉～',
          text: '準備開啟令人期待的旅程囉！',
          icon: 'success',
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        Swal.fire(errorMessage);
      });
  }

  return (
    <SignInModalBackground>
      <ModalBox>
        <Link to="/">
          <StyledIcon src={CloseIcon} />
        </Link>
        <SignUpArea active={signInModal}>
          <SignInSignUpTitle>BonVoyage會員帳戶登入</SignInSignUpTitle>
          <EmailPasswordInput required value={email} type="email" placeholder="電子郵件" onChange={(e) => setEmail(e.target.value)} />
          <EmailPasswordInput required value={password} type="password" placeholder="密碼" onChange={(e) => setPassword(e.target.value)} />
          <SignUpInOutButton onClick={() => { signIn(); setEmail(''); setPassword(''); setUserName(''); }} type="button">登入</SignUpInOutButton>
          <GoToSignUpButton type="button" onClick={() => { setSignInModal(false); setSignUpModal(true); }}>還沒註冊？</GoToSignUpButton>
        </SignUpArea>
        <SignUpArea active={signUpModal}>
          <SignInSignUpTitle>BonVoyage會員帳戶註冊</SignInSignUpTitle>
          <EmailPasswordInput required value={userName} type="text" placeholder="姓名或暱稱" onChange={(e) => setUserName(e.target.value)} />
          <EmailPasswordInput required value={email} type="email" placeholder="電子郵件" onChange={(e) => setEmail(e.target.value)} />
          <EmailPasswordInput required value={password} type="password" placeholder="密碼" onChange={(e) => setPassword(e.target.value)} />
          <SignUpInOutButton onClick={() => { signUp(); setEmail(''); setPassword(''); setUserName(''); }} type="button">註冊</SignUpInOutButton>
          <GoToSignUpButton type="button" onClick={() => { setSignInModal(true); setSignUpModal(false); }}>返回登入</GoToSignUpButton>
        </SignUpArea>
      </ModalBox>
    </SignInModalBackground>
  );
}

export default SignIn;
