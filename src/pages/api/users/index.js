import { supabase } from "@/lib/supabaseClient";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of users table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_users")
        .select()
        .order("user_name", { ascending: true });

      //error && res.status(500).json(error);
      //console.log(data)
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at users table
  if (method === "POST") {
    const {
      user_name,
      name,
      email,
      password,
      is_active,
      // is_deleted,
      // updated_by,
      metadata,
    } = req.body;

    let hashPass = CryptoJS.AES.encrypt(
      password,
      process.env.NEXT_PUBLIC_SECRET_KEY
    ).toString();

    try {
      const { data, error } = await supabase
        .from("tbl_users")
        .insert({
          user_name,
          name,
          email,
          password: hashPass,
          is_active: true,
          is_deleted: false,
          // updated_by,
          metadata,
        })
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
