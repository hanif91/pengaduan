import React, { Dispatch } from 'react';
import clsx from 'clsx';
import { useTheme } from '@mui/material';
import { makeStyles } from '@mui/material';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// const listNomorAduan = [
//   'Oliver Hansen',
//   'Van Henry',
//   'April Tucker',
//   'Ralph Hubbard',
//   'Omar Alexander',
//   'Carlos Abbott',
//   'Miriam Wagner',
//   'Bradley Wilkerson',
//   'Virginia Andrews',
//   'Kelly Snyder',
// ];

function getStyles(name: string, selectedNomorAduan: any, theme: any) {
  return {
    fontWeight:
      selectedNomorAduan.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

type MultipleSelectPengaduanProps = {
    selectedNomorAduan: any[],
    setSelectedNomorAduan: Dispatch<any>,
    listNomorAduan: any[]
}

export default function MultipleSelectPengaduan(
    {
        selectedNomorAduan,
        setSelectedNomorAduan,
        listNomorAduan
    }:MultipleSelectPengaduanProps
) {
  const theme = useTheme();
//   const [selectedNomorAduan, setPersonName] = React.useState([]);

  const handleChange = (event:any) => {
    setSelectedNomorAduan(event.target.value);
  };

  const handleChangeMultiple = (event:any) => {
    const { options } = event.target;
    const value:any = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedNomorAduan(value);
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="demo-mutiple-chip-label">Pilih List Pengaduan yang akan Ditugaskan</InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={selectedNomorAduan}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
              }}>
              {selected.map((value) => (
                <Chip key={value} label={listNomorAduan.find((data:any) => { return data.id === value}).nomor} sx={{margin: 0.5}} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {listNomorAduan.map((data:any, index) => (
            <MenuItem key={index} value={data.id} style={getStyles(data.nomor, selectedNomorAduan, theme)}>
              {data.nomor} - {data.nama} - {data.no_telp}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
