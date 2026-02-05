# SkillSync

Find Project Partners Through Complementary Skills, Not Friendship

## Author

- Prasad Kanade (Users & Availability)
- Saurabh Lohokare (Projects & Matching)

## Class

[Web Development Spring 2026](https://northeastern.edu)

## Project Objective

SkillSync matches students for project teams based on complementary technical skills and schedule compatibility, not just friendship.

## Screenshot

![SkillSync Homepage](screenshot.png)

## Features

- Create profile with skills and work style preferences
- Set weekly availability on interactive grid
- Browse potential partners
- Skill-based matching (coming soon)

## Tech Stack

- Node.js + Express
- MongoDB (native driver)
- Vanilla JavaScript (client-side rendering)
- HTML5 + CSS3

## Setup Instructions

1. Clone the repository:

```bash
   git clone https://github.com/Saurabhpl2408/SkillSync.git
   cd SkillSync
```

2. Install dependencies:

```bash
   npm install
```

3. Create `.env` file:

```
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
```

4. Seed the database:

```bash
   npm run seed
```

5. Start the server:

```bash
   npm run dev
```

6. Open http://localhost:3000

## License

MIT
