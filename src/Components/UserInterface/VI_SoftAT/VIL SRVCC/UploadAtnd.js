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
import ClearIcon from "@mui/icons-material/Clear";

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
/*  File Item Component - Display selected files                    */
/* ================================================================ */
const FileItem = ({ file, onRemove, isLoading }) => {
    const getFileIcon = (fileName) => {
        const ext = fileName.split(".").pop().toLowerCase();
        if (["xlsx", "xls", "xlsb"].includes(ext)) {
            return "📊";
        }
        return "📄";
    };

    return (
        <Paper
            elevation={1}
            sx={{
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 1,
                border: `1px solid ${COLORS.borderColor}`,
                backgroundColor: "#ffffff",
                transition: "all 0.2s ease",
                "&:hover": {
                    boxShadow: 2,
                    borderColor: COLORS.primary,
                },
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
                <InsertDriveFileIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                        sx={{
                            fontWeight: 600,
                            color: COLORS.primaryDark,
                            fontSize: "13px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                        title={file.name}
                    >
                        {getFileIcon(file.name)} {file.name}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#999",
                            fontSize: "11px",
                        }}
                    >
                        {(file.size / 1024).toFixed(2)} KB
                    </Typography>
                </Box>
            </Box>

            <Button
                size="small"
                onClick={() => onRemove(file.name)}
                disabled={isLoading}
                sx={{
                    minWidth: "auto",
                    padding: "4px 8px",
                    color: COLORS.error,
                    "&:hover": {
                        backgroundColor: "#ffebee",
                    },
                }}
            >
                <ClearIcon fontSize="small" />
            </Button>
        </Paper>
    );
};

/* ================================================================ */
/*  Upload Result Display Component                                 */
/* ================================================================ */
const ScriptingToolResult = ({ data, onDownload, onDownloadAll, downloadFiles }) => {
    if (!data) return null;

    const { status, message } = data;

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

            {/* Download All Button */}
            {status && downloadFiles && downloadFiles.length > 0 && (
                <Box sx={{ mb: 2.5, textAlign: "center" }}>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<FileDownloadIcon />}
                        onClick={onDownloadAll}
                        sx={{
                            background: COLORS.headerGradient,
                            color: "#fff",
                            fontWeight: 700,
                            textTransform: "none",
                            px: 3,
                        }}
                    >
                        Download All Files ({downloadFiles.length})
                    </Button>
                </Box>
            )}

            {/* Individual Files List */}
            {status && downloadFiles && downloadFiles.length > 0 && (
                <Box>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 700,
                            color: COLORS.primary,
                            mb: 1.5,
                            fontSize: "13px",
                        }}
                    >
                        📥 Generated Files
                    </Typography>
                    <Stack spacing={1}>
                        {downloadFiles.map((file, index) => (
                            <Paper
                                key={index}
                                sx={{
                                    p: 1.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    borderRadius: 1,
                                    border: `1px solid ${COLORS.borderColor}`,
                                    backgroundColor: "#fff",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        boxShadow: 2,
                                        borderColor: COLORS.primary,
                                    },
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
                                    <InsertDriveFileIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                color: COLORS.primaryDark,
                                                fontSize: "13px",
                                            }}
                                        >
                                            {file.name}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "#666",
                                                fontSize: "11px",
                                            }}
                                        >
                                            {file.path}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Tooltip title={`Download ${file.name}`}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<FileDownloadIcon />}
                                        onClick={() => onDownload(file.url, file.name)}
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
                            </Paper>
                        ))}
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

/* ================================================================ */
/*  Main 5G Scripting Tool Component                                */
/* ================================================================ */
const FiveGScriptingTool = () => {
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();
    const classes = OverAllCss();

    // STATE MANAGEMENT
    const [inputFiles, setInputFiles] = useState([]);
    const [showFileError, setShowFileError] = useState(false);
    const [hwTypeSmod, setHwTypeSmod] = useState("");
    const [hwTypeBbmod, setHwTypeBbmod] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadResultData, setUploadResultData] = useState(null);
    const [downloadFiles, setDownloadFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // DROPDOWN OPTIONS
    const SMOD_OPTIONS = ["ASIA", "ASIB", "ASIM", ""];
    const BBMOD_OPTIONS = ["ABIP", "ABIO", "ABIA", ""];

    // ======== FILE HANDLER ========
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) {
            return;
        }

        const invalidFiles = files.filter((file) => {
            const fileName = file.name.toLowerCase();
            return !(
                fileName.endsWith(".xlsx") ||
                fileName.endsWith(".xls") ||
                fileName.endsWith(".xlsb") ||
                fileName.endsWith(".txt") ||
                fileName.endsWith(".log") ||
                fileName.endsWith(".logs")
            );
        });

        if (invalidFiles.length > 0) {
            const invalidNames = invalidFiles.map(f => f.name).join(", ");
            setShowFileError(true);

            Swal.fire({
                icon: "error",
                title: "Invalid File Type",
                text: `The following files are not supported: ${invalidNames}\n\nPlease select only .xlsx, .xls,.xlsb, .txt, .log, or .logs files.`,
                width: 500,
            });

            event.target.value = "";
            return;
        }

        setInputFiles([...inputFiles, ...files]);
        setShowFileError(false);
        event.target.value = "";

        if (files.length > 1) {
            Swal.fire({
                icon: "success",
                title: "Files Added",
                text: `${files.length} file(s) added successfully`,
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    // Remove single file
    const handleRemoveFile = (fileName) => {
        setInputFiles(prevFiles => prevFiles.filter(f => f.name !== fileName));
    };

    // Clear all files
    const handleClearAllFiles = () => {
        Swal.fire({
            title: "Clear All Files?",
            text: "Are you sure you want to remove all selected files?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: COLORS.error,
            cancelButtonColor: "#999",
            confirmButtonText: "Yes, Clear All",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                setInputFiles([]);
                setShowFileError(false);
            }
        });
    };

    // ======== EXTRACT DOWNLOAD FILES FROM RESPONSE ========
    const extractDownloadFiles = (response) => {
        const files = [];

        // Check if download_url exists and is an array
        if (response.download_url && Array.isArray(response.download_url)) {
            response.download_url.forEach((url) => {
                const fileName = url.split("/").pop();

                // FILTER: Only .xlsx, .xls files - NO XML
                if (!fileName.toLowerCase().endsWith(".xml")) {
                    files.push({
                        name: fileName,
                        path: url,
                        url: url, // Use path as-is from server
                    });
                }
            });
        }

        return files;
    };

    // ======== SUBMIT HANDLER ========
    const handleSubmit = async () => {
        if (inputFiles.length === 0) {
            setShowFileError(true);
            Swal.fire({
                icon: "warning",
                title: "No Files Selected",
                text: "Please select at least one file to continue",
            });
            return;
        }

        try {
            setIsProcessing(true);
            action(true);

            const formData = new FormData();

            inputFiles.forEach((file) => {
                formData.append("files", file);
            });

            if (hwTypeSmod) {
                formData.append("hw_type_smod", hwTypeSmod);
            }
            if (hwTypeBbmod) {
                formData.append("hw_type_bbmod", hwTypeBbmod);
            }

            const response = await postData("atnd/mapping/", formData);

            if (response && response.status) {
                // Extract all download files from response
                const allFiles = extractDownloadFiles(response);
                setDownloadFiles(allFiles);
                setUploadSuccess(true);
                setUploadResultData(response);

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.message || "5G configuration created successfully",
                    confirmButtonColor: COLORS.primary,
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
                text: error.message || "Failed to process files",
            });
        } finally {
            action(false);
            setIsProcessing(false);
        }
    };

    // ======== CANCEL HANDLER ========
    const handleCancel = () => {
        if (inputFiles.length > 0) {
            Swal.fire({
                title: "Cancel Upload?",
                text: "All selected files will be cleared",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: COLORS.error,
                cancelButtonColor: "#999",
                confirmButtonText: "Yes, Cancel",
                cancelButtonText: "Keep Files",
            }).then((result) => {
                if (result.isConfirmed) {
                    resetAll();
                }
            });
        } else {
            resetAll();
        }
    };

    const resetAll = () => {
        setInputFiles([]);
        setHwTypeSmod("");
        setHwTypeBbmod("");
        setShowFileError(false);
        setUploadSuccess(false);
        setUploadResultData(null);
        setDownloadFiles([]);
    };

    // ======== SINGLE FILE DOWNLOAD ========
    const downloadFile = (downloadUrl, fileName) => {
        try {
            console.log("Downloading from:", downloadUrl);
            
            // Create anchor element
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = fileName || "download";
            link.style.display = "none";
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);

            // Show success notification
            Swal.fire({
                icon: "success",
                title: "Downloading",
                text: `${fileName} download started`,
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Download error:", error);
            Swal.fire({
                icon: "error",
                title: "Download Failed",
                text: `Failed to download: ${fileName}. URL: ${downloadUrl}`,
                confirmButtonColor: COLORS.primary,
            });
        }
    };

    // ======== DOWNLOAD ALL FILES ========
    const downloadAllFiles = () => {
        if (downloadFiles.length === 0) return;

        downloadFiles.forEach((file, index) => {
            setTimeout(() => {
                downloadFile(file.url, file.name);
            }, index * 500);
        });

        Swal.fire({
            icon: "success",
            title: "Bulk Download Started",
            text: `Downloading ${downloadFiles.length} files...`,
            timer: 2000,
            showConfirmButton: false,
        });
    };

    useEffect(() => {
        document.title = "5G Scripting Tool";
    }, []);

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                                 <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                                 <Link underline="hover" onClick={() => { navigate('/tools/soft_at_tools') }}>VI Soft-AT Tool</Link>
                                 <Typography color='text.primary'>Upload Atnd Addition</Typography>
                             </Breadcrumbs>
            </div>

            <Slide direction="left" in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Create ATND Summary</Box>

                            <Stack spacing={2.5} sx={{ marginTop: "-40px" }} direction="column">
                                {/* ====== FILE INPUT CARD ====== */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Input File(s):-
                                        <span style={{ fontFamily: "Poppins", color: "gray", marginLeft: 20, fontSize: "12px" }}>
                                            (Supports .xlsx, .xls, .xlsb, .txt, .log, .logs)
                                        </span>
                                    </div>

                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left", marginBottom: "10px" }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                color={inputFiles.length > 0 ? "warning" : "primary"}
                                                disabled={isProcessing}
                                                startIcon={<UploadIcon />}
                                                sx={{
                                                    fontWeight: 700,
                                                    textTransform: "uppercase",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                {inputFiles.length > 0 ? "Add More File(s)" : "Select File(s)"}
                                                <input
                                                    hidden
                                                    multiple
                                                    type="file"
                                                    accept=".xlsx,.xls,.xlsb,.txt,.log,.logs"
                                                    onChange={handleFileChange}
                                                    autoComplete="off"
                                                />
                                            </Button>
                                        </div>

                                        {inputFiles.length > 0 && (
                                            <Box
                                                sx={{
                                                    clear: "both",
                                                    mt: 2,
                                                    p: 2,
                                                    backgroundColor: "#f0f8f8",
                                                    borderRadius: 1,
                                                    border: `2px solid ${COLORS.primary}`,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        mb: 1.5,
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            color: COLORS.success,
                                                            fontSize: "16px",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        ✓ Selected File{inputFiles.length > 1 ? "s" : ""} ({inputFiles.length})
                                                    </Typography>
                                                    {inputFiles.length > 0 && (
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            onClick={handleClearAllFiles}
                                                            disabled={isProcessing}
                                                            startIcon={<ClearIcon />}
                                                        >
                                                            Clear All
                                                        </Button>
                                                    )}
                                                </Box>

                                                <Stack spacing={1}>
                                                    {inputFiles.map((file) => (
                                                        <FileItem
                                                            key={file.name}
                                                            file={file}
                                                            onRemove={handleRemoveFile}
                                                            isLoading={isProcessing}
                                                        />
                                                    ))}
                                                </Stack>
                                            </Box>
                                        )}

                                        {showFileError && (
                                            <Box
                                                sx={{
                                                    clear: "both",
                                                    mt: 2,
                                                    p: 2,
                                                    backgroundColor: "#ffebee",
                                                    borderRadius: 1,
                                                    border: `2px solid ${COLORS.error}`,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: COLORS.error,
                                                        fontSize: "16px",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    ⚠️ This Field Is Required!
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: COLORS.error,
                                                        fontSize: "13px",
                                                        mt: 1,
                                                    }}
                                                >
                                                    Please select at least one file (.xlsx,.xlsb, .xls, .txt, .log, or .logs) to continue
                                                </Typography>
                                            </Box>
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
                                        disabled={isProcessing || inputFiles.length === 0}
                                        sx={{ minWidth: "120px", fontWeight: 700, textTransform: "uppercase" }}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                                                Processing...
                                            </>
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
                                        sx={{ minWidth: "120px", fontWeight: 700, textTransform: "uppercase" }}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>

                                {/* RESULT DISPLAY */}
                                {uploadSuccess && (
                                    <ScriptingToolResult
                                        data={uploadResultData}
                                        onDownload={downloadFile}
                                        onDownloadAll={downloadAllFiles}
                                        downloadFiles={downloadFiles}
                                    />
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

export default FiveGScriptingTool;