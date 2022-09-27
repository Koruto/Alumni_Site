import { firebaseConfig } from './firebase_config.js';
import {
  initializeApp,
  getApp,
} from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import {
  getFunctions,
  connectFunctionsEmulator,
} from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-functions.js';

import {
  doc,
  getFirestore,
  collection,
  addDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js';

const app = initializeApp(firebaseConfig);

const functions = getFunctions(getApp());
connectFunctionsEmulator(functions, 'localhost', 5500);

const db = getFirestore(app);

// try {
//   const docRef = await addDoc(collection(db, 'users'), {
//     first: 'Ada',
//     last: 'Lovelace',
//     born: 1815,
//   });
//   console.log('Document written with ID: ', docRef.id);
// } catch (e) {
//   console.error('Error adding document: ', e);
// }

// try {
//   const docRef = await addDoc(collection(db, 'users'), {
//     first: 'Alan',
//     middle: 'Mathison',
//     last: 'Turing',
//     born: 1912,
//   });

//   console.log('Document written with ID: ', docRef.id);
// } catch (e) {
//   console.error('Error adding document: ', e);
// }

// const querySnapshot = await getDocs(collection(db, 'users'));
// console.log(querySnapshot);
// querySnapshot.forEach((doc) => {
//   console.log(`${doc.id} => ${doc.data()}`);
// });

// await setDoc(doc(db, 'cities', 'LA'), {
//   name: 'Los Angeles',
//   state: 'CA',
//   country: 'USA',
// });

// const cityRef = doc(db, 'cities', 'BJ');
// setDoc(cityRef, { capital: true }, { merge: true });

// const docRef = await addDoc(collection(db, 'cities'), {
//   name: 'Tokyo',
//   country: 'Japan',
// });
// console.log('Document written with ID: ', docRef.id);

// // Add a new document with a generated id
// const newCityRef = doc(collection(db, 'cities'));

// // later...
// await setDoc(newCityRef, { name: 'Pikachu' });

// const username = prompt('Please Tell Us Your Name');
// document.getElementById('message-form').addEventListener('submit', sendMessage);

function sendMessage(e) {
  e.preventDefault();

  // get values to be submitted
  const timestamp = Date.now();
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value;

  // clear the input box
  messageInput.value = '';

  //auto scroll to bottom
  document
    .getElementById('messages')
    .scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });

  setDoc(doc(db, username, 'test'), {
    message: message,
    timestamp: serverTimestamp(),
  });
}

// const fetchChat = db.ref('messages/');

// fetchChat.on('child_added', function (snapshot) {
//   const messages = snapshot.val();
//   const message = `<li class=${
//     username === messages.username ? 'sent' : 'receive'
//   }><span>${messages.username}: </span>${messages.message}</li>`;
//   // append the message on the page
//   document.getElementById('messages').innerHTML += message;
// });

// const unsub = onSnapshot(doc(db, username, 'test'), (doc) => {
//   //   console.log('Current data: ', doc.data());
//   const messages = doc.data();
//   // ! It calls twice due to timestamp addition
//   const message = `<li class=${
//     username === messages?.username ? 'sent' : 'receive'
//   }><span>${messages.username}: </span>${messages.message}</li>`;
//   // append the message on the page
//   document.getElementById('messages').innerHTML += message;
// });
