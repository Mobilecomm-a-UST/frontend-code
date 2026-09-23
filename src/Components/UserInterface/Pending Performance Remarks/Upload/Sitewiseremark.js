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
//     'KPI AT Offered',
//     'Soft/Physical opti done/Under observation',
//     'Field Visit required',
//     'Ready to offer',
//     'Alarm/HW',
//     'Site Down',
//     'Old site working',
//     'Optimization WIP',
//     'Other AT',
//     'TWAMP Issue',
//     'Waiting for 5 days KPI',
//     'Media Issue',
//     'High Latency',
//     'Under exclusion',
//     'Physical visit planned',
//     'KPI AT Accepted',
//     'Power Issue/RNA Poor'

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
//     const [remarksCircle, setRemarksCircle] = useState("");
//     const [additionalRemarks, setAdditionalRemarks] = useState("");
//     const [tag, setTag] = useState("");
//     const [workableDate, setWorkableDate] = useState("");
//     const [delayReason, setDelayReason] = useState("");
//     const [bucket, setBucket] = useState("");
//     const [remarksErrors, setRemarksErrors] = useState({
//         siteId: false,
//         circle: false,
//         tag: false,
//     });
//     const [remarksResult, setRemarksResult] = useState(null);

//     // Check if error is authentication related
//     const isAuthenticationError = (errorMessage) => {
//         if (!errorMessage) return false;
//         const lowerMessage = errorMessage.toLowerCase();
//         return (
//             lowerMessage.includes("not authenticated") ||
//             lowerMessage.includes("not authorized") ||
//             lowerMessage.includes("permission denied") ||
//             lowerMessage.includes("unauthorized") ||
//             lowerMessage.includes("401") ||
//             lowerMessage.includes("403") ||
//             (lowerMessage.includes("user") && lowerMessage.includes("authenticated"))
//         );
//     };

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
//             formData.append("circle", remarksCircle);
//             formData.append("additional_remarks", additionalRemarks.trim());
//             formData.append("tag", tag);
//             formData.append("workable_date", workableDate);
//             formData.append("delay_reason", delayReason.trim());
//             formData.append("bucket", bucket);

//             const response = await postDataa("pending_performance_at_remarks/remarks/", formData);
//             action(false);

//             // Check if there's an authentication error
//             const hasAuthError = isAuthenticationError(response?.error);

//             // Check if response is successful - ONLY if status is true
//             if (response?.status === true && !hasAuthError) {
//                 setRemarksResult(response);
//                 Swal.fire({
//                     icon: "success",
//                     title: "Done",
//                     text: response.message || "Remarks added successfully",
//                     confirmButtonColor: "#198754",
//                 });
//             } else {
//                 // Show error from API
//                 const errorMessage = response?.error || response?.message || "Something went wrong";
//                 Swal.fire({
//                     icon: "error",
//                     title: "Oops...",
//                     text: errorMessage,
//                     confirmButtonColor: "#d32f2f",
//                 });
//                 setRemarksResult(null);
//             }
//         } catch (error) {
//             action(false);
//             // Show error from catch
//             const errorMessage = error?.message || "Failed to submit remarks";
//             Swal.fire({
//                 icon: "error",
//                 title: "Oops...",
//                 text: errorMessage,
//                 confirmButtonColor: "#d32f2f",
//             });
//             setRemarksResult(null);
//         }
//     };

//     // Handle form reset
//     const handleRemarksCancel = () => {
//         setSiteId("");
//         setRemarksCircle("");
//         setAdditionalRemarks("");
//         setTag("");
//         setWorkableDate("");
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

//                             {/* Workable Date */}
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Workable Date:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <TextField
//                                         size="small"
//                                         type="date"
//                                         value={workableDate}
//                                         onChange={(e) => setWorkableDate(e.target.value)}
//                                         sx={{ minWidth: 220, bgcolor: "#fff" }}
//                                         InputLabelProps={{ shrink: true }}
//                                         inputProps={{ placeholder: "yyyy-mm-dd" }}
//                                     />
//                                 </div>
//                             </Box>

//                             {/* Delay Reason */}
//                             {/* <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Delay Reason:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <TextField
//                                         size="small"
//                                         multiline
//                                         minRows={3}
//                                         placeholder="Enter delay reason"
//                                         value={delayReason}
//                                         onChange={(e) => setDelayReason(e.target.value)}
//                                         sx={{ minWidth: 300, bgcolor: "#fff" }}
//                                     />
//                                 </div>
//                             </Box> */}

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

//                             {/* Tag Selection */}
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
//                                                 <MenuItem key={t} value={t}>
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

//                             {/* Result Display - Only show on successful submission */}
//                             {remarksResult && (
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Result:</div>
//                                     <Alert severity="success" sx={{ p: 2 }}>
//                                         <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
//                                             Site <strong>{remarksResult.site_id}</strong> updated successfully
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
    'KPI AT Offered',
    'Soft/Physical opti done/Under observation',
    'Field Visit required',
    'Ready to offer',
    'Alarm/HW',
    'Site Down',
    'Old site working',
    'Optimization WIP',
    'Other AT',
    'TWAMP Issue',
    'Waiting for 5 days KPI',
    'Media Issue',
    'High Latency',
    'Under exclusion',
    'Physical visit planned',
    'KPI AT Accepted',
    'Power Issue/RNA Poor'
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
    const [remarksCircle, setRemarksCircle] = useState("");
    const [additionalRemarks, setAdditionalRemarks] = useState("");
    const [tag, setTag] = useState("");
    const [workableDate, setWorkableDate] = useState("");
    const [delayReason, setDelayReason] = useState("");
    const [bucket, setBucket] = useState("");
    const [remarksErrors, setRemarksErrors] = useState({
        siteId: false,
        circle: false,
        tag: false,
    });
    const [remarksResult, setRemarksResult] = useState(null);

    // Check if error is authentication related
    const isAuthenticationError = (errorMessage) => {
        if (!errorMessage) return false;
        const lowerMessage = errorMessage.toLowerCase();
        return (
            lowerMessage.includes("not authenticated") ||
            lowerMessage.includes("not authorized") ||
            lowerMessage.includes("permission denied") ||
            lowerMessage.includes("unauthorized") ||
            lowerMessage.includes("401") ||
            lowerMessage.includes("403") ||
            (lowerMessage.includes("user") && lowerMessage.includes("authenticated"))
        );
    };

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
            formData.append("circle", remarksCircle);
            formData.append("additional_remarks", additionalRemarks.trim());
            formData.append("tag", tag);
            formData.append("workable_date", workableDate);
            formData.append("delay_reason", delayReason.trim());
            formData.append("bucket", bucket);

            const response = await postDataa("pending_performance_at_remarks/remarks/", formData);
            action(false);

            console.log("API Response:", response); // Debug log to see what you're getting

            // ======== FIXED RESPONSE HANDLING ========
            // Check if response exists and has either status === true or status: "success" or similar
            const isSuccess = 
                response?.status === true || 
                response?.status === "success" ||
                (response && !isAuthenticationError(response?.error) && response?.message && response?.message.toLowerCase().includes("success"));

            if (isSuccess) {
                // SUCCESS CASE
                setRemarksResult(response);
                Swal.fire({
                    icon: "success",
                    title: "Done ✓",
                    text: response.message || "Remarks added successfully",
                    confirmButtonColor: "#198754",
                });
            } else {
                // ERROR CASE
                const errorMessage = response?.error || response?.message || "Something went wrong";
                
                // Check for authentication errors
                if (isAuthenticationError(errorMessage)) {
                    Swal.fire({
                        icon: "warning",
                        title: "Authentication Required",
                        text: errorMessage,
                        confirmButtonColor: "#ffc107",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: errorMessage,
                        confirmButtonColor: "#d32f2f",
                    });
                }
                setRemarksResult(null);
            }
        } catch (error) {
            action(false);
            console.error("Submit Error:", error); // Debug log
            
            const errorMessage = error?.message || "Failed to submit remarks";
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
        setRemarksCircle("");
        setAdditionalRemarks("");
        setTag("");
        setWorkableDate("");
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

                            {/* Workable Date */}
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Workable Date:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <TextField
                                        size="small"
                                        type="date"
                                        value={workableDate}
                                        onChange={(e) => setWorkableDate(e.target.value)}
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

                            {/* Tag Selection */}
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
                                                <MenuItem key={t} value={t}>
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

                            {/* Result Display - Only show on successful submission */}
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