import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const category_id = id;
  // GET method to get single records of tbl_expense table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_expense_categories")
        .select()
        .eq("category_id", category_id);

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
        .from("tbl_expense_categories")
        .delete()
        .eq("category_id", category_id);

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_expense table
  if (method === "PUT") {
    const { category_number, category_name, category_parent } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_expense_categories")
        .update({ category_number, category_name, category_parent })
        .eq("category_id", category_id)
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
