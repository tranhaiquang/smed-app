import { isSupabaseConfigured, supabase } from "./supabase/supabase.js";

const CHANGEOVER_TABLE = "changeover_records";

const sampleRequests = [
  {
    id: "sample-1",
    type: "Line Changeover",
    status: "Submitted",
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
  if (!validateRequestForm()) return;
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
    updateUnplannedDetails();
  });
});

function updateUnplannedDetails() {
  const selectedClassification = document.querySelector("input[name='classification']:checked")?.value;
  const details = document.querySelector("[data-unplanned-details]");
  if (!details) return;

  const isUnplanned = selectedClassification === "Unplanned";
  details.hidden = !isUnplanned;
  details.querySelectorAll("select, textarea").forEach((field) => {
    field.disabled = !isUnplanned;
    field.required = isUnplanned && field.matches("select");
    if (!isUnplanned) field.value = "";
  });
}

updateUnplannedDetails();

const workshopSelect = requestForm?.querySelector("[name='workshop']");
const productionLineSelect = requestForm?.querySelector("[name='production_line']");
const productionLinesByWorkshop = {
  "PLANT A": Array.from({ length: 14 }, (_, index) => `A${String(index + 1).padStart(2, "0")}`),
  "PLANT B": Array.from({ length: 11 }, (_, index) => `B${String(index + 1).padStart(2, "0")}`),
};

function updateProductionLines() {
  if (!workshopSelect || !productionLineSelect) return;

  const lines = productionLinesByWorkshop[workshopSelect.value] || [];
  productionLineSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.textContent = "Select Line";
  productionLineSelect.append(placeholder);

  lines.forEach((line) => {
    const option = document.createElement("option");
    option.value = line;
    option.textContent = line;
    productionLineSelect.append(option);
  });

  productionLineSelect.disabled = lines.length === 0;
}

workshopSelect?.addEventListener("change", updateProductionLines);
updateProductionLines();

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
    selector.querySelector("[data-team]")?.setCustomValidity("");
  });
});

document.querySelectorAll(".checkbox-grid input[type='checkbox']").forEach((checkbox) => {
  checkbox.closest("label")?.classList.toggle("selected", checkbox.checked);

  checkbox.addEventListener("change", () => {
    checkbox.closest("label")?.classList.toggle("selected", checkbox.checked);
    const group = checkbox.closest("[data-required-checkbox-group]");
    group?.querySelector("input[type='checkbox']")?.setCustomValidity("");
  });
});

function validateRequestForm() {
  if (!requestForm.reportValidity()) return false;

  const teamGroup = requestForm.querySelector("[data-required-group]");
  const selectedTeam = teamGroup?.querySelector("[data-team].selected");
  const firstTeamButton = teamGroup?.querySelector("[data-team]");
  if (teamGroup && !selectedTeam) {
    firstTeamButton?.setCustomValidity("Select a responsible team.");
    firstTeamButton?.focus();
    firstTeamButton?.reportValidity();
    showNotice("Select a responsible team.", "error");
    return false;
  }
  firstTeamButton?.setCustomValidity("");

  const roleGroup = requestForm.querySelector("[data-required-checkbox-group]");
  const selectedRole = roleGroup?.querySelector("input[type='checkbox']:checked");
  const firstRoleCheckbox = roleGroup?.querySelector("input[type='checkbox']");
  if (roleGroup && !selectedRole) {
    firstRoleCheckbox?.setCustomValidity("Select at least one responsible role.");
    firstRoleCheckbox?.focus();
    firstRoleCheckbox?.reportValidity();
    showNotice("Select at least one responsible role.", "error");
    return false;
  }
  firstRoleCheckbox?.setCustomValidity("");

  return true;
}


document.querySelectorAll(".top-actions > .icon-button, .search-panel button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("selected");
  });
});

searchInput?.addEventListener("input", () => {
  renderRequests(filterRequests(searchInput.value), { includeDrafts: false });
});

requestGrid?.addEventListener("click", async (event) => {
  const actionButton = event.target.closest("[data-request-action]");
  if (!actionButton) return;

  const card = actionButton.closest("[data-request-id]");
  const requestId = card?.dataset.requestId;
  if (!requestId) return;

  const action = actionButton.dataset.requestAction;
  if (action === "complete") await completeRequest(requestId);
  if (action === "delete") await deleteRequest(requestId);
});

loadRequests();
window.setInterval(refreshTimedStatuses, 60000);

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

  loadedRequests = applyTimedStatuses(data || []);
  renderRequests(loadedRequests);
  await syncTimedStatuses(loadedRequests, data || []);
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
    status: "Submitted",
    time: formData.get("planned_start") || null,
    duration: Number(formData.get("planned_duration_minutes")),
    team: formData.get("responsible_group") || null,
    role: formData.getAll("responsible_roles").join(", ") || null,
    unplanned_category: formData.get("unplanned_category") || null,
    unplanned_reason: formData.get("unplanned_reason") || null,
    note: formData.get("note") || null,
  };

  if (!isSupabaseConfigured) {
    saveDraft(payload);
    window.location.href = "changeover.html";
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
    window.location.href = "changeover.html";
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
  const status = getTimedStatus(request);
  const statusClass = status.toLowerCase().replace(/\s+/g, "-");
  const isCompleted = status === "Completed";
  const isCancelled = status === "Cancelled";
  const durationLabel = isCompleted ? "Actual" : "Target";
  const actual = request.actual_duration_minutes ?? "--";
  const planned = request.planned_duration_minutes ?? request.duration ?? "--";
  const started = formatDate(request.time || request.planned_start || request.created_at);
  const line = request.production_line || request.line || "--";
  const group = request.team || request.tean || request.responsible_group || (request.type || "T").charAt(0);

  return `
    <article class="request-card status-${statusClass}" data-request-id="${escapeHtml(request.id)}">
      <div class="card-content">
        <div class="badges">
          <span>${escapeHtml(request.process || request.type || "Changeover")}</span>
          <mark>${escapeHtml(status)}</mark>
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
        <div class="card-actions" aria-label="Request actions">
          <button class="delete-button" type="button" data-request-action="delete">
            <i data-lucide="trash-2"></i>Delete
          </button>
          <button class="complete-button" type="button" data-request-action="complete" ${isCompleted || isCancelled ? "disabled" : ""}>
            <i data-lucide="circle-check"></i>Complete
          </button>
        </div>
      </div>
    </article>
  `;
}

async function completeRequest(requestId) {
  if (requestId.startsWith("draft-")) {
    updateDraftRequest(requestId, { status: "Completed" });
    showNotice("Draft marked completed.", "success");
    refreshRequestGrid();
    return;
  }

  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from(CHANGEOVER_TABLE)
    .update({ status: "Completed" })
    .eq("id", requestId);

  if (error) {
    showNotice(formatSupabaseError(error), "error");
    return;
  }

  loadedRequests = loadedRequests.map((request) =>
    String(request.id) === String(requestId) ? { ...request, status: "Completed" } : request,
  );
  showNotice("Changeover completed.", "success");
  refreshRequestGrid();
}

async function deleteRequest(requestId) {
  if (!window.confirm("Delete this changeover request?")) return;

  if (requestId.startsWith("draft-")) {
    deleteDraftRequest(requestId);
    showNotice("Draft deleted.", "success");
    refreshRequestGrid();
    return;
  }

  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from(CHANGEOVER_TABLE)
    .delete()
    .eq("id", requestId);

  if (error) {
    showNotice(formatSupabaseError(error), "error");
    return;
  }

  loadedRequests = loadedRequests.filter((request) => String(request.id) !== String(requestId));
  showNotice("Changeover deleted.", "success");
  refreshRequestGrid();
}

function updateDraftRequest(requestId, patch) {
  const drafts = getDraftRequests().map((request) =>
    request.id === requestId ? { ...request, ...patch } : request,
  );
  localStorage.setItem("smed_draft_requests", JSON.stringify(drafts));
}

function deleteDraftRequest(requestId) {
  const drafts = getDraftRequests().filter((request) => request.id !== requestId);
  localStorage.setItem("smed_draft_requests", JSON.stringify(drafts));
}

function refreshRequestGrid() {
  const query = searchInput?.value || "";
  renderRequests(query ? filterRequests(query) : loadedRequests);
}

async function refreshTimedStatuses() {
  if (!requestGrid || loadedRequests.length === 0) return;

  const previousRequests = loadedRequests;
  const timedRequests = applyTimedStatuses(previousRequests);
  const hasChanges = timedRequests.some((request, index) => request.status !== previousRequests[index]?.status);
  if (!hasChanges) return;

  loadedRequests = timedRequests;
  refreshRequestGrid();
  await syncTimedStatuses(timedRequests, previousRequests);
}

function getTimedStatus(request, now = new Date()) {
  const status = normalizeStatus(request.status);
  if (status === "Completed") return "Completed";

  const startValue = request.time || request.planned_start;
  const duration = Number(request.duration ?? request.planned_duration_minutes);
  if (!startValue || !Number.isFinite(duration) || duration <= 0) return status;

  const start = new Date(startValue);
  if (Number.isNaN(start.getTime())) return status;

  const end = new Date(start.getTime() + duration * 60 * 1000);
  if (now < start) return "Submitted";
  if (now <= end) return "In Progress";
  return "Cancelled";
}

function applyTimedStatuses(requests) {
  return requests.map((request) => ({ ...request, status: getTimedStatus(request) }));
}

async function syncTimedStatuses(timedRequests, originalRequests) {
  if (!isSupabaseConfigured) return;

  const updates = timedRequests.filter((request) => {
    const original = originalRequests.find((item) => String(item.id) === String(request.id));
    return original && normalizeStatus(original.status) !== request.status;
  });

  const results = await Promise.all(updates.map((request) =>
    supabase
      .from(CHANGEOVER_TABLE)
      .update({ status: request.status })
      .eq("id", request.id),
  ));

  const failedUpdate = results.find((result) => result.error);
  if (failedUpdate) {
    showNotice(formatSupabaseError(failedUpdate.error), "error");
  }
}

function normalizeStatus(status) {
  const normalized = String(status || "Submitted").trim().toLowerCase();
  if (["in progress", "in-progress", "progress", "processing"].includes(normalized)) return "In Progress";
  if (["completed", "complete", "done"].includes(normalized)) return "Completed";
  if (["cancelled", "canceled", "cancel"].includes(normalized)) return "Cancelled";
  return "Submitted";
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













