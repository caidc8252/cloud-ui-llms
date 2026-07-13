import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Is @cloud/ui here?
 *
 * It is a private package and this repo is public, so the tarball is never
 * committed — you vendor it yourself (`npm run preview:install`). That makes the
 * live previews an *enhancement*, not a requirement: without the package the
 * docs site still builds, in full, and every example keeps its code block.
 *
 * Checked by looking on disk rather than with require.resolve, because the
 * package's own `exports` map does not expose "./package.json" — Node refuses to
 * resolve it (ERR_PACKAGE_PATH_NOT_EXPORTED) and the check reports "absent" for
 * a package that is sitting right there.
 *
 * The answer is honoured in three places: the markdown must not emit a mount
 * point, the layout must not reference the assets, and the assets must not be
 * built. Get any one of them wrong and the page asks the browser for a script
 * that does not exist.
 */
export const previewsAvailable = existsSync(
  join(process.cwd(), "node_modules", "@cloud", "ui", "package.json"),
);
