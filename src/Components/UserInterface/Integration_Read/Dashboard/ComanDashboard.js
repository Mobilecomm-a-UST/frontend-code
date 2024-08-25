import React, { useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
import { postData } from '../../../services/FetchNodeServices';
import DownloadIcon from '@mui/icons-material/Download';
import { CsvBuilder } from 'filefy';
import { useParams } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { IconButton } from '@mui/material';
import { ServerURL } from '../../../services/FetchNodeServices';
import axios from 'axios';
import Swal from "sweetalert2";





function toCamelCase(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

const ComanDashboard = () => {
    const [listData, setListData] = useState(JSON.parse(localStorage.getItem("integration_final_tracker")))
    const [status, setStatus] = useState()
    const [selectedRows, setSelectedRows] = useState()
    const params = useParams()


    // console.log('table data', listData , params.name)

    const handleLinkClick = async (rowData) => {
        // Your custom logic when a link is clicked
        // console.log('Link Clicked:', toCamelCase(rowData.OEM));
        var formData = new FormData();

        formData.append('site_id', rowData.Site_ID_2G)
        formData.append('oem', toCamelCase(rowData.OEM))
        formData.append('status', rowData.AT_STATUS)

        const response = await postData('softat_rej/site_wise_view', formData)
        localStorage.setItem("2G_site_ID", JSON.stringify(response.data));
        // console.log('response data in huawia site id' , response)
        window.open(`${window.location.href}/site_id_2G`, "_blank")


    };

    const handleTime = (data) => {
        console.log('date and time ', data)
        var date = new Date(data)
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedDateTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        return (
            <div>
                {day}/{month}/{year} {formattedDateTime}
            </div>
        )
    }

    const handleDelete = async (rowData) => {
        axios.delete(`${ServerURL}/IntegrationTracker/delete-integration-record/${rowData.id}/`,{ headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}`},})
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
        // {
        //     title: 'Actions',
        //     field: 'actions',
        //     render: rowData => (
        //         <IconButton aria-label="delete" title={'Delete'} size="large"   onClick={() => { handleDelete(rowData) }}>
        //             <DeleteOutlineIcon
        //                 style={{ cursor: 'pointer' }}
        //                 color='error'
        //             />
        //         </IconButton>

        //     )
        // }

    ]


    const getStatus = () => {
        var arr = []
        listData?.map((item) => {
            console.log('status oem', item.AT_STATUS)
            arr.push(item.AT_STATUS)
        })
        setStatus(`( ${[...new Set(arr)]} )`);



    }

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
    )
}

export default ComanDashboard