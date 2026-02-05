import { MongoClient, ObjectId } from "mongodb";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, "..", "data");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function loadJSON(filename) {
  const filePath = join(dataDir, filename);
  const data = await readFile(filePath, "utf-8");
  return JSON.parse(data);
}

function parseSkills(skills) {
  if (Array.isArray(skills)) {
    return skills;
  }
  if (typeof skills === "string") {
    return skills.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

async function seed() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db("skillsync");

    console.log("\nClearing existing data...");
    await db.collection("users").deleteMany({});
    await db.collection("availability_slots").deleteMany({});
    await db.collection("project_posts").deleteMany({});
    await db.collection("partner_requests").deleteMany({});
    console.log("All collections cleared");

    console.log("\nLoading JSON files from /data folder...");
    const usersRaw = await loadJSON("users.json");
    const availabilityRaw = await loadJSON("availability_slots.json");
    const projectsRaw = await loadJSON("project_posts.json");
    const requestsRaw = await loadJSON("partner_requests.json");

    console.log(`  - users.json: ${usersRaw.length} records`);
    console.log(`  - availability_slots.json: ${availabilityRaw.length} records`);
    console.log(`  - project_posts.json: ${projectsRaw.length} records`);
    console.log(`  - partner_requests.json: ${requestsRaw.length} records`);

    console.log("\nInserting users...");
    const usersToInsert = usersRaw.map((user) => ({
      _id: new ObjectId(),
      name: user.name,
      email: user.email,
      skills: parseSkills(user.skills),
      github_url: user.github_url || "",
      work_style: {
        time_preference:
          user["work_style.time_preference"] ||
          user.work_style?.time_preference ||
          "morning",
        work_mode:
          user["work_style.work_mode"] ||
          user.work_style?.work_mode ||
          "remote",
        deadline_approach:
          user["work_style.deadline_approach"] ||
          user.work_style?.deadline_approach ||
          "steady",
      },
      created_at: new Date(user.created_at || Date.now()),
    }));

    await db.collection("users").insertMany(usersToInsert);
    console.log(`Inserted ${usersToInsert.length} users`);

    const userIds = usersToInsert.map((u) => u._id);

    console.log("\nInserting availability slots...");
    const slotsToInsert = availabilityRaw.map((slot) => {
      const userIndex =
        ((slot.user_index || slot.row_number || Math.floor(Math.random() * 100) + 1) - 1) %
        userIds.length;
      const startHour = slot.start_hour || Math.floor(Math.random() * 12) + 8;

      return {
        _id: new ObjectId(),
        user_id: userIds[Math.abs(userIndex)],
        day: slot.day,
        start_hour: startHour,
        end_hour: startHour + 1,
        created_at: new Date(slot.created_at || Date.now()),
      };
    });

    await db.collection("availability_slots").insertMany(slotsToInsert);
    console.log(`Inserted ${slotsToInsert.length} availability slots`);

    console.log("\nInserting projects...");
    const projectsToInsert = projectsRaw.map((project) => {
      const ownerIndex = ((project.owner_index || 1) - 1) % userIds.length;

      return {
        _id: new ObjectId(),
        owner_id: userIds[Math.abs(ownerIndex)],
        title: project.title || "Untitled Project",
        description: project.description || "",
        skills_have: parseSkills(project.skills_have),
        skills_need: parseSkills(project.skills_need),
        status: project.status || "open",
        created_at: new Date(project.created_at || Date.now()),
      };
    });

    await db.collection("project_posts").insertMany(projectsToInsert);
    console.log(`Inserted ${projectsToInsert.length} projects`);

    const projectIds = projectsToInsert.map((p) => p._id);
    const projectOwners = projectsToInsert.map((p) => p.owner_id);

    console.log("\nInserting partner requests...");
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
        message: req.message || "I would like to join this project.",
        status: req.status || "pending",
        created_at: new Date(req.created_at || Date.now()),
      });
    }

    if (requestsToInsert.length > 0) {
      await db.collection("partner_requests").insertMany(requestsToInsert);
    }
    console.log(`Inserted ${requestsToInsert.length} partner requests`);

    const totalRecords =
      usersToInsert.length +
      slotsToInsert.length +
      projectsToInsert.length +
      requestsToInsert.length;

    console.log("\n========================================");
    console.log("        SEEDING COMPLETE!");
    console.log("========================================");
    console.log(`  Users:              ${usersToInsert.length}`);
    console.log(`  Availability Slots: ${slotsToInsert.length}`);
    console.log(`  Projects:           ${projectsToInsert.length}`);
    console.log(`  Partner Requests:   ${requestsToInsert.length}`);
    console.log("----------------------------------------");
    console.log(`  TOTAL RECORDS:      ${totalRecords}`);
    console.log("========================================");

    if (totalRecords >= 1000) {
      console.log("\n✓ SUCCESS: You have 1000+ records (meets rubric requirement)");
    } else {
      console.log(`\n⚠ WARNING: You have ${totalRecords} records. Need ${1000 - totalRecords} more for rubric.`);
      console.log("  Tip: Increase availability_slots.json to have more rows.");
    }
  } catch (error) {
    console.error("\nSeeding error:", error.message);
    console.error(error);
  } finally {
    await client.close();
    console.log("\nDatabase connection closed.");
  }
}

seed();