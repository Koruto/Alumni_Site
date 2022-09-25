// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import {
  OAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDmhc985ieJVAuPlZQUSKdY0dVP32LqgLs',
  authDomain: 'hiring-8203e.firebaseapp.com',
  projectId: 'hiring-8203e',
  storageBucket: 'hiring-8203e.appspot.com',
  messagingSenderId: '208319867959',
  appId: '1:208319867959:web:db5a24b41a37e1387423b2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const email = document.querySelector('.email_ID').value;
const password = document.querySelector('.pass_ID').value;

function createAccount() {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);

      // ..
    });
}

function logIN() {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
}

document
  .querySelector('.btn__createAccount')
  .addEventListener('click', createAccount);

document.querySelector('.btn__logIn').addEventListener('click', logIN);
