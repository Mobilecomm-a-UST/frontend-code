// import React, { useState, useEffect } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide,
//     TextField,
// } from "@mui/material";
// import {
//     Send as SendIcon,
//     DoDisturb as DoDisturbIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
//     CloudDownload as CloudDownloadIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postData } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// const DeletedSites = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();
//     const classes = OverAllCss();

//     // ======== STATE MANAGEMENT ========
//     const [siteIds, setSiteIds] = useState("");
//     const [atRefNos, setAtRefNos] = useState("");
//     const [reason, setReason] = useState("");
//     const [downloadUrl, setDownloadUrl] = useState("");
//     const [canDownload, setCanDownload] = useState(false);

//     // ======== HANDLE SUBMIT ========
//     const handleSubmit = async (e) => {
//         if (e) e.preventDefault();

//         if (!siteIds.trim() && !atRefNos.trim()) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "No Data Entered",
//                 text: "Please enter at least one Site ID or AT Reference No.",
//                 confirmButtonColor: "#ffc107",
//             });
//             return;
//         }

//         if (!reason.trim()) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Reason Required",
//                 text: "Please enter a reason.",
//                 confirmButtonColor: "#ffc107",
//             });
//             return;
//         }

//         action(true);

//         try {
//             const requestData = {
//                 site_id: siteIds.trim(),
//                 at_ref_no: atRefNos.trim(),
//                 reason: reason.trim(),
//             };

//             const response = await postData("pending_performance_at_remarks/deleted-site/", requestData);

//             action(false);

//             if (response && response.status) {
//                 let successText = response.message || "Submitted successfully!";
//                 Swal.fire({
//                     icon: "success",
//                     title: "Success",
//                     text: successText,
//                     confirmButtonColor: "#008080",
//                 });

//                 // Check if download_url is provided
//                 const val = response.download_url;
//                 const isDownloadAllowed = 
//                     val === true || 
//                     val === 1 || 
//                     (typeof val === 'string' && ['true', 'yes', '1'].includes(val.toLowerCase().trim()) || val.startsWith('http'));

//                 if (isDownloadAllowed) {
//                     setCanDownload(true);
//                     if (typeof val === 'string' && val.startsWith('http')) {
//                         setDownloadUrl(val);
//                     }
//                 }

//                 setSiteIds("");
//                 setAtRefNos("");
//                 setReason("");
//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: response?.error || response?.message || "Something went wrong.",
//                     confirmButtonColor: "#d32f2f",
//                 });
//             }

//         } catch (error) {
//             action(false);
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: error?.message || "Unable to process request.",
//                 confirmButtonColor: "#d32f2f",
//             });
//         }
//     };

//     // ======== HANDLE DOWNLOAD ========
//     const handleDownloadClick = async () => {
//         try {
//             if (downloadUrl) {
//                 window.open(downloadUrl, '_blank');
//             } else {
//                 window.open("pending_performance_at_remarks/deleted-site/", '_blank');
//             }
//         } catch (e) {
//             console.error('Error downloading report:', e);
//         }
//     };

//     // ======== HANDLE CANCEL ========
//     const handleCancel = () => {
//         setSiteIds("");
//         setAtRefNos("");
//         setReason("");
//         setCanDownload(false);
//         setDownloadUrl("");
//     };

//     useEffect(() => {
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
//     }, []);

//     return (
//         <>
//             <Box m={1} ml={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Typography color="text.primary">Deleted Sites</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Slide direction="left" in timeout={1000}>
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
//                             <Box className={classes.Box_Hading} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                 <span>Deleted Sites</span>
//                                 {canDownload && (
//                                     <Button
//                                         variant="contained"
//                                         size="small"
//                                         startIcon={<CloudDownloadIcon />}
//                                         onClick={handleDownloadClick}
//                                         sx={{ bgcolor: '#fff', color: '#006e74', '&:hover': { bgcolor: '#f0f0f0' } }}
//                                     >
//                                         Download Report
//                                     </Button>
//                                 )}
//                             </Box>

//                             <Stack spacing={2} sx={{ mt: "-40px" }}>

//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Enter AT Reference No(s):</div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <TextField
//                                             multiline
//                                             rows={2}
//                                             placeholder="Enter AT reference numbers separated by commas or new lines (e.g., AT-01, AT-02)"
//                                             value={atRefNos}
//                                             onChange={(e) => setAtRefNos(e.target.value)}
//                                             sx={{ width: "100%", bgcolor: "#fff" }}
//                                         />
//                                     </div>
//                                 </Box>

//                                 {/* ====== SITE ID SECTION ====== */}
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Enter Site ID(s):</div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <TextField
//                                             multiline
//                                             rows={2}
//                                             placeholder="Enter site IDs separated by commas or new lines (e.g., SITE01, SITE02)"
//                                             value={siteIds}
//                                             onChange={(e) => setSiteIds(e.target.value)}
//                                             sx={{ width: "100%", bgcolor: "#fff" }}
//                                         />
//                                     </div>
//                                 </Box>

//                                 {/* ====== REASON SECTION ====== */}
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Reason:</div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <TextField
//                                             multiline
//                                             rows={2}
//                                             placeholder="Enter reason..."
//                                             value={reason}
//                                             onChange={(e) => setReason(e.target.value)}
//                                             sx={{ width: "100%", bgcolor: "#fff" }}
//                                         />
//                                     </div>
//                                 </Box>

//                                 {/* ====== ACTION BUTTONS ====== */}
//                                 <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ ml: { md: 2, xs: 0 } }}>
//                                     <Button
//                                         variant="contained"
//                                         color="success"
//                                         onClick={handleSubmit}
//                                         endIcon={<SendIcon />}
//                                     >
//                                         Submit
//                                     </Button>
//                                 </Stack>
//                             </Stack>

//                             {/* ====== CANCEL BUTTON ====== */}
//                             <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="center" mt={3}>
//                                 <Button
//                                     variant="contained"
//                                     onClick={handleCancel}
//                                     sx={{ backgroundColor: "grey.500", color: "white" }}
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

// export default DeletedSites;

import React, { useState, useEffect } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide,
    TextField,
} from "@mui/material";
import {
    Send as SendIcon,
    DoDisturb as DoDisturbIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    CloudDownload as CloudDownloadIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const DeletedSites = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    // ======== STATE MANAGEMENT ========
    const [siteIds, setSiteIds] = useState("");
    const [atRefNos, setAtRefNos] = useState("");
    const [reason, setReason] = useState("");
    const [statusField, setStatusField] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");
    const [canDownload, setCanDownload] = useState(false);

    // ======== HANDLE SUBMIT ========
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!siteIds.trim() && !atRefNos.trim()) {
            Swal.fire({
                icon: "warning",
                title: "No Data Entered",
                text: "Please enter at least one Site ID or AT Reference No.",
                confirmButtonColor: "#ffc107",
            });
            return;
        }

        if (!statusField.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Status Required",
                text: "Please enter a status.",
                confirmButtonColor: "#ffc107",
            });
            return;
        }

        if (!reason.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Reason Required",
                text: "Please enter a reason.",
                confirmButtonColor: "#ffc107",
            });
            return;
        }

        action(true);

        try {
            const requestData = {
                site_id: siteIds.trim(),
                at_ref_no: atRefNos.trim(),
                status: statusField.trim(),
                reason: reason.trim(),
            };

            const response = await postData("pending_performance_at_remarks/deleted-site/", requestData);

            action(false);

            if (response && response.status) {
                let successText = response.message || "Submitted successfully!";
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: successText,
                    confirmButtonColor: "#008080",
                });

                // Check if download_url is provided
                const val = response.download_url;
                const isDownloadAllowed = 
                    val === true || 
                    val === 1 || 
                    (typeof val === 'string' && ['true', 'yes', '1'].includes(val.toLowerCase().trim()) || val.startsWith('http'));

                if (isDownloadAllowed) {
                    setCanDownload(true);
                    if (typeof val === 'string' && val.startsWith('http')) {
                        setDownloadUrl(val);
                    }
                }

                setSiteIds("");
                setAtRefNos("");
                setStatusField("");
                setReason("");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response?.error || response?.message || "Something went wrong.",
                    confirmButtonColor: "#d32f2f",
                });
            }

        } catch (error) {
            action(false);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.message || "Unable to process request.",
                confirmButtonColor: "#d32f2f",
            });
        }
    };

    // ======== HANDLE DOWNLOAD ========
    const handleDownloadClick = async () => {
        try {
            if (downloadUrl) {
                window.open(downloadUrl, '_blank');
            } else {
                window.open("pending_performance_at_remarks/deleted-site/", '_blank');
            }
        } catch (e) {
            console.error('Error downloading report:', e);
        }
    };

    // ======== HANDLE CANCEL ========
    const handleCancel = () => {
        setSiteIds("");
        setAtRefNos("");
        setStatusField("");
        setReason("");
        setCanDownload(false);
        setDownloadUrl("");
    };

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
    }, []);

    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Typography color="text.primary">Deleted Sites</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Deleted Sites</span>
                                {canDownload && (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<CloudDownloadIcon />}
                                        onClick={handleDownloadClick}
                                        sx={{ bgcolor: '#fff', color: '#006e74', '&:hover': { bgcolor: '#f0f0f0' } }}
                                    >
                                        Download Report
                                    </Button>
                                )}
                            </Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>

                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Enter AT Reference No(s):</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <TextField
                                            multiline
                                            rows={2}
                                            placeholder="Enter AT reference numbers separated by commas or new lines (e.g., AT-01, AT-02)"
                                            value={atRefNos}
                                            onChange={(e) => setAtRefNos(e.target.value)}
                                            sx={{ width: "100%", bgcolor: "#fff" }}
                                        />
                                    </div>
                                </Box>

                                {/* ====== SITE ID SECTION ====== */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Enter Site ID(s):</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <TextField
                                            multiline
                                            rows={2}
                                            placeholder="Enter site IDs separated by commas or new lines (e.g., SITE01, SITE02)"
                                            value={siteIds}
                                            onChange={(e) => setSiteIds(e.target.value)}
                                            sx={{ width: "100%", bgcolor: "#fff" }}
                                        />
                                    </div>
                                </Box>

                                {/* ====== STATUS SECTION ====== */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Status:</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <TextField
                                            multiline
                                            rows={2}
                                            placeholder="Enter status..."
                                            value={statusField}
                                            onChange={(e) => setStatusField(e.target.value)}
                                            sx={{ width: "100%", bgcolor: "#fff" }}
                                        />
                                    </div>
                                </Box>

                                {/* ====== REASON SECTION ====== */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Reason:</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <TextField
                                            multiline
                                            rows={2}
                                            placeholder="Enter reason..."
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            sx={{ width: "100%", bgcolor: "#fff" }}
                                        />
                                    </div>
                                </Box>

                                {/* ====== ACTION BUTTONS ====== */}
                                <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ ml: { md: 2, xs: 0 } }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleSubmit}
                                        endIcon={<SendIcon />}
                                    >
                                        Submit
                                    </Button>
                                </Stack>
                            </Stack>

                            {/* ====== CANCEL BUTTON ====== */}
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="center" mt={3}>
                                <Button
                                    variant="contained"
                                    onClick={handleCancel}
                                    sx={{ backgroundColor: "grey.500", color: "white" }}
                                    endIcon={<DoDisturbIcon />}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default DeletedSites;