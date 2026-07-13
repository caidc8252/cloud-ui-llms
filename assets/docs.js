/* Docs chrome: theme toggle, mobile nav, and the on-this-page rail's scrollspy.
 *
 * This used to live inside a template literal in the build script — 30 lines of
 * real runtime code that prettier and eslint could not see, written in ES5
 * because nobody could read it, and inlined into all 136 pages (184 KB of the
 * same bytes). It is a file now: linted, formatted, and fetched once.
 *
 * The theme *bootstrap* stays inline in <head>, and has to: it must run before
 * first paint or the page flashes the wrong theme. That is three lines, and the
 * only three that earn their place in the HTML.
 */

const root = document.documentElement;
const THEME_KEY = "cloud-ui-docs-theme";

document.querySelector(".theme")?.addEventListener("click", () => {
  const next =
    getComputedStyle(root).colorScheme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
});

const menu = document.querySelector(".menu");
const side = document.querySelector(".side");
menu?.addEventListener("click", () => {
  const open = side?.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(Boolean(open)));
});

/* Light up the section being read. `seen` is keyed by id rather than by element
 * so the first *visible* link wins in document order — an observer fires per
 * element, and without this the highlight jitters between neighbours. */
const links = [...document.querySelectorAll(".toc a")];
if (links.length) {
  const seen = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) seen.set(e.target.id, e.isIntersecting);
      const active = links.find((l) => seen.get(l.dataset.id));
      for (const l of links) l.classList.toggle("on", l === active);
    },
    { rootMargin: "-72px 0px -70% 0px" },
  );
  for (const l of links) {
    const el = document.getElementById(l.dataset.id);
    if (el) observer.observe(el);
  }
}
