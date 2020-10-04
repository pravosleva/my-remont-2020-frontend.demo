import React from 'react'

export const SiteLayout: React.FC = ({ children }) => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>{children}</div>
  )
}