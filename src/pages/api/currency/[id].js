import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const currencyId = id;
  // GET method to get single records of tbl_curency
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_curency")
        .select()
        .eq("curency_id", currencyId);

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_curency
  if (method === "DELETE") {
    try {
      const { data, error } = await supabase
        .from("tbl_curency")
        .delete()
        .eq("curency_id", bankingInfoId);

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_curency
  if (method === "PUT") {
    const { currency, currency_code, is_active, updated_by } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_curency")
        .update({
          currency,
          currency_code,
          is_active,
          updated_by,
        })
        .eq("curency_id", currencyId)
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
