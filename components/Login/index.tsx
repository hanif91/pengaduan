
import { NextPage } from "next";
import { FormEventHandler, useEffect, useState } from "react";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import TirtaDharma from "@/public/tirta-dharma.png"
import Image from "next/image";
import { dispatch } from "@/store/Store";
import { setIsAuthenticated } from "@/store/UserDataRedux/UserDataSlice";
import { Alert, Avatar, Box, Button, Card, Checkbox, FormControlLabel, Grid, InputLabel, Link, Paper, TextField, Typography } from "@mui/material";

const Login: NextPage = (): JSX.Element => {
  const [userInfo, setUserInfo] = useState({ username: '', password: '' });
  const [error, setError] = useState(false);
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      username: userInfo.username,
      password: userInfo.password,
      redirect: false,
    });
    console.log(res);
    if(res?.status !== 200) setError(true);
    else dispatch(setIsAuthenticated(true))
  }

  const { status, data } = useSession();


  useEffect(() => {
    console.log('state from useSession', status, data)
    if (status === "loading") return; // Do nothing while loading
    if (status === "authenticated") window.location.href = "/admin/" // If authenticated, force log in
  }, [data, status]);

  const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
  const avatarStyle={backgroundColor:'#1bbd7e'}
  const btnstyle={margin:'8px 0'}

  return (
    // <div className="flex h-screen justify-center items-center">
    //   <Box className="mt-80 w-72">
    //   <div className="flex flex-row gap-5 items-center justify-center">
    //     {/* <Image src={TirtaDharma} width={50} height={50} alt={""} />   */}
    //     <div className="ml-5 text-3xl">SIPAMIT</div>
    //   </div>

    //   {error ?
    //     <Alert color="warning">
    //     <span className="font-medium">Warning!</span> Username atau password salah.
    //     </Alert>
    //   :
    //   <div className="text-white"><span className="font-medium">Warning!</span> <span>Username or password is wrong.</span></div>}

    //   <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
    //     <div>
    //       <TextField 
    //         value={userInfo.username}
    //         onChange={({ target }) => setUserInfo({ ...userInfo, username: target.value })}
    //         type="username"
    //         placeholder="username" 
    //         required />
    //     </div>
    //     <div>
    //       <TextField 
    //         value={userInfo.password}
    //         onChange={({ target }) => setUserInfo({ ...userInfo, password: target.value })}
    //         type="password"
    //         placeholder="****" required />
    //     </div>
    //     <Button type="submit">Submit</Button>
    //   </form>
    // </Box>
    // </div>
    <Box alignItems={'center'} justifyItems={'center'} display={'flex'} flexDirection={'column'} style={{height: '100vh'}}>
      <Box style={{position: 'absolute', top: '50%', left: '50%', marginTop: -150, marginLeft: -200, width: '400px', height: '400px'}}>
        <form onSubmit={handleSubmit}>
          <Card style={{display: 'flex', flexDirection: 'column', gap: 20, padding: 20}}>
            <div style={{display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', justifyItems: 'center'}}>
              <Image src={TirtaDharma} width={50} height={50} alt={""} />  
              <div className="ml-5 text-xl">LOGIN SIMADU BAYUANGGA</div>
            </div>
            {error ? <Alert severity="error">Username atau Password salah!</Alert> : null}
            <TextField label={'Username'} value={userInfo.username} onChange={({ target }) => setUserInfo({ ...userInfo, username: target.value })} type="text" />
            <TextField label={'Password'} value={userInfo.password} onChange={({ target }) => setUserInfo({ ...userInfo, password: target.value })} type="password" />
            <Button color="primary" type="submit">Masuk</Button>
          </Card>
        </form>
      </Box>
    </Box>
  );
}

export default Login;