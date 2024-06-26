import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of role_user table
  if (method === "GET") {
    try {
      let { data, error } = await supabase.from("tbl_role_user").select();
      // .order("role_name", { ascending: true });

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at role_user table
  if (method === "POST") {
    const { modified_by, role_fid, user_fid, is_active } = req.body;

    console.log({       modified_by,      role_fid,      user_fid,      is_active })
    try {
      const { data, error } = await supabase
        .from("tbl_role_user")
        .insert({ modified_by, role_fid, user_fid, is_active })
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
