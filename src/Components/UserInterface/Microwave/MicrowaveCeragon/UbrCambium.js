// import React, { useState, useEffect, useCallback } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
//     Tooltip,
// } from "@mui/material";
// import {
//     Upload as UploadIcon,
//     DoDisturb as DoDisturbIcon,
//     FileDownload as FileDownloadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// // ─── theme constants ────────────────────────────────────────────────────────
// const TEAL = "#2a77bf";
// const TEAL_DARK = "#28538c";

// // ─── base API host ──────────────────────────────────────────────────────────
// const BASE_URL = "https://commtoolapi.mcpspmis.com";

// const safeParseJson = async (res) => {
//     const text = await res.text();
//     if (!text) return {};
//     try { return JSON.parse(text); } catch { return {}; }
// };

// const isSuccessResponse = (res, data) => {
//     if (!res.ok) return false;
//     if (data == null) return true;
//     if (typeof data.status === "boolean") return data.status;
//     if (typeof data.success === "boolean") return data.success;
//     return true;
// };

// // ─── Single Link Budget Row (reused for Link Budget / TS-Tracker) ──────────
// // `files` is the array returned by the backend's GET endpoints:
// //   [{ file_name: "MW_LB_REPORT_....xlsx", download_url: "http://.../media/..." }]
// // Each file name is rendered as a real download link using `download_url`.
// const LinkBudgetRow = ({ label, files, onUpload, onDelete, showError, canDelete = true }) => (
//     <Box>
//         <Typography className="Front_Box_Hading" sx={{ mb: 1, fontWeight: 700, fontSize: 16 }}>
//             {label}
//         </Typography>
//         <Grid container alignItems="center" spacing={2}>
//             <Grid item>
//                 <Button variant="contained" component="label"
//                     sx={{ textTransform: "uppercase", fontWeight: 700 }}>
//                     Select File
//                     <input hidden type="file" multiple onChange={onUpload} />
//                 </Button>
//             </Grid>
//             <Grid item xs>
//                 {files.length > 0 ? (
//                     files.map((file, index) => (
//                         <Box
//                             key={file.download_url ?? file.file_name ?? index}
//                             display="flex"
//                             alignItems="center"
//                             gap={0.6}
//                         >
//                             <Link
//                                 href={file.download_url}
//                                 download={file.file_name}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 underline="hover"
//                                 sx={{ fontWeight: 600, color: "green", fontSize: 13, wordBreak: "break-all" }}
//                             >
//                                 {file.file_name}
//                             </Link>
//                             <Tooltip title="Download" arrow>
//                                 <FileDownloadIcon sx={{ fontSize: 16, color: "green" }} />
//                             </Tooltip>
//                         </Box>
//                     ))
//                 ) : (
//                     <Typography color="gray" fontSize={13}>No file uploaded.</Typography>
//                 )}
//             </Grid>
//             {canDelete && (
//                 <Grid item>
//                     <Button variant="contained"
//                         sx={{ backgroundColor: "#d32f2f", color: "white", textTransform: "uppercase", fontWeight: 700 }}
//                         disabled={!files.length} onClick={onDelete}>
//                         Delete
//                     </Button>
//                 </Grid>
//             )}
//         </Grid>
//         {showError && (
//             <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>This Field Is Required!</Typography>
//         )}
//     </Box>
// );

// // ─── Radio File Row ───────────────────────────────────────────────────────────
// // No standalone upload/fetch/delete API was given for this one — it's just a
// // local single-file picker. The file is attached directly to the "Generate
// // UBR Report" request (form field "radio_file") instead of being persisted
// // server-side on its own.
// const RadioFileRow = ({ label, file, onSelect, onClear, showError }) => (
//     <Box>
//         <Typography className="Front_Box_Hading" sx={{ mb: 1, fontWeight: 700, fontSize: 16 }}>
//             {label}
//         </Typography>
//         <Grid container alignItems="center" spacing={2}>
//             <Grid item>
//                 <Button variant="contained" component="label"
//                     sx={{ textTransform: "uppercase", fontWeight: 700 }}>
//                     Select File
//                     <input hidden type="file" onChange={onSelect} />
//                 </Button>
//             </Grid>
//             <Grid item xs>
//                 {file ? (
//                     <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#1a1a2e", wordBreak: "break-all" }}>
//                         {file.name}
//                     </Typography>
//                 ) : (
//                     <Typography color="gray" fontSize={13}>No file selected.</Typography>
//                 )}
//             </Grid>
//             {file && (
//                 <Grid item>
//                     <Button variant="contained"
//                         sx={{ backgroundColor: "#d32f2f", color: "white", textTransform: "uppercase", fontWeight: 700 }}
//                         onClick={onClear}>
//                         Remove
//                     </Button>
//                 </Grid>
//             )}
//         </Grid>
//         {showError && (
//             <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>This Field Is Required!</Typography>
//         )}
//     </Box>
// );

// // ═══════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// const UbrCambium = () => {
//     const classes = OverAllCss();
//     const navigate = useNavigate();
//     const { loading, action } = useLoadingDialog();

//     const [fileData, setFileData] = useState();
//     const [download, setDownload] = useState(false);

//     const [showError, setShowError] = useState({ budget: false, radio: false });

//     // ── 1. Link Budget File ──────────────────────────────────────────────────────
//     const LINK_BUDGET_API = `${BASE_URL}/ubr_cambium/linkbudget/`;

//     // linkFiles: [{ file_name, download_url }]
//     const [linkFiles, setLinkFiles] = useState([]);

//     const fetchLinkFiles = useCallback(async () => {
//         try {
//             const res = await fetch(LINK_BUDGET_API);
//             const data = await safeParseJson(res);
//             if (data?.status && Array.isArray(data.files)) setLinkFiles(data.files);
//             else setLinkFiles([]);
//         } catch { setLinkFiles([]); }
//     }, []);

//     useEffect(() => { fetchLinkFiles(); }, [fetchLinkFiles]);

//     const handleLinkFileUpload = async (e) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;
//         const formData = new FormData();
//         for (let i = 0; i < files.length; i++) formData.append("link_buget_file", files[i]);
//         action(true);
//         try {
//             const res = await fetch(LINK_BUDGET_API, { method: "POST", body: formData });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire("Success", data?.message || "Files Uploaded", "success");
//                 fetchLinkFiles();
//                 setShowError((prev) => ({ ...prev, budget: false }));
//             } else { Swal.fire("Error", data?.message || "Upload failed.", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong.", "error"); }
//         finally { action(false); }
//     };

//     const handleDeleteLinkFiles = async () => {
//         const result = await Swal.fire({
//             title: "Are you sure?", text: "This will permanently delete the link budget file.",
//             icon: "warning", showCancelButton: true, confirmButtonColor: "#d32f2f",
//             cancelButtonColor: "#1976d2", confirmButtonText: "Yes, delete", cancelButtonText: "Cancel",
//         });
//         if (!result.isConfirmed) return;
//         action(true);
//         try {
//             const res = await fetch(LINK_BUDGET_API, { method: "DELETE" });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire("Deleted!", data?.message || "File(s) deleted successfully.", "success");
//                 setLinkFiles([]);
//             } else { Swal.fire("Error", data?.message || "Delete failed", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong. Please try again.", "error"); }
//         finally { action(false); }
//     };

//     // ── 2. TS-Tracker File ───────────────────────────────────────────────────────
//     const TS_TRACKER_API = `${BASE_URL}/ubr_cambium/upload_traffic/`;

//     // tsFiles: [{ file_name, download_url }]
//     const [tsFiles, setTsFiles] = useState([]);

//     const fetchTsFiles = useCallback(async () => {
//         try {
//             const res = await fetch(TS_TRACKER_API);
//             const data = await safeParseJson(res);
//             if (data?.status && Array.isArray(data.files)) setTsFiles(data.files);
//             else setTsFiles([]);
//         } catch { setTsFiles([]); }
//     }, []);

//     useEffect(() => { fetchTsFiles(); }, [fetchTsFiles]);

//     const handleTsFileUpload = async (e) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;
//         const formData = new FormData();
//         for (let i = 0; i < files.length; i++) formData.append("ts_file", files[i]);
//         action(true);
//         try {
//             const res = await fetch(TS_TRACKER_API, { method: "POST", body: formData });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire("Success", data?.message || "Files Uploaded", "success");
//                 fetchTsFiles();
//             } else { Swal.fire("Error", data?.message || "Upload failed.", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong.", "error"); }
//         finally { action(false); }
//     };

//     const handleDeleteTsFiles = async () => {
//         const result = await Swal.fire({
//             title: "Are you sure?", text: "This will permanently delete the TS-Tracker file.",
//             icon: "warning", showCancelButton: true, confirmButtonColor: "#d32f2f",
//             cancelButtonColor: "#1976d2", confirmButtonText: "Yes, delete", cancelButtonText: "Cancel",
//         });
//         if (!result.isConfirmed) return;
//         action(true);
//         try {
//             const res = await fetch(TS_TRACKER_API, { method: "DELETE" });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire("Deleted!", data?.message || "File(s) deleted successfully.", "success");
//                 setTsFiles([]);
//             } else { Swal.fire("Error", data?.message || "Delete failed", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong. Please try again.", "error"); }
//         finally { action(false); }
//     };

//     // ── 3. Radio File ────────────────────────────────────────────────────────────
//     // No standalone API was given for this one (just the POST key "radio_file")
//     // — it's a local single-file picker, attached directly to the Generate UBR
//     // Report request below instead of being uploaded/fetched on its own.
//     const [radioFile, setRadioFile] = useState(null);

//     const handleRadioFileSelect = (e) => {
//         const file = e.target.files?.[0];
//         if (!file) return;
//         setRadioFile(file);
//         setShowError((prev) => ({ ...prev, radio: false }));
//         e.target.value = "";
//     };

//     const handleRadioFileClear = () => setRadioFile(null);

//     // ── Generate UBR Report ──────────────────────────────────────────────────────
//     // Fires only on Submit. POSTs the radio file and downloads the response as
//     // an .xlsx file.
//     const GENERATE_UBR_REPORT_API = `${BASE_URL}/ubr_cambium/cam_ubr/`;

//     const handleGenerateReport = async () => {
//         const hasBudget = linkFiles.length > 0;
//         const hasRadio = !!radioFile;
//         if (!hasBudget || !hasRadio) {
//             setShowError({ budget: !hasBudget, radio: !hasRadio });
//             return;
//         }
//         action(true);
//         try {
//             const formData = new FormData();
//             formData.append("radio_file", radioFile);
//             const res = await fetch(GENERATE_UBR_REPORT_API, { method: "POST", body: formData });
//             if (!res.ok) {
//                 const errData = await safeParseJson(res);
//                 Swal.fire("Oops...", errData?.message || "Failed to generate UBR report.", "error");
//                 return;
//             }
//             const blob = await res.blob();
//             // Pull the filename off Content-Disposition if the backend sends one,
//             // otherwise fall back to a sensible default.
//             const disposition = res.headers.get("Content-Disposition") || "";
//             const match = disposition.match(/filename="?([^"]+)"?/);
//             const filename = match ? match[1] : "UBR_Report.xlsx";

//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.href = url;
//             a.download = filename;
//             document.body.appendChild(a);
//             a.click();
//             a.remove();
//             window.URL.revokeObjectURL(url);

//             setDownload(true); setFileData(filename);
//             Swal.fire("Done", "UBR Report generated and downloaded.", "success");
//         } catch {
//             Swal.fire("Oops...", "Something went wrong generating the report.", "error");
//         } finally { action(false); }
//     };

//     const handleCancel = () => {
//         setRadioFile(null);
//         setDownload(false);
//         setShowError({ budget: false, radio: false });
//     };

//     // ─── render ───────────────────────────────────────────────────────────────────
//     return (
//         <>
//             <Box m={1} ml={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/microwave_soft_at")}>Microwave Soft_At</Link>
//                     <Typography color="text.primary">Microwave (Ceragon)</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Slide direction="left" in timeout={1000}>
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: "82%", xs: "100%" } }}>
//                             <Box className={classes.Box_Hading}>Make Microwave(Ceragon) Summary</Box>

//                             <Stack spacing={2} sx={{ mt: "-40px" }}>

//                                 {/* ── 1. LINK BUDGET FILE ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <LinkBudgetRow
//                                         label="Select Link Budget File:"
//                                         files={linkFiles}
//                                         onUpload={handleLinkFileUpload}
//                                         onDelete={handleDeleteLinkFiles}
//                                         showError={showError.budget}
//                                     />
//                                 </Box>

//                                 {/* ── 2. TS-TRACKER FILE ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <LinkBudgetRow
//                                         label="Select TS-Tracker File:"
//                                         files={tsFiles}
//                                         onUpload={handleTsFileUpload}
//                                         onDelete={handleDeleteTsFiles}
//                                         showError={false}
//                                     />
//                                 </Box>

//                                 {/* ── 3. RADIO FILE ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <RadioFileRow
//                                         label="Select Radio File:"
//                                         file={radioFile}
//                                         onSelect={handleRadioFileSelect}
//                                         onClear={handleRadioFileClear}
//                                         showError={showError.radio}
//                                     />
//                                 </Box>

//                             </Stack>

//                             {/* ── ACTION BUTTONS ── */}
//                             <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
//                                 <Button variant="contained" color="success" onClick={handleGenerateReport} endIcon={<UploadIcon />}
//                                     sx={{ fontWeight: 700, textTransform: "uppercase" }}>
//                                     Submit
//                                 </Button>
//                                 <Button variant="contained" onClick={handleCancel} endIcon={<DoDisturbIcon />}
//                                     sx={{ backgroundColor: "#d32f2f", color: "white", fontWeight: 700, textTransform: "uppercase" }}>
//                                     Cancel
//                                 </Button>
//                             </Stack>
//                         </Box>
//                     </Box>

//                     {/* ── DOWNLOAD CONFIRMATION ──
//                          The report is downloaded automatically as soon as it's generated
//                          (see handleGenerateReport), so this is just a confirmation —
//                          there's no persisted download_url to re-download from. */}
//                     {download && (
//                         <Box textAlign="center" mt={2} display="flex" alignItems="center" justifyContent="center" gap={1}>
//                             <FileDownloadIcon sx={{ fontSize: 24, color: "green" }} />
//                             <Typography sx={{ fontWeight: 700, fontSize: 15, color: "green" }}>
//                                 {fileData ? `Downloaded: ${fileData}` : "UBR Report downloaded."}
//                             </Typography>
//                         </Box>
//                     )}
//                 </Box>
//             </Slide>

//             {loading}
//         </>
//     );
// };

// export default UbrCambium;

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
    Tooltip,
} from "@mui/material";
import {
    Upload as UploadIcon,
    DoDisturb as DoDisturbIcon,
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ─── theme constants ────────────────────────────────────────────────────────
const TEAL = "#2a77bf";
const TEAL_DARK = "#28538c";

// ─── base API host ──────────────────────────────────────────────────────────
const BASE_URL = "https://commtoolapi.mcpspmis.com";

const safeParseJson = async (res) => {
    const text = await res.text();
    if (!text) return {};
    try { return JSON.parse(text); } catch { return {}; }
};

const isSuccessResponse = (res, data) => {
    if (!res.ok) return false;
    if (data == null) return true;
    if (typeof data.status === "boolean") return data.status;
    if (typeof data.success === "boolean") return data.success;
    return true;
};

// ─── Single Link Budget Row (reused for Link Budget / TS-Tracker) ──────────
// `files` is the array returned by the backend's GET endpoints:
//   [{ file_name: "MW_LB_REPORT_....xlsx", download_url: "http://.../media/..." }]
// Each file name is rendered as a real download link using `download_url`.
const LinkBudgetRow = ({ label, files, onUpload, onDelete, showError, canDelete = true }) => (
    <Box>
        <Typography className="Front_Box_Hading" sx={{ mb: 1, fontWeight: 700, fontSize: 16 }}>
            {label}
        </Typography>
        <Grid container alignItems="center" spacing={2}>
            <Grid item>
                <Button variant="contained" component="label"
                    sx={{ textTransform: "uppercase", fontWeight: 700 }}>
                    Select File
                    <input hidden type="file" multiple onChange={onUpload} />
                </Button>
            </Grid>
            <Grid item xs>
                {files.length > 0 ? (
                    files.map((file, index) => (
                        <Box
                            key={file.download_url ?? file.file_name ?? index}
                            display="flex"
                            alignItems="center"
                            gap={0.6}
                        >
                            <Link
                                href={file.download_url}
                                download={file.file_name}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                                sx={{ fontWeight: 600, color: "green", fontSize: 13, wordBreak: "break-all" }}
                            >
                                {file.file_name}
                            </Link>
                            <Tooltip title="Download" arrow>
                                <FileDownloadIcon sx={{ fontSize: 16, color: "green" }} />
                            </Tooltip>
                        </Box>
                    ))
                ) : (
                    <Typography color="gray" fontSize={13}>No file uploaded.</Typography>
                )}
            </Grid>
            {canDelete && (
                <Grid item>
                    <Button variant="contained"
                        sx={{ backgroundColor: "#d32f2f", color: "white", textTransform: "uppercase", fontWeight: 700 }}
                        disabled={!files.length} onClick={onDelete}>
                        Delete
                    </Button>
                </Grid>
            )}
        </Grid>
        {showError && (
            <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>This Field Is Required!</Typography>
        )}
    </Box>
);

// ─── Radio File Row ───────────────────────────────────────────────────────────
// No standalone upload/fetch/delete API was given for this one — it's just a
// local single-file picker. The file is attached directly to the "Generate
// UBR Report" request (form field "radio_file") instead of being persisted
// server-side on its own.
const RadioFileRow = ({ label, file, onSelect, onClear, showError }) => (
    <Box>
        <Typography className="Front_Box_Hading" sx={{ mb: 1, fontWeight: 700, fontSize: 16 }}>
            {label}
        </Typography>
        <Grid container alignItems="center" spacing={2}>
            <Grid item>
                <Button variant="contained" component="label"
                    sx={{ textTransform: "uppercase", fontWeight: 700 }}>
                    Select File
                    <input hidden type="file" onChange={onSelect} />
                </Button>
            </Grid>
            <Grid item xs>
                {file ? (
                    <Typography sx={{ fontWeight: 600, fontSize: 13, color: "#1a1a2e", wordBreak: "break-all" }}>
                        {file.name}
                    </Typography>
                ) : (
                    <Typography color="gray" fontSize={13}>No file selected.</Typography>
                )}
            </Grid>
            {file && (
                <Grid item>
                    <Button variant="contained"
                        sx={{ backgroundColor: "#d32f2f", color: "white", textTransform: "uppercase", fontWeight: 700 }}
                        onClick={onClear}>
                        Remove
                    </Button>
                </Grid>
            )}
        </Grid>
        {showError && (
            <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>This Field Is Required!</Typography>
        )}
    </Box>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const UbrCambium = () => {
    const classes = OverAllCss();
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();

    const [showError, setShowError] = useState({ budget: false, radio: false });

    // ── 1. Link Budget File ──────────────────────────────────────────────────────
    const LINK_BUDGET_API = `${BASE_URL}/ubr_cambium/linkbudget/`;

    // linkFiles: [{ file_name, download_url }]
    const [linkFiles, setLinkFiles] = useState([]);

    const fetchLinkFiles = useCallback(async () => {
        try {
            const res = await fetch(LINK_BUDGET_API);
            const data = await safeParseJson(res);
            if (data?.status && Array.isArray(data.files)) setLinkFiles(data.files);
            else setLinkFiles([]);
        } catch { setLinkFiles([]); }
    }, []);

    const linkFetchedRef = useRef(false);
    useEffect(() => {
        if (linkFetchedRef.current) return;
        linkFetchedRef.current = true;
        fetchLinkFiles();
    }, [fetchLinkFiles]);

    const handleLinkFileUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) formData.append("link_buget_file", files[i]);
        action(true);
        try {
            const res = await fetch(LINK_BUDGET_API, { method: "POST", body: formData });
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
                Swal.fire("Success", data?.message || "Files Uploaded", "success");
                fetchLinkFiles();
                setShowError((prev) => ({ ...prev, budget: false }));
            } else { Swal.fire("Error", data?.message || "Upload failed.", "error"); }
        } catch { Swal.fire("Error", "Something went wrong.", "error"); }
        finally { action(false); }
    };

    const handleDeleteLinkFiles = async () => {
        const result = await Swal.fire({
            title: "Are you sure?", text: "This will permanently delete the link budget file.",
            icon: "warning", showCancelButton: true, confirmButtonColor: "#d32f2f",
            cancelButtonColor: "#1976d2", confirmButtonText: "Yes, delete", cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) return;
        action(true);
        try {
            const res = await fetch(LINK_BUDGET_API, { method: "DELETE" });
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
                Swal.fire("Deleted!", data?.message || "File(s) deleted successfully.", "success");
                setLinkFiles([]);
            } else { Swal.fire("Error", data?.message || "Delete failed", "error"); }
        } catch { Swal.fire("Error", "Something went wrong. Please try again.", "error"); }
        finally { action(false); }
    };

    // ── 2. TS-Tracker File ───────────────────────────────────────────────────────
    const TS_TRACKER_API = `${BASE_URL}/ubr_cambium/upload_traffic/`;

    // tsFiles: [{ file_name, download_url }]
    const [tsFiles, setTsFiles] = useState([]);

    const fetchTsFiles = useCallback(async () => {
        try {
            const res = await fetch(TS_TRACKER_API);
            const data = await safeParseJson(res);
            if (data?.status && Array.isArray(data.files)) setTsFiles(data.files);
            else setTsFiles([]);
        } catch { setTsFiles([]); }
    }, []);

    const tsFetchedRef = useRef(false);
    useEffect(() => {
        if (tsFetchedRef.current) return;
        tsFetchedRef.current = true;
        fetchTsFiles();
    }, [fetchTsFiles]);

    const handleTsFileUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) formData.append("ts_file", files[i]);
        action(true);
        try {
            const res = await fetch(TS_TRACKER_API, { method: "POST", body: formData });
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
                Swal.fire("Success", data?.message || "Files Uploaded", "success");
                fetchTsFiles();
            } else { Swal.fire("Error", data?.message || "Upload failed.", "error"); }
        } catch { Swal.fire("Error", "Something went wrong.", "error"); }
        finally { action(false); }
    };

    const handleDeleteTsFiles = async () => {
        const result = await Swal.fire({
            title: "Are you sure?", text: "This will permanently delete the TS-Tracker file.",
            icon: "warning", showCancelButton: true, confirmButtonColor: "#d32f2f",
            cancelButtonColor: "#1976d2", confirmButtonText: "Yes, delete", cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) return;
        action(true);
        try {
            const res = await fetch(TS_TRACKER_API, { method: "DELETE" });
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
                Swal.fire("Deleted!", data?.message || "File(s) deleted successfully.", "success");
                setTsFiles([]);
            } else { Swal.fire("Error", data?.message || "Delete failed", "error"); }
        } catch { Swal.fire("Error", "Something went wrong. Please try again.", "error"); }
        finally { action(false); }
    };

    // ── 3. Radio File ────────────────────────────────────────────────────────────
    // No standalone API was given for this one (just the POST key "radio_file")
    // — it's a local single-file picker, attached directly to the Generate UBR
    // Report request below instead of being uploaded/fetched on its own.
    const [radioFile, setRadioFile] = useState(null);

    const handleRadioFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setRadioFile(file);
        setShowError((prev) => ({ ...prev, radio: false }));
        e.target.value = "";
    };

    const handleRadioFileClear = () => setRadioFile(null);

    // ── Generate UBR Report ──────────────────────────────────────────────────────
    // Fires only on Submit. POSTs the radio file and downloads the response as
    // an .xlsx file.
    const GENERATE_UBR_REPORT_API = `${BASE_URL}/ubr_cambium/cam_ubr/`;

    const handleGenerateReport = async () => {
        const hasBudget = linkFiles.length > 0;
        const hasRadio = !!radioFile;
        if (!hasBudget || !hasRadio) {
            setShowError({ budget: !hasBudget, radio: !hasRadio });
            return;
        }
        action(true);
        try {
            const formData = new FormData();
            formData.append("radio_file", radioFile);
            const res = await fetch(GENERATE_UBR_REPORT_API, { method: "POST", body: formData });
            const data = await safeParseJson(res);

            if (!isSuccessResponse(res, data) || !data?.download_url) {
                Swal.fire("Oops...", data?.message || "Failed to generate UBR report.", "error");
                return;
            }

            // Don't fetch(data.download_url) here — the media host doesn't send
            // CORS headers, so reading the response into a blob from JS fails
            // even though the request itself returns 200. Instead, just point a
            // link straight at the file: since .xlsx isn't browser-renderable,
            // the browser downloads it directly without needing to read the body.
            const filename = data.download_url.split("/").pop() || "UBR_Report.xlsx";
            const a = document.createElement("a");
            a.href = data.download_url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch {
            Swal.fire("Oops...", "Something went wrong generating the report.", "error");
        } finally { action(false); }
    };

    const handleCancel = () => {
        setRadioFile(null);
        setShowError({ budget: false, radio: false });
    };

    // ─── render ───────────────────────────────────────────────────────────────────
    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/microwave_soft_at")}>Microwave Soft_At</Link>
                    <Typography color="text.primary">Microwave (Ceragon)</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "82%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Make Cambium Report</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>

                                {/* ── 1. LINK BUDGET FILE ── */}
                                <Box className={classes.Front_Box}>
                                    <LinkBudgetRow
                                        label="Select Link Budget File:"
                                        files={linkFiles}
                                        onUpload={handleLinkFileUpload}
                                        onDelete={handleDeleteLinkFiles}
                                        showError={showError.budget}
                                    />
                                </Box>

                                {/* ── 2. TS-TRACKER FILE ── */}
                                <Box className={classes.Front_Box}>
                                    <LinkBudgetRow
                                        label="Select TS-Tracker File:"
                                        files={tsFiles}
                                        onUpload={handleTsFileUpload}
                                        onDelete={handleDeleteTsFiles}
                                        showError={false}
                                    />
                                </Box>

                                {/* ── 3. RADIO FILE ── */}
                                <Box className={classes.Front_Box}>
                                    <RadioFileRow
                                        label="Select Radio File:"
                                        file={radioFile}
                                        onSelect={handleRadioFileSelect}
                                        onClear={handleRadioFileClear}
                                        showError={showError.radio}
                                    />
                                </Box>

                            </Stack>

                            {/* ── ACTION BUTTONS ── */}
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
                                <Button variant="contained" color="success" onClick={handleGenerateReport} endIcon={<UploadIcon />}
                                    sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                                    Submit
                                </Button>
                                <Button variant="contained" onClick={handleCancel} endIcon={<DoDisturbIcon />}
                                    sx={{ backgroundColor: "#d32f2f", color: "white", fontWeight: 700, textTransform: "uppercase" }}>
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

export default UbrCambium;