import React from "react";
import{useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import OverAllCss from './../../../../csss/OverAllCss'
import Zoom from "@mui/material/Zoom";
import { Box, Button ,Stack,Breadcrumbs,Link,Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';




const MakeKPITrendOld = () => {
  const navigate = useNavigate();
  const classes = OverAllCss()

useEffect(()=>{
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
},[])
  return (
    <Zoom in='true' timeout={500}>
    <div>
    <div style={{margin:10}}>
    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small"/>}>
        <Link underline="hover" href='/tools'>Tools</Link>
        <Link underline="hover" href='/trends'>Trend</Link>
        <Link underline="hover" href='/trends/ap'>AP</Link>
        <Typography color='text.primary'>Make Trend(old)</Typography>
       </Breadcrumbs>
    </div>
    <Box className={classes.main_Box}>
        <Box className={classes.Back_Box}>
            <Box className={classes.Box_Hading}>
                Make KPI TREND(OLD)
            </Box>
            <Box style={{display:'flex',justifyContent:'center'}}>
            <Stack spacing={4} sx={{ marginTop: "-40px",textAlign:'center' }} direction={{xs:'column',md:'row',sm:'column'}}>
                <Box><Button variant="contained" style={{width:200}} onClick={()=>{navigate('/trends/ap/make_kpi_trend_old/2G')}}><span style={{fontSize:20,fontWeight:'bold'}}>For 2G</span></Button></Box>
                <Box><Button variant="contained" style={{width:200}} onClick={()=>{navigate('/trends/ap/make_kpi_trend_old/4G')}}><span style={{fontSize:20,fontWeight:'bold'}}>For 4G</span></Button></Box>
            </Stack>
            </Box>
        </Box>
    </Box>
</div>
</Zoom>
  )
}

export default MakeKPITrendOld