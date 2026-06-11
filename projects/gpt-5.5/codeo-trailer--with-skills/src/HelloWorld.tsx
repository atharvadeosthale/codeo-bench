import type {CSSProperties} from "react";
import {z} from "zod";
import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

export const myCompSchema = z.object({});

const COLORS = {
	bg: "#050603",
	bg2: "#0a0b07",
	raised: "#11130c",
	ink: "#eef0e2",
	dim: "#91957e",
	faint: "#565a47",
	line: "rgba(238, 240, 226, 0.12)",
	lineStrong: "rgba(238, 240, 226, 0.22)",
	accent: "#d4ff3f",
	accentSoft: "rgba(212, 255, 63, 0.13)",
	rec: "#ff4438",
	ok: "#57d984",
};

const POSTERS = [
	"https://pub-441b3999e27941998ef4710046030850.r2.dev/v1/claude-fable-5/codeo-trailer--base/poster.jpeg",
	"https://pub-441b3999e27941998ef4710046030850.r2.dev/v1/claude-fable-5/codeo-trailer--with-skills/poster.jpeg",
	"https://pub-441b3999e27941998ef4710046030850.r2.dev/v1/claude-fable-5/react-under-the-hood--base/poster.jpeg",
	"https://pub-441b3999e27941998ef4710046030850.r2.dev/v1/claude-fable-5/react-under-the-hood--with-skills/poster.jpeg",
	"https://pub-441b3999e27941998ef4710046030850.r2.dev/v1/claude-fable-5/youtube-lower-thirds--base/poster.jpeg",
	"https://pub-441b3999e27941998ef4710046030850.r2.dev/v1/claude-fable-5/youtube-lower-thirds--with-skills/poster.jpeg",
	"https://pub-441b3999e27941998ef4710046030850.r2.dev/v1/test/with-skills/poster.jpeg",
	"https://pub-441b3999e27941998ef4710046030850.r2.dev/v1/test/without-skills/poster.jpeg",
];

const CARDS = [
	{task: "Codeo Trailer", model: "Claude Fable 5", template: "base", status: "published", poster: POSTERS[0]},
	{task: "Codeo Trailer", model: "Claude Fable 5", template: "skills", status: "published", poster: POSTERS[1]},
	{task: "React Under the Hood", model: "Claude Fable 5", template: "base", status: "published", poster: POSTERS[2]},
	{task: "React Under the Hood", model: "GPT-5.5", template: "skills", status: "pending", poster: null},
	{task: "YouTube Lower Thirds", model: "Claude Fable 5", template: "skills", status: "published", poster: POSTERS[5]},
	{task: "Codeo Trailer", model: "GPT-5.5", template: "skills", status: "pending", poster: null},
];

const PROTOCOL_ROWS = [
	["01", "one canonical prompt"],
	["02", "pinned Remotion 4.0.475 template"],
	["03", "untouched model output"],
	["04", "failed entries stay"],
	["05", "humans press play"],
];

const mono: CSSProperties = {
	fontFamily: '"IBM Plex Mono", "SF Mono", ui-monospace, monospace',
	fontVariantNumeric: "tabular-nums",
};

const sans: CSSProperties = {
	fontFamily: '"Bricolage Grotesque", Inter, ui-sans-serif, system-ui, sans-serif',
};

const clamp = (value: number, min = 0, max = 1) =>
	Math.min(max, Math.max(min, value));

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
const easeBack = Easing.bezier(0.34, 1.56, 0.64, 1);

const prog = (
	frame: number,
	start: number,
	end: number,
	ease: (input: number) => number = easeOut,
) => ease(clamp((frame - start) / (end - start)));

const byFrame = (
	frame: number,
	input: [number, number],
	output: [number, number],
	ease: (input: number) => number = easeOut,
) =>
	interpolate(frame, input, output, {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: ease,
	});

const windowOpacity = (frame: number, start: number, end: number, fade = 8) => {
	const inOpacity = byFrame(frame, [start, start + fade], [0, 1]);
	const outOpacity = byFrame(frame, [end - fade, end], [1, 0], easeInOut);
	return Math.min(inOpacity, outOpacity);
};

const timecode = (frame: number, fps: number) => {
	const totalSeconds = frame / fps;
	const whole = Math.floor(totalSeconds);
	const ff = Math.floor((totalSeconds - whole) * fps);
	return `00:00:${String(whole).padStart(2, "0")}:${String(ff).padStart(2, "0")}`;
};

const jitter = (frame: number, strength: number) =>
	Math.sin(frame * 1.73) * strength + Math.sin(frame * 0.43 + 2.1) * strength * 0.35;

const FilmBackground: React.FC<{frame: number}> = ({frame}) => {
	const sweep = (frame * 18) % 1180;
	const pulse = 0.42 + Math.sin(frame * 0.19) * 0.08;
	const roll = -(frame * 2.2) % 96;

	return (
		<AbsoluteFill style={{background: COLORS.bg, overflow: "hidden"}}>
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(1100px 620px at 50% -10%, rgba(212,255,63,0.11), transparent 58%), radial-gradient(820px 620px at 94% 112%, rgba(255,68,56,0.075), transparent 62%), linear-gradient(180deg, #0c0d09 0%, #080906 40%, #050603 100%)",
				}}
			/>
			<AbsoluteFill
				style={{
					opacity: 0.22,
					backgroundImage:
						"linear-gradient(rgba(238,240,226,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(238,240,226,0.035) 1px, transparent 1px)",
					backgroundSize: "80px 80px",
					transform: `translate3d(${jitter(frame, 1.2)}px, ${roll / 8}px, 0)`,
				}}
			/>
			<AbsoluteFill
				style={{
					opacity: 0.11,
					background:
						"repeating-linear-gradient(0deg, transparent 0 3px, rgba(238,240,226,0.12) 3px 4px)",
					mixBlendMode: "screen",
				}}
			/>
			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					top: sweep - 80,
					height: 86,
					background:
						"linear-gradient(180deg, transparent, rgba(212,255,63,0.13), transparent)",
					opacity: pulse,
					filter: "blur(1px)",
				}}
			/>
			<SprocketStrip side="left" frame={frame} />
			<SprocketStrip side="right" frame={frame} />
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,0.58) 100%)",
				}}
			/>
			<GrainLayer frame={frame} />
		</AbsoluteFill>
	);
};

const SprocketStrip: React.FC<{side: "left" | "right"; frame: number}> = ({
	side,
	frame,
}) => (
	<div
		style={{
			position: "absolute",
			top: -60,
			bottom: -60,
			[side]: 24,
			width: 34,
			opacity: 0.32,
			transform: `translateY(${-(frame * 2.4) % 84}px)`,
		}}
	>
		{Array.from({length: 16}, (_, i) => (
			<div
				key={i}
				style={{
					width: 20,
					height: 46,
					margin: "20px auto",
					border: `1px solid ${COLORS.lineStrong}`,
					borderRadius: 6,
					background: "rgba(5,6,3,0.65)",
					boxShadow: "inset 0 0 14px rgba(0,0,0,0.65)",
				}}
			/>
		))}
	</div>
);

const GrainLayer: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill
		style={{
			opacity: 0.065 + Math.sin(frame * 1.7) * 0.012,
			mixBlendMode: "screen",
		}}
	>
		{Array.from({length: 150}, (_, i) => {
			const x = (i * 137 + (frame % 5) * 43) % 1920;
			const y = (i * 89 + (frame % 7) * 31) % 1080;
			const size = 1 + (i % 3);
			return (
				<div
					key={i}
					style={{
						position: "absolute",
						left: x,
						top: y,
						width: size,
						height: size,
						background: i % 4 === 0 ? COLORS.accent : COLORS.ink,
						opacity: 0.18 + ((i * 17) % 10) / 50,
					}}
				/>
			);
		})}
	</AbsoluteFill>
);

const HeaderHud: React.FC<{frame: number}> = ({frame}) => {
	const y = byFrame(frame, [0, 14], [-44, 0], easeBack);
	const recOn = frame % 28 < 16;

	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				height: 78,
				display: "flex",
				alignItems: "center",
				gap: 30,
				padding: "0 88px",
				borderBottom: `1px solid ${COLORS.line}`,
				background: "rgba(5,6,3,0.52)",
				backdropFilter: "blur(14px)",
				transform: `translateY(${y}px)`,
				zIndex: 30,
			}}
		>
			<div style={{display: "flex", alignItems: "baseline", gap: 12}}>
				<span
					style={{
						...sans,
						color: COLORS.ink,
						fontSize: 24,
						fontWeight: 850,
						letterSpacing: -0.6,
					}}
				>
					CODEO
				</span>
				<span
					style={{
						...mono,
						background: COLORS.accent,
						color: COLORS.bg2,
						fontWeight: 700,
						fontSize: 13,
						letterSpacing: 2.3,
						padding: "5px 8px",
						borderRadius: 3,
						transform: `rotate(${Math.sin(frame * 0.08) * 1.4}deg)`,
					}}
				>
					BENCH
				</span>
			</div>
			<div
				style={{
					...mono,
					marginLeft: "auto",
					display: "flex",
					alignItems: "center",
					gap: 28,
					color: COLORS.dim,
					fontSize: 13,
					letterSpacing: 2,
					textTransform: "uppercase",
				}}
			>
				<span>gallery</span>
				<span>about</span>
				<span style={{color: COLORS.ink}}>Remotion 4.0.475</span>
				<span style={{display: "inline-flex", alignItems: "center", gap: 8}}>
					<span
						style={{
							width: 8,
							height: 8,
							borderRadius: 999,
							background: COLORS.rec,
							opacity: recOn ? 1 : 0.28,
						}}
					/>
					rec
				</span>
			</div>
		</div>
	);
};

const OpeningChapter: React.FC<{frame: number}> = ({frame}) => {
	const opacity = windowOpacity(frame, 0, 43, 6);
	const camera = byFrame(frame, [0, 50], [1.11, 0.93], easeInOut);
	const titleIn = prog(frame, 2, 20, easeBack);
	const subtitleIn = prog(frame, 12, 30);
	const flash = frame < 4 ? 1 - frame / 4 : 0;

	return (
		<AbsoluteFill style={{opacity, zIndex: 5}}>
			<div
				style={{
					position: "absolute",
					inset: "108px 116px 84px",
					border: `1px solid ${COLORS.line}`,
					overflow: "hidden",
					transform: `scale(${camera}) translateY(${byFrame(frame, [0, 44], [18, -14])}px)`,
					transformOrigin: "50% 52%",
				}}
			>
				<HeroReel3D frame={frame} opacity={0.84} />
				<div
					style={{
						position: "absolute",
						left: 72,
						top: 70,
						...mono,
						color: COLORS.accent,
						fontSize: 14,
						letterSpacing: 4,
						textTransform: "uppercase",
						transform: `translateX(${(1 - subtitleIn) * -46}px)`,
						opacity: subtitleIn,
					}}
				>
					visual benchmark / ai-generated remotion videos
				</div>
				<div
					style={{
						position: "absolute",
						left: 70,
						right: 70,
						top: 186,
						...sans,
						fontWeight: 900,
						textTransform: "uppercase",
						letterSpacing: -7,
						lineHeight: 0.88,
						fontSize: 164,
						color: COLORS.ink,
						transform: `translate3d(${(1 - titleIn) * -190}px, ${jitter(frame, 2)}px, 0)`,
						filter: `drop-shadow(0 0 ${18 * titleIn}px rgba(212,255,63,0.14))`,
					}}
				>
					<div style={{overflow: "hidden"}}>
						<span
							style={{
								display: "block",
								transform: `translateY(${(1 - titleIn) * 140}px)`,
							}}
						>
							Remotion
						</span>
					</div>
					<div
						style={{
							overflow: "hidden",
							color: "transparent",
							WebkitTextStroke: `3px ${COLORS.accent}`,
							textShadow: "0 0 28px rgba(212,255,63,0.16)",
						}}
					>
						<span
							style={{
								display: "block",
								transform: `translateX(${(1 - titleIn) * 220}px)`,
							}}
						>
							Benchmark
						</span>
					</div>
				</div>
				<div
					style={{
						position: "absolute",
						left: 78,
						bottom: 64,
						width: 680,
						...sans,
						color: COLORS.dim,
						fontSize: 28,
						lineHeight: 1.42,
						opacity: subtitleIn,
						transform: `translateY(${(1 - subtitleIn) * 32}px)`,
					}}
				>
					Same prompt. Same pinned template. Rendered untouched for humans to
					watch and compare.
				</div>
				<div
					style={{
						position: "absolute",
						right: 70,
						bottom: 70,
						...mono,
						color: COLORS.accent,
						fontSize: 16,
						letterSpacing: 3,
						textTransform: "uppercase",
					}}
				>
					14 entries / v1
				</div>
			</div>
			<div
				style={{
					position: "absolute",
					inset: 0,
					background: COLORS.ink,
					opacity: flash,
					mixBlendMode: "screen",
				}}
			/>
		</AbsoluteFill>
	);
};

const PromptChapter: React.FC<{frame: number}> = ({frame}) => {
	const opacity = windowOpacity(frame, 31, 80, 8);
	const local = frame - 31;
	const wipe = prog(frame, 34, 48, easeInOut);
	const type = prog(frame, 42, 72, easeInOut);
	const slate = prog(frame, 48, 68, easeBack);

	return (
		<AbsoluteFill style={{opacity, zIndex: 8}}>
			<div
				style={{
					position: "absolute",
					inset: "118px 94px 80px",
					display: "grid",
					gridTemplateColumns: "0.92fr 1.08fr",
					gap: 34,
					alignItems: "center",
					transform: `translateX(${byFrame(frame, [31, 51], [140, 0])}px)`,
				}}
			>
				<div>
					<KineticLine frame={frame} start={34} text="Same" size={144} />
					<KineticLine frame={frame} start={39} text="Prompt" size={150} outline />
					<div
						style={{
							...mono,
							marginTop: 24,
							color: COLORS.dim,
							fontSize: 18,
							letterSpacing: 2.6,
							textTransform: "uppercase",
							opacity: wipe,
						}}
					>
						canonical brief / no hints / no retries
					</div>
					<PromptBlock frame={frame} reveal={type} />
				</div>
				<div
					style={{
						position: "relative",
						height: 600,
						transform: `translateY(${(1 - slate) * 70}px) rotate(${(1 - slate) * -5}deg)`,
					}}
				>
					<ClapperSlate frame={frame} />
					<div
						style={{
							position: "absolute",
							left: 72,
							right: 28,
							bottom: 4,
							height: 3,
							background: `linear-gradient(90deg, ${COLORS.accent}, transparent)`,
							transform: `scaleX(${wipe})`,
							transformOrigin: "left",
						}}
					/>
				</div>
			</div>
			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					top: 760 + Math.sin(local * 0.22) * 22,
					height: 78,
					background:
						"linear-gradient(90deg, transparent, rgba(212,255,63,0.18), transparent)",
					transform: `skewY(-4deg) translateX(${byFrame(frame, [34, 90], [-320, 480], easeInOut)}px)`,
					opacity: 0.48,
				}}
			/>
		</AbsoluteFill>
	);
};

const KineticLine: React.FC<{
	frame: number;
	start: number;
	text: string;
	size: number;
	outline?: boolean;
}> = ({frame, start, text, size, outline}) => {
	const p = prog(frame, start, start + 15, easeBack);
	const skew = byFrame(frame, [start, start + 15], [-9, 0], easeOut);
	return (
		<div
			style={{
				overflow: "hidden",
				height: size * 0.93,
			}}
		>
			<div
				style={{
					...sans,
					fontSize: size,
					lineHeight: 0.88,
					fontWeight: 900,
					letterSpacing: -5,
					textTransform: "uppercase",
					color: outline ? "transparent" : COLORS.ink,
					WebkitTextStroke: outline ? `3px ${COLORS.accent}` : undefined,
					transform: `translateY(${(1 - p) * size}px) skewX(${skew}deg)`,
					filter: outline ? "drop-shadow(0 0 24px rgba(212,255,63,0.18))" : undefined,
				}}
			>
				{text}
			</div>
		</div>
	);
};

const PromptBlock: React.FC<{frame: number; reveal: number}> = ({frame, reveal}) => {
	const rows = [
		"create a trailer for the website",
		"highly animate it",
		"real trailer, best work",
	];
	return (
		<div
			style={{
				marginTop: 38,
				width: 680,
				border: `1px solid ${COLORS.lineStrong}`,
				background: "rgba(17,19,12,0.78)",
				boxShadow: "0 30px 80px rgba(0,0,0,0.42)",
				overflow: "hidden",
				transform: `translateY(${(1 - reveal) * 28}px)`,
				opacity: prog(frame, 42, 54),
			}}
		>
			<div
				style={{
					...mono,
					display: "flex",
					justifyContent: "space-between",
					padding: "13px 16px",
					borderBottom: `1px solid ${COLORS.line}`,
					color: COLORS.faint,
					fontSize: 12,
					letterSpacing: 2,
					textTransform: "uppercase",
				}}
			>
				<span>tasks/codeo-trailer.json</span>
				<span>{timecode(frame, 30)}</span>
			</div>
			<div style={{padding: "24px 22px 28px"}}>
				{rows.map((row, i) => {
					const p = prog(frame, 45 + i * 5, 59 + i * 5, easeInOut);
					return (
						<div
							key={row}
							style={{
								...mono,
								position: "relative",
								marginTop: i === 0 ? 0 : 15,
								color: COLORS.ink,
								fontSize: 23,
								letterSpacing: 0.4,
								clipPath: `inset(0 ${100 - p * 100}% 0 0)`,
							}}
						>
							<span style={{color: COLORS.accent}}>&gt; </span>
							{row}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const ClapperSlate: React.FC<{frame: number}> = ({frame}) => {
	const open = byFrame(frame, [48, 59], [-18, 0], easeBack);
	const rows = [
		["production", "Codeo Bench"],
		["benchmark", "v1"],
		["engine", "Remotion 4.0.475"],
		["entries", "14"],
		["result", "watch it"],
	];
	return (
		<div
			style={{
				position: "absolute",
				inset: "32px 24px 40px 42px",
				border: `1px solid ${COLORS.lineStrong}`,
				background: "rgba(17,19,12,0.92)",
				boxShadow: "0 34px 84px rgba(0,0,0,0.56)",
			}}
		>
			<div
				style={{
					height: 36,
					transformOrigin: "left bottom",
					transform: `rotate(${open}deg)`,
					background: `repeating-linear-gradient(-45deg, ${COLORS.accent} 0 24px, #090a06 24px 48px)`,
					borderBottom: `1px solid ${COLORS.lineStrong}`,
				}}
			/>
			<div style={{padding: "19px 27px 22px"}}>
				{rows.map(([label, value], i) => {
					const p = prog(frame, 55 + i * 3, 66 + i * 3);
					return (
						<div
							key={label}
							style={{
								display: "flex",
								justifyContent: "space-between",
								gap: 34,
								padding: "18px 0",
								borderBottom: i === rows.length - 1 ? "none" : `1px solid ${COLORS.line}`,
								opacity: p,
								transform: `translateX(${(1 - p) * 26}px)`,
							}}
						>
							<span
								style={{
									...mono,
									color: COLORS.faint,
									fontSize: 14,
									letterSpacing: 4,
									textTransform: "uppercase",
								}}
							>
								{label}
							</span>
							<span
								style={{
									...mono,
									color: i === 2 ? COLORS.accent : COLORS.ink,
									fontSize: 17,
									letterSpacing: 1.2,
									textTransform: "uppercase",
								}}
							>
								{value}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const GridChapter: React.FC<{frame: number}> = ({frame}) => {
	const opacity = windowOpacity(frame, 66, 129, 9);
	const pan = byFrame(frame, [66, 126], [210, -310], easeInOut);
	const scale = byFrame(frame, [66, 126], [0.9, 1.02], easeInOut);
	const titleP = prog(frame, 74, 92, easeBack);

	return (
		<AbsoluteFill style={{opacity, zIndex: 10}}>
			<div
				style={{
					position: "absolute",
					left: 95,
					right: 95,
					top: 116,
					height: 112,
				}}
			>
				<SpecStrip frame={frame} />
			</div>
			<div
				style={{
					position: "absolute",
					left: 110,
					top: 276,
					width: 610,
					zIndex: 6,
				}}
			>
				<div
					style={{
						...mono,
						color: COLORS.accent,
						fontSize: 14,
						letterSpacing: 4,
						textTransform: "uppercase",
						opacity: titleP,
					}}
				>
					the reel
				</div>
				<div
					style={{
						...sans,
						marginTop: 10,
						color: COLORS.ink,
						fontSize: 86,
						lineHeight: 0.96,
						fontWeight: 900,
						letterSpacing: -3,
						textTransform: "uppercase",
						transform: `translateY(${(1 - titleP) * 52}px)`,
						opacity: titleP,
					}}
				>
					No scores.
					<br />
					No rankings.
				</div>
				<div
					style={{
						...sans,
						marginTop: 24,
						color: COLORS.dim,
						fontSize: 28,
						lineHeight: 1.35,
						width: 520,
						opacity: prog(frame, 91, 108),
					}}
				>
					Every card is one model's take on the same assignment. Broken renders
					do not disappear.
				</div>
			</div>
			<div
				style={{
					position: "absolute",
					left: 740,
					top: 258,
					width: 1350,
					height: 590,
					perspective: 1200,
					transform: `translateX(${pan}px) scale(${scale})`,
				}}
			>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(3, 390px)",
						gap: 28,
						transformStyle: "preserve-3d",
						transform: `rotateY(${byFrame(frame, [66, 126], [-14, 8], easeInOut)}deg) rotateX(5deg)`,
					}}
				>
					{CARDS.map((card, i) => (
						<VideoCardMini key={`${card.task}-${i}`} frame={frame} index={i} card={card} />
					))}
				</div>
			</div>
			<div
				style={{
					position: "absolute",
					left: 112,
					right: 112,
					bottom: 74,
					height: 1,
					background:
						"repeating-linear-gradient(90deg, rgba(238,240,226,0.28) 0 12px, transparent 12px 21px)",
				}}
			/>
		</AbsoluteFill>
	);
};

const SpecStrip: React.FC<{frame: number}> = ({frame}) => {
	const items = [
		["Entries", "14"],
		["Models", "03"],
		["Tasks", "05"],
		["Benchmark", "v1"],
		["Remotion", "4.0.475"],
	];
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(5, 1fr)",
				height: "100%",
				border: `1px solid ${COLORS.line}`,
				background: COLORS.line,
				gap: 1,
				boxShadow: "0 24px 64px rgba(0,0,0,0.36)",
			}}
		>
			{items.map(([label, value], i) => {
				const p = prog(frame, 67 + i * 3, 81 + i * 3, easeBack);
				return (
					<div
						key={label}
						style={{
							background: "rgba(10,11,7,0.92)",
							padding: "21px 24px",
							transform: `translateY(${(1 - p) * 32}px)`,
							opacity: p,
						}}
					>
						<div
							style={{
								...mono,
								color: COLORS.faint,
								fontSize: 13,
								letterSpacing: 4,
								textTransform: "uppercase",
							}}
						>
							{label}
						</div>
						<div
							style={{
								...mono,
								color: label === "Remotion" ? COLORS.accent : COLORS.ink,
								fontSize: 25,
								marginTop: 12,
								letterSpacing: 1.2,
							}}
						>
							{value}
						</div>
					</div>
				);
			})}
		</div>
	);
};

const VideoCardMini: React.FC<{
	frame: number;
	index: number;
	card: {
		task: string;
		model: string;
		template: string;
		status: string;
		poster: string | null;
	};
}> = ({frame, index, card}) => {
	const p = prog(frame, 72 + index * 3, 90 + index * 3, easeBack);
	const hover = prog(frame, 88 + index * 2, 103 + index * 2, easeInOut);
	const pending = card.status === "pending";
	const lift = Math.sin((frame + index * 9) * 0.09) * 7;

	return (
		<div
			style={{
				width: 390,
				height: 315,
				border: `1px solid ${hover > 0.5 ? "rgba(212,255,63,0.44)" : COLORS.line}`,
				background: COLORS.raised,
				boxShadow:
					hover > 0.5
						? "0 34px 76px rgba(0,0,0,0.58), 0 0 0 1px rgba(212,255,63,0.12)"
						: "0 20px 42px rgba(0,0,0,0.36)",
				overflow: "hidden",
				transform: `translate3d(0, ${(1 - p) * 96 + lift - hover * 10}px, ${index % 2 === 0 ? 60 : -20}px) rotateZ(${(1 - p) * -3}deg)`,
				opacity: p,
			}}
		>
			<div
				style={{
					position: "relative",
					width: "100%",
					height: 219,
					background: "#000",
					overflow: "hidden",
				}}
			>
				{card.poster ? (
					<Img
						src={card.poster}
						style={{
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
							filter: "grayscale(0.28) brightness(0.76) contrast(1.08)",
							transform: `scale(${1.02 + hover * 0.055})`,
						}}
					/>
				) : (
					<SmpteBars />
				)}
				<div
					style={{
						position: "absolute",
						inset: 0,
						background:
							"linear-gradient(180deg, rgba(212,255,63,0.08), transparent 34%, rgba(0,0,0,0.64))",
					}}
				/>
				<CornerBrackets opacity={hover} />
				<div
					style={{
						position: "absolute",
						left: 16,
						right: 16,
						bottom: 14,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						...mono,
						fontSize: 12,
						letterSpacing: 2,
					}}
				>
					<span
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 7,
							color: COLORS.ink,
							opacity: 0.94,
							textTransform: "uppercase",
						}}
					>
						<span
							style={{
								width: 7,
								height: 7,
								borderRadius: 999,
								background: pending ? COLORS.faint : COLORS.rec,
								opacity: pending ? 0.7 : frame % 22 < 13 ? 1 : 0.32,
							}}
						/>
						{pending ? "not rendered" : "preview"}
					</span>
					<span style={{color: COLORS.accent}}>{timecode(frame + index * 11, 30)}</span>
				</div>
			</div>
			<div
				style={{
					padding: "17px 18px 18px",
					borderTop: `1px solid ${COLORS.line}`,
				}}
			>
				<div
					style={{
						...sans,
						color: COLORS.ink,
						fontSize: 22,
						fontWeight: 760,
						letterSpacing: -0.3,
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					{card.task}
				</div>
				<div
					style={{
						...mono,
						display: "flex",
						alignItems: "center",
						gap: 12,
						marginTop: 12,
						color: COLORS.dim,
						fontSize: 11,
						letterSpacing: 1.4,
						textTransform: "uppercase",
					}}
				>
					<span>{card.model}</span>
					<span
						style={{
							marginLeft: "auto",
							border: `1px solid ${
								card.template === "skills" ? "rgba(212,255,63,0.44)" : COLORS.lineStrong
							}`,
							color: card.template === "skills" ? COLORS.accent : COLORS.dim,
							background: card.template === "skills" ? COLORS.accentSoft : "transparent",
							padding: "4px 7px",
							borderRadius: 3,
						}}
					>
						{card.template}
					</span>
				</div>
			</div>
		</div>
	);
};

const CornerBrackets: React.FC<{opacity: number}> = ({opacity}) => (
	<>
		<div
			style={{
				position: "absolute",
				top: 14,
				left: 14,
				width: 24,
				height: 24,
				borderTop: `2px solid ${COLORS.accent}`,
				borderLeft: `2px solid ${COLORS.accent}`,
				opacity,
				transform: `translate(${(1 - opacity) * 8}px, ${(1 - opacity) * 8}px)`,
			}}
		/>
		<div
			style={{
				position: "absolute",
				right: 14,
				bottom: 14,
				width: 24,
				height: 24,
				borderRight: `2px solid ${COLORS.accent}`,
				borderBottom: `2px solid ${COLORS.accent}`,
				opacity,
				transform: `translate(${(1 - opacity) * -8}px, ${(1 - opacity) * -8}px)`,
			}}
		/>
	</>
);

const SmpteBars: React.FC = () => {
	const bars = ["#a8a8a0", "#aaa83e", "#3ba8a4", "#3ca83e", "#a43ca4", "#a33b3b", "#2f2fa6"];
	return (
		<div style={{position: "absolute", inset: 0, display: "flex", filter: "saturate(0.72) brightness(0.74)"}}>
			{bars.map((color) => (
				<div key={color} style={{flex: 1, background: color}} />
			))}
			<div
				style={{
					position: "absolute",
					inset: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "rgba(5,6,3,0.48)",
					...mono,
					color: COLORS.ink,
					fontSize: 18,
					letterSpacing: 8,
					textTransform: "uppercase",
				}}
			>
				pending
			</div>
		</div>
	);
};

const FinalChapter: React.FC<{frame: number}> = ({frame}) => {
	const opacity = byFrame(frame, [112, 126], [0, 1], easeInOut);
	const final = prog(frame, 124, 144, easeBack);
	const close = byFrame(frame, [142, 150], [0, 1], easeInOut);
	const scale = byFrame(frame, [112, 150], [1.18, 0.98], easeInOut);

	return (
		<AbsoluteFill style={{opacity, zIndex: 18}}>
			<HeroReel3D frame={frame + 60} opacity={byFrame(frame, [112, 136], [0.86, 0.28])} finalMode />
			<div
				style={{
					position: "absolute",
					inset: "190px 110px 112px",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					textAlign: "center",
					transform: `scale(${scale})`,
				}}
			>
				<div
					style={{
						...mono,
						color: COLORS.accent,
						fontSize: 15,
						letterSpacing: 5,
						textTransform: "uppercase",
						opacity: prog(frame, 120, 133),
						transform: `translateY(${byFrame(frame, [120, 133], [26, 0])}px)`,
					}}
				>
					press play and judge for yourself
				</div>
				<div
					style={{
						marginTop: 22,
						...sans,
						color: COLORS.ink,
						fontWeight: 930,
						textTransform: "uppercase",
						letterSpacing: -8,
						fontSize: 148,
						lineHeight: 0.9,
						transform: `translateY(${(1 - final) * 74}px)`,
						opacity: final,
					}}
				>
					Watch.
					<br />
					Compare.
				</div>
				<div
					style={{
						marginTop: 28,
						display: "flex",
						alignItems: "baseline",
						gap: 18,
						transform: `translateY(${(1 - final) * 38}px)`,
						opacity: final,
					}}
				>
					<span
						style={{
							...sans,
							color: COLORS.ink,
							fontSize: 48,
							fontWeight: 880,
							letterSpacing: -1.2,
						}}
					>
						CODEO
					</span>
					<span
						style={{
							...mono,
							background: COLORS.accent,
							color: COLORS.bg2,
							fontWeight: 800,
							fontSize: 22,
							letterSpacing: 4,
							padding: "8px 13px",
							borderRadius: 3,
						}}
					>
						BENCH
					</span>
				</div>
				<div
					style={{
						marginTop: 28,
						display: "grid",
						gridTemplateColumns: "repeat(3, auto)",
						gap: 20,
						...mono,
						color: COLORS.dim,
						fontSize: 14,
						letterSpacing: 3,
						textTransform: "uppercase",
						opacity: prog(frame, 132, 145),
					}}
				>
					<span>same prompt</span>
					<span style={{color: COLORS.faint}}>/</span>
					<span>untouched renders</span>
				</div>
			</div>
			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					height: `${close * 50}%`,
					background: COLORS.bg,
				}}
			/>
			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 0,
					height: `${close * 50}%`,
					background: COLORS.bg,
				}}
			/>
		</AbsoluteFill>
	);
};

const HeroReel3D: React.FC<{
	frame: number;
	opacity: number;
	finalMode?: boolean;
}> = ({frame, opacity, finalMode}) => {
	const panelCount = 12;
	const spin = finalMode
		? byFrame(frame, [112, 150], [-40, -236], easeInOut)
		: -frame * 2.55;
	const tiltX = finalMode ? -8 : -13 + Math.sin(frame * 0.035) * 2;
	const tiltY = Math.sin(frame * 0.025) * 8;
	const radius = finalMode ? 510 : 455;

	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				perspective: 1500,
				opacity,
				pointerEvents: "none",
			}}
		>
			<div
				style={{
					position: "relative",
					width: 330,
					height: 186,
					transformStyle: "preserve-3d",
					transform: `scale(${finalMode ? 1.38 : 1.12}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
				}}
			>
				<div
					style={{
						position: "absolute",
						inset: "-68% -54%",
						transform: "translateZ(0)",
						backdropFilter: "blur(7px)",
						WebkitMaskImage:
							"radial-gradient(ellipse 60% 80% at 50% 50%, black 30%, transparent 76%)",
						maskImage:
							"radial-gradient(ellipse 60% 80% at 50% 50%, black 30%, transparent 76%)",
					}}
				/>
				{Array.from({length: panelCount}, (_, i) => {
					const angle = (360 / panelCount) * i + spin;
					const poster = i % 2 === 0 ? POSTERS[(i / 2) % POSTERS.length] : null;
					const frontness = (Math.cos((angle * Math.PI) / 180) + 1) / 2;
					return (
						<div
							key={i}
							style={{
								position: "absolute",
								inset: 0,
								border: `1px solid rgba(238,240,226,${0.1 + frontness * 0.1})`,
								borderRadius: 8,
								overflow: "hidden",
								background: "linear-gradient(160deg, #171a10, #090a06)",
								boxShadow:
									"0 0 0 1px rgba(0,0,0,0.55), inset 0 0 24px rgba(0,0,0,0.55)",
								transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
								backfaceVisibility: "hidden",
							}}
						>
							{poster ? (
								<Img
									src={poster}
									style={{
										position: "absolute",
										inset: 0,
										width: "100%",
										height: "100%",
										objectFit: "cover",
										opacity: 0.82,
										filter: "grayscale(0.42) brightness(0.7) contrast(1.06)",
									}}
								/>
							) : (
								<div
									style={{
										position: "absolute",
										inset: 0,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										...mono,
										color: "rgba(238,240,226,0.24)",
										fontSize: 18,
										letterSpacing: 8,
										background:
											"repeating-linear-gradient(0deg, transparent 0 4px, rgba(238,240,226,0.04) 4px 5px), linear-gradient(160deg, #14170e, #090a06)",
									}}
								>
									{String(i + 1).padStart(2, "0")}
								</div>
							)}
							<div
								style={{
									position: "absolute",
									inset: 0,
									background:
										"linear-gradient(180deg, rgba(212,255,63,0.1), transparent 36%), linear-gradient(0deg, rgba(5,6,3,0.58), transparent 52%)",
								}}
							/>
							<div
								style={{
									position: "absolute",
									left: 12,
									right: 12,
									bottom: 10,
									display: "flex",
									justifyContent: "space-between",
									...mono,
									color: COLORS.dim,
									fontSize: 11,
									letterSpacing: 2,
									textTransform: "uppercase",
								}}
							>
								<span>fr {String(i + 1).padStart(2, "0")}</span>
								<span>30fps</span>
							</div>
						</div>
					);
				})}
			</div>
			<div
				style={{
					position: "absolute",
					left: "50%",
					bottom: finalMode ? 250 : 188,
					width: finalMode ? 720 : 560,
					height: 64,
					transform: "translateX(-50%)",
					background: "radial-gradient(ellipse, rgba(212,255,63,0.1), transparent 70%)",
					filter: "blur(9px)",
				}}
			/>
		</div>
	);
};

const ProtocolTicker: React.FC<{frame: number}> = ({frame}) => {
	const x = -(frame * 5.1) % 670;
	return (
		<div
			style={{
				position: "absolute",
				left: 0,
				right: 0,
				bottom: 0,
				height: 52,
				borderTop: `1px solid ${COLORS.line}`,
				background: "rgba(5,6,3,0.78)",
				overflow: "hidden",
				zIndex: 35,
			}}
		>
			<div
				style={{
					...mono,
					display: "flex",
					alignItems: "center",
					height: "100%",
					gap: 30,
					color: COLORS.dim,
					fontSize: 13,
					letterSpacing: 2.4,
					textTransform: "uppercase",
					whiteSpace: "nowrap",
					transform: `translateX(${x}px)`,
				}}
			>
				{Array.from({length: 4}, (_, repeat) =>
					PROTOCOL_ROWS.map(([n, label]) => (
						<span key={`${repeat}-${n}`} style={{display: "inline-flex", gap: 12}}>
							<span style={{color: COLORS.accent}}>{n}</span>
							<span>{label}</span>
							<span style={{color: COLORS.faint}}>---</span>
						</span>
					)),
				)}
			</div>
		</div>
	);
};

const CutFlash: React.FC<{frame: number}> = ({frame}) => {
	const flashes = [31, 66, 112, 145];
	const amount = Math.max(
		...flashes.map((f) => Math.max(0, 1 - Math.abs(frame - f) / 4)),
	);
	return (
		<AbsoluteFill
			style={{
				background: amount > 0.62 ? COLORS.ink : COLORS.accent,
				opacity: amount * 0.32,
				mixBlendMode: "screen",
				zIndex: 50,
				pointerEvents: "none",
			}}
		/>
	);
};

export const HelloWorld: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg, overflow: "hidden", ...sans}}>
			<FilmBackground frame={frame} />
			<HeaderHud frame={frame} />
			<OpeningChapter frame={frame} />
			<PromptChapter frame={frame} />
			<GridChapter frame={frame} />
			<FinalChapter frame={frame} />
			<ProtocolTicker frame={frame} />
			<div
				style={{
					position: "absolute",
					left: 86,
					bottom: 68,
					...mono,
					zIndex: 36,
					color: COLORS.faint,
					fontSize: 13,
					letterSpacing: 2,
				}}
			>
				{timecode(frame, fps)}
			</div>
			<CutFlash frame={frame} />
		</AbsoluteFill>
	);
};
