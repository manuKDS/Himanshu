import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of expense table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_expense_categories")
        .select()
        .order("created_at", { ascending: true });
      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      //console.log(3)
      res.status(500).json(err);
    }
  }

  // POST method to insert record at expense table
  if (method === "POST") {
    const { category_number, category_name, category_parent } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_expense_categories")
        .insert({ category_number, category_name, category_parent,is_active:true })
        .select();
      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      //console.log(err)
      res.status(500).json(err);
    }
  }
}
