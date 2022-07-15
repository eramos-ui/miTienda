import { GetServerSideProps, NextPage } from 'next';

import { Box, Card, CardContent, Chip,  Divider, Grid,  Typography } from "@mui/material";
import { AirplaneTicketOutlined, CreditCardOffOutlined,  CreditScoreOutlined } from '@mui/icons-material';

import { CartList, OrdenSummary } from "../../../components/cart";
import { AdminLayout } from "../../../components/layouts";
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';


interface Props {
    //children?: React.ReactNode;
    order: IOrder
  }
const OrderPage : NextPage<Props> = ( { order } )  => {
    const { shippingAddress }= order;
    
    return  (    
        <AdminLayout title='Resumen de la orden' subTitle= { `OrdenID: ${ order._id }`} icon ={ <AirplaneTicketOutlined />}>
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
                            <Box  flexDirection='column' >
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

                            </Box>
                        </CardContent>

                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>    
    )
}
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id= '' } = query;

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
    return {
        props: {
            order
        }
    }
}
export default OrderPage;
