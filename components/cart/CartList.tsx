import { PropsWithChildren, useContext } from 'react';
import NexLink from 'next/link';
import { CardMedia, Grid, Link, Typography, CardActionArea, Box, Button } from '@mui/material';

//import { initialData } from '../../database/seed-data';
import { ItemCounter } from '../ui';
import { CartContext } from '../../context/cart/CartContext';
import { ICartProduct, IOrderItem } from '../../interfaces';


// const productsInCart = [
//     initialData.products[0],
//     initialData.products[1],
//     initialData.products[2],
// ]

interface Props {
    editable?: boolean;
    products?: IOrderItem[]
}
export const CartList: React.FC<PropsWithChildren<Props>>= ({ editable = false, products  }) => {
  const { cart, updateCartQuantity, removeCartProducto } = useContext( CartContext );
  const onNewCartQuantityValue= ( product: ICartProduct, newQuantityValue: number ) =>{
    product.quantity= newQuantityValue;
    updateCartQuantity( product );
  }
  const productsToShow = products ? products: cart; //para reutilizar mostrando el carro o mostrar la orden ya grabada
  return (     
  <>
         {       
            //productsInCart.map( product => (
            productsToShow.map( product => (
                <Grid container spacing={2} key={ product.slug + product.size } sx= {{ mb: 1 }}>
                    <Grid item xs= {3} >
                        <NexLink href={`/product/${ product.slug }`} passHref >
                            <Link>
                              <CardActionArea>
                                <CardMedia
                                    image={ product.image }//{`/products/${ product.image }` }
                                    component='img'
                                    sx={{ borderRadius: '5px' }}
                                 />
                              </CardActionArea>
                            </Link>
                        </NexLink>
                    </Grid>
                    <Grid item xs= {7} >
                        <Box display= 'flex' flexDirection ='column'>
                            <Typography variant= 'body1' >{ product.title }</Typography>
                            <Typography variant= 'body1' > Talla: <strong>{ product.size }</strong> </Typography>
                            {/* Condicional */}
                            {
                                editable
                                ? (
                                  <ItemCounter 
                                  currentValue={ product.quantity }
                                  maxValue={ 10 } //arbitrario
                                  updatedQuantity= { ( newValue) => onNewCartQuantityValue( product as ICartProduct, newValue )}
                                    
                                  />
                                  )
                                :<Typography variant='h4'>{ product.quantity} { product.quantity >1 ?'items': 'ítem' }</Typography>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs= {2} display= 'flex' alignItems= 'center' flexDirection= 'column' >
                        <Typography variant= 'subtitle1' >{ `$${ product.price }` }</Typography>
                        {/* Editable? */}
                        {
                            editable &&  
                            <Button 
                                variant='text' color='secondary'
                                onClick={() => removeCartProducto( product as ICartProduct ) }
                            > Remover 
                            </Button>                            
                        }
                        
                    </Grid>

                    {/* <Typography key={ product.slug } >{ product.title }</Typography> */}
                </Grid>
            ))
        }      
  </>
     
  )
}
