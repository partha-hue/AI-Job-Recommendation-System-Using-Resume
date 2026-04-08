import re
from collections import Counter


SKILL_KEYWORDS = {
    "python",
    "fastapi",
    "sql",
    "postgresql",
    "machine learning",
    "nlp",
    "docker",
    "kubernetes",
    "aws",
    "pandas",
    "scikit-learn",
    "react",
    "typescript",
    "css",
    "rest api",
    "ci/cd",
    "testing",
    "statistics",
    "data visualization",
    "tensorflow",
    "monitoring",
    "terraform",
    "linux",
    "mlflow",
    "api integration",
    "prompt engineering",
    "figma",
    "jwt",
    "redis",
    "vite",
}


def normalize_text(value: str) -> str:
    lowered = value.lower()
    return re.sub(r"[^a-z0-9+#./\s-]", " ", lowered)


def extract_skills(resume_text: str) -> list[str]:
    normalized = normalize_text(resume_text)
    found = [skill for skill in SKILL_KEYWORDS if skill in normalized]
    return sorted(found)


def score_job(job: dict, resume_text: str, extracted_skills: list[str]) -> dict:
    normalized_resume = normalize_text(resume_text)
    required_skills = job["required_skills"]
    preferred_skills = job["preferred_skills"]

    matched_required = [skill for skill in required_skills if skill in normalized_resume]
    matched_preferred = [skill for skill in preferred_skills if skill in normalized_resume]
    missing_required = [skill for skill in required_skills if skill not in matched_required]

    weighted_score = 0.0
    if required_skills:
        weighted_score += (len(matched_required) / len(required_skills)) * 0.75
    if preferred_skills:
        weighted_score += (len(matched_preferred) / len(preferred_skills)) * 0.25

    keyword_hits = Counter(token for token in extracted_skills if token in (required_skills + preferred_skills))
    keyword_bonus = min(sum(keyword_hits.values()) * 0.02, 0.1)
    final_score = min(weighted_score + keyword_bonus, 1.0)

    reasons = []
    if matched_required:
        reasons.append(f"Matched required skills: {', '.join(matched_required[:4])}")
    if matched_preferred:
        reasons.append(f"Matched preferred skills: {', '.join(matched_preferred[:3])}")
    if not reasons:
        reasons.append("General alignment based on resume context and transferable keywords.")

    return {
        "job_id": job["job_id"],
        "title": job["title"],
        "company": job["company"],
        "location": job["location"],
        "summary": job["summary"],
        "match_score": round(final_score * 100, 2),
        "reasons": reasons,
        "missing_skills": missing_required[:5],
        "matched_skills": sorted(set(matched_required + matched_preferred)),
    }


def generate_recommendations(resume_text: str, jobs: list[dict], top_k: int) -> dict:
    extracted_skills = extract_skills(resume_text)
    scored_jobs = [score_job(job, resume_text, extracted_skills) for job in jobs]
    recommendations = sorted(scored_jobs, key=lambda item: item["match_score"], reverse=True)[:top_k]
    return {
        "extracted_skills": extracted_skills,
        "recommendations": recommendations,
    }
