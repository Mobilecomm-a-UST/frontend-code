import React, { useState, useEffect, useRef } from 'react';
import { Box} from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import * as ExcelJS from 'exceljs'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useGet } from '../../../Hooks/GetApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useQuery } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import _ from 'lodash';
import {ServerURL} from '../../../services/FetchNodeServices'


const Dashboard4G = () => {
    const scrollableContainerRef = useRef(null);
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const { makeGetRequest } = useGet()
    const { loading, action } = useLoadingDialog();
    const [arrDate, setArrDate] = useState([1, 2, 3, 4, 5, 6, 7, 8])
    const [mainData, setMainData] = useState([])
    const [scrollNo, setScrollNo] = useState(50)
    const [fileData, setFileData] = useState()
    var link = `${ServerURL}${fileData}`;



    const { data, isFetching } = useQuery({
        queryKey: ['zero_RNA_4G_payload'],
        queryFn: async () => {
            action(isFetching)
            const res = await makeGetRequest("Zero_Count_Rna_Payload_Tool/kpi_trend_4g_api");
            if (res) {
                action(false)
                setFileData(res.Download_Link)
                return res;
            }
        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })


    // console.log('res', data)

    const fetchedQueryData = () => {
        // setMainData(data.data)
        // setArrDate(data.dates)
    }

    const getCircleName = (name) => {
        let match = name.match(/Sams/);
        let match1 = name.match(/(?:@Nokia-)([A-Z0-9]+)-/);

        // console.log('get circle data' , match1?match1[1].replace(/\d/g, ''):'')
        if (match) {
            return (name.split(',')[1].split('_')[0])
        }
        else if (match1) {
            return (match1[1].replace(/\d/g, ''))
        }
        else {

            return (name.split('_')[0])
        }
    }



    // handleExport Range wise table in excel formet.........
    const handleExport = async () => {

        // action(true)

        const workbook = new ExcelJS.Workbook();
        const sheet3 = workbook.addWorksheet("4G Dashboard", { properties: { tabColor: { argb: 'f1948a' } } })

        // sheet3.mergeCells('A1:A2');
        // sheet3.mergeCells('B1:B2');
        // sheet3.mergeCells('C1:C2');
        // sheet3.mergeCells('D1:D2');
        // sheet3.mergeCells('E1:E2');
        // sheet3.mergeCells('F1:F2');
        // sheet3.mergeCells('G1:G2');
        sheet3.mergeCells('H1:Q1');
        sheet3.mergeCells('R1:AA1');
        sheet3.mergeCells('AB1:AK1');
        sheet3.mergeCells('AL1:AU1');
        sheet3.mergeCells('AV1:BE1');
        sheet3.mergeCells('BF1:BO1');
        sheet3.mergeCells('BP1:BY1');
        sheet3.mergeCells('BZ1:CI1');
        sheet3.mergeCells('CJ1:CS1');
        sheet3.mergeCells('CT1:DC1');
        sheet3.mergeCells('DD1:DM1');
        sheet3.mergeCells('DN1:DW1');
        sheet3.mergeCells('DX1:EG1');
        sheet3.mergeCells('EH1:EQ1');
        sheet3.mergeCells('ER1:FA1');
        sheet3.mergeCells('FB1:FK1');
        sheet3.mergeCells('FL1:FU1');
        sheet3.mergeCells('FV1:GE1');
        sheet3.mergeCells('GF1:GO1');
        sheet3.mergeCells('GP1:GY1');
        sheet3.mergeCells('GZ1:HI1');

        sheet3.getCell('A2').value = 'Circle';
        sheet3.getCell('B2').value = 'Cell Name';
        sheet3.getCell('C2').value = 'Site ID';
        sheet3.getCell('D2').value = 'OEM';
        sheet3.getCell('E2').value = 'MS1 Date';
        sheet3.getCell('F2').value = 'Project';
        sheet3.getCell('G2').value = 'Technology';
        sheet3.getCell('H1').value = 'MV 4G Data Volume GB';
        sheet3.getCell('R1').value = 'MV Radio NW Availability';
        sheet3.getCell('AB1').value = 'MV VoLTE raffic';
        sheet3.getCell('AL1').value = 'MV DL User Throughtput Kbps';
        sheet3.getCell('AV1').value = 'MV EUTRAN Average CQI';
        sheet3.getCell('BF1').value = 'UL RSSI';
        sheet3.getCell('BP1').value = 'MV Average Number Of Used DL PRBs';
        sheet3.getCell('BZ1').value = 'MV RRC Setup Success Rate';
        sheet3.getCell('CJ1').value = 'MV ERAB Setup Success Rate';
        sheet3.getCell('CT1').value = 'MV PS Drop Call Rate';
        sheet3.getCell('DD1').value = 'MV Max Connecteda User';
        sheet3.getCell('DN1').value = 'MV PUCCH SINR';
        sheet3.getCell('DX1').value = 'MV Average UE_Distance KM';
        sheet3.getCell('EH1').value = 'MV PS handover success rate LTE INTER SYSTEM';
        sheet3.getCell('ER1').value = 'MV PS handover success rate LTE INTRA SYSTEM';
        sheet3.getCell('FB1').value = 'UL_RSSI_Nokia_RSSI_SINR';
        sheet3.getCell('FL1').value = 'MV_VoLTE_DCR';
        sheet3.getCell('FV1').value = 'MV_Packet_Loss_DL';
        sheet3.getCell('GF1').value = 'MV_Packet_Loss_UL';
        sheet3.getCell('GP1').value = 'PS_InterF_HOSR';
        sheet3.getCell('GZ1').value = 'PS_IntraF_HOSR';
        sheet3.getCell('H2').value = 'Week-2';
        sheet3.getCell('I2').value = 'Week-1';
        sheet3.getCell('J2').value = `${data.dates[0]}`;
        sheet3.getCell('K2').value = `${data.dates[1]}`;
        sheet3.getCell('L2').value = `${data.dates[2]}`;
        sheet3.getCell('M2').value = `${data.dates[3]}`;
        sheet3.getCell('N2').value = `${data.dates[4]}`;
        sheet3.getCell('O2').value = `${data.dates[5]}`;
        sheet3.getCell('P2').value = `${data.dates[6]}`;
        sheet3.getCell('Q2').value = `${data.dates[7]}`;
        sheet3.getCell('R2').value = 'Week-2';
        sheet3.getCell('S2').value = 'Week-1';
        sheet3.getCell('T2').value = `${data.dates[0]}`;
        sheet3.getCell('U2').value = `${data.dates[1]}`;
        sheet3.getCell('V2').value = `${data.dates[2]}`;
        sheet3.getCell('W2').value = `${data.dates[3]}`;
        sheet3.getCell('X2').value = `${data.dates[4]}`;
        sheet3.getCell('Y2').value = `${data.dates[5]}`;
        sheet3.getCell('Z2').value = `${data.dates[6]}`;
        sheet3.getCell('AA2').value = `${data.dates[7]}`;
        sheet3.getCell('AB2').value = 'Week-2';
        sheet3.getCell('AC2').value = 'Week-1';
        sheet3.getCell('AD2').value = `${data.dates[0]}`;
        sheet3.getCell('AE2').value = `${data.dates[1]}`;
        sheet3.getCell('AF2').value = `${data.dates[2]}`;
        sheet3.getCell('AG2').value = `${data.dates[3]}`;
        sheet3.getCell('AH2').value = `${data.dates[4]}`;
        sheet3.getCell('AI2').value = `${data.dates[5]}`;
        sheet3.getCell('AJ2').value = `${data.dates[6]}`;
        sheet3.getCell('AK2').value = `${data.dates[7]}`;
        sheet3.getCell('AL2').value = 'Week-2';
        sheet3.getCell('AM2').value = 'Week-1';
        sheet3.getCell('AN2').value = `${data.dates[0]}`;
        sheet3.getCell('AO2').value = `${data.dates[1]}`;
        sheet3.getCell('AP2').value = `${data.dates[2]}`;
        sheet3.getCell('AQ2').value = `${data.dates[3]}`;
        sheet3.getCell('AR2').value = `${data.dates[4]}`;
        sheet3.getCell('AS2').value = `${data.dates[5]}`;
        sheet3.getCell('AT2').value = `${data.dates[6]}`;
        sheet3.getCell('AU2').value = `${data.dates[7]}`;
        sheet3.getCell('AV2').value = 'Week-2';
        sheet3.getCell('AW2').value = 'Week-1';
        sheet3.getCell('AX2').value = `${data.dates[0]}`;
        sheet3.getCell('AY2').value = `${data.dates[1]}`;
        sheet3.getCell('AZ2').value = `${data.dates[2]}`;
        sheet3.getCell('BA2').value = `${data.dates[3]}`;
        sheet3.getCell('BB2').value = `${data.dates[4]}`;
        sheet3.getCell('BC2').value = `${data.dates[5]}`;
        sheet3.getCell('BD2').value = `${data.dates[6]}`;
        sheet3.getCell('BE2').value = `${data.dates[7]}`;
        sheet3.getCell('BF2').value = 'Week-2';
        sheet3.getCell('BG2').value = 'Week-1';
        sheet3.getCell('BH2').value = `${data.dates[0]}`;
        sheet3.getCell('BI2').value = `${data.dates[1]}`;
        sheet3.getCell('BJ2').value = `${data.dates[2]}`;
        sheet3.getCell('BK2').value = `${data.dates[3]}`;
        sheet3.getCell('BL2').value = `${data.dates[4]}`;
        sheet3.getCell('BM2').value = `${data.dates[5]}`;
        sheet3.getCell('BN2').value = `${data.dates[6]}`;
        sheet3.getCell('BO2').value = `${data.dates[7]}`;

        sheet3.getCell('BP2').value = 'Week-2';
        sheet3.getCell('BQ2').value = 'Week-1';
        sheet3.getCell('BR2').value = `${data.dates[0]}`;
        sheet3.getCell('BS2').value = `${data.dates[1]}`;
        sheet3.getCell('BT2').value = `${data.dates[2]}`;
        sheet3.getCell('BU2').value = `${data.dates[3]}`;
        sheet3.getCell('BV2').value = `${data.dates[4]}`;
        sheet3.getCell('BW2').value = `${data.dates[5]}`;
        sheet3.getCell('BX2').value = `${data.dates[6]}`;
        sheet3.getCell('BY2').value = `${data.dates[7]}`;

        sheet3.getCell('BZ2').value = 'Week-2';
        sheet3.getCell('CA2').value = 'Week-1';
        sheet3.getCell('CB2').value = `${data.dates[0]}`;
        sheet3.getCell('CC2').value = `${data.dates[1]}`;
        sheet3.getCell('CD2').value = `${data.dates[2]}`;
        sheet3.getCell('CE2').value = `${data.dates[3]}`;
        sheet3.getCell('CF2').value = `${data.dates[4]}`;
        sheet3.getCell('CG2').value = `${data.dates[5]}`;
        sheet3.getCell('CH2').value = `${data.dates[6]}`;
        sheet3.getCell('CI2').value = `${data.dates[7]}`;

        sheet3.getCell('CJ2').value = 'Week-2';
        sheet3.getCell('CK2').value = 'Week-1';
        sheet3.getCell('CL2').value = `${data.dates[0]}`;
        sheet3.getCell('CM2').value = `${data.dates[1]}`;
        sheet3.getCell('CN2').value = `${data.dates[2]}`;
        sheet3.getCell('CO2').value = `${data.dates[3]}`;
        sheet3.getCell('CP2').value = `${data.dates[4]}`;
        sheet3.getCell('CQ2').value = `${data.dates[5]}`;
        sheet3.getCell('CR2').value = `${data.dates[6]}`;
        sheet3.getCell('CS2').value = `${data.dates[7]}`;

        sheet3.getCell('CT2').value = 'Week-2';
        sheet3.getCell('CU2').value = 'Week-1';
        sheet3.getCell('CV2').value = `${data.dates[0]}`;
        sheet3.getCell('CW2').value = `${data.dates[1]}`;
        sheet3.getCell('CX2').value = `${data.dates[2]}`;
        sheet3.getCell('CY2').value = `${data.dates[3]}`;
        sheet3.getCell('CZ2').value = `${data.dates[4]}`;
        sheet3.getCell('DA2').value = `${data.dates[5]}`;
        sheet3.getCell('DB2').value = `${data.dates[6]}`;
        sheet3.getCell('DC2').value = `${data.dates[7]}`;

        sheet3.getCell('DD2').value = 'Week-2';
        sheet3.getCell('DE2').value = 'Week-1';
        sheet3.getCell('DF2').value = `${data.dates[0]}`;
        sheet3.getCell('DG2').value = `${data.dates[1]}`;
        sheet3.getCell('DH2').value = `${data.dates[2]}`;
        sheet3.getCell('DI2').value = `${data.dates[3]}`;
        sheet3.getCell('DJ2').value = `${data.dates[4]}`;
        sheet3.getCell('DK2').value = `${data.dates[5]}`;
        sheet3.getCell('DL2').value = `${data.dates[6]}`;
        sheet3.getCell('DM2').value = `${data.dates[7]}`;

        sheet3.getCell('DN2').value = 'Week-2';
        sheet3.getCell('DO2').value = 'Week-1';
        sheet3.getCell('DP2').value = `${data.dates[0]}`;
        sheet3.getCell('DQ2').value = `${data.dates[1]}`;
        sheet3.getCell('DR2').value = `${data.dates[2]}`;
        sheet3.getCell('DS2').value = `${data.dates[3]}`;
        sheet3.getCell('DT2').value = `${data.dates[4]}`;
        sheet3.getCell('DU2').value = `${data.dates[5]}`;
        sheet3.getCell('DV2').value = `${data.dates[6]}`;
        sheet3.getCell('DW2').value = `${data.dates[7]}`;
        sheet3.getCell('DX2').value = 'Week-2';
        sheet3.getCell('DY2').value = 'Week-1';
        sheet3.getCell('DZ2').value = `${data.dates[0]}`;
        sheet3.getCell('EA2').value = `${data.dates[1]}`;
        sheet3.getCell('EB2').value = `${data.dates[2]}`;
        sheet3.getCell('EC2').value = `${data.dates[3]}`;
        sheet3.getCell('ED2').value = `${data.dates[4]}`;
        sheet3.getCell('EE2').value = `${data.dates[5]}`;
        sheet3.getCell('EF2').value = `${data.dates[6]}`;
        sheet3.getCell('EG2').value = `${data.dates[7]}`;
        sheet3.getCell('EH2').value = 'Week-2';
        sheet3.getCell('EI2').value = 'Week-1';
        sheet3.getCell('EJ2').value = `${data.dates[0]}`;
        sheet3.getCell('EK2').value = `${data.dates[1]}`;
        sheet3.getCell('EL2').value = `${data.dates[2]}`;
        sheet3.getCell('EM2').value = `${data.dates[3]}`;
        sheet3.getCell('EN2').value = `${data.dates[4]}`;
        sheet3.getCell('EO2').value = `${data.dates[5]}`;
        sheet3.getCell('EP2').value = `${data.dates[6]}`;
        sheet3.getCell('EQ2').value = `${data.dates[7]}`;
        sheet3.getCell('ER2').value = 'Week-2';
        sheet3.getCell('ES2').value = 'Week-1';
        sheet3.getCell('ET2').value = `${data.dates[0]}`;
        sheet3.getCell('EU2').value = `${data.dates[1]}`;
        sheet3.getCell('EV2').value = `${data.dates[2]}`;
        sheet3.getCell('EW2').value = `${data.dates[3]}`;
        sheet3.getCell('EX2').value = `${data.dates[4]}`;
        sheet3.getCell('EY2').value = `${data.dates[5]}`;
        sheet3.getCell('EZ2').value = `${data.dates[6]}`;
        sheet3.getCell('FA2').value = `${data.dates[7]}`;
        sheet3.getCell('FB2').value = 'Week-2';
        sheet3.getCell('FC2').value = 'Week-1';
        sheet3.getCell('FD2').value = `${data.dates[0]}`;
        sheet3.getCell('FE2').value = `${data.dates[1]}`;
        sheet3.getCell('FF2').value = `${data.dates[2]}`;
        sheet3.getCell('FG2').value = `${data.dates[3]}`;
        sheet3.getCell('FH2').value = `${data.dates[4]}`;
        sheet3.getCell('FI2').value = `${data.dates[5]}`;
        sheet3.getCell('FJ2').value = `${data.dates[6]}`;
        sheet3.getCell('FK2').value = `${data.dates[7]}`;

        sheet3.getCell('FL2').value = 'Week-2';
        sheet3.getCell('FM2').value = 'Week-1';
        sheet3.getCell('FN2').value = `${data.dates[0]}`;
        sheet3.getCell('FO2').value = `${data.dates[1]}`;
        sheet3.getCell('FP2').value = `${data.dates[2]}`;
        sheet3.getCell('FQ2').value = `${data.dates[3]}`;
        sheet3.getCell('FR2').value = `${data.dates[4]}`;
        sheet3.getCell('FS2').value = `${data.dates[5]}`;
        sheet3.getCell('FT2').value = `${data.dates[6]}`;
        sheet3.getCell('FU2').value = `${data.dates[7]}`;

        sheet3.getCell('FV2').value = 'Week-2';
        sheet3.getCell('FW2').value = 'Week-1';
        sheet3.getCell('FX2').value = `${data.dates[0]}`;
        sheet3.getCell('FY2').value = `${data.dates[1]}`;
        sheet3.getCell('FZ2').value = `${data.dates[2]}`;
        sheet3.getCell('GA2').value = `${data.dates[3]}`;
        sheet3.getCell('GB2').value = `${data.dates[4]}`;
        sheet3.getCell('GC2').value = `${data.dates[5]}`;
        sheet3.getCell('GD2').value = `${data.dates[6]}`;
        sheet3.getCell('GE2').value = `${data.dates[7]}`;


        sheet3.getCell('GF2').value = 'Week-2';
        sheet3.getCell('GG2').value = 'Week-1';
        sheet3.getCell('GH2').value = `${data.dates[0]}`;
        sheet3.getCell('GI2').value = `${data.dates[1]}`;
        sheet3.getCell('GJ2').value = `${data.dates[2]}`;
        sheet3.getCell('GK2').value = `${data.dates[3]}`;
        sheet3.getCell('GL2').value = `${data.dates[4]}`;
        sheet3.getCell('GM2').value = `${data.dates[5]}`;
        sheet3.getCell('GN2').value = `${data.dates[6]}`;
        sheet3.getCell('GO2').value = `${data.dates[7]}`;

        sheet3.getCell('GP2').value = 'Week-2';
        sheet3.getCell('GQ2').value = 'Week-1';
        sheet3.getCell('GR2').value = `${data.dates[0]}`;
        sheet3.getCell('GS2').value = `${data.dates[1]}`;
        sheet3.getCell('GT2').value = `${data.dates[2]}`;
        sheet3.getCell('GU2').value = `${data.dates[3]}`;
        sheet3.getCell('GV2').value = `${data.dates[4]}`;
        sheet3.getCell('GW2').value = `${data.dates[5]}`;
        sheet3.getCell('GX2').value = `${data.dates[6]}`;
        sheet3.getCell('GY2').value = `${data.dates[7]}`;

        sheet3.getCell('GZ2').value = 'Week-2';
        sheet3.getCell('HA2').value = 'Week-1';
        sheet3.getCell('HB2').value = `${data.dates[0]}`;
        sheet3.getCell('HC2').value = `${data.dates[1]}`;
        sheet3.getCell('HD2').value = `${data.dates[2]}`;
        sheet3.getCell('HE2').value = `${data.dates[3]}`;
        sheet3.getCell('HF2').value = `${data.dates[4]}`;
        sheet3.getCell('HG2').value = `${data.dates[5]}`;
        sheet3.getCell('HH2').value = `${data.dates[6]}`;
        sheet3.getCell('HI2').value = `${data.dates[7]}`;

        // sheet3.getCell('EK2').value = 'Week-2';
        // sheet3.getCell('EL2').value = 'Week-1';
        // sheet3.getCell('EM2').value = `${data.dates[0]}`;
        // sheet3.getCell('EN2').value = `${data.dates[1]}`;
        // sheet3.getCell('EO2').value = `${data.dates[2]}`;
        // sheet3.getCell('EP2').value = `${data.dates[3]}`;
        // sheet3.getCell('EQ2').value = `${data.dates[4]}`;

        sheet3.columns = [
            { key: 'Circle' },
            { key: 'Short_name' },
            { key: 'site_ID' },
            { key: 'OEM_GGSN' },
            { key: 'ms1_Date' },
            { key: 'project' },
            { key: 'MV_Freq_Band' },
            { key: 'MV_4G_Data_Volume_GB_week_2' },
            { key: 'MV_4G_Data_Volume_GB_week_1' },
            { key: 'MV_4G_Data_Volume_GB_date_1' },
            { key: 'MV_4G_Data_Volume_GB_date_2' },
            { key: 'MV_4G_Data_Volume_GB_date_3' },
            { key: 'MV_4G_Data_Volume_GB_date_4' },
            { key: 'MV_4G_Data_Volume_GB_date_5' },
            { key: 'MV_4G_Data_Volume_GB_date_6' },
            { key: 'MV_4G_Data_Volume_GB_date_7' },
            { key: 'MV_4G_Data_Volume_GB_date_8' },
            { key: 'MV_Radio_NW_Availability_week_2' },
            { key: 'MV_Radio_NW_Availability_week_1' },
            { key: 'MV_Radio_NW_Availability_date_1' },
            { key: 'MV_Radio_NW_Availability_date_2' },
            { key: 'MV_Radio_NW_Availability_date_3' },
            { key: 'MV_Radio_NW_Availability_date_4' },
            { key: 'MV_Radio_NW_Availability_date_5' },
            { key: 'MV_Radio_NW_Availability_date_6' },
            { key: 'MV_Radio_NW_Availability_date_7' },
            { key: 'MV_Radio_NW_Availability_date_8' },
            { key: 'MV_VoLTE_raffic_week_2' },
            { key: 'MV_VoLTE_raffic_week_1' },
            { key: 'MV_VoLTE_raffic_date_1' },
            { key: 'MV_VoLTE_raffic_date_2' },
            { key: 'MV_VoLTE_raffic_date_3' },
            { key: 'MV_VoLTE_raffic_date_4' },
            { key: 'MV_VoLTE_raffic_date_5' },
            { key: 'MV_VoLTE_raffic_date_6' },
            { key: 'MV_VoLTE_raffic_date_7' },
            { key: 'MV_VoLTE_raffic_date_8' },
            { key: 'MV_DL_User_Throughput_Kbps_week_2' },
            { key: 'MV_DL_User_Throughput_Kbps_week_1' },
            { key: 'MV_DL_User_Throughput_Kbps_date_1' },
            { key: 'MV_DL_User_Throughput_Kbps_date_2' },
            { key: 'MV_DL_User_Throughput_Kbps_date_3' },
            { key: 'MV_DL_User_Throughput_Kbps_date_4' },
            { key: 'MV_DL_User_Throughput_Kbps_date_5' },
            { key: 'MV_DL_User_Throughput_Kbps_date_6' },
            { key: 'MV_DL_User_Throughput_Kbps_date_7' },
            { key: 'MV_DL_User_Throughput_Kbps_date_8' },
            { key: 'MV_E_UTRAN_Average_CQI_week_2' },
            { key: 'MV_E_UTRAN_Average_CQI_week_1' },
            { key: 'MV_E_UTRAN_Average_CQI_date_1' },
            { key: 'MV_E_UTRAN_Average_CQI_date_2' },
            { key: 'MV_E_UTRAN_Average_CQI_date_3' },
            { key: 'MV_E_UTRAN_Average_CQI_date_4' },
            { key: 'MV_E_UTRAN_Average_CQI_date_5' },
            { key: 'MV_E_UTRAN_Average_CQI_date_6' },
            { key: 'MV_E_UTRAN_Average_CQI_date_7' },
            { key: 'MV_E_UTRAN_Average_CQI_date_8' },
            { key: 'UL_RSSI_week_2' },
            { key: 'UL_RSSI_week_1' },
            { key: 'UL_RSSI_date_1' },
            { key: 'UL_RSSI_date_2' },
            { key: 'UL_RSSI_date_3' },
            { key: 'UL_RSSI_date_4' },
            { key: 'UL_RSSI_date_5' },
            { key: 'UL_RSSI_date_6' },
            { key: 'UL_RSSI_date_7' },
            { key: 'UL_RSSI_date_8' },
            { key: 'MV_Average_number_of_used_DL_PRBs_week_2' },
            { key: 'MV_Average_number_of_used_DL_PRBs_week_1' },
            { key: 'MV_Average_number_of_used_DL_PRBs_date_1' },
            { key: 'MV_Average_number_of_used_DL_PRBs_date_2' },
            { key: 'MV_Average_number_of_used_DL_PRBs_date_3' },
            { key: 'MV_Average_number_of_used_DL_PRBs_date_4' },
            { key: 'MV_Average_number_of_used_DL_PRBs_date_5' },
            { key: 'MV_Average_number_of_used_DL_PRBs_date_6' },
            { key: 'MV_Average_number_of_used_DL_PRBs_date_7' },
            { key: 'MV_Average_number_of_used_DL_PRBs_date_8' },

            { key: 'MV_RRC_Setup_Success_Rate_week_2' },
            { key: 'MV_RRC_Setup_Success_Rate_week_1' },
            { key: 'MV_RRC_Setup_Success_Rate_date_1' },
            { key: 'MV_RRC_Setup_Success_Rate_date_2' },
            { key: 'MV_RRC_Setup_Success_Rate_date_3' },
            { key: 'MV_RRC_Setup_Success_Rate_date_4' },
            { key: 'MV_RRC_Setup_Success_Rate_date_5' },
            { key: 'MV_RRC_Setup_Success_Rate_date_6' },
            { key: 'MV_RRC_Setup_Success_Rate_date_7' },
            { key: 'MV_RRC_Setup_Success_Rate_date_8' },

            { key: 'MV_ERAB_Setup_Success_Rate_week_2' },
            { key: 'MV_ERAB_Setup_Success_Rate_week_1' },
            { key: 'MV_ERAB_Setup_Success_Rate_date_1' },
            { key: 'MV_ERAB_Setup_Success_Rate_date_2' },
            { key: 'MV_ERAB_Setup_Success_Rate_date_3' },
            { key: 'MV_ERAB_Setup_Success_Rate_date_4' },
            { key: 'MV_ERAB_Setup_Success_Rate_date_5' },
            { key: 'MV_ERAB_Setup_Success_Rate_date_6' },
            { key: 'MV_ERAB_Setup_Success_Rate_date_7' },
            { key: 'MV_ERAB_Setup_Success_Rate_date_8' },

            { key: 'MV_PS_Drop_Call_Rate_week_2' },
            { key: 'MV_PS_Drop_Call_Rate_week_1' },
            { key: 'MV_PS_Drop_Call_Rate_date_1' },
            { key: 'MV_PS_Drop_Call_Rate_date_2' },
            { key: 'MV_PS_Drop_Call_Rate_date_3' },
            { key: 'MV_PS_Drop_Call_Rate_date_4' },
            { key: 'MV_PS_Drop_Call_Rate_date_5' },
            { key: 'MV_PS_Drop_Call_Rate_date_6' },
            { key: 'MV_PS_Drop_Call_Rate_date_7' },
            { key: 'MV_PS_Drop_Call_Rate_date_8' },

            { key: 'MV_Max_Connecteda_User_week_2' },
            { key: 'MV_Max_Connecteda_User_week_1' },
            { key: 'MV_Max_Connecteda_User_date_1' },
            { key: 'MV_Max_Connecteda_User_date_2' },
            { key: 'MV_Max_Connecteda_User_date_3' },
            { key: 'MV_Max_Connecteda_User_date_4' },
            { key: 'MV_Max_Connecteda_User_date_5' },
            { key: 'MV_Max_Connecteda_User_date_6' },
            { key: 'MV_Max_Connecteda_User_date_7' },
            { key: 'MV_Max_Connecteda_User_date_8' },

            { key: 'MV_PUCCH_SINR_week_2' },
            { key: 'MV_PUCCH_SINR_week_1' },
            { key: 'MV_PUCCH_SINR_date_1' },
            { key: 'MV_PUCCH_SINR_date_2' },
            { key: 'MV_PUCCH_SINR_date_3' },
            { key: 'MV_PUCCH_SINR_date_4' },
            { key: 'MV_PUCCH_SINR_date_5' },
            { key: 'MV_PUCCH_SINR_date_6' },
            { key: 'MV_PUCCH_SINR_date_7' },
            { key: 'MV_PUCCH_SINR_date_8' },
            { key: 'MV_Average_UE_Distance_KM_week_2' },
            { key: 'MV_Average_UE_Distance_KM_week_1' },
            { key: 'MV_Average_UE_Distance_KM_date_1' },
            { key: 'MV_Average_UE_Distance_KM_date_2' },
            { key: 'MV_Average_UE_Distance_KM_date_3' },
            { key: 'MV_Average_UE_Distance_KM_date_4' },
            { key: 'MV_Average_UE_Distance_KM_date_5' },
            { key: 'MV_Average_UE_Distance_KM_date_6' },
            { key: 'MV_Average_UE_Distance_KM_date_7' },
            { key: 'MV_Average_UE_Distance_KM_date_8' },
            { key: 'MV_PS_handover_success_rate_LTE_INTER_SYSTEM_week_2' },
            { key: 'MV_PS_handover_success_rate_LTE_INTER_SYSTEM_week_1' },
            { key: 'MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_1' },
            { key: 'MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_2' },
            { key: 'MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_3' },
            { key: 'MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_4' },
            { key: 'MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_5' },
            { key: 'MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_6' },
            { key: 'MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_7' },
            { key: 'MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_8' },
            { key: 'MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_week_2' },
            { key: 'MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_week_1' },
            { key: 'MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_1' },
            { key: 'MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_2' },
            { key: 'MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_3' },
            { key: 'MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_4' },
            { key: 'MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_5' },
            { key: 'MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_6' },
            { key: 'MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_7' },
            { key: 'MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_8' },
            { key: 'UL_RSSI_Nokia_RSSI_SINR_week_2' },
            { key: 'UL_RSSI_Nokia_RSSI_SINR_week_1' },
            { key: 'UL_RSSI_Nokia_RSSI_SINR_date_1' },
            { key: 'UL_RSSI_Nokia_RSSI_SINR_date_2' },
            { key: 'UL_RSSI_Nokia_RSSI_SINR_date_3' },
            { key: 'UL_RSSI_Nokia_RSSI_SINR_date_4' },
            { key: 'UL_RSSI_Nokia_RSSI_SINR_date_5' },
            { key: 'UL_RSSI_Nokia_RSSI_SINR_date_6' },
            { key: 'UL_RSSI_Nokia_RSSI_SINR_date_7' },
            { key: 'UL_RSSI_Nokia_RSSI_SINR_date_8' },
            { key: 'MV_VoLTE_DCR_week_2' },
            { key: 'MV_VoLTE_DCR_week_1' },
            { key: 'MV_VoLTE_DCR_date_1' },
            { key: 'MV_VoLTE_DCR_date_2' },
            { key: 'MV_VoLTE_DCR_date_3' },
            { key: 'MV_VoLTE_DCR_date_4' },
            { key: 'MV_VoLTE_DCR_date_5' },
            { key: 'MV_VoLTE_DCR_date_6' },
            { key: 'MV_VoLTE_DCR_date_7' },
            { key: 'MV_VoLTE_DCR_date_8' },
            { key: 'MV_Packet_Loss_DL_week_2' },
            { key: 'MV_Packet_Loss_DL_week_1' },
            { key: 'MV_Packet_Loss_DL_date_1' },
            { key: 'MV_Packet_Loss_DL_date_2' },
            { key: 'MV_Packet_Loss_DL_date_3' },
            { key: 'MV_Packet_Loss_DL_date_4' },
            { key: 'MV_Packet_Loss_DL_date_5' },
            { key: 'MV_Packet_Loss_DL_date_6' },
            { key: 'MV_Packet_Loss_DL_date_7' },
            { key: 'MV_Packet_Loss_DL_date_8' },

            { key: 'MV_Packet_Loss_UL_week_2' },
            { key: 'MV_Packet_Loss_UL_week_1' },
            { key: 'MV_Packet_Loss_UL_date_1' },
            { key: 'MV_Packet_Loss_UL_date_2' },
            { key: 'MV_Packet_Loss_UL_date_3' },
            { key: 'MV_Packet_Loss_UL_date_4' },
            { key: 'MV_Packet_Loss_UL_date_5' },
            { key: 'MV_Packet_Loss_UL_date_6' },
            { key: 'MV_Packet_Loss_UL_date_7' },
            { key: 'MV_Packet_Loss_UL_date_8' },

            { key: 'PS_InterF_HOSR_week_2' },
            { key: 'PS_InterF_HOSR_week_1' },
            { key: 'PS_InterF_HOSR_date_1' },
            { key: 'PS_InterF_HOSR_date_2' },
            { key: 'PS_InterF_HOSR_date_3' },
            { key: 'PS_InterF_HOSR_date_4' },
            { key: 'PS_InterF_HOSR_date_5' },
            { key: 'PS_InterF_HOSR_date_6' },
            { key: 'PS_InterF_HOSR_date_7' },
            { key: 'PS_InterF_HOSR_date_8' },


            { key: 'PS_IntraF_HOSR_week_2' },
            { key: 'PS_IntraF_HOSR_week_1' },
            { key: 'PS_IntraF_HOSR_date_1' },
            { key: 'PS_IntraF_HOSR_date_2' },
            { key: 'PS_IntraF_HOSR_date_3' },
            { key: 'PS_IntraF_HOSR_date_4' },
            { key: 'PS_IntraF_HOSR_date_5' },
            { key: 'PS_IntraF_HOSR_date_6' },
            { key: 'PS_IntraF_HOSR_date_7' },
            { key: 'PS_IntraF_HOSR_date_8' },

        ]

        _.map(data?.data, item => {
            sheet3.addRow({
                Circle: item.Short_name ? (getCircleName(item?.Short_name)) : '',
                Short_name: item?.Short_name,
                site_ID: item?.site_ID,
                OEM_GGSN: item?.OEM_GGSN,
                ms1_Date: item?.ms1_Date,
                project: item?.project,
                MV_Freq_Band: item?.MV_Freq_Band,
                MV_4G_Data_Volume_GB_week_2: item.MV_4G_Data_Volume_GB_week_2,
                MV_4G_Data_Volume_GB_week_1: item.MV_4G_Data_Volume_GB_week_1,
                MV_4G_Data_Volume_GB_date_1: item.MV_4G_Data_Volume_GB_date_1,
                MV_4G_Data_Volume_GB_date_2: item.MV_4G_Data_Volume_GB_date_2,
                MV_4G_Data_Volume_GB_date_3: item.MV_4G_Data_Volume_GB_date_3,
                MV_4G_Data_Volume_GB_date_4: item.MV_4G_Data_Volume_GB_date_4,
                MV_4G_Data_Volume_GB_date_5: item.MV_4G_Data_Volume_GB_date_5,
                MV_4G_Data_Volume_GB_date_6: item.MV_4G_Data_Volume_GB_date_6,
                MV_4G_Data_Volume_GB_date_7: item.MV_4G_Data_Volume_GB_date_7,
                MV_4G_Data_Volume_GB_date_8: item.MV_4G_Data_Volume_GB_date_8,
                MV_Radio_NW_Availability_week_2: item.MV_Radio_NW_Availability_week_2,
                MV_Radio_NW_Availability_week_1: item.MV_Radio_NW_Availability_week_1,
                MV_Radio_NW_Availability_date_1: item.MV_Radio_NW_Availability_date_1,
                MV_Radio_NW_Availability_date_2: item.MV_Radio_NW_Availability_date_2,
                MV_Radio_NW_Availability_date_3: item.MV_Radio_NW_Availability_date_3,
                MV_Radio_NW_Availability_date_4: item.MV_Radio_NW_Availability_date_4,
                MV_Radio_NW_Availability_date_5: item.MV_Radio_NW_Availability_date_5,
                MV_Radio_NW_Availability_date_6: item.MV_Radio_NW_Availability_date_6,
                MV_Radio_NW_Availability_date_7: item.MV_Radio_NW_Availability_date_7,
                MV_Radio_NW_Availability_date_8: item.MV_Radio_NW_Availability_date_8,
                MV_VoLTE_raffic_week_2: item.MV_VoLTE_raffic_week_2,
                MV_VoLTE_raffic_week_1: item.MV_VoLTE_raffic_week_1,
                MV_VoLTE_raffic_date_1: item.MV_VoLTE_raffic_date_1,
                MV_VoLTE_raffic_date_2: item.MV_VoLTE_raffic_date_2,
                MV_VoLTE_raffic_date_3: item.MV_VoLTE_raffic_date_3,
                MV_VoLTE_raffic_date_4: item.MV_VoLTE_raffic_date_4,
                MV_VoLTE_raffic_date_5: item.MV_VoLTE_raffic_date_5,
                MV_VoLTE_raffic_date_6: item.MV_VoLTE_raffic_date_6,
                MV_VoLTE_raffic_date_7: item.MV_VoLTE_raffic_date_7,
                MV_VoLTE_raffic_date_8: item.MV_VoLTE_raffic_date_8,

                MV_DL_User_Throughput_Kbps_week_2: item.MV_DL_User_Throughput_Kbps_week_2,
                MV_DL_User_Throughput_Kbps_week_1: item.MV_DL_User_Throughput_Kbps_week_1,
                MV_DL_User_Throughput_Kbps_date_1: item.MV_DL_User_Throughput_Kbps_date_1,
                MV_DL_User_Throughput_Kbps_date_2: item.MV_DL_User_Throughput_Kbps_date_2,
                MV_DL_User_Throughput_Kbps_date_3: item.MV_DL_User_Throughput_Kbps_date_3,
                MV_DL_User_Throughput_Kbps_date_4: item.MV_DL_User_Throughput_Kbps_date_4,
                MV_DL_User_Throughput_Kbps_date_5: item.MV_DL_User_Throughput_Kbps_date_5,
                MV_DL_User_Throughput_Kbps_date_6: item.MV_DL_User_Throughput_Kbps_date_6,
                MV_DL_User_Throughput_Kbps_date_7: item.MV_DL_User_Throughput_Kbps_date_7,
                MV_DL_User_Throughput_Kbps_date_8: item.MV_DL_User_Throughput_Kbps_date_8,

                MV_E_UTRAN_Average_CQI_week_2: item.MV_E_UTRAN_Average_CQI_week_2,
                MV_E_UTRAN_Average_CQI_week_1: item.MV_E_UTRAN_Average_CQI_week_1,
                MV_E_UTRAN_Average_CQI_date_1: item.MV_E_UTRAN_Average_CQI_date_1,
                MV_E_UTRAN_Average_CQI_date_2: item.MV_E_UTRAN_Average_CQI_date_2,
                MV_E_UTRAN_Average_CQI_date_3: item.MV_E_UTRAN_Average_CQI_date_3,
                MV_E_UTRAN_Average_CQI_date_4: item.MV_E_UTRAN_Average_CQI_date_4,
                MV_E_UTRAN_Average_CQI_date_5: item.MV_E_UTRAN_Average_CQI_date_5,
                MV_E_UTRAN_Average_CQI_date_6: item.MV_E_UTRAN_Average_CQI_date_6,
                MV_E_UTRAN_Average_CQI_date_7: item.MV_E_UTRAN_Average_CQI_date_7,
                MV_E_UTRAN_Average_CQI_date_8: item.MV_E_UTRAN_Average_CQI_date_8,

                UL_RSSI_week_2: item.UL_RSSI_week_2,
                UL_RSSI_week_1: item.UL_RSSI_week_1,
                UL_RSSI_date_1: item.UL_RSSI_date_1,
                UL_RSSI_date_2: item.UL_RSSI_date_2,
                UL_RSSI_date_3: item.UL_RSSI_date_3,
                UL_RSSI_date_4: item.UL_RSSI_date_4,
                UL_RSSI_date_5: item.UL_RSSI_date_5,
                UL_RSSI_date_6: item.UL_RSSI_date_6,
                UL_RSSI_date_7: item.UL_RSSI_date_7,
                UL_RSSI_date_8: item.UL_RSSI_date_8,

                MV_Average_number_of_used_DL_PRBs_week_2: item.MV_Average_number_of_used_DL_PRBs_week_2,
                MV_Average_number_of_used_DL_PRBs_week_1: item.MV_Average_number_of_used_DL_PRBs_week_1,
                MV_Average_number_of_used_DL_PRBs_date_1: item.MV_Average_number_of_used_DL_PRBs_date_1,
                MV_Average_number_of_used_DL_PRBs_date_2: item.MV_Average_number_of_used_DL_PRBs_date_2,
                MV_Average_number_of_used_DL_PRBs_date_3: item.MV_Average_number_of_used_DL_PRBs_date_3,
                MV_Average_number_of_used_DL_PRBs_date_4: item.MV_Average_number_of_used_DL_PRBs_date_4,
                MV_Average_number_of_used_DL_PRBs_date_5: item.MV_Average_number_of_used_DL_PRBs_date_5,
                MV_Average_number_of_used_DL_PRBs_date_6: item.MV_Average_number_of_used_DL_PRBs_date_6,
                MV_Average_number_of_used_DL_PRBs_date_7: item.MV_Average_number_of_used_DL_PRBs_date_7,
                MV_Average_number_of_used_DL_PRBs_date_8: item.MV_Average_number_of_used_DL_PRBs_date_8,

                MV_RRC_Setup_Success_Rate_week_2: item.MV_RRC_Setup_Success_Rate_week_2,
                MV_RRC_Setup_Success_Rate_week_1: item.MV_RRC_Setup_Success_Rate_week_1,
                MV_RRC_Setup_Success_Rate_date_1: item.MV_RRC_Setup_Success_Rate_date_1,
                MV_RRC_Setup_Success_Rate_date_2: item.MV_RRC_Setup_Success_Rate_date_2,
                MV_RRC_Setup_Success_Rate_date_3: item.MV_RRC_Setup_Success_Rate_date_3,
                MV_RRC_Setup_Success_Rate_date_4: item.MV_RRC_Setup_Success_Rate_date_4,
                MV_RRC_Setup_Success_Rate_date_5: item.MV_RRC_Setup_Success_Rate_date_5,
                MV_RRC_Setup_Success_Rate_date_6: item.MV_RRC_Setup_Success_Rate_date_6,
                MV_RRC_Setup_Success_Rate_date_7: item.MV_RRC_Setup_Success_Rate_date_7,
                MV_RRC_Setup_Success_Rate_date_8: item.MV_RRC_Setup_Success_Rate_date_8,

                MV_ERAB_Setup_Success_Rate_week_2: item.MV_ERAB_Setup_Success_Rate_week_2,
                MV_ERAB_Setup_Success_Rate_week_1: item.MV_ERAB_Setup_Success_Rate_week_1,
                MV_ERAB_Setup_Success_Rate_date_1: item.MV_ERAB_Setup_Success_Rate_date_1,
                MV_ERAB_Setup_Success_Rate_date_2: item.MV_ERAB_Setup_Success_Rate_date_2,
                MV_ERAB_Setup_Success_Rate_date_3: item.MV_ERAB_Setup_Success_Rate_date_3,
                MV_ERAB_Setup_Success_Rate_date_4: item.MV_ERAB_Setup_Success_Rate_date_4,
                MV_ERAB_Setup_Success_Rate_date_5: item.MV_ERAB_Setup_Success_Rate_date_5,
                MV_ERAB_Setup_Success_Rate_date_6: item.MV_ERAB_Setup_Success_Rate_date_6,
                MV_ERAB_Setup_Success_Rate_date_7: item.MV_ERAB_Setup_Success_Rate_date_7,
                MV_ERAB_Setup_Success_Rate_date_8: item.MV_ERAB_Setup_Success_Rate_date_8,

                MV_PS_Drop_Call_Rate_week_2: item.MV_PS_Drop_Call_Rate_week_2,
                MV_PS_Drop_Call_Rate_week_1: item.MV_PS_Drop_Call_Rate_week_1,
                MV_PS_Drop_Call_Rate_date_1: item.MV_PS_Drop_Call_Rate_date_1,
                MV_PS_Drop_Call_Rate_date_2: item.MV_PS_Drop_Call_Rate_date_2,
                MV_PS_Drop_Call_Rate_date_3: item.MV_PS_Drop_Call_Rate_date_3,
                MV_PS_Drop_Call_Rate_date_4: item.MV_PS_Drop_Call_Rate_date_4,
                MV_PS_Drop_Call_Rate_date_5: item.MV_PS_Drop_Call_Rate_date_5,
                MV_PS_Drop_Call_Rate_date_6: item.MV_PS_Drop_Call_Rate_date_6,
                MV_PS_Drop_Call_Rate_date_7: item.MV_PS_Drop_Call_Rate_date_7,
                MV_PS_Drop_Call_Rate_date_8: item.MV_PS_Drop_Call_Rate_date_8,

                MV_Max_Connecteda_User_week_2: item.MV_Max_Connecteda_User_week_2,
                MV_Max_Connecteda_User_week_1: item.MV_Max_Connecteda_User_week_1,
                MV_Max_Connecteda_User_date_1: item.MV_Max_Connecteda_User_date_1,
                MV_Max_Connecteda_User_date_2: item.MV_Max_Connecteda_User_date_2,
                MV_Max_Connecteda_User_date_3: item.MV_Max_Connecteda_User_date_3,
                MV_Max_Connecteda_User_date_4: item.MV_Max_Connecteda_User_date_4,
                MV_Max_Connecteda_User_date_5: item.MV_Max_Connecteda_User_date_5,
                MV_Max_Connecteda_User_date_6: item.MV_Max_Connecteda_User_date_6,
                MV_Max_Connecteda_User_date_7: item.MV_Max_Connecteda_User_date_7,
                MV_Max_Connecteda_User_date_8: item.MV_Max_Connecteda_User_date_8,

                MV_PUCCH_SINR_week_2: item.MV_PUCCH_SINR_week_2,
                MV_PUCCH_SINR_week_1: item.MV_PUCCH_SINR_week_1,
                MV_PUCCH_SINR_date_1: item.MV_PUCCH_SINR_date_1,
                MV_PUCCH_SINR_date_2: item.MV_PUCCH_SINR_date_2,
                MV_PUCCH_SINR_date_3: item.MV_PUCCH_SINR_date_3,
                MV_PUCCH_SINR_date_4: item.MV_PUCCH_SINR_date_4,
                MV_PUCCH_SINR_date_5: item.MV_PUCCH_SINR_date_5,
                MV_PUCCH_SINR_date_6: item.MV_PUCCH_SINR_date_6,
                MV_PUCCH_SINR_date_7: item.MV_PUCCH_SINR_date_7,
                MV_PUCCH_SINR_date_8: item.MV_PUCCH_SINR_date_8,

                MV_Average_UE_Distance_KM_week_2: item.MV_Average_UE_Distance_KM_week_2,
                MV_Average_UE_Distance_KM_week_1: item.MV_Average_UE_Distance_KM_week_1,
                MV_Average_UE_Distance_KM_date_1: item.MV_Average_UE_Distance_KM_date_1,
                MV_Average_UE_Distance_KM_date_2: item.MV_Average_UE_Distance_KM_date_2,
                MV_Average_UE_Distance_KM_date_3: item.MV_Average_UE_Distance_KM_date_3,
                MV_Average_UE_Distance_KM_date_4: item.MV_Average_UE_Distance_KM_date_4,
                MV_Average_UE_Distance_KM_date_5: item.MV_Average_UE_Distance_KM_date_5,
                MV_Average_UE_Distance_KM_date_6: item.MV_Average_UE_Distance_KM_date_6,
                MV_Average_UE_Distance_KM_date_7: item.MV_Average_UE_Distance_KM_date_7,
                MV_Average_UE_Distance_KM_date_8: item.MV_Average_UE_Distance_KM_date_8,


                MV_PS_handover_success_rate_LTE_INTER_SYSTEM_week_2: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_week_2,
                MV_PS_handover_success_rate_LTE_INTER_SYSTEM_week_1: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_week_1,
                MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_1: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_1,
                MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_2: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_2,
                MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_3: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_3,
                MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_4: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_4,
                MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_5: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_5,
                MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_6: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_6,
                MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_7: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_7,
                MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_8: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_8,

                MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_week_2: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_week_2,
                MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_week_1: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_week_1,
                MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_1: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_1,
                MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_2: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_2,
                MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_3: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_3,
                MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_4: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_4,
                MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_5: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_5,
                MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_6: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_6,
                MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_7: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_7,
                MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_8: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_8,


                UL_RSSI_Nokia_RSSI_SINR_week_2: item.UL_RSSI_Nokia_RSSI_SINR_week_2,
                UL_RSSI_Nokia_RSSI_SINR_week_1: item.UL_RSSI_Nokia_RSSI_SINR_week_1,
                UL_RSSI_Nokia_RSSI_SINR_date_1: item.UL_RSSI_Nokia_RSSI_SINR_date_1,
                UL_RSSI_Nokia_RSSI_SINR_date_2: item.UL_RSSI_Nokia_RSSI_SINR_date_2,
                UL_RSSI_Nokia_RSSI_SINR_date_3: item.UL_RSSI_Nokia_RSSI_SINR_date_3,
                UL_RSSI_Nokia_RSSI_SINR_date_4: item.UL_RSSI_Nokia_RSSI_SINR_date_4,
                UL_RSSI_Nokia_RSSI_SINR_date_5: item.UL_RSSI_Nokia_RSSI_SINR_date_5,
                UL_RSSI_Nokia_RSSI_SINR_date_6: item.UL_RSSI_Nokia_RSSI_SINR_date_6,
                UL_RSSI_Nokia_RSSI_SINR_date_7: item.UL_RSSI_Nokia_RSSI_SINR_date_7,
                UL_RSSI_Nokia_RSSI_SINR_date_8: item.UL_RSSI_Nokia_RSSI_SINR_date_8,


                MV_VoLTE_DCR_week_2: item.MV_VoLTE_DCR_week_2,
                MV_VoLTE_DCR_week_1: item.MV_VoLTE_DCR_week_1,
                MV_VoLTE_DCR_date_1: item.MV_VoLTE_DCR_date_1,
                MV_VoLTE_DCR_date_2: item.MV_VoLTE_DCR_date_2,
                MV_VoLTE_DCR_date_3: item.MV_VoLTE_DCR_date_3,
                MV_VoLTE_DCR_date_4: item.MV_VoLTE_DCR_date_4,
                MV_VoLTE_DCR_date_5: item.MV_VoLTE_DCR_date_5,
                MV_VoLTE_DCR_date_6: item.MV_VoLTE_DCR_date_6,
                MV_VoLTE_DCR_date_7: item.MV_VoLTE_DCR_date_7,
                MV_VoLTE_DCR_date_8: item.MV_VoLTE_DCR_date_8,

                MV_Packet_Loss_DL_week_2: item.MV_Packet_Loss_DL_week_2,
                MV_Packet_Loss_DL_week_1: item.MV_Packet_Loss_DL_week_1,
                MV_Packet_Loss_DL_date_1: item.MV_Packet_Loss_DL_date_1,
                MV_Packet_Loss_DL_date_2: item.MV_Packet_Loss_DL_date_2,
                MV_Packet_Loss_DL_date_3: item.MV_Packet_Loss_DL_date_3,
                MV_Packet_Loss_DL_date_4: item.MV_Packet_Loss_DL_date_4,
                MV_Packet_Loss_DL_date_5: item.MV_Packet_Loss_DL_date_5,
                MV_Packet_Loss_DL_date_6: item.MV_Packet_Loss_DL_date_6,
                MV_Packet_Loss_DL_date_7: item.MV_Packet_Loss_DL_date_7,
                MV_Packet_Loss_DL_date_8: item.MV_Packet_Loss_DL_date_8,

                MV_Packet_Loss_UL_week_2: item.MV_Packet_Loss_UL_week_2,
                MV_Packet_Loss_UL_week_1: item.MV_Packet_Loss_UL_week_1,
                MV_Packet_Loss_UL_date_1: item.MV_Packet_Loss_UL_date_1,
                MV_Packet_Loss_UL_date_2: item.MV_Packet_Loss_UL_date_2,
                MV_Packet_Loss_UL_date_3: item.MV_Packet_Loss_UL_date_3,
                MV_Packet_Loss_UL_date_4: item.MV_Packet_Loss_UL_date_4,
                MV_Packet_Loss_UL_date_5: item.MV_Packet_Loss_UL_date_5,
                MV_Packet_Loss_UL_date_6: item.MV_Packet_Loss_UL_date_6,
                MV_Packet_Loss_UL_date_7: item.MV_Packet_Loss_UL_date_7,
                MV_Packet_Loss_UL_date_8: item.MV_Packet_Loss_UL_date_8,

                PS_InterF_HOSR_week_2: item.PS_InterF_HOSR_week_2,
                PS_InterF_HOSR_week_1: item.PS_InterF_HOSR_week_1,
                PS_InterF_HOSR_date_1: item.PS_InterF_HOSR_date_1,
                PS_InterF_HOSR_date_2: item.PS_InterF_HOSR_date_2,
                PS_InterF_HOSR_date_3: item.PS_InterF_HOSR_date_3,
                PS_InterF_HOSR_date_4: item.PS_InterF_HOSR_date_4,
                PS_InterF_HOSR_date_5: item.PS_InterF_HOSR_date_5,
                PS_InterF_HOSR_date_6: item.PS_InterF_HOSR_date_6,
                PS_InterF_HOSR_date_7: item.PS_InterF_HOSR_date_7,
                PS_InterF_HOSR_date_8: item.PS_InterF_HOSR_date_8,

                PS_IntraF_HOSR_week_2: item.PS_IntraF_HOSR_week_2,
                PS_IntraF_HOSR_week_1: item.PS_IntraF_HOSR_week_1,
                PS_IntraF_HOSR_date_1: item.PS_IntraF_HOSR_date_1,
                PS_IntraF_HOSR_date_2: item.PS_IntraF_HOSR_date_2,
                PS_IntraF_HOSR_date_3: item.PS_IntraF_HOSR_date_3,
                PS_IntraF_HOSR_date_4: item.PS_IntraF_HOSR_date_4,
                PS_IntraF_HOSR_date_5: item.PS_IntraF_HOSR_date_5,
                PS_IntraF_HOSR_date_6: item.PS_IntraF_HOSR_date_6,
                PS_IntraF_HOSR_date_7: item.PS_IntraF_HOSR_date_7,
                PS_IntraF_HOSR_date_8: item.PS_IntraF_HOSR_date_8,

            })
        })

        // const rows = data?.data;
        // if (rows && Array.isArray(rows)) {
        //     for (let i = 0; i < rows.length; i++) {
        //         const item = rows[i];
        //         sheet3.addRow({
        //             Circle: item.Short_name ? (getCircleName(item?.Short_name)) : '',
        //             Short_name: item?.Short_name,
        //             site_ID: item?.site_ID,
        //             OEM_GGSN: item?.OEM_GGSN,
        //             ms1_Date: item?.ms1_Date,
        //             project: item?.project,
        //             MV_Freq_Band: item?.MV_Freq_Band,
        //             MV_4G_Data_Volume_GB_week_2: item.MV_4G_Data_Volume_GB_week_2,
        //             MV_4G_Data_Volume_GB_week_1: item.MV_4G_Data_Volume_GB_week_1,
        //             MV_4G_Data_Volume_GB_date_1: item.MV_4G_Data_Volume_GB_date_1,
        //             MV_4G_Data_Volume_GB_date_2: item.MV_4G_Data_Volume_GB_date_2,
        //             MV_4G_Data_Volume_GB_date_3: item.MV_4G_Data_Volume_GB_date_3,
        //             MV_4G_Data_Volume_GB_date_4: item.MV_4G_Data_Volume_GB_date_4,
        //             MV_4G_Data_Volume_GB_date_5: item.MV_4G_Data_Volume_GB_date_5,
        //             MV_4G_Data_Volume_GB_date_6: item.MV_4G_Data_Volume_GB_date_6,
        //             MV_4G_Data_Volume_GB_date_7: item.MV_4G_Data_Volume_GB_date_7,
        //             MV_4G_Data_Volume_GB_date_8: item.MV_4G_Data_Volume_GB_date_8,
        //             MV_Radio_NW_Availability_week_2: item.MV_Radio_NW_Availability_week_2,
        //             MV_Radio_NW_Availability_week_1: item.MV_Radio_NW_Availability_week_1,
        //             MV_Radio_NW_Availability_date_1: item.MV_Radio_NW_Availability_date_1,
        //             MV_Radio_NW_Availability_date_2: item.MV_Radio_NW_Availability_date_2,
        //             MV_Radio_NW_Availability_date_3: item.MV_Radio_NW_Availability_date_3,
        //             MV_Radio_NW_Availability_date_4: item.MV_Radio_NW_Availability_date_4,
        //             MV_Radio_NW_Availability_date_5: item.MV_Radio_NW_Availability_date_5,
        //             MV_Radio_NW_Availability_date_6: item.MV_Radio_NW_Availability_date_6,
        //             MV_Radio_NW_Availability_date_7: item.MV_Radio_NW_Availability_date_7,
        //             MV_Radio_NW_Availability_date_8: item.MV_Radio_NW_Availability_date_8,
        //             MV_VoLTE_raffic_week_2: item.MV_VoLTE_raffic_week_2,
        //             MV_VoLTE_raffic_week_1: item.MV_VoLTE_raffic_week_1,
        //             MV_VoLTE_raffic_date_1: item.MV_VoLTE_raffic_date_1,
        //             MV_VoLTE_raffic_date_2: item.MV_VoLTE_raffic_date_2,
        //             MV_VoLTE_raffic_date_3: item.MV_VoLTE_raffic_date_3,
        //             MV_VoLTE_raffic_date_4: item.MV_VoLTE_raffic_date_4,
        //             MV_VoLTE_raffic_date_5: item.MV_VoLTE_raffic_date_5,
        //             MV_VoLTE_raffic_date_6: item.MV_VoLTE_raffic_date_6,
        //             MV_VoLTE_raffic_date_7: item.MV_VoLTE_raffic_date_7,
        //             MV_VoLTE_raffic_date_8: item.MV_VoLTE_raffic_date_8,

        //             MV_DL_User_Throughput_Kbps_week_2: item.MV_DL_User_Throughput_Kbps_week_2,
        //             MV_DL_User_Throughput_Kbps_week_1: item.MV_DL_User_Throughput_Kbps_week_1,
        //             MV_DL_User_Throughput_Kbps_date_1: item.MV_DL_User_Throughput_Kbps_date_1,
        //             MV_DL_User_Throughput_Kbps_date_2: item.MV_DL_User_Throughput_Kbps_date_2,
        //             MV_DL_User_Throughput_Kbps_date_3: item.MV_DL_User_Throughput_Kbps_date_3,
        //             MV_DL_User_Throughput_Kbps_date_4: item.MV_DL_User_Throughput_Kbps_date_4,
        //             MV_DL_User_Throughput_Kbps_date_5: item.MV_DL_User_Throughput_Kbps_date_5,
        //             MV_DL_User_Throughput_Kbps_date_6: item.MV_DL_User_Throughput_Kbps_date_6,
        //             MV_DL_User_Throughput_Kbps_date_7: item.MV_DL_User_Throughput_Kbps_date_7,
        //             MV_DL_User_Throughput_Kbps_date_8: item.MV_DL_User_Throughput_Kbps_date_8,

        //             MV_E_UTRAN_Average_CQI_week_2: item.MV_E_UTRAN_Average_CQI_week_2,
        //             MV_E_UTRAN_Average_CQI_week_1: item.MV_E_UTRAN_Average_CQI_week_1,
        //             MV_E_UTRAN_Average_CQI_date_1: item.MV_E_UTRAN_Average_CQI_date_1,
        //             MV_E_UTRAN_Average_CQI_date_2: item.MV_E_UTRAN_Average_CQI_date_2,
        //             MV_E_UTRAN_Average_CQI_date_3: item.MV_E_UTRAN_Average_CQI_date_3,
        //             MV_E_UTRAN_Average_CQI_date_4: item.MV_E_UTRAN_Average_CQI_date_4,
        //             MV_E_UTRAN_Average_CQI_date_5: item.MV_E_UTRAN_Average_CQI_date_5,
        //             MV_E_UTRAN_Average_CQI_date_6: item.MV_E_UTRAN_Average_CQI_date_6,
        //             MV_E_UTRAN_Average_CQI_date_7: item.MV_E_UTRAN_Average_CQI_date_7,
        //             MV_E_UTRAN_Average_CQI_date_8: item.MV_E_UTRAN_Average_CQI_date_8,

        //             UL_RSSI_week_2: item.UL_RSSI_week_2,
        //             UL_RSSI_week_1: item.UL_RSSI_week_1,
        //             UL_RSSI_date_1: item.UL_RSSI_date_1,
        //             UL_RSSI_date_2: item.UL_RSSI_date_2,
        //             UL_RSSI_date_3: item.UL_RSSI_date_3,
        //             UL_RSSI_date_4: item.UL_RSSI_date_4,
        //             UL_RSSI_date_5: item.UL_RSSI_date_5,
        //             UL_RSSI_date_6: item.UL_RSSI_date_6,
        //             UL_RSSI_date_7: item.UL_RSSI_date_7,
        //             UL_RSSI_date_8: item.UL_RSSI_date_8,

        //             MV_Average_number_of_used_DL_PRBs_week_2: item.MV_Average_number_of_used_DL_PRBs_week_2,
        //             MV_Average_number_of_used_DL_PRBs_week_1: item.MV_Average_number_of_used_DL_PRBs_week_1,
        //             MV_Average_number_of_used_DL_PRBs_date_1: item.MV_Average_number_of_used_DL_PRBs_date_1,
        //             MV_Average_number_of_used_DL_PRBs_date_2: item.MV_Average_number_of_used_DL_PRBs_date_2,
        //             MV_Average_number_of_used_DL_PRBs_date_3: item.MV_Average_number_of_used_DL_PRBs_date_3,
        //             MV_Average_number_of_used_DL_PRBs_date_4: item.MV_Average_number_of_used_DL_PRBs_date_4,
        //             MV_Average_number_of_used_DL_PRBs_date_5: item.MV_Average_number_of_used_DL_PRBs_date_5,
        //             MV_Average_number_of_used_DL_PRBs_date_6: item.MV_Average_number_of_used_DL_PRBs_date_6,
        //             MV_Average_number_of_used_DL_PRBs_date_7: item.MV_Average_number_of_used_DL_PRBs_date_7,
        //             MV_Average_number_of_used_DL_PRBs_date_8: item.MV_Average_number_of_used_DL_PRBs_date_8,

        //             MV_RRC_Setup_Success_Rate_week_2: item.MV_RRC_Setup_Success_Rate_week_2,
        //             MV_RRC_Setup_Success_Rate_week_1: item.MV_RRC_Setup_Success_Rate_week_1,
        //             MV_RRC_Setup_Success_Rate_date_1: item.MV_RRC_Setup_Success_Rate_date_1,
        //             MV_RRC_Setup_Success_Rate_date_2: item.MV_RRC_Setup_Success_Rate_date_2,
        //             MV_RRC_Setup_Success_Rate_date_3: item.MV_RRC_Setup_Success_Rate_date_3,
        //             MV_RRC_Setup_Success_Rate_date_4: item.MV_RRC_Setup_Success_Rate_date_4,
        //             MV_RRC_Setup_Success_Rate_date_5: item.MV_RRC_Setup_Success_Rate_date_5,
        //             MV_RRC_Setup_Success_Rate_date_6: item.MV_RRC_Setup_Success_Rate_date_6,
        //             MV_RRC_Setup_Success_Rate_date_7: item.MV_RRC_Setup_Success_Rate_date_7,
        //             MV_RRC_Setup_Success_Rate_date_8: item.MV_RRC_Setup_Success_Rate_date_8,

        //             MV_ERAB_Setup_Success_Rate_week_2: item.MV_ERAB_Setup_Success_Rate_week_2,
        //             MV_ERAB_Setup_Success_Rate_week_1: item.MV_ERAB_Setup_Success_Rate_week_1,
        //             MV_ERAB_Setup_Success_Rate_date_1: item.MV_ERAB_Setup_Success_Rate_date_1,
        //             MV_ERAB_Setup_Success_Rate_date_2: item.MV_ERAB_Setup_Success_Rate_date_2,
        //             MV_ERAB_Setup_Success_Rate_date_3: item.MV_ERAB_Setup_Success_Rate_date_3,
        //             MV_ERAB_Setup_Success_Rate_date_4: item.MV_ERAB_Setup_Success_Rate_date_4,
        //             MV_ERAB_Setup_Success_Rate_date_5: item.MV_ERAB_Setup_Success_Rate_date_5,
        //             MV_ERAB_Setup_Success_Rate_date_6: item.MV_ERAB_Setup_Success_Rate_date_6,
        //             MV_ERAB_Setup_Success_Rate_date_7: item.MV_ERAB_Setup_Success_Rate_date_7,
        //             MV_ERAB_Setup_Success_Rate_date_8: item.MV_ERAB_Setup_Success_Rate_date_8,

        //             MV_PS_Drop_Call_Rate_week_2: item.MV_PS_Drop_Call_Rate_week_2,
        //             MV_PS_Drop_Call_Rate_week_1: item.MV_PS_Drop_Call_Rate_week_1,
        //             MV_PS_Drop_Call_Rate_date_1: item.MV_PS_Drop_Call_Rate_date_1,
        //             MV_PS_Drop_Call_Rate_date_2: item.MV_PS_Drop_Call_Rate_date_2,
        //             MV_PS_Drop_Call_Rate_date_3: item.MV_PS_Drop_Call_Rate_date_3,
        //             MV_PS_Drop_Call_Rate_date_4: item.MV_PS_Drop_Call_Rate_date_4,
        //             MV_PS_Drop_Call_Rate_date_5: item.MV_PS_Drop_Call_Rate_date_5,
        //             MV_PS_Drop_Call_Rate_date_6: item.MV_PS_Drop_Call_Rate_date_6,
        //             MV_PS_Drop_Call_Rate_date_7: item.MV_PS_Drop_Call_Rate_date_7,
        //             MV_PS_Drop_Call_Rate_date_8: item.MV_PS_Drop_Call_Rate_date_8,

        //             MV_Max_Connecteda_User_week_2: item.MV_Max_Connecteda_User_week_2,
        //             MV_Max_Connecteda_User_week_1: item.MV_Max_Connecteda_User_week_1,
        //             MV_Max_Connecteda_User_date_1: item.MV_Max_Connecteda_User_date_1,
        //             MV_Max_Connecteda_User_date_2: item.MV_Max_Connecteda_User_date_2,
        //             MV_Max_Connecteda_User_date_3: item.MV_Max_Connecteda_User_date_3,
        //             MV_Max_Connecteda_User_date_4: item.MV_Max_Connecteda_User_date_4,
        //             MV_Max_Connecteda_User_date_5: item.MV_Max_Connecteda_User_date_5,
        //             MV_Max_Connecteda_User_date_6: item.MV_Max_Connecteda_User_date_6,
        //             MV_Max_Connecteda_User_date_7: item.MV_Max_Connecteda_User_date_7,
        //             MV_Max_Connecteda_User_date_8: item.MV_Max_Connecteda_User_date_8,

        //             MV_PUCCH_SINR_week_2: item.MV_PUCCH_SINR_week_2,
        //             MV_PUCCH_SINR_week_1: item.MV_PUCCH_SINR_week_1,
        //             MV_PUCCH_SINR_date_1: item.MV_PUCCH_SINR_date_1,
        //             MV_PUCCH_SINR_date_2: item.MV_PUCCH_SINR_date_2,
        //             MV_PUCCH_SINR_date_3: item.MV_PUCCH_SINR_date_3,
        //             MV_PUCCH_SINR_date_4: item.MV_PUCCH_SINR_date_4,
        //             MV_PUCCH_SINR_date_5: item.MV_PUCCH_SINR_date_5,
        //             MV_PUCCH_SINR_date_6: item.MV_PUCCH_SINR_date_6,
        //             MV_PUCCH_SINR_date_7: item.MV_PUCCH_SINR_date_7,
        //             MV_PUCCH_SINR_date_8: item.MV_PUCCH_SINR_date_8,

        //             MV_Average_UE_Distance_KM_week_2: item.MV_Average_UE_Distance_KM_week_2,
        //             MV_Average_UE_Distance_KM_week_1: item.MV_Average_UE_Distance_KM_week_1,
        //             MV_Average_UE_Distance_KM_date_1: item.MV_Average_UE_Distance_KM_date_1,
        //             MV_Average_UE_Distance_KM_date_2: item.MV_Average_UE_Distance_KM_date_2,
        //             MV_Average_UE_Distance_KM_date_3: item.MV_Average_UE_Distance_KM_date_3,
        //             MV_Average_UE_Distance_KM_date_4: item.MV_Average_UE_Distance_KM_date_4,
        //             MV_Average_UE_Distance_KM_date_5: item.MV_Average_UE_Distance_KM_date_5,
        //             MV_Average_UE_Distance_KM_date_6: item.MV_Average_UE_Distance_KM_date_6,
        //             MV_Average_UE_Distance_KM_date_7: item.MV_Average_UE_Distance_KM_date_7,
        //             MV_Average_UE_Distance_KM_date_8: item.MV_Average_UE_Distance_KM_date_8,


        //             MV_PS_handover_success_rate_LTE_INTER_SYSTEM_week_2: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_week_2,
        //             MV_PS_handover_success_rate_LTE_INTER_SYSTEM_week_1: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_week_1,
        //             MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_1: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_1,
        //             MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_2: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_2,
        //             MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_3: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_3,
        //             MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_4: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_4,
        //             MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_5: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_5,
        //             MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_6: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_6,
        //             MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_7: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_7,
        //             MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_8: item.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_8,

        //             MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_week_2: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_week_2,
        //             MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_week_1: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_week_1,
        //             MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_1: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_1,
        //             MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_2: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_2,
        //             MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_3: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_3,
        //             MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_4: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_4,
        //             MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_5: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_5,
        //             MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_6: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_6,
        //             MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_7: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_7,
        //             MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_8: item.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_8,


        //             UL_RSSI_Nokia_RSSI_SINR_week_2: item.UL_RSSI_Nokia_RSSI_SINR_week_2,
        //             UL_RSSI_Nokia_RSSI_SINR_week_1: item.UL_RSSI_Nokia_RSSI_SINR_week_1,
        //             UL_RSSI_Nokia_RSSI_SINR_date_1: item.UL_RSSI_Nokia_RSSI_SINR_date_1,
        //             UL_RSSI_Nokia_RSSI_SINR_date_2: item.UL_RSSI_Nokia_RSSI_SINR_date_2,
        //             UL_RSSI_Nokia_RSSI_SINR_date_3: item.UL_RSSI_Nokia_RSSI_SINR_date_3,
        //             UL_RSSI_Nokia_RSSI_SINR_date_4: item.UL_RSSI_Nokia_RSSI_SINR_date_4,
        //             UL_RSSI_Nokia_RSSI_SINR_date_5: item.UL_RSSI_Nokia_RSSI_SINR_date_5,
        //             UL_RSSI_Nokia_RSSI_SINR_date_6: item.UL_RSSI_Nokia_RSSI_SINR_date_6,
        //             UL_RSSI_Nokia_RSSI_SINR_date_7: item.UL_RSSI_Nokia_RSSI_SINR_date_7,
        //             UL_RSSI_Nokia_RSSI_SINR_date_8: item.UL_RSSI_Nokia_RSSI_SINR_date_8,


        //             MV_VoLTE_DCR_week_2: item.MV_VoLTE_DCR_week_2,
        //             MV_VoLTE_DCR_week_1: item.MV_VoLTE_DCR_week_1,
        //             MV_VoLTE_DCR_date_1: item.MV_VoLTE_DCR_date_1,
        //             MV_VoLTE_DCR_date_2: item.MV_VoLTE_DCR_date_2,
        //             MV_VoLTE_DCR_date_3: item.MV_VoLTE_DCR_date_3,
        //             MV_VoLTE_DCR_date_4: item.MV_VoLTE_DCR_date_4,
        //             MV_VoLTE_DCR_date_5: item.MV_VoLTE_DCR_date_5,
        //             MV_VoLTE_DCR_date_6: item.MV_VoLTE_DCR_date_6,
        //             MV_VoLTE_DCR_date_7: item.MV_VoLTE_DCR_date_7,
        //             MV_VoLTE_DCR_date_8: item.MV_VoLTE_DCR_date_8,

        //             MV_Packet_Loss_DL_week_2: item.MV_Packet_Loss_DL_week_2,
        //             MV_Packet_Loss_DL_week_1: item.MV_Packet_Loss_DL_week_1,
        //             MV_Packet_Loss_DL_date_1: item.MV_Packet_Loss_DL_date_1,
        //             MV_Packet_Loss_DL_date_2: item.MV_Packet_Loss_DL_date_2,
        //             MV_Packet_Loss_DL_date_3: item.MV_Packet_Loss_DL_date_3,
        //             MV_Packet_Loss_DL_date_4: item.MV_Packet_Loss_DL_date_4,
        //             MV_Packet_Loss_DL_date_5: item.MV_Packet_Loss_DL_date_5,
        //             MV_Packet_Loss_DL_date_6: item.MV_Packet_Loss_DL_date_6,
        //             MV_Packet_Loss_DL_date_7: item.MV_Packet_Loss_DL_date_7,
        //             MV_Packet_Loss_DL_date_8: item.MV_Packet_Loss_DL_date_8,

        //             MV_Packet_Loss_UL_week_2: item.MV_Packet_Loss_UL_week_2,
        //             MV_Packet_Loss_UL_week_1: item.MV_Packet_Loss_UL_week_1,
        //             MV_Packet_Loss_UL_date_1: item.MV_Packet_Loss_UL_date_1,
        //             MV_Packet_Loss_UL_date_2: item.MV_Packet_Loss_UL_date_2,
        //             MV_Packet_Loss_UL_date_3: item.MV_Packet_Loss_UL_date_3,
        //             MV_Packet_Loss_UL_date_4: item.MV_Packet_Loss_UL_date_4,
        //             MV_Packet_Loss_UL_date_5: item.MV_Packet_Loss_UL_date_5,
        //             MV_Packet_Loss_UL_date_6: item.MV_Packet_Loss_UL_date_6,
        //             MV_Packet_Loss_UL_date_7: item.MV_Packet_Loss_UL_date_7,
        //             MV_Packet_Loss_UL_date_8: item.MV_Packet_Loss_UL_date_8,

        //             PS_InterF_HOSR_week_2: item.PS_InterF_HOSR_week_2,
        //             PS_InterF_HOSR_week_1: item.PS_InterF_HOSR_week_1,
        //             PS_InterF_HOSR_date_1: item.PS_InterF_HOSR_date_1,
        //             PS_InterF_HOSR_date_2: item.PS_InterF_HOSR_date_2,
        //             PS_InterF_HOSR_date_3: item.PS_InterF_HOSR_date_3,
        //             PS_InterF_HOSR_date_4: item.PS_InterF_HOSR_date_4,
        //             PS_InterF_HOSR_date_5: item.PS_InterF_HOSR_date_5,
        //             PS_InterF_HOSR_date_6: item.PS_InterF_HOSR_date_6,
        //             PS_InterF_HOSR_date_7: item.PS_InterF_HOSR_date_7,
        //             PS_InterF_HOSR_date_8: item.PS_InterF_HOSR_date_8,

        //             PS_IntraF_HOSR_week_2: item.PS_IntraF_HOSR_week_2,
        //             PS_IntraF_HOSR_week_1: item.PS_IntraF_HOSR_week_1,
        //             PS_IntraF_HOSR_date_1: item.PS_IntraF_HOSR_date_1,
        //             PS_IntraF_HOSR_date_2: item.PS_IntraF_HOSR_date_2,
        //             PS_IntraF_HOSR_date_3: item.PS_IntraF_HOSR_date_3,
        //             PS_IntraF_HOSR_date_4: item.PS_IntraF_HOSR_date_4,
        //             PS_IntraF_HOSR_date_5: item.PS_IntraF_HOSR_date_5,
        //             PS_IntraF_HOSR_date_6: item.PS_IntraF_HOSR_date_6,
        //             PS_IntraF_HOSR_date_7: item.PS_IntraF_HOSR_date_7,
        //             PS_IntraF_HOSR_date_8: item.PS_IntraF_HOSR_date_8,
        //         });
        //     }
        // }



        ///__________ STYLING IN EXCEL TABLE ______________ ///
        // sheet3.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        //     const rows = sheet3.getColumn(1);
        //     const rowsCount = rows['_worksheet']['_rows'].length;
        //     row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        //         cell.alignment = { vertical: 'middle', horizontal: 'center' }
        //         cell.border = {
        //             top: { style: 'thin' },
        //             left: { style: 'thin' },
        //             bottom: { style: 'thin' },
        //             right: { style: 'thin' }
        //         }

        //         if (rowNumber === 2) {
        //             // First set the background of header row
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '223354' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }

        //         if ((rowNumber === 1 && colNumber >= 8 && colNumber <= 17) || (rowNumber === 2 && colNumber >= 8 && colNumber <= 17)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '595959' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }

        //         if ((rowNumber === 1 && colNumber >= 18 && colNumber <= 27) || (rowNumber === 2 && colNumber >= 18 && colNumber <= 27)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '538DD5' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }

        //         if ((rowNumber === 1 && colNumber >= 28 && colNumber <= 37) || (rowNumber === 2 && colNumber >= 28 && colNumber <= 37)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '366092' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 38 && colNumber <= 47) || (rowNumber === 2 && colNumber >= 38 && colNumber <= 47)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: 'DA9694' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 48 && colNumber <= 57) || (rowNumber === 2 && colNumber >= 48 && colNumber <= 57)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '76933C' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 58 && colNumber <= 67) || (rowNumber === 2 && colNumber >= 58 && colNumber <= 67)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '60497A' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 68 && colNumber <= 77) || (rowNumber === 2 && colNumber >= 68 && colNumber <= 77)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '31869B' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 78 && colNumber <= 87) || (rowNumber === 2 && colNumber >= 78 && colNumber <= 87)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: 'E26B0A' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 88 && colNumber <= 97) || (rowNumber === 2 && colNumber >= 88 && colNumber <= 97)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '948A54' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 98 && colNumber <= 107) || (rowNumber === 2 && colNumber >= 98 && colNumber <= 107)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '808080' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 108 && colNumber <= 117) || (rowNumber === 2 && colNumber >= 108 && colNumber <= 117)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '33CCCC' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 118 && colNumber <= 127) || (rowNumber === 2 && colNumber >= 118 && colNumber <= 127)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: 'FF7C80' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 128 && colNumber <= 137) || (rowNumber === 2 && colNumber >= 128 && colNumber <= 137)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: 'FF66CC' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 138 && colNumber <= 147) || (rowNumber === 2 && colNumber >= 138 && colNumber <= 147)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '669900' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 148 && colNumber <= 157) || (rowNumber === 2 && colNumber >= 148 && colNumber <= 157)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '538DD5' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 158 && colNumber <= 167) || (rowNumber === 2 && colNumber >= 158 && colNumber <= 167)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '963634' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 168 && colNumber <= 177) || (rowNumber === 2 && colNumber >= 168 && colNumber <= 177)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '215967' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 178 && colNumber <= 187) || (rowNumber === 2 && colNumber >= 178 && colNumber <= 187)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '974706' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 188 && colNumber <= 197) || (rowNumber === 2 && colNumber >= 188 && colNumber <= 197)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '538DD5' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }

        //         if ((rowNumber === 1 && colNumber >= 198 && colNumber <= 207) || (rowNumber === 2 && colNumber >= 198 && colNumber <= 207)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '948A54' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         if ((rowNumber === 1 && colNumber >= 208 && colNumber <= 217) || (rowNumber === 2 && colNumber >= 208 && colNumber <= 217)) {
        //             cell.fill = {
        //                 type: 'pattern',
        //                 pattern: 'solid',
        //                 fgColor: { argb: '223354' }
        //             }
        //             cell.font = {
        //                 color: { argb: 'FFFFFF' },
        //                 bold: true,
        //                 size: 13,
        //             }
        //         }
        //         // cell.views = [{ state: 'frozen', ySplit: 1 }]

        //     })
        // })



        await workbook.xlsx.writeBuffer().then(item => {
            const blob = new Blob([item], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
            })
            // const url = window.URL.createObjectURL(blob);
            // const anchor = document.createElement('a');
            // anchor.href = url;
            // anchor.download = "LTE_KPI_Trend.xlsx";
            // anchor.click();
            // window.URL.revokeObjectURL(url);
            saveAs(blob, 'LTE_KPI_Trend.xlsx');
        })
        // action(false)


    }

    const handleClose = () => {
        setOpen(false)
    }


    // date send format function .........////
    // const handleDateFormat = (data) => {
    //     const originalDate = new Date(data);

    //     const formattedDate = `${originalDate.getFullYear()}-${String(originalDate.getMonth() + 1).padStart(2, '0')}-${String(originalDate.getDate()).padStart(2, '0')} ${String(originalDate.getHours()).padStart(2, '0')}:${String(originalDate.getMinutes()).padStart(2, '0')}:${String(originalDate.getSeconds()).padStart(2, '0')}`;

    //     return formattedDate
    // }

    // ********** Filter Dialog Box **********//
    // const filterDialog = () => {
    //     return (
    //         <Dialog
    //             open={open}
    //             onClose={handleClose}
    //             keepMounted
    //             style={{ zIndex: 5 }}
    //         >
    //             {/* <DialogTitle><span style={{ fontSize: 22, fontWeight: 'bold' }}><u>Filter Table</u></span></DialogTitle> */}
    //             <DialogContent style={{ backgroundColor: 'rgb(155, 208, 242,0.5)' }}>
    //                 <Stack direction='column'>

    //                     <Box><span style={{ fontSize: 18, fontWeight: 'bold' }}>Range Date Wise </span></Box>
    //                     <Box style={{ height: 'auto', width: 'auto', padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
    //                         <Box style={{ display: 'flex', justifyContent: 'center', placeItems: 'center', fontWeight: 'bold' }}>
    //                             <span>From:</span>
    //                             <LocalizationProvider dateAdapter={AdapterDayjs} >
    //                                 <MobileDateTimePicker value={fromDate} onChange={(e) => { setFromDate(handleDateFormat(e.$d)) }} />
    //                             </LocalizationProvider>
    //                             <span>To:</span>
    //                             <LocalizationProvider dateAdapter={AdapterDayjs}>
    //                                 <MobileDateTimePicker value={toDate} onChange={(e) => { setToDate(handleDateFormat(e.$d)) }} />
    //                             </LocalizationProvider>
    //                         </Box>


    //                         {/* <Box><span style={{ fontWeight: 'bold',fontSize:'16px' }}>From </span><input value={fromDate} max={todayDate} type="date" onChange={(e) => { setFromDate(e.target.value); setDate(''); setDisplayFilter('Range Date Wise:') }} style={{height:'35px',width:'150px',fontSize:'18px',border:'1px solid #eaedf0',borderRadius:5,textAlign:'center'}}/> ~ <span style={{ fontWeight: 'bold',fontSize:'16px' }}>To </span><input  value={toDate} type="date" min={fromDate}  max={todayDate} onChange={(e) => { setToDate(e.target.value); setDate('') }} style={{height:'35px',width:'150px',fontSize:'18px',border:'1px solid #eaedf0',borderRadius:5,textAlign:'center'}}/></Box> */}
    //                     </Box>
    //                 </Stack>
    //             </DialogContent>
    //             <DialogActions style={{ backgroundColor: '#B0D9F3', display: 'flex', justifyContent: 'space-between' }}>
    //                 <Button variant='contained' color='secondary' endIcon={<DeleteOutlineIcon />}>clear</Button>
    //                 <Button variant='contained' color='success' endIcon={<PublishIcon />} >submit</Button>
    //                 <Button onClick={handleClose} variant='contained' color='error' endIcon={<ClearIcon />}>cancel</Button>
    //             </DialogActions>

    //         </Dialog>
    //     )
    // }


    // const handleScroll=(e)=>{
    //     console.log('scroll prop..' , e)

    //     setScrollNo(scrollNo + 2)
    // }

    const handleScroll = () => {
        const scrollableContainer = scrollableContainerRef.current;

        // Calculate the distance between the bottom of the container and the bottom of the scrollable content
        const distanceToBottom = scrollableContainer.scrollHeight - (scrollableContainer.scrollTop + scrollableContainer.clientHeight);

        // Define a threshold to determine when the scrollbar is considered to be at the endpoint
        const threshold = 50; // Adjust as needed

        // Call your function when scrollbar is at the endpoint (within the threshold)
        if (distanceToBottom <= threshold) {
            // console.log('Scrollbar reached the endpoint!');
            setScrollNo(scrollNo + 50)
            // Call your function here
        }
    };




    useEffect(() => {
        if(data){
            setFileData(data.Download_Link)
        }
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 10 }}>
                    <div style={{ margin: 5, marginLeft: 10,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                            <Link underline="hover" onClick={() => { navigate('/tools/zero_rna_payload') }}>Zero RNA Payload</Link>
                            <Typography color='text.primary'>LTE KPI Trend</Typography>
                        </Breadcrumbs>
                        <Box style={{ float: 'right' }}>
                            <Tooltip title="Export Excel">
                                <IconButton type='download' href={link}>
                                    <DownloadIcon fontSize='medium' color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </div>
                    {/* <div style={{ height: 'auto', width: '100%', margin: '5px 0px', border: '1px solid black', borderRadius: '10px', padding: '2px', display: 'flex' }}>
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
                                        <IconButton onClick={() => { handleExport(); }}>
                                            <DownloadIcon fontSize='large' color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        </Grid>

                    </div> */}

                    {/* ************* 4G  TABLE DATA ************** */}

                    <Box >

                        <TableContainer sx={{ maxHeight: '80vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper} ref={scrollableContainerRef} onScroll={handleScroll}>

                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                {/* <tr>
                    <th colspan="8" style={{ fontSize: 24, backgroundColor: "#F1948A", color: "", }}>RANGE WISE</th>
                </tr> */}
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Circle</th>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Cell Name</th>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Site ID</th>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>OEM</th>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>MS1 Date</th>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Project</th>
                                        <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Technology</th>
                                        <th colSpan='7' style={{ width: 150 }}>MV 4G Data Volume GB</th>
                                        <th colSpan='10'>MV Radio NW Availability</th>
                                        <th colSpan='10'>MV VoLTE Raffic</th>
                                        <th colSpan='10'>MV DL User Throughtput Kbps</th>
                                        <th colSpan='10'>MV EUTRAN Average CQI</th>
                                        <th colSpan='10'>UL RSSI</th>
                                        <th colSpan='10'>MV Average Number Of Used DL PRBs</th>
                                        <th colSpan='10'>MV RRC Setup Success Rate</th>
                                        <th colSpan='10'>MV ERAB Setup Success Rate</th>
                                        <th colSpan='10'>MV PS Drop Call Rate</th>
                                        <th colSpan='10'>MV Max Connecteda User</th>
                                        <th colSpan='10'>MV PUCCH SINR</th>
                                        <th colSpan='10'>MV Average UE_Distance KM</th>
                                        <th colSpan='10'>MV PS handover success rate LTE INTER SYSTEM</th>
                                        <th colSpan='10'>MV PS handover success rate LTE INTRA SYSTEM</th>
                                        <th colSpan='10'>UL_RSSI_Nokia_RSSI_SINR</th>
                                        <th colSpan='10'>MV_VoLTE_DCR</th>
                                        <th colSpan='10'>MV_Packet_Loss_DL</th>
                                        <th colSpan='10'>MV_Packet_Loss_UL</th>
                                        <th colSpan='10'>PS_InterF_HOSR</th>
                                        <th colSpan='10'>PS_IntraF_HOSR</th>
                                    </tr>
                                    <tr style={{ fontSize: 14, backgroundColor: "#223354", color: "white", }}>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}> Week-2 </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}

                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}

                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}

                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}

                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}

                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}


                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}

                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}

                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}

                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-1</th>
                                        {data?.dates.map((date) => (
                                            <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                        ))}

                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.data.map((it, index) => index < scrollNo && (
                                        <tr key={index} style={{ textAlign: "center", fontWeigth: 700 }}>
                                            <th >
                                                {it?.Short_name ? getCircleName(it.Short_name) : ''}
                                            </th>
                                            <th >{it?.Short_name}</th>
                                            <th >{it?.site_ID}</th>
                                            <th >{it?.OEM_GGSN}</th>
                                            <th >{it?.ms1_Date}</th>
                                            <th >{it?.project}</th>
                                            <th >{it?.MV_Freq_Band}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_week_2}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_week_1}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_date_1}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_date_2}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_date_3}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_date_4}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_date_5}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_date_6}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_date_7}</th>
                                            <th >{it?.MV_4G_Data_Volume_GB_date_8}</th>
                                            <th >{it?.MV_Radio_NW_Availability_week_2}</th>
                                            <th >{it?.MV_Radio_NW_Availability_week_1}</th>
                                            <th >{it?.MV_Radio_NW_Availability_date_1}</th>
                                            <th >{it?.MV_Radio_NW_Availability_date_2}</th>
                                            <th >{it?.MV_Radio_NW_Availability_date_3}</th>
                                            <th >{it?.MV_Radio_NW_Availability_date_4}</th>
                                            <th >{it?.MV_Radio_NW_Availability_date_5}</th>
                                            <th >{it?.MV_Radio_NW_Availability_date_6}</th>
                                            <th >{it?.MV_Radio_NW_Availability_date_7}</th>
                                            <th >{it?.MV_Radio_NW_Availability_date_8}</th>
                                            <th >{it?.MV_VoLTE_raffic_week_2}</th>
                                            <th >{it?.MV_VoLTE_raffic_week_1}</th>
                                            <th >{it?.MV_VoLTE_raffic_date_1}</th>
                                            <th >{it?.MV_VoLTE_raffic_date_2}</th>
                                            <th >{it?.MV_VoLTE_raffic_date_3}</th>
                                            <th >{it?.MV_VoLTE_raffic_date_4}</th>
                                            <th >{it?.MV_VoLTE_raffic_date_5}</th>
                                            <th >{it?.MV_VoLTE_raffic_date_6}</th>
                                            <th >{it?.MV_VoLTE_raffic_date_7}</th>
                                            <th >{it?.MV_VoLTE_raffic_date_8}</th>
                                            <th >{it?.MV_DL_User_Throughput_Kbps_week_2}</th>
                                            <th >{it?.MV_DL_User_Throughput_Kbps_week_1}</th>
                                            <th >{it?.MV_DL_User_Throughput_Kbps_date_1}</th>
                                            <th >{it?.MV_DL_User_Throughput_Kbps_date_2}</th>
                                            <th >{it?.MV_DL_User_Throughput_Kbps_date_3}</th>
                                            <th >{it?.MV_DL_User_Throughput_Kbps_date_4}</th>
                                            <th >{it?.MV_DL_User_Throughput_Kbps_date_5}</th>
                                            <th >{it?.MV_DL_User_Throughput_Kbps_date_6}</th>
                                            <th >{it?.MV_DL_User_Throughput_Kbps_date_7}</th>
                                            <th >{it?.MV_DL_User_Throughput_Kbps_date_8}</th>
                                            <th >{it?.MV_E_UTRAN_Average_CQI_week_2}</th>
                                            <th >{it?.MV_E_UTRAN_Average_CQI_week_1}</th>
                                            <th >{it?.MV_E_UTRAN_Average_CQI_date_1}</th>
                                            <th >{it?.MV_E_UTRAN_Average_CQI_date_2}</th>
                                            <th >{it?.MV_E_UTRAN_Average_CQI_date_3}</th>
                                            <th >{it?.MV_E_UTRAN_Average_CQI_date_4}</th>
                                            <th >{it?.MV_E_UTRAN_Average_CQI_date_5}</th>
                                            <th >{it?.MV_E_UTRAN_Average_CQI_date_6}</th>
                                            <th >{it?.MV_E_UTRAN_Average_CQI_date_7}</th>
                                            <th >{it?.MV_E_UTRAN_Average_CQI_date_8}</th>
                                            <th >{it?.UL_RSSI_week_2}</th>
                                            <th >{it?.UL_RSSI_week_1}</th>
                                            <th >{it?.UL_RSSI_date_1}</th>
                                            <th >{it?.UL_RSSI_date_2}</th>
                                            <th >{it?.UL_RSSI_date_3}</th>
                                            <th >{it?.UL_RSSI_date_4}</th>
                                            <th >{it?.UL_RSSI_date_5}</th>
                                            <th >{it?.UL_RSSI_date_6}</th>
                                            <th >{it?.UL_RSSI_date_7}</th>
                                            <th >{it?.UL_RSSI_date_8}</th>
                                            <th >{it?.MV_Average_number_of_used_DL_PRBs_week_2}</th>
                                            <th >{it?.MV_Average_number_of_used_DL_PRBs_week_1}</th>
                                            <th >{it?.MV_Average_number_of_used_DL_PRBs_date_1}</th>
                                            <th >{it?.MV_Average_number_of_used_DL_PRBs_date_2}</th>
                                            <th >{it?.MV_Average_number_of_used_DL_PRBs_date_3}</th>
                                            <th >{it?.MV_Average_number_of_used_DL_PRBs_date_4}</th>
                                            <th >{it?.MV_Average_number_of_used_DL_PRBs_date_5}</th>
                                            <th >{it?.MV_Average_number_of_used_DL_PRBs_date_6}</th>
                                            <th >{it?.MV_Average_number_of_used_DL_PRBs_date_7}</th>
                                            <th >{it?.MV_Average_number_of_used_DL_PRBs_date_8}</th>

                                            <th >{it?.MV_RRC_Setup_Success_Rate_week_2}</th>
                                            <th >{it?.MV_RRC_Setup_Success_Rate_week_1}</th>
                                            <th >{it?.MV_RRC_Setup_Success_Rate_date_1}</th>
                                            <th >{it?.MV_RRC_Setup_Success_Rate_date_2}</th>
                                            <th >{it?.MV_RRC_Setup_Success_Rate_date_3}</th>
                                            <th >{it?.MV_RRC_Setup_Success_Rate_date_4}</th>
                                            <th >{it?.MV_RRC_Setup_Success_Rate_date_5}</th>
                                            <th >{it?.MV_RRC_Setup_Success_Rate_date_6}</th>
                                            <th >{it?.MV_RRC_Setup_Success_Rate_date_7}</th>
                                            <th >{it?.MV_RRC_Setup_Success_Rate_date_8}</th>

                                            <th >{it?.MV_ERAB_Setup_Success_Rate_week_2}</th>
                                            <th >{it?.MV_ERAB_Setup_Success_Rate_week_1}</th>
                                            <th >{it?.MV_ERAB_Setup_Success_Rate_date_1}</th>
                                            <th >{it?.MV_ERAB_Setup_Success_Rate_date_2}</th>
                                            <th >{it?.MV_ERAB_Setup_Success_Rate_date_3}</th>
                                            <th >{it?.MV_ERAB_Setup_Success_Rate_date_4}</th>
                                            <th >{it?.MV_ERAB_Setup_Success_Rate_date_5}</th>
                                            <th >{it?.MV_ERAB_Setup_Success_Rate_date_6}</th>
                                            <th >{it?.MV_ERAB_Setup_Success_Rate_date_7}</th>
                                            <th >{it?.MV_ERAB_Setup_Success_Rate_date_8}</th>

                                            <th >{it?.MV_PS_Drop_Call_Rate_week_2}</th>
                                            <th >{it?.MV_PS_Drop_Call_Rate_week_1}</th>
                                            <th >{it?.MV_PS_Drop_Call_Rate_date_1}</th>
                                            <th >{it?.MV_PS_Drop_Call_Rate_date_2}</th>
                                            <th >{it?.MV_PS_Drop_Call_Rate_date_3}</th>
                                            <th >{it?.MV_PS_Drop_Call_Rate_date_4}</th>
                                            <th >{it?.MV_PS_Drop_Call_Rate_date_5}</th>
                                            <th >{it?.MV_PS_Drop_Call_Rate_date_6}</th>
                                            <th >{it?.MV_PS_Drop_Call_Rate_date_7}</th>
                                            <th >{it?.MV_PS_Drop_Call_Rate_date_8}</th>

                                            <th >{it?.MV_Max_Connecteda_User_week_2}</th>
                                            <th >{it?.MV_Max_Connecteda_User_week_1}</th>
                                            <th >{it?.MV_Max_Connecteda_User_date_1}</th>
                                            <th >{it?.MV_Max_Connecteda_User_date_2}</th>
                                            <th >{it?.MV_Max_Connecteda_User_date_3}</th>
                                            <th >{it?.MV_Max_Connecteda_User_date_4}</th>
                                            <th >{it?.MV_Max_Connecteda_User_date_5}</th>
                                            <th >{it?.MV_Max_Connecteda_User_date_6}</th>
                                            <th >{it?.MV_Max_Connecteda_User_date_7}</th>
                                            <th >{it?.MV_Max_Connecteda_User_date_8}</th>

                                            <th >{it?.MV_PUCCH_SINR_week_2}</th>
                                            <th >{it?.MV_PUCCH_SINR_week_1}</th>
                                            <th >{it?.MV_PUCCH_SINR_date_1}</th>
                                            <th >{it?.MV_PUCCH_SINR_date_2}</th>
                                            <th >{it?.MV_PUCCH_SINR_date_3}</th>
                                            <th >{it?.MV_PUCCH_SINR_date_4}</th>
                                            <th >{it?.MV_PUCCH_SINR_date_5}</th>
                                            <th >{it?.MV_PUCCH_SINR_date_6}</th>
                                            <th >{it?.MV_PUCCH_SINR_date_7}</th>
                                            <th >{it?.MV_PUCCH_SINR_date_8}</th>

                                            <th >{it?.MV_Average_UE_Distance_KM_week_2}</th>
                                            <th >{it?.MV_Average_UE_Distance_KM_week_1}</th>
                                            <th >{it?.MV_Average_UE_Distance_KM_date_1}</th>
                                            <th >{it?.MV_Average_UE_Distance_KM_date_2}</th>
                                            <th >{it?.MV_Average_UE_Distance_KM_date_3}</th>
                                            <th >{it?.MV_Average_UE_Distance_KM_date_4}</th>
                                            <th >{it?.MV_Average_UE_Distance_KM_date_5}</th>
                                            <th >{it?.MV_Average_UE_Distance_KM_date_6}</th>
                                            <th >{it?.MV_Average_UE_Distance_KM_date_7}</th>
                                            <th >{it?.MV_Average_UE_Distance_KM_date_8}</th>

                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_week_2}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_week_1}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_1}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_2}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_3}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_4}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_5}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_6}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_7}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTER_SYSTEM_date_8}</th>

                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_week_2}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_week_1}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_1}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_2}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_3}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_4}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_5}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_6}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_7}</th>
                                            <th >{it?.MV_PS_handover_success_rate_LTE_INTRA_SYSTEM_date_8}</th>

                                            <th >{it?.UL_RSSI_Nokia_RSSI_SINR_week_2}</th>
                                            <th >{it?.UL_RSSI_Nokia_RSSI_SINR_week_1}</th>
                                            <th >{it?.UL_RSSI_Nokia_RSSI_SINR_date_1}</th>
                                            <th >{it?.UL_RSSI_Nokia_RSSI_SINR_date_2}</th>
                                            <th >{it?.UL_RSSI_Nokia_RSSI_SINR_date_3}</th>
                                            <th >{it?.UL_RSSI_Nokia_RSSI_SINR_date_4}</th>
                                            <th >{it?.UL_RSSI_Nokia_RSSI_SINR_date_5}</th>
                                            <th >{it?.UL_RSSI_Nokia_RSSI_SINR_date_6}</th>
                                            <th >{it?.UL_RSSI_Nokia_RSSI_SINR_date_7}</th>
                                            <th >{it?.UL_RSSI_Nokia_RSSI_SINR_date_8}</th>


                                            <th >{it?.MV_VoLTE_DCR_week_2}</th>
                                            <th >{it?.MV_VoLTE_DCR_week_1}</th>
                                            <th >{it?.MV_VoLTE_DCR_date_1}</th>
                                            <th >{it?.MV_VoLTE_DCR_date_2}</th>
                                            <th >{it?.MV_VoLTE_DCR_date_3}</th>
                                            <th >{it?.MV_VoLTE_DCR_date_4}</th>
                                            <th >{it?.MV_VoLTE_DCR_date_5}</th>
                                            <th >{it?.MV_VoLTE_DCR_date_6}</th>
                                            <th >{it?.MV_VoLTE_DCR_date_7}</th>
                                            <th >{it?.MV_VoLTE_DCR_date_8}</th>


                                            <th >{it?.MV_Packet_Loss_DL_week_2}</th>
                                            <th >{it?.MV_Packet_Loss_DL_week_1}</th>
                                            <th >{it?.MV_Packet_Loss_DL_date_1}</th>
                                            <th >{it?.MV_Packet_Loss_DL_date_2}</th>
                                            <th >{it?.MV_Packet_Loss_DL_date_3}</th>
                                            <th >{it?.MV_Packet_Loss_DL_date_4}</th>
                                            <th >{it?.MV_Packet_Loss_DL_date_5}</th>
                                            <th >{it?.MV_Packet_Loss_DL_date_6}</th>
                                            <th >{it?.MV_Packet_Loss_DL_date_7}</th>
                                            <th >{it?.MV_Packet_Loss_DL_date_8}</th>

                                            <th >{it?.MV_Packet_Loss_UL_week_2}</th>
                                            <th >{it?.MV_Packet_Loss_UL_week_1}</th>
                                            <th >{it?.MV_Packet_Loss_UL_date_1}</th>
                                            <th >{it?.MV_Packet_Loss_UL_date_2}</th>
                                            <th >{it?.MV_Packet_Loss_UL_date_3}</th>
                                            <th >{it?.MV_Packet_Loss_UL_date_4}</th>
                                            <th >{it?.MV_Packet_Loss_UL_date_5}</th>
                                            <th >{it?.MV_Packet_Loss_UL_date_6}</th>
                                            <th >{it?.MV_Packet_Loss_UL_date_7}</th>
                                            <th >{it?.MV_Packet_Loss_UL_date_8}</th>

                                            <th >{it?.PS_InterF_HOSR_week_2}</th>
                                            <th >{it?.PS_InterF_HOSR_week_1}</th>
                                            <th >{it?.PS_InterF_HOSR_date_1}</th>
                                            <th >{it?.PS_InterF_HOSR_date_2}</th>
                                            <th >{it?.PS_InterF_HOSR_date_3}</th>
                                            <th >{it?.PS_InterF_HOSR_date_4}</th>
                                            <th >{it?.PS_InterF_HOSR_date_5}</th>
                                            <th >{it?.PS_InterF_HOSR_date_6}</th>
                                            <th >{it?.PS_InterF_HOSR_date_7}</th>
                                            <th >{it?.PS_InterF_HOSR_date_8}</th>

                                            <th >{it?.PS_IntraF_HOSR_week_2}</th>
                                            <th >{it?.PS_IntraF_HOSR_week_1}</th>
                                            <th >{it?.PS_IntraF_HOSR_date_1}</th>
                                            <th >{it?.PS_IntraF_HOSR_date_2}</th>
                                            <th >{it?.PS_IntraF_HOSR_date_3}</th>
                                            <th >{it?.PS_IntraF_HOSR_date_4}</th>
                                            <th >{it?.PS_IntraF_HOSR_date_5}</th>
                                            <th >{it?.PS_IntraF_HOSR_date_6}</th>
                                            <th >{it?.PS_IntraF_HOSR_date_7}</th>
                                            <th >{it?.PS_IntraF_HOSR_date_8}</th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </TableContainer>
                    </Box>

                    {/* <button onClick={handleScroll}>onclick</button> */}


                    {/* ************* 2G  TABLE DATA **************

            <Box sx={{ marginTop:5}}>

                <TableContainer sx={{ maxHeight: 540, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                    <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

                        <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                            <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Circle</th>
                                <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Cell Name</th>
                                <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Site ID</th>
                                <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>OEM</th>
                                <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>MS1 Date</th>
                                <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Project</th>
                                <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Technology</th>
                                <th colSpan='7' style={{ width: 150 }}>MV of 2G Cell With Network Availability</th>
                                <th colSpan='7'>Network Availability RNA</th>
                                <th colSpan='7'>MV Total Voice Traffic BBH</th>
                            </tr>
                            <tr style={{ fontSize: 14, backgroundColor: "#223354", color: "white", }}>
                                <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}> Week-2 </th>
                                <th >Week-1</th>
                                {arrDateT2?.map((date) => (
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                ))}
                                <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                <th >Week-1</th>
                                {arrDateT2?.map((date) => (
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                ))}
                                <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Week-2</th>
                                <th >Week-1</th>
                                {arrDateT2?.map((date) => (
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{date}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mainDataT2?.map((it) => (
                                <tr style={{ textAlign: "center", fontWeigth: 700 }}>
                                    <th >{getCircleName(it?.Short_name_nan)}</th>
                                    <th >{it?.Short_name_nan}</th>
                                    <th >{it?.site_ID}</th>
                                    <th >{it?.OEM_GGSN_nan}</th>
                                    <th >{it?.ms1_Date}</th>
                                    <th >{it?.project}</th>
                                    <th >{it?.MV_Freq_Band_nan}</th>
                                    <th >{it?.MV_of_2G_Cell_with_Network_Availability_week_2}</th>
                                    <th >{it?.MV_of_2G_Cell_with_Network_Availability_week_1}</th>
                                    <th >{it?.MV_of_2G_Cell_with_Network_Availability_date_1}</th>
                                    <th >{it?.MV_of_2G_Cell_with_Network_Availability_date_2}</th>
                                    <th >{it?.MV_of_2G_Cell_with_Network_Availability_date_3}</th>
                                    <th >{it?.MV_of_2G_Cell_with_Network_Availability_date_4}</th>
                                    <th >{it?.MV_of_2G_Cell_with_Network_Availability_date_5}</th>
                                    <th >{it?.Network_availability_RNA_week_2}</th>
                                    <th >{it?.Network_availability_RNA_week_1}</th>
                                    <th >{it?.Network_availability_RNA_week_1}</th>
                                    <th >{it?.Network_availability_RNA_week_2}</th>
                                    <th >{it?.Network_availability_RNA_week_3}</th>
                                    <th >{it?.Network_availability_RNA_week_4}</th>
                                    <th >{it?.Network_availability_RNA_week_5}</th>
                                    <th >{it?.MV_Total_Voice_Traffic_BBH_week_2}</th>
                                    <th >{it?.MV_Total_Voice_Traffic_BBH_week_1}</th>
                                    <th >{it?.MV_Total_Voice_Traffic_BBH_date_1}</th>
                                    <th >{it?.MV_Total_Voice_Traffic_BBH_date_2}</th>
                                    <th >{it?.MV_Total_Voice_Traffic_BBH_date_3}</th>
                                    <th >{it?.MV_Total_Voice_Traffic_BBH_date_4}</th>
                                    <th >{it?.MV_Total_Voice_Traffic_BBH_date_5}</th>
                                </tr>
                            ))}

                        </tbody>


                    </table>
                </TableContainer>
            </Box> */}

                </div>
            </Slide>


            {/* {filterDialog()} */}
            {loading}
        </>
    )
}

export default Dashboard4G