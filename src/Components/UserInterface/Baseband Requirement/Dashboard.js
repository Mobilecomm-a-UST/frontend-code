import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Avatar,
    IconButton,
    Stack,
    CircularProgress,
    Breadcrumbs,
    Link,
    Tooltip,
    TextField,
    InputAdornment,
    Chip,
    Grid,
} from "@mui/material";
import RouterIcon from "@mui/icons-material/Router";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InboxIcon from "@mui/icons-material/Inbox";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CellTowerIcon from "@mui/icons-material/CellTower";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DnsIcon from "@mui/icons-material/Dns";
import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Config — corrected endpoint (POST, not GET)                        */
/* ------------------------------------------------------------------ */
const BASE_URL = "https://commtoolapi.mcpspmis.com/";
const API_PATH = "Baseband/baseband_req/";

/* ------------------------------------------------------------------ */
/*  Theme — matched to the teal "Baseband Requirement" upload screen   */
/* ------------------------------------------------------------------ */
const C = {
    teal: "#006e74",
    tealDark: "#00494d",
    tealLight: "#4fa3a8",
    headerBg: "#004d52",
    labelOdd: "#e3f2f2",
    labelEven: "#f2fafa",
    border: "#c9dcdc",
    valueText: "#0d3a3c",
    zeroText: "#a7bcbc",
    tick: "#1a7f37",
    cross: "#c62828",
    pageBg: "#eef4f4",
};

const HEADER_GRADIENT = "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)";

/* ------------------------------------------------------------------ */
/*  Column definitions — keeps display order + friendly labels.        */
/*  Any key present in the data but not listed here still renders,     */
/*  appended at the end automatically.                                 */
/* ------------------------------------------------------------------ */
const PINNED_KEY = "Site ID";

const KNOWN_COLUMNS = [
    "Site ID",
    "EnB ID",
    "L2100",
    "L900",
    "L1800",
    "L2300-C1",
    "L2300-C2",
    "ASIA",
    "ASIB",
    "ASIM",
    "ABIO",
    "ABIA",
    "ABIP",
    "Deployment Technology",
    "ASIA.1",
    "ASIB.1",
    "ABIO.1",
    "ABIA.1",
    "ABIP.1",
    "ASIA.2",
    "ASIB.2",
    "ABIO.2",
    "ABIA.2",
    "ABIP.2",
    "Recovery H/W SR NO",
    "Mplain ",
    "RFS NO ",
    "DC Status",
    "Matreial pickup status ",
    "Team Detail to whom card available",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
const buildColumns = (rows) => {
    if (!rows || !rows.length) return [];
    const keys = Object.keys(rows[0]).filter((k) => k !== PINNED_KEY);
    // keep KNOWN_COLUMNS order first, then append anything unexpected
    const ordered = KNOWN_COLUMNS.filter((k) => k !== PINNED_KEY && keys.includes(k));
    const extras = keys.filter((k) => !ordered.includes(k));
    return [...ordered, ...extras];
};

const isTickCross = (val) => typeof val === "string" && (val.trim().startsWith("✓") || val.trim() === "✗");

const cellColor = (val) => {
    if (typeof val === "string") {
        const v = val.trim();
        if (v.startsWith("✓")) return C.tick;
        if (v === "✗") return C.cross;
        if (v === "") return C.zeroText;
    }
    if (val === 0) return C.zeroText;
    return C.valueText;
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
/*  Summary stat card                                                   */
/* ------------------------------------------------------------------ */
function StatCard({ icon, label, value, accent }) {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                border: `1px solid ${C.border}`,
                height: "100%",
            }}
        >
            <Avatar sx={{ bgcolor: accent, width: 42, height: 42 }}>{icon}</Avatar>
            <Box>
                <Typography variant="caption" sx={{ color: "#6b8687", fontWeight: 600, textTransform: "uppercase" }}>
                    {label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: C.tealDark, lineHeight: 1.2 }}>
                    {value}
                </Typography>
            </Box>
        </Paper>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Baseband Dashboard Table                                       */
/* ------------------------------------------------------------------ */
function BasebandTable({ rows, columns }) {
    const hasData = Array.isArray(rows) && rows.length > 0;

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
                    Baseband Site-wise Data
                </Typography>
            </Box>

            {!hasData ? (
                <NoData compact />
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
                                        {c.trim()}
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
            )}
        </Paper>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard                                                      */
/* ------------------------------------------------------------------ */
function Dashboard() {
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [downloadLink, setDownloadLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState("");

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch(`${BASE_URL}${API_PATH}`, {
                method: "POST",
            });
            const json = await res.json();

            if (!json || json.status === false || !Array.isArray(json.data)) {
                setRows([]);
                setDownloadLink(null);
            } else {
                setRows(json.data);
                setDownloadLink(json.download_link ?? null);
            }
        } catch (e) {
            console.error("Baseband fetchDashboard:", e);
            setError(true);
            setRows([]);
            setDownloadLink(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const columns = useMemo(() => buildColumns(rows), [rows]);

    const filteredRows = useMemo(() => {
        if (!search.trim()) return rows;
        const q = search.trim().toLowerCase();
        return rows.filter((row) =>
            Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(q))
        );
    }, [rows, search]);

    // ── Summary stats ──
    const totalSites = rows.length;
    const totalEnb = useMemo(() => new Set(rows.map((r) => r["EnB ID"])).size, [rows]);
    const pendingDcStatus = useMemo(
        () => rows.filter((r) => !r["DC Status"] || String(r["DC Status"]).trim() === "").length,
        [rows]
    );
    const readyRfs = useMemo(
        () => rows.filter((r) => r["RFS NO "] && String(r["RFS NO "]).trim() !== "").length,
        [rows]
    );

    const hasAnyData = rows.length > 0;

    return (
        <Slide direction="left" in="true" timeout={800}>
            <div>
                <div style={{ margin: 10, marginLeft: 10 }}>
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        itemsBeforeCollapse={2}
                        maxItems={3}
                        separator={<KeyboardArrowRightIcon fontSize="small" />}
                    >
                        <Link underline="hover" onClick={() => navigate("/tools")}>
                            Tools
                        </Link>
                        <Link underline="hover" onClick={() => navigate("/tools/baseband_requirement")}>
                            Baseband Requirement
                        </Link>
                        <Typography color="text.primary">Baseband Dashboard</Typography>
                    </Breadcrumbs>
                </div>

                <Box sx={{ minHeight: "100%", width: "100%", bgcolor: C.pageBg, fontFamily: "Roboto, sans-serif" }}>
                    <Box sx={{ width: "100%", px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
                        {/* Header */}
                        <Paper
                            elevation={3}
                            sx={{
                                borderRadius: 2,
                                px: 2.5,
                                py: 2,
                                mb: 3,
                                background: HEADER_GRADIENT,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                                flexWrap: "wrap",
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.15)", width: 40, height: 40 }}>
                                    <RouterIcon sx={{ color: "#bfe9e9" }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.3 }}>
                                        Baseband Requirement Dashboard
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
                                        Site-wise baseband card &amp; deployment status
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                                <TextField
                                    size="small"
                                    placeholder="Search Site ID, EnB ID..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: "rgba(255,255,255,0.7)", fontSize: 18 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        bgcolor: "rgba(255,255,255,0.1)",
                                        borderRadius: 1,
                                        minWidth: 220,
                                        "& .MuiOutlinedInput-root": {
                                            color: "#fff",
                                            "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                                            "&.Mui-focused fieldset": { borderColor: "#bfe9e9" },
                                        },
                                        "& input::placeholder": { color: "rgba(255,255,255,0.7)", opacity: 1 },
                                    }}
                                />

                                <Tooltip title={downloadLink ? "Download Excel" : "No file available"}>
                                    <span>
                                        <IconButton
                                            component={downloadLink ? "a" : "button"}
                                            href={downloadLink || undefined}
                                            disabled={!downloadLink}
                                            sx={{
                                                color: "#bfe9e9",
                                                bgcolor: "rgba(255,255,255,0.1)",
                                                "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
                                                "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" },
                                            }}
                                        >
                                            <FileDownloadIcon />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </Stack>
                        </Paper>

                        {/* Loading state */}
                        {loading && (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                                <CircularProgress size={32} sx={{ color: C.teal }} />
                            </Box>
                        )}

                        {/* Error / no data state */}
                        {!loading && (error || !hasAnyData) && (
                            <Paper elevation={1} sx={{ borderRadius: 2 }}>
                                <NoData label={error ? "No data found — could not reach the server" : "No data found"} />
                            </Paper>
                        )}

                        {/* Content */}
                        {!loading && !error && hasAnyData && (
                            <Stack spacing={3}>
                                {/* Summary cards */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatCard
                                            icon={<CellTowerIcon sx={{ color: "#fff" }} />}
                                            label="Total Sites"
                                            value={totalSites}
                                            accent={C.teal}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatCard
                                            icon={<DnsIcon sx={{ color: "#fff" }} />}
                                            label="Unique EnB IDs"
                                            value={totalEnb}
                                            accent={C.tealDark}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatCard
                                            icon={<CheckCircleIcon sx={{ color: "#fff" }} />}
                                            label="RFS Raised"
                                            value={readyRfs}
                                            accent={C.tick}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatCard
                                            icon={<CancelIcon sx={{ color: "#fff" }} />}
                                            label="DC Status Pending"
                                            value={pendingDcStatus}
                                            accent={C.cross}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Data table */}
                                <BasebandTable rows={filteredRows} columns={columns} />
                            </Stack>
                        )}
                    </Box>
                </Box>
            </div>
        </Slide>
    );
}


export default Dashboard;