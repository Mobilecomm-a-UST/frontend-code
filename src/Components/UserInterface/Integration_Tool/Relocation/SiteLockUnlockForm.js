import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { useStyles } from '../../ToolsCss';
import { postData, getData } from '../../../services/FetchNodeServices';
import Swal from 'sweetalert2';
import { Box, Grid, TextField, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { useCallback } from 'react';


const CircleWiseData = [
    {
        "id": 1,
        "circle": "AP",
        "approver_name": [
            "Sai Teja",
            "Remesh Thota",
            "Krishna Khant Verma",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 2,
        "circle": "JRK",
        "approver_name": [
            "Avnish Mishra",
            "OM",
            "Vidya",
            "Sonu Sharma",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 3,
        "circle": "BIH",
        "approver_name": [
            "Sonu Singh",
            "Deepak",
            "Sonu Sharma",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 4,
        "circle": "CH",
        "approver_name": [
            "Bharateeshwaran",
            "Prakashpandi",
            "Shubham Gupta",
            "Nilesh Jain",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 5,
        "circle": "DL",
        "approver_name": [
            "Nishant Sharma",
            "Rajesh Gupta",
            "Krishna Kant Verma",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 6,
        "circle": "HR",
        "approver_name": [
            "Manoj Kumar [ZTE]",
            "Shivam Pandey [Ericsson]",
            "Aman",
            "Tarun Rakecha",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 8,
        "circle": "ROTN",
        "approver_name": [
            "Bharateeshwaran",
            "Prakashpandi",
            "Shubham Gupta",
            "Nilesh Jain",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 9,
        "circle": "PB",
        "approver_name": [
            "Manoj Kumar [ZTE]",
            "Himanshu Lokhande [Samsung]",
            "Aman",
            "Tarun Rakecha",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 10,
        "circle": "RAJ",
        "approver_name": [
            "Rahul Charak",
            "Hemant Sharma",
            "Krishna Kant Verma",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 11,
        "circle": "UPW",
        "approver_name": [
            "Rajan Agrawal",
            "Praval Joshi",
            "Shubham Gupta",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 12,
        "circle": "UPE",
        "approver_name": [
            "Rakesh Dubey",
            "Onkar Soni",
            "Manish Singh",
            "Nilesh Jain",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 13,
        "circle": "JK",
        "approver_name": [
            "Rohit Bansal",
            "Manik Mahajan",
            "Krishna Kant Verma",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 14,
        "circle": "ROB",
        "approver_name": [
            "Masud Rana",
            "Pankaj",
            "Sonu Sharma",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 15,
        "circle": "KK",
        "approver_name": [
            "Khadir Valli",
            "Shubham Gupta",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 16,
        "circle": "OR",
        "approver_name": [
            "Manish Chobisa",
            "Jayadeba",
            "Sonu Sharma",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 17,
        "circle": "MUM",
        "approver_name": [
            "Bharat Kamble",
            "Sai Raj",
            "Aman Kashyap",
            "Nilesh Jain",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 18,
        "circle": "KOL",
        "approver_name": [
            "Masud Rana",
            "Pankaj",
            "Sonu Sharma",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 19,
        "circle": "MP",
        "approver_name": [
            "Shashikant Jaiswal",
            "Amit Sharma",
            "Nilesh Jain",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 20,
        "circle": "WB",
        "approver_name": [
            "Manish Chobisa",
            "Jayadeba",
            "Sonu Sharma",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 21,
        "circle": "ORI",
        "approver_name": [
            "Masud Rana",
            "Pankaj",
            "Sonu Sharma",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 22,
        "circle": "CHN",
        "approver_name": [
            "Bharateeshwaran",
            "Prakashpandi",
            "Shubham Gupta",
            "Nilesh Jain",
            "Saurabh Rathore"
        ]
    },
    {
        "id": 23,
        "circle": "PUN",
        "approver_name": [
            "Manoj Kumar [ZTE]",
            "Himanshu Lokhande [Samsung]",
            "Aman",
            "Tarun Rakecha",
            "Saurabh Rathore"
        ]
    }
    ,
    {
        "id": 24,
        "circle": "DEL",
        "approver_name": [
            "Nishant Sharma",
            "Rajesh Gupta",
            "Krishna Kant Verma",
            "Saurabh Rathore"
        ]
    } ,
    {
        "id": 25,
        "circle": "HRY",
        "approver_name": [
            "Manoj Kumar [ZTE]",
            "Shivam Pandey [Ericsson]",
            "Aman",
            "Tarun Rakecha",
            "Saurabh Rathore"
        ]
    }
]
const TechnologyList = ["L900", "L1800", "L2100", "G900", "G1800", "G2100", "2G", "5G", "RET"]

const SiteLockUnlockForm = ({ data, open, handleClose, updateTableData }) => {
    const classes = useStyles();
    const { loading, action } = useLoadingDialog();
    const [tableData, setTableData] = useState([]);
    const [approvedBy, setApprovedBy] = useState('');
    const [approvedByValue, setApprovedByValue] = useState([]);
    const [purpuse, setPurpose] = useState('');
    const [status, setStatus] = useState('');
    const [technology, setTechnology] = useState([]);
    const userName = JSON.parse(localStorage.getItem("userID"))
    // console.log('data of form', data, open)



    const fetchData =  useCallback(async () => {
        action(true)
        let formData = new FormData()
        formData.append('Relocation_id', data?.id)
        let responce = await postData(`IntegrationTracker/${data.getApi}/`, formData);


        if (responce) {
            action(false)
            setTableData(responce?.data)
        } else {
            action(false)
            // handleClose();
        }
        // console.log('responce', responce)
    },[])


    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        let formData = new FormData()
        formData.append('Relocation_id', data?.id)
        formData.append('circle', data?.circle)
        formData.append('OEM', data?.oem)
        formData.append('Technology', technology.join("+"))
        formData.append('no_of_BBUs', data?.noofbbu)
        formData.append('approval_given_by', approvedBy)
        formData.append('purpose', purpuse)
        formData.append('status', status)
        formData.append('site_locked_by', userName?.split('@')[0].replace('.', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
        let responce = await postData(`IntegrationTracker/${data?.postApi}/`, formData);
        if (responce) {
            action(false)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Data Added Successfully',
                showConfirmButton: false,
                timer: 1500
            })
            // handleClose()

            fetchData()
            updateTableData()
        }

    }

    const handleChangeTachnology = useCallback((event) => {
        const {
            target: { value },
        } = event;
        setTechnology(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    },[])



    useEffect(() => {

        fetchData()
        let response1 = CircleWiseData?.filter((item) => item.circle === data?.circle);
        {response1?.length > 0 && setApprovedByValue(response1[0]['approver_name'])}
        // setApprovedByValue(response1[0]['approver_name'] || "")
    }, [fetchData]);
    return (
        <>
            <Dialog
                open={open}
                // onClose={handleClose}
                keepMounted
                fullWidth
                maxWidth={'lg'}
                style={{ zIndex: 10, marginTop: '10px' }}
            >
                <DialogTitle style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{data?.hading}
                    <span style={{ float: 'right' }}><IconButton size="large" color="error" onClick={handleClose}><CloseIcon /></IconButton></span>
                </DialogTitle>
                <DialogContent dividers>
                    <Box>
                        <Box style={{ padding: '10px', marginBottom: '10px', border: '1px solid black', borderRadius: '10px' }}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <Grid item xs={3}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Circle"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            value={data?.circle}
                                            size='small'
                                            inputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            id="outlined-basic"
                                            label="OEM"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            value={data?.oem}
                                            size='small'
                                            inputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            id="outlined-basic"
                                            label="No. Of BBUs"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            value={data?.noofbbu}
                                            size='small'
                                            inputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        {/* <TextField
                                        id="outlined-basic"
                                        label="Technology"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        value={technology}
                                        onChange={(e) => setTechnology(e.target.value)}
                                        size='small'
                                        // inputProps={{ readOnly: true }}
                                    /> */}
                                        <FormControl fullWidth required>
                                            <InputLabel >Technology</InputLabel>
                                            <Select 
                                                label="Technology"
                                                value={technology}
                                                onChange={handleChangeTachnology}
                                                size='small'
                                                multiple
                                                fullWidth
                                                renderValue={(selected) => selected.join(', ')}
                                            // MenuProps={MenuProps}
                                            >

                                                {TechnologyList?.map((name) => (
                                                    <MenuItem key={name} value={name}>
                                                        <Checkbox checked={technology.includes(name)} />
                                                        <ListItemText primary={name} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Site Locked By"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            value={userName?.split('@')[0].replace('.', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                            size='small'
                                            inputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        {/* <TextField
                                        id="outlined-basic"
                                        label="Purpose"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        value={purpuse}
                                        onChange={(e) => setPurpose(e.target.value)}
                                        size='small'
                                    /> */}
                                        <FormControl fullWidth required>
                                            <InputLabel >Purpose</InputLabel>
                                            <Select
                                                value={purpuse}
                                                label="Purpose"
                                                onChange={(e) => { setPurpose(e.target.value); { e.target.value === 'EMF' ? setApprovedBy('No Need To Approve') : setApprovedBy('') } }}
                                                size='small'
                                                fullWidth
                                            >
                                                <MenuItem value='EMF'>EMF</MenuItem>
                                                <MenuItem value='SCFT'>SCFT</MenuItem>
                                                <MenuItem value='MS1'>MS1</MenuItem>
                                                <MenuItem value='Others'>Others</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3}>
                                        {/* <TextField
                                        id="outlined-basic"
                                        label="Approval Given By"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        value={approvedBy}
                                        onChange={(e) => setApprovedBy(e.target.value)}
                                        size='small'
                                    /> */}
                                        <FormControl fullWidth required>
                                            <InputLabel >Approval Given By</InputLabel>
                                            <Select
                                                value={approvedBy}
                                                label="Approval Given By"
                                                onChange={(e) => setApprovedBy(e.target.value)}
                                                size='small'
                                                fullWidth
                                            >
                                                <MenuItem value='No Need To Approve'>No Need To Approve</MenuItem>
                                                {approvedByValue?.map((item, index) => (
                                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <FormControl fullWidth required>
                                            <InputLabel >Status</InputLabel>
                                            <Select
                                                value={status}
                                                label="Status"
                                                onChange={(e) => setStatus(e.target.value)}
                                                size='small'
                                                fullWidth
                                            >
                                                <MenuItem value='Locked'>Locked</MenuItem>
                                                <MenuItem value='Unlocked'>Unlocked</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3} textAlign={'center'}>
                                        <Button size='small' fullWidth type='submit' variant="contained" >Add</Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Box>
                        <TableContainer sx={{ maxHeight: '80vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper} >
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 14, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Sr. No.</th>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Circle</th>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>OEM</th>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Technology</th>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>No. of BBUs</th>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Created At</th>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Site Locked By</th>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Approval Given By</th>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Purpose</th>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.map((item, index) => (
                                        <tr style={{ textAlign: "center", border: '1px solid black', fontWeigth: 700 }} key={index + item?.created_at} >
                                            <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{index + 1}</th>
                                            <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item?.circle}</th>
                                            <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item?.OEM}</th>
                                            <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item?.Technology}</th>
                                            <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item?.no_of_BBUs}</th>
                                            <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item?.created_at}</th>
                                            <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item?.site_locked_by}</th>
                                            <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item?.approval_given_by}</th>
                                            <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item?.purpose}</th>
                                            <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item?.status}</th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </TableContainer>
                    </Box>
                </DialogContent>
            </Dialog>
            {loading}
        </>
    )
}

export default React.memo(SiteLockUnlockForm)