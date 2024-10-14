import React, { useCallback, useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
import { postData } from '../../../services/FetchNodeServices';
import DownloadIcon from '@mui/icons-material/Download';
import { CsvBuilder } from 'filefy';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { useParams } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Dialog, DialogContent, IconButton, DialogTitle } from '@mui/material';
import { ServerURL } from '../../../services/FetchNodeServices';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Swal from "sweetalert2";
import TextField from '@mui/material/TextField';
import { Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';



function toCamelCase(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

const CircleWiseStatus = () => {
    const navigate = useNavigate();
    const [listData, setListData] = useState(JSON.parse(localStorage.getItem("softat_hyperlink_data")))
    const [editData, setEditData] = useState({
        unique_key: '',
        OEM: '',
        Integration_Date: '',
        CIRCLE: '',
        Activity_Name: '',
        Site_ID: '',
        MO_NAME: '',
        LNBTS_ID: '',
        Technology_SIWA: '',
        OSS_Details: '',
        Cell_ID: '',
        CELL_COUNT: '',
        BSC_NAME: '',
        BCF: '',
        TRX_Count: '',
        PRE_ALARM: '',
        GPS_IP_CLK: '',
        RET: '',
        POST_VSWR: '',
        POST_Alarms: '',
        Activity_Mode: '',
        Activity_Type_SIWA: '',
        Band_SIWA: '',
        CELL_STATUS: '',
        CTR_STATUS: '',
        Integration_Remark: '',
        T2T4R: '',
        BBU_TYPE: '',
        BB_CARD: '',
        RRU_Type: '',
        Media_Status: '',
        Mplane_IP: '',
        SCF_PREPARED_BY: '',
        SITE_INTEGRATE_BY: '',
        Site_Status: '',
        External_Alarm_Confirmation: '',
        SOFT_AT_STATUS: '',
        LICENCE_Status: '',
        ESN_NO: '',
        Responsibility_for_alarm_clearance: '',
        TAC: '',
        PCI_TDD_20: '',
        PCI_TDD_10_20: '',
        PCI_FDD_2100: '',
        PCI_FDD_1800: '',
        PCI_L900: '',
        PCI_5G: '',
        RSI_TDD_20: '',
        RSI_TDD_10_20: '',
        RSI_FDD_2100: '',
        RSI_FDD_1800: '',
        RSI_L900: '',
        RSI_5G: '',
        GPL: '',
        Pre_Post_Check: '',
        spoc_name: '',
        offering_type: '',
        first_offering_date: '',
        soft_at_status: '',
        offering_date: '',
        acceptance_rejection_date: '',
        alarm_bucket: '',
        alarm_details: '',
        final_responsibility: '',
        workable_non_workable: '',
        ubr_ms2_status: '',
        ubr_link_id: '',
        twamp_status: '',
        status_check_date: '',
        ageing_in_days: '',
        actual_ageing: '',
        toco_partner: '',
        support_required_ubr_team: '',
        support_required_circle_team: '',
        support_required_noc_team: '',
        category: '',
        problem_statement: '',
        final_remarks: '',
        ms1: ''
    })
    const [editDataID, setEditDataID] = useState('')
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState()
    const [selectedRows, setSelectedRows] = useState()
    const params = useParams()


    // console.log('ssssssddddddd', selectedRows)

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
        });
    }

    const handleEdit = async (item) => {
        // console.log(rowData)
        setEditData({
            unique_key: item.unique_key,
            OEM: item.OEM,
            Integration_Date: item.Integration_Date,
            CIRCLE: item.CIRCLE,
            Activity_Name: item.Activity_Name,
            Site_ID: item.Site_ID,
            MO_NAME: item.MO_NAME,
            LNBTS_ID: item.LNBTS_ID,
            Technology_SIWA: item.Technology_SIWA,
            OSS_Details: item.OSS_Details,
            Cell_ID: item.Cell_ID,
            CELL_COUNT: item.CELL_COUNT,
            BSC_NAME: item.BSC_NAME,
            BCF: item.BCF,
            TRX_Count: item.TRX_Count,
            PRE_ALARM: item.PRE_ALARM,
            GPS_IP_CLK: item.GPS_IP_CLK,
            RET: item.RET,
            POST_VSWR: item.POST_VSWR,
            POST_Alarms: item.POST_Alarms,
            Activity_Mode: item.Activity_Mode,
            Activity_Type_SIWA: item.Activity_Type_SIWA,
            Band_SIWA: item.Band_SIWA,
            CELL_STATUS: item.CELL_STATUS,
            CTR_STATUS: item.CTR_STATUS,
            Integration_Remark: item.Integration_Remark,
            T2T4R: item.T2T4R,
            BBU_TYPE: item.BBU_TYPE,
            BB_CARD: item.BB_CARD,
            RRU_Type: item.RRU_Type,
            Media_Status: item.Media_Status,
            Mplane_IP: item.Mplane_IP,
            SCF_PREPARED_BY: item.SCF_PREPARED_BY,
            SITE_INTEGRATE_BY: item.SITE_INTEGRATE_BY,
            Site_Status: item.Site_Status,
            External_Alarm_Confirmation: item.External_Alarm_Confirmation,
            SOFT_AT_STATUS: item.SOFT_AT_STATUS,
            LICENCE_Status: item.LICENCE_Status,
            ESN_NO: item.ESN_NO,
            Responsibility_for_alarm_clearance: item.Responsibility_for_alarm_clearance,
            TAC: item.TAC,
            PCI_TDD_20: item.PCI_TDD_20,
            PCI_TDD_10_20: item.PCI_TDD_10_20,
            PCI_FDD_2100: item.PCI_FDD_2100,
            PCI_FDD_1800: item.PCI_FDD_1800,
            PCI_L900: item.PCI_L900,
            PCI_5G: item.PCI_5G,
            RSI_TDD_20: item.RSI_TDD_20,
            RSI_TDD_10_20: item.RSI_TDD_10_20,
            RSI_FDD_2100: item.RSI_FDD_2100,
            RSI_FDD_1800: item.RSI_FDD_1800,
            RSI_L900: item.RSI_L900,
            RSI_5G: item.RSI_5G,
            GPL: item.GPL,
            Pre_Post_Check: item.Pre_Post_Check,
            spoc_name: item.spoc_name,
            offering_type: item.offering_type,
            first_offering_date: item.first_offering_date,
            soft_at_status: item.soft_at_status,
            offering_date: item.offering_date,
            acceptance_rejection_date: item.acceptance_rejection_date,
            alarm_bucket: item.alarm_bucket,
            alarm_details: item.alarm_details,
            final_responsibility: item.final_responsibility,
            workable_non_workable: item.workable_non_workable,
            ubr_ms2_status: item.ubr_ms2_status,
            ubr_link_id: item.ubr_link_id,
            twamp_status: item.twamp_status,
            status_check_date: item.status_check_date,
            ageing_in_days: item.ageing_in_days,
            actual_ageing: item.actual_ageing,
            toco_partner: item.toco_partner,
            support_required_ubr_team: item.support_required_ubr_team,
            support_required_circle_team: item.support_required_circle_team,
            support_required_noc_team: item.support_required_noc_team,
            category: item.category,
            problem_statement: item.problem_statement,
            final_remarks: item.final_remarks,
            ms1: item.ms1
        })
        setEditDataID(item.unique_key)
        setOpen(true)
    }

    const handleUpdateData = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`${ServerURL}/IntegrationTracker/edit-integration-record/${editDataID}/`, editData, {
                headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }
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
        axios.delete(`${ServerURL}/IntegrationTracker/delete-integration-record/${rowData.id}/`, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }, })
            .then((res) => {
                // console.log('Data deleted successfully', res);
                Swal.fire({
                    icon: "success",
                    title: "Deleted",
                    text: `${res.data.message}`,
                });
                const newData = listData.filter(item => item.id !== rowData.id);
                setListData(newData);
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

        // try {
        //     // Make the DELETE request
        //     const response = await axios.delete(`${ServerURL}/IntegrationTracker/delete-integration-record/${rowData.id}/`,
        //         {
        //             headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }
        //         }
        //     );
        //     console.log('Deleted successfully:', response);

        //     // if (response.status === 204) {
        //     //     Swal.fire({
        //     //         icon: "success",
        //     //         title: "Done",
        //     //         text: `Data Deleted Successfully`,
        //     //     });


        //     // }
        // } catch (error) {
        //     // Handle error
        //     console.log('Error deleting data:' + error);
        // }
    }


    const columnData = [
        { title: 'Unique Key(Auto Generated)', field: 'unique_key' },
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
        { title: 'External Alarm Confirmation', field: 'External_Alarm_Confirmation' },
        { title: 'SOFT AT STATUS', field: 'SOFT_AT_STATUS' },
        { title: 'LICENCE Status', field: 'LICENCE_Status' },
        { title: 'ESN NO', field: 'ESN_NO' },
        { title: 'Responsibility for alarm clearance', field: 'Responsibility_for_alarm_clearance' },
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
        { title: 'SPOC NAME', field: 'spoc_name' },
        { title: 'Offering Type', field: 'offering_type' },
        { title: 'First Offering Date', field: 'first_offering_date' },
        { title: 'Soft At Status', field: 'soft_at_status' },
        { title: 'Offering Date', field: 'offering_date' },
        { title: 'Acceptance / Rejection Date', field: 'acceptance_rejection_date' },
        { title: 'Alarm Bucket', field: 'alarm_bucket' },
        { title: 'Alarm Details', field: 'alarm_details' },
        { title: 'Final Responsibility (Circle Team/UBR Team/NOC Team)', field: 'final_responsibility' },
        { title: 'Workable/Non-Workable', field: 'workable_non_workable' },
        { title: 'UBR MS2 Status', field: 'ubr_ms2_status' },
        { title: 'UBR Link ID', field: 'ubr_link_id' },
        { title: 'TWAMP Status', field: 'twamp_status' },
        { title: 'Status Check Date', field: 'status_check_date' },
        { title: 'Ageing (in days)', field: 'ageing_in_days' },
        { title: 'Actual Ageing', field: 'actual_ageing' },
        { title: 'TOCO Partner', field: 'toco_partner' },
        { title: 'Support required from UBR Team', field: 'support_required_ubr_team' },
        { title: 'Support required from Circle Team', field: 'support_required_circle_team' },
        { title: 'Support required from NOC Team', field: 'support_required_noc_team' },
        { title: 'Category (HW/Media/Infra)', field: 'category' },
        { title: 'Problem Statement in detail', field: 'problem_statement' },
        { title: 'Final Remarks', field: 'final_remarks' },
        { title: 'MS1', field: 'ms1' },
        {
            title: 'Actions',
            field: 'actions',
            render: rowData => (<>
                <IconButton aria-label="delete" title={'Edit'} size="large" onClick={() => { handleEdit(rowData) }}>
                    <DriveFileRenameOutlineIcon
                        style={{ cursor: 'pointer' }}
                        color='success'
                    />
                </IconButton>
                <IconButton aria-label="delete" title={'Delete'} size="large" onClick={() => { handleDelete(rowData) }}>
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
            console.log('status oem', item.AT_STATUS)
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


    }, [open, editData])

    useEffect(() => {

        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])

    const downloadExcel = (data) => {
        // **************** FILEFY DEPENDANCY *****************
        var csvBuilder = new CsvBuilder(`soft_at_circle_wise_status.csv`)
            .setColumns(columnData.map(item => item.title))
            .addRows(data.map(row => columnData.map(col => row[col.field])))
            .exportFile();
    }

    return (
        <>
            <div style={{ margin: '1% 1%' }}>
                <MaterialTable
                    title={'Soft AT Data'}
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

                            onClick: (evt, data) => {console.log('data', data)},
                            isFreeAction: true
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

export default React.memo(CircleWiseStatus)