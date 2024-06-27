import { Box, Button } from "@mui/material";
import PenyelesaianTable from "./Table/PenyelesaianTable";
import HeaderPenyelesaian from "./Header/HeaderPenyelesaian";
import { useState } from "react";

const PenyelesaianComponents = () => {

    return(
        <Box sx={{width: 1280}}>
            
            <HeaderPenyelesaian />

            <Box>
                <PenyelesaianTable />
            </Box>
        </Box>
    )
}

export default PenyelesaianComponents;