import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Stack,
    Card,
    CardContent,
    Grid,
    Typography,
    Alert,
    Paper,
    Breadcrumbs,
    Link,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Divider,
    Tooltip,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import Slide from "@mui/material/Slide";
import UploadIcon from "@mui/icons-material/Upload";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Swal from "sweetalert2";
import { postData } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

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
/*  Result Card Component                                           */
/* ================================================================ */
const ResultCard = ({ title, value, icon: Icon, color = COLORS.primary }) => {
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
                        fontSize: "16px",
                        fontWeight: 700,
                        color: color,
                        wordBreak: "break-word",
                    }}
                    title={value}
                >
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
};

/* ================================================================ */
/*  Upload Result Display Component - Handles multiple files        */
/* ================================================================ */
const ScriptingToolResult = ({ data, onDownload }) => {
    if (!data) return null;

    const { status, message, download_url } = data;

    // ✅ Handle download_url as array or single URL
    const downloadUrls = Array.isArray(download_url) ? download_url : (download_url ? [download_url] : []);

    // Extract filename from URL
    const fileNameFromUrl = (url) => {
        try {
            return decodeURIComponent(url.split("/").filter(Boolean).pop() || url);
        } catch {
            return url;
        }
    };

    // Download all files
    const handleDownloadAll = () => {
        downloadUrls.forEach((url) => {
            onDownload(url);
        });
    };

    return (
        <Box
            sx={{
                mt: 3,
                p: 2.5,
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
                        fontSize: "13px",
                        mb: 2.5,
                        py: 1.2,
                        px: 1.5,
                    }}
                >
                    ✓ {message}
                </Alert>
            )}

            {!status && (
                <Alert
                    icon={<ErrorIcon sx={{ fontSize: "18px" }} />}
                    severity="error"
                    sx={{
                        background: `${COLORS.error}15`,
                        border: `1px solid ${COLORS.error}`,
                        color: COLORS.error,
                        fontWeight: 600,
                        fontSize: "13px",
                        mb: 2.5,
                        py: 1.2,
                        px: 1.5,
                    }}
                >
                    ✗ {message}
                </Alert>
            )}

            {/* Result Cards */}
            <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={6}>
                    <ResultCard
                        title="Status"
                        value={status ? "Success" : "Failed"}
                        icon={status ? CheckCircleIcon : ErrorIcon}
                        color={status ? COLORS.success : COLORS.error}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ResultCard
                        title="Message"
                        value={message}
                        icon={InfoIcon}
                        color={COLORS.info}
                    />
                </Grid>
            </Grid>

            {/* ✅ Download Section - Handle multiple files (2, 4, 5, any number) */}
            {status && downloadUrls.length > 0 && (
                <Box
                    sx={{
                        mt: 2.5,
                        p: 2,
                        background: "#fff",
                        border: `1px solid ${COLORS.borderColor}`,
                        borderRadius: 1.5,
                    }}
                >
                    {/* Download All Button (when multiple files) */}
                    {downloadUrls.length > 1 && (
                        <Box sx={{ mb: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<DownloadForOfflineIcon sx={{ fontSize: "18px" }} />}
                                onClick={handleDownloadAll}
                                sx={{
                                    background: COLORS.primary,
                                    color: "#fff",
                                    fontWeight: 700,
                                    textTransform: "none",
                                    fontSize: "13px",
                                    px: 2.5,
                                    py: 1,
                                    borderRadius: 1,
                                    "&:hover": { background: COLORS.primaryDark }
                                }}
                            >
                                Download All Files ({downloadUrls.length})
                            </Button>
                        </Box>
                    )}

                    {/* Individual Files List */}
                    <Stack spacing={1}>
                        {downloadUrls.map((url, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    p: 1.5,
                                    background: COLORS.lightBg,
                                    borderRadius: 1,
                                    border: `1px solid ${COLORS.borderColor}`,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <InsertDriveFileIcon sx={{ color: COLORS.primary, fontSize: 24 }} />
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 700, color: COLORS.primary, fontSize: "13px" }}
                                        >
                                            Generated File {downloadUrls.length > 1 ? `${idx + 1}` : ""}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#666", fontSize: "11px" }}>
                                            {fileNameFromUrl(url)}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Tooltip title="Download file">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<FileDownloadIcon />}
                                        onClick={() => onDownload(url)}
                                        sx={{
                                            background: COLORS.headerGradient,
                                            color: "#fff",
                                            fontWeight: 700,
                                            textTransform: "none",
                                            whiteSpace: "nowrap",
                                            "&:hover": {
                                                background: "linear-gradient(90deg, #003a3e 0%, #005555 55%, #3a8b91 100%)",
                                            },
                                        }}
                                    >
                                        Download
                                    </Button>
                                </Tooltip>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

/* ================================================================ */
/*  Main 5G Scripting Tool Component - UPDATED (XML REMOVED)        */
/* ================================================================ */
const UPE_Scripting = () => {
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();
    const classes = OverAllCss();

    // ✅ STATE MANAGEMENT - XML REMOVED
    const [excelFiles, setExcelFiles] = useState([]);
    const [bandwidth, setBandwidth] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadResultData, setUploadResultData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // ✅ Bandwidth options
    const BANDWIDTH_OPTIONS = ["5Mhz", "3Mhz"];

    // ======== EXCEL FILE HANDLER ========
    const handleExcelFileChange = (event) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) {
            return;
        }

        // Validate all selected files
        const invalidFiles = files.filter((file) => {
            const fileName = file.name.toLowerCase();
            return !fileName.endsWith(".xlsx") && !fileName.endsWith(".xls");
        });

        if (invalidFiles.length > 0) {
            Swal.fire({
                icon: "error",
                title: "Invalid File",
                text: "Please select only valid Excel files (.xlsx or .xls)",
            });

            event.target.value = "";
            return;
        }

        // Store all Excel files
        setExcelFiles(files);
    };

    // ======== SUBMIT HANDLER ========
    const handleSubmit = async () => {
        // VALIDATION - Only Bandwidth is mandatory
        if (!bandwidth) {
            Swal.fire({
                icon: "warning",
                title: "Required",
                text: "Please select Bandwidth",
            });
            return;
        }

        try {
            setIsProcessing(true);
            action(true);

            const formData = new FormData();

            // ✅ Append bandwidth (mandatory)
            formData.append("bandwidth", bandwidth);

            // ✅ Append all Excel files if they exist (optional)
            if (excelFiles.length > 0) {
                excelFiles.forEach((file) => {
                    formData.append("excel_file", file);
                });
            }

            // ✅ Updated API endpoint
            const response = await postData("vi_ntscrpting/nt/", formData);

            if (response && response.status) {
                setUploadSuccess(true);
                setUploadResultData(response);

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.message || "Configuration created successfully",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response?.message || "Failed to create configuration",
                });
                setUploadResultData(response);
            }
        } catch (error) {
            console.error("Submit error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Failed to process request",
            });
        } finally {
            action(false);
            setIsProcessing(false);
        }
    };

    // ======== CANCEL HANDLER ========
    const handleCancel = () => {
        setExcelFiles([]);
        setBandwidth("");
        setUploadSuccess(false);
        setUploadResultData(null);
    };

    // ======== DOWNLOAD HANDLER - Supports multiple files ========
    const downloadFile = (downloadUrl) => {
        try {
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", "");
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Swal.fire({
                icon: "success",
                title: "Downloaded",
                text: "File downloaded successfully",
            });
        } catch (error) {
            console.error("Download error:", error);
            Swal.fire({
                icon: "error",
                title: "Download Failed",
                text: "Failed to download file",
            });
        }
    };

    useEffect(() => {
        document.title = "5G Scripting Tool";
    }, []);

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    itemsBeforeCollapse={2}
                    maxItems={4}
                    separator={<KeyboardArrowRightIcon fontSize="small" />}
                >
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline='hover' onClick={() => { navigate('/tools/ix_tools') }}>IX Tools</Link>
                    <Typography color='text.primary'>IX VI Scripting</Typography>
                </Breadcrumbs>
            </div>

            <Slide direction="left" in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>VI Scripting Tool</Box>

                            <Stack spacing={2.5} sx={{ marginTop: "10px" }} direction="column">
                                {/* ✅ BANDWIDTH DROPDOWN (First) */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Bandwidth:-
                                    </div>
                                    <Box sx={{ p: 1.5, maxWidth: "400px" }}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel id="bandwidth-label">Bandwidth</InputLabel>
                                            <Select
                                                labelId="bandwidth-label"
                                                label="Bandwidth"
                                                value={bandwidth}
                                                onChange={(e) => setBandwidth(e.target.value)}
                                            >
                                                <MenuItem value="">
                                                    <em>Select Bandwidth</em>
                                                </MenuItem>
                                                {BANDWIDTH_OPTIONS.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>

                                {/* ✅ EXCEL FILE CARD (Second) - Optional */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Excel File:-
                                    </div>

                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                color={excelFiles.length > 0 ? "warning" : "primary"}
                                                startIcon={<UploadIcon />}
                                            >
                                                {excelFiles.length > 0
                                                    ? "Change Excel Files"
                                                    : "Select Excel Files"}

                                                <input
                                                    hidden
                                                    multiple
                                                    accept=".xlsx,.xls,.xlsb"
                                                    type="file"
                                                    onChange={handleExcelFileChange}
                                                />
                                            </Button>
                                        </div>

                                        {/* Selected Excel file count */}
                                        {excelFiles.length > 0 && (
                                            <span
                                                style={{
                                                    color: "green",
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    marginLeft: "12px",
                                                }}
                                            >
                                                ✓ {excelFiles.length} Excel file
                                                {excelFiles.length > 1 ? "s" : ""} selected
                                            </span>
                                        )}
                                    </div>
                                </Box>

                                {/* ACTION BUTTONS */}
                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={2}
                                    sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}
                                >
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleSubmit}
                                        endIcon={<UploadIcon />}
                                        disabled={isProcessing || !bandwidth}
                                        sx={{ minWidth: "120px" }}
                                    >
                                        {isProcessing ? (
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <CircularProgress size={16} sx={{ color: "#fff" }} />
                                                <span>Processing...</span>
                                            </Box>
                                        ) : (
                                            "Submit"
                                        )}
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={handleCancel}
                                        style={{ backgroundColor: COLORS.error, color: "white" }}
                                        endIcon={<DoDisturbIcon />}
                                        disabled={isProcessing}
                                        sx={{ minWidth: "120px" }}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>

                                {/* ✅ RESULT DISPLAY - Handles multiple file downloads (2, 4, 5, any number) */}
                                {uploadSuccess && (
                                    <ScriptingToolResult data={uploadResultData} onDownload={downloadFile} />
                                )}
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default UPE_Scripting;