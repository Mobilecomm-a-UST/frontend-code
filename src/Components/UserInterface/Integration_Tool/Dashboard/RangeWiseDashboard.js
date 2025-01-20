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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const RangeWiseDashboard = ({ onData }) => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const { response, makeGetRequest } = useGet()
    const { makePostRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const [mainDataT2, setMainDataT2] = useState([])
    const [dateArray, setDateArray] = useState([])
    const [tableData, setTableData] = useState([])
    const [givenDate, setGivenDate] = useState('')
    const [fromDate , setFromDate] = useState('')
    const [toDate , setToDate] = useState('')

    // const [totals, setTotals] = useState()




    const { isPending, isFetching, isError, data, refetch } = useQuery({
        queryKey: ['Integration_Range_wise'],
        queryFn: async () => {
            action(isPending)
            var formData = new FormData()
            formData.append('from_date', fromDate)
            formData.append('to_date', toDate)
            const res = await makePostRequest("IntegrationTracker/date-range-integration-data/", formData);
            if (res) {
                action(false)
                // ShortDate(res.latest_dates)
                // setDateArray(res.date_range)
                setFromDate(res.date_range[0])
                setToDate(res.date_range[1])
                setTableData(JSON.parse(res.table_data))
                // console.log(JSON.parse(res.table_data))
                onData(res);
                return res;
            }
            else {
                action(false)
            }
        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })


    // console.log('range dashboard', data, tableData)

    const calculateColumnTotals = (datass) => {
        const totals = {
            D1_DE_GROW: 0,
            D1_MACRO: 0,
            D1_OTHERS: 0,
            D1_RELOCATION: 0,
            D1_RET: 0,
            D1_ULS_HPSC: 0,
            D1_UPGRADE: 0,
            D1_FEMTO: 0,
            D1_HT_INCREMENT: 0,
            D1_IBS: 0,
            D1_IDSC: 0,
            D1_ODSC: 0,
            D1_RECTIFICATION: 0,
            D1_OPERATIONS: 0,
            D1_5G_SECTOR_ADDITION:0,
            D1_5G_RELOCATION:0,
        };

        datass.forEach(item => {
            for (let key in totals) {
                totals[key] += Number(item[key]) || 0;
            }
        });

        return totals;
    };

    const totals = calculateColumnTotals(tableData);

    const ShortDate = (dates) => {
        const dateObjects = dates.map(dateStr => new Date(dateStr));

        // Sort Date objects in increasing order
        dateObjects.sort((a, b) => a - b);

        // Convert sorted Date objects back to string format
        const sortedDates = dateObjects.map(date => date.toISOString().split('T')[0]);

        setDateArray(sortedDates)

    }

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

    ]
    // handleExport Range wise table in excel formet.........
    const handleExport = () => {
        var csvBuilder = new CsvBuilder(`Range_Wise_Integration_Tracker.csv`)
            .setColumns(columnData.map(item => item.title))
            .addRows(data?.download_data.map(row => columnData.map(col => row[col.field])))
            .exportFile();
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
        formData.append("from_date", fromDate);
        formData.append("to_date", toDate);
        const responce = await makePostRequest('IntegrationTracker/hyperlink-date-range-integration-data/', formData)
        if (responce) {
            // console.log('responce', responce)
            // setMainDataT2(responce)
            action(false)
            localStorage.setItem("integration_final_tracker", JSON.stringify(responce.data));
            // console.log('response data in huawia site id' , response)
            window.open(`${window.location.href}/${props.activity}`, "_blank")
            // setOpen(true)
        }
        else {
            action(false)
        }
    }

    const handleDate = async (date) => {
        await setToDate(date)

        await refetch()

    }


    const ChangeDateFormate=(dates)=>{
        const [year, month, day] = dates.split('-');
        return `${day}-${month}-${year}`;
    }

    useEffect(() => {
        if (data) {
            // ShortDate(data.latest_dates)
            setTableData(JSON.parse(data.table_data))
            onData(data);
        }
        // setTotals(calculateColumnTotals(tableData))
    }, [])


    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>
                    {/* <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" href='/tools'>Tools</Link>

                    <Link underline="hover" href='/tools/Integration'>Integration</Link>
                    <Typography color='text.primary'>Dashboard</Typography>
                </Breadcrumbs>
            </div>
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
                            Range Wise Integration Site Count
                        </Box>
                        <Box>
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DatePicker
                                    value={givenDate}
                                    onChange={handleDate}
                                />
                            </LocalizationProvider> */}
                            <TextField
                                size='small'
                                value={fromDate}
                                onChange={(e) => { setFromDate(e.target.value) }}
                                type='date'
                                label="From Date"
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"> </InputAdornment>,
                                }} />~
                            <TextField
                                size='small'
                                value={toDate}
                                onChange={(e) => { handleDate(e.target.value) }}
                                type='date'
                                label="To Date"
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"> </InputAdornment>,
                                }} />

                            <Tooltip title="Download Integration Records">
                                <IconButton onClick={() => { handleExport(); }}>
                                    <DownloadIcon fontSize='large' color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box sx={{ marginTop: 0 }}>
                        <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#223354' }}>CIRCLE</th>
                                        <th colSpan='16' style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#2F75B5' }}>{data && ChangeDateFormate(data?.date_range[0])} to {data &&  ChangeDateFormate(data?.date_range[1])}</th>
                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>DE-GROW     </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>MACRO       </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>OTHER       </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>RELOCATION  </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>RET         </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>ULS-HPSC    </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>UPGRADE     </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>FEMTO       </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>HT-INCREMENT</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>IBS          </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>IDSC         </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>ODSC          </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>RECTIFICATION</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>OPERATIONS</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>5G SECTOR ADDITION</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>5G RELOCATION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.map((it, index) => {
                                        return (
                                            <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: 'rgb(197 214 246)', color: 'black' }}>{it?.cir}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'DE-GROW' })}>{it?.D1_DE_GROW}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'MACRO' })}>{it?.D1_MACRO}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'OTHERS' })}>{it?.D1_OTHERS}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'RELOCATION' })}>{it?.D1_RELOCATION}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'RET' })}>{it?.D1_RET}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'ULS_HPSC' })}>{it?.D1_ULS_HPSC}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'UPGRADE' })}>{it?.D1_UPGRADE}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'FEMTO' })}>{it?.D1_FEMTO}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'HT INCREMENT' })}>{it?.D1_HT_INCREMENT}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'IBS' })}>{it?.D1_IBS}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'IDSC' })}>{it?.D1_IDSC}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'ODSC' })}>{it?.D1_ODSC}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'RECTIFICATION' })}>{it?.D1_RECTIFICATION}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: 'OPERATIONS' })}>{it?.D1_OPERATIONS}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: '5G SECTOR ADDITION' })}>{it?.D1_5G_SECTOR_ADDITION}</th>
                                                <th style={{ cursor: 'pointer' }} className={classes.hover} onClick={() => ClickDataGet({ date: dateArray[2], circle: it?.cir, activity: '5G RELOCATION' })}>{it?.D1_5G_RELOCATION}</th>

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

export const MemoRangeWiseDashboard = React.memo(RangeWiseDashboard)