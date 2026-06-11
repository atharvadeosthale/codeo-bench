import { createFileRoute, Link } from "@tanstack/react-router";
import EmptyState from "../components/EmptyState";
import HeroReel from "../components/HeroReel";
import VideoCard from "../components/VideoCard";
import manifest from "../data/manifest.json";
import type { BenchEntry } from "../data/types";

export const Route = createFileRoute("/")({ component: Home });

function groupByModel(entries: BenchEntry[]) {
	const groups: Array<{ model: BenchEntry["model"]; entries: BenchEntry[] }> =
		[];
	for (const entry of entries) {
		const group = groups.at(-1);
		if (group && group.model.id === entry.model.id) {
			group.entries.push(entry);
		} else {
			groups.push({ model: entry.model, entries: [entry] });
		}
	}
	return groups;
}

function Home() {
	const entries = manifest.entries as BenchEntry[];
	const groups = groupByModel(entries);
	const tasks = new Set(entries.map((e) => e.task.id));

	return (
		<main className="pb-10">
			<section className="hero-stage page-wrap px-4">
				<h1
					className="hero-giant display-title rise-in"
					style={{ animationDelay: "80ms" }}
				>
					<span className="line-solid">Remotion</span>
					<span className="line-outline">Benchmark</span>
				</h1>

				<HeroReel entries={entries} />

				<p className="hero-sub rise-in" style={{ animationDelay: "160ms" }}>
					Same prompt. Same pinned Remotion template. Every video here was
					written by an AI model and rendered untouched. No scores, no rankings.
					Press play and judge for yourself.
				</p>
				<a
					href="#reel"
					className="scroll-cue rise-in relative z-[3]"
					style={{ animationDelay: "240ms" }}
				>
					<span className="mono-label">roll tape</span>
					<span className="scroll-cue-line" />
				</a>
			</section>

			<div className="page-wrap px-4">
				<dl className="spec-strip m-0">
					<div className="spec-cell">
						<dt>Entries</dt>
						<dd>{String(entries.length).padStart(2, "0")}</dd>
					</div>
					<div className="spec-cell">
						<dt>Models</dt>
						<dd>{String(groups.length).padStart(2, "0")}</dd>
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

				<section id="reel" className="mt-14 scroll-mt-24">
					<div className="hero-rule mb-10">
						<span className="mono-label">the reel</span>
					</div>

					{groups.length === 0 ? (
						<EmptyState />
					) : (
						<div className="flex flex-col gap-14">
							{groups.map((group) => (
								<section key={group.model.id}>
									<div className="model-head">
										<h2 className="display-title">{group.model.name}</h2>
										<Link
											to="/m/$model"
											params={{ model: group.model.id }}
											className="model-link"
										>
											{group.entries.length}{" "}
											{group.entries.length === 1 ? "entry" : "entries"}{" "}
											<span className="arrow">→</span>
										</Link>
									</div>
									<div className="grid gap-5 sm:grid-cols-2">
										{group.entries.map((entry, i) => (
											<VideoCard key={entry.id} entry={entry} index={i} />
										))}
									</div>
								</section>
							))}
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
