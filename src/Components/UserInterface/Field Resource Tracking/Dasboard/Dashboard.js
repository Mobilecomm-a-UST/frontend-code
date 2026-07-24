import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Stack,
  TextField,
  MenuItem,
  Autocomplete,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import PublicIcon from "@mui/icons-material/Public";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ------------------------------------------------------------------
 * CONFIG
 * ------------------------------------------------------------------
 * Confirmed response shapes (from live API, June 2026):
 *
 * circle-summary/  -> { total_circles, circles: [
 *   { circle, total_employees, total_surveys, working, idle, leave, week_off, call_not_respond }
 * ]}
 * dept-summary/    -> { total_departments, departments: [
 *   { department, total_employees, total_surveys, working, idle, leave, week_off, call_not_respond }
 * ]}
 * skill-summary/   -> { total_skills, skills: [
 *   { skill_set, total_employees, total_surveys, working, idle, leave, week_off, call_not_respond }
 * ]}
 * project-summary/ -> { total_projects, projects: [
 *   { project, total, working, idle, leave, call_not_respond }
 * ]}
 * date-summary/    -> { total_dates, dates: [
 *   { date, total, working, idle, leave, week_off, call_not_respond }
 * ]}
 * manager-summary/ -> { total_managers, managers: [
 *   { reporting_manager, total_employees, working, idle, leave, call_not_respond }
 * ]}
 * dates/           -> { total_dates, dates: ["2026-05-21", ...] }  (plain date strings)
 *
 * idle/ and working/ require a single ?date=YYYY-MM-DD param (not
 * from/to/circle/department) and are left disabled below until the
 * per-employee list endpoints are wired up on their own control.
 * ---------------------------------------------------------------- */
const BASE_URL = "https://commtoolapi.mcpspmis.com/field_resource_tracking"; // <-- adjust if the router is mounted elsewhere

const api = axios.create({ baseURL: BASE_URL });

// Every status bucket that shows up across circle/department/skill/date
// summaries, in the order we always want it stacked, plus the color and
// icon each one carries through every chart, card, and legend so the
// palette reads the same way everywhere in the dashboard.
const STATUS_META = [
  { key: "working", label: "Working", color: "#1E8E7E" },
  { key: "idle", label: "Idle", color: "#E8783C" },
  { key: "leave", label: "Leave", color: "#F0B23A" },
  { key: "week_off", label: "Week Off", color: "#6F7FD6" },
  { key: "call_not_respond", label: "Not Responding", color: "#D8455C" },
];
const STATUS_COLOR = Object.fromEntries(STATUS_META.map((s) => [s.key, s.color]));

const PALETTE = {
  bg: "#F3F1EC",
  ink: "#16302B",
  card: "#FFFFFF",
  border: "#E2DED2",
  brand: "#1E8E7E",
  brandDark: "#0F5A50",
};

const theme = createTheme({
  palette: {
    background: { default: PALETTE.bg, paper: PALETTE.card },
    primary: { main: PALETTE.brand, dark: PALETTE.brandDark },
    text: { primary: PALETTE.ink },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    h5: { fontFamily: '"Newsreader", "Georgia", serif', letterSpacing: "-0.01em" },
    subtitle1: { fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
});

// Small helper so a non-array API response (error object, {results:[...]}, undefined, etc.)
// never crashes a .map() call downstream.
const toArray = (val) => {
  if (Array.isArray(val)) return val;
  if (val && Array.isArray(val.results)) return val.results; // handles DRF pagination shape
  return [];
};

// Every summary endpoint wraps its array in a named key instead of
// returning a bare array, e.g. circle-summary/ -> { total_circles, circles: [...] }.
// unwrap() tries the given key first, then falls back to toArray().
const unwrap = (data, key) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data[key])) return data[key];
  return toArray(data);
};

const sumField = (rows, key) => rows.reduce((acc, r) => acc + (Number(r[key]) || 0), 0);

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const StatCard = ({ icon, label, value, color, sub }) => (
  <Card elevation={0} sx={{ border: `1px solid ${PALETTE.border}`, height: "100%" }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: `${color}17`,
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ fontFamily: "Inter, sans-serif !important" }}>
            {value ?? "—"}
          </Typography>
          {sub && (
            <Typography variant="caption" color="text.secondary">
              {sub}
            </Typography>
          )}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const StatusLegend = ({ keys = STATUS_META.map((s) => s.key) }) => (
  <Stack direction="row" spacing={1.5} flexWrap="wrap" rowGap={0.5}>
    {STATUS_META.filter((s) => keys.includes(s.key)).map((s) => (
      <Stack key={s.key} direction="row" spacing={0.7} alignItems="center">
        <Box sx={{ width: 9, height: 9, borderRadius: "3px", bgcolor: s.color }} />
        <Typography variant="caption" color="text.secondary">
          {s.label}
        </Typography>
      </Stack>
    ))}
  </Stack>
);

const ChartCard = ({ title, subtitle, height = 320, loading, empty, children, action }) => (
  <Paper elevation={0} sx={{ p: 2.5, border: `1px solid ${PALETTE.border}`, height: "100%" }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
      <Box>
        <Typography variant="subtitle1">{title}</Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Stack>
    <Divider sx={{ mb: 2 }} />
    <Box sx={{ height, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {loading ? (
        <CircularProgress size={28} />
      ) : empty ? (
        <Typography variant="body2" color="text.secondary">
          No records found
        </Typography>
      ) : (
        children
      )}
    </Box>
  </Paper>
);

export default function FieldResourceDashboard() {
  // ---- filters ----
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [circleFilter, setCircleFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");

  // ---- data ----
  const [circleSummary, setCircleSummary] = useState([]);
  const [deptSummary, setDeptSummary] = useState([]);
  const [skillSummary, setSkillSummary] = useState([]);
  const [projectSummary, setProjectSummary] = useState([]);
  const [dateSummary, setDateSummary] = useState([]);
  const [managerSummary, setManagerSummary] = useState([]);
  const [totalCircles, setTotalCircles] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalSkills, setTotalSkills] = useState(0);
  const [totalManagers, setTotalManagers] = useState(0);
  const [availableDates, setAvailableDates] = useState([]);

  const [loading, setLoading] = useState({ charts: true, tables: true });

  // ---- employee search ----
  const [searchInput, setSearchInput] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const dateParams = useMemo(() => {
    const p = {};
    if (dateFrom) p.from = dateFrom;
    if (dateTo) p.to = dateTo;
    if (circleFilter !== "All") p.circle = circleFilter;
    if (deptFilter !== "All") p.department = deptFilter;
    return p;
  }, [dateFrom, dateTo, circleFilter, deptFilter]);

  const fetchCharts = useCallback(async () => {
    setLoading((s) => ({ ...s, charts: true }));
    try {
      const [circleRes, deptRes, skillRes, projectRes, dateRes] = await Promise.all([
        api.get("circle-summary/", { params: dateParams }),
        api.get("dept-summary/", { params: dateParams }),
        api.get("skill-summary/", { params: dateParams }),
        api.get("project-summary/", { params: dateParams }),
        api.get("date-summary/", { params: dateParams }),
      ]);

      const circles = unwrap(circleRes.data, "circles");
      const departments = unwrap(deptRes.data, "departments");
      const skills = unwrap(skillRes.data, "skills");
      const projects = unwrap(projectRes.data, "projects");
      const dates = unwrap(dateRes.data, "dates");

      setCircleSummary(circles);
      setDeptSummary(departments);
      setSkillSummary(skills);
      setProjectSummary(projects);
      setDateSummary(dates);

      setTotalCircles(circleRes.data?.total_circles ?? circles.length);
      setTotalDepartments(deptRes.data?.total_departments ?? departments.length);
      setTotalSkills(skillRes.data?.total_skills ?? skills.length);
    } catch (e) {
      console.error("charts fetch failed", e);
    } finally {
      setLoading((s) => ({ ...s, charts: false }));
    }
  }, [dateParams]);

  const fetchTables = useCallback(async () => {
    setLoading((s) => ({ ...s, tables: true }));
    try {
      const [mgrRes, datesRes] = await Promise.all([
        api.get("manager-summary/", { params: dateParams }),
        api.get("dates/"),
      ]);
      setManagerSummary(unwrap(mgrRes.data, "managers"));
      setTotalManagers(mgrRes.data?.total_managers ?? unwrap(mgrRes.data, "managers").length);
      // dates/ returns { total_dates, dates: ["2026-05-21", ...] } — array of date strings
      setAvailableDates(unwrap(datesRes.data, "dates"));
    } catch (e) {
      console.error("tables fetch failed", e);
    } finally {
      setLoading((s) => ({ ...s, tables: false }));
    }
  }, [dateParams]);

  const refreshAll = useCallback(() => {
    fetchCharts();
    fetchTables();
  }, [fetchCharts, fetchTables]);

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => refreshAll();

  const handleSearch = async (query) => {
    setSearchInput(query);
    if (!query || query.length < 2) {
      setSearchOptions([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await api.get("search/", { params: { q: query } });
      setSearchOptions(toArray(res.data));
    } catch (e) {
      console.error("search failed", e);
    } finally {
      setSearchLoading(false);
    }
  };

  const circleOptions = useMemo(
    () => ["All", ...new Set(toArray(circleSummary).map((c) => c.circle))],
    [circleSummary]
  );
  const deptOptions = useMemo(
    () => ["All", ...new Set(toArray(deptSummary).map((d) => d.department))],
    [deptSummary]
  );

  // ---- Stat cards -----------------------------------------------------
  // Headcount + circle/department/skill coverage come from the summary
  // totals. Status counts (working/idle/leave/week off/not responding)
  // are the sum of every survey response in the selected date range —
  // these are activity counts, not unique-employee counts, since one
  // employee can be surveyed on several dates.
  const totalEmployees = useMemo(() => sumField(circleSummary, "total_employees"), [circleSummary]);
  const statusTotals = useMemo(() => {
    const out = {};
    STATUS_META.forEach((s) => {
      out[s.key] = sumField(circleSummary, s.key);
    });
    return out;
  }, [circleSummary]);

  // Latest surveyed day, used as a "today" style snapshot beside the
  // range totals above.
  const sortedDateSummary = useMemo(
    () => [...toArray(dateSummary)].sort((a, b) => (a.date > b.date ? 1 : -1)),
    [dateSummary]
  );
  const latestDay = sortedDateSummary[sortedDateSummary.length - 1];

  // ---- Overall status donut -------------------------------------------
  const statusDonutData = useMemo(
    () => STATUS_META.map((s) => ({ name: s.label, key: s.key, value: statusTotals[s.key] || 0 })),
    [statusTotals]
  );
  const donutTotal = statusDonutData.reduce((a, b) => a + b.value, 0);

  // ---- Project-wise allocation ------------------------------------------
  // Sorted descending by total so the biggest buckets are immediately
  // visible; card scrolls internally so long project lists don't get
  // cramped against a fixed-height layout.
  const sortedProjectSummary = useMemo(
    () => [...toArray(projectSummary)].sort((a, b) => (b.total || 0) - (a.total || 0)),
    [projectSummary]
  );
  const projectChartHeight = Math.max(300, sortedProjectSummary.length * 32);

  // ---- Skill-wise breakdown ---------------------------------------------
  const sortedSkillSummary = useMemo(
    () => [...toArray(skillSummary)].sort((a, b) => (b.total_employees || 0) - (a.total_employees || 0)),
    [skillSummary]
  );
  const skillChartHeight = Math.max(300, sortedSkillSummary.length * 34);

  // ---- Manager summary, sorted by team size ------------------------------
  const sortedManagerSummary = useMemo(
    () => [...toArray(managerSummary)].sort((a, b) => (b.total_employees || 0) - (a.total_employees || 0)),
    [managerSummary]
  );

  const dateRangeLabel =
    availableDates.length > 0
      ? `${formatDate(availableDates[0])} – ${formatDate(availableDates[availableDates.length - 1])}`
      : "—";

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: PALETTE.bg, minHeight: "100vh", p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ sm: "center" }}
          spacing={2}
          mb={3}
        >
          <Box>
            <Typography variant="h5" fontWeight={700} color={PALETTE.brandDark}>
              Field Resource Tracking
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Circle, department, project and skill-wise workforce insights · {dateRangeLabel}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip
              icon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
              label={`${availableDates.length} surveyed dates`}
              size="small"
              sx={{ bgcolor: "#fff", border: `1px solid ${PALETTE.border}` }}
            />
            <Tooltip title="Refresh all data">
              <IconButton
                onClick={refreshAll}
                sx={{ bgcolor: PALETTE.brand, color: "#fff", "&:hover": { bgcolor: PALETTE.brandDark } }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Filter bar */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, border: `1px solid ${PALETTE.border}` }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                label="From date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                label="To date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                label="Circle"
                size="small"
                fullWidth
                value={circleFilter}
                onChange={(e) => setCircleFilter(e.target.value)}
              >
                {circleOptions.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                label="Department"
                size="small"
                fullWidth
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                {deptOptions.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={8} md={2}>
              <Autocomplete
                size="small"
                freeSolo
                loading={searchLoading}
                options={searchOptions}
                inputValue={searchInput}
                getOptionLabel={(o) => (typeof o === "string" ? o : `${o.name ?? ""} (${o.employee_id ?? ""})`)} // <-- adjust to real search/ shape
                onInputChange={(e, val) => handleSearch(val)}
                renderInput={(params) => <TextField {...params} label="Search employee" />}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={1}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleApplyFilters}
                sx={{ bgcolor: PALETTE.brand, "&:hover": { bgcolor: PALETTE.brandDark } }}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Stat cards — range totals */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              icon={<GroupsIcon />}
              label="Total Resources"
              value={loading.charts ? "—" : totalEmployees}
              sub={`${totalCircles} circles`}
              color={PALETTE.brand}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              icon={<CheckCircleIcon />}
              label="Working (range)"
              value={loading.charts ? "—" : statusTotals.working}
              color={STATUS_COLOR.working}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              icon={<PauseCircleIcon />}
              label="Idle (range)"
              value={loading.charts ? "—" : statusTotals.idle}
              color={STATUS_COLOR.idle}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              icon={<EventBusyIcon />}
              label="Leave (range)"
              value={loading.charts ? "—" : statusTotals.leave}
              color={STATUS_COLOR.leave}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              icon={<PhoneMissedIcon />}
              label="Not Responding"
              value={loading.charts ? "—" : statusTotals.call_not_respond}
              color={STATUS_COLOR.call_not_respond}
            />
          </Grid>
        </Grid>

        {/* Stat cards — latest surveyed day snapshot */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              icon={<PublicIcon />}
              label="Departments / Skills"
              value={loading.charts ? "—" : `${totalDepartments} / ${totalSkills}`}
              color="#6F7FD6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              icon={<CalendarMonthIcon />}
              label="Latest Day"
              value={loading.tables ? "—" : formatDate(latestDay?.date)}
              sub={latestDay ? `${latestDay.total} surveys` : undefined}
              color="#8D6E63"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              icon={<CheckCircleIcon />}
              label="Working (latest day)"
              value={loading.tables ? "—" : latestDay?.working ?? "—"}
              color={STATUS_COLOR.working}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              icon={<PauseCircleIcon />}
              label="Idle (latest day)"
              value={loading.tables ? "—" : latestDay?.idle ?? "—"}
              color={STATUS_COLOR.idle}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatCard
              icon={<GroupsIcon />}
              label="Reporting Managers"
              value={loading.tables ? "—" : totalManagers}
              color="#8D6E63"
            />
          </Grid>
        </Grid>

        {/* Charts row 1: circle + department, full status breakdown */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={7}>
            <ChartCard
              title="Circle-wise Status Breakdown"
              subtitle={`${circleSummary.length} circles`}
              loading={loading.charts}
              empty={!loading.charts && circleSummary.length === 0}
              action={<StatusLegend />}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={circleSummary} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="circle" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RTooltip />
                  {STATUS_META.map((s, i) => (
                    <Bar
                      key={s.key}
                      dataKey={s.key}
                      stackId="a"
                      fill={s.color}
                      name={s.label}
                      radius={i === STATUS_META.length - 1 ? [3, 3, 0, 0] : undefined}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={5}>
            <ChartCard
              title="Overall Status Split"
              subtitle={`${donutTotal} survey responses in range`}
              loading={loading.charts}
              empty={!loading.charts && donutTotal === 0}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDonutData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {statusDonutData.map((d) => (
                      <Cell key={d.key} fill={STATUS_COLOR[d.key]} />
                    ))}
                  </Pie>
                  <RTooltip />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Charts row 2: department (full breakdown) */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}>
            <ChartCard
              title="Department-wise Status Breakdown"
              subtitle={`${deptSummary.length} departments`}
              loading={loading.charts}
              empty={!loading.charts && deptSummary.length === 0}
              action={<StatusLegend />}
              height={300}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptSummary} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RTooltip />
                  {STATUS_META.map((s, i) => (
                    <Bar
                      key={s.key}
                      dataKey={s.key}
                      stackId="a"
                      fill={s.color}
                      name={s.label}
                      radius={i === STATUS_META.length - 1 ? [3, 3, 0, 0] : undefined}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Charts row 3: skill + project, both scrollable stacked bars */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2.5, border: `1px solid ${PALETTE.border}`, height: "100%" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1">Skill-wise Status Breakdown</Typography>
                <Typography variant="caption" color="text.secondary">
                  {sortedSkillSummary.length} skills
                </Typography>
              </Stack>
              <StatusLegend />
              <Divider sx={{ my: 2 }} />
              <Box sx={{ height: 320, overflowY: "auto", overflowX: "hidden" }}>
                {loading.charts ? (
                  <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CircularProgress size={28} />
                  </Box>
                ) : sortedSkillSummary.length === 0 ? (
                  <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      No records found
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ height: skillChartHeight, width: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sortedSkillSummary}
                        layout="vertical"
                        margin={{ left: 10, right: 20, top: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis dataKey="skill_set" type="category" tick={{ fontSize: 11 }} width={110} interval={0} />
                        <RTooltip />
                        {STATUS_META.map((s, i) => (
                          <Bar
                            key={s.key}
                            dataKey={s.key}
                            stackId="skill"
                            fill={s.color}
                            name={s.label}
                            radius={i === STATUS_META.length - 1 ? [0, 3, 3, 0] : undefined}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            {/* project-summary/ doesn't carry week_off, so its stack only
                spans working / idle / leave / call_not_respond. */}
            <Paper elevation={0} sx={{ p: 2.5, border: `1px solid ${PALETTE.border}`, height: "100%" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1">Project-wise Allocation</Typography>
                <Typography variant="caption" color="text.secondary">
                  {sortedProjectSummary.length} projects
                </Typography>
              </Stack>
              <StatusLegend keys={["working", "idle", "leave", "call_not_respond"]} />
              <Divider sx={{ my: 2 }} />
              <Box sx={{ height: 320, overflowY: "auto", overflowX: "hidden" }}>
                {loading.charts ? (
                  <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CircularProgress size={28} />
                  </Box>
                ) : sortedProjectSummary.length === 0 ? (
                  <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      No records found
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ height: projectChartHeight, width: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sortedProjectSummary}
                        layout="vertical"
                        margin={{ left: 10, right: 20, top: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis dataKey="project" type="category" tick={{ fontSize: 11 }} width={140} interval={0} />
                        <RTooltip />
                        <Bar dataKey="working" stackId="proj" fill={STATUS_COLOR.working} name="Working" />
                        <Bar dataKey="idle" stackId="proj" fill={STATUS_COLOR.idle} name="Idle" />
                        <Bar dataKey="leave" stackId="proj" fill={STATUS_COLOR.leave} name="Leave" />
                        <Bar
                          dataKey="call_not_respond"
                          stackId="proj"
                          fill={STATUS_COLOR.call_not_respond}
                          name="Not Responding"
                          radius={[0, 3, 3, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Trend: stacked area over surveyed dates */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}>
            <ChartCard
              title="Status Trend Over Surveyed Dates"
              subtitle={`${sortedDateSummary.length} dates · ${dateRangeLabel}`}
              height={320}
              loading={loading.charts}
              empty={!loading.charts && sortedDateSummary.length === 0}
              action={<StatusLegend />}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sortedDateSummary} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RTooltip labelFormatter={formatDate} />
                  {STATUS_META.map((s) => (
                    <Area
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      stackId="1"
                      stroke={s.color}
                      fill={s.color}
                      fillOpacity={0.55}
                      name={s.label}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Manager summary table */}
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${PALETTE.border}` }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1">Reporting Manager Summary</Typography>
            <Typography variant="caption" color="text.secondary">
              {sortedManagerSummary.length} managers
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <TableContainer sx={{ maxHeight: 360 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Manager</TableCell>
                  <TableCell align="right">Team Size</TableCell>
                  <TableCell align="right">Working</TableCell>
                  <TableCell align="right">Idle</TableCell>
                  <TableCell align="right">Leave</TableCell>
                  <TableCell align="right">Not Responding</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading.tables ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : sortedManagerSummary.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" py={2}>
                        No records found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedManagerSummary.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell>{row.reporting_manager}</TableCell>
                      <TableCell align="right">{row.total_employees}</TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={row.working}
                          sx={{ bgcolor: `${STATUS_COLOR.working}1A`, color: STATUS_COLOR.working, fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={row.idle}
                          sx={{ bgcolor: `${STATUS_COLOR.idle}1A`, color: STATUS_COLOR.idle, fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={row.leave}
                          sx={{ bgcolor: `${STATUS_COLOR.leave}1A`, color: "#8a5c00", fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={row.call_not_respond}
                          sx={{
                            bgcolor: `${STATUS_COLOR.call_not_respond}1A`,
                            color: STATUS_COLOR.call_not_respond,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}