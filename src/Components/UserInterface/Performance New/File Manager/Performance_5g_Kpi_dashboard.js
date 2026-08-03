import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    TextField,
    Chip,
    Button,
    InputAdornment,
    Pagination,Breadcrumbs, Link, 
} from "@mui/material";
import {KeyboardArrowRight as KeyboardArrowRightIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    Legend,
    CartesianGrid,
} from "recharts";

import { postData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ── Constants ────────────────────────────────────────────────────────────────
const ROWS_PER_PAGE = 25;

// ── 5G Colour Theme (matches the rest of the Performance AT dashboards) ─────
const COLORS = {
    titleBg: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
    badge: "#2e7d32",
    border: "#1f4037",
    ok: "#2e7d32",
    notOk: "#c62828",
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

// ── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color }) => (
    <Box
        sx={{
            flex: "1 1 160px",
            minWidth: 160,
            borderRadius: 2,
            p: 1.6,
            background: "#fff",
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
    >
        <Typography variant="caption" sx={{ color: "#757575", fontWeight: 600 }}>
            {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: color || "#1f4037", mt: 0.3 }}>
            {value}
        </Typography>
    </Box>
);

// ── Chip Input (paste a list or type, press Enter) ───────────────────────────
// Splits on comma / newline / tab. Backspace on empty input removes the last chip.
const ChipInput = ({ label, placeholder, values, onChange }) => {
    const [text, setText] = useState("");

    const addFromText = (raw) => {
        const parts = raw
            .split(/[,\n\t]+/)
            .map((s) => s.trim())
            .filter(Boolean);
        if (!parts.length) return;
        const merged = Array.from(new Set([...values, ...parts.map((p) => p.toUpperCase())]));
        onChange(merged);
        setText("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addFromText(text);
        } else if (e.key === "Backspace" && !text && values.length) {
            onChange(values.slice(0, -1));
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData("text");
        if (/[,\n\t]/.test(pasted)) {
            e.preventDefault();
            addFromText(pasted);
        }
    };

    const removeChip = (chip) => onChange(values.filter((v) => v !== chip));

    return (
        <Box sx={{ minWidth: 260 }}>
            <TextField
                size="small"
                label={label}
                placeholder={placeholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                }}
            />
            {values.length > 0 && (
                <Box display="flex" gap={0.5} flexWrap="wrap" mt={0.7}>
                    {values.map((v) => (
                        <Chip
                            key={v}
                            label={v}
                            size="small"
                            onDelete={() => removeChip(v)}
                            sx={{ fontWeight: 600 }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Performance_5g_Kpi_dashboard = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const [apiResponse, setApiResponse] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

    // Guards against duplicate/overlapping requests
    const requestIdRef = React.useRef(0);
    const abortControllerRef = React.useRef(null);

    // ── Filters ──────────────────────────────────────────────────────────
    const [circles, setCircles] = useState([]);
    const [siteIds, setSiteIds] = useState([]);

    // ── Table search / pagination ───────────────────────────────────────
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    // ── Fetch ─────────────────────────────────────────────────────────────
    const fetchKpiStatus = async () => {
        // Cancel any request still in flight
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const thisRequestId = ++requestIdRef.current;

        try {
            action(true);
            setFetchError(null);

            const formData = new FormData();
            if (circles.length) formData.append("circle", circles.join(","));
            if (siteIds.length) formData.append("site_id", siteIds.join(","));

            const res = await postData(
                "kpi_monitoring/site-kpi-status/",
                formData,
                { signal: controller.signal }
            );

            if (thisRequestId !== requestIdRef.current) return; // superseded

            if (res?.status) {
                setApiResponse(res);
            } else {
                console.error("KPI status API error:", res?.error || res?.message || "Unknown error");
                setApiResponse(null);
                setFetchError(res?.error || res?.message || "Failed to load KPI status. Please try again.");
            }
        } catch (err) {
            if (thisRequestId !== requestIdRef.current) return;

            if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError" || err?.name === "AbortError") {
                return;
            }

            console.error("KPI status fetch error:", err);
            setApiResponse(null);

            const isTimeout = err?.code === "ECONNABORTED" || /timeout/i.test(err?.message || "");
            setFetchError(
                isTimeout
                    ? "The request timed out. The server took too long to respond — please try again."
                    : "Something went wrong while fetching KPI status. Please try again."
            );
        } finally {
            if (thisRequestId === requestIdRef.current) {
                action(false);
                setHasFetchedOnce(true);
            }
        }
    };

    // ── Load the overall (unfiltered) report on first mount ────────────────
    useEffect(() => {
        fetchKpiStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGenerate = () => {
        setPage(1);
        fetchKpiStatus();
    };

    const handleReset = () => {
        setCircles([]);
        setSiteIds([]);
        setSearchTerm("");
        setPage(1);
        // Re-fetch overall (unfiltered) report after clearing
        setTimeout(() => fetchKpiStatus(), 0);
    };

    const handleDownload = () => {
        const url = apiResponse?.download_url;
        if (!url) return;
        const link = document.createElement("a");
        link.href = url;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ── Reset to page 1 whenever the underlying data or search term changes ──
    useEffect(() => {
        setPage(1);
    }, [apiResponse, searchTerm]);

    const rawRows = apiResponse?.data || [];

    // ── Search filter (Site ID or Circle) ──────────────────────────────────
    const filteredRows = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return rawRows;
        return rawRows.filter((row) => {
            const siteId = String(row?.["Site ID"] ?? "").toLowerCase();
            const circle = String(row?.["Circle"] ?? "").toLowerCase();
            const vendor = String(row?.["Vendor"] ?? "").toLowerCase();
            return siteId.includes(term) || circle.includes(term) || vendor.includes(term);
        });
    }, [rawRows, searchTerm]);

    // ── Page slice ───────────────────────────────────────────────────────
    const pageCount = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE));
    const pagedRows = useMemo(() => {
        const start = (page - 1) * ROWS_PER_PAGE;
        return filteredRows.slice(start, start + ROWS_PER_PAGE);
    }, [filteredRows, page]);

    // ── Stat cards ──────────────────────────────────────────────────────
    const totalSites = apiResponse?.total_sites ?? rawRows.length;
    const okCount = useMemo(
        () => rawRows.filter((r) => String(r?.["KPI Status"]).toLowerCase() === "ok").length,
        [rawRows]
    );
    const notOkCount = useMemo(
        () => rawRows.filter((r) => String(r?.["KPI Status"]).toLowerCase() === "not ok").length,
        [rawRows]
    );

    // ── Vendor-wise OK / Not OK breakdown, for the chart ────────────────
    const vendorChartData = useMemo(() => {
        const map = {};
        rawRows.forEach((row) => {
            const vendor = row?.Vendor || "Unknown";
            const status = String(row?.["KPI Status"] || "").toLowerCase();
            if (!map[vendor]) map[vendor] = { vendor, OK: 0, "Not OK": 0 };
            if (status === "ok") map[vendor].OK += 1;
            else if (status === "not ok") map[vendor]["Not OK"] += 1;
        });
        return Object.values(map);
    }, [rawRows]);

    const STRIPE = "#f4f7fb";

    return (
<>
         <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
                        <Breadcrumbs
                            aria-label="breadcrumb"
                            maxItems={3}
                            separator={<KeyboardArrowRightIcon fontSize="small" />}
                        >
                            <Link underline="hover" onClick={() => navigate("/tools")}>
                                Tools
                            </Link>
                            <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
                                Performance At
                            </Link>
                            <Typography color="text.primary">Dashboard</Typography>
                        </Breadcrumbs>
                    </div>
        <Box p={1}>
            {/* ── Title Banner ── */}
            <Box
                sx={{
                    background: COLORS.titleBg,
                    color: "#fff",
                    borderRadius: 3,
                    px: 2.5,
                    py: 1.4,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                }}
            >
                <AssessmentIcon />
                <Typography variant="h6" fontWeight={700}>
                    5G Performance KPI Dashboard
                </Typography>
            </Box>

            {/* ── Filter Bar ── */}
            <Box
                sx={{
                    background: "#fdece0",
                    borderRadius: 3,
                    p: 2,
                    mb: 2,
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                }}
            >
                <Box display="flex" alignItems="center" gap={0.6} sx={{ pt: 1 }}>
                    <FilterAltIcon fontSize="small" sx={{ color: "#5c4632" }} />
                    <Typography variant="body2" fontWeight={700} sx={{ color: "#5c4632" }}>
                        Filter
                    </Typography>
                </Box>

                <ChipInput
                    label="Site ID / Short Name"
                    placeholder="Paste a list or type, press Enter"
                    values={siteIds}
                    onChange={setSiteIds}
                />

                <ChipInput
                    label="Circle"
                    placeholder="e.g. MAH, DEL, ROTN"
                    values={circles}
                    onChange={setCircles}
                />

                <Box display="flex" gap={1} sx={{ pt: 0.5 }}>
                    <Button
                        variant="contained"
                        startIcon={<AssessmentIcon />}
                        onClick={handleGenerate}
                        sx={{ background: "#1e2a5e", "&:hover": { background: "#161f47" } }}
                    >
                        Generate Report
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </Box>
            </Box>

            {/* ── Error Banner ── */}
            {fetchError && (
                <Box
                    mb={2}
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

            {/* ── Stat Cards ── */}
            <Box display="flex" gap={1.5} flexWrap="wrap" mb={2}>
                <StatCard label="Total Sites" value={totalSites} color="#1f4037" />
                <StatCard label="KPI OK" value={okCount} color={COLORS.ok} />
                <StatCard label="KPI Not OK" value={notOkCount} color={COLORS.notOk} />
            </Box>

            {/* ── Vendor-wise Chart ── */}
            {vendorChartData.length > 0 && (
                <Box
                    sx={{
                        background: "#fff",
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        p: 2,
                        mb: 2,
                        height: 280,
                    }}
                >
                    <Typography variant="subtitle2" fontWeight={700} mb={1} sx={{ color: "#1f4037" }}>
                        KPI Status by Vendor
                    </Typography>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={vendorChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="vendor" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="OK" fill={COLORS.ok} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Not OK" fill={COLORS.notOk} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            )}

            {/* ── Table Top Bar: search + download ── */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} mb={1}>
                <TextField
                    size="small"
                    label="Search Site ID / Circle / Vendor"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ minWidth: 260 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm ? (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setSearchTerm("")} title="Clear search">
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                    }}
                />

                <IconButton
                    onClick={handleDownload}
                    title="Download Excel"
                    disabled={!apiResponse?.download_url}
                >
                    <DownloadIcon color={apiResponse?.download_url ? "primary" : "disabled"} />
                </IconButton>
            </Box>

            {/* ── Table ── */}
            <Box
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
                        minWidth: 600,
                    }}
                >
                    <thead>
                        <tr>
                            {["Vendor", "Circle", "Site ID", "KPI Status"].map((label, idx) => (
                                <th
                                    key={label}
                                    style={{
                                        ...cellSt,
                                        background: COLORS.headerBg,
                                        color: "#fff",
                                        fontWeight: 700,
                                        fontSize: 12,
                                        border: `1px solid ${COLORS.border}`,
                                        padding: "8px 10px",
                                        ...(idx === 0 ? { position: "sticky", left: 0, zIndex: 3 } : {}),
                                    }}
                                >
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {pagedRows.length > 0 ? (
                            pagedRows.map((row, idx) => {
                                const status = String(row?.["KPI Status"] || "").toLowerCase();
                                const isOk = status === "ok";
                                return (
                                    <tr
                                        key={`${row?.["Site ID"]}-${idx}`}
                                        style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
                                    >
                                        <td
                                            style={{
                                                ...stickySt,
                                                background: idx % 2 === 0 ? "#fff" : STRIPE,
                                            }}
                                        >
                                            {row?.Vendor ?? "-"}
                                        </td>
                                        <td style={cellSt}>{row?.Circle ?? "-"}</td>
                                        <td style={cellSt}>{row?.["Site ID"] ?? "-"}</td>
                                        <td style={cellSt}>
                                            <Chip
                                                label={row?.["KPI Status"] ?? "-"}
                                                size="small"
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: 11,
                                                    color: isOk ? COLORS.ok : COLORS.notOk,
                                                    background: isOk ? "#e8f5e9" : "#fdecea",
                                                    border: `1px solid ${isOk ? "#a5d6a7" : "#ef9a9a"}`,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    style={{
                                        ...cellSt,
                                        padding: 20,
                                        color: "#9e9e9e",
                                        fontSize: 14,
                                        textAlign: "center",
                                    }}
                                >
                                    {!hasFetchedOnce
                                        ? "Loading..."
                                        : searchTerm
                                        ? "No Matching Records Found"
                                        : "No Data Available"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Row count badge */}
                {filteredRows.length > 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            px: 2,
                            py: 0.8,
                            borderTop: "1px solid #e0e0e0",
                            background: "#fafafa",
                            gap: 1,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            Showing
                        </Typography>
                        <Chip
                            label={`${pagedRows.length} of ${filteredRows.length} (Page ${page} / ${pageCount})`}
                            size="small"
                            sx={{
                                background: COLORS.badge,
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: 11,
                            }}
                        />
                    </Box>
                )}
            </Box>

            {/* ── Pagination ── */}
            {filteredRows.length > ROWS_PER_PAGE && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_e, value) => setPage(value)}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            )}

            {loading}
        </Box>
        </>
    );
};


export default Performance_5g_Kpi_dashboard;