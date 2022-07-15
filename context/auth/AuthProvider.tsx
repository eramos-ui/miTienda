//lo que va aquí es la información que fkuira en toda la app envuelta en este context provider
import  { PropsWithChildren, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';

import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}
const AUTH_INITIAL_STATE: AuthState ={//el estado inicial
    isLoggedIn: false,
    user: undefined
}


export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  //aquí va cómo se comportará
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)// el estado debe ser del tipo del reducer
  const { data, status } = useSession(); 
  //console.log(data, status )  
  const router=useRouter();
  // useEffect(() => {//para que el Fe verifique el token, cuando está nuesta autenticación
  //     checkToken();
  // }, [])
  useEffect(() => {// con next_auth/react 
     if ( status === 'authenticated' ){
        //console.log({user: data?.user})
        dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
     }
  }, [ status, data])
  
  const checkToken = async() => {
    if ( !Cookies.get( 'token' )) {//si no hay token
      return;  
    }
    try {
      const { data } = await tesloApi.get( 'user/validate-token');
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user}) ;
   } catch( error ){
      Cookies.remove('token');
      return false;
   }
  };
  
  const loginUser= async( email: string, password: string ): Promise<boolean> => {
      try {
         const { data } = await tesloApi.post( 'user/login',{ email, password });
         const { token, user } = data;
         Cookies.set('token', token);
         dispatch({ type: '[Auth] - Login', payload: user}) ;
         return true;
      } catch( error ){
         return false;
      }
  };
  const logout = () => {
    //Cookies.remove('token');
    Cookies.remove('cart');
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('address');
    Cookies.remove('address2' );
    Cookies.remove('zip');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('phone');
    signOut();
   // router.reload(); //no se requiere los dispatchs (ni cart ni Auth)
  };
  //el objeto de retorno puede ser una interfa< o definirla en línea (como se hace)
  const registerUser= async ( name: string, email: string, password: string ): Promise<{hasError: boolean; message?: string}> =>{
    try {
      const { data } = await tesloApi.post( 'user/register',{ name, email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user}) ;
      return {
        hasError: false
      }
    }catch( err ){
       if ( axios.isAxiosError( err )){
          const error = err as AxiosError;
         return {
           hasError: true,
           message: error.message
         }
       }
       return {
         hasError: true,
         message: 'Nos se pudo crear el usuario - intente de nuevo'
       }
    }
  }
  return (
   <AuthContext.Provider value= {{
      ...state,
      loginUser,
      registerUser,
      logout,
   }}>
      { children }
    </AuthContext.Provider>
 )
}