import { supabase } from "@/lib/supabaseClient";
import CryptoJS from "crypto-js";
import { jwtVerify } from "jose";


export default async function handler(req, res) {
  const { method } = req;

  if (method === "POST") {
    const { token, oldPassword, newPassword } = req.body;

    try {
      const secret = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_JWT_SECRET_KEY
      );

      const { payload } = await jwtVerify(token, secret)

      let { data: user, error: user_error } = await supabase
        .from("tbl_users")
        .select("user_id, password")
        .eq("email", payload.email);

      if (!user.length) {
        res.status(500).json("Invalid user credential!");
      } else {
        let bytes = CryptoJS.AES.decrypt(
          user[0].password,
          process.env.NEXT_PUBLIC_SECRET_KEY
        );
        let decryptedPass = bytes.toString(CryptoJS.enc.Utf8);
        if (oldPassword === decryptedPass) {
          var hashpass = CryptoJS.AES.encrypt(newPassword, process.env.NEXT_PUBLIC_SECRET_KEY);
          const { data, error } = await supabase
            .from("tbl_users")
            .update({
              password: `${hashpass}`
            })
            .eq("email", payload.email)
            .select();

          error && res.status(500).json(error);

          res.status(200).json(data);
        } else {
          res.status(201).json("Old Password is not valid");
        }
      }
      if (user_error) {
        res.status(500).json(user_error.message);
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
}
