// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import {
//   Box,
//   Grid,
//   Paper,
//   Typography,
//   Card,
//   CardContent,
//   Stack,
//   TextField,
//   MenuItem,
//   Autocomplete,
//   Button,
//   Chip,
//   Tabs,
//   Tab,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   CircularProgress,
//   Divider,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import GroupsIcon from "@mui/icons-material/Groups";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import PauseCircleIcon from "@mui/icons-material/PauseCircle";
// import PublicIcon from "@mui/icons-material/Public";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RTooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
// } from "recharts";

// /* ------------------------------------------------------------------
//  * CONFIG
//  * ------------------------------------------------------------------
//  * Adjust BASE_URL to wherever this router is actually mounted
//  * (the urls.py you shared only has the relative paths, e.g.
//  * 'analytics/', 'circle-summary/' — prefix with whatever your
//  * project's include() uses, e.g. '/field_resource_tracking/api/').
//  *
//  * ASSUMED RESPONSE SHAPES (edit the accessor helpers below,
//  * marked with "// <-- adjust", to match your actual serializers):
//  *
//  *   GET  dashboard/            -> { total, working, idle, circles }
//  *   GET  circle-summary/       -> [{ circle, working, idle, total }]
//  *   GET  dept-summary/         -> [{ department, working, idle, total }]
//  *   GET  skill-summary/        -> [{ skill, count }]
//  *   GET  project-summary/      -> [{ project, count }]
//  *   GET  date-summary/         -> [{ date, working, idle }]
//  *   GET  manager-summary/      -> [{ manager, team_size, working, idle }]
//  *   GET  idle/                 -> [{ employee_id, name, circle, department, skill, manager, last_active }]
//  *   GET  working/              -> [{ employee_id, name, circle, department, project, manager }]
//  *   GET  dates/                -> ["2026-07-01", "2026-07-02", ...]
//  *   GET  search/?q=            -> [{ employee_id, name, circle, department }]
//  *   GET  date-range/?from=&to= -> same shape as dashboard/ (filtered)
//  * ---------------------------------------------------------------- */
// const BASE_URL = "https://commtoolapi.mcpspmis.com/field_resource_tracking"; // <-- adjust if the router is mounted elsewhere

// const api = axios.create({ baseURL: BASE_URL });

// const COLORS = ["#00695c", "#26a69a", "#80cbc4", "#f4511e", "#ffb74d", "#5c6bc0", "#8d6e63"];

// const StatCard = ({ icon, label, value, color }) => (
//   <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0dcd0", height: "100%" }}>
//     <CardContent>
//       <Stack direction="row" alignItems="center" spacing={2}>
//         <Box
//           sx={{
//             width: 48,
//             height: 48,
//             borderRadius: 2,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             bgcolor: `${color}1A`,
//             color: color,
//           }}
//         >
//           {icon}
//         </Box>
//         <Box>
//           <Typography variant="body2" color="text.secondary">
//             {label}
//           </Typography>
//           <Typography variant="h5" fontWeight={700}>
//             {value ?? "—"}
//           </Typography>
//         </Box>
//       </Stack>
//     </CardContent>
//   </Card>
// );

// const ChartCard = ({ title, height = 320, loading, children, action }) => (
//   <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #e0dcd0", height: "100%" }}>
//     <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
//       <Typography variant="subtitle1" fontWeight={600}>
//         {title}
//       </Typography>
//       {action}
//     </Stack>
//     <Divider sx={{ mb: 2 }} />
//     <Box sx={{ height, display: "flex", alignItems: "center", justifyContent: "center" }}>
//       {loading ? <CircularProgress size={28} /> : children}
//     </Box>
//   </Paper>
// );

// export default function FieldResourceDashboard() {
//   // ---- filters ----
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [circleFilter, setCircleFilter] = useState("All");
//   const [deptFilter, setDeptFilter] = useState("All");

//   // ---- data ----
//   const [summary, setSummary] = useState({ total: 0, working: 0, idle: 0, circles: 0 });
//   const [circleSummary, setCircleSummary] = useState([]);
//   const [deptSummary, setDeptSummary] = useState([]);
//   const [skillSummary, setSkillSummary] = useState([]);
//   const [projectSummary, setProjectSummary] = useState([]);
//   const [dateSummary, setDateSummary] = useState([]);
//   const [managerSummary, setManagerSummary] = useState([]);
//   const [idleEmployees, setIdleEmployees] = useState([]);
//   const [workingEmployees, setWorkingEmployees] = useState([]);
//   const [availableDates, setAvailableDates] = useState([]);

//   const [loading, setLoading] = useState({ top: true, charts: true, tables: true });

//   // ---- employee search ----
//   const [searchInput, setSearchInput] = useState("");
//   const [searchOptions, setSearchOptions] = useState([]);
//   const [searchLoading, setSearchLoading] = useState(false);

//   // ---- table tab + pagination ----
//   const [tableTab, setTableTab] = useState("idle"); // idle | working
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const dateParams = useMemo(() => {
//     const p = {};
//     if (dateFrom) p.from = dateFrom;
//     if (dateTo) p.to = dateTo;
//     if (circleFilter !== "All") p.circle = circleFilter;
//     if (deptFilter !== "All") p.department = deptFilter;
//     return p;
//   }, [dateFrom, dateTo, circleFilter, deptFilter]);

//   const fetchTop = useCallback(async () => {
//     setLoading((s) => ({ ...s, top: true }));
//     try {
//       const endpoint = dateFrom || dateTo ? "date-range/" : "dashboard/";
//       const res = await api.get(endpoint, { params: dateParams });
//       const d = res.data || {};
//       setSummary({
//         total: d.total ?? d.total_employees ?? 0, // <-- adjust
//         working: d.working ?? d.working_count ?? 0, // <-- adjust
//         idle: d.idle ?? d.idle_count ?? 0, // <-- adjust
//         circles: d.circles ?? d.circle_count ?? 0, // <-- adjust
//       });
//     } catch (e) {
//       console.error("dashboard fetch failed", e);
//     } finally {
//       setLoading((s) => ({ ...s, top: false }));
//     }
//   }, [dateParams, dateFrom, dateTo]);

//   const fetchCharts = useCallback(async () => {
//     setLoading((s) => ({ ...s, charts: true }));
//     try {
//       const [circleRes, deptRes, skillRes, projectRes, dateRes] = await Promise.all([
//         api.get("circle-summary/", { params: dateParams }),
//         api.get("dept-summary/", { params: dateParams }),
//         api.get("skill-summary/", { params: dateParams }),
//         api.get("project-summary/", { params: dateParams }),
//         api.get("date-summary/", { params: dateParams }),
//       ]);
//       setCircleSummary(circleRes.data || []);
//       setDeptSummary(deptRes.data || []);
//       setSkillSummary(skillRes.data || []);
//       setProjectSummary(projectRes.data || []);
//       setDateSummary(dateRes.data || []);
//     } catch (e) {
//       console.error("charts fetch failed", e);
//     } finally {
//       setLoading((s) => ({ ...s, charts: false }));
//     }
//   }, [dateParams]);

//   const fetchTables = useCallback(async () => {
//     setLoading((s) => ({ ...s, tables: true }));
//     try {
//       const [mgrRes, idleRes, workRes, datesRes] = await Promise.all([
//         api.get("manager-summary/", { params: dateParams }),
//         api.get("idle/", { params: dateParams }),
//         api.get("working/", { params: dateParams }),
//         api.get("dates/"),
//       ]);
//       setManagerSummary(mgrRes.data || []);
//       setIdleEmployees(idleRes.data || []);
//       setWorkingEmployees(workRes.data || []);
//       setAvailableDates(datesRes.data || []);
//     } catch (e) {
//       console.error("tables fetch failed", e);
//     } finally {
//       setLoading((s) => ({ ...s, tables: false }));
//     }
//   }, [dateParams]);

//   const refreshAll = useCallback(() => {
//     fetchTop();
//     fetchCharts();
//     fetchTables();
//   }, [fetchTop, fetchCharts, fetchTables]);

//   useEffect(() => {
//     refreshAll();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleApplyFilters = () => {
//     setPage(0);
//     refreshAll();
//   };

//   const handleSearch = async (query) => {
//     setSearchInput(query);
//     if (!query || query.length < 2) {
//       setSearchOptions([]);
//       return;
//     }
//     setSearchLoading(true);
//     try {
//       const res = await api.get("search/", { params: { q: query } });
//       setSearchOptions(res.data || []);
//     } catch (e) {
//       console.error("search failed", e);
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const circleOptions = useMemo(
//     () => ["All", ...new Set(circleSummary.map((c) => c.circle))], // <-- adjust field name
//     [circleSummary]
//   );
//   const deptOptions = useMemo(
//     () => ["All", ...new Set(deptSummary.map((d) => d.department))], // <-- adjust field name
//     [deptSummary]
//   );

//   const activeTableData = tableTab === "idle" ? idleEmployees : workingEmployees;
//   const pagedRows = activeTableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <Box sx={{ bgcolor: "#F4F1EA", minHeight: "100vh", p: { xs: 2, md: 3 } }}>
//       {/* Header */}
//       <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} mb={3}>
//         <Box>
//           <Typography variant="h5" fontWeight={700} color="#00695c">
//             Field Resource Tracking — Analytics Dashboard
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Circle-wise, department-wise and project-wise workforce insights
//           </Typography>
//         </Box>
//         <Tooltip title="Refresh all data">
//           <IconButton onClick={refreshAll} sx={{ bgcolor: "#00695c", color: "#fff", "&:hover": { bgcolor: "#004d40" } }}>
//             <RefreshIcon />
//           </IconButton>
//         </Tooltip>
//       </Stack>

//       {/* Filter bar */}
//       <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: "1px solid #e0dcd0" }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} sm={6} md={2.5}>
//             <TextField
//               label="From date"
//               type="date"
//               size="small"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               value={dateFrom}
//               onChange={(e) => setDateFrom(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={2.5}>
//             <TextField
//               label="To date"
//               type="date"
//               size="small"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               value={dateTo}
//               onChange={(e) => setDateTo(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={2}>
//             <TextField select label="Circle" size="small" fullWidth value={circleFilter} onChange={(e) => setCircleFilter(e.target.value)}>
//               {circleOptions.map((c) => (
//                 <MenuItem key={c} value={c}>
//                   {c}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={6} md={2}>
//             <TextField select label="Department" size="small" fullWidth value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
//               {deptOptions.map((d) => (
//                 <MenuItem key={d} value={d}>
//                   {d}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={8} md={2}>
//             <Autocomplete
//               size="small"
//               freeSolo
//               loading={searchLoading}
//               options={searchOptions}
//               getOptionLabel={(o) => (typeof o === "string" ? o : `${o.name ?? ""} (${o.employee_id ?? ""})`)} // <-- adjust
//               onInputChange={(e, val) => handleSearch(val)}
//               renderInput={(params) => <TextField {...params} label="Search employee" />}
//             />
//           </Grid>
//           <Grid item xs={12} sm={4} md={1}>
//             <Button fullWidth variant="contained" onClick={handleApplyFilters} sx={{ bgcolor: "#00695c", "&:hover": { bgcolor: "#004d40" } }}>
//               Apply
//             </Button>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Stat cards */}
//       <Grid container spacing={2} mb={3}>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard icon={<GroupsIcon />} label="Total Resources" value={loading.top ? "—" : summary.total} color="#00695c" />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard icon={<CheckCircleIcon />} label="Working" value={loading.top ? "—" : summary.working} color="#2e7d32" />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard icon={<PauseCircleIcon />} label="Idle" value={loading.top ? "—" : summary.idle} color="#e65100" />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard icon={<PublicIcon />} label="Circles Covered" value={loading.top ? "—" : summary.circles} color="#5c6bc0" />
//         </Grid>
//       </Grid>

//       {/* Charts row 1: circle + department */}
//       <Grid container spacing={2} mb={2}>
//         <Grid item xs={12} md={6}>
//           <ChartCard title="Circle-wise Working vs Idle" loading={loading.charts}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={circleSummary}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                 <XAxis dataKey="circle" tick={{ fontSize: 11 }} /> {/* <-- adjust */}
//                 <YAxis />
//                 <RTooltip />
//                 <Legend />
//                 <Bar dataKey="working" stackId="a" fill="#26a69a" name="Working" />
//                 <Bar dataKey="idle" stackId="a" fill="#f4511e" name="Idle" />
//               </BarChart>
//             </ResponsiveContainer>
//           </ChartCard>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <ChartCard title="Department-wise Distribution" loading={loading.charts}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={deptSummary}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                 <XAxis dataKey="department" tick={{ fontSize: 11 }} /> {/* <-- adjust */}
//                 <YAxis />
//                 <RTooltip />
//                 <Legend />
//                 <Bar dataKey="working" stackId="a" fill="#00695c" name="Working" />
//                 <Bar dataKey="idle" stackId="a" fill="#ffb74d" name="Idle" />
//               </BarChart>
//             </ResponsiveContainer>
//           </ChartCard>
//         </Grid>
//       </Grid>

//       {/* Charts row 2: skill + project pie */}
//       <Grid container spacing={2} mb={2}>
//         <Grid item xs={12} md={6}>
//           <ChartCard title="Skill-wise Headcount" loading={loading.charts}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={skillSummary} layout="vertical" margin={{ left: 40 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                 <XAxis type="number" />
//                 <YAxis dataKey="skill" type="category" tick={{ fontSize: 11 }} width={100} /> {/* <-- adjust */}
//                 <RTooltip />
//                 <Bar dataKey="count" fill="#00897b" radius={[0, 4, 4, 0]} /> {/* <-- adjust */}
//               </BarChart>
//             </ResponsiveContainer>
//           </ChartCard>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <ChartCard title="Project-wise Allocation" loading={loading.charts}>
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={projectSummary}
//                   dataKey="count" // <-- adjust
//                   nameKey="project" // <-- adjust
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   label={(entry) => entry.project}
//                 >
//                   {projectSummary.map((entry, i) => (
//                     <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <RTooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </ChartCard>
//         </Grid>
//       </Grid>

//       {/* Trend line */}
//       <Grid container spacing={2} mb={2}>
//         <Grid item xs={12}>
//           <ChartCard title="Working vs Idle Trend Over Time" height={300} loading={loading.charts}>
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={dateSummary}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                 <XAxis dataKey="date" tick={{ fontSize: 11 }} /> {/* <-- adjust */}
//                 <YAxis />
//                 <RTooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="working" stroke="#00695c" strokeWidth={2} dot={false} />
//                 <Line type="monotone" dataKey="idle" stroke="#f4511e" strokeWidth={2} dot={false} />
//               </LineChart>
//             </ResponsiveContainer>
//           </ChartCard>
//         </Grid>
//       </Grid>

//       {/* Manager summary table */}
//       <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: "1px solid #e0dcd0" }}>
//         <Typography variant="subtitle1" fontWeight={600} mb={1}>
//           Reporting Manager Summary
//         </Typography>
//         <Divider sx={{ mb: 2 }} />
//         <TableContainer sx={{ maxHeight: 320 }}>
//           <Table stickyHeader size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Manager</TableCell>
//                 <TableCell align="right">Team Size</TableCell>
//                 <TableCell align="right">Working</TableCell>
//                 <TableCell align="right">Idle</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading.tables ? (
//                 <TableRow>
//                   <TableCell colSpan={4} align="center">
//                     <CircularProgress size={24} />
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 managerSummary.map((row, i) => (
//                   <TableRow key={i} hover>
//                     <TableCell>{row.manager}</TableCell> {/* <-- adjust */}
//                     <TableCell align="right">{row.team_size}</TableCell> {/* <-- adjust */}
//                     <TableCell align="right">
//                       <Chip size="small" label={row.working} sx={{ bgcolor: "#e0f2f1", color: "#00695c" }} />
//                     </TableCell>
//                     <TableCell align="right">
//                       <Chip size="small" label={row.idle} sx={{ bgcolor: "#fff3e0", color: "#e65100" }} />
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Idle / Working employee list */}
//       <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #e0dcd0" }}>
//         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
//           <Tabs
//             value={tableTab}
//             onChange={(e, v) => {
//               setTableTab(v);
//               setPage(0);
//             }}
//             textColor="inherit"
//             TabIndicatorProps={{ style: { backgroundColor: "#00695c" } }}
//           >
//             <Tab value="idle" label={`Idle (${idleEmployees.length})`} sx={{ fontWeight: 600 }} />
//             <Tab value="working" label={`Working (${workingEmployees.length})`} sx={{ fontWeight: 600 }} />
//           </Tabs>
//           {availableDates.length > 0 && (
//             <Typography variant="caption" color="text.secondary">
//               Data available for {availableDates.length} dates
//             </Typography>
//           )}
//         </Stack>
//         <Divider sx={{ mb: 2 }} />
//         <TableContainer sx={{ maxHeight: 400 }}>
//           <Table stickyHeader size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Employee ID</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Circle</TableCell>
//                 <TableCell>Department</TableCell>
//                 <TableCell>{tableTab === "idle" ? "Skill" : "Project"}</TableCell>
//                 <TableCell>Manager</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading.tables ? (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center">
//                     <CircularProgress size={24} />
//                   </TableCell>
//                 </TableRow>
//               ) : pagedRows.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center">
//                     <Typography variant="body2" color="text.secondary" py={2}>
//                       No records found
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 pagedRows.map((row, i) => (
//                   <TableRow key={i} hover>
//                     <TableCell>{row.employee_id}</TableCell> {/* <-- adjust */}
//                     <TableCell>{row.name}</TableCell> {/* <-- adjust */}
//                     <TableCell>{row.circle}</TableCell> {/* <-- adjust */}
//                     <TableCell>{row.department}</TableCell> {/* <-- adjust */}
//                     {/* <TableCell>{tableTab === "idle" ? row.skill : row.project}</TableCell>  */}
//                     <TableCell>{row.manager}</TableCell> {/* <-- adjust */}
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           component="div"
//           count={activeTableData.length}
//           page={page}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
//           rowsPerPageOptions={[10, 25, 50]}
//         />
//       </Paper>
//     </Box>
//   );
// }


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
  // Tabs,   // <-- was only used for idle/working table tabs, commented out below
  // Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  // TablePagination, // <-- only used by idle/working table
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PublicIcon from "@mui/icons-material/Public";
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

/* ------------------------------------------------------------------
 * CONFIG
 * ------------------------------------------------------------------
 * NOTE (from Network tab): idle/ and working/ endpoints require a
 * single ?date=YYYY-MM-DD param, e.g.
 *   { "error": "Please provide a date. Example: /api/idle/?date=2026-06-15" }
 * They do NOT accept from/to/circle/department like the summary
 * endpoints do. Both calls are commented out below for now so the
 * rest of the dashboard renders. See "RE-ENABLE IDLE/WORKING" notes
 * further down for how to turn them back on once you confirm the
 * exact query param the backend expects (date vs from/to on this
 * endpoint specifically).
 * ---------------------------------------------------------------- */
const BASE_URL = "https://commtoolapi.mcpspmis.com/field_resource_tracking"; // <-- adjust if the router is mounted elsewhere

const api = axios.create({ baseURL: BASE_URL });

const COLORS = ["#00695c", "#26a69a", "#80cbc4", "#f4511e", "#ffb74d", "#5c6bc0", "#8d6e63"];

// Small helper so a non-array API response (error object, {results:[...]}, undefined, etc.)
// never crashes a .map() call downstream.
const toArray = (val) => {
  if (Array.isArray(val)) return val;
  if (val && Array.isArray(val.results)) return val.results; // handles DRF pagination shape
  return [];
};

// Every summary endpoint here wraps its array in a named key instead of
// returning a bare array, e.g. circle-summary/ -> { total_circles, circles: [...] }
// dept-summary/ -> { total_departments, departments: [...] }
// skill-summary/ -> { total_skills, skills: [...] }
// project-summary/ -> { total_projects, projects: [...] }
// manager-summary/ -> { total_managers, managers: [...] }
// date-summary/ -> { total_dates, dates: [ {date, working, idle, ...} ] }
// dates/ -> { total_dates, dates: [ "2026-06-15", ... ] }  (array of strings, not objects)
// unwrap() tries the given key first, then falls back to toArray().
const unwrap = (data, key) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data[key])) return data[key];
  return toArray(data);
};

const StatCard = ({ icon, label, value, color }) => (
  <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0dcd0", height: "100%" }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: `${color}1A`,
            color: color,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {value ?? "—"}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const ChartCard = ({ title, height = 320, loading, children, action }) => (
  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #e0dcd0", height: "100%" }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
      {action}
    </Stack>
    <Divider sx={{ mb: 2 }} />
    <Box sx={{ height, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {loading ? <CircularProgress size={28} /> : children}
    </Box>
  </Paper>
);

export default function FieldResourceDashboard() {
  // ---- filters ----
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [circleFilter, setCircleFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  // idle/ and working/ take a single ?date= param (not a range) — kept here
  // for when those calls are re-enabled.
  // eslint-disable-next-line no-unused-vars
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  // ---- data ----
  const [summary, setSummary] = useState({ total: 0, working: 0, idle: 0, circles: 0 });
  const [circleSummary, setCircleSummary] = useState([]);
  const [deptSummary, setDeptSummary] = useState([]);
  const [skillSummary, setSkillSummary] = useState([]);
  const [projectSummary, setProjectSummary] = useState([]);
  const [dateSummary, setDateSummary] = useState([]);
  const [managerSummary, setManagerSummary] = useState([]);
  // const [idleEmployees, setIdleEmployees] = useState([]);       // <-- idle/ disabled, see fetchTables
  // const [workingEmployees, setWorkingEmployees] = useState([]); // <-- working/ disabled, see fetchTables
  const [availableDates, setAvailableDates] = useState([]);

  const [loading, setLoading] = useState({ top: true, charts: true, tables: true });

  // ---- employee search ----
  const [searchInput, setSearchInput] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // ---- table tab + pagination ---- (kept but unused while idle/working table is disabled)
  // const [tableTab, setTableTab] = useState("idle"); // idle | working
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  const dateParams = useMemo(() => {
    const p = {};
    if (dateFrom) p.from = dateFrom;
    if (dateTo) p.to = dateTo;
    if (circleFilter !== "All") p.circle = circleFilter;
    if (deptFilter !== "All") p.department = deptFilter;
    return p;
  }, [dateFrom, dateTo, circleFilter, deptFilter]);

  // Stat cards are now derived from circle-summary/ (see fetchCharts below)
  // rather than a separate dashboard/ or date-range/ call, since that
  // endpoint's response shape wasn't confirmed. If you want the cards fed
  // by a dedicated endpoint instead, add a fetchTop() call and wire it back
  // into refreshAll() once you've confirmed its exact field names.

  const fetchCharts = useCallback(async () => {
    setLoading((s) => ({ ...s, top: true, charts: true }));
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

      // Stat cards: derive from circle-summary totals since it carries
      // total_employees/working/idle per circle plus a circle count.
      const totalEmployees = circles.reduce((sum, c) => sum + (c.total_employees || 0), 0);
      const totalWorking = circles.reduce((sum, c) => sum + (c.working || 0), 0);
      const totalIdle = circles.reduce((sum, c) => sum + (c.idle || 0), 0);
      const circleCount = circleRes.data?.total_circles ?? circles.length;
      setSummary({ total: totalEmployees, working: totalWorking, idle: totalIdle, circles: circleCount });
    } catch (e) {
      console.error("charts fetch failed", e);
    } finally {
      setLoading((s) => ({ ...s, top: false, charts: false }));
    }
  }, [dateParams]);

  const fetchTables = useCallback(async () => {
    setLoading((s) => ({ ...s, tables: true }));
    try {
      // --- RE-ENABLE IDLE/WORKING ---
      // idle/ and working/ returned 400 because they require ?date=YYYY-MM-DD
      // (not from/to/circle/department). To turn them back on, uncomment the
      // two api.get calls below, uncomment idleEmployees/workingEmployees
      // state above, uncomment the Idle/Working table section in the JSX,
      // and pass a date param, e.g.:
      //   api.get("idle/", { params: { date: selectedDate } }),
      //   api.get("working/", { params: { date: selectedDate } }),
      const [mgrRes, /* idleRes, workRes, */ datesRes] = await Promise.all([
        api.get("manager-summary/", { params: dateParams }),
        // api.get("idle/", { params: { date: selectedDate } }),
        // api.get("working/", { params: { date: selectedDate } }),
        api.get("dates/"),
      ]);
      setManagerSummary(unwrap(mgrRes.data, "managers"));
      // setIdleEmployees(toArray(idleRes.data));
      // setWorkingEmployees(toArray(workRes.data));
      // dates/ returns { total_dates, dates: ["2026-06-15", ...] } — array of strings
      setAvailableDates(unwrap(datesRes.data, "dates"));
    } catch (e) {
      console.error("tables fetch failed", e);
    } finally {
      setLoading((s) => ({ ...s, tables: false }));
    }
  }, [dateParams]);

  const refreshAll = useCallback(() => {
    fetchCharts(); // also populates the 4 stat cards, derived from circle-summary/
    fetchTables();
  }, [fetchCharts, fetchTables]);

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    // setPage(0); // <-- was for idle/working table pagination, disabled
    refreshAll();
  };

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

  // const activeTableData = tableTab === "idle" ? idleEmployees : workingEmployees;
  // const pagedRows = activeTableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ bgcolor: "#F4F1EA", minHeight: "100vh", p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#00695c">
            Field Resource Tracking — Analytics Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Circle-wise, department-wise and project-wise workforce insights
          </Typography>
        </Box>
        <Tooltip title="Refresh all data">
          <IconButton onClick={refreshAll} sx={{ bgcolor: "#00695c", color: "#fff", "&:hover": { bgcolor: "#004d40" } }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Filter bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: "1px solid #e0dcd0" }}>
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
            <TextField select label="Circle" size="small" fullWidth value={circleFilter} onChange={(e) => setCircleFilter(e.target.value)}>
              {circleOptions.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField select label="Department" size="small" fullWidth value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
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
              getOptionLabel={(o) => (typeof o === "string" ? o : `${o.name ?? ""} (${o.employee_id ?? ""})`)} // <-- adjust
              onInputChange={(e, val) => handleSearch(val)}
              renderInput={(params) => <TextField {...params} label="Search employee" />}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={1}>
            <Button fullWidth variant="contained" onClick={handleApplyFilters} sx={{ bgcolor: "#00695c", "&:hover": { bgcolor: "#004d40" } }}>
              Apply
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Stat cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<GroupsIcon />} label="Total Resources" value={loading.top ? "—" : summary.total} color="#00695c" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<CheckCircleIcon />} label="Working" value={loading.top ? "—" : summary.working} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<PauseCircleIcon />} label="Idle" value={loading.top ? "—" : summary.idle} color="#e65100" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<PublicIcon />} label="Circles Covered" value={loading.top ? "—" : summary.circles} color="#5c6bc0" />
        </Grid>
      </Grid>

      {/* Charts row 1: circle + department */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <ChartCard title="Circle-wise Working vs Idle" loading={loading.charts}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={circleSummary}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="circle" tick={{ fontSize: 11 }} /> {/* <-- adjust */}
                <YAxis />
                <RTooltip />
                <Legend />
                <Bar dataKey="working" stackId="a" fill="#26a69a" name="Working" />
                <Bar dataKey="idle" stackId="a" fill="#f4511e" name="Idle" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard title="Department-wise Distribution" loading={loading.charts}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptSummary}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} /> {/* <-- adjust */}
                <YAxis />
                <RTooltip />
                <Legend />
                <Bar dataKey="working" stackId="a" fill="#00695c" name="Working" />
                <Bar dataKey="idle" stackId="a" fill="#ffb74d" name="Idle" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Charts row 2: skill + project pie */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <ChartCard title="Skill-wise Headcount" loading={loading.charts}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillSummary} layout="vertical" margin={{ left: 90 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis type="number" />
                <YAxis dataKey="skill_set" type="category" tick={{ fontSize: 11 }} width={100} />
                <RTooltip />
                <Bar dataKey="total_employees" fill="#00897b" radius={[0, 4, 4, 0]} name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard title="Project-wise Allocation" loading={loading.charts}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectSummary}
                  dataKey="total"
                  nameKey="project"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry.project}
                >
                  {toArray(projectSummary).map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <RTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Trend line */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12}>
          <ChartCard title="Working vs Idle Trend Over Time" height={300} loading={loading.charts}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dateSummary}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} /> {/* <-- adjust */}
                <YAxis />
                <RTooltip />
                <Legend />
                <Line type="monotone" dataKey="working" stroke="#00695c" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="idle" stroke="#f4511e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Manager summary table */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: "1px solid #e0dcd0" }}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Reporting Manager Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer sx={{ maxHeight: 320 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Manager</TableCell>
                <TableCell align="right">Team Size</TableCell>
                <TableCell align="right">Working</TableCell>
                <TableCell align="right">Idle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading.tables ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : managerSummary.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="text.secondary" py={2}>
                      No records found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                managerSummary.map((row, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{row.reporting_manager}</TableCell>
                    <TableCell align="right">{row.total_employees}</TableCell>
                    <TableCell align="right">
                      <Chip size="small" label={row.working} sx={{ bgcolor: "#e0f2f1", color: "#00695c" }} />
                    </TableCell>
                    <TableCell align="right">
                      <Chip size="small" label={row.idle} sx={{ bgcolor: "#fff3e0", color: "#e65100" }} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Idle / Working employee list — DISABLED
          idle/ and working/ endpoints need ?date=YYYY-MM-DD and were
          returning 400 with from/to/circle/department params. Uncomment
          this whole block once fetchTables idle/working calls above are
          re-enabled (see RE-ENABLE IDLE/WORKING note).

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #e0dcd0" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Tabs
            value={tableTab}
            onChange={(e, v) => {
              setTableTab(v);
              setPage(0);
            }}
            textColor="inherit"
            TabIndicatorProps={{ style: { backgroundColor: "#00695c" } }}
          >
            <Tab value="idle" label={`Idle (${idleEmployees.length})`} sx={{ fontWeight: 600 }} />
            <Tab value="working" label={`Working (${workingEmployees.length})`} sx={{ fontWeight: 600 }} />
          </Tabs>
          {availableDates.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              Data available for {availableDates.length} dates
            </Typography>
          )}
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Circle</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>{tableTab === "idle" ? "Skill" : "Project"}</TableCell>
                <TableCell>Manager</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading.tables ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : pagedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" py={2}>
                      No records found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pagedRows.map((row, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{row.employee_id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.circle}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{tableTab === "idle" ? row.skill : row.project}</TableCell>
                    <TableCell>{row.manager}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={activeTableData.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Paper>
      */}
    </Box>
  );
}