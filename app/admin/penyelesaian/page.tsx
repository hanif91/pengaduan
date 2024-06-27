'use client'

import { Dashboard } from '@/components/Dashboard/Dashboard'
import PenyelesaianComponents from '@/components/Penyelesaian/Penyelesaian'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

const PenyelesaianPage: React.FC = () => {
    return(
        <SessionProvider>
            <div>
                <Dashboard>
                    <PenyelesaianComponents />
                </Dashboard>
            </div>
        </SessionProvider>
    )
}

export default PenyelesaianPage