import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Chart as Chartjs } from 'chart.js/auto'
import { TextField } from "@mui/material";
import { Line, Bar } from 'react-chartjs-2';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark'
import { ServerURL } from '../../../../services/FetchNodeServices';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LaunchIcon from '@mui/icons-material/Launch';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { usePost } from '../../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../../Hooks/LoadingDialog';
import { postData } from '../../../../services/FetchNodeServices';
import _ from 'lodash';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" timeout={2500} style={{ transformOrigin: '0 0 0' }} mountOnEnter unmountOnExit ref={ref} {...props} />;
});

const MultiSelectWithAll = ({ label, options, selectedValues, setSelectedValues }) => {
    const handleChange = (event) => {
        const { value } = event.target;
        const selected = typeof value === 'string' ? value.split(',') : value;

        if (selected.includes('ALL')) {
            if (selectedValues.length === options.length) {
                setSelectedValues([]);
            } else {
                setSelectedValues(options);
            }
        } else {
            setSelectedValues(selected);
        }
    };

    const isAllSelected = options.length > 0 && selectedValues.length === options.length;

    return (
        <FormControl sx={{ minWidth: 120, maxWidth: 120 }} size="small">
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Select
                labelId={`${label}-label`}
                multiple
                value={selectedValues}
                onChange={handleChange}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => selected.join(', ')}
            >
                <MenuItem value="ALL">
                    <Checkbox
                        checked={isAllSelected}
                        indeterminate={
                            selectedValues.length > 0 && selectedValues.length < options.length
                        }
                    />
                    <ListItemText primary="Select All" />
                </MenuItem>

                {options.map((name) => (
                    <MenuItem key={name} value={name}>
                        <Checkbox checked={selectedValues.includes(name)} />
                        <ListItemText primary={name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};


const CircleWiese = () => {
    const chartRef = useRef(null);
    const [graphType, setGraphType] = useState(false);
    const [open, setOpen] = useState(false)
    const { makePostRequest, cancelRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const milestoneOptions = [
        "Allocation",
        "RFAI",
        "RFAI Survey",
        "MO Punch",
        "Material Dispatch",
        "Material Delivered",
        "Installation End",
        "Integration",
        "EMF Submission",
        "Alarm Rectification Done",
        "SCFT I-Deploy Offered",
        "RAN PAT Offer",
        "RAN SAT Offer",
        "MW PAT Offer",
        "MW SAT Offer",
        "Site ONAIR",
        "I-Deploy ONAIR"
    ]
    const [milestone1, setMilestone1] = useState('RFAI')
    const [milestone2, setMilestone2] = useState('Site ONAIR')
    const [circle, setCircle] = useState([])
    const [site_taggingAgingData, setSite_taggingAgingData] = useState([]);
    const [site_taggingAgingOption, setSite_taggingAgingOption] = useState([]);
    const [currentStatus, setCurrentStatus] = useState([])
    const [currentStatusOption, setCurrentStatusOption] = useState([])
    const [circleWieseData, setCircleWieseData] = useState([])
    const [milestoneData, setMilestoneData] = useState({})
    const [month, setMonth] = useState('')
    let delayed;

    console.log('data get', circleWieseData)




    const fetchDailyDataCircle = async () => {

        if (milestone1 !== milestone2) {
            action(true)
            var formData = new FormData()
            formData.append('site_tagging', site_taggingAgingData)
            formData.append('current_status', currentStatus)
            formData.append('milestone1', milestone1)
            formData.append('milestone2', milestone2)
            formData.append('month', month.split('-')[1] || '')
            formData.append('year', month.split('-')[0] || '')
            const res = await postData("nt_tracker/graphs/", formData);
            // const res =  tempData; //  remove this line when API is ready
            console.log(' circle wise data', (res))
            if (res) {
                action(false)
                setCircleWieseData(transformData(JSON.parse(res.json_data.graph_summary)))
                if (currentStatusOption.length === 0 && site_taggingAgingOption.length === 0) {
                    setCircle(transformData(JSON.parse(res.json_data.graph_summary)).circle)
                    setCurrentStatusOption(res.unique_data.unique_current_status)
                    setSite_taggingAgingOption(res.unique_data.unique_site_tagging)
                    // setMilestoneOptions(res.unique_data?.milestones)
                }

                // setMainDataT2(JSON.parse(res.data))
            }
            else {
                action(false)
            }
        } else {
            alert("Please select different milestones")
        }


    }

    const transformData = (arr) => {
        const circle = arr.map(item => item.Circle);
        const RFAI_done = arr.map(item => Number(item[`${milestone1} Done Count`]));
        const onAirDone = arr.map(item => Number(item[`${milestone2} Done Count`]));
        const onAirPending = arr.map(item => Number(item[`${milestone2} Pending Count`]));

        // ✅ Calculate percentage array
        const percentage = onAirDone.map((done, index) => {
            const rfai = RFAI_done[index];
            return rfai ? Math.ceil((done / rfai) * 100) : 0;  // Avoid division by 0
        });

        return {
            circle,
            RFAI_done,
            onAirDone,
            onAirPending,
            percentage   // ✅ Added
        };
    };


    const data1 = {
        labels: circle,
        datasets: [
            {
                label: `${milestone1} Done`,
                data: circleWieseData?.RFAI_done,
                borderColor: ['rgb(171, 171, 171)'],
                backgroundColor: ['rgb(171, 171, 171)'],
                borderWidth: 3,
                borderRadius: 5,
                fill: false,
                tension: 0.4,
            },
            {
                label: `${milestone2} Done`,
                data: circleWieseData?.onAirDone,
                borderColor: ['rgb(0, 110, 116)'],
                backgroundColor: ['rgb(0, 110, 116)'],
                borderWidth: 3,
                borderRadius: 5,
                fill: false,
                tension: 0.4,
            },
            {
                label: 'Sites Converted %',
                data: circleWieseData?.percentage,
                type: 'bar',
                borderColor: 'rgb(136, 30, 135)',
                backgroundColor: 'rgb(136, 30, 135,0.3)',
                borderWidth: 2,
                borderRadius: 5,
                fill: false,
                tension: 0.4,
                yAxisID: 'y1'
            }

        ]
    }

    const data2 = {
        labels: circle,
        datasets: [
            {
                label: 'Sites Converted %',
                data: circleWieseData?.percentage,
                type: 'line', // ✅ correct property
                borderColor: 'rgb(136, 30, 135)',
                backgroundColor: 'rgb(136, 30, 135,0.7)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                yAxisID: 'y1'
            },
            {
                label: `${milestone1} Done`,
                data: circleWieseData?.RFAI_done,
                borderColor: 'black',
                backgroundColor: ['rgb(171, 171, 171)'],
                borderWidth: 1,
                borderRadius: 5,
                fill: true,
                tension: 0.4
            },
            {
                label: `${milestone2} Done`,
                data: circleWieseData?.onAirDone,

                borderColor: 'black',
                backgroundColor: ['rgb(0, 110, 116)'],
                borderWidth: 1,
                borderRadius: 5,
                fill: true,
                tension: 0.4
            },

        ]
    }


    // const options = {
    //     responsive: true,
    //     maintainAspectRatio: false,

    //     interaction: {
    //         mode: 'index',
    //         intersect: false,
    //     },

    //     plugins: {
    //         legend: {
    //             position: 'bottom',
    //             labels: {
    //                 font: {
    //                     size: 13,
    //                 },
    //                 boxWidth: 18,
    //             }
    //         },

    //         title: {
    //             display: true,
    //             text: `Circlewise Progress - ${milestone1} (${circleWieseData?.RFAI_done?.reduce((sum, num) => sum + num, 0) || 0}) to ${milestone2} (${circleWieseData?.onAirDone?.reduce((sum, num) => sum + num, 0) || 0})`,
    //             font: {
    //                 size: 16,
    //                 weight: 'bold'
    //             }
    //         },

    //         datalabels: {
    //             display: true,
    //             color: 'black',
    //             anchor: 'end',
    //             align: 'top',
    //             offset: 0.5,
    //             font: {
    //                 size: 12,
    //                 weight: 'bold'
    //             },

    //             // ⭐ Add % Symbol for Percentage Dataset ⭐
    //             formatter: (value, context) => {
    //                 if (context.dataset.label === "Sites Converted %") {
    //                     return value + "%";       // show 45%
    //                 }
    //                 return value;                 // keep normal values for others
    //             }
    //         },

    //         zoom: {
    //             zoom: {
    //                 wheel: {
    //                     enabled: true,
    //                     speed: 0.01,
    //                 },
    //                 pinch: {
    //                     enabled: true,
    //                     speed: 0.01,
    //                 },
    //                 mode: 'x',
    //             },
    //             pan: {
    //                 enabled: true,
    //                 mode: 'x'
    //             },
    //         },
    //     },

    //     scales: {
    //         x: {
    //             grid: {
    //                 display: false
    //             },
    //         },

    //         y: {
    //             grid: {
    //                 display: true,
    //             },
    //             ticks: {
    //                 stepSize: 10,
    //             },
    //         }
    //     },

    //     watermark: {
    //         image: `${ServerURL}/media/assets/logo-new.png`,
    //         x: 50,
    //         y: 50,
    //         width: 300,
    //         height: 150,
    //         opacity: 0.25,
    //         alignX: "right",
    //         alignY: "top",
    //         alignToChartArea: false,
    //         position: "back"
    //     },

    //     animation: {
    //         onComplete: () => {
    //             delayed = true;
    //         },
    //         delay: (context) => {
    //             let delay = 0;
    //             if (context.type === 'data' && context.mode === 'default' && !delayed) {
    //                 delay = context.dataIndex * 300 + context.datasetIndex * 100;
    //             }
    //             return delay;
    //         },
    //     },
    // };


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
                        color: "black",
                        boxWidth: 18,
                    }
                },
                title: {
                    display: true,
                    text: `Circlewise Progress - ${milestone1} (${circleWieseData?.RFAI_done?.reduce((sum, num) => sum + num, 0) || 0}) to ${milestone2} (${circleWieseData?.onAirDone?.reduce((sum, num) => sum + num, 0) || 0})`,
                    font: {
                        size: 16,
                        weight: 'bold',
    
                    },
                    color: 'black'
    
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
                    },
    
                    // ⭐ Add % Symbol for Percentage Dataset ⭐
                    formatter: (value, context) => {
                        if (context.dataset.label === "Sites Converted %") {
                            return value + "%";       // show 45%
                        }
                        return value;                 // keep normal values for others
                    }
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
    
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'black',   // 👈 month labels color
                        // font: {
                        //     size: 12,
                        //     weight: 'bold'
                        // }
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
                        color: 'black',
                        stepSize: 10,
                    },
                    // stacked: true
                },
                y1:{
                    position: 'right',
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#881e87',
                        callback: (value) => `${value}%`
                    }
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




    const handleMilestone1Change = (event) => {
        setMilestone1(event.target.value);
    }

    const handleMilestone2Change = (event) => {
        setMilestone2(event.target.value);
    }
    const handleMonthChange = (event) => {
        // console.log(event.target.value.split('-')[1])
        setMonth(event.target.value)
    }

    // TOGGAL BUTTON
    const handleChange = () => {
        setGraphType(!graphType)
    }

    const handleClose = () => {
        setOpen(false);

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
        setMilestoneData({
            circle: [],
            RFAI_done: [],
            onAirDone: [],
            onAirPending: [],
            percentage: []
        })
        fetchDailyDataCircle()
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
        return () => {
            cancelRequest();
        }
    }, [site_taggingAgingData, currentStatus, milestone1, milestone2,month])
    return (
        <>

            <div style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 10, height: 'auto', width: "96%", margin: 20, borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
                <div style={{ width: 200, height: 350, borderRadius: 5, padding: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "10px",overflowY:'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}><FilterAltIcon />FILTER DATA</div>
                    {/* select month */}
                    {/* <div>
                        <InputLabel style={{ fontSize: 15 }}>Select Month</InputLabel>
                        <input type='month' value={date} onChange={(e) => handleMonthData(e.target.value)} />
                    
                </div> */}


                    <FormControl sx={{ minWidth: 120, maxWidth: 120 }} size="small">
                        <InputLabel id="demo-simple-select-label">milestone1</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={milestone1}
                            label="milestone1"
                            onChange={handleMilestone1Change}
                        >
                            {milestoneOptions?.map((item, index) => (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120, maxWidth: 120 }} size="small">
                        <InputLabel id="demo-simple-select-label">milestone2</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={milestone2}
                            label="milestone2"
                            onChange={handleMilestone2Change}
                        >
                            {milestoneOptions?.map((item, index) => (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <MultiSelectWithAll
                        label="Site Tagging"
                        options={site_taggingAgingOption}
                        selectedValues={site_taggingAgingData}
                        setSelectedValues={setSite_taggingAgingData}
                    />
                    <MultiSelectWithAll
                        label="Current Status"
                        options={currentStatusOption}
                        selectedValues={currentStatus}
                        setSelectedValues={setCurrentStatus}
                    />
                    <FormControl sx={{ minWidth: 120, maxWidth: 120 }} size="small">
                        <TextField
                            variant="outlined"
                            // required
                            fullWidth
                            label="Month"
                            name="month"
                            value={month}
                            onChange={handleMonthChange}
                            size="small"
                            type="month"
                        />
                    </FormControl>

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
                    {/* <div>
          <Button color="primary" endIcon={<LaunchIcon />} onClick={() => {handleDownloadChart()}}>Download</Button>
        </div> */}
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
        </>
    )
}

export default CircleWiese