import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
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
        const res = await postData("alok_tracker/ms2_weekly_monthly_dashboard/", formData);
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


    const handleViewChange = (event) => {
        setView(event.target.value)
    }

    const handleClose = () => {
        setOpen(false)
    }



    const handleExport = async () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Yearly Progress", {
            properties: { tabColor: { argb: '223354' } }
        });

        // ------- BUILD DYNAMIC COLUMNS ----------
        const columns = [
            { header: 'Milestone Track/Site Count', key: 'milestone', width: 30 },
            { header: 'CF', key: 'CF', width: 10 },
        ];

        monthArray.forEach((month, index) => {
            columns.push({
                header: month,
                key: `Month_${index + 1}`,
                width: 15
            });
        });

        sheet.columns = columns;

        // ------- ADD ROWS ----------
        tableData.forEach((item) => {
            const row = {
                milestone: item["Milestone Track/Site Count"],
                CF: item["CF"] ?? "",
            };

            monthArray.forEach((_, index) => {
                row[`Month_${index + 1}`] = Number(item[`Month-${index + 1}`]) ?? "";
            });

            sheet.addRow(row);
        });

        // ------- STYLING ----------
        sheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { vertical: "middle", horizontal: "center" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };

                // Header style
                if (rowNumber === 1) {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "223354" }
                    };
                    cell.font = {
                        color: { argb: "FFFFFF" },
                        bold: true,
                        size: 12,
                    };
                }
            });
        });

        // ------- CREATE & DOWNLOAD FILE ----------
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Yearly_Progress_MS1_to_MS2_Waterfall.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
    };

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
                            Yearly Progress - MS1 to MS2 Waterfall
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

                            <Tooltip title="Download Yearly MS1 to MS2 Waterfall">
                                <IconButton
                                    component="a"
                                    // href={downloadExcelData}
                                    onClick={(handleExport)}
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