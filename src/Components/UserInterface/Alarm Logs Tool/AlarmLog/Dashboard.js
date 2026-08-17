import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    Box,
    Typography,
    IconButton,
    Breadcrumbs,
    Link,
    Button,
    // Paper, ClickAwayListener, ToggleButton, ToggleButtonGroup — only used by
    // the commented-out date/range picker UI below. Kept imported so that
    // section can be re-enabled without touching imports.
    Paper,
    TextField,
    ClickAwayListener,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// CalendarMonthIcon, DateRangeIcon, CalendarTodayIcon — only used by the
// commented-out date/range picker UI below.
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { postData, getData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ── Constants ────────────────────────────────────────────────────────────────
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();
const START_YEAR = 2000;

// Request keys accepted by the alarm-report API. Only non-empty ones are sent,
// and the table only ever renders these columns, in this order.
const REQUEST_KEYS = [
    { key: "site_id", label: "Site ID" },
    { key: "bucket", label: "Bucket" },
    { key: "alarm", label: "Alarm" },
    { key: "detailed_remarks", label: "Detailed Remarks" },
];

// ── Theme: teal, matched to the dashboard sidebar ─────────────────────────────
const COLORS = {
    active: "linear-gradient(135deg, #0d4f4d 0%, #146b66 100%)",
    hover: "linear-gradient(135deg, #146b66 0%, #1f8a80 100%)",
    header: "linear-gradient(135deg, #0d4f4d 0%, #146b66 60%, #1f8a80 100%)",
    accent: "#146b66",
    accentSoft: "#e3f3f1",
    accentBorder: "#bfe3df",
    highlight: "#8fcfc9",
    text: "#0d4f4d",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
// toApiFormat / toDateString / toDisplayDate / todayDate / firstOfMonth are
// only used by the commented-out date/range picker UI below. Left in place
// so that section still works if uncommented.
const toApiFormat = (sel) => (sel ? `${MONTH_SHORT[sel.month]} ${sel.year}` : "");
const pad2 = (n) => String(n).padStart(2, "0");
const toDateString = (d) => (d ? `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` : "");
const toDisplayDate = (d) => (d ? `${pad2(d.getDate())} ${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}` : "");
const todayDate = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const firstOfMonth = () => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d; };

const severityTone = (colKey, val) => {
    const key = String(colKey).toLowerCase();
    const v = String(val).toLowerCase();
    if (key.includes("alarm")) {
        if (/(crit|major|down|fail|high)/.test(v)) return { bg: "#fdeceb", color: "#c62828" };
        if (/(warn|minor|medium)/.test(v)) return { bg: "#fdf4e5", color: "#a3641a" };
        if (/(ok|clear|resolved|normal|low)/.test(v)) return { bg: "#e9f8f0", color: "#1f7a4d" };
    }
    return null;
};

// Pull the requested keys out of a parsed excel row / API row object,
// matching column names case-insensitively and tolerating spaced/titled
// headers (e.g. "Site Id").
const pickRequestKeys = (row) => {
    const out = {};
    const lookup = {};
    Object.keys(row).forEach((k) => { lookup[k.toLowerCase().replace(/\s+/g, "_")] = k; });
    REQUEST_KEYS.forEach(({ key }) => {
        const match = lookup[key];
        out[key] = match !== undefined ? row[match] : "";
    });
    return out;
};

const cellStyle = {
    padding: "6px 10px",
    border: "1px solid #d7e8e6",
    textAlign: "left",
    fontSize: 13,
    whiteSpace: "nowrap",
};

/* ────────────────────────────────────────────────────────────────────────────
   Date/range filter — DISABLED per request. Everything below (SingleDatePicker,
   YearMonthPicker, and the mode toggle/top bar that rendered them) is commented
   out rather than removed, so it can be switched back on later just by
   uncommenting this block and its render call further down.

const SingleDatePicker = ({ value, onChange, label, maxDate, minDate }) => {
    const [open, setOpen] = useState(false);
    const [viewYear, setViewYear] = useState(value ? value.getFullYear() : CURRENT_YEAR);
    const [viewMonth, setViewMonth] = useState(value ? value.getMonth() : CURRENT_MONTH);
    const [yearListOpen, setYearListOpen] = useState(false);
    const yearListRef = useRef(null);

    useEffect(() => {
        if (value) { setViewYear(value.getFullYear()); setViewMonth(value.getMonth()); }
    }, [value]);

    useEffect(() => {
        if (yearListOpen && yearListRef.current) {
            const el = yearListRef.current.querySelector(`[data-year="${viewYear}"]`);
            if (el) el.scrollIntoView({ block: "center" });
        }
    }, [yearListOpen]);

    const years = [];
    for (let y = START_YEAR; y <= CURRENT_YEAR; y++) years.push(y);

    const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

    const isDateDisabled = (d) => {
        if (maxDate && d > maxDate) return true;
        if (minDate && d < minDate) return true;
        if (d > todayDate()) return true;
        return false;
    };

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
        else setViewMonth((m) => m - 1);
    };

    const nextMonth = () => {
        const nm = viewMonth === 11 ? 0 : viewMonth + 1;
        if (new Date(viewMonth === 11 ? viewYear + 1 : viewYear, nm, 1) > todayDate()) return;
        setViewMonth(nm);
        if (viewMonth === 11) setViewYear((y) => y + 1);
    };

    const handleDayClick = (day) => {
        const d = new Date(viewYear, viewMonth, day);
        if (isDateDisabled(d)) return;
        onChange(d);
        setOpen(false);
    };

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDayOfWeek = getFirstDayOfMonth(viewYear, viewMonth);
    const displayText = value ? toDisplayDate(value) : `Select ${label}`;

    return (
        <ClickAwayListener onClickAway={() => { setOpen(false); setYearListOpen(false); }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
                <Box
                    onClick={() => setOpen((p) => !p)}
                    sx={{
                        display: "flex", alignItems: "center", gap: 1,
                        px: 1.5, py: 0.7,
                        border: open ? `2px solid ${COLORS.accent}` : "1px solid #c4c4c4",
                        borderRadius: "8px", cursor: "pointer", bgcolor: "#fff",
                        minWidth: 155, userSelect: "none",
                        "&:hover": { borderColor: COLORS.accent },
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 10, color: "#888", lineHeight: 1, mb: 0.2 }}>{label}</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: value ? "#0d2b29" : "#aaa", lineHeight: 1 }}>{displayText}</Typography>
                    </Box>
                    <CalendarTodayIcon sx={{ fontSize: 16, color: open ? COLORS.accent : "#aaa" }} />
                </Box>

                {open && (
                    <Paper elevation={8} sx={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 1400, borderRadius: "12px", overflow: "hidden", minWidth: 260, boxShadow: "0 8px 32px rgba(13,79,77,0.20)" }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, py: 1, borderBottom: "1px solid #e3f3f1", bgcolor: COLORS.accentSoft }}>
                            <IconButton size="small" onClick={prevMonth} sx={{ p: 0.5 }}>
                                <KeyboardArrowRightIcon sx={{ transform: "rotate(180deg)", fontSize: 18 }} />
                            </IconButton>
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <Typography sx={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{MONTH_SHORT[viewMonth]}</Typography>
                                <Box onClick={(e) => { e.stopPropagation(); setYearListOpen((p) => !p); }}
                                    sx={{ fontSize: 13, fontWeight: 700, color: COLORS.accent, cursor: "pointer", px: 0.5, borderRadius: "4px", "&:hover": { bgcolor: COLORS.accentSoft } }}>
                                    {viewYear} ▾
                                </Box>
                            </Box>
                            <IconButton size="small" onClick={nextMonth} sx={{ p: 0.5 }}>
                                <KeyboardArrowRightIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Box>

                        {yearListOpen && (
                            <Box ref={yearListRef} onClick={(e) => e.stopPropagation()}
                                sx={{ position: "absolute", top: 44, left: 0, right: 0, zIndex: 10, maxHeight: 180, overflowY: "auto", bgcolor: "#fff", border: "1px solid #e0e0e0", boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
                                {years.map((yr) => (
                                    <Box key={yr} data-year={yr} onClick={() => { setViewYear(yr); setYearListOpen(false); }}
                                        sx={{ px: 2, py: 0.7, fontSize: 13, cursor: "pointer", fontWeight: viewYear === yr ? 700 : 400, color: viewYear === yr ? "#fff" : "#374151", bgcolor: viewYear === yr ? COLORS.accent : "transparent", "&:hover": { bgcolor: viewYear === yr ? COLORS.accent : COLORS.accentSoft } }}>
                                        {yr}
                                    </Box>
                                ))}
                            </Box>
                        )}

                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", px: 1, pt: 1 }}>
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                                <Box key={d} sx={{ textAlign: "center", fontSize: 11, color: "#9e9e9e", fontWeight: 600, py: 0.5 }}>{d}</Box>
                            ))}
                        </Box>

                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", px: 1, pb: 1, gap: 0.3 }}>
                            {Array.from({ length: firstDayOfWeek }).map((_, i) => <Box key={`e-${i}`} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const thisDate = new Date(viewYear, viewMonth, day);
                                const disabled = isDateDisabled(thisDate);
                                const isSelected = value && value.getFullYear() === viewYear && value.getMonth() === viewMonth && value.getDate() === day;
                                const isToday = thisDate.toDateString() === new Date().toDateString();
                                return (
                                    <Box key={day} onClick={() => handleDayClick(day)}
                                        sx={{ textAlign: "center", py: 0.6, borderRadius: "6px", fontSize: 12.5, fontWeight: isSelected ? 700 : isToday ? 600 : 400, cursor: disabled ? "not-allowed" : "pointer", color: disabled ? "#ccc" : isSelected ? "#fff" : isToday ? COLORS.accent : "#374151", bgcolor: isSelected ? COLORS.accent : "transparent", border: isToday && !isSelected ? `1px solid ${COLORS.accent}` : "1px solid transparent", transition: "all .1s", "&:hover": disabled ? {} : { bgcolor: isSelected ? COLORS.accent : COLORS.accentSoft, color: isSelected ? "#fff" : COLORS.accent } }}>
                                        {day}
                                    </Box>
                                );
                            })}
                        </Box>

                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1, borderTop: "1px solid #e3f3f1", bgcolor: "#fafefe" }}>
                            <Button size="small" onClick={() => { onChange(null); setOpen(false); }} sx={{ textTransform: "none", fontSize: 12, color: "#374151", fontWeight: 600, "&:hover": { color: "#c62828" } }}>Clear</Button>
                            <Button size="small" onClick={() => { onChange(todayDate()); setOpen(false); }} sx={{ textTransform: "none", fontSize: 12, color: COLORS.accent, fontWeight: 700, "&:hover": { bgcolor: COLORS.accentSoft } }}>Today</Button>
                        </Box>
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
};

const YearMonthPicker = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [hoveredYear, setHoveredYear] = useState(value?.year ?? CURRENT_YEAR);
    const yearListRef = useRef(null);

    const years = [];
    for (let y = START_YEAR; y <= CURRENT_YEAR; y++) years.push(y);

    useEffect(() => {
        if (open && yearListRef.current) {
            const el = yearListRef.current.querySelector(`[data-year="${hoveredYear}"]`);
            if (el) el.scrollIntoView({ block: "center" });
        }
    }, [open]);

    const isDisabled = (year, mIdx) => year > CURRENT_YEAR || (year === CURRENT_YEAR && mIdx > CURRENT_MONTH);

    const handleMonthClick = (year, mIdx) => {
        if (isDisabled(year, mIdx)) return;
        onChange({ year, month: mIdx });
        setOpen(false);
    };

    const displayText = value ? `${MONTH_SHORT[value.month]} ${value.year}` : "Select month";

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
                <Box onClick={() => setOpen((p) => !p)}
                    sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 0.7, border: open ? `2px solid ${COLORS.accent}` : "1px solid #c4c4c4", borderRadius: "8px", cursor: "pointer", bgcolor: "#fff", minWidth: 180, userSelect: "none", "&:hover": { borderColor: COLORS.accent } }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 10, color: "#888", lineHeight: 1, mb: 0.2 }}>Month</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: value ? "#0d2b29" : "#aaa", lineHeight: 1 }}>{displayText}</Typography>
                    </Box>
                    <CalendarMonthIcon sx={{ fontSize: 20, color: open ? COLORS.accent : "#aaa" }} />
                </Box>

                {open && (
                    <Paper elevation={8} sx={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 1400, borderRadius: "12px", overflow: "hidden", minWidth: 310, boxShadow: "0 8px 32px rgba(13,79,77,0.20)" }}>
                        <Box display="flex" sx={{ height: 240 }}>
                            <Box ref={yearListRef} sx={{ width: 80, overflowY: "auto", bgcolor: COLORS.accentSoft, borderRight: "1px solid #e3f3f1", py: 0.5 }}>
                                {years.map((yr) => {
                                    const isSelected = value?.year === yr;
                                    const isHovered = hoveredYear === yr;
                                    return (
                                        <Box key={yr} data-year={yr} onClick={() => setHoveredYear(yr)}
                                            sx={{ px: 2, py: 0.9, cursor: "pointer", fontSize: 13.5, fontWeight: isSelected || isHovered ? 700 : 400, color: isSelected ? "#fff" : isHovered ? COLORS.accent : "#374151", bgcolor: isSelected ? COLORS.accent : isHovered ? "#dcefec" : "transparent", borderRadius: "6px", mx: 0.5, transition: "all .12s", "&:hover": { bgcolor: isSelected ? COLORS.accent : "#cfe9e5", color: isSelected ? "#fff" : COLORS.accent } }}>
                                            {yr}
                                        </Box>
                                    );
                                })}
                            </Box>
                            <Box sx={{ flex: 1, p: 1.5, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0.8 }}>
                                    {MONTH_SHORT.map((mn, mIdx) => {
                                        const disabled = isDisabled(hoveredYear, mIdx);
                                        const isActive = value?.year === hoveredYear && value?.month === mIdx;
                                        return (
                                            <Box key={mn} onClick={() => handleMonthClick(hoveredYear, mIdx)}
                                                sx={{ textAlign: "center", py: 0.8, borderRadius: "8px", fontSize: 13, fontWeight: isActive ? 700 : 400, cursor: disabled ? "not-allowed" : "pointer", color: disabled ? "#ccc" : isActive ? "#fff" : "#374151", bgcolor: isActive ? COLORS.accent : "transparent", border: isActive ? "none" : "1px solid transparent", transition: "all .12s", "&:hover": disabled ? {} : { bgcolor: isActive ? COLORS.accent : COLORS.accentSoft, color: isActive ? "#fff" : COLORS.accent, borderColor: COLORS.accentBorder } }}>
                                                {mn}
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1, borderTop: "1px solid #e3f3f1", bgcolor: "#fafefe" }}>
                            <Button size="small" onClick={() => { onChange(null); setOpen(false); }} sx={{ textTransform: "none", fontSize: 13, color: "#374151", fontWeight: 600, "&:hover": { color: "#c62828" } }}>Clear</Button>
                            <Button size="small" onClick={() => { onChange({ year: CURRENT_YEAR, month: CURRENT_MONTH }); setOpen(false); }} sx={{ textTransform: "none", fontSize: 13, color: COLORS.accent, fontWeight: 700, "&:hover": { bgcolor: COLORS.accentSoft } }}>This month</Button>
                        </Box>
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
};

   ── end disabled date/range picker block ───────────────────────────────── */

// ── Alarm Table (only the 4 request-key columns) ──────────────────────────────
const AlarmTable = ({ rows, titleLabel }) => (
    <Box mt={1} sx={{ overflowX: "auto", borderRadius: 2, border: "1px solid #bfe3df", boxShadow: "0 2px 8px rgba(13,79,77,0.10)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto", minWidth: 900 }}>
            <thead>
                <tr>
                    <th colSpan={REQUEST_KEYS.length} style={{ ...cellStyle, background: COLORS.active, color: "#fff", textAlign: "center", fontSize: 14, fontWeight: 700, border: "1px solid #0d4f4d" }}>
                        {titleLabel || "Set filters and generate to load data"}
                    </th>
                </tr>
                <tr style={{ background: COLORS.header }}>
                    {REQUEST_KEYS.map((col) => (
                        <th key={col.key} style={{ ...cellStyle, background: "transparent", color: "#fff", fontWeight: 700, border: "1px solid #0d4f4d" }}>{col.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.length > 0 ? (
                    rows.map((row, idx) => (
                        <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#f2faf9" }}>
                            {REQUEST_KEYS.map(({ key }) => {
                                const tone = severityTone(key, row[key]);
                                return (
                                    <td key={key} style={cellStyle}>
                                        {tone ? (
                                            <Box component="span" sx={{ bgcolor: tone.bg, color: tone.color, px: 1, py: 0.2, borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                                                {row[key] || "-"}
                                            </Box>
                                        ) : (
                                            row[key] || "-"
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={REQUEST_KEYS.length} style={{ ...cellStyle, textAlign: "center", padding: 18 }}>No Data Available</td>
                    </tr>
                )}
            </tbody>
        </table>
    </Box>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Dashboard = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();

    // filterMode / selected / startDate / endDate removed from active state —
    // they only fed the commented-out date/range picker UI above.

    // site_id, bucket, alarm, detailed_remarks
    const [filters, setFilters] = useState({ site_id: "", bucket: "", alarm: "", detailed_remarks: "" });

    const [apiResponse, setApiResponse] = useState(null);
    const [rows, setRows] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    const setFilterField = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

    const resetFilters = () => setFilters({ site_id: "", bucket: "", alarm: "", detailed_remarks: "" });

    const titleLabel = "Alarm Report";

    // ── Fetch data ────────────────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        try {
            action(true);
            setErrorMsg("");

            const formData = new FormData();
            if (filters.site_id.trim()) formData.append("site_id", filters.site_id.trim());
            if (filters.bucket.trim()) formData.append("bucket", filters.bucket.trim());
            if (filters.alarm.trim()) formData.append("alarm", filters.alarm.trim());
            if (filters.detailed_remarks.trim()) formData.append("detailed_remarks", filters.detailed_remarks.trim());

            /* Date filters disabled — re-enable by appending year/month or
               start_date/end_date to formData here once the picker UI above
               is uncommented again. */

            const res = await postData("alarm_log/alarm-report/", formData);

            if (!res?.status) {
                setApiResponse(null);
                setRows([]);
                setErrorMsg(res?.message || "No data returned for these filters.");
                return;
            }
            setApiResponse(res);

            // Prefer rows embedded directly in the JSON response if the API
            // ever provides them (e.g. res.data / res.rows) — this avoids the
            // second, CORS-prone request below entirely. Adjust the field
            // name here if/when the backend adds this.
            const inline = Array.isArray(res.data) ? res.data : Array.isArray(res.rows) ? res.rows : null;
            if (inline && inline.length) {
                setRows(inline.map(pickRequestKeys));
                return;
            }

            if (!res.download_url) {
                setRows([]);
                setErrorMsg(res?.message || "No data returned for these filters.");
                return;
            }

            // Fallback: fetch and parse the generated xlsx file client-side.
            //
            // IMPORTANT — this is a plain browser `fetch()` straight to
            // res.download_url, a different host than the one `postData`
            // talks to. If that file host doesn't send an
            // `Access-Control-Allow-Origin` header for this app's origin,
            // the browser blocks reading the response with a CORS error —
            // this is a server-side configuration issue, not something this
            // component can work around. The real fixes are one of:
            //   1) enable CORS for that file/media path on the backend, or
            //   2) have the API return the rows inline (see `inline` above)
            //      instead of only a download_url.
            try {
                const fileRes = await fetch(res.download_url);
                const buf = await fileRes.arrayBuffer();
                const wb = XLSX.read(buf, { type: "array" });
                const sheet = wb.Sheets[wb.SheetNames[0]];
                const parsed = XLSX.utils.sheet_to_json(sheet, { defval: "" });
                setRows(parsed.map(pickRequestKeys));
            } catch (fileErr) {
                console.error("Could not load report file (likely CORS):", fileErr);
                setRows([]);
                setErrorMsg(
                    "The report was generated, but this page isn't allowed to read the file directly (blocked by the browser's CORS policy). You can still use the download button to get the Excel file — ask the backend team to enable CORS on the file host, or return the rows directly in the API response, to show them here."
                );
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            setApiResponse(null);
            setRows([]);
            setErrorMsg("Could not load the alarm report. Please try again.");
        } finally {
            action(false);
        }
    }, [filters]);

    useEffect(() => {
        const timer = setTimeout(() => fetchData(), 500);
        return () => clearTimeout(timer);
    }, [fetchData]);

    const handleDownload = () => {
        const url = apiResponse?.download_url;
        if (!url) return;
        const link = document.createElement("a");
        link.href = url; link.download = "";
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };

    return (
        <Box p={1}>
            {/* Breadcrumb */}
            <Breadcrumbs separator={<KeyboardArrowRightIcon sx={{ fontSize: 14, color: "#9db8b5" }} />} sx={{ mb: 1, fontSize: 12.5 }}>
                <Link underline="hover" color="inherit" sx={{ fontSize: 12.5, color: "#6b8683", cursor: "pointer" }} onClick={() => navigate(-1)}>Tools</Link>
                <Typography sx={{ fontSize: 12.5, color: "#6b8683" }}>Quality Team</Typography>
                <Typography sx={{ fontSize: 12.5, color: "#6b8683" }}>Alarm Logs</Typography>
                <Typography sx={{ fontSize: 12.5, color: COLORS.text, fontWeight: 700 }}>Dashboard</Typography>
            </Breadcrumbs>

            {/* Header pill, teal to match the sidebar */}
            <Box sx={{ background: COLORS.header, color: "#fff", borderRadius: "12px", py: 1.6, px: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, boxShadow: "0 8px 24px rgba(13,79,77,0.18)", mb: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <DashboardIcon sx={{ fontSize: 20 }} />
                    <Typography sx={{ fontSize: 17, fontWeight: 700, letterSpacing: 0.3 }}>Alarm Report Dashboard</Typography>
                </Box>
                <IconButton onClick={handleDownload} title="Download Excel" disabled={!apiResponse?.download_url} sx={{ color: "#fff" }}>
                    <DownloadIcon sx={{ opacity: apiResponse?.download_url ? 1 : 0.4 }} />
                </IconButton>
            </Box>

            {/* Filter fields: site_id, bucket, alarm, detailed_remarks */}
            <Box sx={{ bgcolor: "#fff", border: `1px solid ${COLORS.accentBorder}`, borderRadius: "10px", p: 1.5, mb: 1.5, boxShadow: "0 2px 10px rgba(13,79,77,0.06)" }}>
                <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                    <FilterAltIcon sx={{ fontSize: 16, color: COLORS.accent }} />
                    <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: COLORS.text, textTransform: "uppercase", letterSpacing: 0.4 }}>Filters</Typography>
                </Box>
                <Box display="flex" gap={1.2} flexWrap="wrap" alignItems="center">
                    {REQUEST_KEYS.map(({ key, label }) => (
                        <TextField
                            key={key}
                            size="small"
                            label={label}
                            value={filters[key]}
                            onChange={setFilterField(key)}
                            sx={{ minWidth: 190, "& .MuiOutlinedInput-root": { fontSize: 13, "&.Mui-focused fieldset": { borderColor: COLORS.accent } }, "& .MuiInputLabel-root.Mui-focused": { color: COLORS.accent } }}
                        />
                    ))}
                    <Button size="small" startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />} onClick={resetFilters}
                        sx={{ textTransform: "none", fontSize: 12.5, fontWeight: 600, color: "#8a4a4a" }}>
                        Reset
                    </Button>
                </Box>
            </Box>

            {/*
              Date / Date-range filter — commented out per request.
              To bring it back: uncomment the SingleDatePicker/YearMonthPicker
              component block above, restore filterMode/selected/startDate/
              endDate state, and drop this JSX back in above the filter card
              (or wherever it's needed):

              <Box display="flex" justifyContent="flex-end" alignItems="center" flexWrap="wrap" gap={1.5}>
                  <ToggleButtonGroup value={filterMode} exclusive onChange={handleModeChange} size="small" ...>
                      <ToggleButton value="month"><CalendarMonthIcon sx={{ fontSize: 14, mr: 0.5 }} />Month</ToggleButton>
                      <ToggleButton value="daterange"><DateRangeIcon sx={{ fontSize: 14, mr: 0.5 }} />Date Range</ToggleButton>
                  </ToggleButtonGroup>
                  {filterMode === "month" ? (
                      <YearMonthPicker value={selected} onChange={(val) => { setSelected(val); setApiResponse(null); }} />
                  ) : (
                      <Box display="flex" alignItems="center" gap={1}>
                          <SingleDatePicker label="Start Date" value={startDate} maxDate={endDate || todayDate()} onChange={(d) => { setStartDate(d); setApiResponse(null); }} />
                          <Typography sx={{ fontSize: 12, color: "#888", fontWeight: 600 }}>to</Typography>
                          <SingleDatePicker label="End Date" value={endDate} minDate={startDate} onChange={(d) => { setEndDate(d); setApiResponse(null); }} />
                      </Box>
                  )}
              </Box>
            */}

            {errorMsg && (
                <Typography sx={{ color: "#c62828", fontSize: 12.5, mt: 1, mb: 1 }}>{errorMsg}</Typography>
            )}

            <AlarmTable rows={rows} titleLabel={titleLabel} />
            {loading}
        </Box>
    );
};

export default Dashboard;