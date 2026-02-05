import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connection.js';
import usersRouter from './routes/users.js';
import availabilityRouter from './routes/availability.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// API Routes - Prasad's collections
app.use('/api/users', usersRouter);
app.use('/api/availability', availabilityRouter);

// API Routes - Saurabh's collections (he will add these)
// app.use('/api/projects', projectsRouter);
// app.use('/api/requests', requestsRouter);

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

async function startServer() { 
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
