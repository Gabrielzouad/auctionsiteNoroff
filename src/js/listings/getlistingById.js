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
const bids = data.bids;
const highestBid = getHighestBid(bids);

if (highestBid === null) {
  itemCurrentBidDOM.innerHTML = 'There are no bids on this item';
} else {
  itemCurrentBidDOM.innerHTML = ` The highest bid is <span class="font-bold">${highestBid.amount}</span> by ${highestBid.bidderName}.`;
}

async function postBid(highestBid) {
  const price = document.getElementById('bid-amount').value;
  const currentBid =
    highestBid && highestBid.amount !== null ? highestBid.amount : 0;
  console.log(currentBid);

  const placeBid = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${bearerToken}`,
    },
    body: JSON.stringify({
      amount: parseInt(price),
    }),
  };

  if (isNaN(Number(price))) {
    // Log an error message if the price is not a valid number
    console.log('this is not a valid number');
  }

  if (price > currentBid) {
    try {
      // Make the API request to place the bid
      const bidResult = await fetch(
        apiUrl + `/auction/listings/${id}/bids`,
        placeBid
      );
      const json = await bidResult.json();
      location.reload();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  } else console.error('not working');
}

itemAddBidDOM.addEventListener('click', (e) => {
  e.preventDefault();
  postBid(highestBid);
});
