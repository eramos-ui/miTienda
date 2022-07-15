import { useContext, useState } from 'react';
import { useRouter } from "next/router";
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, DashboardOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, Router, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material";
import { AuthContext, UIContext } from "../../context";


export const SideMenu = () => {
  const router = useRouter();
  const { isMenuOpen, toggleSideMenu }= useContext( UIContext);
  const { isLoggedIn, user, logout  } = useContext( AuthContext );
  //const { role }  = user;
  //console.log(isLoggedIn, user)
  
  const [ searchTerm, setSearchTerm ] = useState('');
  const onSearchTerm = () => {
    if( searchTerm.trim().length === 0 ) return;
    navigateTo(`/search/${ searchTerm }`)
  }
  const navigateTo = ( url: string ) => {
    toggleSideMenu();//esto ocultará el menú al tocar el mismo menú
    router.push( url );
  };
//   const onLogout = () => {
//      //logout();
//   }

  return (
    <Drawer
        open={ isMenuOpen }
        anchor='right'
        sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        onClose= { toggleSideMenu }//para que cierre el Menú al hacer clic fuera del SideManu
    >
        <Box sx={{ width: 250, paddingTop: 5 }}>            
            <List>
                <ListItem>
                    <Input
                        autoFocus
                        value={ searchTerm }
                        onChange ={( e ) => setSearchTerm( e.target.value ) }
                        onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                        type='text'
                        placeholder="Buscar..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                onClick={ onSearchTerm }
                                  //aria-label="toggle password visibility"
                                >
                                 <SearchOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </ListItem>
                {
                    isLoggedIn &&( 
                    <>
                        <ListItem button >
                            <ListItemIcon>
                                <AccountCircleOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Perfil'} />
                        </ListItem>

                        <ListItem button onClick={ () => navigateTo('/orders/history')}>
                            <ListItemIcon>
                                <ConfirmationNumberOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Mis Ordenes'} />
                        </ListItem>
                    </>
                    )
                }        
                <ListItem button 
                    sx={{ display: { xs: '', sm: 'none' } }}
                    onClick= {() => navigateTo ('/category/men')}
                >
                    <ListItemIcon>
                        <MaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Hombres'} />
                </ListItem>
                <ListItem button 
                   sx={{ display: { xs: '', sm: 'none' } }}
                   onClick= {() => navigateTo ('/category/women')}
                >
                    <ListItemIcon>
                        <FemaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mujeres'} />
                </ListItem>

                <ListItem button 
                    sx={{ display: { xs: '', sm: 'none' } }}
                    onClick= {() => navigateTo ('/category/kid')}
                >
                    <ListItemIcon>
                        <EscalatorWarningOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Niños'} />
                </ListItem>
                {
                    isLoggedIn 
                    ?(
                        <ListItem button
                            onClick={ logout }// ó onClick= {logout}
                        >
                            <ListItemIcon>
                                <LoginOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Salir'} />
                        </ListItem>
                    ): (
                        <ListItem 
                            button
                            onClick= {() => navigateTo (`/auth/login?p=${ router.asPath }`)} //al ingresar lo llevará a la página que estaba
                        >
                            <ListItemIcon>
                                <VpnKeyOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Ingresar'} />
                        </ListItem>
                    )
                }
                {/* Admin */}
                {
                    user?.role === 'admin' && (
                        <>
                            <Divider />                            
                            <ListSubheader>Panel del administrador</ListSubheader>
                            <ListItem  button 
                                onClick={ () => navigateTo( '/admin/')}
                            >
                                <ListItemIcon>
                                    <DashboardOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Tablero de control'} />
                            </ListItem>
                            <ListItem  
                                button 
                                onClick= { () => navigateTo('/admin/products')}
                            >
                                <ListItemIcon>
                                    <CategoryOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Productos'} />
                            </ListItem>                            
                            <ListItem 
                                button
                                onClick= { () => navigateTo('/admin/orders')}
                            >
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Órdenes'} />
                            </ListItem>
                            <ListItem 
                               button
                               onClick={ () => navigateTo('/admin/users')}
                            >
                                <ListItemIcon>
                                    <AdminPanelSettings/>
                                </ListItemIcon>
                                <ListItemText primary={'Usuarios'} />
                            </ListItem>                        
                        </>
                    )
                }
            </List>
        </Box>
    </Drawer>
  )
}