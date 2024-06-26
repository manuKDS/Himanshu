import { supabase } from "@/lib/supabaseClient";


export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of role table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_role")
        .select('*,accessedMenu:tbl_menu_role(is_editable,menu_fid)')
        .order("role_name", { ascending: true });

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at role table
  if (method === "POST") {
    const { modified_by, organization_fid, role_name, is_active } = req.body;

  //console.log({ modified_by, organization_fid, role_name, is_active})
    try {
      const { data, error } = await supabase
        .from("tbl_role")
        .insert({ modified_by, organization_fid, role_name, is_active })
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
