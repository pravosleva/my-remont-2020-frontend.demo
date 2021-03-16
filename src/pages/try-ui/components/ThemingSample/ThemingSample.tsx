import React, { useState } from 'react'
import {
  EPartnerCode,
  ThemedButton as Button,
} from '~/common/mui/styled-partner'
import { useBaseStyles } from '~/common/mui/baseStyles'
import { useCustomToastContext } from '~/common/hooks'
import { SvyaznoyMainTextField } from '~/common/mui/styled-partner/textField/svyaznoy';

export const ThemingSample = () => {
  const baseClasses = useBaseStyles()
  const { toast } = useCustomToastContext()
  const [textField1, setTextField1] = useState<string>('')
  const handleChange1 = (e) => {
    setTextField1(e.target.value)
  }
  const handleClick1 = () => {
    toast(`Hello ThemedButton for ${EPartnerCode.SvyaznoySecondary}; ${textField1}`, { appearance: 'info' })
  }
  const handleClick2 = () => {
    toast(`Hello ThemedButton for ${EPartnerCode.SvyaznoyYellow}`, { appearance: 'success' })
  }

  return (
    <div className={baseClasses.subWrapper}>
      <SvyaznoyMainTextField
        label="SvyaznoyMainTextField"
        variant="outlined"
        name="field-1"
        value={textField1}
        // @ts-ignore
        color="svyaznoy"
        onChange={handleChange1}
        fullWidth
        size='small'
      />
      <div className={baseClasses.wrapperAsGrid}>
        <div className={baseClasses.subWrapper}>
          <Button
            partnerCode={EPartnerCode.SvyaznoySecondary}
            onClick={handleClick1}
            fullWidth
          >
            Svyaznoy sec
          </Button>
        </div>
        <div className={baseClasses.subWrapper}>
          <Button
            partnerCode={EPartnerCode.SvyaznoyYellow}
            onClick={handleClick2}
            fullWidth
          >
            Svyaznoy yel
          </Button>
        </div>
      </div>
    </div>
  )
}