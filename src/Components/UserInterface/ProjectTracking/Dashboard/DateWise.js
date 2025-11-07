import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, TextField } from "@mui/material";
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
import { useStyles } from '../../ToolsCss'
import { setEncreptedData, getDecreyptedData } from '../../../utils/localstorage';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { postData } from '../../../services/FetchNodeServices';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { set } from 'lodash';




const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MultiSelectWithAll = ({ label, options, selectedValues, setSelectedValues }) => {
    const handleChange = (event) => {
        const { value } = event.target;
        const selected = typeof value === 'string' ? value.split(',') : value;

        if (selected.includes('ALL')) {
            if (selectedValues.length === options.length) {
                setSelectedValues([]);
            } else {
                setSelectedValues(options);
            }
        } else {
            setSelectedValues(selected);
        }
    };

    const isAllSelected = options.length > 0 && selectedValues.length === options.length;

    return (
        <FormControl sx={{ minWidth: 120, maxWidth: 120 }} size="small">
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Select
                labelId={`${label}-label`}
                multiple
                value={selectedValues}
                onChange={handleChange}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => selected.join(', ')}
            >
                <MenuItem value="ALL">
                    <Checkbox
                        checked={isAllSelected}
                        indeterminate={
                            selectedValues.length > 0 && selectedValues.length < options.length
                        }
                    />
                    <ListItemText primary="Select All" />
                </MenuItem>

                {options.map((name) => (
                    <MenuItem key={name} value={name}>
                        <Checkbox checked={selectedValues.includes(name)} />
                        <ListItemText primary={name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};




const DateWise = () => {
    const classes = useStyles()
    const [open, setOpen] = useState(true)
    const { makePostRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const [mainDataT2, setMainDataT2] = useState([])
    const [dateArray, setDateArray] = useState([])
    const [tableData, setTableData] = useState([])
    const [milestone, setMilestone] = useState([])
    const [gapData, setGapData] = useState('')
    const [circle, setCircle] = useState([])
    const [circleOptions, setCircleOptions] = useState([])
    const [tagging, setTagging] = useState([])
    const [taggingOptions, setTaggingOptions] = useState([])
    const [relocationMethod, setRelocationMethod] = useState([])
    const [relocationMethodOptions, setRelocationMethodOptions] = useState([])
    const [toco, setToco] = useState([])
    const [tocoOptions, setTocoOptions] = useState([])
    const [downloadExcelData, setDownloadExcelData] = useState('')
    const [view, setView] = useState('Cumulative')
    const [selectDate, setSelectDate] = useState([])
    const { afterToday, combine } = DateRangePicker;
    // const [totals, setTotals] = useState()

    console.log('table data', tableData)

    const fetchDailyData = async () => {
        action(true)
        var formData = new FormData()
        formData.append('circle', circle)
        formData.append('site_tagging', tagging)
        formData.append('relocation_method', relocationMethod)
        formData.append('new_toco_name', toco)
        formData.append('from_date', selectDate[0] || '')
        formData.append('to_date', selectDate[1] || '')
        formData.append('view', view)
        const res = await postData("alok_tracker/daily_dashboard_file/", formData);
        // const res =  tempData; //  remove this line when API is ready
        console.log('date wise response', res)
        if (res) {
            action(false)
            setDateArray(res.dates)
            setTableData(JSON.parse(res.data))
            setCircleOptions(res.unique_data.unique_circle)
            setTaggingOptions(res.unique_data.unique_site_tagging)
            setRelocationMethodOptions(res.unique_data.unique_relocation_method)
            setTocoOptions(res.unique_data.unique_new_toco_name)
            setMilestone(res.unique_data.Milestone)
            setDownloadExcelData(res.download_link)
            // setMainDataT2(JSON.parse(res.data))
        }
        else {
            action(false)
        }

    }

    const handleViewChange = (event) => {
        setView(event.target.value)
    }

    const handleDateFormate = (dateArray) => {
        // console.log('date array', dateArray)
        const formattedDates = dateArray.map(date => ChangeDateFormate(date));
        setSelectDate(formattedDates);
        // console.log('chnage date formate ', formattedDates)
    }

    // console.log('date wise dashboard')

    const ChangeDateFormate = (date) => {
        if (!date) return '';

        const d = new Date(date);
        if (isNaN(d)) return 'Invalid Date';

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const convertToYMD = (dateStr) => {
        const [day, monthStr, year] = dateStr.split('-');

        // month map
        const months = {
            Jan: '01',
            Feb: '02',
            Mar: '03',
            Apr: '04',
            May: '05',
            Jun: '06',
            Jul: '07',
            Aug: '08',
            Sep: '09',
            Oct: '10',
            Nov: '11',
            Dec: '12'
        };

        const month = months[monthStr];
        const fullYear = `20${year}`; // convert '25' → '2025'

        return `${fullYear}-${month}-${day}`;
    };

    const handleGapHiperlink = async (milestone1, milestone2, gap) => {
        let mile = { milestone1, milestone2 };

        if (gap == 0 || gap === '-') {
            alert('Gap value is zero, file not available for download')
        } else {

            if (milestone2 && milestone1 && gap) {
                action(true)
                var formData = new FormData()
                formData.append('circle', circle)
                formData.append('site_tagging', tagging)
                formData.append('relocation_method', relocationMethod)
                formData.append('new_toco_name', toco)
                formData.append('milestone1', milestone1)
                formData.append('milestone2', milestone2)
                formData.append('last_date', convertToYMD(dateArray.at(-1)))
                formData.append('gap', gap)
                try {
                    const res = await postData("alok_tracker/gap_view/", formData);
                    console.log('gap response', res);

                    if (res?.download_link) {
                        // ✅ Trigger automatic file download
                        const link = document.createElement('a');
                        link.href = res.download_link;
                        link.setAttribute('download', '');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                } catch (err) {
                    console.error('Error downloading file:', err);
                } finally {
                    action(false);
                }
            }
        }


        // console.log('gap value', mile)
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
    const filterDialog = (() => {
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
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Site Priority</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Delta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {mainDataT2?.data?.map((item) => (
                                    <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                        <th>{item.Circle}</th>
                                        <th>{item.Short_name}</th>
                                        <th>{item.current_date}</th>
                                        <th>{item.previous_date}</th>
                                        <th>{item.del_value.toUpperCase()}</th>
                                        <th>{item.delta}</th>
                                    </tr>
                                ))} */}
                            </tbody>


                        </table>
                    </TableContainer>

                </DialogContent>
            </Dialog>
        )
    })

    const ClickDataGet = async (props) => {


        // console.log('aaaaaaaa', props)
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
    }, [circle, tagging, relocationMethod, toco, selectDate, view])
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>

                    {/* ************* 2G  TABLE DATA ************** */}
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            Daily Progress - RFAI to MS1 Waterfall
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <FormControl sx={{ minWidth: 200 }} size="small">
                                <DateRangePicker onChange={(e) => handleDateFormate(e)} size="md" format="dd.MM.yyyy" shouldDisableDate={afterToday} placeholder="Select Date Range" color='black' />
                            </FormControl>
                            <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
                                <InputLabel id="demo-select-small-label">View</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={view}
                                    label="View"
                                    onChange={handleViewChange}
                                >
                                    <MenuItem value="Cumulative">Cumulative</MenuItem>
                                    <MenuItem value="Non-cumulative">Non-cumulative</MenuItem>

                                </Select>
                            </FormControl>
                            {/* circle */}
                            <MultiSelectWithAll
                                label="Circle"
                                options={circleOptions}
                                selectedValues={circle}
                                setSelectedValues={setCircle}
                            />

                            {/* tagging */}
                            <MultiSelectWithAll
                                label="Site Tagging"
                                options={taggingOptions}
                                selectedValues={tagging}
                                setSelectedValues={setTagging}
                            />

                            {/* Current Status */}
                            <MultiSelectWithAll
                                label="Current Status"
                                options={relocationMethodOptions}
                                selectedValues={relocationMethod}
                                setSelectedValues={setRelocationMethod}
                            />

                            {/* Toco  */}

                            <MultiSelectWithAll
                                label="TOCO"
                                options={tocoOptions}
                                selectedValues={toco}
                                setSelectedValues={setToco}
                            />



                            <Tooltip title="Download Daily-RFAI to MS1 Waterfall">
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
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#006e74' }}>
                                            Milestone Track/Site Count</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', position: 'sticky', left: '14%', top: 0, backgroundColor: '#006e74' }}>
                                            CF</th>
                                        {dateArray?.map((item, index) => (
                                            <th key={index} style={{ padding: '1px 1px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>{item}</th>
                                        ))}
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#ff6060' }}>Gap</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.map((it, index) => {
                                        return (
                                            <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#CBCBCB', color: 'black' }}>{it['Milestone Track/Site Count']}</th>
                                                <th style={{ position: 'sticky', left: '14%', top: 0, backgroundColor: '#CBCBCB', color: 'black' }}>{it['CF']}</th>
                                                {dateArray?.map((item, index) => (
                                                    // <th key={index} style={{ backgroundColor: it[`date_${index + 1}`] > 0 ? '#FEEFAD' : '' }} >{it[`date_${index + 1}`]}</th>
                                                    <th key={index}  >{isNaN(parseInt(it[`date_${index + 1}`])) ? '-' : parseInt(it[`date_${index + 1}`])}</th>
                                                ))}
                                                <th style={{ cursor: 'pointer' }} title='Click to Download Excel' className={classes.hoverRT} onClick={() => handleGapHiperlink(milestone[index - 1], milestone[index], it['Gap'])}>{isNaN(parseInt(it['Gap'])) ? '-' : parseInt(it['Gap'])}</th>
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
            {/* {gapData && filterDialog()} */}
            {loading}
        </>
    )
}

export const MDateWise = React.memo(DateWise)