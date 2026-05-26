import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    TextField,
    Breadcrumbs,
    Link,
    Chip,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { useNavigate } from "react-router-dom";

import { postData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ── Constants ────────────────────────────────────────────────────────────────
const todayStr = new Date().toISOString().split("T")[0];
const MAX_ROWS = 50;

const getDefaultStartDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
};

// ── Technology Tabs ──────────────────────────────────────────────────────────
const TECH_TABS = [
    { key: "4G",    label: "4G"    },
    { key: "5G",    label: "5G"    },
    { key: "4G+5G", label: "4G+5G" },
];

// ── Table Columns (matches Excel screenshot) ─────────────────────────────────
const COLUMNS = [
    { label: "SR_Site ID", key: "SR_Site ID"  },
    { label: "Site ID",    key: "Site ID"     },
    { label: "Circle",     key: "Circle"      },
    { label: "PAT",        key: "PAT"         },
    { label: "PAT Date",   key: "PAT Date"    },
    { label: "SAT",        key: "SAT"         },
    { label: "SAT Date",   key: "SAT Date"    },
    { label: "KAT",        key: "KAT"         },
    { label: "KAT Date",   key: "KAT Date"    },
    { label: "SCFT",       key: "SCFT"        },
    { label: "SCFT Date",  key: "SCFT Date"   },
];

// ── Tech Colours ─────────────────────────────────────────────────────────────
const TECH_COLORS = {
    "4G": {
        active:   "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        header:   "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        tabColor: "#1e3c72",
        badge:    "#1976d2",
    },
    "5G": {
        active:   "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
        header:   "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
        tabColor: "#134e5e",
        badge:    "#2e7d32",
    },
    "4G+5G": {
        active:   "linear-gradient(135deg, #41295a 0%, #2F0743 100%)",
        header:   "linear-gradient(135deg, #252326 0%, #414345 100%)",
        tabColor: "#41295a",
        badge:    "#6a1b9a",
    },
};

// ── Status Cell Colour Helper ─────────────────────────────────────────────────
const getStatusStyle = (value) => {
    if (!value || value === "-" || value === "") return {};
    const v = String(value).toLowerCase();
    if (v === "accepted") return { color: "#1b5e20", fontWeight: 600 };
    if (v === "pending")  return { color: "#e65100", fontWeight: 600 };
    if (v === "offered")  return { color: "#0d47a1", fontWeight: 600 };
    return {};
};

// ── Shared Styles ─────────────────────────────────────────────────────────────
const cellSt = {
    padding:    "4px 8px",
    border:     "1px solid #c0c0c0",
    textAlign:  "center",
    fontSize:   12,
    whiteSpace: "nowrap",
};

const stickySt = {
    ...cellSt,
    position:   "sticky",
    left:       0,
    zIndex:     2,
    textAlign:  "center",
    fontWeight: 600,
    fontSize:   12,
};

// ── Table Component ───────────────────────────────────────────────────────────
const TechTable = ({ tech, apiResponse, dateRangeLabel }) => {
    const colors = TECH_COLORS[tech];
    const STRIPE = "#f4f7fb";

    // API returns array of row objects per tech key
    const rawData  = apiResponse?.data?.[tech] || [];

    // Limit to MAX_ROWS (50)
    const tableRows = rawData.slice(0, MAX_ROWS);

    const titleLabel = dateRangeLabel
        ? `AT Report  |  ${dateRangeLabel}`
        : "AT Report";

    return (
        <Box
            mt={1}
            sx={{
                overflowX:    "auto",
                borderRadius: 2,
                border:       "1px solid #c0c0c0",
                boxShadow:    "0 2px 8px rgba(0,0,0,0.08)",
            }}
        >
            <table
                style={{
                    width:           "100%",
                    borderCollapse:  "collapse",
                    tableLayout:     "auto",
                    minWidth:        900,
                }}
            >
                <thead>
                    {/* ── Title row ── */}
                    <tr>
                        <th
                            colSpan={COLUMNS.length}
                            style={{
                                ...cellSt,
                                background: colors.active,
                                color:      "#fff",
                                fontSize:   14,
                                fontWeight: 700,
                                textAlign:  "center",
                                padding:    "10px 12px",
                                border:     "1px solid #2e4a70",
                            }}
                        >
                            {titleLabel}
                        </th>
                    </tr>

                    {/* ── Column header row ── */}
                    <tr>
                        {COLUMNS.map((col) => (
                            <th
                                key={col.key}
                                style={{
                                    ...cellSt,
                                    background: colors.header,
                                    color:      "#fff",
                                    fontWeight: 700,
                                    fontSize:   12,
                                    border:     "1px solid #2e4a70",
                                    padding:    "6px 10px",
                                    // Make first col sticky in header too
                                    ...(col.key === "SR_Site ID"
                                        ? { position: "sticky", left: 0, zIndex: 3 }
                                        : {}),
                                }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {tableRows.length > 0 ? (
                        tableRows.map((row, idx) => (
                            <tr
                                key={`${row["SR_Site ID"]}-${idx}`}
                                style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
                            >
                                {COLUMNS.map((col) => {
                                    const val   = row?.[col.key] ?? "-";
                                    const isStatus =
                                        col.key === "PAT"  ||
                                        col.key === "SAT"  ||
                                        col.key === "KAT"  ||
                                        col.key === "SCFT";
                                    const isFirst = col.key === "SR_Site ID";

                                    return (
                                        <td
                                            key={col.key}
                                            style={{
                                                ...(isFirst ? stickySt : cellSt),
                                                background: isFirst
                                                    ? idx % 2 === 0 ? "#fff" : STRIPE
                                                    : undefined,
                                                ...( isStatus ? getStatusStyle(val) : {} ),
                                            }}
                                        >
                                            {val || "-"}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={COLUMNS.length}
                                style={{
                                    ...cellSt,
                                    padding:   20,
                                    color:     "#9e9e9e",
                                    fontSize:  14,
                                    textAlign: "center",
                                }}
                            >
                                No Data Available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Row count badge */}
            {tableRows.length > 0 && (
                <Box
                    sx={{
                        display:        "flex",
                        justifyContent: "flex-end",
                        alignItems:     "center",
                        px: 2, py: 0.8,
                        borderTop:      "1px solid #e0e0e0",
                        background:     "#fafafa",
                        gap: 1,
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Showing
                    </Typography>
                    <Chip
                        label={`${tableRows.length} / ${rawData.length} rows`}
                        size="small"
                        sx={{
                            background: colors.badge,
                            color:      "#fff",
                            fontWeight: 600,
                            fontSize:   11,
                        }}
                    />
                    {rawData.length > MAX_ROWS && (
                        <Typography variant="caption" color="error">
                            (limited to first {MAX_ROWS} rows)
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Performance_SR_Wise = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();

    const [apiResponse, setApiResponse] = useState(null);
    const [startDate,   setStartDate]   = useState(getDefaultStartDate());
    const [endDate,     setEndDate]     = useState(todayStr);
    const [activeTech,  setActiveTech]  = useState("4G");

    // ── Fetch ─────────────────────────────────────────────────────────────
    const fetchData = async () => {
        if (!startDate || !endDate)        return;
        if (startDate > endDate)           return;

        try {
            action(true);

            const formData = new FormData();
            formData.append("start_date", startDate);
            formData.append("end_date",   endDate);

            const res = await postData(
                " performance_idploy/generate-sr-wise/",   // ← update endpoint if different
                formData
            );

            if (res?.status) {
                setApiResponse(res);
            } else {
                console.error("API error:", res?.error || "Unknown error");
                setApiResponse(null);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            action(false);
        }
    };

    // ── Debounced effect ──────────────────────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => { fetchData(); }, 500);
        return () => clearTimeout(timer);
    }, [startDate, endDate]);

    // ── Download ──────────────────────────────────────────────────────────
    const handleDownload = () => {
        const url = apiResponse?.download_url;
        if (!url) return;
        const link = document.createElement("a");
        link.href     = url;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const dateRangeLabel =
        startDate && endDate ? `${startDate} to ${endDate}` : "";

    return (
        <>
            {/* Breadcrumb */}
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
                        Performance At TAT
                    </Link>
                    <Typography color="text.primary">Performance SR Wise</Typography>
                </Breadcrumbs>
            </div>

            <Box p={1}>
                {/* ── Top Bar ── */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                >
                    {/* Left */}
                    <Typography variant="h5" fontWeight={700}>
                        Performance SR Wise
                    </Typography>

                    {/* Right — date pickers + download */}
                    <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                        <TextField
                            size="small"
                            label="From Date"
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
                            label="To Date"
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

                        <IconButton
                            onClick={handleDownload}
                            title="Download Excel"
                            disabled={!apiResponse?.download_url}
                        >
                            <DownloadIcon
                                color={apiResponse?.download_url ? "primary" : "disabled"}
                            />
                        </IconButton>
                    </Box>
                </Box>

                {/* ── Technology Tabs ── */}
                <Box mt={2} sx={{ display: "flex", borderBottom: "2px solid #e0e0e0" }}>
                    {TECH_TABS.map((tab) => {
                        const isActive = activeTech === tab.key;
                        const tColor   = TECH_COLORS[tab.key];
                        return (
                            <Box
                                key={tab.key}
                                onClick={() => setActiveTech(tab.key)}
                                sx={{
                                    px: 3, py: 1,
                                    cursor:       "pointer",
                                    userSelect:   "none",
                                    fontWeight:   isActive ? 700 : 500,
                                    fontSize:     14,
                                    color:        isActive ? "#fff" : tColor.tabColor,
                                    background:   isActive ? tColor.active : "transparent",
                                    borderRadius: "6px 6px 0 0",
                                    borderBottom: isActive
                                        ? `3px solid ${tColor.tabColor}`
                                        : "3px solid transparent",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        background: isActive ? tColor.active : "#f0f4ff",
                                    },
                                }}
                            >
                                {tab.label}
                            </Box>
                        );
                    })}
                </Box>

                {/* ── Table ── */}
                <TechTable
                    tech={activeTech}
                    apiResponse={apiResponse}
                    dateRangeLabel={dateRangeLabel}
                />

                {loading}
            </Box>
        </>
    );
};

export default Performance_SR_Wise;