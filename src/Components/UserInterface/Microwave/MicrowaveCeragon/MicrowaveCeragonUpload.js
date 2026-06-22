

import React, { useState, useEffect, useCallback } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, TextField, Tooltip, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, CircularProgress, MenuItem,
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
    Add as AddIcon,
    TuneOutlined as TuneIcon,
    Search as SearchIcon,
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

/**
 * Helper: safely parse a fetch Response as JSON.
 * Some backends return an empty body (or non-JSON body) on 200/204 for
 * delete-style endpoints — JSON.parse on an empty string throws, which was
 * previously being swallowed by the outer try/catch and reported as
 * "Something went wrong" even though the delete had actually succeeded.
 */
const safeParseJson = async (res) => {
    const text = await res.text();
    if (!text) return {};
    try {
        return JSON.parse(text);
    } catch {
        return {};
    }
};

/**
 * Helper: decide whether an API call should be treated as a success.
 * Defensive / lenient on purpose since different endpoints on this backend
 * respond with different shapes (status: true/false, success: true, or
 * nothing at all on a 200/204 with an empty body).
 */
const isSuccessResponse = (res, data) => {
    if (!res.ok) return false; // non-2xx is always a failure
    if (data == null) return true; // empty body on a 2xx -> treat as success
    if (typeof data.status === "boolean") return data.status;
    if (typeof data.success === "boolean") return data.success;
    // No explicit status/success flag in the body -> fall back to HTTP code
    return true;
};

// ─── Plan ID Search ─────────────────────────────────────────────────────────
// Generic / flexible by design: it only resolves a plan id right now and
// hands it back via onPlanSelected. Wire up auto-refetch of link budget /
// parameters for the selected plan later by using the planId passed back
// here (e.g. inside onPlanSelected in the parent).
//
// Auto-search: typing debounces (350ms) and searches automatically — no
// button click needed. The backend's search_planid/ endpoint returns a
// flat array of plan_id strings (e.g. "MW-N-MUM-25052023-418"), not
// objects, so results are normalized to plain strings everywhere below.
const planIdToString = (plan) => {
    if (plan == null) return "";
    if (typeof plan === "string") return plan;
    return plan.plan_id ?? plan.id ?? plan.name ?? "";
};

const PlanIdSearch = ({ onPlanSelected }) => {
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const skipNextSearch = React.useRef(false);

    const runSearch = useCallback(async (term) => {
        const trimmed = term.trim();
        if (!trimmed) {
            setOptions([]);
            setShowOptions(false);
            setHasSearched(false);
            return;
        }
        setSearching(true);
        try {
            // Backend expects a POST with field plan_id (confirmed from the
            // Network tab payload). Sent as FormData — same as every other
            // postData(...) call in this file (linkbudget/, upload_dump/) —
            // since postData here may not reliably JSON-encode a plain
            // object the way fetch's JSON.stringify would.
            const body = new FormData();
            body.append("plan_id", trimmed);

            // TEMP DIAGNOSTIC — remove once search is confirmed working.
            // Open the browser console while typing to see exactly what's
            // sent vs what comes back; this will immediately show if
            // `trimmed` is empty, or if `res` isn't shaped the way the
            // parsing logic below expects.
            console.log("[PlanIdSearch] searching for:", trimmed);

            const res = await postData("mwCeragon/search_planid/", body);

            console.log("[PlanIdSearch] raw response:", res);

            let results = [];
            if (Array.isArray(res)) results = res;
            else if (Array.isArray(res?.data)) results = res.data;
            else if (Array.isArray(res?.results)) results = res.results;
            else if (typeof res === "string") results = [res];
            else if (res?.status && res?.plan_id) results = [res]; // single object response

            console.log("[PlanIdSearch] parsed results:", results);

            setOptions(results);
            setShowOptions(true);
            setHasSearched(true);
        } catch (err) {
            console.log("[PlanIdSearch] search error:", err);
            setOptions([]);
            setHasSearched(true);
        } finally {
            setSearching(false);
        }
    }, []);

    // Debounced auto-search on every keystroke.
    useEffect(() => {
        if (skipNextSearch.current) {
            skipNextSearch.current = false;
            return;
        }
        if (!query.trim()) {
            setOptions([]);
            setShowOptions(false);
            setHasSearched(false);
            return;
        }
        const timer = setTimeout(() => runSearch(query), 350);
        return () => clearTimeout(timer);
    }, [query, runSearch]);

    const handlePick = (plan) => {
        const planStr = planIdToString(plan);
        skipNextSearch.current = true;
        setSelectedPlan(planStr);
        setShowOptions(false);
        setQuery(planStr);
        // Hand the resolved plan_id string back to the parent. Parent
        // decides what to do with it (store for submit, refetch link
        // files/params, etc.)
        onPlanSelected?.(planStr);
    };

    const handleClear = () => {
        setQuery("");
        setSelectedPlan(null);
        setOptions([]);
        setShowOptions(false);
        setHasSearched(false);
        onPlanSelected?.(null);
    };

    return (
        <Box className="Front_Box_PlanId" sx={{ position: "relative" }}>
            <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Search Plan ID"
                        placeholder="e.g. MW-N-MUM-25052023-418"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedPlan(null);
                        }}
                        onFocus={() => { if (options.length > 0) setShowOptions(true); }}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                        InputProps={{
                            endAdornment: searching ? <CircularProgress size={14} sx={{ color: TEAL }} /> : null,
                        }}
                    />
                </Grid>
                {selectedPlan && (
                    <Grid item xs>
                        <Chip
                            label={`Plan: ${selectedPlan}`}
                            onDelete={handleClear}
                            sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}`, fontWeight: 600 }}
                        />
                    </Grid>
                )}
            </Grid>

            {showOptions && (
                <Paper elevation={3} sx={{ mt: 1, borderRadius: "8px", maxHeight: 220, overflowY: "auto", border: `1px solid ${TEAL_MID}`, position: "absolute", zIndex: 10, width: { xs: "100%", md: "50%" } }}>
                    {options.length > 0 ? (
                        options.map((opt, idx) => {
                            const label = planIdToString(opt);
                            return (
                                <MenuItem key={label || idx} onClick={() => handlePick(opt)} sx={{ fontSize: 13 }}>
                                    {label}
                                </MenuItem>
                            );
                        })
                    ) : (
                        hasSearched && !searching && (
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Typography fontSize={13} color="#aaa">No plan found matching "{query.trim()}".</Typography>
                            </Box>
                        )
                    )}
                </Paper>
            )}
        </Box>
    );
};

// ─── Add Parameter Dialog (IDU + Parameter + Value) ────────────────────────
// NOTE: the "search by IDU" lookup endpoint isn't available yet. The IDU
// text field below is wired up so that once that API exists you just need
// to fill in `fetchByIdu` below — everything else (state, dialog, table
// column) is already in place.
const AddParamDialog = ({ open, onClose, onSaved }) => {
    const [iduModel, setIduModel] = useState("");
    const [parameter, setParameter] = useState("");
    const [value, setValue] = useState("");
    const [saving, setSaving] = useState(false);
    const [iduSearching, setIduSearching] = useState(false);

    useEffect(() => {
        if (open) {
            setIduModel("");
            setParameter("");
            setValue("");
        }
    }, [open]);

    // TODO: backend endpoint for IDU lookup not available yet.
    // Once it exists, call it here (e.g. mwCeragon/search_idu/?idu_model=...)
    // and use the response to auto-fill `parameter` / `value`, or to show a
    // list of matching parameter/value pairs for the user to pick from
    // (similar to PlanIdSearch above).
    const fetchByIdu = async () => {
        if (!iduModel.trim()) return;
        setIduSearching(true);
        try {
            // const res = await getData(`mwCeragon/search_idu/?idu_model=${encodeURIComponent(iduModel.trim())}`);
            // ... populate parameter / value from res once API is ready
            Swal.fire("Coming Soon", "IDU lookup API is not connected yet. You can still enter the parameter and value manually.", "info");
        } catch (err) {
            Swal.fire("Error", "Something went wrong while searching the IDU.", "error");
        } finally {
            setIduSearching(false);
        }
    };

    const handleSave = async () => {
        if (!iduModel.trim()) {
            Swal.fire("Validation", "IDU model is required.", "warning");
            return;
        }
        if (!parameter.trim()) {
            Swal.fire("Validation", "Parameter name is required.", "warning");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${ServerURL}/mwCeragon/parameter/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idu_model: iduModel.trim(),
                    parameter: parameter.trim(),
                    value: value.trim(),
                }),
            });
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
                Swal.fire({ icon: "success", title: "Added!", timer: 1800, showConfirmButton: false });
                onSaved();
                onClose();
            } else {
                Swal.fire("Error", data?.message || "Add failed.", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong.", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock
            PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
            <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #8cc6eb)` }} />
            <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <AddIcon sx={{ color: TEAL, fontSize: 20 }} />
                    <Typography fontWeight={700} fontSize={16}>Add Parameter</Typography>
                </Box>
                <IconButton size="small" onClick={onClose}
                    sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
                    <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3, pb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <Box display="flex" gap={1}>
                    <TextField
                        label="IDU (e.g. IDU20...)"
                        value={iduModel}
                        onChange={(e) => setIduModel(e.target.value)}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                    />
                    <Tooltip title="Search by IDU (coming soon)" arrow>
                        <span>
                            <IconButton
                                onClick={fetchByIdu}
                                disabled={iduSearching || !iduModel.trim()}
                                sx={{ bgcolor: TEAL_LIGHT, color: TEAL, borderRadius: "8px", "&:hover": { bgcolor: TEAL_MID } }}
                            >
                                {iduSearching ? <CircularProgress size={16} /> : <SearchIcon sx={{ fontSize: 18 }} />}
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
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
                    {saving ? "Saving…" : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// ─── Parameter Edit Dialog ──────────────────────────────────────────────────
const EditParamDialog = ({ open, onClose, row, onSaved }) => {
    const [iduModel, setIduModel] = useState("");
    const [parameter, setParameter] = useState("");
    const [value, setValue] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open && row) {
            setIduModel(row.idu_model ?? "");
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
                body: JSON.stringify({
                    idu_model: iduModel.trim(),
                    parameter: parameter.trim(),
                    value: value.trim(),
                }),
            });
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
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
            <DialogContent sx={{ pt: 3, pb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField
                    label="IDU"
                    value={iduModel}
                    onChange={(e) => setIduModel(e.target.value)}
                    size="small"
                    fullWidth
                    sx={fieldSx}
                />
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
// IDU filter is a live, type-as-you-go filter against the already-loaded
// `rows` (same pattern as the Circle / Site ID / Equipment Make filter bar
// on the AVIAT dashboard) — no extra request per keystroke. If the
// parameter list ever needs to be server-filtered by IDU instead, swap the
// `filteredRows` useMemo below for a debounced fetch keyed on `iduFilter`.
const ParameterTable = ({ rows, loading, onEdit, onDelete, onAdd }) => {
    const [iduFilter, setIduFilter] = useState("");

    const filteredRows = React.useMemo(() => {
        const q = iduFilter.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((row) => (row.idu_model ?? "").toLowerCase().includes(q));
    }, [rows, iduFilter]);

    return (
    <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} flexWrap="wrap" gap={1}>
            <Box display="flex" alignItems="center" gap={0.8}>
                <TuneIcon sx={{ fontSize: 17, color: TEAL }} />
                <Typography fontSize={13.5} fontWeight={700} color="#1a1a2e">Parameters &amp; Values</Typography>
                {filteredRows.length > 0 && (
                    <Chip label={`${filteredRows.length} entries`} size="small"
                        sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
                )}
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
                <TextField
                    placeholder="Filter by IDU…"
                    value={iduFilter}
                    onChange={(e) => setIduFilter(e.target.value)}
                    size="small"
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ fontSize: 16, color: "#9aa3af", mr: 0.5 }} />,
                    }}
                    sx={{ ...fieldSx, width: 180, "& .MuiOutlinedInput-root": { ...fieldSx["& .MuiOutlinedInput-root"], height: 32 } }}
                />
                <Tooltip title="Add parameter" arrow>
                    <IconButton size="small" onClick={onAdd}
                        sx={{ bgcolor: TEAL_LIGHT, color: TEAL, borderRadius: "8px", "&:hover": { bgcolor: TEAL_MID } }}>
                        <AddIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>

        <TableContainer component={Paper} elevation={0}
            sx={{ border: `1px solid ${TEAL_MID}`, borderRadius: "10px", overflow: "hidden", maxHeight: 280 }}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow sx={{ bgcolor: TEAL }}>
                        {["SN", "IDU", "Parameter", "Value", "Actions"].map((h) => (
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
                            <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                <CircularProgress size={22} sx={{ color: TEAL }} />
                            </TableCell>
                        </TableRow>
                    )}
                    {!loading && filteredRows.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 3, color: "#aaa", fontSize: 13 }}>
                                {iduFilter.trim() ? `No parameters found for IDU "${iduFilter.trim()}".` : "No parameters found."}
                            </TableCell>
                        </TableRow>
                    )}
                    {!loading && filteredRows.map((row, idx) => (
                        <TableRow key={row.id ?? idx} hover
                            sx={{ "&:nth-of-type(even)": { bgcolor: "#f8fcfb" }, "&:hover": { bgcolor: TEAL_LIGHT + "88" } }}>
                            <TableCell sx={{ color: "#b0b7c3", fontSize: 12, fontWeight: 600, width: 40 }}>{idx + 1}</TableCell>
                            <TableCell sx={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>
                                {row.idu_model ? (
                                    <Chip label={row.idu_model} size="small"
                                        sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11.5, border: "1px solid #ffcc80" }} />
                                ) : (
                                    <Typography component="span" fontSize={12.5} color="#aaa">—</Typography>
                                )}
                            </TableCell>
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
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const MicrowaveCeragonUpload = () => {
    const classes = OverAllCss();
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();

    // ── plan id (generic/flexible — wire up auto-refetch later if needed) ───────
    // selectedPlan is a plain string now (e.g. "MW-N-MUM-25052023-418"),
    // since the search_planid/ endpoint returns plan_id strings, not objects.
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handlePlanSelected = (planId) => {
        setSelectedPlan(planId);
        if (planId) {
            setShowError((prev) => ({ ...prev, plan: false }));
        }
        // TODO: once decided, this is the place to optionally trigger
        // fetchLinkFiles() / fetchParameters() scoped to planId
    };

    // ── file states ─────────────────────────────────────────────────────────────
    const [report_File, setReport_File] = useState({ filename: "", bytes: "" });
    const [report_File2, setReport_File2] = useState({ filename: "", bytes: "" });
    const [fileData, setFileData] = useState();
    const [download, setDownload] = useState(false);

    const [showError, setShowError] = useState({
        budget: false,
        report: false,
        plan: false,
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
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
                Swal.fire("Deleted!", data?.message || "File(s) deleted successfully.", "success");
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
    const [addDialogOpen, setAddDialogOpen] = useState(false);

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

    /**
     * Delete handler — fixed.
     *
     * Previous bug: `JSON.parse` on a non-JSON / empty response body threw,
     * which landed in the catch block and always showed "Something went
     * wrong" even when the DELETE request itself succeeded (HTTP 200) and
     * the row really was removed server-side. The UI state was then never
     * refreshed in the success path, so the row could disappear after a
     * manual refresh ("data is also deleting") while the on-screen toast
     * still said it failed.
     *
     * Fix: use safeParseJson (never throws on bad/empty JSON) and
     * isSuccessResponse (treats any 2xx with no explicit status:false as a
     * success), then always resync from the server via fetchParameters().
     */
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
            const data = await safeParseJson(res);

            if (isSuccessResponse(res, data)) {
                Swal.fire({ icon: "success", title: "Deleted!", timer: 1600, showConfirmButton: false });
            } else {
                Swal.fire("Error", data?.message || "Delete failed.", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong.", "error");
        } finally {
            // Always resync the table with the server, regardless of which
            // branch above ran, so the UI never silently drifts from the
            // backend's actual state.
            await fetchParameters();
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
    // Dump 1 and Dump 2 are both optional individually — the user can submit
    // with just one, the other, or both. We only flag the "report" error if
    // NEITHER dump file is selected. plan_id is required by upload_dump/ on
    // the backend (it 400s with "plan_id not provided" otherwise), so it's
    // validated here and always sent as a plain string.
    const handleSubmit = async () => {
        const hasDump1 = !!report_File.bytes.length;
        const hasDump2 = !!report_File2.bytes.length;
        const hasPlan = !!(selectedPlan && String(selectedPlan).trim());
        const isValid = linkFiles.length > 0 && (hasDump1 || hasDump2) && hasPlan;
        if (!isValid) {
            setShowError({
                budget: !linkFiles.length,
                report: !hasDump1 && !hasDump2,
                plan: !hasPlan,
            });
            if (!hasPlan) {
                Swal.fire("Validation", "Please search and select a Plan ID first.", "warning");
            }
            return;
        }

        action(true);
        const formData = new FormData();
        for (let j = 0; j < report_File.bytes.length; j++) {
            formData.append("dump_file1", report_File.bytes[j]);
        }
        for (let j = 0; j < report_File2.bytes.length; j++) {
            formData.append("dump_file2", report_File2.bytes[j]);
        }
        formData.append("plan_id", String(selectedPlan).trim());

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
        setReport_File2({ filename: "", bytes: "" });
        setDownload(false);
        setShowError({ budget: false, report: false, plan: false });
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

                                {/* ── PLAN ID SEARCH ── */}
                                <Box className={classes.Front_Box}>
                                    <Typography className={classes.Front_Box_Hading} sx={{ mb: 1 }}>
                                        Search Plan ID:
                                    </Typography>
                                    <PlanIdSearch onPlanSelected={handlePlanSelected} />
                                    {showError.plan && (
                                        <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>
                                            This Field Is Required!
                                        </Typography>
                                    )}
                                </Box>

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
                                    <div className={classes.Front_Box_Hading}>Select Dump A:</div>
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
                                    </div>
                                </Box>

                                {/* ── SELECT DUMP 2 ── */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Select Dump B:</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <Button
                                            variant="contained"
                                            component="label"
                                            color={report_File2.filename ? "warning" : "primary"}
                                            sx={{ textTransform: "uppercase", fontWeight: 700 }}
                                        >
                                            Select File
                                            <input hidden type="file" multiple onChange={(e) => updateFile(e, setReport_File2, "report")} />
                                        </Button>
                                        {report_File2.filename && (
                                            <span style={{ color: "green", fontSize: 16, fontWeight: 600, marginLeft: 12 }}>
                                                No. of Files: {report_File2.filename}
                                            </span>
                                        )}
                                        {showError.report && (
                                            <span style={{ color: "red", fontSize: 16, fontWeight: 600, marginLeft: 8 }}>
                                                Select at least one dump file (Dump or Dump 2)!
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
                                        onAdd={() => setAddDialogOpen(true)}
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

            {/* ── Add Parameter Dialog ── */}
            <AddParamDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                onSaved={fetchParameters}
            />

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