import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const assitance_id = id;
  // GET method to get single records of tbl_expense table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_tax_assistance")
        .select()
        .eq("tax_assitance_id", assitance_id);

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_expense table
  if (method === "DELETE") {
    try {
      const { data, error } = await supabase
        .from("tbl_tax_assistance")
        .delete()
        .eq("tax_assitance_id", assitance_id);

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_expense table
  if (method === "PUT") {
    const {
      type,
      sub_type,
      province_fid,
      application_name,
      is_active,
      org_fid,
    } = req.body;

    try {
      const { data, error } = await supabase
        .from("tbl_tax_assistance")
        .update({
          type,
          sub_type,
          province_fid,
          application_name,
          is_active,
          org_fid,
        })
        .eq("tax_assitance_id", assitance_id)
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
