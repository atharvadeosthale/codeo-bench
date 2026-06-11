export default function EmptyState() {
	return (
		<div className="no-signal rise-in">
			<div className="no-signal-screen">
				<div className="smpte-bars" aria-hidden="true">
					{Array.from({ length: 7 }, (_, i) => (
						<span key={i} />
					))}
				</div>
				<div className="no-signal-label">NO SIGNAL</div>
			</div>
			<div className="flex flex-col items-center gap-2 border-t border-[var(--line)] px-6 py-8 text-center">
				<p className="m-0 text-lg font-semibold">No entries yet</p>
				<p className="mono-label m-0">
					pnpm new-project → paste model output → pnpm publish-video
				</p>
			</div>
		</div>
	);
}
