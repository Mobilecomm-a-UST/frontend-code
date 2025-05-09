import React, { useState, useEffect } from 'react';
import { Box, Grid} from "@mui/material";
import { Chart as Chartjs } from 'chart.js/auto'
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { postData ,getData } from '../../../services/FetchNodeServices'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Slide from '@mui/material/Slide';



const Dashboard = () => {
  const [accepted , setAccepted] = useState()
  const [rejected , setRejected] = useState()
  const [offeredDate , setOfferedDate] = useState([]);
  const [accepted_Count ,setAccepted_Count] = useState([])
  const [rejected_count ,setRejected_count] = useState([])
  const [total_Offered , setTotal_Offered] = useState([])



  var circleSite = [];








   console.log('qqq' ,window.location.pathname.slice(1).replaceAll('_',' '))



  const data = {
    labels: circleSite,
    datasets: [{
      label: 'Accepted Sites',
      data: accepted,
      borderColor: 'green',
      backgroundColor: ['rgba(15, 255, 79, 0.53)'],
      borderWidth: 2,
      color: 'red',
      fill: true,
      tension: 0.4
    }
    ]
  }

  const Acc_ReJ_Data =
  {
    labels: offeredDate,
    datasets: [
    {
      label: 'Offered',
      data: total_Offered,
      borderColor: '#FC6736',
      backgroundColor: ['rgb(252, 103, 54,0.5)'],
      borderWidth: 2,
      color: 'red',
      fill: false,
      tension: 0.3
    },
    {
      label: 'Accepted',
      data: accepted_Count,
      borderColor: 'green',
      backgroundColor: ['rgba(15, 255, 79, 0.53)'],
      borderWidth: 2,
      color: 'red',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Rejected',
      data: rejected_count,
      borderColor: 'red',
      backgroundColor: ['rgba(255, 15, 15, 0.56)'],
      borderWidth: 2,
      color: 'red',
      fill: true,
      tension: 0.4
    }
    ]
  }

  const per_oprions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
      // axis:'x',
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 16,
            weight: 'bold'
          },

        }
      },
      title: {
        display: true,
        text:  'OFFERED DATE WISE SUMMARY',
        font: {
          size: 16,
          weight: 'bold'
        }

      },
      datalabels: {
        color: 'white',
        font: {
          weight: 'bold'
        },
        display: true,
        color: 'black',
        anchor: 'end',
        align: 'top'
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
        // stacked: true
      },
      y: {
        // stacked: true,

        grid: {
          display: true,
          // color:'white'
        },
        ticks: {
          // forces step size to be 50 units
          stepSize: ''
        }
      }
    }
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
        align: 'top'
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
  const optionss = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        // text: 'Bucket wise(Pending Sites)',
        font: {
          size: 18,
          weight: 'bold'
        }

      },
      datalabels: {
        display: true,
        color: 'black',
        font: {
          size: 15,
        }
      }
    }
  }

  const fetchData= async()=>{
    var formData = new FormData();

    formData.append('to_date', '')
    formData.append('from_date','')

    const response1 = await postData('softat_rej/date_wise_offering_status', formData)
    const response = await getData('softat_rej/graph')

    offerSiteFun(response1.data)
    console.log('rejected soft at data' , response1)
    setAccepted(response.data.Accepted_count)
    setRejected(response.data.Rejected_count)
  }


  const offerSiteFun=(data)=>{
    var arr=[];

    Object?.keys(data)?.map((item) => {

      arr.push({ ...data[item], date: item })

  })


  arr?.map((item)=>{
    setOfferedDate((prev)=>[...prev , item.date])
    setAccepted_Count((prev)=>[...prev , item.accepted_count])
    setRejected_count((prev)=>[...prev , item.rejected_count])
    setTotal_Offered((prev)=>[...prev  , item.Offered_count])
  })

  }








  useEffect(() => {
    fetchData()
    // fetchCircle();useEffect(()=>{
        document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
      // },[])
  }, [])



  return (
    <>
    <head>
      <title>
        {window.location.pathname.slice(1).replaceAll('_',' ')}
      </title>
    </head>
      <Box style={{ margin: 20 }}>
        <div style={{ margin: 5, marginLeft: 10 }}>
          <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
            <Link underline="hover" href='/tools'>Tools</Link>
            <Link underline="hover" href='/tools/UBR_soft_at_Tracker'>UBR Soft AT Tracker</Link>
            {/* <Link></Link> */}

            <Typography color='text.primary'>Dashboard</Typography>
          </Breadcrumbs>
        </div>

        <Grid container rowSpacing={2} columnSpacing={2} direction={{ xs: 'column', md: 'row', sm: 'column' }}>
        <Slide direction="left" in='true' timeout={900} style={{ transformOrigin: '1 1 1' }}>
          <Grid item xs={4} >
          <Box style={{ height: '56vh', width: '100%' }}>
            <Doughnut
                style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderRadius: 10, backgroundColor: "white" }}
                data={{
                  labels: ['Accepted' , 'Rejected'],
                  datasets: [
                    {
                      label: 'Bucket wise(Pending Sites)',
                      data: [accepted , rejected],
                      borderColor: ['green' , 'red'],
                      backgroundColor: ['rgba(15, 255, 79, 0.53)' , 'rgba(255, 15, 15, 0.56)'],
                      borderWidth: 1,
                      hoverBorderWidth: 2,

                    }]
                }}
                options={optionss}
                plugins={[ChartDataLabels]}
              >
              </Doughnut>
            </Box>
          </Grid>
          </Slide>
          <Slide direction="left" in='true' timeout={600} style={{ transformOrigin: '1 1 1' }}>
          <Grid item xs={6}>
          <Box style={{ height: '60vh', width: '100%' }}>
               <Bar
                style={{height: '56vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', backgroundColor: "", borderRadius: 10, backgroundColor: "white" }}
                data={Acc_ReJ_Data}
                options={per_oprions}
                plugins={[ChartDataLabels, zoomPlugin]}>
              </Bar>
            </Box>
          </Grid>
          </Slide>
          <Grid item xs={6}>
            <Box style={{ height: '300px', width: '100%' }}>
              {/* <Bar
                style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', height: 300, width: 550, borderRadius: 10, backgroundColor: "white" }}
                data={{
                  labels: circleSite,
                  datasets: [
                    {
                      label: 'Dismantle Sites',
                      data: dismentle,
                      borderColor: 'rgba(235, 150, 76, 1)',
                      backgroundColor: ['rgba(235, 150, 76, 0.79)'],
                      borderWidth: 2
                    }
                  ]
                }}
                options={options}
                plugins={[ChartDataLabels]}>
              </Bar> */}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box style={{ height: '300px', width: '100%' }}>
              {/* <Bar
                style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', height: 300, width: 550, borderRadius: 10, backgroundColor: "white" }}
                data={{
                  labels: circleSite,
                  datasets: [
                    {
                      label: 'Pending Sites',
                      data: CirclePending,
                      borderColor: 'Yellow',
                      backgroundColor: ['rgba(255, 239, 15, 0.65)'],
                      borderWidth: 2,
                      fill: true,
                      tension: 0.4
                    }]
                }}
                options={options}
                plugins={[ChartDataLabels]}>
              </Bar> */}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box style={{ height: '300px', width: '100%' }}>
              {/* <Bar
                style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', height: 300, width: 550, borderRadius: 10, backgroundColor: "white" }}
                data={{
                  labels: ['0-15', '16-30', '31-60', '61-90', 'GT-90', 'GT-120', 'Total'],
                  datasets: [
                    {
                      label: 'Ageing wise(Pending Sites)',
                      data: ageingWisePending,
                      borderColor: 'rgba(161, 68, 218)',
                      backgroundColor: ['rgba(161, 68, 218, 0.5)'],
                      borderWidth: 2
                    }
                  ]
                }}
                options={options}
                plugins={[ChartDataLabels]}>
              </Bar> */}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box style={{ height: '300px', width: '100%' }}>
              {/* <Bar
                style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', backgroundColor: "", borderRadius: 10, backgroundColor: "white" }}
                data={Acc_ReJ_Data}
                options={per_oprions}
                plugins={[ChartDataLabels, zoomPlugin]}>
              </Bar> */}
            </Box>
          </Grid>

          <Grid item xs={6}>
            {/* <Box style={{ height: '500px', width: '100%',padding:5 }}>
              <Doughnut
                style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderRadius: 10, backgroundColor: "white" }}
                data={{
                  labels: ['Circle Team', 'NOC Team', 'UBR Team'],
                  datasets: [
                    {
                      label: 'Bucket wise(Pending Sites)',
                      data: BucketWisePending,
                      borderColor: '#D35400',
                      backgroundColor: ['#7FB3D5', '#148F77', '#B9770E ', '#EB984E'],
                      borderWidth: 0,
                      hoverBorderWidth: 2,

                    }]
                }}
                options={optionss}
                plugins={[ChartDataLabels]}
              >
              </Doughnut>
            </Box> */}
          </Grid>
        </Grid>

      </Box >
    </>
  )
}

export default Dashboard