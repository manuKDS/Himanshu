import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const region_city_id = id;
  // GET method to get single records of tbl_region_city table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_region_city")
        .select()
        .eq("region_city_id", region_city_id);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_region_city table
  if (method === "DELETE") {
    try {
      const { error } = await supabase
        .from("tbl_region_city")
        .delete()
        .eq("region_city_id", region_city_id);

      error && res.status(401).json("region_city not deleted!");

      res.status(200).json("region_city deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_region_city table
  if (method === "PUT") {
    const { region_city, country_fid, is_active } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_region_city")
        .update({ region_city, country_fid, is_active })
        .eq("region_city_id", region_city_id)
        .select();

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
