import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DescriptionIcon from '@mui/icons-material/Description';
import axios from 'axios';
import { Box, Button, IconButton, Input } from '@mui/material';
import { DateTime } from 'luxon';
import Swal from 'sweetalert2'
import Link from 'next/link';
import { dispatch } from '@/store/Store';
import { setEditPengaduanData } from '@/store/PengaduanDataRedux/PengaduanDataSlice';
import Image from 'next/image';
import FilterPeriodedPenyelesaian from '../Form/FilterPeriodePenyelesaian';
import DefaultImage from '@/public/default.png'

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
  render?: any
}

const columns: readonly Column[] = [
  { id: 'nomor', label: 'Nomor Aduan' },
  { id: 'nama', label: 'Nama Pelanggan' },
  // {
  //   id: 'jenis_aduan',
  //   label: 'Jenis Aduan',
  //   minWidth: 170,
  // },
  // { id: 'alamat', label: 'Alamat', minWidth: 100 },
  {
    id: 'tgl_selesai',
    label: 'Tanggal Selesai',
    minWidth: 220,
  },
  { id: 'nama_petugas', label: 'Petugas'},
  { id: 'jenis_penyelesaian', label: 'Jenis Penyelesaian'},
  { id: 'foto_penyelesaian', label: 'Foto Penyelesaian', minWidth: 230},
  {
    id: 'id',
    label: 'Actions',
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
      const path = `/api/penyelesaian?month=${month}&year=${year}`
      console.log('to path request', path)
      const response = await axios.get(path);
      console.log('response from server', JSON.stringify(response.data.data))
      const dataConverted = response.data.data.map((data:any) => {
        return {
          nomor: data.nomor,
          nama: data.nama,
          jenis_aduan: data.jenis_aduan.nama,
          alamat: data.alamat,
          tgl_selesai: convertDate(data.completed_at),
          nama_petugas: data.petugas.nama,
          jenis_penyelesaian: data.jenis_penyelesaian.nama_penyelesaian,
          foto_penyelesaian: data.foto_penyelesaian,
          id: data.id
        }
      })
      
      console.log('data after converted', dataConverted)
      setRows(dataConverted); // Assuming API returns an array of Data objects
      setOriginalRows(dataConverted);
      // console.log('data penganduan', response.data.data)
    } catch (error:any) {
      console.warn('masuk ke error request get penugasan')
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

  return (
    <div>
      <Link id="route-to-edit-pengaduan" href="/admin/pengaduan/edit" ></Link>
      {/* A */}
      <Box sx={{mb: 2}}>
        <FilterPeriodedPenyelesaian year={year} setYear={setYear} month={month} setMonth={setMonth} />
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
                              : column.id === "nomor" ? (
                                <div>
                                  <p style={{fontSize: 16, fontWeight: 600}}>{value}</p>
                                </div>
                              )
                              : column.id === "foto_penyelesaian" ? (
                                <div>
                                  <Image src={value !== null ? value : DefaultImage} alt={''} width={200} height={200} />
                                </div>
                              )
                              : column.id === "id" ? (
                                <div>
                                  <Link href={`/admin/penyelesaian/${value}`}>
                                  <IconButton>
                                    <DescriptionIcon fontSize='medium' color="info" />
                                  </IconButton>
                                  </Link>
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