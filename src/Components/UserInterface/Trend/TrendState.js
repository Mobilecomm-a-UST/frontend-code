import React, { useEffect } from 'react'
import Home from '../Home'
import { Box, Grid } from '@mui/material'
import { useStyles } from './TrendStateCss';
import {ServerURL} from '../../services/FetchNodeServices'

import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom'
import Zoom from '@mui/material/Zoom';

function TrendState() {
  const dispatch = useDispatch()
  const classes = useStyles()
  const navigate = useNavigate()
  const tnchLink = `/trends/tn_ch`;
  const rjLink = '/trends/rj'
  const apLink = '/trends/ap';


  //console.log(tnchLink)
  const headData = document.location.pathname.split('/')[1];

  useEffect(()=>{
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
  },[])

  return (
    <div >

      <div style={{ padding: "15px" ,backgroundColor: '#FBEEE6'}}>
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
            }}
          >
            TREND
          </Box></Box>
          <Zoom in='true' timeout={500}>
          <Box sx={{display:'flex',justifyContent:'center',placeItems:'center',flexDirection:'column'}}>
        <Box sx={{ width:'90%', marginLeft:'auto',marginRight:'auto'}}>
          <Grid container spacing={3} direction={{ xs: "column", sm: "column", md: "row" }} style={{}}>
            <Grid item xs={3}>
              <Box  className={classes.des}  onClick={() => navigate(apLink)}><img src={`${ServerURL}/media/assets/AP1.png`} width="60" loading='lazy'/><span className={classes.lettal}>Andhra Pradesh</span></Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.des} onClick={() => navigate('/trends/br')}><img src={`${ServerURL}/media/assets/bihar final.png`} width="60" loading='lazy' /><span className={classes.lettal}>Bihar</span></Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.des}  onClick={() => navigate(tnchLink)}><img src={`${ServerURL}/media/assets/TNCH.png`} width="50" loading='lazy'/><span className={classes.lettal}>Tamil Nadu/Chennai</span></Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.des} onClick={() => navigate(rjLink)}><img src={`${ServerURL}/media/assets/RJ.png`} width="50" loading='lazy'/><span className={classes.lettal}>Rajasthan</span></Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.des} onClick={() => navigate('/trends/hr')}><img src={`${ServerURL}/media/assets/haryana.png`} width="50" loading='lazy'/><span className={classes.lettal}>Haryana</span></Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.des} onClick={() => navigate('/trends/or')}><img src={`${ServerURL}/media/assets/odisha.png`} width="50" loading='lazy'/><span className={classes.lettal}>Odisha</span></Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.des} onClick={() => navigate('/trends/wb_kol')}><img src={`${ServerURL}/media/assets/WB_KOL.png`} width="50" loading='lazy'/><span className={classes.lettal}>West Bengal/Kolkata</span></Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.des} onClick={() => navigate('/trends/mp')}><img src={`${ServerURL}/media/assets/mpfinal.png`} width="50" loading='lazy'/><span className={classes.lettal}>Madhya Pradesh</span></Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.des} onClick={() => navigate('/trends/pb')}><img src={`${ServerURL}/media/assets/panjab.png`} width="50" loading='lazy'/><span className={classes.lettal}>Punjab</span></Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.des} onClick={() => navigate('/trends/dl')}><img src={`${ServerURL}/media/assets/delhi.png`} width="50" loading='lazy'/><span className={classes.lettal}>Delhi</span></Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.des} onClick={() => navigate('/trends/jk')}><img src={`${ServerURL}/media/assets/JK.png`} width="50" loading='lazy'/><span className={classes.lettal}>Jammu Kashmir</span></Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.des} onClick={() => navigate('/trends/upw')}><img src={`${ServerURL}/media/assets/UPW.png`} width="50"  loading='lazy'/><span className={classes.lettal}>UP West</span></Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.des} onClick={() => navigate('/trends/ktk')}><img src={`${ServerURL}/media/assets/KTK.png`} width="50" loading='lazy'/><span className={classes.lettal}>Karnataka</span></Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.des} onClick={() => navigate('/trends/mum')}><img src={`${ServerURL}/media/assets/mum.png`} width="60" loading='lazy'/><span className={classes.lettal}>Mumbai</span></Box>
            </Grid>
            <Grid item xs={3}>
              <Box className={classes.des} onClick={() => navigate('/trends/upe')}><img src={`${ServerURL}/media/assets/UPE.png`} width="60" loading='lazy'/><span className={classes.lettal}>UP East</span></Box>
            </Grid>
          </Grid>
        </Box>
        </Box>
        </Zoom>
      </div>
    </div>
  )
}

export default TrendState