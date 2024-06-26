import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of vendor table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_vendor")
        .select()
        .order("name", { ascending: true });

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at vendor table
  if (method === "POST") {
    const {
      updated_by,
      name,
      vendor_type_fid,
      city_fid,
      org_fid,
      address,
      phone,
      email,
      url,
    } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_vendor")
        .insert({
          updated_by,
          name,
          vendor_type_fid,
          city_fid,
          org_fid,
          address,
          phone,
          email,
          url,
        })
        .select();
      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
