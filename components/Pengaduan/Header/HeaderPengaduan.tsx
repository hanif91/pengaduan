import { Box, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link'; // Import Link from Next.js

type HeaderPengaduanProps = {
    title: string,
    isNotOnIndexPage?: boolean
}

const HeaderPengaduan = ({title, isNotOnIndexPage = false}: HeaderPengaduanProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: `${!isNotOnIndexPage ? 'space-between': 'flex-start'}` }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ fontSize: 24, fontWeight: 600 }}>{title}</Box>
      </Box>
      {!isNotOnIndexPage
      ?<Box sx={{ mb: 2, ml: -5 }}>
        <Link href="/admin/pengaduan/tambah">
          <Button color="primary" sx={{ fontSize: 16 }}>
            <span><AddIcon /></span>Tambah Pengaduan
          </Button>
        </Link>
      </Box>
      : null}
    </Box>
  );
};

export default HeaderPengaduan;