import {
  getRequests,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
  deleteRequest,
  getUsers,
  getProjects,
} from '../api.js';

let currentUserId = localStorage.getItem('currentUserId') || null;

export function renderRequests(container) {
  container.innerHTML = `
    <div class="requests-container">
      <h2>Partner Requests</h2>

      <div class="requests-tabs">
        <button class="tab-btn active" data-tab="received">Received</button>
        <button class="tab-btn" data-tab="sent">Sent</button>
        <button class="tab-btn" data-tab="all">All</button>
      </div>

      <div class="requests-filter">
        <label for="request-status-filter">Filter by Status:</label>
        <select id="request-status-filter">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      <div class="requests-list" id="requests-list">
        <p>Loading requests...</p>
      </div>
    </div>
  `;

  loadRequests('received');
}

async function loadRequests(tab, status = '') {
  const requestsList = document.getElementById('requests-list');

  if (!currentUserId && tab !== 'all') {
    requestsList.innerHTML = `
      <div class="card">
        <p>Please create a profile to see your requests.</p>
        <button class="btn" data-page="profile">Create Profile</button>
      </div>
    `;
    return;
  }

  try {
    let requests;
    if (tab === 'received') {
      requests = await getReceivedRequests(currentUserId);
    } else if (tab === 'sent') {
      requests = await getSentRequests(currentUserId);
    } else {
      requests = await getRequests(status);
    }

    if (status && tab !== 'all') {
      requests = requests.filter(r => r.status === status);
    }

    const users = await getUsers();
    const projects = await getProjects();

    const usersMap = {};
    users.forEach(user => {
      usersMap[user._id] = user;
    });

    const projectsMap = {};
    projects.forEach(project => {
      projectsMap[project._id] = project;
    });

    if (requests.length === 0) {
      requestsList.innerHTML = `
        <div class="card">
          <p>No requests found.</p>
        </div>
      `;
      return;
    }

    requestsList.innerHTML = requests.map(request => {
      const fromUser = usersMap[request.from_user_id] || { name: 'Unknown User' };
      const toUser = usersMap[request.to_user_id] || { name: 'Unknown User' };
      const project = projectsMap[request.project_id] || { title: 'Unknown Project' };

      const isReceived = request.to_user_id === currentUserId;
      const isSent = request.from_user_id === currentUserId;

      return `
        <div class="card request-card">
          <div class="request-header">
            <h3>${project.title}</h3>
            <span class="status-badge status-${request.status}">${request.status}</span>
          </div>
          
          <div class="request-details">
            <p><strong>From:</strong> ${fromUser.name} ${isSent ? '(You)' : ''}</p>
            <p><strong>To:</strong> ${toUser.name} ${isReceived ? '(You)' : ''}</p>
            <p><strong>Message:</strong> ${request.message || 'No message'}</p>
            <p class="request-date"><strong>Date:</strong> ${new Date(request.created_at).toLocaleDateString()}</p>
          </div>

          ${fromUser.skills ? `
            <div class="requester-skills">
              <strong>Requester Skills:</strong>
              <div class="skills-container">
                ${fromUser.skills.map(skill => `
                  <span class="skill-tag">${skill}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="request-actions">
            ${isReceived && request.status === 'pending' ? `
              <button class="btn btn-small btn-success" data-accept="${request._id}">Accept</button>
              <button class="btn btn-small btn-danger" data-decline="${request._id}">Decline</button>
            ` : ''}
            ${isSent && request.status === 'pending' ? `
              <button class="btn btn-small btn-danger" data-cancel="${request._id}">Cancel</button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    requestsList.innerHTML = `<div class="card"><p>Error loading requests: ${error.message}</p></div>`;
  }
}

export function initRequestsHandlers() {
  const tabs = document.querySelectorAll('.tab-btn');
  const statusFilter = document.getElementById('request-status-filter');
  const requestsList = document.getElementById('requests-list');

  let currentTab = 'received';

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.getAttribute('data-tab');
      loadRequests(currentTab, statusFilter.value);
    });
  });

  statusFilter.addEventListener('change', () => {
    loadRequests(currentTab, statusFilter.value);
  });

  requestsList.addEventListener('click', async (e) => {
    if (e.target.matches('[data-accept]')) {
      const requestId = e.target.getAttribute('data-accept');
      try {
        await updateRequestStatus(requestId, 'accepted');
        alert('Request accepted!');
        loadRequests(currentTab, statusFilter.value);
      } catch (error) {
        alert('Error accepting request: ' + error.message);
      }
    }

    if (e.target.matches('[data-decline]')) {
      const requestId = e.target.getAttribute('data-decline');
      try {
        await updateRequestStatus(requestId, 'declined');
        alert('Request declined.');
        loadRequests(currentTab, statusFilter.value);
      } catch (error) {
        alert('Error declining request: ' + error.message);
      }
    }

    if (e.target.matches('[data-cancel]')) {
      const requestId = e.target.getAttribute('data-cancel');
      if (confirm('Are you sure you want to cancel this request?')) {
        try {
          await deleteRequest(requestId);
          alert('Request cancelled.');
          loadRequests(currentTab, statusFilter.value);
        } catch (error) {
          alert('Error cancelling request: ' + error.message);
        }
      }
    }
  });
}

export function setCurrentUserId(userId) {
  currentUserId = userId;
  localStorage.setItem('currentUserId', userId);
}