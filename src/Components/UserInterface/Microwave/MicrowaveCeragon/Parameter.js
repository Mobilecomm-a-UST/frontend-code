import React, { useState, useEffect, useCallback, useRef } from "react";
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

// ─── Plan ID Search ──────────────────────────────────────────────────────────
const planIdToString = (plan) => {
    if (plan == null) return "";
    if (typeof plan === "string") return plan;
    return plan.plan_id ?? plan.id ?? plan.name ?? "";
};

// Minimum characters before we bother hitting the API, and how long we wait
// after the user stops typing. Both are tuned down from before so results
// feel near-instant while still avoiding a request on every keystroke.
const SEARCH_MIN_CHARS = 2;
const SEARCH_DEBOUNCE_MS = 150;

const PlanIdSearch = ({ onPlanSelected }) => {
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const skipNextSearch = React.useRef(false);
    // Guards against slow/out-of-order responses overwriting a newer, faster
    // one — this is what made the search *feel* slow before (a stale
    // response for "MW" could land after the response for "MW-N" and wipe
    // out the correct, more specific results).
    const requestIdRef = useRef(0);

    const runSearch = useCallback(async (term) => {
        const trimmed = term.trim();
        if (trimmed.length < SEARCH_MIN_CHARS) {
            setOptions([]); setShowOptions(false); setHasSearched(false);
            return;
        }
        const currentRequestId = ++requestIdRef.current;
        setSearching(true);
        try {
            const body = new FormData();
            body.append("plan_id", trimmed);
            const res = await postData("mwCeragon/search_planid/", body);
            if (currentRequestId !== requestIdRef.current) return; // stale, ignore
            let results = [];
            if (Array.isArray(res)) results = res;
            else if (Array.isArray(res?.data)) results = res.data;
            else if (Array.isArray(res?.results)) results = res.results;
            else if (typeof res === "string") results = [res];
            else if (res?.status && res?.plan_id) results = [res];
            setOptions(results);
            setShowOptions(true);
            setHasSearched(true);
        } catch {
            if (currentRequestId === requestIdRef.current) { setOptions([]); setHasSearched(true); }
        } finally {
            if (currentRequestId === requestIdRef.current) setSearching(false);
        }
    }, []);

    useEffect(() => {
        if (skipNextSearch.current) { skipNextSearch.current = false; return; }
        const trimmed = query.trim();
        if (trimmed.length < SEARCH_MIN_CHARS) {
            setOptions([]); setShowOptions(false); setHasSearched(false);
            return;
        }
        const timer = setTimeout(() => runSearch(query), SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [query, runSearch]);

    const handlePick = (plan) => {
        const planStr = planIdToString(plan);
        skipNextSearch.current = true;
        setSelectedPlan(planStr);
        setShowOptions(false);
        setQuery(planStr);
        onPlanSelected?.(planStr);
    };

    const handleClear = () => {
        setQuery(""); setSelectedPlan(null); setOptions([]);
        setShowOptions(false); setHasSearched(false);
        onPlanSelected?.(null);
    };

    return (
        <Box sx={{ position: "relative" }}>
            <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Search Plan ID"
                        placeholder="e.g. MW-N-MUM-25052023-418"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setSelectedPlan(null); }}
                        onFocus={() => { if (options.length > 0) setShowOptions(true); }}
                        size="small" fullWidth sx={fieldSx}
                        InputProps={{ endAdornment: searching ? <CircularProgress size={14} sx={{ color: TEAL }} /> : null }}
                    />
                </Grid>
                {selectedPlan && (
                    <Grid item xs>
                        <Chip label={`Plan: ${selectedPlan}`} onDelete={handleClear}
                            sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}`, fontWeight: 600 }} />
                    </Grid>
                )}
            </Grid>
            {showOptions && (
                <Paper elevation={3} sx={{ mt: 1, borderRadius: "8px", maxHeight: 220, overflowY: "auto", border: `1px solid ${TEAL_MID}`, position: "absolute", zIndex: 10, width: { xs: "100%", md: "50%" } }}>
                    {options.length > 0 ? options.map((opt, idx) => {
                        const label = planIdToString(opt);
                        return <MenuItem key={label || idx} onClick={() => handlePick(opt)} sx={{ fontSize: 13 }}>{label}</MenuItem>;
                    }) : (
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

// ─── Add Parameter Dialog ────────────────────────────────────────────────────
const AddParamDialog = ({ open, onClose, onSaved }) => {
    const [iduModel, setIduModel] = useState("");
    const [parameter, setParameter] = useState("");
    const [value, setValue] = useState("");
    const [saving, setSaving] = useState(false);
    const [iduSearching, setIduSearching] = useState(false);

    useEffect(() => { if (open) { setIduModel(""); setParameter(""); setValue(""); } }, [open]);

    const fetchByIdu = async () => {
        if (!iduModel.trim()) return;
        setIduSearching(true);
        try {
            Swal.fire("Coming Soon", "IDU lookup API is not connected yet. You can still enter the parameter and value manually.", "info");
        } catch { Swal.fire("Error", "Something went wrong while searching the IDU.", "error"); }
        finally { setIduSearching(false); }
    };

    const handleSave = async () => {
        if (!iduModel.trim()) { Swal.fire("Validation", "IDU model is required.", "warning"); return; }
        if (!parameter.trim()) { Swal.fire("Validation", "Parameter name is required.", "warning"); return; }
        setSaving(true);
        try {
            const res = await fetch(`${ServerURL}/mwCeragon/parameter/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idu_model: iduModel.trim(), parameter: parameter.trim(), value: value.trim() }),
            });
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
                Swal.fire({ icon: "success", title: "Added!", timer: 1800, showConfirmButton: false });
                onSaved(); onClose();
            } else { Swal.fire("Error", data?.message || "Add failed.", "error"); }
        } catch { Swal.fire("Error", "Something went wrong.", "error"); }
        finally { setSaving(false); }
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
                    <TextField label="IDU (e.g. IDU20...)" value={iduModel} onChange={(e) => setIduModel(e.target.value)} size="small" fullWidth sx={fieldSx} />
                    <Tooltip title="Search by IDU (coming soon)" arrow>
                        <span>
                            <IconButton onClick={fetchByIdu} disabled={iduSearching || !iduModel.trim()}
                                sx={{ bgcolor: TEAL_LIGHT, color: TEAL, borderRadius: "8px", "&:hover": { bgcolor: TEAL_MID } }}>
                                {iduSearching ? <CircularProgress size={16} /> : <SearchIcon sx={{ fontSize: 18 }} />}
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
                <TextField label="Parameter" value={parameter} onChange={(e) => setParameter(e.target.value)} size="small" fullWidth sx={fieldSx} />
                <TextField label="Value" value={value} onChange={(e) => setValue(e.target.value)} size="small" fullWidth sx={fieldSx} />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
                <Button onClick={onClose} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} disabled={saving}
                    startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
                    sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5 }}>
                    {saving ? "Saving…" : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// ─── Edit Parameter Dialog ────────────────────────────────────────────────────
const EditParamDialog = ({ open, onClose, row, onSaved }) => {
    const [iduModel, setIduModel] = useState("");
    const [parameter, setParameter] = useState("");
    const [value, setValue] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open && row) { setIduModel(row.idu_model ?? ""); setParameter(row.parameter ?? ""); setValue(row.value ?? ""); }
    }, [open, row]);

    const handleSave = async () => {
        if (!parameter.trim()) { Swal.fire("Validation", "Parameter name is required.", "warning"); return; }
        setSaving(true);
        try {
            const res = await fetch(`${ServerURL}/mwCeragon/parameter/${row.id}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idu_model: iduModel.trim(), parameter: parameter.trim(), value: value.trim() }),
            });
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
                Swal.fire({ icon: "success", title: "Updated!", timer: 1800, showConfirmButton: false });
                onSaved(); onClose();
            } else { Swal.fire("Error", data?.message || "Update failed.", "error"); }
        } catch { Swal.fire("Error", "Something went wrong.", "error"); }
        finally { setSaving(false); }
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
                <TextField label="IDU" value={iduModel} onChange={(e) => setIduModel(e.target.value)} size="small" fullWidth sx={fieldSx} />
                <TextField label="Parameter" value={parameter} onChange={(e) => setParameter(e.target.value)} size="small" fullWidth sx={fieldSx} />
                <TextField label="Value" value={value} onChange={(e) => setValue(e.target.value)} size="small" fullWidth sx={fieldSx} />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
                <Button onClick={onClose} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} disabled={saving}
                    startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
                    sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5 }}>
                    {saving ? "Saving…" : "Update"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// ─── Single Link Budget Row ──────────────────────────────────────────────────
const LinkBudgetRow = ({ label, files, onUpload, onDelete, showError }) => (
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
                        <Typography key={index} fontWeight={600} color="green" fontSize={13}>{file}</Typography>
                    ))
                ) : (
                    <Typography color="gray" fontSize={13}>No file uploaded.</Typography>
                )}
            </Grid>
            <Grid item>
                <Button variant="contained"
                    sx={{ backgroundColor: "#d32f2f", color: "white", textTransform: "uppercase", fontWeight: 700 }}
                    disabled={!files.length} onClick={onDelete}>
                    Delete
                </Button>
            </Grid>
        </Grid>
        {showError && (
            <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>This Field Is Required!</Typography>
        )}
    </Box>
);

// ─── Multi-select Dump File Box (accumulates files across multiple selections) ──
// Selecting a file input again does NOT replace what's already chosen — new
// files get merged in (duplicates by name+size+lastModified are skipped),
// so picking 10 files from folder A then 10 more from folder B ends up with
// all 20.
const DumpFileBox = ({ label, files, onAddFiles, onClearAll }) => (
    <Box sx={{
        border: "1.5px solid #e0e0e0", borderRadius: "10px",
        p: 1.4, bgcolor: "#fafbfc", height: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
    }}>
        <Typography fontWeight={700} fontSize={13} color="#1a1a2e" mb={0.8}>{label}</Typography>

        <Button variant="contained" component="label" size="small"
            color={files.length ? "warning" : "primary"}
            sx={{ textTransform: "uppercase", fontWeight: 700, fontSize: 11 }}>
            Select File
            <input hidden type="file" multiple onChange={onAddFiles} />
        </Button>

        {files.length > 0 ? (
            <Box display="flex" alignItems="center" gap={0.7} mt={0.9}>
                <Typography color="green" fontSize={12} fontWeight={600}>
                    {files.length} file(s) selected
                </Typography>
                <Typography
                    component="span"
                    onClick={onClearAll}
                    sx={{ fontSize: 11, color: "#d32f2f", cursor: "pointer", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
                >
                    (clear)
                </Typography>
            </Box>
        ) : (
            <Typography color="gray" fontSize={12} mt={0.9}>No file uploaded.</Typography>
        )}
    </Box>
);

// ─── Parameter Table (scrollable) ────────────────────────────────────────────
const ParameterTable = ({ rows, loading, onEdit, onDelete, onAdd }) => {
    const [iduFilter, setIduFilter] = useState("");

    const filteredRows = React.useMemo(() => {
        const q = iduFilter.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((row) => (row.idu_model ?? "").toLowerCase().includes(q));
    }, [rows, iduFilter]);

    return (
        <Box>
            {/* Header row: title + filter + add button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5} flexWrap="wrap" gap={1}>
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
                        InputProps={{ startAdornment: <SearchIcon sx={{ fontSize: 16, color: "#9aa3af", mr: 0.5 }} /> }}
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

            {/* Scrollable table container — fixed height so it doesn't grow unbounded */}
            <TableContainer component={Paper} elevation={0}
                sx={{
                    border: `1px solid ${TEAL_MID}`,
                    borderRadius: "10px",
                    overflow: "hidden",
                    /* Fixed height: header (~42px) + 8 rows (~37px each) = ~340px.
                       Anything beyond 8 rows scrolls smoothly inside this box. */
                    maxHeight: 380,
                    overflowY: "auto",
                    /* Custom thin scrollbar — matches dashboard style */
                    "&::-webkit-scrollbar": { width: 5 },
                    "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: 4 },
                    "&::-webkit-scrollbar-thumb": { background: TEAL_MID, borderRadius: 4 },
                    "&::-webkit-scrollbar-thumb:hover": { background: TEAL },
                }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            {["SN", "IDU", "Parameter", "Value", "Actions"].map((h) => (
                                <TableCell key={h} sx={{
                                    color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.3,
                                    bgcolor: TEAL, letterSpacing: ".03em", whiteSpace: "nowrap",
                                    /* stickyHeader needs explicit bgcolor or it turns transparent */
                                    position: "sticky", top: 0, zIndex: 2,
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
const Parameter = () => {
    const classes = OverAllCss();
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();

    // ── plan id ──────────────────────────────────────────────────────────────────
    const [selectedPlan, setSelectedPlan] = useState(null);
    const handlePlanSelected = (planId) => {
        setSelectedPlan(planId);
        if (planId) setShowError((prev) => ({ ...prev, plan: false }));
    };

    // ── dump file states — plain arrays of File objects that ACCUMULATE
    //    across multiple "Select File(s)" clicks, instead of being replaced ──
    const [report_File, setReport_File] = useState([]);
    const [report_File2, setReport_File2] = useState([]);
    const [fileData, setFileData] = useState();
    const [download, setDownload] = useState(false);

    const [showError, setShowError] = useState({ budget: false, report: false, plan: false });

    // ── link budget file 1 ───────────────────────────────────────────────────────
    const [linkFiles, setLinkFiles] = useState([]);

    const fetchLinkFiles = useCallback(async () => {
        const res = await getData("mwCeragon/linkbudget/");
        if (res?.status && Array.isArray(res.files)) setLinkFiles(res.files);
        else setLinkFiles([]);
    }, []);

    useEffect(() => { fetchLinkFiles(); }, [fetchLinkFiles]);

    const handleLinkFileUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) formData.append("link_buget_file", files[i]);
        action(true);
        const res = await postData("mwCeragon/linkbudget/", formData);
        action(false);
        if (res.status) {
            Swal.fire("Success", "Files Uploaded", "success");
            fetchLinkFiles();
            setShowError((prev) => ({ ...prev, budget: false }));
        } else { Swal.fire("Error", res.message, "error"); }
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
            const res = await fetch(`${ServerURL}/mwCeragon/linkbudget/`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
                Swal.fire("Deleted!", data?.message || "File(s) deleted successfully.", "success");
                setLinkFiles([]);
            } else { Swal.fire("Error", data?.message || "Delete failed", "error"); }
        } catch { Swal.fire("Error", "Something went wrong. Please try again.", "error"); }
        finally { action(false); }
    };

    // ── link budget file 2 ───────────────────────────────────────────────────────
    const [linkFiles2, setLinkFiles2] = useState([]);

    const fetchLinkFiles2 = useCallback(async () => {
        const res = await getData("mwCeragon/linkbudget2/");
        if (res?.status && Array.isArray(res.files)) setLinkFiles2(res.files);
        else setLinkFiles2([]);
    }, []);

    useEffect(() => { fetchLinkFiles2(); }, [fetchLinkFiles2]);

    const handleLinkFileUpload2 = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) formData.append("link_buget_file", files[i]);
        action(true);
        const res = await postData("mwCeragon/linkbudget2/", formData);
        action(false);
        if (res.status) {
            Swal.fire("Success", "Files Uploaded", "success");
            fetchLinkFiles2();
        } else { Swal.fire("Error", res.message, "error"); }
    };

    const handleDeleteLinkFiles2 = async () => {
        const result = await Swal.fire({
            title: "Are you sure?", text: "This will permanently delete the second link budget file.",
            icon: "warning", showCancelButton: true, confirmButtonColor: "#d32f2f",
            cancelButtonColor: "#1976d2", confirmButtonText: "Yes, delete", cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) return;
        action(true);
        try {
            const res = await fetch(`${ServerURL}/mwCeragon/linkbudget2/`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
                Swal.fire("Deleted!", data?.message || "File(s) deleted successfully.", "success");
                setLinkFiles2([]);
            } else { Swal.fire("Error", data?.message || "Delete failed", "error"); }
        } catch { Swal.fire("Error", "Something went wrong. Please try again.", "error"); }
        finally { action(false); }
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
            if (Array.isArray(res)) setParameters(res);
            else if (Array.isArray(res?.data)) setParameters(res.data);
            else if (Array.isArray(res?.results)) setParameters(res.results);
            else setParameters([]);
        } catch { setParameters([]); }
        finally { setParamLoading(false); }
    }, []);

    useEffect(() => { fetchParameters(); }, [fetchParameters]);

    const handleEditParam = (row) => { setEditRow(row); setEditDialogOpen(true); };

    const handleDeleteParam = async (row) => {
        const result = await Swal.fire({
            title: "Delete Parameter?",
            html: `<span style="font-size:14px;color:#555">Delete <b>${row.parameter}</b>?</span>`,
            icon: "warning", showCancelButton: true, confirmButtonColor: "#d32f2f",
            confirmButtonText: "Yes, delete", cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) return;
        action(true);
        try {
            const res = await fetch(`${ServerURL}/mwCeragon/parameter/${row.id}/`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
                Swal.fire({ icon: "success", title: "Deleted!", timer: 1600, showConfirmButton: false });
            } else { Swal.fire("Error", data?.message || "Delete failed.", "error"); }
        } catch { Swal.fire("Error", "Something went wrong.", "error"); }
        finally { await fetchParameters(); action(false); }
    };

    // ── dump file handler ────────────────────────────────────────────────────────
    // Merges newly picked files into whatever is already selected instead of
    // replacing it, so choosing files from folder A then folder B keeps both
    // batches. Duplicate files (same name+size+lastModified) are skipped, and
    // the input is reset so re-selecting the same file still fires onChange.
    const addFiles = (event, setFileState, errorKey) => {
        const selected = Array.from(event.target.files || []);
        if (selected.length === 0) return;
        setShowError((prev) => ({ ...prev, [errorKey]: false }));
        setFileState((prev) => {
            const existingKeys = new Set(prev.map((f) => `${f.name}_${f.size}_${f.lastModified}`));
            const merged = [...prev];
            selected.forEach((f) => {
                const key = `${f.name}_${f.size}_${f.lastModified}`;
                if (!existingKeys.has(key)) {
                    merged.push(f);
                    existingKeys.add(key);
                }
            });
            return merged;
        });
        event.target.value = "";
    };

    // ── submit ───────────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        const hasDump1 = report_File.length > 0;
        const hasDump2 = report_File2.length > 0;
        const hasPlan = !!(selectedPlan && String(selectedPlan).trim());
        const isValid = linkFiles.length > 0 && (hasDump1 || hasDump2) && hasPlan;
        if (!isValid) {
            setShowError({ budget: !linkFiles.length, report: !hasDump1 && !hasDump2, plan: !hasPlan });
            if (!hasPlan) Swal.fire("Validation", "Please search and select a Plan ID first.", "warning");
            return;
        }
        action(true);
        const formData = new FormData();
        report_File.forEach((file) => formData.append("dump_file1", file));
        report_File2.forEach((file) => formData.append("dump_file2", file));
        formData.append("plan_id", String(selectedPlan).trim());
        const response = await postData("mwCeragon/upload_dump/", formData);
        action(false);
        if (response.status) {
            setDownload(true); setFileData(response.download_url);
            Swal.fire("Done", response.message, "success");
        } else { Swal.fire("Oops...", response.message, "error"); }
    };

    const handleCancel = () => {
        setReport_File([]);
        setReport_File2([]);
        setDownload(false);
        setShowError({ budget: false, report: false, plan: false });
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
                            <Box className={classes.Box_Hading}>Make Microwave(Ceragon) Parameter</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>

                                {/* ── PLAN ID SEARCH ── */}
                                {/* <Box className={classes.Front_Box}>
                                    <Typography className={classes.Front_Box_Hading} sx={{ mb: 1 }}>
                                        Search Plan ID:
                                    </Typography>
                                    <PlanIdSearch onPlanSelected={handlePlanSelected} />
                                    {showError.plan && (
                                        <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>This Field Is Required!</Typography>
                                    )}
                                </Box> */}

                                {/* ── LINK BUDGET FILE 1 ── */}
                                {/* <Box className={classes.Front_Box}>
                                    <LinkBudgetRow
                                        label="Select Link Budget File 1:"
                                        files={linkFiles}
                                        onUpload={handleLinkFileUpload}
                                        onDelete={handleDeleteLinkFiles}
                                        showError={showError.budget}
                                    />
                                </Box> */}

                                {/* ── LINK BUDGET FILE 2 ── */}
                                {/* <Box className={classes.Front_Box}>
                                    <LinkBudgetRow
                                        label="Select Link Budget File 2:"
                                        files={linkFiles2}
                                        onUpload={handleLinkFileUpload2}
                                        onDelete={handleDeleteLinkFiles2}
                                        showError={false}
                                    />
                                </Box> */}

                                {/* ── DUMP A + DUMP B — narrow card, not stretched to full width ── */}
                                {/* <Box className={classes.Front_Box} sx={{ maxWidth: 1200, mx: "auto" }}>
                                    <Typography className={classes.Front_Box_Hading} sx={{ mb: 1.2, textAlign: "center" }}>
                                        Select Dump Files:
                                    </Typography>
                                    <Grid container spacing={1.5}>
                                        <Grid item xs={6}>
                                            <DumpFileBox
                                                label="Dump A"
                                                files={report_File}
                                                onAddFiles={(e) => addFiles(e, setReport_File, "report")}
                                                onClearAll={() => setReport_File([])}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <DumpFileBox
                                                label="Dump B"
                                                files={report_File2}
                                                onAddFiles={(e) => addFiles(e, setReport_File2, "report")}
                                                onClearAll={() => setReport_File2([])}
                                            />
                                        </Grid>
                                    </Grid>
                                    {showError.report && (
                                        <Typography color="red" fontWeight={600} fontSize={12.5} mt={1} textAlign="center">
                                            Select at least one dump file (Dump A or Dump B)!
                                        </Typography>
                                    )}
                                </Box> */}

                                {/* ── PARAMETER & VALUE TABLE (scrollable) ── */}
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
                            {/* <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}
                                    sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                                    Submit
                                </Button>
                                <Button variant="contained" onClick={handleCancel} endIcon={<DoDisturbIcon />}
                                    sx={{ backgroundColor: "#d32f2f", color: "white", fontWeight: 700, textTransform: "uppercase" }}>
                                    Cancel
                                </Button>
                            </Stack> */}
                        </Box>
                    </Box>

                    {/* ── DOWNLOAD ── */}
                    {/* {download && (
                        <Box textAlign="center" mt={2}>
                            <a href={fileData} download>
                                <Button variant="outlined"
                                    startIcon={<FileDownloadIcon sx={{ fontSize: 28, color: "green" }} />}
                                    sx={{ textTransform: "none", fontWeight: 800, fontSize: "20px", fontFamily: "Poppins" }}>
                                    Download Ceragon Report
                                </Button>
                            </a>
                        </Box>
                    )} */}
                </Box>
            </Slide>

            {/* ── Dialogs ── */}
            <AddParamDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onSaved={fetchParameters} />
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

export default Parameter;