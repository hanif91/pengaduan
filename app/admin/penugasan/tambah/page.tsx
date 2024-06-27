'use client'

import { Dashboard } from "@/components/Dashboard/Dashboard";
import TambahPenugasanComponents from "@/components/Penugasan/Form/TambahPenugasan/TambahPenugasan";
import { SessionProvider } from "next-auth/react";

const TambahPenugasanPage = () => {
    return(
        <SessionProvider>
            <>
                <Dashboard>
                    <TambahPenugasanComponents />
                </Dashboard>
            </>
        </SessionProvider>
    )
}

export default TambahPenugasanPage;