import React from 'react'
import { getData, postData } from '../../../services/FetchNodeServices'
import { useState } from 'react'
import { useEffect } from 'react'
import { Box, Grid, Stack, Button } from '@mui/material'
import { Bar, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PublishIcon from '@mui/icons-material/Publish';
import ClearIcon from '@mui/icons-material/Clear';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';





const WeeklyComparision = () => {
  const [year, setYear] = useState(2024)
  const [week, setWeek] = useState()
  const [weekPendency, setWeekPendency] = useState([])
  const [top3, setTop3] = useState([])
  const [accepted, setAccepted] = useState()
  const [pendencyChangePer, setPendencyChangePer] = useState()
  const [ageingChangePer, setAgeingChangePer] = useState();
  const [pendencyCW, setPendencyCW] = useState()
  const [pendencyPW, setPendencyPW] = useState()
  const [ageingCW, setAgengCW] = useState()
  const [ageingPW, setAgengPW] = useState()
  const [currentWeek, setCurrentWeek] = useState()
  const [ageingChangeData, setAgeingChangeData] = useState()
  const [open, setOpen] = useState(false)
  const [displayFilterData, setDisplayFilterData] = useState('')
  const [weekNo, setWeekNo] = useState([]);
  const [acceptedCount, setAcceptedCount] = useState([])
  const [overAllCount, setOverAllCount] = useState([])
  const [under30, setUnder30] = useState([])
  const [above30, setAbove30] = useState([])

  // ABOVE 30 ACCEPTED GRAPH DATA STOREGE ......

  const [xAxisValue , setXAxisValue ] = useState([])
  const [lAcceptedCount , setLAcceptedCount] = useState([])
  const [lAbove30,setLAbove30] = useState([])


  var circleSite = [];
  var current_week = [];
  var previus_week = [];
  var top_three_circle = []
  var topThreeValue = []


  // console.log('pendency change per', overAllCount)



  const data = {
    labels: circleSite,
    datasets: [{
      label: 'Current Week',
      data: current_week,
      borderColor: '#525CEB',
      backgroundColor: ['rgb(82, 92, 235,0.8)'],
      borderWidth: 2,
      color: 'red',
      fill: true,
      tension: 0.4
    }, {
      label: 'Previous Week',
      data: previus_week,
      borderColor: '#86B6F6',
      backgroundColor: ['rgb(180, 212, 255)'],
      borderWidth: 2,
      color: 'red',
      fill: true,
      tension: 0.4
    }
    ]
  }

  const pending_Data = {
    labels: weekNo,
    datasets: [{
      label: 'Under-30',
      data: under30,
      borderColor: '#F8E559',
      backgroundColor: ['rgb(248, 229, 89,0.8)'],
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }, {
      label: 'Above-30',
      data: above30,
      borderColor: '#FFBB64',
      backgroundColor: ['rgb(246, 215, 118)'],
      borderWidth: 2,
      color: 'red',
      fill: true,
      tension: 0.4
    }
    ]
  }
  const Accepting_Data ={
    labels: xAxisValue,
    datasets: [{
      label: 'Above-30',
      data: lAbove30,
      borderColor: '#FFBB64',
      backgroundColor: ['rgb(246, 215, 118)'],
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }, {
      label: 'Accepted',
      data: lAcceptedCount,
      borderColor: 'green',
      backgroundColor: ['rgba(15, 255, 79, 0.53)'],
      borderWidth: 2,
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
      legend: {
        position: 'bottom',
        labels: {
          // This more specific font property overrides the global property

          font: {
            size: 16,
            weight: 'bold',
          },
          // color: "white",
        }
      },
      title: {
        display: true,
        text: 'Top Three Circle',
        font: {
          size: 18,
          weight: 'bold'
        }

      },
      datalabels: {
        display: true,
        color: 'black',
        anchor: 'end',
        align: 'center',
        font: {
          size: 14,
          weight: 'bold'
        }
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
  const options1 = {
    responsive: true,
    // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
    maintainApectRatio: false,
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
            weight: 'bold',
          },
          // color: "white",
        }
      },
      title: {
        display: true,
        text: 'Pendency Comparison Between Two Weeks',
        font: {
          size: 18,
          weight: 'bold'
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
  const options2 = {
    responsive: true,
    // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
    maintainApectRatio: false,
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
            weight: 'bold',
          },
          // color: "white",
        }
      },
      title: {
        display: true,
        text: 'Week wise Soft_At Acceptance',
        font: {
          size: 15,
          weight: 'bold'
        }

      },
      datalabels: {
        display: true,
        color: 'black',
        anchor: 'end',
        align: 'center',
        font: {
          size: 14,
          weight: 'bold'
        }
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
  const options3 = {
    responsive: true,
    // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
    maintainApectRatio: false,
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
            weight: 'bold',
          },
          // color: "white",
        }
      },
      title: {
        display: true,
        text: 'Week Wise Pending Count of Aging',
        font: {
          size: 15,
          weight: 'bold'
        }

      },
      datalabels: {
        display: true,
        color: 'black',
        anchor: 'end',
        align: 'center',
        font: {
          size: 14,
          weight: 'bold'
        }
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
  const options4 = {
    responsive: true,
    // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
    maintainApectRatio: false,
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
            weight: 'bold',
          },
          // color: "white",
        }
      },
      title: {
        display: true,
        text: 'Above-30 Acceptance Count',
        font: {
          size: 15,
          weight: 'bold'
        }

      },
      datalabels: {
        display: true,
        color: 'black',
        anchor: 'end',
        align: 'center',
        font: {
          size: 14,
          weight: 'bold'
        }
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
        text: 'Over All Per%',
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

  const fetchWeeklyData = async () => {
    var formData = new FormData();
    formData.append("year", year);
    formData.append("week", week);

    const response = await postData('Soft_At/weekly_comparision_dashboard/', formData);


    console.log('Weekly Comparision', response)


    setAccepted(response.Accepted)
    setWeekPendency(response.weekly_pendency_graph)
    setTop3(response.top_3_values)
    setPendencyChangePer(response.Pendency_comp_data?.Pendency_change_per)
    setAgeingChangePer(response.ageing_comp_data?.ageing_change_per)
    setAgengCW(response.ageing_comp_data?.corresponding_current_ageing_value)
    setAgengPW(response.ageing_comp_data?.greates_ageing_previous_week_value)
    setPendencyCW(response.Pendency_comp_data?.Pendency_of_current_week)
    setPendencyPW(response.Pendency_comp_data?.Pendency_of_previous_week)
    setAgeingChangeData((response.ageing_comp_data?.greates_ageing_previous_week).slice(7))


  }

  const fetchWeekWisePending= async()=>{

    const response4 = await getData('Soft_At/week_wise_pending/');
    Pending_Count_aging(response4.data)
  }

  const fetchOverAllCount= async()=>{
    const response3 = await getData('Soft_At/OverAll/');
    setOverAllCount(response3.data)

  }

  const fetchWeekWiseAccepted= async()=>{
    const response2 = await getData('Soft_At/week_wise_accepted/')
    response2.data?.map((item) => {
      setWeekNo((prev) => [...prev, 'Week' + item.week_number])
      setAcceptedCount((prev) => [...prev, item.accepted_status_count])
    })

  }

  const fetchLastWeekData = async ()=>{
    const responce1 = await getData('Soft_At/week_ageing_wise_accepted_pending_sites/')
    if(responce1){
      graterThen30(responce1.data)
    }
  }

  const Pending_Count_aging = (data) => {
    var arr = [];
    Object.keys(data)?.map((item) => {
      arr.push({ ...data[item], week: item });

    });
    arr?.map((item) => {
      setUnder30((prev) => [...prev, item.Pending_Under_30])
      setAbove30((prev) => [...prev, item.Pending_Above_30])
    })

  }

  const graterThen30=(data)=>{
    var arr = [];
    Object.keys(data)?.map((item) => {
      arr.push({ ...data[item], week: item });

    });
    // console.log('all week data'  , arr)
    arr?.map((item) => {
        setXAxisValue((prev)=>[...prev , item.week])
        setLAbove30((prev)=>[...prev , item.Week_2_added_site])
        setLAcceptedCount((prev)=>[...prev , item.accepted_count])
    })
  }

  const week_pendency_data = () => {
    var arr = [];
    if (weekPendency != null) {
      Object.keys(weekPendency)?.map((item) => {
        arr.push({ ...weekPendency[item], circle: item });
      });
    }
    arr?.map((item) => {

      circleSite.push(item.circle);
      current_week.push(item.current_week_pendency)
      previus_week.push(item.previous_week_pendency)
    })
  }
  const top_3_values = () => {
    top3?.map((item) => {
      top_three_circle.push(item[0]);
      topThreeValue.push(item[1])
    })
  }

  const getCurrentWeekData = async () => {
    var currentDate = new Date();
    var year = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - year) / (24 * 60 * 60 * 1000));
    var week = Math.ceil(((currentDate.getDay() + 1 + days) / 7) - 1);
    console.log("Week Number of the current date (" + currentDate.getDay() + ") is : " + week);
    setCurrentWeek(week)
    setDisplayFilterData("Week : " + week)
    setWeek(week)
    // fetchWeeklyData()
  }

  const handleClose = () => {
    setOpen(false)
  }
  // ***********Handle Submit *************//
  const handleSubmit = () => {

    if (week.length > 0) {
      setDisplayFilterData("Week : " + week)
    }

    fetchWeeklyData();
    setOpen(false);
  }

  // ********** ANNUAL WEEK  **************
  const annualWeek = () => {
    var arr = [];
    for (let i = 1; i <= 52; i++) {
      arr.push(i)
    }
    return arr.map((item) => {
      return (
        <option key={item} value={item}>Week {item}</option>
      )
    })
  }

  // ********** Filter Dialog Box **********//
  const filterDialog = () => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        keepMounted
        style={{ zIndex: 5 }}
      >
        {/* <DialogTitle><span style={{ fontSize: 22, fontWeight: 'bold' }}><u>Filter Table</u></span></DialogTitle> */}
        <DialogContent style={{ backgroundColor: '#9BD0F2' }}>
          <Stack direction='column'>
            {/* <Box><span style={{ fontSize: 18, fontWeight: 'bold' }}>Date Wise</span></Box> */}
            {/* <Box style={{ height: 'auto', width: 'auto', padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}><input value={date} type='date' max={todayDate} onChange={(e) => { setDate(e.target.value); setMonth(''); setWeek(''); setFromDate(''); setToDate('') }} style={{ height: '35px', width: '150px', fontSize: '18px', border: '1px solid #eaedf0' }} /></Box> */}



            <Box style={{ fontSize: 18, fontWeight: 'bold' }}> Week Wise</Box>
            <Box style={{ height: 'auto', width: "auto", padding: 10, borderRadius: 10, border: '0px solid black', backgroundColor: 'white', boxShadow: ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px' }}>
              {/* YEARS SELECTER */}

              <Box style={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>

                {/* WEEKS SELECTER */}
                <div >
                  <select value={week} onChange={(e) => { setWeek(e.target.value); setCurrentWeek(e.target.value) }} style={{ height: '35px', width: '150px', fontSize: '18px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                    <option value="" disabled selected hidden>Annual Week</option>
                    {annualWeek()}
                  </select>
                  {/* <input type="week" onChange={anualWeeks} value="@week"  id="Week" /> */}
                </div>
              </Box>
            </Box>

          </Stack>
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#B0D9F3', display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='contained' color='secondary' endIcon={<DeleteOutlineIcon />}>clear</Button>
          <Button onClick={() => { handleSubmit(); handleClear() }} variant='contained' color='success' endIcon={<PublishIcon />} >submit</Button>
          <Button onClick={handleClose} variant='contained' color='error' endIcon={<ClearIcon />}>cancel</Button>
        </DialogActions>

      </Dialog>
    )
  }

  // handle clear prev. data........
  const handleClear = () => {
    // setWeekNo([])
    // setAcceptedCount([])
  }

  useEffect(() => {
    getCurrentWeekData();
    fetchLastWeekData();
    fetchWeekWiseAccepted();
    fetchOverAllCount();
    fetchWeekWisePending();
    // fetchWeeklyData();
    // handleSubmit()
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`



  }, [])

  useEffect(() => {

    fetchWeeklyData();


  }, [week])


  return (
    <>
      <div style={{ margin: 20 }}>
        <div style={{ margin: 5, marginLeft: 10 }}>
          <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
            <Link underline="hover" href='/tools'>Tools</Link>
            <Link underline="hover" href='/tools/soft_at'>Soft AT</Link>
            <Typography color='text.primary'>Weekly Comparison</Typography>
          </Breadcrumbs>
        </div>
        {/* ************* FILTER BOX **************** */}
        <div style={{ height: 'auto', width: '100%', margin: '5px 0px', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', borderRadius: '10px', padding: '2px', display: 'flex', backgroundColor: '#fff' }}>
          <Grid container spacing={1}>
            <Grid item xs={10} style={{ display: "flex" }}>
              <Box >
                <Tooltip title="Filter list">
                  <IconButton onClick={() => { setOpen(true) }}>
                    <FilterAltIcon fontSize='large' color='primary' />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box style={{ marginTop: 6 }} >
                <span style={{ fontSize: 24, color: '#5DADE2', fontFamily: "monospace", fontWeight: 500, }}>{displayFilterData}</span>
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box style={{ float: 'right' }}>
                {/* <Tooltip title="Export Excel">
                <IconButton onClick={() => { handleExport() }}>
                  <DownloadIcon fontSize='large' color='primary' />
                </IconButton>
              </Tooltip> */}
              </Box>
            </Grid>
          </Grid>

        </div>
        {/*  */}
        <div style={{ marginTop: 15 }}>
          <div style={{ width: "100%", display: "grid", gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '130px', gridColumnGap: '40px' }}>
            <div style={{ borderRadius: 10, boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', borderBottom: '8px solid green', backgroundColor: '#fff' }}>
              <Box style={{ margin: 4 }}>
                <Box style={{ fontSize: 18, fontWeight: 'bold' }}>ACCEPTED</Box>
                <Box textAlign={'right'} sx={{ fontSize: 30, fontWeight: "bold" }}>{accepted}</Box>
              </Box>
            </div>
            <div style={{ borderRadius: 10, boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', borderBottom: '8px solid yellow', backgroundColor: '#fff' }}>
              <Box style={{ margin: 4 }}>
                <Box style={{ fontSize: 18, fontWeight: 'bold' }}>PENDENCY CHANGE</Box>
                <Box textAlign={'right'} sx={{ fontSize: 30, fontWeight: "bold", display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  {pendencyChangePer < 0 ? <><ArrowDownwardIcon fontSize='large' style={{ color: '#FF9843' }} /></> : <ArrowUpwardIcon fontSize='large' style={{ color: '#FF9843' }} />}
                  {Math.abs(pendencyChangePer)}%
                </Box>
                <Box style={{ marginTop: 30, fontWeight: 'bold' }}>WEEKS {currentWeek - 1}: <span>{pendencyPW}</span> || WEEKS {currentWeek}: <span>{pendencyCW}</span></Box>
              </Box>
            </div>
            <div style={{ borderRadius: 10, boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', borderBottom: '8px solid red', backgroundColor: '#fff' }}>
              <Box style={{ margin: 4 }}>
                <Box style={{ fontSize: 18, fontWeight: 'bold', margin: 4 }}>AGEING CHANGE {ageingChangeData}</Box>
                <Box textAlign={'right'} sx={{ fontSize: 30, fontWeight: "bold", display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  {ageingChangePer < 0 ? <><ArrowDownwardIcon fontSize='large' /></> : <ArrowUpwardIcon fontSize='large' />}
                  {Math.abs(ageingChangePer)}%
                </Box>
                <Box style={{ marginTop: 28, fontWeight: 'bold' }}>WEEKS {currentWeek - 1}: <span>{ageingPW}</span> || WEEKS {currentWeek}: <span>{ageingCW}</span></Box>
              </Box>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 15 }}>
          <div style={{ width: "100%", display: "grid", gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'auto', gap:'10px' }}>
            <div style={{ height: 300 }}>
              <Bar data={{
                labels: top_three_circle,
                datasets: [{
                  label: 'Accepted',
                  data: topThreeValue,
                  borderColor: 'green',
                  backgroundColor: ['rgba(15, 255, 79, 0.53)'],
                  borderWidth: 2,
                  color: 'red',
                  fill: true,
                  tension: 0.4
                }]
              }}
                style={{ boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor: "#fff", borderRadius: 10 }}
                options={options}
                plugins={[ChartDataLabels]} />
            </div>
            <div style={{ height: 300 }}>
              <Bar
                style={{ boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor: "#fff", borderRadius: 10, width: '100%' }}
                data={data}
                options={options1}
                plugins={[ChartDataLabels, zoomPlugin]} />
            </div>
            <div style={{ height: 300 }}>
              <Bar
                style={{ boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor: "#fff", borderRadius: 10, width: '100%' }}
                data={{
                  labels: weekNo,
                  datasets: [{
                    label: 'Accepted',
                    data: acceptedCount,
                    borderColor: 'green',
                    backgroundColor: ['rgba(15, 255, 79, 0.53)'],
                    borderWidth: 2,
                    color: 'red',
                    fill: true,
                    tension: 0.4
                  }]
                }}
                options={options2}
                plugins={[ChartDataLabels, zoomPlugin]} />
            </div>
            {/* WEEK WISE PENDING COUNT OF AGEING */}
            <div style={{ height: 300 }}>
              <Bar
                 style={{ boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor: "#fff", borderRadius: 10, width: '100%' }}
                 data={pending_Data}
                 options={options3}
                 plugins={[ChartDataLabels, zoomPlugin]} />
            </div>
            {/* ABOVE 30 ACCEPTANCE COUNT */}
            <div style={{ height: 310 }}>
              <Bar
                 style={{ boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor: "#fff", borderRadius: 10, width: '100%' }}
                 data={Accepting_Data}
                 options={options4}
                 plugins={[ChartDataLabels, zoomPlugin]} />
            </div>
            <div style={{ height: 300, width: '100%', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderRadius: 10, backgroundColor: "white" }}>
              <Doughnut
                style={{marginLeft:'auto',marginRight:'auto'}}
                data={{
                  labels: ['Accepted', 'Pending' , 'Rejected'],
                  datasets: [
                    {
                      label: 'Over All Percentage',
                      data: [overAllCount[0]?.accepted_percentage, overAllCount[0]?.pending_percentage ,overAllCount[0]?.rejected_percentage],
                      borderColor: ['#4F6F52', '#F6D776', '#D24545'],
                      backgroundColor: ['rgba(15, 255, 79, 0.53)','rgb(246, 215, 118)', 'rgb(210, 69, 69,0.6)'],
                      borderWidth: 0,
                      hoverBorderWidth: 2,

                    }]
                }}
                options={optionss}
                plugins={[ChartDataLabels]}
              >
              </Doughnut>
            </div>
          </div>
        </div>
      </div>
      {week_pendency_data()}
      {top_3_values()}
      {filterDialog()}
    </>
  )
}

export default WeeklyComparision