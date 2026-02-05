import { MongoClient, ObjectId } from 'mongodb';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '..', 'data');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const SKILLS_LIST = [
  'React',
  'Node.js',
  'MongoDB',
  'Express',
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'CSS',
  'HTML',
  'Vue.js',
  'Angular',
  'PostgreSQL',
  'MySQL',
  'AWS',
  'Docker',
  'GraphQL',
  'REST API',
  'Git',
  'Redux',
  'Next.js',
  'Django',
  'Flask',
  'TailwindCSS',
  'Bootstrap',
  'Figma',
  'UI Design',
  'UX Design',
  'Swift',
  'Kotlin',
  'Go',
  'Rust',
];

function randomElements(arr, min, max) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function loadJSON(filename) {
  const filePath = join(dataDir, filename);
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

function getName(user) {
  const name = user.name || user['name '] || '';
  if (name && name.trim().length > 0) {
    return name.trim();
  }
  return null;
}

function getSkills(skills) {
  if (Array.isArray(skills) && skills.length > 0) {
    return skills.filter((s) => typeof s === 'string' && s.length < 30);
  }
  if (typeof skills === 'string' && skills.length > 0 && skills.length < 30) {
    const additionalSkills = randomElements(
      SKILLS_LIST.filter((s) => s !== skills),
      1,
      4
    );
    return [skills, ...additionalSkills];
  }
  return randomElements(SKILLS_LIST, 2, 5);
}

function getGithubUrl(user, index) {
  const name = getName(user);
  if (name) {
    const username = name.toLowerCase().replace(/\s+/g, '');
    return `https://github.com/${username}${index}`;
  }
  return `https://github.com/user${index}`;
}

async function seed() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const db = client.db('skillsync');

    console.log('\nClearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('availability_slots').deleteMany({});
    await db.collection('project_posts').deleteMany({});
    await db.collection('partner_requests').deleteMany({});
    console.log('All collections cleared');

    console.log('\nLoading JSON files from /data folder...');
    const usersRaw = await loadJSON('users.json');
    const availabilityRaw = await loadJSON('availability_slots.json');
    const projectsRaw = await loadJSON('project_posts.json');
    const requestsRaw = await loadJSON('partner_requests.json');

    console.log(`  - users.json: ${usersRaw.length} records`);
    console.log(
      `  - availability_slots.json: ${availabilityRaw.length} records`
    );
    console.log(`  - project_posts.json: ${projectsRaw.length} records`);
    console.log(`  - partner_requests.json: ${requestsRaw.length} records`);

    console.log('\nInserting users...');
    const usedEmails = new Set();
    const usersToInsert = usersRaw.map((user, index) => {
      let email = user.email;
      if (!email || usedEmails.has(email)) {
        email = `user${index + 1}@example.com`;
      }
      usedEmails.add(email);

      const name = getName(user);

      return {
        _id: new ObjectId(),
        name: name || `User ${index + 1}`,
        email: email,
        skills: getSkills(user.skills),
        github_url: getGithubUrl(user, index),
        work_style: {
          time_preference:
            user['work_style.time_preference'] ||
            user.work_style?.time_preference ||
            'morning',
          work_mode:
            user['work_style.work_mode'] ||
            user.work_style?.work_mode ||
            'remote',
          deadline_approach:
            user['work_style.deadline_approach'] ||
            user.work_style?.deadline_approach ||
            'steady',
        },
        created_at: new Date(user.created_at || Date.now()),
      };
    });

    await db.collection('users').insertMany(usersToInsert);
    console.log(`Inserted ${usersToInsert.length} users`);

    console.log('\nSample user:');
    console.log(JSON.stringify(usersToInsert[0], null, 2));

    const userIds = usersToInsert.map((u) => u._id);

    console.log('\nInserting availability slots...');
    const slotsToInsert = availabilityRaw.map((slot) => {
      const userIndex =
        ((slot.user_index ||
          slot.row_number ||
          Math.floor(Math.random() * 100) + 1) -
          1) %
        userIds.length;
      const startHour = slot.start_hour || Math.floor(Math.random() * 12) + 8;

      return {
        _id: new ObjectId(),
        user_id: userIds[Math.abs(userIndex)],
        day: slot.day || 'Monday',
        start_hour: startHour,
        end_hour: startHour + 1,
        created_at: new Date(slot.created_at || Date.now()),
      };
    });

    await db.collection('availability_slots').insertMany(slotsToInsert);
    console.log(`Inserted ${slotsToInsert.length} availability slots`);

    console.log('\nInserting projects...');
    const projectsToInsert = projectsRaw.map((project) => {
      const ownerIndex = ((project.owner_index || 1) - 1) % userIds.length;

      return {
        _id: new ObjectId(),
        owner_id: userIds[Math.abs(ownerIndex)],
        title: project.title || 'Untitled Project',
        description:
          project.description ||
          'A collaborative project looking for team members.',
        skills_have: getSkills(project.skills_have),
        skills_need: getSkills(project.skills_need),
        status: project.status || 'open',
        created_at: new Date(project.created_at || Date.now()),
      };
    });

    await db.collection('project_posts').insertMany(projectsToInsert);
    console.log(`Inserted ${projectsToInsert.length} projects`);

    const projectIds = projectsToInsert.map((p) => p._id);
    const projectOwners = projectsToInsert.map((p) => p.owner_id);

    console.log('\nInserting partner requests...');
    const requestsToInsert = [];
    const usedPairs = new Set();

    for (const req of requestsRaw) {
      const projectIndex = ((req.project_index || 1) - 1) % projectIds.length;
      const fromIndex = ((req.from_user_index || 1) - 1) % userIds.length;

      const projectId = projectIds[Math.abs(projectIndex)];
      const fromUserId = userIds[Math.abs(fromIndex)];
      const toUserId = projectOwners[Math.abs(projectIndex)];

      if (fromUserId.equals(toUserId)) {
        continue;
      }

      const pairKey = `${projectId}-${fromUserId}`;
      if (usedPairs.has(pairKey)) {
        continue;
      }
      usedPairs.add(pairKey);

      requestsToInsert.push({
        _id: new ObjectId(),
        project_id: projectId,
        from_user_id: fromUserId,
        to_user_id: toUserId,
        message: req.message || 'I would like to join this project.',
        status: req.status || 'pending',
        created_at: new Date(req.created_at || Date.now()),
      });
    }

    if (requestsToInsert.length > 0) {
      await db.collection('partner_requests').insertMany(requestsToInsert);
    }
    console.log(`Inserted ${requestsToInsert.length} partner requests`);

    const totalRecords =
      usersToInsert.length +
      slotsToInsert.length +
      projectsToInsert.length +
      requestsToInsert.length;

    console.log('\n========================================');
    console.log('        SEEDING COMPLETE!');
    console.log('========================================');
    console.log(`  Users:              ${usersToInsert.length}`);
    console.log(`  Availability Slots: ${slotsToInsert.length}`);
    console.log(`  Projects:           ${projectsToInsert.length}`);
    console.log(`  Partner Requests:   ${requestsToInsert.length}`);
    console.log('----------------------------------------');
    console.log(`  TOTAL RECORDS:      ${totalRecords}`);
    console.log('========================================');

    if (totalRecords >= 1000) {
      console.log(
        '\n✓ SUCCESS: You have 1000+ records (meets rubric requirement)'
      );
    } else {
      console.log(
        `\n⚠ WARNING: You have ${totalRecords} records. Need ${1000 - totalRecords} more for rubric.`
      );
    }
  } catch (error) {
    console.error('\nSeeding error:', error.message);
    console.error(error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed.');
  }
}

seed();
