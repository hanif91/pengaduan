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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import { Box, Button, IconButton, Input } from '@mui/material';
import { DateTime } from 'luxon';
import Swal from 'sweetalert2'
import Link from 'next/link';
import { dispatch } from '@/store/Store';
import { setEditPengaduanData } from '@/store/PengaduanDataRedux/PengaduanDataSlice';
import FilterPeriodePenugasan from '../Form/FilterPeriodePengaduan';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
  render?: any
}

const columns: readonly Column[] = [
  { id: 'listNomorAduan', label: 'List Nomor Aduan', minWidth: 170 },
  { id: 'nomorPenugasan', label: 'List Nomor Penugasan', minWidth: 170 },
  {
    id: 'tglDiTugaskan',
    label: 'Tanggal Ditugaskan',
    minWidth: 170,
  },
  { id: 'divisi', label: 'Nama Divisi', minWidth: 100 },
  {
    id: 'ditugaskanOleh',
    label: 'Ditugaskan Oleh',
    minWidth: 220,
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
      const path = `/api/penugasan?month=${month}&year=${year}`
      console.log('to path request', path)
      const response = await axios.get(path);
      console.log('response from server', JSON.stringify(response.data.data))
      const dataConverted = response.data.data.map((data:any) => {
        return {
          id: data.id,
          listNomorAduan: JSON.stringify(data.penugasan_pengaduan.map((dataPenugasan:any) => {
            return dataPenugasan.pengaduan.nomor
          })),
          nomorPenugasan: data.nomor_penugasan,
          divisi: data.divisi.nama,
          ditugaskanOleh: data.penugasan_pengaduan.map((dataPenugasan:any) => {
            return dataPenugasan.pengaduan.petugas ? dataPenugasan.pengaduan.petugas.nama : ''
          })[0],
          tglDiTugaskan: convertDate(data.created_at),
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

  const deletePenugasan = (id: number) => {

    let penugasan = originalRows.find((data) => {return data.id === id;})
    // penugasan = penugasan.penugasan_pengaduan;
    // penugasan = penugasan.map((data:any) => {return data.pengaduan.processed_by;})
    // penugasan = penugasan.filter((data:any) => {return data !== null;})
    console.log('what we get bitch?', penugasan)

    Swal.fire({
      title: "Warning!",
      text: "Apakah anda yakin ingin menghapus penugasan ini?",
      icon: "question",
      confirmButtonText: "Benar",
      showCancelButton: true,
      cancelButtonText: "Batal",
    })
    .then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Warning!",
          text: "Pastikan tidak ada penugasan yang sudah di tugaskan kepada petugas tiap divisi!",
          icon: "error",
          confirmButtonText: "Benar",
          showCancelButton: true,
          cancelButtonText: "Batal",
        })
        .then((result) => {
          if (result.isConfirmed) {
            setRows(rows.filter((data) => data.id !== id)); // Update state with filtered data
  
            // Make API request to delete from server
            axios.delete(`/api/penugasan/`, {data:{penugasanId: id}})
              .then(() => {
                Swal.fire("Deleted!", "Pengaduan berhasil dihapus.", "success");
              })
              .catch((error) => {
                Swal.fire("Error!", "Terjadi kesalahan saat menghapus pengaduan.", "error");
                // Handle error, potentially revert state change
                setRows(prevRows => [...prevRows, { id }]); // Add back the deleted row
              });
            }
          }
        )
      }
    });
  };  

  return (
    <div>
      <Link id="route-to-edit-pengaduan" href="/admin/pengaduan/edit" ></Link>
      {/* A */}
      <Box sx={{mb: 2, alignSelf: "self-end"}}>
        <FilterPeriodePenugasan month={month} setMonth={setMonth} year={year} setYear={setYear} />
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
                              : column.id === "nomorPenugasan" ? (
                                <Box fontSize={16} fontWeight={550}>
                                  {value}
                                </Box>
                              )
                              : column.id === "listNomorAduan" ? (
                                <Box sx={{fontSize: 14, fontWeight: 550}}>
                                  {JSON.parse(value).map((no: string, index: number) => {
                                    return <Box sx={{mb:1}} key={index}>{no}</Box>;
                                  })}
                                </Box>
                              )
                              : column.id === "id" ? (
                                <div>
                                  <IconButton onClick={() => deletePenugasan(value)} >
                                    <DeleteForeverIcon fontSize='medium' color="error" />
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