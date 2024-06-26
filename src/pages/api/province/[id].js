import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const province_id = id;
  // GET method to get single records of tbl_province table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_province")
        .select()
        .eq("province_id", province_id);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_province table
  if (method === "DELETE") {
    try {
      const { error } = await supabase
        .from("tbl_province")
        .delete()
        .eq("province_id", province_id);

      error && res.status(401).json("Province not deleted!");

      res.status(200).json("Province deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_province table
  if (method === "PUT") {
    const { province, country_fid, is_active } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_province")
        .update({ province, country_fid, is_active })
        .eq("province_id", province_id)
        .select();

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
