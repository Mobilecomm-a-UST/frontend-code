

import React, { useRef, useState } from "react";
import {
    Box,
    Typography,
    Breadcrumbs,
    Link,
    Card,
    Button,
    Stack,
    LinearProgress,
    Alert,
    Tooltip,
    Chip,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// API config
// Endpoints (Django urls.py):
//   path('upload/', UploadFileView.as_view(), name='upload'),   -> POST
//   path('export/', ExportExcelView.as_view(), name='export'),  -> GET
// ---------------------------------------------------------------------------
const BASE_URL = "https://commtoolapi.mcpspmis.com";
const UPLOAD_URL = `${BASE_URL}/field_resource_tracking/upload/`;
const EXPORT_URL = `${BASE_URL}/field_resource_tracking/export/`;

// Common keys APIs use when returning a link to a generated file instead of
// streaming the file bytes directly.
const FILE_URL_KEYS = ["download_url", "downloadUrl", "file_url", "fileUrl", "url", "file", "link"];

function Upload_file() {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const [uploading, setUploading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    // Single inline status shown on the card - shown once per action.
    const [status, setStatus] = useState(null); // { ok: boolean, message: string } | null

    const handlePickFile = () => fileInputRef.current?.click();

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setStatus(null);
        }
    };

    const handleClearFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const corsFriendlyMessage = (err) =>
        err.message === "Failed to fetch"
            ? "Could not reach the server. This is usually a CORS setting on the API — the server needs to allow requests from this site's origin."
            : err.message;

    // Trigger a plain browser download/navigation to a URL. This deliberately
    // avoids fetch() + blob() for cross-origin file URLs, since that path
    // requires the file host to send CORS headers. A normal anchor-click
    // navigation downloads the file without that restriction.
    const triggerDownloadFromUrl = (url) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = ""; // let the server's Content-Disposition / filename decide
        a.target = "_blank";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            handlePickFile();
            return;
        }
        setUploading(true);
        setStatus(null);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const res = await fetch(UPLOAD_URL, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error(`Upload failed (${res.status})`);

            setStatus({ ok: true, message: "File uploaded successfully." });
            handleClearFile();
        } catch (err) {
            setStatus({ ok: false, message: corsFriendlyMessage(err) || "Upload failed." });
        } finally {
            setUploading(false);
        }
    };

    const handleExport = async () => {
        setExporting(true);
        setStatus(null);
        try {
            // Server only accepts GET for export (POST returns 405 Method Not Allowed).
            const res = await fetch(EXPORT_URL, { method: "GET" });

            if (!res.ok) throw new Error(`Export failed (${res.status})`);

            const contentType = res.headers.get("content-type") || "";

            if (contentType.includes("application/json")) {
                // Server returns a JSON body with a link to the generated file
                // (e.g. { status, message, download_url }) rather than raw bytes.
                const data = await res.json();
                const fileUrl = FILE_URL_KEYS.map((k) => data[k]).find(Boolean);

                if (fileUrl) {
                    // Download directly via navigation - no extra fetch, no CORS issue.
                    triggerDownloadFromUrl(fileUrl);
                    setStatus({ ok: true, message: data.message || "Export downloaded." });
                } else {
                    setStatus({
                        ok: false,
                        message:
                            (data.message || data.detail || "Export completed, but the server didn't return a file to download.") +
                            " (No file URL found in the response — check the export endpoint's response format.)",
                    });
                }
                return;
            }

            // Otherwise assume the response body is the raw spreadsheet bytes.
            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = "field_resource_tracking.xlsx";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(blobUrl);
            setStatus({ ok: true, message: "Export downloaded." });
        } catch (err) {
            setStatus({ ok: false, message: corsFriendlyMessage(err) || "Export failed." });
        } finally {
            setExporting(false);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#faf1e8", fontFamily: "Arial, sans-serif" }}>
            <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
                <Breadcrumbs aria-label="breadcrumb" maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" sx={{ cursor: "pointer" }} onClick={() => navigate("/tools")}>
                        Tools
                    </Link>
                    <Link underline="hover" sx={{ cursor: "pointer" }} onClick={() => navigate("/tools/field_resource_tracking")}>
                        Field Resource Tracking
                    </Link>
                    <Typography color="text.primary">Upload File</Typography>
                </Breadcrumbs>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    px: { xs: 2, sm: 3 },
                    pt: { xs: 3, sm: 5 },
                }}
            >
                <Card
                    elevation={4}
                    sx={{
                        width: "100%",
                        maxWidth: 720,
                        borderRadius: "18px",
                        p: { xs: 3, sm: 5 },
                        bgcolor: "#ffffff",
                    }}
                >
                    <Stack spacing={0.5} sx={{ mb: 3 }}>
                        <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#0d5f63" }}>
                            Manage resource data
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: "#8a8a8a" }}>
                            Upload a file to add records, or export the current data to Excel.
                        </Typography>
                    </Stack>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ xs: "stretch", sm: "center" }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<InsertDriveFileOutlinedIcon />}
                            onClick={handlePickFile}
                            sx={{
                                textTransform: "none",
                                flex: 1,
                                justifyContent: "flex-start",
                                borderRadius: "10px",
                                borderColor: "#c9d8d8",
                                color: "#0d5f63",
                                py: 1.4,
                                px: 2,
                                fontWeight: 500,
                                "&:hover": { borderColor: "#0d5f63", bgcolor: "rgba(13,95,99,0.04)" },
                            }}
                        >
                            {selectedFile ? selectedFile.name : "Choose file"}
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<UploadFileIcon />}
                            onClick={handleUpload}
                            disabled={uploading}
                            sx={{
                                textTransform: "none",
                                borderRadius: "10px",
                                py: 1.4,
                                px: 3,
                                fontWeight: 600,
                                boxShadow: "none",
                                background: "linear-gradient(135deg, #0c4f52 0%, #17716f 100%)",
                                "&:hover": { background: "linear-gradient(135deg, #0a4548 0%, #14625f 100%)", boxShadow: "none" },
                            }}
                        >
                            {uploading ? "Uploading…" : "Upload"}
                        </Button>

                        <Tooltip title="Download the tracked resources as an Excel file">
                            <span>
                                <Button
                                    variant="contained"
                                    startIcon={<FileDownloadIcon />}
                                    onClick={handleExport}
                                    disabled={exporting}
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: "10px",
                                        py: 1.4,
                                        px: 3,
                                        fontWeight: 600,
                                        boxShadow: "none",
                                        background: "linear-gradient(135deg, #2c8a86 0%, #4fb3ab 100%)",
                                        "&:hover": { background: "linear-gradient(135deg, #237370 0%, #409e97 100%)", boxShadow: "none" },
                                    }}
                                >
                                    {exporting ? "Exporting…" : "Export to Excel"}
                                </Button>
                            </span>
                        </Tooltip>
                    </Stack>

                    {selectedFile && !uploading && (
                        <Box sx={{ mt: 2 }}>
                            <Chip
                                icon={<InsertDriveFileOutlinedIcon sx={{ fontSize: 16 }} />}
                                label={selectedFile.name}
                                onDelete={handleClearFile}
                                deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                    bgcolor: "#eef6f5",
                                    color: "#0d5f63",
                                    fontWeight: 500,
                                    "& .MuiChip-deleteIcon": { color: "#0d5f63" },
                                }}
                            />
                        </Box>
                    )}

                    {(uploading || exporting) && (
                        <LinearProgress
                            sx={{
                                mt: 3,
                                borderRadius: 2,
                                height: 6,
                                bgcolor: "#e6efee",
                                "& .MuiLinearProgress-bar": { bgcolor: "#0d5f63" },
                            }}
                        />
                    )}

                    {status && (
                        <Alert
                            severity={status.ok ? "success" : "error"}
                            onClose={() => setStatus(null)}
                            sx={{ mt: 3, borderRadius: "10px" }}
                        >
                            {status.message}
                        </Alert>
                    )}

                    <input ref={fileInputRef} type="file" hidden onChange={handleFileChange} />
                </Card>
            </Box>
        </Box>
    );
}

export default Upload_file;