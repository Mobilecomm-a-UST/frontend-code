import React, { useState, useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL, getData } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import Swal from "sweetalert2";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import { AutoComplete } from 'rsuite';
import Zoom from '@mui/material/Zoom';
import Slide from '@mui/material/Slide';
import * as ExcelJS from 'exceljs'

const suffixes = ['@mcpsinc.in', '@mcpsinc.com'];



const tempDataReview = {
    "message": "Script executed successfully.",
    "status": true,
    "data": {
        "Status": "Accepted",
        "Nokia": {
            "total_count": 0
        },
        "Huawei": {
            "KK": 7,
            "total_count": 7
        },
        "Samsung": {
            "KO": 14,
            "total_count": 14
        }
    }
}

const RejectedReport = () => {
    const [email, setEmail] = useState('')
    const [tdata, setTdata] = useState([])
    const [fileData, setFileData] = useState()
    const [show, setShow] = useState(false)
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [downloads, setDownloads] = useState(false);
    const fileLength = email.length;
    const classes = OverAllCss();
    var link = `${ServerURL}${fileData}`;



    const testingData = () => {
        let arr = [];
        Object.keys(tempDataReview.data)?.map((item) => {
            console.log('test data 1', item)
            arr.push({ ...tempDataReview.data[item], company: item })
            // Object.keys(tempDataReview.data[item]).map((itm) => {
            //     console.log('test data' , itm)
            // })

            console.log('array', arr)

        })
    }


    const handleSubmit = async () => {
        if (fileLength > 0) {
            setOpen(true)
            var formData = new FormData();
            formData.append("Email", email);
            const response = await postData('softat_rej/Soft_At_Rejected_Report', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
            console.log('response data', response)
            setTdata(response.rejected_data)


            if (response.status === true) {
                setOpen(false)
                setDownloads(true)
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });
                // navigate('status')

            } else {
                setOpen(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${response.message}`,
                });
            }
        }
        else {
            setShow(true);
        }
    };

    const handleChange = value => {
        const at = value.match(/@[\S]*/);
        const nextData = at
            ? suffixes
                .filter(item => item.indexOf(at[0]) >= 0)
                .map(item => {
                    return `${value}${item.replace(at[0], '')}`;
                })
            : suffixes.map(item => `${value}${item}`);

        setEmail(nextData);
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
                <DialogContent>
                    <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
                    <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
                    <Box >DATA UNDER PROCESSING...</Box>
                </DialogContent>

            </Dialog>
        )
    }

    // EXPORT EXCEL DATA ............
    const exportData = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Percentage");



        sheet.columns = [
            { header: 'Reference_Id', key: 'Reference_Id', width: 15 },
            { header: 'AoP', key: 'AoP', width: 15 },
            { header: 'Circle', key: 'Circle', width: 15 },
            { header: 'OEM', key: 'OEM', width: 15 },
            { header: 'TSP', key: 'TSP', width: 15 },
            { header: 'Offered_Date', key: 'Offered_Date', width: 15 },
            { header: 'AT Type', key: 'AT_Type', width: 15 },
            { header: 'Site_ID', key: 'Site_ID', width: 15 },
            { header: 'MRBTS_ID', key: 'MRBTS_ID', width: 15 },
            { header: 'Cell_ID', key: 'Cell_ID', width: 15 },
            { header: 'DPR Cell Name', key: 'DPR_Cell_Name', width: 15 },
            { header: 'LNCEL ID', key: 'LNCEL_ID', width: 15 },
            { header: 'MRBTS_Name', key: 'MRBTS_Name', width: 15 },
            { header: 'OSS_FDD_OSS_2G_OSS', key: 'OSS_FDD_OSS_2G_OSS', width: 15 },
            { header: 'Toco', key: 'Toco', width: 15 },
            { header: 'Tech_info', key: 'Tech_info', width: 15 },
            { header: 'Tech', key: 'Tech', width: 15 },
            { header: 'Band', key: 'Band', width: 15 },
            { header: 'Activity Type', key: 'Activity_Type', width: 15 },
            { header: 'Integration date', key: 'Integration_date', width: 15 },
            { header: 'On_Air_DATE', key: 'On_Air_DATE', width: 15 },
            { header: 'Mplane', key: 'Mplane', width: 15 },
            { header: 'Sync_Status', key: 'Sync_Status', width: 15 },
            { header: 'Profile', key: 'Profile', width: 15 },
            { header: 'BSC', key: 'BSC', width: 15 },
            { header: 'BCF', key: 'BCF', width: 15 },
            { header: 'Offer_Reoffer', key: 'Offer_Reoffer', width: 15 },
            { header: 'LAC', key: 'LAC', width: 15 },
            { header: 'TAC', key: 'TAC', width: 15 },
            { header: 'Latitude_N', key: 'Latitude_N', width: 15 },
            { header: 'Longitude_E', key: 'Longitude_E', width: 15 },
            { header: 'FDD MRBTS ID', key: 'FDD_MRBTS_ID', width: 15 },
            { header: 'FDD Mplane IP', key: 'FDD_Mplane_IP', width: 15 },
            { header: 'RET_Count', key: 'RET_Count', width: 15 },
            { header: 'Project_Remarks', key: 'Project_Remarks', width: 15 },
            { header: 'Rejection_Remarks', key: 'Rejection_Remarks', width: 15 },
            { header: 'Media', key: 'Media', width: 15 },
            { header: 'Ckt Id', key: 'Ckt_Id', width: 15 },
            { header: 'SMP_ID', key: 'SMP_ID', width: 15 },
            { header: 'Processed_By', key: 'Processed_By', width: 15 },
            { header: 'AT REMARK', key: 'AT_REMARK', width: 10 },
            { header: 'AT STATUS', key: 'AT_STATUS', width: 15 },
            { header: 'Nominal_Type', key: 'Nominal_Type', width: 15 },

        ]



        tdata?.map(item => {
            sheet.addRow({
                AT_REMARK: item?.AT_REMARK,
                AT_STATUS: item?.AT_STATUS,
                Circle: item?.Circle,
                AT_Type: item?.AT_Type,
                Activity_Type: item?.Activity_Type,
                AoP: item?.AoP,
                BCF: item?.BCF,
                BSC: item?.BSC,
                Band: item?.Band,
                Cell_ID: item?.Cell_ID,
                Ckt_Id: item?.Ckt_Id,
                DPR_Cell_Name: item?.DPR_Cell_Name,
                FDD_MRBTS_ID: item?.FDD_MRBTS_ID,
                FDD_Mplane_IP: item?.FDD_Mplane_IP,
                Integration_date: item?.Integration_date,
                LAC: item?.LAC,
                LNCEL_ID: item?.LNCEL_ID,
                Latitude_N: item?.Latitude_N,
                Longitude_E: item?.Longitude_E,
                MRBTS_ID: item?.MRBTS_ID,
                MRBTS_Name: item?.MRBTS_Name,
                Media: item?.Media,
                Mplane: item?.Mplane,
                Nominal_Type: item?.Nominal_Type,
                OEM: item?.OEM,
                OSS_FDD_OSS_2G_OSS: item?.OSS_FDD_OSS_2G_OSS,
                Offer_Reoffer: item?.Offer_Reoffer,
                Offered_Date: item?.Offered_Date,
                On_Air_DATE: item?.On_Air_DATE,
                Processed_By: item?.Processed_By,
                Profile: item?.Profile,
                Project_Remarks: item?.Project_Remarks,
                RET_Count: item?.RET_Count,
                Reference_Id: item?.Reference_Id,
                Rejection_Remarks: item?.Rejection_Remarks,
                SMP_ID: item?.SMP_ID,
                Site_ID: item?.Site_ID,
                Sync_Status: item?.Sync_Status,
                TAC: item?.TAC,
                TSP: item?.TSP,
                Tech: item?.Tech,
                Tech_info: item?.Tech_info,
                Toco: item?.Toco

            })
            // sheet1.addRow({
            //   MONTH: item?.MONTH,
            //   YEAR: item?.YEAR,
            //   COMPATITOR: item?.COMPATITOR,
            //   sum_projected_count: item?.sum_projected_count
            // })

        })
        sheet.views = [
            { state: 'frozen', xSplit: 5, ySplit: 1000, topLeftCell: 'G10', activeCell: 'A1' }
        ];

        sheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
                if (rowNumber === 1) {
                    // First set the background of header row
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'f5b914' }
                    }
                }
            })
        })



        workbook.xlsx.writeBuffer().then(item => {
            const blob = new Blob([item], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
            })
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = "SOFT_AT_REJECTED.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }





    useEffect(() => {
        testingData()
        // useEffect(()=>{
            document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
        //   },[])
    }, [])

    return (
        <>
            <head>
                <title>
                    {window.location.pathname.slice(7).replaceAll('_', ' ')}
                </title>
            </head>
            <Slide direction="left" in='true' timeout={800} style={{ transformOrigin: '1 1 1' }}>
                <div>
                    <div style={{ margin: 5, marginLeft: 10 }}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" href='/tools'>Tools</Link>
                            <Link underline="hover" href='/tools/soft_at_rejection'>Soft AT Rejection</Link>
                            <Typography color='text.primary'>Rejected Report</Typography>
                        </Breadcrumbs>
                    </div>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                            <Box className={classes.Box_Hading} >
                                FIND SOFT AT REJECTED REPORT
                            </Box>
                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                                <Box className={classes.Front_Box} >
                                    <div className={classes.Front_Box_Hading}>
                                        Enter E-Mail ID:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button} >
                                        <div style={{ float: "left" }}>
                                            <AutoComplete data={email} placeholder="Email" onChange={handleChange} style={{ minWidth: 200, maxWidth: 250, fontWeight: 'bold' }} />
                                        </div>
                                        <div>  <span style={{ display: show ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                        <div></div>
                                    </div>
                                </Box>
                                {/* <Box className={classes.Front_Box}>
                                <div className={classes.Front_Box_Hading}>
                                    Upload Date:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
                                </div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <div >

                                        <input required value={pdate} onChange={(event) => setPdate(event.target.value)} type="date" style={{ width: '165px', height: '35px', fontSize: '20px', fontWeight: 500, borderRadius: "10px" }} />
                                    </div>
                                </div>
                            </Box> */}


                            </Stack>
                            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>

                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>SUBMIT</Button>
                                <Button variant="contained" onClick={handleChange} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
                            </Stack>
                        </Box>
                        <Box style={{ display: downloads ? 'inherit' : 'none' }}>
                            <Button variant="outlined" onClick={exportData} startIcon={<ArrowForwardIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Rejected Report</span></Button>
                        </Box>


                    </Box>

                    {loadingDialog()}
                    {/* {handleError()} */}


                </div>
            </Slide>
        </>
    )
}

export default RejectedReport