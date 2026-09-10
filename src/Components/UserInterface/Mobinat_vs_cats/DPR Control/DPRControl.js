// import React, { useState, useEffect, useCallback } from "react";
// import { Box, Button, Stack } from "@mui/material";
// import { Breadcrumbs, Link, Typography } from "@mui/material";
// import {
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
// } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import { useNavigate } from "react-router-dom";
// import Slide from '@mui/material/Slide';
// import UploadIcon from '@mui/icons-material/Upload';
// import DoDisturbIcon from '@mui/icons-material/DoDisturb';
// import Swal from "sweetalert2";
// import { postData, ServerURL } from "../../../services/FetchNodeServices";
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import DnsIcon from '@mui/icons-material/Dns';
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import InputLabel from '@mui/material/InputLabel';
// import { getDecreyptedData } from "../../../utils/localstorage";

// /* ------------------------------------------------------------------ */
// /*  Theme — matched to the teal "Baseband Requirement" screens          */
// /* ------------------------------------------------------------------ */
// const C = {
//     teal: "#006e74",
//     tealDark: "#00494d",
//     headerBg: "#004d52",
//     labelOdd: "#e3f2f2",
//     labelEven: "#f2fafa",
//     border: "#c9dcdc",
//     valueText: "#0d3a3c",
//     zeroText: "#a7bcbc",
//     tick: "#1a7f37",
//     cross: "#c62828",
// };

// const HEADER_GRADIENT = "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)";

// const buildColumns = (rows) => {
//     if (!rows || !rows.length) return [];
//     const keySet = new Set();
//     rows.forEach((r) => Object.keys(r).forEach((k) => keySet.add(k)));
//     return Array.from(keySet);
// };

// const isTickCross = (val) =>
//     typeof val === "string" && (val.trim().startsWith("✓") || val.trim() === "✗" || val.trim() === "X");

// const cellColor = (val) => {
//     if (typeof val === "string") {
//         const v = val.trim();
//         if (v.startsWith("✓")) return C.tick;
//         if (v === "✗" || v === "X") return C.cross;
//         if (v === "") return C.zeroText;
//     }
//     if (val === 0) return C.zeroText;
//     return C.valueText;
// };

// /* ------------------------------------------------------------------ */
// /*  Results table shown below the download button                      */
// /* ------------------------------------------------------------------ */
// function BasebandResultTable({ rows }) {
//     const columns = buildColumns(rows);
//     const hasData = Array.isArray(rows) && rows.length > 0;

//     if (!hasData) return null;

//     return (
//         <Box sx={{ mt: 4, px: { xs: 1, md: 3 } }}>
//             <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${C.border}` }}>
//                 <Box
//                     sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                         px: 2,
//                         py: 1.25,
//                         background: HEADER_GRADIENT,
//                     }}
//                 >
//                     <DnsIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />
//                     <Typography
//                         variant="subtitle2"
//                         sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}
//                     >
//                         Baseband Site-wise Data
//                     </Typography>
//                 </Box>

//                 <TableContainer sx={{ maxHeight: 600 }}>
//                     <Table
//                         size="small"
//                         stickyHeader
//                         sx={{
//                             borderCollapse: "collapse",
//                             "& .MuiTableCell-root": { border: `1px solid ${C.border}`, py: 0.75, fontSize: 12.5 },
//                         }}
//                     >
//                         <TableHead>
//                             <TableRow>
//                                 {columns.map((c) => (
//                                     <TableCell
//                                         key={c}
//                                         align="center"
//                                         sx={{
//                                             position: "sticky",
//                                             top: 0,
//                                             zIndex: 4,
//                                             bgcolor: C.teal,
//                                             color: "#fff",
//                                             fontWeight: 700,
//                                             whiteSpace: "nowrap",
//                                             minWidth: 90,
//                                         }}
//                                     >
//                                         {String(c).trim()}
//                                     </TableCell>
//                                 ))}
//                             </TableRow>
//                         </TableHead>

//                         <TableBody>
//                             {rows.map((row, i) => {
//                                 const labelBg = i % 2 === 0 ? C.labelOdd : C.labelEven;
//                                 return (
//                                     <TableRow key={i}>
//                                         {columns.map((c) => {
//                                             const val = row[c];
//                                             const display = val === "" || val == null ? "—" : val;
//                                             return (
//                                                 <TableCell
//                                                     key={c}
//                                                     align="center"
//                                                     sx={{
//                                                         bgcolor: labelBg,
//                                                         fontVariantNumeric: "tabular-nums",
//                                                         color: cellColor(val),
//                                                         fontWeight: isTickCross(val) ? 800 : 600,
//                                                         whiteSpace: "nowrap",
//                                                     }}
//                                                 >
//                                                     {display}
//                                                 </TableCell>
//                                             );
//                                         })}
//                                     </TableRow>
//                                 );
//                             })}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Paper>
//         </Box>
//     );
// }

// const DPRControl = () => {
//     const [circleFiles, setCircleFiles] = useState([]);
//     const [milestoneFiles, setMilestoneFiles] = useState([]);
//     const [showCircleError, setShowCircleError] = useState(false);
//     const [showMilestoneError, setShowMilestoneError] = useState(false);
//     const [fileData, setFileData] = useState()
//     const [download, setDownload] = useState(false);
//     const [resultData, setResultData] = useState([]);
//     const { loading, action } = useLoadingDialog()
//     const navigate = useNavigate()
//     const classes = OverAllCss()

//     // Handle Circle Files Selection
//     const handleCircleFileSelection = (event) => {
//         setCircleFiles(event.target.files);
//         setShowCircleError(false);
//     };

//     // Handle Milestone Files Selection
//     const handleMilestoneFileSelection = (event) => {
//         setMilestoneFiles(event.target.files);
//         setShowMilestoneError(false);
//     };

//     const handleSubmit = async () => {
//         let hasError = false;

//         // Validate Circle Files
//         if (circleFiles.length === 0) {
//             setShowCircleError(true);
//             hasError = true;
//         }

//         // Validate Milestone Files
//         if (milestoneFiles.length === 0) {
//             setShowMilestoneError(true);
//             hasError = true;
//         }

//         if (hasError) return;

//         action(true);
//         var formData = new FormData();

//         // Add circle files
//         for (let i = 0; i < circleFiles.length; i++) {
//             formData.append(`circle_files`, circleFiles[i]);
//         }

//         // Add milestone files
//         for (let i = 0; i < milestoneFiles.length; i++) {
//             formData.append(`milestone_file`, milestoneFiles[i]);
//         }

//         const response = await postData('mobinate_vs_cats/dpr_data_stor/', formData);

//         if (response.status === true) {
//             action(false);
//             setDownload(true);
//             setFileData(response.download_url);
//             setResultData(Array.isArray(response.data) ? response.data : []);

//             Swal.fire({
//                 icon: "success",
//                 title: "Done",
//                 text: `${response.message}`,
//             });
//         } else {
//             action(false);
//             Swal.fire({
//                 icon: "error",
//                 title: "Oops...",
//                 text: `${response.message}`,
//             });
//         }
//     };

//     const handleCancel = () => {
//         setCircleFiles([]);
//         setMilestoneFiles([]);
//         setShowCircleError(false);
//         setShowMilestoneError(false);
//         setDownload(false);
//         setResultData([]);
//     };

//     useEffect(() => {
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
//     }, []);

//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     itemsBeforeCollapse={2}
//                     maxItems={3}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/material_management")}>
//                         Mobinate Vs Aws
//                     </Link>
//                     <Typography color="text.primary">DPR Control</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Slide direction="left" in={true} timeout={1000}>
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
//                             <Box className={classes.Box_Hading}>Full Site Dismental DPR</Box>

//                             <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
//                                 {/* Circle Files Upload Section */}
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>
//                                         Select Circle Files:-
//                                     </div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <div style={{ float: "left" }}>
//                                             <Button
//                                                 variant="contained"
//                                                 component="label"
//                                                 color={circleFiles.length > 0 ? "warning" : "primary"}
//                                             >
//                                                 Select File
//                                                 <input
//                                                     required
//                                                     hidden
//                                                     accept=".csv,.xlsx,.xls"
//                                                     multiple
//                                                     type="file"
//                                                     onChange={handleCircleFileSelection}
//                                                 />
//                                             </Button>
//                                         </div>

//                                         {circleFiles.length > 0 && (
//                                             <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>
//                                                 Selected File(s): {circleFiles.length}
//                                             </span>
//                                         )}

//                                         <div>
//                                             <span
//                                                 style={{
//                                                     display: showCircleError ? 'inherit' : 'none',
//                                                     color: 'red',
//                                                     fontSize: '18px',
//                                                     fontWeight: 600,
//                                                 }}
//                                             >
//                                                 This Field Is Required!
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </Box>

//                                 {/* Milestone Files Upload Section */}
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>
//                                         Select Milestone Files:-
//                                     </div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <div style={{ float: "left" }}>
//                                             <Button
//                                                 variant="contained"
//                                                 component="label"
//                                                 color={milestoneFiles.length > 0 ? "warning" : "primary"}
//                                             >
//                                                 Select File
//                                                 <input
//                                                     required
//                                                     hidden
//                                                     accept=".csv,.xlsx,.xls"
//                                                     multiple
//                                                     type="file"
//                                                     onChange={handleMilestoneFileSelection}
//                                                 />
//                                             </Button>
//                                         </div>

//                                         {milestoneFiles.length > 0 && (
//                                             <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>
//                                                 Selected File(s): {milestoneFiles.length}
//                                             </span>
//                                         )}

//                                         <div>
//                                             <span
//                                                 style={{
//                                                     display: showMilestoneError ? 'inherit' : 'none',
//                                                     color: 'red',
//                                                     fontSize: '18px',
//                                                     fontWeight: 600,
//                                                 }}
//                                             >
//                                                 This Field Is Required!
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </Box>
//                             </Stack>

//                             {/* Action Buttons */}
//                             <Stack
//                                 direction={{ xs: "column", sm: "column", md: "row" }}
//                                 spacing={2}
//                                 style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}
//                             >
//                                 <Button
//                                     variant="contained"
//                                     color="success"
//                                     onClick={handleSubmit}
//                                     endIcon={<UploadIcon />}
//                                 >
//                                     Submit
//                                 </Button>

//                                 <Button
//                                     variant="contained"
//                                     onClick={handleCancel}
//                                     style={{ backgroundColor: "red", color: 'white' }}
//                                     endIcon={<DoDisturbIcon />}
//                                 >
//                                     Cancel
//                                 </Button>
//                             </Stack>
//                         </Box>
//                     </Box>

//                     {/* Download Button - Show when data is available */}
//                     <Box sx={{ display: download ? 'block' : 'none', textAlign: 'center' }}>
//                         <a download href={fileData}>
//                             <Button
//                                 variant="outlined"
//                                 title="Export Excel"
//                                 startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />}
//                                 sx={{ marginTop: "10px", width: "auto" }}
//                             >
//                                 <span
//                                     style={{
//                                         fontFamily: "Poppins",
//                                         fontSize: "22px",
//                                         fontWeight: 800,
//                                         textTransform: "none",
//                                         textDecorationLine: "none",
//                                     }}
//                                 >
//                                     Download DPR Report
//                                 </span>
//                             </Button>
//                         </a>
//                     </Box>

//                     {/* Results Table */}
//                     <BasebandResultTable rows={resultData} />
//                 </Box>
//             </Slide>

//             {loading}
//         </>
//     );
// };

// export default DPRControl;


import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Card, CardContent, Grid, Typography, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Breadcrumbs, Link } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import { postData } from "../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DnsIcon from '@mui/icons-material/Dns';
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

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
/*  Export to Excel Helper Function                                 */
/* ================================================================ */
const exportToExcel = (data, fileName, sheetName = "Sheet1") => {
    try {
        // Create a new workbook
        let csv = [];

        // Add headers
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            csv.push(headers.join(","));

            // Add rows
            data.forEach(row => {
                const values = headers.map(header => {
                    const value = row[header];
                    // Handle values that might contain commas or quotes
                    if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value || "";
                });
                csv.push(values.join(","));
            });
        }

        // Create blob and download
        const csvContent = csv.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${fileName}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Export error:", error);
        Swal.fire("Error", "Failed to export file", "error");
    }
};

/* ================================================================ */
/*  Compact Summary Card Component                                  */
/* ================================================================ */
const CompactSummaryCard = ({ title, value, icon: Icon, color = COLORS.primary }) => {
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
            <Box sx={{ height: 2, background: COLORS.headerGradient }} />
            <CardContent sx={{ p: 1.5, textAlign: "center" }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                    {Icon && (
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "8px",
                                background: `${color}15`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Icon sx={{ color: color, fontSize: 18 }} />
                        </Box>
                    )}
                </Box>
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: "10px",
                        color: "#666",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.3,
                        display: "block",
                        mb: 0.5,
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    sx={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: color,
                    }}
                >
                    {typeof value === "number" ? value.toLocaleString() : value}
                </Typography>
            </CardContent>
        </Card>
    );
};

/* ================================================================ */
/*  DPR Dashboard Component                                         */
/* ================================================================ */
const DPRDashboard = ({ data, downloadUrl }) => {
    if (!data) return null;

    const {
        status,
        message,
        total_rows = 0,
        database_save = {},
        duplicate_unique_ids = {},
        past_month_dismantle_dates = {},
    } = data;

    const { created = 0, updated = 0, failed = 0, batch_id = "N/A", sample_details = [] } = database_save;
    const { duplicate_count = 0, duplicates = [] } = duplicate_unique_ids;
    const { warning_count = 0, warnings = [] } = past_month_dismantle_dates;

    const handleDownload = () => {
        if (downloadUrl) {
            window.open(downloadUrl, "_blank");
        }
    };

    return (
        <Box
            sx={{
                mt: 2,
                p: 2,
                background: COLORS.lightBg,
                borderRadius: 1.5,
                border: `1px solid ${COLORS.borderColor}`,
            }}
        >
            {/* Status Alert */}
            {status && (
                <Alert
                    icon={<CheckCircleIcon sx={{ fontSize: "18px" }} />}
                    severity="success"
                    sx={{
                        background: `${COLORS.success}15`,
                        border: `1px solid ${COLORS.success}`,
                        color: COLORS.success,
                        fontWeight: 600,
                        fontSize: "12px",
                        mb: 2,
                        py: 1,
                        px: 1.5,
                    }}
                >
                    ✓ {message}
                </Alert>
            )}

            {/* Summary Cards Grid */}
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                <Grid item xs={6} sm={3}>
                    <CompactSummaryCard
                        title="Total Rows"
                        value={total_rows}
                        icon={InfoIcon}
                        color={COLORS.primary}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <CompactSummaryCard
                        title="Created"
                        value={created}
                        icon={CheckCircleIcon}
                        color={COLORS.success}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <CompactSummaryCard
                        title="Updated"
                        value={updated}
                        icon={TrendingUpIcon}
                        color={COLORS.primary}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <CompactSummaryCard
                        title="Failed (Old Site Id Blank)"
                        value={failed}
                        icon={WarningIcon}
                        color={COLORS.error}
                    />
                </Grid>
            </Grid>

            {/* Alerts for Issues */}
            {(duplicate_count > 0 || warning_count > 0) && (
                <Box sx={{ mb: 2 }}>
                    {duplicate_count > 0 && (
                        <Alert
                            severity="warning"
                            sx={{
                                fontSize: "11px",
                                background: `${COLORS.warning}15`,
                                border: `1px solid ${COLORS.warning}`,
                                color: "#000",
                                mb: 1,
                                py: 0.8,
                            }}
                        >
                            ⚠ {duplicate_count} duplicate IDs found
                        </Alert>
                    )}
                    {warning_count > 0 && (
                        <Alert
                            severity="info"
                            sx={{
                                fontSize: "11px",
                                background: `${COLORS.info}15`,
                                border: `1px solid ${COLORS.info}`,
                                color: COLORS.info,
                                py: 0.8,
                            }}
                        >
                            ℹ {warning_count.toLocaleString()} records with past-month dates
                        </Alert>
                    )}
                </Box>
            )}

            {/* Download Main Button */}
            {downloadUrl && (
                <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon sx={{ fontSize: "16px" }} />}
                    onClick={handleDownload}
                    size="small"
                    fullWidth
                    sx={{
                        background: COLORS.primary,
                        color: "#fff",
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "12px",
                        py: 1,
                        borderRadius: 1,
                        "&:hover": { background: COLORS.primaryDark },
                        mb: 2,
                    }}
                >
                    Download Main DPR Report
                </Button>
            )}

            {/* Info */}
            <Typography sx={{ fontSize: "11px", color: "#666", fontWeight: 600 }}>
                Batch ID: {batch_id}
            </Typography>
        </Box>
    );
};

/* ================================================================ */
/*  Downloadable Table Section Component                            */
/* ================================================================ */
const DownloadableTableSection = ({ title, data, columns, onDownload, icon: Icon }) => {
    return (
        <Paper
            sx={{
                mt: 2,
                borderRadius: 1.5,
                border: `1px solid ${COLORS.borderColor}`,
                overflow: "hidden",
            }}
        >
            {/* Header with Download */}
            <Box
                sx={{
                    background: COLORS.headerGradient,
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    {Icon && <Icon sx={{ color: "#fff", fontSize: 18 }} />}
                    <Typography
                        sx={{
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "12px",
                            textTransform: "uppercase",
                            letterSpacing: 0.3,
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        sx={{
                            color: "rgba(255,255,255,0.8)",
                            fontSize: "10px",
                            fontWeight: 600,
                            ml: "auto",
                        }}
                    >
                        ({data.length} rows)
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<FileDownloadIcon sx={{ fontSize: "14px" }} />}
                    onClick={onDownload}
                    sx={{
                        background: "#fff",
                        color: COLORS.primary,
                        fontWeight: 700,
                        fontSize: "10px",
                        textTransform: "none",
                        py: 0.4,
                        px: 1,
                        "&:hover": { background: "rgba(255,255,255,0.9)" },
                    }}
                >
                    Export
                </Button>
            </Box>

            {/* Table */}
            <TableContainer sx={{ maxHeight: 300 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ background: COLORS.primary }}>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.id}
                                    align={col.align || "left"}
                                    sx={{
                                        color: "#fff",
                                        fontWeight: 700,
                                        fontSize: "11px",
                                        textTransform: "uppercase",
                                        py: 0.8,
                                    }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((row, idx) => (
                                <TableRow
                                    key={idx}
                                    sx={{
                                        background: idx % 2 === 0 ? "#fff" : COLORS.lightBg,
                                        "&:hover": { background: `${COLORS.primary}08` },
                                    }}
                                >
                                    {columns.map((col) => (
                                        <TableCell
                                            key={`${idx}-${col.id}`}
                                            align={col.align || "left"}
                                            sx={{
                                                fontSize: "11px",
                                                py: 0.6,
                                            }}
                                        >
                                            {col.render ? col.render(row[col.id], row) : row[col.id] || "-"}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 2, color: "#999", fontSize: "11px" }}>
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

/* ================================================================ */
/*  Main DPR Control Component                                      */
/* ================================================================ */
const DPRControl = () => {
    const [circleFiles, setCircleFiles] = useState([]);
    const [milestoneFiles, setMilestoneFiles] = useState([]);
    const [showCircleError, setShowCircleError] = useState(false);
    const [showMilestoneError, setShowMilestoneError] = useState(false);
    const [fileData, setFileData] = useState();
    const [download, setDownload] = useState(false);
    const [resultData, setResultData] = useState(null);
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    // Handle Circle Files Selection
    const handleCircleFileSelection = (event) => {
        setCircleFiles(event.target.files);
        setShowCircleError(false);
    };

    // Handle Milestone Files Selection
    const handleMilestoneFileSelection = (event) => {
        setMilestoneFiles(event.target.files);
        setShowMilestoneError(false);
    };

    const handleSubmit = async () => {
        let hasError = false;

        // Validate Circle Files
        if (circleFiles.length === 0) {
            setShowCircleError(true);
            hasError = true;
        }

        // Validate Milestone Files
        if (milestoneFiles.length === 0) {
            setShowMilestoneError(true);
            hasError = true;
        }

        if (hasError) return;

        try {
            action(true);
            const formData = new FormData();

            // Add circle files
            for (let i = 0; i < circleFiles.length; i++) {
                formData.append("circle_files", circleFiles[i]);
            }

            // Add milestone files
            for (let i = 0; i < milestoneFiles.length; i++) {
                formData.append("milestone_file", milestoneFiles[i]);
            }

            const response = await postData("mobinate_vs_cats/dpr_data_stor/", formData);

            if (response.status === true) {
                setDownload(true);
                setFileData(response.download_url);
                setResultData(response);

                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: response.message,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.message || "An error occurred",
                });
            }
        } catch (error) {
            console.error("Submit error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Failed to submit files",
            });
        } finally {
            action(false);
        }
    };

    const handleCancel = () => {
        setCircleFiles([]);
        setMilestoneFiles([]);
        setShowCircleError(false);
        setShowMilestoneError(false);
        setDownload(false);
        setResultData(null);
        setFileData(null);
    };

    useEffect(() => {
        document.title = "DPR Control";
    }, []);

    // Extract data from response
    const sampleDetails = resultData?.database_save?.sample_details || [];
    const duplicates = resultData?.duplicate_unique_ids?.duplicates || [];
    const warnings = resultData?.past_month_dismantle_dates?.warnings || [];

    // Table columns
    const activityColumns = [
        { id: "unique_id", label: "Unique ID" },
        { id: "action", label: "Action" },
        // { id: "updated_fields", label: "Updated Fields" },
        { id: "updated_fields", label: "Updated Fields", children: [{ id: "updated_by", label: "Updated By" }] },
        { id: "field_count", label: "Fields Changed", align: "center" },
        { id: "updated_by", label: "Updated By" },
    ];

    const duplicateColumns = [
        { id: "unique_id", label: "Unique ID" },
        { id: "occurrences", label: "Occurrences", align: "center" },
    ];

    const warningColumns = [
        { id: "unique_id", label: "Unique ID" },
        { id: "dismantle_date", label: "Dismantle Date" },
        { id: "message", label: "Message" },
    ];

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    itemsBeforeCollapse={2}
                    maxItems={3}
                    separator={<KeyboardArrowRightIcon fontSize="small" />}
                >
                    <Link underline="hover" onClick={() => navigate("/tools")} sx={{ cursor: "pointer" }}>
                        Tools
                    </Link>
                    <Link underline="hover" onClick={() => navigate("/tools/material_management")} sx={{ cursor: "pointer" }}>
                        Material Management
                    </Link>
                    <Typography color="text.primary">DPR Control</Typography>
                </Breadcrumbs>
            </div>

            <Slide direction="left" in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Full Site Dismental DPR</Box>

                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction="column">
                                {/* Circle Files Upload Section */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Circle Files:-
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                color={circleFiles.length > 0 ? "warning" : "primary"}
                                            >
                                                Select File
                                                <input
                                                    required
                                                    hidden
                                                    accept=".csv,.xlsx,.xls"
                                                    multiple
                                                    type="file"
                                                    onChange={handleCircleFileSelection}
                                                />
                                            </Button>
                                        </div>

                                        {circleFiles.length > 0 && (
                                            <span style={{ color: "green", fontSize: "18px", fontWeight: 600 }}>
                                                Selected File(s): {circleFiles.length}
                                            </span>
                                        )}

                                        {showCircleError && (
                                            <span style={{ color: "red", fontSize: "18px", fontWeight: 600 }}>
                                                This Field Is Required!
                                            </span>
                                        )}
                                    </div>
                                </Box>

                                {/* Milestone Files Upload Section */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Milestone Files:-
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                color={milestoneFiles.length > 0 ? "warning" : "primary"}
                                            >
                                                Select File
                                                <input
                                                    required
                                                    hidden
                                                    accept=".csv,.xlsx,.xls"
                                                    multiple
                                                    type="file"
                                                    onChange={handleMilestoneFileSelection}
                                                />
                                            </Button>
                                        </div>

                                        {milestoneFiles.length > 0 && (
                                            <span style={{ color: "green", fontSize: "18px", fontWeight: 600 }}>
                                                Selected File(s): {milestoneFiles.length}
                                            </span>
                                        )}

                                        {showMilestoneError && (
                                            <span style={{ color: "red", fontSize: "18px", fontWeight: 600 }}>
                                                This Field Is Required!
                                            </span>
                                        )}
                                    </div>
                                </Box>
                            </Stack>

                            {/* Action Buttons */}
                            <Stack
                                direction={{ xs: "column", sm: "column", md: "row" }}
                                spacing={2}
                                style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}
                            >
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSubmit}
                                    endIcon={<UploadIcon />}
                                    disabled={circleFiles.length === 0 || milestoneFiles.length === 0}
                                >
                                    Submit
                                </Button>

                                <Button
                                    variant="contained"
                                    onClick={handleCancel}
                                    style={{ backgroundColor: "red", color: "white" }}
                                    endIcon={<DoDisturbIcon />}
                                >
                                    Cancel
                                </Button>
                            </Stack>

                            {/* Dashboard - Show when data is available */}
                            {download && <DPRDashboard data={resultData} downloadUrl={fileData} />}

                            {/* Downloadable Tables */}
                            {download && (
                                <>
                                    <DownloadableTableSection
                                        title="Database Activity - Sample Details"
                                        data={sampleDetails}
                                        columns={activityColumns}
                                        icon={InfoIcon}
                                        onDownload={() =>
                                            exportToExcel(sampleDetails, "DPR_Database_Activity", "Database Activity")
                                        }
                                    />

                                    <DownloadableTableSection
                                        title="Duplicate Unique IDs"
                                        data={duplicates}
                                        columns={duplicateColumns}
                                        icon={WarningIcon}
                                        onDownload={() =>
                                            exportToExcel(duplicates, "DPR_Duplicate_IDs", "Duplicates")
                                        }
                                    />

                                    <DownloadableTableSection
                                        title="Past Month Dismantle Dates"
                                        data={warnings.slice(0, 100)}
                                        columns={warningColumns}
                                        icon={InfoIcon}
                                        onDownload={() =>
                                            exportToExcel(warnings, "DPR_Past_Month_Warnings", "Warnings")
                                        }
                                    />
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default DPRControl;