import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from 'react-router-dom'

import { toast } from "sonner"

import {Form,FormControl,FormField,FormItem,FormMessage,} from "@/components/ui/form";
import './sign.css';
import { useForm } from "react-hook-form";
import { SignupValidation } from "../../lib/validation";
import type z from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Loader from "@/components/shared/Loader";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";


const SignupForm = () => {

  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const navigate = useNavigate();
 
  const {mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();

  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();

    // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name:"",
      username: "",
      email:"",
      password:"",

    },
  })
 
  // 2. Define a submit handler.
  async  function onSubmit(values: z.infer<typeof SignupValidation>) {
   const newUser = await createUserAccount(values);

   
   if(!newUser) {
    return toast.error("An error occurred while signing in. Please try again.");
    }

   const session = await signInAccount({
    email: values.email,
    password: values.password,
   })

   if(!session) {
    return toast.error("Click sign in to login to your account");
  }

  const isLoggedIn = await checkAuthUser();
  if(isLoggedIn) { 
    form.reset();

    navigate('/')
}  else {
  return toast.error("An error occurred while creating a new account. Please try again.");
}
}

  return (
  <Form {...form}>
    <div className="flex-col gap-3  m">
        <div className="company-1con ">
          <img src="/assetss/images/memeflix.icon.jpg" />
          
          <h2 className="h3 bold md:h2-bold justify-center align-middle flex" >Create a new account</h2>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  px-5 py-2 ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Name" {...field} className="input1" />
                </FormControl>
                <FormMessage className="msg" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Username" {...field} className="input1" />
                </FormControl>
                <FormMessage className="msg" />
              </FormItem>
            )}
          />
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
            {isCreatingAccount ? (
              <div className="flex-centre gap-2 ">
               <Loader />
              </div>
            ):"Sign up"}
          </Button>

          <p className="text-small-regular text-light-2 text-centre mt-2">
            Already have an account?
            <Link to="/sign-in" className="text-red-500 text-small-semibold ml-1" >Log in</Link>
          </p>
        </form>
    </div>
  </Form>
  )
}

export default SignupForm