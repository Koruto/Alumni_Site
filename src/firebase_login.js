// Import the functions you need from the SDKs you need
import {
  initializeApp,
  getApp,
} from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import {
  OAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import {
  getFunctions,
  connectFunctionsEmulator,
} from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-functions.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { firebaseConfig } from './firebase_config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const functions = getFunctions(getApp());
connectFunctionsEmulator(functions, 'localhost', 5500);

// Authentication

const auth = getAuth();
console.log(auth);

function createAccount() {
  const email = document.querySelector('.email_ID__cre').value;
  const password = document.querySelector('.pass_ID__cre').value;

  console.log(email);
  console.log(password);
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
  const email = document.querySelector('.email_ID__log').value;
  const password = document.querySelector('.pass_ID__log').value;

  console.log(email);
  console.log(password);
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
