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

const translations = {
  EN: {
    mainMenu: "Main Menu",
    dashboard: "Dashboard",
    changeovers: "Changeovers",
    adminRole: "Administrator",
    executiveAnalytics: "Executive Analytics",
    executiveSubtitle: "High-level performance metrics and trends",
    totalToday: "Total Today",
    target: "Target",
    avgDuration: "Avg Duration",
    goal: "Goal",
    completed: "Completed",
    pending: "Pending",
    rate: "rate",
    inProgress: "In Progress",
    inProcess: "In process",
    performanceTrend: "7 Working-Day Performance Trend",
    smedCaption: "Every second counts in the Single-Minute Exchange of Die (SMED).",
    statusDistribution: "Status Distribution",
    total: "Total",
    changeoverRequests: "Changeover Requests",
    manageSmed: "Manage and track SMED operations",
    bulkAdd: "Bulk Add",
    newRequest: "New Request",
    searchPlaceholder: "Search by model or line...",
    filters: "Filters",
    status: "Status",
    allStatuses: "All Statuses",
    submitted: "Submitted",
    cancelled: "Cancelled",
    classification: "Classification",
    allClassifications: "All Classifications",
    planned: "Planned",
    delayed: "Delayed",
    unplanned: "Unplanned",
    process: "Process",
    allProcesses: "All Processes",
    stitching: "STITCHING",
    lineChangeover: "Line Changeover",
    moldChangeover: "Mold Changeover",
    line: "Line",
    allLines: "All Lines",
    clear: "Clear",
    noRequestsFound: "No changeover requests found.",
    selectModel: "Select Model",
    selectLine: "Select Line",
    selectWorkshopFirst: "Select Workshop First",
    filterAria: "Search filters",
    createRequestSubtitle: "Create a structured changeover request",
    newChangeoverRequest: "New Changeover Request",
    formIntro: "Set up the process, model transition, timing, and responsibility groups.",
    changeoverType: "Changeover Type",
    machine: "Machine",
    locationUnit: "Location & Unit",
    plant: "Plant",
    workshop: "Workshop",
    productionLine: "Production Line",
    modelTransition: "Model Transition",
    fromModel: "From Model",
    toModel: "To Model",
    scheduleResponsibility: "Schedule & Responsibility",
    plannedStartTime: "Planned Start Time",
    plannedDuration: "Planned Duration (Minutes)",
    responsibleTeams: "Responsible Teams (Specific Groups)",
    responsibleRoles: "Responsible Roles (Legacy)",
    notes: "Notes",
    requestNotes: "Request Notes",
    notePlaceholder: "Add changeover details, constraints, or preparation notes",
    cancel: "Cancel",
    createRequest: "Create Request",
    complete: "Complete",
    delete: "Delete",
    targetLabel: "Target",
    actual: "Actual",
    started: "Started",
  },
  VI: {
    mainMenu: "Menu chính",
    dashboard: "Bảng điều khiển",
    changeovers: "Chuyển đổi",
    adminRole: "Quản trị viên",
    executiveAnalytics: "Phân tích điều hành",
    executiveSubtitle: "Chỉ số hiệu suất và xu hướng tổng quan",
    totalToday: "Tổng hôm nay",
    target: "Mục tiêu",
    avgDuration: "Thời gian TB",
    goal: "Mục tiêu",
    completed: "Hoàn thành",
    pending: "Đang chờ",
    rate: "tỷ lệ",
    inProgress: "Đang thực hiện",
    inProcess: "đang xử lý",
    performanceTrend: "Xu hướng 7 ngày làm việc",
    smedCaption: "Từng giây đều quan trọng trong SMED.",
    statusDistribution: "Phân bổ trạng thái",
    total: "Tổng",
    changeoverRequests: "Yêu cầu chuyển đổi",
    manageSmed: "Quản lý và theo dõi hoạt động SMED",
    bulkAdd: "Thêm hàng loạt",
    newRequest: "Yêu cầu mới",
    searchPlaceholder: "Tìm theo model hoặc line...",
    filters: "Bộ lọc",
    status: "Trạng thái",
    allStatuses: "Tất cả trạng thái",
    submitted: "Đã gửi",
    cancelled: "Đã hủy",
    classification: "Phân loại",
    allClassifications: "Tất cả phân loại",
    planned: "Kế hoạch",
    delayed: "Trễ",
    unplanned: "Ngoài kế hoạch",
    process: "Công đoạn",
    allProcesses: "Tất cả công đoạn",
    stitching: "STITCHING",
    lineChangeover: "Chuyển đổi line",
    moldChangeover: "Chuyển đổi khuôn",
    line: "Line",
    allLines: "Tất cả line",
    clear: "Xóa lọc",
    noRequestsFound: "Không tìm thấy yêu cầu chuyển đổi.",
    selectModel: "Chọn model",
    selectLine: "Chọn line",
    selectWorkshopFirst: "Chọn xưởng trước",
    filterAria: "Bộ lọc tìm kiếm",
    createRequestSubtitle: "Tạo yêu cầu chuyển đổi có cấu trúc",
    newChangeoverRequest: "Yêu cầu chuyển đổi mới",
    formIntro: "Thiết lập quy trình, model, thời gian và vai trò phụ trách.",
    changeoverType: "Loại chuyển đổi",
    machine: "Máy móc",
    locationUnit: "Vị trí & đơn vị",
    plant: "Nhà máy",
    workshop: "Xưởng",
    productionLine: "Line sản xuất",
    modelTransition: "Chuyển đổi model",
    fromModel: "Model hiện tại",
    toModel: "Model mới",
    scheduleResponsibility: "Lịch & phụ trách",
    plannedStartTime: "Thời gian bắt đầu",
    plannedDuration: "Thời lượng dự kiến (phút)",
    responsibleTeams: "Nhóm phụ trách",
    responsibleRoles: "Vai trò phụ trách",
    notes: "Ghi chú",
    requestNotes: "Ghi chú yêu cầu",
    notePlaceholder: "Thêm chi tiết chuyển đổi, ràng buộc hoặc ghi chú chuẩn bị",
    cancel: "Hủy",
    createRequest: "Tạo yêu cầu",
    complete: "Hoàn thành",
    delete: "Xóa",
    targetLabel: "Mục tiêu",
    actual: "Thực tế",
    started: "Bắt đầu",
  },
  KO: {
    mainMenu: "메인 메뉴",
    dashboard: "대시보드",
    changeovers: "체인지오버",
    adminRole: "관리자",
    executiveAnalytics: "경영 분석",
    executiveSubtitle: "성과 지표와 추세 요약",
    totalToday: "오늘 합계",
    target: "목표",
    avgDuration: "평균 시간",
    goal: "목표",
    completed: "완료",
    pending: "대기",
    rate: "비율",
    inProgress: "진행 중",
    inProcess: "진행 중",
    performanceTrend: "7 근무일 성과 추세",
    smedCaption: "SMED에서는 매초가 중요합니다.",
    statusDistribution: "상태 분포",
    total: "합계",
    changeoverRequests: "체인지오버 요청",
    manageSmed: "SMED 작업 관리 및 추적",
    bulkAdd: "일괄 추가",
    newRequest: "새 요청",
    searchPlaceholder: "모델 또는 라인 검색...",
    filters: "필터",
    status: "상태",
    allStatuses: "전체 상태",
    submitted: "제출됨",
    cancelled: "취소됨",
    classification: "분류",
    allClassifications: "전체 분류",
    planned: "계획",
    delayed: "지연",
    unplanned: "비계획",
    process: "공정",
    allProcesses: "전체 공정",
    stitching: "STITCHING",
    lineChangeover: "라인 체인지오버",
    moldChangeover: "금형 교체",
    line: "라인",
    allLines: "전체 라인",
    clear: "초기화",
    noRequestsFound: "체인지오버 요청을 찾을 수 없습니다.",
    selectModel: "모델 선택",
    selectLine: "라인 선택",
    selectWorkshopFirst: "작업장을 먼저 선택",
    filterAria: "검색 필터",
    createRequestSubtitle: "구조화된 체인지오버 요청 생성",
    newChangeoverRequest: "새 체인지오버 요청",
    formIntro: "공정, 모델 전환, 일정 및 담당 그룹을 설정합니다.",
    changeoverType: "체인지오버 유형",
    machine: "설비",
    locationUnit: "위치 및 단위",
    plant: "공장",
    workshop: "작업장",
    productionLine: "생산 라인",
    modelTransition: "모델 전환",
    fromModel: "기존 모델",
    toModel: "대상 모델",
    scheduleResponsibility: "일정 및 담당",
    plannedStartTime: "예정 시작 시간",
    plannedDuration: "예정 시간 (분)",
    responsibleTeams: "담당 팀",
    responsibleRoles: "담당 역할",
    notes: "메모",
    requestNotes: "요청 메모",
    notePlaceholder: "체인지오버 세부사항, 제약사항 또는 준비 메모를 입력하세요",
    cancel: "취소",
    createRequest: "요청 생성",
    complete: "완료",
    delete: "삭제",
    targetLabel: "목표",
    actual: "실제",
    started: "시작",
  },
};

const requestGrid = document.querySelector("[data-request-grid]");
const requestForm = document.querySelector(".request-form");
const searchInput = document.querySelector("[data-request-search]");
const dashboard = document.querySelector("[data-dashboard]");
const filterPanel = document.querySelector("[data-filter-panel]");
const filterToggle = document.querySelector("[data-filter-toggle]");
const filterClear = document.querySelector("[data-filter-clear]");
const filterInputs = {
  status: document.querySelector("[data-filter-status]"),
  classification: document.querySelector("[data-filter-classification]"),
  process: document.querySelector("[data-filter-process]"),
  line: document.querySelector("[data-filter-line]"),
};

let loadedRequests = [];
let loadedDashboardRecords = [];

const mobileButton = document.querySelector(".mobile-menu");
const sidebar = document.querySelector(".sidebar");

function setMobileSidebarOpen(isOpen) {
  sidebar?.classList.toggle("open", isOpen);
  document.body.classList.toggle("sidebar-open", isOpen);
  mobileButton?.classList.toggle("selected", isOpen);
  mobileButton?.setAttribute("aria-expanded", String(isOpen));
}

mobileButton?.setAttribute("aria-expanded", "false");

mobileButton?.addEventListener("click", () => {
  setMobileSidebarOpen(!sidebar?.classList.contains("open"));
});

sidebar?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMobileSidebarOpen(false));
});

document.addEventListener("click", (event) => {
  if (!sidebar?.classList.contains("open")) return;
  if (sidebar.contains(event.target) || mobileButton?.contains(event.target)) return;
  setMobileSidebarOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMobileSidebarOpen(false);
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
const fromModelSelect = requestForm?.querySelector("[name='from_model']");
const toModelSelect = requestForm?.querySelector("[name='to_model']");
const plannedStartInput = requestForm?.querySelector("[name='planned_start']");
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
  placeholder.textContent = workshopSelect.value ? translate("selectLine") : translate("selectWorkshopFirst");
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

const savedTheme = localStorage.getItem("smed_theme") || "dark";
const savedLanguage = localStorage.getItem("smed_language") || "EN";
applyTheme(savedTheme, { persist: false });
applyLanguage(savedLanguage, { persist: false, rerender: false });
window.lucide?.createIcons();

[fromModelSelect, toModelSelect].forEach((select) => {
  select?.addEventListener("change", validateModelTransition);
});

plannedStartInput?.addEventListener("change", validatePlannedStart);
plannedStartInput?.addEventListener("input", validatePlannedStart);

document.querySelectorAll(".language-switch").forEach((switcher) => {
  const buttons = [...switcher.querySelectorAll("button")];
  const activeLanguage = document.documentElement.dataset.language || "EN";

  buttons.forEach((languageButton) => {
    const isSelected = languageButton.textContent.trim() === activeLanguage;
    languageButton.classList.toggle("selected", isSelected);
    languageButton.setAttribute("aria-pressed", String(isSelected));
  });

  switcher.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const selectedLanguage = button.textContent.trim();
    applyLanguage(selectedLanguage);

    buttons.forEach((languageButton) => {
      const isSelected = languageButton === button;
      languageButton.classList.toggle("selected", isSelected);
      languageButton.setAttribute("aria-pressed", String(isSelected));
    });
  });
});

document.querySelectorAll("[aria-label='Toggle theme']").forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme(document.body.classList.contains("light-theme") ? "dark" : "light");
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
  if (!validateModelTransition({ report: true })) return false;
  if (!validatePlannedStart({ report: true })) return false;
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

function validateModelTransition(options = {}) {
  if (!fromModelSelect || !toModelSelect) return true;

  const hasSameModel =
    fromModelSelect.value &&
    toModelSelect.value &&
    fromModelSelect.value === toModelSelect.value;
  const message = hasSameModel ? "From Model and To Model cannot be the same." : "";

  fromModelSelect.setCustomValidity(message);
  toModelSelect.setCustomValidity(message);

  if (hasSameModel && options.report) {
    (document.activeElement === fromModelSelect ? fromModelSelect : toModelSelect).reportValidity();
    showNotice(message, "error");
  }

  return !hasSameModel;
}

function validatePlannedStart(options = {}) {
  if (!plannedStartInput) return true;

  const start = new Date(plannedStartInput.value);
  const now = new Date();
  now.setSeconds(0, 0);
  const isPastTime = plannedStartInput.value && !Number.isNaN(start.getTime()) && start < now;
  const message = isPastTime ? "Planned start time cannot be in the past." : "";

  plannedStartInput.setCustomValidity(message);

  if (isPastTime && options.report) {
    plannedStartInput.reportValidity();
    showNotice(message, "error");
  }

  return !isPastTime;
}


document.querySelectorAll(".search-panel > button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("selected");
  });
});

searchInput?.addEventListener("input", () => {
  refreshRequestGrid();
});

filterToggle?.addEventListener("click", () => {
  filterPanel.hidden = !filterPanel.hidden;
});

Object.values(filterInputs).forEach((input) => {
  input?.addEventListener("change", refreshRequestGrid);
});

filterClear?.addEventListener("click", () => {
  searchInput.value = "";
  Object.values(filterInputs).forEach((input) => {
    if (input) input.value = "";
  });
  filterToggle?.classList.remove("selected");
  refreshRequestGrid();
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
loadDashboard();
window.setInterval(refreshTimedStatuses, 60000);

async function loadRequests() {
  if (!requestGrid) return;

  if (!isSupabaseConfigured) {
    loadedRequests = sampleRequests;
    hydrateLineFilter(loadedRequests);
    renderRequests(loadedRequests);
    showNotice("Add your Supabase URL and anon key in supabase/supabase.js to use live data.", "warning");
    return;
  }

  const { data, error } = await supabase
    .from(CHANGEOVER_TABLE)
    .select("*");

  if (error) {
    loadedRequests = sampleRequests;
    hydrateLineFilter(loadedRequests);
    renderRequests(loadedRequests);
    showNotice(error.message, "error");
    return;
  }

  loadedRequests = applyTimedStatuses(data || []);
  hydrateLineFilter(loadedRequests);
  renderRequests(loadedRequests);
  await syncTimedStatuses(loadedRequests, data || []);
}

async function loadDashboard() {
  if (!dashboard) return;

  if (!isSupabaseConfigured) {
    loadedDashboardRecords = applyTimedStatuses(sampleRequests);
    renderDashboard(loadedDashboardRecords);
    showNotice("Add your Supabase URL and anon key in supabase/supabase.js to use live dashboard data.", "warning");
    return;
  }

  const { data, error } = await supabase
    .from(CHANGEOVER_TABLE)
    .select("*");

  if (error) {
    loadedDashboardRecords = applyTimedStatuses(sampleRequests);
    renderDashboard(loadedDashboardRecords);
    showNotice(formatSupabaseError(error), "error");
    return;
  }

  loadedDashboardRecords = applyTimedStatuses(data || []);
  renderDashboard(loadedDashboardRecords);
}

function renderDashboard(records) {
  const allRecords = [...getDraftRequests(), ...records].map((record) => ({
    ...record,
    status: getTimedStatus(record),
  }));

  const total = allRecords.length;
  const today = formatDateKey(new Date());
  const todayRecords = allRecords.filter((record) => formatDateKey(getRecordDate(record)) === today);
  const completed = allRecords.filter((record) => normalizeStatus(record.status) === "Completed");
  const pending = allRecords.filter((record) => ["Submitted", "In Progress"].includes(normalizeStatus(record.status)));
  const avgDuration = average(allRecords.map((record) => Number(getActualDuration(record))).filter(Number.isFinite));
  const targetToday = 20;
  const durationGoal = 25;

  setText("[data-metric-total]", todayRecords.length);
  setText("[data-metric-total-detail]", `${translate("target")}: ${targetToday}`);
  setMetricChange("[data-metric-total-change]", percentDelta(todayRecords.length, targetToday), true);
  setText("[data-metric-duration]", `${Math.round(avgDuration || 0)}m`);
  setText("[data-metric-duration-detail]", `${translate("goal")}: ${durationGoal}m`);
  setMetricChange("[data-metric-duration-change]", percentDelta(avgDuration || 0, durationGoal), false);
  setText("[data-metric-completed]", completed.length);
  setText("[data-metric-completed-detail]", `${total ? Math.round((completed.length / total) * 100) : 0}% ${translate("rate")}`);
  setText("[data-metric-pending]", pending.length);
  setText("[data-metric-pending-detail]", `${pending.filter((record) => normalizeStatus(record.status) === "In Progress").length} ${translate("inProcess")}`);
  setText("[data-status-total]", total);

  renderTrendChart(allRecords);
  renderStatusBreakdown(allRecords);
  window.lucide?.createIcons();
}

function renderTrendChart(records) {
  const chart = document.querySelector("[data-trend-chart]");
  if (!chart) return;

  const days = getRecentNonSundayDays(7).map((date) => ({
    key: formatDateKey(date),
    label: new Intl.DateTimeFormat(getDateLocale(), { weekday: "short" }).format(date),
    count: 0,
  }));

  records.forEach((record) => {
    const key = formatDateKey(getRecordDate(record));
    const day = days.find((item) => item.key === key);
    if (day) day.count += 1;
  });

  const maxCount = Math.max(...days.map((day) => day.count), 1);
  const previous = days[5]?.count || 0;
  const latest = days[6]?.count || 0;
  setMetricChange("[data-trend-change]", percentDelta(latest, previous || 1), true);

  chart.innerHTML = days
    .map((day) => {
      const height = Math.max(10, Math.round((day.count / maxCount) * 100));
      return `
        <div class="trend-day">
          <div class="trend-bar-wrap">
            <span class="trend-bar" style="height: ${height}%"></span>
          </div>
          <strong>${day.count}</strong>
          <small>${day.label}</small>
        </div>
      `;
    })
    .join("");
}

function renderStatusBreakdown(records) {
  const target = document.querySelector("[data-status-breakdown]");
  const pie = document.querySelector("[data-status-pie]");
  if (!target || !pie) return;

  const statuses = ["Submitted", "In Progress", "Completed", "Cancelled"];
  const counts = statuses.map((status) => ({
    status,
    count: records.filter((record) => normalizeStatus(record.status) === status).length,
  }));
  const total = counts.reduce((sum, item) => sum + item.count, 0);
  const colors = {
    Submitted: "#3b82f6",
    "In Progress": "#f59e0b",
    Completed: "#10c784",
    Cancelled: "#fb7185",
  };
  let cursor = 0;
  const segments = counts
    .map((item) => {
      const percent = total ? (item.count / total) * 100 : 0;
      const start = cursor;
      cursor += percent;
      return `${colors[item.status]} ${start}% ${cursor}%`;
    })
    .join(", ");

  pie.style.background = total
    ? `conic-gradient(${segments})`
    : "conic-gradient(rgba(255, 255, 255, 0.12) 0% 100%)";

  target.innerHTML = counts
    .map(
      (item) => `
        <article style="--status-color: ${colors[item.status]}">
          <span>${escapeHtml(translateStatus(item.status))}</span>
          <strong>${total ? Math.round((item.count / total) * 100) : 0}%</strong>
          <em>${item.count}</em>
        </article>
      `,
    )
    .join("");
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
    actual_duration: 1,
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
    `<p class="empty-state">${escapeHtml(translate("noRequestsFound"))}</p>`;

  window.lucide?.createIcons();
}

function createRequestCard(request) {
  const status = getTimedStatus(request);
  const statusClass = status.toLowerCase().replace(/\s+/g, "-");
  const isCompleted = status === "Completed";
  const isScheduledForFuture = !hasRequestStarted(request);
  const actual = getActualDuration(request, status);
  const planned = getPlannedDuration(request);
  const started = formatDate(request.time || request.planned_start || request.created_at);
  const line = request.production_line || request.line || "--";
  const group = request.team || request.tean || request.responsible_group || (request.type || "T").charAt(0);

  return `
    <article class="request-card status-${statusClass}" data-request-id="${escapeHtml(request.id)}">
      <div class="card-content">
        <div class="badges">
          <span>${escapeHtml(request.process || request.type || "Changeover")}</span>
          <mark>${escapeHtml(translateStatus(status))}</mark>
        </div>
        <h2>${escapeHtml(request.from_model || "--")} <i data-lucide="chevron-right"></i> <strong>${escapeHtml(request.to_model || "--")}</strong></h2>
        <dl>
          <div>
            <dt><i data-lucide="factory"></i>${translate("plant")}</dt>
            <dd>${escapeHtml(request.plant || "--")}</dd>
          </div>
          <div>
            <dt><i data-lucide="microchip"></i>${translate("line")}</dt>
            <dd>${escapeHtml(line)}</dd>
          </div>
          <div>
            <dt><i data-lucide="calendar-days"></i>${translate("started")}</dt>
            <dd>${started}</dd>
          </div>
          <div>
            <dt><i data-lucide="clock-3"></i>${translate("actual")} / ${translate("targetLabel")}</dt>
            <dd><span class="actual-duration">${formatDurationValue(actual)}</span><span class="duration-divider">/</span>${formatDurationValue(planned)}</dd>
          </div>
        </dl>
        <div class="card-actions" aria-label="Request actions">
          <button class="delete-button" type="button" data-request-action="delete">
            <i data-lucide="trash-2"></i>${translate("delete")}
          </button>
          <button class="complete-button" type="button" data-request-action="complete" ${isScheduledForFuture || isCompleted ? "disabled" : ""}>
            <i data-lucide="circle-check"></i>${translate("complete")}
          </button>
        </div>
      </div>
    </article>
  `;
}

async function completeRequest(requestId) {
  if (requestId.startsWith("draft-")) {
    const draft = getDraftRequests().find((request) => request.id === requestId);
    if (!hasRequestStarted(draft)) {
      showNotice("This request cannot be completed before its start time.", "error");
      return;
    }
    updateDraftRequest(requestId, { status: "Completed", actual_duration: calculateActualDuration(draft) });
    showNotice("Draft marked completed.", "success");
    refreshRequestGrid();
    return;
  }

  if (!isSupabaseConfigured) return;

  const request = loadedRequests.find((item) => String(item.id) === String(requestId));
  if (!hasRequestStarted(request)) {
    showNotice("This request cannot be completed before its start time.", "error");
    return;
  }

  const actualDuration = calculateActualDuration(request);

  const { data, error } = await supabase
    .from(CHANGEOVER_TABLE)
    .update({ status: "Completed", actual_duration: actualDuration })
    .eq("id", requestId)
    .select("id, status, actual_duration")
    .maybeSingle();

  if (error) {
    showNotice(formatSupabaseError(error, "update"), "error");
    return;
  }

  if (!data) {
    showNotice("Supabase did not update actual_duration. Check the update policy for changeover_records.", "error");
    return;
  }

  loadedRequests = loadedRequests.map((request) =>
    String(request.id) === String(requestId)
      ? { ...request, status: data.status || "Completed", actual_duration: data.actual_duration ?? actualDuration }
      : request,
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
    showNotice(formatSupabaseError(error, "delete"), "error");
    return;
  }

  const { data: existingRecord, error: verifyError } = await supabase
    .from(CHANGEOVER_TABLE)
    .select("id")
    .eq("id", requestId)
    .maybeSingle();

  if (verifyError) {
    showNotice(formatSupabaseError(verifyError, "verify delete"), "error");
    return;
  }

  if (existingRecord) {
    showNotice("Supabase did not delete this record. Check the delete policy for changeover_records.", "error");
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
  renderRequests(filterRequests(searchInput?.value || ""), { includeDrafts: false });
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
  return requests.map((request) => {
    const status = getTimedStatus(request);
    return {
      ...request,
      status,
    };
  });
}

async function syncTimedStatuses(timedRequests, originalRequests) {
  if (!isSupabaseConfigured) return;

  const updates = timedRequests.filter((request) => {
    const original = originalRequests.find((item) => String(item.id) === String(request.id));
    if (!original) return false;

    return normalizeStatus(original.status) !== request.status;
  });

  const results = await Promise.all(updates.map((request) =>
    supabase
      .from(CHANGEOVER_TABLE)
      .update({
        status: request.status,
      })
      .eq("id", request.id)
      .select("id"),
  ));

  const failedUpdate = results.find((result) => result.error || !result.data?.length);
  if (failedUpdate) {
    showNotice(
      failedUpdate.error
        ? formatSupabaseError(failedUpdate.error, "update")
        : "Supabase did not update timed status. Check the update policy for changeover_records.",
      "error",
    );
  }
}

function normalizeStatus(status) {
  const normalized = String(status || "Submitted").trim().toLowerCase();
  if (["in progress", "in-progress", "progress", "processing"].includes(normalized)) return "In Progress";
  if (["completed", "complete", "done"].includes(normalized)) return "Completed";
  if (["cancelled", "canceled", "cancel"].includes(normalized)) return "Cancelled";
  return "Submitted";
}

function getPlannedDuration(request = {}) {
  return request.duration ?? request.planned_duration_minutes ?? "--";
}

function getActualDuration(request = {}, status = normalizeStatus(request.status)) {
  if (status === "Cancelled") return 0;
  if (status !== "Completed") return "--";

  if (request.actual_duration !== null && request.actual_duration !== undefined) return request.actual_duration;
  if (request.actual_duration_minutes !== null && request.actual_duration_minutes !== undefined) return request.actual_duration_minutes;
  return "--";
}

function calculateActualDuration(request = {}, now = new Date()) {
  const startValue = request.time || request.planned_start || request.created_at;
  if (!startValue) return 0;

  const start = new Date(startValue);
  if (Number.isNaN(start.getTime())) return 0;

  return Math.max(1, Math.round((now.getTime() - start.getTime()) / 60000));
}

function hasRequestStarted(request = {}, now = new Date()) {
  const startValue = request.time || request.planned_start;
  if (!startValue) return true;

  const start = new Date(startValue);
  if (Number.isNaN(start.getTime())) return true;

  return now >= start;
}

function formatDurationValue(value) {
  if (value === "--" || value === null || value === undefined || value === "") return "--";
  return `${escapeHtml(value)}m`;
}
function filterRequests(query) {
  const normalizedQuery = query.trim().toLowerCase();
  const searchableRequests = [...getDraftRequests(), ...loadedRequests];
  const filters = getRequestFilters();

  return searchableRequests.filter((request) => {
    const matchesQuery =
      !normalizedQuery ||
      [request.from_model, request.to_model, request.production_line, request.line]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    const matchesStatus = !filters.status || normalizeStatus(request.status) === filters.status;
    const matchesClassification = !filters.classification || request.classification === filters.classification;
    const matchesProcess = !filters.process || String(request.process || "").toLowerCase() === filters.process.toLowerCase();
    const matchesLine = !filters.line || (request.production_line || request.line) === filters.line;

    return matchesQuery && matchesStatus && matchesClassification && matchesProcess && matchesLine;
  });
}

function getRequestFilters() {
  return {
    status: filterInputs.status?.value || "",
    classification: filterInputs.classification?.value || "",
    process: filterInputs.process?.value || "",
    line: filterInputs.line?.value || "",
  };
}

function hydrateLineFilter(requests) {
  const select = filterInputs.line;
  if (!select) return;

  const selectedValue = select.value;
  const lines = [...new Set(requests.map((request) => request.production_line || request.line).filter(Boolean))].sort();
  select.innerHTML = `<option value="">All Lines</option>`;

  lines.forEach((line) => {
    const option = document.createElement("option");
    option.value = line;
    option.textContent = line;
    select.append(option);
  });

  if (lines.includes(selectedValue)) select.value = selectedValue;
  translateFilters();
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function applyTheme(theme, options = {}) {
  const normalizedTheme = theme === "light" ? "light" : "dark";
  document.body.classList.toggle("light-theme", normalizedTheme === "light");
  document.documentElement.dataset.theme = normalizedTheme;

  document.querySelectorAll("[aria-label='Toggle theme']").forEach((button) => {
    button.classList.toggle("selected", normalizedTheme === "light");
    button.setAttribute("aria-pressed", String(normalizedTheme === "light"));
    button.querySelector("i")?.setAttribute("data-lucide", normalizedTheme === "light" ? "moon" : "sun");
  });

  if (options.persist !== false) {
    localStorage.setItem("smed_theme", normalizedTheme);
  }

  window.lucide?.createIcons();
}

function applyLanguage(language, options = {}) {
  const normalizedLanguage = ["VI", "EN", "KO"].includes(language) ? language : "EN";
  document.documentElement.lang = normalizedLanguage.toLowerCase();
  document.documentElement.dataset.language = normalizedLanguage;
  translatePage();
  if (options.rerender !== false) {
    if (requestGrid) refreshRequestGrid();
    if (dashboard && loadedDashboardRecords.length) renderDashboard(loadedDashboardRecords);
  }

  if (options.persist !== false) {
    localStorage.setItem("smed_language", normalizedLanguage);
  }
}

function translate(key) {
  const language = document.documentElement.dataset.language || "EN";
  return translations[language]?.[key] || translations.EN[key] || key;
}

function translateStatus(status) {
  const normalizedStatus = normalizeStatus(status);
  const keys = {
    Submitted: "submitted",
    "In Progress": "inProgress",
    Completed: "completed",
    Cancelled: "cancelled",
  };
  return translate(keys[normalizedStatus] || "submitted");
}

function translatePage() {
  setTextAll(".menu p", translate("mainMenu"));
  setTextForLinks('.menu a[href="dashboard.html"]', translate("dashboard"));
  setTextForLinks('.menu a[href="changeover.html"], .menu a.active[href="#"]', translate("changeovers"));
  setTextAll(".profile small, .user-card span", translate("adminRole"));
  setTextAll(".section-label", document.body.classList.contains("dashboard-page") ? translate("dashboard") : translate("changeovers"));

  setTextAll(".dashboard-heading h1", translate("executiveAnalytics"));
  setTextAll(".dashboard-heading p", translate("executiveSubtitle"));
  setTextAll(".metric-card:nth-child(1) small", translate("totalToday"));
  setTextAll(".metric-card:nth-child(2) small", translate("avgDuration"));
  setTextAll(".metric-card:nth-child(3) small", translate("completed"));
  setTextAll(".metric-card:nth-child(4) small", translate("pending"));
  setTextAll(".panel-head h2", translate("performanceTrend"));
  setTextAll(".panel-head p", translate("smedCaption"));
  setTextAll(".status-panel h2", translate("statusDistribution"));
  setTextAll(".status-total span", translate("total"));

  setTextAll(".page-head h1", requestForm ? translate("newRequest") : translate("changeoverRequests"));
  setTextAll(".page-head p", requestForm ? translate("createRequestSubtitle") : translate("manageSmed"));
  setButtonText(".secondary-button", "layers-3", translate("bulkAdd"));
  setLinkButtonText('a.primary-button[href="new-request.html"]', "plus", translate("newRequest"));
  setPlaceholder("[data-request-search]", translate("searchPlaceholder"));
  setButtonText("[data-filter-toggle]", "funnel", translate("filters"));
  translateFilters();

  if (requestForm) translateRequestForm();
  window.lucide?.createIcons();
}

function translateFilters() {
  setTextAll("[data-filter-panel] label:nth-child(1) span", translate("status"));
  setTextAll("[data-filter-panel] label:nth-child(2) span", translate("classification"));
  setTextAll("[data-filter-panel] label:nth-child(3) span", translate("process"));
  setTextAll("[data-filter-panel] label:nth-child(4) span", translate("line"));
  setSelectText("[data-filter-status]", {
    "": translate("allStatuses"),
    Submitted: translate("submitted"),
    "In Progress": translate("inProgress"),
    Completed: translate("completed"),
    Cancelled: translate("cancelled"),
  });
  setSelectText("[data-filter-classification]", {
    "": translate("allClassifications"),
    Planned: translate("planned"),
    Delayed: translate("delayed"),
    Unplanned: translate("unplanned"),
  });
  setSelectText("[data-filter-process]", {
    "": translate("allProcesses"),
    STITCHING: translate("stitching"),
  });
  setSelectText("[data-filter-line]", { "": translate("allLines") });
  setButtonText("[data-filter-clear]", "rotate-ccw", translate("clear"));
  filterToggle?.setAttribute("aria-label", translate("filterAria"));
}

function translateRequestForm() {
  setTextAll(".form-header h2", translate("newChangeoverRequest"));
  setTextAll(".form-header p", translate("formIntro"));
  setTextAll(".form-card:nth-of-type(1) h3", translate("changeoverType"));
  setRadioLabelText("type", "Process", "folder-cog", translate("process"));
  setRadioLabelText("type", "Machine", "settings-2", translate("machine"));
  setHeadingWithIcon(".form-card:nth-of-type(2) h3", "map-pin", translate("locationUnit"));
  setTextAll("[name='plant'] + span", translate("plant"));
  setTextAll(".form-card:nth-of-type(2) label:nth-child(1) span", translate("plant"));
  setTextAll(".form-card:nth-of-type(2) label:nth-child(2) span", translate("workshop"));
  setTextAll(".form-card:nth-of-type(2) label:nth-child(3) span", translate("process"));
  setTextAll(".form-card:nth-of-type(2) label:nth-child(4) span", translate("productionLine"));
  setHeadingWithIcon(".form-card:nth-of-type(3) h3", "shuffle", translate("modelTransition"));
  setTextAll(".form-card:nth-of-type(3) label:nth-child(1) span", translate("fromModel"));
  setTextAll(".form-card:nth-of-type(3) label:nth-child(2) span", translate("toModel"));
  setHeadingWithIcon(".form-card:nth-of-type(4) h3", "circle-dot", translate("classification"));
  setRadioLabelText("classification", "Planned", null, translate("planned"));
  setRadioLabelText("classification", "Delayed", null, translate("delayed"));
  setRadioLabelText("classification", "Unplanned", null, translate("unplanned"));
  setHeadingWithIcon(".form-card:nth-of-type(5) h3", "clock-4", translate("scheduleResponsibility"));
  setTextAll(".form-card:nth-of-type(5) .form-grid label:nth-child(1) span", translate("plannedStartTime"));
  setTextAll(".form-card:nth-of-type(5) .form-grid label:nth-child(2) span", translate("plannedDuration"));
  setTextAll(".form-card:nth-of-type(5) .group-field:nth-of-type(1) > span", translate("responsibleRoles"));
  setHeadingWithIcon(".form-card:nth-of-type(6) h3", "notebook-pen", translate("notes"));
  setTextAll(".form-card:nth-of-type(6) label span", translate("requestNotes"));
  setSelectText("select[name='from_model']", { "": translate("selectModel") });
  setSelectText("select[name='to_model']", { "": translate("selectModel") });
  setSelectText("select[name='production_line']", {
    "": productionLineSelect?.disabled ? translate("selectWorkshopFirst") : translate("selectLine"),
  });
  setPlaceholder("textarea[name='note']", translate("notePlaceholder"));
  setLinkButtonText('.form-actions a[href="changeover.html"]', null, translate("cancel"));
  setButtonText(".form-actions button[type='submit']", "send", translate("createRequest"));
}

function setTextAll(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function setPlaceholder(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.placeholder = value;
  });
}

function setTextForLinks(selector, value) {
  document.querySelectorAll(selector).forEach((link) => {
    const icon = link.querySelector("i")?.outerHTML || "";
    link.innerHTML = `${icon}${value}`;
  });
}

function setButtonText(selector, iconName, value) {
  document.querySelectorAll(selector).forEach((button) => {
    button.innerHTML = `${iconName ? `<i data-lucide="${iconName}"></i>` : ""}${value}`;
  });
}

function setLinkButtonText(selector, iconName, value) {
  document.querySelectorAll(selector).forEach((link) => {
    link.innerHTML = `${iconName ? `<i data-lucide="${iconName}"></i>` : ""}${value}`;
  });
}

function setHeadingWithIcon(selector, iconName, value) {
  document.querySelectorAll(selector).forEach((heading) => {
    heading.innerHTML = `<i data-lucide="${iconName}"></i>${value}`;
  });
}

function setRadioLabelText(name, value, iconName, labelText) {
  const input = document.querySelector(`input[name='${name}'][value='${value}']`);
  const label = input?.closest("label");
  if (!label) return;

  label.innerHTML = "";
  label.append(input);
  if (iconName) {
    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", iconName);
    label.append(icon);
  }
  label.append(document.createTextNode(labelText));
}

function setSelectText(selector, labelsByValue) {
  document.querySelectorAll(`${selector} option`).forEach((option) => {
    const key = option.value;
    if (Object.prototype.hasOwnProperty.call(labelsByValue, key)) {
      option.textContent = labelsByValue[key];
    }
  });
}

function setMetricChange(selector, value, higherIsBetter) {
  const element = document.querySelector(selector);
  if (!element) return;

  const roundedValue = Math.round(value);
  const isPositive = roundedValue >= 0;
  element.textContent = `${isPositive ? "+" : ""}${roundedValue}%`;
  element.classList.toggle("negative", higherIsBetter ? !isPositive : isPositive);
}

function percentDelta(value, baseline) {
  if (!baseline) return value ? 100 : 0;
  return ((value - baseline) / baseline) * 100;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getRecentNonSundayDays(dayCount) {
  const days = [];
  const date = new Date();

  while (days.length < dayCount) {
    if (date.getDay() !== 0) {
      days.unshift(new Date(date));
    }
    date.setDate(date.getDate() - 1);
  }

  return days;
}

function getRecordDate(record) {
  const value = record?.time || record?.planned_start || record?.created_at;
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function formatDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatDate(value) {
  if (!value) return "--";
  return new Intl.DateTimeFormat(getDateLocale(), {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getDateLocale() {
  const language = document.documentElement.dataset.language || "EN";
  return {
    EN: "en",
    VI: "vi-VN",
    KO: "ko-KR",
  }[language] || "en";
}

function showNotice(message, type = "info") {
  const notice = document.createElement("div");
  notice.className = `notice ${type}`;
  notice.textContent = message;
  document.body.append(notice);
  window.setTimeout(() => notice.remove(), 5200);
}

function formatSupabaseError(error, action = "insert") {
  if (/row-level security policy/i.test(error?.message || "")) {
    return `Supabase blocked this ${action} with RLS. Add a ${action} policy for changeover_records in Supabase.`;
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













