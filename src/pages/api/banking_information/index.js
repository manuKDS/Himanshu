import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of tbl_banking_information
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_banking_information")
        .select()
        .order("bank_name", { ascending: true });
      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      //console.log(3)
      res.status(500).json(err);
    }
  }

  // POST method to insert record at tbl_banking_information
  if (method === "POST") {
    const {
      bank_name,
      account_no,
      ifsc_code,
      account_holder_name,
      production_fid,
      organization_fid,
      modified_by,
    } = req.body;
    console.log(modified_by)
    try {
      const { data, error } = await supabase
        .from("tbl_banking_information")
        .insert({
          bank_name,
          account_no,
          ifsc_code,
          account_holder_name,
          production_fid,
          modified_by,
          organization_fid,
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
