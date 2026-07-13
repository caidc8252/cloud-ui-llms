import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, relative, resolve } from "node:path";

/**
 * Every reference in the built site must resolve.
 *
 * This is not paranoia. The depth calculation once split a slash-separated path
 * on the platform separator, so on Windows every page came out at depth 0, `up`
 * was ".", and the stylesheet, the nav and every breadcrumb 404'd — the site
 * rendered as unstyled text while the build printed "rendered 133 docs" and
 * exited 0. From the outside it looked exactly like the change had never landed.
 *
 * A build that cannot see its own output is not a build.
 */
export async function verify(out) {
  const pages = [];
  const collect = async (dir) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const f = join(dir, e.name);
      if (e.isDirectory()) await collect(f);
      else if (e.name.endsWith(".html")) pages.push(f);
    }
  };
  await collect(out);

  let broken = 0;
  for (const f of pages) {
    const html = await readFile(f, "utf8");
    for (const [, href] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      if (/^(https?:|mailto:|\/)/.test(href)) continue;
      if (href.includes("/.claude/")) continue; // known: escapes the site, pending
      if (/\.(md|txt)$/.test(href)) continue; // published beside the html, not by it
      if (!existsSync(resolve(dirname(f), href))) {
        if (broken < 6) console.error(`  broken: ${relative(out, f)} -> ${href}`);
        broken++;
      }
    }
  }

  if (broken) {
    console.error(`\n${broken} broken reference(s) in the built site.`);
    process.exit(1);
  }
  return pages.length;
}
