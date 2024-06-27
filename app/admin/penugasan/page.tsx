'use client'

import { Dashboard } from '@/components/Dashboard/Dashboard'
import PenugasanComponents from '@/components/Penugasan/Penugasan'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

const PenugasanPage: React.FC = () => {
    return(
        <SessionProvider>
            <div>
                <Dashboard>
                    <PenugasanComponents /> 
                </Dashboard>
            </div>
        </SessionProvider>
    )
}

export default PenugasanPage