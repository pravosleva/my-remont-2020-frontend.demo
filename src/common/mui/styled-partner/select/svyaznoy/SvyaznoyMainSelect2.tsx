import React from 'react'
import { createStyles, Theme, makeStyles, withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Select, { SelectProps } from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import clsx from 'clsx'
import FormControl from '@material-ui/core/FormControl'

const useStyles = makeStyles((theme: Theme & { palette : { svyaznoy: { main: string, contrastText: string } } }) =>
  createStyles({
    formControl: {
      // DOES NOT WORKS:
      '& .MuiOutlinedInput-root, & .MuiOutlinedInput-root.Mui-focused': {
        // color: theme.palette.svyaznoy.main,
        borderColor: theme.palette.svyaznoy.main,
      },

      // НЕ ПРОВЕРЯЛ:
      // '& .MuiInput-underline:after': { borderBottomColor: 'yellow' },

      // WORKS:
      '& .MuiOutlinedInput-notchedOutline': {
        borderRadius: '8px',
      },
      '& label.Mui-focused': { color: theme.palette.svyaznoy.main },
    },
    selectEmpty: {
      // marginTop: theme.spacing(2),
    },
    dropdownStyle: {
      border: "2px solid #FFF",
      borderRadius: "8px",
      "& ul": {
        backgroundColor: theme.palette.svyaznoy.main,
        color: '#FFF',
      },
      "& li": {
        fontSize: 16,
        fontWeight: 500,
      },
    },
    select: {
      '& > div, & > div:focus': {
        backgroundColor: 'inherit',
      },
    }
  }),
);

export const SvyaznoyMainSelect0 = withStyles((theme: Theme & { palette : { svyaznoy: { main: string, contrastText: string } } }) => ({
  root: {
    // DOES NOT WORKS:
    // '& .MuiOutlinedInput-root.Mui-focused.MuiOutlinedInput-notchedOutline': {
    //   borderColor: `${theme.palette.svyaznoy.main} !important`,
    // },

    // NOTE: Or this: '& div:nth-child(2)': {
    '& .MuiInput-underline:after': {
      borderBottomColor: 'yellow',
    },
  }
}))(Select);

type TItem = {
  value: any
  label: string
  id: string
}
type TProps = {
  id: string
  value: string
  items: TItem[]
  onChange: (string: string) => void
  label: string
}

export function SvyaznoyMainSelect2({ value, items, onChange, label, id, ...restOriginalProps }: TProps & any) {
  const classes = useStyles();
  // const [age, setAge] = React.useState('');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChange(event.target.value as string);
  };

  return (// @ts-ignore
    <FormControl variant="outlined" className={classes.formControl} {...restOriginalProps}
      // @ts-ignore
      // color='svyaznoy'
    >
      <InputLabel id={`demo-simple-select-outlined-label-${id}`}>{label}</InputLabel>
      <SvyaznoyMainSelect0
        className={clsx(classes.select)}
        labelId={`demo-simple-select-outlined-label-${id}`}
        id={`demo-simple-select-outlined-${id}`}
        value={value}
        onChange={handleChange}
        label={label}
        MenuProps={{ classes: { paper: classes.dropdownStyle } }}
      >
        {items.map(({ value, label, id }) => (
          <MenuItem value={value} key={id}>{label}</MenuItem>
        ))}
      </SvyaznoyMainSelect0>
    </FormControl>
  );
}
