import { PropsWithChildren } from "react";
import Head from "next/head";
import { Box } from "@mui/material";


interface Props {
    children?: React.ReactNode | undefined ;   
    title: string;
}
export const AuthLayout: React.FC<PropsWithChildren<Props>> = ( { children, title }) => {
  return (
      <>
         <Head>
            <title> { title }</title>
         </Head>
         <main>
            <Box display = 'flex' justifyContent='center' alignItems='center' height="calc(100vh - 200px)" >
                { children }
            </Box>
         </main>
      </> 
  )
}
