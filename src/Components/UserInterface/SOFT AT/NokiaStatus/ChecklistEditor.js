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
import { useGet } from '../../../Hooks/GetApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useStyles } from '../../ToolsCss';
import { useQuery } from '@tanstack/react-query';
import { ServerURL } from '../../../services/FetchNodeServices';
import axios from 'axios';
import Swal from "sweetalert2";
// import { MemoAdd_Rca } from './Add_Rca';
import _ from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import CheckPicker from 'rsuite/CheckPicker';
// import Payload_data from './Payload_Table/Payload_data';
import { getDecreyptedData } from '../../../utils/localstorage';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#223354',
        color: theme.palette.common.white,
        whiteSpace: 'nowrap',
        width: theme.palette.common.auto,
        padding: 5,
        // '&:first-of-type': {
        //     position: '-webkit-sticky',
        //     left: 0,
        //     zIndex: 4,
        //     backgroundColor: '#223354', // Higher z-index for header cell
        // },


    },

    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: '0px 5px 0px 5px',
        // '&:first-of-type': {
        //     position: 'sticky',
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

const ChecklistEditor = () => {
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
        path: '',
        parameter_name: '',
        expected_value: '',

    })
    const { isPending, data, refetch } = useQuery({
        queryKey: ['RCA_TABLE_DATA'],
        queryFn: async () => {
            action(isPending)
            const res = await makeGetRequest("RCA_TOOL/rca-tables/");
            if (res) {
                action(false)
                // console.log('RCA table data', res)
                setKpi(_.uniq(_.map(res, 'KPI')))
                setDataSource(_.uniq(_.map(res, 'Data_source')))
                setTentative(_.uniq(_.map(res, 'Tentative_counters')))
                // console.log('sssssssaa', _.uniq(_.map(res, 'RCA')))

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
            const response = await axios.delete(`${ServerURL}/RCA_TOOL/rca-tables/${id}/`,
                {
                    headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
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
            path: tabData.path,
            parameter_name: tabData.parameter_name,
            expected_value: tabData.expected_value,

        })
        setEditDataID(tabData.id)
        setEdit(true)
    }

    const handleUpdateData = async (e) => {
        e.preventDefault()
        const response = await axios.put(`${ServerURL}/RCA_TOOL/rca-tables/${editDataId}/`, formData,
            {
                headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
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
            path: '',
            parameter_name: '',
            expected_value: '',
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
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItem: 'center' }}><Box><EditIcon fontSize='medium' /></Box><Box>EDIT CHECKLIST DATA</Box></Box>
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
            <div style={{ margin: 10 }}>
                <div style={{ margin: 5, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>

                        <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/soft_at') }}>Soft-AT Tool</Link>
                        <Typography color='text.primary'>Nokia Checklist Table</Typography>

                    </Breadcrumbs>
                </div>
                <div style={{ height: 'auto', width: '100%', margin: '5px 0px', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor: 'white', borderRadius: '10px', padding: '1px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box >
                            <Tooltip title="Add List" color='primary'>
                                <IconButton color='primary' onClick={() => setAdd(!add)}>
                                    <PlaylistAddIcon fontSize='medium' color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box>
                            <h3>Nokia Checkpoint Table</h3>
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
                                        <StyledTableCell align="center">Path <CheckPicker data={kpi.map(item => ({ label: item, value: item }))} value={selectKpi} onChange={(value) => { setSelectKpi(value) }} size="sm" appearance="subtle" style={{ width: 40 }} /></StyledTableCell>
                                        <StyledTableCell align="center">Parameter Name</StyledTableCell>
                                        <StyledTableCell align="center" >Expected Value  <CheckPicker data={dataSource.map(item => ({ label: item, value: item }))} value={selectDataSource} onChange={(value) => { setSelectDataSource(value) }} size="sm" appearance="subtle" placeholder="Data Source" style={{ width: 100 }} /> </StyledTableCell>
                                        <StyledTableCell align="center">Action</StyledTableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {filterRCAData()}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Slide>
                {handleEditDialog()}

                <Box sx={{ marginTop: 5 }}>
                    {/* <Payload_data /> */}
                </Box>
                {/* <MemoAdd_Rca open={add} handleClick={handleClick} handleFetch={refetch} /> */}
                {loading}
            </div>

        </>
    )
}

export default ChecklistEditor