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
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
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




const DateWise = () => {
    const classes = useStyles()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(true)
    const { makePostRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const userID = getDecreyptedData('userID')
    const [dateArray, setDateArray] = useState([])
    const [tableData, setTableData] = useState([])
    const [milestone, setMilestone] = useState([])
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
    const [month, setMonth] = useState('')
    const { afterToday, combine } = DateRangePicker;



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
        formData.append('month', month.split('-')[1] || '')
        formData.append('year', month.split('-')[0] || '')
        const res = await postData("upgrade_tracker/ms2_daily_dashboard/", formData);
        // const res =  tempData; //  remove this line when API is ready
        // console.log('date wise response', res)
        if (res) {
            action(false)
            setDateArray(res.dates)
            setTableData(JSON.parse(res.data))
            setCircleOptions(res.unique_data.unique_circle)
            // setTaggingOptions(res.unique_data.unique_site_tagging)
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
                formData.append('userId', userID);
                formData.append('circle', circle)
                formData.append('site_tagging', tagging)
                formData.append('relocation_method', relocationMethod)
                formData.append('new_toco_name', toco)
                formData.append('milestone1', milestone1)
                formData.append('milestone2', milestone2)
                formData.append('last_date', convertToYMD(dateArray.at(-1)))
                formData.append('gap', gap)
                try {
                    const res = await postData("upgrade_tracker/gap_view/", formData);
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

    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Daily Progress");

        // ----------- DEFINE HEADERS -------------
        const columns = [
            { header: "Milestone Track/Site Count", key: "milestone", width: 30 },
            { header: "CF", key: "cf", width: 10 },
            { header: "AOP", key: "AOP", width: 10 },
        ];

        // Dynamic date columns
        dateArray.forEach((date, index) => {
            columns.push({
                header: date,
                key: `date_${index + 1}`,
                width: 15
            });
        });

        // Gap column
        columns.push({ header: "Gap", key: "gap", width: 10 });

        sheet.columns = columns;

        // ------------ ADD ROWS -----------------
        tableData.forEach((row, rowIndex) => {
            const excelRow = {
                milestone: row["Milestone Track/Site Count"],
                cf: row["CF"] ?? "",
                AOP: row["AOP"] ?? ""
            };

            dateArray.forEach((_, index) => {
                excelRow[`date_${index + 1}`] = row[`date_${index + 1}`] ?? "";
            });

            excelRow["gap"] = row["Gap"] ?? "";

            sheet.addRow(excelRow);
        });

        // ------------ STYLE HEADER --------------
        sheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFF" } };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "223354" }
            };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        // ------------ STYLE BODY ----------------
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            row.eachCell((cell) => {
                cell.alignment = { horizontal: "center" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        });

        // ------------ DOWNLOAD EXCEL -------------
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Daily_Progress-MS1_to_MS2_Waterfall.xlsx";
        a.click();
        URL.revokeObjectURL(url);
    };


    const ClickDataGet = async (props) => {
        // console.log('aaaaaaaa', props)
        action(true)
        var formData = new FormData();
        formData.append('userId', userID);
        formData.append("circle", circle);
        formData.append("day_type", 'daily');
        formData.append("milestone", props.milestone);
        formData.append("col_name", props.col_name);
        formData.append('site_tagging', tagging);
        formData.append('current_status', relocationMethod);
        formData.append('toco_name', toco);
        formData.append('view', view)

        const responce = await makePostRequest('upgrade_tracker/hyperlink_frontend_editing/', formData)
        if (responce) {
            console.log('response', JSON.parse(responce.data))
            action(false);
            const temp = JSON.parse(responce.data)

            dispatch({ type: 'RELOCATION_FINAL_TRACKER', payload: { temp } })
            navigate(`/tools/upgrade_deployment/ms1_to_ms2_waterfall/${props.milestone}`)
        }
        else {
            action(false)
        }
    }

    useEffect(() => {
        fetchDailyData()
        // setTotals(calculateColumnTotals(tableData))
    }, [circle, tagging, relocationMethod, toco, selectDate, view, month])
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>

                    {/* ************* 2G  TABLE DATA ************** */}
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            Daily Progress - MS1 to MS2 Waterfall
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <FormControl sx={{ minWidth: 200 }} size="small">
                                <DateRangePicker onChange={(e) => handleDateFormate(e)} size="md" format="dd.MM.yyyy" shouldDisableDate={afterToday} placeholder="Select Date Range" color='black' />
                            </FormControl>
                            <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
                                <TextField
                                    variant="outlined"  
                                    // required
                                    fullWidth
                                    label="Month"
                                    name="month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
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
                            {/* <MultiSelectWithAll
                                label="Site Tagging"
                                options={taggingOptions}
                                selectedValues={tagging}
                                setSelectedValues={setTagging}
                            /> */}

                            {/* Current Status */}
                            {/* <MultiSelectWithAll
                                label="Current Status"
                                options={relocationMethodOptions}
                                selectedValues={relocationMethod}
                                setSelectedValues={setRelocationMethod}
                            /> */}

                            {/* Toco  */}

                            <MultiSelectWithAll
                                label="TOCO"
                                options={tocoOptions}
                                selectedValues={toco}
                                setSelectedValues={setToco}
                            />



                            <Tooltip title="Download Daily MS1 to MS2 Waterfall">
                                <IconButton
                                    component="a"
                                    // href={downloadExcelData}
                                    onClick={(handleExportExcel)}
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
                                        <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#006e74' }}>
                                            Milestone Track/Site Count</th>
                                          <th style={{ padding: '5px 15px', whiteSpace: 'nowrap', backgroundColor: '#006e74' }}>
                                            AOP</th>
                                            {month &&  <th style={{ padding: '5px 15px', whiteSpace: 'nowrap', backgroundColor: '#006e74' }}>
                                            CF</th>} 
                                        {dateArray?.map((item, index) => (
                                            <th key={index} style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>{item}</th>
                                        ))}
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#ff6060' }}>Gap</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.map((it, index) => {
                                        return (
                                            <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#CBCBCB', color: 'black' }}>{it['Milestone Track/Site Count']}</th>
                                                 <th style={{ backgroundColor: '#CBCBCB', color: 'black' }}>{it['AOP']}</th>
                                                {month && <th style={{ backgroundColor: '#CBCBCB', color: 'black' }}>{it['CF']}</th>}
                                                {dateArray?.map((item, index) => (
                                                    // <th key={index} style={{ backgroundColor: it[`date_${index + 1}`] > 0 ? '#FEEFAD' : '' }} >{it[`date_${index + 1}`]}</th>
                                                    <th key={index} className={classes.hoverRT} style={{ cursor: 'pointer' }}
                                                        onClick={() => ClickDataGet({ date_value: it[`date_${index + 1}`], col_name: item, milestone: it['Milestone Track/Site Count'] })} >
                                                        {isNaN(parseInt(it[`date_${index + 1}`])) ? '-' : parseInt(it[`date_${index + 1}`])}
                                                    </th>
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