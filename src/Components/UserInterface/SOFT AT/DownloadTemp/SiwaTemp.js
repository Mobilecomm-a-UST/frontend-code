import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL, getData } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Zoom from '@mui/material/Zoom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import Slide from '@mui/material/Slide';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" timeout={1000} ref={ref}  {...props} />;
});

const SiwaTemp = () => {
    const classes = OverAllCss();
    const [toggalValue, setToggalValue] = useState('Date')
    const [date, setDate] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [circle, setCircle] = useState('')
    const [allcircle, setAllcircle] = useState([])
    const [siteId, setSiteId] = useState('')
    const [fileData, setFileData] = useState()
    const [open, setOpen] = useState(false);
    const { loading, action } = useLoadingDialog()

    var link = `${ServerURL}${fileData}`;

    // console.log('sssss', date)


    const handleDateFormat = (e) => {
        const dateObject = new Date(e.$d);

        // console.log('dsdsdssdsd', dateObject)

        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(dateObject.getDate()).padStart(2, '0');

        // console.log(year, month, day)

        if (year) {
            return (`${year}-${month}-${day}`);
        } else {
            return ('')
        }


    }

    const handleToggle = (event, value) => {
        setDate('');
        setFromDate('');
        setToDate('');
        setToggalValue(value);
    }

    const handleSubmit = async () => {
        if ((date) || (fromDate)) {
            action(true)
            var formData = new FormData();
            formData.append('date', handleDateFormat(date))
            formData.append('from_date', handleDateFormat(fromDate))
            formData.append('to_date', handleDateFormat(toDate))
            formData.append('circle', circle)
            formData.append('site_id', siteId)
            const response = await postData('IntegrationTracker/softAt-status-update-template/', formData)
            if (response) {
                console.log('response', response)
                setFileData(response.url)
                action(false)
                setOpen(true)
            }
            else {
                action(false)
            }

            // if(response){
            //     setFileData(response.data)
            // }
        }
        else {

        }
    }

    const handleDialogBox = useCallback(() => {
        return (<Dialog
            open={open}
            onClose={handleClose}
            maxWidth={'md'}
            fullWidth={true}
            TransitionComponent={Transition}
            keepMounted
        >
            <DialogContent>
                <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}>
                    <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download SIWA Template</span></Button></a>
                </Box>
            </DialogContent>

        </Dialog>)

    }, [open])


    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        const fetchCircle = async () => {
            const response = await getData('IntegrationTracker/get-integration-circle/');
            // console.log('response',response.circle)
            if (response) {
                setAllcircle(response.circle)
            }
        }
        fetchCircle();

    }, [])
    return (
        <Zoom in='true' timeout={800} style={{ transformOrigin: '1 1 1' }}>
            <div>
            <div style={{ margin: 5, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" href='/tools'>Tools</Link>
                        <Link underline="hover" href='/tools/soft_at'>Soft AT</Link>
                        <Typography color='text.primary'>SIVA Template</Typography>
                    </Breadcrumbs>
                </div>
        
                <Box className={classes.main_Box}>
                    <Box className={classes.Back_Box} component="form" sx={{ width: { md: '75%', xs: '100%' } }}>
                        <Box className={classes.Box_Hading} >
                            SIWA TEMPLATE
                        </Box>

                        <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                            <Box className={classes.Front_Box} >
                                <Box className={classes.Front_Box_Hading}>
                                    {toggalValue == 'Date' ? 'Select Date' : 'Select Range'}  <span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
                                </Box>
                                <Box className={classes.Front_Box_Select_Button} >
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={toggalValue}
                                        exclusive
                                        onChange={handleToggle}
                                        size="medium"
                                    >
                                        <ToggleButton value="Date">Date</ToggleButton>
                                        <ToggleButton value="Range">Range</ToggleButton>

                                    </ToggleButtonGroup>
                                    {toggalValue == 'Date' ? <><Box sx={{ textAlign: 'center' }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                                            <DatePicker label="Select Date" size="small" value={date} onChange={(e) => setDate(e)} />
                                        </LocalizationProvider>
                                    </Box></> : <><Box sx={{ textAlign: 'center' }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                                            <DatePicker label="From Date" value={fromDate} onChange={(e) => setFromDate(e)} /><span style={{ margin: 5, fontSize: 20, fontWeight: 600 }}>~</span>
                                            <DatePicker label="To Date" value={toDate} onChange={(e) => setToDate(e)} />
                                        </LocalizationProvider>
                                    </Box></>}

                                </Box>

                            </Box>
                            <Box className={classes.Front_Box}>
                                <Box className={classes.Front_Box_Hading}>
                                    Select Circle
                                </Box>
                                <Box sx={{ marginTop: "5px", float: "left" }}>
                                    <FormControl sx={{ minWidth: 150 }}>
                                        <InputLabel id="demo-simple-select-label">Select Circle</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={circle}
                                            label="Select Circle"
                                            onChange={(e) => setCircle(e.target.value)}
                                            size="medium"
                                        >

                                            {allcircle?.map((data, index) => (
                                                <MenuItem key={index} value={data}>{data}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>

                            <Box className={classes.Front_Box}>
                                <Box className={classes.Front_Box_Hading}>Enter Site ID</Box>
                                <Box sx={{ marginTop: "5px", float: "left" }}>
                                    <TextField size="medium" label="Enter Site ID" variant="outlined" value={siteId} onChange={(e) => setSiteId(e.target.value)} />
                                </Box>
                            </Box>
                        </Stack>


                        <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>

                            <Button variant="contained" onClick={handleSubmit} color="success" endIcon={<UploadIcon />}>Submit</Button>
                            <Button variant="contained" style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >Clear</Button>

                        </Stack>
                    </Box>
                    {/* <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Temp</span></Button></a> */}
                </Box>

                {/* {handleError()} */}
                {handleDialogBox()}
                {loading}

            </div>
            </Zoom>
    )
}

export default SiwaTemp;