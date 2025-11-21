import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    OutlinedInput,
    MenuItem,
    Select,
    Checkbox,
    ListItemText,
    IconButton,
    Paper,
    TableContainer,
    Tooltip,
    Slide
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useLoadingDialog } from '../../../../Hooks/LoadingDialog';
import { useStyles } from '../../../ToolsCss';
import { postData } from '../../../../services/FetchNodeServices';


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


const Ms1 = () => {
    const { loading, action } = useLoadingDialog();
    const [site_taggingAgingData, setSite_taggingAgingData] = useState([]);
    const [site_taggingAgingOption, setSite_taggingAgingOption] = useState([]);
    const [currentStatus, setCurrentStatus] = useState([])
    const [currentStatusOption, setCurrentStatusOption] = useState([])
    const [ms1_done, setMs1_done] = useState([]);
    const [ms1_pending, setMs1_pending] = useState([]);
    const [downloadExcelData, setDownloadExcelData] = useState('');
    const classes = useStyles();

    const fetchDailyData = async () => {
        action(true)
        var formData = new FormData()

        formData.append('site_tagging', site_taggingAgingData)
        formData.append('current_status', currentStatus)

        const res = await postData("alok_tracker/ageing_dashboard_file/", formData);
        // const res =  tempData; //  remove this line when API is ready
        console.log('MS1 response', res)
        if (res) {
            action(false)
            setMs1_done(JSON.parse(res.json_data.ms1_done))
            setMs1_pending(JSON.parse(res.json_data.ms1_pending))
            if(currentStatusOption.length===0 && site_taggingAgingOption.length===0){
                setCurrentStatusOption(res.unique_data.unique_current_status)
            setSite_taggingAgingOption(res.unique_data.unique_site_tagging)
            }
             setDownloadExcelData(res.download_link)
        
            // setMainDataT2(JSON.parse(res.data))
        }
        else {
            action(false)
        }

    }




    useEffect(() => {
        fetchDailyData()
        // setTotals(calculateColumnTotals(tableData))
    }, [site_taggingAgingData,currentStatus])



    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>

                    {/* ************* 2G  TABLE DATA ************** */}
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            RFAI to MS1 Aging Completed & Incompleted
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

                    <Box sx={{ marginTop: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                        <TableContainer sx={{ maxHeight: 600, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan={2} style={{ padding: '1px 1px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0,zIndex:3, backgroundColor: '#006e74' }}>
                                            Circle</th>
                                        <th rowSpan={2} style={{ padding: '1px 1px', whiteSpace: 'nowrap', backgroundColor: '#006e74' }}>
                                            RFAI Done Count</th>
                                        <th colSpan={5} style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>RFAI to MS1 - Completed</th>
                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#CBCBCB", color: "balck", border: '1px solid white' }}>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>MS1 Done Count</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#60;=14 days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>15-30 days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#62;=31 days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>Average</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    {ms1_done?.map((it, index) => {
                                        if(it.Circle==='Total'){
                                              return (
                                            <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 ,backgroundColor: '#ffd3be' }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, color: 'black',zIndex:3,backgroundColor:'#ffd3be' }}>{it['Circle']}</th>
                                                <th style={{ position: 'sticky', color: 'black' }}>{it['RFAI Done Count']}</th>
                                                <th >{isNaN(parseInt(it[`MS1 Done Count`])) ? '-' : parseInt(it[`MS1 Done Count`])}</th>
                                                <th   >{isNaN(parseInt(it[`<= 14 days`])) ? '-' : parseInt(it[`<= 14 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`15-30 days`])) ? '-' : parseInt(it[`15-30 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`>= 31 days`])) ? '-' : parseInt(it[`>= 31 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`Average Days`])) ? '-' : parseInt(it[`Average Days`])}</th>
                                            </tr>
                                        )

                                        }else{
                                              return (
                                            <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#CBCBCB', color: 'black',zIndex:3 }}>{it['Circle']}</th>
                                                <th style={{ position: 'sticky', backgroundColor: '#CBCBCB', color: 'black' }}>{it['RFAI Done Count']}</th>
                                                <th >{isNaN(parseInt(it[`MS1 Done Count`])) ? '-' : parseInt(it[`MS1 Done Count`])}</th>
                                                <th   >{isNaN(parseInt(it[`<= 14 days`])) ? '-' : parseInt(it[`<= 14 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`15-30 days`])) ? '-' : parseInt(it[`15-30 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`>= 31 days`])) ? '-' : parseInt(it[`>= 31 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`Average Days`])) ? '-' : parseInt(it[`Average Days`])}</th>
                                            </tr>
                                        )
                                        }
                                      
                                    })}
                                </tbody>
                            </table>
                        </TableContainer>
                        <TableContainer sx={{ maxHeight: 600, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan={2} style={{ padding: '1px 1px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#006e74', zIndex: 3 }}>
                                            Circle</th>
                                        <th rowSpan={2} style={{ padding: '1px 1px', whiteSpace: 'nowrap',  backgroundColor: '#006e74' }}>
                                            RFAI Done Count</th>
                                        <th colSpan={5} style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>RFAI to MS1 - Incompleted</th>
                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#CBCBCB", color: "balck", border: '1px solid white' }}>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>MS1 Pending Count</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#60;=14 days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>15-30 days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#62;=31 days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> Average</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    {ms1_pending?.map((it, index) => {
                                        if(it.Circle === 'Total') {
                                             return (
                                            <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700, backgroundColor: '#ffd3be' }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, color: 'black',zIndex:3,backgroundColor:'#ffd3be' }}>{it['Circle']}</th>
                                                <th style={{ position: 'sticky', color: 'black' }}>{it['RFAI Done Count']}</th>
                                                <th >{isNaN(parseInt(it[`MS1 Pending Count`])) ? '-' : parseInt(it[`MS1 Pending Count`])}</th>
                                                <th   >{isNaN(parseInt(it[`<= 14 days`])) ? '-' : parseInt(it[`<= 14 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`15-30 days`])) ? '-' : parseInt(it[`15-30 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`>= 31 days`])) ? '-' : parseInt(it[`>= 31 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`Average Days`])) ? '-' : parseInt(it[`Average Days`])}</th>
                                            </tr>
                                        )
                                        }else{
                                             return (
                                            <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#CBCBCB', color: 'black',zIndex:3 }}>{it['Circle']}</th>
                                                <th style={{ position: 'sticky', backgroundColor: '#CBCBCB', color: 'black' }}>{it['RFAI Done Count']}</th>
                                                <th >{isNaN(parseInt(it[`MS1 Pending Count`])) ? '-' : parseInt(it[`MS1 Pending Count`])}</th>
                                                <th   >{isNaN(parseInt(it[`<= 14 days`])) ? '-' : parseInt(it[`<= 14 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`15-30 days`])) ? '-' : parseInt(it[`15-30 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`>= 31 days`])) ? '-' : parseInt(it[`>= 31 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`Average Days`])) ? '-' : parseInt(it[`Average Days`])}</th>
                                            </tr>
                                        )
                                        }
                                       
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

export default Ms1