import React, { useState, useCallback } from 'react'
import { useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Box, Grid, Button } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import DownloadIcon from '@mui/icons-material/Download';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getData, ServerURL, postData } from '../../../../services/FetchNodeServices';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useStyles } from '../../../ToolsCss';
import axios from 'axios';
import { getDecreyptedData } from '../../../../utils/localstorage';




const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#223354',
        color: theme.palette.common.white,
        whiteSpace: 'nowrap',
        width: theme.palette.common.auto,
        padding: 4,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        padding: 1,
        // height:20
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Thershold = ({ heading, API }) => {


  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    priority: '',
    threshold_aging_level_1: '',
    threshold_aging_level_2: '',
    threshold_aging_level_3: '',
    threshold_aging_level_4: '',
  })
  const [editDataId, setEditDataID] = useState()
  const [add, setAdd] = useState(false)
  const [edit, setEdit] = useState(false)
  const classes = useStyles();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const fetchData = async () => {
    const response = await getData(`${API}`);
    if (response) {
      setTableData(response)
    }
    console.log(response)
  }

  const handleEdit = (tabData) => {
    setFormData({
      priority: tabData.priority,
      threshold_aging_level_1: tabData.threshold_aging_level_1,
      threshold_aging_level_2: tabData.threshold_aging_level_2,
      threshold_aging_level_3: tabData.threshold_aging_level_3,
      threshold_aging_level_4: tabData.threshold_aging_level_4,
    })
    setEditDataID(tabData.id)
    setEdit(true)
  }


  const handleAddNewList = useCallback(() => {
    return (
      <Dialog
        open={add}
        TransitionComponent={Transition}
        keepMounted
        // onClose={handleClose}
        maxWidth={'md'}
        fullWidth={true}
      >
        <DialogTitle style={{ borderBottom: '1px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box style={{ display: 'flex', justifyContent: 'center', alignItem: 'center' }}><Box><AddIcon fontSize='medium' /></Box><Box>Add New Data</Box></Box>
          <Box >
            <Tooltip title="Cancel">
              <IconButton onClick={handleCloser}>
                <CloseIcon fontSize='medium' color='default' />
              </IconButton>
            </Tooltip>
          </Box>

        </DialogTitle>
        <DialogContent dividers={'paper'}>
          <form onSubmit={handleAddData} style={{ width: '100%', marginTop: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
{/* 
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  placeholder="Priority"
                  label="Piority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  size="small"
                  type='text'
                /> */}
                                            <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={formData.priority}
                                        label="Priority"
                                        name='priority'
                                        placeholder='Select Priority'
                                        onChange={handleChange}
                                    >
                                
                                        <MenuItem value={'P0'}>P0</MenuItem>
                                        <MenuItem value={'P1'}>P1</MenuItem>
                                        <MenuItem value={'P2'}>P2</MenuItem>
                               
                                    </Select>
                                </FormControl>
              </Grid>
              <Grid item xs={6}>

                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  placeholder="Threshold Aging L-1"
                  label="Threshold Aging L-1"
                  name="threshold_aging_level_1"
                  value={formData.threshold_aging_level_1}
                  onChange={handleChange}
                  size="small"
                  type='number'
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  placeholder="Threshold Aging L-2"
                  label="Threshold Aging L-2"
                  name="threshold_aging_level_2"
                  value={formData.threshold_aging_level_2}
                  onChange={handleChange}
                  size="small"
                  type='number'
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  placeholder="Threshold Aging L-3"
                  label="Threshold Aging L-3"
                  name="threshold_aging_level_3"
                  value={formData.threshold_aging_level_3}
                  onChange={handleChange}
                  size="small"
                  type='number'
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  placeholder="Threshold Aging L-4"
                  label="Threshold Aging L-4"
                  name="threshold_aging_level_4"
                  value={formData.threshold_aging_level_4}
                  onChange={handleChange}
                  size="small"
                  type='number'
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained">Add</Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    )
  }, [add, formData])

  const handleEditDialog = useCallback(() => {
    return (
      <Dialog
        open={edit}
        TransitionComponent={Transition}
        keepMounted
        // onClose={handleClose}
        maxWidth={'md'}
        fullWidth={true}
      >
        <DialogTitle style={{ borderBottom: '1px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box style={{ display: 'flex', justifyContent: 'center', alignItem: 'center' }}><Box><EditIcon fontSize='medium' /></Box><Box>EDIT KPI DATA</Box></Box>
          <Box >
            <Tooltip title="Cancel">
              <IconButton onClick={handleCloser}>
                <CloseIcon fontSize='medium' color='default' />
              </IconButton>
            </Tooltip>
          </Box>

        </DialogTitle>
        <DialogContent dividers={'paper'}>
          <form onSubmit={handleUpdateData} style={{ width: '100%', marginTop: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>

              <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={formData.priority}
                                        label="Priority"
                                        name='priority'
                                        placeholder='Select Priority'
                                        onChange={handleChange}
                                    >
                                
                                        <MenuItem value={'P0'}>P0</MenuItem>
                                        <MenuItem value={'P1'}>P1</MenuItem>
                                        <MenuItem value={'P2'}>P2</MenuItem>
                               
                                    </Select>
                                </FormControl>
              </Grid>
              <Grid item xs={6}>

                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  placeholder="Threshold Aging L-1"
                  label="Threshold Aging L-1"
                  name="threshold_aging_level_1"
                  value={formData.threshold_aging_level_1}
                  onChange={handleChange}
                  size="small"
                  type='number'
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  placeholder="Threshold Aging L-2"
                  label="Threshold Aging L-2"
                  name="threshold_aging_level_2"
                  value={formData.threshold_aging_level_2}
                  onChange={handleChange}
                  size="small"
                  type='number'
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  placeholder="Threshold Aging L-3"
                  label="Threshold Aging L-3"
                  name="threshold_aging_level_3"
                  value={formData.threshold_aging_level_3}
                  onChange={handleChange}
                  size="small"
                  type='number'
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  placeholder="Threshold Aging L-4"
                  label="Threshold Aging L-4"
                  name="threshold_aging_level_4"
                  value={formData.threshold_aging_level_4}
                  onChange={handleChange}
                  size="small"
                  type='number'
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained">Update</Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    )
  }, [edit, formData])

  const handleUpdateData = async (e) => {
    e.preventDefault()
    const response = await axios.put(`${ServerURL}/${API}${editDataId}/`, formData,
      {
        headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
      }
    );
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Done",
        text: `Data Updated Successfully`,
      });
      setEdit(false)
      handleCloser()
      // refetch();
      fetchData()
    }
    else {
      setEdit(false)
      handleCloser()
      // refetch();
      fetchData()

    }
  }

  const handleAddData = async (e) => {
    e.preventDefault()

    const responce = await postData(`${API}`, formData)
    if (responce) {
      Swal.fire({
        icon: "success",
        title: "Done",
        text: `Data Added Successfully`,
      });
      handleCloser()
      fetchData()

    }
  }

  const handleDelete = async (id) => {
    try {
      // Make the DELETE request
      const response = await axios.delete(`${ServerURL}/${API}${id}/`,
        {
          headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
        }
      );
      // console.log('Deleted successfully:', response);

      if (response.status === 204) {
        Swal.fire({
          icon: "success",
          title: "Done",
          text: `Data Deleted Successfully`,
        });

        // refetch();
        fetchData()

      }
    } catch (error) {
      // Handle error
      alert('Error deleting data:' + error);
    }
  }

  const handleCloser = () => {
    setFormData({
      priority: '',
      threshold_aging_level_1: '',
      threshold_aging_level_2: '',
      threshold_aging_level_3: '',
      threshold_aging_level_4: '',
    })
    setEdit(false)
    setAdd(false)
    setEditDataID()
  }

  useEffect(() => {
    fetchData()
  }, [])

  // const fetchData=async()=>{
  //     let responce = await getData('Zero_Count_Rna_Payload_Tool/data/thershold/');
  //     console.log('responce thershold' , responce)
  // }

  // useEffect(()=>{
  //     fetchData();

  // },[])
  return (
    <div style={{ margin: '10px' }}>
      <div style={{ height: 'auto', width: '100%', margin: '5px 0px', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor: 'white', borderRadius: '10px', padding: '1px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box >
            <Tooltip title="Add List" color='primary'>
              <IconButton color='primary' onClick={() => setAdd(!add)} >
                <PlaylistAddIcon fontSize='small' color='primary' />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <h4>{heading}</h4>
          </Box>

          <Box style={{ float: 'right', display: 'flex' }}>
            <Tooltip title="Export Excel">
              <IconButton >
                <DownloadIcon fontSize='small' color='primary' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </div>
      <Slide
        direction='left'
        in='true'
        // style={{ transformOrigin: '0 0 0' }}
        timeout={1000}
      >
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 450, width: '100%' }}>
            <Table stickyHeader >
              <TableHead style={{ fontSize: 18 }}>
                <TableRow >
                  <StyledTableCell align="center">Sr. No.</StyledTableCell>
                  <StyledTableCell align="center">Priority</StyledTableCell>
                  <StyledTableCell align="center">Threshold Aging L-1</StyledTableCell>
                  <StyledTableCell align="center">Threshold Aging L-2</StyledTableCell>
                  <StyledTableCell align="center">Threshold Aging L-3</StyledTableCell>
                  <StyledTableCell align="center">Threshold Aging L-4</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData?.map((row, index) => (
                  <StyledTableRow
                    key={row.id}
                    className={classes.hover}
                  >
                    <StyledTableCell align="center">{index + 1}</StyledTableCell>
                    <StyledTableCell align="center">{row.priority}</StyledTableCell>
                    <StyledTableCell align="center">{row.threshold_aging_level_1}</StyledTableCell>
                    <StyledTableCell align="center">{row.threshold_aging_level_2}</StyledTableCell>
                    <StyledTableCell align="center">{row.threshold_aging_level_3}</StyledTableCell>
                    <StyledTableCell align="center">{row.threshold_aging_level_4}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", display: 'flex', flex: 'row', justifyContent: 'space-evenly' }}>
                      <Tooltip title="Edit" color='primary'>
                        <IconButton color="primary" onClick={() => { handleEdit(row) }}>
                          <EditIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => { handleDelete(row.id) }}>
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                {/* {filterRCAData()} */}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Slide>
      {add && handleAddNewList()}
      {edit && handleEditDialog()}
    </div>
  )
}

export default Thershold