import React, { useEffect, useState } from 'react'
import { Chart as Chartjs } from 'chart.js/auto'
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark'
import { postData, getData, ServerURL } from '../../../../services/FetchNodeServices';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Button } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" timeout={2500} style={{ transformOrigin: '0 0 0' }} mountOnEnter unmountOnExit ref={ref} {...props} />;
});


const ProjectWise = () => {
    const [circle, setCircle] = useState('ALL')
    const [circleArr, setCircleArr] = useState(['ALL'])
    const [project, setProject] = useState('ULS')
    const [projectArr, setProjectArr] = useState([])
    const [vendor, setVendor] = useState(['ALL'])
    const [status, setStatus] = useState('True');
    const [monthDoneCount, setMonthDoneCount] = useState([])
    const [monthProjectCount, setMonthProjectCount] = useState([])
    const [selectVendor, setSelectVendor] = useState('ALL')
    const [month, setMonth] = useState(['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'])
    const [selectMonth, setSelectMonth] = useState('')
    const [nEW_TOWER_ULS, setNEW_TOWER_ULS] = useState([])
    const [nEW_TOWER, setNEW_TOWER] = useState([])
    const [nEW_SECTOR_ADDITION, setNEW_SECTOR_ADDITION] = useState([])
    const [m_MIMO, setM_MIMO] = useState([])
    const [uPGRADE_SW_ONLY, setUPGRADE_SW_ONLY] = useState([])
    const [fDD_UPGRADE, setFDD_UPGRADE] = useState([])
    const [uPGRADE_ULS, setUPGRADE_ULS] = useState([])
    const [fDD_TWIN_BEAM, setFDD_TWIN_BEAM] = useState([])
    const [l900_UPGRADE, setL900_UPGRADE] = useState([])
    const [oEM_SWAP, setOEM_SWAP] = useState([])
    const [tDD_UPGRADE, setTDD_UPGRADE] = useState([])
    const [g2G_UPGRADE, setG2G_UPGRADE] = useState([])
    const [tDD_TWIN_BEAM, setTDD_TWIN_BEAM] = useState([])
    const [g2G_SEC_ADDITION, setG2G_SEC_ADDITION] = useState([])
    const [l2100_UPGRADE, setL2100_UPGRADE] = useState([])
    const [fDD_SEC_ADDITION, setFDD_SEC_ADDITION] = useState([])
    const [tDD_SEC_ADDITION, setTDD_SEC_ADDITION] = useState([])
    const [mobility , setMobility] = useState([])
    const [open, setOpen] = useState(false)

    const [allData, setAllData] = useState([])
    const [graphType, setGraphType] = useState(false);
    const ProjectArrs = ['NEW_TOWER_ULS', 'NEW_TOWER', 'NEW_SECTOR_ADDITION', 'M_MIMO', 'UPGRADE_SW_ONLY', 'FDD_UPGRADE', 'UPGRADE_ULS', 'FDD_TWIN_BEAM', 'L900_UPGRADE', 'OEM_SWAP', 'TDD_UPGRADE', '2G_UPGRADE', 'TDD_TWIN_BEAM', '2G_SEC_ADDITION', 'L2100_UPGRADE', 'FDD_SEC_ADDITION', 'TDD_SEC_ADDITION']
    let delayed;
    // console.log('NEW TOWER', nEW_TOWER)



    const fetchSelectedData = async () => {
        const response = await getData('MDP/UBR/unique_column_value/')
        console.log('project Circle data......2222', response)
        setCircleArr([...circleArr, ...response.circle])
        setVendor([...vendor, ...response.partner])
        setProjectArr(response.project)
        getProjectFilterData();
    }


    const getProjectFilterData = async () => {

        const formData = new FormData();
        formData.append("CIRCLE", circle)
        formData.append("Partner", selectVendor)
        formData.append("DONE_COUNT", status)
        const response = await postData('MDP/UBR/project_comparision/', formData)
        // console.log('qsssssssssssssssss@@@@@@', response)

        const overAll = response.overall_data
        month?.map((item) => {
            var filterMonth = overAll?.filter((its) => (its.Month === item))
            if (filterMonth.length === 0) {
                setAllData((prev) => [...prev, 0])
            }
            else {
                filterMonth?.map((item) => {
                    setAllData((prev) => [...prev, item.sum_projected_count])
                })
            }
        })

        // this is for all vendor
        month?.map((items) => {
            var filterCircle = response.data?.filter((item) => (item.Month === items))
            console.log('1q1q1q1q1qqqq', filterCircle,{nEW_TOWER_ULS})
            const lenghtArr = filterCircle.length

            if (lenghtArr === 0) {
                console.log('IF wali condition')
                setMobility((prev)=>[...prev , 0])
            }
            else {
                //  console.log('1111177777',filterCircle)
                var tempArr = [];
                filterCircle.map((it) => {

                    console.log('else wali condition', it)

                    if (it.Project === "Mobility") {
                        // setOverAll((prev) => [...prev, [NEW_TOWER_ULS]:it.Counting])
                        setMobility((prev) => [...prev, it.Counting])
                        tempArr.push(it.Project)
                        // console.warn('Mobilecomm for data')
                    }
                })
                // console.log('temp Arr' , tempArr)
                for (var i = 0; i < ProjectArrs.length; i++) {
                    if (!tempArr.includes(ProjectArrs[i])) {
                        switch (ProjectArrs[i]) {
                            case "Mobility":
                                setMobility((prev) => [...prev, ''])
                                break;
                        }
                    }
                }
            }


        })

    }

    const getProjectDataForCircle = async (props) => {
        const formData = new FormData();
        formData.append("CIRCLE", props)
        formData.append("Partner", selectVendor)
        formData.append("DONE_COUNT", status)
        const response = await postData('MDP/UBR/project_comparision/', formData)
        // console.log('qsssssssssssssssss', response)
        const overAll = response.overall_data

        month?.map((item) => {
            var filterMonth = overAll?.filter((its) => (its.Month === item))
            if (filterMonth.length === 0) {
                setAllData((prev) => [...prev, 0])
            }
            else {
                filterMonth?.map((item) => {
                    setAllData((prev) => [...prev, item.sum_projected_count])
                })
            }
        })

        // this is for all vendor
        month?.map((items) => {
            var filterCircle = response.data?.filter((item) => (item.Month === items))
            console.log('1q1q1q1q1qqqq', filterCircle,{nEW_TOWER_ULS})
            const lenghtArr = filterCircle.length

            if (lenghtArr === 0) {
                console.log('IF wali condition')
                setMobility((prev)=>[...prev , 0])
            }
            else {
                //  console.log('1111177777',filterCircle)
                var tempArr = [];
                filterCircle.map((it) => {

                    console.log('else wali condition', it)

                    if (it.Project === "Mobility") {
                        // setOverAll((prev) => [...prev, [NEW_TOWER_ULS]:it.Counting])
                        setMobility((prev) => [...prev, it.Counting])
                        tempArr.push(it.Project)
                        // console.warn('Mobilecomm for data')
                    }
                })
                // console.log('temp Arr' , tempArr)
                for (var i = 0; i < ProjectArrs.length; i++) {
                    if (!tempArr.includes(ProjectArrs[i])) {
                        switch (ProjectArrs[i]) {
                            case "Mobility":
                                setMobility((prev) => [...prev, ''])
                                break;
                        }
                    }
                }
            }


        })
    }

    const getProjectDataForVendor = async (props) => {
        const formData = new FormData();
        formData.append("CIRCLE", circle)
        formData.append("Partner", props)
        formData.append("DONE_COUNT", status)
        const response = await postData('MDP/UBR/project_comparision/', formData)
        // console.log('qsssssssssssssssss',response.data,"MONTH", month)
        const overAll = response.overall_data

        month?.map((item) => {
            var filterMonth = overAll?.filter((its) => (its.Month === item))
            if (filterMonth.length === 0) {
                setAllData((prev) => [...prev, 0])
            }
            else {
                filterMonth?.map((item) => {
                    setAllData((prev) => [...prev, item.sum_projected_count])
                })
            }
        })

        // this is for all vendor
        month?.map((items) => {
            var filterCircle = response.data?.filter((item) => (item.Month === items))
            console.log('1q1q1q1q1qqqq', filterCircle,{nEW_TOWER_ULS})
            const lenghtArr = filterCircle.length

            if (lenghtArr === 0) {
                console.log('IF wali condition')
                setMobility((prev)=>[...prev , 0])
            }
            else {
                //  console.log('1111177777',filterCircle)
                var tempArr = [];
                filterCircle.map((it) => {

                    console.log('else wali condition', it)

                    if (it.Project === "Mobility") {
                        // setOverAll((prev) => [...prev, [NEW_TOWER_ULS]:it.Counting])
                        setMobility((prev) => [...prev, it.Counting])
                        tempArr.push(it.Project)
                        // console.warn('Mobilecomm for data')
                    }
                })
                // console.log('temp Arr' , tempArr)
                for (var i = 0; i < ProjectArrs.length; i++) {
                    if (!tempArr.includes(ProjectArrs[i])) {
                        switch (ProjectArrs[i]) {
                            case "Mobility":
                                setMobility((prev) => [...prev, ''])
                                break;
                        }
                    }
                }
            }


        })
    }





    const data = {
        labels: month,
        datasets: [
            {
                label: 'Mobility',
                data: mobility,
                borderColor: 'rgba(15, 255, 79, 0.53)',
                backgroundColor: ['rgba(15, 255, 79, 0.53)'],
                borderWidth: 3,
                color: 'red',
                fill: false,
                tension: 0.3
            },
            // {
            //     label: 'NEW TOWER',
            //     data: nEW_TOWER,
            //     borderColor: 'rgb(158, 221, 255, 0.53)',
            //     backgroundColor: ['rgb(158, 221, 255, 0.83)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'NEW SECTOR ADDITION',
            //     data: nEW_SECTOR_ADDITION,
            //     borderColor: 'rgb(176, 217, 177, 0.53)',
            //     backgroundColor: ['rgb(176, 217, 177, 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'M MIMO',
            //     data: m_MIMO,
            //     borderColor: 'rgb(157, 118, 193, 0.53)',
            //     backgroundColor: ['rgb(157, 118, 193, 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'UPGRADE_SW_ONLY',
            //     data: uPGRADE_SW_ONLY,
            //     borderColor: 'rgb(247, 140, 162, 0.53)',
            //     backgroundColor: ['rgb(247, 140, 162, 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'FDD_UPGRADE',
            //     data: fDD_UPGRADE,
            //     borderColor: 'rgb(239, 180, 149, 0.53)',
            //     backgroundColor: ['rgb(239, 180, 149, 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'UPGRADE_ULS',
            //     data: uPGRADE_ULS,
            //     borderColor: 'rgb(31, 65, 114,0.53)',
            //     backgroundColor: ['rgb(31, 65, 114,0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'FDD_TWIN_BEAM',
            //     data: fDD_TWIN_BEAM,
            //     borderColor: 'rgb(24, 111, 101,0.53)',
            //     backgroundColor: ['rgb(24, 111, 101,0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'L900_UPGRADE',
            //     data: l900_UPGRADE,
            //     borderColor: 'rgb(233, 184, 36,0.53)',
            //     backgroundColor: ['rgb(233, 184, 36,0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'OEM_SWAP',
            //     data: oEM_SWAP,
            //     borderColor: 'rgb(169, 179, 136,0.53)',
            //     backgroundColor: ['rgb(169, 179, 136,0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'TDD_UPGRADE',
            //     data: tDD_UPGRADE,
            //     borderColor: 'rgb(222, 208, 182, 0.53)',
            //     backgroundColor: ['rgb(222, 208, 182 , 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: '2G_UPGRADE',
            //     data: g2G_UPGRADE,
            //     borderColor: 'rgb(194, 18, 146 , 0.53)',
            //     backgroundColor: ['rgb(194, 18, 146 , 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'TDD_TWIN_BEAM',
            //     data: tDD_TWIN_BEAM,
            //     borderColor: 'rgb(239, 64, 64 , 0.53)',
            //     backgroundColor: ['rgb(239, 64, 64 , 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: '2G_SEC_ADDITION',
            //     data: g2G_SEC_ADDITION,
            //     borderColor: 'rgb(255, 167, 50 , 0.53)',
            //     backgroundColor: ['rgb(255, 167, 50 , 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'L2100_UPGRADE',
            //     data: l2100_UPGRADE,
            //     borderColor: 'rgb(22, 64, 214, 0.53)',
            //     backgroundColor: ['rgb(22, 64, 214 , 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'FDD_SEC_ADDITION',
            //     data: fDD_SEC_ADDITION,
            //     borderColor: 'rgb(237, 90, 179 , 0.53)',
            //     backgroundColor: ['rgb(237, 90, 179 , 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'TDD_SEC_ADDITION',
            //     data: tDD_SEC_ADDITION,
            //     borderColor: 'rgb(199, 0, 57 , 0.53)',
            //     backgroundColor: ['rgb(199, 0, 57 , 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     type: 'bar',
            //     label: 'Over ALL',
            //     data: allData,
            //     borderColor: 'rgb(167, 49, 33)',
            //     backgroundColor: ['rgb(167, 49, 33,0.6)'],
            //     borderWidth: 4,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // }
        ]
    }
    const data2 = {
        labels: month,
        datasets: [
            {
                label: 'Mobility',
                data: mobility,
                borderColor: 'rgba(15, 255, 79, 0.53)',
                backgroundColor: ['rgba(15, 255, 79, 0.53)'],
                borderWidth: 3,
                color: 'red',
                fill: false,
                tension: 0.3
            },
            // {
            //     label: 'NEW TOWER',
            //     data: nEW_TOWER,
            //     borderColor: 'rgb(158, 221, 255, 0.53)',
            //     backgroundColor: ['rgb(158, 221, 255, 0.83)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'NEW SECTOR ADDITION',
            //     data: nEW_SECTOR_ADDITION,
            //     borderColor: 'rgb(176, 217, 177, 0.53)',
            //     backgroundColor: ['rgb(176, 217, 177, 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'M MIMO',
            //     data: m_MIMO,
            //     borderColor: 'rgb(157, 118, 193, 0.53)',
            //     backgroundColor: ['rgb(157, 118, 193, 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'UPGRADE_SW_ONLY',
            //     data: uPGRADE_SW_ONLY,
            //     borderColor: 'rgb(247, 140, 162, 0.53)',
            //     backgroundColor: ['rgb(247, 140, 162, 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'FDD_UPGRADE',
            //     data: fDD_UPGRADE,
            //     borderColor: 'rgb(239, 180, 149, 0.53)',
            //     backgroundColor: ['rgb(239, 180, 149, 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'UPGRADE_ULS',
            //     data: uPGRADE_ULS,
            //     borderColor: 'rgb(31, 65, 114,0.53)',
            //     backgroundColor: ['rgb(31, 65, 114,0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'FDD_TWIN_BEAM',
            //     data: fDD_TWIN_BEAM,
            //     borderColor: 'rgb(24, 111, 101,0.53)',
            //     backgroundColor: ['rgb(24, 111, 101,0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'L900_UPGRADE',
            //     data: l900_UPGRADE,
            //     borderColor: 'rgb(233, 184, 36,0.53)',
            //     backgroundColor: ['rgb(233, 184, 36,0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'OEM_SWAP',
            //     data: oEM_SWAP,
            //     borderColor: 'rgb(169, 179, 136,0.53)',
            //     backgroundColor: ['rgb(169, 179, 136,0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'TDD_UPGRADE',
            //     data: tDD_UPGRADE,
            //     borderColor: 'rgb(222, 208, 182 , 0.53)',
            //     backgroundColor: ['rgb(222, 208, 182 , 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: '2G_UPGRADE',
            //     data: g2G_UPGRADE,
            //     borderColor: 'rgb(194, 18, 146 , 0.53)',
            //     backgroundColor: ['rgb(194, 18, 146 , 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'TDD_TWIN_BEAM',
            //     data: tDD_TWIN_BEAM,
            //     borderColor: 'rgb(239, 64, 64 , 0.53)',
            //     backgroundColor: ['rgb(239, 64, 64 , 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: '2G_SEC_ADDITION',
            //     data: g2G_SEC_ADDITION,
            //     borderColor: 'rgb(255, 167, 50 , 0.53)',
            //     backgroundColor: ['rgb(255, 167, 50 , 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'L2100_UPGRADE',
            //     data: l2100_UPGRADE,
            //     borderColor: 'rgb(22, 64, 214 , 0.53)',
            //     backgroundColor: ['rgb(22, 64, 214 , 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'FDD_SEC_ADDITION',
            //     data: fDD_SEC_ADDITION,
            //     borderColor: 'rgb(237, 90, 179 , 0.53)',
            //     backgroundColor: ['rgb(237, 90, 179 , 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     label: 'TDD_SEC_ADDITION',
            //     data: tDD_SEC_ADDITION,
            //     borderColor: 'rgb(199, 0, 57 , 0.53)',
            //     backgroundColor: ['rgb(199, 0, 57 , 0.53)'],
            //     borderWidth: 3,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // },
            // {
            //     type: 'line',
            //     label: 'Over ALL',
            //     data: allData,
            //     borderColor: 'rgb(167, 49, 33)',
            //     backgroundColor: ['rgb(167, 49, 33,0.6)'],
            //     borderWidth: 4,
            //     color: 'red',
            //     fill: false,
            //     tension: 0.3
            // }
        ]
    }

    // OPTION FOR CIRCLE WISE PROJECT COMPERISION
    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
            // axis:'x',
          },
        plugins: {
            legend: {
                // display:false,
                position: 'bottom',
                maxWidth: 150,
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 15,
                        weight: 'bold',
                    },
                    // boxWidth: 18,
                    // color: "white",
                }
            },
            title: {
                display: true,
                text: 'PROJECTS COMPARISON',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            datalabels: {
                display: true,
                color: 'black',
                anchor: 'end',
                align: 'top',
                offset: 0.1,
                // formatter:(value,context)=>{
                //         console.log(context)
                // }
                font:{
                    weight: 'bold',
                }
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                        speed: 0.01
                    },
                    pinch: {
                        enabled: true,
                        speed: 0.01
                    },
                    mode: 'x',
                },
                pan: {
                    enabled: true,
                    mode: 'x'
                },
            },
            tooltip: {
                displayColors: true,
                backgroundColor: 'rgb(253, 247, 228)',
                borderColor: 'black',
                borderWidth: '1',
                padding: 10,
                bodyColor: 'black',
                titleFont: {
                    weight: 'bold',
                    size: '15'
                },
                titleColor: 'black',

            },
            aspectRatio: 1,
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    // color:"white"
                },

            },
            y: {
                grid: {
                    display: true,
                    // color:'white'
                },
                ticks: {
                    // forces step size to be 50 units
                    stepSize: 1,
                    // color:'white'
                },
                // stacked: true
            }
        },
        watermark: {

            image: `${ServerURL}/media/assets/logo-new.png`,
            x: 50,
            y: 50,
            width: 300,
            height: 150,
            opacity: 0.15,
            alignX: "right",
            alignY: "top",
            alignToChartArea: false,
            position: "back"

        },
        animation: {
            onComplete: () => {
              delayed = true;
            },
            delay: (context) => {
              let delay = 0;
              if (context.type === 'data' && context.mode === 'default' && !delayed) {
                delay = context.dataIndex * 300 + context.datasetIndex * 100;
              }
              return delay;
            },
          },
    }

    //********* HANDLE CLEAR DATA ********* */
    const handleClear = () => {
        setMobility([])
        setAllData([])

    }

    // TOGGAL BUTTON
    const handleChange = () => {
        setGraphType(!graphType)
    }

    const handleClose = () => {
        setOpen(false)
    }

    // handle dialog box
    const handleDialogBox = () => {
        return (
            <Dialog
                fullWidth={true}
                maxWidth={'lg'}
                TransitionComponent={Transition}
                open={open}
                onClose={handleClose}
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: graphType ? 'none' : 'inherit', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "1100px", height: '600px' }}>
                        <Bar
                            // style={{ width: "750px", height: 350 }}
                            data={data2}
                            options={options}
                            plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
                        >
                        </Bar>
                    </div>
                    <div style={{ display: graphType ? 'inherit' : 'none', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "1100px", height: '600px' }}>
                        <Line
                            // style={{ width: "750px", height: 350 }}
                            data={data}
                            options={options}
                            plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
                        >
                        </Line>
                    </div>
                </div>

            </Dialog>
        )
    }

    useEffect(() => {
        fetchSelectedData();
        // useEffect(()=>{
            document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
        //   },[])
        // fetchAllData();

    }, [])



    return (
        <div style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 10, height: 450, width: "100%", borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: 200, height: 350, borderRadius: 5, padding: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "20px" }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}>
                    <FilterAltIcon />FILTER DATA
                </div>
                <div>
                    <InputLabel style={{ fontSize: 15 }}>SELECT CIRCLE</InputLabel>
                    <Select value={circle} onChange={(e) => { setCircle(e.target.value); handleClear(); getProjectDataForCircle(e.target.value) }} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                        {/* <option  disabled selected hidden>Select Ageing</option> */}
                        {circleArr?.map((item) => (
                            <MenuItem value={item} key={item} >{item}</MenuItem>
                        ))}
                    </Select>
                </div>
                <div>
                    <InputLabel style={{ fontSize: 15 }}>SELECT PARTNER</InputLabel>
                    <Select value={selectVendor} onChange={(e) => { setSelectVendor(e.target.value); handleClear(); getProjectDataForVendor(e.target.value) }} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                        {/* <option  disabled selected hidden>Select Ageing</option> */}
                        {vendor?.map((item) => (
                            <MenuItem value={item} key={item} >{item}</MenuItem>
                        ))}
                    </Select>
                </div>
                <div>
                    <ToggleButtonGroup
                        size="small"
                        color="primary"
                        value={graphType}
                        exclusive
                        onChange={handleChange}
                        aria-label="Platform"

                    >
                        <ToggleButton value={true}>Line</ToggleButton>
                        <ToggleButton value={false}>Bar</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div>
                    <Button onClick={() => { setOpen(true) }} endIcon={<LaunchIcon />}>full screen</Button>
                </div>
            </div>
            <div style={{ display: graphType ? 'inherit' : 'none', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', borderRadius: 10, width: "750px", height: 350 }}>
                <Line
                    style={{ width: "750px", height: 350 }}
                    data={data}
                    options={options}
                    plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
                >
                </Line>
            </div>
            <div style={{ display: graphType ? 'none' : 'inherit', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', borderRadius: 10, width: "800px", height: 400 }}>
                <Bar
                    // style={{ width: "750px", height: 350 }}
                    data={data2}
                    options={options}
                    plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
                >
                </Bar>
            </div>
            {/* <div style={{ filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 8px)', width: 350, height: 300, marginTop: 10 }}>
                <Doughnut
                    data={{
                        labels: ProjectArrs,
                        datasets: [
                            {
                                //   label: 'Bucket wise(Pending Sites)',
                                data: monthProjectCount,
                                borderColor: ['rgba(15, 255, 79, 0.53)', 'rgb(158, 221, 255, 0.53)', 'rgb(176, 217, 177, 0.53)', 'rgb(157, 118, 193, 0.53)', 'rgb(247, 140, 162, 0.53)', 'rgb(239, 180, 149, 0.53)', 'rgb(31, 65, 114,0.53)', 'rgb(24, 111, 101,0.53)', 'rgb(233, 184, 36,0.53)', 'rgb(199, 0, 57 , 0.53)'],
                                backgroundColor: ['rgba(15, 255, 79, 0.53)', 'rgb(158, 221, 255, 0.53)', 'rgb(176, 217, 177, 0.53)', 'rgb(157, 118, 193, 0.53)', 'rgb(247, 140, 162, 0.53)', 'rgb(239, 180, 149, 0.53)', 'rgb(31, 65, 114,0.53)', 'rgb(24, 111, 101,0.53)', 'rgb(233, 184, 36,0.53)', 'rgb(199, 0, 57 , 0.53)'],
                                borderWidth: 2,
                                hoverBorderWidth: 2,
                                hoverBorderRadius: 5,
                                //   circumference:180,
                                //   rotation:270,
                            }]
                    }}
                    options={optionsD1}
                    plugins={[ChartDataLabels]}
                >

                </Doughnut>
            </div> */}
            {/* <div style={{ filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 8px)', width: 350, height: 300, marginTop: 10 }}>
                <Doughnut
                    data={{
                        labels: ProjectArrs,
                        datasets: [
                            {
                                //   label: 'Bucket wise(Pending Sites)',
                                data: monthDoneCount,
                                borderColor: ['rgba(15, 255, 79, 0.53)', 'rgb(158, 221, 255, 0.53)', 'rgb(176, 217, 177, 0.53)', 'rgb(157, 118, 193, 0.53)', 'rgb(247, 140, 162, 0.53)', 'rgb(239, 180, 149, 0.53)', 'rgb(31, 65, 114,0.53)', 'rgb(24, 111, 101,0.53)', 'rgb(233, 184, 36,0.53)', 'rgb(199, 0, 57 , 0.53)'],
                                backgroundColor: ['rgba(15, 255, 79, 0.53)', 'rgb(158, 221, 255, 0.53)', 'rgb(176, 217, 177, 0.53)', 'rgb(157, 118, 193, 0.53)', 'rgb(247, 140, 162, 0.53)', 'rgb(239, 180, 149, 0.53)', 'rgb(31, 65, 114,0.53)', 'rgb(24, 111, 101,0.53)', 'rgb(233, 184, 36,0.53)', 'rgb(199, 0, 57 , 0.53)'],
                                borderWidth: 2,
                                hoverBorderWidth: 2,
                                hoverBorderRadius: 5,
                                //   circumference:180,
                                //   rotation:270,
                            }]
                    }}
                    options={optionsD2}
                    plugins={[ChartDataLabels]}
                >
                </Doughnut>
            </div> */}

            {handleDialogBox()}

        </div>
    )
}

export default ProjectWise