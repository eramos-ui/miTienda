

export interface IUser {
    _id      : string;
    name     : string;
    email    : string;
    password?: string;//esto no estará en el FE
    role     : string;

    createdAt?: string;//este par probablemente no estará en el FE
    updatedAt?: string;

}