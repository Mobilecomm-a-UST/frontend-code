import React from 'react'
import {useEffect} from 'react'
import { Box, Grid } from '@mui/material'
import { useStyles } from '../ToolsCss'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import Zoom from '@mui/material/Zoom';
import DetailIcon from '@rsuite/icons/Detail';
import RateIcon from '@rsuite/icons/Rate';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const MDPTool = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const navigate = useNavigate()
    const chackToken = localStorage.getItem("tokenKey")

    console.log('ggggggggg', window.location.href)
    const linker = window.location.pathname;

    const handleUBR = () => {
        if (chackToken == null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        }
        else {
            navigate('/tools/mdp/ubr')
        }
    }
    const handleRAN = () => {
        if (chackToken == null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        }
        else {
            navigate('/tools/mdp/ran')
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
        color: '#223354',
        // border:"1px solid black"
    }

    useEffect(()=>{
        document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`

    },[])
    return (
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
                            marginBottom: 2,
                            // border:'2px solid blue'
                        }}
                    >
                        MDP TOOLS
                    </Box></Box>
                <Zoom in='true' timeout={500}>

                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                        <Box style={{ marginLeft: 70 , marginBottom:5 }}>
                            <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                                <Link underline="hover" onClick={()=>{ navigate('/tools')}}>Tools</Link>
                                {/* <Link underline="hover" href='/trends'>Trend</Link> */}
                                <Typography color='text.primary'>MDP Tools</Typography>
                            </Breadcrumbs>
                        </Box>
                        <Box sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
                            <Grid container rowSpacing={2} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }} style={{}}>

                                <Grid item xs={4}>
                                    <Box sx={backgroundStyle} className={classes.des} onClick={handleUBR}>
                                        <div className={classes.centerIcon}><RateIcon /></div>
                                        <div >
                                            <div className={classes.center}  > UBR</div>
                                            <div>This is a UBR tool</div>
                                        </div>
                                        {/* <span className={classes.center}>FILE MERGE</span> */}
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box sx={backgroundStyle} className={classes.des} onClick={handleRAN}>
                                        <div className={classes.centerIcon}><DetailIcon /></div>
                                        <div >
                                            <div className={classes.center}>RAN</div>
                                            <div>This is a RAN tool</div>
                                        </div>
                                        {/* <span className={classes.center}>SCHEDULER</span> */}
                                    </Box>
                                </Grid>

                            </Grid>
                        </Box>
                    </Box>
                </Zoom>
            </Box>
        </div>
    )
}

export default MDPTool