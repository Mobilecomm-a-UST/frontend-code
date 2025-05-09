import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ServerURL } from '../services/FetchNodeServices'
import { getDecreyptedData } from '../utils/localstorage'

const fetchAPIData=async()=>{
const responce = await axios.get(`${ServerURL}/Zero_Count_Rna_Payload_App/kpi_trend_2g_api`,{
             headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
      })

      return responce
}

export const useGetData = () => {
  return useQuery(`zero_RNA_2G_payLoad`,fetchAPIData)
}

