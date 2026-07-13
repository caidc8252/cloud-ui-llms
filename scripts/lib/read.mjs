import { readFile as fsReadFile } from "node:fs/promises";

/**
 * Read a text file with its line endings normalised.
 *
 * On a Windows checkout git hands these files back with CRLF, and that quietly
 * destroys the parsing: in a JS regex `.` does not match `\r` (it is a line
 * terminator) and a non-multiline `$` demands the true end of the string — so
 * `/^##\s+(.+)$/` simply fails on "## Components\r", every section comes back
 * empty, and the build dies. The heading scan behind the on-this-page rail fails
 * the same way but *silently*: the rail just comes out empty.
 *
 * Normalising once, here, is the fix — every parser downstream only sees \n.
 */
export const readText = async (path) =>
  (await fsReadFile(path, "utf8"))
    .replace(/^﻿/, "")
    .replace(/\r\n?/g, "\n");

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** GitHub-style heading slug, so `spacing.html#sizing` lands where the md said it would. */
export const slug = (text) =>
  text
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

/**
 * Heading ids must be unique within a page. Keep the first GitHub-style slug as
 * written and suffix later collisions, including collisions with an already
 * suffixed heading ("Example", "Example", "Example 1").
 */
export function createSlugger() {
  const used = new Set();
  const nextSuffix = new Map();

  return (text) => {
    const base = slug(text);
    let id = base;
    let suffix = nextSuffix.get(base) ?? 1;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    nextSuffix.set(base, suffix);
    return id;
  };
}
