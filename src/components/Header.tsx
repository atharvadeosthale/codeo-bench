import { Link } from "@tanstack/react-router";

export default function Header() {
	return (
		<header className="site-header px-4">
			<nav className="page-wrap flex items-center gap-4 py-3.5">
				<Link to="/" className="wordmark">
					CODEO
					<span className="wordmark-tag">BENCH</span>
				</Link>

				<div className="ml-auto flex items-center gap-4 sm:gap-6">
					<Link
						to="/"
						className="nav-link"
						activeProps={{ className: "nav-link is-active" }}
						activeOptions={{ exact: true }}
					>
						Gallery
					</Link>
					<Link
						to="/about"
						className="nav-link"
						activeProps={{ className: "nav-link is-active" }}
					>
						About
					</Link>
				</div>
			</nav>
		</header>
	);
}
