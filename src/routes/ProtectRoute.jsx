import { actionCurrentUser } from '@/api/auth'
import useAuthStore from '@/store/auth-store'
import React, { useEffect, useState } from 'react'

function ProtectRoute({el,allows}) {
  const[ok,setOk]=useState(null)
  // console.log("Hello, Protect Route")
  // const user = useAuthStore((state)=>state.user)
  const token  = useAuthStore((state)=>state.token)


  useEffect(()=>{
      checkPermission()
  },[])

  const checkPermission = async () =>{
    //   console.log("Check permission")
      try{
          const res = await actionCurrentUser(token)
        //   console.log(res)
          
          // Role from back-end
          const role = res.data.data.user.role
          setOk(allows.includes(role))
          

      }catch(err){
          console.log(err)
          setOk(false)
      }
  }

  if(ok===null){
      return <h1> Loading... </h1>
  }
  if(!ok){
      return <h1> Unauthorized </h1>
  }
return el
}

export default ProtectRoute