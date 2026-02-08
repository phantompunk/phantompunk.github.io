/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./layouts/**/*.html", "./content/**/*.{html,md}"],
	theme: {
		extend: {
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						"--tw-prose-links": theme("colors.indigo.600"),
						"--tw-prose-invert-links": theme("colors.indigo.400"),
						// Fix Hugo's 'Chroma' code blocks
						pre: {
							backgroundColor: theme("colors.slate.900"),
							color: theme("colors.slate.200"),
							padding: theme("spacing.6"),
						},
						code: {
							fontWeight: "600",
							"@apply bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded": {},
						},
						// Remove backticks from inline code
						"code::before": { content: "none" },
						"code::after": { content: "none" },
					},
				},
			}),
			colors: {
				tn: {
					bg: "#1a1b26",
					"bg-secondary": "#283457",
					text: "#c0caf5",
					"text-muted": "#7982a9",
					accent: "#73daca",
					"accent-hover": "#9eecd8",
					border: "#283457",
				},
			},
			maxWidth: {
				content: "720px",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
