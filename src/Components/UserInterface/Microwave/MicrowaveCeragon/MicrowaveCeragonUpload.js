

// import React, { useState, useEffect, useCallback } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Paper, IconButton, TextField, Tooltip, Chip, Dialog, DialogTitle,
//     DialogContent, DialogActions, CircularProgress, MenuItem,
// } from "@mui/material";
// import {
//     Upload as UploadIcon,
//     DoDisturb as DoDisturbIcon,
//     FileDownload as FileDownloadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
//     Edit as EditIcon,
//     Delete as DeleteIcon,
//     Save as SaveIcon,
//     Close as CloseIcon,
//     Add as AddIcon,
//     TuneOutlined as TuneIcon,
//     Search as SearchIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import "rsuite/dist/rsuite.min.css";

// // ─── theme constants ────────────────────────────────────────────────────────
// const TEAL = "#2a77bf";
// const TEAL_DARK = "#28538c";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID = "#b2dfdb";

// // ─── inline field styles ────────────────────────────────────────────────────
// const fieldSx = {
//     "& .MuiOutlinedInput-root": {
//         borderRadius: "8px",
//         fontSize: 13,
//         "&:hover fieldset": { borderColor: TEAL },
//         "&.Mui-focused fieldset": { borderColor: TEAL },
//     },
//     "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
// };

// /**
//  * Helper: safely parse a fetch Response as JSON.
//  * Some backends return an empty body (or non-JSON body) on 200/204 for
//  * delete-style endpoints — JSON.parse on an empty string throws, which was
//  * previously being swallowed by the outer try/catch and reported as
//  * "Something went wrong" even though the delete had actually succeeded.
//  */
// const safeParseJson = async (res) => {
//     const text = await res.text();
//     if (!text) return {};
//     try {
//         return JSON.parse(text);
//     } catch {
//         return {};
//     }
// };

// /**
//  * Helper: decide whether an API call should be treated as a success.
//  * Defensive / lenient on purpose since different endpoints on this backend
//  * respond with different shapes (status: true/false, success: true, or
//  * nothing at all on a 200/204 with an empty body).
//  */
// const isSuccessResponse = (res, data) => {
//     if (!res.ok) return false; // non-2xx is always a failure
//     if (data == null) return true; // empty body on a 2xx -> treat as success
//     if (typeof data.status === "boolean") return data.status;
//     if (typeof data.success === "boolean") return data.success;
//     // No explicit status/success flag in the body -> fall back to HTTP code
//     return true;
// };

// // ─── Plan ID Search ─────────────────────────────────────────────────────────
// // Generic / flexible by design: it only resolves a plan id right now and
// // hands it back via onPlanSelected. Wire up auto-refetch of link budget /
// // parameters for the selected plan later by using the planId passed back
// // here (e.g. inside onPlanSelected in the parent).
// //
// // Auto-search: typing debounces (350ms) and searches automatically — no
// // button click needed. The backend's search_planid/ endpoint returns a
// // flat array of plan_id strings (e.g. "MW-N-MUM-25052023-418"), not
// // objects, so results are normalized to plain strings everywhere below.
// const planIdToString = (plan) => {
//     if (plan == null) return "";
//     if (typeof plan === "string") return plan;
//     return plan.plan_id ?? plan.id ?? plan.name ?? "";
// };

// const PlanIdSearch = ({ onPlanSelected }) => {
//     const [query, setQuery] = useState("");
//     const [searching, setSearching] = useState(false);
//     const [options, setOptions] = useState([]);
//     const [selectedPlan, setSelectedPlan] = useState(null);
//     const [showOptions, setShowOptions] = useState(false);
//     const [hasSearched, setHasSearched] = useState(false);
//     const skipNextSearch = React.useRef(false);

//     const runSearch = useCallback(async (term) => {
//         const trimmed = term.trim();
//         if (!trimmed) {
//             setOptions([]);
//             setShowOptions(false);
//             setHasSearched(false);
//             return;
//         }
//         setSearching(true);
//         try {
//             // Backend expects a POST with field plan_id (confirmed from the
//             // Network tab payload). Sent as FormData — same as every other
//             // postData(...) call in this file (linkbudget/, upload_dump/) —
//             // since postData here may not reliably JSON-encode a plain
//             // object the way fetch's JSON.stringify would.
//             const body = new FormData();
//             body.append("plan_id", trimmed);

//             // TEMP DIAGNOSTIC — remove once search is confirmed working.
//             // Open the browser console while typing to see exactly what's
//             // sent vs what comes back; this will immediately show if
//             // `trimmed` is empty, or if `res` isn't shaped the way the
//             // parsing logic below expects.
//             console.log("[PlanIdSearch] searching for:", trimmed);

//             const res = await postData("mwCeragon/search_planid/", body);

//             console.log("[PlanIdSearch] raw response:", res);

//             let results = [];
//             if (Array.isArray(res)) results = res;
//             else if (Array.isArray(res?.data)) results = res.data;
//             else if (Array.isArray(res?.results)) results = res.results;
//             else if (typeof res === "string") results = [res];
//             else if (res?.status && res?.plan_id) results = [res]; // single object response

//             console.log("[PlanIdSearch] parsed results:", results);

//             setOptions(results);
//             setShowOptions(true);
//             setHasSearched(true);
//         } catch (err) {
//             console.log("[PlanIdSearch] search error:", err);
//             setOptions([]);
//             setHasSearched(true);
//         } finally {
//             setSearching(false);
//         }
//     }, []);

//     // Debounced auto-search on every keystroke.
//     useEffect(() => {
//         if (skipNextSearch.current) {
//             skipNextSearch.current = false;
//             return;
//         }
//         if (!query.trim()) {
//             setOptions([]);
//             setShowOptions(false);
//             setHasSearched(false);
//             return;
//         }
//         const timer = setTimeout(() => runSearch(query), 350);
//         return () => clearTimeout(timer);
//     }, [query, runSearch]);

//     const handlePick = (plan) => {
//         const planStr = planIdToString(plan);
//         skipNextSearch.current = true;
//         setSelectedPlan(planStr);
//         setShowOptions(false);
//         setQuery(planStr);
//         // Hand the resolved plan_id string back to the parent. Parent
//         // decides what to do with it (store for submit, refetch link
//         // files/params, etc.)
//         onPlanSelected?.(planStr);
//     };

//     const handleClear = () => {
//         setQuery("");
//         setSelectedPlan(null);
//         setOptions([]);
//         setShowOptions(false);
//         setHasSearched(false);
//         onPlanSelected?.(null);
//     };

//     return (
//         <Box className="Front_Box_PlanId" sx={{ position: "relative" }}>
//             <Grid container alignItems="center" spacing={2}>
//                 <Grid item xs={12} md={6}>
//                     <TextField
//                         label="Search Plan ID"
//                         placeholder="e.g. MW-N-MUM-25052023-418"
//                         value={query}
//                         onChange={(e) => {
//                             setQuery(e.target.value);
//                             setSelectedPlan(null);
//                         }}
//                         onFocus={() => { if (options.length > 0) setShowOptions(true); }}
//                         size="small"
//                         fullWidth
//                         sx={fieldSx}
//                         InputProps={{
//                             endAdornment: searching ? <CircularProgress size={14} sx={{ color: TEAL }} /> : null,
//                         }}
//                     />
//                 </Grid>
//                 {selectedPlan && (
//                     <Grid item xs>
//                         <Chip
//                             label={`Plan: ${selectedPlan}`}
//                             onDelete={handleClear}
//                             sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}`, fontWeight: 600 }}
//                         />
//                     </Grid>
//                 )}
//             </Grid>

//             {showOptions && (
//                 <Paper elevation={3} sx={{ mt: 1, borderRadius: "8px", maxHeight: 220, overflowY: "auto", border: `1px solid ${TEAL_MID}`, position: "absolute", zIndex: 10, width: { xs: "100%", md: "50%" } }}>
//                     {options.length > 0 ? (
//                         options.map((opt, idx) => {
//                             const label = planIdToString(opt);
//                             return (
//                                 <MenuItem key={label || idx} onClick={() => handlePick(opt)} sx={{ fontSize: 13 }}>
//                                     {label}
//                                 </MenuItem>
//                             );
//                         })
//                     ) : (
//                         hasSearched && !searching && (
//                             <Box sx={{ px: 2, py: 1.5 }}>
//                                 <Typography fontSize={13} color="#aaa">No plan found matching "{query.trim()}".</Typography>
//                             </Box>
//                         )
//                     )}
//                 </Paper>
//             )}
//         </Box>
//     );
// };

// // ─── Add Parameter Dialog (IDU + Parameter + Value) ────────────────────────
// // NOTE: the "search by IDU" lookup endpoint isn't available yet. The IDU
// // text field below is wired up so that once that API exists you just need
// // to fill in `fetchByIdu` below — everything else (state, dialog, table
// // column) is already in place.
// const AddParamDialog = ({ open, onClose, onSaved }) => {
//     const [iduModel, setIduModel] = useState("");
//     const [parameter, setParameter] = useState("");
//     const [value, setValue] = useState("");
//     const [saving, setSaving] = useState(false);
//     const [iduSearching, setIduSearching] = useState(false);

//     useEffect(() => {
//         if (open) {
//             setIduModel("");
//             setParameter("");
//             setValue("");
//         }
//     }, [open]);

//     // TODO: backend endpoint for IDU lookup not available yet.
//     // Once it exists, call it here (e.g. mwCeragon/search_idu/?idu_model=...)
//     // and use the response to auto-fill `parameter` / `value`, or to show a
//     // list of matching parameter/value pairs for the user to pick from
//     // (similar to PlanIdSearch above).
//     const fetchByIdu = async () => {
//         if (!iduModel.trim()) return;
//         setIduSearching(true);
//         try {
//             // const res = await getData(`mwCeragon/search_idu/?idu_model=${encodeURIComponent(iduModel.trim())}`);
//             // ... populate parameter / value from res once API is ready
//             Swal.fire("Coming Soon", "IDU lookup API is not connected yet. You can still enter the parameter and value manually.", "info");
//         } catch (err) {
//             Swal.fire("Error", "Something went wrong while searching the IDU.", "error");
//         } finally {
//             setIduSearching(false);
//         }
//     };

//     const handleSave = async () => {
//         if (!iduModel.trim()) {
//             Swal.fire("Validation", "IDU model is required.", "warning");
//             return;
//         }
//         if (!parameter.trim()) {
//             Swal.fire("Validation", "Parameter name is required.", "warning");
//             return;
//         }
//         setSaving(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/parameter/`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     idu_model: iduModel.trim(),
//                     parameter: parameter.trim(),
//                     value: value.trim(),
//                 }),
//             });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire({ icon: "success", title: "Added!", timer: 1800, showConfirmButton: false });
//                 onSaved();
//                 onClose();
//             } else {
//                 Swal.fire("Error", data?.message || "Add failed.", "error");
//             }
//         } catch (err) {
//             Swal.fire("Error", "Something went wrong.", "error");
//         } finally {
//             setSaving(false);
//         }
//     };

//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock
//             PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
//             <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #8cc6eb)` }} />
//             <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <AddIcon sx={{ color: TEAL, fontSize: 20 }} />
//                     <Typography fontWeight={700} fontSize={16}>Add Parameter</Typography>
//                 </Box>
//                 <IconButton size="small" onClick={onClose}
//                     sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
//                     <CloseIcon sx={{ fontSize: 16 }} />
//                 </IconButton>
//             </DialogTitle>
//             <DialogContent sx={{ pt: 3, pb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
//                 <Box display="flex" gap={1}>
//                     <TextField
//                         label="IDU (e.g. IDU20...)"
//                         value={iduModel}
//                         onChange={(e) => setIduModel(e.target.value)}
//                         size="small"
//                         fullWidth
//                         sx={fieldSx}
//                     />
//                     <Tooltip title="Search by IDU (coming soon)" arrow>
//                         <span>
//                             <IconButton
//                                 onClick={fetchByIdu}
//                                 disabled={iduSearching || !iduModel.trim()}
//                                 sx={{ bgcolor: TEAL_LIGHT, color: TEAL, borderRadius: "8px", "&:hover": { bgcolor: TEAL_MID } }}
//                             >
//                                 {iduSearching ? <CircularProgress size={16} /> : <SearchIcon sx={{ fontSize: 18 }} />}
//                             </IconButton>
//                         </span>
//                     </Tooltip>
//                 </Box>
//                 <TextField
//                     label="Parameter"
//                     value={parameter}
//                     onChange={(e) => setParameter(e.target.value)}
//                     size="small"
//                     fullWidth
//                     sx={fieldSx}
//                 />
//                 <TextField
//                     label="Value"
//                     value={value}
//                     onChange={(e) => setValue(e.target.value)}
//                     size="small"
//                     fullWidth
//                     sx={fieldSx}
//                 />
//             </DialogContent>
//             <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
//                 <Button onClick={onClose}
//                     sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>
//                     Cancel
//                 </Button>
//                 <Button variant="contained" onClick={handleSave} disabled={saving}
//                     startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
//                     sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5 }}>
//                     {saving ? "Saving…" : "Add"}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// // ─── Parameter Edit Dialog ──────────────────────────────────────────────────
// const EditParamDialog = ({ open, onClose, row, onSaved }) => {
//     const [iduModel, setIduModel] = useState("");
//     const [parameter, setParameter] = useState("");
//     const [value, setValue] = useState("");
//     const [saving, setSaving] = useState(false);

//     useEffect(() => {
//         if (open && row) {
//             setIduModel(row.idu_model ?? "");
//             setParameter(row.parameter ?? "");
//             setValue(row.value ?? "");
//         }
//     }, [open, row]);

//     const handleSave = async () => {
//         if (!parameter.trim()) {
//             Swal.fire("Validation", "Parameter name is required.", "warning");
//             return;
//         }
//         setSaving(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/parameter/${row.id}/`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     idu_model: iduModel.trim(),
//                     parameter: parameter.trim(),
//                     value: value.trim(),
//                 }),
//             });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire({ icon: "success", title: "Updated!", timer: 1800, showConfirmButton: false });
//                 onSaved();
//                 onClose();
//             } else {
//                 Swal.fire("Error", data?.message || "Update failed.", "error");
//             }
//         } catch (err) {
//             Swal.fire("Error", "Something went wrong.", "error");
//         } finally {
//             setSaving(false);
//         }
//     };

//     if (!row) return null;

//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock
//             PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
//             <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #8cc6eb)` }} />
//             <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <TuneIcon sx={{ color: TEAL, fontSize: 20 }} />
//                     <Typography fontWeight={700} fontSize={16}>Edit Parameter</Typography>
//                 </Box>
//                 <IconButton size="small" onClick={onClose}
//                     sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
//                     <CloseIcon sx={{ fontSize: 16 }} />
//                 </IconButton>
//             </DialogTitle>
//             <DialogContent sx={{ pt: 3, pb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
//                 <TextField
//                     label="IDU"
//                     value={iduModel}
//                     onChange={(e) => setIduModel(e.target.value)}
//                     size="small"
//                     fullWidth
//                     sx={fieldSx}
//                 />
//                 <TextField
//                     label="Parameter"
//                     value={parameter}
//                     onChange={(e) => setParameter(e.target.value)}
//                     size="small"
//                     fullWidth
//                     sx={fieldSx}
//                 />
//                 <TextField
//                     label="Value"
//                     value={value}
//                     onChange={(e) => setValue(e.target.value)}
//                     size="small"
//                     fullWidth
//                     sx={fieldSx}
//                 />
//             </DialogContent>
//             <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
//                 <Button onClick={onClose}
//                     sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>
//                     Cancel
//                 </Button>
//                 <Button variant="contained" onClick={handleSave} disabled={saving}
//                     startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
//                     sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5 }}>
//                     {saving ? "Saving…" : "Update"}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// // ─── Parameter Table ─────────────────────────────────────────────────────────
// // IDU filter is a live, type-as-you-go filter against the already-loaded
// // `rows` (same pattern as the Circle / Site ID / Equipment Make filter bar
// // on the AVIAT dashboard) — no extra request per keystroke. If the
// // parameter list ever needs to be server-filtered by IDU instead, swap the
// // `filteredRows` useMemo below for a debounced fetch keyed on `iduFilter`.
// const ParameterTable = ({ rows, loading, onEdit, onDelete, onAdd }) => {
//     const [iduFilter, setIduFilter] = useState("");

//     const filteredRows = React.useMemo(() => {
//         const q = iduFilter.trim().toLowerCase();
//         if (!q) return rows;
//         return rows.filter((row) => (row.idu_model ?? "").toLowerCase().includes(q));
//     }, [rows, iduFilter]);

//     return (
//     <Box>
//         <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} flexWrap="wrap" gap={1}>
//             <Box display="flex" alignItems="center" gap={0.8}>
//                 <TuneIcon sx={{ fontSize: 17, color: TEAL }} />
//                 <Typography fontSize={13.5} fontWeight={700} color="#1a1a2e">Parameters &amp; Values</Typography>
//                 {filteredRows.length > 0 && (
//                     <Chip label={`${filteredRows.length} entries`} size="small"
//                         sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
//                 )}
//             </Box>
//             <Box display="flex" alignItems="center" gap={1}>
//                 <TextField
//                     placeholder="Filter by IDU…"
//                     value={iduFilter}
//                     onChange={(e) => setIduFilter(e.target.value)}
//                     size="small"
//                     InputProps={{
//                         startAdornment: <SearchIcon sx={{ fontSize: 16, color: "#9aa3af", mr: 0.5 }} />,
//                     }}
//                     sx={{ ...fieldSx, width: 180, "& .MuiOutlinedInput-root": { ...fieldSx["& .MuiOutlinedInput-root"], height: 32 } }}
//                 />
//                 <Tooltip title="Add parameter" arrow>
//                     <IconButton size="small" onClick={onAdd}
//                         sx={{ bgcolor: TEAL_LIGHT, color: TEAL, borderRadius: "8px", "&:hover": { bgcolor: TEAL_MID } }}>
//                         <AddIcon sx={{ fontSize: 16 }} />
//                     </IconButton>
//                 </Tooltip>
//             </Box>
//         </Box>

//         <TableContainer component={Paper} elevation={0}
//             sx={{ border: `1px solid ${TEAL_MID}`, borderRadius: "10px", overflow: "hidden", maxHeight: 280 }}>
//             <Table size="small" stickyHeader>
//                 <TableHead>
//                     <TableRow sx={{ bgcolor: TEAL }}>
//                         {["SN", "IDU", "Parameter", "Value", "Actions"].map((h) => (
//                             <TableCell key={h} sx={{
//                                 color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.3,
//                                 bgcolor: TEAL, letterSpacing: ".03em",
//                                 whiteSpace: "nowrap",
//                             }}>{h}</TableCell>
//                         ))}
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {loading && (
//                         <TableRow>
//                             <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
//                                 <CircularProgress size={22} sx={{ color: TEAL }} />
//                             </TableCell>
//                         </TableRow>
//                     )}
//                     {!loading && filteredRows.length === 0 && (
//                         <TableRow>
//                             <TableCell colSpan={5} align="center" sx={{ py: 3, color: "#aaa", fontSize: 13 }}>
//                                 {iduFilter.trim() ? `No parameters found for IDU "${iduFilter.trim()}".` : "No parameters found."}
//                             </TableCell>
//                         </TableRow>
//                     )}
//                     {!loading && filteredRows.map((row, idx) => (
//                         <TableRow key={row.id ?? idx} hover
//                             sx={{ "&:nth-of-type(even)": { bgcolor: "#f8fcfb" }, "&:hover": { bgcolor: TEAL_LIGHT + "88" } }}>
//                             <TableCell sx={{ color: "#b0b7c3", fontSize: 12, fontWeight: 600, width: 40 }}>{idx + 1}</TableCell>
//                             <TableCell sx={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>
//                                 {row.idu_model ? (
//                                     <Chip label={row.idu_model} size="small"
//                                         sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11.5, border: "1px solid #ffcc80" }} />
//                                 ) : (
//                                     <Typography component="span" fontSize={12.5} color="#aaa">—</Typography>
//                                 )}
//                             </TableCell>
//                             <TableCell sx={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{row.parameter}</TableCell>
//                             <TableCell sx={{ fontSize: 13, color: "#374151" }}>
//                                 <Chip label={row.value ?? "—"} size="small"
//                                     sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontWeight: 600, fontSize: 11.5, border: "1px solid #90caf9" }} />
//                             </TableCell>
//                             <TableCell>
//                                 <Box display="flex" gap={0.5}>
//                                     <Tooltip title="Edit" arrow>
//                                         <IconButton size="small" onClick={() => onEdit(row)}
//                                             sx={{ color: TEAL, "&:hover": { bgcolor: TEAL_LIGHT } }}>
//                                             <EditIcon sx={{ fontSize: 16 }} />
//                                         </IconButton>
//                                     </Tooltip>
//                                     <Tooltip title="Delete" arrow>
//                                         <IconButton size="small" onClick={() => onDelete(row)}
//                                             sx={{ color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}>
//                                             <DeleteIcon sx={{ fontSize: 16 }} />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </Box>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     </Box>
//     );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// const MicrowaveCeragonUpload = () => {
//     const classes = OverAllCss();
//     const navigate = useNavigate();
//     const { loading, action } = useLoadingDialog();

//     // ── plan id (generic/flexible — wire up auto-refetch later if needed) ───────
//     // selectedPlan is a plain string now (e.g. "MW-N-MUM-25052023-418"),
//     // since the search_planid/ endpoint returns plan_id strings, not objects.
//     const [selectedPlan, setSelectedPlan] = useState(null);

//     const handlePlanSelected = (planId) => {
//         setSelectedPlan(planId);
//         if (planId) {
//             setShowError((prev) => ({ ...prev, plan: false }));
//         }
//         // TODO: once decided, this is the place to optionally trigger
//         // fetchLinkFiles() / fetchParameters() scoped to planId
//     };

//     // ── file states ─────────────────────────────────────────────────────────────
//     const [report_File, setReport_File] = useState({ filename: "", bytes: "" });
//     const [report_File2, setReport_File2] = useState({ filename: "", bytes: "" });
//     const [fileData, setFileData] = useState();
//     const [download, setDownload] = useState(false);

//     const [showError, setShowError] = useState({
//         budget: false,
//         report: false,
//         plan: false,
//     });

//     // ── link budget files ────────────────────────────────────────────────────────
//     const [linkFiles, setLinkFiles] = useState([]);

//     const fetchLinkFiles = useCallback(async () => {
//         const res = await getData("mwCeragon/linkbudget/");
//         if (res?.status && Array.isArray(res.files)) {
//             setLinkFiles(res.files);
//         } else {
//             setLinkFiles([]);
//         }
//     }, []);

//     useEffect(() => { fetchLinkFiles(); }, [fetchLinkFiles]);

//     const handleLinkFileUpload = async (e) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;

//         const formData = new FormData();
//         for (let i = 0; i < files.length; i++) {
//             formData.append("link_buget_file", files[i]);
//         }

//         action(true);
//         const res = await postData("mwCeragon/linkbudget/", formData);
//         action(false);

//         if (res.status) {
//             Swal.fire("Success", "Files Uploaded", "success");
//             fetchLinkFiles();
//             setShowError((prev) => ({ ...prev, budget: false }));
//         } else {
//             Swal.fire("Error", res.message, "error");
//         }
//     };

//     const handleDeleteLinkFiles = async () => {
//         const result = await Swal.fire({
//             title: "Are you sure?",
//             text: "This will permanently delete the link budget file.",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#d32f2f",
//             cancelButtonColor: "#1976d2",
//             confirmButtonText: "Yes, delete",
//             cancelButtonText: "Cancel",
//         });
//         if (!result.isConfirmed) return;
//         action(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/linkbudget/`, {
//                 method: "DELETE",
//                 headers: { "Content-Type": "application/json" },
//             });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire("Deleted!", data?.message || "File(s) deleted successfully.", "success");
//                 setLinkFiles([]);
//             } else {
//                 Swal.fire("Error", data?.message || "Delete failed", "error");
//             }
//         } catch (error) {
//             Swal.fire("Error", "Something went wrong. Please try again.", "error");
//         } finally {
//             action(false);
//         }
//     };

//     // ── parameters ───────────────────────────────────────────────────────────────
//     const [parameters, setParameters] = useState([]);
//     const [paramLoading, setParamLoading] = useState(false);
//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [editRow, setEditRow] = useState(null);
//     const [addDialogOpen, setAddDialogOpen] = useState(false);

//     const fetchParameters = useCallback(async () => {
//         setParamLoading(true);
//         try {
//             const res = await getData("mwCeragon/parameter/");
//             if (Array.isArray(res)) {
//                 setParameters(res);
//             } else if (Array.isArray(res?.data)) {
//                 setParameters(res.data);
//             } else if (Array.isArray(res?.results)) {
//                 setParameters(res.results);
//             } else {
//                 setParameters([]);
//             }
//         } catch {
//             setParameters([]);
//         } finally {
//             setParamLoading(false);
//         }
//     }, []);

//     useEffect(() => { fetchParameters(); }, [fetchParameters]);

//     const handleEditParam = (row) => {
//         setEditRow(row);
//         setEditDialogOpen(true);
//     };

//     /**
//      * Delete handler — fixed.
//      *
//      * Previous bug: `JSON.parse` on a non-JSON / empty response body threw,
//      * which landed in the catch block and always showed "Something went
//      * wrong" even when the DELETE request itself succeeded (HTTP 200) and
//      * the row really was removed server-side. The UI state was then never
//      * refreshed in the success path, so the row could disappear after a
//      * manual refresh ("data is also deleting") while the on-screen toast
//      * still said it failed.
//      *
//      * Fix: use safeParseJson (never throws on bad/empty JSON) and
//      * isSuccessResponse (treats any 2xx with no explicit status:false as a
//      * success), then always resync from the server via fetchParameters().
//      */
//     const handleDeleteParam = async (row) => {
//         const result = await Swal.fire({
//             title: "Delete Parameter?",
//             html: `<span style="font-size:14px;color:#555">Delete <b>${row.parameter}</b>?</span>`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#d32f2f",
//             confirmButtonText: "Yes, delete",
//             cancelButtonText: "Cancel",
//         });
//         if (!result.isConfirmed) return;

//         action(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/parameter/${row.id}/`, {
//                 method: "DELETE",
//                 headers: { "Content-Type": "application/json" },
//             });
//             const data = await safeParseJson(res);

//             if (isSuccessResponse(res, data)) {
//                 Swal.fire({ icon: "success", title: "Deleted!", timer: 1600, showConfirmButton: false });
//             } else {
//                 Swal.fire("Error", data?.message || "Delete failed.", "error");
//             }
//         } catch (err) {
//             Swal.fire("Error", "Something went wrong.", "error");
//         } finally {
//             // Always resync the table with the server, regardless of which
//             // branch above ran, so the UI never silently drifts from the
//             // backend's actual state.
//             await fetchParameters();
//             action(false);
//         }
//     };

//     // ── dump file ────────────────────────────────────────────────────────────────
//     const updateFile = (event, setFileState, errorKey) => {
//         const files = event.target.files;
//         if (files && files.length > 0) {
//             setShowError((prev) => ({ ...prev, [errorKey]: false }));
//             setFileState({ filename: files.length, bytes: files });
//         }
//     };

//     // ── submit ───────────────────────────────────────────────────────────────────
//     // Dump 1 and Dump 2 are both optional individually — the user can submit
//     // with just one, the other, or both. We only flag the "report" error if
//     // NEITHER dump file is selected. plan_id is required by upload_dump/ on
//     // the backend (it 400s with "plan_id not provided" otherwise), so it's
//     // validated here and always sent as a plain string.
//     const handleSubmit = async () => {
//         const hasDump1 = !!report_File.bytes.length;
//         const hasDump2 = !!report_File2.bytes.length;
//         const hasPlan = !!(selectedPlan && String(selectedPlan).trim());
//         const isValid = linkFiles.length > 0 && (hasDump1 || hasDump2) && hasPlan;
//         if (!isValid) {
//             setShowError({
//                 budget: !linkFiles.length,
//                 report: !hasDump1 && !hasDump2,
//                 plan: !hasPlan,
//             });
//             if (!hasPlan) {
//                 Swal.fire("Validation", "Please search and select a Plan ID first.", "warning");
//             }
//             return;
//         }

//         action(true);
//         const formData = new FormData();
//         for (let j = 0; j < report_File.bytes.length; j++) {
//             formData.append("dump_file1", report_File.bytes[j]);
//         }
//         for (let j = 0; j < report_File2.bytes.length; j++) {
//             formData.append("dump_file2", report_File2.bytes[j]);
//         }
//         formData.append("plan_id", String(selectedPlan).trim());

//         const response = await postData("mwCeragon/upload_dump/", formData);
//         action(false);

//         if (response.status) {
//             setDownload(true);
//             setFileData(response.download_url);
//             Swal.fire("Done", response.message, "success");
//         } else {
//             Swal.fire("Oops...", response.message, "error");
//         }
//     };

//     const handleCancel = () => {
//         setReport_File({ filename: "", bytes: "" });
//         setReport_File2({ filename: "", bytes: "" });
//         setDownload(false);
//         setShowError({ budget: false, report: false, plan: false });
//     };

//     // ─── render ──────────────────────────────────────────────────────────────────
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
//                             <Box className={classes.Box_Hading}>
//                                 Make Microwave(Ceragon) Summary
//                             </Box>

//                             <Stack spacing={2} sx={{ mt: "-40px" }}>

//                                 {/* ── PLAN ID SEARCH ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <Typography className={classes.Front_Box_Hading} sx={{ mb: 1 }}>
//                                         Search Plan ID:
//                                     </Typography>
//                                     <PlanIdSearch onPlanSelected={handlePlanSelected} />
//                                     {showError.plan && (
//                                         <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>
//                                             This Field Is Required!
//                                         </Typography>
//                                     )}
//                                 </Box>

//                                 {/* ── LINK BUDGET FILE ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <Typography className={classes.Front_Box_Hading} sx={{ mb: 1 }}>
//                                         Select Link Budget File:
//                                     </Typography>

//                                     <Grid container alignItems="center" spacing={2}>
//                                         <Grid item>
//                                             <Button variant="contained" component="label"
//                                                 sx={{ textTransform: "uppercase", fontWeight: 700 }}>
//                                                 Select File
//                                                 <input hidden type="file" multiple onChange={handleLinkFileUpload} />
//                                             </Button>
//                                         </Grid>

//                                         <Grid item xs>
//                                             {linkFiles.length > 0 ? (
//                                                 linkFiles.map((file, index) => (
//                                                     <Typography key={index} fontWeight={600} color="green" fontSize={13}>
//                                                         {file}
//                                                     </Typography>
//                                                 ))
//                                             ) : (
//                                                 <Typography color="gray" fontSize={13}>No file uploaded.</Typography>
//                                             )}
//                                         </Grid>

//                                         <Grid item>
//                                             <Button
//                                                 variant="contained"
//                                                 sx={{ backgroundColor: "#d32f2f", color: "white", textTransform: "uppercase", fontWeight: 700 }}
//                                                 disabled={!linkFiles.length}
//                                                 onClick={handleDeleteLinkFiles}
//                                             >
//                                                 Delete
//                                             </Button>
//                                         </Grid>
//                                     </Grid>

//                                     {showError.budget && (
//                                         <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>
//                                             This Field Is Required!
//                                         </Typography>
//                                     )}
//                                 </Box>

//                                 {/* ── SELECT DUMP ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Select Dump A:</div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <Button
//                                             variant="contained"
//                                             component="label"
//                                             color={report_File.filename ? "warning" : "primary"}
//                                             sx={{ textTransform: "uppercase", fontWeight: 700 }}
//                                         >
//                                             Select File
//                                             <input hidden type="file" multiple onChange={(e) => updateFile(e, setReport_File, "report")} />
//                                         </Button>
//                                         {report_File.filename && (
//                                             <span style={{ color: "green", fontSize: 16, fontWeight: 600, marginLeft: 12 }}>
//                                                 No. of Files: {report_File.filename}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </Box>

//                                 {/* ── SELECT DUMP 2 ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Select Dump B:</div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <Button
//                                             variant="contained"
//                                             component="label"
//                                             color={report_File2.filename ? "warning" : "primary"}
//                                             sx={{ textTransform: "uppercase", fontWeight: 700 }}
//                                         >
//                                             Select File
//                                             <input hidden type="file" multiple onChange={(e) => updateFile(e, setReport_File2, "report")} />
//                                         </Button>
//                                         {report_File2.filename && (
//                                             <span style={{ color: "green", fontSize: 16, fontWeight: 600, marginLeft: 12 }}>
//                                                 No. of Files: {report_File2.filename}
//                                             </span>
//                                         )}
//                                         {showError.report && (
//                                             <span style={{ color: "red", fontSize: 16, fontWeight: 600, marginLeft: 8 }}>
//                                                 Select at least one dump file (Dump or Dump 2)!
//                                             </span>
//                                         )}
//                                     </div>
//                                 </Box>

//                                 {/* ── PARAMETER & VALUE TABLE ── */}
//                                 <Box className={classes.Front_Box} sx={{ p: 2 }}>
//                                     <ParameterTable
//                                         rows={parameters}
//                                         loading={paramLoading}
//                                         onEdit={handleEditParam}
//                                         onDelete={handleDeleteParam}
//                                         onAdd={() => setAddDialogOpen(true)}
//                                     />
//                                 </Box>

//                             </Stack>

//                             {/* ── ACTION BUTTONS ── */}
//                             <Stack
//                                 direction={{ xs: "column", md: "row" }}
//                                 spacing={2}
//                                 justifyContent="space-around"
//                                 mt={2}
//                             >
//                                 <Button
//                                     variant="contained"
//                                     color="success"
//                                     onClick={handleSubmit}
//                                     endIcon={<UploadIcon />}
//                                     sx={{ fontWeight: 700, textTransform: "uppercase" }}
//                                 >
//                                     Submit
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     sx={{ backgroundColor: "#d32f2f", color: "white", fontWeight: 700, textTransform: "uppercase" }}
//                                     onClick={handleCancel}
//                                     endIcon={<DoDisturbIcon />}
//                                 >
//                                     Cancel
//                                 </Button>
//                             </Stack>
//                         </Box>
//                     </Box>

//                     {/* ── DOWNLOAD ── */}
//                     {download && (
//                         <Box textAlign="center" mt={2}>
//                             <a href={fileData} download>
//                                 <Button
//                                     variant="outlined"
//                                     startIcon={<FileDownloadIcon sx={{ fontSize: 28, color: "green" }} />}
//                                     sx={{ textTransform: "none", fontWeight: 800, fontSize: "20px", fontFamily: "Poppins" }}
//                                 >
//                                     Download Ceragon Report
//                                 </Button>
//                             </a>
//                         </Box>
//                     )}
//                 </Box>
//             </Slide>

//             {/* ── Add Parameter Dialog ── */}
//             <AddParamDialog
//                 open={addDialogOpen}
//                 onClose={() => setAddDialogOpen(false)}
//                 onSaved={fetchParameters}
//             />

//             {/* ── Edit Parameter Dialog ── */}
//             <EditParamDialog
//                 open={editDialogOpen}
//                 onClose={() => { setEditDialogOpen(false); setEditRow(null); }}
//                 row={editRow}
//                 onSaved={fetchParameters}
//             />

//             {loading}
//         </>
//     );
// };

// export default MicrowaveCeragonUpload;

// import React, { useState, useEffect, useCallback } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Paper, IconButton, TextField, Tooltip, Chip, Dialog, DialogTitle,
//     DialogContent, DialogActions, CircularProgress, MenuItem,
// } from "@mui/material";
// import {
//     Upload as UploadIcon,
//     DoDisturb as DoDisturbIcon,
//     FileDownload as FileDownloadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
//     Edit as EditIcon,
//     Delete as DeleteIcon,
//     Save as SaveIcon,
//     Close as CloseIcon,
//     Add as AddIcon,
//     TuneOutlined as TuneIcon,
//     Search as SearchIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import "rsuite/dist/rsuite.min.css";

// // ─── theme constants ────────────────────────────────────────────────────────
// const TEAL = "#2a77bf";
// const TEAL_DARK = "#28538c";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID = "#b2dfdb";

// // ─── inline field styles ────────────────────────────────────────────────────
// const fieldSx = {
//     "& .MuiOutlinedInput-root": {
//         borderRadius: "8px",
//         fontSize: 13,
//         "&:hover fieldset": { borderColor: TEAL },
//         "&.Mui-focused fieldset": { borderColor: TEAL },
//     },
//     "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
// };

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

// // ─── Plan ID Search ──────────────────────────────────────────────────────────
// const planIdToString = (plan) => {
//     if (plan == null) return "";
//     if (typeof plan === "string") return plan;
//     return plan.plan_id ?? plan.id ?? plan.name ?? "";
// };

// const PlanIdSearch = ({ onPlanSelected }) => {
//     const [query, setQuery] = useState("");
//     const [searching, setSearching] = useState(false);
//     const [options, setOptions] = useState([]);
//     const [selectedPlan, setSelectedPlan] = useState(null);
//     const [showOptions, setShowOptions] = useState(false);
//     const [hasSearched, setHasSearched] = useState(false);
//     const skipNextSearch = React.useRef(false);

//     const runSearch = useCallback(async (term) => {
//         const trimmed = term.trim();
//         if (!trimmed) { setOptions([]); setShowOptions(false); setHasSearched(false); return; }
//         setSearching(true);
//         try {
//             const body = new FormData();
//             body.append("plan_id", trimmed);
//             const res = await postData("mwCeragon/search_planid/", body);
//             let results = [];
//             if (Array.isArray(res)) results = res;
//             else if (Array.isArray(res?.data)) results = res.data;
//             else if (Array.isArray(res?.results)) results = res.results;
//             else if (typeof res === "string") results = [res];
//             else if (res?.status && res?.plan_id) results = [res];
//             setOptions(results);
//             setShowOptions(true);
//             setHasSearched(true);
//         } catch { setOptions([]); setHasSearched(true); }
//         finally { setSearching(false); }
//     }, []);

//     useEffect(() => {
//         if (skipNextSearch.current) { skipNextSearch.current = false; return; }
//         if (!query.trim()) { setOptions([]); setShowOptions(false); setHasSearched(false); return; }
//         const timer = setTimeout(() => runSearch(query), 350);
//         return () => clearTimeout(timer);
//     }, [query, runSearch]);

//     const handlePick = (plan) => {
//         const planStr = planIdToString(plan);
//         skipNextSearch.current = true;
//         setSelectedPlan(planStr);
//         setShowOptions(false);
//         setQuery(planStr);
//         onPlanSelected?.(planStr);
//     };

//     const handleClear = () => {
//         setQuery(""); setSelectedPlan(null); setOptions([]);
//         setShowOptions(false); setHasSearched(false);
//         onPlanSelected?.(null);
//     };

//     return (
//         <Box sx={{ position: "relative" }}>
//             <Grid container alignItems="center" spacing={2}>
//                 <Grid item xs={12} md={6}>
//                     <TextField
//                         label="Search Plan ID"
//                         placeholder="e.g. MW-N-MUM-25052023-418"
//                         value={query}
//                         onChange={(e) => { setQuery(e.target.value); setSelectedPlan(null); }}
//                         onFocus={() => { if (options.length > 0) setShowOptions(true); }}
//                         size="small" fullWidth sx={fieldSx}
//                         InputProps={{ endAdornment: searching ? <CircularProgress size={14} sx={{ color: TEAL }} /> : null }}
//                     />
//                 </Grid>
//                 {selectedPlan && (
//                     <Grid item xs>
//                         <Chip label={`Plan: ${selectedPlan}`} onDelete={handleClear}
//                             sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}`, fontWeight: 600 }} />
//                     </Grid>
//                 )}
//             </Grid>
//             {showOptions && (
//                 <Paper elevation={3} sx={{ mt: 1, borderRadius: "8px", maxHeight: 220, overflowY: "auto", border: `1px solid ${TEAL_MID}`, position: "absolute", zIndex: 10, width: { xs: "100%", md: "50%" } }}>
//                     {options.length > 0 ? options.map((opt, idx) => {
//                         const label = planIdToString(opt);
//                         return <MenuItem key={label || idx} onClick={() => handlePick(opt)} sx={{ fontSize: 13 }}>{label}</MenuItem>;
//                     }) : (
//                         hasSearched && !searching && (
//                             <Box sx={{ px: 2, py: 1.5 }}>
//                                 <Typography fontSize={13} color="#aaa">No plan found matching "{query.trim()}".</Typography>
//                             </Box>
//                         )
//                     )}
//                 </Paper>
//             )}
//         </Box>
//     );
// };

// // ─── Add Parameter Dialog ────────────────────────────────────────────────────
// const AddParamDialog = ({ open, onClose, onSaved }) => {
//     const [iduModel, setIduModel] = useState("");
//     const [parameter, setParameter] = useState("");
//     const [value, setValue] = useState("");
//     const [saving, setSaving] = useState(false);
//     const [iduSearching, setIduSearching] = useState(false);

//     useEffect(() => { if (open) { setIduModel(""); setParameter(""); setValue(""); } }, [open]);

//     const fetchByIdu = async () => {
//         if (!iduModel.trim()) return;
//         setIduSearching(true);
//         try {
//             Swal.fire("Coming Soon", "IDU lookup API is not connected yet. You can still enter the parameter and value manually.", "info");
//         } catch { Swal.fire("Error", "Something went wrong while searching the IDU.", "error"); }
//         finally { setIduSearching(false); }
//     };

//     const handleSave = async () => {
//         if (!iduModel.trim()) { Swal.fire("Validation", "IDU model is required.", "warning"); return; }
//         if (!parameter.trim()) { Swal.fire("Validation", "Parameter name is required.", "warning"); return; }
//         setSaving(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/parameter/`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ idu_model: iduModel.trim(), parameter: parameter.trim(), value: value.trim() }),
//             });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire({ icon: "success", title: "Added!", timer: 1800, showConfirmButton: false });
//                 onSaved(); onClose();
//             } else { Swal.fire("Error", data?.message || "Add failed.", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong.", "error"); }
//         finally { setSaving(false); }
//     };

//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock
//             PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
//             <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #8cc6eb)` }} />
//             <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <AddIcon sx={{ color: TEAL, fontSize: 20 }} />
//                     <Typography fontWeight={700} fontSize={16}>Add Parameter</Typography>
//                 </Box>
//                 <IconButton size="small" onClick={onClose}
//                     sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
//                     <CloseIcon sx={{ fontSize: 16 }} />
//                 </IconButton>
//             </DialogTitle>
//             <DialogContent sx={{ pt: 3, pb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
//                 <Box display="flex" gap={1}>
//                     <TextField label="IDU (e.g. IDU20...)" value={iduModel} onChange={(e) => setIduModel(e.target.value)} size="small" fullWidth sx={fieldSx} />
//                     <Tooltip title="Search by IDU (coming soon)" arrow>
//                         <span>
//                             <IconButton onClick={fetchByIdu} disabled={iduSearching || !iduModel.trim()}
//                                 sx={{ bgcolor: TEAL_LIGHT, color: TEAL, borderRadius: "8px", "&:hover": { bgcolor: TEAL_MID } }}>
//                                 {iduSearching ? <CircularProgress size={16} /> : <SearchIcon sx={{ fontSize: 18 }} />}
//                             </IconButton>
//                         </span>
//                     </Tooltip>
//                 </Box>
//                 <TextField label="Parameter" value={parameter} onChange={(e) => setParameter(e.target.value)} size="small" fullWidth sx={fieldSx} />
//                 <TextField label="Value" value={value} onChange={(e) => setValue(e.target.value)} size="small" fullWidth sx={fieldSx} />
//             </DialogContent>
//             <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
//                 <Button onClick={onClose} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>Cancel</Button>
//                 <Button variant="contained" onClick={handleSave} disabled={saving}
//                     startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
//                     sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5 }}>
//                     {saving ? "Saving…" : "Add"}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// // ─── Edit Parameter Dialog ────────────────────────────────────────────────────
// const EditParamDialog = ({ open, onClose, row, onSaved }) => {
//     const [iduModel, setIduModel] = useState("");
//     const [parameter, setParameter] = useState("");
//     const [value, setValue] = useState("");
//     const [saving, setSaving] = useState(false);

//     useEffect(() => {
//         if (open && row) { setIduModel(row.idu_model ?? ""); setParameter(row.parameter ?? ""); setValue(row.value ?? ""); }
//     }, [open, row]);

//     const handleSave = async () => {
//         if (!parameter.trim()) { Swal.fire("Validation", "Parameter name is required.", "warning"); return; }
//         setSaving(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/parameter/${row.id}/`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ idu_model: iduModel.trim(), parameter: parameter.trim(), value: value.trim() }),
//             });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire({ icon: "success", title: "Updated!", timer: 1800, showConfirmButton: false });
//                 onSaved(); onClose();
//             } else { Swal.fire("Error", data?.message || "Update failed.", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong.", "error"); }
//         finally { setSaving(false); }
//     };

//     if (!row) return null;
//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock
//             PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
//             <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #8cc6eb)` }} />
//             <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <TuneIcon sx={{ color: TEAL, fontSize: 20 }} />
//                     <Typography fontWeight={700} fontSize={16}>Edit Parameter</Typography>
//                 </Box>
//                 <IconButton size="small" onClick={onClose}
//                     sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
//                     <CloseIcon sx={{ fontSize: 16 }} />
//                 </IconButton>
//             </DialogTitle>
//             <DialogContent sx={{ pt: 3, pb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
//                 <TextField label="IDU" value={iduModel} onChange={(e) => setIduModel(e.target.value)} size="small" fullWidth sx={fieldSx} />
//                 <TextField label="Parameter" value={parameter} onChange={(e) => setParameter(e.target.value)} size="small" fullWidth sx={fieldSx} />
//                 <TextField label="Value" value={value} onChange={(e) => setValue(e.target.value)} size="small" fullWidth sx={fieldSx} />
//             </DialogContent>
//             <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
//                 <Button onClick={onClose} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>Cancel</Button>
//                 <Button variant="contained" onClick={handleSave} disabled={saving}
//                     startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
//                     sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5 }}>
//                     {saving ? "Saving…" : "Update"}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// // ─── Single Link Budget Row ──────────────────────────────────────────────────
// const LinkBudgetRow = ({ label, files, onUpload, onDelete, showError }) => (
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
//                         <Typography key={index} fontWeight={600} color="green" fontSize={13}>{file}</Typography>
//                     ))
//                 ) : (
//                     <Typography color="gray" fontSize={13}>No file uploaded.</Typography>
//                 )}
//             </Grid>
//             <Grid item>
//                 <Button variant="contained"
//                     sx={{ backgroundColor: "#d32f2f", color: "white", textTransform: "uppercase", fontWeight: 700 }}
//                     disabled={!files.length} onClick={onDelete}>
//                     Delete
//                 </Button>
//             </Grid>
//         </Grid>
//         {showError && (
//             <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>This Field Is Required!</Typography>
//         )}
//     </Box>
// );

// // ─── Parameter Table (scrollable) ────────────────────────────────────────────
// const ParameterTable = ({ rows, loading, onEdit, onDelete, onAdd }) => {
//     const [iduFilter, setIduFilter] = useState("");

//     const filteredRows = React.useMemo(() => {
//         const q = iduFilter.trim().toLowerCase();
//         if (!q) return rows;
//         return rows.filter((row) => (row.idu_model ?? "").toLowerCase().includes(q));
//     }, [rows, iduFilter]);

//     return (
//         <Box>
//             {/* Header row: title + filter + add button */}
//             <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5} flexWrap="wrap" gap={1}>
//                 <Box display="flex" alignItems="center" gap={0.8}>
//                     <TuneIcon sx={{ fontSize: 17, color: TEAL }} />
//                     <Typography fontSize={13.5} fontWeight={700} color="#1a1a2e">Parameters &amp; Values</Typography>
//                     {filteredRows.length > 0 && (
//                         <Chip label={`${filteredRows.length} entries`} size="small"
//                             sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
//                     )}
//                 </Box>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <TextField
//                         placeholder="Filter by IDU…"
//                         value={iduFilter}
//                         onChange={(e) => setIduFilter(e.target.value)}
//                         size="small"
//                         InputProps={{ startAdornment: <SearchIcon sx={{ fontSize: 16, color: "#9aa3af", mr: 0.5 }} /> }}
//                         sx={{ ...fieldSx, width: 180, "& .MuiOutlinedInput-root": { ...fieldSx["& .MuiOutlinedInput-root"], height: 32 } }}
//                     />
//                     <Tooltip title="Add parameter" arrow>
//                         <IconButton size="small" onClick={onAdd}
//                             sx={{ bgcolor: TEAL_LIGHT, color: TEAL, borderRadius: "8px", "&:hover": { bgcolor: TEAL_MID } }}>
//                             <AddIcon sx={{ fontSize: 16 }} />
//                         </IconButton>
//                     </Tooltip>
//                 </Box>
//             </Box>

//             {/* Scrollable table container — fixed height so it doesn't grow unbounded */}
//             <TableContainer component={Paper} elevation={0}
//                 sx={{
//                     border: `1px solid ${TEAL_MID}`,
//                     borderRadius: "10px",
//                     overflow: "hidden",
//                     /* Fixed height: header (~42px) + 8 rows (~37px each) = ~340px.
//                        Anything beyond 8 rows scrolls smoothly inside this box. */
//                     maxHeight: 380,
//                     overflowY: "auto",
//                     /* Custom thin scrollbar — matches dashboard style */
//                     "&::-webkit-scrollbar": { width: 5 },
//                     "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: 4 },
//                     "&::-webkit-scrollbar-thumb": { background: TEAL_MID, borderRadius: 4 },
//                     "&::-webkit-scrollbar-thumb:hover": { background: TEAL },
//                 }}>
//                 <Table size="small" stickyHeader>
//                     <TableHead>
//                         <TableRow>
//                             {["SN", "IDU", "Parameter", "Value", "Actions"].map((h) => (
//                                 <TableCell key={h} sx={{
//                                     color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.3,
//                                     bgcolor: TEAL, letterSpacing: ".03em", whiteSpace: "nowrap",
//                                     /* stickyHeader needs explicit bgcolor or it turns transparent */
//                                     position: "sticky", top: 0, zIndex: 2,
//                                 }}>{h}</TableCell>
//                             ))}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {loading && (
//                             <TableRow>
//                                 <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
//                                     <CircularProgress size={22} sx={{ color: TEAL }} />
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                         {!loading && filteredRows.length === 0 && (
//                             <TableRow>
//                                 <TableCell colSpan={5} align="center" sx={{ py: 3, color: "#aaa", fontSize: 13 }}>
//                                     {iduFilter.trim() ? `No parameters found for IDU "${iduFilter.trim()}".` : "No parameters found."}
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                         {!loading && filteredRows.map((row, idx) => (
//                             <TableRow key={row.id ?? idx} hover
//                                 sx={{ "&:nth-of-type(even)": { bgcolor: "#f8fcfb" }, "&:hover": { bgcolor: TEAL_LIGHT + "88" } }}>
//                                 <TableCell sx={{ color: "#b0b7c3", fontSize: 12, fontWeight: 600, width: 40 }}>{idx + 1}</TableCell>
//                                 <TableCell sx={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>
//                                     {row.idu_model ? (
//                                         <Chip label={row.idu_model} size="small"
//                                             sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11.5, border: "1px solid #ffcc80" }} />
//                                     ) : (
//                                         <Typography component="span" fontSize={12.5} color="#aaa">—</Typography>
//                                     )}
//                                 </TableCell>
//                                 <TableCell sx={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{row.parameter}</TableCell>
//                                 <TableCell sx={{ fontSize: 13, color: "#374151" }}>
//                                     <Chip label={row.value ?? "—"} size="small"
//                                         sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontWeight: 600, fontSize: 11.5, border: "1px solid #90caf9" }} />
//                                 </TableCell>
//                                 <TableCell>
//                                     <Box display="flex" gap={0.5}>
//                                         <Tooltip title="Edit" arrow>
//                                             <IconButton size="small" onClick={() => onEdit(row)}
//                                                 sx={{ color: TEAL, "&:hover": { bgcolor: TEAL_LIGHT } }}>
//                                                 <EditIcon sx={{ fontSize: 16 }} />
//                                             </IconButton>
//                                         </Tooltip>
//                                         <Tooltip title="Delete" arrow>
//                                             <IconButton size="small" onClick={() => onDelete(row)}
//                                                 sx={{ color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}>
//                                                 <DeleteIcon sx={{ fontSize: 16 }} />
//                                             </IconButton>
//                                         </Tooltip>
//                                     </Box>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </Box>
//     );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// const MicrowaveCeragonUpload = () => {
//     const classes = OverAllCss();
//     const navigate = useNavigate();
//     const { loading, action } = useLoadingDialog();

//     // ── plan id ──────────────────────────────────────────────────────────────────
//     const [selectedPlan, setSelectedPlan] = useState(null);
//     const handlePlanSelected = (planId) => {
//         setSelectedPlan(planId);
//         if (planId) setShowError((prev) => ({ ...prev, plan: false }));
//     };

//     // ── dump file states ─────────────────────────────────────────────────────────
//     const [report_File, setReport_File] = useState({ filename: "", bytes: "" });
//     const [report_File2, setReport_File2] = useState({ filename: "", bytes: "" });
//     const [fileData, setFileData] = useState();
//     const [download, setDownload] = useState(false);

//     const [showError, setShowError] = useState({ budget: false, report: false, plan: false });

//     // ── link budget file 1 ───────────────────────────────────────────────────────
//     const [linkFiles, setLinkFiles] = useState([]);

//     const fetchLinkFiles = useCallback(async () => {
//         const res = await getData("mwCeragon/linkbudget/");
//         if (res?.status && Array.isArray(res.files)) setLinkFiles(res.files);
//         else setLinkFiles([]);
//     }, []);

//     useEffect(() => { fetchLinkFiles(); }, [fetchLinkFiles]);

//     const handleLinkFileUpload = async (e) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;
//         const formData = new FormData();
//         for (let i = 0; i < files.length; i++) formData.append("link_buget_file", files[i]);
//         action(true);
//         const res = await postData("mwCeragon/linkbudget/", formData);
//         action(false);
//         if (res.status) {
//             Swal.fire("Success", "Files Uploaded", "success");
//             fetchLinkFiles();
//             setShowError((prev) => ({ ...prev, budget: false }));
//         } else { Swal.fire("Error", res.message, "error"); }
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
//             const res = await fetch(`${ServerURL}/mwCeragon/linkbudget/`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire("Deleted!", data?.message || "File(s) deleted successfully.", "success");
//                 setLinkFiles([]);
//             } else { Swal.fire("Error", data?.message || "Delete failed", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong. Please try again.", "error"); }
//         finally { action(false); }
//     };

//     // ── link budget file 2 ───────────────────────────────────────────────────────
//     const [linkFiles2, setLinkFiles2] = useState([]);

//     const fetchLinkFiles2 = useCallback(async () => {
//         const res = await getData("mwCeragon/linkbudget2/");
//         if (res?.status && Array.isArray(res.files)) setLinkFiles2(res.files);
//         else setLinkFiles2([]);
//     }, []);

//     useEffect(() => { fetchLinkFiles2(); }, [fetchLinkFiles2]);

//     const handleLinkFileUpload2 = async (e) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;
//         const formData = new FormData();
//         for (let i = 0; i < files.length; i++) formData.append("link_buget_file", files[i]);
//         action(true);
//         const res = await postData("mwCeragon/linkbudget2/", formData);
//         action(false);
//         if (res.status) {
//             Swal.fire("Success", "Files Uploaded", "success");
//             fetchLinkFiles2();
//         } else { Swal.fire("Error", res.message, "error"); }
//     };

//     const handleDeleteLinkFiles2 = async () => {
//         const result = await Swal.fire({
//             title: "Are you sure?", text: "This will permanently delete the second link budget file.",
//             icon: "warning", showCancelButton: true, confirmButtonColor: "#d32f2f",
//             cancelButtonColor: "#1976d2", confirmButtonText: "Yes, delete", cancelButtonText: "Cancel",
//         });
//         if (!result.isConfirmed) return;
//         action(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/linkbudget2/`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire("Deleted!", data?.message || "File(s) deleted successfully.", "success");
//                 setLinkFiles2([]);
//             } else { Swal.fire("Error", data?.message || "Delete failed", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong. Please try again.", "error"); }
//         finally { action(false); }
//     };

//     // ── parameters ───────────────────────────────────────────────────────────────
//     const [parameters, setParameters] = useState([]);
//     const [paramLoading, setParamLoading] = useState(false);
//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [editRow, setEditRow] = useState(null);
//     const [addDialogOpen, setAddDialogOpen] = useState(false);

//     const fetchParameters = useCallback(async () => {
//         setParamLoading(true);
//         try {
//             const res = await getData("mwCeragon/parameter/");
//             if (Array.isArray(res)) setParameters(res);
//             else if (Array.isArray(res?.data)) setParameters(res.data);
//             else if (Array.isArray(res?.results)) setParameters(res.results);
//             else setParameters([]);
//         } catch { setParameters([]); }
//         finally { setParamLoading(false); }
//     }, []);

//     useEffect(() => { fetchParameters(); }, [fetchParameters]);

//     const handleEditParam = (row) => { setEditRow(row); setEditDialogOpen(true); };

//     const handleDeleteParam = async (row) => {
//         const result = await Swal.fire({
//             title: "Delete Parameter?",
//             html: `<span style="font-size:14px;color:#555">Delete <b>${row.parameter}</b>?</span>`,
//             icon: "warning", showCancelButton: true, confirmButtonColor: "#d32f2f",
//             confirmButtonText: "Yes, delete", cancelButtonText: "Cancel",
//         });
//         if (!result.isConfirmed) return;
//         action(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/parameter/${row.id}/`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire({ icon: "success", title: "Deleted!", timer: 1600, showConfirmButton: false });
//             } else { Swal.fire("Error", data?.message || "Delete failed.", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong.", "error"); }
//         finally { await fetchParameters(); action(false); }
//     };

//     // ── dump file handler ────────────────────────────────────────────────────────
//     const updateFile = (event, setFileState, errorKey) => {
//         const files = event.target.files;
//         if (files && files.length > 0) {
//             setShowError((prev) => ({ ...prev, [errorKey]: false }));
//             setFileState({ filename: files.length, bytes: files });
//         }
//     };

//     // ── submit ───────────────────────────────────────────────────────────────────
//     const handleSubmit = async () => {
//         const hasDump1 = !!report_File.bytes.length;
//         const hasDump2 = !!report_File2.bytes.length;
//         const hasPlan = !!(selectedPlan && String(selectedPlan).trim());
//         const isValid = linkFiles.length > 0 && (hasDump1 || hasDump2) && hasPlan;
//         if (!isValid) {
//             setShowError({ budget: !linkFiles.length, report: !hasDump1 && !hasDump2, plan: !hasPlan });
//             if (!hasPlan) Swal.fire("Validation", "Please search and select a Plan ID first.", "warning");
//             return;
//         }
//         action(true);
//         const formData = new FormData();
//         for (let j = 0; j < report_File.bytes.length; j++) formData.append("dump_file1", report_File.bytes[j]);
//         for (let j = 0; j < report_File2.bytes.length; j++) formData.append("dump_file2", report_File2.bytes[j]);
//         formData.append("plan_id", String(selectedPlan).trim());
//         const response = await postData("mwCeragon/upload_dump/", formData);
//         action(false);
//         if (response.status) {
//             setDownload(true); setFileData(response.download_url);
//             Swal.fire("Done", response.message, "success");
//         } else { Swal.fire("Oops...", response.message, "error"); }
//     };

//     const handleCancel = () => {
//         setReport_File({ filename: "", bytes: "" });
//         setReport_File2({ filename: "", bytes: "" });
//         setDownload(false);
//         setShowError({ budget: false, report: false, plan: false });
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

//                                 {/* ── PLAN ID SEARCH ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <Typography className={classes.Front_Box_Hading} sx={{ mb: 1 }}>
//                                         Search Plan ID:
//                                     </Typography>
//                                     <PlanIdSearch onPlanSelected={handlePlanSelected} />
//                                     {showError.plan && (
//                                         <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>This Field Is Required!</Typography>
//                                     )}
//                                 </Box>

//                                 {/* ── LINK BUDGET FILE 1 ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <LinkBudgetRow
//                                         label="Select Link Budget File 1:"
//                                         files={linkFiles}
//                                         onUpload={handleLinkFileUpload}
//                                         onDelete={handleDeleteLinkFiles}
//                                         showError={showError.budget}
//                                     />
//                                 </Box>

//                                 {/* ── LINK BUDGET FILE 2 ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <LinkBudgetRow
//                                         label="Select Link Budget File 2:"
//                                         files={linkFiles2}
//                                         onUpload={handleLinkFileUpload2}
//                                         onDelete={handleDeleteLinkFiles2}
//                                         showError={false}
//                                     />
//                                 </Box>

//                                 {/* ── DUMP A + DUMP B in one card, side by side ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <Typography className={classes.Front_Box_Hading} sx={{ mb: 1.5 }}>
//                                         Select Dump Files:
//                                     </Typography>
//                                     <Grid container spacing={3}>
//                                         {/* Dump A */}
//                                         <Grid item xs={12} md={6}>
//                                             <Box sx={{
//                                                 border: "1.5px solid #e0e0e0", borderRadius: "10px",
//                                                 p: 2, bgcolor: "#fafbfc",
//                                             }}>
//                                                 <Typography fontWeight={700} fontSize={14} color="#1a1a2e" mb={1.2}>
//                                                     Dump A
//                                                 </Typography>
//                                                 <Button variant="contained" component="label"
//                                                     color={report_File.filename ? "warning" : "primary"}
//                                                     sx={{ textTransform: "uppercase", fontWeight: 700 }}>
//                                                     Select File
//                                                     <input hidden type="file" multiple onChange={(e) => updateFile(e, setReport_File, "report")} />
//                                                 </Button>
//                                                 {report_File.filename && (
//                                                     <Typography mt={1} color="green" fontSize={13} fontWeight={600}>
//                                                         {report_File.filename} file(s) selected
//                                                     </Typography>
//                                                 )}
//                                             </Box>
//                                         </Grid>

//                                         {/* Dump B */}
//                                         <Grid item xs={12} md={6}>
//                                             <Box sx={{
//                                                 border: "1.5px solid #e0e0e0", borderRadius: "10px",
//                                                 p: 2, bgcolor: "#fafbfc",
//                                             }}>
//                                                 <Typography fontWeight={700} fontSize={14} color="#1a1a2e" mb={1.2}>
//                                                     Dump B
//                                                 </Typography>
//                                                 <Button variant="contained" component="label"
//                                                     color={report_File2.filename ? "warning" : "primary"}
//                                                     sx={{ textTransform: "uppercase", fontWeight: 700 }}>
//                                                     Select File
//                                                     <input hidden type="file" multiple onChange={(e) => updateFile(e, setReport_File2, "report")} />
//                                                 </Button>
//                                                 {report_File2.filename && (
//                                                     <Typography mt={1} color="green" fontSize={13} fontWeight={600}>
//                                                         {report_File2.filename} file(s) selected
//                                                     </Typography>
//                                                 )}
//                                             </Box>
//                                         </Grid>
//                                     </Grid>
//                                     {showError.report && (
//                                         <Typography color="red" fontWeight={600} fontSize={13} mt={1}>
//                                             Select at least one dump file (Dump A or Dump B)!
//                                         </Typography>
//                                     )}
//                                 </Box>

//                                 {/* ── PARAMETER & VALUE TABLE (scrollable) ── */}
//                                 <Box className={classes.Front_Box} sx={{ p: 2 }}>
//                                     <ParameterTable
//                                         rows={parameters}
//                                         loading={paramLoading}
//                                         onEdit={handleEditParam}
//                                         onDelete={handleDeleteParam}
//                                         onAdd={() => setAddDialogOpen(true)}
//                                     />
//                                 </Box>

//                             </Stack>

//                             {/* ── ACTION BUTTONS ── */}
//                             <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
//                                 <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}
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

//                     {/* ── DOWNLOAD ── */}
//                     {download && (
//                         <Box textAlign="center" mt={2}>
//                             <a href={fileData} download>
//                                 <Button variant="outlined"
//                                     startIcon={<FileDownloadIcon sx={{ fontSize: 28, color: "green" }} />}
//                                     sx={{ textTransform: "none", fontWeight: 800, fontSize: "20px", fontFamily: "Poppins" }}>
//                                     Download Ceragon Report
//                                 </Button>
//                             </a>
//                         </Box>
//                     )}
//                 </Box>
//             </Slide>

//             {/* ── Dialogs ── */}
//             <AddParamDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onSaved={fetchParameters} />
//             <EditParamDialog
//                 open={editDialogOpen}
//                 onClose={() => { setEditDialogOpen(false); setEditRow(null); }}
//                 row={editRow}
//                 onSaved={fetchParameters}
//             />

//             {loading}
//         </>
//     );
// };

// export default MicrowaveCeragonUpload;

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Paper, IconButton, TextField, Tooltip, Chip, Dialog, DialogTitle,
//     DialogContent, DialogActions, CircularProgress, MenuItem,
// } from "@mui/material";
// import {
//     Upload as UploadIcon,
//     DoDisturb as DoDisturbIcon,
//     FileDownload as FileDownloadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
//     Edit as EditIcon,
//     Delete as DeleteIcon,
//     Save as SaveIcon,
//     Close as CloseIcon,
//     Add as AddIcon,
//     TuneOutlined as TuneIcon,
//     Search as SearchIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import "rsuite/dist/rsuite.min.css";

// // ─── theme constants ────────────────────────────────────────────────────────
// const TEAL = "#2a77bf";
// const TEAL_DARK = "#28538c";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID = "#b2dfdb";

// // ─── inline field styles ────────────────────────────────────────────────────
// const fieldSx = {
//     "& .MuiOutlinedInput-root": {
//         borderRadius: "8px",
//         fontSize: 13,
//         "&:hover fieldset": { borderColor: TEAL },
//         "&.Mui-focused fieldset": { borderColor: TEAL },
//     },
//     "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
// };

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

// // ─── Plan ID Search ──────────────────────────────────────────────────────────
// const planIdToString = (plan) => {
//     if (plan == null) return "";
//     if (typeof plan === "string") return plan;
//     return plan.plan_id ?? plan.id ?? plan.name ?? "";
// };

// // Minimum characters before we bother hitting the API, and how long we wait
// // after the user stops typing. Both are tuned down from before so results
// // feel near-instant while still avoiding a request on every keystroke.
// const SEARCH_MIN_CHARS = 2;
// const SEARCH_DEBOUNCE_MS = 150;

// const PlanIdSearch = ({ onPlanSelected }) => {
//     const [query, setQuery] = useState("");
//     const [searching, setSearching] = useState(false);
//     const [options, setOptions] = useState([]);
//     const [selectedPlan, setSelectedPlan] = useState(null);
//     const [showOptions, setShowOptions] = useState(false);
//     const [hasSearched, setHasSearched] = useState(false);
//     const skipNextSearch = React.useRef(false);
//     // Guards against slow/out-of-order responses overwriting a newer, faster
//     // one — this is what made the search *feel* slow before (a stale
//     // response for "MW" could land after the response for "MW-N" and wipe
//     // out the correct, more specific results).
//     const requestIdRef = useRef(0);

//     const runSearch = useCallback(async (term) => {
//         const trimmed = term.trim();
//         if (trimmed.length < SEARCH_MIN_CHARS) {
//             setOptions([]); setShowOptions(false); setHasSearched(false);
//             return;
//         }
//         const currentRequestId = ++requestIdRef.current;
//         setSearching(true);
//         try {
//             const body = new FormData();
//             body.append("plan_id", trimmed);
//             const res = await postData("mwCeragon/search_planid/", body);
//             if (currentRequestId !== requestIdRef.current) return; // stale, ignore
//             let results = [];
//             if (Array.isArray(res)) results = res;
//             else if (Array.isArray(res?.data)) results = res.data;
//             else if (Array.isArray(res?.results)) results = res.results;
//             else if (typeof res === "string") results = [res];
//             else if (res?.status && res?.plan_id) results = [res];
//             setOptions(results);
//             setShowOptions(true);
//             setHasSearched(true);
//         } catch {
//             if (currentRequestId === requestIdRef.current) { setOptions([]); setHasSearched(true); }
//         } finally {
//             if (currentRequestId === requestIdRef.current) setSearching(false);
//         }
//     }, []);

//     useEffect(() => {
//         if (skipNextSearch.current) { skipNextSearch.current = false; return; }
//         const trimmed = query.trim();
//         if (trimmed.length < SEARCH_MIN_CHARS) {
//             setOptions([]); setShowOptions(false); setHasSearched(false);
//             return;
//         }
//         const timer = setTimeout(() => runSearch(query), SEARCH_DEBOUNCE_MS);
//         return () => clearTimeout(timer);
//     }, [query, runSearch]);

//     const handlePick = (plan) => {
//         const planStr = planIdToString(plan);
//         skipNextSearch.current = true;
//         setSelectedPlan(planStr);
//         setShowOptions(false);
//         setQuery(planStr);
//         onPlanSelected?.(planStr);
//     };

//     const handleClear = () => {
//         setQuery(""); setSelectedPlan(null); setOptions([]);
//         setShowOptions(false); setHasSearched(false);
//         onPlanSelected?.(null);
//     };

//     return (
//         <Box sx={{ position: "relative" }}>
//             <Grid container alignItems="center" spacing={2}>
//                 <Grid item xs={12} md={6}>
//                     <TextField
//                         label="Search Plan ID"
//                         placeholder="e.g. MW-N-MUM-25052023-418"
//                         value={query}
//                         onChange={(e) => { setQuery(e.target.value); setSelectedPlan(null); }}
//                         onFocus={() => { if (options.length > 0) setShowOptions(true); }}
//                         size="small" fullWidth sx={fieldSx}
//                         InputProps={{ endAdornment: searching ? <CircularProgress size={14} sx={{ color: TEAL }} /> : null }}
//                     />
//                 </Grid>
//                 {selectedPlan && (
//                     <Grid item xs>
//                         <Chip label={`Plan: ${selectedPlan}`} onDelete={handleClear}
//                             sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}`, fontWeight: 600 }} />
//                     </Grid>
//                 )}
//             </Grid>
//             {showOptions && (
//                 <Paper elevation={3} sx={{ mt: 1, borderRadius: "8px", maxHeight: 220, overflowY: "auto", border: `1px solid ${TEAL_MID}`, position: "absolute", zIndex: 10, width: { xs: "100%", md: "50%" } }}>
//                     {options.length > 0 ? options.map((opt, idx) => {
//                         const label = planIdToString(opt);
//                         return <MenuItem key={label || idx} onClick={() => handlePick(opt)} sx={{ fontSize: 13 }}>{label}</MenuItem>;
//                     }) : (
//                         hasSearched && !searching && (
//                             <Box sx={{ px: 2, py: 1.5 }}>
//                                 <Typography fontSize={13} color="#aaa">No plan found matching "{query.trim()}".</Typography>
//                             </Box>
//                         )
//                     )}
//                 </Paper>
//             )}
//         </Box>
//     );
// };

// // ─── Add Parameter Dialog ────────────────────────────────────────────────────
// const AddParamDialog = ({ open, onClose, onSaved }) => {
//     const [iduModel, setIduModel] = useState("");
//     const [parameter, setParameter] = useState("");
//     const [value, setValue] = useState("");
//     const [saving, setSaving] = useState(false);
//     const [iduSearching, setIduSearching] = useState(false);

//     useEffect(() => { if (open) { setIduModel(""); setParameter(""); setValue(""); } }, [open]);

//     const fetchByIdu = async () => {
//         if (!iduModel.trim()) return;
//         setIduSearching(true);
//         try {
//             Swal.fire("Coming Soon", "IDU lookup API is not connected yet. You can still enter the parameter and value manually.", "info");
//         } catch { Swal.fire("Error", "Something went wrong while searching the IDU.", "error"); }
//         finally { setIduSearching(false); }
//     };

//     const handleSave = async () => {
//         if (!iduModel.trim()) { Swal.fire("Validation", "IDU model is required.", "warning"); return; }
//         if (!parameter.trim()) { Swal.fire("Validation", "Parameter name is required.", "warning"); return; }
//         setSaving(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/parameter/`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ idu_model: iduModel.trim(), parameter: parameter.trim(), value: value.trim() }),
//             });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire({ icon: "success", title: "Added!", timer: 1800, showConfirmButton: false });
//                 onSaved(); onClose();
//             } else { Swal.fire("Error", data?.message || "Add failed.", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong.", "error"); }
//         finally { setSaving(false); }
//     };

//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock
//             PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
//             <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #8cc6eb)` }} />
//             <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <AddIcon sx={{ color: TEAL, fontSize: 20 }} />
//                     <Typography fontWeight={700} fontSize={16}>Add Parameter</Typography>
//                 </Box>
//                 <IconButton size="small" onClick={onClose}
//                     sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
//                     <CloseIcon sx={{ fontSize: 16 }} />
//                 </IconButton>
//             </DialogTitle>
//             <DialogContent sx={{ pt: 3, pb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
//                 <Box display="flex" gap={1}>
//                     <TextField label="IDU (e.g. IDU20...)" value={iduModel} onChange={(e) => setIduModel(e.target.value)} size="small" fullWidth sx={fieldSx} />
//                     <Tooltip title="Search by IDU (coming soon)" arrow>
//                         <span>
//                             <IconButton onClick={fetchByIdu} disabled={iduSearching || !iduModel.trim()}
//                                 sx={{ bgcolor: TEAL_LIGHT, color: TEAL, borderRadius: "8px", "&:hover": { bgcolor: TEAL_MID } }}>
//                                 {iduSearching ? <CircularProgress size={16} /> : <SearchIcon sx={{ fontSize: 18 }} />}
//                             </IconButton>
//                         </span>
//                     </Tooltip>
//                 </Box>
//                 <TextField label="Parameter" value={parameter} onChange={(e) => setParameter(e.target.value)} size="small" fullWidth sx={fieldSx} />
//                 <TextField label="Value" value={value} onChange={(e) => setValue(e.target.value)} size="small" fullWidth sx={fieldSx} />
//             </DialogContent>
//             <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
//                 <Button onClick={onClose} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>Cancel</Button>
//                 <Button variant="contained" onClick={handleSave} disabled={saving}
//                     startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
//                     sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5 }}>
//                     {saving ? "Saving…" : "Add"}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// // ─── Edit Parameter Dialog ────────────────────────────────────────────────────
// const EditParamDialog = ({ open, onClose, row, onSaved }) => {
//     const [iduModel, setIduModel] = useState("");
//     const [parameter, setParameter] = useState("");
//     const [value, setValue] = useState("");
//     const [saving, setSaving] = useState(false);

//     useEffect(() => {
//         if (open && row) { setIduModel(row.idu_model ?? ""); setParameter(row.parameter ?? ""); setValue(row.value ?? ""); }
//     }, [open, row]);

//     const handleSave = async () => {
//         if (!parameter.trim()) { Swal.fire("Validation", "Parameter name is required.", "warning"); return; }
//         setSaving(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/parameter/${row.id}/`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ idu_model: iduModel.trim(), parameter: parameter.trim(), value: value.trim() }),
//             });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire({ icon: "success", title: "Updated!", timer: 1800, showConfirmButton: false });
//                 onSaved(); onClose();
//             } else { Swal.fire("Error", data?.message || "Update failed.", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong.", "error"); }
//         finally { setSaving(false); }
//     };

//     if (!row) return null;
//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock
//             PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
//             <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #8cc6eb)` }} />
//             <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <TuneIcon sx={{ color: TEAL, fontSize: 20 }} />
//                     <Typography fontWeight={700} fontSize={16}>Edit Parameter</Typography>
//                 </Box>
//                 <IconButton size="small" onClick={onClose}
//                     sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
//                     <CloseIcon sx={{ fontSize: 16 }} />
//                 </IconButton>
//             </DialogTitle>
//             <DialogContent sx={{ pt: 3, pb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
//                 <TextField label="IDU" value={iduModel} onChange={(e) => setIduModel(e.target.value)} size="small" fullWidth sx={fieldSx} />
//                 <TextField label="Parameter" value={parameter} onChange={(e) => setParameter(e.target.value)} size="small" fullWidth sx={fieldSx} />
//                 <TextField label="Value" value={value} onChange={(e) => setValue(e.target.value)} size="small" fullWidth sx={fieldSx} />
//             </DialogContent>
//             <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
//                 <Button onClick={onClose} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>Cancel</Button>
//                 <Button variant="contained" onClick={handleSave} disabled={saving}
//                     startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
//                     sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5 }}>
//                     {saving ? "Saving…" : "Update"}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// // ─── Single Link Budget Row ──────────────────────────────────────────────────
// const LinkBudgetRow = ({ label, files, onUpload, onDelete, showError }) => (
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
//                         <Typography key={index} fontWeight={600} color="green" fontSize={13}>{file}</Typography>
//                     ))
//                 ) : (
//                     <Typography color="gray" fontSize={13}>No file uploaded.</Typography>
//                 )}
//             </Grid>
//             <Grid item>
//                 <Button variant="contained"
//                     sx={{ backgroundColor: "#d32f2f", color: "white", textTransform: "uppercase", fontWeight: 700 }}
//                     disabled={!files.length} onClick={onDelete}>
//                     Delete
//                 </Button>
//             </Grid>
//         </Grid>
//         {showError && (
//             <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>This Field Is Required!</Typography>
//         )}
//     </Box>
// );

// // ─── Multi-select Dump File Box (accumulates files across multiple selections) ──
// // Selecting a file input again does NOT replace what's already chosen — new
// // files get merged in (duplicates by name+size+lastModified are skipped),
// // so picking 10 files from folder A then 10 more from folder B ends up with
// // all 20.
// const DumpFileBox = ({ label, files, onAddFiles, onClearAll }) => (
//     <Box sx={{
//         border: "1.5px solid #e0e0e0", borderRadius: "10px",
//         p: 1.4, bgcolor: "#fafbfc", height: "100%",
//         display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
//     }}>
//         <Typography fontWeight={700} fontSize={13} color="#1a1a2e" mb={0.8}>{label}</Typography>

//         <Button variant="contained" component="label" size="small"
//             color={files.length ? "warning" : "primary"}
//             sx={{ textTransform: "uppercase", fontWeight: 700, fontSize: 11 }}>
//             Select File
//             <input hidden type="file" multiple onChange={onAddFiles} />
//         </Button>

//         {files.length > 0 ? (
//             <Box display="flex" alignItems="center" gap={0.7} mt={0.9}>
//                 <Typography color="green" fontSize={12} fontWeight={600}>
//                     {files.length} file(s) selected
//                 </Typography>
//                 <Typography
//                     component="span"
//                     onClick={onClearAll}
//                     sx={{ fontSize: 11, color: "#d32f2f", cursor: "pointer", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
//                 >
//                     (clear)
//                 </Typography>
//             </Box>
//         ) : (
//             <Typography color="gray" fontSize={12} mt={0.9}>No file uploaded.</Typography>
//         )}
//     </Box>
// );

// // ─── Parameter Table (scrollable) ────────────────────────────────────────────
// const ParameterTable = ({ rows, loading, onEdit, onDelete, onAdd }) => {
//     const [iduFilter, setIduFilter] = useState("");

//     const filteredRows = React.useMemo(() => {
//         const q = iduFilter.trim().toLowerCase();
//         if (!q) return rows;
//         return rows.filter((row) => (row.idu_model ?? "").toLowerCase().includes(q));
//     }, [rows, iduFilter]);

//     return (
//         <Box>
//             {/* Header row: title + filter + add button */}
//             <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5} flexWrap="wrap" gap={1}>
//                 <Box display="flex" alignItems="center" gap={0.8}>
//                     <TuneIcon sx={{ fontSize: 17, color: TEAL }} />
//                     <Typography fontSize={13.5} fontWeight={700} color="#1a1a2e">Parameters &amp; Values</Typography>
//                     {filteredRows.length > 0 && (
//                         <Chip label={`${filteredRows.length} entries`} size="small"
//                             sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
//                     )}
//                 </Box>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <TextField
//                         placeholder="Filter by IDU…"
//                         value={iduFilter}
//                         onChange={(e) => setIduFilter(e.target.value)}
//                         size="small"
//                         InputProps={{ startAdornment: <SearchIcon sx={{ fontSize: 16, color: "#9aa3af", mr: 0.5 }} /> }}
//                         sx={{ ...fieldSx, width: 180, "& .MuiOutlinedInput-root": { ...fieldSx["& .MuiOutlinedInput-root"], height: 32 } }}
//                     />
//                     <Tooltip title="Add parameter" arrow>
//                         <IconButton size="small" onClick={onAdd}
//                             sx={{ bgcolor: TEAL_LIGHT, color: TEAL, borderRadius: "8px", "&:hover": { bgcolor: TEAL_MID } }}>
//                             <AddIcon sx={{ fontSize: 16 }} />
//                         </IconButton>
//                     </Tooltip>
//                 </Box>
//             </Box>

//             {/* Scrollable table container — fixed height so it doesn't grow unbounded */}
//             <TableContainer component={Paper} elevation={0}
//                 sx={{
//                     border: `1px solid ${TEAL_MID}`,
//                     borderRadius: "10px",
//                     overflow: "hidden",
//                     /* Fixed height: header (~42px) + 8 rows (~37px each) = ~340px.
//                        Anything beyond 8 rows scrolls smoothly inside this box. */
//                     maxHeight: 380,
//                     overflowY: "auto",
//                     /* Custom thin scrollbar — matches dashboard style */
//                     "&::-webkit-scrollbar": { width: 5 },
//                     "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: 4 },
//                     "&::-webkit-scrollbar-thumb": { background: TEAL_MID, borderRadius: 4 },
//                     "&::-webkit-scrollbar-thumb:hover": { background: TEAL },
//                 }}>
//                 <Table size="small" stickyHeader>
//                     <TableHead>
//                         <TableRow>
//                             {["SN", "IDU", "Parameter", "Value", "Actions"].map((h) => (
//                                 <TableCell key={h} sx={{
//                                     color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.3,
//                                     bgcolor: TEAL, letterSpacing: ".03em", whiteSpace: "nowrap",
//                                     /* stickyHeader needs explicit bgcolor or it turns transparent */
//                                     position: "sticky", top: 0, zIndex: 2,
//                                 }}>{h}</TableCell>
//                             ))}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {loading && (
//                             <TableRow>
//                                 <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
//                                     <CircularProgress size={22} sx={{ color: TEAL }} />
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                         {!loading && filteredRows.length === 0 && (
//                             <TableRow>
//                                 <TableCell colSpan={5} align="center" sx={{ py: 3, color: "#aaa", fontSize: 13 }}>
//                                     {iduFilter.trim() ? `No parameters found for IDU "${iduFilter.trim()}".` : "No parameters found."}
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                         {!loading && filteredRows.map((row, idx) => (
//                             <TableRow key={row.id ?? idx} hover
//                                 sx={{ "&:nth-of-type(even)": { bgcolor: "#f8fcfb" }, "&:hover": { bgcolor: TEAL_LIGHT + "88" } }}>
//                                 <TableCell sx={{ color: "#b0b7c3", fontSize: 12, fontWeight: 600, width: 40 }}>{idx + 1}</TableCell>
//                                 <TableCell sx={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>
//                                     {row.idu_model ? (
//                                         <Chip label={row.idu_model} size="small"
//                                             sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11.5, border: "1px solid #ffcc80" }} />
//                                     ) : (
//                                         <Typography component="span" fontSize={12.5} color="#aaa">—</Typography>
//                                     )}
//                                 </TableCell>
//                                 <TableCell sx={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{row.parameter}</TableCell>
//                                 <TableCell sx={{ fontSize: 13, color: "#374151" }}>
//                                     <Chip label={row.value ?? "—"} size="small"
//                                         sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontWeight: 600, fontSize: 11.5, border: "1px solid #90caf9" }} />
//                                 </TableCell>
//                                 <TableCell>
//                                     <Box display="flex" gap={0.5}>
//                                         <Tooltip title="Edit" arrow>
//                                             <IconButton size="small" onClick={() => onEdit(row)}
//                                                 sx={{ color: TEAL, "&:hover": { bgcolor: TEAL_LIGHT } }}>
//                                                 <EditIcon sx={{ fontSize: 16 }} />
//                                             </IconButton>
//                                         </Tooltip>
//                                         <Tooltip title="Delete" arrow>
//                                             <IconButton size="small" onClick={() => onDelete(row)}
//                                                 sx={{ color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}>
//                                                 <DeleteIcon sx={{ fontSize: 16 }} />
//                                             </IconButton>
//                                         </Tooltip>
//                                     </Box>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </Box>
//     );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// const MicrowaveCeragonUpload = () => {
//     const classes = OverAllCss();
//     const navigate = useNavigate();
//     const { loading, action } = useLoadingDialog();

//     // ── plan id ──────────────────────────────────────────────────────────────────
//     const [selectedPlan, setSelectedPlan] = useState(null);
//     const handlePlanSelected = (planId) => {
//         setSelectedPlan(planId);
//         if (planId) setShowError((prev) => ({ ...prev, plan: false }));
//     };

//     // ── dump file states — plain arrays of File objects that ACCUMULATE
//     //    across multiple "Select File(s)" clicks, instead of being replaced ──
//     const [report_File, setReport_File] = useState([]);
//     const [report_File2, setReport_File2] = useState([]);
//     const [fileData, setFileData] = useState();
//     const [download, setDownload] = useState(false);

//     const [showError, setShowError] = useState({ budget: false, report: false, plan: false });

//     // ── link budget file 1 ───────────────────────────────────────────────────────
//     const [linkFiles, setLinkFiles] = useState([]);

//     const fetchLinkFiles = useCallback(async () => {
//         const res = await getData("mwCeragon/linkbudget/");
//         if (res?.status && Array.isArray(res.files)) setLinkFiles(res.files);
//         else setLinkFiles([]);
//     }, []);

//     useEffect(() => { fetchLinkFiles(); }, [fetchLinkFiles]);

//     const handleLinkFileUpload = async (e) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;
//         const formData = new FormData();
//         for (let i = 0; i < files.length; i++) formData.append("link_buget_file", files[i]);
//         action(true);
//         const res = await postData("mwCeragon/linkbudget/", formData);
//         action(false);
//         if (res.status) {
//             Swal.fire("Success", "Files Uploaded", "success");
//             fetchLinkFiles();
//             setShowError((prev) => ({ ...prev, budget: false }));
//         } else { Swal.fire("Error", res.message, "error"); }
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
//             const res = await fetch(`${ServerURL}/mwCeragon/linkbudget/`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire("Deleted!", data?.message || "File(s) deleted successfully.", "success");
//                 setLinkFiles([]);
//             } else { Swal.fire("Error", data?.message || "Delete failed", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong. Please try again.", "error"); }
//         finally { action(false); }
//     };

//     // ── link budget file 2 ───────────────────────────────────────────────────────
//     const [linkFiles2, setLinkFiles2] = useState([]);

//     const fetchLinkFiles2 = useCallback(async () => {
//         const res = await getData("mwCeragon/linkbudget2/");
//         if (res?.status && Array.isArray(res.files)) setLinkFiles2(res.files);
//         else setLinkFiles2([]);
//     }, []);

//     useEffect(() => { fetchLinkFiles2(); }, [fetchLinkFiles2]);

//     const handleLinkFileUpload2 = async (e) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;
//         const formData = new FormData();
//         for (let i = 0; i < files.length; i++) formData.append("link_buget_file", files[i]);
//         action(true);
//         const res = await postData("mwCeragon/linkbudget2/", formData);
//         action(false);
//         if (res.status) {
//             Swal.fire("Success", "Files Uploaded", "success");
//             fetchLinkFiles2();
//         } else { Swal.fire("Error", res.message, "error"); }
//     };

//     const handleDeleteLinkFiles2 = async () => {
//         const result = await Swal.fire({
//             title: "Are you sure?", text: "This will permanently delete the second link budget file.",
//             icon: "warning", showCancelButton: true, confirmButtonColor: "#d32f2f",
//             cancelButtonColor: "#1976d2", confirmButtonText: "Yes, delete", cancelButtonText: "Cancel",
//         });
//         if (!result.isConfirmed) return;
//         action(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/linkbudget2/`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire("Deleted!", data?.message || "File(s) deleted successfully.", "success");
//                 setLinkFiles2([]);
//             } else { Swal.fire("Error", data?.message || "Delete failed", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong. Please try again.", "error"); }
//         finally { action(false); }
//     };

//     // ── parameters ───────────────────────────────────────────────────────────────
//     const [parameters, setParameters] = useState([]);
//     const [paramLoading, setParamLoading] = useState(false);
//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [editRow, setEditRow] = useState(null);
//     const [addDialogOpen, setAddDialogOpen] = useState(false);

//     const fetchParameters = useCallback(async () => {
//         setParamLoading(true);
//         try {
//             const res = await getData("mwCeragon/parameter/");
//             if (Array.isArray(res)) setParameters(res);
//             else if (Array.isArray(res?.data)) setParameters(res.data);
//             else if (Array.isArray(res?.results)) setParameters(res.results);
//             else setParameters([]);
//         } catch { setParameters([]); }
//         finally { setParamLoading(false); }
//     }, []);

//     useEffect(() => { fetchParameters(); }, [fetchParameters]);

//     const handleEditParam = (row) => { setEditRow(row); setEditDialogOpen(true); };

//     const handleDeleteParam = async (row) => {
//         const result = await Swal.fire({
//             title: "Delete Parameter?",
//             html: `<span style="font-size:14px;color:#555">Delete <b>${row.parameter}</b>?</span>`,
//             icon: "warning", showCancelButton: true, confirmButtonColor: "#d32f2f",
//             confirmButtonText: "Yes, delete", cancelButtonText: "Cancel",
//         });
//         if (!result.isConfirmed) return;
//         action(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/parameter/${row.id}/`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire({ icon: "success", title: "Deleted!", timer: 1600, showConfirmButton: false });
//             } else { Swal.fire("Error", data?.message || "Delete failed.", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong.", "error"); }
//         finally { await fetchParameters(); action(false); }
//     };

//     // ── dump file handler ────────────────────────────────────────────────────────
//     // Merges newly picked files into whatever is already selected instead of
//     // replacing it, so choosing files from folder A then folder B keeps both
//     // batches. Duplicate files (same name+size+lastModified) are skipped, and
//     // the input is reset so re-selecting the same file still fires onChange.
//     const addFiles = (event, setFileState, errorKey) => {
//         const selected = Array.from(event.target.files || []);
//         if (selected.length === 0) return;
//         setShowError((prev) => ({ ...prev, [errorKey]: false }));
//         setFileState((prev) => {
//             const existingKeys = new Set(prev.map((f) => `${f.name}_${f.size}_${f.lastModified}`));
//             const merged = [...prev];
//             selected.forEach((f) => {
//                 const key = `${f.name}_${f.size}_${f.lastModified}`;
//                 if (!existingKeys.has(key)) {
//                     merged.push(f);
//                     existingKeys.add(key);
//                 }
//             });
//             return merged;
//         });
//         event.target.value = "";
//     };

//     // ── submit ───────────────────────────────────────────────────────────────────
//     const handleSubmit = async () => {
//         const hasDump1 = report_File.length > 0;
//         const hasDump2 = report_File2.length > 0;
//         const hasPlan = !!(selectedPlan && String(selectedPlan).trim());
//         const isValid = linkFiles.length > 0 && (hasDump1 || hasDump2) && hasPlan;
//         if (!isValid) {
//             setShowError({ budget: !linkFiles.length, report: !hasDump1 && !hasDump2, plan: !hasPlan });
//             if (!hasPlan) Swal.fire("Validation", "Please search and select a Plan ID first.", "warning");
//             return;
//         }
//         action(true);
//         const formData = new FormData();
//         report_File.forEach((file) => formData.append("dump_file1", file));
//         report_File2.forEach((file) => formData.append("dump_file2", file));
//         formData.append("plan_id", String(selectedPlan).trim());
//         const response = await postData("mwCeragon/upload_dump/", formData);
//         action(false);
//         if (response.status) {
//             setDownload(true); setFileData(response.download_url);
//             Swal.fire("Done", response.message, "success");
//         } else { Swal.fire("Oops...", response.message, "error"); }
//     };

//     const handleCancel = () => {
//         setReport_File([]);
//         setReport_File2([]);
//         setDownload(false);
//         setShowError({ budget: false, report: false, plan: false });
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

//                                 {/* ── PLAN ID SEARCH ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <Typography className={classes.Front_Box_Hading} sx={{ mb: 1 }}>
//                                         Search Plan ID:
//                                     </Typography>
//                                     <PlanIdSearch onPlanSelected={handlePlanSelected} />
//                                     {showError.plan && (
//                                         <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>This Field Is Required!</Typography>
//                                     )}
//                                 </Box>

//                                 {/* ── LINK BUDGET FILE 1 ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <LinkBudgetRow
//                                         label="Select Link Budget File 1:"
//                                         files={linkFiles}
//                                         onUpload={handleLinkFileUpload}
//                                         onDelete={handleDeleteLinkFiles}
//                                         showError={showError.budget}
//                                     />
//                                 </Box>

//                                 {/* ── LINK BUDGET FILE 2 ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <LinkBudgetRow
//                                         label="Select Link Budget File 2:"
//                                         files={linkFiles2}
//                                         onUpload={handleLinkFileUpload2}
//                                         onDelete={handleDeleteLinkFiles2}
//                                         showError={false}
//                                     />
//                                 </Box>

//                                 {/* ── DUMP A + DUMP B — narrow card, not stretched to full width ── */}
//                                 <Box className={classes.Front_Box} sx={{ maxWidth: 1200, mx: "auto" }}>
//                                     <Typography className={classes.Front_Box_Hading} sx={{ mb: 1.2, textAlign: "center" }}>
//                                         Select Dump Files:
//                                     </Typography>
//                                     <Grid container spacing={1.5}>
//                                         <Grid item xs={6}>
//                                             <DumpFileBox
//                                                 label="Dump A"
//                                                 files={report_File}
//                                                 onAddFiles={(e) => addFiles(e, setReport_File, "report")}
//                                                 onClearAll={() => setReport_File([])}
//                                             />
//                                         </Grid>
//                                         <Grid item xs={6}>
//                                             <DumpFileBox
//                                                 label="Dump B"
//                                                 files={report_File2}
//                                                 onAddFiles={(e) => addFiles(e, setReport_File2, "report")}
//                                                 onClearAll={() => setReport_File2([])}
//                                             />
//                                         </Grid>
//                                     </Grid>
//                                     {showError.report && (
//                                         <Typography color="red" fontWeight={600} fontSize={12.5} mt={1} textAlign="center">
//                                             Select at least one dump file (Dump A or Dump B)!
//                                         </Typography>
//                                     )}
//                                 </Box>

//                                 {/* ── PARAMETER & VALUE TABLE (scrollable) ── */}
//                                 {/* <Box className={classes.Front_Box} sx={{ p: 2 }}>
//                                     <ParameterTable
//                                         rows={parameters}
//                                         loading={paramLoading}
//                                         onEdit={handleEditParam}
//                                         onDelete={handleDeleteParam}
//                                         onAdd={() => setAddDialogOpen(true)}
//                                     />
//                                 </Box> */}

//                             </Stack>

//                             {/* ── ACTION BUTTONS ── */}
//                             <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
//                                 <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}
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

//                     {/* ── DOWNLOAD ── */}
//                     {download && (
//                         <Box textAlign="center" mt={2}>
//                             <a href={fileData} download>
//                                 <Button variant="outlined"
//                                     startIcon={<FileDownloadIcon sx={{ fontSize: 28, color: "green" }} />}
//                                     sx={{ textTransform: "none", fontWeight: 800, fontSize: "20px", fontFamily: "Poppins" }}>
//                                     Download Ceragon Report
//                                 </Button>
//                             </a>
//                         </Box>
//                     )}
//                 </Box>
//             </Slide>

//             {/* ── Dialogs ── */}
//             <AddParamDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onSaved={fetchParameters} />
//             <EditParamDialog
//                 open={editDialogOpen}
//                 onClose={() => { setEditDialogOpen(false); setEditRow(null); }}
//                 row={editRow}
//                 onSaved={fetchParameters}
//             />

//             {loading}
//         </>
//     );
// };

// export default MicrowaveCeragonUpload;

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Paper, IconButton, TextField, Tooltip, Chip, Dialog, DialogTitle,
//     DialogContent, DialogActions, CircularProgress, MenuItem,
// } from "@mui/material";
// import {
//     Upload as UploadIcon,
//     DoDisturb as DoDisturbIcon,
//     FileDownload as FileDownloadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
//     Edit as EditIcon,
//     Delete as DeleteIcon,
//     Save as SaveIcon,
//     Close as CloseIcon,
//     Add as AddIcon,
//     TuneOutlined as TuneIcon,
//     Search as SearchIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import "rsuite/dist/rsuite.min.css";

// // ─── theme constants ────────────────────────────────────────────────────────
// const TEAL = "#2a77bf";
// const TEAL_DARK = "#28538c";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID = "#b2dfdb";

// // ─── inline field styles ────────────────────────────────────────────────────
// const fieldSx = {
//     "& .MuiOutlinedInput-root": {
//         borderRadius: "8px",
//         fontSize: 13,
//         "&:hover fieldset": { borderColor: TEAL },
//         "&.Mui-focused fieldset": { borderColor: TEAL },
//     },
//     "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
// };

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

// // ─── Plan ID helpers ─────────────────────────────────────────────────────────
// const planIdToString = (plan) => {
//     if (plan == null) return "";
//     if (typeof plan === "string") return plan;
//     return plan.plan_id ?? plan.id ?? plan.name ?? "";
// };

// // Minimum characters before we bother hitting the API, and how long we wait
// // after the user stops typing. Both are tuned for a fast-feeling search.
// const SEARCH_MIN_CHARS = 2;
// const SEARCH_DEBOUNCE_MS = 100;
// // If a cached result set is smaller than this, we trust it wasn't truncated
// // by the server, so we can keep narrowing it locally as the user keeps
// // typing instead of firing another request.
// const SEARCH_RESULT_CAP = 50;

// // ─── Circle detection ────────────────────────────────────────────────────────
// // Plan IDs look like "MW-N-MAH-10012026-1740" — the circle code is the 3rd
// // dash-separated token (MAH, AP, BR, DL, GJ, HP, HR, ROTN, ...). We primarily
// // read that fixed position, and fall back to scanning for a short
// // alphabetic token if the shape ever varies.
// const extractCircleFromPlanId = (planId) => {
//     if (!planId) return null;
//     const tokens = String(planId).toUpperCase().split(/[-_\s]+/).filter(Boolean);
//     if (tokens[2] && /^[A-Z]{2,6}$/.test(tokens[2])) return tokens[2];
//     for (const token of tokens) {
//         if (token !== "MW" && /^[A-Z]{2,6}$/.test(token)) return token;
//     }
//     return null;
// };

// // ─── Circle → IP lookup (live API) ───────────────────────────────────────────
// // IMPORTANT: this must go through the same `getData` helper every other
// // endpoint in this file uses (getData prepends the real API host/ServerURL).
// // A raw `fetch("mwCeragon/server_ip/")` resolves against the *frontend's*
// // origin, not the API server, which is why it was silently hitting the
// // wrong place before.
// const SERVER_IP_ENDPOINT = "mwCeragon/get_serverip/";

// // Normalizes whatever key-casing the backend uses ("ROTN", "rotn", "Rotn"...)
// // to uppercase so lookups always match regardless of case.
// const normalizeCirclesMap = (raw) => {
//     const source = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
//     const normalized = {};
//     Object.keys(source).forEach((key) => { normalized[key.toUpperCase()] = source[key]; });
//     return normalized;
// };

// // The circles payload doesn't change between plan-id selections within a
// // session, so we fetch it once and reuse it — this is the "reduce
// // unnecessary API calls" part of the optimization.
// let cachedCirclesData = null;
// let cachedCirclesPromise = null;

// const fetchCirclesData = async () => {
//     if (cachedCirclesData) return cachedCirclesData;
//     if (cachedCirclesPromise) return cachedCirclesPromise;
//     cachedCirclesPromise = getData(SERVER_IP_ENDPOINT)
//         .then((res) => {
//             // Tolerate a few likely response shapes:
//             // { circles: {...} } | { data: { circles: {...} } } | { data: {...} } | {...} directly
//             const rawCircles =
//                 res?.circles ?? res?.data?.circles ?? res?.results?.circles ?? res?.data ?? res ?? {};
//             cachedCirclesData = normalizeCirclesMap(rawCircles);
//             return cachedCirclesData;
//         })
//         .catch(() => {
//             cachedCirclesData = {};
//             return cachedCirclesData;
//         })
//         .finally(() => { cachedCirclesPromise = null; });
//     return cachedCirclesPromise;
// };

// // The value under a circle key might come back as an array of strings, an
// // array of objects ({ ip: "..." }), a single string, or a plain object —
// // normalize all of those into a flat array of IP strings.
// const extractIpsFromCircleValue = (value) => {
//     if (!value) return [];
//     if (Array.isArray(value)) {
//         return value
//             .map((v) => (typeof v === "string" ? v : v?.ip ?? v?.IP ?? v?.address ?? ""))
//             .filter(Boolean);
//     }
//     if (typeof value === "string") return [value];
//     if (typeof value === "object") return Object.values(value).filter((v) => typeof v === "string");
//     return [];
// };

// const fetchIpsForCircle = async (circleCode) => {
//     const circles = await fetchCirclesData();
//     return extractIpsFromCircleValue(circles?.[String(circleCode).toUpperCase()]);
// };

// // ─── Plan ID Multi-Select Search ─────────────────────────────────────────────
// const PlanIdMultiSearch = ({ selectedPlans, onPlansChange }) => {
//     const [query, setQuery] = useState("");
//     const [options, setOptions] = useState([]);
//     const [showOptions, setShowOptions] = useState(false);
//     const [hasSearched, setHasSearched] = useState(false);
//     // Guards against slow/out-of-order responses overwriting a newer, faster
//     // one — this is what made the search *feel* slow before (a stale
//     // response for "MW" could land after the response for "MW-N" and wipe
//     // out the correct, more specific results).
//     const requestIdRef = useRef(0);
//     // term (lowercased) -> results. Lets repeat/near-repeat queries (typing,
//     // backspacing, retyping) skip the network entirely.
//     const searchCacheRef = useRef(new Map());

//     const runSearch = useCallback(async (term) => {
//         const trimmed = term.trim();
//         if (trimmed.length < SEARCH_MIN_CHARS) {
//             setOptions([]); setShowOptions(false); setHasSearched(false);
//             return;
//         }
//         const key = trimmed.toLowerCase();
//         const cache = searchCacheRef.current;

//         // 1) Exact cache hit — instant, no network call.
//         if (cache.has(key)) {
//             setOptions(cache.get(key));
//             setShowOptions(true);
//             setHasSearched(true);
//             return;
//         }

//         // 2) Narrow down from the closest cached prefix instead of refetching,
//         //    as long as that prefix's result set wasn't likely truncated by
//         //    the server (i.e. it came back under the cap).
//         for (let len = key.length - 1; len >= SEARCH_MIN_CHARS; len--) {
//             const prefixKey = key.slice(0, len);
//             if (!cache.has(prefixKey)) continue;
//             const prefixResults = cache.get(prefixKey);
//             if (prefixResults.length < SEARCH_RESULT_CAP) {
//                 const filtered = prefixResults.filter((opt) =>
//                     planIdToString(opt).toLowerCase().includes(key)
//                 );
//                 cache.set(key, filtered);
//                 setOptions(filtered);
//                 setShowOptions(true);
//                 setHasSearched(true);
//                 return;
//             }
//             break;
//         }

//         // 3) Fall through to a real API call.
//         const currentRequestId = ++requestIdRef.current;
//         try {
//             const body = new FormData();
//             body.append("plan_id", trimmed);
//             const res = await postData("mwCeragon/search_planid/", body);
//             if (currentRequestId !== requestIdRef.current) return; // stale, ignore
//             let results = [];
//             if (Array.isArray(res)) results = res;
//             else if (Array.isArray(res?.data)) results = res.data;
//             else if (Array.isArray(res?.results)) results = res.results;
//             else if (typeof res === "string") results = [res];
//             else if (res?.status && res?.plan_id) results = [res];
//             cache.set(key, results);
//             setOptions(results);
//             setShowOptions(true);
//             setHasSearched(true);
//         } catch {
//             if (currentRequestId === requestIdRef.current) { setOptions([]); setHasSearched(true); }
//         }
//     }, []);

//     useEffect(() => {
//         const trimmed = query.trim();
//         if (trimmed.length < SEARCH_MIN_CHARS) {
//             setOptions([]); setShowOptions(false); setHasSearched(false);
//             return;
//         }
//         const timer = setTimeout(() => runSearch(query), SEARCH_DEBOUNCE_MS);
//         return () => clearTimeout(timer);
//     }, [query, runSearch]);

//     const isSelected = (planStr) =>
//         selectedPlans.some((p) => p.toLowerCase() === planStr.toLowerCase());

//     const handlePick = (plan) => {
//         const planStr = planIdToString(plan);
//         if (!planStr || isSelected(planStr)) { setShowOptions(false); return; }
//         onPlansChange([...selectedPlans, planStr]);
//         setQuery("");
//         setOptions([]);
//         setShowOptions(false);
//         setHasSearched(false);
//     };

//     const handleRemove = (planStr) => {
//         onPlansChange(selectedPlans.filter((p) => p !== planStr));
//     };

//     const handleClearAll = () => onPlansChange([]);

//     return (
//         <Box sx={{ position: "relative" }}>
//             <Grid container alignItems="flex-start" spacing={2}>
//                 <Grid item xs={12} md={6}>
//                     <TextField
//                         label="Search Plan ID"
//                         placeholder="e.g. MW-N-MUM-25052023-418"
//                         value={query}
//                         onChange={(e) => setQuery(e.target.value)}
//                         onFocus={() => { if (options.length > 0) setShowOptions(true); }}
//                         size="small" fullWidth sx={fieldSx}
//                     />
//                 </Grid>
//                 {selectedPlans.length > 0 && (
//                     <Grid item xs={12} md>
//                         <Box display="flex" flexWrap="wrap" gap={0.8} alignItems="center">
//                             {selectedPlans.map((plan) => (
//                                 <Chip
//                                     key={plan}
//                                     label={plan}
//                                     onDelete={() => handleRemove(plan)}
//                                     sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}`, fontWeight: 600 }}
//                                 />
//                             ))}
//                             <Typography
//                                 component="span"
//                                 onClick={handleClearAll}
//                                 sx={{ fontSize: 12, color: "#d32f2f", cursor: "pointer", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
//                             >
//                                 Clear all
//                             </Typography>
//                         </Box>
//                     </Grid>
//                 )}
//             </Grid>
//             {showOptions && (
//                 <Paper elevation={3} sx={{ mt: 1, borderRadius: "8px", maxHeight: 220, overflowY: "auto", border: `1px solid ${TEAL_MID}`, position: "absolute", zIndex: 10, width: { xs: "100%", md: "50%" } }}>
//                     {options.length > 0 ? options.map((opt, idx) => {
//                         const label = planIdToString(opt);
//                         const already = isSelected(label);
//                         return (
//                             <MenuItem
//                                 key={label || idx}
//                                 onClick={() => handlePick(opt)}
//                                 disabled={already}
//                                 sx={{ fontSize: 13, display: "flex", justifyContent: "space-between" }}
//                             >
//                                 {label}
//                                 {already && <Typography component="span" fontSize={11} color={TEAL} ml={1}>Added</Typography>}
//                             </MenuItem>
//                         );
//                     }) : (
//                         hasSearched && (
//                             <Box sx={{ px: 2, py: 1.5 }}>
//                                 <Typography fontSize={13} color="#aaa">No plan found matching "{query.trim()}".</Typography>
//                             </Box>
//                         )
//                     )}
//                 </Paper>
//             )}
//         </Box>
//     );
// };

// // ─── IP Select Panel ──────────────────────────────────────────────────────────
// // Given the circle codes derived from the selected Plan IDs, fetches the IPs
// // for each circle (via /mwCeragon/server_ip/, cached — see fetchCirclesData)
// // and lists them directly as clickable chips — no typing/searching needed.
// // Clicking an IP adds it to the selection; selected IPs show beside the
// // list (same chip style as the Plan ID selection) and can be removed with
// // their delete (x) button. Multiple IPs can be selected at once.
// const IpSelectPanel = ({ circles, selectedIps, onIpsChange }) => {
//     const [ipsByCircle, setIpsByCircle] = useState({});

//     useEffect(() => {
//         let cancelled = false;
//         circles.forEach((code) => {
//             if (ipsByCircle[code] !== undefined) return; // already fetched / fetching
//             fetchIpsForCircle(code).then((ips) => {
//                 if (!cancelled) setIpsByCircle((prev) => ({ ...prev, [code]: ips }));
//             });
//         });
//         return () => { cancelled = true; };
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [circles]);

//     const availableOptions = React.useMemo(() => {
//         const list = [];
//         const seen = new Set();
//         circles.forEach((code) => {
//             (ipsByCircle[code] || []).forEach((ip) => {
//                 if (seen.has(ip)) return;
//                 seen.add(ip);
//                 list.push({ ip, circle: code });
//             });
//         });
//         return list;
//     }, [circles, ipsByCircle]);

//     const isSelected = (ip) => selectedIps.includes(ip);
//     const toggleIp = (ip) => {
//         if (isSelected(ip)) return; // removal happens via the chip's own delete (x)
//         onIpsChange([...selectedIps, ip]);
//     };
//     const handleRemove = (ip) => onIpsChange(selectedIps.filter((x) => x !== ip));
//     const handleClearAll = () => onIpsChange([]);

//     if (circles.length === 0) return null;

//     const stillLoading = circles.some((c) => ipsByCircle[c] === undefined);

//     return (
//         <Box className="Front_Box">
//             <Typography className="Front_Box_Hading" sx={{ mb: 1 }}>
//                 Server IP{" "}
//                 <Typography component="span" fontSize={11.5} color="gray" fontWeight={400}>
//                     (auto-suggested from Circle: {circles.join(", ")})
//                 </Typography>
//             </Typography>
//             <Grid container alignItems="flex-start" spacing={2}>
//                 <Grid item xs={12} md={6}>
//                     {availableOptions.length > 0 ? (
//                         <Box display="flex" flexWrap="wrap" gap={0.8}>
//                             {availableOptions.map((opt) => {
//                                 const selected = isSelected(opt.ip);
//                                 return (
//                                     <Chip
//                                         key={opt.ip}
//                                         label={opt.ip}
//                                         onClick={() => toggleIp(opt.ip)}
//                                         clickable={!selected}
//                                         sx={selected ? {
//                                             bgcolor: TEAL, color: "#fff", fontWeight: 700,
//                                             border: `1px solid ${TEAL_DARK}`, cursor: "default",
//                                         } : {
//                                             bgcolor: "#f5f7f8", color: "#374151", fontWeight: 600,
//                                             border: `1px solid ${TEAL_MID}`,
//                                             "&:hover": { bgcolor: TEAL_LIGHT, borderColor: TEAL },
//                                         }}
//                                     />
//                                 );
//                             })}
//                         </Box>
//                     ) : (
//                         <Typography fontSize={12.5} color="gray">
//                             {stillLoading ? "Loading IPs…" : "No IP found for this circle."}
//                         </Typography>
//                     )}
//                 </Grid>
//                 {selectedIps.length > 0 && (
//                     <Grid item xs={12} md>
//                         <Box display="flex" flexWrap="wrap" gap={0.8} alignItems="center">
//                             {selectedIps.map((ip) => (
//                                 <Chip
//                                     key={ip}
//                                     label={ip}
//                                     onDelete={() => handleRemove(ip)}
//                                     sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}`, fontWeight: 600 }}
//                                 />
//                             ))}
//                             <Typography
//                                 component="span"
//                                 onClick={handleClearAll}
//                                 sx={{ fontSize: 12, color: "#d32f2f", cursor: "pointer", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
//                             >
//                                 Clear all
//                             </Typography>
//                         </Box>
//                     </Grid>
//                 )}
//             </Grid>
//         </Box>
//     );
// };

// // ─── Add Parameter Dialog ────────────────────────────────────────────────────
// const AddParamDialog = ({ open, onClose, onSaved }) => {
//     const [iduModel, setIduModel] = useState("");
//     const [parameter, setParameter] = useState("");
//     const [value, setValue] = useState("");
//     const [saving, setSaving] = useState(false);
//     const [iduSearching, setIduSearching] = useState(false);

//     useEffect(() => { if (open) { setIduModel(""); setParameter(""); setValue(""); } }, [open]);

//     const fetchByIdu = async () => {
//         if (!iduModel.trim()) return;
//         setIduSearching(true);
//         try {
//             Swal.fire("Coming Soon", "IDU lookup API is not connected yet. You can still enter the parameter and value manually.", "info");
//         } catch { Swal.fire("Error", "Something went wrong while searching the IDU.", "error"); }
//         finally { setIduSearching(false); }
//     };

//     const handleSave = async () => {
//         if (!iduModel.trim()) { Swal.fire("Validation", "IDU model is required.", "warning"); return; }
//         if (!parameter.trim()) { Swal.fire("Validation", "Parameter name is required.", "warning"); return; }
//         setSaving(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/parameter/`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ idu_model: iduModel.trim(), parameter: parameter.trim(), value: value.trim() }),
//             });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire({ icon: "success", title: "Added!", timer: 1800, showConfirmButton: false });
//                 onSaved(); onClose();
//             } else { Swal.fire("Error", data?.message || "Add failed.", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong.", "error"); }
//         finally { setSaving(false); }
//     };

//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock
//             PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
//             <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #8cc6eb)` }} />
//             <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <AddIcon sx={{ color: TEAL, fontSize: 20 }} />
//                     <Typography fontWeight={700} fontSize={16}>Add Parameter</Typography>
//                 </Box>
//                 <IconButton size="small" onClick={onClose}
//                     sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
//                     <CloseIcon sx={{ fontSize: 16 }} />
//                 </IconButton>
//             </DialogTitle>
//             <DialogContent sx={{ pt: 3, pb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
//                 <Box display="flex" gap={1}>
//                     <TextField label="IDU (e.g. IDU20...)" value={iduModel} onChange={(e) => setIduModel(e.target.value)} size="small" fullWidth sx={fieldSx} />
//                     <Tooltip title="Search by IDU (coming soon)" arrow>
//                         <span>
//                             <IconButton onClick={fetchByIdu} disabled={iduSearching || !iduModel.trim()}
//                                 sx={{ bgcolor: TEAL_LIGHT, color: TEAL, borderRadius: "8px", "&:hover": { bgcolor: TEAL_MID } }}>
//                                 {iduSearching ? <CircularProgress size={16} /> : <SearchIcon sx={{ fontSize: 18 }} />}
//                             </IconButton>
//                         </span>
//                     </Tooltip>
//                 </Box>
//                 <TextField label="Parameter" value={parameter} onChange={(e) => setParameter(e.target.value)} size="small" fullWidth sx={fieldSx} />
//                 <TextField label="Value" value={value} onChange={(e) => setValue(e.target.value)} size="small" fullWidth sx={fieldSx} />
//             </DialogContent>
//             <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
//                 <Button onClick={onClose} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>Cancel</Button>
//                 <Button variant="contained" onClick={handleSave} disabled={saving}
//                     startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
//                     sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5 }}>
//                     {saving ? "Saving…" : "Add"}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// // ─── Edit Parameter Dialog ────────────────────────────────────────────────────
// const EditParamDialog = ({ open, onClose, row, onSaved }) => {
//     const [iduModel, setIduModel] = useState("");
//     const [parameter, setParameter] = useState("");
//     const [value, setValue] = useState("");
//     const [saving, setSaving] = useState(false);

//     useEffect(() => {
//         if (open && row) { setIduModel(row.idu_model ?? ""); setParameter(row.parameter ?? ""); setValue(row.value ?? ""); }
//     }, [open, row]);

//     const handleSave = async () => {
//         if (!parameter.trim()) { Swal.fire("Validation", "Parameter name is required.", "warning"); return; }
//         setSaving(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/parameter/${row.id}/`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ idu_model: iduModel.trim(), parameter: parameter.trim(), value: value.trim() }),
//             });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire({ icon: "success", title: "Updated!", timer: 1800, showConfirmButton: false });
//                 onSaved(); onClose();
//             } else { Swal.fire("Error", data?.message || "Update failed.", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong.", "error"); }
//         finally { setSaving(false); }
//     };

//     if (!row) return null;
//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock
//             PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
//             <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #8cc6eb)` }} />
//             <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <TuneIcon sx={{ color: TEAL, fontSize: 20 }} />
//                     <Typography fontWeight={700} fontSize={16}>Edit Parameter</Typography>
//                 </Box>
//                 <IconButton size="small" onClick={onClose}
//                     sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
//                     <CloseIcon sx={{ fontSize: 16 }} />
//                 </IconButton>
//             </DialogTitle>
//             <DialogContent sx={{ pt: 3, pb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
//                 <TextField label="IDU" value={iduModel} onChange={(e) => setIduModel(e.target.value)} size="small" fullWidth sx={fieldSx} />
//                 <TextField label="Parameter" value={parameter} onChange={(e) => setParameter(e.target.value)} size="small" fullWidth sx={fieldSx} />
//                 <TextField label="Value" value={value} onChange={(e) => setValue(e.target.value)} size="small" fullWidth sx={fieldSx} />
//             </DialogContent>
//             <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
//                 <Button onClick={onClose} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>Cancel</Button>
//                 <Button variant="contained" onClick={handleSave} disabled={saving}
//                     startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
//                     sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5 }}>
//                     {saving ? "Saving…" : "Update"}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// // ─── Single Link Budget Row ──────────────────────────────────────────────────
// const LinkBudgetRow = ({ label, files, onUpload, onDelete, showError }) => (
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
//                         <Typography key={index} fontWeight={600} color="green" fontSize={13}>{file}</Typography>
//                     ))
//                 ) : (
//                     <Typography color="gray" fontSize={13}>No file uploaded.</Typography>
//                 )}
//             </Grid>
//             <Grid item>
//                 <Button variant="contained"
//                     sx={{ backgroundColor: "#d32f2f", color: "white", textTransform: "uppercase", fontWeight: 700 }}
//                     disabled={!files.length} onClick={onDelete}>
//                     Delete
//                 </Button>
//             </Grid>
//         </Grid>
//         {showError && (
//             <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>This Field Is Required!</Typography>
//         )}
//     </Box>
// );

// // ─── Multi-select Dump File Box (accumulates files across multiple selections) ──
// const DumpFileBox = ({ label, files, onAddFiles, onClearAll }) => (
//     <Box sx={{
//         border: "1.5px solid #e0e0e0", borderRadius: "10px",
//         p: 1.4, bgcolor: "#fafbfc", height: "100%",
//         display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
//     }}>
//         <Typography fontWeight={700} fontSize={13} color="#1a1a2e" mb={0.8}>{label}</Typography>

//         <Button variant="contained" component="label" size="small"
//             color={files.length ? "warning" : "primary"}
//             sx={{ textTransform: "uppercase", fontWeight: 700, fontSize: 11 }}>
//             Select File
//             <input hidden type="file" multiple onChange={onAddFiles} />
//         </Button>

//         {files.length > 0 ? (
//             <Box display="flex" alignItems="center" gap={0.7} mt={0.9}>
//                 <Typography color="green" fontSize={12} fontWeight={600}>
//                     {files.length} file(s) selected
//                 </Typography>
//                 <Typography
//                     component="span"
//                     onClick={onClearAll}
//                     sx={{ fontSize: 11, color: "#d32f2f", cursor: "pointer", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
//                 >
//                     (clear)
//                 </Typography>
//             </Box>
//         ) : (
//             <Typography color="gray" fontSize={12} mt={0.9}>No file uploaded.</Typography>
//         )}
//     </Box>
// );

// // ─── Parameter Table (scrollable) ────────────────────────────────────────────
// const ParameterTable = ({ rows, loading, onEdit, onDelete, onAdd }) => {
//     const [iduFilter, setIduFilter] = useState("");

//     const filteredRows = React.useMemo(() => {
//         const q = iduFilter.trim().toLowerCase();
//         if (!q) return rows;
//         return rows.filter((row) => (row.idu_model ?? "").toLowerCase().includes(q));
//     }, [rows, iduFilter]);

//     return (
//         <Box>
//             <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5} flexWrap="wrap" gap={1}>
//                 <Box display="flex" alignItems="center" gap={0.8}>
//                     <TuneIcon sx={{ fontSize: 17, color: TEAL }} />
//                     <Typography fontSize={13.5} fontWeight={700} color="#1a1a2e">Parameters &amp; Values</Typography>
//                     {filteredRows.length > 0 && (
//                         <Chip label={`${filteredRows.length} entries`} size="small"
//                             sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
//                     )}
//                 </Box>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     <TextField
//                         placeholder="Filter by IDU…"
//                         value={iduFilter}
//                         onChange={(e) => setIduFilter(e.target.value)}
//                         size="small"
//                         InputProps={{ startAdornment: <SearchIcon sx={{ fontSize: 16, color: "#9aa3af", mr: 0.5 }} /> }}
//                         sx={{ ...fieldSx, width: 180, "& .MuiOutlinedInput-root": { ...fieldSx["& .MuiOutlinedInput-root"], height: 32 } }}
//                     />
//                     <Tooltip title="Add parameter" arrow>
//                         <IconButton size="small" onClick={onAdd}
//                             sx={{ bgcolor: TEAL_LIGHT, color: TEAL, borderRadius: "8px", "&:hover": { bgcolor: TEAL_MID } }}>
//                             <AddIcon sx={{ fontSize: 16 }} />
//                         </IconButton>
//                     </Tooltip>
//                 </Box>
//             </Box>

//             <TableContainer component={Paper} elevation={0}
//                 sx={{
//                     border: `1px solid ${TEAL_MID}`,
//                     borderRadius: "10px",
//                     overflow: "hidden",
//                     maxHeight: 380,
//                     overflowY: "auto",
//                     "&::-webkit-scrollbar": { width: 5 },
//                     "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: 4 },
//                     "&::-webkit-scrollbar-thumb": { background: TEAL_MID, borderRadius: 4 },
//                     "&::-webkit-scrollbar-thumb:hover": { background: TEAL },
//                 }}>
//                 <Table size="small" stickyHeader>
//                     <TableHead>
//                         <TableRow>
//                             {["SN", "IDU", "Parameter", "Value", "Actions"].map((h) => (
//                                 <TableCell key={h} sx={{
//                                     color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.3,
//                                     bgcolor: TEAL, letterSpacing: ".03em", whiteSpace: "nowrap",
//                                     position: "sticky", top: 0, zIndex: 2,
//                                 }}>{h}</TableCell>
//                             ))}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {loading && (
//                             <TableRow>
//                                 <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
//                                     <CircularProgress size={22} sx={{ color: TEAL }} />
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                         {!loading && filteredRows.length === 0 && (
//                             <TableRow>
//                                 <TableCell colSpan={5} align="center" sx={{ py: 3, color: "#aaa", fontSize: 13 }}>
//                                     {iduFilter.trim() ? `No parameters found for IDU "${iduFilter.trim()}".` : "No parameters found."}
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                         {!loading && filteredRows.map((row, idx) => (
//                             <TableRow key={row.id ?? idx} hover
//                                 sx={{ "&:nth-of-type(even)": { bgcolor: "#f8fcfb" }, "&:hover": { bgcolor: TEAL_LIGHT + "88" } }}>
//                                 <TableCell sx={{ color: "#b0b7c3", fontSize: 12, fontWeight: 600, width: 40 }}>{idx + 1}</TableCell>
//                                 <TableCell sx={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>
//                                     {row.idu_model ? (
//                                         <Chip label={row.idu_model} size="small"
//                                             sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11.5, border: "1px solid #ffcc80" }} />
//                                     ) : (
//                                         <Typography component="span" fontSize={12.5} color="#aaa">—</Typography>
//                                     )}
//                                 </TableCell>
//                                 <TableCell sx={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{row.parameter}</TableCell>
//                                 <TableCell sx={{ fontSize: 13, color: "#374151" }}>
//                                     <Chip label={row.value ?? "—"} size="small"
//                                         sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontWeight: 600, fontSize: 11.5, border: "1px solid #90caf9" }} />
//                                 </TableCell>
//                                 <TableCell>
//                                     <Box display="flex" gap={0.5}>
//                                         <Tooltip title="Edit" arrow>
//                                             <IconButton size="small" onClick={() => onEdit(row)}
//                                                 sx={{ color: TEAL, "&:hover": { bgcolor: TEAL_LIGHT } }}>
//                                                 <EditIcon sx={{ fontSize: 16 }} />
//                                             </IconButton>
//                                         </Tooltip>
//                                         <Tooltip title="Delete" arrow>
//                                             <IconButton size="small" onClick={() => onDelete(row)}
//                                                 sx={{ color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}>
//                                                 <DeleteIcon sx={{ fontSize: 16 }} />
//                                             </IconButton>
//                                         </Tooltip>
//                                     </Box>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </Box>
//     );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// const MicrowaveCeragonUpload = () => {
//     const classes = OverAllCss();
//     const navigate = useNavigate();
//     const { loading, action } = useLoadingDialog();

//     // ── plan id (now multi-select) ─────────────────────────────────────────────
//     const [selectedPlans, setSelectedPlans] = useState([]);
//     const handlePlansChange = (plans) => {
//         setSelectedPlans(plans);
//         if (plans.length > 0) setShowError((prev) => ({ ...prev, plan: false }));
//     };

//     // ── circle(s) derived from selected plan ids, and the IPs picked for them ──
//     const circles = React.useMemo(() => {
//         const set = new Set();
//         selectedPlans.forEach((plan) => {
//             const code = extractCircleFromPlanId(plan);
//             if (code) set.add(code);
//         });
//         return Array.from(set);
//     }, [selectedPlans]);
//     const [selectedIps, setSelectedIps] = useState([]);
//     // Drop any selected IPs that no longer belong to a currently-derived
//     // circle (e.g. the plan id that produced that circle was removed).
//     useEffect(() => {
//         if (circles.length === 0 && selectedIps.length > 0) setSelectedIps([]);
//     }, [circles, selectedIps.length]);

//     // ── dump file states — plain arrays of File objects that ACCUMULATE
//     //    across multiple "Select File(s)" clicks, instead of being replaced ──
//     const [report_File, setReport_File] = useState([]);
//     const [report_File2, setReport_File2] = useState([]);
//     const [fileData, setFileData] = useState();
//     const [download, setDownload] = useState(false);

//     const [showError, setShowError] = useState({ budget: false, report: false, plan: false });

//     // ── link budget file 1 ───────────────────────────────────────────────────────
//     const [linkFiles, setLinkFiles] = useState([]);

//     const fetchLinkFiles = useCallback(async () => {
//         const res = await getData("mwCeragon/linkbudget/");
//         if (res?.status && Array.isArray(res.files)) setLinkFiles(res.files);
//         else setLinkFiles([]);
//     }, []);

//     useEffect(() => { fetchLinkFiles(); }, [fetchLinkFiles]);

//     const handleLinkFileUpload = async (e) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;
//         const formData = new FormData();
//         for (let i = 0; i < files.length; i++) formData.append("link_buget_file", files[i]);
//         action(true);
//         const res = await postData("mwCeragon/linkbudget/", formData);
//         action(false);
//         if (res.status) {
//             Swal.fire("Success", "Files Uploaded", "success");
//             fetchLinkFiles();
//             setShowError((prev) => ({ ...prev, budget: false }));
//         } else { Swal.fire("Error", res.message, "error"); }
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
//             const res = await fetch(`${ServerURL}/mwCeragon/linkbudget/`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire("Deleted!", data?.message || "File(s) deleted successfully.", "success");
//                 setLinkFiles([]);
//             } else { Swal.fire("Error", data?.message || "Delete failed", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong. Please try again.", "error"); }
//         finally { action(false); }
//     };

//     // ── link budget file 2 ───────────────────────────────────────────────────────
//     const [linkFiles2, setLinkFiles2] = useState([]);

//     const fetchLinkFiles2 = useCallback(async () => {
//         const res = await getData("mwCeragon/upload_traffic/");
//         if (res?.status && Array.isArray(res.files)) setLinkFiles2(res.files);
//         else setLinkFiles2([]);
//     }, []);

//     useEffect(() => { fetchLinkFiles2(); }, [fetchLinkFiles2]);

//     const handleLinkFileUpload2 = async (e) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;
//         const formData = new FormData();
//         for (let i = 0; i < files.length; i++) formData.append("ts_file", files[i]);
//         action(true);
//         const res = await postData("mwCeragon/upload_traffic/", formData);
//         action(false);
//         if (res.status) {
//             Swal.fire("Success", "Files Uploaded", "success");
//             fetchLinkFiles2();
//         } else { Swal.fire("Error", res.message, "error"); }
//     };

//     const handleDeleteLinkFiles2 = async () => {
//         const result = await Swal.fire({
//             title: "Are you sure?", text: "This will permanently delete the second link budget file.",
//             icon: "warning", showCancelButton: true, confirmButtonColor: "#d32f2f",
//             cancelButtonColor: "#1976d2", confirmButtonText: "Yes, delete", cancelButtonText: "Cancel",
//         });
//         if (!result.isConfirmed) return;
//         action(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/upload_traffic/`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire("Deleted!", data?.message || "File(s) deleted successfully.", "success");
//                 setLinkFiles2([]);
//             } else { Swal.fire("Error", data?.message || "Delete failed", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong. Please try again.", "error"); }
//         finally { action(false); }
//     };

//     // ── parameters ───────────────────────────────────────────────────────────────
//     const [parameters, setParameters] = useState([]);
//     const [paramLoading, setParamLoading] = useState(false);
//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [editRow, setEditRow] = useState(null);
//     const [addDialogOpen, setAddDialogOpen] = useState(false);

//     const fetchParameters = useCallback(async () => {
//         setParamLoading(true);
//         try {
//             const res = await getData("mwCeragon/parameter/");
//             if (Array.isArray(res)) setParameters(res);
//             else if (Array.isArray(res?.data)) setParameters(res.data);
//             else if (Array.isArray(res?.results)) setParameters(res.results);
//             else setParameters([]);
//         } catch { setParameters([]); }
//         finally { setParamLoading(false); }
//     }, []);

//     useEffect(() => { fetchParameters(); }, [fetchParameters]);

//     const handleEditParam = (row) => { setEditRow(row); setEditDialogOpen(true); };

//     const handleDeleteParam = async (row) => {
//         const result = await Swal.fire({
//             title: "Delete Parameter?",
//             html: `<span style="font-size:14px;color:#555">Delete <b>${row.parameter}</b>?</span>`,
//             icon: "warning", showCancelButton: true, confirmButtonColor: "#d32f2f",
//             confirmButtonText: "Yes, delete", cancelButtonText: "Cancel",
//         });
//         if (!result.isConfirmed) return;
//         action(true);
//         try {
//             const res = await fetch(`${ServerURL}/mwCeragon/parameter/${row.id}/`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
//             const data = await safeParseJson(res);
//             if (isSuccessResponse(res, data)) {
//                 Swal.fire({ icon: "success", title: "Deleted!", timer: 1600, showConfirmButton: false });
//             } else { Swal.fire("Error", data?.message || "Delete failed.", "error"); }
//         } catch { Swal.fire("Error", "Something went wrong.", "error"); }
//         finally { await fetchParameters(); action(false); }
//     };

//     // ── dump file handler ────────────────────────────────────────────────────────
//     const addFiles = (event, setFileState, errorKey) => {
//         const selected = Array.from(event.target.files || []);
//         if (selected.length === 0) return;
//         setShowError((prev) => ({ ...prev, [errorKey]: false }));
//         setFileState((prev) => {
//             const existingKeys = new Set(prev.map((f) => `${f.name}_${f.size}_${f.lastModified}`));
//             const merged = [...prev];
//             selected.forEach((f) => {
//                 const key = `${f.name}_${f.size}_${f.lastModified}`;
//                 if (!existingKeys.has(key)) {
//                     merged.push(f);
//                     existingKeys.add(key);
//                 }
//             });
//             return merged;
//         });
//         event.target.value = "";
//     };

//     // ── submit ───────────────────────────────────────────────────────────────────
//     const handleSubmit = async () => {
//         const hasDump1 = report_File.length > 0;
//         const hasDump2 = report_File2.length > 0;
//         const hasPlan = selectedPlans.length > 0;
//         const isValid = linkFiles.length > 0 && (hasDump1 || hasDump2) && hasPlan;
//         if (!isValid) {
//             setShowError({ budget: !linkFiles.length, report: !hasDump1 && !hasDump2, plan: !hasPlan });
//             if (!hasPlan) Swal.fire("Validation", "Please search and select at least one Plan ID first.", "warning");
//             return;
//         }
//         action(true);
//         const formData = new FormData();
//         report_File.forEach((file) => formData.append("dump_file1", file));
//         report_File2.forEach((file) => formData.append("dump_file2", file));
//         // Multiple plan ids — sent both as individual entries (plan_id) and as
//         // a comma-joined string (plan_ids) so whichever shape the future API
//         // expects is covered; trim this down once the real contract is known.
//         selectedPlans.forEach((plan) => formData.append("plan_id", plan));
//         formData.append("plan_ids", selectedPlans.join(","));
//         selectedIps.forEach((ip) => formData.append("server_ip", ip));
//         formData.append("server_ips", selectedIps.join(","));
//         const response = await postData("mwCeragon/upload_dump/", formData);
//         action(false);
//         if (response.status) {
//             setDownload(true); setFileData(response.download_url);
//             Swal.fire("Done", response.message, "success");
//         } else { Swal.fire("Oops...", response.message, "error"); }
//     };

//     const handleCancel = () => {
//         setReport_File([]);
//         setReport_File2([]);
//         setSelectedIps([]);
//         setDownload(false);
//         setShowError({ budget: false, report: false, plan: false });
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

//                                 {/* ── PLAN ID SEARCH (multi-select) ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <Typography className={classes.Front_Box_Hading} sx={{ mb: 1 }}>
//                                         Search Plan ID:
//                                     </Typography>
//                                     <PlanIdMultiSearch selectedPlans={selectedPlans} onPlansChange={handlePlansChange} />
//                                     {showError.plan && (
//                                         <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>This Field Is Required!</Typography>
//                                     )}
//                                 </Box>

//                                 {/* ── SERVER IP (auto-suggested from the circle in the selected plan ids) ── */}
//                                 <IpSelectPanel circles={circles} selectedIps={selectedIps} onIpsChange={setSelectedIps} />

//                                 {/* ── LINK BUDGET FILE 1 ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <LinkBudgetRow
//                                         label="Select Link Budget File 1:"
//                                         files={linkFiles}
//                                         onUpload={handleLinkFileUpload}
//                                         onDelete={handleDeleteLinkFiles}
//                                         showError={showError.budget}
//                                     />
//                                 </Box>

//                                 {/* ── LINK BUDGET FILE 2 ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <LinkBudgetRow
//                                         label="Select Link Budget File 2:"
//                                         files={linkFiles2}
//                                         onUpload={handleLinkFileUpload2}
//                                         onDelete={handleDeleteLinkFiles2}
//                                         showError={false}
//                                     />
//                                 </Box>

//                                 {/* ── DUMP A + DUMP B — narrow card, not stretched to full width ── */}
//                                 <Box className={classes.Front_Box} sx={{ maxWidth: 1200, mx: "auto" }}>
//                                     <Typography className={classes.Front_Box_Hading} sx={{ mb: 1.2, textAlign: "center" }}>
//                                         Select Dump Files:
//                                     </Typography>
//                                     <Grid container spacing={1.5}>
//                                         <Grid item xs={6}>
//                                             <DumpFileBox
//                                                 label="Dump A"
//                                                 files={report_File}
//                                                 onAddFiles={(e) => addFiles(e, setReport_File, "report")}
//                                                 onClearAll={() => setReport_File([])}
//                                             />
//                                         </Grid>
//                                         <Grid item xs={6}>
//                                             <DumpFileBox
//                                                 label="Dump B"
//                                                 files={report_File2}
//                                                 onAddFiles={(e) => addFiles(e, setReport_File2, "report")}
//                                                 onClearAll={() => setReport_File2([])}
//                                             />
//                                         </Grid>
//                                     </Grid>
//                                     {showError.report && (
//                                         <Typography color="red" fontWeight={600} fontSize={12.5} mt={1} textAlign="center">
//                                             Select at least one dump file (Dump A or Dump B)!
//                                         </Typography>
//                                     )}
//                                 </Box>

//                                 {/* ── PARAMETER & VALUE TABLE (scrollable) ── */}
//                                 {/* <Box className={classes.Front_Box} sx={{ p: 2 }}>
//                                     <ParameterTable
//                                         rows={parameters}
//                                         loading={paramLoading}
//                                         onEdit={handleEditParam}
//                                         onDelete={handleDeleteParam}
//                                         onAdd={() => setAddDialogOpen(true)}
//                                     />
//                                 </Box> */}

//                             </Stack>

//                             {/* ── ACTION BUTTONS ── */}
//                             <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
//                                 <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}
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

//                     {/* ── DOWNLOAD ── */}
//                     {download && (
//                         <Box textAlign="center" mt={2}>
//                             <a href={fileData} download>
//                                 <Button variant="outlined"
//                                     startIcon={<FileDownloadIcon sx={{ fontSize: 28, color: "green" }} />}
//                                     sx={{ textTransform: "none", fontWeight: 800, fontSize: "20px", fontFamily: "Poppins" }}>
//                                     Download Ceragon Report
//                                 </Button>
//                             </a>
//                         </Box>
//                     )}
//                 </Box>
//             </Slide>

//             {/* ── Dialogs ── */}
//             <AddParamDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onSaved={fetchParameters} />
//             <EditParamDialog
//                 open={editDialogOpen}
//                 onClose={() => { setEditDialogOpen(false); setEditRow(null); }}
//                 row={editRow}
//                 onSaved={fetchParameters}
//             />

//             {loading}
//         </>
//     );
// };

// export default MicrowaveCeragonUpload;

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

// ─── Plan ID helpers ─────────────────────────────────────────────────────────
const planIdToString = (plan) => {
    if (plan == null) return "";
    if (typeof plan === "string") return plan;
    return plan.plan_id ?? plan.id ?? plan.name ?? "";
};

// Minimum characters before we bother hitting the API, and how long we wait
// after the user stops typing. Both are tuned for a fast-feeling search.
const SEARCH_MIN_CHARS = 2;
const SEARCH_DEBOUNCE_MS = 100;
// If a cached result set is smaller than this, we trust it wasn't truncated
// by the server, so we can keep narrowing it locally as the user keeps
// typing instead of firing another request.
const SEARCH_RESULT_CAP = 50;

// ─── Circle → IP lookup (live API) ───────────────────────────────────────────
// Backend contract (confirmed): POST mwCeragon/get_serverip/ with form field
// "plan_id" (comma-separated plan ids), returns:
// [ { "circle": "UPE", "ip_list": ["2401:...:91a", "2401:...:930"] }, ... ]
// This MUST go through `postData` (POST + real API host), not a raw fetch —
// GET on this endpoint returns 405 Method Not Allowed.
const SERVER_IP_ENDPOINT = "mwCeragon/get_serverip/";

const fetchServerIpsForPlans = async (planIdsCsv) => {
    if (!planIdsCsv) return [];
    try {
        const formData = new FormData();
        formData.append("plan_id", planIdsCsv);
        const res = await postData(SERVER_IP_ENDPOINT, formData);
        // Tolerate a couple of likely response shapes, but the confirmed one
        // is a bare array of { circle, ip_list } objects.
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.results)) return res.results;
        return [];
    } catch {
        return [];
    }
};

// ─── Plan ID Multi-Select Search ─────────────────────────────────────────────
const PlanIdMultiSearch = ({ selectedPlans, onPlansChange }) => {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    // Guards against slow/out-of-order responses overwriting a newer, faster
    // one — this is what made the search *feel* slow before (a stale
    // response for "MW" could land after the response for "MW-N" and wipe
    // out the correct, more specific results).
    const requestIdRef = useRef(0);
    // term (lowercased) -> results. Lets repeat/near-repeat queries (typing,
    // backspacing, retyping) skip the network entirely.
    const searchCacheRef = useRef(new Map());

    const runSearch = useCallback(async (term) => {
        const trimmed = term.trim();
        if (trimmed.length < SEARCH_MIN_CHARS) {
            setOptions([]); setShowOptions(false); setHasSearched(false);
            return;
        }
        const key = trimmed.toLowerCase();
        const cache = searchCacheRef.current;

        // 1) Exact cache hit — instant, no network call.
        if (cache.has(key)) {
            setOptions(cache.get(key));
            setShowOptions(true);
            setHasSearched(true);
            return;
        }

        // 2) Narrow down from the closest cached prefix instead of refetching,
        //    as long as that prefix's result set wasn't likely truncated by
        //    the server (i.e. it came back under the cap).
        for (let len = key.length - 1; len >= SEARCH_MIN_CHARS; len--) {
            const prefixKey = key.slice(0, len);
            if (!cache.has(prefixKey)) continue;
            const prefixResults = cache.get(prefixKey);
            if (prefixResults.length < SEARCH_RESULT_CAP) {
                const filtered = prefixResults.filter((opt) =>
                    planIdToString(opt).toLowerCase().includes(key)
                );
                cache.set(key, filtered);
                setOptions(filtered);
                setShowOptions(true);
                setHasSearched(true);
                return;
            }
            break;
        }

        // 3) Fall through to a real API call.
        const currentRequestId = ++requestIdRef.current;
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
            cache.set(key, results);
            setOptions(results);
            setShowOptions(true);
            setHasSearched(true);
        } catch {
            if (currentRequestId === requestIdRef.current) { setOptions([]); setHasSearched(true); }
        }
    }, []);

    useEffect(() => {
        const trimmed = query.trim();
        if (trimmed.length < SEARCH_MIN_CHARS) {
            setOptions([]); setShowOptions(false); setHasSearched(false);
            return;
        }
        const timer = setTimeout(() => runSearch(query), SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [query, runSearch]);

    const isSelected = (planStr) =>
        selectedPlans.some((p) => p.toLowerCase() === planStr.toLowerCase());

    const handlePick = (plan) => {
        const planStr = planIdToString(plan);
        if (!planStr || isSelected(planStr)) { setShowOptions(false); return; }
        onPlansChange([...selectedPlans, planStr]);
        setQuery("");
        setOptions([]);
        setShowOptions(false);
        setHasSearched(false);
    };

    const handleRemove = (planStr) => {
        onPlansChange(selectedPlans.filter((p) => p !== planStr));
    };

    const handleClearAll = () => onPlansChange([]);

    return (
        <Box sx={{ position: "relative" }}>
            <Grid container alignItems="flex-start" spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Search Plan ID"
                        placeholder="e.g. MW-N-MUM-25052023-418"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => { if (options.length > 0) setShowOptions(true); }}
                        size="small" fullWidth sx={fieldSx}
                    />
                </Grid>
                {selectedPlans.length > 0 && (
                    <Grid item xs={12} md>
                        <Box display="flex" flexWrap="wrap" gap={0.8} alignItems="center">
                            {selectedPlans.map((plan) => (
                                <Chip
                                    key={plan}
                                    label={plan}
                                    onDelete={() => handleRemove(plan)}
                                    sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}`, fontWeight: 600 }}
                                />
                            ))}
                            <Typography
                                component="span"
                                onClick={handleClearAll}
                                sx={{ fontSize: 12, color: "#d32f2f", cursor: "pointer", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
                            >
                                Clear all
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
            {showOptions && (
                <Paper elevation={3} sx={{ mt: 1, borderRadius: "8px", maxHeight: 220, overflowY: "auto", border: `1px solid ${TEAL_MID}`, position: "absolute", zIndex: 10, width: { xs: "100%", md: "50%" } }}>
                    {options.length > 0 ? options.map((opt, idx) => {
                        const label = planIdToString(opt);
                        const already = isSelected(label);
                        return (
                            <MenuItem
                                key={label || idx}
                                onClick={() => handlePick(opt)}
                                disabled={already}
                                sx={{ fontSize: 13, display: "flex", justifyContent: "space-between" }}
                            >
                                {label}
                                {already && <Typography component="span" fontSize={11} color={TEAL} ml={1}>Added</Typography>}
                            </MenuItem>
                        );
                    }) : (
                        hasSearched && (
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

// ─── IP Select Panel ──────────────────────────────────────────────────────────
// Whenever the selected Plan IDs change, POSTs them (comma-joined) to
// /mwCeragon/get_serverip/ and lists each returned circle's IPs as
// selectable rows (one pick per circle — see IpSelectPanel below).
// Selections are tracked PER CIRCLE as a single IP string (radio-style, not
// multi-select) because that's the shape the backend's `selected_ips` field
// expects: { "UPE": "2401:4900:24:1c00::930" } — one IP per circle, not an array.
const IpSelectPanel = ({ selectedPlans, selectedIpByCircle, onSelectedIpsChange }) => {
    const [circleGroups, setCircleGroups] = useState([]);
    const [loadingIps, setLoadingIps] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const planIdsCsv = selectedPlans.join(",");

        if (!planIdsCsv) {
            setCircleGroups([]);
            return;
        }

        setLoadingIps(true);
        fetchServerIpsForPlans(planIdsCsv)
            .then((groups) => { if (!cancelled) setCircleGroups(groups); })
            .finally(() => { if (!cancelled) setLoadingIps(false); });

        return () => { cancelled = true; };
    }, [selectedPlans]);

    // Drop any selected IP belonging to a circle that's no longer in the
    // latest response (e.g. the plan id that produced it was removed).
    useEffect(() => {
        const validCircles = new Set(circleGroups.map((g) => g.circle));
        const next = {};
        let changed = false;
        Object.entries(selectedIpByCircle).forEach(([circle, ip]) => {
            if (validCircles.has(circle)) next[circle] = ip;
            else changed = true;
        });
        if (changed) onSelectedIpsChange(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [circleGroups]);

    // Picking an IP replaces any previous pick for that circle (radio
    // behavior). Clicking the already-selected IP deselects it.
    const pickIp = (circle, ip) => {
        const next = { ...selectedIpByCircle };
        if (next[circle] === ip) delete next[circle];
        else next[circle] = ip;
        onSelectedIpsChange(next);
    };

    const removeCircle = (circle) => {
        const next = { ...selectedIpByCircle };
        delete next[circle];
        onSelectedIpsChange(next);
    };

    const handleClearAll = () => onSelectedIpsChange({});

    if (selectedPlans.length === 0) return null;

    const selectedEntries = Object.entries(selectedIpByCircle); // [circle, ip][]
    const totalSelected = selectedEntries.length;

    return (
        <Box
            sx={{
                bgcolor: "#fff",
                borderRadius: "14px",
                p: { xs: 2, md: 2.5 },
                boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} mb={2}>
                <Box display="flex" alignItems="baseline" gap={1}>
                    <Typography fontWeight={800} fontSize={19} color="#1a1a2e">Server IP</Typography>
                    <Typography fontSize={12} color="gray" fontWeight={400}>
                        (auto-suggested from selected Plan ID's circle)
                    </Typography>
                </Box>
                {totalSelected > 0 && (
                    <Chip
                        label={`${totalSelected} IP${totalSelected > 1 ? "s" : ""} selected`}
                        size="small"
                        sx={{ bgcolor: TEAL, color: "#fff", fontWeight: 700, fontSize: 11.5 }}
                    />
                )}
            </Box>

            {loadingIps ? (
                <Box display="flex" alignItems="center" gap={1} py={2}>
                    <CircularProgress size={16} sx={{ color: TEAL }} />
                    <Typography fontSize={13} color="gray">Fetching IPs…</Typography>
                </Box>
            ) : circleGroups.length > 0 ? (
                <Grid container spacing={1.5}>
                    {circleGroups.map((group) => {
                        const pickedIp = selectedIpByCircle[group.circle];
                        return (
                            <Grid item xs={12} sm={6} md={4} key={group.circle}>
                                <Box
                                    sx={{
                                        border: `1.5px solid ${pickedIp ? TEAL : "#e3e8ec"}`,
                                        borderRadius: "12px",
                                        p: 1.6,
                                        height: "100%",
                                        bgcolor: pickedIp ? TEAL_LIGHT + "55" : "#fafbfc",
                                        transition: "border-color 0.15s ease",
                                    }}
                                >
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.2}>
                                        <Chip
                                            label={`Circle: ${group.circle}`}
                                            size="small"
                                            sx={{ bgcolor: TEAL_DARK, color: "#fff", fontWeight: 700, fontSize: 11.5 }}
                                        />
                                        {pickedIp && (
                                            <Typography fontSize={11} fontWeight={700} color={TEAL_DARK}>
                                                selected
                                            </Typography>
                                        )}
                                    </Box>

                                    {(group.ip_list || []).length > 0 ? (
                                        <Box display="flex" flexDirection="column" gap={0.8}>
                                            {group.ip_list.map((ip) => {
                                                const selected = pickedIp === ip;
                                                return (
                                                    <Box
                                                        key={ip}
                                                        onClick={() => pickIp(group.circle, ip)}
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1,
                                                            px: 1.2,
                                                            py: 0.8,
                                                            borderRadius: "8px",
                                                            cursor: "pointer",
                                                            fontSize: 12.5,
                                                            fontWeight: 600,
                                                            wordBreak: "break-all",
                                                            border: `1px solid ${selected ? TEAL_DARK : TEAL_MID}`,
                                                            bgcolor: selected ? TEAL : "#fff",
                                                            color: selected ? "#fff" : "#374151",
                                                            "&:hover": { bgcolor: selected ? TEAL_DARK : TEAL_LIGHT },
                                                        }}
                                                    >
                                                        {/* radio-style indicator: one pick per circle */}
                                                        <Box
                                                            sx={{
                                                                width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                                                                border: `1.5px solid ${selected ? "#fff" : "#9aa3af"}`,
                                                                bgcolor: "transparent",
                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                            }}
                                                        >
                                                            {selected && (
                                                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#fff" }} />
                                                            )}
                                                        </Box>
                                                        <Typography component="span" fontSize={12.5} fontWeight={600} sx={{ wordBreak: "break-all" }}>
                                                            {ip}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    ) : (
                                        <Typography fontSize={12} color="gray" fontStyle="italic">
                                            No IP found for this circle.
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            ) : (
                <Typography fontSize={12.5} color="gray" fontStyle="italic">
                    No IP found for the selected plan(s).
                </Typography>
            )}

            {totalSelected > 0 && (
                <Box
                    sx={{
                        mt: 2,
                        pt: 1.6,
                        borderTop: "1px dashed #e0e8ec",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.8,
                        alignItems: "center",
                    }}
                >
                    <Typography fontSize={12} fontWeight={700} color="#607d8b" mr={0.5}>
                        Selected:
                    </Typography>
                    {selectedEntries.map(([circle, ip]) => (
                        <Chip
                            key={circle}
                            label={`${circle}: ${ip}`}
                            onDelete={() => removeCircle(circle)}
                            sx={{ bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}`, fontWeight: 600, fontSize: 11.5 }}
                        />
                    ))}
                    <Typography
                        component="span"
                        onClick={handleClearAll}
                        sx={{ fontSize: 12, color: "#d32f2f", cursor: "pointer", fontWeight: 700, ml: 0.5, "&:hover": { textDecoration: "underline" } }}
                    >
                        Clear all
                    </Typography>
                </Box>
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

            <TableContainer component={Paper} elevation={0}
                sx={{
                    border: `1px solid ${TEAL_MID}`,
                    borderRadius: "10px",
                    overflow: "hidden",
                    maxHeight: 380,
                    overflowY: "auto",
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
const MicrowaveCeragonUpload = () => {
    const classes = OverAllCss();
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();

    // ── plan id (multi-select) ─────────────────────────────────────────────
    const [selectedPlans, setSelectedPlans] = useState([]);
    const handlePlansChange = (plans) => {
        setSelectedPlans(plans);
        if (plans.length > 0) setShowError((prev) => ({ ...prev, plan: false }));
    };

    // ── ONE IP selected per circle, keyed by circle: { "UPE": "2401:...:930" }
    //    This is exactly the shape the backend's `selected_ips` field expects. ──
    const [selectedIpByCircle, setSelectedIpByCircle] = useState({});

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
        const res = await getData("mwCeragon/upload_traffic/");
        if (res?.status && Array.isArray(res.files)) setLinkFiles2(res.files);
        else setLinkFiles2([]);
    }, []);

    useEffect(() => { fetchLinkFiles2(); }, [fetchLinkFiles2]);

    const handleLinkFileUpload2 = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) formData.append("ts_file", files[i]);
        action(true);
        const res = await postData("mwCeragon/upload_traffic/", formData);
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
            const res = await fetch(`${ServerURL}/mwCeragon/upload_traffic/`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
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
        const hasPlan = selectedPlans.length > 0;
        const isValid = linkFiles.length > 0 && (hasDump1 || hasDump2) && hasPlan;
        if (!isValid) {
            setShowError({ budget: !linkFiles.length, report: !hasDump1 && !hasDump2, plan: !hasPlan });
            if (!hasPlan) Swal.fire("Validation", "Please search and select at least one Plan ID first.", "warning");
            return;
        }
        action(true);
        const formData = new FormData();
        report_File.forEach((file) => formData.append("dump_file1", file));
        report_File2.forEach((file) => formData.append("dump_file2", file));
        // Multiple plan ids — sent as a single comma-joined string, matching
        // the backend's `plan_id_str.split(",")` handling.
        formData.append("plan_id", selectedPlans.join(","));
        // Backend expects a JSON dict keyed by circle, one IP each: {"UPE": "ip"}
        formData.append("selected_ips", JSON.stringify(selectedIpByCircle));
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
        setSelectedIpByCircle({});
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
                            <Box className={classes.Box_Hading}>Make Microwave(Ceragon) Summary</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>

                                {/* ── PLAN ID SEARCH (multi-select) ── */}
                                <Box className={classes.Front_Box}>
                                    <Typography className={classes.Front_Box_Hading} sx={{ mb: 1 }}>
                                        Search Plan ID:
                                    </Typography>
                                    <PlanIdMultiSearch selectedPlans={selectedPlans} onPlansChange={handlePlansChange} />
                                    {showError.plan && (
                                        <Typography color="red" fontWeight={600} fontSize={13} mt={0.5}>This Field Is Required!</Typography>
                                    )}
                                </Box>

                                {/* ── SERVER IP (auto-suggested via POST /get_serverip/ using plan_id) ── */}
                                <IpSelectPanel
                                    selectedPlans={selectedPlans}
                                    selectedIpByCircle={selectedIpByCircle}
                                    onSelectedIpsChange={setSelectedIpByCircle}
                                />

                                {/* ── LINK BUDGET FILE 1 ── */}
                                <Box className={classes.Front_Box}>
                                    <LinkBudgetRow
                                        label="Select Link Budget File 1:"
                                        files={linkFiles}
                                        onUpload={handleLinkFileUpload}
                                        onDelete={handleDeleteLinkFiles}
                                        showError={showError.budget}
                                    />
                                </Box>

                                {/* ── LINK BUDGET FILE 2 ── */}
                                <Box className={classes.Front_Box}>
                                    <LinkBudgetRow
                                        label="Select Link Budget File 2:"
                                        files={linkFiles2}
                                        onUpload={handleLinkFileUpload2}
                                        onDelete={handleDeleteLinkFiles2}
                                        showError={false}
                                    />
                                </Box>

                                {/* ── DUMP A + DUMP B — narrow card, not stretched to full width ── */}
                                <Box className={classes.Front_Box} sx={{ maxWidth: 1200, mx: "auto" }}>
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
                                </Box>

                                {/* ── PARAMETER & VALUE TABLE (scrollable) ── */}
                                {/* <Box className={classes.Front_Box} sx={{ p: 2 }}>
                                    <ParameterTable
                                        rows={parameters}
                                        loading={paramLoading}
                                        onEdit={handleEditParam}
                                        onDelete={handleDeleteParam}
                                        onAdd={() => setAddDialogOpen(true)}
                                    />
                                </Box> */}

                            </Stack>

                            {/* ── ACTION BUTTONS ── */}
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}
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

                    {/* ── DOWNLOAD ── */}
                    {download && (
                        <Box textAlign="center" mt={2}>
                            <a href={fileData} download>
                                <Button variant="outlined"
                                    startIcon={<FileDownloadIcon sx={{ fontSize: 28, color: "green" }} />}
                                    sx={{ textTransform: "none", fontWeight: 800, fontSize: "20px", fontFamily: "Poppins" }}>
                                    Download Ceragon Report
                                </Button>
                            </a>
                        </Box>
                    )}
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

export default MicrowaveCeragonUpload;