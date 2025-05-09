import React, { useState, useEffect } from 'react';
import { Box, Grid } from "@mui/material";
import { Chart as Chartjs } from 'chart.js/auto'
import { Bar, Doughnut } from 'react-chartjs-2';
import { postData } from './../../../services/FetchNodeServices'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useQuery } from '@tanstack/react-query';
import { usePost } from '../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';


const Master_Dashboard = () => {
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('')
  const [week, setWeek] = useState('')

  const [show, setShow] = useState(false)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedYear, setSelectedYear] = useState('2023')
  const [project, setProject] = useState('')

  const [tableData, setTableData] = useState([])
  const [pendingData, setPendingData] = useState([])
  const [alarmBucket, setAlarmBucket] = useState([])
  const [ageing, setAgeing] = useState([])
  const { makePostRequest } = usePost()
  const {loading , action} = useLoadingDialog()


  var circleSite = [];
  var CirclePending = [];
  var accepted = [];
  var accepted_per = [];
  var rejected = [];
  var rejected_per = [];
  var dismentle = [];
  var BucketWisePending = [];
  var ageingWisePending = [];

  delete CirclePending[CirclePending.length - 1]

  const { isPending, isFetching, isError, data, error } = useQuery({
    queryKey: ['soft_at_master_api'],
    queryFn: async () => {
      action(true)
      var formData = new FormData();
      formData.append("Date", date)
      formData.append("month", month)
      formData.append("week", week)
      formData.append('from_date', fromDate)
      formData.append('to_date', toDate)
      formData.append('year', selectedYear)
      formData.append('project', project)

      const res = await makePostRequest('Soft_At/view/', formData)
      if (res) {
        action(false)
        setTableData(res.Data);
        setPendingData(res.pending_sites_bucketization)
        setAlarmBucket(res.alarm_bucketization)
        setAgeing(res.ageing_circleWise.Total)
        return res;
      }
    },
    staleTime: 400000,
    refetchOnReconnect: false,

  })


  console.log('query daata', data, isPending, isFetching)


  const datas = {
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
    labels: circleSite,
    datasets: [{
      label: 'Accepted % ',
      data: accepted_per,
      borderColor: 'green',
      backgroundColor: ['rgba(15, 255, 79, 0.53)'],
      borderWidth: 2,
      color: 'red',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Rejected % ',
      data: rejected_per,
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
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 16,
            weight: 'bold'
          }
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
        stacked: true
      },
      y: {
        stacked: true,
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
        position: 'right',
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Bucket wise(Pending Sites)',
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

  const fetchCircle = async () => {

    var formData = new FormData();
    formData.append("Date", date)
    formData.append("month", month)
    formData.append("week", week)
    formData.append('from_date', fromDate)
    formData.append('to_date', toDate)
    formData.append('year', selectedYear)
    formData.append('project', project)

    const response = await postData('Soft_At/view/', formData)

    setTableData(response.Data);
    setPendingData(response.pending_sites_bucketization)
    setAlarmBucket(response.alarm_bucketization)
    setAgeing(response.ageing_circleWise.Total)
  }

  const getDataFromQuery = () => {
    setTableData(data.Data);
    setPendingData(data.pending_sites_bucketization)
    setAlarmBucket(data.alarm_bucketization)
    setAgeing(data.ageing_circleWise.Total)
  }

  const tData = (props) => {
    console.log('test function rerendring')
    var arr = [];
    if (tableData != null) {
      Object.keys(tableData)?.map((item) => {
        arr.push({ ...tableData[item], circle: item });
      });
    }

    arr?.map((item) => {

      circleSite.push(item.circle);
      CirclePending.push(item.Pending);
      accepted.push(item.Accepted);
      rejected.push(item.Rejected);
      dismentle.push(item.Dismantle);
      accepted_per.push(item.Accepted_per);
      rejected_per.push(item.Rejection_per)
    })
  }

  const tablePendingData = () => {
    var arr = [];
    if (pendingData != null) {
      Object.keys(pendingData)?.map((item) => {
        arr.push({ ...pendingData[item], status: item });
      });
    }
    arr?.map((item, index) => {
      if (item.status == 'Pending') {
        delete item.status;
        delete item.Total
        Object.values(item)?.map((it) => {
          console.log('aaaaaa', it)
          BucketWisePending.push(it)

        })
      }
    })
  }

  const ageingData = () => {
    var arr = ageing

    Object.values(arr)?.map((it) => {
      ageingWisePending.push(it)
    })

  }

  useEffect(() => {
    // fetchCircle();
    if (data) {
      getDataFromQuery();
    }

    document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

  }, [])



  return (
    <>
      <Box style={{ margin: 10 }}>
        <div style={{ margin: 5, marginLeft: 10 }}>
          <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
            <Link underline="hover" href='/tools'>Tools</Link>
            <Link underline="hover" href='/tools/soft_at'>Soft AT</Link>
            <Typography color='text.primary'>Master Dashboard</Typography>
          </Breadcrumbs>
        </div>

        <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: 'column', md: 'row', sm: 'column' }}>
          <Grid item xs={6} >
            <Box style={{ height: '44vh' }}>
              <Bar
                style={{ height: 300, width: 550, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderRadius: 10, backgroundColor: "white" }}
                data={datas}
                options={options}

                plugins={[ChartDataLabels]}>
              </Bar>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box style={{ height: '44vh' }}>
              <Bar
                style={{ height: 300, width: 550, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderRadius: 10, backgroundColor: "white" }}
                data={{
                  labels: circleSite,
                  datasets: [
                    {
                      label: 'Rejected Sites',
                      data: rejected,
                      borderColor: 'red',
                      backgroundColor: ['rgba(255, 15, 15, 0.56)'],
                      borderWidth: 2,
                      fill: true,
                      tension: 0.4
                    }]
                }}
                options={options}
                plugins={[ChartDataLabels]}>
              </Bar>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box style={{ height: '44vh', width: '100%' }}>
              <Bar
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
              </Bar>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box style={{ height: '44vh', width: '100%' }}>
              <Bar
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
              </Bar>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box style={{ height: '44vh', width: '100%' }}>
              <Bar
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
              </Bar>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box style={{ height: '44vh', width: '100%' }}>
              <Bar
                style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', backgroundColor: "", borderRadius: 10, backgroundColor: "white" }}
                data={Acc_ReJ_Data}
                options={per_oprions}
                plugins={[ChartDataLabels, zoomPlugin]}>
              </Bar>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box style={{ height: '60vh', width: '100%' }}>
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
            </Box>
          </Grid>
        </Grid>

      </Box >
      {tData()}
      {tablePendingData()}
      {ageingData()}

      {loading}
    </>
  )
}

export default Master_Dashboard