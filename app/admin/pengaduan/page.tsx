"use client"

import { Dashboard } from '@/components/Dashboard/Dashboard'
import PengaduanComponents from '@/components/Pengaduan/Pengaduan'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

const PengaduanPage: React.FC = () => {
    return(
        <SessionProvider>
            <div>
                <Dashboard>
                    <PengaduanComponents />
                </Dashboard>
            </div>
        </SessionProvider>
    )
}

export default PengaduanPage