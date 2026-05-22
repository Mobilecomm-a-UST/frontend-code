// import { Breadcrumbs, Link, Typography } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import React, { useState, useEffect, useCallback } from 'react';
// import { Box, Grid, TextField } from "@mui/material";
// import Tooltip from '@mui/material/Tooltip';
// import IconButton from '@mui/material/IconButton';
// import DownloadIcon from '@mui/icons-material/Download';
// import TableContainer from '@mui/material/TableContainer';
// import Paper from '@mui/material/Paper';
// import Slide from '@mui/material/Slide';
// import { CsvBuilder } from 'filefy';
// import { useLoadingDialog } from '../../../../Hooks/LoadingDialog';
// import { useStyles } from '../../../ToolsCss'
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import ListItemText from '@mui/material/ListItemText';
// import Select from '@mui/material/Select';
// import Checkbox from '@mui/material/Checkbox';
// import { postData } from '../../../../services/FetchNodeServices';
// import 'rsuite/dist/rsuite.min.css';
// import * as ExcelJS from 'exceljs'
// import { useNavigate } from "react-router-dom";



// const MultiSelectWithAll = ({ label, options, selectedValues, setSelectedValues }) => {
//     const handleChange = (event) => {
//         const { value } = event.target;
//         const selected = typeof value === 'string' ? value.split(',') : value;

//         if (selected.includes('ALL')) {
//             if (selectedValues.length === options.length) {
//                 setSelectedValues([]);
//             } else {
//                 setSelectedValues(options);
//             }
//         } else {
//             setSelectedValues(selected);
//         }
//     };

//     const isAllSelected = options?.length > 0 && selectedValues?.length === options?.length;

//     return (
//         <FormControl sx={{ minWidth: 150, maxWidth: 200 }} size="small">
//             <InputLabel id={`${label}-label`}>{label}</InputLabel>
//             <Select
//                 labelId={`${label}-label`}
//                 multiple
//                 value={selectedValues}
//                 onChange={handleChange}
//                 input={<OutlinedInput label={label} />}
//                 renderValue={(selected) => selected.join(', ')}
//             >
//                 <MenuItem value="ALL">
//                     <Checkbox
//                         checked={isAllSelected}
//                         indeterminate={
//                             selectedValues.length > 0 && selectedValues.length < options.length
//                         }
//                     />
//                     <ListItemText primary="Select All" />
//                 </MenuItem>

//                 {options.map((name) => (
//                     <MenuItem key={name} value={name}>
//                         <Checkbox checked={selectedValues.includes(name)} />
//                         <ListItemText primary={name} />
//                     </MenuItem>
//                 ))}
//             </Select>
//         </FormControl>
//     );
// };

// const IssueTracker = () => {
//     const navigate = useNavigate()
//     const classes = useStyles()
//     const { loading, action } = useLoadingDialog();
//     const [milestonOption, setMilestonOption] = useState(["Allocation", "MO Punch", "RFAI Survey"])
//     const [milestoneSelect, setMilestoneSelect] = useState([])
//     const [ownerOption, setOwnerOption] = useState(["Airtel", "ToCo", "UST"])
//     const [ownerSelect, setOwnerSelect] = useState([])
//     const [issueDatas, setIssueDatas] = useState([])
//     const [status, setStatus] = useState('ALL')
//     const [d_start, setD_start] = useState('')
//     const [d_end, setD_end] = useState('')
//     const [siteOnair, setSiteOnair] = useState('ALL')
//     const IssueData = [
//         {
//             "Issue": "Delay in Allocation",
//             "AP": 33,
//             "ASM": 16,
//             "BIH": 4,
//             "DEL": 60,
//             "HRY": 4,
//             "JK": 3,
//             "JRK": 2,
//             "KK": 3,
//             "KOL": 2,
//             "MAH": 5,
//             "NE": 6,
//             "ORI": 6,
//             "PUN": 10,
//             "RAJ": 5,
//             "ROTN": 5,
//             "UPE": 12,
//             "UPW": 2,
//             "WB": 21,
//             "Total": 199
//         },
//         {
//             "Issue": "Total",
//             "AP": 33,
//             "ASM": 16,
//             "BIH": 4,
//             "DEL": 60,
//             "HRY": 4,
//             "JK": 3,
//             "JRK": 2,
//             "KK": 3,
//             "KOL": 2,
//             "MAH": 5,
//             "NE": 6,
//             "ORI": 6,
//             "PUN": 10,
//             "RAJ": 5,
//             "ROTN": 5,
//             "UPE": 12,
//             "UPW": 2,
//             "WB": 21,
//             "Total": 199
//         }
//     ]

//     const dynamicHeaders =
//         issueDatas.length > 0
//             ? Object.keys(IssueData[0]).filter(
//                 (key) => key !== "Issue" && key !== "Total"
//             )
//             : [];




//     const fetchDailyData = async () => {
//         action(true)
//         var formData = new FormData()
//         formData.append('status', status)
//         formData.append('milestone', milestoneSelect)
//         formData.append('owner', ownerSelect)
//         formData.append('duration_start', d_start)
//         formData.append('duration_end', d_end)
//         formData.append('site_on_air', siteOnair)
//         const res = await postData("nt_tracker/nt_issue_summary/", formData);
//         // const res =  tempData; //  remove this line when API is ready
//         // console.log(' rfai data', transformData(JSON.parse(res.json_data.table_summary)))
//         if (res) {
//             action(false)
//             console.log('issue tracker data ', res)
//             setIssueDatas(res.data)
//             // setIntegrationToOnairData(transformData(JSON.parse(res.json_data.table_summary)))
//             // if (currentStatusOption.length === 0 && site_taggingAgingOption.length === 0) {
//             //     setCurrentStatusOption(res.unique_data.unique_current_status)
//             //     setSite_taggingAgingOption(res.unique_data.unique_site_tagging)
//             // }
//         }
//         else {
//             action(false)
//         }
//     }
//     const handleStartDuration = (e) => {
//         e.preventDefault()

//         fetchDailyData()
//     }
//     const handleEndDuration = (e) => {
//         e.preventDefault()

//         fetchDailyData()
//     }

//     const handleExportExcel = async () => {
//         if (!issueDatas || issueDatas.length === 0) {
//             alert("No data to export");
//             return;
//         }

//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet("Issue Tracker");

//         // 🔥 Dynamic headers
//         const headers = Object.keys(issueDatas[0]);

//         // Add header row
//         worksheet.addRow(headers);

//         // Style header
//         worksheet.getRow(1).eachCell((cell) => {
//             cell.font = { bold: true };
//             cell.alignment = { vertical: "middle", horizontal: "center" };
//         });

//         // Add data rows
//         issueDatas.forEach((item) => {
//             const row = headers.map((key) => item[key] ?? 0);
//             worksheet.addRow(row);
//         });

//         // 🔥 Auto column width
//         worksheet.columns.forEach((column) => {
//             column.width = 15;
//         });

//         // Generate file
//         const buffer = await workbook.xlsx.writeBuffer();

//         const blob = new Blob([buffer], {
//             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         });

//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "Issue_Tracker.xlsx";
//         a.click();

//         window.URL.revokeObjectURL(url);
//     };

//     useEffect(() => {
//         fetchDailyData()
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

//     }, [status, milestoneSelect, ownerSelect,siteOnair])
//     return (
//         <>
//             <style>{"th{border:1px solid black;}"}</style>
//             <div style={{ margin: 5, marginLeft: 10 }}>
//                 <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
//                     <Link underline="hover" onClick={() => { navigate('/tools/ntd') }}>New Tower Deployment</Link>
//                     <Typography color='text.primary'>RFAI to MS1 Issue Tracker</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
//                 <div style={{ margin: 20 }}>

//                     {/* ************* 2G  TABLE DATA ************** */}
//                     <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', margin: '5px 5px' }}>
//                         <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
//                             Issue Tracking Dashboard
//                         </Box>
//                         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
//                             {/* <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
//                                 <TextField
//                                     variant="outlined"
//                                     // required
//                                     fullWidth
//                                     label="Month"
//                                     name="month"
//                                     value={month}
//                                     onChange={handleMonthChange}
//                                     size="small"
//                                     type="month"
//                                     InputLabelProps={{ shrink: true }}
//                                 />
//                             </FormControl> */}
//                             {/* <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
//                                 <InputLabel id="demo-simple-select-label">milestone1</InputLabel>
//                                 <Select
//                                     labelId="demo-simple-select-label"
//                                     id="demo-simple-select"
//                                     value={milestone1}
//                                     label="milestone1"
//                                     onChange={handleMilestone1Change}
//                                 >
//                                     {milestoneOptions?.map((item, index) => (
//                                         <MenuItem key={index} value={item}>{item}</MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl> */}
//                             <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
//                                 <InputLabel id="demo-simple-select-label">Status</InputLabel>
//                                 <Select
//                                     labelId="demo-simple-select-label"
//                                     id="demo-simple-select"
//                                     value={status}
//                                     label="Status"
//                                     onChange={(e) => setStatus(e.target.value)}
//                                 >

//                                     <MenuItem value='ALL'>ALL</MenuItem>
//                                     <MenuItem value='Open'>OPEN</MenuItem>
//                                     <MenuItem value='Closed'>CLOSE</MenuItem>

//                                 </Select>
//                             </FormControl>

//                             <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
//                                 <InputLabel id="demo-simple-select-label">Site OnAir</InputLabel>
//                                 <Select
//                                     labelId="demo-simple-select-label"
//                                     id="demo-simple-select"
//                                     value={siteOnair}
//                                     label="Site OnAir"
//                                     onChange={(e) => setSiteOnair(e.target.value)}
//                                 >

//                                     <MenuItem value='ALL'>Both</MenuItem>
//                                     <MenuItem value='Yes'>Yes</MenuItem>
//                                     <MenuItem value='No'>No</MenuItem>

//                                 </Select>
//                             </FormControl>
//                             <MultiSelectWithAll
//                                 label="Milestone"
//                                 options={milestonOption}
//                                 selectedValues={milestoneSelect}
//                                 setSelectedValues={setMilestoneSelect}
//                             />


//                             <MultiSelectWithAll
//                                 label="Owner"
//                                 options={ownerOption}
//                                 selectedValues={ownerSelect}
//                                 setSelectedValues={setOwnerSelect}
//                             />
//                             <form onSubmit={handleStartDuration}>
//                                 <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
//                                     <TextField
//                                         variant="outlined"
//                                         // required
//                                         fullWidth
//                                         label="Duration Start"
//                                         value={d_start}
//                                         onChange={(e) => setD_start(e.target.value)}
//                                         size="small"
//                                         type="number"
//                                         InputLabelProps={{ shrink: true }}
//                                     />
//                                 </FormControl>
//                             </form>

//                             <form onSubmit={handleEndDuration}>
//                                 <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
//                                     <TextField
//                                         variant="outlined"
//                                         // required
//                                         fullWidth
//                                         label="Duration End"
//                                         value={d_end}
//                                         onChange={(e) => setD_end(e.target.value)}
//                                         size="small"
//                                         type="number"
//                                         InputLabelProps={{ shrink: true }}
//                                     />
//                                 </FormControl>
//                             </form>

//                             <Tooltip title="Download Excel">
//                                 <IconButton onClick={handleExportExcel}>
//                                     <DownloadIcon fontSize="large" color="primary" />
//                                 </IconButton>
//                             </Tooltip>
//                         </Box>
//                     </Box>

//                     <Box sx={{ display: "flex", justifyContent: "center" }}>
//                         <TableContainer
//                             component={Paper}
//                             sx={{
//                                 maxHeight: 600,
//                                 boxShadow: "rgba(0,0,0,0.2) 0px 3px 8px"
//                             }}
//                         >
//                             <table
//                                 style={{
//                                     width: "100%",
//                                     borderCollapse: "collapse"
//                                 }}
//                             >
//                                 {/* 🔥 HEADER */}
//                                 <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>

//                                     {/* Top Header */}
//                                     <tr style={{ backgroundColor: "#223354", color: "white" }}>
//                                         <th
//                                             rowSpan={2}
//                                             style={{
//                                                 position: "sticky",
//                                                 left: 0,
//                                                 zIndex: 2,
//                                                 backgroundColor: "#006e74",
//                                                 fontSize: 18
//                                             }}
//                                         >
//                                             Issues
//                                         </th>
//                                         <th colSpan={dynamicHeaders.length + 1} style={{ fontSize: 18 }}>
//                                             Circles
//                                         </th>
//                                     </tr>

//                                     {/* Sub Header */}
//                                     <tr style={{ backgroundColor: "#CBCBCB" }}>
//                                         {dynamicHeaders.map((col) => (
//                                             <th key={col}>{col}</th>
//                                         ))}
//                                         <th>Total</th>
//                                     </tr>
//                                 </thead>

//                                 {/* 🔥 BODY */}
//                                 <tbody>
//                                     {issueDatas.map((row, index) => (
//                                         <tr key={index} className={classes.hoverRT} style={{ textAlign: "center" }}>

//                                             {/* Issue */}
//                                             <th
//                                                 style={{
//                                                     position: "sticky",
//                                                     left: 0,
//                                                     backgroundColor: "#CBCBCB",
//                                                     fontWeight: "bold"
//                                                 }}
//                                             >
//                                                 {row.Issue}
//                                             </th>

//                                             {/* Dynamic Columns */}
//                                             {dynamicHeaders.map((col) => (
//                                                 <th key={col}>{row[col] ?? 0}</th>
//                                             ))}

//                                             {/* Total */}
//                                             <th>{row.Total}</th>
//                                         </tr>
//                                     ))}
//                                 </tbody>

//                             </table>
//                         </TableContainer>
//                     </Box>

//                 </div>
//             </Slide>
//             {loading}


//         </>

//     )
// }

// export default IssueTracker




// import { Breadcrumbs, Link, Typography } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import React, { useState, useEffect } from 'react';
// import { Box, TextField } from "@mui/material";
// import Tooltip from '@mui/material/Tooltip';
// import IconButton from '@mui/material/IconButton';
// import DownloadIcon from '@mui/icons-material/Download';
// import UploadFileIcon from '@mui/icons-material/UploadFile';
// import TableContainer from '@mui/material/TableContainer';
// import Paper from '@mui/material/Paper';
// import Slide from '@mui/material/Slide';
// import { useLoadingDialog } from '../../../../Hooks/LoadingDialog';
// import { useStyles } from '../../../ToolsCss'
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import ListItemText from '@mui/material/ListItemText';
// import Select from '@mui/material/Select';
// import Checkbox from '@mui/material/Checkbox';
// import { postData } from '../../../../services/FetchNodeServices';
// import 'rsuite/dist/rsuite.min.css';
// import * as ExcelJS from 'exceljs'
// import { useNavigate } from "react-router-dom";

// const MultiSelectWithAll = ({ label, options, selectedValues, setSelectedValues }) => {
//     const handleChange = (event) => {
//         const { value } = event.target;
//         const selected = typeof value === 'string' ? value.split(',') : value;

//         if (selected.includes('ALL')) {
//             if (selectedValues.length === options.length) {
//                 setSelectedValues([]);
//             } else {
//                 setSelectedValues(options);
//             }
//         } else {
//             setSelectedValues(selected);
//         }
//     };

//     const isAllSelected = options?.length > 0 && selectedValues?.length === options?.length;

//     return (
//         <FormControl sx={{ minWidth: 150, maxWidth: 200 }} size="small">
//             <InputLabel id={`${label}-label`}>{label}</InputLabel>
//             <Select
//                 labelId={`${label}-label`}
//                 multiple
//                 value={selectedValues}
//                 onChange={handleChange}
//                 input={<OutlinedInput label={label} />}
//                 renderValue={(selected) => selected.join(', ')}
//             >
//                 <MenuItem value="ALL">
//                     <Checkbox
//                         checked={isAllSelected}
//                         indeterminate={
//                             selectedValues.length > 0 && selectedValues.length < options.length
//                         }
//                     />
//                     <ListItemText primary="Select All" />
//                 </MenuItem>

//                 {options.map((name) => (
//                     <MenuItem key={name} value={name}>
//                         <Checkbox checked={selectedValues.includes(name)} />
//                         <ListItemText primary={name} />
//                     </MenuItem>
//                 ))}
//             </Select>
//         </FormControl>
//     );
// };

// const IssueTracker = () => {
//     const navigate = useNavigate()
//     const classes = useStyles()
//     const { loading, action } = useLoadingDialog();

//     const [milestonOption, setMilestonOption] = useState(["Allocation", "MO Punch", "RFAI Survey"])
//     const [milestoneSelect, setMilestoneSelect] = useState([])
//     const [ownerOption, setOwnerOption] = useState(["Airtel", "ToCo", "UST"])
//     const [ownerSelect, setOwnerSelect] = useState([])
//     const [issueDatas, setIssueDatas] = useState([])
//     const [status, setStatus] = useState('ALL')
//     const [d_start, setD_start] = useState('')
//     const [d_end, setD_end] = useState('')
//     const [siteOnair, setSiteOnair] = useState('ALL')

//     const dynamicHeaders =
//         issueDatas.length > 0
//             ? Object.keys(issueDatas[0]).filter(
//                 (key) => key !== "Issue" && key !== "Total"
//             )
//             : [];

//     const fetchDailyData = async () => {
//         action(true)

//         var formData = new FormData()
//         formData.append('status', status)
//         formData.append('milestone', milestoneSelect)
//         formData.append('owner', ownerSelect)
//         formData.append('duration_start', d_start)
//         formData.append('duration_end', d_end)
//         formData.append('site_on_air', siteOnair)

//         const res = await postData("nt_tracker/nt_issue_summary/", formData);

//         if (res) {
//             action(false)
//             console.log('issue tracker data ', res)
//             setIssueDatas(res.data)
//         }
//         else {
//             action(false)
//         }
//     }

//     const handleStartDuration = (e) => {
//         e.preventDefault()
//         fetchDailyData()
//     }

//     const handleEndDuration = (e) => {
//         e.preventDefault()
//         fetchDailyData()
//     }

//     // 🔥 Upload File Handler
//     const handleFileUpload = async (event) => {
//         const file = event.target.files[0];

//         if (!file) return;

//         console.log("Selected File:", file);

//         // Example API Upload
//         const formData = new FormData();
//         formData.append("file", file);

//         try {
//             action(true)

//             // Replace with your upload API
//             const response = await postData("nt_tracker/upload_issue_file/", formData);

//             console.log("Upload Response:", response);

//             action(false)

//             // Refresh table after upload
//             fetchDailyData();

//         } catch (error) {
//             action(false)
//             console.log("Upload Error:", error);
//         }
//     };

//     const handleExportExcel = async () => {
//         if (!issueDatas || issueDatas.length === 0) {
//             alert("No data to export");
//             return;
//         }

//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet("Issue Tracker");

//         const headers = Object.keys(issueDatas[0]);

//         worksheet.addRow(headers);

//         worksheet.getRow(1).eachCell((cell) => {
//             cell.font = { bold: true };
//             cell.alignment = { vertical: "middle", horizontal: "center" };
//         });

//         issueDatas.forEach((item) => {
//             const row = headers.map((key) => item[key] ?? 0);
//             worksheet.addRow(row);
//         });

//         worksheet.columns.forEach((column) => {
//             column.width = 15;
//         });

//         const buffer = await workbook.xlsx.writeBuffer();

//         const blob = new Blob([buffer], {
//             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         });

//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "Issue_Tracker.xlsx";
//         a.click();

//         window.URL.revokeObjectURL(url);
//     };

//     useEffect(() => {
//         fetchDailyData()

//         document.title = `${window.location.pathname
//             .slice(1)
//             .replaceAll('_', ' ')
//             .replaceAll('/', ' | ')
//             .toUpperCase()}`

//     }, [status, milestoneSelect, ownerSelect, siteOnair])

//     return (
//         <>
//             <style>{"th{border:1px solid black;}"}</style>

//             <div style={{ margin: 5, marginLeft: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     itemsBeforeCollapse={2}
//                     maxItems={3}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => { navigate('/tools') }}>
//                         Tools
//                     </Link>

//                     <Link underline="hover" onClick={() => { navigate('/tools/ntd') }}>
//                         New Tower Deployment
//                     </Link>

//                     <Typography color='text.primary'>
//                         RFAI to MS1 Issue Tracker
//                     </Typography>
//                 </Breadcrumbs>
//             </div>

//             <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
//                 <div style={{ margin: 20 }}>

//                     <Box
//                         style={{
//                             display: 'flex',
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                             alignContent: 'center',
//                             margin: '5px 5px'
//                         }}
//                     >

//                         <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
//                             Issue Tracking Dashboard
//                         </Box>

//                         <Box
//                             sx={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 flexWrap: 'wrap',
//                                 gap: 1
//                             }}
//                         >

//                             <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
//                                 <InputLabel id="demo-simple-select-label">Status</InputLabel>

//                                 <Select
//                                     labelId="demo-simple-select-label"
//                                     id="demo-simple-select"
//                                     value={status}
//                                     label="Status"
//                                     onChange={(e) => setStatus(e.target.value)}
//                                 >
//                                     <MenuItem value='ALL'>ALL</MenuItem>
//                                     <MenuItem value='Open'>OPEN</MenuItem>
//                                     <MenuItem value='Closed'>CLOSE</MenuItem>
//                                 </Select>
//                             </FormControl>

//                             <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
//                                 <InputLabel id="demo-simple-select-label">Site OnAir</InputLabel>

//                                 <Select
//                                     labelId="demo-simple-select-label"
//                                     id="demo-simple-select"
//                                     value={siteOnair}
//                                     label="Site OnAir"
//                                     onChange={(e) => setSiteOnair(e.target.value)}
//                                 >
//                                     <MenuItem value='ALL'>Both</MenuItem>
//                                     <MenuItem value='Yes'>Yes</MenuItem>
//                                     <MenuItem value='No'>No</MenuItem>
//                                 </Select>
//                             </FormControl>

//                             <MultiSelectWithAll
//                                 label="Milestone"
//                                 options={milestonOption}
//                                 selectedValues={milestoneSelect}
//                                 setSelectedValues={setMilestoneSelect}
//                             />

//                             <MultiSelectWithAll
//                                 label="Owner"
//                                 options={ownerOption}
//                                 selectedValues={ownerSelect}
//                                 setSelectedValues={setOwnerSelect}
//                             />

//                             <form onSubmit={handleStartDuration}>
//                                 <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
//                                     <TextField
//                                         variant="outlined"
//                                         fullWidth
//                                         label="Duration Start"
//                                         value={d_start}
//                                         onChange={(e) => setD_start(e.target.value)}
//                                         size="small"
//                                         type="number"
//                                         InputLabelProps={{ shrink: true }}
//                                     />
//                                 </FormControl>
//                             </form>

//                             <form onSubmit={handleEndDuration}>
//                                 <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
//                                     <TextField
//                                         variant="outlined"
//                                         fullWidth
//                                         label="Duration End"
//                                         value={d_end}
//                                         onChange={(e) => setD_end(e.target.value)}
//                                         size="small"
//                                         type="number"
//                                         InputLabelProps={{ shrink: true }}
//                                     />
//                                 </FormControl>
//                             </form>

//                             {/* 🔥 Download Icon */}
//                             <Tooltip title="Download Excel">
//                                 <IconButton onClick={handleExportExcel}>
//                                     <DownloadIcon fontSize="large" color="primary" />
//                                 </IconButton>
//                             </Tooltip>

//                             {/* 🔥 Upload Icon */}
//                             <Tooltip title="Upload File">
//                                 <IconButton component="label">
//                                     <UploadFileIcon fontSize="large" color="success" />

//                                     <input
//                                         type="file"
//                                         hidden
//                                         onChange={handleFileUpload}
//                                     />
//                                 </IconButton>
//                             </Tooltip>

//                         </Box>
//                     </Box>

//                     <Box sx={{ display: "flex", justifyContent: "center" }}>
//                         <TableContainer
//                             component={Paper}
//                             sx={{
//                                 maxHeight: 600,
//                                 boxShadow: "rgba(0,0,0,0.2) 0px 3px 8px"
//                             }}
//                         >
//                             <table
//                                 style={{
//                                     width: "100%",
//                                     borderCollapse: "collapse"
//                                 }}
//                             >

//                                 <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>

//                                     <tr style={{ backgroundColor: "#223354", color: "white" }}>
//                                         <th
//                                             rowSpan={2}
//                                             style={{
//                                                 position: "sticky",
//                                                 left: 0,
//                                                 zIndex: 2,
//                                                 backgroundColor: "#006e74",
//                                                 fontSize: 18
//                                             }}
//                                         >
//                                             Issues
//                                         </th>

//                                         <th colSpan={dynamicHeaders.length + 1} style={{ fontSize: 18 }}>
//                                             Circles
//                                         </th>
//                                     </tr>

//                                     <tr style={{ backgroundColor: "#CBCBCB" }}>
//                                         {dynamicHeaders.map((col) => (
//                                             <th key={col}>{col}</th>
//                                         ))}

//                                         <th>Total</th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {issueDatas.map((row, index) => (
//                                         <tr
//                                             key={index}
//                                             className={classes.hoverRT}
//                                             style={{ textAlign: "center" }}
//                                         >
//                                             <th
//                                                 style={{
//                                                     position: "sticky",
//                                                     left: 0,
//                                                     backgroundColor: "#CBCBCB",
//                                                     fontWeight: "bold"
//                                                 }}
//                                             >
//                                                 {row.Issue}
//                                             </th>

//                                             {dynamicHeaders.map((col) => (
//                                                 <th key={col}>{row[col] ?? 0}</th>
//                                             ))}

//                                             <th>{row.Total}</th>
//                                         </tr>
//                                     ))}
//                                 </tbody>

//                             </table>
//                         </TableContainer>
//                     </Box>

//                 </div>
//             </Slide>

//             {loading}
//         </>
//     )
// }

// export default IssueTracker


import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React, { useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BlockIcon from "@mui/icons-material/Block";

import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import Swal from "sweetalert2";

import { useLoadingDialog } from "../../../../Hooks/LoadingDialog";
import { useStyles } from "../../../ToolsCss";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import { postData } from "../../../../services/FetchNodeServices";

import "rsuite/dist/rsuite.min.css";

import * as ExcelJS from "exceljs";

import { useNavigate } from "react-router-dom";

const MultiSelectWithAll = ({
    label,
    options,
    selectedValues,
    setSelectedValues,
}) => {
    const handleChange = (event) => {
        const { value } = event.target;
        const selected =
            typeof value === "string" ? value.split(",") : value;

        if (selected.includes("ALL")) {
            if (selectedValues.length === options.length) {
                setSelectedValues([]);
            } else {
                setSelectedValues(options);
            }
        } else {
            setSelectedValues(selected);
        }
    };

    const isAllSelected =
        options?.length > 0 &&
        selectedValues?.length === options?.length;

    return (
        <FormControl sx={{ minWidth: 150, maxWidth: 200 }} size="small">
            <InputLabel id={`${label}-label`}>{label}</InputLabel>

            <Select
                labelId={`${label}-label`}
                multiple
                value={selectedValues}
                onChange={handleChange}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => selected.join(", ")}
            >
                <MenuItem value="ALL">
                    <Checkbox
                        checked={isAllSelected}
                        indeterminate={
                            selectedValues.length > 0 &&
                            selectedValues.length < options.length
                        }
                    />

                    <ListItemText primary="Select All" />
                </MenuItem>

                {options.map((name) => (
                    <MenuItem key={name} value={name}>
                        <Checkbox
                            checked={selectedValues.includes(name)}
                        />

                        <ListItemText primary={name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const IssueTracker = () => {
    const navigate = useNavigate();

    const classes = useStyles();

    const { loading, action } = useLoadingDialog();

    const [milestonOption] = useState([
        "Allocation",
        "MO Punch",
        "RFAI Survey",
    ]);

    const [milestoneSelect, setMilestoneSelect] = useState([]);

    const [ownerOption] = useState([
        "Airtel",
        "ToCo",
        "UST",
    ]);

    const [ownerSelect, setOwnerSelect] = useState([]);

    const [issueDatas, setIssueDatas] = useState([]);

    const [status, setStatus] = useState("ALL");

    const [d_start, setD_start] = useState("");

    const [d_end, setD_end] = useState("");

    const [siteOnair, setSiteOnair] = useState("ALL");

    // 🔥 Upload States
    const [openUploadDialog, setOpenUploadDialog] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);

    const dynamicHeaders =
        issueDatas.length > 0
            ? Object.keys(issueDatas[0]).filter(
                (key) =>
                    key !== "Issue" && key !== "Total"
            )
            : [];

    const fetchDailyData = async () => {
        action(true);

        var formData = new FormData();

        formData.append("status", status);
        formData.append("milestone", milestoneSelect);
        formData.append("owner", ownerSelect);
        formData.append("duration_start", d_start);
        formData.append("duration_end", d_end);
        formData.append("site_on_air", siteOnair);

        const res = await postData(
            "nt_tracker/nt_issue_summary/",
            formData
        );

        if (res) {
            action(false);

            setIssueDatas(res.data);
        } else {
            action(false);
        }
    };

    // 🔥 File Select Handler
    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const allowedExtensions = [
            "xlsx",
            "xls",
            "csv",
        ];

        const fileExtension =
            file.name.split(".").pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            Swal.fire({
                icon: "error",
                title: "Invalid File",
                text: "Only Excel and CSV files are allowed",
            });

            return;
        }

        setSelectedFile(file);
    };

    // 🔥 Upload File API
    const handleUploadFile = async () => {

        if (!selectedFile) {

            Swal.fire({
                icon: "warning",
                title: "No File Selected",
                text: "Please select Excel/CSV file first",
                target: document.body,
                backdrop: true,
                allowOutsideClick: false,
                customClass: {
                    container: "swal-container-front",
                    popup: "swal-popup-front",
                },
            });

            return;
        }

        try {

            action(true);

            const formData = new FormData();

            formData.append("file", selectedFile);

            const response = await postData(
                "nt_tracker/upload_nt_issue/",
                formData
            );

            action(false);

            // 🔥 SUCCESS
            if (response?.status === true || response?.success === true) {

                // close dialog first
                setOpenUploadDialog(false);

                setTimeout(() => {

                    Swal.fire({
                        icon: "success",
                        title: "Upload Successful",
                        text: response?.message || "File uploaded successfully",
                        target: document.body,
                        backdrop: true,
                        allowOutsideClick: false,
                        customClass: {
                            container: "swal-container-front",
                            popup: "swal-popup-front",
                        },
                    });

                }, 300);

                setSelectedFile(null);

                fetchDailyData();

            }

            // 🔥 API ERROR
            else {

                Swal.fire({
                    icon: "error",
                    title: "Upload Failed",
                    text:
                        response?.message ||
                        "Something went wrong while uploading file",
                    target: document.body,
                    backdrop: true,
                    allowOutsideClick: false,
                    customClass: {
                        container: "swal-container-front",
                        popup: "swal-popup-front",
                    },
                });
            }

        }

        // 🔥 CATCH ERROR
        catch (error) {

            action(false);

            Swal.fire({
                icon: "error",
                title: "Server Error",
                text:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong",
                target: document.body,
                backdrop: true,
                allowOutsideClick: false,
                customClass: {
                    container: "swal-container-front",
                    popup: "swal-popup-front",
                },
            });
        }
    };

    // 🔥 Clear File
    const handleClearFile = () => {
        setSelectedFile(null);
    };

    const handleExportExcel = async () => {
        if (!issueDatas || issueDatas.length === 0) {
            alert("No data to export");

            return;
        }

        const workbook = new ExcelJS.Workbook();

        const worksheet =
            workbook.addWorksheet("Issue Tracker");

        const headers = Object.keys(issueDatas[0]);

        worksheet.addRow(headers);

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };

            cell.alignment = {
                vertical: "middle",
                horizontal: "center",
            };
        });

        issueDatas.forEach((item) => {
            const row = headers.map(
                (key) => item[key] ?? 0
            );

            worksheet.addRow(row);
        });

        worksheet.columns.forEach((column) => {
            column.width = 15;
        });

        const buffer =
            await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url =
            window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "Issue_Tracker.xlsx";

        a.click();

        window.URL.revokeObjectURL(url);
    };

    useEffect(() => {
        fetchDailyData();

        document.title = `${window.location.pathname
            .slice(1)
            .replaceAll("_", " ")
            .replaceAll("/", " | ")
            .toUpperCase()}`;
    }, [
        status,
        milestoneSelect,
        ownerSelect,
        siteOnair,
    ]);

    return (
        <>
            <style>
                {"th{border:1px solid black;}"}
            </style>

            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    itemsBeforeCollapse={2}
                    maxItems={3}
                    separator={
                        <KeyboardArrowRightIcon fontSize="small" />
                    }
                >
                    <Link
                        underline="hover"
                        onClick={() => {
                            navigate("/tools");
                        }}
                    >
                        Tools
                    </Link>

                    <Link
                        underline="hover"
                        onClick={() => {
                            navigate("/tools/ntd");
                        }}
                    >
                        New Tower Deployment
                    </Link>

                    <Typography color="text.primary">
                        RFAI to MS1 Issue Tracker
                    </Typography>
                </Breadcrumbs>
            </div>

            <Slide
                direction="left"
                in={true}
                timeout={700}
                style={{ transformOrigin: "1 1 1" }}
            >
                <div style={{ margin: 20 }}>
                    <Box
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            alignContent: "center",
                            margin: "5px 5px",
                        }}
                    >
                        <Box
                            style={{
                                fontSize: 22,
                                fontWeight: "bold",
                            }}
                        >
                            Issue Tracking Dashboard
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                gap: 1,
                            }}
                        >
                            <FormControl
                                sx={{
                                    minWidth: 100,
                                    maxWidth: 100,
                                }}
                                size="small"
                            >
                                <InputLabel>
                                    Status
                                </InputLabel>

                                <Select
                                    value={status}
                                    label="Status"
                                    onChange={(e) =>
                                        setStatus(
                                            e.target.value
                                        )
                                    }
                                >
                                    <MenuItem value="ALL">
                                        ALL
                                    </MenuItem>

                                    <MenuItem value="Open">
                                        OPEN
                                    </MenuItem>

                                    <MenuItem value="Closed">
                                        CLOSE
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl
                                sx={{
                                    minWidth: 100,
                                    maxWidth: 100,
                                }}
                                size="small"
                            >
                                <InputLabel>
                                    Site OnAir
                                </InputLabel>

                                <Select
                                    value={siteOnair}
                                    label="Site OnAir"
                                    onChange={(e) =>
                                        setSiteOnair(
                                            e.target.value
                                        )
                                    }
                                >
                                    <MenuItem value="ALL">
                                        Both
                                    </MenuItem>

                                    <MenuItem value="Yes">
                                        Yes
                                    </MenuItem>

                                    <MenuItem value="No">
                                        No
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <MultiSelectWithAll
                                label="Milestone"
                                options={milestonOption}
                                selectedValues={
                                    milestoneSelect
                                }
                                setSelectedValues={
                                    setMilestoneSelect
                                }
                            />

                            <MultiSelectWithAll
                                label="Owner"
                                options={ownerOption}
                                selectedValues={ownerSelect}
                                setSelectedValues={
                                    setOwnerSelect
                                }
                            />

                            <FormControl
                                sx={{
                                    minWidth: 100,
                                    maxWidth: 100,
                                }}
                                size="small"
                            >
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    label="Duration Start"
                                    value={d_start}
                                    onChange={(e) =>
                                        setD_start(
                                            e.target.value
                                        )
                                    }
                                    size="small"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>

                            <FormControl
                                sx={{
                                    minWidth: 100,
                                    maxWidth: 100,
                                }}
                                size="small"
                            >
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    label="Duration End"
                                    value={d_end}
                                    onChange={(e) =>
                                        setD_end(
                                            e.target.value
                                        )
                                    }
                                    size="small"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>

                            {/* 🔥 Download */}
                            <Tooltip title="Download Excel">
                                <IconButton
                                    onClick={
                                        handleExportExcel
                                    }
                                >
                                    <DownloadIcon
                                        fontSize="large"
                                        color="primary"
                                    />
                                </IconButton>
                            </Tooltip>

                            {/* 🔥 Upload */}
                            <Tooltip title="Upload File">
                                <IconButton
                                    onClick={() =>
                                        setOpenUploadDialog(
                                            true
                                        )
                                    }
                                >
                                    <UploadFileIcon
                                        fontSize="large"
                                        color="success"
                                    />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* 🔥 TABLE */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <TableContainer
                            component={Paper}
                            sx={{
                                maxHeight: 600,
                                boxShadow:
                                    "rgba(0,0,0,0.2) 0px 3px 8px",
                            }}
                        >
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse:
                                        "collapse",
                                }}
                            >
                                <thead
                                    style={{
                                        position:
                                            "sticky",
                                        top: 0,
                                        zIndex: 1,
                                    }}
                                >
                                    <tr
                                        style={{
                                            backgroundColor:
                                                "#223354",
                                            color: "white",
                                        }}
                                    >
                                        <th
                                            rowSpan={2}
                                            style={{
                                                position:
                                                    "sticky",
                                                left: 0,
                                                zIndex: 2,
                                                backgroundColor:
                                                    "#006e74",
                                                fontSize: 18,
                                            }}
                                        >
                                            Issues
                                        </th>

                                        <th
                                            colSpan={
                                                dynamicHeaders.length +
                                                1
                                            }
                                            style={{
                                                fontSize: 18,
                                            }}
                                        >
                                            Circles
                                        </th>
                                    </tr>

                                    <tr
                                        style={{
                                            backgroundColor:
                                                "#CBCBCB",
                                        }}
                                    >
                                        {dynamicHeaders.map(
                                            (col) => (
                                                <th
                                                    key={
                                                        col
                                                    }
                                                >
                                                    {col}
                                                </th>
                                            )
                                        )}

                                        <th>Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {issueDatas.map(
                                        (
                                            row,
                                            index
                                        ) => (
                                            <tr
                                                key={
                                                    index
                                                }
                                                className={
                                                    classes.hoverRT
                                                }
                                                style={{
                                                    textAlign:
                                                        "center",
                                                }}
                                            >
                                                <th
                                                    style={{
                                                        position:
                                                            "sticky",
                                                        left: 0,
                                                        backgroundColor:
                                                            "#CBCBCB",
                                                        fontWeight:
                                                            "bold",
                                                    }}
                                                >
                                                    {
                                                        row.Issue
                                                    }
                                                </th>

                                                {dynamicHeaders.map(
                                                    (
                                                        col
                                                    ) => (
                                                        <th
                                                            key={
                                                                col
                                                            }
                                                        >
                                                            {row[
                                                                col
                                                            ] ??
                                                                0}
                                                        </th>
                                                    )
                                                )}

                                                <th>
                                                    {
                                                        row.Total
                                                    }
                                                </th>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </TableContainer>
                    </Box>
                </div>
            </Slide>

           
            {/* 🔥 Upload Dialog */}
            <Dialog
                open={openUploadDialog}
                onClose={() => setOpenUploadDialog(false)}
                PaperProps={{
                    sx: {
                        background: "transparent",
                        boxShadow: "none",
                        overflow: "visible",
                        borderRadius: "25px",
                    },
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: "rgba(0,0,0,0.45)",
                        backdropFilter: "blur(4px)",
                    },
                }}
            >

                {/* 🔥 INLINE CSS */}
                <style>
                    {`
            .swal2-container{
                z-index: 20000 !important;
            }

            .swal2-popup{
                z-index: 20001 !important;
                border-radius: 20px !important;
            }
        `}
                </style>

                {/* 🔥 MAIN CARD */}
                <Box
                    sx={{
                        width: {
                            xs: "95vw",
                            sm: "550px",
                        },
                        p: 4,
                        borderRadius: "28px",
                        background:
                            "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))",
                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        boxShadow:
                            "0 15px 45px rgba(0,0,0,0.25)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        position: "relative",
                    }}
                >

                    {/* 🔥 TOP SECTION */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 20,
                                    sm: 28,
                                },
                                fontWeight: "bold",
                                color: "#1e293b",
                                letterSpacing: "0.5px",
                            }}
                        >
                            Select Excel Files :-
                        </Typography>

                        {/* 🔥 CLOSE BUTTON */}
                        <IconButton
                            onClick={() =>
                                setOpenUploadDialog(false)
                            }
                            sx={{
                                background:
                                    "rgba(255,255,255,0.35)",
                                backdropFilter: "blur(8px)",
                                "&:hover": {
                                    background:
                                        "rgba(255,255,255,0.55)",
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* 🔥 FILE SECTION */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                width: "fit-content",
                                borderRadius: "16px",
                                px: 4,
                                py: 1.5,
                                fontWeight: "bold",
                                fontSize: 15,
                                textTransform: "none",
                                background:
                                    "linear-gradient(135deg,#2196f3,#1565c0)",
                                boxShadow:
                                    "0 8px 22px rgba(33,150,243,0.45)",
                                "&:hover": {
                                    background:
                                        "linear-gradient(135deg,#1e88e5,#0d47a1)",
                                },
                            }}
                        >
                            SELECT FILE

                            <input
                                hidden
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileChange}
                            />
                        </Button>

                        {/* 🔥 FILE NAME */}
                        {selectedFile && (
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: "14px",
                                    background:
                                        "rgba(255,255,255,0.22)",
                                    border:
                                        "1px solid rgba(255,255,255,0.18)",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        color: "#15803d",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {selectedFile.name}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* 🔥 BUTTON SECTION */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 3,
                            flexWrap: "wrap",
                        }}
                    >

                        {/* 🔥 UPLOAD */}
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<CloudUploadIcon />}
                            onClick={handleUploadFile}
                            sx={{
                                flex: 1,
                                py: 1.6,
                                borderRadius: "18px",
                                fontWeight: "bold",
                                fontSize: 15,
                                boxShadow:
                                    "0 8px 24px rgba(34,197,94,0.45)",
                            }}
                        >
                            UPLOAD
                        </Button>

                        {/* 🔥 CLEAR */}
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<BlockIcon />}
                            onClick={handleClearFile}
                            sx={{
                                flex: 1,
                                py: 1.6,
                                borderRadius: "18px",
                                fontWeight: "bold",
                                fontSize: 15,
                                boxShadow:
                                    "0 8px 24px rgba(239,68,68,0.45)",
                            }}
                        >
                            CLEAR
                        </Button>
                    </Box>
                </Box>
            </Dialog>

            {loading}
        </>
    );
};

export default IssueTracker;