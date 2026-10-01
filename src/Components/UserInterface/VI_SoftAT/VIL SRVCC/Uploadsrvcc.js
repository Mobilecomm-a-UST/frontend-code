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

const FILE_TYPE_NAMES = {
    "Cell para_FDD OR TDD OR MIMO_file": "Cell Parameters",
    "freqrel_file": "Frequency Related",
    "dnprefix_file": "DN Prefix",
    "pwr_scheduling_file": "Power Scheduling",
    "srvcc_file": "SRVCC",
    "mme_file": "MME",
    "qci_value_file": "QCI Value",
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
/*  Upload Result Display Component with Multiple Files             */
/* ================================================================ */
const ScriptingToolResult = ({ data, onDownload, onDownloadAll, allFiles }) => {
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
                        title="Files Generated"
                        value={`${allFiles.length} Files`}
                        icon={InfoIcon}
                        color={COLORS.info}
                    />
                </Grid>
            </Grid>

            {/* Download All Button */}
            {status && allFiles.length > 0 && (
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
                        Download All Files ({allFiles.length})
                    </Button>
                </Box>
            )}

            {/* Individual Files List */}
            {status && allFiles.length > 0 && (
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
                        {allFiles.map((file, index) => (
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
                                            {file.base_name}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "#666",
                                                fontSize: "11px",
                                            }}
                                        >
                                            {file.display_name}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Tooltip title={`Download ${file.display_name}`}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<FileDownloadIcon />}
                                        onClick={() => onDownload(file.url, file.file_name)}
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
    const [xmlFiles, setXmlFiles] = useState([]);
    const [excelFiles, setExcelFiles] = useState([]);
    const [hwTypeSmod, setHwTypeSmod] = useState("");
    const [hwTypeBbmod, setHwTypeBbmod] = useState("");
    const [showXmlError, setShowXmlError] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadResultData, setUploadResultData] = useState(null);
    const [downloadFiles, setDownloadFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // DROPDOWN OPTIONS
    const SMOD_OPTIONS = ["ASIA", "ASIB", "ASIM", ""];
    const BBMOD_OPTIONS = ["ABIP", "ABIO", "ABIA", ""];

    // ======== FILE HANDLERS ========
    const handleXmlFileChange = (event) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) {
            return;
        }

        const invalidFiles = files.filter(
            (file) => !file.name.toLowerCase().endsWith(".xml") && !file.name.toLowerCase().endsWith(".txt")
        );

        if (invalidFiles.length > 0) {
            setShowXmlError(true);

            Swal.fire({
                icon: "error",
                title: "Invalid File",
                text: "Please select only valid XML or TXT files.",
            });

            event.target.value = "";
            return;
        }

        setXmlFiles(files);
        setShowXmlError(false);
    };

    const handleExcelFileChange = (event) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) {
            return;
        }

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

        setExcelFiles(files);
    };

    // ======== EXTRACT ALL DOWNLOAD FILES ========
    const extractDownloadFiles = (response) => {
        const files = [];

        if (Array.isArray(response.files)) {
            response.files.forEach((fileItem) => {
                const baseName = fileItem.base_name || fileItem.input_file || "Output";

                Object.entries(fileItem).forEach(([key, value]) => {
                    if (typeof value === "string" && value.startsWith("http")) {
                        const displayName = FILE_TYPE_NAMES[key] || key.replace(/_/g, " ").toUpperCase();
                        const fileName = value.split("/").pop();

                        files.push({
                            base_name: baseName,
                            display_name: displayName,
                            url: value,
                            file_name: fileName,
                        });
                    }
                });
            });
        }

        return files;
    };

    // ======== SUBMIT HANDLER ========
    const handleSubmit = async () => {
        if (xmlFiles.length === 0) {
            setShowXmlError(true);
            return;
        }

        try {
            setIsProcessing(true);
            action(true);

            const formData = new FormData();

            xmlFiles.forEach((file) => {
                formData.append("files", file);
            });

            if (excelFiles.length > 0) {
                excelFiles.forEach((file) => {
                    formData.append("nr_excel", file);
                });
            }

            if (hwTypeSmod) {
                formData.append("hw_type_smod", hwTypeSmod);
            }
            if (hwTypeBbmod) {
                formData.append("hw_type_bbmod", hwTypeBbmod);
            }

            const response = await postData("vil_srvcc/vil/", formData);

            if (response && response.status) {
                const allFiles = extractDownloadFiles(response);
                setDownloadFiles(allFiles);
                setUploadSuccess(true);
                setUploadResultData(response);

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.message || "5G configuration created successfully",
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
        setXmlFiles([]);
        setExcelFiles([]);
        setHwTypeSmod("");
        setHwTypeBbmod("");
        setShowXmlError(false);
        setUploadSuccess(false);
        setUploadResultData(null);
        setDownloadFiles([]);
    };

    // ======== SINGLE FILE DOWNLOAD - DIRECT APPROACH ========
    const downloadFile = (downloadUrl, fileName) => {
        try {
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = fileName || "download";
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Swal.fire({
                icon: "success",
                title: "Downloading",
                text: `${fileName} download started`,
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Download error:", error);
            Swal.fire({
                icon: "error",
                title: "Download Failed",
                text: `Error: ${error.message}`,
            });
        }
    };

    // ======== DOWNLOAD ALL FILES ========
    const downloadAllFiles = () => {
        if (downloadFiles.length === 0) return;

        downloadFiles.forEach((file, index) => {
            setTimeout(() => {
                downloadFile(file.url, file.file_name);
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
                                 <Typography color='text.primary'>Upload Layered Addition</Typography>
                             </Breadcrumbs>
            </div>

            <Slide direction="left" in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Create VIL SRVCC Addition Summary</Box>

                            <Stack spacing={2.5} sx={{ marginTop: "-40px" }} direction="column">
                                {/* ====== XML FILE CARD ====== */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Log File:-
                                    </div>

                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                color={xmlFiles.length > 0 ? "warning" : "primary"}
                                                startIcon={<UploadIcon />}
                                            >
                                                {xmlFiles.length > 0
                                                    ? "Change Log Files"
                                                    : "Select Log Files"}

                                                <input
                                                    required
                                                    hidden
                                                    multiple
                                                    accept=".log,.logs,.txt"
                                                    type="file"
                                                    onChange={handleXmlFileChange}
                                                />
                                            </Button>
                                        </div>

                                        {xmlFiles.length > 0 && (
                                            <span
                                                style={{
                                                    color: "green",
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    marginLeft: "12px",
                                                }}
                                            >
                                                ✓ {xmlFiles.length} file
                                                {xmlFiles.length > 1 ? "s" : ""} selected
                                            </span>
                                        )}

                                        {showXmlError && (
                                            <span
                                                style={{
                                                    color: COLORS.error,
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    marginLeft: "12px",
                                                }}
                                            >
                                                This field is required!
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
                                        disabled={isProcessing || xmlFiles.length === 0}
                                        sx={{ minWidth: "120px" }}
                                    >
                                        {isProcessing ? <CircularProgress size={20} /> : "Submit"}
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

                                {/* RESULT DISPLAY */}
                                {uploadSuccess && (
                                    <ScriptingToolResult
                                        data={uploadResultData}
                                        onDownload={downloadFile}
                                        onDownloadAll={downloadAllFiles}
                                        allFiles={downloadFiles}
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