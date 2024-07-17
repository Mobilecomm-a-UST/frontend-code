import React, { useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
import { postData } from '../../../../../services/FetchNodeServices';
import DownloadIcon from '@mui/icons-material/Download';
import { CsvBuilder } from 'filefy';





function toCamelCase(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }

const OemEriccson = () => {
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
      { title: 'AOP', field: 'AOP' },
      { title: 'OEM', field: 'OEM' },
      { title: 'Offered_AT_Type', field: 'Offered_AT_Type' },
      {title: 'Site_ID', field: 'Site_ID'},
      { title: 'Physical_Site_Id', field: 'Site_ID_4G' },
      { title: 'Layers_Other_Tech_Info', field: 'Layers_Other_Tech_Info' },
      { title: 'RET_Configuration_Cell_Name', field: 'RET_Configuration_Cell_Name' },
      { title: 'RET_Configured_On_Layer', field: 'RET_Configured_On_Layer' },
      { title: 'Parent_Cell_Name_In_Case_Of_Twin_Beam', field: 'Parent_Cell_Name_In_Case_Of_Twin_Beam' },
      { title: 'On_Air_Date', field: 'On_Air_Date' },
      { title: 'Activity_Name', field: 'Activity_Name' },
      { title: 'Cell_Name_New', field: 'Cell_Name_New' },
      { title: 'MO_Name', field: 'MO_Name' },
      { title: 'Node_IP', field: 'Node_IP' },
      { title: 'OSS_Name_IP', field: 'OSS_Name_IP' },
      { title: 'BSC_In_Case_Of_NT_2G', field: 'BSC_In_Case_Of_NT_2G' },
      { title: 'OSS_ENM_For_BSC_In_Case_Of_NT_2G', field: 'OSS_ENM_For_BSC_In_Case_Of_NT_2G' },
      { title: 'TAC_Name', field: 'TAC_Name' },
      { title: 'Cells_Configrution', field: 'Cells_Configrution' },
      { title: 'Sceario_In_Case_Of_Swap', field: 'Sceario_In_Case_Of_Swap' },
      { title: 'Hardware_RRU', field: 'Hardware_RRU' },
      { title: 'Hardware_BBU', field: 'Hardware_BBU' },
      { title: 'Antenna', field: 'Antenna' },
      { title: 'CPRI', field: 'CPRI' },
      { title: 'SW_Version', field: 'SW_Version' },
      { title: 'Sync_Status_GPS_clock_NTP', field: 'Sync_Status_GPS_clock_NTP' },
      { title: 'AT_Offering_Date', field: 'AT_Offering_Date' },
      { title: 'MIMO_Power_configuration', field: 'MIMO_Power_configuration' },
      { title: 'Media_Type', field: 'Media_Type' },
      { title: 'Link_id', field: 'Link_id' },
      { title: 'Project_remarks', field: 'Project_remarks' },
      { title: 'AT_STATUS', field: 'AT_STATUS' },
      { title: 'AT_Remarks', field: 'AT_Remarks' },
      { title: 'Date_Time', field: 'Date_Time' }

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
      // useEffect(()=>{
          document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
      //   },[])
  }, [])

  const downloadExcel = (data) => {


    // **************** FILEFY DEPENDANCY *****************
    var csvBuilder = new CsvBuilder(`OEM_Ericsson_${status}.csv`)
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

export default OemEriccson