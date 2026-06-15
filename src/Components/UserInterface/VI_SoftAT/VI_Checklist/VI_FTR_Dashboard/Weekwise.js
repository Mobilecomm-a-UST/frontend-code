import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { postData } from "../../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../../Hooks/LoadingDialog";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// ── Shared Cell Styles ──────────────────────────────────────────────────────
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

const formatVal = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return 0;
    return Number.isInteger(num) ? num : num.toFixed(1);
};

const HEADER_GRADIENT = {
    active: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    header: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
};

// ── All columns definition ───────────────────────────────────────────────────
const ALL_COLUMNS = [
    { label: "W1", key: "W1" },
    { label: "W2", key: "W2" },
    { label: "W3", key: "W3" },
    { label: "W4", key: "W4" },
    { label: "Overall", key: "Overall" },
];

// ── Table Component ─────────────────────────────────────────────────────────
const WeekTable = ({ apiResponse, selectedMonth }) => {
    const visibleColumns = ALL_COLUMNS;

    const TOTAL_BG = "#b2f0c5";
    const STRIPE = "#f4f7fb";

    const data = apiResponse?.data?.circles || {};
    const grandTotal = apiResponse?.data?.grand_total || {};
    const entries = Object.entries(data);

    const headerLabel = selectedMonth
        ? selectedMonth.format("MMM YYYY")
        : "";

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
                    minWidth: 400,
                }}
            >
                <thead>
                    {/* ── Span header row ── */}
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
                        >
                            Circle
                        </th>
                        <th
                            colSpan={visibleColumns.length}
                            style={{
                                ...cellStyle,
                                background: HEADER_GRADIENT.active,
                                color: "#fff",
                                textAlign: "center",
                                fontSize: 14,
                                fontWeight: 700,
                            }}
                        >
                            {headerLabel}
                        </th>
                    </tr>

                    {/* ── Column header row ── */}
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
                        {visibleColumns.map((col) => (
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
                                    {visibleColumns.map((col) => (
                                        <td key={col.key} style={cellStyle}>
                                            {formatVal(val?.[col.key]) ?? 0}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {/* Grand Total row */}
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
                                {visibleColumns.map((col) => (
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
                                colSpan={visibleColumns.length + 1}
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

// ── Main Component ──────────────────────────────────────────────────────────
const Weekwise = () => {
    const { loading, action } = useLoadingDialog();

    const [apiResponse, setApiResponse] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(dayjs());

    // ── Fetch Data ────────────────────────────────────────────────────────
    const fetchData = async (monthDate = selectedMonth) => {
        try {
            action(true);

            const formData = new FormData();
            formData.append("month", monthDate.format("MMM YYYY"));

            const res = await postData("vi_ftr/weekftr/", formData);

            if (res?.status) {
                setApiResponse(res);
            }
        } catch (error) {
            console.log("Fetch Error :", error);
        } finally {
            action(false);
        }
    };

    useEffect(() => {
        fetchData(selectedMonth);
    }, [selectedMonth]);

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
                gap={2}
                mb={2}
            >
                <Typography variant="h5" fontWeight={700}>
                    FTR Weekwise Dashboard
                </Typography>

                <Box display="flex" alignItems="center" gap={1.5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Month"
                            views={["year", "month"]}
                            value={selectedMonth}
                            onChange={(newValue) => {
                                if (newValue) setSelectedMonth(newValue);
                            }}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    sx: { minWidth: 220 },
                                },
                            }}
                        />
                    </LocalizationProvider>

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
            <WeekTable
                apiResponse={apiResponse}
                selectedMonth={selectedMonth}
            />

            {loading}
        </Box>
    );
};

export default Weekwise;