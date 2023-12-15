import { apiUrl } from '../util/parameter.mjs';
import { displayError } from '../util/util.js';

const avatarForm = document.getElementById('avatarForm');
const avatarUrlInput = document.getElementById('avatarUrlInput');

avatarForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const avatarUrl = avatarUrlInput.value.trim();

  // Check if avatarUrl is empty or null
  if (!avatarUrl) {
    console.error('Avatar URL is empty');
    displayError('Avatar URL cannot be empty');
    return;
  }

  console.log(avatarUrl);

  try {
    const bearerToken = localStorage.getItem('accessToken');
    const profileId = localStorage.getItem('userName');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    };

    const response = await fetch(
      `${apiUrl}/auction/profiles/${profileId}/media`,
      {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ avatar: avatarUrl }),
      }
    );

    if (response.ok) {
      window.location.href = '/profile.html';
      console.log('Avatar updated successfully');
    } else {
      console.error('Failed to update avatar');
      const errorResponse = await response.json();
      const errorMessage = errorResponse.errors
        .map((err) => err.message)
        .join(', ');
      displayError('Failed to update avatar: ' + errorMessage);
    }
  } catch (error) {
    console.error('Error updating avatar:', error);
    displayError('Error updating avatar: ' + error.message);
  }
});
