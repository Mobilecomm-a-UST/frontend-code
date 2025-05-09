import React, { useState } from 'react'
import { Chart as Chartjs } from 'chart.js/auto'
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';


const Filter = ({ circles, weeks, ageings,nt,rel,uls,up }) => {
    // const [circle,setCircle]=useState(circle)
    var New_Tower_data = [];
    var Relocation_data = [];
    var ULS_data = [];
    var Upgrade_data = [];

    console.log('qqwwwwww',weeks,nt,rel,uls,up)

    // const getprojectData = () => {
    //     arrdata?.map((item) => {

    //         New_Tower_data.push(item.NEW_TOWER.Ms2_ageing_0_15)
    //         Relocation_data.push(item.Relocation.Ms2_ageing_0_15)
    //         ULS_data.push(item.ULS.Ms2_ageing_0_15)
    //         Upgrade_data.push(item.Upgrade.Ms2_ageing_0_15)


    //     })
    // }
    const Bar_data = {
        labels: weeks,
        datasets: [{
          label: 'New Tower',
          data: nt,
          borderColor: 'green',
          backgroundColor: ['rgba(15, 255, 79, 0.53)'],
          borderWidth: 2,
          color: 'red',
          fill: true,
          tension: 0.4
        }, {
          label: 'Relocation',
          data: rel,
          borderColor: '#5DADE2',
          backgroundColor: ['rgba(93, 173, 226, 0.6)'],
          borderWidth: 2,
          color: 'blue',
          fill: true,
          tension: 0.4
        },
         {
            label: 'ULS',
            data: uls,
            borderColor: '#C39BD3',
            backgroundColor: ['rgba(195, 155, 211, 0.6)'],
            borderWidth: 2,
            color: 'red',
            fill: true,
            tension: 0.4
          }, {
            label: 'Upgrade',
            data: up,
            borderColor: 'yellow',
            backgroundColor: ['rgba(248, 196, 113, 0.6)'],
            borderWidth: 2,
            color: 'yellow',
            fill: true,
            tension: 0.4
          }
        ]
      }
      const options = {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              // This more specific font property overrides the global property
              font: {
                size: 16,
                weight: 'bold',
              },
              // color: "white",
            }
          },
          datalabels: {
            display: true,
            color: 'black',
            anchor: 'end',
            align: 'center'
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'x',
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
            }
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
            }
          }
        }
      }

    return (
        <div>
              <div style={{height:'400px',width:'70%'}}>
                <Bar 
                     style={{ boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor: "", borderRadius: 10}}
                     data={Bar_data}
                     options={options}
                     plugins={[ChartDataLabels]} 
                /> 
            </div>
            {/* {getprojectData()} */}
        </div>
    )
}

export default Filter