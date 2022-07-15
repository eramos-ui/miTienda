import { isValidObjectId } from "mongoose";
import { IOrder, IOrderItem } from "../interfaces";
import { db } from '.';
import { Order } from "../models";


export const getOrderById = async ( id: string ): Promise<IOrder | null> => {
      //console.log('id in getOrderById',id,  isValidObjectId( id )) 
      if ( !isValidObjectId( id )){//si no es un id de mngo no hacemos nada
          return null;
      }
      await db.connect();
      const order= await Order.findById( id ).lean();
      await db.disconnect();
      if ( !order ) {
        return null;
      }
      return JSON.parse(JSON.stringify( order )); 
}
export const getOrdersByUser = async (userId: string): Promise<IOrderItem[]> =>{
  if ( !isValidObjectId( userId )){//si no es un id de mngo no hacemos nada
    return [];
  }
  await db.connect();
  const orders = await Order.find( { user: userId }).lean();
  await db.disconnect();

  return JSON.parse(JSON.stringify( orders ));
}