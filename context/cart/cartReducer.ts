//recibe un estado y una acción y devuelve un estado- es síncrono
import { CartState  } from './'
import { ICartProduct, ShippingAddress } from '../../interfaces';


type NewType = {};

type CartActionType  = 
   | { type: '[CART] - LoadCart from cookies | storage', payload: ICartProduct[] }
   | { type: '[CART] - Update products in cart', payload: ICartProduct[] } //supone recibir todos los productos en el cart
   | { type: '[CART] - Change cart quantity', payload: ICartProduct }
   | { type: '[CART] - Remove producto in cart', payload: ICartProduct }
   | { type: '[CART] - LoadAddress from Cookies', payload: ShippingAddress }
   | { type: '[CART] - Update Address', payload: ShippingAddress }
   | { 
    type: '[CART] - Update order summary', 
    payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        taxRate: number;
        total: number;
        }
    }
    | { type: '[CART] - Order complete' }
 export const cartReducer = (state: CartState , action: CartActionType): CartState =>{//es una función pura, debe trabajar sólo con los elementos que recibe
     switch ( action. type) { //devuelve un nuevo estado no una mutación del mismo
          case '[CART] - LoadCart from cookies | storage':
            //   console.log('state',state) 
            //   console.log('action.payload',action.payload)
              return { 
                   ...state,
                   isLoaded: true,
                   cart:[ ...action.payload ]// idem a action.payload
              }
          case '[CART] - Update Address':
          case '[CART] - LoadAddress from Cookies':
                // console.log('state -LoadAddress',state) 
                // console.log('action.payload-LoadAddress',action.payload)
                return { 
                     ...state,
                     shippingAddress: action.payload
                }              
          case '[CART] - Update products in cart':
               return {
                   ...state,
                   //cart: [ ...state.cart, action.payload ]
                   cart: [ ...action.payload ]//si vienen todos los productos del cart
               }
            case '[CART] - Change cart quantity':
                return {
                    ...state,
                    cart: state.cart.map( product =>{
                        if ( product._id !== action.payload._id || product.size !== action.payload.size ) return product;
                        return action.payload;                        
                    } )
                }
            case '[CART] - Remove producto in cart': 
                return {
                 ...state,
                 cart: state.cart.filter( product =>  !(product._id === action.payload._id && product.size === action.payload.size) ) 
                }   
            case '[CART] - Update order summary':
                return {
                    ...state,
                    ...action.payload
                }
            case '[CART] - Order complete':
                return {
                    ...state,
                    cart: [],
                    numberOfItems: 0,
                    subTotal: 0,
                    tax: 0,
                    total: 0
                }
            default:
              return state;
         }
    }