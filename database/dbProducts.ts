import { db } from "."
import { IProduct } from "../interfaces";
import { Product } from "../models";



export const getProductBySlug = async( slug: string ): Promise<IProduct | null> => {//para server side prop que no se usó
    await db.connect();
    const product = await Product.findOne({ slug }).lean();//el lean le quita los métodos
    await db.disconnect();
    if ( !product ){
        return null;
    }
    //TODO faltan las imágenes
    product.images  = product?.images.map( image => {//hay que provver toda la url
        return image.includes('http') ? image : `${ process.env.HOST_NAME}products/${ image}`; //depende si es o no cloudinary
    })
    return JSON.parse(JSON.stringify( product ) );
};
interface ProductSlug {
    slug: string;
};
 export const getAllProductSlugs = async (): Promise<ProductSlug[]> => {//para traer todos los slug
    await db.connect();
    const slugs = await Product.find().select('slug -_id').lean();//el lean le quita los métodos
    await db.disconnect();
    return slugs;
 };
 export const getProductsByTerm = async ( term: string ): Promise<IProduct[]> =>{//tomado de api/[q].ts
    term = term.toString().toLowerCase();
    await db.connect();
    const products = await  Product.find ({
         $text: { $search: term }
    }).select('title images price inStock slug -_id').lean();
 

    await db.disconnect();
    const updatedProduct = products.map( product =>{
        product.images  = product?.images.map( image => {//hay que provver toda la url
            return image.includes('http') ? image : `${ process.env.HOST_NAME}products/${ image}`; //depende si es o no cloudinary
        });
        return product;
    })
    return updatedProduct;    
 }
 export const getAllProducts = async (): Promise<IProduct[]>  =>{
    await db.connect();
    const products = await Product.find()
            //.select('title images price inStock slug -_id')// sin el select hay que serializar el objeto
            .lean();

    await db.disconnect();
    //return products;
    const updatedProduct = products.map( product =>{
        product.images  = product.images.map( image => {//hay que provver toda la url
            return image.includes('http') ? image : `${ process.env.HOST_NAME}products/${ image}`; //depende si es o no cloudinary
        });
        return product;
    })
    return JSON.parse(JSON.stringify( updatedProduct ) );

 }