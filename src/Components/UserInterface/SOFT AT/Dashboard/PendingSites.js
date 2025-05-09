import React, { useState, useEffect } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { postData } from './../../../services/FetchNodeServices'
import { useStyles } from './../../ToolsCss'
import Zoom from '@mui/material/Zoom';

const PendingSites = (data) => {
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('')
  const [week, setWeek] = useState('')
  const [todayDate, setTodayDate] = useState()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedYear, setSelectedYear] = useState(JSON.stringify(new Date().getFullYear()))
  const [pendingData,setPendingData] = useState([])
  const classes = useStyles()
  const [project,setProject]=useState('')

    console.log('Pending data:',selectedYear)

    const fetchCircle = async () => {

        var formData = new FormData();
        formData.append("Date", date)
        formData.append("month", month)
        formData.append("week", week)
        formData.append('from_date', fromDate)
        formData.append('to_date', toDate)
        formData.append('year', selectedYear)
        formData.append('project', project)

        const response = await postData('Soft_At/view/', formData)
        console.log('lllllllll', response)

        setPendingData(response.pending_sites_bucketization)
      }

      // ********** Pending Table Data **********////
const tablePendingData=()=>
  {
    var arr = [];
    if (pendingData != null) {
      Object.keys(pendingData)?.map((item) => {
        arr.push({ ...pendingData[item], status: item });
      });
    }
    return arr?.map((item, index) => {
      if (item.status == 'Total') {
        return (
          <>
            <tr key={index} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold',color:'white' }}>
              <td style={{border:'1px solid black'}}>{item.status}</td>
              <td style={{border:'1px solid black'}}>{item.Circle_Team}</td>
              <td style={{border:'1px solid black'}}>{item.Circle_Team_NOC_Team}</td>
              <td style={{border:'1px solid black'}}>{item.circle_Team_Media_team}</td>
              <td style={{border:'1px solid black'}}>{item.NOC_Team}</td>
              <td style={{border:'1px solid black'}}>{item.Total}</td>
            </tr>
          </>

        )
      }
      else {
        return (
          <>
            <tr key={item} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
              <td  style={{ fontWeight: 'bold',border:'1px solid black' }} >{item.status}</td>
              <td  style={{ fontWeight: 'bold',border:'1px solid black' }}>{item.Circle_Team}</td>
              <td  style={{ fontWeight: 'bold',border:'1px solid black' }}>{item.Circle_Team_NOC_Team}</td>
              <td  style={{ border:'1px solid black', fontWeight: 'bold' }}>{item.circle_Team_Media_team}</td>
              <td  style={{ fontWeight: 'bold',border:'1px solid black' }}>{item.NOC_Team}</td>
              <td  style={{ fontWeight: 'bold' ,border:'1px solid black'}}>{item.Total}</td>
            </tr>
          </>

        )
      }

    })
  }

      useEffect(() => {
        fetchCircle();
        // useEffect(()=>{
          document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`

        //  },[])
      }, [])

  return (
    <Zoom in='true' timeout={500} mountOnEnter unmountOnExit>
    <div style={{ margin: 22 }}>
          <div >
        <TableContainer sx={{ maxHeight: 500,marginTop:3 }} component={Paper}>

          <table border="3" style={{ width: "100%", border: "2px solid" }}>
            <tr>
              <th colspan="6" style={{ fontSize: 24, backgroundColor: "#F4D03F", color: "black", }}>Pending Sites</th>
            </tr>
            <tr style={{ fontSize: 19, backgroundColor: "#223354", color: "white", }}>
              <th>Status</th>
              <th>Circle Team</th>
              <th>Circle / NOC Team</th>
              <th>Circle / Media Team</th>
              <th>NOC Team</th>
              <th>Grand Total</th>
            </tr>
            {tablePendingData()}
          </table>
        </TableContainer>
          </div>
    </div>
    </Zoom>
  )
}

export default PendingSites