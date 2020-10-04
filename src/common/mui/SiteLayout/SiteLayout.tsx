import React, { useState, useCallback } from 'react'
import { Grid } from '@material-ui/core'
import { BreadCrumbs } from './components/BreadCrumbs'
import { MainContext } from '~/common/context/MainContext'

export const SiteLayout: React.FC = ({ children }) => {
  const [projectName, setProjectName] = useState<string | null>(null)
  const handleResetCurrentProject = useCallback(() => {
    setProjectName(null)
  }, [setProjectName])

  return (
    <MainContext.Provider
      value={{
        projectName,
        setProjectName,
        resetProjectName: handleResetCurrentProject,
      }}
    >
      <Grid container spacing={0}>
        <div
          style={{
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <BreadCrumbs />
        </div>
        <Grid item xs={12}>
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              padding: '10px',
              maxHeight: 'calc(100vh - 70px)',
              overflowY: 'auto',
              borderTop: '1px solid lightgray',
            }}
          >
            {children}
          </div>
        </Grid>
      </Grid>
    </MainContext.Provider>
  )
}
