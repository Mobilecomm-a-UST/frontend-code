import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { postData } from "../../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../../Hooks/LoadingDialog";

// ── Financial Year tabs ──────────────────────────────────────────────────────
const YEAR_TABS = [
    { key: "2025-26", label: "FY 2025-26" },
    { key: "2026-27", label: "FY 2026-27" },
];

// ── Columns per FY ───────────────────────────────────────────────────────────
const FY_COLUMNS = {
    "2025-26": [
        { label: "Apr'25", key: "Apr'25" },
        { label: "May'25", key: "May'25" },
        { label: "Jun'25", key: "Jun'25" },
        { label: "Jul'25", key: "Jul'25" },
        { label: "Aug'25", key: "Aug'25" },
        { label: "Sep'25", key: "Sep'25" },
        { label: "Oct'25", key: "Oct'25" },
        { label: "Nov'25", key: "Nov'25" },
        { label: "Dec'25", key: "Dec'25" },
        { label: "Jan'26", key: "Jan'26" },
        { label: "Feb'26", key: "Feb'26" },
        { label: "Mar'26", key: "Mar'26" },
    ],
    "2026-27": [
        { label: "Apr'26", key: "Apr'26" },
        { label: "May'26", key: "May'26" },
        { label: "Jun'26", key: "Jun'26" },
        { label: "Jul'26", key: "Jul'26" },
        { label: "Aug'26", key: "Aug'26" },
        { label: "Sep'26", key: "Sep'26" },
        { label: "Oct'26", key: "Oct'26" },
        { label: "Nov'26", key: "Nov'26" },
        { label: "Dec'26", key: "Dec'26" },
        { label: "Jan'27", key: "Jan'27" },
        { label: "Feb'27", key: "Feb'27" },
        { label: "Mar'27", key: "Mar'27" },
    ],
};

// ── Shared Cell Styles ───────────────────────────────────────────────────────
const cellStyle = {
    padding: "4px 8px",
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
    textAlign: "center",
    fontWeight: 600,
};

const HEADER_GRADIENT = {
    active: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    header: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
};

const formatVal = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return 0;
    return Number.isInteger(num) ? num : num.toFixed(1);
};

// ── Get current FY ────────────────────────────────────────────────────────────
const getCurrentFY = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0=Jan
    // FY starts April (month 3)
    return month >= 3 ? `${year}-${String(year + 1).slice(2)}` : `${year - 1}-${String(year).slice(2)}`;
};

// ── Table Component ───────────────────────────────────────────────────────────
const MonthTable = ({ apiResponse, activeFY }) => {
    const columns = FY_COLUMNS[activeFY] || [];
    const TOTAL_BG = "#b2f0c5";
    const STRIPE = "#f4f7fb";

    const data = apiResponse?.data?.circles || {};
    const grandTotal = apiResponse?.data?.grand_total || {};
    const entries = Object.entries(data);

    return (
        <Box
            mt={1}
            sx={{
                overflowX: "auto",
                borderRadius: 2,
                border: "1px solid #000000",
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
                        <th
                            style={{
                                ...stickyCell,
                                background: HEADER_GRADIENT.active,
                                color: "#fff",
                                fontSize: 14,
                                fontWeight: 700,
                                zIndex: 3,
                            }}
                        ></th>
                        <th
                            colSpan={columns.length}
                            style={{
                                ...cellStyle,
                                background: HEADER_GRADIENT.active,
                                color: "#fff",
                                textAlign: "center",
                                fontSize: 14,
                                fontWeight: 700,
                            }}
                        >
                            FY {activeFY}
                        </th>
                    </tr>
                    <tr>
                        <th
                            style={{
                                ...stickyCell,
                                background: HEADER_GRADIENT.header,
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: 700,
                                zIndex: 3,
                            }}
                        >
                            Circle
                        </th>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                style={{
                                    ...cellStyle,
                                    background: HEADER_GRADIENT.header,
                                    color: "#fff",
                                    fontWeight: 700,
                                }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {entries.length > 0 ? (
                        <>
                            {entries.map(([circle, val], idx) => (
                                <tr
                                    key={circle}
                                    style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
                                >
                                    <td
                                        style={{
                                            ...stickyCell,
                                            background: idx % 2 === 0 ? "#fff" : STRIPE,
                                        }}
                                    >
                                        {circle}
                                    </td>
                                    {columns.map((col) => (
                                        <td key={col.key} style={cellStyle}>
                                            {formatVal(val?.[col.key]) ?? 0}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            <tr style={{ background: TOTAL_BG }}>
                                <td
                                    style={{
                                        ...stickyCell,
                                        background: TOTAL_BG,
                                        fontWeight: 700,
                                    }}
                                >
                                    Grand Total
                                </td>
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        style={{ ...cellStyle, fontWeight: 700 }}
                                    >
                                        {formatVal(grandTotal?.[col.key])}
                                    </td>
                                ))}
                            </tr>
                        </>
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + 1}
                                style={{ ...cellStyle, textAlign: "center", padding: 15 }}
                            >
                                No Data Available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Box>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Monthwise = () => {
    const { loading, action } = useLoadingDialog();

    const [apiResponse, setApiResponse] = useState(null);
    const [activeFY, setActiveFY] = useState(getCurrentFY());

    // ── Fetch Data ────────────────────────────────────────────────────────
    const fetchData = async () => {
        try {
            action(true);

            const formData = new FormData();
            formData.append("fy", activeFY); // e.g. "2026-27"

            const res = await postData("vi_ftr/monthftr/", formData);

            if (res?.status) {
                setApiResponse(res);
            }
        } catch (error) {
            console.log("Fetch Error : ", error);
        } finally {
            action(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeFY]);

    // ── Download ──────────────────────────────────────────────────────────
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

    return (
        <Box p={1}>
            {/* ── Top Bar ───────────────────────────────────────────── */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
            >
                <Typography variant="h5" fontWeight={700}>
                    FTR Monthwise Dashboard
                </Typography>

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

            {/* ── FY Filter Tabs ───────────────────────────────────── */}
            <Box mt={1.5} display="flex" gap={1} flexWrap="wrap">
                {YEAR_TABS.map((tab) => {
                    const isActive = activeFY === tab.key;
                    return (
                        <Box
                            key={tab.key}
                            onClick={() => setActiveFY(tab.key)}
                            sx={{
                                px: 2,
                                py: 0.5,
                                cursor: "pointer",
                                borderRadius: "16px",
                                fontSize: 13,
                                fontWeight: isActive ? 700 : 500,
                                color: isActive ? "#fff" : "#1976d2",
                                background: isActive ? "#1976d2" : "#e3eaf5",
                                transition: "all 0.2s",
                                userSelect: "none",
                            }}
                        >
                            {tab.label}
                        </Box>
                    );
                })}
            </Box>

            {/* ── Table ───────────────────────────────────────────── */}
            <MonthTable apiResponse={apiResponse} activeFY={activeFY} />

            {loading}
        </Box>
    );
};

export default Monthwise;