// import React, { useState, useEffect } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
//     TextField, MenuItem, Select, InputLabel, FormControl, Divider,
//     Card, CardContent, Paper, Alert, Table, TableBody, TableCell,
//     TableContainer, TableHead, TableRow, InputAdornment, Chip,
// } from "@mui/material";
// import {
//     FileDownload as FileDownloadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
//     TrendingUp as TrendingUpIcon,
// } from "@mui/icons-material";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, Cell } from "recharts";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postDataa } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// const circleArray = ['AP', 'DL', 'TNCH', 'NESA', 'RJ', 'JK', 'BR', 'MH', 'MP', 'MU', 'JRK', 'KK', 'UE', 'UW', 'HPHP', 'OR', 'WB/KOL'];
// const bandArray = ['4G', '5G'];
// const projectArray = ['Relocation', 'NT', 'Upgrade', 'ALL'];
// const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// const formatMonthToMMMYY = (monthInputValue) => {
//     if (!monthInputValue) return '';
//     const [year, month] = monthInputValue.split('-');
//     const idx = parseInt(month, 10) - 1;
//     if (idx < 0 || idx > 11 || !year) return '';
//     return `${MONTH_NAMES[idx]}-${year.slice(-2)}`;
// };

// const isChronologicalOrder = (startValue, endValue) => {
//     if (!startValue || !endValue) return false;
//     const [startYear, startMonth] = startValue.split('-').map((v) => parseInt(v, 10));
//     const [endYear, endMonth] = endValue.split('-').map((v) => parseInt(v, 10));
//     if (!startYear || !startMonth || !endYear || !endMonth) return false;
//     const startIndex = startYear * 12 + (startMonth - 1);
//     const endIndex = endYear * 12 + (endMonth - 1);
//     return startIndex <= endIndex;
// };

// const StyledCard = ({ title, classes, children }) => (
//     <Box className={classes.main_Box} sx={{ mb: 3 }}>
//         <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
//             <Box className={classes.Box_Hading}>{title}</Box>
//             <Box sx={{ mt: "-40px" }}>
//                 {children}
//             </Box>
//         </Box>
//     </Box>
// );

// const DownloadButton = ({ url, label }) => {
//     if (!url) return null;
//     return (
//         <a href={url} download target="_blank" rel="noreferrer">
//             <Button
//                 variant="outlined"
//                 startIcon={<FileDownloadIcon sx={{ color: "green" }} />}
//                 sx={{ textTransform: "none", fontWeight: 700 }}
//             >
//                 {label}
//             </Button>
//         </a>
//     );
// };

// // ✅ Summary Table Component with Pagination
// const SummaryTable = ({ data }) => {
//     const [page, setPage] = React.useState(0);
//     const [rowsPerPage, setRowsPerPage] = React.useState(10);

//     if (!data || Object.keys(data).length === 0) {
//         return null;
//     }

//     const dataEntries = Object.entries(data);
//     const displayedRows = dataEntries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     return (
//         <Box sx={{ mt: 4 }}>
//             <Typography sx={{
//                 fontWeight: 700,
//                 fontSize: "16px",
//                 color: "#333",
//                 mb: 2,
//             }}>
//                 📊 Complete Summary Table
//             </Typography>

//             <TableContainer sx={{ border: "1px solid #E0E0E0", borderRadius: 2 }}>
//                 <Table size="small">
//                     <TableHead>
//                         <TableRow sx={{ background: "#f5f5f5" }}>
//                             <TableCell sx={{ fontWeight: 700, fontSize: "12px" }}>Bucket Name</TableCell>
//                             <TableCell align="center" sx={{ fontWeight: 700, fontSize: "12px" }}>0-14 Days</TableCell>
//                             <TableCell align="center" sx={{ fontWeight: 700, fontSize: "12px" }}>14-21 Days</TableCell>
//                             <TableCell align="center" sx={{ fontWeight: 700, fontSize: "12px" }}>21-30 Days</TableCell>
//                             <TableCell align="center" sx={{ fontWeight: 700, fontSize: "12px" }}>&gt;30 Days</TableCell>
//                             <TableCell align="center" sx={{ fontWeight: 700, fontSize: "12px", background: "#006E7420" }}>Grand Total</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {displayedRows.length > 0 ? (
//                             displayedRows.map(([bucketName, bucketData], idx) => (
//                                 <TableRow
//                                     key={bucketName}
//                                     sx={{
//                                         "&:nth-of-type(odd)": { background: "#fafafa" },
//                                         background: bucketName === "Grand Total" ? "#006E7415" : "inherit",
//                                         fontWeight: bucketName === "Grand Total" ? 700 : 400,
//                                     }}
//                                 >
//                                     <TableCell sx={{
//                                         fontSize: "12px",
//                                         fontWeight: bucketName === "Grand Total" ? 700 : 600,
//                                         color: bucketName === "Grand Total" ? "#006E74" : "#333",
//                                     }}>
//                                         {bucketName}
//                                     </TableCell>
//                                     <TableCell align="center" sx={{ fontSize: "12px", fontWeight: bucketName === "Grand Total" ? 700 : 500 }}>
//                                         {bucketData["0-14"] || 0}
//                                     </TableCell>
//                                     <TableCell align="center" sx={{ fontSize: "12px", fontWeight: bucketName === "Grand Total" ? 700 : 500 }}>
//                                         {bucketData["14-21"] || 0}
//                                     </TableCell>
//                                     <TableCell align="center" sx={{ fontSize: "12px", fontWeight: bucketName === "Grand Total" ? 700 : 500 }}>
//                                         {bucketData["21-30"] || 0}
//                                     </TableCell>
//                                     <TableCell align="center" sx={{ fontSize: "12px", fontWeight: bucketName === "Grand Total" ? 700 : 500 }}>
//                                         {bucketData[">30"] || 0}
//                                     </TableCell>
//                                     <TableCell
//                                         align="center"
//                                         sx={{
//                                             fontSize: "12px",
//                                             fontWeight: 700,
//                                             color: bucketName === "Grand Total" ? "#006E74" : "#333",
//                                             background: bucketName === "Grand Total" ? "#006E7430" : "transparent",
//                                         }}
//                                     >
//                                         {bucketData["Grand Total"] || 0}
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         ) : null}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {/* Pagination */}
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, p: 1.5, bgcolor: "#fafafa", borderRadius: 1 }}>
//                 <Typography variant="caption" sx={{ color: "#666", fontSize: "12px" }}>
//                     Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, dataEntries.length)} of {dataEntries.length} rows
//                 </Typography>
//                 <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//                     <Typography variant="caption" sx={{ color: "#666", fontSize: "12px" }}>Rows per page:</Typography>
//                     <Select
//                         size="small"
//                         value={rowsPerPage}
//                         onChange={handleChangeRowsPerPage}
//                         sx={{ minWidth: 70 }}
//                     >
//                         <MenuItem value={5}>5</MenuItem>
//                         <MenuItem value={10}>10</MenuItem>
//                         <MenuItem value={20}>20</MenuItem>
//                         <MenuItem value={50}>50</MenuItem>
//                     </Select>
//                 </Box>
//                 <Box sx={{ display: "flex", gap: 1 }}>
//                     <Button
//                         size="small"
//                         variant="outlined"
//                         onClick={() => setPage(page - 1)}
//                         disabled={page === 0}
//                     >
//                         Previous
//                     </Button>
//                     <Typography variant="caption" sx={{ color: "#666", fontSize: "12px", lineHeight: "2.5" }}>
//                         Page {page + 1}
//                     </Typography>
//                     <Button
//                         size="small"
//                         variant="outlined"
//                         onClick={() => setPage(page + 1)}
//                         disabled={(page + 1) * rowsPerPage >= dataEntries.length}
//                     >
//                         Next
//                     </Button>
//                 </Box>
//             </Box>
//         </Box>
//     );
// };

// // ✅ Chart Component
// const BucketChart = ({ data }) => {
//     if (!data || Object.keys(data).length === 0) {
//         return null;
//     }

//     const chartData = Object.entries(data)
//         .filter(([key]) => key !== "Grand Total")
//         .map(([bucketName, bucketData]) => ({
//             name: bucketName,
//             "0-14": bucketData["0-14"] || 0,
//             "14-21": bucketData["14-21"] || 0,
//             "21-30": bucketData["21-30"] || 0,
//             ">30": bucketData[">30"] || 0,
//             total: bucketData["Grand Total"] || 0,
//         }));

//     return (
//         <Box sx={{ mt: 4, mb: 4 }}>
//             <Typography sx={{
//                 fontWeight: 700,
//                 fontSize: "16px",
//                 color: "#333",
//                 mb: 2,
//             }}>
//                 📈 TAT Distribution by Bucket
//             </Typography>

//             <Card sx={{ p: 2, border: "1px solid #E0E0E0", borderRadius: 2 }}>
//                 <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
//                         <XAxis
//                             dataKey="name"
//                             angle={-45}
//                             textAnchor="end"
//                             height={100}
//                             tick={{ fontSize: 12 }}
//                         />
//                         <YAxis tick={{ fontSize: 12 }} />
//                         <ChartTooltip cursor={{ fill: "#00000010" }} />
//                         <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }} />
//                         <Bar dataKey="0-14" stackId="a" fill="#4CAF50" name="0-14 Days" />
//                         <Bar dataKey="14-21" stackId="a" fill="#FF9800" name="14-21 Days" />
//                         <Bar dataKey="21-30" stackId="a" fill="#2196F3" name="21-30 Days" />
//                         <Bar dataKey=">30" stackId="a" fill="#F44336" name=">30 Days" />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </Card>
//         </Box>
//     );
// };

// // ✅ Dashboard Component
// const Dashboard = ({ dashboardData, filters }) => {
//     if (!dashboardData || !dashboardData.data) {
//         return null;
//     }

//     const data = dashboardData.data;

//     return (
//         <>
//             {/* Dashboard Title with Filters Info */}
//             <Box sx={{ mb: 3, bgcolor: "#fff", p: 2, borderRadius: 1.5, border: "1px solid #E0E0E0" }}>
//                 <Typography sx={{
//                     fontWeight: 800,
//                     fontSize: "18px",
//                     color: "#006E74",
//                     mb: 2,
//                     textTransform: "uppercase",
//                     letterSpacing: 0.5,
//                 }}>
//                     📊 Bucket Overview Dashboard
//                 </Typography>

//                 {/* Filters Info */}
//                 <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
//                     {filters.circle && (
//                         <Chip label={`Circle: ${filters.circle}`} color="primary" variant="outlined" size="small" />
//                     )}
//                     {filters.band && (
//                         <Chip label={`Band: ${filters.band}`} color="primary" variant="outlined" size="small" />
//                     )}
//                     {filters.project && filters.project !== "ALL" && (
//                         <Chip label={`Project: ${filters.project}`} color="primary" variant="outlined" size="small" />
//                     )}
//                     {filters.monthRange && (
//                         <Chip label={filters.monthRange} color="primary" variant="outlined" size="small" />
//                     )}
//                 </Box>
//             </Box>

//             {/* Chart */}
//             <BucketChart data={data} />

//             {/* Summary Table */}
//             <SummaryTable data={data} />

//             {/* Download Button */}
//             {dashboardData.download_url && (
//                 <Box sx={{ mt: 4, mb: 3 }}>
//                     <Typography sx={{
//                         fontWeight: 700,
//                         fontSize: "16px",
//                         color: "#333",
//                         mb: 2,
//                     }}>
//                         💾 Download Report
//                     </Typography>
//                     <DownloadButton
//                         url={dashboardData.download_url}
//                         label="Download Dashboard Report"
//                     />
//                 </Box>
//             )}
//         </>
//     );
// };

// const BucketOverviewDashboard = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();
//     const classes = OverAllCss();

//     // Filter States
//     const [filterMode, setFilterMode] = useState("monthRange"); // "monthRange" or "singleMonth" or "dateRange"
//     const [singleMonth, setSingleMonth] = useState("");
//     const [startMonth, setStartMonth] = useState("");
//     const [endMonth, setEndMonth] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [circle, setCircle] = useState("");
//     const [project, setProject] = useState("ALL");
//     const [band, setBand] = useState("");
//     const [errors, setErrors] = useState({});
//     const [dashboardResult, setDashboardResult] = useState(null);

//     const formattedStartMonth = formatMonthToMMMYY(startMonth);
//     const formattedEndMonth = formatMonthToMMMYY(endMonth);
//     const bothMonthsPicked = startMonth !== "" && endMonth !== "";
//     const isRangeOrderInvalid = bothMonthsPicked && !isChronologicalOrder(startMonth, endMonth);

//     const handleDashboardSubmit = async () => {
//         let isValid = true;
//         const newErrors = {};

//         // Validation based on filter mode
//         if (filterMode === "monthRange") {
//             if (!bothMonthsPicked) {
//                 newErrors.month = true;
//                 isValid = false;
//             }
//             if (bothMonthsPicked && isRangeOrderInvalid) {
//                 newErrors.range = true;
//                 isValid = false;
//             }
//         } else if (filterMode === "singleMonth") {
//             if (!singleMonth) {
//                 newErrors.singleMonth = true;
//                 isValid = false;
//             }
//         } else if (filterMode === "dateRange") {
//             if (!startDate || !endDate) {
//                 newErrors.date = true;
//                 isValid = false;
//             }
//         }

//         if (!isValid) {
//             setErrors(newErrors);
//             return;
//         }

//         action(true);
//         const formData = new FormData();

//         // Add filter data
//         if (filterMode === "monthRange") {
//             formData.append("start_month", formattedStartMonth);
//             formData.append("end_month", formattedEndMonth);
//         } else if (filterMode === "singleMonth") {
//             const formatted = formatMonthToMMMYY(singleMonth);
//             formData.append("month", formatted);
//         } else if (filterMode === "dateRange") {
//             formData.append("start_date", startDate);
//             formData.append("end_date", endDate);
//         }

//         if (circle) formData.append("circle", circle);
//         if (band) formData.append("band", band);
//         if (project) formData.append("project", project);

//         try {
//             const response = await postDataa("pending_performance_at_remarks/dashboard/", formData);
//             action(false);

//             console.log("🔍 Dashboard Response:", response);

//             if (response?.status) {
//                 setDashboardResult(response);
//                 Swal.fire({ icon: "success", title: "Done", text: "Dashboard data loaded successfully" });
//             } else {
//                 Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
//             }
//         } catch (error) {
//             action(false);
//             Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch dashboard data" });
//         }
//     };

//     const handleReset = () => {
//         setSingleMonth("");
//         setStartMonth("");
//         setEndMonth("");
//         setStartDate("");
//         setEndDate("");
//         setCircle("");
//         setProject("ALL");
//         setBand("");
//         setErrors({});
//         setDashboardResult(null);
//     };

//     const getFilterLabel = () => {
//         if (dashboardResult) {
//             if (filterMode === "monthRange") {
//                 return `${formattedStartMonth} to ${formattedEndMonth}`;
//             } else if (filterMode === "singleMonth") {
//                 return formatMonthToMMMYY(singleMonth);
//             } else if (filterMode === "dateRange") {
//                 return `${startDate} to ${endDate}`;
//             }
//         }
//         return null;
//     };

//     useEffect(() => {
//         document.title = "Bucket Overview Dashboard";
//     }, []);

//     return (
//         <>
//             <Box m={1} ml={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Typography color="text.primary">Bucket Overview Dashboard</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Slide direction="left" in timeout={1000}>
//                 <Box>

//                     {/* Filters Section */}
//                     <StyledCard title="Dashboard Filters" classes={classes}>
//                         <Stack spacing={2}>

//                             {/* Filter Mode Selection */}
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Select Filter Type:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <FormControl sx={{ minWidth: 200 }}>
//                                         <InputLabel>Filter Type</InputLabel>
//                                         <Select
//                                             label="Filter Type"
//                                             value={filterMode}
//                                             onChange={(e) => {
//                                                 setFilterMode(e.target.value);
//                                                 setErrors({});
//                                             }}
//                                         >
//                                             <MenuItem value="monthRange">Month Range</MenuItem>
//                                             <MenuItem value="singleMonth">Single Month</MenuItem>
//                                             <MenuItem value="dateRange">Date Range</MenuItem>
//                                         </Select>
//                                     </FormControl>
//                                 </div>
//                             </Box>

//                             {/* Month Range Filter */}
//                             {filterMode === "monthRange" && (
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Select Month Range:</div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
//                                             <TextField
//                                                 size="small"
//                                                 type="month"
//                                                 label="From"
//                                                 InputLabelProps={{ shrink: true }}
//                                                 value={startMonth}
//                                                 onChange={(e) => {
//                                                     setStartMonth(e.target.value);
//                                                     setErrors((p) => ({ ...p, month: false, range: false }));
//                                                 }}
//                                                 sx={{ minWidth: 170, bgcolor: "#fff" }}
//                                             />
//                                             <Typography sx={{ color: "text.secondary" }}>to</Typography>
//                                             <TextField
//                                                 size="small"
//                                                 type="month"
//                                                 label="To"
//                                                 InputLabelProps={{ shrink: true }}
//                                                 value={endMonth}
//                                                 inputProps={{ min: startMonth || undefined }}
//                                                 onChange={(e) => {
//                                                     setEndMonth(e.target.value);
//                                                     setErrors((p) => ({ ...p, month: false, range: false }));
//                                                 }}
//                                                 sx={{ minWidth: 170, bgcolor: "#fff" }}
//                                             />
//                                         </Stack>
//                                         {errors.month && (
//                                             <div><span style={{ color: "red", fontSize: 14, fontWeight: 600 }}>Please select both months!</span></div>
//                                         )}
//                                         {errors.range && (
//                                             <div><span style={{ color: "red", fontSize: 14, fontWeight: 600 }}>"From" must be before "To"!</span></div>
//                                         )}
//                                     </div>
//                                 </Box>
//                             )}

//                             {/* Single Month Filter */}
//                             {filterMode === "singleMonth" && (
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Select Month:</div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <TextField
//                                             size="small"
//                                             type="month"
//                                             label="Month"
//                                             InputLabelProps={{ shrink: true }}
//                                             value={singleMonth}
//                                             onChange={(e) => {
//                                                 setSingleMonth(e.target.value);
//                                                 setErrors((p) => ({ ...p, singleMonth: false }));
//                                             }}
//                                             sx={{ minWidth: 170, bgcolor: "#fff" }}
//                                         />
//                                         {errors.singleMonth && (
//                                             <div><span style={{ color: "red", fontSize: 14, fontWeight: 600 }}>Please select a month!</span></div>
//                                         )}
//                                     </div>
//                                 </Box>
//                             )}

//                             {/* Date Range Filter */}
//                             {filterMode === "dateRange" && (
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>Select Date Range:</div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
//                                             <TextField
//                                                 size="small"
//                                                 type="date"
//                                                 label="From"
//                                                 InputLabelProps={{ shrink: true }}
//                                                 value={startDate}
//                                                 onChange={(e) => {
//                                                     setStartDate(e.target.value);
//                                                     setErrors((p) => ({ ...p, date: false }));
//                                                 }}
//                                                 sx={{ minWidth: 170, bgcolor: "#fff" }}
//                                             />
//                                             <Typography sx={{ color: "text.secondary" }}>to</Typography>
//                                             <TextField
//                                                 size="small"
//                                                 type="date"
//                                                 label="To"
//                                                 InputLabelProps={{ shrink: true }}
//                                                 value={endDate}
//                                                 onChange={(e) => {
//                                                     setEndDate(e.target.value);
//                                                     setErrors((p) => ({ ...p, date: false }));
//                                                 }}
//                                                 sx={{ minWidth: 170, bgcolor: "#fff" }}
//                                             />
//                                         </Stack>
//                                         {errors.date && (
//                                             <div><span style={{ color: "red", fontSize: 14, fontWeight: 600 }}>Please select both dates!</span></div>
//                                         )}
//                                     </div>
//                                 </Box>
//                             )}

//                             {/* Circle Filter */}
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Select Circle:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <FormControl sx={{ minWidth: 200 }}>
//                                         <InputLabel id="circle-label">Select Circle</InputLabel>
//                                         <Select
//                                             labelId="circle-label"
//                                             label="Select Circle"
//                                             value={circle}
//                                             onChange={(e) => setCircle(e.target.value)}
//                                         >
//                                             <MenuItem value="">All Circles</MenuItem>
//                                             {circleArray.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
//                                         </Select>
//                                     </FormControl>
//                                 </div>
//                             </Box>

//                             {/* Band Filter */}
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Select Band:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <FormControl sx={{ minWidth: 200 }}>
//                                         <InputLabel id="band-label">Select Band</InputLabel>
//                                         <Select
//                                             labelId="band-label"
//                                             label="Select Band"
//                                             value={band}
//                                             onChange={(e) => setBand(e.target.value)}
//                                         >
//                                             <MenuItem value="">All Bands</MenuItem>
//                                             {bandArray.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
//                                         </Select>
//                                     </FormControl>
//                                 </div>
//                             </Box>

//                             {/* Project Filter */}
//                             <Box className={classes.Front_Box}>
//                                 <div className={classes.Front_Box_Hading}>Select Project:</div>
//                                 <div className={classes.Front_Box_Select_Button}>
//                                     <FormControl sx={{ minWidth: 200 }}>
//                                         <InputLabel id="project-label">Select Project</InputLabel>
//                                         <Select
//                                             labelId="project-label"
//                                             label="Select Project"
//                                             value={project}
//                                             onChange={(e) => setProject(e.target.value)}
//                                         >
//                                             {projectArray.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
//                                         </Select>
//                                     </FormControl>
//                                 </div>
//                             </Box>

//                         </Stack>

//                         {/* Action Buttons */}
//                         <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={3}>
//                             <Button
//                                 variant="contained"
//                                 color="success"
//                                 onClick={handleDashboardSubmit}
//                                 endIcon={<TrendingUpIcon />}
//                                 sx={{ fontWeight: 700 }}
//                             >
//                                 Generate Dashboard
//                             </Button>
//                             <Button
//                                 variant="contained"
//                                 onClick={handleReset}
//                                 sx={{ backgroundColor: "red", color: "white", fontWeight: 700 }}
//                             >
//                                 Reset
//                             </Button>
//                         </Stack>

//                         {/* Dashboard Display Inside Same Card */}
//                         {dashboardResult && (
//                             <>
//                                 <Divider sx={{ my: 3 }} />
//                                 <Dashboard
//                                     dashboardData={dashboardResult}
//                                     filters={{
//                                         circle: dashboardResult.circle_filter || circle,
//                                         band: dashboardResult.band_filter || band,
//                                         project: dashboardResult.project_filter || project,
//                                         monthRange: getFilterLabel(),
//                                     }}
//                                 />
//                             </>
//                         )}
//                     </StyledCard>

//                 </Box>
//             </Slide>

//             {loading}
//         </>
//     );
// };

// export default BucketOverviewDashboard;

import React, { useState, useEffect } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
    TextField, MenuItem, Select, InputLabel, FormControl, Divider,
    Card, CardContent, Paper, Alert, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, InputAdornment, Chip,
} from "@mui/material";
import {
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postDataa } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const circleArray = ['AP', 'DL', 'TNCH', 'NESA', 'RJ', 'JK', 'BR', 'MH', 'MP', 'MU', 'JRK', 'KK', 'UE', 'UW', 'HPHP', 'OR', 'WB/KOL'];
const bandArray = ['4G', '5G'];
const projectArray = ['Relocation', 'NT', 'Upgrade'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatMonthToMMMYY = (monthInputValue) => {
    if (!monthInputValue) return '';
    const [year, month] = monthInputValue.split('-');
    const idx = parseInt(month, 10) - 1;
    if (idx < 0 || idx > 11 || !year) return '';
    return `${MONTH_NAMES[idx]}-${year.slice(-2)}`;
};

const isChronologicalOrder = (startValue, endValue) => {
    if (!startValue || !endValue) return false;
    const [startYear, startMonth] = startValue.split('-').map((v) => parseInt(v, 10));
    const [endYear, endMonth] = endValue.split('-').map((v) => parseInt(v, 10));
    if (!startYear || !startMonth || !endYear || !endMonth) return false;
    const startIndex = startYear * 12 + (startMonth - 1);
    const endIndex = endYear * 12 + (endMonth - 1);
    return startIndex <= endIndex;
};

const StyledCard = ({ title, classes, children }) => (
    <Box className={classes.main_Box} sx={{ mb: 3 }}>
        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
            <Box className={classes.Box_Hading}>{title}</Box>
            <Box sx={{ mt: "-40px" }}>
                {children}
            </Box>
        </Box>
    </Box>
);

const DownloadButton = ({ url, label }) => {
    if (!url) return null;
    return (
        <a href={url} download target="_blank" rel="noreferrer">
            <Button
                variant="outlined"
                startIcon={<FileDownloadIcon sx={{ color: "green" }} />}
                sx={{ textTransform: "none", fontWeight: 700 }}
            >
                {label}
            </Button>
        </a>
    );
};

// ✅ Summary Table Component with Pagination
const SummaryTable = ({ data }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    if (!data || Object.keys(data).length === 0) {
        return null;
    }

    const dataEntries = Object.entries(data);
    const displayedRows = dataEntries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography sx={{
                fontWeight: 700,
                fontSize: "16px",
                color: "#333",
                mb: 2,
            }}>
                📊 Complete Summary Table
            </Typography>

            <TableContainer sx={{ border: "1px solid #E0E0E0", borderRadius: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ background: "#f5f5f5" }}>
                            <TableCell sx={{ fontWeight: 700, fontSize: "12px" }}>Bucket Name</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: "12px" }}>0-14 Days</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: "12px" }}>14-21 Days</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: "12px" }}>21-30 Days</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: "12px" }}>&gt;30 Days</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: "12px", background: "#006E7420" }}>Grand Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedRows.length > 0 ? (
                            displayedRows.map(([bucketName, bucketData], idx) => (
                                <TableRow
                                    key={bucketName}
                                    sx={{
                                        "&:nth-of-type(odd)": { background: "#fafafa" },
                                        background: bucketName === "Grand Total" ? "#006E7415" : "inherit",
                                        fontWeight: bucketName === "Grand Total" ? 700 : 400,
                                    }}
                                >
                                    <TableCell sx={{
                                        fontSize: "12px",
                                        fontWeight: bucketName === "Grand Total" ? 700 : 600,
                                        color: bucketName === "Grand Total" ? "#006E74" : "#333",
                                    }}>
                                        {bucketName}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: "12px", fontWeight: bucketName === "Grand Total" ? 700 : 500 }}>
                                        {bucketData["0-14"] || 0}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: "12px", fontWeight: bucketName === "Grand Total" ? 700 : 500 }}>
                                        {bucketData["14-21"] || 0}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: "12px", fontWeight: bucketName === "Grand Total" ? 700 : 500 }}>
                                        {bucketData["21-30"] || 0}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: "12px", fontWeight: bucketName === "Grand Total" ? 700 : 500 }}>
                                        {bucketData[">30"] || 0}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            fontSize: "12px",
                                            fontWeight: 700,
                                            color: bucketName === "Grand Total" ? "#006E74" : "#333",
                                            background: bucketName === "Grand Total" ? "#006E7430" : "transparent",
                                        }}
                                    >
                                        {bucketData["Grand Total"] || 0}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : null}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, p: 1.5, bgcolor: "#fafafa", borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: "#666", fontSize: "12px" }}>
                    Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, dataEntries.length)} of {dataEntries.length} rows
                </Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Typography variant="caption" sx={{ color: "#666", fontSize: "12px" }}>Rows per page:</Typography>
                    <Select
                        size="small"
                        value={rowsPerPage}
                        onChange={handleChangeRowsPerPage}
                        sx={{ minWidth: 70 }}
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 0}
                    >
                        Previous
                    </Button>
                    <Typography variant="caption" sx={{ color: "#666", fontSize: "12px", lineHeight: "2.5" }}>
                        Page {page + 1}
                    </Typography>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setPage(page + 1)}
                        disabled={(page + 1) * rowsPerPage >= dataEntries.length}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

// ✅ Chart Component
const BucketChart = ({ data }) => {
    if (!data || Object.keys(data).length === 0) {
        return null;
    }

    const chartData = Object.entries(data)
        .filter(([key]) => key !== "Grand Total")
        .map(([bucketName, bucketData]) => ({
            name: bucketName,
            "0-14": bucketData["0-14"] || 0,
            "14-21": bucketData["14-21"] || 0,
            "21-30": bucketData["21-30"] || 0,
            ">30": bucketData[">30"] || 0,
            total: bucketData["Grand Total"] || 0,
        }));

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Typography sx={{
                fontWeight: 700,
                fontSize: "16px",
                color: "#333",
                mb: 2,
            }}>
                📈 TAT Distribution by Bucket
            </Typography>

            <Card sx={{ p: 2, border: "1px solid #E0E0E0", borderRadius: 2 }}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <ChartTooltip cursor={{ fill: "#00000010" }} />
                        <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }} />
                        <Bar dataKey="0-14" stackId="a" fill="#4CAF50" name="0-14 Days" />
                        <Bar dataKey="14-21" stackId="a" fill="#FF9800" name="14-21 Days" />
                        <Bar dataKey="21-30" stackId="a" fill="#2196F3" name="21-30 Days" />
                        <Bar dataKey=">30" stackId="a" fill="#F44336" name=">30 Days" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </Box>
    );
};

// ✅ Dashboard Component
const Dashboard = ({ dashboardData, filters }) => {
    if (!dashboardData || !dashboardData.data) {
        return null;
    }

    const data = dashboardData.data;

    return (
        <>
            {/* Dashboard Title with Filters Info */}
            <Box sx={{ mb: 3, bgcolor: "#fff", p: 2, borderRadius: 1.5, border: "1px solid #E0E0E0" }}>
                <Typography sx={{
                    fontWeight: 800,
                    fontSize: "18px",
                    color: "#006E74",
                    mb: 2,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                }}>
                    📊 Bucket Overview Dashboard
                </Typography>

                {/* Filters Info */}
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                    {filters.circle && (
                        <Chip label={`Circle: ${filters.circle}`} color="primary" variant="outlined" size="small" />
                    )}
                    {filters.band && (
                        <Chip label={`Band: ${filters.band}`} color="primary" variant="outlined" size="small" />
                    )}
                    {filters.project && (
                        <Chip label={`Project: ${filters.project}`} color="primary" variant="outlined" size="small" />
                    )}
                    {filters.monthRange && (
                        <Chip label={filters.monthRange} color="primary" variant="outlined" size="small" />
                    )}
                </Box>
            </Box>

            {/* Chart */}
            <BucketChart data={data} />

            {/* Summary Table */}
            <SummaryTable data={data} />

            {/* Download Button */}
            {dashboardData.download_url && (
                <Box sx={{ mt: 4, mb: 3 }}>
                    <Typography sx={{
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "#333",
                        mb: 2,
                    }}>
                        💾 Download Report
                    </Typography>
                    <DownloadButton
                        url={dashboardData.download_url}
                        label="Download Dashboard Report"
                    />
                </Box>
            )}
        </>
    );
};

const BucketOverviewDashboard = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    // Filter States
    const [filterMode, setFilterMode] = useState("monthRange"); // "monthRange" or "singleMonth" or "dateRange"
    const [singleMonth, setSingleMonth] = useState("");
    const [startMonth, setStartMonth] = useState("");
    const [endMonth, setEndMonth] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [circle, setCircle] = useState("");
    const [project, setProject] = useState("");
    const [band, setBand] = useState("");
    const [errors, setErrors] = useState({});
    const [dashboardResult, setDashboardResult] = useState(null);

    const formattedStartMonth = formatMonthToMMMYY(startMonth);
    const formattedEndMonth = formatMonthToMMMYY(endMonth);
    const bothMonthsPicked = startMonth !== "" && endMonth !== "";
    const isRangeOrderInvalid = bothMonthsPicked && !isChronologicalOrder(startMonth, endMonth);

    const handleDashboardSubmit = async () => {
        let isValid = true;
        const newErrors = {};

        // Validation based on filter mode
        if (filterMode === "monthRange") {
            if (!bothMonthsPicked) {
                newErrors.month = true;
                isValid = false;
            }
            if (bothMonthsPicked && isRangeOrderInvalid) {
                newErrors.range = true;
                isValid = false;
            }
        } else if (filterMode === "singleMonth") {
            if (!singleMonth) {
                newErrors.singleMonth = true;
                isValid = false;
            }
        } else if (filterMode === "dateRange") {
            if (!startDate || !endDate) {
                newErrors.date = true;
                isValid = false;
            }
        }

        if (!isValid) {
            setErrors(newErrors);
            return;
        }

        action(true);
        const formData = new FormData();

        // Add filter data
        if (filterMode === "monthRange") {
            formData.append("start_month", formattedStartMonth);
            formData.append("end_month", formattedEndMonth);
        } else if (filterMode === "singleMonth") {
            const formatted = formatMonthToMMMYY(singleMonth);
            formData.append("month", formatted);
        } else if (filterMode === "dateRange") {
            formData.append("start_date", startDate);
            formData.append("end_date", endDate);
        }

        if (circle) formData.append("circle", circle);
        if (band) formData.append("band", band);
        if (project) formData.append("project", project);

        try {
            const response = await postDataa("pending_performance_at_remarks/dashboard/", formData);
            action(false);

            console.log("🔍 Dashboard Response:", response);

            if (response?.status) {
                setDashboardResult(response);
                Swal.fire({ icon: "success", title: "Done", text: "Dashboard data loaded successfully" });
            } else {
                Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Something went wrong" });
            }
        } catch (error) {
            action(false);
            Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch dashboard data" });
        }
    };

    const handleReset = () => {
        setSingleMonth("");
        setStartMonth("");
        setEndMonth("");
        setStartDate("");
        setEndDate("");
        setCircle("");
        setProject("");
        setBand("");
        setErrors({});
        setDashboardResult(null);
    };

    const getFilterLabel = () => {
        if (dashboardResult) {
            if (filterMode === "monthRange") {
                return `${formattedStartMonth} to ${formattedEndMonth}`;
            } else if (filterMode === "singleMonth") {
                return formatMonthToMMMYY(singleMonth);
            } else if (filterMode === "dateRange") {
                return `${startDate} to ${endDate}`;
            }
        }
        return null;
    };

    useEffect(() => {
        document.title = "Bucket Overview Dashboard";
    }, []);

    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Typography color="text.primary">Bucket Overview Dashboard</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>

                    {/* Filters Section */}
                    <StyledCard title="Dashboard Filters" classes={classes}>
                        <Stack spacing={2}>

                            {/* Filter Mode Selection */}
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Filter Type:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <InputLabel>Filter Type</InputLabel>
                                        <Select
                                            label="Filter Type"
                                            value={filterMode}
                                            onChange={(e) => {
                                                setFilterMode(e.target.value);
                                                setErrors({});
                                            }}
                                        >
                                            <MenuItem value="monthRange">Month Range</MenuItem>
                                            <MenuItem value="singleMonth">Single Month</MenuItem>
                                            <MenuItem value="dateRange">Date Range</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </Box>

                            {/* Month Range Filter */}
                            {filterMode === "monthRange" && (
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Select Month Range:</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
                                            <TextField
                                                size="small"
                                                type="month"
                                                label="From"
                                                InputLabelProps={{ shrink: true }}
                                                value={startMonth}
                                                onChange={(e) => {
                                                    setStartMonth(e.target.value);
                                                    setErrors((p) => ({ ...p, month: false, range: false }));
                                                }}
                                                sx={{ minWidth: 170, bgcolor: "#fff" }}
                                            />
                                            <Typography sx={{ color: "text.secondary" }}>to</Typography>
                                            <TextField
                                                size="small"
                                                type="month"
                                                label="To"
                                                InputLabelProps={{ shrink: true }}
                                                value={endMonth}
                                                inputProps={{ min: startMonth || undefined }}
                                                onChange={(e) => {
                                                    setEndMonth(e.target.value);
                                                    setErrors((p) => ({ ...p, month: false, range: false }));
                                                }}
                                                sx={{ minWidth: 170, bgcolor: "#fff" }}
                                            />
                                        </Stack>
                                        {errors.month && (
                                            <div><span style={{ color: "red", fontSize: 14, fontWeight: 600 }}>Please select both months!</span></div>
                                        )}
                                        {errors.range && (
                                            <div><span style={{ color: "red", fontSize: 14, fontWeight: 600 }}>"From" must be before "To"!</span></div>
                                        )}
                                    </div>
                                </Box>
                            )}

                            {/* Single Month Filter */}
                            {filterMode === "singleMonth" && (
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Select Month:</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <TextField
                                            size="small"
                                            type="month"
                                            label="Month"
                                            InputLabelProps={{ shrink: true }}
                                            value={singleMonth}
                                            onChange={(e) => {
                                                setSingleMonth(e.target.value);
                                                setErrors((p) => ({ ...p, singleMonth: false }));
                                            }}
                                            sx={{ minWidth: 170, bgcolor: "#fff" }}
                                        />
                                        {errors.singleMonth && (
                                            <div><span style={{ color: "red", fontSize: 14, fontWeight: 600 }}>Please select a month!</span></div>
                                        )}
                                    </div>
                                </Box>
                            )}

                            {/* Date Range Filter */}
                            {filterMode === "dateRange" && (
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Select Date Range:</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
                                            <TextField
                                                size="small"
                                                type="date"
                                                label="From"
                                                InputLabelProps={{ shrink: true }}
                                                value={startDate}
                                                onChange={(e) => {
                                                    setStartDate(e.target.value);
                                                    setErrors((p) => ({ ...p, date: false }));
                                                }}
                                                sx={{ minWidth: 170, bgcolor: "#fff" }}
                                            />
                                            <Typography sx={{ color: "text.secondary" }}>to</Typography>
                                            <TextField
                                                size="small"
                                                type="date"
                                                label="To"
                                                InputLabelProps={{ shrink: true }}
                                                value={endDate}
                                                onChange={(e) => {
                                                    setEndDate(e.target.value);
                                                    setErrors((p) => ({ ...p, date: false }));
                                                }}
                                                sx={{ minWidth: 170, bgcolor: "#fff" }}
                                            />
                                        </Stack>
                                        {errors.date && (
                                            <div><span style={{ color: "red", fontSize: 14, fontWeight: 600 }}>Please select both dates!</span></div>
                                        )}
                                    </div>
                                </Box>
                            )}

                            {/* Circle Filter */}
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Circle:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <InputLabel id="circle-label">Select Circle</InputLabel>
                                        <Select
                                            labelId="circle-label"
                                            label="Select Circle"
                                            value={circle}
                                            onChange={(e) => setCircle(e.target.value)}
                                        >
                                            <MenuItem value="">All Circles</MenuItem>
                                            {circleArray.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </div>
                            </Box>

                            {/* Band Filter */}
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Band:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <InputLabel id="band-label">Select Band</InputLabel>
                                        <Select
                                            labelId="band-label"
                                            label="Select Band"
                                            value={band}
                                            onChange={(e) => setBand(e.target.value)}
                                        >
                                            <MenuItem value="">All Bands</MenuItem>
                                            {bandArray.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </div>
                            </Box>

                            {/* Project Filter */}
                            <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>Select Project:</div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <InputLabel id="project-label">Select Project</InputLabel>
                                        <Select
                                            labelId="project-label"
                                            label="Select Project"
                                            value={project}
                                            onChange={(e) => setProject(e.target.value)}
                                        >
                                            {projectArray.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </div>
                            </Box>

                        </Stack>

                        {/* Action Buttons */}
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-around" mt={3}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleDashboardSubmit}
                                endIcon={<TrendingUpIcon />}
                                sx={{ fontWeight: 700 }}
                            >
                                Generate Dashboard
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleReset}
                                sx={{ backgroundColor: "red", color: "white", fontWeight: 700 }}
                            >
                                Reset
                            </Button>
                        </Stack>

                        {/* Dashboard Display Inside Same Card */}
                        {dashboardResult && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Dashboard
                                    dashboardData={dashboardResult}
                                    filters={{
                                        circle: dashboardResult.circle_filter || circle,
                                        band: dashboardResult.band_filter || band,
                                        project: dashboardResult.project_filter || project,
                                        monthRange: getFilterLabel(),
                                    }}
                                />
                            </>
                        )}
                    </StyledCard>

                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default BucketOverviewDashboard;