// Import the functions you need from the SDKs you need
import * as fb_app from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import * as fb_auth from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import * as fb_func from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-functions.js';
import * as fb_store from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js';
import * as fb_fstore from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js';

// https://firebase.google.com/docs/web/setup#available-libraries

import { firebaseConfig } from './firebase_config.js';
import { variables } from './dom.js';

// Initialize Firebase
const app = fb_app.initializeApp(firebaseConfig);
const db = fb_fstore.getFirestore(app);
const storage = fb_store.getStorage(app);

const functions = fb_func.getFunctions(fb_app.getApp());
fb_func.connectFunctionsEmulator(functions, 'localhost', 5500);

// Authentication

const auth = fb_auth.getAuth();

let i = 0;
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

async function loadPost() {
  const querySnapshot = await fb_fstore.getDocs(
    fb_fstore.collection(db, 'dashboard')
  );
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, ' => ', doc.data().message);
    const uid = doc.data().user;
    let ALUMNI = doc.data().alumni;
    user.alumni ? (ALUMNI = 'Alumni') : (ALUMNI = 'Student');
    writeInDom(
      doc.data().message,
      doc.data().pfp,
      doc.data().name,
      ALUMNI,
      doc.data().photo
    );
  });
}

variables.btn__post.addEventListener('click', function (e) {
  e.preventDefault();
  // const message = document.getElementById('search__post').value;
  // console.log(message);
  // // post(message);
  // const uid = user.user_uid;
  // let ALUMNI;
  // user.alumni ? (ALUMNI = 'Alumni') : (ALUMNI = 'Student');
  // const file = document.getElementById('image__file').files[0];
  // console.log(file);
  // uploadPost(message, uid, user.profilePhoto, user.displayName, ALUMNI);
  const file = document.getElementById('image__file').files[0];
  console.log(file);
  uploadImage(file);
});

async function uploadPost(message, uid, pfp, name, alumni, url) {
  console.log('Button Working');

  const docRef = await fb_fstore
    .addDoc(fb_fstore.collection(db, 'dashboard'), {
      message: message,
      user: uid,
      pfp: user.profilePhoto,
      name: user.displayName,
      alumni: user.alumni,
      photo: url,
      timestamp: fb_fstore.serverTimestamp(),
    })
    .then(() => {
      writeInDom(message, pfp, name, alumni, url);
      console.log('Uploaded');
    });

  // console.log('Document written with ID: ', docRef.id);
}

function writeInDom(message, pfp, name, alumni, url) {
  const insertPost = document.createElement('article');
  insertPost.classList.add('post');
  insertPost.innerHTML = `
  <!-- Post Header -->
  <header class="post-header">
    <figure class="avatar-wrapper">
      <img
        src="${pfp}"
        class="avatar"
        alt="Post avatar"
      />
    </figure>
    <div class="content">
      <h3>${name}</h3>
      <p class="title">${alumni}</p>
    </div>
  </header>

  <!-- Post Content Section -->
  <section class="post-content">
  <img src="${url}" class="resize__img" onerror='this.style.display = "none"' alt="" />
    <p class="content">
      ${message}
    </p>
    <div class="stats">
      <span clas="likes"> 0 Likes </span>
      <span class="comments"> . 0 Comments</span>
    </div>
    <div class="post-controls">
      <button class="btn btn-like">
        <i class="fa fa-thumbs-up" aria-hidden="true"></i> Like
      </button>
      <button class="btn btn-comment">
        <i class="fa fa-comment" aria-hidden="true"></i> Comment
      </button>
      <button class="btn btn-share">
        <i class="fa fa-share" aria-hidden="true"></i> Share
      </button>
    </div>
  </section>

  <!-- Post Comments Section -->
  <section class="post-comment-feed hidden">
    <div class="comment">
      <figure class="avatar-wrapper">
        <img
          src="https://avatars1.githubusercontent.com/u/1109686?v=4&s=460"
          class="avatar"
          alt="Post avatar"
        />
      </figure>
      <div class="content">
        <span class="user"> Sabarinathan Masilamani </span>
        <span class="text">
          Wow. This is a great experience working on LinkedIn Post
          Codepen design.
        </span>
        <h5 class="updated">10hr.</h5>
      </div>
    </div>

    <div class="comment">
      <figure class="avatar-wrapper">
        <img
          src="https://avatars1.githubusercontent.com/u/1109686?v=4&s=460"
          class="avatar"
          alt="Post avatar"
        />
      </figure>
      <div class="content">
        <span class="user"> Sabarinathan Masilamani </span>
        <span class="text">
          More to come this week. Applying CSS and Design skills.
        </span>
        <h5 class="updated">8hr.</h5>
      </div>
    </div>

    <div class="add-comment">
      <figure class="avatar-wrapper">
        <img
          src="https://avatars1.githubusercontent.com/u/1109686?v=4&s=460"
          class="avatar"
          alt="Post avatar"
        />
      </figure>
      <div class="textfield">
        <input
          type="text"
          name="comment"
          placeholder="Add a comment"
        />
        <button class="btn btn-camera">
          <i class="fa fa-camera-retro" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </section>`;
  console.log(insertPost);
  document
    .querySelector('.posts')
    .insertAdjacentElement('afterbegin', insertPost);
}

function uploadImage(file) {
  if (file?.name) {
    const storageRef = fb_store.ref(storage, file?.name);
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
        const message = document.getElementById('search__post').value;
        document.getElementById('search__post').value = '';
        console.log(message);
        // post(message);
        const uid = user.user_uid;
        let ALUMNI;
        user.alumni ? (ALUMNI = 'Alumni') : (ALUMNI = 'Student');

        uploadPost(
          message,
          uid,
          user.profilePhoto,
          user.displayName,
          ALUMNI,
          url
        );
      })
      .catch((error) => {
        // Handle any errors
      });
  } else {
    const message = document.getElementById('search__post').value;
    document.getElementById('search__post').value = '';
    console.log(message);
    // post(message);
    const uid = user.user_uid;
    let ALUMNI;
    user.alumni ? (ALUMNI = 'Alumni') : (ALUMNI = 'Student');
    uploadPost(message, uid, user.profilePhoto, user.displayName, ALUMNI, null);
  }
}
