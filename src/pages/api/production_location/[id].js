import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const locationId = id;
  // GET method to get single records of tbl_production_location
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_production_location")
        .select()
        .eq("tbl_production_location_id", locationId);

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_production_location
  if (method === "DELETE") {
    try {
      const { data, error } = await supabase
        .from("tbl_production_location")
        .delete()
        .eq("tbl_production_location_id", locationId);

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_production_location
  if (method === "PUT") {
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
        .update({
          shooting_days,
          description,
          city_fid,
          production_fid,
          organization_fid,
          modified_by,
        })
        .eq("tbl_production_location_id", locationId)
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
