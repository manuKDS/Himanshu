import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router'

const ResetPassword = () => {
  const router = useRouter()
  const [errorForgotPassword, setErrorForgotPassword] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      if (password === "" || confirmPassword === "") {
        setErrorForgotPassword("Password or Confirm Password can't empty");
      } else {
        if (password === confirmPassword) {
          if (router.query.token || router.query.token === "") {
            const { data, error, status } = await axios.post(process.env.API_SERVER + "users/reset_password", { token: router.query.token, password: password });

            if (error) {
              setErrorForgotPassword(error.message);
            } else {
              if (status === 201) {
                setErrorForgotPassword(data);
              }
              else if (status === 500) {
                setErrorForgotPassword("Reset link may expire.Please try again!");
              }
              else {
                setErrorForgotPassword("")
                router.push("/login")
              }
            }
          } else {
            setErrorForgotPassword("Reset link may expire.Please try again!");
          }
        } else {
          setErrorForgotPassword("Password and Confirm Password must be same");
        }
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setErrorForgotPassword("Reset link may expire.Please try again!");
    }
  }
  return (
    <form onSubmit={(e) => { HandleSubmit(e) }}>
      <div className="bg-login_bg h-[100vh] w-full flex items-center font-roboto">
        <div className="form_wrapper mx-auto bg-black p-6 bg-opacity-60  backdrop-opacity-95 backdrop-blur-[.625em]">
          <h2 className="text-white text-center text-4xl font-medium mt-2 mb-4">
            Reset Password
          </h2>
          <div className=" ">
            <input
              type="password"
              className="bg-transparent text-white w-full border border-solid  border-[#404043] min-w-[26rem] p-1 my-2 focus:border-[#e50914]  focus-visible:border-[#e50914] focus:outline-none
              focus:rounded-none px-2 py-1
              "
              placeholder="Enter New Password"
              onChange={(e) => {
                setErrorForgotPassword("");
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className=" ">
            <input
              type="password"
              className="bg-transparent text-white w-full border border-solid  border-[#404043] min-w-[26rem] p-1 my-2 focus:border-[#e50914]  focus-visible:border-[#e50914] focus:outline-none
              focus:rounded-none px-2 py-1
              "
              placeholder="Enter Conform Password"
              onChange={(e) => {
                setErrorForgotPassword("");
                setConfirmPassword(e.target.value);
              }}
            />
          </div>

          <div className="mt-2">
            <button disabled={isLoading} className="bg-[#e50914] text-white py-2 px-5" type="submit">{isLoading ? "Reset Password..." : "Reset Password"}</button>
          </div>
          <div className="text-white text-center font-light ">
            <p className="mt-4 mb-1 text-md text-[#e50914] ">
              {errorForgotPassword}
            </p>
          </div>
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

export default ResetPassword;
