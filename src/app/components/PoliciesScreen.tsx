import { useEffect, useMemo, useState } from "react";
import { ChevronRight, ShieldCheck, FileCode2, Info } from "lucide-react";
import { api } from "@/lib/api";
import type { Policy, ThemeMode } from "@/lib/types";

interface Props {
  compact?: boolean;
  theme?: ThemeMode;
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

function effectBadge(effect: Policy["effect"]) {
  if (effect === "allow") return "text-[#10B981] bg-[#D1FAE5]";
  if (effect === "block") return "text-[#EF4444] bg-[#FEE2E2]";
  return "text-[#F59E0B] bg-[#FEF3C7]";
}

export default function PoliciesScreen({ compact = false, theme }: Props) {
  const colors = getThemeColors(theme);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPolicies() {
      try {
        setLoading(true);
        const data = await api.getPolicies();
        if (!cancelled) {
          setPolicies(data);
          setSelectedPolicyId(data[0]?.id ?? null);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load policies");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPolicies();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedPolicy = useMemo(
    () => policies.find((p) => p.id === selectedPolicyId) ?? null,
    [policies, selectedPolicyId]
  );

  return (
    <div className={`h-full flex flex-col ${compact ? "text-xs" : "text-sm"} ${colors.pageBg}`}>
      <div className={`p-3 ${colors.bg} border-b ${colors.border} flex-shrink-0`}>
        <div className="flex flex-col gap-2">
          <div className={`text-xs font-semibold uppercase tracking-[0.16em] ${colors.textSecondary}`}>
            Policy-as-Code
          </div>
          <h2 className={`text-sm font-semibold ${colors.text}`}>Policy Library</h2>
          <p className={`text-xs ${colors.textSecondary}`}>
            Rules modeled around identity, purpose, tool use, data sensitivity, destination, and baseline behavior.
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] overflow-hidden">
        <div className={`${colors.bg} border-r ${colors.border} overflow-auto`}>
          {loading && <div className="p-3 text-xs text-[#6B7280]">Loading policies...</div>}
          {error && <div className="p-3 text-xs text-[#EF4444]">{error}</div>}

          {!loading &&
            !error &&
            policies.map((policy) => {
              const isActive = selectedPolicyId === policy.id;
              return (
                <button
                  key={policy.id}
                  onClick={() => setSelectedPolicyId(policy.id)}
                  className={`w-full p-3 border-b ${colors.border} text-left ${colors.hover} transition-colors ${
                    isActive ? (theme === "dark" ? "bg-[#0F172A]" : "bg-[#F9FAFB]") : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${colors.textSecondary}`}>
                        {policy.id}
                      </div>
                      <div className={`text-xs font-semibold mt-1 ${colors.text}`}>{policy.name}</div>
                      <div className={`text-[10px] mt-1 ${colors.textSecondary}`}>{policy.description}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold ${effectBadge(policy.effect)}`}>
                        {policy.effect.replace("_", " ").toUpperCase()}
                      </span>
                      <ChevronRight className={`w-3 h-3 ${colors.textSecondary}`} />
                    </div>
                  </div>
                </button>
              );
            })}
        </div>

        <div className="overflow-auto p-3 space-y-3">
          {!selectedPolicy && !loading && (
            <div className={`text-xs ${colors.textSecondary}`}>Select a policy to inspect.</div>
          )}

          {selectedPolicy && (
            <>
              <div className={`border ${colors.border} ${colors.bgSecondary}`}>
                <div className={`p-3 border-b ${colors.border} flex items-start justify-between gap-3`}>
                  <div>
                    <div className={`text-[10px] uppercase tracking-[0.14em] ${colors.textSecondary}`}>
                      {selectedPolicy.id}
                    </div>
                    <h3 className={`text-sm font-bold mt-1 ${colors.text}`}>{selectedPolicy.name}</h3>
                    <p className={`text-xs mt-1 ${colors.textSecondary}`}>{selectedPolicy.description}</p>
                  </div>

                  <span className={`px-2.5 py-1 text-[10px] font-bold ${effectBadge(selectedPolicy.effect)}`}>
                    {selectedPolicy.effect.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                <div className="p-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className={`border ${colors.border} ${colors.bg}`}>
                    <div className={`p-3 border-b ${colors.border} flex items-center gap-2`}>
                      <FileCode2 className="w-4 h-4" />
                      <span className={`text-xs font-semibold ${colors.text}`}>Policy Definition</span>
                    </div>
                    <div className="p-3">
                      <pre className={`font-mono text-[10px] whitespace-pre-wrap ${colors.text}`}>
{`POLICY ${selectedPolicy.id}
NAME: ${selectedPolicy.name}
DESCRIPTION: ${selectedPolicy.description}
EFFECT: ${selectedPolicy.effect}`}
                      </pre>
                    </div>
                  </div>

                  <div className={`border ${colors.border} ${colors.bg}`}>
                    <div className={`p-3 border-b ${colors.border} flex items-center gap-2`}>
                      <Info className="w-4 h-4" />
                      <span className={`text-xs font-semibold ${colors.text}`}>Example Decision Context</span>
                    </div>
                    {/* <div className="p-3 space-y-2 text-xs">
                      <div className="flex justify-between gap-3">
                        <span className={colors.textSecondary}>Requester Role</span>
                        <span className={colors.text}>finance_manager</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className={colors.textSecondary}>Agent</span>
                        <span className={colors.text}>agt_fin_001</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className={colors.textSecondary}>Tool</span>
                        <span className={colors.text}>send_email</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className={colors.textSecondary}>Target Resource</span>
                        <span className={colors.text}>payroll_summary_q2</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className={colors.textSecondary}>Data Class</span>
                        <span className={colors.text}>confidential</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className={colors.textSecondary}>Purpose</span>
                        <span className={colors.text}>regional update</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className={colors.textSecondary}>Environment</span>
                        <span className={colors.text}>prod</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className={colors.textSecondary}>Recipient</span>
                        <span className={colors.text}>external</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className={colors.textSecondary}>Baseline OK</span>
                        <span className={colors.text}>true</span>
                      </div>
                    </div> */}
                    <div className="p-3 space-y-2 text-xs">
                      {[
                        ["Requester Role", "finance_manager"],
                        ["Agent", "agt_fin_001"],
                        ["Tool", "send_email"],
                        ["Target Resource", "payroll_summary_q2"],
                        ["Data Class", "confidential"],
                        ["Purpose", "regional update"],
                        ["Environment", "prod"],
                        ["Recipient", "external"],
                        ["Baseline OK", "true"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 items-start"
                        >
                          <span className={`${colors.textSecondary} leading-snug`}>
                            {label}
                          </span>
                          <span className={`${colors.text} break-all leading-snug min-w-0`}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`border ${colors.border} ${colors.bgSecondary}`}>
                <div className={`p-3 border-b ${colors.border} flex items-center gap-2`}>
                  <ShieldCheck className="w-4 h-4" />
                  <span className={`text-xs font-semibold ${colors.text}`}>Why this matters</span>
                </div>
                <div className="p-3 text-xs">
                  <p className={colors.text}>
                    This screen shows how the system reasons about <span className="font-semibold">what the agent is allowed to do in context</span>, not just whether text looks harmful.
                  </p>
                  <p className={`mt-2 ${colors.textSecondary}`}>
                    In your demo, tie this back to identity, data sensitivity, purpose, environment, and destination.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}