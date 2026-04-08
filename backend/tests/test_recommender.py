from app.services.job_catalog import load_jobs
from app.services.recommender import generate_recommendations


def test_generate_recommendations_returns_ranked_jobs() -> None:
    resume_text = (
        "Python FastAPI developer with SQL, Docker, AWS, React, TypeScript, "
        "machine learning, NLP, and CI/CD experience."
    )

    result = generate_recommendations(resume_text, load_jobs(), top_k=3)

    assert len(result["recommendations"]) == 3
    assert result["recommendations"][0]["match_score"] >= result["recommendations"][1]["match_score"]
    assert "python" in result["extracted_skills"]
