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
const db = fb_fstore.getFirestore(app);

const functions = fb_func.getFunctions(fb_app.getApp());
fb_func.connectFunctionsEmulator(functions, 'localhost', 5500);

// Authentication

const auth = fb_auth.getAuth();

let user = {};
function getUser() {
  fb_fstore
    .getDoc(fb_fstore.doc(db, 'users', 'currentUser'))
    .then((docSnap) => {
      const userid = docSnap.data().user_UID;
      fb_fstore.getDoc(fb_fstore.doc(db, 'users', userid)).then((docSna) => {
        console.log(docSna.data().name);
        console.log(docSna.data().email);
        console.log(docSna.data().photoURL);
        console.log(docSna.data().alumni);

        user = {
          user_uid: userid,
          displayName: docSna.data().name,
          email: docSna.data().email,
          profilePhoto: docSna.data().photoURL,
          alumni: docSna.data().alumni,
        };
        console.log(user);
        updateProfile();
      });
    });
}

function updateProfile() {
  document.querySelector('.user__name').textContent = user.displayName;
  document.querySelector('.post__profile').src = user.profilePhoto;
  loadPost();
}

getUser();
console.log(user);

const userReady = setInterval(checkForUser, 250);

function checkForUser() {
  if (user.displayName) {
    clearInterval(userReady);
    document
      .querySelector('.fullpage-loader__logo')
      .classList.add('fullpage-loader--invisible');
    const loaderEl = document.getElementsByClassName('fullpage-loader')[0];
    loaderEl.parentNode.removeChild(loaderEl);
  } else console.log('not yet');
}
