import { apiUrl } from '../util/parameter.mjs';

document.addEventListener('DOMContentLoaded', async function () {
  const userElem = document.getElementById('username');
  const emailElem = document.getElementById('email');
  const creditsElem = document.getElementById('credits');
  const winsElem = document.getElementById('wins');
  const profileImageElem = document.getElementById('profileImage');

  try {
    const bearerToken = localStorage.getItem('accessToken');
    const profileId = localStorage.getItem('userName');
    const options = {
      headers: { Authorization: `Bearer ${bearerToken}` },
    };

    const response = await fetch(
      `${apiUrl}/auction/profiles/${profileId}`,
      options
    );
    if (!response.ok) {
      throw new Error('Unable to fetch profile data');
    }

    const userData = await response.json();
    console.log(userData);

    if (userData.avatar && userData.avatar !== '') {
      // User image exists in userData
      profileImageElem.src = userData.avatar;
    } else {
      // User image doesn't exist or is empty, fallback to default image
      profileImageElem.src = 'public/icons/icons8-user-50.png';
    }

    emailElem.textContent = `${userData.email}`;
    creditsElem.textContent = `${userData.credits}`;
    userElem.textContent = `${userData.name}`;
    winsElem.textContent = `${userData.wins.length}`;
  } catch (error) {
    console.error('Error fetching profile data:', error.message);
  }
});
