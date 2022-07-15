//para poblar bd con datos de prueba
import type { NextApiRequest, NextApiResponse } from 'next';// en postam http://localhost:3000/api/seed
import { db, seedDatabase } from '../../database';//anduvo, ver https://www.youtube.com/watch?v=DT0-2e-i9cw
import { Product, User } from '../../models';


type Data = {
    message: string
//creado con snippet nextapi agregado a mano el handler (retorno)
};

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    if ( process.env.NODE_ENV === 'production') {
        return res.status( 401 ).json({message:'No tiene acceso a este servicio'});
    }
   // http://localhost:3000/api/seed insertará los usuarios y los productos en la BD
    await db.connect();
    await User.deleteMany();
    await User.insertMany( seedDatabase.initialData.users);
    await Product.deleteMany(); //borra todo
    await Product.insertMany( seedDatabase.initialData.products );//inserta data inicial
    await db.disconnect();
    res.status(200).json({ message: 'Proceso realizado OK' })
}