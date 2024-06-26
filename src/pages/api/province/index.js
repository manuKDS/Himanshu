import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of province table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_province")
        .select()
        .order("province", { ascending: true });

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at province table
  if (method === "POST") {
    const { province, country_fid, is_active } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_province")
        .insert({ province, country_fid, is_active })
        .select();
      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
