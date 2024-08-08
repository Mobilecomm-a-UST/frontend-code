import React, { useEffect, useState, useRef,useCallback } from 'react'
import { usePost } from '../../../Hooks/PostApis'
import { useLoadingDialog } from '../../../Hooks/LoadingDialog'
import { useQuery } from '@tanstack/react-query';
import { ServerURL } from '../../../services/FetchNodeServices';
import { Chart as Chartjs } from 'chart.js/auto'
import { Line, Bar } from 'react-chartjs-2';
import Button from '@mui/material/Button';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InputLabel from '@mui/material/InputLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LaunchIcon from '@mui/icons-material/Launch';
import Dialog from '@mui/material/Dialog';
import { useStyles } from '../../ToolsCss';
import Slide from '@mui/material/Slide';
import _ from 'lodash';
import KPICount from './KPICount';
import RCACount from './RCACount';





const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" timeout={2500} style={{ transformOrigin: '0 0 0' }} mountOnEnter unmountOnExit ref={ref} {...props} />;
  });
  
const CIRCLE = ['AP', 'BH', 'CH', 'DL', 'EH', 'HP', 'HR', 'KK', 'JH', 'JK', 'KO', 'MP', 'MU', 'OD', 'PB', 'RJ', 'TN', 'UE', 'UW', 'WB']

const CountOkNotOK = () => {
    const { makePostRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const chartRef = useRef(null);
    const classes = useStyles()
    const [graphType, setGraphType] = useState(false);
    const [open, setOpen] = useState(false)
    const [okCount, setOkCount] = useState([])
    const [notOkCount, setNotOkCount] = useState([])
    const [date, setDate] = useState('2024-08-01')
    const { isPending, isFetching, isError, data, refetch } = useQuery({
        queryKey: ['Master_RCA_Dashboard'],
        queryFn: async () => {
            action(isPending)
            var formData = new FormData()
            formData.append('date', date)
            const res = await makePostRequest("RCA_TOOL/RCA_Table_output/", formData);
            if (res) {
                action(false)
                handleCount(res.Data)
                console.log(res)
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

    const handleCount = (data) => {
        CIRCLE.map((item) => {
            let ok = 0;
            let notOk = 0;

            let filterCircle = _.filter(data, { circle: item });
            filterCircle.map((items) => {
                if (items.check_condition === 'OK') {
                    ok = ok + 1
                    // console.log('ok')
                } else {
                    notOk = notOk + 1
                    // console.log('not ok')
                }
            })

            setOkCount((prev) => [...prev, ok])
            setNotOkCount((prev) => [...prev, notOk])

            // console.log('circle', item, ok, notOk)

        })
    }

const handleDateChange = async(e) => {
    setOkCount([])
    setNotOkCount([])
    await setDate(e.target.value)
    await refetch()
}

    // TOGGAL BUTTON..........
    const handleChange = () => {
        setGraphType(!graphType)
    }
    const handleClose = () => {
        setOpen(false);
    }
    // End Toggal Button.......



    const data1 = {
        labels: CIRCLE,
        datasets: [
            {
                label: 'OK',
                data: okCount,
                borderColor: 'rgb(255, 130, 37)',
                backgroundColor: ['rgb(255, 130, 37)'],
                borderWidth: 3,
                borderRadius: 5,
                fill: false,
                tension: 0.4
            },
            {
                label: 'NOT OK',
                data: notOkCount,
                borderColor: 'rgb(255, 173, 96)',
                backgroundColor: ['rgb(255, 173, 96)'],
                borderWidth: 3,
                borderRadius: 5,
                color: 'red',
                fill: false,
                tension: 0.4
            }
        ]
    }

    const data2 = {
        labels: CIRCLE,
        datasets: [
            {
                label: 'OK',
                data: okCount,
                borderColor: 'black',
                backgroundColor: ['rgb(255, 130, 37,0.8)'],
                borderWidth: 1,
                borderRadius: 1,
                cursor: 'pointer',
                fill: true,
                tension: 0.4
            },
            {
                label: 'NOT OK',
                data: notOkCount,
                borderColor: 'black',
                backgroundColor: ['rgb(223, 211, 195)'],
                borderWidth: 1,
                borderRadius: 1,
                cursor: 'pointer',
                color: 'red',
                fill: true,
                tension: 0.4
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
                    boxWidth: 18,
                }
            },
            title: {
                display: true,
                text: `Count of OK and NOT OK`,
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
                    size: 12,
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
                    stepSize: 100,
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

            CIRCLE.map((item) => {
                let ok = 0;
                let notOk = 0;

                let filterCircle = _.filter(data.Data, { circle: item });
                filterCircle.map((items) => {
                    if (items.check_condition === 'OK') {
                        ok = ok + 1
                        // console.log('ok')
                    } else {
                        notOk = notOk + 1
                        // console.log('not ok')
                    }
                })

                setOkCount((prev) => [...prev, ok])
                setNotOkCount((prev) => [...prev, notOk])
            })
        }
    }, [])

  return (
    <>
        
            <div style={{ margin: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 10, height: 'auto', width: "98%", borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
                <div style={{ width: 200, height: 350, borderRadius: 5, padding: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "12px" }}>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}><FilterAltIcon />FILTER DATA</div>
                    {/* select month */}
                    <div>
                        <InputLabel style={{ fontSize: 15 }}>Select Date</InputLabel>
                        <input type='date' value={date} onChange={(e)=>{handleDateChange(e)}} />
                    </div>

                    {/* <div>
                        <InputLabel style={{ fontSize: 15 }}>Select To Date</InputLabel>
                        <input type='date' value={toDate} onChange={handleToDateChange} />
                    </div> */}

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

                {handleDialogBox()}

                {loading}

            </div>
            <KPICount data={data} />
            <RCACount data={data} />
        </>
  )
}

export default CountOkNotOK