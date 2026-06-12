import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Typography,
    Breadcrumbs,
    Link,
    Chip,
    CircularProgress,
    Paper,
    TextField,
    IconButton,
    Tooltip as MuiTooltip,
    Alert,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SignalCellularAltIcon   from "@mui/icons-material/SignalCellularAlt";
import BarChartIcon            from "@mui/icons-material/BarChart";
import RefreshIcon             from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
} from "recharts";

import { postData } from "../../../services/FetchNodeServices";

// ── Month Helpers ─────────────────────────────────────────────────────────────
const getCurrentMonthStr = () =>
    new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });

const inputToApiMonth = (val) => {
    if (!val) return getCurrentMonthStr();
    const [year, month] = val.split("-");
    return new Date(Number(year), Number(month) - 1, 1)
        .toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const apiMonthToInput = (str) => {
    if (!str) return "";
    const d = new Date(str);
    if (isNaN(d)) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

/** Given two "YYYY-MM" strings, return all months in between (inclusive), max 4 */
const getMonthRange = (from, to) => {
    if (!from || !to) return from ? [from] : [];
    const [fy, fm] = from.split("-").map(Number);
    const [ty, tm] = to.split("-").map(Number);
    const months = [];
    let y = fy, m = fm;
    while ((y < ty) || (y === ty && m <= tm)) {
        months.push(`${y}-${String(m).padStart(2, "0")}`);
        if (months.length >= 4) break;
        m++;
        if (m > 12) { m = 1; y++; }
    }
    return months;
};

// ── Constants ─────────────────────────────────────────────────────────────────
const METRIC_TABS = [
    { key: "performance", label: "Performance" },
    { key: "offered",     label: "Offered" },
];

const TECH_TABS = [
    { key: "4G",    label: "4G" },
    { key: "5G",    label: "5G" },
    { key: "4G+5G", label: "4G+5G" },
];

const TECH_COLORS = {
    "4G":    { active: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", tabColor: "#1e3c72" },
    "5G":    { active: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)", tabColor: "#134e5e" },
    "4G+5G": { active: "linear-gradient(135deg, #41295a 0%, #2F0743 100%)", tabColor: "#41295a" },
};

const METRIC_THEME = {
    performance: {
        active:    "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        tabColor:  "#1e3c72",
        chartFrom: "#1e3c72",
        chartTo:   "#2a5298",
        icon: <BarChartIcon sx={{ color: "#fff", fontSize: 20 }} />,
        label: "SCFT Aging — Performance",
    },
    offered: {
        active:    "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
        tabColor:  "#134e5e",
        chartFrom: "#134e5e",
        chartTo:   "#71b280",
        icon: <SignalCellularAltIcon sx={{ color: "#fff", fontSize: 20 }} />,
        label: "SCFT Aging — Offered",
    },
};

/**
 * 10 visually distinct, high-contrast colors — one per possible series/month.
 * Each has a "from" and "to" for the gradient bar fill.
 */
const SERIES_COLORS = [
    { from: "#1565C0", to: "#42A5F5", solid: "#1976D2" },  // Blue
    { from: "#2E7D32", to: "#66BB6A", solid: "#388E3C" },  // Green
    { from: "#E65100", to: "#FFA726", solid: "#F57C00" },  // Orange
    { from: "#6A1B9A", to: "#CE93D8", solid: "#7B1FA2" },  // Purple
    { from: "#00695C", to: "#4DB6AC", solid: "#00796B" },  // Teal
    { from: "#C62828", to: "#EF9A9A", solid: "#D32F2F" },  // Red
    { from: "#F9A825", to: "#FFF176", solid: "#F9A825" },  // Yellow
    { from: "#00838F", to: "#80DEEA", solid: "#0097A7" },  // Cyan
    { from: "#4527A0", to: "#B39DDB", solid: "#512DA8" },  // Deep Purple
    { from: "#558B2F", to: "#AED581", solid: "#689F38" },  // Light Green
];

// ── Data Transform ────────────────────────────────────────────────────────────
const transformGraphData = (techData) => {
    if (!techData) return { chartData: [], seriesNames: [] };
    const { categories = [], series = [] } = techData;
    const chartData = categories.map((cat, catIdx) => {
        const entry = { category: cat };
        series.forEach((s) => { entry[s.name] = s.data?.[catIdx] ?? 0; });
        return entry;
    });
    return { chartData, seriesNames: series.map((s) => s.name) };
};

// ── Merge multiple API responses into one unified graph_data ─────────────────
const mergeResponses = (responses) => {
    if (!responses || responses.length === 0) return null;
    const valid = responses.filter(Boolean);
    if (valid.length === 0) return null;

    const merged = {
        status: true,
        layer:  valid[0].layer,
        graph_data: {},
    };

    ["4G", "5G", "4G+5G"].forEach((tech) => {
        const allSeries = [];
        let categories = [];
        valid.forEach((res) => {
            const techData = res?.graph_data?.[tech];
            if (!techData) return;
            if (techData.categories?.length > 0) categories = techData.categories;
            if (techData.series?.length > 0) allSeries.push(...techData.series);
        });
        // Deduplicate by series name (keep last)
        const seen = new Map();
        allSeries.forEach((s) => seen.set(s.name, s));
        merged.graph_data[tech] = {
            categories,
            series: Array.from(seen.values()),
        };
    });
    return merged;
};

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <Paper elevation={4} sx={{ p: 1.5, minWidth: 190, borderRadius: 2, border: "1px solid #e0e0e0" }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.5}>
                {label}
            </Typography>
            {payload.map((entry) => (
                <Box key={entry.name} display="flex" alignItems="center" gap={1} mb={0.3}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: entry.fill, flexShrink: 0 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>{entry.name}</Typography>
                    <Typography variant="caption" fontWeight={700}>{entry.value}%</Typography>
                </Box>
            ))}
        </Paper>
    );
};

// ── Chart Panel ───────────────────────────────────────────────────────────────
const ScftChart = ({ title, icon, gradientFrom, gradientTo, chartData, seriesNames, loading, seriesInfo }) => {
    const chartId = title.replace(/[\s—]+/g, "_");
    return (
        <Box sx={{ borderRadius: 2, border: "1px solid #e0e0e0", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", overflow: "hidden" }}>
            {/* Header */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
                    px: 2.5, py: 1.5,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    flexWrap: "wrap", gap: 1,
                }}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    {icon}
                    <Typography variant="subtitle1" fontWeight={700} color="#fff">{title}</Typography>
                </Box>
                {/* Series date chips in header */}
                <Box display="flex" gap={0.8} flexWrap="wrap">
                    {seriesInfo?.map((s, i) => (
                        <Chip
                            key={s.name}
                            label={`${s.name}  (${s.start} → ${s.end})`}
                            size="small"
                            sx={{
                                background: SERIES_COLORS[i % SERIES_COLORS.length].solid + "55",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: 10,
                                border: `1px solid ${SERIES_COLORS[i % SERIES_COLORS.length].solid}99`,
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Body */}
            <Box sx={{ p: 2, background: "#fafafa", minHeight: 340 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                        <CircularProgress size={36} />
                    </Box>
                ) : chartData.length === 0 ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                        <Typography color="text.secondary" fontSize={14}>No Data Available</Typography>
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height={360}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 22, right: 16, left: 0, bottom: 10 }}
                            barCategoryGap="22%"
                            barGap={3}
                        >
                            <defs>
                                {seriesNames.map((name, i) => {
                                    const clr = SERIES_COLORS[i % SERIES_COLORS.length];
                                    return (
                                        <linearGradient key={name} id={`grad_${chartId}_${i}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%"   stopColor={clr.from} stopOpacity={1} />
                                            <stop offset="100%" stopColor={clr.to}   stopOpacity={0.8} />
                                        </linearGradient>
                                    );
                                })}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={false} />
                            <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#555" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#555" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                            <Legend
                                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                                iconType="circle"
                                iconSize={9}
                                formatter={(value) => (
                                    <span style={{ color: SERIES_COLORS[seriesNames.indexOf(value) % SERIES_COLORS.length].solid, fontWeight: 600 }}>
                                        {value}
                                    </span>
                                )}
                            />
                            {seriesNames.map((name, i) => (
                                <Bar key={name} dataKey={name} fill={`url(#grad_${chartId}_${i})`} radius={[4, 4, 0, 0]} maxBarSize={32}>
                                    <LabelList
                                        dataKey={name}
                                        position="top"
                                        formatter={(v) => (v > 0 ? `${v}` : "")}
                                        style={{ fontSize: 9, fill: SERIES_COLORS[i % SERIES_COLORS.length].solid, fontWeight: 700 }}
                                    />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Box>
    );
};

// ── Month Range Picker ────────────────────────────────────────────────────────
const MonthRangePicker = ({ fromMonth, toMonth, onFromChange, onToChange, maxMonth }) => {
    const monthCount = getMonthRange(fromMonth, toMonth).length;
    const isOverLimit = monthCount > 4;
    const isEmpty = !fromMonth || !toMonth;

    return (
        <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
            <TextField
                size="small"
                label="From"
                type="month"
                value={fromMonth}
                onChange={(e) => onFromChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: maxMonth }}
                sx={{ minWidth: 150 }}
            />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>→</Typography>
            <TextField
                size="small"
                label="To"
                type="month"
                value={toMonth}
                onChange={(e) => onToChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: fromMonth, max: maxMonth }}
                sx={{ minWidth: 150 }}
            />
            {!isEmpty && (
                <Chip
                    label={isOverLimit ? "Max 4 months" : `${monthCount} month${monthCount > 1 ? "s" : ""}`}
                    size="small"
                    color={isOverLimit ? "error" : "primary"}
                    variant={isOverLimit ? "filled" : "outlined"}
                    sx={{ fontWeight: 700, fontSize: 11 }}
                />
            )}
        </Box>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const SCFT_Aging_Graph = () => {
    const navigate = useNavigate();

    const [activeMetric, setActiveMetric] = useState("performance");
    const [activeTech,   setActiveTech]   = useState("4G");

    const currentMonthInput = apiMonthToInput(getCurrentMonthStr());
    const [fromMonth, setFromMonth] = useState(currentMonthInput);
    const [toMonth,   setToMonth]   = useState(currentMonthInput);

    const [performanceData, setPerformanceData] = useState(null);
    const [offeredData,     setOfferedData]     = useState(null);
    const [loadingPerf,     setLoadingPerf]     = useState(false);
    const [loadingOff,      setLoadingOff]      = useState(false);

    const selectedMonths = getMonthRange(fromMonth, toMonth); // max 4
    const isRangeValid   = selectedMonths.length >= 1 && selectedMonths.length <= 4;

    // ── Fetch all months in range, merge results ──────────────────────────
    const fetchAll = useCallback(() => {
        if (!isRangeValid) return;

        setLoadingPerf(true);
        setLoadingOff(true);

        const perfPromises = selectedMonths.map((m) => {
            const form = new FormData();
            form.append("month", inputToApiMonth(m));
            return postData("performance_idploy/generate-scft-performance-graph/", form)
                .then((res) => (res?.status ? res : null))
                .catch(() => null);
        });

        const offPromises = selectedMonths.map((m) => {
            const form = new FormData();
            form.append("month", inputToApiMonth(m));
            return postData("performance_idploy/generate-scft-offered-graph/", form)
                .then((res) => (res?.status ? res : null))
                .catch(() => null);
        });

        Promise.all(perfPromises)
            .then((results) => setPerformanceData(mergeResponses(results)))
            .finally(() => setLoadingPerf(false));

        Promise.all(offPromises)
            .then((results) => setOfferedData(mergeResponses(results)))
            .finally(() => setLoadingOff(false));
    }, [fromMonth, toMonth]); // eslint-disable-line

    useEffect(() => {
        if (!isRangeValid) return;
        const t = setTimeout(fetchAll, 500);
        return () => clearTimeout(t);
    }, [fetchAll]); // eslint-disable-line

    // ── Active data slice ─────────────────────────────────────────────────
    const { chartData: perfChart, seriesNames: perfSeries } = transformGraphData(performanceData?.graph_data?.[activeTech]);
    const { chartData: offChart,  seriesNames: offSeries  } = transformGraphData(offeredData?.graph_data?.[activeTech]);

    const metricTheme   = METRIC_THEME[activeMetric];
    const activeTechClr = TECH_COLORS[activeTech];

    return (
        <>
            {/* Breadcrumb */}
            <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>Performance At TAT</Link>
                    <Typography color="text.primary">SCFT Aging Graph</Typography>
                </Breadcrumbs>
            </div>

            <Box p={1}>
                {/* ── Top Bar ── */}
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} mb={2}>
                    <Typography variant="h5" fontWeight={700}>
                        SCFT Aging Dashboard
                    </Typography>

                    <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                        <MonthRangePicker
                            fromMonth={fromMonth}
                            toMonth={toMonth}
                            onFromChange={(val) => {
                                setFromMonth(val);
                                if (toMonth && val > toMonth) setToMonth(val);
                            }}
                            onToChange={setToMonth}
                            maxMonth={currentMonthInput}
                        />
                        <MuiTooltip title="Refresh">
                            <span>
                                <IconButton onClick={fetchAll} size="small" disabled={!isRangeValid}>
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </MuiTooltip>
                    </Box>
                </Box>

                {/* Over-limit warning */}
                {selectedMonths.length > 4 && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Maximum 4 months can be selected. Only the first 4 months in the range will be fetched.
                    </Alert>
                )}

                {/* ── Outer Metric Tabs: Performance | Offered ── */}
                <Box sx={{ display: "flex", borderBottom: "2px solid #e0e0e0", mb: 0 }}>
                    {METRIC_TABS.map((tab) => {
                        const isActive = activeMetric === tab.key;
                        const theme    = METRIC_THEME[tab.key];
                        return (
                            <Box
                                key={tab.key}
                                onClick={() => setActiveMetric(tab.key)}
                                sx={{
                                    px: 4, py: 1.2,
                                    cursor: "pointer",
                                    userSelect: "none",
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: 14,
                                    color: isActive ? "#fff" : theme.tabColor,
                                    background: isActive ? theme.active : "transparent",
                                    borderRadius: "6px 6px 0 0",
                                    borderBottom: isActive ? `3px solid ${theme.tabColor}` : "3px solid transparent",
                                    transition: "all 0.2s",
                                    "&:hover": { background: isActive ? theme.active : "#f0f4ff" },
                                }}
                            >
                                {tab.label}
                            </Box>
                        );
                    })}
                </Box>

                {/* ── Inner Tech Tabs: 4G | 5G | 4G+5G ── */}
                <Box
                    sx={{
                        display: "flex",
                        borderBottom: "2px solid #e0e0e0",
                        mb: 2,
                        background: "#f9f9f9",
                        px: 1,
                        pt: 0.5,
                    }}
                >
                    {TECH_TABS.map((tab) => {
                        const isActive = activeTech === tab.key;
                        const tColor   = TECH_COLORS[tab.key];
                        return (
                            <Box
                                key={tab.key}
                                onClick={() => setActiveTech(tab.key)}
                                sx={{
                                    px: 2.5, py: 0.8,
                                    cursor: "pointer",
                                    userSelect: "none",
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: 13,
                                    color: isActive ? "#fff" : tColor.tabColor,
                                    background: isActive ? tColor.active : "transparent",
                                    borderRadius: "6px 6px 0 0",
                                    borderBottom: isActive ? `3px solid ${tColor.tabColor}` : "3px solid transparent",
                                    transition: "all 0.2s",
                                    "&:hover": { background: isActive ? tColor.active : "#ebebeb" },
                                }}
                            >
                                {tab.label}
                            </Box>
                        );
                    })}
                </Box>

                {/* ── Chart: show only the active metric ── */}
                <Box display="flex" flexDirection="column" gap={2}>
                    {activeMetric === "performance" && (
                        <ScftChart
                            title={METRIC_THEME.performance.label}
                            icon={METRIC_THEME.performance.icon}
                            gradientFrom={METRIC_THEME.performance.chartFrom}
                            gradientTo={METRIC_THEME.performance.chartTo}
                            chartData={perfChart}
                            seriesNames={perfSeries}
                            loading={loadingPerf}
                            seriesInfo={performanceData?.graph_data?.[activeTech]?.series}
                        />
                    )}

                    {activeMetric === "offered" && (
                        <ScftChart
                            title={METRIC_THEME.offered.label}
                            icon={METRIC_THEME.offered.icon}
                            gradientFrom={METRIC_THEME.offered.chartFrom}
                            gradientTo={METRIC_THEME.offered.chartTo}
                            chartData={offChart}
                            seriesNames={offSeries}
                            loading={loadingOff}
                            seriesInfo={offeredData?.graph_data?.[activeTech]?.series}
                        />
                    )}
                </Box>

                {/* ── Summary Strip ── */}
                {(performanceData || offeredData) && (
                    <Box
                        mt={2}
                        sx={{
                            display: "flex", gap: 2, flexWrap: "wrap",
                            p: 1.5, borderRadius: 2,
                            background: "#f5f5f5", border: "1px solid #e0e0e0",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Range:</Typography>
                        <Chip
                            label={
                                selectedMonths.length === 1
                                    ? inputToApiMonth(selectedMonths[0])
                                    : `${inputToApiMonth(selectedMonths[0])} → ${inputToApiMonth(selectedMonths[selectedMonths.length - 1])}`
                            }
                            size="small"
                            sx={{ background: metricTheme.tabColor, color: "#fff", fontWeight: 700, fontSize: 10 }}
                        />
                        <Typography variant="caption" color="text.secondary" fontWeight={600} ml={1}>Months:</Typography>
                        <Chip
                            label={selectedMonths.length}
                            size="small"
                            sx={{ background: metricTheme.tabColor, color: "#fff", fontWeight: 700, fontSize: 10 }}
                        />
                        <Typography variant="caption" color="text.secondary" fontWeight={600} ml={1}>Tech:</Typography>
                        <Chip
                            label={activeTech}
                            size="small"
                            sx={{ background: activeTechClr.tabColor, color: "#fff", fontWeight: 700, fontSize: 10 }}
                        />
                        <Typography variant="caption" color="text.secondary" fontWeight={600} ml={1}>Layer:</Typography>
                        <Chip
                            label={(performanceData?.layer || offeredData?.layer || "all").toUpperCase()}
                            size="small"
                            sx={{ background: activeTechClr.tabColor, color: "#fff", fontWeight: 700, fontSize: 10 }}
                        />
                        <Typography variant="caption" color="text.secondary" fontWeight={600} ml={1}>Series:</Typography>
                        <Chip
                            label={`Performance: ${perfSeries.length}  |  Offered: ${offSeries.length}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: 10 }}
                        />

                        {/* Color legend for selected months */}
                        <Box display="flex" gap={0.8} flexWrap="wrap" ml={1}>
                            {selectedMonths.map((m, i) => (
                                <Chip
                                    key={m}
                                    label={inputToApiMonth(m)}
                                    size="small"
                                    sx={{
                                        background: SERIES_COLORS[i % SERIES_COLORS.length].solid,
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: 10,
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default SCFT_Aging_Graph;