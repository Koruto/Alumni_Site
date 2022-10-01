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

let chatTo;
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
  loadMsg('iNyGQWqeFuUvz39R4US7');
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

async function addChatID(chat_id, user_id) {
  const chatRef = fb_fstore.doc(db, 'users', user_id);

  await fb_fstore.updateDoc(chatRef, {
    chats: fb_fstore.arrayUnion(chat_id),
  });
}

async function sendMessage(chat_id, sender_id, message) {
  console.log('Called');

  const docRef = await fb_fstore.addDoc(
    fb_fstore.collection(db, 'chats', chat_id, 'messages'),
    {
      sender_id: sender_id,
      message: message,
      timestamp: fb_fstore.serverTimestamp(),
    }
  );
  console.log('Document written with ID: ', docRef.id);
  writeInDom(user.profilePhoto, message);
  //   addChatID(docRef.id, chatTo);
  //   addChatID(docRef.id, user.user_uid);
}

document.querySelector('.send__msg').addEventListener('click', function (e) {
  e.preventDefault();
  const message = document.getElementById('msg__value').value;
  document.getElementById('msg__value').value = '';
  sendMessage('iNyGQWqeFuUvz39R4US7', user.user_uid, message);
});

document
  .getElementById('msg__value')
  .addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const message = document.getElementById('msg__value').value;
      document.getElementById('msg__value').value = '';
      sendMessage('iNyGQWqeFuUvz39R4US7', user.user_uid, message);
    }
  });

async function loadMsg(chat_id) {
  const q = fb_fstore.query(
    fb_fstore.collection(db, 'chats', chat_id, 'messages'),
    fb_fstore.orderBy('timestamp', 'asc')
  );

  const querySnapshot = await fb_fstore.getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    fb_fstore
      .getDoc(fb_fstore.doc(db, 'users', doc.data().sender_id))
      .then((person) => {
        writeInDom(person.data().photoURL, doc.data().message);
        // return person.data().photoURL;
      });
  });
}

// function getPfp(id) {
//   fb_fstore.getDoc(fb_fstore.doc(db, 'users', id)).then((person) => {
//     return person.data().photoURL;
//   });
// }

// getPfp('tuvoPlFW1udUqFxoIpXen9wVVvp1');

function writeInDom(pfp, message) {
  const insertPost = document.createElement('li');
  insertPost.classList.add('message');
  insertPost.innerHTML = `<figure class="avatar-wrapper">
  <img
    src="${pfp}"
    class="avatar"
    alt="Post avatar"
  />
</figure>
<span class="txt_msg">${message}</span>`;
  console.log(insertPost);
  document
    .querySelector('.messages')
    .insertAdjacentElement('beforeend', insertPost);
  insertPost.scrollIntoView();
}
