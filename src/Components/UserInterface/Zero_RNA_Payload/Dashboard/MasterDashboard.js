import React, { useState, useEffect,useMemo } from 'react';
import { Box, Grid, Stack } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DownloadIcon from '@mui/icons-material/Download';
import * as ExcelJS from 'exceljs'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useGet } from '../../../Hooks/GetApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useQuery } from '@tanstack/react-query';
import { useStyles } from '../../ToolsCss'
const MasterDashboard = () => {
    const classes = useStyles()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const { makeGetRequest } = useGet()
    const { loading, action } = useLoadingDialog();
    const [arrDate, setArrDate] = useState([1, 2, 3, 4, 5])
    const [mainData, setMainData] = useState([])


    const { data,isFetching,isFetched, error } = useQuery({
        queryKey: ['zero_RNA_Master_dashboard'],
        queryFn: async () => {
            action(true)
            const res = await makeGetRequest("Zero_Count_Rna_Payload_Tool/master-dashboard_api/");
            if (res) {
                action(false)
                setMainData(res.result)
                // custumObject()
                setArrDate(res.dates)
                // console.log(res)
                return res;
            }
        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })

    // console.log('aaaaaaa',isFetched,isFetching)

    const fetchedQueryData = () => {
        action(false)
        setMainData(data.result)
        setArrDate(data.dates)
    }

    const custumObject = () => {
        // var arr = [];

        // Object.keys(mainData)?.map((item) => {
        //     arr.push({ ...mainData[item], circle: item });
        // })

        return mainData?.map((it) => {
            return (
                <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                    <th style={{ position: "sticky", left: 0, boxShadow: "5px 2px 5px grey", borderRight: "2px solid black",backgroundColor: "#fff"}}>{it?.Circle}</th>
                    <th >{it?.MV_4G_Data_Volume_GB_date_1}</th>
                    <th >{it?.MV_4G_Data_Volume_GB_date_2}</th>
                    <th >{it?.MV_4G_Data_Volume_GB_date_3}</th>
                    <th >{it?.MV_4G_Data_Volume_GB_date_4}</th>
                    <th >{it?.MV_4G_Data_Volume_GB_date_5}</th>
                    <th >{it?.MV_Radio_NW_Availability_date_1}</th>
                    <th >{it?.MV_Radio_NW_Availability_date_2}</th>
                    <th >{it?.MV_Radio_NW_Availability_date_3}</th>
                    <th >{it?.MV_Radio_NW_Availability_date_4}</th>
                    <th >{it?.MV_Radio_NW_Availability_date_5}</th>
                    <th >{it?.MV_VoLTE_raffic_date_1}</th>
                    <th >{it?.MV_VoLTE_raffic_date_2}</th>
                    <th >{it?.MV_VoLTE_raffic_date_3}</th>
                    <th >{it?.MV_VoLTE_raffic_date_4}</th>
                    <th >{it?.MV_VoLTE_raffic_date_5}</th>
                    <th >{it?.MV_DL_User_Throughput_Kbps_date_1}</th>
                    <th >{it?.MV_DL_User_Throughput_Kbps_date_2}</th>
                    <th >{it?.MV_DL_User_Throughput_Kbps_date_3}</th>
                    <th >{it?.MV_DL_User_Throughput_Kbps_date_4}</th>
                    <th >{it?.MV_DL_User_Throughput_Kbps_date_5}</th>
                    <th >{it?.MV_E_UTRAN_Average_CQI_date_1}</th>
                    <th >{it?.MV_E_UTRAN_Average_CQI_date_2}</th>
                    <th >{it?.MV_E_UTRAN_Average_CQI_date_3}</th>
                    <th >{it?.MV_E_UTRAN_Average_CQI_date_4}</th>
                    <th >{it?.MV_E_UTRAN_Average_CQI_date_5}</th>

                    <th >{it?.UL_RSSI_date_1}</th>
                    <th >{it?.UL_RSSI_date_2}</th>
                    <th >{it?.UL_RSSI_date_3}</th>
                    <th >{it?.UL_RSSI_date_4}</th>
                    <th >{it?.UL_RSSI_date_5}</th>

                    <th >{it?.MV_Average_number_of_used_DL_PRBs_date_1}</th>
                    <th >{it?.MV_Average_number_of_used_DL_PRBs_date_2}</th>
                    <th >{it?.MV_Average_number_of_used_DL_PRBs_date_3}</th>
                    <th >{it?.MV_Average_number_of_used_DL_PRBs_date_4}</th>
                    <th >{it?.MV_Average_number_of_used_DL_PRBs_date_5}</th>
                </tr>
            );
        });
    }

    const memoCustumObject = useMemo(() => {
        return custumObject()
    }, [data])





    // handleExport Range wise table in excel formet.........
    const handleExport = () => {


        const workbook = new ExcelJS.Workbook();
        const sheet3 = workbook.addWorksheet("4G Dashboard", { properties: { tabColor: { argb: 'f1948a' } } })

        sheet3.mergeCells('A1:A2');
        sheet3.mergeCells('B1:F1');
        sheet3.mergeCells('G1:K1');
        sheet3.mergeCells('L1:P1');
        sheet3.mergeCells('Q1:U1');
        sheet3.mergeCells('V1:Z1');
        sheet3.mergeCells('AA1:AE1');
        sheet3.mergeCells('AF1:AJ1');

        sheet3.getCell('A1').value = 'Circle';
        sheet3.getCell('B1').value = 'ZERO Payload (4G)';
        sheet3.getCell('G1').value = 'ZERO RNA (4G)';
        sheet3.getCell('L1').value = 'ZERO VOLTE TRAFFIC';
        sheet3.getCell('Q1').value = 'MV DL User Throughtput Kbps';
        sheet3.getCell('V1').value = 'MV EUTRAN Average CQI';
        sheet3.getCell('AA1').value = 'UL RSSI';
        sheet3.getCell('AF1').value = 'MV Average Number Of Used DL PRBs';

        sheet3.getCell('B2').value = `${arrDate[0]}`;
        sheet3.getCell('C2').value = `${arrDate[1]}`;
        sheet3.getCell('D2').value = `${arrDate[2]}`;
        sheet3.getCell('E2').value = `${arrDate[3]}`;
        sheet3.getCell('F2').value = `${arrDate[4]}`;

        sheet3.getCell('G2').value = `${arrDate[0]}`;
        sheet3.getCell('H2').value = `${arrDate[1]}`;
        sheet3.getCell('I2').value = `${arrDate[2]}`;
        sheet3.getCell('J2').value = `${arrDate[3]}`;
        sheet3.getCell('K2').value = `${arrDate[4]}`;

        sheet3.getCell('L2').value = `${arrDate[0]}`;
        sheet3.getCell('M2').value = `${arrDate[1]}`;
        sheet3.getCell('N2').value = `${arrDate[2]}`;
        sheet3.getCell('O2').value = `${arrDate[3]}`;
        sheet3.getCell('P2').value = `${arrDate[4]}`;

        sheet3.getCell('Q2').value = `${arrDate[0]}`;
        sheet3.getCell('R2').value = `${arrDate[1]}`;
        sheet3.getCell('S2').value = `${arrDate[2]}`;
        sheet3.getCell('T2').value = `${arrDate[3]}`;
        sheet3.getCell('U2').value = `${arrDate[4]}`;

        sheet3.getCell('V2').value = `${arrDate[0]}`;
        sheet3.getCell('W2').value = `${arrDate[1]}`;
        sheet3.getCell('X2').value = `${arrDate[2]}`;
        sheet3.getCell('Y2').value = `${arrDate[3]}`;
        sheet3.getCell('Z2').value = `${arrDate[4]}`;

        sheet3.getCell('AA2').value = `${arrDate[0]}`;
        sheet3.getCell('AB2').value = `${arrDate[1]}`;
        sheet3.getCell('AC2').value = `${arrDate[2]}`;
        sheet3.getCell('AD2').value = `${arrDate[3]}`;
        sheet3.getCell('AE2').value = `${arrDate[4]}`;

        sheet3.getCell('AF2').value = `${arrDate[0]}`;
        sheet3.getCell('AG2').value = `${arrDate[1]}`;
        sheet3.getCell('AH2').value = `${arrDate[2]}`;
        sheet3.getCell('AI2').value = `${arrDate[3]}`;
        sheet3.getCell('AJ2').value = `${arrDate[4]}`;





        sheet3.columns = [
            { key: 'Circle' },
            { key: 'MV_4G_Data_Volume_GB_date_1' },
            { key: 'MV_4G_Data_Volume_GB_date_2' },
            { key: 'MV_4G_Data_Volume_GB_date_3' },
            { key: 'MV_4G_Data_Volume_GB_date_4' },
            { key: 'MV_4G_Data_Volume_GB_date_5' },
            { key: 'MV_Radio_NW_Availability_date_1' },
            { key: 'MV_Radio_NW_Availability_date_2' },
            { key: 'MV_Radio_NW_Availability_date_3' },
            { key: 'MV_Radio_NW_Availability_date_4' },
            { key: 'MV_Radio_NW_Availability_date_5' },
            { key: 'MV_VoLTE_raffic_date_1' },
            { key: 'MV_VoLTE_raffic_date_2' },
            { key: 'MV_VoLTE_raffic_date_3' },
            { key: 'MV_VoLTE_raffic_date_4' },
            { key: 'MV_VoLTE_raffic_date_5' },
            { key: 'MV_DL_User_Throughput_Kbps_date_1' },
            { key: 'MV_DL_User_Throughput_Kbps_date_2' },
            { key: 'MV_DL_User_Throughput_Kbps_date_3' },
            { key: 'MV_DL_User_Throughput_Kbps_date_4' },
            { key: 'MV_DL_User_Throughput_Kbps_date_5' },
            { key: 'MV_E_UTRAN_Average_CQI_date_1' },
            { key: 'MV_E_UTRAN_Average_CQI_date_2' },
            { key: 'MV_E_UTRAN_Average_CQI_date_3' },
            { key: 'MV_E_UTRAN_Average_CQI_date_4' },
            { key: 'MV_E_UTRAN_Average_CQI_date_5' },
            { key: 'UL_RSSI_date_1' },
            { key: 'UL_RSSI_date_2' },
            { key: 'UL_RSSI_date_3' },
            { key: 'UL_RSSI_date_4' },
            { key: 'UL_RSSI_date_5' },
            { key: 'MV_Average_number_of_used_DL_PRBs_date_1' },
            { key: 'MV_Average_number_of_used_DL_PRBs_date_2' },
            { key: 'MV_Average_number_of_used_DL_PRBs_date_3' },
            { key: 'MV_Average_number_of_used_DL_PRBs_date_4' },
            { key: 'MV_Average_number_of_used_DL_PRBs_date_5' },
        ]




        mainData?.map(item => {
            sheet3.addRow({
                Circle: item?.Circle,
                MV_4G_Data_Volume_GB_date_1: item.MV_4G_Data_Volume_GB_date_1,
                MV_4G_Data_Volume_GB_date_2: item.MV_4G_Data_Volume_GB_date_2,
                MV_4G_Data_Volume_GB_date_3: item.MV_4G_Data_Volume_GB_date_3,
                MV_4G_Data_Volume_GB_date_4: item.MV_4G_Data_Volume_GB_date_4,
                MV_4G_Data_Volume_GB_date_5: item.MV_4G_Data_Volume_GB_date_5,
                MV_Radio_NW_Availability_date_1: item.MV_Radio_NW_Availability_date_1,
                MV_Radio_NW_Availability_date_2: item.MV_Radio_NW_Availability_date_2,
                MV_Radio_NW_Availability_date_3: item.MV_Radio_NW_Availability_date_3,
                MV_Radio_NW_Availability_date_4: item.MV_Radio_NW_Availability_date_4,
                MV_Radio_NW_Availability_date_5: item.MV_Radio_NW_Availability_date_5,
                MV_VoLTE_raffic_date_1: item.MV_VoLTE_raffic_date_1,
                MV_VoLTE_raffic_date_2: item.MV_VoLTE_raffic_date_2,
                MV_VoLTE_raffic_date_3: item.MV_VoLTE_raffic_date_3,
                MV_VoLTE_raffic_date_4: item.MV_VoLTE_raffic_date_4,
                MV_VoLTE_raffic_date_5: item.MV_VoLTE_raffic_date_5,
             MV_DL_User_Throughput_Kbps_date_1: item?.MV_DL_User_Throughput_Kbps_date_1,
             MV_DL_User_Throughput_Kbps_date_2: item?.MV_DL_User_Throughput_Kbps_date_2,
             MV_DL_User_Throughput_Kbps_date_3: item?.MV_DL_User_Throughput_Kbps_date_3,
             MV_DL_User_Throughput_Kbps_date_4: item?.MV_DL_User_Throughput_Kbps_date_4,
             MV_DL_User_Throughput_Kbps_date_5: item?.MV_DL_User_Throughput_Kbps_date_5,
             MV_E_UTRAN_Average_CQI_date_1: item?.MV_E_UTRAN_Average_CQI_date_1,
             MV_E_UTRAN_Average_CQI_date_2: item?.MV_E_UTRAN_Average_CQI_date_2,
             MV_E_UTRAN_Average_CQI_date_3: item?.MV_E_UTRAN_Average_CQI_date_3,
             MV_E_UTRAN_Average_CQI_date_4: item?.MV_E_UTRAN_Average_CQI_date_4,
             MV_E_UTRAN_Average_CQI_date_5: item?.MV_E_UTRAN_Average_CQI_date_5,
             UL_RSSI_date_1: item?.UL_RSSI_date_1,
             UL_RSSI_date_2: item?.UL_RSSI_date_2,
             UL_RSSI_date_3: item?.UL_RSSI_date_3,
             UL_RSSI_date_4: item?.UL_RSSI_date_4,
             UL_RSSI_date_5: item?.UL_RSSI_date_5,
             MV_Average_number_of_used_DL_PRBs_date_1: item?.MV_Average_number_of_used_DL_PRBs_date_1,
             MV_Average_number_of_used_DL_PRBs_date_2: item?.MV_Average_number_of_used_DL_PRBs_date_2,
             MV_Average_number_of_used_DL_PRBs_date_3: item?.MV_Average_number_of_used_DL_PRBs_date_3,
             MV_Average_number_of_used_DL_PRBs_date_4: item?.MV_Average_number_of_used_DL_PRBs_date_4,
             MV_Average_number_of_used_DL_PRBs_date_5: item?.MV_Average_number_of_used_DL_PRBs_date_5,
            })
        })


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
                if (rowNumber === 1 || rowNumber === 2) {
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
            anchor.download = "Zero_RNA_Payload(Master_Dashboard).xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }

    const handleClose = () => {
        setOpen(false)
    }


    // date send format function .........////
    const handleDateFormat = (data) => {
        const originalDate = new Date(data);

        const formattedDate = `${originalDate.getFullYear()}-${String(originalDate.getMonth() + 1).padStart(2, '0')}-${String(originalDate.getDate()).padStart(2, '0')} ${String(originalDate.getHours()).padStart(2, '0')}:${String(originalDate.getMinutes()).padStart(2, '0')}:${String(originalDate.getSeconds()).padStart(2, '0')}`;

        return formattedDate
    }

    // ********** Filter Dialog Box **********//
    // const filterDialog = () => {
    //     return (
    //         <Dialog
    //             open={open}
    //             onClose={handleClose}
    //             keepMounted
    //             style={{ zIndex: 5 }}
    //         >
    //             {/* <DialogTitle><span style={{ fontSize: 22, fontWeight: 'bold' }}><u>Filter Table</u></span></DialogTitle> */}
    //             <DialogContent style={{ backgroundColor: 'rgb(155, 208, 242,0.5)' }}>
    //                 <Stack direction='column'>

    //                     <Box><span style={{ fontSize: 18, fontWeight: 'bold' }}>Range Date Wise </span></Box>
    //                     <Box style={{ height: 'auto', width: 'auto', padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
    //                         <Box style={{ display: 'flex', justifyContent: 'center', placeItems: 'center', fontWeight: 'bold' }}>
    //                             <span>From:</span>
    //                             <LocalizationProvider dateAdapter={AdapterDayjs} >
    //                                 <MobileDateTimePicker value={fromDate} onChange={(e) => { setFromDate(handleDateFormat(e.$d)) }} />
    //                             </LocalizationProvider>
    //                             <span>To:</span>
    //                             <LocalizationProvider dateAdapter={AdapterDayjs}>
    //                                 <MobileDateTimePicker value={toDate} onChange={(e) => { setToDate(handleDateFormat(e.$d)) }} />
    //                             </LocalizationProvider>
    //                         </Box>


    //                         {/* <Box><span style={{ fontWeight: 'bold',fontSize:'16px' }}>From </span><input value={fromDate} max={todayDate} type="date" onChange={(e) => { setFromDate(e.target.value); setDate(''); setDisplayFilter('Range Date Wise:') }} style={{height:'35px',width:'150px',fontSize:'18px',border:'1px solid #eaedf0',borderRadius:5,textAlign:'center'}}/> ~ <span style={{ fontWeight: 'bold',fontSize:'16px' }}>To </span><input  value={toDate} type="date" min={fromDate}  max={todayDate} onChange={(e) => { setToDate(e.target.value); setDate('') }} style={{height:'35px',width:'150px',fontSize:'18px',border:'1px solid #eaedf0',borderRadius:5,textAlign:'center'}}/></Box> */}
    //                     </Box>
    //                 </Stack>
    //             </DialogContent>
    //             <DialogActions style={{ backgroundColor: '#B0D9F3', display: 'flex', justifyContent: 'space-between' }}>
    //                 <Button variant='contained' color='secondary' endIcon={<DeleteOutlineIcon />}>clear</Button>
    //                 <Button variant='contained' color='success' endIcon={<PublishIcon />} >submit</Button>
    //                 <Button onClick={handleClose} variant='contained' color='error' endIcon={<ClearIcon />}>cancel</Button>
    //             </DialogActions>

    //         </Dialog>
    //     )
    // }

    useEffect(() => {
        if (data) {
            fetchedQueryData();
        }

        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 10 }}>
                    <div style={{ margin: 5, marginLeft: 10,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                            <Link underline="hover" onClick={()=>{ navigate('/tools/zero_RNA_payload')}}>Zero RNA Payload</Link>
                            <Typography color='text.primary'>Master Dashboard</Typography>
                        </Breadcrumbs>
                        <Box style={{ float: 'right' }}>
                                    <Tooltip title="Export Excel">
                                        <IconButton onClick={() => { handleExport(); }}>
                                            <DownloadIcon fontSize='medium' color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                    </div>
                    {/* <div style={{ height: 'auto', width: '100%', margin: '5px 0px', border: '1px solid black', borderRadius: '10px', padding: '2px', display: 'flex' }}>
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
                                            <DownloadIcon fontSize='medium' color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        </Grid>

                    </div> */}

                    {/* ************* 4G  TABLE DATA ************** */}

                    <Box >

                        <TableContainer sx={{ maxHeight: '80vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper} >

                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                {/* <tr>
                    <th colspan="8" style={{ fontSize: 24, backgroundColor: "#F1948A", color: "", }}>RANGE WISE</th>
                </tr> */}
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan='2'  style={{ position: "sticky", left: 0, boxShadow: "5px 2px 5px grey", borderRight: "2px solid black",backgroundColor: "#223354",}}>Circle</th>

                                        <th colSpan='5' style={{ backgroundColor: '#17A589' }}>ZERO Payload (4G)</th>
                                        <th colSpan='5' style={{ backgroundColor: '#2ECC71' }}>ZERO RNA (4G)</th>
                                        <th colSpan='5' style={{ backgroundColor: '#5DADE2' }}>ZERO VOLTE TRAFFIC</th>
                                        <th colSpan='5' style={{ backgroundColor: '#E59866' }}>MV DL User Throughtput Kbps</th>
                                        <th colSpan='5' style={{ backgroundColor: '#F4D03F' }}>MV EUTRAN Average CQI</th>
                                        <th colSpan='5' style={{ backgroundColor: '#AF7AC5' }}>UL RSSI</th>
                                        <th colSpan='5' style={{ backgroundColor: '#E59866' }}>MV Average Number Of Used DL PRBs</th>
                                        {/* <th colSpan='5'>ZERO 2G TRAFFIC</th> */}
                                    </tr>
                                    <tr style={{ fontSize: 14, backgroundColor: "#223354", color: "white", }}>

                                        {arrDate?.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#148F77' }}>{date}</th>
                                        ))}

                                        {arrDate?.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#239B56' }}>{date}</th>
                                        ))}

                                        {arrDate?.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#2E86C1' }}>{date}</th>
                                        ))}


                                        {arrDate?.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#DC7633' }}>{date}</th>
                                        ))}
                                        {arrDate?.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#F1C40F' }}>{date}</th>
                                        ))}
                                        {arrDate?.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#9B59B6' }}>{date}</th>
                                        ))}
                                        {arrDate?.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#DC7633' }}>{date}</th>
                                        ))}


                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {mainData?.map((it) => (
                                        <tr style={{ textAlign: "center", fontWeigth: 700 }}>
                                            <th >{it?.circle}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_date_1}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_date_2}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_date_3}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_date_4}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_date_5}</th>
                                            <th >{it?.MV_Radio_NW_Availability_date_1}</th>
                                            <th >{it?.MV_Radio_NW_Availability_date_2}</th>
                                            <th >{it?.MV_Radio_NW_Availability_date_3}</th>
                                            <th >{it?.MV_Radio_NW_Availability_date_4}</th>
                                            <th >{it?.MV_Radio_NW_Availability_date_5}</th>
                                            <th >{it?.MV_VoLTE_raffic_date_1}</th>
                                            <th >{it?.MV_VoLTE_raffic_date_2}</th>
                                            <th >{it?.MV_VoLTE_raffic_date_3}</th>
                                            <th >{it?.MV_VoLTE_raffic_date_4}</th>
                                            <th >{it?.MV_VoLTE_raffic_date_5}</th>
                                        </tr>
                                    ))} */}
                                    {memoCustumObject}

                                </tbody>


                            </table>
                        </TableContainer>
                    </Box>

                </div>
            </Slide>


            {/* {filterDialog()} */}
            {loading}
        </>
    )
}

export default MasterDashboard