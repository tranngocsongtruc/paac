import { useEffect, useMemo, useState } from "react";
import {
  Play,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  LogIn,
  Lock,
} from "lucide-react";
import { api } from "@/lib/api";
import type {
  Scenario,
  EvaluateActionResponse,
  ViewMode,
  ThemeMode,
} from "@/lib/types";

interface Props {
  viewMode: ViewMode;
  compact?: boolean;
  theme?: ThemeMode;
  onDecisionCommitted?: () => void;
}

function getThemeColors(theme?: ThemeMode) {
  const isDark = theme === "dark";
  const isHighContrast = theme === "high-contrast";

  if (isHighContrast) {
    return {
      pageBg: "bg-white",
      bg: "bg-white",
      bgSecondary: "bg-[#F3F4F6]",
      bgTertiary: "bg-[#E5E7EB]",
      border: "border-black",
      text: "text-black",
      textSecondary: "text-[#374151]",
      hover: "hover:bg-[#F3F4F6]",
    };
  }

  return {
    pageBg: isDark ? "bg-[#0F172A]" : "bg-[#FAFAFA]",
    bg: isDark ? "bg-[#1E293B]" : "bg-white",
    bgSecondary: isDark ? "bg-[#0F172A]" : "bg-[#F9FAFB]",
    bgTertiary: isDark ? "bg-[#334155]" : "bg-[#F3F4F6]",
    border: isDark ? "border-[#334155]" : "border-[#E5E7EB]",
    text: isDark ? "text-white" : "text-[#111827]",
    textSecondary: isDark ? "text-[#94A3B8]" : "text-[#6B7280]",
    hover: isDark ? "hover:bg-[#334155]" : "hover:bg-[#F9FAFB]",
  };
}

function decisionBadge(decision?: EvaluateActionResponse["decision"] | null) {
  if (decision === "allow") return "text-[#10B981] bg-[#D1FAE5]";
  if (decision === "block") return "text-[#EF4444] bg-[#FEE2E2]";
  if (decision === "require_approval") return "text-[#F59E0B] bg-[#FEF3C7]";
  return "text-[#6B7280] bg-[#F3F4F6]";
}

function personaCopy(viewMode: ViewMode, result: EvaluateActionResponse | null) {
  if (!result) {
    return {
      title: "Select a scenario and run an evaluation.",
      body: "This screen turns agent execution into a trust interface by showing what the agent is doing, what it is allowed to do, and why the decision was made.",
    };
  }

  const decisionText = result.decision.replace("_", " ");

  switch (viewMode) {
    case "engineering":
      return {
        title: "Engineering View",
        body: `Runtime decision completed in ${result.latency_ms} ms. Matched policies: ${result.matched_policies.join(", ") || "none"}. Risk flags: ${result.risk_flags.join(", ") || "none"}.`,
      };
    case "security":
      return {
        title: "Security View",
        body: `The action was ${decisionText}. Focus on risk flags, destination, baseline behavior, and whether the agent stayed within its allowed tool boundary.`,
      };
    case "compliance":
      return {
        title: "Compliance View",
        body: `The action was ${decisionText}. The key questions are whether the policy fired consistently, whether an approval path exists, and whether the outcome is auditable.`,
      };
    case "operator":
    default:
      return {
        title: "Operator View",
        body:
          result.decision === "allow"
            ? "The request is safe to continue as submitted."
            : `The request was paused because: ${result.reason}${result.required_approver ? ` Next step: route to ${result.required_approver}.` : ""}`,
      };
  }
}

function buildTimeline(result: EvaluateActionResponse | null, scenario: Scenario | null) {
  const finalStatus =
    result?.decision === "allow"
      ? "allow"
      : result?.decision === "block"
      ? "block"
      : result?.decision === "require_approval"
      ? "approval"
      : "pending";

  return [
    {
      label: "Receive request",
      detail: scenario?.request.purpose ?? "No scenario selected",
      status: "allow",
      ms: 5,
    },
    {
      label: "Evaluate policy context",
      detail: "identity, tool, purpose, destination, data sensitivity",
      status: "allow",
      ms: 12,
    },
    {
      label: scenario?.request.tool ?? "tool_call",
      detail: scenario?.request.target_resource ?? "target_resource",
      status: finalStatus,
      ms: result?.latency_ms ?? 0,
    },
  ];
}

export default function RuntimeScreen({
  viewMode,
  compact = false,
  theme,
  onDecisionCommitted,
}: Props) {
  const colors = getThemeColors(theme);

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("");
  const [result, setResult] = useState<EvaluateActionResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("Sign in to run protected evaluations.");

  useEffect(() => {
    let cancelled = false;

    async function loadScenarios() {
      try {
        setLoading(true);
        const data = await api.getScenarios();
        if (!cancelled) {
          setScenarios(data);
          setSelectedScenarioId(data[0]?.id ?? "");
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load scenarios");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadScenarios();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedScenario = useMemo(
    () => scenarios.find((s) => s.id === selectedScenarioId) ?? null,
    [scenarios, selectedScenarioId]
  );

  const timeline = useMemo(
    () => buildTimeline(result, selectedScenario),
    [result, selectedScenario]
  );

  const persona = useMemo(() => personaCopy(viewMode, result), [viewMode, result]);

  async function handleLogin() {
    try {
      await api.login(username, password);
      setAuthMessage("Signed in. Protected evaluations are enabled.");
      setPassword("");
    } catch (err) {
      setAuthMessage(err instanceof Error ? err.message : "Login failed");
    }
  }

  async function handleRun() {
    if (!selectedScenario) return;

    try {
      setRunning(true);
      setError(null);
      const decision = await api.evaluateAction(selectedScenario.request);
      setResult(decision);
      onDecisionCommitted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className={`h-full flex flex-col ${compact ? "text-xs" : "text-sm"} ${colors.pageBg}`}>
      <div className={`p-3 ${colors.bg} border-b ${colors.border} flex-shrink-0`}>
        <div className="flex flex-col gap-2">
          <div className={`text-xs font-semibold uppercase tracking-[0.16em] ${colors.textSecondary}`}>
            Controlled Autonomy
          </div>
          <h2 className={`text-sm font-semibold ${colors.text}`}>Runtime Evaluation</h2>
          <p className={`text-xs ${colors.textSecondary}`}>
            Evaluate tool calls as action-level decisions based on identity, purpose, data sensitivity, environment, and destination.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-3">
        <div className={`border ${colors.border} ${colors.bgSecondary} p-3 space-y-3`}>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <h3 className={`text-xs font-semibold ${colors.text}`}>Secure demo login</h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-2">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={`px-3 py-2 border ${colors.border} ${colors.bg} ${colors.text} text-xs flex-1`}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`px-3 py-2 border ${colors.border} ${colors.bg} ${colors.text} text-xs flex-1`}
            />
            <button
              type="button"
              onClick={handleLogin}
              className="px-4 py-2 border border-[#111827] text-[#111827] text-xs font-medium hover:bg-[#F3F4F6] flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign in
            </button>
          </div>

          <div className={`text-[10px] ${colors.textSecondary}`}>{authMessage}</div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-3">
          <div className={`border ${colors.border} ${colors.bg}`}>
            <div className={`p-3 border-b ${colors.border}`}>
              <h3 className={`text-xs font-semibold ${colors.text}`}>Scenario Runner</h3>
              <p className={`text-[10px] mt-1 ${colors.textSecondary}`}>
                Pick a seeded scenario and run the policy engine against the tool call.
              </p>
            </div>

            <div className="p-3 space-y-3">
              {loading ? (
                <div className={`text-xs ${colors.textSecondary}`}>Loading scenarios...</div>
              ) : (
                <>
                  <select
                    value={selectedScenarioId}
                    onChange={(e) => setSelectedScenarioId(e.target.value)}
                    className={`w-full px-3 py-2 border ${colors.border} ${colors.bgSecondary} ${colors.text} text-xs`}
                  >
                    {scenarios.map((scenario) => (
                      <option key={scenario.id} value={scenario.id}>
                        {scenario.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleRun}
                    disabled={!selectedScenario || running}
                    className="w-full px-4 py-2 bg-[#111827] text-white text-xs font-medium hover:bg-[#1F2937] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                    {running ? "Running..." : "Run Evaluation"}
                  </button>

                  {error && <div className="text-xs text-[#EF4444]">{error}</div>}

                  <div className={`border ${colors.border} ${colors.bgSecondary}`}>
                    <div className={`p-3 border-b ${colors.border}`}>
                      <div className={`text-xs font-semibold ${colors.text}`}>Action Request</div>
                    </div>
                    <div className="p-3">
                      <pre className={`text-[10px] whitespace-pre-wrap ${colors.text}`}>
                        {selectedScenario ? JSON.stringify(selectedScenario.request, null, 2) : "No scenario selected"}
                      </pre>
                    </div>
                  </div>

                  <div className={`border ${colors.border} ${colors.bgSecondary}`}>
                    <div className={`p-3 border-b ${colors.border}`}>
                      <div className={`text-xs font-semibold ${colors.text}`}>Execution Timeline</div>
                    </div>
                    <div className="p-3 space-y-3">
                      {timeline.map((step, index) => {
                        const icon =
                          step.status === "allow"
                            ? CheckCircle2
                            : step.status === "block"
                            ? AlertTriangle
                            : step.status === "approval"
                            ? Clock3
                            : Shield;

                        const Icon = icon;

                        const statusClass =
                          step.status === "allow"
                            ? "text-[#10B981]"
                            : step.status === "block"
                            ? "text-[#EF4444]"
                            : step.status === "approval"
                            ? "text-[#F59E0B]"
                            : "text-[#6B7280]";

                        return (
                          <div key={index} className="flex items-start gap-3">
                            <div className={`mt-0.5 ${statusClass}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className={`text-xs font-medium ${colors.text}`}>{step.label}</div>
                              <div className={`text-[10px] mt-0.5 ${colors.textSecondary}`}>{step.detail}</div>
                            </div>
                            <div className={`text-[10px] ${colors.textSecondary}`}>
                              {step.ms ? `${step.ms} ms` : "—"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className={`border ${colors.border} ${colors.bg}`}>
              <div className={`p-3 border-b ${colors.border} flex items-center justify-between gap-3`}>
                <h3 className={`text-xs font-semibold ${colors.text}`}>Decision Output</h3>
                <span className={`px-2.5 py-1 text-[10px] font-bold ${decisionBadge(result?.decision)}`}>
                  {result ? result.decision.replace("_", " ").toUpperCase() : "NO DECISION"}
                </span>
              </div>

              <div className="p-3 space-y-3">
                <div>
                  <div className={`text-[10px] uppercase tracking-[0.14em] ${colors.textSecondary}`}>
                    Reason
                  </div>
                  <div className={`text-xs mt-1 ${colors.text}`}>
                    {result?.reason ?? "Run a scenario to see the runtime policy decision."}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 border ${colors.border} ${colors.bgSecondary}`}>
                    <div className={`text-[10px] uppercase tracking-[0.14em] ${colors.textSecondary}`}>
                      Latency
                    </div>
                    <div className={`text-xs font-semibold mt-1 ${colors.text}`}>
                      {typeof result?.latency_ms === "number" ? `${result.latency_ms} ms` : "—"}
                    </div>
                  </div>

                  <div className={`p-3 border ${colors.border} ${colors.bgSecondary}`}>
                    <div className={`text-[10px] uppercase tracking-[0.14em] ${colors.textSecondary}`}>
                      Approver
                    </div>
                    <div className={`text-xs font-semibold mt-1 ${colors.text}`}>
                      {result?.required_approver ?? "—"}
                    </div>
                  </div>
                </div>

                <div className={`p-3 border ${colors.border} ${colors.bgSecondary}`}>
                  <div className={`text-[10px] uppercase tracking-[0.14em] ${colors.textSecondary}`}>
                    Matched Policies
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {result?.matched_policies?.length ? (
                      result.matched_policies.map((policy) => (
                        <span
                          key={policy}
                          className={`px-2 py-0.5 text-[10px] ${colors.bgTertiary} ${colors.text}`}
                        >
                          {policy}
                        </span>
                      ))
                    ) : (
                      <span className={`text-xs ${colors.textSecondary}`}>—</span>
                    )}
                  </div>
                </div>

                <div className={`p-3 border ${colors.border} ${colors.bgSecondary}`}>
                  <div className={`text-[10px] uppercase tracking-[0.14em] ${colors.textSecondary}`}>
                    Risk Flags
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {result?.risk_flags?.length ? (
                      result.risk_flags.map((flag) => (
                        <span
                          key={flag}
                          className="px-2 py-0.5 text-[10px] bg-[#FEF3C7] text-[#92400E]"
                        >
                          {flag}
                        </span>
                      ))
                    ) : (
                      <span className={`text-xs ${colors.textSecondary}`}>none</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={`border ${colors.border} ${colors.bg}`}>
              <div className={`p-3 border-b ${colors.border}`}>
                <h3 className={`text-xs font-semibold ${colors.text}`}>{persona.title}</h3>
              </div>
              <div className="p-3">
                <p className={`text-xs ${colors.text}`}>{persona.body}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}