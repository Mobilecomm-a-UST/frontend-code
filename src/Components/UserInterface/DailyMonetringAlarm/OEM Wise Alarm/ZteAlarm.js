import React, { useState } from "react";
import {
    Box,
    Button,
    Stack,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    AlertTitle,
    CircularProgress,
    Typography,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Swal from "sweetalert2";
import { postDataa } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

/**
* ZTE sections, in the order they are shown AND processed
* (mapping goes first because the other processes may depend on it).
*
* endpoint  : relative URL (ServerURL is added inside postDataa)
* fieldKey  : form-data key the Django view reads from request.FILES
* extraKeys : OPTIONAL fallback keys - the same file is also sent under these
*             names. Remove once the real key is confirmed.
*/
const ZTE_SECTIONS = [
    {
        key: "mapping",
        title: "Mapping File",
        label: "Select Mapping Files:-",
        endpoint: "oem_zte/mapping_file/",
        fieldKey: "mapping_file",
        accept: ".xlsx,.xls,.csv",
        multiple: true,
    },
    {
        key: "zte",
        title: "ZTE Alarm Process",
        label: "Select ZTE Alarm Files:-",
        endpoint: "oem_zte/zte/",
        fieldKey: "alarm_file",
        accept: ".log,.logs,.txt,.xlsx,.xls,.csv",
        multiple: true,
    },
    {
        key: "saNSA",
        title: "SA / NSA",
        label: "Select SA / NSA File:-",
        endpoint: "oem_zte/SA_NSA/",
        fieldKey: "sa_nsa",
        // Backend answered {"error": "File required"} for "sa_nsa" alone,
        // so the file is also sent under these names until the real key is known.
        extraKeys: ["file", "SA_NSA"],
        accept: ".xlsx,.xls,.csv",
        multiple: false,
    },
    {
        key: "oldVsNew",
        title: "Old vs New",
        label: "Select Old vs New (Site) File:-",
        endpoint: "oem_zte/old_vs_new/",
        fieldKey: "site_file",
        accept: ".xlsx,.xls,.csv",
        multiple: false,
    },
];

/**
* Pull a readable message out of a backend response
*/
const getMessage = (data, fallback) => {
    if (!data) return fallback;
    const msg = data.message || data.error || data.detail || data.errors;
    if (msg) return typeof msg === "string" ? msg : JSON.stringify(msg);
    return fallback;
};

/**
* Success when status is true, or when the backend sends no status and no error.
*/
const isSuccessResponse = (data) =>
    data.status === true || (data.status === undefined && !data.error);

const ZteAlarm = () => {
    const [files, setFiles] = useState({});
    const [results, setResults] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { loading, action: setLoading } = useLoadingDialog();

    /**
     * File selection with extension validation
     */
    const handleFileChange = (section, event) => {
        const allowed = section.accept
            .split(",")
            .map((ext) => ext.trim().replace(".", "").toLowerCase());
        const selected = Array.from(event.target.files || []);
        const validFiles = [];

        selected.forEach((file) => {
            const extension = file.name.split(".").pop().toLowerCase();
            if (allowed.includes(extension)) {
                validFiles.push(file);
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Invalid File Type",
                    text: `File "${file.name}" has invalid extension. Allowed: ${section.accept}`,
                });
            }
        });

        if (validFiles.length > 0) {
            setFiles((prev) => ({ ...prev, [section.key]: validFiles }));
        }
        // allow re-selecting the same file again
        event.target.value = "";
    };

    const handleRemoveFile = (sectionKey, index) => {
        setFiles((prev) => {
            const remaining = (prev[sectionKey] || []).filter((_, i) => i !== index);
            const updated = { ...prev };
            if (remaining.length === 0) {
                delete updated[sectionKey];
            } else {
                updated[sectionKey] = remaining;
            }
            return updated;
        });
    };

    /**
     * One Submit: only the sections that have a file selected are sent,
     * one after another, in the order of ZTE_SECTIONS.
     */
    const handleSubmit = async () => {
        const selectedSections = ZTE_SECTIONS.filter(
            (section) => (files[section.key] || []).length > 0
        );

        if (selectedSections.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please select at least one file",
            });
            return;
        }

        setIsSubmitting(true);
        setLoading(true);

        const outcomes = [];

        for (const section of selectedSections) {
            try {
                const formData = new FormData();
                const keys = [section.fieldKey, ...(section.extraKeys || [])];
                keys.forEach((key) => {
                    files[section.key].forEach((file) => formData.append(key, file));
                });

                const data = await postDataa(section.endpoint, formData);

                if (!data || typeof data !== "object") {
                    console.error("Unexpected response from", section.endpoint, data);
                    outcomes.push({
                        section,
                        ok: false,
                        data: null,
                        message: `Unexpected response from server (${section.endpoint}). Check the endpoint URL / backend logs.`,
                    });
                } else {
                    const ok = isSuccessResponse(data);
                    if (!ok) console.error("Upload failed:", section.endpoint, data);
                    outcomes.push({
                        section,
                        ok,
                        data,
                        message: getMessage(
                            data,
                            ok ? "Completed successfully" : "Failed to process"
                        ),
                    });
                }
            } catch (error) {
                outcomes.push({
                    section,
                    ok: false,
                    data: null,
                    message: error.message || "Failed to process",
                });
            }
        }

        setLoading(false);
        setIsSubmitting(false);

        // Clear the files that were processed fine; keep failed ones for a retry
        setFiles((prev) => {
            const updated = { ...prev };
            outcomes.forEach((o) => {
                if (o.ok) delete updated[o.section.key];
            });
            return updated;
        });

        setResults(outcomes);
    };

    const handleReset = () => {
        setFiles({});
        setResults(null);
    };

    const successCount = results ? results.filter((r) => r.ok).length : 0;

    return (
        <>
            <Box sx={{ px: 1.5, pb: 4 }}>
                <Box sx={{ position: "relative", maxWidth: 1200, mx: "auto", mt: 5 }}>
                    {/* Pill title overlapping the top edge of the panel */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: -26,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: { xs: "90%", md: "70%" },
                            height: 54,
                            borderRadius: "30px",
                            bgcolor: "#006e74",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1,
                        }}
                    >
                        <Typography sx={{ fontWeight: 600, fontSize: 17 }}>
                            ZTE Alarm Processing
                        </Typography>
                    </Box>

                    {/* Gradient panel */}
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #00696f 0%, #7ecbc3 100%)",
                            borderRadius: "8px",
                            pt: 7,
                            px: 2,
                            pb: 3,
                            boxShadow: "0 20px 30px rgba(60, 60, 120, 0.25)",
                        }}
                    >
                        {ZTE_SECTIONS.map((section) => {
                            const selected = files[section.key] || [];
                            return (
                                <Box
                                    key={section.key}
                                    sx={{
                                        bgcolor: "#fff",
                                        borderRadius: "10px",
                                        px: 1.3,
                                        py: 1.2,
                                        mb: 2,
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                    }}
                                >
                                    <Typography
                                        sx={{ fontWeight: 600, fontSize: 18, color: "#555" }}
                                    >
                                        {section.label}
                                    </Typography>

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        sx={{ flexWrap: "wrap", rowGap: 1, mt: 0.5 }}
                                    >
                                        <Button
                                            variant="contained"
                                            component="label"
                                            size="small"
                                            disabled={isSubmitting}
                                        >
                                            {section.multiple ? "Select Files" : "Select File"}
                                            <input
                                                hidden
                                                type="file"
                                                accept={section.accept}
                                                multiple={section.multiple}
                                                onChange={(e) => handleFileChange(section, e)}
                                                disabled={isSubmitting}
                                            />
                                        </Button>

                                        {selected.map((file, idx) => (
                                            <Chip
                                                key={`${file.name}-${idx}`}
                                                label={file.name}
                                                color="success"
                                                size="small"
                                                onDelete={
                                                    isSubmitting
                                                        ? undefined
                                                        : () => handleRemoveFile(section.key, idx)
                                                }
                                                sx={{ maxWidth: "100%" }}
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            );
                        })}

                        {/* Single Submit / Reset */}
                        <Stack
                            direction="row"
                            justifyContent="space-around"
                            alignItems="center"
                            sx={{ mt: 1 }}
                        >
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSubmit}
                                endIcon={
                                    isSubmitting ? (
                                        <CircularProgress size={18} color="inherit" />
                                    ) : (
                                        <UploadIcon />
                                    )
                                }
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Processing..." : "Submit"}
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleReset}
                                endIcon={<DoDisturbIcon />}
                                disabled={isSubmitting}
                                sx={{ bgcolor: "#ff0000" }}
                            >
                                Reset
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Box>

            {/* Results summary */}
            <Dialog
                open={Boolean(results)}
                onClose={() => setResults(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600, color: "#00796b" }}>
                    📊 ZTE Results ({successCount} of {results ? results.length : 0}{" "}
                    succeeded)
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {results &&
                            results.map((outcome) => (
                                <Alert
                                    key={outcome.section.key}
                                    severity={outcome.ok ? "success" : "error"}
                                >
                                    <AlertTitle>{outcome.section.title}</AlertTitle>
                                    {outcome.message}

                                    {outcome.data?.download_url && (
                                        <Box sx={{ mt: 1 }}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                startIcon={<FileDownloadIcon />}
                                                href={outcome.data.download_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Download Output
                                            </Button>
                                        </Box>
                                    )}

                                    {Array.isArray(outcome.data?.files) && (
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{ flexWrap: "wrap", rowGap: 1, mt: 1 }}
                                        >
                                            {outcome.data.files.map((name, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={name}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Stack>
                                    )}

                                    {outcome.data && (
                                        <Box component="details" sx={{ mt: 1 }}>
                                            <summary style={{ cursor: "pointer" }}>
                                                Raw response
                                            </summary>
                                            <Box
                                                component="pre"
                                                sx={{
                                                    p: 1.5,
                                                    mt: 1,
                                                    mb: 0,
                                                    bgcolor: "#f5f5f5",
                                                    borderRadius: 1,
                                                    maxHeight: 260,
                                                    overflow: "auto",
                                                    fontSize: 12,
                                                }}
                                            >
                                                {JSON.stringify(outcome.data, null, 2)}
                                            </Box>
                                        </Box>
                                    )}
                                </Alert>
                            ))}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResults(null)}>Close</Button>
                </DialogActions>
            </Dialog>

            {loading}
        </>
    );
};

export const MemoZteAlarm = React.memo(ZteAlarm);
export default ZteAlarm;


// import React, { useState, useEffect } from "react";
// import {
//     Box,
//     Button,
//     Stack,
//     Chip,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Alert,
//     AlertTitle,
//     CircularProgress,
//     Typography,
//     IconButton,
//     Tooltip,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     TablePagination,
// } from "@mui/material";
// import UploadIcon from "@mui/icons-material/Upload";
// import DoDisturbIcon from "@mui/icons-material/DoDisturb";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import DeleteIcon from "@mui/icons-material/Delete";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import Swal from "sweetalert2";
// import { postDataa, getData, deleteData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// /**
//  * ZTE sections
//  */
// const ZTE_SECTIONS = [
//     {
//         key: "mapping",
//         title: "Mapping File",
//         label: "Select Mapping Files:-",
//         endpoint: "oem_zte/mapping_file/",
//         fieldKey: "mapping_file",
//         accept: ".xlsx,.xls,.csv",
//         multiple: true,
//     },
//     {
//         key: "zte",
//         title: "ZTE Alarm Process",
//         label: "Select ZTE Alarm Files:-",
//         endpoint: "oem_zte/zte/",
//         fieldKey: "alarm_file",
//         accept: ".log,.logs,.txt,.xlsx,.xls,.csv",
//         multiple: true,
//     },
//     {
//         key: "saNSA",
//         title: "SA / NSA",
//         label: "Select SA / NSA File:-",
//         endpoint: "oem_zte/SA_NSA/",
//         fieldKey: "sa_nsa",
//         extraKeys: ["file", "SA_NSA"],
//         accept: ".xlsx,.xls,.csv",
//         multiple: false,
//     },
//     {
//         key: "oldVsNew",
//         title: "Old vs New",
//         label: "Select Old vs New (Site) File:-",
//         endpoint: "oem_zte/old_vs_new/",
//         fieldKey: "site_file",
//         accept: ".xlsx,.xls,.csv",
//         multiple: false,
//     },
// ];

// const getMessage = (data, fallback) => {
//     if (!data) return fallback;
//     const msg = data.message || data.error || data.detail || data.errors;
//     if (msg) return typeof msg === "string" ? msg : JSON.stringify(msg);
//     return fallback;
// };

// const isSuccessResponse = (data) =>
//     data.status === true || (data.status === undefined && !data.error);

// const ZteAlarm = () => {
//     const [files, setFiles] = useState({});
//     const [results, setResults] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [existingSites, setExistingSites] = useState([]);
//     const [loadingSites, setLoadingSites] = useState(false);

//     // Table Pagination States
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);

//     const { loading, action: setLoading } = useLoadingDialog();

//     // Fetch existing site data on mount
//     useEffect(() => {
//         fetchExistingSites();
//     }, []);

//     const fetchExistingSites = async () => {
//         setLoadingSites(true);
//         try {
//             const res = await getData("oem_zte/mapping_file/");
//             if (res && Array.isArray(res.data)) {
//                 setExistingSites(res.data);
//             } else if (res && Array.isArray(res)) {
//                 setExistingSites(res);
//             } else if (res && typeof res === "object") {
//                 // Find array property if returned inside another field
//                 const arrayKey = Object.keys(res).find((k) => Array.isArray(res[k]));
//                 setExistingSites(arrayKey ? res[arrayKey] : []);
//             } else {
//                 setExistingSites([]);
//             }
//         } catch (error) {
//             console.error("Failed to fetch site data", error);
//         } finally {
//             setLoadingSites(false);
//         }
//     };

//     const handleDeleteSite = async (siteId) => {
//         const confirm = await Swal.fire({
//             title: "Are you sure?",
//             text: "This site file will be deleted from the server.",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#d33",
//             cancelButtonColor: "#3085d6",
//             confirmButtonText: "Yes, delete it!",
//         });

//         if (confirm.isConfirmed) {
//             try {
//                 const res = await deleteData("oem_zte/mapping_file/", {
//                     data: { id: siteId, site: siteId },
//                 });
//                 if (res) {
//                     Swal.fire("Deleted!", "Site has been deleted.", "success");
//                     fetchExistingSites();
//                 } else {
//                     Swal.fire("Failed", "Unable to delete site file.", "error");
//                 }
//             } catch (err) {
//                 Swal.fire("Error", "Error deleting site file.", "error");
//             }
//         }
//     };

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const handleFileChange = (section, event) => {
//         const allowed = section.accept
//             .split(",")
//             .map((ext) => ext.trim().replace(".", "").toLowerCase());
//         const selected = Array.from(event.target.files || []);
//         const validFiles = [];

//         selected.forEach((file) => {
//             const extension = file.name.split(".").pop().toLowerCase();
//             if (allowed.includes(extension)) {
//                 validFiles.push(file);
//             } else {
//                 Swal.fire({
//                     icon: "warning",
//                     title: "Invalid File Type",
//                     text: `File "${file.name}" has invalid extension. Allowed: ${section.accept}`,
//                 });
//             }
//         });

//         if (validFiles.length > 0) {
//             setFiles((prev) => ({ ...prev, [section.key]: validFiles }));
//         }
//         event.target.value = "";
//     };

//     const handleRemoveFile = (sectionKey, index) => {
//         setFiles((prev) => {
//             const remaining = (prev[sectionKey] || []).filter((_, i) => i !== index);
//             const updated = { ...prev };
//             if (remaining.length === 0) {
//                 delete updated[sectionKey];
//             } else {
//                 updated[sectionKey] = remaining;
//             }
//             return updated;
//         });
//     };

//     const handleSubmit = async () => {
//         const selectedSections = ZTE_SECTIONS.filter(
//             (section) => (files[section.key] || []).length > 0
//         );

//         if (selectedSections.length === 0) {
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: "Please select at least one file",
//             });
//             return;
//         }

//         setIsSubmitting(true);
//         setLoading(true);

//         const outcomes = [];

//         for (const section of selectedSections) {
//             try {
//                 const formData = new FormData();
//                 const keys = [section.fieldKey, ...(section.extraKeys || [])];
//                 keys.forEach((key) => {
//                     files[section.key].forEach((file) => formData.append(key, file));
//                 });

//                 const data = await postDataa(section.endpoint, formData);

//                 if (!data || typeof data !== "object") {
//                     console.error("Unexpected response from", section.endpoint, data);
//                     outcomes.push({
//                         section,
//                         ok: false,
//                         data: null,
//                         message: `Unexpected response from server (${section.endpoint}). Check the endpoint URL / backend logs.`,
//                     });
//                 } else {
//                     const ok = isSuccessResponse(data);
//                     if (!ok) console.error("Upload failed:", section.endpoint, data);
//                     outcomes.push({
//                         section,
//                         ok,
//                         data,
//                         message: getMessage(
//                             data,
//                             ok ? "Completed successfully" : "Failed to process"
//                         ),
//                     });
//                 }
//             } catch (error) {
//                 outcomes.push({
//                     section,
//                     ok: false,
//                     data: null,
//                     message: error.message || "Failed to process",
//                 });
//             }
//         }

//         setLoading(false);
//         setIsSubmitting(false);

//         setFiles((prev) => {
//             const updated = { ...prev };
//             outcomes.forEach((o) => {
//                 if (o.ok) delete updated[o.section.key];
//             });
//             return updated;
//         });

//         setResults(outcomes);
//         fetchExistingSites();
//     };

//     const handleReset = () => {
//         setFiles({});
//         setResults(null);
//     };

//     const successCount = results ? results.filter((r) => r.ok).length : 0;

//     // Dynamically derive column keys for table rendering if exact schema varies
//     const tableColumns =
//         existingSites.length > 0 && typeof existingSites[0] === "object"
//             ? Object.keys(existingSites[0])
//             : [];

//     return (
//         <>
//             <Box sx={{ px: 1.5, pb: 4 }}>
//                 <Box sx={{ position: "relative", maxWidth: 1200, mx: "auto", mt: 5 }}>
//                     {/* Header Banner */}
//                     <Box
//                         sx={{
//                             position: "absolute",
//                             top: -26,
//                             left: "50%",
//                             transform: "translateX(-50%)",
//                             width: { xs: "90%", md: "70%" },
//                             height: 54,
//                             borderRadius: "30px",
//                             bgcolor: "#006e74",
//                             color: "#fff",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             zIndex: 1,
//                         }}
//                     >
//                         <Typography sx={{ fontWeight: 600, fontSize: 17 }}>
//                             ZTE Alarm Processing
//                         </Typography>
//                     </Box>

//                     {/* Gradient panel */}
//                     <Box
//                         sx={{
//                             background: "linear-gradient(135deg, #00696f 0%, #7ecbc3 100%)",
//                             borderRadius: "8px",
//                             pt: 7,
//                             px: 2,
//                             pb: 3,
//                             boxShadow: "0 20px 30px rgba(60, 60, 120, 0.25)",
//                         }}
//                     >
//                         {ZTE_SECTIONS.map((section) => {
//                             const selected = files[section.key] || [];
//                             return (
//                                 <Box
//                                     key={section.key}
//                                     sx={{
//                                         bgcolor: "#fff",
//                                         borderRadius: "10px",
//                                         px: 1.3,
//                                         py: 1.2,
//                                         mb: 2,
//                                         boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
//                                     }}
//                                 >
//                                     <Typography
//                                         sx={{ fontWeight: 600, fontSize: 18, color: "#555" }}
//                                     >
//                                         {section.label}
//                                     </Typography>

//                                     <Stack
//                                         direction="row"
//                                         spacing={1}
//                                         alignItems="center"
//                                         sx={{ flexWrap: "wrap", rowGap: 1, mt: 0.5 }}
//                                     >
//                                         <Button
//                                             variant="contained"
//                                             component="label"
//                                             size="small"
//                                             disabled={isSubmitting}
//                                         >
//                                             {section.multiple ? "Select Files" : "Select File"}
//                                             <input
//                                                 hidden
//                                                 type="file"
//                                                 accept={section.accept}
//                                                 multiple={section.multiple}
//                                                 onChange={(e) => handleFileChange(section, e)}
//                                                 disabled={isSubmitting}
//                                             />
//                                         </Button>

//                                         {selected.map((file, idx) => (
//                                             <Chip
//                                                 key={`${file.name}-${idx}`}
//                                                 label={file.name}
//                                                 color="success"
//                                                 size="small"
//                                                 onDelete={
//                                                     isSubmitting
//                                                         ? undefined
//                                                         : () => handleRemoveFile(section.key, idx)
//                                                 }
//                                                 sx={{ maxWidth: "100%" }}
//                                             />
//                                         ))}
//                                     </Stack>

//                                     {/* Active Site Files Table for Old vs New section */}
//                                     {section.key === "oldVsNew" && (
//                                         <Box sx={{ mt: 2, pt: 1, borderTop: "1px dashed #ccc" }}>
//                                             <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
//                                                 <Typography variant="subtitle2" sx={{ color: "#666" }}>
//                                                     Active Site Files:
//                                                 </Typography>
//                                                 <Tooltip title="Refresh active sites">
//                                                     <IconButton
//                                                         size="small"
//                                                         onClick={fetchExistingSites}
//                                                         disabled={loadingSites}
//                                                     >
//                                                         <RefreshIcon fontSize="small" />
//                                                     </IconButton>
//                                                 </Tooltip>
//                                             </Stack>

//                                             {loadingSites ? (
//                                                 <CircularProgress size={20} sx={{ mt: 1 }} />
//                                             ) : existingSites.length > 0 ? (
//                                                 <Paper sx={{ width: "100%", overflow: "hidden", mt: 1 }}>
//                                                     <TableContainer sx={{ maxHeight: 300 }}>
//                                                         <Table stickyHeader size="small">
//                                                             <TableHead>
//                                                                 <TableRow>
//                                                                     {tableColumns.map((colKey) => (
//                                                                         <TableCell
//                                                                             key={colKey}
//                                                                             sx={{
//                                                                                 fontWeight: "bold",
//                                                                                 bgcolor: "#f5f5f5",
//                                                                                 textTransform: "capitalize",
//                                                                             }}
//                                                                         >
//                                                                             {colKey.replace(/_/g, " ")}
//                                                                         </TableCell>
//                                                                     ))}
//                                                                     <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
//                                                                         Action
//                                                                     </TableCell>
//                                                                 </TableRow>
//                                                             </TableHead>
//                                                             <TableBody>
//                                                                 {existingSites
//                                                                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                                                     .map((row, rIdx) => (
//                                                                         <TableRow hover key={row.id || rIdx}>
//                                                                             {tableColumns.map((colKey) => (
//                                                                                 <TableCell key={colKey}>
//                                                                                     {row[colKey] !== null && row[colKey] !== undefined
//                                                                                         ? String(row[colKey])
//                                                                                         : "-"}
//                                                                                 </TableCell>
//                                                                             ))}
//                                                                             <TableCell align="center">
//                                                                                 <IconButton
//                                                                                     size="small"
//                                                                                     color="error"
//                                                                                     onClick={() => handleDeleteSite(row.id || row.site || rIdx)}
//                                                                                 >
//                                                                                     <DeleteIcon fontSize="small" />
//                                                                                 </IconButton>
//                                                                             </TableCell>
//                                                                         </TableRow>
//                                                                     ))}
//                                                             </TableBody>
//                                                         </Table>
//                                                     </TableContainer>
//                                                     <TablePagination
//                                                         rowsPerPageOptions={[5, 10, 20, 40]}
//                                                         component="div"
//                                                         count={existingSites.length}
//                                                         rowsPerPage={rowsPerPage}
//                                                         page={page}
//                                                         onPageChange={handleChangePage}
//                                                         onRowsPerPageChange={handleChangeRowsPerPage}
//                                                     />
//                                                 </Paper>
//                                             ) : (
//                                                 <Typography variant="caption" color="text.secondary">
//                                                     No site files uploaded on server.
//                                                 </Typography>
//                                             )}
//                                         </Box>
//                                     )}
//                                 </Box>
//                             );
//                         })}

//                         {/* Single Submit / Reset */}
//                         <Stack
//                             direction="row"
//                             justifyContent="space-around"
//                             alignItems="center"
//                             sx={{ mt: 1 }}
//                         >
//                             <Button
//                                 variant="contained"
//                                 color="success"
//                                 onClick={handleSubmit}
//                                 endIcon={
//                                     isSubmitting ? (
//                                         <CircularProgress size={18} color="inherit" />
//                                     ) : (
//                                         <UploadIcon />
//                                     )
//                                 }
//                                 disabled={isSubmitting}
//                             >
//                                 {isSubmitting ? "Processing..." : "Submit"}
//                             </Button>
//                             <Button
//                                 variant="contained"
//                                 color="error"
//                                 onClick={handleReset}
//                                 endIcon={<DoDisturbIcon />}
//                                 disabled={isSubmitting}
//                                 sx={{ bgcolor: "#ff0000" }}
//                             >
//                                 Reset
//                             </Button>
//                         </Stack>
//                     </Box>
//                 </Box>
//             </Box>

//             {/* Results summary */}
//             <Dialog
//                 open={Boolean(results)}
//                 onClose={() => setResults(null)}
//                 maxWidth="md"
//                 fullWidth
//             >
//                 <DialogTitle sx={{ fontWeight: 600, color: "#00796b" }}>
//                     📊 ZTE Results ({successCount} of {results ? results.length : 0}{" "}
//                     succeeded)
//                 </DialogTitle>
//                 <DialogContent>
//                     <Stack spacing={2} sx={{ mt: 1 }}>
//                         {results &&
//                             results.map((outcome) => (
//                                 <Alert
//                                     key={outcome.section.key}
//                                     severity={outcome.ok ? "success" : "error"}
//                                 >
//                                     <AlertTitle>{outcome.section.title}</AlertTitle>
//                                     {outcome.message}

//                                     {outcome.data?.download_url && (
//                                         <Box sx={{ mt: 1 }}>
//                                             <Button
//                                                 variant="contained"
//                                                 color="success"
//                                                 size="small"
//                                                 startIcon={<FileDownloadIcon />}
//                                                 href={outcome.data.download_url}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                             >
//                                                 Download Output
//                                             </Button>
//                                         </Box>
//                                     )}

//                                     {Array.isArray(outcome.data?.files) && (
//                                         <Stack
//                                             direction="row"
//                                             spacing={1}
//                                             sx={{ flexWrap: "wrap", rowGap: 1, mt: 1 }}
//                                         >
//                                             {outcome.data.files.map((name, idx) => (
//                                                 <Chip
//                                                     key={idx}
//                                                     label={name}
//                                                     size="small"
//                                                     variant="outlined"
//                                                 />
//                                             ))}
//                                         </Stack>
//                                     )}

//                                     {outcome.data && (
//                                         <Box component="details" sx={{ mt: 1 }}>
//                                             <summary style={{ cursor: "pointer" }}>
//                                                 Raw response
//                                             </summary>
//                                             <Box
//                                                 component="pre"
//                                                 sx={{
//                                                     p: 1.5,
//                                                     mt: 1,
//                                                     mb: 0,
//                                                     bgcolor: "#f5f5f5",
//                                                     borderRadius: 1,
//                                                     maxHeight: 260,
//                                                     overflow: "auto",
//                                                     fontSize: 12,
//                                                 }}
//                                             >
//                                                 {JSON.stringify(outcome.data, null, 2)}
//                                             </Box>
//                                         </Box>
//                                     )}
//                                 </Alert>
//                             ))}
//                     </Stack>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setResults(null)}>Close</Button>
//                 </DialogActions>
//             </Dialog>

//             {loading}
//         </>
//     );
// };

// export const MemoZteAlarm = React.memo(ZteAlarm);
// export default ZteAlarm;