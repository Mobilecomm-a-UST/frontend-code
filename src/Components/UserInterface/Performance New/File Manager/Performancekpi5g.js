

import React, { useState } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
    IconButton, TextField, Tooltip, Chip, CircularProgress,
    InputAdornment, Autocomplete,
} from "@mui/material";
import {
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    Assessment as AssessmentIcon,
    FilterAlt as FilterAltIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ─── theme constants (matches the rest of the Microwave/Ceragon tools) ──────
const TEAL = "#2a77bf";
const TEAL_DARK = "#28538c";

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        fontSize: 13,
        "&:hover fieldset": { borderColor: TEAL },
        "&.Mui-focused fieldset": { borderColor: TEAL },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
};

const GENERATE_REPORT_ENDPOINT = "kpi_monitoring/generate-kpi-monitoring-report/";
const FILTER_REPORT_ENDPOINT = "kpi_monitoring/filter-kpi-report/";

// Pulls a downloadable file URL out of whatever shape an API responds with.
const extractDownloadUrl = (res) =>
    res?.download_url ?? res?.file_url ?? res?.url ?? null;

// Appends the row count (e.g. "rows_written": 315 from the API response) onto
// the success message, when the backend provides it — so the user sees
// something like "KPI monitoring report generated successfully. (315 rows written)".
const withRowsWritten = (message, payload) => {
    const base = message || "Report generated.";
    const rows = payload?.rows_written;
    return typeof rows === "number" ? `${base} (${rows} rows written)` : base;
};

// postData may hand back either the plain JSON body ({status, message, ...})
// OR an axios-style wrapper ({data: {...}, status: 400, headers: ...}) where
// "status" is the HTTP status code, not the API's own boolean status flag.
// Mixing these up is exactly what caused a 400 to be read as success (400 is
// not strictly-equal to false, so a naive `res.status !== false` check
// always passed). This unwraps to the real API payload either way, and also
// flags a hard HTTP error status so that's never missed either.
const getApiResult = (res) => {
    const looksWrapped =
        res && typeof res === "object" &&
        res.data && typeof res.data === "object" &&
        ("status" in res.data || "message" in res.data || "error" in res.data);

    const payload = looksWrapped ? res.data : res;
    const httpStatus = typeof res?.status === "number" ? res.status : null;
    const isHttpError = httpStatus !== null && httpStatus >= 400;
    const success = !isHttpError && payload?.status !== false;

    return { payload, success, httpStatus };
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const Performancekpi5g = () => {
    const classes = OverAllCss();
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();

    // ── Overall report generation ────────────────────────────────────────────────
    const [generating, setGenerating] = useState(false);
    const [reportDownloadUrl, setReportDownloadUrl] = useState(null);
    const [reportMessage, setReportMessage] = useState(null);

    const handleGenerateReport = async () => {
        setGenerating(true);
        action(true);
        try {
            const res = await postData(GENERATE_REPORT_ENDPOINT, new FormData());
            const { payload, success } = getApiResult(res);
            const downloadUrl = extractDownloadUrl(payload);
            if (success) {
                setReportDownloadUrl(downloadUrl);
                const msg = withRowsWritten(payload?.message || "KPI monitoring report generated.", payload);
                setReportMessage(msg);
                Swal.fire("Done", msg, "success");
            } else {
                Swal.fire("Oops...", payload?.error || payload?.message || "Report generation failed.", "error");
            }
        } catch {
            Swal.fire("Error", "Something went wrong while generating the report.", "error");
        } finally {
            setGenerating(false);
            action(false);
        }
    };

    // ── Filtered KPI report (site_id/short_name + circle) ───────────────────────
    // No live table anymore — this section is purely "enter filters, click
    // Generate Report, get a download link back" from filter-kpi-report/.
    const [siteIds, setSiteIds] = useState([]);
    const [siteInputValue, setSiteInputValue] = useState("");
    const [circleQuery, setCircleQuery] = useState("");

    const [filteredReportGenerating, setFilteredReportGenerating] = useState(false);
    const [filteredReportDownloadUrl, setFilteredReportDownloadUrl] = useState(null);
    const [filteredReportMessage, setFilteredReportMessage] = useState(null);
    const [filteredReportError, setFilteredReportError] = useState(null);

    // Splits pasted/typed text on commas, semicolons, or newlines so a whole
    // batch of Site IDs can be dropped in at once.
    const splitSiteIds = (text) =>
        text.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);

    const handleSitePaste = (e) => {
        const text = e.clipboardData?.getData("text") ?? "";
        if (/[\n,;]/.test(text)) {
            e.preventDefault();
            const parts = splitSiteIds(text);
            setSiteIds((prev) => Array.from(new Set([...prev, ...parts])));
            setSiteInputValue("");
        }
    };

    // Merges the already-committed chips (siteIds) with whatever is still
    // sitting uncommitted in the text box (siteInputValue). Previously, typing
    // a Site ID and clicking "Generate Report" WITHOUT first pressing Enter
    // meant that text never became a chip, so it silently never made it into
    // the request — this is what dropped "BHBIH-97" from the payload. Now any
    // leftover text is folded in at submit time regardless.
    const getAllSiteIds = () => {
        const leftover = splitSiteIds(siteInputValue);
        return Array.from(new Set([...siteIds, ...leftover]));
    };

    // Sent as a single comma-joined string under "site_id"/"short_name" —
    // if your backend instead expects a JSON array or repeated form fields
    // for multi-value lookups, this is the one spot to adjust.
    const buildFilterFormData = (sites, circle) => {
        const sitesTrimmed = sites.map((s) => s.trim()).filter(Boolean);
        const circleTrimmed = circle.trim();
        const formData = new FormData();
        if (sitesTrimmed.length > 0) {
            const joined = sitesTrimmed.join(",");
            formData.append("site_id", joined);
            formData.append("short_name", joined);
        }
        if (circleTrimmed) formData.append("circle", circleTrimmed);
        return { formData, sitesTrimmed, circleTrimmed };
    };

    // Single on-demand action: click Generate Report → call filter-kpi-report/
    // with the current Site ID(s)/Circle → show a download link.
    const handleGenerateFilteredReport = async () => {
        const allSites = getAllSiteIds();
        const { formData, sitesTrimmed, circleTrimmed } = buildFilterFormData(allSites, circleQuery);

        if (sitesTrimmed.length === 0 && !circleTrimmed) {
            Swal.fire("Almost there", "Enter a Site ID / Short Name or Circle first.", "info");
            return;
        }

        // Commit any leftover typed text into chips now too, so the UI
        // reflects exactly what was sent.
        if (sitesTrimmed.length !== siteIds.length) {
            setSiteIds(sitesTrimmed);
            setSiteInputValue("");
        }

        setFilteredReportGenerating(true);
        setFilteredReportError(null);
        action(true);
        try {
            const res = await postData(FILTER_REPORT_ENDPOINT, formData);
            const { payload, success } = getApiResult(res);
            const downloadUrl = extractDownloadUrl(payload);
            if (success) {
                setFilteredReportDownloadUrl(downloadUrl);
                const msg = withRowsWritten(payload?.message || "Filtered KPI report generated.", payload);
                setFilteredReportMessage(msg);
                Swal.fire("Done", msg, "success");
            } else {
                setFilteredReportDownloadUrl(null);
                setFilteredReportMessage(null);
                const errMsg = payload?.error || payload?.message || "Report generation failed.";
                setFilteredReportError(errMsg);
                Swal.fire("Oops...", errMsg, "error");
            }
        } catch (err) {
            setFilteredReportError(err?.message || "Something went wrong while generating the report.");
            Swal.fire("Error", "Something went wrong while generating the report.", "error");
        } finally {
            setFilteredReportGenerating(false);
            action(false);
        }
    };

    const handleResetFilters = () => {
        setSiteIds([]);
        setSiteInputValue("");
        setCircleQuery("");
        setFilteredReportDownloadUrl(null);
        setFilteredReportMessage(null);
        setFilteredReportError(null);
    };

    // Explicit clear just for the Site ID / Short Name field — clears both the
    // committed chips AND any text still sitting in the input box.
    const handleClearSiteIds = () => {
        setSiteIds([]);
        setSiteInputValue("");
    };

    // ─── render ───────────────────────────────────────────────────────────────────
    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
                      Performance At
                    </Link>
                    <Typography color="text.primary">Performance 5G KPI</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "82%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>KPI Monitoring Report</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>

                                {/* ── GENERATE OVERALL REPORT ── */}
                                <Box className={classes.Front_Box}>
                                    <Box display="flex" alignItems="center" gap={0.8} mb={1.2}>
                                        <AssessmentIcon sx={{ fontSize: 18, color: TEAL }} />
                                        <Typography className="Front_Box_Hading" fontWeight={700} fontSize={16}>
                                            Generate Overall KPI Monitoring Report
                                        </Typography>
                                    </Box>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleGenerateReport}
                                            disabled={generating}
                                            startIcon={generating ? <CircularProgress size={14} color="inherit" /> : <AssessmentIcon sx={{ fontSize: 16 }} />}
                                            sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "uppercase", fontWeight: 700, px: 3 }}
                                        >
                                            {generating ? "Generating…" : "Generate Report"}
                                        </Button>
                                        {reportMessage && (
                                            <Typography fontSize={12.5} color="gray">{reportMessage}</Typography>
                                        )}
                                    </Stack>
                                    {reportDownloadUrl && (
                                        <Box mt={1.5}>
                                            <a href={reportDownloadUrl} download>
                                                <Button variant="outlined"
                                                    startIcon={<FileDownloadIcon sx={{ fontSize: 20, color: "green" }} />}
                                                    sx={{ textTransform: "none", fontWeight: 700 }}>
                                                    Download KPI Monitoring Report
                                                </Button>
                                            </a>
                                        </Box>
                                    )}
                                </Box>

                                {/* ── FILTER KPI REPORT (filters + on-demand download only) ── */}
                                <Box className={classes.Front_Box}>
                                    <Box display="flex" alignItems="center" gap={0.8} mb={1.2}>
                                        <FilterAltIcon sx={{ fontSize: 18, color: TEAL }} />
                                        <Typography className="Front_Box_Hading" fontWeight={700} fontSize={16}>
                                            Filter KPI Report
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={5} md={4}>
                                            <Autocomplete
                                                multiple
                                                freeSolo
                                                size="small"
                                                options={[]}
                                                value={siteIds}
                                                inputValue={siteInputValue}
                                                onInputChange={(e, newInputValue, reason) => {
                                                    if (reason === "input") setSiteInputValue(newInputValue);
                                                }}
                                                onChange={(e, newValue) => {
                                                    // freeSolo can hand back plain strings; flatten + split
                                                    // in case a comma/newline-separated chunk slipped through.
                                                    const flattened = newValue.flatMap((v) => splitSiteIds(String(v)));
                                                    setSiteIds(Array.from(new Set(flattened)));
                                                    setSiteInputValue("");
                                                }}
                                                // Also commit whatever's typed as soon as the field loses
                                                // focus, so a Site ID typed but not Enter-ed still becomes
                                                // a visible chip (in addition to the submit-time safety net
                                                // in getAllSiteIds()).
                                                onBlur={() => {
                                                    if (siteInputValue.trim()) {
                                                        const parts = splitSiteIds(siteInputValue);
                                                        setSiteIds((prev) => Array.from(new Set([...prev, ...parts])));
                                                        setSiteInputValue("");
                                                    }
                                                }}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} key={option} />
                                                    ))
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Site ID / Short Name"
                                                        placeholder={siteIds.length ? "Add more…" : "Paste a list or type, press Enter"}
                                                        onPaste={handleSitePaste}
                                                        size="small"
                                                        fullWidth
                                                        sx={fieldSx}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "#9aa3af" }} /></InputAdornment>
                                                                    {params.InputProps.startAdornment}
                                                                </>
                                                            ),
                                                            // Explicit, always-visible clear button — replaces
                                                            // reliance on Autocomplete's own default clear icon,
                                                            // which only cleared committed chips and left any
                                                            // still-typed text behind.
                                                            endAdornment: (
                                                                <>
                                                                    {(siteIds.length > 0 || siteInputValue) && (
                                                                        <InputAdornment position="end">
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={handleClearSiteIds}
                                                                                title="Clear Site IDs"
                                                                            >
                                                                                <CloseIcon sx={{ fontSize: 14 }} />
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    )}
                                                                </>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={5} md={4}>
                                            <TextField
                                                label="Circle"
                                                placeholder="e.g. MAH, DEL, ROTN"
                                                value={circleQuery}
                                                onChange={(e) => setCircleQuery(e.target.value)}
                                                size="small" fullWidth sx={fieldSx}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "#9aa3af" }} /></InputAdornment>,
                                                    endAdornment: circleQuery && (
                                                        <InputAdornment position="end">
                                                            <IconButton size="small" onClick={() => setCircleQuery("")}><CloseIcon sx={{ fontSize: 14 }} /></IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={4}>
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleGenerateFilteredReport}
                                                    disabled={filteredReportGenerating || (siteIds.length === 0 && !siteInputValue.trim() && !circleQuery.trim())}
                                                    startIcon={filteredReportGenerating ? <CircularProgress size={14} color="inherit" /> : <AssessmentIcon sx={{ fontSize: 16 }} />}
                                                    sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, whiteSpace: "nowrap" }}
                                                >
                                                    {filteredReportGenerating ? "Generating…" : "Generate Report"}
                                                </Button>
                                                <Tooltip title="Reset filters" arrow>
                                                    <span>
                                                        <Button
                                                            onClick={handleResetFilters}
                                                            disabled={siteIds.length === 0 && !siteInputValue && !circleQuery}
                                                            startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
                                                            sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}
                                                        >
                                                            Reset
                                                        </Button>
                                                    </span>
                                                </Tooltip>
                                            </Stack>
                                        </Grid>
                                    </Grid>

                                    {filteredReportError && (
                                        <Typography fontSize={12.5} color="#c62828" mt={2}>
                                            {filteredReportError}
                                        </Typography>
                                    )}

                                    {filteredReportMessage && (
                                        <Typography fontSize={12.5} color="gray" mt={2}>
                                            {filteredReportMessage}
                                        </Typography>
                                    )}
                                    {filteredReportDownloadUrl && (
                                        <Box mt={1.5}>
                                            <a href={filteredReportDownloadUrl} download>
                                                <Button variant="outlined"
                                                    startIcon={<FileDownloadIcon sx={{ fontSize: 20, color: "green" }} />}
                                                    sx={{ textTransform: "none", fontWeight: 700 }}>
                                                    Download Filtered KPI Report
                                                </Button>
                                            </a>
                                        </Box>
                                    )}
                                </Box>

                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default Performancekpi5g;