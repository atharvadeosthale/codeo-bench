import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import manifest from "../data/manifest.json";
import type { BenchEntry } from "../data/types";

export const Route = createFileRoute("/v/$model/$slug")({
	loader: ({ params }) => {
		const entry = (manifest.entries as BenchEntry[]).find(
			(e) => e.model.id === params.model && e.slug === params.slug,
		);
		if (!entry) throw notFound();
		return entry;
	},
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData
					? `${loaderData.model.name} · ${loaderData.task.title} · Codeo Bench`
					: "Codeo Bench",
			},
		],
	}),
	component: EntryPage,
});

function EntryPage() {
	const entry = Route.useLoaderData();

	return (
		<main className="page-wrap px-4 pb-10 pt-10">
			<Link to="/" className="back-link rise-in">
				<span className="arrow">←</span> Back to the reel
			</Link>

			<div className="mt-6 grid gap-10 lg:grid-cols-[1fr_320px]">
				<div>
					<div className="player-shell rise-in">
						{entry.video ? (
							<video
								src={entry.video}
								poster={entry.poster ?? undefined}
								controls
								playsInline
							/>
						) : (
							<div className="no-signal-screen">
								<div className="smpte-bars" aria-hidden="true">
									{Array.from({ length: 7 }, (_, i) => (
										<span key={i} />
									))}
								</div>
								<div className="no-signal-label">NOT RENDERED</div>
							</div>
						)}
					</div>

					<section className="mt-10">
						<div className="hero-rule mb-5">
							<span className="mono-label">prompt</span>
						</div>
						<pre className="prompt-block m-0">
							{entry.prompt ??
								"No prompt. This entry is the unchanged template scaffold, rendered as-is for reference."}
						</pre>
					</section>
				</div>

				<aside className="rise-in" style={{ animationDelay: "120ms" }}>
					<p className="kicker m-0 mb-2">{entry.task.title}</p>
					<h1 className="display-title m-0 text-3xl font-extrabold leading-tight sm:text-4xl">
						{entry.model.name}
					</h1>
					<Link
						to="/m/$model"
						params={{ model: entry.model.id }}
						className="model-link mt-3"
					>
						All entries by this model <span className="arrow">→</span>
					</Link>

					<dl className="m-0 mt-8">
						<div className="detail-row">
							<dt>Model ID</dt>
							<dd>{entry.model.id}</dd>
						</div>
						<div className="detail-row">
							<dt>Task</dt>
							<dd>{entry.task.id}</dd>
						</div>
						<div className="detail-row">
							<dt>Template</dt>
							<dd>{entry.template}</dd>
						</div>
						<div className="detail-row">
							<dt>Benchmark</dt>
							<dd>{entry.benchmarkVersion}</dd>
						</div>
						<div className="detail-row">
							<dt>Remotion</dt>
							<dd>{manifest.remotionVersion}</dd>
						</div>
						<div className="detail-row">
							<dt>Date</dt>
							<dd>{entry.date}</dd>
						</div>
						<div className="detail-row">
							<dt>Status</dt>
							<dd>
								<span
									className={`status-dot mr-2 ${
										entry.status === "failed"
											? "is-failed"
											: entry.status === "pending"
												? "is-pending"
												: ""
									}`}
								/>
								{entry.status}
							</dd>
						</div>
					</dl>
				</aside>
			</div>
		</main>
	);
}
