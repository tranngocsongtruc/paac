// import { useState } from "react";
// import { Plus, ExternalLink, AlertCircle } from "lucide-react";

// interface Props {
//   compact?: boolean;
//   theme?: string;
// }

// export default function AgentsScreen({ compact = false, theme = "light" }: Props) {
//   const [showCreateModal, setShowCreateModal] = useState(false);

//   const agents = [
//     {
//       name: "Finance Analyst",
//       owner: "Finance",
//       tools: ["DB", "Email", "Summarizer"],
//       risk: "HIGH",
//       status: "Active",
//       incident: "External data blocked",
//       time: "2h ago",
//       riskColor: "text-[#EF4444] bg-[#FEE2E2]",
//     },
//     {
//       name: "Customer Support",
//       owner: "Support",
//       tools: ["Ticketing", "Slack", "KB"],
//       risk: "MEDIUM",
//       status: "Active",
//       incident: "None",
//       time: null,
//       riskColor: "text-[#F59E0B] bg-[#FEF3C7]",
//     },
//     {
//       name: "Data Pipeline",
//       owner: "Engineering",
//       tools: ["S3", "Database", "API"],
//       risk: "LOW",
//       status: "Active",
//       incident: "None",
//       time: null,
//       riskColor: "text-[#10B981] bg-[#D1FAE5]",
//     },
//   ];

//   const themeColors = {
//     light: {
//       bg: "bg-white",
//       border: "border-[#E5E7EB]",
//       text: "text-[#111827]",
//       textSecondary: "text-[#6B7280]",
//       textTertiary: "text-[#9CA3AF]",
//       hover: "hover:bg-[#F3F4F6]",
//       bgSecondary: "bg-[#F9FAFB]",
//       bgTertiary: "bg-[#F3F4F6]",
//     },
//     dark: {
//       bg: "bg-[#1E293B]",
//       border: "border-[#334155]",
//       text: "text-white",
//       textSecondary: "text-[#94A3B8]",
//       textTertiary: "text-[#64748B]",
//       hover: "hover:bg-[#334155]",
//       bgSecondary: "bg-[#0F172A]",
//       bgTertiary: "bg-[#334155]",
//     },
//     "high-contrast": {
//       bg: "bg-white",
//       border: "border-black",
//       text: "text-black",
//       textSecondary: "text-[#4B5563]",
//       textTertiary: "text-[#6B7280]",
//       hover: "hover:bg-[#F3F4F6]",
//       bgSecondary: "bg-[#F9FAFB]",
//       bgTertiary: "bg-[#F3F4F6]",
//     },
//   };

//   const colors = themeColors[theme as keyof typeof themeColors] || themeColors.light;

//   return (
//     <div className={`h-full flex flex-col ${compact ? "text-xs" : "text-sm"}`}>
//       {/* Header */}
//       <div className={`p-3 ${colors.bg} border-b ${colors.border} flex items-center justify-between flex-shrink-0`}>
//         <div className="flex items-center gap-3">
//           <div className="text-xs">
//             <span className={`font-bold ${colors.text}`}>3</span>
//             <span className={`${colors.textSecondary} ml-1`}>agents</span>
//           </div>
//           <div className={`w-px h-4 ${colors.border}`}></div>
//           <div className="text-xs">
//             <span className="font-bold text-[#EF4444]">1</span>
//             <span className={`${colors.textSecondary} ml-1`}>high risk</span>
//           </div>
//         </div>
//         <button
//           onClick={() => setShowCreateModal(true)}
//           className="px-3 py-1.5 bg-[#111827] text-white text-xs font-medium hover:bg-[#1F2937] transition-colors flex items-center gap-1.5"
//         >
//           <Plus className="w-3.5 h-3.5" />
//           New Agent
//         </button>
//       </div>

//       {/* Content */}
//       <div className="flex-1 overflow-auto p-3">
//         <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} gap-3`}>
//           {agents.map((agent, idx) => (
//             <div key={idx} className={`${colors.bg} border ${colors.border} hover:border-[#111827] transition-colors`}>
//               <div className={`p-3 border-b ${colors.border}`}>
//                 <div className="flex items-start justify-between mb-2">
//                   <h3 className={`text-sm font-bold ${colors.text}`}>{agent.name}</h3>
//                   <span className={`px-2 py-0.5 ${agent.riskColor} text-xs font-bold`}>{agent.risk}</span>
//                 </div>
//                 <div className={`flex items-center gap-2 text-xs ${colors.textSecondary}`}>
//                   <span>{agent.owner}</span>
//                   <span>•</span>
//                   <span className="px-1.5 py-0.5 bg-[#D1FAE5] text-[#065F46]">{agent.status}</span>
//                 </div>
//               </div>

//               <div className="p-3 space-y-2">
//                 <div>
//                   <span className={`text-xs font-semibold ${colors.textSecondary} uppercase tracking-wide block mb-1`}>Tools</span>
//                   <div className="flex flex-wrap gap-1">
//                     {agent.tools.map((tool, i) => (
//                       <span key={i} className={`px-2 py-0.5 ${colors.bgTertiary} ${colors.text} text-xs`}>{tool}</span>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <span className={`text-xs font-semibold ${colors.textSecondary} uppercase tracking-wide block mb-1`}>Last Event</span>
//                   <div className="flex items-center justify-between">
//                     <span className={`text-xs ${colors.text}`}>{agent.incident}</span>
//                     {agent.time && <span className={`text-xs ${colors.textTertiary}`}>{agent.time}</span>}
//                   </div>
//                 </div>
//               </div>

//               <div className={`p-2 border-t ${colors.border}`}>
//                 <button className={`w-full px-3 py-1.5 text-xs font-medium ${colors.text} ${colors.hover} transition-colors flex items-center justify-center gap-1.5`}>
//                   View Activity
//                   <ExternalLink className="w-3 h-3" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
//           <div className={`${colors.bg} w-full max-w-md`} onClick={(e) => e.stopPropagation()}>
//             <div className={`p-4 border-b ${colors.border}`}>
//               <h3 className={`text-sm font-bold ${colors.text}`}>Create New Agent</h3>
//             </div>
//             <div className="p-4 space-y-3">
//               <div>
//                 <label className={`text-xs font-semibold ${colors.textSecondary} uppercase tracking-wide block mb-1`}>Name</label>
//                 <input type="text" className={`w-full px-3 py-2 border ${colors.border} ${colors.bgTertiary} ${colors.text} text-sm`} placeholder="Sales Analytics Agent" />
//               </div>
//               <div>
//                 <label className={`text-xs font-semibold ${colors.textSecondary} uppercase tracking-wide block mb-1`}>Owner</label>
//                 <select className={`w-full px-3 py-2 border ${colors.border} ${colors.bgTertiary} ${colors.text} text-sm`}>
//                   <option>Engineering</option>
//                   <option>Finance</option>
//                   <option>Support</option>
//                 </select>
//               </div>
//             </div>
//             <div className={`p-4 border-t ${colors.border} flex gap-2`}>
//               <button onClick={() => setShowCreateModal(false)} className={`flex-1 px-4 py-2 border ${colors.border} text-sm font-medium hover:border-[#111827] transition-colors ${colors.text}`}>
//                 Cancel
//               </button>
//               <button className="flex-1 px-4 py-2 bg-[#111827] text-white text-sm font-medium hover:bg-[#1F2937] transition-colors">
//                 Create
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Shield, AlertTriangle, Activity } from "lucide-react";
import { api } from "@/lib/api";
import type { Agent, ThemeMode } from "@/lib/types";

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

function riskBadgeClasses(risk: Agent["risk_tier"]) {
  if (risk === "high") return "text-[#EF4444] bg-[#FEE2E2]";
  if (risk === "medium") return "text-[#F59E0B] bg-[#FEF3C7]";
  return "text-[#10B981] bg-[#D1FAE5]";
}

export default function AgentsScreen({ compact = false, theme }: Props) {
  const colors = getThemeColors(theme);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAgents() {
      try {
        setLoading(true);
        const data = await api.getAgents();
        if (!cancelled) {
          setAgents(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load agents");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAgents();
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(() => {
    const highRisk = agents.filter((a) => a.risk_tier === "high").length;
    const active = agents.filter((a) => a.status === "active").length;
    return { highRisk, active, total: agents.length };
  }, [agents]);

  return (
    <div className={`h-full flex flex-col ${compact ? "text-xs" : "text-sm"} ${colors.pageBg}`}>
      <div className={`p-3 ${colors.bg} border-b ${colors.border} flex-shrink-0`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className={`text-xs font-semibold uppercase tracking-[0.16em] ${colors.textSecondary}`}>
              Deep Visibility
            </div>
            <h2 className={`text-sm font-semibold mt-1 ${colors.text}`}>Agent Inventory</h2>
            <p className={`text-xs mt-1 ${colors.textSecondary}`}>
              Live inventory of agents, tools, risk tiers, and recent governance events.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className={`px-3 py-2 border ${colors.border} ${colors.bgSecondary} text-xs`}>
              <span className={`font-semibold ${colors.text}`}>{summary.total}</span>{" "}
              <span className={colors.textSecondary}>agents</span>
            </div>
            <div className={`px-3 py-2 border ${colors.border} ${colors.bgSecondary} text-xs`}>
              <span className="font-semibold text-[#EF4444]">{summary.highRisk}</span>{" "}
              <span className={colors.textSecondary}>high risk</span>
            </div>
            <div className={`px-3 py-2 border ${colors.border} ${colors.bgSecondary} text-xs`}>
              <span className="font-semibold text-[#10B981]">{summary.active}</span>{" "}
              <span className={colors.textSecondary}>active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {loading && <div className={`text-xs ${colors.textSecondary}`}>Loading agents...</div>}
        {error && <div className="text-xs text-[#EF4444]">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`${colors.bg} border ${colors.border} hover:border-[#111827] transition-colors`}
              >
                <div className={`p-3 border-b ${colors.border}`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className={`text-[10px] uppercase tracking-[0.14em] ${colors.textSecondary}`}>
                        {agent.owner_team}
                      </p>
                      <h3 className={`text-xs font-bold mt-1 ${colors.text}`}>{agent.name}</h3>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold ${riskBadgeClasses(agent.risk_tier)}`}>
                      {agent.risk_tier.toUpperCase()}
                    </span>
                  </div>

                  <div className={`flex items-center gap-2 text-[10px] ${colors.textSecondary}`}>
                    <span className={`px-1.5 py-0.5 ${agent.status === "active" ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#F3F4F6] text-[#374151]"}`}>
                      {agent.status}
                    </span>
                    <span>•</span>
                    <span>{agent.id}</span>
                  </div>
                </div>

                <div className="p-3 space-y-3">
                  <p className={`text-xs ${colors.textSecondary}`}>{agent.description}</p>

                  <div>
                    <span className={`text-[10px] font-semibold ${colors.textSecondary} uppercase tracking-wide block mb-1`}>
                      Tools
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {agent.tools.map((tool) => (
                        <span
                          key={tool}
                          className={`px-2 py-0.5 ${colors.bgTertiary} ${colors.text} text-[10px]`}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={`grid grid-cols-3 gap-2 text-[10px]`}>
                    <div className={`p-2 border ${colors.border} ${colors.bgSecondary}`}>
                      <div className={`flex items-center gap-1 ${colors.textSecondary}`}>
                        <Shield className="w-3 h-3" />
                        Risk
                      </div>
                      <div className={`mt-1 font-semibold ${colors.text}`}>{agent.risk_tier}</div>
                    </div>
                    <div className={`p-2 border ${colors.border} ${colors.bgSecondary}`}>
                      <div className={`flex items-center gap-1 ${colors.textSecondary}`}>
                        <Activity className="w-3 h-3" />
                        Status
                      </div>
                      <div className={`mt-1 font-semibold ${colors.text}`}>{agent.status}</div>
                    </div>
                    <div className={`p-2 border ${colors.border} ${colors.bgSecondary}`}>
                      <div className={`flex items-center gap-1 ${colors.textSecondary}`}>
                        <AlertTriangle className="w-3 h-3" />
                        Event
                      </div>
                      <div className={`mt-1 font-semibold ${colors.text}`}>Latest</div>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-semibold ${colors.textSecondary} uppercase tracking-wide block mb-1`}>
                      Last Event
                    </span>
                    <div className={`text-[10px] ${colors.text}`}>{agent.last_violation}</div>
                  </div>
                </div>

                <div className={`p-2 border-t ${colors.border}`}>
                  <button
                    type="button"
                    className={`w-full px-3 py-1.5 text-[10px] font-medium ${colors.text} ${colors.hover} transition-colors flex items-center justify-center gap-1.5`}
                  >
                    View Activity
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && agents.length === 0 && (
          <div className={`text-xs ${colors.textSecondary}`}>No agents found.</div>
        )}
      </div>
    </div>
  );
}