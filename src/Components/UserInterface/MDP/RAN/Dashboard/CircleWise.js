import React, { useEffect, useState } from 'react'
import { Chart as Chartjs } from 'chart.js/auto'
import { Line, Bar } from 'react-chartjs-2';
import Button from '@mui/material/Button';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark'
import { getData, postData, ServerURL } from '../../../../services/FetchNodeServices';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LaunchIcon from '@mui/icons-material/Launch';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" timeout={2500} style={{ transformOrigin: '0 0 0' }}  mountOnEnter unmountOnExit ref={ref} {...props} />;
});

const CircleWise = (propes) => {
    const [circle, setCircle] = useState('ALL')
    const [circleArr, setCircleArr] = useState(['ALL'])
    const [project, setProject] = useState('ALL')
    const [projectArr, setProjectArr] = useState(['ALL'])
    const [month, setMonth] = useState(['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'])
    const [mobilecomm, setMobilecomm] = useState([])
    const [nokia, setNokia] = useState([])
    const [ericsson, setEricsson] = useState([])
    const [vedang, setVedang] = useState([])
    const [arial, setArial] = useState([])
    const [zte, setZte] = useState([])
    const [other, setOther] = useState([])
    const [graphType, setGraphType] = useState(false);
    const [airtel, setAirtel] = useState([]);
    const [open, setOpen] = useState(false)

    const finalArr = ['Aerial', 'Other', 'ZTE', 'Vedang', 'Ericsson', 'Nokia', 'MobileComm']
    let delayed;


    // console.log('mobilecomm',mobilecomm,'nokia',nokia,'Ericsson',ericsson)

    // console.log('project Circle data............',airtel,"mobilecomm",mobilecomm,"nokia" ,nokia,'eriction',ericsson,vedang )

    const fetchSelectedData = async () => {
        const response = await getData('MDP/unique_column_value/')
        // console.log('project Circle data......', response)
        setCircleArr([...circleArr, ...response.circle])
        setProjectArr([...projectArr, ...response.project])
    }

    const fetchAllData = async () => {
        const formData = new FormData();
        formData.append("project", project)
        formData.append("circle", circle)
        const response = await postData('MDP/all_data/', formData)
        // console.log("project Circle data %%%%%%%%%%%%%%", response);

        const airtelData = response.airtel_bucket

        month?.map((item) => {
            var filterMonth = airtelData?.filter((its) => (its.MONTH === item))
            if (filterMonth.length === 0) {
                setAirtel((prev) => [...prev, 0])
            }
            else {
                filterMonth?.map((item) => {
                    setAirtel((prev) => [...prev, item.sum_projected_count])
                })
            }
        })

        month?.map((items) => {
            var filterCircle = response.data?.filter((item) => (item.MONTH == items))

            filterCircle?.map((it) => {
                if (it.COMPATITOR === 'MobileComm') {
                    setMobilecomm((prev) => [...prev, it.DONE_COUNT])
                }
                else if (it.COMPATITOR === 'Nokia') {
                    setNokia((prev) => [...prev, it.DONE_COUNT])
                }
                else if (it.COMPATITOR === 'Ericsson') {
                    setEricsson((prev) => [...prev, it.DONE_COUNT])
                }
                else if (it.COMPATITOR === 'Vedang') {
                    setVedang((prev) => [...prev, it.DONE_COUNT])
                }
                else if (it.COMPATITOR === 'Aerial') {
                    setArial((prev) => [...prev, it.DONE_COUNT])
                }
                else if (it.COMPATITOR === 'ZTE') {
                    setZte((prev) => [...prev, it.DONE_COUNT])
                }
                else {
                    setOther((prev) => [...prev, it.DONE_COUNT])
                }
            })
        })
    }

    const getFilterCircleData = async (props) => {
        const formData = new FormData();
        formData.append("project", project)
        formData.append("circle", props)
        const response = await postData('MDP/all_data/', formData)
        // console.log("project Circle data", response.data)

        const airtelData = response.airtel_bucket

        month?.map((item) => {
            var filterMonth = airtelData?.filter((its) => (its.MONTH === item))
            if (filterMonth.length === 0) {
                setAirtel((prev) => [...prev, 0])
            }
            else {
                filterMonth?.map((item) => {
                    setAirtel((prev) => [...prev, item.sum_projected_count])
                })
            }
        })

        //  this is for all vendor
        month?.map((items) => {
            var filterCircle = response.data?.filter((item) => (item.MONTH == items))
            console.log('1q1q1q1q1qqqq', filterCircle)
            const lenghtArr = filterCircle.length

            if (lenghtArr === 0) {
                console.log('IF wali condition')
                setMobilecomm((prev) => [...prev, 0])
                setNokia((prev) => [...prev, 0])
                setEricsson((prev) => [...prev, 0])
                setVedang((prev) => [...prev, 0])
                setArial((prev) => [...prev, 0])
                setZte((prev) => [...prev, 0])
                setOther((prev) => [...prev, 0])

            }
            else {
                //  console.log('1111177777',filterCircle)
                var tempArr = [];
                filterCircle.map((it) => {

                    console.log('else wali condition', it)

                    if (it.COMPATITOR === 'MobileComm') {
                        setMobilecomm((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.COMPATITOR)
                        // console.warn('Mobilecomm for data')
                    }

                    else if (it.COMPATITOR === 'Nokia') {
                        setNokia((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.COMPATITOR)
                    }
                    else if (it.COMPATITOR === 'Ericsson') {
                        setEricsson((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.COMPATITOR)
                    }
                    else if (it.COMPATITOR === 'Vedang') {
                        setVedang((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.COMPATITOR)
                    }
                    else if (it.COMPATITOR === 'Aerial') {
                        setArial((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.COMPATITOR)
                    }

                    else if (it.COMPATITOR === 'ZTE') {
                        setZte((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.COMPATITOR)
                    }

                    else if (it.COMPATITOR === 'Other') {
                        setOther((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.COMPATITOR)
                    }

                })
                // console.log('temp Arr' , tempArr)
                for (var i = 0; i < finalArr.length; i++) {
                    if (!tempArr.includes(finalArr[i])) {
                        switch (finalArr[i]) {
                            case "Aerial":
                                setArial((prev) => [...prev, 0])
                                break;
                            case "Other":
                                setOther((prev) => [...prev, 0])
                                break;
                            case "ZTE":
                                setZte((prev) => [...prev, 0])
                                break;
                            case "Vedang":
                                setVedang((prev) => [...prev, 0])
                                break;
                            case "Ericsson":
                                setEricsson((prev) => [...prev, 0])
                                break;
                            case "Nokia":
                                setNokia((prev) => [...prev, 0])
                                break;
                            case "MobileComm":
                                setMobilecomm((prev) => [...prev, 0])
                                break;
                            // Handle other cases as needed
                        }
                    }
                }
            }


        })
    }
    const getFilterDataProject = async (props) => {
        const formData = new FormData();
        formData.append("project", props)
        formData.append("circle", circle)
        const response = await postData('MDP/all_data/', formData)
        // console.log("project ------ data ", response.data)
        console.log("project Circle data %%%%%%%%%%%%%%", response);


        const airtelData = response.airtel_bucket

        // this is for total
        month?.map((item) => {
            var filterMonth = airtelData?.filter((its) => (its.MONTH === item))
            if (filterMonth.length === 0) {
                setAirtel((prev) => [...prev, 0])
            }
            else {
                filterMonth?.map((item) => {
                    setAirtel((prev) => [...prev, item.sum_projected_count])
                })
            }
        })
        // this is for all vendor  
        month?.map((items) => {
            var filterCircle = response.data?.filter((item) => (item.MONTH == items))
            console.log('1q1q1q1q1qqqq', filterCircle)
            const lenghtArr = filterCircle.length

            if (lenghtArr === 0) {
                console.log('IF wali condition')
                setMobilecomm((prev) => [...prev, 0])
                setNokia((prev) => [...prev, 0])
                setEricsson((prev) => [...prev, 0])
                setVedang((prev) => [...prev, 0])
                setArial((prev) => [...prev, 0])
                setZte((prev) => [...prev, 0])
                setOther((prev) => [...prev, 0])

            }
            else {
                //  console.log('1111177777',filterCircle)
                var tempArr = [];
                filterCircle.map((it) => {

                    console.log('else wali condition', it)

                    if (it.COMPATITOR === 'MobileComm') {
                        setMobilecomm((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.COMPATITOR)
                        // console.warn('Mobilecomm for data')
                    }

                    else if (it.COMPATITOR === 'Nokia') {
                        setNokia((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.COMPATITOR)
                    }
                    else if (it.COMPATITOR === 'Ericsson') {
                        setEricsson((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.COMPATITOR)
                    }
                    else if (it.COMPATITOR === 'Vedang') {
                        setVedang((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.COMPATITOR)
                    }
                    else if (it.COMPATITOR === 'Aerial') {
                        setArial((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.COMPATITOR)
                    }

                    else if (it.COMPATITOR === 'ZTE') {
                        setZte((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.COMPATITOR)
                    }

                    else if (it.COMPATITOR === 'Other') {
                        setOther((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.COMPATITOR)
                    }

                })
                // console.log('temp Arr' , tempArr)
                for (var i = 0; i < finalArr.length; i++) {
                    if (!tempArr.includes(finalArr[i])) {
                        switch (finalArr[i]) {
                            case "Aerial":
                                setArial((prev) => [...prev, 0])
                                break;
                            case "Other":
                                setOther((prev) => [...prev, 0])
                                break;
                            case "ZTE":
                                setZte((prev) => [...prev, 0])
                                break;
                            case "Vedang":
                                setVedang((prev) => [...prev, 0])
                                break;
                            case "Ericsson":
                                setEricsson((prev) => [...prev, 0])
                                break;
                            case "Nokia":
                                setNokia((prev) => [...prev, 0])
                                break;
                            case "MobileComm":
                                setMobilecomm((prev) => [...prev, 0])
                                break;
                            // Handle other cases as needed
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
                // type: 'line',
                label: 'Mobilecomm',
                data: mobilecomm,
                borderColor: 'rgb(237,108,2,0.6)',
                backgroundColor: ['rgb(237,108,2,0.6)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'Nokia',
                data: nokia,
                borderColor: 'rgb(27,67,147,0.6)',
                backgroundColor: ['rgb(27,67,147,0.6)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },

            {
                label: 'Ericsson',
                data: ericsson,
                borderColor: 'rgb(0,20,59,0.6)',
                backgroundColor: ['rgb(0,20,59,0.6)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'Vedang',
                data: vedang,
                borderColor: 'rgb(244, 208, 63,0.6)',
                backgroundColor: ['rgb(244, 208, 63,0.6)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'Aerial',
                data: arial,
                borderColor: 'rgb(231, 76, 60,0.6)',
                backgroundColor: ['rgb(231, 76, 60,0.6)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'ZTE',
                data: zte,
                borderColor: 'rgb(23, 76, 60,0.6)',
                backgroundColor: ['rgb(23, 76, 60,0.6)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'Other',
                data: other,
                borderColor: 'rgb(22, 160, 133, 0.83)',
                backgroundColor: ['rgb(22, 160, 133, 0.83)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                type: 'bar',
                label: 'Total',
                data: airtel,
                borderColor: 'rgb(199, 0, 57,0.65)',
                // backgroundColor: ['rgb(199, 0, 57,0.65)'],
                borderWidth: 2,
                color: 'red',
                fill: false,
                tension: 0.4
            }
        ]
    }

    const data2 = {
        labels: month,
        datasets: [
            {
                // type: 'line',
                label: 'Mobilecomm',
                data: mobilecomm,
                borderColor: 'rgb(237,108,2,0.6)',
                backgroundColor: ['rgb(237,108,2,0.6)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'Nokia',
                data: nokia,
                borderColor: 'rgb(27,67,147,0.6)',
                backgroundColor: ['rgb(27,67,147,0.6)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },

            {
                label: 'Ericsson',
                data: ericsson,
                borderColor: 'rgb(0,20,59,0.6)',
                backgroundColor: ['rgb(0,20,59,0.6)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'Vedang',
                data: vedang,
                borderColor: 'rgb(244, 208, 63,0.6)',
                backgroundColor: ['rgb(244, 208, 63,0.6)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'Aerial',
                data: arial,
                borderColor: 'rgb(231, 76, 60,0.6)',
                backgroundColor: ['rgb(231, 76, 60,0.6)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'ZTE',
                data: zte,
                borderColor: 'rgb(23, 76, 60,0.6)',
                backgroundColor: ['rgb(23, 76, 60,0.6)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                label: 'Other',
                data: other,
                borderColor: 'rgb(22, 160, 133, 0.6)',
                backgroundColor: ['rgb(22, 160, 133, 0.6)'],
                borderWidth: 2,
                color: 'red',
                // fill: true,
                tension: 0.4
            },
            {
                type: 'line',
                label: 'Total',
                data: airtel,
                borderColor: 'rgb(199, 0, 57,0.6)',
                backgroundColor: ['rgb(199, 0, 57,0.6)'],
                borderWidth: 3,
                color: 'red',
                // fill: true,
                tension: 0.2
            }
        ]
    }

    const options = {
        responsive: true,
        // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
        maintainApectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
            // axis:'x',
        },
        plugins: {
            // backgroundImageUrl:'https://www.msoutlook.info/pictures/bgconfidential.png',
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
                text: 'PARTNERS COMPARISON',
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
            },
            tooltip: {
                displayColors: false,
                backgroundColor: 'white',
                borderColor: 'black',
                borderWidth: '1',
                padding: 10,
                bodyColor: 'black',
                bodyFont: {
                    size: '14'
                },
                bodyAlign: 'left',
                footerAlign: 'right',
                titleColor: 'black',
                titleFont: {
                    weight: 'bold',
                    size: '15'
                },
                yAlign: 'bottom',
                xAlign: 'center',
                callbacks: {
                    // labelColor: function(context) {
                    //     return {
                    //         borderColor: 'rgb(0, 0, 255)',
                    //         backgroundColor: 'rgb(255, 0, 0)',
                    //         borderWidth: 2,
                    //         borderDash: [2, 2],
                    //         borderRadius: 2,
                    //     };
                    // },
                    // labelTextColor: function(context) {
                    //     return '#543453';
                    // },
                    label: ((tooltipItem) => {
                        // console.log(tooltipItem.dataset.label,":",tooltipItem.formattedValue)

                    })
                }
            },

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
        },
        watermark: {

            image: `${ServerURL}/media/assets/logo-new.png`,
            x: 50,
            y: 50,
            width: 300,
            height: 150,
            opacity: 0.25,
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
        setMobilecomm([])
        setNokia([])
        setEricsson([])
        setVedang([])
        setArial([])
        setOther([])
        setAirtel([])
        setZte([])
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
                <div style={{display:'flex',justifyContent:'center'}}> 
                    <div style={{ display: graphType ? 'none' : 'inherit', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "1100px", height: '600px' }}>
                        <Bar
                            // style={{  width: "100%", height: '100%' }}
                            data={data2}
                            options={options}
                            plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
                        >
                        </Bar>
                    </div>
                    <div style={{ display: graphType ? 'inherit' : 'none', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "1100px", height: '600px'  }}><Line
                // style={{ width: "100%", height: 350 }}
                data={data}
                options={options}
                plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
            >
            </Line></div>
                </div>

            </Dialog>
        )
    }


    useEffect(() => {
        fetchSelectedData();
        fetchAllData()
    }, [])
    return (
        <div style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 10, height: 450, width: "100%", borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ width: 200, height: 350, borderRadius: 5, padding: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "20px" }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}><FilterAltIcon />FILTER DATA</div>
                <div>
                    <InputLabel style={{ fontSize: 15 }}>SELECT CIRCLE</InputLabel>
                    <Select value={circle} onChange={(e) => { setCircle(e.target.value); handleClear(); getFilterCircleData(e.target.value) }} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>

                        {circleArr?.map((item) => (
                            <MenuItem value={item} key={item} >{item}</MenuItem>
                        ))}
                    </Select>
                </div>
                <div>
                    <InputLabel style={{ fontSize: 15 }}>SELECT PROJECT</InputLabel>
                    <Select value={project} onChange={(e) => { setProject(e.target.value); handleClear(); getFilterDataProject(e.target.value) }} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>

                        {projectArr?.map((item) => (
                            <MenuItem value={item} key={item} >{item}</MenuItem>
                        ))}
                    </Select>
                </div>
                {/* toggle button */}
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
                {/* full screen button */}
                <div>
                    <Button color="primary" endIcon={<LaunchIcon />} onClick={() => { setOpen(true) }}>Full screen</Button>
                </div>
            </div>
            <div style={{ display: graphType ? 'inherit' : 'none', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "800px", height: 400 }}><Line
                style={{ width: "100%", height: 350 }}
                data={data}
                options={options}
                plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
            >
            </Line></div>
            <div style={{ display: graphType ? 'none' : 'inherit', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "800px", height: 400 }}>
                <Bar
                    // style={{ width: "100%", height: 400 }}
                    data={data2}
                    options={options}
                    plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
                >
                </Bar></div>

            {handleDialogBox()}

        </div>
    )
}

export default CircleWise