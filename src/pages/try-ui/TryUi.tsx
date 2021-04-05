import React from 'react'
// import { Link } from 'react-router-dom'
// import { Grid, List, ListItem, ListItemText } from '@material-ui/core'
// import { useStyles } from './styles'
// import { useRouter } from '~/common/hooks/useRouter'
import { ResponsiveBlock } from '~/common/mui/ResponsiveBlock'
import { NoNameSection2 } from '~/common/mui/NoNameSection2'
import { useBaseStyles } from '~/common/mui/baseStyles'
import clsx from 'clsx'
import { ThemingSample } from './components/ThemingSample'
import { useUserAuthContext } from '~/common/hooks'
import { UploadsCleanup } from './components/UploadsCleanup'

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
  const { isUserAdmin } = useUserAuthContext()

  return (
    <>
      <ResponsiveBlock
        isLimited
      >
        <h1>Try UI</h1>
      </ResponsiveBlock>
      {
        isUserAdmin && (
          <ResponsiveBlock
            isLimited
            style={{
              // marginTop: '50px',
              marginBottom: '50px',
              // border: '1px dashed red',
            }}
          >
            <h2>Admin tools: Uploads Cleanup</h2>
            <UploadsCleanup />
          </ResponsiveBlock>
        )
      }

      <ResponsiveBlock
        isLimited
        style={{
          marginTop: !isUserAdmin ? '50px' : '0px',
          marginBottom: '50px',
          border: '1px dashed red',
        }}
      >
        <h2>ResponsiveBlock</h2>
        <em>props:</em>
        <ul><li>isLimited</li></ul>
      </ResponsiveBlock>
      <ResponsiveBlock
        isLimited
        style={{
          marginTop: '50px',
          marginBottom: '50px',
        }}
      >
        <h2>Material UI theming sample</h2>
        <ThemingSample />
      </ResponsiveBlock>

      <ResponsiveBlock
        isLimited
        isPaddedMobile
        hasDesktopFrame
        style={{
          marginTop: '50px',
          marginBottom: '50px',
          // border: '1px dashed red',
        }}
      >
        <div className={clsx(baseClasses.desktopFrameInternalBox, baseClasses.isRoundedDesktop)} style={{ background: '#147ec1', color: '#FFF' }}>
          <h2>ResponsiveBlock</h2>
          <em>props:</em>
          <ul>
            <li>isLimited</li>
            <li>hasDesktopFrame</li>
            <li>isPaddedMobile</li>
          </ul>
          <em>For internal box:</em>
          <ul>
            <li>baseClasses.desktopFrameInternalBox</li>
            <li>baseClasses.isRoundedDesktop</li>
          </ul>
        </div>
      </ResponsiveBlock>
      <ResponsiveBlock
        isPaddedMobile
        style={{
          marginTop: '50px',
          marginBottom: '50px',
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
          marginTop: '50px',
          marginBottom: '50px',
        }}
      >
        <NoNameSection2 />
      </ResponsiveBlock>

      <ResponsiveBlock
        isLimited
        hasDesktopFrame
        style={{
          marginTop: '50px',
          marginBottom: '50px',
          // border: '1px dashed red',
        }}
      >
        <div className={clsx(baseClasses.desktopFrameInternalBox, baseClasses.isRounded)} style={{ background: '#147ec1', color: '#FFF' }}>
          <h2>ResponsiveBlock</h2>
          <em>props:</em>
          <ul>
            <li>isLimited</li>
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
        style={{
          marginTop: '50px',
          marginBottom: '50px',
          border: '1px dashed red',
        }}
      >
        <h2>ResponsiveBlock</h2>
        <em>no props</em>
      </ResponsiveBlock>
    </>
  )
}
