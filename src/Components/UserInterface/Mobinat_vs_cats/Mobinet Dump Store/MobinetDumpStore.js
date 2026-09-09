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
import DnsIcon from '@mui/icons-material/Dns';
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ErrorIcon from '@mui/icons-material/Error';

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
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {typeof value === "number" ? value.toLocaleString() : value}
                </Typography>
            </CardContent>
        </Card>
    );
};

/* ================================================================ */
/*  Compact Result Display Component                                */
/* ================================================================ */
const MobinateDumpResult = ({ data }) => {
    if (!data) return null;

    const {
        success,
        total_files = 0,
        total_rows_read = 0,
        total_created = 0,
        total_invalid = 0,
        total_updated = 0,
        total_duplicate_in_file = 0,
    } = data;

    // Calculate percentages
    const successRate = total_rows_read > 0 ? ((total_created + total_updated) / total_rows_read) * 100 : 0;
    const errorRate = total_rows_read > 0 ? (total_invalid / total_rows_read) * 100 : 0;
    const duplicateRate = total_rows_read > 0 ? (total_duplicate_in_file / total_rows_read) * 100 : 0;

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
            {success && (
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
                    ✓ Files processed successfully
                </Alert>
            )}

            {/* Summary Cards Grid */}
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                <Grid item xs={6} sm={3}>
                    <CompactSummaryCard
                        title="Total Rows"
                        value={total_rows_read}
                        icon={InfoIcon}
                        color={COLORS.primary}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <CompactSummaryCard
                        title="Created"
                        value={total_created}
                        icon={CheckCircleIcon}
                        color={COLORS.success}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <CompactSummaryCard
                        title="Updated"
                        value={total_updated}
                        icon={TrendingUpIcon}
                        color={COLORS.primary}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <CompactSummaryCard
                        title="Invalid"
                        value={total_invalid}
                        icon={ErrorIcon}
                        color={COLORS.error}
                    />
                </Grid>
            </Grid>

            {/* Additional Cards */}
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                <Grid item xs={6} sm={4}>
                    <CompactSummaryCard
                        title="Duplicates"
                        value={total_duplicate_in_file}
                        icon={WarningIcon}
                        color={COLORS.warning}
                    />
                </Grid>
                <Grid item xs={6} sm={4}>
                    <CompactSummaryCard
                        title="Files"
                        value={total_files}
                        icon={InfoIcon}
                        color={COLORS.info}
                    />
                </Grid>
                <Grid item xs={6} sm={4}>
                    <CompactSummaryCard
                        title="Success Rate"
                        value={`${successRate.toFixed(1)}%`}
                        icon={CheckCircleIcon}
                        color={COLORS.success}
                    />
                </Grid>
            </Grid>

            {/* Info Alerts */}
            {(total_invalid > 0 || total_duplicate_in_file > 0) && (
                <Box sx={{ mb: 2 }}>
                    {total_invalid > 0 && (
                        <Alert
                            severity="warning"
                            sx={{
                                fontSize: "11px",
                                background: `${COLORS.error}15`,
                                border: `1px solid ${COLORS.error}`,
                                color: COLORS.error,
                                mb: 1,
                                py: 0.8,
                            }}
                        >
                            ⚠ {total_invalid.toLocaleString()} invalid records found ({errorRate.toFixed(1)}%)
                        </Alert>
                    )}
                    {total_duplicate_in_file > 0 && (
                        <Alert
                            severity="warning"
                            sx={{
                                fontSize: "11px",
                                background: `${COLORS.warning}15`,
                                border: `1px solid ${COLORS.warning}`,
                                color: "#000",
                                py: 0.8,
                            }}
                        >
                            ⚠ {total_duplicate_in_file.toLocaleString()} duplicate records found ({duplicateRate.toFixed(1)}%)
                        </Alert>
                    )}
                </Box>
            )}

            {/* Summary Table */}
            <Paper
                sx={{
                    mt: 2,
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.borderColor}`,
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        background: COLORS.headerGradient,
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                    }}
                >
                    <DnsIcon sx={{ color: "#fff", fontSize: 16 }} />
                    <Typography
                        sx={{
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "11px",
                            textTransform: "uppercase",
                            letterSpacing: 0.3,
                        }}
                    >
                        Processing Summary
                    </Typography>
                </Box>
                <TableContainer sx={{ maxHeight: "250px" }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ background: COLORS.primary }}>
                                <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>Metric</TableCell>
                                <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>Count</TableCell>
                                <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>Percentage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow sx={{ background: "#fff", "&:hover": { background: COLORS.lightBg } }}>
                                <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Total Rows</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.primary, py: 0.6 }}>
                                    {total_rows_read.toLocaleString()}
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>100%</TableCell>
                            </TableRow>
                            <TableRow sx={{ background: COLORS.lightBg, "&:hover": { background: "#f0f0f0" } }}>
                                <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Created</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.success, py: 0.6 }}>
                                    {total_created.toLocaleString()}
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>
                                    {total_rows_read > 0 ? ((total_created / total_rows_read) * 100).toFixed(2) : 0}%
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{ background: "#fff", "&:hover": { background: COLORS.lightBg } }}>
                                <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Updated</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.primary, py: 0.6 }}>
                                    {total_updated.toLocaleString()}
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>
                                    {total_rows_read > 0 ? ((total_updated / total_rows_read) * 100).toFixed(2) : 0}%
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{ background: COLORS.lightBg, "&:hover": { background: "#f0f0f0" } }}>
                                <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Invalid</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.error, py: 0.6 }}>
                                    {total_invalid.toLocaleString()}
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>
                                    {total_rows_read > 0 ? ((total_invalid / total_rows_read) * 100).toFixed(2) : 0}%
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{ background: "#fff", "&:hover": { background: COLORS.lightBg } }}>
                                <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Duplicates</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.warning, py: 0.6 }}>
                                    {total_duplicate_in_file.toLocaleString()}
                                </TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>
                                    {total_rows_read > 0 ? ((total_duplicate_in_file / total_rows_read) * 100).toFixed(2) : 0}%
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

/* ================================================================ */
/*  Main Component                                                  */
/* ================================================================ */
const MobinateDumpStore = () => {
    const [circleFiles, setCircleFiles] = useState([]);
    const [showCircleError, setShowCircleError] = useState(false);
    const [download, setDownload] = useState(false);
    const [resultData, setResultData] = useState(null);
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    const handleCircleFileSelection = (event) => {
        setCircleFiles(event.target.files);
        setShowCircleError(false);
    };

    const handleSubmit = async () => {
        if (circleFiles.length === 0) {
            setShowCircleError(true);
            return;
        }

        try {
            action(true);
            const formData = new FormData();

            for (let i = 0; i < circleFiles.length; i++) {
                formData.append("files", circleFiles[i]);
            }

            const response = await postData("mobinate_vs_cats/mobinet_data_stor/", formData);

            if (response && response.success === true) {
                setDownload(true);
                setResultData(response);

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Files processed successfully",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response?.message || "An error occurred",
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
        setShowCircleError(false);
        setDownload(false);
        setResultData(null);
    };

    useEffect(() => {
        document.title = "Mobinet Dump Store";
    }, []);

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
                    <Link underline="hover" onClick={() => navigate("/tools/mobinet_vs_cats")} sx={{ cursor: "pointer" }}>
                        Mobinate Vs AWS
                    </Link>
                    <Typography color="text.primary">Mobinet Dump Store</Typography>
                </Breadcrumbs>
            </div>

            <Slide direction="left" in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Mobinet Dump Store</Box>

                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction="column">
                                {/* File Upload Section */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Mobinet Circle Files:-
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
                                                    accept=".csv,.xlsx,.xls,.xlsb"
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
                                    disabled={circleFiles.length === 0}
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

                            {/* Result Display - Compact and Nested */}
                            {download && <MobinateDumpResult data={resultData} />}
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default MobinateDumpStore;


// import React, { useState, useEffect } from "react";
// import { Box, Button, Stack, Card, CardContent, Grid, Typography, Chip, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
// import { Breadcrumbs, Link } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import { useNavigate } from "react-router-dom";
// import Slide from '@mui/material/Slide';
// import UploadIcon from '@mui/icons-material/Upload';
// import DoDisturbIcon from '@mui/icons-material/DoDisturb';
// import Swal from "sweetalert2";
// import { postData } from "../../../services/FetchNodeServices";
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import DnsIcon from '@mui/icons-material/Dns';
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import WarningIcon from '@mui/icons-material/Warning';
// import InfoIcon from '@mui/icons-material/Info';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// const COLORS = {
//     primary: "#006e74",
//     primaryDark: "#00494d",
//     success: "#28a745",
//     warning: "#ffc107",
//     error: "#dc3545",
//     info: "#17a2b8",
//     lightBg: "#f8f9fa",
//     borderColor: "#c9dcdc",
//     headerGradient: "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)",
// };

// /* ================================================================ */
// /*  Summary Card Component                                          */
// /* ================================================================ */
// const SummaryCard = ({ title, value, subtitle, icon: Icon, color = COLORS.primary }) => {
//     return (
//         <Card
//             sx={{
//                 background: "#fff",
//                 border: `1px solid ${COLORS.borderColor}`,
//                 borderRadius: 2,
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//                 transition: "all 0.3s ease",
//                 "&:hover": {
//                     boxShadow: "0 8px 24px rgba(0,107,106,0.15)",
//                     transform: "translateY(-4px)",
//                 },
//                 overflow: "hidden",
//             }}
//         >
//             <Box sx={{ height: 3, background: COLORS.headerGradient }} />
//             <CardContent sx={{ p: 2 }}>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                     <Box>
//                         <Typography
//                             variant="caption"
//                             sx={{
//                                 fontSize: "12px",
//                                 color: "#666",
//                                 fontWeight: 600,
//                                 textTransform: "uppercase",
//                                 letterSpacing: 0.5,
//                                 display: "block",
//                                 mb: 1,
//                             }}
//                         >
//                             {title}
//                         </Typography>
//                         <Typography
//                             variant="h5"
//                             sx={{
//                                 fontSize: "32px",
//                                 fontWeight: 800,
//                                 color: color,
//                                 mb: 0.5,
//                             }}
//                         >
//                             {typeof value === "number" ? value.toLocaleString() : value}
//                         </Typography>
//                         {subtitle && (
//                             <Typography variant="caption" sx={{ color: "#999", fontSize: "11px" }}>
//                                 {subtitle}
//                             </Typography>
//                         )}
//                     </Box>
//                     {Icon && (
//                         <Box
//                             sx={{
//                                 width: 50,
//                                 height: 50,
//                                 borderRadius: "12px",
//                                 background: `${color}15`,
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                             }}
//                         >
//                             <Icon sx={{ color: color, fontSize: 24 }} />
//                         </Box>
//                     )}
//                 </Box>
//             </CardContent>
//         </Card>
//     );
// };

// /* ================================================================ */
// /*  Result Display Component                                        */
// /* ================================================================ */
// const MobinateDumpResult = ({ data, downloadUrl }) => {
//     if (!data) return null;

//     const {
//         status,
//         message,
//         total_rows = 0,
//         created_rows = 0,
//         updated_rows = 0,
//         blank_row_count = 0,
//         blank_rows_not_uploaded = "",
//         Same_file_duplicate_count = "",
//     } = data;

//     const handleDownload = () => {
//         if (downloadUrl) {
//             window.open(downloadUrl, "_blank");
//         }
//     };

//     return (
//         <Box sx={{ mt: 4 }}>
//             {/* Status Alert */}
//             {status && (
//                 <Alert
//                     icon={<CheckCircleIcon />}
//                     severity="success"
//                     sx={{
//                         background: `${COLORS.success}15`,
//                         border: `1px solid ${COLORS.success}`,
//                         color: COLORS.success,
//                         fontWeight: 600,
//                         fontSize: "13px",
//                         mb: 3,
//                     }}
//                 >
//                     <strong>Success!</strong> {message}
//                 </Alert>
//             )}

//             {/* Summary Cards */}
//             <Grid container spacing={2} sx={{ mb: 3 }}>
//                 <Grid item xs={12} sm={6} md={3}>
//                     <SummaryCard
//                         title="Total Rows"
//                         value={total_rows}
//                         subtitle="Processed"
//                         icon={InfoIcon}
//                         color={COLORS.primary}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={6} md={3}>
//                     <SummaryCard
//                         title="Created Rows"
//                         value={created_rows}
//                         subtitle="New records"
//                         icon={CheckCircleIcon}
//                         color={COLORS.success}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={6} md={3}>
//                     <SummaryCard
//                         title="Updated Rows"
//                         value={updated_rows}
//                         subtitle="Existing records"
//                         icon={TrendingUpIcon}
//                         color={COLORS.primary}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={6} md={3}>
//                     <SummaryCard
//                         title="Blank Rows"
//                         value={blank_row_count}
//                         subtitle="Not uploaded"
//                         icon={WarningIcon}
//                         color={COLORS.warning}
//                     />
//                 </Grid>
//             </Grid>

//             {/* Info Alerts */}
//             <Stack spacing={2} sx={{ mb: 3 }}>
//                 {blank_rows_not_uploaded && (
//                     <Alert
//                         severity="info"
//                         icon={<InfoIcon />}
//                         sx={{
//                             background: `${COLORS.info}15`,
//                             border: `1px solid ${COLORS.info}`,
//                             color: COLORS.info,
//                         }}
//                     >
//                         {blank_rows_not_uploaded}
//                     </Alert>
//                 )}
//                 {Same_file_duplicate_count && (
//                     <Alert
//                         severity="info"
//                         icon={<InfoIcon />}
//                         sx={{
//                             background: `${COLORS.info}15`,
//                             border: `1px solid ${COLORS.info}`,
//                             color: COLORS.info,
//                         }}
//                     >
//                         {Same_file_duplicate_count}
//                     </Alert>
//                 )}
//             </Stack>

//             {/* Download Button */}
//             {downloadUrl && (
//                 <Box sx={{ textAlign: "center", mb: 3 }}>
//                     <Button
//                         variant="contained"
//                         startIcon={<FileDownloadIcon />}
//                         onClick={handleDownload}
//                         sx={{
//                             background: COLORS.primary,
//                             color: "#fff",
//                             fontWeight: 700,
//                             textTransform: "none",
//                             fontSize: "15px",
//                             px: 4,
//                             py: 1.5,
//                             borderRadius: 1,
//                             "&:hover": { background: COLORS.primaryDark },
//                         }}
//                     >
//                         Download Mobinate Dump Report
//                     </Button>
//                 </Box>
//             )}

//             {/* Summary Table */}
//             <Paper
//                 sx={{
//                     mt: 3,
//                     borderRadius: 2,
//                     border: `1px solid ${COLORS.borderColor}`,
//                     overflow: "hidden",
//                 }}
//             >
//                 <Box
//                     sx={{
//                         background: COLORS.headerGradient,
//                         p: 2,
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                     }}
//                 >
//                     <DnsIcon sx={{ color: "#fff", fontSize: 20 }} />
//                     <Typography
//                         sx={{
//                             color: "#fff",
//                             fontWeight: 700,
//                             fontSize: "14px",
//                             textTransform: "uppercase",
//                         }}
//                     >
//                         Processing Summary
//                     </Typography>
//                 </Box>
//                 <TableContainer>
//                     <Table size="small">
//                         <TableHead>
//                             <TableRow sx={{ background: COLORS.primary }}>
//                                 <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>Metric</TableCell>
//                                 <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>Count</TableCell>
//                                 <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>Percentage</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             <TableRow sx={{ "&:hover": { background: COLORS.lightBg } }}>
//                                 <TableCell sx={{ fontSize: "12px", fontWeight: 600 }}>Total Rows</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "12px", fontWeight: 700, color: COLORS.primary }}>
//                                     {total_rows.toLocaleString()}
//                                 </TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "12px" }}>100%</TableCell>
//                             </TableRow>
//                             <TableRow sx={{ "&:hover": { background: COLORS.lightBg } }}>
//                                 <TableCell sx={{ fontSize: "12px", fontWeight: 600 }}>Created Rows</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "12px", fontWeight: 700, color: COLORS.success }}>
//                                     {created_rows.toLocaleString()}
//                                 </TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "12px" }}>
//                                     {((created_rows / total_rows) * 100).toFixed(2)}%
//                                 </TableCell>
//                             </TableRow>
//                             <TableRow sx={{ "&:hover": { background: COLORS.lightBg } }}>
//                                 <TableCell sx={{ fontSize: "12px", fontWeight: 600 }}>Updated Rows</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "12px", fontWeight: 700, color: COLORS.primary }}>
//                                     {updated_rows.toLocaleString()}
//                                 </TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "12px" }}>
//                                     {((updated_rows / total_rows) * 100).toFixed(2)}%
//                                 </TableCell>
//                             </TableRow>
//                             <TableRow sx={{ "&:hover": { background: COLORS.lightBg } }}>
//                                 <TableCell sx={{ fontSize: "12px", fontWeight: 600 }}>Blank Rows</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "12px", fontWeight: 700, color: COLORS.warning }}>
//                                     {blank_row_count.toLocaleString()}
//                                 </TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "12px" }}>
//                                     {((blank_row_count / total_rows) * 100).toFixed(2)}%
//                                 </TableCell>
//                             </TableRow>
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Paper>
//         </Box>
//     );
// };

// /* ================================================================ */
// /*  Main Component                                                  */
// /* ================================================================ */
// const MobinateDumpStore = () => {
//     const [circleFiles, setCircleFiles] = useState([]);
//     const [showCircleError, setShowCircleError] = useState(false);
//     const [download, setDownload] = useState(false);
//     const [resultData, setResultData] = useState(null);
//     const [downloadUrl, setDownloadUrl] = useState(null);
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();
//     const classes = OverAllCss();

//     const handleCircleFileSelection = (event) => {
//         setCircleFiles(event.target.files);
//         setShowCircleError(false);
//     };

//     const handleSubmit = async () => {
//         if (circleFiles.length === 0) {
//             setShowCircleError(true);
//             return;
//         }

//         try {
//             action(true);
//             const formData = new FormData();

//             for (let i = 0; i < circleFiles.length; i++) {
//                 formData.append("files", circleFiles[i]);
//             }

//             const response = await postData("mobinate_vs_cats/mobinet_data_stor/", formData);

//             if (response && response.status === true) {
//                 setDownload(true);
//                 setResultData(response);
//                 setDownloadUrl(response.download_url || null);

//                 Swal.fire({
//                     icon: "success",
//                     title: "Success",
//                     text: response.message || "Reports processed successfully",
//                 });
//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: response?.message || "An error occurred",
//                 });
//             }
//         } catch (error) {
//             console.error("Submit error:", error);
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: error.message || "Failed to submit files",
//             });
//         } finally {
//             action(false);
//         }
//     };

//     const handleCancel = () => {
//         setCircleFiles([]);
//         setShowCircleError(false);
//         setDownload(false);
//         setResultData(null);
//         setDownloadUrl(null);
//     };

//     useEffect(() => {
//         document.title = "Mobinet Dump Store";
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
//                     <Link underline="hover" onClick={() => navigate("/tools")} sx={{ cursor: "pointer" }}>
//                         Tools
//                     </Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/mobinet_vs_cats")} sx={{ cursor: "pointer" }}>
//                         Mobinate Vs AWS
//                     </Link>
//                     <Typography color="text.primary">Mobinet Dump Store</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Slide direction="left" in={true} timeout={1000}>
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
//                             <Box className={classes.Box_Hading}>Mobinet Dump Store</Box>

//                             <Stack spacing={2} sx={{ marginTop: "-40px" }} direction="column">
//                                 {/* File Upload Section */}
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>
//                                         Select Mobinet Circle Files:-
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
//                                             <span style={{ color: "green", fontSize: "18px", fontWeight: 600 }}>
//                                                 Selected File(s): {circleFiles.length}
//                                             </span>
//                                         )}

//                                         {showCircleError && (
//                                             <span style={{ color: "red", fontSize: "18px", fontWeight: 600 }}>
//                                                 This Field Is Required!
//                                             </span>
//                                         )}
//                                     </div>
//                                 </Box>
//                             </Stack>

//                             {/* Action Buttons */}
//                             <Stack
//                                 direction={{ xs: "column", sm: "column", md: "row" }}
//                                 spacing={2}
//                                 style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}
//                             >
//                                 <Button
//                                     variant="contained"
//                                     color="success"
//                                     onClick={handleSubmit}
//                                     endIcon={<UploadIcon />}
//                                     disabled={circleFiles.length === 0}
//                                 >
//                                     Submit
//                                 </Button>

//                                 <Button
//                                     variant="contained"
//                                     onClick={handleCancel}
//                                     style={{ backgroundColor: "red", color: "white" }}
//                                     endIcon={<DoDisturbIcon />}
//                                 >
//                                     Cancel
//                                 </Button>
//                             </Stack>
//                         </Box>
//                     </Box>

//                     {/* Result Display */}
//                     {download && <MobinateDumpResult data={resultData} downloadUrl={downloadUrl} />}
//                 </Box>
//             </Slide>

//             {loading}
//         </>
//     );
// };

// export default MobinateDumpStore;