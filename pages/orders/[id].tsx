import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {  PayPalButtons } from '@paypal/react-paypal-js';

import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid,  Typography } from "@mui/material";
import { CreditCardOffOutlined, CreditCardOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { CartList, OrdenSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import tesloApi from '../../api/tesloApi';

interface  OrderResponseBody {//seleccionados los que interesan del ALT click sobre capture em onAprove
    id: string;
    status:
    | 'COMPLETED'
    | 'SAVED'
    | 'APPROVED'
    | 'VOIDED'
    | 'PAYER_ACTION_REQUIRED';
}
interface Props {
    //children?: React.ReactNode;
    order: IOrder
  }
const OrderPage : NextPage<Props> = ( { order } )  => {
    const router= useRouter();
    const { shippingAddress }= order;
    const [ isPaging, setIsPaging ] = useState( false);
    const onOrderCompleted = async ( details :OrderResponseBody) => {
       if ( details.status !== 'COMPLETED') {
           return alert('No hay pago en Paypal');
       }
       setIsPaging( true );
       try {
          const { data }= await tesloApi.post(`/orders/pay`,{
            transactionId: details.id,
            orderId: order._id
          })
          router.reload();//si todo está OK recarga la página y la Orden aparecerá pagada
       }catch (error) {
          setIsPaging( true );
          console.log(error);
          alert('Error');
       }
    }
    return  (    
        <ShopLayout title='Resumen de la orden' pageDescription={"Resumen de la orden"}>
            <Typography variant='h1' component='h1'>Orden: { order._id }</Typography>
            {
                order.isPaid 
                ?(
                    <Chip 
                        sx={{ my: 2 }}//my es margen eje y
                        label='Orden ya fue pagada'
                        variant='outlined'
                        color ='success'
                        icon ={ <CreditScoreOutlined />}
                    ></Chip>
                ): (
                    <Chip 
                        sx={{ my: 2 }}//my es margen eje y
                        label='Pendiente de pago'
                        variant='outlined'
                        color ='error'
                        icon ={ <CreditCardOffOutlined />}
                    ></Chip>
                )
            }
            
            <Grid container className='fadeIn'>
                <Grid item xs= { 12 } sm={ 7 }>
                  {/* Cart list  editable puede no ir x defecto es false*/}
                  <CartList  products= { order.orderItems }   />

                </Grid>
                <Grid item xs= { 12 } sm={ 5 }>
                    <Card  className='summary-card'>
                        <CardContent>
                            <Typography variant='h2' > Resumen ({ order.numberOfItems } { order.numberOfItems >1 ?'items': 'item'} )</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box display='flex' justifyContent='space-between' >
                                <Typography variant= 'subtitle1'>Dirección de entrega</Typography>
                                {/* <NextLink href='/checkout/address' passHref >
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink> */}
                            </Box>
                            <Typography variant= 'subtitle1'>{ shippingAddress.firstName } { shippingAddress.lastName}</Typography>
                            <Typography variant= 'subtitle1'>{shippingAddress.address }{shippingAddress.address2 ? `, ${shippingAddress.address2}`: '' } </Typography>
                            <Typography variant= 'subtitle1'>{ shippingAddress.city }, { shippingAddress.zip }</Typography>
                            <Typography variant= 'subtitle1'> { shippingAddress.country}</Typography>
                            <Typography variant= 'subtitle1'>Fono: { shippingAddress.phone }</Typography>
                            <Divider sx={{ my: 1 }} />
                            {/* <Box display='flex' justifyContent='end' >
                                <NextLink href='/cart' passHref >
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box> */}
                            {/* Orden summary */}
                            <OrdenSummary  orderValues={ {
                                      numberOfItems: order.numberOfItems,
                                      subTotal: order.subTotal,
                                      tax: order.tax,
                                      total: order.total
                                }} 
                            />
                            <Box sx={{ mt: 3 }}  display='flex' flexDirection='column' >
                                <Box 
                                    display= 'flex' 
                                    justifyContent='center' 
                                    className='fadeIn' 
                                    sx = {{ display: isPaging ? 'flex':'none' }}
                                >
                                    <CircularProgress />
                                </Box>
                                <Box  sx = {{ display: isPaging ? 'none':'flex', flex : 1 }} flexDirection='column'  >

                                    {
                                        order.isPaid 
                                        ?(
                                            <Chip 
                                                sx={{ my: 2 }}//my es margen eje y
                                                label='Orden ya fue pagada'
                                                variant='outlined'
                                                color ='success'
                                                icon ={ <CreditScoreOutlined />}
                                            ></Chip>
                                        ):(
                                        //   <h1>Pagar</h1>  
                                        <PayPalButtons 
                                                createOrder={(data, actions) => {
                                                
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: `${order.total}`,
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {                                                
                                                    return actions.order!.capture().then((details) => {
                                                        onOrderCompleted( details );
                                                        // console.log({ details });
                                                        // const name = details.payer.name!.given_name;
                                                        // alert(`Transaction completed by ${name}`);
                                                    });
                                                }}
                                        />          
                                        )
                                    }
                                </Box>
                                {/* <Button color='secondary' className='circular-btn' fullWidth >
                                     Confirmar orden
                                </Button> */}

                            </Box>
                        </CardContent>

                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>    
    )
}
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id= '' } = query;
    // console.log('query',query)
    //validar la sessión del usuario
     const session: any = await getSession( { req });
     //console.log('session',session)
     if ( !session ){//puede que haya expirado
         return {
             redirect: {
                 destination: `/auth/login?p=/orders/${ id }`,//se va al login
                 permanent: false
             }
         }
     }
     //console.log('id',id)
     //verificamos que la orden le pertenezca
    const order = await dbOrders.getOrderById( id.toString() );
    
    if ( !order ){
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false
            }
        }
    }
    //console.log('order.user, session in getServerSideProps',  order.user, session.user._id)
    if ( order.user !== session.user._id ){
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false
            }
        }
    }
    return {
        props: {
            order
        }
    }
}
export default OrderPage;
