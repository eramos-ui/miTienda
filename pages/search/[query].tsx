//copiado del index.tsx

import { PropsWithChildren } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { Box, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';

import { ProductList } from '../../components/products';
// import { FullScreenLoading } from '../../components/ui';
// import { useProducts } from '../../hooks';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces/products';
interface Props{
    //children?: React.ReactNode;
    products: IProduct[];//esto no es del todo ciero y podría hacerse un interfaz quw se lo que realmente devolvemos
    foundProducts: boolean;
    query: string;
}
const SearchPage:  NextPage<PropsWithChildren<Props>> = ( { products, foundProducts, query }) => {
  //const { products, isLoading } =useProducts('/products' );//este hook es alternativa a usar el contexto
  return (
    <ShopLayout title = {'Tienda-Shop - Home'} pageDescription={'Encuentra los mejores productos, están aquí'} >
      <Typography variant= 'h1' component='h1'>Buscar productos</Typography>
      {
        foundProducts
        ? <Typography variant= 'h2' sx= {{ marginBottom: 1 }} textTransform='capitalize' >Búsqueda: { query }</Typography>
        :(
            <Box display='flex'>
                <Typography variant= 'h2' sx= {{ mb: 1 }}>No encontramos ningún producto </Typography>
                <Typography variant= 'h2' sx= {{ ml: 1 }} color='secondary' textTransform='capitalize' > { query } </Typography>
            </Box> 
        )
      }
      {/* No se ocupar ni el hook useProduct ni lo que siguq al user SSP */}
      {/* {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products= { products } />
      } */}
       <ProductList products= { products } />
    </ShopLayout>
  )
};
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// se hace SSP porque estas no pueden ser estaticas, depende de una mayor vaiedad de clientes y contenido de sus search
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { query ='' } = params as { query: string };//esto porque le pusimos [query].tsx a la página
    if ( query.length === 0 ) {
        return{
            redirect :{
                destination: '/',
                permanent: true
            }
        } 
    }
    let products = await dbProducts.getProductsByTerm( query ); // podrian no haber
    const foundProducts= products.length>0;
    //si no hay resultados de la búsqueda ... devolver algo
    if ( !foundProducts ){ 
           //products= await dbProducts.getAllProducts();
           products=await dbProducts.getProductsByTerm('shirt');
    }
    return {
        props: {
            products,
            foundProducts,
            query,
        }
    }
}
export default SearchPage;
