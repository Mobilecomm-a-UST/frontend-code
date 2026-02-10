import React from 'react'
import { useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { useStyles } from '../ToolsCss'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import Zoom from '@mui/material/Zoom';
import CodeIcon from '@rsuite/icons/Code';
import { getDecreyptedData } from '../../utils/localstorage'

const Ix_Tools = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const navigate = useNavigate()
    const chackToken = getDecreyptedData("tokenKey")
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    const allowedAirtelRoles = ['Admin', 'IX', 'soft_at_team'];
    const allowedAirtelReader = ['quality', 'IX_reader', 'quality-s']
    const allowedViRoles = ['Admin', 'VI_IX', 'VI_IX_reader', 'soft_at_team'];
    const allowedSaRoles = ['Admin', 'IX_SA']


    // console.log('ggggggggg', userTypes)
    const linker = window.location.pathname;


    const handleAirtel = () => {
        if (chackToken == null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        }
        else {
            navigate('/tools/Integration')
        }
    }
    const handleAirtelReader = () => {
        if (chackToken == null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        }
        else {
            navigate('/tools/IX_Tracker')
        }
    }
    const handleVi = () => {
        if (chackToken == null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        }
        else {
            navigate('/tools/ix_tools/vi_integration/')
        }
    }

    const handleSA = () => {
        if (chackToken === null) {
            navigate('/login')
            dispatch({ type: 'LINK_PAGES', payload: { linker } })
        } else {
            navigate('/tools/ix_tools/sa_slicing')
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

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (
        <div style={{ backgroundColor: '#FBEEE6' }}>

            <Box style={{ padding: "15px", marginTop: '60px' }}>
                <Box sx={{ display: "flex", justifyContent: 'center' }}>
                    <Box
                        sx={{
                            textAlign: "center",
                            padding: "10px 0px",
                            fontFamily: "sans-serif",
                            fontSize: "24px",
                            fontWeight: 600,
                            backgroundColor: "#223354",
                            color: "#ffffff",
                            borderRadius: "20px",
                            width: "90%",
                            marginBottom: 2,
                            // border:'2px solid blue'
                        }}
                    >
                        INTEGRATION TRACKER TOOLS
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
                                {userTypes?.some(role => allowedAirtelRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && <Grid item xs={4}>
                                    <Box sx={backgroundStyle} className={classes.des} onClick={handleAirtel}>
                                        <div className={classes.centerIcon}>   <img src="/assets/AIRTEL.webp" alt="Airtel" style={{ width: "60px", height: "60px" }} /></div>
                                        <div >
                                            <div className={classes.center} >Airtel Tracker</div>
                                            {/* <div>This is a FDD tool</div> */}
                                        </div>
                                        {/* <span className={classes.center}>FILE MERGE</span> */}
                                    </Box>
                                </Grid>}

                                {/* IX Airtel reader */}
                                {userTypes?.some(role => allowedAirtelReader.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && <Grid item xs={4}>
                                    <Box sx={backgroundStyle} className={classes.des} onClick={handleAirtelReader}>
                                        <div className={classes.centerIcon}>   <img src="/assets/AIRTEL.webp" alt="Airtel" style={{ width: "60px", height: "60px" }} /></div>
                                        <div >
                                            <div className={classes.center} >Airtel Tracker</div>
                                            {/* <div>This is a FDD tool</div> */}
                                        </div>
                                        {/* <span className={classes.center}>FILE MERGE</span> */}
                                    </Box>
                                </Grid>}


                                {userTypes?.some(role => allowedViRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && <Grid item xs={4}>
                                    <Box sx={backgroundStyle} className={classes.des} onClick={handleVi}>
                                        <div className={classes.centerIcon}> <img src="/assets/VI.webp" alt="VI" style={{ width: "60px", height: "60px" }} /></div>
                                        <div >
                                            <div className={classes.center}>VI Tracker</div>
                                            {/* <div>This is a TDD tool</div> */}
                                        </div>
                                        {/* <span className={classes.center}>SCHEDULER</span> */}
                                    </Box>
                                </Grid>}

                                {userTypes?.some(role => allowedSaRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) && <Grid item xs={4}>
                                    <Box sx={backgroundStyle} className={classes.des} onClick={handleSA}>
                                        <div className={classes.centerIcon}>
                                            {/* <img src="/assets/VI.webp" alt="VI" style={{ width: "60px", height: "60px" }} /> */}
                                            <CodeIcon alt="SA" style={{ width: "50px", height: "60px" }} />
                                        </div>
                                        <div >
                                            <div className={classes.center}>SA Slicing</div>
                                            {/* <div>This is a TDD tool</div> */}
                                        </div>
                                        {/* <span className={classes.center}>SCHEDULER</span> */}
                                    </Box>
                                </Grid>}

                            </Grid>
                        </Box>
                    </Box>
                </Zoom>
            </Box>
        </div>
    )
}

export default Ix_Tools