import { PRIORITY_OPTIONS, SLOT_OPTIONS } from "./Constants";

// ─── Date / Time Helpers ──────────────────────────────────────────────────────
export const nowISO = () => new Date().toISOString();

export const nowLocal = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
};

export const fmtDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "—";

export const fmtTime = (iso) =>
    iso
        ? new Date(iso).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
          })
        : "—";

export const fmtAssignedAt = () => {
    const now = new Date();
    return `${now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })} · ${now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })}`;
};

// ─── Status / Priority / Slot Helpers ────────────────────────────────────────
export const isOverdue = (iso, status) =>
    iso &&
    !["Completed", "Cancelled"].includes(status) &&
    new Date(iso) < new Date();

export const statusColor = (s) =>
    ({
        Pending:      "#f57c00",
        "In Progress":"#2e7d32",
        Completed:    "#1565c0",
        Cancelled:    "#c62828",
    }[s] ?? "#228b7f");

export const priorityMeta = (p) =>
    PRIORITY_OPTIONS.find((o) => o.value === p) ?? { color: "#777", bg: "#f5f5f5" };

export const slotMeta = (v) =>
    SLOT_OPTIONS.find((o) => o.value?.toLowerCase() === v?.toLowerCase());

// ─── User Helpers ─────────────────────────────────────────────────────────────
export const getLoggedInUser = () => {
    try {
        const raw =
            localStorage.getItem("user") ??
            localStorage.getItem("userInfo") ??
            "{}";
        const obj = JSON.parse(raw);
        return {
            name:  obj.name  ?? obj.username  ?? obj.full_name ?? "",
            email: obj.email ?? obj.emailaddress ?? "",
        };
    } catch {
        return { name: "", email: "" };
    }
};