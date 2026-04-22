// interface Props {
//   theme: string;
// }

// export default function AccessibilityPage({ theme }: Props) {
//   const themeColors = {
//     light: {
//       bg: "bg-white",
//       border: "border-[#E5E7EB]",
//       text: "text-[#111827]",
//       textSecondary: "${colors.textSecondary}",
//       textTertiary: "${colors.textTertiary}",
//       kbdBg: "bg-[#F3F4F6]",
//     },
//     dark: {
//       bg: "bg-[#1E293B]",
//       border: "border-[#334155]",
//       text: "text-white",
//       textSecondary: "text-[#94A3B8]",
//       textTertiary: "text-[#64748B]",
//       kbdBg: "bg-[#334155]",
//     },
//     "high-contrast": {
//       bg: "bg-white",
//       border: "border-black",
//       text: "text-black",
//       textSecondary: "text-[#4B5563]",
//       textTertiary: "${colors.textSecondary}",
//       kbdBg: "bg-[#F3F4F6]",
//     },
//   };

//   const colors = themeColors[theme as keyof typeof themeColors] || themeColors.light;

//   return (
//     <div className={`max-w-4xl mx-auto ${colors.bg} border ${colors.border} p-8`}>
//       <h1 className={`text-2xl font-bold ${colors.text} mb-6`}>Accessibility Statement</h1>

//       <div className={`space-y-6 text-sm ${colors.text}`}>
//         <section>
//           <p className={`${colors.textSecondary} leading-relaxed mb-4`}>
//             PAAC (Policy-Aware Agent Console) is committed to ensuring digital accessibility for people with
//             disabilities. We continually improve the user experience for everyone and apply relevant accessibility
//             standards.
//           </p>
//         </section>

//         <section>
//           <h2 className="text-lg font-semibold mb-3 ${colors.text}">Conformance Status</h2>
//           <p className="${colors.textSecondary} leading-relaxed mb-3">
//             This application strives to meet{" "}
//             <a href="https://www.w3.org/WAI/WCAG21/quickref/" className="text-[#3B82F6] hover:underline" target="_blank" rel="noopener noreferrer">
//               WCAG 2.1 Level AAA
//             </a>{" "}
//             standards. We have implemented the following accessibility features:
//           </p>
//           <ul className="list-disc list-inside ${colors.textSecondary} space-y-1 ml-4">
//             <li>High contrast color schemes (7:1 minimum contrast ratio)</li>
//             <li>Semantic HTML5 markup for proper screen reader support</li>
//             <li>ARIA labels and descriptions for interactive elements</li>
//             <li>Keyboard navigation support for all interactive components</li>
//             <li>Responsive text sizing (minimum 14px)</li>
//             <li>Focus indicators for keyboard navigation</li>
//             <li>Alternative text for all meaningful images and icons</li>
//           </ul>
//         </section>

//         <section>
//           <h2 className="text-lg font-semibold mb-3 ${colors.text}">Keyboard Navigation</h2>
//           <p className="${colors.textSecondary} leading-relaxed mb-3">
//             All functionality is accessible via keyboard:
//           </p>
//           <ul className="list-disc list-inside ${colors.textSecondary} space-y-1 ml-4">
//             <li><kbd className="px-2 py-1 ${colors.kbdBg} border ${colors.border} rounded text-xs font-mono">Tab</kbd> - Navigate forward through interactive elements</li>
//             <li><kbd className="px-2 py-1 ${colors.kbdBg} border ${colors.border} rounded text-xs font-mono">Shift + Tab</kbd> - Navigate backward</li>
//             <li><kbd className="px-2 py-1 ${colors.kbdBg} border ${colors.border} rounded text-xs font-mono">Enter</kbd> or <kbd className="px-2 py-1 ${colors.kbdBg} border ${colors.border} rounded text-xs font-mono">Space</kbd> - Activate buttons and links</li>
//             <li><kbd className="px-2 py-1 ${colors.kbdBg} border ${colors.border} rounded text-xs font-mono">Esc</kbd> - Close modals and dropdown menus</li>
//             <li><kbd className="px-2 py-1 ${colors.kbdBg} border ${colors.border} rounded text-xs font-mono">Arrow Keys</kbd> - Navigate within dropdowns and tabs</li>
//           </ul>
//         </section>

//         <section>
//           <h2 className="text-lg font-semibold mb-3 ${colors.text}">Theme Options</h2>
//           <p className="${colors.textSecondary} leading-relaxed mb-3">
//             PAAC provides multiple theme options to accommodate different visual needs:
//           </p>
//           <ul className="list-disc list-inside ${colors.textSecondary} space-y-1 ml-4">
//             <li><strong>Light Theme:</strong> Standard light background with dark text (default)</li>
//             <li><strong>Dark Theme:</strong> Dark background with light text for reduced eye strain</li>
//             <li><strong>High Contrast Theme:</strong> Maximum contrast (black and white) for users with low vision</li>
//           </ul>
//           <p className="${colors.textSecondary} leading-relaxed mt-3">
//             Theme preferences are saved locally and persist across sessions.
//           </p>
//         </section>

//         <section>
//           <h2 className="text-lg font-semibold mb-3 ${colors.text}">Screen Reader Compatibility</h2>
//           <p className="${colors.textSecondary} leading-relaxed mb-3">
//             This application has been designed to work with common screen readers:
//           </p>
//           <ul className="list-disc list-inside ${colors.textSecondary} space-y-1 ml-4">
//             <li>JAWS (Windows)</li>
//             <li>NVDA (Windows)</li>
//             <li>VoiceOver (macOS, iOS)</li>
//             <li>TalkBack (Android)</li>
//             <li>Narrator (Windows)</li>
//           </ul>
//           <p className="${colors.textSecondary} leading-relaxed mt-3">
//             All interactive elements include proper ARIA labels, roles, and states to provide context
//             and feedback to assistive technology users.
//           </p>
//         </section>

//         <section>
//           <h2 className="text-lg font-semibold mb-3 ${colors.text}">Text and Visual Design</h2>
//           <ul className="list-disc list-inside ${colors.textSecondary} space-y-1 ml-4">
//             <li>Minimum font size of 14px for body text</li>
//             <li>System font stack for optimal readability across platforms</li>
//             <li>Anti-aliasing and subpixel rendering optimizations</li>
//             <li>Clear visual hierarchy with consistent heading levels</li>
//             <li>Sufficient line height and letter spacing for readability</li>
//             <li>No reliance on color alone to convey information</li>
//             <li>Text can be resized up to 200% without loss of functionality</li>
//           </ul>
//         </section>

//         <section>
//           <h2 className="text-lg font-semibold mb-3 ${colors.text}">Responsive Design</h2>
//           <p className="${colors.textSecondary} leading-relaxed">
//             The interface is fully responsive and works across:
//           </p>
//           <ul className="list-disc list-inside ${colors.textSecondary} space-y-1 ml-4">
//             <li>Desktop (1440px and above)</li>
//             <li>Laptop (1024px - 1440px)</li>
//             <li>Tablet (768px - 1024px)</li>
//             <li>Mobile (375px - 768px)</li>
//           </ul>
//           <p className="${colors.textSecondary} leading-relaxed mt-3">
//             Touch targets meet the minimum 44x44 pixel size for mobile accessibility.
//           </p>
//         </section>

//         <section>
//           <h2 className="text-lg font-semibold mb-3 ${colors.text}">Known Limitations</h2>
//           <p className="${colors.textSecondary} leading-relaxed mb-3">
//             As a demonstration project, some accessibility features may not be fully implemented:
//           </p>
//           <ul className="list-disc list-inside ${colors.textSecondary} space-y-1 ml-4">
//             <li>PDF export functionality may not be fully accessible (HTML/Markdown exports recommended)</li>
//             <li>Some complex data visualizations may require additional context for screen reader users</li>
//             <li>Real-time updates and animations may need additional announcements for assistive technology</li>
//           </ul>
//         </section>

//         <section>
//           <h2 className="text-lg font-semibold mb-3 ${colors.text}">Feedback</h2>
//           <p className="${colors.textSecondary} leading-relaxed">
//             We welcome feedback on the accessibility of this project. If you encounter accessibility barriers
//             or have suggestions for improvement, please reach out through the project's public repository
//             or contact information.
//           </p>
//         </section>

//         <section>
//           <h2 className="text-lg font-semibold mb-3 ${colors.text}">Accessibility Resources</h2>
//           <p className="${colors.textSecondary} leading-relaxed mb-3">
//             For more information about web accessibility:
//           </p>
//           <ul className="${colors.textSecondary} space-y-1">
//             <li>
//               <a href="https://www.w3.org/WAI/" className="text-[#3B82F6] hover:underline" target="_blank" rel="noopener noreferrer">
//                 W3C Web Accessibility Initiative (WAI)
//               </a>
//             </li>
//             <li>
//               <a href="https://www.w3.org/WAI/WCAG21/quickref/" className="text-[#3B82F6] hover:underline" target="_blank" rel="noopener noreferrer">
//                 WCAG 2.1 Quick Reference
//               </a>
//             </li>
//             <li>
//               <a href="https://webaim.org/" className="text-[#3B82F6] hover:underline" target="_blank" rel="noopener noreferrer">
//                 WebAIM - Web Accessibility In Mind
//               </a>
//             </li>
//           </ul>
//         </section>

//         <div className={`border-t ${colors.border} pt-6 mt-8`}>
//           <p className="text-xs ${colors.textTertiary}">
//             Last Updated: April 22, 2026
//           </p>
//           <p className="text-xs ${colors.textTertiary} mt-2">
//             © 2026 Truc Tran. All rights reserved. This is a personal project demonstrating accessibility best practices.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
interface Props {
  theme: string;
}

export default function AccessibilityPage({ theme }: Props) {
  const themeColors = {
    light: {
      bg: "bg-white",
      border: "border-[#E5E7EB]",
      text: "text-[#111827]",
      textSecondary: "text-[#6B7280]",
      textTertiary: "text-[#9CA3AF]",
      kbdBg: "bg-[#F3F4F6]",
    },
    dark: {
      bg: "bg-[#1E293B]",
      border: "border-[#334155]",
      text: "text-white",
      textSecondary: "text-[#94A3B8]",
      textTertiary: "text-[#64748B]",
      kbdBg: "bg-[#334155]",
    },
    "high-contrast": {
      bg: "bg-white",
      border: "border-black",
      text: "text-black",
      textSecondary: "text-[#4B5563]",
      textTertiary: "text-[#6B7280]",
      kbdBg: "bg-[#F3F4F6]",
    },
  };

  const colors = themeColors[theme as keyof typeof themeColors] || themeColors.light;

  return (
    <div className={`max-w-4xl mx-auto ${colors.bg} border ${colors.border} p-8`}>
      <h1 className={`text-2xl font-bold ${colors.text} mb-6`}>Accessibility Statement</h1>

      <div className={`space-y-6 text-sm ${colors.text}`}>
        <section>
          <p className={`${colors.textSecondary} leading-relaxed mb-4`}>
            PAAC (Policy-Aware Agent Console) is committed to ensuring digital accessibility for people with
            disabilities. We continually improve the user experience for everyone and apply relevant accessibility
            standards.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mb-3 ${colors.text}`}>Conformance Status</h2>
          <p className={`${colors.textSecondary} leading-relaxed mb-3`}>
            This application strives to meet{" "}
            <a
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              className="text-[#3B82F6] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WCAG 2.1 Level AAA
            </a>{" "}
            standards. We have implemented the following accessibility features:
          </p>
          <ul className={`list-disc list-inside ${colors.textSecondary} space-y-1 ml-4`}>
            <li>High contrast color schemes (7:1 minimum contrast ratio)</li>
            <li>Semantic HTML5 markup for proper screen reader support</li>
            <li>ARIA labels and descriptions for interactive elements</li>
            <li>Keyboard navigation support for all interactive components</li>
            <li>Responsive text sizing (minimum 14px)</li>
            <li>Focus indicators for keyboard navigation</li>
            <li>Alternative text for all meaningful images and icons</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mb-3 ${colors.text}`}>Keyboard Navigation</h2>
          <p className={`${colors.textSecondary} leading-relaxed mb-3`}>
            All functionality is accessible via keyboard:
          </p>
          <ul className={`list-disc list-inside ${colors.textSecondary} space-y-1 ml-4`}>
            <li>
              <kbd className={`px-2 py-1 ${colors.kbdBg} border ${colors.border} rounded text-xs font-mono`}>
                Tab
              </kbd>{" "}
              - Navigate forward through interactive elements
            </li>
            <li>
              <kbd className={`px-2 py-1 ${colors.kbdBg} border ${colors.border} rounded text-xs font-mono`}>
                Shift + Tab
              </kbd>{" "}
              - Navigate backward
            </li>
            <li>
              <kbd className={`px-2 py-1 ${colors.kbdBg} border ${colors.border} rounded text-xs font-mono`}>
                Enter
              </kbd>{" "}
              or{" "}
              <kbd className={`px-2 py-1 ${colors.kbdBg} border ${colors.border} rounded text-xs font-mono`}>
                Space
              </kbd>{" "}
              - Activate buttons and links
            </li>
            <li>
              <kbd className={`px-2 py-1 ${colors.kbdBg} border ${colors.border} rounded text-xs font-mono`}>
                Esc
              </kbd>{" "}
              - Close modals and dropdown menus
            </li>
            <li>
              <kbd className={`px-2 py-1 ${colors.kbdBg} border ${colors.border} rounded text-xs font-mono`}>
                Arrow Keys
              </kbd>{" "}
              - Navigate within dropdowns and tabs
            </li>
          </ul>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mb-3 ${colors.text}`}>Theme Options</h2>
          <p className={`${colors.textSecondary} leading-relaxed mb-3`}>
            PAAC provides multiple theme options to accommodate different visual needs:
          </p>
          <ul className={`list-disc list-inside ${colors.textSecondary} space-y-1 ml-4`}>
            <li><strong>Light Theme:</strong> Standard light background with dark text (default)</li>
            <li><strong>Dark Theme:</strong> Dark background with light text for reduced eye strain</li>
            <li><strong>High Contrast Theme:</strong> Maximum contrast (black and white) for users with low vision</li>
          </ul>
          <p className={`${colors.textSecondary} leading-relaxed mt-3`}>
            Theme preferences are saved locally and persist across sessions.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mb-3 ${colors.text}`}>Screen Reader Compatibility</h2>
          <p className={`${colors.textSecondary} leading-relaxed mb-3`}>
            This application has been designed to work with common screen readers:
          </p>
          <ul className={`list-disc list-inside ${colors.textSecondary} space-y-1 ml-4`}>
            <li>JAWS (Windows)</li>
            <li>NVDA (Windows)</li>
            <li>VoiceOver (macOS, iOS)</li>
            <li>TalkBack (Android)</li>
            <li>Narrator (Windows)</li>
          </ul>
          <p className={`${colors.textSecondary} leading-relaxed mt-3`}>
            All interactive elements include proper ARIA labels, roles, and states to provide context
            and feedback to assistive technology users.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mb-3 ${colors.text}`}>Text and Visual Design</h2>
          <ul className={`list-disc list-inside ${colors.textSecondary} space-y-1 ml-4`}>
            <li>Minimum font size of 14px for body text</li>
            <li>System font stack for optimal readability across platforms</li>
            <li>Anti-aliasing and subpixel rendering optimizations</li>
            <li>Clear visual hierarchy with consistent heading levels</li>
            <li>Sufficient line height and letter spacing for readability</li>
            <li>No reliance on color alone to convey information</li>
            <li>Text can be resized up to 200% without loss of functionality</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mb-3 ${colors.text}`}>Responsive Design</h2>
          <p className={`${colors.textSecondary} leading-relaxed`}>
            The interface is fully responsive and works across:
          </p>
          <ul className={`list-disc list-inside ${colors.textSecondary} space-y-1 ml-4`}>
            <li>Desktop (1440px and above)</li>
            <li>Laptop (1024px - 1440px)</li>
            <li>Tablet (768px - 1024px)</li>
            <li>Mobile (375px - 768px)</li>
          </ul>
          <p className={`${colors.textSecondary} leading-relaxed mt-3`}>
            Touch targets meet the minimum 44x44 pixel size for mobile accessibility.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mb-3 ${colors.text}`}>Known Limitations</h2>
          <p className={`${colors.textSecondary} leading-relaxed mb-3`}>
            As a demonstration project, some accessibility features may not be fully implemented:
          </p>
          <ul className={`list-disc list-inside ${colors.textSecondary} space-y-1 ml-4`}>
            <li>PDF export functionality may not be fully accessible (HTML/Markdown exports recommended)</li>
            <li>Some complex data visualizations may require additional context for screen reader users</li>
            <li>Real-time updates and animations may need additional announcements for assistive technology</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mb-3 ${colors.text}`}>Feedback</h2>
          <p className={`${colors.textSecondary} leading-relaxed`}>
            We welcome feedback on the accessibility of this project. If you encounter accessibility barriers
            or have suggestions for improvement, please reach out through the project's public repository
            or contact information.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mb-3 ${colors.text}`}>Accessibility Resources</h2>
          <p className={`${colors.textSecondary} leading-relaxed mb-3`}>
            For more information about web accessibility:
          </p>
          <ul className={`${colors.textSecondary} space-y-1`}>
            <li>
              <a
                href="https://www.w3.org/WAI/"
                className="text-[#3B82F6] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                W3C Web Accessibility Initiative (WAI)
              </a>
            </li>
            <li>
              <a
                href="https://www.w3.org/WAI/WCAG21/quickref/"
                className="text-[#3B82F6] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                WCAG 2.1 Quick Reference
              </a>
            </li>
            <li>
              <a
                href="https://webaim.org/"
                className="text-[#3B82F6] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                WebAIM - Web Accessibility In Mind
              </a>
            </li>
          </ul>
        </section>

        <div className={`border-t ${colors.border} pt-6 mt-8`}>
          <p className={`text-xs ${colors.textTertiary}`}>
            Last Updated: April 22, 2026
          </p>
          <p className={`text-xs ${colors.textTertiary} mt-2`}>
            © 2026 Truc Tran. All rights reserved. This is a personal project demonstrating accessibility best practices.
          </p>
        </div>
      </div>
    </div>
  );
}