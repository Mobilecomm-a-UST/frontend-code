import React from 'react'

const Site_List = () => {
    const listData = JSON.parse(localStorage.getItem("wpr_project_site_list"))
    const site_list = listData.list
    console.log('ataa', listData.list)
  
  return (
    <>
    <div style={{ margin: 10 }}>
      <table border="3" style={{ width: "100%", border: "2px solid" }}>
        <thead style={{ position: 'sticky', top: 0 }}>
          <tr>
            <th colspan="2" style={{ fontSize: 24, backgroundColor: "#AF7AC5", color: "black", }}>Overall Project Wise</th>
          </tr>
          <tr style={{ fontSize: 20, backgroundColor: "#223354", color: "white", }}>
            <th>Project</th>
            <th> {listData.site}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th style={{fontSize:"22px"}}>{listData.project}</th>
            <th style={{textAlign:'center'}}>
            <ol>
              {site_list?.map((item)=>(
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

export default Site_List