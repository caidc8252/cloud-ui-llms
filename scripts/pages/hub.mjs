import { basename } from "node:path";
import { render, renderInline, renderFlat } from "../lib/markdown.mjs";
import { esc } from "../lib/read.mjs";
import { page } from "./layout.mjs";

const componentKinds = [
  [/chart|sparkline/i, "chart"],
  [/modal|dialog|sheet|drawer|popover|hover card|tooltip|context menu|dropdown|command/i, "overlay"],
  [/input|field|select|combobox|checkbox|radio|switch|slider|stepper|textarea|date|time|calendar|toggle/i, "form"],
  [/table|key value|stat card|status card|timeline|log console/i, "data"],
  [/breadcrumb|navigation|sidebar|pagination|tabs|menubar|app header|page header/i, "navigation"],
  [/alert|badge|progress|spinner|skeleton|toast|empty|load more/i, "feedback"],
  [/filter|applied filters|summary bar|virtual table|scroll area/i, "collection"],
  [/avatar|object tile/i, "identity"],
  [/button|action footer/i, "action"],
  [/layout|page body|card strip|card$/i, "layout"],
];

const specimenLabels = {
  action: "Action",
  chart: "Data visual",
  collection: "Collection",
  data: "Data display",
  feedback: "Feedback",
  form: "Input",
  identity: "Identity",
  layout: "Layout",
  navigation: "Navigation",
  overlay: "Overlay",
  structure: "Structure",
  workflow: "Task flow",
};

const patternKinds = [
  [/create wizard/i, "workflow", "Task flow"],
  [/delete/i, "overlay", "Safety flow"],
  [/list page|advanced filtering/i, "collection", "Collection flow"],
  [/create form|edit resource/i, "form", "Form flow"],
  [/unsaved changes/i, "overlay", "Exit guard"],
  [/detail page/i, "layout", "Page pattern"],
  [/data visualization/i, "chart", "Data pattern"],
  [/action weight|interactive surfaces/i, "action", "Interaction"],
  [/empty states|errors and validation/i, "feedback", "Recovery"],
  [/permission gating|side navigation/i, "navigation", "Access flow"],
  [/timestamps/i, "data", "Data display"],
];

const foundationKinds = [
  [/design tokens/i, "tokens", "Token system"],
  [/colors/i, "palette", "Visual system"],
  [/spacing/i, "spacing", "Visual rhythm"],
  [/typography/i, "type", "Type system"],
  [/elevation/i, "elevation", "Depth system"],
  [/theming/i, "theme", "Visual modes"],
  [/motion/i, "motion", "Behavior"],
  [/responsive layout/i, "responsive", "Key principle"],
  [/iconography/i, "icons", "Visual language"],
  [/accessibility/i, "accessibility", "Key principle"],
  [/layout/i, "layout", "Composition"],
];

const foundationSvg = (body) =>
  `<svg class="foundation-svg" viewBox="0 0 220 88" focusable="false">${body}</svg>`;

function componentKind(name) {
  return componentKinds.find(([pattern]) => pattern.test(name))?.[1] ?? "structure";
}

function specimen(kind) {
  switch (kind) {
    case "action":
      return `<span class="mini-button mini-button--primary">Continue</span><span class="mini-button">Cancel</span>`;
    case "chart":
      return `<svg class="mini-chart" viewBox="0 0 220 88" focusable="false">
        <path class="mini-chart-grid" d="M8 16.5H212M8 44.5H212M8 72.5H212" />
        <path class="mini-chart-area" d="M8 70L43 54L78 61L113 29L148 40L183 17L212 24V80H8Z" />
        <path class="mini-chart-line" d="M8 70L43 54L78 61L113 29L148 40L183 17L212 24" />
      </svg>`;
    case "collection":
      return `<span class="mini-toolbar"><i></i><b></b></span><span class="mini-row"><i></i><b></b><em></em></span><span class="mini-row"><i></i><b></b><em></em></span><span class="mini-row"><i></i><b></b><em></em></span>`;
    case "data":
      return `<span class="mini-data-head"><i></i><b></b><em></em></span><span class="mini-data-row"><i></i><b></b><em></em></span><span class="mini-data-row"><i></i><b></b><em></em></span><span class="mini-data-row"><i></i><b></b><em></em></span>`;
    case "feedback":
      return `<span class="mini-alert"><i>!</i><b></b><em></em></span><span class="mini-toast"><i></i><b></b></span>`;
    case "form":
      return `<span class="mini-label"></span><span class="mini-field"><i>Choose an option</i><b>⌄</b></span><span class="mini-check"><i>✓</i><b></b></span>`;
    case "identity":
      return `<span class="mini-avatar">CU</span><span class="mini-identity-copy"><i></i><b></b><em></em></span>`;
    case "layout":
      return `<span class="mini-shell"><i></i><b></b><em></em><strong></strong></span>`;
    case "navigation":
      return `<span class="mini-nav"><i></i><b></b><em></em><strong></strong></span><span class="mini-page-lines"><i></i><b></b><em></em></span>`;
    case "overlay":
      return `<span class="mini-backdrop"><i></i><b></b></span><span class="mini-dialog"><i></i><b></b><em></em></span>`;
    case "workflow":
      return `<span class="mini-flow"><i>1</i><b></b><i>2</i><b></b><i>3</i></span>`;
    case "tokens":
      return foundationSvg(`<rect class="f-surface" x="6" y="31" width="48" height="27" rx="4"/><path class="f-line" d="M54 44.5H82M82 18V71M82 18H108M82 44.5H108M82 71H108"/><rect class="f-tint" x="108" y="6" width="54" height="24" rx="4"/><rect class="f-surface" x="108" y="33" width="78" height="24" rx="4"/><rect class="f-primary" x="108" y="60" width="104" height="24" rx="4"/>`);
    case "palette":
      return foundationSvg(`<rect class="f-primary" x="8" y="8" width="42" height="72" rx="5"/><rect class="f-tint" x="55" y="8" width="42" height="72" rx="5"/><rect class="f-muted" x="102" y="8" width="42" height="72" rx="5"/><rect class="f-surface" x="149" y="8" width="63" height="33" rx="5"/><rect class="f-ink" x="149" y="47" width="63" height="33" rx="5"/>`);
    case "spacing":
      return foundationSvg(`<path class="f-line" d="M9 14V76M9 45H211"/><rect class="f-primary" x="22" y="35" width="24" height="20" rx="3"/><rect class="f-tint" x="62" y="29" width="38" height="32" rx="3"/><rect class="f-muted" x="124" y="21" width="72" height="48" rx="3"/><path class="f-measure" d="M22 72H46M22 68V76M46 68V76M62 72H100M62 68V76M100 68V76"/>`);
    case "type":
      return foundationSvg(`<text class="f-type-xl" x="8" y="42">Aa</text><text class="f-type-md" x="87" y="25">Heading</text><rect class="f-muted" x="87" y="34" width="121" height="6" rx="3"/><rect class="f-muted" x="87" y="47" width="98" height="6" rx="3"/><text class="f-type-code" x="87" y="72">text-md · 14/20</text>`);
    case "elevation":
      return foundationSvg(`<rect class="f-shadow f-surface" x="18" y="34" width="72" height="45" rx="6"/><rect class="f-shadow f-surface" x="74" y="21" width="72" height="45" rx="6"/><rect class="f-shadow f-tint" x="130" y="8" width="72" height="45" rx="6"/>`);
    case "theme":
      return foundationSvg(`<rect class="f-surface" x="7" y="8" width="100" height="72" rx="6"/><circle class="f-primary" cx="34" cy="31" r="10"/><rect class="f-muted" x="21" y="51" width="72" height="6" rx="3"/><rect class="f-muted" x="21" y="63" width="48" height="6" rx="3"/><rect class="f-ink" x="113" y="8" width="100" height="72" rx="6"/><circle class="f-tint" cx="140" cy="31" r="10"/><rect class="f-dark-line" x="127" y="51" width="72" height="6" rx="3"/><rect class="f-dark-line" x="127" y="63" width="48" height="6" rx="3"/>`);
    case "motion":
      return foundationSvg(`<path class="f-motion-path" d="M12 68C46 68 55 18 101 18S158 68 208 68"/><circle class="f-muted" cx="12" cy="68" r="8"/><circle class="f-tint" cx="101" cy="18" r="8"/><circle class="f-primary" cx="208" cy="68" r="8"/><path class="f-measure" d="M22 80H198"/>`);
    case "responsive":
      return foundationSvg(`<rect class="f-surface" x="5" y="26" width="52" height="48" rx="4"/><rect class="f-muted" x="12" y="34" width="38" height="7" rx="2"/><rect class="f-tint" x="12" y="47" width="38" height="20" rx="2"/><rect class="f-surface" x="68" y="17" width="63" height="57" rx="4"/><rect class="f-muted" x="76" y="25" width="47" height="7" rx="2"/><rect class="f-tint" x="76" y="38" width="47" height="28" rx="2"/><rect class="f-surface" x="142" y="8" width="73" height="66" rx="4"/><rect class="f-muted" x="150" y="16" width="57" height="7" rx="2"/><rect class="f-tint" x="150" y="29" width="17" height="37" rx="2"/><rect class="f-primary" x="173" y="29" width="34" height="37" rx="2"/>`);
    case "icons":
      return foundationSvg(`<rect class="f-surface" x="8" y="14" width="54" height="60" rx="6"/><path class="f-icon" d="M25 45l9 9 14-20"/><rect class="f-surface" x="83" y="14" width="54" height="60" rx="6"/><path class="f-icon" d="M98 51l12-25 12 25M102 43h16"/><rect class="f-surface" x="158" y="14" width="54" height="60" rx="6"/><circle class="f-icon" cx="185" cy="40" r="11"/><path class="f-icon" d="M185 51v11"/>`);
    case "accessibility":
      return foundationSvg(`<rect class="f-focus" x="10" y="13" width="88" height="62" rx="8"/><rect class="f-surface" x="17" y="20" width="74" height="48" rx="5"/><circle class="f-primary" cx="38" cy="44" r="10"/><rect class="f-muted" x="55" y="35" width="25" height="6" rx="3"/><rect class="f-muted" x="55" y="48" width="18" height="6" rx="3"/><circle class="f-ink" cx="145" cy="44" r="29"/><text class="f-contrast" x="145" y="49">Aa</text><path class="f-line" d="M181 32l8 8 15-18"/>`);
    default:
      return `<span class="mini-accordion"><i></i><b>⌄</b></span><span class="mini-accordion"><i></i><b>⌄</b></span><span class="mini-accordion"><i></i><b>⌄</b></span>`;
  }
}

function componentSpecimen(name) {
  const kind = componentKind(name);
  return visualSpecimen(kind, specimenLabels[kind]);
}

function patternSpecimen(name) {
  const [, kind, label] = patternKinds.find(([pattern]) => pattern.test(name)) ?? [
    null,
    "workflow",
    "Guidance",
  ];
  return visualSpecimen(kind, label);
}

function foundationSpecimen(name) {
  const [, kind, label] = foundationKinds.find(([pattern]) => pattern.test(name));
  return visualSpecimen(kind, label);
}

function visualSpecimen(kind, label) {
  return `<div class="tile-visual tile-visual--${kind}" aria-hidden="true">
    <span class="specimen-label">${label}</span>
    <span class="specimen-canvas">${specimen(kind)}</span>
  </div>`;
}

/**
 * A section hub: what the section is, then a card per doc.
 *
 * The tiles ARE the section's llms.txt entries, and the text on them is the blurb
 * the index already carries — which is the decision rule itself ("use this when…,
 * otherwise use that"). So the hub tells you which doc you want before you open
 * any of them. Writing separate card copy would mean keeping the same sentence in
 * two places, and the two would drift.
 */
export function hubPage({ section, ownIndexMd }) {
  const componentHub = section.title === "Components";
  const patternHub = section.title === "Patterns";
  const foundationHub = section.title === "Foundations";
  const specimenHub = componentHub || patternHub || foundationHub;
  const countedHub = componentHub || patternHub;
  // A hand-written index.md in the directory contributes its prose (everything
  // above the first item heading). Its own list is dropped: the grid below is
  // generated and cannot fall out of date.
  const intro = ownIndexMd && !componentHub
    ? `<div class="intro">${render(
        ownIndexMd.replace(/^#\s+.*$/m, "").split(/^###\s+/m)[0].trim(),
      )}</div>`
    : "";

  const tiles = section.items
    .map((i) => {
      const href = basename(i.md).replace(/\.md$/, ".html");
      if (!specimenHub) {
        return `<a class="tile" href="${href}">
      <h3>${esc(i.name)}</h3>
      <p>${renderFlat(i.blurb)}</p>
    </a>`;
      }
      return `<a class="tile tile--specimen" href="${href}">
      ${componentHub ? componentSpecimen(i.name) : patternHub ? patternSpecimen(i.name) : foundationSpecimen(i.name)}
      <div class="tile-copy">
        <div class="tile-heading"><h3>${esc(i.name)}</h3><span class="tile-arrow" aria-hidden="true">→</span></div>
        <p>${renderFlat(i.blurb)}</p>
      </div>
    </a>`;
    })
    .join("");

  const body = `
<h1>${esc(section.title)}${countedHub ? ` <span class="hub-count">(${section.items.length})</span>` : ""}</h1>
<p class="lede">${renderInline(section.intro)}</p>
${intro}
<h2 id="browse">Browse ${esc(section.title.toLowerCase())}</h2>
<div class="tiles${specimenHub ? " tiles--specimens" : ""}">${tiles}</div>
`;

  return page({
    title: section.title,
    body,
    rel: `${section.dir}/index.md`,
    raw: "../llms.txt",
    section,
    tocHtml: "",
    onIndex: true,
  });
}
