import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of tbl_production_location
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_production_location")
        .select('*,cityData:tbl_city(city,provinceData:tbl_province(province))')
        .order("created_at", { ascending: false });
      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      //console.log(3)
      res.status(500).json(err);
    }
  }

  // POST method to insert record at tbl_production_location
  if (method === "POST") {
    const {
      shooting_days,
      description,
      city_fid,
      production_fid,
      organization_fid,
      modified_by,
    } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_production_location")
        .insert({
          shooting_days,
          description,
          city_fid,
          production_fid,
          organization_fid,
          modified_by,
        })
        .select();
      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      //console.log(err)
      res.status(500).json(err);
    }
  }
}
