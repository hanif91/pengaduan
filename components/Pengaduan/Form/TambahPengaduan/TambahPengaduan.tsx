'use client'

import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import HeaderPengaduan from "../../Header/HeaderPengaduan";
import { Children, useEffect, useState } from "react";
import axios from "axios";
import { isArray } from "util";
import { grey } from "@mui/material/colors";
import Router from "next/router";
import { useRouter } from 'next/router'
import Link from "next/link";
import Swal from "sweetalert2";
import { useSelector } from "@/store/Store";
import Autocomplete from '@mui/material/Autocomplete';

type TambahPengaduanComponentsProps = {
    isEdit?: boolean;
}

const SUMBER_LAPORAN_LIST = [
    {
        id:1,
        name:"Sosial Media",
    },
    {
        id:2,
        name:"Whatsapp",
    },
    {
        id:3,
        name:"Email",
    },
    {
        id:4,
        name:"Datang ke Kantor",
    },
    {
        id:5,
        name:"Telepon"
    },
    {
        id:6,
        name:"Lainnya"
    }
]

const TambahPengaduanComponents = ({isEdit = false}: TambahPengaduanComponentsProps) => {

    const editPengaduanDataRedux:any = useSelector((state) => state.pengaduanDataReducer.editDataPengaduan)

    const [nomorAduan, setNomorAduan] = useState('');
    const [jenisAduanItems, setJenisAduanItems] = useState<any>([]);
    const [listPelanggan, setListPelanggan] = useState<any>([]);
    const [noPelanggan, setNoPelanggan] = useState('');
    const [selectedJenisAduan, setSelectedJenisAduan] = useState(0);
    const [selectedPelanggan, setSelectedPelanggan] = useState<any>({no_pelanggan: ''});
    const [namaPelanggan, setNamaPelanggan] = useState('');
    const [noKtpPelanggan, setNoKtpPelanggan] = useState('');
    const [alamat, setAlamat] = useState('');
    const [noTelp, setNoTelp] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [sumberLaporan, setSumberLaporan] = useState(0);
    const [sumberLaporanName, setSumberLaporanName] = useState('');

    useEffect(() => {
        const fetchDataJenisAduan = async() => {
            
            try {
                const getJenisAduan = await axios.get('/api/jenis-aduan');
                // console.log('response getJenisAduan', getJenisAduan.data.data)
                setJenisAduanItems(getJenisAduan.data.data)
            }
            catch{
                console.warn('Faild to get jenis aduan')
            }
        }
        const fetchDataNomorPengaduanTerakhir = async() => {
            try{
                const getNomorPengaduanTerakhir = await axios.get('/api/get/pengaduan-nomor-terakhir')
                setNomorAduan(getNomorPengaduanTerakhir.data.data.nomor)
            }
            catch{
                console.warn('Failed get data nomor pengaduan terakhir')
            }
        }
        fetchDataJenisAduan();
        if(!isEdit) fetchDataNomorPengaduanTerakhir();
    },[])

    useEffect(() => {
        // console.log('data on jenisaduan', jenisAduanItems)
    }, [jenisAduanItems])

    useEffect(() => {
        if( sumberLaporan !== 0) setSumberLaporanName(SUMBER_LAPORAN_LIST[sumberLaporan - 1].name);
    }, [sumberLaporan])

    useEffect(() => {
        console.log('is edit: ', isEdit)
        if(isEdit === true && editPengaduanDataRedux !== null) {

            const idSumberLaporan = SUMBER_LAPORAN_LIST.find((data:any) => data.name === editPengaduanDataRedux.sumber_laporan)?.id;

            setNomorAduan(editPengaduanDataRedux.nomor);
            setSelectedJenisAduan(editPengaduanDataRedux.jenis_aduan_id);
            setSelectedPelanggan(editPengaduanDataRedux.pelanggan_id === null ? 0 : editPengaduanDataRedux.pelanggan_id);
            setNamaPelanggan(editPengaduanDataRedux.nama);
            setNoKtpPelanggan(editPengaduanDataRedux.no_identitas);
            setAlamat(editPengaduanDataRedux.alamat);
            setNoTelp(editPengaduanDataRedux.no_telp);
            setKeterangan(editPengaduanDataRedux.keterangan);
            setSumberLaporan(idSumberLaporan ? idSumberLaporan : 0);
            setNoPelanggan(editPengaduanDataRedux.pelanggan.no_pelanggan)
            setSelectedPelanggan(editPengaduanDataRedux.pelanggan);
            setListPelanggan([editPengaduanDataRedux.pelanggan])
        }
    }, [editPengaduanDataRedux, isEdit])

    useEffect(() => {
        if(noPelanggan.length >= 3) {
            fetchPelanggan();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noPelanggan])

    useEffect(() => {
        console.log('selected pelanggan this is cuy: ',selectedPelanggan)
        const dataSelectedPelanggan = listPelanggan?.find((data: any) => data.no_pelanggan === selectedPelanggan?.no_pelanggan);
        console.log('selected data', dataSelectedPelanggan);
        if(dataSelectedPelanggan) {
            setNamaPelanggan(dataSelectedPelanggan.nama)
            setAlamat(dataSelectedPelanggan.alamat)
            setNoTelp(dataSelectedPelanggan.no_hp)
            setNoKtpPelanggan(dataSelectedPelanggan.no_ktp)
        }
    }, [listPelanggan, selectedPelanggan])
    
    const handleSelectJenisAduan = (e: any) => {
        setSelectedJenisAduan(e.target.value)
    }

    const fetchPelanggan = async() => {
        const dataPelanggan = await axios.get('/api/get/pelanggan?noPelanggan='+ noPelanggan)
        setListPelanggan(dataPelanggan.data.data)
        
    }

    const handleSelectJenisPelanggan = (newValue:any) => {
        // 1. Update state (or perform other actions) based on the new value
        setSelectedPelanggan(newValue);
      
        // 2. Validate the selected option (optional)
        if (!listPelanggan.some((item:any) => item.no_pelanggan === newValue?.no_pelanggan)) {
          // Handle invalid selection (e.g., display an error message)
          console.error('Invalid selection:', newValue);
        }
        console.log('hello', listPelanggan.some((item:any) => item.id === newValue?.id));
      
        // 3. Trigger any necessary side effects (e.g., API calls, UI updates)
        // fetchDataRelatedToSelectedPelanggan(newValue);
      };
      

    const handleSelectSumberLaporan = (e: any) => {
        setSumberLaporan(e.target.value)
    }

    const submitData = async () => {
        console.log('masuk ke data save')
        // Check for errors
        const hasErrors = [
          nomorAduan,
          selectedJenisAduan,
          namaPelanggan,
          alamat,
          noTelp,
          keterangan,
          sumberLaporanName,
        ].some((value) => value === 0 || value === '' || value === undefined);
      
        if (hasErrors) {
          Swal.fire({
            title: "Warning!",
            text: "Harap isi semua bidang dengan benar!",
            icon: "error",
          });
          return;
        }
      
        // Show confirmation dialog
        // Swal.fire({
        //   title: "Konfirmasi",
        //   text: "Apakah anda yakin ingin mengirim pengaduan ini?",
        //   icon: "question",
        //   confirmButtonText: "Benar",
        //   showCancelButton: true,
        // })
        // .then(async (result) => {
        //   if (result.isConfirmed) {
            // Submit data to the server
            await axios.post('/api/pengaduan', {
              nomor: nomorAduan,
              jenis_aduan_id: selectedJenisAduan,
              pelanggan_id: selectedPelanggan !== undefined ? selectedPelanggan.id : null,
              nama: namaPelanggan,
              no_identitas: noKtpPelanggan,
              alamat: alamat,
              no_telp: noTelp,
              keterangan: keterangan,
              sumber_laporan: sumberLaporanName,
            });
      
            // Handle successful submission
            Swal.fire("Berhasil!", "Pengaduan berhasil dikirim!", "success");
            // Router.replace('/admin/pengaduan');
            document.getElementById('router-to-back')?.click();
            // Clear or reset form fields
          }
    //     });
    // };      

    const submitEditData = async () => {
        console.log('masuk ke data update')
        // Check for errors
        const hasErrors = [
          nomorAduan,
          selectedJenisAduan,
          namaPelanggan,
          alamat,
          noTelp,
          keterangan,
          sumberLaporanName,
        ].some((value) => value === 0 || value === '');
      
        if (hasErrors) {
          Swal.fire({
            title: "Warning!",
            text: "Harap isi semua bidang dengan benar!",
            icon: "error",
          });
          return;
        }
      
        // Show confirmation dialog
        Swal.fire({
          title: "Konfirmasi",
          text: "Apakah anda yakin ingin mengirim pengaduan ini?",
          icon: "question",
          confirmButtonText: "Benar",
          showCancelButton: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            // Submit data to the server
            const updatedData = {
                id: editPengaduanDataRedux.id,
                nomor: nomorAduan,
                jenis_aduan_id: selectedJenisAduan,
                pelanggan_id: selectedPelanggan !== undefined ? selectedPelanggan.id : null,
                nama: namaPelanggan,
                no_identitas: noKtpPelanggan,
                alamat: alamat,
                no_telp: noTelp,
                keterangan: keterangan,
                sumber_laporan: sumberLaporanName,
            }

            console.log({updatedData});
            await axios.patch('/api/pengaduan', updatedData);
      
            // Handle successful submission
            Swal.fire("Berhasil!", "Pengaduan berhasil diupdate!", "success");
            // Router.replace('/admin/pengaduan');
            document.getElementById('router-to-back')?.click();
            // Clear or reset form fields
          }
        });
    };   

    return(
        <Box sx={{width: 1280}}>
            <Link id="router-to-back" href={'/admin/pengaduan'}></Link>
            <HeaderPengaduan title="Penerimaan Aduan" isNotOnIndexPage={true} />
            <Box bgcolor={'white'} height='full' sx={{p: 3}} borderRadius={2} border={0.1} borderColor={grey[300]}>
                <Box sx={{mb: 3}}>
                    <Box sx={{fontSize: 20, fontWeight: 700}}>Form Pengaduan</Box>
                </Box>
                <Box borderRadius={2} border={0.1} borderColor={grey[300]} padding={4}>
                    <Grid container>
                        <Grid xs={2} sx={{mb: 3}}>
                            <TextField label="No Aduan" disabled value={nomorAduan} />
                        </Grid>
                        <Grid xs={3} sx={{ml: 4}}>
                            <FormControl fullWidth size="medium">
                                <InputLabel id="select-jenis-aduan-label">Jenis Aduan</InputLabel>
                                <Select
                                    labelId="select-jenis-aduan-label"
                                    id="select-jenis-aduan"
                                    value={selectedJenisAduan}
                                    label="Jenis Aduan"
                                    onChange={(e) => {handleSelectJenisAduan(e)}}
                                >
                                    <MenuItem value={0}>{'--Pilih Jenis Aduan--'}</MenuItem>
                                    {jenisAduanItems.length > 0 && (
                                    jenisAduanItems.map((item:any) => (
                                        <MenuItem key={item.id} value={item.id}>{item.nama}</MenuItem>
                                    ))
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={3} sx={{ml: 4}}> 
                            {/* <FormControl fullWidth size="medium">
                                <InputLabel id="select-pelanggan-label">Pelanggan (opsional)</InputLabel>
                                <Select
                                    labelId="select-pelanggan-label"
                                    id="select-pelanggan"
                                    value={selectedPelanggan}
                                    label="Pelanggan (opsional)"
                                    onChange={(e) => {handleSelectJenisAduan(e)}}
                                >
                                    <MenuItem value={0}>{'--Pilih Pelanggan--'}</MenuItem>
                                    {jenisAduanItems.length > 0 && (
                                    jenisAduanItems.map((item:any) => (
                                        <MenuItem key={item.id} value={item.id}>{item.nama}</MenuItem>
                                    ))
                                    )}
                                </Select>
                            </FormControl> */}
                            <FormControl fullWidth size="medium">
                                {/* <InputLabel id="select-pelanggan-label">Pelanggan (opsional)</InputLabel> */}
                                <Autocomplete
                                    id="select-pelanggan"
                                    value={selectedPelanggan}
                                    options={listPelanggan}
                                    onChange={(e, newValue) => {handleSelectJenisPelanggan(newValue)}}
                                    getOptionLabel={(option:any) => `${option.no_pelanggan}`} // Specify how to display options
                                    renderInput={(params) => (
                                    <TextField {...params} label="Pelanggan (opsional)" variant="standard" value={noPelanggan} onChange={(e) => {setNoPelanggan(e.target.value)}} />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid xs={3} sx={{ml: 4}}> 
                            <FormControl fullWidth size="medium">
                                <InputLabel id="select-sumber-laporan-label">Sumber Laporan</InputLabel>
                                <Select
                                    labelId="select-sumber-laporan-label"
                                    id="select-sumber-laporan"
                                    value={sumberLaporan}
                                    label="Sumber Laporan"
                                    onChange={(e) => {handleSelectSumberLaporan(e)}}
                                >
                                    <MenuItem value={0}>{'--Pilih Sumber Laporan--'}</MenuItem>
                                    {SUMBER_LAPORAN_LIST.length > 0 && (
                                    SUMBER_LAPORAN_LIST.map((item:any) => (
                                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                    ))
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={2} sx={{mb: 3}}> 
                            <TextField label="Nama" value={namaPelanggan} onChange={(e) => {setNamaPelanggan(e.target.value)}} />
                        </Grid>
                        <Grid xs={3} sx={{ml: 4, width: "full"}}> 
                            <TextField label="No Identitas" fullWidth value={noKtpPelanggan} onChange={(e) => {setNoKtpPelanggan(e.target.value)}} />
                        </Grid>
                        <Grid xs={3} sx={{ml: 4, width: "full"}}> 
                            <TextField label="Alamat" fullWidth value={alamat} onChange={(e) => {setAlamat(e.target.value)}} />
                        </Grid>
                        <Grid xs={3} sx={{ml: 4, width: "full"}}> 
                            <TextField label="No Telepon" fullWidth value={noTelp} onChange={(e) => {setNoTelp(e.target.value)}} />
                        </Grid>
                        <Grid xs={12} sx={{mb:3}}>
                            <TextField label="Keterangan" fullWidth value={keterangan} onChange={(e) => {setKeterangan(e.target.value)}} />
                        </Grid>
                        <Grid xs={12} sx={{display: "flex", flexDirection: "row", alignContent: "flex-end", justifyContent: "flex-end"}}>
                            <Box border={2} borderRadius={0.5} color="#2196F3" sx={{bgcolor: "#2196F3"}}>
                                <Button onClick={isEdit ? submitEditData : submitData} size="large" sx={{color: "white"}}>
                                    Submit
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}

export default TambahPengaduanComponents;