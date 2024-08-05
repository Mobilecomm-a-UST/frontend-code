import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import * as ExcelJS from 'exceljs'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useGet } from '../../../Hooks/GetApis';
import { usePost } from '../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useQuery } from '@tanstack/react-query';
import { useStyles } from '../../ToolsCss'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';




const monthNames = [" ",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const OemWiseIntegration = ({ onData }) => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    // const { response, makeGetRequest } = useGet()
    const { makePostRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const [mainDataT2, setMainDataT2] = useState([])
    const [monthArray, setMonthArray] = useState([])
    const [tableData, setTableData] = useState([])
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const [oem, setOem] = useState('')
    // const [totals ,setTotals] = useState()


    // console.log('OEM wise data ')

    const { isPending, isFetching, isError, data, refetch } = useQuery({
        queryKey: ['Integration_OEM_wise'],
        queryFn: async () => {
            action(isPending)
            var formData = new FormData()
            formData.append('month', month)
            formData.append('year', year)
            const res = await makePostRequest("IntegrationTracker/monthly-oemwise-integration-data/", formData);
            if (res) {
                action(false)
                setTableData(JSON.parse(res.table_data))
                setMonth(res.month)
                setYear(res.year)
                onData(res)
                return res;
            }
            else {
                action(false)
            }
        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })



    const calculateTotals = (datass) => {

        // console.log('girraj singh')
        const totals = {
            ERICSSON: 0,
            HUAWEI: 0,
            NOKIA: 0,
            SAMSUNG: 0,
            ZTE: 0
        };

        datass.forEach(item => {
            totals.ERICSSON += Number(item.ERICSSON) || 0;
            totals.HUAWEI += Number(item.HUAWEI) || 0;
            totals.NOKIA += Number(item.NOKIA) || 0;
            totals.SAMSUNG += Number(item.SAMSUNG) || 0;
            totals.ZTE += Number(item.ZTE) || 0;
        });

        return totals;
    };

    const totals = calculateTotals(tableData);

    // const totals =  calculateTotals(tableData);

    const ShortDate = (months) => {
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        const shortMonth = months?.map(month => monthNames[month - 1]);

        setMonthArray(shortMonth)
    }
    const handleMonthYear = async (dates) => {
        await setMonth(dates.$M + 1)
        await setYear(dates.$y)
        // console.log('dates month year', dates)

        await refetch()
    }

    const handleClose = () => {
        setOpen(false)
    }

    // handleExport Range wise table in excel formet.........
    const handleExport = () => {

        const workbook = new ExcelJS.Workbook();
        const sheet3 = workbook.addWorksheet("Dip Tracker D1", { properties: { tabColor: { argb: 'f1948a' } } })
        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';



        // sheet3.mergeCells('A1:S1');
        sheet3.mergeCells('A1:A2');
        sheet3.mergeCells('F1:F2');


        sheet3.getCell('A1').value = 'Circle';
        sheet3.getCell('B1').value = 'P-0';
        sheet3.getCell('B2').value = '> 100GB';
        sheet3.getCell('C1').value = 'P-1';
        sheet3.getCell('C2').value = '≥ 50GB < 100GB';
        sheet3.getCell('D1').value = 'P-2';
        sheet3.getCell('D2').value = '≥ 30GB < 50GB';
        sheet3.getCell('E1').value = 'P-3';
        sheet3.getCell('E2').value = '≥ 10GB < 30GB';
        sheet3.getCell('F1').value = 'Total';



        sheet3.columns = [
            { key: 'Circle' },
            { key: 'p0' },
            { key: 'p1' },
            { key: 'p2' },
            { key: 'p3' },
            { key: 'Total' },
        ]


        data?.data.map(item => {
            sheet3.addRow({
                Circle: item?.Circle,
                p0: (item?.p0 ? item.p0 : 0),
                p1: (item?.p1 ? item.p1 : 0),
                p2: (item?.p2 ? item.p2 : 0),
                p3: (item?.p3 ? item.p3 : 0),
                Total: item?.Total,
            })
        })


        ///__________ STYLING IN EXCEL TABLE ______________ ///
        sheet3.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            const rows = sheet3.getColumn(1);
            const rowsCount = rows['_worksheet']['_rows'].length;
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
                if (rowNumber === rowsCount) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FE9209' }
                    }
                    cell.font = {
                        color: { argb: 'FFFFFF' },
                        bold: true,
                        size: 13,
                    }
                }

                if (rowNumber === 1 || rowNumber === 2) {
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
            })
        })

        workbook.xlsx.writeBuffer().then(item => {
            const blob = new Blob([item], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
            })
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = "Payload_Dip_Tracker_D1.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }

    // Second Hyperlink in Dialog box
    const secondHyperLink = async (props) => {
        console.log('secondHyperLink', props)
        action(true)
        var formData = new FormData();
        formData.append("circle", props.circle);
        formData.append("Activity_Name", props.activity);
        formData.append("oem", oem);
        formData.append("month", month);
        formData.append("year", year);


        const responce = await makePostRequest('IntegrationTracker/hyperlink-hyperlink-monthwise-integration-data/', formData)
        if (responce) {
            console.log('responce', responce)
            // setMainDataT2(responce)
            action(false)
            localStorage.setItem("integration_final_tracker", JSON.stringify(responce));
            // console.log('response data in huawia site id' , response)
            window.open(`${window.location.href}/${props.activity}`, "_blank")
            // setOpen(true)
        }
        else {
            action(false)
        }

    }

    // ********** Filter Dialog Box **********//
    const filterDialog = useCallback(() => {
        return (
            <Dialog
                open={open}
                // onClose={handleClose}
                keepMounted
                fullWidth
                maxWidth={'md'}
                style={{ zIndex: 5 }}
            >
                <DialogTitle> Month:{monthNames[month]}-{year}, OEM:{oem}   <span style={{ float: 'right' }}><IconButton size="large" onClick={handleClose}><CloseIcon /></IconButton></span></DialogTitle>

                <DialogContent >
                    <TableContainer sx={{ maxHeight: 450, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>CIRCLE</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>DE-GROW</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>MACRO</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>RELOCATION</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>RET</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>ULS HPSC</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>UPGRADE</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>FEMTO</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>HT-INCREMENT</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>IBS</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>IDSC</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>ODSC</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>RECTIFICATION</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>OTHERS</th>

                                </tr>
                            </thead>
                            <tbody>
                                {mainDataT2?.map((item) => (
                                    <tr style={{ textAlign: "center", fontWeigth: 700 }}>
                                        <th>{item.cir}</th>
                                        <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => secondHyperLink({ circle: item.cir, activity: 'DE-GROW' })}>{item.DE_GROW}</th>
                                        <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => secondHyperLink({ circle: item.cir, activity: 'MACRO' })}>{item.MACRO}</th>
                                        <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => secondHyperLink({ circle: item.cir, activity: 'RELOCATION' })}>{item.RELOCATION}</th>
                                        <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => secondHyperLink({ circle: item.cir, activity: 'RET' })}>{item.RET}</th>
                                        <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => secondHyperLink({ circle: item.cir, activity: 'ULS_HPSC' })}>{item.ULS_HPSC}</th>
                                        <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => secondHyperLink({ circle: item.cir, activity: 'UPGRADE' })}>{item.UPGRADE}</th>
                                        <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => secondHyperLink({ circle: item.cir, activity: 'FEMTO' })}>{item.FEMTO}</th>
                                        <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => secondHyperLink({ circle: item.cir, activity: 'HT INCREMENT' })}>{item.HT_INCREMENT}</th>
                                        <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => secondHyperLink({ circle: item.cir, activity: 'IBS' })}>{item.IBS}</th>
                                        <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => secondHyperLink({ circle: item.cir, activity: 'IDSC' })}>{item.IDSC}</th>
                                        <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => secondHyperLink({ circle: item.cir, activity: 'ODSC' })}>{item.ODSC}</th>
                                        <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => secondHyperLink({ circle: item.cir, activity: 'RECTIFICATION' })}>{item.RECTIFICATION}</th>
                                        <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => secondHyperLink({ circle: item.cir, activity: 'OTHERS' })}>{item.OTHERS}</th>

                                    </tr>
                                ))}
                            </tbody>


                        </table>
                    </TableContainer>

                </DialogContent>
            </Dialog>
        )
    }, [mainDataT2, open])

    const ClickDataGet = async (props) => {
        setOem(props.oem)
        action(true)
        var formData = new FormData();
        formData.append("circle", props.circle);
        formData.append("oem", props.oem);
        formData.append("month", month);
        formData.append("year", year);

        const responce = await makePostRequest('IntegrationTracker/hyperlink-monthly-oemwise-integration-data/', formData)
        if (responce) {
            console.log('hyperlink data', JSON.parse(responce.table_data))
            setMainDataT2(JSON.parse(responce.table_data))
            action(false)
            setOpen(true)
        }
        else {
            action(false)
        }
    }
    useEffect(() => {

        if (data) {
            // ShortDate(data.latest_months.sort((a, b) => a - b))
            setTableData(JSON.parse(data.table_data))
            setMonth(data.month)
            setYear(data.year)
            onData(data)
        }
        // setTotals(calculateTotals(tableData))
    }, [])
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>


                    {/* ************* 2G  TABLE DATA ************** */}
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 20, fontWeight: 'bold' }}>
                        Monthly OEM Wise Dashboard
                        </Box>
                        <Box>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DatePicker views={['month', 'year']} onChange={handleMonthYear} />
                            </LocalizationProvider>
                        </Box>
                    </Box>

                    <Box sx={{ marginTop: 0 }}>

                        <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th colSpan={6} style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{monthNames[month]}-{year}</th>
                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>CIRCLE</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>ERICSSON</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>HUAWEI</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>NOKIA</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>SAMSUNG</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>ZTE</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.map((it,index) => {
                                        return (
                                            <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                <th >{it?.cir}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ circle: it?.cir, oem: 'ERICSSON' })}>{it?.ERICSSON}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ circle: it?.cir, oem: 'HUAWEI' })}>{it?.HUAWEI}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ circle: it?.cir, oem: 'NOKIA' })}>{it?.NOKIA}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ circle: it?.cir, oem: 'SAMSUNG' })}>{it?.SAMSUNG}</th>
                                                <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => ClickDataGet({ circle: it?.cir, oem: 'ZTE' })}>{it?.ZTE}</th>
                                            </tr>
                                        )
                                    }
                                    )}
                                    <tr style={{ textAlign: "center", fontWeigth: 700, backgroundColor: '#ED6C02', color: '#fff', fontSize: 16 }}>
                                        <th>Total</th>
                                        <th>{totals?.ERICSSON}</th>
                                        <th>{totals?.HUAWEI}</th>
                                        <th>{totals?.NOKIA}</th>
                                        <th>{totals?.SAMSUNG}</th>
                                        <th>{totals?.ZTE}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </TableContainer>
                    </Box>

                </div>
            </Slide>
            {filterDialog()}
            {loading}
        </>
    )
}

export const MemoOemWiseIntegration= React.memo(OemWiseIntegration)