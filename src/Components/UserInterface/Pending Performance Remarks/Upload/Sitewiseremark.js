
// import React, { useState, useEffect } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide,
//     TextField, MenuItem, Select, InputLabel, FormControl, Divider,
//     Chip, List, ListItem, ListItemText, Paper, Grid, Card, CardContent,
//     Alert,
// } from "@mui/material";
// import {
//     Upload as UploadIcon,
//     DoDisturb as DoDisturbIcon,
//     FileDownload as FileDownloadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postDataa } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// const circleArray = ['AP','DL','TNCH', 'NESA','RJ','JK','BR','MH', 'MP','MU','JRK','KK','UE','UW','HPHP','OR','WB/KOL'];
// const tagArray = ['Workable', 'Non Workable'];
// const bucketArray = [
//     "KPI AT Accepted",
//     "KPI AT Offered",
//     "Ready to offer",
//     "Waiting for 5 days KPI",
//     "Under observation",
//     "Optimization WIP",
//     "Under exclusion",
//     "Alarm/HW",
//     "Media Issue",
//     "Other AT",
//     "Site Down",
//     "Field Visit required",
//     "TWAMP Issue",
//     "Power Issue/RNA Poor",
//     "Access Issue",
//     "Event site/Dismantled",
// ];

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

// const Sitewiseremark = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();
//     const classes = OverAllCss();

//     // State variables
//     const [siteId, setSiteId] = useState("");
//     const [atRefNo, setAtRefNo] = useState("");
//     const [remarksCircle, setRemarksCircle] = useState("");
//     const [additionalRemarks, setAdditionalRemarks] = useState("");
//     const [tag, setTag] = useState("");
//     const [workableDate, setWorkableDate] = useState("");
//     const [nonWorkableDate, setNonWorkableDate] = useState("");
//     const [closureTatDate, setClosureTatDate] = useState("");
//     const [delayReason, setDelayReason] = useState("");
//     const [bucket, setBucket] = useState("");
//     const [remarksErrors, setRemarksErrors] = useState({
//         siteId: false,
//         circle: false,
//         tag: false,
//     });
//     const [remarksResult, setRemarksResult] = useState(null);

//     // Handle form submission
//     const handleRemarksSubmit = async () => {
//         // Validation
//         const isValid = siteId.trim() !== "" && remarksCircle !== "" && tag !== "";

//         if (!isValid) {
//             setRemarksErrors({
//                 siteId: siteId.trim() === "",
//                 circle: remarksCircle === "",
//                 tag: tag === "",
//             });
//             return;
//         }

//         try {
//             action(true);

//             const formData = new FormData();
//             formData.append("site_id", siteId.trim());
//             formData.append("at_ref_no", atRefNo.trim());
//             formData.append("circle", remarksCircle);
//             formData.append("additional_remarks", additionalRemarks.trim());
//             formData.append("tag", tag);
//             formData.append("workable_date", workableDate);
//             formData.append("non_workable_date", nonWorkableDate);
//             formData.append("closure_tat_date", closureTatDate);
//             formData.append("delay_reason", delayReason.trim());
//             formData.append("bucket", bucket);

//             const response = await postDataa("pending_performance_at_remarks/remarks/", formData);
//             action(false);

//             console.log("API Response:", response);

//             // Check if status is explicitly true for success
//             const isSuccess = response?.status === true || response?.status === "success";

//             if (isSuccess) {
//                 // SUCCESS CASE: Use `message` key from backend
//                 setRemarksResult(response);
//                 Swal.fire({
//                     icon: "success",
//                     title: "Done ✓",
//                     text: response.message || "Remarks added successfully",
//                     confirmButtonColor: "#198754",
//                 });
//             } else {
//                 // ERROR CASE: Use `error` key (with fallback to `message`) from backend
//                 const errorMessage = response?.error || response?.message || "Something went wrong";
                
//                 Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: errorMessage,
//                     confirmButtonColor: "#d32f2f",
//                 });
//                 setRemarksResult(null);
//             }
//         } catch (error) {
//             action(false);
//             console.error("Submit Error:", error);
            
//             const errorMessage = error?.error || error?.message || "Failed to submit remarks";
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: errorMessage,
//                 confirmButtonColor: "#d32f2f",
//             });
//             setRemarksResult(null);
//         }
//     };

//     // Handle form reset
//     const handleRemarksCancel = () => {
//         setSiteId("");
//         setAtRefNo("");
//         setRemarksCircle("");
//         setAdditionalRemarks("");
//         setTag("");
//         setWorkableDate("");
//         setNonWorkableDate("");
//         setClosureTatDate("");
//         setDelayReason("");
//         setBucket("");
//         setRemarksErrors({ siteId: false, circle: false, tag: false });
//         setRemarksResult(null);
//     };

//     useEffect(() => {
//         document.title = "Pending Performance AT Remarks";
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
//                     <Typography color="text.primary">Add Remarks</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Slide direction="left" in timeout={1000}>
//                 <Box>
//                     <StyledCard title="Add / Update Remarks" classes={classes}>
//                         <Stack spacing={2}>
//                             {/* Site ID */}
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Site ID:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <TextField
//                                         size="small"
//                                         placeholder="Enter Site ID"
//                                         value={siteId}
//                                         onChange={(e) => {
//                                             setSiteId(e.target.value);
//                                             setRemarksErrors((p) => ({ ...p, siteId: false }));
//                                         }}
//                                         sx={{ minWidth: 220, bgcolor: "#fff" }}
//                                     />
//                                     {remarksErrors.siteId && (
//                                         <span style={{ color: "red", fontSize: 14, fontWeight: 600, marginLeft: 10 }}>
//                                             This Field Is Required!
//                                         </span>
//                                     )}
//                                 </div>
//                             </Box>

//                             {/* Circle Selection */}
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Select Circle:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <FormControl sx={{ minWidth: 200 }}>
//                                         <InputLabel id="remarks-circle-label">Select Circle</InputLabel>
//                                         <Select
//                                             labelId="remarks-circle-label"
//                                             id="remarks-circle"
//                                             value={remarksCircle}
//                                             label="Select Circle"
//                                             onChange={(e) => {
//                                                 setRemarksCircle(e.target.value);
//                                                 setRemarksErrors((p) => ({ ...p, circle: false }));
//                                             }}
//                                         >
//                                             <MenuItem value="">
//                                                 <em>None</em>
//                                             </MenuItem>
//                                             {circleArray.map((c) => (
//                                                 <MenuItem key={c} value={c}>
//                                                     {c}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//                                     {remarksErrors.circle && (
//                                         <span style={{ color: "red", fontSize: 14, fontWeight: 600, marginLeft: 10 }}>
//                                             This Field Is Required!
//                                         </span>
//                                     )}
//                                 </div>
//                             </Box>

//                             {/* Additional Remarks */}
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Additional Remarks:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <TextField
//                                         size="small"
//                                         multiline
//                                         minRows={3}
//                                         placeholder="Enter additional remarks"
//                                         value={additionalRemarks}
//                                         onChange={(e) => setAdditionalRemarks(e.target.value)}
//                                         sx={{ minWidth: 300, bgcolor: "#fff" }}
//                                     />
//                                 </div>
//                             </Box>

//                             {/* AT Reference No */}
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>AT Reference No:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <TextField
//                                         size="small"
//                                         placeholder="Enter AT Reference No (e.g., AT-290474)"
//                                         value={atRefNo}
//                                         onChange={(e) => setAtRefNo(e.target.value)}
//                                         sx={{ minWidth: 220, bgcolor: "#fff" }}
//                                     />
//                                 </div>
//                             </Box>

//                             {/* Workable Date */}
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Workable Date:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <TextField
//                                         size="small"
//                                         type="date"
//                                         value={workableDate}
//                                         onChange={(e) => {
//                                             setWorkableDate(e.target.value);
//                                             if (e.target.value && tag === "Non Workable") {
//                                                 setTag("");
//                                             }
//                                         }}
//                                         sx={{ minWidth: 220, bgcolor: "#fff" }}
//                                         InputLabelProps={{ shrink: true }}
//                                         inputProps={{ placeholder: "yyyy-mm-dd" }}
//                                     />
//                                 </div>
//                             </Box>

//                             {/* Non-Workable Date */}
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Non-Workable Date:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <TextField
//                                         size="small"
//                                         type="date"
//                                         value={nonWorkableDate}
//                                         onChange={(e) => {
//                                             setNonWorkableDate(e.target.value);
//                                             if (e.target.value && tag === "Workable") {
//                                                 setTag("");
//                                             }
//                                         }}
//                                         sx={{ minWidth: 220, bgcolor: "#fff" }}
//                                         InputLabelProps={{ shrink: true }}
//                                         inputProps={{ placeholder: "yyyy-mm-dd" }}
//                                     />
//                                 </div>
//                             </Box>

//                             {/* Closure Tat Date */}
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Closure Tat Date:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <TextField
//                                         size="small"
//                                         type="date"
//                                         value={closureTatDate}
//                                         onChange={(e) => setClosureTatDate(e.target.value)}
//                                         sx={{ minWidth: 220, bgcolor: "#fff" }}
//                                         InputLabelProps={{ shrink: true }}
//                                         inputProps={{ placeholder: "yyyy-mm-dd" }}
//                                     />
//                                 </div>
//                             </Box>

//                             {/* Bucket Selection */}
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Select Bucket:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <FormControl sx={{ minWidth: 300 }}>
//                                         <InputLabel id="bucket-label">Select Bucket</InputLabel>
//                                         <Select
//                                             labelId="bucket-label"
//                                             id="bucket-select"
//                                             value={bucket}
//                                             label="Select Bucket"
//                                             onChange={(e) => setBucket(e.target.value)}
//                                         >
//                                             <MenuItem value="">
//                                                 <em>None</em>
//                                             </MenuItem>
//                                             {bucketArray.map((b) => (
//                                                 <MenuItem key={b} value={b}>
//                                                     {b}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//                                 </div>
//                             </Box>

//                             {/* Tag Selection with conditional logic */}
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Select Tag:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <FormControl sx={{ minWidth: 200 }}>
//                                         <InputLabel id="remarks-tag-label">Select Tag</InputLabel>
//                                         <Select
//                                             labelId="remarks-tag-label"
//                                             id="remarks-tag"
//                                             value={tag}
//                                             label="Select Tag"
//                                             onChange={(e) => {
//                                                 setTag(e.target.value);
//                                                 setRemarksErrors((p) => ({ ...p, tag: false }));
//                                             }}
//                                         >
//                                             <MenuItem value="">
//                                                 <em>None</em>
//                                             </MenuItem>
//                                             {tagArray.map((t) => (
//                                                 <MenuItem 
//                                                     key={t} 
//                                                     value={t}
//                                                     disabled={
//                                                         (t === "Non Workable" && workableDate) ||
//                                                         (t === "Workable" && nonWorkableDate)
//                                                     }
//                                                 >
//                                                     {t}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//                                     {remarksErrors.tag && (
//                                         <span style={{ color: "red", fontSize: 14, fontWeight: 600, marginLeft: 10 }}>
//                                             This Field Is Required!
//                                         </span>
//                                     )}
//                                 </div>
//                             </Box>

//                             {/* Result Display */}
//                             {remarksResult && (
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Result:</div>
//                                     <Alert severity="success" sx={{ p: 2 }}>
//                                         <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
//                                             ✓ Site <strong>{remarksResult.site_id}</strong> updated successfully
//                                         </Typography>
//                                         {remarksResult.updated_in && (
//                                             <Stack direction="row" spacing={1} flexWrap="wrap">
//                                                 {remarksResult.updated_in.map((band, i) => (
//                                                     <Chip key={i} label={band} color="success" size="small" sx={{ mb: 1 }} />
//                                                 ))}
//                                             </Stack>
//                                         )}
//                                     </Alert>
//                                 </Box>
//                             )}

//                             {/* Summary Card */}
//                             <Paper sx={{ p: 2, background: "#f8f9fa", border: "1px solid #e0e0e0" }}>
//                                 <Grid container spacing={2}>
//                                     <Grid item xs={12} sm={6} md={3}>
//                                         <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
//                                             Site ID
//                                         </Typography>
//                                         <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
//                                             {siteId || "-"}
//                                         </Typography>
//                                     </Grid>
//                                     <Grid item xs={12} sm={6} md={3}>
//                                         <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
//                                             Circle
//                                         </Typography>
//                                         <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
//                                             {remarksCircle || "-"}
//                                         </Typography>
//                                     </Grid>
//                                     <Grid item xs={12} sm={6} md={3}>
//                                         <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
//                                             Tag
//                                         </Typography>
//                                         <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
//                                             {tag || "-"}
//                                         </Typography>
//                                     </Grid>
//                                     <Grid item xs={12} sm={6} md={3}>
//                                         <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
//                                             Bucket
//                                         </Typography>
//                                         <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
//                                             {bucket || "-"}
//                                         </Typography>
//                                     </Grid>
//                                 </Grid>
//                             </Paper>
//                         </Stack>

//                         {/* Action Buttons */}
//                         <Stack
//                             direction={{ xs: "column", sm: "column", md: "row" }}
//                             spacing={2}
//                             justifyContent="space-around"
//                             mt={3}
//                         >
//                             <Button
//                                 variant="contained"
//                                 color="success"
//                                 onClick={handleRemarksSubmit}
//                                 endIcon={<UploadIcon />}
//                                 sx={{ minWidth: 150 }}
//                             >
//                                 Submit
//                             </Button>

//                             <Button
//                                 variant="contained"
//                                 onClick={handleRemarksCancel}
//                                 sx={{ backgroundColor: "red", color: "white", minWidth: 150 }}
//                                 endIcon={<DoDisturbIcon />}
//                             >
//                                 Cancel
//                             </Button>
//                         </Stack>
//                     </StyledCard>
//                 </Box>
//             </Slide>

//             {loading}
//         </>
//     );
// };

// export default Sitewiseremark;


import React, { useState, useEffect } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide,
    TextField, MenuItem, Select, InputLabel, FormControl, Divider,
    Chip, List, ListItem, ListItemText, Paper, Grid, Card, CardContent,
    Alert,
} from "@mui/material";
import {
    Upload as UploadIcon,
    DoDisturb as DoDisturbIcon,
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postDataa } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const circleArray = ['AP','DL','TNCH', 'NESA','RJ','JK','BR','MH', 'MP','MU','JRK','KK','UE','UW','HPHP','OR','WB/KOL'];
const tagArray = ['Workable', 'Non Workable'];
const bucketArray = [
    "KPI AT Accepted",
    "KPI AT Offered",
    "Ready to offer",
    "Waiting for 5 days KPI",
    "Under observation",
    "Optimization WIP",
    "Under exclusion",
    "Alarm/HW",
    "Media Issue",
    "Other AT",
    "Site Down",
    "Field Visit required",
    "TWAMP Issue",
    "Power Issue/RNA Poor",
    "Access Issue",
    "Event site/Dismantled",
];

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

const Sitewiseremark = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    // State variables
    const [siteId, setSiteId] = useState("");
    const [atRefNo, setAtRefNo] = useState("");
    const [remarksCircle, setRemarksCircle] = useState("");
    const [additionalRemarks, setAdditionalRemarks] = useState("");
    const [tag, setTag] = useState("");
    const [workableDate, setWorkableDate] = useState("");
    const [nonWorkableDate, setNonWorkableDate] = useState("");
    const [closureTatDate, setClosureTatDate] = useState("");
    const [delayReason, setDelayReason] = useState("");
    const [bucket, setBucket] = useState("");
    const [remarksErrors, setRemarksErrors] = useState({
        siteId: false,
        circle: false,
        tag: false,
    });
    const [remarksResult, setRemarksResult] = useState(null);

    // Handle form submission
    const handleRemarksSubmit = async () => {
        // Validation
        const isValid = siteId.trim() !== "" && remarksCircle !== "" && tag !== "";

        if (!isValid) {
            setRemarksErrors({
                siteId: siteId.trim() === "",
                circle: remarksCircle === "",
                tag: tag === "",
            });
            return;
        }

        try {
            action(true);

            const formData = new FormData();
            formData.append("site_id", siteId.trim());
            formData.append("at_ref_no", atRefNo.trim());
            formData.append("circle", remarksCircle);
            formData.append("additional_remarks", additionalRemarks.trim());
            formData.append("tag", tag);
            formData.append("workable_date", workableDate);
            formData.append("non_workable_date", nonWorkableDate);
            formData.append("closure_tat_date", closureTatDate);
            formData.append("delay_reason", delayReason.trim());
            formData.append("bucket", bucket);

            console.log("Submitting form data...");
            const response = await postDataa("pending_performance_at_remarks/remarks/", formData);
            action(false);

            console.log("API Response:", response);

            // ======== IMPROVED ERROR DETECTION ========
            // Check if response has an error key - this indicates failure
            // If no error key exists, treat as success (even if status is missing or false)
            // This handles cases where backend returns { message: "...", data: {...} }
            
            const hasErrorKey = response?.error !== undefined && response?.error !== null;
            const isExplicitSuccess = response?.status === true;
            const isExplicitFailure = response?.status === false && hasErrorKey;
            
            // Determine success: 
            // - If status is explicitly true → success
            // - If error key exists → failure
            // - Otherwise if we have a message → success (backend returned data)
            const isSuccess = isExplicitSuccess || (!hasErrorKey && response?.message);

            console.log("Response Analysis:", {
                hasErrorKey,
                isExplicitSuccess,
                isExplicitFailure,
                isSuccess,
                status: response?.status,
                error: response?.error,
                message: response?.message
            });

            if (isSuccess) {
                // ======== SUCCESS CASE ========
                setRemarksResult(response);
                
                const successMessage = response.message || "Remarks updated successfully!";
                
                Swal.fire({
                    icon: "success",
                    title: "Success ✓",
                    text: successMessage,
                    confirmButtonColor: "#198754",
                });
                
                console.log("Success! Response:", response);
            } else {
                // ======== ERROR CASE ========
                // Use error key first, then message, then generic message
                const errorMessage = response?.error || response?.message || "Failed to update remarks. Please try again.";
                
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorMessage,
                    confirmButtonColor: "#d32f2f",
                });
                
                setRemarksResult(null);
                console.error("Error! Response:", response);
            }
        } catch (error) {
            action(false);
            console.error("Submit Error:", error);
            
            // Extract error message from error object
            const errorMessage = error?.error || error?.message || error?.toString() || "Failed to submit form";
            
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
                confirmButtonColor: "#d32f2f",
            });
            
            setRemarksResult(null);
        }
    };

    // Handle form reset
    const handleRemarksCancel = () => {
        setSiteId("");
        setAtRefNo("");
        setRemarksCircle("");
        setAdditionalRemarks("");
        setTag("");
        setWorkableDate("");
        setNonWorkableDate("");
        setClosureTatDate("");
        setDelayReason("");
        setBucket("");
        setRemarksErrors({ siteId: false, circle: false, tag: false });
        setRemarksResult(null);
    };

    useEffect(() => {
        document.title = "Pending Performance AT Remarks";
    }, []);

    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")} sx={{ cursor: 'pointer' }}>
                        Tools
                    </Link>
                    <Link underline="hover" onClick={() => navigate("/tools/pending_performance_at_remarks")} sx={{ cursor: 'pointer' }}>
                        Pending Performance AT
                    </Link>
                    <Typography color="text.primary">Add Remarks</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <StyledCard title="Add / Update Remarks" classes={classes}>
                        <Stack spacing={2}>
                            {/* Site ID */}
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Site ID:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <TextField
                                        size="small"
                                        placeholder="Enter Site ID"
                                        value={siteId}
                                        onChange={(e) => {
                                            setSiteId(e.target.value);
                                            setRemarksErrors((p) => ({ ...p, siteId: false }));
                                        }}
                                        sx={{ minWidth: 220, bgcolor: "#fff" }}
                                    />
                                    {remarksErrors.siteId && (
                                        <span style={{ color: "red", fontSize: 14, fontWeight: 600, marginLeft: 10 }}>
                                            This Field Is Required!
                                        </span>
                                    )}
                                </div>
                            </Box>

                            {/* Circle Selection */}
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Circle:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <InputLabel id="remarks-circle-label">Select Circle</InputLabel>
                                        <Select
                                            labelId="remarks-circle-label"
                                            id="remarks-circle"
                                            value={remarksCircle}
                                            label="Select Circle"
                                            onChange={(e) => {
                                                setRemarksCircle(e.target.value);
                                                setRemarksErrors((p) => ({ ...p, circle: false }));
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {circleArray.map((c) => (
                                                <MenuItem key={c} value={c}>
                                                    {c}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {remarksErrors.circle && (
                                        <span style={{ color: "red", fontSize: 14, fontWeight: 600, marginLeft: 10 }}>
                                            This Field Is Required!
                                        </span>
                                    )}
                                </div>
                            </Box>

                            {/* Additional Remarks */}
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Additional Remarks:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <TextField
                                        size="small"
                                        multiline
                                        minRows={3}
                                        placeholder="Enter additional remarks"
                                        value={additionalRemarks}
                                        onChange={(e) => setAdditionalRemarks(e.target.value)}
                                        sx={{ minWidth: 300, bgcolor: "#fff" }}
                                    />
                                </div>
                            </Box>

                            {/* AT Reference No */}
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>AT Reference No:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <TextField
                                        size="small"
                                        placeholder="Enter AT Reference No (e.g., AT-290474)"
                                        value={atRefNo}
                                        onChange={(e) => setAtRefNo(e.target.value)}
                                        sx={{ minWidth: 220, bgcolor: "#fff" }}
                                    />
                                </div>
                            </Box>

                            {/* Workable Date */}
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Workable Date:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <TextField
                                        size="small"
                                        type="date"
                                        value={workableDate}
                                        onChange={(e) => {
                                            setWorkableDate(e.target.value);
                                            if (e.target.value && tag === "Non Workable") {
                                                setTag("");
                                            }
                                        }}
                                        sx={{ minWidth: 220, bgcolor: "#fff" }}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ placeholder: "yyyy-mm-dd" }}
                                    />
                                </div>
                            </Box>

                            {/* Non-Workable Date */}
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Non-Workable Date:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <TextField
                                        size="small"
                                        type="date"
                                        value={nonWorkableDate}
                                        onChange={(e) => {
                                            setNonWorkableDate(e.target.value);
                                            if (e.target.value && tag === "Workable") {
                                                setTag("");
                                            }
                                        }}
                                        sx={{ minWidth: 220, bgcolor: "#fff" }}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ placeholder: "yyyy-mm-dd" }}
                                    />
                                </div>
                            </Box>

                            {/* Closure Tat Date */}
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Closure Tat Date:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <TextField
                                        size="small"
                                        type="date"
                                        value={closureTatDate}
                                        onChange={(e) => setClosureTatDate(e.target.value)}
                                        sx={{ minWidth: 220, bgcolor: "#fff" }}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ placeholder: "yyyy-mm-dd" }}
                                    />
                                </div>
                            </Box>

                            {/* Bucket Selection */}
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Bucket:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <FormControl sx={{ minWidth: 300 }}>
                                        <InputLabel id="bucket-label">Select Bucket</InputLabel>
                                        <Select
                                            labelId="bucket-label"
                                            id="bucket-select"
                                            value={bucket}
                                            label="Select Bucket"
                                            onChange={(e) => setBucket(e.target.value)}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {bucketArray.map((b) => (
                                                <MenuItem key={b} value={b}>
                                                    {b}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </Box>

                            {/* Tag Selection with conditional logic */}
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Tag:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <InputLabel id="remarks-tag-label">Select Tag</InputLabel>
                                        <Select
                                            labelId="remarks-tag-label"
                                            id="remarks-tag"
                                            value={tag}
                                            label="Select Tag"
                                            onChange={(e) => {
                                                setTag(e.target.value);
                                                setRemarksErrors((p) => ({ ...p, tag: false }));
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {tagArray.map((t) => (
                                                <MenuItem 
                                                    key={t} 
                                                    value={t}
                                                    disabled={
                                                        (t === "Non Workable" && workableDate) ||
                                                        (t === "Workable" && nonWorkableDate)
                                                    }
                                                >
                                                    {t}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {remarksErrors.tag && (
                                        <span style={{ color: "red", fontSize: 14, fontWeight: 600, marginLeft: 10 }}>
                                            This Field Is Required!
                                        </span>
                                    )}
                                </div>
                            </Box>

                            {/* Result Display */}
                            {remarksResult && (
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Result:</div>
                                    <Alert severity="success" sx={{ p: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                                            ✓ Site <strong>{remarksResult.site_id}</strong> updated successfully
                                        </Typography>
                                        {remarksResult.updated_in && (
                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                {remarksResult.updated_in.map((band, i) => (
                                                    <Chip key={i} label={band} color="success" size="small" sx={{ mb: 1 }} />
                                                ))}
                                            </Stack>
                                        )}
                                    </Alert>
                                </Box>
                            )}

                            {/* Summary Card */}
                            <Paper sx={{ p: 2, background: "#f8f9fa", border: "1px solid #e0e0e0" }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
                                            Site ID
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                                            {siteId || "-"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
                                            Circle
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                                            {remarksCircle || "-"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
                                            Tag
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                                            {tag || "-"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
                                            Bucket
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                                            {bucket || "-"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Stack>

                        {/* Action Buttons */}
                        <Stack
                            direction={{ xs: "column", sm: "column", md: "row" }}
                            spacing={2}
                            justifyContent="space-around"
                            mt={3}
                        >
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleRemarksSubmit}
                                endIcon={<UploadIcon />}
                                sx={{ minWidth: 150 }}
                            >
                                Submit
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleRemarksCancel}
                                sx={{ backgroundColor: "red", color: "white", minWidth: 150 }}
                                endIcon={<DoDisturbIcon />}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </StyledCard>
                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default Sitewiseremark;