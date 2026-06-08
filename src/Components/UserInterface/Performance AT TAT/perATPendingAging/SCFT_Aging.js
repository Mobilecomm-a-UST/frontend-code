import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    IconButton,
    TextField,
    Breadcrumbs,
    Link
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";
import { postData } from "../../../services/FetchNodeServices";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ────────────────────────────────────────────────────────────────
// DATE HELPERS
// ────────────────────────────────────────────────────────────────
const todayStr = new Date().toISOString().split("T")[0];

const getDefaultStartDate = () => {

    const now = new Date();

    return `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}-01`;

};

// ────────────────────────────────────────────────────────────────
// TECHNOLOGY TABS
// ────────────────────────────────────────────────────────────────
const TECH_TABS = [
    { key: "4G", label: "4G" },
    { key: "5G", label: "5G" },
    { key: "4G+5G", label: "4G+5G" },
];

// ────────────────────────────────────────────────────────────────
// TAB COLORS
// ────────────────────────────────────────────────────────────────
const TECH_COLORS = {

    "4G": {
        active:
            "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",

        hover:
            "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",

        header:
            "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",

        tabColor: "#1e3c72",
    },

    "5G": {
        active:
            "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",

        hover:
            "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",

        header:
            "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",

        tabColor: "#134e5e",
    },

    "4G+5G": {
        active:
            "linear-gradient(135deg, #41295a 0%, #2F0743 100%)",

        hover:
            "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)",

        header:
            "linear-gradient(135deg, #252326 0%, #414345 100%)",

        tabColor: "#41295a",
    },
};

// ────────────────────────────────────────────────────────────────
// TABLE CELL STYLES
// ────────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────────
// GRAND TOTAL FORMATTER
// ────────────────────────────────────────────────────────────────
const formatGrandTotal = (val) => {

    const num = parseFloat(val);

    if (isNaN(num)) return 0;

    return Number.isInteger(num)
        ? num
        : num.toFixed(1);

};

// ────────────────────────────────────────────────────────────────
// TABLE COMPONENT
// ────────────────────────────────────────────────────────────────
const TechTable = ({
    tech,
    apiResponse,
    dateRangeLabel
}) => {

    // ─────────────────────────────
    // NEW SCFT AGING COLUMNS
    // ─────────────────────────────
    const columns = [

        { label: "Circle", key: "Circle" },

        { label: "<7", key: "<7" },

        { label: "8-12", key: "8-12" },

        { label: "13-21", key: "13-21" },
        { label: ">21", key: ">21" },
        { label: "Total", key: "Total" },

    ];

    const colors = TECH_COLORS[tech];

    const TOTAL_BG = "#b2f0c5";

    const STRIPE = "#f4f7fb";

    const data = apiResponse?.data?.[tech] || {};

    const grandTotal = apiResponse?.data?.[tech] || {};

    const entries = Object.entries(data);

    console.log("API Response : ",apiResponse, data, grandTotal , entries);

    return (

        <Box
            mt={1}
            sx={{
                overflowX: "auto",
                borderRadius: 2,
                border: "1px solid #000000",
                boxShadow:
                    "0 2px 8px rgba(0,0,0,0.08)",
            }}
        >

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    tableLayout: "auto",
                    minWidth: 900,
                }}
            >

                <thead>

                    {/* ───────────────────────────── */}
                    {/* DATE RANGE HEADER */}
                    {/* ───────────────────────────── */}
                    <tr>

                        <th
                            style={{
                                ...stickyCell,
                                background: colors.active,
                                color: "#efebeb",
                                fontSize: 14,
                                textAlign: "center",
                                fontWeight: 700,
                                zIndex: 3,
                            }}
                        >
                        </th>

                        <th
                            colSpan={columns.length-1}
                            style={{
                                ...cellStyle,
                                background: colors.active,
                                color: "#fff",
                                textAlign: "center",
                                fontSize: 14,
                                fontWeight: 700,
                            }}
                        >

                            {dateRangeLabel}

                        </th>

                    </tr>

                    {/* ───────────────────────────── */}
                    {/* COLUMN HEADER */}
                    {/* ───────────────────────────── */}
                    <tr
                        style={{
                            background: colors.header,
                        }}
                    >

                        {/* <th
                            style={{
                                ...stickyCell,
                                background: colors.header,
                                color: "#fff",
                                textAlign: "center",
                                fontSize: 13,
                                fontWeight: 700,
                            }}
                        >

                            Circle

                        </th> */}

                        {columns.map((col) => (

                            <th
                                key={col.key}
                                style={{
                                    ...cellStyle,
                                    background: colors.header,
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

                            {/* ───────────────────────────── */}
                            {/* DATA ROWS */}
                            {/* ───────────────────────────── */}
                            {entries.map(([circle, val], idx) => (

                                <tr
                                    key={circle}
                                    style={{
                                        background:
                                            idx % 2 === 0
                                                ? "#fff"
                                                : STRIPE,
                                    }}
                                >

                                    {/* <td
                                        style={{
                                            ...stickyCell,
                                            background:
                                                idx % 2 === 0
                                                    ? "#fff"
                                                    : STRIPE,
                                            textAlign: "center",
                                        }}
                                    >

                                        {circle}

                                    </td> */}

                                    {columns.map((col) => (

                                        <td
                                            key={col.key}
                                            style={cellStyle}
                                        >

                                            {val?.[col.key] ?? 0}

                                        </td>

                                    ))}

                                </tr>

                            ))}

                            {/* ───────────────────────────── */}
                            {/* GRAND TOTAL */}
                            {/* ───────────────────────────── */}
                            {/* <tr
                                style={{
                                    background: TOTAL_BG,
                                }}
                            >

                                <td
                                    style={{
                                        ...stickyCell,
                                        background: TOTAL_BG,
                                        fontWeight: 700,
                                        textAlign: "center",
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

                                        {formatGrandTotal(
                                            grandTotal?.[col.key]
                                        )}

                                    </td>

                                ))}

                            </tr> */}

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

// ────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────────────
const SCFT_Aging = () => {

    const { loading, action } =
        useLoadingDialog();

    const [apiResponse, setApiResponse] = useState(null);

    const [activeType, setActiveType] =
        useState("performance");

    const [activeTech, setActiveTech] =
        useState("4G");

    const [startDate, setStartDate] =
        useState(getDefaultStartDate());

    const [endDate, setEndDate] =
        useState(todayStr);

        const navigate = useNavigate();

    // ─────────────────────────────
    // FETCH DATA
    // ─────────────────────────────
    const fetchData = async () => {

        if (!startDate || !endDate) return;

        if (startDate > endDate) return;

        try {

            action(true);

            // ─────────────────────────────
            // NEW SCFT APIs
            // ─────────────────────────────
            const api =
                activeType === "performance"? "performance_tat/generate-tat-report/": "performance_idploy/generate-scft-offered/";

            const formData = new FormData();

            formData.append(
                "start_date",
                startDate
            );

            formData.append(
                "end_date",
                endDate
            );

            const res = await postData(
                api,
                formData
            );

            if (res?.status) {

                setApiResponse(res);

            }

        } catch (error) {

            console.log(
                "Fetch Error : ",
                error
            );

        } finally {

            action(false);

        }

    };

    // ─────────────────────────────
    // AUTO FETCH
    // ─────────────────────────────
    useEffect(() => {

        const timer = setTimeout(() => {

            fetchData();

        }, 500);

        return () => clearTimeout(timer);

    }, [activeType, startDate, endDate]);

    // ─────────────────────────────
    // DOWNLOAD
    // ─────────────────────────────
    const handleDownload = () => {

        const url =
            apiResponse?.download_url;

        if (!url) return;

        const link =
            document.createElement("a");

        link.href = url;

        link.download = "";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    };

    const dateRangeLabel =
        startDate && endDate
            ? `${startDate} to ${endDate}`
            : "";

    return (

        <Box p={1}>
           

            {/* ───────────────────────────── */}
            {/* TOP BAR */}
            {/* ───────────────────────────── */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
            >

                {/* LEFT SIDE */}
                <Box>

                    <Typography variant="h5">

                        {activeType === "performance"
                            ? "AT Pending Aging"
                            : "SCFT Aging Offered"}

                    </Typography>

                    <Box
                        mt={1}
                        display="flex"
                        gap={1}
                    >

                        {/* <Button
                            size="small"
                            onClick={() =>
                                setActiveType("performance")
                            }
                            variant={
                                activeType === "performance"
                                    ? "contained"
                                    : "outlined"
                            }
                        >

                            Performance

                        </Button>

                        <Button
                            size="small"
                            onClick={() =>
                                setActiveType("offered")
                            }
                            variant={
                                activeType === "offered"
                                    ? "contained"
                                    : "outlined"
                            }
                        >

                            Offered

                        </Button> */}

                    </Box>

                </Box>

                {/* RIGHT SIDE */}
                <Box
                    display="flex"
                    gap={1}
                    alignItems="center"
                    flexWrap="wrap"
                >

                    <TextField
                        size="small"
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => {

                            if (
                                e.target.value <= todayStr
                            ) {

                                setStartDate(
                                    e.target.value
                                );

                            }

                        }}
                        inputProps={{
                            max:
                                endDate ||
                                todayStr,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{
                            minWidth: 155,
                        }}
                    />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        ~

                    </Typography>

                    <TextField
                        size="small"
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => {

                            if (
                                e.target.value <= todayStr
                            ) {

                                setEndDate(
                                    e.target.value
                                );

                            }

                        }}
                        inputProps={{
                            min: startDate,
                            max: todayStr,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{
                            minWidth: 155,
                        }}
                    />

                    {/* DOWNLOAD */}
                    <IconButton
                        onClick={handleDownload}
                        title="Download Excel"
                        disabled={
                            !apiResponse?.download_url
                        }
                    >

                        <DownloadIcon
                            color={
                                apiResponse?.download_url
                                    ? "primary"
                                    : "disabled"
                            }
                        />

                    </IconButton>

                </Box>

            </Box>

            {/* ───────────────────────────── */}
            {/* TECH TABS */}
            {/* ───────────────────────────── */}
            <Box
                mt={2}
                sx={{
                    display: "flex",
                    borderBottom:
                        "2px solid #e0e0e0",
                }}
            >

                {TECH_TABS.map((tab) => {

                    const isActive =
                        activeTech === tab.key;

                    const tColor =
                        TECH_COLORS[tab.key];

                    return (

                        <Box
                            key={tab.key}
                            onClick={() =>
                                setActiveTech(tab.key)
                            }
                            sx={{
                                px: 3,
                                py: 1,
                                cursor: "pointer",
                                fontWeight:
                                    isActive
                                        ? 700
                                        : 500,
                                color:
                                    isActive
                                        ? "#fff"
                                        : tColor.tabColor,
                                background:
                                    isActive
                                        ? tColor.active
                                        : "transparent",
                                borderRadius:
                                    "6px 6px 0 0",
                                transition:
                                    "all 0.2s",
                            }}
                        >

                            {tab.label}

                        </Box>

                    );

                })}

            </Box>

            {/* ───────────────────────────── */}
            {/* TABLE */}
            {/* ───────────────────────────── */}
            <TechTable
                tech={activeTech}
                apiResponse={apiResponse}
                dateRangeLabel={dateRangeLabel}
            />

            {loading}

        </Box>

    );

};

export default SCFT_Aging;