import { getUsers } from './api.js';
import { renderProfile, initProfileHandlers } from './components/profile.js';
import {
  renderAvailability,
  initAvailabilityHandlers,
} from './components/availability.js';
import {
  renderProjects,
  initProjectsHandlers,
} from './components/projects.js';
import {
  renderRequests,
  initRequestsHandlers,
} from './components/requests.js';
import {
  renderBrowse,
  initBrowseHandlers,
} from './components/browse.js';

const app = document.getElementById('app');

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
}

function renderHome() {
  app.innerHTML = `
    <div class="card">
      <h2>Welcome to SkillSync</h2>
      <p>Find project partners based on complementary skills, not just friendship.</p>
      <br>
      <div class="home-features">
        <div class="feature">
          <h3>Create Your Profile</h3>
          <p>List your skills and work preferences</p>
          <button class="btn" data-page="profile">Get Started</button>
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