---
title: 'SkillSync - Design Document'
subtitle: 'Find Project Partners Through Complementary Skills, Not Friendship'
author:
  - Prasad Kanade
  - Saurabh Lohokare
date: 'Spring 2026'
---

# Project Description

SkillSync is a web application that helps students form balanced project teams based on complementary technical skills rather than existing friendships. Students create skill profiles, post project requirements, and discover partners whose abilities fill gaps in their team. The platform incorporates schedule compatibility and work-style preferences to ensure matched partners can realistically collaborate.

**Problem:** University group projects suffer from skill overlap (everyone knows React, nobody knows databases), schedule conflicts, work-style mismatches, and no visibility into classmates' skills.

**Solution:** SkillSync provides skill profiles with work-style preferences, an interactive availability grid with schedule overlap comparison, project posts with skill gap analysis, and a partner discovery system with match ranking and partnership requests.

---

# User Personas

## Persona 1: Priya — The Frontend Specialist

| Attribute | Detail |
|-----------|--------|
| **Background** | MS in CS at Northeastern, 23 years old. Strong in React, CSS, Figma, JavaScript. |
| **Work Style** | Morning person, in-person, steady pace on deadlines. |
| **Frustration** | Friend group all does frontend; past teams had no one for backend. |
| **Goal** | Find a backend partner with overlapping daytime availability. |

## Persona 2: Marcus — The Backend Developer

| Attribute | Detail |
|-----------|--------|
| **Background** | MS in IS at Northeastern, 25 years old. Strong in Node.js, Express, MongoDB, Python, AWS. |
| **Work Style** | Night owl, remote, works under pressure (last-minute). |
| **Frustration** | New transfer student with no local network. Can't find frontend partners. |
| **Goal** | Post project requirements and attract a frontend developer comfortable with remote work. |

## Persona 3: Aisha — The Project Manager Type

| Attribute | Detail |
|-----------|--------|
| **Background** | BS in CS at Northeastern, 22 years old. Skills in Python, Git, technical writing. |
| **Work Style** | Flexible (afternoon), hybrid collaboration, early finisher. |
| **Frustration** | Has fundamentals but limited web dev experience. Wants to learn from stronger devs. |
| **Goal** | Browse open projects, find one needing her skills, and send a request to join. |

---

# User Stories

## Epic 1: Profile Management

- **US-1.1** — As a student, I want to create a profile with my name, email, skills, GitHub link, and work-style preferences (time preference, collaboration mode, deadline approach) so partners can evaluate me.
- **US-1.2** — As a student, I want to update my profile so my information stays current.
- **US-1.3** — As a student, I want to delete my profile with double confirmation so I can remove myself from the platform.

## Epic 2: Availability Management

- **US-2.1** — As a student, I want to mark available time slots on an interactive weekly grid (Mon–Sun, 8AM–9PM) so partners can see my schedule.
- **US-2.2** — As a student, I want my saved availability to load automatically when I return so I don't have to re-enter it.
- **US-2.3** — As a student, I want to clear all selections to start fresh each week.

## Epic 3: Project Posts

- **US-3.1** — As a student, I want to post a project with title, description, skills I have, and skills I need so partners can see what gap they'd fill.
- **US-3.2** — As a project owner, I want to edit my project and toggle its status (open/closed).
- **US-3.3** — As a project owner, I want to delete my project with confirmation.
- **US-3.4** — As a student, I want to browse and filter projects by status to find open opportunities.
- **US-3.5** — As a student, I want to apply to join a project by sending a request with a message.

## Epic 4: Partner Discovery

- **US-4.1** — As a student, I want to search for users by skill to find someone with the expertise I need.
- **US-4.2** — As a project owner, I want to select my project and see users ranked by how many needed skills they match.
- **US-4.3** — As a student, I want to view a partner's availability and compare it with mine to see overlapping free hours.
- **US-4.4** — As a student, I want to send a partner request from the browse page when I find a good match.

## Epic 5: Partner Requests

- **US-5.1** — As a student, I want to view received requests with sender's skills, message, and status.
- **US-5.2** — As a student, I want to accept or decline pending requests.
- **US-5.3** — As a student, I want to view and cancel my sent requests.
- **US-5.4** — As a student, I want to filter requests by status (pending/accepted/declined).

---

# Design Mockups

Each page was wireframed during the design phase, then implemented. Below shows the wireframe alongside the final screenshot for each page.

## Home Page

| Wireframe | Final Implementation |
|-----------|---------------------|
| ![Wireframe](wireframes/01_home.png) | ![Screenshot](screenshots/home.jpeg) |

## Home Page (Logged Out)

![Logged Out](screenshots/home_logged_out.png)

## Profile Page

| Wireframe | Final Implementation |
|-----------|---------------------|
| ![Wireframe](wireframes/02_profile.png) | ![Screenshot](screenshots/profile_form.png) |

## Availability Grid

| Wireframe | Final Implementation |
|-----------|---------------------|
| ![Wireframe](wireframes/03_availability.png) | ![Screenshot](screenshots/availability.png) |

## Projects Page

| Wireframe | Final Implementation |
|-----------|---------------------|
| ![Wireframe](wireframes/04_projects.png) | ![Screenshot](screenshots/projects_page.png) |

## Create Project Form

| Wireframe | Final Implementation |
|-----------|---------------------|
| ![Wireframe](wireframes/05_create_project.png) | ![Screenshot](screenshots/create_project.png) |

## Browse Partners

| Wireframe | Final Implementation |
|-----------|---------------------|
| ![Wireframe](wireframes/06_browse_partners.png) | ![Screenshot](screenshots/browse_partners.png) |

## Requests Page

| Wireframe | Final Implementation |
|-----------|---------------------|
| ![Wireframe](wireframes/07_requests.png) | ![Screenshot](screenshots/requests.png) |

## View Partner Availability

![View Availability](screenshots/view_availability.png)

## Schedule Overlap Comparison

![Schedule Overlap](screenshots/schedule_overlap.png)

---

# Data Model

### users
| Field | Type | Description |
|-------|------|-------------|
| \_id | ObjectId | Primary key |
| name | String | Full name |
| email | String | Email address |
| skills | Array of String | Technical skills |
| github_url | String | GitHub profile URL |
| work_style | Object | schedule, mode, deadline |
| created_at | Date | Creation timestamp |

### availability_slots
| Field | Type | Description |
|-------|------|-------------|
| \_id | ObjectId | Primary key |
| user_id | ObjectId | Reference to users |
| day | String | Day of week |
| start_hour | Number | Start hour (8-21) |
| end_hour | Number | End hour (9-22) |
| created_at | Date | Creation timestamp |

### project_posts
| Field | Type | Description |
|-------|------|-------------|
| \_id | ObjectId | Primary key |
| owner_id | ObjectId | Reference to users |
| title | String | Project title |
| description | String | Project description |
| skills_have | Array of String | Skills the owner brings |
| skills_need | Array of String | Skills needed |
| status | String | open or closed |
| created_at | Date | Creation timestamp |

### partner_requests
| Field | Type | Description |
|-------|------|-------------|
| \_id | ObjectId | Primary key |
| project_id | ObjectId | Reference to project_posts |
| from_user_id | ObjectId | Requester |
| to_user_id | ObjectId | Recipient |
| message | String | Application message |
| status | String | pending, accepted, or declined |
| created_at | Date | Creation timestamp |

## Entity Relationships

```
users 1──M availability_slots    (user has many slots)
users 1──M project_posts         (user owns many projects)
users 1──M partner_requests      (user sends/receives requests)
project_posts 1──M partner_requests  (project has many requests)
```

---

# API Endpoints

| Resource | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| Users | GET | /api/users | List all |
| Users | GET | /api/users/:id | Get by ID |
| Users | POST | /api/users | Create |
| Users | PUT | /api/users/:id | Update |
| Users | DELETE | /api/users/:id | Delete |
| Availability | GET | /api/availability/user/:id | User slots |
| Availability | POST | /api/availability/bulk | Bulk create |
| Availability | DELETE | /api/availability/user/:id | Delete user slots |
| Projects | GET | /api/projects | List all |
| Projects | POST | /api/projects | Create |
| Projects | PUT | /api/projects/:id | Update |
| Projects | DELETE | /api/projects/:id | Delete |
| Requests | GET | /api/requests/sent/:id | Sent requests |
| Requests | GET | /api/requests/received/:id | Received |
| Requests | POST | /api/requests | Create |
| Requests | PUT | /api/requests/:id/status | Update status |
| Requests | DELETE | /api/requests/:id | Delete |

---

# Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Runtime | Node.js v18+ | Course requirement; async I/O |
| Framework | Express.js 5 | Lightweight, matches course |
| Database | MongoDB Atlas (native driver) | NoSQL flexibility; free tier |
| Frontend | Vanilla JS (client-side rendering) | Course requirement |
| Modules | ES Modules | Modern; CJS prohibited |
| Hosting | Render | Free auto-deploy from GitHub |
| Code Quality | ESLint + Prettier | Consistency and error catching |
| License | MIT | Open-source, meets rubric |
