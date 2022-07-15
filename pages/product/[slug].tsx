import { useContext, useState } from 'react';
import { NextPage, GetServerSideProps , GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { Box, Button, Chip, Grid, Typography } from "@mui/material";

import { CartContext } from '../../context';
import { ShopLayout } from "../../components/layouts";
import { ProductSlideshow, SizeSelector } from "../../components/products";
//import { initialData } from "../../database/products";
import 'react-slideshow-image/dist/styles.css';
import { ItemCounter } from "../../components/ui";
// import { useRouter } from "next/router";
// import { useProducts } from "../../hooks";
import { IProduct, ICartProduct, ISize } from "../../interfaces";
import { dbProducts } from '../../database';
import { getAllProductSlugs } from '../../database/dbProducts';
//import { ISize } from '../../interfaces/products';


//const product= initialData.products[0]; //para tener data en el diseño de la página
interface Props {
  children?: React.ReactNode;
  product: IProduct;
}
const ProductPage : NextPage<Props> = ({ product }) => {
  //console.log('product',product)
  //no usamos lo que sigue para generar la pagina del lado del server
  // const router=useRouter();
  // console.log(router)
  // const { products: product, isLoading } = useProducts(`/products/ ${ router.query.slug }`)
  // if( isLoading  ){
  //   return <h1>Cargando</h1>
  // }
  const router= useRouter();
  const { addProductToCart } = useContext(CartContext);
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });
  const selectedSize= ( size: ISize) =>{
      setTempCartProduct(  currentProduct => ( { //en state inicial está el product, excepto el size y la quantity
        ...currentProduct,
        size
      } ) );
  };
  const onUpdateQuantity=( quantity: number ) =>{
    setTempCartProduct(  currentProduct => ( { //en state inicial está el product, excepto el size y la quantity
      ...currentProduct,
      quantity
    } ) );

  };
  const onAddProduct=() => {
    if ( !tempCartProduct.size ) return;
     //console.log(tempCartProduct ) 
     addProductToCart( tempCartProduct );
     router.push('/cart');
  }
  return (
    <ShopLayout title={ product.title } pageDescription={ product.description }>
        <Grid container spacing= { 3 }>
          <Grid item xs= { 12 } sm={ 7 }>
             <ProductSlideshow 
                images= { product.images }
              />
          </Grid>
          <Grid item xs= { 12 } sm={ 5 }>
            <Box display='flex' flexDirection= 'column'>
                {/* Títulos */}
                <Typography variant='h1' component='h1' >{ product.title }</Typography>
                <Typography variant='subtitle1' component='h2' >{ `$${product.price}` }</Typography>
                {/* Cantidad */}
                <Box sx={{ my: 2 }}>
                  <Typography variant='subtitle2'  > Cantidad</Typography>
                  <ItemCounter
                    currentValue = { tempCartProduct.quantity }
                    updatedQuantity={ onUpdateQuantity }
                    maxValue={ product.inStock > 10 ? 10 : product.inStock  }
                  />
                  <SizeSelector 
                      //selectedSize={ product.sizes[2] } //ninguno seleccionado
                      sizes={ product.sizes } 
                      selectedSize = { tempCartProduct.size }     
                      //onSelectedSize = { (size) => selectedSize (size  ) }   //esta función está en el hijo (SizeSelector)         
                      onSelectedSize={ selectedSize }//mismo anterior
                   />
                  {/* Item counter */}
                </Box >
                {/* Agregar al car */}
                {
                  ( product.inStock > 0 ) 
                  ? (
                    <Button 
                      color='secondary' 
                      className='circular-btn'
                      onClick={ onAddProduct }
                    >
                      {
                        tempCartProduct.size
                        ? 'Agregar al carro de compras'
                        : 'Seleccione una talla'
                      }
                    </Button>
                   )
                  :(
                    <Chip color = 'error' label = 'No hay disponible'  variant='outlined' />
                   )

                }
                {/* <Chip label='No hay disponibles' color='error' variant='outlined' /> */}
                {/* Descripción */}
                <Box  sx={{ mt: 3 }}>
                  <Typography variant='subtitle2'>Descripción</Typography>
                  <Typography variant='body2'>{ product.description }</Typography>

                </Box>
            </Box>
          </Grid>
        </Grid>
    </ShopLayout>
  )
};
//gerServer side props SSR
// export const getServerSideProps: GetServerSideProps = async ( { params } ) => {//snipped nextssp
//   const { slug = '' } = params as { slug: string};
//   const product = await  dbProducts.getProductBySlug( slug );
//   if ( !product ){//si no existe se redirecciona
//     return {
//       redirect: {'/',
//       permanent: false
//      } 
//     }
//   }
//   return {
//     props: {
//          product 
//     }
//   }
// }
//para generarlo de manera static
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes


export const getStaticPaths: GetStaticPaths = async (ctx) => {//esto genera un array con los params
  //console.log(ctx)
  const productSlugs = await dbProducts.getAllProductSlugs(); // your fetch function here 
  
  return {
    paths: productSlugs.map(( { slug }) =>({
      params: {
        slug //slug: obj.slug //desestructurado para no escribir esto
      }
    })),
    fallback: "blocking" //deja pasar al usuario al getStaticProps y puede no haber params 
  }
};
// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async ( { params }) => {//aquí genera las páginas estáticas a partir de los params de getStaticPaths
  const { slug = '' } = params as { slug: string}; 
  const product= await dbProducts.getProductBySlug( slug );
  if ( !product ){//si no existe se redirecciona
      return {
        redirect:{ 
          destination: '/',
          permanent: false
        }
      }
   }
  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24//c/24 horas
  }
}

export default ProductPage;