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
