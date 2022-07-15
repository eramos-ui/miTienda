import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from '../../hooks/useProducts';

//se pueden crear tres páginas según genero category/men o women o kid)
const GenderPage = () => {
  const  route =useRouter(); 
  const { gender }= route.query;
  const { products, isLoading } =useProducts(`/products?gender=${gender}` );
  return (
    <ShopLayout title= { `${gender}` }  pageDescription={ `Productos para ${gender}` }>
      <Typography variant= 'h1' component='h1'> 
        {
            gender === 'kid' ? 'Niños': (gender === 'men') ? 'Hombres': 'Mujeres'
        }      
      </Typography>
      <Typography variant= 'h2' sx= {{ marginBottom: 1 }}> 
        {
            gender === 'kid' ? 'Productos para niños': (gender === 'men') ? 'Productos para hombres': 'Productos para mujeres'
        }
      </Typography>
      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products= { products } />
      }
    </ShopLayout>
  )
}

export default GenderPage;