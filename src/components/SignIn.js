import styled from 'styled-components/macro';
import React, { useState } from 'react';
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
`;

const SignUpArea = styled.div`
display:${(props) => (props.active ? 'flex' : 'none')};
width:80%;
height:80%;
flex-direction:column;
align-items:center;
justify-content:center;
gap:10px;
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

  // 這裡存完後不用set到user的state，直接送到firestore、然後在app.js那邊會抓取是否有登入的狀況
  function signUp() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const userCredentialData = userCredential;
        const userData = auth.currentUser;
        updateProfile(auth.currentUser, { displayName: userName });
        console.log('signUp', userData);
        console.log('successful', userCredentialData);
        console.log('您創了一個新帳號唷！');
        // 在firestore上面創立一個新的user並給予相應的欄位
        const createNewUserData = doc(db, 'users', userData.uid);
        setDoc(createNewUserData, ({
          ...newUser, user_id: userData.uid, email: userData.email, name: userName,
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
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
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
        <SignUpArea active={signInModal}>
          <SignInSignUpTitle>BonVoyage會員帳戶登入</SignInSignUpTitle>
          <EmailPasswordInput required value={email} type="email" placeholder="電子郵件" onChange={(e) => setEmail(e.target.value)} />
          <EmailPasswordInput required value={password} type="password" placeholder="密碼" onChange={(e) => setPassword(e.target.value)} />
          <SignUpInOutButton onClick={() => { alert('登入了！'); signIn(); setEmail(''); setPassword(''); setUserName(''); }} type="button">登入</SignUpInOutButton>
          <button type="button" onClick={() => { setSignInModal(false); setSignUpModal(true); }}>還沒註冊？</button>
        </SignUpArea>
        <SignUpArea active={signUpModal}>
          <SignInSignUpTitle>BonVoyage會員帳戶註冊</SignInSignUpTitle>
          <EmailPasswordInput required value={userName} type="text" placeholder="姓名或暱稱" onChange={(e) => setUserName(e.target.value)} />
          <EmailPasswordInput required value={email} type="email" placeholder="電子郵件" onChange={(e) => setEmail(e.target.value)} />
          <EmailPasswordInput required value={password} type="password" placeholder="密碼" onChange={(e) => setPassword(e.target.value)} />
          <SignUpInOutButton onClick={() => { alert('註冊了！'); signUp(); setEmail(''); setPassword(''); setUserName(''); }} type="button">註冊</SignUpInOutButton>
          <button type="button" onClick={() => { setSignInModal(true); setSignUpModal(false); }}>返回登入</button>
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
