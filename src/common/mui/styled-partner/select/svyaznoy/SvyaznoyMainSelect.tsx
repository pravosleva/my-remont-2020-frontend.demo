import React from 'react'
import { createStyles, Theme, makeStyles, withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select, { SelectProps } from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import clsx from 'clsx'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      // margin: theme.spacing(1),
      // minWidth: '100%',
      '& .MuiOutlinedInput-root.Mui-focused': {
        borderColor: 'red !important',
      },
    },
    selectEmpty: {
      // marginTop: theme.spacing(2),
    },
    dropdownStyle: {
      border: "2px solid #FFF",
      borderRadius: "8px",
      "& ul": {
        // @ts-ignore
        backgroundColor: theme.palette.svyaznoy.main,
        color: '#FFF',
      },
      "& li": {
          fontSize: 13,
      },
    },
    select: {
      // borderColor: "black",
      // outlined: {
      //   borderColor: "black",
      // },
      '&:focus': {
        borderColor: 'red !important',
      },
    }
  }),
);

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

export function SvyaznoyMainSelect({ value, items, onChange, label, id, ...restOriginalProps }: TProps & any) {
  const classes = useStyles();
  // const [age, setAge] = React.useState('');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChange(event.target.value as string);
  };

  return (// @ts-ignore
    <FormControl variant="outlined" className={classes.formControl} {...restOriginalProps}>
      <InputLabel id={`demo-simple-select-outlined-label-${id}`}>{label}</InputLabel>
      <Select
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
      </Select>
    </FormControl>
  );
}
