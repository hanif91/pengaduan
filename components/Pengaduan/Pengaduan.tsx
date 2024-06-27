import { Box, Button } from "@mui/material";
import PengaduanTable from "./Table/PengaduanTable";
import HeaderPengaduan from "./Header/HeaderPengaduan";
import SearchPengaduan from "./Form/SearchPengaduan";
import { useState } from "react";

const PengaduanComponents = () => {
    const [searchText, setSearchText] = useState('')

    return(
        <Box sx={{width: 1280}}>
            
            <HeaderPengaduan title="Data Pengaduan" />

            {/* <Box sx={{mb: 2, alignSelf: "self-end"}}>
                <SearchPengaduan searchText={searchText} setSearchText={setSearchText} />
            </Box> */}

            <Box>
                <PengaduanTable />
            </Box>
        </Box>
    )
}

export default PengaduanComponents;