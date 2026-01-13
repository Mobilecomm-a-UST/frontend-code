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
import * as ExcelJS from 'exceljs'


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




const WeekWise = () => {
    const classes = useStyles()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false)
    const { makePostRequest } = usePost()
    const userID = getDecreyptedData('userID')
    const { loading, action } = useLoadingDialog();
    const [mainDataT2, setMainDataT2] = useState([]);
    const [weekArray, setWeekArray] = useState([]);
    const [tableData, setTableData] = useState([])
    const [circle, setCircle] = useState([])
    const [circleOptions, setCircleOptions] = useState([])
    const [tagging, setTagging] = useState([])
    const [taggingOptions, setTaggingOptions] = useState([])
    const [relocationMethod, setRelocationMethod] = useState([])
    const [relocationMethodOptions, setRelocationMethodOptions] = useState([])
    const [toco, setToco] = useState([])
    const [tocoOptions, setTocoOptions] = useState([])
    const [month, setMonth] = useState('')
    const [downloadExcelData, setDownloadExcelData] = useState('')
    const [view, setView] = useState('Cumulative')


    const fetchDailyData = async () => {
        action(true)
        var formData = new FormData()
        formData.append('circle', circle)
        formData.append('site_tagging', tagging)
        formData.append('relocation_method', relocationMethod)
        formData.append('new_toco_name', toco)
        formData.append('month', month.split('-')[1] || '')
        formData.append('year', month.split('-')[0] || '')
        formData.append('view', view)
        const res = await postData("alok_tracker/ms2_weekly_monthly_dashboard/", formData);
        // const res =  tempData; //  remove this line when API is ready
        console.log('week wise response', JSON.parse(res.week_data), res.unique_data.week_columns)
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


    const handleMonthChange = (event) => {
        // console.log(event.target.value.split('-')[1])
        setMonth(event.target.value)
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
    const handleViewChange = (event) => {
        setView(event.target.value)
    }

    // ********* EXPORT DATA IN EXCEL FORMET **********
    const handleExport = async () => {

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Monthly Progress", {
            properties: { tabColor: { argb: 'f1948a' } }
        });

        // --------------------------
        // 1️⃣ Create dynamic columns
        // --------------------------
        const baseColumns = [
            { header: "Milestone Track/Site Count", key: "milestone", width: 30 }
        ];

        const weekColumns = weekArray.map((week, i) => ({
            header: week,
            key: `Week${i + 1}`,
            width: 15
        }));

        sheet.columns = [...baseColumns, ...weekColumns];

        // --------------------------
        // 2️⃣ Insert rows dynamically
        // --------------------------
        tableData.forEach((item) => {
            let rowData = {
                milestone: item["Milestone Track/Site Count"]
            };

            weekArray.forEach((week, index) => {
                rowData[`Week${index + 1}`] = item[`Month_Week-${index + 1}`];
            });

            sheet.addRow(rowData);
        });

        // --------------------------
        // 3️⃣ Excel Styling
        // --------------------------
        sheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {

                // Borders
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };

                // Alignment
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                // Header row styling
                if (rowNumber === 1) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '223354' }
                    };
                    cell.font = {
                        color: { argb: 'FFFFFF' },
                        bold: true,
                        size: 13,
                    };
                }
            });
        });

        // --------------------------
        // 4️⃣ Download Excel
        // --------------------------
        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "Monthly_Progress-MS1_to_MS2_Waterfall.xlsx";
        anchor.click();
        window.URL.revokeObjectURL(url);
    };

    const ClickDataGet = async (props) => {
        // console.log('aaaaaaaa', props)
        action(true)
        var formData = new FormData();
        formData.append('userId', userID);
        formData.append("circle", circle);
        formData.append("day_type", 'weekly');
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
    }, [circle, tagging, relocationMethod, toco, month, view])
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>


                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            Monthly Progress - MS1 to MS2 Waterfall
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
                                <TextField
                                    variant="outlined"
                                    // required
                                    fullWidth
                                    label="Month"
                                    name="month"
                                    value={month}
                                    onChange={handleMonthChange}
                                    size="small"
                                    type="month"
                                    InputLabelProps={{ shrink: true }}
                                />
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

                            <Tooltip title="Download Monthly-MS1 to MS2">
                                <IconButton
                                    component="a"
                                    // href={downloadExcelData}
                                    onClick={handleExport}
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
                                        {/* <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', position: 'sticky', left: 218, top: 0, backgroundColor: '#223354' }}>
                                            CF</th> */}
                                        {weekArray?.map((item, index) => (
                                            <th key={index} style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>{item}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.map((it, index) => {
                                        return (
                                            <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#CBCBCB', color: 'black' }}>{it['Milestone Track/Site Count']}</th>
                                                {/* <th style={{ position: 'sticky', left: 218, top: 0, backgroundColor: 'rgb(197 214 246)', color: 'black' }}>{it['CF']}</th> */}
                                                {weekArray?.map((item, index) => (
                                                    <th key={index} className={classes.hoverRT} style={{ cursor: 'pointer' }}
                                                        onClick={() => ClickDataGet({ col_name: item, milestone: it['Milestone Track/Site Count'] })}
                                                    >{it[`Month_Week-${index + 1}`]}</th>
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

export const MemoWeekWise = React.memo(WeekWise);