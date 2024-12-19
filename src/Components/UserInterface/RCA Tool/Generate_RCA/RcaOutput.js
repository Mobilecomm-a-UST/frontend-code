import React, { useEffect, useState } from 'react'
import { usePost } from '../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { styled } from '@mui/material/styles';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FixedSizeList } from 'react-window'; // Import react-window
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import _ from 'lodash';
import CheckPicker from 'rsuite/CheckPicker';
import { useStyles } from '../../ToolsCss';
import { CsvBuilder } from 'filefy';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';




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

const RcaOutput = () => {
    const classes = useStyles();
    const [rcaData, setRcaData] = useState([])
    const [visibleData, setVisibleData] = useState([]); // Data currently rendered
    const [itemsPerLoad, setItemsPerLoad] = useState(50);
    const [circleData,  setCircleData] = useState([])
    const [selectedCircle , setSelectedCircle] = useState([])
    const { makePostRequest } = usePost()
    const { action, loading } = useLoadingDialog()



    const fetchDashboardData = async (date) => {

        action(true)
        const formData = new FormData();
        formData.append('date', date)
        const responce = await makePostRequest("RCA_TOOL/rca-dashboard/", formData)
        if (responce) {
            action(false)
            console.log('responce', responce)
            setRcaData(responce?.table_data)
            setVisibleData(responce.table_data.slice(0, itemsPerLoad));
            setCircleData( _.uniq(_.map(responce?.table_data, 'circle')))
            // console.log('filter data', _.uniq(_.map(responce?.table_data, 'circle'))) // Show initial data

            // setMdashboard(JSON.parse(responce.table_data))
            // console.log('master dashboard'  ,  JSON.parse(responce.table_data) )
        } else {
            action(false)
            console.log('responce', responce)

        }
    }


    const columnData = [
        { title: 'Circle', field: 'circle' },
        { title: 'Cell Name', field: 'Cell_name' },
        { title: 'KPI', field: 'KPI' },
        { title: 'Cell Value', field: 'cell_value' },
        { title: 'Threshold Value', field: 'threshold_value' },
        { title: 'Check Condition', field: 'check_condition' },
        { title: 'RCA', field: 'RCA' },
        { title: 'Proposed Solution', field: 'Proposed_Solution' },
        { title: 'History Alarms', field: 'history_alarms' },
       
    ]

    const handleExport=()=>{
        var csvBuilder = new CsvBuilder(`Generate_rca_output.csv`)
        .setColumns(columnData.map(item => item.title))
        .addRows(rcaData.map(row => columnData.map(col => row[col.field])))
        .exportFile();
    }


    const Row = ({ index, style }) => {
        const row = rcaData[index];
        return (
          <TableRow key={index} style={style} className={classes.hover}>
            <StyledTableCell align="center">{row.circle}</StyledTableCell>
            <StyledTableCell align="center">{row.Cell_name}</StyledTableCell>
            <StyledTableCell align="center">{row.KPI}</StyledTableCell>
            <StyledTableCell align="center">{row.cell_value}</StyledTableCell>
            <StyledTableCell align="center">{row.threshold_value}</StyledTableCell>
            <StyledTableCell align="center">{row.check_condition}</StyledTableCell>
            <StyledTableCell align="center">{row.RCA}</StyledTableCell>
            <StyledTableCell align="center">{row.Proposed_Solution}</StyledTableCell>
            <StyledTableCell align="center">{row.history_alarms}</StyledTableCell>
          </TableRow>
        );
      };
    

    // Load more data on scroll
    const loadMoreData = () => {
        console.log('loading dataa ssssssss')
        setVisibleData((prevVisibleData) => [
            ...prevVisibleData,
            ...rcaData.slice(prevVisibleData.length, prevVisibleData.length + itemsPerLoad),
        ]);
    };

    useEffect(() => {
        const dayBefor = new Date();
        dayBefor.setDate(dayBefor.getDate() - 1);
        let newDate = dayBefor.getFullYear() + '-' + ('0' + (dayBefor.getMonth() + 1)).slice(-2) + '-' + ('0' + dayBefor.getDate()).slice(-2);
        // console.log('dayBefor', newDate)

        fetchDashboardData(newDate)
    }, [])

    return (
        <>
            <Slide
                direction='left'
                in='true'
                // style={{ transformOrigin: '0 0 0' }}
                timeout={1000}
            >
            <div>
                    <div>
                        <IconButton color='primary' onClick={handleExport} title='Export in csv'>
                            <DownloadIcon />
                        </IconButton>

                    </div>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer id="scrollableTable" sx={{ maxHeight: '77vh', width: '100%' }}>
                            <InfiniteScroll
                                dataLength={visibleData.length} // Current number of items rendered
                                next={loadMoreData} // Load more data on scroll
                                hasMore={visibleData.length < rcaData.length} // Check if more data is available
                                loader={<h4>Loading more rows...</h4>}
                                endMessage={<p style={{ textAlign: 'center' }}>No more data to display</p>}
                                scrollableTarget="scrollableTable" // Use TableContainer as scroll target
                            >
                                <Table stickyHeader >
                                    <TableHead style={{ fontSize: 18 }}>
                                        <TableRow >
                                            <StyledTableCell align="center">Circle <CheckPicker data={circleData.map(item => ({ label: item, value: item }))} value={selectedCircle} onChange={(value) => { setSelectedCircle(value) }} size="sm" appearance="subtle" style={{ width: 40 }} /></StyledTableCell>
                                            <StyledTableCell align="center">Cell Name</StyledTableCell>
                                            <StyledTableCell align="center" >KPI</StyledTableCell>
                                            <StyledTableCell align="center">Cell Value</StyledTableCell>
                                            <StyledTableCell align="center">Threshold Value</StyledTableCell>
                                            <StyledTableCell align="center">Check Condition</StyledTableCell>
                                            <StyledTableCell align="center">RCA</StyledTableCell>
                                            <StyledTableCell align="center">Proposed Solution</StyledTableCell>
                                            <StyledTableCell align="center">History Alarms</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {visibleData?.map((row) => (
                                            <StyledTableRow
                                                key={row.id}
                                                className={classes.hover}
                                            >
                                                <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.circle}</StyledTableCell>
                                                <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.Cell_name}</StyledTableCell>
                                                <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.KPI}</StyledTableCell>
                                                <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.cell_value}</StyledTableCell>
                                                <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.threshold_value}</StyledTableCell>
                                                <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.check_condition}</StyledTableCell>
                                                <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.RCA}</StyledTableCell>
                                                <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.Proposed_Solution}</StyledTableCell>
                                                <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.history_alarms}</StyledTableCell>

                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </InfiniteScroll>
                        </TableContainer>
                    </Paper>
            </div>
                
            </Slide>
            {loading}
        </>

    )
}

export default React.memo(RcaOutput);