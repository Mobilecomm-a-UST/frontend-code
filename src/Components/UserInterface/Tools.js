import React, { useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { useStyles } from './ToolsCss'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import Zoom from '@mui/material/Zoom';
import PcIcon from '@rsuite/icons/Pc';
import DocPassIcon from '@rsuite/icons/DocPass';
import ToolData from '../UserBased/Data/ToolData'; 
import { getDecreyptedData } from '../utils/localstorage';

// import DocPassIcon from '@rsuite/icons/DocPass';

const tempJson = [
  { name: "TREND", read: true },
]


export default function Tools() {
  const dispatch = useDispatch()
  const classes = useStyles()
  const navigate = useNavigate()
  const chackToken = getDecreyptedData("tokenKey")

  //  navigator.geolocation.getCurrentPosition((item)=>{
  //    console.log('ggggggggg', window.location.href ,item.coords  )
  //   })

  // const userType = JSON.parse(localStorage.getItem('user_type'))
  const userType = (getDecreyptedData('user_type')?.split(","))

  const linker = window.location.pathname;


  const handleClickTool = (data) => {
    if (chackToken == null) {
      navigate('/login')
      dispatch({ type: 'LINK_PAGES', payload: { linker } })
    }
    else {
      navigate(data)
    }

  }

  const backgroundStyle = {
    height: "auto",
    width: "305px",
    // marginLeft: "auto",
    // marginRight: "auto",
    borderRadius: 2,
    boxShadow: "-10px -10px 15px rgba(255,255,255,0.4),10px 10px 15px rgba(70,70,70,0.15)",
    textShadow: '2px 2px 4px #ffffff',
    color: '#223354',
    // border:"1px solid black"
  }

  const checkUserType = ({ allowedUserTypes, propsdata }) => {
    // const userMatch = userType.some(type => allowedUserTypes.includes(type));
    // const commonUserTypes = userType.filter(type => allowedUserTypes.includes(type));
    // const userMatch = commonUserTypes.length > 0;
    // if (userMatch) {
    return userType.some(type => allowedUserTypes.includes(type)) ? (
      <Grid item xs={4} key={propsdata.id}>
        <Box sx={backgroundStyle} className={classes.des} onClick={() => { handleClickTool(propsdata.link) }}>
          <div className={classes.centerIcon}><propsdata.icons /></div>
          <div >
            <div className={classes.center}>{propsdata.name}</div>
          </div>
        </Box>
      </Grid>
    ) : null



  }

  useEffect(() => {
    document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
  }, [])


  return (
    <>

      <div style={{ backgroundColor: '#FBEEE6' }}>

        <Box style={{ padding: "15px", marginTop: '60px' }}>
          <Box sx={{ display: "flex", justifyContent: 'center' }}>
            <Box
              sx={{
                textAlign: "center",
                padding: "10px 0px",
                fontFamily: "sans-serif",
                fontSize: "25px",
                fontWeight: 600,
                backgroundColor: "#223354",
                color: "#ffffff",
                borderRadius: "20px",
                width: "90%",
                marginBottom: 2.5,
                // border:'2px solid blue'
              }}
            >
              TOOLS
            </Box></Box>
          <Zoom in='true' timeout={500}>

            <Box sx={{}}>
              <Box sx={{ width: '90%', marginLeft: 'auto', marginRight: '1%' }}>

                <Grid container rowSpacing={2} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }} >
                  {ToolData.map((item, index) => {
                    const userMatch = userType?.some(type => item.groupBy.some(group => group.toLowerCase() === type.toLowerCase()));
                    if (userMatch) {
                      return (
                        <Grid item xs={4} key={index}>
                          <Box sx={backgroundStyle} className={classes.des} onClick={() => { handleClickTool(item.link) }}>
                            <div className={classes.centerIcon}><item.icons /></div>
                            <div >
                              <div className={classes.center}>{item.name}</div>
                            </div>
                          </Box>
                        </Grid>
                      )
                    }
                    // checkUserType({ allowedUserTypes: item.groupBy, propsdata: item })
                    // return (<checkUserType allowedUserTypes={item.groupBy} propsdata={item} />)
                  })}
                </Grid>


                {/* {userType === 'Admin' && <Grid container rowSpacing={2} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }} >
                  {ToolData?.map((item, index) => {
                    return (
                      <Grid item xs={4} key={index}>
                        <Box sx={backgroundStyle} className={classes.des} onClick={() => { handleClickTool(item.link) }}>
                          <div className={classes.centerIcon}><item.icons /></div>
                          <div >
                            <div className={classes.center}>{item.name}</div>
                          </div>
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>} */}

                {/* {userType === 'Soft_At_Team' && <Grid container rowSpacing={2} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }} >
                  <Grid item xs={4}>
                    <Box sx={backgroundStyle} className={classes.des} onClick={() => { handleClickTool('/tools/soft_at') }}>
                      <div className={classes.centerIcon}><PcIcon /></div>
                      <div >
                        <div className={classes.center}  >SOFT AT</div>
                        <div>This is a SOFT AT tool</div>
                      </div>
                    
                    </Box>
                  </Grid>

                  <Grid item xs={4}>
                    <Box sx={backgroundStyle} className={classes.des} onClick={() => { handleClickTool('/tools/soft_at_rejection') }}>
                      <div className={classes.centerIcon}><PcIcon /></div>
                      <div >
                        <div className={classes.center}  >SOFT AT Tracking</div>
                   
                      </div>
                      
                    </Box>
                  </Grid>
                </Grid>} */}

                {/* {userType === 'IX' && <Grid container rowSpacing={2} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }} >
                  <Grid item xs={4}>
                    <Box sx={backgroundStyle} className={classes.des} onClick={() => { handleClickTool('/tools/Integration') }}>
                      <div className={classes.centerIcon}><DocPassIcon /></div>
                      <div >
                        <div className={classes.center}>IX Tracker</div>
                        <div>This is a IX Tracker Tool</div>
                      </div>
                    </Box>
                  </Grid>

                </Grid>} */}

                {/* {userType === 'Quality' && <Grid container rowSpacing={2} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }} >
                  <Grid item xs={4}>
                    <Box sx={backgroundStyle} className={classes.des} onClick={() => { handleClickTool('/tools/audit') }}>
                      <div className={classes.centerIcon}><DocPassIcon /></div>
                      <div >
                        <div className={classes.center}>Audit</div>

                      </div>
                    </Box>
                  </Grid>

                </Grid>} */}

              </Box>
            </Box>
          </Zoom>
        </Box>
      </div>
    </>


  )
}
