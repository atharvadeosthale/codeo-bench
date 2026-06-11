import { createFileRoute } from "@tanstack/react-router";
import manifest from "../data/manifest.json";

export const Route = createFileRoute("/about")({
	component: About,
});

const STEPS = [
	{
		n: "01",
		title: "One canonical prompt per task",
		body: "Each task lives in the repo as a single prompt. Every model receives it verbatim. No per-model tweaking, no retries with hints, no second chances.",
	},
	{
		n: "02",
		title: "A pinned template",
		body: `Every entry starts from the same Remotion ${manifest.remotionVersion} scaffold, frozen in this repo. Two variants exist: base (Tailwind) and with-skills (Tailwind plus the remotion-best-practices agent skill). The template version is the benchmark version.`,
	},
	{
		n: "03",
		title: "Untouched output",
		body: "The model writes the composition. Whatever comes back gets rendered as-is. No human fixes, no formatting, no mercy. Broken code is a result too; failed entries stay on the board.",
	},
	{
		n: "04",
		title: "You are the judge",
		body: "There are no scores, rubrics, or Elo. The benchmark is your own eyes, watching the same brief interpreted by different models.",
	},
];

function About() {
	const today = manifest.entries.at(0)?.date ?? "n/a";

	return (
		<main className="page-wrap px-4 pb-10 pt-16">
			<section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
				<div>
					<p className="kicker rise-in m-0 mb-5">About</p>
					<h1 className="display-title rise-in m-0 text-4xl font-extrabold leading-[1.02] sm:text-6xl">
						How models <span className="accent-word">see</span> motion.
					</h1>
					<p
						className="rise-in mt-6 max-w-2xl text-base leading-7 text-[var(--ink-dim)]"
						style={{ animationDelay: "100ms" }}
					>
						Codeo Bench is a visual benchmark of AI-generated Remotion videos.
						Language benchmarks measure tokens; this one measures taste: timing,
						easing, composition, restraint. Things you can only evaluate by
						watching.
					</p>
				</div>

				<dl
					className="slate-card rise-in m-0"
					style={{ animationDelay: "160ms" }}
				>
					<div className="slate-clapper" />
					<div className="slate-body">
						<div className="slate-row">
							<dt>Production</dt>
							<dd>Codeo Bench</dd>
						</div>
						<div className="slate-row">
							<dt>Benchmark</dt>
							<dd>{manifest.version}</dd>
						</div>
						<div className="slate-row">
							<dt>Engine</dt>
							<dd>Remotion {manifest.remotionVersion}</dd>
						</div>
						<div className="slate-row">
							<dt>Entries</dt>
							<dd>{String(manifest.entries.length).padStart(2, "0")}</dd>
						</div>
						<div className="slate-row">
							<dt>Last take</dt>
							<dd>{today}</dd>
						</div>
					</div>
				</dl>
			</section>

			<section className="mt-8">
				<div className="hero-rule">
					<span className="mono-label">the protocol</span>
				</div>
				<div className="rise-in mt-6" style={{ animationDelay: "200ms" }}>
					{STEPS.map((step) => (
						<article key={step.n} className="step-row">
							<span className="step-num">{step.n}</span>
							<div>
								<h2>{step.title}</h2>
								<p>{step.body}</p>
							</div>
						</article>
					))}
				</div>
			</section>

			<section className="mt-12">
				<div className="hero-rule">
					<span className="mono-label">credits</span>
				</div>
				<div className="credits rise-in" style={{ animationDelay: "240ms" }}>
					<div>
						<p className="credit-role">Built by</p>
						<p className="credit-name">
							<a
								href="https://x.com/atharvabuilds"
								target="_blank"
								rel="noreferrer"
							>
								Atharva
							</a>
							<span className="credit-handle">@atharvabuilds</span>
						</p>
					</div>
					<div>
						<p className="credit-role">The name</p>
						<p className="credit-name">
							Codeo = code + video
							<span className="credit-handle">
								(Atharva is not really good at naming things)
							</span>
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
