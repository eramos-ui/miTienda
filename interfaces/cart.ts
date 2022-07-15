import { ISize } from './';


export interface ICartProduct {// similar a IProduct
    _id: string;
    //description: string;
    image: string; //un imagen
    //inStock: number;
    price: number;
    size?: ISize;
    slug: string;
    //tags: string[];
    title: string;
    //type: IType;
    gender: 'men'|'women'|'kid'|'unisex';
    //Agregado después de cargar los seeds: createdAt y updatedAt
    // createdAt: String,
    // updatedAt: String
    quantity: number;
}