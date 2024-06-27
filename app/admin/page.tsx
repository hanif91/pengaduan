'use client'

import {Dashboard} from "@/components/Dashboard/Dashboard"
import DataTotal from "@/components/DataTotalContainer/DataTotalContainer"
import { Grid, Paper } from "@mui/material"
import axios from "axios"
import { SessionProvider } from "next-auth/react"
import React, { useEffect, useState } from "react"

const AdminPage: React.FC = function () {

  const [dataHome, setDataHome] = useState<any>({});

  useEffect(() => {
    const fetchDataHome = async() => {
      try{
          const getDataHome = await axios.post('/api/home', {})
          setDataHome(getDataHome.data.data)
      }
      catch{
          console.warn('Failed get data divisi')
      }
    }
    fetchDataHome()
  }, [])
  
  useEffect(() => {console.log('dataHome', dataHome)}, [dataHome])
  return (
    <SessionProvider>
    <div>
      <Dashboard>
        {/* Aduan Belum Ditugasi */}
        <Grid container spacing={3} sx={{display: 'contents'}} ml={-2}>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <DataTotal title='Aduan Belum Ditugasi' period={new Date().getFullYear()} total={dataHome.pengaduanBelumDitugaskan} />
            </Paper>
          </Grid>
        </Grid>

        {/* Aduan yang sudah Ditugasi */}
        <Grid container spacing={3} sx={{display: 'contents'}}>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <DataTotal title='Aduan Sudah Ditugasi' period={new Date().getFullYear()} total={dataHome.pengaduanDitugaskan} />
            </Paper>
          </Grid>
        </Grid>

        {/* Aduan yang belum Diselesaikan */}
        <Grid container spacing={3} sx={{display: 'contents'}}>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <DataTotal title='Aduan Belum Diselesaikan' period={new Date().getFullYear()} total={dataHome.pengaduangBelumDiselesaikan} />
            </Paper>
          </Grid>
        </Grid>

        {/* Aduan yang sudah Diselesaikan */}
        <Grid container spacing={3} sx={{display: 'contents'}}>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <DataTotal title='Aduan Diselesaikan' period={new Date().getFullYear()} total={dataHome.pengaduanDiselesaikan} />
            </Paper>
          </Grid>
        </Grid>
      </Dashboard>
    </div>
    </SessionProvider>
  )
}

export default AdminPage;