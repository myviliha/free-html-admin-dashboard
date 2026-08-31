#!/usr/bin/env node
/**
 * The one check this repository can have, and the one it needs.
 *
 * **There is no build here.** The nineteen pages are plain HTML with a stylesheet and three scripts
 * beside them, so there is nothing to compile and nothing a type checker could look at. What can go
 * wrong is a reference: a page linking a stylesheet that is not in the tree, an `<img>` pointing at a
 * product photograph that was renamed, or a control announcing a dialog that no longer exists. Every
 * one of those still opens in a browser and still deploys, and every one is invisible in a screenshot
 * of the page that is not broken.
 *
 * **The dangling-trigger case is why this is not just a link checker.** These pages come from a static
 * export of the React edition, where a closed dialog renders nothing: the export once contained 114
 * controls that announced a popup with no panel behind it. The panels are emitted now, and this is what
 * says so on every regeneration rather than once.
 *
 * **The title case is here because the generator got it wrong.** It derived each `<title>` from the
 * filename, so nineteen tabs read `basic-tables &middot; VUI` while the React and Next editions read
 * `Basic Tables &middot; VuiAdmin free`. That is invisible in a screenshot of the page and obvious in a
 * row of open tabs, and a regeneration would put it straight back.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pages = readdirSync(root).filter((f) => f.endsWith(".html"));

/** The title each page must carry, matching the React and Next editions exactly. */
const TITLES = {
  index: "VuiAdmin free",
  alerts: "Alerts",
  avatars: "Avatar",
  badge: "Badges",
  "bar-chart": "Bar Chart",
  "basic-tables": "Basic Tables",
  blank: "Blank Page",
  buttons: "Buttons",
  calendar: "Calendar",
  "error-404": "404 Error",
  "form-elements": "Form Elements",
  images: "Images",
  layouts: "Layouts",
  "line-chart": "Line Chart",
  modals: "Modals",
  profile: "User Profile",
  signin: "Sign In",
  signup: "Sign Up",
  videos: "Videos",
};

/** `404.html` is a copy of the not-found page under the name GitHub Pages serves. */
const titleKey = (page) => (page === "404.html" ? "error-404" : page.replace(/\.html$/, ""));

const problems = [];

// A tree with no pages would pass every assertion below.
if (pages.length < 19) problems.push(`only ${pages.length} page(s) found, expected at least 19`);

for (const page of pages) {
  const html = readFileSync(join(root, page), "utf8");

  // The title, and that it is not the filename.
  const key = titleKey(page);
  const expected = key === "index" ? TITLES.index : `${TITLES[key]} &middot; VuiAdmin free`;
  const found = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!(key in TITLES)) {
    problems.push(`${page}: no expected title for this page — add it to TITLES or remove the page`);
  } else if (found !== expected) {
    problems.push(`${page}: title is "${found}", expected "${expected}"`);
  }

  /**
   * A page that carries a control must load the script that makes it work.
   *
   * Both of these shipped broken. The dashboard's map host was an empty 150px div, because no map
   * library is part of the HTML edition; and its three tabs carried `role="tab"` with no handler
   * anywhere, so clicking them did nothing at all. Neither is visible in a screenshot of the page —
   * one looks like an empty panel and the other like a control nobody happened to click.
   */
  if (/data-vui-map/.test(html)) {
    for (const asset of ["vui-map.js", "vui-map.css"]) {
      if (!html.includes(asset)) problems.push(`${page}: has a map host but does not load ${asset}`);
    }
  }
  if (/role="tab"/.test(html) && !html.includes("vui-tabs.js")) {
    problems.push(`${page}: has role="tab" controls but does not load vui-tabs.js`);
  }

  // Exactly one selected tab per group, or the control paints two actives or none.
  for (const [, list] of html.matchAll(/<div[^>]*role="tablist"[^>]*>([\s\S]*?)<\/div>\s*(?=<div|<\/div)/g)) {
    const selected = (list.match(/aria-selected="true"/g) ?? []).length;
    const tabs = (list.match(/role="tab"/g) ?? []).length;
    if (tabs && selected !== 1) {
      problems.push(`${page}: a tablist has ${tabs} tab(s) and ${selected} selected, expected exactly 1`);
    }
  }

  // Something a search result can tell apart from the other eighteen.
  if (!/name="description"/.test(html)) problems.push(`${page}: has no meta description`);

  // The generator stamps a provenance comment, and it used to name a path in a monorepo this
  // repository is not part of.
  if (html.includes("apps/web/free-react")) {
    problems.push(`${page}: still names apps/web/free-react, a path that does not exist here`);
  }

  // Every local href and src resolves to a file that is actually here.
  for (const [, url] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    if (/^(?:https?:|mailto:|data:|\/\/)/.test(url)) continue;
    if (!existsSync(join(root, url.replace(/^\//, "")))) {
      problems.push(`${page}: references ${url}, which is not in the tree`);
    }
  }

  // Every control that says it opens something names an element that exists on the same page. A
  // dialog or a menu is markup here, not a component call, so a rename breaks the pair silently.
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, target] of html.matchAll(/data-vui-(?:open|menu|panel)="([^"]+)"/g)) {
    if (!ids.has(target)) problems.push(`${page}: a control opens "${target}", which is not on the page`);
  }
}

// The name GitHub Pages serves for an unmatched address. Without it a mistyped URL gets Pages' own
// page, which is not this product and says so.
if (!existsSync(join(root, "404.html"))) problems.push("404.html is missing");

// The stylesheet's own font files, which no page references directly.
const css = readFileSync(join(root, "vui.css"), "utf8");
for (const [, url] of css.matchAll(/url\(["']?\.?\/?([^)"']+)/g)) {
  if (!existsSync(join(root, url))) problems.push(`vui.css: references ${url}, which is not in the tree`);
}

if (problems.length) {
  console.error(`free-html: ${problems.length} problem(s)\n` + problems.map((p) => `  ${p}`).join("\n"));
  process.exit(1);
}

console.log(`free-html: ${pages.length} pages, every reference and every control target resolves`);
