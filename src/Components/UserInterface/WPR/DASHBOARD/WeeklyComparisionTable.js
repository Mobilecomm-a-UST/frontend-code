import React, { useEffect, useState } from 'react'
import { postData } from '../../../services/FetchNodeServices'
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { Box, Grid, Button } from "@mui/material";
import Swal from "sweetalert2";
import { useStyles } from './../../ToolsCss';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';



const WeeklyComparisionTable = () => {
    const [week,setWeek] =  useState([])
    const [ageing,setAgeing]  = useState(['0-15'])
    const [ageingData , setAgeingData] = useState()
    const [ageingMS , setAgeingMS] = useState('MS1')
    const [show,setShow] = useState(false)
    const [circle , setCircle] = useState([]);
    const [circleData , setCircleData] = useState([])
    const [project,setProject] = useState([])
    const [projectData,setProjectData] = useState([])
    const classes = useStyles();


    console.log('aaaaaa',week.length)




// ########## FETCH DATA FROM API #################
    const fetchWeeklyData = async () => {
        if ( ageing.length > 0 && ageingMS.length > 0) {

          var formData = new FormData();
          formData.append("week_list", week)
          formData.append("Ageing", ageing)
          formData.append("MS1_MS2", ageingMS)
          const response = await postData('WPR_DPR2/weeklyComparision/dashboard/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
          console.log('qqqqqqq',JSON.parse(response.data) )

          var data =   (JSON.parse(response.data))
          data.sort((a,b)=>(a.CIRCLE > b.CIRCLE) ? 1 :-1)
          console.log('dataaaaa', data)
          if(data.length > 0){
            setShow(true)
            setWeek(response.week_cols)
            setAgeingData(data)
            getCircle(data)
            getProject(data)
          }
          else(
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `DATA NOT FOUND IN THIS WEEKS ${week}`,
            })
          )

        }
        else {
            if(week.length == 1){
                alert('PLEASE SELECT MINIMUM TWO ANNUAL WEEKS')
            }
            if(week.length == 0){
                 Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "PLEASE SELECT ANNUAL WEEKS",
                });
            }
            else if(ageingMS.length == 0){
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "PLEASE SELECT AGEING",
                });
            }
            else if(ageing.length == 0){
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "PLEASE SELECT AGEING NO.",
                });
            }

        }

      }

    // ####### GET CIRCLE  ##########
    const getCircle=(data)=>{
      var arr=[];
      data.map((item)=>{
         arr.push(item.CIRCLE)
      })
      var unique = arr.filter((value, index, array) => array.indexOf(value) === index);
      // console.log('circle',unique)
      setCircleData(unique)
    }


    // ######## GET PROJECT ARRAY FOR SELECT TABLE  ##########
    const getProject=(data)=>{
      var arr=[];
      data.map((item)=>{
         arr.push(item.Project)
      })
      var unique = arr.filter((value, index, array) => array.indexOf(value) === index);
      // console.log('circle',unique)
      setProjectData(unique)
    }

    //   ######## TABLE DATA FUNCTION #######
    const tableData=(values)=>{
      var arr=[];
      if(circle.length > 0 && project.length > 0 ){
        circle?.map((items)=>{
          project?.map((its)=>{
            arr.push(ageingData?.filter((item)=>(item.CIRCLE == items  && item.Project == its)))
          })
        })
      }

      else if(circle.length > 0){
        circle?.map((items)=>{
          arr.push(ageingData?.filter((item)=>(item.CIRCLE == items)))

        })
      }
      else if(project.length > 0){
        project?.map((items)=>{
          // var data = ageingData?.filter((item)=>(item.Project == project));
         arr.push(ageingData?.filter((item)=>(item.Project == items)))
        })

      }
      else{
        // var data = ageingData;

        return ageingData?.map((item)=>{
          return(
              <tr  className={classes.hover} style={{ textAlign: "center", fontWeigth:700,color:'black' }}>
                  <td>{item.CIRCLE}</td>
                  <td>{item.Project}</td>
                  {week.map((its)=>(
                      <td>{item[its]}</td>
                  ))}
              </tr>
          )
      })


      }


     return arr?.map((x)=>{
        return x?.map((item)=>{
          return(
              <tr  className={classes.hover} style={{ textAlign: "center", fontWeigth:700,color:'black' }}>
                  <td>{item.CIRCLE}</td>
                  <td>{item.Project}</td>
                  {week.map((its)=>(
                      <td>{item[its]}</td>
                  ))}
              </tr>
          )
      })
    })

    }


    // ########### HANDLE AGEING NO #############
    const handleAgeingNo=(event: SelectChangeEvent<typeof ageing>)=>{
      setShow(false)
      const {
        target: { value },
      } = event;
      setAgeing(
        typeof value === 'string' ? value.split(',') : value,
      );
    }
    const handleChangeWeek = (event: SelectChangeEvent<typeof week>) => {
      setShow(false)
        const {
          target: { value },
        } = event;
        setWeek(
          typeof value === 'string' ? value.split(',') : value,
        );
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


      // ########### Handle CIRCLE table filter  ###########
      const handleCircle=(event: SelectChangeEvent<typeof circle>)=>{
        const {
          target: { value },
        } = event;
        setCircle(
          typeof value === 'string' ? value.split(',') : value,
        );
      }


      // ####### HANDLE Project table filter ########
      const handleProject=(event: SelectChangeEvent<typeof project>)=>{
        const {
          target: { value },
        } = event;
        setProject(
          typeof value === 'string' ? value.split(',') : value,
        );
      }

        useEffect(()=>{
          fetchWeeklyData();

          // useEffect(()=>{
            document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
          // },[])

        },[])
  return (
    <>
    <style>{"th,td{border:1px solid black;}"}</style>
    <div style={{margin:20}}>
    <div style={{ margin: 10, marginLeft: 1 }}>
            <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
              <Link underline="hover" href='/tools'>Tools</Link>
              <Link underline="hover" href='/tools/wpr'>WPR</Link>
              <Typography color='text.primary'>W.C.T</Typography>
            </Breadcrumbs>
          </div>
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
                <Select
                value={ageingMS}
                displayEmpty
                onChange={(e)=>{setAgeingMS(e.target.value);setShow(false)}}
                style={{ height: '35px', minWidth: '100px', fontSize: '18px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                    <MenuItem disabled value=""  ><em>Select Ageing</em></MenuItem>
                    <MenuItem value={'MS1'} >MS1</MenuItem>
                    <MenuItem value={'MS2'}> MS2</MenuItem>

                </Select>
              </Box>
              <Box>
                <Select
                multiple
                value={ageing}
                displayEmpty
                onChange={handleAgeingNo}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <em>Select Ageing No.</em>;
                  }
                  return selected.join(', ');
                }}
                style={{ height: '35px', minWidth: '200px', fontSize: '18px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                    <MenuItem disabled value=""  ><em>Select Ageing No.</em></MenuItem>
                    <MenuItem value={'0-15'} >(0-15)</MenuItem>
                    <MenuItem value={'16-30'}> (16-30)</MenuItem>
                    <MenuItem value={'31-60'}> (31-60)</MenuItem>
                    <MenuItem value={'61-90'}> (61-90)</MenuItem>
                    <MenuItem value={'GT90'}>(GT-90)</MenuItem>
                </Select>
              </Box>
              <Box>
                <Button variant="contained" size="small" onClick={() => { fetchWeeklyData();setCircle([]) }}>Get data</Button>
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
        <div>
            <div style={{display:show?'inherit':'none'}}>

                <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse',backgroundColor:'white' }}>
                    <thead>
                        <tr>
                        <th colSpan="19" style={{ fontSize: 20, color: "black", backgroundColor: '#F1948A' }}>Weekly Comparision Table</th>
                        </tr>
                        <tr style={{ fontSize: 16, backgroundColor: "#223354", color: "white", }}>
                        <th>CIRCLE

                          <Select
                           multiple={true}
                           value={circle}
                           displayEmpty
                          //  onChange={(e)=>{setCircle(e.target.value);tableData(e.target.value)}}
                          onChange={handleCircle}
                          renderValue={(selected) => {
                            if (selected.length === 0) {
                              return <em>All</em>;
                            }
                            // return selected.join(', ');
                          }}
                            style={{float:'right',color:'black',border:'1px solid black',height:'25px',backgroundColor:'white'}}  >
                            <MenuItem onClick={()=>{setCircle([])}} >All</MenuItem>
                          {circleData.map((item,index)=>(
                             <MenuItem key={index} value={item}>
                                   <Checkbox size='small' checked={circle.indexOf(item) > -1} />
                                    <ListItemText primary={item} />
                              </MenuItem>
                          ))}
                          </Select>
                          </th>
                        <th>PROJECT

                          <Select
                          multiple
                          value={project}
                          // onChange={(e)=>{setProject(e.target.value);tableData()}}
                          onChange={handleProject}
                          displayEmpty
                          renderValue={(selected) => {
                            if (selected.length === 0) {
                              return <em>All</em>;
                            }
                            // return selected.join(', ');
                          }}
                          style={{float:'right',color:'black',border:'1px solid black',height:'25px',backgroundColor:'white'}}>
                            <MenuItem onClick={()=>{setProject([])}}  >All</MenuItem>
                            {projectData.map((item,index)=>(
                              <MenuItem key={index} value={item}>
                                 <Checkbox size='small' checked={project.indexOf(item) > -1} />
                                 <ListItemText primary={item} />
                              </MenuItem>
                            ))}

                          </Select>
                        </th>
                        {week.map((item)=>(
                            <th>Week {item}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                            {tableData()}
                    </tbody>
                </table>
            </div>
        </div>

    </div>
    </>
  )
}

export default WeeklyComparisionTable