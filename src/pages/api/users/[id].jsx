import { supabase } from "@/lib/supabaseClient";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const user_id = id;

  // GET method to get single records of tbl_users table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_users")
        .select()
        .eq("user_id", user_id);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_users table
  if (method === "PUT") {
    const {
      user_name,
      name,
      email,
      password,
      // is_active,
      // is_deleted,
      // updated_by,
      // metadata,
    } = req.body;

    let hashPass = CryptoJS.AES.encrypt(
      password,
      process.env.NEXT_PUBLIC_SECRET_KEY
    ).toString();

    try {
      const { data, error } = await supabase
        .from("tbl_users")
        .update({
          user_name,
          name,
          email,
          password: hashPass,
          // is_active,
          // is_deleted,
          // updated_by,
          // metadata,
        })
        .eq("user_id", user_id)
        .select();

      res.status(200).json(data);
    } catch (err) {
      console.log(4);
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_users table
  if (method === "DELETE") {
    try {
      const { error_user_role } = await supabase
        .from("tbl_role_user")
        .delete()
        .eq("user_fid", user_id);

      if (error_user_role) {
        res.status(500).json(error_user_role);
        return;
      }

      const { error } = await supabase
        .from("tbl_users")
        .delete()
        .eq("user_id", user_id);

      if (error) {
        res.status(500).json(error);
        return;
      }

      res.status(200).json("User deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
