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

function signOUT() {
  fb_auth
    .signOut(auth)
    .then(() => {
      const userRef = fb_fstore.doc(db, 'users', 'currentUser');
      fb_fstore.setDoc(userRef, { user_UID: null }).then(() => {
        window.open('../index.html', '_self');
      });
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
}

document.querySelector('.sign__out')?.addEventListener('click', function (e) {
  e.preventDefault();
  signOUT();
});
