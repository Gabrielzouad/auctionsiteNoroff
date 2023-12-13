import { apiUrl } from '../util/parameter.mjs';

const listingsDOM = document.getElementById('listings');
const searchInputDOM = document.getElementById('searchInput');
const prevButtonDOM = document.getElementById('prev-button');
const nextButtonDOM = document.getElementById('next-button');
const bearerToken = localStorage.getItem('accessToken');

const options = {
  headers: { Authorization: 'Bearer ' + bearerToken },
};

let offset = 0;

prevButtonDOM.addEventListener('click', async () => {
  if (offset > 0) {
    offset -= 50;
    await updateListings();
  }
});

nextButtonDOM.addEventListener('click', async () => {
  offset += 50;
  await updateListings();
});

async function fetchAndRenderListings(query) {
  try {
    const response = await fetch(
      `${apiUrl}/auction/listings?sortOrder=asc&_active=true&limit=100&offset=${offset}`,
      options
    );

    if (response.ok) {
      const data = await response.json();

      if (data.length === 0) {
        // If no listings are returned, display a message
        listingsDOM.innerHTML = '<p>No listings available for your search.</p>';
        return; // Exit the function early
      }

      listingsDOM.innerHTML = '';
      data.forEach((listing) => {
        if (
          listing.title.toLowerCase().includes(query) &&
          (!(listing.media.length == 0) || listing.media === null)
        ) {
          const listingLink =
            bearerToken !== null
              ? `listingPage.html?id=${listing.id}`
              : 'signUp.html';

          listingsDOM.innerHTML += `
            <a id="${listing.id}" href="${listingLink}" class="group">
              <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                <img src="${listing.media[0]}" alt="${listing.title}" class="h-full w-full object-cover object-center group-hover:opacity-75">
              </div>
              <h3 class="mt-4 text-sm text-gray-700">${listing.title}</h3>
              <p class="mt-1 text-lg font-thin text-gray-500">Total bids <span class="text-gray-900 font-bold">${listing._count.bids}</span></p>
            </a>`;
        }
      });

      if (listingsDOM.innerHTML === '') {
        // Display the message if no listings match the query
        listingsDOM.innerHTML = '<p>No listings available for your search.</p>';
      }
    } else {
      console.error('Failed to fetch listings:', response.status);
      displayError('Failed to fetch listings.');
    }
  } catch (error) {
    console.error('Error fetching listings:', error);
    displayError('Error fetching listings.');
  }
}

async function updateListings() {
  const query = searchInputDOM.value.trim().toLowerCase();
  await fetchAndRenderListings(query);
}

const debouncedSearch = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

searchInputDOM.addEventListener(
  'input',
  debouncedSearch((event) => {
    const query = searchInputDOM.value.trim().toLowerCase();

    if (query !== '') {
      fetchAndRenderListings(query);
    } else {
      fetchAndRenderListings('');
    }
  }, 300)
);
fetchAndRenderListings('');
