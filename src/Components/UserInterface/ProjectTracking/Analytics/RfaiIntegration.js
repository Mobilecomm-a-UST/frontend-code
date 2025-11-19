import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, TextField } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { CsvBuilder } from 'filefy';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useStyles } from '../../ToolsCss'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { postData } from '../../../services/FetchNodeServices';
import 'rsuite/dist/rsuite.min.css';


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
    const [mos_pending, setMos_pending] = useState([]);
    const [downloadExcelData, setDownloadExcelData] = useState('');

    const classes = useStyles();


    const fetchDailyData = async () => {
        action(true)
        var formData = new FormData()

        formData.append('site_tagging', site_taggingAgingData)
        formData.append('current_status', currentStatus)
        formData.append('milestone1', 'RFAI')
        formData.append('milestone2', 'Integration')


        const res = await postData("alok_tracker/graphs/", formData);
        // const res =  tempData; //  remove this line when API is ready
        console.log(' rfai data', JSON.parse(res.json_data.rfai_to_integration_table))
        if (res) {
            action(false)
            setIntegrationToOnairData(transformData(JSON.parse(res.json_data.rfai_to_integration_table)))
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

    useEffect(() => {
        fetchDailyData()
    }, [site_taggingAgingData, currentStatus])

    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>

                    {/* ************* 2G  TABLE DATA ************** */}
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            Done Vs Pending Count - Clear RFAI to Integration
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>

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
                            sx={{ maxHeight: 400, boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
                            component={Paper}
                        >
                            <table
                                style={{
                                    width: "100%",
                                    border: "1px solid black",
                                    borderCollapse: "collapse",
                                    overflow: "auto",
                                }}
                            >
                                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                    {/* Top Header */}
                                    <tr
                                        style={{
                                            fontSize: 15,
                                            backgroundColor: "#223354",
                                            color: "white",
                                            border: "1px solid white",
                                        }}
                                    >
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
                                        <th colSpan={11} style={{ padding: "1px 1px" }}>
                                            Status Summary
                                        </th>
                                    </tr>

                                    {/* Second header row */}
                                    <tr
                                        style={{
                                            fontSize: 15,
                                            backgroundColor: "#CBCBCB",
                                            color: "black",
                                            border: "1px solid white",
                                        }}
                                    >
                                        <th>Site Status</th>
                                        <th>Site RFAI</th>
                                        <th>Site Allocation</th>
                                        <th>Survey Status</th>
                                        <th>Material Punched</th>
                                        <th>Material Delivered</th>
                                        <th>Installation End</th>
                                        <th>Integration Status</th>
                                 
                                    </tr>
                                </thead>

                                <tbody>
                                    {integrationToOnairData?.map((item, idx) => {
                                        const { Circle, data } = item;
                                        const done = data?.Done || {};
                                        const pending = data?.Pending || {};

                                        return (
                                            <React.Fragment key={idx}>
                                                {/* DONE ROW */}
                                                <tr className={classes.hoverRT} style={{ textAlign: "center" }} >
                                                    <th
                                                        rowSpan={2}
                                                        style={{
                                                            padding: "1px 1px",
                                                            whiteSpace: "nowrap",
                                                            background: "#fff",
                                                            borderRight: "1px solid black",
                                                        }}
                                                        className={classes.hoverRT}
                                                    >
                                                        {Circle}
                                                    </th>
                                                    <th>Done</th>
                                                    <th>{done["Site RFAI"]}</th>
                                                    <th>{done["Site Allocation"]}</th>
                                                    <th>{done["Survey Status"]}</th>
                                                    <th>{done["Material Punched"]}</th>
                                                    <th>{done["Material Delivered"]}</th>
                                                    <th>{done["Installation End"]}</th>
                                                    <th>{done["Integration Status"]}</th>
                                                </tr>

                                                {/* PENDING ROW */}
                                                <tr className={classes.hoverRT} style={{ textAlign: "center" }}>
                                                    <th>Pending</th>
                                                    <th>{pending["Site RFAI"]}</th>
                                                    <th>{pending["Site Allocation"]}</th>
                                                    <th>{pending["Survey Status"]}</th>
                                                    <th>{pending["Material Punched"]}</th>
                                                    <th>{pending["Material Delivered"]}</th>
                                                    <th>{pending["Installation End"]}</th>
                                                    <th>{pending["Integration Status"]}</th>
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