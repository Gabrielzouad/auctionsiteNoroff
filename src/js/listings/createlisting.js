import { apiUrl } from '../util/parameter.mjs';

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

  if (itemName && timeValue && imageValue) {
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

      if (response.ok) {
        const responseData = await response.json();
        window.href;
        console.log('Listing created:', responseData);
      } else {
        console.error('Failed to create listing:', response.status);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  } else {
    console.log('Error: Item name, time, and image URL are required fields');
  }
}

createListingButtonDOM.addEventListener('click', handleSubmit);
