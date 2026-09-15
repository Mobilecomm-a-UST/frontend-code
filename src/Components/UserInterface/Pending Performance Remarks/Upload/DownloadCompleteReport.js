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
import { postDataa, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import { getDecreyptedData } from '../../../utils/localstorage'

const circleArray = ['AP', 'CH', 'KK', 'DL', 'HR', 'RJ', 'JK', 'WB', 'OD', 'MU', 'TNCH', 'UE', 'BH', 'UW', 'MP', 'PB', 'KO', 'JH', 'UPW']
const bandArray = ['4G', '5G', 'Accepted']
const archivedArray = ['Archived']

const tagArray = ['Workable', 'Non Workable']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatMonthToMMMYY = (monthInputValue) => {
    if (!monthInputValue) return '';
    const [year, month] = monthInputValue.split('-');
    const idx = parseInt(month, 10) - 1;
    if (idx < 0 || idx > 11 || !year) return '';
    return `${MONTH_NAMES[idx]}-${year.slice(-2)}`;
};

const isChronologicalOrder = (startValue, endValue) => {
    if (!startValue || !endValue) return false;
    const [startYear, startMonth] = startValue.split('-').map((v) => parseInt(v, 10));
    const [endYear, endMonth] = endValue.split('-').map((v) => parseInt(v, 10));
    if (!startYear || !startMonth || !endYear || !endMonth) return false;
    const startIndex = startYear * 12 + (startMonth - 1);
    const endIndex = endYear * 12 + (endMonth - 1);
    return startIndex <= endIndex;
};

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

const DownloadCompleteReport = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    /* ───────────────────────── 1. Upload Site Data ───────────────────────── */
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadFileError, setUploadFileError] = useState(false);
    const [uploadSummary, setUploadSummary] = useState(null);
    const userTypes = getDecreyptedData('user_type')?.split(",").map((t) => t.trim())

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
        const response = await postDataa("pending_performance_at_remarks/upload/", formData);
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
    const [tag, setTag] = useState("");
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
        const response = await postDataa("pending_performance_at_remarks/remarks/", formData);
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
    const [reportArchived, setReportArchived] = useState("");
    const [reportStartMonth, setReportStartMonth] = useState("");
    const [reportEndMonth, setReportEndMonth] = useState("");
    const [reportErrors, setReportErrors] = useState({ band: false, month: false, range: false });
    const [reportResult, setReportResult] = useState(null);

    // Remembers which download_urls key(s) the user actually asked for on
    // this submit (band and/or archived), so only the matching button(s)
    // are shown when the backend returns the plural "download_urls" shape.
    const [reportSelectedKeys, setReportSelectedKeys] = useState([]);

    const formattedStartMonth = formatMonthToMMMYY(reportStartMonth);
    const formattedEndMonth = formatMonthToMMMYY(reportEndMonth);
    const bothMonthsPicked = reportStartMonth !== "" && reportEndMonth !== "";
    const isRangeOrderInvalid = bothMonthsPicked && !isChronologicalOrder(reportStartMonth, reportEndMonth);

    const handleReportSubmit = async () => {
        const rangeIsValid = bothMonthsPicked && isChronologicalOrder(reportStartMonth, reportEndMonth);
        const isValid = rangeIsValid; // band is optional

        if (!isValid) {
            setReportErrors({
                band: false,
                month: !bothMonthsPicked,
                range: bothMonthsPicked && !rangeIsValid,
            });
            return;
        }

        action(true);
        const formData = new FormData();
        if (reportBand) {
            formData.append("band", reportBand);
        }
        formData.append("start_month", formattedStartMonth);
        formData.append("end_month", formattedEndMonth);
        if (reportArchived) {
            formData.append("archived", reportArchived);
        }

        const selectedKeys = [];
        if (reportBand) selectedKeys.push(reportBand);
        if (reportArchived) selectedKeys.push(reportArchived);
        setReportSelectedKeys(selectedKeys);

        const response = await postDataa("pending_performance_at_remarks/download/", formData);
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
        setReportArchived("");
        setReportStartMonth("");
        setReportEndMonth("");
        setReportErrors({ band: false, month: false, range: false });
        setReportResult(null);
        setReportSelectedKeys([]);
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
        const response = await postDataa("pending_performance_at_remarks/remarks-template/", formData);
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
        const response = await postDataa("pending_performance_at_remarks/remarks-template/upload/", formData);
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
                                </div>
                            </Box>

                            {userTypes?.includes('QT_AR') && <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Archived:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <FormControl sx={{ minWidth: 150 }}>
                                        <InputLabel id="report-archived-label">Select Archived</InputLabel>
                                        <Select
                                            labelId="report-archived-label"
                                            label="Select Archived"
                                            value={reportArchived}
                                            onChange={(e) => setReportArchived(e.target.value)}
                                        >
                                            {archivedArray.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </div>
                            </Box>}

                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Month Range:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
                                        <TextField
                                            size="small"
                                            type="month"
                                            label="From"
                                            InputLabelProps={{ shrink: true }}
                                            value={reportStartMonth}
                                            onChange={(e) => {
                                                setReportStartMonth(e.target.value);
                                                setReportErrors((p) => ({ ...p, month: false, range: false }));
                                            }}
                                            sx={{ minWidth: 170, bgcolor: "#fff" }}
                                        />
                                        <Typography sx={{ color: "text.secondary" }}>to</Typography>
                                        <TextField
                                            size="small"
                                            type="month"
                                            label="To"
                                            InputLabelProps={{ shrink: true }}
                                            value={reportEndMonth}
                                            inputProps={{ min: reportStartMonth || undefined }}
                                            onChange={(e) => {
                                                setReportEndMonth(e.target.value);
                                                setReportErrors((p) => ({ ...p, month: false, range: false }));
                                            }}
                                            sx={{ minWidth: 170, bgcolor: "#fff" }}
                                        />
                                    </Stack>

                                    {bothMonthsPicked && !isRangeOrderInvalid && !reportErrors.month && !reportErrors.range && (
                                        <div style={{ marginTop: 6 }}>
                                            <span style={{ color: "gray", fontSize: 14 }}>
                                                Will be sent as: start_month={formattedStartMonth}, end_month={formattedEndMonth}
                                            </span>
                                        </div>
                                    )}

                                    {reportErrors.month && (
                                        <div><span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>Please select both a start and end month!</span></div>
                                    )}
                                    {(reportErrors.range || isRangeOrderInvalid) && !reportErrors.month && (
                                        <div><span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>"From" month must be the same as or before the "To" month!</span></div>
                                    )}
                                </div>
                            </Box>

                            {/* UPDATED: backend can return either a singular "download_url"
                                string (band-only case) or a "download_urls" object with
                                multiple keys (archived / other cases). Both are handled here,
                                and only the button(s) matching what the user selected show. */}
                            {(reportResult?.download_url || reportResult?.download_urls) && (
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Report:</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                                            {reportResult?.download_url ? (
                                                <DownloadButton
                                                    url={reportResult.download_url}
                                                    label={`${reportResult.band || reportSelectedKeys[0] || ""} Report`}
                                                />
                                            ) : (
                                                (reportSelectedKeys.length > 0
                                                    ? reportSelectedKeys
                                                    : Object.keys(reportResult.download_urls)
                                                ).map((key) => (
                                                    reportResult.download_urls[key] && (
                                                        <DownloadButton
                                                            key={key}
                                                            url={reportResult.download_urls[key]}
                                                            label={`${key} Report`}
                                                        />
                                                    )
                                                ))
                                            )}
                                        </Stack>
                                    </div>
                                </Box>
                            )}
                        </Stack>

                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={2}>
                            <Button variant="contained" color="success" onClick={handleReportSubmit} endIcon={<UploadIcon />}>Submit</Button>
                            <Button variant="contained" onClick={handleReportCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
                        </Stack>
                    </StyledCard>

                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default DownloadCompleteReport;