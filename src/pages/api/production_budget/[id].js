import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const tbl_production_budget_id = id;
  // GET method to get single records of tbl_production_budget
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_production_budget")
        .select()
        .eq("tbl_production_budget_id", tbl_production_budget_id);

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
        .eq("tbl_production_budget_id", tbl_production_budget_id);

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_production_budget
  if (method === "PUT") {
    const {
      expense_fid,
      description,
      vendor_fid,
      city_fid,
      currency_fid,
      expected_spend_time,
      amount,
      modified_by,
      production_fid,
      organization_fid,
    } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_production_budget")
        .update({
          expense_fid,
          description,
          vendor_fid,
          city_fid,
          currency_fid,
          expected_spend_time,
          amount,
          modified_by,
          production_fid,
          organization_fid,
        })
        .eq("tbl_production_budget_id", tbl_production_budget_id)
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
