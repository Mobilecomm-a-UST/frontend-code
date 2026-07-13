import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Breadcrumbs,
  Link,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip as MuiTooltip,
  alpha,
  Popover,
} from "@mui/material";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import BarChartIcon from "@mui/icons-material/BarChart";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RoomIcon from "@mui/icons-material/Room";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { useNavigate } from "react-router-dom";
import { postData } from "../../../services/FetchNodeServices"; // adjust path to match your project structure

/*
  ==========================================================================
  JSON SHAPE THIS COMPONENT CONSUMES
  ==========================================================================

  1) CIRCLE-WISE API  ->  POST idploy/generate-scft-ftr-circle-graph/
     {
       status, layer, available_months: ["Apr 2026","May 2026","Jun 2026"],
       circles: ["AP", ...],
       graph_data: {
         "4G": {
           categories: ["SCFT FTR"],
           series: [
             { name: "Apr 2026", start, end, circles: { AP: 53.33, ... } },
             ...
           ]
         },
         "5G": { ... }, "4G+5G": { ... }
       }
     }
     -> one bar PER CIRCLE, grouped by month. This is the "SCFT FTR" column.

  2) GRAND TOTAL API  ->  POST idploy/generate-scft-performance-graph/
     graph_data: {
       "4G": {
         categories: ["Total Site","Pending","Accepted with 0 counter",
                       "Acceptance pending with 0 Counter"],
         series: [
           { name: "Apr 2026", data: [543,0,349,1], grand_total_scft: 64.39 },
           ...
         ]
       }, ...
     }
     -> `grand_total_scft` per month always drives the purple "Overall" line
        (right axis, 0-100%). The `data` array (indexed by `categories`)
        supplies the raw counts for whichever non-FTR column is selected in
        the column filter below.

  COLUMN FILTER (single-select, one at a time):
    "Total Site" | "Pending" | "Accepted with 0 counter" |
    "Acceptance pending with 0 Counter" | "SCFT FTR"
  - "SCFT FTR"  -> left axis = per-circle % bars (from API #1) + Overall line
  - any other   -> left axis = single count bar for that column (from API #2)
                   + Overall (SCFT FTR %) line still shown for context

  Both endpoints are fetched in parallel with Promise.all (POST, empty
  FormData body). The dashboard defaults to CURRENT MONTH ONLY — the
  From/To pickers are fully flexible (any month, any year, not limited to
  `available_months`) so the person can scroll back/forward freely.
  ==========================================================================
*/

const CIRCLE_API = "performance_idploy/generate-scft-ftr-circle-graph/";
const GRAND_TOTAL_API = "performance_idploy/generate-scft-ftr-grand-graph/";

const TECH_TABS = [
  { key: "4G", label: "4G" },
  { key: "5G", label: "5G" },
  { key: "4G+5G", label: "4G+5G" },
];

const TECH_COLORS = {
  "4G": { active: "linear-gradient(135deg,#1e3c72,#2a5298)", tabColor: "#1e3c72" },
  "5G": { active: "linear-gradient(135deg,#134e5e,#71b280)", tabColor: "#134e5e" },
  "4G+5G": { active: "linear-gradient(135deg,#41295a,#2F0743)", tabColor: "#41295a" },
};

const HEADER_GRADIENT_FROM = "#1e3c72";
const HEADER_GRADIENT_TO = "#2a5298";

// One distinct colour per circle
const CIRCLE_BAR_COLORS = [
  "#1565c0", "#e65100", "#2e7d32", "#0097a7", "#6a1b9a", "#c62828",
  "#4e342e", "#37474f", "#558b2f", "#f57f17", "#00695c", "#283593",
];
const getCircleBarColor = (idx) => CIRCLE_BAR_COLORS[idx % CIRCLE_BAR_COLORS.length];

const OVERALL_LINE_COLOR = "#9c27b0";
const PERCENT_AXIS_TICKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// Column / category filter options — single select, one at a time.
const COLUMN_OPTIONS = [
    "ALL",
  "Total Site",
  "Pending",
  "Accepted with 0 counter",
  "Acceptance pending with 0 Counter",
  
];
const COLUMN_COLORS = {
  "Total Site": "#1565c0",
  "Pending": "#e65100",
  "Accepted with 0 counter": "#2e7d32",
  "Acceptance pending with 0 Counter": "#6a1b9a",
  "SCFT FTR": "#9c27b0",
};

// ─────────────────────────────────────────────────────────────────────────────
// MONTH LABEL HELPERS  ("Jul 2026" style — matches the API's month format)
// ─────────────────────────────────────────────────────────────────────────────
const MONTH_ABBRS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getCurrentMonthLabel = () =>
  new Date().toLocaleString("en-US", { month: "short", year: "numeric" });

const parseMonthLabel = (label) => {
  if (!label) return null;
  const [mon, yr] = label.split(" ");
  const monthIdx = MONTH_ABBRS.indexOf(mon);
  const year = parseInt(yr, 10);
  if (monthIdx === -1 || Number.isNaN(year)) return null;
  return { monthIdx, year };
};

// Sortable numeric key so "any year" ranges compare correctly.
const monthSortKey = (label) => {
  const p = parseMonthLabel(label);
  return p ? p.year * 12 + p.monthIdx : null;
};

// ─────────────────────────────────────────────────────────────────────────────
// SVG GRADIENT DEFS (one per circle colour)
// ─────────────────────────────────────────────────────────────────────────────
const CircleGradientDefs = ({ circleNames }) => (
  <defs>
    {circleNames.map((name, i) => {
      const base = getCircleBarColor(i);
      return (
        <linearGradient key={`pscft-cg${i}`} id={`pscft-cg${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={base} stopOpacity={0.9} />
          <stop offset="100%" stopColor={base} stopOpacity={0.6} />
        </linearGradient>
      );
    })}
  </defs>
);

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM TOOLTIP / LABELS / X-TICK
// ─────────────────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, barSuffix = "%" }) => {
  if (!active || !payload?.length) return null;
  const barEntries = payload.filter((p) => p.dataKey !== "Overall");
  const lineEntries = payload.filter((p) => p.dataKey === "Overall");
  return (
    <Paper elevation={8} sx={{
      p: 1.8, minWidth: 200, borderRadius: "12px",
      border: "1px solid #e0e0e0", boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
      background: "rgba(255,255,255,0.98)",
    }}>
      <Typography fontSize={12} fontWeight={700} color="#37474f" mb={0.8}
        sx={{ borderBottom: "1px solid #f0f0f0", pb: 0.6 }}>
        {label}
      </Typography>
      {barEntries.map((entry) => (
        <Box key={entry.dataKey} display="flex" alignItems="center" gap={1} mb={0.45}>
          <Box sx={{ width: 12, height: 12, borderRadius: "3px", bgcolor: entry.fill || entry.color, flexShrink: 0 }} />
          <Typography fontSize={11.5} color="text.secondary" sx={{ flexGrow: 1 }}>{entry.dataKey}</Typography>
          <Typography fontSize={12} fontWeight={700} color={entry.fill || entry.color}>
            {entry.value != null ? `${entry.value}${barSuffix}` : "—"}
          </Typography>
        </Box>
      ))}
      {lineEntries.map((entry) => (
        <Box key="overall" display="flex" alignItems="center" gap={1} mt={0.6} pt={0.6}
          sx={{ borderTop: "1px dashed #eee" }}>
          <Box sx={{ width: 16, height: 3, bgcolor: OVERALL_LINE_COLOR, borderRadius: 2, flexShrink: 0 }} />
          <Typography fontSize={11.5} color="text.secondary" sx={{ flexGrow: 1 }}>Overall (SCFT FTR)</Typography>
          <Typography fontSize={12} fontWeight={700} color={OVERALL_LINE_COLOR}>
            {entry.value != null ? `${entry.value}%` : "—"}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

const BarTopLabel = ({ x, y, width, value, labelColor }) => {
  if (value == null || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  return (
    <text x={x + width / 2} y={y - 5} textAnchor="middle" fontSize={10} fontWeight={700} fill={labelColor ?? "#555"}>
      {value}
    </text>
  );
};

const LineTopLabel = ({ x, y, value }) => {
  if (value == null || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  return (
    <text x={x} y={y - 10} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={OVERALL_LINE_COLOR}>
      {value}%
    </text>
  );
};

const CustomXTick = ({ x, y, payload }) => (
  <text x={x} y={y + 14} textAnchor="middle" fontSize={11.5} fill="#607d8b" fontWeight={600}>
    {payload.value}
  </text>
);

// ─────────────────────────────────────────────────────────────────────────────
// CIRCLE PILL-CHIP FILTER (multi-select — only shown for the "SCFT FTR" column)
// ─────────────────────────────────────────────────────────────────────────────
const CircleChipFilter = ({ circles, selectedCircles, onChange }) => {
  if (!circles?.length) return null;
  const isAllActive = selectedCircles.length === 0;

  const toggle = (c) => {
    if (selectedCircles.includes(c)) onChange(selectedCircles.filter((x) => x !== c));
    else onChange([...selectedCircles, c]);
  };

  return (
    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
      <RoomIcon sx={{ fontSize: 17, color: "#607d8b" }} />
      <Typography fontSize={12.5} fontWeight={700} color="#607d8b">Circle:</Typography>

      <Chip
        label="All"
        size="small"
        onClick={() => onChange([])}
        sx={{
          fontWeight: 700, fontSize: 12.5, cursor: "pointer",
          bgcolor: isAllActive ? "#263238" : "transparent",
          color: isAllActive ? "#fff" : "#607d8b",
          border: "1.5px solid",
          borderColor: isAllActive ? "#263238" : "#cfd8dc",
          "&:hover": { bgcolor: isAllActive ? "#263238" : alpha("#263238", 0.06) },
        }}
      />

      {circles.map((c, i) => {
        const color = getCircleBarColor(i);
        const active = !isAllActive && selectedCircles.includes(c);
        return (
          <Chip
            key={c}
            label={c}
            size="small"
            onClick={() => toggle(c)}
            sx={{
              fontWeight: 700, fontSize: 12.5, cursor: "pointer",
              bgcolor: active ? alpha(color, 0.14) : "transparent",
              color,
              border: "1.5px solid",
              borderColor: active ? color : alpha(color, 0.4),
              "&:hover": { bgcolor: alpha(color, 0.1) },
            }}
          />
        );
      })}
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COLUMN FILTER (single-select — one column/category at a time)
// ─────────────────────────────────────────────────────────────────────────────
const ColumnFilter = ({ value, onChange }) => (
  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
    <ViewColumnIcon sx={{ fontSize: 17, color: "#607d8b" }} />
    <Typography fontSize={12.5} fontWeight={700} color="#607d8b">Column:</Typography>
    {COLUMN_OPTIONS.map((c) => {
      const active = value === c;
      const color = COLUMN_COLORS[c] || "#455a64";
      return (
        <Chip
          key={c}
          label={c}
          size="small"
          onClick={() => onChange(c)}
          sx={{
            fontWeight: 700, fontSize: 12, cursor: "pointer",
            bgcolor: active ? alpha(color, 0.14) : "transparent",
            color,
            border: "1.5px solid",
            borderColor: active ? color : alpha(color, 0.4),
            "&:hover": { bgcolor: alpha(color, 0.1) },
          }}
        />
      );
    })}
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────
// MONTH / YEAR CALENDAR PICKER
// Click the field -> popover shows all 12 months for a year, with
// prev/next-year arrows so any year can be scrolled to (not fixed).
// ─────────────────────────────────────────────────────────────────────────────
const MonthYearPicker = ({ label, value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const parsed = parseMonthLabel(value);
  const [viewYear, setViewYear] = useState(parsed?.year || new Date().getFullYear());

  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    setViewYear(parsed?.year || new Date().getFullYear());
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const pickMonth = (idx) => {
    onChange(`${MONTH_ABBRS[idx]} ${viewYear}`);
    handleClose();
  };

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          minWidth: 138, px: 1.6, py: 0.7, borderRadius: "10px",
          border: "1px solid #dfe4ea", cursor: "pointer", bgcolor: "#fff",
          "&:hover": { borderColor: "#1e3c72" },
        }}
      >
        <Typography fontSize={10.5} color="text.secondary" fontWeight={600} lineHeight={1.4}>{label}</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
          <Typography fontSize={13.5} fontWeight={700} color="#263238">{value || "Select"}</Typography>
          <CalendarMonthIcon sx={{ fontSize: 16, color: "#90a4ae" }} />
        </Box>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ p: 1.5, width: 236 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <IconButton size="small" onClick={() => setViewYear((y) => y - 1)}>
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <Typography fontWeight={700} fontSize={14} color="#1e3c72">{viewYear}</Typography>
            <IconButton size="small" onClick={() => setViewYear((y) => y + 1)}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={0.8}>
            {MONTH_ABBRS.map((m, idx) => {
              const isSelected = parsed && parsed.monthIdx === idx && parsed.year === viewYear;
              return (
                <Box
                  key={m}
                  onClick={() => pickMonth(idx)}
                  sx={{
                    textAlign: "center", py: 0.9, borderRadius: "8px", cursor: "pointer",
                    fontSize: 12.5, fontWeight: 600,
                    bgcolor: isSelected ? "#1e3c72" : "transparent",
                    color: isSelected ? "#fff" : "#455a64",
                    "&:hover": { bgcolor: isSelected ? "#1e3c72" : alpha("#1e3c72", 0.08) },
                  }}
                >
                  {m}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Popover>
    </>
  );
};

// From -> To range card, using the flexible MonthYearPicker on each side.
const MonthRangePicker = ({ monthFrom, monthTo, onChange, onReset }) => {
  const rangeCount = useMemo(() => {
    const fromKey = monthSortKey(monthFrom);
    const toKey = monthSortKey(monthTo);
    if (fromKey == null || toKey == null) return null;
    return Math.abs(toKey - fromKey) + 1;
  }, [monthFrom, monthTo]);

  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: 1.4, px: 2, py: 1.1,
      borderRadius: "14px", border: "1px solid #f0e4d7", bgcolor: "#fffdfb",
    }}>
      <MonthYearPicker label="From" value={monthFrom} onChange={(v) => onChange({ from: v, to: monthTo })} />
      <ArrowForwardIcon sx={{ fontSize: 16, color: "#b0bec5" }} />
      <MonthYearPicker label="To" value={monthTo} onChange={(v) => onChange({ from: monthFrom, to: v })} />

      {rangeCount != null && (
        <Chip
          label={`${rangeCount} month${rangeCount > 1 ? "s" : ""}`}
          size="small"
          sx={{ bgcolor: alpha("#1e88e5", 0.1), color: "#1565c0", fontWeight: 700, fontSize: 11.5 }}
        />
      )}

      <MuiTooltip title="Reset to current month" arrow>
        <IconButton
          size="small"
          onClick={onReset}
          sx={{ bgcolor: alpha("#1e3c72", 0.08), "&:hover": { bgcolor: alpha("#1e3c72", 0.15) } }}
        >
          <RefreshIcon sx={{ fontSize: 17, color: "#1e3c72" }} />
        </IconButton>
      </MuiTooltip>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function SCFTFTRGraph() {
  const navigate = useNavigate();

  const [tech, setTech] = useState("4G");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCircles, setSelectedCircles] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("SCFT FTR");

  const [circleGraphData, setCircleGraphData] = useState(null);
  const [grandGraphData, setGrandGraphData] = useState(null);

  // Dashboard defaults to CURRENT MONTH ONLY.
  const [monthRange, setMonthRange] = useState(() => {
    const m = getCurrentMonthLabel();
    return { from: m, to: m };
  });

  const requestIdRef = React.useRef(0);

  const fetchAll = React.useCallback(() => {
    const myRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    // Both endpoints only accept POST — send an empty FormData body.
    const postEmpty = (endpoint) =>
      postData(endpoint, new FormData())
        .then((res) => (res?.status ? res : null))
        .catch(() => null);

    Promise.all([postEmpty(CIRCLE_API), postEmpty(GRAND_TOTAL_API)])
      .then(([circleRes, grandRes]) => {
        if (requestIdRef.current !== myRequestId) return; // stale
        if (!circleRes && !grandRes) {
          setError("Unable to load Performance SCFT data. Please try again.");
        }
        setCircleGraphData(circleRes?.graph_data || {});
        setGrandGraphData(grandRes?.graph_data || {});
      })
      .finally(() => {
        if (requestIdRef.current === myRequestId) setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const isFtrColumn = selectedColumn === "SCFT FTR";

  const allCircleNames = useMemo(() => {
    if (!circleGraphData || !circleGraphData[tech]) return [];
    const set = new Set();
    circleGraphData[tech].series.forEach((s) => {
      Object.keys(s.circles || {}).forEach((c) => set.add(c));
    });
    return Array.from(set).sort();
  }, [circleGraphData, tech]);

  useEffect(() => {
    if (selectedCircles.length && allCircleNames.length) {
      const next = selectedCircles.filter((c) => allCircleNames.includes(c));
      if (next.length !== selectedCircles.length) setSelectedCircles(next);
    }
  }, [allCircleNames]); // eslint-disable-line

  const circleNames = useMemo(() => {
    if (!selectedCircles.length) return allCircleNames;
    return allCircleNames.filter((c) => selectedCircles.includes(c));
  }, [allCircleNames, selectedCircles]);

  // Chart rows depend on which column is selected:
  //  - "SCFT FTR"  -> per-circle % bars + Overall line
  //  - anything else -> single count bar for that column + Overall line
  const chartData = useMemo(() => {
    if (isFtrColumn) {
      if (!circleGraphData || !circleGraphData[tech]) return [];
      const circleSeries = circleGraphData[tech].series || [];
      const grandSeries = (grandGraphData && grandGraphData[tech]?.series) || [];
      const grandByMonth = {};
      grandSeries.forEach((g) => { grandByMonth[g.name] = g; });

      return circleSeries.map((s) => {
        const row = { month: s.name };
        circleNames.forEach((c) => { row[c] = s.circles?.[c] ?? null; });
        const grand = grandByMonth[s.name];
        row.Overall = grand?.grand_total_scft ?? null;
        return row;
      });
    }

    if (!grandGraphData || !grandGraphData[tech]) return [];
    const categories = grandGraphData[tech].categories || [];
    const catIdx = categories.indexOf(selectedColumn);
    const series = grandGraphData[tech].series || [];
    return series.map((s) => ({
      month: s.name,
      [selectedColumn]: catIdx >= 0 ? (s.data?.[catIdx] ?? null) : null,
      Overall: s.grand_total_scft ?? null,
    }));
  }, [isFtrColumn, selectedColumn, circleGraphData, grandGraphData, tech, circleNames]);

  // Month-range filter — fully flexible (any month/any year), not limited
  // to whatever months the API happens to return.
  const filteredChartData = useMemo(() => {
    if (!chartData.length) return chartData;
    const fromKey = monthSortKey(monthRange.from);
    const toKey = monthSortKey(monthRange.to);

    return chartData.filter((row) => {
      const key = monthSortKey(row.month);
      if (key == null) return false;
      if (fromKey != null && toKey != null) {
        const lo = Math.min(fromKey, toKey);
        const hi = Math.max(fromKey, toKey);
        return key >= lo && key <= hi;
      }
      if (fromKey != null) return key >= fromKey;
      if (toKey != null) return key <= toKey;
      return true;
    });
  }, [chartData, monthRange]);

  const hasData = filteredChartData.length > 0 && (isFtrColumn ? circleNames.length > 0 : true);
  const numCircles = circleNames.length;
  const maxBarSize = numCircles <= 2 ? 44 : numCircles <= 4 ? 32 : numCircles <= 6 ? 24 : 16;
  const chartHeight = Math.max(420, 380 + Math.max(0, numCircles - 4) * 14);
  const hasOverall = filteredChartData.some((row) => row.Overall != null);

  const monthLabel = filteredChartData.length
    ? (filteredChartData.length === 1
        ? filteredChartData[0].month
        : `${filteredChartData[0].month} → ${filteredChartData[filteredChartData.length - 1].month}`)
    : "";

  const resetMonthRange = () => {
    const m = getCurrentMonthLabel();
    setMonthRange({ from: m, to: m });
  };

  return (
    <>
      <Box sx={{ m: 1, ml: 1.5, mt: 1.5 }}>
        <Breadcrumbs aria-label="breadcrumb" maxItems={3}
          separator={<KeyboardArrowRightIcon fontSize="small" />}>
          <Link underline="hover" sx={{ cursor: "pointer" }} onClick={() => navigate("/tools")}>Tools</Link>
          <Link underline="hover" sx={{ cursor: "pointer" }} onClick={() => navigate("/tools/performance_at_tat")}>Performance At TAT</Link>
          <Typography color="text.primary">Performance SCFT Graph</Typography>
        </Breadcrumbs>
      </Box>

      <Box p={1.5}>
        {/* Top bar */}
        <Paper elevation={0} sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 2, mb: 2.5, px: 2.5, py: 2,
          borderRadius: "16px", border: "1px solid #e8ecf0", bgcolor: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <Box>
            <Typography fontWeight={800} fontSize={20} letterSpacing="-.3px" color="#1a1a2e">
              Performance SCFT Graph
            </Typography>
            <Typography fontSize={13} color="text.secondary" mt={0.2}>
              Circles as bars per month · Overall (grand total SCFT FTR) as trend line
            </Typography>
          </Box>
          <MonthRangePicker
            monthFrom={monthRange.from}
            monthTo={monthRange.to}
            onChange={setMonthRange}
            onReset={resetMonthRange}
          />
        </Paper>

        {/* Tabs + filters + chart card */}
        <Paper elevation={0} sx={{ borderRadius: "16px", border: "1px solid #e8ecf0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", mb: 2 }}>
          {/* Tech tabs */}
          <Box sx={{ display: "flex", borderBottom: "1.5px solid #e8ecf0", bgcolor: "#f8fafc", px: 1.5, pt: 0.5 }}>
            {TECH_TABS.map((tab) => {
              const isActive = tech === tab.key;
              const tColor = TECH_COLORS[tab.key];
              return (
                <Box key={tab.key} onClick={() => setTech(tab.key)}
                  sx={{
                    px: 3, py: 1, cursor: "pointer", userSelect: "none",
                    fontWeight: isActive ? 700 : 500, fontSize: 13,
                    color: isActive ? "#fff" : tColor.tabColor,
                    background: isActive ? tColor.active : "transparent",
                    borderRadius: "8px 8px 0 0",
                    borderBottom: isActive ? `3px solid ${tColor.tabColor}` : "3px solid transparent",
                    transition: "all 0.2s",
                    "&:hover": { background: isActive ? tColor.active : alpha(tColor.tabColor, 0.08) },
                  }}>
                  {tab.label}
                </Box>
              );
            })}
          </Box>

          {/* Column filter (single select, one at a time) */}
          <Box sx={{
            display: "flex", alignItems: "center", px: 2, py: 1.4,
            bgcolor: "#f8fafc", borderBottom: "1px solid #e8ecf0",
          }}>
            <ColumnFilter value={selectedColumn} onChange={setSelectedColumn} />
          </Box>

          {/* Circle filter — only meaningful for the "SCFT FTR" column */}
          {isFtrColumn && (
            <Box sx={{
              display: "flex", alignItems: "center", px: 2, py: 1.4,
              bgcolor: "#f8fafc", borderBottom: "1px solid #e8ecf0",
            }}>
              <CircleChipFilter circles={allCircleNames} selectedCircles={selectedCircles} onChange={setSelectedCircles} />
            </Box>
          )}

          {/* Chart panel */}
          <Box sx={{ borderRadius: 0, overflow: "hidden", background: "#fff" }}>
            <Box sx={{
              background: `linear-gradient(135deg, ${HEADER_GRADIENT_FROM} 0%, ${HEADER_GRADIENT_TO} 100%)`,
              px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 1,
            }}>
              <Box display="flex" alignItems="center" gap={1.2}>
                <BarChartIcon sx={{ color: "#fff", fontSize: 20 }} />
                <Typography fontWeight={700} fontSize={15} color="#fff">
                  Performance SCFT — {tech} · {selectedColumn}
                </Typography>
              </Box>
              {monthLabel && (
                <Chip label={monthLabel} size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 700, fontSize: 11 }} />
              )}
            </Box>

            <Box sx={{ px: 3, pt: 3, pb: 2, background: "#fafbfc", minHeight: chartHeight + 40 }}>
              {loading ? (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={chartHeight} gap={2}>
                  <CircularProgress size={40} sx={{ color: HEADER_GRADIENT_FROM }} />
                  <Typography fontSize={13} color="text.secondary">Loading data…</Typography>
                </Box>
              ) : error ? (
                <Typography color="error" py={4} textAlign="center">{error}</Typography>
              ) : !hasData ? (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={chartHeight} gap={1.5}>
                  <Box sx={{ width: 56, height: 56, borderRadius: "14px", bgcolor: alpha(HEADER_GRADIENT_FROM, 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BarChartIcon sx={{ color: HEADER_GRADIENT_FROM, fontSize: 28 }} />
                  </Box>
                  <Typography fontSize={14} fontWeight={600} color="text.secondary">No Data Available</Typography>
                  <Typography fontSize={12} color="text.disabled">Try adjusting the month range, column, or circle filter</Typography>
                </Box>
              ) : (
                <>
                  {!hasOverall && (
                    <Typography fontSize={11.5} color="#c62828" fontWeight={600} mb={1}>
                      Overall (grand total) data unavailable — the grand-total endpoint returned no matching month entries.
                    </Typography>
                  )}
                  <ResponsiveContainer width="100%" height={chartHeight}>
                    <ComposedChart data={filteredChartData} margin={{ top: 32, right: 52, left: 0, bottom: 8 }} barCategoryGap="28%" barGap={3}>
                      <CircleGradientDefs circleNames={circleNames} />
                      <CartesianGrid strokeDasharray="4 4" stroke="#eaeef2" vertical={false} />
                      <XAxis dataKey="month" tick={<CustomXTick />} axisLine={{ stroke: "#dde3ea" }} tickLine={false} height={34} />
                      <YAxis
                        yAxisId="left"
                        domain={isFtrColumn ? [0, 100] : [0, "auto"]}
                        ticks={isFtrColumn ? PERCENT_AXIS_TICKS : undefined}
                        tick={{ fontSize: 11, fill: "#90a4ae" }}
                        axisLine={false} tickLine={false} width={46}
                      />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} ticks={PERCENT_AXIS_TICKS} tick={{ fontSize: 11, fill: OVERALL_LINE_COLOR }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={46} />
                      <Tooltip content={<CustomTooltip barSuffix={isFtrColumn ? "%" : ""} />} cursor={{ fill: "rgba(100,120,150,0.05)", radius: 6 }} />
                      <Legend
                        wrapperStyle={{ paddingTop: 20, paddingBottom: 4 }}
                        iconSize={11}
                        formatter={(value) => {
                          if (value === "Overall") return <span style={{ color: OVERALL_LINE_COLOR, fontWeight: 700, fontSize: 11.5 }}>Overall (SCFT FTR)</span>;
                          if (!isFtrColumn) return <span style={{ color: COLUMN_COLORS[selectedColumn] || "#455a64", fontWeight: 700, fontSize: 11.5 }}>{value}</span>;
                          const idx = circleNames.indexOf(value);
                          return <span style={{ color: getCircleBarColor(idx >= 0 ? idx : 0), fontWeight: 700, fontSize: 11.5 }}>{value}</span>;
                        }}
                      />
                      {isFtrColumn ? (
                        circleNames.map((circleName, i) => (
                          <Bar key={circleName} yAxisId="left" dataKey={circleName} fill={`url(#pscft-cg${i})`} radius={[4, 4, 0, 0]} maxBarSize={maxBarSize} legendType="square">
                            <LabelList dataKey={circleName} content={(props) => <BarTopLabel {...props} labelColor={getCircleBarColor(i)} />} />
                          </Bar>
                        ))
                      ) : (
                        <Bar yAxisId="left" dataKey={selectedColumn} fill={COLUMN_COLORS[selectedColumn] || HEADER_GRADIENT_FROM} radius={[4, 4, 0, 0]} maxBarSize={56} legendType="square">
                          <LabelList dataKey={selectedColumn} content={(props) => <BarTopLabel {...props} labelColor={COLUMN_COLORS[selectedColumn]} />} />
                        </Bar>
                      )}
                      <Line yAxisId="right" type="monotone" dataKey="Overall" stroke={OVERALL_LINE_COLOR} strokeWidth={2.5} dot={{ r: 5, fill: OVERALL_LINE_COLOR, strokeWidth: 0 }} activeDot={{ r: 7 }} connectNulls legendType="line">
                        <LabelList dataKey="Overall" content={(props) => <LineTopLabel {...props} />} />
                      </Line>
                    </ComposedChart>
                  </ResponsiveContainer>
                </>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default SCFTFTRGraph;