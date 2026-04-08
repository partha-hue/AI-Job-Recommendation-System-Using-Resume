import json
from functools import lru_cache
from pathlib import Path


@lru_cache
def load_jobs() -> list[dict]:
    data_path = Path(__file__).resolve().parent.parent / "data" / "jobs.json"
    with data_path.open("r", encoding="utf-8") as file:
        return json.load(file)
