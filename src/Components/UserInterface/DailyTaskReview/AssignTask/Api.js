// ─── API Endpoints ────────────────────────────────────────────────────────────

const Api = {
    // ── CRUD ──────────────────────────────────────────────────────────────────
    CREATE:     "dailytask_review/tasks/create/",
    UPDATE:     (pk) => `dailytask_review/tasks/update-task/${pk}/`,
    DELETE:     (pk) => `dailytask_review/tasks/delete-task/${pk}/`,

    // ── Table Data ────────────────────────────────────────────────────────────
    GET_TASKS:  "dailytask_review/tasks/get/",

    // ── Dropdown / Search Data ────────────────────────────────────────────────
    GET_TASK_OPTIONS: "dailytask_review/get-task/",
    SEARCH_TASKS: (q) =>
        `dailytask_review/get-task/?search=${encodeURIComponent(q)}`,

    GET_USERS:    "dailytask_review/users/",
    SEARCH_USERS: (q) =>
        `dailytask_review/users/?search=${encodeURIComponent(q)}`,
};

export default Api;