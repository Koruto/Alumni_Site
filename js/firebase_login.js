// Import the functions you need from the SDKs you need
import * as fb_app from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import * as fb_auth from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import * as fb_func from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-functions.js';
// https://firebase.google.com/docs/web/setup#available-libraries

import { firebaseConfig } from './firebase_config.js';
import { variables } from './dom.js';

// Initialize Firebase
const app = fb_app.initializeApp(firebaseConfig);

const functions = fb_func.getFunctions(fb_app.getApp());
fb_func.connectFunctionsEmulator(functions, 'localhost', 5500);

// Authentication

const auth = fb_auth.getAuth();

function createAccount(email, password) {
  console.log(email);
  console.log(password);
  fb_auth
    .createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      variables.modal.classList.add('hidden');
      variables.overlay.classList.add('hidden');
      window.open('../common/chat.html', '_self');
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

function logIN(email, password) {
  console.log(email);
  console.log(password);
  fb_auth
    .signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      variables.modal.classList.add('hidden');
      variables.overlay.classList.add('hidden');
      window.open('../common/chat.html', '_self');
      // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
}

let provider = new fb_auth.OAuthProvider('microsoft.com');
provider.setCustomParameters({
  prompt: 'consent',
  tenant: '6d28e4fb-9074-4a0b-a5b8-9a89f632cc60',
});
function signUP(e) {
  e.preventDefault();
  fb_auth
    .signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      // User is signed in.
      // IdP data available in result.additionalUserInfo.profile.
      console.log(result.additionalUserInfo.profile);
      // Get the OAuth access token and ID Token
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;
      console.log(credential);
      console.log(accessToken);
      console.log(idToken);
      window.open('../common/chat.html', '_self');
    })
    .catch((error) => {
      console.log(error);
      // Handle error.
    });
}

function signOUT() {
  fb_auth
    .signOut(auth)
    .then(() => {
      console.log('Logged Out');
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
}

variables.btn__ms.addEventListener('click', signUP);

variables.btn__enter.addEventListener('click', function (e) {
  e.preventDefault();
  const email = document.querySelector('.email_ID').value;
  const password = document.querySelector('.pass_ID').value;

  if (document.getElementById('createAccount').checked) {
    createAccount(email, password);
  } else logIN(email, password);
});

// document.querySelector('.logOut').addEventListener('click', signOUT);
