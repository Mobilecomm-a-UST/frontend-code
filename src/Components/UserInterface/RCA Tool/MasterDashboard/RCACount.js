import React, { useEffect, useState, useRef, useCallback } from 'react'
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


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" timeout={2500} style={{ transformOrigin: '0 0 0' }} mountOnEnter unmountOnExit ref={ref} {...props} />;
});

const CIRCLE = ['AP', 'BH', 'CH', 'DL', 'EH', 'HP', 'HR', 'KK', 'JH', 'JK', 'KO', 'MP', 'MU', 'OD', 'PB', 'RJ', 'TN', 'UE', 'UW', 'WB']
const colorArray = [
  'rgb(255, 99, 132)',   // Red
  'rgb(54, 162, 235)',   // Blue
  'rgb(255, 206, 86)',   // Yellow
  'rgb(75, 192, 192)',   // Teal
  'rgb(153, 102, 255)',  // Purple
  'rgb(255, 159, 64)',   // Orange
  'rgb(201, 203, 207)',  // Gray
  'rgb(255, 99, 71)',    // Tomato
  'rgb(144, 238, 144)',  // LightGreen
  'rgb(135, 206, 235)',  // SkyBlue
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

const RCACount = ({ data }) => {
  const { makePostRequest } = usePost()
  const { loading, action } = useLoadingDialog();
  const chartRef = useRef(null);
  const classes = useStyles()
  const [graphType, setGraphType] = useState(false);
  const [open, setOpen] = useState(false)
  const [selectCircle, setSelectCircle] = useState('AP')
  const [rcaData, setRcaData] = useState([])
  const [rcaName, setRcaName] = useState([])
  const [rcaValue, setRcaValue] = useState([])
  
  let delayed;






  // TOGGAL BUTTON..........
  const handleChange = () => {
    setGraphType(!graphType)
  }
  const handleClose = () => {
    setOpen(false);
  }
  // End Toggal Button.......


  const data1 = {
    labels: [selectCircle],
    datasets: rcaData?.map((item, index) => ({
      label: rcaName[index],
      data: [rcaValue[index]],
      borderColor: 'black',
      backgroundColor: ['rgb(100, 130, 173)'],
      borderWidth: 3,
      borderRadius: 5,
      cursor: 'pointer',
      fill: false,
      tension: 0.4
    }))
    
  }

  const data2 = {
    labels: [selectCircle],
    datasets: rcaData?.map((item, index) => ({
      label: rcaName[index],
      data: [rcaValue[index]],
      borderColor: 'black',
      backgroundColor: [colorArray[index]],
      borderWidth: 1,
      borderRadius: 1,
      cursor: 'pointer',
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
        text: `Count Of Distinct RCA Type ( ${selectCircle} )`,
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
      // CIRCLE.map((item) => {

      let filterCircle = _.filter(data.Data, { circle: selectCircle, check_condition: 'NOT OK', KPI: 'MV_RRC_Setup_Success_Rate' });
      let rcaUnique = _.uniqBy(filterCircle, 'RCA')
      // let rcaCount = _.get(filterCircle, 'RCA', 'default');
      let rcaCounts = _.countBy(filterCircle, 'RCA');
      setRcaData(rcaUnique)
      setRcaName(Object.keys(rcaCounts))
      setRcaValue(Object.values(rcaCounts))

      // console.log('RAC DATA', 'CIRCLE', 'AP', Object.keys(rcaCounts))
      // let filterCircleERAB = _.filter(data.Data, { circle: item , KPI :'MV_ERAB_Setup_Success_Rate'});
      // })
    }
  }, [data,selectCircle])
  return (
    <>

      <div style={{ margin: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 10, height: 'auto', width: "98%", borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
        <div style={{ width: 200, height: 350, borderRadius: 5, padding: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "12px" }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}><FilterAltIcon />FILTER DATA</div>
          {/* select month */}
          {/* <div>
                        <InputLabel style={{ fontSize: 15 }}>Select From Date</InputLabel>
                        <input type='date' value={fromDate} onChange={handleFromDateChange} />
                    </div>
                    <div>
                        <InputLabel style={{ fontSize: 15 }}>Select To Date</InputLabel>
                        <input type='date' value={toDate} onChange={handleToDateChange} />
                    </div> */}
          <div>
            <InputLabel style={{ fontSize: 15 }}>Select Circle</InputLabel>
            <select style={{ width: 145, height: 25, borderRadius: 2 }} value={selectCircle} onChange={(e) => setSelectCircle(e.target.value)}>
             
              {CIRCLE.map((item,index)=>(
                 <option key={index}  value={item}>{item}</option>
              ))}
            </select>
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

        {handleDialogBox()}

        {loading}

      </div>
    </>
  )
}

export default React.memo(RCACount)