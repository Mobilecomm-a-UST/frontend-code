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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { postData } from '../../../services/FetchNodeServices';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

const Integration = () => {
    const { loading, action } = useLoadingDialog();
    const [site_taggingAgingData, setSite_taggingAgingData] = useState('');
    const [integrationDone, setIntegrationDone] = useState([]);
    const [integrationPending, setIntegrationPending] = useState([]);
    const classes = useStyles();

    const fetchDailyData = async () => {
        action(true)
        var formData = new FormData()

        formData.append('site_tagging', site_taggingAgingData)

        const res = await postData("alok_tracker/ageing_dashboard_file/", formData);
        // const res =  tempData; //  remove this line when API is ready
        console.log('Integartion response', res)
        if (res) {
            action(false)
            setIntegrationDone(JSON.parse(res.json_data.integration_done))
            setIntegrationPending(JSON.parse(res.json_data.integration_pending))

            // setMainDataT2(JSON.parse(res.data))
        }
        else {
            action(false)
        }

    }

    const handleSiteTagging = (event) => {
        setSite_taggingAgingData(event.target.value);
    }


    useEffect(() => {
        fetchDailyData()
        // setTotals(calculateColumnTotals(tableData))
    }, [site_taggingAgingData])


    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>

                    {/* ************* 2G  TABLE DATA ************** */}
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            RFAI to Integration Aging Completed & Incompleted
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <FormControl sx={{ minWidth: 150 }} size="small">
                                <InputLabel id="demo-select-small-label">Site Tagging</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={site_taggingAgingData}
                                    label="Site Tagging"
                                    onChange={handleSiteTagging}
                                >
                                    <MenuItem value="ALL">ALL</MenuItem>
                                    <MenuItem value="Operational">Operational</MenuItem>
                                    <MenuItem value="Opex">Opex</MenuItem>
                                    <MenuItem value="Project Console">Project Console</MenuItem>

                                </Select>
                            </FormControl>
                            <Tooltip title="Download Daily-RFAI to MS1 Waterfall">
                                <IconButton
                                    component="a"
                                    // href={downloadExcelData}
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
                                        <th rowSpan={2} style={{ padding: '1px 1px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#006e74' }}>
                                            Circle</th>
                                        <th rowSpan={2} style={{ padding: '1px 1px', whiteSpace: 'nowrap', top: 0, backgroundColor: '#006e74' }}>
                                            RFAI Done Count</th>
                                        <th colSpan={4} style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>RFAI to Integration - Completed</th>
                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#CBCBCB", color: "balck", border: '1px solid white' }}>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>Integration Done Count</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#60;=7 days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>8-15 days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#62;=16 days</th>
                                    </tr>

                                </thead>
                                 <tbody>
                                    {integrationDone?.map((it, index) => {
                                        return (
                                            <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#CBCBCB', color: 'black' }}>{it['Circle']}</th>
                                                <th style={{ position: 'sticky', backgroundColor: '#CBCBCB', color: 'black' }}>{it['RFAI Done Count']}</th>
                                                <th >{isNaN(parseInt(it[`Integration Done Count`])) ? '-' : parseInt(it[`Integration Done Count`])}</th>
                                                <th   >{isNaN(parseInt(it[`<= 7 days`])) ? '-' : parseInt(it[`<= 7 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`8-15 days`])) ? '-' : parseInt(it[`8-15 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`>= 16 days`])) ? '-' : parseInt(it[`>= 16 days`])}</th>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </TableContainer>
                        <TableContainer sx={{ maxHeight: 600, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan={2} style={{ padding: '1px 1px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#006e74' }}>
                                            Circle</th>
                                        <th rowSpan={2} style={{ padding: '1px 1px', whiteSpace: 'nowrap', top: 0, backgroundColor: '#006e74' }}>
                                            RFAI Done Count</th>
                                        <th colSpan={4} style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>RFAI to Integration - Incompleted</th>
                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#CBCBCB", color: "balck", border: '1px solid white' }}>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>Integration Pending Count</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#60;=7 days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>8-15 days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#62;=16 days</th>
                                    </tr>

                                </thead>
                              <tbody>
                                    {integrationPending?.map((it, index) => {
                                        return (
                                            <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#CBCBCB', color: 'black' }}>{it['Circle']}</th>
                                                <th style={{ position: 'sticky', backgroundColor: '#CBCBCB', color: 'black' }}>{it['RFAI Done Count']}</th>
                                                <th >{isNaN(parseInt(it[`Integration Pending Count`])) ? '-' : parseInt(it[`Integration Pending Count`])}</th>
                                                <th   >{isNaN(parseInt(it[`<= 7 days`])) ? '-' : parseInt(it[`<= 7 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`8-15 days`])) ? '-' : parseInt(it[`8-15 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`>= 16 days`])) ? '-' : parseInt(it[`>= 16 days`])}</th>
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

export default Integration