const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'resumes.json');

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

async function initDataFile() {
  await fs.ensureDir(DATA_DIR);
  const exists = await fs.pathExists(DATA_FILE);
  if (!exists) {
    await fs.writeJson(DATA_FILE, [], { spaces: 2 });
  }
}

async function readResumes() {
  await initDataFile();
  return fs.readJson(DATA_FILE);
}

async function writeResumes(resumes) {
  await fs.writeJson(DATA_FILE, resumes, { spaces: 2 });
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Resume Web App backend is running.' });
});

app.get('/api/resumes', async (req, res) => {
  try {
    const resumes = await readResumes();
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load resumes.' });
  }
});

app.get('/api/resumes/:id', async (req, res) => {
  try {
    const resumes = await readResumes();
    const resume = resumes.find((item) => item.id === req.params.id);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found.' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load resume.' });
  }
});

app.post('/api/resumes', async (req, res) => {
  try {
    const resumes = await readResumes();

    const newResume = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...req.body
    };

    resumes.push(newResume);
    await writeResumes(resumes);

    res.status(201).json(newResume);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create resume.' });
  }
});

app.put('/api/resumes/:id', async (req, res) => {
  try {
    const resumes = await readResumes();
    const index = resumes.findIndex((item) => item.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Resume not found.' });
    }

    resumes[index] = {
      ...resumes[index],
      ...req.body,
      id: resumes[index].id,
      createdAt: resumes[index].createdAt,
      updatedAt: new Date().toISOString()
    };

    await writeResumes(resumes);
    res.json(resumes[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update resume.' });
  }
});

app.delete('/api/resumes/:id', async (req, res) => {
  try {
    const resumes = await readResumes();
    const filtered = resumes.filter((item) => item.id !== req.params.id);

    if (filtered.length === resumes.length) {
      return res.status(404).json({ error: 'Resume not found.' });
    }

    await writeResumes(filtered);
    res.json({ message: 'Resume deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resume.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

initDataFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});