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

/* ── Tabs ─────────────────────────────────────────────────────────────────────
 * A component doc is one page with five panels, not five pages. The tab bar is
 * derived from the document's own `## ` headings, so this only has to switch
 * what is visible and keep three things in step: the rail, the URL, and the
 * heading a deep link is asking for.
 */
const tabBar = document.querySelector(".tabs-bar");
if (tabBar) {
  const tabs = [...tabBar.querySelectorAll("[role=tab]")];
  const panelOf = (id) => document.getElementById(`panel-${id}`);
  const groupOf = (id) => document.querySelector(`.toc-group[data-for="${id}"]`);

  function show(id, { push = true } = {}) {
    if (!panelOf(id)) return false;
    for (const t of tabs) {
      const on = t.dataset.tab === id;
      t.setAttribute("aria-selected", String(on));
      panelOf(t.dataset.tab).hidden = !on;
      const g = groupOf(t.dataset.tab);
      if (g) g.hidden = !on || !g.children.length;
    }
    if (push) history.replaceState(null, "", `#${id}`);
    return true;
  }

  for (const t of tabs) {
    t.addEventListener("click", () => show(t.dataset.tab));
    /* Arrow keys move between tabs — the standard model, and the only way a
     * keyboard user gets past the first panel without tabbing through it. */
    t.addEventListener("keydown", (e) => {
      const i = tabs.indexOf(t);
      const next =
        e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
      if (next === null) return;
      e.preventDefault();
      const target = tabs[(next + tabs.length) % tabs.length];
      target.focus();
      show(target.dataset.tab);
    });
  }

  /* A deep link can name a tab (#features) or a heading inside one (#do). Either
   * has to open the right panel first — otherwise the browser scrolls to an
   * element that is `hidden`, which means it does nothing at all and the link
   * looks broken. */
  function openFor(hash) {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    if (show(id, { push: false })) return;
    const panel = document.getElementById(id)?.closest("[role=tabpanel]");
    if (panel) {
      show(panel.id.replace(/^panel-/, ""), { push: false });
      document.getElementById(id)?.scrollIntoView();
    }
  }
  openFor(location.hash);
  window.addEventListener("hashchange", () => openFor(location.hash));
}
