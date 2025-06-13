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
import { useGet } from '../../../Hooks/GetApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useStyles } from '../../ToolsCss';
import { useQuery } from '@tanstack/react-query';
import { ServerURL } from '../../../services/FetchNodeServices';
import axios from 'axios';
import Swal from "sweetalert2";
import * as ExcelJS from 'exceljs'
// import { MemoAdd_Rca } from './Add_Rca';
import AddCheckListData from './AddCheckListData';
import _ from 'lodash';
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
    const [perametrer, setPerameter] = useState([]);//for unique perameter from database
    const [selectPerameter, setSelectPerameter] = useState([]);
    const [expected, setExpected] = useState([]);//for unique perameter from database
    const [selectExpected, setSelectExpected] = useState([]);

    const [formData, setFormData] = useState({
        path: '',
        parameter_name: '',
        expected_value: '',

    })
    const { isPending, data, refetch } = useQuery({
        queryKey: ['SOFT_AT_Nokia_Checklist'],
        queryFn: async () => {
            action(isPending)
            const res = await makeGetRequest("Soft_AT_Checklist_Nokia/get/");
            if (res) {
                action(false)
                console.log('soft at nokia data', res)
                setExpected(_.uniq(_.map(res, 'expected_value')))
                setPerameter(_.uniq(_.map(res, 'parameter_name')))
                // console.log('sssssssaa', _.uniq(_.map(res, 'RCA')))

                return res
            }
            else {
                action(false)
            }
        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })


    const open2 = Boolean(anchorE1);
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

    const handleDownload = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet1 = workbook.addWorksheet("Nokia Checklist", { properties: { tabColor: { argb: 'B0EBB4' } } })


        sheet1.getCell('A1').value = 'Path';
        sheet1.getCell('B1').value = 'Parameter Name';
        sheet1.getCell('C1').value = 'Expected Value';
        sheet1.columns = [
            { key: 'path' },
            { key: 'parameter_name' },
            { key: 'expected_value' },
        ]

        data?.map(item => {
            sheet1.addRow({
                path: item?.path,
                parameter_name: item?.parameter_name,
                expected_value: item?.expected_value,

            })
        })

        sheet1.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            const rows = sheet1.getColumn(1);
            const rowsCount = rows['_worksheet']['_rows'].length;
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }

                if (rowNumber === 1) {
                    // First set the background of header row
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '223354' }
                    }
                    cell.font = {
                        color: { argb: 'FFFFFF' },
                        bold: true,
                        size: 12,
                    }
                    cell.views = [{ state: 'frozen', ySplit: 1 }]
                }
            });
            
                
           
        })
        workbook.xlsx.writeBuffer().then(item => {
            const blob = new Blob([item], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
            })
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = "Nokia_Checklist.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })
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
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Path"
                                    label="Path"
                                    name="path"
                                    value={formData.path}
                                    onChange={handleChange}
                                    multiline
                                    maxRows={4}
                                    size="small"
                                    type='text'
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Parameter Name"
                                    label="Parameter Name"
                                    name="parameter_name"
                                    value={formData.parameter_name}
                                    onChange={handleChange}
                                    multiline
                                    maxRows={4}
                                    size="small"
                                    type='text'
                                />
                            </Grid> <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Expected Value"
                                    label="Expected Value"
                                    name="expected_value"
                                    value={formData.expected_value}
                                    onChange={handleChange}
                                    multiline
                                    maxRows={4}
                                    size="small"
                                    type='text'
                                />
                            </Grid>


                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained" >Update</Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        )
    }, [edit, formData, anchorE1, searchTerm, open2])

    const filterRCAData = useCallback(() => {

        let filteredData = _.filter(data, item => {
            const perameterMatch = selectPerameter.length === 0 || _.includes(selectPerameter, item.parameter_name);
            const expectedMatch = selectExpected.length === 0 || _.includes(selectExpected, item.expected_value);

            return perameterMatch && expectedMatch;

        });

        return filteredData?.map((row, index) => (
            <StyledTableRow
                key={index}
                className={classes.hover}
            >
                <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.path}</StyledTableCell>
                <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.parameter_name}</StyledTableCell>
                <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.expected_value}</StyledTableCell>

                {/* <StyledTableCell align="center" style={{ borderRight: "2px solid black", display: 'flex', flex: 'row', justifyContent: 'space-evenly' }}>
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
                </StyledTableCell> */}
            </StyledTableRow>
        ))

    }, [data, selectPerameter, selectExpected])

    useEffect(() => {
        if (data) {
            setExpected(_.uniq(_.map(data, 'expected_value')))
            setPerameter(_.uniq(_.map(data, 'parameter_name')))

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
                            <Tooltip title="Export Checklist">
                                <IconButton onClick={() => { handleDownload() }}>
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
                                        <StyledTableCell align="center">Path </StyledTableCell>
                                        <StyledTableCell align="center">Parameter Name <CheckPicker data={perametrer.map(item => ({ label: item, value: item }))} value={selectPerameter} onChange={(value) => { setSelectPerameter(value) }} size="sm" appearance="subtle" style={{ width: 40 }} /></StyledTableCell>
                                        <StyledTableCell align="center" >Expected Value  <CheckPicker data={expected.map(item => ({ label: item, value: item }))} value={selectExpected} onChange={(value) => { setSelectExpected(value) }} size="sm" appearance="subtle" placeholder="Expected Value" style={{ width: 100 }} /> </StyledTableCell>
                                        {/* <StyledTableCell align="center">Action</StyledTableCell> */}

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
                <AddCheckListData open={add} handleClick={handleClick} handleFetch={refetch} name='CHECKLIST' api="upload-excel" />
                {loading}
            </div>

        </>
    )
}

export default ChecklistEditor