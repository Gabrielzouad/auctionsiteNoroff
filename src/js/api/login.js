import { apiUrl } from '../util/parameter.mjs';

const email = document.getElementById('email-address');
const password = document.getElementById('password');
const loginFormDOM = document.querySelector('form');

async function loginSubmitHandler() {
  try {
    const response = await fetch(apiUrl + '/auction/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    const { name, accessToken } = await response.json();
    localStorage.setItem('userName', name);
    localStorage.setItem('accessToken', accessToken);
    console.log(response);

    if (response.status === 200) {
      window.location.href = '.././index.html';
    } else {
      console.log(response.status);
    }
  } catch (e) {
    console.log(e);
  }
}

loginFormDOM.addEventListener('submit', (e) => {
  e.preventDefault();
  loginSubmitHandler(e);
});
