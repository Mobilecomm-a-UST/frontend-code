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
const CircleList = ['AP', 'ASM', 'BIH', 'CHN', 'DEL', 'HRY', 'JK', 'JRK', 'KK', 'KOL', 'MAH', 'MP', 'MUM', 'NE', 'ORI', 'PUN', 'RAJ', 'ROTN', 'UPE', 'UPW', 'WB']

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

                // ✅ Check status from API
                if (res?.data?.status === true) {
                    Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: res?.data?.message || "Data deleted successfully."
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Failed",
                        text: res?.data?.message || "Delete operation failed."
                    });
                }

            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Something went wrong while deleting."
                });
            }
        }
    };

    const handleDownloadFile = async () => {
        const res = await getData('mw_app/get_delete');

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
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>

                                        <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#223354' }}>
                                            Circle
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            Reference Key
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            Site ID
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            Equipment Make
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            Bandwidth (MHz)
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            TX Frequency
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            RX Frequency
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            ACM Status
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            ATPC Status
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            RSL Min
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            RSL Max
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            Site A RSL
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            Site Z RSL
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            Polarization
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            Remark
                                        </th>

                                        <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFF', color: 'black' }}>
                                            Created At
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.map((it, index) => {
                                        return (
                                            <tr
                                                className={classes.hoverRT}
                                                style={{ textAlign: "center", fontWeigth: 700 }}
                                                key={index}
                                            >
                                                <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#CBCBCB', color: 'black' }}>
                                                    {it.circle}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.reference_key}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.site_id}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.equipment_make}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.bandwidth_mhz}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.tx_frequency_mhz}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.rx_frequency_mhz}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.acm_status}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.atpc_status}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.rsl_min_dbm}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.rsl_max_dbm}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.site_a_current_rsl}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.site_z_current_rsl}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.polarization}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.remark}
                                                </th>

                                                <th style={{ backgroundColor: '#FFF', color: 'black' }}>
                                                    {it.created_at}
                                                </th>
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