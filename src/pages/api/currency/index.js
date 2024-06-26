import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of tbl_currency
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_currency")
        .select()
        .order("created_at", { ascending: false });
      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      //console.log(3)
      res.status(500).json(err);
    }
  }

  // POST method to insert record at tbl_currency
  if (method === "POST") {
    const { currency, currency_code, is_active, updated_by } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_currency")
        .insert({
          currency,
          currency_code,
          is_active,
          updated_by,
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
