import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Button,
    Typography,
    IconButton,
    TextField,
    MenuItem,
    Popover,
    InputAdornment
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { postData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import { Breadcrumbs, Link } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";

// ── Month-Year Picker Component ──────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: (currentYear + 50) - 1980 + 1 }, (_, i) => 1980 + i);

const MonthYearPicker = ({ value, onChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    // Parse current value e.g. "May 2026" → { month: 4, year: 2026 }
    const parsed = value ? value.split(" ") : [];
    const selMonth = parsed[0] || "";
    const selYear  = parsed[1] ? parseInt(parsed[1]) : new Date().getFullYear();

    const yearRefs = useRef({});

    const handleOpen  = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleSelect = (month, year) => {
        onChange(`${month} ${year}`);
        handleClose();
    };

    const handleThisMonth = () => {
        const now    = new Date();
        const label  = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
        onChange(label);
        handleClose();
    };

    const handleClear = () => {
        onChange("");
        handleClose();
    };

    // Scroll selected year into view when popover opens
    useEffect(() => {
        if (anchorEl && yearRefs.current[selYear]) {
            setTimeout(() => {
                yearRefs.current[selYear]?.scrollIntoView({ block: "center", behavior: "smooth" });
            }, 50);
        }
    }, [anchorEl]);

    return (
        <>
            {/* Input field */}
            <TextField
                size="small"
                label="Month"
                value={value || ""}
                onClick={handleOpen}
                readOnly
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <InputAdornment position="end">
                            <CalendarMonthIcon fontSize="small" sx={{ color: "action.active", cursor: "pointer" }} />
                        </InputAdornment>
                    ),
                    sx: { cursor: "pointer" }
                }}
                sx={{
                    minWidth: 140,
                    "& input": { cursor: "pointer" }
                }}
            />

            {/* Picker Popover */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top",    horizontal: "left" }}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        overflow: "hidden",
                        mt: 0.5,
                    }
                }}
            >
                <Box sx={{ width: 280 }}>
                    {/* ── Year + Month grid ── */}
                    <Box sx={{ display: "flex", height: 220 }}>

                        {/* Left: Year list */}
                        <Box
                            sx={{
                                width: 80,
                                overflowY: "auto",
                                borderRight: "1px solid #e0e0e0",
                                py: 1,
                                "&::-webkit-scrollbar": { width: 4 },
                                "&::-webkit-scrollbar-thumb": { background: "#ccc", borderRadius: 2 },
                            }}
                        >
                            {YEARS.map((yr) => (
                                <Box
                                    key={yr}
                                    ref={(el) => (yearRefs.current[yr] = el)}
                                    onClick={() => {
                                        // selecting year keeps current month selected
                                        if (selMonth) onChange(`${selMonth} ${yr}`);
                                    }}
                                    sx={{
                                        py: 0.8,
                                        px: 1.5,
                                        fontSize: 13,
                                        cursor: "pointer",
                                        fontWeight: yr === selYear ? 700 : 400,
                                        color: yr === selYear ? "#1976d2" : "text.primary",
                                        background: yr === selYear ? "#e3f2fd" : "transparent",
                                        borderRadius: 1,
                                        mx: 0.5,
                                        "&:hover": { background: "#f5f5f5" },
                                    }}
                                >
                                    {yr}
                                </Box>
                            ))}
                        </Box>

                        {/* Right: Month grid */}
                        <Box
                            sx={{
                                flex: 1,
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: 0.5,
                                p: 1.5,
                                alignContent: "start",
                            }}
                        >
                            {MONTHS.map((m) => {
                                const isSelected = m === selMonth;
                                return (
                                    <Box
                                        key={m}
                                        onClick={() => handleSelect(m, selYear)}
                                        sx={{
                                            py: 0.8,
                                            textAlign: "center",
                                            fontSize: 13,
                                            cursor: "pointer",
                                            borderRadius: 1.5,
                                            fontWeight: isSelected ? 700 : 400,
                                            color: isSelected ? "#fff" : "text.primary",
                                            background: isSelected ? "#1976d2" : "transparent",
                                            "&:hover": {
                                                background: isSelected ? "#1565c0" : "#f0f4ff",
                                            },
                                        }}
                                    >
                                        {m}
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* ── Footer: Clear + This month ── */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            px: 2,
                            py: 1,
                            borderTop: "1px solid #e0e0e0",
                            background: "#fafafa",
                        }}
                    >
                        <Button size="small" onClick={handleClear} sx={{ fontSize: 12, color: "#1976d2", textTransform: "none" }}>
                            Clear
                        </Button>
                        <Button size="small" onClick={handleThisMonth} sx={{ fontSize: 12, color: "#1976d2", textTransform: "none" }}>
                            This month
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

// ── Shared cell styles ───────────────────────────────────────────────────────
const cellStyle = {
    padding: "2px 6px",
    border: "1px solid #000000",
    textAlign: "center",
    fontSize: 13,
    whiteSpace: "nowrap",
};

const stickyCell = {
    ...cellStyle,
    position: "sticky",
    left: 0,
    zIndex: 2,
    textAlign: "left",
    fontWeight: 600,
};

const getCurrentMonthLabel = () => {
    const now    = new Date();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
};

const Dashboard = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();

    const [apiResponse, setApiResponse]     = useState(null);
    const [activeType, setActiveType]       = useState("performance");
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthLabel());

    const fetchData = async () => {
        action(true);
        const api = activeType === "performance"
            ? "performance_idploy/generate-performance/"
            : "performance_idploy/generate-offered/";

        const formData = new FormData();
        formData.append("month", selectedMonth);
        const res = await postData(api, formData);
        if (res?.status) setApiResponse(res);
        action(false);
    };

    useEffect(() => { fetchData(); }, [activeType, selectedMonth]);

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

    const renderTable = () => {
        const data    = apiResponse?.data?.["4G"]?.circles || {};
        const entries = Object.entries(data);

        const columns = [
            { label: "<=12days",  key: "<=12days"  },
            { label: "13-21days", key: "13-21days" },
            { label: "22-30days", key: "22-30days" },
            { label: ">30days",   key: ">30days"   },
            { label: "Pending",   key: "Pending"   },
            { label: "Total",     key: "Total"     },
            { label: "%<12",      key: "%<12"      },
            { label: "%<21",      key: "%<21"      },
            { label: "%<22-30",   key: "%<22-30"   },
        ];

        const totals = columns.reduce((acc, col) => {
            acc[col.key] = entries.reduce(
                (sum, [, val]) => sum + (parseFloat(val[col.key]) || 0), 0
            );
            return acc;
        }, {});

        const DARK_BLUE = "#1a3558";
        const HEADER_BG = "#223354";
        const TOTAL_BG  = "#b2f0c5";
        const STRIPE    = "#f4f7fb";

        return (
            <Box mt={1} sx={{ overflowX: "auto", borderRadius: 2, border: "1px solid #000000", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto", minWidth: 600 }}>
                    <thead>
                        <tr>
                            <th style={{ ...stickyCell, background: DARK_BLUE, color: "#efebeb", fontSize: 14, textAlign: "center", fontWeight: 700, letterSpacing: 1, zIndex: 3, border: "1px solid #2e4a70" }}>
                                CIRCLE
                            </th>
                            <th colSpan={columns.length} style={{ ...cellStyle, background: DARK_BLUE, color: "#fff", textAlign: "center", fontSize: 14, fontWeight: 700, letterSpacing: 0.5, paddingRight: 20, border: "1px solid #2e4a70" }}>
                                {selectedMonth.toUpperCase()}
                            </th>
                        </tr>
                        <tr style={{ background: HEADER_BG }}>
                            <th style={{ ...stickyCell, background: HEADER_BG, color: "#fff", textAlign: "center", fontSize: 13, fontWeight: 700, zIndex: 3, border: "1px solid #2e4a70" }}>
                                Circle
                            </th>
                            {columns.map((col) => (
                                <th key={col.key} style={{ ...cellStyle, background: HEADER_BG, color: "#fff", textAlign: "center", fontWeight: 700, fontSize: 13, border: "1px solid #2e4a70" }}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length > 0 ? (
                            entries.map(([circle, val], idx) => (
                                <tr key={circle} style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}>
                                    <td style={{ ...stickyCell, background: idx % 2 === 0 ? "#fff" : STRIPE, border: "1px solid #000000", textAlign: "center" }}>
                                        {circle}
                                    </td>
                                    {columns.map((col) => (
                                        <td key={col.key} style={cellStyle}>{val[col.key] ?? 0}</td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} style={{ ...cellStyle, textAlign: "center", padding: 15, color: "#827f7f" }}>
                                    No Data Available
                                </td>
                            </tr>
                        )}
                        {entries.length > 0 && (
                            <tr style={{ background: TOTAL_BG }}>
                                <td style={{ ...stickyCell, background: TOTAL_BG, fontWeight: 700, textAlign: "center", border: "1px solid #000000", fontSize: 14 }}>
                                    Grand Total
                                </td>
                                {columns.map((col) => (
                                    <td key={col.key} style={{ ...cellStyle, fontWeight: 300, border: "1px solid #000000", fontSize: 14 }}>
                                        {Number.isInteger(totals[col.key]) ? totals[col.key] : totals[col.key].toFixed(1)}
                                    </td>
                                ))}
                            </tr>
                        )}
                    </tbody>
                </table>
            </Box>
        );
    };

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate('/tools')}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate('/tools/performance_at_tat')}>Performance At Tat</Link>
                    <Typography color='text.primary'>Dashboard</Typography>
                </Breadcrumbs>
            </div>

            <Box p={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">

                    {/* Left: title + toggle */}
                    <Box>
                        <Typography variant="h5">
                            {activeType === "performance" ? "Performance vs OA TAT" : "Offered vs OA TAT"}
                        </Typography>
                        <Box mt={1} display="flex" gap={1}>
                            <Button onClick={() => setActiveType("performance")} variant={activeType === "performance" ? "contained" : "outlined"}>
                                Performance
                            </Button>
                            <Button onClick={() => setActiveType("offered")} variant={activeType === "offered" ? "contained" : "outlined"}>
                                Offered
                            </Button>
                        </Box>
                    </Box>

                    {/* Right: ✅ MonthYearPicker replaces TextField select + download */}
                    <Box display="flex" gap={1} alignItems="center">
                        <MonthYearPicker
                            value={selectedMonth}
                            onChange={setSelectedMonth}
                        />
                        <IconButton onClick={handleDownload} title="Download Excel" disabled={!apiResponse?.download_url}>
                            <DownloadIcon color={apiResponse?.download_url ? "primary" : "disabled"} />
                        </IconButton>
                    </Box>
                </Box>

                {renderTable()}
                {loading}
            </Box>
        </>
    );
};

export default Dashboard;