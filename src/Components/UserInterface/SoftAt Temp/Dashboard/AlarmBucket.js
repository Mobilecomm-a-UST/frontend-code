import React, { useState, useEffect } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { postData } from './../../../services/FetchNodeServices'
import { useStyles } from './../../ToolsCss'
import Zoom from '@mui/material/Zoom';

const AlarmBucket = () => {
    const [date, setDate] = useState('');
    const [month, setMonth] = useState('')
    const [week, setWeek] = useState('')
    const [todayDate, setTodayDate] = useState()
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [selectedYear, setSelectedYear] = useState(JSON.stringify(new Date().getFullYear()))
    const [alarmBucket, setAlarmBucket] = useState([])
    const classes = useStyles()
    const [project,setProject]=useState('')


    console.log('Pending data:', selectedYear)

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

        setAlarmBucket(response.alarm_bucketization)
    }

    // *********** Alarm Bucket Table Data *******/
    const alarmTableData = () => {
        var arr = [];
        if (alarmBucket != null) {
            Object.keys(alarmBucket)?.map((item, index) => {

                arr.push({ ...alarmBucket[item], row_labels: item });

            });
        }

        console.log('alarm Bucket Data :', arr)

        return arr.map((item, index) => {
            if (item.row_labels == 'Grand Total') {
                return (
                    <tr key={index} style={{ textAlign: "center", backgroundColor: '#E67E22', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                        <td style={{border:'1px solid black'}}>{item.row_labels}</td>
                        <td style={{border:'1px solid black'}}>{item.Count_of_Alarm_Bucket}</td>
                    </tr>
                )
            }
            else {
                return (
                    <tr key={index} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                        <td style={{ fontWeight: 'bold',border:'1px solid black' }}>{item.row_labels}</td>
                        <td style={{ fontWeight: 'bold',border:'1px solid black'}}>{item.Count_of_Alarm_Bucket}</td>
                    </tr>
                )
            }
        })
    }


    useEffect(() => {
        fetchCircle();
        // useEffect(()=>{
            // document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`

        //    },[])
    }, [])
    return (
        <Zoom in='true' timeout={500} >
        <div style={{ margin: 20 }}>
            <TableContainer sx={{ maxHeight: 500, marginTop: 3 }} component={Paper}>

                <table border="3" style={{ width: "100%", border: "2px solid" }}>
                    <tr>
                        <th colspan="2" style={{ fontSize: 24, backgroundColor: "green", color: "white", }}>Alarm Bucket</th>
                    </tr>
                    <tr style={{ fontSize: 20, backgroundColor: "#223354", color: "white", }}>
                        <th>Row Labels</th>
                        <th>Count of Alarm Bucket</th>
                    </tr>

                    {alarmTableData()}
                </table>
            </TableContainer>
        </div>
        </Zoom>
    )
}

export default AlarmBucket