---
title: 'SkillSync - Design Document'
subtitle: 'Find Project Partners Through Complementary Skills, Not Friendship'
author:
  - Prasad Kanade
  - Saurabh Lohokare
date: 'Spring 2026'
geometry: margin=1in
fontsize: 12pt
toc: true
toc-depth: 3
numbersections: true
---

\newpage

# Project Description

## Overview

SkillSync is a web application that helps students form balanced, effective project teams based on complementary technical skills rather than existing friendships. In academic settings, students tend to team up with friends, which often results in overlapping skill sets and critical gaps -- for example, a team of three frontend developers with no one to handle backend or database work.

SkillSync addresses this by letting students create skill profiles, post project requirements, and discover potential partners whose abilities fill gaps in their team. The platform also incorporates schedule compatibility and work-style preferences to ensure that matched partners can realistically collaborate.

## Problem Statement

University group projects frequently suffer from:

- **Skill Overlap:** Teams formed by friendship often have redundant abilities (e.g., everyone knows React, nobody knows databases).
- **Schedule Conflicts:** Partners who cannot find overlapping free time waste effort coordinating.
- **Work-Style Mismatch:** A night-owl coder paired with a morning-person designer leads to communication friction.
- **No Visibility:** Students have no easy way to discover classmates with the specific skills they need.

## Solution

SkillSync provides four core capabilities:

1. **Skill Profiles** -- Users list their technical skills, GitHub link, and work-style preferences.
2. **Availability Grid** -- An interactive weekly calendar lets users mark when they are free.
3. **Project Posts with Skill Gap Analysis** -- Project owners list skills they have and skills they need; the platform highlights the gap.
4. **Partner Discovery and Requests** -- Users browse potential partners filtered by skill, see matching indicators, and send partnership requests.

## Target Audience

Northeastern University graduate and undergraduate students enrolled in project-based courses who need to form balanced teams.

\newpage

# User Personas

## Persona 1: Priya -- The Frontend-Heavy Student

| Attribute       | Detail                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| **Name**        | Priya Sharma                                                                                              |
| **Age**         | 23                                                                                                        |
| **Program**     | MS in Computer Science, Northeastern University                                                           |
| **Skills**      | React, CSS, Figma, JavaScript, HTML                                                                       |
| **Gaps**        | Backend development, databases, deployment                                                                |
| **Work Style**  | Morning person, prefers in-person collaboration                                                           |
| **Frustration** | Her friend group all specialize in frontend; past project teams had no one who could build the API layer. |
| **Goal**        | Find a backend-focused partner who is available during daytime hours.                                     |

## Persona 2: Marcus -- The Solo Backend Developer

| Attribute       | Detail                                                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Name**        | Marcus Williams                                                                                                                     |
| **Age**         | 25                                                                                                                                  |
| **Program**     | MS in Information Systems, Northeastern University                                                                                  |
| **Skills**      | Node.js, Express, MongoDB, Python, AWS                                                                                              |
| **Gaps**        | Frontend frameworks, UI/UX design                                                                                                   |
| **Work Style**  | Night owl, prefers remote work                                                                                                      |
| **Frustration** | He transferred from another university and does not know many classmates. Finding partners with frontend skills has been difficult. |
| **Goal**        | Post his project idea and attract a frontend developer who is comfortable working remotely.                                         |

## Persona 3: Aisha -- The Project Manager Type

| Attribute       | Detail                                                                                                                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**        | Aisha Chen                                                                                                                                                                              |
| **Age**         | 22                                                                                                                                                                                      |
| **Program**     | BS in Computer Science, Northeastern University                                                                                                                                         |
| **Skills**      | Python, Git, technical writing, project management                                                                                                                                      |
| **Gaps**        | Full-stack web development                                                                                                                                                              |
| **Work Style**  | Flexible schedule, prefers in-person                                                                                                                                                    |
| **Frustration** | She has solid fundamentals but limited web development experience. She wants to join an existing project where she can contribute her organizational skills while learning from others. |
| **Goal**        | Browse open projects, find one that needs her skill set, and send a request to join.                                                                                                    |

\newpage

# User Stories

## Epic 1: Profile Management

**US-1.1 -- Create a Profile**
As a student, I want to create a profile with my name, email, skills, GitHub link, and work-style preferences so that other students can learn about me and my abilities.

_Acceptance Criteria:_

- Form captures name, email, skills (as tags), GitHub URL, and work-style selections.
- Skills can be added and removed dynamically.
- Work-style options include time preference (morning/night) and work mode (remote/in-person).
- Profile is saved to the database and visible on the Browse page.

**US-1.2 -- Update My Profile**
As a student, I want to update my profile information so that my skills and preferences stay current.

_Acceptance Criteria:_

- Pre-populates the form with existing data.
- Changes are persisted to the database on save.

**US-1.3 -- Delete My Profile**
As a student, I want to delete my profile so that I can remove myself from the platform.

_Acceptance Criteria:_

- Confirmation prompt before deletion.
- Profile and associated data are removed.

## Epic 2: Availability Management

**US-2.1 -- Set Weekly Availability**
As a student, I want to mark my available time slots on a weekly grid so that potential partners can see when I am free.

_Acceptance Criteria:_

- Interactive 7-day x 14-hour grid (8 AM to 9 PM).
- Click to toggle a slot as available or unavailable.
- Selected slots are visually highlighted.

**US-2.2 -- Save Availability**
As a student, I want to save my availability so that it persists across sessions.

_Acceptance Criteria:_

- Clicking Save sends all selected slots to the server.
- Previous availability is cleared and replaced with the new selection.

**US-2.3 -- Clear Availability**
As a student, I want to clear all my availability selections so that I can start fresh.

_Acceptance Criteria:_

- Clear All button deselects every slot on the grid.

## Epic 3: Project Posts

**US-3.1 -- Create a Project Post**
As a student, I want to post a project with a title, description, skills I have, and skills I need so that I can advertise what kind of partner I am looking for.

_Acceptance Criteria:_

- Form with title, description, dynamic skill-tag inputs for have and need.
- Project is stored with status open and linked to the creator.

**US-3.2 -- Edit My Project**
As a project owner, I want to edit my project details and change its status (open/closed) so that I can keep the listing accurate.

_Acceptance Criteria:_

- Edit form pre-populates with existing project data.
- Status dropdown allows toggling between open and closed.

**US-3.3 -- Delete My Project**
As a project owner, I want to delete my project post so that it no longer appears in listings.

_Acceptance Criteria:_

- Confirmation prompt before deletion.
- Project is removed from the database.

**US-3.4 -- Browse and Filter Projects**
As a student, I want to browse all projects and filter by status so that I can find open opportunities.

_Acceptance Criteria:_

- Project list shows title, description, owner name, skills have/need, and status badge.
- Dropdown filter for All, Open, or Closed.

**US-3.5 -- Apply to a Project**
As a student, I want to apply to join someone else's project so that I can offer my skills.

_Acceptance Criteria:_

- Apply to Join button on projects I do not own.
- Prompt for a message, then a partner request is created.

## Epic 4: Partner Discovery

**US-4.1 -- Browse Partners by Skill**
As a student, I want to search for other users by skill so that I can find someone with the expertise I need.

_Acceptance Criteria:_

- Text input filters users whose skills match the search term.
- Results update on search.

**US-4.2 -- Skill Gap Matching for a Project**
As a project owner, I want to select one of my projects and see which users have the skills I need so that I can make targeted requests.

_Acceptance Criteria:_

- Project dropdown shows my open projects.
- Selecting a project displays needed skills and highlights matching users.
- Users are sorted by number of matching skills.

**US-4.3 -- View a User's Availability**
As a student, I want to see another user's availability so that I can check schedule compatibility before reaching out.

_Acceptance Criteria:_

- View Availability button on each user card.
- Displays the user's marked time slots.

**US-4.4 -- Send a Partner Request**
As a student, I want to send a partnership request to another user for a specific project so that they can consider joining my team.

_Acceptance Criteria:_

- Button appears when a project is selected.
- Duplicate requests to the same user for the same project are blocked.

## Epic 5: Partner Requests

**US-5.1 -- View Received Requests**
As a student, I want to see partnership requests others have sent me so that I can decide whether to accept or decline.

_Acceptance Criteria:_

- Received tab shows requests where I am the recipient.
- Each request shows project name, sender name, sender skills, message, and status.

**US-5.2 -- Accept or Decline a Request**
As a student, I want to accept or decline a pending request so that I can manage my partnerships.

_Acceptance Criteria:_

- Accept and Decline buttons on pending received requests.
- Status updates to accepted or declined on click.

**US-5.3 -- View Sent Requests**
As a student, I want to see requests I have sent so that I can track their status.

_Acceptance Criteria:_

- Sent tab shows requests where I am the sender.
- Pending requests have a Cancel option.

**US-5.4 -- Filter Requests by Status**
As a student, I want to filter requests by pending, accepted, or declined so that I can focus on actionable items.

_Acceptance Criteria:_

- Dropdown filter applies to the current tab.

\newpage

# Design Mockups

## Application Architecture

```
+-----------------------------------------------------+
|                   Browser (SPA)                      |
|  +------------------------------------------------+ |
|  |  index.html  <--  app.js (router)              | |
|  |                                                | |
|  |  +---------+ +------------+ +-------------+    | |
|  |  | Profile | | Availability| |  Projects  |    | |
|  |  |Component| | Component  | |  Component |    | |
|  |  +---------+ +------------+ +-------------+    | |
|  |  +---------+ +------------+                    | |
|  |  | Browse  | |  Requests  |   api.js           | |
|  |  |Component| | Component  |  (HTTP client)     | |
|  |  +---------+ +------------+                    | |
|  +---------------------+-------------------------+ |
|                        | REST API calls             |
+------------------------+----------------------------+
                         |
+------------------------+----------------------------+
|          Express.js Server (Node.js)                |
|                        |                            |
|  +---------------------+--------------------------+ |
|  |               server/index.js                  | |
|  |                                                | |
|  |  /api/users --------- routes/users.js          | |
|  |  /api/availability -- routes/availability.js   | |
|  |  /api/projects ------ routes/projects.js       | |
|  |  /api/requests ------ routes/requests.js       | |
|  +---------------------+--------------------------+ |
|                        |                            |
|  +---------------------+--------------------------+ |
|  |           db/connection.js                     | |
|  |          (MongoDB Native Driver)               | |
|  +---------------------+--------------------------+ |
+------------------------+----------------------------+
                         |
+------------------------+----------------------------+
|             MongoDB Atlas                           |
|                                                     |
|  Collections:                                       |
|  +----------+ +------------------+                  |
|  |  users   | | availability_    |                  |
|  |          | | slots            |                  |
|  +----------+ +------------------+                  |
|  +----------+ +------------------+                  |
|  | project_ | | partner_         |                  |
|  | posts    | | requests         |                  |
|  +----------+ +------------------+                  |
+-----------------------------------------------------+
```

## Page Wireframes

The following wireframes were created during the design phase to guide the implementation of each page. They are located in the `docs/wireframes/` directory.

### Home Page

![Home Page Wireframe](wireframes/01_home.jpg)

The home page introduces SkillSync with three call-to-action cards: Create Your Profile, Post a Project, and Find Partners. Each card links to its respective page.

### Profile Page

![Profile Page Wireframe](wireframes/02_profile.jpg)

The profile page contains a form for entering name, email, GitHub URL, and technical skills (added as tags). Work style preferences (morning/night, remote/in-person) are selectable options.

### Availability Grid

![Availability Grid Wireframe](wireframes/03_availability.jpg)

An interactive 7-day by 14-hour grid where users click cells to toggle availability. Blue cells indicate available time slots. Save and Clear buttons manage persistence.

### Projects Page

![Projects Page Wireframe](wireframes/04_projects.jpg)

Lists all project posts with title, description, owner, status badge, and skill tags (green for "has", red for "needs"). Owners see Edit/Delete buttons; others see Apply to Join.

### Create Project Form

![Create Project Form Wireframe](wireframes/05_create_project.jpg)

The project creation form collects title, description, skills the owner has, and skills the owner needs. Skills are entered via a tag input with add/remove functionality.

### Browse Partners Page

![Browse Partners Page Wireframe](wireframes/06_browse_partners.jpg)

A filterable grid of user cards showing name, email, skills, work style badges, and GitHub links. When a project is selected, skill gap analysis highlights matching skills and sorts users by relevance.

### Requests Page

![Requests Page Wireframe](wireframes/07_requests.jpg)

Tabbed view (Received/Sent/All) of partner requests. Each request card shows project name, sender, recipient, message, date, requester skills, and status. Pending received requests show Accept/Decline buttons.

\newpage

# Data Model

## Collections

### users

| Field      | Type            | Description                |
| ---------- | --------------- | -------------------------- |
| \_id       | ObjectId        | Primary key                |
| name       | String          | Full name                  |
| email      | String          | Email address              |
| skills     | Array of String | Technical skills           |
| github_url | String          | GitHub profile URL         |
| work_style | Object          | time_preference, work_mode |
| created_at | Date            | Account creation timestamp |

### availability_slots

| Field      | Type     | Description             |
| ---------- | -------- | ----------------------- |
| \_id       | ObjectId | Primary key             |
| user_id    | ObjectId | Reference to users      |
| day        | String   | Day of week             |
| start_hour | Number   | Start hour (8-21)       |
| end_hour   | Number   | End hour (9-22)         |
| created_at | Date     | Slot creation timestamp |

### project_posts

| Field       | Type            | Description             |
| ----------- | --------------- | ----------------------- |
| \_id        | ObjectId        | Primary key             |
| owner_id    | ObjectId        | Reference to users      |
| title       | String          | Project title           |
| description | String          | Project description     |
| skills_have | Array of String | Skills the owner brings |
| skills_need | Array of String | Skills needed           |
| status      | String          | open or closed          |
| created_at  | Date            | Post creation timestamp |

### partner_requests

| Field        | Type     | Description                    |
| ------------ | -------- | ------------------------------ |
| \_id         | ObjectId | Primary key                    |
| project_id   | ObjectId | Reference to project_posts     |
| from_user_id | ObjectId | Requester                      |
| to_user_id   | ObjectId | Recipient / project owner      |
| message      | String   | Application message            |
| status       | String   | pending, accepted, or declined |
| created_at   | Date     | Request timestamp              |

## Entity Relationship Diagram

```
+----------+       +------------------+
|  users   |--1:N--|  availability_   |
|          |       |  slots           |
+----------+       +------------------+
     |
     +--1:N--+
     |       v
     |  +--------------+
     |  | project_     |
     |  | posts        |
     |  +--------------+
     |       |
     |       | 1:N
     |       v
     |  +--------------+
     +--| partner_     |
        | requests     |--references--> users (from + to)
        +--------------+
```

\newpage

# API Design

## REST Endpoints Summary

| Resource     | Method | Endpoint                   | Description       |
| ------------ | ------ | -------------------------- | ----------------- |
| Users        | GET    | /api/users                 | List all users    |
| Users        | GET    | /api/users/:id             | Get user by ID    |
| Users        | POST   | /api/users                 | Create user       |
| Users        | PUT    | /api/users/:id             | Update user       |
| Users        | DELETE | /api/users/:id             | Delete user       |
| Availability | GET    | /api/availability          | List all slots    |
| Availability | GET    | /api/availability/user/:id | User slots        |
| Availability | POST   | /api/availability          | Create slot       |
| Availability | POST   | /api/availability/bulk     | Bulk create       |
| Availability | PUT    | /api/availability/:id      | Update slot       |
| Availability | DELETE | /api/availability/:id      | Delete slot       |
| Availability | DELETE | /api/availability/user/:id | Delete user slots |
| Projects     | GET    | /api/projects              | List projects     |
| Projects     | GET    | /api/projects/:id          | Get project       |
| Projects     | GET    | /api/projects/user/:id     | User projects     |
| Projects     | GET    | /api/projects/skill/:skill | By skill          |
| Projects     | POST   | /api/projects              | Create project    |
| Projects     | PUT    | /api/projects/:id          | Update project    |
| Projects     | DELETE | /api/projects/:id          | Delete project    |
| Requests     | GET    | /api/requests              | List requests     |
| Requests     | GET    | /api/requests/:id          | Get request       |
| Requests     | GET    | /api/requests/sent/:id     | Sent requests     |
| Requests     | GET    | /api/requests/received/:id | Received          |
| Requests     | GET    | /api/requests/project/:id  | By project        |
| Requests     | POST   | /api/requests              | Create request    |
| Requests     | PUT    | /api/requests/:id/status   | Update status     |
| Requests     | DELETE | /api/requests/:id          | Delete request    |

\newpage

# Technology Decisions

| Decision     | Choice                 | Rationale                      |
| ------------ | ---------------------- | ------------------------------ |
| Runtime      | Node.js v18+           | Course requirement; async I/O  |
| Framework    | Express.js 5           | Lightweight, matches course    |
| Database     | MongoDB Atlas (native) | NoSQL flexibility; free tier   |
| Frontend     | Vanilla JS (CSR)       | Course requirement             |
| Modules      | ES Modules             | Modern; CJS prohibited         |
| Hosting      | Render                 | Free auto-deploy from GitHub   |
| Code Quality | ESLint + Prettier      | Consistency and error catching |
| License      | MIT                    | Open-source, meets rubric      |
