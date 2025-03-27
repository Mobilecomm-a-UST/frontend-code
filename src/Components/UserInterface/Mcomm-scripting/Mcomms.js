

import React, { useState ,useEffect} from "react";
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL } from '../../services/FetchNodeServices';
import OverAllCss from '../../csss/OverAllCss';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import Zoom from '@mui/material/Zoom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import * as XLSX from 'xlsx';


const Mcomms = () => {
    const [mcommFile, setMcommFile] = useState({ filename: "", bytes: "" })
    const [circle, setCircle] = useState()
    const circleData = ['RAJ', 'UPW', 'ASM', 'HP', 'JK', 'AP', 'CHN', 'ROTN', 'KK', 'MUM', 'DEL', 'GUJ', 'MAH', 'UPE', 'ORI', 'MP', 'KOL', 'NE', 'WB', 'KL', 'BIH', 'PUN', 'JRK', 'HRY']
    const [oem, setOem] = useState()
    const oemData = ['ZTE','Samsung','Huawei' , 'Nokia', 'Ericsson']
    const [bts, setBts] = useState()
    const [technology, setTechnology] = useState()
    const [hardware1, setHardware1] = useState('')
    const [hType, setHType] = useState('')
    const [hCard, setHCard] = useState([])
    const [hCardValue, setHCardValue] = useState([])
    const [hCount, setHCount] = useState([])
    const [hCountValue, setHCountValue] = useState([])
    const [fileData, setFileData] = useState()
    const [showMcomFile, setShowMcomFile] = useState(false)
    const [showDown, setShowDown] = useState(false)
    const [open, setOpen] = useState(false);
    const classes = OverAllCss();
    var link = `${ServerURL}${fileData}`;



    console.log('aaaa count', Object.values(hCount))

    const handleCircle = (event) => {
        setCircle(event.target.value)
    }

    const handleOEM = (event) => {
        setOem(event.target.value)
    }
    const handleBTS = (event) => {
        setBts(event.target.value)
    }
    const handleTechnology = (event) => {
        setTechnology(event.target.value)
    }
    const handleHType = (event) => {
        setHType(event.target.value);
        setHCard([]);
        setHCount('');
        if (event.target.value === 'FSMF') {
            setHCardValue(['FBBA(472182A)', 'FBBC(472797A)', 'FBBCA(473839A)', 'None'])
        }
        else if (event.target.value === 'ASOE') {
            setHCardValue(['None'])
        }


    }
    const handleHCard = (event) => {
        // setHCard(event.target.value);
        // setHCount('');
        // if(event.target.value === 'None'){
        //     setHCountValue(['None']);
        // }else{
        //      setHCountValue(['1','2']);
        // }
        const {
            target: { value },
        } = event;
        setHCard(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );


    }

    const handleHCount = (event, index) => {

        // setHCount((prev)=>[...prev , {index:event.target.value}])
        setHCount((prevState) => ({
            ...prevState,
            [index]: event.target.value, // Use the index as the key to update or create the value
        }));

        // setHCount((prev) =>
        //     prev?.map((item, i) =>
        //         i === index ? { ...item, [index]: event.target.value } : item
        //     )
        // );


    }



    const handleReadData = (e) => {
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0])
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const persedData = XLSX.utils.sheet_to_json(sheet)
            console.log(persedData)
        }
    }

    const handleMcommFile = (event) => {
        setMcommFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true
        })

    }

    const handleSubmit = async () => {
        var formData = new FormData()
        formData.append("circle", circle);
        formData.append("OEM", oem)
        formData.append("BTS", bts)
        formData.append("Technology", technology)
        formData.append("hardware", hType)
        formData.append("card", hCard)
        formData.append("count", Object.values(hCount))
        formData.append("input_xl", mcommFile.bytes)
        const response = await postData('Scriptor/upload/', formData)
        console.log(response)
        setFileData(response.Xml_script_url)
        if (response.status == true) {
            setOpen(false);
            setShowDown(true);
            Swal.fire({
                icon: "success",
                title: "Done",
                // text: `${response.message}`,
            });
        }
        else {
            setOpen(false);
            // setShowDown(true);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                // text: `${response.message}`,
            });
        }

    }


    // ###### HANDLE CANCEL   #######
    const handleCancel = () => {
        setMcommFile({ filename: "", bytes: "" });

    }

    // DATA PROCESSING DIALOG BOX...............
    const loadingDialog = () => {
        return (
            <Dialog
                open={open}

                // TransitionComponent={Transition}
                keepMounted
            // aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
                    <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
                    <Box >DATA UNDER PROCESSING...</Box>
                </DialogContent>

            </Dialog>
        )
    }
    useEffect(()=>{
        document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
      },[])

    return (
        <>

            <div style={{ marginTop: '6%' }}>
                <Zoom in='true' timeout={800} style={{ transformOrigin: '1 1 1' }}>
                    <div>
                        <div style={{ margin: 10, marginLeft: 50 }}>
                            <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                                <Link underline="hover" href='/tools'>Tools</Link>
                                {/* <Link underline="hover" href='/tools/others'>Others</Link> */}
                                <Typography color='text.primary'>Mcom Scripting</Typography>
                            </Breadcrumbs>
                        </div>

                        <Box className={classes.main_Box}>
                            <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                                <Box className={classes.Box_Hading} >
                                    Mcom Scripting
                                </Box>
                                <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                                    <Box className={classes.Front_Box} >
                                        <Box sx={{}}>
                                            {/* .....SELECT OPTION FOR CIRCLE...... */}
                                            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                                                <InputLabel >CIRCLE</InputLabel>
                                                <Select
                                                    value={circle}
                                                    onChange={handleCircle}
                                                    label="CIRCLE"
                                                >
                                                    {circleData.map((item) => (
                                                        <MenuItem value={item}>{item}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {/* .....SELECT OPTION FOR OEM...... */}
                                            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                                                <InputLabel >OEM</InputLabel>
                                                <Select
                                                    value={oem}
                                                    onChange={handleOEM}
                                                    label="OEM"
                                                >
                                                    {oemData.map((item) => (
                                                        <MenuItem value={item}>{item}</MenuItem>
                                                    ))}

                                                </Select>
                                            </FormControl>
                                            {/* SELECT OPTION FOR BTS TYPE  */}
                                            {/* <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                                                <InputLabel >BTS Type</InputLabel>
                                                <Select
                                                    value={bts}
                                                    onChange={handleBTS}
                                                    label="BTS Type"
                                                >
                                                    {circleData.map((item) => (
                                                        <MenuItem value={item}>{item}</MenuItem>
                                                    ))}

                                                </Select>
                                            </FormControl> */}
                                            {/* SELECT OPTION FOR Technology  */}
                                            {/* <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                                                <InputLabel >Technology</InputLabel>
                                                <Select
                                                    value={bts}
                                                    onChange={handleTechnology}
                                                    label="Technology"
                                                >
                                                    {circleData.map((item) => (
                                                        <MenuItem value={item}>{item}</MenuItem>
                                                    ))}


                                                </Select>
                                            </FormControl> */}

                                        </Box>

                                    </Box>
                                    <Box className={classes.Front_Box} >
                                        <div className={classes.Front_Box_Hading}>
                                            Select Hardware
                                        </div>
                                        <div >

                                            {/* .....SELECT OPTION FOR Hardware Type...... */}
                                            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                                                <InputLabel >TYPES</InputLabel>
                                                <Select
                                                    value={hType}
                                                    onChange={handleHType}
                                                    label="TYPES"
                                                >
                                                    <MenuItem value="FSMF">FSMF</MenuItem>
                                                    <MenuItem value="ASOE">ASOE</MenuItem>
                                                    <MenuItem value="ASOE">AIRSCALE</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {/* .....SELECT OPTION FOR Hardware CARD...... */}
                                            <FormControl sx={{ m: 1, minWidth: 150 }} size="small" >
                                                <InputLabel >CARD</InputLabel>
                                                <Select
                                                    value={hCard}
                                                    onChange={handleHCard}

                                                    multiple
                                                    label="CARD"
                                                >

                                                    {hCardValue?.map((item) => {

                                                        let itemValue ;

                                                    if(item != 'None'){
                                                         itemValue = item.replace(/^[^\(]+|\)$/g, '').replace('(','');
                                                    }
                                                    else{
                                                        itemValue = item;
                                                    }
                                                       return (
                                                            <MenuItem value={itemValue}>{item}</MenuItem>
                                                        )
                                                    })}

                                                </Select>
                                            </FormControl>
                                      
                                            <br/>
                                            {hCard?.map((item, index) => (
                                                <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                                                    <InputLabel >{item}</InputLabel>
                                                    <Select
                                                        value={hCount[index]}
                                                        onChange={(e) => { handleHCount(e, item) }}
                                                        label={item}
                                                    >

                                                        <MenuItem value="1">1</MenuItem>
                                                        <MenuItem value="2">2</MenuItem>


                                                    </Select>
                                                </FormControl>
                                            ))}
                                        </div>
                                    </Box>

                                    <Box className={classes.Front_Box} >
                                        <div className={classes.Front_Box_Hading}>
                                            Select Excel Files:-<span style={{ fontFamily: 'Poppins', fontSize: 15, color: "gray", marginLeft: 20 }} >{mcommFile.filename}</span>
                                        </div>
                                        <div className={classes.Front_Box_Select_Button} >
                                            <div style={{ float: "left" }}>
                                                <Button variant="contained" component="label" color={mcommFile.state ? "warning" : "primary"}>
                                                    select file
                                                    <input type="file" required onChange={(e) => { handleReadData(e); handleMcommFile(e) }} hidden />
                                                </Button>
                                            </div>
                                            <div>  <span style={{ display: showMcomFile ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                            <div></div>
                                        </div>
                                    </Box>

                                </Stack>
                                <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                                    <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>upload</Button>

                                    <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
                                </Stack>
                            </Box>
                            <a download href={link} target="_blank" style={{ display: showDown ? 'inherit' : 'none' }}><Button variant="outlined" startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download File Now</span></Button></a>


                        </Box>
                        {loadingDialog()}



                    </div>
                </Zoom>
            </div>
        </>
    )
}

export default Mcomms