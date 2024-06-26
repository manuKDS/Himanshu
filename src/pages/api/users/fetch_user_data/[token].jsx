import { supabase } from "@/lib/supabaseClient";
import { jwtVerify } from "jose";

export default async function handler(req, res) {
  const {
    method,
    query: { token },
  } = req;
  const user_token = token;
  const secret = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_JWT_SECRET_KEY
  );

  // GET method to get single records of tbl_users table with token
  if (method === "GET") {
    try {
      const { payload } = await jwtVerify(user_token, secret)
      let { data, error } = await supabase
        .from("tbl_users")
        .select('email,name,user_name,profile_image')
        .eq("email", payload.email);

      if (data.length > 0) {
        res.status(201).json(data[0]);
      } else {
        res.status(500).json("something wrong!");
      }

    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (method === "PUT") {
    const {
      user_name,
      name,
      profile_image
    } = req.body;

    try {
      const { payload } = await jwtVerify(user_token, secret)
      const { data, error } = await supabase
        .from("tbl_users")
        .update({
          user_name,
          name,
          profile_image
        })
        .eq("email", payload.email)
        .select();
      if (data.length > 0 && !error) {
        res.status(201).json(data);
      } else {
        res.status(500).json("something wrong!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

}
