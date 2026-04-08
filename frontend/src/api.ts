import type {
  ApplicationItem,
  AuthResponse,
  CandidateProfile,
  JobItem,
  RecruiterProfile,
  RecommendationResponse,
  User,
  UserRole,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

function toReadableError(message: string): string {
  if (message.includes("Failed to fetch")) {
    return "Backend API is not running on http://127.0.0.1:8000. Start the FastAPI server and try again.";
  }
  return message;
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch (error) {
    throw new Error(toReadableError(error instanceof Error ? error.message : "Request failed."));
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.detail ?? "Request failed.");
  }

  return response.json() as Promise<T>;
}

export function signup(payload: {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  return request<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchMe(token: string) {
  return request<User>("/auth/me", {}, token);
}

export function fetchJobs() {
  return request<JobItem[]>("/jobs");
}

export function createJob(token: string, payload: JobItem) {
  return request<JobItem>("/jobs", { method: "POST", body: JSON.stringify(payload) }, token);
}

export function recommendFromText(resumeText: string, topK: number, token?: string) {
  return request<RecommendationResponse>(
    "/recommendations/text",
    {
      method: "POST",
      body: JSON.stringify({ resume_text: resumeText, top_k: topK }),
    },
    token,
  );
}

export async function recommendFromFile(file: File, topK: number, token?: string): Promise<RecommendationResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/recommendations/file?top_k=${topK}`, {
      method: "POST",
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  } catch (error) {
    throw new Error(toReadableError(error instanceof Error ? error.message : "Upload failed."));
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.detail ?? "Upload failed.");
  }

  return response.json() as Promise<RecommendationResponse>;
}

export function fetchCandidateProfile(token: string) {
  return request<CandidateProfile>("/profiles/candidate/me", {}, token);
}

export function updateCandidateProfile(token: string, payload: CandidateProfile) {
  return request<CandidateProfile>("/profiles/candidate/me", { method: "PUT", body: JSON.stringify(payload) }, token);
}

export function fetchRecruiterProfile(token: string) {
  return request<RecruiterProfile>("/profiles/recruiter/me", {}, token);
}

export function updateRecruiterProfile(token: string, payload: RecruiterProfile) {
  return request<RecruiterProfile>("/profiles/recruiter/me", { method: "PUT", body: JSON.stringify(payload) }, token);
}

export function fetchApplications(token: string) {
  return request<ApplicationItem[]>("/applications/me", {}, token);
}

export function createApplication(token: string, payload: { job_id: string; cover_letter: string }) {
  return request<ApplicationItem>("/applications", { method: "POST", body: JSON.stringify(payload) }, token);
}

export function updateApplicationStatus(token: string, applicationId: number, status: string) {
  return request<ApplicationItem>(
    `/applications/${applicationId}`,
    { method: "PATCH", body: JSON.stringify({ status }) },
    token,
  );
}

export async function fetchHealth(): Promise<boolean> {
  try {
    const response = await fetch("/health");
    return response.ok;
  } catch {
    return false;
  }
}
