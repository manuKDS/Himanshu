import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of distributor table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_distributor")
        .select()
        .order("distributor_name", { ascending: true });

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at distributor table
  if (method === "POST") {
    const { distributor_name, is_active, address, updated_by, org_fid } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_distributor")
        .insert({ distributor_name, is_active, address, updated_by, org_fid })
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
