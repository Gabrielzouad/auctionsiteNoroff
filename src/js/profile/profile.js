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

    await fetchAndDisplayUserListings(profileId, bearerToken);
    await fetchAndDisplayUserBids(profileId, bearerToken);
  } catch (error) {
    console.error('Error fetching profile data:', error.message);
  }
});

async function fetchAndDisplayUserListings(profileId, bearerToken) {
  try {
    const response = await fetch(
      `${apiUrl}/auction/profiles/${profileId}/listings`,
      {
        headers: { Authorization: `Bearer ${bearerToken}` },
      }
    );

    if (!response.ok) {
      throw new Error('Unable to fetch user listings');
    }

    const listingsData = await response.json();
    displayUserListings(listingsData);
  } catch (error) {
    console.error('Error fetching user listings:', error.message);
  }
}

async function fetchAndDisplayUserBids(profileId, bearerToken) {
  try {
    const response = await fetch(
      `${apiUrl}/auction/profiles/${profileId}/bids?_listings=true`,
      {
        headers: { Authorization: `Bearer ${bearerToken}` },
      }
    );

    if (!response.ok) {
      throw new Error('Unable to fetch user bids');
    }

    const bidsData = await response.json();
    displayUserBids(bidsData);
  } catch (error) {
    console.error('Error fetching user bids:', error.message);
  }
}

function displayUserListings(listings) {
  const userListingsElem = document.getElementById('userListings');
  console.log(listings);
  userListingsElem.innerHTML = listings
    .map(
      (listing) => `
      <div class="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      <article class="flex max-w-xl flex-col items-start justify-between">
        <div class="group relative">
          <h3 class="mt-3 text-lg font-semibold leading-6 text-blue-700">
            <a href="listingpage.html?id=${listing.id}">
              ${listing.title}
            </a>
          </h3>
          <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">${listing.description}</p>
        </div>
      </article>
      </div>
    `
    )
    .join('');
}

function displayUserBids(bids) {
  const userBidsElem = document.getElementById('userBids');

  userBidsElem.innerHTML = bids
    .map(
      (bid) => `
      <div class="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <article class="flex max-w-xl flex-col items-start justify-between">
          <div class="group relative">
            <h3 class="mt-3 text-lg font-semibold leading-6 text-blue-700">
              <a href="listingpage.html?id=${bid.listing.id}">
                ${bid.listing.title}
              </a>
            </h3>
            <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
              Bid Amount: ${bid.amount}
            </p>
          </div>
        </article>
      </div>
    `
    )
    .join('');
}
