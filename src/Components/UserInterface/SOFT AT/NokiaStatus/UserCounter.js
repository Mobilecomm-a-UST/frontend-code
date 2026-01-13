import React, { useState, useCallback, useRef } from 'react'
import { useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Box, Grid, Stack, Button, Popover, List, ListItem, ListItemText, Link, Breadcrumbs, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';
import * as ExcelJS from 'exceljs'
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
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import { useGet } from '../../../Hooks/GetApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useStyles } from '../../ToolsCss';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import CheckPicker from 'rsuite/CheckPicker';
// import Payload_data from './Payload_Table/Payload_data';
import { getDecreyptedData } from '../../../utils/localstorage';
import { use } from 'react';


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

const UserCounter = () => {
    const navigate = useNavigate();
        const { makeGetRequest } = useGet()
        const { action, loading } = useLoadingDialog()
        const classes = useStyles();
        const [user,setUser]=useState([])
        const [selectUser,setSelectUser] = useState([])


        const { isPending, data, refetch } = useQuery({
            queryKey: ['SOFT_AT_Nokia_Counter'],
            queryFn: async () => {
                action(isPending)
                const res = await makeGetRequest("Soft_AT_Checklist_Nokia/user_count/");
                if (res) {
                    action(false)
                    setUser(_.uniq(_.map(res, 'user_name')))
                    return res
                }
                else {
                    action(false)
                }
            },
            staleTime: 100000,
            refetchOnReconnect: false,
        })
    
    
    
        const handleDownload = () => {
            const workbook = new ExcelJS.Workbook();
            const sheet1 = workbook.addWorksheet("Nokia Summary", { properties: { tabColor: { argb: 'B0EBB4' } } })
    
    
            sheet1.getCell('A1').value = 'User ID';
            sheet1.getCell('B1').value = 'Tool Name';
            sheet1.getCell('C1').value = 'Use Count';
            sheet1.columns = [
                { key: 'user_name' },
                { key: 'api_name' },
                { key: 'count' },
            ]

            data?.map(item => {
                sheet1.addRow({
                    user_name: item?.user_name,
                    api_name: item?.api_name,
                    count: item?.count,
                })
            })

            sheet1.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                const rows = sheet1.getColumn(1);
    
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
                anchor.download = "Nokia_User_Counter.xlsx";
                anchor.click();
                window.URL.revokeObjectURL(url);
            })
        }
    
    

    
        const filterRCAData = useCallback(() => {
    
            let filteredData = _.filter(data, item => {
                const userMatch = selectUser.length === 0 || _.includes(selectUser, item.user_name);


                return userMatch;

            });
    
            return filteredData?.map((row, index) => (
                <StyledTableRow
                    key={index}
                    className={classes.hover}
                >
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{index+1}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.user_name}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.api_name}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.count}</StyledTableCell>
                    {/* <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.expected_value}</StyledTableCell> */}
                </StyledTableRow>
            ))

        }, [data, selectUser])

        useEffect(() => {
            refetch();
            document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
        }, [])
  return (
   <>
            <div style={{ margin: 10 }}>
                <div style={{ margin: 5, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>

                        <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/soft_at') }}>Soft-AT Tool</Link>
                        <Typography color='text.primary'>Nokia Summary Table</Typography>

                    </Breadcrumbs>
                </div>
                <div style={{ height: 'auto', width: '100%', margin: '5px 0px', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor: 'white', borderRadius: '10px', padding: '1px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box >
                           
                        </Box>
                        <Box>
                            <h3>User Counter Table</h3>
                        </Box>

                        <Box style={{ float: 'right', display: 'flex' }}>
                            <Tooltip title="Export Excel">
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
                                        <StyledTableCell align="center">Sr. No. </StyledTableCell>
                                        <StyledTableCell align="center">User ID <CheckPicker data={user.map(item => ({ label: item, value: item }))} value={selectUser} onChange={(value) => { setSelectUser(value) }} size="sm" appearance="subtle" style={{ width: 40 }} /></StyledTableCell>
                                        <StyledTableCell align="center">Tool Name</StyledTableCell>
                                        <StyledTableCell align="center">Use Count</StyledTableCell>
                                       

                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {filterRCAData()}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Slide>
                {/* {handleEditDialog()} */}

                <Box sx={{ marginTop: 5 }}>
                    {/* <Payload_data /> */}
                </Box>
                {/* <AddCheckListData open={add} handleClick={handleClick} handleFetch={refetch} name='SUMMARY' api="upload_Summary_excel" /> */}
                {loading}
            </div>

        </>
  )
}

export default UserCounter