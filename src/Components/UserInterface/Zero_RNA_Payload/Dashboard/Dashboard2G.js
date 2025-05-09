import React, { useState, useEffect } from 'react';
import { Box, Grid, Stack } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
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
import Slide from '@mui/material/Slide';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useGet } from '../../../Hooks/GetApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useQuery } from '@tanstack/react-query';





const Dashboard2G = () => {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const [displayFilterData, setDisplayFilterData] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const { response, makeGetRequest } = useGet()
    const { loading, action } = useLoadingDialog();
    const [arrDateT2, setArrDateT2] = useState([1, 2, 3, 4, 5])
    const [mainDataT2, setMainDataT2] = useState([])

    const { isPending,isFetching, isError, data, error } = useQuery({
        queryKey: ['zero_RNA_2G_payload'],
        queryFn: async () => {
            action(isPending)
            const res = await makeGetRequest("Zero_Count_Rna_Payload_Tool/kpi_trend_2g_api");
            if (res) {
                action(false)
                return res;
            }
        },
        staleTime: 100000,
        refetchOnReconnect:false,
    })










    const fetchZeroRNA = async () => {
        action(true)

        // const responce = await makeGetRequest('Zero_Count_Rna_Payload_App/kpi_trend_4g_api')
        const responce1 = await makeGetRequest('Zero_Count_Rna_Payload_Tool/kpi_trend_2g_api')
        if (responce1) {
            action(false)
            // testingFun(responce.data[0])
            // setMainData(responce.data)
            // setArrDate(responce.dates_data)
            setArrDateT2(responce1.dates_data)
            setMainDataT2(responce1.data)
            // console.log( responce1)
        }
        else {
            action(false)
        }

    }


    // handleExport Range wise table in excel formet.........
    const handleExport = () => {

        const workbook = new ExcelJS.Workbook();
        const sheet3 = workbook.addWorksheet("2G Dashboard", { properties: { tabColor: { argb: 'f1948a' } } })
        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';



        // sheet3.mergeCells('A1:S1');
        sheet3.mergeCells('A1:A2');
        sheet3.mergeCells('B1:B2');
        sheet3.mergeCells('C1:C2');
        sheet3.mergeCells('D1:D2');
        sheet3.mergeCells('E1:E2');
        sheet3.mergeCells('F1:F2');
        sheet3.mergeCells('G1:G2');
        sheet3.mergeCells('H1:N1');
        sheet3.mergeCells('O1:U1');
        sheet3.mergeCells('V1:AB1');

        sheet3.getCell('A1').value = 'Circle';
        sheet3.getCell('B1').value = 'Cell Name';
        sheet3.getCell('C1').value = 'Site ID';
        sheet3.getCell('D1').value = 'OEM';
        sheet3.getCell('E1').value = 'MS1 Date';
        sheet3.getCell('F1').value = 'Project';
        sheet3.getCell('G1').value = 'Technology';
        sheet3.getCell('H1').value = 'MV of 2G Cell With Network Availability';
        sheet3.getCell('O1').value = 'Network Availability RNA';
        sheet3.getCell('V1').value = 'MV Total Voice Traffic BBH';
        sheet3.getCell('H2').value = 'Week-2';
        sheet3.getCell('I2').value = 'Week-1';
        sheet3.getCell('J2').value = `${arrDateT2[0]}`;
        sheet3.getCell('K2').value = `${arrDateT2[1]}`;
        sheet3.getCell('L2').value = `${arrDateT2[2]}`;
        sheet3.getCell('M2').value = `${arrDateT2[3]}`;
        sheet3.getCell('N2').value = `${arrDateT2[4]}`;
        sheet3.getCell('O2').value = 'Week-2';
        sheet3.getCell('P2').value = 'Week-1';
        sheet3.getCell('Q2').value = `${arrDateT2[0]}`;
        sheet3.getCell('R2').value = `${arrDateT2[1]}`;
        sheet3.getCell('S2').value = `${arrDateT2[2]}`;
        sheet3.getCell('T2').value = `${arrDateT2[3]}`;
        sheet3.getCell('U2').value = `${arrDateT2[4]}`;
        sheet3.getCell('V2').value = 'Week-2';
        sheet3.getCell('W2').value = 'Week-1';
        sheet3.getCell('X2').value = `${arrDateT2[0]}`;
        sheet3.getCell('Y2').value = `${arrDateT2[1]}`;
        sheet3.getCell('Z2').value = `${arrDateT2[2]}`;
        sheet3.getCell('AA2').value = `${arrDateT2[3]}`;
        sheet3.getCell('AB2').value = `${arrDateT2[4]}`;



        sheet3.columns = [
            { key: 'Circle' },
            { key: 'Short_name_nan' },
            { key: 'site_ID' },
            { key: 'OEM_GGSN_nan' },
            { key: 'ms1_Date' },
            { key: 'project' },
            { key: 'MV_Freq_Band_nan' },
            { key: 'MV_of_2G_Cell_with_Network_Availability_week_2' },
            { key: 'MV_of_2G_Cell_with_Network_Availability_week_1' },
            { key: 'MV_of_2G_Cell_with_Network_Availability_date_1' },
            { key: 'MV_of_2G_Cell_with_Network_Availability_date_2' },
            { key: 'MV_of_2G_Cell_with_Network_Availability_date_3' },
            { key: 'MV_of_2G_Cell_with_Network_Availability_date_4' },
            { key: 'MV_of_2G_Cell_with_Network_Availability_date_5' },
            { key: 'Network_availability_RNA_week_2' },
            { key: 'Network_availability_RNA_week_1' },
            { key: 'Network_availability_RNA_date_1' },
            { key: 'Network_availability_RNA_date_2' },
            { key: 'Network_availability_RNA_date_3' },
            { key: 'Network_availability_RNA_date_4' },
            { key: 'Network_availability_RNA_date_5' },
            { key: 'MV_Total_Voice_Traffic_BBH_week_2' },
            { key: 'MV_Total_Voice_Traffic_BBH_week_1' },
            { key: 'MV_Total_Voice_Traffic_BBH_date_1' },
            { key: 'MV_Total_Voice_Traffic_BBH_date_2' },
            { key: 'MV_Total_Voice_Traffic_BBH_date_3' },
            { key: 'MV_Total_Voice_Traffic_BBH_date_4' },
            { key: 'MV_Total_Voice_Traffic_BBH_date_5' },


        ]


        mainDataT2?.map(item => {
            sheet3.addRow({
                Circle: item?.Circle,
                Short_name_nan: item?.Short_name_nan,
                site_ID: item?.site_ID,
                OEM_GGSN_nan: item?.OEM_GGSN_nan,
                ms1_Date: item?.ms1_Date,
                project: item?.project,
                MV_Freq_Band_nan: item?.MV_Freq_Band_nan,
                MV_of_2G_Cell_with_Network_Availability_week_2: item.MV_of_2G_Cell_with_Network_Availability_week_2,
                MV_of_2G_Cell_with_Network_Availability_week_1: item.MV_of_2G_Cell_with_Network_Availability_week_1,
                MV_of_2G_Cell_with_Network_Availability_date_1: item.MV_of_2G_Cell_with_Network_Availability_date_1,
                MV_of_2G_Cell_with_Network_Availability_date_2: item.MV_of_2G_Cell_with_Network_Availability_date_2,
                MV_of_2G_Cell_with_Network_Availability_date_3: item.MV_of_2G_Cell_with_Network_Availability_date_3,
                MV_of_2G_Cell_with_Network_Availability_date_4: item.MV_of_2G_Cell_with_Network_Availability_date_4,
                MV_of_2G_Cell_with_Network_Availability_date_5: item.MV_of_2G_Cell_with_Network_Availability_date_5,
                Network_availability_RNA_week_2: item.Network_availability_RNA_week_2,
                Network_availability_RNA_week_1: item.Network_availability_RNA_week_1,
                Network_availability_RNA_date_1: item.Network_availability_RNA_date_1,
                Network_availability_RNA_date_2: item.Network_availability_RNA_date_2,
                Network_availability_RNA_date_3: item.Network_availability_RNA_date_3,
                Network_availability_RNA_date_4: item.Network_availability_RNA_date_4,
                Network_availability_RNA_date_5: item.Network_availability_RNA_date_5,
                MV_Total_Voice_Traffic_BBH_week_2: item.MV_Total_Voice_Traffic_BBH_week_2,
                MV_Total_Voice_Traffic_BBH_week_1: item.MV_Total_Voice_Traffic_BBH_week_1,
                MV_Total_Voice_Traffic_BBH_date_1: item.MV_Total_Voice_Traffic_BBH_date_1,
                MV_Total_Voice_Traffic_BBH_date_2: item.MV_Total_Voice_Traffic_BBH_date_2,
                MV_Total_Voice_Traffic_BBH_date_3: item.MV_Total_Voice_Traffic_BBH_date_3,
                MV_Total_Voice_Traffic_BBH_date_4: item.MV_Total_Voice_Traffic_BBH_date_4,
                MV_Total_Voice_Traffic_BBH_date_5: item.MV_Total_Voice_Traffic_BBH_date_5,
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
            anchor.download = "GSM_KPI_TREND.xlsx";
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
                    <Button variant='contained' color='secondary' endIcon={<DeleteOutlineIcon />}>clear</Button>
                    <Button variant='contained' color='success' endIcon={<PublishIcon />} >submit</Button>
                    <Button onClick={handleClose} variant='contained' color='error' endIcon={<ClearIcon />}>cancel</Button>
                </DialogActions>

            </Dialog>
        )
    }


    const getCircleName = (name) => {
        let match = name.match(/Sams/);
        if (match) {
            return (name.split(',')[1].split('_')[0])
        } else {

            return (name.split('_')[0])
        }
    }

    useEffect(() => {
        // action(isPending)
        // fetchZeroRNA();
        // testingFun();

        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 10 }}>
                    <div style={{ margin: 5, marginLeft: 10 ,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                            <Link underline="hover" onClick={() => { navigate('/tools/zero_rna_payload') }}>Zero RNA Payload</Link>
                            <Typography color='text.primary'>GSM KPI Trend</Typography>
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
                                            <DownloadIcon fontSize='large' color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        </Grid>

                    </div> */}

                    {/* ************* 2G  TABLE DATA ************** */}

                    <Box sx={{ marginTop: 0 }}>

                        <TableContainer sx={{ maxHeight: '70vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Circle</th>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Cell Name</th>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Site ID</th>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>OEM</th>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>MS1 Date</th>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Project</th>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Technology</th>
                                        <th colSpan='7' style={{ width: 150 }}>MV of 2G Cell With Network Availability</th>
                                        <th colSpan='7'>Network Availability RNA</th>
                                        <th colSpan='7'>MV Total Voice Traffic BBH</th>
                                    </tr>
                                    <tr style={{ fontSize: 14, backgroundColor: "#223354", color: "white", }}>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}> Week-2 </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates_data?.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates_data?.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates_data?.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.data?.map((it) => (
                                        <tr style={{ textAlign: "center", fontWeigth: 700 }}>
                                            <th >{getCircleName(it?.Short_name_nan)}</th>
                                            <th >{it?.Short_name_nan}</th>
                                            <th >{it?.site_ID}</th>
                                            <th >{it?.OEM_GGSN_nan}</th>
                                            <th >{it?.ms1_Date}</th>
                                            <th >{it?.project}</th>
                                            <th >{it?.MV_Freq_Band_nan}</th>
                                            <th >{it?.MV_of_2G_Cell_with_Network_Availability_week_2}</th>
                                            <th >{it?.MV_of_2G_Cell_with_Network_Availability_week_1}</th>
                                            <th >{it?.MV_of_2G_Cell_with_Network_Availability_date_1}</th>
                                            <th >{it?.MV_of_2G_Cell_with_Network_Availability_date_2}</th>
                                            <th >{it?.MV_of_2G_Cell_with_Network_Availability_date_3}</th>
                                            <th >{it?.MV_of_2G_Cell_with_Network_Availability_date_4}</th>
                                            <th >{it?.MV_of_2G_Cell_with_Network_Availability_date_5}</th>
                                            <th >{it?.Network_availability_RNA_week_2}</th>
                                            <th >{it?.Network_availability_RNA_week_1}</th>
                                            <th >{it?.Network_availability_RNA_date_1}</th>
                                            <th >{it?.Network_availability_RNA_date_2}</th>
                                            <th >{it?.Network_availability_RNA_date_3}</th>
                                            <th >{it?.Network_availability_RNA_date_4}</th>
                                            <th >{it?.Network_availability_RNA_date_5}</th>
                                            <th >{it?.MV_Total_Voice_Traffic_BBH_week_2}</th>
                                            <th >{it?.MV_Total_Voice_Traffic_BBH_week_1}</th>
                                            <th >{it?.MV_Total_Voice_Traffic_BBH_date_1}</th>
                                            <th >{it?.MV_Total_Voice_Traffic_BBH_date_2}</th>
                                            <th >{it?.MV_Total_Voice_Traffic_BBH_date_3}</th>
                                            <th >{it?.MV_Total_Voice_Traffic_BBH_date_4}</th>
                                            <th >{it?.MV_Total_Voice_Traffic_BBH_date_5}</th>
                                        </tr>
                                    ))}

                                </tbody>


                            </table>
                        </TableContainer>
                    </Box>

                </div>
            </Slide>


            {filterDialog()}
            {loading}
        </>
    )
}

export default Dashboard2G