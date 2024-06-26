import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of tax_credit_type table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_tax_credit_type")
        .select()
        .order("created_at", { ascending: false });
      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      //console.log(3)
      res.status(500).json(err);
    }
  }

  // POST method to insert record at expense table
  if (method === "POST") {
    const { app_type, province_fid, production_fid, org_fid, created_at  } = req.body;
    try {
      
      console.log(app_type, province_fid, production_fid, org_fid, created_at );

      const { data, error } = await supabase
        .from("tbl_tax_credit_type")
        .insert({
          app_type,        
          province_fid,         
          org_fid,
          production_fid,
          created_at,
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
