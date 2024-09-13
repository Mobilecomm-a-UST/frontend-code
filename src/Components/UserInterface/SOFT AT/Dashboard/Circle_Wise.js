import React, { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { Box, Grid, Stack } from "@mui/material";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useStyles } from './../../ToolsCss'
import Button from '@mui/material/Button';
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
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Placeholder } from 'rsuite';
import * as ExcelJS from 'exceljs'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useQuery } from '@tanstack/react-query';
import { usePost } from '../../../Hooks/PostApis';

const project_wise = ['Relocation', 'New Tower', 'Upgrade', 'ULS']



const Circle_Wise = () => {
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
  const [alarmOpen, setAlarmOpen] = useState(false)
  const [hiperAlarmBucket, setHiperAlarmBucket] = useState([])
  const [bucketTempData, setBucketTempData] = useState([])
  const [open, setOpen] = useState(false)
  const classes = useStyles()
  const [latestDate, setLatestDate] = useState('')
  const { action, loading } = useLoadingDialog()
  const [count, setCount] = useState(0)
  const { makePostRequest } = usePost()
  var displayMonth = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const circleWiseData = [];
  const PendingSiteData = [];
  const alarmBucketData = [];
  const ageingCircleData = [];
  const years = [];


  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 10; year--) {
    years.push(year);
  }

  const { data, refetch } = useQuery({
    queryKey: ['soft_at_master_api'],
    queryFn: async () => {
      action(true)
      var formData = new FormData();
      formData.append("Date", date)
      formData.append("month", month)
      formData.append("week", week)
      formData.append('from_date', fromDate)
      formData.append('to_date', toDate)
      formData.append('year', selectedYear)
      formData.append('project', project)

      const response = await makePostRequest('Soft_At/view/', formData)
      if (response) {
        action(false)
        setTableData(response.Data);
        setPendingData(response.pending_sites_bucketization)
        setAlarmBucket(response.alarm_bucketization)
        setLatestDate(response.Latest_date)
        setAgeingData(response.ageing_circleWise)
        return response;
      }
    },
    staleTime: 400000,
    refetchOnReconnect: false,

  })


  const fetchCircle = () => {


    setTableData(data.Data);
    setPendingData(data.pending_sites_bucketization)
    setAlarmBucket(data.alarm_bucketization)
    setLatestDate(data.Latest_date)
    setAgeingData(data.ageing_circleWise)
    // action(true)

    // var formData = new FormData();
    // formData.append("Date", date)
    // formData.append("month", month)
    // formData.append("week", week)
    // formData.append('from_date', fromDate)
    // formData.append('to_date', toDate)
    // formData.append('year', selectedYear)
    // formData.append('project', project)

    // const response = await postData('Soft_At/view/', formData)
    // if (response) {
    //   action(false)
    //   setTableData(response.Data);
    //   setPendingData(response.pending_sites_bucketization)
    //   setAlarmBucket(response.alarm_bucketization)
    //   await setLatestDate(response.Latest_date)
    //   setAgeingData(response.ageing_circleWise)
    // }
  }


  // ****** Circle Wise Table data **********//
  const tData = (props) => {
    // console.log('circle wise table data')
    var arr = [];
    if (tableData != null) {
      Object.keys(tableData)?.map((item) => {
        arr.push({ ...tableData[item], circle: item });
        circleWiseData.push({ ...tableData[item], circle: item });
      });
    }


    // console.log('fhgfghgfhgh',arr)

    return arr?.map((item, index) => {
      if (item.circle == 'Total') {
        return (
          <>
            <tr key={item} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
              <td style={{ border: '1px solid black' }}>{item.circle}</td>
              <td style={{ border: '1px solid black' }}>{item.Accepted}</td>
              <td style={{ border: '1px solid black' }}>{item.Dismantle}</td>
              <td style={{ border: '1px solid black' }}>{item.Need_to_be_offer}</td>
              <td style={{ border: '1px solid black' }}>{item.NOT_OFFERED}</td>
              <td style={{ border: '1px solid black' }}>{item.Offered}</td>
              <td style={{ border: '1px solid black' }}>{item.Rejected}</td>
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
              <td style={{ color: item.Dismantle > 0 ? 'white' : 'black', border: '1px solid black', backgroundColor: item.Dismantle > 0 ? "#F96A56" : "", fontWeight: 'bold' }}>{item.Dismantle}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Need_to_be_offer}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.NOT_OFFERED}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Offered}</td>
              <td style={{ color: item.Rejected > 0 ? 'white' : 'black', border: '1px solid black', backgroundColor: item.Rejected > 0 ? "#F96A56" : "", fontWeight: 'bold' }}>{item.Rejected}</td>
              <td style={{ color: item.Pending > 0 ? 'black' : 'black', border: '1px solid black', backgroundColor: item.Pending > 0 ? "#F4D03F" : "", fontWeight: 'bold' }}>{item.Pending}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Total}</td>
            </tr>
          </>

        )
      }

    })
  }
  const MemotData = useMemo(() => tData(), [tableData]);
  const RTData = (props) => {
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
            <Tr key={item} style={{ textAlign: "center", backgroundColor: '#DC7633', fontWeight: 'bold', color: 'white' }}>
              <Td style={{ border: '1px solid black' }}>{item.circle}</Td>
              <Td style={{ border: '1px solid black' }}>{item.Accepted}</Td>
              <Td style={{ border: '1px solid black' }}>{item.Dismantle}</Td>
              <Td style={{ border: '1px solid black' }}>{item.Need_to_be_offer}</Td>
              <Td style={{ border: '1px solid black' }}>{item.Offered}</Td>
              <Td style={{ border: '1px solid black' }}>{item.Rejected}</Td>
              <Td style={{ border: '1px solid black' }}>{item.Pending}</Td>
              <Td style={{ border: '1px solid black' }}>{item.Total}</Td>
            </Tr>
          </>

        )
      }
      else {
        return (
          <>
            <Tr key={item} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
              <Td style={{ border: '1px solid black', color: 'black' }} >{item.circle}</Td>
              <Td style={{ color: item.Accepted > 0 ? 'white' : 'black', border: '1px solid black', backgroundColor: item.Accepted > 0 ? "#58D68D" : "" }}>{item.Accepted}</Td>
              <Td style={{ color: item.Dismantle > 0 ? 'white' : 'black', border: '1px solid black', backgroundColor: item.Dismantle > 0 ? "#F96A56" : "" }}>{item.Dismantle}</Td>
              <Td style={{ border: '1px solid black', color: 'black' }}>{item.Need_to_be_offer}</Td>
              <Td style={{ border: '1px solid black', color: 'black' }}>{item.Offered}</Td>
              <Td style={{ color: item.Rejected > 0 ? 'white' : 'black', border: '1px solid black', backgroundColor: item.Rejected > 0 ? "#F96A56" : "" }}>{item.Rejected}</Td>
              <Td style={{ color: item.Pending > 0 ? 'black' : 'black', border: '1px solid black', backgroundColor: item.Pending > 0 ? "#F4D03F" : "" }}>{item.Pending}</Td>
              <Td style={{ border: '1px solid black', color: 'black' }}>{item.Total}</Td>
            </Tr>
          </>

        )
      }

    })
  }
  const MemoRTData = useMemo(() => RTData(), [tableData]);
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


  const handleAlarmBucketFilter = (event) => {
    setBucketTempData([])
    Object.keys(hiperAlarmBucket).map((key, item) => {

      if (key === event.toUpperCase()) {
        console.log('event', key, hiperAlarmBucket[key])
        setBucketTempData({lable:key, data:hiperAlarmBucket[key]})
      }
    })

    setAlarmOpen(true)

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
    return arr?.map((item, index) => {
      if (item.status == 'Total') {
        return (
          <>
            <tr key={index} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
              <td style={{ border: '1px solid black' }}>{item.status}</td>
              <td style={{ border: '1px solid black' }}>{item.Circle_Team}</td>
              <td style={{ border: '1px solid black' }}>{item.Circle_Team_NOC_Team}</td>
              {/* <td style={{ border: '1px solid black' }}>{item.circle_Team_Media_team}</td> */}
              <td style={{ border: '1px solid black' }}>{item.NOC_Team}</td>
              <td style={{ border: '1px solid black' }}>{item.Total}</td>
            </tr>
          </>

        )
      }
      else {
        return (
          <>
            <tr key={item} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.status ? item.status : <><Placeholder active /></>}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Circle_Team}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Circle_Team_NOC_Team}</td>
              {/* <td style={{ border: '1px solid black', fontWeight: 'bold' }}>{item.circle_Team_Media_team}</td> */}
              <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.NOC_Team}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Total}</td>
            </tr>
          </>

        )
      }

    })

  }
  const MemoTablePendingData = useMemo(() => tablePendingData(), [pendingData])
  const RTablePendingData = () => {
    var arr = [];
    if (pendingData != null) {
      Object.keys(pendingData)?.map((item) => {
        arr.push({ ...pendingData[item], status: item });
        // PendingSiteData.push({ ...pendingData[item], status: item });
      });
    }
    return arr?.map((item, index) => {
      if (item.status == 'Total') {
        return (
          <>
            <Tr key={index} style={{ textAlign: "center", backgroundColor: '#DC7633', fontWeight: 'bold', color: 'white' }}>
              <Td style={{ border: '1px solid black' }}>{item.status}</Td>
              <Td style={{ border: '1px solid black' }}>{item.Circle_Team}</Td>
              <Td style={{ border: '1px solid black' }}>{item.Circle_Team_NOC_Team}</Td>
              {/* <Td style={{ border: '1px solid black' }}>{item.circle_Team_Media_team}</Td> */}
              <Td style={{ border: '1px solid black' }}>{item.NOC_Team}</Td>
              <Td style={{ border: '1px solid black' }}>{item.Total}</Td>
            </Tr>
          </>

        )
      }
      else {
        return (
          <>
            <Tr key={item} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
              <Td style={{ border: '1px solid black', color: 'black' }} >{item.status ? item.status : <><Placeholder active /></>}</Td>
              <Td style={{ border: '1px solid black', color: 'black' }}>{item.Circle_Team}</Td>
              <Td style={{ border: '1px solid black', color: 'black' }}>{item.Circle_Team_NOC_Team}</Td>
              {/* <Td style={{ border: '1px solid black', color: 'black' }}>{item.circle_Team_Media_team}</Td> */}
              <Td style={{ border: '1px solid black', color: 'black' }}>{item.NOC_Team}</Td>
              <Td style={{ border: '1px solid black', color: 'black' }}>{item.Total}</Td>
            </Tr>
          </>

        )
      }

    })

  }
  const MemoRTablePendingData = useMemo(() => RTablePendingData(), [pendingData])
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
      if (item.row_labels == 'Grand Total') {
        return (
          <tr key={index} style={{ textAlign: "center", backgroundColor: '#E67E22', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
            <td style={{ border: '1px solid black' }}>{item.row_labels}</td>
            <td style={{ border: '1px solid black' }}>{item.Count_of_Alarm_Bucket}</td>
          </tr>
        )
      }
      else {
        return (
          <tr key={index} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
            <td style={{ fontWeight: 'bold', border: '1px solid black' ,cursor:'pointer'  }}  className={classes.hover} onClick={() => { handleAlarmBucketFilter(item.row_labels) }}>{item.row_labels}</td>
            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Count_of_Alarm_Bucket}</td>
          </tr>
        )
      }
    })

  }
  const MemoAlarmTableData = useMemo(() => alarmTableData(), [alarmBucket])
  const RAlarmTableData = () => {
    var arr = [];
    if (alarmBucket != null) {
      Object.keys(alarmBucket)?.map((item, index) => {
        arr.push({ ...alarmBucket[item], row_labels: item });
        alarmBucketData.push({ ...alarmBucket[item], row_labels: item });
      });
    }
    return arr.map((item, index) => {
      if (item.row_labels == 'Grand Total') {
        return (
          <Tr key={index} style={{ textAlign: "center", backgroundColor: '#E67E22', fontWeight: 'bold', color: 'white' }}>
            <Td style={{ border: '1px solid black' }}>{item.row_labels}</Td>
            <Td style={{ border: '1px solid black' }}>{item.Count_of_Alarm_Bucket}</Td>
          </Tr>
        )
      }
      else {
        return (
          <Tr key={index} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
            <Td style={{ color: 'black', border: '1px solid black' }}>{item.row_labels}</Td>
            <Td style={{ color: 'black', border: '1px solid black' }}>{item.Count_of_Alarm_Bucket}</Td>
          </Tr>
        )
      }
    })

  }
  const MemoRAlarmTableData = useMemo(() => RAlarmTableData(), [alarmBucket])

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
              <td style={{ border: '1px solid black' }}>{item.ageing_GT90}</td>
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
              <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.ageing_0_15}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.ageing_16_30}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.ageing_31_60}</td>
              <td style={{ border: '1px solid black', backgroundColor: item.Rejected > 0 ? "#F96A56" : "", fontWeight: 'bold' }}>{item.ageing_61_90}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.ageing_GT90}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.ageing_GT120}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Total}</td>
            </tr>
          </>
        )
      }
    })
  }
  const MemoAgeingTableData = useMemo(() => ageingTableData(), [ageingData])
  const RAgeingTableData = () => {
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
            <Tr key={index} style={{ textAlign: "center", backgroundColor: '#DC7633', fontWeight: 'bold', color: 'white' }}>
              <Td style={{ border: '1px solid black' }}>{item.circle}</Td>
              <Td style={{ border: '1px solid black' }}>{item.ageing_0_15}</Td>
              <Td style={{ border: '1px solid black' }}>{item.ageing_16_30}</Td>
              <Td style={{ border: '1px solid black' }}>{item.ageing_31_60}</Td>
              <Td style={{ border: '1px solid black' }}>{item.ageing_61_90}</Td>
              <Td style={{ border: '1px solid black' }}>{item.ageing_GT90}</Td>
              <Td style={{ border: '1px solid black' }}>{item.ageing_GT120}</Td>
              <Td style={{ border: '1px solid black' }}>{item.Total}</Td>
            </Tr>
          </>

        )
      }
      else {
        return (
          <>
            <Tr key={index} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
              <Td style={{ border: '1px solid black' }} >{item.circle}</Td>
              <Td style={{ border: '1px solid black' }}>{item.ageing_0_15}</Td>
              <Td style={{ border: '1px solid black' }}>{item.ageing_16_30}</Td>
              <Td style={{ border: '1px solid black' }}>{item.ageing_31_60}</Td>
              <Td style={{ border: '1px solid black', backgroundColor: item.Rejected > 0 ? "#F96A56" : "" }}>{item.ageing_61_90}</Td>
              <Td style={{ border: '1px solid black' }}>{item.ageing_GT90}</Td>
              <Td style={{ border: '1px solid black' }}>{item.ageing_GT120}</Td>
              <Td style={{ border: '1px solid black' }}>{item.Total}</Td>
            </Tr>
          </>
        )
      }
    })
  }
  const MemoRAgeingTableData = useMemo(() => RAgeingTableData(), [ageingData])

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
    setAlarmOpen(false)
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
    setCount(count + 1);
    setTableData([])
    setPendingData([])
    setAlarmBucket([])
    setLatestDate([])

    refetch();

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
    // console.log('fileter dialog')
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

    // ************ Alarm Hiperlink Dialog Box .....

    const handleAlarmDialog = useCallback(() => {
      return (
        <Dialog open={alarmOpen} onClose={handleClose} fullWidth={true} maxWidth='lg'>
          <DialogContent>
            <TableContainer sx={{ maxHeight: 400, marginTop: 3, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
              <table border="3" style={{ width: "100%", border: "1px solid" }}>
                <tr>
                  <th colspan="6" style={{ fontSize: 24, backgroundColor: "#AF7AC5", color: "white", }}>Row Labels (<span style={{ color: "white",fontSize: 19 }}> {bucketTempData?.lable}</span> )</th>
                </tr>
                <tr style={{ fontSize: 16, backgroundColor: "#223354", color: "white", }}>
                  <th>Sr. No.</th>
                  <th>Circle</th>
                  <th>Site ID</th>
                  <th>Status</th>
                  <th>Aging</th>
                  <th>Alarms Details</th>
                </tr>
                {bucketTempData.data?.map((data,index) => (
                  <tr key={index} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                    <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{index+1}</td>
                    <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{data.CIRCLE}</td>
                    <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{data.SITE_ID}</td>
                    <td style={{ fontWeight: 'bold', border: '1px solid black' , color: data.Status === 'Rejected' ? 'red' : '' }}>{data.Status}</td>
                    <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{data.Aging}</td>
                    <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{data.Alarms_Details}</td>
                   
                  </tr>
                ))}
              </table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      )
    }, [alarmOpen])

  useEffect(() => {
    if (data) {
      fetchCircle();
    }

    fetchTodayDate();
    setDisplayFilterData('OverAll Data Up Till :' + latestDate)
    document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
  }, [latestDate])

  return (
    <>
      <style>{"th{border:1px solid black;}"}</style>
      <Zoom in='true' timeout={500}>
        <div style={{ margin: 20 }}>
          <div style={{ margin: 5, marginLeft: 10 }}>
            <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
              <Link underline="hover" href='/tools'>Tools</Link>
              <Link underline="hover" href='/tools/soft_at'>Soft AT</Link>
              <Typography color='text.primary'>Circle Wise</Typography>
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
            <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

              <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse' }}>
                <tr>
                  <th colspan="9" style={{ fontSize: 24, backgroundColor: "#F1948A", color: "", }}>Circle wise</th>
                </tr>
                <tr style={{ fontSize: 20, backgroundColor: "#223354", color: "white", }}>
                  <th>Circle</th>
                  <th>Accepted</th>
                  <th>Dismantle</th>
                  <th>Need to be Offer</th>
                  <th>Not Offered</th>
                  <th>Offered</th>
                  <th>Rejected</th>
                  <th>Pending</th>
                  <th>Total</th>
                </tr>
                {MemotData}

              </table>
            </TableContainer>
          </Box>
          <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
            <Table >

              <caption style={{ fontSize: 22, backgroundColor: "#F1948A", color: 'black', border: '1px solid black' }}>Circle wise</caption>

              <Thead>

                <Tr style={{ color: "black" }}>
                  <Th>Circle</Th>
                  <Th>Accepted</Th>
                  <Th>Dismantle</Th>
                  <Th>Need to be Offer</Th>
                  <Th>Offered</Th>
                  <Th>Rejected</Th>
                  <Th>Pending</Th>
                  <Th>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {MemoRTData}
              </Tbody>
            </Table>
          </Box>

          {/* *********** PENDING DATA TABLE ************ */}

          <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>
            <TableContainer sx={{ maxHeight: 500, marginTop: 3, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

              <table border="3" style={{ width: "100%", border: "1px solid" }}>
                <tr>
                  <th colspan="6" style={{ fontSize: 24, backgroundColor: "#F4D03F", color: "black", }}>Pending Sites</th>
                </tr>
                <tr style={{ fontSize: 19, backgroundColor: "#223354", color: "white", }}>
                  <th>Status</th>
                  <th>Circle Team</th>
                  <th>NOC Team</th>
                  {/* <th>Circle / Media Team</th> */}
                  <th>UBR Team</th>
                  <th>Grand Total</th>
                </tr>
                {MemoTablePendingData}
              </table>
            </TableContainer>
          </Box>
          <Box sx={{ display: { xs: 'inherit', md: 'none' }, marginTop: 3 }}>
            <Table>
              {/* <Thead>
              <Tr>
                <Th colspan="6" style={{ fontSize: 22, backgroundColor: "#F4D03F", color: "black", }}>Pending Sites</Th>
              </Tr>
            </Thead> */}
              <caption style={{ fontSize: 22, backgroundColor: "#F4D03F", color: "black", border: '1px solid black' }} >Pending Sites</caption>
              <Thead>
                <Tr style={{ color: "black" }}>
                  <Th>Status</Th>
                  <Th>Circle Team</Th>
                  <Th>NOC Team</Th>
                  {/* <Th>Circle / Media Team</Th> */}
                  <Th>UBR Team</Th>
                  <Th>Grand Total</Th>
                </Tr>
              </Thead>


              <Tbody>
                {MemoRTablePendingData}
              </Tbody>
            </Table>
          </Box>

          {/* ************* ALARM BUCKET TABLE *************** */}
          <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>
            <TableContainer sx={{ maxHeight: 500, marginTop: 3, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
              <table border="3" style={{ width: "100%", border: "1px solid" }}>
                <tr>
                  <th colspan="2" style={{ fontSize: 24, backgroundColor: "#52BE80", color: "white", }}>Alarm Bucket</th>
                </tr>
                <tr style={{ fontSize: 20, backgroundColor: "#223354", color: "white", }}>
                  <th>Row Labels</th>
                  <th>Count of Alarm Bucket</th>
                </tr>

                {MemoAlarmTableData}
              </table>
            </TableContainer>
          </Box>
          <Box sx={{ display: { xs: 'inherit', md: 'none' }, marginTop: 3 }}>
            <Table>
              <caption style={{ fontSize: 24, backgroundColor: "#52BE80", color: "black", border: '1px solid black' }}>Alarm Bucket</caption>
              <Thead>
                <Tr style={{ color: "black" }}>
                  <Th>Row Labels</Th>
                  <Th>Count of Alarm Bucket</Th>
                </Tr>
              </Thead>
              <Tbody>
                {MemoRAlarmTableData}
              </Tbody>
            </Table>
          </Box>
          {/* ************AGEING DATA CIRCLE WISE************* */}
          <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>
            <TableContainer sx={{ maxHeight: 540, marginTop: 3, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
              <table border="3" style={{ width: "100%", border: "1px solid" }}>
                <tr>
                  <th colspan="8" style={{ fontSize: 24, backgroundColor: "#AF7AC5", color: "white", }}>Ageing (Circle Wise)</th>
                </tr>
                <tr style={{ fontSize: 19, backgroundColor: "#223354", color: "white", }}>
                  <th>Circle</th>
                  <th>0-15</th>
                  <th>16-30</th>
                  <th>31-60</th>
                  <th>61-90</th>
                  <th>GT-90</th>
                  <th>GT-120</th>
                  <th>Total</th>
                </tr>
                {MemoAgeingTableData}
              </table>
            </TableContainer>
          </Box>

          <Box sx={{ display: { xs: 'inherit', md: 'none' }, marginTop: 3 }}>
            <TableContainer>
              <Table>
                <caption style={{ fontSize: 24, backgroundColor: "#AF7AC5", color: "black", border: '1px solid black' }}>Ageing (Circle Wise)</caption>
                <Thead>
                  <Tr style={{ color: 'black' }}>
                    <Th>Circle</Th>
                    <Th>0-15</Th>
                    <Th>16-30</Th>
                    <Th>31-60</Th>
                    <Th>61-90</Th>
                    <Th>GT-90</Th>
                    <Th>GT-120</Th>
                    <Th>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {MemoRAgeingTableData}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </div>
      </Zoom>

      {handleAlarmDialog()}
      {filterDialog()}
      {loading}
    </>
  )
}

export default Circle_Wise