import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from 'react-router-dom'

import { toast } from "sonner"

import {Form,FormControl,FormField,FormItem,FormMessage,} from "@/components/ui/form";
import './sign.css';
import { useForm } from "react-hook-form";
import { SigninValidation } from "../../lib/validation";
import type z from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Loader from "@/components/shared/Loader";
import {  useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
//import { createUserAccount } from "../../lib/appwrite/api";


const SigninForm = () => {

  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const navigate = useNavigate();
 
 

  const { mutateAsync: signInAccount } = useSignInAccount();

    // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email:"",
      password:"",

    },
  })
 
  // 2. Define a submit handler.
  async  function onSubmit(values: z.infer<typeof SigninValidation>){
   const session = await signInAccount({
    email: values.email,
    password: values.password,
   })

   if(!session) {
    return toast.error("An error occurd while signing in. Please try again.");
  }

  const isLoggedIn = await checkAuthUser();
  if(isLoggedIn) { 
    form.reset();

    navigate('/')
}  else {
  return toast.error("Wrong credetianls. Please try again.");
}
}

  return (
  <Form {...form}>
    <div className="flex-col gap-3  m">
        <div className="company-1con ">
          <img src="/assetss/images/memeflix.icon.jpg" />
          
          <h2 className="h3 bold md:h2-bold justify-center align-middle flex" >Log in to your account</h2>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  px-5 py-2 ">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} className="input1" />
                </FormControl>
                <FormMessage className="msg" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} className="input1" />
                </FormControl>
                <FormMessage className="msg" />
              </FormItem>
            )}
          />

          <Button type="submit" className="submitt-btn">
            {isUserLoading ? (
              <div className="flex-centre gap-2 ">
               <Loader />
              </div>
            ):"Sign in"}
          </Button>

          <p className="text-small-regular text-light-2 text-centre mt-2">
            Don't  have an account?
            <Link to="/sign-up" className="text-red-500 text-small-semibold ml-1" >Sign up</Link>
          </p>
        </form>
    </div>
  </Form>
  )
}

export default SigninForm