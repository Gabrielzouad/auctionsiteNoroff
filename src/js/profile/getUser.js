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
        <div class="flex items-center rounded-md shadow md:flex-row-reverse">
          <p class="hidden mx-auto px-4 py-2 text-base font-medium md:flex">Credits</p>
          <p class="hidden mx-auto px-4 py-2 text-base font-medium md:flex">${credits}</p>
          <p class="mx-auto px-4 py-2 text-base font-medium md:flex">${
            profileData.name
          }</p>
          <a href="/profile.html" class="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-indigo-600 hover:bg-gray-50">
            <span class="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
              ${
                hasAvatar
                  ? `<img src="${profileData.avatar}" alt="Avatar"></img>`
                  : `<img src="/public/icons/icons8-user-50.png" alt="Avatar"></img>`
              }
            </span>
          </a>
        </div>`;

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
