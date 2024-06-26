import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of expense table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_tax_assistance")
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
    const {
      type,
      sub_type,
      province_fid,
      application_name,
      is_active,
      org_fid,
    } = req.body;

    try {
      //console.log(expense_title, expense_type_fid, expense_code);
      const { data, error } = await supabase
        .from("tbl_tax_assistance")
        .insert({
          type,
          sub_type,
          province_fid,
          application_name,
          is_active,
          org_fid,
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
