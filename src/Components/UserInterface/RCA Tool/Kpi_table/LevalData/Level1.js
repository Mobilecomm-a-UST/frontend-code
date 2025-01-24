import React, { useState, useCallback, useRef } from 'react'
import { useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Box, Grid, Stack, Button, Popover, List, ListItem, ListItemText, Link, Breadcrumbs, Typography } from "@mui/material";
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
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getData,ServerURL } from '../../../../services/FetchNodeServices';
import Swal from "sweetalert2";
import { useStyles } from '../../../ToolsCss';
import axios from 'axios';




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
const Level1 = ({ heading, API }) => {
    const [tableData, setTableData] = useState([]);
    const [formData, setFormData] = useState({
        circle: '',
        person_name: '',
        email: '',
        id:'',
    })
    const [editDataId, setEditDataID] = useState()
    const [add, setAdd] = useState(false)
    const [edit, setEdit] = useState(false)
    const classes = useStyles();

    const fetchData = async () => {
        const response = await getData(`${API}`);
        if (response) {
            setTableData(response)
        }
        console.log(response)

    }

    const handleEdit = (tabData) => {
        setFormData({
            circle:tabData.circle,
            person_name:tabData.person_name,
            email:tabData.email,
            id:tabData.id,
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
            // refetch();
        }
        else {
            setEdit(false)
            handleCloser()
            // refetch();
        }
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

                // refetch();
            }
        } catch (error) {
            // Handle error
            alert('Error deleting data:' + error);
        }
    }

    const handleCloser = () => {
        setFormData({
            KPI: '',
            operator: '',
            threshold_value: ''
        })
        setEdit(false)
        setEditDataID()
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div style={{ margin: '10px' }}>
            <div style={{ height: 'auto', width: '100%', margin: '5px 0px', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor: 'white', borderRadius: '10px', padding: '1px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box >
                        <Tooltip title="Add List" color='primary'>
                            <IconButton color='primary' >
                                <PlaylistAddIcon fontSize='medium' color='primary' />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box>
                        <h3>{heading}</h3>
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
                    <TableContainer sx={{ maxHeight: 500, width: '100%' }}>
                        <Table stickyHeader >
                            <TableHead style={{ fontSize: 18 }}>
                                <TableRow >
                                    <StyledTableCell align="center">Sr. No.</StyledTableCell>
                                    <StyledTableCell align="center">Circle</StyledTableCell>
                                    <StyledTableCell align="center">Person Name</StyledTableCell>
                                    <StyledTableCell align="center">E-mail</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData?.map((row) => (
                                    <StyledTableRow
                                        key={row.id}
                                        className={classes.hover}
                                    >
                                        <StyledTableCell align="center">{row.id}</StyledTableCell>
                                        <StyledTableCell align="center">{row.circle}</StyledTableCell>
                                        <StyledTableCell align="center">{row.person_name}</StyledTableCell>
                                        <StyledTableCell align="center">{row.email}</StyledTableCell>
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
                                ))}
                                {/* {filterRCAData()} */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Slide>
        </div>
    )
}

export default Level1