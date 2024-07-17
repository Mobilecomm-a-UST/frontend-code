import React, { useEffect, useState } from 'react'
import { Chart as Chartjs } from 'chart.js/auto'
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import { getData, postData } from '../../../../services/FetchNodeServices';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

const ProjectCIrcle = () => {
    const [circle, setCircle] = useState('UPW')
    const [circleArr, setCircleArr] = useState([])
    const [project, setProject] = useState('ULS')
    const [projectArr, setProjectArr] = useState([])
    const [months, setMonths] = useState('JAN')
    const [vendor, setVendor] = useState('MobileComm')
    const [status, setStatus] = useState('True');
    const [month, setMonth] = useState(['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV'])
    const [mobilecomm, setMobilecomm] = useState([])
    const [nokia, setNokia] = useState([])
    const [ericsson, setEricsson] = useState([])
    const [vedang, setVedang] = useState([])
    const [arial, setArial] = useState([])
    const [other, setOther] = useState([])
    const [overAll, setOverAll] = useState()
    const ProjectArrs = ['NT', 'ULS', 'RELOCATION', 'Upgrades', 'UBR - Mobility', 'UBR - Swap', 'MW', 'Degrow', 'RET', 'IBS']

    // console.log('mobilecomm',mobilecomm,'nokia',nokia,'Ericsson',ericsson)



    const fetchProjectData = async () => {
        const formData = new FormData();
        formData.append("project", project)
        formData.append("COMPATITOR", vendor)
        formData.append("DONE_COUNT", 'True')
        formData.append("MONTH", months)
        const response = await postData('MDP/projectWise_circle_comparision_pichart/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
        console.log("project Circle", response.data)
    }

    const getCircleData = (props) => {
        var arr = [];
        var proArr = [];

        props?.map((item) => {
            arr.push(item.circle);
            proArr.push(item.project);

        })
        setCircleArr([...new Set(arr)])
        setProjectArr([...new Set(proArr)])

    }

    const getFilterData = (props) => {
        month?.map((items) => {
            var filterCircle = overAll?.filter((item) => (item.circle === (props || circle) && item.MONTH == items))
            var filterProject = filterCircle?.filter((item) => (item.project === project))
            filterProject?.map((it) => {
                if (it.COMPATITOR === 'MobileComm') {
                    // Mobilecomm.push(it.sum_projected_count)
                    setMobilecomm((prev) => [...prev, it.PROJECTED_COUNT])
                }
                else if (it.COMPATITOR === 'Nokia') {
                    setNokia((prev) => [...prev, it.PROJECTED_COUNT])
                }
                else if (it.COMPATITOR === 'Ericsson') {
                    setEricsson((prev) => [...prev, it.PROJECTED_COUNT])
                }
                else if (it.COMPATITOR === 'Vedang') {
                    setVedang((prev) => [...prev, it.PROJECTED_COUNT])
                }
                else if (it.COMPATITOR === 'Ariel') {
                    setArial((prev) => [...prev, it.PROJECTED_COUNT])
                }
                else {
                    setOther((prev) => [...prev, it.PROJECTED_COUNT])
                }
            })
        })

        // console.log('filter data ', filterProject)
    }
    const getFilterDataProject = (props) => {
        month?.map((items) => {
            var filterCircle = overAll?.filter((item) => (item.circle === circle && item.MONTH == items))
            var filterProject = filterCircle?.filter((item) => (item.project === props))
            filterProject?.map((it) => {
                if (it.COMPATITOR === 'MobileComm') {
                    // Mobilecomm.push(it.sum_projected_count)
                    setMobilecomm((prev) => [...prev, it.PROJECTED_COUNT])
                }
                else if (it.COMPATITOR === 'Nokia') {
                    setNokia((prev) => [...prev, it.PROJECTED_COUNT])
                }
                else if (it.COMPATITOR === 'Ericsson') {
                    setEricsson((prev) => [...prev, it.PROJECTED_COUNT])
                }
                else if (it.COMPATITOR === 'Vedang') {
                    setVedang((prev) => [...prev, it.PROJECTED_COUNT])
                }
                else if (it.COMPATITOR === 'Ariel') {
                    setArial((prev) => [...prev, it.PROJECTED_COUNT])
                }
                else {
                    setOther((prev) => [...prev, it.PROJECTED_COUNT])
                }
            })
        })

        // console.log('filter data ', filterProject)
    }

    const data = {
        labels: month,
        datasets: [
            {
                label: 'Mobilecomm',
                data: mobilecomm,
                borderColor: 'rgba(15, 255, 79, 0.53)',
                backgroundColor: ['rgba(15, 255, 79, 0.53)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'Nokia',
                data: nokia,
                borderColor: 'rgb(158, 221, 255, 0.83)',
                backgroundColor: ['rgb(158, 221, 255, 0.83)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'Ericsson',
                data: ericsson,
                borderColor: 'rgb(176, 217, 177, 0.53)',
                backgroundColor: ['rgb(176, 217, 177, 0.53)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'Vedang',
                data: vedang,
                borderColor: 'rgb(157, 118, 193, 0.53)',
                backgroundColor: ['rgb(157, 118, 193, 0.53)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'Ariel',
                data: arial,
                borderColor: 'rgb(247, 140, 162, 0.53)',
                backgroundColor: ['rgb(247, 140, 162, 0.53)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'Other',
                data: other,
                borderColor: 'rgb(239, 180, 149, 0.53)',
                backgroundColor: ['rgb(239, 180, 149, 0.53)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            }
        ]
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 13,
                        // weight: 'bold',
                    },
                    // color: "white",
                }
            },
            title: {
                display: true,
                text: 'CIRCLE-WISE VENDOR COMPERISION',
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
                offset: 0.5,
                font: {
                    size: 10,
                    weight: 'bold'
                }
                // formatter:(value,context)=>{
                //         console.log(context)
                // }
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                        speed: 0.01,
                    },
                    pinch: {
                        enabled: true,
                        speed: 0.01,
                    },
                    mode: 'x',
                    // mode:'y',
                },
                pan: {
                    enabled: true,
                    mode: 'x'
                },
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    // color:"white"
                },
                // stacked: true

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
        }
    }
    //********* HANDLE CLEAR DATA ********* */
    const handleClear = () => {
        setMobilecomm([])
        setNokia([])
        setEricsson([])
        setVedang([])
        setArial([])
        setOther([])
    }


    useEffect(() => {
        fetchProjectData()
    }, [])
    return (
        <div style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 10, height: 350, width: "auto", borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ width: 200, height: 300, borderRadius: 5, padding: 5, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "10px" }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}><FilterAltIcon />FILTER DATA</div>
                <div>
                    <InputLabel style={{ fontSize: 15 }}>SELECT CIRCLE</InputLabel>
                    <Select value={circle} onChange={(e) => { setCircle(e.target.value); handleClear(); getFilterData(e.target.value) }} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                        {/* <option  disabled selected hidden>Select Ageing</option> */}
                        {circleArr?.map((item) => (
                            <MenuItem value={item} key={item} >{item}</MenuItem>
                        ))}
                    </Select>
                </div>
                <div>
                    <InputLabel style={{ fontSize: 15 }}>SELECT PROJECT</InputLabel>
                    <Select value={project} onChange={(e) => { setProject(e.target.value); }} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                        {/* <option  disabled selected hidden>Select Ageing</option> */}
                        {ProjectArrs?.map((item) => (
                            <MenuItem value={item} key={item} >{item}</MenuItem>
                        ))}
                    </Select>
                </div>
                <div>
                    <InputLabel style={{ fontSize: 15 }}>SELECT STATUS</InputLabel>
                    <Select value={status} onChange={(e) => { setStatus(e.target.value) }} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>

                        <MenuItem value={'True'}>Done Count</MenuItem>
                        <MenuItem value={'False'}>Projected Count</MenuItem>

                    </Select>
                </div>
                <div>
                    <InputLabel style={{ fontSize: 15 }}>SELECT MONTH</InputLabel>
                    <Select value={months} onChange={(e) => { setMonths(e.target.value); }} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                        {/* <option  disabled selected hidden>Select Ageing</option> */}
                        {month?.map((item) => (
                            <MenuItem value={item} key={item} >{item}</MenuItem>
                        ))}
                    </Select>
                </div>
            </div>
            <div style={{ filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "700px", height: 350 }}>
                <Line
                    style={{ width: "700px", height: 350 }}
                    data={data}
                    options={options}
                    plugins={[ChartDataLabels, zoomPlugin]}
                >
                </Line>
            </div>

        </div>
    )
}

export default ProjectCIrcle