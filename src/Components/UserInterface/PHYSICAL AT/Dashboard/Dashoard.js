import React, { useState, useEffect } from 'react';
import { Box, Grid } from "@mui/material";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useStyles } from './../../ToolsCss'
import Button from '@mui/material/Button';
import { postData } from './../../../services/FetchNodeServices'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PublishIcon from '@mui/icons-material/Publish';
import ClearIcon from '@mui/icons-material/Clear';
import DateRangePicker from 'rsuite/DateRangePicker';
import isAfter from 'date-fns/isAfter';
import Zoom from '@mui/material/Zoom';
import Multiselect from "multiselect-react-dropdown";
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx'
import { Placeholder } from 'rsuite';
import * as ExcelJS from 'exceljs'
import { render } from '@testing-library/react';

const Dashoard = () => {
    const [ageing, setAgeing] = useState([])
    const [ecdData, setEcdData] = useState([])
    // const [ecdCol , setEcdCol] = useState()
    const [open, setOpen] = useState(false)
    const [displayFilterData, setDisplayFilterData] = useState('OverAll Data Up Till :')
    const classes = useStyles()

    let ecdColLength;



    const fetchDashboardData = async () => {
        const response = await postData('Physical_At/view/')
        setAgeing(response.ageing_circleWise)
        setEcdData(response.ECD_data)
        console.log('AGEING DATA:', response)
    }


    const handleExport = () => {


        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Circle-wise")
        const sheet1 = workbook.addWorksheet("Pending-data")
        const sheet2 = workbook.addWorksheet("Alarm-bucket")
        const sheet3 = workbook.addWorksheet("Ageing-data")
        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';

        sheet.getRow(1).font = {
            name: 'Arial Black',
            color: { argb: '' },
            family: 2,
            size: 10,
            italic: false
        };
        sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        sheet1.getRow(1).font = {
            name: 'Arial Black',
            color: { argb: '' },
            family: 2,
            size: 10,
            italic: false
        };
        sheet1.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        sheet2.getRow(1).font = {
            name: 'Arial Black',
            color: { argb: '' },
            family: 2,
            size: 10,
            italic: false
        };
        sheet2.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        sheet3.getRow(1).font = {
            name: 'Arial Black',
            color: { argb: '' },
            family: 2,
            size: 10,
            italic: false
        };
        sheet3.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };


        sheet.columns = [
            { header: 'Circle', key: 'circle', width: 10 },
            { header: 'Accepted', key: 'Accepted', width: 15 },
            { header: 'Dismantle', key: 'Dismantle', width: 15 },
            { header: 'Need to be Offer', key: 'Need_to_be_offer', width: 20 },
            { header: 'Offered', key: 'offered', width: 15 },
            { header: 'Rejected', key: 'Rejected', width: 15 },
            { header: 'Pending', key: 'Pending', width: 15 },
            { header: 'Total', key: 'Total', width: 10 }
        ]
        sheet1.columns = [
            { header: 'Status', key: 'status', width: 10 },
            { header: 'Circle Team', key: 'Circle_Team', width: 15 },
            { header: 'Circle / NOC Team', key: 'Circle_Team_NOC_Team', width: 25 },
            { header: 'Circle / Media Team', key: 'circle_Team_Media_team', width: 25 },
            { header: 'NOC Team', key: 'NOC_Team', width: 15 },
            { header: 'Grand Total', key: 'Total', width: 15 },

        ]
        sheet2.columns = [
            { header: 'Row Labels', key: 'row_labels', width: 40 },
            { header: 'Count of Alarm Bucket', key: 'Count_of_Alarm_Bucket', width: 30 }

        ]
        sheet3.columns = [
            { header: 'Circle', key: 'circle', width: 10 },
            { header: '0-15', key: 'ageing_0_15', width: 15 },
            { header: '16-30', key: 'ageing_16_30', width: 15 },
            { header: '31-60', key: 'ageing_31_60', width: 15 },
            { header: '61-90', key: 'ageing_61_90', width: 15 },
            { header: 'GT-90', key: 'ageing_GT90', width: 15 },
            { header: 'Total', key: 'Total', width: 15 }
        ]

        // circleWiseData?.map(item => {
        //   sheet.addRow({
        //     circle: item?.circle,
        //     Accepted: item?.Accepted,
        //     Dismantle: item?.Dismantle,
        //     Need_to_be_offer: item?.Need_to_be_offer,
        //     offered: item?.offered,
        //     Rejected: item?.Rejected,
        //     Pending: item?.Pending,
        //     Total: item?.Total,
        //   })
        // })
        // PendingSiteData?.map(item => {
        //   sheet1.addRow({
        //     status: item?.status,
        //     Circle_Team: item?.Circle_Team,
        //     Circle_Team_NOC_Team: item?.Circle_Team_NOC_Team,
        //     circle_Team_Media_team: item?.circle_Team_Media_team,
        //     NOC_Team: item?.NOC_Team,
        //     Total: item?.Total,

        //   })
        // })
        // alarmBucketData?.map(item => {
        //   sheet2.addRow({
        //     row_labels: item?.row_labels,
        //     Count_of_Alarm_Bucket: item?.Count_of_Alarm_Bucket,
        //   })
        // })

        // ageingCircleData?.map(item=>{
        //   sheet3.addRow({
        //     circle: item?.circle,
        //     ageing_0_15: item?.ageing_0_15,
        //     ageing_16_30: item?.ageing_16_30,
        //     ageing_31_60: item?.ageing_31_60,
        //     ageing_61_90: item?.ageing_61_90,
        //     ageing_GT90: item?.ageing_GT90,
        //     Total: item?.Total,
        //   })
        // })

        workbook.xlsx.writeBuffer().then(item => {
            const blob = new Blob([item], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
            })
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = "soft-at.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }

    // #########     AGEING TABLE DATA        ##################
    const ageingTableData = () => {
        var arr = [];
        if (ageing != null) {
            Object.keys(ageing)?.map((item) => {
                arr.push({ ...ageing[item], circle: item });

            });
        }
        return arr?.map((item, index) => {
            if (item.circle == 'Total') {
                return (
                    <>
                        <tr key={index} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                            <td style={{ border: '1px solid black' }}>{item.circle}</td>
                            <td style={{ border: '1px solid black' }}>{item.ageing_0_15}</td>
                            <td style={{ border: '1px solid black' }}>{item.ageing_16_30}</td>
                            <td style={{ border: '1px solid black' }}>{item.ageing_31_60}</td>
                            <td style={{ border: '1px solid black' }}>{item.ageing_61_90}</td>
                            <td style={{ border: '1px solid black' }}>{item.ageing_GT90}</td>
                            <td style={{ border: '1px solid black' }}>{item.Close}</td>
                            <td style={{ border: '1px solid black' }}>{item.Total}</td>
                        </tr>
                    </>

                )
            }
            else {
                return (
                    <>
                        <tr key={index} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.circle}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.ageing_0_15}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.ageing_16_30}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.ageing_31_60}</td>
                            <td style={{ border: '1px solid black', backgroundColor: item.Rejected > 0 ? "#F96A56" : "", fontWeight: 'bold' }}>{item.ageing_61_90}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.ageing_GT90}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Close}</td>
                            <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item.Total}</td>
                        </tr>
                    </>
                )
            }
        })
    }

    //   #############  EXPECTED CLOSURE DATE   ###############
    const closureDateData = () => {
        var arr = [];
        if (ecdData != null) {
            Object.keys(ecdData)?.map((item) => {
                arr.push({ ...ecdData[item] });
            });
        }
        const keys = Object.keys(arr[0] || {});


        ecdColLength = keys.length

        keys.map((item) => {
            console.log('ECD data shoe ', item)
        })

        return keys?.map((item, index) => {
            return (
                <>
                    <td key={index} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>{item.replace('_', ' ').replaceAll('_','/')}</td>
                </>
            )
        })
    }

    const closureDateData2 = () => {
        var arr = [];
        if (ecdData != null) {
            Object.keys(ecdData)?.map((item) => {
                arr.push({ ...ecdData[item] });
            });
        }
        const keys = Object.keys(arr[0] || {});

        return arr?.map((item, index) => {
            return (
                <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                    {
                        keys?.map((it) => {
                            return <td style={{ fontWeight: 'bold', border: '1px solid black' }}>{item[it]}</td>
                        })
                    }
                </tr>
            )

        })



    }





    useEffect(() => {
        fetchDashboardData();
        closureDateData();
        document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
    }, [])

    return (
        <Zoom in='true' timeout={500} >
            <div style={{ margin: 20 }}>
            <style>{"th{border:1px solid black;}"}</style>
                <div style={{ height: 'auto', width: '100%', margin: '5px 0px', border: '1px solid black', borderRadius: '10px', padding: '2px', display: 'flex' }}>
                    <Grid container spacing={1}>
                        <Grid item xs={10} style={{ display: "flex" }}>
                            <Box >
                                <Tooltip title="Filter list">
                                    <IconButton onClick={() => { setOpen(true) }}>
                                        <FilterAltIcon fontSize='large' color='primary' />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box style={{ marginTop: 6 }} >
                                <span style={{ fontSize: 24, color: '#5DADE2', fontFamily: "monospace", fontWeight: 500, }}>{displayFilterData}</span>
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Box style={{ float: 'right' }}>
                                <Tooltip title="Export Excel">
                                    <IconButton onClick={() => { handleExport() }}>
                                        <DownloadIcon fontSize='large' color='primary' />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    </Grid>

                </div>
                {/* ******** TABLE DATAS ********** */}
                {/* <TableContainer sx={{ maxHeight: 500, marginTop: 3 }} component={Paper}>

                    <table border="3" style={{ width: "100%", border: "2px solid" }}>
                        <tr>
                            <th colspan={"8"} style={{ fontSize: 24, backgroundColor: "#AF7AC5", color: "black", }}>Ageing (Circle Wise)</th>
                        </tr>
                        <tr style={{ fontSize: 20, backgroundColor: "#223354", color: "white", }}>
                            <th>Circle</th>
                            <th>0-15</th>
                            <th>16-30</th>
                            <th>31-60</th>
                            <th>61-90</th>
                            <th>GT90</th>
                            <th>Close</th>
                            <th>Total</th>
                        </tr>
                        {ageingTableData()}
                    </table>

                </TableContainer>
                <TableContainer sx={{ maxHeight: 500, marginTop: 3 }} component={Paper}>

                    <table border="3" style={{ width: "100%", border: "2px solid" ,overflowX:'scroll'}}>
                        <tr>
                            <th colspan={5} style={{ fontSize: 24, backgroundColor: "#AF7AC5", color: "black", }}>Expected Closure Date</th>
                        </tr>
                        <tr style={{ fontSize: 20, backgroundColor: "#223354", color: "white", }}>

                            {closureDateData()}
                        </tr>
                        {closureDateData2()}
                    </table>
                </TableContainer> */}
                <div style={{ width: "100%", display: "grid", gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'auto', gridColumnGap: '0px' }}>
                    <div>
                        <table  style={{ width: "100%", border: "0px solid" }}>
                            <tr>
                                <th colspan={"8"} style={{ fontSize: 24, backgroundColor: "#AF7AC5", color: "black", }}>Ageing (Circle Wise)</th>
                            </tr>
                            <tr style={{ fontSize: 18, backgroundColor: "#223354", color: "white", }}>
                                <th>Circle</th>
                                <th>0-15</th>
                                <th>16-30</th>
                                <th>31-60</th>
                                <th>61-90</th>
                                <th>GT90</th>
                                <th>Close</th>
                                <th>Total</th>
                            </tr>
                            {ageingTableData()}
                        </table>
                    </div>
                    <div>
                        <table  style={{ width: "100%", border: "0px solid", overflowX: 'scroll' }}>
                            <tr>
                                <th colspan={5} style={{ fontSize: 24, backgroundColor: "#AF7AC5", color: "black", }}>Expected Closure Date</th>
                            </tr>
                            <tr style={{ fontSize: 20, backgroundColor: "#223354", color: "white", }}>

                                {closureDateData()}
                            </tr>
                            {closureDateData2()}
                        </table>
                    </div>
                </div>

            </div>
        </Zoom>
    )
}

export default Dashoard