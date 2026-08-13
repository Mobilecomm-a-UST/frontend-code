// import React, { useEffect } from 'react'
// import { Box, Grid } from '@mui/material'
// import { useStyles } from './ToolsCss'
// import { useNavigate } from 'react-router-dom'
// import { useDispatch } from "react-redux";
// import Zoom from '@mui/material/Zoom';
// import PcIcon from '@rsuite/icons/Pc';
// import DocPassIcon from '@rsuite/icons/DocPass';
// import ToolData from '../UserBased/Data/ToolData'; 
// import { getDecreyptedData } from '../utils/localstorage';

// // import DocPassIcon from '@rsuite/icons/DocPass';

// const tempJson = [
//   { name: "TREND", read: true },
// ]


// export default function Tools() {
//   const dispatch = useDispatch()
//   const classes = useStyles()
//   const navigate = useNavigate()
//   const chackToken = getDecreyptedData("tokenKey")
//   const userType = (getDecreyptedData('user_type')?.split(","))

//   const linker = window.location.pathname;


//   const handleClickTool = (data) => {
//     if (chackToken == null) {
//       navigate('/login')
//       dispatch({ type: 'LINK_PAGES', payload: { linker } })
//     }
//     else {
//       navigate(data)
//     }

//   }

//   const backgroundStyle = {
//     height: "auto",
//     width: "305px",
//     // marginLeft: "auto",
//     // marginRight: "auto",
//     borderRadius: 2,
//     boxShadow: "-10px -10px 15px rgba(255,255,255,0.4),10px 10px 15px rgba(70,70,70,0.15)",
//     textShadow: '2px 2px 4px #ffffff',
//     color: '#223354',
//     // border:"1px solid black"
//   }

//   const checkUserType = ({ allowedUserTypes, propsdata }) => {
//     // const userMatch = userType.some(type => allowedUserTypes.includes(type));
//     // const commonUserTypes = userType.filter(type => allowedUserTypes.includes(type));
//     // const userMatch = commonUserTypes.length > 0;
//     // if (userMatch) {
//     return userType.some(type => allowedUserTypes.includes(type)) ? (
//       <Grid item xs={4} key={propsdata.id}>
//         <Box sx={backgroundStyle} className={classes.des} title={propsdata.fullname} onClick={() => { handleClickTool(propsdata.link) }}>
//           <div className={classes.centerIcon}><propsdata.icons /></div>
//           <div >
//             <div className={classes.center}>{propsdata.name}</div>
//           </div>
//         </Box>
//       </Grid>
//     ) : null



//   }

//   useEffect(() => {
//     document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
//   }, [])


//   return (
//     <>

//       <div >

//         <Box style={{ padding: "15px", marginTop: '60px' }}>
//           <Box sx={{ display: "flex", justifyContent: 'center' }}>
//             <Box
//               sx={{
//                 textAlign: "center",
//                 padding: "10px 0px",
//                 fontFamily: "sans-serif",
//                 fontSize: "25px",
//                 fontWeight: 600,
//                 // backgroundColor: "#223354",
//                 backgroundColor: "rgb(0, 110, 116)",
//                 color: "#ffffff",
//                 borderRadius: "20px",
//                 width: "90%",
//                 marginBottom: 2.5,
//                 // border:'2px solid blue'
//               }}
//             >
//               TOOLS
//             </Box></Box>
//           <Zoom in='true' timeout={500}>

//             <Box sx={{}}>
//               <Box sx={{ width: '90%', marginLeft: 'auto', marginRight: '1%' }}>

//                 <Grid container rowSpacing={2} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }} >
//                   {ToolData.map((item, index) => {
//                     const userMatch = userType?.some(type => item.groupBy.some(group => group.toLowerCase() === type.toLowerCase()));
//                     if (userMatch) {
//                       return (
//                         <Grid item xs={4} key={index}>
//                           <Box sx={backgroundStyle} className={classes.des} title={item.fullname} onClick={() => { handleClickTool(item.link) }}>
//                             <div className={classes.centerIcon}><item.icons /></div>
//                             <div >
//                               <div className={classes.center}>{item.name}</div>
//                               {/* <div>{item.title}</div> */}
//                             </div>
//                           </Box>
//                         </Grid>
//                       )
//                     }
//                     // checkUserType({ allowedUserTypes: item.groupBy, propsdata: item })
//                     // return (<checkUserType allowedUserTypes={item.groupBy} propsdata={item} />)
//                   })}
//                 </Grid>


//                 {/* {userType === 'Admin' && <Grid container rowSpacing={2} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }} >
//                   {ToolData?.map((item, index) => {
//                     return (
//                       <Grid item xs={4} key={index}>
//                         <Box sx={backgroundStyle} className={classes.des} onClick={() => { handleClickTool(item.link) }}>
//                           <div className={classes.centerIcon}><item.icons /></div>
//                           <div >
//                             <div className={classes.center}>{item.name}</div>
//                           </div>
//                         </Box>
//                       </Grid>
//                     )
//                   })}
//                 </Grid>} */}

//                 {/* {userType === 'Soft_At_Team' && <Grid container rowSpacing={2} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }} >
//                   <Grid item xs={4}>
//                     <Box sx={backgroundStyle} className={classes.des} onClick={() => { handleClickTool('/tools/soft_at') }}>
//                       <div className={classes.centerIcon}><PcIcon /></div>
//                       <div >
//                         <div className={classes.center}  >SOFT AT</div>
//                         <div>This is a SOFT AT tool</div>
//                       </div>
                    
//                     </Box>
//                   </Grid>

//                   <Grid item xs={4}>
//                     <Box sx={backgroundStyle} className={classes.des} onClick={() => { handleClickTool('/tools/soft_at_rejection') }}>
//                       <div className={classes.centerIcon}><PcIcon /></div>
//                       <div >
//                         <div className={classes.center}  >SOFT AT Tracking</div>
                   
//                       </div>
                      
//                     </Box>
//                   </Grid>
//                 </Grid>} */}

//                 {/* {userType === 'IX' && <Grid container rowSpacing={2} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }} >
//                   <Grid item xs={4}>
//                     <Box sx={backgroundStyle} className={classes.des} onClick={() => { handleClickTool('/tools/Integration') }}>
//                       <div className={classes.centerIcon}><DocPassIcon /></div>
//                       <div >
//                         <div className={classes.center}>IX Tracker</div>
//                         <div>This is a IX Tracker Tool</div>
//                       </div>
//                     </Box>
//                   </Grid>

//                 </Grid>} */}

//                 {/* {userType === 'Quality' && <Grid container rowSpacing={2} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }} >
//                   <Grid item xs={4}>
//                     <Box sx={backgroundStyle} className={classes.des} onClick={() => { handleClickTool('/tools/audit') }}>
//                       <div className={classes.centerIcon}><DocPassIcon /></div>
//                       <div >
//                         <div className={classes.center}>Audit</div>

//                       </div>
//                     </Box>
//                   </Grid>

//                 </Grid>} */}

//               </Box>
//             </Box>
//           </Zoom>
//         </Box>
//       </div>
//     </>


//   )
// }



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

// Independence Day corner ribbon toggle — flip to false once the season is over
const SHOW_INDEPENDENCE_DAY_RIBBON = true;

const IndependenceDayRibbon = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1200,
        width: 64,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'default',
        '@keyframes idWave': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-6deg)' },
          '75%': { transform: 'rotate(6deg)' },
        },
        '@keyframes idFloat': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      }}
      title="Happy Independence Day!"
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'idFloat 3s ease-in-out infinite',
        }}
      >
        <svg width="46" height="46" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Flag pole */}
          <line x1="30" y1="10" x2="30" y2="90" stroke="#6b4226" strokeWidth="3" />
          {/* Waving flag */}
          <g style={{ transformOrigin: '30px 20px', animation: 'idWave 2.2s ease-in-out infinite' }}>
            <path d="M30 15 C55 8, 70 20, 88 15 L88 30 C70 35, 55 23, 30 30 Z" fill="#FF9933" />
            <path d="M30 30 C55 23, 70 35, 88 30 L88 45 C70 50, 55 38, 30 45 Z" fill="#FFFFFF" />
            <path d="M30 45 C55 38, 70 50, 88 45 L88 60 C70 65, 55 53, 30 60 Z" fill="#138808" />
            <circle cx="59" cy="37.5" r="5" fill="none" stroke="#000080" strokeWidth="1.2" />
            <circle cx="59" cy="37.5" r="1" fill="#000080" />
          </g>
        </svg>
      </Box>
    </Box>
  );
};


export default function Tools() {
  const dispatch = useDispatch()
  const classes = useStyles()
  const navigate = useNavigate()
  const chackToken = getDecreyptedData("tokenKey")
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
        <Box sx={backgroundStyle} className={classes.des} title={propsdata.fullname} onClick={() => { handleClickTool(propsdata.link) }}>
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

      <div >

        <Box style={{ padding: "15px", marginTop: '60px' }}>
          <Box sx={{ display: "flex", justifyContent: 'center' }}>
            <Box
              sx={{
                textAlign: "center",
                padding: "10px 0px",
                fontFamily: "sans-serif",
                fontSize: "25px",
                fontWeight: 600,
                // backgroundColor: "#223354",
                backgroundColor: "rgb(0, 110, 116)",
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
                          <Box sx={backgroundStyle} className={classes.des} title={item.fullname} onClick={() => { handleClickTool(item.link) }}>
                            <div className={classes.centerIcon}><item.icons /></div>
                            <div >
                              <div className={classes.center}>{item.name}</div>
                              {/* <div>{item.title}</div> */}
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

      {SHOW_INDEPENDENCE_DAY_RIBBON && <IndependenceDayRibbon />}
    </>


  )
}