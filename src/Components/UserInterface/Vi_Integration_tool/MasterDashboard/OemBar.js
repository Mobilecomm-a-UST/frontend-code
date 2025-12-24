import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Chart as Chartjs } from 'chart.js/auto'
import { Line, Bar } from 'react-chartjs-2';
import Button from '@mui/material/Button';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark'
import { ServerURL } from '../../../services/FetchNodeServices';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InputLabel from '@mui/material/InputLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LaunchIcon from '@mui/icons-material/Launch';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { usePost } from '../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useQuery } from '@tanstack/react-query';
import { MemoHyperOemBar } from './HyperOemBar';
import _ from 'lodash';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" timeout={2500} style={{ transformOrigin: '0 0 0' }} mountOnEnter unmountOnExit ref={ref} {...props} />;
});

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

const OemBar = () => {
    const chartRef = useRef(null);
    const [graphType, setGraphType] = useState(false);
    const [open, setOpen] = useState(false)
    const { makePostRequest,cancelRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const [circle, setCircle] = useState([])
    const [ericsson, setEricsson] = useState([])
    const [huawiai, setHuawei] = useState([])
    const [nokia, setNokia] = useState([])
    const [samsung, setSamsung] = useState([])
    const [zte, setZte] = useState([])
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const [date, setDate] = useState('')
    const [barData, setBarData] = useState()
    const [barDialogOpen, setBarDialogOpen] = useState(false)
    const [activity_Name , setActivity_Name] = useState('')
    const { isPending, isFetching, isError, data, refetch } = useQuery({
        queryKey: ['Integration_OEM_wise'],
        queryFn: async () => {
            action(isPending)
            var formData = new FormData()
            formData.append('month', month)
            formData.append('year', year)
            const res = await makePostRequest("ix_tracker_vi/monthly-oemwise-integration-data/", formData);
            if (res) {
                action(false)
                // ShortDate(res.latest_months.sort((a, b) => a - b))
                setCircle(_.map(JSON.parse(res.table_data), 'cir'))
                setEricsson(_.map(JSON.parse(res.table_data), 'ERICSSON'))
                setHuawei(_.map(JSON.parse(res.table_data), 'HUAWEI'))
                setNokia(_.map(JSON.parse(res.table_data), 'NOKIA'))
                setSamsung(_.map(JSON.parse(res.table_data), 'SAMSUNG'))
                setZte(_.map(JSON.parse(res.table_data), 'ZTE'))
                setMonth(res.month)
                setYear(res.year)
                setDate(`${res.year}-${res.month < 10 ? '0' + res.month : res.month}`)
                return res;
            }
            else {
                action(false)
            }
        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })
    let delayed;



    const handleMonthData = async (e) => {
        let tempData = e.split('-')
        await setMonth(tempData[1])
        await setYear(tempData[0])
        await setDate(e)
        await refetch()

    }



    const data1 = {
        labels: circle,
        datasets: [
            {
                label: 'Ericsson',
                data: ericsson,
                borderColor: 'black',
                backgroundColor: ['rgb(237,108,2,0.8)'],
                borderWidth: 1,
                borderRadius: 5,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Huawei',
                data: huawiai,
                borderColor: 'black',
                backgroundColor: ['rgb(241,4,5,0.6)'],
                borderWidth: 1,
                borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Nokia',
                data: nokia,
                borderColor: 'black',
                backgroundColor: ['rgb(0,90,255,0.7)'],
                borderWidth: 1,
                borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Samsung',
                data: samsung,
                borderColor: 'black',
                backgroundColor: ['rgb(244, 208, 63,0.8)'],
                borderWidth: 1,
                borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4
            },
            {
                label: 'ZTE',
                data: zte,
                borderColor: 'black',
                backgroundColor: ['rgb(0,76,156,0.8)'],
                borderWidth: 1,
                borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4,
                borderRadius: 5
            }
        ]
    }

    const data2 = {
        labels: circle,
        datasets: [
            {
                label: 'Ericsson',
                data: ericsson,
                borderColor: 'black',
                backgroundColor: ['rgb(237,108,2,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Huawei',
                data: huawiai,
                borderColor: 'black',
                backgroundColor: ['rgb(241,4,5,0.6)'],
                borderWidth: 1,
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Nokia',
                data: nokia,
                borderColor: 'black',
                backgroundColor: ['rgb(0,90,255,0.7)'],
                borderWidth: 1,
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Samsung',
                data: samsung,
                borderColor: 'black',
                backgroundColor: ['rgb(244, 208, 63,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4
            },
            {
                label: 'ZTE',
                data: zte,
                borderColor: 'black',
                backgroundColor: ['rgb(0,76,156,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4,
                borderRadius: 1
            }
        ]
    }

    const options = {
        responsive: true,
        // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
        maintainApectRatio: false,
        // interaction: {
        //     mode: 'index',
        //     intersect: false,
        //     // axis:'x',
        // },
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
                    boxWidth: 18,
                }
            },
            title: {
                display: true,
                text: `OEM Wise Integration Count ( ${monthNames[month]}-${year} )`,
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
            // tooltip: {
            //     displayColors: false,
            //     backgroundColor: 'white',
            //     borderColor: 'black',
            //     borderWidth: '1',
            //     padding: 10,
            //     bodyColor: 'black',
            //     bodyFont: {
            //         size: '14'
            //     },
            //     bodyAlign: 'left',
            //     footerAlign: 'right',
            //     titleColor: 'black',
            //     titleFont: {
            //         weight: 'bold',
            //         size: '15'
            //     },
            //     yAlign: 'bottom',
            //     xAlign: 'center',
            //     callbacks: {
            //         // labelColor: function(context) {
            //         //     return {
            //         //         borderColor: 'rgb(0, 0, 255)',
            //         //         backgroundColor: 'rgb(255, 0, 0)',
            //         //         borderWidth: 2,
            //         //         borderDash: [2, 2],
            //         //         borderRadius: 2,
            //         //     };
            //         // },
            //         // labelTextColor: function(context) {
            //         //     return '#543453';
            //         // },
            //         label: ((tooltipItem) => {
            //             // console.log(tooltipItem.dataset.label,":",tooltipItem.formattedValue)

            //         })
            //     },
            //     // external: function(context) {
            //     //     const tooltipModel = context.tooltip;
            //     //     const canvas = context.chart.canvas;

            //     //     canvas.onclick = function(event) {
            //     //         if (tooltipModel.opacity === 0) {
            //     //             return;
            //     //         }

            //     //         const rect = canvas.getBoundingClientRect();
            //     //         const tooltipPosition = {
            //     //             x: event.clientX - rect.left,
            //     //             y: event.clientY - rect.top
            //     //         };

            //     //         if (
            //     //             tooltipPosition.x >= tooltipModel.caretX - tooltipModel.width / 2 &&
            //     //             tooltipPosition.x <= tooltipModel.caretX + tooltipModel.width / 2 &&
            //     //             tooltipPosition.y >= tooltipModel.caretY - tooltipModel.height / 2 &&
            //     //             tooltipPosition.y <= tooltipModel.caretY + tooltipModel.height / 2
            //     //         ) {
            //     //             console.log('You clicked on the tooltip for', tooltipModel.dataPoints[0]);
            //     //         }
            //     //     };
            //     // }

            // },

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

    // TOGGAL BUTTON
    const handleChange = () => {
        setGraphType(!graphType)
    }

    const handleClose = () => {
        setOpen(false);
        setBarDialogOpen(false);
    }

    useEffect(() => {
        const chart = chartRef.current;

        if (chart) {
            chart.canvas.onclick = function (event) {
                const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

                if (points.length > 0) {
                    const firstPoint = points[0];
                    const label = chart.data.labels[firstPoint.index];
                    const datasetLabel = chart.data.datasets[firstPoint.datasetIndex].label;
                    const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];

                    //   console.log('Label:', label);
                    //   console.log('Dataset Label:', datasetLabel);
                    //   console.log('Value:', value);
                    // setBarData({circle:label,oem:datasetLabel,month:month,year:year})

                    const ClickDataGet = async () => {
                        action(true)
                        var formData = new FormData();
                        formData.append("circle", label);
                        formData.append("oem", datasetLabel.toUpperCase());
                        formData.append("month", month);
                        formData.append("year", year);

                        const responce = await makePostRequest('IntegrationTracker/hyperlink-monthly-oemwise-integration-data/', formData)
                        if (responce) {

                            action(false)
                            // console.log('hyperlink data', JSON.parse(responce.table_data))
                            setActivity_Name(datasetLabel.toUpperCase())
                            setBarData(JSON.parse(responce.table_data))
                            setBarDialogOpen(true)
                        }
                        else {
                            action(false)
                        }
                    }

                    ClickDataGet()
                    // You can perform further actions with the retrieved data here
                }
            };
        }
    }, [data2]);




    // handle dialog box
    const handleDialogBox = useCallback(() => {
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
                            // style={{  width: "100%", height: '100%' }}
                            ref={chartRef}
                            data={data2}
                            options={options}
                            plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
                        >
                        </Bar>
                    </div>
                    <div style={{ display: graphType ? 'inherit' : 'none', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "1100px", height: '600px' }}><Line
                        // style={{ width: "100%", height: 350 }}
                        data={data1}
                        options={options}
                        plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
                    >
                    </Line></div>
                </div>

            </Dialog>
        )
    }, [open])

    useEffect(() => {
        if (data) {
            setCircle(_.map(JSON.parse(data.table_data), 'cir'))
            setEricsson(_.map(JSON.parse(data.table_data), 'ERICSSON'))
            setHuawei(_.map(JSON.parse(data.table_data), 'HUAWEI'))
            setNokia(_.map(JSON.parse(data.table_data), 'NOKIA'))
            setSamsung(_.map(JSON.parse(data.table_data), 'SAMSUNG'))
            setZte(_.map(JSON.parse(data.table_data), 'ZTE'))
            setMonth(data.month)
            setYear(data.year)
            setDate(`${data.year}-${data.month < 10 ? '0' + data.month : data.month}`)
            console.log('test data',JSON.parse(data.table_data))
        }
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
        return () => {
            cancelRequest();
        }
    }, [])


    return (
        <div style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 10, height: 'auto', width: "100%", borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ width: 200, height: 350, borderRadius: 5, padding: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "20px" }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}><FilterAltIcon />FILTER DATA</div>
                <div>
                    <InputLabel style={{ fontSize: 15 }}>Select Month</InputLabel>
                    <input type='month' value={date} onChange={(e) => handleMonthData(e.target.value)} />
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
            <div style={{ display: graphType ? 'inherit' : 'none', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "800px", height: 400 }}>
                <Line
                    // style={{ width: "100%", height: 350 }}
                    ref={chartRef}
                    data={data1}
                    options={options}
                    plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
                >
                </Line>
            </div>
            <div style={{ display: graphType ? 'none' : 'inherit', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "80hv", height: 400 }}>
                <Bar
                    // style={{ width: "100%", height: 400 }}
                    ref={chartRef}
                    data={data2}
                    options={options}
                    plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
                >
                </Bar>
            </div>
                <MemoHyperOemBar dataset={barData} status={barDialogOpen} closeDialog={handleClose} month={`${monthNames[month]}-${year}`} activity={activity_Name}/>
            {handleDialogBox()}
            {loading}

        </div>
    )
}

export default OemBar