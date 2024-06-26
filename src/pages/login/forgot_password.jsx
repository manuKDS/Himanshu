import Link from "next/link";
import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [errorForgotPassword, setErrorForgotPassword] = useState("")
  const [isMailSent, setIsMailSent] = useState(false)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      if (isValidEmail(email)) {
        const { data, error, status } = await axios.post(process.env.API_SERVER + "users/forgot_password", { email });
        if (error) {
          setErrorForgotPassword(error.message);
        } else {
          if (status === 201) {
            setErrorForgotPassword(data);
          } else {
            setErrorForgotPassword("")
            setIsMailSent(true)
          }
        }

      } else {
        setErrorForgotPassword("Please enter valid email");
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error("error::", error.message);
    }
  }
  return (
    <form onSubmit={(e) => { HandleSubmit(e) }}>
      <div className="bg-login_bg h-[100vh] w-full flex items-center font-roboto">
        <div className="form_wrapper mx-auto bg-black p-6 bg-opacity-60  backdrop-opacity-95 backdrop-blur-[.625em]">
          <h2 className="text-white text-center text-4xl font-medium mt-2 mb-4">
            Forgot Password
          </h2>
          <div className=" ">
            <input
              type="text"
              className="bg-transparent text-white w-full border border-solid  border-[#404043] min-w-[26rem] p-1 my-2 focus:border-[#e50914]  focus-visible:border-[#e50914] focus:outline-none
              focus:rounded-none px-2 py-1
              "
              placeholder="Enter Email"
              onChange={(e) => {
                setErrorForgotPassword("");
                setIsMailSent(false);
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className="mt-2">
            <button disabled={isLoading} className="bg-[#e50914] text-white py-2 px-5" type="submit">{isLoading ? "Forgot Password..." : "Forgot Password"}</button>
          </div>
          <div className="text-white text-center font-light ">
            <p className="mt-4 mb-1 text-md text-[#e50914] ">
              {errorForgotPassword}
            </p>
          </div>
          {isMailSent && <div className="text-white text-center font-light ">
            <p className="mt-4 mb-1 text-md text-[#white] ">
              Please check your mail inbox. <Link href="/login" className="text-[#e50914]">
                Log in
              </Link>
            </p>
          </div>}
          <div className="text-white text-center font-light ">
            <p className="mt-4 mb-1 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#e50914]">
                Sign Up
              </Link>
            </p>
            <p>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ForgotPassword;
