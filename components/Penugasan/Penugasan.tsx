import { Box, Button } from "@mui/material";
import PenugasanTable from "./Table/PenugasanTable";
import HeaderPenugasan from "./Header/HeaderPenugasan";
import { useState } from "react";
import FilterPeriodePenugasan from "./Form/FilterPeriodePengaduan";

const PenugasanComponents = () => {
    const [searchText, setSearchText] = useState('')
    const [month, setMonth] = useState(0)
    const [year, setYear] = useState(0)

    return(
        <Box sx={{width: 1280}}>
            
            <HeaderPenugasan title="Data Penugasan" />

            <Box>
                <PenugasanTable />
            </Box>
        </Box>
    )
}

export default PenugasanComponents;