import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const role_id = id;

  // GET method to get single records of tbl_role table
  if (method === "GET") {

    try {
      let { data, error } = await supabase
        .from("tbl_role")
        .select()
        .eq("role_id", role_id)

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  

  // UPDATE method to update single record at tbl_role table
  if (method === "PUT") {
    const { modified_by, organization_fid, role_name, is_active } = req.body;
    //console.log("Server-", modified_by, organization_fid, role_name, is_active);

    try {
      const { data, error } = await supabase
        .from("tbl_role")
        .update({ modified_by, organization_fid, role_name, is_active })
        .eq("role_id", role_id)
        .select();

      res.status(200).json(data);
    } catch (err) {
      console.log(4);
      res.status(500).json(err);
    }
  }

  
  // DELETE method to delete single record at tbl_role table
  if (method === "DELETE") {

    try {
      const {error_menu_role} = await supabase
      .from("tbl_menu_role")
      .delete()
      .eq("role_fid", role_id);

      const { error } = await supabase
        .from("tbl_role")
        .delete()
        .eq("role_id", role_id);

      res.status(200).json("Role deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
