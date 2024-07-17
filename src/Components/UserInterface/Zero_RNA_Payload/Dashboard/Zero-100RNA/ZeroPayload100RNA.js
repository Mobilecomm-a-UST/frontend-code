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
import { useGet } from '../../../../Hooks/GetApis';
import { usePost } from '../../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../../Hooks/LoadingDialog';
import { useQuery } from '@tanstack/react-query';
import { useStyles } from './../../../ToolsCss'

const ZeroPayload100RNA = () => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const { response, makeGetRequest } = useGet()
    const { makePostRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const [arrDateT2, setArrDateT2] = useState('')
    const [mainDataT2, setMainDataT2] = useState([])
    const [arrDate, setArrDate] = useState([])
    const [getCircle, setGetCircle] = useState([])
    const [tableData, setTableData] = useState([])
    // const [totals ,setTotals] = useState()


    const { isPending, isFetching, isError, data, error } = useQuery({
        queryKey: ['zero_payload_100_RNA'],
        queryFn: async () => {
            action(isPending)
            const res = await makeGetRequest("Zero_Count_Rna_Payload_Tool/circle_based_rna_count/");
            if (res) {
                action(false)
                ArrengeJSONData(res.data)
                setArrDate(res.dates)
                return res;
            }
        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })


    const calculateColumnTotals = (datass) => {

        // console.log('adasdasdasdasda', datass)
        const totals = {

            date_1: 0,
            date_2: 0,
            date_3: 0,
            date_4: 0,
            date_5: 0,
            date_6: 0,
            date_7: 0,
            date_8: 0,
        };

        datass.forEach(item => {
            for (let key in totals) {
                totals[key] += Number(item[key]) || 0;
            }
        });

        return totals;
    };

    const totals = calculateColumnTotals(tableData);

    // console.log('asasasasas', totals)


    const ArrengeJSONData = (datas) => {

        var convertedData = datas.reduce((acc, curr) => {
            const circle = curr.Circle;
            for (const key in curr) {
                if (key.startsWith("date_")) {
                    const date = key;
                    acc[circle] = acc[circle] || {};
                    acc[circle][date] = curr.Cell_Count;
                }
            }
            return acc;
        }, {})

        const result = Object.keys(convertedData).map(circle => ({
            Circle: circle,
            ...convertedData[circle]
        }));

        setTableData(result)

    }



    const fetchZeroRNA = async (props) => {

        console.log('213123123', props)
        action(true)
        var formData = new FormData();
        formData.append("circle", props.circle);
        formData.append("date", props.date);
        const responce1 = await makePostRequest('Zero_Count_Rna_Payload_Tool/hyperlink_circle_based_rna_count/', formData)
        if (responce1) {
            action(false)
            setOpen(true)
            console.log('responce data', responce1)
            setArrDateT2(responce1.date)
            setMainDataT2(responce1.data)

        }
        else {
            action(false)
        }

    }


    // handleExport Range wise table in excel formet.........
    const handleExport = () => {

        const workbook = new ExcelJS.Workbook();
        const sheet3 = workbook.addWorksheet("2G Dashboard", { properties: { tabColor: { argb: 'f1948a' } } })
        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';



        // sheet3.mergeCells('A1:S1');
        sheet3.mergeCells('A1:A2');


        sheet3.getCell('A1').value = 'Circle';
        sheet3.getCell('B1').value = 'P-0';
        sheet3.getCell('B2').value = '> 100GB';
        sheet3.getCell('B1').value = 'P-0';
        sheet3.getCell('B2').value = '> 100GB';
        sheet3.getCell('B1').value = 'P-0';
        sheet3.getCell('B2').value = '> 100GB';
        sheet3.getCell('B1').value = 'P-0';
        sheet3.getCell('B2').value = '> 100GB';





        sheet3.columns = [
            { key: 'Circle' },
            { key: 'Short_name_nan' },
            { key: 'site_ID' },
            { key: 'OEM_GGSN_nan' },
            { key: 'ms1_Date' },
            { key: 'project' },
            { key: 'MV_Freq_Band_nan' },
            { key: 'MV_of_2G_Cell_with_Network_Availability_week_2' },
            { key: 'MV_of_2G_Cell_with_Network_Availability_week_1' },
            { key: 'MV_of_2G_Cell_with_Network_Availability_date_1' },
            { key: 'MV_of_2G_Cell_with_Network_Availability_date_2' },
            { key: 'MV_of_2G_Cell_with_Network_Availability_date_3' },
            { key: 'MV_of_2G_Cell_with_Network_Availability_date_4' },
            { key: 'MV_of_2G_Cell_with_Network_Availability_date_5' },
            { key: 'Network_availability_RNA_week_2' },
            { key: 'Network_availability_RNA_week_1' },
            { key: 'Network_availability_RNA_date_1' },
            { key: 'Network_availability_RNA_date_2' },
            { key: 'Network_availability_RNA_date_3' },
            { key: 'Network_availability_RNA_date_4' },
            { key: 'Network_availability_RNA_date_5' },
            { key: 'MV_Total_Voice_Traffic_BBH_week_2' },
            { key: 'MV_Total_Voice_Traffic_BBH_week_1' },
            { key: 'MV_Total_Voice_Traffic_BBH_date_1' },
            { key: 'MV_Total_Voice_Traffic_BBH_date_2' },
            { key: 'MV_Total_Voice_Traffic_BBH_date_3' },
            { key: 'MV_Total_Voice_Traffic_BBH_date_4' },
            { key: 'MV_Total_Voice_Traffic_BBH_date_5' },


        ]


        mainDataT2?.map(item => {
            sheet3.addRow({
                Circle: item?.Circle,
                Short_name_nan: item?.Short_name_nan,
                site_ID: item?.site_ID,
                OEM_GGSN_nan: item?.OEM_GGSN_nan,
                ms1_Date: item?.ms1_Date,
                project: item?.project,
                MV_Freq_Band_nan: item?.MV_Freq_Band_nan,
                MV_of_2G_Cell_with_Network_Availability_week_2: item.MV_of_2G_Cell_with_Network_Availability_week_2,
                MV_of_2G_Cell_with_Network_Availability_week_1: item.MV_of_2G_Cell_with_Network_Availability_week_1,
                MV_of_2G_Cell_with_Network_Availability_date_1: item.MV_of_2G_Cell_with_Network_Availability_date_1,
                MV_of_2G_Cell_with_Network_Availability_date_2: item.MV_of_2G_Cell_with_Network_Availability_date_2,
                MV_of_2G_Cell_with_Network_Availability_date_3: item.MV_of_2G_Cell_with_Network_Availability_date_3,
                MV_of_2G_Cell_with_Network_Availability_date_4: item.MV_of_2G_Cell_with_Network_Availability_date_4,
                MV_of_2G_Cell_with_Network_Availability_date_5: item.MV_of_2G_Cell_with_Network_Availability_date_5,
                Network_availability_RNA_week_2: item.Network_availability_RNA_week_2,
                Network_availability_RNA_week_1: item.Network_availability_RNA_week_1,
                Network_availability_RNA_date_1: item.Network_availability_RNA_date_1,
                Network_availability_RNA_date_2: item.Network_availability_RNA_date_2,
                Network_availability_RNA_date_3: item.Network_availability_RNA_date_3,
                Network_availability_RNA_date_4: item.Network_availability_RNA_date_4,
                Network_availability_RNA_date_5: item.Network_availability_RNA_date_5,
                MV_Total_Voice_Traffic_BBH_week_2: item.MV_Total_Voice_Traffic_BBH_week_2,
                MV_Total_Voice_Traffic_BBH_week_1: item.MV_Total_Voice_Traffic_BBH_week_1,
                MV_Total_Voice_Traffic_BBH_date_1: item.MV_Total_Voice_Traffic_BBH_date_1,
                MV_Total_Voice_Traffic_BBH_date_2: item.MV_Total_Voice_Traffic_BBH_date_2,
                MV_Total_Voice_Traffic_BBH_date_3: item.MV_Total_Voice_Traffic_BBH_date_3,
                MV_Total_Voice_Traffic_BBH_date_4: item.MV_Total_Voice_Traffic_BBH_date_4,
                MV_Total_Voice_Traffic_BBH_date_5: item.MV_Total_Voice_Traffic_BBH_date_5,
            })
        })


        ///__________ STYLING IN EXCEL TABLE ______________ ///
        sheet3.eachRow((row, rowNumber) => {
            const rows = sheet3.getColumn(1);
            const rowsCount = rows['_worksheet']['_rows'].length;
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
                // if (rowNumber === rowsCount) {
                //     cell.fill = {
                //         type: 'pattern',
                //         pattern: 'solid',
                //         fgColor: { argb: 'FE9209' }
                //     }
                //     cell.font = {
                //         color: { argb: 'FFFFFF' },
                //         bold: true,
                //         size: 13,
                //     }
                // }
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
                        size: 13,
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
            anchor.download = "Zero_RNA_Payload_2G.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }

    const handleClose = () => {
        setOpen(false)
    }



    // ********** Filter Dialog Box **********//
    const filterDialog = () => {
        return (
            <Dialog
                open={open}
                // onClose={handleClose}
                keepMounted
                fullWidth
                maxWidth={'md'}
                style={{ zIndex: 5 }}
            >
                <DialogTitle><span style={{ float: 'right' }}><IconButton size="large" onClick={handleClose}><CloseIcon /></IconButton></span></DialogTitle>

                <DialogContent >
                    <TableContainer sx={{ maxHeight: 400, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Circle</th>
                                    <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Cell Name</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>MV 4G Data Volume GB</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>MV Radio NW Availability</th>
                                </tr>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{arrDateT2}</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{arrDateT2}</th>
                                </tr>

                            </thead>
                            <tbody>
                                {mainDataT2?.map((it) => (
                                    <tr style={{ textAlign: "center", fontWeigth: 700 }}>
                                        <th >{it?.Circle}</th>
                                        <th >{it?.Short_name}</th>
                                        <th >{it?.MV_4G_Data_Volume_GB}</th>
                                        <th >{it?.MV_Radio_NW_Availability}</th>
                                    </tr>
                                ))}

                            </tbody>


                        </table>
                    </TableContainer>

                </DialogContent>
            </Dialog>
        )
    }


    const getCircleName = (circle) => {
        const dataValue = data?.all_data.filter((item) => item.Circle === circle)
        setGetCircle(dataValue)

    }

    useEffect(() => {
        if (data) {
            ArrengeJSONData(data.data)
            setArrDate(data.dates)
        }
        // setTotals(calculateColumnTotals(tableData))
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])


    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 10 }}>
                    <Box style={{ margin: 5, marginLeft: 10 ,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" href='/tools'>Tools</Link>
                            <Link underline="hover" href='/tools/others'>Other</Link>
                            <Link underline="hover" href='/tools/others/zero_RNA_payload'>Zero RNA Payload</Link>
                            <Typography color='text.primary'>Zero Payload 100 RNA</Typography>
                        </Breadcrumbs>
                        <Box style={{ float: 'right' }}>
                            <Tooltip title="Export Excel">
                                <IconButton onClick={() => { handleExport(); }}>
                                    <DownloadIcon fontSize='medium' color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    {/* <div style={{ height: 'auto', width: '100%', margin: '5px 0px', boxShadow:'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset', borderRadius: '10px', padding: '2px', display: 'flex' }}>
                        <Grid container spacing={1}>
                            <Grid item xs={10} style={{ display: "flex" }}>
                                <Box >
                                    <Tooltip title="Filter list">
                                        <IconButton onClick={() => { setOpen(true) }}>
                                            <FilterAltIcon fontSize='large' color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                            </Grid>
                            <Grid item xs={2}>
                                <Box style={{ float: 'right' }}>
                                    <Tooltip title="Export Excel">
                                        <IconButton onClick={() => { handleExport(); }}>
                                            <DownloadIcon fontSize='medium' color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        </Grid>

                    </div> */}

                    {/* ************* 2G  TABLE DATA ************** */}

                    <Box sx={{ marginTop: 1 }}>

                        <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Circle</th>
                                        <th colSpan={8} style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Zero Payload 100 RNA</th>

                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{arrDate[0] ? arrDate[0] : 'NA'}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{arrDate[1] ? arrDate[1] : 'NA'}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{arrDate[2] ? arrDate[2] : 'NA'}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{arrDate[3] ? arrDate[3] : 'NA'}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{arrDate[4] ? arrDate[4] : 'NA'}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{arrDate[5] ? arrDate[5] : 'NA'}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{arrDate[6] ? arrDate[6] : 'NA'}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{arrDate[7] ? arrDate[7] : 'NA'}</th>

                                    </tr>

                                </thead>
                                <tbody>
                                    {tableData?.map((it) => (
                                        <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>

                                            <th >{it?.Circle}</th>
                                            <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => fetchZeroRNA({ date: arrDate[0], circle: it.Circle })} >{it.date_1 ? it.date_1 : 0}</th>
                                            <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => fetchZeroRNA({ date: arrDate[1], circle: it.Circle })} >{it.date_2 ? it.date_2 : 0}</th>
                                            <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => fetchZeroRNA({ date: arrDate[2], circle: it.Circle })} >{it.date_3 ? it.date_3 : 0}</th>
                                            <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => fetchZeroRNA({ date: arrDate[3], circle: it.Circle })} >{it.date_4 ? it.date_4 : 0}</th>
                                            <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => fetchZeroRNA({ date: arrDate[4], circle: it.Circle })} >{it.date_5 ? it.date_5 : 0}</th>
                                            <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => fetchZeroRNA({ date: arrDate[5], circle: it.Circle })} >{it.date_6 ? it.date_6 : 0}</th>
                                            <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => fetchZeroRNA({ date: arrDate[6], circle: it.Circle })} >{it.date_7 ? it.date_7 : 0}</th>
                                            <th className={classes.hover} style={{ cursor: 'pointer' }} onClick={() => fetchZeroRNA({ date: arrDate[7], circle: it.Circle })} >{it.date_8 ? it.date_8 : 0}</th>

                                        </tr>
                                    ))}

                                </tbody>
                                <tr style={{ textAlign: "center", fontWeigth: 700, backgroundColor: '#B0EBB4', color: '#000000', fontSize: 17 }}>
                                    <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#B0EBB4' }}>Total</th>
                                    {totals && Object.keys(totals).map((key) => (
                                        <th key={key}>{totals[key]}</th>
                                    ))}
                                </tr>


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

export default ZeroPayload100RNA