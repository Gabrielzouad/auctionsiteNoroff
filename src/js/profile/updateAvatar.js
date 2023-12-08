import { apiUrl } from '../util/parameter.mjs';

const avatarForm = document.getElementById('avatarForm');
const avatarUrlInput = document.getElementById('avatarUrlInput');

avatarForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const avatarUrl = avatarUrlInput.value.trim();

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
      // You may update the displayed avatar or provide feedback to the user
    } else {
      console.error('Failed to update avatar');
    }
  } catch (error) {
    console.error('Error updating avatar:', error);
  }
});
