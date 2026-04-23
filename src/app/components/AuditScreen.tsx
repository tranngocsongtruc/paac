import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  ShieldAlert,
} from "lucide-react";
import { api } from "@/lib/api";
import type { DecisionRecord, ThemeMode } from "@/lib/types";

interface Props {
  compact?: boolean;
  theme?: ThemeMode;
  refreshKey?: number;
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
      textTertiary: "text-[#6B7280]",
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
    textTertiary: isDark ? "text-[#64748B]" : "text-[#9CA3AF]",
    hover: isDark ? "hover:bg-[#334155]" : "hover:bg-[#F9FAFB]",
  };
}

export default function AuditScreen({ compact = false, theme, refreshKey = 0 }: Props) {
  const colors = getThemeColors(theme);
  const [events, setEvents] = useState<DecisionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "allowed" | "blocked">("all");

  useEffect(() => {
    let cancelled = false;

    async function loadDecisions() {
      try {
        setLoading(true);
        const data = await api.getDecisions();
        if (!cancelled) {
          setEvents(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load audit data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDecisions();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesFilter =
        filterType === "all" ||
        (filterType === "allowed" && e.decision === "allow") ||
        (filterType === "blocked" && e.decision !== "allow");

      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        e.trace_id.toLowerCase().includes(query) ||
        e.agent_id.toLowerCase().includes(query) ||
        e.tool.toLowerCase().includes(query) ||
        e.reason.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [events, filterType, searchTerm]);

  const latest = events[0];

  function exportAuditJson() {
    const blob = new Blob([JSON.stringify(filteredEvents, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paac-audit-log.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={`h-full flex flex-col ${compact ? "text-xs" : "text-sm"} ${colors.pageBg}`}>
      <div className={`p-3 ${colors.bg} border-b ${colors.border} flex-shrink-0`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className={`text-xs font-semibold uppercase tracking-[0.16em] ${colors.textSecondary}`}>
              TrustLedger
            </div>
            <h2 className={`text-sm font-semibold mt-1 ${colors.text}`}>Audit Trail</h2>
            <p className={`text-xs mt-1 ${colors.textSecondary}`}>
              Decision provenance for runtime evaluations, matched policies, and risk signals.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className={`relative`}>
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${colors.textTertiary}`} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search trace, agent, tool..."
                className={`pl-9 pr-3 py-2 border ${colors.border} ${colors.bgSecondary} ${colors.text} text-xs min-w-[240px]`}
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "allowed" | "blocked")}
              className={`px-3 py-2 border ${colors.border} ${colors.bgSecondary} ${colors.text} text-xs`}
            >
              <option value="all">All decisions</option>
              <option value="allowed">Allowed only</option>
              <option value="blocked">Blocked / approval</option>
            </select>

            <button
              type="button"
              onClick={exportAuditJson}
              className="px-3 py-2 bg-[#111827] text-white text-xs font-medium hover:bg-[#1F2937] flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {latest && (
          <div className="flex flex-wrap gap-4 mt-3 text-[10px]">
            <div className="flex items-center gap-2">
              <span className={colors.textSecondary}>Latest trace:</span>
              <span className={`font-mono font-semibold ${colors.text}`}>{latest.trace_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={colors.textSecondary}>Agent:</span>
              <span className={`font-semibold ${colors.text}`}>{latest.agent_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={colors.textSecondary}>Decision:</span>
              <span className={`font-semibold ${colors.text}`}>{latest.decision}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-3">
        {loading && <div className={`text-xs ${colors.textSecondary}`}>Loading audit data...</div>}
        {error && <div className="text-xs text-[#EF4444]">{error}</div>}

        {!loading && !error && (
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const badge =
                event.decision === "allow"
                  ? "text-[#10B981] bg-[#D1FAE5]"
                  : event.decision === "block"
                  ? "text-[#EF4444] bg-[#FEE2E2]"
                  : "text-[#F59E0B] bg-[#FEF3C7]";

              const Icon =
                event.decision === "allow"
                  ? CheckCircle2
                  : event.decision === "block"
                  ? AlertTriangle
                  : Clock3;

              return (
                <div key={`${event.trace_id}-${event.timestamp}`} className={`border ${colors.border} ${colors.bgSecondary}`}>
                  <div className={`p-3 border-b ${colors.border} flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between`}>
                    <div>
                      <div className={`text-[10px] uppercase tracking-[0.14em] ${colors.textSecondary}`}>
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                      <div className={`text-xs font-semibold mt-1 ${colors.text}`}>
                        {event.trace_id} · {event.tool}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold ${badge}`}>
                        {event.decision.replace("_", " ").toUpperCase()}
                      </span>
                      {typeof event.latency_ms === "number" && (
                        <span className={`px-2 py-0.5 text-[10px] ${colors.bg} border ${colors.border} ${colors.textSecondary}`}>
                          {event.latency_ms} ms
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-3">
                    <div>
                      <div className={`flex items-start gap-2 text-xs ${colors.text}`}>
                        <Icon className="w-4 h-4 mt-0.5" />
                        <div>
                          <div className="font-medium">Reason</div>
                          <div className={`mt-1 ${colors.textSecondary}`}>{event.reason}</div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className={`p-3 border ${colors.border} ${colors.bg}`}>
                          <div className={`text-[10px] uppercase tracking-[0.14em] ${colors.textSecondary}`}>
                            Agent
                          </div>
                          <div className={`text-xs font-medium mt-1 ${colors.text}`}>{event.agent_id}</div>
                        </div>

                        <div className={`p-3 border ${colors.border} ${colors.bg}`}>
                          <div className={`text-[10px] uppercase tracking-[0.14em] ${colors.textSecondary}`}>
                            Required Approver
                          </div>
                          <div className={`text-xs font-medium mt-1 ${colors.text}`}>
                            {event.required_approver ?? "—"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className={`p-3 border ${colors.border} ${colors.bg}`}>
                        <div className={`text-[10px] uppercase tracking-[0.14em] ${colors.textSecondary}`}>
                          Matched Policies
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {event.matched_policies.length > 0 ? (
                            event.matched_policies.map((p) => (
                              <span
                                key={p}
                                className={`px-2 py-0.5 text-[10px] ${colors.bgTertiary} ${colors.text}`}
                              >
                                {p}
                              </span>
                            ))
                          ) : (
                            <span className={`text-xs ${colors.textSecondary}`}>—</span>
                          )}
                        </div>
                      </div>

                      <div className={`p-3 border ${colors.border} ${colors.bg}`}>
                        <div className={`text-[10px] uppercase tracking-[0.14em] ${colors.textSecondary} flex items-center gap-1`}>
                          <ShieldAlert className="w-3 h-3" />
                          Risk Flags
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {event.risk_flags && event.risk_flags.length > 0 ? (
                            event.risk_flags.map((flag) => (
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
                </div>
              );
            })}

            {filteredEvents.length === 0 && (
              <div className={`text-xs ${colors.textSecondary}`}>No audit events match the current filters.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}