import React from 'react'
// import { Link } from 'react-router-dom'
// import { Grid, List, ListItem, ListItemText } from '@material-ui/core'
// import { useStyles } from './styles'
// import { useRouter } from '~/common/hooks/useRouter'
import { ResponsiveBlock } from '~/common/mui/ResponsiveBlock'

export const TryUi = () => {
  // const classes = useStyles()
  // const router = useRouter()
  // const goToPage = useCallback(
  //   (link: string) => () => {
  //     router.push(link)
  //   },
  //   [router]
  // )

  return (
    <>
      <ResponsiveBlock isLimited>
        <h1>Try UI</h1>
      </ResponsiveBlock>
      <ResponsiveBlock
        isPaddedMobile
        style={{
          marginTop: '16px',
          marginBottom: '16px',
          border: '1px solid red',
        }}
      >
        ResponsiveBlock: isPaddedMobile
      </ResponsiveBlock>
      <ResponsiveBlock
        isLimited
        style={{
          marginTop: '16px',
          marginBottom: '16px',
          border: '1px solid red',
        }}
      >
        ResponsiveBlock: isLimited
      </ResponsiveBlock>
      <ResponsiveBlock
        style={{
          marginTop: '16px',
          marginBottom: '16px',
          border: '1px solid red',
        }}
      >
        ResponsiveBlock
      </ResponsiveBlock>
    </>
  )
}
