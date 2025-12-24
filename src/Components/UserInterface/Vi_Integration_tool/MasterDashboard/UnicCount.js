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
const colorArray = [
    'rgb(255, 99, 132,0.7)',   // Red
    'rgb(54, 162, 235,0.7)',   // Blue
    'rgb(255, 206, 86,0.7)',   // Yellow
    'rgb(75, 192, 192,0.7)',   // Teal
    'rgb(153, 102, 255,0.7)',  // Purple
    'rgb(255, 159, 64,0.7)',   // Orange
    'rgb(201, 203, 207,0.7)',  // Gray
    'rgb(255, 99, 71,0.7)',    // Tomato
    'rgb(144, 238, 144,0.7)',  // LightGreen
    'rgb(135, 206, 235,0.7)',  // SkyBlue
    'rgb(255, 182, 193)',  // LightPink
    'rgb(173, 216, 230)',  // LightBlue
    'rgb(255, 228, 196)',  // Bisque
    'rgb(124, 252, 0)',    // LawnGreen
    'rgb(255, 140, 0)',    // DarkOrange
    'rgb(220, 20, 60)',    // Crimson
    'rgb(255, 215, 0)',    // Gold
    'rgb(0, 255, 127)',    // SpringGreen
    'rgb(70, 130, 180)',   // SteelBlue
    'rgb(240, 128, 128)'   // LightCoral
];

const UnicCount = () => {
    const chartRef = useRef(null);
    const [graphType, setGraphType] = useState(false);
    const [open, setOpen] = useState(false)
    const { makePostRequest, cancelRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const [circle, setCircle] = useState(['ORI', 'AP', 'UPW', 'RAJ', 'BIH', 'UPE', 'KK', 'KOL', 'JRK', 'WB', 'HRY', 'ROTN', 'PUN', 'MP', 'MUM', 'DEL', 'JK', 'CHN'])
    const [selectCircle, setSelectCircle] = useState('AP')
    const [selectActivity, setSelectActivity] = useState('_DE_GROW')

    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const [date, setDate] = useState('')
    // const activityName = ['RET', 'HT INCREMENT', '5G SECTOR ADDITION', 'OTHERS', 'DE-GROW', 'ULS_HPSC', 'MACRO', 'UPGRADE', 'RELOCATION', 'RECTIFICATION']
    const [activityName, setActivityName] = useState([])
    const [activityData, setActivityData] = useState()
    const [activity_Count, setActivity_Count] = useState([])
    const { isPending, isFetching, isError, data, error, refetch } = useQuery({
        queryKey: ['Integration_month_wises'],
        queryFn: async () => {
            action(isPending)
            var formData = new FormData()
            formData.append('month', month)
            formData.append('year', year)
            try {
                const res = await makePostRequest("ix_tracker_vi/monthwise-integration-data/", formData);
                action(false);

                if (res) {
                    setMonth(res.latest_months);
                    setYear(res.latest_year);
                    setDate(`${res.latest_year[0]}-${res.latest_months[0] < 10 ? '0' + res.latest_months[0] : res.latest_months[0]}`);
                    // setCircle(_.map(JSON.parse(res.table_data), 'cir'));
                    setActivityName(_.uniqBy(res.download_data, 'Activity_Name').map(item => item.Activity_Name))
                    setActivityData(res.download_data);
                    // console.log(' data', _.uniqBy(res.download_data, 'Activity_Name').map(item => item.Activity_Name))
                    return res;
                } else {
                    // Handle the case where res is falsy
                    return {};
                }
            } catch (error) {
                action(false);
                console.error('Error fetching data:', error);
                return {}; // Return an empty object or some default value in case of error
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


    const filterData = useCallback(() => {
        handleClear()
        const counter = {};
        // Iterate over each entry in the data
        activityData?.forEach(entry => {
            const key = `${entry.CIRCLE}_${entry.Site_ID}_${entry.Activity_Name}`;
            if (counter[key]) {
                counter[key]++;
            } else {
                counter[key] = 1;
            }
        });
        // console.log('result', counter)

        const result = Object.keys(counter).map(key => {
            let [CIRCLE, Site_ID, Activity_Name] = key.split('_');
            return { CIRCLE, Site_ID, Activity_Name, count: counter[key] };
        });

        let tempcircle = _.filter(result, item => _.includes(selectCircle, item.CIRCLE))
        //     console.log('circle filter ', tempcircle)
        // console.log('circle filter', _.countBy(tempcircle, 'Activity_Name'))
        const countArray = []
        activityName.map((items) => {
            let activitycount = _.filter(tempcircle, item => _.includes(items, item.Activity_Name)).length
            countArray.push({ Activity: items, Count: activitycount })
        })
        console.log('countArray', countArray)

        setActivity_Count(countArray)

    }, [selectCircle, selectActivity, activityData])



    const data1 = {
        labels: [selectCircle],
        datasets: activity_Count.map((item, index) => ({
            label: item.Activity,
            data: [item.Count],
            borderColor: 'black',
            backgroundColor: [colorArray[index]],  // Cyan
            borderWidth: 1,
            borderRadius: 5,
            fill: true,
            tension: 0.4
        }))
    }

    const data2 = {
        labels: [selectCircle],
        datasets: activity_Count.map((item, index) => ({
            label: item.Activity,
            data: [item.Count],
            borderColor: 'black',
            backgroundColor: [colorArray[index]],
            borderWidth: 1,
            borderRadius: 5,
            fill: true,
            tension: 0.4
        }))

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
                text: `Count Of Distinct Activities ( ${monthNames[month[0]]}-${year[0]} )`,
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

    }

    const handleClear = () => {

    }



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
        // console.log('aaaa')
        filterData()
    }, [filterData])

    useEffect(() => {
        if (data) {
            setMonth(data.latest_months)
            setYear(data.latest_year)
            setDate(`${data.latest_year[0]}-${data.latest_months[0] < 10 ? '0' + data.latest_months[0] : data.latest_months[0]}`)
            // setCircle(_.map(JSON.parse(data.table_data), 'cir'))
            // console.log('activity data', res)
            setActivityData(data.download_data)
        }
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
        return()=>{
            cancelRequest();
        }
    }, [])

    return (
        <div style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 10, height: 'auto', width: "100%", borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ width: 200, height: 350, borderRadius: 5, padding: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "12px" }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}><FilterAltIcon />FILTER DATA</div>
                {/* select month */}
                <div>
                    <InputLabel style={{ fontSize: 15 }}>Select Month</InputLabel>
                    <input type='month' value={date} onChange={(e) => handleMonthData(e.target.value)} />
                </div>
                {/* select circle */}
                <div>
                    <InputLabel style={{ fontSize: 15 }}>Select Circle</InputLabel>
                    <select style={{ width: 145, height: 25, borderRadius: 2 }} value={selectCircle} onChange={(e) => setSelectCircle(e.target.value)}>
                        {circle?.map((item, index) => <option key={index} >{item}</option>)}
                    </select>
                </div>
                {/* select Activity */}
                {/* <div>
                    <InputLabel style={{ fontSize: 15 }}>Select Activity</InputLabel>
                    <select style={{ width: 145, height: 25, borderRadius: 2 }} value={selectActivity} onChange={(e) => setSelectActivity(e.target.value)}>
                        <option selected value={'_DE_GROW'}>DE-GROW</option>
                        <option value={'_MACRO'}>MACRO</option>
                        <option value={'_RELOCATION'}>RELOCATION</option>
                        <option value={'_RET'}>RET</option>
                        <option value={'_ULS_HPSC'}>ULS-HPSC</option>
                        <option value={'_UPGRADE'}>UPGRADE</option>
                        <option value={'_FEMTO'}>FEMTO</option>
                        <option value={'_HT_INCREMENT'}>HT-INCREMENT</option>
                        <option value={'_IBS'}>IBS</option>
                        <option value={'_IDSC'}>IDSC</option>
                        <option value={'_ODSC'}>ODSC</option>
                        <option value={'_RECTIFICATION'}>RECTIFICATION</option>
                        <option value={'_OTHERS'}>OTHER</option>
                    </select>
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
    )
}

export default UnicCount