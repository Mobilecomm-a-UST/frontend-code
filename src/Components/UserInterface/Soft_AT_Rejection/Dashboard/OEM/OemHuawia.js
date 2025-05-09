import React, { useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
import { postData } from '../../../../services/FetchNodeServices';
import DownloadIcon from '@mui/icons-material/Download';
import { CsvBuilder } from 'filefy';





function toCamelCase(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }

const OemHuawia = () => {
    const listData = JSON.parse(localStorage.getItem("oem_data"))
    const [status, setStatus] = useState()
    const [selectedRows, setSelectedRows] = useState()

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

    const handleTime=(data)=>{
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

        return(
            <div>
                {day}/{month}/{year} {formattedDateTime}
            </div>
        )
    }


    const columnData = [
        { title: 'Circle', field: 'Circle' },
        { title: 'Date_Time', field: 'Date_Time' , render: rowData =>( handleTime(rowData.Date_Time))},
        { title: 'REGION', field: 'REGION' },
        { title: 'OEM', field: 'OEM' },
        { title: 'TSP', field: 'TSP' },
        {
            title: 'Site_ID_2G', field: 'Site_ID_2G',
            render: rowData => (
                <a onClick={event => handleLinkClick(rowData)}>
                    {rowData.Site_ID_2G}
                </a>)
        },
        { title: 'Site_ID_4G', field: 'Site_ID_4G' },
        { title: 'Cell_ID_Parent', field: 'Cell_ID_Parent' },
        { title: 'Cell_ID_New', field: 'Cell_ID_New' },
        { title: 'Technology', field: 'Technology' },
        { title: 'Other_Tech_Info', field: 'Other_Tech_Info' },
        { title: 'On_Air_Date', field: 'On_Air_Date' },
        { title: 'Activity', field: 'Activity' },
        { title: 'Unique_ID', field: 'Unique_ID' },
        { title: 'Type_of_Cell', field: 'Type_of_Cell' },
        { title: 'Frequency_Band', field: 'Frequency_Band' },
        { title: 'MME_0', field: 'MME_0' },
        { title: 'MME_1', field: 'MME_1' },
        { title: 'MME_2', field: 'MME_2' },
        { title: 'MME_3', field: 'MME_3' },
        { title: 'MME_4', field: 'MME_4' },
        { title: 'SGW_IP', field: 'SGW_IP' },
        { title: 'UPEU_Count', field: 'UPEU_Count' },
        { title: 'VSWR_Alarm_Threshold', field: 'VSWR_Alarm_Threshold' },
        { title: 'Sync_Status_GPS_status_IP', field: 'Sync_Status_GPS_status_IP' },
        { title: 'EMF_Status_Yes_No', field: 'EMF_Status_Yes_No' },
        { title: 'BSC_RNC_detail', field: 'BSC_RNC_detail' },
        { title: 'OSS', field: 'OSS' },
        { title: 'OSS_IP', field: 'OSS_IP' },
        { title: 'Site_OSS_Name', field: 'Site_OSS_Name' },
        { title: 'PHYSICAL_ID', field: 'PHYSICAL_ID' },
        { title: 'TRX_configuration_Detail_900', field: 'TRX_configuration_Detail_900' },
        { title: 'TRX_configuration_Detail_900_Required', field: 'TRX_configuration_Detail_900_Required' },
        { title: 'TRX_configuration_Detail_1800', field: 'TRX_configuration_Detail_1800' },
        { title: 'TRX_configuration_Detail_1800_Required', field: 'TRX_configuration_Detail_1800_Required' },
        { title: 'Sector_Count', field: 'Sector_Count' },
        { title: 'TX_RX_configuration_Detail', field: 'TX_RX_configuration_Detail' },
        { title: 'Type_Physical_AT_Soft_AT', field: 'Type_Physical_AT_Soft_AT' },
        { title: 'Offer_Reoffer', field: 'Offer_Reoffer' },
        { title: 'Offer_Reoffer_date', field: 'Offer_Reoffer_date' },
        { title: 'LAC', field: 'LAC' },
        { title: 'TAC', field: 'TAC' },
        { title: 'LAST_REJECTION_REMARKS', field: 'LAST_REJECTION_REMARKS' },
        { title: 'RET_Status', field: 'RET_Status' },
        { title: 'AT_STATUS', field: 'AT_STATUS' },
        { title: 'AT_Remarks', field: 'AT_Remarks' }
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
        getStatus();
    }, [])


    function renameKey(obj, oldKey, newKey) {
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
    }

    const downloadExcel = (data) => {

        //  const workSheet = XLSX.utils.json_to_sheet(data)
        //  const workBook = XLSX.utils.book_new()
        //  XLSX.utils.book_append_sheet(workBook,workSheet,'vendorReport')
        // // Buffer
        // let buf = XLSX.write(workBook,{bookType:"xlsx",type:"buffer"})
        // // Binary string
        // XLSX.write(workBook,{bookType:"xlsx",type:"binary"})
        // // Download
        // XLSX.writeFile(workBook,"vendorReport.xlsx")


        // **************** FILEFY DEPENDANCY *****************
        var csvBuilder = new CsvBuilder(`OEM_Huawia_${status}.csv`)
            .setColumns(columnData.map(item => item.title))
            .addRows(data.map(row => columnData.map(col => row[col.field])))
            .exportFile();

    }
    return (
        <div style={{ margin: '2% 4%' }}>
            <MaterialTable
                title={'OEM HUAWEI ' + status}
                columns={columnData}
                data={listData}
                onSelectionChange={(rows) => setSelectedRows(rows)}
                onRowClick={((evt, selectedRow) => console.log())}
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
                        color: '#FFF'
                    },

                }}
            />

        </div>
    )
}

export default OemHuawia