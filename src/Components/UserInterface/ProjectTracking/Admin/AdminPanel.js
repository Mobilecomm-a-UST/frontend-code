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
import axios from 'axios';
import Swal from "sweetalert2";
import TextField from '@mui/material/TextField';
import { Grid, Button } from '@mui/material';
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


const AdminPanel = () => {
  const listDataa = useSelector(state => state.relocationFinalTracker)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userID = getDecreyptedData('userID')
  const { actions, loading } = useLoadingDialog();
  const [editData, setEditData] = useState({
    unique_id: "",
    circle: "",
    site_tagging: "",
    old_toco_name: "",
    old_site_id: "",
    new_site_id: "",
    new_toco_name: "",
    sr_number: "",
  });
  const [addDataDialog, setAddDataDialog] = useState(false)
  const [columnsArray, setColumnsArray] = useState(['CENTRAL'])
  const [editDataID, setEditDataID] = useState('')
  const [tableData, setTableData] = useState([])
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState()
  const [selectedRows, setSelectedRows] = useState([])
  const userTypes = (getDecreyptedData('user_type')?.split(","))
  // const params = useParams()


  const fetchAdminPanelData = async () => {
    try {

      const formData = new FormData();
      formData.append('adminId', getDecreyptedData('userID'));
      const response = await axios.post
        (`${ServerURL}/alok_tracker/users/`, formData, {
          headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
        });
      console.log('fetchAdminPanelData response', response.data)
      if (response) {
        setOpen(false);
        setColumnsArray(['CENTRAL', ...response?.data?.columns])
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
    // console.log(rowData)
    setEditData({
      unique_id: rowData["Unique ID"],
      circle: rowData.circle,
      site_tagging: rowData.site_tagging,
      old_toco_name: rowData.old_toco_name,
      old_site_id: rowData.old_site_id,
      new_site_id: rowData.new_site_id,
      new_toco_name: rowData.new_toco_name,
      sr_number: rowData.sr_number,
    });
    setEditDataID(rowData.id)
    setOpen(true)
  }

  const handleUpdateData = async (e) => {
    e.preventDefault()
    try {

      const formData = new FormData();
      formData.append('data', JSON.stringify(editData));
      formData.append('userId', userID);
      const response = await axios.post
        (`${ServerURL}/alok_tracker/hyperlink_frontend_editing_update/`, formData, {
          headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
        });
      console.log('weeee', response)
      if (response.status) {
        setOpen(false);
        Swal.fire({
          icon: "success",
          title: "Done",
          text: `Data Updated Successfully`,
        });
        navigate('/tools/relocation_tracking/rfai_to_ms1_waterfall/')
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

      const formData = new FormData();
      formData.append("email", rowData?.email);   // change according to your backend
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

      // Optional: Refresh table after delete
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
  { title: 'Circles', 
    field: 'circles',
     render: rowData => rowData.circles?.join(", ") || "-"
  },
  { title: 'Columns', 
    field: 'columns',
   render: rowData => rowData.columns?.join(", ") || "-"
  },
  { title: 'Rights', field: 'right' },
  { title: 'Created By', field: 'created_by' },
  { title: 'Created At', field: 'created_at' },
  { title: 'Updated By', field: 'updated_by' },
  { title: 'Updated At', field: 'updated_at' },

  ];




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
          <Grid container spacing={2}>
            {Object.keys(editData).map(key => (
              <Grid item xs={3} key={key}>
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder={key.replace(/_/g, ' ')}
                  label={key.replace(/_/g, ' ')}
                  name={key}
                  value={key.includes('date') ? dateFormateChange(editData[key]) : editData[key]}
                  onChange={handleChange}
                  size="small"
                  type={dateTypeKey.includes(key) ? 'date' : 'text'}
                  InputLabelProps={key.includes('date') ? { shrink: true } : {}}
                  inputProps={readOnlyFields.includes(key) ? { readOnly: true } : {}}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained">Update</Button>
            </Grid>
          </Grid>
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
      {handleDialogBox()}
      {addDataDialog && (
        <DialogForm close={() => setAddDataDialog(prev => !prev)} column={columnsArray} refetch={()=> fetchAdminPanelData()} />
      )}
      {loading}
    </>
  )
}



export default AdminPanel