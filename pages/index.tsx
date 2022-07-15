//import { ProductionQuantityLimits } from '@mui/icons-material';
//import { Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import { Typography } from '@mui/material';
import type { NextPage } from 'next';
//import  { useSession } from 'next-auth/react';

import { ShopLayout } from '../components/layouts/ShopLayout';
//import { initialData } from '../database/products';
import { ProductList } from '../components/products';
import { FullScreenLoading } from '../components/ui';
import { useProducts } from '../hooks';

// import useSWR from "swr" //prueba
// const fetcher = (...args: [key: string] ) => fetch(...args).then(res => res.json());

const HomePage: NextPage = () => {
  // const { data, error } = useSWR("/api/products", fetcher);
  // if (error) return <div>failed to load</div>
  // if (!data) return <div>loading...</div>
  // console.log(data);

  const { products, isLoading } =useProducts('/products' );//este hook es alternativa a usar el contexto
  return (
    <ShopLayout title = {'Tienda-Shop - Home'} pageDescription={'Encuentra los mejores productos, están aquí'} >
      <Typography variant= 'h1' component='h1'>Tienda</Typography>
      <Typography variant= 'h2' sx= {{ marginBottom: 1 }}>Todos los productos</Typography>
      {/* inicialmente initialData y any porque no son compatibles con products (falta el _id) */}
      {/* <ProductList products= { initialData.products as any } /> */}
      {/* colocando la data del useSWR, queda como */}
      {/* <ProductList products= { data } /> */}
      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products= { products } />
      }
      {/* <Grid container spacing={ 4 }>
          {
            initialData.products.map( product => (
                <Grid item xs={6} sm= {4} key={ product.slug }>
                  <Card>
                    <CardActionArea>
                       <CardMedia
                         component='img'
                         image= { `products/${ product.images[0]}`}
                         alt={ product.title }                         
                       />
                    </CardActionArea>
                  </Card>

                </Grid>
            ))
          }
      </Grid> */}
    </ShopLayout>
  )
}

export default HomePage;
