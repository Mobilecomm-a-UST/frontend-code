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
import { useGet } from '../../../../Hooks/GetApis';
import { usePost } from '../../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../../Hooks/LoadingDialog';
import { useQuery } from '@tanstack/react-query';
import { useStyles } from '../../../ToolsCss'
import { setEncreptedData, getDecreyptedData } from '../../../../utils/localstorage';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { postData } from '../../../../services/FetchNodeServices';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';



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




const MonthWise = () => {
    const classes = useStyles()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userID = getDecreyptedData('userID')
    const [open, setOpen] = useState(false)
    const { makePostRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const [mainDataT2, setMainDataT2] = useState([])
    const [monthArray, setMonthArray] = useState([])
    const [tableData, setTableData] = useState([])
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
    // const [totals, setTotals] = useState()


    // console.log('table data', tableData)

    const fetchDailyData = async () => {
        action(true)
        var formData = new FormData()
        formData.append('circle', circle)
        formData.append('site_tagging', tagging)
        formData.append('relocation_method', relocationMethod)
        formData.append('new_toco_name', toco)
        formData.append('view', view)
        const res = await postData("alok_tracker/weekly_monthly_dashboard_file/", formData);
        // const res =  tempData; //  remove this line when API is ready
        console.log('month wise response', res)
        if (res) {
            action(false)
            setMonthArray(res.unique_data.month_columns)
            setTableData(JSON.parse(res.months_data))
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
        const {
            target: { value },
        } = event;
        setCircle(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        // setCircle(event.target.value)
    }
    const handleTagging = (event) => {
        const {
            target: { value },
        } = event;
        setTagging(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        // setTagging(event.target.value)
    }
    const handleRelocationMethod = (event) => {
        const {
            target: { value },
        } = event;
        setRelocationMethod(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        // setRelocationMethod(event.target.value)
    }
    const handleToco = (event) => {
        const {
            target: { value },
        } = event;
        setToco(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        // setToco(event.target.value)
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
    const handleViewChange = (event) => {
        setView(event.target.value)
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
        // console.log('aaaaaaaa', props)
        action(true)
        var formData = new FormData();
        formData.append('userId', userID);
        formData.append("circle", circle);
        formData.append("day_type", 'monthly    ');
        formData.append("milestone", props.milestone);
        formData.append("col_name", props.col_name);
        formData.append('site_tagging', tagging);
        formData.append('current_status', relocationMethod);
        formData.append('toco_name', toco);
        formData.append('view', view)

        const responce = await makePostRequest('alok_tracker/hyperlink_frontend_editing/', formData)
        if (responce) {
            console.log('response', JSON.parse(responce.data))
            action(false);
            const temp = JSON.parse(responce.data)

            dispatch({ type: 'RELOCATION_FINAL_TRACKER', payload: { temp } })
            navigate(`/tools/relocation_tracking/rfai_to_ms1_waterfall/${props.milestone}`)
        }
        else {
            action(false)
        }
    }


    useEffect(() => {
        fetchDailyData()
        // setTotals(calculateColumnTotals(tableData))
    }, [circle, tagging, relocationMethod, toco, view])
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>

                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            Yearly Progress - RFAI to MS1 Waterfall
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
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

                            <Tooltip title="Download Yearly-RFAI to MS1 Waterfall">
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
                                        <th style={{ padding: '5px 15px', whiteSpace: 'nowrap', position: 'sticky', left: 218, top: 0, backgroundColor: '#006e74' }}>
                                            CF</th>
                                        {monthArray?.map((item, index) => (
                                            <th key={index} style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>{item}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.map((it, index) => {
                                        return (
                                            <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#CBCBCB', color: 'black' }}>{it['Milestone Track/Site Count']}</th>
                                                <th style={{ position: 'sticky', left: 218, top: 0, backgroundColor: '#CBCBCB', color: 'black' }}>{it['CF']}</th>
                                                {monthArray?.map((item, index) => (
                                                    <th key={index} className={classes.hoverRT} style={{ cursor: 'pointer' }}
                                                         onClick={() => ClickDataGet({ col_name: item, milestone: it['Milestone Track/Site Count'] })}
                                                    >{it[`Month-${index + 1}`]}</th>
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

export const MemoMonthWise = React.memo(MonthWise)