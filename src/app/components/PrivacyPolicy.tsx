interface Props {
  theme: string;
}

export default function PrivacyPolicy({ theme }: Props) {
  const themeColors = {
    light: {
      bg: "bg-white",
      border: "border-[#E5E7EB]",
      text: "text-[#111827]",
      textSecondary: "${colors.textSecondary}",
      textTertiary: "${colors.textTertiary}",
    },
    dark: {
      bg: "bg-[#1E293B]",
      border: "border-[#334155]",
      text: "text-white",
      textSecondary: "text-[#94A3B8]",
      textTertiary: "text-[#64748B]",
    },
    "high-contrast": {
      bg: "bg-white",
      border: "border-black",
      text: "text-black",
      textSecondary: "text-[#4B5563]",
      textTertiary: "${colors.textSecondary}",
    },
  };

  const colors = themeColors[theme as keyof typeof themeColors] || themeColors.light;

  return (
    <div className={`max-w-4xl mx-auto ${colors.bg} border ${colors.border} p-8`}>
      <h1 className={`text-2xl font-bold ${colors.text} mb-6`}>Privacy Policy</h1>

      <div className={`space-y-6 text-sm ${colors.text}`}>
        <section>
          <h2 className={`text-lg font-semibold mb-3 ${colors.text} ${colors.text}`}>Personal Project Disclosure</h2>
          <p className={`${colors.textSecondary} leading-relaxed`}>
            This website is a personal project created by Truc Tran for demonstration and educational purposes.
            It showcases a policy-aware agent console (PAAC) design and is not intended for production use or
            commercial purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 ${colors.text}">Data Collection</h2>
          <p className="${colors.textSecondary} leading-relaxed mb-3">
            This demonstration application does not collect, store, or transmit any personal data. All data shown
            in the interface is simulated for demonstration purposes only.
          </p>
          <ul className="list-disc list-inside ${colors.textSecondary} space-y-1 ml-4">
            <li>No cookies are used</li>
            <li>No analytics or tracking is implemented</li>
            <li>No user information is collected or stored</li>
            <li>All displayed data is mock data for UI demonstration</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 ${colors.text}">Local Storage</h2>
          <p className="${colors.textSecondary} leading-relaxed">
            The application may use browser local storage solely to remember user interface preferences such as
            theme selection or view mode. This data never leaves your browser and is not transmitted to any server.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 ${colors.text}">Third-Party Services</h2>
          <p className="${colors.textSecondary} leading-relaxed">
            This application does not integrate with any third-party services, APIs, or external data sources.
            It operates entirely within your browser using static, simulated data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 ${colors.text}">Security</h2>
          <p className="${colors.textSecondary} leading-relaxed">
            As this is a demonstration project with no real data processing, there are no security risks related
            to personal information. However, standard web security practices are followed in the code implementation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 ${colors.text}">Changes to This Policy</h2>
          <p className="${colors.textSecondary} leading-relaxed">
            As this is a personal project, this privacy policy may be updated at any time without notice.
            The last updated date will be reflected below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 ${colors.text}">Contact Information</h2>
          <p className="${colors.textSecondary} leading-relaxed">
            For questions or concerns about this privacy policy or the project, you may contact the creator
            through the public repository or portfolio site associated with this project.
          </p>
        </section>

        <div className={`border-t ${colors.border} pt-6 mt-8`}>
          <p className="text-xs ${colors.textTertiary}">
            Last Updated: April 22, 2026
          </p>
          <p className="text-xs ${colors.textTertiary} mt-2">
            © 2026 Truc Tran. All rights reserved. This is a personal project and not affiliated with any organization.
          </p>
        </div>
      </div>
    </div>
  );
}
