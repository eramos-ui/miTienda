import { PropsWithChildren, useMemo, useState } from 'react';
import NextLink from 'next/link'; //con cambio de nombre
import { Card, Grid, CardActionArea, CardMedia, Box, Typography, Link, Chip } from '@mui/material';
import { IProduct } from '../../interfaces/products';

interface Props {
   product: IProduct;
}
export const ProductCard : React.FC<PropsWithChildren<Props>> = ( { product }) => {
  const [isHovered, setIsHovered] = useState(false);//para saber si el mouse está sobre la card
  const [ isImageLoaded, setIsImageLoaded ] =useState(false); //para que el texto aparezca cuando ña imagen está cargada
  const productImage= useMemo( () => {
    return isHovered //? `/products/${ product.images[1]}` : `/products/${ product.images[0]}`
          ? product.images[1]
          :product.images[0];
  },[ isHovered, product.images ])
  return (
    <Grid item xs={6} sm= {4} 
         onMouseEnter= { () => setIsHovered( true )}
         onMouseLeave = { () => setIsHovered( false )}
    >
        <Card>         
          <NextLink href={`/product/${ product.slug }`} passHref prefetch= { false }
              /* para ir a la card del producto */
          >
            <Link>
              <CardActionArea>
                {
                  ( product.inStock === 0 ) && (
                    <Chip
                        color = 'primary'
                        label = 'No hay disponible'
                        sx= {{ position : 'absolute', zIndex: 99, top: '10px', left: '10px' }}
                     />
                  )
                }
                  <CardMedia
                      component='img'
                      className='fadIn'
                      image={ productImage } //{ `products/${ product.images[0]}`}
                      alt={ product.title }        
                      onLoad= { () => setIsImageLoaded( true) }//para hacer algo cuando se cargan las imágenes
                  />
              </CardActionArea>
            </Link>

          </NextLink>
        </Card>
        {/* el display en este ternario hará que el texto se despliegue cuando la imagen está cargada (isImageLoaded) */}
        <Box sx= {{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className= 'fadeIn' >
           <Typography fontWeight={700}>{ product.title }</Typography>
           <Typography fontWeight={500}>{ `$${ product.price }` }</Typography>
        </Box>

    </Grid>
  )
}
