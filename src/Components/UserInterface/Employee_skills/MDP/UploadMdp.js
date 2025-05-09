import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { getData, ServerURL } from "../../../services/FetchNodeServices";
import Tooltip from '@mui/material/Tooltip';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import OverAllCss from "../../../csss/OverAllCss";
import { useNavigate } from 'react-router-dom'
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Fab from '@mui/material/Fab';
import Slide from '@mui/material/Slide';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DownloadIcon from '@mui/icons-material/Download';
import { usePost } from "../../../Hooks/PostApis";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { getDecreyptedData } from "../../../utils/localstorage";
// import FormLabel from '@mui/material/FormLabel';





const circleName = ["AP", // Andhra Pradesh
    "AR", // Arunachal Pradesh
    "AS", // Assam
    "BR", // Bihar
    "CT", // Chhattisgarh
    "GA", // Goa
    "GJ", // Gujarat
    "HR", // Haryana
    "HP", // Himachal Pradesh
    "JK", // Jammu and Kashmir
    "JH", // Jharkhand
    "KA", // Karnataka
    "KL", // Kerala
    "MP", // Madhya Pradesh
    "MH", // Maharashtra
    "MN", // Manipur
    "ML", // Meghalaya
    "MZ", // Mizoram
    "NL", // Nagaland
    "OD", // Odisha
    "PB", // Punjab
    "RJ", // Rajasthan
    "SK", // Sikkim
    "TN", // Tamil Nadu
    "TS", // Telangana
    "TR", // Tripura
    "UK", // Uttarakhand
    "UP", // Uttar Pradesh
    "WB", // West Bengal
    "AN", // Andaman and Nicobar Islands
    "CH", // Chandigarh
    "DN", // Dadra and Nagar Haveli and Daman and Diu
    "DL", // Delhi
    "LD", // Lakshadweep
    "PY", // Puducherry
]

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const yearRanges = [];
for (let year = 2024; year <= 2040; year++) {
  yearRanges.push(`${year} ~ ${year + 1}`);
}

const UploadMdp = () => {
    const { makePostRequest, cancelRequest } = usePost()
    const [rawKpiFile, setRawKpiFile] = useState({ filename: "", bytes: "" })
    const [selectCircle, setSelectCircle] = useState('')
    const [selectMonth, setSelectMonth] = useState('')
    const[selectType , setSelectType] = useState('')
    const [selectAop , setSelectAop]= useState('2024 ~ 2025')
    const [open, setOpen] = useState(false);
    const [rawShow, setRawShow] = useState(false)
    const [circleShow, setCircleShow] = useState(false)
    const [monthShow, setMonthShow] = useState(false)
    const [typeShow, setTypeShow] = useState(false)
    const [fileData, setFileData] = useState()
    const [fileData1, setFileData1] = useState()
    const CirclesArray = (getDecreyptedData("Circle")?.split(','))
    const tempCircleArray = []
    const rawKpiLength = rawKpiFile.filename.length
    const classes = OverAllCss()
    const navigate = useNavigate()
    var link = `${ServerURL}${fileData}`;
    var link1 = `${ServerURL}${fileData1}`;

    // console.log('array circle' , CirclesArray)


    const handleRawKpiFile = (event) => {
        setRawShow(false);
        setRawKpiFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true

        })
    }



    // highlite driver js
    const startTour = () => {
        const driverObj = driver({

            showProgress: true,
            steps: [
                { element: '#step-1', popover: { title: 'Select RAW KPI File', description: 'Select Raw KPI file generated from MyCom Tool', side: "bottom", align: 'start' } },
                { element: '#step-2', popover: { title: 'Select Site List File', description: 'Either select site list in excel formate having column name 2G ID', side: "left", align: 'start' } },
                // { element: '#step-3', popover: { title: 'Enter Site List', description: 'OR paste site id in this field', side: "left", align: 'start' } },
                // { element: '#step-4', popover: { title: 'OFFERED DATE', description: 'Select Offered date which is greatest date +1 amoung the 5 dates', side: "left", align: 'start' } },
                { element: '#step-3', popover: { title: 'SUBMIT BUTTON', description: 'Click on submit button', side: "center", align: 'start' } },
                // { element: '#step-4', popover: { title: '', description: "<div>Please wait few minutes</div><img src='/assets/prograse.png' style='height: 202.5px; width: 270px;' />", }},
                // { element: '#step-5', popover: { title: 'Enable Download KPI Button', description: "<img src='/assets/downloadButton.png' style='height: 202.5px; width: 270px;' />", }},
            ]
        });


        driverObj.drive();
    };

    useEffect(() => {

        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])

    const handleSubmit = async () => {

        if (rawKpiLength > 0 && selectCircle && selectMonth && selectType) {

            setOpen(true)
            var formData = new FormData();
            formData.append("circle", selectCircle);
            formData.append("month", selectMonth);
            formData.append("aop", selectAop);
            formData.append("actual_or_projected", selectType);
            formData.append("file", rawKpiFile.bytes);
            const response = await makePostRequest('MDP/upload_report/', formData)
            // console.log('response data givan dataa', response)
            if (response) {
                setOpen(false);
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });
            }
            else {
                setOpen(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${response.message}`,
                });
            }

        }
        else {
            if (rawKpiLength == 0) {
                setRawShow(true)
            }
            if(!selectCircle){
                setCircleShow(true)
            }
            if(!selectMonth){
                setMonthShow(true)
            }
            if(!selectType){
                setTypeShow(true)
            }
        }
    };




    // DATA PROCESSING DIALOG BOX...............
    const loadingDialog = () => {
        return (
            <Dialog
                open={open}

                // TransitionComponent={Transition}
                keepMounted
            // aria-describedby="alert-dialog-slide-description"

            >
                <DialogContent         >
                    <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
                    {/* <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box> */}
                    <Box style={{ textAlign: 'center' }}><img src="/assets/cloud-upload.gif" style={{ height: 200 }} /></Box>
                    <Box style={{ margin: '10px 0px 10px 0px', fontWeight: 'bolder' }}>DATA UNDER PROCESSING...</Box>
                    <Button variant="contained" fullWidth style={{ backgroundColor: "red", color: 'white' }} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
                </DialogContent>

            </Dialog>
        )
    }


    const handleCancel = () => {
        setRawKpiFile({ filename: "", bytes: "" })
        setSelectCircle('')
        setSelectMonth('')
        setSelectType('')
    }


    useEffect(() => {
        const fetchDownloadTemp = async () => {
            const res = await getData('MDP/template/projection')
            const res1 = await getData('MDP/template/actual')
            if (res) {
                setFileData(res.file_url)
            }
            if (res1) {
                setFileData1(res1.file_url)
            }
            // console.log('temp. download link' , res1)

        }


        fetchDownloadTemp();

    }, [])

    return (
        <Slide
            direction='left'
            in='true'
            // style={{ transformOrigin: '0 0 0' }}
            timeout={1000}
        >
            <div>
                <div style={{ margin: 10, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/others') }}>Other</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/others/circle_inputs') }}>Circle Inputs</Link>


                        <Typography color='text.primary'>MDP Upload</Typography>
                    </Breadcrumbs>
                </div>
                <Box style={{ position: 'fixed', right: 20 }}>
                    <Tooltip title="Download Projected Temp.">
                        <a download href={link}>
                            <Fab color="primary" aria-label="add" >
                                <DownloadIcon />
                            </Fab>
                        </a>
                    </Tooltip>
                </Box>
                <Box style={{ position: 'fixed', right: 20,marginTop:65 }}>
                    <Tooltip title="Download Actual Temp.">
                        <a download href={link1}>
                            <Fab color="primary" aria-label="add" >
                                <DownloadIcon />
                            </Fab>
                        </a>
                    </Tooltip>
                </Box>

                <Box className={classes.main_Box}>
                    <Box className={classes.Back_Box}>
                        <Box className={classes.Box_Hading}>
                            Upload MDP Report
                        </Box>
                        <Stack spacing={2} sx={{ marginTop: "-40px" }}>

                            <Box className={classes.Front_Box} id="step-1">
                                <div className={classes.Front_Box_Hading}>
                                    Select Circle
                                </div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <div style={{ float: "left" }}>
                                        <Autocomplete
                                            name="Circle"
                                            sx={{ width: 300 }}
                                            value={selectCircle}
                                            autoHighlight
                                            onChange={(event, newValue, name) => {
                                                // setFormData((...prev)=>({...prev , Circle:newValue}))
                                                setCircleShow(false)
                                                setSelectCircle(newValue)

                                                // console.log(event.target.value, event.target.name, newValue, name)
                                            }}
                                            options={CirclesArray?CirclesArray:tempCircleArray}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Circle"
                                                    variant="outlined"
                                                    fullWidth
                                                    name="Circle"
                                                    size="small"
                                                    type='text'

                                                />
                                            )}

                                        />
                                    </div>

                                    <div>  <span style={{ display: circleShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                </div>
                            </Box>

                            <Box className={classes.Front_Box} id="step-2">
                                <div className={classes.Front_Box_Hading}>
                                    Select Month
                                </div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <div style={{ float: "left" }}>
                                        <Autocomplete
                                            name="Month"
                                            sx={{ width: 300 }}
                                            value={selectMonth}
                                            autoHighlight
                                            onChange={(event, newValue, name) => {
                                                // setFormData((...prev)=>({...prev , Circle:newValue}))
                                                setMonthShow(false)
                                                setSelectMonth(newValue)

                                                // console.log(event.target.value, event.target.name, newValue, name)
                                            }}
                                            options={months}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Month"
                                                    variant="outlined"
                                                    // fullWidth
                                                    name="Month"
                                                    size="small"
                                                    type='text'
                                                />
                                            )}

                                        />
                                    </div>
                                    <div>
                                    <Autocomplete
                                            sx={{ width: 300 }}
                                            value={selectAop}
                                            autoHighlight
                                            onChange={(event, newValue, name) => {
                                                // setFormData((...prev)=>({...prev , Circle:newValue}))

                                                setSelectAop(newValue)

                                                // console.log(event.target.value, event.target.name, newValue, name)
                                            }}
                                            options={yearRanges}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="AOP"
                                                    variant="outlined"
                                                    // fullWidth
                                                    name="AOP"
                                                    size="small"
                                                    type='text'
                                                />
                                            )}

                                        />
                                    </div>
                                    <div>  <span style={{ display: monthShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                </div>
                            </Box>

                            <Box className={classes.Front_Box} id="step-3">
                                <div className={classes.Front_Box_Hading}>
                                    Select Type
                                </div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <div style={{ float: "left" }}>
                                        <FormControl>

                                            <RadioGroup
                                            row
                                            value={selectType}
                                            onChange={(e)=>{ setTypeShow(false); setSelectType(e.target.value)}}
                                            >
                                                <FormControlLabel value="Projected" control={<Radio />} label="Projected" />
                                                <FormControlLabel value="Actual" control={<Radio />} label="Actual" />

                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                    <div>  <span style={{ display: typeShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                </div>
                            </Box>

                            <Box className={classes.Front_Box} id="step-1">
                                <div className={classes.Front_Box_Hading}>
                                    Select Excel File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{rawKpiFile.filename}</span>
                                </div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <div style={{ float: "left" }}>
                                        <Button variant="contained" component="label" color={rawKpiFile.state ? "warning" : "primary"}>
                                            select file
                                            <input required onChange={handleRawKpiFile} hidden accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" multiple type="file" />
                                        </Button>
                                    </div>
                                    <div>  <span style={{ display: rawShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                </div>
                            </Box>


                        </Stack>
                        <Box style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                            <Box id="step-5">
                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />} id='step-3'>upload</Button>
                            </Box>
                            <Box >
                                <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
                            </Box >
                        </Box>
                    </Box>
                    {/* <Box style={{ display: dlink ? "inherit" : "none" }}>
<a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download KPI Trend</span></Button></a>
</Box> */}



                </Box>
                {loadingDialog()}




            </div>
        </Slide>
    )
}

export default UploadMdp