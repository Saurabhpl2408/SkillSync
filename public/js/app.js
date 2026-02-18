import {
  renderProfile,
  initProfileHandlers,
  getCurrentUserId,
} from './components/profile.js';
import {
  renderAvailability,
  initAvailabilityHandlers,
} from './components/availability.js';
import { renderProjects, initProjectsHandlers } from './components/projects.js';
import { renderRequests, initRequestsHandlers } from './components/requests.js';
import { renderBrowse, initBrowseHandlers } from './components/browse.js';

const app = document.getElementById('app');

function updateNavbar() {
  const userId = localStorage.getItem('currentUserId');
  const navUl = document.querySelector('nav ul');

  if (navUl) {
    const existingStatus = document.getElementById('login-status');
    if (existingStatus) {
      existingStatus.remove();
    }

    if (userId) {
      const statusLi = document.createElement('li');
      statusLi.id = 'login-status';
      statusLi.innerHTML = '<span class="logged-in-badge">● Logged In</span>';
      navUl.appendChild(statusLi);
    }
  }
}

async function navigate(page) {
  switch (page) {
    case 'home':
      renderHome();
      break;
    case 'profile':
      await renderProfile(app);
      initProfileHandlers();
      break;
    case 'availability':
      await renderAvailability(app);
      initAvailabilityHandlers();
      break;
    case 'projects':
      renderProjects(app);
      initProjectsHandlers();
      break;
    case 'browse':
      renderBrowse(app);
      initBrowseHandlers();
      break;
    case 'requests':
      renderRequests(app);
      initRequestsHandlers();
      break;
    default:
      renderHome();
  }
  updateNavbar();
}

function renderHome() {
  const userId = localStorage.getItem('currentUserId');

  app.innerHTML = `
    <div class="card">
      <h2>Welcome to SkillSync</h2>
      <p>Find project partners based on complementary skills, not just friendship.</p>
      ${userId ? '<p class="logged-in-message">✓ You are logged in. Your data will be saved.</p>' : '<p class="not-logged-in-message">Create a profile to save your availability and projects.</p>'}
      <br>
      <div class="home-features">
        <div class="feature">
          <h3>${userId ? 'Edit Profile' : 'Create Profile'}</h3>
          <p>List your skills and work preferences</p>
          <button class="btn" data-page="profile">${userId ? 'View Profile' : 'Get Started'}</button>
        </div>
        <div class="feature">
          <h3>Set Availability</h3>
          <p>Mark when you can collaborate</p>
          <button class="btn" data-page="availability">Set Times</button>
        </div>
        <div class="feature">
          <h3>Post a Project</h3>
          <p>Describe what skills your team needs</p>
          <button class="btn" data-page="projects">Post Project</button>
        </div>
        <div class="feature">
          <h3>Find Partners</h3>
          <p>Browse users with complementary skills</p>
          <button class="btn" data-page="browse">Browse</button>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('click', (e) => {
  if (e.target.matches('[data-page]')) {
    e.preventDefault();
    const page = e.target.getAttribute('data-page');
    navigate(page);
  }
});

navigate('home');
