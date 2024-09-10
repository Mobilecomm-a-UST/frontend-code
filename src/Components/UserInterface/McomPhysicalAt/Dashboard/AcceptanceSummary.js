
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
                    <Slide
                    direction='left'
                    in='true'
                    // style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Paper sx={{ width: '99%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: '77vh', width: '100%' }}>
                            <Table stickyHeader >
                                <TableHead style={{ fontSize: 18 }}>
                                    <TableRow >
                                        {/* <StyledTableCell align="center">KPI <CheckPicker data={kpi.map(item => ({ label: item, value: item }))} value={selectKpi} onChange={(value) => { setSelectKpi(value) }} size="sm" appearance="subtle" style={{ width: 40 }} /></StyledTableCell> */}
                                        <StyledTableCell align="center">Probable Causes</StyledTableCell>
                                        {/* <StyledTableCell align="center" >Data Source  <CheckPicker data={dataSource.map(item => ({ label: item, value: item }))} value={selectDataSource} onChange={(value) => { setSelectDataSource(value) }} size="sm" appearance="subtle" placeholder="Data Source" style={{ width: 100 }} /> </StyledTableCell> */}
                                        {/* <StyledTableCell align="center">Tentative Counters  <CheckPicker data={tentative.map(item => ({ label: item, value: item }))} value={selectTentative} onChange={(value) => { setSelectTentative(value) }} size="sm" appearance="subtle" style={{ width: 25 }} /></StyledTableCell> */}
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
                                    {/* {filterRCAData()} */}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Slide>
                </div>
            </Slide>

        </>

    )
}

export default AcceptanceSummary