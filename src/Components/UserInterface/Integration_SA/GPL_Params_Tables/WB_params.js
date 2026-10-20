// import React, { useState, useMemo, useEffect, useCallback } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Paper, IconButton, TextField, Tooltip, Chip, CircularProgress,
//     Dialog, DialogTitle, DialogContent, DialogActions,
// } from "@mui/material";
// import {
//     Upload as UploadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
//     TuneOutlined as TuneIcon,
//     Search as SearchIcon,
//     Delete as DeleteIcon,
//     Edit as EditIcon,
//     Add as AddIcon,
//     Save as SaveIcon,
//     Close as CloseIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// // ─── theme constants (matches the Ceragon parameter page) ───────────────────
// const TEAL = "#2a77bf";
// const TEAL_DARK = "#28538c";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID = "#b2dfdb";

// // ─── API base ────────────────────────────────────────────────────────────────
// // Production base URL — used directly (no more postData/ServerURL helper),
// // so this page talks to the live API regardless of what ServerURL resolves
// // to elsewhere in the app.
// const BASE_URL = "https://commtoolapi.mcpspmis.com/";
// const WB_ENDPOINT = `${BASE_URL}wb_macro/wb_fix_para/`;

// const fieldSx = {
//     "& .MuiOutlinedInput-root": {
//         borderRadius: "8px",
//         fontSize: 13,
//         "&:hover fieldset": { borderColor: TEAL },
//         "&.Mui-focused fieldset": { borderColor: TEAL },
//     },
//     "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
// };

// // Pull an array of row-objects out of whatever shape the API responds with.
// // Also handles a single object being returned (wraps it in an array).
// const extractRows = (res) => {
//     if (Array.isArray(res)) return res;
//     if (Array.isArray(res?.data)) return res.data;
//     if (Array.isArray(res?.results)) return res.results;
//     if (Array.isArray(res?.rows)) return res.rows;
//     if (res && typeof res === "object" && Object.keys(res).length > 0) return [res];
//     return [];
// };

// // DB bookkeeping fields we don't want cluttering the table by default.
// // The backend returns snake_case keys (mo, mo_id, technology,
// // audit_if_cell_dep_type, parameter, value_internal, id, created_at) —
// // everything except this hidden set is shown, so a differently-shaped
// // response (different circle, different columns) still renders correctly.
// const HIDDEN_COLUMNS = new Set(["id", "created_at", "updated_at"]);

// // "value_internal" -> "Value Internal", "audit_if_cell_dep_type" -> "Audit If Cell Dep Type"
// const humanizeHeader = (key) =>
//     key
//         .split("_")
//         .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
//         .join(" ");

// // Cells that are short get the little pill/chip treatment (like IDU / Value
// // in the Ceragon table); long free-text cells stay as plain text so they
// // don't overflow into an ugly pill.
// const CHIP_MAX_LEN = 24;

// // ─── Excel-grid look (colored header) ───────────────────────────────────────
// const EXCEL_BORDER = "#c7ddf0";
// const EXCEL_HEADER_BG = TEAL;
// const EXCEL_ROWHEAD_BG = "#eef6fc";

// const excelHeaderCellSx = (width) => ({
//     bgcolor: EXCEL_HEADER_BG,
//     color: "#fff",
//     fontWeight: 700,
//     fontSize: 12.5,
//     py: 1,
//     px: 1.2,
//     whiteSpace: "nowrap",
//     letterSpacing: ".02em",
//     position: "sticky",
//     top: 0,
//     zIndex: 2,
//     borderBottom: `2px solid ${TEAL_DARK}`,
//     ...(width ? { width } : {}),
// });

// const excelRowHeaderCellSx = {
//     bgcolor: EXCEL_ROWHEAD_BG,
//     color: "#4a5568",
//     fontSize: 12,
//     fontWeight: 600,
//     textAlign: "center",
// };

// const excelBodyCellSx = {
//     fontSize: 13,
//     color: "#1a1a1a",
//     py: 0.7,
//     px: 1.2,
//     whiteSpace: "nowrap",
//     bgcolor: "#fff",
// };

// // Safely parse a fetch Response as JSON without throwing on empty bodies.
// const safeParseJson = async (res) => {
//     const text = await res.text();
//     if (!text) return {};
//     try { return JSON.parse(text); } catch { return {}; }
// };

// // ─── Add / Edit Row Dialog ────────────────────────────────────────────────────
// // Generic on purpose: it builds one text field per current table column, since
// // columns are read dynamically from the API response rather than hardcoded.
// // mode: "add" | "edit". initialRow is only used for "edit".
// const RowFormDialog = ({ open, mode, columns, initialRow, saving, onClose, onSave }) => {
//     const [values, setValues] = useState({});

//     useEffect(() => {
//         if (!open) return;
//         if (mode === "edit" && initialRow) {
//             const seed = {};
//             columns.forEach((col) => { seed[col] = initialRow[col] ?? ""; });
//             setValues(seed);
//         } else {
//             const seed = {};
//             columns.forEach((col) => { seed[col] = ""; });
//             setValues(seed);
//         }
//     }, [open, mode, initialRow, columns]);

//     const handleChange = (col, val) => setValues((prev) => ({ ...prev, [col]: val }));

//     const handleSave = async () => {
//         const ok = await onSave(values);
//         if (ok !== false) onClose();
//     };

//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock
//             PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
//             <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #8cc6eb)` }} />
//             <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                     {mode === "add" ? <AddIcon sx={{ color: TEAL, fontSize: 20 }} /> : <EditIcon sx={{ color: TEAL, fontSize: 20 }} />}
//                     <Typography fontWeight={700} fontSize={16}>{mode === "add" ? "Add Parameter" : "Edit Parameter"}</Typography>
//                 </Box>
//                 <IconButton size="small" onClick={onClose}
//                     sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
//                     <CloseIcon sx={{ fontSize: 16 }} />
//                 </IconButton>
//             </DialogTitle>
//             <DialogContent sx={{ pt: 3, pb: 1, display: "flex", flexDirection: "column", gap: 1.4 }}>
//                 {columns.map((col) => (
//                     <TextField
//                         key={col}
//                         label={humanizeHeader(col)}
//                         value={values[col] ?? ""}
//                         onChange={(e) => handleChange(col, e.target.value)}
//                         size="small"
//                         fullWidth
//                         disabled={saving}
//                         sx={fieldSx}
//                     />
//                 ))}
//             </DialogContent>
//             <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
//                 <Button onClick={onClose} disabled={saving} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>Cancel</Button>
//                 <Button variant="contained" onClick={handleSave} disabled={saving}
//                     startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
//                     sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5 }}>
//                     {saving ? "Saving…" : (mode === "add" ? "Add" : "Update")}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// // Fallback field set for the Add dialog when no data has loaded yet (so the
// // Add button doesn't have to wait on the initial GET to become usable).
// // Matches the shape the backend returns for WB fixed parameters.
// const DEFAULT_COLUMNS = ["mo", "mo_id", "technology", "audit_if_cell_dep_type", "parameter", "value_internal"];

// const WB_params = () => {
//     const classes = OverAllCss();
//     const navigate = useNavigate();
//     const { loading, action } = useLoadingDialog();

//     const [rows, setRows] = useState([]);
//     const [columns, setColumns] = useState([]); // column names, read from the data itself
//     const [fileName, setFileName] = useState("");
//     const [uploading, setUploading] = useState(false);
//     const [paramLoading, setParamLoading] = useState(false);
//     const [filter, setFilter] = useState("");
//     const [addDialogOpen, setAddDialogOpen] = useState(false);
//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [editRow, setEditRow] = useState(null);
//     const [editIdx, setEditIdx] = useState(null);
//     const [saving, setSaving] = useState(false);

//     // ── auto-load existing parameters from the API on mount ──────────────────
//     const fetchParameters = useCallback(async () => {
//         setParamLoading(true);
//         try {
//             const res = await fetch(WB_ENDPOINT, { method: "GET" });
//             const json = await safeParseJson(res);
//             const data = extractRows(json);
//             if (data.length > 0) {
//                 setColumns(Object.keys(data[0]).filter((k) => !HIDDEN_COLUMNS.has(k)));
//                 setRows(data);
//             } else {
//                 setColumns([]);
//                 setRows([]);
//             }
//         } catch {
//             setColumns([]);
//             setRows([]);
//             Swal.fire("Error", "Could not load parameters from the server.", "error");
//         } finally {
//             setParamLoading(false);
//         }
//     }, []);

//     useEffect(() => { fetchParameters(); }, [fetchParameters]);

//     // ── manual upload (button is currently hidden below, kept wired in case
//     //    it's re-enabled later) ───────────────────────────────────────────────
//     const handleFileUpload = async (e) => {
//         const file = e.target.files?.[0];
//         e.target.value = ""; // allow re-selecting the same file later
//         if (!file) return;

//         setFileName(file.name);
//         setUploading(true);
//         action(true);
//         try {
//             const formData = new FormData();
//             formData.append("file", file);

//             const res = await fetch(WB_ENDPOINT, { method: "POST", body: formData });
//             const json = await safeParseJson(res);
//             const data = extractRows(json);

//             if (!res.ok || data.length === 0) {
//                 Swal.fire("No Data", json?.message || "The file was read but no rows were found.", "warning");
//                 return;
//             }

//             const cols = Object.keys(data[0]).filter((k) => !HIDDEN_COLUMNS.has(k));
//             setColumns(cols);
//             setRows(data);
//             Swal.fire({ icon: "success", title: `Loaded ${data.length} rows`, timer: 1600, showConfirmButton: false });
//         } catch (err) {
//             Swal.fire("Error", "Something went wrong while uploading/reading the file.", "error");
//         } finally {
//             setUploading(false);
//             action(false);
//         }
//     };

//     const handleClear = () => {
//         setRows([]);
//         setColumns([]);
//         setFileName("");
//         setFilter("");
//     };

//     const handleDeleteRow = (idx) => {
//         // Local-only removal from the current view — there's no delete API
//         // for individual parameter rows yet. Wire this up to a real DELETE
//         // endpoint once one exists.
//         setRows((prev) => prev.filter((_, i) => i !== idx));
//     };

//     const handleOpenEdit = (row, idx) => {
//         setEditRow(row);
//         setEditIdx(idx);
//         setEditDialogOpen(true);
//     };

//     // Add: POST a single row to the same endpoint used for bulk upload.
//     // Returns false on failure so the dialog stays open for another try.
//     const handleAddSave = async (values) => {
//         setSaving(true);
//         try {
//             const res = await fetch(WB_ENDPOINT, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(values),
//             });
//             const json = await safeParseJson(res);
//             if (!res.ok) {
//                 Swal.fire("Error", json?.message || json?.detail || "Add failed.", "error");
//                 return false;
//             }
//             await fetchParameters(); // reload from backend so the table matches what's actually stored
//             Swal.fire({ icon: "success", title: "Added", timer: 1400, showConfirmButton: false });
//             return true;
//         } catch {
//             Swal.fire("Error", "Something went wrong while adding the parameter.", "error");
//             return false;
//         } finally {
//             setSaving(false);
//         }
//     };

//     // Edit: PUT to the row's own URL (assumes REST convention <endpoint>/<id>/).
//     // Returns false on failure so the dialog stays open for another try.
//     const handleEditSave = async (values) => {
//         if (!editRow?.id) {
//             Swal.fire("Error", "This row has no ID to update — it may not have been saved to the backend yet.", "error");
//             return false;
//         }
//         setSaving(true);
//         try {
//             const res = await fetch(`${WB_ENDPOINT}${editRow.id}/`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(values),
//             });
//             const json = await safeParseJson(res);
//             if (!res.ok) {
//                 Swal.fire("Error", json?.message || json?.detail || "Update failed.", "error");
//                 return false;
//             }
//             await fetchParameters();
//             Swal.fire({ icon: "success", title: "Updated", timer: 1400, showConfirmButton: false });
//             return true;
//         } catch {
//             Swal.fire("Error", "Something went wrong while updating the parameter.", "error");
//             return false;
//         } finally {
//             setSaving(false);
//             setEditRow(null);
//             setEditIdx(null);
//         }
//     };

//     const filteredRows = useMemo(() => {
//         const q = filter.trim().toLowerCase();
//         if (!q) return rows;
//         return rows.filter((row) =>
//             columns.some((col) => String(row[col] ?? "").toLowerCase().includes(q))
//         );
//     }, [rows, columns, filter]);

//     return (
//         <>
//             <Box m={1} ml={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Typography color="text.primary">WB Params</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Slide direction="left" in timeout={1000}>
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: "82%", xs: "100%" } }}>
//                             <Box className={classes.Box_Hading}>WB GPL Fixed Parameters</Box>

//                             <Stack spacing={2} sx={{ mt: "-40px" }}>
//                                 {/* ── UPLOAD (hidden for now — page auto-loads from the API instead) ── */}
//                                 {/* <Box className={classes.Front_Box}>
//                                     <Typography className={classes.Front_Box_Hading} sx={{ mb: 1, fontWeight: 700, fontSize: 16 }}>
//                                         Upload GPL Fixed Parameter Excel
//                                     </Typography>
//                                     <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
//                                         <Button
//                                             variant="contained"
//                                             component="label"
//                                             disabled={uploading}
//                                             startIcon={uploading ? <CircularProgress size={14} color="inherit" /> : <UploadIcon />}
//                                             sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "uppercase", fontWeight: 700 }}
//                                         >
//                                             {uploading ? "Uploading…" : "Select File"}
//                                             <input hidden type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
//                                         </Button>

//                                         {fileName ? (
//                                             <Typography fontWeight={600} color="green" fontSize={13}>{fileName}</Typography>
//                                         ) : (
//                                             <Typography color="gray" fontSize={13}>No file uploaded.</Typography>
//                                         )}

//                                         {rows.length > 0 && (
//                                             <Button
//                                                 variant="outlined"
//                                                 size="small"
//                                                 onClick={handleClear}
//                                                 startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
//                                                 sx={{ textTransform: "none", fontWeight: 600, borderColor: "#e0e0e0", color: "text.secondary" }}
//                                             >
//                                                 Clear
//                                             </Button>
//                                         )}
//                                     </Stack>
//                                 </Box> */}

//                                 {/* ── TABLE ── */}
//                                 <Box className={classes.Front_Box} sx={{ p: 2 }}>
//                                     <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5} flexWrap="wrap" gap={1}>
//                                         <Box display="flex" alignItems="center" gap={0.8}>
//                                             <TuneIcon sx={{ fontSize: 17, color: TEAL }} />
//                                             <Typography fontSize={13.5} fontWeight={700} color="#1a1a2e">Parameters &amp; Values</Typography>
//                                             {rows.length > 0 && (
//                                                 <Chip label={`${filteredRows.length} entries`} size="small"
//                                                     sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
//                                             )}
//                                         </Box>
//                                         <Box display="flex" alignItems="center" gap={1}>
//                                             <TextField
//                                                 placeholder="Search…"
//                                                 value={filter}
//                                                 onChange={(e) => setFilter(e.target.value)}
//                                                 size="small"
//                                                 InputProps={{ startAdornment: <SearchIcon sx={{ fontSize: 16, color: "#9aa3af", mr: 0.5 }} /> }}
//                                                 sx={{ ...fieldSx, width: 220, "& .MuiOutlinedInput-root": { ...fieldSx["& .MuiOutlinedInput-root"], height: 32 } }}
//                                             />
//                                             <Tooltip title="Add parameter" arrow>
//                                                 <IconButton
//                                                     size="small"
//                                                     onClick={() => setAddDialogOpen(true)}
//                                                     sx={{ bgcolor: TEAL_LIGHT, color: TEAL, borderRadius: "8px", "&:hover": { bgcolor: TEAL_MID } }}
//                                                 >
//                                                     <AddIcon sx={{ fontSize: 18 }} />
//                                                 </IconButton>
//                                             </Tooltip>
//                                         </Box>
//                                     </Box>

//                                     <TableContainer component={Paper} elevation={0}
//                                         sx={{
//                                             border: `1px solid ${EXCEL_BORDER}`,
//                                             borderRadius: "4px",
//                                             overflow: "auto",
//                                             maxHeight: 560,
//                                             "&::-webkit-scrollbar": { width: 8, height: 8 },
//                                             "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
//                                             "&::-webkit-scrollbar-thumb": { background: "#c7c7c7", borderRadius: 4 },
//                                             "&::-webkit-scrollbar-thumb:hover": { background: "#a8a8a8" },
//                                         }}>
//                                         <Table
//                                             size="small"
//                                             stickyHeader
//                                             sx={{
//                                                 borderCollapse: "collapse",
//                                                 fontFamily: "Calibri, Arial, sans-serif",
//                                                 "& td, & th": { border: `1px solid ${EXCEL_BORDER}` },
//                                             }}
//                                         >
//                                             <TableHead>
//                                                 <TableRow>
//                                                     <TableCell sx={excelHeaderCellSx(48)}>SN</TableCell>
//                                                     {columns.map((col) => (
//                                                         <TableCell key={col} sx={excelHeaderCellSx()}>{humanizeHeader(col)}</TableCell>
//                                                     ))}
//                                                     {columns.length > 0 && (
//                                                         <TableCell sx={excelHeaderCellSx(96)}>Actions</TableCell>
//                                                     )}
//                                                 </TableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 {paramLoading && (
//                                                     <TableRow>
//                                                         <TableCell colSpan={99} align="center" sx={{ py: 3, border: 0 }}>
//                                                             <CircularProgress size={22} sx={{ color: TEAL }} />
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 )}
//                                                 {!paramLoading && columns.length === 0 && (
//                                                     <TableRow>
//                                                         <TableCell colSpan={99} align="center" sx={{ py: 4, color: "#aaa", fontSize: 13, border: 0 }}>
//                                                             No parameters found.
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 )}
//                                                 {!paramLoading && columns.length > 0 && filteredRows.length === 0 && (
//                                                     <TableRow>
//                                                         <TableCell colSpan={columns.length + 2} align="center" sx={{ py: 3, color: "#aaa", fontSize: 13, border: 0 }}>
//                                                             {filter.trim() ? `No rows match "${filter.trim()}".` : "No rows found."}
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 )}
//                                                 {!paramLoading && filteredRows.map((row, idx) => (
//                                                     <TableRow key={idx} hover sx={{ "&:hover": { bgcolor: "#eef6fc" } }}>
//                                                         <TableCell sx={excelRowHeaderCellSx}>{idx + 1}</TableCell>
//                                                         {columns.map((col) => {
//                                                             const val = row[col];
//                                                             const isBlank =
//                                                                 val === null ||
//                                                                 val === undefined ||
//                                                                 val === "" ||
//                                                                 String(val).trim().toLowerCase() === "nan";
//                                                             const text = isBlank ? "" : String(val);
//                                                             return (
//                                                                 <TableCell key={col} sx={excelBodyCellSx}>
//                                                                     {text}
//                                                                 </TableCell>
//                                                             );
//                                                         })}
//                                                         <TableCell sx={{ ...excelBodyCellSx, textAlign: "center" }}>
//                                                             <Tooltip title="Edit" arrow>
//                                                                 <IconButton size="small" onClick={() => handleOpenEdit(row, idx)}
//                                                                     sx={{ color: TEAL, "&:hover": { bgcolor: TEAL_LIGHT } }}>
//                                                                     <EditIcon sx={{ fontSize: 16 }} />
//                                                                 </IconButton>
//                                                             </Tooltip>
//                                                             <Tooltip title="Remove from view" arrow>
//                                                                 <IconButton size="small" onClick={() => handleDeleteRow(idx)}
//                                                                     sx={{ color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}>
//                                                                     <DeleteIcon sx={{ fontSize: 16 }} />
//                                                                 </IconButton>
//                                                             </Tooltip>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ))}
//                                             </TableBody>
//                                         </Table>
//                                     </TableContainer>
//                                 </Box>
//                             </Stack>
//                         </Box>
//                     </Box>
//                 </Box>
//             </Slide>

//             <RowFormDialog
//                 open={addDialogOpen}
//                 mode="add"
//                 columns={columns.length > 0 ? columns : DEFAULT_COLUMNS}
//                 initialRow={null}
//                 saving={saving}
//                 onClose={() => setAddDialogOpen(false)}
//                 onSave={handleAddSave}
//             />
//             <RowFormDialog
//                 open={editDialogOpen}
//                 mode="edit"
//                 columns={columns}
//                 initialRow={editRow}
//                 saving={saving}
//                 onClose={() => { setEditDialogOpen(false); setEditRow(null); setEditIdx(null); }}
//                 onSave={handleEditSave}
//             />

//             {loading}
//         </>
//     );
// };

// export default WB_params;


import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, TextField, Tooltip, Chip, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import {
    KeyboardArrowRight as KeyboardArrowRightIcon,
    TuneOutlined as TuneIcon,
    Search as SearchIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Save as SaveIcon,
    Close as CloseIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ─── Theme Constants ────────────────────────────────────────────────────────
const TEAL = "#2a77bf";
const TEAL_DARK = "#28538c";
const TEAL_LIGHT = "#e0f2f1";
const TEAL_MID = "#b2dfdb";

// ─── API Base ────────────────────────────────────────────────────────────────
const BASE_URL = "https://commtoolapi.mcpspmis.com/";
const WB_ENDPOINT = `${BASE_URL}wb_macro/wb_fix_para/`;

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        fontSize: 13,
        "&:hover fieldset": { borderColor: TEAL },
        "&.Mui-focused fieldset": { borderColor: TEAL },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
};

const extractRows = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.rows)) return res.rows;
    if (res && typeof res === "object" && Object.keys(res).length > 0) return [res];
    return [];
};

const HIDDEN_COLUMNS = new Set(["id", "created_at", "updated_at"]);

const humanizeHeader = (key) =>
    key
        .split("_")
        .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
        .join(" ");

// ─── Excel-grid Styles ──────────────────────────────────────────────────────
const EXCEL_BORDER = "#c7ddf0";
const EXCEL_HEADER_BG = TEAL;
const EXCEL_ROWHEAD_BG = "#eef6fc";

const excelHeaderCellSx = (width) => ({
    bgcolor: EXCEL_HEADER_BG,
    color: "#fff",
    fontWeight: 700,
    fontSize: 12.5,
    py: 1,
    px: 1.2,
    whiteSpace: "nowrap",
    letterSpacing: ".02em",
    position: "sticky",
    top: 0,
    zIndex: 2,
    borderBottom: `2px solid ${TEAL_DARK}`,
    ...(width ? { width } : {}),
});

const excelRowHeaderCellSx = {
    bgcolor: EXCEL_ROWHEAD_BG,
    color: "#4a5568",
    fontSize: 12,
    fontWeight: 600,
    textAlign: "center",
};

const excelBodyCellSx = {
    fontSize: 13,
    color: "#1a1a1a",
    py: 0.7,
    px: 1.2,
    whiteSpace: "nowrap",
    bgcolor: "#fff",
};

const safeParseJson = async (res) => {
    const text = await res.text();
    if (!text) return {};
    try { return JSON.parse(text); } catch { return {}; }
};

// ─── Add / Edit Row Dialog ────────────────────────────────────────────────────
const RowFormDialog = React.memo(({ open, mode, columns, initialRow, saving, onClose, onSave }) => {
    const [values, setValues] = useState({});

    useEffect(() => {
        if (!open) return;
        const seed = {};
        columns.forEach((col) => {
            seed[col] = mode === "edit" && initialRow ? (initialRow[col] ?? "") : "";
        });
        setValues(seed);
    }, [open, mode, initialRow, columns]);

    const handleChange = useCallback((col, val) => {
        setValues((prev) => ({ ...prev, [col]: val }));
    }, []);

    const handleSave = async () => {
        const ok = await onSave(values);
        if (ok !== false) onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock
            PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
            <Box sx={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #8cc6eb)` }} />
            <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box display="flex" alignItems="center" gap={1}>
                    {mode === "add" ? <AddIcon sx={{ color: TEAL, fontSize: 20 }} /> : <EditIcon sx={{ color: TEAL, fontSize: 20 }} />}
                    <Typography fontWeight={700} fontSize={16}>{mode === "add" ? "Add Parameter" : "Edit Parameter"}</Typography>
                </Box>
                <IconButton size="small" onClick={onClose}
                    sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
                    <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3, pb: 1, display: "flex", flexDirection: "column", gap: 1.4 }}>
                {columns.map((col) => (
                    <TextField
                        key={col}
                        label={humanizeHeader(col)}
                        value={values[col] ?? ""}
                        onChange={(e) => handleChange(col, e.target.value)}
                        size="small"
                        fullWidth
                        disabled={saving}
                        sx={fieldSx}
                    />
                ))}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
                <Button onClick={onClose} disabled={saving} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} disabled={saving}
                    startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
                    sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, borderRadius: "8px", px: 2.5 }}>
                    {saving ? "Saving…" : (mode === "add" ? "Add" : "Update")}
                </Button>
            </DialogActions>
        </Dialog>
    );
});

const DEFAULT_COLUMNS = ["mo", "mo_id", "technology", "audit_if_cell_dep_type", "parameter", "value_internal"];

const WB_params = () => {
    const classes = OverAllCss();
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();

    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [filter, setFilter] = useState("");
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);
    const [saving, setSaving] = useState(false);
    const [paramLoading, setParamLoading] = useState(false);

    // Optimized Fetch Parameters
    const fetchParameters = useCallback(async () => {
        setParamLoading(true);
        try {
            const res = await fetch(WB_ENDPOINT, { method: "GET" });
            const json = await safeParseJson(res);
            const data = extractRows(json);
            if (data.length > 0) {
                setColumns(Object.keys(data[0]).filter((k) => !HIDDEN_COLUMNS.has(k)));
                setRows(data);
            } else {
                setColumns([]);
                setRows([]);
            }
        } catch {
            setColumns([]);
            setRows([]);
            Swal.fire("Error", "Could not load parameters from the server.", "error");
        } finally {
            setParamLoading(false);
        }
    }, []);

    useEffect(() => { fetchParameters(); }, [fetchParameters]);

    // ─── Optimized Fast Delete with SweetAlert & Optimistic UI Update ───────
    const handleDeleteRow = useCallback(async (row, idx) => {
        const result = await Swal.fire({
            title: "Delete this parameter?",
            html: row?.parameter
                ? `<span style="font-size:14px;color:#555">Delete <b>${row.parameter}</b>? This cannot be undone.</span>`
                : "This cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d32f2f",
            cancelButtonColor: "#1976d2",
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) return;

        if (!row?.id) {
            setRows((prev) => prev.filter((_, i) => i !== idx));
            return;
        }

        // Optimistically remove from UI immediately for speed
        const previousRows = [...rows];
        setRows((prev) => prev.filter((r) => r.id !== row.id));

        try {
            const res = await fetch(`${WB_ENDPOINT}${row.id}/`, { method: "DELETE" });
            if (!res.ok) {
                // Rollback if failed
                setRows(previousRows);
                const json = await safeParseJson(res);
                Swal.fire("Error", json?.message || json?.detail || "Delete failed.", "error");
                return;
            }
            Swal.fire({ icon: "success", title: "Deleted!", timer: 1200, showConfirmButton: false });
        } catch {
            // Rollback on network error
            setRows(previousRows);
            Swal.fire("Error", "Something went wrong while deleting.", "error");
        }
    }, [rows]);

    const handleOpenEdit = useCallback((row) => {
        setEditRow(row);
        setEditDialogOpen(true);
    }, []);

    const handleAddSave = async (values) => {
        setSaving(true);
        try {
            const res = await fetch(WB_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const json = await safeParseJson(res);
            if (!res.ok) {
                Swal.fire("Error", json?.message || json?.detail || "Add failed.", "error");
                return false;
            }
            await fetchParameters();
            Swal.fire({ icon: "success", title: "Added", timer: 1400, showConfirmButton: false });
            return true;
        } catch {
            Swal.fire("Error", "Something went wrong while adding the parameter.", "error");
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleEditSave = async (values) => {
        if (!editRow?.id) {
            Swal.fire("Error", "This row has no ID to update.", "error");
            return false;
        }
        setSaving(true);
        try {
            const res = await fetch(`${WB_ENDPOINT}${editRow.id}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const json = await safeParseJson(res);
            if (!res.ok) {
                Swal.fire("Error", json?.message || json?.detail || "Update failed.", "error");
                return false;
            }
            await fetchParameters();
            Swal.fire({ icon: "success", title: "Updated", timer: 1400, showConfirmButton: false });
            return true;
        } catch {
            Swal.fire("Error", "Something went wrong while updating the parameter.", "error");
            return false;
        } finally {
            setSaving(false);
            setEditRow(null);
        }
    };

    const filteredRows = useMemo(() => {
        const q = filter.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((row) =>
            columns.some((col) => String(row[col] ?? "").toLowerCase().includes(q))
        );
    }, [rows, columns, filter]);

    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")} sx={{ cursor: "pointer" }}>Tools</Link>
                    <Typography color="text.primary">WB Params</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "82%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>WB GPL Fixed Parameters</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>
                                <Box className={classes.Front_Box} sx={{ p: 2 }}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5} flexWrap="wrap" gap={1}>
                                        <Box display="flex" alignItems="center" gap={0.8}>
                                            <TuneIcon sx={{ fontSize: 17, color: TEAL }} />
                                            <Typography fontSize={13.5} fontWeight={700} color="#1a1a2e">Parameters &amp; Values</Typography>
                                            {/* {rows.length > 0 && (
                                                <Chip label={`${filteredRows.length} entries`} size="small"
                                                    sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
                                            )} */}
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <TextField
                                                placeholder="Search…"
                                                value={filter}
                                                onChange={(e) => setFilter(e.target.value)}
                                                size="small"
                                                InputProps={{ startAdornment: <SearchIcon sx={{ fontSize: 16, color: "#9aa3af", mr: 0.5 }} /> }}
                                                sx={{ ...fieldSx, width: 220, "& .MuiOutlinedInput-root": { ...fieldSx["& .MuiOutlinedInput-root"], height: 32 } }}
                                            />
                                            <Tooltip title="Add parameter" arrow>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setAddDialogOpen(true)}
                                                    sx={{ bgcolor: TEAL_LIGHT, color: TEAL, borderRadius: "8px", "&:hover": { bgcolor: TEAL_MID } }}
                                                >
                                                    <AddIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>

                                    <TableContainer component={Paper} elevation={0}
                                        sx={{
                                            border: `1px solid ${EXCEL_BORDER}`,
                                            borderRadius: "4px",
                                            overflow: "auto",
                                            maxHeight: 560,
                                        }}>
                                        <Table size="small" stickyHeader sx={{ borderCollapse: "collapse", fontFamily: "Calibri, Arial, sans-serif", "& td, & th": { border: `1px solid ${EXCEL_BORDER}` } }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={excelHeaderCellSx(48)}>SN</TableCell>
                                                    {columns.map((col) => (
                                                        <TableCell key={col} sx={excelHeaderCellSx()}>{humanizeHeader(col)}</TableCell>
                                                    ))}
                                                    {columns.length > 0 && (
                                                        <TableCell sx={excelHeaderCellSx(96)}>Actions</TableCell>
                                                    )}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {paramLoading && (
                                                    <TableRow>
                                                        <TableCell colSpan={99} align="center" sx={{ py: 3, border: 0 }}>
                                                            <CircularProgress size={22} sx={{ color: TEAL }} />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                                {!paramLoading && columns.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={99} align="center" sx={{ py: 4, color: "#aaa", fontSize: 13, border: 0 }}>
                                                            No parameters found.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                                {!paramLoading && columns.length > 0 && filteredRows.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={columns.length + 2} align="center" sx={{ py: 3, color: "#aaa", fontSize: 13, border: 0 }}>
                                                            {filter.trim() ? `No rows match "${filter.trim()}".` : "No rows found."}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                                {!paramLoading && filteredRows.map((row, idx) => (
                                                    <TableRow key={row.id || idx} hover sx={{ "&:hover": { bgcolor: "#eef6fc" } }}>
                                                        <TableCell sx={excelRowHeaderCellSx}>{idx + 1}</TableCell>
                                                        {columns.map((col) => {
                                                            const val = row[col];
                                                            const isBlank = val === null || val === undefined || val === "" || String(val).trim().toLowerCase() === "nan";
                                                            return (
                                                                <TableCell key={col} sx={excelBodyCellSx}>
                                                                    {isBlank ? "" : String(val)}
                                                                </TableCell>
                                                            );
                                                        })}
                                                        <TableCell sx={{ ...excelBodyCellSx, textAlign: "center" }}>
                                                            <Tooltip title="Edit" arrow>
                                                                <IconButton size="small" onClick={() => handleOpenEdit(row)}
                                                                    sx={{ color: TEAL, "&:hover": { bgcolor: TEAL_LIGHT } }}>
                                                                    <EditIcon sx={{ fontSize: 16 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Remove" arrow>
                                                                <IconButton size="small" onClick={() => handleDeleteRow(row, idx)}
                                                                    sx={{ color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}>
                                                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Slide>

            <RowFormDialog
                open={addDialogOpen}
                mode="add"
                columns={columns.length > 0 ? columns : DEFAULT_COLUMNS}
                initialRow={null}
                saving={saving}
                onClose={() => setAddDialogOpen(false)}
                onSave={handleAddSave}
            />
            <RowFormDialog
                open={editDialogOpen}
                mode="edit"
                columns={columns}
                initialRow={editRow}
                saving={saving}
                onClose={() => { setEditDialogOpen(false); setEditRow(null); }}
                onSave={handleEditSave}
            />

            {loading}
        </>
    );
};

export default WB_params;