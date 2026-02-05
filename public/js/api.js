const API_BASE = '/api';

// Users API
export async function getUsers() {
  const response = await fetch(`${API_BASE}/users`);
  return response.json();
}

export async function getUser(id) {
  const response = await fetch(`${API_BASE}/users/${id}`);
  return response.json();
}

export async function createUser(userData) {
  const response = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
}

export async function updateUser(id, userData) {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
}

export async function deleteUser(id) {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}

// Availability API
export async function getAvailability(userId) {
  const url = userId
    ? `${API_BASE}/availability/user/${userId}`
    : `${API_BASE}/availability`;
  const response = await fetch(url);
  return response.json();
}

export async function createAvailabilitySlot(slotData) {
  const response = await fetch(`${API_BASE}/availability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slotData),
  });
  return response.json();
}

export async function createAvailabilityBulk(slots) {
  const response = await fetch(`${API_BASE}/availability/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slots }),
  });
  return response.json();
}

export async function deleteAvailabilitySlot(id) {
  const response = await fetch(`${API_BASE}/availability/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}

export async function deleteUserAvailability(userId) {
  const response = await fetch(`${API_BASE}/availability/user/${userId}`, {
    method: 'DELETE',
  });
  return response.json();
}

// Projects API
export async function getProjects(status) {
  const url = status
    ? `${API_BASE}/projects?status=${status}`
    : `${API_BASE}/projects`;
  const response = await fetch(url);
  return response.json();
}

export async function getProject(id) {
  const response = await fetch(`${API_BASE}/projects/${id}`);
  return response.json();
}

export async function getProjectsByUser(userId) {
  const response = await fetch(`${API_BASE}/projects/user/${userId}`);
  return response.json();
}

export async function getProjectsBySkill(skill) {
  const response = await fetch(`${API_BASE}/projects/skill/${skill}`);
  return response.json();
}

export async function createProject(projectData) {
  const response = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  return response.json();
}

export async function updateProject(id, projectData) {
  const response = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  return response.json();
}

export async function deleteProject(id) {
  const response = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}

// Partner Requests API
export async function getRequests(status) {
  const url = status
    ? `${API_BASE}/requests?status=${status}`
    : `${API_BASE}/requests`;
  const response = await fetch(url);
  return response.json();
}

export async function getRequest(id) {
  const response = await fetch(`${API_BASE}/requests/${id}`);
  return response.json();
}

export async function getSentRequests(userId) {
  const response = await fetch(`${API_BASE}/requests/sent/${userId}`);
  return response.json();
}

export async function getReceivedRequests(userId) {
  const response = await fetch(`${API_BASE}/requests/received/${userId}`);
  return response.json();
}

export async function getProjectRequests(projectId) {
  const response = await fetch(`${API_BASE}/requests/project/${projectId}`);
  return response.json();
}

export async function createRequest(requestData) {
  const response = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });
  return response.json();
}

export async function updateRequestStatus(id, status) {
  const response = await fetch(`${API_BASE}/requests/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return response.json();
}

export async function deleteRequest(id) {
  const response = await fetch(`${API_BASE}/requests/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}