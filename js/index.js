'use strict';

const LogIn = document.querySelector('.logIn');
const createAccount = document.querySelector('.createAccount');

LogIn.addEventListener('click', function () {
  document.querySelector('.loggingIn').style.display = 'block';
  document.querySelector('.creatingAccount').style.display = 'none';
});

createAccount.addEventListener('click', function () {
  document.querySelector('.loggingIn').style.display = 'none';
  document.querySelector('.creatingAccount').style.display = 'block';
});
