import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, 
     CreditCardOffOutlined, CreditCardOutlined, DashboardCustomizeOutlined, GroupOutlined, 
     ProductionQuantityLimitsOutlined } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";

import { AdminLayout } from "../../components/layouts";
import { SummaryTile } from "../../components/admin";
import { DashboardSummaryResponse } from "../../interfaces";
//import { tesloApi } from '../../api';


const DashboardPage = () => {
  const {  data, error  } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000 // 30 segundos    
  });
  const [ refreshIn, setRefreshIn] = useState(30);
  /*
  //código para leer data s/SWR --------------------------------------------------------------
  const [ data, setData ] = useState<DashboardSummaryResponse>();
  const leeDashBoard= async () => {
     //console.log('lee')
     const { data }=await tesloApi.get('/admin/dashboard');
     const {lowInventory,notPaidOrders,numberOfClients,numberOfOrders,numberOfProducts,paidOrders,productsWithNoInventory} = data!; 
     setData( {lowInventory,notPaidOrders,numberOfClients,numberOfOrders,numberOfProducts,paidOrders,productsWithNoInventory} );
  };  
  
  useEffect(() => {
     if ( refreshIn === 30 ) leeDashBoard();//lee cada 30 seg
  }, [refreshIn]);
  //-------------------------------------------------------------------------------------------
  */
  useEffect(() => {
    const interval = setInterval(()=>{
      console.log('Tick');
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1: 30 );
    }, 1000 );
    return () => clearInterval(interval)//para que no siga andando al salirnos de la página
  }, []);

  if ( error ){
    console.log( error );
    return <Typography>Error al cagar información</Typography>
  }
  if ( !data ){
    return <></>
  }
  const { lowInventory,notPaidOrders,numberOfClients,numberOfOrders,numberOfProducts,paidOrders,productsWithNoInventory} = data;

  return (
   <AdminLayout 
    title='Tablero de control'
    subTitle='Estadísticas generales'
    icon= { <DashboardCustomizeOutlined />}
   >
    <Grid container spacing= {2} >
       <SummaryTile  
          title= { numberOfOrders } 
          subTitle='Órdenes totales'
          icon ={<CreditCardOutlined color='success' sx={{ fontSize: 40 }}/>}
        />
       <SummaryTile  
          title= { paidOrders } 
          subTitle='Órdenes pagadas'
          icon ={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }}/>}
        />
        <SummaryTile  
          title= { notPaidOrders } 
          subTitle='Órdenes pendientes'
          icon ={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }}/>}
        />
        <SummaryTile  
          title= { numberOfClients } 
          subTitle='Clientes'
          icon ={<GroupOutlined color='error' sx={{ fontSize: 40 }}/>}
        />
        <SummaryTile  
          title= { numberOfProducts } 
          subTitle='Productos'
          icon ={<CategoryOutlined color='warning' sx={{ fontSize: 40 }}/>}
        />
        <SummaryTile  
          title= { productsWithNoInventory } 
          subTitle='Producto sin existencia'
          icon ={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }}/>}
        />
        <SummaryTile  
          title= { lowInventory } 
          subTitle='Producto con bajo inventario'
          icon ={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }}/>}
        />
        <SummaryTile  
          title= { refreshIn  } 
          subTitle='Actualización en:'
          icon ={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }}/>}
        />
    </Grid>
   </AdminLayout>
  )
}

export default DashboardPage;