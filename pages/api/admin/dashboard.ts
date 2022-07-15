import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = 
    | { message: string }
    | {
        numberOfOrders: number,
        paidOrders: number,
        notPaidOrders: number,
        numberOfClients: number,
        numberOfProducts: number,
        productsWithNoInventory: number,
        lowInventory: number
    };

    

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
        switch ( req.method) {
           case 'GET':
             return dashboard ( req, res );
           default:
             return res.status(400).json({ message: 'Bad request' })
        }  
     }
   
const dashboard = async  ( req: NextApiRequest, res: NextApiResponse<Data>)  =>{
    await db.connect();
    // const numberOfOrders = await Order.count();
    // const paidOrders = await Order.find({ isPaid: true }).count();
    // const numberOfClients = await User.find({ role: 'client' }).count();
    // const numberOfProducts = await Product.count();
    // const productsWithNoInventory = await Product.find({ inStock: 0 }).count();
    // const lowInventory = await Product.find({ inStock: { $lte: 10 } }).count();

    //en paralelo
    
    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    ] = await Promise.all([
        Order.count(),
        Order.find({ isPaid: true }).count(),
        User.find({ role: 'client' }).count(),
        Product.count(),
        Product.find({ inStock: 0 }).count(),
        Product.find({ inStock: { $lte: 10 } }).count(),
    ]);
    await db.disconnect();
    //console.log('await:',numberOfOrders, paidOrders, numberOfClients, numberOfProducts, productsWithNoInventory, lowInventory) 
    return res.status(200).json(
        {
            numberOfOrders,
            paidOrders,            
            numberOfClients,
            numberOfProducts,
            productsWithNoInventory,
            lowInventory,
            notPaidOrders: numberOfOrders - paidOrders
    
        }
    );
   

}
    
