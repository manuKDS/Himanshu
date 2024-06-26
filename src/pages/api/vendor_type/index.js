import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of vendor_type table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_vendor_type")
        .select()
        .order("vendor_type", { ascending: true });

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at vendor_type table
  if (method === "POST") {
    const { vendor_type, org_fid } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_vendor_type")
        .insert({ vendor_type, org_fid })
        .select();
      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
