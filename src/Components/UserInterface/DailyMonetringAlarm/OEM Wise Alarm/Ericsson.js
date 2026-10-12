import React, { useState, useEffect } from "react";
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
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import Swal from "sweetalert2";
import { postDataa, getData, deleteData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const ERICSSON_SECTIONS = [
    {
        key: "ericsson",
        title: "Ericsson Alarm Process",
        label: "Select Logs Files:-",
        buttonText: "Select Files",
        fieldKey: "log_files",
        accept: ".log,.logs,.txt",
        multiple: true,
        endpoint: "universal_alarm/upload_log_files",
    },
    {
        key: "oldVsNew",
        title: "Old vs New (Site Upload)",
        label: "Select Old vs New (Site) File:-",
        buttonText: "Select File",
        fieldKey: "site_file",
        accept: ".xlsx,.xls,.csv",
        multiple: true,
        endpoint: "universal_alarm/upload_site/",
    },
];

const getMessage = (data, fallback) => {
    if (!data) return fallback;
    const msg = data.message || data.error || data.detail || data.errors;
    if (msg) return typeof msg === "string" ? msg : JSON.stringify(msg);
    return fallback;
};

const isSuccessResponse = (data) =>
    data.status === true || (data.status === undefined && !data.error);

const Ericsson = () => {
    const [files, setFiles] = useState({});
    const [results, setResults] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Separate state for both data lists
    const [oldVsNewSites, setOldVsNewSites] = useState([]);
    const [universalAlarms, setUniversalAlarms] = useState([]);
    const [loadingSites, setLoadingSites] = useState(false);

    // Separate Pagination States for each table
    const [pageOld, setPageOld] = useState(0);
    const [rowsPerPageOld, setRowsPerPageOld] = useState(5);

    const [pageUni, setPageUni] = useState(0);
    const [rowsPerPageUni, setRowsPerPageUni] = useState(5);

    const { loading, action: setLoading } = useLoadingDialog();

    // Fetch existing site data on mount
    useEffect(() => {
        fetchExistingSites();
    }, []);

    const fetchExistingSites = async () => {
        setLoadingSites(true);
        try {
            const res = await getData("universal_alarm/get_site/");
            if (res) {
                if (res.old_vs_new && Array.isArray(res.old_vs_new)) {
                    setOldVsNewSites(res.old_vs_new);
                } else {
                    setOldVsNewSites([]);
                }

                if (res.universal_alarms && Array.isArray(res.universal_alarms)) {
                    setUniversalAlarms(res.universal_alarms);
                } else if (Array.isArray(res)) {
                    setUniversalAlarms(res);
                } else {
                    setUniversalAlarms([]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch site data", error);
        } finally {
            setLoadingSites(false);
        }
    };

    const handleDeleteSite = async (siteId) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This site file will be deleted from the server.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                const res = await deleteData("universal_alarm/delete_site/", {
                    data: { id: siteId, site: siteId },
                });
                if (res) {
                    Swal.fire("Deleted!", "Site has been deleted.", "success");
                    fetchExistingSites();
                } else {
                    Swal.fire("Failed", "Unable to delete site file.", "error");
                }
            } catch (err) {
                Swal.fire("Error", "Error deleting site file.", "error");
            }
        }
    };

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
            setFiles((prev) => ({
                ...prev,
                [section.key]: section.multiple
                    ? [...(prev[section.key] || []), ...validFiles]
                    : validFiles,
            }));
        }
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

    const handleSubmit = async () => {
        const hasEricsson = (files.ericsson || []).length > 0;
        const hasOldVsNew = (files.oldVsNew || []).length > 0;

        if (!hasEricsson && !hasOldVsNew) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please select at least one file to process.",
            });
            return;
        }

        setIsSubmitting(true);
        setLoading(true);

        const outcomes = [];

        // 1. Process Ericsson Alarm Endpoint
        if (hasEricsson) {
            try {
                const formData = new FormData();
                files.ericsson.forEach((file) => formData.append("log_files", file));

                const data = await postDataa("universal_alarm/upload_log_files", formData);

                if (!data || typeof data !== "object") {
                    outcomes.push({
                        sectionKey: "ericsson_combined",
                        title: "Ericsson Alarm Process",
                        ok: false,
                        data: null,
                        message: "Unexpected response from server. Check backend logs.",
                    });
                } else {
                    const ok = isSuccessResponse(data);
                    outcomes.push({
                        sectionKey: "ericsson_combined",
                        title: "Ericsson Alarm Process",
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
                    sectionKey: "ericsson_combined",
                    title: "Ericsson Alarm Process",
                    ok: false,
                    data: null,
                    message: error.message || "Failed to process",
                });
            }
        }

        // 2. Process Old vs New (Site Upload) Endpoint
        if (hasOldVsNew) {
            const section = ERICSSON_SECTIONS.find((s) => s.key === "oldVsNew");
            try {
                const formData = new FormData();
                files.oldVsNew.forEach((file) => formData.append(section.fieldKey, file));

                const data = await postDataa(section.endpoint, formData);

                if (!data || typeof data !== "object") {
                    outcomes.push({
                        sectionKey: section.key,
                        title: section.title,
                        ok: false,
                        data: null,
                        message: `Unexpected response from server (${section.endpoint}).`,
                    });
                } else {
                    const ok = isSuccessResponse(data);
                    outcomes.push({
                        sectionKey: section.key,
                        title: section.title,
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
                    sectionKey: section.key,
                    title: section.title,
                    ok: false,
                    data: null,
                    message: error.message || "Failed to process",
                });
            }
        }

        setLoading(false);
        setIsSubmitting(false);

        // Clear state of successfully submitted keys
        setFiles((prev) => {
            const updated = { ...prev };
            outcomes.forEach((o) => {
                if (o.ok) {
                    if (o.sectionKey === "ericsson_combined") {
                        delete updated.ericsson;
                    } else {
                        delete updated[o.sectionKey];
                    }
                }
            });
            return updated;
        });

        setResults(outcomes);
        fetchExistingSites();
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
                    {/* Header Banner */}
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
                            Ericsson Alarm Processing
                        </Typography>
                    </Box>

                    {/* Gradient Panel Container */}
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
                        {/* File Upload Sections */}
                        {ERICSSON_SECTIONS.map((section) => {
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
                                            {section.buttonText}
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

                                    {/* Table 1: Old vs New Table */}
                                    {section.key === "oldVsNew" && (
                                        <Box sx={{ mt: 2, pt: 1, borderTop: "1px dashed #ccc" }}>
                                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                <Typography variant="subtitle2" sx={{ color: "#666" }}>
                                                    Active Old vs New Sites:
                                                </Typography>
                                                <Tooltip title="Refresh active sites">
                                                    <IconButton
                                                        size="small"
                                                        onClick={fetchExistingSites}
                                                        disabled={loadingSites}
                                                    >
                                                        <RefreshIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>

                                            {loadingSites ? (
                                                <CircularProgress size={20} sx={{ mt: 1 }} />
                                            ) : oldVsNewSites.length > 0 ? (
                                                <Paper sx={{ width: "100%", overflow: "hidden", mt: 1 }}>
                                                    <TableContainer sx={{ maxHeight: 300 }}>
                                                        <Table stickyHeader size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>ID</TableCell>
                                                                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>New Site</TableCell>
                                                                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Old Site</TableCell>
                                                                    <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Action</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {oldVsNewSites
                                                                    .slice(pageOld * rowsPerPageOld, pageOld * rowsPerPageOld + rowsPerPageOld)
                                                                    .map((row) => (
                                                                        <TableRow hover key={row.id}>
                                                                            <TableCell>{row.id}</TableCell>
                                                                            <TableCell>{row.new_site || "-"}</TableCell>
                                                                            <TableCell>{row.old_site || "-"}</TableCell>
                                                                            <TableCell align="center">
                                                                                <IconButton
                                                                                    size="small"
                                                                                    color="error"
                                                                                    onClick={() => handleDeleteSite(row.id)}
                                                                                >
                                                                                    <DeleteIcon fontSize="small" />
                                                                                </IconButton>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                    <TablePagination
                                                        rowsPerPageOptions={[5, 10, 20, 40]}
                                                        component="div"
                                                        count={oldVsNewSites.length}
                                                        rowsPerPage={rowsPerPageOld}
                                                        page={pageOld}
                                                        onPageChange={(e, newPage) => setPageOld(newPage)}
                                                        onRowsPerPageChange={(e) => {
                                                            setRowsPerPageOld(parseInt(e.target.value, 10));
                                                            setPageOld(0);
                                                        }}
                                                    />
                                                </Paper>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">
                                                    No Old vs New files uploaded on server.
                                                </Typography>
                                            )}
                                        </Box>
                                    )}

                                    {/* Table 2: Universal Alarms Table */}
                                    {section.key === "ericsson" && (
                                        <Box sx={{ mt: 2, pt: 1, borderTop: "1px dashed #ccc" }}>
                                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                <Typography variant="subtitle2" sx={{ color: "#666" }}>
                                                    Universal Alarms Data:
                                                </Typography>
                                            </Stack>

                                            {loadingSites ? (
                                                <CircularProgress size={20} sx={{ mt: 1 }} />
                                            ) : universalAlarms.length > 0 ? (
                                                <Paper sx={{ width: "100%", overflow: "hidden", mt: 1 }}>
                                                    <TableContainer sx={{ maxHeight: 300 }}>
                                                        <Table stickyHeader size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>ID</TableCell>
                                                                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Site ID</TableCell>
                                                                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>MPlane IP</TableCell>
                                                                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Status</TableCell>
                                                                    <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Action</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {universalAlarms
                                                                    .slice(pageUni * rowsPerPageUni, pageUni * rowsPerPageUni + rowsPerPageUni)
                                                                    .map((row) => (
                                                                        <TableRow hover key={row.id}>
                                                                            <TableCell>{row.id}</TableCell>
                                                                            <TableCell>{row.site_id || "-"}</TableCell>
                                                                            <TableCell>{row.mplane_ip || "-"}</TableCell>
                                                                            <TableCell>{row.status || "-"}</TableCell>
                                                                            <TableCell align="center">
                                                                                <IconButton
                                                                                    size="small"
                                                                                    color="error"
                                                                                    onClick={() => handleDeleteSite(row.id)}
                                                                                >
                                                                                    <DeleteIcon fontSize="small" />
                                                                                </IconButton>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                    <TablePagination
                                                        rowsPerPageOptions={[5, 10, 20, 40]}
                                                        component="div"
                                                        count={universalAlarms.length}
                                                        rowsPerPage={rowsPerPageUni}
                                                        page={pageUni}
                                                        onPageChange={(e, newPage) => setPageUni(newPage)}
                                                        onRowsPerPageChange={(e) => {
                                                            setRowsPerPageUni(parseInt(e.target.value, 10));
                                                            setPageUni(0);
                                                        }}
                                                    />
                                                </Paper>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">
                                                    No Universal Alarms data found.
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            );
                        })}

                        {/* Submit & Reset Buttons */}
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

            {/* Results Modal */}
            <Dialog
                open={Boolean(results)}
                onClose={() => setResults(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600, color: "#00796b" }}>
                    📊 Ericsson Results ({successCount} of {results ? results.length : 0}{" "}
                    succeeded)
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {results &&
                            results.map((outcome, idx) => (
                                <Alert
                                    key={idx}
                                    severity={outcome.ok ? "success" : "error"}
                                >
                                    <AlertTitle>{outcome.title}</AlertTitle>
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
                                            {outcome.data.files.map((name, fIdx) => (
                                                <Chip
                                                    key={fIdx}
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

export const MemoEricsson = React.memo(Ericsson);
export default Ericsson;