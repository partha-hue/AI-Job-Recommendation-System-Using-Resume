# AI Job Recommendation System Using Resume

Production-oriented full-stack starter for an AI-based job recommendation platform. The repository includes:

- A FastAPI backend that accepts resume text or file uploads and ranks jobs based on extracted skills.
- A React + TypeScript frontend that calls the backend and renders recommendation cards.
- Docker-based packaging for local production-style deployment.

## Project structure

```text
.
|-- backend
|   |-- app
|   |   |-- api/routes/recommendations.py
|   |   |-- core/config.py
|   |   |-- data/jobs.json
|   |   |-- models/schemas.py
|   |   |-- services/
|   |   `-- main.py
|   |-- tests/test_recommender.py
|   |-- Dockerfile
|   `-- requirements.txt
|-- frontend
|   |-- src/
|   |   |-- api.ts
|   |   |-- App.tsx
|   |   |-- main.tsx
|   |   `-- styles.css
|   |-- Dockerfile
|   `-- package.json
|-- sample_data/sample_resume.txt
`-- docker-compose.yml
```

## Backend features

- `POST /api/v1/recommendations/text`
  - Accepts raw resume text.
- `POST /api/v1/recommendations/file`
  - Accepts `.txt`, `.pdf`, and `.docx` resume uploads.
- `GET /health`
  - Health check endpoint.

Recommendation scoring is implemented in `backend/app/services/recommender.py`. It uses:

- Skill extraction from normalized resume text.
- Weighted scoring of required vs preferred skills.
- Missing-skill hints for each result card.

## Frontend features

- Paste resume text or upload a resume file.
- Choose the number of recommendation results.
- Render matched skills, missing skills, ranking reasons, and score percentages.

The frontend API client is in `frontend/src/api.ts`.

## Local development

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs on `http://localhost:5173` and proxies API requests to `http://localhost:8000`.

## Docker deployment

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

## Next production improvements

- Replace the static job catalog with PostgreSQL.
- Add authentication and recruiter/admin roles.
- Store uploaded resumes in object storage.
- Replace keyword scoring with embeddings or a trained ranking model.
