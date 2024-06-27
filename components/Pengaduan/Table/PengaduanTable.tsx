import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import CreateIcon from '@mui/icons-material/Create';
import PlayArrow from '@mui/icons-material/PlayArrow';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import { Box, Button, IconButton, Input } from '@mui/material';
import { DateTime } from 'luxon';
import SearchPengaduan from '../Form/SearchPengaduan';
import throttle from 'lodash.throttle';
import FilterStatusPengaduan from '../Form/FilterStatusPengaduan';
import FilterPeriodePengaduan from '../Form/FilterPeriodePengaduan';
import Swal from 'sweetalert2'
import Link from 'next/link';
import { dispatch } from '@/store/Store';
import { setEditPengaduanData } from '@/store/PengaduanDataRedux/PengaduanDataSlice';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
  render?: any
}

const columns: readonly Column[] = [
  { id: 'nomor', label: 'Nomor Aduan', minWidth: 170 },
  {
    id: 'created_at',
    label: 'Tanggal ',
    minWidth: 170,
  },
  {
    id: 'pelanggan',
    label: 'Nomor Pelanggan',
    minWidth: 70,
  },
  { id: 'nama', label: 'Nama', minWidth: 100 },
  {
    id: 'alamat',
    label: 'Alamat',
    minWidth: 220,
  },
  {
    id: 'no_telp',
    label: 'Nomor Telepon',
    minWidth: 170,
  },
  {
    id: 'jenis_aduan',
    label: 'Jenis Aduan',
    minWidth: 170,
  },
  {
    id: 'id',
    label: 'Actions',
    minWidth: 140,
    align: 'right',
  },
];

export default function PengaduanTable() {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<any>()
  const [rows, setRows] = React.useState<any[]>([])
  const [searchText, setSearchText] = React.useState('')
  const [originalRows, setOriginalRows] = React.useState<any[]>([])
  const [selectedStatus, setSelectedStatus] = React.useState('all')
  const [month, setMonth] = React.useState(new Date().getMonth() + 1)
  const [year, setYear] = React.useState(new Date().getFullYear())

  function convertDate(isoDateStr: string): string {
    // Parse the ISO date using Luxon
    const parsedDate = DateTime.fromISO(isoDateStr);
  
    // Format the date as "dd MMMM YYYY"
    const formattedDate = parsedDate.toFormat("dd MMMM yyyy");
  
    return formattedDate;
  }
  
  const fetchData = async (filterStatus?:string) => {
    setIsLoading(true);
    setError(null);

    try {
      const path = `/api/pengaduan?month=${month}&year=${year}${filterStatus !== 'all' ? `&filter=${filterStatus}` : ''}`
      console.log('to path request', path)
      const response = await axios.get(path);
      setRows(response.data.data); // Assuming API returns an array of Data objects
      setOriginalRows(response.data.data);
      // console.log('data penganduan', response.data.data)
    } catch (error:any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year])

  React.useEffect(() => {
    // If filterText is empty, set the original list as the filtered list
    if (!searchText) {
        setRows(originalRows);
        return;
    }

    // Apply the filter to the original list
    const filteredList = originalRows.filter((item: any) =>
        item.nama.toLowerCase().includes(searchText.toLowerCase())
    );

    // Set the filtered list
    setRows(filteredList);
}, [searchText, originalRows]);

React.useEffect(() => {
  fetchData(selectedStatus);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedStatus])

  const handleSearch = () => {
    if (searchText === '') {
      setRows(originalRows); // Reset to original data
    } else {
      const filteredRows = originalRows.filter((row) => {
        // ... filtering logic using originalRows
      });
      setRows(filteredRows);
      setOriginalRows(filteredRows); // Update originalRows for next search
    }
  };


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deletePengaduan = (id: number) => {
    if(rows.find((data:any) => data.id === id).is_processed) {
      return Swal.fire({
        title: "Warning!",
        text: "Pengaduan tidak bisa di hapus dikarenakan sudah di tugaskan",
        icon: "info",
        confirmButtonText: "Ok",
      })
    }
    Swal.fire({
      title: "Warning!",
      text: "Apakah anda yakin ingin menghapus pengaduan ini?",
      icon: "question",
      confirmButtonText: "Benar",
      showCancelButton: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        setRows(rows.filter((data) => data.id !== id)); // Update state with filtered data
  
        // Make API request to delete from server
        axios.delete(`/api/pengaduan/`, {data:{pengaduanId: id}})
          .then(() => {
            Swal.fire("Deleted!", "Pengaduan berhasil dihapus.", "success");
          })
          .catch((error) => {
            Swal.fire("Error!", "Terjadi kesalahan saat menghapus pengaduan.", "error");
            // Handle error, potentially revert state change
            setRows(prevRows => [...prevRows, { id }]); // Add back the deleted row
          });
      }
    });
  };  

  const editPengaduan = (id: number) => {
    if(rows.find((data:any) => data.id === id).is_processed) {
      return Swal.fire({
        title: "Warning!",
        text: "Pengaduan tidak bisa di edit dikarenakan sudah di tugaskan",
        icon: "info",
        confirmButtonText: "Ok",
      })
    }
    // Swal.fire({
    //   title: "Warning!",
    //   text: "Apakah anda yakin ingin mengedit pengaduan ini?",
    //   icon: "question",
    //   confirmButtonText: "Benar",
    //   showCancelButton: true,
    // })
    // .then((result) => {
    //   if (result.isConfirmed) {
        dispatch(setEditPengaduanData(rows.find((data:any) => data.id === id)));
        document.getElementById('route-to-edit-pengaduan')?.click();
      // }})
  }

  return (
    <div>
      <Link id="route-to-edit-pengaduan" href="/admin/pengaduan/edit" ></Link>
      <Box sx={{mb: 2, display: "flex", flexDirection: "row", gap: 2}}>
        <Box>
          <SearchPengaduan searchText={searchText} setSearchText={setSearchText} />
        </Box>
        <Box>
          <FilterStatusPengaduan selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
        </Box>
        <Box>
          <FilterPeriodePengaduan month={month} setMonth={setMonth} year={year} setYear={setYear} />
        </Box>
      </Box>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: "screen", maxWidth: "full"}}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column:any) => {
                        const value:any = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} sx={{fontSize: 12}}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : column.id === "jenis_aduan" ? value.nama
                              : column.id === "created_at" ? convertDate(value)
                              : column.id === "pelanggan" ? value === null ? "" : value.no_pelanggan
                              : column.id === "id" ? (
                                <div>
                                  <IconButton onClick={() => editPengaduan(value)}>
                                    <CreateIcon fontSize='small' color="warning" />
                                  </IconButton>
                                  <IconButton onClick={() => deletePengaduan(value)}>
                                    <DeleteForeverIcon fontSize='small' color="error" />
                                  </IconButton>
                                </div>)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}