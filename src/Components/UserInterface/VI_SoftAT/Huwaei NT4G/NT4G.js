import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Chip, Divider } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CancelIcon from '@mui/icons-material/Cancel';
import Swal from "sweetalert2";
import { postData } from "../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DnsIcon from '@mui/icons-material/Dns';
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import OverAllCss from "../../../csss/OverAllCss";

/* ------------------------------------------------------------------ */
/*  Theme — matched to the teal "Baseband Requirement" screens        */
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
/*  Results table shown below the download buttons                    */
/* ------------------------------------------------------------------ */
function BasebandResultTable({ rows }) {
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
                        Baseband Site-wise Data
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
                                const labelBg = i % 2 === 0 ? C.labelOdd : C.labelEven;
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

const UploadLayered = () => {
    const [selectedFilesMap, setSelectedFilesMap] = useState({});
    const [showError, setShowError] = useState(false);
    
    // Fixed key names matching backend response: download_url1, download_url2, download_url3, download_url4
    const [downloadUrls, setDownloadUrls] = useState({
        url1: null,
        url2: null,
        url3: null,
        url4: null,
    });
    const [showDownloads, setShowDownloads] = useState(false);
    const [resultData, setResultData] = useState([]);
    
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    const FILE_SECTIONS = [
        { key: "site_ip", label: "1. Site IP Plan File" },
        { key: "config_data", label: "2. Configuration File" },
        { key: "lte_rep", label: "3. LTE Cell Report File" },
        { key: "nte_rep", label: "4. NT Report File (nte_report)" }
    ];

    const handleSingleFileSelection = (key, event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFilesMap(prev => ({
            ...prev,
            [key]: file
        }));
        setShowError(false);
        event.target.value = "";
    };

    const handleRemoveFile = (keyToRemove) => {
        setSelectedFilesMap(prev => {
            const updated = { ...prev };
            delete updated[keyToRemove];
            return updated;
        });
    };

    const handleSingleDownload = (url) => {
        if (!url) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Download link is not available.",
            });
            return;
        }

        try {
            const link = document.createElement('a');
            link.href = url;
            link.target = "_blank"; // Opens download directly
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Swal.fire({
                icon: "success",
                title: "Download Started",
                text: "Your file download has started.",
                timer: 1500
            });
        } catch (error) {
            console.error('Download error:', error);
            Swal.fire({
                icon: "error",
                title: "Download Failed",
                text: "Failed to download the file. Please try again.",
            });
        }
    };

    const handleSubmit = async () => {
        const assignedKeysCount = Object.keys(selectedFilesMap).length;
        
        if (assignedKeysCount < 4) {
            setShowError(true);
            Swal.fire({
                icon: "warning",
                title: "Missing Files",
                text: "Please upload all 4 required files into their respective sections.",
            });
            return;
        }

        action(true);
        var formData = new FormData();
        
        Object.keys(selectedFilesMap).forEach((key) => {
            formData.append(key, selectedFilesMap[key]);
        });

        try {
            const response = await postData('nt_4g_tool/4g/', formData);

            if (response.status === true) {
                action(false);
                setShowDownloads(true);
                
                // ✅ FIXED: Extracted using exact backend key names 'download_url1', 'download_url2', etc.
                setDownloadUrls({
                    url1: response.download_url1 || response.download_ulr1,
                    url2: response.download_url2 || response.download_ulr2,
                    url3: response.download_url3 || response.download_ulr3,
                    url4: response.download_url4 || response.download_ulr4,
                });
                
                setResultData(Array.isArray(response.data) ? response.data : []);

                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });
            } else {
                action(false);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${response.message}`,
                });
            }
        } catch (err) {
            action(false);
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "An error occurred while uploading files.",
            });
        }
    };

    const handleCancel = () => {
        setSelectedFilesMap({});
        setShowError(false);
        setShowDownloads(false);
        setDownloadUrls({ url1: null, url2: null, url3: null, url4: null });
        setResultData([]);
    };

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
    }, []);

    const filesCount = Object.keys(selectedFilesMap).length;

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/soft_at_tools') }}>VI Soft-AT Tool</Link>
                    <Typography color='text.primary'>NT 4G</Typography>
                </Breadcrumbs>
            </div>
            <Slide
                direction='left'
                in={true}
                timeout={1000}
            >
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: '80%', xs: '100%' } }}>
                            <Box className={classes.Box_Hading} >
                                NT 4G
                            </Box>
                            <Stack spacing={3} sx={{ marginTop: "-20px" }} direction={'column'}>

                                <Box className={classes.Front_Box} sx={{ p: 3 }}>
                                    <div className={classes.Front_Box_Hading} style={{ marginBottom: '15px' }}>
                                        Upload Required Files by Category:
                                    </div>

                                    <Stack spacing={2}>
                                        {FILE_SECTIONS.map((section, idx) => {
                                            const fileObj = selectedFilesMap[section.key];
                                            return (
                                                <Box key={section.key} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: C.tealDark }}>
                                                            {section.label}
                                                        </Typography>

                                                        <Button 
                                                            variant="contained" 
                                                            component="label" 
                                                            size="small"
                                                            color={fileObj ? "success" : "primary"}
                                                        >
                                                            {fileObj ? "Change File" : "Browse File"}
                                                            <input
                                                                hidden
                                                                accept=".xlsx,.xls,.xlsb,.csv"
                                                                type="file"
                                                                onChange={(e) => handleSingleFileSelection(section.key, e)}
                                                            />
                                                        </Button>
                                                    </div>

                                                    {fileObj ? (
                                                        <Chip
                                                            label={`File: ${fileObj.name}`}
                                                            onDelete={() => handleRemoveFile(section.key)}
                                                            deleteIcon={<CancelIcon />}
                                                            sx={{
                                                                alignSelf: 'flex-start',
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
                                                    ) : (
                                                        <Typography variant="caption" sx={{ color: 'gray', fontStyle: 'italic' }}>
                                                            No file chosen for this category yet.
                                                        </Typography>
                                                    )}

                                                    {idx < FILE_SECTIONS.length - 1 && <Divider sx={{ mt: 1 }} />}
                                                </Box>
                                            );
                                        })}
                                    </Stack>

                                    <Box sx={{ mt: 2 }}>
                                        <span style={{ color: filesCount === 4 ? 'green' : '#006e74', fontSize: '15px', fontWeight: 600 }}>
                                            Total Ready: {filesCount} / 4 Files Uploaded
                                        </span>
                                    </Box>

                                    <div>
                                        <span style={{ display: showError ? 'inherit' : 'none', color: 'red', fontSize: '15px', fontWeight: 600, marginTop: '8px', display: 'block' }}>
                                            Error: Please ensure all 4 specific files are selected before submitting!
                                        </span>
                                    </div>
                                </Box>
                            </Stack>

                            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit nt4g</Button>
                                <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >Cancel</Button>
                            </Stack>
                        </Box>
                    </Box>

                    {/* 4 Separate Download Buttons section */}
                    <Box sx={{ display: showDownloads ? 'block' : 'none', textAlign: 'center', mt: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: C.tealDark, mb: 2 }}>
                            Download Generated Output Files
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" flexWrap="wrap">
                            <Button
                                variant="outlined"
                                onClick={() => handleSingleDownload(downloadUrls.url1)}
                                startIcon={<FileDownloadIcon sx={{ color: "green" }} />}
                            >
                                Download Reference Data Huawei
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleSingleDownload(downloadUrls.url2)}
                                startIcon={<FileDownloadIcon sx={{ color: "green" }} />}
                            >
                                Download Checklist Huwaei RAN UIM eNodeB
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleSingleDownload(downloadUrls.url3)}
                                startIcon={<FileDownloadIcon sx={{ color: "green" }} />}
                            >
                                Download INVENTORY SHEET 4G
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleSingleDownload(downloadUrls.url4)}
                                startIcon={<FileDownloadIcon sx={{ color: "green" }} />}
                            >
                                Download Accedian Data
                            </Button>
                        </Stack>
                    </Box>

                    {/* Results table */}
                    <BasebandResultTable rows={resultData} />
                </Box>
            </Slide>
            {loading}
        </>
    );
};

export default UploadLayered;