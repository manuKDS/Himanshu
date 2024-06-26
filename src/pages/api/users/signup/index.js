import { supabase } from "@/lib/supabaseClient";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of users table
  if (method === "POST") {
    const {
      user_name,
      name,
      email,
      password,     
    } = req.body;
console.log(1111, user_name, name, email, password)

   
    var hashpass = CryptoJS.AES.encrypt(password, process.env.NEXT_PUBLIC_SECRET_KEY);
    try {
      // let { data, error } = await supabase
      //   .from("tbl_users")
      //   .select()
      //   .eq("email", email);
      //   console.log(2222)
      // if (data[0].email === email) {
      //   console.log(3333)
      //   res.status(404).json("User Already Exist");
      // } else {
        console.log(4444)
        const { data, error } = await supabase
          .from("tbl_users")
          .insert({
            user_name,
            name,
            email,
            password:`${hashpass}` ,
            is_active: true,
            is_deleted: false,
            updated_by: 1,
            metadata: 'data',
          })
          .select();

        if (data) {
          console.log(data);
          res.status(200).json(user);
        }

        // let hashPass = CryptoJS.AES.encrypt(
        //   password,
        //   process.env.NEXT_PUBLIC_SECRET_KEY
        // ).toString();

        // let jwtToken = jwt.sign(
        //   { email: user[0].email },
        //   process.env.JWT_SECRET_KEY,
        //   { algorithm: "HS256", noTimestamp: true }
        // );

        // setCookie("token", jwtToken, {
        //   req,
        //   res,
        //   maxAge: 60 * 6 * 24,
        //   httpOnly: true,
        //   secure: true,
        // });
        // console.log({ user, user, jwtToken: jwtToken });

        // res.status(200).json(user);
//}

      if (error) {
        res.status(500).json(error.message);
      }
    } catch (err) {
      console.log(9999)
      console.log("error - ",err.message)
      res.status(500).json(err.message);
    }
  }
}
