import { apiUrl } from '../util/parameter.mjs';
import { displayError } from '../util/util.js';

const bearerToken = localStorage.getItem('accessToken');
const itemNameInputDOM = document.getElementById('itemNameInput');
const descriptionInputDOM = document.getElementById('descriptionInput');
const categoryNameInputDOM = document.getElementById('categoryInput');
const imageInputDOM = document.getElementById('imageInput');
const timeInputDOM = document.getElementById('timeInput');
const createListingButtonDOM = document.getElementById('createListingButton');

async function handleSubmit(e) {
  e.preventDefault();

  const itemName = itemNameInputDOM.value.trim();
  const timeValue = timeInputDOM.value.trim();
  const imageValue = imageInputDOM.value.trim();

  if (!itemName || !timeValue || !imageValue) {
    displayError('Item name, time, and image URL are required fields');
    return;
  }

  try {
    const newListing = {
      title: itemName,
      description: descriptionInputDOM.value || '',
      tags: [categoryNameInputDOM.value] || [],
      media: [imageValue],
      endsAt: timeValue,
    };

    const response = await fetch(`${apiUrl}/auction/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(newListing),
    });

    if (!response.ok) {
      const errorData = await response.json();
      displayError(
        'Failed to create listing: ' +
          (errorData.message || 'Unknown error, try again...')
      );
      return;
    }

    const responseData = await response.json();
    console.log('Listing created:', responseData);
    window.location.href = '/listings.html';
  } catch (error) {
    console.error('Error creating listing:', error);
    displayError('Error creating listing: ' + error.message);
  }
}

createListingButtonDOM.addEventListener('click', handleSubmit);
