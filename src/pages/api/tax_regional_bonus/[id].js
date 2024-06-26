import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const tax_regional_bonus_id = id;
  // GET method to get single records of tbl_tax_regional_bonus table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_tax_regional_bonus")
        .select()
        .eq("tax_regional_bonus_id", tax_regional_bonus_id);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_tax_regional_bonus table
  if (method === "DELETE") {
    try {
      const { error } = await supabase
        .from("tbl_tax_regional_bonus")
        .delete()
        .eq("tax_regional_bonus_id", tax_regional_bonus_id);

      error && res.status(401).json("tax_regional_bonus not deleted!");

      res.status(200).json("tax_regional_bonus deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_tax_regional_bonus table
  if (method === "PUT") {
    const { tax_regional_bonus, country_fid, is_active } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_tax_regional_bonus")
        .update({ tax_regional_bonus, country_fid, is_active })
        .eq("tax_regional_bonus_id", tax_regional_bonus_id)
        .select();

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
