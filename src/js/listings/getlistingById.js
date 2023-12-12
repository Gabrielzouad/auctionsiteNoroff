import { apiUrl } from '../util/parameter.mjs';
import { formatRemainingTime, getHighestBid } from '../util/util.js';

const bearerToken = localStorage.getItem('accessToken');
const itemHeaderDOM = document.getElementById('itemHeader');
const itemDescriptionDOM = document.getElementById('itemDescription');
const itemCurrentBidDOM = document.getElementById('itemCurrentBid');
const itemTimeLeftDOM = document.getElementById('itemTimeLeft');
const itemImageContainerDOM = document.getElementById('itemImageContainer');
const itemAddBidDOM = document.getElementById('addBiddingButton');

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get('id');

const options = {
  headers: { Authorization: 'bearer' + '' + bearerToken },
};

const response = await fetch(
  apiUrl + `/auction/listings/${id}?_bids=true&_seller=true`,
  options
);

const data = await response.json();

itemHeaderDOM.innerHTML = data.title;
itemDescriptionDOM.innerHTML = data.description;
itemImageContainerDOM.innerHTML = `<img src="${data.media[0]}" class="h-full w-full object-cover object-center">`;

// Calculate the number of days, hours, minutes, and seconds remaining for the item
setInterval(() => {
  itemTimeLeftDOM.innerHTML = formatRemainingTime(data.endsAt);
}, 300);

// finds the highest bidder for the given item
const highestBid = getHighestBid(data.bids);

if (highestBid === null) {
  itemCurrentBidDOM.innerHTML = 'There are no bids on this item';
} else {
  itemCurrentBidDOM.innerHTML = ` The highest bid is <span class="font-bold">${highestBid.amount}</span> by ${highestBid.bidderName}.`;
}

async function postBid(bearerToken, apiUrl, id) {
  const priceInput = document.getElementById('bid-amount');
  const price = parseInt(priceInput.value, 10);

  if (isNaN(price)) {
    console.error('Invalid bid amount: not a number');
    return;
  }

  try {
    const bidResponse = await fetch(`${apiUrl}/auction/listings/${id}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${bearerToken}`,
      },
      body: JSON.stringify({ amount: price }),
    });

    if (!bidResponse.ok) {
      throw new Error('Failed to place bid');
    }

    // Re-fetch the updated auction listing data
    await updateAuctionListing(bearerToken, apiUrl, id);
    // Clear the bid input field
    priceInput.value = '';
  } catch (error) {
    console.error('Error placing bid:', error);
  }
}

async function updateAuctionListing(bearerToken, apiUrl, id) {
  try {
    const response = await fetch(
      apiUrl + `/auction/listings/${id}?_bids=true&_seller=true`,
      { headers: { Authorization: 'bearer ' + bearerToken } }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch updated listing');
    }
    const updatedData = await response.json();

    // Update the UI with the new data
    displayAuctionListing(updatedData);
  } catch (error) {
    console.error('Error updating auction listing:', error);
  }
}

function displayAuctionListing(data) {
  itemHeaderDOM.innerHTML = data.title;
  itemDescriptionDOM.innerHTML = data.description;
  itemImageContainerDOM.innerHTML = `<img src="${data.media[0]}" class="h-full w-full object-cover object-center">`;
  itemTimeLeftDOM.innerHTML = formatRemainingTime(data.endsAt);

  const highestBid = getHighestBid(data.bids);
  if (highestBid === null) {
    itemCurrentBidDOM.innerHTML = 'There are no bids on this item';
  } else {
    itemCurrentBidDOM.innerHTML = `The highest bid is <span class="font-bold">${highestBid.amount}</span> by ${highestBid.bidderName}.`;
  }
}

itemAddBidDOM.addEventListener('click', (e) => {
  e.preventDefault();
  postBid(bearerToken, apiUrl, id);
});
