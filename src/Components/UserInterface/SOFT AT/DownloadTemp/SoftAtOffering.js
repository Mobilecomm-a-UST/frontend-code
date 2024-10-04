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
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Swal from "sweetalert2";




const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" timeout={1000} ref={ref}  {...props} />;
});

const circleOem = [{ id: 1, circle: 'AP', OEM: ['Ericsson (AP)'] },
{ id: 2, circle: 'BIH', OEM: ['Nokia (BIH)'] },
{ id: 3, circle: 'CHN', OEM: ['Ericsson (CHN)', 'Huawei (CHN)'] },
{ id: 4, circle: 'DEL', OEM: ['Ericsson (DEL)'] },
{ id: 5, circle: 'HRY', OEM: ['Ericsson (HRY)', 'ZTE (HRY)'] },
{ id: 6, circle: 'JK', OEM: ['Ericsson (JK)'] },
{ id: 7, circle: 'JRK', OEM: ['Nokia (JRK)'] },
{ id: 8, circle: 'KK', OEM: ['Huawei (KK)'] },
{ id: 9, circle: 'KOL', OEM: ['Samsung (KOL)', 'ZTE (KOL)'] },
{ id: 10, circle: 'MP', OEM: ['Nokia (MP)'] },
{ id: 11, circle: 'MUM', OEM: ['Nokia (MUM)'] },
{ id: 12, circle: 'ORI', OEM: ['Nokia (ORI)'] },
{ id: 13, circle: 'PUN', OEM: ['Nokia (PUN)', 'Samsung (PUN)', 'ZTE (PUN)'] },
{ id: 14, circle: 'RAY', OEM: ['Ericsson (RAY)'] },
{ id: 15, circle: 'ROTN', OEM: ['Ericsson (ROTN)', 'Huawei (ROTN)'] },
{ id: 16, circle: 'UPE', OEM: ['Nokia (UPE)'] },
{ id: 17, circle: 'UPW', OEM: ['Ericsson (UPW)', 'Huawei (UPW)'] },
{ id: 18, circle: 'WB', OEM: ['Nokia (WB)'] },];

const SoftAtOffering = () => {
    const classes = OverAllCss();
    const [toggalValue, setToggalValue] = useState('Date')
    const [date, setDate] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [circle, setCircle] = useState([])
    const [allcircle, setAllcircle] = useState([])
    const [siteId, setSiteId] = useState('')
    const [oemList, setOemList] = useState([])
    const [selectOem, setSelectOem] = useState([])
    const [fileData, setFileData] = useState()
    const [oemShow, setOemShow] = useState(false)
    const [open, setOpen] = useState(false);
    const { loading, action } = useLoadingDialog()
    const [finalJson, setFinalJson] = useState([])
    var link = `${ServerURL}${fileData}`;

    // console.log('sssss', circle,selectOem,finalJson)


    const handleDateFormat = (e) => {
        const dateObject = new Date(e.$d);
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
        if ((date && selectOem) || (fromDate && selectOem)) {
            action(true)
            var formData = new FormData();
            formData.append('date', handleDateFormat(date))
            formData.append('from_date', handleDateFormat(fromDate))
            formData.append('to_date', handleDateFormat(toDate))
            formData.append('circle_oem', JSON.stringify(finalJson))
            formData.append('site_id', siteId)
            const response = await postData('IntegrationTracker/softAt-offering-templates/', formData)
            if (response) {
                console.log('response', response)
                setFileData(response.url)
                action(false)
                setOpen(true)
            }
            else {
                action(false)
            }
        }
        else {
            Swal.fire({
                title: "Alart!",
                text: "Please Select Date/Range and Select Oem",
                // icon: "question"
            });

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
                    <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Soft-AT Offering</span></Button></a>
                </Box>
            </DialogContent>

        </Dialog>)

    }, [open])


    const SelectCircle = (circles) => {
        setFinalJson([])
        const { target: { value }, } = circles;
        setCircle(
            typeof value === 'string' ? value.split(',') : value,
        );

        // circles.target.value.forEach(circ => {
        //     setFinalJson((prev) => [...prev, { [circ]: [] }])
        // });

        let filterlist = circleOem.filter((item) => (circles.target.value).includes(item.circle))

        let arr = []

        filterlist?.map((item) => {
            // console.log('oem', item.OEM)
            arr.push(item.OEM)
        })
        // console.log('oem list' , arr.flat())
        setOemList(arr.flat())

        if (circles.target.value.length > 0) {
            setOemShow(true);
        } else {
            setOemShow(false);
        }


    }

    const selectedOem = (event) => {
        const { target: { value }, } = event;
        setSelectOem(
            typeof value === 'string' ? value.split(',') : value,
        );

        // event.target.value.forEach(item => {
        //     let circleName = item.split(' (')[1].slice(0, -1); 

        //     if (circle.includes(circleName)) {
        //         // finalJson[circleName].push(item);
        //         setFileData((prev) => [...prev, { [circleName]:  finalJson[circleName].push(item) }])

        //     }
        // })
    }


    useEffect(() => {
       
    
        let tempResult = {};
    
        // Initialize the result object with empty arrays for each circle
        circle.forEach(circ => {
          tempResult[circ] = [];
        });
    
        // Populate the result object with OEM data
        selectOem.forEach(item => {
          // Extract the circle from the item
          let circleName = item.split(' (')[1].slice(0, -1); // Get the circle name from 'Huawei (UPW)' -> 'UPW'
    
          if (circle.includes(circleName)) {
            tempResult[circleName].push(item);
          }
        });

        setFinalJson(tempResult);
      }, [circle,selectOem]);


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
                        <Typography color='text.primary'>Soft AT Offering</Typography>
                    </Breadcrumbs>
                </div>

                <Box className={classes.main_Box}>
                    <Box className={classes.Back_Box} component="form" sx={{ width: { md: '75%', xs: '100%' } }}>
                        <Box className={classes.Box_Hading} >
                            SOFT AT OFFERING TEMPLATE
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
                                    <FormControl sx={{ minWidth: 150, maxWidth: 500 }}>
                                        <InputLabel id="Select_Circle">Select Circle</InputLabel>
                                        <Select
                                            labelId="Select_Circle"
                                            id="demo-simple-select"
                                            multiple
                                            value={circle}
                                            // label="Select Circle"
                                            onChange={(event) => { SelectCircle(event) }}
                                            input={<OutlinedInput label="Tag" />}
                                            renderValue={(selected) => selected.join(', ')}
                                            size="medium"
                                        >
                                            {allcircle?.map((data, index) => (
                                                <MenuItem key={index} value={data}>
                                                     <Checkbox checked={circle.includes(data)} />
                                                     <ListItemText primary={data} />
                                                    {/* {data} */}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>


                            <Collapse in={oemShow} timeout={500} className={classes.Front_Box} sx={{ display: oemShow ? "block" : "none" }}>
                                <Box className={classes.Front_Box_Hading}>
                                    Select OEM
                                </Box>
                                <Box sx={{ marginTop: "5px", float: "left" }}>
                                    <FormControl sx={{ minWidth: 150, maxWidth: 500 }}>
                                        <InputLabel id="Select_OEM">Select OEM</InputLabel>
                                        <Select
                                            labelId="Select_OEM"
                                            id="demo-simple-select"
                                            multiple
                                            value={selectOem}
                                            // label="Select OEM"
                                            onChange={(e) => selectedOem(e)}
                                            input={<OutlinedInput label="Tag" />}
                                            renderValue={(selected) => selected.join(', ')}
                                            size="medium"
                                        >
                                            {oemList?.map((data, index) => (
                                                <MenuItem key={index} value={data} >
                                                     <Checkbox checked={selectOem.includes(data)} />
                                                     <ListItemText primary={data} />
                                                    {/* {data} */}
                                                </MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Box>
                            </Collapse>



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

export default SoftAtOffering