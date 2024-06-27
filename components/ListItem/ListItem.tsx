import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import Summarize from '@mui/icons-material/Summarize'
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedIn';
import { useRouter } from 'next/navigation';

export const MainListItems: React.FC = () => {
  const router = useRouter();
  return(
    <React.Fragment>
      <ListItemButton onClick={() => {router.push('/admin/')}}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={() => {router.push('/admin/pengaduan')}}>
        <ListItemIcon>
          <Summarize />
        </ListItemIcon>
        <ListItemText primary="Pengaduan" />
      </ListItemButton>
      <ListItemButton onClick={() => {router.push('/admin/penugasan')}}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Penugasan" />
      </ListItemButton>
      <ListItemButton onClick={() => {router.push('/admin/penyelesaian')}}>
        <ListItemIcon>
          <AssignmentTurnedIn />
        </ListItemIcon>
        <ListItemText primary="Penyelesaian" />
      </ListItemButton>
    </React.Fragment>
  )
};

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);