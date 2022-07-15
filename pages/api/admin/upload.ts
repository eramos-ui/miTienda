
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
//import fs from 'fs';//propio de node
import { v2 as cloudinary} from 'cloudinary';

cloudinary.config( process.env.CLOUDINARY_URL ||'');
type Data = {
    message: string
}

export const config = {// para decirle a Next que no serialice lo que viene en el body ya que son imágenes, utilizamos formidable para manejo de estas
    api: {
        bodyParser: false,
    }
}
export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch ( req.method ) {
        case 'POST':
            return uploadFile(req , res );
        default:
            return res.status(400).json({ message: 'Bad request' })
    }
    res.status(200).json({ message: 'Example' })
}
const saveFile= async ( file: formidable.File ): Promise<string> =>{
    // const data = fs.readFileSync( file.filepath );//esta es la carpeta temporal dónde se encuentra el archivo
    // fs.writeFileSync(`./public/${ file.originalFilename}`, data);//lo copia en public con mismo nombre
    // fs.unlinkSync( file.filepath );//elimina del archivo temporal
    // return;
    //const data = await cloudinary.uploader.upload( file.filepath );//con cloudinary
    const {  secure_url } = await cloudinary.uploader.upload( file.filepath );
    return secure_url; 
}
const parseFiles = async (req: NextApiRequest ): Promise<string> =>{//hará el parse de todos los archivos que vienen
     return new Promise( ( resolve, reject ) => {
        const form = new formidable.IncomingForm();//para analizar lo que viene en el request
        form.parse ( req, async ( err, fields, files ) =>{
            //console.log(err, fields, files);
            if ( err ){
                return reject( err );
            }
            // await saveFile( files.file as formidable.File) 
            const filePath= await saveFile( files.file as formidable.File) 
            //resolve( true );
            resolve( filePath );
        })
     }) 
}
const  uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const  imageUrl = await  parseFiles( req);
    return res.status(200).json({ message: imageUrl });//la url se envía en el message
}
