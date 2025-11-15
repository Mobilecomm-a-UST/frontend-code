import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Chart as Chartjs } from 'chart.js/auto'
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
import { ServerURL } from '../../../services/FetchNodeServices';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LaunchIcon from '@mui/icons-material/Launch';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { usePost } from '../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { postData } from '../../../services/FetchNodeServices';
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


const MonthWise = () => {
    const chartRef = useRef(null);
    const [graphType, setGraphType] = useState(false);
    const [open, setOpen] = useState(false)
    const { makePostRequest, cancelRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const [mainDataT2, setMainDataT2] = useState([])
    const [monthArray, setMonthArray] = useState(['CF'])
    const [tableData, setTableData] = useState([])
    const milestones = ["RFAI", "Site ONAIR"];
    const [milestoneData, setMilestoneData] = useState({})
    const [circle, setCircle] = useState([])
    const [circleOptions, setCircleOptions] = useState([])
    const [tagging, setTagging] = useState([])
    const [taggingOptions, setTaggingOptions] = useState([])
    const [relocationMethod, setRelocationMethod] = useState([])
    const [relocationMethodOptions, setRelocationMethodOptions] = useState([])
    const [toco, setToco] = useState([])
    const [tocoOptions, setTocoOptions] = useState([])
    const [view, setView] = useState('Cumulative')
    let delayed;

    console.log('data get', monthArray, milestoneData)


    const fetchDailyData = async () => {

        action(true)
        var formData = new FormData()
        formData.append('circle', circle)
        formData.append('site_tagging', tagging)
        formData.append('relocation_method', relocationMethod)
        formData.append('new_toco_name', toco)
        formData.append('view', view)
        const res = await postData("alok_tracker/weekly_monthly_dashboard_file/", formData);
        // const res =  tempData; //  remove this line when API is read
        if (res) {
            action(false)
            setMilestoneData(extractMilestoneData(JSON.parse(res.months_data), milestones))
            if (circleOptions.length === 0) {
                setMonthArray((prev) => [...prev, ...res.unique_data.month_columns])
                setCircleOptions(res.unique_data.unique_circle)
                setTaggingOptions(res.unique_data.unique_site_tagging)
                setRelocationMethodOptions(res.unique_data.unique_relocation_method)
                setTocoOptions(res.unique_data.unique_new_toco_name)
            }


            // setMainDataT2(JSON.parse(res.data))
        }
        else {
            action(false)
        }

    }


    const extractMilestoneData = (data, milestones) => {
        const result = {};

        // Find all dynamic month keys from the first object (or any object)
        const monthKeys = _(data[0])
            .keys()
            .filter((k) => k.startsWith("Month-"))
            .sortBy((k) => Number(k.split("-")[1])) // ensure Month-1, Month-2...Month-n are in correct order
            .value();

        // Add 'CF' at start
        const keysToExtract = ["CF", ...monthKeys];

        // Loop through milestones and pick data dynamically
        _.forEach(milestones, (milestone) => {
            const item = _.find(
                data,
                (d) => d["Milestone Track/Site Count"] === milestone
            );

            if (item) {
                const values = _.map(_.pick(item, keysToExtract), (v) => Number(v));
                result[milestone] = values;
            }
        });

        if (milestones.length === 2) {
            const [m1, m2] = milestones;
            const arr1 = result[m1] || [];
            const arr2 = result[m2] || [];

            // calculate (arr1 / arr2) * 100 safely
            const percentage = _.map(arr1, (val, i) =>
                arr2[i] && arr2[i] !== 0 ? Number(((arr2[i] / val) * 100).toFixed(2)) : 0
            );

            result["Percentage"] = percentage;
        }


        return result;
    };





    const data1 = {
        labels: monthArray,
        datasets: [
            {
                label: 'RFAI',
                data: milestoneData?.RFAI,
                borderColor: 'rgb(0, 110, 116)',
                backgroundColor: ['rgb(0, 110, 116)'],
                borderWidth: 2,
                borderRadius: 5,
                fill: false,
                tension: 0.4
            },
            {
                label: 'MS1',
                data: milestoneData?.['Site ONAIR'],
                borderColor: 'rgb(107, 107, 107)',
                backgroundColor: ['rgb(204, 255, 254)'],
                borderWidth: 2,
                borderRadius: 5,
                color: 'red',
                fill: false,
                tension: 0.4
            }
            ,
            {
                label: 'Sites Converted %',
                data: milestoneData?.['Percentage'],
                type: 'bar',
                borderColor: 'rgb(183, 183, 183)',
                backgroundColor: 'rgba(183, 183, 183, 0.5)',
                borderWidth: 2,
                borderRadius: 5,
                fill: false,
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    }


    const data2 = {
        labels: monthArray,
        datasets: [

            {
                label: 'Sites Converted %',
                data: milestoneData?.['Percentage'],
                type: 'line', // ✅ correct property
                borderColor: 'rgb(72, 98, 149)',
                backgroundColor: 'rgba(48, 104, 215, 0.3)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                yAxisID: 'y1'
            },
            {
                label: 'RFAI',
                data: milestoneData?.RFAI,
                borderColor: 'black',
                backgroundColor: ['rgb(0, 110, 116)'],
                borderWidth: 1,
                borderRadius: 5,
                fill: true,
                tension: 0.4
            },
            {
                label: 'MS1',
                data: milestoneData?.['Site ONAIR'],
                borderColor: 'black',
                backgroundColor: ['rgb(171, 171, 171)'],
                borderWidth: 1,
                borderRadius: 5,
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
                text: `Monthly Progress - RFAI to MS1`,
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
                    stepSize: 10,
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
        setMilestoneData({'Percentage':[],'RFAI':[], 'Site ONAIR':[]})
        fetchDailyData()
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
        return () => {
            cancelRequest();
        }
    }, [circle, tagging, relocationMethod, toco])
    return (
        <>

            <div style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 10, height: 'auto', width: "96%", margin: 20, borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
                <div style={{ width: 200, height: 350, borderRadius: 5, padding: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "12px" }}>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}><FilterAltIcon />FILTER DATA</div>
                    {/* select month */}
                    {/* <div>
                        <InputLabel style={{ fontSize: 15 }}>Select Month</InputLabel>
                        <input type='month' value={date} onChange={(e) => handleMonthData(e.target.value)} />
                    </div> */}
                    {/* select circle */}
                    <MultiSelectWithAll
                        label="Circle"
                        options={circleOptions}
                        selectedValues={circle}
                        setSelectedValues={setCircle}
                    />
                    {/* tagging */}
                    <MultiSelectWithAll
                        label="Site Tagging"
                        options={taggingOptions}
                        selectedValues={tagging}
                        setSelectedValues={setTagging}
                    />

                    {/* Current Status */}
                    <MultiSelectWithAll
                        label="Current Status"
                        options={relocationMethodOptions}
                        selectedValues={relocationMethod}
                        setSelectedValues={setRelocationMethod}
                    />
                    {/* Toco  */}

                    <MultiSelectWithAll
                        label="TOCO"
                        options={tocoOptions}
                        selectedValues={toco}
                        setSelectedValues={setToco}
                    />

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

export default MonthWise