import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { IOrder } from '../../../interfaces';
import { db } from '../../../database';
import { Product, Order } from '../../../models';

type Data = 
|{ message: string }
| IOrder ;

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
   switch ( req.method) {
      case 'POST':
        return createOrder ( req, res );
      default:
        return res.status(400).json({ message: 'Bad request' })
   }  
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { orderItems, total } = req.body as IOrder;
    //verificar que el usuario esté autenticado
    const session: any = await getSession({ req }); //en la req están las cookies
    //console.log('session:',session.user);
    if ( !session ) {
      return res.status(401).json({ message: 'Debe estar autenticado para hacer esto' })
    }
    //verificación de los precios de los productos
    const productsIds = orderItems.map( producto => producto._id );
    await db.connect();
    const dbProducts = await Product.find( { _id: { $in: productsIds} }).lean();
    try {
       const subTotal= orderItems.reduce( ( preview, current ) => {
         const currentPrice = dbProducts.find( prod => prod._id.toString() === current._id)?.price;
         if ( !currentPrice ){
           throw new Error( 'Verifique el carrito de nuevo, producto no encontrado' );
         }
         return current.quantity * currentPrice + preview },0);
         const taxRate = Number( process.env.NEXT_PUBLIC_TAX_RATE || 0); 
         const backEndTotal= subTotal * ( 1 + taxRate );
         if ( total !== backEndTotal){
            throw new Error ( 'El total no cuadra con el monto' );
         }
         const userId = session.user._id;
         //console.log('userId:',userId);
         const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
         newOrder.total= Math.round(newOrder.total);//sin decimales. para 2 decimales es  newOrder *100 y luego /100
         await newOrder.save();
         await db.disconnect();
         return res.status(201).json( newOrder );    

    } catch ( error: any ) {
      await db.disconnect();
      console.log( error );
      res.status(400).json({ message: error.message || 'Revise logs del servidor' })
    }
}
