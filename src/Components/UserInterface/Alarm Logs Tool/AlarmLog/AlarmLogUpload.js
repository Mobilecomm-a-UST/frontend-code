import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Stack,
    Breadcrumbs,
    Link,
    Typography,
    CircularProgress,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import UploadIcon from "@mui/icons-material/Upload";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Slide from "@mui/material/Slide";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

/* ------------------------------------------------------------------ */
/*  Config — update BASE_URL to the production host once deployed.     */
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
const AlarmLogUpload = () => {
    const navigate = useNavigate();
    const classes = OverAllCss();
    const { loading, action } = useLoadingDialog();

    // Upload state
    const [selectedFile, setSelectedFile] = useState(null);
    const [showRequired, setShowRequired] = useState(false);
    const [uploadedFilename, setUploadedFilename] = useState(null);

    // Download state
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [reportMessage, setReportMessage] = useState(null);

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
        setReportMessage(null);
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

    /* ============================================================ */
    /*  Download handler — one call, immediate download. The         */
    /*  returned download_url is a static file, not an API, so it    */
    /*  is only ever used as a direct link/download href — never     */
    /*  fetched from the client.                                      */
    /* ============================================================ */
    const handleDownloadReport = async () => {
        setDownloadLoading(true);
        setReportMessage(null);
        try {
            const res = await fetch(`${BASE_URL}${REPORT_PATH}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename: uploadedFilename }),
            });
            const json = await res.json();

            if (json?.status === true && json.download_url) {
                triggerDownload(json.download_url);
                setReportMessage(json.message || "Download started.");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: json?.message || "Could not download the report.",
                });
            }
        } catch (e) {
            console.error("Alarm report error:", e);
            Swal.fire({ icon: "error", title: "Error", text: "Something went wrong while downloading." });
        } finally {
            setDownloadLoading(false);
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

                    {/* Download action — single click, no separate "generate" step */}
                    <Box sx={{ textAlign: "center", mt: 3 }}>
                        <Button
                            variant="contained"
                            onClick={handleDownloadReport}
                            disabled={downloadLoading}
                            startIcon={
                                downloadLoading ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <FileDownloadIcon />
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
                            {downloadLoading ? "Downloading..." : "Download Excel"}
                        </Button>

                        {reportMessage && (
                            <Typography sx={{ mt: 1.5, color: C.tealDark, fontWeight: 600 }}>
                                {reportMessage}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Slide>
            {loading}
        </>
    );
};

export default AlarmLogUpload;