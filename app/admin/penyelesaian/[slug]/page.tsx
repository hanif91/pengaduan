"use client"

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";
import Image from "next/image";
import PDAMPNG from "@/public/tirta-dharma.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { FormattedDate, FormattedMessage, IntlProvider } from "react-intl";
import Link from "next/link";
import { Button, Icon } from "@mui/material";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import ChevronLeft from "@mui/icons-material/ChevronLeft";

const formatDataID = (isoStringDate: string) => {
    const date = new Date(isoStringDate);
    const options:any = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };
      
      const formatter = new Intl.DateTimeFormat('id-ID', options);
      const formattedDate = formatter.format(date);
      
      return formattedDate;
}

const PenyelesaianDetail = ({ params }: { params: { slug: string } }) => {
  const [dataPenyelesaian, setDataPenyelesaian] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/get-penyelesaian?pengaduanId=${params.slug}`);
        setDataPenyelesaian(response.data.data);
        setIsLoading(false);
      } catch (error:any) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  useEffect(() => {
    if (dataPenyelesaian.nomor) {
    //   window.print();
    } else if (error) {
      alert("Pengaduan belum diselesaikan atau terjadi kesalahan");
    } else {
      // Handle initial loading or other cases
    }
  }, [dataPenyelesaian, error]);

  const printPenyelesaian = () => {
    window.print()
  }

  return (
    <IntlProvider locale="id">
      <div style={{ padding: 20 }}>
        <div className="d-flex flex-row justify-content-between" id="print-button">
            <div>
                <Link href={"/admin/penyelesaian"} id="route-to-penyelesaian" > 
                    <Button startIcon={<ChevronLeft style={{fontSize: 36, cursor: "pointer"}} />} >KEMBALI </Button>
                </Link>
            </div>
            <div>
                <Button onClick={printPenyelesaian} endIcon={<LocalPrintshopIcon style={{fontSize: 36, cursor: "pointer"}} />} >PRINT</Button>
            </div>
        </div>
        <div id="data-penyelesaian">
            <div className="panel panel-inverse" style={{ padding: 20 }}>
                <div className="panel-body" id="print">
                    {isLoading ? (
                    <div>Loading data...</div>
                    ) : error ? (
                    <div>Error fetching data: {error}</div>
                    ) : (
                    // Render the rest of the content with data
                    <div>
                        <div className="row mb-1">
                            <div className="d-flex flex-column align-items-center">
                                <div>
                                    <Image className="img-responsive" src={PDAMPNG} alt="Logo" width={150} height={100} />
                                </div>
                                <div>
                                    <p style={{fontSize: 14}}>PERUMDA AIR MINUM BAYUANGGA KOTA PROBOLINGGO</p>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-1">
                                <div className="col-md-12 text-center">
                                <p style={{fontSize: 14}}>PENYELESAIAN PENGADUAN</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <table className="table table-bordered table-sm" style={{fontSize: 8}}>
                                    <tbody><tr>
                                        <td className="text-bold" style={{fontWeight: 600, width:"20%!important"}}> No. Aduan</td>
                                        <td>{dataPenyelesaian.nomor ? dataPenyelesaian.nomor : ''}</td>
                                        <td style={{width:"50% !important"}} className="text-bold text-center">Keterangan</td>
                                    </tr>
                                    <tr>
                                        <td className="text-bold" style={{fontWeight: 600, width:"20%!important"}}>Hari, Tanggal</td>
                                        <td>
                                            {dataPenyelesaian.created_at ? formatDataID(dataPenyelesaian.created_at): ''}
                                        </td>
                                        <td rowSpan={6}>{dataPenyelesaian.keterangan}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-bold" style={{fontWeight: 600, width:"20%!important"}}>Jenis Aduan</td>
                                        <td>{dataPenyelesaian.jenis_aduan ? dataPenyelesaian.jenis_aduan.nama : ''}</td>

                                    </tr>
                                    <tr>
                                        <td className="text-bold" style={{fontWeight: 600, width:"20%!important"}}>No Pelanggan</td>
                                        <td>{dataPenyelesaian.pelanggan_id ? dataPenyelesaian.pelanggan.nama: ""}</td>

                                    </tr>
                                    <tr>
                                        <td className="text-bold" style={{fontWeight: 600, width:"20%!important"}}>Nama</td>
                                        <td>{dataPenyelesaian.nama}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-bold" style={{fontWeight: 600, width:"20%!important"}}>Alamat</td>
                                        <td>{dataPenyelesaian.alamat}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-bold" style={{fontWeight: 600, width:"20%!important"}}>No Identitas</td>
                                        <td>{dataPenyelesaian.no_identitas}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-bold" style={{fontWeight: 600, width:"20%!important"}}>No. Telp / No. Hp</td>
                                        <td>{dataPenyelesaian.no_telp}</td>
                                        <td align="center">Foto Penyelesaian</td>
                                    </tr>
                                    
                                    <tr>
                                        <td className="text-bold" style={{fontWeight: 600, width:"20%!important"}}>Tanggal Selesai</td>
                                        <td>
                                            {dataPenyelesaian.completed_at ? formatDataID(dataPenyelesaian.completed_at): ''}
                                        </td>
                                        <td rowSpan={6} width={400} align="center"><Image alt="" src={dataPenyelesaian.foto_penyelesaian} width={300} height={300} /></td>
                                    </tr>
                                    <tr>
                                        <td className="text-bold" style={{fontWeight: 600}}>Diproses Tanggal</td>
                                        <td className="text-bold">{dataPenyelesaian.processed_at ? formatDataID(dataPenyelesaian.processed_at) : ''}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-bold" style={{fontWeight: 600}}>Pemilih Petugas</td>
                                        <td className="text-bold">{dataPenyelesaian.petugas_pengaduan_processed_byTopetugas ? dataPenyelesaian.petugas_pengaduan_processed_byTopetugas.nama : ''}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-bold" style={{fontWeight: 600}}>Target Penyelesaian</td>
                                        <td className="text-bold">{dataPenyelesaian.tgl_target ? formatDataID(dataPenyelesaian.tgl_target) : ''}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-bold" style={{fontWeight: 600}}>Jenis Penyelesaian</td>
                                        <td className="text-bold">{dataPenyelesaian.jenis_penyelesaian ? dataPenyelesaian.jenis_penyelesaian.nama_penyelesaian : ''}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-bold" style={{fontWeight: 600}}>Petugas</td>
                                        <td className="text-bold">{dataPenyelesaian.petugas ? `${dataPenyelesaian.petugas.nama}` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} align="center" style={{fontWeight: 600}}>Keterangan Penyelesaian</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{fontWeight: 200}}>{dataPenyelesaian.ket_selesai}</td>  
                                    </tr>
                                </tbody></table>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </IntlProvider>
  );
};

export default PenyelesaianDetail;
