import React, { useState, useEffect } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
    TextField, MenuItem, Select, InputLabel, FormControl, Divider,
    Chip, List, ListItem, ListItemText,
} from "@mui/material";
import {
    Upload as UploadIcon,
    DoDisturb as DoDisturbIcon,
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postDataa, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import { getDecreyptedData } from '../../../utils/localstorage'

const circleArray = ['AP','DL','TNCH', 'NESA','RJ','JK','BR','MH', 'MP','MU','JRK','KK','UE','UW','HPHP','OR','WB/KOL']
const bandArray = ['4G', '5G', 'Accepted']
const archivedArray = ['Archived']

const tagArray = ['Workable', 'Non Workable']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatMonthToMMMYY = (monthInputValue) => {
    if (!monthInputValue) return '';
    const [year, month] = monthInputValue.split('-');
    const idx = parseInt(month, 10) - 1;
    if (idx < 0 || idx > 11 || !year) return '';
    return `${MONTH_NAMES[idx]}-${year.slice(-2)}`;
};

const isChronologicalOrder = (startValue, endValue) => {
    if (!startValue || !endValue) return false;
    const [startYear, startMonth] = startValue.split('-').map((v) => parseInt(v, 10));
    const [endYear, endMonth] = endValue.split('-').map((v) => parseInt(v, 10));
    if (!startYear || !startMonth || !endYear || !endMonth) return false;
    const startIndex = startYear * 12 + (startMonth - 1);
    const endIndex = endYear * 12 + (endMonth - 1);
    return startIndex <= endIndex;
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

const DownloadCompleteReport = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    /* ───────────────────────── 1. Upload Site Data ───────────────────────── */
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadFileError, setUploadFileError] = useState(false);
    const [uploadSummary, setUploadSummary] = useState(null);
    const userTypes = getDecreyptedData('user_type')?.split(",").map((t) => t.trim())

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

    /* ───────────────────────── 2. Add / Update Remarks ───────────────────────── */
    const [siteId, setSiteId] = useState("");
    const [remarksCircle, setRemarksCircle] = useState("");
    const [additionalRemarks, setAdditionalRemarks] = useState("");
    const [tag, setTag] = useState("");
    const [remarksErrors, setRemarksErrors] = useState({ siteId: false, circle: false, tag: false });
    const [remarksResult, setRemarksResult] = useState(null);

    const handleRemarksSubmit = async () => {
        const isValid = siteId.trim() !== "" && remarksCircle !== "" && tag !== "";
        if (!isValid) {
            setRemarksErrors({
                siteId: siteId.trim() === "",
                circle: remarksCircle === "",
                tag: tag === "",
            });
            return;
        }
        action(true);
        const formData = new FormData();
        formData.append("site_id", siteId.trim());
        formData.append("circle", remarksCircle);
        formData.append("additional_remarks", additionalRemarks);
        formData.append("tag", tag);
        const response = await postDataa("pending_performance_at_remarks/remarks/", formData);
        action(false);
        if (response?.message) {
            setRemarksResult(response);
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
        }
    };

    const handleRemarksCancel = () => {
        setSiteId("");
        setRemarksCircle("");
        setAdditionalRemarks("");
        setTag("");
        setRemarksErrors({ siteId: false, circle: false, tag: false });
        setRemarksResult(null);
    };

    /* ───────────────────────── 3. Download Report ───────────────────────── */
    const [reportBand, setReportBand] = useState("");
    const [reportArchived, setReportArchived] = useState("");
    const [reportStartMonth, setReportStartMonth] = useState("");
    const [reportEndMonth, setReportEndMonth] = useState("");
    const [reportErrors, setReportErrors] = useState({ band: false, month: false, range: false });
    const [reportResult, setReportResult] = useState(null);

    // Remembers which download_urls key(s) the user actually asked for on
    // this submit (band and/or archived), so only the matching button(s)
    // are shown when the backend returns the plural "download_urls" shape.
    const [reportSelectedKeys, setReportSelectedKeys] = useState([]);

    const formattedStartMonth = formatMonthToMMMYY(reportStartMonth);
    const formattedEndMonth = formatMonthToMMMYY(reportEndMonth);
    const bothMonthsPicked = reportStartMonth !== "" && reportEndMonth !== "";
    const isRangeOrderInvalid = bothMonthsPicked && !isChronologicalOrder(reportStartMonth, reportEndMonth);

    const handleReportSubmit = async () => {
        const rangeIsValid = bothMonthsPicked && isChronologicalOrder(reportStartMonth, reportEndMonth);
        const isValid = rangeIsValid; // band is optional

        if (!isValid) {
            setReportErrors({
                band: false,
                month: !bothMonthsPicked,
                range: bothMonthsPicked && !rangeIsValid,
            });
            return;
        }

        action(true);
        const formData = new FormData();
        if (reportBand) {
            formData.append("band", reportBand);
        }
        formData.append("start_month", formattedStartMonth);
        formData.append("end_month", formattedEndMonth);
        if (reportArchived) {
            formData.append("archived", reportArchived);
        }

        const selectedKeys = [];
        if (reportBand) selectedKeys.push(reportBand);
        if (reportArchived) selectedKeys.push(reportArchived);
        setReportSelectedKeys(selectedKeys);

        const response = await postDataa("pending_performance_at_remarks/download/", formData);
        action(false);
        if (response?.status) {
            setReportResult(response);
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
        }
    };

    const handleReportCancel = () => {
        setReportBand("");
        setReportArchived("");
        setReportStartMonth("");
        setReportEndMonth("");
        setReportErrors({ band: false, month: false, range: false });
        setReportResult(null);
        setReportSelectedKeys([]);
    };

    /* ───────────────────────── 4. Download Template ───────────────────────── */
    const [templateCircle, setTemplateCircle] = useState("");
    const [templateError, setTemplateError] = useState(false);
    const [templateResult, setTemplateResult] = useState(null);

    const handleTemplateSubmit = async () => {
        if (templateCircle === "") {
            setTemplateError(true);
            return;
        }
        action(true);
        const formData = new FormData();
        formData.append("circle", templateCircle);
        const response = await postDataa("pending_performance_at_remarks/remarks-template/", formData);
        action(false);
        if (response?.status) {
            setTemplateResult(response);
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
        }
    };

    const handleTemplateCancel = () => {
        setTemplateCircle("");
        setTemplateError(false);
        setTemplateResult(null);
    };

    /* ───────────────────────── 5. Upload Updated Report ───────────────────────── */
    const [reportUploadFile, setReportUploadFile] = useState(null);
    const [reportUploadError, setReportUploadError] = useState(false);
    const [reportUploadResult, setReportUploadResult] = useState(null);

    const handleReportUploadFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReportUploadFile(file);
            setReportUploadError(false);
        }
    };

    const handleReportUploadSubmit = async () => {
        if (!reportUploadFile) {
            setReportUploadError(true);
            return;
        }
        action(true);
        const formData = new FormData();
        formData.append("file", reportUploadFile);
        const response = await postDataa("pending_performance_at_remarks/remarks-template/upload/", formData);
        action(false);
        if (response?.status) {
            setReportUploadResult(response);
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
        }
    };

    const handleReportUploadCancel = () => {
        setReportUploadFile(null);
        setReportUploadError(false);
        setReportUploadResult(null);
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

                    {/* 3. Download Report */}
                    <StyledCard title="Download Report" classes={classes}>
                        <Stack spacing={2}>
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Band:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <FormControl sx={{ minWidth: 150 }}>
                                        <InputLabel id="report-band-label">Select Band</InputLabel>
                                        <Select
                                            labelId="report-band-label"
                                            label="Select Band"
                                            value={reportBand}
                                            onChange={(e) => { setReportBand(e.target.value); setReportErrors((p) => ({ ...p, band: false })); }}
                                        >
                                            {bandArray.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </div>
                            </Box>

                            {userTypes?.includes('QT_AR') && <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Archived:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <FormControl sx={{ minWidth: 150 }}>
                                        <InputLabel id="report-archived-label">Select Archived</InputLabel>
                                        <Select
                                            labelId="report-archived-label"
                                            label="Select Archived"
                                            value={reportArchived}
                                            onChange={(e) => setReportArchived(e.target.value)}
                                        >
                                            {archivedArray.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </div>
                            </Box>}

                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Month Range:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
                                        <TextField
                                            size="small"
                                            type="month"
                                            label="From"
                                            InputLabelProps={{ shrink: true }}
                                            value={reportStartMonth}
                                            onChange={(e) => {
                                                setReportStartMonth(e.target.value);
                                                setReportErrors((p) => ({ ...p, month: false, range: false }));
                                            }}
                                            sx={{ minWidth: 170, bgcolor: "#fff" }}
                                        />
                                        <Typography sx={{ color: "text.secondary" }}>to</Typography>
                                        <TextField
                                            size="small"
                                            type="month"
                                            label="To"
                                            InputLabelProps={{ shrink: true }}
                                            value={reportEndMonth}
                                            inputProps={{ min: reportStartMonth || undefined }}
                                            onChange={(e) => {
                                                setReportEndMonth(e.target.value);
                                                setReportErrors((p) => ({ ...p, month: false, range: false }));
                                            }}
                                            sx={{ minWidth: 170, bgcolor: "#fff" }}
                                        />
                                    </Stack>

                                    {bothMonthsPicked && !isRangeOrderInvalid && !reportErrors.month && !reportErrors.range && (
                                        <div style={{ marginTop: 6 }}>
                                            <span style={{ color: "gray", fontSize: 14 }}>
                                                Will be sent as: start_month={formattedStartMonth}, end_month={formattedEndMonth}
                                            </span>
                                        </div>
                                    )}

                                    {reportErrors.month && (
                                        <div><span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>Please select both a start and end month!</span></div>
                                    )}
                                    {(reportErrors.range || isRangeOrderInvalid) && !reportErrors.month && (
                                        <div><span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>"From" month must be the same as or before the "To" month!</span></div>
                                    )}
                                </div>
                            </Box>

                            {/* UPDATED: backend can return either a singular "download_url"
                                string (band-only case) or a "download_urls" object with
                                multiple keys (archived / other cases). Both are handled here,
                                and only the button(s) matching what the user selected show. */}
                            {(reportResult?.download_url || reportResult?.download_urls) && (
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Report:</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                                            {reportResult?.download_url ? (
                                                <DownloadButton
                                                    url={reportResult.download_url}
                                                    label={`${reportResult.band || reportSelectedKeys[0] || ""} Report`}
                                                />
                                            ) : (
                                                (reportSelectedKeys.length > 0
                                                    ? reportSelectedKeys
                                                    : Object.keys(reportResult.download_urls)
                                                ).map((key) => (
                                                    reportResult.download_urls[key] && (
                                                        <DownloadButton
                                                            key={key}
                                                            url={reportResult.download_urls[key]}
                                                            label={`${key} Report`}
                                                        />
                                                    )
                                                ))
                                            )}
                                        </Stack>
                                    </div>
                                </Box>
                            )}
                        </Stack>

                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
                            <Button variant="contained" color="success" onClick={handleReportSubmit} endIcon={<UploadIcon />}>Submit</Button>
                            <Button variant="contained" onClick={handleReportCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
                        </Stack>
                    </StyledCard>

                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default DownloadCompleteReport;



// import React, { useState, useEffect } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
//     TextField, MenuItem, Select, InputLabel, FormControl, Divider,
//     Chip, List, ListItem, ListItemText, Card, CardContent, Paper,
//     Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
// } from "@mui/material";
// import {
//     Upload as UploadIcon,
//     DoDisturb as DoDisturbIcon,
//     FileDownload as FileDownloadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
//     Devices as DevicesIcon,
//     SignalCellularNull as SignalIcon,
//     CheckCircle as CheckIcon,
//     TrendingUp as TrendingUpIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postDataa, ServerURL } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import { getDecreyptedData } from '../../../utils/localstorage'

// const circleArray = ['AP','DL','TNCH', 'NESA','RJ','JK','BR','MH', 'MP','MU','JRK','KK','UE','UW','HPHP','OR','WB/KOL']
// const bandArray = ['4G', '5G', 'Accepted']
// const archivedArray = ['Archived']

// const tagArray = ['Workable', 'Non Workable']
// const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// const formatMonthToMMMYY = (monthInputValue) => {
//     if (!monthInputValue) return '';
//     const [year, month] = monthInputValue.split('-');
//     const idx = parseInt(month, 10) - 1;
//     if (idx < 0 || idx > 11 || !year) return '';
//     return `${MONTH_NAMES[idx]}-${year.slice(-2)}`;
// };

// const isChronologicalOrder = (startValue, endValue) => {
//     if (!startValue || !endValue) return false;
//     const [startYear, startMonth] = startValue.split('-').map((v) => parseInt(v, 10));
//     const [endYear, endMonth] = endValue.split('-').map((v) => parseInt(v, 10));
//     if (!startYear || !startMonth || !endYear || !endMonth) return false;
//     const startIndex = startYear * 12 + (startMonth - 1);
//     const endIndex = endYear * 12 + (endMonth - 1);
//     return startIndex <= endIndex;
// };

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
//         total_records: "Total Records",
//         workable: "Workable",
//         non_workable: "Non-Workable",
//         pending: "Pending",
//         acceptance_pending: "Acceptance Pending",
//         ready_to_offer: "Ready to Offer",
//         alarm_hw: "Alarm/HW",
//         under_observation: "Under Observation",
//         under_exclusion: "Under Exclusion",
//         days_21_30: "21-30 Days",
//         days_30_60: "30-60 Days",
//         days_over_60: ">60 Days",
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

// // ✅ NEW: Aggregates data from the data array
// const aggregateData = (dataArray) => {
//     if (!Array.isArray(dataArray) || dataArray.length === 0) {
//         return null;
//     }

//     const aggregated = {
//         total_records: dataArray.length,
//         workable: 0,
//         non_workable: 0,
//         pending: 0,
//         acceptance_pending: 0,
//         ready_to_offer: 0,
//         alarm_hw: 0,
//         under_observation: 0,
//         under_exclusion: 0,
//         days_21_30: 0,
//         days_30_60: 0,
//         days_over_60: 0,
//     };

//     dataArray.forEach((record) => {
//         // Count by tag
//         if (record.tag && record.tag.includes('Workable') && !record.tag.includes('Non')) {
//             aggregated.workable++;
//         } else if (record.tag && record.tag.includes('Non-workable')) {
//             aggregated.non_workable++;
//         }

//         // Count by performance_status
//         if (record.performance_status === 'Pending') {
//             aggregated.pending++;
//         } else if (record.performance_status === 'Acceptance Pending') {
//             aggregated.acceptance_pending++;
//         }

//         // Count by bucket
//         if (record.bucket === 'Ready to offer') {
//             aggregated.ready_to_offer++;
//         } else if (record.bucket === 'Alarm/HW') {
//             aggregated.alarm_hw++;
//         } else if (record.bucket === 'Under observation') {
//             aggregated.under_observation++;
//         } else if (record.bucket === 'Under exclusion') {
//             aggregated.under_exclusion++;
//         }

//         // Count by TAT
//         if (record.tat === '21-30days') {
//             aggregated.days_21_30++;
//         } else if (record.tat === '30-60days') {
//             aggregated.days_30_60++;
//         } else if (record.tat === '>60days') {
//             aggregated.days_over_60++;
//         }
//     });

//     return aggregated;
// };

// // ✅ Dashboard Card Component
// const DashboardCard = ({ icon: Icon, title, metrics, color }) => {
//     if (!metrics || Object.keys(metrics).length === 0) {
//         return null;
//     }

//     return (
//         <Card sx={{
//             background: "#fff",
//             border: `2px solid ${color}20`,
//             borderRadius: 2,
//             boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//             transition: "all 0.3s ease",
//             "&:hover": {
//                 boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
//                 transform: "translateY(-2px)",
//             },
//             height: "100%",
//         }}>
//             <CardContent sx={{ p: 2 }}>
//                 {/* Header */}
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
//                     <Box sx={{
//                         width: 40,
//                         height: 40,
//                         borderRadius: 1.5,
//                         background: `${color}15`,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                     }}>
//                         <Icon sx={{ color: color, fontSize: 20 }} />
//                     </Box>
//                     <Typography sx={{ fontWeight: 700, fontSize: "16px", color: color }}>
//                         {title}
//                     </Typography>
//                 </Box>

//                 {/* Metrics Grid */}
//                 <Grid container spacing={1.5}>
//                     {Object.entries(metrics).map(([key, value]) => (
//                         <Grid item xs={6} key={key}>
//                             <Box sx={{ textAlign: "center" }}>
//                                 <Typography variant="caption" sx={{ color: "#999", fontWeight: 600, fontSize: "10px" }}>
//                                     {key.replace(/_/g, " ").toUpperCase()}
//                                 </Typography>
//                                 <Typography sx={{ fontWeight: 800, fontSize: "18px", color: color, mt: 0.5 }}>
//                                     {value ?? 0}
//                                 </Typography>
//                             </Box>
//                         </Grid>
//                     ))}
//                 </Grid>
//             </CardContent>
//         </Card>
//     );
// };

// // ✅ Data Table Component
// const DataTable = ({ data }) => {
//     if (!Array.isArray(data) || data.length === 0) {
//         return null;
//     }

//     const columns = [
//         { label: "AT Ref No", key: "at_ref_no" },
//         { label: "Circle", key: "circle" },
//         { label: "Site ID", key: "site_id" },
//         { label: "Tag", key: "tag" },
//         { label: "Status", key: "performance_status" },
//         { label: "TAT", key: "tat" },
//         { label: "Bucket", key: "bucket" },
//     ];

//     return (
//         <Box sx={{ mt: 4, mb: 3 }}>
//             <Divider sx={{ mb: 3 }} />
//             <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#333", mb: 2 }}>
//                 📋 Detailed Records ({data.length} items)
//             </Typography>
//             <TableContainer sx={{ border: "1px solid #E0E0E0", borderRadius: 2 }}>
//                 <Table size="small">
//                     <TableHead>
//                         <TableRow sx={{ background: "#f5f5f5" }}>
//                             {columns.map((col) => (
//                                 <TableCell key={col.key} sx={{ fontWeight: 700, fontSize: "12px" }}>
//                                     {col.label}
//                                 </TableCell>
//                             ))}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {data.slice(0, 10).map((row, idx) => (
//                             <TableRow key={idx} sx={{ "&:nth-of-type(odd)": { background: "#fafafa" } }}>
//                                 {columns.map((col) => (
//                                     <TableCell key={col.key} sx={{ fontSize: "12px" }}>
//                                         {row[col.key] || "-"}
//                                     </TableCell>
//                                 ))}
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//             {data.length > 10 && (
//                 <Typography variant="caption" sx={{ color: "#999", mt: 1, display: "block" }}>
//                     Showing 10 of {data.length} records
//                 </Typography>
//             )}
//         </Box>
//     );
// };

// // ✅ Dashboard Component
// const Dashboard = ({ reportResult }) => {
//     if (!reportResult) return null;

//     console.log("📊 Full Report Result:", reportResult);

//     // Extract data array
//     const dataArray = reportResult.data || [];
//     console.log("📊 Data Array:", dataArray);

//     if (!Array.isArray(dataArray) || dataArray.length === 0) {
//         return (
//             <Box sx={{ mt: 4, mb: 3 }}>
//                 <Divider sx={{ mb: 3 }} />
//                 <Alert severity="info">
//                     No detailed records in response. Download report to see data.
//                 </Alert>
//             </Box>
//         );
//     }

//     // Aggregate data
//     const aggregated = aggregateData(dataArray);
//     console.log("📊 Aggregated Data:", aggregated);

//     if (!aggregated) {
//         return (
//             <Box sx={{ mt: 4, mb: 3 }}>
//                 <Divider sx={{ mb: 3 }} />
//                 <Alert severity="warning">
//                     Unable to process data.
//                 </Alert>
//             </Box>
//         );
//     }

//     // Split aggregated data into sections
//     const tagMetrics = {
//         workable: aggregated.workable,
//         non_workable: aggregated.non_workable,
//     };

//     const statusMetrics = {
//         pending: aggregated.pending,
//         acceptance_pending: aggregated.acceptance_pending,
//     };

//     const bucketMetrics = {
//         ready_to_offer: aggregated.ready_to_offer,
//         alarm_hw: aggregated.alarm_hw,
//         under_observation: aggregated.under_observation,
//         under_exclusion: aggregated.under_exclusion,
//     };

//     const tatMetrics = {
//         days_21_30: aggregated.days_21_30,
//         days_30_60: aggregated.days_30_60,
//         days_over_60: aggregated.days_over_60,
//     };

//     return (
//         <Box sx={{ mt: 4, mb: 3 }}>
//             <Divider sx={{ mb: 3 }} />

//             {/* Dashboard Title */}
//             <Typography sx={{
//                 fontWeight: 800,
//                 fontSize: "20px",
//                 color: "#006e74",
//                 mb: 3,
//                 textTransform: "uppercase",
//                 letterSpacing: 0.5,
//             }}>
//                 📊 Dashboard Overview
//             </Typography>

//             {/* Main Metric Cards */}
//             <Grid container spacing={2.5} sx={{ mb: 3 }}>
//                 <Grid item xs={12} sm={6} md={3}>
//                     <Card sx={{
//                         background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
//                         color: "#fff",
//                         borderRadius: 2,
//                         p: 2,
//                         textAlign: "center",
//                     }}>
//                         <Typography variant="h3" sx={{ fontWeight: 800 }}>
//                             {aggregated.total_records}
//                         </Typography>
//                         <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
//                             Total Records
//                         </Typography>
//                     </Card>
//                 </Grid>
//             </Grid>

//             {/* Tag Distribution */}
//             <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#333", mb: 2 }}>
//                 🏷️ Tag Distribution
//             </Typography>
//             <Grid container spacing={2.5} sx={{ mb: 4 }}>
//                 <Grid item xs={12} sm={6}>
//                     <DashboardCard
//                         icon={CheckIcon}
//                         title="Workable vs Non-Workable"
//                         metrics={tagMetrics}
//                         color="#388E3C"
//                     />
//                 </Grid>
//             </Grid>

//             {/* Performance Status */}
//             <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#333", mb: 2 }}>
//                 📈 Performance Status
//             </Typography>
//             <Grid container spacing={2.5} sx={{ mb: 4 }}>
//                 <Grid item xs={12} sm={6}>
//                     <DashboardCard
//                         icon={TrendingUpIcon}
//                         title="Status Breakdown"
//                         metrics={statusMetrics}
//                         color="#D32F2F"
//                     />
//                 </Grid>
//             </Grid>

//             {/* Bucket Distribution */}
//             <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#333", mb: 2 }}>
//                 📦 Bucket Classification
//             </Typography>
//             <Grid container spacing={2.5} sx={{ mb: 4 }}>
//                 <Grid item xs={12}>
//                     <DashboardCard
//                         icon={DevicesIcon}
//                         title="Work Buckets"
//                         metrics={bucketMetrics}
//                         color="#1976D2"
//                     />
//                 </Grid>
//             </Grid>

//             {/* TAT Distribution */}
//             <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#333", mb: 2 }}>
//                 ⏱️ TAT (Turn-Around Time)
//             </Typography>
//             <Grid container spacing={2.5} sx={{ mb: 4 }}>
//                 <Grid item xs={12} sm={6}>
//                     <DashboardCard
//                         icon={SignalIcon}
//                         title="TAT Buckets"
//                         metrics={tatMetrics}
//                         color="#F57C00"
//                     />
//                 </Grid>
//             </Grid>

//             {/* Summary Statistics */}
//             <Box sx={{ mt: 4 }}>
//                 <Typography sx={{
//                     fontWeight: 700,
//                     fontSize: "16px",
//                     color: "#333",
//                     mb: 2,
//                 }}>
//                     📊 Summary Statistics
//                 </Typography>
//                 <SummaryGrid summary={aggregated} />
//             </Box>

//             {/* Data Table */}
//             <DataTable data={dataArray} />
//         </Box>
//     );
// };

// const DownloadCompleteReport = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();
//     const classes = OverAllCss();

//     /* ───────────────────────── 1. Upload Site Data ───────────────────────── */
//     const [uploadFile, setUploadFile] = useState(null);
//     const [uploadFileError, setUploadFileError] = useState(false);
//     const [uploadSummary, setUploadSummary] = useState(null);
//     const userTypes = getDecreyptedData('user_type')?.split(",").map((t) => t.trim())

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
//     const [tag, setTag] = useState("");
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
//     const [reportArchived, setReportArchived] = useState("");
//     const [reportStartMonth, setReportStartMonth] = useState("");
//     const [reportEndMonth, setReportEndMonth] = useState("");
//     const [reportErrors, setReportErrors] = useState({ band: false, month: false, range: false });
//     const [reportResult, setReportResult] = useState(null);

//     const [reportSelectedKeys, setReportSelectedKeys] = useState([]);

//     const formattedStartMonth = formatMonthToMMMYY(reportStartMonth);
//     const formattedEndMonth = formatMonthToMMMYY(reportEndMonth);
//     const bothMonthsPicked = reportStartMonth !== "" && reportEndMonth !== "";
//     const isRangeOrderInvalid = bothMonthsPicked && !isChronologicalOrder(reportStartMonth, reportEndMonth);

//     const handleReportSubmit = async () => {
//         const rangeIsValid = bothMonthsPicked && isChronologicalOrder(reportStartMonth, reportEndMonth);
//         const isValid = rangeIsValid;

//         if (!isValid) {
//             setReportErrors({
//                 band: false,
//                 month: !bothMonthsPicked,
//                 range: bothMonthsPicked && !rangeIsValid,
//             });
//             return;
//         }

//         action(true);
//         const formData = new FormData();
//         if (reportBand) {
//             formData.append("band", reportBand);
//         }
//         formData.append("start_month", formattedStartMonth);
//         formData.append("end_month", formattedEndMonth);
//         if (reportArchived) {
//             formData.append("archived", reportArchived);
//         }

//         const selectedKeys = [];
//         if (reportBand) selectedKeys.push(reportBand);
//         if (reportArchived) selectedKeys.push(reportArchived);
//         setReportSelectedKeys(selectedKeys);

//         const response = await postDataa("pending_performance_at_remarks/download/", formData);
//         action(false);

//         console.log("🔍 Full API Response:", response);

//         if (response?.status) {
//             setReportResult(response);
//             Swal.fire({ icon: "success", title: "Done", text: response.message });
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
//         }
//     };

//     const handleReportCancel = () => {
//         setReportBand("");
//         setReportArchived("");
//         setReportStartMonth("");
//         setReportEndMonth("");
//         setReportErrors({ band: false, month: false, range: false });
//         setReportResult(null);
//         setReportSelectedKeys([]);
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

//                     {/* 3. Download Report */}
//                     <StyledCard title="Download Report" classes={classes}>
//                         <Stack spacing={2}>
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Select Band:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <FormControl sx={{ minWidth: 150 }}>
//                                         <InputLabel id="report-band-label">Select Band</InputLabel>
//                                         <Select
//                                             labelId="report-band-label"
//                                             label="Select Band"
//                                             value={reportBand}
//                                             onChange={(e) => { setReportBand(e.target.value); setReportErrors((p) => ({ ...p, band: false })); }}
//                                         >
//                                             {bandArray.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
//                                         </Select>
//                                     </FormControl>
//                                 </div>
//                             </Box>

//                             {userTypes?.includes('QT_AR') && <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Select Archived:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <FormControl sx={{ minWidth: 150 }}>
//                                         <InputLabel id="report-archived-label">Select Archived</InputLabel>
//                                         <Select
//                                             labelId="report-archived-label"
//                                             label="Select Archived"
//                                             value={reportArchived}
//                                             onChange={(e) => setReportArchived(e.target.value)}
//                                         >
//                                             {archivedArray.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
//                                         </Select>
//                                     </FormControl>
//                                 </div>
//                             </Box>}

//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Select Month Range:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
//                                         <TextField
//                                             size="small"
//                                             type="month"
//                                             label="From"
//                                             InputLabelProps={{ shrink: true }}
//                                             value={reportStartMonth}
//                                             onChange={(e) => {
//                                                 setReportStartMonth(e.target.value);
//                                                 setReportErrors((p) => ({ ...p, month: false, range: false }));
//                                             }}
//                                             sx={{ minWidth: 170, bgcolor: "#fff" }}
//                                         />
//                                         <Typography sx={{ color: "text.secondary" }}>to</Typography>
//                                         <TextField
//                                             size="small"
//                                             type="month"
//                                             label="To"
//                                             InputLabelProps={{ shrink: true }}
//                                             value={reportEndMonth}
//                                             inputProps={{ min: reportStartMonth || undefined }}
//                                             onChange={(e) => {
//                                                 setReportEndMonth(e.target.value);
//                                                 setReportErrors((p) => ({ ...p, month: false, range: false }));
//                                             }}
//                                             sx={{ minWidth: 170, bgcolor: "#fff" }}
//                                         />
//                                     </Stack>

//                                     {bothMonthsPicked && !isRangeOrderInvalid && !reportErrors.month && !reportErrors.range && (
//                                         <div style={{ marginTop: 6 }}>
//                                             <span style={{ color: "gray", fontSize: 14 }}>
//                                                 Will be sent as: start_month={formattedStartMonth}, end_month={formattedEndMonth}
//                                             </span>
//                                         </div>
//                                     )}

//                                     {reportErrors.month && (
//                                         <div><span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>Please select both a start and end month!</span></div>
//                                     )}
//                                     {(reportErrors.range || isRangeOrderInvalid) && !reportErrors.month && (
//                                         <div><span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>"From" month must be the same as or before the "To" month!</span></div>
//                                     )}
//                                 </div>
//                             </Box>

//                             {(reportResult?.download_url || reportResult?.download_urls) && (
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Report:</div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
//                                             {reportResult?.download_url ? (
//                                                 <DownloadButton
//                                                     url={reportResult.download_url}
//                                                     label={`${reportResult.band || reportSelectedKeys[0] || ""} Report`}
//                                                 />
//                                             ) : (
//                                                 (reportSelectedKeys.length > 0
//                                                     ? reportSelectedKeys
//                                                     : Object.keys(reportResult.download_urls || {})
//                                                 ).map((key) => (
//                                                     reportResult.download_urls?.[key] && (
//                                                         <DownloadButton
//                                                             key={key}
//                                                             url={reportResult.download_urls[key]}
//                                                             label={`${key} Report`}
//                                                         />
//                                                     )
//                                                 ))
//                                             )}
//                                         </Stack>
//                                     </div>
//                                 </Box>
//                             )}

//                             {/* ✅ FIXED: Dashboard Component - Now Works with Actual API Data */}
//                             {reportResult && <Dashboard reportResult={reportResult} />}
//                         </Stack>

//                         <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
//                             <Button variant="contained" color="success" onClick={handleReportSubmit} endIcon={<UploadIcon />}>Submit</Button>
//                             <Button variant="contained" onClick={handleReportCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
//                         </Stack>
//                     </StyledCard>

//                 </Box>
//             </Slide>

//             {loading}
//         </>
//     );
// };

// export default DownloadCompleteReport;