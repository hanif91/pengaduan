"use client"

import Login from "@/components/Login";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const LoginPage = () => {

    return (
        <SessionProvider>
        <div className="">
            <Login />
        </div>
        </SessionProvider>
  );
}

export default LoginPage;