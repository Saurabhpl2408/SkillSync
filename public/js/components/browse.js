import {
  getUsers,
  getProjects,
  getAvailability,
  createRequest,
} from '../api.js';

let currentUserId = localStorage.getItem('currentUserId') || null;
let allUsers = [];
let allProjects = [];

export async function renderBrowse(container) {
  container.innerHTML = `
    <div class="browse-container">
      <h2>Browse Partners</h2>

      <div class="browse-filters card">
        <div class="filter-group">
          <label for="skill-filter">Filter by Skill:</label>
          <input type="text" id="skill-filter" placeholder="e.g., React, Node.js">
        </div>
        <div class="filter-group">
          <label for="project-filter">For Project:</label>
          <select id="project-filter">
            <option value="">Select a project (optional)</option>
          </select>
        </div>
        <button class="btn" id="apply-filters">Search</button>
        <button class="btn btn-secondary" id="clear-filters">Clear</button>
      </div>

      <div class="skill-gap-display card" id="skill-gap-display" style="display: none;">
        <h3>Skill Gap Analysis</h3>
        <div id="skill-gap-content"></div>
      </div>

      <div class="users-grid" id="users-grid">
        <p>Loading users...</p>
      </div>
    </div>
  `;

  await loadFilters();
  await loadUsers();
}

async function loadFilters() {
  try {
    allProjects = await getProjects('open');
    const projectFilter = document.getElementById('project-filter');
    
    const myProjects = allProjects.filter(p => p.owner_id === currentUserId);
    
    myProjects.forEach(project => {
      const option = document.createElement('option');
      option.value = project._id;
      option.textContent = project.title;
      projectFilter.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading filters:', error);
  }
}

async function loadUsers(skillFilter = '', projectId = '') {
  const usersGrid = document.getElementById('users-grid');
  const skillGapDisplay = document.getElementById('skill-gap-display');

  try {
    allUsers = await getUsers();
    let filteredUsers = allUsers.filter(user => user._id !== currentUserId);

    if (skillFilter) {
      const searchSkill = skillFilter.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        (user.skills || []).some(skill =>
          skill.toLowerCase().includes(searchSkill)
        )
      );
    }

    if (projectId) {
      const project = allProjects.find(p => p._id === projectId);
      if (project && project.skills_need) {
        document.getElementById('skill-gap-content').innerHTML = `
          <p><strong>Project:</strong> ${project.title}</p>
          <p><strong>Skills Needed:</strong></p>
          <div class="skills-container">
            ${project.skills_need.map(skill => `
              <span class="skill-tag skill-need">${skill}</span>
            `).join('')}
          </div>
        `;
        skillGapDisplay.style.display = 'block';

        filteredUsers = filteredUsers.filter(user =>
          (user.skills || []).some(skill =>
            project.skills_need.some(needed =>
              skill.toLowerCase().includes(needed.toLowerCase())
            )
          )
        );

        filteredUsers.sort((a, b) => {
          const aMatches = (a.skills || []).filter(skill =>
            project.skills_need.some(needed =>
              skill.toLowerCase().includes(needed.toLowerCase())
            )
          ).length;
          const bMatches = (b.skills || []).filter(skill =>
            project.skills_need.some(needed =>
              skill.toLowerCase().includes(needed.toLowerCase())
            )
          ).length;
          return bMatches - aMatches;
        });
      }
    } else {
      skillGapDisplay.style.display = 'none';
    }

    if (filteredUsers.length === 0) {
      usersGrid.innerHTML = `
        <div class="card">
          <p>No matching partners found. Try adjusting your filters.</p>
        </div>
      `;
      return;
    }

    usersGrid.innerHTML = filteredUsers.map(user => {
      const matchingSkills = projectId
        ? (user.skills || []).filter(skill => {
            const project = allProjects.find(p => p._id === projectId);
            return project && project.skills_need.some(needed =>
              skill.toLowerCase().includes(needed.toLowerCase())
            );
          })
        : [];

      return `
        <div class="card user-card">
          <h3>${user.name || 'Unnamed User'}</h3>
          <p class="user-email">${user.email || 'No email'}</p>
          
          <div class="skills-container">
            ${(user.skills || []).map(skill => `
              <span class="skill-tag ${matchingSkills.includes(skill) ? 'skill-match' : ''}">${skill}</span>
            `).join('') || '<span class="no-skills">No skills listed</span>'}
          </div>

          ${user.work_style ? `
            <div class="work-style-info">
              ${user.work_style.time_preference ? `<span class="work-badge">${user.work_style.time_preference}</span>` : ''}
              ${user.work_style.work_mode ? `<span class="work-badge">${user.work_style.work_mode}</span>` : ''}
            </div>
          ` : ''}

          ${user.github_url ? `
            <a href="${user.github_url}" target="_blank" class="github-link">View GitHub</a>
          ` : ''}

          <div class="user-actions">
            <button class="btn btn-small" data-view-availability="${user._id}">View Availability</button>
            ${projectId ? `
              <button class="btn btn-small" data-send-request="${user._id}" data-project="${projectId}">Send Request</button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    usersGrid.innerHTML = `<div class="card"><p>Error loading users: ${error.message}</p></div>`;
  }
}

export function initBrowseHandlers() {
  const applyFiltersBtn = document.getElementById('apply-filters');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const skillFilter = document.getElementById('skill-filter');
  const projectFilter = document.getElementById('project-filter');
  const usersGrid = document.getElementById('users-grid');

  applyFiltersBtn.addEventListener('click', () => {
    loadUsers(skillFilter.value, projectFilter.value);
  });

  clearFiltersBtn.addEventListener('click', () => {
    skillFilter.value = '';
    projectFilter.value = '';
    document.getElementById('skill-gap-display').style.display = 'none';
    loadUsers();
  });

  skillFilter.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loadUsers(skillFilter.value, projectFilter.value);
    }
  });

  projectFilter.addEventListener('change', () => {
    loadUsers(skillFilter.value, projectFilter.value);
  });

  usersGrid.addEventListener('click', async (e) => {
    if (e.target.matches('[data-view-availability]')) {
      const userId = e.target.getAttribute('data-view-availability');
      try {
        const slots = await getAvailability(userId);
        const user = allUsers.find(u => u._id === userId);
        
        if (slots.length === 0) {
          alert(`${user?.name || 'This user'} has not set their availability yet.`);
          return;
        }

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const availabilityByDay = {};
        days.forEach(day => availabilityByDay[day] = []);
        
        slots.forEach(slot => {
          if (availabilityByDay[slot.day]) {
            availabilityByDay[slot.day].push(`${slot.start_hour}:00 - ${slot.end_hour}:00`);
          }
        });

        let message = `${user?.name || 'User'}'s Availability:\n\n`;
        days.forEach(day => {
          if (availabilityByDay[day].length > 0) {
            message += `${day}: ${availabilityByDay[day].join(', ')}\n`;
          }
        });

        alert(message);
      } catch (error) {
        alert('Error loading availability: ' + error.message);
      }
    }

    if (e.target.matches('[data-send-request]')) {
      if (!currentUserId) {
        alert('Please create a profile first!');
        return;
      }

      const toUserId = e.target.getAttribute('data-send-request');
      const projectId = e.target.getAttribute('data-project');
      const project = allProjects.find(p => p._id === projectId);

      const message = prompt('Enter a message for your request:');
      if (message !== null) {
        try {
          const response = await fetch('/api/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              project_id: projectId,
              from_user_id: currentUserId,
              to_user_id: toUserId,
              message: message,
            }),
          });
          const result = await response.json();
          if (result.error) {
            alert(result.error);
          } else {
            alert('Request sent successfully!');
          }
        } catch (error) {
          alert('Error sending request: ' + error.message);
        }
      }
    }
  });
}

export function setCurrentUserId(userId) {
  currentUserId = userId;
  localStorage.setItem('currentUserId', userId);
}