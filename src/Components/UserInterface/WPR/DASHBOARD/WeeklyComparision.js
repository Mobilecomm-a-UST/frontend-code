import React from 'react'
import { useState } from 'react'
import { postData } from '../../../services/FetchNodeServices'
import { useEffect } from 'react'
import { Box, Grid, Stack, Button } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InputLabel from '@mui/material/InputLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PublishIcon from '@mui/icons-material/Publish';
import ClearIcon from '@mui/icons-material/Clear';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import GearIcon from '@rsuite/icons/Gear';
import Swal from "sweetalert2";
import { Chart as Chartjs } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import Filter from './Filter';
// import { AllWeekData } from './WeekWiseData';






const WeeklyComparision = () => {
  const [circle, setCircle] = useState([])
  const [selectCircle, setSelectCircle] = useState('UPW')
  const [week, setWeek] = useState([])
  const [ageing, setAgeing] = useState()
  const [open, setOpen] = useState(false)
  const [ageingNo, setAgeingNo] = useState('')
  const [ageingNo2, setAgeingNo2] = useState('GT90')
  const [week_data, setWeek_data] = useState([])
  const [overAllData, setOverAllData] = useState([])
  const [nts, setNts] = useState([])
  const [rel, setRel] = useState([])
  const [uls, setUls] = useState([])
  const [upg, setUpg] = useState([])
  const [loadingBox, setLoadingBox] = useState(false)


  const [newData,setNewData] = useState([])

  const [tempAgeing , setTempAgeing] = useState([])

  const weekaaaaaa = []



  console.log('bbbbbbbbbbb',overAllData)
  console.log('wwwwwwwwwwwww', week,ageingNo)

  // @@@@@@@@@@@@@ FILTER FOR MS1 AGEING FUNCTION @@@@@@@@@@@@@@@@
  const testData=(data)=>{
      week.map((item1)=>{
        var upgradeData =0 ;
      var NEW_TOWERData = 0;
      var UlsData = 0;
      var RelocationData = 0;

        var filterWeek=overAllData.filter((item)=>(item.WEEK == item1))
        var filterCircle =filterWeek.filter((item)=>{
          return item.CIRCLE == selectCircle
        })
        var Ms1Filter = filterCircle.filter((item)=>(item.MS1===null))
        var ageingFilter = Ms1Filter.filter((item)=>(item.Internal_RFAI_Vs_Ms1_In_Days===data))

        console.log('qsccsqqsc',ageingFilter)

        // setNewData(Ms1Filter)
        ageingFilter.map((item)=>{
              if( item.Project=='Upgrade'){
                upgradeData++;

              }
              if(item.Project=='NEW_TOWER'){
                NEW_TOWERData++;
              }
              if(item.Project=='Relocation'){
                RelocationData++;
              }
              if(item.Project=='ULS'){
                UlsData++;
              }
        })

        setNts((prev) => [...prev, NEW_TOWERData])
        setRel((prev) => [...prev, RelocationData])
        setUls((prev) => [...prev, UlsData])
        setUpg((prev) => [...prev, upgradeData])
        console.warn('up:',upgradeData,'new:',NEW_TOWERData,'Rel:',RelocationData,'uls:',UlsData)
      })
  }
  // @@@@@@@@@@@@@ FILTER FOR CIRCLE WISE FUNCTION @@@@@@@@@@@@@@@@
  const testDataCircle=(data)=>{
    week.map((item1)=>{
      var upgradeData =0 ;
    var NEW_TOWERData = 0;
    var UlsData = 0;
    var RelocationData = 0;

      var filterWeek=overAllData.filter((item)=>(item.WEEK == item1))
      var filterCircle =filterWeek.filter((item)=>{
        return item.CIRCLE == data
      })
      if(ageingNo.length != 0){
        var Ms1Filter = filterCircle.filter((item)=>(item.MS1===null))
        var ageingFilter = Ms1Filter.filter((item)=>(item.Internal_RFAI_Vs_Ms1_In_Days===ageingNo))
      }
      if(ageingNo2.length != 0){
        var Ms1Filter = filterCircle.filter((item)=>(item.MAPA ===null))
        var ageingFilter = Ms1Filter.filter((item)=>(item.Internal_Ms1_Vs_Ms2_In_days===ageingNo2))
      }
      console.log('qsccsqqsc',ageingFilter)

      // setNewData(Ms1Filter)
      ageingFilter.map((item)=>{
            if( item.Project=='Upgrade'){
              upgradeData++;

            }
            if(item.Project=='NEW_TOWER'){
              NEW_TOWERData++;
            }
            if(item.Project=='Relocation'){
              RelocationData++;
            }
            if(item.Project=='ULS'){
              UlsData++;
            }
      })

      setNts((prev) => [...prev, NEW_TOWERData])
      setRel((prev) => [...prev, RelocationData])
      setUls((prev) => [...prev, UlsData])
      setUpg((prev) => [...prev, upgradeData])
      console.warn('up:',upgradeData,'new:',NEW_TOWERData,'Rel:',RelocationData,'uls:',UlsData)
    })
}
 // @@@@@@@@@@@@@ FILTER FOR MS2 AGEING FUNCTION @@@@@@@@@@@@@@@@
 const testDatams2=(data)=>{
  week.map((item1)=>{
    var upgradeData =0 ;
  var NEW_TOWERData = 0;
  var UlsData = 0;
  var RelocationData = 0;

    var filterWeek=overAllData.filter((item)=>(item.WEEK == item1))
    var filterCircle =filterWeek.filter((item)=>{
      return item.CIRCLE == selectCircle
    })
    var Ms1Filter = filterCircle.filter((item)=>(item.MAPA ===null))
    var ageingFilter = Ms1Filter.filter((item)=>(item.Internal_Ms1_Vs_Ms2_In_days===data))

    console.log('qsccsqqsc',ageingFilter)

    // setNewData(Ms1Filter)
    ageingFilter.map((item)=>{
          if( item.Project=='Upgrade'){
            upgradeData++;

          }
          if(item.Project=='NEW_TOWER'){
            NEW_TOWERData++;
          }
          if(item.Project=='Relocation'){
            RelocationData++;
          }
          if(item.Project=='ULS'){
            UlsData++;
          }
    })

    setNts((prev) => [...prev, NEW_TOWERData])
    setRel((prev) => [...prev, RelocationData])
    setUls((prev) => [...prev, UlsData])
    setUpg((prev) => [...prev, upgradeData])
    console.warn('up:',upgradeData,'new:',NEW_TOWERData,'Rel:',RelocationData,'uls:',UlsData)
  })
}



  const handleClose = () => {
    setOpen(false)
  }

  const handleChangeWeek = (event: SelectChangeEvent<typeof week>) => {
    const {
      target: { value },
    } = event;
    setWeek(
      typeof value === 'string' ? value.split(',') : value,
    );
  }


  const fetchWeeklyData = async () => {
    if (week.length > 0) {
      setLoadingBox(true)
      var formData = new FormData();
      formData.append("week_list", week)
      const response = await postData('WPR_DPR2/weeklyComparision/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
      console.log('qqqqqqq', response)
      if (response.status) {
        setLoadingBox(false)
        console.log('week data get', response.weeklwise_data)
        setOverAllData(response.weeklwise_data)
        // graphWeekData(response.weeklwise_data)
        setCircle(response.circle_list)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your data has been store',
          showConfirmButton: false,
          timer: 1500
        });
        graphWeekData();
        testDatams2('GT90')
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'dont get any data',
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "PLEASE SELECT ANNUAL WEEKS",
      });
    }

    //
    // setOverAllData(response.weeklwise_data)
    // weeksAgeingData(response.weeklwise_data)
    // graphWeekData(response.weeklwise_data)
  }

  const graphWeekData = () => {
    week?.map((item) => {
      setWeek_data((prev) => [...prev, 'week ' + item])
      console.warn('week', item)
    })
  }

  const weeksAgeingData = async (data) => {
    var arr = []
    Object.keys(overAllData)?.map((item) => {
      Object.keys(overAllData[item]).map((itm) => {
        if(itm == selectCircle){
          arr.push({ ...overAllData[item][itm], circle: itm, weeks: item });
        }
      })
    });
    arr.map((item, index) => {
      console.log("run", index)
      setNts((prev) => [...prev, item.NEW_TOWER[ageingNo]])
      setRel((prev) => [...prev, item.Relocation[ageingNo]])
      setUls((prev) => [...prev, item.ULS[ageingNo]])
      setUpg((prev) => [...prev, item.Upgrade[ageingNo]])
    })

  }

  const tempWeekData = (data) => {
    var arr = []
    Object.keys(overAllData)?.map((item) => {
      Object.keys(overAllData[item]).map((itm) => {
        if (itm == selectCircle) {
          arr.push({ ...overAllData[item][itm], circle: itm, weeks: item });
        }
      })
    });

    // var data2 = arr.filter((item)=>(item.circle == selectCircle))
    arr.map((item, index) => {
      console.log("run", index)
      setNts((prev) => [...prev, item.NEW_TOWER[ageingNo]])
      setRel((prev) => [...prev, item.Relocation[ageingNo]])
      setUls((prev) => [...prev, item.ULS[ageingNo]])
      setUpg((prev) => [...prev, item.Upgrade[ageingNo]])
    })
    console.table('cccccc', arr)
  }
  console.warn('yyyyyyyyy', nts, rel, uls, upg)

// ########### BAR GRAPH DATA FUNCTIONS #################
  const Bar_data = {
    labels: week_data,
    datasets: [{
      label: 'New Tower',
      data: nts,
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
      data: upg,
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



  // ********** ANNUAL WEEK  **************
  const annualWeek = () => {
    var arr = [];
    for (let i = 1; i <= 52; i++) {
      arr.push(i)
    }
    return arr?.map((item, index) => {
      return (
        <MenuItem key={index} value={item}>
          <Checkbox checked={week.indexOf(item) > -1} />
          <ListItemText primary={'week ' + item} />
        </MenuItem>
      )
    })
  }

  // DATA PROCESSING DIALOG BOX...............
  const loadingDialog = () => {
    return (
      <Dialog
        open={loadingBox}

        // TransitionComponent={Transition}
        keepMounted
      // aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
          <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
          <Box >DATA LOADING ....</Box>
        </DialogContent>

      </Dialog>
    )
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
                  <select value={week} onChange={(e) => { setWeek(e.target.value); }} style={{ height: '35px', width: '150px', fontSize: '18px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                    <option value="" disabled selected hidden>Annual Week</option>
                    {annualWeek()}
                  </select>
                </div>
              </Box>
            </Box>

          </Stack>
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#B0D9F3', display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='contained' color='secondary' endIcon={<DeleteOutlineIcon />}>clear</Button>
          <Button onClick={() => { }} variant='contained' color='success' endIcon={<PublishIcon />} >submit</Button>
          <Button onClick={handleClose} variant='contained' color='error' endIcon={<ClearIcon />}>cancel</Button>
        </DialogActions>

      </Dialog>
    )
  }

  //********* HANDLE CLEAR DATA ********* */
  const handleClear = () => {
    setNts([]);
    setRel([]);
    setUls([]);
    setUpg([]);
  }



  useEffect(() => {
    // weeksAgeingData()
    // fetchWeeklyData()
    // tempWeekData()
    // testData()
    // useEffect(()=>{
      document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
    // },[])
  }, [])

  return (
    <>
      <div style={{ margin: 20 }}>
      <div style={{ margin: 10, marginLeft: 1 }}>
            <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
              <Link underline="hover" href='/tools'>Tools</Link>
              <Link underline="hover" href='/tools/wpr'>WPR</Link>
              <Typography color='text.primary'>W.C.G</Typography>
            </Breadcrumbs>
          </div>
        {/*__________________ FILTER BOX _______________*/}
        <div style={{ height: 'auto', width: '100%', margin: '5px 0px', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', borderRadius: '10px', padding: '2px', display: 'flex' }}>
          <Grid container spacing={1}>
            <Grid item xs={10} style={{ display: "flex" }}>
              <Box >

                <Select
                  multiple
                  value={week}
                  onChange={handleChangeWeek}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em>Annual Weeks</em>;
                    }
                    return selected.join(', ');
                  }}
                  style={{ height: '35px', minWidth: '200px', fontSize: '18px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                  <MenuItem disabled value=""  ><em>Annual Week</em></MenuItem>
                  {annualWeek()}
                </Select>
              </Box>
              <Box>
                <Button variant="contained" size="small" onClick={() => { fetchWeeklyData(); setWeek_data([]); handleClear(); }}>Get data</Button>
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box style={{ float: 'right' }}>
                {/* <Tooltip title="Export Excel">
                  <IconButton >
                    <DownloadIcon fontSize='large' color='primary' />
                  </IconButton>
                </Tooltip> */}
              </Box>
            </Grid>
          </Grid>
        </div>
        <div style={{ marginTop: 25,width:'100%',display:'flex' }}>
          <div style={{ width: '20%' ,backgroundColor:'',display:'flex',flexDirection:'column',alignItems:'center',gap:'20px', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px',borderRadius:5}}>
            <div style={{display:'flex',alignItems:'center',fontSize:'20px',fontWeight:'bold',color:"black"}}><FilterAltIcon/>FILTER DATA</div>
            <div>
            <InputLabel>SELECT AGEING MS2</InputLabel>
                <Select value={ageingNo2} onChange={(e)=>{ setAgeingNo2(e.target.value); setAgeingNo('');handleClear();testDatams2(e.target.value) }} style={{ height: '35px', width: '200px', fontSize: '18px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                  {/* <option  disabled selected hidden>Select Ageing</option> */}
                  <MenuItem value={'0-15'} >MS2 (0-15)</MenuItem>
                  <MenuItem value={'16-30'}>MS2 (16-30)</MenuItem>
                  <MenuItem value={'31-60'}>MS2 (31-60)</MenuItem>
                  <MenuItem value={'61-90'}>MS2 (61-90)</MenuItem>
                  <MenuItem value={'GT90'}>MS2 (GT-90)</MenuItem>
                </Select>
            </div>
            <div>
            <InputLabel>SELECT AGEING MS1</InputLabel>
                <Select value={ageingNo} onChange={(e) => { setAgeingNo(e.target.value);setAgeingNo2('');handleClear(); testData(e.target.value) }} style={{ height: '35px', width: '200px', fontSize: '18px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                  {/* <option  disabled selected hidden>Select Ageing</option> */}
                  <MenuItem value={'0-15'} >MS1 (0-15)</MenuItem>
                  <MenuItem value={'16-30'}>MS1 (16-30)</MenuItem>
                  <MenuItem value={'31-60'}>MS1 (31-60)</MenuItem>
                  <MenuItem value={'61-90'}>MS1 (61-90)</MenuItem>
                  <MenuItem value={'GT90'}>MS1 (GT-90)</MenuItem>
                </Select>
            </div>
            <div>
            <InputLabel>SELECT CIRCLE</InputLabel>
              <Select value={selectCircle} displayEmpty onChange={(e) => { setSelectCircle(e.target.value);handleClear();testDataCircle(e.target.value) }} style={{ height: '35px', width: '200px', fontSize: '18px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                    <MenuItem disabled value="">Circle</MenuItem>
                    {circle?.map((item, index) => (
                      <MenuItem key={index} value={item}>{item}</MenuItem>
                    ))}
              </Select>
            </div>
          </div>
          <div style={{ width: '80%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', placeItems: 'center' }}>
              <div style={{ height: '400px', width: '80%' }}>
                <Bar
                  style={{ boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor:'',borderRadius:5 }}
                  data={Bar_data}
                  options={options}
                  plugins={[ChartDataLabels]}
                />
              </div>
            </div>
          </div>


          {/* <Filter circles={selectCircle} weeks={week} ageings={ageingNo}  nt={New_Tower_data} rel={Relocation_data} uls={ULS_data} up={Upgrade_data}/> */}
        </div>
        <div style={{marginTop:15}}>


        </div>
      </div>
      {loadingDialog()}


    </>

  )
}

export default WeeklyComparision