// Umami API settings (via Cloudflare Worker proxy)
const WEBSITE_ID = '7280d755-f756-4aca-b5ea-728e6e7340cc';
const getUnixTimestamp = (daysAgo = 0) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const timestamp = date.getTime();
    console.log('Generated timestamp:', { daysAgo, date: date.toISOString(), timestamp });
    if (isNaN(timestamp)) {
      console.error('NaN timestamp detected:', { daysAgo, date: date.toISOString() });
      const fallback = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);
      console.log('Using fallback timestamp:', fallback);
      return fallback;
    }
    return timestamp;
  } catch (error) {
    console.error('Error in getUnixTimestamp:', error, { daysAgo });
    const fallback = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);
    console.log('Using fallback timestamp due to error:', fallback);
    return fallback;
  }
};
const startDate = getUnixTimestamp(30); // 30 days ago (milliseconds)
const endDate = getUnixTimestamp(0); // Today (milliseconds)
console.log('Final API timestamps:', { startDate, endDate });
const API_URL = `https://effectbuilder.joseamirandavelez.workers.dev/api/umami/v1/websites/${WEBSITE_ID}/stats?startAt=${startDate}&endAt=${endDate}`;
const BREAKDOWN_URL = `https://effectbuilder.joseamirandavelez.workers.dev/api/umami/v1/websites/${WEBSITE_ID}/metrics?type=country&startAt=${startDate}&endAt=${endDate}&limit=5`;

// Fetch total visitors
async function fetchVisitorCount() {
  try {
    console.log('Fetching visitor count from:', API_URL);
    const response = await fetch(API_URL, {
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
    }
    const data = await response.json();
    const visitors = data.pageviews.value; // Umami uses pageviews as a proxy
    document.getElementById('visitorCount').textContent = `Total Page Views (Last 30 Days): ${visitors}`;
  } catch (error) {
    console.error('Error fetching visitor count:', error, error.stack);
    document.getElementById('visitorCount').textContent = 'Error loading visitor data';
  }
}

// Fetch top countries and render table/chart
async function fetchTopCountries() {
  try {
    console.log('Fetching country data from:', BREAKDOWN_URL);
    const response = await fetch(BREAKDOWN_URL, {
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP