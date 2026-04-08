import type { JobItem, RecommendationResponse } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

function toReadableError(message: string): string {
  if (message.includes("Failed to fetch")) {
    return "Backend API is not running on http://127.0.0.1:8000. Start the FastAPI server and try again.";
  }

  return message;
}

async function handleResponse(response: Response): Promise<RecommendationResponse> {
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.detail ?? "Request failed.");
  }

  return response.json() as Promise<RecommendationResponse>;
}

export async function recommendFromText(
  resumeText: string,
  topK: number,
): Promise<RecommendationResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/recommendations/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume_text: resumeText,
        top_k: topK,
      }),
    });
  } catch (error) {
    throw new Error(toReadableError(error instanceof Error ? error.message : "Request failed."));
  }

  return handleResponse(response);
}

export async function recommendFromFile(
  file: File,
  topK: number,
): Promise<RecommendationResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(
      `${API_BASE_URL}/recommendations/file?top_k=${topK}`,
      {
        method: "POST",
        body: formData,
      },
    );
  } catch (error) {
    throw new Error(toReadableError(error instanceof Error ? error.message : "Upload failed."));
  }

  return handleResponse(response);
}

export async function fetchJobs(): Promise<JobItem[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/jobs`);
  } catch (error) {
    throw new Error(toReadableError(error instanceof Error ? error.message : "Failed to load jobs."));
  }

  if (!response.ok) {
    throw new Error("Failed to load jobs.");
  }

  return response.json() as Promise<JobItem[]>;
}

export async function fetchHealth(): Promise<boolean> {
  try {
    const response = await fetch("/health");
    return response.ok;
  } catch {
    return false;
  }
}
