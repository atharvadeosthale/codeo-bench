export type BenchEntry = {
	id: string;
	slug: string;
	model: { id: string; name: string };
	task: { id: string; title: string };
	template: string;
	composition: string;
	benchmarkVersion: string;
	date: string;
	prompt: string | null;
	status: "pending" | "rendered" | "published" | "failed";
	video: string | null;
	poster: string | null;
};

export type Manifest = {
	version: string;
	remotionVersion: string;
	entries: BenchEntry[];
};
