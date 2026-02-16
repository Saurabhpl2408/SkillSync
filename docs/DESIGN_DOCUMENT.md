# SkillSync — Design Document

> **Course:** Web Development — Spring 2026, Northeastern University  
> **Authors:** Prasad Kanade & Saurabh Lohokare  
> **Date:** February 2026  
> **Version:** 1.0

---

## Table of Contents

1. [Project Description](#1-project-description)
2. [User Personas](#2-user-personas)
3. [User Stories](#3-user-stories)
4. [Design Mockups](#4-design-mockups)

---

## 1. Project Description

### Problem Statement

In academic settings, students typically form project teams based on existing friendships. While comfortable, this approach consistently produces unbalanced teams: groups of three frontend developers with no one to handle the backend, teams where everyone prefers late-night work but no one can meet during the day, or partners whose skills overlap so heavily that role division becomes a source of conflict rather than collaboration.

### Solution

SkillSync is a web application that matches students into project teams based on **complementary skills**, **schedule compatibility**, and **work style preferences**. Rather than asking "who do I know?", SkillSync helps students ask "who has what my team needs?"

### Core Functionality

**Profile Management** — Students create profiles listing their technical skills (React, Node.js, Python, etc.), GitHub URL, and work style preferences (morning vs. night person, remote vs. in-person). Skills are added as dynamic tags and can be updated at any time.

**Availability Scheduling** — An interactive weekly grid (Monday–Sunday, 8 AM–9 PM) lets students click time slots to mark when they are free. This data is saved per-user and can be viewed by potential partners to assess schedule overlap before committing to a team.

**Project Posting** — Students post projects specifying what skills they already have and what skills they need. This creates a clear "skill gap" that other students can see and fill. Projects have open/closed status and full editing capabilities.

**Partner Browsing & Matching** — A browsable directory of all registered users, filterable by skill. When a specific project is selected, SkillSync performs a skill gap analysis: it highlights which users possess the needed skills, ranks them by match strength, and visually distinguishes matching skills from non-matching ones.

**Partner Requests** — Students can send partnership requests through specific projects with a custom message. Project owners receive these requests and can accept or decline. Both sent and received requests are tracked with status indicators (pending, accepted, declined).

### Technical Architecture

The application follows a client-server architecture with complete separation of concerns:

- **Backend:** Node.js + Express.js serving a RESTful API. The native MongoDB driver (not Mongoose) connects to MongoDB Atlas. Four collections — `users`, `availability_slots`, `project_posts`, and `partner_requests` — each support full CRUD operations.
- **Frontend:** A single-page application built with vanilla JavaScript using client-side rendering. Each page (Profile, Availability, Projects, Browse, Requests) is a separate ES module that renders HTML into a shared `<main>` container. CSS is organized into per-module files.
- **Deployment:** Hosted on Render with environment-based secret management (MongoDB credentials stored in `.env`, never committed to version control).

---

## 2. User Personas

### Persona 1: Priya Sharma — The Frontend Specialist

| Attribute                | Detail                                                                                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Age**                  | 23                                                                                                                                                                                                                       |
| **Program**              | MS in Computer Science, Northeastern University                                                                                                                                                                          |
| **Technical Background** | 2 years of professional frontend experience at a mid-size startup in Bangalore. Strong in React, CSS, and UI/UX design. Limited backend and database experience.                                                         |
| **Work Style**           | Morning person. Prefers in-person collaboration at Snell Library. Steady worker who starts assignments early and works consistently.                                                                                     |
| **Current Frustration**  | Every group project ends up with two or three people who all want to do the frontend. Priya needs teammates who are excited about backend work so she can focus on what she does best without stepping on anyone's toes. |
| **Goal with SkillSync**  | Find a partner who has Node.js and database skills to complement her frontend expertise. She wants to see their availability upfront so she knows they can meet during her preferred morning hours.                      |
| **Tech Comfort**         | High. Uses GitHub daily. Comfortable with web applications.                                                                                                                                                              |

### Persona 2: Marcus Johnson — The Backend Developer

| Attribute                | Detail                                                                                                                                                                                                                                                                            |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Age**                  | 25                                                                                                                                                                                                                                                                                |
| **Program**              | MS in Information Systems, Northeastern University                                                                                                                                                                                                                                |
| **Technical Background** | Co-op experience at a fintech company working on Java microservices and PostgreSQL. Solid Python and Node.js skills. No frontend experience beyond basic HTML. Finds CSS frustrating.                                                                                             |
| **Work Style**           | Night owl. Works best between 8 PM and midnight. Prefers remote collaboration via Slack and GitHub. Tends to work in bursts close to deadlines.                                                                                                                                   |
| **Current Frustration**  | Marcus is new to Northeastern and doesn't know many people in his program. His previous project team was formed by the three people left over after everyone else grouped up with friends. The resulting team had no frontend skills and the final product looked unprofessional. |
| **Goal with SkillSync**  | Post his project requirements clearly — specifying that he needs someone with React or Vue.js and CSS skills — and find a partner whose abilities fill the gap in his team. He doesn't care about meeting in person as long as they can collaborate asynchronously.               |
| **Tech Comfort**         | High. Comfortable with APIs, Git, and command-line tools.                                                                                                                                                                                                                         |

### Persona 3: Sofia Chen — The Full-Stack Learner

| Attribute                | Detail                                                                                                                                                                                                                                                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Age**                  | 22                                                                                                                                                                                                                                                                                                                            |
| **Program**              | BS/MS in Computer Science (combined program), Northeastern University                                                                                                                                                                                                                                                         |
| **Technical Background** | Has taken courses covering both frontend and backend but has no professional experience. Knows a little bit of everything — JavaScript, Python, React basics, SQL — but nothing deeply.                                                                                                                                       |
| **Work Style**           | Flexible schedule. Prefers in-person work but can do remote. Steady worker who likes clear task division.                                                                                                                                                                                                                     |
| **Current Frustration**  | Sofia wants to learn by working with people who are stronger than her in specific areas. When she teams up with friends who are also generalists, nobody takes ownership of any part of the project and the result is mediocre across the board.                                                                              |
| **Goal with SkillSync**  | Browse available partners to find someone with deep expertise in an area she wants to learn — ideally backend development — so she can focus on frontend while learning from their approach to the backend. She values seeing work style preferences so she can find someone who also likes structured, steady collaboration. |
| **Tech Comfort**         | Medium. Comfortable with web apps but not a power user. Appreciates clear UI and instructions.                                                                                                                                                                                                                                |

### Persona 4: David Park — The Project Lead

| Attribute                | Detail                                                                                                                                                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Age**                  | 24                                                                                                                                                                                                                                                                  |
| **Program**              | MS in Computer Science, Northeastern University                                                                                                                                                                                                                     |
| **Technical Background** | 1 year of industry experience as a full-stack developer. Strong in React, Node.js, MongoDB. Has led small teams before.                                                                                                                                             |
| **Work Style**           | Morning person. Prefers in-person meetings for planning, remote for coding. Organized planner who creates timelines and milestones.                                                                                                                                 |
| **Current Frustration**  | David often ends up doing most of the work because his teammates have overlapping skills and nobody wants to tackle the unfamiliar parts. He wants to build a team where everyone has a clear, distinct role based on their strengths.                              |
| **Goal with SkillSync**  | Post a detailed project listing with specific skill needs (e.g., "need: UI Design, AWS, PostgreSQL") and review applications from people who actually have those skills. He wants to check their availability to ensure the team can hold regular standup meetings. |
| **Tech Comfort**         | High. Expects a responsive, professional interface.                                                                                                                                                                                                                 |

---

## 3. User Stories

### Epic 1: Profile Management

**Story 1.1 — Creating a Profile**  
As Priya, I want to create a profile with my name, email, skills, and GitHub link so that potential partners can see what I bring to a team.  
_Acceptance Criteria:_ The profile form collects name, email, GitHub URL, and skills. Skills can be added one at a time as tags and removed by clicking an × button. Submitting the form creates a new user record in the database and stores my user ID for the session.

**Story 1.2 — Setting Work Style Preferences**  
As Marcus, I want to indicate that I'm a night owl who prefers remote work so that I'm matched with partners who have compatible work habits.  
_Acceptance Criteria:_ The profile form includes selectable options for time preference (morning/night) and work mode (remote/in-person). These preferences are saved with my user profile and displayed on my card when others browse partners.

**Story 1.3 — Updating My Profile**  
As Sofia, I want to update my skills as I learn new technologies so that my profile stays accurate throughout the semester.  
_Acceptance Criteria:_ Visiting the profile page with an existing profile pre-fills all fields. I can add or remove skills and save changes. The database record is updated (PUT, not a new POST).

**Story 1.4 — Deleting My Profile**  
As a user, I want to delete my profile if I no longer want to be listed on the platform.  
_Acceptance Criteria:_ A delete button removes my user record from the database and clears my session.

### Epic 2: Availability Management

**Story 2.1 — Setting Weekly Availability**  
As Priya, I want to click on a weekly time grid to mark when I'm free so that partners can see if our schedules overlap.  
_Acceptance Criteria:_ A grid displays Monday–Sunday columns and 8 AM–9 PM rows. Clicking a slot toggles it between available (blue) and unavailable (white). Selected slots are visually distinct.

**Story 2.2 — Saving Availability**  
As Marcus, I want to save my availability so that it persists when I close the browser and come back later.  
_Acceptance Criteria:_ Clicking "Save Availability" sends all selected slots to the backend as a bulk insert. Previous availability is cleared first to handle updates cleanly. A confirmation message appears on success.

**Story 2.3 — Clearing Availability**  
As a user, I want to clear all my time slots at once so I can start fresh each week.  
_Acceptance Criteria:_ A "Clear All" button deselects every slot on the grid immediately without making an API call (changes aren't persisted until Save is clicked).

### Epic 3: Project Management

**Story 3.1 — Posting a New Project**  
As David, I want to post a project listing the skills I have and the skills I need so that potential partners can see exactly what gap they'd fill.  
_Acceptance Criteria:_ A form collects title, description, "skills I have" (tag input), and "skills I need" (tag input). Submitting creates a project record with status "open" and my user ID as owner.

**Story 3.2 — Browsing All Projects**  
As Sofia, I want to see all open projects so I can find one that needs my skills.  
_Acceptance Criteria:_ The projects page loads and displays all project cards showing title, description, owner name, skills have (green tags), skills need (red tags), and status badge. A filter dropdown lets me show only open or closed projects.

**Story 3.3 — Editing My Project**  
As David, I want to update my project description or change which skills I need as my team evolves.  
_Acceptance Criteria:_ An "Edit" button appears on projects I own. Clicking it pre-fills the form with existing data including skill tags. I can modify any field and save. The status field becomes visible during editing so I can close a filled project.

**Story 3.4 — Deleting My Project**  
As David, I want to delete a project I no longer need so it doesn't clutter the listing.  
_Acceptance Criteria:_ A "Delete" button appears on projects I own. A confirmation dialog prevents accidental deletion. The project record is removed from the database.

**Story 3.5 — Applying to Join a Project**  
As Priya, I want to apply to join a project that needs my frontend skills so the project owner can review my application.  
_Acceptance Criteria:_ An "Apply to Join" button appears on projects I don't own. Clicking it prompts me for a message and sends a partner request to the project owner. If I've already applied, the API returns an error and I'm informed.

### Epic 4: Partner Discovery

**Story 4.1 — Browsing All Users**  
As Marcus, I want to browse all registered users with their skills so I can find potential teammates.  
_Acceptance Criteria:_ The browse page displays a grid of user cards showing name, email, skills (as tags), work style badges, and a GitHub link. Cards load from the API on page render.

**Story 4.2 — Filtering by Skill**  
As David, I want to filter users by a specific skill so I can quickly find someone with React expertise.  
_Acceptance Criteria:_ A text input lets me type a skill name. Clicking "Search" filters the displayed users to only those whose skills include a case-insensitive match. "Clear" resets the filter.

**Story 4.3 — Skill Gap Analysis for a Project**  
As David, I want to select one of my projects and see which users have the skills it needs so I can make an informed decision about who to invite.  
_Acceptance Criteria:_ A dropdown lists my open projects. Selecting one displays the project's needed skills prominently, filters users to those who match at least one needed skill, highlights matching skills on each user card with a distinct style, and sorts users by number of matching skills (most matches first).

**Story 4.4 — Viewing a Partner's Availability**  
As Priya, I want to view another user's weekly availability so I can see if we can actually meet.  
_Acceptance Criteria:_ A "View Availability" button on each user card fetches their availability slots and displays them in a readable format showing which days and hours they're free.

**Story 4.5 — Sending a Partner Request from Browse**  
As David, I want to send a partnership request directly from the browse page when I find a good match for my project.  
_Acceptance Criteria:_ When I have a project selected in the filter, a "Send Request" button appears on each user card. Clicking it prompts for a message, then creates a partner request linking me, the user, and the project.

### Epic 5: Request Management

**Story 5.1 — Viewing Received Requests**  
As David, I want to see all partnership requests I've received so I can review and respond to them.  
_Acceptance Criteria:_ The requests page defaults to a "Received" tab showing cards for each incoming request with project name, requester name, their skills, message, date, and status badge. Only pending requests show Accept/Decline buttons.

**Story 5.2 — Accepting a Request**  
As David, I want to accept a partnership request so the applicant knows they're on the team.  
_Acceptance Criteria:_ Clicking "Accept" updates the request status to "accepted" in the database and refreshes the list. The status badge changes to green.

**Story 5.3 — Declining a Request**  
As David, I want to decline a request that isn't a good fit so the applicant can look elsewhere.  
_Acceptance Criteria:_ Clicking "Decline" updates the request status to "declined" and refreshes the list. The status badge changes to red.

**Story 5.4 — Viewing Sent Requests**  
As Priya, I want to see the requests I've sent so I can track which projects I've applied to and their status.  
_Acceptance Criteria:_ A "Sent" tab shows my outgoing requests with project name, recipient name, my message, and current status. Pending requests show a "Cancel" button.

**Story 5.5 — Cancelling a Sent Request**  
As Priya, I want to cancel a request I sent if I've changed my mind about joining a project.  
_Acceptance Criteria:_ Clicking "Cancel" on a pending sent request shows a confirmation dialog, then deletes the request from the database and refreshes the list.

**Story 5.6 — Filtering Requests by Status**  
As a user, I want to filter my requests by status (pending/accepted/declined) so I can focus on what needs my attention.  
_Acceptance Criteria:_ A status dropdown filters the displayed requests. The filter applies to whichever tab (Received/Sent/All) is currently active.

---

## 4. Design Mockups

### 4.1 Home Page

```
┌──────────────────────────────────────────────────────────┐
│  SkillSync        Home | Profile | Availability |        │
│                   Projects | Browse | Requests           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│           Welcome to SkillSync                           │
│   Find project partners based on complementary           │
│   skills, not just friendship.                           │
│                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │  Create Your │ │  Post a     │ │  Find       │       │
│  │  Profile     │ │  Project    │ │  Partners   │       │
│  │             │ │             │ │             │       │
│  │  List your  │ │  Describe   │ │  Browse     │       │
│  │  skills and │ │  what skills│ │  users with │       │
│  │  preferences│ │  your team  │ │  complement-│       │
│  │             │ │  needs      │ │  ary skills │       │
│  │ [Get Started]│ │[Post Project]│ │  [Browse]   │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│                                                          │
├──────────────────────────────────────────────────────────┤
│          © 2026 SkillSync - Prasad & Saurabh             │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Profile Page

```
┌──────────────────────────────────────────────────────────┐
│  SkillSync        Home | Profile | Availability | ...    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────┐              │
│  │  My Profile                            │              │
│  │                                        │              │
│  │  Name:     [___________________]       │              │
│  │  Email:    [___________________]       │              │
│  │  GitHub:   [___________________]       │              │
│  │                                        │              │
│  │  Skills:                               │              │
│  │  [_____________] [Add]                 │              │
│  │  ┌──────┐ ┌────────┐ ┌─────┐          │              │
│  │  │React ×│ │Node.js ×│ │CSS ×│          │              │
│  │  └──────┘ └────────┘ └─────┘          │              │
│  │                                        │              │
│  │  Work Style:                           │              │
│  │  ┌───────────┐  ┌───────────┐         │              │
│  │  │ ☀ Morning │  │ 🌙 Night  │          │              │
│  │  │ (selected)│  │           │          │              │
│  │  └───────────┘  └───────────┘         │              │
│  │  ┌───────────┐  ┌───────────┐         │              │
│  │  │  Remote   │  │ In-Person │          │              │
│  │  │           │  │ (selected)│          │              │
│  │  └───────────┘  └───────────┘         │              │
│  │                                        │              │
│  │  [Save Profile]  [Delete Profile]      │              │
│  └────────────────────────────────────────┘              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.3 Availability Grid

```
┌──────────────────────────────────────────────────────────┐
│  SkillSync        Home | Profile | Availability | ...    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐      │
│  │  Set Your Availability                         │      │
│  │  Click on time slots when you're available.    │      │
│  │                                                │      │
│  │      Mon   Tue   Wed   Thu   Fri   Sat   Sun  │      │
│  │ 8AM │     │     │     │     │     │     │     │      │
│  │ 9AM │ ██  │     │ ██  │     │ ██  │     │     │      │
│  │10AM │ ██  │     │ ██  │     │ ██  │     │     │      │
│  │11AM │ ██  │ ██  │ ██  │ ██  │     │     │     │      │
│  │12PM │     │ ██  │     │ ██  │     │     │     │      │
│  │ 1PM │     │     │     │     │     │     │     │      │
│  │ 2PM │     │ ██  │     │ ██  │     │     │     │      │
│  │ 3PM │     │ ██  │     │ ██  │     │     │     │      │
│  │ ... │     │     │     │     │     │     │     │      │
│  │ 9PM │     │     │     │     │     │     │     │      │
│  │                                                │      │
│  │  ██ Available    □ Not Available               │      │
│  │                                                │      │
│  │  [Save Availability]  [Clear All]              │      │
│  └────────────────────────────────────────────────┘      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.4 Projects Page

```
┌──────────────────────────────────────────────────────────┐
│  SkillSync        Home | Profile | Availability | ...    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Projects                        [Create New Project]    │
│                                                          │
│  Filter: [All Projects ▼]                                │
│                                                          │
│  ┌────────────────────────────────────────────────┐      │
│  │  E-Commerce Dashboard              [OPEN]      │      │
│  │  Build a real-time analytics dashboard for...  │      │
│  │  Posted by: David Park                         │      │
│  │                                                │      │
│  │  Has:  ┌────────┐ ┌─────────┐                  │      │
│  │        │ Node.js│ │ MongoDB │   (green tags)   │      │
│  │        └────────┘ └─────────┘                  │      │
│  │  Needs:┌───────┐ ┌─────┐ ┌───────────┐        │      │
│  │        │ React │ │ CSS │ │ UI Design │ (red)   │      │
│  │        └───────┘ └─────┘ └───────────┘        │      │
│  │                                                │      │
│  │  [Apply to Join]                               │      │
│  └────────────────────────────────────────────────┘      │
│                                                          │
│  ┌────────────────────────────────────────────────┐      │
│  │  ML Data Pipeline                  [OPEN]      │      │
│  │  ...                                           │      │
│  └────────────────────────────────────────────────┘      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.5 Browse Partners Page

```
┌──────────────────────────────────────────────────────────┐
│  SkillSync        Home | Profile | Availability | ...    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Browse Partners                                         │
│                                                          │
│  ┌────────────────────────────────────────────────┐      │
│  │ Filter by Skill: [________]                    │      │
│  │ For Project:     [Select a project ▼]          │      │
│  │ [Search]  [Clear]                              │      │
│  └────────────────────────────────────────────────┘      │
│                                                          │
│  ┌─ Skill Gap Analysis ─────────────────────────┐        │
│  │ Project: E-Commerce Dashboard                │        │
│  │ Skills Needed: [React] [CSS] [UI Design]     │        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │ Priya Sharma │ │ Sofia Chen   │ │ Alex Kim     │     │
│  │ priya@e.com  │ │ sofia@e.com  │ │ alex@e.com   │     │
│  │              │ │              │ │              │     │
│  │ [React✓]    │ │ [React✓]    │ │ [Python]     │     │
│  │ [CSS✓]      │ │ [JavaScript]│ │ [React✓]    │     │
│  │ [Figma]     │ │ [SQL]       │ │ [AWS]        │     │
│  │              │ │              │ │              │     │
│  │ ☀morning    │ │ ☀morning    │ │ 🌙night      │     │
│  │ 🏢in-person │ │ 🏠remote    │ │ 🏠remote     │     │
│  │              │ │              │ │              │     │
│  │ View GitHub  │ │ View GitHub  │ │ View GitHub  │     │
│  │[Availability]│ │[Availability]│ │[Availability]│     │
│  │[Send Request]│ │[Send Request]│ │[Send Request]│     │
│  └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.6 Requests Page

```
┌──────────────────────────────────────────────────────────┐
│  SkillSync        Home | Profile | Availability | ...    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Partner Requests                                        │
│                                                          │
│  [Received]  [Sent]  [All]                               │
│                                                          │
│  Filter: [All ▼]                                         │
│                                                          │
│  ┌────────────────────────────────────────────────┐      │
│  │  E-Commerce Dashboard              [PENDING]   │      │
│  │                                                │      │
│  │  From: Priya Sharma                            │      │
│  │  To:   David Park (You)                        │      │
│  │  Message: "I'd love to join! I have 2 years    │      │
│  │  of React experience and strong CSS skills."   │      │
│  │  Date: 2/15/2026                               │      │
│  │                                                │      │
│  │  Requester Skills:                             │      │
│  │  [React] [CSS] [Figma] [JavaScript]            │      │
│  │                                                │      │
│  │  [Accept]  [Decline]                           │      │
│  └────────────────────────────────────────────────┘      │
│                                                          │
│  ┌────────────────────────────────────────────────┐      │
│  │  ML Data Pipeline                 [ACCEPTED]   │      │
│  │                                                │      │
│  │  From: Marcus Johnson                          │      │
│  │  To:   David Park (You)                        │      │
│  │  Message: "I can handle the entire backend..." │      │
│  │  Date: 2/14/2026                               │      │
│  └────────────────────────────────────────────────┘      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.7 Navigation Flow

```
                    ┌──────────┐
                    │   Home   │
                    └────┬─────┘
          ┌──────────┬───┴────┬──────────┬──────────┐
          ▼          ▼        ▼          ▼          ▼
     ┌─────────┐ ┌───────┐ ┌────────┐ ┌──────┐ ┌────────┐
     │ Profile │ │Avail- │ │Projects│ │Browse│ │Requests│
     │         │ │ability│ │        │ │      │ │        │
     └─────────┘ └───────┘ └───┬────┘ └──┬───┘ └────────┘
                                │         │
                                ▼         ▼
                          ┌──────────────────┐
                          │ Partner Request  │
                          │ (Apply / Send)   │
                          └──────────────────┘
```

All pages are accessible from the persistent navigation bar. The application uses client-side routing — clicking any nav link or button with a `data-page` attribute re-renders the main content area without a full page reload. User session (current user ID) is persisted in `localStorage` across page navigations and browser sessions.

---

## Appendix: Data Model

### Collections

**users**

```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "skills": ["string"],
  "github_url": "string",
  "work_style": {
    "time_preference": "morning | night",
    "work_mode": "remote | in-person"
  },
  "created_at": "Date"
}
```

**availability_slots**

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (ref: users)",
  "day": "Monday | Tuesday | ... | Sunday",
  "start_hour": "number (8-21)",
  "end_hour": "number (9-22)",
  "created_at": "Date"
}
```

**project_posts**

```json
{
  "_id": "ObjectId",
  "owner_id": "ObjectId (ref: users)",
  "title": "string",
  "description": "string",
  "skills_have": ["string"],
  "skills_need": ["string"],
  "status": "open | closed",
  "created_at": "Date"
}
```

**partner_requests**

```json
{
  "_id": "ObjectId",
  "project_id": "ObjectId (ref: project_posts)",
  "from_user_id": "ObjectId (ref: users)",
  "to_user_id": "ObjectId (ref: users)",
  "message": "string",
  "status": "pending | accepted | declined",
  "created_at": "Date"
}
```

### Entity Relationships

```
users 1──────M availability_slots    (user has many slots)
users 1──────M project_posts         (user owns many projects)
users 1──────M partner_requests      (user sends many requests)
users 1──────M partner_requests      (user receives many requests)
project_posts 1──M partner_requests  (project has many requests)
```
