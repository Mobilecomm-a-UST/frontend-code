import { decrypt, encrypt } from "./encryption"

const Secret_code = 'girraj282136'

export const setEncreptedData = (key , data)=>{
     const encrepted = encrypt(data , Secret_code)
     localStorage.setItem(key , encrepted)
}


export const getDecreyptedData = (key )=>{
    const data = localStorage.getItem(key)
    if(!data) return null;
    return decrypt(data , Secret_code)
}