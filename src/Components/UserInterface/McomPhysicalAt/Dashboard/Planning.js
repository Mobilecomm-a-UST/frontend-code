import React from 'react'
import { Grid, TextField, Button, MenuItem } from '@mui/material';




const SiteTypeSelect = ['IM', 'TTI', 'TTO', 'TBO', 'OM', 'TBI', 'MI', 'IB', 'OD', 'COW', 'FSC', 'ISC', 'TO', 'IS', 'HS', 'UL', 'AD', 'CO', 'ES', 'AR', 'FM', 'OR', 'SC']

const Planning = () => {
  return (
    <>
      <style>{"th{background-color: #ffe4e4;padding: 5px}"}</style>
      <div style={{ backgroundColor: '#fdecec', padding: '20px', borderRadius: '8px' }}>
        <Grid container spacing={2}>
          {/* First Row */}
          <Grid item xs={3}>
            <TextField label="Tech ID" variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Technology" variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Band" variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Upgrade" variant="outlined" size="small" fullWidth />
          </Grid>

          {/* Second Row */}
          <Grid item xs={3}>
            <TextField label="SWAP" variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Physical Site ID" variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Site Type (IM/OM/SC/FC etc.)"
              variant="outlined"
              size="small"
              fullWidth
              select
            >
              {SiteTypeSelect.map((item, index) => (
                <MenuItem value={item} key={index}>{item}</MenuItem>
              ))}

            </TextField>
          </Grid>
        </Grid>

        <div style={{ marginTop: '20px', backgroundColor: '#ffd6d6', padding: '15px', borderRadius: '8px' }}>
          <table style={{ border: '1px solid black', display: "table", width: '100%' }}>
            <tr>
              <th>Type</th>
              <th>Tower type (As mentioned in DPR)	</th>
              <th>Tower Height</th>
              <th>Building Height</th>
            </tr>
            <tr>
              <th>Airtel Planned</th>
              <th>
                <TextField variant="outlined" size="small" fullWidth select>
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Angular">Angular</MenuItem>
                  <MenuItem value="Tabular">Tabular</MenuItem>
                  <MenuItem value="Pole">Pole</MenuItem>
                  <MenuItem value="Monopole">Monopole</MenuItem>
                  <MenuItem value="IBS">IBS</MenuItem>
                  <MenuItem value="NA">NA</MenuItem>
                </TextField>
              </th>
              <th>
                <TextField variant="outlined" size="small" fullWidth />
              </th>
              <th>
                <TextField variant="outlined" size="small" fullWidth />
              </th>
            </tr>
            <tr>
              <th></th>
              <th>Airtel Planned AGL</th>
              <th>Airtel Planned Electrical Tilt</th>
              <th>Airtel Planned Mechanical Tilt</th>
              <th>Airtel Planned Azimuth</th>
            </tr>
            {/* Sector A */}
            <tr>
              <th>
                <TextField disabled value={'Sector A'} variant="outlined" size="small" fullWidth />
              </th>
              <th>
                <TextField variant="outlined" size="small" fullWidth />
              </th>
              <th>
                <TextField variant="outlined" size="small" fullWidth />
              </th>
              <th>
                <TextField variant="outlined" size="small" fullWidth />
              </th>
              <th>
                <TextField variant="outlined" size="small" fullWidth />
              </th>
            </tr>
            {/* Sector B */}
            <tr>
              <th>
                <TextField disabled value={'Sector B'} variant="outlined" size="small" fullWidth />
              </th>
              <th>
                <TextField variant="outlined" size="small" fullWidth />
              </th>
              <th>
                <TextField variant="outlined" size="small" fullWidth />
              </th>
              <th>
                <TextField variant="outlined" size="small" fullWidth />
              </th>
              <th>
                <TextField variant="outlined" size="small" fullWidth />
              </th>
            </tr>
            {/* Sector C */}
            <tr>
              <th>
                <TextField disabled value={'Sector A'} variant="outlined" size="small" fullWidth />
              </th>
              <th>
                <TextField variant="outlined" size="small" fullWidth />
              </th>
              <th>
                <TextField variant="outlined" size="small" fullWidth />
              </th>
              <th>
                <TextField variant="outlined" size="small" fullWidth />
              </th>
              <th>
                <TextField variant="outlined" size="small" fullWidth />
              </th>
            </tr>
          </table>


   
      
        </div>
      </div>
    </>
  )
}

export default React.memo(Planning) 