import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of expense_nature table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_expense_nature")
        .select()
        .order("created_at", { ascending: false });
      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      //console.log(3)
      res.status(500).json(err);
    }
  }

  // POST method to insert record at expense_nature table
  if (method === "POST") {
    const { expense_nature, is_active, org_fid } = req.body;
    try {
      //console.log(expense_nature, is_active);
      const { data, error } = await supabase
        .from("tbl_expense_nature")
        .insert({ expense_nature, is_active, org_fid })
        .select();
      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      //console.log(err)
      res.status(500).json(err);
    }
  }
}
