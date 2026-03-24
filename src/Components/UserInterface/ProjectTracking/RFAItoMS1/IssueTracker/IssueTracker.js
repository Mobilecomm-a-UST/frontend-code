import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
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
import { useNavigate } from "react-router-dom";



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

    const isAllSelected = options?.length > 0 && selectedValues?.length === options?.length;

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

const IssueTracker = () => {
    const navigate = useNavigate()
    const classes = useStyles()
    const { loading, action } = useLoadingDialog();
    const [milestonOption, setMilestonOption] = useState(["Allocation", "MO Punch", "RFAI Survey"])
    const [milestoneSelect, setMilestoneSelect] = useState([])
    const [ownerOption, setOwnerOption] = useState(["Airtel", "ToCo", "UST"])
    const [ownerSelect, setOwnerSelect] = useState([])
    const [issueDatas, setIssueDatas] = useState([])
    const [status, setStatus] = useState('ALL')
    const [d_start, setD_start] = useState('')
    const [d_end, setD_end] = useState('')
    const IssueData = [
        {
            "Issue": "Delay in Allocation",
            "AP": 33,
            "ASM": 16,
            "BIH": 4,
            "DEL": 60,
            "HRY": 4,
            "JK": 3,
            "JRK": 2,
            "KK": 3,
            "KOL": 2,
            "MAH": 5,
            "NE": 6,
            "ORI": 6,
            "PUN": 10,
            "RAJ": 5,
            "ROTN": 5,
            "UPE": 12,
            "UPW": 2,
            "WB": 21,
            "Total": 199
        },
        {
            "Issue": "Total",
            "AP": 33,
            "ASM": 16,
            "BIH": 4,
            "DEL": 60,
            "HRY": 4,
            "JK": 3,
            "JRK": 2,
            "KK": 3,
            "KOL": 2,
            "MAH": 5,
            "NE": 6,
            "ORI": 6,
            "PUN": 10,
            "RAJ": 5,
            "ROTN": 5,
            "UPE": 12,
            "UPW": 2,
            "WB": 21,
            "Total": 199
        }
    ]

    const dynamicHeaders =
        issueDatas.length > 0
            ? Object.keys(IssueData[0]).filter(
                (key) => key !== "Issue" && key !== "Total"
            )
            : [];




    const fetchDailyData = async () => {
        action(true)
        var formData = new FormData()
        formData.append('status', status)
        formData.append('milestone', milestoneSelect)
        formData.append('owner', ownerSelect)
        formData.append('duration_start', d_start)
        formData.append('duration_end', d_end)
        const res = await postData("alok_tracker/issue_summary/", formData);
        // const res =  tempData; //  remove this line when API is ready
        // console.log(' rfai data', transformData(JSON.parse(res.json_data.table_summary)))
        if (res) {
            action(false)
            console.log('issue tracker data ', res)
            setIssueDatas(res.data)
            // setIntegrationToOnairData(transformData(JSON.parse(res.json_data.table_summary)))
            // if (currentStatusOption.length === 0 && site_taggingAgingOption.length === 0) {
            //     setCurrentStatusOption(res.unique_data.unique_current_status)
            //     setSite_taggingAgingOption(res.unique_data.unique_site_tagging)
            // }
        }
        else {
            action(false)
        }
    }
    const handleStartDuration = (e) => {
        e.preventDefault()

        fetchDailyData()
    }
    const handleEndDuration = (e) => {
        e.preventDefault()

        fetchDailyData()
    }

    useEffect(() => {
        fetchDailyData()
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [status,milestoneSelect,ownerSelect])
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/relocation_tracking') }}>Relocation Tracking</Link>
                    <Typography color='text.primary'>RFAI to MS1 Issue Tracker</Typography>
                </Breadcrumbs>
            </div>

            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>

                    {/* ************* 2G  TABLE DATA ************** */}
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', margin: '5px 5px' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            Issue Tracking Dashboard
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                            {/* <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
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
                            </FormControl> */}
                            {/* <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
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
                            </FormControl> */}
                            <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
                                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={status}
                                    label="Status"
                                    onChange={(e) => setStatus(e.target.value)}
                                >

                                    <MenuItem value='ALL'>ALL</MenuItem>
                                    <MenuItem value='Open'>OPEN</MenuItem>
                                    <MenuItem value='Close'>CLOSE</MenuItem>

                                </Select>
                            </FormControl>
                            <MultiSelectWithAll
                                label="Milestone"
                                options={milestonOption}
                                selectedValues={milestoneSelect}
                                setSelectedValues={setMilestoneSelect}
                            />


                            <MultiSelectWithAll
                                label="Owner"
                                options={ownerOption}
                                selectedValues={ownerSelect}
                                setSelectedValues={setOwnerSelect}
                            />
                            <form onSubmit={handleStartDuration}>
                                <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
                                    <TextField
                                        variant="outlined"
                                        // required
                                        fullWidth
                                        label="Duration Start"
                                        value={d_start}
                                        onChange={(e) => setD_start(e.target.value)}
                                        size="small"
                                        type="number"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </FormControl>
                            </form>

                            <form onSubmit={handleEndDuration}>
                                <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
                                    <TextField
                                        variant="outlined"
                                        // required
                                        fullWidth
                                        label="Duration End"
                                        value={d_end}
                                        onChange={(e) => setD_end(e.target.value)}
                                        size="small"
                                        type="number"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </FormControl>
                            </form>

                            {/* <Tooltip title="Download Done Vs Pending Count">
                                <IconButton
                                    component="a"
                                    // href={downloadExcelData}
                                    onClick={(handleExportExcel)}
                                    download
                                >
                                    <DownloadIcon fontSize="large" color="primary" />
                                </IconButton>
                            </Tooltip> */}
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <TableContainer
                            component={Paper}
                            sx={{
                                maxHeight: 600,
                                boxShadow: "rgba(0,0,0,0.2) 0px 3px 8px"
                            }}
                        >
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse"
                                }}
                            >
                                {/* 🔥 HEADER */}
                                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>

                                    {/* Top Header */}
                                    <tr style={{ backgroundColor: "#223354", color: "white" }}>
                                        <th
                                            rowSpan={2}
                                            style={{
                                                position: "sticky",
                                                left: 0,
                                                zIndex: 2,
                                                backgroundColor: "#006e74",
                                                fontSize: 18
                                            }}
                                        >
                                            Issues
                                        </th>
                                        <th colSpan={dynamicHeaders.length + 1} style={{ fontSize: 18 }}>
                                            Circles
                                        </th>
                                    </tr>

                                    {/* Sub Header */}
                                    <tr style={{ backgroundColor: "#CBCBCB" }}>
                                        {dynamicHeaders.map((col) => (
                                            <th key={col}>{col}</th>
                                        ))}
                                        <th>Total</th>
                                    </tr>
                                </thead>

                                {/* 🔥 BODY */}
                                <tbody>
                                    {issueDatas.map((row, index) => (
                                        <tr key={index} className={classes.hoverRT} style={{ textAlign: "center" }}>

                                            {/* Issue */}
                                            <th
                                                style={{
                                                    position: "sticky",
                                                    left: 0,
                                                    backgroundColor: "#CBCBCB",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {row.Issue}
                                            </th>

                                            {/* Dynamic Columns */}
                                            {dynamicHeaders.map((col) => (
                                                <th key={col}>{row[col] ?? 0}</th>
                                            ))}

                                            {/* Total */}
                                            <th>{row.Total}</th>
                                        </tr>
                                    ))}
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

export default IssueTracker