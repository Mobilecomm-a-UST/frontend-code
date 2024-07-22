import React from 'react'

const Error = () => {
  return (
    <div style={{textAlign:'center',display:'flex',flexDirection:"column",justifyContent:'center',alignItems:'center',height:'100vh'}}>
        <h1>404 Error Pagein</h1>
        <p style={{fontSize:'14px',color:'black',fontWeight:'bold'}}>Sorry , This page does not exist !</p>
        <p style={{fontSize:'14px',color:'black',fontWeight:'bold'}}>or</p>
        <p style={{fontSize:'14px',color:'black',fontWeight:'bold'}}>You are not authorized to view this page</p>
    </div>
  )
}

export default Error