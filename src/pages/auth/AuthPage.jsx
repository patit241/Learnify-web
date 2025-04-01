import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import useAuthStore from "@/store/auth-store";
import { loginSchema, registerSchema } from "@/utils/authValidator";
import { signInFormControls, signUpFormControls } from "@/format/authFormat";
import AuthForm from "@/components/form/AuthForm";
import { actionRegister } from "@/api/auth";
import { mergeGuestCart } from "@/utils/mergeGuestCart";

export default function AuthPage() {

  const [activeTab, setActiveTab] = useState("signin");
  const user = useAuthStore(state => state.user)

  //Zustand
  const actionLoginWithZustand = useAuthStore((state) => state.actionLoginWithZustand)


  const navigate = useNavigate()
  const { register, handleSubmit, formState, reset, control } = useForm({
    resolver: zodResolver(activeTab === "signin" ? loginSchema : registerSchema)
  });
  const { isSubmitting, errors } = formState
  console.log(errors)


  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const hdlLogin = async (value) => {
    console.log("Attempting Login with:", value); // Debug

    const res = await actionLoginWithZustand(value);
    console.log("Login Response:", res);

    if (res.success) {
      await mergeGuestCart(res.id);
      roleRedirect(res.role);
      reset();
    } else {
      alert("Login failed. Incorrect email or Password");
    }
  };


  const hdlRegister = async (value) => {
    try {
      const res = await actionRegister(value);
      console.log("Register Response:", res);

      if (res.data.success) {
        // Wait for login to complete
        await hdlLogin({
          userEmail: value.userEmail,  // Ensure correct field name
          password: value.password     // Ensure correct field name
        });
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed.Please input all required data.");
    }
  };


  const roleRedirect = (role) => {
    if (role === "INSTRUCTOR") {
      navigate('/instructor')
    } else {
      const lastPage = localStorage.getItem('lastVisitedPage');
      if (lastPage) {
        navigate(lastPage);
        localStorage.removeItem('lastVisitedPage');  // Clear it after redirect
      } else {
        navigate('/');  // Default to home page if no saved page
      }
    }
  }

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [])

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='px-4 lg:px-6 h-14 flex items-center border-b'>
        <h1 className='flex items-center justify-center' >
          <img src="./logo.png" width={'44px'} alt="" />
          <span className='font-extrabold text-xl cursor-default '>Learnify</span>
        </h1>
      </header>
      <div className='flex items-center justify-center min-h-screen bg-background' >
        <Tabs
          value={activeTab} defaultValue='signin' onValueChange={handleTabChange}
          className="w-full max-w-md"  >
          <TabsList className="grid w-full grid-cols-2" >
            <TabsTrigger value="signin" > Sign In </TabsTrigger>
            <TabsTrigger value="signup"> Sign Up </TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className='p-6 space-y-4 '>
              <CardHeader>
                <CardTitle>
                  Sign in to your account
                </CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <label htmlFor="" className="font-semibold" >Email</label>
                  <input
                    {...register("userEmail", { required: "Email is required" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your email"
                  />
                  {errors.userEmail && (
                    <p className="text-red-500 text-sm">{errors?.userEmail?.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="" className="font-semibold" >Password</label>
                  <input
                    {...register("password", { required: "Password is required" })}
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors?.password?.message}</p>
                  )}
                </div>

                <br />

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit(hdlLogin)}
                  disabled={isSubmitting} // Disable button while submitting
                  className="w-full bg-black text-white py-2 px-4 rounded-md flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <Loader className="animate-spin h-4 w-4" />
                      <p>Loading...</p>
                    </div>
                  ) : (
                    <p>Sign in</p>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className='p-6 space-y-4 '>
              <CardHeader>
                <CardTitle>
                  Create an account
                </CardTitle>
                <CardDescription>
                  Input all required data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* <AuthForm formControls={signUpFormControls}
                  buttonText={'Sign Up'}
                  register={register}
                  submit={hdlRegister}
                  isSubmitting={isSubmitting}
                  handleSubmit={handleSubmit}
                  control={control} />*/}
                <div>
                  <label htmlFor="" className="font-semibold" >UserName</label>
                  <input
                    {...register("userName", { required: "userName contain atleast 3" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your name"
                  />
                  {errors.userEmail && (
                    <p className="text-red-500 text-sm">{errors?.userName?.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="" className="font-semibold" >Email</label>
                  <input
                    {...register("userEmail", { required: "Email is required" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your email"
                  />
                  {errors.userEmail && (
                    <p className="text-red-500 text-sm">{errors?.userEmail?.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="" className="font-semibold" >Password</label>
                  <input
                    {...register("password", { required: "Password is required" })}
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors?.password?.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="font-semibold">Role</label>
                  <select
                    {...register("role", { required: "Role is required" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="">Select a role</option>
                    <option value="STUDENT">Student</option>
                    <option value="INSTRUCTOR">Instructor</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm">{errors?.role?.message}</p>
                  )}
                </div>
                <br />
                {/* Submit Button */}
                <Button
                  onClick={handleSubmit(hdlRegister)}
                  disabled={isSubmitting} // Disable button while submitting
                  className="w-full bg-black text-white py-2 px-4 rounded-md flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <Loader className="animate-spin h-4 w-4" />
                      <p>Loading...</p>
                    </div>
                  ) : (
                    <p>Sign up</p>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
