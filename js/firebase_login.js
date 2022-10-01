// Import the functions you need from the SDKs you need
import * as fb_app from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import * as fb_auth from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import * as fb_func from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-functions.js';
import * as fb_fstore from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js';
// https://firebase.google.com/docs/web/setup#available-libraries

import { firebaseConfig } from './firebase_config.js';
import { variables } from './dom.js';

// Initialize Firebase
const app = fb_app.initializeApp(firebaseConfig);

const functions = fb_func.getFunctions(fb_app.getApp());
fb_func.connectFunctionsEmulator(functions, 'localhost', 5500);

// Authentication

const auth = fb_auth.getAuth();
const db = fb_fstore.getFirestore(app);

function logIN(email, password) {
  console.log(email);
  console.log(password);
  fb_auth
    .signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      const userRef = fb_fstore.doc(db, 'users', 'currentUser');
      fb_fstore.setDoc(userRef, { user_UID: auth.currentUser.uid }).then(() => {
        console.log('Added currentUser');
        console.log(auth.currentUser);
        variables.modal.classList.add('hidden');
        variables.overlay.classList.add('hidden');
        window.open('common/dashboard.html', '_self');
      });
      // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
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

      // Get the OAuth access token and ID Token
      // window.open('common/dashboard.html', '_self');
      const user = result.user;
      console.log(user);
      const userRef = fb_fstore.doc(db, 'users', 'currentUser');
      fb_fstore.setDoc(userRef, { user_UID: result.user.uid }).then(() => {
        console.log('Added currentUser');
        console.log(auth.currentUser);
        variables.modal.classList.add('hidden');
        variables.overlay.classList.add('hidden');
        window.open('common/dashboard.html', '_self');
      });
      // const credential = OAuthProvider.credentialFromResult(result);
      // const accessToken = credential.accessToken;
      // const idToken = credential.idToken;
      // console.log(credential);
      // console.log(accessToken);
      // console.log(idToken);
    })
    .catch((error) => {
      console.log(error);
      // Handle error.
    });
}

variables.btn__ms.addEventListener('click', signUP);

variables.btn__enter.addEventListener('click', function (e) {
  // e.preventDefault();
  const email = document.querySelector('.email_ID').value;
  const password = document.querySelector('.pass_ID').value;
  if (email && password) logIN(email, password);
  else alert('Missing Fields!');
});

// document.querySelector('.logOut').addEventListener('click', signOUT);
