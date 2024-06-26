import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Link from "next/link";
import axios from "axios";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [errorlogin, seterrorlogin] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const [erroruser_name, seterroruser_name] = useState("");
    const [errorname, seterrorname] = useState("");
    const [erroremail, seterroremail] = useState("");
    const [errorpassword, seterrorpassword] = useState("");
    const [errorpassword2, seterrorpassword2] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        seterrorlogin("")
        if (username === "") {
            seterroruser_name("Username required!")
            seterrorlogin("Username required!")
        } else if (email === "") {
            seterroremail("Email required!")
            seterrorlogin("Email required!")
        } else if (name === "") {
            seterrorname("Name required!")
            seterrorlogin("Name required!")
        } else if (password === "" || password.length < 6) {
            seterrorpassword("Password required, min 6 character!")
            seterrorlogin("Password required, min 6 character!")
        } else if (password !== password2) {
            seterrorpassword2("Password not match!")
            seterrorlogin("Password not match!")
        } else {

           
            try {
                setLoading(true);
              
                const res1 = await axios.post(process.env.API_SERVER + "users/signup/checkuser", {email: email});

                if (res1.status == 200) {
                    seterrorlogin("User already exists!")
                } else {
                    console.log(111)
                    const data = {
                        email: email,
                        user_name: username,
                        name: name,
                        password: password,
                        updated_by: 1,
                        is_active: true,
                        is_deleted: false,
                        metadata: "data",
                    };

                    const res = await axios.post(process.env.API_SERVER + "users/signup", data);
                

                    if (res.status !== 200) {
                        console.log(333)
                        seterrorlogin("Wrong user credentials!")
                    }
                
                    setLoading(false);
                    router.push("/login")
                }

            } catch (error) {
            
                setLoading(false);
                console.log(error.error_description || error.message);
            }
        }
        setLoading(false);
    };

    return (
        <form onSubmit={(e) => { handleSignUp(e) }}>
            <div className='bg-login_bg h-[100vh] w-full flex items-center font-roboto'>
                <div className='form_wrapper mx-auto bg-black p-6 bg-opacity-60  backdrop-opacity-95 backdrop-blur-[.625em]'>
                    <h2 className='text-white text-center text-4xl font-medium mt-2 mb-4'>
                        Sign Up
                    </h2>
                    <div>
                        <input
                            type='text'
                            onChange={(e) => setUsername(e.target.value)}

                            className='bg-transparent text-white w-full border border-solid  border-[#404043] min-w-[26rem] p-1 my-2 focus:border-[#e50914]  focus-visible:border-[#e50914] focus:outline-none             focus:rounded-none px-2 py-1            '
                            placeholder='Username'
                        />
                    </div>

                    <div className=' '>
                        <input
                            type='email'
                            onChange={(e) => setEmail(e.target.value)}

                            className='bg-transparent text-white w-full border border-solid  border-[#404043] min-w-[26rem] p-1 my-2 focus:border-[#e50914]  focus-visible:border-[#e50914] focus:outline-none             focus:rounded-none px-2 py-1            '
                            placeholder='Email'
                        />
                    </div>
                    <div className=' '>
                        <input
                            type='text'
                            onChange={(e) => setName(e.target.value)}

                            className='bg-transparent text-white w-full border border-solid  border-[#404043] min-w-[26rem] p-1 my-2 focus:border-[#e50914]  focus-visible:border-[#e50914] focus:outline-none             focus:rounded-none px-2 py-1            '
                            placeholder='Full Name'
                        />
                    </div>
                    {/* <div className='grid grid-cols-2'>
          <div>
            <label className='block text-gray1'>First Name</label>
            <input
              type='text'
          
              className='bg-transparent text-white  border border-solid  border-[#404043] min-w-[20rem] mr-2 p-1 my-2 focus:border-[#e50914]  focus-visible:border-[#e50914] focus:outline-none
            focus:rounded-none px-2 py-1
            '
              placeholder='First Name'
            />
          </div>
          <div>
            <label className='block text-gray1 pl-2'>Last Name</label>
            <input
              type='text'
             
              className='bg-transparent text-white  border border-solid  border-[#404043] min-w-[20rem] ml-2 p-1 my-2 focus:border-[#e50914]  focus-visible:border-[#e50914] focus:outline-none
            focus:rounded-none px-2 py-1
            '
              placeholder='Last Name'
            />
          </div>
        </div> */}
                    <div className='grid grid-cols-2'>
                        <div>
                            {/* <label className='block text-gray1'>Password</label> */}
                            <input

                                type='password'

                                className='bg-transparent text-white  border border-solid  border-[#404043] min-w-[20rem] mr-2 p-1 my-2 focus:border-[#e50914]  focus-visible:border-[#e50914] focus:outline-none             focus:rounded-none px-2 py-1            '
                                placeholder='Password'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            {/* <label className='block text-gray1 pl-2'>Repeat Password</label> */}
                            <input
                                type='password'
                                onChange={(e) => setPassword2(e.target.value)}
                                className='bg-transparent text-white  border border-solid  border-[#404043] min-w-[20rem] ml-2 p-1 my-2 focus:border-[#e50914]  focus-visible:border-[#e50914] focus:outline-none             focus:rounded-none px-2 py-1            '
                                placeholder='Repeat Password'
                            />
                        </div>
                    </div>
                    <div className='mt-2'>
                        <button
                            className='bg-[#e50914] text-white py-3 px-6'
                            type="submit"
                        // onClick={handleSignUp}
                        >
                            {loading ? "Wait..." : "SIGN UP"}
                        </button>
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
                            <Link href='/login' className='text-[#e50914]'>
                                Sign In
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
            </div>
        </form>
    );
};

export default Signup;
