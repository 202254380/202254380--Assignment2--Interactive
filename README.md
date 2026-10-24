# Personal Portfolio — Assignment 2

**Mhammed Aboalsaud · 202254380 · SWE 363**

This project extends my Assignment 1 portfolio with JavaScript interactions, saved preferences, form validation, and animations. It uses HTML, one CSS file, and one JavaScript file. It does not need a framework, npm, or a build step.

## Features

| Assignment area | Implementation |
| --- | --- |
| Dynamic content | Project filters and live search; a time-of-day greeting with a saved visitor name |
| Data handling | Theme, name, workouts, and tasks stored in `localStorage`; advice loaded from a public API; contact form validation |
| Animation | Hover effects, card and advice fades, scroll reveals, and success/error feedback |
| Error handling | Field-specific errors, loading and retry states, empty results, and safe handling of unavailable storage or malformed saved data |
| Accessibility | Labelled forms, keyboard-operable project dialogs, focus indicators, live messages, and reduced-motion support |

The project cards open two interactive demos on the same page:

- **IronLog:** add/delete exercises, calculate sets and training volume, save workouts, and display coaching tips.
- **FocusList:** add/delete tasks, choose categories, mark tasks complete, filter the list, and track completion progress.

Both demos run in the browser. Optional C# and Java servers are included as small examples; they are not required to use the website.

## Run locally

1. Extract the ZIP and open the `202254380-mhammedaboalsaud-assignment2` folder.
2. Open `index.html` in a modern browser.

For a consistent local address, run this from the folder containing `index.html` instead:

```bash
python -m http.server 8000
```

On Windows, use `py -m http.server 8000` if `python` is not recognised. Visit [http://localhost:8000](http://localhost:8000).

The advice feature requires internet access. If the request fails or takes longer than eight seconds, an error message and a retry button appear. The other features work offline after the files have loaded.

## Optional servers

Choose either server. Each serves the same portfolio, using the same stylesheet and script. Browser data remains in `localStorage`.

**Java — requires JDK 17 or later:**

```bash
cd server
java --add-modules jdk.httpserver TodoServer.java
```

Visit [http://localhost:5052](http://localhost:5052). The `/api/status` endpoint reports whether this example server is running.

**C# — requires the .NET 8 SDK:**

```bash
cd server
dotnet run
```

Visit [http://localhost:5051](http://localhost:5051). The `/api/tip` endpoint returns a coaching tip. With other hosting options, IronLog uses built-in tips.

Stop a local server with **Ctrl+C**.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Portfolio content, forms, and the two project dialogs |
| `css/styles.css` | The only stylesheet: themes, layout, responsive rules, and animations |
| `js/script.js` | The only script: all website and demo interactions |
| `assets/images/` | Profile photo, project previews, and favicon |
| `server/` | Optional C# and Java example servers |
| `docs/technical-documentation.md` | Behaviour, validation rules, storage, and limitations |
| `docs/testing-report.md` | Verification results and testing limitations |
| `docs/ai-usage-report.md` | AI usage log and required declaration |
| `docs/submission-checklist.md` | GitHub and Blackboard submission requirements |

## AI use

Claude and ChatGPT assisted with code, debugging, and documentation. ChatGPT also reviewed the uploaded ZIP and repaired file locations, filter interference, validation, and server configuration. Details are recorded in [the AI usage report](docs/ai-usage-report.md).

Full conversation exports and intermediate AI artifacts must be submitted in the separate AI evidence ZIP required by the course. They should not be committed to the public repository.

## Submission

The required public repository name is **`202254380-mhammedaboalsaud-assignment2`**. Upload the contents of this project folder, with `index.html` and `README.md` at the repository root. See [the submission checklist](docs/submission-checklist.md) before submitting the repository link and AI evidence ZIP on Blackboard.

## Author

**Mhammed Aboalsaud** · Student ID: **202254380** · [GitHub profile](https://github.com/202254380)
