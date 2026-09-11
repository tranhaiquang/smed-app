const AREAS = ["HF", "Silk Screen", "Autocut", "SEMI Cut", "GBOS Cut", "Atom Cut"];

const MODELS = [
  "GKFCY", "GR740", "GT/PTRVL V4", "IZ740", "MW860 V15",
  "MW880 V15", "MW880G V15 GTX", "MWTHIER V9", "MWTHIG V9 GTX",
  "MWTHIMC V9 GTX", "MWTGMG V2 GTX", "PTFCY", "PZ740",
  "U2010X GTX", "U740 V2", "UJMP", "ULDELR V3", "UMDELRS V3",
  "UN770", "USDELS V3",
];

function generateSampleData() {
  const records = [];
  const now = new Date(2026, 8, 11);
  let id = 1;

  const statusWeights = [
    { status: "Completed", weight: 45 },
    { status: "In Progress", weight: 30 },
    { status: "Submitted", weight: 20 },
    { status: "Cancelled", weight: 5 },
  ];

  function pickStatus() {
    const r = Math.random() * 100;
    let cum = 0;
    for (const s of statusWeights) {
      cum += s.weight;
      if (r < cum) return s.status;
    }
    return "Completed";
  }

  function randomDate() {
    const daysAgo = Math.floor(Math.random() * 30);
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(6 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);
    return d.toISOString().slice(0, 16);
  }

  function randomDuration() {
    return 10 + Math.floor(Math.random() * 51);
  }

  function pickModel() {
    return MODELS[Math.floor(Math.random() * MODELS.length)];
  }

  const lines = {
    "HF": ["A01", "A02", "A03", "A04"],
    "Silk Screen": ["B01", "B02", "B03"],
    "Autocut": ["C01", "C02", "C03"],
    "SEMI Cut": ["D01", "D02", "D03"],
    "GBOS Cut": ["E01", "E02", "E03"],
    "Atom Cut": ["F01", "F02", "F03"],
  };

  const teams = ["T", "M", "Q", "E"];

  AREAS.forEach((area) => {
    const count = 10 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const status = pickStatus();
      const classification = Math.random() < 0.7 ? "Planned" : "Unplanned";
      const areaLines = lines[area];
      const line = areaLines[Math.floor(Math.random() * areaLines.length)];
      const start = randomDate();
      const plannedDuration = randomDuration();
      const actualDuration = status === "Completed"
        ? Math.max(1, Math.round(plannedDuration * (0.5 + Math.random() * 0.8)))
        : status === "Cancelled" ? 0 : null;

      records.push({
        id: `sample-${id++}`,
        type: classification === "Planned" ? "Line Changeover" : "Mold Changeover",
        status,
        plant: "SAMHO",
        production_line: `Line ${line}`,
        process: area,
        from_model: pickModel(),
        to_model: pickModel(),
        planned_start: start,
        planned_duration_minutes: plannedDuration,
        actual_duration_minutes: actualDuration,
        responsible_group: teams[Math.floor(Math.random() * teams.length)],
        classification,
      });
    }
  });

  return records;
}

const sampleRequests = generateSampleData();

const testChecklistRecords = [
  {
    id: "test-1",
    type: "Line Changeover",
    status: "In Progress",
    plant: "SAMHO",
    production_line: "Line D01",
    process: "SEMI Cut",
    from_model: "SM-234A",
    to_model: "SM-567B",
    planned_start: "2026-09-11T08:30",
    planned_duration_minutes: 45,
    actual_duration_minutes: null,
    responsible_group: "T",
    classification: "Planned",
  },
  {
    id: "test-2",
    type: "Mold Changeover",
    status: "In Progress",
    plant: "SAMHO",
    production_line: "Line E02",
    process: "GBOS Cut",
    from_model: "GB-112X",
    to_model: "GB-334Y",
    planned_start: "2026-09-11T09:00",
    planned_duration_minutes: 35,
    actual_duration_minutes: null,
    responsible_group: "M",
    classification: "Unplanned",
  },
  {
    id: "test-3",
    type: "Line Changeover",
    status: "In Progress",
    plant: "SAMHO",
    production_line: "Line F01",
    process: "Atom Cut",
    from_model: "AT-890P",
    to_model: "AT-123Q",
    planned_start: "2026-09-11T09:15",
    planned_duration_minutes: 50,
    actual_duration_minutes: null,
    responsible_group: "T",
    classification: "Planned",
  },
  {
    id: "test-4",
    type: "Line Changeover",
    status: "Submitted",
    plant: "SAMHO",
    production_line: "Line A02",
    process: "HF",
    from_model: "HF-445C",
    to_model: "HF-678D",
    planned_start: "2026-09-11T10:00",
    planned_duration_minutes: 30,
    actual_duration_minutes: null,
    responsible_group: "Q",
    classification: "Planned",
  },
  {
    id: "test-5",
    type: "Mold Changeover",
    status: "Submitted",
    plant: "SAMHO",
    production_line: "Line B01",
    process: "Silk Screen",
    from_model: "SS-210M",
    to_model: "SS-320N",
    planned_start: "2026-09-11T10:30",
    planned_duration_minutes: 25,
    actual_duration_minutes: null,
    responsible_group: "E",
    classification: "Unplanned",
  },
  {
    id: "test-6",
    type: "Line Changeover",
    status: "Submitted",
    plant: "SAMHO",
    production_line: "Line C03",
    process: "Autocut",
    from_model: "AC-550R",
    to_model: "AC-780S",
    planned_start: "2026-09-11T11:00",
    planned_duration_minutes: 40,
    actual_duration_minutes: null,
    responsible_group: "T",
    classification: "Planned",
  },
];

const CHECKLIST_TASKS = {
  "HF": [
    { id: "hf-1", task: "Receive order & production sheet", role: "Operator", type: "External" },
    { id: "hf-2", task: "Verify OIB technical parameters", role: "Team Leader", type: "External" },
    { id: "hf-3", task: "Prepare patterns / jigs from 5S rack", role: "Operator", type: "External" },
    { id: "hf-4", task: "Load cut file to workstation PC", role: "Team Leader", type: "External" },
    { id: "hf-5", task: "Transport new material to staging area", role: "Material Handler", type: "External" },
    { id: "hf-6", task: "Prepare blade / punch per OIB", role: "Operator", type: "External" },
    { id: "hf-7", task: "Stop machine, unload previous material", role: "Operator", type: "Internal" },
    { id: "hf-8", task: "Load new material onto machine", role: "Operator", type: "Internal" },
    { id: "hf-9", task: "Replace cutting blade / punch", role: "Operator", type: "Internal" },
    { id: "hf-10", task: "Call cut file on software", role: "Team Leader", type: "Internal" },
    { id: "hf-11", task: "Trial cut and fine adjust", role: "Operator", type: "Internal" },
    { id: "hf-12", task: "Check first piece confirmation", role: "QC", type: "Internal" },
    { id: "hf-13", task: "Start mass production", role: "Operator", type: "Run" },
  ],
  "Silk Screen": [
    { id: "ss-1", task: "Receive order & production sheet", role: "Operator", type: "External" },
    { id: "ss-2", task: "Verify screen frame & emulsion", role: "Team Leader", type: "External" },
    { id: "ss-3", task: "Prepare ink, additives, and squeegee", role: "Operator", type: "External" },
    { id: "ss-4", task: "Load print file to control panel", role: "Team Leader", type: "External" },
    { id: "ss-5", task: "Transport material to loading area", role: "Material Handler", type: "External" },
    { id: "ss-6", task: "Stop machine, remove previous screen", role: "Operator", type: "Internal" },
    { id: "ss-7", task: "Install new screen frame & align", role: "Operator", type: "Internal" },
    { id: "ss-8", task: "Load new material onto printer", role: "Operator", type: "Internal" },
    { id: "ss-9", task: "Set print parameters & test print", role: "Operator", type: "Internal" },
    { id: "ss-10", task: "Check first piece quality", role: "QC", type: "Internal" },
    { id: "ss-11", task: "Start mass production", role: "Operator", type: "Run" },
  ],
  "Autocut": [
    { id: "ac-1", task: "Receive order & production sheet", role: "Operator", type: "External" },
    { id: "ac-2", task: "Verify OIB & cutting pattern", role: "Team Leader", type: "External" },
    { id: "ac-3", task: "Prepare material, blade, and EVA foam", role: "Operator", type: "External" },
    { id: "ac-4", task: "Load cut file to machine PC", role: "Team Leader", type: "External" },
    { id: "ac-5", task: "Transport material to staging area", role: "Material Handler", type: "External" },
    { id: "ac-6", task: "Stop machine, unload previous material", role: "Operator", type: "Internal" },
    { id: "ac-7", task: "Load new material onto machine", role: "Operator", type: "Internal" },
    { id: "ac-8", task: "Swap blade + EVA plate", role: "Operator", type: "Internal" },
    { id: "ac-9", task: "Perform test cut", role: "Operator", type: "Internal" },
    { id: "ac-10", task: "Check first piece quality", role: "QC", type: "Internal" },
    { id: "ac-11", task: "Start mass production", role: "Operator", type: "Run" },
  ],
  "SEMI Cut": [
    { id: "sc-1", task: "Remove previous material from machine", role: "Operator", type: "Internal" },
    { id: "sc-2", task: "Prepare cutting file", role: "Team Leader", type: "External" },
    { id: "sc-3", task: "Prepare new material, blade, EVA foam", role: "Material Handler", type: "External" },
    { id: "sc-4", task: "Load pre-laid material onto machine", role: "Operator", type: "External" },
    { id: "sc-5", task: "Swap blade + EVA plate", role: "Operator", type: "External" },
    { id: "sc-6", task: "Perform test cut", role: "Operator", type: "External" },
    { id: "sc-7", task: "Start mass production", role: "Operator", type: "Run" },
  ],
  "GBOS Cut": [
    { id: "gc-1", task: "Receive order & production sheet", role: "Operator", type: "External" },
    { id: "gc-2", task: "OIB Verification", role: "Team Leader", type: "External" },
    { id: "gc-3", task: "Prepare knife, punch, pattern", role: "Operator", type: "External" },
    { id: "gc-4", task: "Stop machine, unload previous material", role: "Operator", type: "Internal" },
    { id: "gc-5", task: "Check material code", role: "Team Leader", type: "Internal" },
    { id: "gc-6", task: "Load new material onto machine", role: "Operator", type: "Internal" },
    { id: "gc-7", task: "Prepare file and nesting file", role: "Team Leader", type: "External" },
    { id: "gc-8", task: "Replace cutting blade / punch", role: "Operator", type: "Internal" },
    { id: "gc-9", task: "Trial cut and fine adjust", role: "Operator", type: "Internal" },
    { id: "gc-10", task: "Check first piece", role: "QC", type: "Internal" },
    { id: "gc-11", task: "Start mass production", role: "Operator", type: "Run" },
  ],
  "Atom Cut": [
    { id: "at-1", task: "Receive order & production sheet", role: "Operator", type: "External" },
    { id: "at-2", task: "OIB Verification", role: "Team Leader", type: "External" },
    { id: "at-3", task: "Prepare Patterns / Jig", role: "Operator", type: "External" },
    { id: "at-4", task: "Prepare file", role: "Team Leader", type: "External" },
    { id: "at-5", task: "Prepare material", role: "Material Handler", type: "External" },
    { id: "at-6", task: "Prepare blade / punch", role: "Operator", type: "External" },
    { id: "at-7", task: "Stop machine, unload previous material", role: "Operator", type: "Internal" },
    { id: "at-8", task: "Load new material onto machine", role: "Operator", type: "Internal" },
    { id: "at-9", task: "Replace blade / punch", role: "Operator", type: "Internal" },
    { id: "at-10", task: "Get cut file", role: "Team Leader", type: "Internal" },
    { id: "at-11", task: "Trial cut and fine adjust", role: "Operator", type: "Internal" },
    { id: "at-12", task: "Check first piece", role: "QC", type: "Internal" },
    { id: "at-13", task: "Start mass production", role: "Operator", type: "Run" },
  ],
};

const translations = {
  EN: {
    mainMenu: "Main Menu",
    dashboard: "Dashboard",
    changeovers: "Changeovers",
    checklist: "Checklist",
    adminRole: "Administrator",
    smedDashboard: "SMED Dashboard",
    dashboardSubtitle: "Changeover performance by area",
    timeRange: "Time Range",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    customRange: "Custom Range",
    from: "From",
    to: "To",
    area: "Area",
    allAreas: "All Areas",
    countAndDurationByArea: "Count & Duration by Area",
    countAndDurationSubtitle: "Changeover volume and total time per process area",
    plannedVsUnplanned: "Planned vs Unplanned",
    plannedVsUnplannedSubtitle: "Classification breakdown for selected period",
    count: "Count",
    totalMinutes: "Total (min)",
    noDataForPeriod: "No data for the selected period.",
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
    inProgress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    classification: "Classification",
    allClassifications: "All Classifications",
    planned: "Planned",
    unplanned: "Unplanned",
    process: "Process",
    allProcesses: "All Processes",
    hf: "HF",
    silkScreen: "Silk Screen",
    autocut: "Autocut",
    semiCut: "SEMI Cut",
    gbosCut: "GBOS Cut",
    atomCut: "Atom Cut",
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
    checklist: "Danh sách kiểm tra",
    adminRole: "Quản trị viên",
    smedDashboard: "Bảng SMED",
    dashboardSubtitle: "Hiệu suất chuyển đổi theo khu vực",
    timeRange: "Khoảng thời gian",
    today: "Hôm nay",
    thisWeek: "Tuần này",
    thisMonth: "Tháng này",
    customRange: "Tùy chỉnh",
    from: "Từ",
    to: "Đến",
    area: "Khu vực",
    allAreas: "Tất cả khu vực",
    countAndDurationByArea: "Số lượng & Thời gian theo khu vực",
    countAndDurationSubtitle: "Số lượng chuyển đổi và tổng thời gian theo công đoạn",
    plannedVsUnplanned: "Kế hoạch vs Ngoài kế hoạch",
    plannedVsUnplannedSubtitle: "Phân bổ phân loại cho khoảng thời gian đã chọn",
    count: "Số lượng",
    totalMinutes: "Tổng (phút)",
    noDataForPeriod: "Không có dữ liệu cho khoảng thời gian đã chọn.",
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
    inProgress: "Đang thực hiện",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
    classification: "Phân loại",
    allClassifications: "Tất cả phân loại",
    planned: "Kế hoạch",
    unplanned: "Ngoài kế hoạch",
    process: "Công đoạn",
    allProcesses: "Tất cả công đoạn",
    hf: "HF",
    silkScreen: "Silk Screen",
    autocut: "Autocut",
    semiCut: "SEMI Cut",
    gbosCut: "GBOS Cut",
    atomCut: "Atom Cut",
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
    checklist: "체크리스트",
    adminRole: "관리자",
    smedDashboard: "SMED 대시보드",
    dashboardSubtitle: "영역별 체인지오버 성과",
    timeRange: "시간 범위",
    today: "오늘",
    thisWeek: "이번 주",
    thisMonth: "이번 달",
    customRange: "사용자 지정",
    from: "시작",
    to: "종료",
    area: "영역",
    allAreas: "전체 영역",
    countAndDurationByArea: "영역별 건수 & 시간",
    countAndDurationSubtitle: "공정 영역별 체인지오버 수량 및 총 시간",
    plannedVsUnplanned: "계획 vs 비계획",
    plannedVsUnplannedSubtitle: "선택 기간 분류 분포",
    count: "건수",
    totalMinutes: "총 (분)",
    noDataForPeriod: "선택한 기간에 대한 데이터가 없습니다.",
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
    inProgress: "진행 중",
    completed: "완료",
    cancelled: "취소됨",
    classification: "분류",
    allClassifications: "전체 분류",
    planned: "계획",
    unplanned: "비계획",
    process: "공정",
    allProcesses: "전체 공정",
    hf: "HF",
    silkScreen: "Silk Screen",
    autocut: "Autocut",
    semiCut: "SEMI Cut",
    gbosCut: "GBOS Cut",
    atomCut: "Atom Cut",
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

const checklistRole = document.querySelector("[data-checklist-role]");
const checklistRecords = document.querySelector("[data-checklist-records]");
const checklistDetail = document.querySelector("[data-checklist-detail]");
const checklistGrid = document.querySelector("[data-checklist-grid]");
const checklistProgress = document.querySelector("[data-checklist-progress]");
const checklistTitle = document.querySelector("[data-checklist-title]");
const checklistSubtitle = document.querySelector("[data-checklist-subtitle]");
const progressBar = document.querySelector("[data-progress-bar]");
const progressText = document.querySelector("[data-progress-text]");
const checklistBack = document.querySelector("[data-checklist-back]");

let selectedRecord = null;

function getChecklistState() {
  return JSON.parse(localStorage.getItem("smed_checklist_state") || "{}");
}

function saveChecklistState(state) {
  localStorage.setItem("smed_checklist_state", JSON.stringify(state));
}

function getChecklistKey(recordId) {
  return `record_${recordId}`;
}

function formatDateShort(value) {
  if (!value) return "--";
  return new Intl.DateTimeFormat(getDateLocale(), {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function renderChecklistRecords() {
  if (!checklistRecords) return;

  const records = loadedRequests.filter((r) => {
    const status = normalizeStatus(r.status);
    return status === "In Progress" || status === "Submitted";
  });

  if (records.length === 0) {
    checklistRecords.innerHTML = `<p class="empty-state">No changeover records in progress.</p>`;
    return;
  }

  const sorted = [...records].sort((a, b) => {
    const da = new Date(a.time || a.planned_start || 0);
    const db = new Date(b.time || b.planned_start || 0);
    return db - da;
  });

  checklistRecords.innerHTML = sorted
    .map((r) => {
      const status = normalizeStatus(r.status);
      const statusClass = status.toLowerCase().replace(/\s+/g, "-");
      const area = r.process || "Unknown";
      const line = r.production_line || r.line || "--";
      const from = r.from_model || "--";
      const to = r.to_model || "--";
      const time = r.time || r.planned_start;
      const duration = r.duration || r.planned_duration_minutes || "--";

      const state = getChecklistState();
      const key = getChecklistKey(r.id);
      const completed = state[key] || {};
      const tasks = CHECKLIST_TASKS[area] || [];
      const completedCount = tasks.filter((t) => completed[t.id]).length;
      const pct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

      return `
        <article class="checklist-record-card status-${statusClass}" data-record-id="${escapeHtml(String(r.id))}">
          <div class="record-card-header">
            <div class="record-card-badges">
              <span class="record-area-badge">${escapeHtml(area)}</span>
              <span class="record-status-badge status-${statusClass}">${escapeHtml(translateStatus(status))}</span>
            </div>
            <span class="record-card-time">${formatDateShort(time)}</span>
          </div>
          <div class="record-card-models">
            <span>${escapeHtml(from)}</span>
            <i data-lucide="chevron-right"></i>
            <strong>${escapeHtml(to)}</strong>
          </div>
          <div class="record-card-details">
            <span><i data-lucide="factory"></i>${escapeHtml(line)}</span>
            <span><i data-lucide="clock-3"></i>${duration}m</span>
          </div>
          <div class="record-card-progress">
            <div class="mini-progress-wrap">
              <div class="mini-progress-bar" style="width: ${pct}%"></div>
            </div>
            <span>${completedCount}/${tasks.length} tasks</span>
          </div>
        </article>
      `;
    })
    .join("");

  window.lucide?.createIcons();
}

function renderChecklistDetail() {
  if (!checklistGrid || !selectedRecord) return;

  const area = selectedRecord.process || "";
  const tasks = CHECKLIST_TASKS[area] || [];

  if (checklistTitle) {
    checklistTitle.textContent = `${area} Checklist`;
  }
  if (checklistSubtitle) {
    const from = selectedRecord.from_model || "--";
    const to = selectedRecord.to_model || "--";
    checklistSubtitle.textContent = `${from} → ${to}`;
  }

  if (tasks.length === 0) {
    checklistGrid.innerHTML = `<p class="empty-state">No tasks defined for this area.</p>`;
    checklistProgress.hidden = true;
    return;
  }

  const state = getChecklistState();
  const key = getChecklistKey(selectedRecord.id);
  const completed = state[key] || {};

  const completedCount = tasks.filter((t) => completed[t.id]).length;
  const totalCount = tasks.length;
  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  checklistProgress.hidden = false;
  progressBar.style.width = `${pct}%`;
  progressText.textContent = `${completedCount} / ${totalCount} tasks completed`;

  const typeGroups = { External: [], Internal: [], Run: [] };
  tasks.forEach((t) => {
    const group = typeGroups[t.type] || typeGroups.Internal;
    group.push(t);
  });

  checklistGrid.innerHTML = Object.entries(typeGroups)
    .filter(([, items]) => items.length > 0)
    .map(([type, items]) => {
      const typeClass = type.toLowerCase().replace(/\s+/g, "-");
      return `
        <div class="checklist-section">
          <h3 class="checklist-section-title">
            <span class="checklist-type-badge type-${typeClass}">${escapeHtml(type)}</span>
            ${escapeHtml(type === "External" ? "Before Changeover" : type === "Internal" ? "During Changeover" : "After Changeover")}
          </h3>
          <div class="checklist-tasks">
            ${items.map((task) => {
              const isChecked = completed[task.id];
              return `
                <label class="checklist-task ${isChecked ? "completed" : ""}">
                  <input type="checkbox" data-task-id="${task.id}" ${isChecked ? "checked" : ""} />
                  <span class="checklist-checkbox"></span>
                  <span class="checklist-task-info">
                    <span class="checklist-task-text">${escapeHtml(task.task)}</span>
                    <span class="checklist-task-role">${escapeHtml(task.role)}</span>
                  </span>
                </label>
              `;
            }).join("")}
          </div>
        </div>
      `;
    })
    .join("");
}

function showChecklistForRecord(recordId) {
  const record = loadedRequests.find((r) => String(r.id) === String(recordId));
  if (!record) return;

  selectedRecord = record;
  checklistDetail.hidden = false;
  checklistDetail.classList.add("open");
  document.body.style.overflow = "hidden";
  renderChecklistDetail();
  window.lucide?.createIcons();
}

function showRecordList() {
  selectedRecord = null;
  checklistDetail.classList.remove("open");
  document.body.style.overflow = "";
  checklistDetail.hidden = true;
  renderChecklistRecords();
}

checklistRecords?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-record-id]");
  if (!card) return;
  showChecklistForRecord(card.dataset.recordId);
});

checklistBack?.addEventListener("click", showRecordList);

checklistDetail?.addEventListener("click", (event) => {
  if (event.target === checklistDetail) showRecordList();
});

checklistGrid?.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-task-id]");
  if (!checkbox || !selectedRecord) return;

  const state = getChecklistState();
  const key = getChecklistKey(selectedRecord.id);
  if (!state[key]) state[key] = {};

  state[key][checkbox.dataset.taskId] = checkbox.checked;
  saveChecklistState(state);
  renderChecklistDetail();
});

renderChecklistRecords();

function showChangeoverWarning() {
  if (!loadedRequests.length) return;

  const inProgress = loadedRequests.filter((r) => normalizeStatus(r.status) === "In Progress");
  if (inProgress.length === 0) return;

  const existing = document.querySelector(".changeover-warning");
  if (existing) return;

  const warning = document.createElement("div");
  warning.className = "changeover-warning";
  warning.innerHTML = `
    <div class="warning-body">
      <div class="warning-icon"><i data-lucide="zap"></i></div>
      <div class="warning-text">
        <strong>${inProgress.length} changeover${inProgress.length > 1 ? "s" : ""} in progress</strong>
        <span>${inProgress.map((r) => escapeHtml(r.process || "")).filter(Boolean).join(" · ")}</span>
      </div>
      <a class="warning-action" href="checklist.html${inProgress[0]?.process ? `?area=${encodeURIComponent(inProgress[0].process)}` : ""}">
        <i data-lucide="clipboard-check"></i>
        View Checklist
      </a>
      <button type="button" class="warning-close" aria-label="Close"><i data-lucide="x"></i></button>
    </div>
  `;

  document.body.prepend(warning);
  window.lucide?.createIcons();

  warning.querySelector(".warning-close")?.addEventListener("click", () => {
    warning.remove();
  });
}

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

const urlParams = new URLSearchParams(window.location.search);
const areaParam = urlParams.get("area");
const idParam = urlParams.get("id");
if (checklistRecords) {
  if (idParam) {
    const matching = loadedRequests.find((r) => String(r.id) === String(idParam));
    if (matching) {
      showChecklistForRecord(matching.id);
    }
  } else if (areaParam) {
    const matching = loadedRequests.find(
      (r) => (r.process || "") === areaParam && normalizeStatus(r.status) === "In Progress"
    );
    if (matching) {
      showChecklistForRecord(matching.id);
    }
  }
}

document.querySelector("[data-dashboard-time]")?.addEventListener("change", () => renderDashboard(loadedDashboardRecords));
document.querySelector("[data-dashboard-area]")?.addEventListener("change", () => renderDashboard(loadedDashboardRecords));
document.querySelector("[data-dashboard-date-from]")?.addEventListener("change", () => renderDashboard(loadedDashboardRecords));
document.querySelector("[data-dashboard-date-to]")?.addEventListener("change", () => renderDashboard(loadedDashboardRecords));

async function loadRequests() {
  const isChecklistPage = !!checklistRecords;
  const isChangeoverPage = !!requestGrid;

  if (!isChecklistPage && !isChangeoverPage) return;

  loadedRequests = [...sampleRequests, ...testChecklistRecords];

  if (isChangeoverPage) {
    hydrateLineFilter(loadedRequests);
    renderRequests(loadedRequests);
    showChangeoverWarning();
  }
  if (isChecklistPage) {
    renderChecklistRecords();
    showChangeoverWarning();
  }
}

async function loadDashboard() {
  if (!dashboard) return;

  loadedDashboardRecords = applyTimedStatuses([...sampleRequests, ...testChecklistRecords]);
  renderDashboard(loadedDashboardRecords);
}

function renderDashboard(records) {
  const timeSelect = document.querySelector("[data-dashboard-time]");
  const areaSelect = document.querySelector("[data-dashboard-area]");
  const dateFrom = document.querySelector("[data-dashboard-date-from]");
  const dateTo = document.querySelector("[data-dashboard-date-to]");
  const customRange = document.querySelector("[data-custom-range]");

  if (!timeSelect || !areaSelect) return;

  customRange.hidden = timeSelect.value !== "custom";

  const filtered = filterDashboardRecords(records, timeSelect.value, areaSelect.value, dateFrom?.value, dateTo?.value);

  renderDoubleBarChart(filtered, areaSelect.value);
  renderClassificationPie(filtered);
  window.lucide?.createIcons();
}

function filterDashboardRecords(records, timeRange, area, dateFrom, dateTo) {
  const now = new Date();
  const todayKey = formatDateKey(now);

  let filtered = records.map((record) => ({ ...record, status: getTimedStatus(record) }));

  if (area) {
    filtered = filtered.filter((record) => (record.process || "") === area);
  }

  if (timeRange === "today") {
    filtered = filtered.filter((record) => formatDateKey(getRecordDate(record)) === todayKey);
  } else if (timeRange === "week") {
    const weekDays = getRecentNonSundayDays(7).map((d) => formatDateKey(d));
    filtered = filtered.filter((record) => weekDays.includes(formatDateKey(getRecordDate(record))));
  } else if (timeRange === "month") {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    filtered = filtered.filter((record) => {
      const d = getRecordDate(record);
      return d >= monthStart && d <= now;
    });
  } else if (timeRange === "custom" && dateFrom && dateTo) {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    filtered = filtered.filter((record) => {
      const d = getRecordDate(record);
      return d >= from && d <= to;
    });
  }

  return filtered;
}

function renderDoubleBarChart(records, selectedArea) {
  const chart = document.querySelector("[data-double-bar-chart]");
  if (!chart) return;

  if (selectedArea) {
    renderDetailBarChart(chart, records, selectedArea);
  } else {
    renderAggregateBarChart(chart, records);
  }
}

function renderAggregateBarChart(chart, records) {
  const areaData = AREAS.map((area) => {
    const areaRecords = records.filter((r) => (r.process || "") === area);
    const count = areaRecords.length;
    const totalDuration = areaRecords.reduce((sum, r) => {
      const d = Number(r.actual_duration ?? r.duration ?? r.planned_duration_minutes);
      return sum + (Number.isFinite(d) ? d : 0);
    }, 0);
    return { area, count, totalDuration };
  });

  const maxCount = Math.max(...areaData.map((d) => d.count), 1);
  const maxDuration = Math.max(...areaData.map((d) => d.totalDuration), 1);

  chart.innerHTML = areaData
    .map((d) => {
      const countHeight = Math.max(8, Math.round((d.count / maxCount) * 100));
      const durationHeight = Math.max(8, Math.round((d.totalDuration / maxDuration) * 100));
      return `
        <div class="double-bar-group">
          <div class="double-bar-pair">
            <div class="double-bar-wrap">
              <span class="double-bar bar-count" style="height: ${countHeight}%" title="${d.count} records"></span>
            </div>
            <div class="double-bar-wrap">
              <span class="double-bar bar-duration" style="height: ${durationHeight}%" title="${d.totalDuration} min"></span>
            </div>
          </div>
          <div class="double-bar-values">
            <span class="bar-value-count">${d.count}</span>
            <span class="bar-value-duration">${d.totalDuration}m</span>
          </div>
          <small>${escapeHtml(d.area)}</small>
        </div>
      `;
    })
    .join("");
}

function renderDetailBarChart(chart, records, area) {
  if (records.length === 0) {
    chart.innerHTML = `<p class="empty-state">${escapeHtml(translate("noDataForPeriod"))}</p>`;
    return;
  }

  const sorted = [...records].sort((a, b) => {
    const da = new Date(a.planned_start || 0);
    const db = new Date(b.planned_start || 0);
    return da - db;
  });

  const maxDuration = Math.max(...sorted.map((r) => {
    const d = Number(r.actual_duration ?? r.duration ?? r.planned_duration_minutes);
    return Number.isFinite(d) ? d : 1;
  }), 1);

  chart.innerHTML = sorted
    .map((r) => {
      const duration = Number(r.actual_duration ?? r.duration ?? r.planned_duration_minutes);
      const d = Number.isFinite(duration) ? duration : 0;
      const height = Math.max(8, Math.round((d / maxDuration) * 100));
      const label = `${escapeHtml(r.from_model || "?")} → ${escapeHtml(r.to_model || "?")}`;
      const dateLabel = r.planned_start
        ? new Intl.DateTimeFormat(getDateLocale(), { month: "short", day: "2-digit" }).format(new Date(r.planned_start))
        : "--";
      const statusClass = normalizeStatus(r.status).toLowerCase().replace(/\s+/g, "-");
      return `
        <div class="double-bar-group detail-bar">
          <div class="double-bar-pair">
            <div class="double-bar-wrap">
              <span class="double-bar bar-count" style="height: 100%" title="1 record"></span>
            </div>
            <div class="double-bar-wrap">
              <span class="double-bar bar-duration status-${statusClass}" style="height: ${height}%" title="${d} min"></span>
            </div>
          </div>
          <div class="double-bar-values">
            <span class="bar-value-count">1</span>
            <span class="bar-value-duration">${d}m</span>
          </div>
          <small title="${label}">${dateLabel}<br/>${label}</small>
        </div>
      `;
    })
    .join("");
}

function renderClassificationPie(records) {
  const pie = document.querySelector("[data-classification-pie]");
  const target = document.querySelector("[data-classification-breakdown]");
  const totalEl = document.querySelector("[data-classification-total]");
  if (!pie || !target) return;

  const planned = records.filter((r) => normalizeStatus(r.classification || r.type) === "planned" || (r.classification || "").toLowerCase() === "planned").length;
  const unplanned = records.length - planned;
  const total = records.length;

  const colors = { planned: "#3b82f6", unplanned: "#fb7185" };
  const pPct = total ? (planned / total) * 100 : 0;
  const uPct = total ? (unplanned / total) * 100 : 0;

  pie.style.background = total
    ? `conic-gradient(${colors.planned} 0% ${pPct}%, ${colors.unplanned} ${pPct}% 100%)`
    : "conic-gradient(rgba(255, 255, 255, 0.12) 0% 100%)";

  if (totalEl) totalEl.textContent = total;

  target.innerHTML = [
    { label: translate("planned"), count: planned, pct: pPct, color: colors.planned },
    { label: translate("unplanned"), count: unplanned, pct: uPct, color: colors.unplanned },
  ]
    .map(
      (item) => `
        <article style="--status-color: ${item.color}">
          <span>${escapeHtml(item.label)}</span>
          <strong>${total ? Math.round(item.pct) : 0}%</strong>
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

  saveDraft(payload);
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
  const area = request.process || "";
  const checklistUrl = area ? `checklist.html?area=${encodeURIComponent(area)}&id=${encodeURIComponent(request.id)}` : "#";

  return `
    <article class="request-card status-${statusClass}" data-request-id="${escapeHtml(request.id)}">
      <a class="card-link" href="${checklistUrl}" aria-label="Open checklist for ${escapeHtml(area)}">
        <div class="card-content">
          <div class="badges">
            <span>${escapeHtml(area || request.type || "Changeover")}</span>
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
        </div>
      </a>
      <div class="card-actions" aria-label="Request actions">
        <button class="delete-button" type="button" data-request-action="delete">
          <i data-lucide="trash-2"></i>${translate("delete")}
        </button>
        <button class="complete-button" type="button" data-request-action="complete" ${isScheduledForFuture || isCompleted ? "disabled" : ""}>
          <i data-lucide="circle-check"></i>${translate("complete")}
        </button>
      </div>
    </article>
  `;
}

async function completeRequest(requestId) {
  const request = loadedRequests.find((item) => String(item.id) === String(requestId));
  if (!hasRequestStarted(request)) {
    showNotice("This request cannot be completed before its start time.", "error");
    return;
  }

  const actualDuration = calculateActualDuration(request);

  loadedRequests = loadedRequests.map((r) =>
    String(r.id) === String(requestId)
      ? { ...r, status: "Completed", actual_duration_minutes: actualDuration }
      : r,
  );
  showNotice("Changeover completed.", "success");
  refreshRequestGrid();
}

async function deleteRequest(requestId) {
  if (!window.confirm("Delete this changeover request?")) return;

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

function refreshTimedStatuses() {
  if (!requestGrid || loadedRequests.length === 0) return;

  const previousRequests = loadedRequests;
  const timedRequests = applyTimedStatuses(previousRequests);
  const hasChanges = timedRequests.some((request, index) => request.status !== previousRequests[index]?.status);
  if (!hasChanges) return;

  loadedRequests = timedRequests;
  refreshRequestGrid();
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
  setTextForLinks('.menu a[href="checklist.html"]', translate("checklist"));
  setTextAll(".profile small, .user-card span", translate("adminRole"));
  setTextAll(".section-label", document.body.classList.contains("dashboard-page") ? translate("dashboard") : translate("changeovers"));

  setTextAll(".dashboard-heading h1", translate("smedDashboard"));
  setTextAll(".dashboard-heading p", translate("dashboardSubtitle"));
  setTextAll("[data-dashboard-time] option[value='today']", translate("today"));
  setTextAll("[data-dashboard-time] option[value='week']", translate("thisWeek"));
  setTextAll("[data-dashboard-time] option[value='month']", translate("thisMonth"));
  setTextAll("[data-dashboard-time] option[value='custom']", translate("customRange"));
  setTextAll("[data-dashboard-date-from]", translate("from"));
  setTextAll("[data-dashboard-date-to]", translate("to"));
  setTextAll("[data-dashboard-area] option[value='']", translate("allAreas"));
  setTextAll(".chart-panel .panel-head h2", "");
  const chartPanels = document.querySelectorAll(".chart-panel .panel-head");
  if (chartPanels[0]) {
    chartPanels[0].querySelector("h2").textContent = translate("countAndDurationByArea");
    chartPanels[0].querySelector("p").textContent = translate("countAndDurationSubtitle");
  }
  if (chartPanels[1]) {
    chartPanels[1].querySelector("h2").textContent = translate("plannedVsUnplanned");
    chartPanels[1].querySelector("p").textContent = translate("plannedVsUnplannedSubtitle");
  }
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
    Unplanned: translate("unplanned"),
  });
  setSelectText("[data-filter-process]", {
    "": translate("allProcesses"),
    HF: translate("hf"),
    "Silk Screen": translate("silkScreen"),
    Autocut: translate("autocut"),
    "SEMI Cut": translate("semiCut"),
    "GBOS Cut": translate("gbosCut"),
    "Atom Cut": translate("atomCut"),
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
  setSelectText("select[name='process']", {
    "": "Select Process",
    HF: translate("hf"),
    "Silk Screen": translate("silkScreen"),
    Autocut: translate("autocut"),
    "SEMI Cut": translate("semiCut"),
    "GBOS Cut": translate("gbosCut"),
    "Atom Cut": translate("atomCut"),
  });
  setTextAll(".form-card:nth-of-type(2) label:nth-child(4) span", translate("productionLine"));
  setHeadingWithIcon(".form-card:nth-of-type(3) h3", "shuffle", translate("modelTransition"));
  setTextAll(".form-card:nth-of-type(3) label:nth-child(1) span", translate("fromModel"));
  setTextAll(".form-card:nth-of-type(3) label:nth-child(2) span", translate("toModel"));
  setHeadingWithIcon(".form-card:nth-of-type(4) h3", "circle-dot", translate("classification"));
  setRadioLabelText("classification", "Planned", null, translate("planned"));
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













