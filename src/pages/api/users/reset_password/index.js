import { supabase } from "@/lib/supabaseClient";
import CryptoJS from "crypto-js";
import { jwtVerify } from "jose";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "POST") {
    const { token, password } = req.body;

    try {
      const secret = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_JWT_SECRET_KEY
      );

      const data = await jwtVerify(token, secret)

      let bytes = CryptoJS.AES.decrypt(
        data.payload.data,
        process.env.NEXT_PUBLIC_SECRET_KEY
      );
      let decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      decryptedData = JSON.parse(decryptedData)
      let { data: user, error: user_error } = await supabase
        .from("tbl_users")
        .select("user_id, email")
        .eq("email", `${decryptedData.email}`);

      user_error && res.status(500).json(user_error);

      if (user.length > 0) {
        let hashpass = CryptoJS.AES.encrypt(password, process.env.NEXT_PUBLIC_SECRET_KEY);
        const { data, error } = await supabase
        .from("tbl_users")
        .update({
          password: `${hashpass}`
        })
        .eq("email", decryptedData.email)
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
      } else {
        res.status(201).json("Something wrong.Try again");
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
}
