export default function Footer() {
	return (
		<footer className="mt-24">
			<div className="footer-bars" aria-hidden="true">
				<span style={{ background: "#a8a8a0" }} />
				<span style={{ background: "#aaa83e" }} />
				<span style={{ background: "#3ba8a4" }} />
				<span style={{ background: "#3ca83e" }} />
				<span style={{ background: "#a43ca4" }} />
				<span style={{ background: "#a33b3b" }} />
				<span style={{ background: "#2f2fa6" }} />
			</div>
			<div className="border-t border-[var(--line)] px-4 py-8">
				<div className="page-wrap flex flex-col items-center justify-between gap-3 sm:flex-row">
					<p className="m-0 text-sm font-semibold tracking-tight">
						Codeo <span className="text-[var(--accent)]">Bench</span>
					</p>
					<a
						href="https://x.com/atharvabuilds"
						target="_blank"
						rel="noreferrer"
						className="mono-label no-underline transition-colors hover:text-[var(--accent)]"
					>
						built by @atharvabuilds
					</a>
				</div>
			</div>
		</footer>
	);
}
