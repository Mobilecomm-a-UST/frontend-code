import React from 'react'

import{useEffect}from 'react'
import { Box, Grid } from '@mui/material'
import { useStyles } from '../ToolsCss'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import Zoom from '@mui/material/Zoom';
import SingleSourceIcon from '@rsuite/icons/SingleSource';
import TimeIcon from '@rsuite/icons/Time';
import BlockIcon from '@rsuite/icons/Block';
import CombinationIcon from '@rsuite/icons/Combination';
import RelatedMapIcon from '@rsuite/icons/RelatedMap';
import OperatePeopleIcon from '@rsuite/icons/OperatePeople';


const Others = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const navigate = useNavigate()
    const chackToken = localStorage.getItem("tokenKey")

    // console.log('ggggggggg', window.location.href)
    const linker = window.location.pathname;

    const handleFileMerge = () => {
      if (chackToken == null) {
        navigate('/login')
        dispatch({ type: 'LINK_PAGES', payload: { linker } })
      }
      else {
        navigate('/tools/others/file_merge')
      }
    }
    const handleSchedular = () => {
      if (chackToken == null) {
        navigate('/login')
        dispatch({ type: 'LINK_PAGES', payload: { linker } })
      }
      else {
        navigate('/tools/others/schedular')
      }
    }

    const handleDegrow = () => {
      if (chackToken == null) {
        navigate('/login')
        dispatch({ type: 'LINK_PAGES', payload: { linker } })
      }
      else {
        navigate('/tools/others/degrow')
      }
    }
    const handleUbrSoftAtRejected = () => {
      if (chackToken == null) {
        navigate('/login')
        dispatch({ type: 'LINK_PAGES', payload: { linker } })
      }
      else {
        navigate('/tools/others/UBR_soft_at_Rejection')
      }
    }

    const handleZeroRNAPayload = () => {
      if (chackToken == null) {
        navigate('/login')
        dispatch({ type: 'LINK_PAGES', payload: { linker } })
      }
      else {
        navigate('/tools/others/zero_RNA_payload')
      }
    }

    const handleCatsTracker = () => {
      if (chackToken == null) {
        navigate('/login')
        dispatch({ type: 'LINK_PAGES', payload: { linker } })
      }
      else {
        navigate('/tools/others/cats_tracker')
      }
    }

    const handleEmployee=()=>{
      if (chackToken == null) {
        navigate('/login')
        dispatch({ type: 'LINK_PAGES', payload: { linker } })
      }
      else {
        navigate('/tools/others/employee_skills')
      }
    }


    const backgroundStyle = {
      height: "auto",
      width: "300px",
      // marginLeft: "auto",
      // marginRight: "auto",
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
              marginBottom: 5,
              // border:'2px solid blue'
            }}
          >
            TOOLS
          </Box></Box>
        <Zoom in='true' timeout={500}>

          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <Box sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
              <Grid container rowSpacing={2} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }} style={{}}>

                {/* <Grid item xs={4}>
                  <Box sx={backgroundStyle} className={classes.des} onClick={handleFileMerge}>
                    <div className={classes.centerIcon}><SingleSourceIcon /></div>
                    <div >
                      <div className={classes.center}  >FILE MERGE </div>
                      <div>This is a File Merge tool</div>
                    </div>
                  </Box>
                </Grid> */}
                {/* <Grid item xs={4}>
                  <Box sx={backgroundStyle} className={classes.des} onClick={handleSchedular}>
                    <div className={classes.centerIcon}><TimeIcon /></div>
                    <div >
                      <div className={classes.center}>SCHEDULER</div>
                      <div>This is a SCHEDULER tool</div>
                    </div>
                  </Box>
                </Grid> */}

                {/* <Grid item xs={4}>
                  <Box sx={backgroundStyle} className={classes.des} onClick={handleDegrow}>
                    <div className={classes.centerIcon}><TimeIcon /></div>
                    <div >
                      <div className={classes.center}>DEGROW</div>
                    </div>
                  </Box>
                </Grid> */}

                {/* <Grid item xs={4}>
                  <Box sx={backgroundStyle} className={classes.des} onClick={handleUbrSoftAtRejected}>
                    <div className={classes.centerIcon} ><BlockIcon/></div>
                    <div >
                      <div className={classes.center}>UBR Soft-At Tracker</div>
                    </div>
                  </Box>
                </Grid> */}

                {/* <Grid item xs={4}>
                  <Box sx={backgroundStyle} className={classes.des} onClick={handleZeroRNAPayload}>
                    <div className={classes.centerIcon}><CombinationIcon /></div>
                    <div >
                      <div className={classes.center}>Zero RNA Payload</div>
                      <div>This is a Zero RNA Payload</div>
                    </div>

                  </Box>
                </Grid> */}

                {/* <Grid item xs={4}>
                  <Box sx={backgroundStyle} className={classes.des} onClick={handleCatsTracker}>
                    <div className={classes.centerIcon}><RelatedMapIcon /></div>
                    <div >
                      <div className={classes.center}>CATS Tracker</div>
                      <div>This is a CATS Tracker</div>
                    </div>
                  </Box>
                </Grid> */}

                {/* <Grid item xs={4}>
                  <Box sx={backgroundStyle} className={classes.des} onClick={handleEmployee}>
                    <div className={classes.centerIcon}><OperatePeopleIcon /></div>
                    <div >
                      <div className={classes.center}>Employee Skills</div>
                      <div>This is a Employee Skills</div>
                    </div>
                    <span className={classes.center}>SCHEDULER</span>
                  </Box>
                </Grid> */}

              </Grid>
            </Box>
          </Box>
        </Zoom>
      </Box>
    </div>

  )
}

export default Others