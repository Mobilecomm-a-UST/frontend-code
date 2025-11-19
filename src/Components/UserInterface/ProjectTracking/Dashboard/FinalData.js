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

const FinalData = () => {
    const listDataa = useSelector(state => state.relocationFinalTracker)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userID = getDecreyptedData('userID')
    const { actions ,loading} = useLoadingDialog();
    // const [listData, setListData] = useState(getDecreyptedData("relocation_final_tracker"))
    const [editData, setEditData] = useState({
        unique_id: "",
        circle: "",
        site_tagging: "",
        old_toco_name: "",
        old_site_id: "",
        new_site_id: "",
        new_toco_name: "",
        sr_number: "",
        ran_oem: "",
        media_type: "",
        mw_oem: "",
        relocation_method: "",
        relocation_type: "",
        old_site_band: "",
        new_site_band: "",
        rfai_date: "",
        allocation_date: "",
        rfai_survey_date: "",
        mo_punch_date: "",
        material_dispatch_date: "",
        material_delivered_date: "",
        installation_start_date: "",
        installation_end_date: "",
        integration_date: "",
        emf_submission_date: "",
        ran_lkf_status: "",
        alarm_status: "",
        alarm_rectification_done_date: "",
        scft_done_date: "",
        scft_i_deploy_offered_date: "",
        ran_pat_offer_date: "",
        ran_sat_offer_date: "",
        mw_plan_id: "",
        mw_pat_offer_date: "",
        rsl_value_status: "",
        enm_status: "",
        mw_lkf: "",
        mw_sat_offer_date: "",
        mw_ms1_mids_date: "",
        site_onair_date: "",
        i_deploy_onair_date: "",
        current_status: "",
        rfai_rejected_date: "",
        re_rfai_date: "",
        pri_start_date: "",
        pri_close_date: "",
        pri_history: "",
        pri_count: "",
        fiber_issue_start_date: "",
        fiber_issue_close_date: "",
        material_issue_start_date: "",
        material_issue_close_date: "",
        mw_issue_start_date: "",
        mw_issue_close_date: "",
        issue_ageing: "",
        clear_rfai_to_ms1_ageing: "",
        rfai_to_ms1_ageing: "",
        ran_pat_accepted_date: "",
        ran_sat_accepted_date: "",
        mw_pat_accepted_date: "",
        mw_sat_accepted_date: "",
        scft_accepted_date: "",
        kpi_at_offer_date: "",
        kpi_at_accepted_date: "",
        four_g_ms2_date: "",
        five_g_ms2_date: "",
        final_ms2_date: "",
        last_updated_date: "",
        last_updated_by: ""
    });
    const [editDataID, setEditDataID] = useState('')
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState()
    const [selectedRows, setSelectedRows] = useState([])
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    // const params = useParams()


    // console.log('local storage', listDataa)



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
            ran_oem: rowData.ran_oem,
            media_type: rowData.media_type,
            mw_oem: rowData.mw_oem,
            relocation_method: rowData.relocation_method,
            relocation_type: rowData.relocation_type,
            old_site_band: rowData.old_site_band,
            new_site_band: rowData.new_site_band,

            rfai_date: rowData.rfai_date,
            allocation_date: rowData.allocation_date,
            rfai_survey_date: rowData.rfai_survey_date,

            mo_punch_date: rowData.mo_punch_date,
            material_dispatch_date: rowData.material_dispatch_date,
            material_delivered_date: rowData.material_delivered_date,

            installation_start_date: rowData.installation_start_date,
            installation_end_date: rowData.installation_end_date,
            integration_date: rowData.integration_date,
            emf_submission_date: rowData.emf_submission_date,

            ran_lkf_status: rowData.ran_lkf_status,
            alarm_status: rowData.alarm_status,
            alarm_rectification_done_date: rowData.alarm_rectification_done_date,

            scft_done_date: rowData.scft_done_date,
            scft_i_deploy_offered_date: rowData.scft_i_deploy_offered_date,
            ran_pat_offer_date: rowData.ran_pat_offer_date,
            ran_sat_offer_date: rowData.ran_sat_offer_date,

            mw_plan_id: rowData.mw_plan_id,
            mw_pat_offer_date: rowData.mw_pat_offer_date,
            rsl_value_status: rowData.rsl_value_status,
            enm_status: rowData.enm_status,
            mw_lkf: rowData.mw_lkf,
            mw_sat_offer_date: rowData.mw_sat_offer_date,
            mw_ms1_mids_date: rowData.mw_ms1_mids_date,

            site_onair_date: rowData.site_onair_date,
            i_deploy_onair_date: rowData.i_deploy_onair_date,

            current_status: rowData.current_status,
            rfai_rejected_date: rowData.rfai_rejected_date,
            re_rfai_date: rowData.re_rfai_date,

            pri_start_date: rowData.pri_start_date,
            pri_close_date: rowData.pri_close_date,
            pri_history: rowData.pri_history,
            pri_count: rowData.pri_count,

            fiber_issue_start_date: rowData.fiber_issue_start_date,
            fiber_issue_close_date: rowData.fiber_issue_close_date,

            material_issue_start_date: rowData.material_issue_start_date,
            material_issue_close_date: rowData.material_issue_close_date,

            mw_issue_start_date: rowData.mw_issue_start_date,
            mw_issue_close_date: rowData.mw_issue_close_date,

            issue_ageing: rowData.issue_ageing,
            clear_rfai_to_ms1_ageing: rowData.clear_rfai_to_ms1_ageing,
            rfai_to_ms1_ageing: rowData.rfai_to_ms1_ageing,

            ran_pat_accepted_date: rowData.ran_pat_accepted_date,
            ran_sat_accepted_date: rowData.ran_sat_accepted_date,
            mw_pat_accepted_date: rowData.mw_pat_accepted_date,
            mw_sat_accepted_date: rowData.mw_sat_accepted_date,
            scft_accepted_date: rowData.scft_accepted_date,

            kpi_at_offer_date: rowData.kpi_at_offer_date,
            kpi_at_accepted_date: rowData.kpi_at_accepted_date,

            four_g_ms2_date: rowData.four_g_ms2_date,
            five_g_ms2_date: rowData.five_g_ms2_date,
            final_ms2_date: rowData.final_ms2_date,

            last_updated_date: rowData.last_updated_date,
            last_updated_by: rowData.last_updated_by
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
            if (response.status) {
                setOpen(false);
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `Data Updated Successfully`,
                });
                navigate('/tools/relocation_tracking/waterfall/')
            }
            // console.log('update response', response);

            
        } catch (error) {
            setOpen(false);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Failed to update data: ${error.response?.data?.message || error.message}`,
            });
        }

    }

    const handleDelete = async (rowData) => {
        axios.delete(`${ServerURL}/IntegrationTracker/delete-integration-record/${rowData.id}/`, { headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }, })
            .then((res) => {
                console.log('Data deleted successfully', res);
                Swal.fire({
                    icon: "success",
                    title: "Deleted",
                    text: `${res.data.message}`,
                });
                const newData = listDataa.filter(item => item.id !== rowData.id);
                // setListDataa(newData);
                dispatch({ type: 'RELOCATION_FINAL_TRACKER', payload: { newData } })
                // console.log('Data deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting data:', error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `${error.response.data.message}`,
                });
            });
    }


    // const columnData = [
    //     { title: 'OEM', field: 'OEM' },
    //     { title: 'Integration Date', field: 'Integration_Date' },
    //     { title: 'CIRCLE', field: 'CIRCLE' },
    //     { title: 'Activity Name', field: 'Activity_Name' },
    //     { title: 'Site ID', field: 'Site_ID' },
    //     { title: 'MO NAME', field: 'MO_NAME' },

    //     { title: 'LNBTS ID', field: 'LNBTS_ID' },
    //     { title: 'Technology (SIWA)', field: 'Technology_SIWA' },
    //     { title: 'OSS Details', field: 'OSS_Details' },
    //     { title: 'Cell ID', field: 'Cell_ID' },
    //     { title: 'CELL COUNT', field: 'CELL_COUNT' },
    //     { title: 'BSC NAME', field: 'BSC_NAME' },
    //     { title: 'BCF', field: 'BCF' },
    //     { title: 'TRX Count', field: 'TRX_Count' },
    //     { title: 'PRE ALARM', field: 'PRE_ALARM' },
    //     { title: 'GPS IP CLK', field: 'GPS_IP_CLK' },
    //     { title: 'RET', field: 'RET' },
    //     { title: 'POST VSWR', field: 'POST_VSWR' },
    //     { title: 'POST Alarms', field: 'POST_Alarms' },
    //     { title: 'Activity Mode (SA/NSA)', field: 'Activity_Mode' },
    //     { title: 'Activity Type (SIWA)', field: 'Activity_Type_SIWA' },
    //     { title: 'Band (SIWA)', field: 'Band_SIWA' },


    //     { title: 'CELL STATUS', field: 'CELL_STATUS' },
    //     { title: 'CTR STATUS', field: 'CTR_STATUS' },
    //     { title: 'Integration Remark', field: 'Integration_Remark' },
    //     { title: 'T2T4R', field: 'T2T4R' },
    //     { title: 'BBU TYPE', field: 'BBU_TYPE' },
    //     { title: 'BB CARD', field: 'BB_CARD' },
    //     { title: 'RRU Type', field: 'RRU_Type' },
    //     { title: 'Media Status', field: 'Media_Status' },
    //     { title: 'Mplane IP', field: 'Mplane_IP' },
    //     { title: 'SCF PREPARED_BY', field: 'SCF_PREPARED_BY' },
    //     { title: 'SITE INTEGRATE_BY', field: 'SITE_INTEGRATE_BY' },
    //     { title: 'Site Status', field: 'Site_Status' },
    //     {
    //         title: 'External Alarm Confirmation',
    //         field: 'External_Alarm_Confirmation'
    //     },
    //     { title: 'SOFT AT STATUS', field: 'SOFT_AT_STATUS' },
    //     { title: 'LICENCE Status', field: 'LICENCE_Status' },
    //     { title: 'ESN NO', field: 'ESN_NO' },
    //     {
    //         title: 'Responsibility_for_alarm_clearance',
    //         field: 'Responsibility_for_alarm_clearance'
    //     },
    //     { title: 'TAC', field: 'TAC' },
    //     { title: 'PCI TDD 20', field: 'PCI_TDD_20' },
    //     { title: 'PCI TDD 10/20', field: 'PCI_TDD_10_20' },
    //     { title: 'PCI FDD 2100', field: 'PCI_FDD_2100' },
    //     { title: 'PCI FDD 1800', field: 'PCI_FDD_1800' },
    //     { title: 'PCI L900', field: 'PCI_L900' },
    //     { title: '5G PCI', field: 'PCI_5G' },
    //     { title: 'RSI TDD 20', field: 'RSI_TDD_20' },
    //     { title: 'RSI TDD 10/20', field: 'RSI_TDD_10_20' },
    //     { title: 'RSI FDD 2100', field: 'RSI_FDD_2100' },
    //     { title: 'RSI FDD 1800', field: 'RSI_FDD_1800' },
    //     { title: 'RSI L900', field: 'RSI_L900' },
    //     { title: '5G RSI', field: 'RSI_5G' },
    //     { title: 'GPL', field: 'GPL' },
    //     { title: 'Pre/Post Check', field: 'Pre_Post_Check' },
    //     { title: 'CRQ', field: 'CRQ' },
    //     { title: 'Customer Approval', field: 'Customer_Approval' },
    //     { title: 'Allocated Tech.', field: 'Allocated_Tech' },
    //     { title: 'Deployed Tech.', field: 'Deployed_Tech' },
    //     { title: 'Old Site ID', field: 'Old_Site_ID' },
    //     { title: 'Old Site Tech', field: 'Old_Site_Tech' },
    //     {
    //         title: 'Actions',
    //         field: 'actions',
    //         render: rowData => (
    // <>
    //             <IconButton aria-label="delete" title={'Edit'} size="large" onClick={() => { handleEdit(rowData) }}>
    //                 <DriveFileRenameOutlineIcon
    //                     style={{ cursor: 'pointer' }}
    //                     color='success'
    //                 />
    //             </IconButton>
    //             <IconButton aria-label="delete" title={'Delete'} size="large" onClick={() => { handleDelete(rowData) }}>
    //                 <DeleteOutlineIcon
    //                     style={{ cursor: 'pointer' }}
    //                     color='error'
    //                 />
    //             </IconButton>

    //         </>

    //         )
    //     }

    // ]

    const columnData = [
        { title: 'Unique ID', field: 'Unique ID' },
        { title: 'Circle', field: 'circle' },
        { title: 'Site Tagging', field: 'site_tagging' },
        { title: 'Old TOCO Name', field: 'old_toco_name' },
        { title: 'Old Site ID', field: 'old_site_id' },
        { title: 'New Site ID', field: 'new_site_id' },
        { title: 'New TOCO Name', field: 'new_toco_name' },
        { title: 'SR Number', field: 'sr_number' },
        { title: 'RAN OEM', field: 'ran_oem' },
        { title: 'Media Type', field: 'media_type' },
        { title: 'MW OEM', field: 'mw_oem' },
        { title: 'Relocation Method', field: 'relocation_method' },
        { title: 'Relocation Type', field: 'relocation_type' },
        { title: 'Old Site Band', field: 'old_site_band' },
        { title: 'New Site Band', field: 'new_site_band' },
        { title: 'RFAI Date', field: 'rfai_date' },
        { title: 'Allocation Date', field: 'allocation_date' },
        { title: 'RFAI Survey Date', field: 'rfai_survey_date' },
        { title: 'MO Punch Date', field: 'mo_punch_date' },
        { title: 'Material Dispatch Date', field: 'material_dispatch_date' },
        { title: 'Material Delivered Date', field: 'material_delivered_date' },
        { title: 'Installation Start Date', field: 'installation_start_date' },
        { title: 'Installation End Date', field: 'installation_end_date' },
        { title: 'Integration Date', field: 'integration_date' },
        { title: 'EMF Submission Date', field: 'emf_submission_date' },
        { title: 'RAN LKF Status', field: 'ran_lkf_status' },
        { title: 'Alarm Status', field: 'alarm_status' },
        { title: 'Alarm Rectif. Done Date', field: 'alarm_rectification_done_date' },
        { title: 'SCFT Done Date', field: 'scft_done_date' },
        { title: 'SCFT i-Deploy Offered', field: 'scft_i_deploy_offered_date' },
        { title: 'RAN PAT Offer Date', field: 'ran_pat_offer_date' },
        { title: 'RAN SAT Offer Date', field: 'ran_sat_offer_date' },
        { title: 'MW Plan ID', field: 'mw_plan_id' },
        { title: 'MW PAT Offer Date', field: 'mw_pat_offer_date' },
        { title: 'RSL Value Status', field: 'rsl_value_status' },
        { title: 'ENM Status', field: 'enm_status' },
        { title: 'MW LKF', field: 'mw_lkf' },
        { title: 'MW SAT Offer Date', field: 'mw_sat_offer_date' },
        { title: 'MW MS1 / MIDS Date', field: 'mw_ms1_mids_date' },
        { title: 'Site OnAir Date', field: 'site_onair_date' },
        { title: 'i-Deploy OnAir Date', field: 'i_deploy_onair_date' },
        { title: 'Current Status', field: 'current_status' },
        { title: 'RFAI Rejected Date', field: 'rfai_rejected_date' },
        { title: 'Re-RFAI Date', field: 're_rfai_date' },
        { title: 'PRI Start Date', field: 'pri_start_date' },
        { title: 'PRI Close Date', field: 'pri_close_date' },
        { title: 'PRI History', field: 'pri_history' },
        { title: 'PRI Count', field: 'pri_count' },
        { title: 'Fiber Issue Start Date', field: 'fiber_issue_start_date' },
        { title: 'Fiber Issue Close Date', field: 'fiber_issue_close_date' },
        { title: 'Material Issue Start Date', field: 'material_issue_start_date' },
        { title: 'Material Issue Close Date', field: 'material_issue_close_date' },
        { title: 'MW Issue Start Date', field: 'mw_issue_start_date' },
        { title: 'MW Issue Close Date', field: 'mw_issue_close_date' },
        { title: 'Issue Ageing', field: 'issue_ageing' },
        { title: 'Clear RFAI→MS1 Ageing', field: 'clear_rfai_to_ms1_ageing' },
        { title: 'RFAI→MS1 Ageing', field: 'rfai_to_ms1_ageing' },
        { title: 'RAN PAT Accepted', field: 'ran_pat_accepted_date' },
        { title: 'RAN SAT Accepted', field: 'ran_sat_accepted_date' },
        { title: 'MW PAT Accepted', field: 'mw_pat_accepted_date' },
        { title: 'MW SAT Accepted', field: 'mw_sat_accepted_date' },
        { title: 'SCFT Accepted Date', field: 'scft_accepted_date' },
        { title: 'KPI AT Offer Date', field: 'kpi_at_offer_date' },
        { title: 'KPI AT Accepted Date', field: 'kpi_at_accepted_date' },
        { title: '4G MS2 Date', field: 'four_g_ms2_date' },
        { title: '5G MS2 Date', field: 'five_g_ms2_date' },
        { title: 'Final MS2 Date', field: 'final_ms2_date' },
        { title: 'Last Updated Date', field: 'last_updated_date' },
        { title: 'Last Updated By', field: 'last_updated_by' },

        {
            title: 'Actions',
            field: 'actions',
            render: rowData => (
                <>
                    {!userTypes?.includes('RLT_reader') && <IconButton aria-label="delete" title={'Edit'} size="large" onClick={() => { handleEdit(rowData) }}>
                        <DriveFileRenameOutlineIcon
                            style={{ cursor: 'pointer' }}
                            color='success'
                        />
                    </IconButton>}
                    {/* {!userTypes?.includes('RLT_reader') && <IconButton aria-label="delete" title={'Delete'} size="large" onClick={() => { handleDelete(rowData) }}>
                        <DeleteOutlineIcon
                            style={{ cursor: 'pointer' }}
                            color='error'
                        />
                    </IconButton>} */}




                </>
            )
        }
    ];


    const getStatus = () => {
        var arr = []
        listDataa?.map((item) => {
            // console.log('status oem', item.AT_STATUS)
            arr.push(item.AT_STATUS)
        })
        setStatus(`( ${[...new Set(arr)]} )`);



    }


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
                                    value={editData[key]}
                                    onChange={handleChange}
                                    size="small"
                                    type={key.includes('date') ? 'date' : 'text'}
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


    }, [open, editData])

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
                    title={'Relocation Site Details'}
                    columns={columnData}
                    data={listDataa.temp}
                    onSelectionChange={(rows) => setSelectedRows(rows)}
                    // onRowClick={((evt, selectedRow) => console.log())}
                    actions={[
                        {
                            icon: () => <DownloadIcon color='primary' fontSize='large' />,
                            tooltip: "Export to Excel",
                            onClick: () => downloadExcel(listDataa.temp), isFreeAction: true
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
            {/* <div >girraj singh</div> */}
            {handleDialogBox()}
            {loading}
        </>
    )
}

export default FinalData