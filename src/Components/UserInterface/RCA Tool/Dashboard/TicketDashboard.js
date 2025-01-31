import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { Chart as Chartjs } from 'chart.js/auto'
import { Line, Bar } from 'react-chartjs-2';
import Button from '@mui/material/Button';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { ServerURL } from '../../../services/FetchNodeServices';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InputLabel from '@mui/material/InputLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LaunchIcon from '@mui/icons-material/Launch';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { useStyles } from '../../ToolsCss';
import { usePost } from '../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import _ from 'lodash';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CheckPicker from 'rsuite/CheckPicker';
import * as ExcelJS from 'exceljs'
import { DialogContent } from '@mui/material';



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" timeout={2500} style={{ transformOrigin: '0 0 0' }} mountOnEnter unmountOnExit ref={ref} {...props} />;
});

const agingdata = ['< 3', '3 to 7', '> 7'];
const prioritydata = ['P0','P1', 'P2'];

const TicketDashboard = () => {
  const chartRef = useRef(null);
  const classes = useStyles()
  const navigate = useNavigate()
  const [graphType, setGraphType] = useState(false);
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const { makePostRequest } = usePost()
  const { loading, action } = useLoadingDialog();
  const [openPayloadDip, setOpenPayloadDip] = useState([])
  const [closePayloadDip, setClosePayloadDip] = useState([])
  const [circle, setCircle] = useState([])
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [priority, setPriority] = useState([])
  const [agingBucket, setAgingBucket] = useState([])
  const [minAging, setMinAging] = useState('')
  const [maxAging, setMaxAging] = useState('')
  const [maxAgingValue, setMaxAgingValue] = useState('')
  const [tableData, setTableData] = useState([])
  const [allData, setAllData] = useState([])
  // const { isPending, isFetching, isError, data, error, refetch } = useQuery({
  //   queryKey: ['PayloadDip_MasterDashboard'],
  //   queryFn: async () => {
  //     action(true)
  //     var formData = new FormData()
  //     formData.append('to_date', toDate);
  //     formData.append('from_date', fromDate);
  //     formData.append('priority', priority);
  //     formData.append('bucket', agingBucket);
  //     try {
  //       const res = await makePostRequest("Zero_Count_Rna_Payload_Tool/circle_wise_open_close_dashboard/", formData);
  //       action(false);

  //       if (res) {
  //         // console.log('Payload Dip data res', res)
  //         setFromDate(res.from_date)
  //         setToDate(res.to_date)
  //         setCircle(res.result.map(item => Object.keys(item)[0]))
  //         setOpenPayloadDip(res.result.map(item => Object.values(item)[0].OPEN))
  //         setClosePayloadDip(res.result.map(item => Object.values(item)[0].CLOSE))
  //         return res;
  //       } else {
  //         // Handle the case where res is falsy
  //         return {};
  //       }
  //     } catch (error) {
  //       action(false);
  //       console.error('Error fetching data:', error);
  //       return {}; // Return an empty object or some default value in case of error
  //     }
  //   },
  //   staleTime: 100000,
  //   refetchOnReconnect: false,
  // })
  let delayed;


  const fetchDashboardData = useCallback(async () => {
    action(true)
    var formData = new FormData()
    formData.append('to_date', toDate);
    formData.append('from_date', fromDate);
    formData.append('priority', priority);
    formData.append('min_ageing', minAging);
    formData.append('max_ageing', maxAging);
    formData.append('ticket_type', 'Payload');
    try {
      const res = await makePostRequest("Zero_Count_Rna_Payload_Tool/circle_wise_open_close_dashboard/", formData);
      action(false);

      if (res) {
        // console.log('Payload Dip data res', res)
        setFromDate(res.from_date);
        setToDate(res.to_date);
        setMinAging(res.min_ageing);
        setMaxAging(res.max_ageing);
        if (!maxAgingValue) {
          setMaxAgingValue(res.max_ageing);
        }
        setCircle(res.result.map(item => Object.keys(item)[0]))
        setOpenPayloadDip(res.result.map(item => Object.values(item)[0].OPEN))
        setClosePayloadDip(res.result.map(item => Object.values(item)[0].CLOSE))
        setAllData(res.data)
        // return res;
        console.log(res)
      } else {
        // Handle the case where res is falsy
        // return {};
        console.log('error')
      }
    } catch (error) {
      action(false);
      console.error('Error fetching data:', error);
      return {}; // Return an empty object or some default value in case of error
    }
  }, [fromDate, toDate, priority, minAging, maxAging]);

  const handleDateFormat = (event) => {
    let date = new Date(event);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    // console.log('date formate',year , month , day);
    return `${day}-${month}-${year}`
  }

  const handleTotalCount = (arr) => {
    let totalcount = arr.reduce((acc, item) => acc + item, 0);
    return totalcount;
  }




  const data1 = {
    labels: circle,
    datasets: [
      {
        label: `OPEN (${handleTotalCount(openPayloadDip)})`,
        data: openPayloadDip,
        borderColor: '#016E75',
        backgroundColor: ['#016E75'],
        borderWidth: 3,
        borderRadius: 5,
        fill: false,
        tension: 0.4
      },
      {
        label: `CLOSE (${handleTotalCount(closePayloadDip)})`,
        data: closePayloadDip,
        borderColor: '#881E87',
        backgroundColor: ['#881E87'],
        borderWidth: 3,
        borderRadius: 5,
        color: 'red',
        fill: false,
        tension: 0.4
      }
    ]
  }

  const data2 = {
    labels: circle,
    datasets: [
      {
        label: `OPEN (${handleTotalCount(openPayloadDip)})`,
        data: openPayloadDip,
        borderColor: 'black',
        backgroundColor: ['#006E74'],
        borderWidth: 0.5,
        borderRadius: 1,
        cursor: 'pointer',
        fill: true,
        tension: 0.4
      },
      {
        label: `CLOSE (${handleTotalCount(closePayloadDip)})`,
        data: closePayloadDip,
        borderColor: 'black',
        backgroundColor: ['#881E87'],
        borderWidth: 0.5,
        borderRadius: 1,
        cursor: 'pointer',
        color: 'red',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const options = {
    responsive: true,
    // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
    maintainApectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
      // axis:'x',
    },
    plugins: {
      // backgroundImageUrl:'https://www.msoutlook.info/pictures/bgconfidential.png',
      legend: {
        position: 'bottom',
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 13,
            // weight: 'bold',
          },
          // color: "white",
          boxWidth: 18,
        }
      },
      title: {
        display: true,
        text: `Payload Dip Status ( ${handleDateFormat(fromDate)} ~ ${handleDateFormat(toDate)} ) Total : ${handleTotalCount(openPayloadDip) + handleTotalCount(closePayloadDip)} ${priority.length > 0 ? '/ Priority : ' + priority : ''} ${agingBucket.length > 0 ? '/ Aging : ' + agingBucket : ''}`,
        font: {
          size: 16,
          weight: 'bold'
        }

      },
      datalabels: {
        display: true,
        color: 'black',
        anchor: 'end',
        align: 'top',
        offset: 0.5,
        font: {
          size: 12,
          weight: 'bold'
        }
        // formatter:(value,context)=>{
        //         console.log(context)
        // }
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.01,
          },
          pinch: {
            enabled: true,
            speed: 0.01,
          },
          mode: 'x',
          // mode:'y',
        },
        pan: {
          enabled: true,
          mode: 'x'
        },
      },


    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          // color:"white"
        },
        // stacked: true

      },
      y: {
        grid: {
          display: true,
          // color:'white'
        },
        ticks: {
          // forces step size to be 50 units
          stepSize: 1,
          // color:'white'
        },
        // stacked: true
      }
    },
    watermark: {

      image: `${ServerURL}/media/assets/logo-new.png`,
      x: 50,
      y: 50,
      width: 300,
      height: 150,
      opacity: 0.25,
      alignX: "right",
      alignY: "top",
      alignToChartArea: false,
      position: "back"

    },
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default' && !delayed) {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
  }




  // TOGGAL BUTTON..........
  const handleChange = () => {
    setGraphType(!graphType)
  }
  const handleClose = () => {
    setOpen(false);
    setOpen2(false);
  }
  // End Toggal Button.......


  useEffect(() => {
    const chart = chartRef.current;

    if (chart) {
      chart.canvas.onclick = function (event) {
        const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

        if (points.length > 0) {
          const firstPoint = points[0];
          const circle = chart.data.labels[firstPoint.index];
          const status = chart.data.datasets[firstPoint.datasetIndex].label;
          // const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];

          // console.log('circle:', circle);
          // console.log('status:', status);
          // console.log('Value:', value);

          const tempData = allData?.filter((item) => item.Circle === circle && item.Status === status.split(' ')[0])
          // console.log('tampData' , tempData)

          setTableData(tempData)

          setOpen2(true)


        }
      };
    }
  }, [data2]);


  const handleDialogBox = useCallback(() => {
    return (
      <Dialog
        fullWidth={true}
        maxWidth={'lg'}
        TransitionComponent={Transition}
        open={open}
        onClose={handleClose}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: graphType ? 'none' : 'inherit', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "1100px", height: '600px' }}>
            <Bar
              // style={{  width: "100%", height: '100%' }}
              ref={chartRef}
              data={data2}
              options={options}
              plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
            >
            </Bar>
          </div>
          <div style={{ display: graphType ? 'inherit' : 'none', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "1100px", height: '600px' }}><Line
            // style={{ width: "100%", height: 350 }}
            data={data1}
            options={options}
            plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
          >
          </Line></div>
        </div>

      </Dialog>
    )
  }, [open])

  const handleExport = () => {

    const workbook = new ExcelJS.Workbook();
    const sheet3 = workbook.addWorksheet("Payload Dip", { properties: { tabColor: { argb: 'f1948a' } } })
    // sheet.properties.defaultRowHeight = 20;
    // sheet.properties.showGridLines = '#58D68D';



    // sheet3.mergeCells('A1:S1');
    // sheet3.mergeCells('A1:A3');
    // sheet3.mergeCells('F1:F3');
    // sheet3.mergeCells('B1:E1');

    sheet3.getCell('A1').value = 'Ticket ID';
    sheet3.getCell('B1').value = 'Circle';
    sheet3.getCell('C1').value = 'Cell Name';
    sheet3.getCell('C1').value = 'Date';
    sheet3.getCell('D1').value = 'Open Date';
    sheet3.getCell('E1').value = 'Aging';
    sheet3.getCell('F1').value = 'Priority';
    sheet3.getCell('G1').value = 'Status';
    sheet3.getCell('H1').value = 'Circle Spoc';
    sheet3.getCell('I1').value = 'Site ID';
    sheet3.getCell('J1').value = 'Remarks';
    sheet3.getCell('K1').value = 'Ownership';
    sheet3.getCell('L1').value = 'Pre Remarks';



    sheet3.columns = [
      { key: 'ticket_id' },
      { key: 'Circle' },
      { key: 'Short_name' },
      { key: 'Open_Date' },
      { key: 'aging' },
      { key: 'priority' },
      { key: 'Status' },
      { key: 'Site_ID' },
      { key: 'Remarks' },
      { key: 'Ownership' },
      { key: 'Pre_Remarks' },
    ]

    tableData?.map(item => {
      sheet3.addRow({
        ticket_id: item?.ticket_id,
        Circle: item?.Circle,
        Short_name: item?.Short_name,
        Date: item?.Date,
        Open_Date: item?.Open_Date,
        aging: item?.aging,
        priority: item?.priority,
        Status: item?.Status,
        Circle_Spoc: item?.Circle_Spoc,
        Site_ID: item?.Site_ID,
        Remarks: item?.Remarks,
        Ownership: item?.Ownership,
        Pre_Remarks: item?.Pre_Remarks,


      })
    })


    ///__________ STYLING IN EXCEL TABLE ______________ ///
    sheet3.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      const rows = sheet3.getColumn(1);
      const rowsCount = rows['_worksheet']['_rows'].length;
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
        // if (rowNumber === rowsCount) {
        //   cell.fill = {
        //     type: 'pattern',
        //     pattern: 'solid',
        //     fgColor: { argb: 'FE9209' }
        //   }
        //   cell.font = {
        //     color: { argb: 'FFFFFF' },
        //     bold: true,
        //     size: 13,
        //   }
        // }

        if (rowNumber === 1) {
          // First set the background of header row
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '223354' }
          }
          cell.font = {
            color: { argb: 'FFFFFF' },
            bold: true,
            size: 12,
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
      anchor.download = "Payload_Dip_Tracker.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    })

  }

  const handleTableDialogBox = useCallback(() => {
    return (
      <Dialog
        fullWidth={true}
        maxWidth={'xl'}
        TransitionComponent={Transition}
        open={open2}
        onClose={handleClose}
      >
        <DialogTitle>
          <Tooltip title="Raw Data">
            <IconButton onClick={() => { handleExport() }}>
              <DownloadIcon fontSize='medium' color='primary' />
            </IconButton>
          </Tooltip>
          <span style={{ float: 'right' }}>
            <IconButton size="large" onClick={handleClose}><CloseIcon /></IconButton>
          </span>
        </DialogTitle>
        <DialogContent>
          <TableContainer sx={{ maxHeight: '70vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                  <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }}>S.No.</th>
                  <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }}>Ticket ID </th>
                  <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }} >Circle </th>
                  <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }}>Cell Name</th>
                  <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }}>Date</th>
                  <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }}>Open Date</th>
                  <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }}>Aging</th>
                  <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }}>Priority </th>
                  <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }}>Circle Spoc</th>
                  <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }}>Site ID </th>
                  <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }}>Remarks</th>
                  <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }}>Ownership</th>
                  {/* <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }}>Pre Remarks</th> */}
                </tr>
              </thead>
              <tbody>
                {tableData && tableData?.map((item, index) => (
                  <tr key={index} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{index + 1}</th>
                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.ticket_id}</th>
                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Circle}</th>
                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Short_name}</th>
                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Date}</th>
                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Open_Date}</th>
                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.aging}</th>
                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.priority}</th>
                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', cursor: 'pointer' }}  >{item.Status == 'nan' ? '' : item.Status}</th>
                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Circle_Spoc}</th>
                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Site_ID}</th>
                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Remarks == 'nan' ? '' : item.Remarks}</th>
                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Ownership == 'nan' ? '' : item.Ownership}</th>

                    {/* <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Pre_Remarks == 'nan' ? '' : item.Pre_Remarks}</th> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    )
  }, [open2])

  useEffect(() => {
    fetchDashboardData();

    document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
  }, [fetchDashboardData])
  return (
    <>
      <style>{"th{border:1px solid black;}"}</style>
      <div style={{ margin: 10 }}>
        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
          <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
          <Link underline="hover" onClick={() => { navigate('/tools/rca') }}>RCA Tool</Link>
          <Typography color='text.primary'>Ticket Dashboard</Typography>
        </Breadcrumbs>
      </div>
      <div style={{ margin: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 10, height: 'auto', width: "98%", borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
        <div style={{ width: '30vh', height: 400, borderRadius: 5, padding: 5, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "12px",backgroundColor:'rgb(247,247,241)' }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}><FilterAltIcon />FILTER DATA</div>
          {/* select month */}
          <div>
            <InputLabel style={{ fontSize: 15 }}>Select From Date</InputLabel>
            <input type='date' value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div>
            <InputLabel style={{ fontSize: 15 }}>Select To Date</InputLabel>
            <input type='date' value={toDate} onChange={(e) => setToDate(e.target.value)} />
            {/* <DatePicker value={toDate? toDate: new Date()}  onChange={(e) => console.log(e)} /> */}
          </div>
          {/* select circle */}
          {/* <div>
          <InputLabel style={{ fontSize: 15 }}>Select Circle</InputLabel>
          <select style={{ width: 145, height: 25, borderRadius: 2 }} value={selectCircle} onChange={(e) => setSelectCircle(e.target.value)}>
            {circle?.map((item, index) => <option key={index} >{item}</option>)}
          </select>
        </div> */}
          <div>
            <InputLabel style={{ fontSize: 15 }}>Select Aging</InputLabel>
            {/* <select style={{ width: '50%', height: 25, borderRadius: 2 }} value={agingBucket} >
            <option selected value={''}>All</option>
            <option selected value={'0-3'}>&lt; 3</option>
            <option value={'3-7'}>3 to 7</option>
            <option value={'>7'}>&gt; 7</option>
          </select> */}
            <div style={{ width: 125, height: 25, borderRadius: 2, border: '1px solid black', display: 'flex', justifyContent: "space-between", placeItems: 'center' }}>
              <div>
                <select className={classes.custom_select} value={minAging} onChange={(e)=>setMinAging(e.target.value)}>
                  {Array.from({ length: maxAgingValue+1 }, (_, index) => (
                    <option key={index} value={index}>
                      {index}
                    </option>
                  ))}

                </select>
              </div>
              <div>To</div>
              <div>
                <select className={classes.custom_select} value={maxAging} onChange={(e)=>setMaxAging(e.target.value)}>
                  {Array.from({ length: maxAgingValue+1 }, (_, index) => (
                    <option key={index} value={index}>
                      {index}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* <CheckPicker label="Aging" data={agingdata.map(item => ({ label: item, value: item }))} value={agingBucket} onChange={(value) => { setAgingBucket(value) }} size="sm" appearance="default" placeholder="" style={{width:130}}/> */}
          </div>
          {/* select Activity */}
          <div>
            {/* <InputLabel style={{ fontSize: 15 }}>Select Priority</InputLabel> */}
            {/* <select style={{ width: 145, height: 25, borderRadius: 2 }} value={priority} >
              <option selected value={''}>All</option>
              <option selected value={'P0'}>P0</option>
              <option value={'P1'}>P1</option>
              <option value={'P2'}>P2</option>
              <option value={'P3'}>P3</option>
            </select> */}

            <CheckPicker label="Priority" data={prioritydata.map(item => ({ label: item, value: item }))} value={priority} onChange={(value) => { setPriority(value) }} size="sm" appearance="default" placeholder="" style={{ width: 130 }} />
          </div>


          {/* toggle button */}
          <div>
            <ToggleButtonGroup
              size="small"
              color="primary"
              value={graphType}
              exclusive
              onChange={handleChange}
              aria-label="Platform"

            >
              <ToggleButton value={true}>Line</ToggleButton>
              <ToggleButton value={false}>Bar</ToggleButton>
            </ToggleButtonGroup>
          </div>
          {/* full screen button */}
          <div>
            <Button color="primary" endIcon={<LaunchIcon />} onClick={() => { setOpen(true) }}>Full screen</Button>
          </div>
        </div>
        <div style={{ display: graphType ? 'inherit' : 'none', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "850px", height: 450 }}>
          <Line
            // style={{ width: "100%", height: 350 }}
            ref={chartRef}
            data={data1}
            options={options}
            plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
          >
          </Line>
        </div>
        <div style={{ display: graphType ? 'none' : 'inherit', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "80hv", height: 450 }}>
          <Bar
            // style={{ width: "100%", height: 400 }}
            ref={chartRef}
            data={data2}
            options={options}
            plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
          >
          </Bar>
        </div>

        {open && handleDialogBox()}
        {handleTableDialogBox()}
        {loading}

      </div>
    </>
  )
}

export default TicketDashboard