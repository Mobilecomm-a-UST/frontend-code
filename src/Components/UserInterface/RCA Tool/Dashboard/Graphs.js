import React, { useEffect, useState } from 'react'
import  { MemoSleepingCell } from './SleepingCell'
import { MemoTicketDashboard } from './TicketDashboard'
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
            {type && <MemoTicketDashboard/>}
        </div>
        <div>
            {type && <MemoSleepingCell/>}
        </div>
        
    </>
  )
}

export default Graphs