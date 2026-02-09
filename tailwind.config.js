/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./layouts/**/*.html", "./content/**/*.{html,md}"],
	theme: {
		extend: {
			typography: {
				DEFAULT: {
					css: {
						// Remove backticks from inline code
						"code::before": { content: "none" },
						"code::after": { content: "none" },
						// Let syntax.css handle pre/code styling
						pre: false,
						code: false,
					},
				},
			},
			colors: {
				tn: {
					bg: "var(--tn-bg)",
					"bg-secondary": "var(--tn-bg-secondary)",
					text: "var(--tn-text)",
					"text-muted": "var(--tn-text-muted)",
					accent: "var(--tn-accent)",
					"accent-hover": "var(--tn-accent-hover)",
					border: "var(--tn-border)",
				},
			},
			maxWidth: {
				content: "720px",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
