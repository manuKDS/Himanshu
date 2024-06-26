import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
//import Dailog from "./Dialog";
import Link from "next/link";
import { setCookie } from "cookies-next";
import { SignJWT } from "jose";
import axios from "axios";

const Login = () => {
  const userEmail = useSelector((state) => state.user?.userInfo[0]?.email);
  // const [user_name, setuser_name] = useState("")
  // const [name, setname] = useState("")
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [errorlogin, seterrorlogin] = useState("");
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  // const [erroruser_name, seterroruser_name]= useState("")
  // const [errorname, seterrorname]= useState("")
  const [erroremail, seterroremail] = useState("");
  const [errorpassword, seterrorpassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    seterrorlogin("")
    try {
      setLoading(true);

      const data = {
        email: email.trim(),
        password: password,
      };

      const res = await axios.post(process.env.API_SERVER + "users/login", data);

      if (res.status !== 200) {
        seterrorlogin(res.data)
      } else {
        router.push("/production");
      }

    } catch (error) {
      seterrorlogin("Wrong user credentials!")
      console.log(error);
    }
    setLoading(false);
  };

  const errorMsg = (error) => {
    return error && <p>error</p>;
  };
  return (
    <form onSubmit={(e) => { handleSignIn(e) }}>
      <div className='bg-login_bg h-[100vh] w-full flex items-center font-roboto'>
        <div className='form_wrapper mx-auto bg-black p-6 bg-opacity-60  backdrop-opacity-95 backdrop-blur-[.625em]'>
          <h2 className='text-white text-center text-4xl font-medium mt-2 mb-4'>
            Sign In
          </h2>
          <div className=' '>
            <input
              type='text'
              onChange={(e) => setemail(e.target.value)}
              autoComplete='off'

              className='bg-transparent text-white w-full border border-solid  border-[#404043] min-w-[26rem] p-1 my-2 focus:border-[#e50914]  focus-visible:border-[#e50914] focus:outline-none
            focus:rounded-none px-2 py-1
            '
              placeholder='Enter Email'
            />
          </div>
          <div>
            <input
              type='password'
              autoComplete='off'
              onChange={(e) => setpassword(e.target.value)}

              className='bg-transparent text-white w-full border border-solid  border-[#404043] min-w-[26rem] p-1 my-2 focus:border-[#e50914]  focus-visible:border-[#e50914] focus:outline-none
            focus:rounded-none px-2 py-1
            '
              placeholder='Password'
            />
          </div>
          <div className='mt-2'>
            <button
              className='bg-[#e50914] text-white py-3 px-6'
              type="submit"
              disabled={loading}
            >
              {loading ? "SIGN IN..." : "SIGN IN"}
            </button>

            <input type='checkbox' className='mx-2 rounded-md' />
            <label className='text-gray1'>Remember Me</label>
          </div>

          {errorlogin &&
            <div className="text-white text-center font-light ">
              <p className="mt-4 mb-1 text-md text-[#e50914] ">
                {errorlogin}
              </p>
            </div>
          }

          <div className='text-white text-center font-light '>
            <p className='mt-4 mb-1 text-sm'>
              Don&apos;t have an account?{" "}
              <Link href='/signup' className='text-[#e50914]'>
                Sign Up
              </Link>
            </p>
            <p>
              <Link
                href='login/forgot_password'
                className='hover:text-[#e50914] ease-in-out duration-500 text-sm'
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
        {/* <Dailog
        state={{ isDelOpen, setIsDelOpen, errorlogin }}
      /> */}
      </div>
    </form>
  );
};

export default Login;
