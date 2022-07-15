import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';//NetLink para no confundirlo con le de mui
import { AppBar, Badge, Box, Button, IconButton, Input, Link, Toolbar, Typography, InputAdornment } from '@mui/material';
import { ClearOutlined, SearchOutlined,  ShoppingCartOutlined } from '@mui/icons-material';
import { CartContext, UIContext } from '../../context';

export const Navbar = () => {
  const [ genderSelected, setGenderSelected ] = useState(0); //también se podría usar el useRoute
  const { toggleSideMenu } = useContext(UIContext);
  const { numberOfItems } = useContext( CartContext );
  const router = useRouter();
  const [ searchTerm, setSearchTerm ] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState( false ); //para discrimar si mostar o no al caja de búsqueda
  const onSearchTerm = () => {
    if( searchTerm.trim().length === 0 ) return;
    router.push( `/search/${ searchTerm }` );
  };
  return (
     <AppBar>
        <Toolbar>
            <NextLink href='/' passHref >
                <Link display = 'flex' alignItems = 'center' >
                    <Typography variant='h6' >Tienda</Typography>
                    
                    <Typography  sx={{ ml: 0.5 }} >Shop</Typography>{/* ml es marginLeft */}
                </Link>
            </NextLink>
            {/* para que ocupe todo el espacio */}
            <Box flex={ 1} />
            {/* condicionalmente abrirá el siguiente box */}
            <Box className='fadeIn' sx= {{ display: isSearchVisible ? 'none': { xs: 'none', sm: 'block'}}}>
                <NextLink href= '/category/men' passHref >
                    <Button color = {genderSelected === 1 ? 'primary':'info' } 
                        onClick={ () => setGenderSelected(1) }
                    >Hombres</Button>
                </NextLink>
                <NextLink href= '/category/women' passHref >
                    <Button color = {genderSelected === 2 ? 'primary':'info' } 
                     onClick={ () => setGenderSelected(2) }
                    >Mujeres</Button>
                </NextLink>
                <NextLink href= '/category/kid' passHref >
                    <Button color = {genderSelected === 3 ? 'primary':'info' } 
                    onClick={ () => setGenderSelected(3) }
                    >Niños</Button>
                </NextLink>
            </Box>
            <Box flex={ 1} />
            {/* son 2 controles para tomar diferentes acciones: 1) para desktop y 2) pantallas pequeñas */}
            {
             isSearchVisible 
             ? (
                 <Input
                    sx= {{ display:  { xs: 'none', sm: 'flex'}}}
                     className='fadeIn'
                     autoFocus
                     value={ searchTerm }
                     onChange ={( e ) => setSearchTerm( e.target.value ) }
                     onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                     type='text'
                     placeholder="Buscar..."
                     endAdornment={
                         <InputAdornment position="end">
                             <IconButton
                             onClick={() => setIsSearchVisible( false ) }
                             >
                                 <ClearOutlined />
                             </IconButton>
                         </InputAdornment>
                     }
                 />

             )
             :( 
                <IconButton
                    //sx= {{ display: { xs: 'flex', sm: 'none' }}}//sólo se muestra en pantallas pequeñas idem a los menúes de género
                    className='fadeIn'
                    onClick= { () => setIsSearchVisible( true)  }
                    sx= {{ display: { xs: 'none', sm: 'flex' }}}
                >
                    <SearchOutlined />
                </IconButton>
            )
            }
            <IconButton
                sx= {{ display: { xs: 'flex', sm: 'none' }}}//sólo se muestra en pantallas pequeñas idem a los menúes de género
                onClick= { toggleSideMenu }
            >
                <SearchOutlined />
            </IconButton>
            <NextLink href ='/cart' passHref >
                <Link>
                    <IconButton>
                        <Badge badgeContent={ numberOfItems > 9 ?'+9': numberOfItems } color= 'secondary'>
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </Link>
            </NextLink>
            <Button onClick={toggleSideMenu}>
                Menú
            </Button>
        </Toolbar>
     </AppBar>
  )
}
