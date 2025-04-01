import {create} from 'zustand'
import { actionLogin } from '../api/auth'
import {persist} from  'zustand/middleware'


//Step1 create store
const authStore = (set) =>({
    user:null,
    token:null,
    role : null,
    actionLoginWithZustand : async (value)=>{
        try{
            const { userEmail, password } = value;
            console.log(userEmail,password)
            const res = await actionLogin({ userEmail, password })
            const {user,accessToken} = res.data.data
            // console.log('Helllo Zustand',res.data.data)
            // console.log('Helllo Zustand',accessToken)
            set({user:user,token:accessToken,role:user.role})
            return { success:true,role:user.role,id:user.id }
        } catch(err){
            console.log(err)
            return { success:false,error:err.response}
        }
        
    },
    actionLogout : ()=>{
        set({
            user:null,token:null,role:null
        })
    }

})

// Step 2 exports Store
const useAuthStore = create(persist(authStore,{name:'auth-store'}))

export default useAuthStore;