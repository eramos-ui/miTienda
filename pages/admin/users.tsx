
import { useEffect, useState } from 'react';
import {  PeopleOutline } from '@mui/icons-material';
import { Grid, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';

import { tesloApi } from '../../api';
import { AdminLayout } from '../../components/layouts';
import { IUser } from '../../interfaces';


const UsersPage = () => {
  const { data, error }= useSWR<IUser[]>('/api/admin/users');
  const [ users, setUsers ] = useState<IUser[]>([]);
  useEffect(() => {    
     if( data ){
        setUsers( data )
     }
  
  }, [ data ])
  
  if ( !data && !error ) return <></>
  const onRoleUpdated= async ( userId: string, newRole: string ) => {
       const previousUsers= users.map( user =>  ({ ...user})); //truco para copiar un array rompeindo la referencia
       const updatedUsers = users.map( user => ({//esta es la actualización en js
          ...user,
          role: userId === user._id ? newRole : user.role
       }))
       setUsers( updatedUsers );
       try {
          await tesloApi.put('/admin/users', { userId, role: newRole })
       } catch (error){
        setUsers( previousUsers ); //copiamos el que estaba antes del camio dado el error en el BE
          console.log(error) ;
          alert( 'No se pudo actualizar el rol del usuario a '+newRole) 
       }
  }
  const columns: GridColDef[]= [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre', width: 300 },
    { 
      field: 'role', 
      headerName: 'Rol', 
      width: 230 ,
      renderCell: ( { row }: GridValueGetterParams ) => {
         return ( 
          <Select 
            value={ row.role }
            label= 'Rol'
            onChange={ ({ target } ) => onRoleUpdated(row.id, target.value ) }
            sx={{ width : '300px' }}
          >
            <MenuItem value='client'>Cliente</MenuItem>
            <MenuItem value='super-user'>Super usuario</MenuItem>
            <MenuItem value='admin'>Administrador</MenuItem>
            <MenuItem value='SEO'>SEO</MenuItem>

          </Select>
         )
      }
    },
  ]
  const rows = users.map( user =>({
      id : user._id,
      email: user.email,
      name: user.name,
      role: user.role,
  }))
 
  return (
    <AdminLayout
    title={'Usuarios'}
    subTitle={'Mantenimiento de usuarios'}
    icon={<PeopleOutline />}
    >
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:650, width: '100%' }}>
                <DataGrid 
                    rows={ rows }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                />
            </Grid>
        </Grid>

    </AdminLayout>
  )
  }
export default UsersPage