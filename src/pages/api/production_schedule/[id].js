import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const prodScheduleId = id;
  // GET method to get single records of tbl_production_schedule
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_production_schedule")
        .select()
        .eq("tbl_production_schedule_id", prodScheduleId);

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_production_schedule
  if (method === "DELETE") {
    try {
      const { data, error } = await supabase
        .from("tbl_production_schedule")
        .delete()
        .eq("tbl_production_schedule_id", prodScheduleId);

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_production_schedule
  if (method === "PUT") {
    const {
      incorp_date,
      pre_prod_start_date,
      pre_prod_end_date,
      prod_start_date,
      prod_end_date,
      modified_by,
      post_prod_start_date,
      post_prod_end_date,
      production_fid,
      organization_fid,
    } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_production_schedule")
        .update({
          incorp_date,
          pre_prod_start_date,
          pre_prod_end_date,
          prod_start_date,
          prod_end_date,
          modified_by,
          post_prod_start_date,
          post_prod_end_date,
          production_fid,
          organization_fid,
        })
        .eq("tbl_production_schedule_id", prodScheduleId)
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
