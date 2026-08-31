# VuiAdmin HTML — Free HTML Tailwind Admin Dashboard Template

VuiAdmin is a free and open-source admin dashboard template from [VILIHA](https://viliha.com).
Nineteen pages, MIT licensed, on the same design system as the paid editions — so what you evaluate
here is what you build with.

This is the **HTML** edition, and it is the plainest thing in the set: nineteen `.html` files, one
stylesheet, three small scripts. **No build step, no framework, no `npm install`.** Clone it and open
`index.html` in a browser, or drop the folder on any web server. That is the whole workflow.

It exists because plenty of projects are not a React project: a Django or Rails or Laravel app, a
static marketing site, a CMS theme, a page inside something older. The markup here is the same markup
the React edition renders, so you can lift a card or a table out of one of these files and paste it
where you need it.

## Overview

* Plain HTML5 — 19 pages
* `vui.css` — the compiled design system, 156KB, dark mode included
* `vui-pages.css` — the utilities the page markup needs and the package build never saw
* `vui.js` — the interactions: sidebar, dropdowns, modals, tabs, theme toggle
* `vui-charts.js`, `vui-calendar.js`, `vui-datetime.js` — loaded only by the pages that need them
* `vui-map.js`, `vui-tabs.js` — the dashboard's world map and its segmented control
* Outfit, self-hosted in `fonts/`

No CDN links, no external requests, nothing phoning home. Open it on a plane.

### Quick links

* [🚀 Live demo](https://html.viliha.com)
* [⚛️ React edition](https://github.com/myviliha/free-reactjs-admin-dashboard) — the same nineteen
  screens as a Vite SPA
* [▲ Next.js edition](https://github.com/myviliha/free-nextjs-admin-dashboard) — App Router
* [✨ VILIHA](https://viliha.com)
* [⚡ Pro](https://viliha.com) — the server-backed record workflow, more dashboards, more screens

## Getting started

Open `index.html`. That is genuinely it.

Some browsers restrict `file://` pages, so if a font or a chart does not appear, serve the folder over
HTTP instead — any static server will do:

```bash
git clone git@github.com:myviliha/free-html-admin-dashboard.git
cd free-html-admin-dashboard
npm start          # npx serve . on http://localhost:3000
```

There are no dependencies to install. `npm start` shells out to `serve` through `npx`; Python's
`python3 -m http.server 3000` works just as well.

### The one script

| Script     | What it does                                                        |
| ---------- | ------------------------------------------------------------------- |
| `npm start` | Serve the folder on port 3000                                       |
| `npm test`  | Check every reference and every control target resolves (no deps)   |

`npm test` is the only check this repository can have, and it is the one it needs. There is nothing to
compile, so what can go wrong is a reference: a page linking a stylesheet that is not in the tree, an
`<img>` pointing at a renamed photograph, or a button announcing a dialog that no longer exists. All
three still open in a browser, and all three are invisible in a screenshot of the page that works.

## The nineteen pages

| File                  | Page                                                    |
| --------------------- | ------------------------------------------------------- |
| `index.html`          | Ecommerce dashboard — metrics, charts, world map, orders |
| `calendar.html`       | Calendar with add, edit and delete                      |
| `profile.html`        | User profile, security and danger-zone cards            |
| `form-elements.html`  | The full input set                                      |
| `basic-tables.html`   | Five tables with search, filter and row actions         |
| `line-chart.html`     | Line charts                                             |
| `bar-chart.html`      | Bar charts                                              |
| `alerts.html`         | Alerts                                                  |
| `avatars.html`        | Avatars                                                 |
| `badge.html`          | Badges                                                  |
| `buttons.html`        | Buttons                                                 |
| `images.html`         | Responsive image grids                                  |
| `videos.html`         | Video embeds                                            |
| `modals.html`         | Four modals and four alert dialogs                      |
| `layouts.html`        | Six shell arrangements                                  |
| `blank.html`          | A blank page to start from                              |
| `signin.html`         | Sign in, split-screen                                   |
| `signup.html`         | Sign up, split-screen                                   |
| `error-404.html`      | The not-found screen                                    |

`404.html` is a copy of `error-404.html` under the name GitHub Pages serves for an unmatched address.

## How the interactions work without a framework

Everything is driven by `data-` attributes that `vui.js` reads once on load. There is no component
model to learn and no state to wire:

```html
<button data-vui-open="modal-default">Open Modal</button>
...
<dialog id="modal-default"> ... </dialog>
```

The same shape covers dropdowns (`data-vui-menu`), the collapsible sidebar (`data-vui-collapse`),
dismissible alerts (`data-vui-dismiss`) and the theme switch (`data-vui-theme`). Dark mode is a class
on `<html>`, so it needs no JavaScript to *stay* applied — only to toggle.

Modals are the browser's own `<dialog>` element, so focus trapping, `Esc` to close and the backdrop
come from the platform rather than from us.

Two controls on the dashboard are wired by their own small scripts rather than by `vui.js`, because
they are the two things a static export cannot carry across on its own:

* **`vui-map.js`** — the customers-by-country map. jsvectormap (MIT) plus its Miller-projection world
  data plus the init, concatenated in that order: the library is UMD and sets `window.jsVectorMap`, and
  the map file is not a module at all, it calls `jsVectorMap.addMap()` against that global. Every colour
  it passes is a `var()`, so the map follows the theme toggle without the script knowing one happened.
* **`vui-tabs.js`** — the Statistics card's segmented control. The export emits Radix's markup
  (`role="tab"`, `aria-selected`, `data-state`, which every rule in `vui.css` is keyed on) but not the
  component that moves those attributes, so the three buttons did nothing when clicked. This moves the
  selection, keeps one tab stop for the group, and handles arrow keys, Home and End.

  Worth stating plainly: the chart behind those tabs does not change, and the reference behaves the
  same way — its Alpine control moves a highlight and its `chart-03.js` never reads the value. Our
  React edition goes further and re-aggregates the twelve months into quarters and years; doing that
  here needs `statistics-quarterly` and `statistics-annually` entries in `CHART_SPECS` and a reachable
  ApexCharts handle, both of which live in the design system package rather than in this repository.

## Where this markup comes from

**It is generated, not hand-written, and that is deliberate.** These pages are the static export of
the React edition with the framework stripped out. Four editions of one dashboard, each hand-written,
is four chances to disagree about what a card looks like — and the disagreement shows up as a customer
noticing that the HTML version's table is a little different.

The practical consequence for you: **edit these files freely, they are yours.** But if you are
contributing a design change upstream, it belongs in the design system, not here, or the next
regeneration will overwrite it.

## Customising

**Two stylesheets, and the second one exists for a reason worth knowing.** `vui.css` is compiled by
the design system package against its own components. These pages are an export of an *application*,
and application markup carries layout classes a component library never mentions — the dashboard's
`grid-cols-12` and `xl:col-span-7`, the metric figure's `text-[30px]`, the search field's `pl-12`.
Tailwind emits only what it can see, so 110 classes had no rule at all and the dashboard's grid
collapsed into full-width rows. `vui-pages.css` is exactly that shortfall, generated against the same
tokens, and `npm test` now holds every class in the markup against the stylesheets each page links.

**`vui.css` is compiled and minified onto one line — do not edit it.** Override instead. Every colour,
radius and spacing value in it is a CSS custom property on `:root` (and again on `.dark`), so a
stylesheet loaded *after* it wins:

```html
<link rel="stylesheet" href="vui.css" />
<link rel="stylesheet" href="free-demo.css" />
<link rel="stylesheet" href="your-theme.css" />
```

```css
/* your-theme.css — the whole dashboard follows, light and dark */
:root {
  --brand: #7c3aed;      /* --primary aliases this, so both change */
  --radius: 0.5rem;      /* buttons, inputs, menu rows */
  --vui-card-radius: 1rem;
}
```

* **The brand colour** is `--brand`. `--primary` is `var(--brand)`, so setting `--brand` moves
  everything that derives from it rather than just the one token.
* **The free demo's own look** is `free-demo.css`, loaded after `vui.css` and readable: the 16px card
  radius and the icon-chip opt-out. Drop the link to get the design system's defaults.
* **Dark mode** is the `dark` class on `<html>`, which `vui.js` toggles and stores. Because it is a
  class and not a media query, you can force either theme by setting it in the markup and deleting the
  toggle.
* **Typeface** — the `@font-face` rules name `fonts/`. Swap those two `.woff2` files, or override
  `--font-sans`.
* **The sidebar** is markup, repeated in all nineteen pages. There is no shared include, because there
  is no build step to run one; a find-and-replace across nineteen files is the trade for having nothing
  to install.

## Deploying

Upload the folder. There is no build.

This repository publishes itself:
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) runs the reference check on every push
and pull request, then deploys `main` to GitHub Pages at [html.viliha.com](https://html.viliha.com).
A pull request runs the check and stops before publishing.

`CNAME` carries the custom domain and ships inside the deployment, because Pages re-reads it on every
deploy. All page links are relative (`alerts.html`), so the folder also works from a subdirectory or
straight off disk; the image paths are absolute (`/images/...`), so those want a domain root — change
them if you serve this from a subdirectory.

## What is deliberately not here

The searchable and multi-select dropdowns, drag-and-drop upload, the advanced data table and the other
dashboards. Those are the paid tier, and they are **absent** rather than shown disabled: a control a
reader cannot use is worse than one they can see is not included.

## Free and Pro

The free edition is this repository: nineteen pages and 64 component families, MIT licensed, with no
account and no key. The Pro tier adds the server-backed record workflow — list, detail, create, edit
and delete against your own API — along with more dashboards and the rest of the component catalogue.

VILIHA offers comprehensive templates: the same dashboard in **HTML, React, Next.js, Vue, Angular and
Laravel**, built on one design system, so a team can change stack without changing product. See
[viliha.com](https://viliha.com).

## License

MIT. Use it commercially, fork it, ship it; keep the licence notice.

## Support

If this is useful, a star on GitHub helps. Issues and pull requests are welcome.
