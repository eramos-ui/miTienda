import type { NextApiRequest, NextApiResponse } from 'next';
import { isValidObjectId } from 'mongoose';

import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

import { v2 as cloudinary} from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL ||'');

type Data = 
|{ message: string}
| IProduct[]
| IProduct;
export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    //res.status(200).json({ name: 'Example' })
    switch ( req.method ){
        case 'GET':
            return getProducts( req, res );
        case 'PUT':
            return updateProduct( req, res );
        case 'POST':
            return createProduct( req, res );
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const  getProducts= async (req: NextApiRequest, res: NextApiResponse<Data>)  => {
    await db.connect();
    const products= await Product.find()
    .sort( { title: 'asc'})
    .lean();
    await db.disconnect();

    //TODO las imágenes
    const updatedProduct = products.map( product =>{
        product.images  = product.images.map( image => {//hay que provver toda la url
            return image.includes('http') ? image : `${ process.env.HOST_NAME}products/${ image}`; //depende si es o no cloudinary
        });
        return product;
    })
    res.status(200).json( updatedProduct );
}
const  updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    //validaciones
    const  {_id='', images = [] }= req.body as IProduct;
    if ( !isValidObjectId ( _id )){
        return res.status(400).json({ message:'El id del producto no es válido'});  
    }
    if ( images.length < 2 ){
        return res.status(400).json({ message:'Es necesario al menos 2 imágenes del producto'});  
    }
    //tema de las imágnenes y dónde se graban, deben tener patch completo

    try {
        await db.connect();
        const product = await Product.findById( _id );
        if ( !product ){
            await db.disconnect();
            return res.status(400).json({ message:'No existe un producto con ese id'});  
        }
        //eliminar imagenes
        product.images.forEach( async(image) =>{
            if ( !image.includes(image) ){
                const  [ fileId, extension ] = image.substring( image.lastIndexOf('/') +1 ).split('.'); //tomo la url que tiene cloudinary
                console.log( fileId, extension )
                await cloudinary.uploader.destroy( fileId );
            }
        })
        await product.update( req.body);
        await db.disconnect();
        return res.status(200).json( product );
    } catch (error ){
        await db.disconnect();
        console.log(error);
        return res.status(400).json({ message:'Revisar la consola del servidor'});  
    }
}

const  createProduct= async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const  { images = [] }= req.body as IProduct;
    if ( images.length < 2 ){
        return res.status(400).json({ message:'Es necesario al menos 2 imágenes del producto'});  
    }
    //falta el tema de las imágenes
     
    try {
        await db.connect();
        const productInDB = await Product.findOne({ slug: req.body.slug } );//validar slug único
        if ( productInDB ){
            await db.disconnect();
            return res.status(400).json({ message:'Ese slug ya existe para un producto, debe ser único'});  
        }
        const product = new Product( req.body );
        await product.save();
        await db.disconnect();
        return res.status(201).json( product );
    } catch (error ){
        await db.disconnect();
        console.log(error);
        return res.status(400).json({ message:'Revisar la consola del servidor'});  
    }
}

