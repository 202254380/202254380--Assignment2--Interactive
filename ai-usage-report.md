# AI Usage Report – Assignment 2

## Tools used

- **Claude (Claude Sonnet 5.5)** – generated the first version of the Assignment 2 code and documentation.
- **ChatGPT (Sol 6.1)** - helped me fix problems in my code and make it cleaner.
- **ChatGPT (Codex)** — reviewed the uploaded ZIP and repaired the submission package on 24 October 2026. The earlier model labels above are retained from the supplied report and should be checked against the original conversation exports.

## How AI was used

- Resolved the Git merge-conflict markers left in my Assignment 1 files.
- Generated the first version of the project filter/search, saved name + time-of-day greeting, advice API with loading/error states, form validation, and animations.
- Wrote the first draft of the README and technical documentation.

## Usage log

| ID | Tool (model) | Date | Purpose | Files affected | What you changed and how you verified it |
| --- | --- | --- | --- | --- | --- |
| C01 | Claude (Claude Sonnet 5.5) | 2026-10-19 | Build Assignment 2 from my Assignment 1 portfolio | `index.html`, `css/styles.css`, `js/script.js`, `README.md`, `docs/*`, `.gitignore` | I edited the wording and tested the theme, filter, search, API error and form in Chrome on desktop and phone. |
| C02 | ChatGPT (Sol 6.1) | 2026-10-24 | Rebuild and fix Assignment 2  |  `index.html`, `css/styles.css`, `js/script.js`, `README.md`, `docs/*`, `.gitignore` | I used it to fix bugs and clean the code, kept only what I understood, and retested everything in the browser. |
| C03 | ChatGPT (Codex) | 2026-10-24 | Review the uploaded ZIP and repair the code and packaging | `index.html`, `css/styles.css`, `js/script.js`, `server/*`, `README.md`, `docs/*`, `.gitignore` | ChatGPT restored the folders, separated project/task filter listeners, tightened numeric and saved-data checks, and corrected optional server setup. Automated checks are recorded in `docs/testing-report.md`; the student must personally review the result and include this complete conversation in the separate evidence ZIP. |

## What I learned

- **localStorage** saves small pieces of data in the browser, so they are still there after I refresh or close the page. I use it to save the theme, the visitor's name, and the workouts and tasks in my two apps. Data is saved as text, so I use `JSON.stringify()` to save lists and `JSON.parse()` to read them back. I put it inside `try/catch` so the site does not break if the browser blocks storage.
  
- **fetch and async/await:** `fetch` asks a website for data and takes some time. With `async/await`, the code waits for the answer without freezing the page. If the request fails, `try/catch` catches the error, and I show a friendly message and a "Try again" button instead of a blank screen. I also added a timeout of 8 seconds with `AbortController`, so the user is not stuck on "Loading…" forever.
   
- **Form validation:** when the user presses submit, I stop the normal behavior with `preventDefault()` and check each field myself. For example, the name needs at least 2 characters, the email must match a pattern, and the message needs at least 10 characters. If something is wrong, I show a message under that field and move the cursor to the first wrong field. If everything is correct, I show a confirmation message.

## Code I can explain

**`applyProjectFilters()`**: This function goes through every project card. For each card it checks two things: does the card's tags include the selected category, and does the card's text include what the user typed (in lowercase). The card is shown only when both are true. At the end it counts the visible cards, shows "Showing X of Y projects", and shows the empty message when the count is 0.

**`loadAdvice()`**: First it shows "Loading…" and disables the button so the user cannot click many times. Then it calls the advice API with `fetch` and waits for the answer. If the answer is correct, it shows the advice with a fade-in animation. If something fails, it shows an error message and the "Try again" button. The `finally` block always runs, so the button is enabled again and the timer is cleared.

**`validateField()`**: It takes one form field, runs the matching rule from the `validators` object, and writes the error message under the field. It also sets `aria-invalid` so the field gets a red border and screen readers know there is an error. It returns true or false, so the submit code knows if the whole form is valid.

## Problems I found and fixed

1. **Three different websites and many duplicate files.** My project had three separate pages (portfolio, IronLog and FocusList), each with its own CSS and JavaScript, and files with confusing names like `styles (5).css` and `app (2).js`. It was hard to maintain and the pages looked different from each other. I merged everything into one `index.html`, one `css/styles.css` and one `js/script.js`, and moved the two apps into pop-up windows opened from the project cards so they use the same colors and dark mode.
   
2. **Name clashes after merging.** Both apps used the same IDs and variable names, such as `empty-state`, `delete-button` and `filters`. When they were in one page, this could make the wrong element change. I renamed them (for example `workout-empty` and `task-empty`, and `data-task-filter`), then tested that adding, deleting and filtering in each app does not affect the other.
   
3. **Missing input checks in the apps.** The original apps accepted empty text. I added checks and error messages for empty exercise names and empty tasks, as the assignment asks for error feedback.

4. **Flattened ZIP paths.** The uploaded ZIP kept the files at its root while the HTML and README expected subfolders. The repair restored `css/`, `js/`, `assets/images/`, `server/`, and `docs/` and restored the ignore file's correct name.

5. **Project/task filter interference.** The portfolio listener selected every `.filter` button, including the task filters. The repair uses `[data-filter]` for portfolio controls and `[data-task-filter]` for task controls.

6. **Numeric and saved-data validation.** Sets and reps now require whole numbers within the displayed limits. Weight requires an explicit value within the displayed range and step. Invalid saved records are ignored, and blocked storage uses memory for the current page.

## Evidence and personal review

The C01/C02 descriptions and model labels came from the original report supplied with the project. Verify them against the original complete exports and correct any statement that does not match your actual work. The C03 row records this review-and-repair conversation; it does not claim that the student has already performed ChatGPT's checks.

Complete conversation exports were not present in the supplied project ZIP. Before submission, add all conversation exports and intermediate artifacts to the separate AI evidence ZIP described in `docs/submission-checklist.md`. Personally review the code, make the edits or improvements required by the assignment, and confirm the declaration below only when it accurately describes your work.

## Declaration

I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.

**Name:** Mohammed Abo Alsaud   

**Student ID:** 202254380

**Date:** 24/10/2026
