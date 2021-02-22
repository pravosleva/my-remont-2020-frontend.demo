import React from 'react'
// import { Link } from 'react-router-dom'
// import { Grid, List, ListItem, ListItemText } from '@material-ui/core'
// import { useStyles } from './styles'
// import { useRouter } from '~/common/hooks/useRouter'
import { ResponsiveBlock } from '~/common/mui/ResponsiveBlock'
import { NoNameSection2 } from '~/common/mui/NoNameSection2'
import { useBaseStyles } from '~/common/mui/baseStyles'
import clsx from 'clsx'

export const TryUi = () => {
  // const classes = useStyles()
  // const router = useRouter()
  // const goToPage = useCallback(
  //   (link: string) => () => {
  //     router.push(link)
  //   },
  //   [router]
  // )
  const baseClasses = useBaseStyles()

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
        <h2>ResponsiveBlock</h2>
        <em>props:</em>
        <ul><li>isLimited</li></ul>
      </ResponsiveBlock>
      <ResponsiveBlock
        isLimited
        isPaddedMobile
        hasDesktopFrame
        style={{
          marginTop: '16px',
          marginBottom: '16px',
          // border: '1px dashed red',
        }}
      >
        <div className={clsx(baseClasses.desktopFrameInternalBox, baseClasses.isRoundedDesktop)} style={{ background: '#147ec1', color: '#FFF' }}>
          <h2>ResponsiveBlock</h2>
          <em>props:</em>
          <ul>
            <li>isLimited</li>
            <li>isPaddedMobile</li>
            <li>hasDesktopFrame</li>
          </ul>
          <em>For internal box:</em>
          <ul>
            <li>baseClasses.desktopFrameInternalBox</li>
            <li>baseClasses.isRoundedDesktop</li>
          </ul>
        </div>
      </ResponsiveBlock>
      <ResponsiveBlock
        isLimited
        hasDesktopFrame
        style={{
          marginTop: '16px',
          marginBottom: '16px',
          // border: '1px dashed red',
        }}
      >
        <div className={clsx(baseClasses.desktopFrameInternalBox, baseClasses.isRounded)} style={{ background: '#147ec1', color: '#FFF' }}>
          <h2>ResponsiveBlock</h2>
          <em>props:</em>
          <ul>
            <li>isLimited</li>
            <li>isPaddedMobile</li>
            <li>hasDesktopFrame</li>
          </ul>
          <em>For internal box:</em>
          <ul>
            <li>baseClasses.desktopFrameInternalBox</li>
            <li>baseClasses.isRounded</li>
          </ul>
        </div>
      </ResponsiveBlock>
      <ResponsiveBlock
        isPaddedMobile
        style={{
          marginTop: '16px',
          marginBottom: '16px',
          border: '1px dashed red',
        }}
      >
        <h2>ResponsiveBlock</h2>
        <em>props:</em>
        <ul>
          <li>isPaddedMobile</li>
        </ul>
      </ResponsiveBlock>
      <ResponsiveBlock
        style={{
          marginTop: '16px',
          marginBottom: '16px',
          border: '1px dashed red',
        }}
      >
        <h2>ResponsiveBlock</h2>
        <em>no props</em>
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
