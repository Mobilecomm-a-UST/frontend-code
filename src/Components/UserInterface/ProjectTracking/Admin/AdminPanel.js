import React, { useCallback, useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
// import { postData } from '../../../services/FetchNodeServices';
import DownloadIcon from '@mui/icons-material/Download';
import { CsvBuilder } from 'filefy';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// import { useParams } from 'react-router-dom';
import { Dialog, DialogContent, IconButton, DialogTitle } from '@mui/material';
import { ServerURL } from '../../../services/FetchNodeServices';
import CloseIcon from '@mui/icons-material/Close';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import Swal from "sweetalert2";
import TextField from '@mui/material/TextField';
import { Grid, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { getDecreyptedData } from '../../../utils/localstorage';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DialogForm from './DialogForm';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { add, set } from 'lodash';

const readOnlyFields = [
  "unique_id",
  "circle",
  "site_tagging",
  "old_toco_name",
  "old_site_id",
  "new_site_id",
  "pri_history",
  "pri_count",
  "pri_issue_ageing",
  "issue_history",
  "other_issue_ageing",
  "total_issue_ageing",
  "clear_rfai_to_ms1_ageing",
  "last_updated_date",
  "last_updated_by",
  "clear_rfai_to_ms1_ageing"

];

const dateTypeKey = [
  "rfai_date",
  "allocation_date",
  "rfai_survey_date",
  "mo_punch_date",
  "material_dispatch_date",
  "material_delivered_date",
  "installation_start_date",
  "installation_end_date",
  "integration_date",
  "emf_submission_date",
  "alarm_rectification_done_date",
  "scft_done_date",
  "scft_i_deploy_offered_date",
  "ran_pat_offer_date",
  "ran_sat_offer_date",
  "mw_pat_offer_date",
  "mw_sat_offer_date",
  "mw_ms1_mids_date",
  "site_onair_date",
  "i_deploy_onair_date",
  "rfai_rejected_date",
  "re_rfai_date",
  "pri_start_date",
  "pri_close_date",
  "issue_start_date",
  "issue_close_date",
  "ran_pat_accepted_date",
  "ran_sat_accepted_date",
  "mw_pat_accepted_date",
  "mw_sat_accepted_date",
  "scft_accepted_date",
  "kpi_at_offer_date",
  "kpi_at_accepted_date",
  "four_g_ms2_date",
  "five_g_ms2_date",
  "final_ms2_date",
]

const MultiSelectWithAll = ({ label, options, selectedValues, setSelectedValues, name, required }) => {
  const handleChange = (event) => {
    const { value } = event.target;
    const selected = typeof value === 'string' ? value.split(',') : value;

    if (selected.includes('ALL')) {
      if (selectedValues.length === options.length) {
        setSelectedValues([]);
      } else {
        setSelectedValues(options);
      }
    } else {
      setSelectedValues(selected);
    }
  };

  const isAllSelected = options?.length > 0 && selectedValues?.length === options?.length;

  return (
    <FormControl fullWidth size="small">
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-label`}
        multiple
        value={selectedValues}
        name={name}
        label={label}
        onChange={handleChange}
        required={required}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => selected.join(', ')}
      >
        {/* <MenuItem value="ALL">
          <Checkbox
            checked={isAllSelected}
            indeterminate={
              selectedValues.length > 0 && selectedValues.length < options.length
            }
          />
          <ListItemText primary="Select All" />
        </MenuItem> */}

        {options.map((name) => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={selectedValues.includes(name)} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};


const circleOptions = ['CENTRAL', 'AP', 'ASM', 'BIH', 'CHN', 'DEL', 'HRY', 'JK', 'JRK', 'KK', 'KOL', 'MAH', 'MP', 'MUM', 'NE', 'ORI', 'PUN', 'RAJ', 'ROTN', 'UPE', 'UPW', 'WB']



const AdminPanel = () => {
  const listDataa = useSelector(state => state.relocationFinalTracker)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userID = getDecreyptedData('userID')
  const { actions, loading } = useLoadingDialog();
  const [editData, setEditData] = useState({});
  const [addDataDialog, setAddDataDialog] = useState(false)
  const [columnsArray, setColumnsArray] = useState(['ALL'])
  const [editDataID, setEditDataID] = useState('')
  const [tableData, setTableData] = useState([])
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState()
  const [selectedRows, setSelectedRows] = useState([])
  const userTypes = (getDecreyptedData('user_type')?.split(","))
  // const params = useParams()


  console.log('edit data', columnsArray)

  const fetchAdminPanelData = async () => {
    try {

      const formData = new FormData();
      formData.append('adminId', getDecreyptedData('userID'));
      const response = await axios.post
        (`${ServerURL}/alok_tracker/users/`, formData, {
          headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
        });
      // console.log('fetchAdminPanelData response', response.data)
      if (response) {
        setOpen(false);
        setColumnsArray(['ALL', ...response?.data?.columns])
        setTableData(response?.data?.json_data)

      }
    } catch (error) {
      setOpen(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to update data: ${error.response?.data?.error || error.message}`,
      });
    }

  }




  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  }

  const handleEdit = async (rowData) => {
    setEditData(rowData);
    setOpen(true)
  }

  const handleUpdateData = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData();
      formData.append('adminId', getDecreyptedData('userID'));
      formData.append('email', editData.email);
      formData.append('circles', editData.circles);
      formData.append('columns', editData.columns);
      formData.append('right', editData.right);
      const response = await axios.post
        (`${ServerURL}/alok_tracker/update_user/`, formData, {
          headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
        });
      console.log('update user data ', response)
      if (response.status) {
        setOpen(false);
        fetchAdminPanelData()
        Swal.fire({
          icon: "success",
          title: "Done",
          text: `Data Updated Successfully`,
        });
      }
      // console.log('update response', response);
    } catch (error) {
      console.log('error', error.response)
      setOpen(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to update data: ${error.response?.data?.error || error.message}`,
      });
    }

  }

  const handleDelete = async (rowData) => {
    try {
      // Step 1 — Ask for confirmation
      const confirmDelete = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel"
      });

      // If user clicked Cancel, stop here
      if (!confirmDelete.isConfirmed) {
        return;
      }

      // Step 2 — Proceed with delete API
      const formData = new FormData();
      formData.append("email", rowData?.email);
      formData.append("adminId", getDecreyptedData("userID"));

      const response = await axios.post(
        `${ServerURL}/alok_tracker/delete_user/`,
        formData,
        {
          headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
        }
      );

      console.log("Data deleted successfully", response.data);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: `${response.data.message}`,
      });

      // Refresh table
      fetchAdminPanelData();

    } catch (error) {
      console.error("Error deleting data:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${error.response?.data?.message || error.message}`,
      });
    }
  };


  const columnData = [{
    title: 'Actions',
    field: 'actions',
    render: rowData => (
      <>

        <IconButton aria-label="edit" onClick={() => handleEdit(rowData)}>
          <DriveFileRenameOutlineIcon color='success' />
        </IconButton>
        <IconButton aria-label="edit" onClick={() => handleDelete(rowData)}>
          <DeleteOutlineIcon color='error' />
        </IconButton>
      </>
    )
  },
  { title: 'Name', field: 'name' },
  { title: 'Email', field: 'email' },
  {
    title: 'Circles',
    field: 'circles',
    render: rowData => rowData.circles?.join(", ") || "-"
  },
  {
    title: 'Columns',
    field: 'columns',
    render: rowData => rowData.columns?.join(", ") || "-"
  },
  { title: 'Rights', field: 'right' },
  { title: 'Created By', field: 'created_by' },
  { title: 'Created At', field: 'created_at' },
  { title: 'Updated By', field: 'updated_by' },
  { title: 'Updated At', field: 'updated_at' },

  ];


  const handleDialogBox = useCallback(() => {

    return (<Dialog
      open={open}
      keepMounted
      fullWidth
      maxWidth={'lg'}

    >
      <DialogTitle>
        Edit Data
        <span style={{ float: 'right' }}><IconButton aria-label="close" onClick={() => setOpen(false)}><CloseIcon /> </IconButton></span>
      </DialogTitle>
      <DialogContent dividers={'paper'}>
        <form onSubmit={handleUpdateData} style={{ width: '100%', marginTop: 10 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* User Name  */}
            <FormControl fullWidth size="small" sx={{ flex: 1 }}>
              <TextField
                variant="outlined"
                label="User Name"
                name="name"
                value={editData?.name || ''}
                onChange={handleChange}
                type="Text"
                size="small"
                required
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
            {/* User Email Id  */}
            <FormControl fullWidth size="small" sx={{ flex: 1 }}>
              <TextField
                variant="outlined"
                label="User Email Id"
                name="email"
                value={editData?.email || ''}
                onChange={handleChange}
                type="email"
                size="small"
                required
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
            {/* circle */}
            <MultiSelectWithAll
              label="Circle"
              options={circleOptions}
              name="circles"
              required={true}
              selectedValues={editData.circles}
              setSelectedValues={(value) => setEditData((prevData) => ({
                ...prevData,
                circles: value
              }))}
            />
            {/* columns */}
            <MultiSelectWithAll
              label="Columns"
              options={columnsArray}
              name="columns"
              required={true}
              selectedValues={editData.columns}
              setSelectedValues={(value) => setEditData((prevData) => ({
                ...prevData,
                columns: value
              }))}
            />
            {/* right */}
            <FormControl fullWidth size="small">
              <InputLabel id={`Rights-label`}>Rights</InputLabel>

              <Select
                labelId={`Rights-label`}
                value={editData.right}
                label={`Rights`}
                name={`right`}
                required={true}
                onChange={handleChange}
              >
                {['Admin', 'Read', 'Write'].map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              Update User
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>)
  }, [open, editData])

  useEffect(() => {
    fetchAdminPanelData()
    document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

  }, [])

  const downloadExcel = (data) => {
    // **************** FILEFY DEPENDANCY *****************
    var csvBuilder = new CsvBuilder(`RFAI-To-MS1_Tracker.csv`)
      .setColumns(columnData.map(item => item.title))
      .addRows(data.map(row => columnData.map(col => row[col.field])))
      .exportFile();

  }
  return (
    <>
      <div style={{ margin: '1% 1%' }}>

        <MaterialTable
          title="User Control Admin Panel"
          columns={columnData}
          data={tableData}
          actions={[
            {
              icon: () => <AddCircleIcon sx={{ color: '#006e74' }} fontSize='large' />,
              tooltip: "Add New User",
              onClick: () => setAddDataDialog(!addDataDialog),
              isFreeAction: true
            },
            {
              icon: () => <DownloadIcon sx={{ color: '#006e74' }} fontSize='large' />,
              tooltip: "Export to Excel",
              onClick: () => downloadExcel(listDataa.temp),
              isFreeAction: true
            }
          ]}
          options={{
            selection: false,
            search: true,
            exportButton: true,
            grouping: false,
            // pageSize: 10,
            // pageSizeOptions: [5, 10, 20, 50], // optional
            headerStyle: {
              backgroundColor: '#006e74',
              color: '#FFF',
              whiteSpace: 'nowrap',
              fontWeight: 'bold'
            },
            rowStyle: {
              whiteSpace: 'nowrap'
            }
          }}
        />
      </div>
      {open && handleDialogBox()}
      {addDataDialog && (
        <DialogForm close={() => setAddDataDialog(prev => !prev)} column={columnsArray} refetch={() => fetchAdminPanelData()} />
      )}
      {loading}
    </>
  )
}



export default AdminPanel