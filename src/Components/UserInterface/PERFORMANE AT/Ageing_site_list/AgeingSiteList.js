import React from 'react'
import {useEffect}from 'react'

const AgeingSiteList = () => {
  const listData = JSON.parse(localStorage.getItem("site_list"))
  const site_list = listData.list
  console.log('ataa', listData.list)
  useEffect(()=>{
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
  },[])

  return (
    <>
      <div style={{ margin: 10 }}>
        <table border="3" style={{ width: "100%", border: "2px solid" }}>
          <thead style={{ position: 'sticky', top: 0 }}>
            <tr>
              <th colspan="2" style={{ fontSize: 24, backgroundColor: "#AF7AC5", color: "black", }}>Ageing (Circle Wise)</th>
            </tr>
            <tr style={{ fontSize: 20, backgroundColor: "#223354", color: "white", }}>
              <th>Circle</th>
              <th>Ageing at {listData.ageing}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th style={{fontSize:"22px"}}>{listData.circle}</th>
              <th style={{textAlign:'center'}}>
              <ol>
                {site_list.map((item)=>(
                  <tr>
                     <td style={{fontSize:'18px', fontWeight:'bold',marginLeft:'auto',marginRight:'auto'}}>
                      <li> {item}</li>
                      </td>
                  </tr>
                 ))}
                </ol>
              </th>
            </tr>
          </tbody>

        </table>
      </div>
    </>
  )

}

export default AgeingSiteList