export function getHighestBid(bids) {
  let highestBid = null;
  for (const bid of bids) {
    if (!highestBid || bid.amount > highestBid.amount) {
      highestBid = bid;
    }
  }
  return highestBid;
}

export function formatRemainingTime(endDate) {
  const ends = new Date(endDate);
  const current = new Date();
  const diff = ends - current;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
}

export function displayError(message) {
  const errorContainerDOM = document.getElementById('errorContainer');
  errorContainerDOM.innerHTML = message;
  errorContainerDOM.style.display = 'block';
}
