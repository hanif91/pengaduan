import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title/Title';
import { Box } from '@mui/material';

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

type DataTotalProps = {
    title: string,
    total: number,
    period: number,
}

export default function DataTotal({title, total, period}: DataTotalProps) {
  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Typography component="p" variant="h2" sx={{mt: 6, alignSelf: 'flex-end'}}>
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
            <Box>{total}</Box> 
            <Box sx={{fontSize: 14}}>aduan</Box>
        </Box>
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1, mt: 3 }}>
        {/* Tahun {period} */}
      </Typography>
      <Box>
        <Link color="primary" href="#" onClick={preventDefault}>
          View data
        </Link>
      </Box>
    </React.Fragment>
  );
}