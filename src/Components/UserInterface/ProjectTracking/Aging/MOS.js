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

const MOS = () => {
    const { loading, action } = useLoadingDialog();
    const [site_taggingAgingData, setSite_taggingAgingData] = useState('');
    const [tableData, setTableData] = useState([]);
    const [mos_done, setMos_done] = useState([]);
    const [mos_pending, setMos_pending] = useState([]);
    const [downloadExcelData, setDownloadExcelData] = useState('');

    const classes = useStyles();
    
    
    const fetchDailyData = async () => {
            action(true)
            var formData = new FormData()
     
            formData.append('site_tagging', site_taggingAgingData)

            const res = await postData("alok_tracker/ageing_dashboard_file/", formData);
            // const res =  tempData; //  remove this line when API is ready
            console.log('MOS response', res)
            if (res) {
                action(false)
                setMos_done(JSON.parse(res.json_data.mos_done))
                setMos_pending(JSON.parse(res.json_data.mos_pending))
                setDownloadExcelData(res.download_link)

                // setMainDataT2(JSON.parse(res.data))
            }
            else {
                action(false)
            }
    
        }
    
    const handleSiteTagging=(event)=>{
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
                            RFAI to MOS Aging Completed & Incompleted
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

                    <Box sx={{ marginTop: 0 ,display:'flex',justifyContent:'center',alignItems:'center',gap:2}}>
                        <TableContainer sx={{ maxHeight: 600, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan={2} style={{ padding: '1px 1px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#006e74' }}>
                                            Circle</th>
                                        <th rowSpan={2} style={{ padding: '1px 1px', whiteSpace: 'nowrap', top: 0, backgroundColor: '#006e74' }}>
                                            RFAI Done Count</th>
                                        <th colSpan={4} style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>RFAI to MOS - Completed</th>
                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#CBCBCB", color: "balck", border: '1px solid white' }}>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>MOS Done Count</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#60;=3 days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>4-10 days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#62;=11 days</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    {mos_done?.map((it, index) => {
                                        return (
                                            <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#CBCBCB', color: 'black' }}>{it['Circle']}</th>
                                                <th style={{ position: 'sticky', backgroundColor: '#CBCBCB', color: 'black' }}>{it['RFAI Done Count']}</th>
                                                <th >{isNaN(parseInt(it[`MOS Done Count`])) ? '-' : parseInt(it[`MOS Done Count`])}</th>
                                                <th   >{isNaN(parseInt(it[`<= 3 days`])) ? '-' : parseInt(it[`<= 3 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`4-10 days`])) ? '-' : parseInt(it[`4-10 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`>= 11 days`])) ? '-' : parseInt(it[`>= 11 days`])}</th>
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
                                        <th colSpan={4} style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>RFAI to MOS - Incompleted</th>
                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#CBCBCB", color: "balck", border: '1px solid white' }}>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>MOS Pending Count</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#60;=3 days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>4-10 days</th>
                                        <th style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}> &#62;=11 days</th>
                                    </tr>

                                </thead>
                              <tbody>
                                    {mos_pending?.map((it, index) => {
                                        return (
                                            <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#CBCBCB', color: 'black' }}>{it['Circle']}</th>
                                                <th style={{ position: 'sticky', backgroundColor: '#CBCBCB', color: 'black' }}>{it['RFAI Done Count']}</th>
                                                <th >{isNaN(parseInt(it[`MOS Pending Count`])) ? '-' : parseInt(it[`MOS Pending Count`])}</th>
                                                <th   >{isNaN(parseInt(it[`<= 3 days`])) ? '-' : parseInt(it[`<= 3 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`4-10 days`])) ? '-' : parseInt(it[`4-10 days`])}</th>
                                                <th   >{isNaN(parseInt(it[`>= 11 days`])) ? '-' : parseInt(it[`>= 11 days`])}</th>
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

export default MOS