// import React, { useState, useEffect } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
//     TextField, MenuItem, Select, InputLabel, FormControl, Divider,
//     Chip, List, ListItem, ListItemText,
// } from "@mui/material";
// import {
//     Upload as UploadIcon,
//     DoDisturb as DoDisturbIcon,
//     FileDownload as FileDownloadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postDataa, ServerURL } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// // ─────────────────────────────────────────────────────────────────────────────
// // 5 APIs on this page (base: pending_performance_at_remarks/):
// //
// // 1. upload/              key "file"                  -> upload site data, returns a summary object
// // 2. remarks/              keys "site_id","circle",     -> add/update remarks for a site
// //                          "additional_remarks","tag"
// // 3. download/              keys "band","month"          -> generate + download a report (e.g. band="4G", month="Jul-26")
// // 4. remarks-template/      key "circle"                 -> generate + download an input template
// // 5. remarks-template/upload/  key "file"                -> upload a filled-in template back
// //
// // NOTE: circle list below is carried over from the other tool pages in this
// // app plus "MU" confirmed by the template screenshot — confirm the full
// // official list against the backend.
// // ─────────────────────────────────────────────────────────────────────────────

// const circleArray = ['AP', 'CH', 'KK', 'DL', 'HR', 'RJ', 'JK', 'WB', 'OD', 'MU', 'TNCH', 'UE', 'BH', 'UW', 'MP', 'PB', 'KO', 'JH', 'UPW']
// const bandArray = ['4G', '5G','Accepted']
// const tagArray = ['Workable', 'Non Workable']
// const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// // Converts a native <input type="month"> value ("2026-01") into the
// // "MMM-YY" format the backend expects ("Jan-26").
// const formatMonthToMMMYY = (monthInputValue) => {
//     if (!monthInputValue) return '';
//     const [year, month] = monthInputValue.split('-');
//     const idx = parseInt(month, 10) - 1;
//     if (idx < 0 || idx > 11 || !year) return '';
//     return `${MONTH_NAMES[idx]}-${year.slice(-2)}`;
// };

// // A single "card" matching the teal-gradient / pill-header style used across
// // the other tool pages (main_Box / Back_Box / Box_Hading from OverAllCss).
// const StyledCard = ({ title, classes, children }) => (
//     <Box className={classes.main_Box} sx={{ mb: 3 }}>
//         <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
//             <Box className={classes.Box_Hading}>{title}</Box>
//             <Box sx={{ mt: "-40px" }}>
//                 {children}
//             </Box>
//         </Box>
//     </Box>
// );

// const SummaryGrid = ({ summary }) => {
//     if (!summary) return null;
//     const labels = {
//         total_input_rows: "Total Input Rows",
//         rows_with_empty_site_id: "Rows With Empty Site ID",
//         input_rows_processed: "Input Rows Processed",
//         created_4g: "Created (4G)",
//         updated_4g: "Updated (4G)",
//         created_5g: "Created (5G)",
//         updated_5g: "Updated (5G)",
//         created_accepted: "Created (Accepted)",
//         updated_accepted: "Updated (Accepted)",
//         moved_to_accepted: "Moved To Accepted",
//         skipped_n2600: "Skipped (n2600)",
//     };
//     return (
//         <Grid container spacing={1.5}>
//             {Object.entries(summary).map(([key, value]) => (
//                 <Grid item xs={6} sm={4} md={3} key={key}>
//                     <Box sx={{ p: 1.25, textAlign: "center", borderRadius: 2, bgcolor: "#fff", border: "1px solid #E0E0E0" }}>
//                         <Typography variant="caption" color="text.secondary">{labels[key] || key}</Typography>
//                         <Typography variant="h6" sx={{ fontWeight: 800 }}>{value}</Typography>
//                     </Box>
//                 </Grid>
//             ))}
//         </Grid>
//     );
// };

// const DownloadButton = ({ url, label }) => {
//     if (!url) return null;
//     return (
//         <a href={url} download target="_blank" rel="noreferrer">
//             <Button
//                 variant="outlined"
//                 startIcon={<FileDownloadIcon sx={{ color: "green" }} />}
//                 sx={{ mt: 1, textTransform: "none", fontWeight: 700 }}
//             >
//                 {label}
//             </Button>
//         </a>
//     );
// };

// const PendingPerformanceAtRemarks = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();
//     const classes = OverAllCss();

//     /* ───────────────────────── 1. Upload Site Data ───────────────────────── */
//     const [uploadFile, setUploadFile] = useState(null);
//     const [uploadFileError, setUploadFileError] = useState(false);
//     const [uploadSummary, setUploadSummary] = useState(null);

//     const handleUploadFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setUploadFile(file);
//             setUploadFileError(false);
//         }
//     };

//     const handleUploadSubmit = async () => {
//         if (!uploadFile) {
//             setUploadFileError(true);
//             return;
//         }
//         action(true);
//         const formData = new FormData();
//         formData.append("file", uploadFile);
//         const response = await postDataa("pending_performance_at_remarks/upload/", formData);
//         action(false);
//         if (response?.message) {
//             setUploadSummary(response.summary || null);
//             Swal.fire({ icon: "success", title: "Done", text: response.message });
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
//         }
//     };

//     const handleUploadCancel = () => {
//         setUploadFile(null);
//         setUploadFileError(false);
//         setUploadSummary(null);
//     };

//     /* ───────────────────────── 2. Add / Update Remarks ───────────────────────── */
//     const [siteId, setSiteId] = useState("");
//     const [remarksCircle, setRemarksCircle] = useState("");
//     const [additionalRemarks, setAdditionalRemarks] = useState("");
//     const [tag, setTag] = useState(""); // "Workable" | "Non Workable"
//     const [remarksErrors, setRemarksErrors] = useState({ siteId: false, circle: false, tag: false });
//     const [remarksResult, setRemarksResult] = useState(null);

//     const handleRemarksSubmit = async () => {
//         const isValid = siteId.trim() !== "" && remarksCircle !== "" && tag !== "";
//         if (!isValid) {
//             setRemarksErrors({
//                 siteId: siteId.trim() === "",
//                 circle: remarksCircle === "",
//                 tag: tag === "",
//             });
//             return;
//         }
//         action(true);
//         const formData = new FormData();
//         formData.append("site_id", siteId.trim());
//         formData.append("circle", remarksCircle);
//         formData.append("additional_remarks", additionalRemarks);
//         formData.append("tag", tag);
//         const response = await postDataa("pending_performance_at_remarks/remarks/", formData);
//         action(false);
//         if (response?.message) {
//             setRemarksResult(response);
//             Swal.fire({ icon: "success", title: "Done", text: response.message });
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
//         }
//     };

//     const handleRemarksCancel = () => {
//         setSiteId("");
//         setRemarksCircle("");
//         setAdditionalRemarks("");
//         setTag("");
//         setRemarksErrors({ siteId: false, circle: false, tag: false });
//         setRemarksResult(null);
//     };

//     /* ───────────────────────── 3. Download Report ───────────────────────── */
//     const [reportBand, setReportBand] = useState("");
//     // Native month input value, e.g. "2026-01" — converted to "Jan-26" on submit.
//     const [reportMonthValue, setReportMonthValue] = useState("");
//     const [reportErrors, setReportErrors] = useState({ band: false, month: false });
//     const [reportResult, setReportResult] = useState(null);

//     const handleReportSubmit = async () => {
//         const formattedMonth = formatMonthToMMMYY(reportMonthValue);
//         const isValid = reportBand !== "" && formattedMonth !== "";
//         if (!isValid) {
//             setReportErrors({ band: reportBand === "", month: formattedMonth === "" });
//             return;
//         }
//         action(true);
//         const formData = new FormData();
//         formData.append("band", reportBand);
//         formData.append("month", formattedMonth);
//         const response = await postDataa("pending_performance_at_remarks/download/", formData);
//         action(false);
//         if (response?.status) {
//             setReportResult(response);
//             Swal.fire({ icon: "success", title: "Done", text: response.message });
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
//         }
//     };

//     const handleReportCancel = () => {
//         setReportBand("");
//         setReportMonthValue("");
//         setReportErrors({ band: false, month: false });
//         setReportResult(null);
//     };

//     /* ───────────────────────── 4. Download Template ───────────────────────── */
//     const [templateCircle, setTemplateCircle] = useState("");
//     const [templateError, setTemplateError] = useState(false);
//     const [templateResult, setTemplateResult] = useState(null);

//     const handleTemplateSubmit = async () => {
//         if (templateCircle === "") {
//             setTemplateError(true);
//             return;
//         }
//         action(true);
//         const formData = new FormData();
//         formData.append("circle", templateCircle);
//         const response = await postDataa("pending_performance_at_remarks/remarks-template/", formData);
//         action(false);
//         if (response?.status) {
//             setTemplateResult(response);
//             Swal.fire({ icon: "success", title: "Done", text: response.message });
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
//         }
//     };

//     const handleTemplateCancel = () => {
//         setTemplateCircle("");
//         setTemplateError(false);
//         setTemplateResult(null);
//     };

//     /* ───────────────────────── 5. Upload Updated Report ───────────────────────── */
//     const [reportUploadFile, setReportUploadFile] = useState(null);
//     const [reportUploadError, setReportUploadError] = useState(false);
//     const [reportUploadResult, setReportUploadResult] = useState(null);

//     const handleReportUploadFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setReportUploadFile(file);
//             setReportUploadError(false);
//         }
//     };

//     const handleReportUploadSubmit = async () => {
//         if (!reportUploadFile) {
//             setReportUploadError(true);
//             return;
//         }
//         action(true);
//         const formData = new FormData();
//         formData.append("file", reportUploadFile);
//         const response = await postDataa("pending_performance_at_remarks/remarks-template/upload/", formData);
//         action(false);
//         if (response?.status) {
//             setReportUploadResult(response);
//             Swal.fire({ icon: "success", title: "Done", text: response.message });
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
//         }
//     };

//     const handleReportUploadCancel = () => {
//         setReportUploadFile(null);
//         setReportUploadError(false);
//         setReportUploadResult(null);
//     };

//     useEffect(() => {
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
//     }, []);

//     return (
//         <>
//             <Box m={1} ml={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Typography color="text.primary">Pending Performance At Remarks</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Slide direction="left" in timeout={1000}>
//                 <Box>

//                     {/* 1. Upload Site Data */}
//                     <StyledCard title="Upload Site Data" classes={classes}>
//                         <Stack spacing={2}>
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Select File:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <Button variant="contained" component="label" color={uploadFile ? "warning" : "primary"}>
//                                         Select File
//                                         <input hidden type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleUploadFileChange} />
//                                     </Button>
//                                     {uploadFile && <span style={{ color: "green", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>{uploadFile.name}</span>}
//                                     {uploadFileError && <div><span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span></div>}
//                                 </div>
//                             </Box>

//                             {uploadSummary && (
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Summary:</div>
//                                     <Box sx={{ p: 2 }}>
//                                         <SummaryGrid summary={uploadSummary} />
//                                     </Box>
//                                 </Box>
//                             )}
//                         </Stack>

//                         <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
//                             <Button variant="contained" color="success" onClick={handleUploadSubmit} endIcon={<UploadIcon />}>Submit</Button>
//                             <Button variant="contained" onClick={handleUploadCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
//                         </Stack>
//                     </StyledCard>


//                 </Box>
//             </Slide>

//             {loading}
//         </>
//     );
// };

// export default PendingPerformanceAtRemarks;


import React, { useState, useEffect } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
    TextField, MenuItem, Select, InputLabel, FormControl, Divider,
    Chip, List, ListItem, ListItemText, Paper, CircularProgress,
} from "@mui/material";
import {
    Upload as UploadIcon,
    DoDisturb as DoDisturbIcon,
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    Folder as FolderIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postDataa, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import axios from "axios";
import { getDecreyptedData } from "../../../utils/localstorage";

const circleArray = ['AP', 'CH', 'KK', 'DL', 'HR', 'RJ', 'JK', 'WB', 'OD', 'MU', 'TNCH', 'UE', 'BH', 'UW', 'MP', 'PB', 'KO', 'JH', 'UPW']
const bandArray = ['4G', '5G', 'Accepted']
const tagArray = ['Workable', 'Non Workable']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatMonthToMMMYY = (monthInputValue) => {
    if (!monthInputValue) return '';
    const [year, month] = monthInputValue.split('-');
    const idx = parseInt(month, 10) - 1;
    if (idx < 0 || idx > 11 || !year) return '';
    return `${MONTH_NAMES[idx]}-${year.slice(-2)}`;
};

const StyledCard = ({ title, classes, children }) => (
    <Box className={classes.main_Box} sx={{ mb: 3 }}>
        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
            <Box className={classes.Box_Hading}>{title}</Box>
            <Box sx={{ mt: "-40px" }}>
                {children}
            </Box>
        </Box>
    </Box>
);

const SummaryGrid = ({ summary }) => {
    if (!summary) return null;
    const labels = {
        total_input_rows: "Total Input Rows",
        rows_with_empty_site_id: "Rows With Empty Site ID",
        input_rows_processed: "Input Rows Processed",
        created_4g: "Created (4G)",
        updated_4g: "Updated (4G)",
        created_5g: "Created (5G)",
        updated_5g: "Updated (5G)",
        created_accepted: "Created (Accepted)",
        updated_accepted: "Updated (Accepted)",
        moved_to_accepted: "Moved To Accepted",
        skipped_n2600: "Skipped (n2600)",
    };
    return (
        <Grid container spacing={1.5}>
            {Object.entries(summary).map(([key, value]) => (
                <Grid item xs={6} sm={4} md={3} key={key}>
                    <Box sx={{ p: 1.25, textAlign: "center", borderRadius: 2, bgcolor: "#fff", border: "1px solid #E0E0E0" }}>
                        <Typography variant="caption" color="text.secondary">{labels[key] || key}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{value}</Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

const DownloadButton = ({ url, label }) => {
    if (!url) return null;
    return (
        <a href={url} download target="_blank" rel="noreferrer">
            <Button
                variant="outlined"
                startIcon={<FileDownloadIcon sx={{ color: "green" }} />}
                sx={{ mt: 1, textTransform: "none", fontWeight: 700 }}
            >
                {label}
            </Button>
        </a>
    );
};

const PendingPerformanceAtRemarks = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    /* ───────────────────────── 1. Upload Site Data ───────────────────────── */
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadFileError, setUploadFileError] = useState(false);
    const [uploadSummary, setUploadSummary] = useState(null);
    const [downloadingInput, setDownloadingInput] = useState(false);

    const handleUploadFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
            setUploadFileError(false);
        }
    };

    const handleUploadSubmit = async () => {
        if (!uploadFile) {
            setUploadFileError(true);
            return;
        }
        action(true);
        const formData = new FormData();
        formData.append("file", uploadFile);
        const response = await postDataa("pending_performance_at_remarks/upload/", formData);
        action(false);
        if (response?.message) {
            setUploadSummary(response.summary || null);
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
        }
    };

    const handleUploadCancel = () => {
        setUploadFile(null);
        setUploadFileError(false);
        setUploadSummary(null);
    };

    const handleDownloadInputFile = async () => {
        setDownloadingInput(true);
        try {
            const response = await axios.get(`${ServerURL}/pending_performance_at_remarks/input/`, {
                headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` },
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'Input_File.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
        } catch (err) {
            console.error('Error downloading input file:', err);
            try {
                const res = await postDataa("pending_performance_at_remarks/input/");
                if (res && res.download_url) {
                    const link = document.createElement('a');
                    link.href = res.download_url;
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    Swal.fire({ icon: "error", title: "Error", text: "Failed to download input file." });
                }
            } catch (e) {
                Swal.fire({ icon: "error", title: "Error", text: "Failed to download input file. Please try again." });
            }
        } finally {
            setDownloadingInput(false);
        }
    };

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
    }, []);

    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Typography color="text.primary">Pending Performance At Remarks</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>

                    {/* Outer wrapper to place Download Input File button at top right outside the card */}
                    <Box sx={{ width: { md: "75%", xs: "100%" }, mx: "auto", display: "flex", justifyContent: "flex-end", mb: 2, px: { xs: 2, md: 0 } }}>
                        <Button
                            variant="contained"
                            size="medium"
                            startIcon={downloadingInput ? <CircularProgress size={18} color="inherit" /> : <FileDownloadIcon />}
                            onClick={handleDownloadInputFile}
                            disabled={downloadingInput}
                            sx={{
                                bgcolor: '#008080',
                                color: 'white',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': {
                                    bgcolor: '#005555',
                                },
                            }}
                        >
                            {downloadingInput ? 'Downloading...' : 'Download Input File'}
                        </Button>
                    </Box>

                    {/* 1. Upload Site Data */}
                    <StyledCard title="Upload Site Data" classes={classes}>
                        <Stack spacing={2}>
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select File:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <Button variant="contained" component="label" color={uploadFile ? "warning" : "primary"}>
                                        Select File
                                        <input hidden type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleUploadFileChange} />
                                    </Button>
                                    {uploadFileError && <div><span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span></div>}
                                </div>
                            </Box>

                            {/* ✅ File Chip Display matching reference screenshot */}
                            {uploadFile && (
                                <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, border: "1px solid #E0E0E0" }}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 1.5,
                                            mb: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            bgcolor: "#F1F5F9",
                                            borderRadius: 1.5,
                                            border: "1px solid #CBD5E1"
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                            <FolderIcon sx={{ color: "#F59E0B" }} />
                                            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1E293B" }}>
                                                {uploadFile.name}
                                            </Typography>
                                        </Box>
                                    </Paper>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        fullWidth
                                        startIcon={<DeleteIcon />}
                                        onClick={handleUploadCancel}
                                        sx={{ fontWeight: 700, textTransform: "none" }}
                                    >
                                        DELETE ALL
                                    </Button>
                                </Box>
                            )}

                            {uploadSummary && (
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Summary:</div>
                                    <Box sx={{ p: 2 }}>
                                        <SummaryGrid summary={uploadSummary} />
                                    </Box>
                                </Box>
                            )}
                        </Stack>

                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
                            <Button variant="contained" color="success" onClick={handleUploadSubmit} endIcon={<UploadIcon />}>Submit</Button>
                            <Button variant="contained" onClick={handleUploadCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
                        </Stack>
                    </StyledCard>

                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default PendingPerformanceAtRemarks;