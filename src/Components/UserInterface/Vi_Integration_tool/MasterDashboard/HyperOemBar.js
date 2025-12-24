import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Chart as Chartjs } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark'
import { ServerURL } from '../../../services/FetchNodeServices';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" timeout={2500} style={{ transformOrigin: '0 0 0' }} mountOnEnter unmountOnExit ref={ref} {...props} />;
});

const HyperOemBar = ({ dataset ,status,closeDialog,month,activity}) => {
    let delayed;
    console.log('data', dataset)
    const data2 = {
        labels: [dataset? dataset[0]?.cir:'nan'],
        datasets: [
            {
                label: 'DE-GROW',
                data: [dataset?dataset[0]?.DE_GROW:'0'],
                borderColor: 'black',
                backgroundColor: ['rgb(192, 57, 43,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                fill: true,
                tension: 0.4
            },
            {
                label: 'MACRO',
                data: [dataset?dataset[0]?.MACRO:'0'],
                borderColor: 'black',
                backgroundColor: ['rgb(236, 112, 99,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4
            },
            {
                label: 'RELOCATION',
                data: [dataset? dataset[0]?.RELOCATION:'0'],
                borderColor: 'black',
                backgroundColor: ['rgb(136, 78, 160 ,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4
            },
            {
                label: 'RET',
                data: [dataset? dataset[0]?.RET:'0'],
                borderColor: 'black',
                backgroundColor: ['rgb(244, 208, 63,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4
            },
            {
                label: 'ULS HPSC',
                data: [dataset ?dataset[0]?.ULS_HPSC:'0'],
                borderColor: 'black',
                backgroundColor: ['rgb(187, 143, 206,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4,
                borderRadius: 1
            },
            {
                label: 'UPGRADE',
                data: [dataset? dataset[0]?.UPGRADE:'0'],
                borderColor: 'black',
                backgroundColor: ['rgb(229, 152, 102,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4,
                borderRadius: 1
            },
            {
                label: 'FEMTO',
                data: [dataset? dataset[0]?.FEMTO:'0'],
                borderColor: 'black',
                backgroundColor: ['rgb(93, 173, 226,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4,
                borderRadius: 1
            },
            {
                label: 'HT-INCREMENT',
                data: [dataset?dataset[0]?.HT_INCREMENT:'0'],
                borderColor: 'black',
                backgroundColor: ['rgb(118, 215, 196,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4,
                borderRadius: 1
            },
            {
                label: 'IBS',
                data: [dataset?dataset[0]?.IBS:'0'],
                borderColor: 'black',
                backgroundColor: ['rgb(34, 153, 84 ,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4,
                borderRadius: 1
            },
            {
                label: 'ODSC',
                data: [dataset? dataset[0]?.ODSC:'0'],
                borderColor: 'black',
                backgroundColor: ['rgb(243, 156, 18,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4,
                borderRadius: 1
            },
            {
                label: 'RECTIFICATION',
                data: [dataset?dataset[0]?.RECTIFICATION:'0'],
                borderColor: 'black',
                backgroundColor: ['rgb(211, 84, 0 ,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4,
                borderRadius: 1
            },
            {
                label: 'OTHERS',
                data: [dataset?dataset[0]?.OTHERS:'0'],
                borderColor: 'black',
                backgroundColor: ['rgb(133, 146, 158,0.8)'],
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
                text: `OEM (${activity}) Wise Integration Count ${month}`,
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
    return (
        <>
            <Dialog
                fullWidth={true}
                maxWidth={'md'}
                TransitionComponent={Transition}
                open={status}

            >
                 <DialogTitle>Activity Graph <span style={{ float: 'right' }} ><IconButton size="large" onClick={closeDialog}><CloseIcon /></IconButton></span></DialogTitle>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{  filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "800px", height: 400 }}>
                <Bar
                    // style={{ width: "100%", height: 400 }}
                    data={data2}
                    options={options}
                    plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
                >
                </Bar>
            </div>
                </div>

            </Dialog>

        </>
    )
}

export const MemoHyperOemBar = React.memo(HyperOemBar)