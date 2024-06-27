import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"

type FilterPeriodedPenyelesaianProps = {
    month: number,
    setMonth: any,
    year: number,
    setYear: any,
}

const FilterPeriodedPenyelesaian = (
    {
        month,
        setMonth,
        year,
        setYear
    }: FilterPeriodedPenyelesaianProps
) => {

    const [yearsdPenyelesaian, setYearsdPenyelesaian] = useState<[]>([]);

    useEffect(() => {
        const fetchYeardPenyelesaian = async() => {
            const getYeardPenyelesaian = await axios.get('/api/get/tahun-penyelesaian');
            console.log('getYeardPenyelesaian', getYeardPenyelesaian.data.data)
            setYearsdPenyelesaian(getYeardPenyelesaian.data.data)
        }
        fetchYeardPenyelesaian();
    }, [])

    const handleSelectMonth = (e: any) => {
        setMonth(e.target.value)
    }

    const handleSelectYear = (e: any) => {
        setYear(e.target.value)
    }

    const monthList = [
        {value: 1,name: 'Januari'},
        {value: 2,name: 'Februari'},
        {value: 3,name: 'Maret'},
        {value: 4,name: 'April'},
        {value: 5,name: 'Mei'},
        {value: 6,name: 'Juni'},
        {value: 7,name: 'Juli'},
        {value: 8,name: 'Agustus'},
        {value: 9,name: 'September'},
        {value: 10,name: 'Oktober'},
        {value: 11,name: 'November'},
        {value: 12,name: 'Desember'}
    ]

    const currentYear = new Date().getFullYear(); // Get the current year
    const startingYear = 2015; // Specify the starting year

    const yearList = Array.from({ length: currentYear - startingYear + 1 }, (_, i) => ({
    value: currentYear - i,
    name: String(currentYear - i),
    }));

        
    return(
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2}}>
            <Box>
                <FormControl fullWidth size="medium" sx={{minWidth: '100px'}}>
                    <InputLabel id="demo-simple-select-label">Month</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={month}
                        label="Age"
                        onChange={(e) => {handleSelectMonth(e)}}
                    >
                        {monthList.map((monthData, key) => {
                            return (  
                                <MenuItem key={key} value={monthData.value}>{monthData.name}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </Box>
            <Box>
                <FormControl fullWidth size="medium" sx={{minWidth: '100px'}}>
                    <InputLabel id="demo-simple-select-label">Year</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={year}
                        label="Age"
                        onChange={(e) => {handleSelectYear(e)}}
                    >
                        {yearsdPenyelesaian.length > 0 ?
                        yearsdPenyelesaian.map((year, key) => {
                            return <MenuItem key={key} value={year}>{year}</MenuItem>
                        })
                        :
                        yearList.map((yearData, key) => {
                            return (  
                                <MenuItem key={key} value={yearData.value}>{yearData.name}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    )

}

export default FilterPeriodedPenyelesaian