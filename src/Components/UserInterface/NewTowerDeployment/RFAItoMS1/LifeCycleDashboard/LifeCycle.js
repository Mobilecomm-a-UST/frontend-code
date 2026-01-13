import React, { useCallback, useEffect, useState } from 'react'
import { Breadcrumbs, Button, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { json, useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ShowMilestone from './ShowMilestone';
import { getDecreyptedData } from "../../../../utils/localstorage";
import { ServerURL } from '../../../../services/FetchNodeServices';
import { useLoadingDialog } from '../../../../Hooks/LoadingDialog';
import { useStyles } from '../../../ToolsCss'
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import Swal from "sweetalert2";


const issue = ['MW', 'PRI', 'Fiber', 'Material']
const CircleList = ['AP', 'ASM', 'BIH', 'CHN', 'DEL', 'HRY', 'JK', 'JRK', 'KK', 'KOL', 'MAH', 'MP', 'MUM', 'NE', 'ORI', 'PUN', 'RAJ', 'ROTN', 'UPE', 'UPW', 'WB']

const LifeCycle = () => {
    const classes = useStyles()
    const navigate = useNavigate()
    const userID = getDecreyptedData("userID")
    const [siteId, setSiteId] = useState('')
    const [selectCircle, setSelectCircle] = useState('')
    const [milestoneData, setMilestoneData] = useState([])
    const [milestoneSelectName, setMilestoneSelectName] = useState('')
    const [tableForm, setTableForm] = useState({})
    const [issueTable, setIssueTable] = useState([])
    const [issueCount, setIssueCount] = useState([])
    const [tempIssueTableData, setTempIssueTableData] = useState()
    const [open, setOpen] = useState(false)
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    const { action, loading } = useLoadingDialog();
    console.log('issue table', milestoneData)



    const handleSubmitSite = async (e) => {
        e.preventDefault()
        action(true)
        try {

            const formData = new FormData();
            formData.append('siteId', siteId);
            formData.append('userId', userID);
            formData.append('circle', selectCircle);
            const response = await axios.post
                (`${ServerURL}/alok_tracker/lifecycle_display/`, formData, {
                    headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
                });

            action(false)
            setMilestoneData(JSON.parse(response?.data?.json_data))
            setIssueCount(response?.data?.issue_counts)
            setMilestoneSelectName('')
            setIssueTable([])
            Swal.fire({
                icon: "success",
                title: "Done",
                text: `This Site-ID Found in database`,
            });


        } catch (error) {
            action(false)
            setMilestoneSelectName('')
            setIssueTable([])
            setMilestoneData([])
            setIssueCount([])
            Swal.fire({
                icon: "error",
                title: "Error",
                text: ` ${error.response?.data?.error || error.message}`,
            });
        }
    }

    const refetchlifecycleData = async () => {
        try {

            const formData = new FormData();
            formData.append('siteId', siteId);
            formData.append('userId', userID);
            formData.append('circle', selectCircle);
            const response = await axios.post
                (`${ServerURL}/alok_tracker/lifecycle_display/`, formData, {
                    headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
                });

            action(false)
            // console.log('site id responce ', response2)
            // setIssueTable(JSON.parse(response2?.data?.json_data))
            setMilestoneData(JSON.parse(response?.data?.json_data))
            setIssueCount(response?.data?.issue_counts)
            Swal.fire({
                icon: "success",
                title: "Done",
                text: `This Site-ID Found in database`,
            });


        } catch (error) {
            action(false)
            console.log('aaaaa', error)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: ` ${error.response?.data?.error || error.message}`,
            });
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTableForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeListDialog = (e) => {
        const { name, value } = e.target;
        setTempIssueTableData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleTableIssueSubmit = async (e) => {
        e.preventDefault()
        action(true)
        try {

            const formData = new FormData();
            formData.append('siteId', siteId);
            formData.append('userId', userID);
            formData.append('issue', tableForm?.issue);
            formData.append('start_date', tableForm?.start_date);
            formData.append('close_date', tableForm?.close_date);
            formData.append('owner', tableForm?.owner);
            formData.append('remarks', tableForm?.remarks || "");
            formData.append('milestone', milestoneSelectName);
            formData.append('circle', milestoneData?.[0]?.circle || "");
            // formData.append('timeline', JSON.stringify(issueTable));
            const response = await axios.post
                (`${ServerURL}/alok_tracker/issue_timeline_add/`, formData, {
                    headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
                });

            if (response.status) {
                // console.log('add list data responce ', response)
                action(false)
                refetchMilestoneAfterEdit();
                refetchlifecycleData();
                // setMilestoneData(JSON.parse(response?.data?.json_data SER))
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `Issue Added Succesfully !`,
                });
                // navigate('/tools/relocation_tracking/rfai_to_ms1_waterfall/')
            }
            // console.log('update response', response);


        } catch (error) {
            // console.log('aaaaa', error)
            action(false)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: ` ${error.response?.data?.error || error.message}`,
            });
        }

    }

    const issueListUpdateApi = async () => {
        action(true)
        try {
            const formData = new FormData();
            formData.append('id', tempIssueTableData?.id);
            formData.append('userId', userID);
            formData.append('circle', tempIssueTableData?.Circle);
            formData.append('milestone', tempIssueTableData?.Milestone);
            formData.append('issue', tempIssueTableData?.['Issue Name'] || "");
            formData.append('start_date', dateFormateChange(tempIssueTableData?.['Start Date']));
            formData.append('close_date', dateFormateChange(tempIssueTableData?.['Close Date']));
            formData.append('remarks', tempIssueTableData?.['remarks'] || "");
            formData.append('owner', tempIssueTableData?.['Issue Owner'] || "");

            const response = await axios.post(
                `${ServerURL}/alok_tracker/issue_timeline_update/`,
                formData,
                {
                    headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
                }
            );


            if (response.status) {
                setOpen(false);
                action(false)
                setTempIssueTableData()
                refetchMilestoneAfterEdit();
                refetchlifecycleData();

                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `Issue Date Updated Successfully!`,
                });
            }

        } catch (error) {
            setOpen(false);
            action(false)
            setTempIssueTableData()

            Swal.fire({
                icon: "error",
                title: "Error",
                text: `${error.response?.data?.error || error.message}`,
            });
        }
    };

    const editDataUpdate = async (e) => {
        e.preventDefault();
        issueListUpdateApi();
    };

    const handleEditList = (list) => {
        setTempIssueTableData(list)
        setOpen(true)
    }

    const dateFormateChange = (dateStr) => {
        if (!dateStr || dateStr === "nan") return "";

        // CASE 1: Already in YYYY-MM-DD → return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
        }

        // CASE 2: Format like 28-Nov-25 → convert
        if (/^\d{1,2}-[A-Za-z]{3}-\d{2}$/.test(dateStr)) {
            const [day, mon, year] = dateStr.split('-');

            const months = {
                Jan: "01", Feb: "02", Mar: "03", Apr: "04",
                May: "05", Jun: "06", Jul: "07", Aug: "08",
                Sep: "09", Oct: "10", Nov: "11", Dec: "12"
            };

            // Convert YY → YYYY
            const fullYear = Number(year) < 50 ? "20" + year : "19" + year;

            return `${fullYear}-${months[mon]}-${day.padStart(2, "0")}`;
        }

        // CASE 3: Unknown format → return as is to avoid breaking data
        return dateStr;
    };

    const handleDialogBox = () => {
        return (<Dialog
            open={open}
            keepMounted
            fullWidth
            maxWidth={'lg'}
        >
            <DialogTitle>
                Edit Site Issue Logs
                <span style={{ float: 'right' }}><IconButton aria-label="close" onClick={() => setOpen(false)}><CloseIcon /> </IconButton></span>
            </DialogTitle>
            <DialogContent dividers={'paper'}>
                <form onSubmit={editDataUpdate}>
                    <Box
                        sx={{
                            width: "100%",
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                            <InputLabel id="owner-label">Owner</InputLabel>
                            <Select
                                labelId="owner-label"
                                name="Issue Owner"
                                value={tempIssueTableData?.['Issue Owner'] || ""}
                                label="Owner"
                                onChange={handleChangeListDialog}
                                disabled
                            >
                                {['Airtel', 'Mobilecomm'].map((item, index) => (
                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                            <InputLabel id="issue-label">Issue</InputLabel>
                            <Select
                                labelId="issue-label"
                                name="Issue Name"
                                value={tempIssueTableData?.['Issue Name'] || ""}
                                label="Issue"
                                onChange={handleChangeListDialog}
                                disabled
                            >
                                {issue.map((item, index) => (
                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                            <TextField
                                variant="outlined"
                                label="Start Date"
                                name="Start Date"
                                value={dateFormateChange(tempIssueTableData?.['Start Date']) || ''}
                                onChange={handleChangeListDialog}
                                required
                                type="date"
                                size="small"
                                inputProps={{
                                    max: new Date().toISOString().split("T")[0],
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormControl>

                        <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                            <TextField
                                variant="outlined"
                                label="Close Date"
                                name="Close Date"
                                value={dateFormateChange(tempIssueTableData?.['Close Date']) || ''}
                                onChange={handleChangeListDialog}
                                type="date"
                                size="small"
                                inputProps={{
                                    max: new Date().toISOString().split("T")[0],
                                    min: dateFormateChange(tempIssueTableData?.['Start Date']) || ''
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormControl>
                        <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                            <TextField
                                variant="outlined"
                                label="Remarks"
                                name="remarks"
                                value={tempIssueTableData?.['remarks'] || ''}
                                onChange={handleChangeListDialog}
                                type="text"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormControl>

                        <Button variant="contained" type="submit" startIcon={<UpgradeIcon />}>
                            update
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>)
    }

    const handleMilestones = async (milestoneName) => {
        setMilestoneSelectName(milestoneName);

        try {
            action(true); // start loader

            const formData = new FormData();
            formData.append("siteId", siteId);
            formData.append("userId", userID);
            formData.append("circle", milestoneData?.[0]?.circle ?? "");
            formData.append("milestone", milestoneName);

            const response = await axios.post(
                `${ServerURL}/alok_tracker/issue_timeline_display/`,
                formData,
                {
                    headers: {
                        Authorization: `token ${getDecreyptedData("tokenKey")}`,
                    },
                }
            );

            const parsedData = response?.data?.json_data
                ? response.data.json_data
                : [];

            setIssueTable(parsedData);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.error || error.message,
            });
        } finally {
            action(false); // stop loader (always)
        }
    };

    const refetchMilestoneAfterEdit = async () => {
        try {
            const formData = new FormData();
            formData.append("siteId", siteId);
            formData.append("userId", userID);
            formData.append("circle", milestoneData?.[0]?.circle ?? "");
            formData.append("milestone", milestoneSelectName);

            const response = await axios.post(
                `${ServerURL}/alok_tracker/issue_timeline_display/`,
                formData,
                {
                    headers: {
                        Authorization: `token ${getDecreyptedData("tokenKey")}`,
                    },
                }
            );

            const parsedData = response?.data?.json_data
                ? response.data.json_data
                : [];

            setIssueTable(parsedData);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.error || error.message,
            });
        } finally {
            action(false); // stop loader (always)
        }
    }
    const handleDeleteIssue = async (issueId) => {
        action(true);
        try {
            const formData = new FormData();
            formData.append("id", issueId);
            formData.append("userId", userID);
            formData.append("circle", selectCircle);

            const response = await axios.post(
                `${ServerURL}/alok_tracker/issue_timeline_delete/`,
                formData,
                {
                    headers: {
                        Authorization: `token ${getDecreyptedData("tokenKey")}`,
                    },
                }
            );

            action(false);

            refetchMilestoneAfterEdit();
            refetchlifecycleData();

            Swal.fire({
                icon: "success",
                title: "Deleted",
                text: response?.data?.message || "Issue deleted successfully",
            });
        } catch (error) {
            action(false);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.error || error.message,
            });
        }
    };


    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/relocation_tracking') }}>Relocation Tracking</Link>
                    <Typography color='text.primary'>Site Lifecycle</Typography>
                </Breadcrumbs>
            </div>
            <div style={{ height: 'auto', width: '99%', margin: '5px 5px', padding: '2px', border: '0px solid black', borderRadius: '10px', padding: '2px', display: 'flex' }}>
                <Grid container spacing={1}>
                    <Grid item xs={10} style={{ display: "flex" }}>
                        <Box >
                            <form onSubmit={handleSubmitSite} style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                                <TextField size='small' placeholder='Enter Site ID' label="Site ID" required value={siteId} onChange={(e) => setSiteId(e.target.value)} />
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel id="issue-label">Circle</InputLabel>
                                    <Select
                                        labelId="issue-label"
                                        value={selectCircle}
                                        onChange={(e) => setSelectCircle(e.target.value)}
                                        label="Circle"
                                        required
                                    >
                                        {CircleList.map((item, index) => (
                                            <MenuItem key={index} value={item}>{item}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button type='submit' sx={{ backgroundColor: '#006e74' }} variant='contained'>search site</Button>
                            </form>
                        </Box>

                    </Grid>
                    <Grid item xs={2} >
                        {/* <Box style={{ float: 'right' }}>
                            <Tooltip title="Export Dashboard">
                                <IconButton onClick={() => { handleExport(); }}>
                                    <DownloadIcon fontSize='medium' color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Box> */}
                    </Grid>
                </Grid>

            </div>
            {milestoneData.length > 0 ? <Box>
                <Grid container spacing={1} sx={{ width: '99%', margin: '5px 5px' }}>
                    <Grid item xs={3} sx={{}}>
                        <Box sx={{
                            maxHeight: '77vh',
                            minBlockSize: '77vh',
                            overflow: 'auto',
                            padding: 2,
                            //    border: '1px solid black',
                            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                            borderRadius: 5,
                            backgroundColor: 'white'
                        }}>
                            <ShowMilestone mileston={milestoneData} onMilestoneClick={handleMilestones} issueCount={issueCount} getMilestone={milestoneSelectName} />
                        </Box>
                    </Grid>
                    <Grid item xs={9} >
                        <Box
                            sx={{
                                maxHeight: '77vh',
                                minHeight: '77vh',
                                overflow: 'auto',
                                padding: 1,
                                // border: '1px solid black',
                                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                                borderRadius: 5,
                                backgroundColor: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}
                        >
                            <Box sx={{ fontWeight: 'bold', fontSize: '25px', color: 'black', mb: 2 }}>
                                {milestoneSelectName} ISSUE TRACKER
                            </Box>
                            {/* Add issue in one milestone */}
                            {milestoneSelectName ? <Box sx={{
                                width: "100%",
                                //  border: '1px solid black',
                                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                                borderRadius: '10px',
                                padding: '8px'
                            }}>
                                <form onSubmit={handleTableIssueSubmit}>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: 1
                                        }}
                                    >
                                        <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                                            <InputLabel id="issue-label">Owner</InputLabel>
                                            <Select
                                                labelId="issue-label"
                                                name="owner"
                                                value={tableForm?.owner || ""}
                                                label="Owner"
                                                onChange={handleChange}
                                                required
                                            >
                                                {['Airtel', 'Mobilecomm'].map((item, index) => (
                                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                                            <InputLabel id="issue-label">Issue</InputLabel>
                                            <Select
                                                labelId="issue-label"
                                                name="issue"
                                                value={tableForm?.issue || ""}
                                                label="Issue"
                                                onChange={handleChange}
                                                required
                                            >
                                                {issue.map((item, index) => (
                                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                                            <TextField
                                                variant="outlined"
                                                label="Start Date"
                                                name="start_date"
                                                value={tableForm?.start_date || ''}
                                                onChange={handleChange}
                                                type="date"
                                                size="small"
                                                required
                                                InputLabelProps={{ shrink: true }}
                                                inputProps={{
                                                    max: new Date().toISOString().split("T")[0],
                                                }}
                                            />
                                        </FormControl>

                                        <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                                            <TextField
                                                variant="outlined"
                                                label="Close Date"
                                                name="close_date"
                                                value={tableForm?.close_date || ''}
                                                onChange={handleChange}
                                                type="date"
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                                inputProps={{
                                                    max: new Date().toISOString().split("T")[0],
                                                    min: tableForm?.start_date || ''
                                                }}
                                            />
                                        </FormControl>
                                         <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                                            <TextField
                                                variant="outlined"
                                                label="Remarks"
                                                name="remarks"
                                                value={tableForm?.remarks || ''}
                                                onChange={handleChange}
                                                type="text"
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </FormControl>

                                        <Button variant="contained" sx={{ backgroundColor: '#006e74' }} type="submit" startIcon={<ControlPointIcon />}>
                                            Add
                                        </Button>
                                    </Box>
                                </form>
                            </Box> : <></>}

                            <Divider />
                            {Array.isArray(issueTable) && issueTable.length > 0 && (<div style={{ width: '100%' }}>

                                {/* ************* 2G  TABLE DATA ************** */}
                                <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                                    <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                                        Site Issue Logs
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>

                                    </Box>
                                </Box>

                                <Box sx={{ width: '100%' }}>
                                    <TableContainer sx={{ maxHeight: '58vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#006e74' }}>
                                                        Issue Name
                                                    </th>
                                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                                        Start Date
                                                    </th>
                                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                                        Close Date
                                                    </th>
                                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                                        Duration Days
                                                    </th>
                                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                                        Remarks
                                                    </th>
                                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                                        Issue Owner
                                                    </th>
                                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                                        Action
                                                    </th>


                                                </tr>
                                            </thead>
                                            <tbody>
                                                {issueTable?.map((it, index) => {
                                                    return (
                                                        <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                                            <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#CBCBCB', color: 'black' }}>{it['Issue Name']}</th>
                                                            <th style={{ color: 'black' }}>{it['Start Date']}</th>
                                                            <th style={{ color: 'black' }}>{it['Close Date']}</th>
                                                            <th style={{ color: 'black' }}>{it['Duration']}</th>
                                                            <th style={{ color: 'black' }}>{it['remarks']}</th>
                                                            <th style={{ color: 'black' }}>{it['Issue Owner']}</th>
                                                            <th style={{ color: 'black' }}>
                                                                {it.Status == 'Closed' ? <IconButton >
                                                                    <BlockIcon size='small' color='error' />
                                                                </IconButton> : <IconButton onClick={() => handleEditList(it)}>
                                                                    <EditIcon size='small' color='primary' />
                                                                </IconButton>}
                                                                {userTypes?.includes('RLT_Admin') && <IconButton onClick={() => handleDeleteIssue(it.id)}>
                                                                    <DeleteIcon size='small' color='error' />
                                                                </IconButton>}

                                                            </th>
                                                        </tr>
                                                    )
                                                }
                                                )}
                                            </tbody>
                                        </table>
                                    </TableContainer>
                                </Box>
                            </div>)}


                        </Box>

                    </Grid>
                </Grid>
            </Box> : <></>}



            {open && handleDialogBox()}
            {loading}
        </>
    )
}

export default LifeCycle