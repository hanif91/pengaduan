'use client'

import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import HeaderPenugasan from "../../Header/HeaderPenugasan";
import { useEffect, useState } from "react";
import axios from "axios";
import { grey } from "@mui/material/colors";
import Link from "next/link";
import Swal from "sweetalert2";
import { useSelector } from "@/store/Store";
import MultipleSelectPengaduan from "../Select/MultiSelectPengaduan";

type TambahPenugasanComponentsProps = {
    isEdit?: boolean;
}

const TambahPenugasanComponents = ({isEdit = false}: TambahPenugasanComponentsProps) => {

    const [listNomorAduan, setListNomorAduan] = useState<any>([]);
    const [dataDivisi, setDataDivisi] = useState<any>([]);
    const [selectedListAduan, setSelectedListAduan] = useState<any>([]);
    const [selectedDivisiId, setSelectedDivisiId] = useState(0);
    const [noPenugasan, setNoPenugasan] = useState('');

    useEffect(() => {
        const fetchDataListNomorAduan = async() => {
            
            try {
                const getListNomorAduan = await axios.get('/api/get/list-pengaduan');
                setListNomorAduan(getListNomorAduan.data.data)
            }
            catch{
                console.warn('Faild to get list aduan')
            }
        }
        const fetchDataDivisi = async() => {
            try{
                const getNomorPengaduanTerakhir = await axios.get('/api/get/divisi')
                setDataDivisi(getNomorPengaduanTerakhir.data.data)
            }
            catch{
                console.warn('Failed get data divisi')
            }
        }
        const fetchNomorPenugasanTerakhir = async() => {
            try{
                const getNomorPenugasanTerakhir = await axios.get('/api/get/penugasan-nomor-terakhir')
                setNoPenugasan(getNomorPenugasanTerakhir.data.data.nomor)
            }
            catch{
                console.warn('Failed get data nomor penugasan terakhir')
            }
        }
        fetchDataListNomorAduan();
        fetchDataDivisi();
        fetchNomorPenugasanTerakhir();
    },[])
    
    useEffect(() => {
        console.log('list nomor aduan', listNomorAduan)
    }, [listNomorAduan])

    const handleSelectDivisi = (event:any) => {
        setSelectedDivisiId(event.target.value)
    }

    const submitData = async () => {
        console.log('data will be submitted to api are: ', 
        {
            "pengaduanIds" : selectedListAduan,
            "divisiId" : selectedDivisiId,
        })
        console.log('masuk ke data save')
        // Check for errors
        const hasErrors = [
            selectedDivisiId,
            selectedListAduan
        ].some((value) => value.length === 0 || value === '');
      
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
          text: "Apakah anda yakin ingin mengirim penugasan ini?",
          icon: "question",
          confirmButtonText: "Benar",
          showCancelButton: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            // Submit data to the server
            await axios.post('/api/penugasan', {
                pengaduanIds: selectedListAduan,
                divisiId: selectedDivisiId
            });
      
            // Handle successful submission
            Swal.fire("Berhasil!", "Pengaduan berhasil dikirim!", "success");
            document.getElementById('router-to-back')?.click();
            // Clear or reset form fields
          }
        });
    };      

    const submitEditData = async () => {

    };   

    return(
        <Box sx={{width: 1280}}>
            <Link id="router-to-back" href={'/admin/penugasan'}></Link>
            <HeaderPenugasan title="Penugasan Pengaduan" isNotOnIndexPage={true} />
            <Box bgcolor={'white'} height='full' sx={{p: 3}} borderRadius={2} border={0.1} borderColor={grey[300]}>
                <Box sx={{mb: 3}}>
                    <Box sx={{fontSize: 20, fontWeight: 700}}>Tambah Penugasan Pengaduan</Box>
                </Box>
                <Box borderRadius={2} border={0.1} borderColor={grey[300]} padding={4}>
                    <Grid container>
                        <Grid xs={12} sx={{mb:3}}>
                            <TextField label="No Penugasan" fullWidth value={noPenugasan} disabled />
                        </Grid>
                        <Grid xs={8.6} sx={{mb: 3}}>
                            <MultipleSelectPengaduan selectedNomorAduan={selectedListAduan} setSelectedNomorAduan={setSelectedListAduan} listNomorAduan={listNomorAduan} />
                        </Grid>
                        <Grid xs={3} sx={{ml: 4}}>
                            <FormControl fullWidth size="medium">
                                <InputLabel id="select-jenis-aduan-label">Divisi</InputLabel>
                                <Select
                                    labelId="select-jenis-aduan-label"
                                    id="select-jenis-aduan"
                                    value={selectedDivisiId}
                                    label="Jenis Aduan"
                                    onChange={(e) => {handleSelectDivisi(e)}}
                                >
                                    <MenuItem value={0}>{'--Pilih Divisi--'}</MenuItem>
                                    {dataDivisi.length > 0 && (
                                    dataDivisi.map((item:any) => (
                                        <MenuItem key={item.id} value={item.id}>{item.nama}</MenuItem>
                                    ))
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        {/* <Grid xs={12} sx={{mb:3}}>
                            <TextField label="Keterangan" fullWidth value={keterangan} onChange={(e) => {setKeterangan(e.target.value)}} />
                        </Grid> */}

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

export default TambahPenugasanComponents;