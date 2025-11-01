import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
// import * as ExcelJS from 'exceljs'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { CsvBuilder } from 'filefy';
import { useGet } from '../../../Hooks/GetApis';
import { usePost } from '../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useQuery } from '@tanstack/react-query';
import { useStyles } from '../../ToolsCss'
import { setEncreptedData, getDecreyptedData } from '../../../utils/localstorage';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { postData } from '../../../services/FetchNodeServices';

const WeekWise = () => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const { makePostRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const [mainDataT2, setMainDataT2] = useState([])
    // const [dateArray, setDateArray] = useState([])
    // const [monthArray, setMonthArray] = useState([])
    const [weekArray, setWeekArray] = useState([])
    const [tableData, setTableData] = useState([])
    const [givenDate, setGivenDate] = useState('')
    const [circle, setCircle] = useState('')
    const [circleOptions, setCircleOptions] = useState([])
    const [tagging, setTagging] = useState('')
    const [taggingOptions, setTaggingOptions] = useState([])
    const [relocationMethod, setRelocationMethod] = useState('')
    const [relocationMethodOptions, setRelocationMethodOptions] = useState([])
    const [toco, setToco] = useState('')
    const [tocoOptions, setTocoOptions] = useState([])
    const [downloadExcelData, setDownloadExcelData] = useState('')
    // const [totals, setTotals] = useState()

    const fetchDailyData = async () => {
        action(true)
        var formData = new FormData()
        formData.append('circle', circle)
        formData.append('site_tagging', tagging)
        formData.append('relocation_method', relocationMethod)
        formData.append('new_toco_name', toco)
        const res = await postData("alok_tracker/weekly_monthly_dashboard_file/", formData);
        // const res =  tempData; //  remove this line when API is ready
        console.log('week wise response', res)
        if (res) {
            action(false)
            setWeekArray(res.unique_data.week_columns)
            setTableData(JSON.parse(res.week_data))
            setCircleOptions(res.unique_data.unique_circle)
            setTaggingOptions(res.unique_data.unique_site_tagging)
            setRelocationMethodOptions(res.unique_data.unique_relocation_method)
            setTocoOptions(res.unique_data.unique_new_toco_name)
            setDownloadExcelData(res.download_link)
            // setMainDataT2(JSON.parse(res.data))
        }
        else {
            action(false)
        }

    }

    const handleCircle = (event) => {
        setCircle(event.target.value)
    }
    const handleTagging = (event) => {
        setTagging(event.target.value)
    }
    const handleRelocationMethod = (event) => {
        setRelocationMethod(event.target.value)
    }
    const handleToco = (event) => {
        setToco(event.target.value)
    }


    // console.log('date wise dashboard')

    const ChangeDateFormate = (dates) => {

        if (dates && typeof dates === 'string') {
            // console.log('date', dates.split('-'));
            const [year, month, day] = dates.split('-');
            return `${day}-${month}-${year}`;
        } else {
            // console.log("Invalid date format");
            return dates;
        }
    }



    // const ShortDate = (dates) => {
    //     const dateObjects = dates.map(dateStr => new Date(dateStr));
    //     // Sort Date objects in increasing order
    //     dateObjects.sort((a, b) => a - b);
    //     // Convert sorted Date objects back to string format
    //     const sortedDates = dateObjects.map(date => date.toISOString().split('T')[0]);
    //     setDateArray(sortedDates)

    // }

    const handleClose = () => {
        setOpen(false)
    }

    // Download Key and value
    const columnData = [
        { title: 'Unique Key', field: 'unique_key' },
        { title: 'OEM', field: 'OEM' },
        { title: 'Integration Date', field: 'Integration_Date' },
        { title: 'CIRCLE', field: 'CIRCLE' },
        { title: 'Activity Name', field: 'Activity_Name' },
        { title: 'Site ID', field: 'Site_ID' },
        { title: 'MO NAME', field: 'MO_NAME' },

        { title: 'LNBTS ID', field: 'LNBTS_ID' },
        { title: 'Technology (SIWA)', field: 'Technology_SIWA' },
        { title: 'OSS Details', field: 'OSS_Details' },
        { title: 'Cell ID', field: 'Cell_ID' },
        { title: 'CELL COUNT', field: 'CELL_COUNT' },
        { title: 'BSC NAME', field: 'BSC_NAME' },
        { title: 'BCF', field: 'BCF' },
        { title: 'TRX Count', field: 'TRX_Count' },
        { title: 'PRE ALARM', field: 'PRE_ALARM' },
        { title: 'GPS IP CLK', field: 'GPS_IP_CLK' },
        { title: 'RET', field: 'RET' },
        { title: 'POST VSWR', field: 'POST_VSWR' },
        { title: 'POST Alarms', field: 'POST_Alarms' },
        { title: 'Activity Mode (SA/NSA)', field: 'Activity_Mode' },
        { title: 'Activity Type (SIWA)', field: 'Activity_Type_SIWA' },
        { title: 'Band (SIWA)', field: 'Band_SIWA' },
        { title: 'CELL STATUS', field: 'CELL_STATUS' },
        { title: 'CTR STATUS', field: 'CTR_STATUS' },
        { title: 'Integration Remark', field: 'Integration_Remark' },
        { title: 'T2T4R', field: 'T2T4R' },
        { title: 'BBU TYPE', field: 'BBU_TYPE' },
        { title: 'BB CARD', field: 'BB_CARD' },
        { title: 'RRU Type', field: 'RRU_Type' },
        { title: 'Media Status', field: 'Media_Status' },
        { title: 'Mplane IP', field: 'Mplane_IP' },
        { title: 'SCF PREPARED_BY', field: 'SCF_PREPARED_BY' },
        { title: 'SITE INTEGRATE_BY', field: 'SITE_INTEGRATE_BY' },
        { title: 'Site Status', field: 'Site_Status' },
        {
            title: 'External Alarm Confirmation',
            field: 'External_Alarm_Confirmation'
        },
        { title: 'SOFT AT STATUS', field: 'SOFT_AT_STATUS' },
        { title: 'LICENCE Status', field: 'LICENCE_Status' },
        { title: 'ESN NO', field: 'ESN_NO' },
        {
            title: 'Responsibility_for_alarm_clearance',
            field: 'Responsibility_for_alarm_clearance'
        },
        { title: 'TAC', field: 'TAC' },
        { title: 'PCI TDD 20', field: 'PCI_TDD_20' },
        { title: 'PCI TDD 10/20', field: 'PCI_TDD_10_20' },
        { title: 'PCI FDD 2100', field: 'PCI_FDD_2100' },
        { title: 'PCI FDD 1800', field: 'PCI_FDD_1800' },
        { title: 'PCI L900', field: 'PCI_L900' },
        { title: '5G PCI', field: 'PCI_5G' },
        { title: 'RSI TDD 20', field: 'RSI_TDD_20' },
        { title: 'RSI TDD 10/20', field: 'RSI_TDD_10_20' },
        { title: 'RSI FDD 2100', field: 'RSI_FDD_2100' },
        { title: 'RSI FDD 1800', field: 'RSI_FDD_1800' },
        { title: 'RSI L900', field: 'RSI_L900' },
        { title: '5G RSI', field: 'RSI_5G' },
        { title: 'GPL', field: 'GPL' },
        { title: 'Pre/Post Check', field: 'Pre_Post_Check' },
        { title: 'CRQ', field: 'CRQ' },
        { title: 'Customer Approval', field: 'Customer_Approval' },
        { title: 'Allocated Tech.', field: 'Allocated_Tech' },
        { title: 'Deployed Tech.', field: 'Deployed_Tech' },
        { title: 'Old Site ID', field: 'Old_Site_ID' },
        { title: 'Old Site Tech', field: 'Old_Site_Tech' },

    ]

    // handleExport Range wise table in excel formet.........
    // const handleExport = () => {
    //     var csvBuilder = new CsvBuilder(`Date_Wise_Integration_Tracker.csv`)
    //         .setColumns(columnData.map(item => item.title))
    //         .addRows(data?.download_data.map(row => columnData.map(col => row[col.field])))
    //         .exportFile();
    // }

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
                    <TableContainer sx={{ maxHeight: 450, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Circle</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Short Name</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{mainDataT2?.current_date}</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{mainDataT2?.previous_date}</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Site Priority</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Delta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mainDataT2?.data?.map((item) => (
                                    <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                        <th>{item.Circle}</th>
                                        <th>{item.Short_name}</th>
                                        <th>{item.current_date}</th>
                                        <th>{item.previous_date}</th>
                                        <th>{item.del_value.toUpperCase()}</th>
                                        <th>{item.delta}</th>
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
        formData.append("Activity_Name", props.activity);
        formData.append("date", props.date);
        const responce = await makePostRequest('IntegrationTracker/hyperlink-datewise-integration-data/', formData)
        if (responce) {
            // console.log('responce', responce)
            // setMainDataT2(responce)
            action(false)
            setEncreptedData("integration_final_tracker", responce.data);
            // console.log('response data in huawia site id' , response)
            window.open(`${window.location.href}/${props.activity}`, "_blank")
            // setOpen(true)
        }
        else {
            action(false)
        }
    }

    useEffect(() => {
        fetchDailyData()
        // setTotals(calculateColumnTotals(tableData))
    }, [circle, tagging, relocationMethod, toco])
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>

                    
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            Weekly - RFAI to MS1
                        </Box>
                        <Box>
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                <InputLabel id="demo-select-small-label">Circle</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={circle}
                                    label="Circle"
                                    onChange={handleCircle}
                                >
                                    {circleOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                <InputLabel id="demo-select-small-label">Tagging</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={tagging}
                                    label="Tagging"
                                    onChange={handleTagging}
                                >
                                    {taggingOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                                <InputLabel id="demo-select-small-label">Relocation Method</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={relocationMethod}
                                    label="Relocation Method"
                                    onChange={handleRelocationMethod}
                                >
                                    {relocationMethodOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                                <InputLabel id="demo-select-small-label">TOCO</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={toco}
                                    label="TOCO"
                                    onChange={handleToco}
                                >
                                    {tocoOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DatePicker
                                    value={givenDate}
                                    onChange={handleDate}
                                />
                            </LocalizationProvider> */}
                            <Tooltip title="Download Weekly-RFAI to MS1">
                                <IconButton
                                    component="a"
                                    href={downloadExcelData}
                                    download
                                >
                                    <DownloadIcon fontSize="large" color="primary" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box sx={{ marginTop: 0 }}>
                        <TableContainer sx={{ maxHeight: 600, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#223354' }}>
                                            Milestone Track/Site Count</th>
                                        {/* <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', position: 'sticky', left: 218, top: 0, backgroundColor: '#223354' }}>
                                            CF</th> */}
                                        {weekArray?.map((item, index) => (
                                            <th key={index} style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>{item}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.map((it, index) => {
                                        return (
                                            <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: 'rgb(197 214 246)', color: 'black' }}>{it['Milestone Track/Site Count']}</th>
                                                {/* <th style={{ position: 'sticky', left: 218, top: 0, backgroundColor: 'rgb(197 214 246)', color: 'black' }}>{it['CF']}</th> */}
                                                {weekArray?.map((item, index) => (
                                                    <th key={index} >{it[`Month_Week-${index + 1}`]}</th>
                                                    // <th key={index} style={{ backgroundColor: it[`Month_Week-${index + 1}`] > 0 ? '#FEEFAD' : '' }} >{it[`Month_Week-${index + 1}`]}</th>
                                                ))}

                                            </tr>
                                        )
                                    }
                                    )}


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

export const  MemoWeekWise = React.memo(WeekWise);