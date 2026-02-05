import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getUsers,
} from '../api.js';

let currentUserId = localStorage.getItem('currentUserId') || null;
let skillsHave = [];
let skillsNeed = [];
let editingProjectId = null;

export function renderProjects(container) {
  container.innerHTML = `
    <div class="projects-container">
      <div class="projects-header">
        <h2>Projects</h2>
        <button class="btn" id="show-create-form">Create New Project</button>
      </div>

      <div class="project-form-container card" id="project-form-container" style="display: none;">
        <h3 id="form-title">Create New Project</h3>
        <form id="project-form">
          <div class="form-group">
            <label for="project-title">Project Title</label>
            <input type="text" id="project-title" name="title" required placeholder="Enter project title">
          </div>

          <div class="form-group">
            <label for="project-description">Description</label>
            <textarea id="project-description" name="description" rows="3" placeholder="Describe your project"></textarea>
          </div>

          <div class="form-group">
            <label>Skills You Have</label>
            <div class="skill-input-group">
              <input type="text" id="skill-have-input" placeholder="Add a skill you have">
              <button type="button" class="btn" id="add-skill-have">Add</button>
            </div>
            <div class="skills-container" id="skills-have-container"></div>
          </div>

          <div class="form-group">
            <label>Skills You Need</label>
            <div class="skill-input-group">
              <input type="text" id="skill-need-input" placeholder="Add a skill you need">
              <button type="button" class="btn" id="add-skill-need">Add</button>
            </div>
            <div class="skills-container" id="skills-need-container"></div>
          </div>

          <div class="form-group" id="status-group" style="display: none;">
            <label for="project-status">Status</label>
            <select id="project-status" name="status">
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn" id="submit-btn">Create Project</button>
            <button type="button" class="btn btn-secondary" id="cancel-form">Cancel</button>
          </div>
        </form>
      </div>

      <div class="projects-filter">
        <label for="status-filter">Filter by Status:</label>
        <select id="status-filter">
          <option value="">All Projects</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div class="projects-list" id="projects-list">
        <p>Loading projects...</p>
      </div>
    </div>
  `;

  loadProjects();
}

async function loadProjects(status = '') {
  const projectsList = document.getElementById('projects-list');
  
  try {
    const projects = await getProjects(status);
    const users = await getUsers();
    const usersMap = {};
    users.forEach(user => {
      usersMap[user._id] = user;
    });

    if (projects.length === 0) {
      projectsList.innerHTML = `
        <div class="card">
          <p>No projects found. Create one to get started!</p>
        </div>
      `;
      return;
    }

    projectsList.innerHTML = projects.map(project => {
      const owner = usersMap[project.owner_id] || { name: 'Unknown User' };
      return `
        <div class="card project-card" data-id="${project._id}">
          <div class="project-header">
            <h3>${project.title}</h3>
            <span class="status-badge status-${project.status}">${project.status}</span>
          </div>
          <p class="project-description">${project.description || 'No description provided'}</p>
          <p class="project-owner">Posted by: ${owner.name}</p>
          
          <div class="skill-gap-analysis">
            <div class="skills-section">
              <strong>Has:</strong>
              <div class="skills-container">
                ${(project.skills_have || []).map(skill => `
                  <span class="skill-tag skill-have">${skill}</span>
                `).join('') || '<span class="no-skills">None listed</span>'}
              </div>
            </div>
            <div class="skills-section">
              <strong>Needs:</strong>
              <div class="skills-container">
                ${(project.skills_need || []).map(skill => `
                  <span class="skill-tag skill-need">${skill}</span>
                `).join('') || '<span class="no-skills">None listed</span>'}
              </div>
            </div>
          </div>

          <div class="project-actions">
            ${project.owner_id === currentUserId ? `
              <button class="btn btn-small" data-edit="${project._id}">Edit</button>
              <button class="btn btn-small btn-danger" data-delete="${project._id}">Delete</button>
            ` : `
              <button class="btn btn-small" data-apply="${project._id}" data-owner="${project.owner_id}">Apply to Join</button>
            `}
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    projectsList.innerHTML = `<div class="card"><p>Error loading projects: ${error.message}</p></div>`;
  }
}

export function initProjectsHandlers() {
  const showFormBtn = document.getElementById('show-create-form');
  const formContainer = document.getElementById('project-form-container');
  const form = document.getElementById('project-form');
  const cancelBtn = document.getElementById('cancel-form');
  const statusFilter = document.getElementById('status-filter');
  const projectsList = document.getElementById('projects-list');

  showFormBtn.addEventListener('click', () => {
    resetForm();
    formContainer.style.display = 'block';
    showFormBtn.style.display = 'none';
  });

  cancelBtn.addEventListener('click', () => {
    formContainer.style.display = 'none';
    showFormBtn.style.display = 'inline-block';
    resetForm();
  });

  document.getElementById('add-skill-have').addEventListener('click', () => {
    const input = document.getElementById('skill-have-input');
    const skill = input.value.trim();
    if (skill && !skillsHave.includes(skill)) {
      skillsHave.push(skill);
      renderSkillsHave();
      input.value = '';
    }
  });

  document.getElementById('skill-have-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('add-skill-have').click();
    }
  });

  document.getElementById('add-skill-need').addEventListener('click', () => {
    const input = document.getElementById('skill-need-input');
    const skill = input.value.trim();
    if (skill && !skillsNeed.includes(skill)) {
      skillsNeed.push(skill);
      renderSkillsNeed();
      input.value = '';
    }
  });

  document.getElementById('skill-need-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('add-skill-need').click();
    }
  });

  document.getElementById('skills-have-container').addEventListener('click', (e) => {
    if (e.target.matches('[data-remove-have]')) {
      const skill = e.target.getAttribute('data-remove-have');
      skillsHave = skillsHave.filter(s => s !== skill);
      renderSkillsHave();
    }
  });

  document.getElementById('skills-need-container').addEventListener('click', (e) => {
    if (e.target.matches('[data-remove-need]')) {
      const skill = e.target.getAttribute('data-remove-need');
      skillsNeed = skillsNeed.filter(s => s !== skill);
      renderSkillsNeed();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUserId) {
      alert('Please create a profile first!');
      return;
    }

    const projectData = {
      owner_id: currentUserId,
      title: document.getElementById('project-title').value,
      description: document.getElementById('project-description').value,
      skills_have: skillsHave,
      skills_need: skillsNeed,
    };

    if (editingProjectId) {
      projectData.status = document.getElementById('project-status').value;
    }

    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, projectData);
        alert('Project updated!');
      } else {
        await createProject(projectData);
        alert('Project created!');
      }
      formContainer.style.display = 'none';
      showFormBtn.style.display = 'inline-block';
      resetForm();
      loadProjects();
    } catch (error) {
      alert('Error saving project: ' + error.message);
    }
  });

  statusFilter.addEventListener('change', (e) => {
    loadProjects(e.target.value);
  });

  projectsList.addEventListener('click', async (e) => {
    if (e.target.matches('[data-delete]')) {
      const projectId = e.target.getAttribute('data-delete');
      if (confirm('Are you sure you want to delete this project?')) {
        try {
          await deleteProject(projectId);
          alert('Project deleted!');
          loadProjects();
        } catch (error) {
          alert('Error deleting project: ' + error.message);
        }
      }
    }

    if (e.target.matches('[data-edit]')) {
      const projectId = e.target.getAttribute('data-edit');
      try {
        const project = await getProject(projectId);
        editingProjectId = projectId;
        document.getElementById('form-title').textContent = 'Edit Project';
        document.getElementById('submit-btn').textContent = 'Update Project';
        document.getElementById('project-title').value = project.title;
        document.getElementById('project-description').value = project.description || '';
        document.getElementById('project-status').value = project.status;
        document.getElementById('status-group').style.display = 'block';
        skillsHave = project.skills_have || [];
        skillsNeed = project.skills_need || [];
        renderSkillsHave();
        renderSkillsNeed();
        formContainer.style.display = 'block';
        showFormBtn.style.display = 'none';
      } catch (error) {
        alert('Error loading project: ' + error.message);
      }
    }

    if (e.target.matches('[data-apply]')) {
      const projectId = e.target.getAttribute('data-apply');
      const ownerId = e.target.getAttribute('data-owner');
      
      if (!currentUserId) {
        alert('Please create a profile first!');
        return;
      }

      if (currentUserId === ownerId) {
        alert('You cannot apply to your own project!');
        return;
      }

      const message = prompt('Enter a message for your application:');
      if (message !== null) {
        try {
          const response = await fetch('/api/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              project_id: projectId,
              from_user_id: currentUserId,
              to_user_id: ownerId,
              message: message,
            }),
          });
          const result = await response.json();
          if (result.error) {
            alert(result.error);
          } else {
            alert('Application sent successfully!');
          }
        } catch (error) {
          alert('Error sending application: ' + error.message);
        }
      }
    }
  });
}

function renderSkillsHave() {
  const container = document.getElementById('skills-have-container');
  container.innerHTML = skillsHave.map(skill => `
    <span class="skill-tag skill-have">
      ${skill}
      <button type="button" data-remove-have="${skill}">&times;</button>
    </span>
  `).join('');
}

function renderSkillsNeed() {
  const container = document.getElementById('skills-need-container');
  container.innerHTML = skillsNeed.map(skill => `
    <span class="skill-tag skill-need">
      ${skill}
      <button type="button" data-remove-need="${skill}">&times;</button>
    </span>
  `).join('');
}

function resetForm() {
  editingProjectId = null;
  document.getElementById('form-title').textContent = 'Create New Project';
  document.getElementById('submit-btn').textContent = 'Create Project';
  document.getElementById('project-form').reset();
  document.getElementById('status-group').style.display = 'none';
  skillsHave = [];
  skillsNeed = [];
  renderSkillsHave();
  renderSkillsNeed();
}

export function setCurrentUserId(userId) {
  currentUserId = userId;
  localStorage.setItem('currentUserId', userId);
}