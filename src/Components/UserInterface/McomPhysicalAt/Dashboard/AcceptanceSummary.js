
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Slide from '@mui/material/Slide';
import React, { useState, useCallback, useRef } from 'react'
import { useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Box, Grid, Stack, Button, Popover, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import DownloadIcon from '@mui/icons-material/Download';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { InputPicker } from 'rsuite';
import CheckPicker from 'rsuite/CheckPicker';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { usePost } from "../../../Hooks/PostApis";



const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#223354',
        color: theme.palette.common.white,
        whiteSpace: 'nowrap',
        width: theme.palette.common.auto,
        padding: 5,
        '&:first-of-type': {
            position: '-webkit-sticky',
            left: 0,
            zIndex: 4,
            backgroundColor: '#223354', // Higher z-index for header cell
        },
        // '&:last-of-type': {
        //     position: '-webkit-fixed',
        //     left: 0,
        //     zIndex: 4,
        //     backgroundColor: '#223354', // Higher z-index for header cell
        // },

    },

    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: '0px 5px 0px 5px',
        '&:first-of-type': {
            position: 'sticky',
            left: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: 1,

        },

        // '&:last-of-type': {
        //     position: 'skicky',
        //     left: 0,
        //     backgroundColor: theme.palette.background.paper,
        //     zIndex: 1,
        // },
    },

}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({

    '&:nth-of-type(odd)': {
        backgroundColor: '#EEEEEE',

    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,

    },

}));



const AcceptanceSummary = () => {
    const [atStatus, setAtStatus] = useState([])
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        "sr_no": "",
        "sub_sr_no": "",
        "at_sr_no": "",
        "offered_layer": "",
        "site_id": "",
        "circle": "",
        "project": "",
        "nominal_type": "",
        "rantsp": "",
        "mwoem": "",
        "mwtsp": "",
        "installation_date": "",
        "integration_date": "",
        "physical_at_status": "",
        "physical_offered_date": "",
        "physical_at_status_date": "",
        "performance_at_status": "",
        "performance_at_offered_date": "",
        "performance_at_status_date": "",
        "soft_at_status": "",
        "soft_at_offered_date": "",
        "soft_at_status_date": "",
        "physical_at_assignment": "",
        "soft_at_assignment": "",
        "performance_at_assignment": "",
        "scft_at_assignment": ""
    })
    const {makePostRequest} = usePost()


    const data = [
        'Eugenia',
        'Bryan',
        'Linda',
        'Nancy',
        'Lloyd',
        'Alice',
        'Julia',
        'Albert',
        'Louisa',
        'Lester',
        'Lola',
        'Lydia',
        'Hal',
        'Hannah',
        'Harriet',
        'Hattie',
        'Hazel',
        'Hilda'
    ].map(item => ({ label: item, value: item }));


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleUpdateData = async(e) => {
        e.preventDefault()

        
        const response = await makePostRequest('Physical_At/add-main-table-data/', formData )
        console.log('responce data' ,  response )

        console.log('asdadad',e)
    }

    const handleClose =()=>{
        setOpen(false)
        setFormData(
            {
                "sr_no": "",
                "sub_sr_no": "",
                "at_sr_no": "",
                "offered_layer": "",
                "site_id": "",
                "circle": "",
                "project": "",
                "nominal_type": "",
                "rantsp": "",
                "mwoem": "",
                "mwtsp": "",
                "installation_date": "",
                "integration_date": "",
                "physical_at_status": "",
                "physical_offered_date": "",
                "physical_at_status_date": "",
                "performance_at_status": "",
                "performance_at_offered_date": "",
                "performance_at_status_date": "",
                "soft_at_status": "",
                "soft_at_offered_date": "",
                "soft_at_status_date": "",
                "physical_at_assignment": "",
                "soft_at_assignment": "",
                "performance_at_assignment": "",
                "scft_at_assignment": ""
            }
        )
    }


    const AddSiteListDialogBox = useCallback(() => {
        return (
            <Dialog
                open={open}
                fullWidth
                maxWidth='lg'
                BackdropProps={{
                    style: { backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(3px)' },
                }}
            >
                <DialogTitle>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div> Add New Site</div>
                        <div>
                            <IconButton aria-label="delete" size="small" title="Close" onClick={() => { handleClose(); }}>
                                <CloseIcon fontSize="inherit" />
                            </IconButton></div>
                    </div>

                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleUpdateData} style={{ width: '100%', marginTop: 10 }}>

                        <Grid container spacing={2}>
                            {Object.keys(formData).map((key,index) => {
                                
                                if(index < 10){
                                    return(
                                        <Grid item xs={3} key={key}>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                placeholder={key.replace(/_/g, ' ')}
                                                label={key.replace(/_/g, ' ')}
                                                name={key}
                                                // required
                                                value={formData[key]}
                                                onChange={handleChange}
                                                size="small"
                                                type={key.includes('date') ? 'date' : 'text'}
                                                InputLabelProps={key.includes('date') ? { shrink: true } : {}}
                                            />
                                        </Grid>
                                    )
                                }else{
                                    return(
                                        <Grid item xs={3} key={key}>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                placeholder={key.replace(/_/g, ' ')}
                                                label={key.replace(/_/g, ' ')}
                                                name={key}
                                                value={formData[key]}
                                                onChange={handleChange}
                                                size="small"
                                                type={key.includes('date') ? 'date' : 'text'}
                                                InputLabelProps={key.includes('date') ? { shrink: true } : {}}
                                            />
                                        </Grid>
                                    )
                                }
                            })}
                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained">Add Data</Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        )

    }, [open,formData])

    return (
        <>
            <Slide
                direction='left'
                in='true'
                // style={{ transformOrigin: '0 0 0' }}
                timeout={1000}
            >
                <div>
                    <div style={{ margin: 5, marginLeft: 10 }}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" href='/tools'>Tools</Link>
                            <Link underline="hover" href='/tools/mcom_physical_at'>Physical AT</Link>
                            <Typography color='text.primary'>Acceptance Summary</Typography>
                        </Breadcrumbs>
                    </div>
                    <div style={{ textAlign: 'right', margin: 5, marginLeft: 10 }}>
                        <Button variant="outlined" endIcon={<AddCircleOutlineIcon />} onClick={() => { setOpen(true) }}>Add new Site</Button>
                    </div>
                    <Slide
                        direction='left'
                        in='true'
                        // style={{ transformOrigin: '0 0 0' }}
                        timeout={1000}
                    >
                        <Paper sx={{ width: '99%', overflow: 'hidden' }}>
                            <Box sx={{ padding: 1, display: 'flex', justifyContent: 'space-between' }}>
                                <InputPicker size="sm" placeholder="All Circle" data={data} style={{ maxWidth: '25vh' }} />
                                <InputPicker size="sm" placeholder="SR Type" data={data} style={{ maxWidth: '25vh' }} />
                                <InputPicker size="sm" placeholder="All TSP" data={data} style={{ maxWidth: '25vh' }} />
                                <InputPicker size="sm" placeholder="All Project" data={data} style={{ maxWidth: '25vh' }} />
                                <InputPicker size="sm" placeholder="Assignment Status" data={data} style={{ maxWidth: '25vh' }} />
                                {/* <InputPicker size="sm" placeholder="Select AT Status" data={data} style={{ maxWidth: '25vh' }} />  */}
                                <CheckPicker data={data} placeholder="Select AT Status" value={atStatus} onChange={(value) => { setAtStatus(value) }} size="sm" style={{ maxWidth: '25vh' }} />
                                <InputPicker size="sm" placeholder="Select Date" data={data} style={{ maxWidth: '25vh' }} />
                            </Box>
                            <TableContainer sx={{ maxHeight: '77vh', width: '100%' }}>
                                <Table stickyHeader >
                                    <TableHead style={{ fontSize: 18 }}>
                                        <TableRow >
                                            <StyledTableCell align="center">Action</StyledTableCell>
                                            <StyledTableCell align="center">SR. No.</StyledTableCell>
                                            <StyledTableCell align="center">Sub-SR. No.</StyledTableCell>
                                            <StyledTableCell align="center">AT-SR. No.</StyledTableCell>
                                            <StyledTableCell align="center">Offered Layer</StyledTableCell>
                                            <StyledTableCell align="center">Site ID</StyledTableCell>
                                            <StyledTableCell align="center">Circle</StyledTableCell>
                                            <StyledTableCell align="center">Project</StyledTableCell>
                                            <StyledTableCell align="center">Nominal Type</StyledTableCell>
                                            <StyledTableCell align="center">RANTSP</StyledTableCell>
                                            <StyledTableCell align="center">MWOEM</StyledTableCell>
                                            <StyledTableCell align="center">MWTSP</StyledTableCell>
                                            <StyledTableCell align="center">Installation Date</StyledTableCell>
                                            <StyledTableCell align="center">Integration Date</StyledTableCell>
                                            <StyledTableCell align="center">Physical AT status</StyledTableCell>
                                            <StyledTableCell align="center">Physical Offered Date</StyledTableCell>
                                            <StyledTableCell align="center">Physical AT Status Date</StyledTableCell>
                                            <StyledTableCell align="center">Performance AT Status</StyledTableCell>
                                            <StyledTableCell align="center">Performance AT Offerred Date</StyledTableCell>
                                            <StyledTableCell align="center">Performance AT Status Date</StyledTableCell>
                                            <StyledTableCell align="center">Soft AT Status</StyledTableCell>
                                            <StyledTableCell align="center">Soft AT Offerred Date</StyledTableCell>
                                            <StyledTableCell align="center">Soft AT Status Date</StyledTableCell>
                                            <StyledTableCell align="center">Physical AT Assignment</StyledTableCell>
                                            <StyledTableCell align="center">Soft AT Assignment</StyledTableCell>
                                            <StyledTableCell align="center">Performance AT Assignment</StyledTableCell>
                                            <StyledTableCell align="center">SCFT AT Assignment</StyledTableCell>


                                            {/* <StyledTableCell align="center">KPI <CheckPicker data={kpi.map(item => ({ label: item, value: item }))} value={selectKpi} onChange={(value) => { setSelectKpi(value) }} size="sm" appearance="subtle" style={{ width: 40 }} /></StyledTableCell> */}
                                            {/* <StyledTableCell align="center">Probable Causes</StyledTableCell> */}
                                            {/* <StyledTableCell align="center" >Data Source  <CheckPicker data={dataSource.map(item => ({ label: item, value: item }))} value={selectDataSource} onChange={(value) => { setSelectDataSource(value) }} size="sm" appearance="subtle" placeholder="Data Source" style={{ width: 100 }} /> </StyledTableCell> */}
                                            {/* <StyledTableCell align="center">Tentative Counters  <CheckPicker data={tentative.map(item => ({ label: item, value: item }))} value={selectTentative} onChange={(value) => { setSelectTentative(value) }} size="sm" appearance="subtle" style={{ width: 25 }} /></StyledTableCell> */}
                                            {/* <StyledTableCell align="center">Condition Check</StyledTableCell>
                                            <StyledTableCell align="center">Operator</StyledTableCell>
                                            <StyledTableCell align="center">RCA</StyledTableCell>
                                            <StyledTableCell align="center">Proposed Solution</StyledTableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* {data?.map((row) => (
                                        <StyledTableRow
                                            key={row.id}
                                            className={classes.hover}
                                        >
                                            <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.KPI}</StyledTableCell>
                                            <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.Probable_causes}</StyledTableCell>
                                            <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.Data_source}</StyledTableCell>
                                            <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.Tentative_counters}</StyledTableCell>
                                            <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.Condition_check}</StyledTableCell>
                                            <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.Operator}</StyledTableCell>
                                            <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.RCA}</StyledTableCell>
                                            <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.Proposed_solution}</StyledTableCell>
                                            <StyledTableCell align="center" style={{ borderRight: "2px solid black", display: 'flex', flex: 'row', justifyContent: 'space-evenly' }}>
                                                <Tooltip title="Edit" color='primary'>
                                                    <IconButton color="primary" onClick={() => { handleEdit(row) }}>
                                                        <EditIcon fontSize='medium' />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton color="error" onClick={() => { handleDelete(row.id) }}>
                                                        <DeleteIcon fontSize='medium' />
                                                    </IconButton>
                                                </Tooltip>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))} */}
                                        {/* {filterRCAData()} */}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Slide>
                </div>
            </Slide>
            {AddSiteListDialogBox()}
        </>

    )
}

export default AcceptanceSummary