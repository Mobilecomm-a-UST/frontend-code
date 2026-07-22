import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { postData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ── AT Ageing Summary Config ──────────────────────────────────────────────────
// Order in which the pagination (1 → 4) walks through the metrics.
const SUMMARY_METRICS = ["PAT", "SAT", "KAT", "SCFT"];

// Suffixes that make up each metric's column set, matching the API's key format exactly
// e.g. "PAT <=12days", "PAT 13-21days", "PAT 22-30days", "PAT >30days", "PAT Pending", "PAT Total"
const SUMMARY_SUFFIXES = [
    { label: "<=12 days", suffix: "<=12days" },
    { label: "13-21 days", suffix: "13-21days" },
    { label: "22-30 days", suffix: "22-30days" },
    { label: ">30 days", suffix: ">30days" },
    { label: "Pending", suffix: "Pending" },
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

// ── Required "month" param helper ─────────────────────────────────────────────
// The backend rejects the request unless it gets either {"month": "Dec 2025"}
// or {"start_date": "...", "end_date": "..."}. Since no filter UI is wanted here,
// this silently sends the current month (e.g. "Jul 2026") behind the scenes.
const getCurrentMonthLabel = () => {
    const d = new Date();
    return d.toLocaleString("en-US", { month: "short", year: "numeric" }); // "Jul 2026"
};

// ── Main Component ────────────────────────────────────────────────────────────
// Fetches once on mount. Page 1 = PAT, Page 2 = SAT, Page 3 = KAT, Page 4 = SCFT.
const Performance_SR_Wise_summary3 = () => {
    const { loading, action } = useLoadingDialog();

    const [summaryResponse, setSummaryResponse] = useState(null);
    const [metricPage, setMetricPage] = useState(1); // 1..4

    const fetchSummary = async () => {
        try {
            action(true);
            const formData = new FormData();
            // Backend requires either "month" or a start_date/end_date pair — sending
            // the current month automatically so no filter UI is needed here.
            formData.append("month", getCurrentMonthLabel());

            const res = await postData(
                "performance_idploy/performance_at_ageing_summary/", // <-- adjust if the router prefix differs from your other endpoints
                formData
            );

            if (res?.status) {
                setSummaryResponse(res);
            } else {
                console.error("Summary API error:", res?.error || "Unknown error");
                setSummaryResponse(null);
            }
        } catch (err) {
            console.error("Summary fetch error:", err);
            setSummaryResponse(null);
        } finally {
            action(false);
        }
    };

    useEffect(() => {
        fetchSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
    const dateRangeLabel = summaryResponse?.date_range || "";
    const titleLabel = dateRangeLabel
        ? `${currentMetric} Ageing Summary  |  ${dateRangeLabel}`
        : `${currentMetric} Ageing Summary`;
    const STRIPE = "#f4f7fb";

    return (
        <Box p={1}>
            {/* ── Top Bar ── */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <Typography variant="h5" fontWeight={700}>
                    Performance SR Wise Tracking Dashboard
                </Typography>

                {/* ── Only a download button, no date filters ── */}
                <IconButton
                    onClick={handleDownload}
                    title="Download Excel"
                    disabled={!summaryResponse?.download_url}
                >
                    <DownloadIcon color={summaryResponse?.download_url ? "primary" : "disabled"} />
                </IconButton>
            </Box>

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

export const MemoPerformance_SR_Wise_summary3 = React.memo(Performance_SR_Wise_summary3);