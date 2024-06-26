import { supabase } from "@/lib/supabaseClient";


export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of menu_role table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_menu_role")
        .select()
        .order("menu_role_id", { ascending: true });

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at menu_role table
  if (method === "POST") {
    const { role_fid, accessedMenus, isMenuAccessEdited } = req.body;
    try {
      const rows = accessedMenus.map((menu) => {
        return {
          modified_by: 1,
          is_active: 1,
          role_fid: role_fid,
          menu_fid: menu.menu_id,
          is_editable: menu.isEditable
        }
      })
      isMenuAccessEdited && await supabase
        .from("tbl_menu_role")
        .delete()
        .eq("role_fid", role_fid);

      const { data, error } = await supabase
        .from("tbl_menu_role")
        .insert(rows)
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
