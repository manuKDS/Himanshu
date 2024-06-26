import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of region table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_region")
        .select('*,citiesOfregion:tbl_region_city(*)')
        .order("Region", { ascending: true });

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at region table
  if (method === "POST") {
    const { Region, is_active, org_fid, country_fid } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_region")
        .insert({ Region, is_active, org_fid, country_fid })
        .select();
      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
