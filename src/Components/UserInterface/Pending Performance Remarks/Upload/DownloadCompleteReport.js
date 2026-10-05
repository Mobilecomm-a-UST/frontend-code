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

//     // Remembers which download_urls key(s) the user actually asked for on
//     // this submit (band and/or archived), so only the matching button(s)
//     // are shown when the backend returns the plural "download_urls" shape.
//     const [reportSelectedKeys, setReportSelectedKeys] = useState([]);

//     const formattedStartMonth = formatMonthToMMMYY(reportStartMonth);
//     const formattedEndMonth = formatMonthToMMMYY(reportEndMonth);
//     const bothMonthsPicked = reportStartMonth !== "" && reportEndMonth !== "";
//     const isRangeOrderInvalid = bothMonthsPicked && !isChronologicalOrder(reportStartMonth, reportEndMonth);

//     const handleReportSubmit = async () => {
//         const rangeIsValid = bothMonthsPicked && isChronologicalOrder(reportStartMonth, reportEndMonth);
//         const isValid = rangeIsValid; // band is optional

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

//                             {/* UPDATED: backend can return either a singular "download_url"
//                                 string (band-only case) or a "download_urls" object with
//                                 multiple keys (archived / other cases). Both are handled here,
//                                 and only the button(s) matching what the user selected show. */}
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
//                                                     : Object.keys(reportResult.download_urls)
//                                                 ).map((key) => (
//                                                     reportResult.download_urls[key] && (
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



// import React, { useState, useEffect } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
//     TextField, MenuItem, Select, InputLabel, FormControl, Divider,
//     Chip, List, ListItem, ListItemText, Card, CardContent, Paper,
//     Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     TablePagination, InputAdornment,
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
//     Search as SearchIcon,
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

// // ✅ Data Table Component with Pagination & Site ID Filter
// const DataTable = ({ data }) => {
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [siteIdFilter, setSiteIdFilter] = useState("");

//     if (!Array.isArray(data) || data.length === 0) {
//         return null;
//     }

//     // Filter data by Site ID
//     const filteredData = data.filter(row => 
//         row.site_id && row.site_id.toString().toLowerCase().includes(siteIdFilter.toLowerCase())
//     );

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const columns = [
//         { label: "AT Ref No", key: "at_ref_no" },
//         { label: "Circle", key: "circle" },
//         { label: "Site ID", key: "site_id" },
//         { label: "Tag", key: "tag" },
//         { label: "Status", key: "performance_status" },
//         { label: "TAT", key: "tat" },
//         { label: "Bucket", key: "bucket" },
//     ];

//     const displayedRows = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     return (
//         <Box sx={{ mt: 4, mb: 3 }}>
//             <Divider sx={{ mb: 3 }} />
            
//             {/* Title & Filter Section */}
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
//                 <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#333" }}>
//                     📋 Detailed Records ({filteredData.length} of {data.length} items)
//                 </Typography>
//                 <TextField
//                     size="small"
//                     placeholder="Filter by Site ID..."
//                     value={siteIdFilter}
//                     onChange={(e) => {
//                         setSiteIdFilter(e.target.value);
//                         setPage(0);
//                     }}
//                     InputProps={{
//                         startAdornment: (
//                             <InputAdornment position="start">
//                                 <SearchIcon sx={{ color: "#999" }} />
//                             </InputAdornment>
//                         ),
//                     }}
//                     sx={{ minWidth: 220, bgcolor: "#fff" }}
//                 />
//             </Box>

//             {/* Table */}
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
//                         {displayedRows.length > 0 ? (
//                             displayedRows.map((row, idx) => (
//                                 <TableRow key={idx} sx={{ "&:nth-of-type(odd)": { background: "#fafafa" } }}>
//                                     {columns.map((col) => (
//                                         <TableCell key={col.key} sx={{ fontSize: "12px" }}>
//                                             {row[col.key] || "-"}
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell colSpan={columns.length} sx={{ textAlign: "center", py: 2, color: "#999" }}>
//                                     No records found matching the filter
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {/* Pagination */}
//             <TablePagination
//                 rowsPerPageOptions={[5, 10, 25, 50]}
//                 component="div"
//                 count={filteredData.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 sx={{ bgcolor: "#fafafa", borderTop: "1px solid #E0E0E0" }}
//             />
//         </Box>
//     );
// };

// // ✅ Dashboard Component - Shows Only Summary
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
//                 📊 Summary Overview
//             </Typography>

//             {/* Summary Statistics Grid */}
//             <Box sx={{ mb: 4 }}>
//                 <SummaryGrid summary={aggregated} />
//             </Box>

//             {/* Data Table with Pagination & Filter */}
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

//                             {/* ✅ Dashboard Component - Now Shows Summary Grid + Table with Pagination & Filter */}
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


// import React, { useState, useEffect } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
//     TextField, MenuItem, Select, InputLabel, FormControl, Divider,
//     Chip, List, ListItem, ListItemText, Card, CardContent, Paper,
//     Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     TablePagination, InputAdornment, Tooltip,
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
//     Search as SearchIcon,
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

// // ✅ Data Table Component with Pagination & Site ID Filter
// const DataTable = ({ data }) => {
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [siteIdFilter, setSiteIdFilter] = useState("");

//     if (!Array.isArray(data) || data.length === 0) {
//         return null;
//     }

//     // Filter data by Site ID
//     const filteredData = data.filter(row => 
//         row.site_id && row.site_id.toString().toLowerCase().includes(siteIdFilter.toLowerCase())
//     );

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const columns = [
//         { label: "AT Ref No", key: "at_ref_no" },
//         { label: "Circle", key: "circle" },
//         { label: "Site ID", key: "site_id" },
//         { label: "SME Name", key: "sme_name" },
//         { label: "Band", key: "band" },
//         { label: "Offered Layer", key: "offered_layer" },
//         { label: "OEM Name", key: "oem_name" },
//         { label: "Integration Date", key: "integration_date" },
//         { label: "MS1", key: "ms1" },
//         { label: "Aging", key: "aging" },
//         { label: "TAT", key: "tat" },
//         { label: "Month", key: "month" },
//         { label: "Project", key: "project" },
//         { label: "Activity", key: "activity" },
//         { label: "Status", key: "performance_status" },
//         { label: "SCFT Status", key: "scft_status" },
//         { label: "Additional Remarks", key: "additional_remarks" },
//         { label: "Tag", key: "tag" },
//         { label: "Workable Date", key: "workable_date" },
//         { label: "Bucket", key: "bucket" },
//     ];

//     const displayedRows = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     return (
//         <Box sx={{ mt: 4, mb: 3 }}>
//             <Divider sx={{ mb: 3 }} />
            
//             {/* Title & Filter Section */}
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
//                 <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#333" }}>
//                     📋 Detailed Records ({filteredData.length} of {data.length} items)
//                 </Typography>
//                 <TextField
//                     size="small"
//                     placeholder="Filter by Site ID..."
//                     value={siteIdFilter}
//                     onChange={(e) => {
//                         setSiteIdFilter(e.target.value);
//                         setPage(0);
//                     }}
//                     InputProps={{
//                         startAdornment: (
//                             <InputAdornment position="start">
//                                 <SearchIcon sx={{ color: "#999" }} />
//                             </InputAdornment>
//                         ),
//                     }}
//                     sx={{ minWidth: 220, bgcolor: "#fff" }}
//                 />
//             </Box>

//             {/* Table */}
//             <TableContainer sx={{ border: "1px solid #E0E0E0", borderRadius: 2, overflowX: "auto" }}>
//                 <Table size="small" sx={{ tableLayout: "auto", minWidth: "100%" }}>
//                     <TableHead>
//                         <TableRow sx={{ background: "#f5f5f5", whiteSpace: "nowrap" }}>
//                             {columns.map((col) => (
//                                 <TableCell 
//                                     key={col.key} 
//                                     sx={{ 
//                                         fontWeight: 700, 
//                                         fontSize: "12px",
//                                         whiteSpace: "nowrap",
//                                         minWidth: col.key === "additional_remarks" ? "250px" : "auto",
//                                         padding: "8px",
//                                     }}
//                                 >
//                                     {col.label}
//                                 </TableCell>
//                             ))}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {displayedRows.length > 0 ? (
//                             displayedRows.map((row, idx) => (
//                                 <TableRow key={idx} sx={{ "&:nth-of-type(odd)": { background: "#fafafa" }, height: "auto" }}>
//                                     {columns.map((col) => {
//                                         const cellValue = row[col.key] || "-";
//                                         const isAdditionalRemarks = col.key === "additional_remarks";

//                                         return (
//                                             <TableCell 
//                                                 key={col.key} 
//                                                 sx={{ 
//                                                     fontSize: "12px",
//                                                     padding: "8px",
//                                                     whiteSpace: isAdditionalRemarks ? "normal" : "nowrap",
//                                                     overflow: isAdditionalRemarks ? "visible" : "hidden",
//                                                     textOverflow: isAdditionalRemarks ? "clip" : "ellipsis",
//                                                     maxWidth: isAdditionalRemarks ? "250px" : "auto",
//                                                     minWidth: isAdditionalRemarks ? "250px" : "auto",
//                                                     wordWrap: isAdditionalRemarks ? "break-word" : "normal",
//                                                     verticalAlign: "top",
//                                                 }}
//                                             >
//                                                 {isAdditionalRemarks && cellValue !== "-" ? (
//                                                     <Tooltip 
//                                                         title={cellValue}
//                                                         enterDelay={200}
//                                                         placement="top"
//                                                         arrow
//                                                     >
//                                                         <Box 
//                                                             sx={{ 
//                                                                 display: "-webkit-box",
//                                                                 WebkitLineClamp: 2,
//                                                                 WebkitBoxOrient: "vertical",
//                                                                 overflow: "hidden",
//                                                                 textOverflow: "ellipsis",
//                                                             }}
//                                                         >
//                                                             {cellValue}
//                                                         </Box>
//                                                     </Tooltip>
//                                                 ) : (
//                                                     cellValue
//                                                 )}
//                                             </TableCell>
//                                         );
//                                     })}
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell colSpan={columns.length} sx={{ textAlign: "center", py: 2, color: "#999" }}>
//                                     No records found matching the filter
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {/* Pagination */}
//             <TablePagination
//                 rowsPerPageOptions={[5, 10, 25, 50]}
//                 component="div"
//                 count={filteredData.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 sx={{ bgcolor: "#fafafa", borderTop: "1px solid #E0E0E0" }}
//             />
//         </Box>
//     );
// };

// // ✅ Dashboard Component - Shows Only Summary
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
//                 📊 Summary Overview
//             </Typography>

//             {/* Summary Statistics Grid */}
//             <Box sx={{ mb: 4 }}>
//                 <SummaryGrid summary={aggregated} />
//             </Box>

//             {/* Data Table with Pagination & Filter */}
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

//                             {/* ✅ Dashboard Component - Now Shows Summary Grid + Table with Pagination & Filter */}
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

import React, { useState, useEffect } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
    TextField, MenuItem, Select, InputLabel, FormControl, Divider,
    Chip, List, ListItem, ListItemText, Card, CardContent, Paper,
    Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, InputAdornment, Tooltip,
} from "@mui/material";
import {
    Upload as UploadIcon,
    DoDisturb as DoDisturbIcon,
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    Devices as DevicesIcon,
    SignalCellularNull as SignalIcon,
    CheckCircle as CheckIcon,
    TrendingUp as TrendingUpIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postDataa, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import { getDecreyptedData } from '../../../utils/localstorage'

// ✅ Updated: Added "All" as the first option in bandArray
const circleArray = ['AP','DL','TNCH', 'NESA','RJ','JK','BR','MH', 'MP','MU','JRK','KK','UE','UW','HPHP','OR','WB/KOL']
const bandArray = ['All', '4G', '5G', 'Accepted']
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
        total_records: "Total Records",
        workable: "Workable",
        non_workable: "Non-Workable",
        pending: "Pending",
        acceptance_pending: "Acceptance Pending",
        ready_to_offer: "Ready to Offer",
        alarm_hw: "Alarm/HW",
        under_observation: "Under Observation",
        under_exclusion: "Under Exclusion",
        days_21_30: "21-30 Days",
        days_30_60: "30-60 Days",
        days_over_60: ">60 Days",
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

const aggregateData = (dataArray) => {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return null;
    }

    const aggregated = {
        total_records: dataArray.length,
        workable: 0,
        non_workable: 0,
        pending: 0,
        acceptance_pending: 0,
        ready_to_offer: 0,
        alarm_hw: 0,
        under_observation: 0,
        under_exclusion: 0,
        days_21_30: 0,
        days_30_60: 0,
        days_over_60: 0,
    };

    dataArray.forEach((record) => {
        // Count by tag
        if (record.tag && record.tag.includes('Workable') && !record.tag.includes('Non')) {
            aggregated.workable++;
        } else if (record.tag && record.tag.includes('Non-workable')) {
            aggregated.non_workable++;
        }

        // Count by performance_status
        if (record.performance_status === 'Pending') {
            aggregated.pending++;
        } else if (record.performance_status === 'Acceptance Pending') {
            aggregated.acceptance_pending++;
        }

        // Count by bucket
        if (record.bucket === 'Ready to offer') {
            aggregated.ready_to_offer++;
        } else if (record.bucket === 'Alarm/HW') {
            aggregated.alarm_hw++;
        } else if (record.bucket === 'Under observation') {
            aggregated.under_observation++;
        } else if (record.bucket === 'Under exclusion') {
            aggregated.under_exclusion++;
        }

        // Count by TAT
        if (record.tat === '21-30days') {
            aggregated.days_21_30++;
        } else if (record.tat === '30-60days') {
            aggregated.days_30_60++;
        } else if (record.tat === '>60days') {
            aggregated.days_over_60++;
        }
    });

    return aggregated;
};

// ✅ Data Table Component with Pagination & Site ID Filter
const DataTable = ({ data }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [siteIdFilter, setSiteIdFilter] = useState("");

    if (!Array.isArray(data) || data.length === 0) {
        return null;
    }

    // Filter data by Site ID
    const filteredData = data.filter(row => 
        row.site_id && row.site_id.toString().toLowerCase().includes(siteIdFilter.toLowerCase())
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const columns = [
        { label: "AT Ref No", key: "at_ref_no" },
        { label: "Circle", key: "circle" },
        { label: "Site ID", key: "site_id" },
        { label: "SME Name", key: "sme_name" },
        { label: "Band", key: "band" },
        { label: "Offered Layer", key: "offered_layer" },
        { label: "OEM Name", key: "oem_name" },
        { label: "Integration Date", key: "integration_date" },
        { label: "MS1", key: "ms1" },
        { label: "Aging", key: "aging" },
        { label: "TAT", key: "tat" },
        { label: "Month", key: "month" },
        { label: "Project", key: "project" },
        { label: "Activity", key: "activity" },
        { label: "Status", key: "performance_status" },
        { label: "SCFT Status", key: "scft_status" },
        { label: "Additional Remarks", key: "additional_remarks" },
        { label: "Tag", key: "tag" },
        { label: "Workable Date", key: "workable_date" },
        { label: "Bucket", key: "bucket" },
    ];

    const displayedRows = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ mt: 4, mb: 3 }}>
            <Divider sx={{ mb: 3 }} />
            
            {/* Title & Filter Section */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#333" }}>
                    📋 Detailed Records ({filteredData.length} of {data.length} items)
                </Typography>
                <TextField
                    size="small"
                    placeholder="Filter by Site ID..."
                    value={siteIdFilter}
                    onChange={(e) => {
                        setSiteIdFilter(e.target.value);
                        setPage(0);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "#999" }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 220, bgcolor: "#fff" }}
                />
            </Box>

            {/* Table */}
            <TableContainer sx={{ border: "1px solid #E0E0E0", borderRadius: 2, overflowX: "auto" }}>
                <Table size="small" sx={{ tableLayout: "auto", minWidth: "100%" }}>
                    <TableHead>
                        <TableRow sx={{ background: "#f5f5f5", whiteSpace: "nowrap" }}>
                            {columns.map((col) => (
                                <TableCell 
                                    key={col.key} 
                                    sx={{ 
                                        fontWeight: 700, 
                                        fontSize: "12px",
                                        whiteSpace: "nowrap",
                                        minWidth: col.key === "additional_remarks" ? "250px" : "auto",
                                        padding: "8px",
                                    }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedRows.length > 0 ? (
                            displayedRows.map((row, idx) => (
                                <TableRow key={idx} sx={{ "&:nth-of-type(odd)": { background: "#fafafa" }, height: "auto" }}>
                                    {columns.map((col) => {
                                        const cellValue = row[col.key] || "-";
                                        const isAdditionalRemarks = col.key === "additional_remarks";

                                        return (
                                            <TableCell 
                                                key={col.key} 
                                                sx={{ 
                                                    fontSize: "12px",
                                                    padding: "8px",
                                                    whiteSpace: isAdditionalRemarks ? "normal" : "nowrap",
                                                    overflow: isAdditionalRemarks ? "visible" : "hidden",
                                                    textOverflow: isAdditionalRemarks ? "clip" : "ellipsis",
                                                    maxWidth: isAdditionalRemarks ? "250px" : "auto",
                                                    minWidth: isAdditionalRemarks ? "250px" : "auto",
                                                    wordWrap: isAdditionalRemarks ? "break-word" : "normal",
                                                    verticalAlign: "top",
                                                }}
                                            >
                                                {isAdditionalRemarks && cellValue !== "-" ? (
                                                    <Tooltip 
                                                        title={cellValue}
                                                        enterDelay={200}
                                                        placement="top"
                                                        arrow
                                                    >
                                                        <Box 
                                                            sx={{ 
                                                                display: "-webkit-box",
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: "vertical",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {cellValue}
                                                        </Box>
                                                    </Tooltip>
                                                ) : (
                                                    cellValue
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} sx={{ textAlign: "center", py: 2, color: "#999" }}>
                                    No records found matching the filter
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ bgcolor: "#fafafa", borderTop: "1px solid #E0E0E0" }}
            />
        </Box>
    );
};

// ✅ Dashboard Component - Shows Only Summary
const Dashboard = ({ reportResult }) => {
    if (!reportResult) return null;

    console.log("📊 Full Report Result:", reportResult);

    // Extract data array
    const dataArray = reportResult.data || [];
    console.log("📊 Data Array:", dataArray);

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return (
            <Box sx={{ mt: 4, mb: 3 }}>
                <Divider sx={{ mb: 3 }} />
                <Alert severity="info">
                    No detailed records in response. Download report to see data.
                </Alert>
            </Box>
        );
    }

    // Aggregate data
    const aggregated = aggregateData(dataArray);
    console.log("📊 Aggregated Data:", aggregated);

    if (!aggregated) {
        return (
            <Box sx={{ mt: 4, mb: 3 }}>
                <Divider sx={{ mb: 3 }} />
                <Alert severity="warning">
                    Unable to process data.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4, mb: 3 }}>
            <Divider sx={{ mb: 3 }} />

            {/* Dashboard Title */}
            <Typography sx={{
                fontWeight: 800,
                fontSize: "20px",
                color: "#006e74",
                mb: 3,
                textTransform: "uppercase",
                letterSpacing: 0.5,
            }}>
                📊 Summary Overview
            </Typography>

            {/* Summary Statistics Grid */}
            <Box sx={{ mb: 4 }}>
                <SummaryGrid summary={aggregated} />
            </Box>

            {/* Data Table with Pagination & Filter */}
            <DataTable data={dataArray} />
        </Box>
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

    const [reportSelectedKeys, setReportSelectedKeys] = useState([]);

    const formattedStartMonth = formatMonthToMMMYY(reportStartMonth);
    const formattedEndMonth = formatMonthToMMMYY(reportEndMonth);
    const bothMonthsPicked = reportStartMonth !== "" && reportEndMonth !== "";
    const isRangeOrderInvalid = bothMonthsPicked && !isChronologicalOrder(reportStartMonth, reportEndMonth);

    const handleReportSubmit = async () => {
        const rangeIsValid = bothMonthsPicked && isChronologicalOrder(reportStartMonth, reportEndMonth);
        const isValid = rangeIsValid;

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
        // ✅ Updated: Handle "All" option for band
        if (reportBand && reportBand !== 'All') {
            formData.append("band", reportBand);
        } else if (reportBand === 'All') {
            // Send "All" to the API if the user wants all bands
            formData.append("band", "All");
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

        console.log("🔍 Full API Response:", response);

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
                                            onChange={(e) => { 
                                                setReportBand(e.target.value); 
                                                setReportErrors((p) => ({ ...p, band: false })); 
                                            }}
                                        >
                                            {/* ✅ Updated: Map through bandArray which now includes "All" */}
                                            {bandArray.map((b) => (
                                                <MenuItem key={b} value={b}>
                                                    {b === 'All' ? 'All Bands' : b}
                                                </MenuItem>
                                            ))}
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
                                                    : Object.keys(reportResult.download_urls || {})
                                                ).map((key) => (
                                                    reportResult.download_urls?.[key] && (
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

                            {/* ✅ Dashboard Component - Now Shows Summary Grid + Table with Pagination & Filter */}
                            {reportResult && <Dashboard reportResult={reportResult} />}
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