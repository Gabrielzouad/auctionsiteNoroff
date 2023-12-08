import { apiUrl } from '../util/parameter.mjs';

const email = document.getElementById('email-address');
const username = document.getElementById('username');
const password = document.getElementById('password');
const buttonDOM = document.getElementById('registerSubmit');
const errorMessage = document.getElementById('error-message');

async function registerUser(e) {
  e.preventDefault();
  const userEmail = email.value.trim().toLowerCase();
  if (userEmail.endsWith('@stud.noroff.no')) {
    errorMessage.classList.add('hidden');
    try {
      const response = await fetch(apiUrl + '/auction/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: username.value,
          email: email.value,
          password: password.value,
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      const result = await response.json();
      if (response.ok) {
        // Check for a successful response status
        window.location.href = '.././index.html';
      } else {
        // Handle different error scenarios based on status codes or messages
        if (result && result.error) {
          console.log('Registration error:', result.error);
          // Handle specific error messages or display them to the user
        } else {
          console.log('Unknown registration error.');
          // Handle generic or unknown errors
        }
      }
    } catch (err) {
      console.log('Error during registration:', err);
    }
  } else {
    console.log('Invalid email domain. Please use a stud.noroff.no email.');
    errorMessage.classList.remove('hidden');
  }
}

buttonDOM.addEventListener('click', registerUser);
