import { createContext } from 'react';
import { IUser } from '../../interfaces';


interface ContextProps {     
    isLoggedIn: boolean;
    user?: IUser;
    loginUser: ( email: string, password: string ) => Promise<boolean>;
    registerUser: (name: string, email: string, password: string) => Promise<{hasError: boolean; message?: string; }>//copiado de la sugerencia de firma en AuthProvider
    logout: () => void;
}


export const AuthContext = createContext({} as ContextProps );