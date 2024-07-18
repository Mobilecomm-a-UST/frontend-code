import React, { useState, useEffect, Suspense } from 'react';
import { Box, Grid, Stack } from "@mui/material";
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
import { DatePicker } from 'rsuite';
import isAfter from 'date-fns/isAfter';
import Slide from '@mui/material/Slide';
import DownloadIcon from '@mui/icons-material/Download';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import * as ExcelJS from 'exceljs'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const Master_Dashbord = () => {
    const [todayDate, setTodayDate] = useState()
    const [fromDate, setFromDate] = useState('')
    const [project, setProject] = useState([]);
    const [toDate, setToDate] = useState('')

    const [displayFilter, setDisplayFilter] = useState()
    const [displayFilterData, setDisplayFilterData] = useState('OverAll Data Up Till :')
    const [open, setOpen] = useState(false)
    const classes = useStyles()
    const [latestDate, setLatestDate] = useState('')
    const [masterData, setMasterData] = useState([])
    const [oemData, setOemData] = useState([])
    const [checked, setChecked] = useState(false);
    const [oemHeadar, setOemHeadar] = useState('')
    const [showOemTable, setShowOemTable] = useState(false)
    const [overAllCircleD, setOverAllCircleD] = useState([])
    const [overAllOemCircle, setOverAllOemCircle] = useState([])
    const [oemCircleWise, setOemCircleWise] = useState([])
    const [showOemCircle, setShowOemCircle] = useState(false)
    const [oemCircleHeadar, setOemCircleHeadar] = useState('')
    const [tcolor, setTcolor] = useState()
    const [oem, setOem] = useState([])
    const [selectOEM, setSelectOEM] = useState([]);
    const [circle, setCircle] = useState([])
    const [selectCircle, setSelectCircle] = useState([]);







    const exportCircleWise = [] ;
    const alarmBucketData = [];
    const ageingCircleData = [];

    const years = [];


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


    function formatDateToDDMMYYYY(date) {
        const inputDate = date;
        const parsedDate = new Date(inputDate);
        const year = parsedDate.getFullYear();
        const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
        const day = parsedDate.getDate().toString().padStart(2, '0');
        const hours = parsedDate.getHours().toString().padStart(2, '0');
        const minutes = parsedDate.getMinutes().toString().padStart(2, '0');
        const seconds = parsedDate.getSeconds().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }

    function getCurrentTime(date) {


        // const hours = date.getUTCHours();
        // const minutes = date.getUTCMinutes();
        // const seconds = date.getUTCSeconds();
        // const ampm = hours >= 12 ? 'PM' : 'AM';
        // const formattedDateTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        // return formattedDateTime;
        return date
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


    const fetchMasterData = async () => {

        var formData = new FormData();

        formData.append('to_date', toDate)
        formData.append('from_date', fromDate)

        const response = await postData('UBR_Soft_Phy_AT/master_dashbord_api', formData)
        const responce1 = await postData('UBR_Soft_Phy_AT/OverAllCircleWiseSummary', formData)
        const responce2 = await postData('UBR_Soft_Phy_AT/overall_oem_wise_circle_wise_summary', formData)
        setOverAllCircleD(responce1.data)
        var newGetData = responce2.data
        console.log('aqaqaqaqa', response)
        if(responce2){
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

            setOverAllOemCircle(arr)

        }
        if (response) {
            setMasterData(response.data)
            var date = new Date(response.data.min_time_date).toLocaleString('en', { timeZone: 'UTC' })
            var date1 = new Date(response.data.max_time_date).toLocaleString('en', { timeZone: 'UTC' })


            console.log('new date sssssss', formatDateToDDMMYYYY(date), date)
            // setDisplayFilterData('From: ' + formatDateToDDMMYYYY(date) + '(' + getCurrentTime(date) + ')' + ' To: ' + formatDateToDDMMYYYY(date1) + '(' + getCurrentTime(date1) + ')')
            if (fromDate.length > 0 && toDate.length > 0) {
                setDisplayFilterData('From :' + fromDate + ' - To :' + toDate)
            }
            else {
                setDisplayFilterData('From: ' + '(' + formatDate(date) + ')' + ' To: ' + '(' + formatDate(date1) + ')')
                setFromDate(formatDateToDDMMYYYY(date))
                setToDate(formatDateToDDMMYYYY(date1))
            }

        }

    }


    // Master dashboard data table....
    const masterDataTable = () => {
        return (
            <tr style={{ textAlign: "center", fontWeigth: 700, fontSize: '18px' }}>
                <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { setOemHeadar('Offered'); fetchTableToggalData('offered') }}>{masterData.offered_count}</td>
                <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { setOemHeadar('Accepted'); fetchTableToggalData(true) }}>{masterData.accepted_count}</td>
                <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { setOemHeadar('Rejected'); fetchTableToggalData(false) }}>{masterData.rejected_count}</td>
                <td style={{ border: '1px solid black' }} >{masterData.percent_accepted_count}%</td>
                <td style={{ border: '1px solid black' }}>{masterData.percent_rejected_count}%</td>
            </tr>
        )
    }

    // OVERALL CIRCLE WISE SUMMARY FUNCTION
    const overAllCircleTable = () => {

        var arr = [];


        Object?.keys(overAllCircleD)?.map((item) => {
            arr.push({ ...overAllCircleD[item], circle: item })
        })


        //   console.log('circle table ' , arr)
         exportCircleWise.push(arr)

        return arr?.map((item) => {
            return (
                <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700, fontSize: '18px' }}>
                    <td style={{ border: '1px solid black' }} >{item.circle}</td>
                    <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { oemCircleTable({ circle: item.circle, status: 'offered' }); setOemCircleHeadar('OFFERED') }} >{item.Offered_count}</td>
                    <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { oemCircleTable({ circle: item.circle, status: true }); setOemCircleHeadar('ACCEPTED') }}>{item.accepted_count}</td>
                    <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { oemCircleTable({ circle: item.circle, status: false }); setOemCircleHeadar('REJECTED') }}>{item.rejected_count}</td>
                    <td style={{ border: '1px solid black' }}>{item.accepted_percentage}</td>
                    <td style={{ border: '1px solid black' }}>{item.rejected_percentage}</td>
                </tr>
            )
        })

    }

    // OEM CIRCLE WISE TABLE FUNCTION
    const oemCircleTable = async (data) => {
        setShowOemCircle(true)
        setChecked(data.status)

        var formData = new FormData();

        formData.append('to_date', toDate)
        formData.append('from_date', fromDate)
        formData.append('Circle', data.circle)

        formData.append('Status', data.status)

        const response = await postData('UBR_Soft_Phy_AT/oem_wise_hyper_link_over_overall_circlewie', formData)
        if (response) {
            var arr = [];
            Object.keys(response.data)?.map((item) => {
                arr.push({ ...response.data[item], circle: item })
            })
            setOemCircleWise(arr)
            setShowOemCircle(true)

            console.log("oem circle wise table", arr)
        }



    }



    const fetchTableToggalData = async (props) => {
        setColorInSecondTable(props)
        setShowOemTable(true)
        setChecked(props)
        setOemData([])
        var formData = new FormData();
        formData.append('from_date', fromDate)
        formData.append('to_date', toDate)
        formData.append('Status', props)

        const response = await postData('UBR_Soft_Phy_AT/oem_wise_master_dashbord_api', formData)
        console.log('lllllllll', response)
        if (response) {
            setOemData(response.data)

        }

    }


    // OPEN IN NEXT PAGE TABLE DATA FOR ( OVERALL SUMMARY / OVERALL CIRCLE WISE SUMMARY )..........////
    const showTableData = async (data) => {
        var formData = new FormData();

        formData.append('oem', data.oem)
        formData.append('circle', data.circle)
        formData.append('Status', checked)
        formData.append('to_date', toDate)
        formData.append('from_date', fromDate)

        const response = await postData('UBR_Soft_Phy_AT/oem_wise_site_details_master_dashbord', formData)

        console.log('responce data ssssssss', response)
        if (response) {
            localStorage.setItem("oem_data", JSON.stringify(response.data));
            window.open(`${window.location.href}/${data.oem}`, "_blank")
        }

    }
    // OPEN IN NEXT PAGE TABLE DATA FOR (OVERALL OEM & CIRCLE WISE SUMMARY)..........////
    const showTableData1 = async (data) => {
        var formData = new FormData();

        formData.append('oem', data.oem)
        formData.append('circle', data.circle)
        formData.append('Status', data.status)
        formData.append('to_date', toDate)
        formData.append('from_date', fromDate)

        const response = await postData('UBR_Soft_Phy_AT/oem_wise_site_details_master_dashbord', formData)

        console.log('responce data ssssssss', response)
        if (response) {
            localStorage.setItem("oem_data", JSON.stringify(response.data));
            window.open(`${window.location.href}/${data.oem}`, "_blank")
        }

    }


    // ****** * ************* OEM DASHBOARD TABLE IN ************** ***********//
    const tData = () => {
        let arr = [];
        Object?.keys(oemData)?.map((item) => {

            arr.push({ ...oemData[item], circle: item })

        })

        return arr?.map((item, index) => {


            var total = (item.RADWIN + item.CAMBIUM )

            if (item.circle == 'total') {
                return (
                    <>
                        <tr key={item} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                            <td style={{ border: '1px solid black' }}>{item.circle}</td>
                            <td style={{ border: '1px solid black' }}>{item.RADWIN}</td>
                            <td style={{ border: '1px solid black' }}>{item.CAMBIUM}</td>
                            {/* <td style={{ border: '1px solid black' }} >{item.Huawei}</td>
                            <td style={{ border: '1px solid black' }}>{item.Samsung}</td
                            <td style={{ border: '1px solid black' }}>{item.Ericcsion}</td>
                            <td style={{ border: '1px solid black' }}>{item.Zte}</td> */}
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
                            <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'RADWIN', circle: item.circle }) }}>{item.RADWIN}</td>
                            <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'CAMBIUM', circle: item.circle }) }}>{item.CAMBIUM}</td>
                            {/* <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'Huawei', circle: item.circle }) }}>{item.Huawei}</td>
                            <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'Samsung', circle: item.circle }) }}>{item.Samsung}</td>
                            <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'Ericsson', circle: item.circle }) }}>{item.Ericcsion}</td>
                            <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'ZTE', circle: item.circle }) }}>{item.Zte}</td> */}
                            <td style={{ border: '1px solid black' }}>{total}</td>
                        </tr>
                    </>
                )
            }

        })


    }
    const RTData = (props) => {
        // return oemData?.map((item, index) => {
        //   return (
        //     <>
        //       <Tr key={item} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
        //         <Td style={{ border: '1px solid black' }}>{item.circle}</Td>
        //         <Td style={{ border: '1px solid black' }}>{item.oem_data.NOKIA}</Td>
        //         <Td style={{ border: '1px solid black' }}>{item.oem_data.ERICSSON}</Td>
        //         <Td style={{ border: '1px solid black' }}>{item.oem_data.HUAWEI}</Td>
        //         <Td style={{ border: '1px solid black' }}>{item.oem_data.SAMSUNG}</Td>
        //         <Td style={{ border: '1px solid black' }}>{item.oem_data?.ZTE}</Td>
        //         <Td style={{ border: '1px solid black' }}>{item.total}</Td>
        //       </Tr>
        //     </>
        //   )
        // })
    }

    // ********* EXPORT DATA IN EXCEL FORMET **********
    const handleExport = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("OVERALL SUMMARY", { properties: { tabColor: { argb: 'F2F597' } } })
        const sheet1 = workbook.addWorksheet("OVERALL CIRCLE WISE SUMMARY", { properties: { tabColor: { argb: 'BBE2EC' } } })
        const sheet3 = workbook.addWorksheet("OVERALL OEM & CIRCLE WISE SUMMARY", { properties: { tabColor: { argb: 'CAA6A6' } } })

        sheet.columns = [
            { header: 'Offered', key: 'offered_count', width: 10 },
            { header: 'Accepted', key: 'accepted_count', width: 15 },
            { header: 'Rejected', key: 'rejected_count', width: 20 },
            { header: 'Acceptance %', key: 'percent_accepted_count', width: 15 },
            { header: 'Rejection %', key: 'percent_rejected_count', width: 15 }

        ]
        sheet1.columns = [
            { header: 'Circle', key: 'circle', width: 10 },
            { header: 'Offered', key: 'Offered_count', width: 15 },
            { header: 'Accepted', key: 'accepted_count', width: 25 },
            { header: 'Rejected', key: 'rejected_count', width: 15 },
            { header: 'Acceptance %', key: 'accepted_percentage', width: 15 },
            { header: 'Rejection %', key: 'rejected_percentage', width: 15 },

        ]

        sheet3.columns = [
            { header: 'Circle', key: 'circle', width: 10 },
            { header: 'OEM', key: 'oem', width: 15 },
            { header: 'Offered', key: 'offered', width: 15 },
            { header: 'Accepted', key: 'accepted', width: 15 },
            { header: 'Rejected', key: 'rejected', width: 15 },
            { header: 'Acceptance %', key: 'accepted_percentage', width: 15 },
            { header: 'Rejection %', key: 'rejected_percentage', width: 15 }
        ]


            sheet.addRow({
                offered_count: masterData?.offered_count,
                accepted_count: masterData?.accepted_count,
                rejected_count: masterData?.rejected_count,
                percent_accepted_count: masterData?.percent_accepted_count,
                percent_rejected_count: masterData?.percent_rejected_count
            })

            exportCircleWise?.map(item => {
            console.log('qqqaawww', item)
            item?.map((its)=>{
                sheet1.addRow({
                circle: its?.circle,
                Offered_count: its?.Offered_count,
                accepted_count: its?.accepted_count,
                // circle_Team_Media_team: item?.circle_Team_Media_team,
                rejected_count: its?.rejected_count,
                accepted_percentage: its?.accepted_percentage,
                rejected_percentage: its?.rejected_percentage

            })
            })

        })


        overAllOemCircle?.map(item => {
            sheet3.addRow({
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
        sheet1.eachRow((row, rowNumber) => {
            const rows = sheet1.getColumn(1);
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
        sheet3.eachRow((row, rowNumber) => {
            const rows = sheet3.getColumn(1);
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
            anchor.download = "UBR_Soft_AT_Rejection.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }



    const RangeDate1 = (event) => {

        console.log('range 1 date and time', new Date(event))
        const now = new Date(event);
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');

        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;


        setFromDate(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)

    }
    const RangeDate2 = (event) => {

        console.log('range 2 date and time', new Date(event))

        const now = new Date(event);
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');

        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');


        setToDate(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
    }

    const handleClose = () => {
        setOpen(false)
        setShowOemTable(false)
        setShowOemCircle(false)
    }

    // ********** Handle Clear *************//
    const handleClear = () => {

        setFromDate('')
        setToDate('')

    }
    // ***********Handle Submit *************//
    const handleSubmit = () => {

        setShowOemTable(false)
        fetchMasterData();
        setOpen(false);
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
                        {/* <Box><span style={{ fontSize: 18, fontWeight: 'bold' }}>Offered Date</span></Box>
                        <Box style={{ height: 'auto', width: 'auto', padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}><input value={date} type='date' max={todayDate} onChange={(e) => { setDate(e.target.value); setMonth(''); setWeek(''); setFromDate(''); setToDate('') }} style={{ height: '35px', width: '150px', fontSize: '18px', border: '1px solid #eaedf0' }} /></Box> */}

                        <Box><span style={{ fontSize: 18, fontWeight: 'bold' }}>Range Date Wise </span></Box>
                        <Box style={{ height: 'auto', width: 'auto', padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                            <Box><span style={{ fontWeight: 'bolder', fontSize: '16px' }}>From :</span>
                                {/* <input type="datetime-local" max={todayDate}/> */}
                                <DatePicker format="MM/dd/yyyy HH:mm" appearance="subtle" placement="auto" disabledDate={date => isAfter(date, new Date())} onOk={(e) => { RangeDate1(e) }} style={{ width: 250, zIndex: 10, position: 'static', fontSize: 16 }} />
                            </Box>
                            <Box><span style={{ fontWeight: 'bolder', fontSize: '16px' }}>To :</span>
                                {/* <input type="datetime-local"  max={todayDate}/> */}
                                <DatePicker format="MM/dd/yyyy HH:mm" appearance="subtle" placement="auto" disabledDate={date => isAfter(date, new Date())} onOk={(e) => { RangeDate2(e) }} style={{ width: 250, zIndex: 10, position: 'static', fontSize: 16 }} />
                            </Box>
                            {/* <DateRangePicker format="MM/dd/yyyy HH:mm"  appearance="subtle" placement="auto" disabledDate={date => isAfter(date, new Date())} onOk={(e) => { RangeDate(e) }} style={{ width: 230, zIndex: 10, position: 'static', fontSize: 16 }} /></Box> */}
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
                                        <th>Cambium</th>
                                        {/* <th>Huawei</th>
                                        <th>Samsung</th>
                                        <th>Ericsson</th>
                                        <th>ZTE</th> */}
                                        <th>Total</th>
                                    </tr>
                                    {tData()}

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
                                        <th>Cambium</th>
                                        {/* <Th>ERICSSON</Th>
                                        <Th>HUAWEI</Th>
                                        <Th>SAMSUNG</Th>
                                        <Th>ZTE</Th> */}
                                        <Th>TOTAL</Th>
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

    const dialogOverallCirclWise = () => {
        return (
            <Dialog
                open={showOemCircle}
                onClose={handleClose}
                keepMounted
                maxWidth='md'
            // style={{width:200}}
            >
                <DialogContent >

                    <Box >
                        <Box sx={{ display: { xs: 'none', md: 'inherit' },width:700 }}>

                            <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                                <table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>
                                    <tr>
                                        <th colspan="8" style={{ fontSize: 24, backgroundColor: '#BBE2EC', color: "", }}>OEM CIRCLE WISE {oemCircleHeadar}</th>
                                    </tr>
                                    <tr style={{ fontSize: 16, backgroundColor: "#223354", color: "white", }}>
                                        <th>Circle</th>
                                        <th>Radwin</th>
                                        <th>Cambium</th>
                                        {/* <th>Huawei</th>
                                        <th>Samsung</th>
                                        <th>Ericsson</th>
                                        <th>ZTE</th> */}
                                        <th>Total</th>
                                    </tr>
                                    {oemCircleWise?.map((item) => {
                                        var total = (item.RADWIN + item.CAMBIUM )
                                        if (item.circle == 'total') {
                                            return (
                                                <>
                                                    <tr key={item} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                                                        <td style={{ border: '1px solid black' }}>{item.circle}</td>
                                                        <td style={{ border: '1px solid black' }}>{item.RADWIN}</td>
                                                        <td style={{ border: '1px solid black' }}>{item.CAMBIUM}</td>
                                                        {/* <td style={{ border: '1px solid black' }} >{item.Huawei}</td>C
                                                        <td style={{ border: '1px solid black' }}>{item.Samsung}</td>
                                                        <td style={{ border: '1px solid black' }}>{item.Ericcsion}</td>
                                                        <td style={{ border: '1px solid black' }}>{item.Zte}</td> */}
                                                        <td style={{ border: '1px solid black' }}>{total}</td>
                                                    </tr>
                                                </>
                                            )
                                        }
                                        else {
                                            return (
                                                <>
                                                    <tr key={item} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                                        <td  style={{ border: '1px solid black' }}>{item.circle}</td>
                                                        <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'RADWIN', circle: item.circle }) }}>{item.RADWIN}</td>
                                                        <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'CAMBIUM', circle: item.circle }) }}>{item.CAMBIUM}</td>
                                                        {/* <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'Huawei', circle: item.circle }) }}>{item.Huawei}</td>
                                                        <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'Samsung', circle: item.circle }) }}>{item.Samsung}</td>
                                                        <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'Ericsson', circle: item.circle }) }}>{item.Ericcsion}</td>
                                                        <td className={classes.hover} style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'ZTE', circle: item.circle }) }}>{item.Zte}</td> */}
                                                        <td style={{ border: '1px solid black' }}>{total}</td>
                                                    </tr>
                                                </>
                                            )
                                        }

                                    })}

                                </table>
                            </TableContainer>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        )

    }

        //  OVERALL OEM & CIRCLE WISE SUMMARY FILTER ////////////
        const offeredDateOem = () => {
            var arr = [];
            if (selectOEM.length > 0 && selectCircle.length > 0) {
                selectCircle?.map((its) => {
                    selectOEM?.map((itemes) => {
                        arr.push(overAllOemCircle?.filter((item) => (item.oem == itemes && item.circle === its)))
                    })
                })

            }
            else if (selectOEM.length > 0) {
                selectOEM?.map((items) => {
                    arr.push(overAllOemCircle?.filter((item) => (item.oem == items)))
                })
            }
            else if (selectCircle.length > 0) {
                selectCircle?.map((items) => {
                    arr.push(overAllOemCircle?.filter((item) => (item.circle == items)))
                })
            }
            else {
                return overAllOemCircle?.map((item) => {
                    return (
                        <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700, fontSize: '18px' }}>
                            <td style={{ border: '1px solid black' }} >{item.circle}</td>
                            <td style={{ border: '1px solid black' }} >{item.oem}</td>
                            <td className={classes.hover} style={{ border: '1px solid black',cursor:'pointer' }}  onClick={() => { showTableData1({ oem: item.oem, circle: item.circle,status:'offered' }) }}>{item.offered}</td>
                            <td className={classes.hover} style={{ border: '1px solid black',cursor:'pointer' }}  onClick={() => { showTableData1({ oem: item.oem, circle: item.circle,status:true}) }}>{item.accepted}</td>
                            <td className={classes.hover} style={{ border: '1px solid black',cursor:'pointer' }}  onClick={() => { showTableData1({ oem: item.oem, circle: item.circle,status: false }) }}>{item.rejected}</td>
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
                            <td className={classes.hover} style={{ border: '1px solid black',cursor:'pointer' }}  onClick={() => { showTableData1({ oem: item.oem, circle: item.circle,status: 'offered' }) }}>{item.offered}</td>
                            <td className={classes.hover} style={{ border: '1px solid black',cursor:'pointer' }}  onClick={() => { showTableData1({ oem: item.oem, circle: item.circle,status: true }) }}>{item.accepted}</td>
                            <td className={classes.hover} style={{ border: '1px solid black',cursor:'pointer' }}  onClick={() => { showTableData1({ oem: item.oem, circle: item.circle,status: false }) }}>{item.rejected}</td>

                            <td style={{ border: '1px solid black' }}>{item.accepted_percentage}</td>
                            <td style={{ border: '1px solid black' }}>{item.rejected_percentage}</td>
                        </tr>
                    )
                })
            })



        }



    useEffect(() => {

        fetchMasterData();
        setDisplayFilterData('OverAll Data Up Till :')
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
                            <Typography color='text.primary'>Master Dashboard</Typography>
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

                    {/* TOTAL ACCEPTED AND REJECTED COUNT TABLE */}

                    <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>
                        <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                            <table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>
                                <tr>
                                    <th colspan="8" style={{ fontSize: 24, backgroundColor: "#F2F597", color: "", }}>OVERALL SUMMARY</th>
                                </tr>
                                <tr style={{ fontSize: 18, backgroundColor: "#223354", color: "white", }}>
                                    <th>Offered</th>
                                    <th>Accepted</th>
                                    <th>Rejected</th>
                                    <th>Acceptance %</th>
                                    <th>Rejection %</th>
                                </tr>
                                {masterDataTable()}

                            </table>
                        </TableContainer>
                    </Box>




                    {/* ************* OEM DASHBOARD TABLE IN ************** */}

                    <Slide direction="left" in={false} timeout={700} style={{ transformOrigin: '1 1 1' }} mountOnEnter unmountOnExit>
                        <Box sx={{ marginTop: 4 }}>
                            <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>

                                <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                                    <table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>
                                        <tr>
                                            <th colspan="8" style={{ fontSize: 24, backgroundColor: checked ? "#BFD8AF" : "#F1948A", color: "", }}>OEM WISE {oemHeadar}</th>
                                        </tr>
                                        <tr style={{ fontSize: 18, backgroundColor: "#223354", color: "white", }}>
                                            <th>CIRCLE</th>
                                            <th>NOKIA</th>
                                            <th>HUAWEI</th>
                                            <th>SAMSUNG</th>
                                            <th>ERICSSON</th>
                                            <th>ZTE</th>
                                            <th>TOTAL</th>
                                        </tr>
                                        {tData()}

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
                                            <Th>ERICSSON</Th>
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



                    {/* OVERALL CIRCLE WISE SUMMARY TABLE */}

                    <Box sx={{ display: { xs: 'none', md: 'inherit' }, marginTop: 4 }}>
                        <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                            <table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>
                                <tr>
                                    <th colspan="8" style={{ fontSize: 24, backgroundColor: "#BBE2EC", color: "", }}>OVERALL CIRCLE WISE SUMMARY</th>
                                </tr>
                                <tr style={{ fontSize: 18, backgroundColor: "#223354", color: "white", }}>
                                    <th>Circle</th>
                                    <th>Offered</th>
                                    <th>Accepted</th>
                                    <th>Rejected</th>
                                    <th>Acceptance %</th>
                                    <th>Rejection %</th>
                                </tr>
                                <tbody>
                                    {overAllCircleTable()}
                                </tbody>


                            </table>
                        </TableContainer>
                    </Box>



                    {/* OVERALL COIRCLE WISE SUMMARY HYPERLINK TABLE */}
                    <Slide direction="left" in={false} timeout={700} style={{ transformOrigin: '1 1 1' }} mountOnEnter unmountOnExit>
                        <Box sx={{ marginTop: 4 }}>
                            <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>

                                <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                                    <table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>
                                        <tr>
                                            <th colspan="8" style={{ fontSize: 24, backgroundColor: '#BBE2EC', color: "", }}>OEM CIRCLE WISE {oemCircleHeadar}</th>
                                        </tr>
                                        <tr style={{ fontSize: 18, backgroundColor: "#223354", color: "white", }}>
                                            <th>CIRCLE</th>
                                            <th>NOKIA</th>
                                            <th>HUAWEI</th>
                                            <th>SAMSUNG</th>
                                            <th>ERICSSON</th>
                                            <th>ZTE</th>
                                            <th>TOTAL</th>
                                        </tr>
                                        {oemCircleWise?.map((item) => {
                                            var total = (item.Nokia + item.Huawei + item.Samsung)
                                            if (item.circle == 'total') {
                                                return (
                                                    <>
                                                        <tr key={item} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                                                            <td style={{ border: '1px solid black' }}>{item.circle}</td>
                                                            <td style={{ border: '1px solid black' }}>{item.Nokia}</td>
                                                            <td style={{ border: '1px solid black' }} >{item.Huawei}</td>
                                                            <td style={{ border: '1px solid black' }}>{item.Samsung}</td>
                                                            <td style={{ border: '1px solid black' }}>{item.Ericcsion}</td>
                                                            <td style={{ border: '1px solid black' }}>{item.Zte}</td>
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
                                                            <td style={{ border: '1px solid black', cursor: 'pointer' }} >{item.Nokia}</td>
                                                            <td style={{ border: '1px solid black', cursor: 'pointer' }} >{item.Huawei}</td>
                                                            <td style={{ border: '1px solid black', cursor: 'pointer' }} >{item.Samsung}</td>
                                                            <td style={{ border: '1px solid black', cursor: 'pointer' }} >{item.Ericcsion}</td>
                                                            <td style={{ border: '1px solid black', cursor: 'pointer' }} >{item.Zte}</td>
                                                            <td style={{ border: '1px solid black' }}>{total}</td>
                                                        </tr>
                                                    </>
                                                )
                                            }

                                        })}

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
                                            <Th>ERICSSON</Th>
                                            <Th>HUAWEI</Th>
                                            <Th>SAMSUNG</Th>
                                            <Th>ZTE</Th>
                                            <Th>TOTAL</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {/* {oemCircleWise?.map((item)=>(
                                              <>
                                              <Tr key={item} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                                                  <Td style={{ border: '1px solid black' }}>{item.circle}</Td>
                                                  <Td style={{ border: '1px solid black' }}>{item.Nokia}</Td>
                                                  <Td style={{ border: '1px solid black' }} >{item.Huawei}</Td>
                                                  <Td style={{ border: '1px solid black' }}>{item.Samsung}</Td>
                                                  <Td style={{ border: '1px solid black' }}>{item.Ericcsion}</Td>
                                                  <Td style={{ border: '1px solid black' }}>{item.Zte}</Td>
                                                  <Td style={{ border: '1px solid black' }}>{total}</Td>
                                              </Tr>
                                          </>
                                        ))} */}

                                    </Tbody>
                                </Table>
                            </Box>
                        </Box>
                    </Slide>



                    {/* OVERALL OEM WISE  CIRCLE WISE  SUMMARY TABLE */}

                    <Box sx={{ display: { xs: 'none', md: 'inherit' }, marginTop: 4 }}>
                        <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                            <table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>
                                <thead style={{position:'sticky',top:0,zIndex:1}}>

                                <tr>
                                    <th colspan="8" style={{ fontSize: 24, backgroundColor: "#CAA6A6", color: "", }}>OVERALL OEM & CIRCLE WISE SUMMARY</th>
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

                </div>
            </Slide>
            {filterDialog()}

            {dialogOemTable()}
            {dialogOverallCirclWise()}


        </>
    )
}

export default Master_Dashbord