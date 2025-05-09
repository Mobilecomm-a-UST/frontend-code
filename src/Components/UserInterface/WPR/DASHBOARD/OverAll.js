import React from 'react'
import { useState } from 'react'
import { postData } from '../../../services/FetchNodeServices'
import { useEffect } from 'react'
import { Box, Grid, Stack, Button } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DownloadIcon from '@mui/icons-material/Download';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PublishIcon from '@mui/icons-material/Publish';
import ClearIcon from '@mui/icons-material/Clear';
import { useStyles } from './../../ToolsCss'
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import GearIcon from '@rsuite/icons/Gear';
import Swal from "sweetalert2";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import * as ExcelJS from 'exceljs'







const OverAll = () => {
  const [week, setWeek] = useState('')
  const [project, setProject] = useState([]);
  const [circle, setCircle] = useState([])
  const [projectWise, setProjectWise] = useState([])
  const [circleWise, setCircleWise] = useState([]);
  const [overAll, setOverAll] = useState([])
  const [projectAgeing, setProjectAgeing] = useState([])
  const [circleArr, setCircleArr] = useState([])
  const [projectArr, setProjectArr] = useState([])
  const [open, setOpen] = useState(false)
  const [loadingBox, setLoadingBox] = useState(false)
  const [displayFilterData, setDisplayFilterData] = useState()
  const classes = useStyles();

  let abortController

  console.log('weeks xxxxxxxxxxxx ', projectAgeing)

  const ProjectWiseArr = []
  const CircleWiseArr = []
  const AgeingWiseArr = []


  const handleChangeProject = (event: SelectChangeEvent<typeof project>) => {
    const {
      target: { value },
    } = event;
    setProject(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleChangeCircle = (event: SelectChangeEvent<typeof circle>) => {
    const {
      target: { value },
    } = event;
    setCircle(
      typeof value === 'string' ? value.split(',') : value,
    );
  };



  const fetchWPRData = async (data) => {
    setLoadingBox(true)
    var formData = new FormData();
    formData.append("Upload_Week", data)
    formData.append("project", project)
    formData.append("circle", circle)
    // formData.append("Week", data)

    const response = await postData('WPR_DPR2/overAll_Dashboard/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })


    console.log('WPR table data', response)

    if (response.status === true) {

      setLoadingBox(false)
      setProjectWise(response.overall_project_data)
      setCircleWise(response.overall_circlewise_data)
      setOverAll(response.overall_data)
      setProjectAgeing(response.project_ageing_data)
      setCircleArr(response.circles)
      setProjectArr(response.project)
    }
    else {
      setLoadingBox(false)
      setProjectWise(response.overall_project_data)
      setCircleWise(response.overall_circlewise_data)
      setOverAll(response.overall_data)
      setProjectAgeing(response.project_ageing)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${response.message}`,
      });
      handleClear();
    }
  }

  const fetchWPRData2 = async (data) => {
    abortController = new AbortController();
    const abortSignal = abortController.signal

    setLoadingBox(true)
    var formData = new FormData();
    // formData.append("Upload_Week", data)
    // formData.append("project", project)
    // formData.append("circle", circle)
    formData.append("Week", data)

    const response = await postData('WPR_DPR2/overAll_Dashboard/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` },signal : abortSignal })

  console.log('qsccsq',response)
    console.log('WPR table data',JSON.parse(response.project_ageing_data) )

    if (response.status === true) {

      setLoadingBox(false)
      setProjectWise(JSON.parse(response.data_project_wise))
      setCircleWise(JSON.parse(response.data_circle_wise))
      setOverAll(response.all_data)
      setProjectAgeing(JSON.parse(response.project_ageing_data))
      // setCircleArr(response.circles)
      // setProjectArr(response.project)
    }
    else {
      setLoadingBox(false)
      // setProjectWise(response.overall_project_data)
      // setCircleWise(response.overall_circlewise_data)
      // setOverAll(response.overall_data)
      // setProjectAgeing(response.project_ageing)
      // Swal.fire({
      //   icon: "error",
      //   title: "Oops...",
      //   text: `${response.message}`,
      // });
      // handleClear();
    }
  }

  // ********** CANCEL API REQUEST  ***********
   const cancelApi=()=>{
    setLoadingBox(false)
     abortController.abort();
   }

  // ********* Over all project site list  ***************
  const fetchProjectSite= async(data)=>{
    var formData = new FormData();
    formData.append("Upload_Week", week)
    formData.append("project", project)
    formData.append("circle", circle)
    formData.append("s_project", data[0])
    formData.append("column_filter", data[1])
    const response = await postData('WPR_DPR2/site_list_request_handler_projectWise/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
    console.log('project wise site :', response)
    localStorage.setItem("wpr_project_site_list", JSON.stringify({'list':response.site_list,'project':data[0],'site':data[1]}));

    window.open(`${window.location.href}/site_list`, "_blank")


  }

  // ********* EXPORT DATA IN EXCEL FORMET **********
  const handleExport = () => {

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Project Summary")
    const sheet1 = workbook.addWorksheet("Project Wise")
    const sheet2 = workbook.addWorksheet("CIRCLE WISE")
    const sheet3 = workbook.addWorksheet("Ageing-data", { properties: { tabColor: { argb: 'FFC0000' } } })
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






    sheet.columns = ([
      { header: 'Milstone', key: 'milstone', width: 10 },
      { header: 'Count', key: 'count', width: 15 },
      { header: 'Percentage', key: 'percent', width: 15 }
    ])
    sheet1.columns = [
      { header: 'Project', key: 'Project', width: 10 },
      { header: 'RAFI	', key: 'RFAI', width: 15 },
      { header: 'MS1	', key: 'MS1_DONE', width: 15 },
      { header: 'MS2', key: 'MS2_DONE', width: 15 },
      { header: 'MS2 GAP', key: 'MS2_GAP', width: 20 },
      { header: 'MS1 %', key: 'MS1_per', width: 15 },
      { header: 'MS2 %', key: 'MS2_per', width: 15 },

    ]
    sheet2.columns = [
      { header: 'Circle', key: 'CIRCLE', width: 10 },
      { header: 'RAFI	', key: 'RFAI', width: 15 },
      { header: 'MS1	', key: 'MS1_DONE', width: 15 },
      { header: 'RAFI vs MS1 GAP', key: 'RAFI_vs_MS1_GAP', width: 25 },
      { header: 'MS2 ', key: 'MS2_DONE', width: 15 },
      { header: 'RAFI vs MS2 GAP', key: 'MS2_Pendency', width: 25 },
      { header: 'MS1 %', key: 'MS1_per', width: 15 },
      { header: 'MS2 %', key: 'MS2_per', width: 15 }
    ]


    sheet3.mergeCells('A1:S1');
    sheet3.mergeCells('A2:A3');
    sheet3.mergeCells('B2:B3');
    sheet3.mergeCells('C2:C3');
    sheet3.mergeCells('D2:F2');
    sheet3.mergeCells('G2:I2');
    sheet3.mergeCells('J2:N2');
    sheet3.mergeCells('O2:S2');
    sheet3.getCell('A1').value = 'OVERALL';
    sheet3.getCell('A2').value = 'Circle';
    sheet3.getCell('B2').value = 'Project';
    sheet3.getCell('C2').value = 'RFAI Done';
    sheet3.getCell('D2').value = 'MS1';
    sheet3.getCell('G2').value = 'MS2';
    sheet3.getCell('J2').value = 'Ageing in Days-MS1';
    sheet3.getCell('O2').value = 'Ageing in Days-MS2';
    sheet3.getCell('D3').value = 'MS1 Done';
    sheet3.getCell('E3').value = 'MS1 Pendency';
    sheet3.getCell('F3').value = 'MS1 %';
    sheet3.getCell('G3').value = 'MS2 Done';
    sheet3.getCell('H3').value = 'MS2 Pendency';
    sheet3.getCell('I3').value = 'MS2 %';
    sheet3.getCell('J3').value = '0-15';
    sheet3.getCell('K3').value = '16-30';
    sheet3.getCell('L3').value = '31-60';
    sheet3.getCell('M3').value = '61-90';
    sheet3.getCell('N3').value = 'GT-90';
    sheet3.getCell('O3').value = '0-15';
    sheet3.getCell('P3').value = '16-30';
    sheet3.getCell('Q3').value = '31-60';
    sheet3.getCell('R3').value = '61-90';
    sheet3.getCell('S3').value = 'GT-90';

    sheet3.columns = [
      { key: 'CIRCLE' },
      { key: 'Project' },
      { key: 'RFAI' },
      { key: 'MS1_DONE' },
      { key: 'MS1_Pendency' },
      { key: 'MS1_per' },
      { key: 'MS2_DONE' },
      { key: 'MS2_Pendency' },
      { key: 'MS2_per' },
      { key: 'MS1_0_15' },
      { key: 'MS1_16_30' },
      { key: 'MS1_31_60' },
      { key: 'MS1_61_90' },
      { key: 'MS1_GT90' },
      { key: 'MS2_0_15' },
      { key: 'MS2_16_30' },
      { key: 'MS2_31_60' },
      { key: 'MS2_61_90' },
      { key: 'MS2_GT90' },


    ]



    // sheet3.autoFilter = 'A3:S3';




    // sheet2.eachRow((row, rowNumber) => {
    //   row.eachCell((cell) => {
    //     cell.alignment = { vertical: 'middle', horizontal: 'center' }

    //     // Set border of each cell
    //     cell.border = {
    //       top: { style: 'thin' },
    //       left: { style: 'thin' },
    //       bottom: { style: 'thin' },
    //       right: { style: 'thin' }
    //     }
    //     if (rowNumber === 1) {
    //       // First set the background of header row
    //       cell.fill = {
    //         type: 'pattern',
    //         pattern: 'solid',
    //         fgColor: { argb: 'f5b914' }
    //       }
    //       cell.font = { size: 12, bold: 500 }
    //     }
    //   })
    // })




    sheet.addRow({
      milstone: 'RAFI',
      count: overAll.total_RFAI,
      percent: '----'
    },)
    sheet.addRow({
      milstone: 'MS1',
      count: overAll.total_Ms1,
      percent: overAll.total_Ms1_per
    })
    sheet.addRow({
      milstone: 'MS2',
      count: overAll.total_Ms2,
      percent: overAll.total_Ms2_per
    })

    projectWise?.map(item => {
      sheet1.addRow({
        Project: item?.Project,
        RFAI: item?.RFAI,
        MS1_DONE: item?.MS1_DONE,
        MS2_DONE: item?.MS2_DONE,
        MS2_GAP: item?.MS2_GAP,
        MS1_per: item?.MS1_per,
        MS2_per: item?.MS2_per
      })
    })
    circleWise?.map(item => {
      sheet2.addRow({
        CIRCLE: item?.CIRCLE,
        RFAI: item?.RFAI,
        MS1_DONE: item?.MS1_DONE,
        RAFI_vs_MS1_GAP: item?.RAFI_vs_MS1_GAP,
        MS2_DONE: item?.MS2_DONE,
        MS2_Pendency: item?.MS2_Pendency,
        MS1_per: item?.MS1_per,
        MS2_per: item?.MS2_per
      })
    })

    projectAgeing?.map(item => {
      sheet3.addRow({
        CIRCLE: item.CIRCLE,
        Project: item.Project,
        RFAI: item.RFAI,
        MS1_DONE: item.MS1_DONE,
        MS1_Pendency: item.MS1_Pendency,
        MS1_per: item.MS1_per,
        MS2_DONE: item.MS2_DONE,
        MS2_Pendency: item.MS2_Pendency,
        MS2_per: item.MS2_per,
        MS1_0_15: item.MS1_0_15,
        MS1_16_30: item.MS1_16_30,
        MS1_31_60: item.MS1_31_60,
        MS1_61_90: item.MS1_61_90,
        MS1_GT90: item.MS1_GT90,
        MS2_0_15: item.MS2_0_15,
        MS2_16_30: item.MS2_16_30,
        MS2_31_60: item.MS2_31_60,
        MS2_61_90: item.MS2_61_90,
        MS2_GT90: item.MS2_GT90,
      })
    })

    const S1Ms2Per = sheet1.getColumn('MS1_per')
    const S1Ms1Per = sheet1.getColumn('MS2_per')
    S1Ms2Per.eachCell((cell, rowNumber) => {
      if (cell.value >= 0 && cell.value <= 50) {
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'fa071e' } }
          ]
        };
      }
      if(cell.value >50 && cell.value <=60 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'EC7063' } }
          ]
        };
      }
      if(cell.value >60 && cell.value <=70 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'F7DC6F' } }
          ]
        };
      }
      if(cell.value >70 && cell.value <=80 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'F4D03F' } }
          ]
        };
      }
      if(cell.value >80 && cell.value <=90 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: '58D68D' } }
          ]
        };
      }
      if(cell.value >90 && cell.value <=95 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: '52BE80' } }
          ]
        };
      }
      if(cell.value >95 && cell.value <=100 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: '27AE60' } }
          ]
        };
      }
    });
    S1Ms1Per.eachCell((cell, rowNumber) => {
      if (cell.value >= 0 && cell.value <= 50) {
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'fa071e' } }
          ]
        };
      }
      if(cell.value >50 && cell.value <=60 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'EC7063' } }
          ]
        };
      }
      if(cell.value >60 && cell.value <=70 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'F7DC6F' } }
          ]
        };
      }
      if(cell.value >70 && cell.value <=80 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'F4D03F' } }
          ]
        };
      }
      if(cell.value >80 && cell.value <=90 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: '58D68D' } }
          ]
        };
      }
      if(cell.value >90 && cell.value <=95 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: '52BE80' } }
          ]
        };
      }
      if(cell.value >95 && cell.value <=100 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: '27AE60' } }
          ]
        };
      }
    });

    const S2Ms2Per = sheet2.getColumn('MS2_per')
    const S2Ms1Per = sheet2.getColumn('MS1_per')
    S2Ms2Per.eachCell((cell, rowNumber) => {
      if (cell.value >= 0 && cell.value <= 50) {
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'fa071e' } }
          ]
        };
      }
      if(cell.value >50 && cell.value <=60 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'EC7063' } }
          ]
        };
      }
      if(cell.value >60 && cell.value <=70 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'F7DC6F' } }
          ]
        };
      }
      if(cell.value >70 && cell.value <=80 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'F4D03F' } }
          ]
        };
      }
      if(cell.value >80 && cell.value <=90 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: '58D68D' } }
          ]
        };
      }
      if(cell.value >90 && cell.value <=95 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: '52BE80' } }
          ]
        };
      }
      if(cell.value >95 && cell.value <=100 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: '27AE60' } }
          ]
        };
      }
    });
    S2Ms1Per.eachCell((cell, rowNumber) => {
      if (cell.value >= 0 && cell.value <= 50) {
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'fa071e' } }
          ]
        };
      }
      if(cell.value >50 && cell.value <=60 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'EC7063' } }
          ]
        };
      }
      if(cell.value >60 && cell.value <=70 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'F7DC6F' } }
          ]
        };
      }
      if(cell.value >70 && cell.value <=80 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: 'F4D03F' } }
          ]
        };
      }
      if(cell.value >80 && cell.value <=90 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: '58D68D' } }
          ]
        };
      }
      if(cell.value >90 && cell.value <=95 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: '52BE80' } }
          ]
        };
      }
      if(cell.value >95 && cell.value <=100 ){
        cell.fill = {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'ffffff' } },
            // { position: 0.5, color: { argb: 'cc8188' } },
            { position: 1, color: { argb: '27AE60' } }
          ]
        };
      }
    });
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
        if(rowNumber === rowsCount)
        {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FE9209' }
          }
          cell.font = {
            color: { argb: 'FFFFFF' },
            bold:true,
            size:13,
          }
        }
        if (rowNumber == 1 || rowNumber == 2 || rowNumber == 3) {
          // First set the background of header row
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'f5b914' }
          }

          cell.views=[{state: 'frozen',ySplit: 3}]
        }

      })
    })
    sheet2.eachRow((row, rowNumber) => {
      const rows = sheet2.getColumn(1);
      const rowsCount = rows['_worksheet']['_rows'].length;
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
        if(rowNumber === rowsCount)
        {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FE9209' }
          }
          cell.font = {
            color: { argb: 'FFFFFF' },
            bold:true,
            size:13,
          }
        }
        if (rowNumber === 1) {
          // First set the background of header row
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'f5b914' }
          }
          cell.font = { size: 13, bold: 500 }
        }
      })
    })
    sheet1.eachRow((row, rowNumber) => {
      const rows = sheet1.getColumn(1);
      const rowsCount = rows['_worksheet']['_rows'].length;
        row.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
          if(rowNumber === rowsCount)
          {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FE9209' }
            }
            cell.font = {
              color: { argb: 'FFFFFF' },
              bold:true,
              size:13,
            }
          }
          if (rowNumber === 1) {
            // First set the background of header row
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'f5b914' }
            }
            cell.font = { size: 13, bold: 500 }
          }
        })
    })
    sheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
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
            fgColor: { argb: 'f5b914' }
          }
        }
      })
    })
    sheet3.views=[
      {state: 'frozen', ySplit: 3}
    ];



    workbook.xlsx.writeBuffer().then(item => {
      const blob = new Blob([item], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
      })
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = "wpr_data.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    })

  }




  // ___________ OVERALL PROJECT DATA 2022 TO 2023  ______________/ /
  const overAllProjectData = () => {
    if (overAll != null) {
      // document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ')}`
      return (
        <>
          <tbody style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid black' }}>
            <tr>
              <td>RAFI</td>
              <td>{overAll.total_RFAI}</td>
              <td>---</td>
            </tr>
            <tr>
              <td>MS1</td>
              <td>{overAll.total_Ms1}</td>
              <td style={{ background: 'hsla(' + overAll.total_Ms1_per * 1.2 + ',100%,55%,0.7)' }}>{overAll.total_Ms1_per}%</td>
            </tr>
            <tr>
              <td>MS2</td>
              <td>{overAll.total_Ms2}</td>
              <td style={{ background: 'hsla(' + overAll.total_Ms2_per * 1.2 + ',100%,55%,0.7)' }}>{overAll.total_Ms2_per}%</td>
            </tr>
          </tbody>
        </>
      )

    }
  }

  // ________ COLOR CONDITIONS __________//

  const colorCondtion = (status) => {
    if (status > 0 && status <= 50) {
      return '#E74C3C';
    }
    else if (status > 50 && status <= 60) {
      return '#EC7063';
    }
    else if (status > 60 && status <= 70) {
      return '#F7DC6F';
    }
    else if (status > 70 && status <= 80) {
      return '#F4D03F';
    }
    else if (status > 80 && status <= 90) {
      return '#58D68D';
    }
    else if (status > 90 && status <= 95) {
      return '#52BE80';
    }
    else if (status > 95 && status <= 100) {
      return '#27AE60';
    }


  }

  // _____________ PROJECT WISE TABLE DATA __________///
  const projectWiseTableData = () => {
    // var arr = [];
    // if (projectWise != null) {
    //   Object.keys(projectWise)?.map((item) => {
    //     arr.push({ ...projectWise[item], project: item });
    //     ProjectWiseArr.push({ ...projectWise[item], project: item });
    //   });
    // }

    return projectWise?.map((item, index) => {
      if (item.project == 'Total') {
        return (
          <>
            <tr key={item} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.project}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.RFAI}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.Ms1}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.Ms2}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.Ms2_Gap}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.Ms1_Per}%</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.Ms2_per}%</td>
            </tr>
          </>

        )
      }
      else {
        return (
          <>
            <tr key={item} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.Project}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black',cursor:'pointer' }} className={classes.hover} onClick={()=>{fetchProjectSite([item.project,'RFAI'])}}>{item.RFAI}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black',cursor:'pointer' }} className={classes.hover} onClick={()=>{fetchProjectSite([item.project,'MS1'])}}>{item.MS1_DONE}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black',cursor:'pointer' }} className={classes.hover} onClick={()=>{fetchProjectSite([item.project,'MS2'])}}>{item.MS2_DONE}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.MS2_GAP}</td>
              {/* <td style={{ fontWeight: 'bold', border: '1px solid black', background: 'hsla(' + Math.ceil(item.Ms1_Per * 1.2) + ',100%,60%,0.8)' }} >{item.Ms1_Per}%</td> */}
              <td style={{ fontWeight: 'bold', border: '1px solid black', background:  colorCondtion(item.MS1_per) }} >{item.MS1_per}%</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black', backgroundColor: colorCondtion(item.MS2_per) }} >{item.MS2_per}%</td>
            </tr>
          </>

        )
      }

    })
  }

  // ________________ CIRCLE WISE TABLE DATA ______________//
  const circleWisTableData = () => {
    // var arr = [];
    // if (circleWise != null) {
    //   Object.keys(circleWise)?.map((item) => {
    //     arr.push({ ...circleWise[item], circle: item });
    //     CircleWiseArr.push({ ...circleWise[item], circle: item });
    //   });
    // }
    return circleWise?.map((item, index) => {
      if (item.CIRCLE == null) {
        return (
          <>
            <tr key={item} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >Total</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.RFAI}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.MS1_DONE}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.RAFI_vs_MS1_GAP}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.MS2_DONE}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.MS2_Pendency}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.MS1_Per}%</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.MS2_per}%</td>
            </tr>
          </>

        )
      }
      else {
        return (
          <>
            <tr key={item} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.CIRCLE}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.RFAI}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.MS1_DONE}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.RAFI_vs_MS1_GAP}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.MS2_DONE}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black' }} >{item.MS2_Pendency}</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black', background: colorCondtion(item.MS1_per)}} >{item.MS1_per}%</td>
              <td style={{ fontWeight: 'bold', border: '1px solid black', background: colorCondtion(item.MS2_per)}} >{item.MS2_per}%</td>
            </tr>
          </>
        )
      }
    })
  }

  // ____________ PROJECT AJGEING TABLE DATA _______________//

  const projectAgeingTableData = () => {
    // var arr = [];
    // if (projectAgeing != null) {
    //   Object.keys(projectAgeing)?.map((item) => {
    //     Object.keys(projectAgeing[item])?.map((itm) => {
    //       arr.push({ ...projectAgeing[item][itm], project: itm, circle: item });
    //       AgeingWiseArr.push({ ...projectAgeing[item][itm], project: itm, circle: item });
    //     });
    //   });
    // }
    return projectAgeing?.map((it, i) => {
      if (it.CIRCLE === null) {
        return (
          <tr key={i} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
            <th>Total</th>
            <th>Total</th>
            <th>{it.RFAI}</th>
            <th>{it.MS1_DONE}</th>
            <th>{it.MS1_Pendency}</th>
            <th>{it.MS1_per}</th>
            <th>{it.MS2_DONE}</th>
            <th>{it.MS2_Pendency}</th>
            <th>{it.MS2_per}</th>
            <th>{it.MS1_0_15}</th>
            <th>{it.MS1_16_30}</th>
            <th>{it.MS1_31_60}</th>
            <th>{it.MS1_61_90}</th>
            <th>{it.MS1_GT90}</th>
            <th>{it.MS2_0_15}</th>
            <th>{it.MS2_16_30}</th>
            <th>{it.MS2_31_60}</th>
            <th>{it.MS2_61_90}</th>
            <th>{it.MS2_GT90}</th>
          </tr>
        );
      }
      else {
        return (
          <tr key={i} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
            <th>{it.CIRCLE}</th>
            <th>{it.Project}</th>
            <th>{it.RFAI}</th>
            <th>{it.MS1_DONE}</th>
            <th>{it.MS1_Pendency}</th>
            <th>{it.MS1_per}</th>
            <th>{it.MS2_DONE}</th>
            <th>{it.MS2_Pendency}</th>
            <th>{it.MS2_per}</th>
            <th>{it.MS1_0_15}</th>
            <th>{it.MS1_16_30}</th>
            <th>{it.MS1_31_60}</th>
            <th>{it.MS1_61_90}</th>
            <th>{it.MS1_GT90}</th>
            <th>{it.MS2_0_15}</th>
            <th>{it.MS2_16_30}</th>
            <th>{it.MS2_31_60}</th>
            <th>{it.MS2_61_90}</th>
            <th>{it.MS2_GT90}</th>
          </tr>
        );
      }

    });
  };




  const handleClose = () => {
    setOpen(false)
  }
  // ***********Handle Submit *************//
  const handleSubmit = () => {

    if (circle.length > 0 && project.length > 0) {
      setDisplayFilterData("Week:" + week + " Circle:" + circle + " Project:" + project)
    }
    else if (circle.length > 0) {
      setDisplayFilterData("Week:" + week + " Circle:" + circle)
    }
    else if (project.length > 0) {
      setDisplayFilterData("Week:" + week + " Project:" + project)
    }
    else {
      setDisplayFilterData("Week : " + week)
    }


    fetchWPRData(week);
    setOpen(false);
  }

  // ********** ANNUAL WEEK  **************
  const annualWeek = () => {
    var arr = [];
    for (let i = 1; i <= 52; i++) {
      arr.push(i)
    }
    return arr.map((item) => {
      return (
        <MenuItem key={item} value={item}>Week {item}</MenuItem>
      )
    })
  }

  // ********** Filter Dialog Box **********//
  const filterDialog = () => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        keepMounted
        style={{ zIndex: 5 }}
      >
        {/* <DialogTitle><span style={{ fontSize: 22, fontWeight: 'bold' }}><u>Filter Table</u></span></DialogTitle> */}
        <DialogContent style={{ backgroundColor: '#9BD0F2' }}>
          <Stack direction='column'>

            {/*______________ WEEKS SELECTER ____________*/}
            <Box style={{ fontSize: 18, fontWeight: 'bold' }}> Week Wise</Box>
            <Box style={{ height: 'auto', width: "auto", padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
              <Box style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 5 }}>
                <div >
                  <Select value={week} onChange={(e) => { setWeek(e.target.value) }} >
                    <MenuItem value="" disabled selected hidden>Annual Week</MenuItem>
                    {annualWeek()}
                  </Select>
                </div>
              </Box>
            </Box>

            {/*____________  PROJECT SELECTER ___________*/}
            <Box style={{ fontSize: 18, fontWeight: 'bold' }}> Project Wise</Box>
            <Box style={{ height: 'auto', width: "auto", padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
              <Box style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 5 }}>
                <div >
                  <Select
                    multiple
                    value={project}
                    onChange={handleChangeProject}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {projectArr?.map((name, index) => (
                      <MenuItem key={index} value={name}>
                        <Checkbox checked={project.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}

                  </Select>
                </div>
              </Box>
            </Box>
            {/*____________  CIRCLE SELECTER ___________*/}
            <Box style={{ fontSize: 18, fontWeight: 'bold' }}> Circle Wise</Box>
            <Box style={{ height: 'auto', width: "auto", padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
              <Box style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 5 }}>
                <div >
                  <Select
                    multiple
                    value={circle}
                    onChange={handleChangeCircle}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {circleArr?.map((name, index) => (
                      <MenuItem key={index} value={name}>
                        <Checkbox checked={circle.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}

                  </Select>
                </div>
              </Box>
            </Box>

          </Stack>
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#B0D9F3', display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleClear} variant='contained' color='secondary' endIcon={<DeleteOutlineIcon />}>clear</Button>
          <Button onClick={() => { handleSubmit() }} variant='contained' color='success' endIcon={<PublishIcon />} >submit</Button>
          <Button onClick={handleClose} variant='contained' color='error' endIcon={<ClearIcon />}>cancel</Button>
        </DialogActions>

      </Dialog>
    )
  }

  // DATA PROCESSING DIALOG BOX...............
  const loadingDialog = () => {
    return (
      <Dialog
        open={loadingBox}

        // TransitionComponent={Transition}
        keepMounted
      // aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent style={{height:'300px',width:'600px'}}>
          <Box style={{ padding: 20, display: 'flex',flexDirection:'column', justifyContent: "center",gap:'20px' }}>
          <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
          <Box style={{ textAlign: 'center',fontWeight:'bold',fontSize:'20px' }}>DATA LOADING ....</Box>
          <Button   variant="contained"  style={{backgroundColor:"red",color:'white'}} onClick={cancelApi} endIcon={<DoDisturbIcon />}>cancel</Button>
          </Box>
        </DialogContent>

      </Dialog>
    )
  }

  const getCurrentWeekData = async () => {
    var currentDate = new Date();
    var year = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - year) / (24 * 60 * 60 * 1000));
    var weeks = Math.ceil(((currentDate.getDay() + 1 + days) / 7) - 1);
    console.log("Week Number of the current date (" + currentDate.getDay() + ") is : " + weeks);
    setWeek(weeks)
    // fetchWPRData(weeks)
    fetchWPRData2(weeks)
    setDisplayFilterData("Week : " + weeks)
    // setDisplayFilterData('Current Week :' + (weeks))


  }


  useEffect(() => {
    getCurrentWeekData();
    // useEffect(()=>{
      document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
    // },[])

  }, [])



  const handleClear = () => {
    setWeek('');
    setCircle([]);
    setProject([])
    setDisplayFilterData('Data not found...')


  }



  return (
    <>
      <style>{"th,td{border:1px solid black;}"}</style>
      <div style={{ margin: 10, marginLeft: 1 }}>
            <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
              <Link underline="hover" href='/tools'>Tools</Link>
              <Link underline="hover" href='/tools/wpr'>WPR</Link>
              <Typography color='text.primary'>Over All</Typography>
            </Breadcrumbs>
          </div>
      <div style={{ margin: 15 }}>
        {/*__________________ FILTER BOX _______________*/}
        <div style={{ height: 'auto', width: '100%', margin: '5px 0px', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', borderRadius: '10px', padding: '2px', display: 'flex' }}>
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
        {/*________________ HTML TABLE DATA  ________________  */}
        <div style={{ width: "100%", marginTop: 15, display: "grid", gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'auto', gridColumnGap: '20px' }}>
          <div style={{ boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px' }}>
            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse' }}>
              <thead >
                <tr>
                  <th colspan="3" style={{ fontSize: 20, color: "black", backgroundColor: '#F1948A' }}>Project Summary of week {week}</th>
                </tr>
                <tr style={{ fontSize: 16, backgroundColor: "#223354", color: "white", }}>
                  <th>Milstone</th>
                  <th>Count </th>
                  <th>Percentage</th>
                </tr>
              </thead>
              {overAllProjectData()}
            </table>
          </div>
          <div style={{ boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px' }}>
            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse' }}>
              <thead >
                <tr>
                  <th colspan="7" style={{ fontSize: 20, color: "black", backgroundColor: '#F1948A' }}>Overall Project Wise</th>
                </tr>
                <tr style={{ fontSize: 16, backgroundColor: "#223354", color: "white", }}>
                  <th>Project</th>
                  <th>RFAI</th>
                  <th>MS1</th>
                  <th>MS2</th>
                  <th>MS2 GAP</th>
                  <th>MS1 %</th>
                  <th>MS2 %</th>
                </tr>
              </thead>
              <tbody>
                {projectWiseTableData()}
              </tbody>
            </table>
          </div>
          <div />
        </div>
        <div style={{ width: "100%", marginTop: 15, display: "grid", gridTemplateColumns: 'repeat(1, 1fr)', gridTemplateRows: 'auto', gridColumnGap: '20px' }}>
          <div style={{ boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px' }}>
            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse' }}>
              <thead >
                <tr>
                  <th colspan="8" style={{ fontSize: 20, color: "black", backgroundColor: '#F1948A' }}>Overall Circle Wise</th>
                </tr>
                <tr style={{ fontSize: 16, backgroundColor: "#223354", color: "white", }}>
                  <th rowSpan="2">Circle</th>
                  <th rowSpan="2">RAFI</th>
                  <th rowSpan="2">MS1</th>
                  <th rowSpan="2">RAFI vs MS1 GAP</th>
                  <th rowSpan="2">MS2</th>
                  <th rowSpan="2">RAFI vs MS2 GAP</th>
                  <th colSpan="2">Percentage</th>
                </tr>
                <tr style={{ fontSize: 16, backgroundColor: "#223354", color: "white", }}>
                  <th>MS1 %</th>
                  <th>MS2 %</th>
                </tr>
              </thead>
              <tbody>
                {circleWisTableData()}
              </tbody>
            </table>
          </div>
          <div style={{ width: "100%", marginTop: 15, display: "grid", gridTemplateColumns: 'repeat(1, 1fr)', gridTemplateRows: 500, gridColumnGap: '20px' }}>
            <div style={{ boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', overflowY: 'scroll' }}>
              <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0 }}>
                  <tr>
                    <th colSpan="19" style={{ fontSize: 20, color: "black", backgroundColor: '#F1948A' }}>Project Ageing</th>
                  </tr>
                  <tr style={{ fontSize: 16, backgroundColor: "#223354", color: "white", }}>
                    <th rowSpan="2">Circle</th>
                    <th rowSpan="2">Project</th>
                    <th rowSpan="2">RFAI</th>
                    <th colSpan="3">MS1</th>
                    <th colSpan="3">MS2</th>
                    <th colSpan="5">Ageing in Days-MS1</th>
                    <th colSpan="5">Ageing in Days-MS2</th>
                  </tr>
                  <tr style={{ fontSize: 16, backgroundColor: "#223354", color: "white", }}>
                    <th>MS1 Done</th>
                    <th>MS1 Pendency</th>
                    <th>MS1 %</th>
                    <th>MS2 Done</th>
                    <th>MS2 Pendency</th>
                    <th>MS2 %</th>
                    <th>0-15</th>
                    <th>16-30</th>
                    <th>31-60</th>
                    <th>61-90</th>
                    <th>GT90</th>
                    <th>0-15</th>
                    <th>16-30</th>
                    <th>31-60</th>
                    <th>61-90</th>
                    <th>GT90</th>
                  </tr>
                </thead>
                <tbody>
                  {projectAgeingTableData()}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
      {filterDialog()}
      {loadingDialog()}

    </>

  )
}

export default OverAll