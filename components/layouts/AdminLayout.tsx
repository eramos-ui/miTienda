import { PropsWithChildren  } from "react";
//import Head from "next/head";


import { SideMenu } from "../ui";
import { AdminNavbar } from '../admin/AdminNavbar';
import { Box, Typography } from "@mui/material";

interface Props {
    //children?: React.ReactNode | undefined    
    title: string;
    subTitle: string;
    icon?: JSX.Element;
}

export const AdminLayout: React.FC<PropsWithChildren<Props>> = ({ children, title, subTitle, icon  }) => {
  return (
    <>
        <nav>
            <AdminNavbar />
        </nav>
        <SideMenu />
        <main  style={{
            margin: '80px auto',
            maxWidth:'1440px',
            padding:'0px  30px'
        }}>
            <Box display='flex' flexDirection='column'>
               <Typography variant='h1' component='h1' >
                { icon }
                {' '}
                { title }

               </Typography>
               <Typography variant='h2' sx={{ md: 1 }}>{ subTitle} </Typography>
         
            </Box>
            { children }
        </main>

    </>
  )
}
