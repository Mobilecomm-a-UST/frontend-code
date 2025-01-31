import React, { useEffect, useState } from 'react'
import SleepingCell from './SleepingCell'
import TicketDashboard from './TicketDashboard'
import { Slide } from '@mui/material'

const Graphs = () => {
    const [type,setType] = useState(false)

    useEffect(()=>{
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
        setType(true)
    },[])

  return (
    <>
        <div>
            {type && <TicketDashboard/>}
        </div>
        <div>
            {type && <SleepingCell/>}
        </div>
        
    </>
  )
}

export default Graphs