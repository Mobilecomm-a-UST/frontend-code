import React, { useState, useEffect, useCallback } from 'react';
import { Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import * as ExcelJS from 'exceljs';
import Slide from '@mui/material/Slide';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Stack, Button
} from "@mui/material";
import Swal from "sweetalert2";
import UploadIcon from '@mui/icons-material/Upload';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useGet } from '../../../Hooks/GetApis';
import { usePost } from '../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useQuery } from '@tanstack/react-query';
import { useStyles } from './../../ToolsCss';
import OverAllCss from "../../../csss/OverAllCss";

const SAper = () => {
    const classes1 = useStyles()
    const classes = OverAllCss()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const { makePostRequest, cancelRequest, isLoading } = usePost()
    const [rawKpiFile, setRawKpiFile] = useState({ filename: "", bytes: "" })
    const [rawShow, setRawShow] = useState(false)
    const rawKpiLength = rawKpiFile.filename.length
    const { loading, action } = useLoadingDialog();
    const [arrDateT2, setArrDateT2] = useState('')
    const [mainDataT2, setMainDataT2] = useState([])
    const [arrDate, setArrDate] = useState([])
    const [getCircle, setGetCircle] = useState([])
    const [tableData, setTableData] = useState([])
    // const [totals ,setTotals] = useState()

    const handleRawKpiFile = (event) => {
        setRawShow(false);
        setRawKpiFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true

        })
    }

    const handleSubmit = async () => {

        if (rawKpiLength > 0) {

            setOpen(isLoading)
            var formData = new FormData();
            formData.append("raw_data", rawKpiFile.bytes);
            const response = await makePostRequest('Kpi_dashboard/tables/', formData)
            console.log('raw_data', response)
            if (response?.status) {
                setOpen(false);
                // setError(response.error_rows)
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });
                // if (response.error_rows.length > 0) {
                //     setTableDialog(true)
                // }
            }
            else {
                setOpen(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${response?.message}`,
                });
            }

        }
        else {
            if (rawKpiLength == 0) {
                setRawShow(true)
            }
        }
    };

    // DATA PROCESSING DIALOG BOX...............
    const loadingDialog = useCallback(() => {
        return (
            <Dialog
                open={open}
                // TransitionComponent={Transition}
                keepMounted
            // aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent         >
                    <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
                    {/* <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box> */}
                    <Box style={{ textAlign: 'center' }}><img src="/assets/cloud-upload.gif" style={{ height: 200 }} /></Box>
                    <Box style={{ margin: '10px 0px 10px 0px', fontWeight: 'bolder' }}>DATA UNDER PROCESSING...</Box>
                    <Button variant="contained" fullWidth style={{ backgroundColor: "red", color: 'white' }} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
                </DialogContent>
            </Dialog>
        )
    }, [cancelRequest, open])




    const calculateColumnTotals = (datass) => {

        // console.log('adasdasdasdasda', datass)
        const totals = {

            date_1: 0,
            date_2: 0,
            date_3: 0,
            date_4: 0,
            date_5: 0,
            date_6: 0,
            date_7: 0,
            date_8: 0,
        };

        datass.forEach(item => {
            for (let key in totals) {
                totals[key] += Number(item[key]) || 0;
            }
        });

        return totals;
    };

    const totals = calculateColumnTotals(tableData);

    // console.log('asasasasas', totals)


    const ArrengeJSONData = (datas) => {

        var convertedData = datas.reduce((acc, curr) => {
            const circle = curr.Circle;
            for (const key in curr) {
                if (key.startsWith("date_")) {
                    const date = key;
                    acc[circle] = acc[circle] || {};
                    acc[circle][date] = curr.Cell_Count;
                }
            }
            return acc;
        }, {})

        const result = Object.keys(convertedData).map(circle => ({
            Circle: circle,
            ...convertedData[circle]
        }));

        setTableData(result)

    }



    const fetchZeroRNA = async (props) => {
        action(true)
        var formData = new FormData();
        formData.append("circle", props.circle);
        formData.append("date", props.date);
        const responce1 = await makePostRequest('Zero_Count_Rna_Payload_Tool/hyperlink_circle_based_rna_count/', formData)
        if (responce1) {
            action(false)
            setOpen(true)
            console.log('responce data', responce1)
            setArrDateT2(responce1.date)
            setMainDataT2(responce1.data)

        }
        else {
            action(false)
        }

    }


    // handleExport Range wise table in excel formet.........
    const handleExport = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("SA Dashboard", {
            properties: { tabColor: { argb: "f1948a" } },
        });

        // Example dates
        const dates = [
            "15-Sep-25",
            "16-Sep-25",
            "17-Sep-25",
            "18-Sep-25",
            "19-Sep-25",
            "20-Sep-25",
            "21-Sep-25",
            "22-Sep-25",
        ];

        // Example KPI data
        const kpiData = [
            { kpi: "Sleeping Cells", values: [12, 15, 18, 20, 22, 19, 25, 30] },
            { kpi: "Zero Payload", values: [8, 6, 9, 12, 10, 14, 13, 16] },
            { kpi: "Call Drops", values: [2, 3, 4, 1, 2, 3, 2, 5] },
        ];

        // 1️⃣ Setup headers
        const headers = ["KPI", ...dates];
        sheet.addRow(headers);

        // 2️⃣ Fill KPI rows
        kpiData.forEach((item) => {
            const row = [item.kpi, ...item.values];
            sheet.addRow(row);
        });

        // 3️⃣ Styling (header + rows)
        sheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { vertical: "middle", horizontal: "center" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };

                if (rowNumber === 1) {
                    // header styling
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "223354" },
                    };
                    cell.font = { color: { argb: "FFFFFF" }, bold: true, size: 12 };
                }
            });
        });

        // 4️⃣ Export file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "SA_Dashboard.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });
    };

    const handleClose = () => {
        setOpen(false)
    }



    // ********** Filter Dialog Box **********//
    const filterDialog = () => {
        return (
            <Dialog
                open={open}
                // onClose={handleClose}
                keepMounted
                fullWidth
                maxWidth={'md'}
                style={{ zIndex: 5 }}
            >
                <DialogTitle><span style={{ float: 'right' }}><IconButton size="large" onClick={handleClose}><CloseIcon /></IconButton></span></DialogTitle>

                <DialogContent >
                    <TableContainer sx={{ maxHeight: 400, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Circle</th>
                                    <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Cell Name</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>MV 4G Data Volume GB</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>MV Radio NW Availability</th>
                                </tr>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{arrDateT2}</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{arrDateT2}</th>
                                </tr>

                            </thead>
                            <tbody>
                                {mainDataT2?.map((it) => (
                                    <tr style={{ textAlign: "center", fontWeigth: 700 }}>
                                        <th >{it?.Circle}</th>
                                        <th >{it?.Short_name}</th>
                                        <th >{it?.MV_4G_Data_Volume_GB}</th>
                                        <th >{it?.MV_Radio_NW_Availability}</th>
                                    </tr>
                                ))}

                            </tbody>


                        </table>
                    </TableContainer>

                </DialogContent>
            </Dialog>
        )
    }

    const dates = [
        "2025-09-17T00:00:00",
        "2025-09-18T00:00:00",
        "2025-09-19T00:00:00",
        "2025-09-20T00:00:00",
        "2025-09-22T00:00:00"
    ];

    // Example KPI data
    const kpiData = [
        {
            "KPIs": "eNodeB Count",
            "date_1": 199,
            "date_2": 199,
            "date_3": 199,
            "date_4": 199,
            "date_5": 199
        },
        {
            "KPIs": "MV eCell Count",
            "date_1": 24,
            "date_2": 24,
            "date_3": 24,
            "date_4": 24,
            "date_5": 24
        },
        {
            "KPIs": "MV eCell Count_FDD",
            "date_1": 117,
            "date_2": 117,
            "date_3": 117,
            "date_4": 117,
            "date_5": 117
        },
        {
            "KPIs": "MV eCell Count_TDD",
            "date_1": 82,
            "date_2": 82,
            "date_3": 82,
            "date_4": 82,
            "date_5": 82
        },
        {
            "KPIs": "4G Data Volume [GB]",
            "date_1": 164,
            "date_2": 176,
            "date_3": 178,
            "date_4": 178,
            "date_5": 178
        },
        {
            "KPIs": "MV 4G Data Volume_GB_FDD",
            "date_1": 51.256281407035175,
            "date_2": 54.2713567839196,
            "date_3": 54.2713567839196,
            "date_4": 54.2713567839196,
            "date_5": 54.2713567839196
        },
        {
            "KPIs": "MV 4G Data Volume_GB_TDD",
            "date_1": 31.155778894472363,
            "date_2": 34.17085427135678,
            "date_3": 35.175879396984925,
            "date_4": 35.175879396984925,
            "date_5": 35.175879396984925
        },
        {
            "KPIs": "% of 4G Cells with Average User Throughput DL < 3 Mbps [CDBH]",
            "date_1": 20.3,
            "date_2": 27.27,
            "date_3": 19.21,
            "date_4": 19.51,
            "date_5": 19.77
        },
        {
            "KPIs": "% of 4G Cells with Average User Throughput DL [Excluding <=5MHz] < 3 Mbps [CDBH]",
            "date_1": 13.57,
            "date_2": 16.58,
            "date_3": 14.57,
            "date_4": 16.08,
            "date_5": 17.09
        },
        {
            "KPIs": "% of 4G Cells with Average User Throughput DL [Excluding L900 & <=5MHz] < 3 Mbps [CDBH]",
            "date_1": 13.57,
            "date_2": 16.58,
            "date_3": 14.57,
            "date_4": 16.08,
            "date_5": 17.09
        },
        {
            "KPIs": "% of 4G Cells with Average User Throughput UL [Excluding <=5MHz] < 200 Kbps [CDBH]",
            "date_1": 13.57,
            "date_2": 14.07,
            "date_3": 16.58,
            "date_4": 16.58,
            "date_5": 16.08
        },
        {
            "KPIs": "% of 4G Cells with Average User Throughput UL [Excluding <=5MHz] < 300 Kbps [CDBH]",
            "date_1": 25.13,
            "date_2": 22.61,
            "date_3": 28.14,
            "date_4": 30.15,
            "date_5": 28.14
        },
        {
            "KPIs": "% of 4G Cells with Average User Throughput UL [Excluding <=5MHz] < 500 Kbps [CDBH]",
            "date_1": 39.2,
            "date_2": 36.68,
            "date_3": 45.73,
            "date_4": 48.74,
            "date_5": 47.74
        },
        {
            "KPIs": "% of 4G Cells with Average User Throughput UL [Excluding L900 & <=5MHz] < 500 Kbps [CDBH]",
            "date_1": 39.2,
            "date_2": 36.68,
            "date_3": 45.73,
            "date_4": 48.74,
            "date_5": 47.74
        },
        {
            "KPIs": "% of 4G Cells with CQI <8 [CDBH]",
            "date_1": 52.26130653266332,
            "date_2": 45.7286432160804,
            "date_3": 56.28140703517588,
            "date_4": 61.30653266331658,
            "date_5": 63.81909547738693
        },
        {
            "KPIs": "% of 4G Cells with PS RRC setup success rate <98% [CDBH]",
            "date_1": 8.5427,
            "date_2": 0.5025,
            "date_3": 4.0201,
            "date_4": 2.0101,
            "date_5": 1.005
        },
        {
            "KPIs": "% of 4G Cells with ERAB Setup Success Rate<98%[CDBH]",
            "date_1": 4.5226,
            "date_2": 4.0201,
            "date_3": 5.5276,
            "date_4": 5.5276,
            "date_5": 5.5276
        },
        {
            "KPIs": "% of 4G Cells with PRB utilization DL < 80% [CDBH]",
            "date_1": 1663.5628,
            "date_2": 1814.8844,
            "date_3": 2561.2211,
            "date_4": 2727.4925,
            "date_5": 2700.4874
        },
        {
            "KPIs": "% of 4G Cells with PS Drop Call Rate >0.9% [CDBH]",
            "date_1": 8.5427,
            "date_2": 7.5377,
            "date_3": 8.5427,
            "date_4": 6.5327,
            "date_5": 8.5427
        },
        {
            "KPIs": "% of 4G Cells with PS InterF HOSR < 97% [CDBH]",
            "date_1": 7.0352,
            "date_2": 9.0452,
            "date_3": 7.5377,
            "date_4": 10.0503,
            "date_5": 10.0503
        },
        {
            "KPIs": "% of 4G Cells with PS InterF HOSR < 98% [CDBH]",
            "date_1": 65.8291,
            "date_2": 58.794,
            "date_3": 73.3668,
            "date_4": 77.3869,
            "date_5": 80.402
        },
        {
            "KPIs": "% of 4G Cells with PS IntraF HOSR < 97% [CDBH]",
            "date_1": 13.0653,
            "date_2": 11.5578,
            "date_3": 13.0653,
            "date_4": 15.0754,
            "date_5": 12.0603
        },
        {
            "KPIs": "% of 4G Cells with PS IntraF HOSR < 98% [CDBH]",
            "date_1": 19.598,
            "date_2": 16.5829,
            "date_3": 20.1005,
            "date_4": 24.1206,
            "date_5": 23.6181
        },
        {
            "KPIs": "% of 4G Cells with VoLTE CSSR < 99.5% [CBBH]",
            "date_1": 67.3367,
            "date_2": 60.804,
            "date_3": 75.3769,
            "date_4": 82.4121,
            "date_5": 86.4322
        },
        {
            "KPIs": "% of 4G Cells with VoLTE DCR < 1%[CBBH]",
            "date_1": 41.7085,
            "date_2": 41.206,
            "date_3": 52.7638,
            "date_4": 56.7839,
            "date_5": 60.804
        },
        {
            "KPIs": "% of 4G Cells with VoLTE DCR < 1%[CBBH]_LCV",
            "date_1": 59.2964824120603,
            "date_2": 57.286432160804026,
            "date_3": 73.86934673366834,
            "date_4": 79.89949748743719,
            "date_5": 84.42211055276381
        },
        {
            "KPIs": "% of 4G Cells with VoLTE ERAB Setup Success Rate < 99.5% [CBBH]",
            "date_1": 2.5126,
            "date_2": 2.5126,
            "date_3": 4.0201,
            "date_4": 5.5276,
            "date_5": 3.0151
        },
        {
            "KPIs": "% of 4G Cells with VoLTE InterF HOSR < 97% [CBBH]",
            "date_1": 6.5327,
            "date_2": 11.0553,
            "date_3": 12.0603,
            "date_4": 11.5578,
            "date_5": 7.0352
        },
        {
            "KPIs": "% of 4G Cells with VoLTE InterF HOSR < 98% [CBBH]",
            "date_1": 12.5628,
            "date_2": 15.5779,
            "date_3": 16.5829,
            "date_4": 17.5879,
            "date_5": 15.0754
        },
        {
            "KPIs": "% of 4G Cells with VoLTE Packet Loss Rate DL<1% [CBBH]",
            "date_1": 1.5075,
            "date_2": 1.005,
            "date_3": 0.5025,
            "date_4": 1.005,
            "date_5": 1.005
        },
        {
            "KPIs": "% of 4G Cells with VoLTE Packet Loss Rate UL<1% [CBBH]",
            "date_1": 7.5377,
            "date_2": 6.0302,
            "date_3": 6.5327,
            "date_4": 5.0251,
            "date_5": 5.0251
        },
        {
            "KPIs": "Cells with Zero Data Payload",
            "date_1": 31,
            "date_2": 55,
            "date_3": 27,
            "date_4": 14,
            "date_5": 6
        }
    ];



    const handleCancel = () => {
        setRawKpiFile({ filename: "", bytes: "" })
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        // setTotals(calculateColumnTotals(tableData))
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 10 }}>
                    <Box style={{ margin: 5, marginLeft: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                            <Link underline="hover" onClick={() => { navigate('/tools/rca') }}>RCA Tool</Link>
                            <Typography color='text.primary'>SA Performance</Typography>
                        </Breadcrumbs>

                    </Box>


                    {/* file upload section data */}
                    <Box sx={{ marginTop: 1 }}>
                        <Box className={classes.main_Box}>
                            <Box className={classes.Back_Box}>
                                <Box className={classes.Box_Hading}>
                                    Make SA Report
                                </Box>
                                <Stack spacing={2} sx={{ marginTop: "-40px" }}>
                                    <Box className={classes.Front_Box} id="step-1">
                                        <div className={classes.Front_Box_Hading}>
                                            Select Excel/CSV File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{rawKpiFile.filename}</span>
                                        </div>
                                        <div className={classes.Front_Box_Select_Button}>
                                            <div style={{ float: "left" }}>
                                                <Button variant="contained" component="label" color={rawKpiFile.state ? "warning" : "primary"}>
                                                    select file
                                                    <input required onChange={handleRawKpiFile} hidden accept=".xlsm,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" multiple type="file" />
                                                </Button>
                                            </div>
                                            <div>  <span style={{ display: rawShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                            <div>
                                            </div>
                                        </div>
                                    </Box>
                                </Stack>
                                <Box style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                                    <Box id="step-5">
                                        <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />} id='step-3'>upload</Button>
                                    </Box>
                                    <Box >
                                        <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
                                    </Box >
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* ************* SA TABLE DATA ************** */}
                    <Box sx={{ marginTop: 1 }}>
                        <Typography variant="h5" gutterBottom>
                            SA Dashboard ({formatDate(dates[0])} to {formatDate(dates[dates.length - 1])})
                            <Box style={{ float: 'right' }}>
                                <Tooltip title="Export Excel">
                                    <IconButton onClick={() => { handleExport(); }}>
                                        <DownloadIcon fontSize='medium' color='primary' />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Typography>

                        <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    border: "1px solid black",
                                }}
                            >
                                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                    <tr>
                                        <th
                                            style={{
                                                background: "#223354",
                                                color: "white",
                                                fontWeight: "bold",
                                                padding: "8px 12px",
                                                textAlign: "left",
                                            }}
                                        >
                                            KPIs
                                        </th>
                                        {dates.map((date, idx) => (
                                            <th
                                                key={idx}
                                                style={{
                                                    background: "#223354",
                                                    color: "white",
                                                    fontWeight: "bold",
                                                    padding: "8px 12px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {formatDate(date)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {kpiData.map((row, rowIndex) => (
                                        <tr
                                            key={rowIndex}
                                            className={classes1?.hover}
                                            style={{ height: "5px" }}
                                        >
                                            <td
                                                style={{
                                                    fontWeight: "bold",
                                                    padding: "6px 12px",
                                                    border: "1px solid black",
                                                }}
                                            >
                                                {row.KPIs}
                                            </td>
                                            {dates.map((date, index) => {
                                                const value = row[`date_${index + 1}`];

                                                let displayValue = value;
                                                if (typeof value === "number") {
                                                    if (!Number.isInteger(value)) {
                                                        displayValue = `${value.toFixed(2)}%`;
                                                    }
                                                }

                                                return (
                                                    <td
                                                        key={index}
                                                        style={{
                                                            textAlign: "center",
                                                            padding: "6px 12px",
                                                            border: "1px solid black",
                                                        }}
                                                    >
                                                        {displayValue}
                                                    </td>
                                                );
                                            })}




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

export default SAper