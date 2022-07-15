

import useSWR, { SWRConfiguration } from "swr";
import { IProduct } from "../interfaces";

//const fetcher = (...args: [key: string] ) => fetch(...args).then(res => res.json());//así se le indica la forma en que ejecuta la petición

export const useProducts = ( url: string, config : SWRConfiguration = {} ) =>{
    // const { data, error } = useSWR<IProduct[]>(`/api${ url}`, fetcher, config );
    const { data, error } = useSWR<IProduct[]>(`/api${ url }`, config );//utilizando un componente global _app.tdx
   return {
    products: data || [],
    isLoading: !error && !data,
    isError: error
   }
}