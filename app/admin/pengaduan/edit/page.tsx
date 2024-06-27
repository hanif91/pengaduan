'use client'

import { Dashboard } from "@/components/Dashboard/Dashboard";
import TambahPengaduanComponents from "@/components/Pengaduan/Form/TambahPengaduan/TambahPengaduan";
import { SessionProvider } from "next-auth/react";

const TambahPengaduanPage = () => {
    return(
        <SessionProvider>
            <>
                <Dashboard>
                    <TambahPengaduanComponents isEdit={true} />
                </Dashboard>
            </>
        </SessionProvider>
    )
}

export default TambahPengaduanPage;