
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    TextField,
    Breadcrumbs,
    Link,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { useNavigate } from "react-router-dom";

import { postData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ── Constants ────────────────────────────────────────────────────────────────
const todayStr = new Date().toISOString().split("T")[0];

const getDefaultStartDate = () => {
    const now = new Date();

    return `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}-01`;
};

// ── Tech tabs ────────────────────────────────────────────────────────────────
const TECH_TABS = [
    { key: "4G", label: "4G" },
    { key: "5G", label: "5G" },
    { key: "4G+5G", label: "4G+5G" },
];

// ── Fixed columns ────────────────────────────────────────────────────────────
const COLUMNS = [
    {
        label: "Total Site",
        key: "Total Site",
    },
    {
        label: "Pending",
        key: "Pending",
    },
    {
        label: "Accepted with 0 counter",
        key: "Accepted with 0 counter",
    },
    {
        label: "Acceptance pending with 0 Counter",
        key: "Acceptance pending with 0 Counter",
    },
    {
        label: "FTR",
        key: "FTR",
    },
];

// ── Tech colours ─────────────────────────────────────────────────────────────
const TECH_COLORS = {
    "4G": {
        active:
            "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        header:
            "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        tabColor: "#1e3c72",
    },

    "5G": {
        active:
            "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
        header:
            "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
        tabColor: "#134e5e",
    },

    "4G+5G": {
        active:
            "linear-gradient(135deg, #41295a 0%, #2F0743 100%)",
        header:
            "linear-gradient(135deg, #252326 0%, #414345 100%)",
        tabColor: "#41295a",
    },
};

// ── Shared cell styles ──────────────────────────────────────────────────────
const cellSt = {
    padding: "4px 8px",
    border: "1px solid #c0c0c0",
    textAlign: "center",
    fontSize: 13,
    whiteSpace: "nowrap",
};

const stickySt = {
    ...cellSt,
    position: "sticky",
    left: 0,
    zIndex: 2,
    textAlign: "center",
    fontWeight: 600,
};

// ── Table Component ─────────────────────────────────────────────────────────
const TechTable = ({ tech, apiResponse, dateRangeLabel }) => {
    const colors = TECH_COLORS[tech];

    const TOTAL_BG = "#b2f0c5";
    const STRIPE = "#f4f7fb";

    const rawData =
        apiResponse?.data?.[tech] || [];

    const circleRows = rawData.filter(
        (row) => row.Circle !== "Grand Total"
    );

    const grandTotal =
        rawData.find(
            (row) => row.Circle === "Grand Total"
        ) || {};

    const titleLabel =
        dateRangeLabel
            ? `FTR | ${dateRangeLabel} | ${tech}`
            : "Loading...";

    return (
        <Box
            mt={1}
            sx={{
                overflowX: "auto",
                borderRadius: 2,
                border: "1px solid #c0c0c0",
                boxShadow:
                    "0 2px 8px rgba(0,0,0,0.08)",
            }}
        >
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    tableLayout: "auto",
                    minWidth: 500,
                }}
            >
                <thead>
                    {/* Header Title */}
                    <tr>
                        <th
                            colSpan={
                                COLUMNS.length + 1
                            }
                            style={{
                                ...cellSt,
                                background:
                                    colors.active,
                                color: "#fff",
                                fontSize: 14,
                                fontWeight: 700,
                                textAlign:
                                    "center",
                                padding:
                                    "8px 12px",
                                border:
                                    "1px solid #2e4a70",
                            }}
                        >
                            {titleLabel}
                        </th>
                    </tr>

                    {/* Column Headers */}
                    <tr>
                        <th
                            style={{
                                ...stickySt,
                                background:
                                    colors.header,
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: 700,
                                zIndex: 3,
                                border:
                                    "1px solid #2e4a70",
                                padding:
                                    "6px 12px",
                            }}
                        >
                            Circle
                        </th>

                        {COLUMNS.map((col) => (
                            <th
                                key={col.key}
                                style={{
                                    ...cellSt,
                                    background:
                                        colors.header,
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: 13,
                                    border:
                                        "1px solid #2e4a70",
                                    padding:
                                        "6px 10px",
                                }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {circleRows.length > 0 ? (
                        <>
                            {circleRows.map(
                                (row, idx) => (
                                    <tr
                                        key={
                                            row.Circle
                                        }
                                        style={{
                                            background:
                                                idx %
                                                    2 ===
                                                    0
                                                    ? "#fff"
                                                    : STRIPE,
                                        }}
                                    >
                                        <td
                                            style={{
                                                ...stickySt,
                                                background:
                                                    idx %
                                                        2 ===
                                                        0
                                                        ? "#fff"
                                                        : STRIPE,
                                            }}
                                        >
                                            {
                                                row.Circle
                                            }
                                        </td>

                                        {COLUMNS.map(
                                            (
                                                col
                                            ) => (
                                                <td
                                                    key={
                                                        col.key
                                                    }
                                                    style={
                                                        cellSt
                                                    }
                                                >
                                                    {row?.[
                                                        col
                                                            .key
                                                    ] ??
                                                        0}
                                                </td>
                                            )
                                        )}
                                    </tr>
                                )
                            )}

                            {/* Grand Total */}
                            <tr
                                style={{
                                    background:
                                        TOTAL_BG,
                                    fontWeight:
                                        700,
                                }}
                            >
                                <td
                                    style={{
                                        ...stickySt,
                                        background:
                                            TOTAL_BG,
                                        fontSize:
                                            14,
                                    }}
                                >
                                    Grand Total
                                </td>

                                {COLUMNS.map(
                                    (col) => (
                                        <td
                                            key={
                                                col.key
                                            }
                                            style={{
                                                ...cellSt,
                                                fontWeight:
                                                    700,
                                                fontSize:
                                                    14,
                                            }}
                                        >
                                            {grandTotal?.[
                                                col
                                                    .key
                                            ] ??
                                                0}
                                        </td>
                                    )
                                )}
                            </tr>
                        </>
                    ) : (
                        <tr>
                            <td
                                colSpan={
                                    COLUMNS.length +
                                    1
                                }
                                style={{
                                    ...cellSt,
                                    padding: 20,
                                    color:
                                        "#9e9e9e",
                                    fontSize: 14,
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
const FTR_Aging = () => {
    const { loading, action } =
        useLoadingDialog();

    const navigate = useNavigate();

    const [apiResponse, setApiResponse] =
        useState(null);

    const [startDate, setStartDate] =
        useState(getDefaultStartDate());

    const [endDate, setEndDate] =
        useState(todayStr);

    const [activeTech, setActiveTech] =
        useState("4G");

    // ── Fetch Data ────────────────────────────────────────────────────────
    const fetchData = async () => {
        if (!startDate || !endDate) return;

        if (startDate > endDate) return;

        try {
            action(true);

            const formData =
                new FormData();

            formData.append(
                "start_date",
                startDate
            );

            formData.append(
                "end_date",
                endDate
            );

            const res = await postData(
                "performance_idploy/generate-ftr/",
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

    // ── Debounced API Call ────────────────────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 500);

        return () =>
            clearTimeout(timer);

    }, [startDate, endDate]);

    // ── Download ──────────────────────────────────────────────────────────
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
        <>
            {/* Breadcrumb */}
            <div
                style={{
                    margin: 5,
                    marginLeft: 10,
                    marginTop: 10,
                }}
            >
                <Breadcrumbs
                    aria-label="breadcrumb"
                    maxItems={3}
                    separator={
                        <KeyboardArrowRightIcon fontSize="small" />
                    }
                >
                    <Link
                        underline="hover"
                        onClick={() =>
                            navigate(
                                "/tools"
                            )
                        }
                    >
                        Tools
                    </Link>

                    <Link
                        underline="hover"
                        onClick={() =>
                            navigate(
                                "/tools/performance_at_tat"
                            )
                        }
                    >
                        Performance AT
                    </Link>

                    <Typography color="text.primary">
                        FTR Aging
                    </Typography>
                </Breadcrumbs>
            </div>

            <Box p={1}>
                {/* Top Bar */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                >
                    {/* Left */}
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Performance FTR Dashboard
                    </Typography>

                    {/* Right */}
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
                            value={
                                startDate
                            }
                            onChange={(
                                e
                            ) => {
                                if (
                                    e
                                        .target
                                        .value <=
                                    todayStr
                                ) {
                                    setStartDate(
                                        e
                                            .target
                                            .value
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
                            value={
                                endDate
                            }
                            onChange={(
                                e
                            ) => {
                                if (
                                    e
                                        .target
                                        .value <=
                                    todayStr
                                ) {
                                    setEndDate(
                                        e
                                            .target
                                            .value
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

                        {/* Download */}
                        <IconButton
                            onClick={
                                handleDownload
                            }
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

                {/* Tech Tabs */}
                <Box
                    mt={2}
                    sx={{
                        display: "flex",
                        borderBottom:
                            "2px solid #e0e0e0",
                    }}
                >
                    {TECH_TABS.map(
                        (tab) => {
                            const isActive =
                                activeTech ===
                                tab.key;

                            const tColor =
                                TECH_COLORS[
                                tab.key
                                ];

                            return (
                                <Box
                                    key={
                                        tab.key
                                    }
                                    onClick={() =>
                                        setActiveTech(
                                            tab.key
                                        )
                                    }
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        cursor:
                                            "pointer",
                                        userSelect:
                                            "none",
                                        fontWeight:
                                            isActive
                                                ? 700
                                                : 500,
                                        fontSize: 14,
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
                                        borderBottom:
                                            isActive
                                                ? `3px solid ${tColor.tabColor}`
                                                : "3px solid transparent",
                                        transition:
                                            "all 0.2s",
                                        "&:hover":
                                        {
                                            background:
                                                isActive
                                                    ? tColor.active
                                                    : "#f0f4ff",
                                        },
                                    }}
                                >
                                    {
                                        tab.label
                                    }
                                </Box>
                            );
                        }
                    )}
                </Box>

                {/* Table */}
                <TechTable
                    tech={activeTech}
                    apiResponse={
                        apiResponse
                    }
                    dateRangeLabel={
                        dateRangeLabel
                    }
                />

                {loading}
            </Box>
        </>
    );
};

export default FTR_Aging;