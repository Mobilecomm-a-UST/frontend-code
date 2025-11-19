import React, { useCallback, useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
// import { postData } from '../../../services/FetchNodeServices';
import DownloadIcon from '@mui/icons-material/Download';
import { CsvBuilder } from 'filefy';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// import { useParams } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Dialog, DialogContent, IconButton ,DialogTitle} from '@mui/material';
import { ServerURL } from '../../../services/FetchNodeServices';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Swal from "sweetalert2";
import TextField from '@mui/material/TextField';
import { Grid ,Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { getDecreyptedData } from '../../../utils/localstorage';






function toCamelCase(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

const ComanDashboard = () => {
    const listDataa= useSelector(state=>state.IXtracker)
    const navigate = useNavigate();
    const [listData, setListData] = useState(getDecreyptedData("integration_final_tracker"))
    const [editData, setEditData] = useState({    OEM: "",
        Activity_Name: "",
        Activity_Mode: "",
        BBU_TYPE: "",
        Activity_Type_SIWA:"",
        BB_CARD: "",
        Band_SIWA:"",
        CELL_COUNT: "",
        CELL_STATUS: "",
        CIRCLE: "",
        CTR_STATUS: "",
        Cell_ID: "",
        ESN_NO: "",
        External_Alarm_Confirmation: "",
        GPL: "",
        GPS_IP_CLK: "",
        Integration_Date: "",
        Integration_Remark: "",
        LICENCE_Status: "",
        LNBTS_ID: "",
        MO_NAME: "",
        Media_Status: "",
        Mplane_IP: "",
     
        OSS_Details: "",
        PCI_5G: "",
        PCI_FDD_1800: "",
        PCI_FDD_2100: "",
        PCI_L900: "",
        PCI_TDD_10_20: "",
        PCI_TDD_20: "",
        POST_Alarms: "",
        POST_VSWR: "",
        PRE_ALARM: "",
        Pre_Post_Check: "",
        RET: "",
        RRU_Type: "",
        RSI_5G: "",
        RSI_FDD_1800: "",
        RSI_FDD_2100: "",
        RSI_L900: "",
        RSI_TDD_10_20: "",
        RSI_TDD_20: "",
        Responsibility_for_alarm_clearance: "",
        SCF_PREPARED_BY: "",
        SITE_INTEGRATE_BY: "",
        SOFT_AT_STATUS: "",
        Site_ID: "",
        Site_Status: "",
        T2T4R: "",
        TAC: "",
        TRX_Count: "",
        Technology_SIWA: "",
        BCF:'',
        BSC_NAME:'',
        CRQ:'',
        Customer_Approval:'',
        Allocated_Tech:'',
        Deployed_Tech:'',
        Old_Site_ID:'',
        Old_Site_Tech:''
        })
    const [editDataID , setEditDataID] = useState('')
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState()
    const [selectedRows, setSelectedRows] = useState([])
    // const params = useParams()


    // console.log('redux data handler', listDataa)



    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
        });
    }

    const handleEdit = async(rowData) => {
        // console.log(rowData)
        setEditData({    OEM: rowData.OEM,
            Integration_Date: rowData.Integration_Date,
            CIRCLE: rowData.CIRCLE,
            Activity_Name: rowData.Activity_Name,
            Site_ID: rowData.Site_ID,
            MO_NAME: rowData.MO_NAME,
            LNBTS_ID: rowData.LNBTS_ID,
            Technology_SIWA: rowData.Technology_SIWA,
            OSS_Details: rowData.OSS_Details,
            Cell_ID: rowData.Cell_ID,
            CELL_COUNT: rowData.CELL_COUNT,
            BSC_NAME: rowData.BSC_NAME,
            BCF: rowData.BCF,
            TRX_Count: rowData.TRX_Count,
            PRE_ALARM: rowData.PRE_ALARM,
            GPS_IP_CLK: rowData.GPS_IP_CLK,
            RET: rowData.RET,
            POST_VSWR: rowData.POST_VSWR,
            POST_Alarms: rowData.POST_Alarms,
            Activity_Mode: rowData.Activity_Mode,
            Activity_Type_SIWA: rowData.Activity_Type_SIWA,
            Band_SIWA: rowData.Band_SIWA,
            CELL_STATUS: rowData.CELL_STATUS,
            Integration_Remark: rowData.Integration_Remark,
            T2T4R: rowData.T2T4R,
            BBU_TYPE: rowData.BBU_TYPE,
            BB_CARD: rowData.BB_CARD,
            RRU_Type: rowData.RRU_Type,
            Media_Status: rowData.Media_Status,
            Mplane_IP: rowData.Mplane_IP,
            SCF_PREPARED_BY: rowData.SCF_PREPARED_BY,
            SITE_INTEGRATE_BY: rowData.SITE_INTEGRATE_BY,
            Site_Status: rowData.Site_Status,
            External_Alarm_Confirmation: rowData.External_Alarm_Confirmation,
            SOFT_AT_STATUS: rowData.SOFT_AT_STATUS,
            LICENCE_Status: rowData.LICENCE_Status,
            ESN_NO: rowData.ESN_NO,
            Responsibility_for_alarm_clearance: rowData.Responsibility_for_alarm_clearance,
            TAC: rowData.TAC,
            PCI_TDD_20: rowData.PCI_TDD_20,
            PCI_TDD_10_20: rowData.PCI_TDD_10_20,
            PCI_FDD_1800: rowData.PCI_FDD_1800,
            PCI_FDD_2100: rowData.PCI_FDD_2100,
            PCI_L900: rowData.PCI_L900,
            PCI_5G: rowData.PCI_5G,
            RSI_TDD_20: rowData.RSI_TDD_20,
            RSI_TDD_10_20: rowData.RSI_TDD_10_20,
            RSI_FDD_2100: rowData.RSI_FDD_2100,
            RSI_FDD_1800: rowData.RSI_FDD_1800,
            RSI_L900: rowData.RSI_L900,
            RSI_5G: rowData.RSI_5G,
            GPL: rowData.GPL,
            Pre_Post_Check: rowData.Pre_Post_Check,
            CTR_STATUS: rowData.CTR_STATUS,
            CRQ: rowData.CRQ,
            Customer_Approval: rowData.Customer_Approval,
            Allocated_Tech: rowData.Allocated_Tech,
            Deployed_Tech: rowData.Deployed_Tech,
            Old_Site_ID: rowData.Old_Site_ID,
            Old_Site_Tech: rowData.Old_Site_Tech
          })
        setEditDataID(rowData.id)
        setOpen(true)
    }

    const handleUpdateData = async(e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`${ServerURL}/IntegrationTracker/edit-integration-record/${editDataID}/`, editData, {
                headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
            });
            Swal.fire({
                icon: "success",
                title: "Done",
                text: `Data Updated Successfully`,
            });
            navigate('/tools/Integration/dashboard')
            
        } catch (error) {
            // console.log('error', error.response?.data || error.message);
            setOpen(false);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Failed to update data: ${error.response?.data?.message || error.message}`,
            });
        }
      
    }



    const handleDelete = async (rowData) => {
        axios.delete(`${ServerURL}/IntegrationTracker/delete-integration-record/${rowData.id}/`,{ headers: { Authorization: `token ${getDecreyptedData("tokenKey")}`},})
        .then((res) => {
            console.log('Data deleted successfully',res);
            Swal.fire({
                icon: "success",
                title: "Deleted",
                text: `${res.data.message}`,
            });
            const newData = listData.filter(item => item.id !== rowData.id);
            setListData(newData);
            // console.log('Data deleted successfully');
        })
        .catch(error =>{console.error('Error deleting data:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text:`${error.response.data.message}`,
            });});
    }


    const columnData = [
        { title: 'OEM', field: 'OEM' },
        { title: 'Integration Date', field: 'Integration_Date' },
        { title: 'CIRCLE', field: 'CIRCLE' },
        { title: 'Activity Name', field: 'Activity_Name' },
        { title: 'Site ID', field: 'Site_ID' },
        { title: 'MO NAME', field: 'MO_NAME' },
       
        { title: 'LNBTS ID', field: 'LNBTS_ID' },
        { title: 'Technology (SIWA)', field: 'Technology_SIWA' },
        { title: 'OSS Details', field: 'OSS_Details' },
        { title: 'Cell ID', field: 'Cell_ID' },
        { title: 'CELL COUNT', field: 'CELL_COUNT' },
        { title: 'BSC NAME', field: 'BSC_NAME' },
        { title: 'BCF', field: 'BCF' },
        { title: 'TRX Count', field: 'TRX_Count' },
        { title: 'PRE ALARM', field: 'PRE_ALARM' },
        { title: 'GPS IP CLK', field: 'GPS_IP_CLK' },
        { title: 'RET', field: 'RET' },
        { title: 'POST VSWR', field: 'POST_VSWR' },
        { title: 'POST Alarms', field: 'POST_Alarms' },
        { title: 'Activity Mode (SA/NSA)', field: 'Activity_Mode' },
        { title: 'Activity Type (SIWA)', field: 'Activity_Type_SIWA' },
        { title: 'Band (SIWA)', field: 'Band_SIWA' },


        { title: 'CELL STATUS', field: 'CELL_STATUS' },
        { title: 'CTR STATUS', field: 'CTR_STATUS' },
        { title: 'Integration Remark', field: 'Integration_Remark' },
        { title: 'T2T4R', field: 'T2T4R' },
        { title: 'BBU TYPE', field: 'BBU_TYPE' },
        { title: 'BB CARD', field: 'BB_CARD' },
        { title: 'RRU Type', field: 'RRU_Type' },
        { title: 'Media Status', field: 'Media_Status' },
        { title: 'Mplane IP', field: 'Mplane_IP' },
        { title: 'SCF PREPARED_BY', field: 'SCF_PREPARED_BY' },
        { title: 'SITE INTEGRATE_BY', field: 'SITE_INTEGRATE_BY' },
        { title: 'Site Status', field: 'Site_Status' },
        {
            title: 'External Alarm Confirmation',
            field: 'External_Alarm_Confirmation'
        },
        { title: 'SOFT AT STATUS', field: 'SOFT_AT_STATUS' },
        { title: 'LICENCE Status', field: 'LICENCE_Status' },
        { title: 'ESN NO', field: 'ESN_NO' },
        {
            title: 'Responsibility_for_alarm_clearance',
            field: 'Responsibility_for_alarm_clearance'
        },
        { title: 'TAC', field: 'TAC' },
        { title: 'PCI TDD 20', field: 'PCI_TDD_20' },
        { title: 'PCI TDD 10/20', field: 'PCI_TDD_10_20' },
        { title: 'PCI FDD 2100', field: 'PCI_FDD_2100' },
        { title: 'PCI FDD 1800', field: 'PCI_FDD_1800' },
        { title: 'PCI L900', field: 'PCI_L900' },
        { title: '5G PCI', field: 'PCI_5G' },
        { title: 'RSI TDD 20', field: 'RSI_TDD_20' },
        { title: 'RSI TDD 10/20', field: 'RSI_TDD_10_20' },
        { title: 'RSI FDD 2100', field: 'RSI_FDD_2100' },
        { title: 'RSI FDD 1800', field: 'RSI_FDD_1800' },
        { title: 'RSI L900', field: 'RSI_L900' },
        { title: '5G RSI', field: 'RSI_5G' },
        { title: 'GPL', field: 'GPL' },
        { title: 'Pre/Post Check', field: 'Pre_Post_Check' },
        { title: 'CRQ', field: 'CRQ' },
        { title: 'Customer Approval', field: 'Customer_Approval' },
        { title: 'Allocated Tech.', field: 'Allocated_Tech' },
        { title: 'Deployed Tech.', field: 'Deployed_Tech' },
        { title: 'Old Site ID', field: 'Old_Site_ID' },
        { title: 'Old Site Tech', field: 'Old_Site_Tech' },
        {
            title: 'Actions',
            field: 'actions',
            render: rowData => (<>
                <IconButton aria-label="delete" title={'Edit'} size="large"   onClick={() => {handleEdit(rowData) }}>
                    <DriveFileRenameOutlineIcon
                        style={{ cursor: 'pointer' }}
                        color='success'
                    />
                </IconButton>
                <IconButton aria-label="delete" title={'Delete'} size="large"   onClick={() => { handleDelete(rowData) }}>
                    <DeleteOutlineIcon
                        style={{ cursor: 'pointer' }}
                        color='error'
                    />
                </IconButton>
                
                </>

            )
        }

    ]


    const getStatus = () => {
        var arr = []
        listData?.map((item) => {
            // console.log('status oem', item.AT_STATUS)
            arr.push(item.AT_STATUS)
        })
        setStatus(`( ${[...new Set(arr)]} )`);



    }
    

    const handleDialogBox = useCallback(() =>{

        return(<Dialog
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
                            value={editData[key]}
                            onChange={handleChange}
                            size="small"
                            type={key.includes('Date') ? 'date' : 'text'}
                            InputLabelProps={key.includes('Date') ? { shrink: true } : {}}
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
        
       
    },[open,editData])

    useEffect(() => {
        // getStatus();
        // useEffect(()=>{
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
        //   },[])
    }, [])

    const downloadExcel = (data) => {
        // **************** FILEFY DEPENDANCY *****************
        var csvBuilder = new CsvBuilder(`Integration_Tracker.csv`)
            .setColumns(columnData.map(item => item.title))
            .addRows(data.map(row => columnData.map(col => row[col.field])))
            .exportFile();

    }

    return (
        <>
        <div style={{ margin: '1% 1%' }}>
            <MaterialTable
                title={'Integration Site Details'}
                columns={columnData}
                data={listData}
                onSelectionChange={(rows) => setSelectedRows(rows)}
                // onRowClick={((evt, selectedRow) => console.log())}
                actions={[
                    {
                        icon: () => <DownloadIcon color='primary' fontSize='large' />,
                        tooltip: "Export to Excel",
                        onClick: () => downloadExcel(listData), isFreeAction: true
                    },
                    {
                        tooltip: 'Selected Rows download',
                        icon: () => <DownloadIcon color='error' fontSize='large' />,

                        onClick: (evt, data) => downloadExcel(data),
                    }
                ]}

                options={{
                    selection: true,
                    search: true,
                    exportButton: true,
                    grouping: true,
                    headerStyle: {
                        backgroundColor: '#01579b',
                        color: '#FFF',
                        width: 'auto',
                        whiteSpace: 'nowrap'
                    },
                    rowStyle: {
                        // backgroundColor: '#EEE',
                        width: 'auto',
                        whiteSpace: 'nowrap'
                    },
                  

                }}
            />
        </div>

        {handleDialogBox()}
        </>
    )
}

export default ComanDashboard