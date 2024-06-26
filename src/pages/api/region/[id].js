import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const region_id = id;
  // GET method to get single records of tbl_region table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_region")
        .select()
        .eq("region_id", region_id);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_region table
  if (method === "DELETE") {
    try {
      await supabase
        .from("tbl_region_city")
        .delete()
        .eq("region_fid", region_id);
        
      const { error } = await supabase
        .from("tbl_region")
        .delete()
        .eq("region_id", region_id);

      error && res.status(401).json("Region not deleted!");

      res.status(200).json("Region deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_region table
  if (method === "PUT") {
    const { Region, is_active, org_fid, country_fid } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_region")
        .update({ Region, is_active, org_fid, country_fid })
        .eq("region_id", region_id)
        .select();

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
