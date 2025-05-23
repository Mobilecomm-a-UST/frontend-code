import React, { useEffect, useState, useRef, useCallback } from 'react'
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
import { useQuery } from '@tanstack/react-query';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import _ from 'lodash';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';

import * as ExcelJS from 'exceljs'
import { DialogContent } from '@mui/material';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" timeout={2500} style={{ transformOrigin: '0 0 0' }} mountOnEnter unmountOnExit ref={ref} {...props} />;
});

const PayloadDip = () => {
  const chartRef = useRef(null);
  const classes = useStyles()
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
  const [tableData, setTableData] = useState([])
  const { isPending, isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ['PayloadDip_MasterDashboard'],
    queryFn: async () => {
      action(isPending)
      var formData = new FormData()
      // formData.append('circle', '')
      formData.append('to_date', toDate)
      formData.append('from_date', fromDate)
      try {
        const res = await makePostRequest("Zero_Count_Rna_Payload_Tool/circle_wise_open_close_dashboard/", formData);
        action(false);

        if (res) {
          console.log('Payload Dip data res', res)
          setFromDate(res.from_date)
          setToDate(res.to_date)
          setCircle(res.result.map(item => Object.keys(item)[0]))
          setOpenPayloadDip(res.result.map(item => Object.values(item)[0].OPEN))
          setClosePayloadDip(res.result.map(item => Object.values(item)[0].CLOSE))
          return res;
        } else {
          // Handle the case where res is falsy
          return {};
        }
      } catch (error) {
        action(false);
        console.error('Error fetching data:', error);
        return {}; // Return an empty object or some default value in case of error
      }
    },
    staleTime: 100000,
    refetchOnReconnect: false,
  })
  let delayed;


  const handleDateFormat = (event) => {
    let date = new Date(event);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    // console.log('date formate',year , month , day);
    return `${day}-${month}-${year}`
  }




  const data1 = {
    labels: circle,
    datasets: [
      {
        label: 'OPEN',
        data: openPayloadDip,
        borderColor: 'rgb(136, 214, 108)',
        backgroundColor: ['rgb(136, 214, 108)'],
        borderWidth: 3,
        borderRadius: 5,
        fill: false,
        tension: 0.4
      },
      {
        label: 'CLOSE',
        data: closePayloadDip,
        borderColor: 'rgb(198, 60, 81)',
        backgroundColor: ['rgb(198, 60, 81)'],
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
        label: 'OPEN',
        data: openPayloadDip,
        borderColor: 'black',
        backgroundColor: ['rgb(136, 214, 108,0.7)'],
        borderWidth: 1,
        borderRadius: 10,
        cursor: 'pointer',
        fill: true,
        tension: 0.4
      },
      {
        label: 'CLOSE',
        data: closePayloadDip,
        borderColor: 'black',
        backgroundColor: ['rgb(198, 60, 81,0.8)'],
        borderWidth: 1,
        borderRadius: 10,
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
        text: `Payload Dip Status ( ${handleDateFormat(fromDate)} ~ ${handleDateFormat(toDate)} )`,
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
      // tooltip: {
      //     displayColors: false,
      //     backgroundColor: 'white',
      //     borderColor: 'black',
      //     borderWidth: '1',
      //     padding: 10,
      //     bodyColor: 'black',
      //     bodyFont: {
      //         size: '14'
      //     },
      //     bodyAlign: 'left',
      //     footerAlign: 'right',
      //     titleColor: 'black',
      //     titleFont: {
      //         weight: 'bold',
      //         size: '15'
      //     },
      //     yAlign: 'bottom',
      //     xAlign: 'center',
      //     callbacks: {
      //         // labelColor: function(context) {
      //         //     return {
      //         //         borderColor: 'rgb(0, 0, 255)',
      //         //         backgroundColor: 'rgb(255, 0, 0)',
      //         //         borderWidth: 2,
      //         //         borderDash: [2, 2],
      //         //         borderRadius: 2,
      //         //     };
      //         // },
      //         // labelTextColor: function(context) {
      //         //     return '#543453';
      //         // },
      //         label: ((tooltipItem) => {
      //             // console.log(tooltipItem.dataset.label,":",tooltipItem.formattedValue)

      //         })
      //     },
      //     // external: function(context) {
      //     //     const tooltipModel = context.tooltip;
      //     //     const canvas = context.chart.canvas;

      //     //     canvas.onclick = function(event) {
      //     //         if (tooltipModel.opacity === 0) {
      //     //             return;
      //     //         }

      //     //         const rect = canvas.getBoundingClientRect();
      //     //         const tooltipPosition = {
      //     //             x: event.clientX - rect.left,
      //     //             y: event.clientY - rect.top
      //     //         };

      //     //         if (
      //     //             tooltipPosition.x >= tooltipModel.caretX - tooltipModel.width / 2 &&
      //     //             tooltipPosition.x <= tooltipModel.caretX + tooltipModel.width / 2 &&
      //     //             tooltipPosition.y >= tooltipModel.caretY - tooltipModel.height / 2 &&
      //     //             tooltipPosition.y <= tooltipModel.caretY + tooltipModel.height / 2
      //     //         ) {
      //     //             console.log('You clicked on the tooltip for', tooltipModel.dataPoints[0]);
      //     //         }
      //     //     };
      //     // }

      // },

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

  const handleFromDateChange = async (event) => {
    await setFromDate(event.target.value);
    await refetch();
  };
  const handleToDateChange = async (event) => {
    await setToDate(event.target.value);
    await refetch();
  };



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
          const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];

          console.log('circle:', circle);
          console.log('status:', status);
          console.log('Value:', value);

          const tempData = data?.data.filter((item) => item.Circle === circle && item.Status === status)

          setTableData(tempData)

          setOpen2(true)
          // setBarData({circle:label,oem:datasetLabel,month:month,year:year})

          // const ClickDataGet = async () => {
          //     action(true)
          //     var formData = new FormData();
          //     formData.append("circle", label);
          //     formData.append("oem", datasetLabel.toUpperCase());
          //     formData.append("month", month);
          //     formData.append("year", year);

          //     const responce = await makePostRequest('IntegrationTracker/hyperlink-monthly-oemwise-integration-data/', formData)
          //     if (responce) {

          //         action(false)
          //         // console.log('hyperlink data', JSON.parse(responce.table_data))
          //         setActivity_Name(datasetLabel.toUpperCase())
          //         setBarData(JSON.parse(responce.table_data))
          //         setBarDialogOpen(true)
          //     }
          //     else {
          //         action(false)
          //     }
          // }

          // ClickDataGet()
          // You can perform further actions with the retrieved data here
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
                  <th style={{ padding: '5px 10px', whiteSpace: 'nowrap' }}>Pre Remarks</th>
                </tr>
              </thead>
              <tbody>
                {tableData && tableData.map((item, index) => (
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

                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Pre_Remarks == 'nan' ? '' : item.Pre_Remarks}</th>
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
    if (data) {
      setFromDate(data.from_date)
      setToDate(data.to_date)
      setCircle(data.result.map(item => Object.keys(item)[0]))
      setOpenPayloadDip(data.result.map(item => Object.values(item)[0].OPEN))
      setClosePayloadDip(data.result.map(item => Object.values(item)[0].CLOSE))
    }

    document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
  }, [])


  return (<>
    <style>{"th{border:1px solid black;}"}</style>
    <div style={{ margin: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 10, height: 'auto', width: "98%", borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
      <div style={{ width: 200, height: 350, borderRadius: 5, padding: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "12px" }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}><FilterAltIcon />FILTER DATA</div>
        {/* select month */}
        <div>
          <InputLabel style={{ fontSize: 15 }}>Select From Date</InputLabel>
          <input type='date' value={fromDate} onChange={handleFromDateChange} />
        </div>
        <div>
          <InputLabel style={{ fontSize: 15 }}>Select To Date</InputLabel>
          <input type='date' value={toDate} onChange={handleToDateChange} />
        </div>
        {/* select circle */}
        {/* <div>
          <InputLabel style={{ fontSize: 15 }}>Select Circle</InputLabel>
          <select style={{ width: 145, height: 25, borderRadius: 2 }} value={selectCircle} onChange={(e) => setSelectCircle(e.target.value)}>
            {circle?.map((item, index) => <option key={index} >{item}</option>)}
          </select>
        </div> */}
        {/* select Activity */}
        {/* <div>
          <InputLabel style={{ fontSize: 15 }}>Select Activity</InputLabel>
          <select style={{ width: 145, height: 25, borderRadius: 2 }} value={selectActivity} onChange={(e) => setSelectActivity(e.target.value)}>
            <option selected value={'_DE_GROW'}>DE-GROW</option>
            <option value={'_MACRO'}>MACRO</option>
            <option value={'_RELOCATION'}>RELOCATION</option>
            <option value={'_RET'}>RET</option>
            <option value={'_ULS_HPSC'}>ULS-HPSC</option>
            <option value={'_UPGRADE'}>UPGRADE</option>
            <option value={'_FEMTO'}>FEMTO</option>
            <option value={'_HT_INCREMENT'}>HT-INCREMENT</option>
            <option value={'_IBS'}>IBS</option>
            <option value={'_IDSC'}>IDSC</option>
            <option value={'_ODSC'}>ODSC</option>
            <option value={'_RECTIFICATION'}>RECTIFICATION</option>
            <option value={'_OTHERS'}>OTHER</option>
          </select>
        </div> */}

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
      <div style={{ display: graphType ? 'inherit' : 'none', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "800px", height: 400 }}>
        <Line
          // style={{ width: "100%", height: 350 }}
          ref={chartRef}
          data={data1}
          options={options}
          plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
        >
        </Line>
      </div>
      <div style={{ display: graphType ? 'none' : 'inherit', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "80hv", height: 400 }}>
        <Bar
          // style={{ width: "100%", height: 400 }}
          ref={chartRef}
          data={data2}
          options={options}
          plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
        >
        </Bar>
      </div>

      {handleDialogBox()}
      {handleTableDialogBox()}
      {loading}

    </div>
  </>
  )
}

export default PayloadDip;