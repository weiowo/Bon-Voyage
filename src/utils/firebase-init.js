// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'bonvoyage-f5e7d.firebaseapp.com',
  projectId: 'bonvoyage-f5e7d',
  storageBucket: 'bonvoyage-f5e7d.appspot.com',
  messagingSenderId: '200623309922',
  appId: '1:200623309922:web:e2388c4e9cb2622c27fd3b',
  measurementId: 'G-2KMM8H4EYH',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log(analytics);
