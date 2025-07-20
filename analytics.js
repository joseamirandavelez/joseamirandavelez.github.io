// Umami API settings (via proxy)
const WEBSITE_ID = '7280d755-f756-4aca-b5ea-728e6e7340cc';
const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const endDate = new Date().toISOString().split('T')[0];
const API_URL = `https://effectbuilder.joseamirandavelez.workers.dev/api/umami/v1/websites/${WEBSITE_ID}/stats?startAt=${startDate}&endAt=${endDate}`;
const BREAKDOWN_URL = `https://effectbuilder.joseamirandavelez.workers.dev/api/umami/v1/websites/${WEBSITE_ID}/metrics?type=country&startAt=${startDate}&endAt=${endDate}&limit=5`;

// Fetch total visitors
async function fetchVisitorCount() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    const visitors = data.pageviews.value; // Umami uses pageviews as a proxy
    document.getElementById('visitorCount').textContent = `Total Page Views (Last 30 Days): ${visitors}`;
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    document.getElementById('visitorCount').textContent = 'Error loading visitor data';
  }
}

// Fetch top countries and render table/chart
async function fetchTopCountries() {
  try {
    const response = await fetch(BREAKDOWN_URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    const countries = data;

    // Populate table
    const tbody = document.querySelector('#countryTable tbody');
    tbody.innerHTML = countries.map(item => `
      <tr>
        <td>${item.x || 'Unknown'}</td>
        <td>${item.y}</td>
      </tr>
    `).join('');

    // Render Chart.js bar chart
    const ctx = document.getElementById('countryChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: countries.map(item => item.x || 'Unknown'),
        datasets: [{
          label: 'Visitors by Country',
          data: countries.map(item => item.y),
          backgroundColor: ['#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED'],
          borderColor: ['#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED'],
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Visitors' } },
          x: { title: { display: true, text: 'Country' } },
        },
        plugins: { legend: { display: false } },
      },
    });
  } catch (error) {
    console.error('Error fetching country data:', error);
    document.querySelector('#countryTable tbody').innerHTML = '<tr><td colspan="2">Error loading country data</td></tr>';
  }
}

// Initialize
fetchVisitorCount();
fetchTopCountries();


api_ZIQ4GZsaiDOnfS3LIEbqniqFSaGuahTg