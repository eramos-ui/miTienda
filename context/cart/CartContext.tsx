import { createContext } from 'react';
import { ICartProduct, ShippingAddress } from '../../interfaces';



interface ContextProps {
    isLoaded: boolean;
    cart: ICartProduct[]; 
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress

    // billingingaddress: { // NO implementado
    //     firstName: string;
    //     lastName : string;
    //     address  : string;
    //     address2?: string;
    //     zip      : string;
    //     city     : string;
    //     country  : string;
    //     phone    : string;
    // },

    //methods
    addProductToCart: ( product: ICartProduct ) => void;
    updateCartQuantity: ( product: ICartProduct ) => void;
    removeCartProducto: ( product: ICartProduct ) => void;
    updateAddress:  ( address: ShippingAddress ) => void;
    createOrder: () => Promise<{ hasError: boolean; message: string; }>
    
}


export const CartContext = createContext({} as ContextProps );