import {
  getAvailability,
  createAvailabilityBulk,
  deleteUserAvailability,
} from '../api.js';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8);

let selectedSlots = new Set();
let currentUserId = null;

export async function renderAvailability(container) {
  currentUserId = localStorage.getItem('currentUserId');

  container.innerHTML = `
    <div class="card">
      <h2>Set Your Availability</h2>
      ${!currentUserId ? '<p class="warning-message">⚠️ Please create a profile first to save your availability.</p>' : '<p>Click on time slots when you are available to work with partners.</p>'}
      
      <div class="availability-grid" id="availability-grid">
        <div class="header"></div>
        ${DAYS.map((day) => `<div class="header">${day.slice(0, 3)}</div>`).join('')}
        
        ${HOURS.map(
          (hour) => `
          <div class="time-label">${formatHour(hour)}</div>
          ${DAYS.map(
            (day) => `
            <div class="slot" data-day="${day}" data-hour="${hour}"></div>
          `
          ).join('')}
        `
        ).join('')}
      </div>

      <div class="availability-legend">
        <div class="legend-item">
          <div class="legend-color available"></div>
          <span>Available</span>
        </div>
        <div class="legend-item">
          <div class="legend-color unavailable"></div>
          <span>Not Available</span>
        </div>
      </div>

      <br>
      <button class="btn" id="save-availability" ${!currentUserId ? 'disabled' : ''}>Save Availability</button>
      <button class="btn btn-danger" id="clear-availability">Clear All</button>
    </div>
  `;

  if (currentUserId) {
    await loadExistingAvailability();
  }
}

async function loadExistingAvailability() {
  try {
    const slots = await getAvailability(currentUserId);
    selectedSlots.clear();

    slots.forEach((slot) => {
      const key = `${slot.day}-${slot.start_hour}`;
      selectedSlots.add(key);

      const slotElement = document.querySelector(
        `.slot[data-day="${slot.day}"][data-hour="${slot.start_hour}"]`
      );
      if (slotElement) {
        slotElement.classList.add('selected');
      }
    });

    console.log(`Loaded ${slots.length} availability slots for user`);
  } catch (error) {
    console.error('Error loading availability:', error);
  }
}

export function initAvailabilityHandlers() {
  const grid = document.getElementById('availability-grid');
  const saveBtn = document.getElementById('save-availability');
  const clearBtn = document.getElementById('clear-availability');

  grid.addEventListener('click', (e) => {
    if (e.target.classList.contains('slot')) {
      const day = e.target.getAttribute('data-day');
      const hour = parseInt(e.target.getAttribute('data-hour'));
      const key = `${day}-${hour}`;

      if (selectedSlots.has(key)) {
        selectedSlots.delete(key);
        e.target.classList.remove('selected');
      } else {
        selectedSlots.add(key);
        e.target.classList.add('selected');
      }
    }
  });

  saveBtn.addEventListener('click', async () => {
    currentUserId = localStorage.getItem('currentUserId');

    if (!currentUserId) {
      alert('Please create a profile first!');
      return;
    }

    const slots = Array.from(selectedSlots).map((key) => {
      const [day, hour] = key.split('-');
      return {
        user_id: currentUserId,
        day: day,
        start_hour: parseInt(hour),
        end_hour: parseInt(hour) + 1,
      };
    });

    try {
      await deleteUserAvailability(currentUserId);
      if (slots.length > 0) {
        await createAvailabilityBulk(slots);
      }
      alert('Availability saved!');
    } catch (error) {
      alert('Error saving availability: ' + error.message);
    }
  });

  clearBtn.addEventListener('click', () => {
    selectedSlots.clear();
    document.querySelectorAll('.slot.selected').forEach((slot) => {
      slot.classList.remove('selected');
    });
  });
}

function formatHour(hour) {
  if (hour === 12) return '12 PM';
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
}

export function setCurrentUser(userId) {
  currentUserId = userId;
  localStorage.setItem('currentUserId', userId);
}
