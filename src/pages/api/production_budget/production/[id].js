import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const production_fid = id;
  // GET method to get single records of tbl_production_budget
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_production_budget")
        .select()
        .eq("production_fid", production_fid);

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

   // DELETE method to delete single record at tbl_production_budget
   if (method === "DELETE") {
    try {
      const { data, error } = await supabase
        .from("tbl_production_budget")
        .delete()
        .eq("production_fid", production_fid);

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
