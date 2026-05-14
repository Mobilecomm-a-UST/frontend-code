// import React, { useState, useEffect, useCallback } from 'react';
// import { Box, Grid } from "@mui/material";
// import Tooltip from '@mui/material/Tooltip';
// import IconButton from '@mui/material/IconButton';
// import DownloadIcon from '@mui/icons-material/Download';
// import Dialog from '@mui/material/Dialog';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import CloseIcon from '@mui/icons-material/Close';
// // import * as ExcelJS from 'exceljs'
// import TableContainer from '@mui/material/TableContainer';
// import Paper from '@mui/material/Paper';
// import Slide from '@mui/material/Slide';
// import { CsvBuilder } from 'filefy';
// import { useGet } from '../../../Hooks/GetApis';
// import { usePost } from '../../../Hooks/PostApis';
// import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
// import { useQuery } from '@tanstack/react-query';
// import { useStyles } from '../../ToolsCss'
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import { setEncreptedData } from '../../../utils/localstorage';
// import { DiscFull } from '@mui/icons-material';

// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select, { SelectChangeEvent } from '@mui/material/Select';

// const RangeWiseDashboard = ({ onData }) => {
//     const classes = useStyles()
//     const [open, setOpen] = useState(false)
//     const { response, makeGetRequest } = useGet()
//     const { makePostRequest } = usePost()
//     const { loading, action } = useLoadingDialog();
//     const [mainDataT2, setMainDataT2] = useState([])
//     const [dateArray, setDateArray] = useState([])
//     const [tableData, setTableData] = useState([])
//     // const dashboardTypeOption = ['Integration_Name', 'HOTO_Accepted_Date_4g', 'HOTO_Accepted_Date_2g']
//     const [dashboardType, setDashboardType] = useState('Integration_Date')
//     const [givenDate, setGivenDate] = useState('')
//     const [fromDate, setFromDate] = useState('')
//     const [toDate, setToDate] = useState('')
//     const [fullData, setFullData] = useState([])
//     // const activityArray = ['DE-GROW', 'MACRO', 'OTHER', 'RELOCATION', 'RET', 'ULS-HPSC', 'UPGRADE', 'MEMTO', 'HT-INCREMENT', 'IBS', 'IDSC', 'ODSC', 'RECTIFICATION', 'OPERATION', 'RRU UPGRADE', '5G BW UPGRADE', '5G RRU SWAP', '5G SECTOR ADDITION', '5G RELOCATION', 'TRAFFIC SHIFTING', 'RRU SWAP', 'FR COUNT', '2G HOTO OFFERED COUNT', '2G HOTO ACCEPTED COUNT', '4G HOTO OFFERED COUNT', '4G HOTO ACCEPTED COUNT']
//     const activityArray = ['MACRO', 'RELOCATION', 'ULS-HPSC', 'UPGRADE', 'RRU UPGRADE', '5G SECTOR ADDITION', '5G RELOCATION', 'RRU SWAP', 'FR COUNT', '2G HOTO OFFERED COUNT', '2G HOTO ACCEPTED COUNT', '4G HOTO OFFERED COUNT', '4G HOTO ACCEPTED COUNT']

//     // const [totals, setTotals] = useState()




//     // const { isPending, isFetching, isError, data, refetch } = useQuery({
//     //     queryKey: ['Vi_Integration_Range_wise'],
//     //     queryFn: async () => {
//     //         action(isPending)
//     //         var formData = new FormData()
//     //         formData.append('from_date', fromDate)
//     //         formData.append('to_date', toDate)
//     //         const res = await makePostRequest("ix_tracker_vi/date-range-integration-data/", formData);
//     //         if (res) {
//     //             action(false)
//     //             // ShortDate(res.latest_dates)
//     //             // setDateArray(res.date_range)
//     //             setFromDate(res.date_range[0])
//     //             setToDate(res.date_range[1])
//     //             setTableData(JSON.parse(res.table_data))
//     //             // console.log('range wise data',JSON.parse(res.table_data))
//     //             onData(res);
//     //             return res;
//     //         }
//     //         else {
//     //             action(false)
//     //         }
//     //     },
//     //     staleTime: 100000,
//     //     refetchOnReconnect: false,
//     // })


//     const fetchRangeWiseDashboard = async () => {
//         action(true)
//         var formData = new FormData()
//         formData.append('from_date', fromDate)
//         formData.append('to_date', toDate)
//         formData.append('dashboard_type', dashboardType)
//         const res = await makePostRequest("ix_tracker_vi/date-range-integration-data/", formData);
//         if (res) {
//             action(false)
//             // ShortDate(res.latest_dates)
//             // setDateArray(res.date_range)
//             setFromDate(res.date_range[0])
//             setToDate(res.date_range[1])
//             setTableData(JSON.parse(res.table_data))
//             setFullData(res.download_data)
//             // console.log('range wise data',res)
//             onData(res);
//             return res;
//         }
//         else {
//             action(false)
//         }
//     }


//     // console.log('range dashboard', data, tableData)

//     const calculateColumnTotals = (datass) => {
//         const totals = {
//             // D1_DE_GROW: 0,
//             D1_MACRO: 0,
//             // D1_OTHERS: 0,
//             D1_RELOCATION: 0,
//             // D1_RET: 0,
//             D1_ULS_HPSC: 0,
//             D1_UPGRADE: 0,
//             // D1_FEMTO: 0,
//             // D1_HT_INCREMENT: 0,
//             // D1_IBS: 0,
//             // D1_IDSC: 0,
//             // D1_ODSC: 0,
//             // D1_RECTIFICATION: 0,
//             // D1_OPERATIONS: 0,
//             D1_RRU_UPGRADE: 0,
//             // D1_5G_BW_UPGRADE: 0,
//             // D1_5G_RRU_SWAP: 0,
//             D1_5G_SECTOR_ADDITION: 0,
//             D1_5G_RELOCATION: 0,
//             // D1_TRAFFIC_SHIFTING: 0,
//             D1_RRU_SWAP: 0,
//             FR_Date_Count: 0,
//             HOTO_Offered_2g_Count: 0,
//             HOTO_Accepted_2g_Count: 0,
//             HOTO_Offered_4g_Count: 0,
//             HOTO_Accepted_4g_Count: 0,

//         };

//         datass.forEach(item => {
//             for (let key in totals) {
//                 totals[key] += Number(item[key]) || 0;
//             }
//         });

//         return totals;
//     };

//     const totals = calculateColumnTotals(tableData);

//     const ShortDate = (dates) => {
//         const dateObjects = dates.map(dateStr => new Date(dateStr));

//         // Sort Date objects in increasing order
//         dateObjects.sort((a, b) => a - b);

//         // Convert sorted Date objects back to string format
//         const sortedDates = dateObjects.map(date => date.toISOString().split('T')[0]);

//         setDateArray(sortedDates)

//     }

//     const handleClose = () => {
//         setOpen(false)
//     }


//     // Download Key and value
//     const columnData = [
//         { title: 'Unique Key', field: 'unique_key' },
//         { title: 'OEM', field: 'OEM' },
//         { title: 'Integration Date', field: 'Integration_Date' },
//         { title: 'CIRCLE', field: 'CIRCLE' },
//         { title: 'Activity Name', field: 'Activity_Name' },
//         { title: 'Site ID', field: 'Site_ID' },
//         { title: 'MO NAME', field: 'MO_NAME' },

//         { title: 'LNBTS ID', field: 'LNBTS_ID' },
//         { title: 'Technology (SIWA)', field: 'Technology_SIWA' },
//         { title: 'Configuration 5G', field: 'Configuration_5G' },
//         { title: 'OSS Details', field: 'OSS_Details' },
//         { title: 'Cell ID', field: 'Cell_ID' },
//         { title: 'CELL COUNT', field: 'CELL_COUNT' },
//         { title: 'BSC NAME', field: 'BSC_NAME' },
//         { title: 'BCF', field: 'BCF' },
//         { title: 'TRX Count', field: 'TRX_Count' },
//         { title: 'PRE ALARM', field: 'PRE_ALARM' },
//         { title: 'GPS IP CLK', field: 'GPS_IP_CLK' },
//         { title: 'RET', field: 'RET' },
//         { title: 'POST VSWR', field: 'POST_VSWR' },
//         { title: 'POST Alarms', field: 'POST_Alarms' },
//         { title: 'Activity Mode (SA/NSA)', field: 'Activity_Mode' },
//         { title: 'Activity Type (SIWA)', field: 'Activity_Type_SIWA' },
//         { title: 'Band (SIWA)', field: 'Band_SIWA' },


//         { title: 'CELL STATUS', field: 'CELL_STATUS' },
//         { title: 'CTR STATUS', field: 'CTR_STATUS' },
//         { title: 'Integration Remark', field: 'Integration_Remark' },
//         { title: 'T2T4R', field: 'T2T4R' },
//         { title: 'BBU TYPE', field: 'BBU_TYPE' },
//         { title: 'BB CARD', field: 'BB_CARD' },
//         { title: 'RRU Type', field: 'RRU_Type' },
//         { title: 'Media Status', field: 'Media_Status' },
//         { title: 'Mplane IP', field: 'Mplane_IP' },
//         { title: 'SCF PREPARED_BY', field: 'SCF_PREPARED_BY' },
//         { title: 'SITE INTEGRATE_BY', field: 'SITE_INTEGRATE_BY' },
//         { title: 'Site Status', field: 'Site_Status' },
//         {
//             title: 'External Alarm Confirmation',
//             field: 'External_Alarm_Confirmation'
//         },
//         { title: 'SOFT AT STATUS', field: 'SOFT_AT_STATUS' },
//         { title: 'LICENCE Status', field: 'LICENCE_Status' },
//         { title: 'ESN NO', field: 'ESN_NO' },
//         {
//             title: 'Responsibility_for_alarm_clearance',
//             field: 'Responsibility_for_alarm_clearance'
//         },
//         { title: 'TAC', field: 'TAC' },
//         { title: 'PCI TDD 20', field: 'PCI_TDD_20' },
//         { title: 'PCI TDD 10/20', field: 'PCI_TDD_10_20' },
//         { title: 'PCI FDD 2100', field: 'PCI_FDD_2100' },
//         { title: 'PCI FDD 1800', field: 'PCI_FDD_1800' },
//         { title: 'PCI L900', field: 'PCI_L900' },
//         { title: '5G PCI', field: 'PCI_5G' },
//         { title: 'RSI TDD 20', field: 'RSI_TDD_20' },
//         { title: 'RSI TDD 10/20', field: 'RSI_TDD_10_20' },
//         { title: 'RSI FDD 2100', field: 'RSI_FDD_2100' },
//         { title: 'RSI FDD 1800', field: 'RSI_FDD_1800' },
//         { title: 'RSI L900', field: 'RSI_L900' },
//         { title: '5G RSI', field: 'RSI_5G' },
//         { title: 'GPL', field: 'GPL' },
//         { title: 'Pre/Post Check', field: 'Pre_Post_Check' },
//         { title: 'CRQ', field: 'CRQ' },
//         { title: 'Customer Approval', field: 'Customer_Approval' },
//         { title: 'FR Date.', field: 'FR_Date' },
//         { title: '4G HOTO Offered Date.', field: 'HOTO_Offered_Date_4g' },
//         { title: '4G HOTO Accepted Date.', field: 'HOTO_Accepted_Date_4g' },
//         { title: '2G HOTO Offered Date.', field: 'HOTO_Offered_Date_2g' },
//         { title: '2G HOTO Accepted Date.', field: 'HOTO_Accepted_Date_2g' },
//     ]
//     // handleExport Range wise table in excel formet.........
//     const handleExport = () => {
//         var csvBuilder = new CsvBuilder(`VI_Range_Wise_Integration_Tracker.csv`)
//             .setColumns(columnData.map(item => item.title))
//             .addRows(fullData?.map(row => columnData.map(col => row[col.field])))
//             .exportFile();
//     }

//     // ********** Filter Dialog Box **********//
//     const filterDialog = useCallback(() => {
//         return (
//             <Dialog
//                 open={open}
//                 // onClose={handleClose}
//                 keepMounted
//                 fullWidth
//                 maxWidth={'md'}
//                 style={{ zIndex: 5 }}
//             >
//                 <DialogTitle>Cell Name Table <span style={{ float: 'right' }}><IconButton size="large" onClick={handleClose}><CloseIcon /></IconButton></span></DialogTitle>

//                 <DialogContent >
//                     <TableContainer sx={{ maxHeight: 450, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

//                         <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

//                             <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                                 <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
//                                     <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Circle</th>
//                                     <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Short Name</th>
//                                     <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{mainDataT2?.current_date}</th>
//                                     <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{mainDataT2?.previous_date}</th>
//                                     <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Site Priority</th>
//                                     <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Delta</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {mainDataT2?.data?.map((item) => (
//                                     <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
//                                         <th>{item.Circle}</th>
//                                         <th>{item.Short_name}</th>
//                                         <th>{item.current_date}</th>
//                                         <th>{item.previous_date}</th>
//                                         <th>{item.del_value.toUpperCase()}</th>
//                                         <th>{item.delta}</th>
//                                     </tr>
//                                 ))}
//                             </tbody>


//                         </table>
//                     </TableContainer>

//                 </DialogContent>
//             </Dialog>
//         )
//     }, [mainDataT2, open])

//     const ClickDataGet = async (props) => {
//         action(true)
//         var formData = new FormData();
//         formData.append("circle", props.circle);
//         formData.append("Activity_Name", props.activity);
//         formData.append("from_date", fromDate);
//         formData.append("to_date", toDate);
//         const responce = await makePostRequest('ix_tracker_vi/hyperlink-date-range-integration-data/', formData)
//         if (responce) {
//             // console.log('responce', responce)
//             // setMainDataT2(responce)
//             action(false)
//             setEncreptedData("integration_final_tracker", responce.data);
//             // console.log('response data in huawia site id' , response)
//             window.open(`${window.location.href}/${props.activity}`, "_blank")
//             // setOpen(true)
//         }
//         else {
//             action(false)
//         }
//     }

//     const handleDate = async (date) => {
//         await setToDate(date)

//     }


//     const ChangeDateFormate = (dates) => {
//         const [year, month, day] = dates.split('-');
//         return `${day}-${month}-${year}`;
//     }

//     useEffect(() => {
//         fetchRangeWiseDashboard()
//     }, [fromDate, toDate, dashboardType])


//     return (
//         <>
//             <style>{"th{border:1px solid black;}"}</style>
//             <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
//                 <div style={{ margin: 20 }}>
//                     {/* <div style={{ margin: 5, marginLeft: 10 }}>
//                 <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" href='/tools'>Tools</Link>

//                     <Link underline="hover" href='/tools/Integration'>Integration</Link>
//                     <Typography color='text.primary'>Dashboard</Typography>
//                 </Breadcrumbs>
//             </div>
//             <div style={{ height: 'auto', width: '100%', margin: '5px 0px', border: '1px solid black', borderRadius: '10px', padding: '2px', display: 'flex' }}>
//                 <Grid container spacing={1}>
//                     <Grid item xs={10} style={{ display: "flex" }}>
//                         <Box >

//                         </Box>

//                     </Grid>
//                     <Grid item xs={2}>
//                         <Box style={{ float: 'right' }}>
//                             <Tooltip title="Export Excel">
//                                 <IconButton onClick={() => { handleExport(); }}>
//                                     <DownloadIcon fontSize='large' color='primary' />
//                                 </IconButton>
//                             </Tooltip>
//                         </Box>
//                     </Grid>
//                 </Grid>

//             </div> */}

//                     {/* ************* 2G  TABLE DATA ************** */}
//                     <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
//                         <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
//                             Range Wise {dashboardType === 'Integration_Date' ? 'Integration' : dashboardType === 'HOTO_Accepted_Date_4g' ? 'HOTO Accepted 4G' : dashboardType === 'HOTO_Accepted_Date_2g' ? 'HOTO Accepted 2G' : dashboardType === 'HOTO_Offered_Date_4g' ? 'HOTO Offered 4G' : dashboardType === 'HOTO_Offered_Date_2g' ? 'HOTO Offered 2G' : 'FR Date'} Site Count
//                         </Box>
//                         <Box>
//                             {/* <LocalizationProvider dateAdapter={AdapterDayjs} >
//                                 <DatePicker
//                                     value={givenDate}
//                                     onChange={handleDate}
//                                 />
//                             </LocalizationProvider> */}
//                             <FormControl whiteSpace='nowrap' size='small' sx={{ minWidth: 150, marginRight: 2 }}>
//                                 <InputLabel id="demo-simple-select-label">Dashboard Type</InputLabel>
//                                 <Select
//                                     labelId="demo-simple-select-label"
//                                     id="demo-simple-select"
//                                     value={dashboardType}
//                                     label="Dashboard Type"
//                                     size='small'
//                                     onChange={(e)=> setDashboardType(e.target.value)}
//                                 >
//                                     <MenuItem value={'Integration_Date'}>Integration</MenuItem>
//                                     <MenuItem value={'HOTO_Accepted_Date_4g'}>HOTO Accepted 4G</MenuItem>
//                                     <MenuItem value={'HOTO_Accepted_Date_2g'}>HOTO Accepted 2G</MenuItem>
//                                     <MenuItem value={'HOTO_Offered_Date_4g'}>HOTO Offered 4G</MenuItem>
//                                     <MenuItem value={'HOTO_Offered_Date_2g'}>HOTO Offered 2G</MenuItem>
//                                     <MenuItem value={'FR_Date'}>FR Date</MenuItem>
//                                 </Select>
//                             </FormControl>  
//                             <TextField
//                                 size='small'
//                                 value={fromDate}
//                                 onChange={(e) => { setFromDate(e.target.value) }}
//                                 type='date'
//                                 label="From Date"
//                                 variant="outlined"
//                                 InputProps={{
//                                     startAdornment: <InputAdornment position="start"> </InputAdornment>,
//                                 }} />~
//                             <TextField
//                                 size='small'
//                                 value={toDate}
//                                 onChange={(e) => { handleDate(e.target.value) }}
//                                 type='date'
//                                 label="To Date"
//                                 variant="outlined"
//                                 InputProps={{
//                                     startAdornment: <InputAdornment position="start"> </InputAdornment>,
//                                 }} />

//                             <Tooltip title="Download Integration Records">
//                                 <IconButton onClick={() => { handleExport(); }}>
//                                     <DownloadIcon fontSize='large' color='primary' />
//                                 </IconButton>
//                             </Tooltip>
//                         </Box>
//                     </Box>

//                     <Box sx={{ marginTop: 0 }}>
//                         <TableContainer sx={{ maxHeight: 550, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
//                             <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
//                                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                                     <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
//                                         <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#223354' }}>CIRCLE</th>
//                                         <th colSpan='26' style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#2F75B5' }}>{ChangeDateFormate(fromDate)} to {ChangeDateFormate(toDate)}</th>
//                                     </tr>
//                                     <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
//                                         {activityArray.map((item, index) => (
//                                             <th key={index} style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>{item}</th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {tableData?.map((it, index) => {
//                                         return (
//                                             <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
//                                                 <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: 'rgb(197 214 246)', color: 'black' }}>{it?.cir}</th>
//                                                 {/* <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'DE-GROW' })}>{it?.D1_DE_GROW}</th> */}
//                                                 <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'MACRO' })}>{it?.D1_MACRO}</th>
//                                                 {/* <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'OTHERS' })}>{it?.D1_OTHERS}</th> */}
//                                                 <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'RELOCATION' })}>{it?.D1_RELOCATION}</th>
//                                                 {/* <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'RET' })}>{it?.D1_RET}</th> */}
//                                                 <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'ULS_HPSC' })}>{it?.D1_ULS_HPSC}</th>
//                                                 <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'UPGRADE' })}>{it?.D1_UPGRADE}</th>
//                                                 {/* <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'FEMTO' })}>{it?.D1_FEMTO}</th> */}
//                                                 {/* <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'HT INCREMENT' })}>{it?.D1_HT_INCREMENT}</th> */}
//                                                 {/* <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'IBS' })}>{it?.D1_IBS}</th> */}
//                                                 {/* <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'IDSC' })}>{it?.D1_IDSC}</th> */}
//                                                 {/* <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'ODSC' })}>{it?.D1_ODSC}</th> */}
//                                                 {/* <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'RECTIFICATION' })}>{it?.D1_RECTIFICATION}</th> */}
//                                                 {/* <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'OPERATIONS' })}>{it?.D1_OPERATIONS}</th> */}
//                                                 <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'RRU UPGRADE' })}>{it?.D1_RRU_UPGRADE}</th>
//                                                 {/* <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: '5G BW UPGRADE' })}>{it?.D1_5G_BW_UPGRADE}</th> */}
//                                                 {/* <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: '5G RRU SWAP' })}>{it?.D1_5G_RRU_SWAP}</th> */}
//                                                 <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: '5G SECTOR ADDITION' })}>{it?.D1_5G_SECTOR_ADDITION}</th>
//                                                 <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: '5G RELOCATION' })}>{it?.D1_5G_RELOCATION}</th>
//                                                 {/* <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'TRAFFIC SHIFTING' })}>{it?.D1_TRAFFIC_SHIFTING}</th> */}
//                                                 <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'RRU SWAP' })}>{it?.D1_RRU_SWAP}</th>
//                                                 <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'FR_Date' })}>{it?.FR_Date_Count}</th>
//                                                 <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'HOTO_Offered_2g' })}>{it?.HOTO_Offered_2g_Count}</th>
//                                                 <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'HOTO_Accepted_2g' })}>{it?.HOTO_Accepted_2g_Count}</th>
//                                                 <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'HOTO_Offered_4g' })}>{it?.HOTO_Offered_4g_Count}</th>
//                                                 <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'HOTO_Accepted_4g' })}>{it?.HOTO_Accepted_4g_Count}</th>

//                                             </tr>
//                                         )
//                                     }
//                                     )}
//                                     <tr style={{ textAlign: "center", fontWeigth: 700, backgroundColor: '#B0EBB4', color: '#000000', fontSize: 17 }}>
//                                         <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#B0EBB4' }}>Total</th>
//                                         {totals && Object.keys(totals).map((key) => (
//                                             <th key={key}>{totals[key]}</th>
//                                         ))}
//                                     </tr>

//                                 </tbody>
//                             </table>
//                         </TableContainer>
//                     </Box>

//                 </div>
//             </Slide>
//             {/* {filterDialog()} */}
//             {loading}
//         </>
//     )
// }

// export const MemoRangeWiseDashboard = React.memo(RangeWiseDashboard)


import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { CsvBuilder } from 'filefy';
import { useGet } from '../../../Hooks/GetApis';
import { usePost } from '../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useStyles } from '../../ToolsCss'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { setEncreptedData } from '../../../utils/localstorage';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// ✅ Today's date in YYYY-MM-DD for max date restriction
const todayStr = new Date().toISOString().split('T')[0];

const RangeWiseDashboard = ({ onData }) => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const { response, makeGetRequest } = useGet()
    const { makePostRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const [mainDataT2, setMainDataT2] = useState([])
    const [dateArray, setDateArray] = useState([])
    const [tableData, setTableData] = useState([])
    const [dashboardType, setDashboardType] = useState('Integration_Date')
    const [givenDate, setGivenDate] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [fullData, setFullData] = useState([])

    // ✅ DE-GROW re-enabled
    const activityArray = ['DE-GROW', 'MACRO', 'RELOCATION', 'ULS-HPSC', 'UPGRADE', 'RRU UPGRADE', '5G SECTOR ADDITION', '5G RELOCATION', 'RRU SWAP', 'FR COUNT', '2G HOTO OFFERED COUNT', '2G HOTO ACCEPTED COUNT', '4G HOTO OFFERED COUNT', '4G HOTO ACCEPTED COUNT']

    const fetchRangeWiseDashboard = async () => {
        action(true)
        var formData = new FormData()
        formData.append('from_date', fromDate)
        formData.append('to_date', toDate)
        formData.append('dashboard_type', dashboardType)
        const res = await makePostRequest("ix_tracker_vi/date-range-integration-data/", formData);
        if (res) {
            action(false)
            setFromDate(res.date_range[0])
            setToDate(res.date_range[1])
            setTableData(JSON.parse(res.table_data))
            setFullData(res.download_data)
            onData(res);
            return res;
        }
        else {
            action(false)
        }
    }

    const calculateColumnTotals = (datass) => {
        const totals = {
            D1_DE_GROW: 0,           // ✅ Enabled
            D1_MACRO: 0,
            D1_RELOCATION: 0,
            D1_ULS_HPSC: 0,
            D1_UPGRADE: 0,
            D1_RRU_UPGRADE: 0,
            D1_5G_SECTOR_ADDITION: 0,
            D1_5G_RELOCATION: 0,
            D1_RRU_SWAP: 0,
            FR_Date_Count: 0,
            HOTO_Offered_2g_Count: 0,
            HOTO_Accepted_2g_Count: 0,
            HOTO_Offered_4g_Count: 0,
            HOTO_Accepted_4g_Count: 0,
        };

        datass.forEach(item => {
            for (let key in totals) {
                totals[key] += Number(item[key]) || 0;
            }
        });

        return totals;
    };

    const totals = calculateColumnTotals(tableData);

    const ShortDate = (dates) => {
        const dateObjects = dates.map(dateStr => new Date(dateStr));
        dateObjects.sort((a, b) => a - b);
        const sortedDates = dateObjects.map(date => date.toISOString().split('T')[0]);
        setDateArray(sortedDates)
    }

    const handleClose = () => {
        setOpen(false)
    }

    // ✅ Helper: only fire click if value is non-zero
    const handleCellClick = (value, clickParams) => {
        const numVal = Number(value) || 0;
        if (numVal === 0) return;
        ClickDataGet(clickParams);
    }

    // ✅ Helper: dim + no-pointer cursor when value is 0
    const cellStyle = (value) => {
        const numVal = Number(value) || 0;
        return {
            cursor: numVal === 0 ? 'not-allowed' : 'pointer',
            opacity: numVal === 0 ? 0.4 : 1,
        };
    }

    // Download Key and value
    const columnData = [
        { title: 'Unique Key', field: 'unique_key' },
        { title: 'OEM', field: 'OEM' },
        { title: 'Integration Date', field: 'Integration_Date' },
        { title: 'CIRCLE', field: 'CIRCLE' },
        { title: 'Activity Name', field: 'Activity_Name' },
        { title: 'Site ID', field: 'Site_ID' },
        { title: 'MO NAME', field: 'MO_NAME' },
        { title: 'LNBTS ID', field: 'LNBTS_ID' },
        { title: 'Technology (SIWA)', field: 'Technology_SIWA' },
        { title: 'Configuration 5G', field: 'Configuration_5G' },
        { title: 'OSS Details', field: 'OSS_Details' },
        { title: 'Cell ID', field: 'Cell_ID' },
        { title: 'CELL COUNT', field: 'CELL_COUNT' },
        { title: 'BSC NAME', field: 'BSC_NAME' },
        { title: 'BCF', field: 'BCF' },
        { title: 'TRX Count', field: 'TRX_Count' },
        { title: 'PRE ALARM', field: 'PRE_ALARM' },
        { title: 'GPS IP CLK', field: 'GPS_IP_CLK' },
        { title: 'RET', field: 'RET' },
        { title: 'POST VSWR', field: 'POST_VSWR' },
        { title: 'POST Alarms', field: 'POST_Alarms' },
        { title: 'Activity Mode (SA/NSA)', field: 'Activity_Mode' },
        { title: 'Activity Type (SIWA)', field: 'Activity_Type_SIWA' },
        { title: 'Band (SIWA)', field: 'Band_SIWA' },
        { title: 'CELL STATUS', field: 'CELL_STATUS' },
        { title: 'CTR STATUS', field: 'CTR_STATUS' },
        { title: 'Integration Remark', field: 'Integration_Remark' },
        { title: 'T2T4R', field: 'T2T4R' },
        { title: 'BBU TYPE', field: 'BBU_TYPE' },
        { title: 'BB CARD', field: 'BB_CARD' },
        { title: 'RRU Type', field: 'RRU_Type' },
        { title: 'Media Status', field: 'Media_Status' },
        { title: 'Mplane IP', field: 'Mplane_IP' },
        { title: 'SCF PREPARED_BY', field: 'SCF_PREPARED_BY' },
        { title: 'SITE INTEGRATE_BY', field: 'SITE_INTEGRATE_BY' },
        { title: 'Site Status', field: 'Site_Status' },
        { title: 'External Alarm Confirmation', field: 'External_Alarm_Confirmation' },
        { title: 'SOFT AT STATUS', field: 'SOFT_AT_STATUS' },
        { title: 'LICENCE Status', field: 'LICENCE_Status' },
        { title: 'ESN NO', field: 'ESN_NO' },
        { title: 'Responsibility_for_alarm_clearance', field: 'Responsibility_for_alarm_clearance' },
        { title: 'TAC', field: 'TAC' },
        { title: 'PCI TDD 20', field: 'PCI_TDD_20' },
        { title: 'PCI TDD 10/20', field: 'PCI_TDD_10_20' },
        { title: 'PCI FDD 2100', field: 'PCI_FDD_2100' },
        { title: 'PCI FDD 1800', field: 'PCI_FDD_1800' },
        { title: 'PCI L900', field: 'PCI_L900' },
        { title: '5G PCI', field: 'PCI_5G' },
        { title: 'RSI TDD 20', field: 'RSI_TDD_20' },
        { title: 'RSI TDD 10/20', field: 'RSI_TDD_10_20' },
        { title: 'RSI FDD 2100', field: 'RSI_FDD_2100' },
        { title: 'RSI FDD 1800', field: 'RSI_FDD_1800' },
        { title: 'RSI L900', field: 'RSI_L900' },
        { title: '5G RSI', field: 'RSI_5G' },
        { title: 'GPL', field: 'GPL' },
        { title: 'Pre/Post Check', field: 'Pre_Post_Check' },
        { title: 'CRQ', field: 'CRQ' },
        { title: 'Customer Approval', field: 'Customer_Approval' },
        { title: 'FR Date.', field: 'FR_Date' },
        { title: '4G HOTO Offered Date.', field: 'HOTO_Offered_Date_4g' },
        { title: '4G HOTO Accepted Date.', field: 'HOTO_Accepted_Date_4g' },
        { title: '2G HOTO Offered Date.', field: 'HOTO_Offered_Date_2g' },
        { title: '2G HOTO Accepted Date.', field: 'HOTO_Accepted_Date_2g' },
    ]

    const handleExport = () => {
        var csvBuilder = new CsvBuilder(`VI_Range_Wise_Integration_Tracker.csv`)
            .setColumns(columnData.map(item => item.title))
            .addRows(fullData?.map(row => columnData.map(col => row[col.field])))
            .exportFile();
    }

    const filterDialog = useCallback(() => {
        return (
            <Dialog open={open} keepMounted fullWidth maxWidth={'md'} style={{ zIndex: 5 }}>
                <DialogTitle>Cell Name Table <span style={{ float: 'right' }}><IconButton size="large" onClick={handleClose}><CloseIcon /></IconButton></span></DialogTitle>
                <DialogContent>
                    <TableContainer sx={{ maxHeight: 450, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }}>
                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Circle</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Short Name</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{mainDataT2?.current_date}</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{mainDataT2?.previous_date}</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Site Priority</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Delta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mainDataT2?.data?.map((item) => (
                                    <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                        <th>{item.Circle}</th>
                                        <th>{item.Short_name}</th>
                                        <th>{item.current_date}</th>
                                        <th>{item.previous_date}</th>
                                        <th>{item.del_value.toUpperCase()}</th>
                                        <th>{item.delta}</th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        )
    }, [mainDataT2, open])

    const ClickDataGet = async (props) => {
        action(true)
        var formData = new FormData();
        formData.append("circle", props.circle);
        formData.append("Activity_Name", props.activity);
        formData.append("from_date", fromDate);
        formData.append("to_date", toDate);
        const responce = await makePostRequest('ix_tracker_vi/hyperlink-date-range-integration-data/', formData)
        if (responce) {
            action(false)
            setEncreptedData("integration_final_tracker", responce.data);
            window.open(`${window.location.href}/${props.activity}`, "_blank")
        }
        else {
            action(false)
        }
    }

    // ✅ Prevent future "To Date"
    const handleDate = async (date) => {
        if (date > todayStr) return;   // silently block future dates
        await setToDate(date)
    }

    // ✅ Prevent future "From Date"
    const handleFromDate = (date) => {
        if (date > todayStr) return;
        setFromDate(date);
    }

    const ChangeDateFormate = (dates) => {
        if (!dates) return '';
        const [year, month, day] = dates.split('-');
        return `${day}-${month}-${year}`;
    }

    useEffect(() => {
        fetchRangeWiseDashboard()
    }, [fromDate, toDate, dashboardType])

    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>

                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            Range Wise {dashboardType === 'Integration_Date' ? 'Integration' : dashboardType === 'HOTO_Accepted_Date_4g' ? 'HOTO Accepted 4G' : dashboardType === 'HOTO_Accepted_Date_2g' ? 'HOTO Accepted 2G' : dashboardType === 'HOTO_Offered_Date_4g' ? 'HOTO Offered 4G' : dashboardType === 'HOTO_Offered_Date_2g' ? 'HOTO Offered 2G' : 'FR Date'} Site Count
                        </Box>
                        <Box>
                            <FormControl whiteSpace='nowrap' size='small' sx={{ minWidth: 150, marginRight: 2 }}>
                                <InputLabel id="demo-simple-select-label">Dashboard Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={dashboardType}
                                    label="Dashboard Type"
                                    size='small'
                                    onChange={(e) => setDashboardType(e.target.value)}
                                >
                                    <MenuItem value={'Integration_Date'}>Integration</MenuItem>
                                    <MenuItem value={'HOTO_Accepted_Date_4g'}>HOTO Accepted 4G</MenuItem>
                                    <MenuItem value={'HOTO_Accepted_Date_2g'}>HOTO Accepted 2G</MenuItem>
                                    <MenuItem value={'HOTO_Offered_Date_4g'}>HOTO Offered 4G</MenuItem>
                                    <MenuItem value={'HOTO_Offered_Date_2g'}>HOTO Offered 2G</MenuItem>
                                    <MenuItem value={'FR_Date'}>FR Date</MenuItem>
                                </Select>
                            </FormControl>

                            {/* ✅ max={todayStr} blocks future dates in both pickers */}
                            <TextField
                                size='small'
                                value={fromDate}
                                onChange={(e) => handleFromDate(e.target.value)}
                                type='date'
                                label="From Date"
                                variant="outlined"
                                inputProps={{ max: todayStr }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"> </InputAdornment>,
                                }} />~
                            <TextField
                                size='small'
                                value={toDate}
                                onChange={(e) => handleDate(e.target.value)}
                                type='date'
                                label="To Date"
                                variant="outlined"
                                inputProps={{ max: todayStr }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"> </InputAdornment>,
                                }} />

                            <Tooltip title="Download Integration Records">
                                <IconButton onClick={() => { handleExport(); }}>
                                    <DownloadIcon fontSize='large' color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box sx={{ marginTop: 0 }}>
                        <TableContainer sx={{ maxHeight: 550, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }}>
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#223354' }}>CIRCLE</th>
                                        {/* ✅ colSpan bumped from 13→14 to accommodate DE-GROW */}
                                        <th colSpan='14' style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#2F75B5' }}>{ChangeDateFormate(fromDate)} to {ChangeDateFormate(toDate)}</th>
                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        {activityArray.map((item, index) => (
                                            <th key={index} style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>{item}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.map((it, index) => {
                                        return (
                                            <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: 'rgb(197 214 246)', color: 'black' }}>{it?.cir}</th>

                                                {/* ✅ DE-GROW — clickable only when > 0 */}
                                                <th className={classes.hover} style={cellStyle(it?.D1_DE_GROW)} onClick={() => handleCellClick(it?.D1_DE_GROW, { circle: it?.cir, activity: 'DE-GROW' })}>{it?.D1_DE_GROW}</th>

                                                <th className={classes.hover} style={cellStyle(it?.D1_MACRO)} onClick={() => handleCellClick(it?.D1_MACRO, { circle: it?.cir, activity: 'MACRO' })}>{it?.D1_MACRO}</th>
                                                <th className={classes.hover} style={cellStyle(it?.D1_RELOCATION)} onClick={() => handleCellClick(it?.D1_RELOCATION, { circle: it?.cir, activity: 'RELOCATION' })}>{it?.D1_RELOCATION}</th>
                                                <th className={classes.hover} style={cellStyle(it?.D1_ULS_HPSC)} onClick={() => handleCellClick(it?.D1_ULS_HPSC, { circle: it?.cir, activity: 'ULS_HPSC' })}>{it?.D1_ULS_HPSC}</th>
                                                <th className={classes.hover} style={cellStyle(it?.D1_UPGRADE)} onClick={() => handleCellClick(it?.D1_UPGRADE, { circle: it?.cir, activity: 'UPGRADE' })}>{it?.D1_UPGRADE}</th>
                                                <th className={classes.hover} style={cellStyle(it?.D1_RRU_UPGRADE)} onClick={() => handleCellClick(it?.D1_RRU_UPGRADE, { circle: it?.cir, activity: 'RRU UPGRADE' })}>{it?.D1_RRU_UPGRADE}</th>
                                                <th className={classes.hover} style={cellStyle(it?.D1_5G_SECTOR_ADDITION)} onClick={() => handleCellClick(it?.D1_5G_SECTOR_ADDITION, { circle: it?.cir, activity: '5G SECTOR ADDITION' })}>{it?.D1_5G_SECTOR_ADDITION}</th>
                                                <th className={classes.hover} style={cellStyle(it?.D1_5G_RELOCATION)} onClick={() => handleCellClick(it?.D1_5G_RELOCATION, { circle: it?.cir, activity: '5G RELOCATION' })}>{it?.D1_5G_RELOCATION}</th>
                                                <th className={classes.hover} style={cellStyle(it?.D1_RRU_SWAP)} onClick={() => handleCellClick(it?.D1_RRU_SWAP, { circle: it?.cir, activity: 'RRU SWAP' })}>{it?.D1_RRU_SWAP}</th>
                                                <th className={classes.hover} style={cellStyle(it?.FR_Date_Count)} onClick={() => handleCellClick(it?.FR_Date_Count, { circle: it?.cir, activity: 'FR_Date' })}>{it?.FR_Date_Count}</th>
                                                <th className={classes.hover} style={cellStyle(it?.HOTO_Offered_2g_Count)} onClick={() => handleCellClick(it?.HOTO_Offered_2g_Count, { circle: it?.cir, activity: 'HOTO_Offered_2g' })}>{it?.HOTO_Offered_2g_Count}</th>
                                                <th className={classes.hover} style={cellStyle(it?.HOTO_Accepted_2g_Count)} onClick={() => handleCellClick(it?.HOTO_Accepted_2g_Count, { circle: it?.cir, activity: 'HOTO_Accepted_2g' })}>{it?.HOTO_Accepted_2g_Count}</th>
                                                <th className={classes.hover} style={cellStyle(it?.HOTO_Offered_4g_Count)} onClick={() => handleCellClick(it?.HOTO_Offered_4g_Count, { circle: it?.cir, activity: 'HOTO_Offered_4g' })}>{it?.HOTO_Offered_4g_Count}</th>
                                                <th className={classes.hover} style={cellStyle(it?.HOTO_Accepted_4g_Count)} onClick={() => handleCellClick(it?.HOTO_Accepted_4g_Count, { circle: it?.cir, activity: 'HOTO_Accepted_4g' })}>{it?.HOTO_Accepted_4g_Count}</th>
                                            </tr>
                                        )
                                    })}
                                    <tr style={{ textAlign: "center", fontWeigth: 700, backgroundColor: '#B0EBB4', color: '#000000', fontSize: 17 }}>
                                        <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#B0EBB4' }}>Total</th>
                                        {totals && Object.keys(totals).map((key) => (
                                            <th key={key}>{totals[key]}</th>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </TableContainer>
                    </Box>

                </div>
            </Slide>
            {loading}
        </>
    )
}

export const MemoRangeWiseDashboard = React.memo(RangeWiseDashboard)