const API_BASE = '/api/resumes';

let currentResumeId = null;
let resumeData = createEmptyResume();

function createEmptyResume() {
  return {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: ''
  };
}

function generateItem(type) {
  if (type === 'education') {
    return {
      school: '',
      degree: '',
      startDate: '',
      endDate: '',
      details: ''
    };
  }

  if (type === 'experience') {
    return {
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      details: ''
    };
  }

  return {
    name: '',
    tech: '',
    link: '',
    details: ''
  };
}

function bindBasicFields() {
  const fields = [
    'fullName',
    'jobTitle',
    'email',
    'phone',
    'location',
    'linkedin',
    'summary',
    'skills'
  ];

  fields.forEach((field) => {
    const el = document.getElementById(field);
    el.addEventListener('input', (e) => {
      resumeData[field] = e.target.value;
      renderPreview();
    });
  });
}

function setBasicFields() {
  document.getElementById('fullName').value = resumeData.fullName || '';
  document.getElementById('jobTitle').value = resumeData.jobTitle || '';
  document.getElementById('email').value = resumeData.email || '';
  document.getElementById('phone').value = resumeData.phone || '';
  document.getElementById('location').value = resumeData.location || '';
  document.getElementById('linkedin').value = resumeData.linkedin || '';
  document.getElementById('summary').value = resumeData.summary || '';
  document.getElementById('skills').value = resumeData.skills || '';
}

function renderEducation() {
  const container = document.getElementById('educationContainer');
  container.innerHTML = '';

  resumeData.education.forEach((item, index) => {
    const block = document.createElement('div');
    block.className = 'item-block';
    block.innerHTML = `
      <div class="grid two-col">
        <input placeholder="School" value="${escapeHtml(item.school)}" data-type="education" data-index="${index}" data-field="school" />
        <input placeholder="Degree" value="${escapeHtml(item.degree)}" data-type="education" data-index="${index}" data-field="degree" />
        <input placeholder="Start Date" value="${escapeHtml(item.startDate)}" data-type="education" data-index="${index}" data-field="startDate" />
        <input placeholder="End Date" value="${escapeHtml(item.endDate)}" data-type="education" data-index="${index}" data-field="endDate" />
      </div>
      <textarea placeholder="Details" data-type="education" data-index="${index}" data-field="details">${escapeHtml(item.details)}</textarea>
      <div class="item-actions">
        <button class="remove-btn" onclick="removeItem('education', ${index})">Remove</button>
      </div>
    `;
    container.appendChild(block);
  });

  attachDynamicInputListeners(container);
}

function renderExperience() {
  const container = document.getElementById('experienceContainer');
  container.innerHTML = '';

  resumeData.experience.forEach((item, index) => {
    const block = document.createElement('div');
    block.className = 'item-block';
    block.innerHTML = `
      <div class="grid two-col">
        <input placeholder="Company" value="${escapeHtml(item.company)}" data-type="experience" data-index="${index}" data-field="company" />
        <input placeholder="Role" value="${escapeHtml(item.role)}" data-type="experience" data-index="${index}" data-field="role" />
        <input placeholder="Start Date" value="${escapeHtml(item.startDate)}" data-type="experience" data-index="${index}" data-field="startDate" />
        <input placeholder="End Date" value="${escapeHtml(item.endDate)}" data-type="experience" data-index="${index}" data-field="endDate" />
      </div>
      <textarea placeholder="Details" data-type="experience" data-index="${index}" data-field="details">${escapeHtml(item.details)}</textarea>
      <div class="item-actions">
        <button class="remove-btn" onclick="removeItem('experience', ${index})">Remove</button>
      </div>
    `;
    container.appendChild(block);
  });

  attachDynamicInputListeners(container);
}

function renderProjects() {
  const container = document.getElementById('projectContainer');
  container.innerHTML = '';

  resumeData.projects.forEach((item, index) => {
    const block = document.createElement('div');
    block.className = 'item-block';
    block.innerHTML = `
      <div class="grid two-col">
        <input placeholder="Project Name" value="${escapeHtml(item.name)}" data-type="projects" data-index="${index}" data-field="name" />
        <input placeholder="Tech Stack" value="${escapeHtml(item.tech)}" data-type="projects" data-index="${index}" data-field="tech" />
        <input placeholder="Project Link" value="${escapeHtml(item.link)}" data-type="projects" data-index="${index}" data-field="link" />
      </div>
      <textarea placeholder="Details" data-type="projects" data-index="${index}" data-field="details">${escapeHtml(item.details)}</textarea>
      <div class="item-actions">
        <button class="remove-btn" onclick="removeItem('projects', ${index})">Remove</button>
      </div>
    `;
    container.appendChild(block);
  });

  attachDynamicInputListeners(container);
}

function attachDynamicInputListeners(container) {
  const elements = container.querySelectorAll('input, textarea');
  elements.forEach((el) => {
    el.addEventListener('input', (e) => {
      const { type, index, field } = e.target.dataset;
      resumeData[type][Number(index)][field] = e.target.value;
      renderPreview();
    });
  });
}

function addItem(type) {
  resumeData[type].push(generateItem(type));
  renderDynamicSections();
  renderPreview();
}

function removeItem(type, index) {
  resumeData[type].splice(index, 1);
  renderDynamicSections();
  renderPreview();
}

window.removeItem = removeItem;

function renderDynamicSections() {
  renderEducation();
  renderExperience();
  renderProjects();
}

function renderPreview() {
  const preview = document.getElementById('resumePreview');

  const educationHtml = resumeData.education.map((item) => `
    <div class="preview-item">
      <div class="preview-item-title">${safe(item.degree || 'Degree')}</div>
      <div class="preview-subtitle">${safe(item.school)} ${formatDateRange(item.startDate, item.endDate)}</div>
      <div class="preview-text">${safe(item.details)}</div>
    </div>
  `).join('');

  const experienceHtml = resumeData.experience.map((item) => `
    <div class="preview-item">
      <div class="preview-item-title">${safe(item.role || 'Role')}</div>
      <div class="preview-subtitle">${safe(item.company)} ${formatDateRange(item.startDate, item.endDate)}</div>
      <div class="preview-text">${safe(item.details)}</div>
    </div>
  `).join('');

  const projectHtml = resumeData.projects.map((item) => `
    <div class="preview-item">
      <div class="preview-item-title">${safe(item.name || 'Project')}</div>
      <div class="preview-subtitle">${safe(item.tech)} ${item.link ? `| <a href="${safe(item.link)}" target="_blank">Link</a>` : ''}</div>
      <div class="preview-text">${safe(item.details)}</div>
    </div>
  `).join('');

  preview.innerHTML = `
    <div class="preview-name">${safe(resumeData.fullName || 'Your Name')}</div>
    <div class="preview-title">${safe(resumeData.jobTitle || 'Your Target Role')}</div>
    <div class="preview-contact">
      ${safe(resumeData.email)} ${resumeData.email ? '|' : ''}
      ${safe(resumeData.phone)} ${resumeData.phone ? '|' : ''}
      ${safe(resumeData.location)} ${resumeData.location ? '|' : ''}
      ${resumeData.linkedin ? `<a href="${safe(resumeData.linkedin)}" target="_blank">LinkedIn</a>` : ''}
    </div>

    <div class="preview-section">
      <h3>Summary</h3>
      <div class="preview-text">${safe(resumeData.summary || 'Add a professional summary here.')}</div>
    </div>

    <div class="preview-section">
      <h3>Education</h3>
      ${educationHtml || '<div class="muted">No education entries yet.</div>'}
    </div>

    <div class="preview-section">
      <h3>Experience</h3>
      ${experienceHtml || '<div class="muted">No experience entries yet.</div>'}
    </div>

    <div class="preview-section">
      <h3>Projects</h3>
      ${projectHtml || '<div class="muted">No project entries yet.</div>'}
    </div>

    <div class="preview-section">
      <h3>Skills</h3>
      <div class="preview-text">${safe(resumeData.skills || 'Add your skills here.')}</div>
    </div>
  `;
}

function formatDateRange(start, end) {
  const parts = [start, end].filter(Boolean);
  return parts.length ? `(${parts.join(' - ')})` : '';
}

function safe(value) {
  return escapeHtml(value || '');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function loadResumeList() {
  try {
    const response = await fetch(API_BASE);
    const resumes = await response.json();
    const container = document.getElementById('resumeList');
    container.innerHTML = '';

    if (!resumes.length) {
      container.innerHTML = '<p class="muted">No resumes saved yet.</p>';
      return;
    }

    resumes
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .forEach((resume) => {
        const item = document.createElement('div');
        item.className = 'resume-list-item';
        item.innerHTML = `
          <h3>${safe(resume.fullName || 'Untitled Resume')}</h3>
          <p>${safe(resume.jobTitle || 'No title')}</p>
          <div class="resume-list-actions">
            <button class="secondary-btn small-btn" onclick="openResume('${resume.id}')">Open</button>
            <button class="remove-btn small-btn" onclick="deleteResume('${resume.id}')">Delete</button>
          </div>
        `;
        container.appendChild(item);
      });
  } catch (error) {
    console.error('Failed to load resume list:', error);
  }
}

async function openResume(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    const data = await response.json();

    currentResumeId = data.id;
    resumeData = {
      ...createEmptyResume(),
      ...data,
      education: data.education || [],
      experience: data.experience || [],
      projects: data.projects || []
    };

    setBasicFields();
    renderDynamicSections();
    renderPreview();
  } catch (error) {
    console.error('Failed to open resume:', error);
  }
}

window.openResume = openResume;

async function saveResume() {
  try {
    const payload = { ...resumeData };
    delete payload.id;
    delete payload.createdAt;
    delete payload.updatedAt;

    let response;

    if (currentResumeId) {
      response = await fetch(`${API_BASE}/${currentResumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    const saved = await response.json();
    currentResumeId = saved.id;
    alert('Resume saved successfully.');
    await loadResumeList();
  } catch (error) {
    console.error('Failed to save resume:', error);
    alert('Failed to save resume.');
  }
}

async function deleteResume(id) {
  const confirmed = window.confirm('Delete this resume?');
  if (!confirmed) return;

  try {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });

    if (currentResumeId === id) {
      resetResume();
    }

    await loadResumeList();
  } catch (error) {
    console.error('Failed to delete resume:', error);
  }
}

window.deleteResume = deleteResume;

function resetResume() {
  currentResumeId = null;
  resumeData = createEmptyResume();
  setBasicFields();
  renderDynamicSections();
  renderPreview();
}

function downloadPdf() {
  const element = document.getElementById('resumePreview');
  const filename = `${(resumeData.fullName || 'resume').replace(/\s+/g, '_')}.pdf`;

  html2pdf()
    .set({
      margin: 0.4,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    })
    .from(element)
    .save();
}

function setupButtons() {
  document.getElementById('newResumeBtn').addEventListener('click', resetResume);
  document.getElementById('saveResumeBtn').addEventListener('click', saveResume);
  document.getElementById('downloadPdfBtn').addEventListener('click', downloadPdf);

  document.getElementById('addEducationBtn').addEventListener('click', () => addItem('education'));
  document.getElementById('addExperienceBtn').addEventListener('click', () => addItem('experience'));
  document.getElementById('addProjectBtn').addEventListener('click', () => addItem('projects'));
}

async function init() {
  bindBasicFields();
  setupButtons();
  setBasicFields();
  renderDynamicSections();
  renderPreview();
  await loadResumeList();
}

init();