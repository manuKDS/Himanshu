import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const production_id = id;

  // UPDATE method to update single record at tbl_production table
  if (method === "PUT") {
    const {
      production,
      status,
      distributor_fid,
      genre_fid,
      incorporation_name,
      incorporation_date,
      Incorporation_in,
      province_fid,
      modified_by,
      org_fid,
    } = req.body;

    try {
      const { data, error } = await supabase
        .from("tbl_production")
        .update({
          production,
          status: (status === 1 ? true : false),
          distributor_fid,
          genre_fid,
          incorporation_name,
          incorporation_date,
          Incorporation_in,
          province_fid,
          modified_by,
          org_fid,
        })
        .eq("production_id", production_id)
        .select();

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // GET method to get single records of tbl_production table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_production")
        .select()
        .eq("production_id", production_id);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_production table
  if (method === "DELETE") {
    try {
      const { error } = await supabase
        .from("tbl_production")
        .delete()
        .eq("production_id", production_id);

      error && res.status(401).json("production not deleted!");

      res.status(200).json("production deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
