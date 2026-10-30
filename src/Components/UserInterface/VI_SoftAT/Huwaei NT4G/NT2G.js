import React, { useState } from "react";
import {
    Box,
    Button,
    Stack,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CancelIcon from '@mui/icons-material/Cancel';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DnsIcon from '@mui/icons-material/Dns';
import Swal from "sweetalert2";
import { postData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import OverAllCss from "../../../csss/OverAllCss";

/* ------------------------------------------------------------------ */
/*  Theme                                                              */
/* ------------------------------------------------------------------ */
const C = {
    teal: "#006e74",
    tealDark: "#00494d",
    headerBg: "#004d52",
    labelOdd: "#e3f2f2",
    labelEven: "#f2fafa",
    border: "#c9dcdc",
    valueText: "#0d3a3c",
    zeroText: "#a7bcbc",
    tick: "#1a7f37",
    cross: "#c62828",
};

const HEADER_GRADIENT = "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)";
const PINNED_KEY = "Site ID";
const CIRCLE_OPTIONS = ['KAR', 'BIH'];

const buildColumns = (rows) => {
    if (!rows || !rows.length) return [];
    const keySet = new Set();
    rows.forEach((r) => Object.keys(r).forEach((k) => keySet.add(k)));
    keySet.delete(PINNED_KEY);
    return Array.from(keySet);
};

const isTickCross = (val) =>
    typeof val === "string" && (val.trim().startsWith("✓") || val.trim() === "✗" || val.trim() === "X");

const cellColor = (val) => {
    if (typeof val === "string") {
        const v = val.trim();
        if (v.startsWith("✓")) return C.tick;
        if (v === "✗" || v === "X") return C.cross;
        if (v === "") return C.zeroText;
    }
    if (val === 0) return C.zeroText;
    return C.valueText;
};

/* ------------------------------------------------------------------ */
/*  Results table                                                      */
/* ------------------------------------------------------------------ */
function ResultTable({ rows }) {
    const columns = buildColumns(rows);
    const hasData = Array.isArray(rows) && rows.length > 0;

    if (!hasData) return null;

    return (
        <Box sx={{ mt: 4, px: { xs: 1, md: 3 } }}>
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${C.border}` }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 1.25,
                        background: HEADER_GRADIENT,
                    }}
                >
                    <DnsIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />
                    <Typography
                        variant="subtitle2"
                        sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}
                    >
                        2G Site-wise Data
                    </Typography>
                </Box>

                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table
                        size="small"
                        stickyHeader
                        sx={{
                            borderCollapse: "collapse",
                            "& .MuiTableCell-root": { border: `1px solid ${C.border}`, py: 0.75, fontSize: 12.5 },
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        position: "sticky",
                                        left: 0,
                                        top: 0,
                                        zIndex: 6,
                                        bgcolor: C.headerBg,
                                        color: "#fff",
                                        fontWeight: 700,
                                        minWidth: 100,
                                    }}
                                >
                                    {PINNED_KEY}
                                </TableCell>
                                {columns.map((c) => (
                                    <TableCell
                                        key={c}
                                        align="center"
                                        sx={{
                                            position: "sticky",
                                            top: 0,
                                            zIndex: 4,
                                            bgcolor: C.teal,
                                            color: "#fff",
                                            fontWeight: 700,
                                            whiteSpace: "nowrap",
                                            minWidth: 90,
                                        }}
                                    >
                                        {String(c).trim()}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((row, i) => {
                                const labelBg = i % 2 === 0 ? C.labelOdd : "#f2fafa";
                                return (
                                    <TableRow key={row[PINNED_KEY] ?? i}>
                                        <TableCell
                                            sx={{
                                                position: "sticky",
                                                left: 0,
                                                zIndex: 2,
                                                bgcolor: labelBg,
                                                fontWeight: 700,
                                                color: C.tealDark,
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {row[PINNED_KEY] ?? "—"}
                                        </TableCell>
                                        {columns.map((c) => {
                                            const val = row[c];
                                            const display = val === "" || val == null ? "—" : val;
                                            return (
                                                <TableCell
                                                    key={c}
                                                    align="center"
                                                    sx={{
                                                        bgcolor: "#ffffff",
                                                        fontVariantNumeric: "tabular-nums",
                                                        color: cellColor(val),
                                                        fontWeight: isTickCross(val) ? 800 : 600,
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {display}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

/* ================================================================ */
/*  NT2G Component                                                   */
/* ================================================================ */
const NT2G = () => {
    const [selectedFilesMap, setSelectedFilesMap] = useState({});
    const [showError, setShowError] = useState(false);
    const [selectedCircle, setSelectedCircle] = useState("");
    const [downloadUrls, setDownloadUrls] = useState({ url1: null, url2: null });
    const [showDownloads, setShowDownloads] = useState(false);
    const [resultData, setResultData] = useState([]);

    const { loading, action } = useLoadingDialog();
    const classes = OverAllCss();

    const FILE_SECTIONS = [
        { key: "site_ip", label: "1. Site IP Plan File" },
        { key: "lte_rep", label: "2. LTE Cell Report File" },
        { key: "nte_rep", label: "3. NE Report File" }
    ];

    const handleFileSelection = (key, event) => {
        const newFiles = Array.from(event.target.files || []);
        if (!newFiles.length) return;

        setSelectedFilesMap(prev => ({
            ...prev,
            [key]: [...(prev[key] || []), ...newFiles]
        }));
        setShowError(false);
        event.target.value = "";
    };

    const handleRemoveFileIndex = (key, indexToRemove) => {
        setSelectedFilesMap(prev => {
            const updatedList = (prev[key] || []).filter((_, idx) => idx !== indexToRemove);
            const updated = { ...prev };
            if (updatedList.length > 0) {
                updated[key] = updatedList;
            } else {
                delete updated[key];
            }
            return updated;
        });
    };

    const handleSingleDownload = (url) => {
        if (!url) {
            Swal.fire({ icon: "error", title: "Error", text: "Download link is not available." });
            return;
        }

        try {
            const link = document.createElement('a');
            link.href = url;
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Swal.fire({ icon: "success", title: "Download Started", text: "Your file download has started.", timer: 1500 });
        } catch (error) {
            console.error('Download error:', error);
            Swal.fire({ icon: "error", title: "Download Failed", text: "Failed to download the file." });
        }
    };

    const handleSubmit = async () => {
        if (!selectedCircle) {
            Swal.fire({ icon: "warning", title: "Missing Circle", text: "Please select a circle before submitting." });
            return;
        }

        const categoriesWithFilesCount = Object.keys(selectedFilesMap).length;

        if (categoriesWithFilesCount < 3) {
            setShowError(true);
            Swal.fire({ icon: "warning", title: "Missing Files", text: "Please upload files into all 3 required categories." });
            return;
        }

        action(true);
        const formData = new FormData();
        formData.append('circle', selectedCircle);

        Object.keys(selectedFilesMap).forEach((key) => {
            selectedFilesMap[key].forEach((file) => {
                formData.append(key, file);
            });
        });

        try {
            const response = await postData('nt_4g_tool/2g/', formData);

            if (response.status === true) {
                action(false);
                setShowDownloads(true);
                setDownloadUrls({
                    url1: response.download_url1 || response.download_ulr1,
                    url2: response.download_url2 || response.download_ulr2,
                });
                setResultData(Array.isArray(response.data) ? response.data : []);

                Swal.fire({ icon: "success", title: "Done", text: response.message });
            } else {
                action(false);
                Swal.fire({ icon: "error", title: "Oops...", text: response.message });
            }
        } catch (err) {
            action(false);
            Swal.fire({ icon: "error", title: "Server Error", text: "An error occurred while uploading files." });
        }
    };

    const handleCancel = () => {
        setSelectedFilesMap({});
        setSelectedCircle("");
        setShowError(false);
        setShowDownloads(false);
        setDownloadUrls({ url1: null, url2: null });
        setResultData([]);
    };

    const totalSelectedFilesCount = Object.values(selectedFilesMap).reduce((acc, curr) => acc + (curr ? curr.length : 0), 0);
    const categoriesFilledCount = Object.keys(selectedFilesMap).length;

    return (
        <Box className={classes.Front_Box} sx={{ p: 3 }}>
            <Stack spacing={3} direction={'column'}>

                {/* CIRCLE DROPDOWN SECTION */}
                <Box sx={{ p: 2.5, bgcolor: '#f9f9f9', borderRadius: 2, border: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: C.tealDark }}>
                            📍 Select Circle:
                        </Typography>

                        <FormControl sx={{ minWidth: 220 }}>
                            <InputLabel id="circle-select-label-2g" sx={{ color: C.teal }}>
                                Select Circle
                            </InputLabel>
                            <Select
                                labelId="circle-select-label-2g"
                                id="circle-select-2g"
                                value={selectedCircle}
                                label="Select Circle"
                                onChange={(e) => setSelectedCircle(e.target.value)}
                                sx={{
                                    backgroundColor: '#fff',
                                    color: C.tealDark,
                                    fontWeight: 600,
                                    borderRadius: 1.5,
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: C.border },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: C.teal },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: C.teal, borderWidth: '2px' },
                                }}
                            >
                                <MenuItem value=""><em>Select a circle...</em></MenuItem>
                                {CIRCLE_OPTIONS.map((circle) => (
                                    <MenuItem key={circle} value={circle}>{circle}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    {selectedCircle && (
                        <Box sx={{ mt: 1.5, p: 1.5, bgcolor: C.labelOdd, borderRadius: 1, border: `1px solid ${C.border}` }}>
                            <Typography variant="caption" sx={{ color: C.tealDark, fontWeight: 700 }}>
                                ✓ Selected Circle: <span style={{ fontWeight: 700, fontSize: '14px', color: C.teal }}>{selectedCircle}</span>
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Divider />

                {/* FILE UPLOAD SECTION */}
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: C.tealDark, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        📁 Upload Required Files (3 Categories)
                    </Typography>

                    <Stack spacing={2.5}>
                        {FILE_SECTIONS.map((section, idx) => {
                            const fileArray = selectedFilesMap[section.key] || [];
                            const hasFiles = fileArray.length > 0;
                            return (
                                <Box key={section.key} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2, border: `1px solid ${C.border}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: C.tealDark }}>
                                            {section.label}
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            component="label"
                                            size="small"
                                            color={hasFiles ? "success" : "primary"}
                                            sx={{ fontWeight: 700 }}
                                        >
                                            {hasFiles ? `+ Add More` : "Browse Files"}
                                            <input
                                                hidden
                                                accept=".xlsx,.xls,.xlsb,.csv"
                                                type="file"
                                                multiple={true}
                                                onChange={(e) => handleFileSelection(section.key, e)}
                                            />
                                        </Button>
                                    </div>

                                    {hasFiles ? (
                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            {fileArray.map((f, fIdx) => (
                                                <Chip
                                                    key={fIdx}
                                                    label={f.name}
                                                    onDelete={() => handleRemoveFileIndex(section.key, fIdx)}
                                                    deleteIcon={<CancelIcon />}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: C.labelOdd,
                                                        color: C.tealDark,
                                                        fontWeight: 600,
                                                        border: `1px solid ${C.border}`,
                                                        '& .MuiChip-deleteIcon': {
                                                            color: C.teal,
                                                            '&:hover': { color: C.cross }
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="caption" sx={{ color: 'gray', fontStyle: 'italic' }}>
                                            No files selected for this category
                                        </Typography>
                                    )}
                                </Box>
                            );
                        })}
                    </Stack>

                    <Box sx={{ mt: 2, p: 2, bgcolor: categoriesFilledCount === 3 ? '#e8f5e9' : '#fff3e0', borderRadius: 1.5, border: `1px solid ${categoriesFilledCount === 3 ? '#4caf50' : '#ff9800'}` }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: categoriesFilledCount === 3 ? '#2e7d32' : '#e65100' }}>
                            {categoriesFilledCount === 3 ? '✓' : '⚠'} Categories Ready: <span style={{ fontSize: '16px' }}>{categoriesFilledCount} / 3</span> ({totalSelectedFilesCount} files)
                        </Typography>
                    </Box>

                    {showError && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1.5, border: '1px solid #f44336' }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#c62828' }}>
                                ❌ Please ensure files are selected for all 3 categories!
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Stack>

            {/* Buttons */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3, justifyContent: "center" }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                    endIcon={<UploadIcon />}
                    sx={{ fontWeight: 700, px: 4 }}
                >
                    Submit NT 2G
                </Button>
                <Button
                    variant="contained"
                    onClick={handleCancel}
                    sx={{ backgroundColor: "#ef5350", color: 'white', fontWeight: 700, px: 4 }}
                    endIcon={<DoDisturbIcon />}
                >
                    Reset
                </Button>
            </Stack>

            {/* Downloads Section */}
            {showDownloads && (
                <Box sx={{ mt: 4, p: 3, bgcolor: '#f0f4f5', borderRadius: 2, border: `2px solid ${C.teal}` }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: C.tealDark, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        📥 Download Generated Files
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap" useFlexGap>
                        <Button
                            variant="contained"
                            onClick={() => handleSingleDownload(downloadUrls.url1)}
                            startIcon={<FileDownloadIcon />}
                            sx={{ flex: 1, minWidth: 200, fontWeight: 700 }}
                        >
                            Checklist Huawei RAN UIM BTS 2G
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => handleSingleDownload(downloadUrls.url2)}
                            startIcon={<FileDownloadIcon />}
                            sx={{ flex: 1, minWidth: 200, fontWeight: 700 }}
                        >
                            Inventory Sheet 2G Site
                        </Button>
                    </Stack>
                </Box>
            )}

            {/* Results Table */}
            <ResultTable rows={resultData} />

            {loading}
        </Box>
    );
};

export default NT2G;