import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const role_user_id = id;

  // GET method to get single records of tbl_role_user table
  if (method === "GET") {

    try {
      let { data, error } = await supabase
        .from("tbl_role_user")
        .select()
        .eq("role_user_id", role_user_id)

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  

  // UPDATE method to update single record at tbl_role_user table
  if (method === "PUT") {
    const { role_name, name, email, passoword, is_active } = req.body;
    console.log("Server-", role_name, name, email, passoword, is_active);

    try {
      const { data, error } = await supabase
        .from("tbl_role_user")
        .update({ role_name, name, email, passoword, is_active })
        .eq("role_user_id", role_user_id)
        .select();

      res.status(200).json(data);
    } catch (err) {
      console.log(4);
      res.status(500).json(err);
    }
  }

  
  // DELETE method to delete single record at tbl_role_user table
  if (method === "DELETE") {

    try {
      console.log(1)
      const { error } = await supabase
        .from("tbl_role_user")
        .delete()
        .eq("role_user_id", role_user_id);

        console.log(2)
      res.status(200).json("Role deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
