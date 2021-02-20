import React from 'react'
// import { Link } from 'react-router-dom'
// import { Grid, List, ListItem, ListItemText } from '@material-ui/core'
// import { useStyles } from './styles'
// import { useRouter } from '~/common/hooks/useRouter'
import { ResponsiveBlock } from '~/common/mui/ResponsiveBlock'
import { NoNameSection2 } from '~/common/mui/NoNameSection2'

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
      <ResponsiveBlock
        isLimited
      >
        <h1>Try UI</h1>
        <p>
          This is simple sketch
        </p>
      </ResponsiveBlock>
      <ResponsiveBlock
        isLimited
        style={{
          marginTop: '16px',
          marginBottom: '16px',
          border: '1px dashed red',
        }}
      >
        ResponsiveBlock: isLimited
      </ResponsiveBlock>
      <ResponsiveBlock
        isPaddedMobile
        style={{
          marginTop: '16px',
          marginBottom: '16px',
          border: '1px dashed red',
        }}
      >
        ResponsiveBlock: isPaddedMobile
      </ResponsiveBlock>
      <ResponsiveBlock
        style={{
          marginTop: '16px',
          marginBottom: '16px',
          border: '1px dashed red',
        }}
      >
        ResponsiveBlock
      </ResponsiveBlock>
      <ResponsiveBlock
        style={{
          marginTop: '16px',
          marginBottom: '16px',
        }}
      >
        <NoNameSection2 />
      </ResponsiveBlock>
    </>
  )
}
