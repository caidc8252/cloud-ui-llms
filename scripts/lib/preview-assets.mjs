import { spawnSync } from "node:child_process";
import { cp, mkdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * The two assets a live preview needs.
 *
 * ui.css   Tailwind, compiled against @cloud/ui's dist AND the markdown — the
 *          examples carry classes of their own (`className="size-4"` on an icon),
 *          and missing them renders a preview that is subtly wrong, which is
 *          worse than having none.
 *
 * playground.js  React + @cloud/ui + the runtime that evaluates the examples.
 *          Big (~1.7 MB raw), so the layout only loads it on a page that actually
 *          has a preview to mount.
 */
export async function buildPreviewAssets(out) {
  const css = spawnSync(
    "npx",
    [
      "@tailwindcss/cli",
      "-i", "playground/ui.css",
      "-o", join(out, "assets", "ui.css"),
      "--minify",
    ],
    { stdio: "pipe" },
  );
  if (css.status !== 0) {
    console.error(css.stderr?.toString());
    throw new Error("tailwind build failed");
  }

  const js = spawnSync(
    "npx",
    [
      "esbuild",
      "playground/runtime.jsx",
      "--bundle",
      "--format=esm",
      "--jsx=automatic",
      "--minify",
      `--outfile=${join(out, "assets", "playground.js")}`,
      "--log-level=error",
    ],
    { stdio: "pipe" },
  );
  if (js.status !== 0) {
    console.error(js.stderr?.toString());
    throw new Error("playground bundle failed");
  }

  /* Geist. The compiled CSS points at ./files/*.woff2, relative to itself, so the
   * fonts have to land beside it. Without them the previews fall back to a system
   * face — and a design system whose own docs render its components in the wrong
   * typeface is showing you something that is not the product. */
  const files = join(out, "assets", "files");
  await mkdir(files, { recursive: true });
  for (const pkg of ["geist", "geist-mono"]) {
    await cp(join("node_modules", `@fontsource-variable/${pkg}`, "files"), files, {
      recursive: true,
    });
  }
}
