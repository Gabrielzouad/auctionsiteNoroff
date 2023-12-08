import { apiUrl } from '../util/parameter.mjs';

const bearerToken = localStorage.getItem('accessToken');
const signOutUserButton = document.getElementById('signOutButton');
const profileDOM = document.getElementById('profile');

async function fetchProfileData() {
  const profileId = localStorage.getItem('userName');
  const options = {
    headers: { Authorization: 'bearer' + ' ' + bearerToken },
  };

  try {
    const response = await fetch(
      apiUrl + `/auction/profiles/${profileId}`,
      options
    );
    if (!response.ok) {
      throw new Error('Unable to fetch profile data');
    }

    const profileData = await response.json();
    return profileData;
  } catch (error) {
    console.error('Error fetching profile data:', error.message);
    return null;
  }
}

async function updateProfileDOM() {
  try {
    const profileData = await fetchProfileData();
    if (profileData && bearerToken !== null) {
      const credits = profileData.credits || 0;
      const hasAvatar = profileData.avatar !== null;

      profileDOM.innerHTML = `
        <span class="flex flex-row-reverse items-center rounded-md shadow">
          <p class="mx-auto px-4 py-2 text-base font-medium">Credits</p>
          <p class="mx-auto px-4 py-2 text-base font-medium">${credits}</p>
          <p class="mx-auto px-4 py-2 text-base font-medium">${
            profileData.name
          }</p>
          <a href="/profile.html" class="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-indigo-600 hover:bg-gray-50">
            <span class="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
              ${
                hasAvatar
                  ? `<img src="${profileData.avatar}" alt="Avatar"></img>`
                  : `<svg class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>`
              }
            </span>
          </a>
        </span>`;

      profileDOM.classList.remove('hidden');
      signOutUserButton.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error updating profile DOM:', error.message);
  }
}

updateProfileDOM();

function removeAuthButtonsIfLoggedIn() {
  const signUpButton = document.getElementById('signUp');
  const signInButton = document.getElementById('signIn');
  const bearerToken = localStorage.getItem('accessToken');

  if (bearerToken !== null) {
    signUpButton.style.display = 'none';
    signInButton.style.display = 'none';
  }
}

removeAuthButtonsIfLoggedIn();

function signOutUser() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userName');

  profileDOM.style.display = 'hidden';
  signOutUserButton.style.display = 'hidden';
  window.location.href = 'index.html';
}

signOutUserButton.addEventListener('click', signOutUser);
