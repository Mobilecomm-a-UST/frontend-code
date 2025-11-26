import axios from "axios"
import { getDecreyptedData } from "../utils/localstorage";


// const ServerURL = "http://192.168.0.182:8000"
// const ServerURL = "http://127.0.0.1:8001"
// const ServerURL = "http://192.168.1.7:8000/"
// const ServerURL = "http://192.168.0.146:8000"
// const ServerURL = "http://103.242.225.195:8000"
// const ServerURL = "http://192.168.0.44:8001"
// const ServerURL = "http://192.168.0.10:8000"
// const ServerURL = "http://103.242.225.195:8000";    
// const ServerURL = "http://122.176.141.197:8000";
const ServerURL = "https://commtoolapi.mcpspmis.com"
// const ServerURL = "http://54.234.191.244"
// const ServerURL = "http://13.233.231.179:80"
// const ServerURL = "http://13.233.231.179:8000"




const getData = async (url) => {
  try {
    var response = await fetch(`${ServerURL}/${url}`, {
      // headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }
      headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
    })
    var result = await response.json()
    return (result)

  } catch (e) {
    return (null)
  }
}

const putData = async (url, body) => {
  try {
    var response = await axios.put(`${ServerURL}/${url}`, body, {
      headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
    })
    var result = await response.data
    return (result)
  }
  catch (error) {
    console.log(error)
    return (false)
  }
}



const postData = async (url, body) => {
  try {
    var response = await axios.post(`${ServerURL}/${url}`, body, {
      headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
    })
  
    var result = await response.data
    return (result)
    
  }
  catch (error) {
    console.log(error)
    return (false)
  }
}

const deleteData = async (url, payload = {}) => {
  try {
    var response = await axios.delete(`${ServerURL}/${url}`, {
      headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` },
      ...payload // allows sending { data: {...} } or { params: {...} }
    })
    // console.log('delete api responce', response)
    var result = await response.data
    return (result)

  } catch (e) {
        console.log(e)
    return (null)
  }
}



const postDatas = async (url, body) => {
  try {

    var response = await axios.post(`${ServerURL}/${url}`,
      //  {headers: {Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` },
      // {  headers:{
      //   'Content-Type':'application/json'
      //  }},
      body)

    // console.log('tyyyy', response)
    var result = await response.data
    return (result)
  }
  catch (error) {
    console.log(error)

    return (false)
  }
}



export { ServerURL, postData, postDatas, getData, putData,deleteData }