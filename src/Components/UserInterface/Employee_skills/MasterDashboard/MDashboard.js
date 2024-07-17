import React, { useEffect } from 'react'
import { useGet } from '../../../Hooks/GetApis'



const MDashboard = () => {
    const {makeGetRequest} = useGet()


    const fetchDashData=async()=>{
        const responce = await makeGetRequest("IntegrationTracker/overall-record-summary/")
        if(responce){
            console.log('master dashboard' ,JSON.parse(responce.table_data) )
        }

    }

    useEffect(()=>{
        fetchDashData()
    },[])

    const data = {
        OEM: 'NOKIA',
        from_integration_date: '2024-04-01',
        to_integration_date: '2024-05-19',
        record_count: '1025'
      };

  return (<>
  <style></style>
  {/* <div><Dashboard data={data}/></div> */}
  </>

  )
}

const Dashboard = ({ data }) => {
    return (
      <div className="dashboard">
        <h1>Integration Dashboard</h1>
        <div className="card">
          <h2>OEM</h2>
          <p>{data.OEM}</p>
        </div>
        <div className="card">
          <h2>From Integration Date</h2>
          <p>{data.from_integration_date}</p>
        </div>
        <div className="card">
          <h2>To Integration Date</h2>
          <p>{data.to_integration_date}</p>
        </div>
        <div className="card">
          <h2>Record Count</h2>
          <p>{data.record_count}</p>
        </div>
      </div>
    );
  };


export default MDashboard