import React, { useState, useEffect, Suspense } from 'react';
import { Box, Grid, Stack } from "@mui/material";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useStyles } from './../../ToolsCss'
import Button from '@mui/material/Button';
import { postData , getData } from './../../../services/FetchNodeServices'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PublishIcon from '@mui/icons-material/Publish';
import ClearIcon from '@mui/icons-material/Clear';
import DateRangePicker from 'rsuite/DateRangePicker';
import isAfter from 'date-fns/isAfter';
import Slide from '@mui/material/Slide';
import Switch from '@mui/material/Switch';
import DownloadIcon from '@mui/icons-material/Download';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Placeholder } from 'rsuite';
import * as ExcelJS from 'exceljs'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
const project_wise = ['Relocation', 'New Tower', 'Upgrade', 'ULS']

const OEM = () => {
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
  const [open, setOpen] = useState(false)
  const classes = useStyles()
  const [latestDate, setLatestDate] = useState('')

  const [oemData, setOemData] = useState([])
  const [checked, setChecked] = useState(false);



  var displayMonth = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // console.log('today date', todayDate)
  const circleWiseData = [];
  const PendingSiteData = [];
  const alarmBucketData = [];
  const ageingCircleData = [];

  const years = [];


  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 10; year--) {
    years.push(year);
  }


  function formatDateToDDMMYYYY(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function getCurrentTime(date) {

    // let hours = date.getHours();
    // const minutes = date.getMinutes();
    // const ampm = hours >= 12 ? 'PM' : 'AM';

    // // Convert hours to 12-hour format
    // hours = hours % 12;
    // hours = hours || 12; // Handle midnight (0 hours)

    // const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    // return formattedTime;
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedDateTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      return formattedDateTime;
  }


  const fetchCircle = async () => {

    var formData = new FormData();

    formData.append('Status', checked)

    const response = await postData('softat_rej/Soft_At_Rejected_Report', formData)
    console.log('lllllllll', response)
    if(response){
      setOemData(response.data)
      // setOemTotal([response.total_all_oems])

      var date = new Date(response?.min_time_date)
      var date1 = new Date(response?.max_time_date)
      console.log('new date ', formatDateToDDMMYYYY(date1), getCurrentTime(date1))
      setDisplayFilterData('From: ' + formatDateToDDMMYYYY(date) + '(' + getCurrentTime(date) + ')' + ' To: ' + formatDateToDDMMYYYY(date1) + '(' + getCurrentTime(date1) + ')')
    }

  }

  // Master dashboard data fetch function....

  const fetchMasterData= async ()=>{

       var formData = new FormData();
       formData.append('to_date', '')
       formData.append('from_date', '')

      const responce =  await postData('softat_rej/master_dashbord_api' , formData)

      console.log('master data' , responce)

      if(responce){

      }

  }

  const fetchTableToggalData = async (props) => {
    var formData = new FormData();
    // formData.append("Date", date)
    // formData.append("month", month)
    // formData.append("week", week)
    // formData.append('from_date', fromDate)
    // formData.append('to_date', toDate)
    // formData.append('year', selectedYear)
    formData.append('Status', props)

    const response = await postData('softat_rej/Soft_At_Rejected_Report', formData)
    console.log('lllllllll', response)
    setOemData(response.data)
  }

  const showTableData = async (data) => {
    var formData = new FormData();

    formData.append('oem', data.oem)
    formData.append('circle', data.circle)
    formData.append('status', checked)

    const response = await postData('softat_rej/count_of_circle', formData)

    console.log('responce data', response)
    localStorage.setItem("oem_data", JSON.stringify(response.data));
    window.open(`${window.location.href}/${data.oem}`, "_blank")
  }


  // ****** Circle Wise Table data **********//
  const tData = (props) => {
    let arr = [];

    Object?.keys(oemData)?.map((item) => {

      arr.push({ ...oemData[item], circle: item })

    })
    console.log('aaaaa', arr)

    return arr?.map((item, index) => {


      var total = (item.Nokia + item.Huawei + item.Samsung)

      if (item.circle == 'total') {
        return (
          <>
            <tr key={item} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
              <td style={{ border: '1px solid black' }}>{item.circle}</td>
              <td style={{ border: '1px solid black' }}>{item.Nokia}</td>
              <td style={{ border: '1px solid black' }} >{item.Huawei}</td>
              <td style={{ border: '1px solid black' }}>{item.Samsung}</td>
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
              <td style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'Nokia', circle: item.circle }) }}>{item.Nokia}</td>
              <td style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'Huawei', circle: item.circle }) }}>{item.Huawei}</td>
              <td style={{ border: '1px solid black', cursor: 'pointer' }} onClick={() => { showTableData({ oem: 'Samsung', circle: item.circle }) }}>{item.Samsung}</td>
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
    //         <Td style={{ border: '1px solid black' }}>{item.oem_data.ERICCSON}</Td>
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


    // let table1 = [{
    //   A:"Circle",
    //   B:"Accepted",
    //   C:"Dismantle",
    //   D:"Need to be Offer",
    //   E:"Offered",
    //   F:"Rejected",
    //   G:"Pending",
    //   H:"Total"

    // }]

    // circleWiseData.forEach((row)=>
    // {
    //   table1.push({
    //     A: row.circle,
    //     B: row.Accepted,
    //     C: row.Dismantle,
    //     D: row.Need_to_be_offer,
    //     E: row.offered,
    //     F: row.Rejected,
    //     G: row.Pending,
    //     H: row.Total
    //   })
    // })

    // let table2 = [{
    //   A1:"Status",
    //   B1:"Circle Team",
    //   C1:"Circle / NOC Team",
    //   D1:"Circle / Media Team",
    //   E1:"NOC Team",
    //   F1:"Grand Total",

    // }]
    // PendingSiteData.forEach((row)=>
    // {
    //   table2.push({
    //     A1: row.status,
    //     B1: row.Circle_Team,
    //     C1: row.Circle_Team_NOC_Team,
    //     D1: row.circle_Team_Media_team,
    //     E1: row.NOC_Team,
    //     F1: row.Total
    //   })
    // })

    // let table3 =[{
    //   A:"Row Labels",
    //   B:"Count of Alarm Bucket"
    // }]
    // alarmBucketData.forEach((row)=>
    // {
    //   table3.push({
    //     A: row.row_labels,
    //     B: row.Count_of_Alarm_Bucket,
    //   })
    // })

    // let table4 =[{
    //   A:"Circle",
    //   B:"0-15",
    //   C:"16-30",
    //   D:"31-60",
    //   E:"61-90",
    //   F:"GT-90",
    //   G:"Total"
    // }]
    // ageingCircleData.forEach((row)=>
    // {
    //   table4.push({
    //     A: row.circle,
    //     B: row.ageing_0_15,
    //     C: row.ageing_16_30,
    //     D: row.ageing_31_60,
    //     E: row.ageing_61_90,
    //     F: row.ageing_GT90,
    //     G: row.Total
    //   })
    // })

    // table1 = [{D:"CIRCLE WISE AT SOFT-AT"}].concat(table1)

    // table2 = [{A1:"PENDING SITE AT SOFT-AT"}].concat(table2)

    // table3 = [{A:"ALARM BUCKET AT SOFT-AT"}].concat(table3)

    // table4 = [{A:"Ageing ( Circle Wise ) AT SOFT-AT"}].concat(table4)

    // const workBook = XLSX.utils.book_new()
    // const workSheet = XLSX.utils.json_to_sheet(table1)
    // const workSheet1 = XLSX.utils.json_to_sheet(table2)
    // const workSheet2 = XLSX.utils.json_to_sheet(table3)
    // const workSheet3 = XLSX.utils.json_to_sheet(table4)
    //  XLSX.utils.book_append_sheet(workBook,workSheet,'Circle-wise')
    //  XLSX.utils.book_append_sheet(workBook,workSheet1,'Pending-site')
    //  XLSX.utils.book_append_sheet(workBook,workSheet2,'Alarm-bucket')
    //  XLSX.utils.book_append_sheet(workBook,workSheet3,'Ageing')

    // // Buffer
    // let buf = XLSX.write(workBook,{bookType:"xlsx",type:"buffer"})
    // // Binary string
    // XLSX.write(workBook,{bookType:"xlsx",type:"binary"})
    // // Download
    // XLSX.writeFile(workBook,"soft_AT.xlsx")


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
      // { header: 'Dismantle', key: 'Dismantle', width: 15 },
      { header: 'Need to be Offer', key: 'Need_to_be_offer', width: 20 },
      // { header: 'Offered', key: 'offered', width: 15 },
      { header: 'Rejected', key: 'Rejected', width: 15 },
      { header: 'Pending', key: 'Pending', width: 15 },
      { header: 'Total', key: 'Total', width: 10 }
    ]
    sheet1.columns = [
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Circle Team', key: 'Circle_Team', width: 15 },
      { header: 'NOC Team', key: 'Circle_Team_NOC_Team', width: 25 },
      // { header: 'Circle / Media Team', key: 'circle_Team_Media_team', width: 25 },
      { header: 'UBR Team', key: 'NOC_Team', width: 15 },
      { header: 'Grand Total', key: 'Total', width: 15 },

    ]
    sheet2.columns = [
      { header: 'Row Labels', key: 'row_labels', width: 40 },
      { header: 'Count of Alarm Bucket', key: 'Count_of_Alarm_Bucket', width: 30 }

    ]
    sheet3.columns = [
      { header: 'Circle', key: 'circle', width: 10 },
      { header: '0-15', key: 'ageing_0_15', width: 15 },
      { header: '16-30', key: 'ageing_16_30', width: 15 },
      { header: '31-60', key: 'ageing_31_60', width: 15 },
      { header: '61-90', key: 'ageing_61_90', width: 15 },
      { header: 'GT-90', key: 'ageing_GT90', width: 15 },
      { header: 'GT-120', key: 'ageing_GT120', width: 15 },
      { header: 'Total', key: 'Total', width: 15 }
    ]

    circleWiseData?.map(item => {
      sheet.addRow({
        circle: item?.circle,
        Accepted: item?.Accepted,
        // Dismantle: item?.Dismantle,
        Need_to_be_offer: item?.Need_to_be_offer,
        // offered: item?.offered,
        Rejected: item?.Rejected,
        Pending: item?.Pending,
        Total: item?.Total,
      })
    })
    PendingSiteData?.map(item => {
      console.log('qqqaawww', item)
      sheet1.addRow({
        status: item?.status,
        Circle_Team: item?.Circle_Team,
        Circle_Team_NOC_Team: item?.Circle_Team_NOC_Team,
        // circle_Team_Media_team: item?.circle_Team_Media_team,
        NOC_Team: item?.NOC_Team,
        Total: item?.Total,

      })
    })
    alarmBucketData?.map(item => {
      sheet2.addRow({
        row_labels: item?.row_labels,
        Count_of_Alarm_Bucket: item?.Count_of_Alarm_Bucket,
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
        ageing_GT120: item?.ageing_GT120,
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
      anchor.download = "soft-at.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    })

  }

  //  ********* OPEN NEW PAGE OEM TABLE DATA**********




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
    setOemData([])
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
    setOemData([])
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
        <DialogContent style={{ backgroundColor: 'rgb(155, 208, 242,0.5)' }}>
          <Stack direction='column'>
            <Box><span style={{ fontSize: 18, fontWeight: 'bold' }}>Offered Date</span></Box>
            <Box style={{ height: 'auto', width: 'auto', padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}><input value={date} type='date' max={todayDate} onChange={(e) => { setDate(e.target.value); setMonth(''); setWeek(''); setFromDate(''); setToDate('') }} style={{ height: '35px', width: '150px', fontSize: '18px', border: '1px solid #eaedf0' }} /></Box>

            <Box><span style={{ fontSize: 18, fontWeight: 'bold' }}>Range Date Wise </span></Box>
            <Box style={{ height: 'auto', width: 'auto', padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
              <Box>
                <DateRangePicker showOneCalendar appearance="subtle" placement="rightStart" disabledDate={date => isAfter(date, new Date())} onOk={(e) => { RangeDate(e); setMonth(''); setWeek(''); setDate('') }} style={{ width: 230, zIndex: 10, position: 'static', fontSize: 16 }} /></Box>
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

  // ******** Handle toggal button (Accepted and Rejected)
  const handleToggal = (event) => {
    setChecked(event.target.checked);
    fetchTableToggalData(event.target.checked)

  }


  useEffect(() => {
    fetchCircle();
    // fetchMasterData();
    fetchTodayDate();
    setDisplayFilterData('OverAll Data Up Till :' + latestDate)
  }, [latestDate])

  return (
    <>
     <head>
      <title>
        {window.location.pathname.slice(1).replaceAll('_',' ')}
      </title>
    </head>
      <style>{"th{border:1px solid black;}"}</style>
      <Slide direction="left" in='true' timeout={800} style={{ transformOrigin: '1 1 1' }}>
        <div style={{ margin: 20 }}>
          <div style={{ margin: 5, marginLeft: 10 }}>
            <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
              <Link underline="hover" href='/tools'>Tools</Link>
              <Link underline="hover" href='/tools/soft_at_rejection'>Soft AT Rejection</Link>
              <Typography color='text.primary'>Site Wise Rejected Accepted</Typography>
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

          <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>
          {/* this is toggal button ....... */}
            <div><Stack direction="row" spacing={0} alignItems="center">
              <Typography style={{ color: checked ? '' : 'rgb(25,118,210)' }}>Rejected</Typography>
              <Switch checked={checked} onChange={(e) => { handleClear(); handleToggal(e); }} />
              <Typography style={{ color: checked ? 'rgb(25,118,210)' : '' }}>Accepted</Typography>
            </Stack>
            </div>
          {/* end of toggal button..... */}

            <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

              <table style={{ width: "100%", border: "2px solid black", borderCollapse: 'collapse' }}>
                <tr>
                  <th colspan="8" style={{ fontSize: 24, backgroundColor: "#F1948A", color: "", }}>OEM</th>
                </tr>
                <tr style={{ fontSize: 18, backgroundColor: "#223354", color: "white", }}>
                  <th>CIRCLE</th>
                  <th>NOKIA</th>
                  <th>HUAWEI</th>
                  <th>SAMSUNG</th>
                  <th>TOTAL</th>
                </tr>
                {tData()}

              </table>
            </TableContainer>
          </Box>
          <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
            <Table >

              <caption style={{ fontSize: 22, backgroundColor: "#F1948A", color: 'black', border: '1px solid black' }}>Circle wise</caption>

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


        </div>
      </Slide>
      {filterDialog()}


    </>
  )
}

export default OEM