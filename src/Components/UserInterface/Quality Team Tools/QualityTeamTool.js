import React from 'react'
import { useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { useStyles } from '../ToolsCss'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import Zoom from '@mui/material/Zoom';
import AlarmIcon from '@mui/icons-material/Alarm';
import CodeIcon from '@rsuite/icons/Code';
import { getDecreyptedData } from '../../utils/localstorage'
import TrendIcon from '@rsuite/icons/Trend';

const QualityTeamTool = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const navigate = useNavigate()
    const chackToken = getDecreyptedData("tokenKey")
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    // const allowedAirtelRoles = ['Admin', 'IX'];
   
    const allowedAlarmLogRoles = ['Admin',"QT",'QT_AL']
    const allowedTrendRoles = ['Admin', 'quality', 'admin', 'quality-s', 'trend_tool'];

    const linker = window.location.pathname;

    const handleAlarmLogs = () => {
        if (chackToken === null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        } else {
            navigate('/tools/quality_team/alarm_logs')
        }
    }

     const handleTrends = () => {
        if (chackToken === null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        } else {
            navigate('/tools/quality_team/trends')
        }
    }

    // const handleAirtel = () => {
    //     if (chackToken == null) {
    //         navigate('/login')
    //         dispatch({ type: 'LINK_PAGES', payload: { linker } })
    //     } else {
    //         navigate('/tools/Integration')
    //     }
    // }

    // const handleAirtelReader = () => {
    //     if (chackToken == null) {
    //         navigate('/login')
    //         dispatch({ type: 'LINK_PAGES', payload: { linker } })
    //     } else {
    //         navigate('/tools/IX_Tracker')
    //     }
    // }

    // const handleVi = () => {
    //     if (chackToken == null) {
    //         navigate('/login')
    //         dispatch({ type: 'LINK_PAGES', payload: { linker } })
    //     } else {
    //         navigate('/tools/ix_tools/vi_integration/')
    //     }
    // }

    // const handleSA = () => {
    //     if (chackToken === null) {
    //         navigate('/login')
    //         dispatch({ type: 'LINK_PAGES', payload: { linker } })
    //     } else {
    //         navigate('/tools/ix_tools/sa_slicing')
    //     }
    // }

    // const handleER = () => {
    //     if (chackToken === null) {
    //         navigate('/login')
    //         dispatch({ type: 'LINK_PAGES', payload: { linker } })
    //     } else {
    //         navigate('/tools/ix_tools/ix_ericsson')
    //     }
    // }

    const backgroundStyle = {
        height: "auto",
        width: "300px",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 3,
        boxShadow: "-10px -10px 15px rgba(255,255,255,0.4),10px 10px 15px rgba(70,70,70,0.15)",
        textShadow: '2px 2px 4px #ffffff',
        color: "#006e74",
    }

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    return (
        <div style={{ backgroundColor: " "}}>
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
                        }}
                    >
                        Quality Team TOOLS
                    </Box>
                </Box>

                <Zoom in='true' timeout={500}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                        <Box sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>

                            <Grid
                                container
                                rowSpacing={3}
                                columnSpacing={3}
                                direction={{ xs: "column", sm: "column", md: "row" }}
                                justifyContent="flex-start"
                            >

                                {/* Airtel Tracker (Admin/IX) */}
                                {/* {userTypes?.some(role => allowedAirtelRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && (
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={backgroundStyle} className={classes.des} onClick={handleAirtel}>
                                            <div className={classes.centerIcon}>
                                                <img src="/assets/AIRTEL.webp" alt="Airtel" style={{ width: "60px", height: "60px" }} />
                                            </div>
                                            <div>
                                                <div className={classes.center}>Airtel Tracker</div>
                                            </div>
                                        </Box>
                                    </Grid>
                                )} */}

                                {/* Airtel Tracker (Reader) */}
                                {/* {userTypes?.some(role => allowedAirtelReader.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && (
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={backgroundStyle} className={classes.des} onClick={handleAirtelReader}>
                                            <div className={classes.centerIcon}>
                                                <img src="/assets/AIRTEL.webp" alt="Airtel" style={{ width: "60px", height: "60px" }} />
                                            </div>
                                            <div>
                                                <div className={classes.center}>Airtel Tracker</div>
                                            </div>
                                        </Box>
                                    </Grid>
                                )} */}

                                {/* VI Tracker */}
                                {/* {userTypes?.some(role => allowedViRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && (
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={backgroundStyle} className={classes.des} onClick={handleVi}>
                                            <div className={classes.centerIcon}>
                                                <img src="/assets/VI.webp" alt="VI" style={{ width: "60px", height: "60px" }} />
                                            </div>
                                            <div>
                                                <div className={classes.center}>VI Tracker</div>
                                            </div>
                                        </Box>
                                    </Grid>
                                )} */}

                                {/* 5G GPL */}
                                {/* {userTypes?.some(role => allowedSaRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && (
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={backgroundStyle} className={classes.des} onClick={handleSA}>
                                            <div className={classes.centerIcon}>
                                                <CodeIcon alt="SA" style={{ width: "50px", height: "60px" }} />
                                            </div>
                                            <div>
                                                <div className={classes.center}>5G GPL</div>
                                            </div>
                                        </Box>
                                    </Grid>
                                )} */}

                                {/* Audit Ericsson */}
                                {/* {userTypes?.some(role => allowedErRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && (
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={backgroundStyle} className={classes.des} onClick={handleER}>
                                            <div className={classes.centerIcon}>
                                                <CodeIcon alt="ER" style={{ width: "50px", height: "60px" }} />
                                            </div>
                                            <div>
                                                <div className={classes.center}>Slicing Audit</div>
                                            </div>
                                        </Box>
                                    </Grid>
                                          )} */}

                                           {userTypes?.some(role => allowedAlarmLogRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && (
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={backgroundStyle} className={classes.des} onClick={handleAlarmLogs}>
                                            <div className={classes.centerIcon}>
                                                <AlarmIcon alt="ER" style={{ width: "50px", height: "60px" }} />
                                            </div>
                                            <div>
                                                <div className={classes.center}>Alarm Logs</div>
                                            </div>
                                        </Box>
                                    </Grid>
                                          )}
                                            {userTypes?.some(role => allowedTrendRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && (
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={backgroundStyle} className={classes.des} onClick={handleTrends}>
                                            <div className={classes.centerIcon}>
                                                <TrendIcon alt="Trends" style={{ width: "50px", height: "60px" }} />
                                            </div>
                                            <div>
                                                <div className={classes.center}>Trends</div>
                                            </div>
                                        </Box>
                                    </Grid>
                                          )}

                            </Grid>
                        </Box>
                    </Box>
                </Zoom>
            </Box>
        </div>
    )
}

export default QualityTeamTool