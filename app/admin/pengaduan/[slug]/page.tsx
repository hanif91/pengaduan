"use client"

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css"
import Image from "next/image";
import PDAMPNG from "@/public/tirta-dharma.png"
import { useEffect, useState } from "react";
import axios from "axios";
import { FormattedDate, FormattedMessage, IntlProvider } from 'react-intl';

const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
};

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

export default function PengaduanDetail({ params }: { params: { slug: string } }) {
    const [dataPengaduan, setDataPengaduan] = useState<any>({});
    useEffect(() => {
        console.log("request to ", params.slug)
        const fecthDetailPengaduanData = async() => {
            try{
                const fetchPengaduan = await axios.get(`/api/get-pengaduan?pengaduanId=${params.slug}`)
                setDataPengaduan(fetchPengaduan.data.data);
                console.log(fetchPengaduan.data.data)
            }
            catch{
                console.warn('error get pengaduan data')
            }
            
        }
        fecthDetailPengaduanData()
    },[params.slug])

    useEffect(() => {
        if(dataPengaduan.nomor) {
            window.print();
        }
    }, [dataPengaduan])
    return (
    <div>
        <div className="panel panel-inverse">
            <div className="panel-heading">
                <div className="panel-heading-btn">
                    <a href="http://192.168.0.99:3090/penerimaan-aduan" className="f-s-15 text-white"><i className="fa fa-times-circle"></i></a>

                </div>
                <h4 className="panel-title"><a href="javascript:;" className="f-s-15 text-white"><i className="fa fa-print"></i></a></h4>
            </div>
            <div className="panel-body" id="print">
                <div className="row mb-4">
                    <div className="d-flex flex-column align-items-center">
                        <div>
                            <Image className="img-responsive" src={PDAMPNG} alt="Logo" width={150} height={100} />
                        </div>
                        <div>
                            <h5>PERUMDA AIR MINUM BAYUANGGA KOTA PROBOLINGGO</h5>
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-md-12 text-center">
                        <h6>PENYELESAIAN PENGADUAN</h6>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <table className="table table-bordered table-sm">
                            <tbody><tr>
                                <td style={{width:"20%!important"}} className="text-bold">No. Aduan</td>
                                <td>{dataPengaduan.nomor}</td>
                                <td style={{width:"50% !important"}} className="text-bold text-center">Keterangan</td>
                            </tr>
                            <tr>
                                <td style={{width:"20%!important"}} className="text-bold">Hari, Tanggal</td>
                                <td>
                                    {dataPengaduan.created_at ? formatDataID(dataPengaduan.created_at): ''}
                                </td>
                                <td rowSpan={6}>{dataPengaduan.keterangan}</td>
                            </tr>
                            <tr>
                                <td style={{width:"20%!important"}} className="text-bold">Jenis Aduan</td>
                                <td>{dataPengaduan.jenis_aduan ? dataPengaduan.jenis_aduan.nama : ''}</td>

                            </tr>
                            <tr>
                                <td style={{width:"20%!important"}} className="text-bold">No Pelanggan</td>
                                <td>{dataPengaduan.pelanggan_id ? dataPengaduan.pelanggan.nama: ""}</td>

                            </tr>
                            <tr>
                                <td style={{width:"20%!important"}} className="text-bold">Nama</td>
                                <td>{dataPengaduan.nama}</td>
                            </tr>
                            <tr>
                                <td style={{width:"20%!important"}} className="text-bold">Alamat</td>
                                <td>{dataPengaduan.alamat}</td>
                            </tr>
                            <tr>
                                <td style={{width:"20%!important"}} className="text-bold">No Identitas</td>
                                <td>{dataPengaduan.no_identitas}</td>
                            </tr>
                            <tr>
                                <td style={{width:"20%!important"}} className="text-bold">No. Telp / No. Hp</td>
                                <td>{dataPengaduan.no_telp}</td>
                            </tr>
                        </tbody></table>
                    </div>
                </div>
            </div>
        </div>
    </div>)
  }
  