// import React, { useState, useEffect } from "react";
// import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import UploadIcon from '@mui/icons-material/Upload';
// import DoDisturbIcon from '@mui/icons-material/DoDisturb';
// import { postData, ServerURL, getData } from "../../../services/FetchNodeServices";
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import TextField from '@mui/material/TextField';
// import Tooltip from '@mui/material/Tooltip';
// import Swal from "sweetalert2";
// import Dialog from '@mui/material/Dialog';
// import DialogContent from '@mui/material/DialogContent';
// import GearIcon from '@rsuite/icons/Gear';
// import OverAllCss from "../../../csss/OverAllCss";
// import Zoom from "@mui/material/Zoom";
// import ClearIcon from '@mui/icons-material/Clear';
// import { useNavigate } from 'react-router-dom'
// import { driver } from "driver.js";
// import "driver.js/dist/driver.css";
// import Fab from '@mui/material/Fab';
// import LiveHelpIcon from '@mui/icons-material/LiveHelp';
// import { usePost } from "../../../Hooks/PostApis";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import Slide from '@mui/material/Slide';
// import { IconButton } from 'rsuite';


// const QueryTraffic = () => {

//     const [siteListFile, setSiteListFile] = useState({ filename: "", bytes: "" })
//     const [open, setOpen] = useState(false);
//     const [siteData, setSiteData] = useState([])
//     const [offerDate, setOfferDate] = useState()
//     const [rawShow, setRawShow] = useState(false)
//     const [siteShow, setSiteShow] = useState(false)
//     const [fileData, setFileData] = useState()
//     const [dlink, setDlink] = useState(false)
//     const [download, setDownload] = useState(false);
//     const siteListLength = siteListFile.filename.length
//     const { makePostRequest, cancelRequest } = usePost()
//     const classes = OverAllCss()
//     const navigate = useNavigate()


//     var link = `${ServerURL}${fileData}`;

//     const handleSiteListFile = (event) => {
//         setSiteShow(false);
//         setSiteListFile({
//             filename: event.target.files[0].name,
//             bytes: event.target.files[0],
//             state: true
//         })
//     }

//     // console.log('size:', fileData);
//     const handleSiteList = (event) => {
//     let value = event.target.value.trim();
//     let list = value.split(/\s+/).join(","); // handles multiple spaces
//     setSiteData(list);
// };

//     const todayDate = () => {
//         // const d = new Date()

//         var d = new Date(),
//             month = '' + (d.getMonth() + 1),
//             day = '' + d.getDate(),
//             year = d.getFullYear();

//         if (month.length < 2)
//             month = '0' + month;
//         if (day.length < 2)
//             day = '0' + day;

//         setOfferDate([year, month, day].join('-'))

//     }


//     const dateFun = (date) => {
//         setOfferDate(date)
//         // console.log('Date', date)
//     }
//     useEffect(() => {

//         todayDate();
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

//     }, [])

//     const handleSubmit = async () => {

//         if (siteListLength > 0 || siteData.length > 0) {
//             setOpen(true)
//             var formData = new FormData();
//             formData.append("site_id", siteData);
//             formData.append("on_air_date", offerDate);
//             // const response = await postData('trend/ap/makeKpiTrend/old/2G', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }, signal: abortSignal })
//             const response = await makePostRequest('payload_traffic/get_traffic/', formData)
//             setFileData(response.download_url)
//             console.log('response data', response)
//             setDownload(true)
//             if (response === false) {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Oops...",
//                     text: `${response.message}`,
//                 });
//             }
//             if (response.status == true) {
//                 setOpen(false);
//                 setDlink(true);
//             }
//                 Swal.fire({
//                     icon: "success",
//                     title: "Done",
//                     text: `${response.message}`,
//                 });
//             }

//             if (siteListLength == 0 && siteData.length == 0) {
//                 // setSiteShow(true)
//                 alert('Please Select Site IDs')

//             }
//         };

//         // DATA PROCESSING DIALOG BOX...............
//         const loadingDialog = () => {
//             return (
//                 <Dialog
//                     open={open}

//                     // TransitionComponent={Transition}
//                     keepMounted
//                 // aria-describedby="alert-dialog-slide-description"

//                 >
//                     <DialogContent         >
//                         <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
//                         <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
//                         <Box style={{ margin: '10px 0px 10px 0px', fontWeight: 'bolder' }}>DATA UNDER PROCESSING...</Box>
//                         <Button variant="contained" fullWidth style={{ backgroundColor: "red", color: 'white' }} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
//                     </DialogContent>
//                 </Dialog>
//             )
//         }

//         const handleCancel = () => {
//             // setRawKpiFile({ filename: "", bytes: "" })
//             setOfferDate({ filename: "", bytes: "" })
//             todayDate()

//         }

//         return (
//             <Zoom in={true} timeout={500}>
//                 <div>
//                     <div style={{ margin: 10, marginLeft: 10, marginTop: 20 }}>
//                         <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                             <Link underline="hover" onClick={() => navigate('/tools')}>Tools</Link>
//                             <Link underline="hover" href='/tools/payload_traffic'>Payload Traffic</Link>
//                             <Typography color='text.primary'>Query Traffic</Typography>
//                         </Breadcrumbs>
//                     </div>
//                     <Slide
//                         direction='left'
//                         in='true'
//                         // style={{ transformOrigin: '0 0 0' }}
//                         timeout={1000}
//                     >
//                         <Box className={classes.main_Box}>
//                             <Box className={classes.Back_Box}>
//                                 <Box className={classes.Box_Hading}>
//                                     Traffic Query
//                                 </Box>
//                                 <Stack spacing={2} sx={{ marginTop: "-40px" }}>

//                                     <Box className={classes.Front_Box} id="step-1">
//                                         <div className={classes.Front_Box_Hading}>
//                                             Enter Site List:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20, boxSizing: 'border-box' }}></span>
//                                         </div>
//                                         <div className={classes.Front_Box_Select_Button}>
//                                             <div>
//                                                 {/* <input onChange={handleSiteListFile}   multiple type="search" sx={{width:'100px'}}/> */}
//                                                 <TextField onChange={handleSiteList} fullWidth size="small" type="search" variant="outlined" style={{ width: 'auto' }} />
//                                             </div>

//                                         </div>
//                                     </Box>

//                                     <Box className={classes.Front_Box} id="step-2">
//                                         <div className={classes.Front_Box_Hading}>
//                                             ON-AIR DATE:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
//                                         </div>
//                                         <div className={classes.Front_Box_Select_Button}>
//                                             <div style={{ float: "left" }}>

//                                                 <input required value={offerDate}
//                                                     onChange={(event) => dateFun(event.target.value)}
//                                                     type="date"
//                                                     style={{ width: '165px', height: '35px', fontSize: '20px', fontWeight: 'bold' }}
//                                                 />
//                                             </div>
//                                             <div></div>
//                                         </div>
//                                     </Box>


//                                 </Stack>
//                                 <Box style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
//                                     <Box id="step-3">
//                                         <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>
//                                     </Box>
//                                     <Box >
//                                         <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
//                                     </Box >
//                                 </Box>
//                             </Box>
//                             <Box sx={{ display: download ? 'block' : 'none', textAlign: 'center' }}>
//                                 <a download href={fileData}><Button variant="outlined" onClick='' title="Export Excel" startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Traffic Query</span></Button></a>
//                             </Box>
//                             {/* <Box style={{ display: dlink ? "inherit" : "none" }}>
//         <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download KPI Trend</span></Button></a>
//       </Box> */}
//                         </Box>
//                     </Slide>
//                 </div>
//             </Zoom>
//         )
//     }

//     export default QueryTraffic


// import React, { useState, useEffect } from "react";
// import { Box, Button, Stack, Breadcrumbs, Link, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import UploadIcon from '@mui/icons-material/Upload';
// import DoDisturbIcon from '@mui/icons-material/DoDisturb';
// import { postData, ServerURL, getData } from "../../../services/FetchNodeServices";
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import TextField from '@mui/material/TextField';
// import Tooltip from '@mui/material/Tooltip';
// import Swal from "sweetalert2";
// import Dialog from '@mui/material/Dialog';
// import DialogContent from '@mui/material/DialogContent';
// import GearIcon from '@rsuite/icons/Gear';
// import OverAllCss from "../../../csss/OverAllCss";
// import Zoom from "@mui/material/Zoom";
// import ClearIcon from '@mui/icons-material/Clear';
// import { useNavigate } from 'react-router-dom'
// import { driver } from "driver.js";
// import "driver.js/dist/driver.css";
// import Fab from '@mui/material/Fab';
// import LiveHelpIcon from '@mui/icons-material/LiveHelp';
// import { usePost } from "../../../Hooks/PostApis";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import Slide from '@mui/material/Slide';
// import { IconButton } from 'rsuite';


// const QueryTraffic = () => {

//     const [siteListFile, setSiteListFile] = useState({ filename: "", bytes: "" })
//     const [open, setOpen] = useState(false);
//     const [siteData, setSiteData] = useState([])
//     const [offerDate, setOfferDate] = useState()
//     const [rawShow, setRawShow] = useState(false)
//     const [siteShow, setSiteShow] = useState(false)
//     const [fileData, setFileData] = useState()
//     const [dlink, setDlink] = useState(false)
//     const [download, setDownload] = useState(false);
//     const [trafficData, setTrafficData] = useState([])
//     const [tabValue, setTabValue] = useState(0)
//     const siteListLength = siteListFile.filename.length
//     const { makePostRequest, cancelRequest } = usePost()
//     const classes = OverAllCss()
//     const navigate = useNavigate()


//     var link = `${ServerURL}${fileData}`;

//     const handleSiteListFile = (event) => {
//         setSiteShow(false);
//         setSiteListFile({
//             filename: event.target.files[0].name,
//             bytes: event.target.files[0],
//             state: true
//         })
//     }

//     // console.log('size:', fileData);
//     const handleSiteList = (event) => {
//         let value = event.target.value.trim();
//         let list = value.split(/\s+/).join(","); // handles multiple spaces
//         setSiteData(list);
//     };

//     const todayDate = () => {
//         // const d = new Date()

//         var d = new Date(),
//             month = '' + (d.getMonth() + 1),
//             day = '' + d.getDate(),
//             year = d.getFullYear();

//         if (month.length < 2)
//             month = '0' + month;
//         if (day.length < 2)
//             day = '0' + day;

//         setOfferDate([year, month, day].join('-'))

//     }


//     const dateFun = (date) => {
//         setOfferDate(date)
//         // console.log('Date', date)
//     }
//     useEffect(() => {

//         todayDate();
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

//     }, [])

//     const handleSubmit = async () => {

//         if (siteListLength > 0 || siteData.length > 0) {
//             setOpen(true)
//             var formData = new FormData();
//             formData.append("site_id", siteData);
//             formData.append("on_air_date", offerDate);
//             // const response = await postData('trend/ap/makeKpiTrend/old/2G', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }, signal: abortSignal })
//             const response = await makePostRequest('payload_traffic/get_traffic/', formData)
//             setFileData(response.download_url)
//             console.log('response data', response)
//             setDownload(true)
//             setTrafficData(response.data || [])
//             if (response === false) {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Oops...",
//                     text: `${response.message}`,
//                 });
//             }
//             if (response.status == true) {
//                 setOpen(false);
//                 setDlink(true);
//             }
//             Swal.fire({
//                 icon: "success",
//                 title: "Done",
//                 text: `${response.message}`,
//             });
//         }

//         if (siteListLength == 0 && siteData.length == 0) {
//             // setSiteShow(true)
//             alert('Please Select Site IDs')

//         }
//     };

//     // FORMAT on_air_date FROM "YYYY-MM-DD" TO "DD-MM-YYYY" FOR DISPLAY...............
//     const formatOnAirDate = (dateStr) => {
//         if (!dateStr) return ""
//         if (dateStr.includes("-") && dateStr.split("-")[0].length === 4) {
//             const [y, m, d] = dateStr.split("-")
//             return `${d}-${m}-${y}`
//         }
//         return dateStr
//     }

//     // BUILD ROWS FOR ONE TAB (PREVIOUS OR FUTURE) FROM trafficData...............
//     const buildRows = (site, isPrev) => {
//         const labels = isPrev ? site.prev_labels : site.fwd_labels
//         const values4g = isPrev ? site.prev_4g : site.fwd_4g
//         const values5g = isPrev ? site.prev_5g : site.fwd_5g
//         const valuesTotal = isPrev ? site.prev_total : site.fwd_total
//         const avg4g = isPrev ? site.prev_avg_4g : site.fwd_avg_4g
//         const avg5g = isPrev ? site.prev_avg_5g : site.fwd_avg_5g
//         const avgTotal = isPrev ? site.prev_avg_tot : site.fwd_avg_tot

//         return [
//             { label: "4G Traffic", values: values4g, average: avg4g, bg: "#e2f0d9" },
//             { label: "5G Traffic", values: values5g, average: avg5g, bg: "#fbe5d6" },
//             { label: "Total Traffic", values: valuesTotal, average: avgTotal, bg: "#fbe5d6", bold: true },
//         ].map((row) => ({
//             ...row,
//             onAirDate: formatOnAirDate(site.on_air_date),
//             siteId: site.site_id,
//             labels: labels,
//         }))
//     }

//     // TRAFFIC TABLE RENDER (PREVIOUS 10 DAYS / FUTURE 10 DAYS)...............
//     const renderTrafficTable = (isPrev) => {
//         if (!trafficData || trafficData.length === 0) {
//             return (
//                 <Box style={{ padding: 20, textAlign: 'center', color: 'gray' }}>
//                     No data to display yet. Submit a query to see results.
//                 </Box>
//             )
//         }

//         const dateLabels = (isPrev ? trafficData[0].prev_labels : trafficData[0].fwd_labels) || []

//         return (
//             <TableContainer component={Paper} style={{ marginTop: 10 }}>
//                 <Table size="small">
//                     <TableHead>
//                         <TableRow style={{ backgroundColor: '#1f3864' }}>
//                             <TableCell style={{ color: 'white', fontWeight: 'bold' }}>On_air_date</TableCell>
//                             <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Site_ID</TableCell>
//                             <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Values</TableCell>
//                             {dateLabels.map((dt, idx) => (
//                                 <TableCell key={idx} align="center" style={{ color: 'white', fontWeight: 'bold' }}>{dt}</TableCell>
//                             ))}
//                             <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }}>Average</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {trafficData.map((site, siteIdx) => (
//                             buildRows(site, isPrev).map((row, rowIdx) => (
//                                 <TableRow key={`${siteIdx}-${rowIdx}`}>
//                                     <TableCell style={{ fontWeight: 'bold' }}>{row.onAirDate}</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold' }}>{row.siteId}</TableCell>
//                                     <TableCell style={{ backgroundColor: row.bg, fontWeight: 'bold' }}>{row.label}</TableCell>
//                                     {row.values.map((val, vIdx) => (
//                                         <TableCell key={vIdx} align="center" style={{ backgroundColor: row.bg }}>{val}</TableCell>
//                                     ))}
//                                     <TableCell align="center" style={{ backgroundColor: '#fff2cc', fontWeight: 'bold' }}>{row.average}</TableCell>
//                                 </TableRow>
//                             ))
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         )
//     }

//     // DATA PROCESSING DIALOG BOX...............
//     const loadingDialog = () => {
//         return (
//             <Dialog
//                 open={open}

//                 // TransitionComponent={Transition}
//                 keepMounted
//             // aria-describedby="alert-dialog-slide-description"

//             >
//                 <DialogContent         >
//                     <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
//                     <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
//                     <Box style={{ margin: '10px 0px 10px 0px', fontWeight: 'bolder' }}>DATA UNDER PROCESSING...</Box>
//                     <Button variant="contained" fullWidth style={{ backgroundColor: "red", color: 'white' }} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
//                 </DialogContent>
//             </Dialog>
//         )
//     }

//     const handleCancel = () => {
//         // setRawKpiFile({ filename: "", bytes: "" })
//         setOfferDate({ filename: "", bytes: "" })
//         todayDate()

//     }

//     return (
//         <Zoom in={true} timeout={500}>
//             <div>
//                 <div style={{ margin: 10, marginLeft: 10, marginTop: 20 }}>
//                     <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                         <Link underline="hover" onClick={() => navigate('/tools')}>Tools</Link>
//                         <Link underline="hover" href='/tools/payload_traffic'>Payload Traffic</Link>
//                         <Typography color='text.primary'>Query Traffic</Typography>
//                     </Breadcrumbs>
//                 </div>
//                 <Slide
//                     direction='left'
//                     in='true'
//                     // style={{ transformOrigin: '0 0 0' }}
//                     timeout={1000}
//                 >
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box}>
//                             <Box className={classes.Box_Hading}>
//                                 Traffic Query
//                             </Box>
//                             <Stack spacing={2} sx={{ marginTop: "-40px" }}>

//                                 <Box className={classes.Front_Box} id="step-1">
//                                     <div className={classes.Front_Box_Hading}>
//                                         Enter Site List:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20, boxSizing: 'border-box' }}></span>
//                                     </div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <div>
//                                             {/* <input onChange={handleSiteListFile}   multiple type="search" sx={{width:'100px'}}/> */}
//                                             <TextField onChange={handleSiteList} fullWidth size="small" type="search" variant="outlined" style={{ width: 'auto' }} />
//                                         </div>

//                                     </div>
//                                 </Box>

//                                 <Box className={classes.Front_Box} id="step-2">
//                                     <div className={classes.Front_Box_Hading}>
//                                         ON-AIR DATE:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
//                                     </div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <div style={{ float: "left" }}>

//                                             <input required value={offerDate}
//                                                 onChange={(event) => dateFun(event.target.value)}
//                                                 type="date"
//                                                 style={{ width: '165px', height: '35px', fontSize: '20px', fontWeight: 'bold' }}
//                                             />
//                                         </div>
//                                         <div></div>
//                                     </div>
//                                 </Box>


//                             </Stack>
//                             <Box style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
//                                 <Box id="step-3">
//                                     <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>
//                                 </Box>
//                                 <Box >
//                                     <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
//                                 </Box >
//                             </Box>
//                         </Box>
//                         <Box sx={{ display: download ? 'block' : 'none', textAlign: 'center' }}>
//                             <a download href={fileData}><Button variant="outlined" onClick='' title="Export Excel" startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Traffic Query</span></Button></a>
//                         </Box>
//                         {/* <Box style={{ display: dlink ? "inherit" : "none" }}>
// <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download KPI Trend</span></Button></a>
// </Box> */}

//                         {/* TRAFFIC TABLE WITH TABS ("Previous 10 Days" / "Future 10 Days")............... */}
//                         <Box style={{ marginTop: 20 }}>
//                             <Tabs
//                                 value={tabValue}
//                                 onChange={(event, newValue) => setTabValue(newValue)}
//                                 textColor="primary"
//                                 indicatorColor="primary"
//                             >
//                                 <Tab label="Previous 10 Days" />
//                                 <Tab label="Future 10 Days" />
//                             </Tabs>
//                             {tabValue === 0 && renderTrafficTable(true)}
//                             {tabValue === 1 && renderTrafficTable(false)}
//                         </Box>
//                     </Box>
//                 </Slide>
//             </div>
//         </Zoom>
//     )
// }

// export default QueryTraffic

// import React, { useState, useEffect } from "react";
// import { Box, Button, Stack, Breadcrumbs, Link, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputAdornment, ToggleButton, ToggleButtonGroup } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import UploadIcon from '@mui/icons-material/Upload';
// import DoDisturbIcon from '@mui/icons-material/DoDisturb';
// import SearchIcon from '@mui/icons-material/Search';
// import { postData, ServerURL, getData } from "../../../services/FetchNodeServices";
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import TextField from '@mui/material/TextField';
// import Tooltip from '@mui/material/Tooltip';
// import Swal from "sweetalert2";
// import Dialog from '@mui/material/Dialog';
// import DialogContent from '@mui/material/DialogContent';
// import GearIcon from '@rsuite/icons/Gear';
// import OverAllCss from "../../../csss/OverAllCss";
// import Zoom from "@mui/material/Zoom";
// import ClearIcon from '@mui/icons-material/Clear';
// import { useNavigate } from 'react-router-dom'
// import { driver } from "driver.js";
// import "driver.js/dist/driver.css";
// import Fab from '@mui/material/Fab';
// import LiveHelpIcon from '@mui/icons-material/LiveHelp';
// import { usePost } from "../../../Hooks/PostApis";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import Slide from '@mui/material/Slide';
// import { IconButton } from 'rsuite';


// const QueryTraffic = () => {

//     const [siteListFile, setSiteListFile] = useState({ filename: "", bytes: "" })
//     const [open, setOpen] = useState(false);
//     // COMBINED SEARCH VALUE - USER CAN PASTE/TYPE SITE IDs AND/OR SHORT NAMES HERE...............
//     const [queryData, setQueryData] = useState("")
//     // WHICH COLUMN THE PASTED VALUE(S) SHOULD BE MATCHED AGAINST - "site_id" OR "short_name"...............
//     const [searchType, setSearchType] = useState("site_id")
//     const [offerDate, setOfferDate] = useState()
//     const [rawShow, setRawShow] = useState(false)
//     const [siteShow, setSiteShow] = useState(false)
//     const [fileData, setFileData] = useState()
//     const [dlink, setDlink] = useState(false)
//     const [download, setDownload] = useState(false);
//     const [trafficData, setTrafficData] = useState([])
//     const [tabValue, setTabValue] = useState(0)
//     const siteListLength = siteListFile.filename.length
//     const { makePostRequest, cancelRequest } = usePost()
//     const classes = OverAllCss()
//     const navigate = useNavigate()


//     var link = `${ServerURL}${fileData}`;

//     const handleSiteListFile = (event) => {
//         setSiteShow(false);
//         setSiteListFile({
//             filename: event.target.files[0].name,
//             bytes: event.target.files[0],
//             state: true
//         })
//     }

//     // SINGLE FIELD FOR SITE ID / SHORT NAME - USER PASTES A LIST OR TYPES AND PRESSES ENTER...............
//     const handleQueryChange = (event) => {
//         let value = event.target.value.trim();
//         let list = value.split(/\s+/).join(","); // handles multiple spaces / newlines
//         setQueryData(list);
//     };

//     // TOGGLE BETWEEN SEARCHING BY SITE ID OR SHORT NAME - ONLY THE SELECTED COLUMN IS SENT TO BACKEND...............
//     const handleSearchTypeChange = (event, newType) => {
//         if (newType !== null) {
//             setSearchType(newType)
//         }
//     }

//     const todayDate = () => {
//         // const d = new Date()

//         var d = new Date(),
//             month = '' + (d.getMonth() + 1),
//             day = '' + d.getDate(),
//             year = d.getFullYear();

//         if (month.length < 2)
//             month = '0' + month;
//         if (day.length < 2)
//             day = '0' + day;

//         setOfferDate([year, month, day].join('-'))

//     }


//     const dateFun = (date) => {
//         setOfferDate(date)
//         // console.log('Date', date)
//     }
//     useEffect(() => {

//         todayDate();
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

//     }, [])

//     // EXTRACT A HUMAN-READABLE ERROR MESSAGE FROM WHATEVER makePostRequest/axios GIVES BACK...............
//     const extractErrorMessage = (err) => {
//         // DRF commonly returns { detail: "..." } or { field: ["error"] } or { message: "..." }
//         const data = err?.response?.data
//         if (!data) return err?.message || "Something went wrong while fetching traffic data."

//         if (typeof data === "string") return data
//         if (data.detail) return data.detail
//         if (data.message) return data.message

//         // Field-level validation errors, e.g. { on_air_date: ["This field is required."] }
//         if (typeof data === "object") {
//             const parts = Object.entries(data).map(([field, msgs]) => {
//                 const msgText = Array.isArray(msgs) ? msgs.join(" ") : msgs
//                 return `${field}: ${msgText}`
//             })
//             if (parts.length) return parts.join(" | ")
//         }

//         return "Request failed. Please check your input and try again."
//     }

//     const handleSubmit = async () => {

//         if (siteListLength > 0 || queryData.length > 0) {
//             setOpen(true)
//             var formData = new FormData();
//             // SEND VALUE ONLY UNDER THE SELECTED COLUMN KEY - PREVENTS CROSS-MATCHING AGAINST THE WRONG COLUMN...............
//             if (searchType === "site_id") {
//                 formData.append("site_id", queryData);
//                 formData.append("short_name", "");
//             } else {
//                 formData.append("site_id", "");
//                 formData.append("short_name", queryData);
//             }
//             formData.append("on_air_date", offerDate);

//             try {
//                 const response = await makePostRequest('payload_traffic/get_traffic/', formData)
//                 console.log('response data', response)

//                 // makePostRequest returns false when the request itself failed (e.g. 400/500)...............
//                 if (!response || response === false) {
//                     setOpen(false)
//                     Swal.fire({
//                         icon: "error",
//                         title: "Oops...",
//                         text: "Failed to fetch traffic data. Please check the Site ID / Short Name and On-Air Date and try again. (Check console/network tab for backend validation details.)",
//                     });
//                     return;
//                 }

//                 setFileData(response.download_url)
//                 setTrafficData(response.data || [])

//                 if (response.status == true) {
//                     setOpen(false);
//                     setDlink(true);
//                     setDownload(true);
//                     Swal.fire({
//                         icon: "success",
//                         title: "Done",
//                         text: `${response.message || "Traffic data fetched successfully"}`,
//                     });
//                 } else {
//                     setOpen(false);
//                     Swal.fire({
//                         icon: "error",
//                         title: "Oops...",
//                         text: `${response.message || "Failed to fetch traffic data"}`,
//                     });
//                 }
//             } catch (error) {
//                 console.error('Traffic query error:', error);
//                 setOpen(false);
//                 Swal.fire({
//                     icon: "error",
//                     title: "Oops...",
//                     text: extractErrorMessage(error),
//                 });
//             }
//         }

//         if (siteListLength == 0 && queryData.length == 0) {
//             // setSiteShow(true)
//             alert('Please Enter Site ID or Short Name')

//         }
//     };

//     // FORMAT on_air_date FROM "YYYY-MM-DD" TO "DD-MM-YYYY" FOR DISPLAY...............
//     const formatOnAirDate = (dateStr) => {
//         if (!dateStr) return ""
//         if (dateStr.includes("-") && dateStr.split("-")[0].length === 4) {
//             const [y, m, d] = dateStr.split("-")
//             return `${d}-${m}-${y}`
//         }
//         return dateStr
//     }

//     // BUILD ROWS FOR ONE TAB (PREVIOUS OR FUTURE) FROM trafficData...............
//     const buildRows = (site, isPrev) => {
//         const labels = isPrev ? site.prev_labels : site.fwd_labels
//         const values4g = isPrev ? site.prev_4g : site.fwd_4g
//         const values5g = isPrev ? site.prev_5g : site.fwd_5g
//         const valuesTotal = isPrev ? site.prev_total : site.fwd_total
//         const avg4g = isPrev ? site.prev_avg_4g : site.fwd_avg_4g
//         const avg5g = isPrev ? site.prev_avg_5g : site.fwd_avg_5g
//         const avgTotal = isPrev ? site.prev_avg_tot : site.fwd_avg_tot

//         return [
//             { label: "4G Traffic", values: values4g, average: avg4g, bg: "#e2f0d9" },
//             { label: "5G Traffic", values: values5g, average: avg5g, bg: "#fbe5d6" },
//             { label: "Total Traffic", values: valuesTotal, average: avgTotal, bg: "#fbe5d6", bold: true },
//         ].map((row) => ({
//             ...row,
//             onAirDate: formatOnAirDate(site.on_air_date),
//             siteId: site.site_id,
//             labels: labels,
//         }))
//     }

//     // TRAFFIC TABLE RENDER (PREVIOUS 10 DAYS / FUTURE 10 DAYS)...............
//     const renderTrafficTable = (isPrev) => {
//         if (!trafficData || trafficData.length === 0) {
//             return (
//                 <Box style={{ padding: 20, textAlign: 'center', color: 'gray' }}>
//                     No data to display yet. Submit a query to see results.
//                 </Box>
//             )
//         }

//         const dateLabels = (isPrev ? trafficData[0].prev_labels : trafficData[0].fwd_labels) || []

//         return (
//             <TableContainer component={Paper} style={{ marginTop: 10 }}>
//                 <Table size="small">
//                     <TableHead>
//                         <TableRow style={{ backgroundColor: '#1f3864' }}>
//                             <TableCell style={{ color: 'white', fontWeight: 'bold' }}>On_air_date</TableCell>
//                             <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Site_ID</TableCell>
//                             <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Values</TableCell>
//                             {dateLabels.map((dt, idx) => (
//                                 <TableCell key={idx} align="center" style={{ color: 'white', fontWeight: 'bold' }}>{dt}</TableCell>
//                             ))}
//                             <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }}>Average</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {trafficData.map((site, siteIdx) => (
//                             buildRows(site, isPrev).map((row, rowIdx) => (
//                                 <TableRow key={`${siteIdx}-${rowIdx}`}>
//                                     <TableCell style={{ fontWeight: 'bold' }}>{row.onAirDate}</TableCell>
//                                     <TableCell style={{ fontWeight: 'bold' }}>{row.siteId}</TableCell>
//                                     <TableCell style={{ backgroundColor: row.bg, fontWeight: 'bold' }}>{row.label}</TableCell>
//                                     {row.values.map((val, vIdx) => (
//                                         <TableCell key={vIdx} align="center" style={{ backgroundColor: row.bg }}>{val}</TableCell>
//                                     ))}
//                                     <TableCell align="center" style={{ backgroundColor: '#fff2cc', fontWeight: 'bold' }}>{row.average}</TableCell>
//                                 </TableRow>
//                             ))
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         )
//     }

//     // DATA PROCESSING DIALOG BOX...............
//     const loadingDialog = () => {
//         return (
//             <Dialog
//                 open={open}

//                 // TransitionComponent={Transition}
//                 keepMounted
//             // aria-describedby="alert-dialog-slide-description"

//             >
//                 <DialogContent         >
//                     <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
//                     <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
//                     <Box style={{ margin: '10px 0px 10px 0px', fontWeight: 'bolder' }}>DATA UNDER PROCESSING...</Box>
//                     <Button variant="contained" fullWidth style={{ backgroundColor: "red", color: 'white' }} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
//                 </DialogContent>
//             </Dialog>
//         )
//     }

//     const handleCancel = () => {
//         // setRawKpiFile({ filename: "", bytes: "" })
//         setOfferDate({ filename: "", bytes: "" })
//         setQueryData("")
//         setSearchType("site_id")
//         todayDate()

//     }

//     return (
//         <Zoom in={true} timeout={500}>
//             <div>
//                 <div style={{ margin: 10, marginLeft: 10, marginTop: 20 }}>
//                     <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                         <Link underline="hover" onClick={() => navigate('/tools')}>Tools</Link>
//                         <Link underline="hover" href='/tools/payload_traffic'>Payload Traffic</Link>
//                         <Typography color='text.primary'>Query Traffic</Typography>
//                     </Breadcrumbs>
//                 </div>
//                 <Slide
//                     direction='left'
//                     in='true'
//                     // style={{ transformOrigin: '0 0 0' }}
//                     timeout={1000}
//                 >
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box}>
//                             <Box className={classes.Box_Hading}>
//                                 Traffic Query
//                             </Box>
//                             <Stack spacing={2} sx={{ marginTop: "-40px" }}>

//                                 {/* COMBINED SITE ID / SHORT NAME SEARCH FIELD............... */}
//                                 <Box className={classes.Front_Box} id="step-1">
//                                     <div className={classes.Front_Box_Hading}>
//                                         Site ID / Short Name<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20, boxSizing: 'border-box' }}></span>
//                                     </div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         {/* SELECT WHICH COLUMN THE PASTED VALUE(S) BELONG TO............... */}
//                                         <ToggleButtonGroup
//                                             value={searchType}
//                                             exclusive
//                                             onChange={handleSearchTypeChange}
//                                             size="small"
//                                             color="primary"
//                                             sx={{ marginBottom: 1 }}
//                                         >
//                                             <ToggleButton value="site_id">Site ID</ToggleButton>
//                                             <ToggleButton value="short_name">Short Name</ToggleButton>
//                                         </ToggleButtonGroup>
//                                         <div>
//                                             <TextField
//                                                 onChange={handleQueryChange}
//                                                 fullWidth
//                                                 size="small"
//                                                 variant="outlined"
//                                                 placeholder={searchType === "site_id" ? "Paste Site ID(s), press Enter" : "Paste Short Name(s), press Enter"}
//                                                 style={{ width: 'auto' }}
//                                                 InputProps={{
//                                                     startAdornment: (
//                                                         <InputAdornment position="start">
//                                                             <SearchIcon fontSize="small" style={{ color: '#8a8a8a' }} />
//                                                         </InputAdornment>
//                                                     ),
//                                                     sx: { borderRadius: '10px' },
//                                                 }}
//                                             />
//                                         </div>

//                                     </div>
//                                 </Box>

//                                 <Box className={classes.Front_Box} id="step-2">
//                                     <div className={classes.Front_Box_Hading}>
//                                         ON-AIR DATE:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
//                                     </div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <div style={{ float: "left" }}>

//                                             <input required value={offerDate}
//                                                 onChange={(event) => dateFun(event.target.value)}
//                                                 type="date"
//                                                 style={{ width: '165px', height: '35px', fontSize: '20px', fontWeight: 'bold' }}
//                                             />
//                                         </div>
//                                         <div></div>
//                                     </div>
//                                 </Box>


//                             </Stack>
//                             <Box style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
//                                 <Box id="step-3">
//                                     <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>
//                                 </Box>
//                                 <Box >
//                                     <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
//                                 </Box >
//                             </Box>
//                         </Box>
//                         <Box sx={{ display: download ? 'block' : 'none', textAlign: 'center' }}>
//                             <a download href={fileData}><Button variant="outlined" onClick='' title="Export Excel" startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Traffic Query</span></Button></a>
//                         </Box>
//                         {/* <Box style={{ display: dlink ? "inherit" : "none" }}>
// <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download KPI Trend</span></Button></a>
// </Box> */}

//                         {/* TRAFFIC TABLE WITH TABS ("Previous 10 Days" / "Future 10 Days")............... */}
//                         <Box style={{ marginTop: 20 }}>
//                             <Tabs
//                                 value={tabValue}
//                                 onChange={(event, newValue) => setTabValue(newValue)}
//                                 textColor="primary"
//                                 indicatorColor="primary"
//                             >
//                                 <Tab label="Previous 10 Days" />
//                                 <Tab label="Future 10 Days" />
//                             </Tabs>
//                             {tabValue === 0 && renderTrafficTable(true)}
//                             {tabValue === 1 && renderTrafficTable(false)}
//                         </Box>
//                     </Box>
//                 </Slide>
//             </div>
//         </Zoom>
//     )
// }

// export default QueryTraffic

import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputAdornment, ToggleButton, ToggleButtonGroup } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import SearchIcon from '@mui/icons-material/Search';
import { postData, ServerURL, getData } from "../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import OverAllCss from "../../../csss/OverAllCss";
import Zoom from "@mui/material/Zoom";
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom'
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Fab from '@mui/material/Fab';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import { usePost } from "../../../Hooks/PostApis";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import Slide from '@mui/material/Slide';
import { IconButton } from 'rsuite';


const QueryTraffic = () => {

    const [siteListFile, setSiteListFile] = useState({ filename: "", bytes: "" })
    const [open, setOpen] = useState(false);
    // COMBINED SEARCH VALUE - USER CAN PASTE/TYPE SITE IDs AND/OR SHORT NAMES HERE...............
    const [queryData, setQueryData] = useState("")
    // WHICH COLUMN THE PASTED VALUE(S) SHOULD BE MATCHED AGAINST - "site_id" OR "short_name"...............
    const [searchType, setSearchType] = useState("site_id")
    const [offerDate, setOfferDate] = useState()
    const [rawShow, setRawShow] = useState(false)
    const [siteShow, setSiteShow] = useState(false)
    const [fileData, setFileData] = useState()
    const [dlink, setDlink] = useState(false)
    const [download, setDownload] = useState(false);
    const [trafficData, setTrafficData] = useState([])
    const [tabValue, setTabValue] = useState(0)
    const siteListLength = siteListFile.filename.length
    const { makePostRequest, cancelRequest } = usePost()
    const classes = OverAllCss()
    const navigate = useNavigate()


    var link = `${ServerURL}${fileData}`;

    const handleSiteListFile = (event) => {
        setSiteShow(false);
        setSiteListFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true
        })
    }

    // SINGLE FIELD FOR SITE ID / SHORT NAME - USER PASTES A LIST OR TYPES AND PRESSES ENTER...............
    const handleQueryChange = (event) => {
        let value = event.target.value.trim();
        let list = value.split(/\s+/).join(","); // handles multiple spaces / newlines
        setQueryData(list);
    };

    // PRESSING ENTER IN THE SEARCH FIELD TRIGGERS THE QUERY IMMEDIATELY (SHOWS "DATA UNDER PROCESSING")...............
    const handleQueryKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSubmit();
        }
    };

    // TOGGLE BETWEEN SEARCHING BY SITE ID OR SHORT NAME - ONLY THE SELECTED COLUMN IS SENT TO BACKEND...............
    const handleSearchTypeChange = (event, newType) => {
        if (newType !== null) {
            setSearchType(newType)
        }
    }

    const todayDate = () => {
        // const d = new Date()

        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        setOfferDate([year, month, day].join('-'))

    }


    const dateFun = (date) => {
        setOfferDate(date)
        // console.log('Date', date)
    }
    useEffect(() => {

        todayDate();
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])

    // EXTRACT A HUMAN-READABLE ERROR MESSAGE FROM WHATEVER makePostRequest/axios GIVES BACK...............
    const extractErrorMessage = (err) => {
        // DRF commonly returns { detail: "..." } or { field: ["error"] } or { message: "..." }
        const data = err?.response?.data
        if (!data) return err?.message || "Something went wrong while fetching traffic data."

        if (typeof data === "string") return data
        if (data.detail) return data.detail
        if (data.message) return data.message

        // Field-level validation errors, e.g. { on_air_date: ["This field is required."] }
        if (typeof data === "object") {
            const parts = Object.entries(data).map(([field, msgs]) => {
                const msgText = Array.isArray(msgs) ? msgs.join(" ") : msgs
                return `${field}: ${msgText}`
            })
            if (parts.length) return parts.join(" | ")
        }

        return "Request failed. Please check your input and try again."
    }

    const handleSubmit = async () => {

        if (siteListLength > 0 || queryData.length > 0) {
            setOpen(true)
            var formData = new FormData();
            // SEND VALUE ONLY UNDER THE SELECTED COLUMN KEY - PREVENTS CROSS-MATCHING AGAINST THE WRONG COLUMN...............
            if (searchType === "site_id") {
                formData.append("site_id", queryData);
                formData.append("short_name", "");
            } else {
                formData.append("site_id", "");
                formData.append("short_name", queryData);
            }
            formData.append("on_air_date", offerDate);

            try {
                const response = await makePostRequest('payload_traffic/get_traffic/', formData)
                console.log('response data', response)

                // makePostRequest returns false when the request itself failed (e.g. 400/500)...............
                if (!response || response === false) {
                    setOpen(false)
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Failed to fetch traffic data. Please check the Site ID / Short Name and On-Air Date and try again. (Check console/network tab for backend validation details.)",
                    });
                    return;
                }

                setFileData(response.download_url)
                setTrafficData(response.data || [])

                if (response.status == true) {
                    setOpen(false);
                    setDlink(true);
                    setDownload(true);
                    Swal.fire({
                        icon: "success",
                        title: "Done",
                        text: `${response.message || "Traffic data fetched successfully"}`,
                    });
                } else {
                    setOpen(false);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: `${response.message || "Failed to fetch traffic data"}`,
                    });
                }
            } catch (error) {
                console.error('Traffic query error:', error);
                setOpen(false);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: extractErrorMessage(error),
                });
            }
        }

        if (siteListLength == 0 && queryData.length == 0) {
            // setSiteShow(true)
            alert('Please Enter Site ID or Short Name')

        }
    };

    // FORMAT on_air_date FROM "YYYY-MM-DD" TO "DD-MM-YYYY" FOR DISPLAY...............
    const formatOnAirDate = (dateStr) => {
        if (!dateStr) return ""
        if (dateStr.includes("-") && dateStr.split("-")[0].length === 4) {
            const [y, m, d] = dateStr.split("-")
            return `${d}-${m}-${y}`
        }
        return dateStr
    }

    // BUILD ROWS FOR ONE TAB (PREVIOUS OR FUTURE) FROM trafficData...............
    const buildRows = (site, isPrev) => {
        const labels = isPrev ? site.prev_labels : site.fwd_labels
        const values4g = isPrev ? site.prev_4g : site.fwd_4g
        const values5g = isPrev ? site.prev_5g : site.fwd_5g
        const valuesTotal = isPrev ? site.prev_total : site.fwd_total
        const avg4g = isPrev ? site.prev_avg_4g : site.fwd_avg_4g
        const avg5g = isPrev ? site.prev_avg_5g : site.fwd_avg_5g
        const avgTotal = isPrev ? site.prev_avg_tot : site.fwd_avg_tot

        return [
            { label: "4G Traffic", values: values4g, average: avg4g, bg: "#e2f0d9" },
            { label: "5G Traffic", values: values5g, average: avg5g, bg: "#fbe5d6" },
            { label: "Total Traffic", values: valuesTotal, average: avgTotal, bg: "#fbe5d6", bold: true },
        ].map((row) => ({
            ...row,
            onAirDate: formatOnAirDate(site.on_air_date),
            siteId: site.site_id,
            labels: labels,
        }))
    }

    // TRAFFIC TABLE RENDER (PREVIOUS 10 DAYS / FUTURE 10 DAYS)...............
    const renderTrafficTable = (isPrev) => {
        if (!trafficData || trafficData.length === 0) {
            return (
                <Box style={{ padding: 20, textAlign: 'center', color: 'gray' }}>
                    No data to display yet. Submit a query to see results.
                </Box>
            )
        }

        const dateLabels = (isPrev ? trafficData[0].prev_labels : trafficData[0].fwd_labels) || []

        return (
            <TableContainer component={Paper} style={{ marginTop: 10 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#1f3864' }}>
                            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>On_air_date</TableCell>
                            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Site_ID</TableCell>
                            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Values</TableCell>
                            {dateLabels.map((dt, idx) => (
                                <TableCell key={idx} align="center" style={{ color: 'white', fontWeight: 'bold' }}>{dt}</TableCell>
                            ))}
                            <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }}>Average</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trafficData.map((site, siteIdx) => (
                            buildRows(site, isPrev).map((row, rowIdx) => (
                                <TableRow key={`${siteIdx}-${rowIdx}`}>
                                    <TableCell style={{ fontWeight: 'bold' }}>{row.onAirDate}</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>{row.siteId}</TableCell>
                                    <TableCell style={{ backgroundColor: row.bg, fontWeight: 'bold' }}>{row.label}</TableCell>
                                    {row.values.map((val, vIdx) => (
                                        <TableCell key={vIdx} align="center" style={{ backgroundColor: row.bg }}>{val}</TableCell>
                                    ))}
                                    <TableCell align="center" style={{ backgroundColor: '#fff2cc', fontWeight: 'bold' }}>{row.average}</TableCell>
                                </TableRow>
                            ))
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    // DATA PROCESSING DIALOG BOX...............
    const loadingDialog = () => {
        return (
            <Dialog
                open={open}

                // TransitionComponent={Transition}
                keepMounted
            // aria-describedby="alert-dialog-slide-description"

            >
                <DialogContent         >
                    <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
                    <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
                    <Box style={{ margin: '10px 0px 10px 0px', fontWeight: 'bolder' }}>DATA UNDER PROCESSING...</Box>
                    <Button variant="contained" fullWidth style={{ backgroundColor: "red", color: 'white' }} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
                </DialogContent>
            </Dialog>
        )
    }

    const handleCancel = () => {
        // setRawKpiFile({ filename: "", bytes: "" })
        setOfferDate({ filename: "", bytes: "" })
        setQueryData("")
        setSearchType("site_id")
        todayDate()

    }

    return (
        <Zoom in={true} timeout={500}>
            <div>
                <div style={{ margin: 10, marginLeft: 10, marginTop: 20 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" onClick={() => navigate('/tools')}>Tools</Link>
                        <Link underline="hover" href='/tools/payload_traffic'>Payload Traffic</Link>
                        <Typography color='text.primary'>Query Traffic</Typography>
                    </Breadcrumbs>
                </div>
                <Slide
                    direction='left'
                    in='true'
                    // style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box}>
                            <Box className={classes.Box_Hading}>
                                Traffic Query
                            </Box>
                            <Stack spacing={2} sx={{ marginTop: "-40px" }}>

                                {/* COMBINED SITE ID / SHORT NAME SEARCH FIELD............... */}
                                <Box className={classes.Front_Box} id="step-1">
                                    <div className={classes.Front_Box_Hading}>
                                        Site ID / Short Name<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20, boxSizing: 'border-box' }}></span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        {/* SELECT WHICH COLUMN THE PASTED VALUE(S) BELONG TO............... */}
                                        <ToggleButtonGroup
                                            value={searchType}
                                            exclusive
                                            onChange={handleSearchTypeChange}
                                            size="small"
                                            color="primary"
                                            sx={{ marginBottom: 1 }}
                                        >
                                            <ToggleButton value="site_id">Site ID</ToggleButton>
                                            <ToggleButton value="short_name">Short Name</ToggleButton>
                                        </ToggleButtonGroup>
                                        <div>
                                            <TextField
                                                onChange={handleQueryChange}
                                                onKeyDown={handleQueryKeyDown}
                                                fullWidth
                                                size="small"
                                                variant="outlined"
                                                placeholder={searchType === "site_id" ? "Paste Site ID(s), press Enter" : "Paste Short Name(s), press Enter"}
                                                style={{ width: 'auto' }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon fontSize="small" style={{ color: '#8a8a8a' }} />
                                                        </InputAdornment>
                                                    ),
                                                    sx: { borderRadius: '10px' },
                                                }}
                                            />
                                        </div>

                                    </div>
                                </Box>

                                <Box className={classes.Front_Box} id="step-2">
                                    <div className={classes.Front_Box_Hading}>
                                        ON-AIR DATE:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>

                                            <input required value={offerDate}
                                                onChange={(event) => dateFun(event.target.value)}
                                                type="date"
                                                style={{ width: '165px', height: '35px', fontSize: '20px', fontWeight: 'bold' }}
                                            />
                                        </div>
                                        <div></div>
                                    </div>
                                </Box>


                            </Stack>
                            <Box style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                                <Box id="step-3">
                                    <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>
                                </Box>
                                <Box >
                                    <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
                                </Box >
                            </Box>
                        </Box>
                        <Box sx={{ display: download ? 'block' : 'none', textAlign: 'center' }}>
                            <a download href={fileData}><Button variant="outlined" onClick='' title="Export Excel" startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Traffic Query</span></Button></a>
                        </Box>
                        {/* <Box style={{ display: dlink ? "inherit" : "none" }}>
<a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download KPI Trend</span></Button></a>
</Box> */}

                        {/* TRAFFIC TABLE WITH TABS ("Previous 10 Days" / "Future 10 Days")............... */}
                        <Box style={{ marginTop: 20 }}>
                            <Tabs
                                value={tabValue}
                                onChange={(event, newValue) => setTabValue(newValue)}
                                textColor="primary"
                                indicatorColor="primary"
                            >
                                <Tab label="Previous 10 Days" />
                                <Tab label="Future 10 Days" />
                            </Tabs>
                            {tabValue === 0 && renderTrafficTable(true)}
                            {tabValue === 1 && renderTrafficTable(false)}
                        </Box>
                    </Box>
                </Slide>
                {loadingDialog()}
            </div>
        </Zoom>
    )
}

export default QueryTraffic