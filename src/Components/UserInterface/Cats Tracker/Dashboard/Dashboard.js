import React, { useState, useEffect } from "react";
import { Box, Button, Grid, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Tooltip from '@mui/material/Tooltip';
import { useStyles } from './../../ToolsCss'
import { useNavigate } from 'react-router-dom'

import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { usePost } from "../../../Hooks/PostApis";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { getData } from "../../../services/FetchNodeServices";
import { useQuery } from "@tanstack/react-query";
import * as ExcelJS from 'exceljs';


const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};



const Dashboard = () => {
  const navigate = useNavigate()
  const theme = useTheme();
  const [circleArr, setCircleArr] = useState([])
  const [circle, setCircle] = useState([]);
  const [statusArr, setStatusArr] = useState([])
  const [status, setStatus] = useState([]);
  const [catsData, setCatsData] = useState([])
  const [month, setMonth] = useState([])
  const [shipped, setShipped] = useState([])
  const classes = useStyles()
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const { makePostRequest } = usePost()
  const { action, loading } = useLoadingDialog()

  const {data,refetch,isFetching,isLoading} = useQuery({
    queryKey:['mo_base_cats_tracker'],
    queryFn:async()=>{
      action(true)
      const responce = await makePostRequest('MO_BASED_REPORT/cats_tracker_dashboard/',{ 'circle': circle, 'status': status })
      const responce2 = await makePostRequest('MO_BASED_REPORT/shipment_dump/',{ 'circle': circle, 'status': status })
      if(responce && responce2){
        action(false)

      }
      return {responce,responce2};
    },
    staleTime: 400000,
    refetchOnReconnect: false,

  })
  // const getQueryData2 = useQuery({
  //   queryKey:['mo_base_cats_tracker'],
  //   queryFn:async()=>{
  //     action(true)
  //     const responce = await makePostRequest('MO_BASED_REPORT/shipment_dump/',{ 'circle': circle, 'status': status })
  //     if(responce){
  //       action(false)
  //       setShipped(responce.data)
  //     }
  //     return responce;
  //   },
  //   staleTime: 400000,
  //   refetchOnReconnect: false,

  // })


  // console.log('aaaaaa' , data.responce , data.responce2 ,isFetching , isLoading )

  const handleCircle = (event) => {
    const {
      target: { value },
    } = event;
    setCircle(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleStatus = (event) => {
    const {
      target: { value },
    } = event;
    setStatus(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };






  // Custom sorting function
  const customSort = (a, b) => {
    // Extract the month and year parts from the strings
    const [, monthA, yearA] = a.match(/(\w+)'(\d+)/);
    const [, monthB, yearB] = b.match(/(\w+)'(\d+)/);

    // Compare the years first
    const yearComparison = parseInt(yearA) - parseInt(yearB);

    // If the years are the same, compare the months
    return yearComparison !== 0 ? yearComparison : months.indexOf(monthA) - months.indexOf(monthB);
  };

  const fetchCircleStatus = async () => {
    const responce = await getData('MO_BASED_REPORT/unique_circle_status_month/')
    // console.log('circle data ' , responce.unique_month)
    if (responce) {
      setCircleArr(responce.unique_circle)
      setStatusArr(responce.unique_status)
      const sortedArray = responce.unique_month.sort(customSort);
      // console.log('short months' , sortedArray)
      setMonth(sortedArray)
    }
  }

  // handleExport Range wise table in excel formet.........
  const handleExport = () => {

    const workbook = new ExcelJS.Workbook();
    const sheet3 = workbook.addWorksheet(`MO Based CATS vs Mobinet Signoff Summary`, { properties: { tabColor: { argb: 'f1948a' } } })
    const sheet4 = workbook.addWorksheet(`TO vs Shipment Dump Summary`, { properties: { tabColor: { argb: 'C5EBAA' } } })


    sheet3.mergeCells('A1:O1');
    sheet3.getCell('A1').value = `MO Based CATS vs Mobinet Signoff from ${month[0]} to ${month[month.length - 1]}`;
    sheet3.getCell('A2').value = '4G+5G Module';
    sheet3.getCell('B2').value = 'Module Qty dispatched as per TO';
    sheet3.getCell('C2').value = 'Module Qty received at site as per TO';
    sheet3.getCell('D2').value = 'Module Qty visible in Mobinet';
    sheet3.getCell('E2').value = 'Gap CATS vs Mobinet(C-E)';
    sheet3.getCell('F2').value = 'Module Available in OSS';
    sheet3.getCell('G2').value = 'SREQ Mapped';
    sheet3.getCell('H2').value = 'RMO Mapped';
    sheet3.getCell('I2').value = 'SREQ/RMO Mapped';
    sheet3.getCell('J2').value = 'SREQ/RMO WIP';
    sheet3.getCell('K2').value = 'Theft';
    sheet3.getCell('L2').value = 'MOS';
    sheet3.getCell('M2').value = 'Virtual MO/Regularisation';
    sheet3.getCell('N2').value = 'MO Cancelled';
    sheet3.getCell('O2').value = 'Under check';





    sheet3.columns = [
      { key: 'Module_Name' },
      { key: 'Module_Qty_dispatched_as_per_TO' },
      { key: 'Module_Qty_received_at_site_as_per_TO' },
      { key: 'Module_Qty_visible' },
      { key: 'Gap_CATS_vs_Mobinet' },
      { key: 'Module_Available_in_OSS' },
      { key: 'SREQ' },
      { key: 'RMO' },
      { key: 'SREQ_RMO' },
      { key: 'SREQ_RMO_WIP' },
      { key: 'Theft' },
      { key: 'MOS' },
      { key: 'Virtual_MO_Regularisation' },
      { key: 'MO_Cancelled' },
      { key: 'Under_check' }
    ]

    sheet4.mergeCells('A1:C1');
    sheet4.getCell('A1').value = `TO vs Shipment Dump Summary From ${month[0]} to ${month[month.length - 1]}`;
    sheet4.getCell('A2').value = '4G+5G Module';
    sheet4.getCell('B2').value = 'QtyShipped';
    sheet4.getCell('C2').value = 'Qtyreceived';

    sheet4.columns = [
      { key: 'Module_name' },
      { key: 'QTYSHIPPED' },
      { key: 'QTYRECEIVED' },
    ]


    data?.map(item => {
      sheet3.addRow({
        Module_Name: item?.Module_Name,
        Module_Qty_dispatched_as_per_TO: item?.Module_Qty_dispatched_as_per_TO,
        Module_Qty_received_at_site_as_per_TO: item?.Module_Qty_received_at_site_as_per_TO,
        Module_Qty_visible: item?.Module_Qty_visible,
        Gap_CATS_vs_Mobinet: item?.Gap_CATS_vs_Mobinet,
        Module_Available_in_OSS: item?.Module_Available_in_OSS,
        SREQ: item?.SREQ,
        RMO: item?.RMO,
        SREQ_RMO: item?.SREQ_RMO,
        SREQ_RMO_WIP: item?.SREQ_RMO_WIP,
        Theft: item?.Theft,
        MOS: item?.MOS,
        Virtual_MO_Regularisation: item?.Virtual_MO_Regularisation,
        MO_Cancelled: item?.MO_Cancelled,
        Under_check: item?.Under_check
      })
    })

    shipped?.map(item => {
      sheet4.addRow({
        Module_name: item?.Module_name,
        QTYSHIPPED: item?.QTYSHIPPED,
        QTYRECEIVED: item?.QTYRECEIVED
      })
    })


    // SHEETS 3

    sheet3.getCell('Q2').value = 'CIRCLE';
    if (circle.length === 0) {
      sheet3.getCell('Q3').value = 'All';
    }
    else {
      circle?.map((item, index) => {
        sheet3.getCell(`Q${3 + index}`).value = `${item}`;
      })
    }


    sheet3.getCell('R2').value = 'STATUS';
    if (status.length === 0) {
      sheet3.getCell(`R3`).value = `All`;
    }
    else {
      status?.map((item, index) => {
        sheet3.getCell(`R${3 + index}`).value = `${item}`;
      })
    }


    // SHEETS 4

    sheet4.getCell('F2').value = 'CIRCLE';
    if (circle.length === 0) {
      sheet4.getCell('F3').value = 'All';
    }
    else {
      circle?.map((item, index) => {
        sheet4.getCell(`F${3 + index}`).value = `${item}`;
      })
    }
    sheet4.getCell('G2').value = 'STATUS';
    if (status.length === 0) {
      sheet4.getCell(`G3`).value = `All`;
    }
    else {
      status?.map((item, index) => {
        sheet4.getCell(`G${3 + index}`).value = `${item}`;
      })
    }



    ///__________ STYLING IN EXCEL TABLE ______________ ///
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
        if (rowNumber === 1) {
          // First set the background of header row
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F1948A' }
          }
          cell.font = {
            color: { argb: '222831' },
            bold: true,
            size: 12,
          }
          cell.views = [{ state: 'frozen', ySplit: 1 }]
        }
        if (rowNumber === 2) {
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
    ///__________ STYLING IN EXCEL TABLE ______________ ///
    sheet4.eachRow((row, rowNumber) => {
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
        if (rowNumber === 1) {
          // First set the background of header row
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'C5EBAA' }
          }
          cell.font = {
            color: { argb: '222831' },
            bold: true,
            size: 12,
          }
          cell.views = [{ state: 'frozen', ySplit: 1 }]
        }
        if (rowNumber === 2) {
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
      anchor.download = "CATS_Tracker.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    })

  }


  useEffect(() => {
    fetchCircleStatus()
  }, [])

  useEffect(() => {
    setCatsData([]);
    setShipped([])
  }, [circle, status])

  return (
    <Slide
      direction='left'
      in='true'
      // style={{ transformOrigin: '0 0 0' }}
      timeout={1000}
    >
      <div>
        <div style={{ margin: 10, marginLeft: 10 }}>
          <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
            <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
            <Link underline="hover" onClick={() => { navigate('/tools/cats_tracker') }}>CATS Tracker</Link>
            <Typography color='text.primary'>Dashboard</Typography>
          </Breadcrumbs>
        </div>
        <div style={{ height: 'auto', width: '99%', margin: '5px 0px', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', border: '0px solid black', backgroundColor: 'white', borderRadius: '10px', padding: '2px', display: 'flex' }}>
          <Grid container spacing={1}>
            <Grid item xs={10} style={{ display: "flex" }}>
              {/* <Box >
                <Tooltip title="Filter list">
                  <IconButton onClick={() => { }}>
                    <FilterAltIcon fontSize='large' color='primary' />
                  </IconButton>
                </Tooltip>
              </Box> */}
              <Box>
                {/* CIRCLE SELECT OPTIONS  */}
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="Circle">Circle</InputLabel>
                  <Select
                    labelId="Circle"
                    id="demo-multiple-chip"
                    multiple={true}
                    value={circle}
                    onChange={handleCircle}
                    input={<OutlinedInput id="select-multiple-chip" label="Circle" />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>All</em>
                      }
                      else {
                        return (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )
                      }

                    }}
                    MenuProps={MenuProps}
                  >
                    <MenuItem onClick={() => { setCircle([]) }}>All</MenuItem>
                    {circleArr?.map((item) => (
                      <MenuItem
                        key={item}
                        value={item}
                      // style={getStyles(name, circle, theme)}
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* STATUS SELECT OPTIONS */}
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="Status">Status</InputLabel>
                  <Select
                    labelId="Status"
                    id="demo-multiple-chip"
                    multiple={true}
                    value={status}
                    onChange={handleStatus}
                    input={<OutlinedInput id="select-multiple-chip" label="Status" />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>All</em>
                      }
                      else {
                        return (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )
                      }

                    }}
                    MenuProps={MenuProps}
                  >
                    <MenuItem onClick={() => { setStatus([]) }}>All</MenuItem>
                    {statusArr?.map((item) => (
                      <MenuItem
                        key={item}
                        value={item}
                      // style={getStyles(name, status, theme)}
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>


              </Box>
              <Box style={{ marginTop: 10 }}>
                <Button onClick={()=>{refetch()}} variant="contained">get data</Button>
              </Box>

            </Grid>
            <Grid item xs={2}>
              <Box style={{ float: 'right' }}>
                <Tooltip title="Export Excel">
                  <IconButton onClick={handleExport}>
                    <DownloadIcon fontSize='large' color='primary' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>

        </div>
        <Box>
          <TableContainer sx={{ maxHeight: '70vh', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', width: "99%", marginTop: 2 }} component={Paper}>

            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th colspan="15" style={{ fontSize: 24, backgroundColor: "#F1948A", color: "", }}>MO Based CATS vs Mobinet Signoff from {month[0]} to {month[month.length - 1]}</th>
                </tr>
                <tr style={{ fontSize: 14, backgroundColor: "#223354", color: "white" }}>
                  <th style={{ border: '1px solid white' }}>4G+5G Module</th>
                  <th style={{ border: '1px solid white' }}>Module Qty dispatched as per TO</th>
                  <th style={{ border: '1px solid white' }}>Module Qty received at site as per TO</th>
                  <th style={{ border: '1px solid white' }}>Module Qty visible in Mobinet</th>
                  <th style={{ border: '1px solid white' }}>Gap CATS vs Mobinet(C-E)</th>
                  <th style={{ border: '1px solid white' }}>Module Available in OSS</th>
                  <th style={{ border: '1px solid white' }}>SREQ Mapped</th>
                  <th style={{ border: '1px solid white' }}>RMO Mapped</th>
                  <th style={{ border: '1px solid white' }}>SREQ/RMO Mapped</th>
                  <th style={{ border: '1px solid white' }}>SREQ/RMO WIP</th>
                  <th style={{ border: '1px solid white' }}>Theft </th>
                  <th style={{ border: '1px solid white' }}>MOS</th>
                  <th style={{ border: '1px solid white' }}>Virtual MO/Regularisation</th>
                  <th style={{ border: '1px solid white' }}>MO Cancelled</th>
                  <th style={{ border: '1px solid white' }}>Under check</th>
                </tr>
              </thead>
              <tbody>
                {data?.responce.data?.map((item, index) => {

                  if (item.Module_Name === 'total') {
                    return (
                      <tr key={index} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 14, fontWeight: 'bold', color: 'white' }}>
                        <th style={{ border: '1px solid black' }}>Total</th>
                        <th style={{ border: '1px solid black' }}>{item.Module_Qty_dispatched_as_per_TO}</th>
                        <th style={{ border: '1px solid black' }}>{item.Module_Qty_received_at_site_as_per_TO}</th>
                        <th style={{ border: '1px solid black' }}>{item.Module_Qty_visible}</th>
                        <th style={{ border: '1px solid black' }}>{item.Gap_CATS_vs_Mobinet}</th>
                        <th style={{ border: '1px solid black' }}>{item.Module_Available_in_OSS}</th>
                        <th style={{ border: '1px solid black' }}>{item.SREQ}</th>
                        <th style={{ border: '1px solid black' }}>{item.RMO}</th>
                        <th style={{ border: '1px solid black' }}>{item.SREQ_RMO}</th>
                        <th style={{ border: '1px solid black' }}>{item.SREQ_RMO_WIP}</th>
                        <th style={{ border: '1px solid black' }}>{item.Theft}</th>
                        <th style={{ border: '1px solid black' }}>{item.MOS}</th>
                        <th style={{ border: '1px solid black' }}>{item.Virtual_MO_Regularisation}</th>
                        <th style={{ border: '1px solid black' }}>{item.MO_Cancelled}</th>
                        <th style={{ border: '1px solid black' }}>{item.Under_check}</th>
                      </tr>
                    )

                  } else {
                    return (
                      <tr key={index} className={classes.hover}>
                        <th style={{ border: '1px solid black' }}>{item.Module_Name}</th>
                        <th style={{ border: '1px solid black' }}>{item.Module_Qty_dispatched_as_per_TO}</th>
                        <th style={{ border: '1px solid black' }}>{item.Module_Qty_received_at_site_as_per_TO}</th>
                        <th style={{ border: '1px solid black' }}>{item.Module_Qty_visible}</th>
                        <th style={{ border: '1px solid black' }}>{item.Gap_CATS_vs_Mobinet}</th>
                        <th style={{ border: '1px solid black' }}>{item.Module_Available_in_OSS}</th>
                        <th style={{ border: '1px solid black' }}>{item.SREQ}</th>
                        <th style={{ border: '1px solid black' }}>{item.RMO}</th>
                        <th style={{ border: '1px solid black' }}>{item.SREQ_RMO}</th>
                        <th style={{ border: '1px solid black' }}>{item.SREQ_RMO_WIP}</th>
                        <th style={{ border: '1px solid black' }}>{item.Theft}</th>
                        <th style={{ border: '1px solid black' }}>{item.MOS}</th>
                        <th style={{ border: '1px solid black' }}>{item.Virtual_MO_Regularisation}</th>
                        <th style={{ border: '1px solid black' }}>{item.MO_Cancelled}</th>
                        <th style={{ border: '1px solid black' }}>{item.Under_check}</th>
                      </tr>
                    )

                  }

                })}
              </tbody>

            </table>
          </TableContainer>
        </Box>
        {/* Table 2 */}
        <Box>
          <TableContainer sx={{ maxHeight:'70vh', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', width: "99%", marginTop: 2, marginBottom: 3 }} component={Paper}>

            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th colspan="15" style={{ fontSize: 24, backgroundColor: "#C5EBAA", color: "", }}>TO vs Shipment Dump Summary From {month[0]} to {month[month.length - 1]}</th>
                </tr>
                <tr style={{ fontSize: 16, backgroundColor: "#223354", color: "white" }}>
                  <th style={{ border: '1px solid white' }}>4G+5G Module</th>
                  <th style={{ border: '1px solid white' }}> QtyShipped</th>
                  <th style={{ border: '1px solid white' }}> Qtyreceived</th>
                </tr>
              </thead>
              <tbody>
                {data?.responce2.data?.map((item, index) => {
                  if (item.Module_name === 'total') {
                    return (<tr key={index} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 14, fontWeight: 'bold', color: 'white' }}>
                      <th style={{ border: '1px solid black' }}>Total</th>
                      <th style={{ border: '1px solid black' }}>{item.QTYSHIPPED}</th>
                      <th style={{ border: '1px solid black' }}>{item.QTYRECEIVED}</th>
                    </tr>)

                  } else {
                    return (
                      <tr key={index} className={classes.hover}>
                        <th style={{ border: '1px solid black' }}>{item.Module_name}</th>
                        <th style={{ border: '1px solid black' }}>{item.QTYSHIPPED}</th>
                        <th style={{ border: '1px solid black' }}>{item.QTYRECEIVED}</th>
                      </tr>
                    )

                  }

                })}
              </tbody>

            </table>
          </TableContainer>
        </Box>

        {loading}
      </div>


    </Slide>
  )
}

export default Dashboard