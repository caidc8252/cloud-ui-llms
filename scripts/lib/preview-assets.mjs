import { spawnSync } from "node:child_process";
import { cp, mkdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);

/** Geist belongs to the docs shell as well as the live component previews. */
export async function buildFontAssets(out) {
  const files = join(out, "assets", "files");
  await mkdir(files, { recursive: true });
  for (const pkg of ["geist", "geist-mono"]) {
    const packageRoot = dirname(
      require.resolve(`@fontsource-variable/${pkg}`),
    );
    await cp(join(packageRoot, "files"), files, { recursive: true });
  }
}

/**
 * The assets a live preview needs.
 *
 * Neither tool is reached through `npx`. On Windows `npx` is `npx.cmd`, and
 * spawnSync without a shell cannot find it — the build died with
 *
 *     undefined
 *     Error: tailwind build failed
 *
 * because the process never started, so there was no stderr to print. Reaching
 * for `shell: true` would fix that and buy a quoting bug on the first path with
 * a space in it. So esbuild is called through its JS API, and Tailwind's CLI is
 * run as what it actually is: a .mjs file, handed to the node already running
 * this build. No PATH lookup, no shell, no platform.
 */
export async function buildPreviewAssets(out) {
  const assets = join(out, "assets");
  await mkdir(assets, { recursive: true });

  /* Tailwind, compiled against @cloud/ui's dist AND the markdown — the examples
   * carry classes of their own (`className="size-4"` on an icon), and missing
   * them renders a preview that is subtly wrong, which is worse than none. */
  /* @tailwindcss/cli is a bin-only package: its exports map declares exactly one
   * entry, "./package.json", and nothing else. Resolving the deep path directly
   * fails with ERR_PACKAGE_PATH_NOT_EXPORTED — the same wall @cloud/ui put up.
   * So resolve the one thing it does export, and read the bin out of it. This
   * also survives pnpm, where the package is not where you think it is. */
  const manifestPath = require.resolve("@tailwindcss/cli/package.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const bin = manifest.bin?.tailwindcss ?? manifest.bin;
  const tailwindCli = join(dirname(manifestPath), bin);
  const css = spawnSync(
    process.execPath,
    [
      tailwindCli,
      "-i",
      join("playground", "ui.css"),
      "-o",
      join(assets, "ui.css"),
      "--minify",
    ],
    { encoding: "utf8" },
  );
  if (css.error || css.status !== 0) {
    /* Say what actually went wrong. The first version printed the stderr of a
     * process that had never started — `undefined` — and told you nothing. */
    console.error(css.error?.message ?? css.stderr ?? "(no output)");
    throw new Error("tailwind build failed");
  }

  /* React + @cloud/ui + the code that evaluates the examples. Big, so the layout
   * loads it only on a page that has a preview to mount.
   *
   * esbuild is imported here rather than at the top of the file: this module is
   * loaded unconditionally by the build, and a static import would make the tool
   * a hard requirement of a docs site that is meant to build fine without any of
   * this. */
  const { build } = await import("esbuild");
  await build({
    entryPoints: [join("playground", "runtime.jsx")],
    bundle: true,
    format: "esm",
    jsx: "automatic",
    minify: true,
    outfile: join(assets, "playground.js"),
    logLevel: "error",
  });

}
