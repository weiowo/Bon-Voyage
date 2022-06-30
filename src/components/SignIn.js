import React, { useState } from 'react';
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  setPersistence, browserSessionPersistence, signOut,
} from 'firebase/auth';
import {
  // getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';
import db, { app } from '../utils/firebase-init';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  //   async function setNewUserToDb(){
  //       console.log('您創了一個新帳號唷！');
  //       const createNewUserData = doc(collection(db, 'users'));
  //       await setDoc(
  //           createNewUserData, ({...newUser, user_id: user.uid})
  //       );
  //   }

  // sign up 之後就要create一個user到users collection

  // 這裡存完後不用set到user的state，直接送到firestore、然後在app.js那邊會抓取是否有登入的狀況
  function signUp() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const userCredentialData = userCredential;
        const userData = auth.currentUser;
        console.log('signUp', userData);
        console.log('successful', userCredentialData);
        console.log('您創了一個新帳號唷！');
        // 在firestore上面創立一個新的user並給予相應的欄位
        const createNewUserData = doc(db, 'users', userData.uid);
        setDoc(createNewUserData, ({ ...newUser, user_id: userData.uid, email: userData.email }));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert(errorMessage);
        // ..
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

  function signOutFunction() {
    signOut(auth).then(() => {
      console.log('successfully sign out!');
      console.log();

      // Sign-out successful.
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <div style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
      <input value={email} type="email" placeholder="please enter your email" onChange={(e) => setEmail(e.target.value)} />
      <input value={password} type="password" placeholder="please enter your password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => { signUp(); setEmail(''); setPassword(''); }} type="button">create account</button>
      <button onClick={() => { signIn(); setEmail(''); setPassword(''); }} type="button">Sign in</button>
      <button onClick={() => { signOutFunction(); setEmail(''); setPassword(''); }} type="button">Sign out</button>
    </div>
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
