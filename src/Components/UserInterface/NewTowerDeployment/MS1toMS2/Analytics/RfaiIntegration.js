import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, TextField } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { CsvBuilder } from 'filefy';
import { useLoadingDialog } from '../../../../Hooks/LoadingDialog';
import { useStyles } from '../../../ToolsCss'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { postData } from '../../../../services/FetchNodeServices';
import 'rsuite/dist/rsuite.min.css';
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
        <FormControl sx={{ minWidth: 150, maxWidth: 200 }} size="small">
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


const RfaiIntegration = () => {
    const { loading, action } = useLoadingDialog();
    const [site_taggingAgingData, setSite_taggingAgingData] = useState([]);
    const [site_taggingAgingOption, setSite_taggingAgingOption] = useState([]);
    const [currentStatus, setCurrentStatus] = useState([])
    const [currentStatusOption, setCurrentStatusOption] = useState([])
    const [integrationToOnairData, setIntegrationToOnairData] = useState([]);
    const [milestone1, setMilestone1] = useState('RFAI');
    const [milestone2, setMilestone2] = useState('Integration');
    const [milestoneOptions, setMilestoneOptions] = useState([
        "Allocation",
        "RFAI",
        "RFAI Survey",
        "MO Punch",
        "Material Dispatch",
        "Material Delivered",
        "Installation End",
        "Integration",
        "EMF Submission",
        "Alarm Rectification Done",
        "SCFT I-Deploy Offered",
        "RAN PAT Offer",
        "RAN SAT Offer",
        "MW PAT Offer",
        "MW SAT Offer",
        "Site ONAIR",
        "I-Deploy ONAIR"
    ]);
    const [mos_pending, setMos_pending] = useState([]);
    const [downloadExcelData, setDownloadExcelData] = useState('');
    const dynamicHeaders = Object.keys(integrationToOnairData?.[0]?.data?.Done || []);

    console.log('table data', dynamicHeaders)

    const classes = useStyles();


    const fetchDailyData = async () => {
        action(true)
        var formData = new FormData()

        formData.append('site_tagging', site_taggingAgingData)
        formData.append('current_status', currentStatus)
        formData.append('milestone1', milestone1)
        formData.append('milestone2', milestone2)


        const res = await postData("alok_tracker/graphs/", formData);
        // const res =  tempData; //  remove this line when API is ready
        console.log(' rfai data', transformData(JSON.parse(res.json_data.table_summary)))
        if (res) {
            action(false)
            setIntegrationToOnairData(transformData(JSON.parse(res.json_data.table_summary)))
            if (currentStatusOption.length === 0 && site_taggingAgingOption.length === 0) {
                setCurrentStatusOption(res.unique_data.unique_current_status)
                setSite_taggingAgingOption(res.unique_data.unique_site_tagging)
            }
        }
        else {
            action(false)
        }

    }

    const transformData = (arr) => {
        const result = {};
        arr.forEach(item => {
            const circle = item.Circle;
            const status = item["Site Status"]; // "Done" or "Pending"
            if (!result[circle]) {
                result[circle] = {
                    Circle: circle,
                    data: {
                        Done: null,
                        Pending: null
                    }
                };
            }

            // Remove Circle & Site Status from inner object
            const { Circle, "Site Status": _, ...rest } = item;

            result[circle].data[status] = rest;
        });

        return Object.values(result);
    };

    const handleMilestone1Change = (event) => {
        setMilestone1(event.target.value);
    }

    const handleMilestone2Change = (event) => {
        setMilestone2(event.target.value);
    }
    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Integration to ONAIR");

        // ----------------- HEADER -----------------
        const columns = [
            { header: "Circle", key: "circle", width: 15 },
            { header: "Type", key: "type", width: 10 },
        ];

        dynamicHeaders.forEach((h) => {
            columns.push({ header: h, key: h, width: 15 });
        });

        sheet.columns = columns;

        // ----------------- ROWS -------------------
        integrationToOnairData.forEach((item) => {
            const { Circle, data } = item;
            const done = data.Done || {};
            const pending = data.Pending || {};

            // DONE row
            const doneRow = { circle: Circle, type: "Done" };
            dynamicHeaders.forEach((h) => {
                doneRow[h] = done[h] ?? "-";
            });
            sheet.addRow(doneRow);

            // PENDING row
            const pendingRow = { circle: Circle, type: "Pending" };
            dynamicHeaders.forEach((h) => {
                pendingRow[h] = pending[h] ?? "-";
            });
            sheet.addRow(pendingRow);
        });

        // ----------------- STYLING -----------------
        sheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };

                // Header styling
                if (rowNumber === 1) {
                    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "223354" } };
                    cell.font = { color: { argb: "FFFFFF" }, bold: true };
                }
            });
        });

        // ----------------- EXPORT -----------------
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Integration_to_ONAIR.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
    };



    useEffect(() => {
        fetchDailyData()
    }, [site_taggingAgingData, currentStatus, milestone1, milestone2])

    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>

                    {/* ************* 2G  TABLE DATA ************** */}
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            Done Vs Pending Count - {milestone1} to {milestone2}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <FormControl sx={{ minWidth: 120, maxWidth: 120 }} size="small">
                                <InputLabel id="demo-simple-select-label">milestone1</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={milestone1}
                                    label="milestone1"
                                    onChange={handleMilestone1Change}
                                >
                                    {milestoneOptions?.map((item, index) => (
                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 120, maxWidth: 120 }} size="small">
                                <InputLabel id="demo-simple-select-label">milestone2</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={milestone2}
                                    label="milestone2"
                                    onChange={handleMilestone2Change}
                                >
                                    {milestoneOptions?.map((item, index) => (
                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <MultiSelectWithAll
                                label="Site Tagging"
                                options={site_taggingAgingOption}
                                selectedValues={site_taggingAgingData}
                                setSelectedValues={setSite_taggingAgingData}
                            />


                            <MultiSelectWithAll
                                label="Current Status"
                                options={currentStatusOption}
                                selectedValues={currentStatus}
                                setSelectedValues={setCurrentStatus}
                            />
                            {/* <Tooltip title="Download Ageing Data">
                                <IconButton
                                    component="a"
                                    href={downloadExcelData}
                                    download
                                >
                                    <DownloadIcon fontSize="large" color="primary" />
                                </IconButton>
                            </Tooltip> */}
                        </Box>
                    </Box>

                    <Box sx={{ marginTop: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>


                        <TableContainer
                            sx={{ maxHeight: 600, boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
                            component={Paper}
                        >
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: "collapse" }}>
                                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>

                                    {/* TOP HEADER */}
                                    <tr style={{ backgroundColor: "#223354", color: "white" }}>
                                        <th
                                            rowSpan={2}
                                            style={{
                                                padding: "1px 1px",
                                                whiteSpace: "nowrap",
                                                position: "sticky",
                                                left: 0,
                                                top: 0,
                                                zIndex: 3,
                                                backgroundColor: "#006e74",
                                            }}
                                        >
                                            Circle
                                        </th>
                                        <th colSpan={dynamicHeaders.length + 1}>Status Summary</th>
                                    </tr>

                                    {/* SUB HEADER */}
                                    <tr style={{ backgroundColor: "#CBCBCB" }}>
                                        <th>Type</th>
                                        {dynamicHeaders.map((h) => (
                                            <th key={h}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {integrationToOnairData?.map((item, idx) => {
                                        const { Circle, data } = item;
                                        const done = data.Done || {};
                                        const pending = data.Pending || {};

                                        return (
                                            <React.Fragment key={idx}>
                                                {/* DONE */}
                                                <tr className={classes.tableRow} style={{ textAlign: "center" }}>
                                                    <th
                                                        rowSpan={2}
                                                    >
                                                        {Circle}
                                                    </th>
                                                    <th>Done</th>
                                                    {dynamicHeaders.map((h) => (
                                                        <th key={h}>{done[h] ?? "-"}</th>
                                                    ))}
                                                </tr>

                                                {/* PENDING */}
                                                <tr className={classes.tableRow} style={{ textAlign: "center" }}>
                                                    <th>Pending</th>
                                                    {dynamicHeaders.map((h) => (
                                                        <th key={h}>{pending[h] ?? "-"}</th>
                                                    ))}
                                                </tr>
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </TableContainer>
                    </Box>
                </div>
            </Slide>
            {loading}
        </>
    )
}

export default RfaiIntegration