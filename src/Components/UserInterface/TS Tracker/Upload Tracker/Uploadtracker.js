import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Stack,
    Breadcrumbs,
    Link,
    Typography,
    TextField,
    CircularProgress,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import UploadIcon from "@mui/icons-material/Upload";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EventIcon from "@mui/icons-material/Event";
import InputAdornment from "@mui/material/InputAdornment";
import Slide from "@mui/material/Slide";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

/* ------------------------------------------------------------------ */
/*  Config — update TS_BASE_URL to the production host once deployed.  */
/* ------------------------------------------------------------------ */
const TS_BASE_URL = "https://commtoolapi.mcpspmis.com/";
const TS_UPLOAD_PATH = "ts_tracker/ts_upload/";
const TS_UPLOAD_KEY = "ts_files";
const TS_DOWNLOAD_PATH = "ts_tracker/get_ts/";

/* ------------------------------------------------------------------ */
/*  Theme — same teal identity used across the app                     */
/* ------------------------------------------------------------------ */
const C = {
    teal: "#006e74",
    tealDark: "#00494d",
};

/*  Converts an <input type="date"> value ("YYYY-MM-DD") to the         */
/*  "DD-MM-YYYY" format the backend expects.                            */
const toBackendDate = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
};

/*  Triggers an immediate browser download for a given file URL,        */
/*  without navigating away or opening a new tab.                       */
const triggerDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    link.remove();
};

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */
const Uploadtracker = () => {
    const navigate = useNavigate();
    const classes = OverAllCss();
    const { loading, action } = useLoadingDialog();

    /* ---------------- Upload state ---------------- */
    const [tsSelectedFiles, setTsSelectedFiles] = useState([]);
    const [tsShowRequired, setTsShowRequired] = useState(false);
    const [tsUploadedFilename, setTsUploadedFilename] = useState(null);
    // Only true once a file has been uploaded successfully — gates the
    // "Download Excel" button so it can't be used before that.
    const [uploadSucceeded, setUploadSucceeded] = useState(false);

    /* ---------------- Shared date-range state ---------------- */
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startDateRequired, setStartDateRequired] = useState(false);

    /* ---------------- Download state ---------------- */
    const [tsDownloadLoading, setTsDownloadLoading] = useState(false);
    const [tsMessage, setTsMessage] = useState(null);

    useEffect(() => {
        document.title = `${window.location.pathname
            .slice(1)
            .replaceAll("_", " ")
            .replaceAll("/", " | ")
            .toUpperCase()}`;
    }, []);

    /* ============================================================ */
    /*  Upload handlers                                              */
    /* ============================================================ */
    const handleTsFileSelection = (event) => {
        const files = Array.from(event.target.files || []);
        setTsSelectedFiles(files);
        setTsShowRequired(false);
    };

    const handleTsCancel = () => {
        setTsSelectedFiles([]);
        setTsShowRequired(false);
        setTsUploadedFilename(null);
        setStartDate("");
        setEndDate("");
        setStartDateRequired(false);
        setTsMessage(null);
        setUploadSucceeded(false);
    };

    const handleTsUpload = async () => {
        let hasError = false;

        if (!tsSelectedFiles.length) {
            setTsShowRequired(true);
            hasError = true;
        }
        if (!startDate) {
            setStartDateRequired(true);
            hasError = true;
        }
        if (hasError) return;

        action(true);
        try {
            const formData = new FormData();
            tsSelectedFiles.forEach((file) => formData.append(TS_UPLOAD_KEY, file));
            formData.append("start_date", toBackendDate(startDate));
            // End date is optional — only sent when the user picked one.
            if (endDate) {
                formData.append("end_date", toBackendDate(endDate));
            }

            const res = await fetch(`${TS_BASE_URL}${TS_UPLOAD_PATH}`, {
                method: "POST",
                body: formData,
            });
            const json = await res.json();

            if (json?.status === true) {
                setTsUploadedFilename(
                    json.filename || tsSelectedFiles.map((f) => f.name).join(", ")
                );
                setUploadSucceeded(true);
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: json.message || "TS file(s) uploaded successfully.",
                });
            } else {
                setUploadSucceeded(false);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: json?.message || "Upload failed.",
                });
            }
        } catch (e) {
            console.error("TS upload error:", e);
            setUploadSucceeded(false);
            Swal.fire({ icon: "error", title: "Error", text: "Something went wrong while uploading." });
        } finally {
            action(false);
        }
    };

    /* ============================================================ */
    /*  Download handler — only reachable after a successful upload, */
    /*  reuses the same start/end date the file was uploaded with.   */
    /* ============================================================ */
    const handleDownloadExcel = async () => {
        if (!startDate) {
            setStartDateRequired(true);
            return;
        }
        if (endDate && startDate > endDate) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Range",
                text: "Start date cannot be after end date.",
            });
            return;
        }

        setTsDownloadLoading(true);
        setTsMessage(null);
        try {
            const payload = { start_date: toBackendDate(startDate) };
            // End date is flexible — only included when the user chose one.
            if (endDate) {
                payload.end_date = toBackendDate(endDate);
            }

            const res = await fetch(`${TS_BASE_URL}${TS_DOWNLOAD_PATH}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();

            if (json?.status === true && json.download_url) {
                triggerDownload(json.download_url);
                setTsMessage(json.message || "Download started.");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: json?.message || "Could not download the report.",
                });
            }
        } catch (e) {
            console.error("TS download error:", e);
            Swal.fire({ icon: "error", title: "Error", text: "Something went wrong while downloading." });
        } finally {
            setTsDownloadLoading(false);
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
                    <Link underline="hover" onClick={() => { navigate('/tools/ix_tools') }}>IX Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/ix_tools/ix_tstracker")}>
                        TS Tracker Tool
                    </Link>
                    <Typography color="text.primary">TS Tracker</Typography>
                </Breadcrumbs>
            </div>

            <Slide direction="left" in={true} timeout={1000}>
                <Box>
                    {/* ================= TS Tracker upload card ================= */}
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Upload TS Files</Box>

                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction="column">
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select TS File(s):-
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                color={tsSelectedFiles.length ? "warning" : "primary"}
                                            >
                                                Select File(s)
                                                <input
                                                    required
                                                    hidden
                                                    multiple
                                                    type="file"
                                                    onChange={(e) => handleTsFileSelection(e)}
                                                />
                                            </Button>
                                        </div>

                                        {tsSelectedFiles.length > 0 && (
                                            <span style={{ color: "green", fontSize: "18px", fontWeight: 600 }}>
                                                Selected: {tsSelectedFiles.map((f) => f.name).join(", ")}
                                            </span>
                                        )}

                                        <div>
                                            <span
                                                style={{
                                                    display: tsShowRequired ? "inherit" : "none",
                                                    color: "red",
                                                    fontSize: "18px",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                This Field Is Required !
                                            </span>
                                        </div>
                                    </div>

                                    {/* -------- Date range, inside the white select-file area -------- */}
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={2}
                                        sx={{ mt: 2.5 }}
                                    >
                                        <TextField
                                            label="Start Date"
                                            type="date"
                                            size="small"
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                setStartDateRequired(false);
                                            }}
                                            error={startDateRequired}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EventIcon sx={{ fontSize: 18, color: C.tealDark }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <TextField
                                            label="End Date (optional)"
                                            type="date"
                                            size="small"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EventIcon sx={{ fontSize: 18, color: C.tealDark }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Stack>

                                    {startDateRequired && (
                                        <Typography sx={{ color: "red", mt: 1, fontWeight: 600, fontSize: 14 }}>
                                            Start Date is required.
                                        </Typography>
                                    )}
                                </Box>
                            </Stack>

                            {/* -------- Submit / Cancel -------- */}
                            <Stack
                                direction={{ xs: "column", sm: "column", md: "row" }}
                                spacing={2}
                                style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}
                            >
                                <Button variant="contained" color="success" onClick={handleTsUpload} endIcon={<UploadIcon />}>
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleTsCancel}
                                    style={{ backgroundColor: "red", color: "white" }}
                                    endIcon={<DoDisturbIcon />}
                                >
                                    Cancel
                                </Button>
                            </Stack>

                            {/* {tsUploadedFilename && (
                                <Typography sx={{ textAlign: "center", color: "#fff", mt: 2, fontWeight: 600 }}>
                                    Uploaded: {tsUploadedFilename}
                                </Typography>
                            )} */}

                            {/* -------- Download Excel — only shown after a successful upload -------- */}
                            {uploadSucceeded && (
                                <Box sx={{ textAlign: "center", mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleDownloadExcel}
                                        disabled={tsDownloadLoading}
                                        sx={{ bgcolor: C.teal, "&:hover": { bgcolor: C.tealDark } }}
                                        startIcon={
                                            tsDownloadLoading ? (
                                                <CircularProgress size={16} sx={{ color: "#fff" }} />
                                            ) : (
                                                <FileDownloadIcon />
                                            )
                                        }
                                    >
                                        {tsDownloadLoading ? "Downloading..." : "Download Excel"}
                                    </Button>

                                    {/* {tsMessage && (
                                        <Typography sx={{ color: "#fff", mt: 1, fontWeight: 600 }}>
                                            {tsMessage}
                                        </Typography>
                                    )} */}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Slide>
            {loading}
        </>
    );
};

export default Uploadtracker;