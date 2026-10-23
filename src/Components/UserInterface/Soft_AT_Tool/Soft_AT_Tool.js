import React from 'react'
import { useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { useStyles } from '../ToolsCss'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import Zoom from '@mui/material/Zoom';
import CodeIcon from '@rsuite/icons/Code';
import { getDecreyptedData } from '../../utils/localstorage'
import AlipayMiniIcon from '@rsuite/icons/AlipayMini';
import InfoRoundIcon from '@rsuite/icons/InfoRound';
import VerifyRoundIcon from '@rsuite/icons/VerifyRound';

const Soft_AT_Tool = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const navigate = useNavigate()
    const chackToken = getDecreyptedData("tokenKey")
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    const allowedEricssonRoles = ['soft_at_team', 'admin', 'soft_at', 'soft_at_ericsson'];
    const allowedViRoles = ['soft_at_team', 'admin', 'soft_at_vi'];
    const allowedNokiaRoles = ['soft_at_team', 'admin', 'soft_at', 'soft_at_nokia'];
    // const allowedAirtelReader = ['quality', 'IX_reader', 'quality-s']



    // console.log('ggggggggg', userTypes)
    const linker = window.location.pathname;


    const handleNokia = () => {
        if (chackToken == null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        }
        else {
            navigate('/tools/soft_at_tools/nokia_soft_at')
        }
    }
    const handleEricsson = () => {
        if (chackToken == null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        }
        else {
            navigate('/tools/soft_at_tools/ericsson_soft_at')
        }
    }

    const handleVI = () => {
        if (chackToken == null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        }
        else {
            navigate('/tools/soft_at_tools/vi_soft_at')
        }
    }

    const backgroundStyle = {
        height: "auto",
        width: "300px",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 3,
        boxShadow: "-10px -10px 15px rgba(255,255,255,0.4),10px 10px 15px rgba(70,70,70,0.15)",
        textShadow: '2px 2px 4px #ffffff',
        color: "#0f0f0f",
        // border:"1px solid black"
    }

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (
        <div style={{ backgroundColor: '' }}>

            <Box style={{ padding: "15px", marginTop: '60px' }}>
                <Box sx={{ display: "flex", justifyContent: 'center' }}>
                    <Box
                        sx={{
                            textAlign: "center",
                            padding: "10px 0px",
                            fontFamily: "sans-serif",
                            fontSize: "24px",
                            fontWeight: 600,
                            backgroundColor: "#006e74",
                            color: "#ffffff",
                            borderRadius: "20px",
                            width: "90%",
                            marginBottom: 2,
                            // border:'2px solid blue'
                        }}
                    >
                        Soft AT TOOLS
                    </Box></Box>
                <Zoom in='true' timeout={500}>

                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                        {/* <Box style={{ marginLeft: 70 , marginBottom:5 }}>
                            <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                                <Link underline="hover" onClick={()=>{ navigate('/tools')}}>Tools</Link>
                                <Typography color='text.primary'>Audit Tools</Typography>
                            </Breadcrumbs>
                        </Box> */}
                        <Box sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
                            <Grid container rowSpacing={2} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }} style={{}}>


                                {userTypes?.some(role => allowedNokiaRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && <Grid item xs={4}>
                                    <Box sx={backgroundStyle} className={classes.des} onClick={handleNokia}>
                                        {/* <div className={classes.centerIcon}>   <img src="/assets/Nokia.png" alt="Nokia" style={{ width: "60px", height: "60px",borderRadius:"15px",padding:"5px" }} /></div> */}
                                        <div className={classes.centerIcon}>  <VerifyRoundIcon
                                            alt="Traffic"
                                            style={{ width: "40px", height: "40px" }}
                                        />  </div>
                                        <div >
                                            <div className={classes.center} >Nokia Soft AT</div>
                                            {/* <div>This is a FDD tool</div> */}
                                        </div>
                                        {/* <span className={classes.center}>FILE MERGE</span> */}
                                    </Box>
                                </Grid>}

                                {userTypes?.some(role => allowedEricssonRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && <Grid item xs={4}>
                                    <Box sx={backgroundStyle} className={classes.des} onClick={handleEricsson}>
                                        {/* <div className={classes.centerIcon}>   <img src="/assets/Ericsson.jpg" alt="Ericsson" style={{ width: "60px", height: "60px",borderRadius:"15px",padding: "5px" }} /></div> */}
                                        <div className={classes.centerIcon}>  <AlipayMiniIcon
                                            alt="Traffic"
                                            style={{ width: "40px", height: "40px" }}
                                        />  </div>
                                        <div >
                                            <div className={classes.center} >Ericsson Soft AT</div>
                                            {/* <div>This is a FDD tool</div> */}
                                        </div>
                                        {/* <span className={classes.center}>FILE MERGE</span> */}
                                    </Box>
                                </Grid>}


                                {userTypes?.some(role => allowedViRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && <Grid item xs={4}>
                                    <Box sx={backgroundStyle} className={classes.des} onClick={handleVI}>
                                        {/* <div className={classes.centerIcon}>   <img src="/assets/VI.webp" alt="VI   " style={{ width: "60px", height: "60px" }} /></div> */}
                                        <div className={classes.centerIcon}>  <InfoRoundIcon
                                            alt="Traffic"
                                            style={{ width: "40px", height: "40px" }}
                                        />  </div>

                                        <div >
                                            <div className={classes.center} >VIL Soft AT</div>
                                            {/* <div>This is a FDD tool</div> */}
                                        </div>
                                        {/* <span className={classes.center}>FILE MERGE</span> */}
                                    </Box>
                                </Grid>}

                                {/* IX Airtel reader */}

                            </Grid>
                        </Box>
                    </Box>
                </Zoom>
            </Box>
        </div>
    )
}

export default Soft_AT_Tool

// import React, { useEffect } from 'react'
// import { Box } from '@mui/material'
// import { keyframes } from '@mui/system'
// import { useNavigate } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { getDecreyptedData } from '../../utils/localstorage'

// // Cards rise, scale up and fade in one after another
// const popIn = keyframes`
//     0%   { opacity: 0; transform: translateY(40px) scale(0.9); }
//     60%  { opacity: 1; transform: translateY(-6px) scale(1.02); }
//     100% { opacity: 1; transform: translateY(0) scale(1); }
// `

// // ---------- Config: add/remove cards here ----------
// const CARDS = [
//     {
//         key: 'nokia',
//         title: 'Nokia Soft AT',
//         path: '/tools/soft_at_tools/nokia_soft_at',
//         roles: ['soft_at_team', 'admin', 'soft_at', 'soft_at_nokia'],
//         logo: '/assets/NOKIA.png',
//         colors: { bg: '#ede9ff', border: '#7c4dff', text: '#3b17a8' },
//     },
//     {
//         key: 'ericsson',
//         title: 'Ericsson Soft AT',
//         path: '/tools/soft_at_tools/ericsson_soft_at',
//         roles: ['soft_at_team', 'admin', 'soft_at', 'soft_at_ericsson'],
//         logo: '/assets/Ericsson.jpg',
//         colors: { bg: '#e6f6ea', border: '#1f8a4c', text: '#0f5c33' },
//     },
//     {
//         key: 'vil',
//         title: 'VIL Soft AT',
//         path: '/tools/soft_at_tools/vi_soft_at',
//         roles: ['soft_at_team', 'admin', 'soft_at_vi'],
//         logo: '/assets/VI.webp',
//         colors: { bg: '#fff0e4', border: '#f57c1f', text: '#a2400b' },
//     },
// ]

// const Soft_AT_Tool = () => {
//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     const checkToken = getDecreyptedData('tokenKey')
//     const userTypes = getDecreyptedData('user_type')?.split(',')
//     const linker = window.location.pathname

//     const canSee = (roles) =>
//         userTypes?.some((u) => roles.map((r) => r.toLowerCase()).includes(u?.toLowerCase()))

//     const visible = CARDS.filter((c) => canSee(c.roles))

//     const handleOpen = (path) => {
//         if (checkToken == null) {
//             navigate('/login')
//             dispatch({ type: 'LINK_PAGES', payload: { linker } })
//         } else {
//             navigate(path)
//         }
//     }

//     useEffect(() => {
//         document.title = `${window.location.pathname
//             .slice(1)
//             .replaceAll('_', ' ')
//             .replaceAll('/', ' | ')
//             .toUpperCase()}`
//     }, [])

//     return (
//         <Box
//             sx={{
//                 px: 2,
//                 mt: '60px',
//                 minHeight: 'calc(100vh - 60px)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//             }}
//         >
//             <Box
//                 sx={{
//                     width: '100%',
//                     maxWidth: 1300,
//                     display: 'flex',
//                     flexDirection: { xs: 'column', md: 'row' },
//                     flexWrap: 'wrap',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: 4,
//                 }}
//             >
//                 {visible.map((item, i) => (
//                     <Box
//                         key={item.key}
//                         role="button"
//                         tabIndex={0}
//                         onClick={() => handleOpen(item.path)}
//                         onKeyDown={(e) => e.key === 'Enter' && handleOpen(item.path)}
//                         sx={{
//                             width: { xs: '100%', sm: 380 },
//                             minHeight: { xs: 220, md: 340 },
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             py: 4,
//                             px: 3,
//                             textAlign: 'center',
//                             cursor: 'pointer',
//                             borderRadius: '20px',
//                             border: `3px solid ${item.colors.border}`,
//                             backgroundColor: item.colors.bg,
//                             color: item.colors.text,
//                             animation: `${popIn} 0.7s cubic-bezier(0.22, 1, 0.36, 1) both`,
//                             animationDelay: `${i * 0.18}s`,
//                             transition: 'transform .2s ease, box-shadow .2s ease',
//                             '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
//                             '&:hover, &:focus-visible': {
//                                 transform: 'translateY(-3px)',
//                                 boxShadow: `0 8px 18px ${item.colors.border}44`,
//                                 outline: 'none',
//                             },
//                         }}
//                     >
//                         <img
//                             src={item.logo}
//                             alt={item.title}
//                             style={{ width: 110, height: 110, borderRadius: 18, objectFit: 'contain' }}
//                         />
//                         <Box sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 800, mt: 2.5 }}>{item.title}</Box>
//                     </Box>
//                 ))}
//             </Box>
//         </Box>
//     )
// }

// export default Soft_AT_Tool