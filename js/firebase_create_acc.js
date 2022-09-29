// Import the functions you need from the SDKs you need
import * as fb_app from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import * as fb_auth from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import * as fb_func from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-functions.js';
import * as fb_fstore from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js';
// https://firebase.google.com/docs/web/setup#available-libraries

import { firebaseConfig } from './firebase_config.js';
import { variables } from './dom.js';

// Initialize Firebase
const app = fb_app.initializeApp(firebaseConfig);
const db = fb_fstore.getFirestore(app);
const storage = getStorage(app);

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
      const file = document.getElementById('profileImg').files[0];
      console.log(file);

      const storageRef = ref(
        storage,
        `users/${auth.currentUser.uid}/${file.name}`
      );
      console.log(storageRef);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(file.name);
            console.log(userCredential);

            fb_auth
              .updateProfile(auth.currentUser, {
                displayName: document.getElementById('name').value,
                phoneNumber: document.getElementById('phoneNumber').value,

                photoURL: downloadURL,
              })
              .then(() => {
                //   Profile updated!
                const cityRef = fb_fstore.doc(
                  db,
                  'users',
                  auth.currentUser.uid
                );
                fb_fstore.setDoc(cityRef, { alumni: true });
                console.log('Profile updated!');
                console.log(auth.currentUser);
                // ...
              })
              .catch((error) => {
                // An error occurred
                console.log(error);
                // ...
              });
          });
        }
      );

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

variables.btn__enter.addEventListener('click', function (e) {
  e.preventDefault();
  const email = document.getElementById('email_ID').value;
  const password = document.getElementById('pass_ID').value;

  createAccount(email, password);
});

function uploadFile(storageRef, file) {
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log(downloadURL);
        return downloadURL;
      });
    }
  );
}
