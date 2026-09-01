import React, { useState, useEffect } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
    TextField, MenuItem, Select, InputLabel, FormControl, Divider,
    Chip, List, ListItem, ListItemText,
} from "@mui/material";
import {
    Upload as UploadIcon,
    DoDisturb as DoDisturbIcon,
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ─────────────────────────────────────────────────────────────────────────────
// 5 APIs on this page (base: pending_performance_at_remarks/):
//
// 1. upload/              key "file"                  -> upload site data, returns a summary object
// 2. remarks/              keys "site_id","circle",     -> add/update remarks for a site
//                          "additional_remarks","tag"
// 3. download/              keys "band","month"          -> generate + download a report (e.g. band="4G", month="Jul-26")
// 4. remarks-template/      key "circle"                 -> generate + download an input template
// 5. remarks-template/upload/  key "file"                -> upload a filled-in template back
//
// NOTE: circle list below is carried over from the other tool pages in this
// app plus "MU" confirmed by the template screenshot — confirm the full
// official list against the backend.
// ─────────────────────────────────────────────────────────────────────────────

const circleArray = ['AP', 'CH', 'KK', 'DL', 'HR', 'RJ', 'JK', 'WB', 'OD', 'MU', 'TNCH', 'UE', 'BH', 'UW', 'MP', 'PB', 'KO', 'JH', 'UPW']
const bandArray = ['4G', '5G']
const tagArray = ['Workable', 'Non Workable']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Converts a native <input type="month"> value ("2026-01") into the
// "MMM-YY" format the backend expects ("Jan-26").
const formatMonthToMMMYY = (monthInputValue) => {
    if (!monthInputValue) return '';
    const [year, month] = monthInputValue.split('-');
    const idx = parseInt(month, 10) - 1;
    if (idx < 0 || idx > 11 || !year) return '';
    return `${MONTH_NAMES[idx]}-${year.slice(-2)}`;
};

// A single "card" matching the teal-gradient / pill-header style used across
// the other tool pages (main_Box / Back_Box / Box_Hading from OverAllCss).
const StyledCard = ({ title, classes, children }) => (
    <Box className={classes.main_Box} sx={{ mb: 3 }}>
        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
            <Box className={classes.Box_Hading}>{title}</Box>
            <Box sx={{ mt: "-40px" }}>
                {children}
            </Box>
        </Box>
    </Box>
);

const SummaryGrid = ({ summary }) => {
    if (!summary) return null;
    const labels = {
        total_input_rows: "Total Input Rows",
        rows_with_empty_site_id: "Rows With Empty Site ID",
        input_rows_processed: "Input Rows Processed",
        created_4g: "Created (4G)",
        updated_4g: "Updated (4G)",
        created_5g: "Created (5G)",
        updated_5g: "Updated (5G)",
        created_accepted: "Created (Accepted)",
        updated_accepted: "Updated (Accepted)",
        moved_to_accepted: "Moved To Accepted",
        skipped_n2600: "Skipped (n2600)",
    };
    return (
        <Grid container spacing={1.5}>
            {Object.entries(summary).map(([key, value]) => (
                <Grid item xs={6} sm={4} md={3} key={key}>
                    <Box sx={{ p: 1.25, textAlign: "center", borderRadius: 2, bgcolor: "#fff", border: "1px solid #E0E0E0" }}>
                        <Typography variant="caption" color="text.secondary">{labels[key] || key}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{value}</Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

const DownloadButton = ({ url, label }) => {
    if (!url) return null;
    return (
        <a href={url} download target="_blank" rel="noreferrer">
            <Button
                variant="outlined"
                startIcon={<FileDownloadIcon sx={{ color: "green" }} />}
                sx={{ mt: 1, textTransform: "none", fontWeight: 700 }}
            >
                {label}
            </Button>
        </a>
    );
};

const PendingPerformanceAtRemarks = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    /* ───────────────────────── 1. Upload Site Data ───────────────────────── */
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadFileError, setUploadFileError] = useState(false);
    const [uploadSummary, setUploadSummary] = useState(null);

    const handleUploadFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
            setUploadFileError(false);
        }
    };

    const handleUploadSubmit = async () => {
        if (!uploadFile) {
            setUploadFileError(true);
            return;
        }
        action(true);
        const formData = new FormData();
        formData.append("file", uploadFile);
        const response = await postData("pending_performance_at_remarks/upload/", formData);
        action(false);
        if (response?.message) {
            setUploadSummary(response.summary || null);
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
        }
    };

    const handleUploadCancel = () => {
        setUploadFile(null);
        setUploadFileError(false);
        setUploadSummary(null);
    };

    /* ───────────────────────── 2. Add / Update Remarks ───────────────────────── */
    const [siteId, setSiteId] = useState("");
    const [remarksCircle, setRemarksCircle] = useState("");
    const [additionalRemarks, setAdditionalRemarks] = useState("");
    const [tag, setTag] = useState(""); // "Workable" | "Non Workable"
    const [remarksErrors, setRemarksErrors] = useState({ siteId: false, circle: false, tag: false });
    const [remarksResult, setRemarksResult] = useState(null);

    const handleRemarksSubmit = async () => {
        const isValid = siteId.trim() !== "" && remarksCircle !== "" && tag !== "";
        if (!isValid) {
            setRemarksErrors({
                siteId: siteId.trim() === "",
                circle: remarksCircle === "",
                tag: tag === "",
            });
            return;
        }
        action(true);
        const formData = new FormData();
        formData.append("site_id", siteId.trim());
        formData.append("circle", remarksCircle);
        formData.append("additional_remarks", additionalRemarks);
        formData.append("tag", tag);
        const response = await postData("pending_performance_at_remarks/remarks/", formData);
        action(false);
        if (response?.message) {
            setRemarksResult(response);
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
        }
    };

    const handleRemarksCancel = () => {
        setSiteId("");
        setRemarksCircle("");
        setAdditionalRemarks("");
        setTag("");
        setRemarksErrors({ siteId: false, circle: false, tag: false });
        setRemarksResult(null);
    };

    /* ───────────────────────── 3. Download Report ───────────────────────── */
    const [reportBand, setReportBand] = useState("");
    // Native month input value, e.g. "2026-01" — converted to "Jan-26" on submit.
    const [reportMonthValue, setReportMonthValue] = useState("");
    const [reportErrors, setReportErrors] = useState({ band: false, month: false });
    const [reportResult, setReportResult] = useState(null);

    const handleReportSubmit = async () => {
        const formattedMonth = formatMonthToMMMYY(reportMonthValue);
        const isValid = reportBand !== "" && formattedMonth !== "";
        if (!isValid) {
            setReportErrors({ band: reportBand === "", month: formattedMonth === "" });
            return;
        }
        action(true);
        const formData = new FormData();
        formData.append("band", reportBand);
        formData.append("month", formattedMonth);
        const response = await postData("pending_performance_at_remarks/download/", formData);
        action(false);
        if (response?.status) {
            setReportResult(response);
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
        }
    };

    const handleReportCancel = () => {
        setReportBand("");
        setReportMonthValue("");
        setReportErrors({ band: false, month: false });
        setReportResult(null);
    };

    /* ───────────────────────── 4. Download Template ───────────────────────── */
    const [templateCircle, setTemplateCircle] = useState("");
    const [templateError, setTemplateError] = useState(false);
    const [templateResult, setTemplateResult] = useState(null);

    const handleTemplateSubmit = async () => {
        if (templateCircle === "") {
            setTemplateError(true);
            return;
        }
        action(true);
        const formData = new FormData();
        formData.append("circle", templateCircle);
        const response = await postData("pending_performance_at_remarks/remarks-template/", formData);
        action(false);
        if (response?.status) {
            setTemplateResult(response);
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
        }
    };

    const handleTemplateCancel = () => {
        setTemplateCircle("");
        setTemplateError(false);
        setTemplateResult(null);
    };

    /* ───────────────────────── 5. Upload Updated Report ───────────────────────── */
    const [reportUploadFile, setReportUploadFile] = useState(null);
    const [reportUploadError, setReportUploadError] = useState(false);
    const [reportUploadResult, setReportUploadResult] = useState(null);

    const handleReportUploadFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReportUploadFile(file);
            setReportUploadError(false);
        }
    };

    const handleReportUploadSubmit = async () => {
        if (!reportUploadFile) {
            setReportUploadError(true);
            return;
        }
        action(true);
        const formData = new FormData();
        formData.append("file", reportUploadFile);
        const response = await postData("pending_performance_at_remarks/remarks-template/upload/", formData);
        action(false);
        if (response?.status) {
            setReportUploadResult(response);
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
        }
    };

    const handleReportUploadCancel = () => {
        setReportUploadFile(null);
        setReportUploadError(false);
        setReportUploadResult(null);
    };

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
    }, []);

    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Typography color="text.primary">Pending Performance At Remarks</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>

                    {/* 1. Upload Site Data */}
                    <StyledCard title="Upload Site Data" classes={classes}>
                        <Stack spacing={2}>
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select File:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <Button variant="contained" component="label" color={uploadFile ? "warning" : "primary"}>
                                        Select File
                                        <input hidden type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleUploadFileChange} />
                                    </Button>
                                    {uploadFile && <span style={{ color: "green", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>{uploadFile.name}</span>}
                                    {uploadFileError && <div><span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span></div>}
                                </div>
                            </Box>

                            {uploadSummary && (
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Summary:</div>
                                    <Box sx={{ p: 2 }}>
                                        <SummaryGrid summary={uploadSummary} />
                                    </Box>
                                </Box>
                            )}
                        </Stack>

                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
                            <Button variant="contained" color="success" onClick={handleUploadSubmit} endIcon={<UploadIcon />}>Submit</Button>
                            <Button variant="contained" onClick={handleUploadCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
                        </Stack>
                    </StyledCard>

                    {/* 2. Add / Update Remarks */}
                    <StyledCard title="Add / Update Remarks" classes={classes}>
                        <Stack spacing={2}>
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Site ID:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <TextField
                                        size="small"
                                        value={siteId}
                                        onChange={(e) => { setSiteId(e.target.value); setRemarksErrors((p) => ({ ...p, siteId: false })); }}
                                        sx={{ minWidth: 220, bgcolor: "#fff" }}
                                    />
                                    {remarksErrors.siteId && <div><span style={{ color: "red", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>This Field Is Required!</span></div>}
                                </div>
                            </Box>

                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Circle:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <FormControl sx={{ minWidth: 150 }}>
                                        <InputLabel id="remarks-circle-label">Select Circle</InputLabel>
                                        <Select
                                            labelId="remarks-circle-label"
                                            label="Select Circle"
                                            value={remarksCircle}
                                            onChange={(e) => { setRemarksCircle(e.target.value); setRemarksErrors((p) => ({ ...p, circle: false })); }}
                                        >
                                            {circleArray.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    {remarksErrors.circle && <div><span style={{ color: "red", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>This Field Is Required!</span></div>}
                                </div>
                            </Box>

                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Additional Remarks:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <TextField
                                        size="small"
                                        multiline
                                        minRows={2}
                                        value={additionalRemarks}
                                        onChange={(e) => setAdditionalRemarks(e.target.value)}
                                        sx={{ minWidth: 300, bgcolor: "#fff" }}
                                    />
                                </div>
                            </Box>

                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Tag:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <FormControl sx={{ minWidth: 170 }}>
                                        <InputLabel id="remarks-tag-label">Select Tag</InputLabel>
                                        <Select
                                            labelId="remarks-tag-label"
                                            label="Select Tag"
                                            value={tag}
                                            onChange={(e) => { setTag(e.target.value); setRemarksErrors((p) => ({ ...p, tag: false })); }}
                                        >
                                            {tagArray.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    {remarksErrors.tag && <div><span style={{ color: "red", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>This Field Is Required!</span></div>}
                                </div>
                            </Box>

                            {remarksResult && (
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Result:</div>
                                    <Box sx={{ p: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Site <strong>{remarksResult.site_id}</strong> updated in:
                                        </Typography>
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            {(remarksResult.updated_in || []).map((band, i) => (
                                                <Chip key={i} label={band} color="success" size="small" sx={{ mb: 1 }} />
                                            ))}
                                        </Stack>
                                    </Box>
                                </Box>
                            )}
                        </Stack>

                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
                            <Button variant="contained" color="success" onClick={handleRemarksSubmit} endIcon={<UploadIcon />}>Submit</Button>
                            <Button variant="contained" onClick={handleRemarksCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
                        </Stack>
                    </StyledCard>

                    {/* 3. Download Report */}
                    <StyledCard title="Download Report" classes={classes}>
                        <Stack spacing={2}>
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Band:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <FormControl sx={{ minWidth: 150 }}>
                                        <InputLabel id="report-band-label">Select Band</InputLabel>
                                        <Select
                                            labelId="report-band-label"
                                            label="Select Band"
                                            value={reportBand}
                                            onChange={(e) => { setReportBand(e.target.value); setReportErrors((p) => ({ ...p, band: false })); }}
                                        >
                                            {bandArray.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    {reportErrors.band && <div><span style={{ color: "red", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>This Field Is Required!</span></div>}
                                </div>
                            </Box>

                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Month:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    {/* Native month picker — opens a calendar-style month/year grid.
                                        Value ("2026-01") is converted to "Jan-26" before being sent. */}
                                    <TextField
                                        size="small"
                                        type="month"
                                        InputLabelProps={{ shrink: true }}
                                        value={reportMonthValue}
                                        onChange={(e) => { setReportMonthValue(e.target.value); setReportErrors((p) => ({ ...p, month: false })); }}
                                        sx={{ minWidth: 180, bgcolor: "#fff" }}
                                    />
                                    {reportMonthValue && !reportErrors.month && (
                                        <span style={{ color: "gray", fontSize: 14, marginLeft: 10 }}>
                                            Will be sent as: {formatMonthToMMMYY(reportMonthValue)}
                                        </span>
                                    )}
                                    {reportErrors.month && <div><span style={{ color: "red", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>This Field Is Required!</span></div>}
                                </div>
                            </Box>

                            {reportResult?.download_url && (
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Report:</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <DownloadButton url={reportResult?.download_url} label={`${reportResult?.band || ""} Report`} />
                                    </div>
                                </Box>
                            )}
                        </Stack>

                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
                            <Button variant="contained" color="success" onClick={handleReportSubmit} endIcon={<UploadIcon />}>Submit</Button>
                            <Button variant="contained" onClick={handleReportCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
                        </Stack>
                    </StyledCard>

                    {/* 4. Download Input Template */}
                    <StyledCard title="Download Input Template" classes={classes}>
                        <Stack spacing={2}>
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Circle:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <FormControl sx={{ minWidth: 150 }}>
                                        <InputLabel id="template-circle-label">Select Circle</InputLabel>
                                        <Select
                                            labelId="template-circle-label"
                                            label="Select Circle"
                                            value={templateCircle}
                                            onChange={(e) => { setTemplateCircle(e.target.value); setTemplateError(false); }}
                                        >
                                            {circleArray.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    {templateError && <div><span style={{ color: "red", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>This Field Is Required!</span></div>}
                                </div>
                            </Box>

                            {templateResult && (
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Result:</div>
                                    <Box sx={{ p: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{templateResult.message}</Typography>
                                        <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
                                            {(templateResult.circle_filter || []).map((c, i) => (
                                                <Chip key={i} label={c} size="small" />
                                            ))}
                                        </Stack>
                                        <DownloadButton url={templateResult?.download_url} label="Download Template" />
                                    </Box>
                                </Box>
                            )}
                        </Stack>

                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
                            <Button variant="contained" color="success" onClick={handleTemplateSubmit} endIcon={<UploadIcon />}>Submit</Button>
                            <Button variant="contained" onClick={handleTemplateCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
                        </Stack>
                    </StyledCard>

                    {/* 5. Upload Updated Report */}
                    <StyledCard title="Upload Updated Report" classes={classes}>
                        <Stack spacing={2}>
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select File:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <Button variant="contained" component="label" color={reportUploadFile ? "warning" : "primary"}>
                                        Select File
                                        <input hidden type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleReportUploadFileChange} />
                                    </Button>
                                    {reportUploadFile && <span style={{ color: "green", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>{reportUploadFile.name}</span>}
                                    {reportUploadError && <div><span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span></div>}
                                </div>
                            </Box>

                            {reportUploadResult && (
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Result:</div>
                                    <Box sx={{ p: 2 }}>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={6} sm={4}>
                                                <Box sx={{ p: 1.25, textAlign: "center", borderRadius: 2, bgcolor: "#fff", border: "1px solid #E0E0E0" }}>
                                                    <Typography variant="caption" color="text.secondary">Updated</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{reportUploadResult.updated}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6} sm={4}>
                                                <Box sx={{ p: 1.25, textAlign: "center", borderRadius: 2, bgcolor: "#fff", border: "1px solid #E0E0E0" }}>
                                                    <Typography variant="caption" color="text.secondary">Skipped Blank Rows</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{reportUploadResult.skipped_blank_rows}</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        {reportUploadResult.not_found && reportUploadResult.not_found.length > 0 && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Not Found:</Typography>
                                                <List dense sx={{ maxHeight: 200, overflow: "auto", bgcolor: "#fff", borderRadius: 1 }}>
                                                    {reportUploadResult.not_found.map((item, i) => (
                                                        <ListItem key={i}>
                                                            <ListItemText primary={item} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </Stack>

                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
                            <Button variant="contained" color="success" onClick={handleReportUploadSubmit} endIcon={<UploadIcon />}>Submit</Button>
                            <Button variant="contained" onClick={handleReportUploadCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
                        </Stack>
                    </StyledCard>

                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default PendingPerformanceAtRemarks;


// import React, { useState, useEffect } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
//     TextField, MenuItem, Select, InputLabel, FormControl, Divider,
//     Chip, List, ListItem, ListItemText, Paper,
// } from "@mui/material";
// import {
//     Upload as UploadIcon,
//     DoDisturb as DoDisturbIcon,
//     FileDownload as FileDownloadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
//     CloudUpload as CloudUploadIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postData, ServerURL } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// // ─────────────────────────────────────────────────────────────────────────────
// // 5 APIs on this page (base: pending_performance_at_remarks/):
// //
// // 1. upload/              key "file"                  -> upload site data, returns a summary object
// // 2. remarks/              keys "site_id","circle",     -> add/update remarks for a site
// //                          "additional_remarks","tag"
// // 3. download/              keys "band","month"          -> generate + download a report (e.g. band="4G", month="Jul-26")
// // 4. remarks-template/      key "circle"                 -> generate + download an input template
// // 5. remarks-template/upload/  key "file"                -> upload a filled-in template back
// //
// // NOTE: circle list below is carried over from the other tool pages in this
// // app plus "MU" confirmed by the template screenshot — confirm the full
// // official list against the backend.
// // ─────────────────────────────────────────────────────────────────────────────

// const circleArray = ['AP', 'CH', 'KK', 'DL', 'HR', 'RJ', 'JK', 'WB', 'OD', 'MU', 'TNCH', 'UE', 'BH', 'UW', 'MP', 'PB', 'KO', 'JH', 'UPW']
// const bandArray = ['4G', '5G']
// const tagArray = ['Workable', 'Non Workable']
// const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// // Converts a native <input type="month"> value ("2026-01") into the
// // "MMM-YY" format the backend expects ("Jan-26").
// const formatMonthToMMMYY = (monthInputValue) => {
//     if (!monthInputValue) return '';
//     const [year, month] = monthInputValue.split('-');
//     const idx = parseInt(month, 10) - 1;
//     if (idx < 0 || idx > 11 || !year) return '';
//     return `${MONTH_NAMES[idx]}-${year.slice(-2)}`;
// };

// const SectionCard = ({ title, children }) => (
//     <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #E0E0E0" }}>
//         <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{title}</Typography>
//         {children}
//     </Paper>
// );

// const SummaryGrid = ({ summary }) => {
//     if (!summary) return null;
//     const labels = {
//         total_input_rows: "Total Input Rows",
//         rows_with_empty_site_id: "Rows With Empty Site ID",
//         input_rows_processed: "Input Rows Processed",
//         created_4g: "Created (4G)",
//         updated_4g: "Updated (4G)",
//         created_5g: "Created (5G)",
//         updated_5g: "Updated (5G)",
//         created_accepted: "Created (Accepted)",
//         updated_accepted: "Updated (Accepted)",
//         moved_to_accepted: "Moved To Accepted",
//         skipped_n2600: "Skipped (n2600)",
//     };
//     return (
//         <Grid container spacing={1.5} sx={{ mt: 1 }}>
//             {Object.entries(summary).map(([key, value]) => (
//                 <Grid item xs={6} sm={4} md={3} key={key}>
//                     <Paper variant="outlined" sx={{ p: 1.25, textAlign: "center", borderRadius: 2 }}>
//                         <Typography variant="caption" color="text.secondary">{labels[key] || key}</Typography>
//                         <Typography variant="h6" sx={{ fontWeight: 800 }}>{value}</Typography>
//                     </Paper>
//                 </Grid>
//             ))}
//         </Grid>
//     );
// };

// const FileUploadButton = ({ label, file, onChange, accept, error }) => (
//     <Box>
//         <Button variant="contained" component="label" color={file ? "warning" : "primary"} startIcon={<CloudUploadIcon />}>
//             {label}
//             <input hidden type="file" accept={accept} onChange={onChange} />
//         </Button>
//         {file && (
//             <Typography component="span" sx={{ color: "green", fontWeight: 600, ml: 2 }}>
//                 {file.name}
//             </Typography>
//         )}
//         {error && (
//             <Typography sx={{ color: "red", fontWeight: 600, mt: 0.5 }}>
//                 This Field Is Required!
//             </Typography>
//         )}
//     </Box>
// );

// const DownloadButton = ({ url, label }) => {
//     if (!url) return null;
//     return (
//         <a href={url} download target="_blank" rel="noreferrer">
//             <Button
//                 variant="outlined"
//                 startIcon={<FileDownloadIcon sx={{ color: "green" }} />}
//                 sx={{ mt: 2, textTransform: "none", fontWeight: 700 }}
//             >
//                 {label}
//             </Button>
//         </a>
//     );
// };

// const PendingPerformanceAtRemarks = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();
//     const classes = OverAllCss();

//     /* ───────────────────────── 1. Upload Site Data ───────────────────────── */
//     const [uploadFile, setUploadFile] = useState(null);
//     const [uploadFileError, setUploadFileError] = useState(false);
//     const [uploadSummary, setUploadSummary] = useState(null);

//     const handleUploadFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setUploadFile(file);
//             setUploadFileError(false);
//         }
//     };

//     const handleUploadSubmit = async () => {
//         if (!uploadFile) {
//             setUploadFileError(true);
//             return;
//         }
//         action(true);
//         const formData = new FormData();
//         formData.append("file", uploadFile);
//         const response = await postData("pending_performance_at_remarks/upload/", formData);
//         action(false);
//         if (response?.message) {
//             setUploadSummary(response.summary || null);
//             Swal.fire({ icon: "success", title: "Done", text: response.message });
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
//         }
//     };

//     const handleUploadCancel = () => {
//         setUploadFile(null);
//         setUploadFileError(false);
//         setUploadSummary(null);
//     };

//     /* ───────────────────────── 2. Add / Update Remarks ───────────────────────── */
//     const [siteId, setSiteId] = useState("");
//     const [remarksCircle, setRemarksCircle] = useState("");
//     const [additionalRemarks, setAdditionalRemarks] = useState("");
//     const [tag, setTag] = useState(""); // "Workable" | "Non Workable"
//     const [remarksErrors, setRemarksErrors] = useState({ siteId: false, circle: false, tag: false });
//     const [remarksResult, setRemarksResult] = useState(null);

//     const handleRemarksSubmit = async () => {
//         const isValid = siteId.trim() !== "" && remarksCircle !== "" && tag !== "";
//         if (!isValid) {
//             setRemarksErrors({
//                 siteId: siteId.trim() === "",
//                 circle: remarksCircle === "",
//                 tag: tag === "",
//             });
//             return;
//         }
//         action(true);
//         const formData = new FormData();
//         formData.append("site_id", siteId.trim());
//         formData.append("circle", remarksCircle);
//         formData.append("additional_remarks", additionalRemarks);
//         formData.append("tag", tag);
//         const response = await postData("pending_performance_at_remarks/remarks/", formData);
//         action(false);
//         if (response?.message) {
//             setRemarksResult(response);
//             Swal.fire({ icon: "success", title: "Done", text: response.message });
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
//         }
//     };

//     const handleRemarksCancel = () => {
//         setSiteId("");
//         setRemarksCircle("");
//         setAdditionalRemarks("");
//         setTag("");
//         setRemarksErrors({ siteId: false, circle: false, tag: false });
//         setRemarksResult(null);
//     };

//     /* ───────────────────────── 3. Download Report ───────────────────────── */
//     const [reportBand, setReportBand] = useState("");
//     // Native month input value, e.g. "2026-01" — converted to "Jan-26" on submit.
//     const [reportMonthValue, setReportMonthValue] = useState("");
//     const [reportErrors, setReportErrors] = useState({ band: false, month: false });
//     const [reportResult, setReportResult] = useState(null);

//     const handleReportSubmit = async () => {
//         const formattedMonth = formatMonthToMMMYY(reportMonthValue);
//         const isValid = reportBand !== "" && formattedMonth !== "";
//         if (!isValid) {
//             setReportErrors({ band: reportBand === "", month: formattedMonth === "" });
//             return;
//         }
//         action(true);
//         const formData = new FormData();
//         formData.append("band", reportBand);
//         formData.append("month", formattedMonth);
//         const response = await postData("pending_performance_at_remarks/download/", formData);
//         action(false);
//         if (response?.status) {
//             setReportResult(response);
//             Swal.fire({ icon: "success", title: "Done", text: response.message });
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
//         }
//     };

//     const handleReportCancel = () => {
//         setReportBand("");
//         setReportMonthValue("");
//         setReportErrors({ band: false, month: false });
//         setReportResult(null);
//     };

//     /* ───────────────────────── 4. Download Template ───────────────────────── */
//     const [templateCircle, setTemplateCircle] = useState("");
//     const [templateError, setTemplateError] = useState(false);
//     const [templateResult, setTemplateResult] = useState(null);

//     const handleTemplateSubmit = async () => {
//         if (templateCircle === "") {
//             setTemplateError(true);
//             return;
//         }
//         action(true);
//         const formData = new FormData();
//         formData.append("circle", templateCircle);
//         const response = await postData("pending_performance_at_remarks/remarks-template/", formData);
//         action(false);
//         if (response?.status) {
//             setTemplateResult(response);
//             Swal.fire({ icon: "success", title: "Done", text: response.message });
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
//         }
//     };

//     const handleTemplateCancel = () => {
//         setTemplateCircle("");
//         setTemplateError(false);
//         setTemplateResult(null);
//     };

//     /* ───────────────────────── 5. Upload Updated Report ───────────────────────── */
//     const [reportUploadFile, setReportUploadFile] = useState(null);
//     const [reportUploadError, setReportUploadError] = useState(false);
//     const [reportUploadResult, setReportUploadResult] = useState(null);

//     const handleReportUploadFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setReportUploadFile(file);
//             setReportUploadError(false);
//         }
//     };

//     const handleReportUploadSubmit = async () => {
//         if (!reportUploadFile) {
//             setReportUploadError(true);
//             return;
//         }
//         action(true);
//         const formData = new FormData();
//         formData.append("file", reportUploadFile);
//         const response = await postData("pending_performance_at_remarks/remarks-template/upload/", formData);
//         action(false);
//         if (response?.status) {
//             setReportUploadResult(response);
//             Swal.fire({ icon: "success", title: "Done", text: response.message });
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
//         }
//     };

//     const handleReportUploadCancel = () => {
//         setReportUploadFile(null);
//         setReportUploadError(false);
//         setReportUploadResult(null);
//     };

//     useEffect(() => {
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
//     }, []);

//     return (
//         <>
//             <Box m={1} ml={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Typography color="text.primary">Pending Performance At Remarks</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Slide direction="left" in timeout={1000}>
//                 <Box sx={{ px: { xs: 1, md: 3 }, pb: 4 }}>
//                     <Stack spacing={3}>

//                         {/* 1. Upload Site Data */}
//                         <SectionCard title="1. Upload Site Data">
//                             <Stack spacing={2}>
//                                 <FileUploadButton
//                                     label="Select File"
//                                     file={uploadFile}
//                                     onChange={handleUploadFileChange}
//                                     accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
//                                     error={uploadFileError}
//                                 />
//                                 <SummaryGrid summary={uploadSummary} />
//                                 <Stack direction="row" spacing={2} justifyContent="flex-end">
//                                     <Button variant="contained" color="success" onClick={handleUploadSubmit} endIcon={<UploadIcon />}>Submit</Button>
//                                     <Button variant="contained" onClick={handleUploadCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
//                                 </Stack>
//                             </Stack>
//                         </SectionCard>

//                         {/* 2. Add / Update Remarks */}
//                         <SectionCard title="2. Add / Update Remarks">
//                             <Grid container spacing={2}>
//                                 <Grid item xs={12} sm={6}>
//                                     <TextField
//                                         label="Site ID"
//                                         fullWidth
//                                         value={siteId}
//                                         onChange={(e) => { setSiteId(e.target.value); setRemarksErrors((p) => ({ ...p, siteId: false })); }}
//                                         error={remarksErrors.siteId}
//                                         helperText={remarksErrors.siteId ? "This Field Is Required!" : ""}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     <FormControl fullWidth error={remarksErrors.circle}>
//                                         <InputLabel id="remarks-circle-label">Circle</InputLabel>
//                                         <Select
//                                             labelId="remarks-circle-label"
//                                             label="Circle"
//                                             value={remarksCircle}
//                                             onChange={(e) => { setRemarksCircle(e.target.value); setRemarksErrors((p) => ({ ...p, circle: false })); }}
//                                         >
//                                             {circleArray.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
//                                         </Select>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     <TextField
//                                         label="Additional Remarks"
//                                         fullWidth
//                                         multiline
//                                         minRows={2}
//                                         value={additionalRemarks}
//                                         onChange={(e) => setAdditionalRemarks(e.target.value)}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     <FormControl fullWidth error={remarksErrors.tag}>
//                                         <InputLabel id="remarks-tag-label">Tag</InputLabel>
//                                         <Select
//                                             labelId="remarks-tag-label"
//                                             label="Tag"
//                                             value={tag}
//                                             onChange={(e) => { setTag(e.target.value); setRemarksErrors((p) => ({ ...p, tag: false })); }}
//                                         >
//                                             {tagArray.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
//                                         </Select>
//                                     </FormControl>
//                                 </Grid>
//                             </Grid>

//                             {remarksResult && (
//                                 <Box sx={{ mt: 2 }}>
//                                     <Divider sx={{ mb: 1.5 }} />
//                                     <Typography variant="body2" sx={{ mb: 1 }}>
//                                         Site <strong>{remarksResult.site_id}</strong> updated in:
//                                     </Typography>
//                                     <Stack direction="row" spacing={1} flexWrap="wrap">
//                                         {(remarksResult.updated_in || []).map((band, i) => (
//                                             <Chip key={i} label={band} color="success" size="small" sx={{ mb: 1 }} />
//                                         ))}
//                                     </Stack>
//                                 </Box>
//                             )}

//                             <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
//                                 <Button variant="contained" color="success" onClick={handleRemarksSubmit} endIcon={<UploadIcon />}>Submit</Button>
//                                 <Button variant="contained" onClick={handleRemarksCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
//                             </Stack>
//                         </SectionCard>

//                         {/* 3. Download Report */}
//                         <SectionCard title="3. Download Report">
//                             <Grid container spacing={2}>
//                                 <Grid item xs={12} sm={6}>
//                                     <FormControl fullWidth error={reportErrors.band}>
//                                         <InputLabel id="report-band-label">Band</InputLabel>
//                                         <Select
//                                             labelId="report-band-label"
//                                             label="Band"
//                                             value={reportBand}
//                                             onChange={(e) => { setReportBand(e.target.value); setReportErrors((p) => ({ ...p, band: false })); }}
//                                         >
//                                             {bandArray.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
//                                         </Select>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     {/* Native month picker — opens a calendar-style month/year grid in
//                                         the browser. Value comes back as "YYYY-MM" (e.g. "2026-01") and
//                                         is converted to "Jan-26" before being sent to the backend. */}
//                                     <TextField
//                                         label="Month"
//                                         type="month"
//                                         fullWidth
//                                         InputLabelProps={{ shrink: true }}
//                                         value={reportMonthValue}
//                                         onChange={(e) => { setReportMonthValue(e.target.value); setReportErrors((p) => ({ ...p, month: false })); }}
//                                         error={reportErrors.month}
//                                         helperText={
//                                             reportErrors.month
//                                                 ? "This Field Is Required!"
//                                                 : (reportMonthValue ? `Will be sent as: ${formatMonthToMMMYY(reportMonthValue)}` : "Pick a month")
//                                         }
//                                     />
//                                 </Grid>
//                             </Grid>

//                             <DownloadButton url={reportResult?.download_url} label={`${reportResult?.band || ""} Report`} />

//                             <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
//                                 <Button variant="contained" color="success" onClick={handleReportSubmit} endIcon={<UploadIcon />}>Submit</Button>
//                                 <Button variant="contained" onClick={handleReportCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
//                             </Stack>
//                         </SectionCard>

//                         {/* 4. Download Input Template */}
//                         <SectionCard title="4. Download Input Template">
//                             <FormControl fullWidth error={templateError} sx={{ maxWidth: 300 }}>
//                                 <InputLabel id="template-circle-label">Circle</InputLabel>
//                                 <Select
//                                     labelId="template-circle-label"
//                                     label="Circle"
//                                     value={templateCircle}
//                                     onChange={(e) => { setTemplateCircle(e.target.value); setTemplateError(false); }}
//                                 >
//                                     {circleArray.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
//                                 </Select>
//                             </FormControl>

//                             {templateResult && (
//                                 <Box sx={{ mt: 2 }}>
//                                     <Typography variant="body2" color="text.secondary">{templateResult.message}</Typography>
//                                     <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
//                                         {(templateResult.circle_filter || []).map((c, i) => (
//                                             <Chip key={i} label={c} size="small" />
//                                         ))}
//                                     </Stack>
//                                 </Box>
//                             )}

//                             <DownloadButton url={templateResult?.download_url} label="Download Template" />

//                             <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
//                                 <Button variant="contained" color="success" onClick={handleTemplateSubmit} endIcon={<UploadIcon />}>Submit</Button>
//                                 <Button variant="contained" onClick={handleTemplateCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
//                             </Stack>
//                         </SectionCard>

//                         {/* 5. Upload Updated Report */}
//                         <SectionCard title="5. Upload Updated Report">
//                             <Stack spacing={2}>
//                                 <FileUploadButton
//                                     label="Select File"
//                                     file={reportUploadFile}
//                                     onChange={handleReportUploadFileChange}
//                                     accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
//                                     error={reportUploadError}
//                                 />

//                                 {reportUploadResult && (
//                                     <Box>
//                                         <Grid container spacing={1.5}>
//                                             <Grid item xs={6} sm={4}>
//                                                 <Paper variant="outlined" sx={{ p: 1.25, textAlign: "center", borderRadius: 2 }}>
//                                                     <Typography variant="caption" color="text.secondary">Updated</Typography>
//                                                     <Typography variant="h6" sx={{ fontWeight: 800 }}>{reportUploadResult.updated}</Typography>
//                                                 </Paper>
//                                             </Grid>
//                                             <Grid item xs={6} sm={4}>
//                                                 <Paper variant="outlined" sx={{ p: 1.25, textAlign: "center", borderRadius: 2 }}>
//                                                     <Typography variant="caption" color="text.secondary">Skipped Blank Rows</Typography>
//                                                     <Typography variant="h6" sx={{ fontWeight: 800 }}>{reportUploadResult.skipped_blank_rows}</Typography>
//                                                 </Paper>
//                                             </Grid>
//                                         </Grid>

//                                         {reportUploadResult.not_found && reportUploadResult.not_found.length > 0 && (
//                                             <Box sx={{ mt: 2 }}>
//                                                 <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Not Found:</Typography>
//                                                 <List dense sx={{ maxHeight: 200, overflow: "auto", bgcolor: "#FAFAFA", borderRadius: 1 }}>
//                                                     {reportUploadResult.not_found.map((item, i) => (
//                                                         <ListItem key={i}>
//                                                             <ListItemText primary={item} />
//                                                         </ListItem>
//                                                     ))}
//                                                 </List>
//                                             </Box>
//                                         )}
//                                     </Box>
//                                 )}

//                                 <Stack direction="row" spacing={2} justifyContent="flex-end">
//                                     <Button variant="contained" color="success" onClick={handleReportUploadSubmit} endIcon={<UploadIcon />}>Submit</Button>
//                                     <Button variant="contained" onClick={handleReportUploadCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
//                                 </Stack>
//                             </Stack>
//                         </SectionCard>

//                     </Stack>
//                 </Box>
//             </Slide>

//             {loading}
//         </>
//     );
// };

// export default PendingPerformanceAtRemarks;