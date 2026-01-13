import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, Stack, Button, Popover, List, ListItem, ListItemText } from "@mui/material";
import Slide from '@mui/material/Slide';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import OverAllCss from '../../../csss/OverAllCss';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import { postData, ServerURL } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { getDecreyptedData } from "../../../utils/localstorage";




const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const AddCheckListData = (props) => {
    const [make4GFiles, setMake4GFiles] = useState({ filename: "", bytes: "" })
    const [show4G, setShow4G] = useState(false)
    const classes = OverAllCss();
    const { loading, action } = useLoadingDialog()
        const userID = getDecreyptedData("userID")



    const handle4GFileSelection = (event) => {

        setMake4GFiles({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true

        })
    }



    const handleSubmit = async () => {
        if (make4GFiles.filename.length > 0) {
            action(true)
            var formData = new FormData();
            // console.log('pre files' , preFiles[i])
            formData.append(`excel_file`, make4GFiles.bytes);
            formData.append('userId', userID);
            const response = await postData(`Soft_AT_Checklist_Nokia/${props.api}/`, formData)
            // console.log('response data', response)
            if (response.status === true) {
                action(false)
                props.handleClick();
                props.handleFetch();
                
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });
         
            } else {
                action(false)
                props.handleClick();

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${response.message}`,
                });
            }
        }
        else {
            if (make4GFiles.filename.length === 0) {
                setShow4G(true)
            } else {
                setShow4G(false)
            }

        }
    }

    const handleCancel = () => {
        setMake4GFiles({ filename: "", bytes: "" })
        setShow4G(false)
    }


    if (props.open) {
        return (
            <Dialog
                open={props.open}
                TransitionComponent={Transition}
                keepMounted
                // onClose={handleClose}
                maxWidth={'md'}
                fullWidth={true}
                style={{zIndex: 2}}
            >
                <DialogTitle style={{ borderBottom: '1px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItem: 'center' }}><Box><AddIcon fontSize='medium' /></Box><Box>ADD {props.name} DATA</Box></Box>
                    <Box >
                        <Tooltip title="Cancel">
                            <IconButton onClick={() => { props.handleClick() }}>
                                <CloseIcon fontSize='medium' color='default' />
                            </IconButton>
                        </Tooltip>
                    </Box>

                </DialogTitle>
                <DialogContent dividers={'paper'}>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>

                            <Stack spacing={2} sx={{ marginTop: "-10px" }} direction={'column'}>

                                <Box className={classes.Front_Box} >
                                    <div className={classes.Front_Box_Hading}>
                                        Select Excel Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{ }</span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button} >
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={make4GFiles.length > 0 ? "warning" : "primary"}>
                                                select file
                                                <input required hidden accept=".xlsx" type="file"
                                                    // webkitdirectory="true"
                                                    // directory="true"
                                                    onChange={(e) => { handle4GFileSelection(e); setShow4G(false); }} />
                                            </Button>
                                        </div>

                                        {make4GFiles.filename.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>{make4GFiles.filename}</span>}

                                        <div>  <span style={{ display: show4G ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    </div>
                                </Box>
                            </Stack>
                            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>

                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Upload</Button>

                                <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >Clear</Button>

                            </Stack>
                        </Box>
                    </Box>
                </DialogContent>
                {loading}
            </Dialog>
        )
    }
}

export default React.memo(AddCheckListData)