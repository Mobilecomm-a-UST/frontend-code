import React, { useState, useEffect } from 'react';
import { Box, Grid, Stack } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useStyles } from './../../../ToolsCss'
import Button from '@mui/material/Button';
import { postData } from './../../../../services/FetchNodeServices'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PublishIcon from '@mui/icons-material/Publish';
import ClearIcon from '@mui/icons-material/Clear';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Slide from '@mui/material/Slide';
import DownloadIcon from '@mui/icons-material/Download';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import * as ExcelJS from 'exceljs'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';


const DateWise = () => {
    const [todayDate, setTodayDate] = useState()
    const [fromDate, setFromDate] = useState('')
    const [project, setProject] = useState([]);
    const [toDate, setToDate] = useState('')
    const [oemOfferDate, setOemOfferDate] = useState('')
    const [displayFilterData, setDisplayFilterData] = useState('OverAll Data Up Till :')
    const [open, setOpen] = useState(false)
    const classes = useStyles()
    const [latestDate, setLatestDate] = useState('')
    const [showOemTable, setShowOemTable] = useState(false)
    const [offerData, setOfferData] = useState([])
    const [checked, setChecked] = useState(false);
    const [oemHeadar, setOemHeadar] = useState('')
    const [oemData, setOemData] = useState([])
    const [tcolor, setTcolor] = useState()
    const [oem, setOem] = useState([])
    const [selectOEM, setSelectOEM] = useState([]);
    const [circle, setCircle] = useState([])
    const [selectCircle, setSelectCircle] = useState([]);
    const [overAllOemDateData, setOverAllOemDateData] = useState([])
    const [testOem, setTestOem] = useState([])
    const [testCircle, setTestCircle] = useState([])



    console.log('today date', testOem)
    const circleWiseData = [];
    const PendingSiteData = [];
    const dateWiseOfferedCount = [];
    const ageingCircleData = [];

    // const years = [];


    // ########### HANDLE OEM TABLE FILTERE ##########
    const handleOemData = (event: SelectChangeEvent<typeof selectOEM>) => {
        const {
            target: { value },
        } = event;
        setSelectOEM(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    // ########### Handle CIRCLE table filter  ###########
    const handleCircle = (event: SelectChangeEvent<typeof selectCircle>) => {
        const {
            target: { value },
        } = event;
        setSelectCircle(
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


    const fetchCircle = async () => {

        var formData = new FormData();

        formData.append('to_date', toDate)
        formData.append('from_date', fromDate)

        const response = await postData('UBR_Soft_Phy_AT/date_wise_offering_status', formData)
        // console.log('lllllllll', response)
        if (response) {
            var date = new Date(response.min_time_date).toLocaleString('en', { timeZone: 'UTC' })
            var date1 = new Date(response.max_time_date).toLocaleString('en', { timeZone: 'UTC' })

            setOfferData(response.data)
            if (fromDate.length > 0 && toDate.length > 0) {
                setDisplayFilterData('From :' + '(' + formatDateTime(fromDate) + ')' + '  To :' + '(' + formatDateTime(toDate) + ')')
            }
            else {
                setDisplayFilterData('From: ' + '(' + formatDate(date) + ')' + ' To: ' + '(' + formatDate(date1) + ')')

            }
        }

    }


    // ******** OFFERED DATE ONCLICK FUNCTION  //

    const fetchOfferDateWiseOem = async (data) => {
        setChecked(false)
        var formData = new FormData();

        formData.append('to_date', toDate)
        formData.append('from_date', fromDate)
        formData.append('offered_date', data)

        const response = await postData('UBR_Soft_Phy_AT/offer_date_wise_oem_wise_circle_wise_summary', formData)
        // console.log('aaaaaaaaa', response)
        var newGetData = response.data

        Object.keys(newGetData).map((cir) => {
            console.log('circle last table', cir)

            setTestOem((prev) => [...prev, cir])

            Object.keys(newGetData[cir])?.map((oeme) => {
                console.log('oems', oeme, newGetData[cir][oeme])

                if (oeme === 'Nokia') {

                }
                else if (oeme === 'huawei') {

                }
                else if (oeme === 'Samsung') {

                }
                else if (oeme === 'Ericcsion') {


                }
            })
        })

        if (response) {
            setChecked(true)
            var arr = [];
            var oems = [];
            var circles = [];
            Object.keys(newGetData)?.map((item) => {
                Object.keys(newGetData[item])?.map((its) => {
                    arr.push({ ...newGetData[item][its], circle: item, oem: its })
                    oems.push(its)
                    circles.push(item)
                })
            })
            // console.log('bbbbbbbb', oems)

            setOem([...new Set(oems)])
            setCircle([...new Set(circles)])

            setOverAllOemDateData(arr)
        }



    }

    //  OFFERED DATE WISE CLICK ON OFFERED COUNT ACCEPTED COUNT REJECTED COUNT ///
    const showTableData = async (data) => {


        setShowOemTable(false)
        var formData = new FormData();

        formData.append('Status', data.status)
        formData.append('offered_date', data.date)

        const response = await postData('UBR_Soft_Phy_AT/offered_date_wise_oemWise_site_count', formData)
        console.log('responce data', response)
        if (response) {
            setShowOemTable(true);
            setOemData(response.data)
        }
    }


    const setColorInSecondTable = (data) => {
        if (data === 'offered') {
            setTcolor('#CDFADB')
        }
        else if (data === true) {
            setTcolor('#74E291')
        } else {
            setTcolor("#F1948A")
        }

    }


    // ****** Offered date Wise Table data **********//
    const tData = () => {
        let arr = [];

        Object?.keys(offerData)?.map((item) => {

            arr.push({ ...offerData[item], date: item })

        })

        dateWiseOfferedCount.push(arr)

        return arr?.map((item, index) => {

            return (
                <>
                    <tr key={item} className={classes.hover} style={{ textAlign: "center", fontSize: '18px', fontWeigth: 700 }}>
                        <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { fetchOfferDateWiseOem(item.date); setOemOfferDate(item.date) }}>{item.date}</td>
                        <td style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ date: item.date, status: 'offered' }); setColorInSecondTable('offered'); setOemHeadar('Offered') }}>{item.Offered_count}</td>
                        <td style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ date: item.date, status: true }); setColorInSecondTable(true); setOemHeadar('Accepted') }}>{item.accepted_count}</td>
                        <td style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ date: item.date, status: false }); setColorInSecondTable(false); setOemHeadar('Rejected') }}>{item.rejected_count}</td>
                    </tr>
                </>
            )


        })


    }
    const RTData = () => {
        let arr = [];

        Object?.keys(offerData)?.map((item) => {

            arr.push({ ...offerData[item], date: item })

        })

        return arr?.map((item, index) => {

            return (
                <>
                    <Tr key={item} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                        <Td style={{ border: '1px solid black' }}>{item.date}</Td>
                        <Td style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ date: item.date, status: 'offered' }) }}>{item.Offered_count}</Td>
                        <Td style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ date: item.date, status: true }) }}>{item.accepted_count}</Td>
                        <Td style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ date: item.date, status: false }) }}>{item.rejected_count}</Td>
                    </Tr>
                </>
            )


        })
    }

    // ********* OEM WISE DATA SHOW IN TABLE********///

    const oemTableData = () => {
        let arr = [];
        Object?.keys(oemData)?.map((item) => {
            arr.push({ ...oemData[item], circle: item })
        })
        return arr?.map((item, index) => {
            var total = (item.Nokia + item.Huawei + item.Samsung)
            if (item.circle == 'total') {
                return (
                    <>
                        <tr key={item} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                            <td style={{ border: '1px solid black' }}>{item.circle}</td>
                            <td style={{ border: '1px solid black' }}>{item.RADWIN}</td>
                            {/* <td style={{ border: '1px solid black' }} >{item.Huawei}</td>
                            <td style={{ border: '1px solid black' }}>{item.Samsung}</td> */}
                            <td style={{ border: '1px solid black' }}>{total}</td>
                        </tr>
                    </>
                )
            }
            else {
                return (
                    <>
                        <tr key={item} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                            <td style={{ border: '1px solid black' }}>{item.circle}</td>
                            <td style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'Nokia', circle: item.circle }) }}>{item.RADWIN}</td>
                            {/* <td style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'Huawei', circle: item.circle }) }}>{item.Huawei}</td>
                            <td style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'Samsung', circle: item.circle }) }}>{item.Samsung}</td> */}
                            <td style={{ border: '1px solid black' }}>{total}</td>
                        </tr>
                    </>
                )
            }

        })
    }


    //  OVERALL OEM & CIRCLE WISE SUMMARY FILTER ////////////
    const offeredDateOem = () => {
        var arr = [];
        if (selectOEM.length > 0 && selectCircle.length > 0) {
            selectCircle?.map((its) => {
                selectOEM?.map((itemes) => {
                    arr.push(overAllOemDateData?.filter((item) => (item.oem == itemes && item.circle === its)))
                })
            })

        }
        else if (selectOEM.length > 0) {
            selectOEM?.map((items) => {
                arr.push(overAllOemDateData?.filter((item) => (item.oem == items)))
            })
        }
        else if (selectCircle.length > 0) {
            selectCircle?.map((items) => {
                arr.push(overAllOemDateData?.filter((item) => (item.circle == items)))
            })
        }
        else {
            return overAllOemDateData?.map((item) => {
                return (
                    <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700, fontSize: '18px' }}>
                        <td style={{ border: '1px solid black' }} >{item.circle}</td>
                        <td style={{ border: '1px solid black' }} >{item.oem}</td>
                        <td style={{ border: '1px solid black' }} >{item.offered}</td>
                        <td style={{ border: '1px solid black' }} >{item.accepted}</td>
                        <td style={{ border: '1px solid black' }} >{item.rejected}</td>
                        <td style={{ border: '1px solid black' }}>{item.accepted_percentage}</td>
                        <td style={{ border: '1px solid black' }}>{item.rejected_percentage}</td>
                    </tr>
                )
            })
        }

        return arr?.map((it) => {
            return it?.map((item) => {
                return (
                    <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700, fontSize: '18px' }}>
                        <td style={{ border: '1px solid black' }} >{item.circle}</td>
                        <td style={{ border: '1px solid black' }} >{item.oem}</td>
                        <td style={{ border: '1px solid black' }} >{item.offered}</td>
                        <td style={{ border: '1px solid black' }} >{item.accepted}</td>
                        <td style={{ border: '1px solid black' }} >{item.rejected}</td>
                        <td style={{ border: '1px solid black' }}>{item.accepted_percentage}</td>
                        <td style={{ border: '1px solid black' }}>{item.rejected_percentage}</td>
                    </tr>
                )
            })
        })



    }

    // ********* EXPORT OFFERED DATE WISE Data IN EXCEL FORMET **********
    const handleExport = () => {

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("OFFERED DATE WISE", { properties: { tabColor: { argb: 'f1948a' } } })
        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';


        sheet.columns = [
            { header: 'Offered Date', key: 'date', width: 15 },
            { header: 'Offered Count', key: 'Offered_count', width: 20 },
            { header: 'Accepted Count', key: 'accepted_count', width: 20 },
            { header: 'Rejected Count', key: 'rejected_count', width: 20 },

        ]

        dateWiseOfferedCount?.map(it => {
            it?.map((item) => {
                sheet.addRow({
                    date: item?.date,
                    Offered_count: item?.Offered_count,
                    accepted_count: item?.accepted_count,
                    rejected_count: item?.rejected_count,

                })
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
            anchor.download = "OFFERED_DATE_WISE.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }

    // ********* EXPORT OVERALL OEM & CIRCLE WISE SUMMARY FOR  Data IN EXCEL FORMET **********

    const handleExport1 = () => {

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("OVERALL OEM & CIRCLE WISE SUMMARY", { properties: { tabColor: { argb: 'rgb(202, 166, 166)' } } })
        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';


        sheet.columns = [
            { header: 'Circle', key: 'circle', width: 15 },
            { header: 'OEM', key: 'oem', width: 20 },
            { header: 'Offered', key: 'offered', width: 20 },
            { header: 'Accepted', key: 'accepted', width: 20 },
            { header: 'Rejected', key: 'rejected', width: 20 },
            { header: 'Acceptance %', key: 'accepted_percentage', width: 20 },
            { header: 'Rejection %', key: 'rejected_percentage', width: 20 },

        ]

        overAllOemDateData?.map(item => {

                sheet.addRow({
                    circle: item?.circle,
                    oem: item?.oem,
                    offered: item?.offered,
                    accepted: item?.accepted,
                    rejected: item?.rejected,
                    accepted_percentage: item?.accepted_percentage,
                    rejected_percentage: item?.rejected_percentage


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
            anchor.download = `OEM & CIRCLE WISE SUMMARY_FOR_${oemOfferDate}.xlsx`;
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }

    const handleClose = () => {
        setOpen(false)
        setShowOemTable(false)
    }

    // ********** Handle Clear *************//
    const handleClear = () => {

        setFromDate('')
        setToDate('')

    }
    // ***********Handle Submit *************//
    const handleSubmit = () => {
        fetchCircle();
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
                    <Button onClick={handleClear} variant='contained' color='secondary' endIcon={<DeleteOutlineIcon />}>clear</Button>
                    <Button onClick={() => { handleSubmit(); }} variant='contained' color='success' endIcon={<PublishIcon />} >submit</Button>
                    <Button onClick={handleClose} variant='contained' color='error' endIcon={<ClearIcon />}>cancel</Button>
                </DialogActions>

            </Dialog>
        )
    }

    // OFFERED WISE ACCEPTED REJECTED POP UP TABLE /////

    const dialogOemTable = () => {
        return (
            <Dialog
                open={showOemTable}
                onClose={handleClose}
                keepMounted
                maxWidth='md'
            // style={{width:200}}
            >
                <DialogContent >

                    <Box >
                        <Box sx={{ display: { xs: 'none', md: 'inherit' }, width: 700 }}>

                            <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                                <table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>
                                    <tr>
                                        <th colspan="8" style={{ fontSize: 24, backgroundColor: tcolor, }}>OEM Wise {oemHeadar}</th>
                                    </tr>
                                    <tr style={{ fontSize: 16, backgroundColor: "#223354", color: "white", }}>
                                        <th>Circle</th>
                                        <th>Radwin</th>
                                        {/* <th>Huawei</th>
                                        <th>Samsung</th> */}
                                        <th>Total</th>
                                    </tr>
                                    {oemTableData()}

                                </table>
                            </TableContainer>
                        </Box>
                        <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
                            <Table >

                                <caption style={{ fontSize: 22, backgroundColor: "#F1948A", color: 'black', border: '1px solid black' }}>OEM Wise {oemHeadar}</caption>

                                <Thead>

                                    <Tr style={{ color: "black" }}>
                                        <Th>Circle</Th>
                                        <Th>Radwin</Th>
                                        {/* <Th>Ericsson</Th>
                                        <Th>Huawei</Th>
                                        <Th>Samsung</Th>
                                        <Th>ZTE</Th> */}
                                        <Th>Total</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {RTData()}
                                </Tbody>
                            </Table>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        )

    }




    useEffect(() => {
        fetchCircle();
        setDisplayFilterData('OverAll Data Up Till :' + latestDate)
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [latestDate])
    return (
        <>

            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>
                    <div style={{ margin: 5, marginLeft: 10 }}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" href='/tools'>Tools</Link>
                            <Link underline="hover" href='/tools/UBR_soft_at_Tracker'>UBR Soft AT Tracker</Link>
                            {/* <Link>Date Wise</Link> */}
                            <Typography color='text.primary'>Date Wise</Typography>

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
                                        <IconButton onClick={() => { handleExport() }}>
                                            <DownloadIcon fontSize='large' color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        </Grid>

                    </div>
                    {/* ************* OFFERED DATE WISE TABLE DATA ************** */}

                    <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>

                        <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                            <table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>
                                <tr>
                                    <th colspan="8" style={{ fontSize: 24, backgroundColor: "#F2F597", color: "", }}>OFFERED DATE WISE</th>
                                </tr>
                                <tr style={{ fontSize: 18, backgroundColor: "#223354", color: "white", }}>
                                    <th>Offered Date</th>
                                    <th>Offered  Count</th>
                                    <th>Accepted Count</th>
                                    <th>Rejected  Count</th>
                                </tr>
                                {tData()}

                            </table>
                        </TableContainer>
                    </Box>
                    <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
                        <Table >
                            <caption style={{ fontSize: 22, backgroundColor: "#F2F597", color: 'black', border: '1px solid black' }}>OFFERED DATE WISE</caption>
                            <Thead>

                                <Tr style={{ color: "black" }}>
                                    <Th>Offered Date</Th>
                                    <Th>Offered Count</Th>
                                    <Th>Accepted Count</Th>
                                    <Th>Rejected Count</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {RTData()}
                            </Tbody>
                        </Table>
                    </Box>

                    {/* ************* OEM DASHBOARD TABLE IN ************** */}

                    <Slide direction="left" in={false} timeout={700} style={{ transformOrigin: '1 1 1' }} mountOnEnter unmountOnExit>
                        <Box sx={{ marginTop: 4 }}>
                            <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>

                                <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                                    <table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>
                                        <tr>
                                            <th colspan="8" style={{ fontSize: 24, backgroundColor: tcolor, }}>OEM Wise {oemHeadar}</th>
                                        </tr>
                                        <tr style={{ fontSize: 18, backgroundColor: "#223354", color: "white", }}>
                                            <th>CIRCLE</th>
                                            <th>NOKIA</th>
                                            <th>HUAWEI</th>
                                            <th>SAMSUNG</th>
                                            <th>TOTAL</th>
                                        </tr>
                                        {oemTableData()}

                                    </table>
                                </TableContainer>
                            </Box>
                            <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
                                <Table >

                                    <caption style={{ fontSize: 22, backgroundColor: "#F1948A", color: 'black', border: '1px solid black' }}>OEM Wise {oemHeadar}</caption>

                                    <Thead>

                                        <Tr style={{ color: "black" }}>
                                            <Th>Circle</Th>
                                            <Th>NOKIA</Th>
                                            <Th>ERICCSON</Th>
                                            <Th>HUAWEI</Th>
                                            <Th>SAMSUNG</Th>
                                            <Th>ZTE</Th>
                                            <Th>TOTAL</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {RTData()}
                                    </Tbody>
                                </Table>
                            </Box>
                        </Box>
                    </Slide>

                    {/* *********** OVERALL OEM & CIRCLE WISE SUMMARY FOR DATE ********** */}

                    <Slide direction="left" in={checked} timeout={700} style={{ transformOrigin: '1 1 1' }} mountOnEnter unmountOnExit>
                        <Box sx={{ marginTop: 4 }}>
                            <TableContainer sx={{ maxHeight: 500, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                                <table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>
                                    <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th colspan="8" style={{ fontSize: 24, backgroundColor: "#CAA6A6", color: "", }}>OVERALL OEM & CIRCLE WISE SUMMARY FOR ( {oemOfferDate} )

                                                <Tooltip title="Export Excel" style={{ float: 'right' }}>
                                                    <IconButton onClick={() => { handleExport1() }}>
                                                        <DownloadIcon fontSize='medium' color='success' />
                                                    </IconButton>
                                                </Tooltip>
                                            </th>
                                        </tr>
                                        <tr style={{ fontSize: 18, backgroundColor: "#223354", color: "white", }}>
                                            <th>Circle
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
                                            <th>OEM
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
                                            <th>Offered</th>
                                            <th>Accepted</th>
                                            <th>Rejected</th>
                                            <th>Acceptance %</th>
                                            <th>Rejection %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {offeredDateOem()}
                                    </tbody>


                                </table>
                            </TableContainer>
                        </Box>
                    </Slide>


                </div>
            </Slide>
            {filterDialog()}
            {dialogOemTable()}



        </>
    )
}

export default DateWise