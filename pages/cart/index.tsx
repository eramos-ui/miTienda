import { useContext, useEffect } from 'react';
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";

import { CartContext } from '../../context';
import { CartList, OrdenSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { useRouter } from 'next/router';


const CartPage = () => {
    const { isLoaded, cart } = useContext( CartContext );
    const router = useRouter();
    useEffect(() => {
       if ( isLoaded && cart.length === 0 ){//tiene carrito vacío
          router.replace('/cart/empty');
       }
    }, [ isLoaded, cart, router ])
    if ( !isLoaded || cart.length === 0 ){// para que no renderice si no está cargado
        return (<></>);
    }
    
    return  (    
        <ShopLayout title='Carrito - 3' pageDescription="Carrito de compras de la tienda">
            <Typography variant='h1' component='h1'>Carrito</Typography>
            <Grid container >
                <Grid item xs= { 12 } sm={ 7 }>
                  {/* Cart list  editable puede no ir x defecto es false*/}
                  <CartList  editable />
                </Grid>
                <Grid item xs= { 12 } sm={ 5 }>
                    <Card  className='summary-card'>
                        <CardContent>
                            <Typography variant='h2' > Orden</Typography>
                            <Divider sx={{ my: 1 }} />
                            {/* Orden summary */}
                            <OrdenSummary />
                            <Box sx={{ mt: 3 }}>
                                <Button 
                                    color='secondary' 
                                    className='circular-btn' 
                                    fullWidth 
                                    href='/checkout/address'
                            >
                                     Ir a despacho
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>    
    )
}

export default CartPage;
