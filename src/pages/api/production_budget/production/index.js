import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of tbl_production_budget
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_production_budget")
        .select()
        .order("created_at", { ascending: false });
      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      //console.log(3)
      res.status(500).json(err);
    }
  }

  // POST method to insert record at tbl_production_budget
  if (method === "POST") {
    const { BudgetArray } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_production_budget")
        .insert(BudgetArray)
        .select();
      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      //console.log(err)
      res.status(500).json(err);
    }
  }
}
