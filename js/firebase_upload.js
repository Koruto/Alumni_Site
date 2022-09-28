// Import the functions you need from the SDKs you need
import * as fb_app from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import * as fb_auth from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import * as fb_func from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-functions.js';
import * as fb_store from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js';
// https://firebase.google.com/docs/web/setup#available-libraries

import { firebaseConfig } from './firebase_config.js';
import { variables } from './dom.js';

// Initialize Firebase
const app = fb_app.initializeApp(firebaseConfig);

const functions = fb_func.getFunctions(fb_app.getApp());
fb_func.connectFunctionsEmulator(functions, 'localhost', 5500);

// Storage
const storage = fb_store.getStorage(app);

function uploadImage(e) {
  const file = e.target.files[0];
  console.log(file);

  const storageRef = fb_store.ref(storage, file.name);
  console.log(storageRef);
  // // 'file' comes from the Blob or File API
  fb_store.uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
  console.log(file.name);
  fb_store
    .getDownloadURL(fb_store.ref(storage, file.name))
    .then((url) => {
      // `url` is the download URL for 'images/stars.jpg'
      console.log(url);
      // Or inserted into an <img> element
      const img = document.getElementById('myImg');
      console.log(img);
      img.setAttribute('src', url);
    })
    .catch((error) => {
      // Handle any errors
    });
}

variables.upload__file.addEventListener('change', uploadImage);
