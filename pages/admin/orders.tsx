
import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { Chip, Grid } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';

import { AdminLayout } from '../../components/layouts'
import { IOrder, IUser } from '../../interfaces';


const columns:GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 220 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'custom', headerName: 'Cliente', width: 200 },
    { field: 'shippingTo', headerName: 'Despachado a', width: 400 },
    { field: 'total', headerName: 'Monto total', width: 200 },
    {
        field: 'isPaid',
        headerName: 'Pagada',
        renderCell: ({ row }: GridValueGetterParams) => {
            return row.isPaid
                ? ( <Chip variant='outlined' label="Pagada" color="success" /> )
                : ( <Chip variant='outlined' label="Pendiente" color="error" /> )
        }
    },
    { field: 'noProducts', headerName: 'No.Productos', align: 'center', width: 150 },
    {
        field: 'check',
        headerName: 'Ver orden',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <a href={ `/admin/orders/${ row.id }` } target="_blank" rel="noreferrer" >
                    Ver orden
                </a>
            )
        }
    },
    { field: 'createdAt', headerName: 'Creada en', width: 300 },

];




const OrdersPage = () => {
   const { data, error } = useSWR<IOrder[]>('/api/admin/orders');
 
   if ( !data && !error ) return (<></>);
   //console.log('orders',data)
   const rows = data!.map( order => ({
        id    : order._id,
        total : order.total,
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,
        createdAt: order.createdAt,
        email : (order.user as IUser).email ,
        custom  :   (order.user as IUser).name ,
        shippingTo: order.shippingAddress.firstName +' '+ order.shippingAddress.lastName + ', '
           + order.shippingAddress.address +(order.shippingAddress.address2 ? order.shippingAddress.address2: '')
                   +', ' + order.shippingAddress.city +', ' + order.shippingAddress.country  ,
    }));
  //console.log('rows',rows)

  return (
    <AdminLayout 
        title={'Órdenes'} 
        subTitle={'Mantenimiento de órdenes'}
        icon={ <ConfirmationNumberOutlined /> }
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

export default OrdersPage