import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { useState } from "react";

type FilterStatusPengaduanProps = {
    selectedStatus: string,
    setSelectedStatus: any,
}

const FilterStatusPengaduan = ({selectedStatus, setSelectedStatus} : FilterStatusPengaduanProps) => {
    const handleSelectStatus = (e: any) => {
        setSelectedStatus(e.target.value)
    }

    const statusCode = [
        {value: 'all', name: 'Semua'}, 
        {value: 'belum_ditugas', name: 'Belum Ditugasi'}, 
        {value: 'sudah_ditugas', name: 'Sudah Ditugasi'},
        {value: 'belum_diselesaikan', name: 'Belum Diselesaikan'},
        {value: 'sudah_ditugasi_belum_diselesainkan', name: 'Sudah Ditugasi Belum Diselesaikan'},
        {value: 'sudah_diselesaikan', name: 'Sudah Diselesaikan'}
    ]

    return(
        <FormControl fullWidth size="medium" sx={{minWidth: '310px'}}>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedStatus}
                label="Age"
                onChange={(e) => {handleSelectStatus(e)}}
            >
                {statusCode.map((status, key) => {
                    return (  
                        <MenuItem key={key} value={status.value}>{status.name}</MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}

export default FilterStatusPengaduan;


//filter_status_code: ['belum_ditugas','sudah_ditugas','belum_diselesaikan','sudah_ditugasi_belum_diselesainkan','sudah_diselesaikan']