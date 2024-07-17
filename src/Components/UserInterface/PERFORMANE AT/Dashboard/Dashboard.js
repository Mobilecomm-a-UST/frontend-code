import React, { useState, useEffect } from 'react';
import { Box, Grid, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useStyles } from './../../ToolsCss'
import Button from '@mui/material/Button';
import { postData, getData } from './../../../services/FetchNodeServices'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PublishIcon from '@mui/icons-material/Publish';
import ClearIcon from '@mui/icons-material/Clear';
import DateRangePicker from 'rsuite/DateRangePicker';
import isAfter from 'date-fns/isAfter';
import Zoom from '@mui/material/Zoom';
import Multiselect from "multiselect-react-dropdown";
import DownloadIcon from '@mui/icons-material/Download';
import * as ExcelJS from 'exceljs'

// import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate'


const project_wise = ['Relocation', 'New Tower', 'Upgrade', 'ULS']




const Dashboard = () => {
    const [date, setDate] = useState('');
    const [month, setMonth] = useState('')
    const [week, setWeek] = useState('')
    const [todayDate, setTodayDate] = useState()
    const [fromDate, setFromDate] = useState('')
    const [project, setProject] = useState([]);
    const [toDate, setToDate] = useState('')
    const [selectedYear, setSelectedYear] = useState('2023')
    const [displayFilter, setDisplayFilter] = useState()
    const [displayFilterData, setDisplayFilterData] = useState('OverAll Data Up Till :')
    const [tableData, setTableData] = useState([])
    const [pendingData, setPendingData] = useState([])
    const [alarmBucket, setAlarmBucket] = useState([])
    const [ageingData, setAgeingData] = useState([])
    const [open, setOpen] = useState(false)
    const [ageingOpen, setAgeingOpen] = useState(false)
    const classes = useStyles()
    const [latestDate, setLatestDate] = useState('')
    const [ownership, setOwnership] = useState([])
    const [ownershipOption, setOwnershipOption] = useState([])
    const [ageingSiteList, setAgeingSiteList] = useState([])
    const [temp , setTemp] = useState([])





    var displayMonth = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // console.log('from date :', fromDate, "/ to date", toDate)
    // console.log('YEARS:', selectedYear)
    // console.log('Month select:',displayMonth[1])
    const circleWiseData = [];
    const PendingSiteData = [];
    const alarmBucketData = [];
    const ageingCircleData = [];


    const years = [];


    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 10; year--) {
        years.push(year);
    }

    const sumOfAll = (arr) => {
        let sum = 0;
        for (let a of arr) {
            sum += a;
        }

        return (sum)
    }

    const fetchCircle = async () => {
        var formData = new FormData();
        formData.append("Date", date)
        formData.append("month", month)
        formData.append("week", week)
        formData.append('from_date', fromDate)
        formData.append('to_date', toDate)
        formData.append('year', selectedYear)
        formData.append('project', project)

        const response = await postData('Performance_AT/view/', formData)
        const response2 = await getData('Performance_AT/filter_by_tool_bucket/')

        setTemp(response2.data)
        console.log('lllllllll', response2.data)
        setTableData(response.Data);
        setPendingData(response.ownership)
        setAlarmBucket(response.alarm_Reasonization)
        await setLatestDate(response.latest_date)
        setAgeingData(response.ageing_circleWise_data)
        setOwnership(response.Ownerships)
    }

    const fetchAgeingNewData = async (event) => {
        var formData = new FormData();
        formData.append("ownership", event)
        const response = await postData('Performance_AT/ownership_circlewise/', formData)
        console.log('ageing new data :', response);
        setAgeingData(response.pending_ageingWise)

    }


    const tempDataTesting = () => {
        var arr = [];
        temp?.map((item) => {
            // console.log('qqqqqqq',item.Tool_Bucket ,item.counts_by_ageing)
            // item.counts_by_ageing?.map((item1)=>{
            //     console.log('wwwwwww',item.Tool_Bucket,item1.CIRCLE)
            // })
            var data1 = item.counts_by_ageing.filter((items) => items.CIRCLE === 'KK')

            console.log('wwwwwww', item.Tool_Bucket, data1[0])
            arr.push({ tool_bucket: item.Tool_Bucket, circle: data1[0]?.CIRCLE, other: data1[0]?.counts })
        })

        console.log('final Array', arr)

        return arr?.map((item)=>{
            if(item.circle){
                return(
                    <>
                          <tr key={item} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.circle}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.circle}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.circle}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.circle}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.circle}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.circle}</td>

                        </tr>
                    </>
                )
            }
        })
    }

    // *********** AGEING POPUP DATA *******************
    const showAgeingData = async (data) => {
        console.log('show ageing data', data[0], data[1])
        var formData = new FormData();
        formData.append("ownership", ownershipOption)
        formData.append("circle", data[0])
        formData.append("ageing", data[1])
        const response = await postData('Performance_AT/site_list_request_handler/', formData)
        localStorage.setItem("site_list", JSON.stringify({ 'list': response.site_list, 'circle': data[0], 'ageing': data[1] }));
        console.log('show ageing data', response)
        setAgeingSiteList(response.site_list)
        window.open(`${window.location.href}/site_list`, "_blank")

    }



    // ********* EXPORT DATA IN EXCEL FORMET **********
    const handleExport = () => {

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Circle-wise", { properties: { tabColor: { argb: 'f1948a' } } })
        const sheet1 = workbook.addWorksheet("Pending-data", { properties: { tabColor: { argb: 'f4d03f' } } })
        const sheet2 = workbook.addWorksheet("Alarm-bucket", { properties: { tabColor: { argb: '52be80' } } })
        const sheet3 = workbook.addWorksheet("Ageing-data", { properties: { tabColor: { argb: 'af7ac5' } } })
        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';

        sheet.columns = [
            { header: 'Circle', key: 'circle', width: 10 },
            { header: 'Accepted', key: 'Accepted', width: 15 },
            { header: 'Dismantled', key: 'Dismantled', width: 15 },
            { header: 'Under Dismantle', key: 'Under_Dismantle', width: 20 },
            { header: 'Non Workable', key: 'Non_workable', width: 20 },
            { header: 'Offered', key: 'Offered', width: 15 },
            { header: 'Pending', key: 'Pending', width: 15 },
            { header: 'Total', key: 'Total', width: 10 }
        ]
        sheet1.columns = [
            { header: 'Status', key: 'status', width: 10 },
            { header: 'Airtel', key: 'Airtel', width: 15 },
            { header: 'Bharti TOCO', key: 'Bharti_TOCO', width: 20 },
            { header: 'Circle Team', key: 'Circle_Team', width: 20 },
            { header: 'Dismantled', key: 'Dismantled', width: 15 },
            { header: 'Ericsson', key: 'Ericsson', width: 15 },
            { header: 'Not Belongs To Mcom', key: 'Not_belongs_to_Mcom', width: 25 },
            { header: 'RNO', key: 'RNO', width: 15 },
            { header: 'SCFT Team', key: 'SCFT_Team', width: 15 },
            { header: 'Total', key: 'Total', width: 15 },

        ]
        sheet2.columns = [
            { header: 'Row Labels', key: 'row_labels', width: 50 },
            { header: 'Count of Alarm Bucket', key: 'Count_of_Pending_Reason', width: 30 }

        ]
        sheet3.columns = [
            { header: 'Circle', key: 'circle', width: 10 },
            { header: '0-15', key: 'ageing_0_15', width: 15 },
            { header: '16-30', key: 'ageing_16_30', width: 15 },
            { header: '31-60', key: 'ageing_31_60', width: 15 },
            { header: '61-90', key: 'ageing_61_90', width: 15 },
            { header: 'GT-90', key: 'ageing_GT90', width: 15 },
            { header: 'Total', key: 'Total', width: 15 }
        ]

        circleWiseData?.map(item => {
            sheet.addRow({
                circle: item?.circle,
                Accepted: item?.Accepted,
                Dismantled: item?.Dismantled,
                Under_Dismantle: item?.Under_Dismantle,
                Non_workable: item?.Non_workable,
                Offered: item?.Offered,
                Pending: item?.Pending,
                Total: item?.Total,
            })
        })
        PendingSiteData?.map(item => {
            sheet1.addRow({
                status: item?.status,
                Airtel: item?.Airtel,
                Bharti_TOCO: item?.Bharti_TOCO,
                Circle_Team: item?.Circle_Team,
                Dismantled: item?.Dismantled,
                Ericsson: item?.Ericsson,
                Not_belongs_to_Mcom: item?.Not_belongs_to_Mcom,
                RNO: item?.RNO,
                SCFT_Team: item?.SCFT_Team,
                Total: item?.Total

            })
        })
        alarmBucketData?.map(item => {
            sheet2.addRow({
                row_labels: item?.row_labels,
                Count_of_Pending_Reason: item?.Count_of_Pending_Reason,
            })
        })

        ageingCircleData?.map(item => {
            sheet3.addRow({
                circle: item?.circle,
                ageing_0_15: item?.ageing_0_15,
                ageing_16_30: item?.ageing_16_30,
                ageing_31_60: item?.ageing_31_60,
                ageing_61_90: item?.ageing_61_90,
                ageing_GT90: item?.ageing_GT90,
                Total: item?.Total,
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
                if (rowNumber === rowsCount) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FE9209' }
                    }
                    cell.font = {
                        color: { argb: 'FFFFFF' },
                        bold: true,
                        size: 13,
                    }
                }
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
                if (rowNumber === rowsCount) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FE9209' }
                    }
                    cell.font = {
                        color: { argb: 'FFFFFF' },
                        bold: true,
                        size: 13,
                    }
                }
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
        sheet2.eachRow((row, rowNumber) => {
            const rows = sheet2.getColumn(1);
            const rowsCount = rows['_worksheet']['_rows'].length;
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
                if (rowNumber === rowsCount) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FE9209' }
                    }
                    cell.font = {
                        color: { argb: 'FFFFFF' },
                        bold: true,
                        size: 13,
                    }
                }
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
                if (rowNumber === rowsCount) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FE9209' }
                    }
                    cell.font = {
                        color: { argb: 'FFFFFF' },
                        bold: true,
                        size: 13,
                    }
                }
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
            anchor.download = "perpormance-at.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }
    useEffect(()=>{
        document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
      },[])


    // ****** Circle Wise Table data **********//
    const tData = (props) => {
        var arr = [];
        if (tableData != null) {
            Object.keys(tableData)?.map((item) => {
                arr.push({ ...tableData[item], circle: item });
                circleWiseData.push({ ...tableData[item], circle: item });
            });
        }
        return arr?.map((item, index) => {
            if (item.circle == 'Total') {
                return (
                    <>
                        <tr key={item} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                            <td style={{ border: '1px solid black' }}>{item.circle}</td>
                            <td style={{ border: '1px solid black' }}>{item.Accepted}</td>
                            <td style={{ border: '1px solid black' }}>{item.Dismantled}</td>
                            {/* <td style={{ border: '1px solid black' }}>{item.Under_Dismantle}</td>
                            <td style={{ border: '1px solid black' }}>{item.Non_workable}</td> */}
                            <td style={{ border: '1px solid black' }}>{item.Offered}</td>
                            <td style={{ border: '1px solid black' }}>{item.Pending}</td>
                            <td style={{ border: '1px solid black' }}>{item.Total}</td>
                        </tr>
                    </>

                )
            }
            else {
                return (
                    <>
                        <tr key={item} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.circle}</td>
                            <td style={{ color: item.Accepted > 0 ? 'white' : 'black', border: '1px solid black', backgroundColor: item.Accepted > 0 ? "#58D68D" : "", fontWeight: 'bold' }}>{item.Accepted}</td>
                            <td style={{ color: item.Dismantle > 0 ? 'white' : 'black', border: '1px solid black', backgroundColor: item.Dismantle > 0 ? "#F96A56" : "", fontWeight: 'bold' }}>{item.Dismantled}</td>
                            {/* <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Under_Dismantle}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Non_workable}</td> */}
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Offered}</td>
                            <td style={{ color: item.Pending > 0 ? 'black' : 'black', border: '1px solid black', backgroundColor: item.Pending > 0 ? "#F4D03F" : "", fontWeight: 'bold' }}>{item.Pending}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Total}</td>
                        </tr>
                    </>

                )
            }

        })
    }

    // ********** Pending Table Data **********////
    const tablePendingData = () => {
        var arr = [];
        if (pendingData != null) {
            Object.keys(pendingData)?.map((item) => {
                arr.push({ ...pendingData[item], status: item });
                PendingSiteData.push({ ...pendingData[item], status: item });
            });
        }

        console.log('pending data', arr)
        return arr?.map((item, index) => {
            if (item.status == 'Total') {
                return (
                    <>
                        <tr key={index} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                            <td style={{ border: '1px solid black' }}>{item.status}</td>
                            <td style={{ border: '1px solid black' }}>{item.Airtel_Toco}</td>
                            <td style={{ border: '1px solid black' }}>{item.Integration_Team}</td>
                            <td style={{ border: '1px solid black' }}>{item.Mcom_Circle_Team}</td>
                            <td style={{ border: '1px solid black' }}>{item.Mcom_Operations}</td>
                            <td style={{ border: '1px solid black' }}>{item.Mcom_Tx_Issue}</td>
                            <td style={{ border: '1px solid black' }}>{item.Mcom_RNO}</td>
                            <td style={{ border: '1px solid black' }}>{item.Mcom_SCFT_team}</td>
                            <td style={{ border: '1px solid black' }}>{item.SCFT_team}</td>
                            <td style={{ border: '1px solid black' }}>{item.Total}</td>
                        </tr>
                    </>

                )
            }
            else {
                return (
                    <>
                        <tr key={item} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.status}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Airtel_Toco}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Integration_Team}</td>
                            <td style={{ border: '1px solid black', fontWeight: 'bold' }}>{item.Mcom_Circle_Team}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Mcom_Operations}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Mcom_Tx_Issue}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Mcom_RNO}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Mcom_SCFT_team}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.SCFT_team}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Total}</td>
                        </tr>
                    </>

                )
            }

        })

    }

    // *********** Alarm Bucket Table Data *******/
    const alarmTableData = () => {
        var arr = [];
        if (alarmBucket != null) {
            Object.keys(alarmBucket)?.map((item, index) => {
                arr.push({ ...alarmBucket[item], row_labels: item });
                alarmBucketData.push({ ...alarmBucket[item], row_labels: item });
            });
        }
        return arr.map((item, index) => {
            if (item.row_labels == 'Grand_Total') {
                return (
                    <tr key={index} style={{ textAlign: "center", backgroundColor: '#E67E22', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                        <td style={{ border: '1px solid black' }}>{item.row_labels}</td>
                        <td style={{ border: '1px solid black' }}>{item.Count_of_Pending_Reason}</td>
                    </tr>
                )
            }
            else {
                return (
                    <tr key={index} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                        <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.row_labels}</td>
                        <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Count_of_Pending_Reason}</td>
                    </tr>
                )
            }
        })

    }

    // *********** Ageing circle wise Table Data *******/
    const ageingTableData = () => {
        var arr = [];
        if (ageingData != null) {
            Object.keys(ageingData)?.map((item) => {
                arr.push({ ...ageingData[item], circle: item });
                ageingCircleData.push({ ...ageingData[item], circle: item });
            });
        }
        return arr?.map((item, index) => {
            if (item.circle == 'Total') {
                return (
                    <>
                        <tr key={index} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                            <td style={{ border: '1px solid black' }}>{item.circle}</td>
                            <td style={{ border: '1px solid black' }}>{item.ageing_0_15}</td>
                            <td style={{ border: '1px solid black' }}>{item.ageing_16_30}</td>
                            <td style={{ border: '1px solid black' }}>{item.ageing_31_60}</td>
                            <td style={{ border: '1px solid black' }}>{item.ageing_61_90}</td>
                            <td style={{ border: '1px solid black' }}>{item.ageing_91_120}</td>
                            <td style={{ border: '1px solid black' }}>{item.ageing_GT120}</td>
                            <td style={{ border: '1px solid black' }}>{item.Total}</td>
                        </tr>
                    </>

                )
            }
            else {
                return (
                    <>
                        <tr key={index} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.circle}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black', cursor: 'pointer' }} className={classes.hover} onClick={() => { showAgeingData([item.circle, '0-15']) }}>{item.ageing_0_15}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black', cursor: 'pointer' }} className={classes.hover} onClick={() => { showAgeingData([item.circle, '16-30']) }}>{item.ageing_16_30}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black', cursor: 'pointer' }} className={classes.hover} onClick={() => { showAgeingData([item.circle, '31-60']) }}>{item.ageing_31_60}</td>
                            <td style={{ border: '1px solid black', fontWeight: 'bold', cursor: 'pointer' }} className={classes.hover} onClick={() => { showAgeingData([item.circle, '61-90']) }}>{item.ageing_61_90}</td>
                            <td style={{ border: '1px solid black', fontWeight: 'bold', cursor: 'pointer' }} className={classes.hover} onClick={() => { showAgeingData([item.circle, '61-90']) }}>{item.ageing_91_120}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black', cursor: 'pointer' }} className={classes.hover} onClick={() => { showAgeingData([item.circle, 'GT90']) }}>{item.ageing_GT120}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Total}</td>
                        </tr>
                    </>
                )
            }
        })
    }




    const fetchTodayDate = async () => {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        await setTodayDate(year + '-' + month + '-' + day)
    }

    const annualWeek = () => {
        var arr = [];
        for (let i = 1; i <= 52; i++) {
            arr.push(i)
        }
        return arr.map((item) => {
            return (
                <option key={item} value={item}>Week {item}</option>
            )
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
        setAgeingOpen(false)
    }

    // ********** Handle Clear *************//
    const handleClear = () => {
        setDate('')
        setFromDate('')
        setToDate('')
        setMonth('')
        setWeek('')
        setProject([])
        setDisplayFilter('Overall Data Up Till ' + project)
    }
    // ***********Handle Submit *************//
    const handleSubmit = () => {

        if (date.length > 0) {
            setDisplayFilterData("Date :" + date + `${project.length > 0 ? ', Project :' + project : ''}`)
        }
        else if (month.length > 0) {
            setDisplayFilterData('Year :' + selectedYear + ', Month :' + displayMonth[month] + `${project.length > 0 ? ', Project :' + project : ''}`)
        }
        else if (week.length > 0) {
            setDisplayFilterData('Year :' + selectedYear + ', Week :' + week + `${project.length > 0 ? ', Project :' + project : ''}`)
        }
        else if (fromDate.length > 0 && toDate.length > 0) {
            setDisplayFilterData('From :' + fromDate + ' - To :' + toDate + `${project.length > 0 ? ', Project :' + project : ''}`)
        }
        else if (project.length > 0) {
            setDisplayFilterData('Project :' + project)
        }
        else {
            setDisplayFilterData('OverAll Data')
        }
        fetchCircle();
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
                <DialogContent style={{ backgroundColor: '#9BD0F2' }}>
                    <Stack direction='column'>
                        <Box><span style={{ fontSize: 18, fontWeight: 'bold' }}>Date Wise</span></Box>
                        <Box style={{ height: 'auto', width: 'auto', padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}><input value={date} type='date' max={todayDate} onChange={(e) => { setDate(e.target.value); setMonth(''); setWeek(''); setFromDate(''); setToDate('') }} style={{ height: '35px', width: '150px', fontSize: '18px', border: '1px solid #eaedf0' }} /></Box>

                        <Box><span style={{ fontSize: 18, fontWeight: 'bold' }}>Range Date Wise </span></Box>
                        <Box style={{ height: 'auto', width: 'auto', padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
                            <Box> <DateRangePicker showOneCalendar appearance="subtle" placement="rightStart" disabledDate={date => isAfter(date, new Date())} onOk={(e) => { RangeDate(e); setDate(''); setMonth(''); setWeek('') }} style={{ width: 230, zIndex: 10, position: 'static', fontSize: 16 }} /></Box>
                            {/* <Box><span style={{ fontWeight: 'bold',fontSize:'16px' }}>From </span><input value={fromDate} max={todayDate} type="date" onChange={(e) => { setFromDate(e.target.value); setDate(''); setDisplayFilter('Range Date Wise:') }} style={{height:'35px',width:'150px',fontSize:'18px',border:'1px solid #eaedf0',borderRadius:5,textAlign:'center'}}/> ~ <span style={{ fontWeight: 'bold',fontSize:'16px' }}>To </span><input  value={toDate} type="date" min={fromDate}  max={todayDate} onChange={(e) => { setToDate(e.target.value); setDate('') }} style={{height:'35px',width:'150px',fontSize:'18px',border:'1px solid #eaedf0',borderRadius:5,textAlign:'center'}}/></Box> */}
                        </Box>

                        <Box style={{ fontSize: 18, fontWeight: 'bold' }}>Month & Week Wise</Box>
                        <Box style={{ height: 'auto', width: "auto", padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
                            {/* YEARS SELECTER */}
                            <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                <div >
                                    <select value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value) }} style={{ height: '35px', width: '150px', fontSize: '18px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                                        <option value="" disabled selected hidden>Select Year</option>
                                        {years.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Box>
                            <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                                {/* MONTHS SELECTER */}
                                <div style={{ marginRight: 10 }}>
                                    <select value={month} onChange={(e) => { setMonth(e.target.value); setDate(''); setFromDate(''); setToDate(''); setWeek('') }} placeholder="Select Month" style={{ height: '35px', width: '150px', fontSize: '18px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                                        <option value="" disabled selected hidden>Select Month</option>
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select >
                                </div>
                                {/* WEEKS SELECTER */}
                                <div style={{ marginLeft: 10 }}>
                                    <select value={week} onChange={(e) => { setWeek(e.target.value); setDate(''); setFromDate(''); setToDate(''); setMonth('') }} style={{ height: '35px', width: '150px', fontSize: '18px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                                        <option value="" disabled selected hidden>Annual Week</option>
                                        {annualWeek()}
                                    </select>
                                </div>
                            </Box>
                        </Box>
                        {/* PROJECT WISE */}
                        <Box style={{ fontSize: 18, fontWeight: 'bold' }}>Project Wise</Box>
                        <Box style={{ height: 'auto', width: "auto", padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }} >
                            <Multiselect
                                isObject={false}
                                options={project_wise}
                                showCheckbox
                                onRemove={(event) => { setProject(event); }}
                                onSelect={(event) => { setProject(event); }}
                                placeholder="Select Project"
                            />
                            {/* <select  value={project} onChange={(e)=>{setProject(e.target.value)}} style={{height:'35px',width:'150px',fontSize:'18px',border:'1px solid #eaedf0',cursor:'pointer',borderRadius:5}}>
                <option value="" disabled selected hidden>Select Project</option>
                <option  value="Relocation">Relocation<input type='checkbox'/></option>
                <option value="New_Tower">New Tower</option>
                <option value="Upgrade">Upgrade</option>
                <option value="ULS">ULS</option>
                </select> */}
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions style={{ backgroundColor: '#B0D9F3', display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleClear} variant='contained' color='secondary' endIcon={<DeleteOutlineIcon />}>clear</Button>
                    <Button onClick={() => { handleSubmit() }} variant='contained' color='success' endIcon={<PublishIcon />} >submit</Button>
                    <Button onClick={handleClose} variant='contained' color='error' endIcon={<ClearIcon />}>cancel</Button>
                </DialogActions>

            </Dialog>
        )
    }

    // ************ AGEING SITE LIST DIALOG ***************
    const ageingSiteDialog = () => {
        return (
            <Dialog
                open={ageingOpen}
                onClose={handleClose}
                keepMounted
                style={{ zIndex: 5 }}
            >
                <DialogContent>
                    <Box style={{ fontSize: '22px', fontWeight: "bold", textAlign: 'center' }}>AGEING SITE LIST</Box>
                    <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {ageingSiteList.map((item) => (
                            <div style={{ fontWeight: "bold", textAlign: 'center' }}>{item}</div>
                        ))}
                    </Box>
                </DialogContent>
            </Dialog>
        )
    }

    useEffect(() => {
        fetchCircle();
        fetchTodayDate();
        setDisplayFilterData('OverAll Data Up Till :' + latestDate)
    }, [latestDate])
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Zoom in='true' timeout={500}>
                <div style={{ margin: 20 }}>
                    <div style={{ margin: 10, marginLeft: 20 }}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" href='/tools'>Tools</Link>
                            <Link underline="hover" href='/tools/performance_at'>Performance AT</Link>
                            <Typography color='text.primary'>Dashboard</Typography>
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
                    {/* ************* CIRCLE WISE TABLE DATA ************** */}
                    <div >
                        <TableContainer sx={{ maxHeight: 540 }} component={Paper}>

                            <table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>
                                <tr>
                                    <th colspan="8" style={{ fontSize: 24, backgroundColor: "#F1948A", color: "", }}>Circle wise</th>
                                </tr>
                                <tr style={{ fontSize: 20, backgroundColor: "#223354", color: "white", }}>
                                    <th>Circle</th>
                                    <th>Accepted</th>
                                    <th>Dismantled</th>
                                    {/* <th>Under Dismantle</th>
                                    <th>Non Workable</th> */}
                                    <th>Offered</th>
                                    <th>Pending</th>
                                    <th>Total</th>
                                </tr>
                                {tData()}


                            </table>
                        </TableContainer>
                    </div>
                    {/* *********** PENDING DATA TABLE ************ */}
                    <div >
                        <TableContainer sx={{ maxHeight: 500, marginTop: 3 }} component={Paper}>

                            <table border="3" style={{ width: "100%", border: "2px solid" }}>
                                <tr>
                                    <th colspan="10" style={{ fontSize: 24, backgroundColor: "#F4D03F", color: "black", }}>Pending Sites</th>
                                </tr>
                                <tr style={{ fontSize: 18, backgroundColor: "#223354", color: "white", }}>
                                    <th>Circle</th>
                                    <th>Airtel Toco</th>
                                    <th>Integration Team</th>
                                    <th>Circle Team</th>
                                    <th>Operations</th>
                                    <th>Tx_Issue</th>
                                    <th>RNO</th>
                                    <th>Mcom-SCFT Team</th>
                                    <th>SCFT_Team</th>
                                    <th>Total</th>
                                </tr>
                                {tablePendingData()}
                            </table>
                        </TableContainer>
                    </div>
                    {/* ************* Tool BUCKET TABLE *************** */}
                    <div>
                        <TableContainer sx={{ maxHeight: 500, marginTop: 3 }} component={Paper}>
                            <table border="3" style={{ width: "100%", border: "2px solid" }}>
                                <thead style={{ position: 'sticky', top: 0 }}>
                                    <tr>
                                        <th colspan="2" style={{ fontSize: 24, backgroundColor: "#52BE80", color: "", }}>Tool Bucket</th>
                                    </tr>
                                    <tr style={{ fontSize: 20, backgroundColor: "#223354", color: "white", }}>
                                        <th>Row Labels</th>
                                        <th>Count of Alarm Bucket</th>
                                    </tr>
                                </thead>

                                {alarmTableData()}
                            </table>
                        </TableContainer>
                    </div>
                    {/* ************AGEING DATA CIRCLE WISE************* */}
                    <div>

                        <TableContainer sx={{ maxHeight: 540, marginTop: 3 }} component={Paper}>
                            <Box style={{ height: 'auto', width: "auto", padding: 5, borderRadius: 5, border: '1px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }} >
                                <Multiselect
                                    isObject={false}
                                    options={ownership}
                                    showCheckbox
                                    onRemove={(event) => { setOwnershipOption(event); fetchAgeingNewData(event); }}
                                    onSelect={(event) => { setOwnershipOption(event); fetchAgeingNewData(event); }}
                                    placeholder="Select Ownership"
                                    style={{ placeholder: '30px' }}
                                />
                                {/* <select  value={project} onChange={(e)=>{setProject(e.target.value)}} style={{height:'35px',width:'150px',fontSize:'18px',border:'1px solid #eaedf0',cursor:'pointer',borderRadius:5}}>
                <option value="" disabled selected hidden>Select Project</option>
                <option  value="Relocation">Relocation<input type='checkbox'/></option>
                <option value="New_Tower">New Tower</option>
                <option value="Upgrade">Upgrade</option>
                <option value="ULS">ULS</option>
                </select> */}
                            </Box>
                            <table border="3" style={{ width: "100%", border: "2px solid" }}>
                                <tr>
                                    <th colspan="8" style={{ fontSize: 24, backgroundColor: "#AF7AC5", color: "black", }}>Ageing (Circle Wise)</th>
                                </tr>
                                <tr style={{ fontSize: 19, backgroundColor: "#223354", color: "white", }}>
                                    <th>Circle</th>
                                    <th>0-15</th>
                                    <th>16-30</th>
                                    <th>31-60</th>
                                    <th>61-90</th>
                                    <th>91-120</th>
                                    <th>GT-120</th>
                                    <th>Total</th>
                                </tr>
                                {ageingTableData()}
                            </table>
                        </TableContainer>
                    </div>
                    {/* <div style={{ height: 'auto', width: '100%', margin: '15px 0px', border: '1px solid black', borderRadius: '10px', padding: '2px', display: 'flex' }}>

                            <TableContainer sx={{ maxHeight: 500, marginTop: 3 }} component={Paper}>
                                <table border="3" style={{ width: "100%", border: "2px solid" }}>
                                    <thead style={{ position: 'sticky', top: 0 }}>
                                        <tr>
                                            <th colspan="2" style={{ fontSize: 24, backgroundColor: "#52BE80", color: "", }}>Tool Bucket</th>
                                        </tr>
                                        <tr style={{ fontSize: 20, backgroundColor: "#223354", color: "white", }}>
                                            <th>Row Labels</th>
                                            <th>0-15</th>
                                            <th>16-30</th>
                                            <th>31-60</th>
                                            <th>61-90</th>
                                            <th>GT-120</th>
                                        </tr>
                                    </thead>

                                    {tempDataTesting()}
                                </table>
                            </TableContainer>

                    </div> */}
                </div>
            </Zoom>
            {filterDialog()}
            {ageingSiteDialog()}

        </>
    )
}

export default Dashboard