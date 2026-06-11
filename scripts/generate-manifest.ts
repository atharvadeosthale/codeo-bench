import pc from "picocolors";
import { generateManifest, MANIFEST_PATH } from "./lib.ts";

const count = generateManifest();
console.log(
  `${pc.green("✓")} manifest written to ${pc.dim(MANIFEST_PATH)} (${count} ${count === 1 ? "entry" : "entries"})`,
);
