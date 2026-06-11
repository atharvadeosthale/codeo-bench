import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import Footer from "../components/Footer";
import Header from "../components/Header";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Codeo Bench · How AI models direct Remotion",
			},
			{
				name: "description",
				content:
					"A visual benchmark of AI-generated Remotion videos. Same prompt, same template, different model. No scores, just watch.",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
	notFoundComponent: NotFound,
});

function NotFound() {
	return (
		<main className="page-wrap px-4 pb-10 pt-20">
			<div className="no-signal rise-in mx-auto max-w-2xl">
				<div className="no-signal-screen">
					<div className="smpte-bars" aria-hidden="true">
						{Array.from({ length: 7 }, (_, i) => (
							<span key={i} />
						))}
					</div>
					<div className="no-signal-label">404 · NO SIGNAL</div>
				</div>
				<div className="flex flex-col items-center gap-3 border-t border-[var(--line)] px-6 py-8 text-center">
					<p className="m-0 text-lg font-semibold">This frame doesn't exist.</p>
					<Link to="/" className="back-link">
						<span className="arrow">←</span> Back to the reel
					</Link>
				</div>
			</div>
		</main>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				<HeadContent />
			</head>
			<body className="font-sans antialiased [overflow-wrap:anywhere]">
				<Header />
				{children}
				<Footer />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
