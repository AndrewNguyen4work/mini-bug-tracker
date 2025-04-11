window.onload = () => {
  document.getElementById('title').focus();
}
// Get DOM elements
const bugForm = document.getElementById('bugForm');
const bugList = document.getElementById('bugList');
const filterDropdown = document.getElementById('filterStatus');
const addbugSuccess = document.getElementById('bugAdd')
// Array to store all bugs
let bugs = [];
// Current filter state
let currentFilter = 'All';

/**
 * Render all bugs in the 'bugs' array to the UI
 */
function renderBugs() {
  bugList.innerHTML = ''; // Clear previous list from UI

  // Iterate through each bug and create a list item
  bugs.forEach((bug, index) => {
     // Skip if bug doesn't match current filter
    if (currentFilter !== 'All' && bug.status !== currentFilter) return;
    const li = document.createElement('li');
    // Replace all whitespace characters with a hyphen (e.g., "In Progress" → "in-progress")
    // change to bug.severity to change color depend on "severity"
    li.className = `bug ${bug.severity.toLowerCase()}`;


    // Set the HTML structure of a bug entry
    // Includes title, description, severity, status, and a status toggle button
    li.innerHTML = `
      <strong>${bug.title}</strong> <br>
      ${bug.description} <br>
      Severity: <em>${bug.severity}</em> <br>
      Status: <strong>${bug.status}</strong> <br>
      <select onchange="changeStatus(this.value, ${index})">
  <option value="Open" ${bug.status === 'Open' ? 'selected' : ''}>Open</option>
  <option value="In Progress" ${bug.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
  <option value="Resolved" ${bug.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
  <option value="Closed" ${bug.status === 'Closed' ? 'selected' : ''}>Closed</option>
</select>
      <button onclick="deleteBug(${index})" style="margin-left: 10px; color: red;">Delete</button>

    `;

    // Append the list item to the bug list in the UI
    bugList.appendChild(li);
  });
}
function deleteBug(){
  bugs.splice(this, 1); // Remove 1 item at position index
  saveBugs();  
    renderBugs();
}

//After change button to select
  function changeStatus(newStatus, index) {
    bugs[index].status = newStatus;
    saveBugs(); // Update localStorage
    renderBugs(); // Refresh UI
  }
  // Save the current list of bugs to the browser's localStorage
// Convert the 'bugs' array into a JSON string before storing
function saveBugs() {
  localStorage.setItem('bugs', JSON.stringify(bugs));
}

// Load the list of bugs from localStorage (if available)
// If saved data exists, parse it back into an array and render it to the UI
function loadBugs() {
  const saved = localStorage.getItem('bugs');
  if (saved) {
    bugs = JSON.parse(saved); // Convert the JSON string back to an array of bug objects
    renderBugs(); // Display the loaded bugs on the UI
  }
}

filterDropdown.addEventListener('change', (e) => {
  currentFilter = e.target.value;
  renderBugs();
});
// Clear all bugs function
function clearAllBugs() {
  if (confirm('Are you sure? This will delete ALL bugs!')) {
    bugs = [];
    saveBugs();
    renderBugs();
  }
}

// Listen for the form submission event
bugForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the page from reloading

  // Get values from form inputs
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const severity = document.getElementById('severity').value;

  // Create a new bug object using the input values
  const newBug = {
    title,
    description,
    severity,
    status: 'Open'
  };
  
  // Add the new bug to the bugs array and re-render the list
  bugs.push(newBug);
  renderBugs();
  saveBugs();
  addbugSuccess.style.display = 'block';
setTimeout(() => {
  addbugSuccess.style.display = 'none';
}, 2000);

  // Reset the form inputs
  bugForm.reset();
  document.getElementById('title').focus();
});

loadBugs();
