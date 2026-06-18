// import React, { useState, useEffect, useCallback } from "react";
// import { Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid, } from "@mui/material";
// import {
//   Upload as UploadIcon, DoDisturb as DoDisturbIcon, FileDownload as FileDownloadIcon, KeyboardArrowRight as KeyboardArrowRightIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postData, getData,ServerURL } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import 'rsuite/dist/rsuite.min.css';
// import axios from 'axios';


// const MicrowaveCeragonUpload = () => {
//   const classes = OverAllCss();
//   const navigate = useNavigate();
//   const { loading, action } = useLoadingDialog();


//   const [report_File, setReport_File] = useState({ filename: "", bytes: "" });
//   const [radio_File, setRadio_File] = useState({ filename: "", bytes: "" });

//   const [fileData, setFileData] = useState();
//   const [download, setDownload] = useState(false);

//   const [showError, setShowError] = useState({
//     budget: false,
//     report: false,
//     radio: false,
//   });


//   const [linkFiles, setLinkFiles] = useState([]);
//   const fetchLinkFiles = useCallback(async () => {
//     const res = await getData("mw_app/linkfile/");
//     if (res?.status && Array.isArray(res.files)) {
//       setLinkFiles(res.files);
//     } else {
//       setLinkFiles([]);
//     }
//   }, []);

//   useEffect(() => {
//     fetchLinkFiles();
//   }, [fetchLinkFiles]);

//   const handleLinkFileUpload = async (e) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     const formData = new FormData();
//     for (let i = 0; i < files.length; i++) {
//       formData.append("link_buget_file", files[i]);
//     }

//     action(true);
//     const res = await postData("mw_app/linkfile/", formData);
//     action(false);

//     if (res.status) {
//       Swal.fire("Success", "Files Uploaded", "success");
//       fetchLinkFiles();
//       setShowError((prev) => ({ ...prev, budget: false }));
//     } else {
//       Swal.fire("Error", res.message, "error");
//     }
//   };


//   const handleDeleteLinkFiles = async () => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "This will permanently  link budget file.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d32f2f",
//       cancelButtonColor: "#1976d2",
//       confirmButtonText: "Yes, delete",
//       cancelButtonText: "Cancel",
//     });

//     if (!result.isConfirmed) return;
//     action(true);

//     try {
//       const res = await fetch(`${ServerURL}/mw_app/linkfile/`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },

//       });

//       const data = await res.json();

//       if (res.ok && data.status) {
//         Swal.fire("Deleted!", "File(s) deleted successfully.", "success");
//         setLinkFiles([]);
//       } else {
//         Swal.fire("Error", data?.message || "Delete failed", "error");
//       }
//     } catch (error) {
//       Swal.fire("Error", "Something went wrong. Please try again.", "error");
//       console.error("Delete error:", error);
//     } finally {
//       action(false);
//     }
//   };




//   const updateFile = (event, setFileState, errorKey) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       setShowError((prev) => ({ ...prev, [errorKey]: false }));
//       setFileState({
//         filename: files.length,
//         bytes: files,
//       });
//     }
//   };

//   const handleSubmit = async () => {
//     const isValid =
//       linkFiles.length > 0 &&
//       report_File.bytes.length &&
//       radio_File.bytes.length;

//     if (!isValid) {
//       setShowError({
//         budget: !linkFiles.length,
//         report: !report_File.bytes.length,
//         radio: !radio_File.bytes.length,
//       });
//       return;
//     }

//     action(true);
//     const formData = new FormData();

//     for (let j = 0; j < report_File.bytes.length; j++) {
//       formData.append("link_report_file", report_File.bytes[j]);
//     }

//     for (let k = 0; k < radio_File.bytes.length; k++) {
//       formData.append("radio_report_file", radio_File.bytes[k]);
//     }

//     const response = await postData("mw_app/microwave/", formData);
//     action(false);

//     if (response.status) {
//       setDownload(true);
//       setFileData(response.download_url);
//       Swal.fire("Done", response.message, "success");
//     } else {
//       Swal.fire("Oops...", response.message, "error");
//     }
//   };

//   const handleCancel = () => {
//     setReport_File({ filename: "", bytes: "" });
//     setRadio_File({ filename: "", bytes: "" });
//     setDownload(false);
//     setShowError({ budget: false, report: false, radio: false });
//   };

//   return (
//     <>
//       <Box m={1} ml={2}>
//         <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//           <Link underline="hover" onClick={() => navigate("/tools")}>
//             Tools
//           </Link>
//           <Link underline="hover" onClick={() => navigate("/tools/microwave_soft_at")}>
//             Microwave Soft_At
//           </Link>
//           <Typography color="text.primary">Microwave(Ceragon)</Typography>
//         </Breadcrumbs>
//       </Box>

//       <Slide direction="left" in timeout={1000}>
//         <Box>
//           <Box className={classes.main_Box}>
//             <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
//               <Box className={classes.Box_Hading}>
//                 Make Microwave(AVIAT) Summary
//               </Box>

//               <Stack spacing={2} sx={{ mt: "-40px" }}>
//                 {/* -------- LINK BUDGET FILE (MULTIPLE) -------- */}
//                 <Box className={classes.Front_Box}>
//                   <div className={classes.Front_Box_Hading}>
//                     Select Link Budget File:
//                   </div>

//                   <Grid container alignItems="center" spacing={2}>
//                     {/* LEFT → Upload */}
//                     <Grid item>
//                       <Button variant="contained" component="label">
//                         select file
//                         <input
//                           hidden
//                           type="file"
//                           multiple
//                           onChange={handleLinkFileUpload}
//                         />
//                       </Button>
//                     </Grid>

//                     {/* CENTER → FILE NAMES */}
//                     <Grid item xs>
//                       {linkFiles.length > 0 ? (
//                         linkFiles.map((file, index) => (
//                           <Typography
//                             key={index}
//                             fontWeight={600}
//                             color="green"
//                           >
//                             {file}
//                           </Typography>
//                         ))
//                       ) : (
//                         <Typography color="gray">
//                           No file uploaded.
//                         </Typography>
//                       )}
//                     </Grid>

//                     {/* RIGHT → DELETE */}
//                     <Grid item>
//                       <Button
//                         variant="contained"
//                         sx={{ backgroundColor: "red", color: "white" }}
//                         disabled={!linkFiles.length}
//                         onClick={handleDeleteLinkFiles}
//                       >
//                         Delete
//                       </Button>
//                     </Grid>
//                   </Grid>

//                   {showError.budget && (
//                     <Typography color="red" fontWeight={600}>
//                       This Field Is Required!
//                     </Typography>
//                   )}
//                 </Box>


//                 <UploadSection
//                   label="Select Dump"
//                   color={report_File.filename ? "warning" : "primary"}
//                   onChange={(e) => updateFile(e, setReport_File, "report")}
//                   error={showError.report}
//                   selectedText={report_File.filename}
//                 />

//                 {/* <UploadSection
//                   label="Select Radio Report File"
//                   color={radio_File.filename ? "warning" : "primary"}
//                   onChange={(e) => updateFile(e, setRadio_File, "radio")}
//                   error={showError.radio}
//                   selectedText={radio_File.filename}
//                 /> */}
//               </Stack>

//               <Stack
//                 direction={{ xs: "column", md: "row" }}
//                 spacing={2}
//                 justifyContent="space-around"
//                 mt={2}
//               >
//                 <Button
//                   variant="contained"
//                   color="success"
//                   onClick={handleSubmit}
//                   endIcon={<UploadIcon />}
//                 >
//                   Submit
//                 </Button>
//                 <Button
//                   variant="contained"
//                   sx={{ backgroundColor: "red", color: "white" }}
//                   onClick={handleCancel}
//                   endIcon={<DoDisturbIcon />}
//                 >
//                   Cancel
//                 </Button>
//               </Stack>
//             </Box>
//           </Box>

//           {download && (
//             <Box textAlign="center">
//               <a href={fileData} download>
//                 <Button
//                   variant="outlined"
//                   startIcon={
//                     <FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />
//                   }
//                   sx={{ mt: 2, textTransform: "none", fontWeight: 800, fontSize: "22px", fontFamily: "Poppins" }}
//                 >
//                   Download Microwave(AVIAT) Report
//                 </Button>
//               </a>
//             </Box>
//           )}
//         </Box>
//       </Slide>

//       {loading}
//     </>
//   );
// };


// const UploadSection = ({
//   label,
//   color,
//   onChange,
//   error,
//   multiple = true,
//   selectedText,
// }) => (
//   <Box className={OverAllCss().Front_Box}>
//     <div className={OverAllCss().Front_Box_Hading}>{label}:</div>
//     <div className={OverAllCss().Front_Box_Select_Button}>
//       <Button variant="contained" component="label" color={color}>
//         Select File
//         <input hidden type="file" multiple={multiple} onChange={onChange} />
//       </Button>
//       {selectedText && (
//         <span style={{ color: "green", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>
//           No. of Files {selectedText}
//         </span>
//       )}
//       {error && (
//         <span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>
//           This Field Is Required!
//         </span>
//       )}
//     </div>
//   </Box>
// );

// export default MicrowaveCeragonUpload;


import React, { useState, useEffect, useCallback } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, TextField, Tooltip, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, CircularProgress,
} from "@mui/material";
import {
    Upload as UploadIcon,
    DoDisturb as DoDisturbIcon,
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Close as CloseIcon,
    Refresh as RefreshIcon,
    TuneOutlined as TuneIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import "rsuite/dist/rsuite.min.css";

// ─── theme constants ────────────────────────────────────────────────────────
const TEAL = "#2a77bf";
const TEAL_DARK = "#28538c";
const TEAL_LIGHT = "#e0f2f1";
const TEAL_MID = "#b2dfdb";

// ─── inline field styles ────────────────────────────────────────────────────
const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        fontSize: 13,
        "&:hover fieldset": { borderColor: TEAL },
        "&.Mui-focused fieldset": { borderColor: TEAL },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
};

// ─── Parameter Edit Dialog ──────────────────────────────────────────────────
const EditParamDialog = ({ open, onClose, row, onSaved }) => {
    const [parameter, setParameter] = useState("");
    const [value, setValue] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open && row) {
            setParameter(row.parameter ?? "");
            setValue(row.value ?? "");
        }
    }, [open, row]);

    const handleSave = async () => {
        if (!parameter.trim()) {
            Swal.fire("Validation", "Parameter name is required.", "warning");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${ServerURL}/mwCeragon/parameter/${row.id}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ parameter: parameter.trim(), value: value.trim() }),
            });
            const data = await res.json();
            if (res.ok && (data.status !== false)) {
                Swal.fire({ icon: "success", title: "Updated!", timer: 1800, showConfirmButton: false });
                onSaved();
                onClose();
            } else {
                Swal.fire("Error", data?.message || "Update failed.", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong.", "error");
        } finally {
            setSaving(false);
        }
    };

    if (!row) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock
            PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
            <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #8cc6eb)` }} />
            <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <TuneIcon sx={{ color: TEAL, fontSize: 20 }} />
                    <Typography fontWeight={700} fontSize={16}>Edit Parameter</Typography>
                </Box>
                <IconButton size="small" onClick={onClose}
                    sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
                    <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 1.5, pb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField
                    label="Parameter"
                    value={parameter}
                    onChange={(e) => setParameter(e.target.value)}
                    size="small"
                    fullWidth
                    sx={fieldSx}
                />
                <TextField
                    label="Value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    size="small"
                    fullWidth
                    sx={fieldSx}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
                <Button onClick={onClose}
                    sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSave} disabled={saving}
                    startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
                    sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5 }}>
                    {saving ? "Saving…" : "Update"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// ─── Parameter Table ─────────────────────────────────────────────────────────
const ParameterTable = ({ rows, loading, onEdit, onDelete, onRefresh }) => (
    <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center" gap={0.8}>
                <TuneIcon sx={{ fontSize: 17, color: TEAL }} />
                <Typography fontSize={13.5} fontWeight={700} color="#1a1a2e">Parameters &amp; Values</Typography>
                {rows.length > 0 && (
                    <Chip label={`${rows.length} entries`} size="small"
                        sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
                )}
            </Box>
            <Tooltip title="Refresh parameters" arrow>
                <IconButton size="small" onClick={onRefresh}
                    sx={{ bgcolor: TEAL_LIGHT, color: TEAL, borderRadius: "8px", "&:hover": { bgcolor: TEAL_MID } }}>
                    <RefreshIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Tooltip>
        </Box>

        <TableContainer component={Paper} elevation={0}
            sx={{ border: `1px solid ${TEAL_MID}`, borderRadius: "10px", overflow: "hidden", maxHeight: 280 }}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow sx={{ bgcolor: TEAL }}>
                        {["SN", "Parameter", "Value", "Actions"].map((h) => (
                            <TableCell key={h} sx={{
                                color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.3,
                                bgcolor: TEAL, letterSpacing: ".03em",
                                whiteSpace: "nowrap",
                            }}>{h}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading && (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                <CircularProgress size={22} sx={{ color: TEAL }} />
                            </TableCell>
                        </TableRow>
                    )}
                    {!loading && rows.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 3, color: "#aaa", fontSize: 13 }}>
                                No parameters found.
                            </TableCell>
                        </TableRow>
                    )}
                    {!loading && rows.map((row, idx) => (
                        <TableRow key={row.id ?? idx} hover
                            sx={{ "&:nth-of-type(even)": { bgcolor: "#f8fcfb" }, "&:hover": { bgcolor: TEAL_LIGHT + "88" } }}>
                            <TableCell sx={{ color: "#b0b7c3", fontSize: 12, fontWeight: 600, width: 40 }}>{idx + 1}</TableCell>
                            <TableCell sx={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{row.parameter}</TableCell>
                            <TableCell sx={{ fontSize: 13, color: "#374151" }}>
                                <Chip label={row.value ?? "—"} size="small"
                                    sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontWeight: 600, fontSize: 11.5, border: "1px solid #90caf9" }} />
                            </TableCell>
                            <TableCell>
                                <Box display="flex" gap={0.5}>
                                    <Tooltip title="Edit" arrow>
                                        <IconButton size="small" onClick={() => onEdit(row)}
                                            sx={{ color: TEAL, "&:hover": { bgcolor: TEAL_LIGHT } }}>
                                            <EditIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete" arrow>
                                        <IconButton size="small" onClick={() => onDelete(row)}
                                            sx={{ color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}>
                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const MicrowaveCeragonUpload = () => {
    const classes = OverAllCss();
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();

    // ── file states ─────────────────────────────────────────────────────────────
    const [report_File, setReport_File] = useState({ filename: "", bytes: "" });
    const [fileData, setFileData] = useState();
    const [download, setDownload] = useState(false);

    const [showError, setShowError] = useState({
        budget: false,
        report: false,
    });

    // ── link budget files ────────────────────────────────────────────────────────
    const [linkFiles, setLinkFiles] = useState([]);

    const fetchLinkFiles = useCallback(async () => {
        const res = await getData("mwCeragon/linkbudget/");
        if (res?.status && Array.isArray(res.files)) {
            setLinkFiles(res.files);
        } else {
            setLinkFiles([]);
        }
    }, []);

    useEffect(() => { fetchLinkFiles(); }, [fetchLinkFiles]);

    const handleLinkFileUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("link_buget_file", files[i]);
        }

        action(true);
        const res = await postData("mwCeragon/linkbudget/", formData);
        action(false);

        if (res.status) {
            Swal.fire("Success", "Files Uploaded", "success");
            fetchLinkFiles();
            setShowError((prev) => ({ ...prev, budget: false }));
        } else {
            Swal.fire("Error", res.message, "error");
        }
    };

    const handleDeleteLinkFiles = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the link budget file.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d32f2f",
            cancelButtonColor: "#1976d2",
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) return;
        action(true);
        try {
            const res = await fetch(`${ServerURL}/mwCeragon/linkbudget/`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (res.ok && data.status) {
                Swal.fire("Deleted!", "File(s) deleted successfully.", "success");
                setLinkFiles([]);
            } else {
                Swal.fire("Error", data?.message || "Delete failed", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Something went wrong. Please try again.", "error");
        } finally {
            action(false);
        }
    };

    // ── parameters ───────────────────────────────────────────────────────────────
    const [parameters, setParameters] = useState([]);
    const [paramLoading, setParamLoading] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);

    const fetchParameters = useCallback(async () => {
        setParamLoading(true);
        try {
            const res = await getData("mwCeragon/parameter/");
            if (Array.isArray(res)) {
                setParameters(res);
            } else if (Array.isArray(res?.data)) {
                setParameters(res.data);
            } else if (Array.isArray(res?.results)) {
                setParameters(res.results);
            } else {
                setParameters([]);
            }
        } catch {
            setParameters([]);
        } finally {
            setParamLoading(false);
        }
    }, []);

    useEffect(() => { fetchParameters(); }, [fetchParameters]);

    const handleEditParam = (row) => {
        setEditRow(row);
        setEditDialogOpen(true);
    };

    const handleDeleteParam = async (row) => {
        const result = await Swal.fire({
            title: "Delete Parameter?",
            html: `<span style="font-size:14px;color:#555">Delete <b>${row.parameter}</b>?</span>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d32f2f",
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) return;

        action(true);
        try {
            const res = await fetch(`${ServerURL}/mwCeragon/parameter/${row.id}/`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (res.ok && (data.status !== false)) {
                Swal.fire({ icon: "success", title: "Deleted!", timer: 1600, showConfirmButton: false });
                fetchParameters();
            } else {
                Swal.fire("Error", data?.message || "Delete failed.", "error");
            }
        } catch {
            Swal.fire("Error", "Something went wrong.", "error");
        } finally {
            action(false);
        }
    };

    // ── dump file ────────────────────────────────────────────────────────────────
    const updateFile = (event, setFileState, errorKey) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setShowError((prev) => ({ ...prev, [errorKey]: false }));
            setFileState({ filename: files.length, bytes: files });
        }
    };

    // ── submit ───────────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        const isValid = linkFiles.length > 0 && report_File.bytes.length;
        if (!isValid) {
            setShowError({
                budget: !linkFiles.length,
                report: !report_File.bytes.length,
            });
            return;
        }

        action(true);
        const formData = new FormData();
        for (let j = 0; j < report_File.bytes.length; j++) {
            formData.append("dump_file", report_File.bytes[j]);
        }

        const response = await postData("mwCeragon/upload_dump/", formData);
        action(false);

        if (response.status) {
            setDownload(true);
            setFileData(response.download_url);
            Swal.fire("Done", response.message, "success");
        } else {
            Swal.fire("Oops...", response.message, "error");
        }
    };

    const handleCancel = () => {
        setReport_File({ filename: "", bytes: "" });
        setDownload(false);
        setShowError({ budget: false, report: false });
    };

    // ─── render ──────────────────────────────────────────────────────────────────
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
                            <Box className={classes.Box_Hading}>
                                Make Microwave(Ceragon) Summary
                            </Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>

                                {/* ── LINK BUDGET FILE ── */}
                                <Box className={classes.Front_Box}>
                                    <Typography className={classes.Front_Box_Hading} sx={{ mb: 1 }}>
                                        Select Link Budget File:
                                    </Typography>

                                    <Grid container alignItems="center" spacing={2}>
                                        <Grid item>
                                            <Button variant="contained" component="label"
                                                sx={{ textTransform: "uppercase", fontWeight: 700 }}>
                                                Select File
                                                <input hidden type="file" multiple onChange={handleLinkFileUpload} />
                                            </Button>
                                        </Grid>

                                        <Grid item xs>
                                            {linkFiles.length > 0 ? (
                                                linkFiles.map((file, index) => (
                                                    <Typography key={index} fontWeight={600} color="green" fontSize={13}>
                                                        {file}
                                                    </Typography>
                                                ))
                                            ) : (
                                                <Typography color="gray" fontSize={13}>No file uploaded.</Typography>
                                            )}
                                        </Grid>

                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                sx={{ backgroundColor: "#d32f2f", color: "white", textTransform: "uppercase", fontWeight: 700 }}
                                                disabled={!linkFiles.length}
                                                onClick={handleDeleteLinkFiles}
                                            >
                                                Delete
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    {showError.budget && (
                                        <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>
                                            This Field Is Required!
                                        </Typography>
                                    )}
                                </Box>

                                {/* ── SELECT DUMP ── */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Select Dump:</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <Button
                                            variant="contained"
                                            component="label"
                                            color={report_File.filename ? "warning" : "primary"}
                                            sx={{ textTransform: "uppercase", fontWeight: 700 }}
                                        >
                                            Select File
                                            <input hidden type="file" multiple onChange={(e) => updateFile(e, setReport_File, "report")} />
                                        </Button>
                                        {report_File.filename && (
                                            <span style={{ color: "green", fontSize: 16, fontWeight: 600, marginLeft: 12 }}>
                                                No. of Files: {report_File.filename}
                                            </span>
                                        )}
                                        {showError.report && (
                                            <span style={{ color: "red", fontSize: 16, fontWeight: 600, marginLeft: 8 }}>
                                                This Field Is Required!
                                            </span>
                                        )}
                                    </div>
                                </Box>

                                {/* ── PARAMETER & VALUE TABLE ── */}
                                <Box className={classes.Front_Box} sx={{ p: 2 }}>
                                    <ParameterTable
                                        rows={parameters}
                                        loading={paramLoading}
                                        onEdit={handleEditParam}
                                        onDelete={handleDeleteParam}
                                        onRefresh={fetchParameters}
                                    />
                                </Box>

                            </Stack>

                            {/* ── ACTION BUTTONS ── */}
                            <Stack
                                direction={{ xs: "column", md: "row" }}
                                spacing={2}
                                justifyContent="space-around"
                                mt={2}
                            >
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSubmit}
                                    endIcon={<UploadIcon />}
                                    sx={{ fontWeight: 700, textTransform: "uppercase" }}
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: "#d32f2f", color: "white", fontWeight: 700, textTransform: "uppercase" }}
                                    onClick={handleCancel}
                                    endIcon={<DoDisturbIcon />}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    </Box>

                    {/* ── DOWNLOAD ── */}
                    {download && (
                        <Box textAlign="center" mt={2}>
                            <a href={fileData} download>
                                <Button
                                    variant="outlined"
                                    startIcon={<FileDownloadIcon sx={{ fontSize: 28, color: "green" }} />}
                                    sx={{ textTransform: "none", fontWeight: 800, fontSize: "20px", fontFamily: "Poppins" }}
                                >
                                    Download Ceragon Report
                                </Button>
                            </a>
                        </Box>
                    )}
                </Box>
            </Slide>

            {/* ── Edit Parameter Dialog ── */}
            <EditParamDialog
                open={editDialogOpen}
                onClose={() => { setEditDialogOpen(false); setEditRow(null); }}
                row={editRow}
                onSaved={fetchParameters}
            />

            {loading}
        </>
    );
};

export default MicrowaveCeragonUpload;