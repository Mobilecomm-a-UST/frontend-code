import React, { useState, useCallback, useRef } from 'react'
import { useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Box, Grid, Stack, Button, Popover, List, ListItem, ListItemText,Link , Breadcrumbs , Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';
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
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useGet } from '../../../Hooks/GetApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useStyles } from '../../ToolsCss';
import { useQuery } from '@tanstack/react-query';
import { MemoAdd_Kpi } from './Add_Kpi';
import { ServerURL } from '../../../services/FetchNodeServices';
import axios from 'axios';
import Swal from "sweetalert2";
import _ from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import CheckPicker from 'rsuite/CheckPicker';



const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#223354',
        color: theme.palette.common.white,
        whiteSpace: 'nowrap',
        width: theme.palette.common.auto,
        padding: 8,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: 4,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Kpi_Data = () => {
    const { makeGetRequest } = useGet()
    const navigate = useNavigate()
    const { action, loading } = useLoadingDialog()
    const classes = useStyles();
    const [add, setAdd] = useState(false)
    const [edit, setEdit] = useState(false)
    const [editDataId, setEditDataID] = useState()
    const [kpi, setKpi] = useState([]);//for unique kpi from database
    const [selectKpi, setSelectKpi] = useState([]);
    const [formData, setFormData] = useState({
        KPI: '',
        operator: '',
        threshold_value: ''
    })
    const { isPending, data, refetch } = useQuery({
        queryKey: ['RCA_KPI_DATA'],
        queryFn: async () => {
            action(isPending)
            const res = await makeGetRequest("RCA_TOOL/kpi-tables/");
            if (res) {
                action(false)
                // console.log('kpi table data', res)
                setKpi(_.uniq(_.map(res, 'KPI')))
                return res;
            }
            else {
                action(false)
            }
        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })
    const unique = useQuery({
        queryKey: ['UNIQUE_KPI'],
        queryFn: async () => {
            const res = await makeGetRequest("RCA_TOOL/unique_kpi/");
            if (res) {
                // console.log('unique kpi', res)
                return res;
            }

        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })



    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    const handleDelete = async (id) => {
        try {
            // Make the DELETE request
            const response = await axios.delete(`${ServerURL}/RCA_TOOL/kpi-tables/${id}/`,
                {
                    headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }
                }
            );
            // console.log('Deleted successfully:', response);

            if (response.status === 204) {
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `Data Deleted Successfully`,
                });

                refetch();
            }
        } catch (error) {
            // Handle error
            alert('Error deleting data:' + error);
        }
    }

    const handleEdit = (tabData) => {
        setFormData({
            KPI: tabData.KPI,
            operator: tabData.operator,
            threshold_value: tabData.threshold_value
        })
        setEditDataID(tabData.id)
        setEdit(true)
    }

    const handleUpdateData = async (e) => {
        e.preventDefault()
        const response = await axios.put(`${ServerURL}/RCA_TOOL/kpi-tables/${editDataId}/`, formData,
            {
                headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }
            }
        );
        if (response.status === 200) {
            Swal.fire({
                icon: "success",
                title: "Done",
                text: `Data Updated Successfully`,
            });
            setEdit(false)
            handleCloser()
            refetch();
        }
        else {
            setEdit(false)
            handleCloser()
            refetch();
        }
    }

    const handleEditDialog = useCallback(() => {
        return (
            <Dialog
                open={edit}
                TransitionComponent={Transition}
                keepMounted
                // onClose={handleClose}
                maxWidth={'md'}
                fullWidth={true}
            >
                <DialogTitle style={{ borderBottom: '1px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItem: 'center' }}><Box><EditIcon fontSize='medium' /></Box><Box>EDIT KPI DATA</Box></Box>
                    <Box >
                        <Tooltip title="Cancel">
                            <IconButton onClick={() => setEdit(false)}>
                                <CloseIcon fontSize='medium' color='default' />
                            </IconButton>
                        </Tooltip>
                    </Box>

                </DialogTitle>
                <DialogContent dividers={'paper'}>
                    <form onSubmit={handleUpdateData} style={{ width: '100%', marginTop: 20 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>

                                <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">KPI</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={formData.KPI}
                                        label="KPI"
                                        name='KPI'
                                        inputProps={{ readOnly: true }}
                                        onChange={handleChange}
                                    >

                                        {unique.data?.KPI_name?.map((item) => {
                                            return <MenuItem value={item}>{item}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>

                                <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">Operator</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={formData.operator}
                                        label="Operator"
                                        name='operator'
                                        onChange={handleChange}
                                    >

                                        {unique.data?.operators?.map((item) => {
                                            return <MenuItem value={item}>{item}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    placeholder="Threshold Value"
                                    label="Threshold Value"
                                    name="threshold_value"
                                    value={formData.threshold_value}
                                    onChange={handleChange}
                                    size="small"
                                    type='number'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained">Add</Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        )
    }, [edit, formData])


    const handleCloser = () => {
        setFormData({
            KPI: '',
            operator: '',
            threshold_value: ''
        })
        setEdit(false)
        setEditDataID()
    }
    const handleClick = () => {
        setAdd(false)
    };
    const filterRCAData = useCallback(() => {

        let filteredData = _.filter(data, item => {
            // if (selectKpi.length > 0 && selectDataSource.length > 0 && selectTentative.length > 0) {
            //     return _.includes(selectKpi, item.KPI) && _.includes(selectDataSource, item.Data_source) && _.includes(selectTentative, item.Tentative_counters);
            // }
            // else if (selectKpi.length > 0 && selectDataSource.length > 0) {
            //     return _.includes(selectKpi, item.KPI) && _.includes(selectDataSource, item.Data_source);
            // }
            // else if (selectDataSource.length > 0 && selectTentative.length > 0) {
            //     return _.includes(selectDataSource, item.Data_source) && _.includes(selectTentative, item.Tentative_counters)
            // }
            // else if (selectKpi.length > 0 && selectTentative.length > 0) {
            //     return _.includes(selectKpi, item.KPI) && _.includes(selectTentative, item.Tentative_counters);
            // }
            // else if (selectKpi.length > 0) {
            //     return _.includes(selectKpi, item.KPI)
            // }
            // else if (selectDataSource.length > 0) {
            //     return _.includes(selectDataSource, item.Data_source)
            // }
            // else if (selectTentative.length > 0) {
            //     return _.includes(selectTentative, item.Tentative_counters)
            // }
            // else {
            //     return data
            // }
            const kpiMatch = selectKpi.length === 0 || _.includes(selectKpi, item.KPI);


            return kpiMatch;
        });

        return filteredData?.map((row, index) => (
            <StyledTableRow
                key={index}
                className={classes.hover}
            >
                <StyledTableCell align="center">{row.KPI}</StyledTableCell>
                <StyledTableCell align="center">{row.threshold_value}</StyledTableCell>
                <StyledTableCell align="center">{row.operator}</StyledTableCell>
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
        ))

    }, [selectKpi, data])

    useEffect(() => {
        if(data){
            setKpi(_.uniq(_.map(data, 'KPI')))
        }
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    return (
        <>
            <div style={{ margin: 10 }}>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/rca') }}>RCA Tool</Link>
                    <Typography color='text.primary'>KPI Table</Typography>
                </Breadcrumbs>
            </div>
                <div style={{ height: 'auto', width: '100%', margin: '5px 0px', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor: 'white', borderRadius: '10px', padding: '1px', display: 'flex' }}>
                    <Grid container spacing={1}>
                        <Grid item xs={10} style={{ display: "flex" }}>
                            <Box >
                                <Tooltip title="Add List" color='primary'>
                                    <IconButton color='primary' onClick={() => setAdd(!add)}>
                                        <PlaylistAddIcon fontSize='medium' color='primary' />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Box style={{ float: 'right', display: 'flex' }}>
                                <Tooltip title="Export Excel">
                                    <IconButton >
                                        <DownloadIcon fontSize='medium' color='primary' />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    </Grid>
                </div>
                <Slide
                    direction='left'
                    in='true'
                    // style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 500, width: '100%' }}>
                            <Table stickyHeader >
                                <TableHead style={{ fontSize: 18 }}>
                                    <TableRow >
                                        <StyledTableCell align="center">KPI  <CheckPicker data={kpi.map(item => ({ label: item, value: item }))} value={selectKpi} onChange={(value) => { setSelectKpi(value) }} size="sm" appearance="subtle" style={{ width: 120 }} /></StyledTableCell>
                                        <StyledTableCell align="center">Threshold Value</StyledTableCell>
                                        <StyledTableCell align="center">Operator</StyledTableCell>
                                        <StyledTableCell align="center">Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* {data?.map((row) => (
                                        <StyledTableRow
                                            key={row.id}
                                            className={classes.hover}
                                        >
                                            <StyledTableCell align="center">{row.KPI}</StyledTableCell>
                                            <StyledTableCell align="center">{row.threshold_value}</StyledTableCell>
                                            <StyledTableCell align="center">{row.operator}</StyledTableCell>
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
                                    {filterRCAData()}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Slide>
                <MemoAdd_Kpi open={add} handleClick={handleClick} handleFetch={refetch} />
                {handleEditDialog()}
                {loading}
            </div>
        </>
    )
}

export default Kpi_Data