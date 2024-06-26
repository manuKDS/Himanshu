import { supabase } from "@/lib/supabaseClient";
import CryptoJS from "crypto-js";
import { setCookie } from "cookies-next";
import { SignJWT } from "jose";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of users table
  if (method === "POST") {
    const { email } = req.body;
    console.log(111)
    try {
      let { data: user, error } = await supabase
        .from("tbl_users")
        .select("user_id, user_name, name, email")
        .eq("email", email);

      console.log(222)
      console.log("Error ",error)
      console.log("Data ",user)
      if (!user.length) {
        console.log(333)
        res.status(201).json("No user");
      } else {        
        console.log(444)
        res.status(500).json("user exists");
      }
     
    } catch (err) {
      console.log(9999);
      res.status(500).json(err.message);
    }
  }
}
