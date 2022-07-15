import { PropsWithChildren, useContext } from "react";
import { Grid, Typography } from "@mui/material";
import { CartContext } from '../../context/cart/CartContext';
import { currency } from "../../utils";
//import { IOrderItem } from "../../interfaces";

interface Props {
   orderValues?: {
      numberOfItems: number;
      subTotal: number;
      tax: number;
      total: number;
   }
}

export const OrdenSummary : React.FC<PropsWithChildren<Props>>= ({ orderValues  }) => {//orderValues tiene prioridad sobre el context
  const { numberOfItems, subTotal, tax, total} = useContext( CartContext );
  const summaryValue = orderValues ? orderValues: { numberOfItems, subTotal, tax, total }; 
  return (
    <Grid container >
        <Grid item xs={6}>
           <Typography> N° de productos</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent= 'end' >
           <Typography> { summaryValue.numberOfItems }{ summaryValue.numberOfItems>1 ? ' items': ' ítem' }</Typography>
        </Grid>
        <Grid item xs={6}>
           <Typography> SubTotal</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent= 'end' >
           <Typography>{currency.format(summaryValue.subTotal) } </Typography>
        </Grid>
        <Grid item xs={6}>
           <Typography> IVA { Number( process.env.NEXT_PUBLIC_TAX_RATE ) * 100 }% </Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent= 'end' >
           <Typography>{currency.format( summaryValue.tax )} </Typography>
        </Grid>
        <Grid item xs={6}>
           <Typography variant='subtitle1' sx={{ mt: 2 }}> Total: </Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent= 'end' sx={{ mt: 2 }} >
           <Typography variant='subtitle1'>{currency.format(summaryValue.total) } </Typography>
        </Grid>        
    </Grid>
  )
}
