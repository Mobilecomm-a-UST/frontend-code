import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import * as ExcelJS from 'exceljs'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useGet } from '../../../Hooks/GetApis';
import { usePost } from '../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useQuery } from '@tanstack/react-query';
import { useStyles } from '../../ToolsCss'


const colorType = ['#223354', '#2c426d', '#3b5891', '#4a6eb5', '#ffe6cc']

const WeekWisePayload = () => {
    const classes = useStyles()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const { response, makeGetRequest } = useGet()
    const { makePostRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const [mainDataT2, setMainDataT2] = useState([])
    const [tableData, setTableData] = useState([])
    const [totalTable, setTotalTable] = useState([])
    const [totalOpen, setTotalOpen] = useState(false)
    const [currentDate, setCurrentDate] = useState('')
    const [previousDate, setPreviousDate] = useState('')


    const { isPending, isFetching, isError, data, error } = useQuery({
        queryKey: ['zero_RNA_payload_A_A'],
        queryFn: async () => {
            action(isPending)
            const res = await makeGetRequest("Zero_Count_Rna_Payload_Tool/Week_Wise_Dashboard/");
            if (res) {
                action(false)
                // ArrengJsonData(res.circle_counts)
                return res;
            }
        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })


    // console.log('temp', data)

    const convertDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        return `${day}-${month}`;
    };


    const ArrengJsonData = (value) => {
        var arr = []

        Object.keys(value)?.map((item) => {
            arr.push({ ...value[item], Circle: item });
        })

        // console.log('test' , arr)
        setTableData(arr)
    }

    const handleClose = () => {
        setOpen(false)
        setTotalOpen(false)
    }

    // handleExport Range wise table in excel formet.........
    const handleExport = () => {

        const workbook = new ExcelJS.Workbook();
        const sheet3 = workbook.addWorksheet("week wise payload", { properties: { tabColor: { argb: 'f1948a' } } })
        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';

        // sheet3.mergeCells('A1:S1');
        sheet3.mergeCells('A1:A3');
        sheet3.mergeCells('F1:F3');
        sheet3.mergeCells('B1:E1');

        sheet3.getCell('A1').value = 'Circle';
        sheet3.getCell('B1').value = `${convertDate(data?.previous_date)} ~ ${convertDate(data?.latest_date)}`;
        sheet3.getCell('B2').value = 'P-0';
        sheet3.getCell('B3').value = '> 100GB';
        sheet3.getCell('C2').value = 'P-1';
        sheet3.getCell('C3').value = '≥ 50GB < 100GB';
        sheet3.getCell('D2').value = 'P-2';
        sheet3.getCell('D3').value = '≥ 30GB < 50GB';
        sheet3.getCell('E2').value = 'P-3';
        sheet3.getCell('E3').value = '≥ 10GB < 30GB';
        sheet3.getCell('F1').value = 'Total';

        sheet3.columns = [
            { key: 'Circle' },
            { key: 'P0' },
            { key: 'P1' },
            { key: 'P2' },
            { key: 'P3' },
            { key: 'total' },
        ]

        data?.data.map(item => {
            sheet3.addRow({
                Circle: item?.Circle,
                P0: (item?.P0 ? item.P0 : 0),
                P1: (item?.P1 ? item.P1 : 0),
                P2: (item?.P2 ? item.P2 : 0),
                P3: (item?.P3 ? item.P3 : 0),
                total: item?.total,
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

                if (rowNumber === 1 || rowNumber === 2 || rowNumber === 3) {
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
            anchor.download = "week_wise_payload_Analysis.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }

    // handleexportTotal range wise...............
    const handleExportTotal = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet3 = workbook.addWorksheet("week wise Total", { properties: { tabColor: { argb: 'f1948a' } } })
        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';



        // sheet3.mergeCells('A1:S1');


        sheet3.getCell('A1').value = 'Circle';
        sheet3.getCell('B1').value = 'Short Name';
        sheet3.getCell('C1').value = `${currentDate}`;
        sheet3.getCell('D1').value = `${previousDate}`;
        sheet3.getCell('E1').value = 'Site Priority';
        sheet3.getCell('F1').value = 'Delta';


        sheet3.columns = [
            { key: 'Circle' },
            { key: 'Short_name' },
            { key: 'MV_4G_Data_Volume_GB_current_date' },
            { key: 'MV_4G_Data_Volume_GB_previous_date' },
            { key: 'depth' },
            { key: 'Delta' },
        ]

        totalTable?.map(item => {
            sheet3.addRow({
                Circle: item?.Circle,
                Short_name: (item?.Short_name ? item.Short_name : 0),
                MV_4G_Data_Volume_GB_current_date: (item?.MV_4G_Data_Volume_GB_current_date ? item.MV_4G_Data_Volume_GB_current_date : 0),
                MV_4G_Data_Volume_GB_previous_date: (item?.MV_4G_Data_Volume_GB_previous_date ? item.MV_4G_Data_Volume_GB_previous_date : 0),
                depth: (item?.depth ? item.depth : 0),
                Delta: item?.Delta,
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
            anchor.download = "Total_Payload_Week_Wise_Tracker.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })
    }

    // ********** Filter Dialog Box **********//
    const filterDialog = useCallback(() => {
        return (
            <Dialog
                open={open}
                // onClose={handleClose}
                keepMounted
                fullWidth
                maxWidth={'md'}
                style={{ zIndex: 5 }}
            >
                <DialogTitle>Cell Name Table <span style={{ float: 'right' }}><IconButton size="large" onClick={handleClose}><CloseIcon /></IconButton></span></DialogTitle>

                <DialogContent >
                    <TableContainer sx={{ maxHeight: 400, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Circle</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Short Name</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{currentDate}</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{previousDate}</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Site Priority</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Delta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mainDataT2?.map((item) => (
                                    <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                        <th>{item.Circle}</th>
                                        <th>{item.Short_name}</th>
                                        <th>{item.MV_4G_Data_Volume_GB_current_date}</th>
                                        <th>{item.MV_4G_Data_Volume_GB_previous_date}</th>
                                        <th>{item.depth}</th>
                                        <th>{item.Delta}</th>
                                    </tr>
                                ))}
                            </tbody>


                        </table>
                    </TableContainer>

                </DialogContent>
            </Dialog>
        )
    }, [mainDataT2, open])

    const ClickDataGet = async (props) => {
        action(true)
        var formData = new FormData();
        formData.append("circle", props.circle);
        formData.append("delta", props.delta);

        const responce = await makePostRequest('Zero_Count_Rna_Payload_Tool/Hyperlink_Week_Wise_Dashboard/', formData)
        if (responce) {
            // console.log('aaaaa', responce)
            setMainDataT2(responce.data)
            setCurrentDate(responce.current_date)
            setPreviousDate(responce.previous_date)
            action(false)
            setOpen(true)
        }
        else {
            action(false)
        }
    }

    const handleTotalData = async () => {
        action(true)
        const responce = await makeGetRequest('Zero_Count_Rna_Payload_Tool/hyperlink_week_to_week_all/')
        // console.log('responce data' , responce)
        if (responce) {
            action(false)
            setTotalTable(responce.data)
            setCurrentDate(responce.current_date)
            setPreviousDate(responce.privous_date)
            setTotalOpen(true)
        }
        else {
            action(false)
            setTotalOpen(false)
        }
    }

    const TotalTableDialog = useCallback(() => {
        return (
            <Dialog
                open={totalOpen}
                // onClose={handleClose}
                keepMounted
                fullWidth
                maxWidth={'md'}
                style={{ zIndex: 5 }}
            >
                <DialogTitle>All Over Data
                    <Tooltip title="Export Excel">
                        <IconButton onClick={() => { handleExportTotal(); }}>
                            <DownloadIcon fontSize='large' color='primary' />
                        </IconButton>
                    </Tooltip><span style={{ float: 'right' }}><IconButton size="large" onClick={handleClose}><CloseIcon /></IconButton></span></DialogTitle>

                <DialogContent >
                    <TableContainer sx={{ maxHeight: 400, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Circle</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Short Name</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{currentDate}</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{previousDate}</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Site Priority</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Delta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {totalTable?.map((item) => (
                                    <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                        <th>{item.Circle}</th>
                                        <th>{item.Short_name}</th>
                                        <th>{item.MV_4G_Data_Volume_GB_current_date}</th>
                                        <th>{item.MV_4G_Data_Volume_GB_previous_date}</th>
                                        <th>{item.depth}</th>
                                        <th>{item.Delta}</th>
                                    </tr>
                                ))}
                            </tbody>


                        </table>
                    </TableContainer>

                </DialogContent>
            </Dialog>
        )
    }, [totalOpen])


    const Dashboard = useCallback(({ dataa, color }) => {

        // console.log('dashboard data', dataa)
        return (
            <Box sx={{ height: 'auto', width: '40vh', padding: 1, borderRadius: 1.5, boxShadow: " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px", backgroundColor: color, border: `3px solid ${color}`, textAlign: 'center' }}>
                <Box sx={{ fontWeight: 600, fontSize: '18px', color: "white", textAlign: 'left' }}>{dataa?.name}</Box>
                <Box sx={{ fontWeight: 600, fontSize: '24px', color: "white", fontFamily: 'cursive' }}>{dataa?.value}</Box>
                <Box sx={{ color: "white", textAlign: 'left' }}><span style={{ fontWeight: 600, fontSize: '14px' }}>Week - </span>{convertDate(data?.previous_date)} ~ {convertDate(data?.latest_date)}</Box>
            </Box>
        );
    }, [data]);


    useEffect(() => {
        // if (data) {
        //     ArrengJsonData(data.circle_counts)
        // }
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 10 }}>
                    <div style={{ margin: 5, marginLeft: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>

                            <Link underline="hover" onClick={() => { navigate('/tools/rca') }}>RCA Tool</Link>
                            <Typography color='text.primary'>Week Wise Payload</Typography>
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

                    <div style={{ padding: '5px', display: 'flex', justifyContent: 'space-between', flexWrap: "wrap", flexDirection: 'row', gap: 20 }}>
                        {data?.data?.map((item, index) => {
                            if (item?.Circle === 'Base_Total') {
                                return (<>
                                    <Dashboard dataa={{ value: item.P0, name: 'P0' }} color={colorType[0]} />
                                    <Dashboard dataa={{ value: item.P1, name: 'P1' }} color={colorType[1]} />
                                    <Dashboard dataa={{ value: item.P2, name: 'P2' }} color={colorType[2]} />
                                    <Dashboard dataa={{ value: item.P3, name: 'P3' }} color={colorType[3]} />
                                </>

                                )
                            }
                        })}
                    </div>

                    {/* ************* 2G  TABLE DATA ************** */}

                    <Box sx={{ marginTop: 1 }}>

                        <TableContainer sx={{ maxHeight: '80vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 14, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan='3' style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>Circle</th>
                                        <th colSpan='4' style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>{convertDate(data?.previous_date)} ~ {convertDate(data?.latest_date)}</th>
                                        <th rowSpan='3' style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>Total</th>
                                    </tr>
                                    <tr style={{ fontSize: 14, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>P-0</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>P-1</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>P-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>P-3</th>
                                    </tr>
                                    <tr style={{ fontSize: 14, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>

                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}> {`> 100GB`} </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>{`≥ 50GB < 100GB`}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>{`≥ 30GB < 50GB`}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>{`≥ 10GB < 30GB`}</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.data?.map((it) => {

                                        // return (
                                        //     <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                        //       <th >{it?.Circle}</th>
                                        //       <th  >{it?.P0 ? it.P0 : 0}</th>
                                        //       <th  >{it?.P1 ? it.P1 : 0}</th>
                                        //       <th  >{it?.P2 ? it.P2 : 0}</th>
                                        //       <th  >{it?.P3 ? it.P3 : 0}</th>
                                        //       <th >{it?.total}</th>
                                        //   </tr>
                                        // )

                                        if (it?.Circle === 'Base_Total') {
                                            return (
                                                <tr style={{ textAlign: "center", fontWeigth: 700, backgroundColor: '#ED6C02', color: '#fff', fontSize: 16 }}>
                                                    <th >Total</th>
                                                    <th >{it?.P0 ? it.P0 : 0}</th>
                                                    <th >{it?.P1 ? it.P1 : 0}</th>
                                                    <th >{it?.P2 ? it.P2 : 0}</th>
                                                    <th >{it?.P3 ? it.P3 : 0}</th>
                                                    <th className={classes.hover} style={{ cursor: "pointer" }} onClick={handleTotalData}>{it?.total}</th>
                                                </tr>
                                            )

                                        }
                                        else {
                                            return (
                                                <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                                    <th >{it?.Circle}</th>
                                                    <th className={classes.hover} style={{ cursor: "pointer" }} onClick={() => { ClickDataGet({ circle: it.Circle, delta: 'P0' }) }}>{it?.P0 ? it.P0 : 0}</th>
                                                    <th className={classes.hover} style={{ cursor: "pointer" }} onClick={() => { ClickDataGet({ circle: it.Circle, delta: 'P1' }) }}>{it?.P1 ? it.P1 : 0}</th>
                                                    <th className={classes.hover} style={{ cursor: "pointer" }} onClick={() => { ClickDataGet({ circle: it.Circle, delta: 'P2' }) }}>{it?.P2 ? it.P2 : 0}</th>
                                                    <th className={classes.hover} style={{ cursor: "pointer" }} onClick={() => { ClickDataGet({ circle: it.Circle, delta: 'P3' }) }}>{it?.P3 ? it.P3 : 0}</th>
                                                    <th >{it?.total}</th>
                                                </tr>
                                            )
                                        }
                                    }
                                    )}

                                </tbody>
                            </table>
                        </TableContainer>
                    </Box>

                </div>
            </Slide>
            {filterDialog()}
            {TotalTableDialog()}
            {loading}
        </>
    )
}

export default WeekWisePayload