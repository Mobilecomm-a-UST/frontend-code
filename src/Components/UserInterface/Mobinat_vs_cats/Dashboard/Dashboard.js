import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    Chip,
    Divider,
    Tabs,
    Tab,
    Stack,
} from "@mui/material";
import {
    FileDownload as FileDownloadIcon,
    MoreVert as MoreVertIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import Slide from "@mui/material/Slide";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

/* ================================================================ */
/*  API Constants                                                   */
/* ================================================================ */
const API_BASE_URL = "https://commtoolapi.mcpsmis.com/mobinate_vs_cats";

const APIs = {
    CIRCLE_SUMMARY: `${API_BASE_URL}/reverse_reconciliation_circle_wise_summary_report/`,
    CIRCLE_COUNT: `${API_BASE_URL}/reverse_reconciliation_circle_wise_count_summary_report/`,
};

/* ================================================================ */
/*  Color Scheme                                                    */
/* ================================================================ */
const COLORS = {
    primary: "#006e74",
    primaryDark: "#00494d",
    success: "#28a745",
    warning: "#ffc107",
    error: "#dc3545",
    info: "#17a2b8",
    lightBg: "#f8f9fa",
    borderColor: "#c9dcdc",
    headerGradient: "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)",
};

/* ================================================================ */
/*  CSV Download Utility                                            */
/* ================================================================ */
const downloadCSV = (data, filename, headers) => {
    if (!data || data.length === 0) {
        alert("No data to download");
        return;
    }

    const csvContent = [
        headers.join(","),
        ...data.map((row) =>
            headers
                .map((header) => {
                    const value = row[header];
                    // Escape commas and quotes
                    if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                })
                .join(",")
        ),
    ].join("\n");

    const element = document.createElement("a");
    element.setAttribute(
        "href",
        `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`
    );
    element.setAttribute("download", `${filename}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

/* ================================================================ */
/*  Status Chip Component                                           */
/* ================================================================ */
const StatusChip = ({ status }) => {
    let color = "default";
    let backgroundColor = "#e0e0e0";

    if (status?.toLowerCase().includes("fully")) {
        color = "success";
        backgroundColor = COLORS.success;
    } else if (status?.toLowerCase().includes("partially")) {
        color = "warning";
        backgroundColor = COLORS.warning;
    } else if (status?.toLowerCase().includes("not")) {
        color = "error";
        backgroundColor = COLORS.error;
    }

    return (
        <Chip
            label={status}
            color={color}
            variant="outlined"
            size="small"
            sx={{
                fontWeight: 600,
                fontSize: "11px",
                borderColor: backgroundColor,
                color: backgroundColor,
            }}
        />
    );
};

/* ================================================================ */
/*  Summary Card Component                                          */
/* ================================================================ */
const SummaryCard = ({ title, value, unit = "", color = COLORS.primary }) => {
    return (
        <Card
            sx={{
                background: "#fff",
                border: `1px solid ${COLORS.borderColor}`,
                borderRadius: 1.5,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,107,106,0.1)",
                    transform: "translateY(-2px)",
                },
                overflow: "hidden",
                height: "100%",
            }}
        >
            <Box sx={{ height: 3, background: COLORS.headerGradient }} />
            <CardContent sx={{ p: 2, textAlign: "center" }}>
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: "11px",
                        color: "#666",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.3,
                        display: "block",
                        mb: 1,
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    sx={{
                        fontSize: "28px",
                        fontWeight: 800,
                        color: color,
                        mb: 0.5,
                    }}
                >
                    {typeof value === "number" ? value.toLocaleString() : value}
                </Typography>
                {unit && (
                    <Typography
                        sx={{
                            fontSize: "12px",
                            color: "#999",
                            fontWeight: 500,
                        }}
                    >
                        {unit}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

/* ================================================================ */
/*  Circle Summary Table Component                                  */
/* ================================================================ */
const CircleSummaryTable = ({ data, loading, onRefresh, onDownload }) => {
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Alert severity="info">No data available for Circle Summary</Alert>
        );
    }

    const columns = [
        { key: "Circle", label: "Circle" },
        { key: "Site ID", label: "Site ID" },
        { key: "Module Qty", label: "Module Qty" },
        { key: "WH Submission Qty", label: "WH Submission Qty" },
        { key: "Gap", label: "Gap" },
        { key: "Submission Status", label: "Submission Status" },
    ];

    return (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 1.5,
                border: `1px solid ${COLORS.borderColor}`,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    background: COLORS.headerGradient,
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography
                    sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: 0.3,
                    }}
                >
                    📊 Circle Wise Summary Report
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<RefreshIcon sx={{ fontSize: "16px" }} />}
                        onClick={onRefresh}
                        sx={{
                            background: "#fff",
                            color: COLORS.primary,
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: "12px",
                            "&:hover": { background: "#f0f0f0" },
                        }}
                    >
                        Refresh
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<FileDownloadIcon sx={{ fontSize: "16px" }} />}
                        onClick={onDownload}
                        sx={{
                            background: "#fff",
                            color: COLORS.primary,
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: "12px",
                            "&:hover": { background: "#f0f0f0" },
                        }}
                    >
                        Download
                    </Button>
                </Stack>
            </Box>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow sx={{ background: COLORS.primary }}>
                        {columns.map((col) => (
                            <TableCell
                                key={col.key}
                                sx={{
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: "11px",
                                    textTransform: "uppercase",
                                    py: 1,
                                    backgroundColor: COLORS.primary,
                                }}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                background: index % 2 === 0 ? "#fff" : COLORS.lightBg,
                                "&:hover": { background: `${COLORS.primary}08` },
                                borderBottom: `1px solid ${COLORS.borderColor}`,
                            }}
                        >
                            {columns.map((col) => (
                                <TableCell
                                    key={`${index}-${col.key}`}
                                    sx={{
                                        fontSize: "12px",
                                        py: 1,
                                        fontWeight: col.key === "Circle" ? 600 : 400,
                                    }}
                                >
                                    {col.key === "Submission Status" ? (
                                        <StatusChip status={row[col.key]} />
                                    ) : col.key === "Gap" ? (
                                        <Typography
                                            sx={{
                                                color: parseInt(row[col.key]) < 0 ? COLORS.error : COLORS.success,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {row[col.key]}
                                        </Typography>
                                    ) : (
                                        row[col.key]
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

/* ================================================================ */
/*  Circle Count Summary Table Component                            */
/* ================================================================ */
const CircleCountTable = ({ data, loading, onRefresh, onDownload }) => {
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Alert severity="info">No data available for Circle Count Summary</Alert>
        );
    }

    const columns = [
        { key: "Circle", label: "Circle" },
        { key: "Fully Closed", label: "Fully Closed" },
        { key: "Partially submitted", label: "Partially Submitted" },
        { key: "not submitted", label: "Not Submitted" },
        { key: "Grand Total", label: "Grand Total" },
    ];

    return (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 1.5,
                border: `1px solid ${COLORS.borderColor}`,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    background: COLORS.headerGradient,
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography
                    sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: 0.3,
                    }}
                >
                    📈 Circle Wise Count Summary Report
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<RefreshIcon sx={{ fontSize: "16px" }} />}
                        onClick={onRefresh}
                        sx={{
                            background: "#fff",
                            color: COLORS.primary,
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: "12px",
                            "&:hover": { background: "#f0f0f0" },
                        }}
                    >
                        Refresh
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<FileDownloadIcon sx={{ fontSize: "16px" }} />}
                        onClick={onDownload}
                        sx={{
                            background: "#fff",
                            color: COLORS.primary,
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: "12px",
                            "&:hover": { background: "#f0f0f0" },
                        }}
                    >
                        Download
                    </Button>
                </Stack>
            </Box>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow sx={{ background: COLORS.primary }}>
                        {columns.map((col) => (
                            <TableCell
                                key={col.key}
                                align={col.key === "Circle" ? "left" : "center"}
                                sx={{
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: "11px",
                                    textTransform: "uppercase",
                                    py: 1,
                                    backgroundColor: COLORS.primary,
                                }}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                background: index % 2 === 0 ? "#fff" : COLORS.lightBg,
                                "&:hover": { background: `${COLORS.primary}08` },
                                borderBottom: `1px solid ${COLORS.borderColor}`,
                            }}
                        >
                            {columns.map((col) => (
                                <TableCell
                                    key={`${index}-${col.key}`}
                                    align={col.key === "Circle" ? "left" : "center"}
                                    sx={{
                                        fontSize: "12px",
                                        py: 1,
                                        fontWeight: col.key === "Circle" ? 600 : 700,
                                        color: col.key === "Grand Total" ? COLORS.primary : "inherit",
                                    }}
                                >
                                    {row[col.key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

/* ================================================================ */
/*  Main Dashboard Component                                        */
/* ================================================================ */
const Dashboard = () => {
    const [circleSummaryData, setCircleSummaryData] = useState([]);
    const [circleCountData, setCircleCountData] = useState([]);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingCount, setLoadingCount] = useState(false);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    /* ================================================================ */
    /*  Fetch Circle Summary Data                                       */
    /* ================================================================ */
    const fetchCircleSummary = async () => {
        setLoadingSummary(true);
        setError(null);
        try {
            const response = await fetch(APIs.CIRCLE_SUMMARY);
            const result = await response.json();

            if (result.status === true && result.data) {
                setCircleSummaryData(result.data);
            } else {
                setError(result.message || "Failed to fetch Circle Summary data");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "Error fetching Circle Summary data");
        } finally {
            setLoadingSummary(false);
        }
    };

    /* ================================================================ */
    /*  Fetch Circle Count Data                                         */
    /* ================================================================ */
    const fetchCircleCount = async () => {
        setLoadingCount(true);
        setError(null);
        try {
            const response = await fetch(APIs.CIRCLE_COUNT);
            const result = await response.json();

            if (result.status === true && result.data) {
                setCircleCountData(result.data);
            } else {
                setError(result.message || "Failed to fetch Circle Count data");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "Error fetching Circle Count data");
        } finally {
            setLoadingCount(false);
        }
    };

    /* ================================================================ */
    /*  Download Handlers                                               */
    /* ================================================================ */
    const handleDownloadCircleSummary = () => {
        const headers = ["Circle", "Site ID", "Module Qty", "WH Submission Qty", "Gap", "Submission Status"];
        downloadCSV(circleSummaryData, "circle_wise_summary_report", headers);
    };

    const handleDownloadCircleCount = () => {
        const headers = ["Circle", "Fully Closed", "Partially submitted", "not submitted", "Grand Total"];
        downloadCSV(circleCountData, "circle_wise_count_summary_report", headers);
    };

    /* ================================================================ */
    /*  Initial Data Fetch                                              */
    /* ================================================================ */
    useEffect(() => {
        document.title = "Dashboard - Reverse Reconciliation";
        fetchCircleSummary();
        fetchCircleCount();
    }, []);

    /* ================================================================ */
    /*  Calculate Summary Statistics                                    */
    /* ================================================================ */
    const summaryStats = {
        totalCircles: circleCountData.length,
        totalItems: circleCountData.reduce((sum, row) => sum + parseInt(row["Grand Total"] || 0), 0),
        fullyClosed: circleCountData.reduce((sum, row) => sum + parseInt(row["Fully Closed"] || 0), 0),
        partiallySubmitted: circleCountData.reduce((sum, row) => sum + parseInt(row["Partially submitted"] || 0), 0),
    };

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    <Typography
                        sx={{ cursor: "pointer", color: COLORS.primary, fontWeight: 600 }}
                        onClick={() => navigate("/tools")}
                    >
                        Tools
                    </Typography>
                    <Typography
                        sx={{ cursor: "pointer", color: COLORS.primary, fontWeight: 600 }}
                        onClick={() => navigate("/tools/material_management")}
                    >
                        Material Management
                    </Typography>
                    <Typography color="text.primary" sx={{ fontWeight: 600 }}>
                        Reverse Reconciliation Dashboard
                    </Typography>
                </Breadcrumbs>
            </div>

            <Slide direction="left" in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "95%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>
                                Reverse Reconciliation Dashboard
                            </Box>

                            {/* Error Alert */}
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {/* Summary Statistics */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <SummaryCard
                                        title="Total Circles"
                                        value={summaryStats.totalCircles}
                                        color={COLORS.primary}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <SummaryCard
                                        title="Total Items"
                                        value={summaryStats.totalItems}
                                        color={COLORS.info}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <SummaryCard
                                        title="Fully Closed"
                                        value={summaryStats.fullyClosed}
                                        color={COLORS.success}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <SummaryCard
                                        title="Partially Submitted"
                                        value={summaryStats.partiallySubmitted}
                                        color={COLORS.warning}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            {/* Tabs for Tables */}
                            <Box sx={{ borderBottom: 1, borderColor: COLORS.borderColor, mb: 2 }}>
                                <Tabs
                                    value={tabValue}
                                    onChange={(e, newValue) => setTabValue(newValue)}
                                    sx={{
                                        "& .MuiTab-root": {
                                            fontWeight: 600,
                                            color: "#666",
                                            textTransform: "none",
                                            fontSize: "13px",
                                            "&.Mui-selected": {
                                                color: COLORS.primary,
                                                fontWeight: 700,
                                            },
                                        },
                                        "& .MuiTabs-indicator": {
                                            backgroundColor: COLORS.primary,
                                        },
                                    }}
                                >
                                    <Tab label="Circle Summary" />
                                    <Tab label="Circle Count" />
                                </Tabs>
                            </Box>

                            {/* Circle Summary Table */}
                            {tabValue === 0 && (
                                <CircleSummaryTable
                                    data={circleSummaryData}
                                    loading={loadingSummary}
                                    onRefresh={fetchCircleSummary}
                                    onDownload={handleDownloadCircleSummary}
                                />
                            )}

                            {/* Circle Count Table */}
                            {tabValue === 1 && (
                                <CircleCountTable
                                    data={circleCountData}
                                    loading={loadingCount}
                                    onRefresh={fetchCircleCount}
                                    onDownload={handleDownloadCircleCount}
                                />
                            )}
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default Dashboard;