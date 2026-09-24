// import React, { useState, useEffect, useCallback } from "react";
// import { Box, Button, Stack } from "@mui/material";
// import { Breadcrumbs, Link, Typography } from "@mui/material";
// import {
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
// } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import { useNavigate } from "react-router-dom";
// import Slide from '@mui/material/Slide';
// import UploadIcon from '@mui/icons-material/Upload';
// import DoDisturbIcon from '@mui/icons-material/DoDisturb';
// import Swal from "sweetalert2";
// import { postData, ServerURL } from "../../../services/FetchNodeServices";
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import DnsIcon from '@mui/icons-material/Dns';
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import InputLabel from '@mui/material/InputLabel';
// import { getDecreyptedData } from "../../../utils/localstorage";

// /* ------------------------------------------------------------------ */
// /*  Theme — matched to the teal "Baseband Requirement" screens          */
// /* ------------------------------------------------------------------ */
// const C = {
//     teal: "#006e74",
//     tealDark: "#00494d",
//     headerBg: "#004d52",
//     labelOdd: "#e3f2f2",
//     labelEven: "#f2fafa",
//     border: "#c9dcdc",
//     valueText: "#0d3a3c",
//     zeroText: "#a7bcbc",
//     tick: "#1a7f37",
//     cross: "#c62828",
// };

// const HEADER_GRADIENT = "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)";

// const PINNED_KEY = "Site ID";

// const buildColumns = (rows) => {
//     if (!rows || !rows.length) return [];
//     const keySet = new Set();
//     rows.forEach((r) => Object.keys(r).forEach((k) => keySet.add(k)));
//     keySet.delete(PINNED_KEY);
//     return Array.from(keySet);
// };

// const isTickCross = (val) =>
//     typeof val === "string" && (val.trim().startsWith("✓") || val.trim() === "✗" || val.trim() === "X");

// const cellColor = (val) => {
//     if (typeof val === "string") {
//         const v = val.trim();
//         if (v.startsWith("✓")) return C.tick;
//         if (v === "✗" || v === "X") return C.cross;
//         if (v === "") return C.zeroText;
//     }
//     if (val === 0) return C.zeroText;
//     return C.valueText;
// };

// // Triggers a browser download for every URL in the array, staggered so
// // browsers don't block simultaneous downloads.
// // Opens every URL in its own new tab so cross-origin file responses download
// // correctly. A same-tab anchor click can't reliably force a download for a
// // different-origin URL (the "download" attribute is ignored cross-origin,
// // so it navigates instead) — and firing several such navigations back-to-back
// // cancels all but the last one. Separate tabs avoid that entirely.
// const autoDownloadAll = (urls) => {
//     if (!Array.isArray(urls)) return;
//     urls.forEach((url) => {
//         window.open(url, "_blank", "noopener,noreferrer");
//     });
// };

// /* ------------------------------------------------------------------ */
// /*  Results table shown below the download button                      */
// /* ------------------------------------------------------------------ */
// function BasebandResultTable({ rows }) {
//     const columns = buildColumns(rows);
//     const hasData = Array.isArray(rows) && rows.length > 0;

//     if (!hasData) return null;

//     return (
//         <Box sx={{ mt: 4, px: { xs: 1, md: 3 } }}>
//             <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${C.border}` }}>
//                 <Box
//                     sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                         px: 2,
//                         py: 1.25,
//                         background: HEADER_GRADIENT,
//                     }}
//                 >
//                     <DnsIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />
//                     <Typography
//                         variant="subtitle2"
//                         sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}
//                     >
//                         Baseband Site-wise Data
//                     </Typography>
//                 </Box>

//                 <TableContainer sx={{ maxHeight: 600 }}>
//                     <Table
//                         size="small"
//                         stickyHeader
//                         sx={{
//                             borderCollapse: "collapse",
//                             "& .MuiTableCell-root": { border: `1px solid ${C.border}`, py: 0.75, fontSize: 12.5 },
//                         }}
//                     >
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell
//                                     sx={{
//                                         position: "sticky",
//                                         left: 0,
//                                         top: 0,
//                                         zIndex: 6,
//                                         bgcolor: C.headerBg,
//                                         color: "#fff",
//                                         fontWeight: 700,
//                                         minWidth: 100,
//                                     }}
//                                 >
//                                     {PINNED_KEY}
//                                 </TableCell>
//                                 {columns.map((c) => (
//                                     <TableCell
//                                         key={c}
//                                         align="center"
//                                         sx={{
//                                             position: "sticky",
//                                             top: 0,
//                                             zIndex: 4,
//                                             bgcolor: C.teal,
//                                             color: "#fff",
//                                             fontWeight: 700,
//                                             whiteSpace: "nowrap",
//                                             minWidth: 90,
//                                         }}
//                                     >
//                                         {String(c).trim()}
//                                     </TableCell>
//                                 ))}
//                             </TableRow>
//                         </TableHead>

//                         <TableBody>
//                             {rows.map((row, i) => {
//                                 const labelBg = i % 2 === 0 ? C.labelOdd : C.labelEven;
//                                 return (
//                                     <TableRow key={row[PINNED_KEY] ?? i}>
//                                         <TableCell
//                                             sx={{
//                                                 position: "sticky",
//                                                 left: 0,
//                                                 zIndex: 2,
//                                                 bgcolor: labelBg,
//                                                 fontWeight: 700,
//                                                 color: C.tealDark,
//                                                 whiteSpace: "nowrap",
//                                             }}
//                                         >
//                                             {row[PINNED_KEY] ?? "—"}
//                                         </TableCell>
//                                         {columns.map((c) => {
//                                             const val = row[c];
//                                             const display = val === "" || val == null ? "—" : val;
//                                             return (
//                                                 <TableCell
//                                                     key={c}
//                                                     align="center"
//                                                     sx={{
//                                                         bgcolor: "#ffffff",
//                                                         fontVariantNumeric: "tabular-nums",
//                                                         color: cellColor(val),
//                                                         fontWeight: isTickCross(val) ? 800 : 600,
//                                                         whiteSpace: "nowrap",
//                                                     }}
//                                                 >
//                                                     {display}
//                                                 </TableCell>
//                                             );
//                                         })}
//                                     </TableRow>
//                                 );
//                             })}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Paper>
//         </Box>
//     );
// }

// const Ztemo = () => {
//     const [make4GFiles, setMake4GFiles] = useState([])
//     const [show4G, setShow4G] = useState(false)
//     const [fileData, setFileData] = useState([])
//     const [resultData, setResultData] = useState([]);
//     const { loading, action } = useLoadingDialog()
//     const navigate = useNavigate()
//     const classes = OverAllCss()


//     const handle4GFileSelection = (event) => {

//         setMake4GFiles(event.target.files)
//     }


//     const handleSubmit = async () => {
//         if (make4GFiles.length > 0) {
//             action(true)
//             var formData = new FormData();
//             for (let i = 0; i < make4GFiles.length; i++) {
//                 formData.append(`rf_file`, make4GFiles[i]);
//             }

//             const response = await postData('zte_vil/mo_creation/', formData)

//             // console.log('response data', response)


//             if (response.status === true) {
//                 action(false)

//                 const urls = Array.isArray(response.download_url) ? response.download_url : [];
//                 setFileData(urls)
//                 setResultData(Array.isArray(response.data) ? response.data : [])

//                 autoDownloadAll(urls); // auto-download every generated file, no button needed

//                 Swal.fire({
//                     icon: "success",
//                     title: "Done",
//                     text: `${response.message}`,
//                 });

//             } else {
//                 action(false)

//                 Swal.fire({
//                     icon: "error",
//                     title: "Oops...",
//                     text: `${response.message}`,
//                 });
//             }
//         }
//         else {
//             setShow4G(true);

//         }
//     }

//     const handleCancel = () => {
//         setMake4GFiles([])
//         setFileData([])
//         setResultData([])

//         setShow4G(false)

//     }

//     useEffect(() => {
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

//     }, [])
//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10 }}>
//                 <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
//                     <Link underline="hover" onClick={() => { navigate('/tools/soft_at_tools') }}>VI Soft-AT Tool</Link>
//                     <Typography color='text.primary'>Upload ZTE MO</Typography>
//                 </Breadcrumbs>
//             </div>
//             <Slide
//                 direction='left'
//                 in={true}
//                 // style={{ transformOrigin: '0 0 0' }}
//                 timeout={1000}
//             >
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>44
//                             <Box className={classes.Box_Hading} >
//                                 Create ZTE MO
//                             </Box>
//                             <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>

//                                 <Box className={classes.Front_Box} >
//                                     <div className={classes.Front_Box_Hading}>
//                                         Select File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{ }</span>
//                                     </div>
//                                     <div className={classes.Front_Box_Select_Button} >
//                                         <div style={{ float: "left" }}>
//                                             <Button variant="contained" component="label" color={make4GFiles.length > 0 ? "warning" : "primary"}>
//                                                 select file
//                                                 <input required hidden accept=".xlsx,.xls,.xlsm" multiple type="file"
//                                                     // webkitdirectory="true"
//                                                     // directory="true"
//                                                     onChange={(e) => { handle4GFileSelection(e); setShow4G(false); }} />
//                                             </Button>
//                                         </div>

//                                         {make4GFiles.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {make4GFiles.length}</span>}

//                                         <div>  <span style={{ display: show4G ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
//                                     </div>
//                                 </Box>
//                             </Stack>
//                             <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>

//                                 <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>

//                                 <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>

//                             </Stack>
//                         </Box>
//                     </Box>

//                     {/* results table showing the uploaded/parsed Baseband data, if the API returns "data" */}
//                     <BasebandResultTable rows={resultData} />
//                 </Box>
//             </Slide>
//             {loading}
//         </>
//     )
// }

// export default Ztemo


import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Card, CardContent, Grid, Typography, Alert, Paper } from "@mui/material";
import { Breadcrumbs, Link } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import { postData } from "../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import DnsIcon from '@mui/icons-material/Dns';
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Same color palette used in RecoReport, for a consistent look.
const COLORS = {
    primary: "#006e74",
    primaryDark: "#00494d",
    success: "#28a745",
    lightBg: "#f8f9fa",
    borderColor: "#c9dcdc",
    headerGradient: "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)",
};

// Pulls a readable filename out of a download URL for display.
const fileNameFromUrl = (url) => {
    try {
        return decodeURIComponent(url.split("/").filter(Boolean).pop() || url);
    } catch {
        return url;
    }
};

/* ================================================================ */
/*  Result display — mirrors RecoReport's pattern: files only open   */
/*  on a real button click (a genuine user gesture), never           */
/*  automatically. This is what makes RecoReport's download 100%     */
/*  reliable, and multi-file downloads need the same approach.       */
/* ================================================================ */
const MoResult = ({ message, urls }) => {
    if (!urls || urls.length === 0) return null;

    // Opens every file in its own tab. Because this runs synchronously
    // inside the button's onClick (a real user gesture), browsers allow
    // all of them — unlike opening them automatically after an API call.
    const handleDownloadAll = () => {
        urls.forEach((url) => {
            window.open(url, "_blank", "noopener,noreferrer");
        });
    };

    const handleDownloadOne = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <Box sx={{ mt: 2, p: 2, background: COLORS.lightBg, borderRadius: 1.5, border: `1px solid ${COLORS.borderColor}` }}>
            {message && (
                <Alert
                    icon={<CheckCircleIcon sx={{ fontSize: "18px" }} />}
                    severity="success"
                    sx={{ background: `${COLORS.success}15`, border: `1px solid ${COLORS.success}`, color: COLORS.success, fontWeight: 600, fontSize: "12px", mb: 2, py: 1, px: 1.5 }}
                >
                    ✓ {message}
                </Alert>
            )}

            <Button
                variant="contained"
                startIcon={<DownloadForOfflineIcon sx={{ fontSize: "18px" }} />}
                onClick={handleDownloadAll}
                sx={{ background: COLORS.primary, color: "#fff", fontWeight: 700, textTransform: "none", fontSize: "13px", px: 2.5, py: 1, borderRadius: 1, mb: 2, "&:hover": { background: COLORS.primaryDark } }}
            >
                Download All Files ({urls.length})
            </Button>

            <Paper sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.borderColor}`, overflow: "hidden" }}>
                <Box sx={{ background: COLORS.headerGradient, p: 1, display: "flex", alignItems: "center", gap: 0.8 }}>
                    <DnsIcon sx={{ color: "#fff", fontSize: 16 }} />
                    <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: 0.3 }}>
                        Generated Files
                    </Typography>
                </Box>
                <Stack spacing={1} sx={{ p: 1.5 }}>
                    {urls.map((url, idx) => (
                        <Button
                            key={idx}
                            variant="outlined"
                            startIcon={<FileDownloadIcon sx={{ fontSize: 16, color: COLORS.success }} />}
                            onClick={() => handleDownloadOne(url)}
                            sx={{ justifyContent: "flex-start", textTransform: "none", fontWeight: 600, fontSize: "12.5px", color: COLORS.primaryDark, borderColor: COLORS.borderColor }}
                        >
                            {fileNameFromUrl(url)}
                        </Button>
                    ))}
                </Stack>
            </Paper>
        </Box>
    );
};

const Ztemo = () => {
    // ✅ REMOVED: make2GFiles, setMake2GFiles
    // ✅ REMOVED: show2G, setShow2G
    const [make4GFiles, setMake4GFiles] = useState([]);
    const [show4G, setShow4G] = useState(false);
    const [download, setDownload] = useState(false);
    const [fileUrls, setFileUrls] = useState([]);
    const [resultMessage, setResultMessage] = useState("");
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    // ======== 4G FILE HANDLER ========
    const handle4GFileSelection = (event) => {
        setMake4GFiles(event.target.files);
    };

    // ✅ REMOVED: handle2GFileSelection function

    // ======== SUBMIT HANDLER ========
    const handleSubmit = async () => {
        // ======== VALIDATION ========
        if (make4GFiles.length === 0) {
            setShow4G(true);
            return;
        }

        action(true);

        try {
            // ======== PREPARE 4G DATA ========
            const formData4G = new FormData();
            for (let i = 0; i < make4GFiles.length; i++) {
                formData4G.append("rf_file", make4GFiles[i]);
            }

            // ✅ REMOVED: 2G form data preparation
            // ✅ REMOVED: 2G file submission

            // ======== SUBMIT 4G FILES ========
            const response4G = await postData('zte_vil/mo_creation/', formData4G);

            action(false);

            // ======== HANDLE RESPONSE ========
            // ✅ SIMPLIFIED: Now only handles 4G response
            if (response4G?.status) {
                const all4GUrls = Array.isArray(response4G.download_url) ? response4G.download_url : [];

                setDownload(true);
                setFileUrls(all4GUrls);
                setResultMessage(response4G.message || 'Files processed successfully');

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response4G.message || "Files processed successfully"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: response4G?.message || "Failed to process files"
                });
            }
        } catch (error) {
            action(false);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.message || "Failed to process files"
            });
        }
    };

    // ======== CANCEL HANDLER ========
    const handleCancel = () => {
        setMake4GFiles([]);
        // ✅ REMOVED: setMake2GFiles([])
        setDownload(false);
        setFileUrls([]);
        setResultMessage("");
        setShow4G(false);
        // ✅ REMOVED: setShow2G(false)
    };

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
    }, []);

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/ix_tools') }}>IX Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/ix_tools/vi_integration') }}>VI Tracker</Link>
                    <Typography color='text.primary'>Upload ZTE MO</Typography>
                </Breadcrumbs>
            </div>

            <Slide direction='left' in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                            <Box className={classes.Box_Hading}>Create ZTE MO Summary</Box>

                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                                {/* ====== 4G FILE SELECTION ====== */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select File:
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                color={make4GFiles.length > 0 ? "warning" : "primary"}
                                            >
                                                select file
                                                <input
                                                    required
                                                    hidden
                                                    accept=".xlsx,.xls,.xlsm"
                                                    multiple
                                                    type="file"
                                                    onChange={(e) => { handle4GFileSelection(e); setShow4G(false); }}
                                                />
                                            </Button>
                                        </div>
                                        {make4GFiles.length > 0 && (
                                            <span style={{ color: 'green', fontSize: '18px', fontWeight: 600, marginLeft: '15px' }}>
                                                Selected File(s): {make4GFiles.length}
                                            </span>
                                        )}
                                        <div>
                                            <span
                                                style={{
                                                    display: show4G ? 'inherit' : 'none',
                                                    color: 'red',
                                                    fontSize: '18px',
                                                    fontWeight: 600,
                                                    marginLeft: '15px'
                                                }}
                                            >
                                                This Field Is Required!
                                            </span>
                                        </div>
                                    </div>
                                </Box>

                                {/* ✅ REMOVED: 2G FILE SELECTION SECTION */}
                            </Stack>

                            {/* ====== ACTION BUTTONS ====== */}
                            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSubmit}
                                    endIcon={<UploadIcon />}
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleCancel}
                                    style={{ backgroundColor: "red", color: 'white' }}
                                    endIcon={<DoDisturbIcon />}
                                >
                                    Cancel
                                </Button>
                            </Stack>

                            {/* ====== RESULT DISPLAY ====== */}
                            {download && <MoResult message={resultMessage} urls={fileUrls} />}
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default Ztemo;