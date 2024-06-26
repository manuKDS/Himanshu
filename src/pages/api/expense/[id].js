import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const expense_id = id;
  // GET method to get single records of tbl_expense table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_expense")
        .select()
        .eq("expense_id", expense_id);

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_expense table
  if (method === "DELETE") {
    try {
      const { data, error } = await supabase
        .from("tbl_expense")
        .delete()
        .eq("expense_id", expense_id);

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_expense table
  if (method === "PUT") {
    const { expense_title, expense_type_fid, expense_code, org_fid, expense_category_fid } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_expense")
        .update({ expense_title, expense_type_fid, expense_code, org_fid, expense_category_fid })
        .eq("expense_id", expense_id)
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
