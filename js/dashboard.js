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

let i = 0;

async function post(message) {
  //   const citiesRef = fb_fstore.doc(db, 'dashboard');

  //   const cityRef = fb_fstore.doc(db, 'dashboard', `${i}`);
  //   await fb_fstore.setDoc(cityRef, {
  //     user: '',
  //     message: message,
  //     timestamp: fb_fstore.serverTimestamp(),
  //   });

  //   const docRef = await fb_fstore.addDoc(fb_fstore.collection(db, 'dashboard'), {
  //     user: '',
  //     message: message,
  //     timestamp: fb_fstore.serverTimestamp(),
  //     //   index: i,
  //   });
  // i++;
  //   console.log('Document written with ID: ', docRef.id);

  const querySnapshot = await fb_fstore.getDocs(
    fb_fstore.collection(db, 'dashboard')
  );
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, ' => ', doc.data().message);
    uploadPost(doc.data().message);
  });
}

variables.btn__post.addEventListener('click', function () {
  const message = document.getElementById('search__post').value;
  //   console.log(message);
  post(message);
  //   uploadPost(message);
});

function uploadPost(message) {
  console.log('Button Working');
  const insertPost = document.createElement('article');
  insertPost.classList.add('post');
  insertPost.innerHTML = `
  <!-- Post Header -->
  <header class="post-header">
    <figure class="avatar-wrapper">
      <img
        src="https://avatars1.githubusercontent.com/u/1109686?v=4&s=460"
        class="avatar"
        alt="Post avatar"
      />
    </figure>
    <div class="content">
      <h3>Sabarinathan Masilamani</h3>
      <p class="title">User Experience Engineer</p>
    </div>
  </header>

  <!-- Post Content Section -->
  <section class="post-content">
    <p class="content">
      "${message}"
    </p>
    <div class="stats">
      <span clas="likes"> 100 Likes </span>
      <span class="comments"> . 10 Comments</span>
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
