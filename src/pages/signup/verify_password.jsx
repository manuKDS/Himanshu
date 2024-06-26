import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Signup = () => {
  const [email, setemail]  =useState("")
  const [password, setpassword] = useState("")
  const [errorlogin, seterrorlogin] = useState("")
  const router = useRouter()

 

  return (
    <div className="bg-login_bg h-[100vh] w-full flex items-center font-roboto">
      <div className="form_wrapper mx-auto bg-black p-6 bg-opacity-60  backdrop-opacity-95 backdrop-blur-[.625em]">
        <h2 className="text-white text-center text-4xl font-medium mt-2 mb-4">
          Verify Password
        </h2>
       
       
      
        <div className="text-white text-center font-light ">
          <p className="mt-4 mb-1 text-sm">
            Please verify your email first. goto your email and click at link to verify your email.            
          </p>
          <p>
            <Link href="/login" className="text-[#e50914] text-lg">
           
              Click here to Sign In
           
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
