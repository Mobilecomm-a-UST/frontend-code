import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
    Box, Typography, Breadcrumbs, Link, IconButton, TextField,
    InputAdornment, Tooltip, Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, CircularProgress, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
} from "@mui/material";
import {
    KeyboardArrowRight as KeyboardArrowRightIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    Save as SaveIcon,
    Search as SearchIcon,
    UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
 
// ─── theme constants ────────────────────────────────────────────────────────
const TEAL = "#2a77bf";
const TEAL_DARK = "#28538c";
const NAVY = "#0f1c3f";
const NAVY_DARK = "#0a1430";
 
const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        fontSize: 13,
        "&:hover fieldset": { borderColor: TEAL },
        "&.Mui-focused fieldset": { borderColor: TEAL },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
};
 
const cellSt = {
    padding: "8px 14px",
    border: "1px solid #dfe3e8",
    textAlign: "center",
    fontSize: 13,
    whiteSpace: "nowrap",
};
 
// ── Backend endpoints — adjust the paths to whatever your API actually
// exposes for this table; these follow the same postData/getData +
// FormData pattern used everywhere else in the app. ──
const LIST_ENDPOINT   = "mwCeragon/upload_serverip/";
const ADD_ENDPOINT    = "mwCeragon/upload_serverip/";
const UPLOAD_ENDPOINT = "mwCeragon/upload_serverip/"; // excel upload (key: "file")
const UPDATE_ENDPOINT = (id) => `mwCeragon/upload_serverip/${id}/`;
const DELETE_ENDPOINT = (id) => `mwCeragon/upload_serverip/${id}/`;
 
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
 
// ─── Add / Edit Server IP Dialog ─────────────────────────────────────────────
const ServerIpDialog = ({ open, mode, row, onClose, onSaved }) => {
    const [circle, setCircle] = useState("");
    const [ip, setIp] = useState("");
    const [saving, setSaving] = useState(false);
 
    const isEdit = mode === "edit";
 
    useEffect(() => {
        if (open) {
            setCircle(isEdit ? (row?.circle ?? "") : "");
            setIp(isEdit ? (row?.ip ?? "") : "");
        }
    }, [open, isEdit, row]);
 
    const handleClear = () => { setCircle(""); setIp(""); };
 
    const handleSave = async () => {
        if (!circle.trim()) { Swal.fire("Validation", "Circle is required.", "warning"); return; }
        if (!ip.trim())     { Swal.fire("Validation", "IP is required.", "warning"); return; }
 
        setSaving(true);
        try {
            const url = isEdit ? `${ServerURL}/${UPDATE_ENDPOINT(row.id)}` : `${ServerURL}/${ADD_ENDPOINT}`;
            const res = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ circle: circle.trim(), ip: ip.trim() }),
            });
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
                Swal.fire({ icon: "success", title: isEdit ? "Updated!" : "Added!", timer: 1600, showConfirmButton: false });
                onSaved();
                onClose();
            } else {
                Swal.fire("Error", data?.message || (isEdit ? "Update failed." : "Add failed."), "error");
                onClose();
            }
        } catch {
            Swal.fire("Error", "Something went wrong.", "error");
            onClose();
        } finally {
            setSaving(false);
        }
    };
 
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock
            PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
            <Box sx={{
                px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: "1px solid #eee",
            }}>
                <Box display="flex" alignItems="center" gap={1}>
                    {isEdit ? <EditIcon sx={{ color: TEAL, fontSize: 20 }} /> : <AddIcon sx={{ color: TEAL, fontSize: 20 }} />}
                    <Typography fontWeight={700} fontSize={16}>
                        {isEdit ? "Edit Server IP" : "Add Server IP"}
                    </Typography>
                </Box>
                <IconButton size="small" onClick={onClose}
                    sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
                    <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Box>
 
            <DialogContent sx={{ pt: 3, pb: 1 }}>
                <Box
                    sx={{
                        background: `linear-gradient(135deg, ${TEAL} 0%, #6dd5c8 100%)`,
                        borderRadius: "16px",
                        p: 3,
                    }}
                >
                    <Box sx={{ bgcolor: "#fff", borderRadius: "12px", p: 2.2 }}>
                        <TextField
                            label="Circle"
                            placeholder="e.g. UPE, MAH, DEL"
                            value={circle}
                            onChange={(e) => setCircle(e.target.value)}
                            size="small" fullWidth sx={{ ...fieldSx, mb: 1.6 }}
                        />
                        <TextField
                            label="IP Address"
                            placeholder="e.g. 2401:4900:24:1c00::930"
                            value={ip}
                            onChange={(e) => setIp(e.target.value)}
                            size="small" fullWidth sx={fieldSx}
                        />
                    </Box>
 
                    <Box display="flex" justifyContent="center" gap={2} mt={2.5}>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={saving}
                            startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
                            sx={{ bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" }, textTransform: "uppercase", fontWeight: 700, px: 3 }}
                        >
                            {saving ? "Saving…" : "Save"}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleClear}
                            disabled={saving}
                            startIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                            sx={{ bgcolor: "#d32f2f", "&:hover": { bgcolor: "#b71c1c" }, textTransform: "uppercase", fontWeight: 700, px: 3 }}
                        >
                            Clear
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
 
            <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
                <Button onClick={onClose} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
 
// ─── Excel Upload Dialog ──────────────────────────────────────────────────
const ExcelUploadDialog = ({ open, onClose, onUploaded }) => {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
 
    useEffect(() => {
        if (open) setFile(null);
    }, [open]);
 
    const handleSelectClick = () => fileInputRef.current?.click();
 
    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        e.target.value = "";
        if (f) setFile(f);
    };
 
    const handleClear = () => setFile(null);
 
    const handleUpload = async () => {
        if (!file) { Swal.fire("Validation", "Please select an excel file.", "warning"); return; }
 
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file); // key = "file"
 
            const res = await fetch(`${ServerURL}/${UPLOAD_ENDPOINT}`, {
                method: "POST",
                body: formData, // do NOT set Content-Type manually for FormData
            });
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
                Swal.fire({ icon: "success", title: "Uploaded!", timer: 1600, showConfirmButton: false });
                setFile(null);
                onUploaded();
                onClose();
            } else {
                Swal.fire("Error", data?.message || "Upload failed.", "error");
            }
        } catch {
            Swal.fire("Error", "Something went wrong while uploading.", "error");
        } finally {
            setUploading(false);
        }
    };
 
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock
            PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
            <Box sx={{
                px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: "1px solid #eee",
            }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <UploadFileIcon sx={{ color: TEAL, fontSize: 20 }} />
                    <Typography fontWeight={700} fontSize={16}>
                        Upload Excel
                    </Typography>
                </Box>
                <IconButton size="small" onClick={onClose}
                    sx={{ bgcolor: "#f3f4f6", borderRadius: "8px", "&:hover": { bgcolor: "#fdecea", color: "#c62828" } }}>
                    <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Box>
 
            <DialogContent sx={{ pt: 3, pb: 1 }}>
                <Box
                    sx={{
                        background: `linear-gradient(135deg, ${TEAL} 0%, #6dd5c8 100%)`,
                        borderRadius: "16px",
                        p: 3,
                    }}
                >
                    <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
 
                    <Box sx={{ bgcolor: "#fff", borderRadius: "12px", p: 2.2 }}>
                        <Typography fontWeight={700} fontSize={15} mb={1.2}>
                            Select Excel Files:-
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleSelectClick}
                            disabled={uploading}
                            sx={{
                                bgcolor: TEAL,
                                "&:hover": { bgcolor: TEAL_DARK },
                                textTransform: "uppercase",
                                fontWeight: 700,
                                px: 2.5,
                            }}
                        >
                            Select File
                        </Button>
                        {file && (
                            <Typography sx={{ mt: 1.4, fontSize: 12.5, color: "#455a64", wordBreak: "break-all" }}>
                                {file.name}
                            </Typography>
                        )}
                    </Box>
 
                    <Box display="flex" justifyContent="center" gap={2} mt={2.5}>
                        <Button
                            variant="contained"
                            onClick={handleUpload}
                            disabled={uploading}
                            startIcon={uploading ? <CircularProgress size={14} color="inherit" /> : <UploadFileIcon sx={{ fontSize: 16 }} />}
                            sx={{ bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" }, textTransform: "uppercase", fontWeight: 700, px: 3 }}
                        >
                            {uploading ? "Uploading…" : "Upload"}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleClear}
                            disabled={uploading}
                            startIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                            sx={{ bgcolor: "#d32f2f", "&:hover": { bgcolor: "#b71c1c" }, textTransform: "uppercase", fontWeight: 700, px: 3 }}
                        >
                            Clear
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
 
            <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
                <Button onClick={onClose} sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", px: 2, fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
 
// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const ServerIp = () => {
    const classes = OverAllCss();
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();
 
    const [rows, setRows] = useState([]);
    const [rowsLoading, setRowsLoading] = useState(false);
    const [search, setSearch] = useState("");
 
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add"); // "add" | "edit"
    const [editRow, setEditRow] = useState(null);
 
    // ── excel upload dialog state ──
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
 
    const fetchRows = useCallback(async () => {
        setRowsLoading(true);
        try {
            const res = await getData(LIST_ENDPOINT);
            if (Array.isArray(res)) setRows(res);
            else if (Array.isArray(res?.data)) setRows(res.data);
            else if (Array.isArray(res?.results)) setRows(res.results);
            else setRows([]);
        } catch {
            setRows([]);
        } finally {
            setRowsLoading(false);
        }
    }, []);
 
    useEffect(() => { fetchRows(); }, [fetchRows]);
 
    const filteredRows = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter(
            (r) =>
                String(r.circle ?? "").toLowerCase().includes(q) ||
                String(r.ip ?? "").toLowerCase().includes(q)
        );
    }, [rows, search]);
 
    const openAddDialog = () => { setDialogMode("add"); setEditRow(null); setDialogOpen(true); };
    const openEditDialog = (row) => { setDialogMode("edit"); setEditRow(row); setDialogOpen(true); };
 
    const handleDelete = async (row) => {
        const result = await Swal.fire({
            title: "Delete Server IP?",
            html: `<span style="font-size:14px;color:#555">Delete <b>${row.circle}</b> — <b>${row.ip}</b>?</span>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d32f2f",
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) return;
 
        action(true);
        try {
            const res = await fetch(`${ServerURL}/${DELETE_ENDPOINT(row.id)}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            const data = await safeParseJson(res);
            if (isSuccessResponse(res, data)) {
                Swal.fire({ icon: "success", title: "Deleted!", timer: 1600, showConfirmButton: false });
            } else {
                Swal.fire("Error", data?.message || "Delete failed.", "error");
            }
        } catch {
            Swal.fire("Error", "Something went wrong.", "error");
        } finally {
            await fetchRows();
            action(false);
        }
    };
 
    const openUploadDialog = () => setUploadDialogOpen(true);
 
    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/soft_at")}>Soft-AT Tool</Link>
                    <Typography color="text.primary">Server IP</Typography>
                </Breadcrumbs>
            </Box>
 
            <Box p={1}>
                {/* ── Header bar: title centered, upload + add on the right ── */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`,
                        borderRadius: "10px",
                        px: 2.5, py: 1.6,
                        mb: 0,
                    }}
                >
                    <Box sx={{ width: 40 }} /> {/* spacer to keep title centered */}
                    <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 24, textAlign: "center", flex: 1 }}>
                        Server IP
                    </Typography>
 
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title="Upload Excel" arrow>
                            <IconButton
                                onClick={openUploadDialog}
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.12)",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.24)" },
                                }}>
                                <UploadFileIcon />
                            </IconButton>
                        </Tooltip>
 
                        <Tooltip title="Add Server IP" arrow>
                            <IconButton onClick={openAddDialog}
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.12)",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.24)" },
                                }}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
 
                {/* ── Search ── */}
                <Box
                    sx={{
                        display: "flex", alignItems: "center", gap: 1,
                        px: 2, py: 1.3, mt: 1.2, mb: 0,
                        borderRadius: "10px",
                        border: "1px solid #e0e8ec",
                        bgcolor: "#f8fafc",
                    }}
                >
                    <TextField
                        size="small"
                        placeholder="Search by Circle or IP…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" sx={{ color: "#90a4ae" }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ minWidth: 220, ...fieldSx }}
                    />
                    {filteredRows.length > 0 && (
                        <Chip
                            label={`${filteredRows.length} entries`}
                            size="small"
                            sx={{ fontWeight: 700, fontSize: 11, bgcolor: TEAL, color: "#fff" }}
                        />
                    )}
                </Box>
 
                {/* ── Table ── */}
                <TableContainer component={Paper} elevation={0}
                    sx={{
                        mt: 1.2,
                        border: "1px solid #c0c0c0",
                        borderRadius: "10px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        maxHeight: 520,
                        overflowY: "auto",
                    }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                {["SN", "Circle", "IP", "Action"].map((h) => (
                                    <TableCell key={h} sx={{
                                        ...cellSt,
                                        color: "#fff",
                                        fontWeight: 700,
                                        fontSize: 13,
                                        background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`,
                                        border: `1px solid ${NAVY_DARK}`,
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 2,
                                    }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rowsLoading && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                        <CircularProgress size={22} sx={{ color: TEAL }} />
                                    </TableCell>
                                </TableRow>
                            )}
                            {!rowsLoading && filteredRows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: "#9e9e9e", fontSize: 13 }}>
                                        {search.trim() ? `No entries match "${search.trim()}".` : "No Server IPs added yet."}
                                    </TableCell>
                                </TableRow>
                            )}
                            {!rowsLoading && filteredRows.map((row, idx) => (
                                <TableRow key={row.id ?? idx} hover
                                    sx={{ "&:nth-of-type(even)": { bgcolor: "#f4f7fb" } }}>
                                    <TableCell sx={cellSt}>{idx + 1}</TableCell>
                                    <TableCell sx={cellSt}>
                                        <Chip label={row.circle} size="small"
                                            sx={{ bgcolor: TEAL, color: "#fff", fontWeight: 700, fontSize: 11.5 }} />
                                    </TableCell>
                                    <TableCell sx={{ ...cellSt, wordBreak: "break-all" }}>{row.ip}</TableCell>
                                    <TableCell sx={cellSt}>
                                        <Box display="flex" justifyContent="center" gap={0.5}>
                                            <Tooltip title="Edit" arrow>
                                                <IconButton size="small" onClick={() => openEditDialog(row)}
                                                    sx={{ color: TEAL, "&:hover": { bgcolor: "#e0f2f1" } }}>
                                                    <EditIcon sx={{ fontSize: 17 }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete" arrow>
                                                <IconButton size="small" onClick={() => handleDelete(row)}
                                                    sx={{ color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}>
                                                    <DeleteIcon sx={{ fontSize: 17 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
 
                {loading}
            </Box>
 
            <ServerIpDialog
                open={dialogOpen}
                mode={dialogMode}
                row={editRow}
                onClose={() => setDialogOpen(false)}
                onSaved={fetchRows}
            />
 
            <ExcelUploadDialog
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onUploaded={fetchRows}
            />
        </>
    );
};
 
export default ServerIp;
 