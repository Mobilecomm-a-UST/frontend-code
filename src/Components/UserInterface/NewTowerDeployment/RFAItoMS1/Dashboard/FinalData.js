import React, { useCallback, useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
// import { postData } from '../../../services/FetchNodeServices';
import DownloadIcon from '@mui/icons-material/Download';
import { CsvBuilder } from 'filefy';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// import { useParams } from 'react-router-dom';
import { Dialog, DialogContent, IconButton, DialogTitle } from '@mui/material';
import { ServerURL } from '../../../../services/FetchNodeServices';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Swal from "sweetalert2";
import TextField from '@mui/material/TextField';
import { Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { getDecreyptedData } from '../../../../utils/localstorage';
import { useLoadingDialog } from '../../../../Hooks/LoadingDialog';

const readOnlyFields = [
    "unique_id",
    "circle",
    "site_id",
    "pri_count",
    "pri_issue_ageing",
    "total_issue_ageing",
    "clear_rfai_to_ms1_ageing",
    "last_updated_date",
    "last_updated_by",
    "rfai_to_ms1_ageing"
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
    "ran_pat_offer_date",
    "ran_sat_offer_date",
    "mw_pat_offer_date",
    "mw_sat_offer_date",
    "mw_ms1_mids_date",
    "site_onair_date",
    "i_deploy_onair_date",
    "rfai_rejected_date",
    "re_rfai_date",
    "ran_pat_accepted_date",
    "ran_sat_accepted_date",
    "mw_pat_accepted_date",
    "mw_sat_accepted_date",
    "scft_accepted_date",
    "kpi_at_offer_date",
    "kpi_at_accepted_date",
    "four_g_ms2_date",
]

const FinalData = () => {
    const listDataa = useSelector(state => state.ntdFinalTracker)
    // console.log('list data' , listDataa)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userID = getDecreyptedData('userID')
    const { actions, loading } = useLoadingDialog();
    // const [listData, setListData] = useState(getDecreyptedData("relocation_final_tracker"))
    const [editData, setEditData] = useState({
        unique_id: "",
        circle: "",
        site_id: "",
        project_nt: "",
        tur_breakup: "",
        new_toco_name: "",
        sr_number: "",
        ran_oem: "",
        media_type: "",
        mw_oem: "",
        mw_nstallation_partner: "",
        site_band: "",
        rfai_date: "",
        allocation_date: "",
        rfai_survey_date: "",
        wrfai: "",
        mo_punch_date: "",
        material_dispatch_date: "",
        material_delivered_date: "",
        material_type_hw: "",
        material_type_im: "",
        installation_start_date: "",
        installation_end_date: "",
        integration_date: "",
        Sacfa_Appied_date: "",
        wpc_no: "",
        wpc_date: "",
        emf_submission_date: "",
        nep_id: "",
        ran_lkf_status: "",
        alarm_status: "",
        alarm_rectification_done_date: "",
        scft_done_date: "",
        scft_offered_date: "",
        ran_pat_offer_date: "",
        ran_sat_offer_date: "",
        mw_plan_id: "",
        mw_pat_offer_date: "",
        rsl_value_status: "",
        enm_status: "",
        mw_lkf: "",
        mw_sat_offer_date: "",
        mw_ms1_mids_date: "",
        mw_sacfa_a_end: "",
        mw_wpc_a_end: "",
        mw_sacfa_b_end: "",
        mw_wpc_b_end: "",

        site_onair_date: "",
        i_deploy_onair_date: "",

        current_status: "",
        ideploy_status: "",
        detailed_remarks: "",

        rfai_rejected_date: "",
        ideploy_pri_taging: "",
        re_rfai_date: "",

        pri_count: "",
        pri_issue_ageing: "",
        other_ust_issue_ageing: "",
        other_airtel_issue_ageing: "",
        total_issue_ageing: "",

        clear_rfai_ms1_ageing: "",
        rfai_to_ms1_ageing: "",

        ran_pat_accepted_date: "",
        ran_sat_accepted_date: "",
        mw_pat_accepted_date: "",
        mw_sat_accepted_date: "",
        scft_accepted_date: "",

        kpi_at_offer_date: "",
        kpi_at_accepted_date: "",

        four_g_ms2_date: "",
        ssid: "",
        pmis_month: "",

        airtel_sign_off: "",

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


    const createNextHistoryEntry = (start, close, index) => {
        return {
            [`S${index}`]: start || "",
            [`C${index}`]: close || ""
        };
    };

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
        });
        // const { name, value } = e.target;

        // setEditData(prev => {
        //     const updated = { ...prev, [name]: value };

        //     if (name === "pri_start_date" || name === "pri_close_date") {

        //         // Parse existing history (json string or array)
        //         let oldHistory = [];
        //         try {
        //             oldHistory = prev.pri_history
        //                 ? JSON.parse(prev.pri_history)
        //                 : [];
        //         } catch {
        //             oldHistory = [];
        //         }

        //         // Determine next index like S3/C3
        //         const nextIndex = oldHistory.length + 1;

        //         // Create new entry
        //         const newEntry = createNextHistoryEntry(
        //             updated.pri_start_date,
        //             updated.pri_close_date,
        //             nextIndex
        //         );

        //         // Append new entry
        //         const newHistory = [...oldHistory, newEntry];

        //         updated.pri_history = JSON.stringify(newHistory);
        //         updated.pri_count = newHistory.length;  // total entries
        //     }

        //     return updated;
        // });
    }

    const handleEdit = async (rowData) => {
        // console.log(rowData)
        setEditData({
           unique_id: rowData["Unique ID"],
            circle: rowData.circle,
            site_id: rowData.site_id,
            project_nt: rowData.project_nt,
            tur_breakup: rowData.tur_breakup,
            new_toco_name: rowData.new_toco_name,
            sr_number: rowData.sr_number,

            ran_oem: rowData.ran_oem,
            media_type: rowData.media_type,
            mw_oem: rowData.mw_oem,
            mw_nstallation_partner: rowData.mw_nstallation_partner,

            site_band: rowData.site_band,
            rfai_date: rowData.rfai_date,
            allocation_date: rowData.allocation_date,
            rfai_survey_date: rowData.rfai_survey_date,

            wrfai: rowData.wrfai,

            mo_punch_date: rowData.mo_punch_date,
            material_dispatch_date: rowData.material_dispatch_date,
            material_delivered_date: rowData.material_delivered_date,

            material_type_hw: rowData.material_type_hw,
            material_type_im: rowData.material_type_im,

            installation_start_date: rowData.installation_start_date,
            installation_end_date: rowData.installation_end_date,
            integration_date: rowData.integration_date,

            Sacfa_Appied_date: rowData.Sacfa_Appied_date,
            wpc_no: rowData.wpc_no,
            wpc_date: rowData.wpc_date,

            emf_submission_date: rowData.emf_submission_date,
            nep_id: rowData.nep_id,

            ran_lkf_status: rowData.ran_lkf_status,
            alarm_status: rowData.alarm_status,
            alarm_rectification_done_date: rowData.alarm_rectification_done_date,

            scft_done_date: rowData.scft_done_date,
            scft_offered_date: rowData.scft_offered_date,

            ran_pat_offer_date: rowData.ran_pat_offer_date,
            ran_sat_offer_date: rowData.ran_sat_offer_date,

            mw_plan_id: rowData.mw_plan_id,
            mw_pat_offer_date: rowData.mw_pat_offer_date,

            rsl_value_status: rowData.rsl_value_status,
            enm_status: rowData.enm_status,
            mw_lkf: rowData.mw_lkf,

            mw_sat_offer_date: rowData.mw_sat_offer_date,
            mw_ms1_mids_date: rowData.mw_ms1_mids_date,

            mw_sacfa_a_end: rowData.mw_sacfa_a_end,
            mw_wpc_a_end: rowData.mw_wpc_a_end,
            mw_sacfa_b_end: rowData.mw_sacfa_b_end,
            mw_wpc_b_end: rowData.mw_wpc_b_end,

            site_onair_date: rowData.site_onair_date,
            i_deploy_onair_date: rowData.i_deploy_onair_date,

            current_status: rowData.current_status,
            ideploy_status: rowData.ideploy_status,
            detailed_remarks: rowData.detailed_remarks,

            rfai_rejected_date: rowData.rfai_rejected_date,
            ideploy_pri_taging: rowData.ideploy_pri_taging,
            re_rfai_date: rowData.re_rfai_date,

            pri_count: rowData.pri_count,
            pri_issue_ageing: rowData.pri_issue_ageing,
            other_ust_issue_ageing: rowData.other_ust_issue_ageing,
            other_airtel_issue_ageing: rowData.other_airtel_issue_ageing,
            total_issue_ageing: rowData.total_issue_ageing,

            clear_rfai_ms1_ageing: rowData.clear_rfai_ms1_ageing,
            rfai_to_ms1_ageing: rowData.rfai_to_ms1_ageing,

            ran_pat_accepted_date: rowData.ran_pat_accepted_date,
            ran_sat_accepted_date: rowData.ran_sat_accepted_date,
            mw_pat_accepted_date: rowData.mw_pat_accepted_date,
            mw_sat_accepted_date: rowData.mw_sat_accepted_date,
            scft_accepted_date: rowData.scft_accepted_date,

            kpi_at_offer_date: rowData.kpi_at_offer_date,
            kpi_at_accepted_date: rowData.kpi_at_accepted_date,

            four_g_ms2_date: rowData.four_g_ms2_date,
            ssid: rowData.ssid,
            pmis_month: rowData.pmis_month,

            airtel_sign_off: rowData.airtel_sign_off,

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
                (`${ServerURL}/nt_tracker/frontend_nt_update_view/`, formData, {
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
                navigate('/tools/ntd/rfai_to_ms1_waterfall/')
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
                dispatch({ type: 'NTD_FINAL_TRACKER', payload: { newData } })
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


    const columnData = [
        {
            title: 'Actions',
            field: 'actions',
            render: rowData => (
                <>
                    {!userTypes?.includes('RLT_reader') && (
                        <IconButton aria-label="edit" onClick={() => handleEdit(rowData)}>
                            <DriveFileRenameOutlineIcon color='success' />
                        </IconButton>
                    )}
                </>
            )
        },
        // { title: 'Unique ID', field: 'Unique ID' },

        { title: 'Circle', field: 'circle' },
        { title: 'Site ID', field: 'site_id' },

        { title: 'Project', field: 'project_nt' },
        { title: 'TUR Breakup', field: 'tur_breakup' },

        { title: 'TOCO Name', field: 'new_toco_name' },
        { title: 'SR Number', field: 'sr_number' },

        { title: 'RAN OEM', field: 'ran_oem' },
        { title: 'Media Type', field: 'media_type' },
        { title: 'MW OEM', field: 'mw_oem' },
        { title: 'MW Installation Partner', field: 'mw_nstallation_partner' },

        { title: 'Site Band', field: 'site_band' },
        { title: 'RFAI Date', field: 'rfai_date' },
        { title: 'Allocation Date', field: 'allocation_date' },
        { title: 'RFAI Survey Date', field: 'rfai_survey_date' },

        { title: 'WRFAI (YES/NO)', field: 'wrfai' },

        { title: 'MO Punch Date', field: 'mo_punch_date' },
        { title: 'Material Dispatch Date', field: 'material_dispatch_date' },
        { title: 'Material Delivered Date', field: 'material_delivered_date' },

        { title: 'Material Type - HW(Fresh/SRN)', field: 'material_type_hw' },
        { title: 'Material Type - IM(Fresh/SRN)', field: 'material_type_im' },

        { title: 'Installation Start Date', field: 'installation_start_date' },
        { title: 'Installation End Date', field: 'installation_end_date' },
        { title: 'Integration Date', field: 'integration_date' },

        { title: 'Sacfa Appied date', field: 'Sacfa_Appied_date' },
        { title: 'WPC No', field: 'wpc_no' },
        { title: 'WPC Date', field: 'wpc_date' },

        { title: 'EMF Submission Date', field: 'emf_submission_date' },
        { title: 'NEP ID', field: 'nep_id' },

        { title: 'RAN LKF Status', field: 'ran_lkf_status' },
        { title: 'Alarm Status', field: 'alarm_status' },
        { title: 'Alarm Rectification Done Date', field: 'alarm_rectification_done_date' },

        { title: 'SCFT Done Date', field: 'scft_done_date' },
        { title: 'SCFT Offered Date', field: 'scft_offered_date' },

        { title: 'RAN PAT Offer Date', field: 'ran_pat_offer_date' },
        { title: 'RAN SAT Offer Date', field: 'ran_sat_offer_date' },

        { title: 'MW Plan ID', field: 'mw_plan_id' },
        { title: 'MW PAT Offer Date', field: 'mw_pat_offer_date' },

        { title: 'RSL Value Status', field: 'rsl_value_status' },
        { title: 'ENM Status', field: 'enm_status' },
        { title: 'MW LKF', field: 'mw_lkf' },

        { title: 'MW SAT Offer Date', field: 'mw_sat_offer_date' },
        { title: 'MW MS1 MIDS Date', field: 'mw_ms1_mids_date' },

        { title: 'MW Sacfa - A End', field: 'mw_sacfa_a_end' },
        { title: 'MW WPC - A End', field: 'mw_wpc_a_end' },
        { title: 'MW Sacfa - B End', field: 'mw_sacfa_b_end' },
        { title: 'MW WPC - B End', field: 'mw_wpc_b_end' },

        { title: 'Site ONAIR Date', field: 'site_onair_date' },
        { title: 'I-Deploy ONAIR Date', field: 'i_deploy_onair_date' },

        { title: 'Current Status', field: 'current_status' },
        { title: 'Ideploy Status', field: 'ideploy_status' },
        { title: 'Detailed Remarks', field: 'detailed_remarks' },

        { title: 'RFAI Rejected Date', field: 'rfai_rejected_date' },
        { title: 'Ideploy PRI Taging', field: 'ideploy_pri_taging' },
        { title: 'Re RFAI Date', field: 're_rfai_date' },

        { title: 'PRI Count', field: 'pri_count' },
        { title: 'PRI Issue Ageing', field: 'pri_issue_ageing' },
        { title: 'Other UST Issue Ageing', field: 'other_ust_issue_ageing' },
        { title: 'Other Airtel Issue Ageing', field: 'other_airtel_issue_ageing' },
        { title: 'Total Issue Ageing', field: 'total_issue_ageing' },

        { title: 'Clear RFAI to MS1 Ageing', field: 'clear_rfai_ms1_ageing' },
        { title: 'RFAI to MS1 Ageing', field: 'rfai_to_ms1_ageing' },

        { title: 'RAN PAT Accepted Date', field: 'ran_pat_accepted_date' },
        { title: 'RAN SAT Accepted Date', field: 'ran_sat_accepted_date' },
        { title: 'MW PAT Accepted Date', field: 'mw_pat_accepted_date' },
        { title: 'MW SAT Accepted Date', field: 'mw_sat_accepted_date' },
        { title: 'SCFT Accepted Date', field: 'scft_accepted_date' },

        { title: 'KPI AT offer Date', field: 'kpi_at_offer_date' },
        { title: 'KPI AT Accepted Date', field: 'kpi_at_accepted_date' },

        { title: '4G MS2 Date', field: 'four_g_ms2_date' },
        { title: 'SSID', field: 'ssid' },
        { title: 'PMIS Month', field: 'pmis_month' },

        { title: 'Airtel Sign off( Yes/No)', field: 'airtel_sign_off' },

        { title: 'Last Updated Date', field: 'last_updated_date' },
        { title: 'Last Updated By', field: 'last_updated_by' }
    ];



    const getStatus = () => {
        var arr = []
        listDataa?.map((item) => {
            // console.log('status oem', item.AT_STATUS)
            arr.push(item.AT_STATUS)
        })
        setStatus(`( ${[...new Set(arr)]} )`);



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
                                    // 🔥 Make specific fields read-only
                                    // disabled={readOnlyFields.includes(key)}
                                    // OR this if you want greyed but selectable:
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
        // getStatus();
        // useEffect(()=>{
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
        //   },[])
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
                    title="NTD Site Details"
                    columns={columnData}
                    data={listDataa.temp}
                    actions={[
                        {
                            icon: () => <DownloadIcon color='primary' fontSize='large' />,
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
            {/* <div >girraj singh</div> */}
            {handleDialogBox()}
            {loading}
        </>
    )
}

export default FinalData