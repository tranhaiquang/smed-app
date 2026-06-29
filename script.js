import { isSupabaseConfigured, supabase } from "./supabase/supabase.js";

const CHANGEOVER_TABLE = "changeover_records";

const sampleRequests = [
  {
    id: "sample-1",
    type: "Line Changeover",
    status: "Internal",
    plant: "SAMHO",
    production_line: "Line A-01",
    from_model: "aa",
    to_model: "bb",
    planned_start: "2026-06-01T16:18:00",
    planned_duration_minutes: 32,
    actual_duration_minutes: null,
    responsible_group: "T",
  },
  {
    id: "sample-2",
    type: "Line Changeover",
    status: "Completed",
    plant: "SAMHO",
    production_line: "Line A-01",
    from_model: "740",
    to_model: "880",
    planned_start: "2026-05-25T15:57:00",
    planned_duration_minutes: 32,
    actual_duration_minutes: 1,
    responsible_group: "T",
  },
  {
    id: "sample-3",
    type: "Mold Changeover",
    status: "Completed",
    plant: "SAMHO",
    production_line: "Line C-03",
    from_model: "WS-12",
    to_model: "WS-15",
    planned_start: "2026-05-24T11:10:00",
    planned_duration_minutes: 28,
    actual_duration_minutes: 7,
    responsible_group: "M",
  },
];

const requestGrid = document.querySelector("[data-request-grid]");
const requestForm = document.querySelector(".request-form");
const searchInput = document.querySelector("[data-request-search]");

let loadedRequests = [];

window.lucide?.createIcons();

const mobileButton = document.querySelector(".mobile-menu");
const sidebar = document.querySelector(".sidebar");

mobileButton?.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  mobileButton.classList.toggle("selected", sidebar.classList.contains("open"));
});

requestForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await createRequest(new FormData(requestForm));
});

document.querySelectorAll(".segmented-control").forEach((control) => {
  control.querySelectorAll("input[type='radio']").forEach((input) => {
    input.closest("label")?.classList.toggle("selected", input.checked);
  });

  control.addEventListener("change", (event) => {
    if (event.target.type !== "radio") return;
    control.querySelectorAll("label").forEach((label) => label.classList.remove("selected"));
    event.target.closest("label")?.classList.add("selected");
  });
});

document.querySelectorAll(".language-switch").forEach((switcher) => {
  const buttons = [...switcher.querySelectorAll("button")];
  buttons[0]?.classList.add("selected");

  switcher.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    buttons.forEach((languageButton) => {
      languageButton.classList.toggle("selected", languageButton === button);
    });
  });
});

document.querySelectorAll(".view-toggle").forEach((toggle) => {
  toggle.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    toggle.querySelectorAll("button").forEach((viewButton) => {
      viewButton.classList.toggle("selected", viewButton === button);
    });
  });
});

document.querySelectorAll("[data-team-selector]").forEach((selector) => {
  const input = selector.parentElement.querySelector("[name='responsible_group']");

  selector.addEventListener("click", (event) => {
    const button = event.target.closest("[data-team]");
    if (!button) return;

    selector.querySelectorAll("[data-team]").forEach((teamButton) => {
      const isSelected = teamButton === button;
      teamButton.classList.toggle("selected", isSelected);
      teamButton.setAttribute("aria-pressed", String(isSelected));
    });

    input.value = button.dataset.team;
  });
});

document.querySelectorAll(".checkbox-grid input[type='checkbox']").forEach((checkbox) => {
  checkbox.closest("label")?.classList.toggle("selected", checkbox.checked);

  checkbox.addEventListener("change", () => {
    checkbox.closest("label")?.classList.toggle("selected", checkbox.checked);
  });
});

document.querySelectorAll(".top-actions > .icon-button, .search-panel button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("selected");
  });
});

searchInput?.addEventListener("input", () => {
  renderRequests(filterRequests(searchInput.value), { includeDrafts: false });
});

loadRequests();

async function loadRequests() {
  if (!requestGrid) return;

  if (!isSupabaseConfigured) {
    loadedRequests = sampleRequests;
    renderRequests(loadedRequests);
    showNotice("Add your Supabase URL and anon key in supabase/supabase.js to use live data.", "warning");
    return;
  }

  const { data, error } = await supabase
    .from(CHANGEOVER_TABLE)
    .select("*");

  if (error) {
    loadedRequests = sampleRequests;
    renderRequests(loadedRequests);
    showNotice(error.message, "error");
    return;
  }

  loadedRequests = data || [];
  renderRequests(loadedRequests);
}

async function createRequest(formData) {
  const payload = {
    type: formData.get("type"),
    plant: formData.get("plant"),
    workshop: formData.get("workshop"),
    process: formData.get("process"),
    line: formData.get("production_line"),
    from_model: formData.get("from_model"),
    to_model: formData.get("to_model"),
    classification: formData.get("classification"),
    time: formData.get("planned_start") || null,
    duration: Number(formData.get("planned_duration_minutes")),
    tean: formData.get("responsible_group") || null,
    role: formData.getAll("responsible_roles").join(", ") || null,
  };

  if (!isSupabaseConfigured) {
    saveDraft(payload);
    window.location.href = "index.html";
    return;
  }

  const submitButton = requestForm.querySelector("[type='submit']");
  submitButton.disabled = true;

  const { data, error } = await supabase
    .from(CHANGEOVER_TABLE)
    .insert(removeEmptyRecordValues(payload))
    .select("id")
    .single();

  submitButton.disabled = false;

  if (error) {
    showNotice(formatSupabaseError(error), "error");
    return;
  }

  showNotice(`Request created successfully`);
  window.setTimeout(() => {
    window.location.href = "index.html";
  }, 1200);
}

function saveDraft(payload) {
  const drafts = getDraftRequests();
  drafts.unshift({
    id: `draft-${Date.now()}`,
    ...payload,
    created_at: new Date().toISOString(),
  });
  localStorage.setItem("smed_draft_requests", JSON.stringify(drafts));
}

function getDraftRequests() {
  return JSON.parse(localStorage.getItem("smed_draft_requests") || "[]");
}

function removeEmptyRecordValues(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== "" && value !== null && value !== undefined;
    }),
  );
}

function renderRequests(requests, options = {}) {
  const includeDrafts = options.includeDrafts ?? true;
  const allRequests = includeDrafts ? [...getDraftRequests(), ...requests] : requests;

  requestGrid.innerHTML =
    allRequests.map((request) => createRequestCard(request)).join("") ||
    `<p class="empty-state">No changeover requests found.</p>`;

  window.lucide?.createIcons();
}

function createRequestCard(request) {
  const status = request.status || "Internal";
  const isCompleted = status.toLowerCase() === "completed";
  const durationLabel = isCompleted ? "Actual" : "Target";
  const actual = request.actual_duration_minutes ?? "--";
  const planned = request.planned_duration_minutes ?? request.duration ?? "--";
  const started = formatDate(request.time || request.planned_start || request.created_at);
  const line = request.production_line || request.line || "--";
  const group = request.tean || request.responsible_group || (request.type || "T").charAt(0);

  return `
    <article class="request-card ${isCompleted ? "completed" : "internal"}">
      <div class="card-content">
        <div class="badges">
          <span>${escapeHtml(request.process || request.type || "Changeover")}</span>
          <mark>Status.${escapeHtml(status)}</mark>
        </div>
        <h2>${escapeHtml(request.from_model || "--")} <i data-lucide="chevron-right"></i> <strong>${escapeHtml(request.to_model || "--")}</strong></h2>
        <dl>
          <div>
            <dt><i data-lucide="factory"></i>Plant</dt>
            <dd>${escapeHtml(request.plant || "--")}</dd>
          </div>
          <div>
            <dt><i data-lucide="microchip"></i>Line</dt>
            <dd>${escapeHtml(line)}</dd>
          </div>
          <div>
            <dt><i data-lucide="calendar-days"></i>Started</dt>
            <dd>${started}</dd>
          </div>
          <div>
            <dt><i data-lucide="clock-3"></i>${durationLabel}</dt>
            <dd>${planned}m <em>/ ${actual === "--" ? "--" : `${actual}m`}</em></dd>
          </div>
        </dl>
      </div>
      <footer>
        <span>${escapeHtml(String(group).charAt(0).toUpperCase())}</span>
        <button aria-label="Open request"><i data-lucide="chevron-right"></i></button>
      </footer>
    </article>
  `;
}

function filterRequests(query) {
  const normalizedQuery = query.trim().toLowerCase();
  const searchableRequests = [...getDraftRequests(), ...loadedRequests];

  if (!normalizedQuery) return searchableRequests;

  return searchableRequests.filter((request) =>
    [request.from_model, request.to_model, request.production_line, request.line]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
  );
}

function formatDate(value) {
  if (!value) return "--";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function showNotice(message, type = "info") {
  const notice = document.createElement("div");
  notice.className = `notice ${type}`;
  notice.textContent = message;
  document.body.append(notice);
  window.setTimeout(() => notice.remove(), 5200);
}

function formatSupabaseError(error) {
  if (/row-level security policy/i.test(error?.message || "")) {
    return "Supabase blocked this insert with RLS. Add an insert policy for changeover_records in Supabase.";
  }

  return error?.message || "Something went wrong.";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}
