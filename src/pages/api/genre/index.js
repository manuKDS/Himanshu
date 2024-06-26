import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of genre table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_genre")
        .select()
        .order("genre", { ascending: true });

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at genre table
  if (method === "POST") {
    const { genre, is_excluded, is_active, updated_by } = req.body;
    //console.log(genre, is_excluded, is_active, updated_by)
    try {
      const { data, error } = await supabase
        .from("tbl_genre")
        .insert({ genre, is_excluded, is_active, updated_by })
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
