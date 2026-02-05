import { getUsers, createUser, updateUser, deleteUser } from './api.js';
import { renderProfile, initProfileHandlers } from './components/profile.js';
import {
  renderAvailability,
  initAvailabilityHandlers,
} from './components/availability.js';

const app = document.getElementById('app');

// Simple client-side routing
function navigate(page) {
  switch (page) {
    case 'home':
      renderHome();
      break;
    case 'profile':
      renderProfile(app);
      initProfileHandlers();
      break;
    case 'availability':
      renderAvailability(app);
      initAvailabilityHandlers();
      break;
    case 'browse':
      renderBrowse();
      break;
    default:
      renderHome();
  }
}

function renderHome() {
  app.innerHTML = `
    <div class="card">
      <h2>Welcome to SkillSync</h2>
      <p>Find project partners based on complementary skills, not just friendship.</p>
      <br>
      <p>Get started by creating your profile and setting your availability.</p>
      <br>
      <button class="btn" data-page="profile">Create Profile</button>
    </div>
  `;
}

async function renderBrowse() {
  app.innerHTML = `<div class="card"><p>Loading users...</p></div>`;

  try {
    const users = await getUsers();

    if (users.length === 0) {
      app.innerHTML = `
        <div class="card">
          <h2>Browse Partners</h2>
          <p>No users found. Be the first to create a profile!</p>
        </div>
      `;
      return;
    }

    app.innerHTML = `
      <h2>Browse Partners</h2>
      <div class="users-grid">
        ${users
          .map(
            (user) => `
          <div class="card user-card" data-id="${user._id}">
            <h3>${user.name || 'Unnamed User'}</h3>
            <p>${user.email || 'No email'}</p>
            <div class="skills-container">
              ${(user.skills || [])
                .map(
                  (skill) => `
                <span class="skill-tag">${skill}</span>
              `
                )
                .join('')}
            </div>
            ${user.github_url ? `<a href="${user.github_url}" target="_blank">GitHub</a>` : ''}
          </div>
        `
          )
          .join('')}
      </div>
    `;
  } catch (error) {
    app.innerHTML = `<div class="card"><p>Error loading users: ${error.message}</p></div>`;
  }
}

// Navigation event listeners
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-page]')) {
    e.preventDefault();
    const page = e.target.getAttribute('data-page');
    navigate(page);
  }
});

// Initial render
navigate('home');
