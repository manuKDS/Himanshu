import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const bankingInfoId = id;
  // GET method to get single records of tbl_banking_information
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_banking_information")
        .select()
        .eq("banking_info_id", bankingInfoId);

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_banking_information
  if (method === "DELETE") {
    try {
      const { data, error } = await supabase
        .from("tbl_banking_information")
        .delete()
        .eq("banking_info_id", bankingInfoId);

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_banking_information
  if (method === "PUT") {
    const {
      bank_name,
      account_no,
      ifsc_code,
      account_holder_name,
      production_fid,
      organization_fid,
      modified_by,
    } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_banking_information")
        .update({
          bank_name,
          account_no,
          ifsc_code,
          account_holder_name,
          production_fid,
          modified_by,
          organization_fid,
        })
        .eq("banking_info_id", bankingInfoId)
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
