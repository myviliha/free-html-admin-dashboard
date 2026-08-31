/*! VuiAdmin HTML — the segmented tab control.
 *
 * **Why this file exists.** These pages are a static export of the React edition, where the tab group
 * is a Radix component: the markup it emits carries `role="tab"`, `aria-selected` and `data-state`,
 * and every visual rule in `vui.css` is keyed on `data-[state=active]`. What the export cannot carry
 * is the component that moves those attributes, and `vui.js` has no tab handler — so the Statistics
 * card shipped three buttons that looked like a working control and did nothing at all when clicked.
 *
 * The reference implementation has the same control and it does exactly this much: its Alpine
 * `x-data="{selected: 'overview'}"` moves a highlight, and its `chart-03.js` never reads `selected`,
 * so the chart behind it does not change either. This restores that behaviour.
 *
 * **Our React edition goes further and this file does not**, deliberately rather than by oversight:
 * there the three ranges re-aggregate the same twelve months into quarters and years and redraw the
 * chart. Doing that here needs two things this repository does not contain — `statistics-quarterly`
 * and `statistics-annually` entries in `CHART_SPECS`, and a reachable ApexCharts handle, which
 * `vui-charts.js` keeps module-scoped. Both are one change in the design system package, and until
 * then a control that highlights is the reference's behaviour rather than a broken promise.
 */
(function () {
  /** Set selection across one tablist, moving both the ARIA state and the styling hook. */
  function select(list, next) {
    var tabs = list.querySelectorAll('[role="tab"]');
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i] === next;
      tabs[i].setAttribute("aria-selected", on ? "true" : "false");
      // `vui.css` styles the active tab off `data-state`, so both attributes have to move or the
      // control announces one thing and paints another.
      tabs[i].setAttribute("data-state", on ? "active" : "inactive");
      // Roving tabindex: one stop for the group, then arrow keys inside it. The export left every
      // trigger at `tabindex="0"`, which makes a three-tab group three tab stops.
      tabs[i].setAttribute("tabindex", on ? "0" : "-1");
    }
  }

  function init() {
    var lists = document.querySelectorAll('[role="tablist"]');

    for (var l = 0; l < lists.length; l++) {
      var list = lists[l];
      if (list.dataset.vuiTabsWired) continue;
      list.dataset.vuiTabsWired = "1";

      // Normalise the starting state, so the roving tabindex is correct before the first click.
      var initial = list.querySelector('[role="tab"][aria-selected="true"]') ||
        list.querySelector('[role="tab"]');
      if (initial) select(list, initial);

      list.addEventListener("click", function (event) {
        var tab = event.target.closest ? event.target.closest('[role="tab"]') : null;
        if (tab && this.contains(tab)) select(this, tab);
      });

      /**
       * Arrow keys, Home and End, which is what `role="tablist"` promises a screen-reader user.
       *
       * Not optional and not decoration: once the roving tabindex above makes the group a single tab
       * stop, arrow keys are the *only* way to reach the other two from the keyboard.
       */
      list.addEventListener("keydown", function (event) {
        var keys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];
        if (keys.indexOf(event.key) === -1) return;
        var tabs = [].slice.call(this.querySelectorAll('[role="tab"]'));
        if (!tabs.length) return;
        var vertical = this.getAttribute("aria-orientation") === "vertical";
        var forward = vertical ? "ArrowDown" : "ArrowRight";
        var back = vertical ? "ArrowUp" : "ArrowLeft";
        // An arrow across the grain is the page's business, not this control's.
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") { if (vertical) return; }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") { if (!vertical) return; }

        var at = tabs.indexOf(document.activeElement);
        if (at === -1) at = 0;
        var to = at;
        if (event.key === forward) to = (at + 1) % tabs.length;
        else if (event.key === back) to = (at - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") to = 0;
        else if (event.key === "End") to = tabs.length - 1;

        event.preventDefault();
        select(this, tabs[to]);
        tabs[to].focus();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
