export type Decision = "allow" | "block" | "require_approval";

export interface Agent {
  id: string;
  name: string;
  owner_team: string;
  description: string;
  tools: string[];
  risk_tier: "low" | "medium" | "high";
  status: "active" | "paused";
  last_violation: string;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  effect: Decision;
}

export interface DecisionRecord {
  trace_id: string;
  timestamp: string;
  agent_id: string;
  tool: string;
  decision: Decision;
  reason: string;
  matched_policies: string[];
  required_approver?: string | null;
  latency_ms?: number | null;
  risk_flags?: string[];
}

export interface ActionRequest {
  requester_id: string;
  requester_role: string;
  agent_id: string;
  tool: string;
  target_resource: string;
  data_classification: "public" | "internal" | "confidential" | "regulated";
  purpose: string;
  environment: "dev" | "staging" | "prod";
  recipient_domain?: "internal" | "external" | null;
  baseline_ok: boolean;
  notes?: string | null;
}

export interface Scenario {
  id: string;
  name: string;
  request: ActionRequest;
}

export interface EvaluateActionResponse {
  trace_id: string;
  decision: Decision;
  reason: string;
  matched_policies: string[];
  required_approver?: string | null;
  risk_flags: string[];
  latency_ms: number;
  request_digest: string;
  request: ActionRequest;
}

export interface SecurityInfo {
  app_env: string;
  allowed_origins: string[];
  rate_limit_per_minute: number;
  notes: string[];
}

export type ViewMode = "engineering" | "security" | "compliance" | "operator";
export type ThemeMode = "light" | "dark" | "high-contrast";