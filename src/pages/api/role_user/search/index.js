import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
    const {
        method,
        query: { id },
      } = req;
      const role_fid = id;

  // GET method to get all records of role_user table
  if (method === "GET") {
    
    try {
      let { data, error } = await supabase
        .from("tbl_role")
        .select()
        .eq("role_fid", role_fid);

    

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
