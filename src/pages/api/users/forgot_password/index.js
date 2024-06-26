import { supabase } from "@/lib/supabaseClient";
import CryptoJS from "crypto-js";
import { SignJWT } from "jose";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "POST") {
    const { email } = req.body;

    try {
      let { data: user, error: user_error } = await supabase
        .from("tbl_users")
        .select("user_id, email")
        .eq("email", email);

      user_error && res.status(500).json(user_error);

      const alg = "HS256";
      const secret = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_JWT_SECRET_KEY
      );

      if (user.length > 0) {
        let encryptUserData = CryptoJS.AES.encrypt(JSON.stringify(user[0]), process.env.NEXT_PUBLIC_SECRET_KEY);
        const token = await new SignJWT({
          data: `${encryptUserData}`
        })
          .setProtectedHeader({ alg })
          .setExpirationTime('1d')
          .sign(secret);

        res.status(200).json(process.env.NEXT_PUBLIC_CLIENT + "login/reset_password?token=" + token);

      } else {
        res.status(201).json("Email not found");
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
}
