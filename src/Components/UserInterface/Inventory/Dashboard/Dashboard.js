import React, { useState } from 'react'
import { useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Box, Grid, Stack, Button } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import DownloadIcon from '@mui/icons-material/Download';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getData, postData } from '../../../services/FetchNodeServices'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import TextField from '@mui/material/TextField';
import OverAllCss from "../../../csss/OverAllCss"
import Slide from '@mui/material/Slide';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { useForm } from 'react-hook-form';
import * as ExcelJS from 'exceljs'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Dashboard = () => {
    const [oEM, setOEM] = useState('')
    const [oemData, setOemData] = useState([])
    const [oemArr, setOemArr] = useState([])
    const [hardware, setHardware] = useState('')
    const [hardwareData, setHardwareData] = useState([])
    const [hardwareArr, setHardwareArr] = useState([])
    const [equipment, setEquipment] = useState('')
    const [supported, setSupported] = useState('')
    const [technologySup, setTechnologySup] = useState('')
    const [technicalDes, setTechnicalDes] = useState('')
    const [capacity, setCapacity] = useState('')
    const [maxPower, setMaxPower] = useState('')
    const [remark, setRemark] = useState('')
    const [id, setId] = useState()
    const [open, setOpen] = useState(false)
    const [openList, setOpenList] = useState(false)
    const [allData, setAllData] = useState()
    const {register , handleSubmit, unregister , errors} = useForm()
    const [submitForm , setSubmitForm] = useState({OEMs: '', Hardware_Type: '', Equipment_Description: '', Supported_cards: '', Technology_Supported: '',Equipment_Description: '',Capacity: '',Max_Power: '' , Remarks: ''})
    const classes = OverAllCss();


    // console.log('qssscccvvv', submitForm)

    const fetchAllData = async () => {
        const response = await getData('equipmentInventory/equpment_inventory_data/')
        console.log(response)
        setAllData(response.data)
        fetch_Uniqui_OEM_Arr(response.data)
        fetch_Uniqui_HardWare_Arr(response.data)
    }

    const fetch_Uniqui_OEM_Arr = (data) => {
        var arr = [];

        data?.map((item) => {
            arr.push(item.OEM)
        })

        setOemArr([...new Set(arr)])

        // console.warn('OEM .........' , arr)
    }
    const fetch_Uniqui_HardWare_Arr = (data) => {
        var arr = [];

        data?.map((item) => {
            arr.push(item.Hardware_Type)
        })

        setHardwareArr([...new Set(arr)])
    }

    const handleEdit = (props) => {
        // console.log('edit', props)
        setOEM(props.OEM)
        setHardware(props.Hardware_Type)
        setEquipment(props.Equipment_description)
        setSupported(props.Supported_Cards)
        setTechnologySup(props.Technology_Supported)
        setTechnicalDes(props.Techninal_Description)
        setCapacity(props.Capacity)
        setMaxPower(props.MAX_POWER)
        setRemark(props.Remarks)
        setId(props.id)
        setOpen(true)
    }

    const handleDelete = async (props) => {
        const response = await postData(`equipmentInventory/delete_equipment_inventry/${props}`)
        // console.log(response)
        if (response.status === true) {

            Swal.fire({
                icon: "success",
                title: "Done",
                text: `${response.message}`,
            });
            fetchAllData();
        }
    }

    const handleUpdate = async () => {
        var formData = new FormData();
        formData.append("OEM", oEM);
        formData.append("Hardware_Type", hardware);
        formData.append("Equipment_description", equipment);
        formData.append("Supported_Cards", supported);
        formData.append("Technology_Supported", technologySup);
        formData.append("Techninal_Description", technicalDes);
        formData.append("Capacity", capacity);
        formData.append("MAX_POWER", maxPower);
        formData.append("Remarks", remark);
        const response = await postData(`equipmentInventory/update_equipment_inventry/${id}`, formData)
        console.log('update data', response)
        if (response.status === true) {
            setOpen(false)
            Swal.fire({
                icon: "success",
                title: "Done",
                text: `${response.message}`,
            });
            fetchAllData();
        }

    }

    const handleSubmits = async () => {
        var formData = new FormData();
        formData.append("OEM", oEM);
        formData.append("Hardware_Type", hardware);
        formData.append("Equipment_description", equipment);
        formData.append("Supported_Cards", supported);
        formData.append("Technology_Supported", technologySup);
        formData.append("Techninal_Description", technicalDes);
        formData.append("Capacity", capacity);
        formData.append("MAX_POWER", maxPower);
        formData.append("Remarks", remark);
        const response = await postData('equipmentInventory/create_equipment_inventry/', formData)
        console.log('response data', response)
        // sessionStorage.setItem('upload_soft_at_status', JSON.stringify(response.status_obj))

        if (response.status == true) {
            handleClear()
            setOpenList(false)
            Swal.fire({
                icon: "success",
                title: "Done",
                text: `DATA SUBMITED SUCCESSFULLY`,
            });
            fetchAllData();


        } else {
            handleClear()
            setOpenList(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${response.message}`,
            });
        }


    }

    const on_Submit=(data)=>{
        setSubmitForm(data)
         console.log('submited data :=>' , data)
    }


    // Export data in excel............................
    const handleExport = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Inventory ", { properties: { tabColor: { argb: 'f1948a' } } })

        sheet.columns = [
            { header: 'OEM', key: 'OEM', width: 10 },
            { header: 'Hardware Type', key: 'Hardware_Type', width: 15 },
            { header: 'Equipment Description', key: 'Equipment_description', width: 20 },
            { header: 'Supported Cards', key: 'Supported_Cards', width: 20 },
            { header: 'Technology Supported', key: 'Technology_Supported', width: 20 },
            { header: 'Technical Description', key: 'Techninal_Description', width: 20 },
            { header: 'Capacity', key: 'Capacity', width: 15 },
            { header: 'MAX POWER', key: 'MAX_POWER', width: 15 },
            { header: 'Remarks', key: 'Remarks', width: 15 }

        ]

        allData?.map(item => {
            sheet.addRow({
                OEM: item?.OEM,
                Hardware_Type: item?.Hardware_Type,
                Equipment_description: item?.Equipment_description,
                Supported_Cards: item?.Supported_Cards,
                Technology_Supported: item?.Technology_Supported,
                Techninal_Description: item?.Techninal_Description,
                Capacity: item?.Capacity,
                MAX_POWER: item?.MAX_POWER,
                Remarks: item?.Remarks
            })
        })

        sheet.eachRow((row, rowNumber) => {
            const rows = sheet.getColumn(1);
            const rowsCount = rows['_worksheet']['_rows'].length;
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
                //   if (rowNumber === rowsCount) {
                //     cell.fill = {
                //       type: 'pattern',
                //       pattern: 'solid',
                //       fgColor: { argb: 'FE9209' }
                //     }
                //     cell.font = {
                //       color: { argb: 'FFFFFF' },
                //       bold: true,
                //       size: 13,
                //     }
                //   }
                if (rowNumber == 1) {
                    // First set the background of header row
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '223354' }
                    }
                    cell.font = {
                        color: { argb: 'FFFFFF' },
                        bold: true,
                        size: 13,
                    }
                    cell.views = [{ state: 'frozen', ySplit: 1 }]
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
            anchor.download = "inventory.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })
    }

    const handleClose = () => {
        setOpen(false)
        setOpenList(false)
        handleClear();
        setSubmitForm({OEMs: '', Hardware_Type: '', Equipment_Description: '', Supported_cards: '', Technology_Supported: '',Equipment_Description: '',Capacity: '',Max_Power: '' , Remarks: ''});
        unregister("OEMs")
    }

    const handleClear = () => {
        setOEM('')
        setHardware('')
        setEquipment('')
        setSupported('')
        setTechnicalDes('')
        setTechnologySup('')
        setCapacity('')
        setMaxPower('')
        setRemark('')
    }

    // EDIT DILOG BOX ..........
    const handleDialBox = () => {
        return (
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                maxWidth={'md'}
            // style={{backgroundColor:'blue'}}

            >

                <Box className={classes.main_Box}>
                    <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                        <Box className={classes.Box_Hading} >
                            EDIT INVENTORY DATA
                        </Box>


                        <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                            <Box className={classes.Front_Box} >
                                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                    <div style={{ width: 350 }}>
                                        <TextField fullWidth size="small" value={oEM} required onChange={(e) => { setOEM(e.target.value) }} label="OEM" variant="outlined" />
                                    </div>
                                    <div style={{ width: 350 }}>
                                        <TextField fullWidth size="small" value={hardware} required onChange={(e) => { setHardware(e.target.value) }} label="Hardware Type" variant="outlined" />
                                    </div>
                                    <div style={{ width: 350 }}>
                                        <TextField fullWidth size="small" value={equipment} required onChange={(e) => { setEquipment(e.target.value) }} multiline label="Equipment Description" variant="outlined" />
                                    </div>
                                    <div style={{ width: 350 }}>
                                        <TextField fullWidth size="small" value={supported} required onChange={(e) => { setSupported(e.target.value) }} label="Supported cards" variant="outlined" />
                                    </div>
                                    <div style={{ width: 350 }}>
                                        <TextField fullWidth size="small" value={technologySup} required onChange={(e) => { setTechnologySup(e.target.value) }} label="Technology Supported" variant="outlined" />
                                    </div>
                                    <div style={{ width: 350 }}>
                                        <TextField fullWidth size="small" value={technicalDes} required onChange={(e) => { setTechnicalDes(e.target.value) }} multiline rows={3} label="Technical Description" variant="outlined" />
                                    </div>
                                    <div style={{ width: 350 }}>
                                        <TextField fullWidth size="small" value={capacity} required onChange={(e) => { setCapacity(e.target.value) }} label="Capacity" variant="outlined" />
                                    </div>
                                    <div style={{ width: 350 }}>
                                        <TextField fullWidth size="small" value={maxPower} required onChange={(e) => { setMaxPower(e.target.value) }} label="Max Power" variant="outlined" />
                                    </div>
                                    <div style={{ width: 350 }}>
                                        <TextField fullWidth size="small" value={remark} required onChange={(e) => { setRemark(e.target.value) }} multiline rows={3} label="Remarks" variant="outlined" />
                                    </div>
                                    <div></div>

                                </div>



                            </Box>
                        </Stack>
                        <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                            <Button variant="contained" color="success" endIcon={<UploadIcon />} onClick={handleUpdate}>update</Button>
                            <Button variant="contained" style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} onClick={handleClose}>cancel</Button>
                        </Stack>
                    </Box>
                </Box>

            </Dialog>
        )
    }

    // ADD LIST DIALOG BOX ...................
    const handleAddList = () => {
        return (
            <Dialog
                open={openList}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                maxWidth={'md'}
            >
                <Box className={classes.main_Box}>
                    <form  onSubmit={handleSubmit(on_Submit)}>
                        <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                            <Box className={classes.Box_Hading} >
                                ADD INVENTORY DATA
                            </Box>


                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                                <Box className={classes.Front_Box} >
                                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                        {/* <div style={{ width: 350 }}>
                                            <TextField fullWidth size="small" value={oEM} required onChange={(e) => { setOEM(e.target.value) }} name='OEM' label="OEM"  variant="outlined" />
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField fullWidth size="small" value={hardware} required onChange={(e) => { setHardware(e.target.value) }} name='Hardware_Type' label="Hardware Type"  variant="outlined" />
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField fullWidth size="small" value={equipment} required onChange={(e) => { setEquipment(e.target.value) }} multiline name='Equipment_Description' label="Equipment Description"  variant="outlined" />
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField fullWidth size="small" value={supported} required onChange={(e) => { setSupported(e.target.value) }} name='Supported_cards' label="Supported cards"  variant="outlined" />
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField fullWidth size="small" value={technologySup} required onChange={(e) => { setTechnologySup(e.target.value) }} name='Technology_Supported' label="Technology Supported"  variant="outlined" />
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField fullWidth size="small" value={technicalDes} required onChange={(e) => { setTechnicalDes(e.target.value) }} multiline rows={3} name='Technical_Description' label="Technical Description"  variant="outlined" />
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField fullWidth size="small" value={capacity} required onChange={(e) => { setCapacity(e.target.value) }} name='Capacity' label="Capacity"  variant="outlined" />
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField fullWidth size="small" value={maxPower} required onChange={(e) => { setMaxPower(e.target.value) }} name='Max_Power' label="Max Power"  variant="outlined" />
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField fullWidth size="small" value={remark} required onChange={(e) => { setRemark(e.target.value) }} multiline rows={3} name='Remarks' label="Remarks"  variant="outlined" />
                                        </div> */}

                                        <div style={{ width: 350 }}>
                                            <TextField required  fullWidth size="small"  name='OEM' label="OEM"  variant="outlined" {...register('OEMs', { required: true,onChange: (e) => console.log(e.target.value) })} />
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField required  fullWidth size="small"  name='Hardware_Type' label="Hardware Type"  variant="outlined" {...register('Hardware_Type', { required: true })} />
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField required  fullWidth size="small" multiline name='Equipment_Description' label="Equipment Description"  variant="outlined" {...register('Equipment_Description', { required: true })}/>
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField required  fullWidth size="small"  name='Supported_cards' label="Supported cards"  variant="outlined" {...register('Supported_cards', { required: true })}/>
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField required  fullWidth size="small"  name='Technology_Supported' label="Technology Supported"  variant="outlined" {...register('Technology_Supported', { required: true })}/>
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField required fullWidth size="small" multiline rows={3} name='Technical_Description' label="Technical Description"  variant="outlined" {...register('Technical_Description', { required: true })}/>
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField required  fullWidth size="small"  name='Capacity' label="Capacity"  variant="outlined" {...register('Capacity', { required: true })}/>
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField required  fullWidth size="small"  name='Max_Power' label="Max Power"  variant="outlined" {...register('Max_Power', { required: true })}/>
                                        </div>
                                        <div style={{ width: 350 }}>
                                            <TextField required  fullWidth size="small"  multiline rows={3} name='Remarks' label="Remarks"  variant="outlined" {...register('Remarks', { required: true })}/>
                                        </div>


                                    </div>



                                </Box>
                            </Stack>
                            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                            {/* onClick={handleSubmit} */}
                                <Button variant="contained" color="success" endIcon={<UploadIcon />} type='submit'>submit</Button>
                                <Button variant="contained" style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} onClick={handleClose}>cancel</Button>
                            </Stack>
                        </Box>
                        {/* <input type='text' placeholder='OEM' name='OEM' {...register('OEM', { required: true })}/>
                        <button type='submit' > Submit</button> */}
                    </form>
                </Box>

            </Dialog>
        )
    }



    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#223354',
            color: theme.palette.common.white,

        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));


    // ************* TABLE DATA **************
    const TableData = () => {

        // console.log('girraj singh')
        var arr = [];

        if (oemData.length > 0 && hardwareData.length > 0) {
            oemData?.map((items) => {
                hardwareData?.map((it) => {
                    arr.push(allData?.filter((item) => (item.OEM === items && item.Hardware_Type === it)));
                })

            })
        }
        else if (oemData.length > 0) {
            oemData?.map((items) => {
                arr.push(allData?.filter((item) => (item.OEM === items)));
            })
        }
        else if (hardwareData.length > 0) {
            hardwareData?.map((it) => {
                arr.push(allData?.filter((item) => (item.Hardware_Type === it)));
            })
        }
        else {
            return allData?.map((row) => {
                return (
                    <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row" style={{ position: "sticky", left: 0, background: "white", boxShadow: "5px 2px 5px grey", borderRight: "2px solid black" }}>
                            {row.OEM}
                        </StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Hardware_Type}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Equipment_description}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Supported_Cards}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Technology_Supported}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Techninal_Description}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Capacity}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.MAX_POWER}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Remarks}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>
                            <IconButton color="primary" onClick={() => { handleEdit(row) }}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => { handleDelete(row.id) }}>
                                <DeleteIcon />
                            </IconButton>
                        </StyledTableCell>
                    </StyledTableRow>
                )
            })
        }


        return arr?.map((x) => {
            return x?.map((row) => {
                return (
                    <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row" style={{ position: "sticky", left: 0, background: "white", boxShadow: "5px 2px 5px grey", borderRight: "2px solid black" }}>
                            {row.OEM}
                        </StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Hardware_Type}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Equipment_description}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Supported_Cards}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Technology_Supported}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Techninal_Description}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Capacity}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.MAX_POWER}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Remarks}</StyledTableCell>
                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>
                            <IconButton color="primary" onClick={() => { handleEdit(row) }}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => { handleDelete(row.id) }}>
                                <DeleteIcon />
                            </IconButton>
                        </StyledTableCell>
                    </StyledTableRow>
                )
            })
        })
    }


    // ########### Handle OEM table filter  ###########
    const handleOem = (event: SelectChangeEvent<typeof oemData>) => {
        const {
            target: { value },
        } = event;
        setOemData(
            typeof value === 'string' ? value.split(',') : value,
        );
    }


    // ########### Handle Hardware table filter  ###########
    const handleHardware = (event: SelectChangeEvent<typeof hardwareData>) => {
        const {
            target: { value },
        } = event;
        setHardwareData(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    useEffect(() => {
        fetchAllData();
        // useEffect(()=>{
            document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
        //   },[])
    }, [])
    return (
        <>
            <div style={{ margin: 10 }}>
                {/*__________________ FILTER BOX _______________*/}
                <div style={{ height: 'auto', width: '100%', margin: '5px 0px', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor: 'white', borderRadius: '10px', padding: '1px', display: 'flex' }}>
                    <Grid container spacing={1}>
                        <Grid item xs={10} style={{ display: "flex" }}>
                            <Box >
                                <Tooltip title="Add List" color='primary'>
                                    <IconButton onClick={() => { setOpenList(true) }} color='primary'>
                                        <PlaylistAddIcon fontSize='large' color='primary' />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Box style={{ float: 'right' }}>
                                <Tooltip title="Export Excel">
                                    <IconButton onClick={() => { handleExport() }}>
                                        <DownloadIcon fontSize='large' color='primary' />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    </Grid>

                </div>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: '80vh' }} >
                        <Table stickyHeader >
                            <TableHead style={{}}>
                                <TableRow>
                                    <StyledTableCell align="center" style={{ position: "sticky", left: 0, boxShadow: "5px 2px 5px grey", borderRight: "1px solid black" }}>
                                        OEM
                                        <Select
                                            multiple
                                            value={oemData}
                                            // onChange={(e)=>{setProject(e.target.value);tableData()}}
                                            onChange={handleOem}
                                            displayEmpty
                                            renderValue={(selected) => {
                                                if (selected.length === 0) {
                                                    return <em>All</em>;
                                                }
                                                // return selected.join(', ');
                                            }}
                                            style={{ float: 'right', color: 'black', border: '1px solid black', height: '25px', backgroundColor: 'white' }}>
                                            <MenuItem onClick={() => { setOemData([]) }}  >All</MenuItem>
                                            {oemArr.map((item, index) => (
                                                <MenuItem key={index} value={item}>
                                                    <Checkbox size='small' checked={oemData.indexOf(item) > -1} />
                                                    <ListItemText primary={item} />
                                                </MenuItem>
                                            ))}

                                        </Select>
                                    </StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: 150 }}>
                                        Hardware Type
                                        <Select
                                            multiple
                                            value={hardwareData}
                                            // onChange={(e)=>{setProject(e.target.value);tableData()}}
                                            onChange={handleHardware}
                                            displayEmpty
                                            renderValue={(selected) => {
                                                if (selected.length === 0) {
                                                    return <em>All</em>;
                                                }
                                                // return selected.join(', ');
                                            }}
                                            style={{ float: 'right', color: 'black', border: '1px solid black', height: '25px', backgroundColor: 'white' }}>
                                            <MenuItem onClick={() => { setHardwareData([]) }}  >All</MenuItem>
                                            {hardwareArr.map((item, index) => (
                                                <MenuItem key={index} value={item}>
                                                    <Checkbox size='small' checked={hardwareData.indexOf(item) > -1} />
                                                    <ListItemText primary={item} />
                                                </MenuItem>
                                            ))}

                                        </Select>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">Equipment Description</StyledTableCell>
                                    <StyledTableCell align="center">Supported cards</StyledTableCell>
                                    <StyledTableCell align="center">Technology Supported</StyledTableCell>
                                    <StyledTableCell align="center">Technical Description</StyledTableCell>
                                    <StyledTableCell align="center">Capacity</StyledTableCell>
                                    <StyledTableCell align="center">Max Power</StyledTableCell>
                                    <StyledTableCell align="center">Remarks</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* {allData?.map((row) => (
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell component="th" scope="row" style={{ position: "sticky", left: 0, background: "white", boxShadow: "5px 2px 5px grey", borderRight: "2px solid black" }}>
                                            {row.OEM}
                                        </StyledTableCell>
                                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Hardware_Type}</StyledTableCell>
                                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Equipment_description}</StyledTableCell>
                                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Supported_Cards}</StyledTableCell>
                                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Technology_Supported}</StyledTableCell>
                                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Techninal_Description}</StyledTableCell>
                                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Capacity}</StyledTableCell>
                                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.MAX_POWER}</StyledTableCell>
                                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.Remarks}</StyledTableCell>
                                        <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>
                                            <IconButton color="primary" onClick={() => { handleEdit(row) }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => { handleDelete(row.id) }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))} */}
                                {TableData()}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
            {handleDialBox()}
            {handleAddList()}
        </>
    )
}

export default Dashboard