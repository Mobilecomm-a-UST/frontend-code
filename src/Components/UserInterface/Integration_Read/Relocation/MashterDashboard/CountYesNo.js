import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { Chart as Chartjs } from 'chart.js/auto'
import { Line, Bar } from 'react-chartjs-2';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InputLabel from '@mui/material/InputLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LaunchIcon from '@mui/icons-material/Launch';
import Dialog from '@mui/material/Dialog';
import { ServerURL } from '../../../../services/FetchNodeServices';
import Slide from '@mui/material/Slide';
import _ from 'lodash';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" timeout={2500} style={{ transformOrigin: '0 0 0' }} mountOnEnter unmountOnExit ref={ref} {...props} />;
});

const CountYesNo = ({ totalTable, circleData }) => {
    const [selectSiteStatus, setSelectSiteStatus] = useState('allocated_vs_deployed_tech_deviation')


    const chartRef = useRef(null);
    const [graphType, setGraphType] = useState(false);
    const [open, setOpen] = useState(false)
    const [circle, setCircle] = useState([])
    const [activityData, setActivityData] = useState([])
    const [yesData,setYesData] = useState([])
    const [noData,setNoData] = useState([])

    let delayed;
  
  

  
  
    
  
  
  
    const data1 = {
      labels: circleData,
      datasets: [
        {
          label: `NO`,
          data: noData,
          borderColor: 'rgb(0, 159, 189)',
          backgroundColor: ['rgb(0, 159, 189)'],
          borderWidth: 2,
          borderRadius: 5,
          fill: false,
          tension: 0.4
        },
        {
          label: `Yes`,
          data: yesData,
          borderColor: 'rgb(249, 226, 175)',
          backgroundColor: ['rgb(249, 226, 175)'],
          borderWidth: 2,
          borderRadius: 5,
          color: 'red',
          fill: false,
          tension: 0.4
        },
     
      ]
    }
  
    const data2 = {
      labels: circleData,
      datasets: [
        {
          label: 'NO',
          data: noData,
          borderColor: 'black',
          backgroundColor: ['rgb(0, 159, 189)'],
          borderWidth: 1,
          borderRadius: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: "YES",
          data: yesData,
          borderColor: 'black',
          backgroundColor: ['rgb(240, 138, 66)'],
          borderWidth: 1,
          borderRadius: 2,
          color: 'red',
          fill: true,
          tension: 0.4
        },
        
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
          text: `Deviation Status (Allocated Vs Deployed) Count `,
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
  
    const handleDialogBox = useMemo(() => {
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
        const ArrayYes=[];
        const ArrayNo=[];
       circleData.map((item) => {
           let filterCircle = _.filter(totalTable, { circle: item });
           let countYesNo = _.countBy(filterCircle, 'allocated_vs_deployed_tech_deviation');
        //    console.log('countYesNo' , countYesNo)
           ArrayYes.push(countYesNo.Yes || 0)
           ArrayNo.push(countYesNo.No || 0)
       })

       setNoData(ArrayNo)
       setYesData(ArrayYes)

       console.log('ArrayYes' , ArrayYes)
       console.log('ArrayNo' , ArrayNo)

    }, [circleData])


    return  (<>
           
        
            <div style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 10, height: 'auto', width: "100%", borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ width: 200, height: 350, borderRadius: 5, padding: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "12px" ,backgroundColor:'rgb(247,247,241)'}}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}><FilterAltIcon />FILTER DATA</div>
               
                
        
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
        
              {handleDialogBox}
    
            </div>
          </>
    )
}

export default React.memo(CountYesNo); //CountYesNo