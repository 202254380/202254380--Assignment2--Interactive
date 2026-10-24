# Testing Report

**Date:** 24 October 2026  
**Performed by:** ChatGPT during the C03 review and repair

## Environment

- Linux, Node.js 24, headless Chromium 153.0.8010.0.
- Browser widths: 1440, 1024, 768, 390, and 320 CSS pixels.
- OpenJDK 17 for the Java example server.
- .NET SDK 8.0.426 for the C# example server.

## Browser checks

All **16 check groups passed**. Each group exercises user actions and checks the resulting page state.

| Check group | Result |
| --- | --- |
| Load all required assets and initialise without uncaught JavaScript errors | Passed |
| Switch theme, save/forget a name, and retain preferences after reload | Passed |
| Filter projects, combine search with a category, and reset empty results | Passed |
| Change task filters without changing portfolio project visibility or active buttons | Passed |
| Create, complete, filter, save, clear completed, and delete tasks | Passed |
| Reject invalid workout numbers; calculate, save, delete, and clear valid workouts | Passed |
| Show contact errors, focus the invalid field, and confirm valid demo input without sending data | Passed |
| Handle valid advice, malformed responses, network failure, and a successful retry | Passed |
| Ignore malformed saved records and use memory when storage is blocked | Passed |
| Open dialogs with Enter/Space, close them with Escape/button, and restore focus | Passed |
| Keep page and dialog content within desktop, tablet, and narrow phone viewports | Passed |
| Keep content visible without JavaScript and respect reduced motion | Passed |
| Show advice loading state, time out after eight seconds, and re-enable retry controls | Passed |
| Open `index.html` directly, use its interactions, and retain tasks after reload | Passed |
| Connect the Java server to the browser's server-status feature | Passed |
| Connect the C# server to the browser's coaching-tip feature | Passed |

Workout cases included empty fields, zero/negative sets, fractional sets/reps, values above every stated maximum, an empty/negative weight, and a weight that does not match the 0.5 kg step. Valid zero-weight exercises and volume calculations were also checked.

Desktop and phone screenshots were visually reviewed after animations completed. Responsive checks also verified that the dialogs remain inside the viewport and that their contents do not overflow horizontally.

## Files and servers

- `node --check js/script.js`: passed.
- HTML IDs are unique; labels, `aria-controls`, `aria-labelledby`, and `aria-describedby` resolve to existing elements.
- All six referenced stylesheet, script, favicon, and image paths exist and return HTTP 200.
- SVG and C# project XML parse successfully; documentation links resolve.
- Exactly one CSS file and one JavaScript file are included. No merge-conflict markers were found.
- Java serves the homepage, CSS, JavaScript, JPG profile image, and SVG previews with the expected content types. Its status API responds correctly; missing files return 404.
- C# builds successfully with **0 warnings and 0 errors**. Its homepage, CSS, JavaScript, profile image, and coaching-tip endpoint respond correctly; missing routes return 404.
- The final ZIP is checked for archive integrity, the required folder structure, and accidental inclusion of build/dependency files.

## Network and coverage limits

A live request to the Advice Slip API returned HTTP 200 and a valid advice object. Browser success/failure/retry/timeout tests used controlled responses so that those checks were repeatable. Third-party availability can still change after testing.

These checks used Chromium. Separate Firefox, Safari, and Edge installations and physical phones were not tested. Phone/tablet checks use browser viewport sizes. Personal understanding of the code, the accuracy of earlier AI-use statements, repository publication, and the completeness of the student's conversation exports must be checked by the student before submission.
