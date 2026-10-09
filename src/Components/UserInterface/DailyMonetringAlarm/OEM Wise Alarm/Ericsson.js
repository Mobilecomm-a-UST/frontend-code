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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import Swal from "sweetalert2";
import { postDataa, getData, deleteData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const CIRCLES = [
    "AP", "CH", "KK", "DL", "HR", "RJ", "JK", "WB", "OD",
    "MU", "TNCH", "UE", "BH", "UW", "MP", "NESA", "PB", "KO", "JH"
];

/**
 * Ericsson Section Definitions:
 * - Separate sections for Mapping Files and Ericsson Alarm Files.
 * - Files selected in 'mapping' and 'ericsson' will both be sent together to 'universal_alarm/ericsson/' upon submission along with the selected circle.
 */
const ERICSSON_SECTIONS = [
    {
        key: "mapping",
        title: "Mapping File",
        label: "Select Mapping Files:-",
        buttonText: "Select Files",
        fieldKey: "mapping_file",
        accept: ".xlsx,.xls,.csv",
        multiple: true,
        endpoint: "universal_alarm/ericsson/",
    },
    {
        key: "ericsson",
        title: "Ericsson Alarm Process",
        label: "Select Ericsson Alarm Files:-",
        buttonText: "Select Files",
        fieldKey: "alarm_file",
        accept: ".log,.logs,.txt,.xlsx,.xls,.csv",
        multiple: true,
        endpoint: "universal_alarm/ericsson/",
    },
    {
        key: "oldVsNew",
        title: "Old vs New (Site Upload)",
        label: "Select Old vs New (Site) File:-",
        buttonText: "Select File",
        fieldKey: "file",
        accept: ".xlsx,.xls,.csv",
        multiple: false,
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
    const [circle, setCircle] = useState("");
    const [files, setFiles] = useState({});
    const [results, setResults] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingSites, setExistingSites] = useState([]);
    const [loadingSites, setLoadingSites] = useState(false);

    const { loading, action: setLoading } = useLoadingDialog();

    // Fetch existing site data on mount
    useEffect(() => {
        fetchExistingSites();
    }, []);

    const fetchExistingSites = async () => {
        setLoadingSites(true);
        try {
            const res = await getData("universal_alarm/get_site/");
            if (res && Array.isArray(res)) {
                setExistingSites(res);
            } else if (res && res.data && Array.isArray(res.data)) {
                setExistingSites(res.data);
            } else {
                setExistingSites([]);
            }
        } catch (error) {
            console.error("Failed to fetch site data", error);
        } finally {
            setLoadingSites(false);
        }
    };

    const handleDeleteSite = async (siteIdOrName) => {
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
                    data: { id: siteIdOrName, site: siteIdOrName },
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
        const hasMapping = (files.mapping || []).length > 0;
        const hasEricsson = (files.ericsson || []).length > 0;
        const hasOldVsNew = (files.oldVsNew || []).length > 0;

        if (!hasMapping && !hasEricsson && !hasOldVsNew) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please select at least one file to process.",
            });
            return;
        }

        // Validate Circle selection if Ericsson files or mapping files are attached
        if ((hasMapping || hasEricsson) && !circle) {
            Swal.fire({
                icon: "warning",
                title: "Circle Required",
                text: "Please select a Circle from the dropdown before submitting.",
            });
            return;
        }

        setIsSubmitting(true);
        setLoading(true);

        const outcomes = [];

        // 1. Process Ericsson Alarm Endpoint (combining mapping, alarm files, and circle if selected)
        if (hasMapping || hasEricsson) {
            try {
                const formData = new FormData();
                formData.append("circle", circle);

                if (hasMapping) {
                    files.mapping.forEach((file) => formData.append("mapping_file", file));
                }
                if (hasEricsson) {
                    files.ericsson.forEach((file) => formData.append("alarm_file", file));
                }

                const data = await postDataa("universal_alarm/ericsson/", formData);

                if (!data || typeof data !== "object") {
                    outcomes.push({
                        sectionKey: "ericsson_combined",
                        title: "Ericsson Alarm Process",
                        ok: false,
                        data: null,
                        message: "Unexpected response from server (universal_alarm/ericsson/). Check backend logs.",
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
                        delete updated.mapping;
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
        setCircle("");
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
                        {/* Circle Selection Dropdown Box */}
                        <Box
                            sx={{
                                bgcolor: "#fff",
                                borderRadius: "10px",
                                px: 2,
                                py: 1.5,
                                mb: 2,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            }}
                        >
                            <Typography
                                sx={{ fontWeight: 600, fontSize: 18, color: "#555", mb: 1.5 }}
                            >
                                Select Circle:-
                            </Typography>
                            <FormControl fullWidth size="small" sx={{ maxWidth: 300 }}>
                                <InputLabel id="circle-select-label">Choose Circle</InputLabel>
                                <Select
                                    labelId="circle-select-label"
                                    id="circle-select"
                                    value={circle}
                                    label="Choose Circle"
                                    onChange={(e) => setCircle(e.target.value)}
                                    disabled={isSubmitting}
                                >
                                    {CIRCLES.map((c) => (
                                        <MenuItem key={c} value={c}>
                                            {c}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

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

                                    {/* Active Site Files listing for Old vs New section */}
                                    {section.key === "oldVsNew" && (
                                        <Box sx={{ mt: 2, pt: 1, borderTop: "1px dashed #ccc" }}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Typography variant="subtitle2" sx={{ color: "#666" }}>
                                                    Active Site Files:
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
                                            ) : existingSites.length > 0 ? (
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    sx={{ flexWrap: "wrap", gap: 1, mt: 1 }}
                                                >
                                                    {existingSites.map((siteItem, idx) => {
                                                        const name =
                                                            typeof siteItem === "string"
                                                                ? siteItem
                                                                : siteItem.name ||
                                                                  siteItem.file_name ||
                                                                  `Site ${idx + 1}`;
                                                        const identifier =
                                                            typeof siteItem === "object"
                                                                ? siteItem.id || name
                                                                : siteItem;
                                                        return (
                                                            <Chip
                                                                key={idx}
                                                                label={name}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                                onDelete={() =>
                                                                    handleDeleteSite(identifier)
                                                                }
                                                                deleteIcon={<DeleteIcon />}
                                                            />
                                                        );
                                                    })}
                                                </Stack>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">
                                                    No site files uploaded on server.
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