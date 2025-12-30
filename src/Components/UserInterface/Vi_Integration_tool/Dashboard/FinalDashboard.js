import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Grid } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import * as ExcelJS from 'exceljs'
import { MemoDateWiseIntegration } from './DateWiseIntegration'
import { MemoMonthWiseIntegration } from './MonthWiseIntegration'
import { MemoOemWiseIntegration } from './OemWiseIntegration'
import { MemoRangeWiseDashboard } from './RangeWiseDashboard';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useGet } from '../../../Hooks/GetApis';
import { usePost } from '../../../Hooks/PostApis';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import CountUp from 'react-countup';



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
const alphaBate = ['B', 'AB', 'BJ'];

const colorType = ['#B0EBB4', '#A0DEFF', '#FF9F66', '#ECB176', '#CDE8E5']

const FinalDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [sheet1Date, setSheet1Date] = useState([])
    const [sheet1Data, setSheet1Data] = useState([])

    const [sheet2Date, setSheet2Date] = useState([])
    const [sheet2Data, setSheet2Data] = useState([])


    const [sheet3Date, setSheet3Date] = useState([])
    const [sheet3Data, setSheet3Data] = useState([])

    const [sheet4Date, setSheet4Date] = useState([])
    const [sheet4Data, setSheet4Data] = useState([])
    const { makeGetRequest } = useGet()
    const [mdashboard, setMdashboard] = useState([])

    const { loading, action } = useLoadingDialog();
    const { makePostRequest } = usePost()



    // const MemoizedDateWiseData = useMemo(() => {DateWiseIntegration})


    // console.log('girraj',sheet2Date)

    const handleDateWiseData = useCallback((data) => {
        //    console.log('date Wise',data)
        setSheet1Data(JSON.parse(data.table_data))
        setSheet1Date(data.latest_dates)
    }, []);

    const handleMonthWiseData = useCallback((data) => {
        // console.log('Month Wise', data)
        ShortDate(data.latest_months, data.latest_year)
        setSheet2Data(JSON.parse(data.table_data))
    }, []);

    const ShortDate = (months, years) => {

        const result = [];

        for (let i = 0; i < Math.min(months.length, years.length); i++) {
            result.push({
                month: months[i],
                year: years[i]
            });
        }
        // console.log('result ', result)

        setSheet2Date(result)
    }

    const handleOemWiseData = useCallback((data) => {
        // console.log('Oem Wise Wise', data)
        setSheet3Data(JSON.parse(data.table_data))
        setSheet3Date([data.month, data.year])
        // setMonth(res.month)
        // setYear(res.year)
    }, []);

    const handleRangeWiseData = useCallback((data) => {
        // console.log('Range Wise', data)
        setSheet4Data(JSON.parse(data.table_data))
        setSheet4Date(data.date_range)
    }, []);

    // handleExport Range wise table in excel formet.........
    const

        handleExport = () => {

            const workbook = new ExcelJS.Workbook();
            const sheet1 = workbook.addWorksheet("Date Wise", { properties: { tabColor: { argb: 'B0EBB4' } } })
            const sheet2 = workbook.addWorksheet("Month Wise", { properties: { tabColor: { argb: 'AD88C6' } } })
            const sheet3 = workbook.addWorksheet("Monthly OEM Wise", { properties: { tabColor: { argb: 'A0DEFF' } } })
            const sheet4 = workbook.addWorksheet("Range Wise", { properties: { tabColor: { argb: '5AB2FF' } } })

            // sheet3.mergeCells('A1:S1');
            sheet1.mergeCells('A1:A2');
            sheet1.mergeCells('B1:AA1');
            sheet1.mergeCells('AB1:BI1');
            sheet1.mergeCells('BJ1:CP1');

            sheet1.getCell('A1').value = 'Circle';
            sheet1.getCell('B1').value = sheet1Date[0];
            sheet1.getCell('AB1').value = sheet1Date[1];
            sheet1.getCell('BJ1').value = sheet1Date[2];


            const headers = [
                'DE-GROW', 'MACRO', 'OTHER', 'RELOCATION', 'RET', 'ULS-HPSC', 'UPGRADE',
                'FEMTO', 'HT-INCREMENT', 'IBS', 'IDSC', 'ODSC', 'RECTIFICATION',
                'OPERATIONS', 'RRU UPGRADE', '5G BW UPGRADE', '5G RRU SWAP',
                '5G SECTOR ADDITION', '5G RELOCATION', 'TRAFFIC SHIFTING', 'RRU SWAP',
                'FR DATE', 'HOTO OFFERED 2G', 'HOTO ACCEPTED 2G',
                'HOTO OFFERED 4G', 'HOTO ACCEPTED 4G'
            ];

            // D1
            headers.forEach((h, i) => sheet1.getCell(2, i + 2).value = h);
            // D2
            headers.forEach((h, i) => sheet1.getCell(2, i + 28).value = h);
            // D3
            headers.forEach((h, i) => sheet1.getCell(2, i + 54).value = h);




            /// sheet 2 ///

            sheet2.mergeCells('A1:A2');
            sheet2.mergeCells('B1:AA1');
            sheet2.mergeCells('AB1:BI1');
            sheet2.mergeCells('BJ1:CP1');

            sheet2.getCell('A1').value = 'Circle';
            {
                sheet2Date?.forEach((item, index) => {
                    if (index < 3) {
                        sheet2.getCell(`${alphaBate[index]}1`).value =
                            `${monthNames[item.month]}-${item.year}`;
                    }
                });

            }
            // sheet2.getCell('B1').value = `${sheet1Date[0]}`;
            // sheet2.getCell('N1').value = `${sheet1Date[1]}`;
            // sheet2.getCell('Z1').value = `${sheet1Date[2]}`;

            const monthSubHeaders = [
                'DE-GROW', 'MACRO', 'OTHER', 'RELOCATION', 'RET', 'ULS-HPSC',
                'UPGRADE', 'FEMTO', 'HT-INCREMENT', 'IBS', 'IDSC', 'ODSC',
                'RECTIFICATION', 'OPERATIONS', 'RRU UPGRADE', '5G BW UPGRADE',
                '5G RRU SWAP', '5G SECTOR ADDITION', '5G RELOCATION',
                'TRAFFIC SHIFTING', 'RRU SWAP',
                'FR DATE',
                'HOTO OFFERED 2G',
                'HOTO ACCEPTED 2G',
                'HOTO OFFERED 4G',
                'HOTO ACCEPTED 4G'
            ];

            // M1
            monthSubHeaders.forEach((h, i) => {
                sheet2.getCell(2, i + 2).value = h;
            });

            // M2
            monthSubHeaders.forEach((h, i) => {
                sheet2.getCell(2, i + 28).value = h;
            });

            // M3
            monthSubHeaders.forEach((h, i) => {
                sheet2.getCell(2, i + 54).value = h;
            });


            //          SHEET 3

            sheet3.mergeCells('A1:F1');
            sheet3.getCell('A1').value = `${monthNames[sheet3Date[0]]}-${sheet3Date[1]}`;
            sheet3.getCell('A2').value = 'Circle';
            sheet3.getCell('B2').value = 'ERICSSON';
            sheet3.getCell('C2').value = 'HUAWEI';
            sheet3.getCell('D2').value = 'NOKIA';
            sheet3.getCell('E2').value = 'SAMSUNG';
            sheet3.getCell('F2').value = 'ZTE';

            //          SHEET 4
            sheet4.mergeCells('A1:A2');
            sheet4.mergeCells('B1:V1');

            sheet4.getCell('A1').value = 'Circle';
            sheet4.getCell('B1').value = `${sheet4Date[0]} to ${sheet4Date[1]}`;

            sheet4.getCell('B2').value = 'DE-GROW';
            sheet4.getCell('C2').value = 'MACRO';
            sheet4.getCell('D2').value = 'OTHER';
            sheet4.getCell('E2').value = 'RELOCATION';
            sheet4.getCell('F2').value = 'RET';
            sheet4.getCell('G2').value = 'ULS-HPSC';
            sheet4.getCell('H2').value = 'UPGRADE';
            sheet4.getCell('I2').value = 'FEMTO';
            sheet4.getCell('J2').value = 'HT-INCREMENT';
            sheet4.getCell('K2').value = 'IBS';
            sheet4.getCell('L2').value = 'IDSC';
            sheet4.getCell('M2').value = 'ODSC';
            sheet4.getCell('N2').value = 'RECTIFICATION';
            sheet4.getCell('O2').value = 'OPERATIONS';
            sheet4.getCell('P2').value = 'RRU UPGRADE';
            sheet4.getCell('Q2').value = '5G BW UPGRADE';
            sheet4.getCell('R2').value = '5G RRU SWAP';
            sheet4.getCell('S2').value = '5G SECTOR ADDITION';
            sheet4.getCell('T2').value = '5G RELOCATION';
            sheet4.getCell('U2').value = 'TRAFFIC SHIFTING';
            sheet4.getCell('V2').value = 'RRU SWAP';


            sheet1.columns = [
                { key: 'cir' },

                // D1
                ...[
                    'DE_GROW', 'MACRO', 'OTHERS', 'RELOCATION', 'RET', 'ULS_HPSC', 'UPGRADE',
                    'FEMTO', 'HT_INCREMENT', 'IBS', 'IDSC', 'ODSC', 'RECTIFICATION',
                    'OPERATIONS', 'RRU_UPGRADE', '5G_BW_UPGRADE', '5G_RRU_SWAP',
                    '5G_SECTOR_ADDITION', '5G_RELOCATION', 'TRAFFIC_SHIFTING', 'RRU_SWAP',
                    'FR_Date', 'HOTO_Offered_2g', 'HOTO_Accepted_2g',
                    'HOTO_Offered_4g', 'HOTO_Accepted_4g'
                ].map(k => ({ key: `D1_${k}` })),

                // D2
                ...[
                    'DE_GROW', 'MACRO', 'OTHERS', 'RELOCATION', 'RET', 'ULS_HPSC', 'UPGRADE',
                    'FEMTO', 'HT_INCREMENT', 'IBS', 'IDSC', 'ODSC', 'RECTIFICATION',
                    'OPERATIONS', 'RRU_UPGRADE', '5G_BW_UPGRADE', '5G_RRU_SWAP',
                    '5G_SECTOR_ADDITION', '5G_RELOCATION', 'TRAFFIC_SHIFTING', 'RRU_SWAP',
                    'FR_Date', 'HOTO_Offered_2g', 'HOTO_Accepted_2g',
                    'HOTO_Offered_4g', 'HOTO_Accepted_4g'
                ].map(k => ({ key: `D2_${k}` })),

                // D3
                ...[
                    'DE_GROW', 'MACRO', 'OTHERS', 'RELOCATION', 'RET', 'ULS_HPSC', 'UPGRADE',
                    'FEMTO', 'HT_INCREMENT', 'IBS', 'IDSC', 'ODSC', 'RECTIFICATION',
                    'OPERATIONS', 'RRU_UPGRADE', '5G_BW_UPGRADE', '5G_RRU_SWAP',
                    '5G_SECTOR_ADDITION', '5G_RELOCATION', 'TRAFFIC_SHIFTING', 'RRU_SWAP',
                    'FR_Date', 'HOTO_Offered_2g', 'HOTO_Accepted_2g',
                    'HOTO_Offered_4g', 'HOTO_Accepted_4g'
                ].map(k => ({ key: `D3_${k}` })),
            ];
            sheet1Data?.forEach(item => {
                sheet1.addRow({
                    cir: item.cir,
                    ...Object.fromEntries(
                        sheet1.columns
                            .map(c => c.key)
                            .filter(k => k !== 'cir')
                            .map(k => [k, Number(item?.[k] ?? 0)])
                    )
                });
            });

            sheet2.columns = [
                { key: 'cir' },

                // M1
                ...[
                    'DE_GROW', 'MACRO', 'OTHERS', 'RELOCATION', 'RET', 'ULS_HPSC',
                    'UPGRADE', 'FEMTO', 'HT_INCREMENT', 'IBS', 'IDSC', 'ODSC',
                    'RECTIFICATION', 'OPERATIONS', 'RRU_UPGRADE', '5G_BW_UPGRADE',
                    '5G_RRU_SWAP', '5G_SECTOR_ADDITION', '5G_RELOCATION',
                    'TRAFFIC_SHIFTING', 'RRU_SWAP',
                    'FR_Date', 'HOTO_Offered_2g', 'HOTO_Accepted_2g',
                    'HOTO_Offered_4g', 'HOTO_Accepted_4g'
                ].map(k => ({ key: `M1_${k}` })),

                // M2
                ...[
                    'DE_GROW', 'MACRO', 'OTHERS', 'RELOCATION', 'RET', 'ULS_HPSC',
                    'UPGRADE', 'FEMTO', 'HT_INCREMENT', 'IBS', 'IDSC', 'ODSC',
                    'RECTIFICATION', 'OPERATIONS', 'RRU_UPGRADE', '5G_BW_UPGRADE',
                    '5G_RRU_SWAP', '5G_SECTOR_ADDITION', '5G_RELOCATION',
                    'TRAFFIC_SHIFTING', 'RRU_SWAP',
                    'FR_Date', 'HOTO_Offered_2g', 'HOTO_Accepted_2g',
                    'HOTO_Offered_4g', 'HOTO_Accepted_4g'
                ].map(k => ({ key: `M2_${k}` })),

                // M3
                ...[
                    'DE_GROW', 'MACRO', 'OTHERS', 'RELOCATION', 'RET', 'ULS_HPSC',
                    'UPGRADE', 'FEMTO', 'HT_INCREMENT', 'IBS', 'IDSC', 'ODSC',
                    'RECTIFICATION', 'OPERATIONS', 'RRU_UPGRADE', '5G_BW_UPGRADE',
                    '5G_RRU_SWAP', '5G_SECTOR_ADDITION', '5G_RELOCATION',
                    'TRAFFIC_SHIFTING', 'RRU_SWAP',
                    'FR_Date', 'HOTO_Offered_2g', 'HOTO_Accepted_2g',
                    'HOTO_Offered_4g', 'HOTO_Accepted_4g'
                ].map(k => ({ key: `M3_${k}` })),
            ];

            sheet2Data?.forEach(item => {
                sheet2.addRow({
                    cir: item?.cir,
                    ...Object.fromEntries(
                        sheet2.columns
                            .map(c => c.key)
                            .filter(k => k !== 'cir')
                            .map(k => [k, Number(item?.[k] ?? 0)])
                    )
                });
            });

            sheet3.columns = [
                { key: 'cir' },
                { key: 'ERICSSON' },
                { key: 'HUAWEI' },
                { key: 'NOKIA' },
                { key: 'SAMSUNG' },
                { key: 'ZTE' },
            ]
            sheet3Data?.map(item => {
                sheet3.addRow({
                    cir: item?.cir,
                    ERICSSON: Number(item?.ERICSSON),
                    HUAWEI: Number(item?.HUAWEI),
                    NOKIA: Number(item?.NOKIA),
                    SAMSUNG: Number(item?.SAMSUNG),
                    ZTE: Number(item?.ZTE)
                })
            })

            sheet4.columns = [
                { key: 'cir' },
                { key: 'D1_DE_GROW' },
                { key: 'D1_MACRO' },
                { key: 'D1_OTHERS' },
                { key: 'D1_RELOCATION' },
                { key: 'D1_RET' },
                { key: 'D1_ULS_HPSC' },
                { key: 'D1_UPGRADE' },
                { key: 'D1_FEMTO' },
                { key: 'D1_HT_INCREMENT' },
                { key: 'D1_IBS' },
                { key: 'D1_IDSC' },
                { key: 'D1_ODSC' },
                { key: 'D1_RECTIFICATION' },
                { key: 'D1_OPERATIONS' },
                { key: 'D1_RRU_UPGRADE' },
                { key: 'D1_5G_BW_UPGRADE' },
                { key: 'D1_5G_RRU_SWAP' },
                { key: 'D1_5G_SECTOR_ADDITION' },
                { key: 'D1_5G_RELOCATION' },
                { key: 'D1_TRAFFIC_SHIFTING' },//RAFFIC_SHIFTING
                { key: 'D1_RRU_SWAP' },

            ]
            sheet4Data?.map(item => {
                sheet4.addRow({
                    cir: item?.cir,
                    D1_DE_GROW: Number(item?.D1_DE_GROW),
                    D1_MACRO: Number(item?.D1_MACRO),
                    D1_OTHERS: Number(item?.D1_OTHERS),
                    D1_RELOCATION: Number(item?.D1_RELOCATION),
                    D1_RET: Number(item?.D1_RET),
                    D1_ULS_HPSC: Number(item?.D1_ULS_HPSC),
                    D1_UPGRADE: Number(item?.D1_UPGRADE),
                    D1_FEMTO: Number(item?.D1_FEMTO),
                    D1_HT_INCREMENT: Number(item?.D1_HT_INCREMENT),
                    D1_IBS: Number(item?.D1_IBS),
                    D1_IDSC: Number(item?.D1_IDSC),
                    D1_ODSC: Number(item?.D1_ODSC),
                    D1_RECTIFICATION: Number(item?.D1_RECTIFICATION),
                    D1_OPERATIONS: Number(item?.D1_OPERATIONS),
                    D1_RRU_UPGRADE: Number(item?.D1_RRU_UPGRADE),
                    D1_5G_BW_UPGRADE: Number(item?.D1_5G_BW_UPGRADE),
                    D1_5G_RRU_SWAP: Number(item?.D1_5G_RRU_SWAP),
                    D1_5G_SECTOR_ADDITION: Number(item?.D1_5G_SECTOR_ADDITION),
                    D1_5G_RELOCATION: Number(item?.D1_5G_RELOCATION),
                    D1_TRAFFIC_SHIFTING: Number(item?.D1_TRAFFIC_SHIFTING),
                    D1_RRU_SWAP: Number(item?.D1_RRU_SWAP),

                })
            })



            ///__________ STYLING IN EXCEL TABLE ______________ ///
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
                            size: 12,
                        }
                        cell.views = [{ state: 'frozen', ySplit: 1 }]
                    }
                })
            })

            ///__________  Sheet 2 STYLING IN EXCEL TABLE ______________ ///
            sheet2.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                const rows = sheet2.getColumn(1);
                const rowsCount = rows['_worksheet']['_rows'].length;
                row.eachCell({ includeEmpty: true }, (cell) => {
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
                            size: 12,
                        }
                        cell.views = [{ state: 'frozen', ySplit: 1 }]
                    }
                })
            })

            ///__________  Sheet 3 STYLING IN EXCEL TABLE ______________ ///
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
                            size: 12,
                        }
                        cell.views = [{ state: 'frozen', ySplit: 1 }]
                    }
                })
            })

            ///__________  Sheet 4 STYLING IN EXCEL TABLE ______________ ///
            sheet4.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                const rows = sheet4.getColumn(1);
                const rowsCount = rows['_worksheet']['_rows'].length;
                row.eachCell({ includeEmpty: true }, (cell) => {
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
                anchor.download = "VI_Integration_Tracker.xlsx";
                anchor.click();
                window.URL.revokeObjectURL(url);
            })

        }

    const fetchDashboardData = async () => {
        const responce = await makeGetRequest("ix_tracker_vi/overall-record-summary/")
        if (responce) {
            setMdashboard(JSON.parse(responce.table_data))
            // console.log('master dashboard', JSON.parse(responce.table_data))
        }
    }

    const Dashboard = useCallback(({ data, color }) => {
        // console.log('check data' , data)
        function convertDate(dateStr) {
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
        return (
            <Box sx={{ height: 'auto', width: '28vh', cursor: 'pointer', padding: 1.5, borderRadius: 1.5, boxShadow: " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px", backgroundColor: color, textAlign: 'center' }}
                onClick={() => { HandleDashboard(data.OEM) }}
                title={data.OEM}
            >
                <Box sx={{ fontWeight: 600, fontSize: '16px', color: "black", textAlign: 'left' }}>{data.OEM}</Box>
                <Box sx={{ fontWeight: 600, fontSize: '24px', color: "black", fontFamily: 'cursive' }}><CountUp end={data.record_count} duration={4} /> </Box>
                <Box sx={{ color: "black", textAlign: 'left' }}><span style={{ fontWeight: 600, fontSize: '14px' }}>From-</span>{convertDate(data.from_integration_date)}</Box>
                <Box sx={{ color: "black", textAlign: 'left' }}> <span style={{ fontWeight: 600 }}>To-</span>{convertDate(data.to_integration_date)}</Box>
            </Box>
        );
    }, []);

    const HandleDashboard = async (oem) => {
        // console.log('ssssss',oem)
        action(true)
        var formData = new FormData();
        formData.append("oem", oem);

        const responce = await makePostRequest('ix_tracker_vi/oem_wise_integration_data/', formData)
        if (responce) {
            // console.log('responce', responce)
            // setMainDataT2(responce)
            action(false)
            // localStorage.removeItem("integration_final_tracker");
            // localStorage.setItem("integration_final_tracker", JSON.stringify(responce.table_data));
            dispatch({ type: 'IX_TRACKER', payload: { responce } })
            navigate(`/tools/ix_tools/vi_integration/dashboard/total_count/${oem}`)

        }
        else {
            action(false)
        }
    }



    useEffect(() => {
        fetchDashboardData();
    }, [])




    return (
        <>
            <div >
                <div style={{ margin: 5, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/ix_tools') }}>IX Tools</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/ix_tools/vi_integration') }}>VI Tracker</Link>
                        <Typography color='text.primary'>Dashboard</Typography>
                    </Breadcrumbs>
                </div>
                <div style={{ height: 'auto', width: '100%', margin: '5px 0px', border: '1px solid black', borderRadius: '10px', padding: '2px', display: 'flex' }}>
                    <Grid container spacing={1}>
                        <Grid item xs={10} style={{ display: "flex" }}>
                            <Box >
                                {/* <Tooltip title="Filter list">
                            <IconButton onClick={() => { setOpen(true) }}>
                                <FilterAltIcon fontSize='large' color='primary' />
                            </IconButton>
                        </Tooltip> */}
                            </Box>

                        </Grid>
                        <Grid item xs={2}>
                            <Box style={{ float: 'right' }}>
                                <Tooltip title="Export Dashboard">
                                    <IconButton onClick={() => { handleExport(); }}>
                                        <DownloadIcon fontSize='medium' color='primary' />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    </Grid>

                </div>
                <div style={{ padding: '5px', display: 'flex', justifyContent: 'space-evenly', flexWrap: "wrap", flexDirection: 'row', gap: 10 }}>
                    {mdashboard?.map((item, index) => index < 5 && (
                        <Dashboard data={item} color={colorType[index]} key={index} />
                    ))}
                </div>
                <MemoDateWiseIntegration onData={handleDateWiseData} />
                <MemoRangeWiseDashboard onData={handleRangeWiseData} />
                <MemoMonthWiseIntegration onData={handleMonthWiseData} />
                <MemoOemWiseIntegration onData={handleOemWiseData} />
            </div>
            {loading}
        </>
    )
}



export default FinalDashboard