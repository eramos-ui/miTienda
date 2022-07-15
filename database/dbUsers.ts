import bcrypt from 'bcryptjs';

import { connect } from './db';
import { db } from './';
import { User } from '../models';
//para que en BE manipule usuarios

export const checkUserEmailPassword = async ( email: string, password: string ) =>{

    await db.connect();
    const user = await User.findOne({ email }); //lean() para tener menos data
    await db.disconnect();
    if ( !user ){
        return null;
    }
    if ( !bcrypt.compareSync( password, user.password! )){
        return null;
    }
    const { role, name, _id} = user;
    return {
        _id,
        email: email.toLocaleLowerCase(),
        role,
        name,
    }
}
//Esta función crea o verifica un usuario typo oauth
export const oAuthToDbUser= async ( oAuthEmail: string, oAuthName: string ) =>{
    
    const user = await User.findOne({ email: oAuthEmail }); //lean() para tener menos data
    if ( user ) {
        await db.disconnect();
        const { _id, name, email, role } = user;// los de la BD
        return { _id, name, email, role };
    }
    const newUser=  new User({
        email:oAuthEmail,
        name: oAuthName,
        password: '@',
        role: 'client'
    })
    await newUser.save();
    await db.disconnect();
    const { _id, name, email, role } = newUser;
    return { _id, name, email, role };
}