import { useEffect, useRef } from "react";
import type { BenchEntry } from "../data/types";

const PANEL_COUNT = 12;

export default function HeroReel({ entries }: { entries: BenchEntry[] }) {
	const tiltRef = useRef<HTMLDivElement>(null);

	const posters = entries.map((e) => e.poster).filter(Boolean) as string[];

	useEffect(() => {
		let raf: number | null = null;
		const onMove = (e: PointerEvent) => {
			if (raf !== null) return;
			raf = requestAnimationFrame(() => {
				raf = null;
				const el = tiltRef.current;
				if (!el) return;
				const x = (e.clientX / window.innerWidth - 0.5) * 14;
				const y = (e.clientY / window.innerHeight - 0.5) * -8;
				el.style.setProperty("--tx", `${x.toFixed(2)}deg`);
				el.style.setProperty("--ty", `${y.toFixed(2)}deg`);
			});
		};
		window.addEventListener("pointermove", onMove);
		return () => {
			window.removeEventListener("pointermove", onMove);
			if (raf !== null) cancelAnimationFrame(raf);
		};
	}, []);

	return (
		<div className="reel-3d" aria-hidden="true">
			<div className="reel-tilt" ref={tiltRef}>
				<div className="reel-dof" />
				<div className="reel-ring">
					{Array.from({ length: PANEL_COUNT }, (_, i) => {
						const poster =
							posters.length > 0 && i % 2 === 0
								? posters[(i / 2) % posters.length]
								: null;
						return (
							<div
								key={i}
								className="reel-panel"
								style={
									{
										"--a": `${(360 / PANEL_COUNT) * i}deg`,
									} as React.CSSProperties
								}
							>
								{poster ? (
									<>
										<img src={poster} alt="" loading="lazy" draggable={false} />
										<span className="reel-panel-label">
											<span>FR {String(i + 1).padStart(2, "0")}</span>
											<span>24FPS</span>
										</span>
									</>
								) : (
									<span className="reel-panel-blank">
										{String(i + 1).padStart(2, "0")}
									</span>
								)}
							</div>
						);
					})}
				</div>
			</div>
			<div className="reel-shadow" />
		</div>
	);
}
