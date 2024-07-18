import React, { useState, useEffect } from 'react';
import { Box, Grid, Stack } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DownloadIcon from '@mui/icons-material/Download';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import DialogActions from '@mui/material/DialogActions';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PublishIcon from '@mui/icons-material/Publish';
import * as ExcelJS from 'exceljs'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { getData, postData } from './../../../../services/FetchNodeServices'
import Slide from '@mui/material/Slide';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useStyles } from './../../../ToolsCss'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

const RangeWise = () => {

    const [rangeData, setRangeData] = useState([]);
    const [open, setOpen] = useState(false)
    const [displayFilterData, setDisplayFilterData] = useState('OverAll Data Up Till :')
    const [remarkData, setRemarkData] = useState([])
    const [showRemarkTable, setShowRemarkTable] = useState(false)
    const [range, setRange] = useState()
    // ******* FILTER CIRCLE, OEM, SITE ID DATA*********
    const [oem, setOem] = useState([])
    const [circle, setCircle] = useState([])
    const [siteId, setSiteId] = useState([])
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')

    const [selectCircle, setSelectCircle] = useState([]);
    const [selectSiteId, setSelectSiteId] = useState([]);
    const [selectOEM, setSelectOEM] = useState([]);

    const classes = useStyles()

    // console.log('loop data', toDate, fromDate)


    // ########### Handle CIRCLE table filter  ###########
    const handleCircle = (event: SelectChangeEvent<typeof selectCircle>) => {
        const {
            target: { value },
        } = event;
        setSelectCircle(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    // ########### HANDLE SITE ID TABLE FILTERE ##########
    const handleSiteId = (event: SelectChangeEvent<typeof selectSiteId>) => {
        const {
            target: { value },
        } = event;
        setSelectSiteId(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    // ########### HANDLE OEM TABLE FILTERE ##########
    const handleOemData = (event: SelectChangeEvent<typeof selectOEM>) => {
        const {
            target: { value },
        } = event;
        setSelectOEM(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const formatDateTime = (inputDateTime) => {
        // Parse input string to create a Date object
        const dateTime = new Date(inputDateTime);

        // Get components of the date and time
        const day = dateTime.getDate();
        const month = dateTime.getMonth() + 1; // Months are zero-based
        const year = dateTime.getFullYear(); // Get last two digits of the year
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours to 12-hour format
        const formattedHours = hours % 12 || 12;

        // Add leading zeros to single-digit day, month, and minutes
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

        // Construct the formatted string
        const formattedDateTime = `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes} ${ampm}`;

        return formattedDateTime;
    }
    function formatDate(dates) {

        const date = new Date(dates);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    }



    const fetchRangeData = async () => {
        var formData = new FormData();
        formData.append('from_date', fromDate)
        formData.append('to_date', toDate)
        const responce = await postData('UBR_Soft_Phy_AT/range_wise_rejected_site_count', formData)
        // console.log('aaaaaaaaaa',responce)

        console.log('get data', responce)
        if (responce) {
            setShowRemarkTable(false)
            var date = new Date(responce.min_time_date).toLocaleString('en', { timeZone: 'UTC' })
            var date1 = new Date(responce.max_time_date).toLocaleString('en', { timeZone: 'UTC' })
            console.log('today', date, date1)

            setRangeData(JSON.parse(responce.table_data))
            if (fromDate.length > 0 && toDate.length > 0) {
                setDisplayFilterData('From :' + '(' + formatDateTime(fromDate) + ')' + '  To :' + '(' + formatDateTime(toDate) + ')')
            }
            else {
                setDisplayFilterData('From: ' + '(' + formatDate(date) + ')' + ' To: ' + '(' + formatDate(date1) + ')')

            }
        }
    }

    const rangeWiseData = async (data) => {
        setShowRemarkTable(false)
        setRange(data.range)
        var formData = new FormData();
        formData.append('from_date', fromDate)
        formData.append('to_date', toDate)
        formData.append('range', data.range)
        const responce1 = await postData('UBR_Soft_Phy_AT/range_wise_rejected_remark', formData)


        console.log('aaaaa', JSON.parse(responce1))
        if (responce1) {
            const tempOemData = JSON.parse(responce1)
            setRemarkData(tempOemData)
            setShowRemarkTable(true)


            var Doem = []
            var Dcircle = []
            var Dsiteid = []

            tempOemData?.map((item) => {
                Doem.push(item.oem)
                Dcircle.push(item.Circle)
                Dsiteid.push(item.Site_ID)
            })
            setOem([...new Set(Doem)])
            setCircle([...new Set(Dcircle)])
            setSiteId([...new Set(Dsiteid)])


        }

    }


    // handleExport Range wise table in excel formet.........
    const handleExport = () => {

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("RANGE WISE", { properties: { tabColor: { argb: 'f1948a' } } })
        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';


        sheet.columns = [
            { header: 'Range', key: 'range', width: 20 },
            { header: 'Rejected Site Count', key: 'rejected_site_count', width: 20 },

        ]


        rangeData?.map((item) => {
            sheet.addRow({
                range: item?.range,
                rejected_site_count: item?.rejected_site_count,
            })
        })


        ///__________ STYLING IN EXCEL TABLE ______________ ///
        sheet.eachRow((row, rowNumber) => {
            const rows = sheet.getColumn(1);
            const rowsCount = rows['_worksheet']['_rows'].length;
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
                // if (rowNumber === rowsCount) {
                //     cell.fill = {
                //         type: 'pattern',
                //         pattern: 'solid',
                //         fgColor: { argb: 'FE9209' }
                //     }
                //     cell.font = {
                //         color: { argb: 'FFFFFF' },
                //         bold: true,
                //         size: 13,
                //     }
                // }
                if (rowNumber == 1) {
                    // First set the background of header row
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '223354' }
                    }
                    cell.font = {
                        color: { argb: 'FFFFFF' },
                        bold: true,
                        size: 13,
                    }
                    cell.views = [{ state: 'frozen', ySplit: 1 }]
                }
            })
        })

        workbook.xlsx.writeBuffer().then(item => {
            const blob = new Blob([item], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
            })
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = "RANGE_WISE.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }


    // handleExport Range wise Remark table in excel formet.........
    const handleExport1 = () => {

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(`RANGE ${range} WISE`, { properties: { tabColor: { argb: 'f1948a' } } })
        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';


        sheet.columns = [
            { header: 'OEM', key: 'oem', width: 15 },
            { header: 'Circle', key: 'Circle', width: 15 },
            { header: 'Site ID', key: 'Site_ID', width: 15 },
            { header: 'Ageing', key: 'ageing', width: 15 },
            { header: 'Rejection Count', key: 'repetition_count', width: 15 },
            { header: 'Remark 1', key: 'r1', width: 15 },
            { header: 'Remark 2', key: 'r2', width: 15 },
            { header: 'Remark 3', key: 'r3', width: 15 },
            { header: 'Remark 4', key: 'r4', width: 15 },
            { header: 'Remark 5', key: 'r5', width: 15 },
            { header: 'Remark 6', key: 'r6', width: 15 },
            { header: 'Remark 7', key: 'r7', width: 15 },
            { header: 'Remark 8', key: 'r8', width: 15 },
            { header: 'Remark 9', key: 'r9', width: 15 },
            { header: 'Remark 10', key: 'r10', width: 15 },
            { header: 'Remark 11', key: 'r11', width: 15 },
            { header: 'Remark 12', key: 'r12', width: 15 },
            { header: 'Remark 13', key: 'r13', width: 15 },
            { header: 'Remark 14', key: 'r14', width: 15 },
            { header: 'Remark 15', key: 'r15', width: 15 },



        ]


        remarkData?.map((item) => {
            sheet.addRow({
                oem: item?.oem,
                Circle: item?.Circle,
                Site_ID: item?.Site_ID,
                ageing: item?.ageing,
                repetition_count: item?.repetition_count,
                r1: item?.r1,
                r2: item?.r2,
                r3: item?.r3,
                r4: item?.r4,
                r5: item?.r5,
                r6: item?.r6,
                r7: item?.r7,
                r8: item?.r8,
                r9: item?.r9,
                r10: item?.r10,
                r11: item?.r11,
                r12: item?.r12,
                r13: item?.r13,
                r14: item?.r14,
                r15: item?.r15


            })
        })


        ///__________ STYLING IN EXCEL TABLE ______________ ///
        sheet.eachRow((row, rowNumber) => {
            const rows = sheet.getColumn(1);
            const rowsCount = rows['_worksheet']['_rows'].length;
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
                // if (rowNumber === rowsCount) {
                //     cell.fill = {
                //         type: 'pattern',
                //         pattern: 'solid',
                //         fgColor: { argb: 'FE9209' }
                //     }
                //     cell.font = {
                //         color: { argb: 'FFFFFF' },
                //         bold: true,
                //         size: 13,
                //     }
                // }
                if (rowNumber == 1) {
                    // First set the background of header row
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '223354' }
                    }
                    cell.font = {
                        color: { argb: 'FFFFFF' },
                        bold: true,
                        size: 13,
                    }
                    cell.views = [{ state: 'frozen', ySplit: 1 }]
                }
            })
        })

        workbook.xlsx.writeBuffer().then(item => {
            const blob = new Blob([item], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
            })
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `RANGE_${range}_WISE.xlsx`;
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }


    const RangeDate = async (event) => {

        var fd = new Date(event[0]),
            fmonth = '' + (fd.getMonth() + 1),
            fday = '' + fd.getDate(),
            fyear = fd.getFullYear();

        if (fmonth.length < 2)
            fmonth = '0' + fmonth;
        if (fday.length < 2)
            fday = '0' + fday;

        var td = new Date(event[1]),
            tmonth = '' + (td.getMonth() + 1),
            tday = '' + td.getDate(),
            tyear = td.getFullYear();

        if (tmonth.length < 2)
            tmonth = '0' + tmonth;
        if (tday.length < 2)
            tday = '0' + tday;

        await setFromDate([fyear, fmonth, fday].join('-'))
        await setToDate([tyear, tmonth, tday].join('-'))
    }
    const handleClose = () => {
        setOpen(false)
    }

    // ********** Handle Clear *************//
    const handleClear = () => {
        setFromDate('')
        setToDate('')
    }


    // ***********Handle Submit *************//
    const handleSubmit = () => {
        fetchRangeData();
        setOpen(false);
    }

    // date send format function .........////
    const handleDateFormat = (data) => {
        const originalDate = new Date(data);

        const formattedDate = `${originalDate.getFullYear()}-${String(originalDate.getMonth() + 1).padStart(2, '0')}-${String(originalDate.getDate()).padStart(2, '0')} ${String(originalDate.getHours()).padStart(2, '0')}:${String(originalDate.getMinutes()).padStart(2, '0')}:${String(originalDate.getSeconds()).padStart(2, '0')}`;

        return formattedDate
    }

    // ********** Filter Dialog Box **********//
    const filterDialog = () => {



        return (
            <Dialog
                open={open}
                onClose={handleClose}
                keepMounted
                style={{ zIndex: 5 }}
            >
                {/* <DialogTitle><span style={{ fontSize: 22, fontWeight: 'bold' }}><u>Filter Table</u></span></DialogTitle> */}
                <DialogContent style={{ backgroundColor: 'rgb(155, 208, 242,0.5)' }}>
                    <Stack direction='column'>

                        <Box><span style={{ fontSize: 18, fontWeight: 'bold' }}>Range Date Wise </span></Box>
                        <Box style={{ height: 'auto', width: 'auto', padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
                            <Box style={{ display: 'flex', justifyContent: 'center', placeItems: 'center', fontWeight: 'bold' }}>
                                <span>From:</span>
                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <MobileDateTimePicker value={fromDate} onChange={(e) => { setFromDate(handleDateFormat(e.$d)) }} />
                                </LocalizationProvider>
                                <span>To:</span>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDateTimePicker value={toDate} onChange={(e) => { setToDate(handleDateFormat(e.$d)) }} />
                                </LocalizationProvider>
                            </Box>


                            {/* <Box><span style={{ fontWeight: 'bold',fontSize:'16px' }}>From </span><input value={fromDate} max={todayDate} type="date" onChange={(e) => { setFromDate(e.target.value); setDate(''); setDisplayFilter('Range Date Wise:') }} style={{height:'35px',width:'150px',fontSize:'18px',border:'1px solid #eaedf0',borderRadius:5,textAlign:'center'}}/> ~ <span style={{ fontWeight: 'bold',fontSize:'16px' }}>To </span><input  value={toDate} type="date" min={fromDate}  max={todayDate} onChange={(e) => { setToDate(e.target.value); setDate('') }} style={{height:'35px',width:'150px',fontSize:'18px',border:'1px solid #eaedf0',borderRadius:5,textAlign:'center'}}/></Box> */}
                        </Box>



                    </Stack>
                </DialogContent>
                <DialogActions style={{ backgroundColor: '#B0D9F3', display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => { handleClear() }} variant='contained' color='secondary' endIcon={<DeleteOutlineIcon />}>clear</Button>
                    <Button onClick={() => { handleSubmit(); }} variant='contained' color='success' endIcon={<PublishIcon />} >submit</Button>
                    <Button onClick={handleClose} variant='contained' color='error' endIcon={<ClearIcon />}>cancel</Button>
                </DialogActions>

            </Dialog>
        )
    }

    // ************* handle filter option table in range table //////

    const filterRangeTable = () => {
        var arr = [];

        // console.log('girraj')

        if (selectOEM.length > 0 && selectCircle.length > 0 && selectSiteId.length > 0) {
            selectOEM?.map((itemes) => {
                selectCircle?.map((its) => {
                    selectSiteId?.map((it) => {
                        arr.push(remarkData?.filter((item) => (item.oem == itemes && item.Circle == its && item.Site_ID == it)))
                    })
                })
            })


        }
        else if (selectOEM.length > 0 && selectCircle.length > 0) {
            selectOEM?.map((itemes) => {
                selectCircle?.map((its) => {
                    arr.push(remarkData?.filter((item) => (item.oem == itemes && item.Circle == its)))
                })
            })


        }
        else if (selectCircle.length > 0 && selectSiteId.length > 0) {
            selectCircle?.map((its) => {
                selectSiteId?.map((it) => {
                    arr.push(remarkData?.filter((item) => (item.Circle == its && item.Site_ID == it)))
                })
            })

        }
        else if (selectOEM.length > 0 && selectSiteId.length > 0) {

            selectOEM?.map((itemes) => {
                selectSiteId?.map((it) => {
                    arr.push(remarkData?.filter((item) => (item.oem == itemes && item.Site_ID == it)))
                })
            })


        }
        else if (selectOEM.length > 0) {
            selectOEM?.map((itemes) => {
                arr.push(remarkData?.filter((item) => (item.oem == itemes)))
            })

        }
        else if (selectCircle.length > 0) {
            selectCircle?.map((its) => {
                arr.push(remarkData?.filter((item) => (item.Circle == its)))
            })

        }
        else if (selectSiteId.length > 0) {

            selectSiteId?.map((it) => {
                arr.push(remarkData?.filter((item) => (item.Site_ID == it)))
            })

        }
        else {
            return remarkData?.map((item) => {
                return (
                    <tr key={item.Site_ID} style={{ textAlign: "center", fontWeigth: 700 }}>
                        <td style={{ border: '1px solid black' }}>{item.oem}</td>
                        <td style={{ border: '1px solid black' }}>{item.Circle}</td>
                        <td style={{ border: '1px solid black' }}>{item.Site_ID}</td>
                        <td style={{ border: '1px solid black' }}>{item.ageing}</td>
                        <td style={{ border: '1px solid black' }}>{item.repetition_count}</td>
                        <td style={{ border: '1px solid black' }}>{item.r1}</td>
                        <td style={{ border: '1px solid black' }}>{item.r2}</td>
                        <td style={{ border: '1px solid black' }}>{item.r3}</td>
                        <td style={{ border: '1px solid black' }}>{item.r4}</td>
                        <td style={{ border: '1px solid black' }}>{item.r5}</td>
                        <td style={{ border: '1px solid black' }}>{item.r6}</td>
                        <td style={{ border: '1px solid black' }}>{item.r7}</td>
                        <td style={{ border: '1px solid black' }}>{item.r8}</td>
                        <td style={{ border: '1px solid black' }}>{item.r9}</td>
                        <td style={{ border: '1px solid black' }}>{item.r10}</td>
                        <td style={{ border: '1px solid black' }}>{item.r11}</td>
                        <td style={{ border: '1px solid black' }}>{item.r12}</td>
                        <td style={{ border: '1px solid black' }}>{item.r13}</td>
                        <td style={{ border: '1px solid black' }}>{item.r14}</td>
                        <td style={{ border: '1px solid black' }}>{item.r15}</td>

                    </tr>
                )
            }
            )
        }

        return arr?.map((item) =>{
           return item?.map((it)=>{
            return (
                <tr key={item.Site_ID} style={{ textAlign: "center", fontWeigth: 700 }}>
                    <td style={{ border: '1px solid black' }}>{it.oem}</td>
                    <td style={{ border: '1px solid black' }}>{it.Circle}</td>
                    <td style={{ border: '1px solid black' }}>{it.Site_ID}</td>
                    <td style={{ border: '1px solid black' }}>{it.ageing}</td>
                    <td style={{ border: '1px solid black' }}>{it.repetition_count}</td>
                    <td style={{ border: '1px solid black' }}>{it.r1}</td>
                    <td style={{ border: '1px solid black' }}>{it.r2}</td>
                    <td style={{ border: '1px solid black' }}>{it.r3}</td>
                    <td style={{ border: '1px solid black' }}>{it.r4}</td>
                    <td style={{ border: '1px solid black' }}>{it.r5}</td>
                    <td style={{ border: '1px solid black' }}>{it.r6}</td>
                    <td style={{ border: '1px solid black' }}>{it.r7}</td>
                    <td style={{ border: '1px solid black' }}>{it.r8}</td>
                    <td style={{ border: '1px solid black' }}>{it.r9}</td>
                    <td style={{ border: '1px solid black' }}>{it.r10}</td>
                    <td style={{ border: '1px solid black' }}>{it.r11}</td>
                    <td style={{ border: '1px solid black' }}>{it.r12}</td>
                    <td style={{ border: '1px solid black' }}>{it.r13}</td>
                    <td style={{ border: '1px solid black' }}>{it.r14}</td>
                    <td style={{ border: '1px solid black' }}>{it.r15}</td>

                </tr>
            )
            })
        })}


    useEffect(() => {
        fetchRangeData();
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])


    return (
        <>

            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>
                    <div style={{ margin: 5, marginLeft: 10 }}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" href='/tools'>Tools</Link>
                            <Link underline="hover" href='/tools/UBR_soft_at_Tracker'>UBR Soft AT Tracker</Link>
                            <Typography color='text.primary'>Range Wise</Typography>
                        </Breadcrumbs>
                    </div>
                    <div style={{ height: 'auto', width: '100%', margin: '5px 0px', border: '1px solid black', borderRadius: '10px', padding: '2px', display: 'flex' }}>
                        <Grid container spacing={1}>
                            <Grid item xs={10} style={{ display: "flex" }}>
                                <Box >
                                    <Tooltip title="Filter list">
                                        <IconButton onClick={() => { setOpen(true) }}>
                                            <FilterAltIcon fontSize='large' color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Box style={{ marginTop: 6 }} >
                                    <span style={{ fontSize: 24, color: '#5DADE2', fontFamily: "monospace", fontWeight: 500, }}>{displayFilterData}</span>
                                </Box>
                            </Grid>
                            <Grid item xs={2}>
                                <Box style={{ float: 'right' }}>
                                    <Tooltip title="Export Excel">
                                        <IconButton onClick={() => { handleExport(); }}>
                                            <DownloadIcon fontSize='large' color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        </Grid>

                    </div>

                    {/* ************* RANGE WISE TABLE DATA ************** */}

                    <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>

                        <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                            <table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>
                                <tr>
                                    <th colspan="8" style={{ fontSize: 24, backgroundColor: "#F1948A", color: "", }}>RANGE WISE</th>
                                </tr>
                                <tr style={{ fontSize: 18, backgroundColor: "#223354", color: "white", }}>
                                    <th>Range</th>
                                    <th>Rejected Site Count</th>
                                </tr>
                                <tbody>
                                    {rangeData?.map((item) => (

                                        <tr style={{ textAlign: "center", fontSize: '18px', fontWeigth: 700 }}>
                                            <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { rangeWiseData({ range: item.range }) }} >{item.range}</td>
                                            <td style={{ border: '1px solid black' }}>{item.rejected_site_count}</td>
                                        </tr>

                                    ))}

                                </tbody>


                            </table>
                        </TableContainer>
                    </Box>
                    <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
                        <TableContainer>
                            <Table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>

                                <caption style={{ fontSize: 22, backgroundColor: "#F1948A", color: 'black', border: '1px solid black' }}>RANGE WISE</caption>

                                <Thead>

                                    <Tr style={{ color: "black" }}>
                                        <Th>Range</Th>
                                        <Th>Rejected Site Count</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {rangeData?.map((item) => (

                                        <Tr style={{ textAlign: "center", fontSize: '18px', fontWeigth: 700 }}>
                                            <Th className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { rangeWiseData({ range: item.range }) }} >{item.range}</Th>
                                            <Th style={{ border: '1px solid black' }}>{item.rejected_site_count}</Th>
                                        </Tr>

                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {/* ************* RANGE WISE REMARKE TABLE DATA ************** */}

                    <Slide direction="left" in={showRemarkTable} timeout={700} style={{ transformOrigin: '1 1 1' }} mountOnEnter unmountOnExit>
                        <Box style={{ marginTop: 10 }}>
                            <Box style={{ fontWeight: 'bolder', fontSize: '18px' }}>RANGE {range} REMARK
                            <Tooltip title="Export Excel">
                                    <IconButton onClick={() => { handleExport1(); }}>
                                        <DownloadIcon fontSize='small' color='primary' />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>

                                <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                                    <table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>
                                        <thead style={{position:'sticky',top:0,zIndex:1}}>
                                        <tr>
                                            <th colspan="20" style={{ fontSize: 24, backgroundColor: "#F1948A", color: "", }}>RANGE {range} REMARK</th>
                                        </tr>
                                        <tr style={{ fontSize: 16, backgroundColor: "#223354", color: "white" }}>
                                            {/* OEM COLAMN */}
                                            <th style={{ border: '1px solid black' }}>OEM
                                                <Select
                                                    multiple={true}
                                                    value={selectOEM}
                                                    displayEmpty

                                                    onChange={handleOemData}
                                                    renderValue={(selected) => {
                                                        if (selected.length === 0) {
                                                            return <em>All</em>;
                                                        }
                                                        // return selected.join(', ');
                                                    }}
                                                    style={{ float: 'right', color: 'black', border: '1px solid black', height: '25px', backgroundColor: 'white' }}  >
                                                    <MenuItem onClick={() => { setSelectOEM([]) }} >All</MenuItem>
                                                    {oem?.map((item, index) => (
                                                        <MenuItem key={index} value={item}>
                                                            <Checkbox size='small' checked={selectOEM.indexOf(item) > -1} />
                                                            <ListItemText primary={item} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </th>
                                            <th style={{ border: '1px solid black' }}>
                                                Circle
                                                <Select
                                                    multiple={true}
                                                    value={selectCircle}
                                                    displayEmpty

                                                    onChange={handleCircle}
                                                    renderValue={(selected) => {
                                                        if (selected.length === 0) {
                                                            return <em>All</em>;
                                                        }
                                                        // return selected.join(', ');
                                                    }}
                                                    style={{ float: 'right', color: 'black', border: '1px solid black', height: '25px', backgroundColor: 'white' }}  >
                                                    <MenuItem onClick={() => { setSelectCircle([]) }} >All</MenuItem>
                                                    {circle?.map((item, index) => (
                                                        <MenuItem key={index} value={item}>
                                                            <Checkbox size='small' checked={selectCircle.indexOf(item) > -1} />
                                                            <ListItemText primary={item} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </th>
                                            <th style={{ border: '1px solid black' }}>
                                                Site ID
                                                <Select
                                                    multiple={true}
                                                    value={selectSiteId}
                                                    displayEmpty

                                                    onChange={handleSiteId}
                                                    renderValue={(selected) => {
                                                        if (selected.length === 0) {
                                                            return <em>All</em>;
                                                        }
                                                    }}
                                                    style={{ float: 'right', color: 'black', border: '1px solid black', height: '25px', backgroundColor: 'white' }}  >
                                                    <MenuItem onClick={() => { setSelectSiteId([]) }} >All</MenuItem>
                                                    {siteId?.map((item, index) => (
                                                        <MenuItem key={index} value={item}>
                                                            <Checkbox size='small' checked={selectSiteId.indexOf(item) > -1} />
                                                            <ListItemText primary={item} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </th>
                                            <th style={{ border: '1px solid black' }}>Ageing</th>
                                            <th style={{ border: '1px solid black' }}>Rejection Count</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 1</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 2</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 3</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 4</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 5</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 6</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 7</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 8</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 9</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 10</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 11</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 12</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 13</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 14</th>
                                            <th style={{ border: '1px solid black', minWidth: 100 }}>Remark 15</th>
                                        </tr>
                                        </thead>

                                        {filterRangeTable()}



                                    </table>
                                </TableContainer>
                            </Box>
                            {/* <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
                                <TableContainer>
                                    <Table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>

                                        <caption style={{ fontSize: 22, backgroundColor: "#F1948A", color: 'black', border: '1px solid black' }}>RANGE {range} REMARK</caption>

                                        <Thead>

                                            <Tr style={{ color: "black" }}>
                                                <Th style={{ border: '1px solid black' }}>OEM</Th>
                                                <Th style={{ border: '1px solid black' }}>Circle</Th>
                                                <Th style={{ border: '1px solid black' }}>Site ID</Th>
                                                <Th style={{ border: '1px solid black' }}>Rejection Count</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 1</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 2</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 3</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 4</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 5</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 6</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 7</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 8</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 9</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 10</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 11</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 12</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 13</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 14</Th>
                                                <Th style={{ border: '1px solid black', minWidth: 100 }}>Remark 15</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {rangeData?.map((item) => (

                                                <Tr style={{ textAlign: "center", fontWeigth: 700 }}>
                                                    <Th style={{ border: '1px solid black' }}>{item.oem}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.Circle}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.Site_ID}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.repetition_count}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r1}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r2}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r3}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r4}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r5}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r6}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r7}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r8}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r9}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r10}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r11}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r12}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r13}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r14}</Th>
                                                    <Th style={{ border: '1px solid black' }}>{item.r15}</Th>

                                                </Tr>

                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </Box> */}
                        </Box>

                    </Slide>


                </div>
            </Slide>


            {filterDialog()}
        </>
    )
}

export default RangeWise