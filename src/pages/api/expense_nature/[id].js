import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const expense_nature_id = id;
  // GET method to get single records of tbl_expense_nature table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_expense_nature")
        .select()
        .eq("expense_nature_id", expense_nature_id);

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_expense_nature table
  if (method === "DELETE") {
    try {
      const { data, error } = await supabase
        .from("tbl_expense_nature")
        .delete()
        .eq("expense_nature_id", expense_nature_id);

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_expense_nature table
  if (method === "PUT") {
    const { expense_nature, is_active, org_fid } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_expense_nature")
        .update({ expense_nature, is_active, org_fid })
        .eq("expense_nature_id", expense_nature_id)
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
