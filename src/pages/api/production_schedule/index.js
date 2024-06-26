import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of tbl_production_schedule
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_production_schedule")
        .select()
        .order("created_at", { ascending: false });
      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      //console.log(3)
      res.status(500).json(err);
    }
  }

  // POST method to insert record at tbl_production_schedule
  if (method === "POST") {
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
        .insert({
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
        .select();
      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      //console.log(err)
      res.status(500).json(err);
    }
  }
}
