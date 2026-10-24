# Technical Documentation

## Architecture

This is a static portfolio built with semantic HTML, CSS, and vanilla JavaScript. There are no third-party frontend dependencies. `index.html` loads `css/styles.css` and loads `js/script.js` with `defer`. Both project demos use native `<dialog>` elements and share the portfolio's styles and theme.

The optional ASP.NET Core server serves this page and a coaching-tip endpoint. The optional Java HttpServer serves this page and a status endpoint. Neither server is needed for the assignment's dynamic features. Workouts and tasks are managed in JavaScript and saved in the visitor's browser, not in a server database.

## JavaScript organisation

| Section | Responsibility |
| --- | --- |
| 1. Storage | Wrap storage access in `try/catch`, with an in-memory fallback when storage is blocked |
| 2. Theme | Apply saved light/dark mode, otherwise use the operating system preference |
| 3. Greeting | Choose a greeting by the local hour and validate/save/forget a visitor name |
| 4. Project filters | Combine technology filters with case-insensitive text search |
| 5. Advice | Fetch and validate API data, with loading, timeout, failure, and retry states |
| 6. Contact form | Validate fields, identify errors, and show a demo confirmation |
| 7. IronLog | Validate exercises, render saved workouts, calculate totals, and show coaching tips |
| 8. FocusList | Create, complete, delete, filter, and save tasks; calculate completion progress |
| 9. Dialogs/reveals | Open/close project dialogs and reveal sections as they enter the viewport |

`$` and `$$` are small helpers for selecting one element or an array of elements. Functions are named by responsibility so that each feature can be followed separately.

## Storage

| Key | Stored value |
| --- | --- |
| `theme` | `light` or `dark` |
| `visitorName` | Visitor name, 1–30 trimmed characters |
| `ironlog-workouts` | JSON array of exercise records |
| `focuslist-tasks` | JSON array of task records |

Saved arrays are parsed inside `try/catch`. Records are checked for valid IDs, text, numeric ranges, category values, and completion flags before rendering. Invalid records are ignored so they cannot stop the remaining features from initialising. New records use `crypto.randomUUID()` when available, with a time-and-random-string fallback.

When persistent storage is unavailable, the current page uses a memory map. Those values survive interactions on that page but cannot survive a reload. Data is specific to the browser and origin; using another device, browser, or server port creates a separate storage area.

## Filtering

The portfolio filters use `[data-filter]`. Task filters use `[data-task-filter]`. Their event listeners and active states are separate, so changing a task filter cannot hide portfolio projects.

`applyProjectFilters()` combines the selected technology with the search text. Cards are shown only when both match. The result count updates through an `aria-live` region, and a reset button is available when no project matches.

## Validation

| Input | Rule |
| --- | --- |
| Visitor name | 1–30 trimmed characters |
| Contact name | At least 2 trimmed characters |
| Contact email | Basic `name@example.com` pattern |
| Contact message | At least 10 trimmed characters |
| Exercise | 1–40 trimmed characters |
| Sets | Required whole number, 1–20 |
| Reps | Required whole number, 1–100 |
| Weight | Required number, 0–1000 kg, in steps of 0.5 kg |
| Task | 1–80 trimmed characters; category selected from the four supplied options |

The forms use `novalidate` so JavaScript can show consistent messages. Workout validation explicitly checks empty numeric fields, ranges, and steps; an empty weight is not converted into an accepted zero. Zero is allowed when the visitor intentionally enters it for a bodyweight exercise.

Errors set `aria-invalid`, refer to visible messages, and move focus to the field that needs attention. User-entered strings are rendered with `textContent` rather than HTML. The contact form never sends a message or contacts a backend.

## Network behaviour

Advice is requested from `https://api.adviceslip.com/advice`, with a timestamp query, an eight-second `AbortController` timeout, and response-shape checks. Failed or malformed responses produce a friendly error and a retry button.

The Java status request runs only on the example Java server's port, 5052. The C# coaching-tip request runs only on its example port, 5051, with a three-second timeout and a built-in fallback. Static hosting therefore does not issue requests to nonexistent local API routes on page load.

## Accessibility and layout

- Semantic headings, landmarks, a skip link, labelled form controls, and descriptive project buttons.
- `aria-pressed` for filters; dialog controls support Enter/Space, and native dialogs support Escape.
- Visible focus indicators, accessible error/status messages, and a theme button with an updated label.
- CSS Grid and Flexbox layouts adapt to small screens; panel headings and filters can wrap.
- The main content remains visible if JavaScript fails to load. Scroll hiding is enabled only after the reveal code initialises.
- Animations, transitions, and smooth scrolling are disabled when reduced motion is requested.

## Limitations and testing

The contact form is a validation demo. Third-party advice depends on network and API availability. Saved data can be removed by clearing the browser's storage. Optional C# and Java processes do not run on GitHub Pages; the static demos do.

See `docs/testing-report.md` for the checks actually performed. A test in one environment does not establish compatibility with every browser or device.
