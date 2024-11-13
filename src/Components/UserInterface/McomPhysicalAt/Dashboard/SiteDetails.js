import React, { useState } from 'react'
import { Grid ,Button, colors} from '@mui/material'
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Planning from './Planning';
import SiteDet from './SiteDet';
import RANATchecklist from './RANATchecklist';
import Photograph from './Photograph'
import AcceptanceLog from './AcceptanceLog'




const useStyles = makeStyles((theme) => ({
    statusButton:{
        padding:'0.25rem',
        backgroundColor: 'white',
        color: 'red',
        border: '1px solid red',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight:'bold',
        '&:hover': {
          backgroundColor: 'red',
          color:'white'
        },
    },
    downloadPDF:{
        backgroundColor:'red',
        color:"white",
        paddingTop:'0.25rem',
        fontWeight:'bold',
        paddingLeft:'0.3rem',
        paddingRight:'0.3rem',
        borderRadius:'5px',
        display:'flex',
        justifyContent:'center',
        cursor:'pointer',
        '&:hover':{
            backgroundColor: 'white',
          color:'red',
          border:'1px solid red'
        }

    }
}))

const SiteDetails = () => {
  const [physicalFun, setPhysicalFun] = useState({plannings:true,sitedetail:false,rna:false,photo:false,acceptance:false})
  const classes = useStyles();


  const UpdatePhysicalFun=(value)=>{
    setPhysicalFun({
        plannings: value === 'plannings',
        sitedetail: value === 'sitedetail',
        rna: value === 'rna',
        photo: value === 'photo',
        acceptance: value === 'acceptance',
      });
  }

  return (
    <>
    <div>
        <div style={{margin:'10px',border:'1px solid black',borderRadius:'5px',padding:'10px'}}>
        <h4 style={{borderBottom:'2px solid red',color:"black"}}>Site Details</h4>
        <Grid container rowSpacing={2} columnSpacing={2} direction={{ xs: "column", sm: "column", md: "row" }} sx={{mt:1}}>
            <Grid item xs={3}>
                <TextField label="Parent SR No." variant="outlined" size="small" fullWidth  />
            </Grid>
            <Grid item xs={3}>
                <TextField label="SR No." variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="Tsp No." variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="Circle" variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="Name of TSP" variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="BTS Manufacturer (OEM)" variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="Site ID" variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="Base Site ID/2G Site ID" variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="Latitude" variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="Longitude" variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="Cluster" variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="Site Name" variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="Site TOCO Name" variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="Site TOCO ID" variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="Layer/Band" variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="Tech ID" variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={3}>
                <TextField label="Activity" variant="outlined" size="small" fullWidth/>
            </Grid>
            <Grid item xs={9}>
                <TextField multiline label="Site Address" variant="outlined" size="small" fullWidth/>
            </Grid>
           
        </Grid>
      </div>
      <div style={{margin:'10px',border:'1px solid black',borderRadius:'5px',padding:'10px'}}>
      <h4 style={{borderBottom:'2px solid red',color:"black"}}>Physical AT</h4>
        <div style={{display:'flex',flexDirection:'column',gap:'10px',marginTop:'10px'}}>
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                <div className={classes.statusButton}>Status : Pending</div>
                <div className={classes.downloadPDF}><PictureAsPdfIcon />Download PDF</div>
            </div>
            <div style={{display:'flex',flexDirection:'row',gap:'10px'}}>
                <Button onClick={() => UpdatePhysicalFun('plannings')} variant={physicalFun.plannings === true?'contained':'outlined'} size='small'>Planning Details</Button>
                <Button onClick={() => UpdatePhysicalFun('sitedetail')} variant={physicalFun.sitedetail === true?'contained':'outlined'} size='small'>Site Details</Button>
                <Button onClick={() => UpdatePhysicalFun('rna')} variant={physicalFun.rna === true?'contained':'outlined'} size='small'>RAN AT Checklist</Button>
                <Button onClick={() => UpdatePhysicalFun('photo')} variant={physicalFun.photo === true?'contained':'outlined'} size='small'>Photograph</Button>
                <Button onClick={() => UpdatePhysicalFun('acceptance')} variant={physicalFun.acceptance === true?'contained':'outlined'} size='small'>Acceptance Log</Button>
            </div>
            <div>
                 <div style={{display:physicalFun.plannings === true?'block':'none'}}> <Planning /></div>   
                 <div style={{display:physicalFun.sitedetail === true?'block':'none'}}> <SiteDet /></div>   
                 <div style={{display:physicalFun.rna === true?'block':'none'}}> <RANATchecklist /></div>   
                 <div style={{display:physicalFun.photo === true?'block':'none'}}> <Photograph /></div>   
                 <div style={{display:physicalFun.acceptance === true?'block':'none'}}> <AcceptanceLog /></div>   
            </div>
        </div>
      </div>
    </div>
    
    </>
  )
}

export default SiteDetails