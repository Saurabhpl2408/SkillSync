import { createUser, updateUser, getUser } from '../api.js';
import { setCurrentUser as setAvailabilityUser } from './availability.js';

let currentUser = null;
let skills = [];

export async function loadCurrentUser() {
  const userId = localStorage.getItem('currentUserId');
  if (userId) {
    try {
      currentUser = await getUser(userId);
      skills = currentUser.skills || [];
      return currentUser;
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('currentUserId');
      currentUser = null;
      skills = [];
    }
  }
  return null;
}

export function getCurrentUser() {
  return currentUser;
}

export function getCurrentUserId() {
  return localStorage.getItem('currentUserId');
}

export async function renderProfile(container) {
  await loadCurrentUser();

  container.innerHTML = `
    <div class="card profile-form">
      <h2>${currentUser ? 'Edit Profile' : 'Create Profile'}</h2>
      ${currentUser ? `<p class="current-user-info">Logged in as: <strong>${currentUser.name}</strong> (${currentUser.email})</p>` : ''}
      <form id="profile-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" name="name" required value="${currentUser?.name || ''}">
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required value="${currentUser?.email || ''}">
        </div>

        <div class="form-group">
          <label for="github_url">GitHub URL</label>
          <input type="url" id="github_url" name="github_url" placeholder="https://github.com/username" value="${currentUser?.github_url || ''}">
        </div>

        <div class="form-group">
          <label>Skills</label>
          <div class="skill-input-group">
            <input type="text" id="skill-input" placeholder="Add a skill (e.g., React, Node.js)">
            <button type="button" class="btn" id="add-skill-btn">Add</button>
          </div>
          <div class="skills-container" id="skills-container">
            ${skills
              .map(
                (skill) => `
              <span class="skill-tag">
                ${skill}
                <button type="button" data-skill="${skill}">&times;</button>
              </span>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="form-group">
          <label>Work Style Preferences</label>
          <div class="work-style-options">
            <div class="work-style-option ${currentUser?.work_style?.schedule === 'morning' ? 'selected' : ''}" data-style="schedule" data-value="morning">
              <strong>🌅 Morning Person</strong>
              <p>Prefer working early in the day</p>
            </div>
            <div class="work-style-option ${currentUser?.work_style?.schedule === 'night' ? 'selected' : ''}" data-style="schedule" data-value="night">
              <strong>🌙 Night Owl</strong>
              <p>Prefer working late</p>
            </div>
            <div class="work-style-option ${currentUser?.work_style?.mode === 'remote' ? 'selected' : ''}" data-style="mode" data-value="remote">
              <strong>🏠 Remote</strong>
              <p>Prefer online collaboration</p>
            </div>
            <div class="work-style-option ${currentUser?.work_style?.mode === 'in-person' ? 'selected' : ''}" data-style="mode" data-value="in-person">
              <strong>🏢 In-Person</strong>
              <p>Prefer meeting face-to-face</p>
            </div>
          </div>
        </div>

        <button type="submit" class="btn">${currentUser ? 'Update Profile' : 'Create Profile'}</button>
        ${currentUser ? '<button type="button" class="btn btn-danger" id="logout-btn">Logout</button>' : ''}
      </form>
    </div>
  `;
}

export function initProfileHandlers() {
  const form = document.getElementById('profile-form');
  const skillInput = document.getElementById('skill-input');
  const addSkillBtn = document.getElementById('add-skill-btn');
  const skillsContainer = document.getElementById('skills-container');
  const logoutBtn = document.getElementById('logout-btn');

  addSkillBtn.addEventListener('click', () => {
    const skill = skillInput.value.trim();
    if (skill && !skills.includes(skill)) {
      skills.push(skill);
      renderSkills();
      skillInput.value = '';
    }
  });

  skillInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkillBtn.click();
    }
  });

  skillsContainer.addEventListener('click', (e) => {
    if (e.target.matches('[data-skill]')) {
      const skillToRemove = e.target.getAttribute('data-skill');
      skills = skills.filter((s) => s !== skillToRemove);
      renderSkills();
    }
  });

  document.querySelectorAll('.work-style-option').forEach((option) => {
    option.addEventListener('click', () => {
      const style = option.getAttribute('data-style');
      document.querySelectorAll(`[data-style="${style}"]`).forEach((opt) => {
        opt.classList.remove('selected');
      });
      option.classList.add('selected');
    });
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUserId');
      currentUser = null;
      skills = [];
      alert('Logged out successfully!');
      window.location.reload();
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const workStyle = {};
    document.querySelectorAll('.work-style-option.selected').forEach((opt) => {
      workStyle[opt.getAttribute('data-style')] =
        opt.getAttribute('data-value');
    });

    const userData = {
      name: form.name.value,
      email: form.email.value,
      github_url: form.github_url.value,
      skills: skills,
      work_style: workStyle,
    };

    try {
      if (currentUser) {
        await updateUser(currentUser._id, userData);
        alert('Profile updated!');
      } else {
        const newUser = await createUser(userData);
        currentUser = newUser;
        localStorage.setItem('currentUserId', newUser._id);
        setAvailabilityUser(newUser._id);
        alert('Profile created! You are now logged in.');
      }
    } catch (error) {
      alert('Error saving profile: ' + error.message);
    }
  });
}

function renderSkills() {
  const container = document.getElementById('skills-container');
  container.innerHTML = skills
    .map(
      (skill) => `
    <span class="skill-tag">
      ${skill}
      <button type="button" data-skill="${skill}">&times;</button>
    </span>
  `
    )
    .join('');
}
