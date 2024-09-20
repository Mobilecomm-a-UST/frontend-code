import axios from "axios"


// const ServerURL = "http://192.168.0.29:8001"
// const ServerURL = "http://127.0.0.1:8000"
// const ServerURL = "http://192.168.1.16:8001"
const ServerURL = "http://192.168.0.146:8000"
// const ServerURL = "http://103.242.225.195:8000"
// const ServerURL = "http://192.168.0.50:8001"
// const ServerURL = "http://192.168.0.164:8000"
// const ServerURL = "http://103.242.225.195:8000"
// const ServerURL = "http://192.168.137.190:8001"
// const ServerURL = "http://54.234.191.244"

// const ServerURL = "http://13.233.231.179:80"
// const ServerURL = "http://13.233.231.179:8000"
// npm install --save chart.js react-chartjs-2



const getData = async (url) => {
  try {
    var response = await fetch(`${ServerURL}/${url}`, {
      headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }
    })
    var result = await response.json()
    return (result)

  } catch (e) {
    return (null)
  }
}




const postData = async (url, body, token ) => {

  try {

    var response = await axios.post(`${ServerURL}/${url}`, body, token)
    var result = await response.data
    return (result)
  }
  catch (error) {
    console.log(error)

    return (false)
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



export { ServerURL, postData, postDatas, getData }