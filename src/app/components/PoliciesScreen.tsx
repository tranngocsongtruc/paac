// import { useState } from "react";
// import { Lightbulb, Edit3, Save, ChevronDown, ChevronRight } from "lucide-react";

// interface Props {
//   compact?: boolean;
//   theme?: string;
// }

// export default function PoliciesScreen({ compact = false, theme = "light" }: Props) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [policiesCollapsed, setPoliciesCollapsed] = useState(false);

//   const policies = [
//     { id: "POL-017", name: "External Data Transmission", status: "active", count: 12 },
//     { id: "POL-022", name: "PII Access Restriction", status: "active", count: 3 },
//     { id: "POL-031", name: "Financial Data Query Limits", status: "active", count: 0 },
//     { id: "POL-042", name: "Audit Log Retention", status: "active", count: 0 },
//     { id: "POL-055", name: "Cross-Region Data Transfer", status: "active", count: 1 },
//   ];

//   const suggestions = [
//     { name: "Block Production DB Deletes", risk: "HIGH" },
//     { name: "Rate Limit API Calls", risk: "MEDIUM" },
//     { name: "Redact Financial Data in Logs", risk: "HIGH" },
//   ];

//   const themeColors = {
//     light: {
//       bg: "bg-white",
//       border: "border-[#E5E7EB]",
//       text: "text-[#111827]",
//       textSecondary: "text-[#6B7280]",
//       textTertiary: "text-[#9CA3AF]",
//       hover: "hover:bg-[#F9FAFB]",
//       bgSecondary: "bg-[#F9FAFB]",
//       bgTertiary: "bg-[#FAFAFA]",
//       suggestText: "text-[#92400E]",
//     },
//     dark: {
//       bg: "bg-[#1E293B]",
//       border: "border-[#334155]",
//       text: "text-white",
//       textSecondary: "text-[#94A3B8]",
//       textTertiary: "text-[#64748B]",
//       hover: "hover:bg-[#334155]",
//       bgSecondary: "bg-[#0F172A]",
//       bgTertiary: "bg-[#1E293B]",
//       suggestText: "text-[#FDB022]",
//     },
//     "high-contrast": {
//       bg: "bg-white",
//       border: "border-black",
//       text: "text-black",
//       textSecondary: "text-[#4B5563]",
//       textTertiary: "text-[#6B7280]",
//       hover: "hover:bg-[#F3F4F6]",
//       bgSecondary: "bg-[#F9FAFB]",
//       bgTertiary: "bg-[#FAFAFA]",
//       suggestText: "text-[#92400E]",
//     },
//   };

//   const colors = themeColors[theme as keyof typeof themeColors] || themeColors.light;

//   return (
//     <div className={`h-full flex ${compact ? "text-xs" : "text-sm"}`}>
//       {/* Left Panel */}
//       {!policiesCollapsed && (
//         <div className={`w-64 border-r ${colors.border} flex flex-col flex-shrink-0`}>
//           <div className={`p-3 border-b ${colors.border} flex items-center justify-between flex-shrink-0`}>
//             <button
//               onClick={() => setPoliciesCollapsed(!policiesCollapsed)}
//               className={`flex items-center gap-2 text-xs font-semibold ${colors.textSecondary} hover:${colors.text} uppercase tracking-wide transition-colors`}
//               aria-expanded={!policiesCollapsed}
//               aria-label="Collapse policies"
//             >
//               <ChevronDown className="w-3.5 h-3.5" />
//               <span>Policies</span>
//             </button>
//             <span className="px-2 py-0.5 bg-[#D1FAE5] text-[#065F46] text-xs font-bold">{policies.filter(p => p.status === 'active').length}</span>
//           </div>

//           <div className="flex-1 overflow-auto">
//             {policies.map((policy) => (
//               <button
//                 key={policy.id}
//                 className={`w-full p-3 border-b ${colors.border} ${colors.hover} transition-colors text-left`}
//               >
//                 <div className={`text-xs font-mono ${colors.textSecondary} mb-1 truncate`}>{policy.id}</div>
//                 <div className={`text-sm font-medium ${colors.text} mb-2 truncate`} title={policy.name}>{policy.name}</div>
//                 {policy.count > 0 && (
//                   <div className={`text-xs ${colors.textSecondary}`}>
//                     <span className="font-semibold text-[#F59E0B]">{policy.count}x</span> triggered
//                   </div>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Right Panel */}
//       <div className="flex-1 flex flex-col min-w-0">
//         <div className={`p-3 ${colors.bg} border-b ${colors.border} flex flex-wrap items-center gap-2 flex-shrink-0`}>
//           <div className="flex items-center gap-2 min-w-0 flex-1">
//             {policiesCollapsed && (
//               <button
//                 onClick={() => setPoliciesCollapsed(!policiesCollapsed)}
//                 className={`flex items-center gap-2 text-xs font-semibold ${colors.textSecondary} hover:${colors.text} uppercase tracking-wide transition-colors flex-shrink-0`}
//                 aria-expanded={!policiesCollapsed}
//                 aria-label="Expand policies"
//               >
//                 <ChevronRight className="w-3.5 h-3.5" />
//                 <span>Policies</span>
//               </button>
//             )}
//             <span className={`text-sm font-bold ${colors.text} truncate`}>POL-017</span>
//             <span className="px-2 py-0.5 bg-[#D1FAE5] text-[#065F46] text-xs font-semibold whitespace-nowrap">ACTIVE</span>
//           </div>
//           <div className="flex items-center gap-2 flex-shrink-0">
//             <button
//               onClick={() => setShowSuggestions(!showSuggestions)}
//               className={`px-3 py-1.5 border border-[#F59E0B] ${colors.suggestText} text-xs font-medium hover:bg-[#FEF3C7] transition-colors flex items-center gap-1.5 whitespace-nowrap`}
//             >
//               <Lightbulb className="w-3.5 h-3.5" />
//               <span className="hidden sm:inline">Suggest</span>
//             </button>
//             <button
//               onClick={() => setIsEditing(!isEditing)}
//               className="px-3 py-1.5 bg-[#111827] text-white text-xs font-medium hover:bg-[#1F2937] transition-colors flex items-center gap-1.5 whitespace-nowrap"
//             >
//               {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
//               <span className="hidden sm:inline">{isEditing ? "Save" : "Edit"}</span>
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 overflow-auto p-4 space-y-3">
//           {/* Suggestions */}
//           {showSuggestions && (
//             <div className="bg-[#FFFBEB] border border-[#F59E0B] p-3">
//               <div className="flex items-center gap-2 mb-3">
//                 <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
//                 <span className="text-xs font-bold text-[#92400E] uppercase tracking-wide">AI Suggestions</span>
//               </div>
//               <div className="space-y-2">
//                 {suggestions.map((sug, i) => (
//                   <div key={i} className={`flex items-center justify-between p-2 ${colors.bg} border ${colors.border} gap-2`}>
//                     <div className="min-w-0 flex-1">
//                       <span className={`text-sm font-medium ${colors.text} block truncate`} title={sug.name}>{sug.name}</span>
//                       <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-bold ${
//                         sug.risk === "HIGH" ? "bg-[#FEE2E2] text-[#991B1B]" : "bg-[#FEF3C7] text-[#92400E]"
//                       }`}>{sug.risk}</span>
//                     </div>
//                     <button className="px-3 py-1 bg-[#111827] text-white text-xs font-medium hover:bg-[#1F2937] transition-colors whitespace-nowrap flex-shrink-0">
//                       Apply
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Policy Details */}
//           <div className={`${colors.bg} border ${colors.border} p-3`}>
//             <span className={`text-xs font-semibold ${colors.textSecondary} uppercase tracking-wide block mb-2`}>Policy Logic</span>
//             {isEditing ? (
//               <textarea
//                 className={`w-full h-24 px-3 py-2 border ${colors.border} ${colors.bgTertiary} ${colors.text} font-mono text-xs resize-none focus:outline-none focus:border-[#111827]`}
//                 defaultValue={`IF data_classification = "confidential"\n  AND recipient_domain = "external"\nTHEN require_approval`}
//               />
//             ) : (
//               <pre className={`font-mono text-xs ${colors.text} ${colors.bgSecondary} p-3 border ${colors.border} overflow-x-auto`}>
// {`IF data_classification = "confidential"
//   AND recipient_domain = "external"
// THEN require_approval`}
//               </pre>
//             )}
//           </div>

//           {/* Matched Context */}
//           <div className={`${colors.bg} border ${colors.border} p-3`}>
//             <span className={`text-xs font-semibold ${colors.textSecondary} uppercase tracking-wide block mb-2`}>Matched Context</span>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between p-2 bg-[#FFFBEB] border border-[#F59E0B] gap-2">
//                 <div className="min-w-0 flex-1">
//                   <div className={`text-xs ${colors.textSecondary} truncate`}>data_classification</div>
//                   <div className="text-sm font-mono text-[#111827] truncate">confidential</div>
//                 </div>
//                 <span className="text-xs font-bold text-[#F59E0B] whitespace-nowrap">MATCH</span>
//               </div>
//               <div className="flex items-center justify-between p-2 bg-[#FFFBEB] border border-[#F59E0B] gap-2">
//                 <div className="min-w-0 flex-1">
//                   <div className={`text-xs ${colors.textSecondary} truncate`}>recipient_domain</div>
//                   <div className="text-sm font-mono text-[#111827] truncate">external</div>
//                 </div>
//                 <span className="text-xs font-bold text-[#F59E0B] whitespace-nowrap">MATCH</span>
//               </div>
//             </div>
//           </div>

//           {/* Decision */}
//           <div className={`${colors.bg} border ${colors.border} p-3`}>
//             <span className={`text-xs font-semibold ${colors.textSecondary} uppercase tracking-wide block mb-2`}>Decision</span>
//             <div className={`px-3 py-2 ${colors.bgSecondary} border ${colors.border}`}>
//               <span className={`text-sm font-mono ${colors.text}`}>→ require_approval</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
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