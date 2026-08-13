import React, { useState } from "react";
import {
    Box,
    Button,
    Stack,
    Typography,
    Breadcrumbs,
    Link,
    TextField,
    CircularProgress,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventIcon from "@mui/icons-material/Event";
import InputAdornment from "@mui/material/InputAdornment";
import Slide from "@mui/material/Slide";
import Swal from "sweetalert2";
import OverAllCss from "../../../csss/OverAllCss";
import { useNavigate } from "react-router-dom";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

/* ------------------------------------------------------------------ */
/*  Config — update TS_BASE_URL to the production host once deployed.  */
/* ------------------------------------------------------------------ */
const TS_BASE_URL = "https://commtoolapi.mcpspmis.com/";
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
/*  Get Tracker — date range → submit → excel downloads                */
/* ------------------------------------------------------------------ */
const GetTracker = () => {
    const classes = OverAllCss();
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startDateRequired, setStartDateRequired] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async () => {
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

        setStartDateRequired(false);
        setDownloadLoading(true);
        setMessage(null);
        action(true);
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
                setMessage(json.message || "Download started.");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: json?.message || "Could not download the report.",
                });
            }
        } catch (e) {
            console.error("Get Tracker download error:", e);
            Swal.fire({ icon: "error", title: "Error", text: "Something went wrong while downloading." });
        } finally {
            setDownloadLoading(false);
            action(false);
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
                    <Typography color="text.primary">Get Tracker</Typography>
                </Breadcrumbs>
            </div>

            <Slide direction="left" in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Get Tracker</Box>

                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction="column">
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Date Range:-
                                    </div>

                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={2}
                                        sx={{ mt: 2 }}
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

                            <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={downloadLoading}
                                    sx={{
                                        bgcolor: C.teal,
                                        "&:hover": { bgcolor: C.tealDark },
                                        fontWeight: 700,
                                        textTransform: "none",
                                        px: 4,
                                    }}
                                    startIcon={
                                        downloadLoading ? (
                                            <CircularProgress size={16} sx={{ color: "#fff" }} />
                                        ) : (
                                            <AssessmentIcon />
                                        )
                                    }
                                >
                                    {downloadLoading ? "Downloading..." : "Submit"}
                                </Button>
                            </Stack>

                            {message && (
                                <Typography sx={{ textAlign: "center", color: "#fff", mt: 2, fontWeight: 600 }}>
                                    {message}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Slide>
            {loading}
        </>
    );
};

export default GetTracker;