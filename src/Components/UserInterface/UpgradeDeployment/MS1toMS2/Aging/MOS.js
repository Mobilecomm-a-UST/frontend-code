import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, TextField } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
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
import { set } from 'lodash';


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

const breakpointOption = Array.from({ length: 50 }, (_, i) => i + 1);
const MOS = () => {
    const debounceTimer = React.useRef(null);
    const { loading, action } = useLoadingDialog();
    const [site_taggingAgingData, setSite_taggingAgingData] = useState([]);
    const [site_taggingAgingOption, setSite_taggingAgingOption] = useState([]);
    const [currentStatus, setCurrentStatus] = useState([])
    const [currentStatusOption, setCurrentStatusOption] = useState([])
    const [tableData, setTableData] = useState([]);
    const [mos_done, setMos_done] = useState([]);
    const [mos_pending, setMos_pending] = useState([]);
    const [milestone1, setMilestone1] = useState('Site ONAIR');
    const [milestone2, setMilestone2] = useState('Final MS2');
    const [milestoneOptions, setMilestoneOptions] = useState([]);
    const [breakpoint1, setBreakpoint1] = useState(3);
    const [breakpoint2, setBreakpoint2] = useState(8);
    const [month, setMonth] = useState('')
    const [typeFileter, setTypeFilter] = useState('type1')
    const [issue, setIssue] = useState('not considered')
    const [showIssueFilter, setShowIssueFilter] = useState(false)
    const [frizzMilestone, setFrizzMilestone] = useState(false);

    const [downloadExcelData, setDownloadExcelData] = useState('');

    const classes = useStyles();


    // console.log('check type breakpoint', breakpoint1, breakpoint2)


    const fetchDailyData = async () => {
        action(true)
        var formData = new FormData()
        // formData.append('site_tagging', site_taggingAgingData)
        formData.append('current_status', currentStatus)
        formData.append('milestone1', milestone1)
        formData.append('milestone2', milestone2)
        formData.append('breakpoint1', breakpoint1)
        formData.append('breakpoint2', breakpoint2)
        formData.append('month', month.split('-')[1] || '')
        formData.append('year', month.split('-')[0] || '')
        { showIssueFilter && formData.append('issue', issue) }
        formData.append('type', typeFileter)

        const res = await postData("upgrade_tracker/ms2_ageing_dashboard_table2/", formData);
        // const res =  tempData; //  remove this line when API is ready
        console.log('MOS response', res)
        if (res) {
            action(false)
            setMos_done(JSON.parse(res.json_data.done_summary))
            setMos_pending(JSON.parse(res.json_data.pending_summary))
            setBreakpoint1(res.breakpoint1)
            setBreakpoint2(res.breakpoint2)
            if (currentStatusOption.length === 0 && site_taggingAgingOption.length === 0) {
                setCurrentStatusOption(res.unique_data.unique_current_status)
                // setSite_taggingAgingOption(res.unique_data.unique_site_tagging)
                setMilestoneOptions(res.unique_data.milestones)
            }
            setDownloadExcelData(res.download_link)

            // setMainDataT2(JSON.parse(res.data))
        }
        else {
            action(false)
        }

    }

    const handleMilestone1Change = (event) => {
        setMilestone1(event.target.value);
    }

    const handleMilestone2Change = (event) => {
        setMilestone2(event.target.value);
    }
    const handleMonthChange = (event) => {
        // console.log(event.target.value.split('-')[1])
        setMonth(event.target.value)
    }


    const handleBreakpointDiff = (field, value) => {
        const num = Number(value);

        // Clear previous debounce timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Start new debounce timer (300 ms)
        debounceTimer.current = setTimeout(() => {

            let newBp1 = breakpoint1;
            let newBp2 = breakpoint2;

            if (field === "bp1") newBp1 = num;
            if (field === "bp2") newBp2 = num;

            const diff = Math.abs(newBp1 - newBp2);

            if (diff < 3) {
                alert("⚠️ Breakpoint difference must be at least 3");
                return;
            }

            // UPDATE ONLY WHEN VALID
            if (field === "bp1") setBreakpoint1(num);
            if (field === "bp2") setBreakpoint2(num);


        }, 300); // 300ms debounce


    }


    useEffect(() => {
        if (milestone1 == 'RFAI' && milestone2 == 'Site ONAIR') {
            setShowIssueFilter(true)
        } else {
            setShowIssueFilter(false)
        }
        if (issue == 'considered') {
            setFrizzMilestone(true)
        } else {
            setFrizzMilestone(false)
        }
    }, [milestone1, milestone2, issue]);



    useEffect(() => {
        fetchDailyData()
        // setTotals(calculateColumnTotals(tableData))
    }, [site_taggingAgingData, currentStatus, milestone1, milestone2, breakpoint1, breakpoint2, month, typeFileter, issue]);



    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>

                    {/* ************* 2G  TABLE DATA ************** */}
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            {milestone1} to {milestone2} Aging
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>

                            {/* {showIssueFilter && <FormControl sx={{ minWidth: 120, maxWidth: 120 }} size="small">
                                <InputLabel id="demo-select-small-label">Issue</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={issue}
                                    label="Issue"
                                    onChange={(e) => { setIssue(e.target.value) }}
                                >
                                    <MenuItem value="considered">Considered</MenuItem>
                                    <MenuItem value="not considered">Not Considered</MenuItem>

                                </Select>
                            </FormControl>} */}
                            <FormControl sx={{ minWidth: 120, maxWidth: 120 }} size="small">
                                <InputLabel id="demo-select-small-label">Type</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={typeFileter}
                                    label="Type"
                                    onChange={(e) => { setTypeFilter(e.target.value) }}
                                >
                                    <MenuItem value="type1">Sequential Independent</MenuItem>
                                    <MenuItem value="type2">Combined Overlapping</MenuItem>

                                </Select>
                            </FormControl>

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
                                <InputLabel id="demo-simple-select-label">milestone1</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={milestone1}
                                    label="milestone1"
                                    onChange={handleMilestone1Change}
                                    disabled={frizzMilestone}
                                >
                                    {milestoneOptions?.map((item, index) => (
                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
                                <InputLabel id="demo-simple-select-label">milestone2</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={milestone2}
                                    label="milestone2"
                                    onChange={handleMilestone2Change}
                                    disabled={frizzMilestone}
                                >
                                    {milestoneOptions?.map((item, index) => (
                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {/* breakpoint 1 */}
                            <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
                                {/* <TextField label="Breakpoint 1" size="small" variant="outlined"  type="number" value={breakpoint1} onChange={(e) => setBreakpoint1(Number(e.target.value))} /> */}
                                {/* <TextField label="Breakpoint 1" size="small" variant="outlined" type="number" value={breakpoint1} onChange={(e) => handleBreakpointDiff("bp1", e.target.value)} /> */}
                                <InputLabel id="demo-simple-select-label">Breakpoint 1</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={breakpoint1}
                                    label="Breakpoint 1"
                                    onChange={(e) => handleBreakpointDiff("bp1", e.target.value)}
                                >
                                    {breakpointOption?.map((item, index) => (
                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {/* breakpoint 2 */}
                            <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
                                {/* <TextField label="Breakpoint 2" size="small" variant="outlined"  type="number" value={breakpoint2} onChange={(e) => setBreakpoint2(Number(e.target.value))} /> */}
                                {/* <TextField label="Breakpoint 2" size="small" variant="outlined" type="number" value={breakpoint2} onChange={(e) => handleBreakpointDiff("bp2", e.target.value)} /> */}
                                <InputLabel id="demo-simple-select-label">Breakpoint 2</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={breakpoint2}
                                    label="Breakpoint 2"
                                    onChange={(e) => handleBreakpointDiff("bp2", e.target.value)}

                                >
                                    {breakpointOption?.map((item, index) => (
                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {/* <MultiSelectWithAll
                                label="Site Tagging"
                                options={site_taggingAgingOption}
                                selectedValues={site_taggingAgingData}
                                setSelectedValues={setSite_taggingAgingData}
                            /> */}


                            <MultiSelectWithAll
                                label="Current Status"
                                options={currentStatusOption}
                                selectedValues={currentStatus}
                                setSelectedValues={setCurrentStatus}
                            />
                            <Tooltip title="Download Ageing Data">
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

                    <Box sx={{ marginTop: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                        <TableContainer sx={{ maxHeight: 600, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan={2} style={{ padding: '1px 1px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, zIndex: 3, backgroundColor: '#006e74' }}>
                                            Circle</th>
                                        <th rowSpan={2} style={{ padding: '1px 1px', whiteSpace: 'nowrap', backgroundColor: '#006e74' }}>
                                            {milestone1} Done Count</th>
                                        <th colSpan={5} style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>{milestone1} to {milestone2} - Completed</th>
                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#CBCBCB", color: "balck", border: '1px solid white' }}>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>{milestone2} Done Count</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#60;={breakpoint1} days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>{breakpoint1 + 1}-{breakpoint2 - 1} days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#62;={breakpoint2} days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>Average</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    {mos_done?.map((it, index) => {
                                        if (it.Circle === 'Total') {
                                            return (
                                                <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 'bolder', backgroundColor: '#ffd3be' }} key={index}>
                                                    <th style={{ position: 'sticky', left: 0, top: 0, color: 'black', zIndex: 3, backgroundColor: '#ffd3be' }}>{it['Circle']}</th>
                                                    <th style={{ position: 'sticky', color: 'black' }}>{it[`${milestone1} Done Count`]}</th>
                                                    <th >{isNaN(parseInt(it[`${milestone2} Done Count`])) ? '-' : parseInt(it[`${milestone2} Done Count`])}</th>
                                                    <th   >{isNaN(parseInt(it[`<= ${breakpoint1} days`])) ? '-' : parseInt(it[`<= ${breakpoint1} days`])}</th>
                                                    <th   >{isNaN(parseInt(it[`${breakpoint1 + 1}-${breakpoint2 - 1} days`])) ? '-' : parseInt(it[`${breakpoint1 + 1}-${breakpoint2 - 1} days`])}</th>
                                                    <th   >{isNaN(parseInt(it[`>= ${breakpoint2} days`])) ? '-' : parseInt(it[`>= ${breakpoint2} days`])}</th>
                                                    <th   >{isNaN(parseInt(it[`Average Days`])) ? '-' : parseInt(it[`Average Days`])}</th>
                                                </tr>
                                            )
                                        } else {
                                            return (
                                                <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                    <th style={{ position: 'sticky', left: 0, top: 0, zIndex: 3, backgroundColor: '#CBCBCB', color: 'black' }}>{it['Circle']}</th>
                                                    <th style={{ position: 'sticky', color: 'black' }}>{it[`${milestone1} Done Count`]}</th>
                                                    <th >{isNaN(parseInt(it[`${milestone2} Done Count`])) ? '-' : parseInt(it[`${milestone2} Done Count`])}</th>
                                                    <th   >{isNaN(parseInt(it[`<= ${breakpoint1} days`])) ? '-' : parseInt(it[`<= ${breakpoint1} days`])}</th>
                                                    <th   >{isNaN(parseInt(it[`${breakpoint1 + 1}-${breakpoint2 - 1} days`])) ? '-' : parseInt(it[`${breakpoint1 + 1}-${breakpoint2 - 1} days`])}</th>
                                                    <th   >{isNaN(parseInt(it[`>= ${breakpoint2} days`])) ? '-' : parseInt(it[`>= ${breakpoint2} days`])}</th>
                                                    <th   >{isNaN(parseInt(it[`Average Days`])) ? '-' : parseInt(it[`Average Days`])}</th>
                                                </tr>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table>
                        </TableContainer>
                        {typeFileter == 'type2' ? <TableContainer sx={{ maxHeight: 600, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan={2} style={{ padding: '1px 1px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, zIndex: 3, backgroundColor: '#006e74' }}>
                                            Circle</th>
                                        <th rowSpan={2} style={{ padding: '1px 1px', whiteSpace: 'nowrap', backgroundColor: '#006e74' }}>
                                            {milestone1} Done Count</th>
                                        <th colSpan={5} style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>{milestone1} to {milestone2} - Incompleted</th>
                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#CBCBCB", color: "balck", border: '1px solid white' }}>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>{milestone2} Pending Count</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#60;={breakpoint1} days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>{breakpoint1 + 1}-{breakpoint2 - 1} days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#62;={breakpoint2} days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>Average</th>

                                    </tr>

                                </thead>

                                <tbody>
                                    {mos_pending?.map((it, index) => {
                                        if (it.Circle === 'Total') {
                                            return (
                                                <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700, backgroundColor: '#ffd3be' }} key={index}>
                                                    <th style={{ position: 'sticky', left: 0, top: 0, zIndex: 3, color: 'black', backgroundColor: '#ffd3be' }}>{it['Circle']}</th>
                                                    <th style={{ position: 'sticky', color: 'black' }}>{it[`${milestone1} Done Count`]}</th>
                                                    <th >{isNaN(parseInt(it[`${milestone2} Pending Count`])) ? '-' : parseInt(it[`${milestone2} Pending Count`])}</th>
                                                    <th   >{isNaN(parseInt(it[`<= ${breakpoint1} days`])) ? '-' : parseInt(it[`<= ${breakpoint1} days`])}</th>
                                                    <th   >{isNaN(parseInt(it[`${breakpoint1 + 1}-${breakpoint2 - 1} days`])) ? '-' : parseInt(it[`${breakpoint1 + 1}-${breakpoint2 - 1} days`])}</th>
                                                    <th   >{isNaN(parseInt(it[`>= ${breakpoint2} days`])) ? '-' : parseInt(it[`>= ${breakpoint2} days`])}</th>
                                                    <th   >{isNaN(parseInt(it[`Average Days`])) ? '-' : parseInt(it[`Average Days`])}</th>
                                                </tr>
                                            )
                                        } else {
                                            return (
                                                <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                    <th style={{ position: 'sticky', left: 0, top: 0, zIndex: 3, backgroundColor: '#CBCBCB', color: 'black' }}>{it['Circle']}</th>
                                                    <th style={{ position: 'sticky', color: 'black' }}>{it[`${milestone1} Done Count`]}</th>
                                                    <th >{isNaN(parseInt(it[`${milestone2} Pending Count`])) ? '-' : parseInt(it[`${milestone2} Pending Count`])}</th>
                                                    <th   >{isNaN(parseInt(it[`<= ${breakpoint1} days`])) ? '-' : parseInt(it[`<= ${breakpoint1} days`])}</th>
                                                    <th   >{isNaN(parseInt(it[`${breakpoint1 + 1}-${breakpoint2 - 1} days`])) ? '-' : parseInt(it[`${breakpoint1 + 1}-${breakpoint2 - 1} days`])}</th>
                                                    <th   >{isNaN(parseInt(it[`>= ${breakpoint2} days`])) ? '-' : parseInt(it[`>= ${breakpoint2} days`])}</th>
                                                    <th   >{isNaN(parseInt(it[`Average Days`])) ? '-' : parseInt(it[`Average Days`])}</th>
                                                </tr>
                                            )
                                        }
                                    }
                                    )}
                                </tbody>
                            </table>
                        </TableContainer> : <></>}

                    </Box>
                </div>
            </Slide>
            {/* {gapData && filterDialog()} */}
            {loading}
        </>
    )
}

export default MOS