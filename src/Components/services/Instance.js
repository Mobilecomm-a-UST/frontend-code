import React from 'react'
import axios from 'axios';



const Instance = axios.create({
    // baseURL: 'http://127.0.0.1:8003',
    withCredentials: true,
       headers:{
        'Content-Type':'application/json'
       },


    // Enable sending cookies with requests
  });

export default Instance