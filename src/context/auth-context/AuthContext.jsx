import axiosInstance from "@/api/axiosInstance";
import { intialSignInFormData, intialSignUpFormData } from "@/config/signFormControl";
import { registerService } from "@/service/AuthService/registerService";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContextObject";
import { loginService } from "@/service/AuthService/loginService";
import { checkAuthService } from "@/service/AuthService/checkAuth";
import { Skeleton } from "@/components/ui/skeleton";



function AuthProvider({ children }) {

    const [signInFormData, setSignInFormData] = useState(intialSignInFormData)
    const [signUpFormData, setSignUpFormData] = useState(intialSignUpFormData)
    const [auth, setAuth] = useState({ authenticate: false,
        user:null
     })
    const[loading,setLoading] = useState(true)


     async function handleRegisterUser(event) {
        event.preventDefault();
        const data = await registerService(signUpFormData);
      }

      async function handleLoginUser(event) {
        event.preventDefault();
        const data = await loginService(signInFormData);
        console.log(data, "datadatadatadatadata");
    
        if (data.success) {
          sessionStorage.setItem(
            "accessToken",
            JSON.stringify(data.data.accessToken)
          );
          setAuth({
            authenticate: true,
            user: data.data.user,
          });
        } else {
          setAuth({
            authenticate: false,
            user: null,
          });
        }
      }

    //check auth user

    async function checkAuthUser() {
      try{
        const data = await checkAuthService();

        if(data.success){
          setAuth({
              authenticate: true,
              user:data.data.user,
          })
          setLoading(false)
      } else {
          setAuth({
              authenticate: false,
              user:null,
          })
          setLoading(false)
      }
      }catch(err){
        console.log(err)
        if(!err?.response?.data?.success){
          setAuth({
            authenticate: false,
            user:null,
        })
        setLoading(false)
        }
      }
        
    }

    const resetCredentials = ()=>{
      setAuth({
        authenticate:false,
        user:null
      })
    }

    useEffect(()=>{
        checkAuthUser()
    },[])

    console.log(auth)

    return <AuthContext.Provider value={{
        signInFormData, setSignInFormData,
        signUpFormData, setSignUpFormData, handleRegisterUser, handleLoginUser,auth,resetCredentials
    }} >{
      loading?<Skeleton/> :children
    }</AuthContext.Provider>
}

export { AuthProvider };