import { useState } from "react";
import { Shield, Activity, FileText, Database, Menu, X, Grid3x3, LayoutGrid, Sun, Moon, Monitor } from "lucide-react";
import RuntimeScreen from "./components/RuntimeScreen";
import AgentsScreen from "./components/AgentsScreen";
import AuditScreen from "./components/AuditScreen";
import PoliciesScreen from "./components/PoliciesScreen";
import PrivacyPolicy from "./components/PrivacyPolicy";
import AccessibilityPage from "./components/AccessibilityPage";

type Screen = "agents" | "runtime" | "policies" | "audit" | "privacy" | "accessibility";
type ViewMode = "engineering" | "security" | "compliance" | "operator";
type Theme = "light" | "dark" | "high-contrast";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("runtime");
  const [viewMode, setViewMode] = useState<ViewMode>("engineering");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [gridView, setGridView] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [auditRefreshKey, setAuditRefreshKey] = useState(0);

  const screens = [
    { id: "runtime" as Screen, label: "Runtime", icon: Activity },
    { id: "agents" as Screen, label: "Agents", icon: Database },
    { id: "policies" as Screen, label: "Policies", icon: FileText },
    { id: "audit" as Screen, label: "Audit", icon: Shield },
  ];

  const viewModes = [
    { id: "engineering" as ViewMode, label: "Eng" },
    { id: "security" as ViewMode, label: "Sec" },
    { id: "compliance" as ViewMode, label: "Comp" },
    { id: "operator" as ViewMode, label: "Ops" },
  ];

  const themes = {
    light: {
      bg: "bg-[#FAFAFA]",
      sidebar: "bg-white",
      border: "border-[#E5E7EB]",
      text: "text-[#111827]",
      textSecondary: "text-[#6B7280]",
      gridTitleBg: "bg-[#111827]",
      gridTitleText: "text-white",
      viewModeBg: "bg-[#FAFAFA]",
      sidebarHover: "hover:bg-[#F9FAFB]",
      sidebarActive: "bg-[#F3F4F6]",
    },
    dark: {
      bg: "bg-[#0F172A]",
      sidebar: "bg-[#1E293B]",
      border: "border-[#334155]",
      text: "text-white",
      textSecondary: "text-[#94A3B8]",
      gridTitleBg: "bg-white",
      gridTitleText: "text-[#111827]",
      viewModeBg: "bg-[#0F172A]",
      sidebarHover: "hover:bg-[#334155]",
      sidebarActive: "bg-[#0F172A]",
    },
    "high-contrast": {
      bg: "bg-black",
      sidebar: "bg-white",
      border: "border-black",
      text: "text-black",
      textSecondary: "text-[#4B5563]",
      gridTitleBg: "bg-black",
      gridTitleText: "text-white",
      viewModeBg: "bg-white",
      sidebarHover: "hover:bg-[#F3F4F6]",
      sidebarActive: "bg-[#F3F4F6]",
    },
  };

  const currentTheme = themes[theme];

  return (
    <div className={`h-screen flex ${currentTheme.bg} font-sans`}>
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? "w-14" : "w-48"} ${currentTheme.sidebar} border-r ${currentTheme.border} flex flex-col transition-all duration-200 flex-shrink-0`}>
        {/* Logo */}
        <div className={`h-14 flex items-center justify-between px-3 border-b ${currentTheme.border}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#111827] flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className={`text-sm font-semibold ${currentTheme.text} tracking-tight`}>PAAC</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`w-6 h-6 flex items-center justify-center ${currentTheme.textSecondary} hover:${currentTheme.text} hover:bg-[#F3F4F6] transition-colors`}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-0.5" role="navigation" aria-label="Main navigation">
          {screens.map((screen) => {
            const Icon = screen.icon;
            const isActive = activeScreen === screen.id;
            return (
              <button
                key={screen.id}
                onClick={() => setActiveScreen(screen.id)}
                className={`w-full flex items-center gap-2 px-2 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? `${currentTheme.sidebarActive} ${currentTheme.text}`
                    : `${currentTheme.textSecondary} hover:${currentTheme.text} ${currentTheme.sidebarHover}`
                }`}
                title={sidebarCollapsed ? screen.label : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                {!sidebarCollapsed && <span className="truncate">{screen.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Controls */}
        <div className={`p-2 border-t ${currentTheme.border} space-y-1`}>
          {/* Theme Switcher */}
          {!sidebarCollapsed && (
            <div className="mb-2">
              <div className="flex gap-1">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex-1 p-1.5 ${theme === "light" ? "bg-[#111827] text-white" : `${currentTheme.textSecondary} hover:bg-[#F3F4F6]`} transition-colors`}
                  title="Light theme"
                  aria-label="Light theme"
                >
                  <Sun className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex-1 p-1.5 ${theme === "dark" ? "bg-[#111827] text-white" : `${currentTheme.textSecondary} hover:bg-[#F3F4F6]`} transition-colors`}
                  title="Dark theme"
                  aria-label="Dark theme"
                >
                  <Moon className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => setTheme("high-contrast")}
                  className={`flex-1 p-1.5 ${theme === "high-contrast" ? "bg-[#111827] text-white" : `${currentTheme.textSecondary} hover:bg-[#F3F4F6]`} transition-colors`}
                  title="High contrast theme"
                  aria-label="High contrast theme"
                >
                  <Monitor className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setGridView(!gridView)}
            className={`w-full flex items-center gap-2 px-2 py-2 text-xs font-medium transition-colors ${
              gridView
                ? "bg-[#111827] text-white"
                : `${currentTheme.textSecondary} hover:${currentTheme.text} ${currentTheme.sidebarHover}`
            }`}
            aria-label={gridView ? "Switch to single view" : "Switch to grid view"}
          >
            {gridView ? <Grid3x3 className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            {!sidebarCollapsed && <span className="truncate">{gridView ? "Grid" : "Single"}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className={`h-14 ${currentTheme.sidebar} border-b ${currentTheme.border} flex items-center justify-between px-4 gap-4 flex-shrink-0`}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <h1 className={`text-sm font-semibold ${currentTheme.text} truncate`}>
              {activeScreen === "privacy" ? "Privacy Policy" :
               activeScreen === "accessibility" ? "Accessibility" :
               gridView ? "Dashboard" : screens.find(s => s.id === activeScreen)?.label}
            </h1>
            {activeScreen !== "privacy" && activeScreen !== "accessibility" && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" aria-label="System operational"></div>
            )}
          </div>

          {activeScreen !== "privacy" && activeScreen !== "accessibility" && (
            <div className="flex items-center gap-2">
              {/* View Mode Tabs */}
              <div className={`flex border ${currentTheme.border} ${currentTheme.viewModeBg}`} role="tablist" aria-label="View modes">
                {viewModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      viewMode === mode.id
                        ? `${currentTheme.sidebar} ${currentTheme.text} border-r border-l ${currentTheme.border}`
                        : `${currentTheme.textSecondary} hover:${currentTheme.text}`
                    }`}
                    role="tab"
                    aria-selected={viewMode === mode.id}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 flex flex-col">
          {activeScreen === "privacy" ? (
            <PrivacyPolicy theme={theme} />
          ) : activeScreen === "accessibility" ? (
            <AccessibilityPage theme={theme} />
          ) : gridView ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-min">
                {screens.map((screen) => (
                  <div key={screen.id} className={`${currentTheme.sidebar} border ${currentTheme.border} flex flex-col min-h-[400px] max-h-[600px]`}>
                    <div className={`px-3 py-2 border-b ${currentTheme.border} ${currentTheme.gridTitleBg} flex items-center gap-2 flex-shrink-0`}>
                      <screen.icon className={`w-3.5 h-3.5 ${currentTheme.gridTitleText}`} strokeWidth={2} />
                      <span className={`text-xs font-semibold ${currentTheme.gridTitleText} truncate`}>{screen.label}</span>
                    </div>
                    <div className="flex-1 overflow-auto min-h-0">
                      {/* {screen.id === "runtime" && <RuntimeScreen viewMode={viewMode} compact theme={theme} />}
                      {screen.id === "agents" && <AgentsScreen compact theme={theme} />}
                      {screen.id === "policies" && <PoliciesScreen compact theme={theme} />}
                      {screen.id === "audit" && <AuditScreen compact theme={theme} />} */}
                      {screen.id === "runtime" && (
                        <RuntimeScreen
                          viewMode={viewMode}
                          compact
                          theme={theme}
                          onDecisionCommitted={() => setAuditRefreshKey((k) => k + 1)}
                        />
                      )}
                      {screen.id === "agents" && <AgentsScreen compact theme={theme} />}
                      {screen.id === "policies" && <PoliciesScreen compact theme={theme} />}
                      {screen.id === "audit" && <AuditScreen compact theme={theme} refreshKey={auditRefreshKey} />}                      
                    </div>
                  </div>
                ))}
              </div>
              <div className={`${currentTheme.sidebar} border-t ${currentTheme.border} px-4 py-3 mt-4`}>
                <div className="flex items-center justify-between text-xs">
                  <div className={`${currentTheme.textSecondary} space-x-4`}>
                    <button onClick={() => setActiveScreen("privacy")} className="hover:underline">Privacy Policy</button>
                    <button onClick={() => setActiveScreen("accessibility")} className="hover:underline">Accessibility</button>
                  </div>
                  <div className={currentTheme.textSecondary}>
                    © 2026 Truc Tran. All rights reserved. Personal project.
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 overflow-auto">
                {/* {activeScreen === "runtime" && <RuntimeScreen viewMode={viewMode} theme={theme} />}
                {activeScreen === "agents" && <AgentsScreen theme={theme} />}
                {activeScreen === "policies" && <PoliciesScreen theme={theme} />}
                {activeScreen === "audit" && <AuditScreen theme={theme} />} */}
                {activeScreen === "runtime" && (
                  <RuntimeScreen
                    viewMode={viewMode}
                    theme={theme}
                    onDecisionCommitted={() => setAuditRefreshKey((k) => k + 1)}
                  />
                )}
                {activeScreen === "agents" && <AgentsScreen theme={theme} />}
                {activeScreen === "policies" && <PoliciesScreen theme={theme} />}
                {activeScreen === "audit" && <AuditScreen theme={theme} refreshKey={auditRefreshKey} />}                
              </div>
              <div className={`${currentTheme.sidebar} border-t ${currentTheme.border} px-4 py-3 mt-4`}>
                <div className="flex items-center justify-between text-xs">
                  <div className={`${currentTheme.textSecondary} space-x-4`}>
                    <button onClick={() => setActiveScreen("privacy")} className="hover:underline">Privacy Policy</button>
                    <button onClick={() => setActiveScreen("accessibility")} className="hover:underline">Accessibility</button>
                  </div>
                  <div className={currentTheme.textSecondary}>
                    © 2026 Truc Tran. All rights reserved. Personal project.
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
