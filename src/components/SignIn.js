import styled from 'styled-components/macro';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  setPersistence, browserSessionPersistence, updateProfile,
} from 'firebase/auth';
import {
  // getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';
import db, { app } from '../utils/firebase-init';
import CloseIcon from '../pages/images/close_style.png';

const SignInModalBackground = styled.div`
width:100vw;
height:100vh;
position:fixed;
top:0;
bottom:0;
left:0;
right:0;
background-color:rgba(0, 0, 0, 0.7);
display:flex;
justify-content:center;
align-items:center;
display:flex;
z-index:100;
`;

const ModalBox = styled.div`
display:flex;
width:30vw;
height:30vw;
background-color:white;
z-index:10;
border-radius:10px;
z-index:200;
position: relative;
align-items:center;
justify-content:center;
@media screen and (max-width:1200px){
  width:350px;
  height:350px;
}
@media screen and (max-width:450px){
  width:330px;
  height:330px;
}
`;

const SignUpArea = styled.div`
display:${(props) => (props.active ? 'flex' : 'none')};
width:80%;
height:80%;
flex-direction:column;
align-items:center;
justify-content:center;
gap:10px;
@media screen and (max-width:1200px){
  width:90%;
  height:90%;
}
`;

const SignInSignUpTitle = styled.div`
width:80%;
height:30px;
font-weight:600;
font-size:20px;
color:#296D98;
`;

const SignUpInOutButton = styled.button`
width:80%;
height:40px;
background-color:#87CEE8;
color:white;
font-weight:550;
font-size:14px;
border:none;
border-radius:5px;
cursor:pointer;
`;

const EmailPasswordInput = styled.input`
width:80%;
height:40px;
border:none;
font-size:17px;
outline:none;
padding-left:15px;
border:1px solid grey;
border-radius:3px;
`;

const GoToSignUpButton = styled.button`
width:30%;
height:35px;
background-color:#296D98;
color:white;
font-weight:500;
border-radius:5px;
border:none;
cursor:pointer;
`;

const StyledIcon = styled.img`
width:28px;
height:28px;
position:absolute;
top:20px;
right:20px;
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

  console.log('隨機號碼', Math.floor(Math.random() * defaultPhoto.length));
  console.log('隨機值', defaultPhoto[Math.floor(Math.random() * defaultPhoto.length)]);

  // 這裡存完後不用set到user的state，直接送到firestore、然後在app.js那邊會抓取是否有登入的狀況
  function signUp() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const userCredentialData = userCredential;
        const userData = auth.currentUser;
        updateProfile(
          auth.currentUser,
          {
            displayName: userName,
            photoURL: defaultPhoto[Math.floor(Math.random() * defaultPhoto.length)],
          },
        );
        console.log('signUp', userData);
        console.log('successful', userCredentialData);
        alert('成功創立帳號囉!');
        // 在firestore上面創立一個新的user並給予相應的欄位
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
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert(errorMessage);
      });
  }

  function signIn() {
    // 透過firebase的功能，存用戶的資訊到local storage
    setPersistence(auth, browserSessionPersistence)
      .then(async () => {
        console.log(auth, email, password);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userCredentialData = userCredential;
        const userData = auth.currentUser;
        console.log('userCredentialData', userCredentialData);
        console.log('userData', userData);
        alert('成功登入囉～');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert(errorMessage);
      });
  }

  // function signOutFunction() {
  //   signOut(auth).then(() => {
  //     console.log('successfully sign out!');
  //     console.log();

  //     // Sign-out successful.
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }

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

//   function setPersistenceInLocal() {
//     setPersistence(auth, browserSessionPersistence)
//       .then(() => {
//         console.log(auth, email, password);
//         return signInWithEmailAndPassword(auth, email, password);
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.log(errorCode, errorMessage);
//       });
//   }

//   signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       // Signed in
//       const { user } = userCredential;
//       console.log({ user }, 'successfully sign in!');
//       console.log(user, 'successfully sign in!');
//       // ...
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log(errorCode, errorMessage);
//       alert(errorMessage);
//     });

export default SignIn;

// SignIn.propTypes = {
//   setUser: PropTypes.func.isRequired,
// };
