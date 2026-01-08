import React, { useEffect, useState } from 'react'
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, TextField
} from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useStyles } from '../../ToolsCss';
import { usePost } from '../../../Hooks/PostApis';
import DeleteIcon from '@mui/icons-material/Delete';
import { ServerURL, getData } from '../../../services/FetchNodeServices';
import { getDecreyptedData } from '../../../utils/localstorage';
import Swal from "sweetalert2";
import 'rsuite/dist/rsuite.min.css';
import axios from 'axios';
import { constant } from 'lodash';
 
 
 
 
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
const CircleList = ['AP', 'AS', 'BIH', 'CHN', 'DL', 'HRY', 'JK', 'JRK', 'KK', 'KOL', 'MH', 'MP', 'MB', 'NE', 'ORI', 'PUN', 'RAJ', 'ROTN', 'UE', 'UPW', 'WB']
 
const MicrowaveAviatTable = () => {
    const navigate = useNavigate();
    const classes = useStyles()
    const { makePostRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const [tableData, setTableData] = useState([])
    const [formTable, setFormTabel] = useState({
        site_id: '',
        circle: '',
        equipment_make: ''
    })
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormTabel((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
 
 
    const fetchMicrowaveDashboard = async () => {
 
        action(true);
        const formData = new FormData();
        formData.append("site_id", formTable.site_id);
        formData.append("circle", formTable.circle);
        formData.append("equipment_make", formTable.equipment_make);
 
        const response = await makePostRequest("mw_app/get_table/", formData);
 
        action(false);
        if (response.status) {
            setTableData(response.data)
 
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response.message });
        }
    }
 
    const handleDeleteTable = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action will permanently delete the data!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });
 
        if (result.isConfirmed) {
            try {
                const res = await axios.delete(
                    `${ServerURL}/mw_app/get_delete/`,
                    {
                        headers: {
                            Authorization: `token ${getDecreyptedData("tokenKey")}`
                        }
                    }
                );
 
                if (res?.data?.status === true) {
                    Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: res?.data?.message || "Data deleted successfully."
                    });
                } else {
                    // ✅ API se aane wala authorization error
                    Swal.fire({
                        icon: "error",
                        title: "Unauthorized",
                        text: res?.data?.error || res?.data?.message || "Delete operation failed."
                    });
                }
 
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error?.response?.data?.error || "Something went wrong while deleting."
                });
            }
        }
    };
 
 
    const handleDownloadFile = async () => {
        const res = await getData('mw_app/get_delete/');
 
        if (res?.file_url) {
            const downloadExcelFilelink = res.file_url;
 
            // 🔽 Auto download
            const link = document.createElement('a');
            link.href = downloadExcelFilelink;
            link.setAttribute('download', '');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
 
 
    const handleSubmitSite = (e) => {
        e.preventDefault()
        fetchMicrowaveDashboard()
    }
 
 
    useEffect(() => {
        fetchMicrowaveDashboard()
        const title = window.location.pathname
            .slice(1)
            .replaceAll("_", " ")
            .replaceAll("/", " | ")
            .toUpperCase();
        document.title = title;
    }, []);
 
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/microwave_soft_at")}>Microwave Soft_At</Link>
                    <Typography color="text.primary">Microwave(AVIAT) Dashboard</Typography>
                </Breadcrumbs>
            </Box>
 
 
 
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>
 
                    {/* ************* 2G  TABLE DATA ************** */}
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            Microwave (AVIAT) Dashboard
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
 
                            <form onSubmit={handleSubmitSite} style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
 
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel id="issue-label">Circle</InputLabel>
                                    <Select
                                        labelId="issue-label"
                                        value={formTable.circle}
                                        onChange={handleChange}
                                        label="Circle"
                                        name='circle'
                                    >
                                        {CircleList.map((item, index) => (
                                            <MenuItem key={index} value={item}>{item}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField size='small' placeholder='Site ID' label="Site ID" name='site_id' value={formTable.site_id} onChange={handleChange} />
                                <TextField size='small' placeholder='Equipment Make' label="Equipment Make" name='equipment_make' value={formTable.equipment_make} onChange={handleChange} />
                                <Button type='submit' sx={{ backgroundColor: '#223354' }} variant='contained'>Filter</Button>
                            </form>
 
                            {/* <FormControl sx={{ minWidth: 100, maxWidth: 100 }} size="small">
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
                                    </FormControl> */}
 
 
 
 
                            <Tooltip title="Download Microwave(AVIAT) Dashboard">
                                <IconButton
                                    component="a"
                                    // href={downloadExcelData}
                                    onClick={(handleDownloadFile)}
                                    download
                                >
                                    <DownloadIcon fontSize="large" color="primary" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Microwave(AVIAT) Table">
                                <IconButton
                                    component="a"
                                    // href={downloadExcelData}
                                    onClick={(handleDeleteTable)}
                                // download
                                >
                                    <DeleteIcon fontSize="large" color="error" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
 
                    <Box sx={{ marginTop: 0 }}>
                        <TableContainer sx={{ maxHeight: 600, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1, height: '60px' }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
 
                                        <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#223354' }}> Circle </th>
 
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff', width: '300px', minWidth: '300px', maxWidth: '300px', textAlign: 'center' }}>Reference-Key
                                        </th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff', width: '250px', minWidth: '250px', maxWidth: '250px', textAlign: 'center' }}>SiteID
                                        </th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Equipment Make</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff', width: '200px', minWidth: '200px', maxWidth: '200px', textAlign: 'center' }}>Plan ID</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Polarization</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Site ID - A</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Tx Frequency (MHz)</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>BER 10e-6 Rx Level (dBm)</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Site ID - B</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Rx Frequency (MHz)</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Bandwidth (MHz)</th>
 
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>ACM Status</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>ACM Min QAM</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>ACM Max QAM</th>
 
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>ATPC Status</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>ATPC Min</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>ATPC Max</th>
 
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>RSL Min (dBm)</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>RSL Max (dBm)</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Tx Power Max (dBm)</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>SNR Min (dB)</th>
 
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>XPD Min (dBm)</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>XPD Max (dBm)</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Polarization (Radio)</th>
 
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Site A Current RSL</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Site Z Current RSL</th>
 
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>FREQ TX</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>FREQ RX</th>
 
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Site A Modulation Mode</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Site Z Modulation Mode</th>
 
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Site A Min Modulation (24h)</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Site Z Min Modulation (24h)</th>
 
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Site A Max Modulation (24h)</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Site Z Max Modulation (24h)</th>
 
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Site A Min Configured Modulation</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Site Z Min Configured Modulation</th>
 
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Site A Max Configured Modulation</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>Site Z Max Configured Modulation</th>
 
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff' }}>ATPC Status (Link)</th>
                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#223354', color: '#fff', width: '450px', minWidth: '450px', maxWidth: '450px', textAlign: 'center' }}>Remark</th>
 
                                    </tr>
                                </thead >
 
                                <tbody>
                                    {tableData?.map((it, index) => {
 
 
                                        const toFloat = (val) => (val !== null && val !== undefined && !isNaN(val) ? parseFloat(val) : null);
 
 
                                        const condPolarization = it.polarization === it.polarization_radio;
                                        const condTxFreq = it.tx_frequency_mhz === it.freq_tx || it.tx_frequency_mhz === it.freq_rx;
                                        const condRxFreq = it.rx_frequency_mhz === it.freq_rx || it.tx_frequency_mhz === it.freq_rx;
                                        const condTxPower = parseInt(it.atpc_max) === parseInt(it.tx_power_max_dbm);
 
                                        const condAtpcLink = it.atpc_status_link === true || it.atpc_status_link === "true" || it.atpc_status_link === "True" || it.atpc_status_link === 1;
                                        const atpcDisplay = it.atpc_status_link === null || it.atpc_status_link === undefined || Number.isNaN(it.atpc_status_link) ? "NaN" : condAtpcLink ? "True" : "NaN";
 
 
                                        const condSnr = toFloat(it.snr_min_db) > 40;
 
                                        const ber = toFloat(it.ber10e6_rx_level_dbm);
                                        const rslMin = toFloat(it.rsl_min_dbm);
                                        const rslMax = toFloat(it.rsl_max_dbm);
                                        const rslA = toFloat(it.site_a_current_rsl);
                                        const rslZ = toFloat(it.site_z_current_rsl);
                                        const condRsl =
                                            ber !== null &&
                                            rslMin !== null &&
                                            rslMax !== null &&
                                            rslA !== null &&
                                            rslZ !== null &&
                                            ber >= rslMin - 3 &&
                                            ber <= rslMax + 3 &&
                                            ber >= rslA - 3 &&
                                            ber <= rslA + 3 &&
                                            ber >= rslZ - 3 &&
                                            ber <= rslZ + 3;
 
 
                                        const condXpdMin = toFloat(it.xpd_min_dbm);
                                        const condXpdMax = toFloat(it.xpd_max_dbm);
                                        const xpdMinColor =
                                            condXpdMin > 22 && condXpdMin < 35
                                                ? "#00B050"
                                                : (20 <= condXpdMin && condXpdMin <= 22) || (35 <= condXpdMin && condXpdMin <= 38)
                                                    ? "#FF0000"
                                                    : "#C00000";
                                        const xpdMaxColor =
                                            condXpdMax > 22 && condXpdMax < 35
                                                ? "#00B050"
                                                : (20 <= condXpdMax && condXpdMax <= 22) || (35 <= condXpdMax && condXpdMax <= 38)
                                                    ? "#FF0000"
                                                    : "#C00000";
 
 
                                        const acmStatus = it.acm_status?.toLowerCase();
                                        const condSiteAMod = (acmStatus === "enable" && it.site_a_modulation_mode?.toLowerCase() === "adaptive") ||
                                            (acmStatus === "disable" && it.site_a_modulation_mode?.toLowerCase() === "fixed");
                                        const condSiteZMod = (acmStatus === "enable" && it.site_z_modulation_mode?.toLowerCase() === "adaptive") ||
                                            (acmStatus === "disable" && it.site_z_modulation_mode?.toLowerCase() === "fixed");
 
 
                                        const acmMin = it.acm_min_qam?.toString().toLowerCase();
                                        const acmMax = it.acm_max_qam?.toString().toLowerCase();
 
                                        const checkQAM = (val) => val?.toString().toLowerCase() === acmMax;
                                        const checkQAMMin = (val) => val?.toString().toLowerCase() === acmMin;
 
 
                                        const normalizeQAM = (val) => {
                                            if (!val) return "";
                                            return val.toString().toLowerCase().replace(/[^0-9]/g, ''); // keep only numbers
                                        };
 
                                        const acmMaxNormalized = normalizeQAM(it.acm_max_qam);
 
 
                                        const checkQM = (val) => normalizeQAM(val) === acmMaxNormalized;
                                        const displayValue = (val) => {
                                            if (
                                                val === null ||
                                                val === undefined ||
                                                val === "" ||
                                                val === "NaN" ||
                                                val === "<NA>" ||
                                                val === "nan" ||
                                                val === "NA" ||
                   
                                                Number.isNaN(val)
                                            ) {
                                                return "";
                                            }
                                            return val;
                                        };
 
 
 
                                        return (
                                            <tr key={index}>
                                                <th style={{ backgroundColor: '#CBCBCB', color: 'black', position: 'sticky', left: 0 }}>{it.circle}</th>
                                                <th style={{ backgroundColor: '#fff', color: 'black' }}>{displayValue(it.reference_key)}</th>
                                                <th style={{ backgroundColor: '#fff', color: 'black' }}>{displayValue(it.site_id)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.equipment_make)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.plan_id)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.polarization)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.site_id_a)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.tx_frequency_mhz)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.ber10e6_rx_level_dbm)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.site_id_b)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.rx_frequency_mhz)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.bandwidth_mhz)}</th>
 
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.acm_status)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.acm_min_qam)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.acm_max_qam)}</th>
 
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.atpc_status)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.atpc_min)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{displayValue(it.atpc_max)}</th>
 
                                                <th style={{ backgroundColor: '#FFF', color: condRsl ? "#00B050" : "#FF0000" }}>{displayValue(it.rsl_min_dbm)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: condRsl ? "#00B050" : "#FF0000" }}>{displayValue(it.rsl_max_dbm)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: condTxPower ? "#00B050" : "#FF0000" }}>{displayValue(it.tx_power_max_dbm)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: condSnr ? "#00B050" : "#FF0000" }}>{displayValue(it.snr_min_db)}</th>
 
                                                <th style={{ backgroundColor: '#FFF', color: xpdMinColor }}>{displayValue(it.xpd_min_dbm)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: xpdMaxColor }}>{displayValue(it.xpd_max_dbm)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: condPolarization ? "#00B050" : "#FF0000" }}>{displayValue(it.polarization_radio)}</th>
 
                                                <th style={{ backgroundColor: '#FFF', color: condRsl ? "#00B050" : "#FF0000" }}>{displayValue(it.site_a_current_rsl)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: condRsl ? "#00B050" : "#FF0000" }}>{displayValue(it.site_z_current_rsl)}</th>
 
                                                <th style={{ backgroundColor: '#FFF', color: condTxFreq ? "#00B050" : "#FF0000" }}>{displayValue(it.freq_tx)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: condRxFreq ? "#00B050" : "#FF0000" }}>{displayValue(it.freq_rx)}</th>
 
                                                <th style={{ backgroundColor: '#FFF', color: condSiteAMod ? "#00B050" : "#FF0000" }}>{displayValue(it.site_a_modulation_mode)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: condSiteZMod ? "#00B050" : "#FF0000" }}>{displayValue(it.site_z_modulation_mode)}</th>
 
                                                <th style={{ backgroundColor: '#FFF', color: checkQM(it.site_a_min_mod_last_24h) ? "#00B050" : "#FF0000" }}>{displayValue(it.site_a_min_mod_last_24h)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: checkQM(it.site_z_min_mod_last_24h) ? "#00B050" : "#FF0000" }}>{displayValue(it.site_z_min_mod_last_24h)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: checkQM(it.site_a_max_mod_last_24h) ? "#00B050" : "#FF0000" }}>{displayValue(it.site_a_max_mod_last_24h)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: checkQM(it.site_z_max_mod_last_24h) ? "#00B050" : "#FF0000" }}>{displayValue(it.site_z_max_mod_last_24h)}</th>
 
                                                <th style={{ backgroundColor: '#FFF', color: checkQAMMin(it.site_a_min_configured_mod) ? "#00B050" : "#FF0000" }}>{displayValue(it.site_a_min_configured_mod)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: checkQAMMin(it.site_z_min_configured_mod) ? "#00B050" : "#FF0000" }}>{displayValue(it.site_z_min_configured_mod)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: checkQM(it.site_a_max_configured_mod) ? "#00B050" : "#FF0000" }}>{displayValue(it.site_a_max_configured_mod)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: checkQM(it.site_z_max_configured_mod) ? "#00B050" : "#FF0000" }}>{displayValue(it.site_z_max_configured_mod)}</th>
 
                                                <th style={{ backgroundColor: '#fff', color: condAtpcLink ? "#00B050" : "#FF0000" }}>{displayValue(atpcDisplay)}</th>
                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>{it.remark || "Ready to Offer"}</th>
                                            </tr>
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
 
export default MicrowaveAviatTable