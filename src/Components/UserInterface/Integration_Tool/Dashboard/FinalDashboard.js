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
const alphaBate = ['B', 's', 'AI']

const colorType = ['#B0EBB4', '#A0DEFF', '#FF9F66', '#ECB176', '#CDE8E5']

const FinalDashboard = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();
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


    console.log('girraj',sheet2Date)

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
    const handleExport = () => {

        const workbook = new ExcelJS.Workbook();
        const sheet1 = workbook.addWorksheet("Date Wise", { properties: { tabColor: { argb: 'B0EBB4' } } })
        const sheet2 = workbook.addWorksheet("Month Wise", { properties: { tabColor: { argb: 'AD88C6' } } })
        const sheet3 = workbook.addWorksheet("Monthly OEM Wise", { properties: { tabColor: { argb: 'A0DEFF' } } })
        const sheet4 = workbook.addWorksheet("Range Wise", { properties: { tabColor: { argb: '5AB2FF' } } })

        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';



        // sheet3.mergeCells('A1:S1');
        sheet1.mergeCells('A1:A2');
        sheet1.mergeCells('B1:R1');
        sheet1.mergeCells('S1:AI1');
        sheet1.mergeCells('AJ1:AZ1');
        
        sheet1.getCell('A1').value = 'Circle';
        sheet1.getCell('B1').value = `${sheet1Date[0]}`;
        sheet1.getCell('S1').value = `${sheet1Date[1]}`;
        sheet1.getCell('AJ1').value = `${sheet1Date[2]}`;
        
        sheet1.getCell('B2').value = 'DE-GROW';
        sheet1.getCell('C2').value = 'MACRO';
        sheet1.getCell('D2').value = 'OTHER';
        sheet1.getCell('E2').value = 'RELOCATION';
        sheet1.getCell('F2').value = 'RET';
        sheet1.getCell('G2').value = 'ULS-HPSC';
        sheet1.getCell('H2').value = 'UPGRADE';
        sheet1.getCell('I2').value = 'FEMTO';
        sheet1.getCell('J2').value = 'HT-INCREMENT';
        sheet1.getCell('K2').value = 'IBS';
        sheet1.getCell('L2').value = 'IDSC';
        sheet1.getCell('M2').value = 'ODSC';
        sheet1.getCell('N2').value = 'RECTIFICATION';
        sheet1.getCell('O2').value = 'OPERATIONS';
        sheet1.getCell('P2').value = '5G SECTOR ADDITION';
        sheet1.getCell('Q2').value = '5G RELOCATION';
        sheet1.getCell('R2').value = 'TRAFFIC SHIFTING';
        
        sheet1.getCell('S2').value = 'DE-GROW';
        sheet1.getCell('T2').value = 'MACRO';
        sheet1.getCell('U2').value = 'OTHER';
        sheet1.getCell('V2').value = 'RELOCATION';
        sheet1.getCell('W2').value = 'RET';
        sheet1.getCell('X2').value = 'ULS-HPSC';
        sheet1.getCell('Y2').value = 'UPGRADE';
        sheet1.getCell('Z2').value = 'FEMTO';
        sheet1.getCell('AA2').value = 'HT-INCREMENT';
        sheet1.getCell('AB2').value = 'IBS';
        sheet1.getCell('AC2').value = 'IDSC';
        sheet1.getCell('AD2').value = 'ODSC';
        sheet1.getCell('AE2').value = 'RECTIFICATION';
        sheet1.getCell('AF2').value = 'OPERATIONS';
        sheet1.getCell('AG2').value = '5G SECTOR ADDITION';
        sheet1.getCell('AH2').value = '5G RELOCATION';
        sheet1.getCell('AI2').value = 'TRAFFIC SHIFTING';
        
        sheet1.getCell('AJ2').value = 'DE-GROW';
        sheet1.getCell('AK2').value = 'MACRO';
        sheet1.getCell('AL2').value = 'OTHER';
        sheet1.getCell('AM2').value = 'RELOCATION';
        sheet1.getCell('AN2').value = 'RET';
        sheet1.getCell('AO2').value = 'ULS-HPSC';
        sheet1.getCell('AP2').value = 'UPGRADE';
        sheet1.getCell('AQ2').value = 'FEMTO';
        sheet1.getCell('AR2').value = 'HT-INCREMENT';
        sheet1.getCell('AS2').value = 'IBS';
        sheet1.getCell('AT2').value = 'IDSC';
        sheet1.getCell('AU2').value = 'ODSC';
        sheet1.getCell('AV2').value = 'RECTIFICATION';
        sheet1.getCell('AW2').value = 'OPERATIONS';
        sheet1.getCell('AX2').value = '5G SECTOR ADDITION';
        sheet1.getCell('AY2').value = '5G RELOCATION';
        sheet1.getCell('AZ2').value = 'TRAFFIC SHIFTING';
        

        /// sheet 2 ///

        sheet2.mergeCells('A1:A2');
        sheet2.mergeCells('B1:R1');
        sheet2.mergeCells('S1:AH1');
        sheet2.mergeCells('AI1:AX1');

        sheet2.getCell('A1').value = 'Circle';
        {
            sheet2Date?.map((item, index) => {
                if (index < 3) {
                    const row = sheet2.getRow(1); // Ensure the row exists
                    const column = `${alphaBate[index]}1`; // Define the cell reference
                    sheet2.getCell(column).value = `${monthNames[item.month]}-${item.year}`;
                }

            })
        }
        // sheet2.getCell('B1').value = `${sheet1Date[0]}`;
        // sheet2.getCell('N1').value = `${sheet1Date[1]}`;
        // sheet2.getCell('Z1').value = `${sheet1Date[2]}`;

        sheet2.getCell('B2').value = 'DE-GROW';
        sheet2.getCell('C2').value = 'MACRO';
        sheet2.getCell('D2').value = 'OTHER';
        sheet2.getCell('E2').value = 'RELOCATION';
        sheet2.getCell('F2').value = 'RET';
        sheet2.getCell('G2').value = 'ULS-HPSC';
        sheet2.getCell('H2').value = 'UPGRADE';
        sheet2.getCell('I2').value = 'FEMTO';
        sheet2.getCell('J2').value = 'HT-INCREMENT';
        sheet2.getCell('K2').value = 'IBS';
        sheet2.getCell('L2').value = 'IDSC';
        sheet2.getCell('M2').value = 'ODSC';
        sheet2.getCell('N2').value = 'RECTIFICATION';
        sheet2.getCell('O2').value = 'OPERATIONS';
        sheet2.getCell('P2').value = '5G SECTOR ADDITION';
        sheet2.getCell('Q2').value = '5G RELOCATION';
        sheet2.getCell('R2').value = 'TRAFFIC SHIFTING';
        
        sheet2.getCell('S2').value = 'DE-GROW';
        sheet2.getCell('T2').value = 'MACRO';
        sheet2.getCell('U2').value = 'OTHER';
        sheet2.getCell('V2').value = 'RELOCATION';
        sheet2.getCell('W2').value = 'RET';
        sheet2.getCell('X2').value = 'ULS-HPSC';
        sheet2.getCell('Y2').value = 'UPGRADE';
        sheet2.getCell('Z2').value = 'FEMTO';
        sheet2.getCell('AA2').value = 'HT-INCREMENT';
        sheet2.getCell('AB2').value = 'IBS';
        sheet2.getCell('AC2').value = 'IDSC';
        sheet2.getCell('AD2').value = 'ODSC';
        sheet2.getCell('AE2').value = 'RECTIFICATION';
        sheet2.getCell('AF2').value = 'OPERATIONS';
        sheet2.getCell('AG2').value = '5G SECTOR ADDITION';
        sheet2.getCell('AH2').value = '5G RELOCATION';
        sheet2.getCell('AI2').value = 'TRAFFIC SHIFTING';
        
        sheet2.getCell('AJ2').value = 'DE-GROW';
        sheet2.getCell('AK2').value = 'MACRO';
        sheet2.getCell('AL2').value = 'OTHER';
        sheet2.getCell('AM2').value = 'RELOCATION';
        sheet2.getCell('AN2').value = 'RET';
        sheet2.getCell('AO2').value = 'ULS-HPSC';
        sheet2.getCell('AP2').value = 'UPGRADE';
        sheet2.getCell('AQ2').value = 'FEMTO';
        sheet2.getCell('AR2').value = 'HT-INCREMENT';
        sheet2.getCell('AS2').value = 'IBS';
        sheet2.getCell('AT2').value = 'IDSC';
        sheet2.getCell('AU2').value = 'ODSC';
        sheet2.getCell('AV2').value = 'RECTIFICATION';
        sheet2.getCell('AW2').value = 'OPERATIONS';
        sheet2.getCell('AX2').value = '5G SECTOR ADDITION';
        sheet2.getCell('AY2').value = '5G RELOCATION';
        sheet2.getCell('AZ2').value = 'TRAFFIC SHIFTING';

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
        sheet4.mergeCells('B1:Q1');

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
        sheet4.getCell('P2').value = '5G SECTOR ADDITION';
        sheet4.getCell('Q2').value = '5G RELOCATION';
        sheet4.getCell('R2').value = 'TRAFFIC SHIFTING';


        sheet1.columns = [
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
            { key: 'D1_5G_SECTOR_ADDITION' },
            { key: 'D1_5G_RELOCATION' },
            { key: 'D1_TRAFFIC_SHIFTING' },//D1_TRAFFIC_SHIFTING

            { key: 'D2_DE_GROW' },
            { key: 'D2_MACRO' },
            { key: 'D2_OTHERS' },
            { key: 'D2_RELOCATION' },
            { key: 'D2_RET' },
            { key: 'D2_ULS_HPSC' },
            { key: 'D2_UPGRADE' },
            { key: 'D2_FEMTO' },
            { key: 'D2_HT_INCREMENT' },
            { key: 'D2_IBS' },
            { key: 'D2_IDSC' },
            { key: 'D2_ODSC' },
            { key: 'D2_RECTIFICATION' },
            { key: 'D2_OPERATIONS' },
            { key: 'D2_5G_SECTOR_ADDITION' },
            { key: 'D2_5G_RELOCATION' },
            { key: 'D2_TRAFFIC_SHIFTING' },

            { key: 'D3_DE_GROW' },
            { key: 'D3_MACRO' },
            { key: 'D3_OTHERS' },
            { key: 'D3_RELOCATION' },
            { key: 'D3_RET' },
            { key: 'D3_ULS_HPSC' },
            { key: 'D3_UPGRADE' },
            { key: 'D3_FEMTO' },
            { key: 'D3_HT_INCREMENT' },
            { key: 'D3_IBS' },
            { key: 'D3_IDSC' },
            { key: 'D3_ODSC' },
            { key: 'D3_RECTIFICATION' },
            { key: 'D3_OPERATIONS' },
            { key: 'D3_5G_SECTOR_ADDITION' },
            { key: 'D3_5G_RELOCATION' },
            { key: 'D3_TRAFFIC_SHIFTING' },

        ]
        sheet1Data?.map(item => {
            sheet1.addRow({
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
                D1_5G_SECTOR_ADDITION: Number(item?.D1_5G_SECTOR_ADDITION),
                D1_5G_RELOCATION: Number(item?.D1_5G_RELOCATION),
                D1_TRAFFIC_SHIFTING: Number(item?.D1_TRAFFIC_SHIFTING),

                D2_DE_GROW: Number(item?.D2_DE_GROW),
                D2_MACRO: Number(item?.D2_MACRO),
                D2_OTHERS: Number(item?.D2_OTHERS),
                D2_RELOCATION: Number(item?.D2_RELOCATION),
                D2_RET: Number(item?.D2_RET),
                D2_ULS_HPSC: Number(item?.D2_ULS_HPSC),
                D2_UPGRADE: Number(item?.D2_UPGRADE),
                D2_FEMTO: Number(item?.D2_FEMTO),
                D2_HT_INCREMENT: Number(item?.D2_HT_INCREMENT),
                D2_IBS: Number(item?.D2_IBS),
                D2_IDSC: Number(item?.D2_IDSC),
                D2_ODSC: Number(item?.D2_ODSC),
                D2_RECTIFICATION: Number(item?.D2_RECTIFICATION),
                D2_OPERATIONS: Number(item?.D2_OPERATIONS),
                D2_5G_SECTOR_ADDITION: Number(item?.D2_5G_SECTOR_ADDITION),
                D2_5G_RELOCATION: Number(item?.D2_5G_RELOCATION),
                D2_TRAFFIC_SHIFTING: Number(item?.D2_TRAFFIC_SHIFTING),

                D3_DE_GROW: Number(item?.D3_DE_GROW),
                D3_MACRO: Number(item?.D3_MACRO),
                D3_OTHERS: Number(item?.D3_OTHERS),
                D3_RELOCATION: Number(item?.D3_RELOCATION),
                D3_RET: Number(item?.D3_RET),
                D3_ULS_HPSC: Number(item?.D3_ULS_HPSC),
                D3_UPGRADE: Number(item?.D3_UPGRADE),
                D3_FEMTO: Number(item?.D3_FEMTO),
                D3_HT_INCREMENT: Number(item?.D3_HT_INCREMENT),
                D3_IBS: Number(item?.D3_IBS),
                D3_IDSC: Number(item?.D3_IDSC),
                D3_ODSC: Number(item?.D3_ODSC),
                D3_RECTIFICATION: Number(item?.D3_RECTIFICATION),
                D3_OPREATIONS: Number(item?.D3_OPREATIONS),
                D3_5G_SECTOR_ADDITION: Number(item?.D3_5G_SECTOR_ADDITION),
                D3_5G_RELOCATION: Number(item?.D3_5G_RELOCATION),
                D3_TRAFFIC_SHIFTING: Number(item?.D3_TRAFFIC_SHIFTING),


            })
        })



        sheet2.columns = [
            { key: 'cir' },
            { key: 'M1_DE_GROW' },
            { key: 'M1_MACRO' },
            { key: 'M1_OTHERS' },
            { key: 'M1_RELOCATION' },
            { key: 'M1_RET' },
            { key: 'M1_ULS_HPSC' },
            { key: 'M1_UPGRADE' },
            { key: 'M1_FEMTO' },
            { key: 'M1_HT_INCREMENT' },
            { key: 'M1_IBS' },
            { key: 'M1_IDSC' },
            { key: 'M1_ODSC' },
            { key: 'M1_RECTIFICATION' },
            { key: 'M1_OPERATIONS' },
            { key: 'M1_5G_SECTOR_ADDITION' },
            { key: 'M1_5G_RELOCATION' },
            { key: 'M1_TRAFFIC_SHIFTING' },

            { key: 'M2_DE_GROW' },
            { key: 'M2_MACRO' },
            { key: 'M2_OTHERS' },
            { key: 'M2_RELOCATION' },
            { key: 'M2_RET' },
            { key: 'M2_ULS_HPSC' },
            { key: 'M2_UPGRADE' },
            { key: 'M2_FEMTO' },
            { key: 'M2_HT_INCREMENT' },
            { key: 'M2_IBS' },
            { key: 'M2_IDSC' },
            { key: 'M2_ODSC' },
            { key: 'M2_RECTIFICATION' },
            { key: 'M2_OPERATIONS' },
            { key: 'M2_5G_SECTOR_ADDITION' },
            { key: 'M2_5G_RELOCATION' },
            { key: 'M2_TRAFFIC_SHIFTING' },

            { key: 'M3_DE_GROW' },
            { key: 'M3_MACRO' },
            { key: 'M3_OTHERS' },
            { key: 'M3_RELOCATION' },
            { key: 'M3_RET' },
            { key: 'M3_ULS_HPSC' },
            { key: 'M3_UPGRADE' },
            { key: 'M3_FEMTO' },
            { key: 'M3_HT_INCREMENT' },
            { key: 'M3_IBS' },
            { key: 'M3_IDSC' },
            { key: 'M3_ODSC' },
            { key: 'M3_RECTIFICATION' },
            { key: 'M3_OPERATIONS' },
            { key: 'M3_5G_SECTOR_ADDITION' },
            { key: 'M3_5G_RELOCATION' },
            { key: 'M3_TRAFFIC_SHIFTING' },

        ]
        sheet2Data?.map(item => {
            sheet2.addRow({
                cir: item?.cir,
                M1_DE_GROW: Number(item?.M1_DE_GROW),
                M1_MACRO: Number(item?.M1_MACRO),
                M1_OTHERS: Number(item?.M1_OTHERS),
                M1_RELOCATION: Number(item?.M1_RELOCATION),
                M1_RET: Number(item?.M1_RET),
                M1_ULS_HPSC: Number(item?.M1_ULS_HPSC),
                M1_UPGRADE: Number(item?.M1_UPGRADE),
                M1_FEMTO: Number(item?.M1_FEMTO),
                M1_HT_INCREMENT: Number(item?.M1_HT_INCREMENT),
                M1_IBS: Number(item?.M1_IBS),
                M1_IDSC: Number(item?.M1_IDSC),
                M1_ODSC: Number(item?.M1_ODSC),
                M1_RECTIFICATION: Number(item?.M1_RECTIFICATION),
                M1_OPERATIONS: Number(item?.M1_OPERATIONS),
                M1_5G_SECTOR_ADDITION: Number(item?.M1_5G_SECTOR_ADDITION),
                M1_5G_RELOCATION: Number(item?.M1_5G_RELOCATION),
                M1_TRAFFIC_SHIFTING: Number(item?.M1_TRAFFIC_SHIFTING),

                M2_DE_GROW: Number(item?.M2_DE_GROW),
                M2_MACRO: Number(item?.M2_MACRO),
                M2_OTHERS: Number(item?.M2_OTHERS),
                M2_RELOCATION: Number(item?.M2_RELOCATION),
                M2_RET: Number(item?.M2_RET),
                M2_ULS_HPSC: Number(item?.M2_ULS_HPSC),
                M2_UPGRADE: Number(item?.M2_UPGRADE),
                M2_FEMTO: Number(item?.M2_FEMTO),
                M2_HT_INCREMENT: Number(item?.M2_HT_INCREMENT),
                M2_IBS: Number(item?.M2_IBS),
                M2_IDSC: Number(item?.M2_IDSC),
                M2_ODSC: Number(item?.M2_ODSC),
                M2_RECTIFICATION: Number(item?.M2_RECTIFICATION),
                M2_OPERATIONS: Number(item?.M2_OPERATIONS),
                M2_5G_SECTOR_ADDITION: Number(item?.M2_5G_SECTOR_ADDITION),
                M2_5G_RELOCATION: Number(item?.M2_5G_RELOCATION),
                M2_TRAFFIC_SHIFTING: Number(item?.M2_TRAFFIC_SHIFTING),

                M3_DE_GROW: Number(item?.M3_DE_GROW),
                M3_MACRO: Number(item?.M3_MACRO),
                M3_OTHERS: Number(item?.M3_OTHERS),
                M3_RELOCATION: Number(item?.M3_RELOCATION),
                M3_RET: Number(item?.M3_RET),
                M3_ULS_HPSC: Number(item?.M3_ULS_HPSC),
                M3_UPGRADE: Number(item?.M3_UPGRADE),
                M3_FEMTO: Number(item?.M3_FEMTO),
                M3_HT_INCREMENT: Number(item?.M3_HT_INCREMENT),
                M3_IBS: Number(item?.M3_IBS),
                M3_IDSC: Number(item?.M3_IDSC),
                M3_ODSC: Number(item?.M3_ODSC),
                M3_RECTIFICATION: Number(item?.M3_RECTIFICATION),
                M3_OPERATIONS: Number(item?.M3_OPERATIONS),
                M3_5G_SECTOR_ADDITION: Number(item?.M3_5G_SECTOR_ADDITION),
                M3_5G_RELOCATION: Number(item?.M3_5G_SECTOR_ADDITION),
                M3_TRAFFIC_SHIFTING: Number(item?.M3_TRAFFIC_SHIFTING),
            })
        })

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
            { key: 'D1_5G_SECTOR_ADDITION' },
            { key: 'D1_5G_RELOCATION' },//D1_TRAFFIC_SHIFTING
            { key: 'D1_TRAFFIC_SHIFTING' },//D1_TRAFFIC_SHIFTING

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
                D1_5G_SECTOR_ADDITION: Number(item?.D1_5G_SECTOR_ADDITION),
                D1_5G_RELOCATION: Number(item?.D1_5G_RELOCATION),
                D1_TRAFFIC_SHIFTING: Number(item?.D1_TRAFFIC_SHIFTING),

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
            anchor.download = "Integration_Tracker.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }

    const fetchDashboardData = async () => {
        const responce = await makeGetRequest("IntegrationTracker/overall-record-summary/")
        if (responce) {
            setMdashboard(JSON.parse(responce.table_data))
            // console.log('master dashboard'  ,  JSON.parse(responce.table_data) )
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
            <Box sx={{ height: 'auto', width: '32vh',cursor:'pointer', padding: 1.5, borderRadius: 1.5, boxShadow: " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px", backgroundColor: color, textAlign: 'center' }}
                     onClick={()=>{HandleDashboard(data.OEM)}}
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
            console.log('ssssss',oem)
            action(true)
            var formData = new FormData();
            formData.append("oem", oem);
       
            const responce = await makePostRequest('IntegrationTracker/oem_wise_integration_data/', formData)
            if (responce) {
                // console.log('responce', responce)
                // setMainDataT2(responce)
                action(false)
                // localStorage.removeItem("integration_final_tracker");
                // localStorage.setItem("integration_final_tracker", JSON.stringify(responce.table_data));
                dispatch({ type: 'IX_TRACKER', payload: {responce} })
                navigate(`/tools/Integration/dashboard/total_count/${oem}`)
                // console.log('response data in huawia site id' , response)
                // window.open(`${window.location.href}/${oem}` , "_blank")
                
                // setOpen(true)
                // console.log('dfdiufhsdiuhf', responce)
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
                        <Link underline="hover" href='/tools'>Tools</Link>
                        <Link underline="hover" href='/tools/Integration'>Integration</Link>
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
                <div style={{ padding: '5px', display: 'flex', justifyContent: 'space-evenly', flexWrap: "wrap", flexDirection: 'row', gap: 20 }}>
                    {mdashboard?.map((item, index) => index < 5 && (
                        <Dashboard data={item} color={colorType[index]}  key={index} />
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