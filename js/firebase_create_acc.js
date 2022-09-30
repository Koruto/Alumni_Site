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

function createAccount(email, password, file, displayName, alumniValue) {
  console.log(email);
  console.log(password);

  fb_auth
    .createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
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
                displayName: displayName,
                photoURL: downloadURL,
              })
              .then(() => {
                const cityRef = fb_fstore.doc(
                  db,
                  'users',
                  auth.currentUser.uid
                );
                fb_fstore.setDoc(cityRef, {
                  name: auth.currentUser.displayName,
                  email: auth.currentUser.email,
                  password: password,
                  photoURL: downloadURL,
                  alumni: alumniValue,
                });
                console.log('Profile updated!');
                const userRef = fb_fstore.doc(db, 'users', 'currentUser');
                fb_fstore
                  .setDoc(userRef, { user_UID: auth.currentUser.uid })
                  .then(() => {
                    console.log('Added currentUser');
                    console.log(auth.currentUser);
                    window.open('../common/dashboard.html', '_self');
                  });
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
  const file = document.getElementById('profileImg').files[0];
  const displayName = document.getElementById('name').value;
  const alumniValue = document.getElementById('alumni').checked;
  const studentValue = document.getElementById('student').checked;

  if (email && password && file && displayName && (alumniValue || studentValue))
    createAccount(email, password, file, displayName, alumniValue);
  else console.log('Missing Fields');
});

// fb_auth.onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     const uid = user.uid;
//     sessionStorage.setItem('user_UID', uid);
//     const cityRef = fb_fstore.doc(db, 'users', 'currentUser');
//     fb_fstore.setDoc(cityRef, { user: user });
//     console.log('Added currentUser');
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });

// function uploadFile(storageRef, file) {
//   const uploadTask = uploadBytesResumable(storageRef, file);
//   uploadTask.on(
//     'state_changed',
//     (snapshot) => {
//       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log('Upload is ' + progress + '% done');
//       switch (snapshot.state) {
//         case 'paused':
//           console.log('Upload is paused');
//           break;
//         case 'running':
//           console.log('Upload is running');
//           break;
//       }
//     },
//     (error) => {
//       console.log(error);
//     },
//     () => {
//       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//         console.log(downloadURL);
//         return downloadURL;
//       });
//     }
//   );
// }
