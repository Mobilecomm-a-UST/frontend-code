import { useMemo, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Box, Button } from "@mui/material";
import GearIcon from '@rsuite/icons/Gear';

export const useLoadingDialog = () => {
    const [open, setOpen] = useState(false)

    const loadings = () => {
        console.log('loadingh dialog')
        return (
            <Dialog
                open={open}

                // TransitionComponent={Transition}
                keepMounted
            // aria-describedby="alert-dialog-slide-description"

            >
                <DialogContent         >
                    <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
                    <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
                    <Box style={{ margin: '10px 0px 10px 0px', fontWeight: 'bolder' }}>DATA UNDER PROCESSING...</Box>
                    {/* <Button variant="contained" fullWidth style={{ backgroundColor: "red", color: 'white' }} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button> */}
                </DialogContent>

            </Dialog>
        )
    }

    const loading =  useMemo(() => loadings(), [open])



    const action=(data)=>{
        setOpen(data)

    }


    return { loading,action }


}