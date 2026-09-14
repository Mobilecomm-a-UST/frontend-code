// import React, { useState, useEffect } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide,
//     TextField, MenuItem, Select, InputLabel, FormControl, Grid,
// } from "@mui/material";
// // ✅ Import all icons from @mui/icons-material
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import DownloadIcon from '@mui/icons-material/Download';
// import DoDisturbIcon from '@mui/icons-material/DoDisturb';
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postDataa } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import { getDecreyptedData } from "../../../utils/localstorage";

// const bandArray = ['4G', '5G', 'Accepted'];
// const archivedArray = ['Archived'];

// const DownloadCompleteReport = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();
//     const classes = OverAllCss();

//     // User info from localStorage
//     const userTypes = (getDecreyptedData('user_type')?.split(","))

//     // Check if user is QT_PPR


//     // State variables
//     const [selectedBand, setSelectedBand] = useState("");
//     const [archived, setArchived] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [errors, setErrors] = useState({
//         band: false,
//         startDate: false,
//         endDate: false,
//     });
//     const [reportData, setReportData] = useState(null);

//     // Handle form submission
//     const handleSubmit = async () => {
//         // Validation
//         const isValid = selectedBand !== "" && startDate !== "" && endDate !== "";

//         if (!isValid) {
//             setErrors({
//                 band: selectedBand === "",
//                 startDate: startDate === "",
//                 endDate: endDate === "",
//             });
//             return;
//         }

//         // Validate date range
//         if (new Date(startDate) > new Date(endDate)) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Invalid Date Range",
//                 text: "Start date must be before end date",
//             });
//             return;
//         }

//         try {
//             action(true);

//             const formData = new FormData();
//             formData.append("band", selectedBand);
//             formData.append("start_date", startDate);
//             formData.append("end_date", endDate);
//             formData.append("archived", archived);

//             // Add archived only if QT_PPR user selected it

//             formData.append("archived", archived);


//             const response = await postDataa(
//                 "pending_performance_at_remarks/download-report/",
//                 formData
//             );

//             action(false);

//             if (response?.status === true) {
//                 if (response.download_url) {
//                     // Download the file
//                     window.open(response.download_url, "_blank");
//                     Swal.fire({
//                         icon: "success",
//                         title: "Success",
//                         text: response.message || "Report downloaded successfully",
//                     });
//                 } else {
//                     Swal.fire({
//                         icon: "success",
//                         title: "Success",
//                         text: response.message || "Report generated successfully",
//                     });
//                 }
//                 setReportData(response);
//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: response?.message || "Failed to download report",
//                 });
//             }
//         } catch (error) {
//             action(false);
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: error.message || "Failed to download report",
//             });
//         }
//     };

//     // Handle form reset
//     const handleCancel = () => {
//         setSelectedBand("");
//         setArchived("");
//         setStartDate("");
//         setEndDate("");
//         setErrors({ band: false, startDate: false, endDate: false });
//         setReportData(null);
//     };

//     useEffect(() => {
//         document.title = "Download Report";
//     }, []);

//     return (
//         <>
//             <Box m={1} ml={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")} sx={{ cursor: 'pointer' }}>
//                         Tools
//                     </Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/pending_performance_at_remarks")} sx={{ cursor: 'pointer' }}>
//                         Pending Performance AT
//                     </Link>
//                     <Typography color="text.primary">Download Report</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Slide direction="left" in timeout={1000}>
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
//                             <Box className={classes.Box_Hading}>Download Report</Box>

//                             <Stack spacing={2} sx={{ mt: "-40px" }}>
//                                 {/* Select Band Row */}
//                                 <Grid container spacing={2}>
//                                     {/* Select Band */}
//                                     <Grid item xs={12} sm={6}>
//                                         <Box className={classes.Front_Box}>
//                                             <div className={classes.Front_Box_Hading}>Select Band:</div>
//                                             <div className={classes.Front_Box_Select_Button}>
//                                                 <FormControl sx={{ minWidth: "100%", maxWidth: 300 }}>
//                                                     <InputLabel id="band-label">Select Band</InputLabel>
//                                                     <Select
//                                                         labelId="band-label"
//                                                         id="band-select"
//                                                         value={selectedBand}
//                                                         label="Select Band"
//                                                         onChange={(e) => {
//                                                             setSelectedBand(e.target.value);
//                                                             setErrors((p) => ({ ...p, band: false }));
//                                                         }}
//                                                     >
//                                                         <MenuItem value="">
//                                                             <em>None</em>
//                                                         </MenuItem>
//                                                         {bandArray.map((b) => (
//                                                             <MenuItem key={b} value={b}>
//                                                                 {b}
//                                                             </MenuItem>
//                                                         ))}
//                                                     </Select>
//                                                 </FormControl>
//                                                 {errors.band && (
//                                                     <span style={{ color: "red", fontSize: 14, fontWeight: 600, marginLeft: 10 }}>
//                                                         This Field Is Required!
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         </Box>
//                                     </Grid>

//                                     {/* Overall Report (Archived) - Only for QT_PPR users */}
//                                     {!userTypes?.includes('QT_PPR') &&
//                                         <Grid item xs={12} sm={6}>
//                                             <Box className={classes.Front_Box}>
//                                                 <div className={classes.Front_Box_Hading}>Overall Report:</div>
//                                                 <div className={classes.Front_Box_Select_Button}>
//                                                     <FormControl sx={{ minWidth: "100%", maxWidth: 300 }}>
//                                                         <InputLabel id="archived-label">Select Status</InputLabel>
//                                                         <Select
//                                                             labelId="archived-label"
//                                                             id="archived-select"
//                                                             value={archived}
//                                                             label="Select Status"
//                                                             onChange={(e) => setArchived(e.target.value)}
//                                                         >
//                                                             <MenuItem value="">
//                                                                 <em>None</em>
//                                                             </MenuItem>
//                                                             {archivedArray.map((a) => (
//                                                                 <MenuItem key={a} value={a}>
//                                                                     {a}
//                                                                 </MenuItem>
//                                                             ))}
//                                                         </Select>
//                                                     </FormControl>
//                                                 </div>
//                                             </Box>
//                                         </Grid>}

//                                 </Grid>

//                                 {/* Date Range Selection */}
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Select Month Range:</div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
//                                             <Box>
//                                                 <Typography variant="caption" sx={{ color: "#666", fontWeight: 600, display: "block", mb: 0.5 }}>
//                                                     From
//                                                 </Typography>
//                                                 <TextField
//                                                     size="small"
//                                                     type="month"
//                                                     value={startDate}
//                                                     onChange={(e) => {
//                                                         setStartDate(e.target.value);
//                                                         setErrors((p) => ({ ...p, startDate: false }));
//                                                     }}
//                                                     InputLabelProps={{ shrink: true }}
//                                                     sx={{ minWidth: 200, bgcolor: "#fff" }}
//                                                     error={errors.startDate}
//                                                 />
//                                                 {errors.startDate && (
//                                                     <span style={{ color: "red", fontSize: 12, fontWeight: 600 }}>
//                                                         Required
//                                                     </span>
//                                                 )}
//                                             </Box>

//                                             <Typography sx={{ color: "#666", fontWeight: 600 }}>To</Typography>

//                                             <Box>
//                                                 <Typography variant="caption" sx={{ color: "#666", fontWeight: 600, display: "block", mb: 0.5 }}>
//                                                     To
//                                                 </Typography>
//                                                 <TextField
//                                                     size="small"
//                                                     type="month"
//                                                     value={endDate}
//                                                     onChange={(e) => {
//                                                         setEndDate(e.target.value);
//                                                         setErrors((p) => ({ ...p, endDate: false }));
//                                                     }}
//                                                     InputLabelProps={{ shrink: true }}
//                                                     sx={{ minWidth: 200, bgcolor: "#fff" }}
//                                                     error={errors.endDate}
//                                                 />
//                                                 {errors.endDate && (
//                                                     <span style={{ color: "red", fontSize: 12, fontWeight: 600 }}>
//                                                         Required
//                                                     </span>
//                                                 )}
//                                             </Box>
//                                         </Stack>
//                                     </div>
//                                 </Box>
//                             </Stack>

//                             {/* Action Buttons */}
//                             <Stack
//                                 direction={{ xs: "column", sm: "column", md: "row" }}
//                                 spacing={2}
//                                 justifyContent="space-around"
//                                 mt={3}
//                             >
//                                 <Button
//                                     variant="contained"
//                                     color="success"
//                                     onClick={handleSubmit}
//                                     endIcon={<DownloadIcon />}
//                                     sx={{ minWidth: 150 }}
//                                 >
//                                     Submit
//                                 </Button>

//                                 <Button
//                                     variant="contained"
//                                     onClick={handleCancel}
//                                     sx={{ backgroundColor: "red", color: "white", minWidth: 150 }}
//                                     endIcon={<DoDisturbIcon />}
//                                 >
//                                     Cancel
//                                 </Button>
//                             </Stack>
//                         </Box>
//                     </Box>
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
// // 3. download/              keys "band","start_month",   -> generate + download a report
// //                          "end_month"                   "start_month"/"end_month" are each
// //                          sent as "MMM-YY" (e.g. "Jan-26" / "Mar-26"),
// //                          covering the selected range.
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

// // Compares two native <input type="month"> values ("2026-01" vs "2026-03")
// // chronologically. Returns true when start is on or before end.
// const isChronologicalOrder = (startValue, endValue) => {
//     if (!startValue || !endValue) return false;
//     const [startYear, startMonth] = startValue.split('-').map((v) => parseInt(v, 10));
//     const [endYear, endMonth] = endValue.split('-').map((v) => parseInt(v, 10));
//     if (!startYear || !startMonth || !endYear || !endMonth) return false;
//     const startIndex = startYear * 12 + (startMonth - 1);
//     const endIndex = endYear * 12 + (endMonth - 1);
//     return startIndex <= endIndex;
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

// const DownloadCompleteReport = () => {
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
    
//     // Native month input values, e.g. "2026-01" / "2026-03" — each converted
//     // to "MMM-YY" on submit and sent as two separate fields: "start_month"
//     // and "end_month".
//     const [reportStartMonth, setReportStartMonth] = useState("");
//     const [reportEndMonth, setReportEndMonth] = useState("");
//     const [reportErrors, setReportErrors] = useState({ band: false, month: false, range: false });
//     const [reportResult, setReportResult] = useState(null);

//     // Live formatted previews + range validity, recomputed whenever either
//     // month input changes — used both for the submit guard and the helper
//     // text shown under the pickers.
//     const formattedStartMonth = formatMonthToMMMYY(reportStartMonth);
//     const formattedEndMonth = formatMonthToMMMYY(reportEndMonth);
//     const bothMonthsPicked = reportStartMonth !== "" && reportEndMonth !== "";
//     const isRangeOrderInvalid = bothMonthsPicked && !isChronologicalOrder(reportStartMonth, reportEndMonth);

//     const handleReportSubmit = async () => {
//         const rangeIsValid = bothMonthsPicked && isChronologicalOrder(reportStartMonth, reportEndMonth);
//         const isValid = reportBand !== "" && rangeIsValid;

//         if (!isValid) {
//             setReportErrors({
//                 band: reportBand === "",
//                 month: !bothMonthsPicked,
//                 range: bothMonthsPicked && !rangeIsValid,
//             });
//             return;
//         }

//         action(true);
//         const formData = new FormData();
//         formData.append("band", reportBand);
//         // Two separate fields, each "MMM-YY".
//         formData.append("start_month", formattedStartMonth);
//         formData.append("end_month", formattedEndMonth);
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
//         setReportStartMonth("");
//         setReportEndMonth("");
//         setReportErrors({ band: false, month: false, range: false });
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
//                                     {reportErrors.band && <div><span style={{ color: "red", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>This Field Is Required!</span></div>}
//                                 </div>
//                             </Box>

//                               <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Select Archived:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <FormControl sx={{ minWidth: 150 }}>
//                                         <InputLabel id="report-band-label">Select Archived</InputLabel>
//                                         <Select
//                                             labelId="report-band-label"
//                                             label="Select Archived"
//                                             value={reportBand}
//                                             onChange={(e) => { setReportBand(e.target.value); setReportErrors((p) => ({ ...p, band: false })); }}
//                                         >
//                                             {bandArray.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
//                                         </Select>
//                                     </FormControl>
//                                     {reportErrors.band && <div><span style={{ color: "red", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>This Field Is Required!</span></div>}
//                                 </div>
//                             </Box>

//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Select Month Range:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
//                                         {/* Native month picker — sent as "start_month". */}
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
//                                         {/* Native month picker — sent as "end_month". Its own min
//                                             is clamped to the start month so an inverted range
//                                             can't be picked in the first place. */}
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

//                             {reportResult?.download_url && (
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Report:</div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <DownloadButton url={reportResult?.download_url} label={`${reportResult?.band || ""} Report`} />
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

// ─────────────────────────────────────────────────────────────────────────────
// 5 APIs on this page (base: pending_performance_at_remarks/):
//
// 1. upload/              key "file"                  -> upload site data, returns a summary object
// 2. remarks/              keys "site_id","circle",     -> add/update remarks for a site
//                          "additional_remarks","tag"
// 3. download/              keys "band","start_month",   -> generate + download a report
//                          "end_month","archived"         "start_month"/"end_month" are each
//                          sent as "MMM-YY" (e.g. "Jan-26" / "Mar-26"),
//                          covering the selected range. "archived" is an
//                          optional single-choice flag ("Archived").
// 4. remarks-template/      key "circle"                 -> generate + download an input template
// 5. remarks-template/upload/  key "file"                -> upload a filled-in template back
//
// NOTE: circle list below is carried over from the other tool pages in this
// app plus "MU" confirmed by the template screenshot — confirm the full
// official list against the backend.
// ─────────────────────────────────────────────────────────────────────────────

const circleArray = ['AP', 'CH', 'KK', 'DL', 'HR', 'RJ', 'JK', 'WB', 'OD', 'MU', 'TNCH', 'UE', 'BH', 'UW', 'MP', 'PB', 'KO', 'JH', 'UPW']
const bandArray = ['4G', '5G','Accepted']
const archivedArray = ['Archived'] // ADDED: single-option list for the "Select Archived" dropdown

const tagArray = ['Workable', 'Non Workable']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Converts a native <input type="month"> value ("2026-01") into the
// "MMM-YY" format the backend expects ("Jan-26").
const formatMonthToMMMYY = (monthInputValue) => {
    if (!monthInputValue) return '';
    const [year, month] = monthInputValue.split('-');
    const idx = parseInt(month, 10) - 1;
    if (idx < 0 || idx > 11 || !year) return '';
    return `${MONTH_NAMES[idx]}-${year.slice(-2)}`;
};

// Compares two native <input type="month"> values ("2026-01" vs "2026-03")
// chronologically. Returns true when start is on or before end.
const isChronologicalOrder = (startValue, endValue) => {
    if (!startValue || !endValue) return false;
    const [startYear, startMonth] = startValue.split('-').map((v) => parseInt(v, 10));
    const [endYear, endMonth] = endValue.split('-').map((v) => parseInt(v, 10));
    if (!startYear || !startMonth || !endYear || !endMonth) return false;
    const startIndex = startYear * 12 + (startMonth - 1);
    const endIndex = endYear * 12 + (endMonth - 1);
    return startIndex <= endIndex;
};

// A single "card" matching the teal-gradient / pill-header style used across
// the other tool pages (main_Box / Back_Box / Box_Hading from OverAllCss).
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
    const [tag, setTag] = useState(""); // "Workable" | "Non Workable"
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

    // ADDED: separate state for the "Select Archived" dropdown (key: "archived")
    const [reportArchived, setReportArchived] = useState("");

    // Native month input values, e.g. "2026-01" / "2026-03" — each converted
    // to "MMM-YY" on submit and sent as two separate fields: "start_month"
    // and "end_month".
    const [reportStartMonth, setReportStartMonth] = useState("");
    const [reportEndMonth, setReportEndMonth] = useState("");
    const [reportErrors, setReportErrors] = useState({ band: false, month: false, range: false });
    const [reportResult, setReportResult] = useState(null);

    // Live formatted previews + range validity, recomputed whenever either
    // month input changes — used both for the submit guard and the helper
    // text shown under the pickers.
    const formattedStartMonth = formatMonthToMMMYY(reportStartMonth);
    const formattedEndMonth = formatMonthToMMMYY(reportEndMonth);
    const bothMonthsPicked = reportStartMonth !== "" && reportEndMonth !== "";
    const isRangeOrderInvalid = bothMonthsPicked && !isChronologicalOrder(reportStartMonth, reportEndMonth);

    const handleReportSubmit = async () => {
        const rangeIsValid = bothMonthsPicked && isChronologicalOrder(reportStartMonth, reportEndMonth);
        const isValid = reportBand !== "" && rangeIsValid;

        if (!isValid) {
            setReportErrors({
                band: reportBand === "",
                month: !bothMonthsPicked,
                range: bothMonthsPicked && !rangeIsValid,
            });
            return;
        }

        action(true);
        const formData = new FormData();
        formData.append("band", reportBand);
        // Two separate fields, each "MMM-YY".
        formData.append("start_month", formattedStartMonth);
        formData.append("end_month", formattedEndMonth);
        // ADDED: optional "archived" flag, only appended when selected
        if (reportArchived) {
            formData.append("archived", reportArchived);
        }
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
        setReportArchived(""); // ADDED: reset archived selection
        setReportStartMonth("");
        setReportEndMonth("");
        setReportErrors({ band: false, month: false, range: false });
        setReportResult(null);
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
                                    {reportErrors.band && <div><span style={{ color: "red", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>This Field Is Required!</span></div>}
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
                                        {/* Native month picker — sent as "start_month". */}
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
                                        {/* Native month picker — sent as "end_month". Its own min
                                            is clamped to the start month so an inverted range
                                            can't be picked in the first place. */}
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

                            {reportResult?.download_url && (
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Report:</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <DownloadButton url={reportResult?.download_url} label={`${reportResult?.band || ""} Report`} />
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