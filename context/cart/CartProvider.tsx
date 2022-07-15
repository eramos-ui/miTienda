//lo que va aquí es la información que fkuira en toda la app envuelta en este context provider
import { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import Cookie from 'js-cookie';// esto es par FE, instalar además @types/js-cookie
import axios from 'axios';

import { ICartProduct, ShippingAddress, IOrder } from '../../interfaces';
import { CartContext, cartReducer } from './';//está en el mismo directorio
import { tesloApi } from '../../api';

export interface CartState {
    isLoaded: boolean; //si tiene productos
    cart: ICartProduct[],
    numberOfItems: number;
    subTotal: number;
    tax: number;
    //taxRate: number,
    total: number;
    shippingAddress?: ShippingAddress;
}
// export interface ShippingAddress{//también podría ir a las interface
  
//     firstName: string;
//     lastName : string;
//     address  : string;
//     address2?: string;
//     zip      : string;
//     city     : string;
//     country  : string;
//     phone    : string;
// }
const CART_INITIAL_STATE: CartState ={//el estado inicial
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
   // taxRate:0,
    total: 0,

    shippingAddress: undefined
}

export const CartProvider: React.FC<PropsWithChildren> = ({ children }) => {
  //aquí va cómo se comportará
  const [state, dispatch] = useReducer( cartReducer, CART_INITIAL_STATE)// el estado debe ser del tipo del reducer
  const [loading, setLoading] = useState(true);

  useEffect(() => {//este es para leer las cookies x ej. cuando se refresca o renicia la página
    try{//por si la cookie no es consistente
      const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ): [];
      //console.log('cookieProducts try',cookieProducts)
      dispatch({ type: '[CART] - LoadCart from cookies | storage', payload: cookieProducts });
    }catch(error){
      //console.log('error',error);
      dispatch({ type: '[CART] - LoadCart from cookies | storage', payload: [] });
    }
    setLoading( false );
  }, [])
  
  useEffect(() => {
    if ( Cookie.get('firstName')){      
      const shippingAddress = {
        firstName : Cookie.get('firstName') || '',
        lastName  : Cookie.get('lastName') || '',
        address   : Cookie.get('address') || '',
        address2  : Cookie.get('address2') || '',
        zip       : Cookie.get('zip') || '',
        city      : Cookie.get('city') || '',
        country   : Cookie.get('country') || '',
        phone     : Cookie.get('phone') || '',
      }
      //console.log('CartProvider -shippingAddress',shippingAddress)
      dispatch({ type:'[CART] - LoadAddress from Cookies', payload: shippingAddress })
    }
    
  }, []);

  useEffect(() => {
    //console.log('useEffect-set cookies:',state.cart, loading)
    if ( !loading ) Cookie.set('cart', JSON.stringify( state.cart ));//las cookies van al server en cada llamada a API Rest
  }, [state.cart, loading]); //para ir a grabar vía cookies el cart; sin interrumpir el addProductToCart que tiene 3 o 4 return
  
  
  useEffect(() => {//cada efecto se hace cargo de una sóla tarea
    if ( !loading ){
      const  numberOfItems = state.cart.reduce( ( preview, current ) => current.quantity + preview , 0 );//esto hace el bucle de contarlos
      const subTotal = state.cart.reduce( ( preview, current ) => current.quantity * current.price + preview , 0 );
      const taxRate = Number( process.env.NEXT_PUBLIC_TAX_RATE || 0); 
      const orderSummary={
        numberOfItems,
        subTotal,
        tax: subTotal * taxRate,
        taxRate,
        total: subTotal * ( 1 + taxRate )
      }
        dispatch( { type: '[CART] - Update order summary', payload: orderSummary });
        //console.log(orderSummary)
    }
  }, [state.cart, loading]); //para ir a grabar vía cookies el cart; sin interrumpir el addProductToCart que tiene 3 o 4 return
  
  const addProductToCart = ( product: ICartProduct ) =>{ //opera al momento de consumir addProductToCart en [slug].tsx
    const productInCart= state.cart.some( p => p._id === product._id ) //devuelve un boolean
    if ( !productInCart ) return  dispatch( { type: '[CART] - Update products in cart' , payload: [...state.cart, product ] } );//si no existe el mimso _id

    const productInCartButDifferentSize = state.cart.some( p => p._id === product._id && p.size === product.size );//mismo id y mismo size
    if ( !productInCartButDifferentSize ) {
      return dispatch( { type: '[CART] - Update products in cart' , payload: [...state.cart, product ] } );///no está ese size
    } else { //hay que acumular si está el mismo -id y size
      const updateProducts = state.cart.map( p => {
        if ( p._id !== product._id   ) return p;//es de distinto _id
        if ( p._id === product._id && p.size !== product.size ) return p;//igual _id, pero es de distinta talla

        p.quantity += product.quantity;// se suma al que existe
        return p;
      });
      dispatch( { type: '[CART] - Update products in cart' , payload:  updateProducts  } );
    }
  }; 

  const updateCartQuantity = ( product: ICartProduct) =>{
    dispatch({ type: '[CART] - Change cart quantity',payload: product });
  };
  const  removeCartProducto = ( product: ICartProduct) =>{    
    dispatch({ type: '[CART] - Remove producto in cart', payload: product });
  };
  const updateAddress = ( address: ShippingAddress ) => {
    Cookie.set('firstName',address.firstName);
    Cookie.set('lastName',address.lastName);
    Cookie.set('address',address.address);
    Cookie.set('address2',address.address2 || '');
    Cookie.set('zip',address.zip);
    Cookie.set('city',address.city);
    Cookie.set('country',address.country);
    Cookie.set('phone',address.phone);

    dispatch({ type: '[CART] - Update Address', payload: address });
}

const createOrder = async ():Promise<{ hasError: boolean; message: string; }> => {//todo lo necesario está en el context
  if ( !state.shippingAddress ) {
     throw new Error('No hay dirección de entrega');
  }
  const body: IOrder ={    
    orderItems:  state.cart.map( product => ({//falla: orderItems: state.cart,
      ...product,
      size: product.size!//esto porque el size en ISize podría no estar     
     })),
    shippingAddress: state.shippingAddress,
    numberOfItems: state.numberOfItems,
    subTotal: state.subTotal,
    tax: state.tax,
    total: state.total,
    isPaid: false,
  }
  try {
     const { data } = await tesloApi.post('/orders', body );
     dispatch({ type:'[CART] - Order complete' }) ;//limpia el carrito
     return {
      hasError: false,
      message: data._id!
     }
  } catch (error) {
    if ( axios.isAxiosError( error ) ){
      return {
        hasError: true,
        message: 'error axios',//error.response?.data.message
      }
    }
    return {
      hasError: true,
      message: 'Error no controlado, hable con el administrador'
    }
  }
}
  return (
   <CartContext.Provider value= {{
      ...state,
      //methods
      addProductToCart,
      updateCartQuantity,
      removeCartProducto,
      updateAddress,
      createOrder,
   }}>
      { children }
    </CartContext.Provider>
 )
}