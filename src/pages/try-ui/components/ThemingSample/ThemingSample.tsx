import React, { useState } from 'react'
import {
  EPartnerCode,
  ThemedButton as Button,
} from '~/common/mui/styled-partner'
import { useBaseStyles } from '~/common/mui/baseStyles'
import { useCustomToastContext } from '~/common/hooks'
import { SvyaznoyMainTextField, SvyaznoyMainSelect2 } from '~/common/mui/styled-partner';

export const ThemingSample = () => {
  const baseClasses = useBaseStyles()
  const { toast } = useCustomToastContext()
  // Text:
  const [textField1, setTextField1] = useState<string>('')
  const handleChange1 = (e) => {
    setTextField1(e.target.value)
  }
  // Select:
  const items = [{ id: '01', label: 'Option 1', value: 1 }, { id: '02', label: 'Option 2', value: 2 }]
  const [selectValue, setSelectValue] = useState<any>(items[0].value)
  const onSelectChange = (value: any) => {
    console.log(value)
    setSelectValue(value)
  }
  // Btns:
  const handleClick1 = () => {
    toast(`Hello ThemedButton for ${EPartnerCode.SvyaznoySecondary}; ${textField1 || '<empty>'}; ${selectValue}`, { appearance: 'info' })
  }
  const handleClick2 = () => {
    toast(`Hello ThemedButton for ${EPartnerCode.SvyaznoyYellow}`, { appearance: 'success' })
  }

  return (
    <div className={baseClasses.subWrapper}>
      <div className={baseClasses.wrapperAsGrid}>
        <div className={baseClasses.subWrapper}>
          <SvyaznoyMainSelect2
            label='SvyaznoyMainSelect'
            // id='SvyaznoyMainSelect'
            value={selectValue}
            onChange={onSelectChange}
            items={items}
            fullWidth={true}
            size='small'
            // color='svyaznoy'
            // variant="outlined"
            // native
          />
        </div>
        <div className={baseClasses.subWrapper} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <b>[ Something in progress... ]</b>
        </div>
      </div>
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
