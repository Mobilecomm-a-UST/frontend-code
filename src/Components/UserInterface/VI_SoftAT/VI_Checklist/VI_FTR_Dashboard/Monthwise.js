import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { postData } from "../../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../../Hooks/LoadingDialog";

// ── Generate year list dynamically (2000 → current year) ────────────────────
const generateYearList = () => {
    const currentYear = new Date().getFullYear();
    const list = [];
    for (let y = 2000; y <= currentYear; y++) {
        list.push(y);
    }
    return list;
};

const YEAR_LIST = generateYearList();

// ── Generate columns for any selected year ───────────────────────────────────
// FY logic: Apr'YY → Mar'(YY+1)
const MONTH_NAMES = [
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
];

const getFYColumns = (year) => {
    return MONTH_NAMES.map((mon, idx) => {
        const yr = idx < 9 ? year : year + 1;
        const key = `${mon}'${String(yr).slice(2)}`;
        return { label: key, key };
    });
};

// ── Get current year ──────────────────────────────────────────────────────────
const getCurrentYear = () => {
    const now = new Date();
    const month = now.getMonth(); // 0=Jan
    // If before April, FY started last year
    return month >= 3 ? now.getFullYear() : now.getFullYear() - 1;
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

// ── Table Component ───────────────────────────────────────────────────────────
const MonthTable = ({ apiResponse, activeYear }) => {
    const columns = getFYColumns(activeYear);
    const TOTAL_BG = "#b2f0c5";
    const STRIPE = "#f4f7fb";

    const data = apiResponse?.data?.circles || {};
    const grandTotal = apiResponse?.data?.grand_total || {};
    const entries = Object.entries(data);

    const fyLabel = `${activeYear}-${String(activeYear + 1).slice(2)}`;

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
                            FY {fyLabel}
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
                                    style={{
                                        background:
                                            idx % 2 === 0 ? "#fff" : STRIPE,
                                    }}
                                >
                                    <td
                                        style={{
                                            ...stickyCell,
                                            background:
                                                idx % 2 === 0 ? "#fff" : STRIPE,
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
                                        style={{
                                            ...cellStyle,
                                            fontWeight: 700,
                                        }}
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
                                style={{
                                    ...cellStyle,
                                    textAlign: "center",
                                    padding: 15,
                                }}
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
    const [activeYear, setActiveYear] = useState(getCurrentYear());

    // ── Fetch Data ────────────────────────────────────────────────────────
    const fetchData = async () => {
        try {
            action(true);

            const formData = new FormData();
            // Send as "2026-27" format to API
            formData.append(
                "fy",
                `${activeYear}-${String(activeYear + 1).slice(2)}`
            );

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
    }, [activeYear]);

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

                {/* ── Right side: Year dropdown + Download ── */}
                <Box display="flex" alignItems="center" gap={1.5}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={activeYear}
                            label="Year"
                            onChange={(e) => setActiveYear(e.target.value)}
                            MenuProps={{
                                PaperProps: {
                                    style: { maxHeight: 250 },
                                },
                            }}
                        >
                            {[...YEAR_LIST].reverse().map((yr) => (
                                <MenuItem key={yr} value={yr}>
                                    {yr}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <IconButton
                        onClick={handleDownload}
                        title="Download Excel"
                        disabled={!apiResponse?.download_url}
                        sx={{
                            border: "1px solid #d0d7de",
                            borderRadius: "8px",
                        }}
                    >
                        <DownloadIcon
                            color={
                                apiResponse?.download_url ? "primary" : "disabled"
                            }
                        />
                    </IconButton>
                </Box>
            </Box>

            {/* ── Table ───────────────────────────────────────────── */}
            <MonthTable apiResponse={apiResponse} activeYear={activeYear} />

            {loading}
        </Box>
    );
};

export default Monthwise;