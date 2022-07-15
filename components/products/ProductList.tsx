//este componenete seá para Hombres, Mujeres y Niños
import { Grid } from "@mui/material";
import { PropsWithChildren  } from "react";
import { IProduct } from "../../interfaces";
import { ProductCard } from '.';

interface Props {
   products: IProduct[];
   
}

export const ProductList: React.FC<PropsWithChildren<Props>> = ( { products} ) => {
  return (
    <Grid container spacing= {4} >
         {
            products.map( product => (
                <ProductCard
                   //key= { product._id}//así debería ser
                   key= { product.slug}
                   product= { product }
                />
            ))
         }
    </Grid>
  )
}
