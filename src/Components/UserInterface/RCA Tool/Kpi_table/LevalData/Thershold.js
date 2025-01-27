import React, { useEffect } from 'react'
import { getData } from '../../../../services/FetchNodeServices'

const Thershold = () => {

    const fetchData=async()=>{
        let responce = await getData('data/thershold/');
        console.log('responce thershold' , responce)
    }

    useEffect(()=>{
        fetchData();

    },[])
  return (
    <div>Thershold</div>
  )
}

export default Thershold