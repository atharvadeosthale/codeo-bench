import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import type { BenchEntry } from "../data/types";

function formatTimecode(seconds: number, fps = 30): string {
	const s = Math.floor(seconds);
	const f = Math.floor((seconds - s) * fps);
	const mm = String(Math.floor(s / 60)).padStart(2, "0");
	const ss = String(s % 60).padStart(2, "0");
	const ff = String(f).padStart(2, "0");
	return `00:${mm}:${ss}:${ff}`;
}

export default function VideoCard({
	entry,
	index,
}: {
	entry: BenchEntry;
	index: number;
}) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const rafRef = useRef<number | null>(null);
	const [timecode, setTimecode] = useState("00:00:00:00");
	const [live, setLive] = useState(false);

	const tick = () => {
		const v = videoRef.current;
		if (!v) return;
		setTimecode(formatTimecode(v.currentTime));
		rafRef.current = requestAnimationFrame(tick);
	};

	const play = () => {
		const v = videoRef.current;
		if (!v || !entry.video) return;
		// already rolling — pointermove calls this constantly, bail cheap
		if (v.getAttribute("src") && !v.paused) return;
		// SSR drops the muted attribute (React quirk); an unmuted video gets
		// blocked by autoplay policy on hover, so force it before play()
		v.muted = true;
		v.defaultMuted = true;
		// src is attached only on hover so idle cards make zero media requests
		if (!v.getAttribute("src")) {
			v.setAttribute("src", entry.video);
		}
		v.play().catch(() => {});
		if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
	};

	const stop = () => {
		const v = videoRef.current;
		if (rafRef.current !== null) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
		if (!v) return;
		v.pause();
		// detach src + load() aborts any in-flight buffering — no wasted bytes
		v.removeAttribute("src");
		v.load();
		setLive(false);
		setTimecode("00:00:00:00");
	};

	return (
		<Link
			to="/v/$model/$slug"
			params={{ model: entry.model.id, slug: entry.slug }}
			className="video-card rise-in"
			style={{ animationDelay: `${index * 70 + 90}ms` }}
			onPointerEnter={play}
			onPointerMove={play}
			onPointerLeave={stop}
			onFocus={play}
			onBlur={stop}
		>
			<div className="video-frame">
				{entry.video ? (
					<video
						ref={videoRef}
						poster={entry.poster ?? undefined}
						muted
						loop
						playsInline
						preload="none"
						onPlaying={() => setLive(true)}
						onWaiting={() => setLive(false)}
					/>
				) : (
					<div className="smpte-bars absolute inset-0" aria-hidden="true">
						{Array.from({ length: 7 }, (_, i) => (
							<span key={i} />
						))}
					</div>
				)}
				<div className="frame-overlay">
					<span className="rec-dot">{live ? "PREVIEW" : "CUEING…"}</span>
					<span className="timecode">{timecode}</span>
				</div>
			</div>
			<div className="card-body">
				<h3 className="card-model m-0">{entry.task.title}</h3>
				<div className="card-meta">
					<span
						className={`status-dot ${
							entry.status === "failed"
								? "is-failed"
								: entry.status === "pending"
									? "is-pending"
									: ""
						}`}
						title={entry.status}
					/>
					<span>{entry.task.id}</span>
					<span
						className={`template-chip ${entry.template === "with-skills" ? "is-skills" : ""}`}
					>
						{entry.template === "with-skills" ? "skills" : "base"}
					</span>
					<span className="ml-auto">{entry.date}</span>
				</div>
			</div>
		</Link>
	);
}
