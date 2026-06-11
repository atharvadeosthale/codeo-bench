import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import VideoCard from "../components/VideoCard";
import manifest from "../data/manifest.json";
import type { BenchEntry } from "../data/types";

export const Route = createFileRoute("/m/$model")({
	loader: ({ params }) => {
		const entries = (manifest.entries as BenchEntry[]).filter(
			(e) => e.model.id === params.model,
		);
		if (entries.length === 0) throw notFound();
		return entries;
	},
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData?.[0]
					? `${loaderData[0].model.name} · Codeo Bench`
					: "Codeo Bench",
			},
		],
	}),
	component: ModelPage,
});

function ModelPage() {
	const entries = Route.useLoaderData();
	const model = entries[0].model;
	const tasks = new Set(entries.map((e) => e.task.id));

	return (
		<main className="page-wrap px-4 pb-10 pt-10">
			<Link to="/" className="back-link rise-in">
				<span className="arrow">←</span> Back to the reel
			</Link>

			<section className="pb-10 pt-10">
				<p className="kicker rise-in m-0 mb-4">Model</p>
				<h1
					className="display-title rise-in m-0 text-5xl font-extrabold leading-[0.98] sm:text-7xl"
					style={{ animationDelay: "60ms" }}
				>
					{model.name}
				</h1>
			</section>

			<dl
				className="spec-strip rise-in m-0"
				style={{ animationDelay: "120ms" }}
			>
				<div className="spec-cell">
					<dt>Slug</dt>
					<dd>{model.id}</dd>
				</div>
				<div className="spec-cell">
					<dt>Entries</dt>
					<dd>{String(entries.length).padStart(2, "0")}</dd>
				</div>
				<div className="spec-cell">
					<dt>Tasks</dt>
					<dd>{String(tasks.size).padStart(2, "0")}</dd>
				</div>
				<div className="spec-cell">
					<dt>Benchmark</dt>
					<dd>{manifest.version}</dd>
				</div>
				<div className="spec-cell">
					<dt>Remotion</dt>
					<dd>{manifest.remotionVersion}</dd>
				</div>
			</dl>

			<section className="mt-12">
				<div className="hero-rule mb-8">
					<span className="mono-label">tasks</span>
				</div>
				<div className="grid gap-5 sm:grid-cols-2">
					{entries.map((entry, i) => (
						<VideoCard key={entry.id} entry={entry} index={i} />
					))}
				</div>
			</section>
		</main>
	);
}
