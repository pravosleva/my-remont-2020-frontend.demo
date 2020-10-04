import React from 'react'
import { Grid } from '@material-ui/core'

export const SiteLayout: React.FC = ({ children }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10px' }}>{children}</div>
      </Grid>
    </Grid>
  )
}
