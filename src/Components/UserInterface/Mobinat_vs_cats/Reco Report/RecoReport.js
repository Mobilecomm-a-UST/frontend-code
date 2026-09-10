import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Card, CardContent, Grid, Typography, Chip, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Breadcrumbs, Link } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import { postDataa } from "../../../services/FetchNodeServices";
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
/*  Compact Result Display Component                                */
/* ================================================================ */
const RecoReportResult = ({ data, downloadUrl }) => {
    if (!data) return null;

    const {
        status,
        message,
        total_rows = 0,
        created_rows = 0,
        updated_rows = 0,
        blank_row_count = 0,
        blank_rows_not_uploaded = "",
        same_file_duplicate_count = "",
    } = data;

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
                        title="Created Rows"
                        value={created_rows}
                        icon={CheckCircleIcon}
                        color={COLORS.success}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <CompactSummaryCard
                        title="Updated Rows"
                        value={updated_rows}
                        icon={TrendingUpIcon}
                        color={COLORS.primary}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <CompactSummaryCard
                        title="Blank Rows"
                        value={blank_row_count}
                        icon={WarningIcon}
                        color={COLORS.warning}
                    />
                </Grid>
            </Grid>

            {/* Info Messages */}
            {(blank_rows_not_uploaded || same_file_duplicate_count) && (
                <Box sx={{ mb: 2 }}>
                    {blank_rows_not_uploaded && (
                        <Typography
                            sx={{
                                fontSize: "11px",
                                color: COLORS.warning,
                                fontWeight: 700,
                                mb: 0.5,
                                p: 1,
                                background: `${COLORS.warning}15`,
                                borderRadius: 1,
                                borderLeft: `3px solid ${COLORS.warning}`,
                            }}
                        >
                            ⚠ {blank_rows_not_uploaded}
                        </Typography>
                    )}
                    {same_file_duplicate_count && (
                        <Typography
                            sx={{
                                fontSize: "11px",
                                color: COLORS.info,
                                fontWeight: 600,
                                p: 1,
                                background: `${COLORS.info}15`,
                                borderRadius: 1,
                                borderLeft: `3px solid ${COLORS.info}`,
                            }}
                        >
                            ℹ {same_file_duplicate_count}
                        </Typography>
                    )}
                </Box>
            )}

            {/* Download & Summary Table */}
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
                {/* Download Button */}
                {downloadUrl && (
                    <Button
                        variant="contained"
                        startIcon={<FileDownloadIcon sx={{ fontSize: "16px" }} />}
                        onClick={handleDownload}
                        size="small"
                        sx={{
                            background: COLORS.primary,
                            color: "#fff",
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: "12px",
                            px: 2,
                            py: 0.8,
                            borderRadius: 1,
                            "&:hover": { background: COLORS.primaryDark },
                            whiteSpace: "nowrap",
                        }}
                    >
                        Download Report
                    </Button>
                )}

                {/* Compact Summary Table */}
                <Paper
                    sx={{
                        flex: 1,
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
                    <TableContainer sx={{ maxHeight: "200px" }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ background: COLORS.primary }}>
                                    <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>Metric</TableCell>
                                    <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>Count</TableCell>
                                    <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>%</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow sx={{ background: "#fff", "&:hover": { background: COLORS.lightBg } }}>
                                    <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Total Rows</TableCell>
                                    <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.primary, py: 0.6 }}>
                                        {total_rows}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>100%</TableCell>
                                </TableRow>
                                <TableRow sx={{ background: COLORS.lightBg, "&:hover": { background: "#f0f0f0" } }}>
                                    <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Created Rows</TableCell>
                                    <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.success, py: 0.6 }}>
                                        {created_rows}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>
                                        {total_rows > 0 ? ((created_rows / total_rows) * 100).toFixed(1) : 0}%
                                    </TableCell>
                                </TableRow>
                                <TableRow sx={{ background: "#fff", "&:hover": { background: COLORS.lightBg } }}>
                                    <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Updated Rows</TableCell>
                                    <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.primary, py: 0.6 }}>
                                        {updated_rows}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>
                                        {total_rows > 0 ? ((updated_rows / total_rows) * 100).toFixed(1) : 0}%
                                    </TableCell>
                                </TableRow>
                                <TableRow sx={{ background: COLORS.lightBg, "&:hover": { background: "#f0f0f0" } }}>
                                    <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Blank Rows</TableCell>
                                    <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.warning, py: 0.6 }}>
                                        {blank_row_count}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>
                                        {total_rows > 0 ? ((blank_row_count / total_rows) * 100).toFixed(1) : 0}%
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Box>
    );
};

/* ================================================================ */
/*  Main Component                                                  */
/* ================================================================ */
const RecoReport = () => {
    const [circleFiles, setCircleFiles] = useState([]);
    const [showCircleError, setShowCircleError] = useState(false);
    const [download, setDownload] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);
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
                formData.append("file", circleFiles[i]);
            }

            const response = await postDataa("mobinate_vs_cats/upload_reco_report/", formData);

            if (response && response.status === true) {
                setDownload(true);
                setResultData(response);
                setDownloadUrl(response.download_url || null);

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.message || "Reports processed successfully",
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
        setDownloadUrl(null);
    };

    useEffect(() => {
        document.title = "Reco DB";
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
                    <Link underline="hover" onClick={() => navigate("/tools/material_management")} sx={{ cursor: "pointer" }}>
                        Material Management
                    </Link>
                    <Typography color="text.primary">Reco DB</Typography>
                </Breadcrumbs>
            </div>

            <Slide direction="left" in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Reco DB</Box>

                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction="column">
                                {/* File Upload Section */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Reco DB Files:-
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
                            {download && <RecoReportResult data={resultData} downloadUrl={downloadUrl} />}
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default RecoReport;