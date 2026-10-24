"use strict";

/* ==========================================================
   Portfolio – Assignment 2
   1. Safe localStorage helper
   2. Theme toggle (saved preference)
   3. Time-of-day greeting + saved visitor name
   4. Project filter + live search
   5. Advice of the moment (public API)
   6. Contact form validation
   7. IronLog gym tracker (C# project)
   8. FocusList to-do app (Java project)
   9. App pop-ups + scroll reveal
   ========================================================== */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/* ---------- 1. Safe storage (works even if storage is blocked) ---------- */
const memoryStore = new Map();
const store = {
  get(key) {
    if (memoryStore.has(key)) return memoryStore.get(key);
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    memoryStore.set(key, String(value));
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
  },
  remove(key) {
    memoryStore.delete(key);
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }
};

/* ---------- 2. Theme ---------- */
const page = document.documentElement;
const themeButton = $("#theme-toggle");

function applyTheme(theme) {
  page.dataset.theme = theme;
  themeButton.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
  themeButton.textContent = theme === "dark" ? "☀" : "☾";
}

function initTheme() {
  const saved = store.get("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved === "light" || saved === "dark" ? saved : (prefersDark ? "dark" : "light"));

  themeButton.addEventListener("click", () => {
    const next = page.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    store.set("theme", next);
  });
}

/* ---------- 3. Greeting + visitor name ---------- */
const greeting = $("#greeting");
const nameForm = $("#name-form");
const nameInput = $("#visitor-name");
const nameError = $("#name-error");
const forgetButton = $("#forget-name");

function getTimeOfDay(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function renderGreeting() {
  const name = store.get("visitorName");
  greeting.textContent = name
    ? `${getTimeOfDay()}, ${name}! Welcome to my portfolio.`
    : `${getTimeOfDay()}! Welcome to my portfolio.`;
  forgetButton.hidden = !name;
}

function initGreeting() {
  renderGreeting();

  nameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();

    if (!name || name.length > 30) {
      nameError.textContent = "Please enter a name between 1 and 30 characters.";
      nameInput.setAttribute("aria-invalid", "true");
      nameInput.focus();
      return;
    }

    nameError.textContent = "";
    nameInput.removeAttribute("aria-invalid");
    store.set("visitorName", name);
    nameInput.value = "";
    renderGreeting();
  });

  forgetButton.addEventListener("click", () => {
    store.remove("visitorName");
    renderGreeting();
  });
}

/* ---------- 4. Project filter + live search ---------- */
const filterState = { category: "all", query: "" };

function applyProjectFilters() {
  const cards = $$(".project-card");
  const query = filterState.query.trim().toLowerCase();
  let visible = 0;

  cards.forEach((card) => {
    const matchesCategory =
      filterState.category === "all" || card.dataset.tags.split(" ").includes(filterState.category);
    const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
    const show = matchesCategory && matchesQuery;

    // Re-trigger the fade-in animation when a card re-appears
    if (show && card.hidden) {
      card.style.animation = "none";
      void card.offsetWidth;
      card.style.animation = "";
    }
    card.hidden = !show;
    if (show) visible += 1;
  });

  $("#project-empty").hidden = visible > 0;
  $("#project-count").textContent =
    visible === 0 ? "" : `Showing ${visible} of ${cards.length} project${cards.length === 1 ? "" : "s"}`;
}

function initProjects() {
  const projectFilters = $$("[data-filter]");
  projectFilters.forEach((button) => {
    button.addEventListener("click", () => {
      filterState.category = button.dataset.filter;
      projectFilters.forEach((other) => {
        const active = other === button;
        other.classList.toggle("active", active);
        other.setAttribute("aria-pressed", String(active));
      });
      applyProjectFilters();
    });
  });

  $("#project-search").addEventListener("input", (event) => {
    filterState.query = event.target.value;
    applyProjectFilters();
  });

  $("#reset-filters").addEventListener("click", () => {
    filterState.category = "all";
    filterState.query = "";
    $("#project-search").value = "";
    projectFilters.forEach((button) => {
      const active = button.dataset.filter === "all";
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    applyProjectFilters();
  });

  applyProjectFilters();
}

/* ---------- 5. Advice of the moment (public API) ---------- */
const adviceText = $("#advice-text");
const adviceButton = $("#advice-button");
const adviceRetry = $("#advice-retry");
const adviceCard = $(".advice-card");

async function loadAdvice() {
  adviceCard.setAttribute("aria-busy", "true");
  adviceButton.disabled = true;
  adviceRetry.hidden = true;
  adviceText.className = "is-loading";
  adviceText.textContent = "Loading…";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    // Cache-busting query so each click returns a fresh slip
    const response = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`, {
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (typeof data?.slip?.advice !== "string" || !data.slip.advice.trim()) {
      throw new Error("Unexpected response");
    }

    adviceText.className = "is-new";
    adviceText.textContent = `“${data.slip.advice}”`;
  } catch {
    adviceText.className = "is-error";
    adviceText.textContent =
      "We couldn’t load advice right now. Check your internet connection and press “Try again”.";
    adviceRetry.hidden = false;
  } finally {
    clearTimeout(timeout);
    adviceButton.disabled = false;
    adviceCard.setAttribute("aria-busy", "false");
  }
}

function initAdvice() {
  adviceButton.addEventListener("click", loadAdvice);
  adviceRetry.addEventListener("click", loadAdvice);
  loadAdvice(); // load one slip when the page opens
}

/* ---------- 6. Contact form validation ---------- */
const contactForm = $("#contact-form");
const formStatus = $("#form-status");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validators = {
  name: (value) => (value.length < 2 ? "Please enter your name (at least 2 characters)." : ""),
  email: (value) => {
    if (!value) return "Please enter your email address.";
    return emailPattern.test(value) ? "" : "That email looks incomplete. Use a format like name@example.com.";
  },
  message: (value) => (value.length < 10 ? "Please write a message of at least 10 characters." : "")
};

function validateField(field) {
  const message = validators[field.name](field.value.trim());
  $(`#${field.name}-msg`).textContent = message;
  if (message) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
  return !message;
}

function initContactForm() {
  const fields = $$("input, textarea", contactForm);

  fields.forEach((field) => {
    // Re-check a field after the user has left it, so errors clear as soon as they are fixed
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.hasAttribute("aria-invalid")) validateField(field);
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.className = "form-status";
    formStatus.textContent = "";

    fields.forEach(validateField);
    const firstInvalid = fields.find((field) => field.hasAttribute("aria-invalid"));

    if (firstInvalid) {
      firstInvalid.focus();
      formStatus.className = "form-status error";
      formStatus.textContent = "Please fix the highlighted fields and send again.";
      return;
    }

    const name = $("#name").value.trim();
    contactForm.reset();
    formStatus.className = "form-status success";
    formStatus.textContent = `Thanks, ${name}! Your message was validated. (This is a demo form, so nothing was sent.)`;
  });
}

/* ---------- 7. IronLog – gym tracker ---------- */
const workoutForm = $("#workout-form");
const workoutList = $("#workout-list");
const workoutEmpty = $("#workout-empty");
const workoutError = $("#workout-error");
const exerciseInput = $("#exercise");
let workouts = loadList("ironlog-workouts", isWorkout);

function loadList(key, isValid) {
  try {
    const parsed = JSON.parse(store.get(key) || "[]");
    return Array.isArray(parsed) ? parsed.filter(isValid) : [];
  } catch { return []; }
}
const saveList = (key, list) => store.set(key, JSON.stringify(list));

function createId() {
  return window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function hasValidId(item) {
  return typeof item.id === "string" ? item.id.length > 0 : Number.isFinite(item.id);
}

function isWorkout(item) {
  return item !== null && typeof item === "object" && hasValidId(item)
    && typeof item.exercise === "string" && item.exercise.trim().length > 0 && item.exercise.length <= 40
    && Number.isInteger(item.sets) && item.sets >= 1 && item.sets <= 20
    && Number.isInteger(item.reps) && item.reps >= 1 && item.reps <= 100
    && Number.isFinite(item.weight) && item.weight >= 0 && item.weight <= 1000
    && Number.isInteger(item.weight * 2);
}

function renderWorkouts() {
  workoutList.replaceChildren();
  workoutEmpty.hidden = workouts.length > 0;

  workouts.forEach((w) => {
    const item = document.createElement("article");
    item.className = "item";

    const details = document.createElement("div");
    const title = document.createElement("h4");
    const numbers = document.createElement("p");
    title.textContent = w.exercise;
    numbers.textContent = `${w.sets} sets × ${w.reps} reps at ${w.weight} kg`;
    details.append(title, numbers);

    const volume = document.createElement("span");
    volume.className = "item-value";
    volume.textContent = `${(w.sets * w.reps * w.weight).toLocaleString()} kg`;

    const remove = document.createElement("button");
    remove.className = "delete-button";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Delete ${w.exercise}`);
    remove.addEventListener("click", () => {
      workouts = workouts.filter((e) => e.id !== w.id);
      saveList("ironlog-workouts", workouts);
      renderWorkouts();
    });

    item.append(details, volume, remove);
    workoutList.append(item);
  });

  $("#workout-count").textContent = workouts.length;
  $("#set-count").textContent = workouts.reduce((t, w) => t + w.sets, 0);
  $("#volume-count").textContent = workouts
    .reduce((t, w) => t + w.sets * w.reps * w.weight, 0)
    .toLocaleString();
}

function initWorkouts() {
  workoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(workoutForm);
    const exercise = String(data.get("exercise")).trim();
    const sets = Number(data.get("sets"));
    const reps = Number(data.get("reps"));
    const weight = Number(data.get("weight"));

    $$("input", workoutForm).forEach((input) => input.removeAttribute("aria-invalid"));

    if (!exercise || exercise.length > 40) {
      workoutError.textContent = "Please enter an exercise name between 1 and 40 characters.";
      exerciseInput.setAttribute("aria-invalid", "true");
      exerciseInput.focus();
      return;
    }
    const numberRules = [
      { input: $("#sets"), valid: Number.isInteger(sets) && sets >= 1 && sets <= 20,
        message: "Sets must be a whole number from 1 to 20." },
      { input: $("#reps"), valid: Number.isInteger(reps) && reps >= 1 && reps <= 100,
        message: "Reps must be a whole number from 1 to 100." },
      { input: $("#weight"), valid: Number.isFinite(weight) && weight >= 0 && weight <= 1000 && Number.isInteger(weight * 2),
        message: "Enter a weight from 0 to 1000 kg in steps of 0.5 kg (use 0 for bodyweight)." }
    ];
    for (const rule of numberRules) {
      if (!rule.input.value.trim() || !rule.valid) {
        workoutError.textContent = rule.message;
        rule.input.setAttribute("aria-invalid", "true");
        rule.input.focus();
        return;
      }
    }

    workoutError.textContent = "";
    exerciseInput.removeAttribute("aria-invalid");
    workouts.unshift({ id: createId(), exercise, sets, reps, weight });
    saveList("ironlog-workouts", workouts);
    renderWorkouts();
    workoutForm.reset();
    exerciseInput.focus();
  });

  $$("[data-exercise]").forEach((button) => {
    button.addEventListener("click", () => {
      exerciseInput.value = button.dataset.exercise;
      exerciseInput.focus();
    });
  });

  $("#clear-workouts").addEventListener("click", () => {
    workouts = [];
    saveList("ironlog-workouts", workouts);
    renderWorkouts();
  });

  const fallbackTips = [
    "Control every repetition and prioritize good form.",
    "Record each workout and improve one small detail next time.",
    "Recovery, hydration, and sleep support your training.",
    "Warm up gradually before your hardest working sets."
  ];
  $("#new-tip").addEventListener("click", async () => {
    const tip = $("#coach-tip");
    const showLocalTip = () => {
      tip.textContent = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
    };
    if (window.location.port !== "5051") {
      showLocalTip();
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    try {
      const response = await fetch("/api/tip", { signal: controller.signal });
      if (!response.ok) throw new Error("Server tip unavailable");
      const data = await response.json();
      if (typeof data?.tip !== "string" || !data.tip.trim()) throw new Error("Invalid tip");
      tip.textContent = data.tip;
    } catch {
      showLocalTip();
    } finally {
      clearTimeout(timeout);
    }
  });

  renderWorkouts();
}

/* ---------- 8. FocusList – to-do app ---------- */
const taskForm = $("#task-form");
const taskInput = $("#task-input");
const taskList = $("#task-list");
const taskEmpty = $("#task-empty");
const taskError = $("#task-error");
let tasks = loadList("focuslist-tasks", isTask);
let taskFilter = "all";

function isTask(item) {
  return item !== null && typeof item === "object" && hasValidId(item)
    && typeof item.text === "string" && item.text.trim().length > 0 && item.text.length <= 80
    && ["Personal", "Study", "Work", "Health"].includes(item.category)
    && typeof item.done === "boolean";
}

function renderTasks() {
  taskList.replaceChildren();
  const shown = tasks.filter((t) =>
    taskFilter === "open" ? !t.done : taskFilter === "done" ? t.done : true
  );
  taskEmpty.hidden = shown.length > 0;
  taskEmpty.textContent = tasks.length === 0
    ? "Your list is clear. Add a task above when you’re ready."
    : taskFilter === "done" ? "No completed tasks yet. Finish a task or choose All."
      : "No open tasks. Choose All to see your completed tasks.";

  shown.forEach((task) => {
    const item = document.createElement("article");
    item.className = `item task-item${task.done ? " done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", `Mark ${task.text} ${task.done ? "incomplete" : "complete"}`);
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveList("focuslist-tasks", tasks);
      renderTasks();
    });

    const copy = document.createElement("div");
    const title = document.createElement("h4");
    const category = document.createElement("p");
    title.textContent = task.text;
    category.textContent = task.category;
    copy.append(title, category);

    const remove = document.createElement("button");
    remove.className = "delete-button";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Delete ${task.text}`);
    remove.addEventListener("click", () => {
      tasks = tasks.filter((e) => e.id !== task.id);
      saveList("focuslist-tasks", tasks);
      renderTasks();
    });

    item.append(checkbox, copy, remove);
    taskList.append(item);
  });

  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  $("#progress-label").textContent = `${pct}% complete`;
  $("#progress-bar").style.width = `${pct}%`;
  $("#progress-message").textContent = tasks.length
    ? `${done} of ${tasks.length} tasks finished.`
    : "Add a task to begin your day.";
}

function setTaskFilter(value) {
  taskFilter = value;
  $$("[data-task-filter]").forEach((button) => {
    const active = button.dataset.taskFilter === value;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderTasks();
}

function initTasks() {
  $("#today").textContent = new Intl.DateTimeFormat("en", {
    weekday: "long", month: "long", day: "numeric"
  }).format(new Date());

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(taskForm);
    const text = String(data.get("task")).trim();
    if (!text || text.length > 80) {
      taskError.textContent = "Please enter a task between 1 and 80 characters.";
      taskInput.setAttribute("aria-invalid", "true");
      taskInput.focus();
      return;
    }
    taskError.textContent = "";
    taskInput.removeAttribute("aria-invalid");
    tasks.unshift({ id: createId(), text, category: data.get("category"), done: false });
    saveList("focuslist-tasks", tasks);
    taskForm.reset();
    setTaskFilter("all");
    taskInput.focus();
  });

  $$("[data-task-filter]").forEach((button) => {
    button.addEventListener("click", () => setTaskFilter(button.dataset.taskFilter));
  });

  $("#clear-completed").addEventListener("click", () => {
    tasks = tasks.filter((t) => !t.done);
    saveList("focuslist-tasks", tasks);
    renderTasks();
  });

  const status = $("#server-status");
  status.textContent = "Browser demo";
  if (window.location.port === "5052") {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    fetch("/api/status", { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error("Server unavailable"); return r.json(); })
      .then((data) => {
        if (data?.server !== "Java HttpServer" || data.status !== "online") throw new Error("Invalid status");
        status.textContent = "Server connected";
      })
      .catch(() => { status.textContent = "Browser demo"; })
      .finally(() => clearTimeout(timeout));
  }

  renderTasks();
}

/* ---------- 9. App pop-ups (dialogs) + scroll reveal ---------- */
function initDialogs() {
  $$("[data-open]").forEach((card) => {
    const open = () => $("#" + card.dataset.open).showModal();
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });
  $$(".app-dialog").forEach((dialog) => {
    $("[data-close]", dialog).addEventListener("click", () => dialog.close());
    // click on the dark backdrop closes the dialog
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  });
}

function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("in")); return; }
  page.classList.add("js-reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("in"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => observer.observe(el));
}

/* ---------- Start ---------- */
initTheme();
initGreeting();
initProjects();
initAdvice();
initContactForm();
initWorkouts();
initTasks();
initDialogs();
initReveal();
