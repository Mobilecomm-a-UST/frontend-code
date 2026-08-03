import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, TextField, ToggleButtonGroup, ToggleButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";

import { postData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ── Constants ────────────────────────────────────────────────────────────────
const todayStr = new Date().toISOString().split("T")[0];
const currentMonthStr = todayStr.slice(0, 7); // "YYYY-MM"

const getDefaultStartDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
};

// ── Month -> "mon yyyy" param helper (e.g. "2026-06" -> "jun 2026") ──────────
const formatMonthParam = (yyyyMM) => {
    const [y, m] = yyyyMM.split("-").map(Number);
    const date = new Date(y, m - 1, 1);
    const monthName = date.toLocaleString("en-US", { month: "short" }).toLowerCase();
    return `${monthName} ${y}`;
};

// ── Custom 26th(prev month) -> 25th(selected month) window, for display only
//    (the real range comes back from the API's `date_range` field) ──────────
const getCustomMonthRange = (yyyyMM) => {
    const [y, m] = yyyyMM.split("-").map(Number);

    // Start: 26th of the previous month
    const prevMonthDate = new Date(y, m - 2, 26);
    const startY = prevMonthDate.getFullYear();
    const startM = prevMonthDate.getMonth() + 1;
    const startD = prevMonthDate.getDate();
    const start = `${startY}-${String(startM).padStart(2, "0")}-${String(startD).padStart(2, "0")}`;

    // End: 25th of the selected month, capped at today
    const endCandidate = `${y}-${String(m).padStart(2, "0")}-25`;
    const end = endCandidate > todayStr ? todayStr : endCandidate;

    return { start, end };
};

// ── AT Ageing Summary Config ──────────────────────────────────────────────────
// Order in which the pagination (1 → 4) walks through the metrics.
const SUMMARY_METRICS = ["PAT", "SAT", "KAT", "SCFT"];

// Suffixes that make up each metric's column set, matching the API's key format exactly
// e.g. "PAT <=12days", "PAT 13-21days", "PAT 22-30days", "PAT >30days", "PAT Pending", "PAT Total"
const SUMMARY_SUFFIXES = [
    { label: "<7days", suffix: "<7days" },
    { label: "8-12days", suffix: "8-12days" },
    { label: "13-21days", suffix: "13-21days" },
    { label: ">21days", suffix: ">21days" },
    { label: "Total", suffix: "Total" },
];

// ── 5G Colour Theme ───────────────────────────────────────────────────────────
const COLORS = {
    titleBg:  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
    badge:    "#2e7d32",
    border:   "#1f4037",
};

// ── Shared Styles ─────────────────────────────────────────────────────────────
const cellSt = {
    padding: "4px 8px",
    border: "1px solid #c0c0c0",
    textAlign: "center",
    fontSize: 12,
    whiteSpace: "nowrap",
};

const stickySt = {
    ...cellSt,
    position: "sticky",
    left: 0,
    zIndex: 2,
    textAlign: "center",
    fontWeight: 600,
    fontSize: 12,
};

// ── Month / Date Range Toggle Styles ─────────────────────────────────────────
const toggleWrapSt = {
    background: "#fdece0",
    borderRadius: "10px",
    padding: "4px",
    display: "flex",
    gap: "4px",
};

const toggleBtnSt = {
    textTransform: "none",
    fontWeight: 600,
    fontSize: 13,
    border: "none",
    borderRadius: "8px !important",
    padding: "6px 14px",
    color: "#5c4632",
    "&.Mui-selected": {
        background: "#1e2a5e",
        color: "#fff",
    },
    "&.Mui-selected:hover": {
        background: "#1e2a5e",
    },
};

// ── Main Component ────────────────────────────────────────────────────────────
// Page 1 = PAT, Page 2 = SAT, Page 3 = KAT, Page 4 = SCFT.
//
// This dashboard now owns its own Month / Date Range filter (it no longer
// mirrors the Detailed Report tab's range via props) — matching the same
// Month/Date Range toggle pattern used elsewhere in the app.
const Performance_SR_Wise_Pending_summary = () => {
    const { loading, action } = useLoadingDialog();

    const [summaryResponse, setSummaryResponse] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [metricPage, setMetricPage] = useState(1); // 1..4

    // Guards against duplicate/overlapping requests
    const requestIdRef = React.useRef(0);
    const abortControllerRef = React.useRef(null);

    // ── Month / Date Range Toggle ──────────────────────────────────────────
    const [dateMode, setDateMode] = useState("range"); // "month" | "range"
    const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

    const [startDate, setStartDate] = useState(getDefaultStartDate());
    const [endDate, setEndDate] = useState(todayStr);

    // ── Effective dates used for display (derived from mode) ───────────────
    //    In month mode this is the 26th(prev)->25th(selected) window, purely
    //    for local display before the API responds. The API itself is driven
    //    by the `month` param and returns the authoritative range.
    const customMonthRange = dateMode === "month" ? getCustomMonthRange(selectedMonth) : null;
    const effectiveStartDate = dateMode === "month" ? customMonthRange.start : startDate;
    const effectiveEndDate   = dateMode === "month" ? customMonthRange.end : endDate;

    const handleModeChange = (_e, newMode) => {
        if (newMode) setDateMode(newMode);
    };

    const fetchSummary = async () => {
        if (dateMode === "range") {
            if (!startDate || !endDate) return;
            if (startDate > endDate) return;
        } else {
            if (!selectedMonth) return;
        }

        // Cancel any request still in flight from a previous param change
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Stale-response guard: only the latest request may update state
        const thisRequestId = ++requestIdRef.current;

        try {
            action(true);
            setFetchError(null);

            const formData = new FormData();

            if (dateMode === "month") {
                // Backend resolves this to the 26th(prev month) -> 25th(selected month) window
                formData.append("month", formatMonthParam(selectedMonth));
            } else {
                formData.append("start_date", startDate);
                formData.append("end_date", endDate);
            }

            const res = await postData(
                "performance_idploy/generate-atsr-pending-aging/", // <-- adjust if the router prefix differs from your other endpoints
                formData,
                { signal: controller.signal }
            );

            if (thisRequestId !== requestIdRef.current) return; // superseded

            if (res?.status) {
                setSummaryResponse(res);
            } else {
                console.error("Summary API error:", res?.error || "Unknown error");
                setSummaryResponse(null);
                setFetchError(res?.error || "Failed to load data. Please try again.");
            }
        } catch (err) {
            if (thisRequestId !== requestIdRef.current) return; // superseded/aborted

            if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError" || err?.name === "AbortError") {
                return;
            }

            console.error("Summary fetch error:", err);
            setSummaryResponse(null);

            const isTimeout = err?.code === "ECONNABORTED" || /timeout/i.test(err?.message || "");
            setFetchError(
                isTimeout
                    ? "The request timed out. The server took too long to respond — please try again or narrow the date range."
                    : "Something went wrong while fetching data. Please try again."
            );
        } finally {
            if (thisRequestId === requestIdRef.current) action(false);
        }
    };

    // ── Debounced fetch whenever the filter changes ─────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => { fetchSummary(); }, 500);
        return () => {
            clearTimeout(timer);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateMode, selectedMonth, startDate, endDate]);

    const handleDownload = () => {
        const url = summaryResponse?.download_url;
        if (!url) return;
        const link = document.createElement("a");
        link.href = url;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const rows = summaryResponse?.data || [];
    const currentMetric = SUMMARY_METRICS[metricPage - 1];

    // Prefer the authoritative range returned by the API; fall back to the
    // locally-computed one while waiting for the response.
    const dateRangeLabel = summaryResponse?.date_range
        ? summaryResponse.date_range
        : (effectiveStartDate && effectiveEndDate
            ? `${effectiveStartDate}  to  ${effectiveEndDate}`
            : "");
    const titleLabel = dateRangeLabel
        ? `${currentMetric} Aging Summary  |  ${dateRangeLabel}`
        : `${currentMetric} Aging Summary`;
    const STRIPE = "#f4f7fb";

    return (
        <Box p={1}>
            {/* ── Top Bar ── */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <Typography variant="h5" fontWeight={700}>
                    Performance SR Wise Pending Aging Dashboard
                </Typography>

                <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                    {/* ── Month / Date Range Toggle ── */}
                    <ToggleButtonGroup
                        value={dateMode}
                        exclusive
                        onChange={handleModeChange}
                        sx={toggleWrapSt}
                    >
                        <ToggleButton value="month" sx={toggleBtnSt}>
                            <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.6 }} />
                            Month
                        </ToggleButton>
                        <ToggleButton value="range" sx={toggleBtnSt}>
                            <DateRangeIcon sx={{ fontSize: 16, mr: 0.6 }} />
                            Date Range
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {dateMode === "month" ? (
                        <TextField
                            size="small"
                            label="Month"
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => {
                                if (e.target.value <= currentMonthStr)
                                    setSelectedMonth(e.target.value);
                            }}
                            inputProps={{ max: currentMonthStr }}
                            InputLabelProps={{ shrink: true }}
                            sx={{ minWidth: 155 }}
                        />
                    ) : (
                        <>
                            <TextField
                                size="small"
                                label="Start Date"
                                type="date"
                                value={startDate}
                                onChange={(e) => {
                                    if (e.target.value <= todayStr)
                                        setStartDate(e.target.value);
                                }}
                                inputProps={{ max: endDate || todayStr }}
                                InputLabelProps={{ shrink: true }}
                                sx={{ minWidth: 155 }}
                            />

                            <Typography variant="body2" color="text.secondary">~</Typography>

                            <TextField
                                size="small"
                                label="End Date"
                                type="date"
                                value={endDate}
                                onChange={(e) => {
                                    if (e.target.value <= todayStr)
                                        setEndDate(e.target.value);
                                }}
                                inputProps={{ min: startDate, max: todayStr }}
                                InputLabelProps={{ shrink: true }}
                                sx={{ minWidth: 155 }}
                            />
                        </>
                    )}

                    <IconButton
                        onClick={handleDownload}
                        title="Download Excel"
                        disabled={!summaryResponse?.download_url}
                    >
                        <DownloadIcon color={summaryResponse?.download_url ? "primary" : "disabled"} />
                    </IconButton>
                </Box>
            </Box>

            {/* ── Error Banner ── */}
            {fetchError && (
                <Box
                    mt={2}
                    sx={{
                        border: "1px solid #ffcdd2",
                        background: "#fff5f5",
                        color: "#b71c1c",
                        borderRadius: 2,
                        px: 2,
                        py: 1.2,
                        fontSize: 13,
                        fontWeight: 500,
                    }}
                >
                    {fetchError}
                </Box>
            )}

            {/* ── Table ── */}
            <Box
                mt={2}
                sx={{
                    overflowX: "auto",
                    borderRadius: 2,
                    border: "1px solid #c0c0c0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        tableLayout: "auto",
                        minWidth: 700,
                    }}
                >
                    <thead>
                        {/* Title row */}
                        <tr>
                            <th
                                colSpan={SUMMARY_SUFFIXES.length + 1}
                                style={{
                                    ...cellSt,
                                    background: COLORS.titleBg,
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    textAlign: "center",
                                    padding: "10px 12px",
                                    border: `1px solid ${COLORS.border}`,
                                }}
                            >
                                {titleLabel}
                            </th>
                        </tr>

                        {/* Column header row */}
                        <tr>
                            <th
                                style={{
                                    ...cellSt,
                                    background: COLORS.headerBg,
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: 12,
                                    border: `1px solid ${COLORS.border}`,
                                    padding: "6px 10px",
                                    position: "sticky",
                                    left: 0,
                                    zIndex: 3,
                                }}
                            >
                                Circle
                            </th>
                            {SUMMARY_SUFFIXES.map((s) => (
                                <th
                                    key={s.suffix}
                                    style={{
                                        ...cellSt,
                                        background: COLORS.headerBg,
                                        color: "#fff",
                                        fontWeight: 700,
                                        fontSize: 12,
                                        border: `1px solid ${COLORS.border}`,
                                        padding: "6px 10px",
                                    }}
                                >
                                    {s.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.length > 0 ? (
                            rows.map((row, idx) => (
                                <tr
                                    key={`${row?.Circle ?? "circle"}-${idx}`}
                                    style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
                                >
                                    <td
                                        style={{
                                            ...stickySt,
                                            background: idx % 2 === 0 ? "#fff" : STRIPE,
                                        }}
                                    >
                                        {row?.Circle ?? "-"}
                                    </td>
                                    {SUMMARY_SUFFIXES.map((s) => {
                                        // Column key built exactly as the API returns it, e.g. "PAT <=12days"
                                        const key = `${currentMetric} ${s.suffix}`;
                                        const val = row?.[key];
                                        const isTotal = s.suffix === "Total";
                                        return (
                                            <td
                                                key={s.suffix}
                                                style={{
                                                    ...cellSt,
                                                    fontWeight: isTotal ? 700 : 400,
                                                    background: isTotal ? "#fff2cc" : undefined,
                                                }}
                                            >
                                                {val !== null && val !== undefined && val !== "" ? val : "-"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={SUMMARY_SUFFIXES.length + 1}
                                    style={{
                                        ...cellSt,
                                        padding: 20,
                                        color: "#9e9e9e",
                                        fontSize: 14,
                                        textAlign: "center",
                                    }}
                                >
                                    No Data Available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Box>

            {/* ── Page numbers: 1=PAT, 2=SAT, 3=KAT, 4=SCFT ── */}
            <Box display="flex" justifyContent="center" alignItems="center" gap={1} mt={2}>
                {SUMMARY_METRICS.map((metric, i) => {
                    const pageNum = i + 1;
                    const active = pageNum === metricPage;
                    return (
                        <Box
                            key={metric}
                            onClick={() => setMetricPage(pageNum)}
                            sx={{
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 0.3,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: 14,
                                    color: active ? "#fff" : "#1f4037",
                                    background: active ? COLORS.headerBg : "#e8efec",
                                    border: `1px solid ${COLORS.border}`,
                                }}
                            >
                                {pageNum}
                            </Box>
                            <Typography
                                variant="caption"
                                sx={{ fontWeight: active ? 700 : 400, color: active ? "#1f4037" : "#9e9e9e" }}
                            >
                                {metric}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            {loading}
        </Box>
    );
};

export const MemoPerformance_SR_Wise_Pending_summary = React.memo(Performance_SR_Wise_Pending_summary);