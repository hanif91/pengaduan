import { Box, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link'; // Import Link from Next.js

const HeaderPenyelesaian = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: `flex-start` }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ fontSize: 24, fontWeight: 600 }}>Data Penyelesaian</Box>
      </Box>
    </Box>
  );
};

export default HeaderPenyelesaian;