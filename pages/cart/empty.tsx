
import NextLink from 'next/link';
import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';



const EmptyPage = () => {
  return (
    <ShopLayout title= 'Carrito de compras vacío' pageDescription='No hay artículos en el carro de compras'>
        <Box display= 'flex' 
            justifyContent='center' 
            alignItems='center'
            height='calc(100vh-200px)'
            sx={{ flexDirection: { xs: 'column', sm: 'row'} }}
        >
            <RemoveShoppingCartOutlined  sx={{ fontSize: 100 }}/>
            <Box display=  'flex' flexDirection='column' alignItems= 'center'
            >
                <Typography marginLeft={ 2 } >
                    Su carro de compras está vacío
                </Typography>
                <NextLink href='/' passHref >
                    <Link  typography='h4'  color= 'secondary'>
                        Regresar
                    </Link>
                </NextLink>

            </Box>
            {/* <Typography variant='h1' component='h1' fontSize= { 80} fontWeight={ 200 } >404 |</Typography> */}

        </Box>
    </ShopLayout>
  )
};

export default EmptyPage;