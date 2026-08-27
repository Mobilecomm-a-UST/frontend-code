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
import { HugeiconsIcon } from "@hugeicons/react";
import { FileScriptIcon } from "@hugeicons/core-free-icons";
import { DashboardCircleEditIcon } from "@hugeicons/core-free-icons";
import TrafficOutlinedIcon from '@mui/icons-material/TrafficOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';

const QualityTeamTool = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const navigate = useNavigate()
    const chackToken = getDecreyptedData("tokenKey")
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    // const allowedAirtelRoles = ['Admin', 'IX'];
   
    const allowedAlarmLogRoles = ['Admin', 'QT_AL']
    const allowedTrendRoles = ['Admin','quality','quality-s', 'trend_tool'];
    const allowedPerformanceRoles = ['Admin','PAT','PAT_Admin'];
    const allowedTrafficRoles = ['Admin', 'PTS', 'PTS_Admin'];
    const allowedPendingPerformanceRemark = ['Admin','QT_PPR']

    const linker = window.location.pathname;

   

     const handleTrends = () => {
        if (chackToken === null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        } else {
            navigate('/tools/quality_team/trends')
        }
    }

    const handlePerformance = () => {
        if (chackToken === null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        } else {
            navigate('/tools/quality_team/performance_at_tat')
        }
    }

    const handleTraffic = () => {
        if (chackToken === null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        } else {
            navigate('/tools/quality_team/payload_traffic')
        }
    }

     const handleAlarmLogs = () => {
        if (chackToken === null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        } else {
            navigate('/tools/quality_team/alarm_logs')
        }
    }

    const handlePendingPerformanceRemark = ()=>{
        if (chackToken === null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        } else {
            navigate('/tools/quality_team/pending_performance_re')
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
        color: "#292525",
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
                        Quality Team Tools
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

                               
                                          
                                            {userTypes?.some(role => allowedTrendRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && (
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={backgroundStyle} className={classes.des} onClick={handleTrends}>
                                            <div className={classes.centerIcon}>
                                                <TrendIcon alt="Trends" style={{ width: "40px", height: "40px" }} />
                                            </div>
                                            <div>
                                                <div className={classes.center}>Trends</div>
                                            </div>
                                        </Box>
                                    </Grid>
                                          )}

                                          {userTypes?.some(role => allowedPerformanceRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && (
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={backgroundStyle} className={classes.des} onClick={handlePerformance}>
                                            <div className={classes.centerIcon}>
                                                <HugeiconsIcon icon={DashboardCircleEditIcon} alt="Performance" style={{ width: "40px", height: "40px" }} />
                                            </div>
                                            <div>
                                                <div className={classes.center}>Performance At</div>
                                            </div>
                                        </Box>
                                    </Grid>
                                          )}

                                        {userTypes?.some(role => allowedTrafficRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && (
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={backgroundStyle} className={classes.des} onClick={handleTraffic}>
                                            <div className={classes.centerIcon}>
                                                <TrafficOutlinedIcon alt="Traffic" style={{ width: "40px", height: "40px" }} />
                                            </div>
                                            <div>
                                                <div className={classes.center}>Payload Traffic</div>
                                            </div>
                                        </Box>
                                    </Grid>
                                          )}
                                           {userTypes?.some(role => allowedAlarmLogRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && (
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={backgroundStyle} className={classes.des} onClick={handleAlarmLogs}>
                                            <div className={classes.centerIcon}>
                                                <AlarmIcon alt="Alarm" style={{ width: "40px", height: "40px" }} />
                                            </div>
                                            <div>
                                                <div className={classes.center}>Alarm Logs</div>
                                            </div>
                                        </Box>
                                    </Grid>
                                          )}

                                          {/* {userTypes?.some(role => allowedPendingPerformanceRemark.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && (
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={backgroundStyle} className={classes.des} onClick={handlePendingPerformanceRemark}>
                                            <div className={classes.centerIcon}>
                                                <PendingActionsOutlinedIcon alt="Pending" style={{ width: "40px", height: "40px" }} />
                                            </div>
                                            <div>
                                                <div className={classes.center}>Pending PR</div>
                                            </div>
                                        </Box>
                                    </Grid>
                                          )} */}

                            </Grid>
                        </Box>
                    </Box>
                </Zoom>
            </Box>
        </div>
    )
}

export default QualityTeamTool