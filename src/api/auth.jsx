import axios from "axios"

export const actionRegister= async(value)=>{
    return await axios.post('http://localhost:8000/auth/register',value)
}

export const actionLogin= async(value)=>{
    return await axios.post('http://localhost:8000/auth/login',value)
}

export const actionCurrentUser = async(token)=>{
    return await axios.get("http://localhost:8000/auth/currentUser",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
}