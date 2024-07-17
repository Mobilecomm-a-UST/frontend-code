import React, { useEffect,useState } from 'react'
import MaterialTable from '@material-table/core'
import DownloadIcon from '@mui/icons-material/Download';
import { CsvBuilder } from 'filefy';

const SiteIdSamsung = () => {
    const listData = JSON.parse(localStorage.getItem("2G_site_ID"))
    const [selectedRows, setSelectedRows] = useState()
    const [site_ID, setSite_ID] = useState()
    const [status , setStatus] = useState()

    const handleLinkClick = async(rowData) => {
        // Your custom logic when a link is clicked

        console.log('Link Clicked:', rowData);
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
        { title: 'Date_Time', field: 'Date_Time', render: rowData =>( handleTime(rowData.Date_Time)) },
        { title: 'OEM', field: 'OEM' },
        { title: 'TSP', field: 'TSP' },
        { title: 'Site_ID_2G', field: 'Site_ID_2G', render: rowData => (
            <a   onClick={event => handleLinkClick(rowData)}>
              {rowData.Site_ID_2G}
            </a>) },
        { title: 'Site_ID_4G_MRBTS_ID', field: 'Site_ID_4G_MRBTS_ID' },
        { title: 'SR_UNIQUE_Project_ID', field: 'SR_UNIQUE_Project_ID' },
        { title: 'AT_Type', field: 'AT_Type' },
        { title: 'Physical_Cascade_ID', field: 'Physical_Cascade_ID' },
        { title: 'Technology', field: 'Technology' },
        { title: 'Other_Tech_Info_Band', field: 'Other_Tech_Info_Band' },
        { title: 'On_Air_Date', field: 'On_Air_Date' },
        { title: 'Activity_Type_Swap_New_Site', field: 'Activity_Type_Swap_New_Site' },
        { title: 'Parent_Cell_Id_Name_In_Case_Of_Twin_Beam', field: 'Parent_Cell_Id_Name_In_Case_Of_Twin_Beam' },
        { title: 'Newly_Added_In_Case_Of_SA_Twin_Beam_MIMO_Cell_Id_Name', field: 'Newly_Added_In_Case_Of_SA_Twin_Beam_MIMO_Cell_Id_Name' },
        { title: 'Node_4G_IP_Mplane_IP', field: 'Node_4G_IP_Mplane_IP' },
        { title: 'OSS_Name', field: 'OSS_Name' },
        { title: 'OSS_IP', field: 'OSS_IP' },
        { title: 'ENodeB_ID', field: 'ENodeB_ID' },
        { title: 'BSC_In_Case_Of_NT_2G', field: 'BSC_In_Case_Of_NT_2G' },
        { title: 'BSC_OSS_In_Case_Of_NT', field: 'BSC_OSS_In_Case_Of_NT' },
        { title: 'R_Site_Name_Ericsson_2G_BCF_ID_Nokia_2G', field: 'R_Site_Name_Ericsson_2G_BCF_ID_Nokia_2G' },
        { title: 'OLD_Cell_Count_No_Of_Cells', field: 'OLD_Cell_Count_No_Of_Cells' },
        { title: 'New_Cell_Count_No_Of_Cells', field: 'New_Cell_Count_No_Of_Cells' },
        { title: 'TRX_Configuration_in_case_of_2G', field: 'TRX_Configuration_in_case_of_2G' },
        { title: 'Site_4G_Configuration', field: 'Site_4G_Configuration' },
        { title: 'No_Of_RRU', field: 'No_Of_RRU' },
        { title: 'Other_Hardware_Related_Additional_Information', field: 'Other_Hardware_Related_Additional_Information' },
        { title: 'TAC', field: 'TAC' },
        { title: 'MME_IP', field: 'MME_IP' },
        { title: 'SGW_IP', field: 'SGW_IP' },
        { title: 'VSWR_current_value', field: 'VSWR_current_value' },
        { title: 'BBU_Type_Model', field: 'BBU_Type_Model' },
        { title: 'OD_ID_Configuration', field: 'OD_ID_Configuration' },
        { title: 'RET_Configuration', field: 'RET_Configuration' },
        { title: 'hrs24_Alarm_History', field: 'hrs24_Alarm_History' },
        { title: 'NE_Version', field: 'NE_Version' },
        { title: 'Integration_Date', field: 'Integration_Date' },
        { title: 'SW_Version', field: 'SW_Version' },
        { title: 'Sync_status_GPS_clock_NTP', field: 'Sync_status_GPS_clock_NTP' },
        { title: 'GPL_compliance', field: 'GPL_compliance' },
        { title: 'LMS_compliance', field: 'LMS_compliance' },
        { title: 'Power_compliance', field: 'Power_compliance' },
        { title: 'IFLB_Compliance', field: 'IFLB_Compliance' },
        { title: 'CA_compliance', field: 'CA_compliance' },
        { title: 'QoS_Compliance', field: 'QoS_Compliance' },
        { title: 'Ducting_compliance', field: 'Ducting_compliance' },
        { title: 'Energy_saving_fetaures_compliance', field: 'Energy_saving_fetaures_compliance' },
        { title: 'Features_implemented_compliance', field: 'Features_implemented_compliance' },
        { title: 'Nomenclature_Compliance', field: 'Nomenclature_Compliance' },
        { title: 'PCI_RSI_PRACH_definition_compliance', field: 'PCI_RSI_PRACH_definition_compliance' },
        { title: 'Critical_Major_Alarms', field: 'Critical_Major_Alarms' },
        { title: 'Splitting_Details', field: 'Splitting_Details' },
        { title: 'RET_Details_Cell_Name', field: 'RET_Details_Cell_Name' },
        { title: 'Toco_Type_Shared_Anchor', field: 'Toco_Type_Shared_Anchor' },
        { title: 'Project_Remarks', field: 'Project_Remarks' },
        { title: 'Rejection_Remarks_in_Case_of_Re_offer', field: 'Rejection_Remarks_in_Case_of_Re_offer' },
        { title: 'All_approved_features_compliance_implemented', field: 'All_approved_features_compliance_implemented' },
        { title: 'Offer_Reoffer', field: 'Offer_Reoffer' },
        { title: 'Offer_Reoffer_Date', field: 'Offer_Reoffer_Date' },
        { title: 'Kolkata_GPL_Type', field: 'Kolkata_GPL_Type' },
        { title: 'Scope', field: 'Scope' },
        { title: 'External_Alarm_Status_YES_NO', field: 'External_Alarm_Status_YES_NO' },
        { title: 'LTE_Technology_for_GPL_Validation', field: 'LTE_Technology_for_GPL_Validation' },
        { title: 'Carrier_Type', field: 'Carrier_Type' },
        { title: 'Radio_Unit_Info_Connected_digital_unit_port_id', field: 'Radio_Unit_Info_Connected_digital_unit_port_id' },
        { title: 'Type_of_Media', field: 'Type_of_Media' },
        { title: 'MW_Link_Id_Ckt_Id', field: 'MW_Link_Id_Ckt_Id' },
        { title: 'AT_STATUS', field: 'AT_STATUS' },
        { title: 'AT_Remarks', field: 'AT_Remarks' },
    ]


    const getStatus=()=>{
        var arr =[]
          listData?.map((item)=>{
            console.log('status oem' , item.AT_STATUS)
            arr.push(item.AT_STATUS)
          })
         setStatus(`( ${[...new Set(arr)]} )`);
    }
    const getSiteID=()=>{
        var arr = []
        listData?.map((item) => {
            // console.log('status oem', item.Site_ID_2G)
            arr.push(item.Site_ID_2G)
        })
        setSite_ID(`${[...new Set(arr)]}`);
    }

    useEffect(()=>{
        getStatus();
        getSiteID();
        // useEffect(()=>{
            document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
        //   },[])
    },[])



    function renameKey(obj, oldKey, newKey) {
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
    }

    const downloadExcel = (data) => {


        // **************** FILEFY DEPENDANCY *****************
        var csvBuilder = new CsvBuilder(`OEM_Samsung_${status}_${site_ID}.csv`)
            .setColumns(columnData.map(item => item.title))
            .addRows(data.map(row => columnData.map(col => row[col.field])))
            .exportFile();

    }
  return (
    <div style={{ margin: '2% 4%' }}>
            <MaterialTable
                title={'OEM SAMSUNG ' + status +' '+site_ID}
                columns={columnData}
                data={listData}
                onSelectionChange={(rows) => setSelectedRows(rows)}
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

export default SiteIdSamsung