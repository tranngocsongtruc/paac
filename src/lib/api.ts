import type {
  Agent,
  Policy,
  DecisionRecord,
  Scenario,
  EvaluateActionResponse,
  ActionRequest,
  SecurityInfo,
} from "./types";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    let detail = "Request failed";
    try {
      const data = await response.json();
      detail = data.detail ?? detail;
    } catch {
      // ignore JSON parse issues
    }
    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getAgents: () => apiFetch<Agent[]>("/agents"),
  getPolicies: () => apiFetch<Policy[]>("/policies"),
  getDecisions: () => apiFetch<DecisionRecord[]>("/decisions"),
  getScenarios: () => apiFetch<Scenario[]>("/scenarios"),
  getSecurityInfo: () => apiFetch<SecurityInfo>("/security-info"),

  login: (username: string, password: string) =>
    apiFetch<{ status: string }>("/auth/demo-login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    apiFetch<{ status: string }>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    }),

  evaluateAction: (payload: ActionRequest) =>
    apiFetch<EvaluateActionResponse>("/evaluate-action", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};