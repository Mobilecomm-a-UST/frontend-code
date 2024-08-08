import React, { useState, useCallback, useRef } from 'react'
import { useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Box, Grid, Stack, Button, Popover, List, ListItem, ListItemText, Link, Breadcrumbs, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
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
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useGet } from '../../../../Hooks/GetApis';
import { useLoadingDialog } from '../../../../Hooks/LoadingDialog';
import { useStyles } from '../../../ToolsCss';
import { useQuery } from '@tanstack/react-query';
import { ServerURL } from '../../../../services/FetchNodeServices';
import axios from 'axios';
import Swal from "sweetalert2";
import { MemoAdd_Rca } from './Add_Payload';
import _ from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import CheckPicker from 'rsuite/CheckPicker';

// import { SelectPicker } from 'rsuite';



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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Payload_data = (props) => { 
    const navigate = useNavigate();
    const { makeGetRequest } = useGet()
    const { action, loading } = useLoadingDialog()
    const classes = useStyles();
    const [add, setAdd] = useState(false)
    const [edit, setEdit] = useState(false)
    const [editDataId, setEditDataID] = useState()
    const [searchTerm, setSearchTerm] = useState('');//
    const [anchorE1, setAnchorE1] = useState(null);//
    const [kpi, setKpi] = useState([]);//for unique kpi from database
    const [selectKpi, setSelectKpi] = useState([]);
    const [dataSource, setDataSource] = useState([]);//for unique data source from database
    const [selectDataSource, setSelectDataSource] = useState([]);
    const [tentative, setTentative] = useState([]);//for unique tentative counters from database
    const [selectTentative, setSelectTentative] = useState([]);
    const [formData, setFormData] = useState({
        KPI: '',
        Probable_causes: '',
        Operator: '',
        Data_source: '',
        Tentative_counters: '',
        Condition_check: '',
        RCA: '',
        Proposed_solution: ''
    })
    const { isPending, data, refetch } = useQuery({
        queryKey: ['Payload_TABLE_DATA'],
        queryFn: async () => {
            action(isPending)
            const res = await makeGetRequest("RCA_TOOL/rca_payload_tables/");
            if (res) {
                action(false)
                // console.log('RCA table data', res)
                setKpi(_.uniq(_.map(res, 'KPI')))
                setDataSource(_.uniq(_.map(res, 'Data_source')))
                setTentative(_.uniq(_.map(res, 'Tentative_counters')))

                return _.sortBy(res, ['KPI'])
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
                console.log('unique kpi', res)
                return res;
            }

        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })

    const [filteredCategories, setFilteredCategories] = useState(unique.data?.tentative_counters);
    const open2 = Boolean(anchorE1);

    console.log('Payload table data component');

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        setFilteredCategories(
            unique.data?.tentative_counters.filter(category => category.toLowerCase().includes(value.toLowerCase()))
        );
    };
    const handleOpen2 = (event) => {
        console.log('check data in  tentative counters', event.currentTarget)
        setAnchorE1(event.currentTarget);
    };
    const handleCategoryChange2 = (event) => {
        // setCategory(event.currentTarget.getAttribute('data-value'));
        setFormData({
            ...formData,
            Tentative_counters: event.currentTarget.getAttribute('data-value'),
        })
        setAnchorE1(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    const handleDelete = async (id) => {
        try {
            // Make the DELETE request
            const response = await axios.delete(`${ServerURL}/RCA_TOOL/rca_payload_tables/${id}/`,
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
            Probable_causes: tabData.Probable_causes,
            Operator: tabData.Operator,
            Data_source: tabData.Data_source,
            Tentative_counters: tabData.Tentative_counters,
            Condition_check: tabData.Condition_check,
            RCA: tabData.RCA,
            Proposed_solution: tabData.Proposed_solution
        })
        setEditDataID(tabData.id)
        setEdit(true)
    }

    const handleUpdateData = async (e) => {
        e.preventDefault()
        const response = await axios.put(`${ServerURL}/RCA_TOOL/rca_payload_tables/${editDataId}/`, formData,
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

    const handleCloser = () => {
        setFormData({
            KPI: '',
            Probable_causes: '',
            Operator: '',
            Data_source: '',
            Tentative_counters: '',
            Condition_check: '',
            RCA: '',
            Proposed_solution: ''
        })
        setEdit(false)
        setEditDataID()
    }
    const handleClick = () => {
        setAdd(false)
    };

    const handleClose2 = () => {
        setSearchTerm('');
        setAnchorE1(null);

    }
    const handleAddCounters = () => {
        setFormData({
            ...formData,
            Tentative_counters: searchTerm
        })
        handleClose2();
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
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItem: 'center' }}><Box><EditIcon fontSize='medium' /></Box><Box>EDIT RCA DATA</Box></Box>
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
                                        onChange={handleChange}
                                    // inputProps={{ readOnly: true }}
                                    >

                                        {unique.data?.KPI_name?.map((item) => {
                                            return <MenuItem value={item}>{item}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"

                                    fullWidth
                                    placeholder="Probable Causes"
                                    label="Probable Causes"
                                    name="Probable_causes"
                                    value={formData.Probable_causes}
                                    onChange={handleChange}
                                    multiline
                                    maxRows={4}
                                    size="small"
                                    type='text'
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">Data Source</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={formData.Data_source}
                                        label="Data Source"
                                        name='Data_source'
                                        onChange={handleChange}
                                    >
                                        {unique.data?.data_source?.map((item) => {
                                            return <MenuItem value={item}>{item}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                {/* <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    placeholder="Tentative Counters"
                                    label="Tentative Counters"
                                    name="Tentative_counters"
                                    value={formData.Tentative_counters}
                                    onChange={handleChange}
                                    multiline
                                    maxRows={4}
                                    size="small"
                                    type='text'
                                /> */}
                                <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">Tentative Counters</InputLabel>
                                    <Select
                                        value={formData.Tentative_counters}
                                        onClick={handleOpen2}
                                        // readOnly
                                        label="Tentative Counters"
                                        open={false}
                                    >
                                        <MenuItem value={formData.Tentative_counters}>{formData.Tentative_counters}</MenuItem>
                                    </Select>
                                    <Popover
                                        open={open2}
                                        anchorE1={anchorE1}
                                        onClose={handleClose2}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}

                                    >
                                        <Box sx={{ p: 1, width: 500, position: 'relative', top: 0, zIndex: 15 }}>

                                            <TextField
                                                variant="outlined"
                                                placeholder="Tentative Counters Search"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}

                                                size='small'

                                            />


                                            <List>
                                                {filteredCategories?.length > 0 ? filteredCategories?.map((item, index) => (
                                                    <ListItem
                                                        button
                                                        key={index}
                                                        data-value={item}
                                                        onClick={handleCategoryChange2}
                                                    >
                                                        <ListItemText primary={item} />
                                                    </ListItem>
                                                )) : <Button variant='contained' onClick={handleAddCounters}>Add Counters</Button>}
                                            </List>
                                        </Box>
                                    </Popover>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    // required
                                    fullWidth
                                    placeholder="Condition Check"
                                    label="Condition Check"
                                    name="Condition_check"
                                    value={formData.Condition_check}
                                    onChange={handleChange}
                                    size="small"
                                    type='number'
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">Operator</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={formData.Operator}
                                        label="Operator"
                                        name='Operator'
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
                                    // required
                                    fullWidth
                                    placeholder="RCA"
                                    label="RCA"
                                    name="RCA"
                                    value={formData.RCA}
                                    onChange={handleChange}
                                    multiline
                                    maxRows={4}
                                    size="small"
                                    type='text'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    // required
                                    fullWidth
                                    placeholder="Proposed Solution"
                                    label="Proposed Solution"
                                    name="Proposed_solution"
                                    value={formData.Proposed_solution}
                                    onChange={handleChange}
                                    multiline
                                    maxRows={4}
                                    size="small"
                                    type='text'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained">Update</Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        )
    }, [edit, formData, anchorE1, searchTerm, open2, filteredCategories])

    const filterRCAData = useCallback(() => {

        let filteredData = _.filter(data, item => {

            const kpiMatch = selectKpi.length === 0 || _.includes(selectKpi, item.KPI);
            const dataSourceMatch = selectDataSource.length === 0 || _.includes(selectDataSource, item.Data_source);
            const tentativeMatch = selectTentative.length === 0 || _.includes(selectTentative, item.Tentative_counters);

            return kpiMatch && dataSourceMatch && tentativeMatch;
        });

        return filteredData?.map((row, index) => (
            <StyledTableRow
                key={index}
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
        ))

    }, [selectDataSource, selectKpi, selectTentative, data])

    useEffect(() => {
        if (data) {
            setKpi(_.uniq(_.map(data, 'KPI')))
            setDataSource(_.uniq(_.map(data, 'Data_source')))
            setTentative(_.uniq(_.map(data, 'Tentative_counters')))
        }
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    return (
        <>
            <div style={{ marginTop: 3 }}>

                <div style={{ height: 'auto', width: '100%', margin: '5px 0px', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor: 'white', borderRadius: '10px', padding: '1px' }}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Box >
                            <Tooltip title="Add List" color='primary'>
                                <IconButton color='primary' onClick={() => setAdd(!add)}>
                                    <PlaylistAddIcon fontSize='medium' color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Box>
                            <h3>Payload Table</h3>
                        </Box>

                        <Box style={{ float: 'right', display: 'flex' }}>
                            <Tooltip title="Export Excel">
                                <IconButton >
                                    <DownloadIcon fontSize='medium' color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                </div>
                <Slide
                    direction='left'
                    in='true'
                    // style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: '77vh', width: '100%' }}>
                            <Table stickyHeader >
                                <TableHead style={{ fontSize: 18 }}>
                                    <TableRow >
                                        <StyledTableCell align="center">KPI <CheckPicker data={kpi.map(item => ({ label: item, value: item }))} value={selectKpi} onChange={(value) => { setSelectKpi(value) }} size="sm" appearance="subtle" style={{ width: 40 }} /></StyledTableCell>
                                        <StyledTableCell align="center">Probable Causes</StyledTableCell>
                                        <StyledTableCell align="center" >Data Source  <CheckPicker data={dataSource.map(item => ({ label: item, value: item }))} value={selectDataSource} onChange={(value) => { setSelectDataSource(value) }} size="sm" appearance="subtle" placeholder="Data Source" style={{ width: 100 }} /> </StyledTableCell>
                                        <StyledTableCell align="center">Tentative Counters  <CheckPicker data={tentative.map(item => ({ label: item, value: item }))} value={selectTentative} onChange={(value) => { setSelectTentative(value) }} size="sm" appearance="subtle" style={{ width: 25 }} /></StyledTableCell>
                                        <StyledTableCell align="center">Condition Check</StyledTableCell>
                                        <StyledTableCell align="center">Operator</StyledTableCell>
                                        <StyledTableCell align="center">RCA</StyledTableCell>
                                        <StyledTableCell align="center">Proposed Solution</StyledTableCell>
                                        <StyledTableCell align="center">Action</StyledTableCell>
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
                                    {filterRCAData()}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Slide>
                {handleEditDialog()}
                <MemoAdd_Rca open={add} handleClick={handleClick} handleFetch={refetch} />
                {loading}
            </div>
        </>
    )
}

export default React.memo(Payload_data)