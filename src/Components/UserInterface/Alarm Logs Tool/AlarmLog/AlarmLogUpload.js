import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Button,
    Stack,
    Breadcrumbs,
    Link,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Chip,
    CircularProgress,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import UploadIcon from "@mui/icons-material/Upload";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InboxIcon from "@mui/icons-material/Inbox";
import DnsIcon from "@mui/icons-material/Dns";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Slide from "@mui/material/Slide";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

/* ------------------------------------------------------------------ */
/*  Config — update BASE_URL to the production host once deployed.     */
/*  Currently pointing at the dev server given in the spec.            */
/* ------------------------------------------------------------------ */
const BASE_URL = "https://commtoolapi.mcpspmis.com/";
const UPLOAD_PATH = "alarm_log/upload/";
const REPORT_PATH = "alarm_log/alarm-report/";

/* ------------------------------------------------------------------ */
/*  Theme — same teal identity used across the app                     */
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
};

const HEADER_GRADIENT = "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)";

/* ------------------------------------------------------------------ */
/*  Expected report columns (per spec): site_id, bucket, alarm,        */
/*  detailed_remarks — table still adapts if headers differ slightly.  */
/* ------------------------------------------------------------------ */
const PINNED_KEY = "site_id";

const buildColumns = (rows) => {
    if (!rows || !rows.length) return [];
    const keySet = new Set();
    rows.forEach((r) => Object.keys(r).forEach((k) => keySet.add(k)));
    keySet.delete(PINNED_KEY);
    return Array.from(keySet);
};

/* ------------------------------------------------------------------ */
/*  No data placeholder                                                 */
/* ------------------------------------------------------------------ */
function NoData({ label = "No data found", compact = false }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                py: compact ? 4 : 8,
                color: "#94a3b8",
            }}
        >
            <InboxIcon sx={{ fontSize: compact ? 30 : 42 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {label}
            </Typography>
        </Box>
    );
}

/* ------------------------------------------------------------------ */
/*  Alarm report table                                                  */
/* ------------------------------------------------------------------ */
function AlarmReportTable({ rows, search }) {
    const columns = buildColumns(rows);
    const hasRawData = Array.isArray(rows) && rows.length > 0;

    const filteredRows = React.useMemo(() => {
        if (!search.trim()) return rows;
        const q = search.trim().toLowerCase();
        return rows.filter((row) =>
            Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(q))
        );
    }, [rows, search]);

    if (!hasRawData) return null;

    return (
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
                    Alarm Report
                </Typography>
            </Box>

            {filteredRows.length === 0 ? (
                <NoData compact label="No matching rows" />
            ) : (
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
                                        minWidth: 110,
                                    }}
                                >
                                    Site ID
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
                                            minWidth: 130,
                                        }}
                                    >
                                        {String(c).replaceAll("_", " ").replace(/\b\w/g, (ch) => ch.toUpperCase())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredRows.map((row, i) => {
                                const labelBg = i % 2 === 0 ? C.labelOdd : C.labelEven;
                                return (
                                    <TableRow key={`${row[PINNED_KEY]}-${i}`}>
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
                                                    align={c === "detailed_remarks" ? "left" : "center"}
                                                    sx={{
                                                        bgcolor: "#ffffff",
                                                        color: display === "—" ? C.zeroText : C.valueText,
                                                        fontWeight: 500,
                                                        maxWidth: c === "detailed_remarks" ? 320 : undefined,
                                                        whiteSpace: c === "detailed_remarks" ? "normal" : "nowrap",
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
            )}
        </Paper>
    );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */
const AlarmLogUpload = () => {
    const navigate = useNavigate();
    const classes = OverAllCss();
    const { loading, action } = useLoadingDialog();

    // Upload state
    const [selectedFile, setSelectedFile] = useState(null);
    const [showRequired, setShowRequired] = useState(false);
    const [uploadedFilename, setUploadedFilename] = useState(null);

    // Report state
    const [reportLoading, setReportLoading] = useState(false);
    const [reportMessage, setReportMessage] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [rows, setRows] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        document.title = `${window.location.pathname
            .slice(1)
            .replaceAll("_", " ")
            .replaceAll("/", " | ")
            .toUpperCase()}`;
    }, []);

    const handleFileSelection = (event) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        setShowRequired(false);
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setShowRequired(false);
        setUploadedFilename(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setShowRequired(true);
            return;
        }

        action(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const res = await fetch(`${BASE_URL}${UPLOAD_PATH}`, {
                method: "POST",
                body: formData,
            });
            const json = await res.json();

            if (json?.status === true) {
                setUploadedFilename(json.filename || selectedFile.name);
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: json.message || "File uploaded successfully.",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: json?.message || "Upload failed.",
                });
            }
        } catch (e) {
            console.error("Alarm log upload error:", e);
            Swal.fire({ icon: "error", title: "Error", text: "Something went wrong while uploading." });
        } finally {
            action(false);
        }
    };

    const handleGenerateReport = async () => {
        setReportLoading(true);
        setReportMessage(null);
        try {
            const res = await fetch(`${BASE_URL}${REPORT_PATH}`);
            const json = await res.json();

            if (json?.status === true) {
                setReportMessage(json.message || "Report generated.");
                setDownloadUrl(json.download_url || null);

                if (json.download_url) {
                    // Fetch and parse the generated Excel file client-side
                    const fileRes = await fetch(json.download_url);
                    const arrayBuffer = await fileRes.arrayBuffer();
                    const workbook = XLSX.read(arrayBuffer, { type: "array" });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const json_rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
                    setRows(json_rows);
                } else {
                    setRows([]);
                }
            } else {
                setRows([]);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: json?.message || "Could not generate the report.",
                });
            }
        } catch (e) {
            console.error("Alarm report error:", e);
            setRows([]);
            Swal.fire({ icon: "error", title: "Error", text: "Something went wrong while generating the report." });
        } finally {
            setReportLoading(false);
        }
    };

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    itemsBeforeCollapse={2}
                    maxItems={3}
                    separator={<KeyboardArrowRightIcon fontSize="small" />}
                >
                    <Link underline="hover" onClick={() => navigate("/tools")}>
                        Tools
                    </Link>
                    <Link underline="hover" onClick={() => navigate("/tools/quality_team")}>
                        Quality Team
                    </Link>
                    <Typography color="text.primary">Alarm Logs</Typography>
                </Breadcrumbs>
            </div>

            <Slide direction="left" in={true} timeout={1000}>
                <Box>
                    {/* Upload panel */}
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Upload Alarm Log</Box>

                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction="column">
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Alarm Log File:-
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                color={selectedFile ? "warning" : "primary"}
                                            >
                                                Select File
                                                <input
                                                    required
                                                    hidden
                                                    accept=".txt,.log"
                                                    type="file"
                                                    onChange={(e) => handleFileSelection(e)}
                                                />
                                            </Button>
                                        </div>

                                        {selectedFile && (
                                            <span style={{ color: "green", fontSize: "18px", fontWeight: 600 }}>
                                                Selected File: {selectedFile.name}
                                            </span>
                                        )}

                                        <div>
                                            <span
                                                style={{
                                                    display: showRequired ? "inherit" : "none",
                                                    color: "red",
                                                    fontSize: "18px",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                This Field Is Required !
                                            </span>
                                        </div>
                                    </div>
                                </Box>
                            </Stack>

                            <Stack
                                direction={{ xs: "column", sm: "column", md: "row" }}
                                spacing={2}
                                style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}
                            >
                                <Button variant="contained" color="success" onClick={handleUpload} endIcon={<UploadIcon />}>
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleCancel}
                                    style={{ backgroundColor: "red", color: "white" }}
                                    endIcon={<DoDisturbIcon />}
                                >
                                    Cancel
                                </Button>
                            </Stack>

                            {uploadedFilename && (
                                <Typography
                                    sx={{ textAlign: "center", color: "#fff", mt: 2, fontWeight: 600 }}
                                >
                                    Uploaded: {uploadedFilename}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* Generate report action */}
                    <Box sx={{ textAlign: "center", mt: 3 }}>
                        <Button
                            variant="contained"
                            onClick={handleGenerateReport}
                            disabled={reportLoading}
                            startIcon={
                                reportLoading ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <AssessmentIcon />
                            }
                            sx={{
                                bgcolor: C.teal,
                                "&:hover": { bgcolor: C.tealDark },
                                fontWeight: 700,
                                textTransform: "none",
                                px: 3,
                                py: 1,
                            }}
                        >
                            {reportLoading ? "Generating Report..." : "Generate Alarm Report"}
                        </Button>

                        {reportMessage && (
                            <Typography sx={{ mt: 1.5, color: C.tealDark, fontWeight: 600 }}>
                                {reportMessage}
                            </Typography>
                        )}

                        {downloadUrl && (
                            <Box sx={{ mt: 1.5 }}>
                                <a download href={downloadUrl}>
                                    <Button
                                        variant="outlined"
                                        title="Export Excel"
                                        startIcon={<FileDownloadIcon style={{ fontSize: 24, color: "green" }} />}
                                        sx={{ width: "auto" }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: "Poppins",
                                                fontSize: "16px",
                                                fontWeight: 700,
                                                textTransform: "none",
                                            }}
                                        >
                                            Download Alarm Report
                                        </span>
                                    </Button>
                                </a>
                            </Box>
                        )}
                    </Box>

                    {/* Dashboard table */}
                    {rows.length > 0 && (
                        <Box sx={{ mt: 4, px: { xs: 1, md: 3 } }}>
                            <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1.5 }}>
                                <TextField
                                    size="small"
                                    placeholder="Search Site ID, Bucket, Alarm..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ fontSize: 18, color: C.tealDark }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ minWidth: 260 }}
                                />
                            </Stack>
                            <AlarmReportTable rows={rows} search={search} />
                        </Box>
                    )}
                </Box>
            </Slide>
            {loading}
        </>
    );
};

export default AlarmLogUpload;