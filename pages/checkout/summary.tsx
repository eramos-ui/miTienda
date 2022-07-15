import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";

import { CartList, OrdenSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { CartContext } from '../../context';
import { countries } from '../../utils';
import Cookies from 'js-cookie';


const SummaryPage = () => {
    const router= useRouter();
    const { shippingAddress, numberOfItems, createOrder } = useContext( CartContext );
    //console.log(shippingAddress) 
    const [ isPosting, setIsPosting ] = useState( false );//para no graba 2 veces
    const [errorMessage, setErrorMessage] = useState(''); //mensaje de error al grabar
    useEffect(() => {
          if ( !Cookies.get('firstName') ){//si no tenemos el nombre le sacamos de esta página
              router.push('/checkout/address');
          }
    }, [ router ])
    

    if ( !shippingAddress ){
        return <></>;
    }
    const { firstName, lastName, address, address2='', country, city, phone, zip }= shippingAddress;
    const pais= countries.find ( p => p.code === country);
    
    const onCreateOrder = async () => {
       setIsPosting( true );
       const { hasError, message }=await  createOrder();
       if ( hasError ){
        setIsPosting( false );
        setErrorMessage( message );
        return;
       }
       router.replace(`/orders/${ message }`); //en el message vuelve el id de la orden
    }
    return  (    
        <ShopLayout title='Resumen de la orden' pageDescription="Resumen de la orden">
            <Typography variant='h1' component='h1'>Resumen de la orden</Typography>
            <Grid container >
                <Grid item xs= { 12 } sm={ 7 }>
                  {/* Cart list  editable puede no ir x defecto es false*/}
                  <CartList   />

                </Grid>
                <Grid item xs= { 12 } sm={ 5 }>
                    <Card  className='summary-card'>
                        <CardContent>
                            <Typography variant='h2' > Resumen ({numberOfItems} { (numberOfItems > 2) ? 'items': 'ítem'} )</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box display='flex' justifyContent='space-between' >
                                <Typography variant= 'subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref >
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>
                            <Typography variant= 'subtitle1'>{ firstName } { lastName }</Typography>
                            <Typography variant= 'subtitle1'>{ address }{address2?`, ${address2}`: '' }</Typography>
                            <Typography variant= 'subtitle1'>{ city }, { zip }</Typography>
                            {/* <Typography variant= 'subtitle1'>{ pais?.name }</Typography> */}
                            <Typography variant= 'subtitle1'>{ country }</Typography>
                            <Typography variant= 'subtitle1'>{ phone }</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box display='flex' justifyContent='end' >
                                <NextLink href='/cart' passHref >
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>
                            {/* Orden summary */}
                            <OrdenSummary />
                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column' >
                                <Button
                                    color='secondary' 
                                    className='circular-btn' 
                                    fullWidth
                                    onClick={ onCreateOrder } 
                                    disabled= { isPosting }                                   
                                >
                                     Confirmar orden
                                </Button>
                                <Chip  
                                    color='error'
                                    label = { errorMessage }
                                    sx={{ display: errorMessage ? 'flex': 'none', mt: 2  }}
                                /> 
                            </Box>
                        </CardContent>

                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>    
    )
}

export default SummaryPage;
