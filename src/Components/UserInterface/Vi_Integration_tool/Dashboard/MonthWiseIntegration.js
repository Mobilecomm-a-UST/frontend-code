import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { usePost } from '../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useQuery } from '@tanstack/react-query';
import { useStyles } from '../../ToolsCss'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CsvBuilder } from 'filefy';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import { setEncreptedData } from '../../../utils/localstorage';



const monthNames = [" ",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const headerColor = ['#2F75B5', "#DD761C", '#03AED2']
const MonthWiseIntegration = ({ onData }) => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const { makePostRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const [mainDataT2, setMainDataT2] = useState([])
    const [monthArray, setMonthArray] = useState([])
    const [tableData, setTableData] = useState([])
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const [months, setMonths] = useState('')
    const [years, setYears] = useState('')
    const activityArray = ['DE-GROW', 'MACRO', 'OTHER', 'RELOCATION', 'RET', 'ULS-HPSC', 'UPGRADE', 'MEMTO', 'HT-INCREMENT', 'IBS', 'IDSC', 'ODSC', 'RECTIFICATION', 'OPERATION', 'RRU UPGRADE', '5G BW UPGRADE', '5G RRU SWAP', '5G SECTOR ADDITION', '5G RELOCATION', 'TRAFFIC SHIFTING', 'RRU SWAP']
    const { isPending, isFetching, isError, data, error, refetch } = useQuery({
        queryKey: ['Vi_Integration_month_wise'],
        queryFn: async () => {
            action(true)
            var formData = new FormData()
            formData.append('month', month)
            formData.append('year', year)
            const res = await makePostRequest("ix_tracker_vi/monthwise-integration-data/", formData);
            if (res) {
                action(false)
                setMonths(res.latest_months)
                setYears(res.latest_year)
                ShortDate(res.latest_months, res.latest_year)
                setTableData(JSON.parse(res.table_data))
                // console.log('test data month', JSON.parse(res.table_data))
                onData(res)
                return res;
            }
            else {
                action(false)
            }
        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })


    // console.log('temp month wise',data)


    const calculateColumnTotals = (datass) => {
        const totals = {
            M1_DE_GROW: 0,
            M1_MACRO: 0,
            M1_OTHERS: 0,
            M1_RELOCATION: 0,
            M1_RET: 0,
            M1_ULS_HPSC: 0,
            M1_UPGRADE: 0,
            M1_FEMTO: 0,
            M1_HT_INCREMENT: 0,
            M1_IBS: 0,
            M1_IDSC: 0,
            M1_ODSC: 0,
            M1_RECTIFICATION: 0,
            M1_OPERATIONS: 0,
            M1_RRU_UPGRADE: 0,
            M1_5G_BW_UPGRADE: 0,
            M1_5G_RRU_SWAP: 0,
            M1_5G_SECTOR_ADDITION: 0,
            M1_5G_RELOCATION: 0,
            M1_TRAFFIC_SHIFTING: 0,
            M1_RRU_SWAP: 0,
            M2_DE_GROW: 0,
            M2_MACRO: 0,
            M2_OTHERS: 0,
            M2_RELOCATION: 0,
            M2_RET: 0,
            M2_ULS_HPSC: 0,
            M2_UPGRADE: 0,
            M2_FEMTO: 0,
            M2_HT_INCREMENT: 0,
            M2_IBS: 0,
            M2_IDSC: 0,
            M2_ODSC: 0,
            M2_RECTIFICATION: 0,
            M2_OPERATIONS: 0,
            M2_RRU_UPGRADE: 0,
            M2_5G_BW_UPGRADE: 0,
            M2_5G_RRU_SWAP: 0,
            M2_5G_SECTOR_ADDITION: 0,
            M2_5G_RELOCATION: 0,
            M2_TRAFFIC_SHIFTING: 0,
            M2_RRU_SWAP: 0,
            M3_DE_GROW: 0,
            M3_MACRO: 0,
            M3_OTHERS: 0,
            M3_RELOCATION: 0,
            M3_RET: 0,
            M3_ULS_HPSC: 0,
            M3_UPGRADE: 0,
            M3_FEMTO: 0,
            M3_HT_INCREMENT: 0,
            M3_IBS: 0,
            M3_IDSC: 0,
            M3_ODSC: 0,
            M3_RECTIFICATION: 0,
            M3_OPERATIONS: 0,
            M3_RRU_UPGRADE: 0,
            M3_5G_BW_UPGRADE: 0,
            M3_5G_RRU_SWAP: 0,
            M3_5G_SECTOR_ADDITION: 0,
            M3_5G_RELOCATION: 0,
            M3_TRAFFIC_SHIFTING: 0,
            M3_RRU_SWAP: 0

        };

        datass.forEach(item => {
            for (let key in totals) {
                totals[key] += Number(item[key]) || 0;
            }
        });

        return totals;
    };
    const totals = calculateColumnTotals(tableData);

    const ShortDate = (months, years) => {

        const result = [];

        for (let i = 0; i < Math.min(months?.length, years?.length); i++) {
            result.push({
                month: months[i],
                year: years[i]
            });
        }
        // console.log('result ', result)

        setMonthArray(result)
    }

    const handleClose = () => {
        setOpen(false)
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
        formData.append("month", props.mont);
        formData.append("year", props.yea);

        const responce = await makePostRequest('ix_tracker_vi/hyperlink-monthwise-integration-data/', formData)
        if (responce) {
            // console.log('aaaaa', responce)
            // setMainDataT2(responce)
            action(false)
            setEncreptedData("integration_final_tracker", responce);
            // console.log('response data in huawia site id' , response)
            window.open(`${window.location.href}/${props.activity}`, "_blank")

        }
        else {
            action(false)
        }
    }

    const handleMonthYear = async (dates) => {
        await setMonth(dates.$M + 1)
        await setYear(dates.$y)
        // console.log('dates month year', dates)

        await refetch()
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
        { title: 'Configuration 5G', field: 'Configuration_5G' },
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
        { title: 'FR Date.', field: 'FR_Date' },
        { title: 'HOTO Accepted Date.', field: 'HOTO_Accepted_Date' },
        { title: 'HOTO Offered Date.', field: 'HOTO_Offered_Date' },

    ]
    // handleExport Range wise table in excel formet.........
    const handleExport = () => {
        var csvBuilder = new CsvBuilder(`Month_Wise_Integration_Tracker.csv`)
            .setColumns(columnData.map(item => item.title))
            .addRows(data?.download_data.map(row => columnData.map(col => row[col.field])))
            .exportFile();
    }

    useEffect(() => {
        if (data) {
            setMonths(data.latest_months)
            setYears(data.latest_year)
            ShortDate(data.latest_months, data.latest_year)
            setTableData(JSON.parse(data.table_data))
            onData(data)
        }
        // setTotals(calculateColumnTotals(tableData))
    }, [])
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>
                    {/*
                    <div style={{ height: 'auto', width: '100%', margin: '5px 0px', border: '1px solid black', borderRadius: '10px', padding: '2px', display: 'flex' }}>
                        <Grid container spacing={1}>
                            <Grid item xs={10} style={{ display: "flex" }}>
                                <Box >

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
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            Month Wise Integration Site Count
                        </Box>
                        <Box>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DatePicker views={['month', 'year']} onChange={handleMonthYear} />
                            </LocalizationProvider>
                            <Tooltip title="Download Integration Records">
                                <IconButton onClick={() => { handleExport(); }}>
                                    <DownloadIcon fontSize='large' color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box sx={{ marginTop: 0 }}>

                        <TableContainer sx={{ maxHeight: 550, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#223354' }}>CIRCLE</th>
                                        {/* <th colSpan='7' style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#2F75B5' }}>{monthArray[2]}</th>
                                        <th colSpan='7' style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: "#DD761C" }}>{monthArray[1]}</th>
                                        <th colSpan='7' style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#03AED2' }}>{monthArray[0]}</th> */}
                                        {monthArray?.map((item, index) => index < 3 && (
                                            <th colSpan='21' key={index} style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: headerColor[index] }}>{monthNames[item.month]}-{item.year}</th>
                                        ))}
                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        {activityArray.map((item, index) => (
                                            <th key={index} style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>{item}</th>
                                        ))}
                                        {activityArray.map((item, index) => (
                                            <th key={index} style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#FF9933' }}>{item}</th>
                                        ))}
                                        {activityArray.map((item, index) => (
                                            <th key={index} style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#68D2E8' }}>{item}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.map((it) => {
                                        return (
                                            <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: 'rgb(197 214 246)', color: 'black' }}>{it?.cir}</th>

                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'DE-GROW' })}>{it?.M1_DE_GROW}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'MACRO' })}>{it?.M1_MACRO}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'OTHERS' })}>{it?.M1_OTHERS}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'RELOCATION' })}>{it?.M1_RELOCATION}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'RET' })}>{it?.M1_RET}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'ULS_HPSC' })}>{it?.M1_ULS_HPSC}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'UPGRADE' })}>{it?.M1_UPGRADE}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'FEMTO' })}>{it?.M1_FEMTO}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'HT INCREMENT' })}>{it?.M1_HT_INCREMENT}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'IBS' })}>{it?.M1_IBS}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'IDSC' })}>{it?.M1_IDSC}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'ODSC' })}>{it?.M1_ODSC}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'RECTIFICATION' })}>{it?.M1_RECTIFICATION}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'OPERATIONS' })}>{it?.M1_OPERATIONS}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'RRU UPGRADE' })}>{it?.M1_RRU_UPGRADE || 0}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: '5G BW UPGRADE' })}>{it?.M1_5G_BW_UPGRADE || 0}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: '5G RRU SWAP' })}>{it?.M1_5G_RRU_SWAP || 0}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: '5G SECTOR ADDITION' })}>{it?.M1_5G_SECTOR_ADDITION}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: '5G RELOCATION' })}>{it?.M1_5G_RELOCATION}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'TRAFFIC SHIFTING' })}>{it?.M1_TRAFFIC_SHIFTING}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'RRU SWAP' })}>{it?.M1_RRU_SWAP}</th>



                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'DE-GROW' })}>{it?.M2_DE_GROW}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'MACRO' })}>{it?.M2_MACRO}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'OTHERS' })}>{it?.M2_OTHERS}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'RELOCATION' })}>{it?.M2_RELOCATION}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'RET' })}>{it?.M2_RET}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'ULS_HPSC' })}>{it?.M2_ULS_HPSC}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'UPGRADE' })}>{it?.M2_UPGRADE}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'FEMTO' })}>{it?.M2_FEMTO}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'HT INCREMENT' })}>{it?.M2_HT_INCREMENT}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'IBS' })}>{it?.M2_IBS}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'IDSC' })}>{it?.M2_IDSC}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'ODSC' })}>{it?.M2_ODSC}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'RECTIFICATION' })}>{it?.M2_RECTIFICATION}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'OPERATIONS' })}>{it?.M2_OPERATIONS}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'RRU UPGRADE' })}>{it?.M2_RRU_UPGRADE || 0}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: '5G BW UPGRADE' })}>{it?.M2_5G_BW_UPGRADE || 0}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: '5G RRU SWAP' })}>{it?.M2_5G_RRU_SWAP || 0}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: '5G SECTOR ADDITION' })}>{it?.M2_5G_SECTOR_ADDITION}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: '5G RELOCATION' })}>{it?.M2_5G_RELOCATION}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[1], yea: years[1], circle: it?.cir, activity: 'TRAFFIC SHIFTING' })}>{it?.M2_TRAFFIC_SHIFTING}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'RRU SWAP' })}>{it?.M2_RRU_SWAP}</th>


                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'DE-GROW' })}>{it?.M3_DE_GROW}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'MACRO' })}>{it?.M3_MACRO}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'OTHERS' })}>{it?.M3_OTHERS}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'RELOCATION' })}>{it?.M3_RELOCATION}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'RET' })}>{it?.M3_RET}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'ULS_HPSC' })}>{it?.M3_ULS_HPSC}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'UPGRADE' })}>{it?.M3_UPGRADE}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'FEMTO' })}>{it?.M3_FEMTO}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'HT INCREMENT' })}>{it?.M3_HT_INCREMENT}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'IBS' })}>{it?.M3_IBS}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'IDSC' })}>{it?.M3_IDSC}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'ODSC' })}>{it?.M3_ODSC}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'RECTIFICATION' })}>{it?.M3_RECTIFICATION}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'OPERATIONS' })}>{it?.M3_OPERATIONS}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'RRU UPGRADE' })}>{it?.M3_RRU_UPGRADE || 0}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: '5G BW UPGRADE' })}>{it?.M3_5G_BW_UPGRADE || 0}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: '5G RRU SWAP' })}>{it?.M3_5G_RRU_SWAP || 0}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: '5G SECTOR ADDITION' })}>{it?.M3_5G_SECTOR_ADDITION}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: '5G RELOCATION' })}>{it?.M3_5G_RELOCATION}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[2], yea: years[2], circle: it?.cir, activity: 'TRAFFIC SHIFTING' })}>{it?.M3_TRAFFIC_SHIFTING}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ mont: months[0], yea: years[0], circle: it?.cir, activity: 'RRU SWAP' })}>{it?.M3_RRU_SWAP}</th>


                                            </tr>
                                        )
                                    }
                                    )}
                                    <tr style={{ textAlign: "center", fontWeigth: 700, backgroundColor: '#B0EBB4', color: '#000000', fontSize: 17 }}>
                                        <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#B0EBB4' }}>Total</th>
                                        {totals && Object.keys(totals).map((key) => (
                                            <th key={key}>{totals[key]}</th>
                                        ))}
                                    </tr>
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

export const MemoMonthWiseIntegration = React.memo(MonthWiseIntegration)