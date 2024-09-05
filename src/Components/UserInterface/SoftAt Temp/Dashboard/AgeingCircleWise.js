import React, { useState, useEffect } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { postData } from './../../../services/FetchNodeServices'
import { useStyles } from './../../ToolsCss'
import Zoom from '@mui/material/Zoom';


const AgeingCircleWise = () => {
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('')
  const [week, setWeek] = useState('')
  const [todayDate, setTodayDate] = useState()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedYear, setSelectedYear] = useState(JSON.stringify(new Date().getFullYear()))
  const [pendingData,setPendingData] = useState([])
  const [ageingData,setAgeingData] = useState([])
  const classes = useStyles()
  const [project,setProject]=useState('')


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
    setAgeingData(response.ageing_circleWise)
  }
       // ********** Ageing Circle Wise Table Data **********////
const tableAgeingData=()=>
{
  var arr = [];
  if (ageingData != null) {
    Object.keys(ageingData)?.map((item) => {
      arr.push({ ...ageingData[item], circle: item });
    });
  }

  return arr?.map((item, index) => {
    if (item.circle == 'Total') {
      return (
        <>
          <tr key={index} style={{ textAlign: "center", backgroundColor: '#DC7633', fontSize: 18, fontWeight: 'bold',color:'white' }}>
            <td style={{border:'1px solid black'}}>{item.circle}</td>
            <td style={{border:'1px solid black'}}>{item.ageing_0_15}</td>
            <td style={{border:'1px solid black'}}>{item.ageing_16_30}</td>
            <td style={{border:'1px solid black'}}>{item.ageing_31_60}</td>
            <td style={{border:'1px solid black'}}>{item.ageing_61_90}</td>
            <td style={{border:'1px solid black'}}>{item.ageing_GT90}</td>
            <td style={{border:'1px solid black'}}>{item.Total}</td>
          </tr>
        </>

      )
    }
    else {
      return (
        <>
          <tr key={index} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
            <td style={{ fontWeight: 'bold',border:'1px solid black' }} >{item.circle}</td>
            <td style={{ fontWeight: 'bold',border:'1px solid black' }}>{item.ageing_0_15}</td>
            <td style={{ fontWeight: 'bold',border:'1px solid black' }}>{item.ageing_16_30}</td>
            <td style={{ fontWeight: 'bold',border:'1px solid black' }}>{item.ageing_31_60}</td>
            <td style={{ border:'1px solid black', backgroundColor: item.Rejected > 0 ? "#F96A56" : "", fontWeight: 'bold' }}>{item.ageing_61_90}</td>
            <td style={{ fontWeight: 'bold',border:'1px solid black' }}>{item.ageing_GT90}</td>
            <td style={{ fontWeight: 'bold',border:'1px solid black' }}>{item.Total}</td>
          </tr>
        </>

      )
    }

  })
}

    useEffect(() => {
      fetchCircle();
      document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
    }, [])
  return (
    <Zoom in='true' timeout={500} mountOnEnter unmountOnExit>
    <div style={{ margin: 22 }}>
          <div >
        <TableContainer sx={{ maxHeight: 540,marginTop:3 }} component={Paper}>

          <table border="3" style={{ width: "100%", border: "2px solid" }}>
            <tr>
              <th colspan="7" style={{ fontSize: 24, backgroundColor: "#F4D03F", color: "black", }}>Ageing (Circle Wise)</th>
            </tr>
            <tr style={{ fontSize: 19, backgroundColor: "#223354", color: "white", }}>
              <th>Circle</th>
              <th>0-15</th>
              <th>16-30</th>
              <th>31-60</th>
              <th>61-90</th>
              <th>GT-90</th>
              <th>Total</th>
            </tr>
            {tableAgeingData()}
          </table>
        </TableContainer>
          </div>
    </div>
    </Zoom>
  )
}

export default AgeingCircleWise